// ─────────────────────────────────────────────────────────────────────────────
// Minimal, dependency-free JWT helpers (decode only — NEVER trust client-side).
//
// The backend signs short-lived access tokens (ACCESS_TOKEN_EXPIRY, default 1d).
// The NextAuth session that holds them lives ~30 days, so the stored token can
// expire long before the session does. Reading the `exp` claim lets us refresh
// proactively instead of firing a request that's guaranteed to 401.
//
// This decodes the payload WITHOUT verifying the signature. That is fine for the
// only thing we use it for — reading our OWN token's expiry to decide when to
// refresh. The backend remains the sole authority on validity.
// ─────────────────────────────────────────────────────────────────────────────

/** Decode a JWT's payload. Returns null for anything that isn't a JWT we can read. */
export function decodeJwt(token?: string | null): Record<string, any> | null {
  if (!token || typeof token !== "string") return null;
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    let json: string;
    if (typeof atob === "function") {
      // Browser: atob → percent-decode to handle UTF-8 payloads correctly.
      json = decodeURIComponent(
        atob(padded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } else {
      // Server (Node): Buffer is available.
      json = Buffer.from(padded, "base64").toString("utf-8");
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Seconds remaining until the token's `exp`. null when there's no readable exp. */
export function secondsUntilExpiry(token?: string | null): number | null {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp - Math.floor(Date.now() / 1000);
}

/**
 * True when the token is already expired or within `skewSeconds` of expiring.
 * Returns false when expiry can't be read — we only refresh proactively when we
 * are confident the token is (about to be) dead; otherwise we let the request go
 * and rely on a reactive 401-retry.
 */
export function isTokenExpiring(token?: string | null, skewSeconds = 120): boolean {
  const left = secondsUntilExpiry(token);
  if (left === null) return false;
  return left <= skewSeconds;
}
