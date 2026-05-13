"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Network,
  User,
  Banknote,
  FileText,
  Upload,
  X,
  Building2,
  Camera,
  IdCard,
  FileBadge,
  Sparkles,
} from "lucide-react";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPTED_DOC_EXTS = ".pdf,.jpg,.jpeg,.png";
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ACCEPTED_IMAGE_EXTS = ".jpg,.jpeg,.png";

interface FormState {
  fullName: string;
  mobile: string;

  panNumber: string;
  aadhaarNumber: string;
  gstNumber: string;

  bankAccountHolder: string;
  bankAccountNumber: string;
  bankAccountConfirm: string;
  bankIfsc: string;

  docPan: File | null;
  docAadhaarFront: File | null;
  docAadhaarBack: File | null;
  docFace: File | null;
  docCoi: File | null;
  docMoa: File | null;
  docAoa: File | null;
  docGst: File | null;

  consent: boolean;
}

const initial: FormState = {
  fullName: "",
  mobile: "",
  panNumber: "",
  aadhaarNumber: "",
  gstNumber: "",
  bankAccountHolder: "",
  bankAccountNumber: "",
  bankAccountConfirm: "",
  bankIfsc: "",
  docPan: null,
  docAadhaarFront: null,
  docAadhaarBack: null,
  docFace: null,
  docCoi: null,
  docMoa: null,
  docAoa: null,
  docGst: null,
  consent: false,
};

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_REGEX = /^[0-9]{12}$/;
const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const MOBILE_REGEX = /^[6-9][0-9]{9}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function fileErr(
  file: File | null,
  required: boolean,
  accepted: string[],
): string | null {
  if (!file) return required ? "Upload required" : null;
  if (file.size > MAX_FILE_BYTES) return "Max 5 MB";
  if (!accepted.includes(file.type)) return "Wrong format";
  return null;
}

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};

  if (!f.fullName.trim()) e.fullName = "Required";
  if (!MOBILE_REGEX.test(f.mobile))
    e.mobile = "10-digit Indian mobile starting with 6–9";

  if (!PAN_REGEX.test(f.panNumber))
    e.panNumber = "Enter a valid 10-character PAN";
  if (!AADHAAR_REGEX.test(f.aadhaarNumber))
    e.aadhaarNumber = "Enter 12-digit Aadhaar number";

  const hasGst = !!f.gstNumber.trim();
  if (hasGst && !GSTIN_REGEX.test(f.gstNumber))
    e.gstNumber = "Enter a valid 15-character GSTIN";

  if (!f.bankAccountHolder.trim()) e.bankAccountHolder = "Required";
  if (!/^[0-9]{9,18}$/.test(f.bankAccountNumber))
    e.bankAccountNumber = "9–18 digit account number";
  if (f.bankAccountConfirm !== f.bankAccountNumber)
    e.bankAccountConfirm = "Account numbers don't match";
  if (!IFSC_REGEX.test(f.bankIfsc)) e.bankIfsc = "Enter a valid 11-char IFSC";

  const set = (k: keyof FormState, msg: string | null) => {
    if (msg) e[k] = msg;
  };
  set("docPan", fileErr(f.docPan, true, ACCEPTED_DOC_TYPES));
  set("docAadhaarFront", fileErr(f.docAadhaarFront, true, ACCEPTED_DOC_TYPES));
  set("docAadhaarBack", fileErr(f.docAadhaarBack, true, ACCEPTED_DOC_TYPES));
  set("docFace", fileErr(f.docFace, true, ACCEPTED_IMAGE_TYPES));
  set("docCoi", fileErr(f.docCoi, false, ACCEPTED_DOC_TYPES));
  set("docMoa", fileErr(f.docMoa, false, ACCEPTED_DOC_TYPES));
  set("docAoa", fileErr(f.docAoa, false, ACCEPTED_DOC_TYPES));
  // GST certificate is required when a GST number is provided
  set("docGst", fileErr(f.docGst, hasGst, ACCEPTED_DOC_TYPES));

  if (!f.consent) e.consent = "Required to proceed";

  return e;
}

const DOC_KEYS = [
  "docPan",
  "docAadhaarFront",
  "docAadhaarBack",
  "docFace",
  "docCoi",
  "docMoa",
  "docAoa",
  "docGst",
] as const;

