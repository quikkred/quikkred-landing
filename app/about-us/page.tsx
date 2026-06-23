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
  CheckCircle,
  Globe,
  Briefcase,
  Clock,
  Star,
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
} from "lucide-react";
import SalaryAdvance from "@/components/SalaryAdvance";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";
import ContactForm from "@/components/Contact-form";
import {
  COMPANY_ADDRESS,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
  COMPANY_EMAIL_SUPPORT,
} from "@/lib/constants/companyInfo";

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

const stats: Stat[] = [
  { label: "Founded", value: "Since 2018", icon: Clock },
  { label: "RBI-registered NBFC partner", value: "B-14.01646", icon: Shield },
  { label: "Pan-India presence", value: "28 states", icon: Globe },
  { label: "Regulatory frame", value: "RBI DLD 2025", icon: ShieldCheck },
];

const values = [
  {
    icon: Heart,
    title: "Customer first",
    description:
      "Every decision starts and ends with our customers' best interests at heart.",
  },
  {
    icon: Shield,
    title: "Trust & transparency",
    description:
      "All-inclusive APR on every Key Fact Statement. No hidden charges, no surprise fees.",
  },
  {
    icon: TrendingUp,
    title: "Innovation with discipline",
    description:
      "Cutting-edge AI for faster, fairer lending — built on a regulatory-first architecture that survives an RBI inspection on a Tuesday morning.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description:
      "Credit accessible to every Indian, regardless of background — including last-mile borrowers reached through our proprietor network.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "The highest standards of service in everything we do — from origination to collections to grievance resolution.",
  },
  {
    icon: Globe,
    title: "Social impact",
    description:
      "Empowering communities and contributing to India's economic growth through responsible, PSL-eligible lending.",
  },
];

interface EntityLayer {
  tag: string;
  name: string;
  role: string;
  blurb: string;
  icon: React.ComponentType<any>;
  tone: string;
}

