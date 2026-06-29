"use client";

// Side-by-side comparison: bullet loan vs daily ladder. The argument.

import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

const ROWS = [
  { k: "Cadence", bullet: "One lump sum at the end", ladder: "A little, every day" },
  { k: "Interest", bullet: "Charged on full principal", ladder: "Reducing balance · only on outstanding" },
  { k: "Prepayment", bullet: "Penalty applies", ladder: "Zero penalty · tenure shortens" },
  { k: "Tenure", bullet: "Fixed term", ladder: "Finish early when you over-pay" },
  { k: "Visibility", bullet: "One bullet payment", ladder: "Every paise visible, every day" },
];

export function VersusBullet() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
            The shift
          </div>
          <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl text-slate-900 leading-tight">
            Bullet loan <span className="text-slate-400">vs</span> Daily Ladder
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Same ₹50,000. Same 30 days. Two completely different experiences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
        >
          {/* Bullet */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 lg:p-7">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold tracking-[0.16em] uppercase">
              <X className="w-3.5 h-3.5" /> Industry standard · Bullet loan
            </div>
            <ul className="mt-5 space-y-3">
              {ROWS.map((r) => (
                <li key={r.k} className="flex items-baseline gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0">
                  <span className="w-20 sm:w-24 text-[11px] uppercase tracking-[0.12em] text-slate-400 font-semibold shrink-0">{r.k}</span>
                  <span className="text-sm text-slate-600 flex-1">{r.bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ladder — accent */}
          <div className="relative rounded-2xl border-2 border-[#25B181] bg-gradient-to-br from-[#25B181]/[0.04] via-white to-[#6366F1]/[0.04] p-6 lg:p-7 shadow-[0_12px_44px_-16px_rgba(37,177,129,0.22)]">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[#25B181] text-white text-[10px] font-bold tracking-[0.14em] uppercase">
              Quikkred
            </span>
            <div className="flex items-center gap-2 text-[#0F766E] text-xs font-semibold tracking-[0.16em] uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" /> Daily Ladder
            </div>
            <ul className="mt-5 space-y-3">
              {ROWS.map((r) => (
                <li key={r.k} className="flex items-baseline gap-3 border-b border-dashed border-[#25B181]/20 pb-3 last:border-0">
                  <span className="w-20 sm:w-24 text-[11px] uppercase tracking-[0.12em] text-[#0F766E]/80 font-semibold shrink-0">{r.k}</span>
                  <span className="text-sm text-slate-800 font-medium flex-1">{r.ladder}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
