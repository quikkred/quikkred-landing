'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Building2, CheckCircle, Loader2, AlertCircle,
    ArrowRight, ArrowLeft
} from 'lucide-react';
import { QuickApplyV2FormData, ApprovalDetails } from '@/lib/types/quickApplyV2';
import { isValidIFSC, isValidAccountNumber, formatCurrency } from '@/lib/constants/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import { useQuickApplyTracking, useVerificationFrictionTracking } from '@/lib/hooks/useQuickApplyTracking';
import useAxios from '@/hooks/useAxios';

// MOCK MODE - Set to false for production with real APIs
// Set to true only for local testing without backend
const MOCK_MODE = false;

interface PostApprovalBankProps {
    formData: QuickApplyV2FormData;
    approvalDetails: ApprovalDetails;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function PostApprovalBank({
    formData,
    approvalDetails,
    setFormData,
    onNext,
    onBack,
}: PostApprovalBankProps) {
    // Tracking
    const {
        trackStepViewed,
        trackStepCompleted,
        trackBankVerifyStarted,
        trackBankVerifySuccess,
        trackBankVerifyFailed,
        trackFieldFocus,
        trackFormError,
        trackAPIError,
    } = useQuickApplyTracking();

    // Bank verification friction tracking
    const bankFriction = useVerificationFrictionTracking('bank');

    // Track step viewed on mount
    const hasTrackedStepRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(4, 'Bank Details');
            bankFriction.startTracking();
        }
    }, [trackStepViewed, bankFriction]);
    // IFSC States
    const [ifscLoading, setIfscLoading] = useState(false);
    const [ifscError, setIfscError] = useState('');
    const ifscTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const axios = useAxios();

    // Form Errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Submit Loading
    const [submitLoading, setSubmitLoading] = useState(false);

    // Handle IFSC Input with Auto-lookup
    const handleIFSCChange = (value: string) => {
        const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
        setFormData((prev: any) => ({ ...prev, ifsc: cleaned, bankName: '' }));
        setIfscError('');
        setErrors(prev => ({ ...prev, ifsc: '' }));

        if (ifscTimeoutRef.current) {
            clearTimeout(ifscTimeoutRef.current);
        }

        if (cleaned.length === 11) {
            ifscTimeoutRef.current = setTimeout(() => lookupIFSC(cleaned), 500);
        }
    };

    // IFSC Lookup
    const lookupIFSC = async (ifsc: string) => {
        if (!isValidIFSC(ifsc)) {
            setIfscError('Invalid IFSC format');
            return;
        }

        setIfscLoading(true);

        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockBanks: Record<string, string> = {
                'SBIN': 'State Bank of India',
                'HDFC': 'HDFC Bank',
                'ICIC': 'ICICI Bank',
                'AXIS': 'Axis Bank',
                'KKBK': 'Kotak Mahindra Bank',
                'PUNB': 'Punjab National Bank',
            };
            const bankCode = ifsc.slice(0, 4);
            const bankName = mockBanks[bankCode] || 'Test Bank';
            setFormData((prev: any) => ({ ...prev, bankName }));
            setIfscLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);

            if (response.ok) {
                const data = await response.json();
                setFormData((prev: any) => ({
                    ...prev,
                    bankName: data.BANK || '',
                }));
            } else {
                setIfscError('IFSC not found');
            }
        } catch (error) {
            console.error('IFSC lookup failed:', error);
        } finally {
            setIfscLoading(false);
        }
    };

    // Handle Account Number
    const handleAccountNumberChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 18);
        setFormData((prev: any) => ({ ...prev, accountNumber: cleaned }));
        setErrors(prev => ({ ...prev, accountNumber: '' }));
    };

    // Validate and Submit
    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};

        // Bank validation
        if (!isValidIFSC(formData.ifsc)) {
            newErrors.ifsc = 'Please enter valid IFSC code';
        }

        if (!isValidAccountNumber(formData.accountNumber)) {
            newErrors.accountNumber = 'Please enter valid account number (9-18 digits)';
        }

        if (!formData.accountHolderName.trim()) {
            newErrors.accountHolderName = 'Account holder name is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Track form errors
            Object.entries(newErrors).forEach(([field, message]) => {
                trackFormError(field, message, 4);
            });
            return;
        }

        setSubmitLoading(true);
        trackBankVerifyStarted();
        bankFriction.recordAttempt();

        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Track success
            trackBankVerifySuccess(formData.bankName);
            bankFriction.completeTracking(true);
            trackStepCompleted(4, 'Bank Details', {
                bankName: formData.bankName,
            });

            setSubmitLoading(false);
            onNext();
            return;
        }

        try {
            const applicationId = localStorage.getItem('applicationId');

            const response = await axios.post('/api/loan/update-bank', {
                applicationId,
                bankDetails: {
                    bankName: formData.bankName,
                    ifscCode: formData.ifsc,
                    accountNumber: formData.accountNumber,
                    accountHolderName: formData.accountHolderName,
                },
            })

            const data = response.data;

            if (data.success) {
                // Track success
                trackBankVerifySuccess(formData.bankName);
                bankFriction.completeTracking(true);
                trackStepCompleted(4, 'Bank Details', {
                    bankName: formData.bankName,
                });
                onNext();
            } else {
                const errorMsg = data.message || 'Failed to save bank details';
                setErrors({ submit: errorMsg });
                trackBankVerifyFailed(errorMsg, bankFriction.getAttempts());
            }
        } catch (error) {
            console.error('Bank details error:', error);
            trackAPIError('/api/loan/update-bank', 'Network error');
            // Proceed anyway in case of error
            trackBankVerifySuccess(formData.bankName);
            bankFriction.completeTracking(true);
            trackStepCompleted(4, 'Bank Details', {
                bankName: formData.bankName,
            });
            onNext();
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
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Bank Details</h2>

            {/* Approval Summary */}
            <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#25B181]/20">
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25B181]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-600">Amount to be credited</p>
                        <p className="text-base sm:text-xl font-bold text-[#25B181]">
                            {formatCurrency(approvalDetails.netDisbursalAmount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bank Details Form */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25B181]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Bank Account</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">For loan disbursement</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* IFSC & Bank Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                IFSC Code *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.ifsc}
                                    onChange={(e) => handleIFSCChange(e.target.value)}
                                    placeholder="SBIN0001234"
                                    maxLength={11}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-[#25B181] uppercase ${errors.ifsc || ifscError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {ifscLoading && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 animate-spin" />
                                )}
                            </div>
                            {(errors.ifsc || ifscError) && (
                                <p className="mt-1 text-xs text-red-600">{errors.ifsc || ifscError}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                value={formData.bankName}
                                readOnly
                                placeholder="Auto-detected from IFSC"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm"
                            />
                        </div>
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Account Number *
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formData.accountNumber}
                            onChange={(e) => handleAccountNumberChange(e.target.value)}
                            placeholder="Enter account number"
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-[#25B181] ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.accountNumber && (
                            <p className="mt-1 text-xs text-red-600">{errors.accountNumber}</p>
                        )}
                    </div>

                    {/* Account Holder Name */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Account Holder Name *
                        </label>
                        <input
                            type="text"
                            value={formData.accountHolderName}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, accountHolderName: e.target.value }));
                                setErrors(prev => ({ ...prev, accountHolderName: '' }));
                            }}
                            placeholder="Name as per bank records"
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg text-sm focus:ring-2 focus:ring-[#25B181] ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.accountHolderName && (
                            <p className="mt-1 text-xs text-red-600">{errors.accountHolderName}</p>
                        )}
                        {formData.fullName && formData.accountHolderName && formData.accountHolderName !== formData.fullName && (
                            <p className="mt-1 text-[10px] sm:text-xs text-amber-600">
                                Note: Name should match your PAN name for faster processing
                            </p>
                        )}
                    </div>

                    {/* Note */}
                    <div className="bg-[#25B181]/10 rounded-lg p-2.5 sm:p-3 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#25B181] flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] sm:text-xs text-gray-700">
                            Bank account will be verified using penny-drop verification before disbursement.
                        </p>
                    </div>
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
            <div className="flex gap-2 sm:gap-3">
                <button
                    onClick={onBack}
                    disabled={submitLoading}
                    className="px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitLoading}
                    className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                >
                    {submitLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <span className="text-sm">Saving...</span>
                        </>
                    ) : (
                        <>
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                    )}
                </button>
            </div>

            {/* Progress Note */}
            <p className="text-center text-[10px] sm:text-xs text-gray-500">
                Step 1 of 3: <span className="font-medium text-[#25B181]">Bank</span> → Aadhaar → Selfie
            </p>
        </motion.div>
    );
}
