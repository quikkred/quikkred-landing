'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, Zap, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { VALIDATION } from '@/lib/constants/quickApplyV2';

interface LandingScreenProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
}

export default function LandingScreen({ formData, setFormData, onNext }: LandingScreenProps) {
    const [mobile, setMobile] = useState(formData.mobile || '');
    const [mobileError, setMobileError] = useState('');
    const [bureauConsent, setBureauConsent] = useState(false);
    const [termsConsent, setTermsConsent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobile(value);
        if (mobileError) setMobileError('');
    };

    const handleGetStarted = () => {
        if (!VALIDATION.MOBILE.test(mobile)) {
            setMobileError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!bureauConsent || !termsConsent) {
            setMobileError('Please accept both consents to continue');
            return;
        }

        setIsLoading(true);
        localStorage.setItem('applyMobile', mobile);
        setFormData(prev => ({
            ...prev,
            mobile,
            bureauConsent: true,
            termsConsent: true,
        }));
        onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Hero */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <img
                        src="/logo.svg"
                        alt="Quikkred"
                        className="h-8 sm:h-10"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        100% Secure
                    </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Get Personal Loan up to <span className="text-[#25B181]">₹25,000</span> in 5 mins!
                </h1>
            </div>

            {/* Benefits Cards */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-[#25B181]/10 to-[#51C9AF]/5 rounded-xl p-3 text-center border border-[#25B181]/10">
                    <Zap className="w-5 h-5 text-[#25B181] mx-auto mb-1.5" />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900">Interest rate</p>
                    <p className="text-xs sm:text-sm font-bold text-[#25B181]">1%/day</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-25 rounded-xl p-3 text-center border border-blue-100">
                    <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900">100%</p>
                    <p className="text-xs sm:text-sm font-bold text-blue-600">Digital</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-25 rounded-xl p-3 text-center border border-orange-100">
                    <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1.5" />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900">Tenure</p>
                    <p className="text-xs sm:text-sm font-bold text-orange-600">up to 90 Days</p>
                </div>
            </div>

            {/* Mobile Input */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Enter your mobile number
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-500">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm text-gray-400">+91</span>
                    </div>
                    <input
                        type="tel"
                        inputMode="numeric"
                        value={mobile}
                        onChange={handleMobileChange}
                        placeholder="Enter mobile number"
                        maxLength={10}
                        className={`w-full pl-20 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none transition-colors ${
                            mobileError
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-[#25B181]'
                        }`}
                    />
                </div>
                {mobileError && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {mobileError}
                    </p>
                )}
            </div>

            {/* Consents */}
            <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={bureauConsent}
                        onChange={(e) => setBureauConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#25B181] rounded"
                    />
                    <span className="text-[10px] sm:text-xs text-gray-600">
                        I authorize Quikkred / Satsai Finlease Pvt Ltd to check my Credit Bureau report for loan assessment purposes.
                    </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={termsConsent}
                        onChange={(e) => setTermsConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#25B181] rounded"
                    />
                    <span className="text-[10px] sm:text-xs text-gray-600">
                        I agree to the{' '}
                        <a href="/terms-and-conditions" className="text-[#25B181] underline" target="_blank">Terms & Conditions</a>
                        {' '}and{' '}
                        <a href="/privacy-policy" className="text-[#25B181] underline" target="_blank">Privacy Policy</a>.
                    </span>
                </label>
            </div>

            {/* CTA Button */}
            <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation disabled:opacity-50"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            {/* Lending Partners */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-100">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5">Our Lending Partners</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">Satsai Finlease Pvt Ltd</p>
                <p className="text-[10px] sm:text-xs text-gray-500">RBI Registration: B-14.01646</p>
            </div>
        </motion.div>
    );
}
