import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/cookie-policy`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Cookie Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Cookie Policy explaining what cookies are, how we use them on our website and app, the types of cookies (essential, functional, analytics, marketing), third-party cookies, cookie duration, and how you can manage your preferences.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "cookie policy",
        "Quikkred cookie policy",
        "cookies",
        "tracking technologies",
        "cookie consent",
        "cookie consent banner",
        "essential cookies",
        "functional cookies",
        "analytics cookies",
        "marketing cookies",
        "third-party cookies",
        "Google Analytics cookies",
        "Google Ads cookies",
        "Facebook Pixel cookies",
        "session cookies",
        "persistent cookies",
        "manage cookies",
        "browser cookie settings",
        "opt out Google Analytics",
        "privacy and cookies",
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
        title: `Cookie Policy | ${SITE_NAME}`,
        description:
            "Quikkred’s Cookie Policy covering cookie types, third-party cookies, cookie duration, and how to manage cookie preferences.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Cookie Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Cookie Policy | ${SITE_NAME}`,
        description:
            "Read Quikkred’s Cookie Policy covering cookie types, third-party cookies, and how to manage your cookie preferences.",
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

const CookiePolicyLayout = ({ children }: LayoutInterface) => children;
export default CookiePolicyLayout;
