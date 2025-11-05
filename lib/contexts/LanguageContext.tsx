"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import enData from '@/locales/en.json';

type TranslationData = typeof enData;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationData;
  availableLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
  }>;
}

// Cache for loaded translations - only English is pre-loaded
const translationCache: Record<string, TranslationData> = {
  en: enData,
};

// Dynamic loaders for other languages - loaded only when needed
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

// Helper to get translation (loads dynamically if needed)
async function getTranslation(langCode: string): Promise<TranslationData> {
  if (translationCache[langCode]) {
    return translationCache[langCode];
  }

  const loader = dynamicTranslations[langCode];
  if (loader) {
    const translation = await loader();
    translationCache[langCode] = translation;
    return translation;
  }

  return enData;
}

export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தమిழ్' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get initial language - runs during component init
function getInitialLanguageForState() {
  // This function is called during component render, both on server and client
  // On server: window is undefined, return 'en'
  // On client during hydration: window.__initialLanguage is set by pre-hydration script
  if (typeof window === 'undefined') {
    return 'en';
  }
  try {
    return (window as any).__initialLanguage || localStorage.getItem('language') || 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Use initializer functions to read language and translations synchronously
  // Initializer runs once when component mounts, not during SSR
  const [language, setLanguageState] = useState<string>(() => {
    const lang = getInitialLanguageForState();
    // Also update window.__initialLanguage if needed
    if (typeof window !== 'undefined') {
      (window as any).__initialLanguage = lang;
    }
    return lang;
  });

  const [t, setT] = useState<TranslationData>(() => {
    const lang = getInitialLanguageForState();
    return translationCache[lang] || enData;
  });

  // Synchronize document attributes when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);

    // Load translation dynamically
    const translation = await getTranslation(lang);
    setT(translation);

    localStorage.setItem('language', lang);

    // Update document language attribute for SEO and accessibility
    document.documentElement.lang = lang;

    // Update text direction for RTL languages like Urdu
    if (lang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
