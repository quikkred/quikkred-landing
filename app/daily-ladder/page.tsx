import type { Metadata } from "next";
import { LadderHero } from "@/components/daily-ladder/LadderHero";
import { InteractiveLadder } from "@/components/daily-ladder/InteractiveLadder";
import { Pillars } from "@/components/daily-ladder/Pillars";
import { VersusBullet } from "@/components/daily-ladder/VersusBullet";
import { StoryTimeline } from "@/components/daily-ladder/StoryTimeline";
import { MathAndTrust } from "@/components/daily-ladder/MathAndTrust";
import { FAQ } from "@/components/daily-ladder/FAQ";
import { ClosingCTA } from "@/components/daily-ladder/ClosingCTA";

export const metadata: Metadata = {
  title: "The Daily Ladder · India's Lending Innovation 2026 | Quikkred",
  description:
    "30 days, 30 rungs. Pay a little every day, see your repayment in real-time. Reducing-balance interest, zero prepayment penalty, capital recycles every 15 days. India's first daily-ladder loan product.",
  keywords: [
    "daily ladder loan",
    "quikkred daily ladder",
    "instant personal loan India",
    "daily repayment loan",
    "reducing balance loan",
    "NBFC daily ladder",
  ],
  openGraph: {
    title: "The Daily Ladder · India's Lending Innovation 2026",
    description:
      "Pay a little every day. Capital comes back in 24 hours, not 24 days. India's first daily-ladder loan product.",
    type: "website",
    url: "https://quikkred.in/daily-ladder",
    siteName: "Quikkred",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Daily Ladder · Quikkred",
    description:
      "Pay a little every day, see your repayment in real-time. 30 days. 30 rungs.",
  },
  alternates: { canonical: "https://quikkred.in/daily-ladder" },
};

export default function DailyLadderPage() {
  return (
    <main>
      <LadderHero />
      <InteractiveLadder />
      <Pillars />
      <VersusBullet />
      <StoryTimeline />
      <MathAndTrust />
      <FAQ />
      <ClosingCTA />
    </main>
  );
}
