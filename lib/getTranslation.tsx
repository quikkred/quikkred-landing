import enData from '@/locales/en.json';

// --- TYPES ---
export type TranslationData = typeof enData & {
  policies?: {
    common?: Record<string, string>;
    collectionPolicy?: Record<string, any>;
    grievanceRedressal?: Record<string, any>;
    interestRate?: Record<string, any>;
    itSecurity?: Record<string, any>;
    kycAml?: Record<string, any>;
    privacy?: Record<string, any>;
    cookie?: Record<string, any>;
    fairPractice?: Record<string, any>;
    refund?: Record<string, any>;
    terms?: Record<string, any>;
    rbiGuidelines?: Record<string, any>;
    [key: string]: Record<string, any> | undefined;
  };
};

// --- CONSTANTS & DYNAMIC LOADERS ---
const translationCache: Record<string, TranslationData> = {};

const dynamicTranslations: Record<string, () => Promise<any>> = {
  hi: () => import('@/locales/hi.json').then(m => m.default),
  mr: () => import('@/locales/mr.json').then(m => m.default),
  gu: () => import('@/locales/gu.json').then(m => m.default),
  pa: () => import('@/locales/pa.json').then(m => m.default),
  bn: () => import('@/locales/bn.json').then(m => m.default),
  ta: () => import('@/locales/ta.json').then(m => m.default),
  te: () => import('@/locales/te.json').then(m => m.default),
  kn: () => import('@/locales/kn.json').then(m => m.default),
  ml: () => import('@/locales/ml.json').then(m => m.default),
  or: () => import('@/locales/or.json').then(m => m.default),
  as: () => import('@/locales/as.json').then(m => m.default),
  ur: () => import('@/locales/ur.json').then(m => m.default),
};

const policyTranslationLoaders: Record<string, Record<string, () => Promise<any>>> = {
  common: {
    en: () => import('@/locales/policies/common/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/common/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/common/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/common/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/common/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/common/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/common/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/common/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/common/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/common/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/common/or.json').then(m => m.default),
    as: () => import('@/locales/policies/common/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/common/ur.json').then(m => m.default),
  },
  collectionPolicy: {
    en: () => import('@/locales/policies/collection-policy/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/collection-policy/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/collection-policy/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/collection-policy/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/collection-policy/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/collection-policy/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/collection-policy/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/collection-policy/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/collection-policy/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/collection-policy/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/collection-policy/or.json').then(m => m.default),
    as: () => import('@/locales/policies/collection-policy/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/collection-policy/ur.json').then(m => m.default),
  },
  grievanceRedressal: {
    en: () => import('@/locales/policies/grievance-redressal/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/grievance-redressal/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/grievance-redressal/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/grievance-redressal/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/grievance-redressal/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/grievance-redressal/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/grievance-redressal/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/grievance-redressal/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/grievance-redressal/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/grievance-redressal/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/grievance-redressal/or.json').then(m => m.default),
    as: () => import('@/locales/policies/grievance-redressal/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/grievance-redressal/ur.json').then(m => m.default),
  },
  interestRate: {
    en: () => import('@/locales/policies/interest-rate/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/interest-rate/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/interest-rate/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/interest-rate/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/interest-rate/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/interest-rate/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/interest-rate/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/interest-rate/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/interest-rate/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/interest-rate/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/interest-rate/or.json').then(m => m.default),
    as: () => import('@/locales/policies/interest-rate/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/interest-rate/ur.json').then(m => m.default),
  },
  itSecurity: {
    en: () => import('@/locales/policies/it-security/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/it-security/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/it-security/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/it-security/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/it-security/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/it-security/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/it-security/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/it-security/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/it-security/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/it-security/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/it-security/or.json').then(m => m.default),
    as: () => import('@/locales/policies/it-security/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/it-security/ur.json').then(m => m.default),
  },
  kycAml: {
    en: () => import('@/locales/policies/kyc-aml/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/kyc-aml/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/kyc-aml/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/kyc-aml/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/kyc-aml/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/kyc-aml/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/kyc-aml/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/kyc-aml/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/kyc-aml/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/kyc-aml/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/kyc-aml/or.json').then(m => m.default),
    as: () => import('@/locales/policies/kyc-aml/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/kyc-aml/ur.json').then(m => m.default),
  },
  privacy: {
    en: () => import('@/locales/policies/privacy-policy/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/privacy-policy/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/privacy-policy/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/privacy-policy/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/privacy-policy/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/privacy-policy/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/privacy-policy/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/privacy-policy/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/privacy-policy/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/privacy-policy/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/privacy-policy/or.json').then(m => m.default),
    as: () => import('@/locales/policies/privacy-policy/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/privacy-policy/ur.json').then(m => m.default),
  },
  cookie: {
    en: () => import('@/locales/policies/cookie-policy/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/cookie-policy/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/cookie-policy/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/cookie-policy/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/cookie-policy/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/cookie-policy/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/cookie-policy/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/cookie-policy/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/cookie-policy/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/cookie-policy/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/cookie-policy/or.json').then(m => m.default),
    as: () => import('@/locales/policies/cookie-policy/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/cookie-policy/ur.json').then(m => m.default),
  },
  fairPractice: {
    en: () => import('@/locales/policies/fair-practice-code/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/fair-practice-code/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/fair-practice-code/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/fair-practice-code/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/fair-practice-code/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/fair-practice-code/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/fair-practice-code/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/fair-practice-code/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/fair-practice-code/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/fair-practice-code/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/fair-practice-code/or.json').then(m => m.default),
    as: () => import('@/locales/policies/fair-practice-code/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/fair-practice-code/ur.json').then(m => m.default),
  },
  refund: {
    en: () => import('@/locales/policies/refund-cancellation/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/refund-cancellation/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/refund-cancellation/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/refund-cancellation/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/refund-cancellation/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/refund-cancellation/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/refund-cancellation/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/refund-cancellation/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/refund-cancellation/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/refund-cancellation/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/refund-cancellation/or.json').then(m => m.default),
    as: () => import('@/locales/policies/refund-cancellation/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/refund-cancellation/ur.json').then(m => m.default),
  },
  terms: {
    en: () => import('@/locales/policies/terms-and-conditions/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/terms-and-conditions/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/terms-and-conditions/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/terms-and-conditions/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/terms-and-conditions/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/terms-and-conditions/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/terms-and-conditions/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/terms-and-conditions/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/terms-and-conditions/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/terms-and-conditions/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/terms-and-conditions/or.json').then(m => m.default),
    as: () => import('@/locales/policies/terms-and-conditions/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/terms-and-conditions/ur.json').then(m => m.default),
  },
  rbiGuidelines: {
    en: () => import('@/locales/policies/rbi-guidelines/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/rbi-guidelines/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/rbi-guidelines/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/rbi-guidelines/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/rbi-guidelines/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/rbi-guidelines/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/rbi-guidelines/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/rbi-guidelines/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/rbi-guidelines/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/rbi-guidelines/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/rbi-guidelines/or.json').then(m => m.default),
    as: () => import('@/locales/policies/rbi-guidelines/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/rbi-guidelines/ur.json').then(m => m.default),
  },
  disclaimerDisclosure: {
    en: () => import('@/locales/policies/disclaimer-disclosure/en.json').then(m => m.default),
    hi: () => import('@/locales/policies/disclaimer-disclosure/hi.json').then(m => m.default),
    bn: () => import('@/locales/policies/disclaimer-disclosure/bn.json').then(m => m.default),
    ta: () => import('@/locales/policies/disclaimer-disclosure/ta.json').then(m => m.default),
    te: () => import('@/locales/policies/disclaimer-disclosure/te.json').then(m => m.default),
    mr: () => import('@/locales/policies/disclaimer-disclosure/mr.json').then(m => m.default),
    gu: () => import('@/locales/policies/disclaimer-disclosure/gu.json').then(m => m.default),
    kn: () => import('@/locales/policies/disclaimer-disclosure/kn.json').then(m => m.default),
    ml: () => import('@/locales/policies/disclaimer-disclosure/ml.json').then(m => m.default),
    pa: () => import('@/locales/policies/disclaimer-disclosure/pa.json').then(m => m.default),
    or: () => import('@/locales/policies/disclaimer-disclosure/or.json').then(m => m.default),
    as: () => import('@/locales/policies/disclaimer-disclosure/as.json').then(m => m.default),
    ur: () => import('@/locales/policies/disclaimer-disclosure/ur.json').then(m => m.default),
  }
};

