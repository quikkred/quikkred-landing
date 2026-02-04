"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import CustomerLogin from "./CustomerLogin";
import { BlockedScreen, IPCheckLoading } from "../IPCheckScreen";
import StepIndicator from "./StepIndicator";
import { AnimatePresence } from "framer-motion";
import CheckEligibility from "../CheckEligibility";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import tracking from "@/lib/tracking";
import { TRACKING_EVENTS } from "@/lib/constants/quickApplyV2";
import { useApplication } from "@/contexts/ApplicationContext";
import { AlertCircle, Ban } from "lucide-react";
import BankVerification from "../BankVerification";
import ApproveMandate from "../ApproveMandate";
import ApplicationSuccess from "./ApplicationSuccess";

// export type FormStepsType = "eligibility" | "bank" | "mandate";
export type FormStepsType = "login" | "eligibility" | "bank" | "submit";

interface FormStepsProps {
    step: FormStepsType;
    formData: QuickApplyV2FormData;
    ipLoading: boolean;
    ipBlocked: boolean;
    blockType: 'vpn' | 'region' | 'error';
    blockState: string;
    setStep: (step: FormStepsType) => void;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    performIPCheck: () => void;
}

const FormSteps = ({
    step,
    formData,
    ipLoading = false,
    ipBlocked = false,
    blockType,
    blockState,
    setStep,
    setFormData,
    performIPCheck,
}: FormStepsProps) => {
    const { user } = useAuth();
    const { application } = useApplication();
    const isLogin = useMemo(() => (user?.isEmailVerified || user?.isMobileVerified), [user]);
    const currentStep = useMemo(() => (step === "eligibility" ? 2 : step === "bank" ? 3 : 1), [step]);

    const handleChangeStep = (nextStep: FormStepsType) => {
        if (nextStep === "eligibility") {
            tracking.trackEvent('STEP_COMPLETED', { stepNumber: 2, stepName: 'Check Eligibility' });
            tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.APPLICATION_SUBMITTED });
            tracking.linkToCustomer({ mobile: formData.mobile });
        } else if (nextStep === "bank") {
            tracking.trackEvent('STEP_COMPLETED', { stepNumber: 3, stepName: 'Bank Verification' });
        }
        setStep(nextStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }

    return <>
        <main className="flex-1 w-full max-w-lg mx-auto px-3 py-3 sm:py-6">
            {/* IP Check Loading */}
            {/* {stage === 'IP_CHECK' && ipLoading && <IPCheckLoading />} */}

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
                application?.isSubmit ? <ApplicationSuccess />: <>
                    {/* Step Indicator */}
                    <StepIndicator currentStep={currentStep} />

                    <RejectMessage />

                    {/* Form Card - Compact padding on mobile */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-6">
                        <AnimatePresence mode="wait">
                            {step === 'login' && (
                                <CustomerLogin 
                                    key={"login"}
                                />
                            )}

                            {step === 'eligibility' && (
                                <CheckEligibility
                                    key="eligibility"
                                    formData={formData}
                                    setFormData={setFormData}
                                    onNext={() => handleChangeStep("bank")}
                                />
                            )}

                            {step === 'bank' && (
                                <BankVerification
                                    key="bank"
                                    formData={formData}
                                    setFormData={setFormData}
                                    onNext={() => handleChangeStep("bank")}
                                    onBack={() => handleChangeStep("eligibility")}
                                />
                            )}

                            {/* {step === 'mandate' && (
                                <ApproveMandate
                                    key="mandate"
                                    formData={formData}
                                    setFormData={setFormData}
                                    onBack={() => handleChangeStep("bank")}
                                />
                            )} */}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </main>
    </>
}

const RejectMessage = () => {
    const { application } = useApplication();
    return (application && application.status === "REJECTED" && (
        <div className="mb-5 bg-red-100/50 border border-red-200 rounded-xl px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">

                {/* LEFT SIDE: Status & Message */}
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

                {/* RIGHT SIDE: Application Number (Data Top, Title Bottom) */}
                <div className="flex flex-col items-start sm:items-end border-t sm:border-t-0 border-red-100 pt-2 sm:pt-0 pl-8 sm:pl-0">
                    <span className="font-mono text-sm font-bold text-red-900 tracking-tight leading-none break-all">
                        {application.applicationNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mt-1">
                        Application No
                    </span>
                </div>

            </div>
        </div>
    ))
}

export default FormSteps