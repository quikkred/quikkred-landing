"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { signIn, useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "nextjs-toploader/app";

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
    const timeoutRef = useRef<any>(null);
    const router = useRouter();

    // 1. Sync Session
    useEffect(() => {
        if (session && loading) {
            login({ apiData: session });
            setLoading(false);
        }
    }, [session, loading, login]);

    // 2. Cleanup
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleTruecallerLogin = async () => {
        if (loading) return;
        setLoading(true);

        const id = uuidv4();
        const partnerKey = process.env.NEXT_PUBLIC_TRUECALLER_PARTNER_KEY || "";

        // 1. PREPARE DEEP LINK
        const params = new URLSearchParams({
            type: "btmsheet",
            requestNonce: id,
            partnerKey: partnerKey,
            partnerName: process.env.NEXT_PUBLIC_TRUECALLER_APP_NAME || "quikkred",
            lang: "en",
            privacyUrl: typeof window !== 'undefined' ? `${window.location.origin}/privacy-policy` : "",
            termsUrl: typeof window !== 'undefined' ? `${window.location.origin}/terms-and-conditions` : "",
            loginPrefix: "Continue",
            ctaPrefix: "Verify with",
            btnShape: "rounded",
            ttl: "600000",
        });
        const deepLink = `truecallersdk://truesdk/web_verify?${params.toString()}`;

        // 2. START POLLING (IMMEDIATELY)
        // We start this NOW so it is running before the browser freezes
        let attempts = 0;
        const maxAttempts = 30; // 45 seconds max

        pollRef.current = setInterval(async () => {
            attempts++;
            try {
                // Poll your backend to see if Truecaller sent the callback
                const res = await fetch(`/api/truecaller?requestId=${id}`, { cache: "no-store" });

                // 404 is okay initially (callback hasn't arrived yet)
                if (res.status === 404) return;

                const json = await res.json().catch(() => null);

                // ... inside the polling success block ...
                if (json?.status === "VERIFIED") {
                    clearInterval(pollRef.current);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);

                    // 1. Set redirect: false so we get the result object back
                    const result = await signIn("truecaller", {
                        requestId: id,
                        callbackUrl: callbackURL,
                        redirect: false,
                    });

                    // 2. Check the result
                    if (result?.ok) {
                        // SUCCESS: Manually redirect
                        toast({ variant: "success", title: "Success", description: "Logged in successfully!" });
                        router.push(callbackURL);
                        // Or: window.location.href = callbackURL; (force reload)
                    } else {
                        // FAIL: Show error
                        setLoading(false);
                        toast({
                            variant: "error",
                            title: "Login Failed",
                            description: result?.error || "Authentication failed"
                        });
                    }
                } else if (["FAILED", "REJECTED", "ERROR"].includes(json?.status)) {
                    clearInterval(pollRef.current);
                    setLoading(false);
                    toast({ variant: "error", title: "Verification Failed", description: "User denied request." });
                }
            } catch (err) {
                console.error("Polling error:", err);
            }

            if (attempts >= maxAttempts) {
                clearInterval(pollRef.current);
                if (loading) {
                    setLoading(false);
                    toast({ variant: "error", title: "Timeout", description: "Verification timed out." });
                }
            }
        }, 1500);

        // 3. SET "APP NOT INSTALLED" TIMEOUT
        const startTimestamp = Date.now();
        timeoutRef.current = setTimeout(() => {
            // If document is focused after 2.5s, app probably didn't open
            if (document.hasFocus() && (Date.now() - startTimestamp < 3500)) {
                setLoading(false);
                if (pollRef.current) clearInterval(pollRef.current);
                toast({
                    variant: "error",
                    title: "Truecaller Not Found",
                    description: "Truecaller app not installed or blocked."
                });
            }
        }, 2500);

        // 4. TRIGGER THE DEEP LINK (DELAYED SLIGHTLY)
        // Small delay ensures the intervals above are registered in the event loop
        setTimeout(() => {
            window.location.href = deepLink;
        }, 100);
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
                    <span className="text-xs text-gray-500">Waiting for App...</span>
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