"use client"

import { toast } from "@/components/ui/toast";
import useAxios from "@/hooks/useAxios";
import tracking from "@/lib/tracking";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { VALIDATION } from "@/lib/constants/quickApplyV2";
import { useApplication } from "@/contexts/ApplicationContext";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { useMemo, useState } from "react";

interface ReferencesProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onBack: () => void;
}

type ReferenceErrors = {
    reference1Name?: string;
    reference1Mobile?: string;
    reference2Name?: string;
    reference2Mobile?: string;
};

const NAME_REGEX = /[^a-zA-Z\s.'-]/g;
const DIGITS_ONLY = /^\d*$/;

const References = ({ formData, setFormData, onBack }: ReferencesProps) => {
    const axios = useAxios();
    const { application, getApplication, getCustomer } = useApplication();

    const [errors, setErrors] = useState<ReferenceErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const updateFormData = (updates: Partial<QuickApplyV2FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleNameChange = (
        field: "reference1Name" | "reference2Name",
        value: string,
    ) => {
        const clean = value.replace(NAME_REGEX, "");
        updateFormData({ [field]: clean } as Partial<QuickApplyV2FormData>);
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleMobileChange = (
        field: "reference1Mobile" | "reference2Mobile",
        value: string,
    ) => {
        if (!DIGITS_ONLY.test(value)) return;
        const clean = value.slice(0, 10);
        updateFormData({ [field]: clean } as Partial<QuickApplyV2FormData>);
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const next: ReferenceErrors = {};
        const refs: Array<[keyof ReferenceErrors, keyof ReferenceErrors, string, string]> = [
            ["reference1Name", "reference1Mobile", formData.reference1Name, formData.reference1Mobile],
            ["reference2Name", "reference2Mobile", formData.reference2Name, formData.reference2Mobile],
        ];

        for (const [nameKey, mobileKey, nameVal, mobileVal] of refs) {
            if (!nameVal || nameVal.trim().length < 2) {
                next[nameKey] = "Enter a valid name";
            }
            if (!VALIDATION.MOBILE.test(mobileVal || "")) {
                next[mobileKey] = "Enter a valid 10-digit mobile";
            }
        }

        const m1 = formData.reference1Mobile;
        const m2 = formData.reference2Mobile;
        if (m1 && m2 && m1 === m2) {
            next.reference2Mobile = "References must have different numbers";
        }
        if (formData.mobile && (m1 === formData.mobile || m2 === formData.mobile)) {
            const dupKey: keyof ReferenceErrors = m1 === formData.mobile ? "reference1Mobile" : "reference2Mobile";
            next[dupKey] = "Reference cannot be your own number";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const canSubmit = useMemo(() => {
        return (
            formData.reference1Name?.trim().length >= 2 &&
            VALIDATION.MOBILE.test(formData.reference1Mobile || "") &&
            formData.reference2Name?.trim().length >= 2 &&
            VALIDATION.MOBILE.test(formData.reference2Mobile || "") &&
            formData.reference1Mobile !== formData.reference2Mobile
        );
    }, [formData.reference1Name, formData.reference1Mobile, formData.reference2Name, formData.reference2Mobile]);

    const handleSubmit = async () => {
        if (!validate()) return;

        const applicationId = application?._id;
        if (!applicationId) {
            toast({ variant: "error", title: "No active application found" });
            return;
        }

        setSubmitting(true);
        try {
            const references = [
                {
                    name: formData.reference1Name.trim(),
                    mobile: formData.reference1Mobile,
                    relationship: formData.reference1Relationship || "",
                },
                {
                    name: formData.reference2Name.trim(),
                    mobile: formData.reference2Mobile,
                    relationship: formData.reference2Relationship || "",
                },
            ];

            const updateRes = await axios.put("/api/loans/update", {
                applicationId,
                references,
            });

            if (updateRes.status !== 200 && updateRes.status !== 201) {
                throw new Error(updateRes.data?.message || "Failed to save references");
            }

            tracking.trackEvent("CUSTOM_EVENT", { event: "REFERENCES_COLLECTED" });

            const submitRes = await axios.post("/api/v2/application/loan/create", {
                isSubmit: true,
            });

            if (submitRes.status === 200 || submitRes.status === 201) {
                toast({
                    variant: "success",
                    title: "Application submitted successfully",
                    description: "Your application has been received and is being reviewed. We’ll notify you of the next steps shortly.",
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast({ variant: "error", title: error.response?.data?.message || "Internal server error" });
            } else if (error instanceof Error) {
                toast({ variant: "error", title: error.message });
            }
        } finally {
            getApplication();
            getCustomer();
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#25B181]" />
                <h2 className="text-xl font-bold text-gray-900">References</h2>
            </div>
            <p className="text-sm text-gray-600 -mt-2">
                Please provide two references we can reach if needed.
            </p>

            {[1, 2].map((idx) => {
                const nameKey = `reference${idx}Name` as "reference1Name" | "reference2Name";
                const mobileKey = `reference${idx}Mobile` as "reference1Mobile" | "reference2Mobile";
                return (
                    <div
                        key={idx}
                        className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200"
                    >
                        <h3 className="text-sm font-semibold text-gray-800">Reference {idx}</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData[nameKey] || ""}
                                onChange={(e) => handleNameChange(nameKey, e.target.value)}
                                placeholder="Enter full name"
                                className={`w-full px-4 py-3 placeholder:text-base bg-white border rounded-lg focus:ring-2 focus:ring-[#25B181] ${errors[nameKey] ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors[nameKey] && (
                                <p className="mt-1 text-xs text-red-600">{errors[nameKey]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                value={formData[mobileKey] || ""}
                                onChange={(e) => handleMobileChange(mobileKey, e.target.value)}
                                maxLength={10}
                                placeholder="10-digit mobile number"
                                className={`w-full px-4 py-3 placeholder:text-base bg-white border rounded-lg focus:ring-2 focus:ring-[#25B181] ${errors[mobileKey] ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors[mobileKey] && (
                                <p className="mt-1 text-xs text-red-600">{errors[mobileKey]}</p>
                            )}
                        </div>
                    </div>
                );
            })}

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={submitting}
                    className="sm:w-auto w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    className="flex-1 py-2 text-sm bg-gradient-to-r disabled:cursor-not-allowed from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-semibold sm:text-base shadow-lg shadow-[#25B181]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Application</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default References;
