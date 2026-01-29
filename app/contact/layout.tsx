import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/contact`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Contact Us",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Contact Quikkred for support, loan application help, or general queries. Reach us via email or phone, or visit our office address. We’re here to assist you with a fast and secure customer support experience.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred contact",
        "contact Quikkred",
        "customer support",
        "loan support",
        "loan application help",
        "track application help",
        "grievance support",
        "helpdesk",
        "email support",
        "phone support",
        "customer care",
        "Quikkred address",
        "contact details",
        "support team",
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
        title: `Contact Us | ${SITE_NAME}`,
        description:
            "Get in touch with Quikkred for support and queries. Contact us by email or phone, or visit our office address.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Contact Quikkred",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Contact Us | ${SITE_NAME}`,
        description:
            "Contact Quikkred for support, loan application help, or general queries.",
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

const ContactLayout = ({ children }: LayoutInterface) => children;
export default ContactLayout;
