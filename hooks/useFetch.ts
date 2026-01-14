"use client";

import { toast } from "@/components/ui/toast"; // adjust if your path differs
import { API_BASE_URL } from "@/lib/config";
import { getSession, signOut } from "next-auth/react";
import { useState } from "react";

const isURL = (url: string): string => (url.startsWith("/") ? url : `/${url}`);

async function getToken() {
  const session = await getSession();
  const token =
    (session as any)?.accessToken ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  if (!token) {
    toast({
      variant: "error",
      title: "Failed",
      description: "No access token found. Please log in again.",
    });
    throw new Error("No access token found");
  }

  return token;
}

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const useFetch = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const loading: boolean = loadingCount > 0 ? true: false;

  const request = async <T,>(method: "GET" | "POST", url: string, body?: any): Promise<T> => {
    const token = await getToken();

    setLoadingCount((c) => c + 1);
    try {
      const res = await fetch(`${API_BASE_URL}${isURL(url)}`, {
        method,
        headers: {
          ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
          Authorization: `Bearer ${token}`,
        },
        ...(method === "POST" ? { body: JSON.stringify(body ?? {}) } : {}),
      });

      const result = await safeJson(res);

      // ✅ handle session expiry
      if (res.status === 401) {
        toast({
          variant: "error",
          title: "Session expired",
          description: "Please login again.",
        });

        // clear local storage tokens (if you still store them)
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // next-auth signout
        await signOut({ redirect: true, callbackUrl: "/login" });
        throw new Error("Unauthorized");
      }

      // ✅ backend style: { success, data, message }
      if (!res.ok) {
        const msg = result?.message || `Request failed (${res.status})`;
        toast({ variant: "error", title: "Error", description: msg });
        throw new Error(msg);
      }

      if (result && result.success === false) {
        const msg = result?.message || "Failed to process. Please try again.";
        toast({ variant: "error", title: "Error", description: msg });
        throw new Error(msg);
      }

      // If backend returns {success:true,data:...}
      return (result?.data ?? result) as T;
    } catch (err: any) {
      // Avoid double toast if we already toased above
      if (err?.message !== "Unauthorized") {
        console.error("API error:", err);
      }
      throw err;
    } finally {
      setLoadingCount((c) => Math.max(0, c - 1));
    }
  };

  const get = <T,>(url: string) => request<T>("GET", url);
  const post = <T,>(url: string, body: any) => request<T>("POST", url, body);

  return { get, post, loading };
};

export default useFetch;
