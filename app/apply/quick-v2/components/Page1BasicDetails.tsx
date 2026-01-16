'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, IndianRupee, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { QuickApplyV2FormData } from '@/lib/types/quickApplyV2';
import { LOAN_CONFIG, VALIDATION, TIMERS, formatCurrency, calculateLoanDetails } from '@/lib/constants/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';

// MOCK MODE - Set to false for production with real APIs
// Set to true only for local testing without backend
const MOCK_MODE = false;
const MOCK_OTP = '123456'; // Only used when MOCK_MODE = true

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Truecaller Icon - Official logo
const TruecallerIcon = () => (
  <img
    src="/truecaller-logo.png"
    alt="Truecaller"
    className="w-5 h-5 sm:w-6 sm:h-6 rounded"
  />
);

interface Page1Props {
  formData: QuickApplyV2FormData;
  setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
  onNext: () => void;
}

export default function Page1BasicDetails({ formData, setFormData, onNext }: Page1Props) {
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Fast Verification States
  const [googleLoading, setGoogleLoading] = useState(false);
  const [truecallerLoading, setTruecallerLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'otp' | 'google' | 'truecaller' | null>(null);

  // Loan calculation
  const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

  // OTP Timer Effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Send OTP
  const sendOTP = async () => {
    if (!VALIDATION.MOBILE.test(formData.mobile)) {
      setOtpError('Enter valid 10-digit mobile');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    // MOCK MODE
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOtpSent(true);
      setOtpTimer(TIMERS.OTP_RESEND);
      setOtpLoading(false);
      console.log('📱 MOCK: OTP sent. Use:', MOCK_OTP);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setOtpTimer(TIMERS.OTP_RESEND);
      } else {
        setOtpError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('Enter 6-digit OTP');
      return;
    }

    setOtpVerifying(true);
    setOtpError('');

    // MOCK MODE
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (otp === MOCK_OTP) {
        localStorage.setItem('accessToken', 'mock_token_123');
        localStorage.setItem('refreshToken', 'mock_refresh_123');
        setFormData(prev => ({ ...prev, mobileVerified: true }));
        setVerificationMethod('otp');
        console.log('✅ MOCK: OTP verified successfully');
      } else {
        setOtpError('Invalid OTP. Use: ' + MOCK_OTP);
      }
      setOtpVerifying(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile, otp }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        if (data.data?.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
        }
        if (data.data?.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }

        setFormData(prev => ({ ...prev, mobileVerified: true }));
        setVerificationMethod('otp');
      } else {
        setOtpError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setOtpVerifying(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setOtpError('');

    // MOCK MODE
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock Google user data
      const mockGoogleUser = {
        email: 'testuser@gmail.com',
        name: 'Test User',
        mobile: '9876543210',
      };

      localStorage.setItem('accessToken', 'google_mock_token_123');
      localStorage.setItem('refreshToken', 'google_mock_refresh_123');

      setFormData(prev => ({
        ...prev,
        mobile: mockGoogleUser.mobile,
        mobileVerified: true,
        email: mockGoogleUser.email,
        fullName: mockGoogleUser.name,
      }));

      setVerificationMethod('google');
      console.log('✅ MOCK: Google OAuth successful -', mockGoogleUser.email);
      setGoogleLoading(false);
      return;
    }

    // TODO: @Deepakdhiman - Implement real Google OAuth
    // 1. Import googleOAuthService from '@/lib/services/googleOAuth.service'
    // 2. Call googleOAuthService.signIn() to get user profile
    // 3. Send user data to backend: POST /api/auth/google-login
    // 4. Store tokens and update formData with user info
    // See: lib/services/googleOAuth.service.ts for interface
    try {
      // const response = await googleOAuthService.signIn();
      // if (response.success && response.user) {
      //   const backendRes = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       email: response.user.email,
      //       name: response.user.name,
      //       googleId: response.user.id,
      //     }),
      //   });
      //   const data = await backendRes.json();
      //   if (data.success) {
      //     localStorage.setItem('accessToken', data.data.token);
      //     setFormData(prev => ({ ...prev, mobile: data.data.mobile, mobileVerified: true, ... }));
      //     setVerificationMethod('google');
      //   }
      // }
      console.log('[Google OAuth] To be implemented by Deepakdhiman');
      setOtpError('Google OAuth coming soon. Please use OTP verification.');
    } catch (error) {
      setOtpError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Truecaller Verification Handler
  const handleTruecallerVerify = async () => {
    setTruecallerLoading(true);
    setOtpError('');

    // MOCK MODE
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock Truecaller data
      const mockTruecallerUser = {
        phoneNumber: '9876543210',
        firstName: 'Test',
        lastName: 'User',
        verified: true,
      };

      localStorage.setItem('accessToken', 'truecaller_mock_token_123');
      localStorage.setItem('refreshToken', 'truecaller_mock_refresh_123');

      setFormData(prev => ({
        ...prev,
        mobile: mockTruecallerUser.phoneNumber,
        mobileVerified: true,
        fullName: `${mockTruecallerUser.firstName} ${mockTruecallerUser.lastName}`,
      }));

      setVerificationMethod('truecaller');
      console.log('✅ MOCK: Truecaller verified -', mockTruecallerUser.phoneNumber);
      setTruecallerLoading(false);
      return;
    }

    // TODO: @Deepakdhiman - Implement real Truecaller SDK verification
    // 1. Import truecallerService from '@/lib/services/truecaller.service'
    // 2. Call truecallerService.verify() to open Truecaller popup
    // 3. On success, send profile to backend: POST /api/auth/truecaller-verify
    // 4. Store tokens and update formData with phone number
    // See: lib/services/truecaller.service.ts for interface
    // Docs: https://docs.truecaller.com/truecaller-sdk/web/integration-steps
    try {
      // const response = await truecallerService.verify();
      // if (response.success && response.profile) {
      //   const backendRes = await fetch(`${API_BASE_URL}/api/auth/truecaller-verify`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       phoneNumber: response.profile.phoneNumber,
      //       firstName: response.profile.firstName,
      //       lastName: response.profile.lastName,
      //       requestId: response.requestId,
      //     }),
      //   });
      //   const data = await backendRes.json();
      //   if (data.success) {
      //     localStorage.setItem('accessToken', data.data.token);
      //     setFormData(prev => ({ ...prev, mobile: data.data.mobile, mobileVerified: true, ... }));
      //     setVerificationMethod('truecaller');
      //   }
      // }
      console.log('[Truecaller] To be implemented by Deepakdhiman');
      setOtpError('Truecaller verification coming soon. Please use OTP.');
    } catch (error) {
      setOtpError('Truecaller verification failed. Please try again.');
    } finally {
      setTruecallerLoading(false);
    }
  };

  // Check if can proceed
  const canProceed = formData.mobileVerified &&
                     formData.loanAmount >= LOAN_CONFIG.MIN_AMOUNT &&
                     formData.loanAmount <= LOAN_CONFIG.MAX_AMOUNT;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3 sm:space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Get Instant Cash</h2>

      {/* Fast Verification Options - Compact */}
      {!formData.mobileVerified && (
        <div className="bg-gradient-to-r from-[#25B181]/5 to-[#51C9AF]/5 rounded-xl p-3 sm:p-4 border border-[#25B181]/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#25B181]" />
            <span className="text-sm font-semibold text-gray-900">Quick Verify</span>
            <span className="text-[9px] sm:text-[10px] bg-[#25B181] text-white px-1.5 py-0.5 rounded-full">Fastest</span>
          </div>

          <div className="flex gap-2">
            {/* Truecaller Button */}
            <button
              onClick={handleTruecallerVerify}
              disabled={truecallerLoading || googleLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-white border-2 border-[#0066FF] rounded-lg font-medium text-xs sm:text-sm text-gray-800 hover:bg-[#0066FF]/5 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
            >
              {truecallerLoading ? (
                <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <TruecallerIcon />
                  <span className="hidden xs:inline">Truecaller</span>
                </>
              )}
            </button>

            {/* Google Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={googleLoading || truecallerLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg font-medium text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  <span className="hidden xs:inline">Google</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-[10px] text-gray-500">or enter mobile</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
        </div>
      )}

      {/* Verification Method Badge - Compact */}
      {formData.mobileVerified && verificationMethod && (
        <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-xs sm:text-sm text-green-700">
            Verified via {verificationMethod === 'truecaller' ? 'Truecaller' : verificationMethod === 'google' ? 'Google' : 'OTP'}
          </span>
          {verificationMethod !== 'otp' && (
            <span className="ml-auto text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" />Fast
            </span>
          )}
        </div>
      )}

      {/* Mobile Verification - Compact */}
      <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Mobile Number *
        </label>
        <div className="space-y-2">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              inputMode="numeric"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData(prev => ({ ...prev, mobile: value, mobileVerified: false }));
                setOtpSent(false);
                setOtp('');
                setOtpError('');
              }}
              disabled={formData.mobileVerified}
              maxLength={10}
              className={`w-full pl-10 pr-3 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] disabled:bg-gray-100 transition-all ${
                otpError && !otpSent ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="10-digit mobile"
            />
            {formData.mobileVerified && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
            )}
          </div>

          {!formData.mobileVerified && !otpSent && (
            <button
              onClick={sendOTP}
              disabled={formData.mobile.length !== 10 || otpLoading}
              className="w-full py-3 bg-[#25B181] text-white rounded-lg font-semibold text-sm hover:bg-[#1d8f6a] disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
            >
              {otpLoading ? 'Sending...' : 'Send OTP'}
            </button>
          )}
        </div>

        {/* OTP Input - Compact */}
        {otpSent && !formData.mobileVerified && (
          <div className="mt-3 space-y-2">
            <label className="block text-xs text-gray-600">
              OTP sent to +91 {formData.mobile}
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setOtpError('');
              }}
              maxLength={6}
              className="w-full px-3 py-3 text-lg text-center tracking-[0.4em] font-mono border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181]"
              placeholder="• • • • • •"
              autoComplete="one-time-code"
            />
            <div className="flex gap-2">
              <button
                onClick={sendOTP}
                disabled={otpTimer > 0 || otpLoading}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg text-sm font-medium disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
              >
                {otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend'}
              </button>
              <button
                onClick={verifyOTP}
                disabled={otp.length !== 6 || otpVerifying}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation"
              >
                {otpVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        )}

        {otpError && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {otpError}
          </p>
        )}
      </div>

      {/* Loan Amount - Compact */}
      <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-xl p-3 sm:p-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          How much do you need?
        </label>
        <div className="flex items-center justify-center gap-1 mb-3">
          <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-[#25B181]" />
          <span className="text-3xl sm:text-4xl font-bold text-gray-900">
            {(formData.loanAmount / 1000).toFixed(0)}K
          </span>
        </div>

        {/* Slider */}
        <div className="px-1">
          <input
            type="range"
            min={LOAN_CONFIG.MIN_AMOUNT}
            max={LOAN_CONFIG.MAX_AMOUNT}
            step={5000}
            value={formData.loanAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, loanAmount: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#25B181] touch-manipulation
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#25B181] [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-white"
          />
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
          <span>₹{(LOAN_CONFIG.MIN_AMOUNT / 1000)}K</span>
          <span>₹{(LOAN_CONFIG.MAX_AMOUNT / 1000)}K</span>
        </div>
      </div>

      {/* Tenure - Compact */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Repayment Period
        </label>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {LOAN_CONFIG.TENURE_OPTIONS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tenure: days }))}
              className={`py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all active:scale-[0.95] touch-manipulation ${
                formData.tenure === days
                  ? 'bg-[#25B181] text-white shadow-md shadow-[#25B181]/30'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#25B181]'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Loan Summary - Compact */}
      <div className="bg-white border-2 border-gray-100 rounded-xl p-3 space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">You&apos;ll receive</span>
          <span className="text-base sm:text-lg font-bold text-[#25B181]">{formatCurrency(loanCalc.netDisbursalAmount)}</span>
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
          <span>Processing + GST</span>
          <span>- {formatCurrency(loanCalc.totalDeductions)}</span>
        </div>
        <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
          <span className="text-xs sm:text-sm text-gray-700">Repay in {formData.tenure} days</span>
          <span className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(loanCalc.totalRepayment)}</span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-[#25B181]/30 hover:shadow-xl disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center gap-2"
      >
        Continue
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </motion.div>
  );
}
