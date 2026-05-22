import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/our-partners";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ Better OG image for this page (ensure it exists in /public)
const OG_IMAGE = `${SITE_URL}/Partners_our_image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Partner With Quikkred",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Partner with Quikkred and grow with India’s AI-powered fintech platform. Choose a partnership path—Channel Partner or Investor Relations—and get access to a trusted, RBI-compliant, technology-first ecosystem with dedicated support.",

  applicationName: SITE_NAME,
  category: "Finance",

  keywords: [
    "Quikkred partners",
    "partner with Quikkred",
    "channel partner",
    "fintech partnership",
    "loan partner program",
    "DSA partner",
    "lending partner",
    "investor relations fintech",
    "fintech investment India",
    "RBI compliant fintech",
    "NBFC partnership",
    "technology-first lending",
    "partner support",
    "grow with Quikkred",
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
    title: "Partner With Quikkred | Channel Partner & Investor Relations",
    description:
      "Grow with Quikkred. Choose a partnership path—Channel Partner or Investor Relations—backed by a trusted, RBI-compliant, technology-first platform and dedicated support.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Partner With Quikkred - Channel Partners and Investor Relations",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Partner With Quikkred",
    description:
      "Choose a partnership path with Quikkred—Channel Partner or Investor Relations. Join a trusted fintech platform with strong compliance and support.",
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

  themeColor: "#0A0A0A",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const PartnersLayout = ({ children }: LayoutInterface) => children;
export default PartnersLayout;
