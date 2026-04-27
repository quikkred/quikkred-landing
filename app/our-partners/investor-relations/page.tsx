'use client';

import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Award,
  Cpu,
  Handshake,
  Phone,
  Mail,
  Headphones,
  Building2,
  Store,
  Users,
  ArrowRight,
  BadgeCheck,
  Lock,
  Database,
  ShieldCheck,
  Scale,
  Network,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import OurPartners from "@/components/OurPartners";

interface PathCard {
  tag: string;
  title: string;
  tagline: string;
  blurb: string;
  href: string;
  cta: string;
  icon: React.ComponentType<any>;
  flagship?: boolean;
  gradient?: string;
}

const PATHS: PathCard[] = [
  {
    tag: "B2B2C · Flagship",
    title: "Lending Partner Program",
    tagline: "Your brand, your customers, your capital. Our NBFC, our tech, our compliance.",
    blurb:
      "Private Limited companies plug into the same stack that runs Quikkred — Satsai Finlease as the lender of record, Fluxusforge's tech, our RBI-aligned compliance. Four tracks from pure sourcing (T1) to capital deployment via NCD (T2), co-lending for NBFCs (T3), and seasoned-portfolio purchase (T4).",
    href: "/partners",
    cta: "Explore the program",
    icon: Building2,
    flagship: true,
    gradient: "from-[#0E2920] to-[#144B37]",
  },
  {
    tag: "B2B2B2C · Deep-retail",
    title: "Proprietor Network",
    tagline: "Reach last-mile retail borrowers — through community retailers, not sales teams.",
    blurb:
      "Under any partner track, deploy a network of proprietor sub-agents — neighbourhood retail outlets, local market aggregators, transport-hub operators — who source micro-loans. Funds always flow through Satsai's dynamic QR at the counter; proprietors never touch rupees. RBI-aligned under DLD 2025.",
    href: "/partners/proprietor",
    cta: "See the architecture",
    icon: Network,
    flagship: true,
    gradient: "from-[#1F8F68] to-[#25B181]",
  },
  {
    tag: "DSA",
    title: "Channel Partner",
    tagline: "Earn commissions on loans you source — with real dashboards and weekly payouts.",
    blurb:
      "Loan sourcing agents earning 1.5–3% commission on disbursals. Real-time dashboard for applications, approvals, earnings. Training and certification included. No upfront cost, pan-India coverage.",
    href: "/channel-partner",
    cta: "Join the network",
    icon: Handshake,
  },
  {
    tag: "Field operations",
    title: "Collection Partner",
    tagline: "Modernised field-agent platform — no cash handling, only Satsai-owned payment links.",
    blurb:
      "Work the collections queue on a mobile app. Geo-tagged check-ins, DPD-prioritised cases, Truecaller login, expense claims. Borrower repayments flow through Satsai-issued payment links — agents never touch cash (DLD 2025 requirement).",
    href: "/collect-partner",
    cta: "Apply as a field agent",
    icon: Store,
  },
  {
    tag: "Capital",
    title: "Investor Relations",
    tagline: "Back a high-growth, compliance-first digital NBFC.",
    blurb:
      "Quikkred operates on Satsai Finlease (RBI NBFC Reg. B-14.01646) with Fluxusforge as the LSP. Structured investment opportunities via NCDs, term debt, or direct equity. Monthly MIS, quarterly portfolio reviews, DPDP-compliant data room.",
    href: "/our-partners/investor-relations",
    cta: "See investment deals",
    icon: TrendingUp,
  },
];

const TRUST_BADGES = [
  { label: "Satsai Finlease — RBI NBFC Reg. B-14.01646", icon: BadgeCheck },
  { label: "RBI (Digital Lending) Directions, 2025 aligned", icon: ShieldCheck },
  { label: "DPDP Act 2023 — DPO appointed, DPA with every partner", icon: Database },
  { label: "ISO 27001 (in progress) · CERT-In VAPT empanelled", icon: Lock },
];

