'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, AlertCircle, ArrowRight, Chrome, Smartphone } from 'lucide-react';

interface AuthSelectionProps {
    mobile: string;
    onGoogleAuth: () => void;
    onTruecallerAuth: () => void;
    onBack: () => void;
}

export default function AuthSelection({ mobile, onGoogleAuth, onTruecallerAuth, onBack }: AuthSelectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Shield className="w-8 h-8 text-[#25B181]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Verify Your Identity
                </h2>
                <p className="text-sm text-gray-600">
                    Choose your preferred authentication method
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    Mobile: <span className="font-semibold">+91 {mobile}</span>
                </p>
            </div>

            {/* Authentication Options */}
            <div className="space-y-3">
                {/* Google Sign In - Primary Option */}
                <motion.button
                    onClick={onGoogleAuth}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 bg-white border-2 border-[#25B181] rounded-xl hover:bg-green-50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 group-hover:border-[#25B181] transition-colors">
                            <Chrome className="w-6 h-6 text-[#4285F4]" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-semibold text-gray-900">Continue with Google</p>
                            <p className="text-xs text-gray-500">Fast & Secure verification</p>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                <Shield className="w-3 h-3" />
                                Recommended
                            </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#25B181] transition-colors" />
                    </div>
                </motion.button>

                {/* Truecaller - Secondary Option */}
                <motion.button
                    onClick={onTruecallerAuth}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-semibold text-gray-900">Continue with Truecaller</p>
                            <p className="text-xs text-gray-500">Instant 1-tap verification</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                </motion.button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">Why we need verification?</p>
                        <p className="text-blue-700">
                            We use secure authentication to protect your personal information and ensure only you can access your loan application.
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="text-center">
                <p className="text-[10px] text-gray-500">
                    By continuing, you agree to share your basic profile information for verification purposes only.
                </p>
            </div>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
                ← Go Back
            </button>
        </motion.div>
    );
}
