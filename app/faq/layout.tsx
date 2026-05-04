import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/faq`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Frequently Asked Questions",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Search Quikkred's full FAQ knowledge base across fees, process, eligibility, tenure, documents, compliance and security. Get instant answers about loan amounts, interest rates, approval time, and more.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred FAQ",
        "frequently asked questions",
        "loan FAQ",
        "loan amount range",
        "interest rates",
        "loan approval time",
        "eligibility criteria",
        "loan tenure",
        "documents required",
        "compliance",
        "security",
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
        title: `Frequently Asked Questions | ${SITE_NAME}`,
        description:
            "Search our full knowledge base across fees, process, eligibility, tenure, documents, compliance and security.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred FAQ",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Frequently Asked Questions | ${SITE_NAME}`,
        description:
            "Search our full knowledge base across fees, process, eligibility, tenure, documents, compliance and security.",
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

const FaqLayout = ({ children }: LayoutInterface) => children;
export default FaqLayout;
