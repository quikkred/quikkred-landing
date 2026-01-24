import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/kyc-aml-policy";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "KYC & AML Policy",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Read Quikkred’s Know Your Customer (KYC) and Anti-Money Laundering (AML) Policy, including customer due diligence, monitoring, record management, reporting obligations, and compliance framework aligned with applicable RBI and PMLA requirements.",

  applicationName: SITE_NAME,
  category: "Finance",

  keywords: [
    "KYC policy",
    "AML policy",
    "KYC AML policy",
    "Know your customer",
    "anti money laundering",
    "RBI KYC directions",
    "PMLA compliance",
    "customer due diligence",
    "CDD",
    "V-CIP",
    "video KYC",
    "digital KYC",
    "CKYCR",
    "FIU-IND reporting",
    "suspicious transaction report",
    "CTR",
    "STR",
    "Quikkred KYC",
    "Satsai Finlease KYC",
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
    title: "KYC & AML Policy | Quikkred",
    description:
      "View Quikkred’s KYC & AML Policy covering customer identification, due diligence, monitoring, recordkeeping, and reporting in line with applicable RBI and PMLA requirements.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Quikkred KYC & AML Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "KYC & AML Policy | Quikkred",
    description:
      "Read Quikkred’s KYC & AML Policy covering due diligence, monitoring, record management, and reporting obligations.",
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

const KycAmlPolicyLayout = ({ children }: LayoutInterface) => children;
export default KycAmlPolicyLayout;
