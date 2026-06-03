import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/investment-policy`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Investment Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read the Investment Policy outlining guidelines for investing and managing idle funds, including permitted instruments, investment classification, limits (up to 5x net worth), procedures, delegation of authority, reporting requirements, and annual reviews.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "investment policy",
        "fund management policy",
        "idle funds investment",
        "investment guidelines",
        "asset allocation",
        "fixed deposits",
        "certificates of deposit",
        "money market funds",
        "liquid funds",
        "market linked securities",
        "investment limits",
        "net worth limit",
        "5 times net worth",
        "board approval for investments",
        "delegation of authority",
        "quarterly investment reporting",
        "annual portfolio review",
        "Satsai Finlease investment policy",
        "Quikkred investment policy",
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
        title: `Investment Policy | ${SITE_NAME}`,
        description:
            "Investment Policy for managing idle funds, covering approved instruments, limits (up to 5x net worth), procedures, delegation of authority, and quarterly/annual reporting.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Investment Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Investment Policy | ${SITE_NAME}`,
        description:
            "Read the Investment Policy on investing and managing idle funds, including permitted instruments, limits, procedures, and reporting.",
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

const InvestmentPolicyLayout = ({ children }: LayoutInterface) => children;
export default InvestmentPolicyLayout;
