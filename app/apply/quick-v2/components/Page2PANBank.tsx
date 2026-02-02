'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard, CheckCircle, Loader2,
    AlertCircle, ArrowRight, ArrowLeft, User, Calendar, Lock,
    Briefcase, IndianRupee, CalendarDays
} from 'lucide-react';
import { QuickApplyV2FormData, PANData } from '@/lib/types/quickApplyV2';
import {
    isValidPAN, formatCurrency, calculateLoanDetails, TIMERS,
    EMPLOYMENT_TYPES, SALARY_DATES
} from '@/lib/constants/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import { useQuickApplyTracking, useVerificationFrictionTracking } from '@/lib/hooks/useQuickApplyTracking';
import PanVerify from './ui/PanVerify';
import useAxios from '@/hooks/useAxios';
import AadhaarVerify from './ui/AadhaarVerify';
import SelfieVerify from './ui/SelfieVerify';
import { toast } from '@/components/ui/toast';
import { AxiosError } from 'axios';
import useStorage from '@/hooks/useStorage';

interface Page2Props {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function Page2PANBank({
    formData,
    setFormData,
    onNext,
    onBack,
}: Page2Props) {
    // hooks
    const axios = useAxios();
    // console.log("formData updated:", formData);

    // Form Errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Submit Loading
    const [submitLoading, setSubmitLoading] = useState(false);

    // Tracking
    const {
        trackStepViewed,
        trackStepCompleted,
        trackEmploymentTypeSelected,
        trackIncomeEntered,
        trackSalaryDateSelected,
        trackApplicationSubmitted,
        trackFieldFocus,
        trackFormError,
        trackAPIError,
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

    // Loan calculation
    const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

    const handleEmploymentTypeChange = (type: 'SALARIED' | 'SELF-EMPLOYED') => {
        setFormData(prev => ({ ...prev, employmentType: type }));
        setErrors(prev => ({ ...prev, employmentType: '' }));
        trackEmploymentTypeSelected(type);
    };

    const handleIncomeChange = (value: string) => {
        const numValue = value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, monthlyIncome: numValue }));
        setErrors(prev => ({ ...prev, monthlyIncome: '' }));

