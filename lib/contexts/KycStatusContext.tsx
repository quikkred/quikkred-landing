"use client";

import LayoutInterface from "@/interfaces/layoutInterface";
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import StatusGuard from "./ui/StatusGuard";

// 1. Updated Interface to match your API Response
export interface LoanOfferData {
    applicationNumber?: string; // Made optional
    applicationId?: string;     // Added to match your BRE response
    status: string;
    reason?: string;
    // These might be optional if rejected
    loanAmount?: number;
    interestRate?: number;
    totalInterest?: number;
    tenure?: number;
    tenureUnit?: string;
    totalRepayment?: number;
    emiAmount?: number;
    netDisbursalAmount?: number;
    dueDate?: string;
}

export type KycStatusTypes = "proceed-to-bank" | "approved" | "rejected" | "pending";

export interface KycStatusInterface {
    status: KycStatusTypes;
    loading: boolean;
    visibility: boolean;
    title?: string;
    description?: string;
    data?: LoanOfferData | null;
    onSuccess?: () => void;
    onFailure?: () => void;
}

interface KycStatusPropsInterface extends KycStatusInterface {
    updateVisibility: (visibility: boolean) => void;
    updateStatus: (status: KycStatusTypes) => void;
    setLoading: (load: boolean) => void;
    updateKycStatusState: (state: Partial<KycStatusInterface>) => void;
}

const KycStatusContext = createContext<KycStatusPropsInterface | undefined>(undefined);

const initialState: KycStatusInterface = {
    status: "pending",
    loading: false,
    visibility: false,
    title: "",
    description: "",
    data: null,
    onSuccess: undefined,
    onFailure: undefined,
};

export const KycStatusProvider = ({ children }: LayoutInterface) => {
    const [kycStatusState, setKycStatusState] = useState<KycStatusInterface>(initialState);

    const updateKycStatusState = useCallback((state: Partial<KycStatusInterface>) => {
        setKycStatusState((prev) => ({ ...prev, ...state }));
    }, []);

    const updateVisibility = useCallback((visibility: boolean) => updateKycStatusState({ visibility }), [updateKycStatusState]);
    const updateStatus = useCallback((status: KycStatusTypes) => updateKycStatusState({ status }), [updateKycStatusState]);
    const setLoading = useCallback((loading: boolean) => updateKycStatusState({ loading }), [updateKycStatusState]);

    const value = useMemo(() => ({
        ...kycStatusState,
        updateVisibility,
        updateStatus,
        setLoading,
        updateKycStatusState
    }), [kycStatusState, updateVisibility, updateStatus, setLoading, updateKycStatusState]);

    return (
        <KycStatusContext.Provider value={value}>
            <StatusGuard />
            {children}
        </KycStatusContext.Provider>
    );
};

export function useKycStatus() {
    const context = useContext(KycStatusContext);
    if (context === undefined) {
        throw new Error('useKycStatus must be used within a KycStatusProvider');
    }
    return context;
}

export default KycStatusProvider;