// --- HELPERS ---
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
      result[key] = source[key];
    }
  }
  return result;
}

async function loadPolicyTranslations(langCode: string): Promise<any> {
  const policyData: any = { common: {} };
  const loadPromises = Object.entries(policyTranslationLoaders).map(async ([policyKey, langLoaders]) => {
    const loader = langLoaders[langCode] || langLoaders['en'];
    try {
      const data = loader ? await loader() : {};
      return { policyKey, data };
    } catch {
      return { policyKey, data: {} };
    }
  });
  const results = await Promise.all(loadPromises);
  results.forEach(({ policyKey, data }) => {
    policyData[policyKey] = data;
  });
  return policyData;
}

/**
 * Main translation fetcher. 
 * Can be called from Server Components or Client Components.
 */
export async function getTranslation(langCode: string): Promise<TranslationData> {
  if (translationCache[langCode]) return translationCache[langCode];

  let mainTranslation: any = enData;
  if (langCode !== 'en' && dynamicTranslations[langCode]) {
    const translation = await dynamicTranslations[langCode]();
    mainTranslation = deepMerge(enData, translation);
  }

  const policyTranslations = await loadPolicyTranslations(langCode);
  const englishPolicyTranslations = langCode !== 'en' ? await loadPolicyTranslations('en') : policyTranslations;
  const mergedPolicyTranslations = deepMerge(englishPolicyTranslations, policyTranslations);

  const finalTranslation = {
    ...mainTranslation,
    policies: {
      ...(mainTranslation.policies || {}),
      common: mergedPolicyTranslations.common || {},
      collectionPolicy: mergedPolicyTranslations.collectionPolicy || {},
      grievanceRedressal: mergedPolicyTranslations.grievanceRedressal || {},
      interestRate: mergedPolicyTranslations.interestRate || {},
      itSecurity: mergedPolicyTranslations.itSecurity || {},
      kycAml: mergedPolicyTranslations.kycAml || {},
      privacy: mergedPolicyTranslations.privacy || {},
      cookie: mergedPolicyTranslations.cookie || {},
      fairPractice: mergedPolicyTranslations.fairPractice || {},
      refund: mergedPolicyTranslations.refund || {},
      rbiGuidelines: mergedPolicyTranslations.rbiGuidelines || {},
      terms: mergedPolicyTranslations.terms || {},
      disclaimerDisclosure: mergedPolicyTranslations.disclaimerDisclosure || {},
    }
  };

  translationCache[langCode] = finalTranslation as TranslationData;
  return finalTranslation as TranslationData;
}