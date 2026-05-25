"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Info,
  Lock,
  FileText,
  Building2,
  Users,
  TrendingUp,
  Briefcase,
  Scale,
  Coins,
  Landmark,
  X,
  Check,
  ShieldAlert,
} from "lucide-react";

/* ──────────────────────────── types ──────────────────────────── */

type Track = "T1" | "T2" | "T3" | "T4";

type DocStatus =
  | "pending"
  | "uploaded"
  | "under_review"
  | "approved"
  | "rejected";

interface DocItem {
  key: string;
  label: string;
  hint?: string;
  required: boolean;
  appliesTo: Track[]; // which tracks require this
  status: DocStatus;
  fileName?: string;
  reviewerNote?: string;
}

interface Bucket {
  key: string;
  title: string;
  icon: React.ComponentType<any>;
  appliesTo: Track[];
  items: DocItem[];
}

/* ──────────────────────────── mock state (wk-1; backend comes in wk-2) ──────────────────────────── */

const ALL: Track[] = ["T1", "T2", "T3", "T4"];

const seedBuckets = (applicationTrack: Track): Bucket[] => [
  {
    key: "entity",
    title: "A · Entity KYC",
    icon: Building2,
    appliesTo: ALL,
    items: [
      { key: "coi", label: "Certificate of Incorporation + CIN", required: true, appliesTo: ALL, status: "pending" },
      { key: "pan_entity", label: "PAN (entity)", required: true, appliesTo: ALL, status: "pending" },
      { key: "gstin", label: "GSTIN certificate (all states)", required: true, appliesTo: ALL, status: "pending" },
      { key: "moa_aoa", label: "MoA & AoA (latest certified)", required: true, appliesTo: ALL, status: "pending" },
      { key: "board_res", label: "Board resolution authorising the partnership + signatories", required: true, appliesTo: ALL, status: "pending" },
      { key: "directors", label: "Directors list + DIN + DSC", required: true, appliesTo: ALL, status: "pending" },
      { key: "trade_license", label: "Shop & Establishment / Trade Licence", required: false, appliesTo: ALL, status: "pending" },
      { key: "addr_proof", label: "Registered address proof (utility bill ≤ 3 months)", required: true, appliesTo: ALL, status: "pending" },
    ],
  },
  {
    key: "ubo",
    title: "B · UBO & Signatories",
    icon: Users,
    appliesTo: ALL,
    items: [
      { key: "mgt7", label: "MGT-7 shareholding pattern (latest)", required: true, appliesTo: ALL, status: "pending" },
      { key: "ubo_declaration", label: "UBO declaration (≥ 10% beneficial interest)", hint: "Stricter than RBI's 25% floor — our policy.", required: true, appliesTo: ALL, status: "pending" },
      { key: "ubo_kyc", label: "UBO KYC pack (PAN + Aadhaar/Passport + photo + video KYC)", required: true, appliesTo: ALL, status: "pending" },
      { key: "signatory_kyc", label: "Authorised signatory KYC + specimen", required: true, appliesTo: ALL, status: "pending" },
    ],
  },
  {
    key: "financial",
    title: "C · Financial & Credit",
    icon: TrendingUp,
    appliesTo: ALL,
    items: [
      { key: "audited_2y", label: "Audited financials — last 2 FYs", required: true, appliesTo: ALL, status: "pending" },
      { key: "itr_2y", label: "ITR — last 2 AYs (entity + promoters)", required: true, appliesTo: ALL, status: "pending" },
      { key: "bank_12m", label: "Bank statements — last 12 months (primary operating)", required: true, appliesTo: ALL, status: "pending" },
      { key: "networth", label: "CA-attested net worth certificate (≤ 3 months)", required: true, appliesTo: ALL, status: "pending" },
      { key: "gst_12m", label: "GST returns — last 12 months", required: true, appliesTo: ALL, status: "pending" },
      { key: "cibil_commercial", label: "CIBIL Commercial (CMR) + promoter CIBIL", required: true, appliesTo: ALL, status: "pending" },
    ],
  },
  {
    key: "capital",
    title: "D · Capital Source (T2 flagship)",
    icon: Coins,
    appliesTo: ["T2"],
    items: [
      { key: "board_ncd", label: "Board resolution for NCD subscription / debt extension", required: true, appliesTo: ["T2"], status: "pending" },
      { key: "source_funds", label: "Source-of-funds declaration", required: true, appliesTo: ["T2"], status: "pending" },
      { key: "fatf", label: "FATF / cross-border source screening", required: true, appliesTo: ["T2"], status: "pending" },
      { key: "fema_letter", label: "FEMA compliance letter (if foreign-source capital)", hint: "Only if applicable — e.g. foreign parent.", required: false, appliesTo: ["T2"], status: "pending" },
      { key: "trustee_consent", label: "Debenture trustee consent (NCD route)", required: false, appliesTo: ["T2"], status: "pending" },
    ],
  },
  {
    key: "re",
    title: "E · Regulated Entity Documentation (T3 / T4)",
    icon: Landmark,
    appliesTo: ["T3", "T4"],
    items: [
      { key: "rbi_cor", label: "RBI / NHB / SEBI Certificate of Registration", required: true, appliesTo: ["T3", "T4"], status: "pending" },
      { key: "audited_3y", label: "Last 3 FYs audited financials", required: true, appliesTo: ["T3", "T4"], status: "pending" },
      { key: "rbi_inspection", label: "Last regulatory inspection report", required: true, appliesTo: ["T3", "T4"], status: "pending" },
      { key: "co_lending_policy", label: "Board-approved Co-Lending Policy", required: true, appliesTo: ["T3"], status: "pending" },
      { key: "crar_pca", label: "CRAR / PCA status attestation", required: true, appliesTo: ["T3", "T4"], status: "pending" },
      { key: "compliance_officer", label: "Compliance Officer details", required: true, appliesTo: ["T3", "T4"], status: "pending" },
    ],
  },
  {
    key: "business",
    title: "F · Business Profile",
    icon: Briefcase,
    appliesTo: ALL,
    items: [
      { key: "usecase_deck", label: "Use-case deck", required: true, appliesTo: ALL, status: "pending" },
      { key: "target_profile", label: "Target segment / ticket / geography", required: true, appliesTo: ALL, status: "pending" },
      { key: "mau_proof", label: "MAU / existing customer base proof", required: true, appliesTo: ALL, status: "pending" },
      { key: "volume_projection", label: "Projected 6 / 12 / 24-month disbursal volume", required: true, appliesTo: ALL, status: "pending" },
      { key: "branding_pref", label: "Co-brand vs white-label preference", required: true, appliesTo: ALL, status: "pending" },
    ],
  },
  {
    key: "tech",
    title: "G · Tech & Security",
    icon: Lock,
    appliesTo: ALL,
    items: [
      { key: "iso27001", label: "ISO 27001 certificate (or roadmap)", required: true, appliesTo: ALL, status: "pending" },
      { key: "vapt", label: "CERT-In empanelled VAPT report (≤ 12 months)", required: true, appliesTo: ALL, status: "pending" },
      { key: "data_localization", label: "Data localisation attestation (India-only)", required: true, appliesTo: ALL, status: "pending" },
      { key: "api_security", label: "API security posture (OAuth2/mTLS, IP whitelist, rate limits)", required: true, appliesTo: ALL, status: "pending" },
      { key: "cyber_insurance", label: "Cyber insurance policy", required: false, appliesTo: ALL, status: "pending" },
      { key: "dpdp", label: "DPDP attestations (DPO, Consent Manager, 72-hr breach SLA, privacy policy)", required: true, appliesTo: ALL, status: "pending" },
      { key: "bcp_dr", label: "BCP / DR plan with stated RTO / RPO", required: true, appliesTo: ALL, status: "pending" },
    ],
  },
  {
    key: "risk",
    title: "H · Risk & Operations",
    icon: Scale,
    appliesTo: ALL,
    items: [
      { key: "gro", label: "Grievance Redressal Officer on DLA (name + email + phone)", required: true, appliesTo: ALL, status: "pending" },
      { key: "nodal", label: "Nodal Officer wiring to Satsai CMS", required: true, appliesTo: ALL, status: "pending" },
      { key: "escrow", label: "Escrow / nodal account arrangement letter", required: true, appliesTo: ALL, status: "pending" },
      { key: "collections_code", label: "Collections conduct policy (no 8pm–7am, no harassment)", required: true, appliesTo: ALL, status: "pending" },
      { key: "fpc_adoption", label: "Satsai Fair Practices Code adoption attestation", required: true, appliesTo: ALL, status: "pending" },
      { key: "complaints_mis", label: "Monthly complaints MIS commitment", required: true, appliesTo: ALL, status: "pending" },
      { key: "kfs_signoff", label: "KFS template sign-off (Satsai as lender)", required: true, appliesTo: ALL, status: "pending" },
      { key: "exit_plan", label: "Exit / wind-down plan", required: true, appliesTo: ALL, status: "pending" },
    ],
  },
];

