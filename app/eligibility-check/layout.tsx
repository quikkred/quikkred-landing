import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred"; // change if needed
const SITE_URL = "https://quikkred.in"; // ✅ change to your domain
const PAGE_URL = `${SITE_URL}/eligibility-check`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`; // ✅ create this image (1200x630)

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Check Your Eligibility",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Check your loan eligibility instantly with our AI-powered assessment. No impact on your credit score. 100% free and secure.",

  applicationName: SITE_NAME,
  category: "Finance",

  keywords: [
    "eligibility check",
    "loan eligibility",
    "instant eligibility",
    "AI eligibility check",
    "personal loan eligibility",
    "credit eligibility",
    "eligibility calculator",
    "check eligibility online",
  ],

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Check Your Eligibility",
    description:
      "Get instant eligibility results with our AI-powered assessment. No credit score impact. Completely free.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Check Your Eligibility - Instant AI Assessment",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Check Your Eligibility",
    description:
      "Instant eligibility results with AI-powered assessment. No credit score impact. Free & secure.",
    images: [OG_IMAGE],
  },

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  themeColor: "#0A0A0A", // change to your brand color
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const EligibilityCheckLayout = ({ children }: LayoutInterface) => children;
export default EligibilityCheckLayout;
