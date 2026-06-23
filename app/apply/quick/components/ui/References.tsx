"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Loader2, CheckCircle2, Timer, Lock } from "lucide-react";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { RELATIONSHIP_TYPES, VALIDATION } from "@/lib/constants/quickApplyV2";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/toast";
import { isTestMode, TEST_OTP } from "@/lib/testMode";

const PREDEFINED_RELATIONSHIPS = RELATIONSHIP_TYPES.map((r) => r.value) as string[];
const OTHER_SENTINEL = "__OTHER__";

interface ReferencesProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

type RefErrors = {
    reference1Name?: string;
    reference1Mobile?: string;
    reference1Relationship?: string;
    reference2Name?: string;
    reference2Mobile?: string;
    reference2Relationship?: string;
};

// Per-reference OTP UI state (which slot has an OTP box open, the typed code,
// in-flight flags, the resolved subdocument id and the expiry/lock timers).
type OtpState = {
    sent: boolean;
    code: string;
    sending: boolean;
    verifying: boolean;
    expiry: number; // seconds until the OTP expires (display countdown)
    channel?: string; // "sms" | "whatsapp"
    referenceId?: string; // backend reference subdocument _id
    customerId?: string; // customer _id used for this reference's OTP calls
    lockedUntil?: number; // epoch ms — set on 429 (too many attempts)
    error?: string;
};

const emptyOtpState = (): OtpState => ({
    sent: false,
    code: "",
    sending: false,
    verifying: false,
    expiry: 0,
});

