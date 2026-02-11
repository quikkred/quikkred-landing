"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { v4 as uuidv4 } from "uuid";
import { useQuickApplyTracking } from "@/lib/hooks/useQuickApplyTracking";
import { useRouter } from "nextjs-toploader/app";

const TruecallerVerify = ({
    callbackURL = "/user",
    buttonText = "Truecaller",
    smButtonText = "Truecaller",
}: {
    callbackURL?: string;
    buttonText?: string;
    smButtonText?: string;
    callback?: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    // Tracking
    const { trackTruecallerStarted, trackTruecallerFailed } = useQuickApplyTracking();
    const timeoutRef = useRef<any>(null);
    const router = useRouter();

    // 1. Detect Platform & Mount
    useEffect(() => {
        setIsMounted(true);
        // iOS Detection Regex
        if (typeof navigator !== "undefined") {
            const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            setIsIOS(isIOSDevice);
        }
    }, []);

    const handleTruecallerLogin = async () => {
        if (loading) return;
        setLoading(true);
        trackTruecallerStarted();

        const id = uuidv4();
        const partnerKey = process.env.NEXT_PUBLIC_TRUECALLER_PARTNER_KEY || "";

        // 2. PREPARE DEEP LINK
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

        // 3. SET "APP NOT INSTALLED" TIMEOUT (Fallback if app doesn't open)
        const startTimestamp = Date.now();
        timeoutRef.current = setTimeout(() => {
            // If document is still focused after 2.5s, app probably didn't open
            if (document.hasFocus() && (Date.now() - startTimestamp < 3500)) {
                setLoading(false);
                trackTruecallerFailed("Truecaller app not installed");
                toast({
                    variant: "error",
                    title: "Truecaller Not Found",
                    description: "Truecaller app not installed or blocked.",
                });
            }
        }, 2500);

        // 4. TRIGGER THE DEEP LINK
        window.location.href = deepLink;

        // 5. REDIRECT LOGIC
        // Wait slightly to allow the app to open. If the document loses focus (app opened),
        // we redirect the user to the /verify-truecaller page to handle the polling UI.
        setTimeout(() => {
            if (!document.hasFocus()) {
                // The user successfully left the browser to go to Truecaller app.
                // Redirect them to the verification page to see the progress.
                router.push(`/verify-truecaller?requestNonce=${id}&callback=${callbackURL}`);
            }
        }, 800);
    };

    const TruecallerIcon = () => (
        <img src="/truecaller-logo.png" alt="Truecaller" className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
    );

    // If not mounted or IS iOS, do not render the button
    if (!isMounted || isIOS) return null;

    return (
        <button
            type="button"
            onClick={handleTruecallerLogin}
            disabled={loading}
            className="flex-1 flex md:hidden items-center justify-center gap-2 py-2.5 sm:py-3 bg-white border-2 border-[#0066FF] rounded-lg font-medium text-xs sm:text-sm text-gray-800 hover:bg-[#0066FF]/5 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500">Opening App...</span>
                </div>
            ) : (
                <>
                    <TruecallerIcon />
                    <span className="hidden sm:inline-block">{buttonText}</span>
                    <span className="inline-block sm:hidden">{smButtonText}</span>
                </>
            )}
        </button>
    );
};

export default TruecallerVerify;