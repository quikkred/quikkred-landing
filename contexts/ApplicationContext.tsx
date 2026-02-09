"use client";

import useAxios from "@/hooks/useAxios";
import { ApplicationInterface } from "@/interfaces/applicationInterface";
import LayoutInterface from "@/interfaces/layoutInterface";
import { AxiosError } from "axios";
import { createContext, useContext, useState } from "react";
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
    const { updateUser } = useAuth();

    const updateState = (state: Partial<ApplicationContextStateInterface>) => setState((prev) => ({ ...prev, ...state }));

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
                // console.log("application get to func", result, data)
                if (Array.isArray(data) && data.length === 0) {
                    // toast({ variant: "error", title: "Application not Found." });
                    return updateState({ data: null });
                }
                updateState({ data: data });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("get application error:", error.response?.data?.message);
            }
        } finally {
            updateState({ loading: false });
        }
    }

    const getCustomer = async () => {
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
                console.log("get customer error:", error.response?.data?.message);
            }
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/customer/get");
            if (response.status === 200 || response.status === 201) {
                const apiData = response.data?.data;

                const userData: Partial<User> = userInitializer({ apiData });
                return userData as User;
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("fetch user error:", error.response?.data?.message);
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