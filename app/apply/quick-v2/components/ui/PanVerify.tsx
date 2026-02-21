"use client";

import React, { useEffect, useRef, useState } from "react";
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { isValidPAN, TIMERS } from "@/lib/constants/quickApplyV2";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import useAxios from "@/hooks/useAxios";
import { AxiosError } from "axios";
import { useQuickApplyTracking, useVerificationFrictionTracking } from "@/lib/hooks";
import { toast } from "@/components/ui/toast";

interface PanVerifyProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const PanVerify = ({ formData, setFormData }: PanVerifyProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [panReverifyTimer, setPanReverifyTimer] = useState(0);
    const axios = useAxios();

    // Tracking
    const {
        trackStepViewed,
        trackPANEntered,
        trackPANVerifyStarted,
        trackPANVerifySuccess,
        trackPANVerifyFailed,
    } = useQuickApplyTracking();

    // PAN verification friction tracking
    const panFriction = useVerificationFrictionTracking('pan');

    // Track step viewed
    const hasTrackedStepRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(2, 'PAN & Employment');
        }
    }, [trackStepViewed]);

    // PAN Reverify Timer Effect
    useEffect(() => {
        if (panReverifyTimer > 0) {
            const timer = setTimeout(() => setPanReverifyTimer(panReverifyTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [panReverifyTimer]);

    const handleInputChange = (value: string) => {
        const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        setError("");
        setFormData((prev) => ({
            ...prev,
            pan: value.toUpperCase(),
            panVerified: false,
        }));

        // Track PAN entered when complete
        if (cleaned.length === 10) {
            trackPANEntered(cleaned);
        }

        // Auto-verify when valid PAN is entered
        // if (cleaned.length === 10 && isValidPAN(cleaned)) {
        //     // setTimeout(() => autoVerifyPAN(cleaned), 300);
        // }
    };

    const handleVerify = async () => {
        if (!formData.aadhaarVerified) {
            setError("Aadhaar verification is required first.");
            return;
        }
        // 1. Validation (Only PAN now)
        if (!formData.pan || !isValidPAN(formData.pan)) {
            setError("Please enter a valid PAN Number.");
            return;
        }

        trackPANVerifyStarted();
        panFriction.startTracking();
        panFriction.recordAttempt();

        try {
            // 2. API Call (Only sending panNumber)
            setLoading(true);
            const response = await axios.post('/api/v2/panVerification', {
                panNumber: formData.pan
            });
            // const response = await axios.post('/api/kyc/pan/verification', {
            //     panNumber: formData.pan,
            //     fullName: formData.fullName,
            //     dob: formData.dob,
            // });
            const data = response.data;

            if (data.success) {
                toast({ variant: "success", title: data?.message || data?.data?.message || "Pan verify successfully" });
                setFormData((prev) => ({
                    ...prev,
                    panVerified: true,
                    // If the API returns the name/dob after verification, you can auto-fill them here if you wish
                    // fullName: data.data.fullName, 
                    panData: data.data || { panNumber: formData.pan },
                }));
                trackPANVerifySuccess({ fullName: formData.fullName });
                panFriction.completeTracking(true);
                setPanReverifyTimer(TIMERS.REVERIFY_COOLDOWN);
            } else {
                const errorMsg = data.message || "Verification failed. Invalid PAN.";
                toast({ variant: "error", title: data.message });
                setError(data.message);
                trackPANVerifyFailed(errorMsg, panFriction.getAttempts());
                panFriction.completeTracking(false);
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const errorMsg = err?.response?.data?.message || "Network error. Please try again.";
                toast({ variant: "error", title: err?.response?.data?.message || "Network error. Please try again." });
                setError(errorMsg);
                trackPANVerifyFailed(errorMsg, panFriction.getAttempts());
                panFriction.completeTracking(false);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm space-y-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                PAN Verification
            </h3>

            {/* PAN Number Input */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Permanent Account Number (PAN) *
                </label>
                <div className="w-full grid grid-cols-[2fr_0.5fr] gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.pan}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="ABCDE1234F"
                            disabled={formData.panVerified || loading}
                            maxLength={10}
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm uppercase outline-none focus:ring-2 focus:ring-[#25B181]/20 focus:border-[#25B181] transition-all 
                            ${formData.panVerified
                                    ? "bg-green-50 border-green-200 text-green-800 font-semibold"
                                    : "bg-white border-gray-200"
                                } 
                            disabled:cursor-not-allowed disabled:bg-gray-50`}
                        />
                        {/* Visual Checkmark inside input when verified */}
                        {formData.panVerified && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        )}
                    </div>
                    {/* Action Button */}
                    {!formData.panVerified ? (
                        <button
                            type="button"
                            onClick={handleVerify}
                            disabled={loading || !formData.pan}
                            className="w-full py-2.5 bg-[#25B181] text-white rounded-xl font-bold text-sm hover:bg-[#1d8f6a] disabled:opacity-50 disabled:hover:bg-[#25B181] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#25B181]/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </>
                            ) : (
                                "Verify"
                            )}
                        </button>
                    ) : (
                        <div className="w-full py-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-2 animate-in zoom-in-95 duration-300">
                            {/* <CheckCircle className="w-4 h-4 text-green-600" /> */}
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                                Verified
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-medium">{error}</p>
                </div>
            )}
        </div>
    );
};

export default PanVerify;