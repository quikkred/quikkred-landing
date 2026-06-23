"use client";

import { useState } from "react";
import { signIn, getSession, signOut } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { ShieldCheck, Loader2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { toast, Toaster } from "@/components/ui/toast";
import { ADMIN_ROLES } from "@/lib/impersonation";

/**
 * Admin sign-in. Hits the backend login API DIRECTLY (POST /api/user/login)
 * from the browser, exactly as the backend guide describes, then bridges the
 * returned admin token into the app's NextAuth session (via the `otp-tokens`
 * provider) so the existing /latur-ka-fraud-customer/impersonate tool — which
 * reads the admin's access token from the session — works unchanged.
 *
 * This is the ONLY way to obtain an admin session in this app. Customers use
 * the OTP flow at /login; this page is admin-only and not linked anywhere in
 * the customer UI.
 */
export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mail = email.trim();
    if (!mail || !password) {
      toast({ variant: "warning", title: "Missing details", description: "Enter your email and password." });
      return;
    }

    setLoading(true);
    try {
      // 1) Direct hit to the backend admin login API.
      const res = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // lets the backend set its httpOnly admin cookie on same-domain
        body: JSON.stringify({ email: mail, password }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success || !json?.data) {
        toast({
          variant: "error",
          title: "Login failed",
          description: json?.message || "Invalid email or password.",
        });
        setLoading(false);
        return;
      }

      const d = json.data;
      // Identity/role come back nested under `data.user` (with `data.accessToken`
      // alongside it); tolerate a flat shape too just in case.
      const u = d.user || d;
      const role: string | undefined = u.role || d.role;

      // Guard: only privileged roles may use the support tool. The backend
      // enforces this too (impersonate returns 403 otherwise) — fail fast here.
      const isAdmin = !!role && (ADMIN_ROLES as readonly string[]).includes(role);
      if (!isAdmin) {
        toast({
          variant: "error",
          title: "Not an admin account",
          description: "This account doesn't have admin access.",
        });
        setLoading(false);
        return;
      }

      // 2) Bridge the admin token into the app's NextAuth session so the rest
      //    of the app (middleware, the impersonate tool, useAxios) sees a real
      //    logged-in admin. startImpersonation later reads this access token.
      const sessionRes = await signIn("otp-tokens", {
        redirect: false,
        userId: u.userId || u._id || u.id || mail,
        email: u.email || mail,
        mobile: u.mobile || "",
        role,
        accessToken: d.accessToken,
        refreshToken: d.refreshToken || "",
        customerUniqueId: u.customerUniqueId || "",
      });

      if (!sessionRes?.ok) {
        toast({
          variant: "error",
          title: "Session error",
          description: "Logged in but could not start the session. Please try again.",
        });
        setLoading(false);
        return;
      }

      // Best-effort sanity check that the session really carries the admin role.
      const session = await getSession();
      const sessionRole = (session as any)?.role as string | undefined;
      if (sessionRole && !(ADMIN_ROLES as readonly string[]).includes(sessionRole)) {
        await signOut({ redirect: false });
        toast({ variant: "error", title: "Not authorised", description: "Admin session could not be verified." });
        setLoading(false);
        return;
      }

      toast({ variant: "success", title: "Signed in", description: "Opening the support tool…" });
      router.push("/latur-ka-fraud-customer/impersonate");
    } catch (err: any) {
      const isNetwork = err instanceof TypeError;
      toast({
        variant: "error",
        title: "Login failed",
        description: isNetwork ? "Network error while contacting the server." : err?.message || "Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin sign in</h1>
            <p className="text-xs text-gray-500">Staff access to the support tools</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quikkred.com"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25B181] to-[#1F8F68] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
