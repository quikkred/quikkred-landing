"use client";

import { Zap, ShieldCheck, Lock, CheckCircle2, TrendingUp } from "lucide-react";
import TruecallerVerify from "./TruecallerVerify";
import MobileVerify from "./MobileVerify";
import Link from "next/link";
import { useApplication } from "@/contexts/ApplicationContext";
import { useEffect, useState } from "react";
import DigiLockerVerify from "./DigiLockerVerify";

const CustomerLogin = () => {
    const { getApplication } = useApplication();
    const [isIOS, setIsIOS] = useState(false);

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
                            {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-200"></div> */}
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
                                                {/* Wrapper to ensure the child button takes full width if possible */}
                                                <TruecallerVerify callbackURL="/apply/quick-v2" />
                                            </div>
                                        )
                                    }
                                    <div className="flex justify-center w-full">
                                        <DigiLockerVerify buttonText="Continue with DigiLocker" />
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

                {/* Bottom trust seal */}
                <div className="mt-4 flex justify-center items-center gap-2 text-gray-600 font-medium text-xs opacity-70">
                    <span>Powered by Trusted Partners</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;