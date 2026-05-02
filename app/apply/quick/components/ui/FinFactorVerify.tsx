"use client";

import { useApplication } from "@/contexts/ApplicationContext";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState, useRef, useMemo } from "react";
import FinFactorStatus from "./FinFactorStatus";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { useKycStatus } from "@/lib/contexts/KycStatusContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import useLocation from "@/hooks/useLocation";

interface FinFactorVerifyProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
}

const FinFactorVerify = ({ formData, setFormData, onNext }: FinFactorVerifyProps) => {
    const axios = useAxios();
    const { getApplication, application, getCustomer } = useApplication();
    const searchParams = useSearchParams();
    const { updateKycStatusState } = useKycStatus();
    const { user } = useAuth();
    const { location, getLocation } = useLocation();

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

    const bsaInitiatedCalled = useRef(false);

    useEffect(() => {
        const finfactorParam = searchParams.get('finfactor');
        if (finfactorParam === "success") {
            fetchBreFinfactorResult();
            return;
        }

        if (user && user?.bsaInitiated) {
            if (bsaInitiatedCalled.current) return;
            bsaInitiatedCalled.current = true;

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
        //     console.log("bsa initial...!");
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

    const handleContinue = async () => {
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

        const isBasicDetailsFilled = true;

        const selectedProduct = formData.selectedProduct || null;
        const locationData = location || (await getLocation()); // Use existing location from context or fetch if not available

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
                    //                     console.log(response.data)
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

                    handleProceedToBankApi();
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

        // Final result
        return (
            isContactVerified &&
            isPanVerified &&
            isAadhaarVerify &&
            income > 0 &&
            isWorkDetailsValid &&
            (loanAmount >= 2500 && loanAmount <= 50000) &&
            product
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