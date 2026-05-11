"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Smartphone,
  Shield,
  IndianRupee,
  Target,
  Clock,
  CheckCircle,
  Download,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Zap,
  Navigation,
  CreditCard,
  BarChart3,
  Award,
  Briefcase,
  ArrowRight,
  GraduationCap,
  UserCheck,
  FileCheck,
  Scale,
  Eye,
  AlertTriangle,
  Lock,
  MapPinned,
  ArrowUpRight,
  BadgeCheck,
  Bike,
  Languages,
  Thermometer,
  HeartHandshake,
  Trophy,
  Activity,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from "@/lib/constants/companyInfo";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  highlight?: string;
}

interface ScreeningStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface ComplianceRule {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

// ---------------- Hero phone-screen carousel · 4 deck-faithful screens ----------------
const SCREEN_LABELS = [
  { id: 0, badge: "01 · Home", label: "Available · soft visits" },
  { id: 1, badge: "02 · Case", label: "Reminder · DPD 2" },
  { id: 2, badge: "03 · ID", label: "Show your ID" },
  { id: 3, badge: "04 · Done", label: "Mark complete" },
] as const;

function ScreenFeed() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F7FBF8]">
      <div className="px-5 pt-2 pb-2 flex items-center justify-between text-[10px] font-semibold text-gray-900">
        <span>9:14 AM</span>
        <span>●●●●</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {/* Map mock */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#E7F4ED,#D7EADF)]">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(21,181,126,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(21,181,126,0.18) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          {/* route */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 260" fill="none">
            <path d="M50 230 Q 80 180, 110 170 T 180 110 T 230 60" stroke="#15B57E" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" />
          </svg>
          {/* pins */}
          <div className="absolute" style={{ left: "23%", top: "18%" }}>
            <div className="w-6 h-6 rounded-full bg-[#15B57E] text-white text-[10px] font-bold grid place-items-center shadow-md">1</div>
          </div>
          <div className="absolute" style={{ left: "50%", top: "44%" }}>
            <div className="w-7 h-7 rounded-full bg-amber-400 text-white text-[11px] font-bold grid place-items-center shadow-md animate-pulse">2</div>
          </div>
          <div className="absolute" style={{ left: "60%", top: "62%" }}>
            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 text-gray-700 text-[10px] font-bold grid place-items-center shadow-sm">3</div>
          </div>
          <div className="absolute" style={{ left: "75%", top: "78%" }}>
            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 text-gray-700 text-[10px] font-bold grid place-items-center shadow-sm">4</div>
          </div>
          {/* online pill */}
          <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 flex items-center gap-1.5 border border-gray-200 shadow-sm">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>
            <span className="text-[10px] font-bold text-gray-900">Online</span>
          </div>
        </div>
      </div>
      {/* Bottom sheet */}
      <div className="bg-white -mt-6 rounded-t-3xl shadow-[0_-8px_24px_rgba(11,19,32,0.10)] p-4 z-10 relative">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[9px] uppercase tracking-wider font-bold text-gray-500">Available · soft visits</div>
            <div className="font-bold text-sm text-gray-900">4 nearby · ₹420 potential</div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Track A
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white grid place-items-center text-sm shrink-0">📞</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-gray-900 truncate">Reminder · 1.2 km</div>
              <div className="text-[9px] text-gray-500">DPD 2 · ₹80 · ~12 min</div>
            </div>
            <button className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shrink-0">Accept</button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center text-sm shrink-0">📋</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-gray-900 truncate">Doc pickup · 2.4 km</div>
              <div className="text-[9px] text-gray-500">KYC · ₹100 · ~10 min</div>
            </div>
            <button className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[10px] font-bold shrink-0">View</button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center text-sm shrink-0">📍</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-gray-900 truncate">Field verify · 3.1 km</div>
              <div className="text-[9px] text-gray-500">CPV · ₹150 · ~15 min</div>
            </div>
            <button className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[10px] font-bold shrink-0">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenCaseDetail() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F7FBF8] overflow-y-auto">
      <div className="px-5 pt-2 pb-2 flex items-center justify-between text-[10px] font-semibold text-gray-900">
        <span>9:18 AM</span>
        <span>●●●●</span>
      </div>
      <div className="px-4 pb-2 flex items-center justify-between border-b border-gray-100 pb-3">
        <button className="text-gray-500 text-base">←</button>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Reminder · DPD 2
        </span>
        <div className="w-5" />
      </div>
      <div className="p-4 flex-1">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-3.5">
          <div className="text-[9px] uppercase tracking-wider font-bold text-gray-500">Customer (limited · DPDP)</div>
          <div className="mt-0.5 font-bold text-base text-gray-900">P. Pawar</div>
          <div className="text-[10px] text-gray-500 mt-0.5">House 42 · Vasant Lane · Wakad · 411057</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10px]">
            <div><strong className="text-gray-900 tabular-nums">Day 2</strong> <span className="text-gray-500">overdue</span></div>
            <div><strong className="text-emerald-700 tabular-nums">₹80</strong> <span className="text-gray-500">incentive</span></div>
          </div>
        </div>
        <div className="mt-3 rounded-2xl bg-sky-50 border border-sky-200 p-3">
          <div className="text-[9px] uppercase tracking-wider font-bold text-sky-700">Your task — soft only</div>
          <ul className="mt-1.5 space-y-1 text-[10px] text-gray-700">
            <li className="flex gap-1.5"><span className="text-sky-700">●</span><span>Visit the address · check borrower is at home</span></li>
            <li className="flex gap-1.5"><span className="text-sky-700">●</span><span>Hand printed reminder · take a photo</span></li>
            <li className="flex gap-1.5"><span className="text-sky-700">●</span><span>Friendly · "Aapka payment hai · pay via app"</span></li>
            <li className="flex gap-1.5 text-rose-700"><span>✕</span><span><strong>Don't</strong> ask for cash · don't argue</span></li>
          </ul>
        </div>
        <div className="mt-3">
          <div className="text-[9px] uppercase tracking-wider font-bold text-gray-500">Last contact</div>
          <div className="mt-1.5 rounded-2xl bg-white border border-gray-200 p-2.5 text-[10px] text-gray-700 space-y-1">
            <div>4 May · auto-debit failed · 11:00 PM</div>
            <div>4 May · WA reminder sent · 6:00 PM</div>
          </div>
        </div>
        <button className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-br from-[#15B57E] to-[#0C7A56] text-white font-bold text-xs shadow-md">
          Begin visit · check in
        </button>
      </div>
    </div>
  );
}

