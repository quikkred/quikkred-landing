/**
 * Tracking Hooks Index
 * Central export for all tracking-related hooks
 */

// Marketing/Homepage Tracking
export {
  useMarketingTracking,
  useScrollDepthTracking,
  useTimeOnPageTracking,
  useSectionVisibilityTracking,
} from './useMarketingTracking';

// Quick Apply V2 Tracking
export {
  useQuickApplyTracking,
  useFieldHesitationTracking,
  useVerificationFrictionTracking,
} from './useQuickApplyTracking';
