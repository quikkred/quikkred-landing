"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import useAxios from "@/hooks/useAxios";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function DigiLockerCallbackPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Completing DigiLocker verification...");

    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const { toast } = useToast();
    const axios = useAxios();

    useEffect(() => {
        const completeVerification = async () => {
            try {
                // Get clientId from URL params or localStorage
                const clientIdFromUrl = searchParams.get('client_id') || searchParams.get('state');
                const clientIdFromStorage = localStorage.getItem('digilocker_client_id');
                const clientId = clientIdFromUrl || clientIdFromStorage;

                if (!clientId) {
                    setStatus("error");
                    setMessage("Invalid callback. Please try signing in again.");
                    return;
                }

                // Get stored callback URL
                const callbackUrl = localStorage.getItem('digilocker_callback_url') || '/user';

                // First check status
                setMessage("Verifying with DigiLocker...");
                const statusResponse = await axios.get(`/api/auth/customer/digilocker/status?clientId=${clientId}`);

                if (!statusResponse.data?.data?.isCompleted) {
                    // Not completed yet - might need to wait
                    setMessage("Waiting for DigiLocker verification to complete...");

                    // Poll for a bit
                    let attempts = 0;
                    const maxAttempts = 15;

                    while (attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const pollResponse = await axios.get(`/api/auth/customer/digilocker/status?clientId=${clientId}`);

                        if (pollResponse.data?.data?.isCompleted) {
                            break;
                        }

                        if (pollResponse.data?.data?.status === "FAILED" ||
                            pollResponse.data?.data?.status === "EXPIRED") {
                            throw new Error("DigiLocker verification failed or expired");
                        }

                        attempts++;
                    }

                    if (attempts >= maxAttempts) {
                        throw new Error("Verification timed out. Please try again.");
                    }
                }

                // Complete the login
                setMessage("Creating your account...");
                const completeResponse = await axios.post('/api/auth/customer/digilocker/complete', {
                    clientId
                });

                if (!completeResponse.data?.success) {
                    throw new Error(completeResponse.data?.message || "Failed to complete sign-in");
                }

                const userData = completeResponse.data.data;

                // Clear stored data
                localStorage.removeItem('digilocker_client_id');
                localStorage.removeItem('digilocker_callback_url');

                // Login
                await login({
                    apiData: {
                        accessToken: userData.accessToken,
                        refreshToken: userData.refreshToken,
                        userId: userData.userId,
                        role: "CUSTOMER"
                    },
                    mobile: userData.mobile || ""
                });

                setStatus("success");
                setMessage(userData.isNewCustomer
                    ? "Account created successfully with verified KYC!"
                    : "Welcome back! Logged in successfully."
                );

                toast({
                    variant: "success",
                    title: userData.isNewCustomer ? "Account Created!" : "Welcome Back!",
                    description: userData.isNewCustomer
                        ? "Your account is ready with pre-verified KYC!"
                        : "Signed in via DigiLocker"
                });

                // Redirect after short delay
                setTimeout(() => {
                    router.push(callbackUrl);
                }, 2000);

            } catch (error: any) {
                console.error("DigiLocker callback error:", error);
                setStatus("error");
                setMessage(error.response?.data?.message || error.message || "Verification failed. Please try again.");

                // Clear stored data on error
                localStorage.removeItem('digilocker_client_id');
                localStorage.removeItem('digilocker_callback_url');
            }
        };

        completeVerification();
    }, [searchParams, axios, login, router, toast]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* DigiLocker Branding */}
                <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${status === "loading" ? "bg-blue-100" :
                            status === "success" ? "bg-green-100" :
                                "bg-red-100"
                        }`}>
                        {status === "loading" && (
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        )}
                        {status === "success" && (
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        )}
                        {status === "error" && (
                            <XCircle className="w-10 h-10 text-red-600" />
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {status === "loading" && "Completing Verification"}
                        {status === "success" && "Verification Complete!"}
                        {status === "error" && "Verification Failed"}
                    </h1>

                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Progress or Status */}
                {status === "loading" && (
                    <div className="space-y-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Shield className="w-4 h-4" />
                            <span>Securely verifying with DigiLocker</span>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                                Your KYC documents have been verified automatically.
                                Redirecting to your dashboard...
                            </p>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full py-3 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                        >
                            Go to Home
                        </button>
                    </div>
                )}

                {/* Security Notice */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Shield className="w-3 h-3" />
                        <span>Powered by DigiLocker - Government of India</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
