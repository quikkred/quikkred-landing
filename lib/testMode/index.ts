/**
 * ============================================================================
 *  TEST MODE — SWITCH
 * ============================================================================
 *  Test Mode lets you bypass every page (login, OTP, KYC, eligibility, bank,
 *  selfie, e-mandate…) and land straight on an approved/active loan so you can
 *  record a demo video. It injects the dummy data from ./testData.ts into the
 *  auth context, application context, dashboard store, and status page, and
 *  skips the auth guard in middleware.
 *
 *  HOW TO ENABLE (any one):
 *   1. Env var (recommended, survives navigation/refresh):
 *        add  NEXT_PUBLIC_TEST_MODE=true  to .env  and restart `npm run dev`
 *   2. URL param (no restart):  visit any page with  ?testMode=1
 *        e.g. /apply/quick?testMode=1  — this is then remembered (localStorage
 *        + cookie) until you disable it.
 *   3. Disable: visit  ?testMode=0  (or click "Exit" on the Test Mode banner).
 * ============================================================================
 */

export const TEST_MODE_QUERY = "testMode";
export const TEST_MODE_STORAGE_KEY = "qk_test_mode";
export const TEST_MODE_COOKIE = "qk_test_mode";

/** Build-time master switch — inlined into client + middleware + server bundles. */
export const TEST_MODE_ENV = process.env.NEXT_PUBLIC_TEST_MODE === "true";

/**
 * Client-side check. Safe to call during SSR (returns the env value only).
 * Order: env var → URL ?testMode=1 → persisted localStorage/cookie flag.
 */
export function isTestMode(): boolean {
  if (TEST_MODE_ENV) return true;
  if (typeof window === "undefined") return false;
  try {
    const value = new URLSearchParams(window.location.search).get(TEST_MODE_QUERY);
    if (value === "1" || value === "true") return true;
    if (value === "0" || value === "false") return false; // explicit off
    if (window.localStorage.getItem(TEST_MODE_STORAGE_KEY) === "1") return true;
    if (document.cookie.split("; ").includes(`${TEST_MODE_COOKIE}=1`)) return true;
  } catch {
    /* ignore (private mode / blocked storage) */
  }
  return false;
}

/**
 * Persist or clear the Test Mode flag based on a ?testMode= query param so it
 * survives client navigation and is visible to middleware (via cookie).
 * Call once on app mount. Returns the resolved state.
 */
export function syncTestModeFromUrl(): boolean {
  if (typeof window === "undefined") return TEST_MODE_ENV;
  try {
    const value = new URLSearchParams(window.location.search).get(TEST_MODE_QUERY);
    if (value === "1" || value === "true") {
      window.localStorage.setItem(TEST_MODE_STORAGE_KEY, "1");
      document.cookie = `${TEST_MODE_COOKIE}=1; path=/; max-age=86400`;
    } else if (value === "0" || value === "false") {
      window.localStorage.removeItem(TEST_MODE_STORAGE_KEY);
      document.cookie = `${TEST_MODE_COOKIE}=; path=/; max-age=0`;
    }
  } catch {
    /* ignore */
  }
  return isTestMode();
}

/** Turn Test Mode off everywhere (used by the banner's Exit button). */
export function disableTestMode(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TEST_MODE_STORAGE_KEY);
    document.cookie = `${TEST_MODE_COOKIE}=; path=/; max-age=0`;
  } catch {
    /* ignore */
  }
}

export * from "./testData";
