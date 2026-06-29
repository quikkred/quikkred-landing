"use client";

// Full 30-rung interactive ladder. The centerpiece of the page.
// Each rung represents a day; over-pay days widen the bar.
// Hover/tap a rung to see how far along the journey you are.

import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { CalendarDays, Sparkles, TrendingUp, Flag } from "lucide-react";

const TENURE = 30;

// 30-day mix — most days = steady, a few over-pay days, no misses
const PATTERN = [
  1.0, 1.0, 1.4, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.2,
  1.0, 1.0, 1.0, 1.6, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
  1.0, 1.3, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
];

export function InteractiveLadder() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  // Cumulative share of the journey completed, expressed as % — no money math
  const progress = useMemo(() => {
    const totalW = PATTERN.reduce((a, b) => a + b, 0);
    let sum = 0;
    return PATTERN.map((w) => {
      sum += w;
      return Math.min(100, Math.round((sum / totalW) * 100));
    });
  }, []);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-16 sm:py-20 lg:py-24 bg-slate-950 text-white overflow-hidden"
    >
      {/* Atmospheric */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(50% 40% at 20% 0%, rgba(37,177,129,0.18), transparent 60%), radial-gradient(50% 60% at 100% 100%, rgba(99,102,241,0.16), transparent 60%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-300 font-semibold">
            The model · full 30 days
          </div>
          <h2 className="mt-3 font-sora font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Climb the ladder, day by day.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Each rung is a single day. The wider the bar, the more you paid that day. Hover any rung to see how far along you are — over-pay any day, and you shorten the journey.
          </p>
        </motion.div>

        {/* Progress rail at the top */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
          <StatTile k="Tenure" v={`${TENURE} days`} icon={CalendarDays} accent="emerald" />
          <StatTile k="Rungs" v={`${TENURE} rungs`} icon={Sparkles} accent="indigo" />
          <StatTile k="You pay" v="A little, daily" icon={TrendingUp} accent="emerald" />
          <StatTile
            k={hoverDay != null ? `Day ${hoverDay}` : "Over-pay to"}
            v={hoverDay != null ? `${progress[hoverDay - 1]}% climbed` : "Finish early"}
            icon={Flag}
            accent="indigo"
            live
          />
        </div>

        {/* The rungs */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 lg:p-8 backdrop-blur">
          <div className="space-y-1.5">
            {PATTERN.map((width, idx) => {
              const day = idx + 1;
              const isOver = width > 1.0;
              const isHovered = hoverDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onMouseEnter={() => setHoverDay(day)}
                  onMouseLeave={() => setHoverDay(null)}
                  onFocus={() => setHoverDay(day)}
                  onBlur={() => setHoverDay(null)}
                  onTouchStart={() => setHoverDay(day)}
                  aria-label={`Day ${day}: ${isOver ? "over-pay day" : "steady day"} — ${progress[idx]}% of the way`}
                  className="group flex items-center gap-2 sm:gap-3 w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 rounded-md"
                >
                  <span
                    className={`w-8 sm:w-10 text-[10px] sm:text-xs font-mono tabular-nums shrink-0 transition-colors ${
                      isHovered ? "text-emerald-300" : "text-slate-500"
                    }`}
                  >
                    D{day < 10 ? `0${day}` : day}
                  </span>
                  <div className="flex-1 h-3 sm:h-3.5 rounded-full bg-white/5 overflow-hidden relative">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{
                        duration: 0.65,
                        delay: 0.05 + idx * 0.018,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        transformOrigin: "left",
                        width: `${Math.min(width, 2.0) * 50}%`,
                      }}
                      className={`h-full rounded-full ${
                        isOver
                          ? "bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#a5b4fc]"
                          : "bg-gradient-to-r from-[#0d8b65] to-[#25B181]"
                      } transition-shadow ${isHovered ? "shadow-[0_0_24px_rgba(52,211,153,0.55)]" : ""}`}
                    />
                    {isOver && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] sm:text-[9px] font-bold text-white tracking-wider">
                        OVER
                      </span>
                    )}
                  </div>
                  <span
                    className={`w-16 sm:w-20 text-[10px] sm:text-xs font-mono tabular-nums shrink-0 text-right transition-colors ${
                      isHovered ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {isOver ? "over-pay" : "steady"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-mono tabular-nums border-t border-white/10 pt-4">
            <span>Pay the daily amount · <span className="text-slate-200">finish in 30 days</span></span>
            <span>Over-pay on good days · <span className="text-emerald-300">finish ahead of schedule</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatTile({
  k, v, icon: Icon, accent, live,
}: {
  k: string; v: string; icon: any; accent: "emerald" | "indigo"; live?: boolean;
}) {
  const cls = accent === "emerald" ? "text-emerald-300 bg-emerald-400/10" : "text-indigo-300 bg-indigo-400/10";
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 ${live ? "ring-1 ring-emerald-400/30" : ""}`}>
      <div className="flex items-center gap-2">
        <span className={`h-7 w-7 rounded-md grid place-items-center ${cls}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-semibold">{k}</div>
      </div>
      <div className="mt-2 font-sora font-bold text-lg sm:text-xl">{v}</div>
    </div>
  );
}
