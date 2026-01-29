import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/resources/faqs`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Frequently Asked Questions",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Find instant answers to common questions about Quikkred loan services—eligibility, documents, repayment, charges, security, account help, and application tracking. Use search and filters to quickly get what you need.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred FAQs",
        "frequently asked questions",
        "loan FAQs",
        "instant loan FAQs",
        "eligibility criteria",
        "documents required",
        "loan repayment",
        "EMI payment",
        "interest rates and charges",
        "loan amount limits",
        "loan approval time",
        "track loan application",
        "data security",
        "account help",
        "self employed loan",
        "low credit score loan",
        "customer support",
        "loan support India",
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
            "Find instant answers to common questions about our loan services—eligibility, documents, repayment, charges, security, and more.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred FAQs",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Frequently Asked Questions | ${SITE_NAME}`,
        description:
            "Find instant answers to common questions about Quikkred loan services—eligibility, documents, repayment, charges, security, and more.",
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

const FaqsLayout = ({ children }: LayoutInterface) => children;
export default FaqsLayout;
