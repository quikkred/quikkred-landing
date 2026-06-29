"use client";

// Real-world story: a single ₹50,000 loan timeline. Day 0 → Day 30.
// Vertical timeline with milestones, animated as user scrolls.

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Smartphone, FileCheck2, BanknoteArrowUp, QrCode, TrendingDown,
  PartyPopper, Repeat,
} from "lucide-react";

const MILESTONES = [
  { day: "Day 0", time: "10:42 IST", icon: Smartphone, title: "Apply in 3 minutes", body: "Phone, PAN and Aadhaar e-KYC. A quick credit check and account-aggregator consent confirm your eligibility." },
  { day: "Day 0", time: "11:18 IST", icon: FileCheck2, title: "Approved", body: "Identity verified and your application cleared — all within minutes, no branch visit." },
  { day: "Day 0", time: "11:24 IST", icon: BanknoteArrowUp, title: "Money in your account", body: "Disbursed straight to your bank within seconds. A unique UPI ID and QR are set up for your daily repayments." },
  { day: "Day 1", time: "—", icon: QrCode, title: "Your first rung", body: "Scan the QR or pay over UPI — confirmed instantly, and your balance updates the moment it lands." },
  { day: "Day 7", time: "—", icon: TrendingDown, title: "On track", body: "A week in and your balance is steadily falling. Every payment shows up the second it's made." },
  { day: "Day 14", time: "—", icon: Repeat, title: "Ahead of plan", body: "Over-paying on a few good days has put you ahead of schedule — your tenure is already shrinking." },
  { day: "Day 22", time: "12:09 IST", icon: PartyPopper, title: "Closed early", body: "An extra payment on a good day clears your balance — your loan ends 8 days early, with zero penalty." },
];

export function StoryTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#0F766E] font-semibold">
            One loan · the full story
          </div>
          <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl text-slate-900 leading-tight">
            From apply to early-close. In 22 days.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            What a daily-ladder loan actually feels like, from the tap to apply to closing early.
          </p>
        </motion.div>

        <div ref={ref} className="mt-12 lg:mt-16 relative">
          {/* Spine */}
          <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-px bg-slate-200" aria-hidden />
          <motion.div
            className="absolute left-[18px] sm:left-[22px] top-2 w-px bg-gradient-to-b from-[#25B181] via-[#10b981] to-[#6366F1]"
            style={{ height: lineH }}
            aria-hidden
          />

          <ol className="space-y-7 sm:space-y-9">
            {MILESTONES.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="relative pl-12 sm:pl-16"
                >
                  <span className="absolute left-0 top-0.5 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white border-2 border-[#25B181] grid place-items-center shadow-[0_6px_20px_-8px_rgba(37,177,129,0.4)]">
                    <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#0F766E]" />
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0F766E]">{m.day}</span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">{m.time}</span>
                  </div>
                  <h3 className="mt-1 font-sora font-bold text-base sm:text-lg text-slate-900">{m.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed max-w-2xl">{m.body}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
