"use client"

import { toast } from "@/components/ui/toast";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { Camera, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react";
import SelfieVerifyModal from "./SelfieVerifyModal";

interface SelfieVerifyProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const SelfieVerify = ({ formData, setFormData }: SelfieVerifyProps) => {
    // Local state for UI handling
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [selfieCaptured, setSelfieCaptured] = useState(false);
    const [selfieVerified, setSelfieVerified] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 1. SYNC EFFECT: Initialize local state from formData (Backend/API Data)
    useEffect(() => {
        // Handle Preview Image
        if (formData.selfie) {
            setSelfieCaptured(true);

            if (typeof formData.selfie === 'string') {
                // If it's a URL string (from backend S3)
                setSelfiePreview(formData.selfie);
            } else if (formData.selfie instanceof File) {
                // If it's a File object (user just took it, or navigating back/forth)
                const objectUrl = URL.createObjectURL(formData.selfie);
                setSelfiePreview(objectUrl);

                // Cleanup to prevent memory leaks
                return () => URL.revokeObjectURL(objectUrl);
            }
        } else {
            // Reset if empty
            setSelfiePreview(null);
            setSelfieCaptured(false);
        }

        // Handle Verification Status
        if (formData.selfieVerified) {
            setSelfieVerified(true);
        } else {
            setSelfieVerified(false);
        }
    }, [formData.selfie, formData.selfieVerified]);


    const handleSelfieCapture = (imageFile: File) => {
        // ... (Existing validations: null check, size, type, blank check) ...
        if (!imageFile) return;
        if (imageFile.size > 5 * 1024 * 1024) {
            toast({ variant: "error", title: "File Too Large", description: "Max 5MB allowed." });
            return;
        }
        if (!imageFile.type.startsWith('image/')) {
            toast({ variant: "error", title: "Invalid File", description: "Not an image." });
            return;
        }

        // 2. UPDATE PARENT: Store file AND verification status in global formData
        setFormData(prev => ({
            ...prev,
            selfie: imageFile,
            selfieVerified: true // Assuming successful Liveness check in Modal = Verified
        }));

        // Update local state for immediate UI feedback (though useEffect will also catch this)
        const previewUrl = URL.createObjectURL(imageFile);
        setSelfiePreview(previewUrl);
        setSelfieCaptured(true);
        setSelfieVerified(true);

        setIsOpen(false); // Close modal

        toast({
            variant: "success",
            title: "Selfie Captured Successfully! ✓",
            description: "Your selfie has been captured and validated.",
        });
    };

    return (
        <>
            <SelfieVerifyModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onCapture={handleSelfieCapture}
            />

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Capture Live Selfie *
                </h3>

                {!selfieCaptured ? (
                    <>
                        <p className="text-sm text-gray-600 mb-2">
                            Take a clear photo of your face for identity verification
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Open Camera & Capture Selfie
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="relative bg-black rounded-lg overflow-hidden aspect-video group">
                                {selfiePreview && (
                                    <img
                                        src={selfiePreview}
                                        alt="Captured selfie preview"
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                {/* Status Badge */}
                                <div className={`absolute top-2 right-2 ${selfieVerified ? 'bg-green-600' : 'bg-yellow-500'} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md`}>
                                    <CheckCircle className="w-4 h-4" />
                                    {selfieVerified ? 'Verified' : 'Pending Verification'}
                                </div>
                            </div>
                        </div>

                        {/* Logic: If verified (from backend or successful capture), show success msg. 
                            If not verified (or you want to allow retakes), show Retake. */}

                        {selfieVerified ? (
                            <div className="flex flex-col gap-3">
                                <p className="text-center text-sm text-green-600 font-medium bg-green-50 py-2 rounded border border-green-200">
                                    ✓ Your photo has been verified successfully
                                </p>
                                {/* Optional: Allow retake even if verified? Usually NO for KYC. 
                                    If yes, uncomment the button below but add logic to reset verification status */}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                Retake Selfie
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default SelfieVerify;