"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Store,
  Phone,
  User,
  MapPin,
  Banknote,
  BookOpen,
  QrCode,
  PenLine,
  Languages,
  Loader2,
  Home,
  Info,
  FileSignature,
} from "lucide-react";

/* ──────────────────────────── i18n lite ──────────────────────────── */

type Lang = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu" | "kn" | "ml" | "or" | "pa";

const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

const strings: Record<string, Partial<Record<Lang, string>>> = {
  welcomeTitle: {
    en: "Welcome — let's set up your counter",
    hi: "स्वागत है — अपना काउंटर सेट करें",
    mr: "स्वागत — तुमचा काउंटर सेट करा",
    ta: "வரவேற்பு — உங்கள் கவுண்டரை அமைக்கவும்",
  },
  welcomeSub: {
    en: "Takes about 30 minutes. You'll need your PAN, Aadhaar, personal bank account and a photo of your shop.",
    hi: "लगभग 30 मिनट लगेंगे। PAN, Aadhaar, व्यक्तिगत बैंक खाता और दुकान की फोटो तैयार रखें।",
  },
  next: { en: "Next", hi: "आगे", mr: "पुढे", ta: "அடுத்து" },
  back: { en: "Back", hi: "वापस", mr: "मागे", ta: "பின்" },
  startOnboarding: { en: "Start onboarding", hi: "शुरू करें" },
};

function t(key: string, lang: Lang): string {
  return strings[key]?.[lang] || strings[key]?.en || key;
}

/* ──────────────────────────── types ──────────────────────────── */

type StepKey =
  | "welcome"
  | "kyc"
  | "shop"
  | "bank"
  | "training"
  | "agreement"
  | "qr";

interface StepDef {
  key: StepKey;
  n: number;
  titleEn: string;
  titleHi: string;
  icon: React.ComponentType<any>;
}

const STEPS: StepDef[] = [
  { key: "welcome", n: 1, titleEn: "Welcome", titleHi: "स्वागत", icon: Home },
  { key: "kyc", n: 2, titleEn: "Your KYC", titleHi: "आपका KYC", icon: User },
  { key: "shop", n: 3, titleEn: "Shop details", titleHi: "दुकान की जानकारी", icon: Store },
  { key: "bank", n: 4, titleEn: "Bank & UPI", titleHi: "बैंक और UPI", icon: Banknote },
  { key: "training", n: 5, titleEn: "Training & Code", titleHi: "प्रशिक्षण और नियम", icon: BookOpen },
  { key: "agreement", n: 6, titleEn: "Agreement eSign", titleHi: "समझौते पर हस्ताक्षर", icon: FileSignature },
  { key: "qr", n: 7, titleEn: "Your QR is ready", titleHi: "आपका QR तैयार है", icon: QrCode },
];

