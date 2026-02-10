"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/toast";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

type VerificationStatus =
    | "POLLING"         // 1. Waiting for Truecaller App
    | "VERIFYING_JWT"   // 2. App approved, exchanging token with NextAuth
    | "SESSION_SYNC"    // 3. Token exchanged, waiting for Session
    | "COMPLETED"       // 4. All done, redirecting
    | "FAILED";         // X. Error state

export default function VerifyTruecaller() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const { data: session, status: sessionStatus } = useSession();

    // URL Params
    const requestId = searchParams.get("requestNonce");
    const callbackURL = searchParams.get("callback") || "/user";

    // State
    const [status, setStatus] = useState<VerificationStatus>("POLLING");
    const [errorMessage, setErrorMessage] = useState("");

    // Refs for concurrency control
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const processingRef = useRef(false); // Prevents double-execution

    // Helper to stop polling
    const stopPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    // ---------------------------------------------------------
    // 1. POLLING PHASE
    // ---------------------------------------------------------
    useEffect(() => {
        if (!requestId) {
            setStatus("FAILED");
            setErrorMessage("Missing Request ID.");
            return;
        }

        // Only run if we are in POLLING state
        if (status !== "POLLING") return;

        let attempts = 0;
        const maxAttempts = 40; // ~60 seconds

        pollRef.current = setInterval(async () => {
            attempts++;
            try {
                // Check status from your backend
                const res = await fetch(`/api/truecaller?requestId=${requestId}`, { cache: "no-store" });

                if (res.status === 404) {
                    if (attempts >= maxAttempts) throw new Error("Timeout");
                    return; // Keep waiting
                }

                const json = await res.json().catch(() => null);

                // A. SUCCESS DETECTED
                if (json?.status === "VERIFIED") {
                    stopPolling();
                    setStatus("VERIFYING_JWT"); // Move to next step
                }
                // B. FAILURE DETECTED
                else if (["FAILED", "REJECTED", "ERROR"].includes(json?.status)) {
                    stopPolling();
                    setStatus("FAILED");
                    setErrorMessage("Request denied by user.");
                }

            } catch (error: any) {
                if (error.message === "Timeout" || attempts >= maxAttempts) {
                    stopPolling();
                    setStatus("FAILED");
                    setErrorMessage("Verification timed out.");
                }
            }
        }, 1500);

        return () => stopPolling();
    }, [requestId, status, stopPolling]);


    // ---------------------------------------------------------
    // 2. VERIFICATION PHASE (NextAuth SignIn)
    // ---------------------------------------------------------
    useEffect(() => {
        const performSignIn = async () => {
            if (status !== "VERIFYING_JWT" || processingRef.current) return;
            processingRef.current = true; // Lock

            try {
                const result = await signIn("truecaller", {
                    requestId: requestId,
                    callbackUrl: callbackURL,
                    redirect: false,
                });

                if (result?.ok) {
                    setStatus("SESSION_SYNC"); // Move to next step
                } else {
                    setStatus("FAILED");
                    setErrorMessage(result?.error || "Login failed.");
                }
            } catch (err) {
                setStatus("FAILED");
                setErrorMessage("Authentication error.");
            } finally {
                processingRef.current = false; // Unlock (though state change usually prevents re-entry)
            }
        };

        performSignIn();
    }, [status, requestId, callbackURL]);


    // ---------------------------------------------------------
    // 3. SYNC & REDIRECT PHASE
    // ---------------------------------------------------------
    useEffect(() => {
        if (status === "SESSION_SYNC" && sessionStatus === "authenticated" && session) {
            // Move to final state to prevent re-renders
            setStatus("COMPLETED");

            // 1. Sync with your custom Auth Context
            login({ apiData: session });

            // 2. Show Success
            toast({ variant: "success", title: "Success", description: "Logged in successfully!" });

            // 3. Redirect (Hard redirect is safer for Auth)
            setTimeout(() => {
                window.location.href = callbackURL;
            }, 1000);
        }
    }, [status, sessionStatus, session, login, callbackURL]);


    // ---------------------------------------------------------
    // UI RENDER
    // ---------------------------------------------------------
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">

                {/* Header Text */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Truecaller Login</h1>
                    <p className="text-sm text-gray-500">
                        {status === "POLLING" && "Check your phone to verify..."}
                        {(status === "VERIFYING_JWT" || status === "SESSION_SYNC") && "Finalizing secure login..."}
                        {status === "COMPLETED" && "Success! Redirecting..."}
                        {status === "FAILED" && "Verification Failed"}
                    </p>
                </div>

                {/* Visual Status */}
                <div className="flex flex-col items-center justify-center py-6 min-h-[140px]">
                    {/* LOADING STATES */}
                    {["POLLING", "VERIFYING_JWT", "SESSION_SYNC"].includes(status) && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-white p-4 rounded-full border-4 border-blue-500">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            </div>
                        </div>
                    )}

                    {/* SUCCESS STATE */}
                    {status === "COMPLETED" && (
                        <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                    )}

                    {/* FAILED STATE */}
                    {status === "FAILED" && (
                        <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <XCircle className="h-10 w-10 text-red-600" />
                            </div>
                            <p className="text-red-600 font-medium">{errorMessage}</p>
                            <button
                                onClick={() => router.push("/login")} // Or wherever you want them to go back to
                                className="mt-6 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Return to Login
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Help */}
                {status === "POLLING" && (
                    <p className="text-xs text-gray-400">
                        App didn't open? <button onClick={() => window.location.reload()} className="underline hover:text-blue-600">Click here to retry</button>
                    </p>
                )}
            </div>
        </div>
    );
}