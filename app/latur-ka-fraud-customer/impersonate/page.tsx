"use client";

import { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { ShieldCheck, Loader2, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast, Toaster } from "@/components/ui/toast";
import { startImpersonation, ADMIN_ROLES, type ImpersonateParams } from "@/lib/impersonation";

type IdentityType = "mobile" | "customerId" | "customerUniqueId";

const IDENTITY_OPTIONS: { value: IdentityType; label: string; placeholder: string }[] = [
  { value: "mobile", label: "Mobile number", placeholder: "10-digit mobile number" },
  { value: "customerId", label: "Customer ID", placeholder: "e.g. 665f1c2a8b…" },
  { value: "customerUniqueId", label: "Customer unique ID", placeholder: "e.g. CUST2024000001" },
];

export default function ImpersonatePage() {
  const { data: session, status } = useSession();
  const { login } = useAuth();
  const router = useRouter();

  const [identityType, setIdentityType] = useState<IdentityType>("mobile");
  const [identityValue, setIdentityValue] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const role = (session as any)?.role as string | undefined;
  const isAdmin = !!role && (ADMIN_ROLES as readonly string[]).includes(role);

  // ── Loading / authorization gates ─────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Lock className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Not authorised</h1>
          <p className="mt-2 text-sm text-gray-600">
            This page is restricted to admin accounts. If you believe this is a mistake, contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  // ── Start a support session ───────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = identityValue.trim();
    if (!value) {
      toast({ variant: "warning", title: "Missing details", description: "Enter the customer's identifier." });
      return;
    }

    setLoading(true);
    try {
      const params: ImpersonateParams = { reason };
      params[identityType] = value;
      await startImpersonation(params);

      // Hydrate AuthContext from the freshly-established customer session,
      // mirroring the normal OTP login flow, then open the dashboard.
      const newSession = await getSession();
      if (newSession) {
        await login({ apiData: newSession, email: (newSession as any)?.user?.email || "" });
      }

      toast({
        variant: "success",
        title: "Support session started",
        description: "Opening the customer's dashboard…",
      });
      router.push("/user");
    } catch (err: any) {
      toast({
        variant: "error",
        title: "Could not start session",
        description: err?.message || "Please try again.",
      });
      setLoading(false);
    }
  };

  const activeOption = IDENTITY_OPTIONS.find((o) => o.value === identityType)!;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Customer support login</h1>
            <p className="text-xs text-gray-500">Signed in as {role}</p>
          </div>
        </div>

        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800">
          You will open the customer&apos;s dashboard without sending them an OTP. The session lasts 30 minutes,
          is logged for audit, and disables sensitive actions (disbursement, password/mobile change, e-sign).
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Find customer by</label>
            <select
              value={identityType}
              onChange={(e) => {
                setIdentityType(e.target.value as IdentityType);
                setIdentityValue("");
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {IDENTITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{activeOption.label}</label>
            <input
              type={identityType === "mobile" ? "tel" : "text"}
              inputMode={identityType === "mobile" ? "numeric" : "text"}
              value={identityValue}
              onChange={(e) =>
                setIdentityValue(
                  identityType === "mobile" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value
                )
              }
              placeholder={activeOption.placeholder}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Reason <span className="font-normal text-gray-400">(saved in audit log)</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer called for help with KYC"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !identityValue.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25B181] to-[#1F8F68] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            {loading ? "Starting session…" : "Open customer dashboard"}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
