"use client";

import { Zap, ShieldCheck, Banknote, Lock } from "lucide-react";
import TruecallerVerify from "./TruecallerVerify";
import MobileVerify from "./MobileVerify";

const CustomerLogin = () => {
    return (
        <div className="w-full">
            {/* 1. Welcome / Context Section */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Your Application
                </h1>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                    Please log in or register to check your eligibility and unlock your loan offer.
                </p>
            </div>

            {/* 2. Main Login Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Trust Banner */}
                <div className="bg-[#ecfdf5] px-4 py-3 flex justify-between items-center border-b border-[#25B181]/10">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#25B181]" />
                        <span className="text-xs font-semibold text-[#064e3b]">100% Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#25B181]" />
                        <span className="text-xs font-semibold text-[#064e3b]">Instant Disbursal</span>
                    </div>
                </div>

                <div className="p-4 sm:p-6 space-y-6">

                    {/* Mobile-Only Truecaller Section */}
                    <div className="block md:hidden">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-xs font-medium text-gray-500">
                                    Recommended
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-xl p-4 border border-[#25B181]/20">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[#25B181] fill-current" />
                                    <span className="text-sm font-bold text-gray-800">One-Tap Login</span>
                                </div>
                                <span className="text-[10px] font-bold bg-[#25B181] text-white px-2 py-0.5 rounded-full animate-pulse">
                                    FASTEST
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <TruecallerVerify callbackURL="/apply/quick-v2" />
                            </div>
                        </div>
                    </div>

                    {/* Standard Mobile Verification */}
                    <div>
                        <div className="block md:hidden mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-2 bg-white text-xs text-gray-400">OR MANUALLY</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left mb-3">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                Enter Mobile Number
                            </label>
                        </div>

                        {/* Your existing MobileVerify Component */}
                        <MobileVerify />

                        <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            Your data is encrypted and safe.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;