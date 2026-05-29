"use client";

import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Target,
  Home,
  ArrowRight,
  Phone,
  Mail,
  Trophy,
  Zap,
  Shield,
  BarChart,
  Globe,
  Handshake,
  GraduationCap,
  Headphones,
  Wallet,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  Clock,
  Sparkles,
  Building2,
  IndianRupee,
  Smartphone,
  MapPin,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface EarningTier {
  target: string;
  commission: string;
  bonus: string;
}

// TODO: replace with the real Quikkred Mobile App APK URL.
// Placeholder reuses the Collect build until the customer-app APK is published.
const APK_URL =
  "https://quikkred-documents.d53395d350bea8ce84393333f90ac7d1.r2.cloudflarestorage.com/apk-releases/release/unversioned/1779438131022_e0bf46a8-7e45-4a59-9e62-969aa4d89a7b_app-debug.apk?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0d6c775ad8ab70e3cc1da39205d22701%2F20260522%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260522T082226Z&X-Amz-Expires=604800&X-Amz-Signature=0256505c7b8507c6c78f0c07910fd45a6ff4add562a680482cd9a5696a418fc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";

export default function ChannelPartnersPage() {
  const { t } = useLanguage();
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);

    const fbq = typeof window !== "undefined" ? (window as any).fbq : undefined;
    if (fbq) {
      fbq("trackSingle", "1650946159536225", "Lead", {
        content_name: "Quikkred Mobile App Download",
        content_category: "App Install",
        value: 0,
        currency: "INR",
      });
      fbq("trackSingleCustom", "1650946159536225", "AppDownload", {
        platform: "android_direct",
        page: "channel-partner",
        app: "mobile",
      });
    }

    setTimeout(() => {
      window.open(APK_URL, "_blank");
      setDownloadStarted(false);
    }, 500);
  };

  const benefits: Benefit[] = [
    {
      title: "High Commission & Payouts",
      description: "Earn up to 2% commission on every loan disbursed with quick weekly payouts",
      icon: DollarSign,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Real-time Dashboard",
      description: "Track applications, approvals, and earnings instantly with our advanced dashboard",
      icon: BarChart,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Dedicated Support",
      description: "Personal relationship manager for all your queries and support needs 24/7",
      icon: Headphones,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Training & Certification",
      description: "Free comprehensive training programs and certification for you and your team",
      icon: GraduationCap,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Pan-India Coverage",
      description: "Operate from anywhere in India with our fully digital platform and support",
      icon: Globe,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Zero Investment",
      description: "Join our network with no upfront costs, hidden charges, or minimum targets",
      icon: Wallet,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    }
  ];

  const earningTiers: EarningTier[] = [
    { target: "₹0 – ₹10 Lakh", commission: "1.5%", bonus: "₹5,000" },
    { target: "₹10 – ₹25 Lakh", commission: "2.0%", bonus: "₹15,000" },
    { target: "₹25 – ₹50 Lakh", commission: "2.5%", bonus: "₹40,000" },
    { target: "₹50 Lakh+", commission: "3.0%", bonus: "₹1,00,000" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1ABC9C] via-[#25B181] to-[#0F766E] text-white py-20 sm:py-24 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white/95 mb-6">
              <Sparkles className="w-3 h-3" /> DSA · Channel Partner Program
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-tight mb-6">
              Source loans. Earn commissions.
              <br />
              <span className="text-white/80">On India's daily-ladder NBFC stack.</span>
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              A digital-first partnership for loan-sourcing agents. Real-time dashboards, weekly UPI
              payouts, 1.5%–3% commission, pan-India reach — backed by Satsai Finlease (RBI
              registered).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="container mx-auto px-4 -mt-10 sm:-mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { v: "1.5–3%", l: "commission · disbursed loan value", icon: IndianRupee },
            { v: "7-day", l: "first commission · disbursal to UPI", icon: Clock },
            { v: "Pan-India", l: "operate · digital application + e-sign", icon: Globe },
            { v: "₹0", l: "joining fee · no minimum target", icon: Wallet },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.v}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 sm:p-5 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 grid place-items-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums">
                    {s.v}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{s.l}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Transparent & Rewarding Earnings Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-sm font-semibold mb-4">
              Commission Structure
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Transparent & Rewarding Earnings
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Clear commission structure with performance bonuses to maximize your earning potential
            </p>
          </div>

          {/* Commission Table - Clean Minimal Design */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#F5F5F5]">
              <div className="grid grid-cols-3">
                <div className="px-4 sm:px-6 py-4 sm:py-5 text-left">
                  <span className="text-sm sm:text-base font-bold text-gray-700">Monthly Target</span>
                </div>
                <div className="px-4 sm:px-6 py-4 sm:py-5 text-center">
                  <span className="text-sm sm:text-base font-bold text-gray-700">Commission Rate</span>
                </div>
                <div className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                  <span className="text-sm sm:text-base font-bold text-gray-700">Monthly Bonus</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div>
              {earningTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`grid grid-cols-3 ${index !== earningTiers.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="px-4 sm:px-6 py-5 sm:py-6 text-left">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {tier.target}
                    </span>
                  </div>
                  <div className="px-4 sm:px-6 py-5 sm:py-6 text-center">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {tier.commission}
                    </span>
                  </div>
                  <div className="px-4 sm:px-6 py-5 sm:py-6 text-right">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {tier.bonus}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Example Calculation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 bg-gradient-to-r from-[#E8EDFF] to-[#D3F1EB] border-l-4 border-[#4A66FF] p-4 sm:p-6 rounded-xl"
          >
            <p className="text-sm sm:text-base text-gray-700">
              <span className="font-bold text-[#4A66FF]">Example:</span> If you facilitate loans worth ₹25 lakhs in a month at 2.0% commission rate, you'll earn{" "}
              <span className="font-bold text-[#25B181]">₹50,000</span> in commission +{" "}
              <span className="font-bold text-[#25B181]">₹15,000</span> bonus ={" "}
              <span className="font-bold text-[#25B181] text-lg">₹65,000 total!</span>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- HOW IT WORKS · 5-step pipeline ---------------- */}
      <section className="bg-[#F8FAFB] py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 max-w-3xl mx-auto"
          >
            <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-[#E8EDFF] text-[#4A66FF] border border-[#4A66FF]/20">
              How it works
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 leading-tight">
              Five steps from application to your first UPI payout.
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              No back-and-forth, no paperwork in person. Everything runs through the partner portal
              and the Satsai-LSP stack that powers the whole platform.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute left-0 right-0 top-9 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
              {[
                {
                  n: "01",
                  t: "Apply online",
                  b: "Fill the channel-partner form. PAN, Aadhaar, business proof, bank details. Takes ~7 minutes.",
                  icon: Smartphone,
                },
                {
                  n: "02",
                  t: "KYC & DSA agreement",
                  b: "Video-KYC, e-sign the Direct Selling Agent agreement under RBI DLD-2025 norms. Same day.",
                  icon: FileCheck,
                },
                {
                  n: "03",
                  t: "Training & certification",
                  b: "Free 90-min online course on product, FPC, fraud red-flags. Issue you a partner ID.",
                  icon: GraduationCap,
                },
                {
                  n: "04",
                  t: "Source loans",
                  b: "Share your unique referral link. Borrowers apply on the Quikkred platform; you see status live in your dashboard.",
                  icon: Handshake,
                },
                {
                  n: "05",
                  t: "Earn · weekly UPI",
                  b: "Commission credited within 7 days of disbursal. TDS deducted as per IT Act. Withdrawals direct to UPI.",
                  icon: IndianRupee,
                },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="relative bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-[0_12px_36px_-16px_rgba(16,185,129,0.2)] transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 grid place-items-center">
                        <Icon className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 tabular-nums">
                        {s.n}
                      </span>
                    </div>
                    <h3 className="font-sora font-bold text-base text-gray-900">{s.t}</h3>
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{s.b}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-2 bg-[#E8EDFF] text-[#4A66FF] rounded-full text-sm font-semibold mb-4">
              Partner Benefits
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Join a network that values your success with comprehensive support and industry-leading benefits
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className={`w-14 h-14 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ---------------- ELIGIBILITY + FAQ ---------------- */}
      <section className="bg-[#F8FAFB] py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-6 sm:p-8"
            >
              <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Eligibility
              </span>
              <h3 className="mt-3 font-sora font-bold text-xl sm:text-2xl text-gray-900 leading-tight">
                Who can become a Channel Partner?
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {[
                  "Individual or proprietor · 21+ years",
                  "Valid PAN, Aadhaar and active bank account",
                  "Business address proof (any of: GST · Udyam · electricity bill · rent agreement)",
                  "Loan-sourcing experience preferred but not required — we train you",
                  "Active mobile + smartphone for the partner app",
                  "No adverse CIBIL or PMLA flag (we run a soft check at onboarding)",
                ].map((e) => (
                  <li key={e} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-emerald-50/50 border border-emerald-100 p-4 text-xs text-emerald-800 leading-relaxed">
                Partners operate as Direct Selling Agents under the Satsai-Fluxusforge LSP
                framework. Fully RBI DLD-2025 compliant. You source — the NBFC underwrites,
                disburses and services.
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-[#E8EDFF] text-[#4A66FF] border border-[#4A66FF]/20">
                Frequently asked
              </span>
              <h3 className="mt-3 font-sora font-bold text-xl sm:text-2xl text-gray-900 leading-tight">
                The questions every prospective DSA asks first.
              </h3>
              <div className="mt-5 space-y-3">
                {[
                  {
                    q: "How quickly will I get my first commission?",
                    a: "Within 7 days of the borrower's loan disbursing. Commission is credited weekly via UPI to your registered bank/UPI handle. TDS is deducted at applicable rates and a TDS certificate is issued annually.",
                  },
                  {
                    q: "Do I need to invest anything to join?",
                    a: "No. Joining is free. No minimum target, no security deposit, no licence fee. You only need a smartphone and the basic KYC documents listed in Eligibility.",
                  },
                  {
                    q: "Can I operate across multiple states?",
                    a: "Yes. The platform is fully digital — your referral link works pan-India. We do request you flag your primary operating geography at onboarding for support routing.",
                  },
                  {
                    q: "What happens if a borrower defaults?",
                    a: "The commission you've already earned is unaffected. We do not claw back paid commissions on first-payment defaults so long as the application was bona fide. Repeated patterns of risky referrals may trigger a partner review.",
                  },
                  {
                    q: "Who do I contact for live help?",
                    a: "Each partner gets a dedicated relationship manager (RM) at onboarding. The RM handles applications, escalations, and product questions. The partner WhatsApp helpdesk is available 9 AM – 9 PM IST.",
                  },
                ].map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <summary className="cursor-pointer list-none p-4 sm:p-5 flex items-start justify-between gap-4">
                      <span className="font-sora font-semibold text-gray-900 text-sm sm:text-base leading-snug pr-2">
                        {f.q}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-4 sm:px-5 pb-5 -mt-1 text-sm text-gray-600 leading-relaxed">
                      {f.a}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download App CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#4A66FF] to-[#6D90FF] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
                Download the Quikkred App
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-95 max-w-xl mx-auto">
                Get the Quikkred mobile app to onboard customers, submit loan
                applications and track disbursements on the go
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-10 py-5 bg-white text-[#4A66FF] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
              >
                <Download className="w-6 h-6" />
                {downloadStarted ? "Starting Download..." : "Download App"}
              </motion.button>

              <p className="text-white/70 text-sm mt-4">
                Android 8.0+ required
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact / Questions Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#4A66FF] to-[#6D90FF] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
                Have Questions?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-95 max-w-xl mx-auto">
                Speak with our partnership team to learn more about becoming a Quikkred Channel Partner
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+918888882222">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#4A66FF] rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Us
                  </button>
                </a>
                <a href="mailto:partners@quikkred.com">
                  <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[#4A66FF] transition-all flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Us
                  </button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-8 sm:h-12" />
    </div>
  );
}
