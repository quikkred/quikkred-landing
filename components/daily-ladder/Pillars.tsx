"use client";

// Three innovation pillars on /daily-ladder. Each pillar has its own mini-visual
// to drive the abstraction home: signal speed, capital velocity, flexibility.

import { motion } from "framer-motion";

export function Pillars() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#0F766E] font-semibold">
            Why this is innovation
          </div>
          <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl text-slate-900 leading-tight">
            Three shifts that change everything.
          </h2>
        </motion.div>

        <div className="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Pillar 1: Daily signal */}
          <Pillar
            num="01"
            title="Daily signal, not 30-day blindness"
            body="Industry sees a default on day 30. We see it in 24 hours. Risk surfaces before it compounds."
            tone="emerald"
            visual={<SignalSpike />}
          />
          {/* Pillar 2: Capital velocity */}
          <Pillar
            num="02"
            title="Capital recycles every 15 days"
            body="50% of the loan is back by day 15. Re-lend it the same week — same ₹1 funds 2× more borrowers per year."
            tone="indigo"
            visual={<FlywheelIcon />}
          />
          {/* Pillar 3: Flexibility */}
          <Pillar
            num="03"
            title="Reducing balance · zero penalty"
            body="Overpay any day and your tenure shortens. Interest only on what you still owe. No prepayment fees."
            tone="emerald"
            visual={<TenureShrink />}
          />
        </div>
      </div>
    </section>
  );
}

function Pillar({
  num, title, body, tone, visual,
}: {
  num: string; title: string; body: string; tone: "emerald" | "indigo"; visual: React.ReactNode;
}) {
  const accent = tone === "emerald" ? "text-[#0F766E] bg-[#25B181]/10 border-[#25B181]/20" : "text-[#4338CA] bg-[#6366F1]/10 border-[#6366F1]/20";
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl bg-white border border-slate-200 p-6 lg:p-7 hover:border-[#25B181]/40 hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.18)] transition-all flex flex-col"
    >
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center justify-center h-7 px-2.5 rounded-md ${accent} border text-[10px] font-bold font-mono tabular-nums tracking-wider`}>{num}</span>
      </div>
      <h3 className="mt-4 font-sora font-bold text-lg sm:text-xl text-slate-900 leading-snug">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{body}</p>
      <div className="mt-5 h-32 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 overflow-hidden">
        {visual}
      </div>
    </motion.article>
  );
}

function SignalSpike() {
  // Line that climbs then spikes — represents risk going from invisible to obvious
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <defs>
        <linearGradient id="signal-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#25B181" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#25B181" />
        </linearGradient>
      </defs>
      {/* baseline */}
      <line x1="10" y1="80" x2="190" y2="80" stroke="#E2E8F0" strokeDasharray="2 3" />
      {/* growing line with spike */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        d="M 10 78 L 30 76 L 50 75 L 70 73 L 90 70 L 110 66 L 130 60 L 150 50 L 165 36 L 180 18 L 190 10"
        fill="none"
        stroke="url(#signal-fade)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* spike marker */}
      <motion.circle
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.2 }}
        cx="180" cy="18" r="5"
        fill="#25B181"
        style={{ transformOrigin: "180px 18px" }}
      />
      <motion.text
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.4 }}
        x="178" y="10" textAnchor="end" fontSize="9" fill="#0F766E" fontWeight="600"
      >
        Risk visible
      </motion.text>
      <text x="10" y="92" fontSize="8" fill="#94A3B8" fontFamily="monospace">Day 1</text>
      <text x="190" y="92" textAnchor="end" fontSize="8" fill="#94A3B8" fontFamily="monospace">Day 30</text>
    </svg>
  );
}

function FlywheelIcon() {
  return (
    <div className="w-full h-full grid place-items-center">
      <motion.svg
        viewBox="0 0 120 120"
        className="w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <linearGradient id="fw-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#25B181" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="44" fill="none" stroke="#E2E8F0" strokeWidth="3" />
        <circle
          cx="60" cy="60" r="44" fill="none"
          stroke="url(#fw-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="138 138"
          transform="rotate(-90 60 60)"
        />
        {/* spokes */}
        <line x1="60" y1="20" x2="60" y2="36" stroke="url(#fw-grad)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="84" x2="60" y2="100" stroke="url(#fw-grad)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="60" x2="36" y2="60" stroke="url(#fw-grad)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="84" y1="60" x2="100" y2="60" stroke="url(#fw-grad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="60" cy="60" r="6" fill="#0F172A" />
      </motion.svg>
    </div>
  );
}

function TenureShrink() {
  // Two bars: full tenure shrinks to a shorter one
  return (
    <div className="w-full h-full p-3 flex flex-col justify-center gap-3">
      <div>
        <div className="text-[9px] font-mono text-slate-400 mb-1">Pay the floor only</div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-slate-400 rounded-full"
          />
        </div>
        <div className="text-[9px] font-mono text-slate-500 mt-1 text-right">30 days</div>
      </div>
      <div>
        <div className="text-[9px] font-mono text-[#0F766E] mb-1 font-semibold">Over-pay sometimes</div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "62%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-[#25B181] to-[#10b981] rounded-full"
          />
        </div>
        <div className="text-[9px] font-mono text-[#0F766E] mt-1 text-right font-semibold">~19 days</div>
      </div>
    </div>
  );
}
