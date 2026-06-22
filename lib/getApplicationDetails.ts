import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ApplicationInterface } from "@/interfaces/applicationInterface";
import { getServerSession } from "next-auth";
import { API_BASE_URL } from "./config";
import { isTestMode } from "@/lib/testMode";

const getApplicationDetails = async (): Promise<ApplicationInterface | null> => {
    // TEST MODE: never call the backend on the server (dummy data is injected
    // client-side by ApplicationContext).
    if (isTestMode()) return null;
    try {
        // 1) Get NextAuth session (server-side)
        const session = await getServerSession(authOptions);

        if (!session) return null;

        // 3) Get backend access token from session (you set this in callbacks)
        // @ts-ignore
        const accessToken: string | undefined = session.accessToken;

        const response = await fetch(`${API_BASE_URL}/api/v2/applicationByCustomerToken`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result?.success || !result?.data) {
            return null;
        }

        const data = (result?.data?.[0] || result?.data) as ApplicationInterface;
        if (Array.isArray(data) && data.length === 0) {
            return null;
        }

        return data;
    } catch (error: unknown) {
        console.error("getApplicationDetails error:", error);
        return null;
    }
}

export default getApplicationDetails;