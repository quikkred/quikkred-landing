"use client"

import { toast } from "@/components/ui/toast";
import { useApplication } from "@/contexts/ApplicationContext";
import useAxios from "@/hooks/useAxios";
import { RAZORPAY_KEY } from "@/lib/config";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { CheckCircle, Shield } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface EMandateVerifyProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpay = () => new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    if ((window as any).Razorpay) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SRC}"]`);
    if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Razorpay load failed")), { once: true });
        return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay load failed"));
    document.body.appendChild(script);
});

const EMandateVerify = ({
    formData,
    setFormData,
}: EMandateVerifyProps) => {
    const [mandateLoading, setMandateLoading] = useState(false);
    const [mandateVerifying, setMandateVerifying] = useState(false);
    // const router = useRouter();
    // const storage = useStorage();
    const { application, getCustomer } = useApplication();
    const axios = useAxios();
    const upiAutopayConsent = useMemo<boolean>(() => (formData?.upiAutoPayStatus === true), [formData]);

    // Check UPI Autopay status via emandate checkout API.
    // `silent` skips toasts — used for the on-mount/refresh check so we don't
    // notify the user on every page load.
    const checkUpiAutoPayStatus = async (silent = false) => {
        const customerId = application?.customerId;
        if (!customerId) {
            console.error("Customer ID not available for emandate checkout");
            return;
        }

        try {
            const statusResponse = await axios.get(`/api/upi/emandate/checkout/${customerId}`);
            const result = statusResponse.data;

            // Refresh customer data to get updated upiAutoPayStatus
            await getCustomer();

            // Check isAuthorized from the checkout API response
            if (result.success && result.isAuthorized) {
                setFormData((prev) => ({ ...prev, upiAutoPayStatus: true }));
                if (!silent) {
                    toast({
                        variant: "success",
                        title: "UPI Autopay Authorized",
                        description: "Your UPI Autopay has been authorized successfully.",
                    });
                }
            } else if (!silent) {
                toast({
                    variant: "info",
                    title: "UPI Autopay Pending",
                    description: "Please complete the UPI Autopay authorization.",
                });
            }
        } catch (error) {
            console.error("Error checking E-Mandate status:", error);
            try {
                await getCustomer();
            } catch (e) {
                console.error("Error refreshing customer data:", e);
            }
        }
    };

    // On mount/refresh: silently pull the live authorization status from
    // /api/upi/emandate/checkout/{customerId} so the authorized UI shows after a
    // refresh instead of relying only on /api/customer/get's upiAutoPayStatus.
    const statusCheckedRef = useRef(false);
    useEffect(() => {
        if (statusCheckedRef.current) return;
        if (application?.customerId && !upiAutopayConsent) {
            statusCheckedRef.current = true;
            checkUpiAutoPayStatus(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [application?.customerId, upiAutopayConsent]);

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
        // const customerId = formData?.customerId;
        const customerId = application?.customerId;

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
                    // Ensure Razorpay SDK is loaded before constructing
                    await loadRazorpay();

                    // Open Razorpay checkout with subscription
                    const options = {
                        // key: "rzp_test_RudM9P8MHGIuf2",
                        key: RAZORPAY_KEY,
                        subscription_id: subscriptionId,
                        name: "Quikkred",
                        description: "UPI AutoPay Mandate Approval",
                        theme: { color: "#25B181" },
                        handler: async function (razorpayResponse: any) {
                            // Payment successful - wait 10 seconds for data to update, then call status API
                            setMandateVerifying(true);
                            await new Promise(resolve => setTimeout(resolve, 10000));
                            await checkUpiAutoPayStatus();
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

    return (
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
    )
}

export default EMandateVerify