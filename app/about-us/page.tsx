"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Target,
  Users,
  TrendingUp,
  Shield,
  Heart,
  Globe,
  Briefcase,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Landmark,
  Cpu,
  Network,
  ShieldCheck,
  FileText,
  Scale,
  Database,
  Lock,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Quote,
  Asterisk,
} from "lucide-react";
import ContactForm from "@/components/Contact-form";
import {
  COMPANY_ADDRESS,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
  COMPANY_EMAIL_SUPPORT,
} from "@/lib/constants/companyInfo";

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */

const VITALS = [
  { k: "Est.", v: "2018" },
  { k: "RBI Reg.", v: "B-14.01646" },
  { k: "States", v: "28 / 28" },
  { k: "Regulation", v: "DLD 2025" },
  { k: "Entities", v: "3 — stacked" },
  { k: "Audit posture", v: "Tuesday-morning ready" },
];

const VALUES = [
  {
    icon: Heart,
    title: "Customer first",
    blurb:
      "Every decision starts and ends with the borrower's best interest. Not ours. Not the channel partner's. Theirs.",
  },
  {
    icon: Shield,
    title: "Trust & transparency",
    blurb:
      "All-inclusive APR on every Key Fact Statement. No hidden charges, no surprise fees, no fine print that bites in month four.",
  },
  {
    icon: TrendingUp,
    title: "Innovation with discipline",
    blurb:
      "Cutting-edge AI for faster, fairer lending — built on a regulatory-first architecture that survives an RBI inspection on a Tuesday morning.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    blurb:
      "Credit accessible to every Indian — including last-mile borrowers reached through our neighbourhood proprietor network.",
  },
  {
    icon: Award,
    title: "Excellence",
    blurb:
      "The highest standards of service in everything we do — from origination to collections to grievance resolution.",
  },
  {
    icon: Globe,
    title: "Social impact",
    blurb:
      "Empowering communities and contributing to India's economic growth through responsible, PSL-eligible lending.",
  },
];

interface EntityLayer {
  tag: string;
  name: string;
  role: string;
  blurb: string;
  icon: React.ComponentType<any>;
  accent: string;
  ring: string;
  chip: string;
}

const LAYERS: EntityLayer[] = [
  {
    tag: "Layer 01 · Consumer Brand",
    name: "Quikkred",
    role: "Customer-facing identity + product UX",
    blurb:
      "The brand borrowers know. Product strategy, user experience, growth, communication — and the reason someone downloads the app.",
    icon: Building,
    accent: "#4A66FF",
    ring: "ring-[#4A66FF]/25",
    chip: "bg-[#DAE6FF] text-[#4A66FF]",
  },
  {
    tag: "Layer 02 · LSP",
    name: "Fluxusforge",
    role: "Tech stack + credit ops + collections",
    blurb:
      "Business Rules Engine, KYC, Key Fact Statement generation, disbursal rails, payment links, eNACH, DPD tracking, telephony, field collections — all in one production stack.",
    icon: Cpu,
    accent: "#25B181",
    ring: "ring-[#25B181]/25",
    chip: "bg-[#D3F1EB] text-[#1F8F68]",
  },
  {
    tag: "Layer 03 · NBFC (RBI-regulated)",
    name: "Satsai Finlease Private Limited",
    role: "RBI Reg. B-14.01646 — licence, balance sheet, lender of record",
    blurb:
      "Every loan on the Quikkred platform is lent by Satsai Finlease. Credit sanction, bureau reporting, final grievance escalation — Satsai is the Regulated Entity on record for each transaction.",
    icon: Landmark,
    accent: "#E36229",
    ring: "ring-[#E36229]/25",
    chip: "bg-[#FFEBD1] text-[#E36229]",
  },
];

