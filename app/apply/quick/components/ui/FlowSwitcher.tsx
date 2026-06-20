"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Gauge, ChevronUp, X, Workflow } from "lucide-react";
import useFlowMode from "@/hooks/useFlowMode";
import {
    BreFlowMode,
    FLOW_MODE_META,
} from "@/lib/constants/flowConfig";

const MODES: {
    mode: BreFlowMode;
    icon: typeof Landmark;
    endpoint: string;
}[] = [
    { mode: "DIRECT_TO_BANK", icon: Landmark, endpoint: "v2/finfactorConsentRequest" },
    { mode: "BRE_DECISION", icon: Gauge, endpoint: "v2/bre/initialize" },
];

/**
 * FlowSwitcher — a floating "flow console" that toggles the active eligibility
 * flow at runtime (persisted per-browser via useFlowMode). Designed as a
 * precision-instrument panel: dark glass, monospace labels, an animated
 * sliding segmented control. Collapses to a status tab so it stays out of the
 * applicant's way. Intended as an internal/dev control — gate its mount.
 */
export default function FlowSwitcher() {
    const { mode, setMode } = useFlowMode();
    const [open, setOpen] = useState(false);
    const active = FLOW_MODE_META[mode];
    const isBre = mode === "BRE_DECISION";

    return (
        <div className="fixed bottom-4 right-4 z-[9998] font-mono select-none">
            <AnimatePresence mode="wait" initial={false}>
                {!open ? (
                    /* ───────── Collapsed: status tab ───────── */
                    <motion.button
                        key="tab"
                        type="button"
                        onClick={() => setOpen(true)}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-950/90 py-2 pl-2.5 pr-3.5 shadow-2xl shadow-black/40 backdrop-blur-md hover:border-white/20"
                        aria-label="Open flow switcher"
                    >
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span
                                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                                style={{ backgroundColor: isBre ? "#25B181" : "#60a5fa" }}
                            />
                            <span
                                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: isBre ? "#25B181" : "#60a5fa" }}
                            />
                        </span>
                        <span className="flex flex-col items-start leading-none">
                            <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500">
                                Flow
                            </span>
                            <span className="mt-0.5 text-[11px] font-semibold tracking-tight text-slate-100">
                                {active.label}
                            </span>
                        </span>
                        <ChevronUp className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:text-slate-300" />
                    </motion.button>
                ) : (
                    /* ───────── Expanded: console panel ───────── */
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        className="relative w-[290px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
                    >
                        {/* top accent hairline */}
                        <div
                            className="h-px w-full transition-colors"
                            style={{
                                background: isBre
                                    ? "linear-gradient(90deg, transparent, #25B181, transparent)"
                                    : "linear-gradient(90deg, transparent, #60a5fa, transparent)",
                            }}
                        />
                        {/* grain / dot texture */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(#fff 1px, transparent 1px)",
                                backgroundSize: "14px 14px",
                            }}
                        />

                        <div className="relative p-3.5">
                            {/* header */}
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Workflow className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400">
                                        Application Flow
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-200"
                                    aria-label="Collapse flow switcher"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            {/* segmented toggle */}
                            <div className="relative grid grid-cols-2 gap-1 rounded-xl border border-white/5 bg-black/40 p-1">
                                {MODES.map(({ mode: m, icon: Icon }) => {
                                    const selected = m === mode;
                                    const meta = FLOW_MODE_META[m];
                                    const accent = m === "BRE_DECISION" ? "#25B181" : "#60a5fa";
                                    return (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setMode(m)}
                                            className="relative z-10 flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-center transition-colors"
                                        >
                                            {selected && (
                                                <motion.span
                                                    layoutId="flow-active-pill"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 420,
                                                        damping: 34,
                                                    }}
                                                    className="absolute inset-0 -z-10 rounded-lg border"
                                                    style={{
                                                        borderColor: `${accent}55`,
                                                        backgroundColor: `${accent}1f`,
                                                        boxShadow: `0 0 22px -6px ${accent}`,
                                                    }}
                                                />
                                            )}
                                            <Icon
                                                className="h-4 w-4 transition-colors"
                                                style={{ color: selected ? accent : "#94a3b8" }}
                                            />
                                            <span
                                                className="text-[11px] font-semibold tracking-tight transition-colors"
                                                style={{ color: selected ? "#f1f5f9" : "#94a3b8" }}
                                            >
                                                {meta.label}
                                            </span>
                                            <span
                                                className="rounded-full px-1.5 py-px text-[8px] font-bold uppercase tracking-wider transition-colors"
                                                style={{
                                                    color: selected ? accent : "#64748b",
                                                    backgroundColor: selected
                                                        ? `${accent}1a`
                                                        : "transparent",
                                                }}
                                            >
                                                {meta.tag}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* active description */}
                            <p className="mt-3 text-[10.5px] leading-relaxed text-slate-400">
                                {active.description}
                            </p>

                            {/* endpoint readout */}
                            <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/5 bg-black/40 px-2.5 py-2">
                                <span className="text-[9px] uppercase tracking-wider text-slate-600">
                                    Calls
                                </span>
                                <code
                                    className="truncate text-[10px] font-semibold"
                                    style={{ color: isBre ? "#34d399" : "#7dd3fc" }}
                                >
                                    {isBre
                                        ? "→ GET v2/bre/initialize"
                                        : "→ GET v2/finfactorConsentRequest"}
                                </code>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
