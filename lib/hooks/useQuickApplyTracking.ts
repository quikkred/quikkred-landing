/**
 * Quick Apply V2 Tracking Hook
 * Comprehensive tracking for the loan application flow
 * Integrates with backend userJourneyModel.js
 */

'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { tracking, EntrySource } from '../tracking';

interface UseQuickApplyTrackingOptions {
  /**
   * Auto-initialize tracking on mount
   * @default true
   */
  autoInit?: boolean;
  /**
   * Entry source for attribution
   */
  entrySource?: EntrySource;
}

/**
 * Hook for Quick Apply V2 flow tracking
 * Provides comprehensive tracking methods for the application funnel
 */
export function useQuickApplyTracking(options: UseQuickApplyTrackingOptions = {}) {
  const { autoInit = true, entrySource } = options;
  const initializedRef = useRef(false);
  const stepStartTimeRef = useRef<number>(Date.now());
  const currentStepRef = useRef<number>(0);

  // Initialize tracking on mount
  useEffect(() => {
    if (autoInit && !initializedRef.current) {
      initializedRef.current = true;
      tracking.init();
      tracking.trackEvent('CUSTOM_EVENT', { eventName: 'QUICK_APPLY_V2_LOADED' });
    }
  }, [autoInit]);

  // ============================================
  // IP CHECK TRACKING
  // ============================================

  const trackIPCheckStarted = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'IP_CHECK_STARTED' });
  }, []);

  const trackIPCheckPassed = useCallback((data: { state?: string; city?: string; pincode?: string }) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'IP_CHECK_PASSED',
      ...data,
    });
  }, []);

  const trackIPCheckBlocked = useCallback((reason: 'vpn' | 'region' | 'error', state?: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'IP_CHECK_BLOCKED',
      blockReason: reason,
      blockedState: state,
    });
  }, []);

  const trackVPNDetected = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'VPN_DETECTED' });
  }, []);

  // ============================================
  // STEP TRACKING
  // ============================================

  const trackStepViewed = useCallback((step: number, stepName: string) => {
    currentStepRef.current = step;
    stepStartTimeRef.current = Date.now();
    tracking.trackEvent('STEP_VIEWED', {
      stepNumber: step,
      stepName,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const trackStepCompleted = useCallback((step: number, stepName: string, additionalData?: Record<string, unknown>) => {
    const timeSpent = Math.round((Date.now() - stepStartTimeRef.current) / 1000);
    tracking.trackEvent('STEP_COMPLETED', {
      stepNumber: step,
      stepName,
      timeSpentSeconds: timeSpent,
      ...additionalData,
    });
  }, []);

  const trackStepAbandoned = useCallback((step: number, stepName: string, reason?: string) => {
    const timeSpent = Math.round((Date.now() - stepStartTimeRef.current) / 1000);
    tracking.trackEvent('STEP_ABANDONED', {
      stepNumber: step,
      stepName,
      timeSpentSeconds: timeSpent,
      abandonReason: reason,
    });
  }, []);

  // ============================================
  // VERIFICATION TRACKING
  // ============================================

  // Truecaller
  const trackTruecallerStarted = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'TRUECALLER_VERIFY_STARTED' });
  }, []);

  const trackTruecallerSuccess = useCallback((mobile: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'TRUECALLER_VERIFY_SUCCESS',
      maskedMobile: mobile.slice(0, 2) + '****' + mobile.slice(-4),
    });
    tracking.linkToCustomer({ mobile });
  }, []);

  const trackTruecallerFailed = useCallback((error: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'TRUECALLER_VERIFY_FAILED',
      error,
    });
  }, []);

  // Google Auth
  const trackGoogleAuthStarted = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'GOOGLE_AUTH_STARTED' });
  }, []);

  const trackGoogleAuthSuccess = useCallback((email: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'GOOGLE_AUTH_SUCCESS',
      maskedEmail: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    });
    tracking.linkToCustomer({ email });
  }, []);

  const trackGoogleAuthFailed = useCallback((error: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'GOOGLE_AUTH_FAILED',
      error,
    });
  }, []);

  // Mobile OTP
  const trackOTPRequested = useCallback((mobile: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'OTP_REQUESTED',
      maskedMobile: mobile.slice(0, 2) + '****' + mobile.slice(-4),
    });
  }, []);

  const trackOTPVerified = useCallback((mobile: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'OTP_VERIFIED',
      maskedMobile: mobile.slice(0, 2) + '****' + mobile.slice(-4),
    });
    tracking.linkToCustomer({ mobile });
  }, []);

  const trackOTPFailed = useCallback((error: string, attempts: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'OTP_FAILED',
      error,
      attempts,
    });
  }, []);

  const trackOTPResend = useCallback((count: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'OTP_RESEND',
      resendCount: count,
    });
  }, []);

  // PAN Verification
  const trackPANEntered = useCallback((pan: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'PAN_ENTERED',
      panPrefix: pan.slice(0, 5), // First 5 characters only for pattern analysis
    });
  }, []);

  const trackPANVerifyStarted = useCallback(() => {
    tracking.trackEvent('PAN_VERIFICATION_ATTEMPT', {});
  }, []);

  const trackPANVerifySuccess = useCallback((data: { fullName?: string }) => {
    tracking.trackEvent('PAN_VERIFICATION_SUCCESS', {
      hasName: !!data.fullName,
    });
  }, []);

  const trackPANVerifyFailed = useCallback((error: string, attempts: number) => {
    tracking.trackEvent('PAN_VERIFICATION_FAILED', {
      error,
      attempts,
    });
  }, []);

  // Aadhaar Verification
  const trackAadhaarOTPSent = useCallback(() => {
    tracking.trackEvent('AADHAAR_OTP_SENT', {});
  }, []);

  const trackAadhaarVerifySuccess = useCallback(() => {
    tracking.trackEvent('AADHAAR_VERIFICATION_SUCCESS', {});
  }, []);

  const trackAadhaarVerifyFailed = useCallback((error: string, attempts: number) => {
    tracking.trackEvent('AADHAAR_VERIFICATION_FAILED', {
      error,
      attempts,
    });
  }, []);

  const trackAadhaarOTPResend = useCallback((count: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'AADHAAR_OTP_RESEND',
      resendCount: count,
    });
  }, []);

  // Selfie Capture
  const trackSelfieCaptureStarted = useCallback(() => {
    tracking.trackEvent('SELFIE_CAPTURE_STARTED', {});
  }, []);

  const trackSelfieCaptureSuccess = useCallback(() => {
    tracking.trackEvent('SELFIE_CAPTURE_SUCCESS', {});
  }, []);

  const trackSelfieCaptureFailed = useCallback((error: string, attempts: number) => {
    tracking.trackEvent('SELFIE_CAPTURE_FAILED', {
      error,
      attempts,
    });
  }, []);

  // Bank Verification
  const trackBankVerifyStarted = useCallback(() => {
    tracking.trackEvent('BANK_VERIFICATION_ATTEMPT', {});
  }, []);

  const trackBankVerifySuccess = useCallback((bankName?: string) => {
    tracking.trackEvent('BANK_VERIFICATION_SUCCESS', {
      bankName,
    });
  }, []);

  const trackBankVerifyFailed = useCallback((error: string, attempts: number) => {
    tracking.trackEvent('BANK_VERIFICATION_FAILED', {
      error,
      attempts,
    });
  }, []);

  // ============================================
  // LOAN SELECTION TRACKING
  // ============================================

  const trackLoanAmountChange = useCallback((oldAmount: number, newAmount: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'LOAN_AMOUNT_CHANGE',
      oldAmount,
      newAmount,
    });
  }, []);

  const trackTenureChange = useCallback((oldTenure: number, newTenure: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'TENURE_CHANGE',
      oldTenure,
      newTenure,
    });
  }, []);

  const trackLoanSelection = useCallback((amount: number, tenure: number, netDisbursal: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'LOAN_SELECTION_FINALIZED',
      loanAmount: amount,
      tenure,
      netDisbursalAmount: netDisbursal,
    });
  }, []);

  // ============================================
  // APPLICATION SUBMISSION TRACKING
  // ============================================

  const trackApplicationSubmitted = useCallback((data: {
    loanAmount: number;
    tenure: number;
    employmentType?: string;
    monthlyIncome?: number;
  }) => {
    tracking.trackEvent('APPLICATION_SUBMITTED', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // ============================================
  // BRE PROCESSING TRACKING
  // ============================================

  const trackBREProcessingStarted = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'BRE_PROCESSING_STARTED' });
  }, []);

  const trackBREStepCompleted = useCallback((step: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'BRE_STEP_COMPLETED',
      breStep: step,
    });
  }, []);

  const trackBREApproved = useCallback((data: {
    approvedAmount: number;
    netDisbursalAmount: number;
    tenure: number;
  }) => {
    tracking.trackEvent('APPLICATION_APPROVED', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const trackBRERejected = useCallback((reason: string, category?: string) => {
    tracking.trackEvent('APPLICATION_REJECTED', {
      rejectionReason: reason,
      rejectionCategory: category,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // ============================================
  // E-SIGN TRACKING
  // ============================================

  const trackESignInitiated = useCallback(() => {
    tracking.trackEvent('ESIGN_INITIATED', {});
  }, []);

  const trackESignSuccess = useCallback(() => {
    tracking.trackEvent('ESIGN_SUCCESS', {});
  }, []);

  const trackESignFailed = useCallback((error: string, attempts: number) => {
    tracking.trackEvent('ESIGN_FAILED', {
      error,
      attempts,
    });
  }, []);

  // ============================================
  // FORM BEHAVIOR TRACKING
  // ============================================

  const trackFieldFocus = useCallback((fieldName: string, step: number) => {
    tracking.trackEvent('FIELD_INTERACTION', {
      fieldName,
      action: 'focus',
      stepNumber: step,
    });
  }, []);

  const trackFieldTyping = useCallback((fieldName: string) => {
    tracking.trackEvent('FIELD_INTERACTION', {
      fieldName,
      action: 'typing',
    });
  }, []);

  const trackFieldPaste = useCallback((field: 'pan' | 'aadhaar' | 'accountNumber' | 'ifsc') => {
    tracking.trackEvent('FIELD_INTERACTION', {
      fieldName: field,
      action: 'paste',
    });
  }, []);

  const trackFieldCorrection = useCallback((fieldName: string) => {
    tracking.trackEvent('FIELD_INTERACTION', {
      fieldName,
      action: 'correction',
    });
  }, []);

  const trackFormError = useCallback((field: string, error: string, step: number) => {
    tracking.trackEvent('FORM_ERROR', {
      fieldName: field,
      errorMessage: error,
      stepNumber: step,
    });
  }, []);

  // ============================================
  // EMPLOYMENT TRACKING
  // ============================================

  const trackEmploymentTypeSelected = useCallback((type: 'SALARIED' | 'SELF-EMPLOYED') => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'EMPLOYMENT_TYPE_SELECTED',
      employmentType: type,
    });
  }, []);

  const trackIncomeEntered = useCallback((income: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'INCOME_ENTERED',
      incomeRange: income < 20000 ? 'below_20k' :
                   income < 50000 ? '20k_50k' :
                   income < 100000 ? '50k_100k' : 'above_100k',
    });
  }, []);

  const trackSalaryDateSelected = useCallback((date: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'SALARY_DATE_SELECTED',
      salaryDate: date,
    });
  }, []);

  // ============================================
  // COMPLETION TRACKING
  // ============================================

  const trackDisbursementInitiated = useCallback((amount: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'DISBURSEMENT_INITIATED',
      amount,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const trackApplicationCompleted = useCallback((data: {
    loanAmount: number;
    netDisbursalAmount: number;
    applicationId?: string;
    totalTimeMinutes: number;
  }) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'APPLICATION_COMPLETED',
      ...data,
      timestamp: new Date().toISOString(),
    });

    // End session tracking
    tracking.endSession();
  }, []);

  // ============================================
  // ERROR TRACKING
  // ============================================

  const trackAPIError = useCallback((endpoint: string, error: string, statusCode?: number) => {
    tracking.trackEvent('API_ERROR', {
      endpoint,
      error,
      statusCode,
    });
  }, []);

  const trackClientError = useCallback((error: string, context?: Record<string, unknown>) => {
    tracking.trackEvent('CLIENT_ERROR', {
      error,
      ...context,
    });
  }, []);

  // ============================================
  // RETURN ALL TRACKING METHODS
  // ============================================

  return {
    // IP Check
    trackIPCheckStarted,
    trackIPCheckPassed,
    trackIPCheckBlocked,
    trackVPNDetected,

    // Steps
    trackStepViewed,
    trackStepCompleted,
    trackStepAbandoned,

    // Verification
    trackTruecallerStarted,
    trackTruecallerSuccess,
    trackTruecallerFailed,
    trackGoogleAuthStarted,
    trackGoogleAuthSuccess,
    trackGoogleAuthFailed,
    trackOTPRequested,
    trackOTPVerified,
    trackOTPFailed,
    trackOTPResend,
    trackPANEntered,
    trackPANVerifyStarted,
    trackPANVerifySuccess,
    trackPANVerifyFailed,
    trackAadhaarOTPSent,
    trackAadhaarVerifySuccess,
    trackAadhaarVerifyFailed,
    trackAadhaarOTPResend,
    trackSelfieCaptureStarted,
    trackSelfieCaptureSuccess,
    trackSelfieCaptureFailed,
    trackBankVerifyStarted,
    trackBankVerifySuccess,
    trackBankVerifyFailed,

    // Loan Selection
    trackLoanAmountChange,
    trackTenureChange,
    trackLoanSelection,

    // Application
    trackApplicationSubmitted,

    // BRE
    trackBREProcessingStarted,
    trackBREStepCompleted,
    trackBREApproved,
    trackBRERejected,

    // E-Sign
    trackESignInitiated,
    trackESignSuccess,
    trackESignFailed,

    // Form Behavior
    trackFieldFocus,
    trackFieldTyping,
    trackFieldPaste,
    trackFieldCorrection,
    trackFormError,

    // Employment
    trackEmploymentTypeSelected,
    trackIncomeEntered,
    trackSalaryDateSelected,

    // Completion
    trackDisbursementInitiated,
    trackApplicationCompleted,

    // Errors
    trackAPIError,
    trackClientError,

    // Direct access to tracking service
    tracking,
  };
}

