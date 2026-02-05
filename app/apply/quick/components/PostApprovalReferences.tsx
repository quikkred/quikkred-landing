'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, ArrowRight, ArrowLeft, AlertCircle, Loader2, CheckCircle
} from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { RELATIONSHIP_TYPES, VALIDATION } from '@/lib/constants/quickApplyV2';
import useAxios from '@/hooks/useAxios';
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';

interface PostApprovalReferencesProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function PostApprovalReferences({
    formData,
    setFormData,
    onNext,
    onBack,
}: PostApprovalReferencesProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const axios = useAxios();

    const { trackStepViewed, trackStepCompleted, trackFormError, trackAPIError } = useQuickApplyTracking();

    const hasTrackedStepRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(7, 'Personal References');
        }
    }, [trackStepViewed]);

    const handleChange = (field: string, value: string) => {
        // For name fields: only letters and spaces
        if (field.includes('Name') && value) {
            value = value.replace(/[^a-zA-Z\s]/g, '');
        }
        // For mobile fields: only digits, starts with 6-9
        if (field.includes('Mobile') && value) {
            value = value.replace(/\D/g, '').slice(0, 10);
        }
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Reference 1
        if (!formData.reference1Name || formData.reference1Name.trim().length < 2) {
            newErrors.reference1Name = 'Name is required (min 2 characters)';
        }
        if (!VALIDATION.MOBILE.test(formData.reference1Mobile)) {
            newErrors.reference1Mobile = 'Valid 10-digit mobile required';
        }
        if (!formData.reference1Relationship) {
            newErrors.reference1Relationship = 'Please select relationship';
        }

        // Reference 2
        if (!formData.reference2Name || formData.reference2Name.trim().length < 2) {
            newErrors.reference2Name = 'Name is required (min 2 characters)';
        }
        if (!VALIDATION.MOBILE.test(formData.reference2Mobile)) {
            newErrors.reference2Mobile = 'Valid 10-digit mobile required';
        }
        if (!formData.reference2Relationship) {
            newErrors.reference2Relationship = 'Please select relationship';
        }

        // Check duplicate mobiles
        if (formData.reference1Mobile && formData.reference1Mobile === formData.reference2Mobile) {
            newErrors.reference2Mobile = 'Cannot use same mobile for both references';
        }
        // Check not same as applicant
        if (formData.reference1Mobile === formData.mobile) {
            newErrors.reference1Mobile = 'Cannot use your own mobile number';
        }
        if (formData.reference2Mobile === formData.mobile) {
            newErrors.reference2Mobile = 'Cannot use your own mobile number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Object.entries(newErrors).forEach(([field, msg]) => trackFormError(field, msg, 7));
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setSubmitLoading(true);
        try {
            const applicationId = localStorage.getItem('applicationId');
            await axios.post('/api/application/loan/update', {
                applicationId,
                references: [
                    {
                        name: formData.reference1Name,
                        mobile: formData.reference1Mobile,
                        relationship: formData.reference1Relationship,
                    },
                    {
                        name: formData.reference2Name,
                        mobile: formData.reference2Mobile,
                        relationship: formData.reference2Relationship,
                    },
                ],
            });

            trackStepCompleted(7, 'Personal References');
            onNext();
        } catch (error) {
            trackAPIError('/api/application/loan/update', 'References save failed');
            // Proceed anyway - references are not critical
            onNext();
        } finally {
            setSubmitLoading(false);
        }
    };

    const ReferenceForm = ({ num, nameField, mobileField, relationField }: {
        num: number;
        nameField: string;
        mobileField: string;
        relationField: string;
    }) => (
        <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800">
                Reference {num}
            </h4>

            {/* Name */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                    type="text"
                    value={(formData as any)[nameField] || ''}
                    onChange={(e) => handleChange(nameField, e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#25B181] ${errors[nameField] ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors[nameField] && <p className="mt-1 text-xs text-red-600">{errors[nameField]}</p>}
            </div>

            {/* Mobile */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input
                    type="tel"
                    inputMode="numeric"
                    value={(formData as any)[mobileField] || ''}
                    onChange={(e) => handleChange(mobileField, e.target.value)}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#25B181] ${errors[mobileField] ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors[mobileField] && <p className="mt-1 text-xs text-red-600">{errors[mobileField]}</p>}
            </div>

            {/* Relationship */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Relationship *</label>
                <select
                    value={(formData as any)[relationField] || ''}
                    onChange={(e) => handleChange(relationField, e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#25B181] appearance-none ${errors[relationField] ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="">Select relationship</option>
                    {RELATIONSHIP_TYPES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
                {errors[relationField] && <p className="mt-1 text-xs text-red-600">{errors[relationField]}</p>}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Personal References</h2>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25B181]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Add 2 References</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">Family or friends who can vouch for you</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <ReferenceForm
                        num={1}
                        nameField="reference1Name"
                        mobileField="reference1Mobile"
                        relationField="reference1Relationship"
                    />
                    <div className="border-t border-gray-200" />
                    <ReferenceForm
                        num={2}
                        nameField="reference2Name"
                        mobileField="reference2Mobile"
                        relationField="reference2Relationship"
                    />
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-[#25B181]/10 rounded-lg p-2.5 sm:p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#25B181] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-xs text-gray-700">
                    References will not be contacted unless required for verification.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
                <button
                    onClick={onBack}
                    disabled={submitLoading}
                    className="px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitLoading}
                    className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                >
                    {submitLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Saving...</span>
                        </>
                    ) : (
                        <>
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                    )}
                </button>
            </div>

            <p className="text-center text-[10px] sm:text-xs text-gray-500">
                Step 4 of 5: Bank → Aadhaar → Selfie → <span className="font-medium text-[#25B181]">References</span> → BSA
            </p>
        </motion.div>
    );
}