const REGULATORY = [
  {
    title: "RBI (Digital Lending) Directions, 2025",
    ref: "DoR.AML.REC.24/14.10.001/2025-26 · 8 May 2025",
    icon: ShieldCheck,
  },
  {
    title: "RBI Default Loss Guarantee Circular",
    ref: "8 June 2023 · Feb 2026 ECL restoration",
    icon: Scale,
  },
  {
    title: "RBI Co-Lending Arrangements Directions, 2025",
    ref: "Effective 1 January 2026 (RE-to-RE only)",
    icon: FileText,
  },
  {
    title: "RBI KYC Master Direction",
    ref: "Updated 2024 · UBO ≥ 10% declared",
    icon: Users,
  },
  {
    title: "Outsourcing of Financial Services",
    ref: "RBI Master Direction · 2017, updated 2023",
    icon: Cpu,
  },
  {
    title: "DPDP Act 2023 + DPDP Rules 2025",
    ref: "Notified 13 Nov 2025 · phased through May 2027",
    icon: Database,
  },
  {
    title: "NBFC Scale-Based Regulation",
    ref: "RBI SBR Directions 2023 + Feb 2026 amendments",
    icon: Landmark,
  },
  {
    title: "Fair Practices Code + RBI Integrated Ombudsman",
    ref: "End-to-end grievance posture",
    icon: Shield,
  },
];

const TIMELINE = [
  {
    year: "2018",
    title: "Origin",
    body:
      "Quikkred is founded as a digital lending platform built around a simple thesis: the underserved Indian borrower deserves a credit experience designed for them — not retrofitted from a corporate-banking template.",
  },
  {
    year: "2020",
    title: "Stack",
    body:
      "Partnership with Satsai Finlease (RBI Reg. B-14.01646) formalises the lender-of-record relationship. Fluxusforge is incorporated as the licensed Service Provider running the production tech stack.",
  },
  {
    year: "2023",
    title: "Scale",
    body:
      "Pan-India coverage across all 28 states. Origination volume grows 4× on the back of a fully digital, paperless onboarding journey and a Business Rules Engine that approves in under 90 seconds.",
  },
  {
    year: "2025",
    title: "Regulatory rewrite",
    body:
      "RBI's Digital Lending Directions of 8 May 2025 reshape the industry. We rebuild Key Fact Statement generation, grievance routing and consent flows around the new Master Direction — and document everything for audit.",
  },
  {
    year: "2026",
    title: "Partner Platform",
    body:
      "Quikkred Partner Platform launches — a B2B2C and B2B2B2C architecture that lets Private Limited companies plug into the same regulated rails, reaching last-mile borrowers through a neighbourhood proprietor network.",
  },
];

