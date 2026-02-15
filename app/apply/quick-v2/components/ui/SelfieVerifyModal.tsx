"use client";

import { useState, useCallback } from "react";
import { X, ScanFace, CheckCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import FaceLivenessDetector to avoid SSR issues with AWS Amplify
const FaceLiveness = dynamic(() => import("@/components/camera/FaceLivenessDetector"), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-600 font-medium text-sm">Loading face verification...</p>
        </div>
    ),
});

interface SelfieCaptureProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (imageFile: File) => void;
    customerId?: string;
}

/**
 * Generate a placeholder selfie file after AWS Liveness verification.
 * The actual reference image is saved server-side by the backend.
 */
function generateVerifiedPlaceholder(): File {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(200, 200, 50, 200, 200, 200);
    gradient.addColorStop(0, "#10b981");
    gradient.addColorStop(1, "#059669");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(200, 200, 200, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(120, 210);
    ctx.lineTo(180, 270);
    ctx.lineTo(290, 140);
    ctx.stroke();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], `selfie-verified-${Date.now()}.jpg`, {
        type: "image/jpeg",
    });
}

export default function SelfieVerifyModal({ isOpen, onClose, onCapture, customerId }: SelfieCaptureProps) {
    const [verified, setVerified] = useState(false);

    const handleSuccess = useCallback(() => {
        setVerified(true);
        const placeholderFile = generateVerifiedPlaceholder();

        setTimeout(() => {
            onCapture(placeholderFile);
            handleClose();
        }, 1200);
    }, [onCapture]);

    const handleError = useCallback((error: string) => {
        console.error("Face liveness error:", error);
    }, []);

    const handleClose = useCallback(() => {
        setVerified(false);
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {/* Full-screen overlay */}
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
                    onClick={handleClose}
                />

                {/* Modal — slides up from bottom on mobile, centered on desktop */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.98 }}
                    transition={{ type: "spring", damping: 28, stiffness: 300 }}
                    className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[90vh] sm:my-4"
                    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 sm:py-3.5 flex items-center justify-between border-b border-gray-100 bg-white z-10 flex-shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                                <ScanFace className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Face Verification</h2>
                                <p className="text-[10px] sm:text-xs text-gray-500">Quick 3D liveness check</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-95 touch-manipulation"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content — scrollable */}
                    <div className="flex-1 overflow-y-auto overscroll-contain bg-gray-50">
                        {verified ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 sm:py-16 px-4"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-600" />
                                </div>
                                <p className="text-emerald-700 font-bold text-lg sm:text-xl mb-1">Face Verified!</p>
                                <p className="text-gray-500 text-xs sm:text-sm">Liveness check passed</p>
                                <div className="mt-4 flex items-center gap-1.5 text-emerald-600">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-xs font-medium">Secured by AWS Rekognition</span>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="p-3 sm:p-4">
                                <div className="mb-3 bg-blue-50/80 border border-blue-100 rounded-lg px-3 py-2 sm:py-2.5">
                                    <p className="text-[11px] sm:text-xs text-blue-700 leading-relaxed">
                                        Position your face in the oval guide and hold still. A colored light will flash briefly.
                                    </p>
                                </div>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 bg-black">
                                    <FaceLiveness
                                        onSuccess={handleSuccess}
                                        onError={handleError}
                                        onCancel={handleClose}
                                        customerId={customerId}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
