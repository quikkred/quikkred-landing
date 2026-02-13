"use client";

import { useApplication } from "@/contexts/ApplicationContext";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import FinFactorStatus from "./FinFactorStatus";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";

const FinFactorVerify = () => {
    const [finFactorDetails, setFinFactorDetails] = useState<{
        visibility: boolean;
        loading: boolean;
        statusMessage: string; // New state for progress text
        data: any;
    }>({
        visibility: false,
        loading: false,
        statusMessage: "",
        data: null,
    });

    const axios = useAxios();
    const { getApplication, application, getCustomer } = useApplication();
    const searchParams = useSearchParams();

    // Helper to update status message easily
    const updateStatus = (msg: string, isLoading: boolean = true) => {
        setFinFactorDetails(prev => ({ ...prev, statusMessage: msg, loading: isLoading, visibility: isLoading || !!prev.data }));
    };

    const fetchBreInitialize = async () => {
        updateStatus("Initializing BRE Engine...");
        try {
            const initialData = await axios.get("/api/v2/bre/initialize");
            const result = initialData.data;

            if (initialData.status === 200 || initialData.status === 201) {
                // fetchBalanceCheck();
                toast({ variant: "success", title: "Success", description: "Verification completed." });
                // If the flow ends here, close modal or show data
                setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: true, data: result.data }));
                toast({ variant: "success", title: "Success", description: "Analysis completed." });

                // Clean up URL params
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, '', cleanUrl);

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('BRE initialization failed:', error);
            setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
        }
    }

    // const fetchBalanceCheck = async () => {
    //     updateStatus("Running Final Balance Check...");
    //     try {
    //         const applicationId = application?._id;
    //         if (!applicationId) {
    //             toast({ variant: "error", title: "Error", description: "Application ID not found." });
    //             setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
    //             return;
    //         }
    //         const response = await axios.post("/api/balance-check/complete", { applicationId });
    //         const result = response.data;

    //         if (result.success) {
    //             toast({ variant: "success", title: "Success", description: "Verification completed." });
    //             // If the flow ends here, close modal or show data
    //             setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: true, data: result.data }));
    //             toast({ variant: "success", title: "Success", description: "Analysis completed." });

    //             // Clean up URL params
    //             const cleanUrl = window.location.pathname;
    //             window.history.replaceState({}, '', cleanUrl);

    //             window.scrollTo({ top: 0, behavior: 'smooth' });
    //         }
    //     } catch (error) {
    //         setFinFactorDetails(prev => ({ ...prev, loading: false, visibility: false }));
    //     }
    // }

    const fetchBreFinfactorResult = async () => {
        setFinFactorDetails({
            visibility: true,
            loading: true,
            statusMessage: "Analyzing FinFactor Report...",
            data: null
        });

        try {
            const response = await axios.get(`/api/v2/bre/finFactor`);
            const result = response.data;

            if (response.status === 200 || response.status === 201) {
                // Once finFactor is successful, start the BRE Initialization sequence
                getApplication();
                await fetchBreInitialize();
                getCustomer();
            } else {
                throw new Error(result.message || "Analysis failed");
            }
        } catch (error: any) {
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

    return (
        // <FinFactorStatus
        //     visibility={finFactorDetails.visibility}
        //     loading={finFactorDetails.loading}
        //     statusMessage={finFactorDetails.statusMessage}
        //     data={finFactorDetails.data}
        // />
        <></>
    )
}

export default FinFactorVerify;