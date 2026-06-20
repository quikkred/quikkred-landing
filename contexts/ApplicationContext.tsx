"use client";

import useAxios from "@/hooks/useAxios";
import { ApplicationInterface } from "@/interfaces/applicationInterface";
import LayoutInterface from "@/interfaces/layoutInterface";
import { AxiosError } from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth, User, userInitializer } from "./AuthContext";

interface ApplicationContextStateInterface {
    loading: boolean;
    data: ApplicationInterface | null;
}

interface ApplicationContextInterface {
    loading: boolean;
    application: ApplicationInterface | null;
    setApplication: (application: ApplicationInterface) => void;
    getApplication: () => void;
    getCustomer: () => void;
    fetchUserData: () => Promise<User | null>;
}

const initialState: ApplicationContextStateInterface = {
    loading: false,
    data: null,
}

const ApplicationContext = createContext<ApplicationContextInterface>({
    loading: false,
    application: null,
    setApplication: () => { },
    getApplication: () => { },
    getCustomer: () => { },
    fetchUserData: async () => (null),
})

const ApplicationProvider = ({ children, payload }: LayoutInterface & { payload: ApplicationInterface | null }) => {
    const axios = useAxios();
    const [state, setState] = useState<ApplicationContextStateInterface>({ ...initialState, data: payload });
    const { updateUser, user } = useAuth();

    // The NextAuth session is the source of the Bearer token that useAxios
    // attaches. Gate auth-dependent fetches on it so we never fire a request
    // before the token is resolvable (which otherwise yields a 401
    // "Token missing" right after login).
    const { data: session, status: sessionStatus } = useSession();
    const accessToken = (session as any)?.accessToken as string | undefined;
    const isAuthReady = sessionStatus === "authenticated" && !!accessToken;

    const updateState = (state: Partial<ApplicationContextStateInterface>) => setState((prev) => ({ ...prev, ...state }));

    // Sync payload from server component if it updates
    useEffect(() => {
        if (payload) {
            updateState({ data: payload });
        }
    }, [payload]);

    // If user is logged in but application data is missing (e.g. client navigation), fetch it.
    // Wait for the session token (isAuthReady) so the request carries an Authorization header.
    useEffect(() => {
        if (isAuthReady && user?.id && !state.data && !state.loading) {
            getApplication();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady, user?.id]);

    // On every mount/refresh: pull fresh customer details from /api/customer/get and
    // merge into `user`. The server snapshot (getUserDetails) omits flags like
    // bsaInitiated / isBankDetailsFilled, so we refresh client-side to get current data.
    // Gated on isAuthReady so it never fires before the token is available.
    useEffect(() => {
        if (isAuthReady && user?.id) {
            getCustomer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady, user?.id]);

    const getApplication = async () => {
        try {
            // const applicationId = storage.get("applicationId");
            // if (applicationId) {
            //     updateState({ loading: true });
            //     const response = await axios.get(`/api/application/loan/${applicationId}`);
            //     if (response.status === 200 || response.status === 201) {
            //         updateState({ data: response.data?.data || null });
            //     }
            // }
            updateState({ loading: true });
            const response = await axios.get("/api/v2/applicationByCustomerToken");
            if (response.status === 200 || response.status === 201) {
                const result = response.data;
                const data = (result?.data?.[0] || result?.data) as ApplicationInterface;
                
                if (Array.isArray(data) && data.length === 0) {
                    // toast({ variant: "error", title: "Application not Found." });
                    return updateState({ data: null });
                }
                updateState({ data: data });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                //console.log("get application error:", error.response?.data?.message);
            }
        } finally {
            updateState({ loading: false });
        }
    }

    const getCustomer = async () => {
        // Skip until the session token is available so the request always
        // carries an Authorization header (avoids 401 "Token missing").
        if (!isAuthReady) return;
        try {
            const response = await axios.get("/api/customer/get");
            if (response.status === 200 || response.status === 201) {
                const apiData = response.data?.data;
                // const fullName = apiData.fullName;

                const userData: Partial<User> = userInitializer({ apiData });
                updateUser(userData);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                //console.log("get customer error:", error.response?.data?.message);
            }
        }
    }

    const fetchUserData = async () => {
        // Skip until the session token is available (avoids 401 "Token missing").
        if (!isAuthReady) return null;
        try {
            const response = await axios.get("/api/customer/get");
            if (response.status === 200 || response.status === 201) {
                const apiData = response.data?.data;

                const userData: Partial<User> = userInitializer({ apiData });
                return userData as User;
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                //console.log("fetch user error:", error.response?.data?.message);
            }
        }
        return null;
    }

    return <ApplicationContext.Provider value={{
        application: state.data,
        loading: state.loading,
        setApplication: (application) => updateState({ data: application }),
        getApplication,
        getCustomer,
        fetchUserData,
    }}>
        {children}
    </ApplicationContext.Provider>
}

export default ApplicationProvider;

export function useApplication() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplication must be used within an ApplicationProvider');
    }
    return context;
}