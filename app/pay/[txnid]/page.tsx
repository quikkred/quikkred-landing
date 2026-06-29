"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Shield, Lock, Loader2, AlertCircle, CheckCircle2, IndianRupee,
} from "lucide-react";
import { payuService, type PayuFormParams, type PayuCheckoutResponse } from "@/lib/api/payu.service";

/**
 * Builds a real <form method="POST" action> with a hidden input per param and
 * submits it — a top-level navigation POST (NOT fetch), as PayU's hosted
 * checkout requires. PayU's page then shows every enabled method (UPI Intent /
 * Card / Net-banking). The salt never reaches the browser; the backend signs `hash`.
 */
function postToPayu(action: string, params: PayuFormParams) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.style.display = "none";
  form.acceptCharset = "UTF-8";
  Object.entries(params).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value == null ? "" : String(value);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

const inr = (v: string | number) =>
  `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function PayPage() {
  const routeParams = useParams();
  const txnid = String(routeParams?.txnid || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<PayuCheckoutResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await payuService.getCheckout(txnid);
      if (!res.success || !res.data) throw new Error(res.message || "This payment link is invalid or has expired.");
      setCheckout(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load this payment link.");
    } finally {
      setLoading(false);
    }
  }, [txnid]);

  useEffect(() => {
    if (txnid) load();
  }, [txnid, load]);

  const pay = () => {
    if (!checkout?.action || !checkout?.params) return;
    setSubmitting(true);
    postToPayu(checkout.action, checkout.params);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-xl">
            <Shield className="w-5 h-5" /> Quikkred
          </div>
          <p className="text-xs text-gray-500 mt-1">Secure loan repayment</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {loading && (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <Loader2 className="w-7 h-7 animate-spin mb-3 text-emerald-600" />
              Loading your payment…
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center py-10 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="font-semibold text-gray-900">Payment link unavailable</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
              <button
                onClick={load}
                className="mt-5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && checkout?.alreadyPaid && (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
              <p className="font-semibold text-gray-900">Already paid</p>
              <p className="text-sm text-gray-500 mt-1">
                This payment{checkout.loanNumber ? ` for loan ${checkout.loanNumber}` : ""} has already been received. Thank you!
              </p>
            </div>
          )}

          {!loading && !error && checkout && !checkout.alreadyPaid && (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">Amount due</p>
                <p className="text-4xl font-bold text-gray-900 mt-1 flex items-center justify-center">
                  <IndianRupee className="w-7 h-7" />
                  {Number(checkout.amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
                {checkout.loanNumber && (
                  <p className="text-xs text-gray-400 mt-2">Loan {checkout.loanNumber}</p>
                )}
              </div>

              <button
                onClick={pay}
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Redirecting to PayU…
                  </>
                ) : (
                  <>Pay {inr(checkout.amount)} securely</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Pay via UPI, Card or Net-banking on PayU&apos;s secure page.
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-5">
          <Lock className="w-3.5 h-3.5" /> 256-bit secure payment via PayU
        </div>
      </div>
    </main>
  );
}
