"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface OTPFieldProps {
    value: string;
    onChange: (otp: string) => void;
    length?: number;
    error?: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
}

const OTPField = ({
    value,
    onChange,
    length = 6,
    error = false,
    autoFocus = false,
    disabled = false,
}: OTPFieldProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Split value into individual digits
    const digits = value.split("").slice(0, length);
    while (digits.length < length) digits.push("");

    // Auto-focus first input on mount
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const focusInput = useCallback((index: number) => {
        if (index >= 0 && index < length && inputRefs.current[index]) {
            inputRefs.current[index]?.focus();
            inputRefs.current[index]?.select();
        }
    }, [length]);

    const updateOTP = useCallback((newDigits: string[]) => {
        const newOtp = newDigits.join("").slice(0, length);
        onChange(newOtp);
    }, [length, onChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.replace(/\D/g, "");
        if (!val) return;

        const newDigits = [...digits];

        // Handle pasting or multi-char input
        if (val.length > 1) {
            const chars = val.split("");
            for (let i = 0; i < chars.length && index + i < length; i++) {
                newDigits[index + i] = chars[i];
            }
            updateOTP(newDigits);
            const nextIndex = Math.min(index + val.length, length - 1);
            focusInput(nextIndex);
            return;
        }

        // Single digit
        newDigits[index] = val;
        updateOTP(newDigits);
        focusInput(index + 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newDigits = [...digits];

            if (digits[index]) {
                // Clear current digit
                newDigits[index] = "";
                updateOTP(newDigits);
            } else if (index > 0) {
                // Move to previous and clear it
                newDigits[index - 1] = "";
                updateOTP(newDigits);
                focusInput(index - 1);
            }
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            focusInput(index - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!pasted) return;

        const newDigits = pasted.split("");
        while (newDigits.length < length) newDigits.push("");
        updateOTP(newDigits);

        // Focus last filled digit or last box
        const lastFilledIndex = Math.min(pasted.length, length) - 1;
        focusInput(lastFilledIndex);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
                <React.Fragment key={index}>
                    {/* Center separator */}
                    {index === Math.floor(length / 2) && (
                        <div className="w-2 sm:w-3 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        </div>
                    )}
                    <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        disabled={disabled}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={handleFocus}
                        autoComplete="one-time-code"
                        aria-label={`OTP digit ${index + 1}`}
                        placeholder="•"
                        className={`
              w-9 h-11 sm:w-10 sm:h-12
              text-center text-base sm:text-lg font-bold
              border-2 rounded-xl outline-none
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${digit
                                ? error
                                    ? "border-red-400 bg-red-50 text-red-700"
                                    : "border-emerald-500 bg-emerald-50/50 text-gray-900"
                                : error
                                    ? "border-red-300 bg-red-50/30"
                                    : "border-gray-200 bg-gray-50/50"
                            }
              focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white
              ${error ? "focus:border-red-500 focus:ring-red-500/10" : ""}
            `}
                    />
                </React.Fragment>
            ))}
        </div>
    );
};

export default OTPField;
