// ─────────────────────────────────────────────────────────────────────────────
// Admin / CEO impersonation ("support session")
//
// Lets a privileged account open a customer's dashboard WITHOUT sending the
// customer an OTP. The backend is the real gate: POST /api/auth/admin/impersonate
// requires the ADMIN/CEO's own access token, checks the role server-side, and
// returns the SAME token bundle that /api/auth/customer/verifyOtp returns
// (plus `impersonatedBy`). We then establish the customer session through the
// existing NextAuth `otp-tokens` provider — exactly how a normal OTP login ends.
//
// IMPORTANT: in this app the access token used by every API call lives in the
// NextAuth session (see lib/getToken.ts + hooks/useAxios.ts), NOT in
// localStorage. So "switch to the customer" === sign in with their tokens, which
// necessarily replaces the admin's session in this browser. We stash the admin's
// own token bundle first so "Exit session" can switch back. See exitImpersonation.
// ─────────────────────────────────────────────────────────────────────────────

import { signIn, getSession } from "next-auth/react";
import { API_BASE_URL } from "@/lib/config";
import { clearSession } from "@/lib/auth-utils";

/** Roles allowed to start a support session. The backend enforces this too. */
export const ADMIN_ROLES = ["ADMIN", "CEO", "OWNER", "SUPER_ADMIN"] as const;

/** Backend issues impersonation tokens with a 30-minute TTL (by design). */
export const IMPERSONATION_TTL_MS = 30 * 60 * 1000;

const ADMIN_STASH_KEY = "qk_admin_session";   // the admin's own tokens, to switch back
const META_KEY = "qk_impersonation";          // display info for the banner

export interface ImpersonationData {
  userId: string;
  customerUniqueId?: string;
  mobile?: string;
  email?: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  impersonatedBy: string;
}

export interface ImpersonationMeta {
  customerLabel: string;
  customerId: string;
  impersonatedBy: string;
  startedAt: number;
  expiresAt: number;
}

export interface ImpersonateParams {
  customerId?: string;
  mobile?: string;
  customerUniqueId?: string;
  reason?: string;
}

function isAdminRole(role?: string | null): boolean {
  return !!role && (ADMIN_ROLES as readonly string[]).includes(role);
}

// ── banner meta (best-effort display state) ─────────────────────────────────
export function getImpersonationMeta(): ImpersonationMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as ImpersonationMeta) : null;
  } catch {
    return null;
  }
}

function setImpersonationMeta(meta: ImpersonationMeta) {
  try {
    sessionStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    /* private mode / quota — banner just falls back to a generic label */
  }
}

function clearImpersonationMeta() {
  try {
    sessionStorage.removeItem(META_KEY);
  } catch {
    /* ignore */
  }
}

// ── admin session stash (so we can switch back on exit) ─────────────────────
function stashAdminSession(session: any) {
  if (!session?.accessToken) return;
  const bundle = {
    userId: session.user?.id || "",
    email: session.user?.email || "",
    mobile: session.mobile || "",
    role: session.role || "",
    accessToken: session.accessToken,
    refreshToken: session.refreshToken || "",
    customerUniqueId: session.customerUniqueId || "",
  };
  try {
    sessionStorage.setItem(ADMIN_STASH_KEY, JSON.stringify(bundle));
  } catch {
    /* ignore */
  }
}

