import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/refund-cancellation`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Refund and Cancellation Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Refund and Cancellation Policy, including subscription billing, cancellation process via My Account, and payment reflection timelines (up to three business days).",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "refund policy",
        "cancellation policy",
        "refund and cancellation",
        "subscription cancellation",
        "subscription billing",
        "payment gateway",
        "refund timeline",
        "payment reflection time",
        "my account cancellation",
        "Quikkred refund policy",
        "Quikkred cancellation policy",
        "Satsai Finlease refund policy",
        "Satsai Finlease cancellation policy",
        "fintech subscription policy",
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
        title: `Refund and Cancellation Policy | ${SITE_NAME}`,
        description:
            "Quikkred’s policy on refunds and cancellations covering subscription billing, cancellation via My Account, and payment reflection timelines.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Refund and Cancellation Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Refund and Cancellation Policy | ${SITE_NAME}`,
        description:
            "Read Quikkred’s Refund and Cancellation Policy covering billing, cancellations, and payment reflection timelines.",
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

const RefundCancellationLayout = ({ children }: LayoutInterface) => children;
export default RefundCancellationLayout;
