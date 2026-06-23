/**
 * ============================================================================
 *  TEST MODE — GLOBAL NETWORK GUARD
 * ============================================================================
 *  A single client-side backstop that intercepts EVERY outgoing request to the
 *  external backend (API_BASE_URL / WS_URL) while Test Mode is active, so no
 *  component — no matter how it calls the network (fetch, axios/XHR, raw XHR) —
 *  can hit a backend that would fail. Local Next.js routes (relative "/api/…")
 *  and third-party origins (Razorpay, fonts, etc.) are left untouched.
 *
 *  Installed once, early, from components/providers.tsx. The per-request check
 *  is dynamic (isTestMode()) so toggling Test Mode at runtime works and there
 *  is no install-order race.
 * ============================================================================
 */

import { API_BASE_URL, WS_URL } from "@/lib/config";
import { isTestMode } from "./index";

const EXTERNAL_ORIGINS = [API_BASE_URL, WS_URL].filter(Boolean) as string[];

/** True for absolute URLs that point at our backend (REST or WS). */
function isBackendUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  try {
    const url = String(rawUrl);
    return EXTERNAL_ORIGINS.some((origin) => origin && url.startsWith(origin));
  } catch {
    return false;
  }
}

/** Benign JSON body returned in place of a real backend response. */
function blockedBody(): string {
  return JSON.stringify({
    success: false,
    data: null,
    message: "test-mode: backend disabled",
  });
}

export function installTestNetworkGuard(): void {
  if (typeof window === "undefined") return;
  if ((window as any).__qkTestNetGuardInstalled) return;
  (window as any).__qkTestNetGuardInstalled = true;

  /* ---------------------------- fetch() ---------------------------------- */
  const originalFetch = window.fetch.bind(window);
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : (input as Request)?.url || "";

    if (isTestMode() && isBackendUrl(url)) {
      return Promise.resolve(
        new Response(blockedBody(), {
          status: 200,
          statusText: "OK (test-mode)",
          headers: { "Content-Type": "application/json" },
        })
      );
    }
    return originalFetch(input as any, init);
  };

  /* ----------------------- XMLHttpRequest (axios) ------------------------ */
  const OriginalXHR = window.XMLHttpRequest;
  const originalOpen = OriginalXHR.prototype.open;
  const originalSend = OriginalXHR.prototype.send;

  OriginalXHR.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    ...rest: any[]
  ) {
    (this as any).__qkUrl = typeof url === "string" ? url : url?.href || "";
    // @ts-expect-error — forwarding the original variadic signature
    return originalOpen.call(this, method, url, ...rest);
  };

  OriginalXHR.prototype.send = function (this: XMLHttpRequest, body?: any) {
    const url = (this as any).__qkUrl || "";
    if (isTestMode() && isBackendUrl(url)) {
      // Resolve as a benign, completed-but-empty response without any network.
      const self = this as any;
      setTimeout(() => {
        try {
          Object.defineProperty(self, "readyState", { value: 4, configurable: true });
          Object.defineProperty(self, "status", { value: 200, configurable: true });
          Object.defineProperty(self, "responseText", { value: blockedBody(), configurable: true });
          Object.defineProperty(self, "response", { value: blockedBody(), configurable: true });
          if (typeof self.onreadystatechange === "function") self.onreadystatechange();
          self.dispatchEvent(new Event("readystatechange"));
          self.dispatchEvent(new Event("load"));
          self.dispatchEvent(new Event("loadend"));
        } catch {
          /* ignore */
        }
      }, 0);
      return;
    }
    return originalSend.call(this, body);
  };
}