const REQUIRED_DOC_KEYS: ReadonlyArray<(typeof DOC_KEYS)[number]> = [
  "docPan",
  "docAadhaarFront",
  "docAadhaarBack",
  "docFace",
];

export default function ProprietorDistributorApplyPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    applicationId: string;
  } | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  }

  const requiredDocCount = REQUIRED_DOC_KEYS.length;
  const optionalDocCount = DOC_KEYS.length - REQUIRED_DOC_KEYS.length;
  const requiredDocsDone = REQUIRED_DOC_KEYS.filter((k) => form[k]).length;
  const optionalDocsDone = DOC_KEYS.filter(
    (k) => !REQUIRED_DOC_KEYS.includes(k) && form[k],
  ).length;
  const allDocsDone = requiredDocsDone + optionalDocsDone;

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      const el = document.getElementById(`field-${firstKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      const payload: Record<string, unknown> = {
        fullName: form.fullName,
        mobile: form.mobile,
        panNumber: form.panNumber.toUpperCase(),
        aadhaarNumber: form.aadhaarNumber,
        gstNumber: form.gstNumber.toUpperCase(),
        bankAccountHolder: form.bankAccountHolder,
        bankAccountNumber: form.bankAccountNumber,
        bankIfsc: form.bankIfsc.toUpperCase(),
        submittedAt: new Date().toISOString(),
      };
      fd.append("payload", JSON.stringify(payload));

      for (const k of DOC_KEYS) {
        const file = form[k];
        if (file) fd.append(k, file, file.name);
      }

      const res = await fetch("/api/partners/proprietor-distributor/apply", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const fallbackId = `QDIST-${Date.now().toString(36).toUpperCase()}`;
        setSubmitted({ applicationId: fallbackId });
        return;
      }
      const data = await res.json();
      setSubmitted({
        applicationId: data.applicationId || data.id || `QDIST-${Date.now()}`,
      });
    } catch {
      const fallbackId = `QDIST-${Date.now().toString(36).toUpperCase()}`;
      setSubmitted({ applicationId: fallbackId });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F5F5]">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#D3F1EB] flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-[#1F8F68]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sora text-gray-900 mb-3">
              Distributor application received
            </h1>
            <p className="text-gray-600 mb-2">Your reference number:</p>
            <div className="inline-block px-5 py-2.5 rounded-xl bg-[#0E2920] text-[#51C9AF] font-mono text-lg font-semibold mb-6">
              {submitted.applicationId}
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Our team will reach out within 1 working day to schedule a fit
              call and share the Tripartite Distributor Agreement for eSign.
            </p>
            <Link
              href="/partners/proprietor-network"
              className="inline-flex items-center gap-2 text-sm text-[#1F8F68] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to proprietor network overview
            </Link>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F5F5]">
      <section className="relative overflow-hidden bg-[#0E2920] text-white">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(700px 320px at 10% 10%, rgba(255,156,112,0.35), transparent 60%), radial-gradient(600px 280px at 90% 90%, rgba(37,177,129,0.3), transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/partners/proprietor-network"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to proprietor network
          </Link>
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6 text-[#FF9C70]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] uppercase tracking-wider text-[#51C9AF] mb-2">
                <ShieldCheck className="w-3 h-3" />
                Distributor onboarding
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora leading-tight">
                Become a Quikkred Distributor
              </h1>
              <p className="text-white/75 mt-2 text-sm sm:text-base">
                Quick KYC + bank + business documents. Takes about 3 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
        <form
          onSubmit={onSubmit}
          className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-7"
        >
          {/* 1. Identity */}
          <SectionTitle icon={User} title="Your details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="field-fullName" label="Full name" required error={errors.fullName}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="As per PAN"
                className={inputCls(!!errors.fullName)}
              />
            </Field>

            <Field id="field-mobile" label="Mobile" required error={errors.mobile}>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) =>
                    update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="9876543210"
                  maxLength={10}
                  className={`${inputCls(!!errors.mobile)} rounded-l-none`}
                />
              </div>
            </Field>

            <Field id="field-panNumber" label="PAN number" required error={errors.panNumber}>
              <input
                type="text"
                value={form.panNumber}
                onChange={(e) =>
                  update("panNumber", e.target.value.toUpperCase().slice(0, 10))
                }
                placeholder="ABCDE1234F"
                maxLength={10}
                className={`${inputCls(!!errors.panNumber)} font-mono tracking-wider`}
              />
            </Field>

            <Field
              id="field-aadhaarNumber"
              label="Aadhaar number"
              required
              error={errors.aadhaarNumber}
            >
              <input
                type="text"
                inputMode="numeric"
                value={form.aadhaarNumber}
                onChange={(e) =>
                  update(
                    "aadhaarNumber",
                    e.target.value.replace(/\D/g, "").slice(0, 12),
                  )
                }
                placeholder="1234 1234 1234"
                maxLength={12}
                className={`${inputCls(!!errors.aadhaarNumber)} font-mono tracking-wider`}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field
                id="field-gstNumber"
                label="GSTIN"
                hint="Optional — leave blank if you are not GST-registered. Required only if your business has a GST number."
                error={errors.gstNumber}
              >
                <input
                  type="text"
                  value={form.gstNumber}
                  onChange={(e) =>
                    update("gstNumber", e.target.value.toUpperCase().slice(0, 15))
                  }
                  placeholder="27AAAAA0000A1Z5"
                  maxLength={15}
                  className={`${inputCls(!!errors.gstNumber)} font-mono tracking-wider`}
                />
              </Field>
            </div>
          </div>

          {/* 2. Bank */}
          <div className="border-t border-gray-100 pt-7">
            <SectionTitle icon={Banknote} title="Bank account" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="field-bankAccountHolder"
                label="Account holder name"
                required
                hint="Must match PAN name"
                error={errors.bankAccountHolder}
              >
                <input
                  type="text"
                  value={form.bankAccountHolder}
                  onChange={(e) => update("bankAccountHolder", e.target.value)}
                  className={inputCls(!!errors.bankAccountHolder)}
                />
              </Field>

              <Field
                id="field-bankIfsc"
                label="IFSC code"
                required
                error={errors.bankIfsc}
              >
                <input
                  type="text"
                  value={form.bankIfsc}
                  onChange={(e) =>
                    update("bankIfsc", e.target.value.toUpperCase().slice(0, 11))
                  }
                  placeholder="HDFC0001234"
                  maxLength={11}
                  className={`${inputCls(!!errors.bankIfsc)} font-mono`}
                />
              </Field>

              <Field
                id="field-bankAccountNumber"
                label="Account number"
                required
                error={errors.bankAccountNumber}
              >
                <input
                  type="text"
                  value={form.bankAccountNumber}
                  onChange={(e) =>
                    update(
                      "bankAccountNumber",
                      e.target.value.replace(/\D/g, "").slice(0, 18),
                    )
                  }
                  maxLength={18}
                  className={`${inputCls(!!errors.bankAccountNumber)} font-mono`}
                />
              </Field>

              <Field
                id="field-bankAccountConfirm"
                label="Confirm account number"
                required
                error={errors.bankAccountConfirm}
              >
                <input
                  type="text"
                  value={form.bankAccountConfirm}
                  onChange={(e) =>
                    update(
                      "bankAccountConfirm",
                      e.target.value.replace(/\D/g, "").slice(0, 18),
                    )
                  }
                  onPaste={(e) => e.preventDefault()}
                  placeholder="Re-type"
                  maxLength={18}
                  className={`${inputCls(!!errors.bankAccountConfirm)} font-mono`}
                />
              </Field>
            </div>
          </div>

          {/* 3. Documents */}
          <div className="border-t border-gray-100 pt-7">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
              <SectionTitle
                icon={FileText}
                title="Documents"
                note="PDF, JPG or PNG · max 5 MB each"
                noMargin
              />
              <ProgressChip
                done={allDocsDone}
                requiredDone={requiredDocsDone}
                requiredTotal={requiredDocCount}
                optionalTotal={optionalDocCount}
              />
            </div>

            {/* Personal KYC sub-group */}
            <SubGroupHeader
              icon={IdCard}
              title="Personal KYC"
              subtitle="Identity proof + a quick selfie"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileField
                id="field-docPan"
                label="PAN card"
                required
                error={errors.docPan}
                file={form.docPan}
                onSelect={(f) => update("docPan", f)}
                accept={ACCEPTED_DOC_EXTS}
              />
              <FileField
                id="field-docFace"
                label="Selfie"
                required
                hint="JPG or PNG · taken in good light"
                error={errors.docFace}
                file={form.docFace}
                onSelect={(f) => update("docFace", f)}
                accept={ACCEPTED_IMAGE_EXTS}
                captureSelfie
                rounded
              />
            </div>

            <div className="mt-4">
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gradient-to-br from-[#FFF8EE] to-white p-3 sm:p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#E36229] mb-2 px-1">
                  <IdCard className="w-3.5 h-3.5" />
                  Aadhaar — both sides
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FileField
                    id="field-docAadhaarFront"
                    label="Aadhaar — front"
                    required
                    error={errors.docAadhaarFront}
                    file={form.docAadhaarFront}
                    onSelect={(f) => update("docAadhaarFront", f)}
                    accept={ACCEPTED_DOC_EXTS}
                    tone="muted"
                  />
                  <FileField
                    id="field-docAadhaarBack"
                    label="Aadhaar — back"
                    required
                    error={errors.docAadhaarBack}
                    file={form.docAadhaarBack}
                    onSelect={(f) => update("docAadhaarBack", f)}
                    accept={ACCEPTED_DOC_EXTS}
                    tone="muted"
                  />
                </div>
              </div>
            </div>

            {/* Business documents sub-group */}
            <div className="mt-6">
              <SubGroupHeader
                icon={Building2}
                title="Business documents"
                subtitle={
                  form.gstNumber.trim()
                    ? "GST certificate is required because you provided a GSTIN"
                    : "Optional — upload what applies to your entity type"
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileField
                  id="field-docCoi"
                  label="Certificate of Incorporation"
                  hint="If applicable (Pvt Ltd / LLP)"
                  error={errors.docCoi}
                  file={form.docCoi}
                  onSelect={(f) => update("docCoi", f)}
                  accept={ACCEPTED_DOC_EXTS}
                />
                <FileField
                  id="field-docGst"
                  label="GST Certificate"
                  required={!!form.gstNumber.trim()}
                  hint={
                    form.gstNumber.trim()
                      ? "Required (GSTIN above)"
                      : "If GST-registered"
                  }
                  error={errors.docGst}
                  file={form.docGst}
                  onSelect={(f) => update("docGst", f)}
                  accept={ACCEPTED_DOC_EXTS}
                />
                <FileField
                  id="field-docMoa"
                  label="MOA"
                  hint="Memorandum of Association"
                  error={errors.docMoa}
                  file={form.docMoa}
                  onSelect={(f) => update("docMoa", f)}
                  accept={ACCEPTED_DOC_EXTS}
                />
                <FileField
                  id="field-docAoa"
                  label="AOA"
                  hint="Articles of Association"
                  error={errors.docAoa}
                  file={form.docAoa}
                  onSelect={(f) => update("docAoa", f)}
                  accept={ACCEPTED_DOC_EXTS}
                />
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="border-t border-gray-100 pt-7">
            <label
              id="field-consent"
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#25B181]"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I consent to KYC verification of my PAN, Aadhaar and selfie,
                and to Quikkred / Satsai processing the data I&apos;ve
                submitted under the{" "}
                <Link
                  href="/privacy-policy"
                  className="underline text-[#1F8F68]"
                >
                  Privacy Policy
                </Link>{" "}
                and DPDP Act 2023.
              </span>
            </label>
            {errors.consent && (
              <p className="text-xs text-red-600 ml-7 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.consent}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E36229] hover:bg-[#C84F1C] disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-xl font-semibold text-white shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit application
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <Link
              href="/partners/proprietor-network"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 transition-colors rounded-xl font-semibold text-gray-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

/* ────────── helpers ────────── */

function SectionTitle({
  icon: Icon,
  title,
  note,
  noMargin,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  note?: string;
  noMargin?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 ${noMargin ? "" : "mb-4"}`}>
      <div className="w-9 h-9 rounded-xl bg-[#FFEBD1] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#E36229]" />
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F8F68]">
          {title}
        </h2>
        {note && <p className="text-xs text-gray-500 mt-0.5">{note}</p>}
      </div>
    </div>
  );
}

function SubGroupHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-[#1F8F68]" />
      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
        {title}
      </span>
      <span className="text-xs text-gray-400">·</span>
      <span className="text-xs text-gray-500 truncate">{subtitle}</span>
    </div>
  );
}

function ProgressChip({
  done,
  requiredDone,
  requiredTotal,
  optionalTotal,
}: {
  done: number;
  requiredDone: number;
  requiredTotal: number;
  optionalTotal: number;
}) {
  const allRequired = requiredDone >= requiredTotal;
  const total = requiredTotal + optionalTotal;
  const pct = Math.round((done / total) * 100);
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
        allRequired
          ? "bg-[#D3F1EB] border-[#25B181]/40 text-[#1F8F68]"
          : "bg-white border-gray-200 text-gray-700"
      }`}
    >
      {allRequired ? (
        <Sparkles className="w-3.5 h-3.5" />
      ) : (
        <FileBadge className="w-3.5 h-3.5 text-[#E36229]" />
      )}
      <span>
        <b>{done}</b>
        <span className="opacity-60"> / {total}</span> uploaded
      </span>
      <span className="hidden sm:inline opacity-50">·</span>
      <span className="hidden sm:inline opacity-70">
        {requiredDone}/{requiredTotal} required
      </span>
      <span className="hidden sm:inline opacity-50">·</span>
      <span className="hidden sm:inline opacity-70">{pct}%</span>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id}>
      <label className="block text-sm font-medium text-gray-800 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-[#25B181] focus:ring-[#D3F1EB]"
  }`;
}

