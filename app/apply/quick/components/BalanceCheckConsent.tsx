'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, ArrowRight, ArrowLeft, AlertCircle, Loader2,
    CheckCircle, ExternalLink, Clock, Shield, TrendingUp, Award
} from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';
import getToken from '@/lib/getToken';
import { useSearchParams } from 'next/navigation';

interface BalanceCheckConsentProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function BalanceCheckConsent({
    formData,
    setFormData,
    onNext,
    onBack,
}: BalanceCheckConsentProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [consentComplete, setConsentComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const [breDecision, setBreDecision] = useState<any>(null);
    const searchParams = useSearchParams();

    const { trackStepViewed, trackStepCompleted, trackAPIError } = useQuickApplyTracking();

    const hasTrackedStepRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(2, 'Balance Check Consent');
        }
    }, [trackStepViewed]);

    // Check if returning from finfactor redirect
    useEffect(() => {
        const finfactorParam = searchParams.get('finfactor');
        if (finfactorParam === 'success') {
            setConsentComplete(true);
            setFormData(prev => ({ ...prev, finfactorConsent: true }));

            // Auto-trigger balance check processing
            // setTimeout(() => {
            //     handleProcessBalanceCheck();
            // }, 1000);
        }
    }, [searchParams, setFormData]);

    // Skip if already completed
    useEffect(() => {
        if (formData.balanceCheckComplete) {
            onNext();
        }
    }, [formData.balanceCheckComplete, onNext]);

    const handleInitiateConsent = async () => {
        setLoading(true);
        setError('');

        try {
            const token = await getToken();
            if (!token) {
                setError('Please login again to continue.');
                setLoading(false);
                return;
            }

            // Get FinFactor consent redirect URL
            const response = await fetch(`${API_BASE_URL}/api/kyc/finfactorConsentRequest`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();

            if (response.ok && result.success) {
                if (result.data?.url) {
                    // Redirect to Finfactor consent page
                    trackStepCompleted(2, 'Balance Check Consent - Redirect');
                    window.location.href = result.data.url;
                } else {
                    setError('No redirect URL received. Please try again.');
                }
            } else {
                setError(result.message || 'Failed to initiate consent.');
            }
        } catch (err: any) {
            const errorMsg = err?.message || 'Network error. Please try again.';
            setError(errorMsg);
            trackAPIError('/api/kyc/finfactorConsentRequest', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // const handleProcessBalanceCheck = async () => {
    //     setProcessing(true);
    //     setError('');
    //     setProcessingStage('Fetching bank statements...');

    //     try {
    //         const token = await getToken();
    //         if (!token) {
    //             setError('Please login again to continue.');
    //             setProcessing(false);
    //             return;
    //         }

    //         if (!formData.applicationId) {
    //             setError('Application ID not found. Please try again.');
    //             setProcessing(false);
    //             return;
    //         }

    //         // Update processing stages
    //         const stages = [
    //             'Fetching bank statements...',
    //             'Analyzing transactions...',
    //             'Calculating income patterns...',
    //             'Running credit assessment...',
    //             'Finalizing decision...'
    //         ];

    //         let stageIndex = 0;
    //         const stageInterval = setInterval(() => {
    //             if (stageIndex < stages.length - 1) {
    //                 stageIndex++;
    //                 setProcessingStage(stages[stageIndex]);
    //             }
    //         }, 12000); // Change stage every 12 seconds

    //         // Trigger complete balance check flow (consent → batch → result → BRE)
    //         const response = await fetch(`${API_BASE_URL}/api/balance-check/complete`, {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 applicationId: formData.applicationId
    //             })
    //         });

    //         clearInterval(stageInterval);

    //         const result = await response.json();

    //         if (response.ok && result.success) {
    //             // BRE completed with BSA data
    //             const status = result.data?.status || 'APPROVED';
    //             const decision = result.data;

    //             setBreDecision(decision);
    //             setFormData(prev => ({
    //                 ...prev,
    //                 balanceCheckComplete: true,
    //                 balanceCheckStatus: 'COMPLETED',
    //                 breStatus: status,
    //                 brePulled: true
    //             }));

    //             trackStepCompleted(2, 'Balance Check Consent - Complete');

    //             // Auto-advance to next step after showing result
    //             setTimeout(() => {
    //                 if (status === 'Approve') {
    //                     onNext();
    //                 }
    //             }, 2000);
    //         } else {
    //             setError(result.message || 'Balance check failed. Please try again.');
    //             trackAPIError('/api/balance-check/complete', result.message);
    //         }
    //     } catch (err: any) {
    //         const errorMsg = err?.message || 'Network error. Please try again.';
    //         setError(errorMsg);
    //         trackAPIError('/api/balance-check/complete', errorMsg);
    //     } finally {
    //         setProcessing(false);
    //     }
    // };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Bank Statement Verification
            </h2>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25B181]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            Account Aggregator Consent
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                            Share 6-month bank data for instant loan approval
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {processing ? (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                        >
                            <div className="text-center">
                                <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
                                <p className="text-sm font-semibold text-blue-800 mb-1">
                                    Processing Bank Statement
                                </p>
                                <p className="text-xs text-blue-600 mb-3">
                                    {processingStage}
                                </p>
                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-blue-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>This may take 30-60 seconds. Please wait...</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : breDecision ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`rounded-lg p-4 border ${
                                breDecision.status === 'Approve'
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                            }`}
                        >
                            <div className="text-center">
                                {breDecision.status === 'Approve' ? (
                                    <>
                                        <Award className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                        <p className="text-base font-bold text-green-800 mb-1">
                                            Congratulations! 🎉
                                        </p>
                                        <p className="text-sm text-green-700 mb-3">
                                            Your loan has been approved
                                        </p>
                                        {breDecision.loanAmount && (
                                            <div className="bg-white rounded-lg p-3 mb-2">
                                                <p className="text-xs text-gray-600 mb-1">Approved Amount</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    ₹{breDecision.loanAmount?.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                                        <p className="text-base font-bold text-red-800 mb-1">
                                            Application Not Approved
                                        </p>
                                        <p className="text-sm text-red-700">
                                            {breDecision.reason || 'Your application does not meet our eligibility criteria'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ) : consentComplete ? (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 rounded-lg p-4 border border-green-200 text-center"
                        >
                            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-green-800">
                                Bank Data Received Successfully
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                Starting analysis now...
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="consent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <p className="text-xs text-blue-800">
                                    <strong>Why we need this:</strong> Your bank statement helps us verify your income
                                    and approve your loan faster. This is RBI-regulated and 100% secure.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Shield className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                    <span>RBI-regulated data sharing</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                    <span>One-time consent (6 months data)</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                    <span>Read-only access — no transactions</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <TrendingUp className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                    <span>Improves approval chances by 20%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                    <span>Takes 30-60 seconds to complete</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <p className="text-xs text-red-700">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleInitiateConsent}
                                disabled={loading}
                                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Initiating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Share Bank Statement</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
                <button
                    onClick={onBack}
                    disabled={loading || processing}
                    className="px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
            </div>

            <p className="text-center text-[10px] sm:text-xs text-gray-500">
                Step 3 of 4: Basic Details → <span className="font-medium text-[#25B181]">Bank Statement</span> → Bank Verification
            </p>
        </motion.div>
    );
}
