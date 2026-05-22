// app/api/verify/[token]/route.ts
// Public partner ID-card verification — proxies to collection-partner-backend.
// Borrowers scan the partner's QR; the QR points at /verify/<token> on this
// site. The page calls this route, which forwards to the partner service.

import { NextRequest, NextResponse } from "next/server";

const PARTNER_BASE =
  process.env.COLLECTION_PARTNER_BASE_URL ?? "https://gig.quikkred.in";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token) {
    return NextResponse.json(
      { success: false, valid: false, message: "Missing token" },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(
      `${PARTNER_BASE}/api/public/verify/${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      },
    );
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        valid: false,
        code: "UPSTREAM_UNREACHABLE",
        message: "Verification service is temporarily unavailable.",
      },
      { status: 502 },
    );
  }
}
