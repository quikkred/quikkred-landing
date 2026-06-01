"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Store,
  Cpu,
  Landmark,
  Users,
  QrCode,
  Smartphone,
  MapPin,
  Languages,
  Handshake,
  Gauge,
  Info,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  Receipt,
  BookOpen,
  FileCheck,
  Network,
  Download,
} from "lucide-react";

interface RiskItem {
  title: string;
  mitigation: string;
}

export default function ProprietorNetworkPage() {
  const journeySteps = [
    {
      n: 1,
      title: "Onboarding (30 minutes)",
      blurb:
        "Individual KYC (PAN + Aadhaar OTP + selfie), shop verification by gig field agent, 2 references, bank account, tripartite eSign. Proprietor is on Satsai's List of LSPs within 2 working days.",
      icon: FileCheck,
    },
    {
      n: 2,
      title: "Training + Fair Practices Code",
      blurb:
        "Online module in preferred language: FPC, collections conduct, DPDP basics, fraud red-flags, grievance handling. Completion certificate stored.",
      icon: BookOpen,
    },
    {
      n: 3,
      title: "Virtual Account + Dynamic QR provisioned",
      blurb:
        "Each proprietor gets a Satsai-backed VA (Razorpay / Cashfree / Decentro / M2P) + rotating UPI QR token. Counter poster auto-generated with grievance numbers in vernacular.",
      icon: QrCode,
    },
    {
      n: 4,
      title: "First loan sourcing",
      blurb:
        "Proprietor triggers application; borrower's own phone completes KYC (Aadhaar OTP + geo-selfie + bureau + bank penny-drop). Underwriting runs on Satsai credit policy. eSigned vernacular KFS issued.",
      icon: Users,
    },
    {
      n: 5,
      title: "Repayment at the counter",
      blurb:
        "Borrower scans the shop QR. UPI credit lands in Satsai master CASA, auto-tagged to proprietor + loan. Proprietor sees live collection in app. Commission accrues.",
      icon: Banknote,
    },
    {
      n: 6,
      title: "Monthly commission payout",
      blurb:
        "Satsai pays proprietor directly to personal bank with TDS 194H @ 5% deducted. Form 26Q filed quarterly. Commission invoice trail preserved for audit.",
      icon: Receipt,
    },
  ];

  const risks: RiskItem[] = [
    {
      title: "Local coercion of borrower",
      mitigation:
        "FPC e-training + audio-recorded consent at origination + random mystery-borrower audits + vernacular grievance poster at counter.",
    },
    {
      title: "Ghost-loan fraud",
      mitigation:
        "Borrower video KYC + Aadhaar OTP + geo-tagged selfie + bank penny-drop to borrower's own account (never the proprietor's). Per-proprietor disbursal cap ramps with tenure.",
    },
    {
      title: "Off-platform QR diversion",
      mitigation:
        "Satsai issues daily-rotated signed-token QR. Proprietor app renders only the authorised QR. Book-outstanding vs collection lag anomaly detection.",
    },
    {
      title: "Over-concentration on one proprietor",
      mitigation:
        "Per-proprietor portfolio caps. Book auto-distributes across 2+ proprietors in same cluster post-threshold. Fluxusforge tele-collections absorbs if a proprietor exits.",
    },
    {
      title: "Paying on behalf of defaulting borrower",
      mitigation:
        "UPI-sender VPA mismatch vs loan holder detected; flagged for review. DPD logic unchanged; credit signal preserved.",
    },
    {
      title: "Raw PII at the counter",
      mitigation:
        "Origination runs on borrower's own device. Proprietor dashboard shows masked identifiers only. DPDP data minimisation enforced in API layer.",
    },
    {
      title: "AML / PMLA conduit",
      mitigation:
        "Full KYC as LSP + CKYC pull + STR pattern monitoring + periodic AML re-screen. Proprietor listed on Satsai's public List of LSPs — transparency is a control.",
    },
    {
      title: "Device compromise / proprietor incapacitation",
      mitigation:
        "Device binding + remote wipe + session kill-switch. Nominee clause in tripartite for incapacitation; book fails over to nearest proprietor + Fluxusforge.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F5F5]">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden bg-[#0E2920] text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(1100px 500px at 15% 20%, rgba(255,156,112,0.35), transparent 60%), radial-gradient(900px 400px at 85% 85%, rgba(37,177,129,0.3), transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Link
            href="/our-partners"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to partners
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold tracking-wide uppercase mb-5">
              <Network className="w-3.5 h-3.5 text-[#FF9C70]" />
              B2B2B2C — proprietor sub-agent network
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-[1.1] mb-5">
              Reach <span className="text-[#FF9C70]">last-mile retail borrowers</span> — through
              community retailers, not sales teams.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-3xl mb-7">
              Under any of your four partner tracks, you can deploy a network of proprietor
              sub-agents — neighbourhood retail outlets, local market aggregators, transport-hub
              operators — who source micro-loans to micro-enterprise owners, gig-income workers
              and small traders. Every rupee flows through Satsai's dynamic QR. Proprietors never touch cash.
              The DLD-2025 fund-flow rule is unbroken.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/partners/proprietor-network/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF9C70] hover:bg-[#E36229] transition-colors rounded-xl font-semibold text-[#0E2920] shadow-lg"
              >
                Apply — Become a Distributor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://api.quikkred.in/api/apk/download/b2b-app?channel=release"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-white/90 transition-colors rounded-xl font-semibold text-[#0E2920] shadow-lg"
              >
                <Download className="w-4 h-4" />
                Download Quikkred Collect
              </a>
              <a
                href="mailto:partnerships@quikkred.in"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white"
              >
                Talk to our BD team
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── 4-LAYER STACK ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#FFEBD1] text-[#E36229] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            The architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            Four layers, one regulatory anchor
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Satsai is the only RBI-regulated entity in the chain. Every other layer
            contracts back to Satsai directly — no nested sub-LSP accountability gap.
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              n: 1,
              role: "Regulated Entity (NBFC)",
              name: "Satsai Finlease Pvt Ltd",
              tone: "bg-[#FFEBD1] border-[#E36229]/30 text-[#E36229]",
              detail: "RBI Reg. B-14.01646. Licence, balance sheet, credit sanction, CIC reporting, grievance final escalation.",
              icon: Landmark,
            },
            {
              n: 2,
              role: "Primary LSP (Pvt Ltd)",
              name: "You — under any T1 / T2 / T3 / T4 track",
              tone: "bg-[#D3F1EB] border-[#1F8F68]/30 text-[#1F8F68]",
              detail: "Tech platform, onboarding + monitoring of proprietor network, monthly commission payouts, reconciliation, first-line grievance — all under Satsai's MSA.",
              icon: Cpu,
            },
            {
              n: 3,
              role: "Proprietor sub-agent (individual / sole-prop)",
              name: "Proprietor A — retail outlet / market aggregator / transport-hub operator",
              tone: "bg-[#DAE6FF] border-[#4A66FF]/30 text-[#4A66FF]",
              detail: "LSP sub-category DSA + Recovery Agent. Sources borrowers, displays rotating Satsai QR at counter, first-line grievance intake. Never touches funds. Tripartite contract with Satsai + Primary LSP.",
              icon: Store,
            },
            {
              n: 4,
              role: "End borrower",
              name: "Borrower A — micro-enterprise owner / gig-income worker / informal-sector self-employed",
              tone: "bg-[#F5F5F5] border-gray-300 text-gray-700",
              detail: "Scans counter QR → UPI → lands in Satsai master CASA auto-tagged to proprietor. Repayment in daily / weekly micro-EMI cadence.",
              icon: Users,
            },
          ].map((l, i) => {
            const Icon = l.icon;
            const isLast = i === 3;
            return (
              <div key={l.n}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl border p-5 sm:p-6 ${l.tone}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 border border-current/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-75">
                          Layer {l.n}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider opacity-75">
                          · {l.role}
                        </span>
                      </div>
                      <h3 className="font-bold font-sora text-gray-900 text-base sm:text-lg mb-1.5">
                        {l.name}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {l.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
                {!isLast && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Why this isn't sub-LSP */}
        <div className="mt-10 bg-[#DAE6FF] border-l-4 border-[#4A66FF] rounded-2xl p-5 sm:p-6 flex items-start gap-4">
          <Info className="w-6 h-6 text-[#4A66FF] mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold font-sora text-gray-900 mb-1">
              Why this is not a prohibited "sub-LSP chain"
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              RBI's concern with nested LSP structures is the accountability gap — the RE
              doesn't know who's actually fronting the customer. We neutralise that with a
              <span className="font-semibold"> tripartite Proprietor Services Agreement</span>:
              Satsai + Primary LSP + Proprietor, all named parties. Proprietor is listed
              on Satsai's public List of LSPs within 2 working days of go-live, per
              DLD 2025. Every proprietor is knowable, contracted and audit-able by Satsai
              directly — even when the Primary LSP runs day-to-day operations.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── MONEY FLOW ───────────────── */}
      <section className="bg-[#0E2920] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 border border-white/15 text-[#FF9C70] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              <QrCode className="w-3.5 h-3.5" />
              Money flow
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3">
              The borrower scans the proprietor's QR. Money lands in Satsai. Every time.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 font-mono text-xs sm:text-sm text-white/85 overflow-x-auto">
              <pre className="whitespace-pre">{`Satsai master CASA (@ ICICI / HDFC / Axis)
                  ▲
                  │ every inbound tagged with
                  │ proprietorId + loanId
                  │
   ┌──────────────┴──────────────┐
   │  VA + Dynamic QR infra      │
   │  Razorpay / Cashfree /      │
   │  Decentro / M2P             │
   └──────────────┬──────────────┘
                  │
Per-proprietor:   │
• VA IFSC +       │
  10-digit number │
• UPI QR with     │
  rotating signed │
  token           │
                  │
Borrower scans proprietor's counter QR
      │
      └─► UPI → Satsai CASA
            ref: PROP-0007-LOAN-ABC

Disbursal:  Satsai → borrower's bank / VPA
Commission: Satsai → proprietor's bank, monthly
            (TDS 194H @ 5%)
Cash:       Not supported in v1`}</pre>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Funds never touch the proprietor",
                  blurb:
                    "UPI lands directly in Satsai's CASA. Proprietor app shows receipt of the credit; no pass-through account exists. DLD 2025 fund-flow rule fully respected.",
                },
                {
                  title: "Auto-attribution in Satsai's ledger",
                  blurb:
                    "Each VA + QR encodes proprietorId + loanId in the UPI reference, auto-credited to the right sub-ledger in real time.",
                },
                {
                  title: "Multi-vendor VA fallback",
                  blurb:
                    "Primary VA provider + standby second vendor (different bank rails). If one goes down, QR auto-switches.",
                },
                {
                  title: "Rotating QR token (anti-diversion)",
                  blurb:
                    "Each proprietor's QR is a signed token rotated daily. Off-platform QR attempts are detected by book-outstanding vs collection lag anomaly checks.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl bg-white/5 border border-white/10 p-5"
                >
                  <h3 className="font-semibold font-sora text-white text-sm mb-1.5">
                    {c.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    {c.blurb}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── PROPRIETOR JOURNEY ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Proprietor lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            From first handshake to first EMI in one counter
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Tech-led, vernacular, scalable. Target: 30-minute onboarding; first loan
            sourced the same day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journeySteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#E36229] hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-start gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#FFEBD1] text-[#E36229] font-bold flex items-center justify-center text-sm">
                      {s.n}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-4 h-4 text-[#E36229]" />
                      <h3 className="font-bold font-sora text-gray-900 text-base">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.blurb}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────────────── PRODUCT FIT ───────────────── */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-white text-[#1F8F68] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Product fit
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              A different product for a different customer
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Existing STPL does not fit last-mile retail borrowers. We engineer a distinct
              micro-loan construct under Satsai's credit policy.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-100">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-[#0E2920] text-white/80 text-xs uppercase tracking-wider font-semibold">
                    Attribute
                  </th>
                  <th className="p-4 text-left bg-[#1F8F68] text-white text-xs uppercase tracking-wider font-semibold">
                    STPL (existing Quikkred)
                  </th>
                  <th className="p-4 text-left bg-[#E36229] text-white text-xs uppercase tracking-wider font-semibold">
                    Proprietor-sourced micro
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Typical ticket", "Mid-range personal", "Micro"],
                  ["Tenure", "7 / 15 / 30 / 60 / 90 days", "14 / 30 / 45 / 60 days"],
                  ["Repayment cadence", "Bullet / monthly", "Daily / weekly / bi-weekly (cashflow-matched)"],
                  ["KFS language", "English + 12 Indian", "Vernacular-first, 13 Indian"],
                  ["KYC", "Aadhaar OTP + bureau-led", "Aadhaar OTP + geo-selfie + penny-drop; thin bureau tolerated"],
                  ["Disbursal channel", "Borrower's bank account", "Borrower's bank / UPI VPA"],
                  ["Repayment channel", "UPI / NACH", "UPI at proprietor's QR (primary)"],
                  ["Segment", "Salaried + self-employed urban", "Micro-enterprise owner, informal-sector self-employed, small trader"],
                  ["PSL eligibility", "Case-by-case", "Weaker Sections / Micro — typically eligible"],
                ].map(([attr, stpl, micro], i) => (
                  <tr
                    key={attr}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"}
                  >
                    <td className="p-3.5 font-medium text-gray-900 border-b border-gray-100">
                      {attr}
                    </td>
                    <td className="p-3.5 text-gray-700 border-b border-gray-100">{stpl}</td>
                    <td className="p-3.5 text-gray-700 border-b border-gray-100">
                      {micro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-500 max-w-3xl mx-auto text-center leading-relaxed">
            The micro-loan product is PSL-eligible under RBI's Priority Sector Master
            Direction — which opens a Priority Sector Lending Certificate (PSLC) sale to
            banks, providing an additional revenue stream on top of the interest spread.
          </p>
        </div>
      </section>

      {/* ───────────────── TAX + COMMISSION ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#DAE6FF] text-[#4A66FF] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Proprietor economics
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            Commission, TDS, GST — who pays what, who owes what
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: "Sourcing commission",
              blurb:
                "One-time, at disbursal. Paid monthly by Satsai to proprietor's personal bank. TDS u/s 194H @ 5% deducted if annual commission > ₹15,000.",
              icon: Banknote,
            },
            {
              title: "Collection commission",
              blurb:
                "Recurring, linked to each successful EMI credit. Accrues daily in the proprietor ledger; settles monthly.",
              icon: Receipt,
            },
            {
              title: "Performance bonus + claw-back",
              blurb:
                "Bonus for high on-time-rate. Claw-back of sourcing commission on early default — protects against mis-sourcing.",
              icon: Gauge,
            },
            {
              title: "GST at proprietor level",
              blurb:
                "Unregistered proprietors (turnover < ₹20 L) charge no GST. Registered proprietors charge 18%; Satsai absorbs as cost (no ITC, consistent with §5a). Budgeted into commission commercials.",
              icon: FileCheck,
            },
          ].map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DAE6FF] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#4A66FF]" />
                </div>
                <h3 className="font-semibold font-sora text-gray-900 mb-1.5 text-base">
                  {e.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{e.blurb}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 bg-[#D3F1EB] border-l-4 border-[#1F8F68] rounded-2xl p-5 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-[#1F8F68] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-800 leading-relaxed">
            Satsai's revenue remains 100% interest (exempt from GST output). Proprietor
            commission is a cost line, not a revenue line. Our engineered
            <span className="font-semibold"> zero-GST-output posture on revenue </span>
            is preserved. ITC leakage on the commission input is priced into the interest
            spread.
          </p>
        </div>
      </section>

      {/* ───────────────── RISK REGISTER ───────────────── */}
      <section className="bg-[#0E2920] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/15 text-[#FF9C70] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              Risks we actively manage
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3">
              Proprietor-layer risks + controls
            </h2>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl mx-auto">
              The 8 risks most likely to break a proprietor network — and the specific
              technical + contractual controls that catch them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FF9C70]/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#FF9C70] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold font-sora text-white mb-1.5 text-sm">
                      {r.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {r.mitigation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── COMPLIANCE STRIP ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
        <div className="rounded-2xl bg-white border border-gray-100 p-6 sm:p-8">
          <h3 className="font-bold font-sora text-gray-900 mb-4 text-center">
            The regulatory corpus for this layer
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
            {[
              "RBI (Digital Lending) Directions, 2025 — DLA registration, LSP listing, fund-flow, KFS",
              "RBI Master Direction on Outsourcing of IT / Financial Services (2017, updated 2023)",
              "RBI Fair Practices Code — Satsai FPC binds every proprietor directly",
              "RBI Recovery Agents Guidelines — no harassment, no 8pm–7am calls",
              "KYC Master Direction (updated 2024) — individual KYC for proprietor",
              "DPDP Act 2023 + DPDP Rules 2025 — Satsai Data Fiduciary, proprietor Data Processor",
              "PMLA + FIU-IND — STR / CTR monitoring on proprietor activity",
              "Income Tax Act Section 194H — TDS on commission @ 5%",
              "GST — SAC 997158, applicability per proprietor turnover threshold",
              "RBI PSL Master Direction — loan tagging for potential PSLC sale upside",
            ].map((c) => (
              <div
                key={c}
                className="flex items-start gap-2 bg-[#F5F5F5] rounded-xl px-3.5 py-3 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25B181] mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E36229] to-[#FF9C70] p-10 sm:p-14 text-white">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(600px 300px at 90% 10%, rgba(255,255,255,0.25), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora leading-tight mb-4 max-w-2xl">
              Ready to reach the last-mile borrower?
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-7 max-w-2xl">
              Two ways in: apply as a <b>Distributor</b> if you can recruit and manage
              a cluster of proprietor shops, or as a <b>Primary LSP</b> if you want to
              operate the network platform itself under any of the four partner tracks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/partners/proprietor-network/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#E36229] hover:bg-[#FFF4E4] transition-colors rounded-xl font-semibold shadow-lg"
              >
                Apply as a Distributor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/partners/lending-partner-program/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white"
              >
                Apply as a Primary LSP
              </Link>
              <Link
                href="/our-partners"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white"
              >
                Back to partner overview
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8 max-w-3xl mx-auto leading-relaxed">
          Proprietor onboarding is governed by the Tripartite Proprietor Services
          Agreement (Satsai + Primary LSP + Proprietor). Proprietors are listed on
          Satsai's public List of LSPs within 2 working days of go-live, as required by
          RBI (Digital Lending) Directions, 2025. Satsai remains the lender of record on
          every KFS and loan agreement. Grievances:{" "}
          <Link href="/grievance-redressal-policy" className="underline hover:text-[#1F8F68]">
            Grievance Redressal Policy
          </Link>
          {" "}·{" "}
          <Link href="/nodal-officer" className="underline hover:text-[#1F8F68]">
            Nodal Officer
          </Link>
          . Final escalation: RBI Integrated Ombudsman (cms.rbi.org.in).
        </p>
      </section>
    </div>
  );
}
