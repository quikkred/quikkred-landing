import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/resources`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Financial Literacy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Empower yourself with financial knowledge. Explore Quikkred’s free financial literacy resources—budgeting, smart borrowing, savings & investments, financial planning, digital finance, risk management, and calculators like EMI and loan eligibility.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "financial literacy",
        "Quikkred resources",
        "money management",
        "personal finance basics",
        "monthly budget",
        "salary slip",
        "emergency fund",
        "smart borrowing",
        "interest rates",
        "EMI",
        "credit score",
        "loan default prevention",
        "savings",
        "investing",
        "compound interest",
        "investment options India",
        "tax saving instruments",
        "financial planning",
        "retirement planning",
        "insurance basics",
        "UPI safety",
        "online banking security",
        "financial fraud prevention",
        "risk management",
        "EMI calculator",
        "loan eligibility calculator",
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
        title: `Financial Literacy | ${SITE_NAME}`,
        description:
            "Learn to manage money wisely with Quikkred’s free financial literacy resources, practical tips, and tools like EMI and loan eligibility calculators.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Financial Literacy Resources",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Financial Literacy | ${SITE_NAME}`,
        description:
            "Explore Quikkred’s financial literacy hub—tips, learning topics, safety guidance, and calculators.",
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

const ResourcesLayout = ({ children }: LayoutInterface) => children;
export default ResourcesLayout;
