"use client"

import { useEffect, useMemo } from "react";
import { useRouter } from "nextjs-toploader/app";
import CustomerLogin from "./CustomerLogin";
import { BlockedScreen, IPCheckLoading } from "../IPCheckScreen";
import StepIndicator from "./StepIndicator";
import { AnimatePresence } from "framer-motion";
import CheckEligibility from "../CheckEligibility";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import tracking from "@/lib/tracking";
import { TRACKING_EVENTS } from "@/lib/constants/quickApplyV2";
import { useApplication } from "@/contexts/ApplicationContext";
import { AlertCircle } from "lucide-react";
import BankVerification from "../BankVerification";

// export type FormStepsType = "eligibility" | "bank" | "mandate";
export type FormStepsType = "login" | "eligibility" | "bank" | "submit";

interface FormStepsProps {
    step: FormStepsType;
    formData: QuickApplyV2FormData;
    ipLoading: boolean;
    ipBlocked: boolean;
    blockType: 'vpn' | 'region' | 'error';
    blockState: string;
    isFreshReapply?: boolean;
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
    isFreshReapply = false,
    setStep,
    setFormData,
    performIPCheck,
}: FormStepsProps) => {
    const { application, loading: applicationLoading } = useApplication();
    const router = useRouter();

    // Gate the /application-status redirect on the CURRENT application's own
    // `isSubmit`, not the global `user.isSubmit`. `user.isSubmit` persists across
    // cycles, so for a returning customer it's already true while they reapply —
    // and the moment BRE is pulled at "Proceed to Bank" (brePulled flips true,
    // status leaves PENDING) the old guard treated the in-progress app as
    // submitted and yanked them to /application-status, cutting off bank
    // verification. (Also drives the "redirecting" spinner below, so a fresh
    // reapply never gets stuck on it.)
    //
    // CRUCIALLY, also require `breHistory.brePulled` for THIS cycle. On a first
    // reapply the backend leaves the previous cycle's `isSubmit = true` (only the
    // user-level flag is reset on the dashboard), so gating on `isSubmit` alone
    // redirected the reapply straight to /application-status as "approved" —
    // skipping eligibility entirely, so `v2/bre/initialize` was never called and
    // the application was "completed" without a BRE response. A fresh reapply has
    // brePulled = false, so requiring it forces the applicant through eligibility
    // (which runs BRE) before any completion redirect. This matches the same
    // per-cycle gate used by `alreadyApproved` / `alreadyOnHold` in
    // FinFactorVerify and `breDecidedThisCycle` in the apply page.
    const shouldGoToStatus = useMemo(() => {
        // On a fresh reapply, ignore the "already submitted" resume redirect until
        // the applicant actually reaches the submit step. The backend can briefly
        // still return the PREVIOUS cycle's application (isSubmit + brePulled both
        // true), which would otherwise yank the reapply to /application-status and
        // skip eligibility/BRE entirely. Once they complete the bank step,
        // step === "submit" and the redirect is allowed through normally.
        if (isFreshReapply && step !== "submit") return false;
        return !!application?.isSubmit && !!application?.breHistory?.brePulled;
    }, [application?.isSubmit, application?.breHistory?.brePulled, isFreshReapply, step]);

    // Once the application is submitted, send the applicant to the dedicated
    // /application-status page instead of rendering the success/status screen
    // inline within /apply/quick. Wait for the application to finish loading so
    // the correct approved/rejected status is shown.
    useEffect(() => {
        if (ipLoading || ipBlocked) return;
        if (applicationLoading) return;
        if (!shouldGoToStatus) return;
        if (typeof window === 'undefined') return;

        const isRejected =
            (application?.status || '').toUpperCase() === 'REJECTED' ||
            application?.breHistory?.breStatus === 'REJECTED';

        localStorage.setItem(
            'applicationStatusData',
            JSON.stringify({
                status: isRejected ? 'rejected' : 'approved',
                loanNumber: application?.applicationNumber || '',
                amount: isRejected
                    ? ''
                    : String(formData?.approvedLoanAmount ?? application?.approvedLoanAmount ?? ''),
                reason: isRejected
                    ? application?.breHistory?.breStatus === 'REJECTED'
                        ? 'Bank statement verification was not approved.'
                        : 'Your application does not meet eligibility criteria.'
                    : '',
            })
        );

        router.replace('/application-status');
    }, [shouldGoToStatus, applicationLoading, ipLoading, ipBlocked, application, formData?.approvedLoanAmount, router]);

    const currentStep = useMemo(() => {
        if (step === "bank") return 3;
        if (step === "eligibility") return 2;
        // If basic+kyc details are filled (from API), show step 2 indicator
        if (formData?.isBasicDetailsFilled && formData?.isKycDetailsFilled) return 2;
        return 1;
    }, [step, formData?.isBasicDetailsFilled, formData?.isKycDetailsFilled]);

    const handleChangeStep = (nextStep: FormStepsType) => {
        if (nextStep === "eligibility") {
            tracking.trackEvent('STEP_COMPLETED', { stepNumber: 2, stepName: 'Check Eligibility' });
            tracking.trackEvent('CUSTOM_EVENT', { event: TRACKING_EVENTS.APPLICATION_SUBMITTED });
            tracking.linkToCustomer({ mobile: formData.mobile });
        } else if (nextStep === "bank") {
            tracking.trackEvent('STEP_COMPLETED', { stepNumber: 3, stepName: 'Bank Verification' });
        } else if (nextStep === "submit") {
            tracking.trackEvent('STEP_COMPLETED', { stepNumber: 4, stepName: 'Application Submitted' });
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
                /* `step === "submit"` is the moment the bank step posted isSubmit:true
                   and called onNext(). There's no inline UI for it — we hold a
                   spinner while the application refetches (isSubmit + brePulled) and
                   the effect above redirects to /application-status, so the card
                   never flashes blank between submit and redirect. */
                (shouldGoToStatus || step === "submit") ? (
                    /* Redirecting to /application-status (see effect above) */
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : <>
                    {/* Step Indicator */}
                    <StepIndicator currentStep={currentStep} />

                    <RejectMessage application={application} />

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
                                    onNext={() => handleChangeStep("submit")}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </main>
    </>
}

const RejectMessage = ({ application }: { application: any }) => {
    const isRejected = application?.status === "REJECTED" || application?.breHistory?.breStatus === "REJECTED";
    const rejectReason = application?.breHistory?.breStatus === "REJECTED"
        ? "Bank statement verification was not approved."
        : "Your application does not meet eligibility criteria.";

    return (application && isRejected && (
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
                            {rejectReason}
                        </p>
                        <p className="text-[11px] text-red-600 font-medium mt-0.5">
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