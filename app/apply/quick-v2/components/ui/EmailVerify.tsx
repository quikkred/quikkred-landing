"use client";

import React, { useState, useEffect } from "react";
import { Mail, AlertCircle, Loader2 } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { VALIDATION, TIMERS } from "@/lib/constants/quickApplyV2";
import useAxios from "@/hooks/useAxios";

const EmailVerify = () => {
  const { login } = useAuth();

  // State
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const axios = useAxios();

  // Timer Logic
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer]);

  const sendOTP = async () => {
    // Simple regex check from constants or fallback
    const emailRegex = VALIDATION?.EMAIL || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setOtpError("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      // Backend expects email for OTP generation
      const response = await axios.post(`/api/auth/customer/create`, {
        email,
        type: "email_verification" // Optional: based on your API requirements
      });

      if (response.status === 200 || response.status === 201) {
        setOtpSent(true);
        setOtpTimer(TIMERS?.OTP_RESEND || 30);
      } else {
        setOtpError(response.data?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter valid 6-digit OTP");
      return;
    }

    setOtpVerifying(true);
    setOtpError("");

    try {
      const res = await signIn("otp", {
        redirect: false,
        emailOrPhone: email,
        otp,
        loginMethod: "email",
        callbackUrl: "/apply/quick-v2",
      });

      if (res?.ok) {
        const session = await getSession();
        if (session?.user) {
          await login({
            email: session.user.email || "",
            apiData: session,
          });
        }
      } else {
        setOtpError(res?.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Verification failed.");
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Email Address <span className="text-red-500">*</span>
      </label>

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLowerCase().trim());
              setOtpSent(false);
              setOtp("");
              setOtpError("");
            }}
            disabled={otpSent && otpTimer > 0}
            className="w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-[#25B181] border-gray-200 outline-none transition-all placeholder:text-gray-400"
            placeholder="example@email.com"
          />
        </div>

        {!otpSent && (
          <button
            onClick={sendOTP}
            type="button"
            disabled={!email || otpLoading}
            className="w-full py-3.5 bg-[#25B181] text-white rounded-xl font-bold text-sm hover:bg-[#1d8f6a] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {otpLoading ? "Sending OTP..." : "Get Verification Code"}
          </button>
        )}
      </div>

      {otpSent && (
        <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-500 ml-1">Enter 6-digit Code</span>
            <input
              type="tel"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3.5 text-2xl text-center tracking-[0.5em] font-bold border-2 border-emerald-100 bg-emerald-50/30 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-[#25B181] outline-none transition-all"
              placeholder="000000"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={sendOTP}
              type="button"
              disabled={otpTimer > 0 || otpLoading}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend Code"}
            </button>
            <button
              onClick={verifyOTP}
              type="button"
              disabled={otp.length !== 6 || otpVerifying}
              className="flex-[1.5] py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {otpVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {otpVerifying ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        </div>
      )}

      {otpError && (
        <div className="mt-4 text-xs text-red-600 flex items-start gap-2 bg-red-50 p-3 rounded-xl border border-red-100 animate-in shake-1">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-medium">{otpError}</span>
        </div>
      )}
    </div>
  );
};

export default EmailVerify;