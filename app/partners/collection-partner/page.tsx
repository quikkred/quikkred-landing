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

// ---------------- Hero phone-screen carousel · DECK-EXACT markup ----------------
// CSS lifted verbatim from quikkred-platform-deck/collection-partner-app.html, scoped
// to .deck-host so it doesn't bleed into the rest of the landing page.
const DECK_CSS = `
.deck-host {
  --bg:#F7FBF8; --surface:#FFFFFF;
  --ink-900:#0B1320; --ink-700:#2C3B53; --ink-500:#5C6A82; --ink-400:#8C97AB; --ink-300:#B8C0CD; --ink-200:#D6DCE4;
  --line:#E4E8EE; --line-2:#EDF0F4; --line-3:#F4F6FA;
  --a-50:#ECFCF3; --a-100:#D0F5DF; --a-300:#5FDC9D; --a-500:#15B57E; --a-600:#0E9468; --a-700:#0C7A56;
  --b-50:#EEF2FF; --b-100:#DDE2FE; --b-500:#4F46E5; --b-600:#4338CA; --b-700:#3730A3; --b-900:#1E1B4B;
  --warn-50:#FFFBEB; --warn-500:#F59E0B; --warn-700:#92400E;
  --danger-50:#FEF2F2; --danger-500:#EF4444; --danger-700:#991B1B;
  --info-50:#ECFEFF; --info-500:#0EA5E9; --info-700:#0369A1;
  --grad-a: linear-gradient(135deg,#1FCB91 0%,#0EA38F 50%,#0E84A8 100%);
  --grad-money: linear-gradient(135deg,#28C887 0%,#15B57E 50%,#0C7A56 100%);
  --el-1: 0 1px 2px rgba(11,19,32,0.04);
  --el-2: 0 1px 2px rgba(11,19,32,0.04), 0 4px 12px rgba(11,19,32,0.05);
  --el-3: 0 2px 4px rgba(11,19,32,0.05), 0 12px 28px rgba(11,19,32,0.08);
  --el-pop: 0 4px 8px rgba(11,19,32,0.08), 0 24px 64px rgba(11,19,32,0.18);
  --el-a: 0 1px 2px rgba(11,19,32,0.04), 0 12px 28px rgba(21,181,126,0.18), 0 24px 48px rgba(11,19,32,0.06);
}
.deck-host .display { font-family: 'IBM Plex Sans','Inter',sans-serif; letter-spacing:-0.03em; font-weight:700; }
.deck-host .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.deck-host .tnum { font-variant-numeric: tabular-nums; }

.deck-host .pixel { width: 380px; height: 800px; border-radius: 38px; background:#0B1320; padding: 10px; box-shadow: var(--el-pop), inset 0 0 0 2px #1A2336; position: relative; }
.deck-host .pixel-screen { width: 100%; height: 100%; border-radius: 30px; overflow: hidden; background: var(--bg); position: relative; display: flex; flex-direction: column; color: var(--ink-900); }
.deck-host .pixel-screen::before { content:''; position:absolute; top:14px; left:50%; transform:translateX(-50%); width:9px; height:9px; border-radius:99px; background:#0B1320; box-shadow: 0 0 0 2px #1A2336; z-index:10; }
.deck-host .pixel-status { height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 12px 22px 4px; font-size: 11px; font-weight: 600; color: var(--ink-900); }
.deck-host .pixel-body { flex: 1; overflow: hidden; position: relative; display: flex; flex-direction: column; }

.deck-host .pill { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 600; line-height: 1; }
.deck-host .pill .dot { width: 6px; height: 6px; border-radius: 99px; }
.deck-host .pill-a { background: var(--a-50); border: 1px solid rgba(21,181,126,0.20); color: var(--a-700); }
.deck-host .pill-a .dot { background: var(--a-500); }
.deck-host .pill-info { background: var(--info-50); border: 1px solid rgba(14,165,233,0.25); color: var(--info-700); }
.deck-host .pill-info .dot { background: var(--info-500); }
.deck-host .pill-danger { background: var(--danger-50); border: 1px solid rgba(239,68,68,0.25); color: var(--danger-700); }
.deck-host .pill-danger .dot { background: var(--danger-500); }

.deck-host .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 18px; border-radius: 12px; font-weight: 600; font-size: 14px; background: var(--grad-a); color: white; border: none; cursor: pointer; box-shadow: var(--el-a); line-height: 1; white-space: nowrap; }
.deck-host .btn-ghost { background: white; color: var(--ink-900); border: 1px solid var(--line); box-shadow: var(--el-1); }
.deck-host .btn-block { width: 100%; }
.deck-host .btn-lg { padding: 14px 22px; font-size: 15px; border-radius: 14px; }
.deck-host .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 9px; }

.deck-host .card-soft { background: var(--surface); border: 1px solid var(--line-2); border-radius: 18px; padding: 18px; box-shadow: var(--el-2); }
.deck-host .card-elev { background: var(--surface); border: 1px solid var(--line-2); border-radius: 20px; box-shadow: var(--el-3); }
.deck-host .card-a { background: var(--grad-a); color: white; border-radius: 20px; box-shadow: var(--el-a); position: relative; overflow: hidden; }
.deck-host .card-a::before { content:''; position:absolute; inset:0; background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.16), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 50%); pointer-events: none; }
.deck-host .card-money { background: var(--grad-money); color: white; border-radius: 20px; box-shadow: var(--el-a); position: relative; overflow: hidden; }
.deck-host .card-money::before { content:''; position:absolute; inset:0; background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.16), transparent 50%); pointer-events: none; }

.deck-host .field { display: block; width: 100%; background: white; border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; font-size: 14px; color: var(--ink-900); }
.deck-host .status-dot { width: 8px; height: 8px; border-radius: 99px; display: inline-block; box-shadow: 0 0 0 3px rgba(21,181,126,0.18); background: var(--a-500); }
.deck-host .status-dot.live { animation: deck-pulse 1.6s ease-in-out infinite; }
@keyframes deck-pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(21,181,126,0.18); } 50% { box-shadow: 0 0 0 6px rgba(21,181,126,0.10); } }

.deck-host .map-mock { position: relative; width: 100%; height: 100%; background: linear-gradient(135deg,#E8EDF3 0%,#DCE4EC 100%); overflow: hidden; }
.deck-host .map-mock::before { content:''; position:absolute; inset:0; background-image: linear-gradient(45deg,transparent 49%, rgba(255,255,255,0.6) 49%, rgba(255,255,255,0.6) 51%, transparent 51%), linear-gradient(-45deg,transparent 49%, rgba(255,255,255,0.6) 49%, rgba(255,255,255,0.6) 51%, transparent 51%); background-size: 32px 32px; opacity: 0.6; }
.deck-host .map-pin { position: absolute; width: 32px; height: 32px; transform: translate(-50%,-100%); }
.deck-host .map-pin .pin-bubble { width: 32px; height: 32px; background: var(--a-500); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(21,181,126,0.30); color: white; display: grid; place-items: center; font-weight: 700; font-size: 12px; }
.deck-host .map-pin .pin-bubble > span { transform: rotate(45deg); }
.deck-host .map-pin.now .pin-bubble { background: var(--danger-500); box-shadow: 0 0 0 8px rgba(239,68,68,0.16), 0 4px 12px rgba(239,68,68,0.30); animation: deck-pin-pulse 1.4s ease-in-out infinite; }
@keyframes deck-pin-pulse { 0%,100% { box-shadow: 0 0 0 6px rgba(239,68,68,0.16), 0 4px 12px rgba(239,68,68,0.30); } 50% { box-shadow: 0 0 0 14px rgba(239,68,68,0.04), 0 4px 12px rgba(239,68,68,0.30); } }
.deck-host .map-pin.done .pin-bubble { background: var(--ink-300); box-shadow: 0 4px 12px rgba(11,19,32,0.16); }

.deck-host .id-shine { position: relative; overflow: hidden; }
.deck-host .id-shine::before { content:''; position:absolute; top:-50%; left:-50%; width:50%; height:200%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent); transform: rotate(20deg); animation: deck-shine 6s linear infinite; }
@keyframes deck-shine { 0% { left: -100%; } 50% { left: 200%; } 100% { left: 200%; } }

.deck-host .glass { background: rgba(255,255,255,0.65); backdrop-filter: blur(22px) saturate(140%); -webkit-backdrop-filter: blur(22px) saturate(140%); border: 1px solid rgba(255,255,255,0.7); border-radius: 20px; box-shadow: var(--el-3); }

@keyframes deck-float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.deck-host .float-y { animation: deck-float-y 5.5s ease-in-out infinite; }

.deck-host .deck-phone-stage { transform: scale(0.78); transform-origin: top center; }
@media (max-width: 1280px) { .deck-host .deck-phone-stage { transform: scale(0.72); } }
`;

