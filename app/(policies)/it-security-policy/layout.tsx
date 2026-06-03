import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/it-security-policy`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "IT and Information Security Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s IT and Information Security Policy covering information security management, data classification, access control, encryption, acceptable use, remote access & MDM, incident management, backup & disaster recovery, roles and responsibilities, and compliance.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "IT security policy",
        "information security policy",
        "Quikkred IT security policy",
        "data classification",
        "access control",
        "least privilege",
        "multi factor authentication",
        "MFA",
        "encryption",
        "TLS 1.2",
        "AES-256",
        "acceptable use policy",
        "AUP",
        "remote access policy",
        "VPN policy",
        "mobile device management",
        "MDM",
        "BYOD policy",
        "incident management",
        "security incident response",
        "data backup policy",
        "disaster recovery plan",
        "DRP",
        "RTO",
        "RPO",
        "RBI guidelines NBFC",
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
        title: `IT and Information Security Policy | ${SITE_NAME}`,
        description:
            "Quikkred’s policy for protecting data and systems, including data classification, access control, encryption, acceptable use, remote access/MDM, incident response, backup & disaster recovery, and compliance.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred IT and Information Security Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `IT and Information Security Policy | ${SITE_NAME}`,
        description:
            "Read Quikkred’s IT and Information Security Policy for protecting data and systems, including access control, encryption, remote access, incident response, and compliance.",
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

const ItSecurityPolicyLayout = ({ children }: LayoutInterface) => children;
export default ItSecurityPolicyLayout;
