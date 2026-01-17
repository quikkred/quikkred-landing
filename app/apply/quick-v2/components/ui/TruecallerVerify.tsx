"use client"

import { toast } from "@/components/ui/toast";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuickApplyTracking } from "@/lib/hooks/useQuickApplyTracking";

const TruecallerVerify = () => {
    const [loading, setLoading] = useState(false);

    // Tracking
    const {
        trackTruecallerStarted,
        trackTruecallerSuccess,
        trackTruecallerFailed,
        trackAPIError,
    } = useQuickApplyTracking();

    const handleTruecallerLogin = async () => {
        setLoading(true);
        trackTruecallerStarted();

        const id = uuidv4();
        const partnerKey = process.env.NEXT_PUBLIC_TRUECALLER_PARTNER_KEY || "zsyH7238a78c4b043444a96c02b328d657515";

        const params = new URLSearchParams({
            type: "btmsheet",
            requestNonce: id,
            partnerKey: partnerKey,
            partnerName: process.env.NEXT_PUBLIC_TRUECALLER_APP_NAME || "test",
            lang: "en",
            privacyUrl: `${window.location.origin}/privacy-policy`,
            termsUrl: `${window.location.origin}/terms-and-conditions`,
            loginPrefix: "Continue",
            ctaPrefix: "Verify with",
            btnShape: "rounded",
            ttl: "600000",
        });

        const deepLink = `truecallersdk://truesdk/web_verify?${params.toString()}`;

        // 1. Define what happens when the user returns to the browser
        const handleReturn = async () => {
            if (document.visibilityState === "visible") {
                // User is back! Trigger NextAuth sign-in
                // Note: I fixed the typo 'rquestId' to 'requestId'
                const result = await signIn("truecaller", {
                    requestId: id,
                    callbackUrl: "/apply/quick-v2",
                    redirect: true
                });

                if (result?.error) {
                    trackTruecallerFailed(result.error);
                    toast({
                        variant: "error",
                        title: "Verification Failed",
                        description: "We couldn't verify your account. Please try again."
                    });
                } else {
                    // Mobile will be available in session after redirect
                    trackTruecallerSuccess('truecaller_verified');
                }

                setLoading(false);
                // Clean up the listener so it doesn't run again
                document.removeEventListener("visibilitychange", handleReturn);
            }
        };

        // 2. Start listening for the user's return
        document.addEventListener("visibilitychange", handleReturn);

        // 3. Open Truecaller
        window.location.href = deepLink;

        // 4. Fallback: If the app doesn't open within 2 seconds (e.g., Desktop or App not installed)
        setTimeout(() => {
            if (document.hasFocus()) {
                setLoading(false);
                document.removeEventListener("visibilitychange", handleReturn);
                const errorMsg = "Truecaller app not detected";
                trackTruecallerFailed(errorMsg);
                toast({
                    variant: "error",
                    title: "App Not Detected",
                    description: "Truecaller is not installed or not responding. Please use OTP login."
                });
            }
        }, 2000);
    };

    const TruecallerIcon = () => (
        <img
            src="/truecaller-logo.png"
            alt="Truecaller"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded"
        />
    );

    return (
        <button
            onClick={handleTruecallerLogin}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-white border-2 border-[#0066FF] rounded-lg font-medium text-xs sm:text-sm text-gray-800 hover:bg-[#0066FF]/5 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    <TruecallerIcon />
                    <span className="hidden xs:inline">Truecaller</span>
                </>
            )}
        </button>
    )
}

export default TruecallerVerify