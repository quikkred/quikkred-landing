import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/track-application`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Track Your Application",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Track your Quikkred loan application status using your Loan Number or registered Phone Number. Find your Loan Number in your confirmation email or SMS, and get support if needed.",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "track application",
        "track loan application",
        "Quikkred track application",
        "loan status",
        "application status",
        "loan number",
        "LN reference number",
        "track by loan number",
        "track by phone number",
        "registered phone number",
        "loan confirmation SMS",
        "loan confirmation email",
        "customer support",
        "Quikkred support",
        "loan tracking",
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
        title: `Track Your Application | ${SITE_NAME}`,
        description:
            "Track your Quikkred loan application status using your Loan Number or registered Phone Number. Find your Loan Number in your confirmation email or SMS.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Track Your Application",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Track Your Application | ${SITE_NAME}`,
        description:
            "Track your Quikkred loan application status using your Loan Number or registered Phone Number.",
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

const TrackApplicationLayout = ({ children }: LayoutInterface) => children;
export default TrackApplicationLayout;
