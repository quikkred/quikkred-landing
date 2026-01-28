import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/apply`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Apply for a Loan",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Apply for a short-term loan online with Quikkred. Get instant approval experience, transparent fees (interest, platform fee & GST), minimal documents (PAN & Aadhaar), and quick disbursal directly to your bank account.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "apply for loan",
        "loan apply online",
        "short-term loan",
        "urgent loan",
        "instant approval loan",
        "quick disbursal",
        "digital loan application",
        "loan application India",
        "PAN Aadhaar loan",
        "KYC verification",
        "loan eligibility",
        "personal loan apply",
        "short tenure loan",
        "one-time repayment loan",
        "transparent fees",
        "platform fee",
        "GST on fees",
        "Quikkred apply",
        "Quikkred loan application",
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
        title: `Apply for a Loan | ${SITE_NAME}`,
        description:
            "Apply online for a short-term loan with Quikkred. Instant approval experience, PAN & Aadhaar KYC, transparent fees, and direct bank disbursal.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Apply for a Loan",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Apply for a Loan | ${SITE_NAME}`,
        description:
            "Apply online for a short-term loan with Quikkred. Transparent charges, minimal documents, and quick disbursal to your bank.",
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

const ApplyLayout = ({ children }: LayoutInterface) => children;
export default ApplyLayout;
