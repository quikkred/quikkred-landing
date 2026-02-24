"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, AlertCircle, Loader2, ArrowRight, CheckCircle2, Edit2, Timer } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { VALIDATION, TIMERS } from "@/lib/constants/quickApplyV2";
import useAxios from "@/hooks/useAxios";
import { useQuickApplyTracking, useVerificationFrictionTracking } from "@/lib/hooks";
import { useApplication } from "@/contexts/ApplicationContext";

const MobileVerify = ({
  callback,
}: {
  callback?: () => void;
}) => {
  const { login } = useAuth();
  const { getApplication } = useApplication();
  const axios = useAxios();
  const otpInputRef = useRef<HTMLInputElement>(null);

  // State
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const { trackOTPVerified } = useQuickApplyTracking();
  const mobileFriction = useVerificationFrictionTracking('mobile');

  // Timer Logic
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer]);

  // Focus OTP input when sent
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent]);

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
        callbackUrl: "/apply/quick",
      });

      if (res?.ok) {
        const session = await getSession();
        if (session?.user) {
          trackOTPVerified(mobile);
          mobileFriction.completeTracking(true);
          await login({
            mobile: mobile,
            apiData: session,
          });
          getApplication();
          callback?.();
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

  /* ---------------- RESET ---------------- */
  const handleEditNumber = () => {
    setOtpSent(false);
    setOtp("");
    setOtpError("");
    setOtpTimer(0);
  };

  return (
    <div className="w-full">
      <p className="text-[10px] sm:text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 mb-3">
        Enter the mobile number linked to your Aadhaar.
      </p>
      {/* Input Group */}
      <div className="space-y-4">

        {/* Mobile Input Field */}
        <div className={`relative transition-all duration-300 ${otpSent ? "opacity-75" : "opacity-100"}`}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {otpSent ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Phone className="w-5 h-5" />}
          </div>

          <input
            type="tel"
            inputMode="numeric"
            value={mobile}
            maxLength={10}
            disabled={otpSent || otpLoading}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, ""));
              setOtpError("");
            }}
            className={`
              w-full pl-12 pr-12 py-3.5 
              text-base font-medium text-gray-900 
              bg-white border rounded-xl outline-none transition-all
              ${otpError ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"}
              disabled:bg-gray-50 disabled:text-gray-500
            `}
            placeholder="Enter 10-digit number"
          />

          {/* Edit Button (Only visible when OTP is sent) */}
          {otpSent && (
            <button
              onClick={handleEditNumber}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg text-emerald-600 transition-colors"
              title="Change number"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Phase 1: Get OTP Button */}
        {!otpSent && (
          <button
            onClick={sendOTP}
            disabled={mobile.length !== 10 || otpLoading}
            className={`
              w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
              ${mobile.length === 10
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}
            `}
          >
            {otpLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Secure OTP...</span>
              </>
            ) : (
              <>
                <span>Get Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}

        {/* Phase 2: OTP Verification Area */}
        {otpSent && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">

            <div className="relative">
              <input
                ref={otpInputRef}
                type="tel"
                inputMode="numeric"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError("");
                }}
                maxLength={6}
                className={`
                  w-full py-3 text-center text-xl tracking-[0.75em] font-bold text-gray-800
                  border-2 rounded-xl outline-none transition-all
                  placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm
                  ${otpError
                    ? "border-red-300 bg-red-50/50 focus:border-red-500"
                    : "border-emerald-500/30 bg-emerald-50/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"}
                `}
                placeholder="• • • • • •"
              />
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Timer className="w-3.5 h-3.5" />
                {otpTimer > 0 ? (
                  <span>Resend in <span className="font-mono font-medium text-gray-700">{otpTimer}s</span></span>
                ) : (
                  <span className="text-gray-400">Code expired?</span>
                )}
              </div>

              <button
                onClick={sendOTP}
                disabled={otpTimer > 0 || otpLoading}
                className={`
                  font-semibold transition-colors
                  ${otpTimer > 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-emerald-600 hover:text-emerald-700 hover:underline"}
                `}
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={verifyOTP}
              disabled={otp.length !== 6 || otpVerifying}
              className={`
                w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                ${otp.length === 6
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 translate-y-0"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {otpVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                "Verify & Proceed"
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {otpError && (
          <div className="animate-in slide-in-from-top-1 fade-in duration-200 bg-red-50 text-red-600 text-xs font-medium px-4 py-3 rounded-lg flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{otpError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileVerify;