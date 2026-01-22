"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { signIn, useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";

const TruecallerVerify = ({
    callbackURL = "/user",
    buttonText = "Truecaller"
}: {
    callbackURL?: string;
    buttonText?: string;
}) => {
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const { login } = useAuth();
    const pollRef = useRef<any>(null);

    // Synchronize NextAuth session with your custom AuthContext
    useEffect(() => {
        if (session && loading) {
            login({
                apiData: session
            });
            setLoading(false);
        }
    }, [session, loading, login]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    const handleTruecallerLogin = async () => {
        if (loading) return;
        setLoading(true);

        const id = uuidv4();
        const partnerKey = "tBoZJ5a56cdf619e24cac849d3a431e026499";

        const params = new URLSearchParams({
            type: "btmsheet",
            requestNonce: id,
            partnerKey: partnerKey,
            partnerName: "quikkred-alpha",
            lang: "en",
            privacyUrl: `${window.location.origin}/privacy-policy`,
            termsUrl: `${window.location.origin}/terms-and-conditions`,
            loginPrefix: "Continue",
            ctaPrefix: "Verify with",
            btnShape: "rounded",
            ttl: "600000",
        });

        window.location.href = `truecallersdk://truesdk/web_verify?${params.toString()}`;

        let attempts = 0;
        const maxAttempts = 15;

        pollRef.current = setInterval(async () => {
            attempts++;

            try {
                const res = await fetch(`/api/truecaller?requestId=${id}`, { cache: "no-store" });
                const json = await res.json().catch(() => null);

                if (json?.status === "VERIFIED") {
                    if (pollRef.current) clearInterval(pollRef.current);

                    const result = await signIn("truecaller", {
                        requestId: id,
                        callbackUrl: callbackURL,
                        redirect: true,
                    });

                    if (!result?.ok) {
                        toast({ variant: "error", title: "Login Failed", description: result?.error });
                        setLoading(false);
                    }
                    // Note: Success is handled by the useEffect watching [session]
                }

                if (attempts >= maxAttempts) {
                    if (pollRef.current) clearInterval(pollRef.current);
                    setLoading(false);
                    toast({ variant: "error", title: "Timeout", description: "Verification took too long. Please try OTP." });
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 1500);
    };

    const TruecallerIcon = () => (
        <img src="/truecaller-logo.png" alt="Truecaller" className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
    );

    return (
        <button
            onClick={handleTruecallerLogin}
            disabled={loading}
            className="flex-1 flex md:hidden items-center justify-center gap-2 py-2.5 sm:py-3 bg-white border-2 border-[#0066FF] rounded-lg font-medium text-xs sm:text-sm text-gray-800 hover:bg-[#0066FF]/5 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500">Verifying...</span>
                </div>
            ) : (
                <>
                    <TruecallerIcon />
                    <span className="hidden xs:inline">{buttonText}</span>
                </>
            )}
        </button>
    );
};

export default TruecallerVerify;