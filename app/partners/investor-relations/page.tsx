"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingDown,
  TrendingUp,
  Shield,
  Award,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Network,
  Banknote,
  Clock,
  Building2,
  Briefcase,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  Sparkles,
  Cpu,
  Store,
  Smartphone,
  BarChart3,
  Activity,
  Coins,
  Phone,
  Mail,
} from "lucide-react";

const HERO_STATS = [
  { value: "5%/day", label: "minimum floor commitment — push-pull via UPI/QR" },
  { value: "<5%", label: "target NPA · vs 12–18% industry STPL bullet" },
  { value: "7M", label: "gig-economy pool for Track-A field collections" },
  { value: "~70% ↓", label: "collection cost per soft visit vs DRA-only model" },
];

const REVENUE_STACK = [
  { label: "Platform fee", value: "₹5,000", note: "10% of principal · charged at disbursal", color: "#10b981" },
  { label: "GST on platform fee", value: "₹900", note: "18% on platform fee · routed to GoI", color: "#94a3b8" },
  { label: "Interest income", value: "₹15,000", note: "1%/day on reducing balance · 30-day max", color: "#3b82f6" },
];

const COST_STACK = [
  { label: "Kirana commission", value: "0.75% net", note: "spoke gets paid only on cleared paise" },
  { label: "Distributor override", value: "1.0% direct + 30%", note: "30% of kirana commission as override" },
  { label: "Acquisition cost", value: "₹0 / ₹400", note: "₹0 via kirana · ₹400 via direct digital" },
  { label: "Tech + ops", value: "~0.1%", note: "infra is two-backend Fastify on Vultr · sub-cent per request" },
  { label: "NPA provision", value: "~5%", note: "vs 12–18% on bullet — D1 signal collapses provisioning" },
];

const NPA_COMPARE = {
  bullet: {
    label: "Bullet / EMI loan",
    npa: "12–18%",
    avgOutstanding: "₹50,000",
    signal: "Day 30 — surfaces at maturity",
    recycle: "30+ days",
    color: "rose",
  },
  ladder: {
    label: "Daily-ladder STPL",
    npa: "Target < 5%",
    avgOutstanding: "₹25,833",
    signal: "Day 1 — surfaces in 24 hours",
    recycle: "Continuous — recycles ~every 15 days",
    color: "emerald",
  },
};

