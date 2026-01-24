import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/about-us/our-story";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ Use story image for OG if available
const OG_IMAGE = `${SITE_URL}/about_story_img.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Our Story",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Discover the story behind Quikkred—built to make credit accessible to every Indian using technology and AI-driven assessment. Learn about our mission, journey, NBFC partnership with Satsai Finlease Private Limited, and our customer-first values.",

  applicationName: SITE_NAME,
  category: "Finance",

  keywords: [
    "Quikkred our story",
    "about Quikkred",
    "digital lending platform",
    "AI powered lending",
    "financial inclusion India",
    "instant loan approval",
    "credit access India",
    "Satsai Finlease Private Limited",
    "RBI registered NBFC partner",
    "customer first fintech",
    "Quikkred mission vision values",
    "fintech journey",
    "Quikkred pan India",
    "28 states presence",
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
    title: "Our Story | Quikkred",
    description:
      "From a vision to a trusted digital lending platform—see how Quikkred is making credit accessible across India with AI and transparent lending.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Quikkred Our Story - Mission, journey and customer-first values",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Our Story | Quikkred",
    description:
      "Learn how Quikkred started and how we’re building accessible, transparent credit across India using AI-driven assessment.",
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
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const OurStoryLayout = ({ children }: LayoutInterface) => children;
export default OurStoryLayout;
