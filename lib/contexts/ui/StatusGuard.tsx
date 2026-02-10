"use client"

import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // <--- 1. Import createPortal
import { useKycStatus } from "../KycStatusContext";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ResultView from "./ResultView";

const StatusGuard = () => {
    const { visibility, loading, status, title, description, data, updateVisibility, onSuccess, onFailure } = useKycStatus();

    // 2. Add mounted state to prevent SSR hydration mismatches
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Scroll Lock Effect (Your original code - this is fine!)
    useEffect(() => {
        if (visibility) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [visibility]);

    const handleClose = () => updateVisibility(false);

    const handleSuccessContinue = () => {
        handleClose();
        if (onSuccess) onSuccess();
    };

    const handleFailureBack = () => {
        handleClose();
        if (onFailure) onFailure();
    };

    const LoadingView = () => (
        <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="relative mb-6">
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[#25B181]/20 rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute inset-0 bg-[#25B181]/30 rounded-full"
                />
                <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#25B181]/10">
                    <Loader2 className="w-8 h-8 text-[#25B181] animate-spin" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Checking Eligibility</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[240px]">
                Please wait while we analyze your profile and generate an offer.
            </p>
        </div>
    );

    // 3. Return null if not on client-side yet
    if (!mounted) return null;

    // 4. Wrap everything in createPortal targeting document.body
    return createPortal(
        <AnimatePresence>
            {visibility && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
                    // Failsafe: ensure pointer events work
                    style={{ pointerEvents: 'auto' }}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-all"
                        onClick={loading ? undefined : handleClose}
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        // Added 'relative' and 'z-10' to ensure it sits on top of backdrop
                        className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                    >
                        {loading ? (
                            <LoadingView />
                        ) : (
                            <ResultView
                                status={status}
                                title={title}
                                description={description}
                                data={data}
                                onContinue={handleSuccessContinue}
                                onBack={handleFailureBack}
                            />
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body // <--- Target the body specifically
    );
};

export default StatusGuard;