/* ──────────────────────────── page ──────────────────────────── */

export default function EDDPortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // Wk-1: hydrate from localStorage; wk-2 moves to GET /api/partners/:id/edd
  const [track, setTrack] = useState<Track>("T2");
  const [buckets, setBuckets] = useState<Bucket[]>(() => seedBuckets("T2"));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(`edd:${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.track) setTrack(parsed.track);
        if (parsed.buckets) setBuckets(parsed.buckets);
      } catch {
        // ignore
      }
    }
  }, [id]);

  function persist(next: Bucket[], nextTrack: Track = track) {
    setBuckets(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `edd:${id}`,
        JSON.stringify({ track: nextTrack, buckets: next })
      );
    }
  }

  function switchTrack(t: Track) {
    setTrack(t);
    persist(seedBuckets(t), t);
  }

  function onFakeUpload(bucketKey: string, docKey: string, fileName: string) {
    const next = buckets.map((b) =>
      b.key !== bucketKey
        ? b
        : {
            ...b,
            items: b.items.map((it) =>
              it.key !== docKey
                ? it
                : { ...it, status: "uploaded" as DocStatus, fileName }
            ),
          }
    );
    persist(next);
  }

  function onRemove(bucketKey: string, docKey: string) {
    const next = buckets.map((b) =>
      b.key !== bucketKey
        ? b
        : {
            ...b,
            items: b.items.map((it) =>
              it.key !== docKey
                ? it
                : { ...it, status: "pending" as DocStatus, fileName: undefined }
            ),
          }
    );
    persist(next);
  }

  // Filter buckets to tracks applicable
  const visibleBuckets = useMemo(
    () => buckets.filter((b) => b.appliesTo.includes(track)),
    [buckets, track]
  );

  const progress = useMemo(() => {
    const required = visibleBuckets.flatMap((b) =>
      b.items.filter(
        (it) => it.required && it.appliesTo.includes(track)
      )
    );
    const done = required.filter((it) =>
      ["uploaded", "under_review", "approved"].includes(it.status)
    ).length;
    return {
      done,
      total: required.length,
      pct: required.length === 0 ? 0 : Math.round((done / required.length) * 100),
    };
  }, [visibleBuckets, track]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F5F5]">
      {/* Header */}
      <section className="bg-[#0E2920] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/partners/lending-partner-program"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to partners
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] uppercase tracking-wider text-[#51C9AF] mb-3">
                <ShieldCheck className="w-3 h-3" />
                Stage 3 of 5 · Enhanced Due Diligence
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-sora leading-tight mb-2">
                Partner EDD Portal
              </h1>
              <p className="text-sm text-white/70">
                Application{" "}
                <span className="font-mono font-semibold text-[#51C9AF]">{id}</span>
                {" "}· Track{" "}
                <span className="font-bold text-white">{track}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-white/60">
                  Required docs
                </span>
                <span className="text-sm font-bold text-[#51C9AF]">
                  {progress.done} / {progress.total}
                </span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.pct}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-gradient-to-r from-[#25B181] to-[#51C9AF]"
                />
              </div>
              <p className="text-xs text-white/60 mt-2">
                {progress.pct === 100
                  ? "All required docs submitted — Risk Committee review will begin."
                  : "Progress saves automatically in your browser until go-live moves to server-side persistence."}
              </p>
            </div>
          </div>

          {/* Track switcher — wk-1 fallback (wk-2 hides behind server state) */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/60 uppercase tracking-wider mr-1">
              Track:
            </span>
            {(["T1", "T2", "T3", "T4"] as Track[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTrack(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  track === t
                    ? "bg-[#51C9AF] text-[#0E2920]"
                    : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
            <span className="text-[11px] text-white/40 ml-2">
              Finalised during eligibility pre-check; switcher shown for testing.
            </span>
          </div>
        </div>
      </section>

      {/* Regulatory callout */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <div className="bg-[#FFEBD1] border-l-4 border-[#E36229] rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-[#E36229] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-800 leading-relaxed">
            <p className="mb-2">
              Documents uploaded here are used strictly to evaluate this partnership by Satsai
              Finlease Private Limited, Fluxusforge and Quikkred personnel and are stored in
              India under DPDP-compliant controls. Retention policy and deletion rights per the
              Data Processing Agreement executed at Stage 4.
            </p>
            <p className="text-xs text-gray-600">
              Governing references: RBI (Digital Lending) Directions, 2025 (8 May 2025) ·
              RBI Co-Lending Arrangements Directions, 2025 (effective 1 Jan 2026 — Track 3 only) ·
              RBI KYC Master Direction (updated 2024) · DPDP Act 2023 + DPDP Rules 2025
              (notified 13 Nov 2025).
            </p>
          </div>
        </div>
      </section>

      {/* Buckets */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 max-w-5xl space-y-5">
        {visibleBuckets.map((bucket, bi) => (
          <BucketCard
            key={bucket.key}
            bucket={bucket}
            track={track}
            onUpload={onFakeUpload}
            onRemove={onRemove}
            delay={bi * 0.04}
          />
        ))}

        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="font-bold font-sora text-gray-900 text-lg mb-2">
            Everything in? Submit for Risk Committee review.
          </h3>
          <p className="text-sm text-gray-600 mb-5 max-w-xl mx-auto">
            Our Risk Committee — Satsai CRO, Satsai Compliance Officer, Satsai CFO
            (for capital tracks), Fluxusforge Head of Risk, Quikkred BD — meets
            within 3 working days of a complete package.
          </p>
          <button
            disabled={progress.pct < 100}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25B181] hover:bg-[#1F8F68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl font-semibold text-white"
          >
            <CheckCircle2 className="w-4 h-4" />
            {progress.pct < 100
              ? `Submit for review (${progress.done}/${progress.total} required docs)`
              : "Submit for Risk Committee review"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────── components ──────────────────────────── */

function BucketCard({
  bucket,
  track,
  onUpload,
  onRemove,
  delay,
}: {
  bucket: Bucket;
  track: Track;
  onUpload: (bucketKey: string, docKey: string, fileName: string) => void;
  onRemove: (bucketKey: string, docKey: string) => void;
  delay: number;
}) {
  const Icon = bucket.icon;
  const items = bucket.items.filter((it) => it.appliesTo.includes(track));
  const done = items.filter((it) =>
    ["uploaded", "under_review", "approved"].includes(it.status)
  ).length;
  const isTrackSpecific =
    bucket.appliesTo.length < 4; // not all-tracks

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`bg-white rounded-2xl border ${
        isTrackSpecific ? "border-[#E36229]/30" : "border-gray-100"
      } overflow-hidden`}
    >
      <div
        className={`flex items-center justify-between p-5 ${
          isTrackSpecific ? "bg-[#FFF4E4]/50" : "bg-[#F5F5F5]"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isTrackSpecific ? "bg-[#FFEBD1]" : "bg-[#D3F1EB]"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isTrackSpecific ? "text-[#E36229]" : "text-[#1F8F68]"
              }`}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold font-sora text-gray-900 text-sm sm:text-base">
              {bucket.title}
            </h3>
            {isTrackSpecific && (
              <p className="text-[11px] uppercase tracking-wider text-[#E36229] font-semibold mt-0.5">
                Applies to {bucket.appliesTo.join(" · ")}
              </p>
            )}
          </div>
        </div>
        <div className="text-xs font-semibold text-gray-600 whitespace-nowrap">
          {done}/{items.length}
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((it) => (
          <DocRow
            key={it.key}
            doc={it}
            onUpload={(fileName) => onUpload(bucket.key, it.key, fileName)}
            onRemove={() => onRemove(bucket.key, it.key)}
          />
        ))}
      </ul>
    </motion.div>
  );
}

function DocRow({
  doc,
  onUpload,
  onRemove,
}: {
  doc: DocItem;
  onUpload: (fileName: string) => void;
  onRemove: () => void;
}) {
  const statusPill = statusDisplay(doc.status);

  function onFilePicked(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (file) onUpload(file.name);
    ev.target.value = "";
  }

  return (
    <li className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-sm text-gray-900 font-medium leading-snug">
            {doc.label}
          </span>
          {doc.required ? (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
              Required
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Optional
            </span>
          )}
        </div>
        {doc.hint && (
          <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {doc.hint}
          </p>
        )}
        {doc.fileName && (
          <p className="text-xs text-[#1F8F68] mt-1 flex items-center gap-1.5 font-mono truncate">
            <FileText className="w-3 h-3 flex-shrink-0" />
            {doc.fileName}
          </p>
        )}
        {doc.reviewerNote && (
          <p className="text-xs text-red-600 mt-1 flex items-start gap-1.5">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {doc.reviewerNote}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusPill.cls}`}
        >
          {statusPill.icon}
          {statusPill.label}
        </span>

        {doc.status === "pending" || doc.status === "rejected" ? (
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25B181] hover:bg-[#1F8F68] text-white text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-3 h-3" />
            Upload
            <input
              type="file"
              className="hidden"
              onChange={onFilePicked}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />
          </label>
        ) : (
          <button
            onClick={onRemove}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            <X className="w-3 h-3" />
            Replace
          </button>
        )}
      </div>
    </li>
  );
}

function statusDisplay(s: DocStatus): {
  label: string;
  cls: string;
  icon: React.ReactNode;
} {
  switch (s) {
    case "pending":
      return {
        label: "Pending",
        cls: "bg-gray-100 text-gray-600",
        icon: <Clock className="w-3 h-3" />,
      };
    case "uploaded":
      return {
        label: "Uploaded",
        cls: "bg-[#DAE6FF] text-[#4A66FF]",
        icon: <Check className="w-3 h-3" />,
      };
    case "under_review":
      return {
        label: "Under review",
        cls: "bg-[#FFEBD1] text-[#E36229]",
        icon: <Clock className="w-3 h-3" />,
      };
    case "approved":
      return {
        label: "Approved",
        cls: "bg-[#D3F1EB] text-[#1F8F68]",
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    case "rejected":
      return {
        label: "Rejected",
        cls: "bg-red-50 text-red-600",
        icon: <AlertCircle className="w-3 h-3" />,
      };
  }
}
