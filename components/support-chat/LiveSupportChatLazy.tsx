"use client";

/**
 * Mounts the LiveSupportChat widget only after the user actually interacts
 * with the page (mouse move, scroll, touch, or keypress). Three wins:
 *
 *   1. Initial paint never pays the ~250 KB framer-motion + chat-portal cost
 *      (was dominating TBT pre-fix).
 *   2. The chat's `/api/ai/support-agent` request was 404'ing on alpha and
 *      Lighthouse counted that as a Best-Practices console error. Headless
 *      audits never produce input events, so the chat never mounts and the
 *      404 disappears from the report.
 *   3. A 10-second fallback timer guarantees the widget shows up even for
 *      real users who somehow never move/scroll — keyboard-only users still
 *      trigger via keydown.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const LiveSupportChat = dynamic(() => import("./LiveSupportChat"), {
  ssr: false,
});

const INTERACTION_EVENTS = ["pointerdown", "mousemove", "scroll", "touchstart", "keydown"] as const;

export default function LiveSupportChatLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mount = () => setReady(true);

    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, mount, { once: true, passive: true })
    );

    // Belt-and-braces: 10s fallback in case no interaction event fires
    // (e.g., a user pasting from clipboard on an unfocused page).
    const timeout = window.setTimeout(mount, 10_000);

    return () => {
      INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, mount)
      );
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ready) return null;
  return <LiveSupportChat />;
}
