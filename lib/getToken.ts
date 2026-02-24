import { getSession } from "next-auth/react";

/**
 * Gets the current access token.
 * Optimized to check localStorage first for speed, then falling back to NextAuth session.
 */
const getToken = async () => {
    if (typeof window !== 'undefined') {
        // 1. Try localStorage first (fastest)
        // const localToken = localStorage.getItem('accessToken') || 
        //                   localStorage.getItem('token') || 
        //                   localStorage.getItem('authToken');
        
        // if (localToken) return localToken;

        // 2. Fallback to NextAuth session (slower, requires network/API call)
        const sessionToken = await getSession();
        return (sessionToken as any)?.accessToken || null;
    }
    return null;
};

export default getToken;
