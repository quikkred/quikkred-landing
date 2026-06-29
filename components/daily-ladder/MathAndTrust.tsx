"use client";

// Transparent math card + trust/compliance band. Closes the case before CTA.

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Scale, BadgeCheck } from "lucide-react";

const MATH = [
  { k: "Loan amount", v: "Up to ₹50,000" },
  { k: "Tenure", v: "30 days" },
  { k: "You pay", v: "A little, every day" },
  { k: "Interest", v: "Reducing balance · only on what you owe" },
  { k: "Prepayment", v: "Zero penalty" },
  { k: "Cadence", v: "Daily / weekly (salaried)" },
  { k: "Repayment rail", v: "UPI · QR · UPI Autopay" },
  { k: "Confirmation", v: "Instant" },
];

const TRUST = [
  { icon: ShieldCheck, label: "RBI-registered NBFC", body: "Non-Banking Financial Company licensed under RBI; lending compliant with Master Direction." },
  { icon: Eye, label: "Your data, protected", body: "DPDP-compliant. Access to your information is consent-based and fully auditable." },
  { icon: Scale, label: "Reducing-balance interest", body: "Transparent. Interest charged only on outstanding principal. No flat-rate math sleight." },
  { icon: BadgeCheck, label: "Accurate to the paise", body: "Every payment is tracked and reconciled, so the balance you see is always the balance you owe." },
];

export function MathAndTrust() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-7">
          {/* Math card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 p-6 lg:p-8"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
              Transparent math
            </div>
            <h3 className="mt-2 font-sora font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
              Every paise visible. Every day.
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              No hidden charges, no surprise EMI. What you see is exactly what you pay.
            </p>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {MATH.map((r) => (
                <div
                  key={r.k}
                  className="flex items-baseline justify-between gap-3 border-b border-dashed border-slate-200 pb-2.5 last:border-0"
                >
                  <dt className="text-xs sm:text-sm text-slate-500">{r.k}</dt>
                  <dd className="text-xs sm:text-sm font-mono tabular-nums text-slate-900 font-semibold text-right">{r.v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 lg:p-8"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-300 font-semibold">
              Compliance + trust
            </div>
            <h3 className="mt-2 font-sora font-bold text-2xl sm:text-3xl leading-tight">
              Built on rails, not promises.
            </h3>
            <ul className="mt-6 space-y-4">
              {TRUST.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.label} className="flex items-start gap-3">
                    <span className="h-9 w-9 rounded-lg bg-emerald-400/10 border border-emerald-400/20 grid place-items-center shrink-0">
                      <Icon className="w-4 h-4 text-emerald-300" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{t.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t.body}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
