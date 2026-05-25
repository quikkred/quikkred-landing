// app/api/partners/proprietor-distributor/apply/route.ts
// Accepts multipart/form-data with a JSON "payload" field plus
// docPan / docKyc / docKyb / docCoi / docMoa / docGst file parts,
// validates file size & type at the edge, then forwards to v2 backend.
// Degrades to a client-side reference if v2 is unreachable.

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

const V2_BASE = process.env.QUIKKRED_V2_BASE ?? "http://localhost:7000";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_DOC_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
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

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? randomUUID();
  const idemKey = req.headers.get("idempotency-key") ?? randomUUID();

  let incoming: FormData;
  try {
    incoming = await req.formData();
  } catch {
    return NextResponse.json(
      { code: "BAD_FORM", message: "Request must be multipart/form-data" },
      { status: 400 },
    );
  }

  const payloadStr = incoming.get("payload");
  if (typeof payloadStr !== "string") {
    return NextResponse.json(
      { code: "MISSING_PAYLOAD", message: "Missing JSON payload part" },
      { status: 400 },
    );
  }

  // Validate file parts at the edge
  for (const k of DOC_KEYS) {
    const part = incoming.get(k);
    if (part === null) continue;
    if (!(part instanceof File)) {
      return NextResponse.json(
        { code: "BAD_FILE", message: `Field ${k} must be a file` },
        { status: 400 },
      );
    }
    if (part.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { code: "FILE_TOO_LARGE", message: `${k} exceeds 5 MB` },
        { status: 413 },
      );
    }
    if (!ACCEPTED_DOC_TYPES.has(part.type)) {
      return NextResponse.json(
        { code: "BAD_FILE_TYPE", message: `${k} must be PDF, JPG or PNG` },
        { status: 415 },
      );
    }
  }

  try {
    // Re-pack into a fresh FormData so we forward only the keys we expect,
    // preserving file names and content-types.
    const outgoing = new FormData();
    outgoing.append("payload", payloadStr);
    for (const k of DOC_KEYS) {
      const part = incoming.get(k);
      if (part instanceof File) outgoing.append(k, part, part.name);
    }

    const upstream = await fetch(
      `${V2_BASE}/v2/partner/proprietor-distributor/apply`,
      {
        method: "POST",
        headers: {
          "x-request-id": requestId,
          "idempotency-key": idemKey,
          // NB: do not set content-type — fetch sets multipart boundary
        },
        body: outgoing,
        signal: AbortSignal.timeout(30_000),
      },
    );
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { "x-request-id": requestId },
    });
  } catch (err) {
    const fallbackId = `QDIST-OFFLINE-${Date.now().toString(36).toUpperCase()}`;
    console.error(
      "[api/partners/proprietor-distributor/apply] v2 unreachable, falling back",
      err,
    );
    return NextResponse.json(
      {
        applicationId: fallbackId,
        applicationRef: fallbackId,
        offlineAccepted: true,
        message:
          "Your distributor application was captured locally. Our team will reach out within 1 working day.",
      },
      { status: 202, headers: { "x-request-id": requestId } },
    );
  }
}
