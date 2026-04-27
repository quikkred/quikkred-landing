"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RotateCw, CheckCircle2, ScanFace, Loader2, AlertTriangle, ShieldCheck, Check, AlertCircle } from "lucide-react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { createPortal } from "react-dom";

// Standard Hooks & Utils
import useAxios from "@/hooks/useAxios";
import getToken from "@/lib/getToken";
import tracking from "@/lib/tracking";
import { TRACKING_EVENTS } from "@/lib/constants/quickApplyV2";
import { AxiosError } from "axios";

// --- GLOBAL AI ENGINE (Singleton) ---
let globalVision: any = null;
let globalDetector: FaceDetector | null = null;
let isEngineInitializing = false;

const MODEL_ASSET_PATH = "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";
// Pin WASM to the installed @mediapipe/tasks-vision version. Using @latest causes
// silent init failures when jsdelivr resolves a build newer than the JS package.
const WASM_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";

const createDetector = (vision: any, delegate: "GPU" | "CPU") =>
    FaceDetector.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_ASSET_PATH, delegate },
        runningMode: "VIDEO",
        minDetectionConfidence: 0.6,
    });

// MediaPipe sometimes throws raw DOM Events (script/network errors) instead of Errors.
// Extract whatever useful info we can so console logs aren't just "[object Event]".
const describeError = (e: any): string => {
    if (e instanceof Event) {
        const t: any = e.target;
        const src = t?.src || t?.href || t?.responseURL;
        return `DOM ${e.type} event${src ? ` (resource: ${src})` : ""}`;
    }
    if (e instanceof Error) return e.message;
    if (e && typeof e === "object") {
        try { return JSON.stringify(e); } catch { return String(e); }
    }
    return String(e);
};

export const preloadFaceDetector = async (): Promise<FaceDetector | null> => {
    if (globalDetector) return globalDetector;
    if (isEngineInitializing) {
        // Wait for the in-flight init to finish instead of racing it.
        while (isEngineInitializing) await new Promise(r => setTimeout(r, 50));
        return globalDetector;
    }
    isEngineInitializing = true;
    try {
        // Step 1: load WASM runtime
        try {
            globalVision = await FilesetResolver.forVisionTasks(WASM_PATH);
        } catch (e) {
            console.error("[FaceDetector] WASM runtime load failed:", describeError(e), e);
            throw e;
        }

        // Step 2: build detector — try GPU first, fall back to CPU.
        try {
            globalDetector = await createDetector(globalVision, "GPU");
        } catch (gpuErr) {
            console.warn("[FaceDetector] GPU delegate failed, retrying with CPU:", describeError(gpuErr));
            try {
                globalDetector = await createDetector(globalVision, "CPU");
            } catch (cpuErr) {
                console.error("[FaceDetector] CPU delegate also failed (likely model fetch):", describeError(cpuErr), cpuErr);
                throw cpuErr;
            }
        }
        return globalDetector;
    } catch (e) {
        // Already logged at the specific step above; this is just the outer handler.
        return null;
    } finally {
        isEngineInitializing = false;
    }
};

interface SelfieVerifyModalProps {
    isOpen: boolean;
    apiType?: "verify" | "verification";
    onClose: () => void;
    onCapture: (file: File) => void;
}

