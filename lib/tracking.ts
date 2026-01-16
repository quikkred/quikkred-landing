/**
 * User Journey Tracking Service
 * Sends tracking data directly to Quikkred Backend
 */

import { API_BASE_URL } from './config';

// ============================================
// TYPES
// ============================================

type EventType =
  | 'APPLICATION_STARTED'
  | 'STEP_VIEWED'
  | 'STEP_COMPLETED'
  | 'STEP_ABANDONED'
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED'
  | 'PAN_VERIFICATION_ATTEMPT'
  | 'PAN_VERIFICATION_SUCCESS'
  | 'PAN_VERIFICATION_FAILED'
  | 'AADHAAR_OTP_SENT'
  | 'AADHAAR_VERIFICATION_SUCCESS'
  | 'AADHAAR_VERIFICATION_FAILED'
  | 'SELFIE_CAPTURE_STARTED'
  | 'SELFIE_CAPTURE_SUCCESS'
  | 'SELFIE_CAPTURE_FAILED'
  | 'BANK_VERIFICATION_ATTEMPT'
  | 'BANK_VERIFICATION_SUCCESS'
  | 'BANK_VERIFICATION_FAILED'
  | 'AA_CONSENT_INITIATED'
  | 'AA_CONSENT_SUCCESS'
  | 'AA_CONSENT_FAILED'
  | 'ESIGN_INITIATED'
  | 'ESIGN_SUCCESS'
  | 'ESIGN_FAILED'
  | 'FIELD_INTERACTION'
  | 'BUTTON_CLICK'
  | 'FORM_ERROR'
  | 'PAGE_VISIBLE'
  | 'PAGE_HIDDEN'
  | 'API_ERROR'
  | 'CLIENT_ERROR'
  | 'CUSTOM_EVENT';

interface TrackingEvent {
  eventType: EventType;
  eventData?: Record<string, any>;
  stepNumber?: number;
  stepName?: string;
  timeSpentSeconds?: number;
  errorMessage?: string;
  errorCode?: string;
}

interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

// ============================================
// HELPERS
// ============================================