function readStashedAdminSession(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_STASH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearStashedAdminSession() {
  try {
    sessionStorage.removeItem(ADMIN_STASH_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Start a support session as the given customer.
 *
 * Flow: read the admin's current token → call the backend → stash the admin
 * token + banner meta → establish the customer session via `otp-tokens`.
 * The caller should then hydrate AuthContext (login({ apiData: session })) and
 * navigate to the dashboard, mirroring the OTP login flow.
 *
 * @returns the impersonation token bundle from the backend.
 * @throws  with a user-facing message on any failure.
 */
export async function startImpersonation(params: ImpersonateParams): Promise<ImpersonationData> {
  // 1) the admin's own access token IS the proof of authorization for the backend.
  const adminSession = await getSession();
  const adminToken = (adminSession as any)?.accessToken;
  if (!adminToken) {
    throw new Error("You must be signed in as an admin to start a support session.");
  }
  if (!isAdminRole((adminSession as any)?.role)) {
    throw new Error("Your account is not authorised to start a support session.");
  }

  // 2) exactly one identity key, as the backend requires.
  const body: Record<string, string> = {};
  if (params.customerId) body.customerId = params.customerId.trim();
  else if (params.mobile) body.mobile = params.mobile.trim();
  else if (params.customerUniqueId) body.customerUniqueId = params.customerUniqueId.trim();
  else throw new Error("Provide a customer ID, mobile number, or customer unique ID.");
  if (params.reason?.trim()) body.reason = params.reason.trim();

  // 3) call the admin-only backend endpoint with the admin's bearer token.
  let json: any = null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/impersonate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    json = await res.json().catch(() => null);

    // The NextAuth session can outlive the backend access token (nothing
    // refreshes it), so a stored-but-expired admin token comes back here as a
    // 401 "Token expired". The admin's session can't authorise anything in
    // that state — clear it and send them to the sign-in page to
    // re-authenticate, mirroring how useAxios handles 401s for customers.
    if (res.status === 401) {
      clearImpersonationMeta();
      clearStashedAdminSession();
      await clearSession("/latur-ka-fraud-customer");
      throw new Error(
        json?.message || "Your admin session has expired. Please sign in again.",
      );
    }

    if (!res.ok || !json?.success || !json?.data) {
      throw new Error(json?.message || "Could not start the support session. Please try again.");
    }
  } catch (err: any) {
    if (err instanceof TypeError) {
      throw new Error("Network error while contacting the server. Please try again.");
    }
    throw err;
  }

  const data = json.data as ImpersonationData;

  // 4) remember the admin's own session so "Exit" can switch back, and stash
  //    display info for the banner BEFORE we replace the session.
  stashAdminSession(adminSession);
  setImpersonationMeta({
    customerLabel: data.email || data.mobile || data.customerUniqueId || data.userId,
    customerId: data.userId,
    impersonatedBy: data.impersonatedBy,
    startedAt: Date.now(),
    expiresAt: Date.now() + IMPERSONATION_TTL_MS,
  });

  // 5) establish the CUSTOMER session via the same provider used after verifyOtp.
  const signInRes = await signIn("otp-tokens", {
    redirect: false,
    userId: data.userId,
    email: data.email || "",
    mobile: data.mobile || "",
    role: data.role,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    customerUniqueId: data.customerUniqueId || "",
    impersonatedBy: data.impersonatedBy || "",
  });

  if (!signInRes?.ok) {
    clearImpersonationMeta();
    clearStashedAdminSession();
    throw new Error("The support session could not be established. Please try again.");
  }

  return data;
}

/**
 * End the support session. Restores the admin's own session if we still have
 * their stashed (non-expired) tokens; otherwise signs out cleanly to /login.
 * Performs a full navigation so all session-derived state re-reads fresh.
 */
export async function exitImpersonation(): Promise<void> {
  const admin = readStashedAdminSession();
  clearImpersonationMeta();

  if (admin?.accessToken) {
    try {
      const res = await signIn("otp-tokens", {
        redirect: false,
        userId: admin.userId,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role,
        accessToken: admin.accessToken,
        refreshToken: admin.refreshToken,
        customerUniqueId: admin.customerUniqueId,
      });
      clearStashedAdminSession();
      if (res?.ok) {
        window.location.href = "/latur-ka-fraud-customer/impersonate";
        return;
      }
    } catch {
      /* fall through to a clean logout */
    }
  }

  // No restorable admin session (e.g. their token expired) → clean logout.
  clearStashedAdminSession();
  await clearSession("/login");
}
