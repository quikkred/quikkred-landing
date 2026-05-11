"use client";

import { useState } from "react";
import { Phone, ShieldCheck, X, Loader2 } from "lucide-react";
import OTPField from "./OTPField";
import { apiClient } from "@/lib/api/api-client";
import { toast } from "@/components/ui/toast";

type Step = "intro" | "mobile" | "otp" | "done";

interface LinkExistingMobileProps {
    onLinked?: () => void;
    onDismiss?: () => void;
}

const LinkExistingMobile = ({ onLinked, onDismiss }: LinkExistingMobileProps) => {
    const [step, setStep] = useState<Step>("intro");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [maskedMobile, setMaskedMobile] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendOtp = async () => {
        setError(null);
        const cleaned = mobile.replace(/\D/g, "");
        if (cleaned.length !== 10 || !/^[6-9]/.test(cleaned)) {
            setError("Enter a valid 10-digit mobile number");
            return;
        }
        setBusy(true);
        try {
            const res = await apiClient.post<{ maskedMobile: string }>(
                "/api/auth/customer/link-account/send-otp",
                { mobile: cleaned },
                true
            );
            if (res.success) {
                setMaskedMobile(res.data?.maskedMobile || null);
                setStep("otp");
            } else {
                setError(res.message || res.error || "Could not send OTP");
            }
        } catch (e: any) {
            setError(e?.message || "Could not send OTP");
        } finally {
            setBusy(false);
        }
    };

    const verifyOtp = async () => {
        setError(null);
        if (otp.length !== 6) {
            setError("Enter the 6-digit OTP");
            return;
        }
        setBusy(true);
        try {
            const cleaned = mobile.replace(/\D/g, "");
            const res = await apiClient.post(
                "/api/auth/customer/link-account/verify-otp",
                { mobile: cleaned, otp },
                true
            );
            if (res.success) {
                setStep("done");
                toast({
                    variant: "success",
                    title: "Account linked",
                    description: "Your existing mobile number is now connected to this account.",
                });
                onLinked?.();
            } else {
                setError(res.message || res.error || "Invalid OTP");
            }
        } catch (e: any) {
            setError(e?.message || "Invalid OTP");
        } finally {
            setBusy(false);
        }
    };

    if (step === "done") return null;

    return (
        <div className="relative bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            {onDismiss && (
                <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={onDismiss}
                    className="absolute top-2 right-2 text-amber-700 hover:text-amber-900"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {step === "intro" && (
                <div>
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                        <div className="text-sm text-amber-900">
                            <p className="font-semibold mb-1">Already used Quikkred with a mobile number?</p>
                            <p className="text-amber-800">
                                Link your existing account so your previous activity stays with you.
                                We'll send an OTP to that mobile to confirm it's yours.
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-2 justify-end">
                        {onDismiss && (
                            <button
                                type="button"
                                onClick={onDismiss}
                                className="text-xs px-3 py-1.5 rounded-md text-amber-800 hover:bg-amber-100"
                            >
                                Not now
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setStep("mobile")}
                            className="text-xs px-3 py-1.5 rounded-md bg-amber-600 text-white hover:bg-amber-700"
                        >
                            Link my mobile
                        </button>
                    </div>
                </div>
            )}

            {step === "mobile" && (
                <div>
                    <label className="block text-xs font-medium text-amber-900 mb-1">
                        Enter the mobile number used previously
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="tel"
                            inputMode="numeric"
                            value={mobile}
                            maxLength={10}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                            placeholder="10-digit mobile"
                            className="flex-1 px-3 py-2 rounded-md border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button
                            type="button"
                            onClick={sendOtp}
                            disabled={busy}
                            className="text-sm px-4 rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 inline-flex items-center gap-1"
                        >
                            {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Send OTP
                        </button>
                    </div>
                    {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
                </div>
            )}

            {step === "otp" && (
                <div>
                    <p className="text-xs text-amber-900 mb-2">
                        Enter the 6-digit OTP sent to{" "}
                        <span className="font-semibold">{maskedMobile || `mobile ending in ${mobile.slice(-2)}`}</span>
                    </p>
                    <OTPField value={otp} onChange={setOtp} length={6} autoFocus />
                    {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
                    <div className="mt-3 flex gap-2 justify-between items-center">
                        <button
                            type="button"
                            onClick={() => { setStep("mobile"); setOtp(""); setError(null); }}
                            className="text-xs text-amber-800 hover:underline"
                        >
                            Use a different number
                        </button>
                        <button
                            type="button"
                            onClick={verifyOtp}
                            disabled={busy || otp.length !== 6}
                            className="text-sm px-4 py-1.5 rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 inline-flex items-center gap-1"
                        >
                            {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <ShieldCheck className="w-4 h-4" />
                            Verify & link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkExistingMobile;
