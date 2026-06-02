import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/apply/quick`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Quick Loan Application",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Apply for a loan in minutes with Quikkred’s Quick Loan Application. Submit basic details, verify your identity, check eligibility, and track your application status securely and seamlessly.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "quick loan application",
        "apply loan online",
        "instant loan application",
        "personal loan application",
        "payday loan application",
        "EMI loan application",
        "loan eligibility check",
        "loan verification",
        "KYC verification",
        "PAN Aadhaar verification",
        "loan application status",
        "digital lending",
        "NBFC loan application",
        "Quikkred apply",
        "Quikkred quick apply",
        "online loan India",
        "fast loan approval",
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
        title: `Quick Loan Application | ${SITE_NAME}`,
        description:
            "Start your Quick Loan Application on Quikkred. Share basic details, complete verification, view eligibility, and track your loan request securely.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Quick Loan Application",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Quick Loan Application | ${SITE_NAME}`,
        description:
            "Apply for a loan in minutes with Quikkred’s Quick Loan Application. Simple steps, secure verification, and real-time tracking.",
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

const QuickLoanApplicationLayout = ({ children }: LayoutInterface) => children;
export default QuickLoanApplicationLayout;
