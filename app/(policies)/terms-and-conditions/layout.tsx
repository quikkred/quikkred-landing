import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/terms-and-conditions`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Terms & Conditions",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Terms & Conditions covering eligibility criteria, loan terms (interest rates, platform fees, prepayment), privacy and security, default and recovery, dispute resolution, amendments, and contact information.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "terms and conditions",
        "Quikkred terms and conditions",
        "loan terms",
        "eligibility criteria",
        "interest rates",
        "platform fees",
        "prepayment",
        "privacy and security",
        "default and recovery",
        "dispute resolution",
        "arbitration",
        "grievance redressal",
        "RBI guidelines",
        "NBFC loan terms",
        "Quikkred policy",
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
        title: `Terms & Conditions | ${SITE_NAME}`,
        description:
            "Quikkred’s Terms & Conditions for using its services, including eligibility, loan terms, privacy & security practices, default & recovery framework, dispute resolution, amendments, and contact details.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Terms & Conditions",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Terms & Conditions | ${SITE_NAME}`,
        description:
            "Read Quikkred’s Terms & Conditions including eligibility, loan terms, privacy & security, default & recovery, dispute resolution, amendments, and contact details.",
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

const TermsAndConditionsLayout = ({ children }: LayoutInterface) => children;
export default TermsAndConditionsLayout;
