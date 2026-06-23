"use client";

import { useCallback, useEffect, useState } from "react";
import {
    BreFlowMode,
    DEFAULT_BRE_FLOW,
    FLOW_MODE_EVENT,
    FLOW_MODE_STORAGE_KEY,
    isBreFlowMode,
} from "@/lib/constants/flowConfig";

/** Read the persisted override, falling back to the configured default. */
const readStoredMode = (): BreFlowMode => {
    if (typeof window === "undefined") return DEFAULT_BRE_FLOW;
    const stored = window.localStorage.getItem(FLOW_MODE_STORAGE_KEY);
    return isBreFlowMode(stored) ? stored : DEFAULT_BRE_FLOW;
};

/**
 * Read the active eligibility flow without subscribing to changes.
 * Useful inside event handlers where the latest value is read on demand.
 */
export const getFlowMode = readStoredMode;

/**
 * React hook for the active eligibility flow. SSR-safe (starts from the default
 * to avoid hydration mismatch, then syncs to the stored value on mount) and
 * kept in sync across components/tabs via a custom event + the storage event.
 */
export default function useFlowMode() {
    const [mode, setModeState] = useState<BreFlowMode>(DEFAULT_BRE_FLOW);

    useEffect(() => {
        setModeState(readStoredMode());

        const sync = () => setModeState(readStoredMode());

        window.addEventListener(FLOW_MODE_EVENT, sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener(FLOW_MODE_EVENT, sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const setMode = useCallback((next: BreFlowMode) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(FLOW_MODE_STORAGE_KEY, next);
        // Notify same-tab listeners (the native `storage` event only fires
        // in *other* tabs, so we broadcast our own for this one).
        window.dispatchEvent(new Event(FLOW_MODE_EVENT));
        setModeState(next);
    }, []);

    return { mode, setMode };
}
