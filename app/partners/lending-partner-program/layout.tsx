import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_PATH = "/partners/lending-partner-program";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/Partners_our_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Lending Partner Program — LaaS for Private Limited Companies",
        template: `%s | ${SITE_NAME} Partners`,
    },

    description:
        "Embed Quikkred's lending stack in your product. A compliant Digital Lending Partnership under RBI's 2022 Digital Lending Guidelines — EDD-led onboarding for Private Limited companies, D2C brands, neobanks, HR platforms and marketplaces.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred partners",
        "lending as a service India",
        "LaaS India",
        "embedded lending India",
        "digital lending partnership",
        "LSP partner NBFC",
        "white label lending India",
        "B2B2C lending",
        "RBI digital lending guidelines 2022",
        "FLDG 5% RBI",
        "EDD partner onboarding NBFC",
        "co-branded lending India",
        "loan API for fintech",
        "salary advance partner",
        "checkout finance partner",
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
        title: "Become a Quikkred Lending Partner | Embedded Lending, RBI-Aligned",
        description:
            "Offer personal loans to your own customers using Quikkred's regulated lending stack. RBI-aligned Digital Lending Partnership for Private Limited companies.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Lending Partner Program — Embedded lending for Private Limited companies",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Quikkred Lending Partner Program",
        description:
            "Embed Quikkred's regulated lending stack. RBI-aligned Digital Lending Partnership for Private Limited companies.",
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

const PartnersLayout = ({ children }: LayoutInterface) => children;
export default PartnersLayout;
