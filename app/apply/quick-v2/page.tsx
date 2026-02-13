'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toast';
import { QuickApplyV2FormData, ApprovalDetails, ApplicationStage } from '@/lib/types/quickApplyV2';
import { getInitialFormData, TRACKING_EVENTS } from '@/lib/constants/quickApplyV2';
import { ipCheckService, IPCheckResponse } from '@/lib/services/ipCheck.service';
import { tracking } from '@/lib/tracking';

// Components
import { IPCheckLoading, BlockedScreen } from './components/IPCheckScreen';
import Page2PANBank from './components/Page2PANBank';
// import ApprovalProcessing from './components/ApprovalProcessing';
// import PostApprovalBank from './components/PostApprovalBank';
// import PostApprovalAadhaar from './components/PostApprovalAadhaar';
// import PostApprovalSelfie from './components/PostApprovalSelfie';
import { useAuth } from '@/contexts/AuthContext';
import StepIndicator from './components/ui/StepIndicator';
import Page3BankDetails from './components/BankVerification';
import useStorage from '@/hooks/useStorage';
// import Page4Approval from './components/ApproveMandate';
import { StorageApplicationForm } from '@/interfaces/storageInterface';
import { useApplication } from '@/contexts/ApplicationContext';
import CustomerLogin from './components/ui/CustomerLogin';

// setps
import CheckEligibility from './components/CheckEligibility';
import FormSteps, { FormStepsType } from './components/ui/FormSteps';

