'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Phone, IndianRupee, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { LOAN_CONFIG, VALIDATION, TIMERS, formatCurrency, calculateLoanDetails } from '@/lib/constants/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import TruecallerVerify from './ui/TruecallerVerify';
import GoogleVerify from './ui/GoogleVerify';
import { useAuth } from '@/contexts/AuthContext';
import MobileVerify from './ui/MobileVerify';

// MOCK MODE - Set to false for production with real APIs
// const MOCK_MODE = false;
// const MOCK_OTP = '123456'; 

interface Page1Props {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
}

export default function Page1BasicDetails({ formData, setFormData, onNext }: Page1Props) {
    // OTP States
    const [otpTimer, setOtpTimer] = useState(0);
    const { user } = useAuth();

    // The logic now correctly handles verification status from the AuthContext
    const isVerified = useMemo(() => user?.isEmailVerified || user?.isMobileVerified, [user]);

    const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);

    // Updated proceed logic to use isVerified
    const canProceed = isVerified &&
        formData.loanAmount >= LOAN_CONFIG.MIN_AMOUNT &&
        formData.loanAmount <= LOAN_CONFIG.MAX_AMOUNT;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Get Instant Cash</h2>

            {/* Verification Section */}
            {isVerified ? (
                /* Verified Success Message Design */
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 flex items-center gap-4"
                >
                    <div className="bg-green-100 p-2 rounded-full shadow-sm">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-green-900">Verified Successfully</span>
                            <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Secure</span>
                        </div>
                        <p className="text-xs text-green-700 mt-0.5">
                            Your account is confirmed. You can now proceed with your application.
                        </p>
                    </div>
                </motion.div>
            ) : (
                /* Original Verification UI Design */
                <>
                    <div className="bg-gradient-to-r from-[#25B181]/5 to-[#51C9AF]/5 rounded-xl p-3 sm:p-4 border border-[#25B181]/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-[#25B181]" />
                            <span className="text-sm font-semibold text-gray-900">Quick Verify</span>
                            <span className="text-[9px] sm:text-[10px] bg-[#25B181] text-white px-1.5 py-0.5 rounded-full">Fastest</span>
                        </div>

                        <div className="flex gap-2">
                            <TruecallerVerify callbackURL="/apply/quick-v2" />
                            <GoogleVerify callbackURL="/apply/quick-v2" />
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-[10px] text-gray-500">or enter mobile</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>
                    </div>

                    <MobileVerify />
                </>
            )}

            {/* Loan Amount - Keep Original Design */}
            <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-xl p-3 sm:p-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    How much do you need?
                </label>
                <div className="flex items-center justify-center gap-1 mb-3">
                    <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-[#25B181]" />
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                        {(formData.loanAmount / 1000).toFixed(0)}K
                    </span>
                </div>
                <div className="px-1">
                    <input
                        type="range"
                        min={LOAN_CONFIG.MIN_AMOUNT}
                        max={LOAN_CONFIG.MAX_AMOUNT}
                        step={5000}
                        value={formData.loanAmount}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, loanAmount: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#25B181]"
                    />
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
                    <span>₹{(LOAN_CONFIG.MIN_AMOUNT / 1000)}K</span>
                    <span>₹{(LOAN_CONFIG.MAX_AMOUNT / 1000)}K</span>
                </div>
            </div>

            {/* Tenure - Keep Original Design */}
            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Repayment Period
                </label>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {LOAN_CONFIG.TENURE_OPTIONS.map((days: any) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => setFormData((prev: any) => ({ ...prev, tenure: days }))}
                            className={`py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${formData.tenure === days
                                ? 'bg-[#25B181] text-white shadow-md shadow-[#25B181]/30'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#25B181]'
                                }`}
                        >
                            {days}d
                        </button>
                    ))}
                </div>
            </div>

            {/* Loan Summary - Keep Original Design */}
            <div className="bg-white border-2 border-gray-100 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">You&apos;ll receive</span>
                    <span className="text-base sm:text-lg font-bold text-[#25B181]">{formatCurrency(loanCalc.netDisbursalAmount)}</span>
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                    <span>Processing + GST</span>
                    <span>- {formatCurrency(loanCalc.totalDeductions)}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                    <span className="text-xs sm:text-sm text-gray-700">Repay in {formData.tenure} days</span>
                    <span className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(loanCalc.totalRepayment)}</span>
                </div>
            </div>

            {/* Continue Button */}
            <button
                onClick={onNext}
                disabled={!canProceed}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r disabled:cursor-not-allowed from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-[#25B181]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
                Continue
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </motion.div>
    );
}
