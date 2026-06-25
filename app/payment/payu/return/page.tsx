"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle, XCircle, Clock, Loader2, ArrowRight, RefreshCw, Home,
} from "lucide-react";
import { payuService, type PayuVerifyStatus } from "@/lib/api/payu.service";

// PayU surl/furl return page.
// PayU posts the transaction result to the backend surl/furl, which redirects
// the browser here with `?txnid=...` (and optionally `loanId`/`status`).
// We confirm the real status server-side via the verify endpoint.

type ViewState = "loading" | "error" | PayuVerifyStatus;

function PayuReturnContent() {
  const searchParams = useSearchParams();
  // PayU / backend may use any of these keys for the transaction id.
  const txnid =
    searchParams.get("txnid") ||
    searchParams.get("txnId") ||
    searchParams.get("transactionId") ||
    "";
  const loanId = searchParams.get("loanId") || "";

  const [state, setState] = useState<ViewState>("loading");
  const [amount, setAmount] = useState<number | null>(null);
  const [mihpayid, setMihpayid] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const runVerify = async () => {
    if (!txnid) {
      setState("error");
      setMessage("Missing transaction reference. Please check your payment history.");
      return;
    }
    setState("loading");
    try {
      const res = await payuService.verify(txnid);
      if (res.success && res.data) {
        setState(res.data.status);
        setAmount(res.data.amount);
        setMihpayid(res.data.mihpayid);
      } else {
        setState("error");
        setMessage(res.error || "We could not verify this payment.");
      }
    } catch (err: any) {
      setState("error");
      setMessage(err?.message || "We could not verify this payment.");
    }
  };

  useEffect(() => {
    runVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnid]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const loanHref = loanId ? `/loans/${loanId}` : "/loans";

  const config: Record<
    Exclude<ViewState, "loading">,
    { icon: typeof CheckCircle; iconClass: string; bgClass: string; title: string; body: string }
  > = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-500",
      bgClass: "bg-green-100",
      title: "Payment Successful",
      body: "Your EMI payment has been received and confirmed.",
    },
    failure: {
      icon: XCircle,
      iconClass: "text-red-500",
      bgClass: "bg-red-100",
      title: "Payment Failed",
      body: "Your payment did not go through. No amount has been debited, or it will be auto-reversed.",
    },
    pending: {
      icon: Clock,
      iconClass: "text-yellow-500",
      bgClass: "bg-yellow-100",
      title: "Payment Pending",
      body: "Your payment is being processed. This can take a few minutes. You can refresh to check again.",
    },
    error: {
      icon: XCircle,
      iconClass: "text-gray-500",
      bgClass: "bg-gray-100",
      title: "Verification Issue",
      body: message || "We could not verify this payment right now.",
    },
  };

  if (state === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  const c = config[state];
  const Icon = c.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
      >
        <div
          className={`w-20 h-20 ${c.bgClass} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <Icon className={`w-10 h-10 ${c.iconClass}`} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{c.title}</h1>
        <p className="text-gray-600 mb-6">{c.body}</p>

        {(amount != null || txnid || mihpayid) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
            {amount != null && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(amount)}
                </span>
              </div>
            )}
            {txnid && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-semibold text-gray-900 break-all">{txnid}</span>
              </div>
            )}
            {mihpayid && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">PayU Ref</span>
                <span className="font-semibold text-gray-900 break-all">{mihpayid}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {(state === "pending" || state === "error") && (
            <button
              type="button"
              onClick={runVerify}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Check Again
            </button>
          )}
          <Link
            href={loanHref}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loanId ? (
              <>
                View Loan <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Home className="w-4 h-4" /> My Loans
              </>
            )}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PayuReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <PayuReturnContent />
    </Suspense>
  );
}
