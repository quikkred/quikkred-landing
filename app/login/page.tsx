"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";

// export const dynamic = 'force-dynamic';
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Home,
  ArrowRight,
  Chrome,
  Facebook,
  Smartphone,
  Award,
  KeyRound
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast, Toaster } from "@/components/ui/toast";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { API_BASE_URL, QUICK_FORM_URL } from '@/lib/config';
import { getSession, signIn } from "next-auth/react";
import useAxios from "@/hooks/useAxios";
import GoogleVerify from "../apply/quick/components/ui/GoogleVerify";
import TruecallerVerify from "../apply/quick/components/ui/TruecallerVerify";
import DigiLockerVerify from "../apply/quick/components/ui/DigiLockerVerify";
import OTPField from "../apply/quick/components/ui/OTPField";

interface LoginForm {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMethod] = useState<'phone'>('phone');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('otp');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState<LoginForm>({
    emailOrPhone: "",
    password: "",
    rememberMe: false
  });
  const [mobileError, setMobileError] = useState("");
  const [digiLockerProcessing, setDigiLockerProcessing] = useState(false);
  const axios = useAxios();
  const searchParams = useSearchParams();
  const [isIOS, setIsIOS] = useState(false);

  // 1. Detect Platform & Mount
  useEffect(() => {
    // iOS Detection Regex
    if (typeof navigator !== "undefined") {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(isIOSDevice);
    }
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // DigiLocker callback handler
  useEffect(() => {
    const requestId = searchParams.get("requestId");
    const status = searchParams.get("status");

    if (requestId && status === "success" && !digiLockerProcessing) {
      setDigiLockerProcessing(true);

      (async () => {
        try {
          const res = await signIn("digilocker", {
            redirect: false,
            requestId,
          });

          if (res?.ok) {
            const userData = await getSession();
            toast({
              variant: "success",
              title: "Login Successful!",
              description: "Welcome! Redirecting to your dashboard...",
            });
            if (userData) {
              await login({
                apiData: userData,
                email: userData?.user?.email || "",
              });
            }
            router.push("/user");
          } else {
            toast({
              variant: "error",
              title: "DigiLocker Login Failed",
              description: res?.error || "Authentication failed. Please try again.",
            });
            setDigiLockerProcessing(false);
          }
        } catch (err: any) {
          toast({
            variant: "error",
            title: "Error",
            description: err?.message || "DigiLocker login failed. Please try again.",
          });
          setDigiLockerProcessing(false);
        }
      })();
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Special handling for phone number - only allow numbers and validate 10 digits
    if (name === 'emailOrPhone' && loginMethod === 'phone') {
      if (value && !/^\d*$/.test(value)) {
        setMobileError("Mobile number can only contain numbers");
        return; // Don't update if non-numeric
      } else if (value && value.length > 0 && value.length !== 10) {
        // Show error if not exactly 10 digits (but allow typing)
        setMobileError("Mobile number must be exactly 10 digits");
      } else if (value && value.length === 10 && !/^[6-9]\d{9}$/.test(value)) {
        // Validate Indian mobile number format
        setMobileError("Mobile number must start with 6, 7, 8, or 9");
      } else {
        // Clear error when valid input
        setMobileError("");
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const sendOtp = async () => {
    if (!formData.emailOrPhone) {
      setError("Please enter your mobile number");
      return;
    }

    if (loginMethod === 'phone' && mobileError) {
      setError(mobileError);
      return;
    }

    const isResend = otpSent; // Check if this is a resend
    setSendingOtp(true);
    setError(null);

    try {
      const payload = { mobile: formData.emailOrPhone };

      // const response = await fetch(`${API_BASE_URL}/api/auth/customer/login`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // const data = await response.json();

      const response = await axios.post('/api/auth/customer/login', payload);
      const data = response.data;

      // if (response.ok && data.success) {
      if (response.status === 200 || response.status === 201) {
        setOtpSent(true);
        setResendTimer(15); // Start 15-second countdown
        toast({
          variant: "success",
          title: isResend ? "OTP Resent Successfully!" : "OTP Sent Successfully!",
          description: isResend
            ? "A new OTP has been sent to your mobile number. Please check and enter it below."
            : "A one-time password has been sent to your mobile number. Please check and enter it below.",
        });
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
        toast({
          variant: "error",
          title: "Failed to Send OTP",
          description: data.message || 'Please try again.',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      toast({
        variant: "error",
        title: "Error",
        description: err.message || 'Failed to send OTP. Please try again.',
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter valid 6-digit OTP");
      toast({
        variant: "warning",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
      });
      return;
    }

    setVerifyingOtp(true);
    setError(null);

    try {
      // ✅ Call NextAuth OTP provider (it will call backend verifyOtp inside authorize())
      const res = await signIn("otp", {
        redirect: false,
        emailOrPhone: formData.emailOrPhone,
        otp,
        loginMethod,
      });

      // NextAuth returns { ok, error, status, url }
      if (res?.ok) {
        const userData = await getSession();
        
        toast({
          variant: "success",
          title: "Login Successful!",
          description: "Welcome back! Redirecting to your dashboard...",
        });

        // ✅ redirect where you want
        // router.push("/dashboard");
        if (userData) {
          await login({
            apiData: userData,
            email: userData?.user?.email || "",
          });
        }
        router.push("/user");
        return;
      }

      // If credentials invalid, NextAuth usually returns error: "CredentialsSignin"
      setError("Invalid OTP. Please try again.");
      toast({
        variant: "error",
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
      });
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please try again.");
      toast({
        variant: "error",
        title: "Verification Error",
        description: err?.message || "Verification failed. Please try again.",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMethod === 'otp') {
      if (!otpSent) {
        await sendOtp();
      } else {
        await verifyOtp();
      }
    } else {
      try {
        const success = await login({
          email: formData.emailOrPhone || "",
        });

        if (success) {
          toast({
            variant: "success",
            title: "Login Successful!",
            description: "Welcome back! Redirecting to your dashboard...",
          });
          // Note: The login function in AuthContext handles redirection to appropriate dashboard
          // based on user role. It will redirect to /admin for admin users automatically.
        } else {
          setError('Invalid email/phone or password. Please try again.');
          toast({
            variant: "error",
            title: "Login Failed",
            description: "Invalid email/phone or password. Please try again.",
          });
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred. Please try again.');
        toast({
          variant: "error",
          title: "Error",
          description: err.message || 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  const securityFeatures = [
    { icon: Shield, text: "256-bit SSL Encryption" },
    { icon: CheckCircle, text: "RBI Compliant Security" },
    { icon: Award, text: "ISO 27001 Certified" },
    { icon: KeyRound, text: "Multi-Factor Authentication" }
  ];

  if (digiLockerProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2B63B5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Processing DigiLocker Login...</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify your identity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding & Security */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
                  <span className="bg-gradient-to-r from-[#25B181] to-[#1F8F68] bg-clip-text text-transparent">Welcome Back</span>
                </h1>
                <p className="text-xl text-gray-700">
                  Access your Quikkred account and continue your financial journey!
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Mobile App</h3>
                    <p className="text-xs text-gray-700">
                      Download our mobile app for quick access to your account on the go.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[#34d399]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Secure & Safe</h3>
                    <p className="text-xs text-gray-700">
                      Your data is protected with industry-leading security measures.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#fbbf24]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">RBI Regulated</h3>
                    <p className="text-xs text-gray-700">
                      All loans are provided by Satsai Finlease Private Limited, an RBI registered NBFC. Quikkred is the technology and servicing partner.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              {activeTab === 'login' ? (
                <form onSubmit={handleSubmit} className="space-y-3">

                  {/* Login Method Toggle */}

                  {/* <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('email');
                        setOtpSent(false);
                        setOtp("");
                        setResendTimer(0);
                        setMobileError("");
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        loginMethod === 'email'
                          ? 'bg-white text-[#0ea5e9] shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('phone');
                        setOtpSent(false);
                        setOtp("");
                        setResendTimer(0);
                        setMobileError("");
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        loginMethod === 'phone'
                          ? 'bg-white text-[#0ea5e9] shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </button>
                  </div> */}

                  {/* Auth Method Toggle (Password or OTP) */}
                  {/* <div className="flex bg-emerald-50 rounded-lg p-1 border border-emerald-200">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('password');
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        authMethod === 'password'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('otp');
                        setFormData(prev => ({ ...prev, password: "" }));
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        authMethod === 'otp'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 inline mr-2" />
                      OTP Login
                    </button>
                  </div> */}

                  {/* google auth */}
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                    <GoogleVerify buttonText="Continue with google" />
                    {
                      !isIOS && <TruecallerVerify buttonText="Continue with truecaller" />

                    }

                    <DigiLockerVerify buttonText="Continue with DigiLocker" />
                  </div>

                  <div className="my-3 flex w-full items-center gap-3 text-sm text-neutral-500">
                    <div className="flex-1 border-t border-neutral-400" />
                    <span className="shrink-0 leading-none">or continue with mobile OTP</span>
                    <div className="flex-1 border-t border-neutral-400" />
                  </div>

                  {/* Email/Phone Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="emailOrPhone"
                        value={formData.emailOrPhone}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white ${mobileError ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter 10-digit mobile number"
                      />
                    </div>
                    {mobileError && (
                      <p className="mt-1 text-xs text-red-600">{mobileError}</p>
                    )}
                  </div>

                  {/* Password Input or OTP Section */}
                  {authMethod === 'password' ? (
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!otpSent ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-medium text-emerald-900">Login with OTP</h4>
                          </div>
                          <p className="text-sm text-emerald-700 mb-3">
                            Enter your mobile number and we&apos;ll send a one-time password to continue securely.
                          </p>
                          {/* <button
                            type="button"
                            onClick={sendOtp}
                            disabled={!formData.emailOrPhone || sendingOtp}
                            className="w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
                          </button> */}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <label className="block text-sm font-medium mb-2">Enter OTP</label>
                          {/* <div className="relative">
                            <KeyRound className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={otp}
                              onChange={(val: string) => {
                                setOtp(val);
                                if (error) setError(null);
                              }}
                              length={6}
                              error={!!error}
                              autoFocus={true}
                            />
                          </div> */}
                          <div className="flex justify-center py-2">
                            <OTPField
                              value={otp}
                              onChange={(val: string) => {
                                setOtp(val);
                                if (error) setError(null);
                              }}
                              length={6}
                              error={!!error}
                              autoFocus={true}
                            />
                          </div>
                          <div className="mt-3 flex justify-between items-center text-sm">
                            <span className="text-gray-600">Didn't receive OTP?</span>
                            <button
                              type="button"
                              onClick={sendOtp}
                              disabled={sendingOtp || resendTimer > 0}
                              className="text-[#25B181] hover:text-[#1F8F68] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                            >
                              {sendingOtp
                                ? 'Sending...'
                                : resendTimer > 0
                                  ? `Resend OTP (${resendTimer}s)`
                                  : 'Resend OTP'
                              }
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Remember Me & Forgot Password (only for password login) */}
                  {authMethod === 'password' && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-[#25B181] focus:ring-[#25B181]"
                        />
                        <span className="ml-2 text-sm text-gray-700">Remember me</span>
                      </label>
                      <Link href="/forgot-password" className="text-sm text-[#25B181] hover:text-[#1F8F68] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-700">{error}</span>
                    </motion.div>
                  )}

                  {/* Buttons Container */}
                  <div className="space-y-3">


                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={isLoading || sendingOtp || verifyingOtp || (authMethod === 'otp' && otpSent && otp.length !== 6)}
                      className="w-full bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {(isLoading || sendingOtp || verifyingOtp) ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <User className="w-5 h-5 mr-2" />
                      )}
                      {authMethod === 'otp'
                        ? (otpSent
                          ? (verifyingOtp ? 'Verifying...' : 'Verify OTP & Login')
                          : (sendingOtp ? 'Sending OTP...' : 'Send OTP'))
                        : (isLoading ? 'Signing In...' : 'Sign In')
                      }
                    </button>

                    {/* Apply Now Button */}
                    <Link href={QUICK_FORM_URL as string} className="block">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                      >
                        {t.common.apply}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>

                  {/* Divider */}
                  {/* <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div> */}

                  {/* Social Login */}
                  {/* <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Chrome className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div> */}
                </form>
              ) : (
                /* Registration Form */
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-full mb-6 shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">New to Quikkred?</h3>
                  <p className="text-gray-700 mb-6">
                    Join thousands who have already transformed their financial journey with instant AI-powered loans.
                  </p>
                  <Link href={QUICK_FORM_URL as string}>
                    <button className="w-full bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all mb-4">
                      Start Your Application
                    </button>
                  </Link>
                  {/* <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-[#0ea5e9] hover:underline"
                    >
                      Sign in here
                    </button>
                  </p> */}
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Secure Login</p>
                    <p className="text-blue-700">
                      Your login is protected by bank-grade encryption and multi-factor authentication.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}