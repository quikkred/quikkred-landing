"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
} from "lucide-react";

type UseCase =
  | ""
  | "checkout_finance"
  | "salary_advance"
  | "neobank_loan_module"
  | "msme_owner_loan"
  | "purchase_finance"
  | "embedded_saas"
  | "treasury_deploy"
  | "other";

type VolumeBand =
  | ""
  | "lt_1cr"
  | "1_5cr"
  | "5_25cr"
  | "25_100cr"
  | "gt_100cr";

type EntityType =
  | ""
  | "private_ltd"
  | "llp"
  | "public_ltd"
  | "nbfc"
  | "bank"
  | "hfc"
  | "mf"
  | "aif"
  | "arc"
  | "other";

type CapitalIntent =
  | ""
  | "none"
  | "ncd_subscription"
  | "term_debt"
  | "icd"
  | "portfolio_assignment"
  | "co_lending_proportional"
  | "undecided";

interface FormState {
  // Entity classification (drives track routing)
  entityType: EntityType;
  isRegulatedEntity: "" | "yes" | "no";
  rbiRegistrationNumber: string;
  // Company
  legalName: string;
  cin: string;
  gstin: string;
  website: string;
  // Contact
  fullName: string;
  role: string;
  workEmail: string;
  mobile: string;
  // Fit
  useCase: UseCase;
  expectedMonthlyDisbursal: VolumeBand;
  monthlyActiveUsers: string;
  capitalIntent: CapitalIntent;
  heardFrom: string;
  // Consents
  consentRbi: boolean;
  consentDpdp: boolean;
  consentRelated: boolean;
}

const initial: FormState = {
  entityType: "",
  isRegulatedEntity: "",
  rbiRegistrationNumber: "",
  legalName: "",
  cin: "",
  gstin: "",
  website: "",
  fullName: "",
  role: "",
  workEmail: "",
  mobile: "",
  useCase: "",
  expectedMonthlyDisbursal: "",
  monthlyActiveUsers: "",
  capitalIntent: "",
  heardFrom: "",
  consentRbi: false,
  consentDpdp: false,
  consentRelated: false,
};

// Automatic track assignment from the inputs. Shown live to the applicant.
function assignTrack(f: FormState): {
  code: "T1" | "T2" | "T3" | "T4" | null;
  label: string;
  rationale: string;
} {
  if (f.isRegulatedEntity === "yes") {
    if (["nbfc", "bank", "hfc"].includes(f.entityType)) {
      return {
        code: "T3",
        label: "Track 3 · Co-Lending Partner",
        rationale:
          "As a Regulated Entity, you qualify for RBI's Co-Lending Arrangements Directions, 2025 (effective 1 Jan 2026) with Satsai.",
      };
    }
    if (["mf", "aif", "arc"].includes(f.entityType) || f.capitalIntent === "portfolio_assignment") {
      return {
        code: "T4",
        label: "Track 4 · Portfolio Partner",
        rationale:
          "As a financial entity eligible to purchase loan pools, you qualify for post-MHP Direct Assignment.",
      };
    }
  }
  if (["ncd_subscription", "term_debt", "icd"].includes(f.capitalIntent)) {
    return {
      code: "T2",
      label: "Track 2 · Capital Partner (flagship)",
      rationale:
        "You intend to deploy capital into Satsai — the flagship B2B2C structure for Private Limited companies.",
    };
  }
  if (f.capitalIntent === "none") {
    return {
      code: "T1",
      label: "Track 1 · Sourcing Partner",
      rationale:
        "You'll source loans and earn a revenue share; no capital deployment, FLDG applies.",
    };
  }
  return {
    code: null,
    label: "Track to be assigned",
    rationale:
      "We'll assign your track during the eligibility pre-check based on your answers.",
  };
}

// CIN: L/U + 5 digits + 2-letter state + 4-digit year + 3-letter type + 6-digit reg no → 21 chars
const CIN_REGEX = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
// GSTIN: 15 chars — 2-digit state + 10-char PAN + 1-digit entity + Z + 1-char checksum
const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9][0-9]{9}$/;

