import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const getLanguage = async (): Promise<RequestCookie | string> => {
    const cookie = await cookies();
    return cookie.get("language")?.value || "en";
}

export default getLanguage;