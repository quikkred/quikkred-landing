'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, ArrowRight, ArrowLeft, CheckCircle, AlertCircle,
    Loader2, RotateCw, X, User
} from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import { useQuickApplyTracking, useVerificationFrictionTracking } from '@/lib/hooks/useQuickApplyTracking';

// MOCK MODE - Set to false for production with real APIs
// Set to true only for local testing without backend
const MOCK_MODE = false;

interface PostApprovalSelfieProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function PostApprovalSelfie({
    formData,
    setFormData,
    onNext,
    onBack,
}: PostApprovalSelfieProps) {
    // Tracking
    const {
        trackStepViewed,
        trackStepCompleted,
        trackSelfieCaptureStarted,
        trackSelfieCaptureSuccess,
        trackSelfieCaptureFailed,
        trackFormError,
        trackAPIError,
    } = useQuickApplyTracking();

    // Selfie verification friction tracking
    const selfieFriction = useVerificationFrictionTracking('esign'); // Using 'esign' as a proxy for selfie

    // Track step viewed on mount
    const hasTrackedStepRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(6, 'Selfie Verification');
            selfieFriction.startTracking();
        }
    }, [trackStepViewed, selfieFriction]);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(formData.selfieData?.preview || null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);

    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(formData.selfieVerified || false);
    const [verificationError, setVerificationError] = useState('');

    const [faceDetected, setFaceDetected] = useState(false);
    const [detectionMessage, setDetectionMessage] = useState('Position your face in the frame');

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (!isStreaming || !videoRef.current) return;

        const detectInterval = setInterval(() => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (ctx && videoRef.current) {
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    ctx.drawImage(videoRef.current, 0, 0);

                    const imageData = ctx.getImageData(
                        canvas.width / 4,
                        canvas.height / 4,
                        canvas.width / 2,
                        canvas.height / 2
                    );

                    let brightness = 0;
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        brightness += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                    }
                    brightness = brightness / (imageData.data.length / 4);

                    if (brightness > 50 && brightness < 200) {
                        setFaceDetected(true);
                        setDetectionMessage('Face detected! Click capture');
                    } else if (brightness <= 50) {
                        setFaceDetected(false);
                        setDetectionMessage('Too dark - improve lighting');
                    } else {
                        setFaceDetected(false);
                        setDetectionMessage('Position your face in the frame');
                    }
                }
            }
        }, 500);

        return () => clearInterval(detectInterval);
    }, [isStreaming]);

    const startCamera = async () => {
        try {
            setVerificationError('');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            setVerificationError('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    };

    const openCamera = () => {
        setCameraOpen(true);
        setCapturedImage(null);
        setCapturedFile(null);
        setVerified(false);
        setVerificationError('');
        setTimeout(() => startCamera(), 100);
    };

    const closeCamera = () => {
        stopCamera();
        setCameraOpen(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageUrl);
                const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
                setCapturedFile(file);
                stopCamera();
            }
        }, 'image/jpeg', 0.9);
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setCapturedFile(null);
        setVerified(false);
        setVerificationError('');
        startCamera();
    };

    const verifyAndSubmit = async () => {
        if (!capturedFile && !MOCK_MODE) {
            const errorMsg = 'Please capture a selfie first';
            setVerificationError(errorMsg);
            trackFormError('selfie', errorMsg, 6);
            return;
        }

        setIsVerifying(true);
        setVerificationError('');
        trackSelfieCaptureStarted();
        selfieFriction.recordAttempt();

        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setVerified(true);

            setFormData((prev: any) => ({
                ...prev,
                selfieVerified: true,
                selfieData: {
                    preview: capturedImage || '',
                    verified: true,
                },
            }));

            // Track success
            trackSelfieCaptureSuccess();
            selfieFriction.completeTracking(true);
            trackStepCompleted(6, 'Selfie Verification');

            console.log('✅ MOCK: Selfie verified');
            setTimeout(() => {
                setCameraOpen(false);
                onNext();
            }, 1000);
            setIsVerifying(false);
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');

            const formDataUpload = new FormData();
            formDataUpload.append('photo', capturedFile!);

            const response = await fetch(`${API_BASE_URL}/api/kyc/face/verification`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataUpload,
            });

            const data = await response.json();

            if (data.success && data.data?.livenessStatus) {
                setVerified(true);

                setFormData((prev: any) => ({
                    ...prev,
                    selfieVerified: true,
                    selfieData: {
                        preview: capturedImage || '',
                        verified: true,
                    },
                }));

                // Track success
                trackSelfieCaptureSuccess();
                selfieFriction.completeTracking(true);
                trackStepCompleted(6, 'Selfie Verification');

                setTimeout(() => {
                    setCameraOpen(false);
                    onNext();
                }, 1000);
            } else {
                const errorMsg = data.message || 'Face liveness verification failed. Please try again with better lighting.';
                setVerificationError(errorMsg);
                trackSelfieCaptureFailed(errorMsg, selfieFriction.getAttempts());
            }
        } catch (error) {
            console.error('Selfie verification error:', error);
            const errorMsg = 'Verification failed. Please try again.';
            setVerificationError(errorMsg);
            trackAPIError('/api/kyc/face/verification', errorMsg);
            trackSelfieCaptureFailed(errorMsg, selfieFriction.getAttempts());
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Selfie Verification</h2>

            {/* Selfie Section */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25B181]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Take a Selfie</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">For face liveness verification</p>
                    </div>
                </div>

                {/* Already Captured Preview */}
                {capturedImage && !cameraOpen && (
                    <div className="relative bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden aspect-video mb-3 sm:mb-4">
                        <img
                            src={capturedImage}
                            alt="Captured selfie"
                            className="w-full h-full object-cover"
                            style={{ transform: 'scaleX(-1)' }}
                        />
                        {verified && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="bg-[#25B181] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-medium">Verified</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Capture Button - When No Selfie */}
                {!capturedImage && !cameraOpen && (
                    <div className="text-center py-4 sm:py-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#25B181]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#25B181]" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                            Take a clear photo of your face for identity verification
                        </p>
                        <button
                            onClick={openCamera}
                            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                        >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                            Open Camera & Capture Selfie
                        </button>
                    </div>
                )}

                {/* Already Verified */}
                {verified && capturedImage && !cameraOpen && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center gap-2 text-green-700 text-xs sm:text-sm">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-medium">Selfie verified successfully!</span>
                        </div>
                    </div>
                )}

                {/* Not Yet Verified */}
                {capturedImage && !verified && !cameraOpen && (
                    <>
                        {verificationError && (
                            <div className="bg-red-50 rounded-lg p-3 border border-red-200 mb-3">
                                <div className="flex items-start gap-1.5 text-red-700 text-xs">
                                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>{verificationError}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={openCamera}
                                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border border-[#25B181] text-[#25B181] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#25B181]/5 flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] touch-manipulation"
                            >
                                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                                Retake
                            </button>
                            <button
                                onClick={verifyAndSubmit}
                                disabled={isVerifying}
                                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-[#25B181] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#1d8f6a] flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                            >
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Verify Photo</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}

                {/* Tips */}
                {!verified && (
                    <div className="mt-3 sm:mt-4 bg-[#25B181]/10 rounded-lg p-2.5 sm:p-3">
                        <p className="text-[10px] sm:text-xs text-gray-700 font-medium mb-1.5 sm:mb-2">Tips for a clear photo:</p>
                        <ul className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1">
                            <li>• Good lighting on your face</li>
                            <li>• Look directly at camera</li>
                            <li>• Remove glasses if possible</li>
                            <li>• Neutral expression</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
                <button
                    onClick={onBack}
                    disabled={isVerifying}
                    className="px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                {verified && (
                    <button
                        onClick={onNext}
                        className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                    >
                        Complete KYC
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                )}
            </div>

            {/* Progress Note */}
            <p className="text-center text-[10px] sm:text-xs text-gray-500">
                Step 3 of 3: Bank → Aadhaar → <span className="font-medium text-[#25B181]">Selfie</span>
            </p>

            {/* Camera Modal */}
            <AnimatePresence>
                {cameraOpen && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-start sm:items-center justify-center overflow-y-auto py-4 px-2 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-xl sm:rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-auto sm:my-0"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] p-3 sm:p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <h2 className="text-base sm:text-lg font-bold">Capture Selfie</h2>
                                </div>
                                <button
                                    onClick={closeCamera}
                                    className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 active:scale-[0.95] touch-manipulation"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Camera View */}
                            <div className="p-3 sm:p-4">
                                <div className="relative bg-black rounded-lg sm:rounded-xl overflow-hidden aspect-[3/4] sm:aspect-video mb-3 sm:mb-4">
                                    {!capturedImage ? (
                                        <>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                                style={{ transform: 'scaleX(-1)' }}
                                            />

                                            {isStreaming && (
                                                <div className="absolute inset-0 pointer-events-none">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-52 sm:w-48 sm:h-64 border-2 sm:border-4 border-white/50 rounded-[50%]">
                                                        <div className={`absolute -top-6 sm:top-2 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${faceDetected ? 'bg-[#25B181]' : 'bg-yellow-500'
                                                            } text-white text-[10px] sm:text-xs font-medium whitespace-nowrap`}>
                                                            {detectionMessage}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={capturedImage}
                                                alt="Captured"
                                                className="w-full h-full object-cover"
                                                style={{ transform: 'scaleX(-1)' }}
                                            />
                                            {isVerifying && (
                                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                                    {verified ? (
                                                        <>
                                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#25B181] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                                                <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                                                            </div>
                                                            <p className="text-white text-sm sm:text-lg font-semibold">Face Verified!</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin mb-3 sm:mb-4" />
                                                            <p className="text-white text-sm sm:text-lg font-semibold">Verifying face...</p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <canvas ref={canvasRef} className="hidden" />

                                {verificationError && (
                                    <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3">
                                        <div className="flex items-start gap-1.5 text-red-700 text-xs">
                                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                            <span>{verificationError}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 sm:gap-3">
                                    {!capturedImage ? (
                                        <>
                                            <button
                                                onClick={closeCamera}
                                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium text-sm hover:bg-gray-50 active:scale-[0.98] touch-manipulation"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={capturePhoto}
                                                disabled={!isStreaming}
                                                className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] touch-manipulation ${faceDetected
                                                        ? 'bg-[#25B181] text-white hover:bg-[#1d8f6a]'
                                                        : 'bg-[#51C9AF] text-white hover:bg-[#25B181]'
                                                    } disabled:opacity-50`}
                                            >
                                                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Capture
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={retakePhoto}
                                                disabled={isVerifying}
                                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium text-sm hover:bg-gray-50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                                            >
                                                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Retake
                                            </button>
                                            <button
                                                onClick={verifyAndSubmit}
                                                disabled={isVerifying || verified}
                                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#25B181] text-white rounded-lg sm:rounded-xl font-semibold text-sm hover:bg-[#1d8f6a] flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                                            >
                                                {isVerifying ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                        <span>Verifying...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        <span>Verify & Use</span>
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
