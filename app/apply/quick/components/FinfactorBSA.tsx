'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Building2, ArrowRight, ArrowLeft, AlertCircle, Loader2,
    CheckCircle, ExternalLink
} from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import { useQuickApplyTracking } from '@/lib/hooks/useQuickApplyTracking';
import getToken from '@/lib/getToken';
import { useSearchParams } from 'next/navigation';

interface FinfactorBSAProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function FinfactorBSA({
    formData,
    setFormData,
    onNext,
    onBack,
}: FinfactorBSAProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [consentComplete, setConsentComplete] = useState(false);
    const searchParams = useSearchParams();

    const { trackStepViewed, trackStepCompleted, trackAPIError } = useQuickApplyTracking();

    const hasTrackedStepRef = useRef(false);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(8, 'Finfactor BSA');
        }
    }, [trackStepViewed]);

    // Check if returning from finfactor redirect
    useEffect(() => {
        const finfactorParam = searchParams.get('finfactor');
        if (finfactorParam === 'success') {
            setConsentComplete(true);
            setFormData(prev => ({ ...prev, finfactorConsent: true, bsaInitiated: true }));
        }
    }, [searchParams, setFormData]);

    // Skip if already initiated
    useEffect(() => {
        if (formData.bsaInitiated) {
            setConsentComplete(true);
        }
    }, [formData.bsaInitiated]);

    const handleInitiateConsent = async () => {
        setLoading(true);
        setError('');

        try {
            const token = await getToken();
            if (!token) {
                setError('Please login again to continue.');
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/kyc/finfactorConsentRequest`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();

            if (response.ok && result.success) {
                if (result.data?.url) {
                    // Redirect to Finfactor consent page
                    window.location.href = result.data.url;
                } else {
                    setError('No redirect URL received. Please try again.');
                }
            } else {
                setError(result.message || 'Failed to initiate bank statement analysis.');
            }
        } catch (err: any) {
            const errorMsg = err?.message || 'Network error. Please try again.';
            setError(errorMsg);
            trackAPIError('/api/kyc/finfactorConsentRequest', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        trackStepCompleted(8, 'Finfactor BSA');
        onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bank Statement Analysis</h2>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25B181]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Account Aggregator Consent</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">Securely share bank statement for faster approval</p>
                    </div>
                </div>

                {consentComplete ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 rounded-lg p-4 border border-green-200 text-center"
                    >
                        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-green-800">Bank Statement Shared Successfully</p>
                        <p className="text-xs text-green-600 mt-1">Your bank data has been received for analysis.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <p className="text-xs text-blue-800">
                                <strong>What happens:</strong> You'll be redirected to your bank's Account Aggregator portal
                                to securely share your bank statement. This helps us verify your income and approve your loan faster.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                <span>RBI-regulated data sharing</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                <span>One-time consent for this loan only</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                <span>Read-only access — no transactions</span>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <p className="text-xs text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleInitiateConsent}
                            disabled={loading}
                            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Initiating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Share Bank Statement</span>
                                    <ExternalLink className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                {consentComplete && (
                    <button
                        onClick={handleContinue}
                        className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                    >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                )}
            </div>

            <p className="text-center text-[10px] sm:text-xs text-gray-500">
                Step 5 of 5: Bank → Aadhaar → Selfie → References → <span className="font-medium text-[#25B181]">BSA</span>
            </p>
        </motion.div>
    );
}
