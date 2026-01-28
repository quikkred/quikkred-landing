/**
 * Marketing Tracking Hook
 * Easy-to-use hook for tracking user interactions on marketing pages
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { tracking } from '../tracking';

interface UseMarketingTrackingOptions {
  /**
   * Auto-initialize tracking on mount
   * @default true
   */
  autoInit?: boolean;
  /**
   * Page name for page view tracking
   */
  pageName?: string;
}

/**
 * Hook for marketing page tracking
 * Provides methods for tracking homepage interactions, calculator usage, FAQs, etc.
 */
export function useMarketingTracking(options: UseMarketingTrackingOptions = {}) {
  const { autoInit = true, pageName } = options;
  const initializedRef = useRef(false);

  // Initialize tracking on mount
  useEffect(() => {
    if (autoInit && !initializedRef.current) {
      initializedRef.current = true;
      tracking.init();

      // Track page view if page name provided
      if (pageName) {
        tracking.trackEvent('CUSTOM_EVENT', {
          eventName: 'PAGE_VIEW',
          pageName,
          pageTitle: typeof document !== 'undefined' ? document.title : '',
        });
      }
    }
  }, [autoInit, pageName]);

  // ============================================
  // HERO FORM TRACKING
  // ============================================

  const trackHeroFormStart = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'HERO_FORM_START' });
  }, []);

  const trackHeroFormStep = useCallback((step: number, field: string, value?: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'HERO_FORM_STEP',
      step,
      field,
      value,
    });
  }, []);

  const trackHeroFormSubmit = useCallback(
    (data: { mobile?: string; name?: string; amount?: string; email?: string }) => {
      tracking.trackEvent('APPLICATION_STARTED', {
        source: 'hero_form',
        ...data,
      });
    },
    []
  );

  const trackHeroFormError = useCallback((field: string, error: string) => {
    tracking.trackEvent('FORM_ERROR', {
      field,
      error,
      stepNumber: 0,
    });
  }, []);

  // ============================================
  // CALCULATOR TRACKING
  // ============================================

  const trackCalculatorInteraction = useCallback((amount: number, tenure: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'CALCULATOR_USAGE',
      amount,
      tenure,
    });
  }, []);

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

  const trackEmiBreakdownViewed = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'EMI_BREAKDOWN_VIEWED' });
  }, []);

  // ============================================
  // CTA & BUTTON TRACKING
  // ============================================

  const trackCtaClick = useCallback((buttonText: string, location: string) => {
    tracking.trackEvent('BUTTON_CLICK', {
      buttonText,
      location,
      buttonType: 'cta',
    });
  }, []);

  const trackButtonClick = useCallback((buttonName: string) => {
    tracking.trackEvent('BUTTON_CLICK', { buttonName });
  }, []);

  // ============================================
  // FAQ TRACKING
  // ============================================

  const trackFaqExpand = useCallback((faqId: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'FAQ_VIEWED',
      faqId,
    });
  }, []);

  // ============================================
  // TRUST BADGE TRACKING
  // ============================================

  const trackTrustBadgeClick = useCallback(
    (badge: 'rbi' | 'security' | 'privacy' | 'terms') => {
      tracking.trackEvent('CUSTOM_EVENT', {
        eventName: 'TRUST_BADGE_CLICK',
        badge,
      });
    },
    []
  );

  // ============================================
  // LANGUAGE TRACKING
  // ============================================

  const trackLanguageChange = useCallback((fromLang: string, toLang: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'LANGUAGE_CHANGE',
      fromLang,
      toLang,
    });
  }, []);

  // ============================================
  // NEWSLETTER TRACKING
  // ============================================

  const trackNewsletterFocus = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'NEWSLETTER_INPUT_FOCUSED' });
  }, []);

  const trackNewsletterSubmit = useCallback((email: string, success: boolean) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'NEWSLETTER_SUBSCRIPTION',
      maskedEmail: email.slice(0, 3) + '***' + email.slice(email.indexOf('@')),
      success,
    });
  }, []);

  // ============================================
  // PRODUCT TRACKING
  // ============================================

  const trackProductViewed = useCallback((productId: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'PRODUCT_VIEWED',
      productId,
    });
  }, []);

  const trackEligibilityCheck = useCallback(() => {
    tracking.trackEvent('CUSTOM_EVENT', { eventName: 'ELIGIBILITY_CHECK_STARTED' });
  }, []);

  // ============================================
  // SCROLL TRACKING
  // ============================================

  const trackScrollDepth = useCallback((depth: number) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'SCROLL_DEPTH',
      depth,
    });
  }, []);

  const trackTermsViewed = useCallback((isViewing: boolean) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'TERMS_VIEWED',
      isViewing,
    });
  }, []);

  // ============================================
  // PAGE VIEW TRACKING
  // ============================================

  const trackPageView = useCallback((page: string, title?: string) => {
    tracking.trackEvent('CUSTOM_EVENT', {
      eventName: 'PAGE_VIEW',
      pageName: page,
      pageTitle: title,
    });
  }, []);

  // ============================================
  // FIELD INTERACTION TRACKING
  // ============================================

  const trackFieldFocus = useCallback((fieldName: string) => {
    tracking.trackEvent('FIELD_INTERACTION', {
      fieldName,
      action: 'focus',
    });
  }, []);

  const trackFieldTyping = useCallback((fieldName: string) => {
    tracking.trackEvent('FIELD_INTERACTION', {
      fieldName,
      action: 'typing',
    });
  }, []);

  const trackPaste = useCallback((field: 'pan' | 'aadhaar' | 'accountNumber' | 'ifsc') => {
    tracking.trackEvent('FIELD_INTERACTION', {
      fieldName: field,
      action: 'paste',
    });
  }, []);

  // ============================================
  // RETURN ALL TRACKING METHODS
  // ============================================

  return {
    // Hero form
    trackHeroFormStart,
    trackHeroFormStep,
    trackHeroFormSubmit,
    trackHeroFormError,

    // Calculator
    trackCalculatorInteraction,
    trackLoanAmountChange,
    trackTenureChange,
    trackEmiBreakdownViewed,

    // CTA & buttons
    trackCtaClick,
    trackButtonClick,

    // FAQ
    trackFaqExpand,

    // Trust badges
    trackTrustBadgeClick,

    // Language
    trackLanguageChange,

    // Newsletter
    trackNewsletterFocus,
    trackNewsletterSubmit,

    // Product
    trackProductViewed,
    trackEligibilityCheck,

    // Scroll
    trackScrollDepth,
    trackTermsViewed,

    // Page view
    trackPageView,

    // Field interactions
    trackFieldFocus,
    trackFieldTyping,
    trackPaste,

    // Direct access to tracking service
    tracking,
  };
}

