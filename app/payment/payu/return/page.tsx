"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  LayoutDashboard,
  RefreshCw,
  LifeBuoy,
  Copy,
  Loader2,
} from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { COMPANY_PHONE_TEL } from "@/lib/constants/companyInfo";

type PayuStatus = "success" | "failure" | "pending";

// PayU's redirect status is only a hint; the backend verify call is authoritative.
// Anything we don't recognise becomes "pending" — the customer is told we're still
// confirming rather than shown a misleading success or failure.
const normalizeStatus = (s?: string | null): PayuStatus => {
  const v = (s || "").toLowerCase();
  if (v === "success") return "success";
  if (v === "failure" || v === "failed") return "failure";
  return "pending";
};

const STATUS_CONFIG: Record<PayuStatus, {
  badge: string;
  ring: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = {
  success: {
    badge: "text-emerald-600 bg-emerald-100",
    ring: "ring-emerald-50",
    icon: <CheckCircle2 className="w-10 h-10" />,
    title: "Payment received",
    description: "Your payment went through. It'll reflect on your loan shortly.",
  },
  failure: {
    badge: "text-red-500 bg-red-100",
    ring: "ring-red-50",
    icon: <XCircle className="w-10 h-10" />,
    title: "Payment didn't go through",
    description: "No money was deducted. You can try the payment again from your dashboard.",
  },
  pending: {
    badge: "text-amber-600 bg-amber-100",
    ring: "ring-amber-50",
    icon: <Clock className="w-10 h-10" />,
    title: "Confirming your payment",
    description: "This can take a minute. We'll update your loan the moment the bank confirms.",
  },
};

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const axios = useAxios();
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState<{ status?: string; amount?: number | string } | null>(null);
  const [verifying, setVerifying] = useState(true);

  const txnid = searchParams.get("txnid") || "";
  const queryStatus = searchParams.get("status");
  const queryAmount = searchParams.get("amount") || "";

  // Confirm the result with the backend rather than trusting the redirect param.
  useEffect(() => {
    if (!txnid) {
      setVerifying(false);
      return;
    }
    let cancelled = false;
    axios
      .get(`/api/payu/collect/verify/${txnid}`)
      .then((res) => {
        if (cancelled) return;
        setVerified(res.data?.data ?? res.data ?? null);
      })
      .catch(() => {
        /* fall back to the redirect status */
      })
      .finally(() => {
        if (!cancelled) setVerifying(false);
      });
    return () => {
      cancelled = true;
    };
  }, [txnid, axios]);

  const status: PayuStatus = normalizeStatus(verified?.status ?? queryStatus);
  const config = STATUS_CONFIG[status];
  const amount = verified?.amount ?? queryAmount;

  const copyTxn = async () => {
    if (!txnid) return;
    try {
      await navigator.clipboard.writeText(txnid);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden"
      >
        {/* Header band */}
        <div className="relative h-32 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
            className={`relative z-10 p-4 rounded-full shadow-lg ring-8 ${config.badge} ${config.ring}`}
          >
            {config.icon}
          </motion.div>
        </div>

        <div className="px-6 pb-7 pt-1">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-sora tracking-tight text-gray-900">
              {config.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{config.description}</p>
            {verifying && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Checking with your bank…
              </p>
            )}
          </div>

          {/* Receipt detail */}
          {(txnid || amount) && (
            <div className="bg-[#FAFAFA] rounded-2xl border border-gray-100 divide-y divide-gray-100 mb-6">
              {amount !== "" && amount != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-gray-500">Amount</span>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{Number(amount).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              {txnid && (
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-xs text-gray-500 shrink-0">Transaction ID</span>
                  <button
                    onClick={copyTxn}
                    className="group flex items-center gap-1.5 min-w-0"
                    title="Copy transaction ID"
                  >
                    <span className="text-sm font-mono font-medium text-gray-900 truncate">
                      {txnid}
                    </span>
                    <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1F8F68] shrink-0" />
                  </button>
                </div>
              )}
              {copied && (
                <p className="px-4 py-1.5 text-[11px] text-[#1F8F68] text-right">Copied</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {status === "failure" ? (
              <Link href="/user">
                <button className="w-full py-3.5 px-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#25B181]/20 hover:shadow-[#25B181]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try payment again
                </button>
              </Link>
            ) : (
              <Link href="/user">
                <button className="w-full py-3.5 px-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#25B181]/20 hover:shadow-[#25B181]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to dashboard
                </button>
              </Link>
            )}

            <a
              href={`tel:${COMPANY_PHONE_TEL}`}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#1F8F68] transition-colors py-1"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              {status === "failure" ? "Money debited? Contact support" : "Need help? Contact support"}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PayuReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
