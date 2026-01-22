'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toast';
import { QuickApplyV2FormData, ApprovalDetails, ApplicationStage } from '@/lib/types/quickApplyV2';
import { getInitialFormData, TRACKING_EVENTS } from '@/lib/constants/quickApplyV2';
import { ipCheckService, IPCheckResponse } from '@/lib/services/ipCheck.service';
import { tracking } from '@/lib/tracking';

// Components
import { IPCheckLoading, BlockedScreen } from './components/IPCheckScreen';
import Page1BasicDetails from './components/Page1BasicDetails';
import Page2PANBank from './components/Page2PANBank';
import ApprovalProcessing from './components/ApprovalProcessing';
import PostApprovalBank from './components/PostApprovalBank';
import PostApprovalAadhaar from './components/PostApprovalAadhaar';
import PostApprovalSelfie from './components/PostApprovalSelfie';

// Compact Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: number }) {
    const steps = [
        { id: 1, label: 'Details' },
        { id: 2, label: 'Verify' },
        { id: 3, label: 'Approval' },
    ];

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 px-2">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex items-center gap-1.5">
                        <div
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step.id
                                    ? 'bg-[#25B181] text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <span
                            className={`text-xs sm:text-sm font-medium ${currentStep >= step.id ? 'text-[#25B181]' : 'text-gray-400'
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`w-6 sm:w-12 h-0.5 mx-1.5 sm:mx-2 rounded-full ${currentStep > step.id ? 'bg-[#25B181]' : 'bg-gray-200'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// Main Page Component
export default function QuickApplyV2Page() {
    // Stage Management
    const [stage, setStage] = useState<ApplicationStage>('IP_CHECK');
    const [currentStep, setCurrentStep] = useState(0);

    // Form Data
    const [formData, setFormData] = useState<QuickApplyV2FormData>(getInitialFormData);

    // IP Check States
    const [ipLoading, setIpLoading] = useState(true);
    const [ipBlocked, setIpBlocked] = useState(false);
    const [blockType, setBlockType] = useState<'vpn' | 'region' | 'error'>('error');
    const [blockState, setBlockState] = useState<string>('');

    // Approval Data
    const [approvalDetails, setApprovalDetails] = useState<ApprovalDetails | null>(null);

    // Initialize tracking and check IP on mount
    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        // Initialize tracking
        tracking.init();
        tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.PAGE_LOADED });

        // Check IP
        await performIPCheck();
    };

    const performIPCheck = async () => {
        setIpLoading(true);
        tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.IP_CHECK_STARTED });

        try {
            const result: IPCheckResponse = await ipCheckService.checkIP();

            if (!result.success) {
                setIpBlocked(true);
                setBlockType('error');
                tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.IP_CHECK_BLOCKED });
                return;
            }

            // Check for VPN
            if (result.data?.vpnDetected) {
                setIpBlocked(true);
                setBlockType('vpn');
                tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.VPN_DETECTED });
                return;
            }

            // Check serviceability
            if (result.blocked || !result.serviceable) {
                setIpBlocked(true);
                setBlockType('region');
                setBlockState(result.data?.state || '');
                tracking.trackEvent('CUSTOM_EVENT', {
                    event: TRACKING_EVENTS.IP_CHECK_BLOCKED,
                    state: result.data?.state,
                });
                return;
            }

            // Success - update form data with IP info
            setFormData(prev => ({
                ...prev,
                ipData: result.data || null,
                pincode: result.data?.pincode || prev.pincode,
                city: result.data?.city || prev.city,
                state: result.data?.state || prev.state,
            }));

            tracking.trackEvent('CUSTOM_EVENT', {
                event: TRACKING_EVENTS.IP_CHECK_PASSED,
                state: result.data?.state,
                city: result.data?.city,
            });

            // Move to Page 1
            setStage('PAGE_1');
            setCurrentStep(1);
        } catch (error) {
            console.error('IP check error:', error);
            // Don't block on error - allow user to proceed
            setStage('PAGE_1');
            setCurrentStep(1);
        } finally {
            setIpLoading(false);
        }
    };

    // Handle Page 1 completion
    const handlePage1Complete = () => {
        tracking.trackEvent('STEP_COMPLETED', { stepNumber: 1, stepName: 'Basic Details' });
        tracking.linkToCustomer({ mobile: formData.mobile });
        setStage('PAGE_2');
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle Page 2 completion (submit for approval)
    const handlePage2Complete = () => {
        tracking.trackEvent('STEP_COMPLETED', { stepNumber: 2, stepName: 'Verification' });
        tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.APPLICATION_SUBMITTED });
        setStage('BRE_PROCESSING');
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle approval
    const handleApproved = (details: ApprovalDetails) => {
        setApprovalDetails(details);
        tracking.trackEvent('CUSTOM_EVENT', {
            event: TRACKING_EVENTS.BRE_APPROVED,
            amount: details.approvedAmount,
        });
        setStage('POST_APPROVAL_BANK');
    };

    // Handle rejection
    const handleRejected = (reason: string) => {
        tracking.trackEvent('CUSTOM_EVENT', {
            event: TRACKING_EVENTS.BRE_REJECTED,
            reason,
        });
    };

    // Go back to Page 1
    const handleBackToPage1 = () => {
        setStage('PAGE_1');
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Post-Approval Navigation
    const handleBankComplete = () => {
        tracking.trackEvent('CUSTOM_EVENT', { event: 'BANK_DETAILS_COLLECTED' });
        setStage('POST_APPROVAL_AADHAAR');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAadhaarComplete = () => {
        tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.AADHAAR_VERIFIED });
        setStage('POST_APPROVAL_SELFIE');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSelfieComplete = () => {
        tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.SELFIE_CAPTURED });
        setStage('COMPLETED');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToApproval = () => {
        setStage('BRE_PROCESSING');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToBank = () => {
        setStage('POST_APPROVAL_BANK');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToAadhaar = () => {
        setStage('POST_APPROVAL_AADHAAR');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] flex flex-col">
            <Toaster />

            {/* Compact Header */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-lg mx-auto px-3 py-2.5 sm:py-3">
                    <div className="flex items-center justify-between">
                        <a href="/" className="flex items-center">
                            <img
                                src="/logo.svg"
                                alt="QuikKred"
                                className="h-7 sm:h-8"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling;
                                    if (fallback) (fallback as HTMLElement).style.display = 'block';
                                }}
                            />
                            <span className="hidden font-bold text-[#25B181] text-base">QuikKred</span>
                        </a>
                        <a
                            href="tel:+919311913854"
                            className="text-xs sm:text-sm text-gray-500 hover:text-[#25B181] flex items-center gap-1"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="hidden sm:inline">Help</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-lg mx-auto px-3 py-3 sm:py-6">
                {/* IP Check Loading */}
                {stage === 'IP_CHECK' && ipLoading && <IPCheckLoading />}

                {/* Blocked Screen */}
                {ipBlocked && (
                    <BlockedScreen
                        type={blockType}
                        state={blockState}
                        onRetry={blockType !== 'region' ? performIPCheck : undefined}
                    />
                )}

                {/* Main Flow */}
                {!ipLoading && !ipBlocked && (
                    <>
                        {/* Step Indicator */}
                        {['PAGE_1', 'PAGE_2', 'BRE_PROCESSING'].includes(stage) && (
                            <StepIndicator currentStep={currentStep} />
                        )}

                        {/* Form Card - Compact padding on mobile */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-6">
                            <AnimatePresence mode="wait">
                                {stage === 'PAGE_1' && (
                                    <Page1BasicDetails
                                        key="page1"
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handlePage1Complete}
                                    />
                                )}

                                {stage === 'PAGE_2' && (
                                    <Page2PANBank
                                        key="page2"
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handlePage2Complete}
                                        onBack={handleBackToPage1}
                                    />
                                )}

                                {stage === 'BRE_PROCESSING' && (
                                    <ApprovalProcessing
                                        key="approval"
                                        formData={formData}
                                        onApproved={handleApproved}
                                        onRejected={handleRejected}
                                    />
                                )}

                                {stage === 'POST_APPROVAL_BANK' && approvalDetails && (
                                    <PostApprovalBank
                                        key="post-bank"
                                        formData={formData}
                                        approvalDetails={approvalDetails}
                                        setFormData={setFormData}
                                        onNext={handleBankComplete}
                                        onBack={handleBackToApproval}
                                    />
                                )}

                                {stage === 'POST_APPROVAL_AADHAAR' && approvalDetails && (
                                    <PostApprovalAadhaar
                                        key="post-aadhaar"
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handleAadhaarComplete}
                                        onBack={handleBackToBank}
                                    />
                                )}

                                {stage === 'POST_APPROVAL_SELFIE' && approvalDetails && (
                                    <PostApprovalSelfie
                                        key="post-selfie"
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handleSelfieComplete}
                                        onBack={handleBackToAadhaar}
                                    />
                                )}

                                {stage === 'COMPLETED' && approvalDetails && (
                                    <div key="completed" className="text-center py-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#25B181]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#25B181]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                            KYC Completed!
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                                            Money will be credited shortly.
                                        </p>
                                        <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-xl p-3 sm:p-4 mb-4">
                                            <p className="text-xs sm:text-sm text-gray-600">Amount to be credited</p>
                                            <p className="text-xl sm:text-2xl font-bold text-[#25B181]">
                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                    minimumFractionDigits: 0,
                                                }).format(approvalDetails.netDisbursalAmount)}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Application: {localStorage.getItem('applicationNumber') || 'N/A'}
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/dashboard'}
                                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] touch-manipulation"
                                        >
                                            Go to Dashboard
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </main>

            {/* Compact Footer */}
            <footer className="bg-white border-t border-gray-100 mt-auto">
                <div className="max-w-lg mx-auto px-3 py-3 sm:py-4">
                    <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <span>Satsai Finlease Pvt Ltd</span>
                            <span>•</span>
                            <span>RBI: B-14.01646</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="/privacy-policy" className="hover:text-[#25B181]">Privacy</a>
                            <a href="/terms-and-conditions" className="hover:text-[#25B181]">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
