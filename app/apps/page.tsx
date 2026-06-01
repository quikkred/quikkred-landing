"use client";

/**
 * /apps — Quikkred App Download Center
 * --------------------------------------------------------------------------
 * A dedicated, editorial "mission-control" page that presents the three
 * integrated Quikkred applications, each as its own station with a hand-built
 * CSS phone mockup, accent color, feature list and a single decisive CTA.
 *
 * • Quikkred Collect      → direct APK download (R2) + Facebook Pixel tracking
 * • Quikkred Mobile App   → onboarding link (/partners/channel-partner)
 * • Quikkred Connect      → onboarding link (/partners/proprietor-network)
 *
 * The APK URL + fbq tracking pattern mirrors app/partners/collection-partner.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Download,
  ArrowRight,
  ArrowUpRight,
  Home,
  ShieldCheck,
  Smartphone,
  Users,
  Store,
  MapPinned,
  Wallet,
  ScanFace,
  FileCheck,
  Banknote,
  ReceiptText,
  Network,
  CircleDot,
  CheckCircle2,
  Languages,
  Sparkles,
} from "lucide-react";

/* The Collect APK lives in R2 (same signed URL used on the collection-partner page). */
const COLLECT_APK_URL =
  "https://quikkred-documents.d53395d350bea8ce84393333f90ac7d1.r2.cloudflarestorage.com/apk-releases/release/unversioned/1779438131022_e0bf46a8-7e45-4a59-9e62-969aa4d89a7b_app-debug.apk?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0d6c775ad8ab70e3cc1da39205d22701%2F20260522%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260522T082226Z&X-Amz-Expires=604800&X-Amz-Signature=0256505c7b8507c6c78f0c07910fd45a6ff4add562a680482cd9a5696a418fc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";

const FB_PIXEL_ID = "1650946159536225";

type AppId = "collect" | "mobile" | "connect";

