"use client";

// Closing CTA band. Hook the user with the headline + apply / talk.

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { QUICK_FORM_URL } from "@/lib/config";

export function ClosingCTA() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(40% 50% at 20% 30%, rgba(37,177,129,0.30), transparent 60%), radial-gradient(40% 50% at 80% 70%, rgba(99,102,241,0.22), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-300 font-semibold">
            Climb the ladder
          </div>
          <h2 className="mt-4 font-sora font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Your first rung is{" "}
            <span className="bg-gradient-to-r from-[#34d399] to-[#a5b4fc] bg-clip-text text-transparent">
              3 minutes away.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Same-day disbursal. Daily ladder. Zero prepayment penalty.
            Join thousands climbing every day with Quikkred.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={QUICK_FORM_URL}
              className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#25B181] text-white font-semibold text-base sm:text-lg shadow-[0_14px_36px_-10px_rgba(37,177,129,0.7)] hover:shadow-[0_18px_44px_-10px_rgba(37,177,129,0.9)] hover:bg-[#1ea16f] transition-all"
            >
              Apply now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full bg-white/10 backdrop-blur text-white font-semibold text-base border border-white/15 hover:bg-white/15 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Talk to a human
            </Link>
          </div>

          <div className="mt-8 text-[11px] sm:text-xs text-slate-400 tracking-wide">
            RBI-registered NBFC · DPDP-compliant · No paperwork · Same-day disbursal
          </div>
        </motion.div>
      </div>
    </section>
  );
}
