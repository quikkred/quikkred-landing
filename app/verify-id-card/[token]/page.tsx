// app/verify-id-card/[token]/page.tsx
// Public partner ID-card verification page.
// Reached when a borrower scans the partner's QR code. The page fetches the
// partner snapshot from collection-partner-backend (via /api/verify-id-card/
// [token]) and renders the same card the partner showed in person — so the
// borrower can confirm name + photo match.

import { headers } from "next/headers";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Verify Partner · Quikkred",
  description:
    "Confirm that a Quikkred collection partner is authorised and active.",
  robots: { index: false, follow: false },
};

type LenderBranding = {
  lenderCode: string;
  displayName: string;
  shortName?: string;
  logoUrl?: string;
  primaryColor?: string;
};

type VerifyData = {
  partnerId: string;
  name: string;
  photoUrl: string | null;
  zone: string | null;
  track: "A" | "B";
  role: string;
  scope: string;
  rating: number | null;
  totalVisits: number;
  bgCleared: boolean;
  bgClearedAt: string | null;
  bgClearedSource: "KYC" | "PCC" | null;
  issuedAt: string | null;
  linkedWork: { platform: string; rating: number | null } | null;
  verifiedAt: string;
  scanNumber: number;
  lenderBranding?: LenderBranding | null;
};

type VerifyResponse =
  | { success: true; valid: true; data: VerifyData }
  | {
      success: false;
      valid: false;
      code?: "INVALID_OR_EXPIRED" | "TOKEN_REVOKED" | "PARTNER_INACTIVE" | "UPSTREAM_UNREACHABLE";
      message: string;
    };

