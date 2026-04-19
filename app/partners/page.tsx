"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  Briefcase,
  ShoppingBag,
  Wallet,
  Store,
  Users,
  FileCheck,
  GitBranch,
  Lock,
  Database,
  Scale,
  FileText,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Info,
  BadgeCheck,
  Handshake,
  Gauge,
  KeyRound,
  Banknote,
  Landmark,
  CircleDollarSign,
  Cpu,
  Layers,
  Coins,
  QrCode,
  Smartphone,
  MapPin,
  Languages,
  Network,
} from "lucide-react";
import Link from "next/link";

interface UseCase {
  title: string;
  pitch: string;
  icon: React.ComponentType<any>;
}

interface Stage {
  n: number;
  name: string;
  sla: string;
  blurb: string;
}

interface ComplianceItem {
  title: string;
  ref: string;
  blurb: string;
  icon: React.ComponentType<any>;
}

interface FAQ {
  q: string;
  a: string;
}

interface Track {
  code: string;
  title: string;
  who: string;
  mechanism: string;
  fldg: string;
  tagline: string;
  flagship?: boolean;
}

export default function PartnersPage() {
  const useCases: UseCase[] = [
    {
      title: "D2C & e-commerce",
      pitch: "Checkout finance on your own storefront. Your brand, your customer, your capital — our NBFC, our tech.",
      icon: ShoppingBag,
    },
    {
      title: "HR & payroll platforms",
      pitch: "Salary advance to your enterprise customers' employees, branded entirely as yours.",
      icon: Briefcase,
    },
    {
      title: "Neobanks & wallets",
      pitch: "Add a short-term personal loan module without building NBFC infra or an ops team.",
      icon: Wallet,
    },
    {
      title: "MSME marketplaces",
      pitch: "Owner personal loans for sellers — underwritten and serviced end-to-end on our stack.",
      icon: Store,
    },
    {
      title: "OEMs & retailers",
      pitch: "Purchase finance for electronics, two-wheelers, healthcare, education — your brand, our rails.",
      icon: Building2,
    },
    {
      title: "Corporate treasuries",
      pitch: "Deploy surplus capital as a productive lending book without setting up an NBFC yourself.",
      icon: Coins,
    },
  ];

  const tracks: Track[] = [
    {
      code: "T2",
      title: "Capital Partner",
      who: "Private Limited with capital to deploy",
      mechanism: "Subscribes Satsai NCDs or extends a term debt facility; capital is ring-fenced for your book",
      fldg: "FLDG up to 5% (RBI cap, Jun 2023)",
      tagline: "Your brand, your customers, your capital. Our NBFC, our tech, our ops.",
      flagship: true,
    },
    {
      code: "T1",
      title: "Sourcing Partner",
      who: "Private Limited without capital deployment",
      mechanism: "Revenue-share on loans sourced; our capital, your funnel",
      fldg: "FLDG up to 5%",
      tagline: "Bring the customer; we bring the balance sheet.",
    },
    {
      code: "T3",
      title: "Co-Lending Partner",
      who: "NBFCs, Banks, HFCs (Regulated Entities only)",
      mechanism: "True RBI Co-Lending (CLM / CLM+) — proportional participation, joint KFS",
      fldg: "Negotiated contractually",
      tagline: "RE-to-RE co-lending under RBI's Master Direction.",
    },
    {
      code: "T4",
      title: "Portfolio Partner",
      who: "Banks / NBFCs / MFs / AIFs / ARCs / FIs",
      mechanism: "Satsai originates and seasons; loan pools assigned post-MHP (6 months) with 10% retention",
      fldg: "Pool-level structure",
      tagline: "Seasoned-portfolio purchase under RBI's 2021 Transfer of Loan Exposures direction.",
    },
  ];

  const stages: Stage[] = [
    {
      n: 1,
      name: "Apply",
      sla: "2 minutes",
      blurb: "Tell us about your company, use-case, capital intent, and expected volumes.",
    },
    {
      n: 2,
      name: "Eligibility Pre-Check + Track Assignment",
      sla: "Within 24 hours",
      blurb:
        "We auto-pull MCA, GST, director history, sanctions and RE-registration status. Your track (T1–T4) is assigned here.",
    },
    {
      n: 3,
      name: "Enhanced Due Diligence",
      sla: "10–15 working days",
      blurb:
        "Entity KYC, UBO video KYC, 2-year financials, CERT-In VAPT, DPDP attestation, track-specific extras (capital-source for T2; RE licence for T3/T4), risk committee review.",
    },
    {
      n: 4,
      name: "Commercials & Agreements",
      sla: "5–10 working days",
      blurb:
        "Rate card, FLDG deed, NCD Subscription Agreement (T2), Co-Lending Agreement (T3) or Pool Assignment (T4), MSA + DPA — executed via Aadhaar eSign.",
    },
    {
      n: 5,
      name: "Sandbox → Go-Live",
      sla: "7–10 working days",
      blurb: "Test API keys, pilot disbursals, graduated production access and ring-fenced facility opened.",
    },
  ];

  const complianceItems: ComplianceItem[] = [
    {
      title: "Digital Lending Directions, 2025",
      ref: "RBI DoR.AML.REC.24/14.10.001/2025-26 · 8 May 2025",
      blurb:
        "Consolidates the 2022 Digital Lending Guidelines and 2023 DLG Circular. Direct RE ↔ borrower fund flow (Satsai's account — LSP pass-through prohibited except delinquent recovery). 1-day cooling-off. LSP fees paid by Satsai, not deducted from borrower. Mandatory DLA registration on RBI CIMS portal.",
      icon: ShieldCheck,
    },
    {
      title: "Multi-Lender Platform Rules",
      ref: "DLD 2025, Ch. Multi-Lender Platforms · effective 1 Nov 2025",
      blurb:
        "Any DLA showing offers from more than one Regulated Entity must display neutral, consented offer-matching, per-offer KFS links and a board-approved methodology. Triggered if a partner DLA shows any non-Satsai offer.",
      icon: Layers,
    },
    {
      title: "Default Loss Guarantee cap",
      ref: "DLD 2025 DLG mechanics + RBI notification · Feb 2026",
      blurb:
        "DLG from partner to Satsai capped at 5% of outstanding portfolio, backed by cash / bank guarantee / lien-marked FD. ECL-linked invocation restored Feb 2026. NPA recognition stays with Satsai. Synthetic guarantees prohibited.",
      icon: Scale,
    },
    {
      title: "Co-Lending Arrangements Directions, 2025",
      ref: "RBI CLA Directions · effective 1 Jan 2026",
      blurb:
        "Replaces CLM / CLM+. Governs Track 3 (Regulated Entities only). Minimum 10% funding share (reduced from 20% under PSL CLM). Direct A2A, joint branding, joint grievance. CLM-2 cherry-pick structures discontinued.",
      icon: Handshake,
    },
    {
      title: "Transfer of Loan Exposures Master Direction",
      ref: "RBI Master Direction · 24 Sept 2021",
      blurb:
        "Governs Track 4 (Portfolio Partner). Satsai seasons loans for 6 months (MHP) and retains at least 10% (MRR) before any pool assignment to eligible financial transferees.",
      icon: FileText,
    },
    {
      title: "Outsourcing of Financial Services",
      ref: "RBI Master Direction · 2017, updated 2023",
      blurb:
        "Satsai retains credit sanction, KYC, compliance and internal audit as core management functions. Fluxusforge operates under a written outsourcing contract with right-to-audit and exit plan.",
      icon: FileCheck,
    },
    {
      title: "KYC Master Direction",
      ref: "RBI · updated 2024",
      blurb:
        "EDD for legal entities: CoI, PAN, MoA/AoA, authorised signatories, beneficial owners at ≥ 10% (stricter than the 25% floor), video KYC of signatories and UBOs.",
      icon: Users,
    },
    {
      title: "NBFC Scale-Based Regulation",
      ref: "RBI SBR Directions 2023 + Feb 2026 amendments",
      blurb:
        "Satsai is registered in the Base Layer (NBFC-BL). Partnership activities do not change layer classification. Prudential, governance and disclosure norms applicable to BL flow through to every arrangement.",
      icon: Landmark,
    },
    {
      title: "DPDP Act + Rules",
      ref: "DPDP Act 2023 · DPDP Rules notified 13 Nov 2025 (phased)",
      blurb:
        "Satsai = Data Fiduciary (likely Significant DF). Consent Manager rules live Nov 2026; DPIA, annual audit, significant-risk mitigation live May 2027. Partner = Data Processor. 72-hour breach SLA, DPO appointed.",
      icon: Database,
    },
    {
      title: "SEBI NCS Regulations + RBI CP & NCD Master Direction",
      ref: "SEBI (NCS) Regulations 2021 · RBI Master Direction on CP & NCDs 2024",
      blurb:
        "Governs Track 2 NCD issuance by Satsai. Debenture trustee triggers at ≥ ₹100 Cr aggregate or on listing. Disclosures, trust deed, listing compliance per current code.",
      icon: Coins,
    },
    {
      title: "Fintech SRO (SRO-FT)",
      ref: "FACE recognised as SRO-FT · 29 Aug 2024",
      blurb:
        "Membership of the RBI-recognised Self-Regulatory Organisation for fintechs is optional but materially de-risks enforcement posture. All partners are encouraged to enrol.",
      icon: BadgeCheck,
    },
    {
      title: "ECB Framework (liberalised 2026)",
      ref: "RBI ECB Framework notification · 16 Feb 2026",
      blurb:
        "Relevant for Track 2 partners with foreign-source capital. External Commercial Borrowing cap raised to USD 1 billion or 300% of Satsai's net worth, whichever is higher; eligible resident-outside-India lenders widened.",
      icon: CircleDollarSign,
    },
    {
      title: "Fair Practices Code",
      ref: "RBI-NBFC FPC (2007, as amended)",
      blurb:
        "Loan appraisal, interest rate governance, recovery conduct and grievance escalation apply end-to-end. Partner adopts and attests to Satsai's FPC.",
      icon: ClipboardList,
    },
    {
      title: "CIC reporting (CIBIL / Equifax / CRIF / Experian)",
      ref: "Credit Information Companies (Regulation) Act, 2005",
      blurb:
        "All credit bureau reporting is done by Satsai only. Partners cannot report, upload or access bureau data directly.",
      icon: Lock,
    },
  ];

  const eddBuckets = [
    {
      title: "Entity KYC",
      icon: Building2,
      items: [
        "Certificate of Incorporation + CIN",
        "PAN, GSTIN (all states), TAN",
        "MoA & AoA (latest certified)",
        "Board resolution authorising the partnership",
        "Directors list + DIN + DSC",
        "Shop & Establishment / Trade Licence",
      ],
    },
    {
      title: "UBO & Signatories",
      icon: Users,
      items: [
        "MGT-7 shareholding pattern",
        "UBO declaration at ≥ 10%",
        "UBO video KYC + PAN + Aadhaar / Passport",
        "Authorised signatory KYC + specimen",
      ],
    },
    {
      title: "Financial & Credit",
      icon: TrendingUp,
      items: [
        "Audited financials — last 2 FYs",
        "ITR — last 2 AYs (entity + promoters)",
        "12 months bank statements",
        "CA-attested net worth certificate",
        "12 months GST returns",
        "CIBIL Commercial + promoter CIBIL",
      ],
    },
    {
      title: "Capital Source (T2 only)",
      icon: Coins,
      items: [
        "Board resolution for NCD subscription / debt",
        "Source-of-funds declaration",
        "FATF / cross-border screening",
        "FEMA letter if foreign parentage",
        "Debenture trustee consent (NCD route)",
      ],
    },
    {
      title: "RE Documentation (T3 / T4)",
      icon: Landmark,
      items: [
        "RBI Certificate of Registration",
        "Last 3 FYs audited financials",
        "Last regulatory inspection report",
        "Board-approved Co-Lending Policy (T3)",
        "CRAR / PCA status attestation",
      ],
    },
    {
      title: "Business Profile",
      icon: Briefcase,
      items: [
        "Use-case deck",
        "Target segment, ticket, geography",
        "MAU / existing customer base",
        "Projected 6 / 12 / 24 month volumes",
        "Co-brand vs white-label preference",
      ],
    },
    {
      title: "Tech & Security",
      icon: Lock,
      items: [
        "ISO 27001 or roadmap",
        "CERT-In empanelled VAPT ≤ 12 months",
        "Data localisation attestation",
        "OAuth2 / mTLS API stack, IP whitelist",
        "Cyber insurance, BCP / DR plan",
        "DPDP attestations + DPO appointment",
      ],
    },
    {
      title: "Risk & Operations",
      icon: Scale,
      items: [
        "Grievance Redressal Officer on DLA",
        "Nodal Officer wiring to Satsai CMS",
        "Escrow / nodal account arrangement",
        "Collections conduct policy",
        "Fair Practices Code adoption",
        "Monthly complaints MIS commitment",
      ],
    },
  ];

  const faqs: FAQ[] = [
    {
      q: "So who actually lends to my customer?",
      a: "Satsai Finlease Private Limited — an RBI-registered NBFC (Registration B-14.01646). Satsai is the lender of record on every Key Fact Statement, loan agreement and credit bureau entry. Your brand sits on the app; our NBFC sits on the balance sheet.",
    },
    {
      q: "If Satsai lends, how are my funds in the picture?",
      a: "You don't lend directly — a non-RE cannot. Instead, you deploy capital into Satsai either by subscribing Satsai's NCDs (Non-Convertible Debentures) or by extending a term debt / inter-corporate deposit facility. Satsai ring-fences that capital for your book, originates loans against it using our tech, collects EMIs into a ring-fenced account, and pays you back a contractual coupon plus a negotiated profit share from the residual yield.",
    },
    {
      q: "Is this co-lending?",
      a: "Only if you are yourself an NBFC / Bank / HFC (our Track 3). RBI's Co-Lending Arrangements (CLA) Directions, 2025 — effective 1 January 2026 — is strictly RE-to-RE. For Private Limited companies that are not Regulated Entities, this is a Digital Lending Partnership under the RBI (Digital Lending) Directions, 2025 dated 8 May 2025 — structurally different, fully compliant, and does not require partner registration with RBI.",
    },
    {
      q: "Does our DLA need to be registered with RBI?",
      a: "Yes. Since the RBI (Digital Lending) Directions, 2025, every Digital Lending App under which loans are originated must be registered on RBI's CIMS portal. We handle the registration as part of your go-live; your DLA is listed under Satsai Finlease as the Regulated Entity, with your LSP entity named alongside. Operating an unregistered DLA is a hard regulatory breach.",
    },
    {
      q: "What if our DLA displays offers from other lenders too?",
      a: "From 1 November 2025, any multi-lender DLA is bound by the Multi-Lender Platform chapter of the 2025 Directions: neutral, consented offer-matching, a board-approved methodology, and a Key Fact Statement link for every offer. We help draft this and execute a Multi-Lender Platform Addendum if your DLA falls in scope.",
    },
    {
      q: "What's our upside vs what's our risk?",
      a: "Upside: a fixed NCD coupon / debt interest (contractual) plus a variable profit-share on the residual portfolio yield after costs. Risk: you bear first-loss via FLDG capped at 5% of outstanding (RBI-regulated). Beyond that cap, write-offs sit with Satsai. You also carry credit exposure on Satsai itself as an NCD holder — pari-passu with our other senior creditors unless specifically secured.",
    },
    {
      q: "Who runs underwriting, disbursal, collections?",
      a: "Fluxusforge — our LSP operating layer — runs all of it end-to-end: BRE, KYC, KFS generation, disbursal orchestration, payment links, eNACH, DPD tracking, telephony, field collections, legal. Your ops team does not need to build any of this. You can layer stricter rules on top of Satsai's credit policy, but you cannot loosen them.",
    },
    {
      q: "Can I go fully white-label?",
      a: "Brand-wise, yes — your app, your logos, your UX. Two mandatory disclosures per RBI: Satsai Finlease Private Limited must be named as lender on the KFS and loan agreement; and the LSP role (your entity + Fluxusforge as tech provider) must be disclosed on the DLA. Everything else is negotiable.",
    },
    {
      q: "How long does onboarding actually take?",
      a: "T1 Sourcing: 28–42 working days. T2 Capital: 45–75 working days (NCD listing adds time). T3 Co-Lending and T4 Portfolio: 60–120 working days (RBI intimation, pool prep, inter-RE agreements). Anyone promising faster is either skipping compliance or misrepresenting the process.",
    },
    {
      q: "What happens if my capital runs out mid-month?",
      a: "Drawdown utilisation is tracked live; you get alerts at 80% and an automated pause at 100% — no new originations until you top up the facility. Existing loans continue to service; borrowers are unaffected.",
    },
    {
      q: "What happens if I want to exit?",
      a: "Exit clause runs the book into run-off: no new disbursals, Fluxusforge services existing loans to maturity, FLDG releases per an agreed schedule as loans close, and your capital is repaid per the NCD / debt terms. Borrower experience is fully insulated from your exit.",
    },
    {
      q: "Can we touch borrower funds at any point?",
      a: "No. Disbursals move from Satsai's account directly to the borrower's bank account. Repayments move directly from the borrower's bank account back to Satsai's account. The RBI (Digital Lending) Directions, 2025 prohibit LSP-intermediated fund flow except narrowly for delinquent-recovery scenarios — and LSP fees are paid by Satsai, not deducted from the borrower. This is a firm, non-negotiable line.",
    },
    {
      q: "How long is the borrower's cooling-off period?",
      a: "One working day — reduced from three under the 2025 Directions. Every partner DLA must implement a compliant cancellation flow that reverses the disbursal and any processing fee end-to-end.",
    },
    {
      q: "What's our posture on DPDP Rules 2025?",
      a: "Rules were notified on 13 November 2025 with phased effectivity. Consent Manager obligations are live from November 2026; DPIA, annual audit and significant-risk-mitigation obligations for Significant Data Fiduciaries are live from May 2027. Satsai is a prospective SDF. Partner DLAs plug into our DPIA programme and carry an SDF-readiness annex in the Data Processing Agreement.",
    },
    {
      q: "What if my customer complains?",
      a: "First-level: your Grievance Redressal Officer (name + email + phone published on the DLA). If unresolved in 15 days, auto-escalation to Satsai's Nodal Officer. Final escalation: RBI Integrated Ombudsman (cms.rbi.org.in). All three must be visible on the DLA.",
    },
    {
      q: "What if a partner's UBOs overlap with Quikkred / Satsai / Fluxusforge?",
      a: "Related-party disclosure is mandatory at onboarding. The Risk Committee determines whether the arrangement can proceed and on what additional arm's-length controls. Undisclosed overlaps are cause for pre-notice termination.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F5F5]">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden bg-[#0E2920] text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(1100px 500px at 15% 20%, rgba(37,177,129,0.45), transparent 60%), radial-gradient(900px 400px at 85% 85%, rgba(74,102,255,0.35), transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[#51C9AF]" />
              RBI-aligned · Digital Lending Partnership
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-[1.1] mb-6">
              Your brand. Your customers. <span className="text-[#51C9AF]">Your capital.</span>
              <br className="hidden sm:block" />
              Our NBFC, our tech, our compliance.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-3xl mb-8">
              Deploy capital into <span className="text-white font-semibold">Satsai Finlease Private Limited</span>
              {" "}— our RBI-registered NBFC partner — and originate loans to <span className="text-white font-semibold">your</span> end customers
              through <span className="text-white font-semibold">Fluxusforge</span>, the same production lending stack that runs Quikkred.
              A B2B2C partnership structure engineered for Private Limited companies that want the economics of a
              lending business without the regulatory overhead of setting up an NBFC.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/partners/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25B181] hover:bg-[#1F8F68] transition-colors rounded-xl font-semibold text-white shadow-lg"
              >
                Apply as a partner
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:partnerships@quikkred.in"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white"
              >
                Talk to our BD team
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              {[
                { k: "Licensed NBFC", v: "Satsai Finlease Pvt Ltd" },
                { k: "Tech & ops", v: "Fluxusforge LSP stack" },
                { k: "Regulatory frame", v: "RBI DLD 2025 + CLA 2026" },
                { k: "Tracks available", v: "4 (T1 · T2 · T3 · T4)" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                >
                  <div className="text-[11px] uppercase tracking-wider text-white/60">
                    {s.k}
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── HOW THE STACK FITS TOGETHER ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            The architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            Three entities. One lending pipeline.
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Quikkred runs on this exact stack today. In a partnership, you occupy the brand + LSP slot; the rest stays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            {
              label: "Consumer brand",
              name: "Your brand (or Quikkred)",
              role: "Customer-facing identity, product UX, growth",
              icon: Building2,
              tone: "bg-[#DAE6FF] text-[#4A66FF] border-[#4A66FF]/30",
              dot: "bg-[#4A66FF]",
            },
            {
              label: "LSP operating layer",
              name: "Your entity, powered by Fluxusforge",
              role: "Tech stack, BRE, KYC, KFS, disbursal, collections",
              icon: Cpu,
              tone: "bg-[#D3F1EB] text-[#1F8F68] border-[#1F8F68]/30",
              dot: "bg-[#1F8F68]",
            },
            {
              label: "Regulated Entity (NBFC)",
              name: "Satsai Finlease Pvt Ltd",
              role: "Licence, balance sheet, credit sanction, CIC reporting",
              icon: Landmark,
              tone: "bg-[#FFEBD1] text-[#E36229] border-[#E36229]/30",
              dot: "bg-[#E36229]",
            },
          ].map((l, i) => {
            const Icon = l.icon;
            return (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 ${l.tone}`}
              >
                <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${l.dot}`} />
                <Icon className="w-6 h-6 mb-4" />
                <div className="text-[11px] uppercase tracking-wider font-bold mb-1 opacity-80">
                  Layer {i + 1} · {l.label}
                </div>
                <div className="font-bold font-sora text-lg mb-2 text-gray-900">
                  {l.name}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">{l.role}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────────────── CAPITAL WATERFALL (the one picture that matters) ───────────────── */}
      <section className="bg-[#0E2920] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/15 text-[#51C9AF] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              <CircleDollarSign className="w-3.5 h-3.5" />
              Capital flow
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3">
              How your capital actually becomes a loan book
            </h2>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl mx-auto">
              A non-RE cannot lend directly in India. So your funds route into Satsai as debt or NCDs — a
              regulatory-sound instrument — and come back as contractual coupon plus profit share.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: visual flow */}
            <div className="space-y-3">
              <Node
                index={1}
                tone="blue"
                title="You transfer capital to Satsai"
                sub="Via NCD subscription, term debt facility, or inter-corporate deposit. All legal, all SEBI/Companies-Act compliant."
                icon={Banknote}
              />
              <FlowArrow />
              <Node
                index={2}
                tone="green"
                title="Satsai originates loans"
                sub="Against your ring-fenced facility, on Satsai's balance sheet, through Fluxusforge tech and ops — BRE, KYC, KFS, disbursal."
                icon={Landmark}
              />
              <FlowArrow />
              <Node
                index={3}
                tone="orange"
                title="Borrower repays into Satsai"
                sub="EMI + interest land in a Satsai account ring-fenced to your book. Fund-flow never touches your account — RBI mandate."
                icon={Gauge}
              />
              <FlowArrow />
              <Node
                index={4}
                tone="purple"
                title="Satsai runs the monthly waterfall"
                sub="Cover origination costs, absorb first-loss via FLDG, pay you fixed coupon, retain NBFC spread + ops fee, distribute residual back to you."
                icon={Layers}
              />
              <FlowArrow />
              <Node
                index={5}
                tone="teal"
                title="You receive two legs of return"
                sub="A fixed NCD coupon / debt interest (contractual, pari-passu) and a variable profit share on the residual portfolio yield."
                icon={CircleDollarSign}
              />
            </div>

            {/* Right: waterfall breakdown */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sticky top-6">
              <h3 className="font-bold font-sora text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#51C9AF]" />
                Satsai's monthly waterfall on your book
              </h3>
              <ol className="space-y-3.5">
                {[
                  { step: "a", text: "Cover origination + servicing operating cost" },
                  { step: "b", text: "Absorb portfolio write-offs up to FLDG cap (5% outstanding)" },
                  { step: "c", text: "Pay your NCD coupon / debt interest (fixed leg)" },
                  { step: "d", text: "Retain Satsai NBFC spread (bps of AUM)" },
                  { step: "e", text: "Retain Fluxusforge ops fee (per-loan or bps)" },
                  { step: "f", text: "Distribute residual yield back to you (variable leg)" },
                ].map((w) => (
                  <li key={w.step} className="flex gap-3 text-sm">
                    <span className="w-7 h-7 rounded-full bg-[#51C9AF]/15 text-[#51C9AF] flex items-center justify-center flex-shrink-0 font-mono font-bold text-xs border border-[#51C9AF]/30">
                      {w.step}
                    </span>
                    <span className="text-white/85 leading-relaxed pt-0.5">{w.text}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-white/60 leading-relaxed">
                  Exact rate card — fixed coupon, profit-share %, FLDG posture, NBFC spread and ops fee —
                  is locked in the commercial stage. Commercials are governed by the Master Services Agreement
                  and the track-specific Financial Schedule (NCD Subscription Agreement or Debt Facility Agreement).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CO-LENDING vs THIS (clarity callout) ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#DAE6FF] border-l-4 border-[#4A66FF] rounded-2xl p-5 sm:p-6 flex items-start gap-4"
        >
          <Info className="w-6 h-6 text-[#4A66FF] mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold font-sora text-gray-900 mb-1">
              This is a Digital Lending Partnership. Only Track 3 is co-lending.
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              RBI's <span className="font-semibold">Co-Lending Arrangements (CLA) Directions, 2025</span> —
              effective 1 January 2026 — apply only between two Regulated Entities, so they govern Track 3
              (NBFC / Bank / HFC partners). For Private Limited companies that are not REs, Tracks 1, 2 and 4 operate under the
              <span className="font-semibold"> RBI (Digital Lending) Directions, 2025</span> dated 8 May 2025 — which
              consolidates the earlier 2022 DL Guidelines and 2023 DLG Circular. Mislabelling any of this as "co-lending"
              is a regulatory misrepresentation we will not sign on.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ───────────────── FOUR TRACKS ───────────────── */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#FFEBD1] text-[#E36229] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Pick your pathway
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Four partnership tracks
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Every applicant is triaged into one track during eligibility pre-check. The flagship track
              for Private Limited companies is T2 — Capital Partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tracks.map((t, i) => (
              <motion.div
                key={t.code}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative rounded-2xl p-6 border transition-all ${
                  t.flagship
                    ? "bg-gradient-to-br from-[#0E2920] to-[#144B37] text-white border-[#51C9AF]/40 shadow-lg"
                    : "bg-white border-gray-100 hover:border-[#25B181] hover:shadow-md"
                }`}
              >
                {t.flagship && (
                  <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#51C9AF] text-[#0E2920] text-[10px] font-bold uppercase tracking-wider rounded-full">
                    <BadgeCheck className="w-3 h-3" />
                    Flagship track
                  </span>
                )}
                <div className={`flex items-center gap-2 mb-3 ${t.flagship ? "text-[#51C9AF]" : "text-[#1F8F68]"}`}>
                  <span className="font-mono font-bold text-sm">{t.code}</span>
                  <span className="text-xs uppercase tracking-wider opacity-80">Partnership track</span>
                </div>
                <h3
                  className={`font-bold font-sora text-xl mb-2 ${
                    t.flagship ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t.title}
                </h3>
                <p
                  className={`text-sm italic mb-4 ${
                    t.flagship ? "text-[#51C9AF]" : "text-[#1F8F68]"
                  }`}
                >
                  {t.tagline}
                </p>
                <dl className={`space-y-2.5 text-sm ${t.flagship ? "text-white/85" : "text-gray-700"}`}>
                  <div className="flex gap-3">
                    <dt className={`font-semibold w-[70px] flex-shrink-0 ${t.flagship ? "text-white/60" : "text-gray-500"}`}>
                      Who
                    </dt>
                    <dd>{t.who}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className={`font-semibold w-[70px] flex-shrink-0 ${t.flagship ? "text-white/60" : "text-gray-500"}`}>
                      How
                    </dt>
                    <dd>{t.mechanism}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className={`font-semibold w-[70px] flex-shrink-0 ${t.flagship ? "text-white/60" : "text-gray-500"}`}>
                      FLDG
                    </dt>
                    <dd>{t.fldg}</dd>
                  </div>
                </dl>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── B2B2B2C PROPRIETOR NETWORK ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFEBD1] text-[#E36229] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            <Network className="w-3.5 h-3.5" />
            B2B2B2C extension
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            Reach last-mile retail borrowers through a proprietor network
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Under any track, you can deploy a network of <span className="font-semibold">proprietor sub-agents</span> — neighbourhood
            retail outlets, local market aggregators, transport-hub operators — who source loans to
            micro-enterprise owners, informal-sector self-employed and small traders. Funds flow through{" "}
            <span className="font-semibold">Satsai's dynamic QR</span> at the counter; proprietors never touch rupees.
          </p>
        </div>

        {/* 4-layer stack */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              n: 1,
              role: "Regulated Entity",
              name: "Satsai Finlease",
              blurb: "NBFC. Licence, balance sheet, credit sanction, CIC reporting.",
              icon: Landmark,
              tone: "bg-[#FFEBD1] text-[#E36229] border-[#E36229]/30",
            },
            {
              n: 2,
              role: "Primary LSP",
              name: "You (Pvt Ltd)",
              blurb: "Tech platform, proprietor onboarding + monitoring, commission payouts on behalf of Satsai.",
              icon: Cpu,
              tone: "bg-[#D3F1EB] text-[#1F8F68] border-[#1F8F68]/30",
            },
            {
              n: 3,
              role: "Proprietor sub-agent",
              name: "Proprietor A (retail outlet)",
              blurb: "Sourcing, counter QR, first-line grievance. Never touches funds.",
              icon: Store,
              tone: "bg-[#DAE6FF] text-[#4A66FF] border-[#4A66FF]/30",
            },
            {
              n: 4,
              role: "End borrower",
              name: "Borrower A (micro-income earner)",
              blurb: "Scans counter QR → UPI → Satsai master CASA.",
              icon: Users,
              tone: "bg-[#F5F5F5] text-gray-700 border-gray-300",
            },
          ].map((l, i) => {
            const Icon = l.icon;
            return (
              <motion.div
                key={l.n}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`relative rounded-2xl border p-5 ${l.tone}`}
              >
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 text-gray-700 font-mono font-bold text-xs flex items-center justify-center border border-gray-200">
                  {l.n}
                </div>
                <Icon className="w-6 h-6 mb-3" />
                <div className="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-80">
                  Layer {l.n} · {l.role}
                </div>
                <div className="font-bold font-sora text-gray-900 mb-1.5 text-sm">
                  {l.name}
                </div>
                <div className="text-xs text-gray-700 leading-relaxed">{l.blurb}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Money-flow sample + why it works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#0E2920] text-white p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-[#51C9AF]" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#51C9AF]">
                The money-flow
              </span>
            </div>
            <h3 className="font-bold font-sora text-lg mb-4">
              The borrower scans the proprietor's QR → money lands in Satsai
            </h3>
            <ol className="space-y-3 text-sm text-white/85">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#51C9AF]/20 text-[#51C9AF] font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#51C9AF]/40">
                  1
                </span>
                <span>
                  Each proprietor gets a <b>Virtual Account + dynamic UPI QR</b> issued
                  under Satsai (via Razorpay / Cashfree / Decentro / M2P).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#51C9AF]/20 text-[#51C9AF] font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#51C9AF]/40">
                  2
                </span>
                <span>
                  The borrower walks up to the proprietor's counter and scans the QR.
                  UPI credit is tagged <code className="text-[11px] bg-white/10 px-1.5 py-0.5 rounded text-[#7CDAC3]">PROP-0007-LOAN-ABC</code>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#51C9AF]/20 text-[#51C9AF] font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#51C9AF]/40">
                  3
                </span>
                <span>
                  Money lands in Satsai master CASA, auto-attributed to the
                  proprietor's ID and the borrower's loan.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#51C9AF]/20 text-[#51C9AF] font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#51C9AF]/40">
                  4
                </span>
                <span>
                  The proprietor earns a commission paid monthly by Satsai
                  (TDS 194H deducted). No cash at counter in v1.
                </span>
              </li>
            </ol>
            <div className="mt-5 pt-5 border-t border-white/10 text-xs text-white/60 leading-relaxed">
              DLD-2025 fund-flow rule satisfied: direct borrower ↔ RE. The proprietor is
              classified as an LSP sub-category (DSA + Recovery Agent) and appears on
              Satsai's public List of LSPs within 2 working days of go-live.
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Tripartite contract",
                icon: Handshake,
                blurb:
                  "Proprietor Services Agreement is signed by Satsai + Primary LSP + Proprietor. No hidden sub-LSP chain — Satsai is a named regulatory party to every proprietor.",
              },
              {
                title: "Micro-EMI, daily / weekly cadence",
                icon: Gauge,
                blurb:
                  "Cashflow-matched schedules built in — daily for auto-drivers, weekly for vendors. Dramatically improves repayment rates in the segment.",
              },
              {
                title: "Vernacular KFS + audio consent",
                icon: Languages,
                blurb:
                  "Key Fact Statement generated in 13 Indian languages. Audio-recorded consent at origination as defensive evidence.",
              },
              {
                title: "Physical shop verification",
                icon: MapPin,
                blurb:
                  "Every proprietor physically verified by a gig field agent before go-live. Geo-tagged shop photo + utility bill + 2 references.",
              },
              {
                title: "Mobile-first proprietor app",
                icon: Smartphone,
                blurb:
                  "Vernacular UI, offline-tolerant, masked borrower PII, rotating QR token, counter-poster PDF generator.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-5 flex gap-3 hover:border-[#E36229] hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFEBD1] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#E36229]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold font-sora text-gray-900 mb-1 text-sm">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {f.blurb}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 justify-center">
          <Link
            href="/partners/proprietor"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0E2920] hover:bg-[#144B37] transition-colors rounded-xl font-semibold text-white text-sm"
          >
            Deep-dive the proprietor network
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/partners/apply"
            className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 hover:bg-gray-50 transition-colors rounded-xl font-semibold text-gray-800 text-sm"
          >
            Apply — I want to run a proprietor network
          </Link>
        </div>
      </section>

      {/* ───────────────── USE CASES ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#D3F1EB] text-[#1F8F68] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Who this is for
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            Built for companies with a customer base that needs credit
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Any Indian Private Limited company with verifiable traction, clean ownership and a real
            use-case can apply. Here's where it fits most naturally.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#25B181] hover:shadow-lg transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#D3F1EB] flex items-center justify-center mb-4 group-hover:bg-[#25B181] transition-colors">
                  <Icon className="w-5 h-5 text-[#25B181] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold font-sora text-gray-900 text-lg mb-1.5">
                  {uc.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{uc.pitch}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS (5 stages) ───────────────── */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#DAE6FF] text-[#4A66FF] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Onboarding journey
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Five stages, 28–42 working days (T1) — longer for capital tracks
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              EDD is deliberately thorough. Every stage has a stated SLA and a named owner on our side.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {stages.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5 pb-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-[#25B181] text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md">
                    {s.n}
                  </div>
                  {i < stages.length - 1 && (
                    <div className="flex-1 w-0.5 bg-gradient-to-b from-[#25B181] to-[#D3F1EB] mt-1" />
                  )}
                </div>
                <div className="flex-1 pt-1 pb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-bold font-sora text-gray-900 text-lg">
                      {s.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#1F8F68] bg-[#D3F1EB] px-2.5 py-0.5 rounded-full">
                      {s.sla}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.blurb}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── RBI COMPLIANCE ───────────────── */}
      <section className="bg-[#0E2920] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/15 text-[#51C9AF] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Regulatory architecture
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3">
              The rule-set your partnership operates under
            </h2>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl mx-auto">
              Every instrument, document and control below is referenced in the Master Services
              Agreement and track-specific Financial Schedule. Partners are audited against this
              checklist at onboarding and quarterly thereafter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {complianceItems.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#51C9AF]/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#51C9AF]/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#51C9AF]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold font-sora text-white text-base mb-0.5">
                        {c.title}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wider text-[#51C9AF]/80 mb-2">
                        {c.ref}
                      </p>
                      <p className="text-sm text-white/75 leading-relaxed">{c.blurb}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Satsai — RBI NBFC Reg. B-14.01646", icon: BadgeCheck },
              { label: "ISO 27001 (in progress)", icon: Lock },
              { label: "CERT-In VAPT empanelled", icon: ShieldCheck },
              { label: "DPDP-ready — DPA executed", icon: Database },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.label}
                  className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3"
                >
                  <Icon className="w-4 h-4 text-[#51C9AF] flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-white/85 leading-tight">
                    {b.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── EDD BUCKETS ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#FFEBD1] text-[#E36229] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            What you'll upload
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            Enhanced Due Diligence checklist
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Eight buckets. Six common, two track-specific. Prepare in advance and you'll move fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {eddBuckets.map((b, i) => {
            const Icon = b.icon;
            const isTrackSpecific =
              b.title.includes("T2") || b.title.includes("T3");
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white border rounded-2xl p-6 hover:shadow-md transition-shadow ${
                  isTrackSpecific
                    ? "border-[#E36229]/30 bg-gradient-to-br from-white to-[#FFF4E4]/40"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isTrackSpecific ? "bg-[#FFEBD1]" : "bg-[#D3F1EB]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isTrackSpecific ? "text-[#E36229]" : "text-[#1F8F68]"
                      }`}
                    />
                  </div>
                  <h3 className="font-bold font-sora text-gray-900">{b.title}</h3>
                </div>
                <ul className="space-y-2">
                  {b.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isTrackSpecific ? "text-[#E36229]" : "text-[#25B181]"
                        }`}
                      />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-500 mt-8 max-w-3xl mx-auto">
          Screening runs by us automatically — OFAC / UN / MHA sanctions, PEP, adverse media, MCA
          litigation, NCLT / IBBI defaulter, RBI wilful-defaulter, SEBI / ED / SFIO debarment, CKYC.
          No uploads required for those.
        </p>
      </section>

      {/* ───────────────── DEAL MAP ───────────────── */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white text-[#1F8F68] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Deal map
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Who does what, across the three layers
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-100">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-[#0E2920] text-white/80 text-xs uppercase tracking-wider font-semibold">
                    Responsibility
                  </th>
                  <th className="p-4 text-left bg-[#E36229] text-white text-xs uppercase tracking-wider font-semibold">
                    Satsai (NBFC)
                  </th>
                  <th className="p-4 text-left bg-[#1F8F68] text-white text-xs uppercase tracking-wider font-semibold">
                    Fluxusforge (LSP tech)
                  </th>
                  <th className="p-4 text-left bg-[#4A66FF] text-white text-xs uppercase tracking-wider font-semibold">
                    Partner
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["RBI NBFC licence", "Holds", "—", "—"],
                  ["Balance sheet", "100% (T1/T2); proportional (T3)", "—", "Post-assignment (T4)"],
                  ["Credit policy & BRE", "Owns", "Runs daily", "Cannot override; can add stricter"],
                  ["Underwriting decision", "Owns — non-overridable", "Executes", "Cannot override"],
                  ["Disbursal rails", "From Satsai account", "Orchestrates", "Cannot touch funds"],
                  ["Repayment rails", "To Satsai account", "Orchestrates", "Cannot touch funds"],
                  ["Key Fact Statement", "Named lender on KFS", "Generates", "Displays prominently"],
                  ["CIC reporting", "Does", "Executes", "Prohibited"],
                  ["Customer acquisition", "—", "—", "Primary"],
                  ["Brand on DLA", "Disclosed as lender", "Disclosed as tech provider", "Primary brand"],
                  ["First-level grievance", "—", "Routes", "Owns — GRO on DLA"],
                  ["Nodal Officer / Ombudsman", "Owns", "—", "Displays + escalates"],
                  ["Collections (tele + field + legal)", "Owns", "Operates", "Brand + access only"],
                  ["FLDG posted", "Receives", "Custodies ledger", "Posts (5% cap)"],
                  ["Capital (T2 NCD / debt)", "Obligor / issuer", "—", "Investor"],
                  ["Revenue share", "NBFC spread", "Ops fee", "Coupon + profit share"],
                ].map(([row, a, b, c], i) => (
                  <tr
                    key={row}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"}
                  >
                    <td className="p-3.5 font-medium text-gray-900 border-b border-gray-100">
                      {row}
                    </td>
                    <td className="p-3.5 text-gray-700 border-b border-gray-100">{a}</td>
                    <td className="p-3.5 text-gray-700 border-b border-gray-100">{b}</td>
                    <td className="p-3.5 text-gray-700 border-b border-gray-100">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───────────────── WHAT YOU GET ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#DAE6FF] text-[#4A66FF] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Post go-live
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
            The stack you plug into
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "Loan Origination APIs", blurb: "Application creation, KYC, PAN + Aadhaar + bank verification, bureau pull, BRE decisioning, KFS generation, eSign.", icon: GitBranch },
            { title: "Loan Management APIs", blurb: "Disbursal, repayment schedule, part payment, payment links, eNACH, DPD tracking, settlement — all on Satsai's rails.", icon: Database },
            { title: "Capital facility console", blurb: "Ring-fenced drawdown ledger, NCD coupon statements, FLDG utilisation, waterfall visibility, monthly MIS for your board.", icon: Coins },
            { title: "Partner dashboard", blurb: "Real-time disbursals, portfolio performance, collection health, bureau status, complaints MIS.", icon: Gauge },
            { title: "Sandbox environment", blurb: "Full-fidelity test stack with mock bureau, mock bank rails, demo OTP for end-to-end rehearsal.", icon: KeyRound },
            { title: "Compliance artefacts", blurb: "Pre-built KFS template with Satsai as named lender, grievance flow, consent stack, DPDP notices, FPC adoption pack.", icon: FileCheck },
            { title: "Fluxusforge collections ops", blurb: "Tele, field and legal collections run end-to-end by our team with AI-assisted call scoring, DPD-based queueing, settlement workflows.", icon: Handshake },
            { title: "Dedicated partnership owner", blurb: "Named BD + risk + finance owners; quarterly business reviews; access to the portfolio committee.", icon: Users },
            { title: "Exit & run-off rail", blurb: "Contractual run-off plan preserves borrower experience and releases your FLDG as loans close.", icon: ArrowDown },
          ].map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#4A66FF] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DAE6FF] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#4A66FF]" />
                </div>
                <h3 className="font-semibold font-sora text-gray-900 mb-1.5">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.blurb}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-gray-900 mb-3">
              Questions we expect
            </h2>
            <p className="text-gray-600">
              Anything not covered here will be addressed in the eligibility call.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-100 rounded-xl p-5 open:shadow-md transition-shadow"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold font-sora text-gray-900 pr-4">
                    {f.q}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#D3F1EB] text-[#1F8F68] flex items-center justify-center text-lg leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#25B181] to-[#1F8F68] p-10 sm:p-14 text-white">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(600px 300px at 90% 10%, rgba(255,255,255,0.25), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora leading-tight mb-4 max-w-2xl">
              Ready to turn your customer base into a lending book?
            </h2>
            <p className="text-white/85 text-base sm:text-lg mb-7 max-w-2xl">
              Apply in under two minutes. If you clear the auto eligibility pre-check we assign your
              track, open the EDD portal, and a named BD owner reaches out within one working day.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/partners/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#1F8F68] hover:bg-[#D3F1EB] transition-colors rounded-xl font-semibold shadow-lg"
              >
                Start partner application
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:partnerships@quikkred.in"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 hover:bg-white/10 transition-colors rounded-xl font-semibold text-white"
              >
                Email partnerships@quikkred.in
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8 max-w-3xl mx-auto leading-relaxed">
          Loans originated on the Quikkred platform are lent by Satsai Finlease Private Limited
          (RBI Reg. B-14.01646). Fluxusforge operates the Lending Service Provider (LSP) tech and
          servicing stack. Nothing on this page constitutes a binding offer to lend or partner.
          Onboarding is subject to successful EDD, risk committee approval and execution of the
          Master Services Agreement, Data Processing Agreement, Default Loss Guarantee Deed and —
          for Track 2 — the NCD Subscription / Debt Facility Agreement. Grievances:{" "}
          <Link href="/grievance-redressal-policy" className="underline hover:text-[#1F8F68]">
            Grievance Redressal Policy
          </Link>
          {" "}·{" "}
          <Link href="/nodal-officer" className="underline hover:text-[#1F8F68]">
            Nodal Officer
          </Link>
          . Final escalation: RBI Integrated Ombudsman (cms.rbi.org.in).
        </p>
      </section>
    </div>
  );
}

/* ────────── helper sub-components ────────── */

function Node({
  index,
  tone,
  title,
  sub,
  icon: Icon,
}: {
  index: number;
  tone: "blue" | "green" | "orange" | "purple" | "teal";
  title: string;
  sub: string;
  icon: React.ComponentType<any>;
}) {
  const tones = {
    blue: "bg-[#DAE6FF]/10 border-[#4A66FF]/40 text-[#91B3FF]",
    green: "bg-[#D3F1EB]/10 border-[#51C9AF]/40 text-[#51C9AF]",
    orange: "bg-[#FFEBD1]/10 border-[#FF9C70]/40 text-[#FF9C70]",
    purple: "bg-[#DAE6FF]/10 border-[#6D90FF]/40 text-[#B6CEFF]",
    teal: "bg-[#D3F1EB]/10 border-[#7CDAC3]/40 text-[#7CDAC3]",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 flex gap-4 ${tones}`}>
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full border-current border flex items-center justify-center font-mono font-bold">
          {index}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 flex-shrink-0" />
          <h4 className="font-semibold font-sora text-white text-sm">{title}</h4>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">{sub}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center my-1">
      <ArrowDown className="w-4 h-4 text-[#51C9AF]/50" />
    </div>
  );
}
