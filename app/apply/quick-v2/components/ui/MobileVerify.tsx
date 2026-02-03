"use client";

import React, { useState, useEffect } from "react";
import { Phone, AlertCircle, Loader2 } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { VALIDATION, TIMERS } from "@/lib/constants/quickApplyV2";
import useAxios from "@/hooks/useAxios";

const MobileVerify = () => {
  const { login } = useAuth();
  const axios = useAxios();

  // State
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  // Timer Logic
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer]);

  /* ---------------- SEND OTP ---------------- */
  const sendOTP = async () => {
    const mobileRegex = VALIDATION?.MOBILE || /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      setOtpError("Please enter a valid 10-digit mobile number");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await axios.post("/api/auth/customer/create", {
        mobile,
        type: "mobile_verification",
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

  /* ---------------- VERIFY OTP ---------------- */
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
        emailOrPhone: mobile,
        otp,
        loginMethod: "mobile",
        callbackUrl: "/apply/quick-v2",
      });

      if (res?.ok) {
        const session = await getSession();
        if (session?.user) {
          // Track success
          trackOTPVerified(mobile);
          mobileFriction.completeTracking(true);
            await login({
            mobile: mobile,
            apiData: session,
          });
        }
      } else {
        setOtpError(res?.error || "Invalid OTP. Please try again.");
      }
    } catch {
      setOtpError("Verification failed.");
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Mobile Number <span className="text-red-500">*</span>
      </label>

      <div className="space-y-4">
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            inputMode="numeric"
            value={mobile}
            maxLength={10}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, ""));
              setOtpSent(false);
              setOtp("");
              setOtpError("");
            }}
            disabled={otpSent && otpTimer > 0}
            className="w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-[#25B181] border-gray-200 outline-none transition-all"
            placeholder="Enter 10-digit mobile number"
          />
        </div>

        {!otpSent && (
          <button
            onClick={sendOTP}
            type="button"
            disabled={mobile.length !== 10 || otpLoading}
            className="w-full py-3.5 bg-[#25B181] text-white rounded-xl font-bold text-sm hover:bg-[#1d8f6a] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {otpLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {otpLoading ? "Sending OTP..." : "Get OTP"}
          </button>
        )}
      </div>

      {otpSent && (
        <div className="mt-5 space-y-4">
          <input
            type="tel"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="w-full px-4 py-3.5 text-2xl text-center tracking-[0.5em] font-bold border-2 rounded-xl"
            placeholder="000000"
          />

          <div className="flex gap-3">
            <button
              onClick={sendOTP}
              disabled={otpTimer > 0}
              className="flex-1 py-3 border-2 rounded-xl text-xs font-bold"
            >
              {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
            </button>

            <button
              onClick={verifyOTP}
              disabled={otp.length !== 6 || otpVerifying}
              className="flex-[1.5] py-3 bg-emerald-600 text-white rounded-xl font-bold"
            >
              {otpVerifying ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        </div>
      )}

      {otpError && (
        <div className="mt-4 text-xs text-red-600 flex gap-2 bg-red-50 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4" />
          <span>{otpError}</span>
        </div>
      )}
    </div>
  );
};

export default MobileVerify;
