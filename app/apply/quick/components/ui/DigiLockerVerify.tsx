"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "@/components/ui/toast";
import useAxios from "@/hooks/useAxios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const schema = yup.object().shape({
    mobile: yup
        .string()
        .required("Mobile number is required")
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    email: yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only @gmail.com addresses are allowed"),
});

type FormData = {
    mobile: string;
    email: string;
};

const DigiLockerVerify = ({
    buttonText = "DigiLocker",
    smButtonText = "DigiLocker",
    type = "v1",
    extraParams = {},
}: {
    buttonText?: string;
    smButtonText?: string;
    type?: "v1" | "v2";
    extraParams?: Record<string, string | boolean>;
}) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const axios = useAxios();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const mobile = watch("mobile");

    // Scroll Locking
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showModal]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const response = await axios.post(type === "v2" ? "/api/v2/customer/digilocker/login" : "/api/auth/customer/digilocker/login", {
                mobile: data.mobile,
                email: data.email.toLowerCase(),
                ...extraParams,
            });
            const resData = response.data;

            if (resData?.success && resData?.data?.url) {
                toast({
                    variant: "success",
                    title: "Redirecting to DigiLocker",
                    description: "Please complete authentication on DigiLocker.",
                });
                window.location.href = resData.data.url;
            } else {
                toast({
                    variant: "error",
                    title: "DigiLocker Error",
                    description: resData?.message || "Failed to initiate DigiLocker login.",
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

    const handleClose = () => {
        if (!loading) {
            setShowModal(false);
            reset();
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-white border-2 border-[#2B63B5] rounded-lg font-medium text-xs sm:text-sm text-gray-800 hover:bg-[#2B63B5]/5 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
            >
                <DigiLockerIcon />
                <span className="hidden sm:inline-block">{buttonText}</span>
                <span className="inline-block sm:hidden">{smButtonText}</span>
            </button>

            {portalRoot && createPortal(
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 overflow-y-auto p-4 backdrop-blur-sm"
                            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) handleClose();
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 relative my-auto mx-auto"
                            >
                                {/* Close button */}
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                                    <div className="w-10 h-10 bg-[#2B63B5] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/10">
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

                                {/* Helper Text with Highlight */}
                                <div className="my-2 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-100 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>Make sure your mobile number or Email id is linked to Aadhaar</span>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Mobile Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            {...register("mobile")}
                                            maxLength={10}
                                            placeholder="Enter 10-digit mobile number"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2B63B5] focus:border-[#2B63B5] bg-white transition-all ${errors.mobile ? "border-red-500" : "border-gray-200"
                                                }`}
                                            disabled={loading}
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                                            }}
                                        />

                                        {errors.mobile && (
                                            <p className="mt-1 text-xs text-red-600 pl-1">{errors.mobile.message}</p>
                                        )}
                                    </div>

                                    {/* Email Input */}
                                    <div className="mb-5 sm:mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            placeholder="Enter your email"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2B63B5] focus:border-[#2B63B5] bg-white transition-all ${errors.email ? "border-red-500" : "border-gray-200"
                                                }`}
                                            disabled={loading}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-600 pl-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-[#2B63B5] text-white rounded-lg font-semibold hover:bg-[#234f94] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.99]"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Redirecting...</span>
                                            </>
                                        ) : (
                                            "Continue to DigiLocker"
                                        )}
                                    </button>

                                    <p className="mt-3 sm:mt-4 text-xs text-center text-gray-400">
                                        You will be redirected to DigiLocker for secure authentication
                                    </p>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                portalRoot
            )}
        </>
    );
};

export default DigiLockerVerify;