const NAME_REGEX = /[^a-zA-Z\s.'-]/g;
const DIGITS_ONLY = /^\d*$/;

const isCustomRelationship = (val?: string) =>
    !!val && !PREDEFINED_RELATIONSHIPS.includes(val);

const extractRefs = (payload: any): any[] =>
    Array.isArray(payload) ? payload : payload?.references || [];

const formatMMSS = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

const References = ({ formData, setFormData }: ReferencesProps) => {
    const axios = useAxios();
    const { user } = useAuth();
    const [errors, setErrors] = useState<RefErrors>({});

    // OTP state per reference slot (1 and 2).
    const [otp, setOtp] = useState<{ 1: OtpState; 2: OtpState }>({
        1: emptyOtpState(),
        2: emptyOtpState(),
    });

    // Track which references are in "Other" mode (custom text input)
    const [otherMode, setOtherMode] = useState<{ 1: boolean; 2: boolean }>({
        1: isCustomRelationship(formData.reference1Relationship),
        2: isCustomRelationship(formData.reference2Relationship),
    });

    // Auto-enable "Other" when API autofill brings in a non-predefined value
    useEffect(() => {
        setOtherMode((prev) => ({
            1: prev[1] || isCustomRelationship(formData.reference1Relationship),
            2: prev[2] || isCustomRelationship(formData.reference2Relationship),
        }));
    }, [formData.reference1Relationship, formData.reference2Relationship]);

    // Expiry countdown — tick down each open OTP box once per second.
    useEffect(() => {
        if (otp[1].expiry <= 0 && otp[2].expiry <= 0) return;
        const id = setInterval(() => {
            setOtp((prev) => ({
                1: { ...prev[1], expiry: prev[1].expiry > 0 ? prev[1].expiry - 1 : 0 },
                2: { ...prev[2], expiry: prev[2].expiry > 0 ? prev[2].expiry - 1 : 0 },
            }));
        }, 1000);
        return () => clearInterval(id);
    }, [otp[1].expiry, otp[2].expiry]);

    const update = (updates: Partial<QuickApplyV2FormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const setOtpState = (idx: 1 | 2, updates: Partial<OtpState>) => {
        setOtp((prev) => ({ ...prev, [idx]: { ...prev[idx], ...updates } }));
    };

    const isLocked = (idx: 1 | 2) => {
        const l = otp[idx].lockedUntil;
        return !!l && l > Date.now();
    };

    const handleNameChange = (
        field: "reference1Name" | "reference2Name",
        value: string,
    ) => {
        const clean = value.replace(NAME_REGEX, "");
        update({ [field]: clean } as Partial<QuickApplyV2FormData>);
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleMobileChange = (
        idx: 1 | 2,
        field: "reference1Mobile" | "reference2Mobile",
        value: string,
    ) => {
        if (!DIGITS_ONLY.test(value)) return;
        const clean = value.slice(0, 10);
        // Editing the number invalidates any OTP/verification already done for it.
        update({
            [field]: clean,
            [`reference${idx}Verified`]: false,
        } as Partial<QuickApplyV2FormData>);
        setOtpState(idx, emptyOtpState());

        let err: string | undefined;
        if (clean.length === 10 && !VALIDATION.MOBILE.test(clean)) {
            err = "Enter a valid 10-digit mobile";
        } else if (clean && formData.mobile && clean === formData.mobile) {
            err = "Reference cannot be your own number";
        }
        setErrors((prev) => ({ ...prev, [field]: err }));
    };

    const handleRelationshipSelect = (
        idx: 1 | 2,
        field: "reference1Relationship" | "reference2Relationship",
        value: string,
    ) => {
        if (value === OTHER_SENTINEL) {
            setOtherMode((prev) => ({ ...prev, [idx]: true }));
            update({ [field]: "" } as Partial<QuickApplyV2FormData>);
        } else {
            setOtherMode((prev) => ({ ...prev, [idx]: false }));
            update({ [field]: value } as Partial<QuickApplyV2FormData>);
        }
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleOtherRelationshipChange = (
        field: "reference1Relationship" | "reference2Relationship",
        value: string,
    ) => {
        const clean = value.replace(NAME_REGEX, "");
        update({ [field]: clean } as Partial<QuickApplyV2FormData>);
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const sameNumberError =
        formData.reference1Mobile &&
        formData.reference2Mobile &&
        formData.reference1Mobile === formData.reference2Mobile
            ? "References must have different numbers"
            : undefined;

    // A reference slot can be sent an OTP only once its name, a valid & non-self
    // mobile, and a relationship are filled in (and the two numbers differ).
    const canSendOtp = (idx: 1 | 2) => {
        const name = (formData[`reference${idx}Name`] || "").trim();
        const mobile = formData[`reference${idx}Mobile`] || "";
        const rel = formData[`reference${idx}Relationship`] || "";
        return (
            name.length >= 2 &&
            VALIDATION.MOBILE.test(mobile) &&
            !!rel &&
            mobile !== formData.mobile &&
            !sameNumberError
        );
    };

    // Pull the current customer (_id + already-saved references) so we can merge
    // and resolve the reference subdocument _id the OTP endpoints need.
    const fetchCustomer = async () => {
        const res = await axios.get("/api/customer/get");
        const data = res.data?.data;
        return {
            customerId: (data?._id as string) || user?.id,
            serverRefs: extractRefs(data),
        };
    };

    // Build the references array the "add reference" API expects — keep existing
    // subdocs (with their _id/verified) and add/update this flow's two references.
    const buildMergedReferences = (serverRefs: any[]) => {
        const result = (serverRefs || []).map((r) => ({
            ...(r._id ? { _id: r._id } : {}),
            name: r.name,
            mobile: r.mobile,
            relationship: r.relationship,
            ...(r.verified !== undefined ? { verified: r.verified } : {}),
        }));

        ([1, 2] as const).forEach((i) => {
            const name = (formData[`reference${i}Name`] || "").trim();
            const mobile = formData[`reference${i}Mobile`] || "";
            const rel = formData[`reference${i}Relationship`] || "";
            if (!(name.length >= 2 && VALIDATION.MOBILE.test(mobile) && rel)) return;

            const ex = result.findIndex((r) => r.mobile === mobile);
            if (ex >= 0) {
                result[ex] = { ...result[ex], name, relationship: rel };
            } else {
                result.push({ name, mobile, relationship: rel });
            }
        });

        return result;
    };

    // Shared error handling for both OTP endpoints (see backend guide):
    // 400 already-verified → mark verified; 429 → lock until lockedUntil;
    // everything else → surface the message.
    const handleOtpError = (idx: 1 | 2, error: any) => {
        const data = error?.response?.data;
        const status = error?.response?.status;
        const message =
            data?.message || error?.message || "Something went wrong. Please try again.";

        if (status === 400 && /already verified/i.test(message)) {
            update({ [`reference${idx}Verified`]: true } as Partial<QuickApplyV2FormData>);
            setOtpState(idx, emptyOtpState());
            toast({ variant: "success", title: `Reference ${idx} already verified` });
            return;
        }

        const updates: Partial<OtpState> = {
            sending: false,
            verifying: false,
            error: message,
        };
        if (status === 429 && data?.lockedUntil) {
            updates.lockedUntil = new Date(data.lockedUntil).getTime();
        }
        setOtpState(idx, updates);
    };

    const markVerified = (idx: 1 | 2) => {
        update({ [`reference${idx}Verified`]: true } as Partial<QuickApplyV2FormData>);
        setOtpState(idx, emptyOtpState());
        toast({ variant: "success", title: `Reference ${idx} verified` });
    };

    // Sends an OTP to the reference's own mobile. First persists the reference via
    // the add-reference API to obtain its subdocument _id, then calls send-otp.
    const sendOtp = async (idx: 1 | 2) => {
        if (isLocked(idx) || !canSendOtp(idx)) return;
        const mobile = formData[`reference${idx}Mobile`] || "";

        setOtpState(idx, { sending: true, error: undefined });

        // TEST MODE: backend is disabled — just reveal the OTP box.
        if (isTestMode()) {
            setOtpState(idx, {
                ...emptyOtpState(),
                sent: true,
                expiry: 600,
                channel: "sms",
                referenceId: "test",
                customerId: user?.id,
            });
            return;
        }

        try {
            let referenceId = otp[idx].referenceId;
            let customerId = otp[idx].customerId;

            // Resolve the reference _id once; resends reuse it.
            if (!referenceId) {
                const { customerId: cid, serverRefs } = await fetchCustomer();
                if (!cid) throw new Error("Please log in to verify references.");
                customerId = cid;

                const merged = buildMergedReferences(serverRefs);
                const patchRes = await axios.patch(
                    `/api/customer/references/${cid}`,
                    { references: merged },
                );

                let savedRefs = extractRefs(patchRes.data?.data);
                if (!savedRefs.length) savedRefs = (await fetchCustomer()).serverRefs;

                referenceId = savedRefs.find((r) => r.mobile === mobile)?._id;
                if (!referenceId) {
                    throw new Error("Could not save this reference. Please try again.");
                }
            }

            const otpRes = await axios.post(
                `/api/customer/references/${customerId}/${referenceId}/send-otp`,
            );
            const d = otpRes.data?.data || {};
            const secs = d.expiry
                ? Math.max(0, Math.floor((new Date(d.expiry).getTime() - Date.now()) / 1000))
                : 600;

            setOtp((prev) => ({
                ...prev,
                [idx]: {
                    ...emptyOtpState(),
                    sent: true,
                    referenceId,
                    customerId,
                    expiry: secs,
                    channel: d.channel,
                },
            }));

            toast({
                variant: "success",
                title: "OTP sent",
                description: `Code sent to ${mobile}${d.channel ? ` via ${d.channel}` : ""}.`,
            });
        } catch (error: any) {
            handleOtpError(idx, error);
        }
    };

    // Verifies the entered OTP and marks the reference verified on success.
    const verifyOtp = async (idx: 1 | 2) => {
        if (isLocked(idx)) return;
        const code = otp[idx].code;

        if (!VALIDATION.OTP.test(code)) {
            setOtpState(idx, { error: "Enter the 6-digit OTP" });
            return;
        }

        setOtpState(idx, { verifying: true, error: undefined });

        // TEST MODE: accept the fixed test OTP without hitting the backend.
        if (isTestMode()) {
            if (code !== TEST_OTP) {
                setOtpState(idx, { verifying: false, error: "Invalid OTP. Please try again." });
                return;
            }
            markVerified(idx);
            return;
        }

        try {
            const customerId = otp[idx].customerId || user?.id;
            const referenceId = otp[idx].referenceId;
            if (!customerId || !referenceId) {
                throw new Error("Please request an OTP first.");
            }

            await axios.post(
                `/api/customer/references/${customerId}/${referenceId}/verify-otp`,
                { otp: code },
            );
            markVerified(idx);
        } catch (error: any) {
            handleOtpError(idx, error);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                References
            </h3>
            <p className="text-xs text-gray-600 mb-3">
                Please provide two references we can reach if needed. Verify each
                number with the OTP we send to it.
            </p>

            <div className="space-y-4">
                {[1, 2].map((n) => {
                    const idx = n as 1 | 2;
                    const nameKey = `reference${idx}Name` as
                        | "reference1Name"
                        | "reference2Name";
                    const mobileKey = `reference${idx}Mobile` as
                        | "reference1Mobile"
                        | "reference2Mobile";
                    const relKey = `reference${idx}Relationship` as
                        | "reference1Relationship"
                        | "reference2Relationship";
                    const verifiedKey = `reference${idx}Verified` as
                        | "reference1Verified"
                        | "reference2Verified";
                    const isVerified = !!formData[verifiedKey];
                    const slot = otp[idx];
                    const locked = isLocked(idx);

                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-lg p-3 border border-gray-200 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-gray-700">
                                    Reference {idx}
                                </p>
                                {isVerified && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Verified
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[nameKey] || ""}
                                        onChange={(e) =>
                                            handleNameChange(nameKey, e.target.value)
                                        }
                                        placeholder="Enter full name"
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                                            errors[nameKey]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors[nameKey] && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors[nameKey]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={formData[mobileKey] || ""}
                                        onChange={(e) =>
                                            handleMobileChange(idx, mobileKey, e.target.value)
                                        }
                                        disabled={isVerified}
                                        maxLength={10}
                                        placeholder="10-digit mobile"
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-50 disabled:text-gray-500 ${
                                            errors[mobileKey] ||
                                            (idx === 2 && sameNumberError)
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {(errors[mobileKey] ||
                                        (idx === 2 && sameNumberError)) && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors[mobileKey] || sameNumberError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                    Relationship *
                                </label>
                                <select
                                    value={
                                        otherMode[idx]
                                            ? OTHER_SENTINEL
                                            : formData[relKey] || ""
                                    }
                                    onChange={(e) =>
                                        handleRelationshipSelect(
                                            idx,
                                            relKey,
                                            e.target.value,
                                        )
                                    }
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] bg-white ${
                                        errors[relKey]
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select relationship</option>
                                    {RELATIONSHIP_TYPES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                    <option value={OTHER_SENTINEL}>Other</option>
                                </select>

                                {otherMode[idx] && (
                                    <input
                                        type="text"
                                        value={formData[relKey] || ""}
                                        onChange={(e) =>
                                            handleOtherRelationshipChange(
                                                relKey,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Specify relationship"
                                        className={`mt-2 w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                                            errors[relKey]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                )}

                                {errors[relKey] && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors[relKey]}
                                    </p>
                                )}
                            </div>

                            {/* ---------------- OTP verification ---------------- */}
                            {!isVerified && (
                                <div className="pt-1 space-y-2">
                                    {locked && (
                                        <p className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2">
                                            <Lock className="w-3.5 h-3.5 shrink-0" />
                                            <span>
                                                Too many attempts. Try again after{" "}
                                                {new Date(
                                                    slot.lockedUntil as number,
                                                ).toLocaleString()}
                                                .
                                            </span>
                                        </p>
                                    )}

                                    {!slot.sent ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => sendOtp(idx)}
                                                disabled={
                                                    !canSendOtp(idx) || slot.sending || locked
                                                }
                                                className="w-full py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 bg-[#25B181] hover:bg-[#1F8F68] text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {slot.sending ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Sending OTP...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheck className="w-4 h-4" />
                                                        <span>Send OTP to verify</span>
                                                    </>
                                                )}
                                            </button>
                                            {slot.error && !locked && (
                                                <p className="text-xs text-red-600">
                                                    {slot.error}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="block text-xs font-medium text-gray-700">
                                                Enter OTP sent to {formData[mobileKey]}
                                                {slot.channel ? ` via ${slot.channel}` : ""}
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    value={slot.code}
                                                    disabled={locked}
                                                    onChange={(e) =>
                                                        setOtpState(idx, {
                                                            code: e.target.value
                                                                .replace(/\D/g, "")
                                                                .slice(0, 6),
                                                            error: undefined,
                                                        })
                                                    }
                                                    maxLength={6}
                                                    placeholder="6-digit OTP"
                                                    className={`flex-1 px-3 py-2.5 border rounded-lg tracking-[0.3em] text-center font-semibold focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-50 ${
                                                        slot.error
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => verifyOtp(idx)}
                                                    disabled={
                                                        slot.code.length !== 6 ||
                                                        slot.verifying ||
                                                        locked
                                                    }
                                                    className="px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-[#25B181] hover:bg-[#1F8F68] text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                                                >
                                                    {slot.verifying ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        "Verify"
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between text-xs px-0.5">
                                                <span className="flex items-center gap-1 text-gray-500">
                                                    <Timer className="w-3.5 h-3.5" />
                                                    {slot.expiry > 0 ? (
                                                        <span>
                                                            Expires in{" "}
                                                            <span className="font-mono text-gray-700">
                                                                {formatMMSS(slot.expiry)}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            OTP expired
                                                        </span>
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => sendOtp(idx)}
                                                    disabled={slot.sending || locked}
                                                    className="font-semibold text-[#25B181] hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                                                >
                                                    {slot.sending ? "Sending..." : "Resend OTP"}
                                                </button>
                                            </div>

                                            {slot.error && !locked && (
                                                <p className="text-xs text-red-600">
                                                    {slot.error}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default References;
