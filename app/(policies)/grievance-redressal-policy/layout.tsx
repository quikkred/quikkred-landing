import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/grievance-redressal-policy";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Grievance Redressal Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Learn about Quikkred’s Grievance Redressal Policy, including support channels, escalation levels, resolution timelines, and RBI Ombudsman escalation for unresolved complaints.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "grievance redressal policy",
        "customer grievance",
        "complaint resolution",
        "customer support",
        "helpdesk",
        "grievance officer",
        "nodal officer",
        "RBI ombudsman",
        "integrated ombudsman scheme",
        "complaint tracking",
        "Quikkred support",
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
        title: "Grievance Redressal Policy | Quikkred",
        description:
            "View Quikkred’s Grievance Redressal Policy with complaint escalation levels, timelines, contact details, and RBI Ombudsman escalation guidance.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Grievance Redressal Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Grievance Redressal Policy | Quikkred",
        description:
            "Complaint escalation levels, timelines, and RBI Ombudsman guidance under Quikkred’s Grievance Redressal Policy.",
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

const GrievanceRedressalPolicyLayout = ({ children }: LayoutInterface) => children;
export default GrievanceRedressalPolicyLayout;