async function fetchVerification(
  token: string,
  lender: string | null,
): Promise<{ status: number; body: VerifyResponse }> {
  const h = await headers();
  const host = h.get("host") ?? "www.quikkred.in";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  const qs = lender ? `?lender=${encodeURIComponent(lender)}` : "";
  const res = await fetch(
    `${proto}://${host}/api/verify-id-card/${encodeURIComponent(token)}${qs}`,
    { cache: "no-store" },
  );
  const body = (await res.json().catch(() => ({}))) as VerifyResponse;
  return { status: res.status, body };
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ lender?: string }>;
}) {
  const { token } = await params;
  const { lender = null } = await searchParams;
  const { status, body } = await fetchVerification(token, lender ?? null);

  if (!body.success || !body.valid) {
    return <FailureCard status={status} body={body as Extract<VerifyResponse, { success: false }>} />;
  }

  const d = body.data;
  const lb = d.lenderBranding ?? null;
  const trackBadge = d.track === "B" ? "CERTIFIED DRA · TRACK B" : "VERIFIED PARTNER · TRACK A";

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-3xl">
        <article className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-[#1FA180] via-[#1AAE85] to-[#178C84] text-white p-6 sm:p-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            {lb ? (
              <div className="flex items-center gap-2.5">
                <span className="font-sora text-xl sm:text-2xl font-semibold tracking-wide">QUIKKRED</span>
                <div className="w-px h-5 bg-white/40" />
                {lb.logoUrl ? (
                  <Image
                    src={lb.logoUrl}
                    alt={lb.shortName ?? lb.displayName}
                    width={64}
                    height={22}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="font-semibold text-base tracking-wide text-white/90">
                    {lb.shortName ?? lb.displayName}
                  </span>
                )}
              </div>
            ) : (
              <h1 className="font-sora text-xl sm:text-2xl font-semibold tracking-wide">
                QUIKKRED
              </h1>
            )}
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase border border-white/40 rounded-full px-3 py-1 whitespace-nowrap">
              {trackBadge}
            </span>
          </div>

          {/* Identity row */}
          <div className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-5">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-white/10 ring-1 ring-white/30 shrink-0">
              {d.photoUrl ? (
                <Image
                  src={d.photoUrl}
                  alt={`${d.name} — partner photo`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-white/70">
                  {d.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-sora text-2xl sm:text-3xl font-semibold leading-tight truncate">
                {d.name}
              </h2>
              <p className="text-white/90 text-sm sm:text-base mt-1">
                {d.role}
                {d.zone ? <> · {d.zone}</> : null}
              </p>
              <p className="text-white/70 text-xs sm:text-sm font-mono tracking-wider mt-1">
                {d.partnerId}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 my-6 sm:my-7" />

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 font-medium">
                BG Cleared
              </p>
              <p className="mt-1 text-sm sm:text-base text-white">
                {d.bgCleared ? (
                  <>
                    {d.bgClearedSource ?? "Verified"} · {formatDate(d.bgClearedAt ?? d.issuedAt)}
                  </>
                ) : (
                  <span className="text-white/70">Pending</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 font-medium">
                Linked Work
              </p>
              <p className="mt-1 text-sm sm:text-base text-white">
                {d.linkedWork ? (
                  <>
                    {d.linkedWork.platform}
                    {d.linkedWork.rating ? <> · ★ {d.linkedWork.rating.toFixed(1)}</> : null}
                  </>
                ) : (
                  "Not linked"
                )}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 my-6 sm:my-7" />

          {/* Scope + freshness pill */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <p className="text-xs sm:text-sm text-white/90 max-w-lg leading-relaxed">
              {lb
                ? `Authorised soft-task partner for ${lb.displayName}. Cannot collect cash. Borrower may verify via QR.`
                : `${d.scope} Borrower may verify via QR.`}
            </p>
            <div className="shrink-0 inline-flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 text-xs sm:text-[13px] backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="font-medium">Verified just now</span>
              <span className="text-white/60">· scan #{d.scanNumber}</span>
            </div>
          </div>

          {/* Partnership disclaimer — only for external lender cases */}
          {lb && (
            <div className="mt-5 rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-[11px] sm:text-xs text-white/80 leading-relaxed">
              This partner is engaged by{" "}
              <strong className="text-white">Quikkred Financial Services</strong> to conduct
              soft-task visits on behalf of{" "}
              <strong className="text-white">{lb.displayName}</strong>. They{" "}
              <strong className="text-red-300">cannot collect cash</strong>. Any payment should go
              through the official payment link shared via the Quikkred Collect app.
            </div>
          )}
        </article>

        {/* Trust footer */}
        <p className="mt-4 text-center text-xs sm:text-sm text-slate-500">
          Issued {formatDate(d.issuedAt)} · QR rotates every 12h · screenshot fails verification
        </p>
        <p className="mt-2 text-center text-[11px] sm:text-xs text-slate-400">
          Concerns? Email{" "}
          <a className="underline" href="mailto:grievance@quikkred.in">
            grievance@quikkred.in
          </a>{" "}
          or call our support line.
        </p>
      </div>
    </div>
  );
}

// Failure card — mirrors the success layout (same gradient + footer) so a
// borrower who scanned a bad QR still recognises they're on quikkred.in,
// but the messaging tells them this partner is NOT verified right now.
function FailureCard({
  status,
  body,
}: {
  status: number;
  body: Extract<VerifyResponse, { success: false }>;
}) {
  const headline =
    body.code === "TOKEN_REVOKED"
      ? "This QR is no longer active"
      : body.code === "PARTNER_INACTIVE"
        ? "This partner is not active"
        : body.code === "UPSTREAM_UNREACHABLE"
          ? "Verification service unavailable"
          : status === 404
            ? "Partner not found"
            : "This QR could not be verified";

  const subtext =
    body.code === "TOKEN_REVOKED"
      ? "QR codes rotate every 12 hours and screenshots are blocked by design. Ask the partner to refresh their card and scan again."
      : body.code === "PARTNER_INACTIVE"
        ? "This account is suspended or no longer active. Do not share any documents or money with this person."
        : body.code === "UPSTREAM_UNREACHABLE"
          ? "We could not reach the verification service. Please try again in a moment."
          : "Either the QR is invalid, expired, or has been tampered with. Do not share any documents or money with this person.";

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-3xl">
        <article className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-rose-700 via-rose-600 to-red-700 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-sora text-xl sm:text-2xl font-semibold tracking-wide">
              QUIKKRED
            </h1>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase border border-white/40 rounded-full px-3 py-1">
              NOT VERIFIED
            </span>
          </div>
          <div className="mt-8 sm:mt-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            </div>
            <h2 className="font-sora text-2xl sm:text-3xl font-semibold leading-tight">
              {headline}
            </h2>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-xl">
              {subtext}
            </p>
          </div>
        </article>
        <p className="mt-4 text-center text-xs sm:text-sm text-slate-500">
          If someone is trying to collect money or documents and you can&apos;t verify
          them, report it to{" "}
          <a className="underline" href="mailto:grievance@quikkred.in">
            grievance@quikkred.in
          </a>
          .
        </p>
      </div>
    </div>
  );
}
