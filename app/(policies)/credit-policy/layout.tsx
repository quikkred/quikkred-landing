import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/credit-policy`; // ✅ update route as per your page
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Credit Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred's Credit Policy framework covering credit origination, underwriting controls, risk management, portfolio diversification, liquidity stability, and regulatory compliance under RBI guidelines.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "credit policy",
        "NBFC credit policy",
        "loan underwriting",
        "risk management policy",
        "portfolio diversification",
        "liquidity risk",
        "RBI compliance",
        "RBI master directions",
        "payday loan policy",
        "loan against property policy",
        "EMI retail loans policy",
        "corporate business loans policy",
        "prudential norms",
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
        title: `Credit Policy | ${SITE_NAME}`,
        description:
            "Read Quikkred's Credit Policy framework covering origination, underwriting, risk controls, portfolio diversification, and compliance with RBI prudential norms.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Credit Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Credit Policy | ${SITE_NAME}`,
        description:
            "Read Quikkred's Credit Policy framework covering origination, underwriting, risk controls, portfolio diversification, and compliance with RBI prudential norms.",
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

const CreditPolicyLayout = ({ children }: LayoutInterface) => children;
export default CreditPolicyLayout;
