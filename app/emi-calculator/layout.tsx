import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/emi-calculator";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

// ✅ If you create a dedicated OG image for calculator, replace this.
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "EMI Calculator",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Use Quikkred’s EMI Calculator to estimate loan repayment, interest, total payable, and the disbursed amount after platform fees. Get an instant visual breakdown and apply online in minutes.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "EMI calculator",
        "loan calculator",
        "personal loan EMI calculator",
        "EMI calculation",
        "loan repayment calculator",
        "interest calculator",
        "disbursed amount calculator",
        "loan breakdown",
        "loan tenure calculator",
        "loan amount calculator",
        "instant loan calculation",
        "Quikkred EMI calculator",
        "apply loan online",
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
        title: "EMI Calculator | Loan Repayment & Disbursed Amount",
        description:
            "Calculate your loan EMI, total repayment, interest, and disbursed amount after platform fees with Quikkred’s EMI Calculator. Instant results with clear breakdown.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred EMI Calculator - Loan repayment and disbursed amount breakdown",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "EMI Calculator | Quikkred",
        description:
            "Estimate EMI, interest, total repayment, and disbursed amount after platform fees—instantly.",
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

const EMICalculatorLayout = ({ children }: LayoutInterface) => children;
export default EMICalculatorLayout;
