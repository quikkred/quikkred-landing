import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/login`;
const OG_IMAGE = `${SITE_URL}/Aboutus_hero_image.jpg`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Login",
        template: `%s | ${SITE_NAME}`,
    },

    description:
        "Login to your Quikkred account to view your profile, continue your loan application, track status, manage repayments, and access secure account features. Quikkred is the technology and servicing partner; loans are provided by Satsai Finlease Private Limited (RBI registered NBFC).",

    applicationName: SITE_NAME,
    category: "Finance",

    keywords: [
        "Quikkred login",
        "login",
        "sign in",
        "customer login",
        "account login",
        "loan account",
        "loan application status",
        "track loan application",
        "manage repayments",
        "EMI payments",
        "secure login",
        "OTP login",
        "digital lending platform",
        "RBI regulated NBFC",
        "Satsai Finlease",
        "Quikkred account",
        "Quikkred customer portal",
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
        title: `Login | ${SITE_NAME}`,
        description:
            "Access your Quikkred account securely to continue your financial journey, track applications, and manage repayments.",
        siteName: SITE_NAME,
        locale: "en_IN",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Quikkred Login",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `Login | ${SITE_NAME}`,
        description:
            "Login to Quikkred to access your account securely, track your loan application, and manage repayments.",
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

const LoginLayout = ({ children }: LayoutInterface) => children;
export default LoginLayout;
