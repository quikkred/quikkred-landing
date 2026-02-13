"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

// AWS Face Liveness Component
import FaceLiveness from "@/components/camera/FaceLivenessDetector";
import { configureAmplify } from "@/lib/aws-amplify-config";

// Standard Hooks & Utils
import tracking from "@/lib/tracking";
import { TRACKING_EVENTS } from "@/lib/constants/quickApplyV2";
import { toast } from "@/components/ui/toast";

interface SelfieVerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
}

export default function SelfieVerifyModal({ isOpen, onClose, onCapture }: SelfieVerifyModalProps) {
    const [initialized, setInitialized] = useState(false);

    // Configure AWS Amplify on mount
    useEffect(() => {
        if (isOpen && !initialized) {
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
                console.warn('⚠️ AWS_IDENTITY_POOL_ID not configured. Face liveness will not work.');
                toast({
                    variant: "error",
                    title: "Configuration Missing",
                    description: "AWS credentials not configured. Please contact support."
                });
            }
        }
    }, [isOpen, initialized]);

    // Track modal open event
    useEffect(() => {
        if (isOpen) {
            tracking.track(TRACKING_EVENTS.SELFIE_MODAL_OPENED);
        }
    }, [isOpen]);

    const handleSuccess = async (result: any) => {
        console.log('✅ Face liveness verified:', result);
        tracking.track(TRACKING_EVENTS.SELFIE_CAPTURE_SUCCESS);

        // If backend returns photo URL, we need to convert it to File
        if (result.photoUrl) {
            try {
                // Fetch the image from S3
                const response = await fetch(result.photoUrl);
                const blob = await response.blob();

                // Convert to File
                const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

                // Pass to parent
                onCapture(file);

                toast({
                    variant: "success",
                    title: "Identity Verified!",
                    description: "Your face has been verified successfully."
                });
            } catch (error) {
                console.error('Error converting photo URL to file:', error);
                toast({
                    variant: "error",
                    title: "Error",
                    description: "Failed to process verified photo."
                });
            }
        } else {
            // If no photo URL, just close (backend already saved it)
            onClose();
            toast({
                variant: "success",
                title: "Verified!",
                description: "Your identity has been verified."
            });
        }
    };

    const handleError = (error: string) => {
        console.error('❌ Face liveness failed:', error);
        tracking.track(TRACKING_EVENTS.SELFIE_CAPTURE_FAILED, { reason: error });

        toast({
            variant: "error",
            title: "Verification Failed",
            description: error || "Face liveness check failed. Please try again."
        });
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Face Verification</h3>
                                <p className="text-sm text-white/80">AWS Rekognition Liveness Check</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        <FaceLiveness
                            onSuccess={handleSuccess}
                            onError={handleError}
                            onClose={onClose}
                        />
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>🔒 Secure & Encrypted</span>
                            <span>Powered by AWS Rekognition</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
