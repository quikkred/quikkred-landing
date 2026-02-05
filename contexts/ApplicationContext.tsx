"use client";

import useAxios from "@/hooks/useAxios";
import { ApplicationInterface } from "@/interfaces/applicationInterface";
import LayoutInterface from "@/interfaces/layoutInterface";
import { AxiosError } from "axios";
import { createContext, useContext, useState } from "react";
import { useAuth, User } from "./AuthContext";
import { toast } from "@/components/ui/toast";

interface ApplicationContextStateInterface {
    loading: boolean;
    data: ApplicationInterface | null;
}

interface ApplicationContextInterface {
    loading: boolean;
    application: ApplicationInterface | null;
    setApplication: (application: ApplicationInterface) => void;
    getApplication: () => void;
    getCustomer: () => void;
}

const initialState: ApplicationContextStateInterface = {
    loading: false,
    data: null,
}

const ApplicationContext = createContext<ApplicationContextInterface>({
    loading: false,
    application: null,
    setApplication: () => { },
    getApplication: () => { },
    getCustomer: () => { },
})

const ApplicationProvider = ({ children, payload }: LayoutInterface & { payload: ApplicationInterface | null }) => {
    const axios = useAxios();
    const [state, setState] = useState<ApplicationContextStateInterface>({ ...initialState, data: payload });
    const { updateUser } = useAuth();

    const updateState = (state: Partial<ApplicationContextStateInterface>) => setState((prev) => ({ ...prev, ...state }));

    const getApplication = async () => {
        try {
            // const applicationId = storage.get("applicationId");
            // if (applicationId) {
            //     updateState({ loading: true });
            //     const response = await axios.get(`/api/application/loan/${applicationId}`);
            //     if (response.status === 200 || response.status === 201) {
            //         updateState({ data: response.data?.data || null });
            //     }
            // }
            updateState({ loading: true });
            const response = await axios.get("/api/v2/applicationByCustomerToken");
            if (response.status === 200 || response.status === 201) {
                const result = response.data;
                const data = (result?.data?.[0] || result?.data) as ApplicationInterface;
                // console.log("application get to func", result, data)
                if (Array.isArray(data) && data.length === 0) {
                    toast({ variant: "error", title: "Application not Found." });
                    return updateState({ data: null });
                }
                updateState({ data: data });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("get application error:", error.response?.data?.message);
            }
        } finally {
            updateState({ loading: false });
        }
    }

    const getCustomer = async () => {
        try {
            const response = await axios.get("/api/customer/get");
            if (response.status === 200 || response.status === 201) {
                const apiData = response.data?.data;
                const fullName = apiData.fullName;

                const userData: Partial<User> = {
                    firstName: apiData.firstName || "",
                    lastName: apiData.lastName || "",
                    name: fullName,
                    fullName,
                    email: apiData.email,
                    mobile: apiData.mobile,
                    dateOfBirth: apiData.dateOfBirth,
                    address: apiData.currentAddress?.line1,
                    city: apiData.currentAddress?.city,
                    state: apiData.currentAddress?.state,
                    pincode: apiData.currentAddress?.pincode,
                    kycStatus: apiData.kyc?.kycStatus || "PENDING",
                    status: apiData.status,
                    createdAt: apiData.createdAt,
                    profile: apiData.profile ? {
                        documentType: apiData.profile.documentType || "",
                        status: apiData.profile.status || "",
                        s3Key: apiData.profile.s3Key || "",
                        s3URL: apiData.profile.s3URL || "",
                    } : null,
                    isSubmit: apiData?.isSubmit || false,

                    // verified
                    isEmailVerified: apiData.isEmailVerified || false,
                    isMobileVerified: apiData.isMobileVerified || false,
                    isPanVerify: apiData.isPanVerify || false,
                    isAadhaarVerify: apiData.isAadhaarVerify || false,
                    brePulled: apiData.brePulled || false,

                    // dob: formatDateForInput(profileData.dateOfBirth) || prev.dob,
                    pan: apiData.panCard || null,
                    aadhaar: apiData.aadhaarNumber || null,
                    employmentType: apiData.employmentType || null,
                    monthlyIncome: apiData.monthlyIncome?.toString() || null,
                    companyName: apiData.companyName || null,
                    loanAmount: apiData.requestedLoanAmount?.toString() || null, // Loan amount from API

                    // bank
                    bankName: apiData.banks?.[0]?.bankName || null,
                    accountHolderName: apiData.banks?.[0]?.accountHolderName || null,
                    accountNumber: apiData.banks?.[0]?.accountNumber || null,
                    ifsc: apiData.banks?.[0]?.ifscCode || null,
                    pennyDropStatus: apiData.banks?.[0]?.pennyDropStatus || null,
                    bankVerified: apiData.banks?.[0]?.pennyDropStatus === "VERIFIED",
                    upiAutoPayStatus: apiData?.upiAutoPayStatus || false,
                }

                updateUser(userData);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("get customer error:", error.response?.data?.message);
            }
        }
    }

    return <ApplicationContext.Provider value={{
        application: state.data,
        loading: state.loading,
        setApplication: (application) => updateState({ data: application }),
        getApplication,
        getCustomer,
    }}>
        {children}
    </ApplicationContext.Provider>
}

export default ApplicationProvider;

export function useApplication() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplication must be used within an ApplicationProvider');
    }
    return context;
}
