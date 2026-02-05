"use client"

import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { Mail, Phone } from "lucide-react";

interface MissingFieldProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const MissingField = ({
    formData,
    setFormData
}: MissingFieldProps) => {

    // Helper to update specific fields
    const handleChange = (field: 'email' | 'mobile', value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // 1. If Email is NOT verified, show Email Input
    if (!formData.emailVerified) {
        return (
            <div className="w-full space-y-2 animate-in fade-in slide-in-from-top-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                    Enter Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        value={formData.email || ""}
                        disabled={formData.brePulled}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john.doe@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25B181]/20 focus:border-[#25B181] outline-none transition-all text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                </div>
                <p className="text-[11px] text-gray-500 ml-1">
                    We need your email to send the loan agreement.
                </p>
            </div>
        );
    }

    // 2. If Email IS verified, but Mobile is NOT, show Mobile Input
    if (!formData.mobileVerified) {
        return (
            <div className="w-full space-y-2 animate-in fade-in slide-in-from-top-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                    Enter Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="absolute inset-y-0 left-9 flex items-center text-sm font-medium text-gray-500">
                        +91
                    </span>
                    <input
                        type="tel"
                        maxLength={10}
                        value={formData.mobile || ""}
                        disabled={formData.brePulled}
                        onChange={(e) => {
                            // Only allow numbers
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) handleChange('mobile', val);
                        }}
                        placeholder="9876543210"
                        className="w-full pl-16 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25B181]/20 focus:border-[#25B181] outline-none transition-all text-sm tracking-wide font-medium disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                </div>
                <p className="text-[11px] text-gray-500 ml-1">
                    Enter the mobile number linked to your Aadhaar.
                </p>
            </div>
        );
    }

    // 3. If both are verified, return null (hidden)
    return null;
}

export default MissingField;