        // Track income when user stops typing (debounced effect)
        if (numValue && parseInt(numValue) > 0) {
            trackIncomeEntered(parseInt(numValue));
        }
    };

    // Handle salary date selection with tracking
    const handleSalaryDateChange = (date: number) => {
        setFormData(prev => ({ ...prev, salaryDate: date }));
        setErrors(prev => ({ ...prev, salaryDate: '' }));
        trackSalaryDateSelected(date);
    };

    // Validate and Submit
    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};

        // Track step completion
        trackStepCompleted(2, 'PAN & Employment', {
            employmentType: formData.employmentType,
            panVerified: formData.panVerified,
        });

        // Track application submission
        trackApplicationSubmitted({
            loanAmount: formData.loanAmount,
            tenure: formData.tenure,
            employmentType: formData.employmentType,
            monthlyIncome: formData.monthlyIncome ? parseInt(formData.monthlyIncome) : undefined,
        });

        setSubmitLoading(true);
        // Employment validation (kept for reference but currently bypassed)

        const nameParts = formData.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // Use fallback values from user object if form data is empty
        const mobile = formData.mobile || '';
        const email = formData.email || '';
        const companyName = "Quikkred";
        const isBasicDetailsFilled = true;
        const dateOfBirth = formData.dob;

        if (!formData.employmentType) {
            newErrors.employmentType = 'Please select employment type';
            trackFormError('employmentType', newErrors.employmentType, 2);
        }

        if (!formData.monthlyIncome || parseInt(formData.monthlyIncome) < 15000) {
            newErrors.monthlyIncome = 'Minimum income required is ₹15,000';
            trackFormError('monthlyIncome', newErrors.monthlyIncome, 2);
        }

        if (formData.employmentType === 'SALARIED' && !formData.salaryDate) {
            newErrors.salaryDate = 'Please select salary date';
            trackFormError('salaryDate', newErrors.salaryDate, 2);
        }

        const basicDetails = {
            employmentType: formData.employmentType,
            monthlyIncome: formData.monthlyIncome,
            salaryDate: formData.salaryDate,
            firstName,
            lastName,
            mobile: "9319558980",
            email,
            isBasicDetailsFilled,
            dateOfBirth,
            companyName
        }

        setFormData((prev) => ({
            ...prev, ...basicDetails
        }))

        try {
            const response = await axios.post("/api/v2/application/loan/create", {
                basicDetails
            })
            if (response.status === 200 || response.status === 201) {
                toast({ variant: "success", title: response.data?.message || "Employee details verify successfully" });
                trackApplicationSubmitted({
                    loanAmount: formData.loanAmount,
                    tenure: formData.tenure,
                    employmentType: formData.employmentType,
                    monthlyIncome: formData.monthlyIncome ? parseInt(formData.monthlyIncome) : undefined,
                });
                onNext();
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast({ variant: "error", title: error.response?.data?.message || "Internal error server" });
                trackAPIError('/api/loan/submit', error.response?.data?.message);
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Complete Your Profile</h2>

            <AadhaarVerify formData={formData} setFormData={setFormData} />
            <SelfieVerify formData={formData} setFormData={setFormData} />

            {/* Employment Details */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    Employment Details
                </h3>

                <div className="space-y-3">
                    {/* Employment Type */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Employment Type *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {EMPLOYMENT_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleEmploymentTypeChange(type.value)}
                                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all active:scale-[0.98] touch-manipulation ${formData.employmentType === type.value
                                        ? 'bg-[#25B181] text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#25B181]'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                        {errors.employmentType && (
                            <p className="mt-1 text-xs text-red-600">{errors.employmentType}</p>
                        )}
                    </div>

                    {/* Monthly Income */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Monthly Income *
                        </label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formData.monthlyIncome}
                                onChange={(e) => handleIncomeChange(e.target.value)}
                                onFocus={() => trackFieldFocus('monthlyIncome', 2)}
                                className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#25B181] ${errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter monthly income"
                            />
                        </div>
                        {errors.monthlyIncome && (
                            <p className="mt-1 text-xs text-red-600">{errors.monthlyIncome}</p>
                        )}
                    </div>

                    {/* Salary Date - only for salaried */}
                    {formData.employmentType === 'SALARIED' && (
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Salary Credit Date *
                            </label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <select
                                    value={formData.salaryDate || ''}
                                    onChange={(e) => handleSalaryDateChange(parseInt(e.target.value) || 0)}
                                    onFocus={() => trackFieldFocus('salaryDate', 2)}
                                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#25B181] appearance-none ${errors.salaryDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select salary date</option>
                                    {SALARY_DATES.map((date) => (
                                        <option key={date.value} value={date.value}>
                                            {date.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.salaryDate && (
                                <p className="mt-1 text-xs text-red-600">{errors.salaryDate}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* PAN Verification */}
            {/* <PanVerify formData={formData} setFormData={setFormData} /> */}

            {/* Loan Summary */}
            <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">You&apos;ll receive</span>
                    <span className="font-semibold text-green-600">{formatCurrency(loanCalc.netDisbursalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Processing Fee (10% + GST)</span>
                    <span className="text-gray-700">{formatCurrency(loanCalc.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm border-t pt-1.5 sm:pt-2">
                    <span className="text-gray-600">Total Repayment</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(loanCalc.totalRepayment)}</span>
                </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-700">{errors.submit}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Back button - disabled once PAN is verified */}
                <button
                    type='button'
                    onClick={onBack}
                    // disabled={submitLoading || formData.panVerified}
                    disabled={submitLoading}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] touch-manipulation ${submitLoading
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        } disabled:opacity-50`}
                >
                    {submitLoading ? (
                        <Lock className="w-4 h-4" />
                    ) : (
                        <ArrowLeft className="w-4 h-4" />
                    )}
                    <span>Back</span>
                </button>
                {submitLoading && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-gray-800 text-white text-[10px] sm:text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Cannot go back after PAN verification
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={submitLoading || !formData.panVerified}
                    className="w-full py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg font-semibold text-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                >
                    {submitLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Next</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