const SCREEN_LABELS = [
  { id: 0, badge: "हिन्दी · Hindi", label: "home · case feed" },
  { id: 1, badge: "मराठी · Marathi", label: "case detail · do/don't" },
  { id: 2, badge: "தமிழ் · Tamil", label: "completion · earned" },
  { id: 3, badge: "বাংলা · Bengali", label: "splash · earnings pitch" },
] as const;

/* DECK-EXACT · हिन्दी (Hindi) · home / case feed */
function ScreenFeed() {
  return (
    <div className="pixel-screen">
      <div className="pixel-status"><span>9:14</span><span>●●●●</span></div>
      <div className="pixel-body">
        <div style={{ position: "relative", flex: 1 }}>
          <div className="map-mock">
            <div className="map-pin done" style={{ left: "23%", top: "18%" }}><div className="pin-bubble" style={{ width: 22, height: 22, fontSize: 11 }}><span>1</span></div></div>
            <div className="map-pin now" style={{ left: "50%", top: "44%" }}><div className="pin-bubble" style={{ width: 24, height: 24, fontSize: 12 }}><span>2</span></div></div>
            <div className="map-pin" style={{ left: "70%", top: "65%" }}><div className="pin-bubble" style={{ width: 22, height: 22, fontSize: 11 }}><span>3</span></div></div>
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="glass" style={{ padding: "4px 12px", borderRadius: 999 }}>
                <div className="flex items-center gap-1.5">
                  <span className="status-dot live" style={{ width: 7, height: 7 }} />
                  <div style={{ fontSize: 11, fontWeight: 600 }}>ऑनलाइन</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: 14, background: "white", borderTop: "1px solid var(--line-2)", borderRadius: "20px 20px 0 0", marginTop: -20, position: "relative", zIndex: 6, boxShadow: "0 -8px 24px rgba(11,19,32,0.08)" }}>
          <div style={{ fontSize: 10, color: "var(--ink-500)", textTransform: "uppercase", fontWeight: 700 }}>पास के काम</div>
          <div className="display" style={{ fontSize: 15 }}>3 आसान विज़िट्स · ₹420</div>
          <div className="space-y-1.5" style={{ marginTop: 10 }}>
            <div className="card-soft flex items-center gap-2" style={{ padding: "8px 10px", borderColor: "var(--a-500)", background: "var(--a-50)" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--a-500)", color: "white", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>📞</div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>रिमाइंडर · 1.2 km</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--a-700)" }}>₹80</span>
            </div>
            <div className="card-soft flex items-center gap-2" style={{ padding: "8px 10px" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--a-100)", color: "var(--a-700)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>📋</div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>डॉक्युमेंट · 2.4 km</div>
              <span style={{ fontSize: 12, fontWeight: 700 }}>₹100</span>
            </div>
            <div className="card-soft flex items-center gap-2" style={{ padding: "8px 10px" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--a-100)", color: "var(--a-700)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>📍</div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>सत्यापन · 3.1 km</div>
              <span style={{ fontSize: 12, fontWeight: 700 }}>₹150</span>
            </div>
          </div>
          <button className="btn btn-block" style={{ padding: 9, fontSize: 12, marginTop: 10 }}>पहला काम लें</button>
        </div>
      </div>
    </div>
  );
}

