"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Lock, CheckCircle, AlertCircle, Loader2, Smartphone } from "lucide-react";
import OTPField from "./OTPField";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import useAxios from "@/hooks/useAxios";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import { useSearchParams } from "next/navigation";
import tracking from "@/lib/tracking";
import { TRACKING_EVENTS } from "@/lib/constants/quickApplyV2";
import { useApplication } from "@/contexts/ApplicationContext";

// Helper for Aadhaar Validation (12 digits)
const isValidAadhaar = (aadhaar: string) => /^\d{12}$/.test(aadhaar);

// Helper: Format Date from DD-MM-YYYY (API) to YYYY-MM-DD (Input)
const formatDOB = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
};

interface AadhaarVerifyProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const AadhaarVerify = ({ formData, setFormData }: AadhaarVerifyProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { fetchUserData } = useApplication();

    // State for OTP flow
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [clientId, setClientId] = useState(""); // To store request_id/client_id

    const axios = useAxios();
    const searchParams = useSearchParams();

    const checkAadhaarStatus = async () => {
        try {
            // Using Redux for aadhaar/status API
            // const result = await getAadhaarStatus();
            setLoading(true);
            const response = await axios.get("/api/v2/aadhaar/status");
            const result = response.data;

            // STEP 7: Handle API response
            if ((response.status === 200 || response.status === 201) && result.data?.isAadhaarVerify === true) {
                console.log('✅ Aadhaar verified successfully from status API');
                console.log('📝 Backend has updated isAadhaarVerify = true in database');
                const user = await fetchUserData();

                setFormData((prev) => ({
                    ...prev,
                    aadhaarVerified: true,
                    fullName: user?.fullName || prev.fullName,
                    dob: user?.dateOfBirth || prev.dob,
                    email: user?.email || "",
                    emailVerified: user?.isEmailVerified || false,
                    mobile: user?.mobile || "",
                    mobileVerified: user?.isMobileVerified || false,
                }));
                toast({
                    variant: "success",
                    title: "Aadhaar Verified",
                    description: result.message || "Your Aadhaar has been verified successfully.",
                });
                // Clean up URL params
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, '', cleanUrl);
                tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.AADHAAR_VERIFIED });
            } else {
                console.log('ℹ️ Aadhaar not verified:', result.message || 'Verification pending or failed');
                // setAadhaarVerified(false);
                setFormData((prev) => ({
                    ...prev,
                    aadhaarVerified: false,
                }));
                // Show info toast if verification failed/pending
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                toast({ variant: "error", title: error.response?.data?.message || "Internal server error" });
                setFormData((prev) => ({
                    ...prev,
                    aadhaarVerified: false,
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const verifiedParam = searchParams.get('verified');
        if (verifiedParam && verifiedParam === "true") {
            checkAadhaarStatus();
        }
    }, [searchParams]);

    const handleAadhaarChange = (value: string) => {
        const numericValue = value.replace(/\D/g, "");
        setError("");

        // Reset verification status directly in formData when number changes
        setFormData((prev) => ({
            ...prev,
            aadhaar: numericValue,
            aadhaarVerified: false
        }));

        if (otpSent) {
            setOtpSent(false);
            setOtp("");
            setClientId("");
        }
    };

    // Step 1: Send OTP
    const handleSendOtp = async () => {
        if (!formData.aadhaar || !isValidAadhaar(formData.aadhaar)) {
            setError("Please enter a valid 12-digit Aadhaar Number.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post('/api/v2/aadhaar/verification', {
                aadhaarNumber: formData.aadhaar
            });

            const data = response.data;

            if (data.success) {
                // ✅ HANDLE REDIRECT LOGIC
                if (data.data?.redirect && data.data?.url) {
                    window.location.href = data.data.url;
                    return;
                }

                setOtpSent(true);

                if (data.data?.clientId || data.data?.requestId) {
                    setClientId(data.data.clientId || data.data.requestId);
                }
            } else {
                setError(data.message || "Failed to send OTP.");
            }

        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError(err?.response?.data?.message || "Server error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 6) {
            setError("Please enter valid 6-digit OTP.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post('/api/v2/aadhaar/verify', {
                aadhaarNumber: formData.aadhaar,
                otp: otp,
                clientId: clientId
            });

            const data = response.data;

            if (data.success) {
                const user = await fetchUserData();
                // console.log("aadhaar user response:", user);
                // ✅ Auto-fill Name & DOB on success
                const formattedDOB = user?.dateOfBirth || data.data?.date_of_birth || data.data?.dob;

                // Update global form data (Sets aadhaarVerified to TRUE)
                setFormData((prev) => ({
                    ...prev,
                    aadhaarVerified: true,
                    fullName: user?.fullName || data.data?.name || prev.fullName,
                    dob: formattedDOB || prev.dob,
                    aadhaarData: data.data || {}
                }));
                // getCustomer();
                toast({ variant: "success", title: "Aadhaar verification successfully", description: "" });
                tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.AADHAAR_VERIFIED });
            } else {
                setError(data.message || "Invalid OTP. Verification failed.");
            }

        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError(err?.response?.data?.message || "Verification error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm space-y-2 mt-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                Aadhaar Verification
            </h3>

            {/* Aadhaar Number Input */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Aadhaar Number *
                </label>
                <div className="w-full grid grid-cols-[2fr_0.5fr] gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.aadhaar}
                            onChange={(e) => handleAadhaarChange(e.target.value)}
                            placeholder="1234 5678 9012"
                            disabled={formData.aadhaarVerified || loading || otpSent}
                            maxLength={12}
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#25B181]/20 focus:border-[#25B181] transition-all 
                                ${formData.aadhaarVerified
                                    ? "bg-green-50 border-green-200 text-green-800 font-semibold"
                                    : "bg-white border-gray-200"
                                } 
                                disabled:cursor-not-allowed disabled:bg-gray-50`}
                        />
                        {formData.aadhaarVerified && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        )}
                    </div>

                    {/* Step 1 Button: Get OTP */}
                    {!formData.aadhaarVerified && !otpSent ? (
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading || !formData.aadhaar || formData.aadhaar.length !== 12}
                            className="w-full py-2.5 bg-[#25B181] text-white rounded-xl font-bold text-sm hover:bg-[#1d8f6a] disabled:opacity-50 disabled:hover:bg-[#25B181] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#25B181]/20 active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get OTP"}
                        </button>
                    ) : !formData.aadhaarVerified && otpSent ? (
                        <div className="flex items-center justify-center text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-100 rounded-xl border border-gray-200 text-center px-1">
                            OTP Sent
                        </div>
                    ) : (
                        <div className="w-full py-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-2 animate-in zoom-in-95 duration-300">
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                                Verified
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Step 2: OTP Input Section (Appears below when OTP is sent) */}
            {otpSent && !formData.aadhaarVerified && (
                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-700">
                            Enter OTP
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setOtpSent(false); setOtp(""); setClientId(""); }}
                                className="text-[10px] text-gray-400 hover:text-gray-600 underline"
                            >
                                Change Aadhaar
                            </button>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="text-[10px] text-[#25B181] hover:underline font-medium disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Resend OTP"}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <OTPField
                                value={otp}
                                onChange={(val) => {
                                    setOtp(val);
                                    if (error) setError("");
                                }}
                                length={6}
                                error={!!error}
                                autoFocus={true}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length < 6}
                            className="w-full py-2.5 bg-[#25B181] text-white rounded-xl font-bold text-sm hover:bg-[#1d8f6a] disabled:opacity-50 disabled:hover:bg-[#25B181] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#25B181]/20 active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify OTP"}
                        </button>
                    </div>
                </div>
            )}

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

export default AadhaarVerify;