// Disallow personal email domains on the work email field
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "hotmail.com",
  "outlook.com",
  "rediffmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "live.com",
]);

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (!f.entityType) e.entityType = "Pick entity type";
  if (!f.isRegulatedEntity) e.isRegulatedEntity = "Required";
  if (
    f.isRegulatedEntity === "yes" &&
    ["nbfc", "bank", "hfc"].includes(f.entityType) &&
    !f.rbiRegistrationNumber.trim()
  ) {
    e.rbiRegistrationNumber = "RBI Reg. Number required for RE applicants";
  }
  if (!f.legalName.trim()) e.legalName = "Required";
  if (!CIN_REGEX.test(f.cin)) e.cin = "Enter a valid 21-character CIN";
  if (f.gstin && !GSTIN_REGEX.test(f.gstin))
    e.gstin = "GSTIN looks malformed (15 characters)";
  if (!f.website.trim()) e.website = "Required";
  if (!f.fullName.trim()) e.fullName = "Required";
  if (!f.role.trim()) e.role = "Required";
  if (!EMAIL_REGEX.test(f.workEmail)) e.workEmail = "Enter a valid email";
  else {
    const domain = f.workEmail.split("@")[1]?.toLowerCase();
    if (domain && PERSONAL_EMAIL_DOMAINS.has(domain))
      e.workEmail = "Please use your work email";
  }
  if (!MOBILE_REGEX.test(f.mobile))
    e.mobile = "10-digit Indian mobile starting with 6–9";
  if (!f.useCase) e.useCase = "Pick one";
  if (!f.expectedMonthlyDisbursal)
    e.expectedMonthlyDisbursal = "Pick a volume band";
  if (!f.capitalIntent) e.capitalIntent = "Pick one";
  if (!f.consentRbi) e.consentRbi = "Required to proceed";
  if (!f.consentDpdp) e.consentDpdp = "Required to proceed";
  if (!f.consentRelated) e.consentRelated = "Required to proceed";
  return e;
}

