'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, ArrowRight, ArrowLeft, CheckCircle,
    User, X, ScanFace, ShieldCheck
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { useQuickApplyTracking, useVerificationFrictionTracking } from '@/lib/hooks/useQuickApplyTracking';

// Dynamically import FaceLivenessDetector to avoid SSR issues
const FaceLiveness = dynamic(() => import('@/components/camera/FaceLivenessDetector'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-10 h-10 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-600 font-medium text-sm">Loading face verification...</p>
        </div>
    ),
});

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
    const {
        trackStepViewed,
        trackStepCompleted,
        trackSelfieCaptureStarted,
        trackSelfieCaptureSuccess,
        trackSelfieCaptureFailed,
    } = useQuickApplyTracking();

    const selfieFriction = useVerificationFrictionTracking('esign');

    const hasTrackedStepRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(6, 'Selfie Verification');
            selfieFriction.startTracking();
        }
    }, [trackStepViewed, selfieFriction]);

    const [livenessOpen, setLivenessOpen] = useState(false);
    const [verified, setVerified] = useState(formData.selfieVerified || false);

    const openLiveness = () => {
        setLivenessOpen(true);
        trackSelfieCaptureStarted();
        selfieFriction.recordAttempt();
    };

    const closeLiveness = () => {
        setLivenessOpen(false);
    };

    const handleSuccess = useCallback(() => {
        setVerified(true);
        setLivenessOpen(false);

        setFormData((prev: any) => ({
            ...prev,
            selfieVerified: true,
            selfieData: {
                preview: '',
                verified: true,
            },
        }));

        trackSelfieCaptureSuccess();
        selfieFriction.completeTracking(true);
        trackStepCompleted(6, 'Selfie Verification');

        setTimeout(() => {
            onNext();
        }, 1500);
    }, [setFormData, onNext, trackSelfieCaptureSuccess, selfieFriction, trackStepCompleted]);

    const handleError = useCallback((error: string) => {
        console.error('Face liveness error:', error);
        trackSelfieCaptureFailed(error, selfieFriction.getAttempts());
    }, [trackSelfieCaptureFailed, selfieFriction]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Face Verification</h2>

            {/* Main Card */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#25B181]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <ScanFace className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Face Liveness Check</h3>
                        <p className="text-[11px] sm:text-xs text-gray-500">Verify your identity with a quick face scan</p>
                    </div>
                </div>

                {/* Already Verified */}
                {verified && !livenessOpen && (
                    <div className="text-center py-6 sm:py-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600" />
                        </div>
                        <p className="text-emerald-700 font-semibold text-base sm:text-lg mb-1">Face Verified!</p>
                        <p className="text-gray-500 text-xs sm:text-sm mb-3">Liveness check passed successfully</p>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 rounded-full px-3 py-1.5 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs text-emerald-700 font-medium">Verified via AWS Rekognition</span>
                        </div>
                    </div>
                )}

                {/* Start Verification Button */}
                {!verified && !livenessOpen && (
                    <div className="text-center py-4 sm:py-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#25B181]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#25B181]" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1.5">
                            Quick face scan to verify your identity
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-400 mb-4 sm:mb-5">
                            Takes only 3-5 seconds with good lighting
                        </p>
                        <button
                            onClick={openLiveness}
                            className="w-full min-h-[48px] py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold text-sm sm:text-base shadow-md shadow-[#25B181]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                        >
                            <Camera className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                            Start Face Verification
                        </button>
                    </div>
                )}

                {/* Tips — compact grid */}
                {!verified && !livenessOpen && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {[
                            { text: "Good lighting" },
                            { text: "Look at camera" },
                            { text: "Remove glasses" },
                            { text: "Hold steady" },
                        ].map((tip) => (
                            <div key={tip.text} className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-2 border border-gray-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#25B181] flex-shrink-0" />
                                <span className="text-[11px] sm:text-xs text-gray-600">{tip.text}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 sm:gap-3">
                <button
                    onClick={onBack}
                    disabled={livenessOpen}
                    className="min-h-[48px] px-3.5 sm:px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                {verified && (
                    <button
                        onClick={onNext}
                        className="flex-1 min-h-[48px] py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-[#25B181]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                    >
                        Complete KYC
                        <ArrowRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                )}
            </div>

            {/* Progress Note */}
            <p className="text-center text-[11px] sm:text-xs text-gray-400 pb-1">
                Step 3 of 3: Bank → Aadhaar → <span className="font-medium text-[#25B181]">Face Verification</span>
            </p>

            {/* Liveness Modal — full-screen on mobile */}
            <AnimatePresence>
                {livenessOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/85"
                            onClick={closeLiveness}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.98 }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[90vh] sm:my-4"
                            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] to-[#51C9AF] flex-shrink-0">
                                <div className="flex items-center gap-2.5 text-white">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <ScanFace className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold leading-tight">Face Verification</h2>
                                        <p className="text-[10px] sm:text-xs text-white/80">3D liveness check</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeLiveness}
                                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-white hover:bg-white/20 rounded-full active:scale-95 touch-manipulation"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto overscroll-contain">
                                <div className="p-3 sm:p-4">
                                    <div className="mb-3 bg-blue-50/80 border border-blue-100 rounded-lg px-3 py-2 sm:py-2.5">
                                        <p className="text-[11px] sm:text-xs text-blue-700 leading-relaxed">
                                            Position your face in the oval and hold still. A colored light will flash briefly.
                                        </p>
                                    </div>
                                    <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 bg-black">
                                        <FaceLiveness
                                            onSuccess={handleSuccess}
                                            onError={handleError}
                                            onCancel={closeLiveness}
                                            customerId={formData.customerId}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
