"use client";

import React, { useState } from "react";
import { CreditCard, CheckCircle, AlertCircle, Loader2, User, Calendar } from "lucide-react";
import { isValidPAN } from "@/lib/constants/quickApplyV2";
import { API_BASE_URL } from "@/lib/config";
import { QuickApplyV2FormData, PANData } from "@/lib/types/quickApplyV2";
import getToken from "@/lib/getToken";
import useAxios from "@/hooks/useAxios";

interface PanVerifyProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const PanVerify = ({ formData, setFormData }: PanVerifyProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const axios = useAxios();

    const handleInputChange = (field: string, value: string) => {
        setError("");
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            panVerified: false,
        }));
    };

    const handleVerify = async () => {
        // 1. Validation
        if (!formData.pan || !isValidPAN(formData.pan)) {
            setError("Please enter a valid PAN Number.");
            return;
        }
        if (!formData.fullName || formData.fullName.length < 3) {
            setError("Please enter your full name as per PAN.");
            return;
        }
        if (!formData.dob) {
            setError("Please select your Date of Birth.");
            return;
        }

        setLoading(true);
        setError("");

        // 2. Format Date from YYYY-MM-DD to DD-MM-YYYY
        const [year, month, day] = formData.dob.split("-");
        const formattedDate = `${day}-${month}-${year}`;

        try {
            // const token = await getToken();
            // const response = await fetch(`${API_BASE_URL}/api/kyc/pan/verification`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`,
            //     },
            //     body: JSON.stringify({
            //         panNumber: formData.pan,
            //         name: formData.fullName,
            //         dob: formattedDate // ✅ Sent as DD-MM-YYYY
            //     }),
            // });

            // const data = await response.json();

            const response = await axios.post('/api/kyc/pan/verification', {
                panNumber: formData.pan,
                name: formData.fullName,
                dob: formattedDate, // ✅ Sent as DD-MM-YYYY
            });
            const data = response.data;

            if (data.success) {
                setFormData((prev) => ({
                    ...prev,
                    panVerified: true,
                    panData: data.data || { panNumber: formData.pan },
                }));
            } else {
                setError(data.message || "Verification failed. Details do not match.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                PAN Verification
            </h3>

            <div className="grid grid-cols-1 gap-4">
                {/* PAN Number */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">PAN Number *</label>
                    <input
                        type="text"
                        value={formData.pan}
                        onChange={(e) => handleInputChange("pan", e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        disabled={formData.panVerified || loading}
                        maxLength={10}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm uppercase outline-none focus:ring-2 focus:ring-[#25B181] transition-all ${
                            formData.panVerified ? "bg-green-50 border-green-500 font-semibold" : "bg-white border-gray-300"
                        }`}
                    />
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name (As per PAN) *</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="Enter full name"
                            disabled={formData.panVerified || loading}
                            className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#25B181] transition-all ${
                                formData.panVerified ? "bg-green-50 border-green-500" : "bg-white border-gray-300"
                            }`}
                        />
                    </div>
                </div>

                {/* DOB */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => handleInputChange("dob", e.target.value)}
                            disabled={formData.panVerified || loading}
                            className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#25B181] transition-all appearance-none ${
                                formData.panVerified ? "bg-green-50 border-green-500" : "bg-white border-gray-300"
                            }`}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-md animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">{error}</p>
                </div>
            )}

            {!formData.panVerified ? (
                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading || !formData.pan || !formData.fullName || !formData.dob}
                    className="w-full py-3 bg-[#25B181] text-white rounded-lg font-semibold text-sm hover:bg-[#1d8f6a] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Verify PAN Details"
                    )}
                </button>
            ) : (
                <div className="w-full py-3 bg-green-100 border border-green-300 rounded-lg flex items-center justify-center gap-2 animate-in zoom-in-95 duration-300">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700 font-mono tracking-widest">VERIFIED</span>
                </div>
            )}
        </div>
    );
};

export default PanVerify;