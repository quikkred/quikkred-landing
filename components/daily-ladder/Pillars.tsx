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
          {/* Pillar 1: Real-time visibility */}
          <Pillar
            num="01"
            title="Your balance, in real time"
            body="No statement to wait for. Every payment updates your outstanding the moment it lands — you always know exactly where you stand."
            tone="emerald"
            visual={<BalanceFall />}
          />
          {/* Pillar 2: Flexibility */}
          <Pillar
            num="02"
            title="Pay to your own rhythm"
            body="Pay the daily amount on tight days, a little more on good ones. Every extra rupee goes straight to your balance."
            tone="indigo"
            visual={<RhythmBars />}
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

function BalanceFall() {
  // Line that descends — represents your outstanding balance dropping day by day
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <defs>
        <linearGradient id="balance-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#25B181" />
          <stop offset="100%" stopColor="#25B181" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* baseline */}
      <line x1="10" y1="80" x2="190" y2="80" stroke="#E2E8F0" strokeDasharray="2 3" />
      {/* descending balance line */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        d="M 10 14 L 30 20 L 50 28 L 70 36 L 90 44 L 110 52 L 130 60 L 150 67 L 170 73 L 190 78"
        fill="none"
        stroke="url(#balance-fade)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* end marker */}
      <motion.circle
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.2 }}
        cx="190" cy="78" r="5"
        fill="#25B181"
        style={{ transformOrigin: "190px 78px" }}
      />
      <text x="10" y="9" fontSize="9" fill="#0F766E" fontWeight="600">Balance</text>
      <text x="10" y="92" fontSize="8" fill="#94A3B8" fontFamily="monospace">Day 1</text>
      <text x="190" y="92" textAnchor="end" fontSize="8" fill="#94A3B8" fontFamily="monospace">Day 30</text>
    </svg>
  );
}

function RhythmBars() {
  // Variable-height bars — steady days and over-pay days, your own pace
  const bars = [0.5, 0.5, 0.9, 0.5, 1.0, 0.5, 0.7, 0.5];
  return (
    <div className="w-full h-full flex items-end justify-center gap-2 p-4">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: `${h * 100}%`, transformOrigin: "bottom" }}
          className={`w-3.5 rounded-md ${
            h > 0.8
              ? "bg-gradient-to-t from-[#10b981] to-[#a5b4fc]"
              : "bg-gradient-to-t from-[#0d8b65] to-[#25B181]"
          }`}
        />
      ))}
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
