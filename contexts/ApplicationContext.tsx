"use client";

import useAxios from "@/hooks/useAxios";
import useStorage from "@/hooks/useStorage";
import { ApplicationInterface } from "@/interfaces/applicationInterface";
import LayoutInterface from "@/interfaces/layoutInterface";
import { AxiosError } from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface ApplicationContextStateInterface {
    loading: boolean;
    data: ApplicationInterface | null;
}

interface ApplicationContextInterface {
    loading: boolean;
    application: ApplicationInterface | null;
    setApplication: (application: ApplicationInterface) => void;
}

const initialState: ApplicationContextStateInterface = {
    loading: false,
    data: null,
}

const ApplicationContext = createContext<ApplicationContextInterface>({
    loading: false,
    application: null,
    setApplication: () => { }
})

const ApplicationProvider = ({ children }: LayoutInterface) => {
    const axios = useAxios();
    const storage = useStorage();
    const [state, setState] = useState<ApplicationContextStateInterface>(initialState);

    const updateState = (state: Partial<ApplicationContextStateInterface>) => setState((prev) => ({ ...prev, ...state }));

    const getApplicationById = async () => {
        try {
            const applicationId = storage.get("applicationId");
            if (applicationId) {
                updateState({ loading: true });
                const response = await axios.get(`/api/application/loan/${applicationId}`);
                if (response.status === 200 || response.status === 201) {
                    console.log("application data:", response.data);
                    updateState({ data: response.data?.data || null });
                }
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("get application error:", error.response?.data?.message);
            }
        } finally {
            updateState({ loading: false });
        }
    }

    useEffect(() => {
        getApplicationById();
    }, []);

    return <ApplicationContext.Provider value={{
        application: state.data,
        loading: state.loading,
        setApplication: (application) => updateState({ data: application })
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
