'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, CheckCircle, AlertCircle, Loader2, Phone, Mail, FileText, IndianRupee, Clock, Building2 } from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quikkred.in';

interface BsaConsentData {
    applicationNumber: string;
    customerName: string;
    maskedMobile: string;
    loanAmount: number;
    tenure: number;
    tenureUnit: string;
    status: string;
    bsaStatus: string;
    showConsentButton: boolean;
    redirectUrl: string | null;
}

function BsaConsentContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BsaConsentData | null>(null);
    const [redirecting, setRedirecting] = useState(false);

    const applicationId = searchParams.get('id');

    useEffect(() => {
        if (applicationId) {
            fetchDetails();
        } else {
            setLoading(false);
            setError('Invalid link. Missing application ID.');
        }
    }, [applicationId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/bsa-consent/details?id=${applicationId}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || 'Failed to load application details');
            }
        } catch (err) {
            setError('Failed to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConsent = () => {
        if (!data?.redirectUrl) return;
        setRedirecting(true);
        window.location.href = data.redirectUrl;
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Image src="/logo.png" alt="Quikkred" width={120} height={40} className="mx-auto mb-4" />
                    <Loader2 className="w-10 h-10 text-[#25B181] animate-spin mx-auto" />
                    <p className="mt-3 text-gray-600 font-medium">Loading your application...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error && !data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <Image src="/logo.png" alt="Quikkred" width={100} height={32} className="mx-auto mb-6" />
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a href="tel:+919311913854" className="inline-flex items-center gap-2 text-[#25B181] font-medium">
                        <Phone className="w-4 h-4" /> +91 9311913854
                    </a>
                </div>
            </div>
        );
    }

    // Already completed
    if (data && !data.showConsentButton) {
        const isCompleted = ['CONSENT', 'FIREQUEST', 'CALLBACK', 'COMPLETED'].includes(data.bsaStatus);
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#E8F7F1] to-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <Image src="/logo.png" alt="Quikkred" width={100} height={32} className="mx-auto mb-6" />
                    <div className={`w-20 h-20 ${isCompleted ? 'bg-[#E8F7F1]' : 'bg-amber-50'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        {isCompleted ? (
                            <CheckCircle className="w-12 h-12 text-[#25B181]" />
                        ) : (
                            <Clock className="w-12 h-12 text-amber-500" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isCompleted ? 'Bank Statement Verified' : 'Link Expired'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {isCompleted
                            ? 'Your bank statement has been successfully verified. We are processing your application.'
                            : 'This consent link has expired or is no longer valid. Please contact support for a new link.'}
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-400 text-xs">Application</p>
                                <p className="font-semibold text-gray-900">{data.applicationNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-xs">Status</p>
                                <p className={`font-semibold ${isCompleted ? 'text-[#25B181]' : 'text-amber-600'}`}>
                                    {isCompleted ? 'Verified' : 'Pending'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <a href="tel:+919311913854" className="inline-flex items-center gap-2 text-[#25B181] font-medium">
                        <Phone className="w-4 h-4" /> Need help? Call +91 9311913854
                    </a>
                </div>
            </div>
        );
    }

    // Main consent page
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E8F7F1] to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Image src="/logo.png" alt="Quikkred" width={100} height={32} className="h-8 w-auto" />
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Shield className="w-3.5 h-3.5 text-[#25B181]" />
                        <span>RBI Regulated</span>
                    </div>
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Title */}
                    <div className="bg-gradient-to-r from-[#25B181] to-[#1D9068] px-6 py-6 text-white text-center">
                        <h1 className="text-xl font-bold mb-1">Bank Statement Verification</h1>
                        <p className="text-white/80 text-sm">One last step to process your loan</p>
                    </div>

                    <div className="p-5">
                        {/* Application Details */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-5">
                            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Your Application Details</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-400 text-xs">Application ID</p>
                                        <p className="font-semibold text-gray-900">{data?.applicationNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Building2 className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-400 text-xs">Customer</p>
                                        <p className="font-semibold text-gray-900">{data?.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <IndianRupee className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-400 text-xs">Loan Amount</p>
                                        <p className="text-xl font-bold text-[#25B181]">
                                            ₹{data?.loanAmount?.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-400 text-xs">Tenure</p>
                                        <p className="font-semibold text-gray-900">{data?.tenure} {data?.tenureUnit}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What happens */}
                        <div className="mb-5">
                            <p className="text-sm font-medium text-gray-700 mb-3">What happens when you verify?</p>
                            <div className="space-y-2.5">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-[#E8F7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#25B181]">1</span>
                                    </div>
                                    <p className="text-sm text-gray-600">You&apos;ll be redirected to <strong>Finvu</strong> (RBI-licensed Account Aggregator)</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-[#E8F7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#25B181]">2</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Select your bank and approve consent to share <strong>last 3 months</strong> bank statement</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-[#E8F7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#25B181]">3</span>
                                    </div>
                                    <p className="text-sm text-gray-600">We&apos;ll automatically process your application for <strong>final approval</strong></p>
                                </div>
                            </div>
                        </div>

                        {/* Security info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5">
                            <div className="flex items-start gap-2">
                                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-800">
                                    Your data is fetched securely via <strong>RBI-regulated Account Aggregator</strong> framework.
                                    We cannot access your bank login credentials. Only transaction data is shared with your consent.
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleConsent}
                            disabled={redirecting}
                            className="w-full bg-gradient-to-r from-[#25B181] to-[#1D9068] text-white py-4 rounded-xl font-semibold text-base hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                        >
                            {redirecting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Redirecting to Finvu...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Verify Bank Statement
                                </>
                            )}
                        </button>

                        {/* Benefits */}
                        <div className="mt-5 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    2-minute process
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    No PDF upload needed
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    Bank-grade encryption
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    Instant processing
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div className="mt-5 text-center text-xs text-gray-500">
                    <p>Need help?</p>
                    <div className="flex items-center justify-center gap-4 mt-1">
                        <a href="tel:+919311913854" className="flex items-center gap-1 text-[#25B181]">
                            <Phone className="w-3.5 h-3.5" /> +91 9311913854
                        </a>
                        <a href="mailto:support@quikkred.in" className="flex items-center gap-1 text-[#25B181]">
                            <Mail className="w-3.5 h-3.5" /> support@quikkred.in
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-gray-400">
                    <p><strong>Satsai Finlease Pvt Ltd</strong> | RBI Reg: B-14.01646</p>
                </div>
            </main>
        </div>
    );
}

export default function BsaConsentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#25B181] animate-spin" />
            </div>
        }>
            <BsaConsentContent />
        </Suspense>
    );
}