const contactCards = [
  {
    icon: Phone,
    title: "Call",
    description: "Speak to our support team",
    contact: COMPANY_PHONE_DISPLAY,
    link: `tel:${COMPANY_PHONE_TEL}`,
  },
  {
    icon: Mail,
    title: "Write",
    description: "Send your queries anytime",
    contact: COMPANY_EMAIL_SUPPORT,
    link: `mailto:${COMPANY_EMAIL_SUPPORT}`,
  },
  {
    icon: MapPin,
    title: "Visit",
    description: "Our head office",
    contact: COMPANY_ADDRESS,
    link: "https://maps.google.com/?q=Vikrant+Tower+Rajendra+Place+New+Delhi",
  },
];

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAFAF7] text-[#0E2920] overflow-hidden">

      {/* ═══════════════════════════════════════════════════════
          01 · MASTHEAD — Editorial hero
          ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#FAFAF7]">
        {/* Faint blueprint grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#0E2920 1px, transparent 1px), linear-gradient(90deg, #0E2920 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="container mx-auto max-w-7xl relative">
          {/* Masthead bar */}
          <div className="flex items-center justify-between border-b border-[#0E2920]/15 pt-10 pb-4 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#0E2920]/70 font-medium">
            <span>Quikkred · Field Notes</span>
            <span className="hidden sm:inline">Volume 01 / About</span>
            <span>Est. MMXVIII</span>
          </div>

          {/* Title block */}
          <div className="pt-10 sm:pt-16 lg:pt-24 pb-10 sm:pb-16">
            <div className="grid grid-cols-12 gap-4 sm:gap-6 items-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="col-span-12 lg:col-span-8"
              >
                <div className="text-[11px] uppercase tracking-[0.35em] text-[#1F8F68] font-semibold mb-6 flex items-center gap-3">
                  <span className="inline-block w-8 h-px bg-[#1F8F68]" />
                  Chapter 01 · The company
                </div>
                <h1
                  className="font-sora font-black leading-[0.92] tracking-tight text-[#0E2920]"
                  style={{ fontSize: "clamp(2.6rem, 8.5vw, 7.5rem)" }}
                >
                  About
                  <br />
                  <span className="relative inline-block">
                    Quikkred
                    <span
                      aria-hidden
                      className="absolute -top-2 -right-6 text-2xl sm:text-3xl text-[#E36229] font-instrument italic"
                    >
                      *
                    </span>
                  </span>
                  <span
                    className="block font-instrument italic font-normal text-[#1F8F68] mt-2 sm:mt-3"
                    style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.5rem)" }}
                  >
                    a regulated stack,
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    quietly assembled.
                  </span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="col-span-12 lg:col-span-4 lg:pl-6 lg:border-l lg:border-[#0E2920]/15"
              >
                <p className="text-sm sm:text-base leading-[1.7] text-[#0E2920]/75 max-w-md">
                  India's AI-powered digital lending platform, structured as
                  three entities for unambiguous accountability —{" "}
                  <span className="text-[#1F8F68] font-semibold">
                    brand, LSP, NBFC.
                  </span>{" "}
                  Built so credit is accessible, affordable and transparent for
                  every Indian who needs it.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-wider">
                  <Link
                    href="#story"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E2920] text-white rounded-full hover:bg-[#25B181] transition-colors"
                  >
                    Read the story <ArrowDown className="w-3 h-3" />
                  </Link>
                  <Link
                    href="#stack"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0E2920]/25 rounded-full hover:bg-[#0E2920] hover:text-white transition-colors"
                  >
                    See the stack
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Footnote — caption-style asterisk */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 sm:mt-12 max-w-md text-[12px] sm:text-[13px] text-[#0E2920]/55 font-instrument italic leading-relaxed"
            >
              <span className="text-[#E36229] mr-1">*</span>
              loans on the platform are originated by Satsai Finlease Private
              Limited, an NBFC registered with the Reserve Bank of India under
              CoR <span className="not-italic font-sora font-medium">B-14.01646</span>.
            </motion.div>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="border-t border-[#0E2920]/15" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          02 · VITAL SIGNS — Marquee ticker
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#0E2920] text-white py-5 overflow-hidden border-b border-white/10">
        <div className="relative">
          <div className="flex gap-12 sm:gap-16 animate-[marquee_36s_linear_infinite] whitespace-nowrap">
            {[...VITALS, ...VITALS, ...VITALS].map((v, i) => (
              <div
                key={i}
                className="inline-flex items-baseline gap-3 text-base sm:text-lg flex-shrink-0"
              >
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#51C9AF]/80 font-semibold">
                  {v.k}
                </span>
                <span className="font-sora font-bold text-white">{v.v}</span>
                <Asterisk className="w-3 h-3 text-[#51C9AF]/50 ml-4" />
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════════
          03 · THE STORY — Sticky timeline + editorial copy
          ═══════════════════════════════════════════════════════ */}
      <section id="story" className="relative bg-[#FAFAF7] py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Sticky left rail */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="text-[11px] uppercase tracking-[0.35em] text-[#1F8F68] font-semibold flex items-center gap-3">
                  <span className="inline-block w-8 h-px bg-[#1F8F68]" />
                  02 — The story
                </div>
                <h2
                  className="font-sora font-bold leading-[0.95] text-[#0E2920]"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                >
                  From a 2018 idea<br />
                  <span className="font-instrument italic font-normal text-[#E36229]">
                    to a regulated
                  </span>
                  <br />
                  digital NBFC stack.
                </h2>
                <p className="text-[#0E2920]/70 text-sm sm:text-base leading-relaxed max-w-sm">
                  Eight years, three entities and one continuous thesis — that
                  credit, done right, is an act of inclusion.
                </p>

                <div className="hidden lg:block pt-8">
                  <div className="relative rounded-2xl overflow-hidden border border-[#0E2920]/10">
                    <Image
                      src="/about_story_img.jpg"
                      alt="Quikkred story"
                      width={520}
                      height={360}
                      className="object-cover w-full h-auto"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-lg px-3 py-2 flex items-center justify-between text-[11px]">
                      <span className="uppercase tracking-wider text-[#0E2920]/60">
                        Plate 01
                      </span>
                      <span className="font-instrument italic text-[#0E2920]">
                        the building that started it
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="lg:col-span-8 relative">
              {/* Vertical timeline rail */}
              <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[#25B181] via-[#E36229]/40 to-transparent" />

              <ol className="space-y-12 sm:space-y-16">
                {TIMELINE.map((t, i) => (
                  <motion.li
                    key={t.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="relative pl-12 sm:pl-16"
                  >
                    {/* Year node */}
                    <div className="absolute left-0 top-1 flex items-center justify-center">
                      <span className="block w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0E2920] text-white flex items-center justify-center">
                        <span className="block w-2 h-2 bg-[#25B181] rounded-full" />
                      </span>
                    </div>

                    <div className="flex items-baseline gap-4 mb-3">
                      <span
                        className="font-sora font-black text-[#25B181] leading-none"
                        style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                      >
                        {t.year}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.3em] text-[#0E2920]/60 font-semibold">
                        — {t.title}
                      </span>
                    </div>

                    <p className="text-[#0E2920]/80 text-base sm:text-lg leading-relaxed max-w-2xl">
                      {i === 0 && (
                        <span className="float-left font-instrument italic text-[#E36229] text-5xl sm:text-6xl leading-[0.85] mr-2 mt-1">
                          {t.body.charAt(0)}
                        </span>
                      )}
                      {i === 0 ? t.body.slice(1) : t.body}
                    </p>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-12 sm:mt-16 pl-12 sm:pl-16">
                <Link
                  href="/our-partners"
                  className="inline-flex items-center gap-2 text-[#1F8F68] font-semibold border-b-2 border-[#1F8F68]/30 hover:border-[#1F8F68] transition-colors pb-1"
                >
                  Continue reading — the Partner Platform
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          04 · THE STACK — Tri-entity pipeline
          ═══════════════════════════════════════════════════════ */}
      <section
        id="stack"
        className="relative bg-white border-y border-[#0E2920]/10 py-16 sm:py-24"
      >
        {/* Background ledger */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#0E2920 1px, transparent 1px)",
            backgroundSize: "100% 32px",
          }}
        />

        <div className="container mx-auto max-w-7xl relative">
          {/* Section header */}
          <div className="grid lg:grid-cols-12 gap-6 mb-12 sm:mb-16 items-end">
            <div className="lg:col-span-7">
              <div className="text-[11px] uppercase tracking-[0.35em] text-[#1F8F68] font-semibold flex items-center gap-3 mb-5">
                <span className="inline-block w-8 h-px bg-[#1F8F68]" />
                03 — The stack
              </div>
              <h2
                className="font-sora font-bold leading-[0.98] text-[#0E2920]"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                Three entities.{" "}
                <span className="font-instrument italic font-normal text-[#4A66FF]">
                  One
                </span>{" "}
                regulated lending pipeline.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#0E2920]/70 text-base leading-relaxed max-w-md lg:ml-auto">
                Every loan on the Quikkred platform flows through this stack.
                It's how we stay compliant, scalable and unambiguous about who
                does what.
              </p>
            </div>
          </div>

          {/* Pipeline */}
          <div className="relative space-y-4 sm:space-y-5 max-w-5xl mx-auto">
            {LAYERS.map((l, i) => {
              const Icon = l.icon;
              return (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative"
                >
                  <div
                    className={`group relative bg-white border border-[#0E2920]/10 rounded-2xl p-5 sm:p-7 lg:p-8 grid grid-cols-12 gap-4 sm:gap-6 items-center hover:shadow-2xl hover:-translate-y-1 hover:ring-4 ${l.ring} transition-all duration-500`}
                  >
                    {/* Index */}
                    <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                      <div
                        className="font-sora font-black leading-none"
                        style={{
                          fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                          color: l.accent,
                        }}
                      >
                        0{i + 1}
                      </div>
                    </div>

                    {/* Icon column */}
                    <div className="col-span-2 sm:col-span-1 flex justify-center">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${l.accent}15` }}
                      >
                        <Icon
                          className="w-6 h-6 sm:w-7 sm:h-7"
                          style={{ color: l.accent }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="col-span-8 sm:col-span-7">
                      <div
                        className={`inline-block text-[10px] uppercase tracking-[0.25em] font-bold mb-1.5 px-2 py-0.5 rounded-full ${l.chip}`}
                      >
                        {l.tag}
                      </div>
                      <h3 className="font-sora font-bold text-[#0E2920] text-lg sm:text-2xl mb-1 leading-tight">
                        {l.name}
                      </h3>
                      <p
                        className="text-xs sm:text-sm font-instrument italic mb-2"
                        style={{ color: l.accent }}
                      >
                        — {l.role}
                      </p>
                      <p className="text-sm text-[#0E2920]/70 leading-relaxed hidden sm:block">
                        {l.blurb}
                      </p>
                    </div>

                    {/* Arrow column */}
                    <div className="hidden sm:flex col-span-3 justify-end items-center">
                      <div
                        className="text-right"
                        style={{ color: `${l.accent}80` }}
                      >
                        <div className="text-[10px] uppercase tracking-widest mb-1 text-[#0E2920]/50">
                          flows to
                        </div>
                        <div className="font-instrument italic text-base">
                          {i === 0 && "the licensed service provider"}
                          {i === 1 && "the lender of record"}
                          {i === 2 && "the borrower's bank"}
                        </div>
                      </div>
                    </div>

                    {/* Mobile blurb */}
                    <div className="col-span-12 sm:hidden">
                      <p className="text-sm text-[#0E2920]/70 leading-relaxed">
                        {l.blurb}
                      </p>
                    </div>
                  </div>

                  {/* Connector */}
                  {i < LAYERS.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-px h-6 bg-gradient-to-b from-[#0E2920]/30 to-[#0E2920]/10" />
                        <ArrowDown className="w-4 h-4 text-[#0E2920]/40" />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-xs sm:text-sm text-[#0E2920]/50 mt-10 max-w-3xl mx-auto leading-relaxed font-instrument italic">
            This separation — brand, LSP, NBFC — is by design. It keeps
            accountability sharp, makes the compliance posture auditable, and
            mirrors RBI's intent under the Digital Lending Directions, 2025.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          05 · VISION × MISSION — Editorial double-page spread
          ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#FAFAF7] py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
            {/* VISION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative bg-white rounded-3xl overflow-hidden border border-[#0E2920]/10"
            >
              <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.3em] text-[#0E2920]/40 font-semibold">
                04A · Vision
              </div>

              {/* Image with overlay */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src="/about_vision_img.jpg"
                  alt="Our vision"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
              </div>

              <div className="p-7 sm:p-10 lg:p-12">
                <Quote className="w-8 h-8 text-[#E36229] mb-4 -ml-1" />
                <h3
                  className="font-sora font-bold text-[#0E2920] leading-[0.98] mb-5"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}
                >
                  A future where{" "}
                  <span className="font-instrument italic font-normal text-[#1F8F68]">
                    everyone
                  </span>{" "}
                  has the financial tools they need.
                </h3>
                <p className="text-[#0E2920]/70 text-sm sm:text-base leading-relaxed">
                  To be India's most trusted and preferred digital lending
                  platform — empowering millions to achieve their financial
                  aspirations. From salaried borrowers in metros to
                  informal-sector self-employed reaching us through our
                  neighbourhood retail partners.
                </p>
              </div>
            </motion.div>

            {/* MISSION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative bg-[#0E2920] text-white rounded-3xl overflow-hidden p-7 sm:p-10 lg:p-12"
            >
              <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
                04B · Mission
              </div>

              <Target className="w-8 h-8 text-[#51C9AF] mb-6" />

              <h3
                className="font-sora font-bold leading-[0.98] mb-8"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}
              >
                To make that vision{" "}
                <span className="font-instrument italic font-normal text-[#51C9AF]">
                  real,
                </span>{" "}
                we ship three things — every day.
              </h3>

              <ul className="space-y-5">
                {[
                  {
                    n: "I",
                    t: "Innovative, accessible, responsible lending",
                    b: "Products that work for the borrower's life, not the lender's spreadsheet.",
                  },
                  {
                    n: "II",
                    t: "Technology that disappears",
                    b: "A seamless end-to-end customer experience that does not ask the user to understand the plumbing.",
                  },
                  {
                    n: "III",
                    t: "Financial inclusion at scale",
                    b: "Metro and rural. Salaried and self-employed. App-first and assisted at a neighbourhood retail point.",
                  },
                ].map((m) => (
                  <li
                    key={m.n}
                    className="grid grid-cols-12 gap-4 pb-5 border-b border-white/10 last:border-0 last:pb-0"
                  >
                    <div className="col-span-2 sm:col-span-1 font-instrument italic text-2xl sm:text-3xl text-[#FF9C70] leading-none pt-1">
                      {m.n}
                    </div>
                    <div className="col-span-10 sm:col-span-11">
                      <div className="font-sora font-semibold text-base sm:text-lg mb-1">
                        {m.t}
                      </div>
                      <div className="text-white/65 text-sm leading-relaxed">
                        {m.b}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          06 · MANIFESTO — Values
          ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-white border-y border-[#0E2920]/10 py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-10 mb-12 sm:mb-16 items-end">
            <div className="lg:col-span-7">
              <div className="text-[11px] uppercase tracking-[0.35em] text-[#1F8F68] font-semibold flex items-center gap-3 mb-5">
                <span className="inline-block w-8 h-px bg-[#1F8F68]" />
                05 — Manifesto
              </div>
              <h2
                className="font-sora font-bold leading-[0.95] text-[#0E2920]"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                Six rules we{" "}
                <span className="font-instrument italic font-normal text-[#E36229]">
                  don't
                </span>{" "}
                negotiate on.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#0E2920]/70 text-base leading-relaxed max-w-md">
                Values are easy to write and expensive to keep. These are the
                ones we choose to spend on — in the product, in operations, and
                in how we treat a borrower at month four.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0E2920]/10 border border-[#0E2920]/10 rounded-3xl overflow-hidden">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative bg-white p-7 sm:p-9 hover:bg-[#FAFAF7] transition-colors"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#D3F1EB] flex items-center justify-center group-hover:bg-[#25B181] transition-colors duration-300">
                      <Icon className="w-5 h-5 text-[#1F8F68] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-instrument italic text-3xl text-[#0E2920]/15 group-hover:text-[#E36229] transition-colors duration-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-sora font-bold text-[#0E2920] text-lg mb-3">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#0E2920]/70 leading-relaxed">
                    {v.blurb}
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#25B181]/0 to-transparent group-hover:via-[#25B181] transition-all duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          07 · DOSSIER — Regulatory architecture
          ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0E2920] text-white py-16 sm:py-24 overflow-hidden">
        {/* Blueprint grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#51C9AF 1px, transparent 1px), linear-gradient(90deg, #51C9AF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-96 h-96 bg-[#25B181]/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="container mx-auto max-w-7xl relative">
          <div className="grid lg:grid-cols-12 gap-8 mb-12 sm:mb-16 items-end">
            <div className="lg:col-span-8">
              <div className="text-[11px] uppercase tracking-[0.35em] text-[#51C9AF] font-semibold flex items-center gap-3 mb-5">
                <span className="inline-block w-8 h-px bg-[#51C9AF]" />
                06 — Dossier · Regulatory architecture
              </div>
              <h2
                className="font-sora font-bold leading-[0.95]"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                Built for the{" "}
                <span className="font-instrument italic font-normal text-[#FF9C70]">
                  Tuesday-morning
                </span>{" "}
                audit.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-white/70 text-base leading-relaxed">
                The 2025–2026 regulatory instruments that govern how we
                originate, service and collect every loan on the platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REGULATORY.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative flex items-start gap-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#51C9AF]/50 rounded-xl p-5 transition-all duration-300"
                >
                  <div className="absolute top-3 right-3 font-instrument italic text-xs text-white/30">
                    file · {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-[#51C9AF]/15 group-hover:bg-[#51C9AF]/25 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-4 h-4 text-[#51C9AF]" />
                  </div>
                  <div className="flex-1 pr-12">
                    <h3 className="font-sora font-semibold text-white text-sm sm:text-base mb-1 leading-tight">
                      {r.title}
                    </h3>
                    <p className="text-[11px] text-[#51C9AF]/80 uppercase tracking-wider font-mono">
                      {r.ref}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Compliance stamps */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 font-semibold">
              Stamps · in force
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                "Satsai — RBI NBFC Reg. B-14.01646",
                "ISO 27001 (in progress)",
                "CERT-In VAPT empanelled",
                "DPDP-ready — DPA with every processor",
              ].map((b) => (
                <div
                  key={b}
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-3.5 py-1.5 text-xs text-white/85 hover:border-[#51C9AF]/40 transition-colors"
                >
                  <Lock className="w-3 h-3 text-[#51C9AF]" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          08 · PARTNER PLATFORM — Stamp-style CTA
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#FAFAF7] py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background composition */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#25B181] via-[#1F8F68] to-[#0E2920]" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div
              aria-hidden
              className="absolute -top-20 -right-20 w-80 h-80 bg-[#FF9C70]/30 rounded-full blur-3xl"
            />

            {/* Postmark stamp */}
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 hidden sm:block">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center rotate-[-12deg]">
                  <div className="text-center">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-white/80 font-bold">
                      New
                    </div>
                    <div className="font-sora font-black text-2xl text-white">
                      2026
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.25em] text-white/80 font-bold">
                      live
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative p-8 sm:p-12 lg:p-16 text-white">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur border border-white/25 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-5">
                    <Network className="w-3 h-3" />
                    Chapter 07 · The platform
                  </div>

                  <h2
                    className="font-sora font-bold leading-[0.98] mb-5"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                  >
                    The Quikkred{" "}
                    <span className="font-instrument italic font-normal text-[#FF9C70]">
                      Partner Platform
                    </span>{" "}
                    is live.
                  </h2>

                  <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-7 max-w-xl">
                    Five partnership paths — Lending Partner Program (B2B2C),
                    Proprietor Network (B2B2B2C), Channel Partner, Collection
                    Partner, Investor Relations — built on the same regulated
                    stack that runs Quikkred.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/our-partners"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#0E2920] hover:bg-[#FF9C70] hover:text-white transition-colors rounded-xl font-semibold text-sm"
                    >
                      See the 5 pathways
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/partners/lending-partner-program"
                      className="inline-flex items-center gap-2 px-5 py-3 border border-white/40 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white text-sm"
                    >
                      Lending Partner deep-dive
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="grid grid-cols-2 gap-3 max-w-sm md:ml-auto">
                    {[
                      { icon: Building, label: "Your brand" },
                      { icon: Users, label: "Your customers" },
                      { icon: TrendingUp, label: "Your capital" },
                      { icon: ShieldCheck, label: "Our NBFC" },
                    ].map((p, idx) => {
                      const Icon = p.icon;
                      return (
                        <motion.div
                          key={p.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.08 }}
                          className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-xl p-4 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-white mb-2" />
                          <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-0.5">
                            slot 0{idx + 1}
                          </div>
                          <div className="text-sm font-sora font-bold text-white">
                            {p.label}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          09 · COLOPHON — Get in touch
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-[#0E2920]/10 py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-10 mb-10 sm:mb-14 items-end">
            <div className="lg:col-span-7">
              <div className="text-[11px] uppercase tracking-[0.35em] text-[#1F8F68] font-semibold flex items-center gap-3 mb-5">
                <span className="inline-block w-8 h-px bg-[#1F8F68]" />
                08 — Colophon · Get in touch
              </div>
              <h2
                className="font-sora font-bold leading-[0.95] text-[#0E2920]"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                Let's{" "}
                <span className="font-instrument italic font-normal text-[#1F8F68]">
                  connect.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#0E2920]/70 text-base leading-relaxed max-w-md">
                Questions, partnerships, press, grievance escalation — pick the
                lane and we'll answer in business hours.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0E2920]/10 border border-[#0E2920]/10 rounded-3xl overflow-hidden mb-12">
            {contactCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.a
                  key={index}
                  href={card.link}
                  target={card.icon === MapPin ? "_blank" : undefined}
                  rel={card.icon === MapPin ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative bg-white p-7 sm:p-10 hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-[#D3F1EB] rounded-xl flex items-center justify-center group-hover:bg-[#25B181] transition-colors">
                      <IconComponent className="w-5 h-5 text-[#1F8F68] group-hover:text-white transition-colors" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#0E2920]/30 group-hover:text-[#1F8F68] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#0E2920]/40 font-semibold mb-2">
                    Channel 0{index + 1}
                  </div>
                  <h3 className="font-sora font-bold text-[#0E2920] text-2xl mb-1">
                    {card.title}
                  </h3>
                  <p className="font-instrument italic text-[#0E2920]/60 text-sm mb-4">
                    — {card.description}
                  </p>
                  <p className="text-[#1F8F68] font-semibold text-sm leading-relaxed break-words">
                    {card.contact}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <div className="container mx-auto">
          <ContactForm />
        </div>

        {/* Map */}
        <div className="container mx-auto max-w-7xl mt-10 sm:mt-14">
          <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden rounded-3xl border border-[#0E2920]/10">
            <iframe
              src="https://maps.google.com/maps?q=Vikrant%20Tower%20Rajendra%20Place%20New%20Delhi%20110008&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              title="Quikkred Head Office Location"
              className="w-full h-full border-0"
              allowFullScreen
            />

            <a
              href="https://www.google.com/maps/search/?api=1&query=Vikrant+Tower+Rajendra+Place+New+Delhi+110008"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white hover:bg-[#0E2920] hover:text-white border border-[#0E2920]/10 shadow-lg rounded-xl px-4 py-2 text-sm font-semibold text-[#0E2920] transition-all duration-200"
            >
              <MapPin className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER COLOPHON LINE
          ═══════════════════════════════════════════════════════ */}
      <div className="bg-[#FAFAF7] border-t border-[#0E2920]/10 py-6">
        <div className="container mx-auto max-w-7xl flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#0E2920]/45 font-semibold">
          <span>End of dossier</span>
          <span className="font-instrument italic normal-case tracking-normal text-[11px] text-[#0E2920]/55">
            — set in Sora & Instrument Serif, MMXXVI
          </span>
          <span className="hidden sm:inline">Vol. 01 · About</span>
        </div>
      </div>
    </div>
  );
}
