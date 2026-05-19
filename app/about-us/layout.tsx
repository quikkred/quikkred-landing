import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/about-us";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "About Quikkred",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Learn about Quikkred — an AI-powered digital lending platform focused on making credit accessible, affordable, and transparent across India. Discover our story, mission, vision, values, and how to reach us.",

  applicationName: SITE_NAME,
  category: "Finance",

  keywords: [
    "About Quikkred",
    "Quikkred company",
    "AI-powered lending platform",
    "digital lending India",
    "fintech India",
    "loan platform India",
    "financial inclusion",
    "transparent lending",
    "instant loan assessment",
    "RBI registered NBFC partner",
    "Satsai Finlease Private Limited",
    "customer-first fintech",
    "Pan India lending",
    "Quikkred contact",
    "Quikkred support",
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
    title: "About Quikkred | AI-Powered Digital Lending Platform",
    description:
      "Quikkred is an AI-powered digital lending platform committed to accessible, affordable, and transparent credit for every Indian. Explore our story, mission, vision, values, and contact details.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "About Quikkred - AI-powered digital lending in India",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Quikkred | AI-Powered Digital Lending Platform",
    description:
      "Discover Quikkred’s story, mission, vision, and values — building accessible and transparent credit experiences across India.",
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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About Us",
      item: PAGE_URL,
    },
  ],
};

const AboutUsLayout = ({ children }: LayoutInterface) => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
    {children}
  </>
);
export default AboutUsLayout;
