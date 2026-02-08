"use client"

import { useState, useEffect } from "react";
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

// Extend Window interface for DigiLocker SDK
declare global {
    interface Window {
        initializeSurePassDigiLocker?: (params: any) => void;
    }
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
    const [sdkLoaded, setSdkLoaded] = useState(false);

    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();
    const axios = useAxios();

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

    // Load SurePass DigiLocker SDK
    useEffect(() => {
        // Check if SDK is already loaded
        if (typeof window !== 'undefined' && window.initializeSurePassDigiLocker) {
            setSdkLoaded(true);
            return;
        }

        // Load SDK script dynamically
        const script = document.createElement('script');
        script.src = 'https://kyc-api.surepass.io/sdk/digilocker-sdk.js';
        script.async = true;
        script.onload = () => {
            console.log('[DigiLocker SDK] Loaded successfully');
            setSdkLoaded(true);
        };
        script.onerror = () => {
            console.error('[DigiLocker SDK] Failed to load');
            toast({
                variant: "error",
                title: "SDK Load Error",
                description: "Failed to load DigiLocker SDK. Please refresh and try again."
            });
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup on unmount
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [toast]);

    // DigiLocker Icon
    const DigiLockerIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 6V5C7 3.34315 8.34315 2 10 2H14C15.6569 2 17 5V6" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="13" r="2" fill="currentColor" />
            <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );

    // Initialize DigiLocker with Web SDK
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

            // Check if SDK is loaded
            if (!sdkLoaded || !window.initializeSurePassDigiLocker) {
                toast({
                    variant: "error",
                    title: "SDK Not Ready",
                    description: "DigiLocker SDK is still loading. Please try again in a moment."
                });
                setIsLoading(false);
                return;
            }

            // Get initialization params from backend (no SurePass call, just generate request_id)
            const initResponse = await axios.post('/api/auth/customer/digilocker/init-params', {
                mobile: mobile?.replace(/\D/g, ''),
                email: email?.toLowerCase()
            });

            if (!initResponse.data?.success) {
                throw new Error(initResponse.data?.message || "Failed to initialize");
            }

            const { requestId, logoUrl } = initResponse.data.data;

            console.log('[DigiLocker] Initializing Web SDK with requestId:', requestId);

            // Initialize DigiLocker Web SDK (this calls SurePass from browser)
            window.initializeSurePassDigiLocker({
                signup_flow: true,
                logo_url: logoUrl || `${window.location.origin}/logo.png`,
                skip_main_screen: false,
                mobile: mobile?.replace(/\D/g, ''),
                email: email?.toLowerCase(),
                request_id: requestId,

                // Success callback - called when user completes DigiLocker
                onSuccess: async (data: any) => {
                    console.log('[DigiLocker SDK] Success callback:', data);

                    try {
                        // Send client_id to backend for verification
                        const verifyResponse = await axios.post('/api/auth/customer/digilocker/verify', {
                            clientId: data.client_id,
                            token: data.token,
                            requestId: requestId,
                            mobile: mobile?.replace(/\D/g, ''),
                            email: email?.toLowerCase()
                        });

                        if (!verifyResponse.data?.success) {
                            throw new Error(verifyResponse.data?.message || "Verification failed");
                        }

                        const userData = verifyResponse.data.data;

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

                    } catch (verifyError: any) {
                        console.error('[DigiLocker] Verification error:', verifyError);
                        const errorMsg = verifyError.response?.data?.message || verifyError.message || "Verification failed";

                        toast({
                            variant: "error",
                            title: "Verification Failed",
                            description: errorMsg
                        });

                        onError?.(errorMsg);
                    } finally {
                        setIsLoading(false);
                    }
                },

                // Error callback
                onError: (error: any) => {
                    console.error('[DigiLocker SDK] Error callback:', error);

                    const errorMsg = error?.message || "DigiLocker verification failed";

                    toast({
                        variant: "error",
                        title: "DigiLocker Error",
                        description: errorMsg
                    });

                    onError?.(errorMsg);
                    setIsLoading(false);
                },

                // Close callback - user closed the DigiLocker window
                onClose: () => {
                    console.log('[DigiLocker SDK] User closed DigiLocker');
                    toast({
                        variant: "default",
                        title: "Cancelled",
                        description: "DigiLocker verification was cancelled"
                    });
                    setIsLoading(false);
                }
            });

        } catch (error: any) {
            console.error("[DigiLocker init error:", error);
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

    return (
        <button
            type="button"
            onClick={handleDigiLockerInit}
            disabled={isLoading || !sdkLoaded}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#1a365d] to-[#2b6cb0] border-2 border-blue-700 rounded-xl font-semibold text-sm text-white hover:from-[#2b6cb0] hover:to-[#3182ce] disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation shadow-md"
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                </>
            ) : !sdkLoaded ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading SDK...</span>
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
