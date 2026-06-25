"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building, CreditCard, Search, ChevronDown, Check,
  Shield, Lock, Loader2, AlertCircle, Link as LinkIcon,
} from "lucide-react";
import { payuService, type PayuMethod, type PayuFormParams } from "@/lib/api/payu.service";
import { PAYU_NETBANKING_BANKS } from "@/lib/payu-banks";

interface PayuCheckoutProps {
  loanId: string;
  /** Amount in rupees. */
  amount: number;
  productinfo?: string;
  onError?: (message: string) => void;
}

// Method list is designed so adding UPI / UPI-Intent / wallets / EMI later is
// trivial — append an entry here once the backend + MID enable them.
interface MethodOption {
  id: PayuMethod;
  label: string;
  description: string;
  icon: typeof Building;
  needsBank: boolean;
}

const METHODS: MethodOption[] = [
  {
    id: "NB",
    label: "Netbanking",
    description: "Pay from your bank account",
    icon: Building,
    needsBank: true,
  },
  {
    id: "DC",
    label: "Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: CreditCard,
    needsBank: false,
  },
];

/**
 * Builds a real <form method="POST" action> with a hidden input for every key
 * in `params` and submits it, navigating the browser to PayU's hosted page.
 * This is a top-level navigation POST — NOT an AJAX/fetch — as PayU requires.
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

export default function PayuCheckout({
  loanId,
  amount,
  productinfo,
  onError,
}: PayuCheckoutProps) {
  const [method, setMethod] = useState<PayuMethod | "">("");
  const [bankcode, setBankcode] = useState<string>("");
  const [bankSearch, setBankSearch] = useState<string>("");
  const [bankOpen, setBankOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinkLoading, setIsLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedMethod = useMemo(
    () => METHODS.find((m) => m.id === method) || null,
    [method]
  );

  const filteredBanks = useMemo(() => {
    const q = bankSearch.trim().toLowerCase();
    if (!q) return PAYU_NETBANKING_BANKS;
    return PAYU_NETBANKING_BANKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)
    );
  }, [bankSearch]);

  const selectedBankName = useMemo(
    () => PAYU_NETBANKING_BANKS.find((b) => b.code === bankcode)?.name ?? "",
    [bankcode]
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const reportError = (msg: string) => {
    setError(msg);
    onError?.(msg);
  };

  const canPay =
    !!method && (selectedMethod?.needsBank ? !!bankcode : true) && amount > 0;

  const handlePay = async () => {
    if (!canPay || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await payuService.initiate({
        loanId,
        amount,
        method: method as PayuMethod,
        bankcode: selectedMethod?.needsBank ? bankcode : "",
      });

      if (res.success && res.data?.action && res.data?.params) {
        // Navigates away to PayU — keep the spinner until the redirect happens.
        postToPayu(res.data.action, res.data.params);
        return;
      }
      reportError(res.error || "Could not start the PayU payment. Please try again.");
      setIsSubmitting(false);
    } catch (err: any) {
      reportError(err?.message || "Payment initiation failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handlePaymentLink = async () => {
    if (isLinkLoading || amount <= 0) return;
    setIsLinkLoading(true);
    setError(null);
    try {
      const res = await payuService.createPaymentLink({ loanId, amount });
      if (res.success && res.data?.paymentLink) {
        window.open(res.data.paymentLink, "_blank", "noopener,noreferrer");
      } else {
        reportError(res.error || "Could not generate a payment link. Please try again.");
      }
    } catch (err: any) {
      reportError(err?.message || "Could not generate a payment link.");
    } finally {
      setIsLinkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{error}</span>
        </motion.div>
      )}

      {/* Method picker */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.id;
            return (
              <motion.button
                type="button"
                key={m.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMethod(m.id);
                  if (!m.needsBank) {
                    setBankcode("");
                    setBankOpen(false);
                  }
                }}
                className={`text-left border rounded-lg p-4 transition-colors ${
                  active
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{m.label}</p>
                      <p className="text-xs text-gray-600">{m.description}</p>
                    </div>
                  </div>
                  {active && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Searchable bank dropdown for Netbanking */}
      <AnimatePresence>
        {selectedMethod?.needsBank && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-visible"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setBankOpen((o) => !o)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span
                  className={selectedBankName ? "text-gray-900" : "text-gray-400"}
                >
                  {selectedBankName || "Choose your bank"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    bankOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {bankOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        autoFocus
                        type="text"
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        placeholder="Search bank..."
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                  </div>
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {filteredBanks.length === 0 && (
                      <li className="px-4 py-3 text-sm text-gray-500">
                        No banks found
                      </li>
                    )}
                    {filteredBanks.map((b) => (
                      <li key={b.code}>
                        <button
                          type="button"
                          onClick={() => {
                            setBankcode(b.code);
                            setBankOpen(false);
                            setBankSearch("");
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-blue-50 ${
                            bankcode === b.code ? "bg-blue-50 text-blue-700" : "text-gray-800"
                          }`}
                        >
                          <span>{b.name}</span>
                          {bankcode === b.code && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security note */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">
            Payments are processed securely on PayU's PCI-DSS compliant page.
          </span>
        </div>
      </div>

      {/* Pay button */}
      <button
        type="button"
        onClick={handlePay}
        disabled={!canPay || isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Redirecting to PayU...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Pay {formatCurrency(amount)}</span>
          </>
        )}
      </button>

      {/* Payment link fallback */}
      <div className="text-center">
        <button
          type="button"
          onClick={handlePaymentLink}
          disabled={isLinkLoading || amount <= 0}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {isLinkLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
          <span>Pay via Payment Link instead</span>
        </button>
      </div>
    </div>
  );
}
