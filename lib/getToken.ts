import { getSession } from "next-auth/react";

const getToken = async () => {
    if (typeof window !== 'undefined') {
        const sessionToken = await getSession();
        const token = (sessionToken as any)?.accessToken || localStorage.getItem('authToken') ||
            localStorage.getItem('token') ||
            localStorage.getItem('accessToken');
        return token;
    }
    return null;
};

export default getToken;