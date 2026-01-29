"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, AlertCircle, CheckCircle } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import { VALIDATION, TIMERS } from "@/lib/constants/quickApplyV2";
import { useQuickApplyTracking, useVerificationFrictionTracking } from "@/lib/hooks/useQuickApplyTracking";

const MobileVerify = () => {
  const { login } = useAuth();

  // Tracking
  const {
    trackOTPRequested,
    trackOTPResend,
    trackOTPVerified,
    trackOTPFailed,
    trackFormError,
    trackAPIError,
  } = useQuickApplyTracking();

  // Mobile verification friction tracking
  const mobileFriction = useVerificationFrictionTracking('aadhaar'); // Using 'aadhaar' as proxy for mobile OTP
  const otpResendCountRef = useRef(0);
  const hasFrictionStarted = useRef(false);

  // Internal state instead of props
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer]);

  const sendOTP = async () => {
    if (!VALIDATION.MOBILE.test(mobile)) {
      const errorMsg = "Enter valid 10-digit mobile";
      setOtpError(errorMsg);
      trackFormError('mobile', errorMsg, 1);
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    // Start friction tracking on first OTP send
    if (!hasFrictionStarted.current) {
      hasFrictionStarted.current = true;
      mobileFriction.startTracking();
    }

    // Track OTP resend
    if (otpResendCountRef.current > 0) {
      trackOTPResend(otpResendCountRef.current);
    }
    otpResendCountRef.current += 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/customer/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setOtpTimer(TIMERS.OTP_RESEND || 30);
        trackOTPRequested(mobile);
      } else {
        const errorMsg = data.message || "Failed to send OTP";
        setOtpError(errorMsg);
        trackFormError('mobile_otp', errorMsg, 1);
      }
    } catch (error) {
      const errorMsg = "Network error. Please try again.";
      setOtpError(errorMsg);
      trackAPIError('/api/auth/customer/create', errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      const errorMsg = "Please enter valid 6-digit OTP";
      setOtpError(errorMsg);
      trackFormError('mobile_otp', errorMsg, 1);
      return;
    }

    setOtpVerifying(true);
    setOtpError("");
    mobileFriction.recordAttempt();

    try {
      const res = await signIn("otp", {
        redirect: false,
        emailOrPhone: mobile,
        otp,
        loginMethod: "mobile",
        callbackUrl: "/apply/quick",
      });

      if (res?.ok) {
        const session = await getSession();
        if (session?.user) {
          // Track success
          trackOTPVerified(mobile);
          mobileFriction.completeTracking(true);
            await login({
            email: session?.user?.email || "",
            apiData: session,
          });
        }
      } else {
        const errorMsg = res?.error || "Invalid OTP";
        setOtpError(errorMsg);
        trackOTPFailed(errorMsg, mobileFriction.getAttempts());
      }
    } catch (error) {
      const errorMsg = "Verification failed.";
      setOtpError(errorMsg);
      trackAPIError('next-auth/otp', errorMsg);
      trackOTPFailed(errorMsg, mobileFriction.getAttempts());
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
        Mobile Number *
      </label>

      <div className="space-y-2">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            inputMode="numeric"
            value={mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setMobile(value);
              setOtpSent(false);
              setOtp("");
              setOtpError("");
            }}
            maxLength={10}
            className="w-full pl-10 pr-3 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-[#25B181] border-gray-200 outline-none"
            placeholder="10-digit mobile"
          />
        </div>

        {!otpSent && (
          <button
            onClick={sendOTP}
            type="button"
            disabled={mobile.length !== 10 || otpLoading}
            className="w-full py-3 bg-[#25B181] text-white rounded-lg font-semibold text-sm hover:bg-[#1d8f6a] disabled:opacity-50 transition-all"
          >
            {otpLoading ? "Sending..." : "Get OTP"}
          </button>
        )}
      </div>

      {otpSent && (
        <div className="mt-3 space-y-3">
          <input
            type="tel"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="w-full px-3 py-3 text-lg text-center tracking-[0.4em] font-mono border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25B181] outline-none"
            placeholder="••••••"
          />
          <div className="flex gap-2">
            <button
              onClick={sendOTP}
              type="button"
              disabled={otpTimer > 0 || otpLoading}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg text-xs font-medium disabled:opacity-50"
            >
              {otpTimer > 0 ? `Resend (${otpTimer}s)` : "Resend"}
            </button>
            <button
              onClick={verifyOTP}
              type="button"
              disabled={otp.length !== 6 || otpVerifying}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {otpVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      )}

      {otpError && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-100">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {otpError}
        </p>
      )}
    </div>
  );
};

export default MobileVerify;