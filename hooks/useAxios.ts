"use client";

import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useSession, signOut } from "next-auth/react";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "@/components/ui/toast";

// Create the axios instance outside the component to preserve the object identity
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
});

export default function useAxios() {
    const { data: session } = useSession();

    useEffect(() => {
        // ✅ Request Interceptor: Attach Token
        const requestIntercept = axiosClient.interceptors.request.use(
            (config) => {
                // Ensure header exists before assigning
                config.headers = config.headers || {};

                // Use the token from the current session hook (much faster than getSession)
                const accessToken = (session as any)?.accessToken;

                if (accessToken && !config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // ✅ Response Interceptor: Handle 401 Logout
        const responseIntercept = axiosClient.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const prevRequest = error.config;
                const status = error.response?.status;

                // If 401 Unauthorized
                if (status === 401) {
                    // Avoid loop: Check if this request is NOT meant for the auth endpoint itself
                    // (Prevents crashing if the logout call itself fails)
                    if (prevRequest && !prevRequest.url?.includes("/api/auth")) {
                        toast({
                            variant: "error",
                            title: "Signed out",
                            description: "Please log in again to continue.",
                        });
                        await signOut({ redirect: true, callbackUrl: "/login" });
                    }
                }

                return Promise.reject(error);
            }
        );

        // 🧹 Cleanup: Remove interceptors when session changes or component unmounts
        // This prevents "interceptorsAttached" duplicates without needing global flags
        return () => {
            axiosClient.interceptors.request.eject(requestIntercept);
            axiosClient.interceptors.response.eject(responseIntercept);
        };
    }, [session]); // Re-run this effect only when session updates

    return axiosClient;
}