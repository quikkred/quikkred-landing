"use client"

import React from 'react';
import { User, Calendar, Smartphone, CheckCircle, Lock } from 'lucide-react';
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";

interface BasicDetailsProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const BasicDetails = ({
    formData,
    setFormData
}: BasicDetailsProps) => {
    const isMobileVerified = formData.mobileVerified || false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#25B181]" />
                <h3 className="text-sm font-bold text-gray-900">Personal Details</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Full Name Field */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 ml-1">
                        Full Name <span className="text-gray-400 font-normal">(as per PAN)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Rahul Kumar"
                            className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25B181]/20 focus:border-[#25B181] transition-colors placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Date of Birth Field */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 ml-1">
                        Date of Birth
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25B181]/20 focus:border-[#25B181] transition-colors text-gray-900"
                        />
                    </div>
                </div>

                {/* Mobile Number Field */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 ml-1 flex justify-between">
                        <span>Mobile Number</span>
                        {isMobileVerified && (
                            <span className="text-[10px] text-green-600 flex items-center gap-1 font-semibold">
                                <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                        )}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Smartphone className={`h-4 w-4 ${isMobileVerified ? 'text-green-500' : 'text-gray-400'}`} />
                        </div>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            readOnly={isMobileVerified}
                            placeholder="9876543210"
                            maxLength={10}
                            className={`block w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg transition-colors
                                ${isMobileVerified
                                    ? 'bg-green-50/50 border-green-200 text-gray-700 cursor-not-allowed'
                                    : 'border-gray-200 focus:ring-2 focus:ring-[#25B181]/20 focus:border-[#25B181]'
                                }`}
                        />
                        {isMobileVerified && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Lock className="h-3 w-3 text-green-600/70" />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BasicDetails;