/* DECK-EXACT · मराठी (Marathi) · case detail · do/don't */
function ScreenCaseDetail() {
  return (
    <div className="pixel-screen">
      <div className="pixel-status"><span>9:42</span><span>●●●●</span></div>
      <div className="pixel-body" style={{ overflowY: "auto", padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <button style={{ background: "transparent", border: 0, color: "var(--ink-500)", fontSize: 16 }}>←</button>
          <span className="pill pill-a" style={{ padding: "2px 8px", fontSize: 10 }}><span className="dot" />स्मरणपत्र</span>
          <div style={{ width: 18 }} />
        </div>
        <div className="card-soft" style={{ background: "linear-gradient(135deg,var(--a-50),white)", padding: "10px 12px" }}>
          <div style={{ fontSize: 10, color: "var(--ink-500)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>ग्राहक</div>
          <div className="display" style={{ fontSize: 16, marginTop: 2 }}>पी. पवार</div>
          <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>घर 42 · वसंत लेन · वाकड</div>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
            <div><b className="tnum">2 दिवस</b> उशीर</div>
            <div><b className="tnum" style={{ color: "var(--a-700)" }}>₹80</b> मिळेल</div>
          </div>
        </div>
        <div className="card-soft" style={{ marginTop: 12, background: "var(--info-50)", borderColor: "rgba(14,165,233,0.20)", padding: 12 }}>
          <div style={{ fontSize: 10, color: "var(--info-700)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>तुमचं काम</div>
          <ul style={{ marginTop: 8, listStyle: "none", padding: 0, fontSize: 11, color: "var(--ink-700)" }}>
            <li style={{ display: "flex", gap: 6, marginBottom: 4 }}><span style={{ color: "var(--info-700)" }}>●</span><span>पत्त्यावर जा · ग्राहक भेटतोय का बघा</span></li>
            <li style={{ display: "flex", gap: 6, marginBottom: 4 }}><span style={{ color: "var(--info-700)" }}>●</span><span>स्मरणपत्र द्या · फोटो काढा</span></li>
            <li style={{ display: "flex", gap: 6, color: "var(--danger-700)" }}><span>✕</span><span>रोख घेऊ नका</span></li>
          </ul>
        </div>
        <button className="btn btn-block" style={{ padding: 9, fontSize: 12, marginTop: 14 }}>भेटीला सुरुवात करा</button>
      </div>
    </div>
  );
}

/* DECK-EXACT · தமிழ் (Tamil) · completion · earned */
function ScreenShowID() {
  return (
    <div className="pixel-screen">
      <div className="pixel-status"><span>9:54</span><span>●●●●</span></div>
      <div className="pixel-body" style={{ overflowY: "auto", padding: 14 }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, margin: "0 auto", display: "grid", placeItems: "center", background: "var(--grad-a)", boxShadow: "var(--el-a)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" stroke="white" strokeWidth="3" fill="none"><path d="M5 12 L10 17 L20 7" /></svg>
          </div>
          <div className="display" style={{ fontSize: 16, marginTop: 8 }}>முடிந்தது!</div>
          <div style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 2 }}>விசிட் வெற்றிகரமாக பதிவு செய்யப்பட்டது</div>
        </div>
        <div className="card-money" style={{ padding: 12 }}>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", opacity: 0.85, fontWeight: 700 }}>சம்பாதித்தது</div>
            <div className="display tnum" style={{ fontSize: 22, marginTop: 2 }}>+ ₹80</div>
            <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>நாளை T+1 உங்கள் வங்கிக்கு</div>
          </div>
        </div>
        <div className="card-soft" style={{ marginTop: 12, padding: 12 }}>
          <div style={{ fontSize: 10, color: "var(--ink-500)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 6 }}>முடிவு</div>
          <div style={{ fontSize: 11, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>நிலை</span>
              <span style={{ fontWeight: 600, color: "var(--a-700)" }}>✓ வழங்கப்பட்டது</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>நேரம்</span>
              <span className="tnum" style={{ fontWeight: 600 }}>12 நி</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>தூரம்</span>
              <span className="tnum" style={{ fontWeight: 600 }}>1.4 km</span>
            </div>
          </div>
        </div>
        <button className="btn btn-block" style={{ padding: 9, fontSize: 12, marginTop: 14 }}>அடுத்த விசிட்</button>
      </div>
    </div>
  );
}

/* DECK-EXACT · বাংলা (Bengali) · splash · earnings pitch */
function ScreenComplete() {
  return (
    <div className="pixel-screen">
      <div className="pixel-status"><span>9:00</span><span>●●●●</span></div>
      <div className="pixel-body" style={{ background: "linear-gradient(180deg,var(--a-50),white 60%)", padding: 0 }}>
        <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 16 }}>
          <div style={{ textAlign: "center" }}>
            {/* Mascot · simple inline SVG triangle character */}
            <div style={{ width: 88, height: 88, margin: "0 auto", display: "grid", placeItems: "center" }} className="float-y">
              <svg viewBox="0 0 96 96" width="88" height="88" fill="none">
                <defs>
                  <linearGradient id="mascotGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#1FCB91" />
                    <stop offset="1" stopColor="#0E84A8" />
                  </linearGradient>
                </defs>
                <path d="M48 12 L82 76 L14 76 Z" fill="url(#mascotGrad)" />
                <circle cx="40" cy="50" r="6" fill="white" />
                <circle cx="56" cy="50" r="6" fill="white" />
                <circle cx="40" cy="50" r="3" fill="#0B1320" />
                <circle cx="56" cy="50" r="3" fill="#0B1320" />
                <path d="M40 62 Q 48 68 56 62" stroke="#0B1320" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}>
              <Image src="/quikkred-mark.png" alt="" width={16} height={16} />
              <span className="display" style={{ fontSize: 13, color: "var(--ink-900)" }}>Quikkred</span>
            </div>
            <h3 className="display" style={{ fontSize: 15, marginTop: 8 }}>অতিরিক্ত আয় করুন</h3>
            <div style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 4, maxWidth: 200, margin: "4px auto 0" }}>যদি আপনি আপনার শহরে ডেলিভারি / রাইড করেন · ২-৩ ঘন্টায় ₹১৫-৩০ হাজার</div>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <span className="pill pill-a" style={{ padding: "2px 8px", fontSize: 10 }}><span className="dot" />RBI</span>
              <span className="pill" style={{ padding: "2px 8px", fontSize: 10, background: "var(--warn-50)", border: "1px solid rgba(245,158,11,0.30)", color: "var(--warn-700)" }}>
                <span className="dot" style={{ width: 6, height: 6, borderRadius: 99, background: "var(--warn-500)" }} />
                Per task
              </span>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 14px 14px", width: "100%" }}>
          <button className="btn btn-block" style={{ padding: 10, fontSize: 12 }}>আবেদন করুন · ১০ মিনিট</button>
          <button className="btn btn-ghost btn-block" style={{ padding: 8, fontSize: 11, marginTop: 6 }}>আমার অ্যাকাউন্ট আছে</button>
        </div>
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

  // Fire ViewContent once when the "how it works" section is 40% visible.
  // Scoped to the campaign pixel, consistent with the page's other events.
  useEffect(() => {
    const section = document.querySelector("#how-it-works");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const fbq = (window as any).fbq;
        if (entry.isIntersecting && fbq) {
          fbq("trackSingle", "1650946159536225", "ViewContent", {
            content_name: "Collection Partner Landing Page",
            content_category: "Partner Recruitment",
            content_type: "landing_page",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(section);
    return () => observer.disconnect();
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

const APK_URL =
  "https://api.quikkred.in/api/apk/download/quikkred-collect-partner?channel=release";

const handleDownload = () => {
  setDownloadStarted(true);

  const fbq = typeof window !== "undefined" ? (window as any).fbq : undefined;
  if (fbq) {
    // Standard Lead event — fires on every download attempt. Scoped to the
    // campaign pixel so it doesn't pollute the two site-wide pixels.
    fbq("trackSingle", "1650946159536225", "Lead", {
      content_name: "Collection Partner APK Download",
      content_category: "App Install",
      value: 0,
      currency: "INR",
    });
    // Custom event — captures the download type/source.
    fbq("trackSingleCustom", "1650946159536225", "AppDownload", {
      platform: "android_direct",
      page: "collection-partner",
    });
  }

  setTimeout(() => {
    window.open(APK_URL, "_blank");
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

                {/* Phone Mockup · DECK-EXACT .pixel frame · 4-screen carousel */}
                <div className="deck-host" style={{ width: 296, height: 624, position: "relative" }}>
                  <style dangerouslySetInnerHTML={{ __html: DECK_CSS }} />
                  <div className="deck-phone-stage">
                    <div className="pixel">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={screenIdx}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <ActiveScreen />
                        </motion.div>
                      </AnimatePresence>
                    </div>
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
                Download APK
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
