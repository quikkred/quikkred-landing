'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, ArrowRight, ArrowLeft, CheckCircle, AlertCircle,
    Loader2, User, Calendar, MapPin
} from 'lucide-react';
import { QuickApplyV2FormData, AadhaarData } from '@/lib/types/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';
import { useQuickApplyTracking, useVerificationFrictionTracking } from '@/lib/hooks/useQuickApplyTracking';
import useAxios from '@/hooks/useAxios';

// MOCK MODE - Set to false for production with real APIs
const MOCK_MODE = false;
const MOCK_OTP = '123456';

interface PostApprovalAadhaarProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function PostApprovalAadhaar({
    formData,
    setFormData,
    onNext,
    onBack,
}: PostApprovalAadhaarProps) {
    // Tracking
    const {
        trackStepViewed,
        trackStepCompleted,
        trackAadhaarOTPSent,
        trackAadhaarVerifySuccess,
        trackAadhaarVerifyFailed,
        trackAadhaarOTPResend,
        trackFieldFocus,
        trackFieldPaste,
        trackFormError,
        trackAPIError,
    } = useQuickApplyTracking();

    // Aadhaar verification friction tracking
    const aadhaarFriction = useVerificationFrictionTracking('aadhaar');

    // Track step viewed
    const hasTrackedStepRef = useRef(false);
    const otpResendCountRef = useRef(0);
    useEffect(() => {
        if (!hasTrackedStepRef.current) {
            hasTrackedStepRef.current = true;
            trackStepViewed(5, 'Aadhaar Verification');
            aadhaarFriction.startTracking();
        }
    }, [trackStepViewed, aadhaarFriction]);
    const [aadhaar, setAadhaar] = useState(formData.aadhaar || '');
    const [aadhaarError, setAadhaarError] = useState('');
    const axios = useAxios();

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [clientId, setClientId] = useState('');

    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [verified, setVerified] = useState(formData.aadhaarVerified || false);

    const [resendTimer, setResendTimer] = useState(0);
    const [verifyTimer, setVerifyTimer] = useState(0);

    const [aadhaarData, setAadhaarData] = useState<AadhaarData | null>(formData.aadhaarData || null);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    useEffect(() => {
        if (verifyTimer > 0) {
            const timer = setTimeout(() => setVerifyTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [verifyTimer]);

    const validateAadhaar = (value: string): boolean => {
        return /^\d{12}$/.test(value);
    };

    const formatAadhaarDisplay = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join(' ');
        }
        return value;
    };

    const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '').slice(0, 12);
        setAadhaar(rawValue);
        setAadhaarError('');

        if (otpSent) {
            setOtpSent(false);
            setOtp(['', '', '', '', '', '']);
            setOtpError('');
            setClientId('');
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setOtpError('');

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        setOtpError('');

        const focusIndex = Math.min(pastedData.length, 5);
        otpRefs.current[focusIndex]?.focus();
    };

    const sendOTP = async () => {
        if (!validateAadhaar(aadhaar)) {
            const errorMsg = 'Please enter a valid 12-digit Aadhaar number';
            setAadhaarError(errorMsg);
            trackFormError('aadhaar', errorMsg, 5);
            return;
        }

        setSendingOtp(true);
        setAadhaarError('');

        // Track OTP request (resend if already sent once)
        if (otpResendCountRef.current > 0) {
            trackAadhaarOTPResend(otpResendCountRef.current);
        }
        otpResendCountRef.current += 1;

        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setOtpSent(true);
            setClientId('mock_client_123');
            setResendTimer(30);
            setOtp(['', '', '', '', '', '']);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
            trackAadhaarOTPSent();
            setSendingOtp(false);
            return;
        }

        try {
            const response = await axios.post('/api/kyc/aadhaar/send-otp', { aadhaar });
            const data = response.data;

            if (data.success) {
                setOtpSent(true);
                setClientId(data.data?.clientId || data.clientId || '');
                setResendTimer(30);
                setOtp(['', '', '', '', '', '']);
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
                trackAadhaarOTPSent();
            } else {
                const errorMsg = data.message || 'Failed to send OTP. Please try again.';
                setAadhaarError(errorMsg);
                trackFormError('aadhaar', errorMsg, 5);
            }
        } catch (error) {
            const errorMsg = 'Network error. Please check your connection and try again.';
            setAadhaarError(errorMsg);
            trackAPIError('/api/kyc/aadhaar/send-otp', errorMsg);
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyOTP = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            const errorMsg = 'Please enter complete 6-digit OTP';
            setOtpError(errorMsg);
            trackFormError('aadhaar_otp', errorMsg, 5);
            return;
        }

        setVerifyingOtp(true);
        setOtpError('');

        // Record verification attempt
        aadhaarFriction.recordAttempt();

        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (otpValue === MOCK_OTP) {
                const mockAadhaarData: AadhaarData = {
                    name: 'Test User',
                    dob: '15-05-1990',
                    gender: 'Male',
                    address: '123 Test Street, New Delhi - 110001',
                    photo: '',
                    maskedAadhaar: `XXXX XXXX ${aadhaar.slice(-4)}`,
                };

                setAadhaarData(mockAadhaarData);
                setVerified(true);

                setFormData((prev: any) => ({
                    ...prev,
                    aadhaar,
                    aadhaarVerified: true,
                    aadhaarData: mockAadhaarData,
                    fullName: prev.fullName || mockAadhaarData.name,
                    dob: prev.dob || mockAadhaarData.dob,
                }));

                // Track success
                trackAadhaarVerifySuccess();
                aadhaarFriction.completeTracking(true);
                trackStepCompleted(5, 'Aadhaar Verification', {
                    maskedAadhaar: mockAadhaarData.maskedAadhaar,
                });

                console.log('✅ MOCK: Aadhaar verified');
                setTimeout(() => onNext(), 1500);
            } else {
                const errorMsg = 'Invalid OTP. Use: ' + MOCK_OTP;
                setOtpError(errorMsg);
                setVerifyTimer(5);
                trackAadhaarVerifyFailed(errorMsg, aadhaarFriction.getAttempts());
            }
            setVerifyingOtp(false);
            return;
        }

        try {
            const response = await axios.post('/api/kyc/aadhaar/verify-otp', { aadhaar });
            const data = response.data;

            if (data.success) {
                const aadhaarInfo: AadhaarData = {
                    name: data.data?.name || '',
                    dob: data.data?.dob || '',
                    gender: data.data?.gender || '',
                    address: data.data?.address || '',
                    photo: data.data?.photo || '',
                    maskedAadhaar: `XXXX XXXX ${aadhaar.slice(-4)}`,
                };

                setAadhaarData(aadhaarInfo);
                setVerified(true);

                setFormData((prev: any) => ({
                    ...prev,
                    aadhaar,
                    aadhaarVerified: true,
                    aadhaarData: aadhaarInfo,
                    fullName: prev.fullName || aadhaarInfo.name,
                    dob: prev.dob || aadhaarInfo.dob,
                }));

                // ============================================
                // PHASE 1-4: Handle Validation Results
                // ============================================
                if (data.data?.contactValidation) {
                    console.log('📱 Contact Validation:', data.data.contactValidation);
                }
                if (data.data?.duplicateCheck?.isDuplicate) {
                    console.log('🚨 Duplicate Aadhaar:', data.data.duplicateCheck);
                }
                if (data.data?.photoValidation?.photoUploaded) {
                    console.log('📸 Photo uploaded:', data.data.photoValidation.photoUrl);
                }
                if (data.data?.addressValidation?.addressExtracted) {
                    console.log('🏠 Address validation:', data.data.addressValidation);
                }

                // Track success
                trackAadhaarVerifySuccess();
                aadhaarFriction.completeTracking(true);
                trackStepCompleted(5, 'Aadhaar Verification', {
                    maskedAadhaar: aadhaarInfo.maskedAadhaar,
                    contactMatches: data.data?.contactValidation?.contactMatchesAadhaar,
                    isDuplicate: data.data?.duplicateCheck?.isDuplicate,
                });

                setTimeout(() => onNext(), 1500);
            } else {
                const errorMsg = data.message || 'Invalid OTP. Please try again.';
                setOtpError(errorMsg);
                setVerifyTimer(5);
                trackAadhaarVerifyFailed(errorMsg, aadhaarFriction.getAttempts());
            }
        } catch (error) {
            console.error('Aadhaar verify error:', error);
            const errorMsg = 'Verification failed. Please try again.';
            setOtpError(errorMsg);
            setVerifyTimer(5);
            trackAPIError('/api/kyc/aadhaar/verify-otp', errorMsg);
            trackAadhaarVerifyFailed(errorMsg, aadhaarFriction.getAttempts());
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleChangeAadhaar = () => {
        setOtpSent(false);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
        setClientId('');
        setVerified(false);
        setAadhaarData(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Aadhaar Verification</h2>

            {/* Aadhaar Form */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#25B181]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Aadhaar OTP Verification</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">Verify with Aadhaar-linked mobile</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Aadhaar Input */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Aadhaar Number *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    value={formatAadhaarDisplay(aadhaar)}
                                    onChange={handleAadhaarChange}
                                    disabled={otpSent || verified}
                                    maxLength={14}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 tracking-widest text-sm sm:text-base font-mono ${aadhaarError ? 'border-red-500' : verified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                        }`}
                                    placeholder="XXXX XXXX XXXX"
                                />
                                {verified && (
                                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                )}
                            </div>
                            {!otpSent && !verified && (
                                <button
                                    onClick={sendOTP}
                                    disabled={sendingOtp || aadhaar.length !== 12}
                                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#25B181] text-white rounded-lg text-sm font-medium hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap active:scale-[0.98] touch-manipulation"
                                >
                                    {sendingOtp ? 'Sending...' : 'Send OTP'}
                                </button>
                            )}
                            {otpSent && !verified && (
                                <button
                                    onClick={handleChangeAadhaar}
                                    className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 active:scale-[0.98] touch-manipulation"
                                >
                                    Change
                                </button>
                            )}
                            {verified && (
                                <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-green-100 border border-green-300 rounded-lg flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                    <span className="text-xs sm:text-sm font-medium text-green-700">Verified</span>
                                </div>
                            )}
                        </div>
                        {aadhaarError && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-red-600 text-xs">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {aadhaarError}
                            </div>
                        )}
                    </div>

                    {/* OTP Input */}
                    {otpSent && !verified && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                Enter 6-digit OTP sent to Aadhaar-linked mobile
                            </label>
                            <div className="flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => { otpRefs.current[index] = el; }}
                                        type="tel"
                                        inputMode="numeric"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                        maxLength={1}
                                        className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border rounded-lg focus:ring-2 focus:ring-[#25B181] ${otpError ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            {otpError && (
                                <div className="mb-3 sm:mb-4 flex items-center justify-center gap-1.5 text-red-600 text-xs">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {otpError}
                                </div>
                            )}

                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={sendOTP}
                                    disabled={resendTimer > 0 || sendingOtp}
                                    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border border-[#25B181] text-[#25B181] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#25B181]/5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                                >
                                    {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend OTP'}
                                </button>
                                <button
                                    onClick={verifyOTP}
                                    disabled={verifyingOtp || otp.join('').length !== 6 || verifyTimer > 0}
                                    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-[#25B181] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#1d8f6a] disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] touch-manipulation"
                                >
                                    {verifyingOtp ? (
                                        <>
                                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                            <span>Verifying...</span>
                                        </>
                                    ) : verifyTimer > 0 ? (
                                        `Wait (${verifyTimer}s)`
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Verified State */}
                    {verified && aadhaarData && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 rounded-lg p-3 border border-green-200"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500">Name</p>
                                        <p className="font-medium text-xs sm:text-sm text-gray-900">{aadhaarData.name}</p>
                                    </div>
                                </div>

                                {aadhaarData.dob && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-gray-500">Date of Birth</p>
                                            <p className="font-medium text-xs sm:text-sm text-gray-900">{aadhaarData.dob}</p>
                                        </div>
                                    </div>
                                )}

                                {aadhaarData.address && (
                                    <div className="flex items-start gap-2 sm:col-span-2">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-gray-500">Address</p>
                                            <p className="font-medium text-[10px] sm:text-xs text-gray-900">{aadhaarData.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Info Note */}
                    {!verified && (
                        <div className="bg-[#25B181]/10 rounded-lg p-2.5 sm:p-3">
                            <p className="text-[10px] sm:text-xs text-gray-700">
                                <strong>Note:</strong> OTP will be sent to mobile number linked with your Aadhaar.
                                Make sure you have access to that mobile.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
                <button
                    onClick={onBack}
                    disabled={sendingOtp || verifyingOtp}
                    className="px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                {verified && (
                    <button
                        onClick={onNext}
                        className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                    >
                        Continue
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                )}
            </div>

            {/* Progress Note */}
            <p className="text-center text-[10px] sm:text-xs text-gray-500">
                Step 2 of 3: Bank → <span className="font-medium text-[#25B181]">Aadhaar</span> → Selfie
            </p>
        </motion.div>
    );
}
