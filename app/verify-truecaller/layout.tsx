import LayoutInterface from "@/interfaces/layoutInterface";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify truecaller status",
    robots: {
        index: false,
        follow: true,
    },
}

const VerifyTruecallerLayout = ({ children }: LayoutInterface) => children;
export default VerifyTruecallerLayout;