// Get or create visitor ID (persists across sessions)
const getVisitorId = (): string => {
  if (typeof window === 'undefined') return '';

  let visitorId = localStorage.getItem('qk_visitor_id');
  if (!visitorId) {
    visitorId = `vis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('qk_visitor_id', visitorId);
  }
  return visitorId;
};

// Get or create session ID (per browser session)
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('qk_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('qk_session_id', sessionId);
  }
  return sessionId;
};

// Get UTM parameters from URL or session
const getUTMParams = (): UTMParams => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

  utmKeys.forEach((param) => {
    const value = urlParams.get(param);
    if (value) {
      const key = param.replace('utm_', '') as keyof UTMParams;
      utmParams[key] = value;
      sessionStorage.setItem(param, value);
    } else {
      const stored = sessionStorage.getItem(param);
      if (stored) {
        const key = param.replace('utm_', '') as keyof UTMParams;
        utmParams[key] = stored;
      }
    }
  });

  return utmParams;
};

// Determine entry source
const getEntrySource = (): string => {
  if (typeof window === 'undefined') return 'DIRECT';

  const referrer = document.referrer;
  const utm = getUTMParams();

  if (utm.source === 'google' && utm.medium === 'cpc') return 'GOOGLE_ADS';
  if (utm.source === 'facebook' || utm.source === 'fb' || utm.source === 'instagram') return 'META_ADS';
  if (utm.source) return 'REFERRAL';
  if (referrer.includes('google.com')) return 'ORGANIC';
  if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) return 'META_ADS';

  return 'DIRECT';
};

// ============================================
// API CALLS
// ============================================

const sendToBackend = async (endpoint: string, data: Record<string, any>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tracking${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error('[Tracking] Failed to send:', error);
    return false;
  }
};

// Queue for batching events
let eventQueue: TrackingEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

const flushEventQueue = async () => {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  await sendToBackend('/events/batch', {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    events: eventsToSend,
  });
};

const queueEvent = (event: TrackingEvent) => {
  eventQueue.push(event);

  // Flush after 2 seconds of inactivity or when queue has 10+ events
  if (flushTimeout) clearTimeout(flushTimeout);

  if (eventQueue.length >= 10) {
    flushEventQueue();
  } else {
    flushTimeout = setTimeout(flushEventQueue, 2000);
  }
};

// ============================================
// TRACKING CLASS
// ============================================

class TrackingService {
  private initialized = false;
  private stepStartTime: number = Date.now();

  // Initialize journey tracking
  async init(options?: { mobile?: string; email?: string }) {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;

    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const utm = getUTMParams();

    await sendToBackend('/init', {
      visitorId,
      sessionId,
      utm,
      referrer: document.referrer,
      landingPage: window.location.pathname,
      entrySource: getEntrySource(),
      deviceInfo: {
        screenResolution: `${screen.width}x${screen.height}`,
        platform: navigator.platform,
      },
      mobile: options?.mobile,
      email: options?.email,
    });

    this.initialized = true;
    this.stepStartTime = Date.now();

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('PAGE_HIDDEN', {});
      } else {
        this.trackEvent('PAGE_VISIBLE', {});
      }
    });

    // Flush events before page unload
    window.addEventListener('beforeunload', () => {
      flushEventQueue();
      this.endSession();
    });
  }

  // Track any event
  async trackEvent(
    eventType: EventType,
    data: {
      stepNumber?: number;
      stepName?: string;
      errorMessage?: string;
      errorCode?: string;
      [key: string]: any;
    }
  ) {
    const event: TrackingEvent = {
      eventType,
      eventData: data,
      stepNumber: data.stepNumber,
      stepName: data.stepName,
      errorMessage: data.errorMessage,
      errorCode: data.errorCode,
    };

    // For important events, send immediately
    const immediateEvents: EventType[] = [
      'APPLICATION_STARTED',
      'STEP_COMPLETED',
      'APPLICATION_SUBMITTED',
      'APPLICATION_APPROVED',
      'APPLICATION_REJECTED',
      'PAN_VERIFICATION_SUCCESS',
      'AADHAAR_VERIFICATION_SUCCESS',
      'BANK_VERIFICATION_SUCCESS',
      'ESIGN_SUCCESS',
    ];

    if (immediateEvents.includes(eventType)) {
      await sendToBackend('/event', {
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        ...event,
      });
    } else {
      queueEvent(event);
    }
  }

  // Link journey to customer/application
  async linkToCustomer(data: {
    customerId?: string;
    userId?: string;
    applicationId?: string;
    mobile?: string;
    email?: string;
  }) {
    await sendToBackend('/link', {
      visitorId: getVisitorId(),
      ...data,
    });
  }

  // End session
  async endSession() {
    const totalTimeSpent = Math.round((Date.now() - this.stepStartTime) / 1000);
    await sendToBackend('/session/end', {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      totalTimeSpent,
    });
  }

  // Get time spent on current step
  getTimeOnStep(): number {
    return Math.round((Date.now() - this.stepStartTime) / 1000);
  }

  // Reset step timer (call when changing steps)
  resetStepTimer() {
    this.stepStartTime = Date.now();
  }

  // ============================================
  // CONVENIENCE METHODS
  // ============================================

  // Application flow
  applicationStarted(source: string = 'direct') {
    this.trackEvent('APPLICATION_STARTED', { source });
  }

  stepViewed(step: number, stepName?: string) {
    this.resetStepTimer();
    this.trackEvent('STEP_VIEWED', {
      stepNumber: step,
      stepName: stepName || `Step ${step}`,
    });
  }

  stepCompleted(step: number, stepName?: string) {
    const timeSpent = this.getTimeOnStep();
    this.trackEvent('STEP_COMPLETED', {
      stepNumber: step,
      stepName: stepName || `Step ${step}`,
      timeSpentSeconds: timeSpent,
    });
  }

  stepAbandoned(step: number, lastField?: string) {
    const timeSpent = this.getTimeOnStep();
    this.trackEvent('STEP_ABANDONED', {
      stepNumber: step,
      timeSpentSeconds: timeSpent,
      lastField,
    });
  }

  // KYC Events
  panVerificationAttempt() {
    this.trackEvent('PAN_VERIFICATION_ATTEMPT', { stepNumber: 2 });
  }

  panVerificationSuccess() {
    this.trackEvent('PAN_VERIFICATION_SUCCESS', { stepNumber: 2 });
  }

  panVerificationFailed(error: string) {
    this.trackEvent('PAN_VERIFICATION_FAILED', {
      stepNumber: 2,
      errorMessage: error,
    });
  }

  aadhaarOtpSent() {
    this.trackEvent('AADHAAR_OTP_SENT', { stepNumber: 2 });
  }

  aadhaarVerificationSuccess() {
    this.trackEvent('AADHAAR_VERIFICATION_SUCCESS', { stepNumber: 2 });
  }

  aadhaarVerificationFailed(error: string) {
    this.trackEvent('AADHAAR_VERIFICATION_FAILED', {
      stepNumber: 2,
      errorMessage: error,
    });
  }

  selfieCapture(status: 'started' | 'success' | 'failed', error?: string) {
    const eventMap = {
      started: 'SELFIE_CAPTURE_STARTED',
      success: 'SELFIE_CAPTURE_SUCCESS',
      failed: 'SELFIE_CAPTURE_FAILED',
    } as const;

    this.trackEvent(eventMap[status], {
      stepNumber: 2,
      errorMessage: error,
    });
  }

  // Bank Events
  bankVerificationAttempt(bankName?: string) {
    this.trackEvent('BANK_VERIFICATION_ATTEMPT', {
      stepNumber: 3,
      bankName,
    });
  }

  bankVerificationSuccess(bankName?: string) {
    this.trackEvent('BANK_VERIFICATION_SUCCESS', {
      stepNumber: 3,
      bankName,
    });
  }

  bankVerificationFailed(error: string, bankName?: string) {
    this.trackEvent('BANK_VERIFICATION_FAILED', {
      stepNumber: 3,
      errorMessage: error,
      bankName,
    });
  }

  aaConsentInitiated() {
    this.trackEvent('AA_CONSENT_INITIATED', { stepNumber: 3 });
  }

  aaConsentSuccess() {
    this.trackEvent('AA_CONSENT_SUCCESS', { stepNumber: 3 });
  }

  aaConsentFailed(error: string) {
    this.trackEvent('AA_CONSENT_FAILED', {
      stepNumber: 3,
      errorMessage: error,
    });
  }

  // E-Sign Events
  esignInitiated() {
    this.trackEvent('ESIGN_INITIATED', { stepNumber: 4 });
  }

  esignSuccess() {
    this.trackEvent('ESIGN_SUCCESS', { stepNumber: 4 });
  }

  esignFailed(error: string) {
    this.trackEvent('ESIGN_FAILED', {
      stepNumber: 4,
      errorMessage: error,
    });
  }

  // Conversion Events
  applicationSubmitted(applicationId: string, loanAmount: number) {
    this.trackEvent('APPLICATION_SUBMITTED', {
      stepNumber: 4,
      applicationId,
      loanAmount,
    });
  }

  applicationApproved(applicationId: string, approvedAmount: number) {
    this.trackEvent('APPLICATION_APPROVED', {
      stepNumber: 4,
      applicationId,
      approvedAmount,
    });
  }

  applicationRejected(applicationId: string, reason: string) {
    this.trackEvent('APPLICATION_REJECTED', {
      stepNumber: 4,
      applicationId,
      reason,
    });
  }

  // Engagement Events
  fieldInteraction(fieldName: string, step: number) {
    this.trackEvent('FIELD_INTERACTION', {
      stepNumber: step,
      fieldName,
    });
  }

  buttonClick(buttonName: string, step: number) {
    this.trackEvent('BUTTON_CLICK', {
      stepNumber: step,
      buttonName,
    });
  }

  formError(fieldName: string, error: string, step: number) {
    this.trackEvent('FORM_ERROR', {
      stepNumber: step,
      fieldName,
      errorMessage: error,
    });
  }

  // Error Tracking
  apiError(endpoint: string, statusCode: number, error: string, step?: number) {
    this.trackEvent('API_ERROR', {
      stepNumber: step,
      endpoint,
      statusCode,
      errorMessage: error,
    });
  }

  clientError(error: string, context?: string) {
    this.trackEvent('CLIENT_ERROR', {
      errorMessage: error,
      context,
    });
  }
}

// Export singleton instance
export const tracking = new TrackingService();

// Export for hook usage
export const useTracking = () => tracking;

export default tracking;
