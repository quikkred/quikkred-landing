"use client";

import LayoutInterface from "@/interfaces/layoutInterface";
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldAlert,
    ArrowLeft,
    Loader2,
    Home,
    LayoutDashboard,
    Wallet,
    Calendar,
    Percent,
    CheckCircle2,
    Landmark,
    ArrowRight
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import useAxios from "@/hooks/useAxios";
import { toast } from "@/components/ui/toast";

// 1. Updated Interface to match your API Response
interface LoanOfferData {
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

type KycStatusTypes = "proceed-to-bank" | "approved" | "rejected" | "pending";

interface KycStatusInterface {
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

/* -------------------------------------------------------------------------- */
/* STATUS GUARD COMPONENT                                                     */
/* -------------------------------------------------------------------------- */

const StatusGuard = () => {
    const { visibility, loading, status, title, description, data, updateVisibility, onSuccess, onFailure } = useKycStatus();

    useEffect(() => {
        if (visibility) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [visibility]);

    const handleClose = () => updateVisibility(false);

    const handleSuccessContinue = () => {
        handleClose();
        if (onSuccess) onSuccess();
    };

    const handleFailureBack = () => {
        handleClose();
        if (onFailure) onFailure();
    };

    return (
        <AnimatePresence>
            {visibility && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-all"
                        onClick={loading ? undefined : handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                    >
                        {loading ? (
                            <LoadingView />
                        ) : (
                            <ResultView
                                status={status}
                                title={title}
                                description={description}
                                data={data}
                                onContinue={handleSuccessContinue}
                                onBack={handleFailureBack}
                            />
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

/* --------------------------- Sub-Components --------------------------- */

const LoadingView = () => (
    <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="relative mb-6">
            <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#25B181]/20 rounded-full"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 bg-[#25B181]/30 rounded-full"
            />
            <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#25B181]/10">
                <Loader2 className="w-8 h-8 text-[#25B181] animate-spin" />
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Checking Eligibility</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-[240px]">
            Please wait while we analyze your profile and generate an offer.
        </p>
    </div>
);

const ResultView = ({
    status,
    title,
    description,
    data,
    onContinue,
    onBack
}: {
    status: KycStatusTypes;
    title?: string;
    description?: string;
    data?: LoanOfferData | null;
    onContinue: () => void;
    onBack: () => void;
}) => {
    const router = useRouter();
    const [ptbLoading, setPtbLoading] = useState(false);
    const axios = useAxios();

    // Status Checks
    const isApproved = status === "approved";
    const isPtb = status === "proceed-to-bank";
    const isRejected = status === "rejected";

    const handleGoHome = () => {
        onBack();
        router.push('/');
    };

    const handleGoDashboard = () => {
        onBack();
        router.push('/user');
    };

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
                    onContinue();
                }
            } else {
                toast({ variant: "error", title: "Failed", description: result.message || "Failed to initiate bank verification." });
            }
        } catch (error: any) {
            console.error('PTB API error:', error);
            toast({ variant: "error", title: "Network Error", description: error?.message || "Unable to connect to server. Please try again." });
        } finally {
            setPtbLoading(false);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* UI CONFIGURATION BASED ON STATUS                                           */
    /* -------------------------------------------------------------------------- */

    let themeColor = "";
    let gradientBg = "";
    let icon = null;
    let defaultTitle = "";
    let defaultDesc = "";

    if (isApproved) {
        themeColor = "text-emerald-600 bg-emerald-100 ring-emerald-50";
        gradientBg = "bg-gradient-to-b from-emerald-50 to-white";
        icon = <CheckCircle2 className="w-10 h-10" />;
        defaultTitle = "Offer Unlocked!";
        defaultDesc = "Congratulations! You are eligible for the following loan offer.";
    } else if (isPtb) {
        themeColor = "text-blue-600 bg-blue-100 ring-blue-50";
        gradientBg = "bg-gradient-to-b from-blue-50 to-white";
        icon = <Landmark className="w-10 h-10" />;
        defaultTitle = "Proceed to Bank Verification";
        // ✅ Fixed: Uses API reason
        defaultDesc = data?.reason || "Your application requires additional bank verification to proceed.";
    } else {
        // Rejected or default
        themeColor = "text-red-500 bg-red-100 ring-red-50";
        gradientBg = "bg-gradient-to-b from-red-50 to-white";
        icon = <ShieldAlert className="w-10 h-10" />;
        defaultTitle = "Application Rejected";
        // ✅ Fixed: Uses API reason instead of hardcoded string
        defaultDesc = data?.reason || "We couldn't verify your identity based on the details provided.";
    }

    const displayTitle = title || defaultTitle;
    const displayDesc = description || defaultDesc;

    // Format currency helper
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="flex flex-col">
            {/* --- HEADER SECTION --- */}
            <div className={`relative ${isApproved && data?.loanAmount ? 'h-24' : 'h-32'} flex items-center justify-center overflow-hidden transition-colors ${gradientBg}`}>
                <div className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}
                />

                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className={`relative z-10 p-4 rounded-full shadow-lg ring-8 ${themeColor}`}
                >
                    {icon}
                </motion.div>
            </div>

            <div className="px-6 pb-6 pt-2">
                <div className="text-center mb-6">
                    <h3 className={`text-xl font-bold tracking-tight text-gray-900`}>
                        {displayTitle}
                    </h3>
                    {/* Only show description if we don't have the big data card or if it's rejected/ptb */}
                    {(!isApproved || !data?.loanAmount) && (
                        <p className="text-sm text-gray-500 mt-1">
                            {displayDesc}
                        </p>
                    )}
                </div>

                {/* --- 1. PROCEED TO BANK / REJECTED ID VIEW --- */}
                {/* Show Application ID for PTB or Rejected if available */}
                {(isPtb || isRejected) && (data?.applicationNumber || data?.applicationId) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-3 mb-6 border text-center ${isRejected ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}
                    >
                        <p className={`text-xs uppercase font-semibold mb-1 ${isRejected ? 'text-red-500' : 'text-blue-500'}`}>Application ID</p>
                        <p className="font-bold text-gray-800 text-base tracking-wide">
                            {data.applicationNumber || data.applicationId}
                        </p>
                    </motion.div>
                )}

                {/* --- 2. LOAN OFFER DATA VIEW (Only if Approved & Data exists) --- */}
                {isApproved && data && data.loanAmount && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-6"
                    >
                        <div className="text-center border-b border-gray-200 pb-3 mb-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Approved Amount</p>
                            <p className="text-3xl font-bold text-[#25B181] mt-1">
                                {formatCurrency(data.loanAmount)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Tenure</span>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">{data.tenure} {data.tenureUnit}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                    <Percent className="w-3.5 h-3.5" />
                                    <span>Interest</span>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">{formatCurrency(data.totalInterest || 0)}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                    <Wallet className="w-3.5 h-3.5" />
                                    <span>Disbursal</span>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">{formatCurrency(data.netDisbursalAmount || 0)}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Repayment</span>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">{formatCurrency(data.totalRepayment || 0)}</p>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                            <p className="text-[10px] text-gray-400">Application No: {data.applicationNumber || data.applicationId}</p>
                        </div>
                    </motion.div>
                )}

                {/* --- ACTION BUTTONS --- */}

                {/* CASE 1: Proceed To Bank Button */}
                {isPtb && (
                    <button
                        onClick={handleProceedToBankApi}
                        disabled={ptbLoading}
                        className="w-full group relative py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {ptbLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                <>Proceed to Bank <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </span>
                    </button>
                )}

                {/* CASE 2: Approved Button */}
                {isApproved && (
                    <button
                        onClick={onContinue}
                        className="w-full group relative py-3.5 px-4 bg-[#25B181] hover:bg-[#1F8F68] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#25B181]/20 hover:shadow-[#25B181]/40 hover:-translate-y-0.5"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Accept & Proceed
                            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                )}

                {/* CASE 3: Rejected / Default Buttons */}
                {isRejected && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleGoHome}
                            className="w-full py-3 px-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </button>

                        <button
                            onClick={handleGoDashboard}
                            className="w-full py-3 px-2 bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
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