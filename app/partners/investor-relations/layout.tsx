import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/partners/investor-relations";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ If you create a dedicated OG image for investors, use it.
// Otherwise keep Aboutus_hero_image.jpg
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Investor Relations",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Explore Quikkred Investor Relations—investment highlights, governance and compliance, and our technology-first approach to building a transparent lending platform. Contact our team for investor inquiries and updates.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred investor relations",
        "invest in Quikkred",
        "fintech investment India",
        "NBFC platform",
        "financial performance",
        "corporate governance",
        "RBI compliance",
        "risk management",
        "technology-first underwriting",
        "growth trajectory",
        "investor presentation",
        "annual report",
        "quarterly results",
        "financial statements",
        "investor contact",
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
        title: "Investor Relations | Quikkred",
        description:
            "Discover Quikkred’s investment highlights, governance and compliance, and technology-first strategy. Reach out for investor inquiries and the latest updates.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Investor Relations - Highlights, compliance and growth",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Investor Relations | Quikkred",
        description:
            "Investment highlights, compliance and governance, and a technology-first lending strategy. Contact Quikkred for investor inquiries.",
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

const InvestorRelationsLayout = ({ children }: LayoutInterface) => children;
export default InvestorRelationsLayout;