const LAYERS: EntityLayer[] = [
  {
    tag: "Layer 1 · Consumer brand",
    name: "Quikkred",
    role: "Customer-facing identity + product UX",
    blurb:
      "The brand borrowers know. Product strategy, user experience, growth, communication — and the reason someone downloads the app.",
    icon: Building,
    tone: "bg-[#DAE6FF] border-[#4A66FF]/30 text-[#4A66FF]",
  },
  {
    tag: "Layer 2 · LSP",
    name: "Fluxusforge",
    role: "Tech stack + credit ops + collections",
    blurb:
      "Business Rules Engine, KYC, Key Fact Statement generation, disbursal rails, payment links, eNACH, DPD tracking, telephony, field collections — all in one production stack.",
    icon: Cpu,
    tone: "bg-[#D3F1EB] border-[#1F8F68]/30 text-[#1F8F68]",
  },
  {
    tag: "Layer 3 · NBFC (RBI-regulated)",
    name: "Satsai Finlease Private Limited",
    role: "RBI Reg. B-14.01646 — licence, balance sheet, lender of record",
    blurb:
      "Every loan on the Quikkred platform is lent by Satsai Finlease. Credit sanction, bureau reporting, final grievance escalation — Satsai is the Regulated Entity on record for each transaction.",
    icon: Landmark,
    tone: "bg-[#FFEBD1] border-[#E36229]/30 text-[#E36229]",
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

const contactCards = [
  {
    icon: Phone,
    title: "Call us",
    description: "Speak directly with our support team",
    contact: COMPANY_PHONE_DISPLAY,
    link: `tel:${COMPANY_PHONE_TEL}`,
  },
  {
    icon: Mail,
    title: "Email us",
    description: "Send us your queries anytime",
    contact: COMPANY_EMAIL_SUPPORT,
    link: `mailto:${COMPANY_EMAIL_SUPPORT}`,
  },
  {
    icon: MapPin,
    title: "Visit us",
    description: "Our head office location",
    contact: COMPANY_ADDRESS,
    link: "https://maps.google.com/?q=Vikrant+Tower+Rajendra+Place+New+Delhi",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* ─── Hero ─── */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <SalaryAdvance
          title="About Quikkred"
          subtitle="India's most trusted AI-powered digital lending platform — committed to making credit accessible, affordable and transparent for every Indian. Our mission is to empower dreams and enable financial inclusion through technology and trust."
          buttonPrimaryText="Contact Us"
          buttonSecondaryText="Call Us Now"
          imageSrc="/Aboutus_hero_image.png"
          primaryColor="emerald"
        />
      </section>

      {/* ─── Stats bar ─── */}
      <section className="bg-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-br from-[#F5F5F5] to-[#D3F1EB]/40 border border-gray-100 rounded-2xl p-4 sm:p-5 text-center"
                >
                  <Icon className="w-5 h-5 text-[#1F8F68] mx-auto mb-2" />
                  <div className="text-base sm:text-lg font-bold font-sora text-gray-900 mb-0.5">
                    {s.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide">
                    {s.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section className="py-8 sm:py-10 lg:py-12 bg-[#F6F6F6]">
        <div className="w-full sm:px-6 md:px-16 flex flex-col items-center justify-between gap-10 md:flex-row-reverse container mx-auto">
          <div className="md:w-1/2 space-y-4">
            <span className="inline-block px-3 py-1 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold uppercase tracking-wide">
              Our story
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sora leading-snug">
              From a 2018 idea to a regulated digital NBFC stack
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Quikkred began in 2018 as a digital lending platform with a clear goal: build a seamless lending experience for the underserved population of India. In partnership with Satsai Finlease Private Limited — an RBI-registered NBFC — we recognised that millions of individuals and small businesses were excluded from traditional financial systems, facing complex processes and limited access to credit.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We saw the challenges many faced with traditional financing. By leveraging cutting-edge technology, we set out to offer accessible and fair loan products. Our digital-first approach removes barriers, simplifies the process, and empowers individuals to achieve their financial goals with dignity and ease.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              In 2026 we launched the <Link href="/our-partners" className="text-[#1F8F68] font-semibold hover:underline">Quikkred Partner Platform</Link> — a B2B2C and B2B2B2C architecture that lets Private Limited companies plug into the same regulatory and tech stack to offer loans under their own brand, reaching last-mile borrowers through a proprietor network of neighbourhood retailers.
            </p>
            <p className="text-[#0E2920] font-semibold text-sm sm:text-base">
              Today, we continue to innovate and expand, staying true to our mission of making financial services accessible to everyone who needs them.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-md w-full max-w-[420px] md:max-w-[460px]">
              <Image
                src="/about_story_img.jpg"
                alt="Our Story"
                width={460}
                height={320}
                className="object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tri-entity architecture ─── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
              How Quikkred is structured
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Three entities. One regulated lending pipeline.
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Every loan on the Quikkred platform flows through this stack. It's how we stay compliant, scalable and unambiguous about who does what.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {LAYERS.map((l, i) => {
              const Icon = l.icon;
              return (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl border p-6 ${l.tone}`}
                >
                  <Icon className="w-7 h-7 mb-4" />
                  <div className="text-[11px] uppercase tracking-wider font-bold mb-1 opacity-80">
                    {l.tag}
                  </div>
                  <h3 className="text-lg font-bold font-sora text-gray-900 mb-1">
                    {l.name}
                  </h3>
                  <p className="text-xs font-semibold italic mb-3">{l.role}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {l.blurb}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-500 mt-6 max-w-3xl mx-auto leading-relaxed">
            This separation — brand, LSP, NBFC — is by design. It keeps accountability sharp, makes the compliance posture auditable, and mirrors RBI's intent under the Digital Lending Directions, 2025.
          </p>
        </div>
      </section>

      {/* ─── Vision ─── */}
      <section className="py-8 sm:py-10 lg:py-12 bg-[#F6F6F6]">
        <div className="w-full sm:px-6 md:px-16 flex flex-col items-center justify-between gap-10 md:flex-row container mx-auto">
          <div className="md:w-1/2 space-y-4 sm:space-y-6">
            <span className="inline-block px-3 py-1 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold uppercase tracking-wide">
              Our vision
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sora leading-snug">
              A future where everyone has the financial tools they need
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              To be India's most trusted and preferred digital lending platform, empowering millions to achieve their financial aspirations — from salaried borrowers in metros to informal-sector self-employed reaching us through our neighbourhood retail partners.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-md w-full max-w-[420px] md:max-w-[460px]">
              <Image
                src="/about_vision_img.jpg"
                alt="Our Vision"
                width={460}
                height={320}
                className="object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission ─── */}
      <FinancialFeatureSection
        image="/Aboutus_mission_image.jpg"
        imageAlt="Our Mission"
        heading="Our Mission"
        description="To make our vision a reality, we are on a mission to:"
        features={[
          {
            icon: <DocumentIcon />,
            title: "",
            description:
              "Provide innovative, accessible and responsible lending solutions.",
          },
          {
            icon: <DocumentIcon />,
            title: "",
            description:
              "Leverage technology for a seamless end-to-end customer experience.",
          },
          {
            icon: <DocumentIcon />,
            title: "",
            description:
              "Foster financial inclusion across all of India — metro and rural, salaried and self-employed.",
          },
        ]}
      />

      {/* ─── Core values ─── */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
              What we stand for
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Our core <span className="text-[#25B181]">values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and define who we are as a company.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 bg-[#D3F1EB] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#25B181] transition-colors">
                    <IconComponent className="w-7 h-7 text-[#25B181] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold font-sora text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Regulatory frame ─── */}
      <section className="bg-[#0E2920] text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/15 text-[#51C9AF] rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Regulatory architecture
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3">
              Built for the audit
            </h2>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl mx-auto">
              The current 2025–2026 regulatory instruments that govern how we originate, service and collect every loan on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REGULATORY.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#51C9AF]/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#51C9AF]/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#51C9AF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-sora text-white text-sm mb-0.5">
                      {r.title}
                    </h3>
                    <p className="text-[11px] text-[#51C9AF]/80 uppercase tracking-wider">
                      {r.ref}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              "Satsai — RBI NBFC Reg. B-14.01646",
              "ISO 27001 (in progress)",
              "CERT-In VAPT empanelled",
              "DPDP-ready — DPA with every processor",
            ].map((b) => (
              <div
                key={b}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/85"
              >
                <Lock className="w-3.5 h-3.5 text-[#51C9AF]" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Partnership callout ─── */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#25B181] to-[#1F8F68] p-8 sm:p-12 text-white">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(500px 250px at 90% 10%, rgba(255,255,255,0.25), transparent 60%)",
              }}
            />
            <div className="relative grid md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 border border-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider text-white mb-4">
                  <Network className="w-3.5 h-3.5" />
                  New in 2026
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-sora leading-tight mb-3">
                  The Quikkred Partner Platform is live
                </h2>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-5">
                  Five partnership paths — Lending Partner Program (B2B2C), Proprietor Network (B2B2B2C), Channel Partner, Collection Partner, Investor Relations — built on the same regulated stack that runs Quikkred.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/our-partners"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#1F8F68] hover:bg-[#D3F1EB] transition-colors rounded-xl font-semibold text-sm"
                  >
                    See the 5 pathways
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/partners/lending-partner-program"
                    className="inline-flex items-center gap-2 px-5 py-3 border border-white/30 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white text-sm"
                  >
                    Deep-dive the Lending Partner Program
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  {[
                    { icon: Building, label: "Your brand" },
                    { icon: Users, label: "Your customers" },
                    { icon: TrendingUp, label: "Your capital" },
                    { icon: ShieldCheck, label: "Our NBFC" },
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.label}
                        className="bg-white/10 border border-white/15 rounded-xl p-3 text-center"
                      >
                        <Icon className="w-5 h-5 text-white mx-auto mb-1.5" />
                        <div className="text-xs font-semibold text-white">
                          {p.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Get in touch cards ─── */}
      <section className="bg-[#F6F6F6] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-white text-[#1F8F68] border border-[#25B181]/20 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
              Reach out to us
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Let&apos;s <span className="text-[#25B181]">connect</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions? We&apos;re here to help. Reach out through any of these channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#D3F1EB] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#25B181] transition-colors">
                    <IconComponent className="w-6 h-6 text-[#25B181] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold font-sora text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{card.description}</p>
                  <p className="text-[#25B181] font-semibold text-sm leading-relaxed">
                    {card.contact}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Contact form ─── */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full">
          <ContactForm />
        </div>
      </section>

      {/* ─── Map ─── */}
<div className="relative w-full h-[250px] sm:h-[320px] md:h-[380px] overflow-hidden rounded-2xl shadow-lg">
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
    className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 shadow-md rounded-xl px-4 py-2 text-sm font-medium text-[#1F8F68] transition-all duration-200"
  >
    <MapPin className="w-4 h-4" />
    Open in Google Maps
  </a>
</div>
    </div>
  );
}