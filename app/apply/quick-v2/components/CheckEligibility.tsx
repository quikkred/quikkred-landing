'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { useAuth } from '@/contexts/AuthContext';
import { AxiosError } from 'axios';
import useAxios from '@/hooks/useAxios';
import PanVerify from './ui/PanVerify';
import { useKycStatus } from '@/lib/contexts/KycStatusContext';
import { toast } from '@/components/ui/toast';
import useStorage from '@/hooks/useStorage';
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';
import { useSearchParams } from 'next/navigation';
import FinFactorStatus from './ui/FinFactorStatus';
import AadhaarVerify from './ui/AadhaarVerify';
import EmployeeDetails from './ui/EmployeeDetails';
import { useApplication } from '@/contexts/ApplicationContext';
import { AlertCircle, ArrowRight, Landmark, Loader2 } from 'lucide-react'; // 1. Import Icon
import MissingField from './ui/MissingField';
import useLocation from '@/hooks/useLocation';

interface CheckEligibilityProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
}

export default function CheckEligibility({ formData, setFormData, onNext }: CheckEligibilityProps) {
    // OTP States
    const [otpTimer, setOtpTimer] = useState(0);
    const [finFactorDetails, setFinFactorDetails] = useState<{
        visibility: boolean;
        loading: boolean;
        data: any;
    }>({
        visibility: false,
        loading: false,
        data: null,
    });
    const { user } = useAuth();
    const axios = useAxios();
    const storage = useStorage();
    const searchParams = useSearchParams();
    const [isLoading, setLoading] = useState(false);
    const [ptbLoading, setPtbLoading] = useState(false);
    const { location, getLocation } = useLocation();

    // 2. Destructure 'application' to check status
    const { getApplication, application, getCustomer } = useApplication();

    const {
        updateKycStatusState
    } = useKycStatus();

    // Tracking
    const {
        trackStepViewed,
    } = useQuickApplyTracking();

    // Track previous values for change detection
    const hasTrackedStepRef = useRef(false);

    // ... [Keep existing fetchBreFinfactorResult function unchanged] ...
    const fetchBreFinfactorResult = async () => {
        console.log('📊 finfactor=success detected, auto-calling BRE finFactor API...');
        setFinFactorDetails({
            visibility: true,
            loading: true,
            data: null
        });

        try {
            const response = await axios.get(`/api/v2/bre/finFactor`);
            const result = response.data;

            if (response.status === 200 || response.status === 201) {
                console.log('✅ BRE finFactor result:', result.data);
                getCustomer();
                getApplication();
                setFinFactorDetails({
                    visibility: true,
                    loading: false,
                    data: result.data
                });
                toast({ variant: "success", title: "Success", description: "Analysis completed." });
                // Clean up URL params
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, '', cleanUrl);
            } else {
                throw new Error(result.message || "Analysis failed");
            }
        } catch (error: any) {
            console.error('BRE finFactor failed:', error);
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast({ variant: "error", title: "Error", description: errorMsg });
            setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
        }
    };

    useEffect(() => {
        const finfactorParam = searchParams.get('finfactor');
        if (finfactorParam === "success") {
            fetchBreFinfactorResult();
        }
    }, [searchParams]);

    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(1, 'Basic Details');
        }
    }, [trackStepViewed]);

    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);


    const canProceed = useMemo(() => {
        // 1. Safe parsing for Loan Amount
        const loanAmount = Number(formData.loanAmount) || 0;

        // 2. Safe parsing for Monthly Income
        const income = Number(formData.monthlyIncome) || 0;

        // 3. Verification check (Needs at least one verified contact + PAN)
        const isContactVerified = !!(formData.emailVerified || formData.mobileVerified);
        const isPanVerified = !!formData.panVerified;
        const isAadhaarVerify = !!formData.aadhaarVerified;

        // 4. BRE check (Don't allow if already pulled)
        const isBreValid = !formData.brePulled;

        // 5. Employment details check
        const isWorkDetailsValid = formData.companyName?.trim() !== "";

        // 6. product required
        const product = !!formData.productId && !!formData.selectedProduct;

        // Final result
        return (
            isContactVerified &&
            isPanVerified &&
            isAadhaarVerify &&
            isBreValid &&
            income > 0 &&
            isWorkDetailsValid &&
            (loanAmount >= 5000 && loanAmount <= 25000) &&
            product
        );
    }, [formData]);

    const handleProceedToBankApi = async () => {
        setPtbLoading(true);
        try {
            const response = await axios.get(`/api/v2/finfactorConsentRequest`);
            const result = response.data;

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

        // Validate Loan Amount (from previous requirement)
        if (formData.loanAmount < 5000 || formData.loanAmount > 25000) {
            toast({ variant: "error", title: "Invalid Amount", description: "Loan must be between ₹5,000 and ₹25,000." });
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

        // const kycDetails = {
        //     isKycDetailsFilled: true
        // }

        try {
            setLoading(true);
            const basicResponse = await axios.post("/api/v2/application/loan/create", {
                basicDetails,
                loanDetails,
                // kycDetails,
            });

            if (basicResponse.status === 200 || basicResponse.status === 201) {
                setLoading(false);
                console.log("basic response:", basicResponse.data);
                // storage.set("applicationId", basicResponse?.data?.data?.applicationNumber);

                updateKycStatusState({ loading: true, visibility: true });

                try {
                    const response = await axios.get("/api/v2/bre/initialize");
                    if (response.status === 200 || response.status === 201) {
                        console.log(response.data)
                        // const eligibilityStep = isLogin && user?.brePulled && application && application?.status !== "REJECTED";

                        /*
                         "data": {
        "applicationNumber": "APP20261770280936508",
        "applicationId": "698457e864cf957cd5376479",
        "status": "Reject",
        "reason": "Your credit profile does not meet eligibility criteria"
    }
                        */

                        if (response.data?.data) {
                            getCustomer();
                            getApplication();
                            setFormData((prev) => ({ ...prev, breStatus: response.data?.data?.status }));
                            updateKycStatusState({
                                loading: false,
                                status: response.data?.data?.status === "Approve" ? "approved" : response.data?.data?.status === "Proceed to Bank" ? "proceed-to-bank" : "rejected",
                                data: response.data?.data,
                                title: response.data?.message || "BRE checked successfully",
                                description: response?.data?.data?.reason || "Your application does not meet eligibility criteria",
                                onSuccess: () => {
                                    onNext();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            });
                        }
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <FinFactorStatus
                visibility={finFactorDetails.visibility}
                loading={finFactorDetails.loading}
                data={finFactorDetails.data}
            />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Get Instant Cash</h2>

            <AadhaarVerify formData={formData} setFormData={setFormData} />
            <PanVerify formData={formData} setFormData={setFormData} />
            <MissingField formData={formData} setFormData={setFormData} />
            <EmployeeDetails formData={formData} setFormData={setFormData} />

            <div className="w-full">
                <h2 className="font-bold text-base mb-1 text-red-600">** Loan Eligibility & Approval **</h2>
                <p className="text-xs mb-1">
                    • Loans are not available in select states/UTs (Andaman & Nicobar Islands, Arunachal Pradesh, Assam, Jammu & Kashmir, Ladakh, Lakshadweep, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Daman & Diu).
                </p>
                <p className="text-xs">
                    • Applicants working in Police, Defence, or Legal professions are not eligible.
                </p>
            </div>

            {/* 3. Conditional Rendering: Reject Message vs Button */}
            {(formData?.breStatus === "REJECTED" || formData?.breStatus === "Rejected") ? (
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

                        {/* RIGHT SIDE: Application Number */}
                        <div className="flex flex-col items-start sm:items-end border-t sm:border-t-0 border-red-100 pt-2 sm:pt-0 pl-8 sm:pl-0">
                            <span className="font-mono text-sm font-bold text-red-900 tracking-tight leading-none break-all">
                                {application?.applicationNumber}
                            </span>
                            <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mt-1">
                                Application No
                            </span>
                        </div>
                    </div>
                </div>
            ) : (formData?.breStatus === "PROCEED TO BANK" || formData?.breStatus === "Proceed to Bank") ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    {/* Status Box */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="shrink-0 bg-emerald-100 p-1.5 rounded-full">
                                    <Landmark className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-900 leading-none">
                                        Verification Required
                                    </h3>
                                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                                        Bank statement verification needed.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end border-t sm:border-t-0 border-emerald-100 pt-2 sm:pt-0 pl-11 sm:pl-0">
                                <span className="font-mono text-sm font-bold text-emerald-900 tracking-tight leading-none break-all">
                                    {application?.applicationNumber}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mt-1">
                                    Application No
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleProceedToBankApi}
                        disabled={ptbLoading}
                        className="w-full group relative py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {ptbLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Proceed to Bank</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </div>
            ) : (
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
            )}
        </motion.div>
    );
}