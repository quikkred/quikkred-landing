"use client"

import { toast } from "@/components/ui/toast";
import { useApplication } from "@/contexts/ApplicationContext";
import useAxios from "@/hooks/useAxios";
import useStorage from "@/hooks/useStorage";
import { StorageApplicationForm } from "@/interfaces/storageInterface";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard, FileText, IndianRupee, Loader2, Mail, Phone, Shield, User } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useMemo, useState } from "react";

interface ApproveMandateProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onBack: () => void;
}

const ApproveMandate = ({
    formData,
    setFormData,
    onBack,
}: ApproveMandateProps) => {
    const [mandateLoading, setMandateLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mandateVerifying, setMandateVerifying] = useState(false);
    const router = useRouter();
    const storage = useStorage();
    const axios = useAxios();
    const { application } = useApplication();
    const upiAutopayConsent = useMemo<boolean>(() => (formData?.upiAutoPayStatus === true), [formData]);

    // Load Razorpay script for UPI Autopay
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Check UPI Autopay status after Razorpay closes (success or dismiss)
    const checkUpiAutoPayStatus = async (subscriptionId: string) => {
        try {
            const statusResponse = await axios.get(`/api/upi/upiAutopay/status/${subscriptionId}`);

            const statusResult = statusResponse.data;

            // After status API call, refresh customer data to get updated upiAutoPayStatus
            // await getCustomer();

            // Set checkbox based on status from API response
            if (statusResult.success && (statusResult.status === 'active' || statusResult.status === "authenticated")) {
                // setUpiAutopayConsent(true);
                setFormData((prev) => ({ ...prev, upiAutopayConsent: true }));
                toast({
                    variant: "success",
                    title: "UPI Autopay Authorized",
                    description: "Your UPI Autopay has been authorized successfully.",
                });
            } else {
                // Status is inactive - keep checkbox unchecked
                // setUpiAutopayConsent(false);
                toast({
                    variant: "info",
                    title: "UPI Autopay Pending",
                    description: "Please complete the UPI Autopay authorization.",
                });
            }
        } catch (error) {
            console.error("Error checking UPI AutoPay status:", error);
            // On error, keep checkbox unchecked
            // setUpiAutopayConsent(false);
            // Try to refresh customer data anyway
            try {
                // await getCustomer();
            } catch (e) {
                console.error("Error refreshing customer data:", e);
            }
        }
    };

    const handleUpiAutopayClick = async (checked: boolean) => {
        // If already authorized (upiAutoPayStatus true or upiAutopayConsent true), don't allow changes
        if (upiAutopayConsent) {
            return; // Don't allow uncheck once authorized
        }

        if (!checked) {
            // setUpiAutopayConsent(false);
            return;
        }

        // Get application ID and customer ID
        const applicationId = application?._id;
        // const customerId = reduxCustomer?.data?._id || reduxCustomer?.data?.id || approvalData?.customerId;
        const customerId = formData?.customerId;

        if (!applicationId) {
            toast({
                variant: "error",
                title: "Error",
                description: "Application ID not found. Please try again.",
            });
            return;
        }

        if (!customerId) {
            toast({
                variant: "error",
                title: "Error",
                description: "Customer ID not found. Please try again.",
            });
            return;
        }

        setMandateLoading(true);

        try {
            const response = await axios.post(`/api/upi/autoPay/create`, {
                customerId: customerId,
                applicationId: applicationId
            });

            const result = response.data;

            if (response.status === 200 || response.status === 201) {
                // Store mandate data
                // setMandateData(result);

                // Get subscriptionId from response
                const subscriptionId = result.subscriptionId;

                if (subscriptionId) {
                    // Open Razorpay checkout with subscription
                    const options = {
                        key: "rzp_live_S4tgUkVdbPaFdo",
                        subscription_id: subscriptionId,
                        name: "Quikkred",
                        description: "UPI AutoPay Mandate Approval",
                        theme: { color: "#25B181" },
                        handler: async function (razorpayResponse: any) {
                            // Payment successful - wait 10 seconds for data to update, then call status API
                            setMandateVerifying(true);
                            await new Promise(resolve => setTimeout(resolve, 10000));
                            await checkUpiAutoPayStatus(subscriptionId);
                            setMandateVerifying(false);
                            setMandateLoading(false);
                        },
                        modal: {
                            ondismiss: function () {
                                // User closed the modal without completing
                                setMandateLoading(false);
                                // setUpiAutopayConsent(false);
                            }
                        }
                    };

                    const rzp = new (window as any).Razorpay(options);
                    rzp.on('payment.failed', function (razorpayResponse: any) {
                        console.error('Payment failed:', razorpayResponse.error);
                        toast({
                            variant: "error",
                            title: "Payment Failed",
                            description: razorpayResponse.error?.description || "UPI Autopay setup failed. Please try again.",
                        });
                        setMandateLoading(false);
                        // setUpiAutopayConsent(false);
                    });
                    rzp.open();
                } else {
                    toast({
                        variant: "error",
                        title: "Failed",
                        description: "Subscription ID not received. Please try again.",
                    });
                    // setUpiAutopayConsent(false);
                    setMandateLoading(false);
                }
            } else {
                toast({
                    variant: "error",
                    title: "Failed",
                    description: result.message || "Failed to setup UPI Autopay. Please try again.",
                });
                // setUpiAutopayConsent(false);
                setMandateLoading(false);
            }
        } catch (error: any) {
            console.error('UPI Autopay error:', error);
            toast({
                variant: "error",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
            // setUpiAutopayConsent(false);
            setMandateLoading(false);
        }
    };

    const handleSubmit = async () => {
        // Step 4: Approval - Final submission
        // Final step - submit application (bank details already saved in step 3)
        setLoading(true);

        try {
            // Step 4 Final Submit - submit the application with user's selected loan amount
            const payload = {
                isSubmit: true,
            };

            const response = await axios.post(`/api/application/loan/create`, payload);

            const result = response.data;

            // Check if API call was successful
            if (response.status === 200 || response.status === 201) {
                // Store IDs from response
                if (result.data) {
                    if (result.data.customerId) localStorage.setItem('userId', result.data.customerId);
                    if (result.data._id) localStorage.setItem('applicationId', result.data._id);
                    if (result.data.loanNumber) localStorage.setItem('loanNumber', result.data.loanNumber);
                }

                // Show success toast
                toast({
                    variant: "success",
                    title: "Application Submitted",
                    description: "Your loan application has been submitted successfully.",
                });

                // Store data for application-status page
                // localStorage.setItem('applicationStatusData', JSON.stringify({
                //   status: 'approved',
                //   loanNumber: result.data?.applicationNumber || result.data?.loanNumber || approvalData?.applicationNumber || '',
                //   amount: calculatedLoanDetails?.loanAmount|| ''
                // }));
                storage.set("applicationStatusData", {
                    status: 'approved',
                    customerId: result.data?.customerId || '',
                    applicationId: result.data?.applicationId || '',
                    loanNumber: result.data?.applicationNumber || result.data?.loanNumber || '',
                    amount: formData?.loanAmount || ''
                })

                // Redirect to congratulations page
                router.push('/application-status');
                return;
            } else {
                // API returned error - show error and stay on step 4
                console.error('❌ Loan application failed:', result.message);
                toast({
                    variant: "error",
                    title: "Application Failed",
                    description: result.message || "Failed to submit loan application. Please try again.",
                });
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                // Show error toast and stay on step 4
                console.error('Error submitting loan application:', error.response?.data);
                toast({
                    variant: "error",
                    title: "Submission Error",
                    description: error.response?.data?.message || "Network error occurred. Please check your connection and try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <div>
                        <h3 className="font-semibold text-blue-800">Review Your Loan Details</h3>
                        <p className="text-sm text-blue-600">Please review the details below and click &quot;Submit Application&quot; to proceed.</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-[#25B181]" />
                    Loan Details
                    {formData && (
                        <span className="text-xs font-normal text-gray-500 ml-2">(Based on your selected amount)</span>
                    )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Your Loan Amount</p>
                        <p className="text-xl font-bold text-[#25B181]">
                            ₹{(formData?.loanAmount || 0).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Tenure</p>
                        <p className="text-xl font-bold text-gray-900">
                            {formData?.tenure || 0} {(formData?.tenureUnit) === 'Days' ? 'Days' : 'Months'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                        <p className="text-xl font-bold text-gray-900">{(formData?.interestRate) || 0}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Interest Amount</p>
                        <p className="text-xl font-bold text-gray-900">₹{((formData?.totalInterest) || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Processing Fee</p>
                        <p className="text-xl font-bold text-gray-900">₹{((formData?.processingFee) || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">GST on Processing Fee</p>
                        <p className="text-xl font-bold text-gray-900">₹{((formData?.gstOnProcessingFee) || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Total Repayment</p>
                        <p className="text-xl font-bold text-gray-900">₹{((formData?.totalRepayment) || 0).toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Net Disbursal Highlight */}
                <div className="mt-4 bg-green-50 border-2 border-green-500 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-green-600 font-medium">You Will Receive</p>
                            <p className="text-xs text-green-500">Net Disbursal Amount</p>
                        </div>
                        <p className="text-2xl font-bold text-green-600">₹{((formData?.netDisbursalAmount) || 0).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#25B181]" />
                    Your Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <User className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 w-full">
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900 break-words">
                                {formData.fullName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 w-full">
                            <p className="text-xs text-gray-500">Mobile</p>
                            <p className="font-medium text-gray-900 break-words">
                                {formData.mobile}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 w-full">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-900 break-all">
                                {formData.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <CreditCard className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 w-full">
                            <p className="text-xs text-gray-500">PAN</p>
                            <p className="font-medium text-gray-900 break-words">
                                {formData.pan}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 w-full">
                            <p className="text-xs text-gray-500">Aadhaar</p>
                            <p className="font-medium text-gray-900">
                                {formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                        <IndianRupee className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 w-full">
                            <p className="text-xs text-gray-500">Monthly Income</p>
                            <p className="font-medium text-gray-900">
                                ₹{(parseFloat(formData.monthlyIncome) || 0).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <div className={`mt-6 rounded-xl p-5 ${(upiAutopayConsent) ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'}`}>
                {/* Success UI when UPI Autopay is authorized */}
                {upiAutopayConsent ? (
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-green-800 text-lg">UPI Autopay Authorized</span>
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm text-green-700">
                                Your UPI Autopay has been set up successfully. EMI will be automatically debited on the due date.
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-green-600">
                                <span className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    RBI Compliant
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Secure & Active
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                                {mandateLoading ? (
                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <input
                                        type="checkbox"
                                        id="upiAutopayConsent"
                                        checked={upiAutopayConsent}
                                        onChange={(e) => handleUpiAutopayClick(e.target.checked)}
                                        disabled={mandateLoading}
                                        className="w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 cursor-pointer"
                                    />
                                )}
                            </div>
                            <label htmlFor="upiAutopayConsent" className="cursor-pointer">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="font-semibold text-gray-900">UPI Autopay Authorization</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    I authorize Quikkred to set up UPI Autopay for automatic EMI deductions from my registered bank account.
                                    I understand that EMI amounts will be automatically debited on the due date as per the loan repayment schedule.
                                </p>
                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        RBI Compliant
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Secure Transaction
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Cancel Anytime
                                    </span>
                                </div>
                            </label>
                        </div>
                        {mandateLoading && !mandateVerifying && (
                            <p className="mt-3 text-xs text-blue-600 flex items-center gap-1">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                Setting up UPI Autopay...
                            </p>
                        )}
                        {mandateVerifying && (
                            <p className="mt-3 text-xs text-green-600 flex items-center gap-1">
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                Verifying UPI Autopay status, please wait...
                            </p>
                        )}
                        {!upiAutopayConsent && !mandateLoading && (
                            <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Please click to authorize UPI Autopay to proceed with your application
                            </p>
                        )}
                    </>
                )}
            </div>


            <button
                onClick={handleSubmit}
                // disabled={loading || !upiAutopayConsent}
                className="w-full py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg font-semibold text-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Submitting...</span>
                    </>
                ) : (
                    <>
                        <span>Submit Application</span>
                    </>
                )}
            </button>
        </motion.div>
    )
}

export default ApproveMandate;