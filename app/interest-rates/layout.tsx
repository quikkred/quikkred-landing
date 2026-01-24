import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/interest-rates";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ If you create a dedicated OG image for rates, replace this
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Interest Rates & Charges",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "View Quikkred interest rates and charges with transparent pricing and no hidden fees. Compare rates by loan product, understand processing fees and GST, and learn the factors that affect your final interest rate.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred interest rates",
        "interest rates and charges",
        "loan interest rate",
        "personal loan interest rate",
        "loan processing fee",
        "GST on loan charges",
        "transparent pricing",
        "no hidden charges",
        "loan rate factors",
        "credit profile evaluation",
        "AI underwriting",
        "loan eligibility and rate",
        "compare loan rates",
        "loan charges India",
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
        title: "Interest Rates & Charges | Quikkred",
        description:
            "See Quikkred’s transparent interest rates and charges—compare products, understand fees and GST, and learn what impacts your final rate.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Interest Rates & Charges - Transparent pricing with no hidden fees",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Interest Rates & Charges | Quikkred",
        description:
            "Transparent interest rates and charges—compare products, fees, GST, and factors affecting your final rate.",
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

const InterestRatesLayout = ({ children }: LayoutInterface) => children;
export default InterestRatesLayout;