interface State {
  lang: Lang;
  currentStep: StepKey;
  // KYC
  fullName: string;
  mobile: string;
  pan: string;
  aadhaarLast4: string; // Display only (XXXX-XXXX-last4)
  otpVerified: boolean;
  // Shop
  shopName: string;
  shopType: string;
  shopAddress: string;
  shopPincode: string;
  shopGeo: { lat?: number; lng?: number } | null;
  shopPhotoUploaded: boolean;
  // Bank
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  upiVpa: string;
  pennyDropVerified: boolean;
  // Training
  fpcAccepted: boolean;
  collectionsCodeAccepted: boolean;
  dpdpAccepted: boolean;
  quizScore: number | null;
  // Agreement
  tripartiteSigned: boolean;
  // QR
  qrProvisioned: boolean;
  vaNumber: string;
  proprietorId: string;
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const MOBILE_REGEX = /^[6-9][0-9]{9}$/;
const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

function initialState(id: string): State {
  return {
    lang: "en",
    currentStep: "welcome",
    fullName: "",
    mobile: "",
    pan: "",
    aadhaarLast4: "",
    otpVerified: false,
    shopName: "",
    shopType: "",
    shopAddress: "",
    shopPincode: "",
    shopGeo: null,
    shopPhotoUploaded: false,
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    upiVpa: "",
    pennyDropVerified: false,
    fpcAccepted: false,
    collectionsCodeAccepted: false,
    dpdpAccepted: false,
    quizScore: null,
    tripartiteSigned: false,
    qrProvisioned: false,
    vaNumber: "",
    proprietorId: id.toUpperCase(),
  };
}

/* ──────────────────────────── page ──────────────────────────── */

export default function ProprietorOnboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, setState] = useState<State>(() => initialState(id));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(`prop-onboard:${id}`);
    if (saved) {
      try {
        setState({ ...initialState(id), ...JSON.parse(saved) });
      } catch {
        /* ignore */
      }
    }
  }, [id]);

  function update<K extends keyof State>(k: K, v: State[K]) {
    setState((prev) => {
      const next = { ...prev, [k]: v };
      if (typeof window !== "undefined") {
        localStorage.setItem(`prop-onboard:${id}`, JSON.stringify(next));
      }
      return next;
    });
  }

  function goto(step: StepKey) {
    update("currentStep", step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === state.currentStep);
  const progressPct = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F5F5]">
      {/* Header strip */}
      <header className="sticky top-0 z-20 bg-[#0E2920] text-white border-b border-white/10">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link
            href="/partners/proprietor-network"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <span className="text-[10px] uppercase tracking-wider text-white/50">
              Proprietor ID
            </span>
            <div className="text-xs font-mono font-semibold text-[#51C9AF]">
              {state.proprietorId}
            </div>
          </div>
          <LangPicker
            value={state.lang}
            onChange={(v) => update("lang", v)}
          />
        </div>
        <div className="h-1 w-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-[#25B181] to-[#51C9AF]"
          />
        </div>
      </header>

      {/* Step stepper */}
      <div className="max-w-xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => {
            const done = i < currentStepIndex;
            const active = i === currentStepIndex;
            return (
              <div key={s.key} className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                    done
                      ? "bg-[#25B181] text-white"
                      : active
                      ? "bg-[#0E2920] text-[#51C9AF] border border-[#51C9AF]"
                      : "bg-white text-gray-400 border border-gray-200"
                  }`}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`absolute h-0.5 ${
                      done ? "bg-[#25B181]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-gray-500 mb-6">
          Step {currentStepIndex + 1} of {STEPS.length} ·{" "}
          <span className="font-semibold text-gray-700">
            {STEPS[currentStepIndex]?.titleEn}
          </span>
        </p>
      </div>

      {/* Step content */}
      <main className="max-w-xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {state.currentStep === "welcome" && (
              <WelcomeStep
                lang={state.lang}
                onNext={() => goto("kyc")}
              />
            )}
            {state.currentStep === "kyc" && (
              <KycStep
                state={state}
                update={update}
                onBack={() => goto("welcome")}
                onNext={() => goto("shop")}
              />
            )}
            {state.currentStep === "shop" && (
              <ShopStep
                state={state}
                update={update}
                onBack={() => goto("kyc")}
                onNext={() => goto("bank")}
              />
            )}
            {state.currentStep === "bank" && (
              <BankStep
                state={state}
                update={update}
                onBack={() => goto("shop")}
                onNext={() => goto("training")}
              />
            )}
            {state.currentStep === "training" && (
              <TrainingStep
                state={state}
                update={update}
                onBack={() => goto("bank")}
                onNext={() => goto("agreement")}
              />
            )}
            {state.currentStep === "agreement" && (
              <AgreementStep
                state={state}
                update={update}
                onBack={() => goto("training")}
                onNext={() => goto("qr")}
              />
            )}
            {state.currentStep === "qr" && <QrStep state={state} update={update} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ──────────────────────────── components ──────────────────────────── */

function LangPicker({
  value,
  onChange,
}: {
  value: Lang;
  onChange: (v: Lang) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Lang)}
        className="appearance-none bg-white/10 border border-white/15 rounded-lg pl-7 pr-6 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#51C9AF]/50"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="text-gray-900">
            {l.native}
          </option>
        ))}
      </select>
      <Languages className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#51C9AF]" />
    </div>
  );
}

