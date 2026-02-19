"use client";

import React, { useState, useEffect } from "react";
import { Mail, AlertCircle, Loader2, ArrowRight, CheckCircle2, Edit2, Timer } from "lucide-react";
import OTPField from "./OTPField";
import { signIn, getSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { TIMERS } from "@/lib/constants/quickApplyV2";
import useAxios from "@/hooks/useAxios";
import { useQuickApplyTracking, useVerificationFrictionTracking } from "@/lib/hooks";
import { useApplication } from "@/contexts/ApplicationContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only @gmail.com addresses are allowed"),
});

type FormData = {
  email: string;
};

const EmailVerify = ({
  callback,
}: {
  callback?: () => void;
}) => {
  const { login } = useAuth();
  const { getApplication } = useApplication();
  const axios = useAxios();


  // Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const email = watch("email");

  // State
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const { trackOTPVerified } = useQuickApplyTracking();
  const emailFriction = useVerificationFrictionTracking('email');

  // Timer Logic
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer]);

  // Focus OTP input when sent


  /* ---------------- SEND OTP ---------------- */
  const onSendOTP = async (data: FormData) => {
    setOtpLoading(true);
    setOtpError("");
    const normalizedEmail = data.email.toLowerCase();

    try {
      const response = await axios.post("/api/auth/customer/create", {
        email: normalizedEmail,
        type: "email_verification",
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

    const normalizedEmail = email?.toLowerCase() || "";

    try {
      const res = await signIn("otp", {
        redirect: false,
        emailOrPhone: normalizedEmail,
        otp,
        loginMethod: "email",
        callbackUrl: "/apply/quick-v2",
      });

      if (res?.ok) {
        const session = await getSession();
        if (session?.user) {
          trackOTPVerified(normalizedEmail);
          emailFriction.completeTracking(true);
          getApplication();
          await login({
            email: normalizedEmail,
            apiData: session,
          });
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
  const handleEditEmail = () => {
    setOtpSent(false);
    setOtp("");
    setOtpError("");
    setOtpTimer(0);
  };

  return (
    <div className="w-full">
      {/* Input Group */}
      <div className="space-y-4">

        {/* Email Input Field */}
        <div className={`relative transition-all duration-300 ${otpSent ? "opacity-75" : "opacity-100"}`}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {otpSent ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Mail className="w-5 h-5" />}
          </div>

          <input
            type="email"
            {...register("email")}
            disabled={otpSent || otpLoading}
            className={`
              w-full pl-12 pr-12 py-3.5 
              text-base font-medium text-gray-900 
              bg-white border rounded-xl outline-none transition-all
              ${errors.email || otpError ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"}
              disabled:bg-gray-50 disabled:text-gray-500
            `}
            placeholder="Enter email address"
          />

          {/* Edit Button */}
          {otpSent && (
            <button
              onClick={handleEditEmail}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg text-emerald-600 transition-colors"
              title="Change email"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Validation Error Message */}
        {errors.email && (
          <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>
        )}

        {/* Phase 1: Get OTP Button */}
        {!otpSent && (
          <button
            onClick={handleSubmit(onSendOTP)}
            disabled={otpLoading}
            className={`
              w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
              ${!errors.email && email
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
            <div className="text-center sm:text-left">
              <label className="text-sm font-medium text-gray-700">Enter verification code</label>
              <p className="text-xs text-gray-500 mt-1">We've sent a 6-digit code to your email</p>
            </div>
            <OTPField
              value={otp}
              onChange={(val) => {
                setOtp(val);
                setOtpError("");
              }}
              length={6}
              error={!!otpError}
              autoFocus={otpSent}
            />

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
                onClick={handleSubmit(onSendOTP)}
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
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
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

export default EmailVerify;