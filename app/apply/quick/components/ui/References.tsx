"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { RELATIONSHIP_TYPES, VALIDATION } from "@/lib/constants/quickApplyV2";

interface ReferencesProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

type RefErrors = {
    reference1Name?: string;
    reference1Mobile?: string;
    reference1Relationship?: string;
    reference2Name?: string;
    reference2Mobile?: string;
    reference2Relationship?: string;
};

const NAME_REGEX = /[^a-zA-Z\s.'-]/g;
const DIGITS_ONLY = /^\d*$/;

const References = ({ formData, setFormData }: ReferencesProps) => {
    const [errors, setErrors] = useState<RefErrors>({});

    const update = (updates: Partial<QuickApplyV2FormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleNameChange = (
        field: "reference1Name" | "reference2Name",
        value: string,
    ) => {
        const clean = value.replace(NAME_REGEX, "");
        update({ [field]: clean } as Partial<QuickApplyV2FormData>);
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleMobileChange = (
        field: "reference1Mobile" | "reference2Mobile",
        value: string,
    ) => {
        if (!DIGITS_ONLY.test(value)) return;
        const clean = value.slice(0, 10);
        update({ [field]: clean } as Partial<QuickApplyV2FormData>);

        let err: string | undefined;
        if (clean.length === 10 && !VALIDATION.MOBILE.test(clean)) {
            err = "Enter a valid 10-digit mobile";
        } else if (clean && formData.mobile && clean === formData.mobile) {
            err = "Reference cannot be your own number";
        }
        setErrors((prev) => ({ ...prev, [field]: err }));
    };

    const handleRelationshipChange = (
        field: "reference1Relationship" | "reference2Relationship",
        value: string,
    ) => {
        update({ [field]: value } as Partial<QuickApplyV2FormData>);
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const sameNumberError =
        formData.reference1Mobile &&
        formData.reference2Mobile &&
        formData.reference1Mobile === formData.reference2Mobile
            ? "References must have different numbers"
            : undefined;

    return (
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                References
            </h3>
            <p className="text-xs text-gray-600 mb-3">
                Please provide two references we can reach if needed.
            </p>

            <div className="space-y-4">
                {[1, 2].map((idx) => {
                    const nameKey = `reference${idx}Name` as
                        | "reference1Name"
                        | "reference2Name";
                    const mobileKey = `reference${idx}Mobile` as
                        | "reference1Mobile"
                        | "reference2Mobile";
                    const relKey = `reference${idx}Relationship` as
                        | "reference1Relationship"
                        | "reference2Relationship";

                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-lg p-3 border border-gray-200 space-y-3"
                        >
                            <p className="text-xs font-semibold text-gray-700">
                                Reference {idx}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[nameKey] || ""}
                                        onChange={(e) =>
                                            handleNameChange(nameKey, e.target.value)
                                        }
                                        placeholder="Enter full name"
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                                            errors[nameKey]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors[nameKey] && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors[nameKey]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={formData[mobileKey] || ""}
                                        onChange={(e) =>
                                            handleMobileChange(mobileKey, e.target.value)
                                        }
                                        maxLength={10}
                                        placeholder="10-digit mobile"
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                                            errors[mobileKey] ||
                                            (idx === 2 && sameNumberError)
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {(errors[mobileKey] ||
                                        (idx === 2 && sameNumberError)) && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors[mobileKey] || sameNumberError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                    Relationship *
                                </label>
                                <select
                                    value={formData[relKey] || ""}
                                    onChange={(e) =>
                                        handleRelationshipChange(relKey, e.target.value)
                                    }
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] bg-white ${
                                        errors[relKey]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select relationship</option>
                                    {RELATIONSHIP_TYPES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                {errors[relKey] && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors[relKey]}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default References;
