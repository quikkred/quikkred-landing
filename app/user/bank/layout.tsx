import type { Metadata } from "next";
import LayoutInterface from "@/interfaces/layoutInterface";

const SITE_NAME = "Quikkred";
const SITE_URL = "https://quikkred.in";
const PAGE_URL = `${SITE_URL}/user/bank`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "My Bank Accounts",
        template: `%s | ${SITE_NAME}`,
    },

    description: "Manage your linked bank accounts",

    applicationName: SITE_NAME,
    category: "Finance",

    alternates: {
        canonical: PAGE_URL,
    },

    robots: {
        index: false,
        follow: true,
        googleBot: {
            index: false,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
};

const BankDashboardLayout = ({ children }: LayoutInterface) => children;
export default BankDashboardLayout;
