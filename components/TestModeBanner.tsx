"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isTestMode, syncTestModeFromUrl, disableTestMode, clearTestLoggedIn, TEST_MOBILE, TEST_OTP } from "@/lib/testMode";

/**
 * Floating Test Mode control. Only renders when Test Mode is active.
 * Gives quick links to the demo screens and an Exit button.
 * Collapse it to a small dot to keep it out of the recording.
 */
export default function TestModeBanner() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Persist ?testMode=1 (or clear on ?testMode=0) then resolve current state.
    setActive(syncTestModeFromUrl() || isTestMode());
  }, []);

  if (!active) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Test Mode"
        className="fixed bottom-4 left-4 z-[9999] h-9 w-9 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg ring-2 ring-white animate-pulse"
      >
        T
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] w-56 rounded-xl border border-amber-300 bg-amber-50 p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          TEST MODE
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-amber-700 hover:text-amber-900 text-xs"
          title="Collapse"
        >
          ✕
        </button>
      </div>

      <div className="mb-2 rounded-md bg-white px-2.5 py-1.5 text-[11px] leading-relaxed text-gray-600">
        <div>Mobile: <span className="font-mono font-semibold text-gray-900">{TEST_MOBILE}</span></div>
        <div>OTP: <span className="font-mono font-semibold text-gray-900">{TEST_OTP}</span></div>
      </div>

      <div className="flex flex-col gap-1.5 text-sm">
        <Link href="/apply/quick" className="rounded-md bg-white px-2.5 py-1.5 font-medium text-gray-700 hover:bg-amber-100">
          Apply flow →
        </Link>
        <Link href="/application-status" className="rounded-md bg-white px-2.5 py-1.5 font-medium text-gray-700 hover:bg-amber-100">
          Approved status →
        </Link>
        <Link href="/user" className="rounded-md bg-white px-2.5 py-1.5 font-medium text-gray-700 hover:bg-amber-100">
          Dashboard →
        </Link>
      </div>

      <button
        onClick={() => {
          // Clear the test-login flag and restart the apply flow at the login
          // screen so the OTP step can be recorded again.
          clearTestLoggedIn();
          window.location.href = "/apply/quick";
        }}
        className="mt-2 w-full rounded-md bg-white border border-amber-400 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
      >
        Restart login
      </button>

      <button
        onClick={() => {
          disableTestMode();
          window.location.href = "/";
        }}
        className="mt-1.5 w-full rounded-md bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
      >
        Exit test mode
      </button>
    </div>
  );
}
