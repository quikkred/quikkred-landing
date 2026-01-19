"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "../ui/toast";

export default function TruecallerAuth() {
  const [loading, setLoading] = useState(false);

  const handleTruecallerLogin = async () => {
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

    const deepLink = `truecallersdk://truesdk/web_verify?${params.toString()}`;

    // 1. Define what happens when the user returns to the browser
    const handleReturn = async () => {
      if (document.visibilityState === "visible") {
        // User is back! Trigger NextAuth sign-in
        // Note: I fixed the typo 'rquestId' to 'requestId'
        const result = await signIn("truecaller", {
          requestId: id,
          callbackUrl: "/user",
          redirect: true
        });

        if (result?.error) {
          toast({
            variant: "error",
            title: "Verification Failed",
            description: "We couldn't verify your account. Please try again."
          });
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
      className=" flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 
        text-sm font-medium text-gray-700 shadow-sm transition-all 
        hover:bg-gray-50 hover:shadow-md 
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 
        active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <TruecallerIcon />
      <span>{loading ? "Waiting for Truecaller..." : "Continue with Truecaller"}</span>
    </button>
  );
}