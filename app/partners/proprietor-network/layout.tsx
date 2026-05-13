import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/partners/proprietor-network";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Partners_our_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Proprietor Network — B2B2B2C Lending for Deep-India Retail",
        template: `%s | ${SITE_NAME} Partners`,
    },

    description:
        "Run a network of proprietor sub-agents — kirana shops, fruit-mandi aggregators, auto-stand leaders — who source loans to street vendors and rickshaw-wallahs. Funds flow only through Satsai's dynamic QR; proprietors never touch cash. RBI-aligned LSP structure under DLD 2025.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "proprietor sub-agent lending",
        "deep india retail NBFC",
        "rickshaw wala loan",
        "fruit vendor loan",
        "street vendor micro loan",
        "UPI QR collection NBFC",
        "virtual account lending",
        "dynamic QR NBFC partner",
        "DSA agent network",
        "vernacular KFS lending",
        "micro EMI daily weekly",
        "B2B2B2C lending India",
        "tripartite LSP agreement",
        "kirana sourcing agent loans",
        "PSL weaker sections NBFC",
    ],

    alternates: { canonical: PAGE_URL },

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
        title: "Proprietor Network | Quikkred Partners",
        description:
            "4-layer B2B2B2C stack: Satsai NBFC → Primary LSP → Proprietor sub-agent → Street-level borrower. Funds always flow through Satsai's dynamic QR. RBI DLD 2025-aligned.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Proprietor Network — B2B2B2C lending for deep-India retail",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Quikkred Proprietor Network — B2B2B2C",
        description:
            "Deep-India retail lending through a proprietor sub-agent network on Satsai's rails.",
        images: [OG_IMAGE],
    },

    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,

    formatDetection: { email: false, address: false, telephone: false },

    themeColor: "#0A0A0A",

    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

const ProprietorLayout = ({ children }: LayoutInterface) => children;
export default ProprietorLayout;