/**
 * Hook for tracking hesitation in form fields
 * Detects when user pauses for too long on a field
 */
export function useFieldHesitationTracking(fieldName: string, step: number, thresholdMs: number = 5000) {
  const lastActivityRef = useRef<number>(Date.now());
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    const checkHesitation = () => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity >= thresholdMs && !hasTrackedRef.current) {
        hasTrackedRef.current = true;
        tracking.trackEvent('CUSTOM_EVENT', {
          eventName: 'FIELD_HESITATION',
          stepNumber: step,
          fieldName,
          hesitationSeconds: Math.round(timeSinceActivity / 1000),
        });
      }
    };

    const interval = setInterval(checkHesitation, 1000);
    return () => clearInterval(interval);
  }, [fieldName, step, thresholdMs]);

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    hasTrackedRef.current = false;
  }, []);

  return { recordActivity };
}

/**
 * Hook for tracking verification friction
 * Measures time and attempts for verification steps
 */
export function useVerificationFrictionTracking(verificationType: 'pan' | 'aadhaar' | 'bank' | 'esign' | 'selfie' | 'mobile') {
  const startTimeRef = useRef<number | null>(null);
  const attemptsRef = useRef<number>(0);

  const startTracking = useCallback(() => {
    startTimeRef.current = Date.now();
    attemptsRef.current = 0;
  }, []);

  const recordAttempt = useCallback(() => {
    attemptsRef.current += 1;
  }, []);

  const completeTracking = useCallback((success: boolean) => {
    if (startTimeRef.current === null) return;

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'VERIFICATION_FRICTION',
      verificationType,
      timeSpentSeconds: timeSpent,
      attempts: attemptsRef.current,
      success,
    });
  }, [verificationType]);

  return {
    startTracking,
    recordAttempt,
    completeTracking,
    getAttempts: () => attemptsRef.current,
  };
}

export default useQuickApplyTracking;