// Main Page Component
export default function QuickApplyV2Page() {
    // Stage Management
    const [stage, setStage] = useState<ApplicationStage>('IP_CHECK');
    const [step, setStep] = useState<FormStepsType>("login");
    // const [currentStep, setCurrentStep] = useState(0);
    const { user } = useAuth();
    // const storage = useStorage();
    // const breForm = useMemo<StorageApplicationForm | null>(() => ((storage.data?.breForm as StorageApplicationForm) || null), [storage]);
    const { application } = useApplication();
    // console.log("application:", application);
    // console.log("user", user);

    // Form Data
    const [formData, setFormData] = useState<QuickApplyV2FormData>(getInitialFormData);

    // IP Check States
    const [ipLoading, setIpLoading] = useState(true);
    const [ipBlocked, setIpBlocked] = useState(false);
    const [blockType, setBlockType] = useState<'vpn' | 'region' | 'error'>('error');
    const [blockState, setBlockState] = useState<string>('');

    // Approval Data
    const [approvalDetails, setApprovalDetails] = useState<ApprovalDetails | null>(null);
    const formatDOB = (isoDate?: string) => isoDate ? isoDate.split("T")[0] : "";

    // Combined Logic for Routing and Form Population
    // 1. Add this at the top of your component
    const hasAutoRouted = useRef(false);

    useEffect(() => {
        // A. Wait for IP check to finish
        if (ipLoading || ipBlocked) return;

        // B. Handle User Data Population
        if (user || application) {
            const rate = ((typeof application?.interestRate === "string" ? parseFloat(application?.interestRate) : (application?.interestRate || 1)) / 100) || 0.01; // 1% per day
            const approvedLoanAmount = (typeof application?.approvedLoanAmount === "string" ? parseInt(application?.approvedLoanAmount) : application?.approvedLoanAmount) || 0;
            const tenure = (typeof application?.tenure === "string" ? parseInt(application?.tenure) : application?.tenure) || 15;
            const interestAmount = rate * approvedLoanAmount * tenure;
            const processingFee = (approvedLoanAmount * 0.1) || 0;
            const gstOnProcessingFee = (processingFee * 0.18) || 0;
            const netDisbursal = approvedLoanAmount - (processingFee + gstOnProcessingFee);
            const totalRepayment = approvedLoanAmount + interestAmount;

            setFormData((prev) => ({
                ...prev,
                customerId: user?.id || "",
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                fullName: user?.fullName || "",
                email: user?.email || "",
                emailVerified: user?.isEmailVerified || false,
                mobile: user?.mobile || "",
                mobileVerified: user?.isMobileVerified || false,
                pan: user?.pan || "",
                aadhaar: user?.aadhaar || "",
                dob: formatDOB(user?.dateOfBirth) || "",
                panVerified: user?.isPanVerify || false,
                aadhaarVerified: user?.isAadhaarVerify || false,
                monthlyIncome: user?.monthlyIncome || "",
                employmentType: (user?.employmentType as "SALARIED" | "SELF-EMPLOYED") || "SALARIED",
                selfie: (user?.profile?.s3URL as string) || "",
                selfieVerified: user?.profile?.status === "VERIFIED",
                brePulled: application?.breHistory?.brePulled || user?.brePulled || false,
                companyName: user?.companyName || "",
                breStatus: application?.status || "PENDING",
                productId: application?.productId || "",

                // bank
                bankName: user?.bankName || "",
                accountHolderName: user?.accountHolderName || "",
                accountNumber: user?.accountNumber || "",
                ifsc: user?.ifsc || "",
                bankVerified: user?.bankVerified || false,

                // bre form
                loanAmount: application?.requestedLoanAmount || 0,
                approvedLoanAmount,
                tenure: application?.tenure || 0,
                tenureUnit: application?.tenureUnit || "Days",
                netDisbursalAmount: netDisbursal || application?.netDisbursalAmount || 0,
                interestRate: application?.interestRate || 0,
                totalInterest: application?.totalInterest || 0,
                processingFee: processingFee || application?.processingFee || 0,
                totalRepayment: totalRepayment || application?.totalRepayment || 0,
                gstOnProcessingFee: gstOnProcessingFee || application?.gstOnProcessingFee || 0,
                interestAmount,
            }));

            const isLogin = user?.isEmailVerified || user?.isMobileVerified;
            // const isLogin = user?.isMobileVerified;
            const brePulled = application?.breHistory?.brePulled || user?.brePulled || false;
            const eligibilityStep = isLogin && brePulled && application && application?.status !== "REJECTED" && application?.status !== "PROCEED TO BANK";
            // const eligibilityStep = isLogin && application && application?.status !== "REJECTED";

            if (eligibilityStep) {
                setStep("bank");
            } else if (isLogin) {
                setStep("eligibility");
            }
        }

        // D. GUEST FLOW: If no user and still stuck in IP_CHECK, move to Page 1
        // if (!user && stage === 'IP_CHECK' && !hasAutoRouted.current) {
        //     setStage('PAGE_1');
        //     setCurrentStep(1);
        //     hasAutoRouted.current = true;
        //     return;
        // }
    }, [user, ipLoading, ipBlocked, stage, application]);

    // Initialize tracking and check IP on mount
    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        setIpBlocked(false);
        setIpLoading(false);
        setBlockType('region');

        return;
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
                return;
            }

            if (result.data?.vpnDetected) {
                setIpBlocked(true);
                setBlockType('vpn');
                return;
            }

            if (result.blocked || !result.serviceable) {
                setIpBlocked(true);
                setBlockType('region');
                setBlockState(result.data?.state || '');
                return;
            }

            // Success - update form data
            setFormData(prev => ({
                ...prev,
                ipData: result.data || null,
                pincode: result.data?.pincode || prev.pincode,
                city: result.data?.city || prev.city,
                state: result.data?.state || prev.state,
            }));
        } catch (error) {
            console.error('IP check error:', error);
        } finally {
            setIpLoading(false);
        }
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
            <FormSteps
                key={"form-steps"}
                step={step}
                setStep={setStep}
                blockState={blockState}
                blockType={blockType}
                formData={formData}
                setFormData={setFormData}
                ipBlocked={ipBlocked}
                ipLoading={ipLoading}
                performIPCheck={performIPCheck}
            />

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