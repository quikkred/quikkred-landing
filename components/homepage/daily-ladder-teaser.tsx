"use client";

// Homepage teaser banner for the Daily Ladder. Drives the click to /daily-ladder.
// Sits between Features and the Loan Calculator. Compact, no big animations.

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { QUICK_FORM_URL } from "@/lib/config";

export default function DailyLadderTeaser() {
  return (
    <section className="relative py-12 sm:py-14 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-7 sm:p-10 lg:p-12"
        >
          {/* Atmospheric */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(50% 60% at 90% 30%, rgba(37,177,129,0.22), transparent 60%), radial-gradient(40% 50% at 10% 80%, rgba(99,102,241,0.18), transparent 60%)",
            }}
          />
          {/* Faint grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-10 items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400/15 to-indigo-400/15 border border-emerald-400/25 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-300">
                <Award className="w-3.5 h-3.5" />
                India's Lending Innovation · 2026
              </span>
              <h2 className="mt-4 font-sora font-bold text-2xl sm:text-3xl lg:text-4xl leading-[1.05]">
                The Daily Ladder.{" "}
                <span className="bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#a5b4fc] bg-clip-text text-transparent">
                  30 days. 30 rungs.
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Pay a little every day. See your repayment in real-time. Capital comes back in 24 hours, not 24 days — the first lending product in India that lets you over-pay any day and shorten your tenure with zero penalty.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/daily-ladder"
                  className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-white text-slate-900 font-semibold text-sm shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_14px_36px_-10px_rgba(255,255,255,0.6)] transition-all"
                >
                  Explore the Daily Ladder
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href={QUICK_FORM_URL}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition"
                >
                  Apply now
                </Link>
              </div>
            </div>

            {/* Mini animated rungs preview */}
            <MiniRungs />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniRungs() {
  // 7 bars representing a week — visual flourish only.
  const widths = [0.55, 0.7, 1.0, 0.45, 1.0, 0.6, 0.85];
  return (
    <div className="hidden lg:block w-[280px] shrink-0">
      <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur p-4">
        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold mb-3">
          A typical week
        </div>
        <div className="space-y-1.5">
          {widths.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 text-[9px] font-mono text-slate-500 tabular-nums">D{i + 1}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left", width: `${w * 100}%` }}
                  className={`h-full rounded-full ${
                    w > 0.9
                      ? "bg-gradient-to-r from-[#10b981] to-[#a5b4fc]"
                      : "bg-gradient-to-r from-[#0d8b65] to-[#25B181]"
                  }`}
                />
              </div>
              <span className="w-12 text-right text-[9px] font-mono text-slate-400 tabular-nums">
                ₹{(2500 * w).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-slate-400 text-center">
          Daily floor · 5% of principal
        </div>
      </div>
    </div>
  );
}
