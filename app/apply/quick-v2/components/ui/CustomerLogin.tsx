"use client";

import { Zap, ShieldCheck, Lock, CheckCircle2, TrendingUp, Loader2 } from "lucide-react"; // Added Loader2
import TruecallerVerify from "./TruecallerVerify";
import MobileVerify from "./MobileVerify";
import Link from "next/link";
import { useApplication } from "@/contexts/ApplicationContext";
import { useEffect, useState } from "react";
import DigiLockerVerify from "./DigiLockerVerify";
import { useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";

const CustomerLogin = () => {
    const { getCustomer, getApplication } = useApplication();
    const { login } = useAuth();
    const [isIOS, setIsIOS] = useState(false);
    const searchParams = useSearchParams();

    // 1. New State for loading
    const [isDigiLockerProcessing, setDigiLockerProcessing] = useState(false);

    // DigiLocker callback handler — login, fetch profile, auto-fill & verify
    useEffect(() => {
        const requestId = searchParams.get("requestId");
        const status = searchParams.get("status");

        if (requestId && status === "success") {
            // 2. Enable loading state
            setDigiLockerProcessing(true);

            (async () => {
                try {
                    // 1. Authenticate via NextAuth DigiLocker provider
                    const res = await signIn("digilocker", {
                        redirect: false,
                        requestId,
                    });

                    if (!res?.ok) {
                        toast({
                            variant: "error",
                            title: "DigiLocker Login Failed",
                            description: res?.error || "Authentication failed. Please try again.",
                        });
                        return; // Finally block will handle turning off loader
                    }

                    // 2. Get session & login
                    const userData = await getSession();
                    if (userData) {
                        await login({
                            apiData: userData,
                            email: userData?.user?.email || "",
                        });
                    }

                    getCustomer();
                    getApplication();

                    // Clean up URL params
                    const cleanUrl = window.location.pathname;
                    window.history.replaceState({}, '', cleanUrl);

                } catch (err: any) {
                    toast({
                        variant: "error",
                        title: "Error",
                        description: err?.message || "DigiLocker login failed. Please try again.",
                    });
                } finally {
                    // 3. Turn off loading state (runs on both success and error)
                    setDigiLockerProcessing(false);
                }
            })();
        }
    }, [searchParams]);

    // 1. Detect Platform & Mount
    useEffect(() => {
        // iOS Detection Regex
        if (typeof navigator !== "undefined") {
            const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            setIsIOS(isIOSDevice);
        }
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
                {/* 1. Header / Context Section */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                        Unlock Your Loan Offer
                    </h1>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        Check your eligibility in 2 minutes. Safe, secure, and purely digital process.
                    </p>
                </div>

                {/* 4. Conditional Rendering: 
                   If processing, show Loader. If not, show Form.
                */}
                {isDigiLockerProcessing ? (
                    <div className="w-full bg-white rounded-xl border border-emerald-100 shadow-sm p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-200 blur-lg opacity-40 rounded-full"></div>
                            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin relative z-10" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Verifying DigiLocker</h3>
                            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your documents securely...</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        {/* Value Props - Subtle reinforcement */}
                        <div className="flex justify-center gap-4 mb-8 text-xs font-medium text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Bank Grade Security</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                <span>Instant Approval</span>
                            </div>
                        </div>

                        {/* Mobile-Only Truecaller Section (Express Lane) */}
                        <div className="mb-8 md:mb-0 w-full">
                            <div className="relative group w-full">
                                <div className="relative w-full bg-white rounded-xl border border-emerald-300 p-1">
                                    {/* Badge */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <Zap className="w-3 h-3 fill-current" />
                                        FASTEST WAY
                                    </div>

                                    <div className="pt-5 pb-3 w-full px-3 text-center flex flex-col gap-3">
                                        <h3 className="text-sm font-bold text-gray-800">
                                            One-Tap Verification
                                        </h3>
                                        {
                                            !isIOS && (
                                                <div className="flex justify-center w-full md:hidden">
                                                    <TruecallerVerify callbackURL="/apply/quick-v2" />
                                                </div>
                                            )
                                        }
                                        <div className="flex justify-center w-full">
                                            <DigiLockerVerify type="v2" buttonText="Continue with DigiLocker" extraParams={{ apply: "true" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Or enter details manually
                                </span>
                            </div>
                        </div>

                    {/* Standard Mobile Verification */}
                    <div className="space-y-4">
                        <div className="[&_input]:w-full [&_input]:border-gray-300 [&_input]:rounded-lg [&_input]:focus:ring-emerald-500 [&_input]:focus:border-emerald-500">
                            <MobileVerify />
                        </div>

                            {/* Trust Footer inside card */}
                            <div className="bg-green-100/50 rounded-lg p-3 mt-4 border border-green-200">
                                <div className="flex items-start gap-2">
                                    <Lock className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-green-800 leading-relaxed">
                                        By continuing, you agree to our <Link href="/terms-and-conditions" className="text-green-600 hover:underline">Terms</Link> & <Link href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</Link>. Your data is encrypted using 256-bit SSL.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom trust seal - Hide if processing to reduce noise, or keep it. Keeping it here. */}
                <div className="mt-4 flex justify-center items-center gap-2 text-gray-600 font-medium text-xs opacity-70">
                    <span>Powered by Trusted Partners</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;