"use client";

import { useState, useEffect, useCallback } from "react";

interface LocationData {
    latitude: number;
    longitude: number;
}

const useLocation = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getLocation = useCallback(async (): Promise<LocationData | null> => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            return null;
        }

        setLoading(true);
        setError(null);

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    setLocation(newLocation);
                    setLoading(false);
                    resolve(newLocation);
                },
                (err) => {
                    setError(err.message);
                    setLoading(false);
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0, // always recheck
                }
            );
        });
    }, []);

    // Auto fetch on mount
    useEffect(() => {
        getLocation();
    }, [getLocation]);

    return {
        location,
        loading,
        error,
        getLocation, // 🔥 manual refetch allowed
    };
};

export default useLocation;
