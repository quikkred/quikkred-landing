'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard, CheckCircle, Loader2,
    AlertCircle, ArrowRight, ArrowLeft, User, Calendar, Lock,
    Briefcase, IndianRupee, CalendarDays
} from 'lucide-react';
import { QuickApplyV2FormData, PANData } from '@/lib/types/quickApplyV2';
import {
    isValidPAN, formatCurrency, calculateLoanDetails, TIMERS,
    EMPLOYMENT_TYPES, SALARY_DATES
} from '@/lib/constants/quickApplyV2';
import { API_BASE_URL } from '@/lib/config';

// MOCK MODE - Set to false for production with real APIs
// Set to true only for local testing without backend
const MOCK_MODE = false;

interface Page2Props {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack: () => void;
}

export default function Page2PANBank({
    formData,
    setFormData,
    onNext,
    onBack,
}: Page2Props) {
    // PAN States
    const [panLoading, setPanLoading] = useState(false);
    const [panError, setPanError] = useState('');
    const [panReverifyTimer, setPanReverifyTimer] = useState(0);

    // Form Errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Submit Loading
    const [submitLoading, setSubmitLoading] = useState(false);

    // Loan calculation
    const loanCalc = calculateLoanDetails(formData.loanAmount, formData.tenure);

    // PAN Reverify Timer Effect
    useEffect(() => {
        if (panReverifyTimer > 0) {
            const timer = setTimeout(() => setPanReverifyTimer(panReverifyTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [panReverifyTimer]);

    // Handle PAN Input with auto-verify
    const handlePANChange = (value: string) => {
        const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        setFormData(prev => ({
            ...prev,
            pan: cleaned,
            panVerified: false,
            panData: null,
            fullName: '',
            dob: '',
        }));
        setPanError('');

        // Auto-verify when valid PAN is entered
        if (cleaned.length === 10 && isValidPAN(cleaned)) {
            setTimeout(() => autoVerifyPAN(cleaned), 300);
        }
    };

    // Auto-verify PAN
    const autoVerifyPAN = async (pan: string) => {
        if (panLoading || formData.panVerified) return;

        setPanLoading(true);
        setPanError('');

        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            const mockPanData: PANData = {
                panNumber: pan,
                fullName: 'Test User',
                dateOfBirth: '1990-05-15',
                gender: 'Male',
                maskedAadhaar: 'XXXX-XXXX-1234',
            };

            setFormData(prev => ({
                ...prev,
                panVerified: true,
                panData: mockPanData,
                fullName: mockPanData.fullName,
                dob: mockPanData.dateOfBirth,
            }));

            setPanReverifyTimer(TIMERS.REVERIFY_COOLDOWN);
            console.log('✅ MOCK: PAN auto-verified -', pan);
            setPanLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/kyc/pan/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ panNumber: pan }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                const panData: PANData = {
                    panNumber: data.data.panNumber || pan,
                    fullName: data.data.fullName || data.data.name || '',
                    dateOfBirth: data.data.dateOfBirth || data.data.dob || '',
                    gender: data.data.gender,
                    maskedAadhaar: data.data.aadhaar || data.data.maskedAadhaar,
                };

                setFormData(prev => ({
                    ...prev,
                    panVerified: true,
                    panData,
                    fullName: panData.fullName,
                    dob: panData.dateOfBirth,
                }));

                setPanReverifyTimer(TIMERS.REVERIFY_COOLDOWN);
            } else {
                setPanError(data.message || 'PAN verification failed');
            }
        } catch (error) {
            setPanError('Verification failed. Please try again.');
        } finally {
            setPanLoading(false);
        }
    };

    // Verify PAN
    const handleVerifyPAN = async () => {
        if (!isValidPAN(formData.pan)) {
            setPanError('Invalid PAN format. Example: ABCDE1234F');
            return;
        }

        setPanLoading(true);
        setPanError('');

        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            const mockPanData: PANData = {
                panNumber: formData.pan,
                fullName: 'Test User',
                dateOfBirth: '1990-05-15',
                gender: 'Male',
                maskedAadhaar: 'XXXX-XXXX-1234',
            };

            setFormData(prev => ({
                ...prev,
                panVerified: true,
                panData: mockPanData,
                fullName: mockPanData.fullName,
                dob: mockPanData.dateOfBirth,
            }));

            setPanReverifyTimer(TIMERS.REVERIFY_COOLDOWN);
            console.log('✅ MOCK: PAN verified -', formData.pan);
            setPanLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/kyc/pan/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    panNumber: formData.pan,
                }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                const panData: PANData = {
                    panNumber: data.data.panNumber || formData.pan,
                    fullName: data.data.fullName || data.data.name || '',
                    dateOfBirth: data.data.dateOfBirth || data.data.dob || '',
                    gender: data.data.gender,
                    maskedAadhaar: data.data.aadhaar || data.data.maskedAadhaar,
                };

                setFormData(prev => ({
                    ...prev,
                    panVerified: true,
                    panData,
                    fullName: panData.fullName,
                    dob: panData.dateOfBirth,
                }));

                setPanReverifyTimer(TIMERS.REVERIFY_COOLDOWN);
            } else {
                setPanError(data.message || 'PAN verification failed');
            }
        } catch (error) {
            setPanError('Verification failed. Please try again.');
        } finally {
            setPanLoading(false);
        }
    };

    // Format DOB for display
    const formatDOB = (dob: string) => {
        if (!dob) return '';
        try {
            const date = new Date(dob);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dob;
        }
    };

    // Validate and Submit
    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};

        onNext();
        return;

        // Employment validation
        if (!formData.employmentType) {
            newErrors.employmentType = 'Please select employment type';
        }

        if (!formData.monthlyIncome || parseInt(formData.monthlyIncome) < 15000) {
            newErrors.monthlyIncome = 'Minimum income required is ₹15,000';
        }

        if (formData.employmentType === 'SALARIED' && !formData.salaryDate) {
            newErrors.salaryDate = 'Please select salary date';
        }

        // PAN validation
        if (!formData.panVerified) {
            newErrors.pan = 'Please verify your PAN';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitLoading(true);


        // MOCK MODE
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockAppId = 'APP' + Date.now();
            const mockAppNumber = 'QK' + Math.random().toString(36).substring(2, 8).toUpperCase();
            localStorage.setItem('applicationId', mockAppId);
            localStorage.setItem('applicationNumber', mockAppNumber);
            console.log('✅ MOCK: Application submitted -', mockAppNumber);
            setSubmitLoading(false);
            onNext();
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/loan/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mobile: formData.mobile,
                    pincode: formData.pincode,
                    city: formData.city,
                    state: formData.state,
                    employmentType: formData.employmentType,
                    monthlyIncome: parseInt(formData.monthlyIncome),
                    salaryDate: formData.salaryDate,
                    loanAmount: formData.loanAmount,
                    tenure: formData.tenure,
                    tenureUnit: 'days',
                    panCard: formData.pan,
                    fullName: formData.fullName,
                    dateOfBirth: formData.dob,
                    processingFee: loanCalc.processingFee,
                    gstOnProcessingFee: loanCalc.gstOnProcessingFee,
                    netDisbursalAmount: loanCalc.netDisbursalAmount,
                    totalRepayment: loanCalc.totalRepayment,
                    ipData: formData.ipData,
                }),
            });

            const data = await response.json();

            if (data.success) {
                if (data.data) {
                    localStorage.setItem('applicationId', data.data.applicationId);
                    localStorage.setItem('applicationNumber', data.data.applicationNumber);
                }
                onNext();
            } else {
                setErrors({ submit: data.message || 'Application submission failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-4"
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Complete Your Profile</h2>

            {/* Employment Details */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    Employment Details
                </h3>

                <div className="space-y-3">
                    {/* Employment Type */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Employment Type *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {EMPLOYMENT_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, employmentType: type.value }));
                                        setErrors(prev => ({ ...prev, employmentType: '' }));
                                    }}
                                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all active:scale-[0.98] touch-manipulation ${formData.employmentType === type.value
                                            ? 'bg-[#25B181] text-white shadow-md'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:border-[#25B181]'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                        {errors.employmentType && (
                            <p className="mt-1 text-xs text-red-600">{errors.employmentType}</p>
                        )}
                    </div>

                    {/* Monthly Income */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Monthly Income *
                        </label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formData.monthlyIncome}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setFormData(prev => ({ ...prev, monthlyIncome: value }));
                                    setErrors(prev => ({ ...prev, monthlyIncome: '' }));
                                }}
                                className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#25B181] ${errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter monthly income"
                            />
                        </div>
                        {errors.monthlyIncome && (
                            <p className="mt-1 text-xs text-red-600">{errors.monthlyIncome}</p>
                        )}
                    </div>

                    {/* Salary Date - only for salaried */}
                    {formData.employmentType === 'SALARIED' && (
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Salary Credit Date *
                            </label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <select
                                    value={formData.salaryDate || ''}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, salaryDate: parseInt(e.target.value) || 0 }));
                                        setErrors(prev => ({ ...prev, salaryDate: '' }));
                                    }}
                                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#25B181] appearance-none ${errors.salaryDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select salary date</option>
                                    {SALARY_DATES.map((date) => (
                                        <option key={date.value} value={date.value}>
                                            {date.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.salaryDate && (
                                <p className="mt-1 text-xs text-red-600">{errors.salaryDate}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* PAN Verification */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181]" />
                    PAN Verification
                </h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            PAN Number *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={formData.pan}
                                    onChange={(e) => handlePANChange(e.target.value)}
                                    placeholder="ABCDE1234F"
                                    disabled={formData.panVerified}
                                    maxLength={10}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#25B181] uppercase disabled:bg-gray-100 ${formData.panVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                        } ${panError ? 'border-red-500' : ''}`}
                                />
                                {formData.panVerified && (
                                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                )}
                            </div>

                            {!formData.panVerified && (
                                <button
                                    onClick={handleVerifyPAN}
                                    disabled={panLoading || formData.pan.length !== 10 || panReverifyTimer > 0}
                                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#25B181] text-white rounded-lg text-sm sm:text-base font-medium hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap active:scale-[0.98] touch-manipulation"
                                >
                                    {panLoading ? 'Verifying...' : panReverifyTimer > 0 ? `Wait (${panReverifyTimer}s)` : 'Verify PAN'}
                                </button>
                            )}

                            {formData.panVerified && (
                                <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-green-100 border border-green-300 rounded-lg flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                    <span className="text-xs sm:text-sm font-medium text-green-700">Verified</span>
                                </div>
                            )}
                        </div>
                        {panError && (
                            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {panError}
                            </p>
                        )}
                    </div>

                    {/* PAN Details */}
                    {formData.panVerified && formData.panData && (
                        <div className="bg-green-50 rounded-lg p-3 space-y-2 border border-green-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2.5">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500">Full Name</p>
                                        <p className="font-medium text-xs sm:text-sm text-gray-900">{formData.fullName}</p>
                                    </div>
                                </div>
                                {formData.dob && (
                                    <div className="flex items-center gap-2.5">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-gray-500">Date of Birth</p>
                                            <p className="font-medium text-xs sm:text-sm text-gray-900">{formatDOB(formData.dob)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loan Summary */}
            <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">You&apos;ll receive</span>
                    <span className="font-semibold text-green-600">{formatCurrency(loanCalc.netDisbursalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Processing Fee (10% + GST)</span>
                    <span className="text-gray-700">{formatCurrency(loanCalc.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm border-t pt-1.5 sm:pt-2">
                    <span className="text-gray-600">Total Repayment</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(loanCalc.totalRepayment)}</span>
                </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-700">{errors.submit}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
                {/* Back button - disabled once PAN is verified */}
                <div className="relative group">
                    <button
                        onClick={onBack}
                        disabled={submitLoading || formData.panVerified}
                        className={`px-3 sm:px-4 py-3 sm:py-3.5 border rounded-lg font-medium text-sm flex items-center gap-1.5 active:scale-[0.98] touch-manipulation ${formData.panVerified
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            } disabled:opacity-50`}
                    >
                        {formData.panVerified ? (
                            <Lock className="w-4 h-4" />
                        ) : (
                            <ArrowLeft className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    {formData.panVerified && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-gray-800 text-white text-[10px] sm:text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Cannot go back after PAN verification
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    //   disabled={submitLoading || !formData.panVerified}
                    className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                >
                    {submitLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <span className="text-sm">Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Check Eligibility</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