const CAPITAL_INSTRUMENTS = [
  {
    name: "Senior secured term debt",
    tenor: "12–36 months",
    min: "₹5 Cr",
    return: "Floating · MCLR + 250–450 bps",
    risk: "Lowest — first loss absorbed by Quikkred subordinate tranche",
    fit: "Banks, debt funds, family offices seeking yield with rated cover",
    icon: Banknote,
    color: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  {
    name: "Listed NCDs",
    tenor: "24–60 months",
    min: "₹1 Cr",
    return: "Fixed coupon · semi-annual",
    risk: "Rated by CRISIL / ICRA · trustee monitored",
    fit: "Wealth platforms, treasury allocators, HNI debt portfolios",
    icon: FileSpreadsheet,
    color: "from-sky-50 to-blue-100",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    name: "Co-lending / FLDG",
    tenor: "Loan-tenor matched",
    min: "₹10 Cr commitment",
    return: "Pass-through yield · 80% lender share",
    risk: "Shared risk — RBI Co-Lending Directions 2025",
    fit: "Banks, NBFCs scaling PSL & STPL exposure on plug-in stack",
    icon: Layers,
    color: "from-indigo-50 to-indigo-100",
    border: "border-indigo-200",
    text: "text-indigo-700",
  },
  {
    name: "Equity / SAFE",
    tenor: "Permanent capital",
    min: "By round",
    return: "Equity upside · board observation seat at term-sheet",
    risk: "Full equity risk — full upside",
    fit: "Strategic investors, fintech-focused funds, NBFC consolidators",
    icon: TrendingUp,
    color: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    text: "text-amber-700",
  },
];

const FUND_DEPLOYMENT = [
  { pct: 60, label: "AUM growth", note: "Disbursal corpus across 14 priority districts" },
  { pct: 18, label: "Distribution build-out", note: "Kirana onboarding · distributor training · field BD" },
  { pct: 12, label: "Tech & engineering", note: "Daily-ladder backend · ladder OS · risk engine v2" },
  { pct: 6, label: "Compliance & governance", note: "DPDP DPO, RBI returns, IS audit, BCP" },
  { pct: 4, label: "Working capital & reserves", note: "Liquidity buffer · interest service · cash reserves" },
];

const MOATS = [
  {
    icon: Activity,
    title: "Risk visibility moat",
    body: "Default surfaces on Day 1, not Day 30. Reducing-balance interest math means provisioning collapses when collections are daily. The same ₹50k loan carries half the average outstanding versus a bullet structure.",
    accent: "#10b981",
  },
  {
    icon: Network,
    title: "Distribution moat",
    body: "B2B2B2C hub-and-spoke: Satsai (NBFC) → Distributor → Kirana → Borrower. Kiranas underwrite borrowers banks can't reach — at ₹0 acquisition cost. The chain is regulated under DLD-2025 with full payment flow through NBFC-owned dynamic QR.",
    accent: "#6366f1",
  },
  {
    icon: Shield,
    title: "Collection moat",
    body: "Two-track field operations: Track A is a verified-partner network drawing from the 7M gig pool (Swiggy / Zomato / Rapido riders) for soft visits. Track B is DRA-certified partners for hard collections. Cost per soft visit drops ~70% vs DRA-only.",
    accent: "#06b6d4",
  },
  {
    icon: Cpu,
    title: "Tech moat",
    body: "Two-backend system bridged by HMAC: legacy stack owns origination & customer surface; new Fastify-5 backend owns the real-time ladder OS, spoke platform, collection router, risk and fraud. Both deploy independently; both observe the same ledger.",
    accent: "#f59e0b",
  },
];

const COMPLIANCE = [
  { name: "RBI (Digital Lending) Directions 2025", code: "DLD-2025" },
  { name: "RBI (Co-Lending Arrangements) Directions 2025", code: "CLA-2025" },
  { name: "Digital Personal Data Protection Act 2023 + Rules 2025", code: "DPDP" },
  { name: "RBI Fair Practices Code", code: "FPC" },
  { name: "Master Direction — NBFC-ND-SI", code: "MD-NBFC" },
  { name: "ISO 27001 (in progress) · CERT-In VAPT empanelled", code: "ISO 27001" },
];

const FAQ = [
  {
    q: "What is the lender of record on the platform?",
    a: "Loans are originated and held by Satsai Finlease Private Limited (RBI NBFC Reg. B-14.01646). Fluxusforge Technologies operates the Lending Service Provider (LSP) stack and servicing layer. Quikkred is the brand and product surface. Every regulatory return — credit, AML, DPDP, FPC — is filed by Satsai.",
  },
  {
    q: "How is repayment risk priced if NPAs surface on Day 1?",
    a: "On a 30-day bullet, the lender carries ₹50,000 of outstanding for the full tenor. On a daily-ladder, the average outstanding is ₹25,833 (sum of declining balances ÷ 30). Combined with a 5%/day floor commitment that surfaces missed-payments within 24 hours, the provisioning math is structurally different. Our internal target NPA is < 5% on a portfolio where the bullet equivalent runs 12–18%.",
  },
  {
    q: "What instruments are available for capital deployment?",
    a: "Senior secured term debt (rated), listed NCDs (issued via Satsai), co-lending arrangements (80/20 lender share under CLA-2025), and equity / SAFE rounds. Each comes with a Master Services Agreement, Data Processing Agreement, monthly MIS, and quarterly portfolio reviews. Co-lending and senior debt also carry a subordinated first-loss tranche absorbed by Quikkred.",
  },
  {
    q: "What governance and reporting can I expect?",
    a: "Monthly MIS (disbursals, collections, vintage, geographic concentration), quarterly portfolio review, semi-annual audited financials, ad-hoc credit committee briefings on portfolio-affecting events. DPDP-compliant data room with NDA-gated access. Annual board observation seat for capital-providers above the threshold defined in the term sheet.",
  },
  {
    q: "How is borrower data handled?",
    a: "DPDP Act 2023 + Rules 2025 compliant. A designated Data Protection Officer is appointed. Every partner signs a DPA. Borrower data is never transmitted to spoke or collection partners; partners only see masked case identifiers, geo-fenced routing, and Satsai-issued payment links. WORM audit trail under RBI digital lending audit norms.",
  },
  {
    q: "What's the path from a first conversation to a deal?",
    a: "Week 1: introductory call + NDA. Week 2–3: data room access, financial review, portfolio walk-through. Week 4–5: credit committee deck, term sheet circulation. Week 6–8: definitive documentation (MSA, DPA, NCD subscription / debt facility / SHA / SAFE), drawdown / closing. Faster paths are possible for repeat investors.",
  },
];

const NPA_BAR = (npa: string, max: number = 20) => {
  const num = parseFloat(npa.replace(/[^\d.]/g, "")) || 0;
  return Math.min((num / max) * 100, 100);
};

export default function InvestorRelationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---------------- HERO (dark, institutional) ---------------- */}
      <section className="relative overflow-hidden bg-[#060914] text-slate-100">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 18% 12%, rgba(99,102,241,0.22), transparent 42%), radial-gradient(circle at 82% 60%, rgba(6,182,212,0.18), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase rounded-full bg-indigo-500/10 text-indigo-200 border border-indigo-500/30">
              <Sparkles className="w-3 h-3" /> Investor Relations · 2026
            </span>
            <h1 className="font-sora font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight mt-6">
              The first NBFC platform built
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #34d399, #3b82f6, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                around daily collections.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-3xl leading-relaxed">
              We are rebuilding short-term lending in India around a simple insight: if borrowers pay
              a small amount every day, NPAs collapse, capital recycles faster, and a kirana shop can
              underwrite a loan a traditional bank cannot. This page is for capital partners
              evaluating an investment in that thesis.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {HERO_STATS.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6"
              >
                <div
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #34d399, #3b82f6, #22d3ee)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#data-room"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Request data room access <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#unit-economics"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-sm transition-all"
            >
              See the unit economics <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- THESIS · BULLET vs LADDER ---------------- */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-emerald-700">
              The thesis
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              Bullet loans hide their default risk until the last day.
              <br />
              <span className="text-slate-500">Daily-ladder surfaces it in 24 hours.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Same ₹50,000 principal. Same 30-day tenor. Two completely different risk profiles. The
              maths is unforgiving: in a daily-ladder the average outstanding is ~₹25,833. In a
              bullet, it's ₹50,000 — the full principal, for the full tenor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
          >
            {/* Bullet card */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold tracking-[0.14em] uppercase">
                <TrendingDown className="w-3.5 h-3.5" /> Industry · Bullet loan
              </div>
              <h3 className="mt-3 font-sora font-bold text-2xl text-slate-900">
                {NPA_COMPARE.bullet.label}
              </h3>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-slate-600">NPA range</span>
                    <span className="font-bold text-rose-600 tabular-nums">
                      {NPA_COMPARE.bullet.npa}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${NPA_BAR(NPA_COMPARE.bullet.npa)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm pt-2">
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Avg outstanding
                    </div>
                    <div className="mt-1 font-bold text-slate-900 tabular-nums">
                      {NPA_COMPARE.bullet.avgOutstanding}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Default signal
                    </div>
                    <div className="mt-1 font-bold text-slate-900">
                      {NPA_COMPARE.bullet.signal}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-700">
                  <Clock className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                  Capital locked: <strong>{NPA_COMPARE.bullet.recycle}</strong>
                </div>
              </div>
            </div>

            {/* Ladder card */}
            <div className="relative rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/40 via-white to-cyan-50/40 p-6 sm:p-8 shadow-[0_12px_44px_-16px_rgba(16,185,129,0.25)]">
              <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-[0.14em] uppercase">
                Quikkred
              </span>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold tracking-[0.14em] uppercase">
                <TrendingUp className="w-3.5 h-3.5" /> Daily-ladder STPL
              </div>
              <h3 className="mt-3 font-sora font-bold text-2xl text-slate-900">
                {NPA_COMPARE.ladder.label}
              </h3>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-slate-600">NPA target</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {NPA_COMPARE.ladder.npa}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${NPA_BAR(NPA_COMPARE.ladder.npa)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm pt-2">
                  <div className="rounded-xl bg-white border border-emerald-100 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-700/80 font-semibold">
                      Avg outstanding
                    </div>
                    <div className="mt-1 font-bold text-slate-900 tabular-nums">
                      {NPA_COMPARE.ladder.avgOutstanding}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white border border-emerald-100 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-700/80 font-semibold">
                      Default signal
                    </div>
                    <div className="mt-1 font-bold text-slate-900">
                      {NPA_COMPARE.ladder.signal}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                  <Activity className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                  Capital recycle: <strong>{NPA_COMPARE.ladder.recycle}</strong>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="mt-8 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Less NPA × cheaper collection × more loans per kirana = a margin profile traditional STPL
            lenders structurally cannot match.
          </p>
        </div>
      </section>

      {/* ---------------- UNIT ECONOMICS ---------------- */}
      <section id="unit-economics" className="bg-[#F8FAFB] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-emerald-700">
              Unit economics
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              Revenue per ₹50,000 loan: <span className="text-emerald-600">₹20,900</span>
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              A worked example. Real loans on the platform range ₹2,000 – ₹50,000 across 3 – 30 day
              tenors. The shape stays the same: platform fee at disbursal, reducing-balance interest
              over tenor, GST on the fee.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Revenue stack */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.14em] font-bold text-slate-500">
                  Revenue stack · gross
                </div>
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="mt-2 font-sora font-bold text-lg text-slate-900">
                Where the ₹20,900 comes from
              </h3>
              <div className="mt-5 space-y-3">
                {REVENUE_STACK.map((r) => (
                  <div key={r.label} className="border-b border-dashed border-slate-200 pb-3 last:border-0">
                    <div className="flex items-baseline justify-between">
                      <div className="text-sm font-semibold text-slate-800">{r.label}</div>
                      <div className="font-bold text-slate-900 tabular-nums">{r.value}</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.note}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(parseFloat(r.value.replace(/[^\d]/g, "")) / 20900) * 100}%`,
                          background: r.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase text-emerald-700">
                    Net contribution (post-cost)
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <div className="text-3xl font-bold text-emerald-800 tabular-nums">₹18,587</div>
                  <div className="text-sm text-emerald-700 font-semibold">37.2% margin</div>
                </div>
              </div>
            </motion.div>

            {/* Cost stack */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.14em] font-bold text-slate-500">
                  Cost stack · per loan
                </div>
                <Coins className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="mt-2 font-sora font-bold text-lg text-slate-900">
                Where the money goes
              </h3>
              <div className="mt-5 space-y-3">
                {COST_STACK.map((c) => (
                  <div key={c.label} className="border-b border-dashed border-slate-200 pb-3 last:border-0 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{c.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{c.note}</div>
                    </div>
                    <div className="font-bold text-slate-900 tabular-nums text-sm shrink-0">
                      {c.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 leading-relaxed">
                Acquisition cost is the single biggest moat. ₹0 via kirana means the entire CAC pool
                belongs to the digital channel — which is itself optimised against an SEO-led
                long-tail at ₹40 / converted lead.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- MOATS · 4 ---------------- */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-emerald-700">
              Four moats · compounding
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              Risk · Distribution · Collection · Tech.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Each moat alone is interesting. Stacked, they create a margin profile no traditional
              STPL lender can replicate without rebuilding their core ledger.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOATS.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 hover:border-slate-300 hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.12)] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl grid place-items-center shrink-0"
                      style={{ background: `${m.accent}14`, color: m.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: m.accent }}>
                        0{i + 1} · {m.title.split(" ").slice(-2).join(" ")}
                      </div>
                      <h3 className="mt-1 font-sora font-bold text-lg text-slate-900">{m.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{m.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- CAPITAL INSTRUMENTS ---------------- */}
      <section className="bg-[#F8FAFB] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-emerald-700">
              Capital architecture
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              Four ways to deploy capital — all RBI-aligned, all on the same NBFC spine.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Loans originated on the platform are lent by <strong>Satsai Finlease Private Limited</strong> (RBI
              NBFC Reg. B-14.01646). Fluxusforge Technologies operates the LSP stack. Quikkred is the
              brand and product surface. Each instrument plugs into that spine differently.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {CAPITAL_INSTRUMENTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.color} p-6 sm:p-7`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl bg-white/70 grid place-items-center ${c.text}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500">
                      0{i + 1}
                    </div>
                  </div>
                  <h3 className="mt-4 font-sora font-bold text-xl text-slate-900">{c.name}</h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-baseline justify-between border-b border-dashed border-slate-300/60 pb-1.5">
                      <dt className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Tenor</dt>
                      <dd className="font-semibold text-slate-900">{c.tenor}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-dashed border-slate-300/60 pb-1.5">
                      <dt className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Min</dt>
                      <dd className="font-semibold text-slate-900">{c.min}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-dashed border-slate-300/60 pb-1.5">
                      <dt className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Return</dt>
                      <dd className="font-semibold text-slate-900">{c.return}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Risk:</strong> {c.risk}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Best fit:</strong> {c.fit}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- DISTRIBUTION B2B2B2C ---------------- */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-indigo-700">
              The distribution
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              B2B2B2C — a chain a bank cannot run.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Four roles, regulated under RBI DLD-2025. The NBFC holds capital and risk. The
              platform owns the rails. The distributor owns a region. The kirana owns the borrower
              relationship. The borrower is the only one who sees a single brand.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="mt-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4">
              {[
                {
                  step: "01",
                  role: "NBFC",
                  name: "Satsai Finlease",
                  body: "Holds the lending licence. Books the loan on its balance sheet. Carries credit risk. Issues the dynamic UPI VA for collections.",
                  icon: Building2,
                  accent: "from-slate-50 to-slate-100",
                  ring: "border-slate-200",
                },
                {
                  step: "02",
                  role: "Platform",
                  name: "Quikkred (via Fluxusforge LSP)",
                  body: "Brand surface. Product. The ladder OS that drives daily collection. KYC, risk engine, fraud, ledger. Auditable WORM trail.",
                  icon: Cpu,
                  accent: "from-indigo-50 to-indigo-100",
                  ring: "border-indigo-200",
                },
                {
                  step: "03",
                  role: "Distributor",
                  name: "Regional partner",
                  body: "Onboards kiranas. Trains, audits, supports. Earns 1% direct origination + 30% override on kirana commission. 1 distributor per district by design.",
                  icon: Network,
                  accent: "from-cyan-50 to-cyan-100",
                  ring: "border-cyan-200",
                },
                {
                  step: "04",
                  role: "Kirana spoke",
                  name: "Neighbourhood retailer",
                  body: "Sources micro-loans at counter. Never touches rupees — flow is through Satsai's dynamic QR. Earns 0.75% net on cleared paise.",
                  icon: Store,
                  accent: "from-emerald-50 to-emerald-100",
                  ring: "border-emerald-200",
                },
              ].map((n, i) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.role}
                    className={`relative rounded-2xl border ${n.ring} bg-gradient-to-br ${n.accent} p-5 sm:p-6`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500">
                        {n.step}
                      </div>
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.14em] font-bold text-slate-500">
                      {n.role}
                    </div>
                    <div className="mt-1 font-sora font-bold text-base text-slate-900">{n.name}</div>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{n.body}</p>
                    {i < 3 && (
                      <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- FUND DEPLOYMENT ---------------- */}
      <section className="bg-[#F8FAFB] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-emerald-700">
              Fund deployment plan
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              How committed capital is put to work.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              60% goes directly to AUM growth. Everything else is in service of that — distribution
              throughput, the ladder OS that lets us run the book, and the compliance + audit
              posture that keeps the licence safe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="mt-10 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8"
          >
            {/* Bar */}
            <div className="flex h-10 rounded-xl overflow-hidden border border-slate-200">
              {FUND_DEPLOYMENT.map((f, i) => {
                const colors = ["#10b981", "#6366f1", "#06b6d4", "#f59e0b", "#94a3b8"];
                return (
                  <div
                    key={f.label}
                    style={{ width: `${f.pct}%`, background: colors[i] }}
                    className="h-full flex items-center justify-center text-white text-[10px] font-bold tracking-wider"
                  >
                    {f.pct >= 8 && `${f.pct}%`}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {FUND_DEPLOYMENT.map((f, i) => {
                const colors = ["#10b981", "#6366f1", "#06b6d4", "#f59e0b", "#94a3b8"];
                return (
                  <div
                    key={f.label}
                    className="rounded-xl bg-slate-50 border border-slate-200 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: colors[i] }}
                      />
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{f.pct}%</span>
                    </div>
                    <div className="mt-1.5 text-xs font-semibold text-slate-800">{f.label}</div>
                    <div className="mt-1 text-[11px] text-slate-500 leading-snug">{f.note}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- COMPLIANCE & GOVERNANCE ---------------- */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-indigo-700">
              Compliance & governance
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              Built on the latest RBI directions, not retrofitted to them.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              The stack was designed in 2025–26 against DLD-2025, CLA-2025, and DPDP. Every spoke
              and partner agreement carries a DPA. A designated DPO is appointed. The audit trail is
              WORM, monitored, and queryable.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMPLIANCE.map((c) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 grid place-items-center shrink-0">
                  <Shield className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-600">
                    {c.code}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800 leading-snug">
                    {c.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-[#F8FAFB] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-emerald-700">
              Frequently asked · investor-side
            </div>
            <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl text-slate-900 leading-tight">
              The questions every credit committee asks first.
            </h2>
          </motion.div>

          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-start justify-between gap-4">
                  <span className="font-sora font-semibold text-slate-900 text-base leading-snug pr-2">
                    {f.q}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 sm:px-6 pb-6 -mt-1 text-sm text-slate-600 leading-relaxed">
                  {f.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- DATA ROOM CTA ---------------- */}
      <section id="data-room" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-3xl bg-[#060914] text-slate-100 p-8 sm:p-12 lg:p-16"
          >
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.22), transparent 45%)",
              }}
            />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-emerald-300">
                <Lock className="w-3 h-3 inline -mt-0.5 mr-1" /> NDA-gated · data room
              </div>
              <h2 className="mt-4 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Ready to look under the hood?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                The data room contains: audited financials, portfolio vintage analysis, NPA
                trajectory, capital stack, draft term sheets, the live monitoring dashboard, and
                detailed regulatory mapping. Access is gated by NDA and credit-committee
                introduction.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact?topic=investor-relations"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  Schedule a conversation <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:investors@quikkred.com?subject=Data%20room%20access%20request"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-sm transition-all"
                >
                  <Mail className="w-4 h-4" /> investors@quikkred.com
                </a>
              </div>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                {[
                  { icon: Briefcase, label: "Audited financials" },
                  { icon: BarChart3, label: "Vintage & NPA curves" },
                  { icon: FileSpreadsheet, label: "Term sheets" },
                  { icon: Activity, label: "Live ops dashboard" },
                ].map((d) => {
                  const Icon = d.icon;
                  return (
                    <div
                      key={d.label}
                      className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-2.5"
                    >
                      <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span className="text-xs text-slate-300">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <p className="mt-8 text-center text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Loans originated on the Quikkred platform are lent by Satsai Finlease Private Limited
            (RBI Reg. B-14.01646). Fluxusforge Technologies operates the Lending Service Provider
            (LSP) stack. Capital deployment is subject to credit committee approval, successful
            Enhanced Due Diligence, and execution of definitive documentation. Governed by RBI
            (Digital Lending) Directions, 2025 · Co-Lending Arrangements Directions, 2025 · DPDP
            Act 2023 + Rules 2025. Investor queries:{" "}
            <a href="mailto:investors@quikkred.com" className="text-emerald-700 underline">
              investors@quikkred.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
