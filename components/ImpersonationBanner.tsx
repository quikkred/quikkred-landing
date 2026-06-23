"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";
import { useImpersonation } from "@/hooks/useImpersonation";

/**
 * Persistent top banner shown whenever the active session is an admin support
 * (impersonation) session. Displays whose account is being viewed, a countdown
 * to the 30-minute backend expiry, and an "Exit session" action that switches
 * back to the admin's own session.
 *
 * Mounted globally in components/providers.tsx (next to TestModeBanner).
 */
export default function ImpersonationBanner() {
  const { isImpersonating, meta, exit } = useImpersonation();
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [exiting, setExiting] = useState(false);

  // Pad the bottom of the page so the fixed banner never covers the bottom of the UI.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.paddingBottom = isImpersonating ? "2.5rem" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [isImpersonating]);

  // Countdown to the session's expiry; auto-exit when it runs out.
  useEffect(() => {
    if (!isImpersonating || !meta?.expiresAt) {
      setRemainingMs(null);
      return;
    }
    const tick = () => {
      const left = meta.expiresAt - Date.now();
      setRemainingMs(left);
      if (left <= 0) {
        setExiting(true);
        exit();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isImpersonating, meta?.expiresAt, exit]);

  if (!isImpersonating) return null;

  const countdown =
    remainingMs != null && remainingMs > 0
      ? `${Math.floor(remainingMs / 60000)}:${String(
          Math.floor((remainingMs % 60000) / 1000)
        ).padStart(2, "0")}`
      : null;

  const handleExit = async () => {
    setExiting(true);
    try {
      await exit();
    } catch {
      setExiting(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950 shadow-md">
      <ShieldAlert className="h-4 w-4 shrink-0" />
      <span className="truncate">
        Support session — viewing{" "}
        <span className="font-bold">{meta?.customerLabel || "customer"}</span>&apos;s account
        {countdown && (
          <span className="ml-2 hidden sm:inline opacity-80">
            (expires in <span className="font-mono">{countdown}</span>)
          </span>
        )}
      </span>
      <button
        onClick={handleExit}
        disabled={exiting}
        className="ml-1 inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-950/90 px-2.5 py-1 text-xs font-semibold text-amber-50 hover:bg-amber-950 disabled:opacity-60"
      >
        {exiting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
        {exiting ? "Exiting…" : "Exit session"}
      </button>
    </div>
  );
}