const WHY_POINTS = [
  {
    icon: Shield,
    title: "Regulatory spine, not red tape",
    blurb:
      "Every partner onboarded passes EDD against RBI's 2024 KYC Master Direction, DLD 2025 fund-flow rules, and DPDP Act 2023. You inherit that compliance posture from day one.",
  },
  {
    icon: Cpu,
    title: "Production stack, zero NBFC overhead",
    blurb:
      "BRE, KFS, disbursal, repayment, collections — all run on Fluxusforge's stack. You focus on the customer, we handle the regulated plumbing.",
  },
  {
    icon: Scale,
    title: "FLDG capped at 5% (RBI mandate)",
    blurb:
      "Default Loss Guarantee follows RBI's June 2023 circular as refreshed Feb 2026. Hard-enforced in code — invocations past cap are rejected with a clear error.",
  },
  {
    icon: Award,
    title: "End-to-end audit trail",
    blurb:
      "Hash-chained audit events cover every ledger mutation. Evidence bundles exportable per partner for RBI inspection, bank-FI audit, GST audit, and DPDP annual audit.",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F5F5F5] to-[#D3F1EB]/30 py-12 sm:py-16 lg:py-20">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(800px 400px at 10% 20%, rgba(37,177,129,0.18), transparent 60%), radial-gradient(700px 350px at 90% 90%, rgba(74,102,255,0.12), transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#25B181]/20 rounded-full text-xs font-semibold text-[#1F8F68] uppercase tracking-wide mb-5">
                <ShieldCheck className="w-3.5 h-3.5" />
                RBI-aligned · 5 partnership pathways
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sora text-gray-900 leading-[1.1] mb-5">
                Partner With <span className="text-[#25B181]">Quikkred</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-7 max-w-xl">
                Five regulated pathways to plug into our stack — from deploying your capital via NCDs to sourcing loans at the counter. Whichever path fits you, the regulatory spine is the same: Satsai as the NBFC, Fluxusforge as the LSP, Quikkred as the brand.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="#partnership-paths"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25B181] hover:bg-[#1F8F68] transition-colors rounded-xl font-semibold text-white shadow-lg"
                >
                  Find your path
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:partnerships@quikkred.in"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-300 hover:bg-gray-50 transition-colors rounded-xl font-semibold text-gray-800"
                >
                  Talk to our BD team
                </a>
              </div>

              {/* Trust strip inline under CTAs */}
              <div className="flex flex-wrap gap-2">
                {TRUST_BADGES.slice(0, 2).map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.label}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-gray-200 rounded-lg text-xs text-gray-700"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#1F8F68]" />
                      {b.label}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/Partners_our_image.jpg"
                  alt="Partner with Quikkred"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0E2920]/20 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#25B181]/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#4A66FF]/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────── OUR PARTNERS logos strip ───────────────── */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
          <OurPartners />
        </div>
      </section>

      {/* ───────────────── 5 PARTNERSHIP PATHS ───────────────── */}
      <section id="partnership-paths" className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Pick your pathway
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Five partnership paths, one regulatory anchor
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Whether you're deploying capital, sourcing customers, collecting in the field, or investing — there's a compliant path and a live stack waiting.
            </p>
          </div>

          {/* Flagship pair (full-width cards with dark theme) */}
          <div className="grid lg:grid-cols-2 gap-5 mb-6">
            {PATHS.filter((p) => p.flagship).map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-3xl p-7 sm:p-8 bg-gradient-to-br ${p.gradient} text-white overflow-hidden`}
                >
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(500px 250px at 90% 10%, rgba(255,255,255,0.18), transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/15 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#51C9AF] mb-5">
                      {p.tag}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-[#51C9AF]" />
                    </div>
                    <h3 className="text-2xl font-bold font-sora mb-2">{p.title}</h3>
                    <p className="text-[#51C9AF] italic mb-4 text-sm">{p.tagline}</p>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">{p.blurb}</p>
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 hover:bg-[#D3F1EB] transition-colors rounded-xl font-semibold text-sm"
                    >
                      {p.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Other paths (compact cards) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATHS.filter((p) => !p.flagship).map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#25B181]/30 hover:shadow-lg transition-all flex flex-col"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F8F68] mb-3">
                    {p.tag}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-[#D3F1EB] flex items-center justify-center mb-4 group-hover:bg-[#25B181] transition-colors">
                    <Icon className="w-5 h-5 text-[#1F8F68] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold font-sora text-gray-900 text-lg mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-xs italic text-[#1F8F68] mb-3">{p.tagline}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">
                    {p.blurb}
                  </p>
                  <Link
                    href={p.href}
                    className="inline-flex items-center justify-center gap-2 py-3 bg-[#25B181] hover:bg-[#1F8F68] transition-colors rounded-xl font-semibold text-white text-sm"
                  >
                    {p.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── WHY PARTNER WITH US ───────────────── */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white text-[#1F8F68] border border-[#25B181]/20 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Why Quikkred
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Built for the audit, shipped for the customer
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              The advantage our partners get isn't marketing speed — it's a platform that survives an RBI inspection on a Tuesday morning.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_POINTS.map((pt, i) => {
              const Icon = pt.icon;
              return (
                <motion.div
                  key={pt.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 flex gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#D3F1EB] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#1F8F68]" />
                  </div>
                  <div>
                    <h3 className="font-bold font-sora text-gray-900 mb-1.5">
                      {pt.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{pt.blurb}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Full trust strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRUST_BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.label}
                  className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-3.5 py-3"
                >
                  <Icon className="w-4 h-4 text-[#1F8F68] flex-shrink-0" />
                  <span className="text-xs text-gray-700 leading-tight">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── SUPPORT ───────────────── */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#DAE6FF] text-[#4A66FF] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Talk to us
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Three channels to reach us
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Partnership enquiries are handled by the BD team. Existing partners use the CRM; urgent matters use the helpline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Mail,
                title: "Partnership enquiries",
                value: "partnerships@quikkred.in",
                href: "mailto:partnerships@quikkred.in",
                sub: "New partner applications + commercial discussions",
              },
              {
                icon: Phone,
                title: "Support helpline",
                value: "+91 9311913854",
                href: "tel:+919311913854",
                sub: "Monday–Saturday, 10:00–18:00 IST",
              },
              {
                icon: Headphones,
                title: "Grievance officer",
                value: "Nodal Officer (RBI-CMS)",
                href: "/nodal-officer",
                sub: "15-day SLA · escalation path to RBI Ombudsman",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.a
                  key={c.title}
                  href={c.href}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4A66FF]/30 hover:shadow-md transition-all block"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#DAE6FF] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#4A66FF]" />
                  </div>
                  <h3 className="font-semibold font-sora text-gray-900 mb-1">
                    {c.title}
                  </h3>
                  <p className="text-sm text-[#4A66FF] font-medium mb-1.5">
                    {c.value}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.sub}</p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#25B181] to-[#1F8F68] p-10 sm:p-14 text-white">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(600px 300px at 90% 10%, rgba(255,255,255,0.25), transparent 60%)",
              }}
            />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora leading-tight mb-4 max-w-2xl">
                One stack. Five pathways. Pick yours.
              </h2>
              <p className="text-white/85 text-base sm:text-lg mb-7 max-w-2xl">
                Start the conversation and we'll route you to the right track in under two working days. The platform is live, the compliance is real, the partners are onboarded.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/partners/apply"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#1F8F68] hover:bg-[#D3F1EB] transition-colors rounded-xl font-semibold shadow-lg"
                >
                  Apply to become a partner
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white"
                >
                  Deep-dive the Lending Partner Program
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8 max-w-3xl mx-auto leading-relaxed">
            Loans originated on the Quikkred platform are lent by Satsai Finlease Private Limited (RBI Reg. B-14.01646). Fluxusforge operates the Lending Service Provider (LSP) tech and servicing stack. Partner onboarding is subject to successful Enhanced Due Diligence, risk committee approval and execution of the Master Services Agreement, Data Processing Agreement and (for capital tracks) the NCD Subscription / Debt Facility Agreement. Governed by RBI (Digital Lending) Directions, 2025 · Co-Lending Arrangements Directions, 2025 · DPDP Act 2023 + Rules 2025. Grievances:{" "}
            <Link href="/grievance-redressal-policy" className="underline hover:text-[#1F8F68]">
              Grievance Redressal Policy
            </Link>
            {" "}·{" "}
            <Link href="/nodal-officer" className="underline hover:text-[#1F8F68]">
              Nodal Officer
            </Link>
            . Final escalation: RBI Integrated Ombudsman (cms.rbi.org.in).
          </p>
        </div>
      </section>
    </div>
  );
}