function ScreenShowID() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F7FBF8] overflow-y-auto">
      <div className="px-5 pt-2 pb-2 flex items-center justify-between text-[10px] font-semibold text-gray-900">
        <span>9:42 AM</span>
        <span>●●●●</span>
      </div>
      <div className="px-4 pb-3 flex items-center justify-between border-b border-gray-100">
        <button className="text-gray-500 text-base">←</button>
        <span className="font-bold text-xs text-gray-900">Show your ID</span>
        <div className="w-5" />
      </div>
      <div className="p-4">
        {/* ID Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #1FCB91 0%, #0EA38F 50%, #0E84A8 100%)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)" }} />
          <div className="relative p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold tracking-wider">QUIKKRED</div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-[9px] font-bold tracking-wider">VERIFIED PARTNER</span>
            </div>
            <div className="flex items-center gap-3 mt-3.5">
              <div className="w-14 h-16 rounded-lg bg-white/15 border-2 border-white/30 grid place-items-center shrink-0">
                <div className="text-2xl">👤</div>
              </div>
              <div>
                <div className="font-bold text-base">Vikram Sharma</div>
                <div className="text-[10px] opacity-85">Track A · soft tasks</div>
                <div className="text-[9px] opacity-70 font-mono mt-0.5">QK-CP-2026-0421</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between gap-2">
              <div className="text-[9px] opacity-85 leading-tight max-w-[140px]">
                I'm here for a friendly reminder. <strong>Cannot accept cash.</strong> Pay via Quikkred app.
              </div>
              <div className="w-12 h-12 rounded bg-white grid place-items-center shrink-0" style={{ backgroundImage: "linear-gradient(45deg,#0B1320 25%, transparent 25%, transparent 75%, #0B1320 75%), linear-gradient(45deg,#0B1320 25%, transparent 25%, transparent 75%, #0B1320 75%)", backgroundSize: "4px 4px", backgroundPosition: "0 0, 2px 2px" }} />
            </div>
          </div>
        </div>
        <p className="text-[9px] text-gray-500 text-center mt-2.5">Ask borrower to scan the QR with the Quikkred app — they'll see who you are.</p>
        <div className="mt-3 space-y-1.5">
          {[
            { label: "GPS at registered address", note: "📍 within 14 m", checked: true, noteColor: "text-emerald-700" },
            { label: "Borrower acknowledged", note: "Inside · agreed to talk briefly", checked: true, noteColor: "text-gray-500" },
            { label: "Borrower scanned my QR", note: "Trust ✓", checked: false, noteColor: "text-gray-500" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl bg-white border border-gray-200 px-2.5 py-2 flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${c.checked ? "bg-emerald-500" : "bg-white border-2 border-gray-300"} grid place-items-center shrink-0`}>
                {c.checked && <span className="text-white text-[10px] leading-none">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-gray-900 leading-tight">{c.label}</div>
                <div className={`text-[9px] ${c.noteColor} leading-tight`}>{c.note}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 px-4 py-3 rounded-xl bg-gradient-to-br from-[#15B57E] to-[#0C7A56] text-white font-bold text-xs shadow-md">
          Hand over reminder · capture
        </button>
      </div>
    </div>
  );
}

function ScreenComplete() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F7FBF8] overflow-y-auto">
      <div className="px-5 pt-2 pb-2 flex items-center justify-between text-[10px] font-semibold text-gray-900">
        <span>9:54 AM</span>
        <span>●●●●</span>
      </div>
      <div className="px-4 pb-3 flex items-center justify-between border-b border-gray-100">
        <button className="text-gray-500 text-base">←</button>
        <span className="font-bold text-xs text-gray-900">Mark complete</span>
        <div className="w-5" />
      </div>
      <div className="p-4">
        <div className="text-[9px] uppercase tracking-wider font-bold text-gray-500">Outcome</div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button className="rounded-xl bg-emerald-50 border-2 border-emerald-500 p-2.5 text-left">
            <div className="text-base">✓</div>
            <div className="text-[10px] font-bold text-emerald-700 mt-0.5 leading-tight">Delivered + ack.</div>
            <div className="text-[9px] text-gray-600 mt-0.5 leading-tight">Borrower agreed to pay via app</div>
          </button>
          <button className="rounded-xl bg-white border border-gray-200 p-2.5 text-left">
            <div className="text-base">⏰</div>
            <div className="text-[10px] font-bold text-gray-900 mt-0.5">Not at home</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Will retry later</div>
          </button>
          <button className="rounded-xl bg-white border border-gray-200 p-2.5 text-left">
            <div className="text-base">❌</div>
            <div className="text-[10px] font-bold text-gray-900 mt-0.5">Refused / hostile</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Escalate to ops</div>
          </button>
          <button className="rounded-xl bg-white border border-gray-200 p-2.5 text-left">
            <div className="text-base">🏚</div>
            <div className="text-[10px] font-bold text-gray-900 mt-0.5">Wrong address</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Address invalid</div>
          </button>
        </div>
        <div className="mt-3">
          <div className="text-[9px] uppercase tracking-wider font-bold text-gray-500">Photo · borrower with reminder</div>
          <div className="mt-1 rounded-xl bg-[#0B1320] p-2 text-center">
            <div className="aspect-[4/3] bg-[#1A2336] rounded grid place-items-center text-white/40">
              <span className="text-2xl">📷</span>
            </div>
            <div className="text-[8px] text-white/60 mt-1.5">captured · timestamp embedded</div>
          </div>
        </div>
        <div className="mt-3 rounded-2xl text-white p-3.5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #28C887 0%, #15B57E 50%, #0C7A56 100%)" }}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3), transparent 50%)" }} />
          <div className="relative">
            <div className="text-[9px] uppercase tracking-wider opacity-90 font-bold">Earned</div>
            <div className="font-bold text-2xl tabular-nums leading-none mt-1">+ ₹80</div>
            <div className="text-[10px] opacity-90 mt-1">Settled tomorrow T+1 to your bank</div>
          </div>
        </div>
        <button className="w-full mt-3 px-4 py-3 rounded-xl bg-gradient-to-br from-[#15B57E] to-[#0C7A56] text-white font-bold text-xs shadow-md">
          Submit · next case
        </button>
      </div>
    </div>
  );
}

const SCREENS = [ScreenFeed, ScreenCaseDetail, ScreenShowID, ScreenComplete];

export default function CollectPartnerPage() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [screenIdx, setScreenIdx] = useState(0);

  // Auto-cycle through 4 hero screens every 3.6s
  useEffect(() => {
    const id = setInterval(() => {
      setScreenIdx((i) => (i + 1) % SCREENS.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const ActiveScreen = SCREENS[screenIdx];

  const features: Feature[] = [
    {
      title: "GPS-Verified Check-ins",
      description:
        "Automatic location verification within 50 meters of borrower address ensures authentic visits",
      icon: MapPin,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]",
    },
    {
      title: "Truecaller Login",
      description:
        "Secure instant authentication with Truecaller - no OTP needed, just one tap to login",
      icon: Shield,
      color: "text-[#4A66FF]",
      bgColor: "bg-[#E8EDFF]",
    },
    {
      title: "Real-time Case Assignment",
      description:
        "Get notified instantly when new cases are assigned with complete borrower details",
      icon: Zap,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FFE8E8]",
    },
    {
      title: "Built-in Navigation",
      description:
        "One-tap navigation to borrower location with Google Maps integration",
      icon: Navigation,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]",
    },
    {
      title: "UPI Payment Collection",
      description:
        "Generate payment links instantly and collect payments via UPI directly in the app",
      icon: CreditCard,
      color: "text-[#4A66FF]",
      bgColor: "bg-[#E8EDFF]",
    },
    {
      title: "Performance Dashboard",
      description:
        "Track your visits, collections, and earnings in real-time with detailed analytics",
      icon: BarChart3,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FFE8E8]",
    },
  ];

  const howItWorks: Step[] = [
    {
      number: "01",
      title: "Download & Register",
      description:
        "Download the app and register instantly with Truecaller verification",
      icon: Download,
    },
    {
      number: "02",
      title: "Get Case Assignments",
      description:
        "Receive collection cases assigned to your pincode areas",
      icon: Briefcase,
    },
    {
      number: "03",
      title: "Visit & Check-in",
      description:
        "Navigate to borrower location and check-in with GPS verification",
      icon: MapPin,
    },
    {
      number: "04",
      title: "Collect & Earn",
      description:
        "Collect payment, record disposition, and earn attractive incentives",
      icon: IndianRupee,
    },
  ];

  const benefits: Benefit[] = [
    {
      title: "Earn More Than Delivery",
      description:
        "Collection partners earn ₹15,000-50,000/month compared to ₹8,000-12,000 in delivery jobs",
      icon: IndianRupee,
      highlight: "₹15K-50K/mo",
    },
    {
      title: "Professional Career Growth",
      description:
        "Grow from field agent to team lead to area manager with a clear promotion path",
      icon: TrendingUp,
    },
    {
      title: "Flexible Schedule",
      description:
        "Choose your own working hours. No fixed shifts, no minimum hours — work when you want",
      icon: Clock,
    },
    {
      title: "Zero Investment Required",
      description:
        "No vehicle rental, no deposit, no uniform cost. Just bring your smartphone",
      icon: Award,
    },
    {
      title: "Weekly Payouts",
      description:
        "Guaranteed weekly settlement every Friday — no waiting until month-end",
      icon: CreditCard,
    },
    {
      title: "Training & Certification",
      description:
        "Free RBI-compliant collection training and certification to boost your career",
      icon: GraduationCap,
    },
  ];

  const screeningSteps: ScreeningStep[] = [
    {
      title: "Identity Verification",
      description: "Aadhaar + PAN verification through our secure platform",
      icon: UserCheck,
    },
    {
      title: "Background Check",
      description: "Criminal record and address verification",
      icon: Shield,
    },
    {
      title: "Reference Check",
      description: "Two personal/professional references verified",
      icon: Users,
    },
    {
      title: "Mandatory Training",
      description:
        "Online training on RBI collection guidelines and code of conduct",
      icon: GraduationCap,
    },
    {
      title: "Assessment",
      description: "Pass the collection guidelines and ethics assessment",
      icon: FileCheck,
    },
    {
      title: "30-Day Probation",
      description:
        "Supervised probation period with an assigned mentor",
      icon: Target,
    },
  ];

  const complianceRules: ComplianceRule[] = [
    {
      title: "RBI Fair Practices Code",
      description:
        "All partners must strictly follow RBI's Fair Practices Code for collection activities",
      icon: Scale,
    },
    {
      title: "No Harassment or Intimidation",
      description:
        "No threatening, abusive language, or intimidation of any kind. Zero tolerance policy",
      icon: AlertTriangle,
    },
    {
      title: "Permitted Hours Only",
      description:
        "Contact borrowers only between 8:00 AM and 7:00 PM as per RBI guidelines",
      icon: Clock,
    },
    {
      title: "Identity Disclosure",
      description:
        "Must identify yourself clearly and show your Quikkred partner ID at every visit",
      icon: BadgeCheck,
    },
    {
      title: "No Third-Party Disclosure",
      description:
        "Cannot discuss borrower's debt with family members, friends, or employer",
      icon: Eye,
    },
    {
      title: "Data Privacy & Confidentiality",
      description:
        "All borrower data is confidential, governed by the IT Act 2000. Breach leads to termination",
      icon: Lock,
    },
    {
      title: "GPS & Photo Evidence",
      description:
        "All field visits are GPS-tracked and photo-documented for transparency and accountability",
      icon: MapPinned,
    },
    {
      title: "Escalation Protocol",
      description:
        "Disputes must be escalated to the team lead — never resolved through confrontation",
      icon: ArrowUpRight,
    },
  ];

  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => {
      window.open("/downloads/quikkred-collect-v1.2.0.apk", "_blank");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ---------------- HERO · deck-inspired (route, live cards, pulse) ---------------- */}
      <section className="relative bg-gradient-to-br from-[#0f4a3a] via-[#1a5f4a] to-[#25B181] text-white pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Soft radial accents */}
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 10%, rgba(74,232,178,0.30), transparent 45%), radial-gradient(circle at 85% 70%, rgba(15,118,110,0.40), transparent 55%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Animated route SVG behind everything · only on lg+ */}
        <svg
          className="hidden lg:block absolute right-[5%] top-[12%] w-[640px] h-[480px] pointer-events-none opacity-[0.18]"
          viewBox="0 0 640 480"
          fill="none"
        >
          <path
            d="M40 380 C 120 280, 200 360, 280 240 S 420 80, 520 140 S 600 280, 580 360"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-28"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="40" cy="380" r="8" fill="#34d399" />
          <circle cx="280" cy="240" r="10" fill="#fbbf24">
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="520" cy="140" r="8" fill="white" opacity="0.6" />
        </svg>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* LEFT — copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                </span>
                Quikkred Collect · Field Partner Network
              </span>
              <h1 className="font-sora font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.02] tracking-tight mb-6">
                From{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 italic font-bold">"I drive Rapido"</span>
                </span>
                <br />
                to <span className="text-emerald-200">verified Quikkred partner</span>
                <br />
                <span className="text-white/70 text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold">
                  in 24 hours.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed mb-8 max-w-2xl">
                Join India's largest two-track field partner network — sourced from a{" "}
                <strong className="text-white">7M-rider gig pool</strong>, paid via UPI within{" "}
                <strong className="text-white">4 hours</strong>, and available in{" "}
                <strong className="text-white">13 Indian languages</strong>. Same emerald brand,
                much richer career.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-3 px-7 py-4 bg-white text-[#1a5f4a] rounded-xl font-bold text-base sm:text-lg shadow-2xl shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all"
                >
                  <Download className="w-5 h-5" />
                  {downloadStarted ? "Starting Download..." : "Download App"}
                </motion.button>
                <Link href="#how-it-works">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/15 transition-all"
                  >
                    See the architecture
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>

              {/* Trust + deck stats strip */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
                {[
                  { icon: Shield, v: "RBI", l: "Satsai NBFC · B-14.01646" },
                  { icon: Users, v: "7M", l: "gig-pool sourcing universe" },
                  { icon: IndianRupee, v: "≤4 hrs", l: "UPI payout · visit → bank" },
                  { icon: Languages, v: "13 langs", l: "Hindi · Tamil · 11 more" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.v}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                      className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                        <span className="font-bold text-sm tabular-nums text-white">{s.v}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-white/70 leading-snug">{s.l}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* RIGHT — phone + floating live cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-center relative lg:col-span-5"
            >
              <div className="relative">
                {/* Floating · Online status pill (top-left of phone) */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-3 -left-16 z-30"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-2xl shadow-emerald-900/40 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-bold text-gray-900">Online · Pune</span>
                  </div>
                </motion.div>

                {/* Floating · Earnings live card (right side) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-[28%] -right-16 z-30 w-44"
                >
                  <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl px-4 py-3 shadow-2xl shadow-emerald-900/40 border border-emerald-100">
                    <div className="text-[9px] uppercase tracking-wider font-bold text-emerald-700">
                      Just earned
                    </div>
                    <div className="mt-0.5 text-xl font-bold text-gray-900 tabular-nums leading-none">
                      + ₹150
                    </div>
                    <div className="mt-1 text-[10px] text-gray-500 leading-snug">
                      Field verify · R. Naidu · 12 min
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[9px] text-emerald-700">
                      <BadgeCheck className="w-3 h-3" />
                      <span className="font-semibold">UPI in ~3 hrs</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating · Mini next-visit card (bottom-left) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="absolute bottom-[18%] -left-20 z-30 w-44"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl shadow-emerald-900/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 grid place-items-center text-white text-sm shrink-0">
                        📍
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                          Next · 0.4 km
                        </div>
                        <div className="text-xs font-bold text-gray-900 truncate">
                          P. Pawar · Reminder
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-[10px] text-gray-500">DPD 2</span>
                      <span className="text-xs font-bold text-emerald-700 tabular-nums">+ ₹80</span>
                    </div>
                  </div>
                </motion.div>

                {/* Phone Mockup · 4-screen rotating carousel */}
                <div className="relative w-[300px] h-[620px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-[6px] shadow-2xl ring-1 ring-white/10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-30" />
                  <div className="w-full h-full bg-white rounded-[2.7rem] overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={screenIdx}
                        initial={{ opacity: 0, x: 30, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -30, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        <ActiveScreen />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Progress dots · below phone */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                    {SCREEN_LABELS.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => setScreenIdx(i)}
                        aria-label={`Screen ${i + 1}`}
                        className="group relative h-2 rounded-full transition-all"
                        style={{ width: i === screenIdx ? "32px" : "8px" }}
                      >
                        <span
                          className={`absolute inset-0 rounded-full transition-colors ${
                            i === screenIdx ? "bg-white" : "bg-white/30 group-hover:bg-white/50"
                          }`}
                        />
                        {i === screenIdx && (
                          <motion.span
                            key={`pg-${screenIdx}`}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.6, ease: "linear" }}
                            className="absolute inset-y-0 left-0 rounded-full bg-emerald-300"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Screen label · below dots */}
                  <div className="absolute -bottom-[68px] left-1/2 -translate-x-1/2 text-center z-30">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`lbl-${screenIdx}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3 }}
                        className="whitespace-nowrap"
                      >
                        <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-emerald-200">
                          {SCREEN_LABELS[screenIdx].badge}
                        </div>
                        <div className="text-[11px] text-white/70 mt-0.5">
                          {SCREEN_LABELS[screenIdx].label}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Become a Collection Partner */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#1a5f4a] rounded-full text-sm font-semibold mb-4">
            Why Join Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
            Why Become a Collection Partner?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            More than just a gig — build a professional career in financial
            services
          </p>
        </motion.div>

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
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#D3F1EB] rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-[#1a5f4a]" />
                </div>
                {benefit.highlight && (
                  <div className="text-2xl font-bold text-[#1a5f4a] mb-2">
                    {benefit.highlight}
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#1a5f4a] rounded-full text-sm font-semibold mb-4">
            App Features
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
            Everything You Need in One App
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Powerful features designed to make your collection visits efficient
            and rewarding
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
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
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-5`}
                >
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-[#1a5f4a] text-white py-16 sm:py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              How It Works
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
              Start earning in 4 simple steps
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-white/30" />
                  )}

                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                      <Icon className="w-10 h-10 text-white" />
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[#1a5f4a] font-bold text-sm">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- TWO TRACKS · Verified Partner vs DRA Partner ---------------- */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> Two-track partner system
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 leading-tight">
            Verified Partner <span className="text-gray-400">·</span> DRA Partner
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
            We run the largest two-track collection network in Indian retail credit. Track A drives
            soft-recovery from a <strong className="text-emerald-700">7M-rider gig pool</strong>{" "}
            across Swiggy, Zomato and Rapido. Track B is staffed by IIBF DRA-certified specialists
            for hard cases. The app surfaces only what each track is allowed to do.
          </p>
        </motion.div>

        {/* Track strip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {/* Track A */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/40 via-white to-cyan-50/40 p-6 sm:p-8 shadow-[0_12px_44px_-16px_rgba(37,177,129,0.22)]"
          >
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-[0.14em] uppercase">
              Track A · Gig
            </span>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 grid place-items-center shrink-0">
                <Bike className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sora font-bold text-xl text-gray-900">Verified Partner</h3>
                <p className="mt-1 text-sm text-gray-600">For DPD 0–60 soft visits · reminder &amp; engagement</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm text-gray-700">
              {[
                "Sourced from 7M gig-economy pool — Swiggy / Zomato / Rapido riders, retired postal staff, off-duty hours",
                "On-boarded in 24 hours · KYC bundle pulled from existing gig profile",
                "Police verification + IDfy background check + branded ID card",
                "Permitted: ID-only knock visits · borrower self-pays via NBFC-owned QR",
                "Cannot collect cash, cannot enter homes, cannot demand payment",
                "Earnings: same-day UPI payout · per-visit fee + on-time bonus",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Track B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="relative rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 p-6 sm:p-8 shadow-[0_12px_44px_-16px_rgba(74,102,255,0.22)]"
          >
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-[0.14em] uppercase">
              Track B · DRA
            </span>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 grid place-items-center shrink-0">
                <Scale className="w-5 h-5 text-indigo-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sora font-bold text-xl text-gray-900">DRA Partner</h3>
                <p className="mt-1 text-sm text-gray-600">For DPD 60+ hard cases · NPA recovery · legal interface</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm text-gray-700">
              {[
                "IIBF Debt Recovery Agent certification mandatory · 100-hour course + exam",
                "Six-monthly RBI Fair Practices refresher · auto-blocked on certificate lapse",
                "Permitted: in-person discussions · settlement negotiations · pre-litigation notices",
                "Recorded calls + AI tone monitor on every conversation · WORM audit trail",
                "Workplace, time-window and conflict-of-interest gates enforced by the app",
                "Earnings: base retainer + recovery-tier commission · tax pre-computed",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto"
        >
          {[
            { v: "7M", l: "gig pool · Track A sourcing universe", icon: Users },
            { v: "~70% ↓", l: "cost per soft visit vs DRA-only model", icon: TrendingUp },
            { v: "13 langs", l: "in-app · Hindi · Marathi · Tamil · Bengali · 9 more", icon: Languages },
            { v: "100%", l: "calls recorded · AI tone monitored · WORM audit", icon: Activity },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.v}
                className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 grid place-items-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-gray-900 tabular-nums">{s.v}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{s.l}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ---------------- VISIT TYPE TAXONOMY ---------------- */}
      <section className="bg-[#F8FAFB] py-12 sm:py-16 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-12"
          >
            <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              02 · Visit-type taxonomy
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 leading-tight max-w-3xl">
              Cases routed by type. The app surfaces only what each track is allowed.
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Every case has a <code className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-emerald-700 font-mono">visit_type</code> set by the risk engine. The partner app's case-feed
              query filters by your track. The API rejects mismatched assignments. Soft visits flow
              to Track A; cash and NPA cases stay with Track B DRA-certified partners.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              {
                emoji: "📞",
                title: "Reminder visit",
                window: "DPD 1–3 · friendly nudge",
                track: "A + B",
                trackColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                time: "~12 min",
                fee: "₹80",
                accent: "border-emerald-200",
              },
              {
                emoji: "📋",
                title: "Document pickup",
                window: "KYC re-verify · address proof",
                track: "A + B",
                trackColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                time: "~10 min",
                fee: "₹100",
                accent: "border-emerald-200",
              },
              {
                emoji: "📍",
                title: "Field verification",
                window: "CPV · address & identity",
                track: "A + B",
                trackColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                time: "~15 min",
                fee: "₹150",
                accent: "border-emerald-200",
              },
              {
                emoji: "💵",
                title: "Cash collection",
                window: "DPD 4–30 · cure window",
                track: "B only",
                trackColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
                time: "~25 min",
                fee: "₹250",
                accent: "border-indigo-200",
              },
              {
                emoji: "⚠️",
                title: "NPA recovery",
                window: "DPD 90+ · hard recovery",
                track: "B only",
                trackColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
                time: "~40 min",
                fee: "₹500",
                accent: "border-indigo-200",
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl bg-white border ${v.accent} p-4 sm:p-5 hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.12)] transition-all`}
              >
                <div className="text-3xl leading-none">{v.emoji}</div>
                <h3 className="mt-3 font-sora font-bold text-base text-gray-900 leading-tight">
                  {v.title}
                </h3>
                <p className="mt-1 text-[11px] text-gray-500 leading-snug">{v.window}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span
                    className={`inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-md border ${v.trackColor}`}
                  >
                    {v.track}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">
                    <Clock className="w-3 h-3 inline -mt-0.5 mr-0.5" /> {v.time}
                  </span>
                  <span className="font-bold text-gray-900 tabular-nums">{v.fee}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Auto-promotion path */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-cyan-50 to-indigo-50 border border-emerald-200 p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 grid place-items-center shrink-0">
                <Trophy className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-emerald-700">
                  Auto-promotion path · Track A → Track B
                </div>
                <h4 className="mt-1 font-sora font-bold text-base sm:text-lg text-gray-900">
                  200+ soft visits · 95%+ compliance · 12 months on platform → IIBF DRA upgrade
                </h4>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  A Verified Partner who clears the thresholds is surfaced an in-app{" "}
                  <strong className="text-emerald-700">"Upgrade to DRA"</strong> CTA — IIBF training
                  booked, exam scheduled, fees subsidised. Most successful gig partners convert in
                  ~9 months.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screening & Onboarding Process */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#E8EDFF] text-[#4A66FF] rounded-full text-sm font-semibold mb-4">
            Onboarding
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
            Screening & Onboarding Process
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            We ensure every partner meets our quality and compliance standards
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {screeningSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E8EDFF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#4A66FF]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold mb-1">
                      STEP {index + 1}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Requirements */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-[#E8EDFF] text-[#4A66FF] rounded-full text-sm font-semibold mb-4">
              Eligibility
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Who Can Join?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Basic Requirements
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">Age 21 years or above</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Valid Aadhaar & PAN card
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Android smartphone with internet
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Own two-wheeler for field visits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">Clean criminal record</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4A66FF]" />
                Ideal Candidates
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Ex-bank/NBFC collection staff
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Field sales experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Local area knowledge in your city
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Good communication (Hindi + local language)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------------- 8 FAIR PRACTICES CODE PILLARS · with track markers ---------------- */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-12"
          >
            <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              03 · RBI compliance · enforced by the app
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 leading-tight max-w-3xl">
              Eight pillars from the Fair Practices Code.
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              Mapped to either a <strong className="text-rose-700">hard block</strong>, a{" "}
              <strong className="text-amber-700">forced action</strong>, or an{" "}
              <strong className="text-indigo-700">immutable log</strong>. Each pillar calls out
              what's enforced for which track.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                n: "1",
                title: "Trained & certified",
                body: "DRA only · IIBF cert + 100h. Track A does 30-min in-app modules.",
                pills: [
                  { label: "A · 30 min", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { label: "B · IIBF", class: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                ],
              },
              {
                n: "2",
                title: "Background verified",
                body: "A · IDfy/OCEAN · 24–48h. B · PCC + 2 character refs · 5–7 days.",
                pills: [
                  { label: "A · BG check", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { label: "B · PCC", class: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                ],
              },
              {
                n: "3",
                title: "Time-window 8 AM – 7 PM",
                body: "App-side clock blocks calls + visits outside hours. Festival calendars enforced.",
                pills: [{ label: "Both tracks · hard block", class: "bg-amber-50 text-amber-700 border-amber-200" }],
              },
              {
                n: "4",
                title: "Identifiable on visit",
                body: "QR-rotating partner ID. Borrower scans to verify track and certification.",
                pills: [{ label: "QR-verified", class: "bg-indigo-50 text-indigo-700 border-indigo-200" }],
              },
              {
                n: "5",
                title: "No threats · no abuse",
                body: "Pre-approved scripts in 13 languages. AI tone monitor flags violations live during calls.",
                pills: [{ label: "AI-moderated", class: "bg-cyan-50 text-cyan-700 border-cyan-200" }],
              },
              {
                n: "6",
                title: "Workplace · last resort",
                body: "DRA only. Three verified home attempts must be logged before the workplace-visit CTA unlocks.",
                pills: [{ label: "B only · gated", class: "bg-indigo-50 text-indigo-700 border-indigo-200" }],
              },
              {
                n: "7",
                title: "Privacy + DPDP",
                body: "No discussing dues with neighbours. Track A sees minimum data — name, address, visit type only.",
                pills: [{ label: "DPDP-compliant", class: "bg-slate-50 text-slate-700 border-slate-200" }],
              },
              {
                n: "8",
                title: "Grievance redressal",
                body: "Borrower can flag misconduct in-app. Nodal Officer reviews · 30-day SLA · auto-escalation if missed.",
                pills: [{ label: "SLA-tracked", class: "bg-rose-50 text-rose-700 border-rose-200" }],
              },
            ].map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-white border border-gray-200 p-5 hover:border-gray-300 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 grid place-items-center text-rose-700 font-bold text-sm tabular-nums">
                  {p.n}
                </div>
                <h3 className="mt-3 font-sora font-bold text-base text-gray-900 leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">{p.body}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.pills.map((pill) => (
                    <span
                      key={pill.label}
                      className={`inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-md border ${pill.class}`}
                    >
                      {pill.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 rounded-xl bg-[#1a5f4a]/5 border border-[#1a5f4a]/20 p-5 text-center"
          >
            <p className="text-sm text-gray-700">
              Quikkred operates under{" "}
              <span className="font-semibold">Satsai Finlease Private Limited</span> (RBI
              Registration: B-14.01646). Every visit is logged with geo-stamp, recorded calls and a
              WORM audit trail. The Nodal Officer is reachable at{" "}
              <Link href="/nodal-officer" className="text-emerald-700 underline">
                /nodal-officer
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------------- SAFETY · WELLBEING · PERFORMANCE ---------------- */}
      <section className="bg-gradient-to-br from-emerald-50/30 via-white to-cyan-50/30 py-12 sm:py-16 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              <HeartHandshake className="w-3 h-3" /> Safety · wellbeing · growth
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 leading-tight">
              Most gig platforms ignore the partner's body.
              <br />
              <span className="text-emerald-700">We don't.</span>
            </h2>
            <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              Heat alerts, mandatory breaks, on-duty accident insurance, a Quick-SOS button, and a
              transparent scoring system that's gentle by design. The app protects you while you do
              the work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Heat-stress warning",
                body: "When ambient temp crosses 38°C, the app prompts a 15-min cool-down before the next visit. Cases auto-defer; supervisor is notified. No penalty.",
                icon: Thermometer,
                accent: "bg-amber-50 border-amber-200 text-amber-700",
              },
              {
                title: "Mandatory break gate",
                body: "After 4 hours of continuous field work, the app blocks new assignments for 30 minutes. Counts toward the daily-target multiplier.",
                icon: Clock,
                accent: "bg-cyan-50 border-cyan-200 text-cyan-700",
              },
              {
                title: "On-duty insurance",
                body: "Accident cover live whenever you're on a visit. Group personal-accident policy underwritten by a public-sector insurer. Beneficiary at onboarding.",
                icon: Stethoscope,
                accent: "bg-rose-50 border-rose-200 text-rose-700",
              },
              {
                title: "Quick-SOS",
                body: "One-tap panic button → location pinged to supervisor + nearest field-team peer + Quikkred ops. Borrower visit auto-paused. Recorded as incident.",
                icon: AlertTriangle,
                accent: "bg-orange-50 border-orange-200 text-orange-700",
              },
              {
                title: "Performance score · gentle",
                body: "Visits completed × on-time bonus × tone score. Anonymous leaderboard, no naming-and-shaming. Bronze → Silver → Gold tiers reset monthly.",
                icon: Trophy,
                accent: "bg-emerald-50 border-emerald-200 text-emerald-700",
              },
              {
                title: "Same-day UPI payout",
                body: "Earnings settle within hours of end-of-day check-out. TDS pre-computed. Annual Form 16-A in the app. Withdraw any time above ₹100.",
                icon: IndianRupee,
                accent: "bg-indigo-50 border-indigo-200 text-indigo-700",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-white border border-gray-200 p-5 sm:p-6 hover:border-gray-300 transition-all"
                >
                  <div
                    className={`w-11 h-11 rounded-xl grid place-items-center border ${c.accent} mb-4`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-sora font-bold text-base text-gray-900">{c.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{c.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- EARNINGS · TRANSPARENT, SAME-DAY, GAMIFIED ---------------- */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-12"
          >
            <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              07 · Earnings & payouts
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 leading-tight max-w-3xl">
              Money, transparent — paid same-day, taxes pre-computed, incentives gamified.
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              Gig workers care about cash velocity. Each visit pays out within 4 hours of completion
              via UPI. Weekly statements are RBI-friendly with TDS deducted at source under{" "}
              <strong>Section 194O</strong> for partners earning above ₹20,000/month.
            </p>
          </motion.div>

          {/* SLA stat row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {[
              {
                k: "SLA · payout",
                v: "≤ 4 hrs",
                note: "visit → UPI · same day",
                accent: "border-l-emerald-500",
              },
              {
                k: "Floor pay",
                v: "₹80",
                note: "per accepted reminder",
                accent: "border-l-emerald-500",
              },
              {
                k: "Hard recovery",
                v: "2 – 4%",
                note: "DRA only · tiered on cleared amount",
                accent: "border-l-indigo-500",
              },
              {
                k: "TDS",
                v: "Section 194O",
                note: "auto · Form 26AS · Form 16A in app",
                accent: "border-l-amber-500",
              },
            ].map((s) => (
              <div
                key={s.k}
                className={`bg-white border border-gray-200 ${s.accent} border-l-4 rounded-xl p-4`}
              >
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  {s.k}
                </div>
                <div className="mt-1 font-sora font-bold text-xl text-gray-900 tabular-nums">
                  {s.v}
                </div>
                <div className="mt-0.5 text-[11px] text-gray-500 leading-snug">{s.note}</div>
              </div>
            ))}
          </div>

          {/* Earnings breakdown card · mock weekly statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-5"
          >
            {/* Weekly statement card */}
            <div className="lg:col-span-3 rounded-2xl bg-gradient-to-br from-emerald-50/40 via-white to-cyan-50/40 border border-emerald-200 p-6 sm:p-8">
              <div className="flex items-baseline justify-between mb-1">
                <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-emerald-700">
                  Sample weekly statement · 32 visits
                </div>
                <div className="text-[11px] text-gray-500 tabular-nums">28 Apr → 4 May</div>
              </div>
              <div className="mt-3 text-4xl sm:text-5xl font-bold text-gray-900 tabular-nums leading-none">
                ₹ 8,640
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Settled to ICICI ●●3421 on 5 May 11:02 AM · IMPS
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200 space-y-2.5 text-sm">
                {[
                  { label: "Visits (32)", value: "₹ 7,420", sign: "" },
                  { label: "Streak bonus · 7-day", value: "+ ₹ 750", sign: "pos" },
                  { label: "Multi-language bonus", value: "+ ₹ 200", sign: "pos" },
                  { label: "Weekend hours bonus", value: "+ ₹ 480", sign: "pos" },
                  { label: "TDS · 1% · Section 194O", value: "– ₹ 88", sign: "neg" },
                  { label: "Equipment lease (optional)", value: "– ₹ 120", sign: "neg" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-baseline justify-between"
                  >
                    <span className="text-gray-600">{r.label}</span>
                    <span
                      className={`font-bold tabular-nums ${
                        r.sign === "pos"
                          ? "text-emerald-700"
                          : r.sign === "neg"
                            ? "text-rose-700"
                            : "text-gray-900"
                      }`}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white border border-gray-200 p-3 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200 grid place-items-center shrink-0">
                    <FileCheck className="w-4 h-4 text-cyan-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900">Form 16A · Q1 FY26</div>
                    <div className="text-[10px] text-gray-500">TDS auto-filed · ready in 14 days</div>
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-3 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 grid place-items-center shrink-0">
                    <BadgeCheck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900">7-day streak active</div>
                    <div className="text-[10px] text-gray-500">+ ₹250 weekly streak bonus</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column · bonus types */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl bg-white border border-gray-200 p-5 sm:p-6">
                <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-emerald-700">
                  How bonuses stack
                </div>
                <h3 className="mt-2 font-sora font-bold text-lg text-gray-900">
                  Five ways to earn more
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    {
                      t: "7-day streak",
                      v: "+ ₹250",
                      note: "every consecutive 7 days with ≥ 4 cleared visits",
                    },
                    {
                      t: "Multi-language",
                      v: "+ ₹200",
                      note: "interact with borrowers in 2+ Indian languages weekly",
                    },
                    {
                      t: "Weekend hours",
                      v: "+ ₹15/visit",
                      note: "Saturday & Sunday cleared visits earn a top-up",
                    },
                    {
                      t: "Top 10% leaderboard",
                      v: "Gold tier",
                      note: "monthly · anonymous · access to higher-fee visit pools",
                    },
                    {
                      t: "Refer a partner",
                      v: "₹500",
                      note: "credited after their first 10 cleared visits",
                    },
                  ].map((b) => (
                    <li
                      key={b.t}
                      className="flex items-baseline justify-between gap-3 border-b border-dashed border-gray-200 pb-2.5 last:border-0"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">{b.t}</div>
                        <div className="text-[11px] text-gray-500 leading-snug">{b.note}</div>
                      </div>
                      <div className="font-bold text-emerald-700 tabular-nums text-sm shrink-0">
                        {b.v}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- DESIGN LANGUAGE · 13 INDIAN SCRIPTS ---------------- */}
      <section className="bg-gradient-to-br from-emerald-50/20 via-white to-cyan-50/20 py-12 sm:py-16 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-10"
          >
            <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              00.5 · Design language
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 leading-tight max-w-3xl">
              High-tech yet simple.{" "}
              <span className="text-emerald-700">Indian by default.</span>
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              The app ships in 13 Indian scripts at v1. The borrower sees the partner's chosen
              language; pre-approved scripts auto-translate into the borrower's language with one tap.
              No machine translation in the loop — every script is human-curated and FPC-reviewed.
            </p>
          </motion.div>

          {/* Language chip grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { script: "English", latin: "EN" },
              { script: "हिन्दी", latin: "Hindi" },
              { script: "मराठी", latin: "Marathi" },
              { script: "தமிழ்", latin: "Tamil" },
              { script: "తెలుగు", latin: "Telugu" },
              { script: "বাংলা", latin: "Bengali" },
              { script: "ગુજરાતી", latin: "Gujarati" },
              { script: "ಕನ್ನಡ", latin: "Kannada" },
              { script: "മലയാളം", latin: "Malayalam" },
              { script: "ਪੰਜਾਬੀ", latin: "Punjabi" },
              { script: "ଓଡ଼ିଆ", latin: "Odia" },
              { script: "অসমীয়া", latin: "Assamese" },
              { script: "اُردُو", latin: "Urdu" },
            ].map((l, i) => (
              <motion.div
                key={l.latin}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.025 }}
                className="bg-white rounded-xl border border-gray-200 px-3 py-3 sm:py-4 text-center hover:border-emerald-300 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)] transition-all"
              >
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  {l.script}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">
                  {l.latin}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live comms features strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                title: "Recorded · in-app calls",
                body: "Every borrower conversation is captured · stored in WORM audit · retained per RBI norms.",
                icon: Activity,
              },
              {
                title: "AI tone monitor · live",
                body: "Speech analysis flags raised voice, threats, or out-of-script language in real time. Supervisor pinged.",
                icon: HeartHandshake,
              },
              {
                title: "Live translator overlay",
                body: "Borrower speaks Marathi · partner reads Hindi · suggested response in Marathi. No machine voice — just text aid.",
                icon: Languages,
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="rounded-2xl bg-white border border-gray-200 p-5 hover:border-emerald-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 grid place-items-center">
                    <Icon className="w-4 h-4 text-cyan-700" />
                  </div>
                  <h3 className="mt-3 font-sora font-bold text-base text-gray-900">{c.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#1a5f4a] to-[#25B181] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-95 max-w-xl mx-auto">
                Download Quikkred Collect app now and start your journey as a
                collection partner
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-10 py-5 bg-white text-[#1a5f4a] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
              >
                <Download className="w-6 h-6" />
                Download APK (81 MB)
              </motion.button>

              <p className="text-white/70 text-sm mt-4">
                Android 8.0+ required • Truecaller app needed for login
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-sora mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-8">
              Our partnership team is here to help you get started
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${COMPANY_PHONE_TEL}`}>
                <button className="w-full sm:w-auto px-8 py-4 bg-[#1a5f4a] text-white rounded-xl font-semibold hover:bg-[#25B181] transition-all flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  {COMPANY_PHONE_DISPLAY}
                </button>
              </a>
              <a href="mailto:collect@quikkred.in">
                <button className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  collect@quikkred.in
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-8 sm:h-12" />
    </div>
  );
}
