"use client";

import { EMPLOYMENT_TYPES } from "@/lib/constants/quickApplyV2";
import { useQuickApplyTracking } from "@/lib/hooks";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { AlertCircle, Briefcase, IndianRupee } from "lucide-react";
import { useState } from "react";

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

    /* ---------------- EMPLOYMENT TYPE ---------------- */
    const handleEmploymentTypeChange = (
        type: "SALARIED" | "SELF-EMPLOYED"
    ) => {
        setFormData((prev) => ({
            ...prev,
            employmentType: type,
        }));

        setErrors((prev) => ({ ...prev, employmentType: "" }));
        trackEmploymentTypeSelected(type);
    };

    /* ---------------- MONTHLY INCOME ---------------- */
    const handleMonthlyIncomeChange = (value: string) => {
        const numValue = value.replace(/\D/g, "");

        setFormData((prev) => ({
            ...prev,
            monthlyIncome: numValue,
        }));

        setErrors((prev) => ({ ...prev, monthlyIncome: "" }));

        if (numValue && parseInt(numValue) > 0) {
            trackIncomeEntered(parseInt(numValue));
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
        const numValue = Number(value.replace(/\D/g, "") || 0);

        setFormData((prev) => ({
            ...prev,
            loanAmount: numValue,
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
                        <p className="mt-1 text-xs text-red-600">
                            {errors.employmentType}
                        </p>
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
                                value={formData.monthlyIncome}
                                onChange={(e) =>
                                    handleMonthlyIncomeChange(e.target.value)
                                }
                                onFocus={() => trackFieldFocus("monthlyIncome", 2)}
                                className="w-full pl-8 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] border-gray-300"
                                placeholder="Enter income"
                            />
                        </div>

                        {errors.monthlyIncome && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.monthlyIncome}
                            </p>
                        )}
                    </div>

                    {/* Company / Source */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            {formData.employmentType === "SALARIED"
                                ? "Company Name"
                                : "Income Source"}{" "}
                            *
                        </label>

                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) =>
                                handleCompanyNameChange(e.target.value)
                            }
                            onFocus={() => trackFieldFocus("companyName", 2)}
                            className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] border-gray-300"
                            placeholder={
                                formData.employmentType === "SALARIED"
                                    ? "Your company"
                                    : "Your income source"
                            }
                        />

                        {errors.companyName && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.companyName}
                            </p>
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
                            value={formData.loanAmount}
                            onChange={(e) =>
                                handleLoanAmountChange(e.target.value)
                            }
                            onFocus={() => trackFieldFocus("loanAmount", 2)}
                            className="w-full pl-8 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] border-gray-300"
                            placeholder="₹ 5,000 - ₹ 25,000"
                        />
                    </div>

                    {formData.loanAmount < 5000 && (
                        <p className="mt-1 text-xs text-red-500">
                            Minimum loan amount is ₹5,000
                        </p>
                    )}

                    {formData.loanAmount > 25000 && (
                        <p className="mt-1 text-xs text-red-500">
                            Maximum loan amount is ₹25,000
                        </p>
                    )}

                    {!formData.loanAmount ||
                        (formData.loanAmount >= 5000 &&
                            formData.loanAmount <= 25000) ? (
                        <p className="mt-1 text-xs text-gray-500">
                            Enter the approximate loan amount
                        </p>
                    ) : null}
                </div>
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
