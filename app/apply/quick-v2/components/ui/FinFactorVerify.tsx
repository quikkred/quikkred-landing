"use client";

import { useApplication } from "@/contexts/ApplicationContext";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState, useRef } from "react";
import FinFactorStatus from "./FinFactorStatus";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { useKycStatus } from "@/lib/contexts/KycStatusContext";
import { useAuth } from "@/contexts/AuthContext";

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

    const [finFactorDetails, setFinFactorDetails] = useState<{
        visibility: boolean;
        loading: boolean;
        data: any;
    }>({
        visibility: false,
        loading: false,
        data: null,
    });

    const fetchBreFinfactorResult = async () => {
        console.log('📊 finfactor=success detected, auto-calling BRE finFactor API...');
        console.log('🔍 bsaInitiated status:', formData?.bsaInitiated);

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

                // ⚠️ CRITICAL: Only re-initialize BRE if bsaInitiated is FALSE
                // If bsaInitiated is TRUE, skip BRE re-initialization and use finFactor result directly
                if (!formData?.bsaInitiated) {
                    console.log('📊 bsaInitiated is FALSE, re-initializing BRE...');
                    try {
                        const breResponse = await axios.get("/api/v2/bre/initialize");
                        if (breResponse.status === 200 || breResponse.status === 201) {
                            console.log('✅ BRE re-initialized after FinFactor:', breResponse.data);

                            // Update formData with new BRE status
                            setFormData((prev) => ({
                                ...prev,
                                breStatus: breResponse.data?.data?.status,
                                brePulled: true
                            }));

                            // Update KYC status based on new BRE result
                            updateKycStatusState({
                                loading: false,
                                status: breResponse.data?.data?.status === "Approve" ? "approved" :
                                    breResponse.data?.data?.status === "Proceed to Bank" ? "proceed-to-bank" : "rejected",
                                data: breResponse.data?.data,
                                title: breResponse.data?.message || "FinFactor Analysis Completed",
                                description: breResponse?.data?.data?.reason || "Your application has been processed",
                            });

                            // Show modal with final result from BRE
                            setFinFactorDetails({
                                visibility: true,
                                loading: false,
                                data: breResponse.data.data
                            });

                        }
                    } catch (breError: any) {
                        console.error('BRE re-initialization failed:', breError);
                        // Still show FinFactor result even if BRE re-init fails
                        setFinFactorDetails({
                            visibility: true,
                            loading: false,
                            data: result.data
                        });
                    }
                } else {
                    console.log('✅ bsaInitiated is TRUE, skipping BRE re-initialization');
                    // Determine bsaBreStatus from finFactor result
                    const bsaBreResult = result.data?.status === "Reject" || result.data?.status === "REJECTED" ? "REJECTED" : result.data?.status;
                    console.log('📊 BSA-BRE status from finFactor:', bsaBreResult);

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
                }


                toast({ variant: "success", title: "Success", description: "Bank verification completed successfully." });
            } else {
                throw new Error(result.message || "Analysis failed");
            }
        } catch (error: any) {
            console.error('BRE finFactor failed:', error);
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast({ variant: "error", title: "Error", description: errorMsg });
            setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
        } finally {
            // Refresh application and customer data
            // getApplication();
            // getCustomer();

            // Clean up URL params
            // const cleanUrl = window.location.pathname;
            // window.history.replaceState({}, '', cleanUrl);
        }
    };

    const breInitialize = async () => {
        setFinFactorDetails({
            visibility: true,
            loading: true,
            data: null
        });
        try {
            const breResponse = await axios.get("/api/v2/bre/initialize");
            if (breResponse.status === 200 || breResponse.status === 201) {
                console.log('✅ BRE re-initialized after FinFactor:', breResponse.data);

                // Update formData with new BRE status
                setFormData((prev) => ({
                    ...prev,
                    breStatus: breResponse.data?.data?.status,
                    brePulled: true
                }));

                // Update KYC status based on new BRE result
                updateKycStatusState({
                    loading: false,
                    status: breResponse.data?.data?.status === "Approve" ? "approved" :
                        breResponse.data?.data?.status === "Proceed to Bank" ? "proceed-to-bank" : "rejected",
                    data: breResponse.data?.data,
                    title: breResponse.data?.message || "FinFactor Analysis Completed",
                    description: breResponse?.data?.data?.reason || "Your application has been processed",
                });

                // Show modal with final result from BRE
                setFinFactorDetails({
                    visibility: true,
                    loading: false,
                    data: breResponse.data.data
                });

            }
        } catch (breError: any) {
            console.error('BRE re-initialization failed:', breError);
            // Still show FinFactor result even if BRE re-init fails
            setFinFactorDetails({
                visibility: true,
                loading: false,
                data: breError?.response?.data?.data
            });
        }
        finally {
            // Refresh application and customer data
            getApplication();
            getCustomer();
        }
    }

    const bsaInitiatedCalled = useRef(false);
    const breInitializeCalled = useRef(false);

    useEffect(() => {
        const finfactorParam = searchParams.get('finfactor');
        if (finfactorParam === "success") {
            // This one usually doesn't need a ref because URL params change, 
            // but effectively it redirects/cleans up anyway.
            fetchBreFinfactorResult();
            return;
        }

        if (user && user?.bsaInitiated) {
            if (bsaInitiatedCalled.current) return;
            bsaInitiatedCalled.current = true;

            console.log("bsa initial...!");
            // BRE initialize was already called before BSA started.
            // Only need to call /bre/finFactor to get the analysis result.
            fetchBreFinfactorResult();
            return;
        }

        // if (user?.brePulled || (user?.isBasicDetailsFilled && user?.isKycDetailsFilled)) {
        //     if (breInitializeCalled.current) return;
        //     breInitializeCalled.current = true;

        //     console.log("bre initial call...!");
        //     breInitialize();
        //     return;
        // }
    }, [searchParams, user]);

    return <>
        <FinFactorStatus
            visibility={finFactorDetails.visibility}
            loading={finFactorDetails.loading}
            data={finFactorDetails.data}
            onContinue={async () => {
                // Close the modal
                setFinFactorDetails({ visibility: false, loading: false, data: null });
                getApplication();
                getCustomer();

                // If approved, scroll to top and show next step
                if (finFactorDetails.data?.status === "Approve" || finFactorDetails.data?.status === "APPROVED") {
                    toast({ variant: "success", title: "Congratulations!", description: "You are eligible for the loan!" });
                    setTimeout(() => {
                        onNext();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 500);
                } else {
                    // For other statuses, just close modal and show updated state
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }}
        />
    </>
}

export default FinFactorVerify;