import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/disclaimer-disclosure`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Disclaimer and Disclosure",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Disclaimer and Disclosure for users, including alerts about impersonation/scams, confirmation that no upfront fees are charged for loans, guidance to not share OTPs/passwords, and responsibility limitations.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "disclaimer",
        "disclosure",
        "disclaimer and disclosure",
        "Quikkred disclaimer",
        "Quikkred disclosure",
        "loan scam warning",
        "fake loan agents",
        "no upfront fees",
        "upfront fee fraud",
        "OTP fraud",
        "do not share OTP",
        "password safety",
        "phishing warning",
        "impersonation alert",
        "fraud awareness",
        "customer safety",
        "Satsai Finlease disclaimer",
        "Satsai Finlease disclosure",
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
        title: `Disclaimer and Disclosure | ${SITE_NAME}`,
        description:
            "Quikkred’s Disclaimer and Disclosure with scam/impersonation warnings, OTP/password safety guidance, and responsibility limitations for third-party fraud.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Disclaimer and Disclosure",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Disclaimer and Disclosure | ${SITE_NAME}`,
        description:
            "Read Quikkred’s Disclaimer and Disclosure: scam warnings, no-upfront-fee notice, OTP/password safety, and responsibility limitations.",
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

const DisclaimerDisclosureLayout = ({ children }: LayoutInterface) => children;
export default DisclaimerDisclosureLayout;
