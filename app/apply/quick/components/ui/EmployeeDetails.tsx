"use client";

import { EMPLOYMENT_TYPES } from "@/lib/constants/quickApplyV2";
import { useQuickApplyTracking } from "@/lib/hooks";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { AlertCircle, Briefcase, IndianRupee } from "lucide-react";
import { useState } from "react";
import SelectProduct from "./SelectProduct";

interface EmployeeDetailsProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const EmployeeDetails = ({ formData, setFormData }: EmployeeDetailsProps) => {
    const {
        trackEmploymentTypeSelected,
        trackIncomeEntered,
        trackFieldFocus,
    } = useQuickApplyTracking();

    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- HELPER: Formats 100000 -> "1,00,000" ---
    const formatIndianNumber = (value: string | number) => {
        if (!value) return "";
        const rawNum = value.toString().replace(/,/g, "").replace(/\D/g, "");
        if (!rawNum) return "";
        return new Intl.NumberFormat("en-IN").format(Number(rawNum));
    };

    // --- HELPER: Get Raw Number from "1,00,000" -> 100000 ---
    const getRawNumber = (value: string) => {
        return value.replace(/,/g, "").replace(/\D/g, "");
    };

    /* ---------------- EMPLOYMENT TYPE ---------------- */
    const handleEmploymentTypeChange = (type: "SALARIED" | "SELF-EMPLOYED") => {
        setFormData((prev) => ({
            ...prev,
            employmentType: type,
        }));
        setErrors((prev) => ({ ...prev, employmentType: "" }));
        trackEmploymentTypeSelected(type);
    };

    /* ---------------- MONTHLY INCOME ---------------- */
    const handleMonthlyIncomeChange = (value: string) => {
        // 1. Get raw number (remove commas)
        const rawValue = getRawNumber(value);

        // 2. LIMIT: 10,00,000
        if (rawValue && parseInt(rawValue) > 1000000) {
            return;
        }

        // 3. Save RAW value to state (e.g., "30000", not "30,000")
        setFormData((prev) => ({
            ...prev,
            monthlyIncome: rawValue,
        }));

        setErrors((prev) => ({ ...prev, monthlyIncome: "" }));

        if (rawValue && parseInt(rawValue) > 0) {
            trackIncomeEntered(parseInt(rawValue));
        }
    };

    /* ---------------- COMPANY NAME / SOURCE ---------------- */
    const handleCompanyNameChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            companyName: value,
        }));
        setErrors((prev) => ({ ...prev, companyName: "" }));
    };

    /* ---------------- LOAN AMOUNT ---------------- */
    const handleLoanAmountChange = (value: string) => {
        const rawValue = getRawNumber(value);

        // Cap typing at the absolute max (50,000)
        if (rawValue && parseInt(rawValue) > 50000) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            loanAmount: Number(rawValue),
        }));
        setErrors((prev) => ({ ...prev, loanAmount: "" }));
    };

    return (
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                Employment Details
            </h3>

            <div className="space-y-4">
                {/* ---------------- EMPLOYMENT TYPE ---------------- */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                        Employment Type *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {EMPLOYMENT_TYPES.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => handleEmploymentTypeChange(type.value)}
                                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all ${formData.employmentType === type.value
                                        ? "bg-[#25B181] text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:border-[#25B181]"
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                    {errors.employmentType && (
                        <p className="mt-1 text-xs text-red-600">{errors.employmentType}</p>
                    )}
                </div>

                {/* ---------------- INCOME + COMPANY ---------------- */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Monthly Income */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Monthly Income *
                        </label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                inputMode="numeric"
                                // FIX: Format the raw value for display here
                                value={formatIndianNumber(formData.monthlyIncome)}
                                onChange={(e) => handleMonthlyIncomeChange(e.target.value)}
                                onFocus={() => trackFieldFocus("monthlyIncome", 2)}
                                className="w-full pl-8 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] border-gray-300"
                                placeholder="Enter income"
                            />
                        </div>
                        {errors.monthlyIncome && (
                            <p className="mt-1 text-xs text-red-600">{errors.monthlyIncome}</p>
                        )}
                    </div>

                    {/* Company / Source */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            {formData.employmentType === "SALARIED" ? "Company Name" : "Income Source"} *
                        </label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleCompanyNameChange(e.target.value)}
                            onFocus={() => trackFieldFocus("companyName", 2)}
                            className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] border-gray-300"
                            placeholder={formData.employmentType === "SALARIED" ? "Your company" : "Your income source"}
                        />
                        {errors.companyName && (
                            <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>
                        )}
                    </div>
                </div>

                {/* ---------------- LOAN AMOUNT ---------------- */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                        How much loan do you need? *
                    </label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            inputMode="numeric"
                            // Format number from state for display
                            value={formData.loanAmount ? formatIndianNumber(formData.loanAmount) : ""}
                            onChange={(e) => handleLoanAmountChange(e.target.value)}
                            onFocus={() => trackFieldFocus("loanAmount", 2)}
                            className="w-full pl-8 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] border-gray-300"
                            placeholder="₹ 2,500 - ₹ 50,000"
                        />
                    </div>

                    {formData.loanAmount > 0 && formData.loanAmount < 2500 && (
                        <p className="mt-1 text-xs text-red-500">Minimum loan amount is ₹2,500</p>
                    )}
                    {formData.loanAmount > 50000 && (
                        <p className="mt-1 text-xs text-red-500">Maximum loan amount is ₹50,000</p>
                    )}
                    {!formData.loanAmount || (formData.loanAmount >= 2500 && formData.loanAmount <= 50000) ? (
                        <p className="mt-1 text-xs text-gray-500">Enter the approximate loan amount (₹2,500 – ₹50,000)</p>
                    ) : null}
                </div>

                <SelectProduct formData={formData} setFormData={setFormData} />
            </div>

            {/* ---------------- SUBMIT ERROR ---------------- */}
            {errors.submit && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-red-700">{errors.submit}</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeDetails;