"use client";

import { useApplication } from "@/contexts/ApplicationContext";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState, useRef, useMemo } from "react";
import FinFactorStatus from "./FinFactorStatus";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "@/components/ui/toast";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { VALIDATION } from "@/lib/constants/quickApplyV2";
import { useKycStatus } from "@/lib/contexts/KycStatusContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import useLocation from "@/hooks/useLocation";
import useFlowMode from "@/hooks/useFlowMode";
import { normalizeBreStatus } from "@/lib/constants/flowConfig";
import { isTestMode } from "@/lib/testMode";

interface FinFactorVerifyProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
}

// Frontend-defined copy shown to the applicant per eligibility outcome — we
// intentionally do NOT surface the raw backend message/reason.
const ELIGIBILITY_COPY = {
    approved: {
        title: "Congratulations, you're eligible!",
        description:
            "Your application meets our criteria. Continue to complete your verification.",
    },
    "proceed-to-bank": {
        title: "One quick step to go",
        description:
            "We need to securely verify your bank account to finish checking your eligibility.",
    },
    rejected: {
        title: "Application not approved",
        description:
            "Unfortunately, your application doesn't meet our current eligibility criteria. You can re-apply after 60 days.",
    },
} as const;

const FinFactorVerify = ({ formData, setFormData, onNext }: FinFactorVerifyProps) => {
    const axios = useAxios();
    const router = useRouter();
    const { getApplication, application, getCustomer } = useApplication();
    const searchParams = useSearchParams();
    const { updateKycStatusState } = useKycStatus();
    const { user, updateUser } = useAuth();
    const { location, getLocation } = useLocation();
    const { mode: flowMode } = useFlowMode();

    // True when the applicant is already approved (from form state or the loaded
    // application). Used to skip re-running eligibility — a re-run could flip an
    // approved decision to rejected.
    const alreadyApproved = useMemo(() => {
        // Only treat as already-decided if BRE was pulled for THIS application.
        // A fresh reapply has breHistory.brePulled = false and must run BRE again,
        // so we must not short-circuit on a previous cycle's status.
        if (!(application as any)?.breHistory?.brePulled) return false;
        const isApproved = (s?: string) => normalizeBreStatus(s) === "approved";
        return (
            isApproved((application as any)?.status) ||
            isApproved((application as any)?.breHistory?.breStatus)
        );
    }, [application]);

    // True when the application is on HOLD / Proceed-to-Bank (under review).
    // Used to show a "contact support" popup on re-entry instead of re-running
    // eligibility.
    const alreadyOnHold = useMemo(() => {
        // Same cycle-gate as alreadyApproved — don't short-circuit a reapply.
        if (!(application as any)?.breHistory?.brePulled) return false;
        const isHold = (s?: string) =>
            (s || "").toUpperCase() === "HOLD" || normalizeBreStatus(s) === "proceed-to-bank";
        return (
            isHold((application as any)?.status) ||
            isHold((application as any)?.breHistory?.breStatus)
        );
    }, [application]);

    // Show the approval modal (with the approved offer details) and only advance
    // to the next step after the applicant accepts. Used both for the live
    // approve decision and the already-approved short-circuit, so an approved
    // applicant always sees how much was approved before continuing.
    const showApprovalModal = () => {
        updateKycStatusState({
            loading: false,
            visibility: true,
            status: "approved",
            title: ELIGIBILITY_COPY.approved.title,
            description: ELIGIBILITY_COPY.approved.description,
            data: {
                applicationNumber: (application as any)?.applicationNumber,
                applicationId: (application as any)?._id || (application as any)?.applicationId,
                status: "Approve",
                reason: ELIGIBILITY_COPY.approved.description,
                loanAmount: formData.approvedLoanAmount || formData.loanAmount,
                tenure: formData.tenure,
                tenureUnit: formData.tenureUnit,
                totalInterest: formData.totalInterest,
                totalRepayment: formData.totalRepayment,
                netDisbursalAmount: formData.netDisbursalAmount,
                interestRate: formData.interestRate,
            },
            onSuccess: () => {
                onNext();
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
        });
    };

    // Show the "account under review" (HOLD) popup — used when the applicant is
    // already in a Proceed-to-Bank/HOLD state, so we don't re-run eligibility.
    const showHoldModal = () => {
        updateKycStatusState({
            loading: false,
            visibility: true,
            status: "pending",
            title: "Your account is under review",
            description: "Your account is under review. Please complete your bank verification to proceed.",
            data: {
                applicationNumber: (application as any)?.applicationNumber,
                applicationId: (application as any)?._id || (application as any)?.applicationId,
                status: "HOLD",
                reason: "Your account is under review. Please complete your bank verification to proceed.",
            },
            // After a successful upload, close the popup and refresh context.
            onSuccess: () => {
                getApplication();
                getCustomer();
            },
        });
    };

    // Map a decision payload (Approve / Reject / Proceed-to-Bank) to the result
    // modal. Shared by the BRE flow and the SurePass AA store step.
    const showDecisionModal = (decision: any) => {
        const status = normalizeBreStatus(decision?.status);
        const copy = ELIGIBILITY_COPY[status];

        setFormData((prev) => ({
            ...prev,
            breStatus: status === "proceed-to-bank" ? "HOLD" : decision?.status,
            brePulled: true,
        }));

        updateKycStatusState({
            loading: false,
            visibility: true,
            status,
            title: copy.title,
            description: copy.description,
            data: {
                applicationNumber: decision?.applicationNumber,
                applicationId: decision?.applicationId,
                status: decision?.status,
                reason: copy.description,
                loanAmount: decision?.loanAmount ?? formData.approvedLoanAmount ?? formData.loanAmount,
                tenure: decision?.tenure ?? formData.tenure,
                tenureUnit: decision?.tenureUnit ?? formData.tenureUnit,
                totalInterest: decision?.totalInterest ?? formData.totalInterest,
                totalRepayment: decision?.totalRepayment ?? formData.totalRepayment,
                netDisbursalAmount: decision?.netDisbursalAmount ?? formData.netDisbursalAmount,
                interestRate: decision?.interestRate ?? formData.interestRate,
            },
            onSuccess: () => {
                onNext();
                getApplication();
                getCustomer();
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
        });
    };

    // SurePass AA — after the consent flow returns to
    // /apply/quick?surepassAA=success, we wait 30s (handled by the effect below)
    // then store the fetched AA data and surface the resulting decision.
    const storeSurepassData = async (customerId: string, applicationId: string) => {
        try {
            const response = await axios.post(`/api/surepassAA/storeData`, {
                customerId,
                applicationId,
            });
            const result = response.data;

            getCustomer();
            getApplication();

            const decision = result?.data;
            if ((response.status === 200 || response.status === 201) && decision?.status) {
                showDecisionModal(decision);
            } else {
                updateKycStatusState({ visibility: false, loading: false });
                toast({ variant: "success", title: "Verification submitted", description: result?.message || "Your bank data has been received." });
            }
        } catch (error: unknown) {
            updateKycStatusState({ visibility: false, loading: false });
            const message =
                error instanceof AxiosError
                    ? error.response?.data?.message || "Could not complete bank verification."
                    : "Something went wrong";
            toast({ variant: "error", title: "Error", description: message });
        }
    };

    // On return from SurePass AA consent, wait 30 seconds then store the data.
    const surepassHandled = useRef(false);
    const surepassStored = useRef(false);
    useEffect(() => {
        if (surepassHandled.current) return;
        if (searchParams.get("surepassAA") !== "success") return;

        const customerId = user?.id;
        const applicationId = (application as any)?._id || formData.applicationId;
        if (!customerId || !applicationId) return; // wait until user/application load

        surepassHandled.current = true;
        // Strip the param so a manual refresh can't re-trigger the store step.
        window.history.replaceState({}, "", window.location.pathname);

        // Show a processing modal during the 30s wait, then store the AA data.
        updateKycStatusState({ visibility: true, loading: true });

        // IMPORTANT: do NOT clear this timer on cleanup. React StrictMode (dev)
        // mounts → unmounts → remounts, and a cleanup clearTimeout would cancel
        // the scheduled store call so /api/surepassAA/storeData never fires.
        // surepassStored dedupes the actual call instead.
        setTimeout(() => {
            if (surepassStored.current) return;
            surepassStored.current = true;
            storeSurepassData(customerId, applicationId);
        }, 30000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, user?.id, application]);

    const [finFactorDetails, setFinFactorDetails] = useState<{
        visibility: boolean;
        loading: boolean;
        data: any;
    }>({
        visibility: false,
        loading: false,
        data: null,
    });

    const [isLoading, setLoading] = useState(false);
    const [ptbLoading, setPtbLoading] = useState(false);

    const fetchBreFinfactorResult = async () => {
        setFinFactorDetails({
            visibility: true,
            loading: true,
            data: null
        });

        try {
            const response = await axios.get(`/api/v2/bre/finFactor`);
            const result = response.data;

            if (response.status === 200 || response.status === 201) {
                // Consent was reinitiated — redirect the customer to the new consent URL
                if (result.data?.reinitiated && result.data?.url) {
                    toast({ variant: "default", title: "Consent Required", description: result.message || "Please approve the new consent request." });
                    window.location.href = result.data.url;
                    return;
                }

                // Determine bsaBreStatus from finFactor result
                const bsaBreResult = result.data?.status === "Reject" || result.data?.status === "REJECTED" ? "REJECTED" : result.data?.status;

                // Update formData with finFactor result directly
                setFormData((prev) => ({
                    ...prev,
                    breStatus: bsaBreResult === "REJECTED" ? "REJECTED" : result.data?.status,
                    brePulled: true,
                    bsaBreStatus: bsaBreResult,
                }));

                // Update KYC status based on finFactor result
                updateKycStatusState({
                    loading: false,
                    status: result.data?.status === "Approve" ? "approved" :
                        result.data?.status === "Proceed to Bank" ? "proceed-to-bank" : "rejected",
                    data: result.data,
                    title: result.message || "Bank Verification Completed",
                    description: result.data?.reason || "Your bank statement has been analyzed",
                });

                // Show modal with finFactor result
                setFinFactorDetails({
                    visibility: true,
                    loading: false,
                    data: result.data
                });

                toast({ variant: "success", title: "Success", description: "Bank verification completed successfully." });
            } else if (response.status === 202 || result.status === "PENDING") {
                toast({ variant: "default", title: "Processing", description: result.message || "Verification is still processing." });
                setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
            } else {
                throw new Error(result.message || "Analysis failed");
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast({ variant: "error", title: "Error", description: errorMsg });
            setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
        }
    };

    const finFactorFetched = useRef(false);

    useEffect(() => {
        // Guard so the BRE/finFactor result is fetched at most once per page load,
        // regardless of how many times `user` is re-fetched from /api/auth/session.
        if (finFactorFetched.current) return;

        const finfactorParam = searchParams.get('finfactor');
        if (finfactorParam === "success") {
            finFactorFetched.current = true;
            // Strip the param so a manual refresh can't re-trigger the fetch.
            window.history.replaceState({}, '', window.location.pathname);
            fetchBreFinfactorResult();
            return;
        }

        if (user && user?.bsaInitiated) {
            finFactorFetched.current = true;
            fetchBreFinfactorResult();
            return;
        }
    }, [searchParams, user]);

    const handleProceedToBankApi = async () => {
        // const finfactorParam = searchParams.get('finfactor');
        // if (finfactorParam === "success") {
        //     // This one usually doesn't need a ref because URL params change, 
        //     // but effectively it redirects/cleans up anyway.
        //     fetchBreFinfactorResult();
        //     return;
        // }

        // if (user && user?.bsaInitiated) {
        //     //console.log("bsa initial...!");
        //     fetchBreFinfactorResult();
        //     return;
        // }

        setPtbLoading(true);
        try {
            const response = await axios.get(`/api/v2/finfactorConsentRequest`);
            const result = response.data;

            if (result?.data?.transactionFetched || result?.transactionFetched) {
                fetchBreFinfactorResult();
                return;
            }

            if (response.status === 200 || response.status === 201) {
                toast({ variant: "success", title: "Success", description: result.message || "Bank verification initiated successfully." });

                if (result.data?.url) {
                    window.location.href = result.data.url;
                } else {
                    // onContinue();
                }
            } else {
                toast({ variant: "error", title: "Failed", description: result.message || "Failed to initiate bank verification." });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('PTB API error:', error);
                toast({ variant: "error", title: "Network Error", description: error.response?.data?.message || "Unable to connect to server. Please try again." });
            }
        } finally {
            setPtbLoading(false);
        }
    };

    // Mark the application completed (submitted) and send the applicant to the
    // /application-status page. Used for reapply terminal decisions (Approve/Reject)
    // where there's no further step to collect.
    const completeApplication = (decision: any, isRejected: boolean) => {
        setFormData((prev) => ({ ...prev, breStatus: decision?.status, brePulled: true }));
        try {
            localStorage.setItem(
                "applicationStatusData",
                JSON.stringify({
                    status: isRejected ? "rejected" : "approved",
                    loanNumber: decision?.applicationNumber || (application as any)?.applicationNumber || "",
                    amount: isRejected
                        ? ""
                        : String(decision?.loanAmount ?? formData.approvedLoanAmount ?? ""),
                    reason: isRejected
                        ? decision?.reason || "Your application does not meet eligibility criteria."
                        : "",
                })
            );
        } catch {
            /* ignore storage errors */
        }
        // Reflect completion locally so the app shows as submitted (the backend
        // should also persist isSubmit for this to survive a reload).
        updateUser({ isSubmit: true });
        updateKycStatusState({ visibility: false, loading: false });
        getCustomer();
        getApplication();
        router.push("/application-status");
    };

    /**
     * NEW FLOW (BRE_DECISION): runs the rules engine via v2/bre/initialize and
     * routes on its decision — Approve / Reject / Proceed to Bank — surfaced
     * through the shared KYC status modal (ResultView).
     */
    const runBreDecisionFlow = async () => {
        // Safety net: never re-run the rules engine for an already-approved
        // applicant (handleContinue also short-circuits before reaching here).
        // Show the approval offer instead of skipping straight ahead.
        if (alreadyApproved) {
            showApprovalModal();
            return;
        }

        // Already on HOLD / Proceed-to-Bank — show the review popup, don't re-run.
        if (alreadyOnHold) {
            showHoldModal();
            return;
        }

        updateKycStatusState({ visibility: true, loading: true });
        try {
            const response = await axios.get(`/api/v2/bre/initialize`);
            const result = response.data;
            const decision = result?.data;

            if ((response.status === 200 || response.status === 201) && decision) {
                // Keep customer/application context fresh for downstream steps.
                getCustomer();
                getApplication();

                const status = normalizeBreStatus(decision.status);
                // A reapply is a returning customer who already has bank + profile
                // on file. For them a terminal decision (Approve/Reject) completes
                // the application — mark it submitted and go to the status page
                // instead of routing into the bank step.
                const isReturningCustomer = !!(user?.isBankDetailsFilled && user?.isProfileVerified);

                if (isReturningCustomer && (status === "approved" || status === "rejected")) {
                    completeApplication(decision, status === "rejected");
                } else {
                    showDecisionModal(decision);
                }
            } else {
                throw new Error(result?.message || "Eligibility check failed");
            }
        } catch (error: unknown) {
            // Log the real cause for diagnosis; show a friendly message to the user.
            if (error instanceof AxiosError) {
                console.error(
                    "[bre/initialize] failed:",
                    error.response?.status,
                    error.response?.data ?? error.message
                );
            } else {
                console.error("[bre/initialize] failed:", error);
            }
            updateKycStatusState({ visibility: false, loading: false });
            toast({
                variant: "error",
                title: "Something went wrong",
                description: "We couldn't complete your eligibility check. Please try again.",
            });
        }
    };

    const handleContinue = async () => {
        // Already approved — skip eligibility (no loan re-create, no
        // v2/bre/initialize) and show the approval offer. The applicant continues
        // to the next step only after accepting it (never straight to camera).
        if (alreadyApproved) {
            showApprovalModal();
            return;
        }

        // Already on HOLD / Proceed-to-Bank — don't re-run eligibility; show the
        // "account under review / contact support" popup instead.
        if (alreadyOnHold) {
            showHoldModal();
            return;
        }

        const nameParts = formData.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // Email Regex: Standard email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Mobile Regex: 10 digits starting with 6-9 (Indian Standard)
        const mobileRegex = /^[6-9]\d{9}$/;

        // Validate Email
        if (!formData.email) {
            toast({ variant: "error", title: "Email is required" });
            return;
        } else if (!emailRegex.test(formData.email)) {
            toast({ variant: "error", title: "Invalid Email format", description: "Please enter a valid email address." });
            return;
        }

        // Validate Mobile
        if (!formData.mobile) {
            toast({ variant: "error", title: "Mobile is required" });
            return;
        } else if (!mobileRegex.test(formData.mobile)) {
            toast({ variant: "error", title: "Invalid Mobile number", description: "Please enter a valid 10-digit mobile number." });
            return;
        }

        // Validate Loan Amount
        if (formData.loanAmount < 2500 || formData.loanAmount > 50000) {
            toast({ variant: "error", title: "Invalid Amount", description: "Loan must be between ₹2,500 and ₹50,000." });
            return;
        }

        if (!formData.productId || !formData.selectedProduct) {
            toast({
                variant: "warning",
                title: "Product Selection Required",
                description: "Please select a loan product to continue.",
            });
            return;
        }

        // Validate References
        const r1NameOk = (formData.reference1Name || '').trim().length >= 2;
        const r2NameOk = (formData.reference2Name || '').trim().length >= 2;
        const r1MobileOk = VALIDATION.MOBILE.test(formData.reference1Mobile || '');
        const r2MobileOk = VALIDATION.MOBILE.test(formData.reference2Mobile || '');
        const r1RelOk = !!formData.reference1Relationship;
        const r2RelOk = !!formData.reference2Relationship;
        if (!(r1NameOk && r2NameOk && r1MobileOk && r2MobileOk && r1RelOk && r2RelOk)) {
            toast({
                variant: "warning",
                title: "References Required",
                description: "Please fill both references with name, valid mobile, and relationship.",
            });
            return;
        }
        if (formData.reference1Mobile === formData.reference2Mobile) {
            toast({ variant: "error", title: "References must have different mobile numbers" });
            return;
        }
        if (formData.reference1Mobile === formData.mobile || formData.reference2Mobile === formData.mobile) {
            toast({ variant: "error", title: "Reference cannot be your own mobile number" });
            return;
        }

        // TEST MODE: skip the loan/create + BRE backend calls and show the
        // approval offer directly. Accepting it advances to the bank step.
        if (isTestMode()) {
            setFormData((prev) => ({ ...prev, breStatus: "Approve", brePulled: true }));
            showApprovalModal();
            return;
        }

        // At least one reference must be OTP-verified before eligibility can be checked.
        if (!formData.reference1Verified && !formData.reference2Verified) {
            toast({
                variant: "error",
                title: "Reference not verified",
                description: "Please verify at least one reference with the OTP sent to their mobile number before checking eligibility.",
            });
            return;
        }

        const isBasicDetailsFilled = true;

        const selectedProduct = formData.selectedProduct || null;
        const locationData = location || (await getLocation()); // Use existing location from context or fetch if not available

        const references = [
            {
                name: (formData.reference1Name || '').trim(),
                mobile: formData.reference1Mobile || '',
                relationship: formData.reference1Relationship || '',
            },
            {
                name: (formData.reference2Name || '').trim(),
                mobile: formData.reference2Mobile || '',
                relationship: formData.reference2Relationship || '',
            },
        ];

        const basicDetails = {
            employmentType: formData.employmentType,
            monthlyIncome: formData.monthlyIncome,
            salaryDate: formData.salaryDate,
            firstName,
            lastName,
            mobile: formData.mobile,
            email: formData.email,
            isBasicDetailsFilled,
            dateOfBirth: formData.dob,
            companyName: formData.companyName,
            references,
        }
        const loanDetails = {
            requestedLoanAmount: formData.loanAmount,
            productId: formData.productId,
            purpose: formData.purpose,
            // Auto tenure based on product type
            // Personal Loan = 15, Salary Advance = 0
            tenure: selectedProduct
                ? (selectedProduct.category?.toLowerCase().includes('salary') ? 0 : 15)
                : 15,
            // Selected product complete details
            product: selectedProduct ? {
                id: selectedProduct._id,
                name: selectedProduct.productName,
                category: selectedProduct.category,
                dailyInterestRate: selectedProduct.dailyInterestRate,
                ...(selectedProduct.description && { description: selectedProduct.description }),
                ...(selectedProduct.minAmount && { minAmount: selectedProduct.minAmount }),
                ...(selectedProduct.maxAmount && { maxAmount: selectedProduct.maxAmount }),
            } : null,
            ...(locationData && {
                location: {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude
                }
            })
        }

        const kycDetails = {
            isKycDetailsFilled: true
        }

        try {
            setLoading(true);
            const basicResponse = await axios.post("/api/v2/application/loan/create", {
                basicDetails,
                loanDetails,
                kycDetails,
            });

            if (basicResponse.status === 200 || basicResponse.status === 201) {
                setLoading(false);
                // storage.set("applicationId", basicResponse?.data?.data?.applicationNumber);

                // updateKycStatusState({ loading: true, visibility: true });

                try {
                    //                 const response = await axios.get("/api/v2/bre/initialize");
                    //                 if (response.status === 200 || response.status === 201) {
                    //                     //console.log(response.data)
                    //                     // const eligibilityStep = isLogin && user?.brePulled && application && application?.status !== "REJECTED";

                    //                     /*
                    //                      "data": {
                    //     "applicationNumber": "APP20261770280936508",
                    //     "applicationId": "698457e864cf957cd5376479",
                    //     "status": "Reject",
                    //     "reason": "Your credit profile does not meet eligibility criteria"
                    // }
                    //                     */

                    //                     if (response.data?.data) {
                    //                         getCustomer();
                    //                         getApplication();
                    //                         setFormData((prev) => ({ ...prev, breStatus: response.data?.data?.status }));
                    //                         updateKycStatusState({
                    //                             loading: false,
                    //                             status: response.data?.data?.status === "Approve" ? "approved" : response.data?.data?.status === "Proceed to Bank" ? "proceed-to-bank" : "rejected",
                    //                             data: response.data?.data,
                    //                             title: response.data?.message || "BRE checked successfully",
                    //                             description: response?.data?.data?.reason || "Your application does not meet eligibility criteria",
                    //                             onSuccess: () => {
                    //                                 onNext();
                    //                                 window.scrollTo({ top: 0, behavior: 'smooth' });
                    //                             }
                    //                         });
                    //                     }
                    //                 }

                    // ── Flow branch ──
                    // BRE_DECISION (new): run the rules engine first and route on
                    // its Approve / Reject / Proceed-to-Bank decision.
                    // DIRECT_TO_BANK (current): skip straight to bank-statement
                    // analysis.
                    if (flowMode === "BRE_DECISION") {
                        await runBreDecisionFlow();
                    } else {
                        handleProceedToBankApi();
                    }
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        toast({ variant: "error", title: error?.response?.data?.message || "Kyc Failed", description: "User denied request." });
                        updateKycStatusState({ description: error?.response?.data?.message || "Your application does not meet eligibility criteria" });
                    }
                } finally {
                    updateKycStatusState({ loading: false });
                }
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast({ variant: "error", title: error.response?.data?.message || "Internal server error" });
            }
        } finally {
            setLoading(false);
        }
    }

    const canProceed = useMemo(() => {
        // 1. Safe parsing for Loan Amount
        const loanAmount = Number(formData.loanAmount) || 0;

        // 2. Safe parsing for Monthly Income
        const income = Number(formData.monthlyIncome) || 0;

        // 3. Verification check (Needs at least one verified contact + PAN)
        const isMobileVerify = formData?.mobile && formData?.mobile !== "";
        const isEmailVerify = formData?.email && formData?.email !== "";
        const isContactVerified = !!(isEmailVerify && isMobileVerify);
        const isPanVerified = !!formData.panVerified;
        const isAadhaarVerify = !!formData.aadhaarVerified;

        // 4. Employment details check
        const isWorkDetailsValid = formData.companyName?.trim() !== "";

        // 5. product required
        const product = !!formData.productId && !!formData.selectedProduct;

        // 6. references required
        const r1NameOk = (formData.reference1Name || '').trim().length >= 2;
        const r2NameOk = (formData.reference2Name || '').trim().length >= 2;
        const r1MobileOk = VALIDATION.MOBILE.test(formData.reference1Mobile || '');
        const r2MobileOk = VALIDATION.MOBILE.test(formData.reference2Mobile || '');
        const r1RelOk = !!formData.reference1Relationship;
        const r2RelOk = !!formData.reference2Relationship;
        const distinct = formData.reference1Mobile !== formData.reference2Mobile;
        const notSelf =
            formData.reference1Mobile !== formData.mobile &&
            formData.reference2Mobile !== formData.mobile;
        const referencesValid =
            r1NameOk && r2NameOk && r1MobileOk && r2MobileOk && r1RelOk && r2RelOk && distinct && notSelf;
        // At least one reference must be OTP-verified — the button is enabled as
        // soon as either reference is verified.
        const referencesVerified =
            !!formData.reference1Verified || !!formData.reference2Verified;

        // Final result
        return (
            isContactVerified &&
            isPanVerified &&
            isAadhaarVerify &&
            income > 0 &&
            isWorkDetailsValid &&
            (loanAmount >= 2500 && loanAmount <= 50000) &&
            product &&
            referencesValid &&
            referencesVerified
        );
    }, [formData]);

    return <>
        <FinFactorStatus
            visibility={finFactorDetails.visibility}
            loading={finFactorDetails.loading}
            data={finFactorDetails.data}
            onContinue={async () => {
                setFinFactorDetails({ visibility: false, loading: false, data: null });

                // If approved, scroll to top and show next step
                if (finFactorDetails.data?.status === "Approve" || finFactorDetails.data?.status === "APPROVED") {
                    toast({ variant: "success", title: "Congratulations!", description: "You are eligible for the loan!" });
                    setTimeout(() => {
                        onNext();
                        getApplication();
                        getCustomer();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        const cleanUrl = window.location.pathname;
                        window.history.replaceState({}, '', cleanUrl);
                    }, 500);
                } else {
                    // For other statuses, just close modal and show updated state
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }}
        />

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
    </>
}

export default FinFactorVerify;