function StepCard({
  icon: Icon,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Next",
  hideBack,
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  hideBack?: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#D3F1EB] flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-[#1F8F68]" />
          </div>
          <div>
            <h2 className="font-bold font-sora text-gray-900 text-lg">{title}</h2>
            {subtitle && (
              <p className="text-xs text-gray-500 leading-snug">{subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>

      {(onBack || onNext) && (
        <div className="flex gap-2">
          {!hideBack && onBack && (
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 ${
                nextDisabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#25B181] hover:bg-[#1F8F68] text-white"
              }`}
            >
              {nextLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function WelcomeStep({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-[#0E2920] to-[#144B37] text-white rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-[#51C9AF]" />
          <span className="text-[11px] uppercase tracking-wider text-[#51C9AF] font-semibold">
            Powered by Satsai Finlease — RBI Reg. B-14.01646
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sora mb-3">
          {t("welcomeTitle", lang)}
        </h1>
        <p className="text-sm text-white/80 leading-relaxed mb-6">
          {t("welcomeSub", lang)}
        </p>

        <ul className="space-y-2.5 text-sm text-white/85 mb-6">
          {[
            "Quick KYC using Aadhaar OTP",
            "Your shop details + 1 photo",
            "Bank account + UPI for commissions",
            "Short training on Fair Practices",
            "eSign the tripartite agreement",
            "Your counter QR goes live",
          ].map((x) => (
            <li key={x} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#51C9AF] mt-0.5 flex-shrink-0" />
              <span>{x}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-xl bg-[#FF9C70] hover:bg-[#E36229] transition-colors font-semibold text-[#0E2920] inline-flex items-center justify-center gap-2"
        >
          {t("startOnboarding", lang)}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 text-xs text-gray-600 leading-relaxed">
        <Info className="inline w-3.5 h-3.5 text-[#4A66FF] mb-0.5 mr-1" />
        You are being onboarded as a <b>DSA + Recovery Agent</b> (LSP sub-category)
        under the RBI (Digital Lending) Directions, 2025. You will be listed on
        Satsai Finlease's public List of LSPs within 2 working days of go-live.
        You will <b>never</b> handle customer cash; all repayments flow through Satsai's
        dynamic QR.
      </div>
    </div>
  );
}

function KycStep({
  state,
  update,
  onBack,
  onNext,
}: {
  state: State;
  update: <K extends keyof State>(k: K, v: State[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const canSendOtp =
    state.fullName.trim().length > 1 && MOBILE_REGEX.test(state.mobile);

  const canVerify =
    canSendOtp && PAN_REGEX.test(state.pan) && state.aadhaarLast4.length === 4 && otp.length === 6;

  function sendOtp() {
    setOtpSent(true);
    // Stub: in production, call /api/kyc/aadhaar/otp
  }

  function verifyOtp() {
    // Stub: in production, call /api/kyc/aadhaar/verify
    update("otpVerified", true);
  }

  return (
    <StepCard
      icon={User}
      title="Your KYC"
      subtitle="PAN + Aadhaar OTP. Data stays on Satsai's India servers."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!state.otpVerified}
    >
      <div className="space-y-4">
        <Field label="Full name (as on Aadhaar)" required>
          <input
            type="text"
            value={state.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="As per Aadhaar / PAN"
            className={inputCls(false)}
          />
        </Field>

        <Field label="Mobile (Aadhaar-linked)" required hint="10-digit Indian mobile starting 6–9">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
              <Phone className="w-3.5 h-3.5 mr-1" />
              +91
            </span>
            <input
              type="tel"
              value={state.mobile}
              onChange={(e) =>
                update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="98765 43210"
              maxLength={10}
              className={`${inputCls(false)} rounded-l-none`}
            />
          </div>
        </Field>

        <Field label="PAN" required hint="10 characters, e.g. ABCDE1234F">
          <input
            type="text"
            value={state.pan}
            onChange={(e) =>
              update("pan", e.target.value.toUpperCase().slice(0, 10))
            }
            placeholder="ABCDE1234F"
            maxLength={10}
            className={`${inputCls(false)} font-mono`}
          />
        </Field>

        <Field label="Last 4 digits of Aadhaar" required hint="Full Aadhaar verified via OTP — we only store last 4">
          <input
            type="tel"
            value={state.aadhaarLast4}
            onChange={(e) =>
              update("aadhaarLast4", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="1234"
            maxLength={4}
            className={`${inputCls(false)} font-mono`}
          />
        </Field>

        {!otpSent && (
          <button
            onClick={sendOtp}
            disabled={!canSendOtp}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
              canSendOtp
                ? "bg-[#4A66FF] text-white hover:bg-[#3B52CC]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Send Aadhaar OTP
          </button>
        )}

        {otpSent && !state.otpVerified && (
          <div className="space-y-2">
            <Field label="Enter 6-digit OTP" hint="Demo OTP in dev: 123456">
              <input
                type="tel"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="• • • • • •"
                maxLength={6}
                className={`${inputCls(false)} font-mono text-center tracking-[0.4em] text-lg`}
              />
            </Field>
            <button
              onClick={verifyOtp}
              disabled={!canVerify}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                canVerify
                  ? "bg-[#25B181] text-white hover:bg-[#1F8F68]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Verify OTP
            </button>
          </div>
        )}

        {state.otpVerified && (
          <div className="bg-[#D3F1EB] border border-[#25B181]/30 rounded-xl p-4 flex items-start gap-2.5 text-sm text-[#0E2920]">
            <CheckCircle2 className="w-4 h-4 text-[#1F8F68] mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">KYC verified</div>
              <div className="text-xs text-gray-700 mt-0.5">
                Aadhaar OTP matched. PAN validated. You can proceed.
              </div>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}

function ShopStep({
  state,
  update,
  onBack,
  onNext,
}: {
  state: State;
  update: <K extends keyof State>(k: K, v: State[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [geoLoading, setGeoLoading] = useState(false);
  const canProceed =
    state.shopName.trim().length > 1 &&
    state.shopType.length > 0 &&
    state.shopAddress.length > 5 &&
    /^\d{6}$/.test(state.shopPincode) &&
    state.shopPhotoUploaded;

  function captureGeo() {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update("shopGeo", {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      update("shopPhotoUploaded", true);
    }
  }

  return (
    <StepCard
      icon={Store}
      title="Shop details"
      subtitle="Geo-tagged photo required — part of Satsai's LSP verification."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!canProceed}
    >
      <div className="space-y-4">
        <Field label="Shop name" required>
          <input
            type="text"
            value={state.shopName}
            onChange={(e) => update("shopName", e.target.value)}
            placeholder="Your shop / outlet name"
            className={inputCls(false)}
          />
        </Field>

        <Field label="Shop type" required>
          <select
            value={state.shopType}
            onChange={(e) => update("shopType", e.target.value)}
            className={inputCls(false)}
          >
            <option value="">Pick one…</option>
            <option value="neighbourhood_retail">Neighbourhood retail outlet</option>
            <option value="market_aggregator">Local market aggregator</option>
            <option value="hospitality">Food service / hospitality outlet</option>
            <option value="mobile_shop">Mobile / recharge services</option>
            <option value="medical">Pharmacy / medical outlet</option>
            <option value="transport_hub">Transport hub operator</option>
            <option value="trade_cluster">Trade cluster anchor</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <Field label="Shop address" required>
          <textarea
            value={state.shopAddress}
            onChange={(e) => update("shopAddress", e.target.value)}
            placeholder="Shop 12, Main Bazaar, Laxmi Nagar..."
            rows={3}
            className={inputCls(false)}
          />
        </Field>

        <Field label="Pincode" required>
          <input
            type="tel"
            value={state.shopPincode}
            onChange={(e) =>
              update("shopPincode", e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="110092"
            maxLength={6}
            className={`${inputCls(false)} font-mono`}
          />
        </Field>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">
            Geo-tag your shop <span className="text-red-500">*</span>
          </label>
          {state.shopGeo ? (
            <div className="bg-[#D3F1EB] border border-[#25B181]/30 rounded-xl px-3.5 py-3 flex items-center gap-2 text-xs text-[#0E2920]">
              <MapPin className="w-4 h-4 text-[#1F8F68] flex-shrink-0" />
              <span className="font-mono">
                {state.shopGeo.lat?.toFixed(5)}, {state.shopGeo.lng?.toFixed(5)}
              </span>
              <button
                onClick={captureGeo}
                className="ml-auto text-[11px] text-[#1F8F68] underline"
              >
                Recapture
              </button>
            </div>
          ) : (
            <button
              onClick={captureGeo}
              disabled={geoLoading}
              className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
            >
              {geoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 text-[#1F8F68]" />
              )}
              Capture current location
            </button>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">
            Shop photo <span className="text-red-500">*</span>
          </label>
          <label
            className={`block w-full py-5 rounded-xl border-2 border-dashed cursor-pointer text-center text-sm font-semibold transition-colors ${
              state.shopPhotoUploaded
                ? "border-[#25B181] bg-[#D3F1EB] text-[#1F8F68]"
                : "border-gray-300 text-gray-600 hover:border-[#25B181] hover:text-[#1F8F68]"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onPhoto}
              className="hidden"
            />
            {state.shopPhotoUploaded ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Photo captured — ready
              </span>
            ) : (
              <span>Take shop photo</span>
            )}
          </label>
          <p className="text-xs text-gray-500">
            A gig field agent will physically verify within 48 hours.
          </p>
        </div>
      </div>
    </StepCard>
  );
}

function BankStep({
  state,
  update,
  onBack,
  onNext,
}: {
  state: State;
  update: <K extends keyof State>(k: K, v: State[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const canPennyDrop =
    state.accountHolder.trim().length > 1 &&
    /^\d{9,18}$/.test(state.accountNumber) &&
    IFSC_REGEX.test(state.ifsc.toUpperCase());

  function runPennyDrop() {
    // Stub: in production, call /api/kyc/bank/penny-drop
    update("pennyDropVerified", true);
  }

  const canProceed = state.pennyDropVerified;

  return (
    <StepCard
      icon={Banknote}
      title="Bank & UPI"
      subtitle="For receiving your commission. Satsai transfers monthly; TDS 194H deducted."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!canProceed}
    >
      <div className="space-y-4">
        <Field label="Account holder name" required hint="Must match your PAN name">
          <input
            type="text"
            value={state.accountHolder}
            onChange={(e) => update("accountHolder", e.target.value)}
            placeholder="As per Aadhaar / PAN"
            className={inputCls(false)}
          />
        </Field>

        <Field label="Account number" required>
          <input
            type="text"
            value={state.accountNumber}
            onChange={(e) =>
              update("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 18))
            }
            placeholder="00123456789012"
            className={`${inputCls(false)} font-mono`}
          />
        </Field>

        <Field label="IFSC" required hint="e.g. HDFC0001234">
          <input
            type="text"
            value={state.ifsc}
            onChange={(e) =>
              update("ifsc", e.target.value.toUpperCase().slice(0, 11))
            }
            placeholder="HDFC0001234"
            maxLength={11}
            className={`${inputCls(false)} font-mono`}
          />
        </Field>

        <Field label="UPI VPA (optional, for instant credit)" hint="e.g. 9876543210@ybl">
          <input
            type="text"
            value={state.upiVpa}
            onChange={(e) => update("upiVpa", e.target.value.trim())}
            placeholder="9876543210@ybl"
            className={inputCls(false)}
          />
        </Field>

        {!state.pennyDropVerified ? (
          <button
            onClick={runPennyDrop}
            disabled={!canPennyDrop}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
              canPennyDrop
                ? "bg-[#4A66FF] text-white hover:bg-[#3B52CC]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Verify account (penny drop)
          </button>
        ) : (
          <div className="bg-[#D3F1EB] border border-[#25B181]/30 rounded-xl p-4 flex items-start gap-2.5 text-sm text-[#0E2920]">
            <CheckCircle2 className="w-4 h-4 text-[#1F8F68] mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Account verified</div>
              <div className="text-xs text-gray-700 mt-0.5">
                Name match confirmed via ₹1 credit.
              </div>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}

function TrainingStep({
  state,
  update,
  onBack,
  onNext,
}: {
  state: State;
  update: <K extends keyof State>(k: K, v: State[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const questions = [
    {
      q: "When a customer cannot pay, what can you do?",
      options: [
        "Visit their home after 9 PM",
        "Threaten to call their relatives",
        "Politely remind them and report to Satsai",
        "Take back their goods",
      ],
      correct: 2,
    },
    {
      q: "Where should the customer's repayment go?",
      options: [
        "My personal UPI",
        "My shop's QR (any QR)",
        "Satsai's dynamic QR shown in my app",
        "Cash in my drawer",
      ],
      correct: 2,
    },
    {
      q: "If a customer has a complaint, what do I do?",
      options: [
        "Ignore it",
        "Log it in the app; Satsai's Nodal Officer handles it",
        "Solve it myself without reporting",
        "Tell them to pay anyway",
      ],
      correct: 1,
    },
  ];

  const correctCount = questions.filter(
    (q, i) => quizAnswers[i] === q.correct
  ).length;
  const quizPassed = correctCount === questions.length;

  useEffect(() => {
    if (quizPassed && state.quizScore === null) {
      update("quizScore", correctCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizPassed]);

  const canProceed =
    state.fpcAccepted &&
    state.collectionsCodeAccepted &&
    state.dpdpAccepted &&
    quizPassed;

  return (
    <StepCard
      icon={BookOpen}
      title="Training & Code"
      subtitle="Short module on Fair Practices, collections conduct and DPDP."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!canProceed}
    >
      <div className="space-y-5">
        <div className="bg-[#FFEBD1] border-l-4 border-[#E36229] rounded-xl p-4 text-xs text-gray-800 leading-relaxed">
          <p className="font-semibold mb-1 text-[#E36229] uppercase tracking-wide">
            What you will follow
          </p>
          Do not call a customer before 7 AM or after 8 PM. Do not pressure them. Do not
          take cash. Do not share the customer's Aadhaar or PAN with anyone. All
          repayments go through Satsai's QR.
        </div>

        <div className="space-y-3">
          <Acceptance
            checked={state.fpcAccepted}
            onChange={(v) => update("fpcAccepted", v)}
            title="Satsai Fair Practices Code"
            body="I will follow Satsai's Fair Practices Code in all interactions with customers."
          />
          <Acceptance
            checked={state.collectionsCodeAccepted}
            onChange={(v) => update("collectionsCodeAccepted", v)}
            title="Collections Conduct Policy"
            body="No calls 8pm–7am. No harassment. No coercion. No cash handling. I will log every complaint in the app."
          />
          <Acceptance
            checked={state.dpdpAccepted}
            onChange={(v) => update("dpdpAccepted", v)}
            title="DPDP + Data Handling"
            body="I will not share any customer's Aadhaar, PAN or personal details with anyone. The app will only show masked information."
          />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">
            Quick quiz (3 questions) {quizPassed && "— ✓ passed"}
          </h3>
          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {qi + 1}. {q.q}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const picked = quizAnswers[qi] === oi;
                    const isCorrect = oi === q.correct;
                    const showRed = picked && !isCorrect;
                    const showGreen = picked && isCorrect;
                    return (
                      <button
                        key={oi}
                        onClick={() =>
                          setQuizAnswers((prev) => ({ ...prev, [qi]: oi }))
                        }
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          showGreen
                            ? "bg-[#D3F1EB] text-[#1F8F68] border border-[#25B181]"
                            : showRed
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-white border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

function AgreementStep({
  state,
  update,
  onBack,
  onNext,
}: {
  state: State;
  update: <K extends keyof State>(k: K, v: State[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [signing, setSigning] = useState(false);

  function eSign() {
    setSigning(true);
    setTimeout(() => {
      update("tripartiteSigned", true);
      setSigning(false);
    }, 1400);
  }

  return (
    <StepCard
      icon={FileSignature}
      title="Tripartite agreement"
      subtitle="Signed by you, Satsai (NBFC) and the Primary LSP — via Aadhaar eSign."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!state.tripartiteSigned}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed max-h-60 overflow-y-auto">
          <p className="font-bold text-gray-900 uppercase text-center mb-3 text-[11px]">
            Proprietor Services Agreement (Tripartite) — Summary
          </p>
          <p className="mb-2">
            <b>Parties:</b> Satsai Finlease Private Limited (RBI Reg. B-14.01646), the
            Primary LSP, and {state.fullName || "the Proprietor"}.
          </p>
          <p className="mb-2">
            <b>Role:</b> Proprietor is appointed as an LSP sub-category DSA + Recovery
            Agent under the RBI (Digital Lending) Directions, 2025. Proprietor sources
            loan applications and facilitates repayment via Satsai's dynamic QR.
          </p>
          <p className="mb-2">
            <b>Prohibited:</b> Cash handling (v1); collecting any fee from borrower; using
            non-Satsai QR; harassment or coercion; sharing borrower PII; paying EMI on
            behalf of borrower.
          </p>
          <p className="mb-2">
            <b>Commission:</b> Sourcing + collection commission paid monthly by Satsai.
            TDS u/s 194H @ 5% deducted if annual commission exceeds ₹15,000. Claw-back
            applies on early default. GST per proprietor turnover threshold.
          </p>
          <p className="mb-2">
            <b>Supervision:</b> Satsai will audit conduct (mystery-borrower + field
            visit + data signals) at least quarterly. Proprietor appears on Satsai's
            public List of LSPs within 2 working days.
          </p>
          <p className="mb-2">
            <b>Grievance:</b> Borrower grievance escalation — Proprietor → Primary LSP →
            Satsai Nodal Officer → RBI Integrated Ombudsman.
          </p>
          <p>
            <b>Termination:</b> Pre-notice for breach; cooperative wind-down with book
            hand-off to nearest proprietor / Fluxusforge tele-collections.
          </p>
        </div>

        <div className="bg-[#DAE6FF] border-l-4 border-[#4A66FF] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-gray-800">
          <Info className="w-3.5 h-3.5 text-[#4A66FF] mt-0.5 flex-shrink-0" />
          <span>
            eSign uses NPCI's Aadhaar eSign gateway. A 6-digit OTP will arrive on your
            Aadhaar-linked mobile.
          </span>
        </div>

        {!state.tripartiteSigned ? (
          <button
            onClick={eSign}
            disabled={signing}
            className="w-full py-3.5 rounded-xl bg-[#25B181] hover:bg-[#1F8F68] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {signing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening Aadhaar eSign…
              </>
            ) : (
              <>
                <PenLine className="w-4 h-4" />
                eSign the agreement
              </>
            )}
          </button>
        ) : (
          <div className="bg-[#D3F1EB] border border-[#25B181]/30 rounded-xl p-4 flex items-start gap-2.5 text-sm text-[#0E2920]">
            <CheckCircle2 className="w-4 h-4 text-[#1F8F68] mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Agreement signed</div>
              <div className="text-xs text-gray-700 mt-0.5">
                Tripartite executed via Aadhaar eSign. Trail stored in Satsai's WORM
                audit log.
              </div>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}

function QrStep({
  state,
  update,
}: {
  state: State;
  update: <K extends keyof State>(k: K, v: State[K]) => void;
}) {
  useEffect(() => {
    if (!state.qrProvisioned) {
      const timer = setTimeout(() => {
        const va =
          "SATSAI" +
          Math.random().toString(36).substring(2, 10).toUpperCase();
        update("vaNumber", va);
        update("qrProvisioned", true);
      }, 1600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state.qrProvisioned) {
    return (
      <StepCard icon={QrCode} title="Setting up your counter…">
        <div className="flex flex-col items-center py-8">
          <Loader2 className="w-10 h-10 animate-spin text-[#25B181] mb-3" />
          <p className="text-sm text-gray-700 text-center max-w-sm leading-relaxed">
            Provisioning your virtual account + dynamic UPI QR via Satsai's bank rails.
            This takes about 30 seconds.
          </p>
        </div>
      </StepCard>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-[#0E2920] to-[#144B37] text-white rounded-2xl p-6 sm:p-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-[11px] uppercase tracking-wider text-[#51C9AF] mb-5">
          <CheckCircle2 className="w-3 h-3" />
          You're live
        </div>
        <h2 className="text-2xl font-bold font-sora mb-2">
          Your counter QR is ready
        </h2>
        <p className="text-sm text-white/75 mb-6 max-w-sm mx-auto">
          Any loan customer can scan this QR to pay. The money lands in Satsai's
          account, tagged to you. You never touch cash.
        </p>

        {/* QR mockup */}
        <div className="inline-block bg-white p-5 rounded-2xl shadow-2xl mb-5">
          <div className="w-52 h-52 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23000%22 width=%22200%22 height=%22200%22/><rect fill=%22%23fff%22 x=%2210%22 y=%2210%22 width=%2250%22 height=%2250%22/><rect fill=%22%23000%22 x=%2220%22 y=%2220%22 width=%2230%22 height=%2230%22/><rect fill=%22%23fff%22 x=%22140%22 y=%2210%22 width=%2250%22 height=%2250%22/><rect fill=%22%23000%22 x=%22150%22 y=%2220%22 width=%2230%22 height=%2230%22/><rect fill=%22%23fff%22 x=%2210%22 y=%22140%22 width=%2250%22 height=%2250%22/><rect fill=%22%23000%22 x=%2220%22 y=%22150%22 width=%2230%22 height=%2230%22/><rect fill=%22%23fff%22 x=%2275%22 y=%2275%22 width=%2210%22 height=%2210%22/><rect fill=%22%23fff%22 x=%2290%22 y=%2290%22 width=%2210%22 height=%2210%22/><rect fill=%22%23fff%22 x=%22115%22 y=%2275%22 width=%2210%22 height=%2210%22/><rect fill=%22%23fff%22 x=%2275%22 y=%22115%22 width=%2210%22 height=%2210%22/><rect fill=%22%23fff%22 x=%22100%22 y=%22100%22 width=%2220%22 height=%2220%22/><rect fill=%22%23fff%22 x=%2290%22 y=%22125%22 width=%2210%22 height=%2210%22/><rect fill=%22%23fff%22 x=%22115%22 y=%22140%22 width=%2210%22 height=%2210%22/></svg>')] bg-contain bg-no-repeat bg-center" />
          <p className="text-[9px] font-mono text-gray-700 mt-3">
            satsai@ybl · {state.vaNumber}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/60 mb-0.5">
              Proprietor ID
            </div>
            <div className="text-sm font-mono font-semibold text-[#51C9AF]">
              {state.proprietorId}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/60 mb-0.5">
              VA Ref
            </div>
            <div className="text-sm font-mono font-semibold text-[#51C9AF]">
              {state.vaNumber}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-bold font-sora text-gray-900 text-sm mb-3">
          Your next steps
        </h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="font-bold text-[#25B181] flex-shrink-0">1.</span>
            <span>
              Print your <b>counter poster</b> — shows QR + Satsai branding +
              grievance phone number in your language.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#25B181] flex-shrink-0">2.</span>
            <span>
              Expect a call from our gig field agent for a 10-minute shop visit within 48
              hours (regulatory formality).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#25B181] flex-shrink-0">3.</span>
            <span>
              You will be listed on Satsai's public List of LSPs within 2 working days.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#25B181] flex-shrink-0">4.</span>
            <span>
              Start sourcing loans from the app. First disbursal cap is set small; ramps
              with track record.
            </span>
          </li>
        </ol>
      </div>

      <button
        onClick={() =>
          alert("Counter poster PDF — would download in production.")
        }
        className="w-full py-3.5 rounded-xl bg-[#FF9C70] hover:bg-[#E36229] text-[#0E2920] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
      >
        <QrCode className="w-4 h-4" />
        Download counter poster (PDF)
      </button>
    </div>
  );
}

/* ──────────────────────────── form primitives ──────────────────────────── */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-[#25B181] focus:ring-[#D3F1EB]"
  }`;
}

function Acceptance({
  checked,
  onChange,
  title,
  body,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  body: string;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
        checked
          ? "bg-[#D3F1EB] border-[#25B181]"
          : "bg-white border-gray-200 hover:border-[#25B181]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-[#25B181]"
      />
      <div className="min-w-0">
        <div className="font-semibold text-sm text-gray-900">{title}</div>
        <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">{body}</div>
      </div>
    </label>
  );
}
