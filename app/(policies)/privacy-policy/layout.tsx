import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/privacy-policy`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Privacy Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Learn how Quikkred collects, stores, uses, discloses, transfers, and protects your Personal Information and Sensitive Personal Information across our websites, apps, and partner platforms.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "privacy policy",
        "Quikkred privacy policy",
        "personal information",
        "sensitive personal information",
        "data protection",
        "data security",
        "data processing",
        "information collection",
        "consent",
        "mobile app privacy",
        "website privacy",
        "fintech privacy",
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
        title: "Privacy Policy | Quikkred",
        description:
            "Understand how Quikkred handles your Personal Information and Sensitive Personal Information when you use our websites, apps, and partner platforms, and the safeguards we apply.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Privacy Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | Quikkred",
        description:
            "Understand how Quikkred handles your Personal Information and Sensitive Personal Information when you use our websites, apps, and partner platforms, and the safeguards we apply.",
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

const PrivacyPolicyLayout = ({ children }: LayoutInterface) => children;
export default PrivacyPolicyLayout;
