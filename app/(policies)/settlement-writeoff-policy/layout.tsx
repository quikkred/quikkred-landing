import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/settlement-writeoff-policy`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Settlement & Write-off Policy",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Read Quikkred’s Settlement & Write-off Policy outlining the framework for compromise settlements, one-time settlements (OTS), full & final settlements, and technical write-offs in line with RBI guidelines.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "settlement policy",
        "write-off policy",
        "settlement and write-off",
        "compromise settlement",
        "loan settlement",
        "one time settlement",
        "OTS",
        "full and final settlement",
        "technical write-off",
        "NPA settlement",
        "IRACP norms",
        "RBI compromise settlement framework",
        "RBI technical write-off framework",
        "NBFC policy",
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
        title: `Settlement & Write-off Policy | ${SITE_NAME}`,
        description:
            "Quikkred’s policy for compromise settlements, OTS/F&F settlements, and technical write-offs, with processes, eligibility, controls, and reporting aligned to RBI guidelines.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Settlement & Write-off Policy",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Settlement & Write-off Policy | ${SITE_NAME}`,
        description:
            "Read Quikkred’s framework for compromise settlements, OTS/F&F settlements, and technical write-offs aligned with RBI guidelines.",
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

const SettlementWriteoffPolicyLayout = ({ children }: LayoutInterface) => children;
export default SettlementWriteoffPolicyLayout;