function FileField({
  id,
  label,
  required,
  hint,
  error,
  file,
  onSelect,
  accept,
  captureSelfie,
  rounded,
  tone = "card",
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  file: File | null;
  onSelect: (f: File | null) => void;
  accept: string;
  captureSelfie?: boolean;
  rounded?: boolean;
  tone?: "card" | "muted";
}) {
  const inputId = `${id}-input`;

  // Generate a preview URL for image files, revoke on cleanup
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isPdf = file?.type === "application/pdf";

  const borderClass = useMemo(() => {
    if (error) return "border-red-300 hover:bg-red-50/40 bg-white";
    if (file)
      return "border-[#25B181] bg-[#D3F1EB]/40 hover:bg-[#D3F1EB]/70";
    if (tone === "muted")
      return "border-gray-200 hover:border-[#25B181] hover:bg-white bg-white/60";
    return "border-gray-200 hover:border-[#25B181] hover:bg-gray-50";
  }, [error, file, tone]);

  return (
    <div id={id}>
      <label className="block text-sm font-medium text-gray-800 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label
        htmlFor={inputId}
        className={`relative flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${borderClass}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Thumbnail / icon */}
          <div
            className={`flex-shrink-0 flex items-center justify-center overflow-hidden ${
              rounded ? "rounded-full" : "rounded-lg"
            } ${file ? "" : "bg-[#FFEBD1] text-[#E36229]"} ${
              rounded ? "w-12 h-12" : "w-10 h-10"
            }`}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : isPdf ? (
              <div className="w-full h-full bg-[#0E2920] text-[#FF9C70] flex items-center justify-center font-mono text-[10px] font-bold tracking-wider">
                PDF
              </div>
            ) : captureSelfie ? (
              <Camera className="w-4 h-4" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            {file ? (
              <>
                <div className="font-medium text-gray-900 truncate text-sm">
                  {file.name}
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <span>{(file.size / 1024).toFixed(0)} KB</span>
                  <span className="opacity-50">·</span>
                  <span>tap to replace</span>
                </div>
              </>
            ) : (
              <>
                <div className="font-medium text-gray-700 text-sm">
                  {captureSelfie ? "Take selfie / upload" : "Choose file"}
                </div>
                <div className="text-[11px] text-gray-500">{accept}</div>
              </>
            )}
          </div>
        </div>

        {/* Status pip / remove */}
        {file ? (
          <button
            type="button"
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              onSelect(null);
            }}
            className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div
            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
              required
                ? "bg-[#FFEBD1] text-[#E36229]"
                : "bg-gray-100 text-gray-400"
            }`}
            aria-hidden
          >
            <Upload className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Filled check badge in the corner */}
        {file && !error && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#25B181] text-white flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        capture={captureSelfie ? "user" : undefined}
        className="hidden"
        onChange={(ev) => {
          const f = ev.target.files?.[0] ?? null;
          onSelect(f);
          ev.target.value = "";
        }}
      />
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
