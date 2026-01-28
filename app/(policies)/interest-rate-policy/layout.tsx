import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/interest-rate-policy";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Interest Rate & Penal Charges Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Interest Rate and Penal Charges Policy, including interest rate determination methodology, rate structure, platform fees, penal charges, customer communication, and amendments in line with applicable RBI guidelines.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred interest rate policy",
        "interest rate and penal charges policy",
        "NBFC interest rate policy",
        "RBI guidelines NBFC",
        "interest rate determination",
        "risk based pricing",
        "platform fees policy",
        "penal charges policy",
        "EMI bouncing charges",
        "late payment penal charges",
        "Key Fact Statement KFS",
        "loan agreement charges",
        "loan interest rate structure",
        "Satsai Finlease policy",
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
        title: "Interest Rate & Penal Charges Policy | Quikkred",
        description:
            "View Quikkred’s Interest Rate and Penal Charges Policy—how rates are determined, applicable charges, disclosures, and customer communication aligned with RBI guidelines.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Interest Rate & Penal Charges Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Interest Rate & Penal Charges Policy | Quikkred",
        description:
            "Read Quikkred’s Interest Rate and Penal Charges Policy, including rate structure, fees, disclosures, and customer communication.",
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

const InterestRatePolicyLayout = ({ children }: LayoutInterface) => children;
export default InterestRatePolicyLayout;
