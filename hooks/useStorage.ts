"use client";

import { useCallback, useEffect, useState } from "react";

type Primitive = string | number | boolean | null;
type StorageValue = Primitive | Record<string, any> | any[];

type StoredPayload = {
    __type: "string" | "number" | "boolean" | "object" | "null";
    value: any;
};

type StorageMap = Record<string, StorageValue>;

interface StorageState {
    data: StorageMap;
    length: number;
    loading: boolean;
}

const isBrowser = () => typeof window !== "undefined";

/* ---------- TYPE HELPERS ---------- */
const encode = (value: StorageValue): StoredPayload => {
    if (value === null) return { __type: "null", value: null };

    const type = typeof value;

    if (type === "string") return { __type: "string", value };
    if (type === "number") return { __type: "number", value };
    if (type === "boolean") return { __type: "boolean", value };

    return { __type: "object", value };
};

const decode = (payload: any): StorageValue => {
    if (!payload || typeof payload !== "object" || !payload.__type)
        return payload;

    return payload.value;
};

/* ---------- READ ALL ---------- */
const readAll = (): StorageMap => {
    if (!isBrowser()) return {};

    const result: StorageMap = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        try {
            const raw = localStorage.getItem(key);
            if (!raw) {
                result[key] = null;
                continue;
            }

            const parsed = JSON.parse(raw);
            result[key] = decode(parsed);
        } catch {
            // legacy / plain string
            result[key] = localStorage.getItem(key);
        }
    }

    return result;
};

/* ---------- HOOK ---------- */
const useStorage = () => {
    const [store, setStore] = useState<StorageState>({
        data: {},
        length: 0,
        loading: true,
    });

    // Init
    useEffect(() => {
        if (!isBrowser()) return;

        const all = readAll();

        setStore({
            data: all,
            length: Object.keys(all).length,
            loading: false,
        });
    }, []);

    /* ---------- GET ---------- */
    const get = useCallback((key: string): StorageValue => {
        if (!isBrowser()) return null;

        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;

            return decode(JSON.parse(raw));
        } catch {
            return localStorage.getItem(key);
        }
    }, []);

    /* ---------- GET ALL ---------- */
    const getAll = useCallback((): StorageMap => {
        return readAll();
    }, []);

    /* ---------- SET ---------- */
    const set = useCallback((key: string, value: StorageValue) => {
        if (!isBrowser()) return;

        try {
            const payload = encode(value);
            localStorage.setItem(key, JSON.stringify(payload));
        } catch {
            localStorage.setItem(key, String(value));
        }

        setStore((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
            length: localStorage.length,
        }));
    }, []);

    /* ---------- REMOVE ---------- */
    const remove = useCallback((key: string) => {
        if (!isBrowser()) return;

        localStorage.removeItem(key);

        setStore((prev) => {
            const updated = { ...prev.data };
            delete updated[key];

            return {
                ...prev,
                data: updated,
                length: localStorage.length,
            };
        });
    }, []);

    /* ---------- CLEAR ---------- */
    const clear = useCallback(() => {
        if (!isBrowser()) return;

        localStorage.clear();

        setStore({
            data: {},
            length: 0,
            loading: false,
        });
    }, []);

    return {
        ...store,
        get,
        getAll,
        set,
        remove,
        clear,
    };
};

export default useStorage;
