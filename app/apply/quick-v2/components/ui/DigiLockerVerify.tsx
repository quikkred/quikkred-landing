"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "@/components/ui/toast";
import useAxios from "@/hooks/useAxios";

const DigiLockerVerify = ({
    buttonText = "DigiLocker",
    extraParams = {},
}: {
    buttonText?: string;
    extraParams?: Record<string, string>;
}) => {
    const [showModal, setShowModal] = useState(false);
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [mobileError, setMobileError] = useState("");
    const [emailError, setEmailError] = useState("");
    const axios = useAxios();

    const validateMobile = (value: string) => {
        if (!value) {
            setMobileError("Mobile number is required");
            return false;
        }
        if (!/^\d{10}$/.test(value)) {
            setMobileError("Enter a valid 10-digit mobile number");
            return false;
        }
        if (!/^[6-9]/.test(value)) {
            setMobileError("Mobile number must start with 6, 7, 8, or 9");
            return false;
        }
        setMobileError("");
        return true;
    };

    const validateEmail = (value: string) => {
        if (!value) {
            setEmailError("Email is required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError("Enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
        setMobile(value);
        if (mobileError) validateMobile(value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) validateEmail(e.target.value);
    };

    const handleSubmit = async () => {
        const isMobileValid = validateMobile(mobile);
        const isEmailValid = validateEmail(email);
        if (!isMobileValid || !isEmailValid) return;

        setLoading(true);
        try {
            const response = await axios.post("/api/auth/customer/digilocker/login", {
                mobile,
                email,
                ...extraParams,
            });
            const data = response.data;

            if (data?.success && data?.data?.url) {
                toast({
                    variant: "success",
                    title: "Redirecting to DigiLocker",
                    description: "Please complete authentication on DigiLocker.",
                });
                window.location.href = data.data.url;
            } else {
                toast({
                    variant: "error",
                    title: "DigiLocker Error",
                    description: data?.message || "Failed to initiate DigiLocker login.",
                });
                setLoading(false);
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
            toast({
                variant: "error",
                title: "Error",
                description: message,
            });
            setLoading(false);
        }
    };

    const DigiLockerIcon = () => (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#2B63B5" />
            <path
                d="M6 8h12v8H6V8zm2 2v4h8v-4H8zm1 1h2v2H9v-2zm3 0h2v2h-2v-2z"
                fill="white"
            />
        </svg>
    );

    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalRoot(document.body);
    }, []);

    const modalContent = showModal ? (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 overflow-y-auto p-4"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    setShowModal(false);
                    setMobileError("");
                    setEmailError("");
                }
            }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 relative my-auto mx-auto">
                {/* Close button */}
                <button
                    type="button"
                    onClick={() => {
                        if (!loading) {
                            setShowModal(false);
                            setMobileError("");
                            setEmailError("");
                        }
                    }}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                    &times;
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-[#2B63B5] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 8h12v8H6V8zm2 2v4h8v-4H8zm1 1h2v2H9v-2zm3 0h2v2h-2v-2z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">Continue with DigiLocker</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Enter your details to proceed</p>
                    </div>
                </div>

                {/* Mobile Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        value={mobile}
                        onChange={handleMobileChange}
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2B63B5] focus:border-[#2B63B5] bg-white ${
                            mobileError ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                    />
                    {mobileError && (
                        <p className="mt-1 text-xs text-red-600">{mobileError}</p>
                    )}
                </div>

                {/* Email Input */}
                <div className="mb-5 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2B63B5] focus:border-[#2B63B5] bg-white ${
                            emailError ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                    />
                    {emailError && (
                        <p className="mt-1 text-xs text-red-600">{emailError}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-[#2B63B5] text-white rounded-lg font-semibold hover:bg-[#234f94] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Redirecting...
                        </>
                    ) : (
                        "Continue to DigiLocker"
                    )}
                </button>

                <p className="mt-3 sm:mt-4 text-xs text-center text-gray-400">
                    You will be redirected to DigiLocker for secure authentication
                </p>
            </div>
        </div>
    ) : null;

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-white border-2 border-[#2B63B5] rounded-lg font-medium text-xs sm:text-sm text-gray-800 hover:bg-[#2B63B5]/5 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
            >
                <DigiLockerIcon />
                <span className="hidden sm:inline-block">{buttonText}</span>
            </button>

            {portalRoot && modalContent && createPortal(modalContent, portalRoot)}
        </>
    );
};

export default DigiLockerVerify;
