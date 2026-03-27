"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

// interface SessionLocalAuthProps {
//     user: { id: string; email: string; };
//     role: string;
//     accessToken: string;
//     refreshToken: string;
//     customerUniqueId: string;
// };

const SessionLocalAuth = () => {
    const sessionData = useSession();

    useEffect(() => {
        if (typeof window !== "undefined" && sessionData.data) {
            const data: any = sessionData.data;
            // ✅ Save important details in localStorage
            localStorage.setItem("userId", data?.user?.id);
            localStorage.setItem("role", data?.role);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("email", data.user?.email || "");
            localStorage.setItem("customerUniqueId", data.customerUniqueId || "");
        }
    }, [sessionData]);

    return null;
}

export default SessionLocalAuth