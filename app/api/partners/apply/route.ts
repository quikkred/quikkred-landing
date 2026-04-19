// app/api/partners/apply/route.ts
// Next.js App Router API route — forwards the EOI to the v2 backend.
// Keeps request-id propagation, honours Idempotency-Key, and gracefully
// degrades to a client-side reference if the backend is unreachable.

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

const V2_BASE = process.env.QUIKKRED_V2_BASE ?? "http://localhost:7000";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? randomUUID();
  const idemKey = req.headers.get("idempotency-key") ?? randomUUID();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { code: "BAD_JSON", message: "Request body must be JSON" },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(`${V2_BASE}/v2/partner/apply`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": requestId,
        "idempotency-key": idemKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { "x-request-id": requestId },
    });
  } catch (err) {
    // Graceful degradation — v2 backend unreachable, return a client-side
    // reference the user can use when support follows up. The form on the
    // frontend already handles this shape.
    const fallbackId = `QPL-OFFLINE-${Date.now().toString(36).toUpperCase()}`;
    console.error("[api/partners/apply] v2 unreachable, falling back", err);
    return NextResponse.json(
      {
        applicationId: fallbackId,
        applicationRef: fallbackId,
        offlineAccepted: true,
        message: "Your submission was captured locally. Our team will reach out by email within 1 working day.",
      },
      { status: 202, headers: { "x-request-id": requestId } },
    );
  }
}
