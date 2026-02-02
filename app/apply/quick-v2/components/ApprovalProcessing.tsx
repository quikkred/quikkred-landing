'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Loader2, CheckCircle, XCircle, Clock,
    IndianRupee, Calendar, ArrowRight, Home
} from 'lucide-react';
import { QuickApplyV2FormData, BREDecision, ApprovalDetails } from '@/lib/types/quickApplyV2';
import { formatCurrency, formatDate, calculateLoanDetails, TIMERS } from '@/lib/constants/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';
import getToken from '@/lib/getToken';

// MOCK MODE - Set to false for production with real APIs
const MOCK_MODE = false;

interface ApprovalProps {
    formData: QuickApplyV2FormData;
    onApproved: (details: ApprovalDetails) => void;
    onRejected: (reason: string) => void;
}

type ProcessingStep = {
    id: string;
    label: string;
    status: 'pending' | 'loading' | 'done' | 'error';
};

export default function ApprovalProcessing({
    formData,
    onApproved,
    onRejected,
}: ApprovalProps) {
    const [status, setStatus] = useState<'processing' | 'approved' | 'rejected'>('processing');
    const [steps, setSteps] = useState<ProcessingStep[]>([
        { id: 'pan', label: 'Verifying PAN details', status: 'done' },
        { id: 'credit', label: 'Checking credit score', status: 'loading' },
        { id: 'income', label: 'Analyzing income profile', status: 'pending' },
        { id: 'decision', label: 'Final decision', status: 'pending' },
    ]);
    const [approvalDetails, setApprovalDetails] = useState<ApprovalDetails | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string>('');
    const [redirectCountdown, setRedirectCountdown] = useState(10);
    const [pollCount, setPollCount] = useState(0);

    // Tracking
    const {
        trackStepViewed,
        trackBREProcessingStarted,
        trackBREStepCompleted,
        trackBREApproved,
        trackBRERejected,
        trackAPIError,
    } = useQuickApplyTracking();

    // Track BRE processing start
    const hasTrackedRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedRef.current) {
            hasTrackedRef.current = true;
            trackStepViewed(3, 'BRE Processing');
            trackBREProcessingStarted();
        }
    }, [trackStepViewed, trackBREProcessingStarted]);

    // Polling for BRE status
    useEffect(() => {
        // MOCK MODE - Skip API polling and simulate processing
        if (MOCK_MODE) {
            simulateProcessing();
            return;
        }

        const applicationId = localStorage.getItem('applicationId');
        if (!applicationId) {
            simulateProcessing();
            return;
        }

        const pollBREStatus = async () => {
            try {
                const token = await getToken();
                const response = await fetch(
                    `${API_BASE_URL}/api/loan/status/${applicationId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (data.success) {
                    if (data.status === 'APPROVED') {
                        handleApproval(data.data);
                    } else if (data.status === 'REJECTED') {
                        handleRejection(data.data?.reason || 'Application not approved');
                    } else if (data.status === 'PROCESSING') {
                        updateSteps(data.data?.step || pollCount);
                        setPollCount(prev => prev + 1);
                    }
                }
            } catch (error) {
                trackAPIError('/api/loan/status', 'BRE poll error');
            }
        };

        const pollInterval = setInterval(() => {
            if (pollCount < 20 && status === 'processing') {
                pollBREStatus();
            } else if (pollCount >= 20) {
                simulateApproval();
                clearInterval(pollInterval);
            }
        }, TIMERS.BRE_POLL_INTERVAL);

        return () => clearInterval(pollInterval);
    }, [pollCount, status]);

    // Simulate processing for demo
    const simulateProcessing = () => {
        const stepTimings = [1000, 3000, 5000, 7000];
        const stepNames = ['pan', 'credit', 'income', 'decision'];

        stepTimings.forEach((timing, index) => {
            setTimeout(() => {
                setSteps(prev => prev.map((step, i) => ({
                    ...step,
                    status: i < index + 1 ? 'done' : i === index + 1 ? 'loading' : 'pending',
                })));

                // Track BRE step completion
                if (index > 0) {
                    trackBREStepCompleted(stepNames[index - 1]);
                }

                if (index === stepTimings.length - 1) {
                    setTimeout(() => simulateApproval(), 2000);
                }
            }, timing);
        });
    };

    // Update steps based on progress
    const updateSteps = (step: number) => {
        setSteps(prev => prev.map((s, i) => ({
            ...s,
            status: i < step ? 'done' : i === step ? 'loading' : 'pending',
        })));
    };

    // Simulate approval for demo
    const simulateApproval = () => {
        const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

        const details: ApprovalDetails = {
            loanAmount: formData.loanAmount,
            approvedAmount: formData.loanAmount,
            interestRate: 1,
            tenure: formData.tenure,
            processingFee: loanCalc.processingFee,
            gstOnProcessingFee: loanCalc.gstOnProcessingFee,
            totalInterest: loanCalc.totalInterest,
            totalRepayment: loanCalc.totalRepayment,
            netDisbursalAmount: loanCalc.netDisbursalAmount,
            dueDate: loanCalc.dueDate,
        };

        handleApproval(details);
    };

    // Handle approval
    const handleApproval = (details: ApprovalDetails | BREDecision) => {
        const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

        const approvalData: ApprovalDetails = {
            loanAmount: formData.loanAmount,
            approvedAmount: (details as any).approvedAmount || formData.loanAmount,
            interestRate: 1,
            tenure: formData.tenure,
            processingFee: loanCalc.processingFee,
            gstOnProcessingFee: loanCalc.gstOnProcessingFee,
            totalInterest: loanCalc.totalInterest,
            totalRepayment: loanCalc.totalRepayment,
            netDisbursalAmount: loanCalc.netDisbursalAmount,
            dueDate: loanCalc.dueDate,
        };

        // Track BRE approval
        trackBREApproved({
            approvedAmount: approvalData.approvedAmount,
            netDisbursalAmount: approvalData.netDisbursalAmount,
            tenure: approvalData.tenure,
        });

        setApprovalDetails(approvalData);
        setStatus('approved');
        setSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
    };

    // Handle rejection
    const handleRejection = (reason: string) => {
        // Track BRE rejection
        trackBRERejected(reason);

        setRejectionReason(reason);
        setStatus('rejected');
        setSteps(prev => prev.map((s, i) =>
            i === prev.length - 1 ? { ...s, status: 'error' } : { ...s, status: 'done' }
        ));
    };

    // Rejection countdown
    useEffect(() => {
        if (status === 'rejected' && redirectCountdown > 0) {
            const timer = setTimeout(() => setRedirectCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (status === 'rejected' && redirectCountdown === 0) {
            window.location.href = '/';
        }
    }, [status, redirectCountdown]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center"
        >
            <div className="w-full">
                {/* Processing State */}
                {status === 'processing' && (
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                        <div className="text-center mb-4 sm:mb-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#25B181]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#25B181] animate-spin" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Checking Eligibility</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Please wait while we process your application</p>
                        </div>

                        {/* Progress Steps */}
                        <div className="space-y-2 sm:space-y-3">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg transition-all ${step.status === 'loading' ? 'bg-[#25B181]/10' :
                                            step.status === 'done' ? 'bg-green-50' :
                                                'bg-gray-50'
                                        }`}
                                >
                                    {step.status === 'loading' && (
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181] animate-spin flex-shrink-0" />
                                    )}
                                    {step.status === 'done' && (
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181] flex-shrink-0" />
                                    )}
                                    {step.status === 'pending' && (
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                    {step.status === 'error' && (
                                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                                    )}
                                    <span className={`text-xs sm:text-sm font-medium ${step.status === 'loading' ? 'text-[#25B181]' :
                                            step.status === 'done' ? 'text-[#25B181]' :
                                                step.status === 'error' ? 'text-red-700' :
                                                    'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-4 sm:mt-6">
                            This usually takes 15-30 seconds
                        </p>
                    </div>
                )}

                {/* Approved State */}
                {status === 'approved' && approvalDetails && (
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                        <div className="text-center mb-4 sm:mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.5 }}
                                className="w-14 h-14 sm:w-20 sm:h-20 bg-[#25B181]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                            >
                                <CheckCircle className="w-7 h-7 sm:w-10 sm:h-10 text-[#25B181]" />
                            </motion.div>
                            <h2 className="text-lg sm:text-xl font-bold text-[#25B181]">Loan Approved!</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                Congratulations {formData.fullName}! Your loan has been approved.
                            </p>
                        </div>

                        {/* Loan Details */}
                        <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Loan Amount</span>
                                <span className="text-sm sm:text-lg font-bold text-gray-900">
                                    {formatCurrency(approvalDetails.loanAmount)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Platform Fee (10%)</span>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                    {formatCurrency(approvalDetails.processingFee)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">GST (18%)</span>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                    {formatCurrency(approvalDetails.gstOnProcessingFee)}
                                </span>
                            </div>

                            <div className="border-t border-[#25B181]/30 my-1.5 sm:my-2"></div>

                            <div className="flex justify-between items-center bg-[#25B181]/20 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 sm:py-3">
                                <span className="text-xs sm:text-sm font-semibold text-[#1F8F68] flex items-center gap-1.5 sm:gap-2">
                                    <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    You&apos;ll Receive
                                </span>
                                <span className="text-base sm:text-xl font-bold text-[#25B181]">
                                    {formatCurrency(approvalDetails.netDisbursalAmount)}
                                </span>
                            </div>

                            <div className="border-t border-[#25B181]/30 my-1.5 sm:my-2"></div>

                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Total Repayment</span>
                                <span className="text-sm sm:text-lg font-bold text-gray-900">
                                    {formatCurrency(approvalDetails.totalRepayment)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center bg-red-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 sm:py-3 rounded-b-lg sm:rounded-b-xl">
                                <span className="text-xs sm:text-sm font-semibold text-red-800 flex items-center gap-1.5 sm:gap-2">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    Due Date
                                </span>
                                <span className="text-sm sm:text-base font-bold text-red-700">
                                    {formatDate(approvalDetails.dueDate)}
                                </span>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={() => onApproved(approvalDetails)}
                            className="w-full mt-4 sm:mt-6 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                        >
                            Complete KYC to Get Money
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                )}

                {/* Rejected State */}
                {status === 'rejected' && (
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                        <div className="text-center mb-4 sm:mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.5 }}
                                className="w-14 h-14 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                            >
                                <XCircle className="w-7 h-7 sm:w-10 sm:h-10 text-red-500" />
                            </motion.div>
                            <h2 className="text-lg sm:text-xl font-bold text-red-700">Application Declined</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                Sorry, we couldn&apos;t approve your application at this time.
                            </p>
                        </div>

                        <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-red-700 font-medium">Reason:</p>
                            <p className="text-xs sm:text-sm text-red-600 mt-1">{rejectionReason}</p>
                        </div>

                        <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                            You can reapply after 90 days. Application ID:{' '}
                            <span className="font-mono text-[10px] sm:text-xs">{localStorage.getItem('applicationNumber') || 'N/A'}</span>
                        </p>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full py-3 sm:py-3.5 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base hover:bg-gray-200 flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                        >
                            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                            Go to Home ({redirectCountdown}s)
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