export default function AdvancedFaceCam({ isOpen, apiType = "verification", onClose, onCapture }: SelfieVerifyModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const requestRef = useRef<number | null>(null);
    const isActiveRef = useRef(false);
    const axios = useAxios();

    const [isModelReady, setIsModelReady] = useState(!!globalDetector);
    const [modelLoadFailed, setModelLoadFailed] = useState(false);
    const [feedback, setFeedback] = useState<string>("Please wait, camera is getting ready...");
    const [faceQuality, setFaceQuality] = useState<number>(0);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
    // true = browser-level block (need address-bar fix); false = just needs to ask
    const [permissionBlocked, setPermissionBlocked] = useState(false);

    // Status message for inline Red/Green alerts above buttons
    const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success' | null, text: string }>({ type: null, text: "" });

    useEffect(() => {
        if (!isOpen) {
            isActiveRef.current = false;
            stopCamera();
            return;
        }

        document.body.style.overflow = "hidden";
        isActiveRef.current = true;
        setCameraPermissionDenied(false);
        setModelLoadFailed(false);
        setStatusMsg({ type: null, text: "" });

        runEngine();

        return () => {
            document.body.style.overflow = "unset";
            isActiveRef.current = false;
            stopCamera();
        };
    }, [isOpen]);

    const queryCameraPermission = async (): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> => {
        try {
            if (!navigator.permissions?.query) return 'unknown';
            const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
            return result.state as 'granted' | 'denied' | 'prompt';
        } catch {
            return 'unknown';
        }
    };

    const runEngine = async () => {
        setModelLoadFailed(false);
        const detector = globalDetector ?? await preloadFaceDetector();
        if (!isActiveRef.current) return;
        if (!detector) {
            setModelLoadFailed(true);
            return;
        }
        setIsModelReady(true);
        startCamera();
    };

    const startCamera = async () => {
        setCameraPermissionDenied(false);
        setPermissionBlocked(false);
        setStatusMsg({ type: null, text: "" });

        try {
            // Always attempt getUserMedia — this is the only way to trigger the
            // browser's permission prompt.  If the user previously denied access,
            // some browsers (Chrome) will reject instantly without a prompt, while
            // others (Firefox) will re-prompt.  Either way we handle the error below.
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
            });
            if (videoRef.current && isActiveRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraPermissionDenied(false);
                videoRef.current.onloadeddata = () => {
                    if (isActiveRef.current) {
                        requestRef.current = requestAnimationFrame(predictLoop);
                    }
                };
            } else {
                // If it became inactive while waiting for stream
                stream.getTracks().forEach(t => t.stop());
            }
        } catch (err: any) {
            if (!isActiveRef.current) return;
            setCameraPermissionDenied(true);

            if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
                // Distinguish: did the user permanently block, or just dismiss the prompt?
                const state = await queryCameraPermission();
                setPermissionBlocked(state === 'denied');
                setStatusMsg({ type: null, text: "" });
            } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
                setPermissionBlocked(false);
                setStatusMsg({ type: 'error', text: "No camera found. Please connect a camera and try again." });
            } else {
                setPermissionBlocked(false);
                setStatusMsg({ type: 'error', text: "Unable to access camera. Please check your browser permissions and try again." });
            }
        }
    };

    // FIXED: TypeScript recursion error fix using explicit function declaration
    function predictLoop() {
        if (!isActiveRef.current || !videoRef.current || !globalDetector || capturedImage) {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
            return;
        }

        if (videoRef.current.readyState !== 4) {
            requestRef.current = requestAnimationFrame(predictLoop);
            return;
        }

        try {
            const detections = globalDetector.detectForVideo(videoRef.current, performance.now()).detections;

            if (detections.length === 0) {
                setFeedback("Show your full face in the frame");
                setFaceQuality(0);
            } else if (detections.length > 1) {
                setFeedback("Only one face should be visible");
                setFaceQuality(0);
            } else {
                const box = detections[0].boundingBox;
                if (box) {
                    const faceSize = box.width / videoRef.current.videoWidth;
                    const centerX = (box.originX + box.width / 2) / videoRef.current.videoWidth;

                    if (faceSize < 0.26) {
                        setFeedback("Move your face a little closer");
                        setFaceQuality(30);
                    } else if (Math.abs(centerX - 0.5) > 0.12) {
                        setFeedback("Keep your face in the center");
                        setFaceQuality(60);
                    } else {
                        setFeedback("Great! Hold still and capture");
                        setFaceQuality(100);
                    }
                }
            }
        } catch (e) { /* silent frame drop */ }

        if (isActiveRef.current && !capturedImage) {
            requestRef.current = requestAnimationFrame(predictLoop);
        }
    }

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        if (ctx) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
            setCapturedImage(dataUrl);
            
            // ✅ Stop camera immediately after capture so the light turns off
            stopCamera();
        }
    };

    const resetToCamera = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleConfirm = async () => {
        if (!capturedImage || !canvasRef.current) return;
        setIsProcessing(true);
        setStatusMsg({ type: null, text: "" });

        try {
            const token = await getToken();
            if (!token) {
                setStatusMsg({ type: 'error', text: "Session expired. Please login again." });
                return;
            }

            const blob = await new Promise<Blob | null>((resolve) =>
                canvasRef.current?.toBlob((b) => resolve(b), "image/jpeg", 0.95)
            );
            if (!blob) throw new Error("Image error");
            const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });

            const formData = new FormData();
            formData.append('photo', file);

            // const response = await axios.postForm(`/api/v2/face/verification`, formData);
            // const response = await axios.postForm(`/api/kyc/face/rekognition/verify`, formData);
            const response = await axios.postForm(apiType === "verification" ? `/api/kyc/face/verification`: `/api/kyc/face/rekognition/verify`, formData);

            if (response.data?.success && (response.status === 200 || response.status === 201)) {
                setStatusMsg({ type: 'success', text: "Identity Verified Successfully!" });
                tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.SELFIE_CAPTURED });

                onCapture(file);
                setStatusMsg({ type: null, text: "" });
                onClose();
            } else {
                setStatusMsg({ type: 'error', text: response.data?.error || response.data?.message || "Verification failed." });
                resetToCamera();
            }
        } catch (err: any) {
            if (err instanceof AxiosError) {
                console.log("API Error:", err);
                setStatusMsg({ type: 'error', text: err?.response?.data?.error || err?.response?.data?.message || "Server error. Please try again." });
                resetToCamera();
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col h-[80vh] max-h-[680px]">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-base font-semibold text-slate-900">Identity Verification</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Camera Area */}
                <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col items-center justify-center">
                    {cameraPermissionDenied ? (
                        permissionBlocked ? (
                            <div className="flex flex-col items-center gap-4 px-6 text-center">
                                <div className="p-4 bg-red-50 rounded-full">
                                    <Camera className="w-10 h-10 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-slate-800 mb-2">Camera Access Blocked</p>
                                    <p className="text-sm text-slate-500 mb-3">
                                        Camera permission is blocked for this site. To enable it:
                                    </p>
                                    <ol className="text-xs text-slate-500 text-left space-y-1.5 max-w-[280px] mx-auto">
                                        <li><span className="font-semibold text-slate-700">1.</span> Click the <span className="font-semibold text-slate-700">lock / camera icon</span> in your browser&apos;s address bar</li>
                                        <li><span className="font-semibold text-slate-700">2.</span> Set <span className="font-semibold text-slate-700">Camera</span> to <span className="font-semibold text-emerald-600">Allow</span></li>
                                        <li><span className="font-semibold text-slate-700">3.</span> Tap <span className="font-semibold text-slate-700">&quot;Try Again&quot;</span> below</li>
                                    </ol>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={startCamera}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all text-sm flex items-center gap-2"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 px-6 text-center">
                                <div className="p-4 bg-indigo-50 rounded-full">
                                    <Camera className="w-10 h-10 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-slate-800 mb-2">Camera Access Needed</p>
                                    <p className="text-sm text-slate-500 max-w-[300px] mx-auto">
                                        We need your camera to verify your identity with a quick selfie. Tap the button below and choose <span className="font-semibold text-slate-700">Allow</span> when your browser asks.
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={startCamera}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all text-sm flex items-center gap-2"
                                    >
                                        <Camera className="w-4 h-4" />
                                        Allow Camera Access
                                    </button>
                                </div>
                            </div>
                        )
                    ) : modelLoadFailed ? (
                        <div className="flex flex-col items-center gap-4 px-6 text-center">
                            <div className="p-4 bg-amber-50 rounded-full">
                                <AlertTriangle className="w-10 h-10 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-slate-800 mb-2">Face Verification Unavailable</p>
                                <p className="text-sm text-slate-500 max-w-[300px] mx-auto">
                                    We couldn&apos;t load the face-detection engine. Check your internet connection and try again.
                                </p>
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={runEngine}
                                    className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all text-sm flex items-center gap-2"
                                >
                                    <RotateCw className="w-4 h-4" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : !isModelReady ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            <p className="text-sm font-medium text-slate-500">Preparing face verification...</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            {!capturedImage ? (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />

                                    {/* HUD Brackets */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className={`relative w-[75%] h-[75%] transition-all duration-700 ${faceQuality === 100 ? 'scale-105' : 'scale-100'}`}>
                                            <div className={`absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-3xl transition-colors ${faceQuality === 100 ? 'border-emerald-500' : faceQuality > 0 ? 'border-amber-400' : 'border-white/40'}`} />
                                            <div className={`absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 rounded-tr-3xl transition-colors ${faceQuality === 100 ? 'border-emerald-500' : faceQuality > 0 ? 'border-amber-400' : 'border-white/40'}`} />
                                            <div className={`absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 rounded-bl-3xl transition-colors ${faceQuality === 100 ? 'border-emerald-500' : faceQuality > 0 ? 'border-amber-400' : 'border-white/40'}`} />
                                            <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-3xl transition-colors ${faceQuality === 100 ? 'border-emerald-500' : faceQuality > 0 ? 'border-amber-400' : 'border-white/40'}`} />
                                        </div>
                                    </div>

                                    {/* Top Feedback Badge */}
                                    <div className="absolute top-6 left-0 right-0 flex justify-center">
                                        <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold shadow-xl border backdrop-blur-md transition-all ${faceQuality === 100 ? "bg-emerald-500 text-white border-emerald-400" : "bg-slate-900/80 text-white border-slate-700"
                                            }`}>
                                            {feedback.toUpperCase()}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="relative w-full h-full p-4 bg-slate-900">
                                    <img src={capturedImage} className="w-full h-full object-contain rounded-xl shadow-2xl border border-slate-700" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls — hidden while an in-camera error panel owns the UI */}
                {!cameraPermissionDenied && !modelLoadFailed && (
                <div className="px-6 py-5 bg-white border-t border-slate-100">

                    {/* Status Message (Red/Green) - Replaces messy Toasts */}
                    {statusMsg.text && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <p className="text-xs font-semibold">{statusMsg.text}</p>
                        </div>
                    )}

                    {!capturedImage && (
                        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-[11px] font-semibold text-slate-700">For a clear selfie:</p>
                            <p className="text-[11px] text-slate-600">Keep your face close and centered.</p>
                            <p className="text-[11px] text-slate-600">Use good lighting and look straight at the camera.</p>
                            <p className="text-[11px] text-slate-600">Make sure only your face is visible.</p>
                        </div>
                    )}

                    {!capturedImage ? (
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={capturePhoto}
                                disabled={!isModelReady || faceQuality < 80}
                                className={`flex-[2] py-3 px-4 rounded-xl font-semibold text-white transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 text-sm ${faceQuality >= 80 ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                <Camera className="w-4 h-4" />
                                Take Selfie
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setCapturedImage(null); setStatusMsg({ type: null, text: "" }); startCamera(); }}
                                disabled={isProcessing}
                                className="flex-1 py-3 px-4 border border-slate-200 bg-white text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm active:scale-95 disabled:opacity-50"
                            >
                                <RotateCw className="w-4 h-4" />
                                Retake
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className="flex-[2] py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-sm active:scale-95 disabled:opacity-70"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                {isProcessing ? "Verifying..." : "Verify Identity"}
                            </button>
                        </div>
                    )}
                </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <style jsx global>{`
                @keyframes scan { 0% { top: 0%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                .animate-scan { animation: scan 4s ease-in-out infinite; }
            `}</style>
        </div>,
        document.body
    );
}