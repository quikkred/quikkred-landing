"use client";

import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useSession, getSession } from "next-auth/react";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "@/components/ui/toast";
import { clearSession } from "@/lib/auth-utils";

// 1. Create the instance outside to keep it stable
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// 2. Dedupe getSession(): while the useSession() hook is still loading on a
// fresh page load, many requests hit the interceptor at once and each would
// otherwise fire its own /api/auth/session fetch. Share a single in-flight
// promise so concurrent requests reuse one network call. Cleared once it
// resolves so later token rotations can re-fetch.
let sessionPromise: ReturnType<typeof getSession> | null = null;

function getSessionDeduped() {
    if (!sessionPromise) {
        sessionPromise = getSession().finally(() => {
            sessionPromise = null;
        });
    }
    return sessionPromise;
}

export default function useAxios() {
    const { data: session } = useSession();

    useEffect(() => {
        // ✅ Request Interceptor: The "Hybrid" Token Check
        const requestIntercept = axiosClient.interceptors.request.use(
            async (config) => {
                // Ensure headers object exists
                config.headers = config.headers || {};

                // STRATEGY: Try the fast hook first
                let accessToken = (session as any)?.accessToken;

                // FALLBACK: If hook is loading (Refresh Bug Fix), fetch session manually.
                // Deduped so concurrent requests share ONE /api/auth/session call.
                if (!accessToken) {
                    const freshSession = await getSessionDeduped();
                    accessToken = (freshSession as any)?.accessToken;
                }

                // If we found a token (via hook OR fallback), attach it
                if (accessToken && !config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // ✅ Response Interceptor: Handle 401 (Auto-Logout)
        const responseIntercept = axiosClient.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const prevRequest = error.config;
                const status = error.response?.status;

                // If 401 Unauthorized
                if (status === 401) {
                    const url = prevRequest?.url || "";

                    // ✅ Prevent logout loop if login attempt itself fails with 401
                    if (url.includes("/api/auth") || url.includes("/auth/login")) {
                        return Promise.reject(error);
                    }

                    // ✅ Don't sign the user out when an application-flow endpoint
                    // (FinFactor / bank-statement BRE) errors. These hit external
                    // consent flows and can return 401 even while the session is
                    // valid — the customer should stay on the application page and
                    // the calling component handles the error (toast). See
                    // FinFactorVerify / BalanceCheckConsent.
                    if (
                        url.includes("finfactor") ||
                        url.includes("finFactor") ||
                        url.includes("/bre/")
                    ) {
                        return Promise.reject(error);
                    }

                    toast({
                        variant: "error",
                        title: "Signed out",
                        description: "Please log in again to continue.",
                    });

                    // ✅ Use central utility to ensure localStorage is also cleared
                    await clearSession('/login');
                }
                return Promise.reject(error);
            }
        );

        // 🧹 Cleanup: Remove interceptors to prevent memory leaks/duplicates
        return () => {
            axiosClient.interceptors.request.eject(requestIntercept);
            axiosClient.interceptors.response.eject(responseIntercept);
        };
    }, [session]); // Re-run if the session object updates (e.g. token rotation)

    return axiosClient;
}