import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/channel-partner";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ If you have a dedicated image for channel partner page, use it.
// Otherwise keep Aboutus_hero_image.jpg
const OG_IMAGE = `${SITE_URL}/Partners_our_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Channel Partner Program",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Become a Quikkred Channel Partner and earn attractive commissions on loans disbursed. Get a real-time dashboard, dedicated support, training & certification, pan-India coverage, and transparent performance bonuses.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred channel partner",
        "channel partner program",
        "DSA partner",
        "loan agent program",
        "loan referral program",
        "fintech partnership India",
        "earn commission on loans",
        "loan commission structure",
        "weekly payouts",
        "partner dashboard",
        "partner training certification",
        "pan India lending partner",
        "zero investment partner program",
        "Quikkred partner support",
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
        title: "Become a Quikkred Channel Partner | Earn Commissions",
        description:
            "Join Quikkred’s Channel Partner program to earn commissions on loans disbursed with transparent bonuses. Real-time dashboard, dedicated support, training & certification, and pan-India coverage.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Channel Partner Program - Earn commissions with support and dashboard",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Quikkred Channel Partner Program",
        description:
            "Earn commissions on loans disbursed with Quikkred’s Channel Partner program—dashboard, support, training, and transparent bonuses.",
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

const ChannelPartnerLayout = ({ children }: LayoutInterface) => children;
export default ChannelPartnerLayout;
