'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import PanVerify from './ui/PanVerify';
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';

import AadhaarVerify from './ui/AadhaarVerify';
import EmployeeDetails from './ui/EmployeeDetails';
import MissingField from './ui/MissingField';
import FinFactorVerify from './ui/FinFactorVerify';

interface CheckEligibilityProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
}

export default function CheckEligibility({ formData, setFormData, onNext }: CheckEligibilityProps) {
    // OTP States
    const [otpTimer, setOtpTimer] = useState(0);

    // Tracking
    const {
        trackStepViewed,
    } = useQuickApplyTracking();

    // Track previous values for change detection
    const hasTrackedStepRef = useRef(false);

    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(1, 'Basic Details');
        }
    }, [trackStepViewed]);

    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);


    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Get Instant Cash</h2>

            <AadhaarVerify formData={formData} setFormData={setFormData} />
            <PanVerify formData={formData} setFormData={setFormData} />
            <MissingField formData={formData} setFormData={setFormData} />
            <EmployeeDetails formData={formData} setFormData={setFormData} />

            <div className="w-full">
                <h2 className="font-bold text-base mb-1 text-red-600">** Loan Eligibility & Approval **</h2>
                <p className="text-xs mb-1">
                    • Loans are not available in select states/UTs (Andaman & Nicobar Islands, Arunachal Pradesh, Assam, Jammu & Kashmir, Ladakh, Lakshadweep, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Daman & Diu).
                </p>
                <p className="text-xs">
                    • Applicants working in Police, Defence, or Legal professions are not eligible.
                </p>
            </div>

            {/* 3. Conditional Rendering: Reject Message vs Button */}
            {/* {(formData?.breStatus === "REJECTED" || formData?.breStatus === "Rejected" || formData?.bsaBreStatus === "REJECTED") ? (
                <div className="mb-5 bg-red-100/50 border border-red-200 rounded-xl px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                        <div className="flex items-center gap-3">
                            <div className="shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-red-900 leading-none">
                                    Application Rejected
                                </h3>
                                <p className="text-[11px] text-red-600 font-medium mt-1">
                                    Eligible to reapply after <span className="font-bold underline decoration-red-300 underline-offset-2">60 days</span>.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end border-t sm:border-t-0 border-red-100 pt-2 sm:pt-0 pl-8 sm:pl-0">
                            <span className="font-mono text-sm font-bold text-red-900 tracking-tight leading-none break-all">
                                {application?.applicationNumber}
                            </span>
                            <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mt-1">
                                Application No
                            </span>
                        </div>
                    </div>
                </div>
            ) : (formData?.breStatus === "PROCEED TO BANK" || formData?.breStatus === "Proceed to Bank" || formData?.breStatus === "PROCEED_TO_BANK") ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="shrink-0 bg-emerald-100 p-1.5 rounded-full">
                                    <Landmark className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-900 leading-none">
                                        Verification Required
                                    </h3>
                                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                                        Bank statement verification needed.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end border-t sm:border-t-0 border-emerald-100 pt-2 sm:pt-0 pl-11 sm:pl-0">
                                <span className="font-mono text-sm font-bold text-emerald-900 tracking-tight leading-none break-all">
                                    {application?.applicationNumber}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mt-1">
                                    Application No
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleProceedToBankApi}
                        disabled={ptbLoading}
                        className="w-full group relative py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {ptbLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Proceed to Bank</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleContinue}
                    disabled={isLoading || !canProceed}
                    className="w-full py-2 text-sm bg-gradient-to-r disabled:cursor-not-allowed from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold sm:text-base shadow-lg shadow-[#25B181]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Check Eligibility</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </>
                    )}
                </button>
            )} */}
            <FinFactorVerify
                formData={formData}
                setFormData={setFormData}
                onNext={onNext}
            />
        </motion.div>
    );
}