// ============================================
// SCROLL DEPTH TRACKING HOOK
// ============================================

export function useScrollDepthTracking(thresholds: number[] = [25, 50, 75, 100]) {
  const trackedDepths = useRef<Set<number>>(new Set());
  const { trackScrollDepth } = useMarketingTracking({ autoInit: false });

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;

      for (const threshold of thresholds) {
        if (scrolled >= threshold && !trackedDepths.current.has(threshold)) {
          trackedDepths.current.add(threshold);
          trackScrollDepth(threshold);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholds, trackScrollDepth]);
}

// ============================================
// TIME ON PAGE TRACKING HOOK
// ============================================

export function useTimeOnPageTracking(intervalMs: number = 30000) {
  const { tracking } = useMarketingTracking({ autoInit: false });
  const startTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      tracking.trackEvent('CUSTOM_EVENT', {
        eventName: 'TIME_ON_PAGE',
        seconds: timeSpent,
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, tracking]);
}

// ============================================
// SECTION VISIBILITY TRACKING HOOK
// ============================================

export function useSectionVisibilityTracking(sectionRef: React.RefObject<HTMLElement>, sectionName: string) {
  const hasTracked = useRef(false);
  const { tracking } = useMarketingTracking({ autoInit: false });

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          hasTracked.current = true;
          tracking.trackEvent('CUSTOM_EVENT', {
            eventName: 'SECTION_VIEWED',
            sectionName,
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [sectionRef, sectionName, tracking]);
}
