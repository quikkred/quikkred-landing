'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, CheckCircle, AlertCircle, Loader2, Phone, Mail, CreditCard, Smartphone, Building2 } from 'lucide-react';
import Image from 'next/image';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alpha.quikkred.in';

// Quikkred Brand Colors
const BRAND = {
    primary: '#25B181',      // Quikkred Green
    primaryDark: '#1D9068',  // Darker green for hover
    primaryLight: '#E8F7F1', // Light green background
    gradient: 'from-[#25B181] to-[#1D9068]',
};

function AuthorizeMandateContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mandateData, setMandateData] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<'upi' | 'emandate'>('upi');
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [orderMandateId, setOrderMandateId] = useState<string | null>(null);

    const token = searchParams.get('token');
    const applicationId = searchParams.get('applicationId');

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        // Fetch mandate data
        if (token || applicationId) {
            fetchMandateData();
        } else {
            setLoading(false);
            setError('Invalid link. Missing token or loan ID.');
        }

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [token, applicationId]);

    const fetchMandateData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (token) params.append('token', token);
            if (applicationId) params.append('applicationId', applicationId);

            // const response = await fetch(`${API_URL}/api/mandate-checkout/details?${params}`);
            const response = await fetch(`${API_URL}/api/v2/mandate/details?${params}`);
            const data = await response.json();

            if (data.success) {
                setMandateData(data.data);
            } else {
                setError(data.message || 'Failed to load mandate details');
            }
        } catch (err: any) {
            setError('Failed to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const initiatePayment = async () => {
        if (!mandateData || !razorpayLoaded) return;

        try {
            setProcessing(true);
            setError(null);
            // Create order
            // const response = await fetch(`${API_URL}/api/mandate-checkout/create-order`, {
            const response = await fetch(`${API_URL}/api/v2/mandate/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId: mandateData.applicationId,
                    method: selectedMethod
                })
            });

            const orderData = await response.json();

            if (!orderData.success) {
                throw new Error(orderData.message || 'Failed to create order');
            }
            const mandateId = orderData?.data?.mandateId;
            setOrderMandateId(mandateId)

            // Razorpay Checkout options
            const options: any = {
                key: mandateData.keyId,
                order_id: orderData.data.orderId,
                customer_id: orderData.data.customerId,
                name: 'Quikkred',
                description: `Loan Repayment Authorization - ${mandateData.loanNumber}`,
                image: 'https://quikkred.in/logo.png',
                prefill: {
                    name: mandateData.customerName,
                    email: mandateData.customerEmail,
                    contact: mandateData.customerMobile
                },
                theme: {
                    color: BRAND.primary, // Quikkred Green
                    backdrop_color: 'rgba(0,0,0,0.7)'
                },
                handler: async function (response: any) {
                    await verifyPayment(response, mandateId);
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    },
                    confirm_close: true
                }
            };

            // Method specific options
            if (selectedMethod === 'upi') {
                options.config = {
                    display: {
                        blocks: {
                            upi: {
                                name: 'UPI Autopay',
                                instruments: [
                                    { method: 'upi', flows: ['collect', 'qr'] }
                                ]
                            }
                        },
                        sequence: ['block.upi'],
                        preferences: { show_default_blocks: false }
                    }
                };
            } else {
                options.config = {
                    display: {
                        blocks: {
                            emandate: {
                                name: 'eMandate / NACH',
                                instruments: [
                                    { method: 'emandate' }
                                ]
                            }
                        },
                        sequence: ['block.emandate'],
                        preferences: { show_default_blocks: false }
                    }
                };

                if (mandateData.bankAccount) {
                    options.prefill.bank_account = {
                        account_number: mandateData.bankAccount.accountNumber,
                        ifsc: mandateData.bankAccount.ifscCode,
                        beneficiary_name: mandateData.bankAccount.beneficiaryName
                    };
                }
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setError(response.error.description || 'Payment failed');
                setProcessing(false);
            });
            rzp.open();

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setProcessing(false);
        }
    };

    const verifyPayment = async (response: any, mandateId: string) => {
        try {
            console.log(mandateId, "data")

            const verifyResponse = await fetch(`${API_URL}/api/mandate-checkout/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    mandateId: mandateId,
                    method: selectedMethod
                })
            });

            const data = await verifyResponse.json();
            console.log("jbdcjdbcjhbdjh",data)

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            console.log(err,"error")
            setError('Payment verification failed. Please contact support.');
        } finally {
            setProcessing(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Image src="/logo.png" alt="Quikkred" width={120} height={40} className="mx-auto mb-4" />
                    <Loader2 className="w-10 h-10 text-[#25B181] animate-spin mx-auto" />
                    <p className="mt-3 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error && !mandateData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <Image src="/logo.png" alt="Quikkred" width={100} height={32} className="mx-auto mb-6" />
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a href="tel:+919311913854" className="inline-flex items-center gap-2 text-[#25B181] font-medium">
                        <Phone className="w-4 h-4" /> +91 9311913854
                    </a>
                </div>
            </div>
        );
    }

    // Success State
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#E8F7F1] to-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <Image src="/logo.png" alt="Quikkred" width={100} height={32} className="mx-auto mb-6" />
                    <div className="w-20 h-20 bg-[#E8F7F1] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-[#25B181]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Auto-Debit Authorized!</h2>
                    <p className="text-gray-600 mb-6">
                        Your {selectedMethod === 'upi' ? 'UPI Autopay' : 'eMandate'} has been set up successfully.
                    </p>
                    <div className="bg-[#E8F7F1] rounded-xl p-4 mb-6 text-left">
                        <p className="text-[#1D9068] text-sm">
                            <strong>Loan:</strong> {mandateData?.loanNumber}<br />
                            <strong>Amount:</strong> ₹{mandateData?.amount?.toLocaleString('en-IN')}<br />
                            <strong>Method:</strong> {selectedMethod === 'upi' ? 'UPI Autopay' : 'Bank eMandate'}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Your loan repayment will be automatically debited on the due date.
                    </p>
                    <a href="https://quikkred.in" className="inline-block bg-[#25B181] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1D9068] transition">
                        Done
                    </a>
                </div>
            </div>
        );
    }

    // Main Checkout UI
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E8F7F1] to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Image src="/logo.png" alt="Quikkred" width={100} height={32} className="h-8 w-auto" />
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Shield className="w-3.5 h-3.5 text-[#25B181]" />
                        <span>Secure</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-lg mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Title Section */}
                    <div className="bg-gradient-to-r from-[#25B181] to-[#1D9068] px-6 py-6 text-white text-center">
                        <h1 className="text-xl font-bold mb-1">Set Up Auto-Debit</h1>
                        <p className="text-white/80 text-sm">Authorize automatic loan repayment</p>
                    </div>

                    <div className="p-5">
                        {/* Error Banner */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Loan Details */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-5">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs">Application Number</p>
                                    <p className="font-semibold text-gray-900">{mandateData?.applicationNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs">Customer</p>
                                    <p className="font-semibold text-gray-900">{mandateData?.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">Repayment Amount</p>
                                    <p className="text-xl font-bold text-[#25B181]">
                                        ₹{mandateData?.amount?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs">Due Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {mandateData?.dueDate
                                            ? new Date(mandateData.dueDate).toLocaleDateString('en-IN')
                                            : 'As scheduled'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-5">
                            <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setSelectedMethod('upi')}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                        selectedMethod === 'upi'
                                            ? 'border-[#25B181] bg-[#E8F7F1]'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <Smartphone className={`w-7 h-7 mx-auto mb-2 ${
                                        selectedMethod === 'upi' ? 'text-[#25B181]' : 'text-gray-400'
                                    }`} />
                                    <p className={`font-semibold text-sm ${
                                        selectedMethod === 'upi' ? 'text-[#25B181]' : 'text-gray-700'
                                    }`}>UPI Autopay</p>
                                    <p className="text-xs text-gray-500 mt-1">GPay, PhonePe, Paytm</p>
                                </button>

                                <button
                                    onClick={() => setSelectedMethod('emandate')}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                        selectedMethod === 'emandate'
                                            ? 'border-[#25B181] bg-[#E8F7F1]'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <Building2 className={`w-7 h-7 mx-auto mb-2 ${
                                        selectedMethod === 'emandate' ? 'text-[#25B181]' : 'text-gray-400'
                                    }`} />
                                    <p className={`font-semibold text-sm ${
                                        selectedMethod === 'emandate' ? 'text-[#25B181]' : 'text-gray-700'
                                    }`}>eMandate</p>
                                    <p className="text-xs text-gray-500 mt-1">Bank Auto-Debit</p>
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                            <p className="text-xs text-amber-800">
                                {selectedMethod === 'upi'
                                    ? '₹' + mandateData?.amount?.toLocaleString('en-IN') + ' will be auto-debited from your UPI account on due date.'
                                    : '₹' + mandateData?.amount?.toLocaleString('en-IN') + ' will be auto-debited from your bank account on due date.'
                                }
                            </p>
                        </div>

                        {/* Authorize Button */}
                        <button
                            onClick={initiatePayment}
                            disabled={processing || !razorpayLoaded}
                            className="w-full bg-gradient-to-r from-[#25B181] to-[#1D9068] text-white py-4 rounded-xl font-semibold text-base hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Authorize {selectedMethod === 'upi' ? 'UPI Autopay' : 'eMandate'}
                                </>
                            )}
                        </button>

                        {/* Benefits */}
                        <div className="mt-5 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    Never miss payment
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    No late fees
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    Improve credit score
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#25B181]" />
                                    Cancel anytime
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

export default function AuthorizeMandatePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#25B181] animate-spin" />
            </div>
        }>
            <AuthorizeMandateContent />
        </Suspense>
    );
}
