"use client"

import { toast } from "@/components/ui/toast";
import useAxios from "@/hooks/useAxios";
import { initialFieldErrors } from "@/lib/constants/quickApply";
import tracking from "@/lib/tracking";
import { FieldErrors } from "@/lib/types/quickApply";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, IndianRupee, Loader2, Lock, Shield } from "lucide-react";
import { useRef, useState, useCallback, useMemo } from "react";
import SelfieVerify from "./ui/SelfieVerify";
import { calculateLoanDetails, formatCurrency } from "@/lib/constants/quickApplyV2";
import { useApplication } from "@/contexts/ApplicationContext";
import EMandateVerify from "./ui/EMandateVerify";

// Regex Constants
const REGEX = {
    IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    NUMBERS_ONLY: /^\d*$/,
    ALPHA_SPACE: /[^a-zA-Z\s]/g,
    IFSC_CLEAN: /[^A-Z0-9]/g
};

interface BankVerificationProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    // onNext: () => void;
    // onBack: () => void;
}

const BankVerification = ({
    formData,
    setFormData,
    // onNext,
    // onBack,
}: BankVerificationProps) => {
    const axios = useAxios();
    const { getApplication, getCustomer } = useApplication();

    // UI States (Loading/Errors only, Data stays in formData)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>(initialFieldErrors);
    const [ifscLoading, setIfscLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const ifscTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

    const canProceed = useMemo(() => (formData.bankVerified && formData.selfieVerified && formData.upiAutoPayStatus), [formData]);

    // --- Helpers ---

    // Generic updater to reduce boilerplate
    const updateFormData = (updates: Partial<QuickApplyV2FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const clearError = (field: string) => {
        setFieldErrors(prev => ({ ...prev, [field]: "" }));
    };

    // --- 1. IFSC Logic ---

    const fetchBankDetails = async (ifscCode: string) => {
        setIfscLoading(true);
        try {
            const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
            if (response.ok) {
                const data = await response.json();
                // console.log("bank razorpay", data)
                updateFormData({
                    bankName: data.BANK,
                    // If you have a branch field in formData, set it here too
                });
                toast({
                    variant: "success",
                    title: "Bank Detected",
                    description: `${data.BANK} - ${data.BRANCH}`
                });
                clearError("ifsc");
            } else {
                updateFormData({ bankName: "" });
                setFieldErrors(prev => ({ ...prev, ifsc: "Invalid IFSC Code" }));
            }
        } catch (error) {
            console.error(error);
            updateFormData({ bankName: "" });
        } finally {
            setIfscLoading(false);
        }
    };

    // --- 2. Unified Change Handler ---

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // A. Account Number: Numbers Only + Max Length
        if (name === "accountNumber") {
            if (!REGEX.NUMBERS_ONLY.test(value)) return;

            updateFormData({
                accountNumber: value,
                bankVerified: false // Reset verification on change
            });

            // Local Validation
            if (value.length > 0 && value.length < 9) {
                setFieldErrors(prev => ({ ...prev, accountNumber: "Min 9 digits required" }));
            } else {
                clearError("accountNumber");
            }
        }

        // B. Account Holder: Text Only
        else if (name === "accountHolderName") {
            const cleanValue = value.replace(REGEX.ALPHA_SPACE, '');
            updateFormData({
                accountHolderName: cleanValue,
                bankVerified: false
            });
            clearError("accountHolderName");
        }

        // C. IFSC: Uppercase + Auto-Fetch
        else if (name === "ifsc") {
            const cleanIfsc = value.toUpperCase().replace(REGEX.IFSC_CLEAN, '').slice(0, 11);

            updateFormData({
                ifsc: cleanIfsc,
                bankVerified: false,
                bankName: cleanIfsc.length < 11 ? "" : formData.bankName // Clear bank if code incomplete
            });

            // Debounced API Call
            if (ifscTimeoutRef.current) clearTimeout(ifscTimeoutRef.current);

            if (cleanIfsc.length === 11) {
                if (REGEX.IFSC.test(cleanIfsc)) {
                    clearError("ifsc");
                    ifscTimeoutRef.current = setTimeout(() => fetchBankDetails(cleanIfsc), 300);
                } else {
                    setFieldErrors(prev => ({ ...prev, ifsc: "Invalid format (e.g. SBIN0001234)" }));
                }
            } else {
                clearError("ifsc");
            }
        }

        // D. Fallback for other fields
        else {
            updateFormData({ [name]: value } as any);
        }
    };

    // --- 3. Penny Drop Verification ---

    const verifyBankAccount = async () => {
        // Pre-flight validation
        const errors: any = {};
        if (!formData.accountNumber || formData.accountNumber.length < 9) errors.accountNumber = "Invalid account number";
        if (!formData.ifsc || !REGEX.IFSC.test(formData.ifsc)) errors.ifsc = "Invalid IFSC";
        if (!formData.accountHolderName || formData.accountHolderName.length < 3) errors.accountHolderName = "Name required";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(prev => ({ ...prev, ...errors }));
            return;
        }

        setVerifyLoading(true);
        try {
            const response = await axios.post(`/api/v2/bank/verification`, {
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifsc,
                accountHolderName: formData.accountHolderName,
                bankName: formData.bankName
            });

            const result = response.data;

            if (response.status === 200 || response.status === 201) {
                // Success: Update formData directly
                updateFormData({
                    bankVerified: true,
                    // If API returns normalized name, update it
                    accountHolderName: result?.data?.accountHolderName || formData.accountHolderName
                });

                toast({ variant: "success", title: result?.message || "Verified Successfully" });
                tracking.trackEvent('CUSTOM_EVENT', { event: 'BANK_DETAILS_COLLECTED' });
            } else {
                throw new Error(result?.message || "Verification failed");
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Verification failed";
            toast({ variant: "error", title: "Error", description: msg });
            updateFormData({ bankVerified: false });
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!canProceed) {
            toast({ variant: "warning", title: "Verification Required", description: "Please complete bank verification, selfie, and UPI AutoPay authorization" });
            return;
        }
        setSubmitLoading(true);
        // Simulate API call or navigation delay
        // await new Promise(r => setTimeout(r, 500));
        // onNext();

        const nameParts = formData.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

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
            isSubmit: true,
        }

        try {
            // const response = await axios.post("/api/mandate-checkout/generate-link", {
            //     applicationId: application?._id,
            // });
            // if(response.status === 200 || response.status === 201){
            //     console.log(response.data);
            // }
            const response = await axios.post("/api/v2/application/loan/create", {
                // basicDetails
                isSubmit: true,
            });
            if (response.status === 200 || response.status === 201) {
                toast({
                    variant: "success",
                    title: "Application submitted successfully",
                    description: "Your application has been received and is being reviewed. We’ll notify you of the next steps shortly."
                });
                console.log("data", response.data);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                toast({ variant: "error", title: error.response?.data?.message || "Internal server error" });
            }
        } finally {
            getApplication();
            getCustomer();
            setSubmitLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bank Details & Consent</h2>

            {/* Verification Badge */}
            {formData.bankVerified && (
                <div className="h-6">
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium animate-in fade-in">
                        <CheckCircle className="w-4 h-4" /> Account Verified
                    </span>
                </div>
            )}

            <SelfieVerify formData={formData} setFormData={setFormData} />

            {/* ROW 1: IFSC & Bank Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="ifsc"
                            value={formData.ifsc}
                            onChange={handleFieldChange}
                            disabled={formData.bankVerified}
                            maxLength={11}
                            className={`w-full px-4 py-3 placeholder:text-base border rounded-lg uppercase transition-all ${fieldErrors.ifsc ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#25B181]'
                                } ${formData.bankVerified ? 'bg-gray-50' : ''}`}
                            placeholder="SBIN0001234"
                        />
                        <div className="absolute right-3 top-3">
                            {ifscLoading && <Loader2 className="w-5 h-5 text-[#25B181] animate-spin" />}
                            {!ifscLoading && formData.bankName && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                    </div>
                    {fieldErrors.ifsc && <p className="mt-1 text-xs text-red-600">{fieldErrors.ifsc}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        readOnly
                        className={`w-full px-4 py-3 placeholder:text-base border border-gray-300 rounded-lg bg-gray-50 ${formData.bankName ? 'text-gray-900 font-medium' : 'text-gray-400'
                            }`}
                        placeholder="Auto-detected from IFSC"
                    />
                </div>
            </div>

            {/* ROW 2: Account Holder & Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                    <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleFieldChange}
                        disabled={formData.bankVerified}
                        className={`w-full px-4 py-3 placeholder:text-base border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Name as per bank records"
                    />
                    {fieldErrors.accountHolderName && <p className="mt-1 text-xs text-red-600">{fieldErrors.accountHolderName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                    <input
                        type="tel"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleFieldChange}
                        disabled={formData.bankVerified}
                        maxLength={18}
                        className={`w-full px-4 py-3 placeholder:text-base border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.accountNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="9-18 digit number"
                    />
                    {fieldErrors.accountNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.accountNumber}</p>}
                </div>
            </div>

            {/* ACTION: Verify Button */}
            <div className="w-full">
                <button
                    type="button"
                    onClick={verifyBankAccount}
                    disabled={
                        formData.bankVerified ||
                        verifyLoading ||
                        !formData.bankName ||
                        formData.accountNumber.length < 9
                    }
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${formData.bankVerified
                        ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                        : verifyLoading
                            ? 'bg-gray-300 text-gray-600 cursor-wait'
                            : (!formData.bankName || formData.accountNumber.length < 9)
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-[#25B181] text-white hover:bg-[#1d9469] shadow-sm active:scale-[0.98]'
                        }`}
                >
                    {verifyLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                        </>
                    ) : formData.bankVerified ? (
                        <>
                            <CheckCircle className="w-4 h-4" /> Bank Verified
                        </>
                    ) : (
                        "Verify Bank Account"
                    )}
                </button>
            </div>

            {/* E-mandate */}
            <EMandateVerify formData={formData} setFormData={setFormData} />

            {/* <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex justify-start items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-[#25B181]" />
                        <span>Loan Details</span>
                    </div>
                    {formData && (
                        <span className="text-xs font-normal text-gray-500 ml-2">(Based on your selected amount)</span>
                    )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-500">Your Loan Amount</p>
                        <p className="text-lg sm:text-xl font-bold text-[#25B181]">
                            ₹{(formData?.approvedLoanAmount || 0).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-500">Tenure</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                            {formData?.tenure || 0} {(formData?.tenureUnit) === 'Days' ? 'Days' : 'Months'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-500">Interest Rate</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{(formData?.interestRate) || 0}%</p>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-500">Interest Amount</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">₹{(formData?.interestAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-500">Processing Fee</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">₹{((formData?.processingFee) || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-500">GST on Processing Fee</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">₹{((formData?.gstOnProcessingFee) || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 border border-gray-200 col-span-2">
                        <p className="text-xs sm:text-sm text-gray-500">Total Repayment</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">₹{((formData?.totalRepayment) || 0).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div> */}

            {/* Loan Summary */}
            {/* <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">You&apos;ll receive (Net Disbursal Amount)</span>
                    <span className="font-semibold text-green-600">{formatCurrency(formData?.netDisbursalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Processing Fee (10% + GST)</span>
                    <span className="text-gray-700">{formatCurrency(formData?.processingFee + formData?.gstOnProcessingFee)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm border-t pt-1.5 sm:pt-2">
                    <span className="text-gray-600">Total Repayment</span>
                    <span className="font-semibold text-gray-900">₹{((formData?.totalRepayment) || 0).toLocaleString('en-IN')}</span>
                </div>
            </div> */}

            {/* Navigation */}
            <button
                onClick={handleSubmit}
                disabled={submitLoading || !canProceed}
                className="w-full py-2 text-sm bg-gradient-to-r disabled:cursor-not-allowed from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold sm:text-base shadow-lg shadow-[#25B181]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
                {submitLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Submitting...</span>
                    </>
                ) : (
                    <>
                        <span>Application Submit</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </>
                )}
            </button>

            {/* Trust Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                        <p className="font-semibold mb-1">Your data is secure</p>
                        <p>256-bit encryption • RBI guidelines compliant • No hidden charges</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default BankVerification;