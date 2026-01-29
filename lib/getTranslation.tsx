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
    cookie?: Record<string, any>;
    fairPractice?: Record<string, any>;
    privacy?: Record<string, any>;
    terms?: Record<string, any>;
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
  },
  grievanceRedressal: { en: () => import('@/locales/policies/grievance-redressal/en.json').then(m => m.default) },
  interestRate: { en: () => import('@/locales/policies/interest-rate/en.json').then(m => m.default) },
  itSecurity: { en: () => import('@/locales/policies/it-security/en.json').then(m => m.default) },
  kycAml: { en: () => import('@/locales/policies/kyc-aml/en.json').then(m => m.default) },
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
    }
  };

  translationCache[langCode] = finalTranslation as TranslationData;
  return finalTranslation as TranslationData;
}