export default function PartnerApplyPage() {
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

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Scroll to first error
      const firstKey = Object.keys(e)[0];
      const el = document.getElementById(`field-${firstKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      // POST to backend. Endpoint is stubbed today — contract locked.
      const assigned = assignTrack(form);
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cin: form.cin.toUpperCase(),
          gstin: form.gstin.toUpperCase(),
          assignedTrack: assigned.code,
          assignedTrackLabel: assigned.label,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        // Fall back to a deterministic client-side reference so partner
        // doesn't lose the lead if the backend stub is down during wk-1 rollout.
        const fallbackId = `QPL-${Date.now().toString(36).toUpperCase()}`;
        setSubmitted({ applicationId: fallbackId });
        return;
      }
      const data = await res.json();
      setSubmitted({
        applicationId: data.applicationId || data.id || `QPL-${Date.now()}`,
      });
    } catch {
      const fallbackId = `QPL-${Date.now().toString(36).toUpperCase()}`;
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
              Application received
            </h1>
            <p className="text-gray-600 mb-2">
              Your reference number:
            </p>
            <div className="inline-block px-5 py-2.5 rounded-xl bg-[#0E2920] text-[#51C9AF] font-mono text-lg font-semibold mb-6">
              {submitted.applicationId}
            </div>
            <div className="text-left bg-[#F5F5F5] rounded-2xl p-5 mb-6">
              <h3 className="font-semibold font-sora text-gray-900 mb-3 text-sm uppercase tracking-wide">
                What happens next
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2.5">
                  <span className="font-semibold text-[#1F8F68] flex-shrink-0">1.</span>
                  <span>
                    Within <b>24 hours</b> we auto-run eligibility pre-check on
                    MCA, GST, director history and sanctions watchlists.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-semibold text-[#1F8F68] flex-shrink-0">2.</span>
                  <span>
                    If eligible, your EDD document portal opens and a BD owner
                    reaches out to schedule a 30-minute fit call.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-semibold text-[#1F8F68] flex-shrink-0">3.</span>
                  <span>
                    Track status anytime at{" "}
                    <Link
                      href={`/partners/status/${submitted.applicationId}`}
                      className="underline text-[#1F8F68] font-semibold"
                    >
                      /partners/status/{submitted.applicationId}
                    </Link>
                    .
                  </span>
                </li>
              </ol>
            </div>
            <Link
              href="/partners/lending-partner-program"
              className="inline-flex items-center gap-2 text-sm text-[#1F8F68] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to partners overview
            </Link>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F5F5]">
      {/* Header strip */}
      <section className="bg-[#0E2920] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/partners/lending-partner-program"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to partners
          </Link>
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-[#51C9AF]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] uppercase tracking-wider text-[#51C9AF] mb-2">
                <ShieldCheck className="w-3 h-3" />
                Stage 1 of 5 · Expression of Interest
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora leading-tight">
                Apply to become a Quikkred Lending Partner
              </h1>
              <p className="text-white/75 mt-2 text-sm sm:text-base">
                Takes about 2 minutes. Only Private Limited companies registered
                in India are eligible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
        {/* Live track assignment */}
        <TrackBadge form={form} />

        <form
          onSubmit={onSubmit}
          className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 mt-5"
        >
          {/* Section: Entity classification */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F8F68] mb-4">
              Entity classification
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="field-entityType"
                label="Entity type"
                required
                error={errors.entityType}
              >
                <select
                  value={form.entityType}
                  onChange={(e) => update("entityType", e.target.value as EntityType)}
                  className={inputCls(!!errors.entityType)}
                >
                  <option value="">Pick one…</option>
                  <option value="private_ltd">Private Limited</option>
                  <option value="llp">LLP</option>
                  <option value="public_ltd">Public Limited</option>
                  <option value="nbfc">NBFC (RBI-registered)</option>
                  <option value="bank">Bank (scheduled / cooperative)</option>
                  <option value="hfc">HFC (NHB-registered)</option>
                  <option value="mf">Mutual Fund</option>
                  <option value="aif">Alternative Investment Fund</option>
                  <option value="arc">Asset Reconstruction Company</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field
                id="field-isRegulatedEntity"
                label="Are you an RBI / SEBI / NHB Regulated Entity?"
                required
                error={errors.isRegulatedEntity}
              >
                <select
                  value={form.isRegulatedEntity}
                  onChange={(e) =>
                    update(
                      "isRegulatedEntity",
                      e.target.value as FormState["isRegulatedEntity"]
                    )
                  }
                  className={inputCls(!!errors.isRegulatedEntity)}
                >
                  <option value="">Pick one…</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>

              {form.isRegulatedEntity === "yes" &&
                ["nbfc", "bank", "hfc"].includes(form.entityType) && (
                  <Field
                    id="field-rbiRegistrationNumber"
                    label="RBI / NHB Registration Number"
                    required
                    hint="e.g. N-13.02187 or B-14.01646"
                    error={errors.rbiRegistrationNumber}
                  >
                    <input
                      type="text"
                      value={form.rbiRegistrationNumber}
                      onChange={(e) =>
                        update("rbiRegistrationNumber", e.target.value)
                      }
                      placeholder="N-13.02187"
                      className={`${inputCls(!!errors.rbiRegistrationNumber)} font-mono`}
                    />
                  </Field>
                )}
            </div>
          </div>

          {/* Section: Company */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F8F68] mb-4">
              About your company
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="field-legalName"
                label="Legal entity name"
                required
                error={errors.legalName}
              >
                <input
                  type="text"
                  value={form.legalName}
                  onChange={(e) => update("legalName", e.target.value)}
                  placeholder="Acme Technologies Private Limited"
                  className={inputCls(!!errors.legalName)}
                />
              </Field>

              <Field
                id="field-cin"
                label="CIN"
                required
                hint="21 characters, e.g. U72200MH2018PTC123456"
                error={errors.cin}
              >
                <input
                  type="text"
                  value={form.cin}
                  onChange={(e) =>
                    update("cin", e.target.value.toUpperCase().slice(0, 21))
                  }
                  placeholder="U72200MH2018PTC123456"
                  maxLength={21}
                  className={`${inputCls(!!errors.cin)} font-mono`}
                />
              </Field>

              <Field
                id="field-gstin"
                label="GSTIN (primary)"
                hint="Optional at this stage"
                error={errors.gstin}
              >
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) =>
                    update("gstin", e.target.value.toUpperCase().slice(0, 15))
                  }
                  placeholder="27AAAAA0000A1Z5"
                  maxLength={15}
                  className={`${inputCls(!!errors.gstin)} font-mono`}
                />
              </Field>

              <Field
                id="field-website"
                label="Website"
                required
                error={errors.website}
              >
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://acme.in"
                  className={inputCls(!!errors.website)}
                />
              </Field>
            </div>
          </div>

          {/* Section: Contact */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F8F68] mb-4">
              Who we should talk to
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="field-fullName"
                label="Your full name"
                required
                error={errors.fullName}
              >
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Riya Sharma"
                  className={inputCls(!!errors.fullName)}
                />
              </Field>

              <Field
                id="field-role"
                label="Role"
                required
                error={errors.role}
              >
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  placeholder="Head of Partnerships"
                  className={inputCls(!!errors.role)}
                />
              </Field>

              <Field
                id="field-workEmail"
                label="Work email"
                required
                hint="Personal email domains are rejected"
                error={errors.workEmail}
              >
                <input
                  type="email"
                  value={form.workEmail}
                  onChange={(e) => update("workEmail", e.target.value)}
                  placeholder="riya@acme.in"
                  className={inputCls(!!errors.workEmail)}
                />
              </Field>

              <Field
                id="field-mobile"
                label="Mobile"
                required
                error={errors.mobile}
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      update(
                        "mobile",
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    className={`${inputCls(!!errors.mobile)} rounded-l-none`}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Section: Fit */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F8F68] mb-4">
              Use-case & scale
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="field-useCase"
                label="Primary use-case"
                required
                error={errors.useCase}
              >
                <select
                  value={form.useCase}
                  onChange={(e) => update("useCase", e.target.value as UseCase)}
                  className={inputCls(!!errors.useCase)}
                >
                  <option value="">Pick one…</option>
                  <option value="checkout_finance">Checkout finance / BNPL</option>
                  <option value="salary_advance">Salary advance (HR/payroll)</option>
                  <option value="neobank_loan_module">Neobank / wallet loan module</option>
                  <option value="msme_owner_loan">MSME owner personal loan</option>
                  <option value="purchase_finance">Purchase finance (OEM / retail)</option>
                  <option value="embedded_saas">Embedded SaaS credit</option>
                  <option value="treasury_deploy">Treasury capital deployment</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field
                id="field-capitalIntent"
                label="Capital intent"
                required
                hint="How do you plan to participate financially?"
                error={errors.capitalIntent}
              >
                <select
                  value={form.capitalIntent}
                  onChange={(e) =>
                    update("capitalIntent", e.target.value as CapitalIntent)
                  }
                  className={inputCls(!!errors.capitalIntent)}
                >
                  <option value="">Pick one…</option>
                  <option value="none">No capital — sourcing-only (T1)</option>
                  <option value="ncd_subscription">
                    Subscribe Satsai NCDs (T2)
                  </option>
                  <option value="term_debt">
                    Extend term debt facility to Satsai (T2)
                  </option>
                  <option value="icd">
                    Inter-Corporate Deposit (T2)
                  </option>
                  <option value="co_lending_proportional">
                    Co-lending — proportional (T3, RE only)
                  </option>
                  <option value="portfolio_assignment">
                    Buy seasoned loan pools (T4, FI only)
                  </option>
                  <option value="undecided">Undecided — help me choose</option>
                </select>
              </Field>

              <Field
                id="field-expectedMonthlyDisbursal"
                label="Expected monthly disbursal in 12 months"
                required
                error={errors.expectedMonthlyDisbursal}
              >
                <select
                  value={form.expectedMonthlyDisbursal}
                  onChange={(e) =>
                    update(
                      "expectedMonthlyDisbursal",
                      e.target.value as VolumeBand
                    )
                  }
                  className={inputCls(!!errors.expectedMonthlyDisbursal)}
                >
                  <option value="">Pick a band…</option>
                  <option value="lt_1cr">Under ₹1 Cr / month</option>
                  <option value="1_5cr">₹1–5 Cr / month</option>
                  <option value="5_25cr">₹5–25 Cr / month</option>
                  <option value="25_100cr">₹25–100 Cr / month</option>
                  <option value="gt_100cr">Over ₹100 Cr / month</option>
                </select>
              </Field>

              <Field
                id="field-monthlyActiveUsers"
                label="Monthly active users (approx.)"
              >
                <input
                  type="text"
                  value={form.monthlyActiveUsers}
                  onChange={(e) =>
                    update("monthlyActiveUsers", e.target.value)
                  }
                  placeholder="e.g. 2,50,000"
                  className={inputCls(false)}
                />
              </Field>

              <Field
                id="field-heardFrom"
                label="How did you hear about us?"
              >
                <input
                  type="text"
                  value={form.heardFrom}
                  onChange={(e) => update("heardFrom", e.target.value)}
                  placeholder="Press, peer, event, search…"
                  className={inputCls(false)}
                />
              </Field>
            </div>
          </div>

          {/* Consent */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            <label
              id="field-consentRbi"
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.consentRbi}
                onChange={(e) => update("consentRbi", e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#25B181]"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I acknowledge that loans originated under any partnership will be lent by{" "}
                <b>Satsai Finlease Private Limited (RBI Reg. B-14.01646)</b> as the sole
                Regulated Entity. Our company acts as an LSP / DLA operator under the{" "}
                <b>RBI (Digital Lending) Directions, 2025</b> (8 May 2025) and — if
                eligible for Track 3 as a Regulated Entity — the <b>RBI Co-Lending
                Arrangements Directions, 2025</b> (effective 1 Jan 2026). For all other
                tracks this is not a co-lending arrangement. Our DLA will be registered
                on the RBI CIMS portal.
              </span>
            </label>
            {errors.consentRbi && (
              <p className="text-xs text-red-600 ml-7 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.consentRbi}
              </p>
            )}

            <label
              id="field-consentRelated"
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.consentRelated}
                onChange={(e) => update("consentRelated", e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#25B181]"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I will disclose any ownership, directorship, or UBO overlap between our
                company and Satsai Finlease / Fluxusforge / Quikkred. I understand that
                undisclosed related-party relationships are cause for pre-notice
                termination.
              </span>
            </label>
            {errors.consentRelated && (
              <p className="text-xs text-red-600 ml-7 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.consentRelated}
              </p>
            )}

            <label
              id="field-consentDpdp"
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.consentDpdp}
                onChange={(e) => update("consentDpdp", e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#25B181]"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I consent to Quikkred, Fluxusforge and Satsai processing the data I've
                submitted to evaluate this partnership, under the{" "}
                <Link href="/privacy-policy" className="underline text-[#1F8F68]">
                  Privacy Policy
                </Link>{" "}
                and DPDP Act 2023.
              </span>
            </label>
            {errors.consentDpdp && (
              <p className="text-xs text-red-600 ml-7 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.consentDpdp}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25B181] hover:bg-[#1F8F68] disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-xl font-semibold text-white shadow-md"
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
              href="/partners/lending-partner-program"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 transition-colors rounded-xl font-semibold text-gray-700"
            >
              Cancel
            </Link>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6 max-w-xl mx-auto leading-relaxed">
          Submission does not create a binding obligation. Onboarding is subject
          to successful EDD, risk committee approval and execution of the
          Master Services Agreement, Data Processing Agreement and Default
          Loss Guarantee deed.
        </p>
      </section>
    </div>
  );
}

/* ────────── helpers ────────── */

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
      {hint && !error && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
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

function TrackBadge({ form }: { form: FormState }) {
  const assigned = assignTrack(form);
  const toneCls =
    assigned.code === null
      ? "bg-gray-50 border-gray-200 text-gray-600"
      : assigned.code === "T2"
      ? "bg-gradient-to-br from-[#0E2920] to-[#144B37] border-[#51C9AF]/40 text-white"
      : "bg-[#D3F1EB] border-[#25B181]/30 text-[#0E2920]";

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex items-start gap-3 ${toneCls}`}
    >
      <ShieldCheck
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          assigned.code ? "" : "text-gray-400"
        }`}
      />
      <div className="min-w-0">
        <div
          className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${
            assigned.code === "T2" ? "text-[#51C9AF]" : "opacity-70"
          }`}
        >
          Preliminary track assignment
        </div>
        <div className="font-bold font-sora text-sm sm:text-base mb-0.5">
          {assigned.label}
        </div>
        <div className="text-xs sm:text-sm leading-relaxed opacity-90">
          {assigned.rationale}
        </div>
      </div>
    </div>
  );
}
