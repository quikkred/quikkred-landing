"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "../ui/toast";
import { useAuth } from "@/contexts/AuthContext";

export default function TruecallerAuth() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { login } = useAuth();
  
  // Use a Ref to track the polling interval to prevent memory leaks
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Sync NextAuth session with your custom Context
  useEffect(() => {
    if (session && loading) {
      // Pass the session to your custom login handler
      login("", "", session, false);
      setLoading(false);
    }
  }, [session, loading, login]);

  // 2. Cleanup polling if the user navigates away
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleTruecallerLogin = async () => {
    if (loading) return;
    setLoading(true);

    const id = uuidv4();
    const partnerKey = process.env.NEXT_PUBLIC_TRUECALLER_PARTNER_KEY || "tBoZJ5a56cdf619e24cac849d3a431e026499";

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

    // 3. Trigger Truecaller Deep Link
    window.location.href = deepLink;

    // 4. Start Polling Logic (More reliable than visibilitychange)
    let attempts = 0;
    const maxAttempts = 15; // Total wait time ~22 seconds

    pollRef.current = setInterval(async () => {
      attempts++;

      try {
        // We poll the local proxy to check if the profile arrived
        const res = await fetch(`/api/truecaller?requestId=${id}`, { cache: "no-store" });
        const json = await res.json().catch(() => null);

        if (json?.status === "VERIFIED") {
          if (pollRef.current) clearInterval(pollRef.current);

          // 5. Trigger NextAuth sign-in
          const result = await signIn("truecaller", {
            requestId: id,
            callbackUrl: "/apply/quick",
            redirect: false, // Handled by useEffect above
          });

          if (result?.error) {
            toast({
              variant: "error",
              title: "Verification Failed",
              description: result.error || "Please try again."
            });
            setLoading(false);
          }
        }

        // Handle Timeout
        if (attempts >= maxAttempts) {
          if (pollRef.current) clearInterval(pollRef.current);
          setLoading(false);
          toast({
            variant: "error",
            title: "Timeout",
            description: "Verification took too long. Please use OTP login."
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1500);
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
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 
        text-sm font-medium text-gray-800 shadow-sm transition-all 
        hover:bg-gray-50 hover:shadow-md 
        focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 
        active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Verifying...</span>
        </div>
      ) : (
        <>
          <TruecallerIcon />
          <span>Continue with Truecaller</span>
        </>
      )}
    </button>
  );
}