"use client";

// Hero band for the dedicated /daily-ladder page.
// New-product eyebrow, dual-tone headline, animated rung preview, dual CTA.

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, ArrowRight, CalendarCheck, Calendar } from "lucide-react";
import Link from "next/link";
import { QUICK_FORM_URL } from "@/lib/config";

export function LadderHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroFade = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);
  const heroLift = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAFB] to-white pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28"
    >
      {/* Atmospheric backgrounds */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 20% 10%, rgba(37,177,129,0.15), transparent 60%), radial-gradient(50% 50% at 90% 20%, rgba(99,102,241,0.10), transparent 60%), radial-gradient(40% 40% at 80% 100%, rgba(52,211,153,0.08), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom, black, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 80%)",
        }}
      />

      <motion.div
        style={{ opacity: heroFade, y: heroLift }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#25B181]/10 via-[#10b981]/10 to-[#6366F1]/10 border border-[#25B181]/25 text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#0F766E]">
            <Sparkles className="w-3.5 h-3.5 text-[#25B181]" />
            A new way to borrow · 2026
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-6 text-center font-sora font-bold tracking-[-0.02em] text-slate-900 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02]"
        >
          The Daily Ladder.
          <span className="block mt-2 bg-gradient-to-r from-[#25B181] via-[#10b981] to-[#6366F1] bg-clip-text text-transparent">
            30 days. 30 rungs.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-6 text-center text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
        >
          A new way to borrow in India: <span className="text-slate-900 font-semibold">pay a little every day</span> and
          watch your balance fall in real time. Over-pay on any day — your tenure shortens, with zero penalty.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href={QUICK_FORM_URL}
            className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[#25B181] text-white font-semibold text-sm sm:text-base shadow-[0_10px_28px_-10px_rgba(37,177,129,0.55)] hover:shadow-[0_14px_36px_-10px_rgba(37,177,129,0.75)] hover:bg-[#1ea16f] transition-all"
          >
            Apply now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-slate-900 font-semibold text-sm sm:text-base border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Mini-ladder preview */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 mx-auto max-w-3xl rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 sm:p-7 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#25B181]/15 border border-[#25B181]/30 grid place-items-center">
                <Calendar className="w-4 h-4 text-[#34d399]" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold">You pay</div>
                <div className="text-lg sm:text-xl font-sora font-bold">A little, daily</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold">You can</div>
                <div className="text-lg sm:text-xl font-sora font-bold text-[#34d399]">Finish early</div>
              </div>
              <div className="h-9 w-9 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/30 grid place-items-center">
                <CalendarCheck className="w-4 h-4 text-[#a5b4fc]" />
              </div>
            </div>
          </div>

          {/* Small 7-day preview rungs (animated) */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: ["28%", "32%", "100%", "56%", "100%", "44%", "70%"][i] }}
                transition={{ duration: 0.7, delay: 0.55 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-md bg-gradient-to-t from-[#0d8b65] to-[#34d399]"
                style={{ height: 56, transformOrigin: "bottom" }}
              />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-[9px] sm:text-[10px] text-slate-500 font-mono tabular-nums text-center">
            {["D1","D2","D3","D4","D5","D6","D7"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="mt-4 text-[11px] sm:text-xs text-slate-400">
            Each rung = one daily payment. Over-pay days widen the bar. <span className="text-slate-300">Scroll for the full 30-day model.</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
