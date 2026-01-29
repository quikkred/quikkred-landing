import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/collection-policy";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Debt Collection Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Debt Collection Policy outlining fair and ethical recovery practices, communication standards, agent training, grievance redressal, and prohibited conduct.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "collection policy",
        "debt collection policy",
        "debt recovery",
        "loan recovery",
        "fair practices code",
        "RBI guidelines",
        "collection agents",
        "borrower privacy",
        "grievance redressal",
        "ethical collections",
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
        title: "Debt Collection Policy | Quikkred",
        description:
            "Fair and ethical debt recovery practices by Quikkred, including communication standards, training requirements, grievance handling, and prohibited conduct.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Debt Collection Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Debt Collection Policy | Quikkred",
        description:
            "Fair and ethical debt recovery practices by Quikkred, including communication standards, training requirements, grievance handling, and prohibited conduct.",
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

const CollectionPolicyLayout = ({ children }: LayoutInterface) => children;
export default CollectionPolicyLayout;
