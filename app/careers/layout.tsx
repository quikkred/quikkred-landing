import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/careers";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ If you make a careers OG image later, replace this.
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Careers",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Join Quikkred and help millions access financial services. Explore open positions, learn about our values and benefits, and apply to build the future of financial inclusion.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred careers",
        "jobs at Quikkred",
        "fintech jobs India",
        "software developer jobs",
        "frontend developer jobs",
        "backend developer jobs",
        "full stack developer jobs",
        "product jobs fintech",
        "operations jobs fintech",
        "sales jobs fintech",
        "customer support jobs",
        "work at Quikkred",
        "open positions Quikkred",
        "financial inclusion careers",
        "AI fintech careers",
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
        title: "Careers at Quikkred | Build Financial Inclusion",
        description:
            "Explore careers at Quikkred. Work with cutting-edge technology, grow with a mission-driven team, and make a real impact on financial inclusion in India.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Careers at Quikkred - Build the future of financial inclusion",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Careers at Quikkred",
        description:
            "Join Quikkred to build the future of financial inclusion. View open roles and apply.",
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

const CareersLayout = ({ children }: LayoutInterface) => children;
export default CareersLayout;
