'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, ArrowRight, ArrowLeft, CheckCircle, AlertCircle,
    User, X
} from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { useQuickApplyTracking, useVerificationFrictionTracking } from '@/lib/hooks/useQuickApplyTracking';

// AWS Face Liveness Component
import FaceLiveness from '@/components/camera/FaceLivenessDetector';
import { configureAmplify } from '@/lib/aws-amplify-config';

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
    } = useQuickApplyTracking();

    // Selfie verification friction tracking
    const selfieFriction = useVerificationFrictionTracking('esign');

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
    const [initialized, setInitialized] = useState(false);
    const [verified, setVerified] = useState(formData.selfieVerified || false);
    const [capturedImage, setCapturedImage] = useState<string | null>(formData.selfieData?.preview || null);

    // Configure AWS Amplify when camera opens
    useEffect(() => {
        if (cameraOpen && !initialized) {
            const identityPoolId = process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID;
            const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1';

            if (identityPoolId) {
                try {
                    configureAmplify(identityPoolId, region);
                    setInitialized(true);
                    console.log('✅ AWS Amplify configured for Face Liveness');
                } catch (error) {
                    console.error('❌ Error configuring AWS Amplify:', error);
                }
            } else {
                console.warn('⚠️ AWS_IDENTITY_POOL_ID not configured.');
            }
        }
    }, [cameraOpen, initialized]);

    const openCamera = () => {
        setCameraOpen(true);
        trackSelfieCaptureStarted();
        selfieFriction.recordAttempt();
    };

    const closeCamera = () => {
        setCameraOpen(false);
    };

    const handleSuccess = async (result: any) => {
        console.log('✅ Face liveness verified:', result);

        // If backend returns photo URL, convert it to preview
        let previewUrl = capturedImage;
        if (result.photoUrl) {
            try {
                const response = await fetch(result.photoUrl);
                const blob = await response.blob();
                const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

                // Create preview URL
                previewUrl = URL.createObjectURL(blob);
                setCapturedImage(previewUrl);
            } catch (error) {
                console.error('Error processing photo URL:', error);
            }
        }

        setVerified(true);
        setFormData((prev: any) => ({
            ...prev,
            selfieVerified: true,
            selfieData: {
                preview: previewUrl || '',
                verified: true,
            },
        }));

        // Track success
        trackSelfieCaptureSuccess();
        selfieFriction.completeTracking(true);
        trackStepCompleted(6, 'Selfie Verification');

        // Close camera and proceed
        setTimeout(() => {
            setCameraOpen(false);
            onNext();
        }, 1000);
    };

    const handleError = (error: string) => {
        console.error('❌ Face liveness failed:', error);
        trackSelfieCaptureFailed(error, selfieFriction.getAttempts());
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
                        <p className="text-[10px] sm:text-xs text-gray-500">Live face verification with AWS Rekognition</p>
                    </div>
                </div>

                {/* Already Captured Preview */}
                {capturedImage && !cameraOpen && (
                    <div className="relative bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden aspect-video mb-3 sm:mb-4">
                        <img
                            src={capturedImage}
                            alt="Captured selfie"
                            className="w-full h-full object-cover"
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
                            Start Face Verification
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
                    className="px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 active:scale-[0.98] touch-manipulation"
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
                            className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto sm:my-0"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] p-3 sm:p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold">Face Verification</h2>
                                        <p className="text-xs text-white/80">AWS Rekognition Liveness Check</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeCamera}
                                    className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 active:scale-[0.95] touch-manipulation"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Face Liveness Content */}
                            <div className="p-3 sm:p-6">
                                <FaceLiveness
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                    onClose={closeCamera}
                                />
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>🔒 Secure & Encrypted</span>
                                    <span>Powered by AWS Rekognition</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
