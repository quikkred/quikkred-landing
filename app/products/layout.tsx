import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/products";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ Use a products OG image if you have (recommended)
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Loan Products",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Explore Quikkred’s loan products with transparent pricing, flexible tenure, and quick approvals. Compare amount ranges, interest rates, processing fees, eligibility criteria, and apply online in minutes.",

  applicationName: SITE_NAME,
  category: "Finance",

  keywords: [
    "Quikkred products",
    "loan products",
    "instant loan",
    "personal loan online",
    "short-term loan India",
    "digital lending India",
    "AI powered lending",
    "quick loan approval",
    "loan eligibility",
    "loan interest rate",
    "processing fee",
    "loan tenure",
    "apply loan online",
    "secure loan platform",
    "RBI NBFC partner",
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
    title: "Loan Products | Compare & Apply Online",
    description:
      "Compare Quikkred loan products—amount range, tenure, interest rate, processing fee, and eligibility. Apply online with a fast, secure, AI-powered journey.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Quikkred Loan Products - Compare and Apply Online",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Loan Products | Compare & Apply Online",
    description:
      "Explore and compare Quikkred loan products. Transparent pricing, flexible tenure, and quick approvals. Apply online in minutes.",
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

const ProductsLayout = ({ children }: LayoutInterface) => children;
export default ProductsLayout;
