'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, IndianRupee, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { LOAN_CONFIG, VALIDATION, TIMERS, formatCurrency, calculateLoanDetails } from '@/lib/constants/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import TruecallerVerify from './ui/TruecallerVerify';
import GoogleVerify from './ui/GoogleVerify';
import { useAuth } from '@/contexts/AuthContext';
import BasicDetails from './ui/BasicDetails';
import { AxiosError } from 'axios';
import useAxios from '@/hooks/useAxios';
import PanVerify from './ui/PanVerify';
import { useKycStatus } from '@/lib/contexts/KycStatusContext';
import { toast } from '@/components/ui/toast';
import EmailVerify from './ui/EmailVerify';
import useStorage from '@/hooks/useStorage';
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import FinFactorStatus from './ui/FinFactorStatus';
import AadhaarVerify from './ui/AadhaarVerify';
import EmployeeDetails from './ui/EmployeeDetails';

interface Page1Props {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
}

export default function Page1BasicDetails({ formData, setFormData, onNext }: Page1Props) {
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
    // console.log(storage);
    const {
        updateKycStatusState
    } = useKycStatus();

    // Tracking
    const {
        trackStepViewed,
    } = useQuickApplyTracking();

    // Track previous values for change detection
    const hasTrackedStepRef = useRef(false);

    // Inside your page component
    const fetchBreFinfactorResult = async () => {
        console.log('📊 finfactor=success detected, auto-calling BRE finFactor API...');

        // 1. Show the modal and set loading to true
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

                // 2. Set the data and stop loading (The modal stays visible to show the result)
                setFinFactorDetails({
                    visibility: true, // Keep it visible
                    loading: false,   // Stop spinner
                    data: result.data // Pass the Approved/Rejected data
                });

                toast({ variant: "success", title: "Success", description: "Analysis completed." });

            } else {
                throw new Error(result.message || "Analysis failed");
            }

        } catch (error: any) {
            console.error('BRE finFactor failed:', error);

            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast({ variant: "error", title: "Error", description: errorMsg });

            // 3. Handle API Failure - OPTIONAL: 
            // You might want to close the modal or show a specific error state
            // For now, let's close it so the user isn't stuck
            setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
        }
    };

    useEffect(() => {
        const finfactorParam = searchParams.get('finfactor');
        if (finfactorParam === "success") {
            fetchBreFinfactorResult();
        }
    }, [searchParams]);

    // Track step viewed on mount
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(1, 'Basic Details');
        }
    }, [trackStepViewed]);

    // The logic now correctly handles verification status from the AuthContext
    const isVerified = useMemo(() => user?.isMobileVerified || user?.isEmailVerified, [user]);

    const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);

    const canProceed = useMemo(() => ((formData?.emailVerified || formData?.mobileVerified) && formData?.panVerified && !formData.brePulled), [formData]);

    const handleContinue = async () => {

        const nameParts = formData.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // if (!formData.employmentType) {
        //     newErrors.employmentType = 'Please select employment type';
        //     trackFormError('employmentType', newErrors.employmentType, 2);
        // }

        // if (!formData.monthlyIncome || parseInt(formData.monthlyIncome) < 15000) {
        //     newErrors.monthlyIncome = 'Minimum income required is ₹15,000';
        //     trackFormError('monthlyIncome', newErrors.monthlyIncome, 2);
        // }

        // if (formData.employmentType === 'SALARIED' && !formData.salaryDate) {
        //     newErrors.salaryDate = 'Please select salary date';
        //     trackFormError('salaryDate', newErrors.salaryDate, 2);
        // }
        const isBasicDetailsFilled = true;

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
        }

        // console.log("basicDetails", basicDetails);
        try {
            setLoading(true);
            const basicResponse = await axios.post("/api/v2/application/loan/create", {
                basicDetails,
                loanDetails
            });

            if (basicResponse.status === 200 || basicResponse.status === 201) {
                setLoading(false);
                updateKycStatusState({ loading: true, visibility: true, onSuccess: () => onNext() })

                try {
                    const response = await axios.get("/api/v2/bre/initialize");
                    if (response.status === 200 || response.status === 201) {
                        console.log(response.data)
                        if (response.data?.data) {
                            storage.set("breForm", response.data?.data);
                            updateKycStatusState({
                                loading: false,
                                status: response.data?.data?.status === "Approve" ? "approved" : response.data?.data?.status === "Proceed to Bank" ? "proceed-to-bank" : "rejected",
                                // ✅ Pass Backend Data Here
                                data: response.data?.data,
                                title: response.data?.message || "BRE checked successfully",   // e.g., "Proceed to Bank"
                                description: response?.data?.data?.reason || "Your application does not meet eligibility criteria", // e.g., "BRE checked successfully"
                                onSuccess: () => onNext()
                            });
                        }
                    }
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        // console.log(error?.response?.data);
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

            {/* Verification Section */}
            {/* {isVerified ? (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200 flex items-center gap-4"
                >
                    <div className="bg-green-100 p-2 rounded-full shadow-sm">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-green-900">Verified Successfully</span>
                            <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Secure</span>
                        </div>
                        <p className="text-xs text-green-700 mt-0.5">
                            Your account is confirmed. You can now proceed with your application.
                        </p>
                    </div>
                </motion.div>
            ) : (
                <>
                    <div className="bg-gradient-to-r from-[#25B181]/5 to-[#51C9AF]/5 rounded-xl p-3 sm:p-4 border border-[#25B181]/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-[#25B181]" />
                            <span className="text-sm font-semibold text-gray-900">Quick Verify</span>
                            <span className="text-[9px] sm:text-[10px] bg-[#25B181] text-white px-1.5 py-0.5 rounded-full">Fastest</span>
                        </div>

                        <div className="flex gap-2">
                            <TruecallerVerify callbackURL="/apply/quick-v2" />
                            <GoogleVerify callbackURL="/apply/quick-v2" />
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-[10px] text-gray-500">or enter mobile</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>
                    </div>
                    <EmailVerify />
                </>
            )} */}

            <PanVerify formData={formData} setFormData={setFormData} />
            <AadhaarVerify formData={formData} setFormData={setFormData} />
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

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                disabled={isLoading || !canProceed}
                className="w-full py-2 text-sm bg-gradient-to-r disabled:cursor-not-allowed from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold sm:text-base shadow-lg shadow-[#25B181]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
                Check Eligibility
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </motion.div>
    );
}
