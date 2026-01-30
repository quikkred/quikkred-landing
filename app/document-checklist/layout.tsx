import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/document-checklist";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Document Checklist",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "View Quikkred’s document checklist for a smooth loan application. All documents are secured with encryption and handled as per our Privacy Policy and applicable RBI-related guidelines.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred document checklist",
        "loan document checklist",
        "KYC documents",
        "loan KYC",
        "identity proof",
        "address proof",
        "income proof",
        "bank statement for loan",
        "salary slip for loan",
        "loan application documents",
        "required documents for loan",
        "RBI compliance",
        "secure document upload",
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
        title: "Document Checklist | Quikkred",
        description:
            "Check the required documents for your Quikkred loan application. Documents are secured with encryption and handled as per our Privacy Policy and applicable guidelines.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Document Checklist - Secure document requirements for loan application",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Document Checklist | Quikkred",
        description:
            "View Quikkred’s document checklist for a smooth loan application. Secure handling with encryption and applicable guidelines.",
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

const DocumentChecklistLayout = ({ children }: LayoutInterface) => children;
export default DocumentChecklistLayout;
