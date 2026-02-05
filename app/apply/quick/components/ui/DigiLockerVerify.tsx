"use client"

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { API_BASE_URL } from "@/lib/config";
import useAxios from "@/hooks/useAxios";

interface DigiLockerVerifyProps {
    callbackURL?: string;
    buttonText?: string;
    mobile?: string;
    email?: string;
    onSuccess?: (data: DigiLockerSuccessData) => void;
    onError?: (error: string) => void;
}

interface DigiLockerSuccessData {
    userId: string;
    customerUniqueId: string;
    name: string;
    email?: string;
    mobile?: string;
    accessToken: string;
    refreshToken: string;
    isNewCustomer: boolean;
    kycStatus: {
        panVerified: boolean;
        aadhaarVerified: boolean;
        mobileVerified: boolean;
        emailVerified: boolean;
        isComplete: boolean;
    };
}

const DigiLockerVerify = ({
    callbackURL = "/user",
    buttonText = "Sign in with DigiLocker",
    mobile,
    email,
    onSuccess,
    onError
}: DigiLockerVerifyProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [clientId, setClientId] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();
    const axios = useAxios();

    const MAX_POLL_ATTEMPTS = 60; // 60 attempts * 2 seconds = 2 minutes max
    const POLL_INTERVAL = 2000; // 2 seconds

    // Strict mobile number validation
    const validateMobile = (mobile: string): { valid: boolean; error?: string } => {
        const cleaned = mobile.replace(/\D/g, '');

        // Must be exactly 10 digits
        if (cleaned.length !== 10) {
            return { valid: false, error: "Mobile number must be exactly 10 digits" };
        }

        // Must start with 6, 7, 8, or 9
        if (!/^[6-9]/.test(cleaned)) {
            return { valid: false, error: "Mobile number must start with 6, 7, 8, or 9" };
        }

        // Reject common fake numbers
        const fakeNumbers = [
            '9999999999', '0000000000', '1111111111', '2222222222',
            '3333333333', '4444444444', '5555555555', '6666666666',
            '7777777777', '8888888888', '1234567890', '0123456789'
        ];

        if (fakeNumbers.includes(cleaned)) {
            return { valid: false, error: "Please provide a valid, active mobile number" };
        }

        // Check for repeating patterns (e.g., 9090909090)
        if (/^(\d{2})\1{4}$/.test(cleaned)) {
            return { valid: false, error: "Please provide a valid mobile number" };
        }

        return { valid: true };
    };

    // DigiLocker Icon
    const DigiLockerIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 6V5C7 3.34315 8.34315 2 10 2H14C15.6569 2 17 3.34315 17 5V6" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="13" r="2" fill="currentColor" />
            <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );

    // Initialize DigiLocker flow
    const handleDigiLockerInit = async () => {
        try {
            setIsLoading(true);

            // Validate input
            if (!mobile && !email) {
                toast({
                    variant: "error",
                    title: "Input Required",
                    description: "Please enter your mobile number or email first"
                });
                setIsLoading(false);
                return;
            }

            // Strict mobile validation
            if (mobile) {
                const validation = validateMobile(mobile);
                if (!validation.valid) {
                    toast({
                        variant: "error",
                        title: "Invalid Mobile Number",
                        description: validation.error || "Please enter a valid mobile number"
                    });
                    setIsLoading(false);
                    return;
                }
            }

            // Call backend to initialize DigiLocker
            const response = await axios.post('/api/auth/customer/digilocker/login', {
                mobile: mobile?.replace(/\D/g, ''),
                email: email?.toLowerCase(),
                redirectUrl: `${window.location.origin}/auth/digilocker/callback`
            });

            if (!response.data?.success || !response.data?.data?.url) {
                throw new Error(response.data?.message || "Failed to initialize DigiLocker");
            }

            const { clientId: newClientId, url } = response.data.data;
            setClientId(newClientId);

            // Store clientId in localStorage for callback page
            localStorage.setItem('digilocker_client_id', newClientId);
            localStorage.setItem('digilocker_callback_url', callbackURL);

            toast({
                variant: "success",
                title: "Redirecting to DigiLocker",
                description: "Please complete verification in the DigiLocker window"
            });

            // Open DigiLocker in new window or redirect
            const digiLockerWindow = window.open(url, '_blank', 'width=600,height=700');

            // If popup blocked, redirect in same window
            if (!digiLockerWindow || digiLockerWindow.closed) {
                window.location.href = url;
                return;
            }

            // Start polling for completion
            setIsPolling(true);
            setPollCount(0);

        } catch (error: any) {
            console.error("DigiLocker init error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to start DigiLocker verification";

            toast({
                variant: "error",
                title: "DigiLocker Error",
                description: errorMsg
            });

            onError?.(errorMsg);
            setIsLoading(false);
        }
    };

    // Poll for DigiLocker completion
    const checkDigiLockerStatus = useCallback(async () => {
        if (!clientId || !isPolling) return;

        try {
            const response = await axios.get(`/api/auth/customer/digilocker/status?clientId=${clientId}`);

            if (response.data?.data?.isCompleted) {
                // DigiLocker verification completed - now complete the sign-in
                setIsPolling(false);
                await completeDigiLockerLogin();
                return;
            }

            // Check if expired or failed
            const status = response.data?.data?.status;
            if (status === "EXPIRED" || status === "FAILED" || status === "REJECTED") {
                setIsPolling(false);
                setIsLoading(false);
                setClientId(null);

                toast({
                    variant: "error",
                    title: "Verification Failed",
                    description: status === "EXPIRED"
                        ? "DigiLocker session expired. Please try again."
                        : "DigiLocker verification was not completed. Please try again."
                });

                onError?.(status);
                return;
            }

            // Continue polling
            setPollCount(prev => prev + 1);

        } catch (error: any) {
            console.error("DigiLocker status check error:", error);

            // If 404, session expired
            if (error.response?.status === 404) {
                setIsPolling(false);
                setIsLoading(false);
                setClientId(null);

                toast({
                    variant: "error",
                    title: "Session Expired",
                    description: "DigiLocker session expired. Please try again."
                });

                onError?.("SESSION_EXPIRED");
            }
        }
    }, [clientId, isPolling, axios, toast, onError]);

    // Complete DigiLocker login
    const completeDigiLockerLogin = async () => {
        if (!clientId) return;

        try {
            const response = await axios.post('/api/auth/customer/digilocker/complete', {
                clientId
            });

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Failed to complete sign-in");
            }

            const userData = response.data.data;

            // Clear stored data
            localStorage.removeItem('digilocker_client_id');
            localStorage.removeItem('digilocker_callback_url');

            toast({
                variant: "success",
                title: userData.isNewCustomer ? "Account Created!" : "Welcome Back!",
                description: userData.isNewCustomer
                    ? "Your account has been created with verified KYC!"
                    : "Logged in successfully via DigiLocker"
            });

            // Call auth context login
            await login({
                apiData: {
                    accessToken: userData.accessToken,
                    refreshToken: userData.refreshToken,
                    userId: userData.userId,
                    role: "CUSTOMER"
                },
                mobile: userData.mobile || ""
            });

            // Call success callback
            onSuccess?.(userData);

            // Redirect
            router.push(callbackURL);

        } catch (error: any) {
            console.error("DigiLocker complete error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to complete sign-in";

            toast({
                variant: "error",
                title: "Sign-in Failed",
                description: errorMsg
            });

            onError?.(errorMsg);
        } finally {
            setIsLoading(false);
            setIsPolling(false);
            setClientId(null);
        }
    };

    // Polling effect
    useEffect(() => {
        if (!isPolling || !clientId) return;

        // Stop polling after max attempts
        if (pollCount >= MAX_POLL_ATTEMPTS) {
            setIsPolling(false);
            setIsLoading(false);
            setClientId(null);

            toast({
                variant: "error",
                title: "Timeout",
                description: "DigiLocker verification timed out. Please try again."
            });

            onError?.("TIMEOUT");
            return;
        }

        const pollTimer = setTimeout(checkDigiLockerStatus, POLL_INTERVAL);
        return () => clearTimeout(pollTimer);
    }, [isPolling, clientId, pollCount, checkDigiLockerStatus, toast, onError]);

    // Check for returning from DigiLocker callback
    useEffect(() => {
        const storedClientId = localStorage.getItem('digilocker_client_id');
        if (storedClientId && !clientId) {
            setClientId(storedClientId);
            setIsLoading(true);
            setIsPolling(true);
        }
    }, [clientId]);

    return (
        <button
            type="button"
            onClick={handleDigiLockerInit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#1a365d] to-[#2b6cb0] border-2 border-blue-700 rounded-xl font-semibold text-sm text-white hover:from-[#2b6cb0] hover:to-[#3182ce] disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation shadow-md"
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isPolling ? "Waiting for verification..." : "Connecting..."}</span>
                </>
            ) : (
                <>
                    <DigiLockerIcon />
                    <span>{buttonText}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">
                        One-click KYC
                    </span>
                </>
            )}
        </button>
    );
};

export default DigiLockerVerify;