export default function AppsPage() {
  const [downloading, setDownloading] = useState<AppId | null>(null);

  const handleCollectDownload = () => {
    setDownloading("collect");

    const fbq = typeof window !== "undefined" ? (window as any).fbq : undefined;
    if (fbq) {
      fbq("trackSingle", FB_PIXEL_ID, "Lead", {
        content_name: "Quikkred Collect APK Download",
        content_category: "App Install",
        value: 0,
        currency: "INR",
      });
      fbq("trackSingleCustom", FB_PIXEL_ID, "AppDownload", {
        platform: "android_direct",
        page: "apps",
        app: "collect",
      });
    }

    setTimeout(() => {
      window.open(COLLECT_APK_URL, "_blank");
      setDownloading(null);
    }, 600);
  };

  return (
    <div className="apps-page relative min-h-screen overflow-hidden bg-[#06140f] text-emerald-50 antialiased">
      <Atmosphere />

      {/* ============================== HERO ============================== */}
      <header className="relative">
        <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 lg:px-10">
          {/* breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[12px] font-medium text-emerald-200/60"
          >
            <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-100">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <span className="text-emerald-200/30">/</span>
            <span className="text-emerald-100/90">App Downloads</span>
          </motion.nav>

          <div className="grid items-end gap-10 pb-14 pt-12 lg:grid-cols-12 lg:pb-20 lg:pt-16">
            {/* left — headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-emerald-200/90 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
                Quikkred Application Suite
              </span>

              <h1 className="font-sora mt-7 text-[40px] font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-[78px]">
                Three apps.
                <br />
                One{" "}
                <span className="relative inline-block">
                  <span className="font-instrument text-[0.92em] font-normal italic text-emerald-300">
                    lending ecosystem.
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 320 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8C60 3 120 3 180 6S300 10 318 4"
                      stroke="url(#hl)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="hl" x1="0" y1="0" x2="320" y2="0">
                        <stop stopColor="#34d399" />
                        <stop offset="0.5" stopColor="#fbbf24" />
                        <stop offset="1" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-emerald-100/70 sm:text-[17px]">
                Every Quikkred application powers a single thread — a retailer onboards a customer,
                the customer borrows and repays, a field partner closes the loop. Pick your role,
                download the right tool.
              </p>
            </motion.div>

            {/* right — quick jump pills */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-4"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200/50">
                  Jump to an app
                </p>
                <div className="flex flex-col gap-2">
                  {APPS.map((app) => (
                    <a
                      key={app.id}
                      href={`#${app.id}`}
                      className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-3 transition-all hover:border-white/15 hover:bg-white/[0.05]"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{ background: app.accent.tile, color: app.accent.solid }}
                        >
                          <app.Icon className="h-4 w-4" />
                        </span>
                        <span className="font-sora text-[13.5px] font-semibold text-emerald-50">
                          {app.name}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 -translate-x-1 text-emerald-200/40 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ecosystem flow ribbon */}
          <FlowRibbon />
        </div>
      </header>

      {/* ============================ APP STATIONS ============================ */}
      <main className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-24 lg:gap-32">
          {APPS.map((app, i) => (
            <AppStation
              key={app.id}
              app={app}
              flip={i % 2 === 1}
              index={i}
              downloading={downloading === app.id}
              onDownload={app.id === "collect" ? handleCollectDownload : undefined}
            />
          ))}
        </div>

        {/* install + trust footer */}
        <InstallFooter />
      </main>
    </div>
  );
}

/* ========================================================================== */
/* App data                                                                   */
/* ========================================================================== */

interface AppAccent {
  solid: string;
  tile: string;
  glow: string;
  ring: string;
  text: string;
}

interface AppDef {
  id: AppId;
  name: string;
  tagline: string;
  Icon: typeof Smartphone;
  userType: string;
  purpose: string;
  features: { Icon: typeof Smartphone; label: string }[];
  meta: { platform: string; size: string; version: string };
  cta: { label: string; kind: "download" | "link"; href?: string };
  accent: AppAccent;
  screen: "collect" | "mobile" | "connect";
}

const APPS: AppDef[] = [
  {
    id: "collect",
    name: "Quikkred Collect",
    tagline: "Field collections, GPS-verified",
    Icon: MapPinned,
    userType: "Field Executives · Collection Team",
    purpose:
      "The field-force companion for borrower management and on-ground repayment collection — every visit tracked, every rupee reconciled.",
    features: [
      { Icon: Users, label: "Borrower & loan detail at a glance" },
      { Icon: ReceiptText, label: "Track live repayment status" },
      { Icon: Wallet, label: "Record & collect repayments on the spot" },
      { Icon: MapPinned, label: "GPS-stamped field visit & remarks" },
      { Icon: CheckCircle2, label: "Payment reconciliation support" },
    ],
    meta: { platform: "Android APK", size: "81 MB", version: "Latest build" },
    cta: { label: "Download APK", kind: "download" },
    accent: {
      solid: "#34d399",
      tile: "linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.12))",
      glow: "rgba(52,211,153,0.30)",
      ring: "rgba(52,211,153,0.45)",
      text: "#6ee7b7",
    },
    screen: "collect",
  },
  {
    id: "mobile",
    name: "Quikkred Mobile App",
    tagline: "Payday loans in your pocket",
    Icon: Smartphone,
    userType: "Borrowers · Customers",
    purpose:
      "The customer-facing app for payday and short-term loans — onboard, verify, borrow and repay, all from a single screen.",
    features: [
      { Icon: ScanFace, label: "Guided onboarding & KYC verification" },
      { Icon: FileCheck, label: "Submit loan applications instantly" },
      { Icon: Banknote, label: "Track disbursement in real time" },
      { Icon: Wallet, label: "Repay & manage your account" },
      { Icon: ReceiptText, label: "AutoPay / eNACH management" },
    ],
    meta: { platform: "Android · iOS", size: "Onboarding", version: "Channel Partner" },
    cta: { label: "Get Access", kind: "link", href: "/partners/channel-partner" },
    accent: {
      solid: "#fbbf24",
      tile: "linear-gradient(135deg, rgba(251,191,36,0.24), rgba(245,158,11,0.12))",
      glow: "rgba(251,191,36,0.28)",
      ring: "rgba(251,191,36,0.45)",
      text: "#fcd34d",
    },
    screen: "mobile",
  },
  {
    id: "connect",
    name: "Quikkred Connect",
    tagline: "Onboard customers, generate leads",
    Icon: Store,
    userType: "Retailers · Partners · Associates",
    purpose:
      "The partner & retailer toolkit to onboard customers, collect KYC and push loan applications straight into the Quikkred pipeline.",
    features: [
      { Icon: Users, label: "Customer onboarding in minutes" },
      { Icon: ScanFace, label: "Basic KYC collection" },
      { Icon: Sparkles, label: "Loan lead generation" },
      { Icon: FileCheck, label: "Application submission & tracking" },
      { Icon: Network, label: "Retailer dashboard access" },
    ],
    meta: { platform: "Android", size: "Onboarding", version: "Proprietor Network" },
    cta: { label: "Get Access", kind: "link", href: "/partners/proprietor-network" },
    accent: {
      solid: "#22d3ee",
      tile: "linear-gradient(135deg, rgba(34,211,238,0.22), rgba(6,182,212,0.12))",
      glow: "rgba(34,211,238,0.28)",
      ring: "rgba(34,211,238,0.45)",
      text: "#67e8f9",
    },
    screen: "connect",
  },
];

/* ========================================================================== */
/* App station (card + phone mockup)                                          */
/* ========================================================================== */

function AppStation({
  app,
  flip,
  index,
  downloading,
  onDownload,
}: {
  app: AppDef;
  flip: boolean;
  index: number;
  downloading: boolean;
  onDownload?: () => void;
}) {
  return (
    <motion.section
      id={app.id}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24"
    >
      <div
        className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-14 ${
          flip ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* ---- phone mockup ---- */}
        <div className="flex justify-center lg:col-span-5 lg:[direction:ltr]">
          <PhoneMockup app={app} />
        </div>

        {/* ---- copy ---- */}
        <div className="lg:col-span-7 lg:[direction:ltr]">
          {/* index + name row */}
          <div className="flex items-start gap-4">
            <span
              className="font-instrument mt-1 text-5xl italic leading-none"
              style={{ color: app.accent.solid, opacity: 0.55 }}
            >
              0{index + 1}
            </span>
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl ring-1"
                  style={{
                    background: app.accent.tile,
                    color: app.accent.solid,
                    boxShadow: `0 0 0 1px ${app.accent.ring}`,
                  }}
                >
                  <app.Icon className="h-5 w-5" />
                </span>
                <h2 className="font-sora text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">
                  {app.name}
                </h2>
              </div>
              <p
                className="font-instrument mt-1.5 text-lg italic"
                style={{ color: app.accent.text }}
              >
                {app.tagline}
              </p>
            </div>
          </div>

          {/* user type chip */}
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-emerald-100/70">
            <Users className="h-3.5 w-3.5" style={{ color: app.accent.solid }} />
            {app.userType}
          </span>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-emerald-100/65">
            {app.purpose}
          </p>

          {/* features */}
          <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {app.features.map((f, fi) => (
              <li key={fi} className="flex items-center gap-3 text-[14px] text-emerald-50/85">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: app.accent.tile, color: app.accent.solid }}
                >
                  <f.Icon className="h-3.5 w-3.5" />
                </span>
                {f.label}
              </li>
            ))}
          </ul>

          {/* meta + CTA */}
          <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5 text-[12.5px] text-emerald-100/55">
              {[
                ["Platform", app.meta.platform],
                ["Size", app.meta.size],
                ["Build", app.meta.version],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/35">
                    {k}
                  </div>
                  <div className="font-sora font-semibold text-emerald-50/90">{v}</div>
                </div>
              ))}
            </div>

            <AppCTA app={app} downloading={downloading} onDownload={onDownload} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function AppCTA({
  app,
  downloading,
  onDownload,
}: {
  app: AppDef;
  downloading: boolean;
  onDownload?: () => void;
}) {
  const inner = (
    <span className="relative z-10 flex items-center justify-center gap-2.5">
      {app.cta.kind === "download" ? (
        <Download className={`h-5 w-5 ${downloading ? "animate-bounce" : ""}`} />
      ) : (
        <ArrowUpRight className="h-5 w-5" />
      )}
      {downloading ? "Starting…" : app.cta.label}
    </span>
  );

  const className =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-7 py-3.5 font-sora text-[15px] font-bold text-[#06140f] shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]";
  const style = {
    background: `linear-gradient(135deg, ${app.accent.solid}, ${app.accent.text})`,
    boxShadow: `0 14px 40px -12px ${app.accent.glow}`,
  };

  if (app.cta.kind === "download") {
    return (
      <button onClick={onDownload} disabled={downloading} className={className} style={style}>
        {inner}
        <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />
      </button>
    );
  }

  return (
    <Link href={app.cta.href!} className={className} style={style}>
      {inner}
      <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />
    </Link>
  );
}

/* ========================================================================== */
/* CSS phone mockups — one per app                                            */
/* ========================================================================== */

function PhoneMockup({ app }: { app: AppDef }) {
  return (
    <motion.div
      initial={{ rotateY: 0 }}
      whileHover={{ y: -8, rotateZ: -1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative"
    >
      {/* glow puddle */}
      <div
        className="absolute -inset-10 -z-10 rounded-full blur-3xl"
        style={{ background: app.accent.glow, opacity: 0.5 }}
      />
      {/* device frame */}
      <div className="relative h-[480px] w-[238px] rounded-[2.6rem] border border-white/15 bg-gradient-to-b from-[#0d2019] to-[#081610] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="absolute left-1/2 top-2.5 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black/80" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-[#0a1b14]">
          {app.screen === "collect" && <CollectScreen accent={app.accent} />}
          {app.screen === "mobile" && <MobileScreen accent={app.accent} />}
          {app.screen === "connect" && <ConnectScreen accent={app.accent} />}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBar({ accent }: { accent: AppAccent }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 text-[10px] font-semibold text-emerald-50/70">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <CircleDot className="h-2.5 w-2.5" style={{ color: accent.solid }} />
        Quikkred
      </span>
      <span className="flex gap-0.5">
        <span className="h-2 w-3 rounded-sm bg-emerald-50/40" />
        <span className="h-2 w-1.5 rounded-sm bg-emerald-50/40" />
      </span>
    </div>
  );
}

function CollectScreen({ accent }: { accent: AppAccent }) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar accent={accent} />
      <div className="px-5 pt-4">
        <p className="text-[10px] uppercase tracking-widest text-emerald-200/40">Today’s route</p>
        <p className="font-sora text-base font-bold text-white">6 visits · 4 collected</p>
      </div>
      {/* mini map */}
      <div className="mx-4 mt-3 h-24 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1f17]">
        <svg viewBox="0 0 220 96" className="h-full w-full">
          <path
            d="M10 80 C50 50 80 70 120 40 S190 18 210 36"
            fill="none"
            stroke={accent.solid}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />
          <circle cx="10" cy="80" r="5" fill={accent.solid} />
          <circle cx="120" cy="40" r="6" fill="#fbbf24" />
          <circle cx="210" cy="36" r="5" fill="#fff" opacity="0.6" />
        </svg>
      </div>
      {/* collection cards */}
      <div className="mt-3 flex flex-col gap-2 px-4">
        {[
          ["R. Sharma", "₹4,200", "Collected", true],
          ["A. Verma", "₹2,800", "Pending", false],
          ["S. Iyer", "₹6,500", "Pending", false],
        ].map(([name, amt, status, done]) => (
          <div
            key={name as string}
            className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-[#06140f]"
                style={{ background: done ? accent.solid : "rgba(255,255,255,0.15)" }}
              >
                {(name as string).charAt(0)}
              </span>
              <div>
                <p className="text-[11px] font-semibold text-white">{name as string}</p>
                <p className="text-[9px] text-emerald-100/45">{amt as string}</p>
              </div>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[8.5px] font-bold"
              style={{
                background: done ? `${accent.solid}22` : "rgba(255,255,255,0.06)",
                color: done ? accent.text : "rgba(255,255,255,0.5)",
              }}
            >
              {status as string}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto px-4 pb-4">
        <div
          className="rounded-xl py-2.5 text-center text-[11px] font-bold text-[#06140f]"
          style={{ background: accent.solid }}
        >
          Collect repayment
        </div>
      </div>
    </div>
  );
}

function MobileScreen({ accent }: { accent: AppAccent }) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar accent={accent} />
      <div className="px-5 pt-5">
        <p className="text-[10px] text-emerald-100/45">Good evening,</p>
        <p className="font-sora text-base font-bold text-white">Priya 👋</p>
      </div>
      {/* balance card */}
      <div
        className="mx-4 mt-4 overflow-hidden rounded-2xl p-4"
        style={{ background: `linear-gradient(135deg, ${accent.solid}, ${accent.text})` }}
      >
        <p className="text-[9px] font-semibold uppercase tracking-widest text-[#06140f]/70">
          Available limit
        </p>
        <p className="font-sora text-2xl font-extrabold text-[#06140f]">₹50,000</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#06140f]/20">
          <div className="h-full w-2/3 rounded-full bg-[#06140f]/60" />
        </div>
        <p className="mt-1.5 text-[8.5px] font-medium text-[#06140f]/70">₹33,000 of ₹50,000 used</p>
      </div>
      {/* quick actions */}
      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        {[
          [ScanFace, "KYC"],
          [Banknote, "Apply"],
          [Wallet, "Repay"],
        ].map(([Ic, label], i) => {
          const Icon = Ic as typeof ScanFace;
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.04] py-3"
            >
              <Icon className="h-4 w-4" style={{ color: accent.solid }} />
              <span className="text-[9px] text-emerald-50/70">{label as string}</span>
            </div>
          );
        })}
      </div>
      {/* status timeline */}
      <div className="mx-4 mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-emerald-200/40">
          Loan status
        </p>
        {["Applied", "KYC verified", "Disbursing…"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 py-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: i < 2 ? accent.solid : "rgba(255,255,255,0.25)" }}
            />
            <span className="text-[10px] text-emerald-50/75">{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto px-4 pb-4">
        <div
          className="rounded-xl py-2.5 text-center text-[11px] font-bold text-[#06140f]"
          style={{ background: accent.solid }}
        >
          Apply for a loan
        </div>
      </div>
    </div>
  );
}

function ConnectScreen({ accent }: { accent: AppAccent }) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar accent={accent} />
      <div className="px-5 pt-5">
        <p className="text-[10px] uppercase tracking-widest text-emerald-200/40">Retailer dashboard</p>
        <p className="font-sora text-base font-bold text-white">Sharma Mobile Store</p>
      </div>
      {/* stat tiles */}
      <div className="mt-4 grid grid-cols-2 gap-2 px-4">
        {[
          ["Leads today", "12"],
          ["Approved", "8"],
          ["Pending KYC", "3"],
          ["Earnings", "₹2,400"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-white/8 bg-white/[0.04] p-2.5">
            <p className="text-[8.5px] uppercase tracking-wider text-emerald-100/40">{k}</p>
            <p className="font-sora text-lg font-bold" style={{ color: accent.text }}>
              {v}
            </p>
          </div>
        ))}
      </div>
      {/* lead list */}
      <div className="mt-3 px-4">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-emerald-200/40">
          Recent leads
        </p>
        {[
          ["Rahul K.", "Submitted"],
          ["Meena D.", "KYC done"],
        ].map(([n, st]) => (
          <div
            key={n as string}
            className="mb-2 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5" style={{ color: accent.solid }} />
              <span className="text-[11px] font-semibold text-white">{n as string}</span>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[8.5px] font-bold"
              style={{ background: `${accent.solid}22`, color: accent.text }}
            >
              {st as string}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto px-4 pb-4">
        <div
          className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-center text-[11px] font-bold text-[#06140f]"
          style={{ background: accent.solid }}
        >
          <Users className="h-3.5 w-3.5" />
          Onboard a customer
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Ecosystem flow ribbon                                                      */
/* ========================================================================== */

function FlowRibbon() {
  const steps = [
    { Icon: Store, label: "Connect", sub: "Retailer onboards", color: "#22d3ee" },
    { Icon: Smartphone, label: "Mobile App", sub: "Customer borrows", color: "#fbbf24" },
    { Icon: MapPinned, label: "Collect", sub: "Partner collects", color: "#34d399" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-md sm:p-6"
    >
      <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr_auto_1fr_auto]">
        {steps.map((s, i) => (
          <div key={s.label} className="contents">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${s.color}1f`, color: s.color }}
              >
                <s.Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-sora text-sm font-bold text-white">{s.label}</p>
                <p className="text-[11px] text-emerald-100/50">{s.sub}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden items-center sm:flex">
                <span className="h-px flex-1 bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
                <ArrowRight className="mx-1 h-4 w-4 text-emerald-200/40" />
                <span className="h-px flex-1 bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ========================================================================== */
/* Install + trust footer                                                     */
/* ========================================================================== */

function InstallFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-28 grid gap-6 lg:grid-cols-3"
    >
      {/* install steps */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
        <h3 className="font-sora flex items-center gap-2 text-lg font-bold text-white">
          <Download className="h-5 w-5 text-emerald-300" />
          Installing the Android APK
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            ["01", "Download", "Tap the download button — the .apk saves to your device."],
            ["02", "Allow install", "Enable “Install from unknown sources” when prompted."],
            ["03", "Open & register", "Launch the app and sign in with your Quikkred credentials."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <span className="font-instrument text-3xl italic text-emerald-300/60">{n}</span>
              <p className="font-sora mt-1 text-sm font-bold text-white">{t}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-emerald-100/55">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* trust / support */}
      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/[0.06] p-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-[10.5px] font-bold uppercase tracking-widest text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            RBI-compliant NBFC
          </span>
          <p className="mt-4 text-[13.5px] leading-relaxed text-emerald-50/75">
            All Quikkred apps are distributed directly by Satsai Finance. Only download from this
            official page or your partner onboarding link.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-[13px]">
          <a
            href="tel:+918888882222"
            className="flex items-center gap-2 font-semibold text-emerald-100 transition-colors hover:text-white"
          >
            <Languages className="h-4 w-4 text-emerald-300" />
            Support · +91 88888 82222
          </a>
          <Link
            href="/support"
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-200/80 transition-colors hover:text-white"
          >
            Visit help center
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ========================================================================== */
/* Atmosphere — grain, grid, radial glows                                     */
/* ========================================================================== */

function Atmosphere() {
  return (
    <>
      {/* radial brand glows */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px circle at 12% -5%, rgba(52,211,153,0.16), transparent 55%), radial-gradient(800px circle at 95% 18%, rgba(34,211,238,0.12), transparent 50%), radial-gradient(700px circle at 60% 110%, rgba(251,191,36,0.10), transparent 55%)",
        }}
      />
      {/* faint grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 80%)",
        }}
      />
      {/* grain */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
