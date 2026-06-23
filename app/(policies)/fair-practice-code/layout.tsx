import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/fair-practice-code`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.png`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Fair Practices Code",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Fair Practices Code (FPC) outlining transparent and responsible lending practices, loan application and appraisal processes, Key Facts Statement (KFS) compliance, penal charges framework, disbursement and changes in terms, grievance redressal, and customer protection commitments.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "fair practices code",
        "FPC",
        "Quikkred fair practices code",
        "NBFC fair practices code",
        "RBI fair practices code",
        "responsible lending",
        "transparent lending",
        "loan application processing",
        "loan appraisal",
        "sanction letter",
        "Key Facts Statement",
        "KFS",
        "APR disclosure",
        "penal charges policy",
        "no penal interest",
        "disbursement terms",
        "interest rate model",
        "excessive interest regulation",
        "property document release",
        "compensation for delay",
        "grievance redressal mechanism",
        "customer complaints",
        "loan transfer request",
        "recovery practices",
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
        title: `Fair Practices Code | ${SITE_NAME}`,
        description:
            "Quikkred’s Fair Practices Code covering transparency, ethical lending, KFS compliance, penal charges framework, disbursement practices, grievance redressal, and customer protection.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Fair Practices Code",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Fair Practices Code | ${SITE_NAME}`,
        description:
            "Read Quikkred’s Fair Practices Code (FPC) covering responsible lending, transparency, KFS compliance, penal charges, and grievance redressal.",
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

const FairPracticeCodeLayout = ({ children }: LayoutInterface) => children;
export default FairPracticeCodeLayout;
