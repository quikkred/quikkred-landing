"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
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

// Cache for loaded translations - starts empty, will be populated with merged translations
const translationCache: Record<string, TranslationData> = {};

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

// Deep merge function to combine translations with English fallback
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

// Helper to get translation (loads dynamically if needed) with English fallback
async function getTranslation(langCode: string): Promise<TranslationData> {
  // English doesn't need fallback
  if (langCode === 'en') {
    return enData;
  }

  if (translationCache[langCode]) {
    return translationCache[langCode];
  }

  const loader = dynamicTranslations[langCode];
  if (loader) {
    const translation = await loader();
    // Merge with English as fallback - English first, then override with translation
    const mergedTranslation = deepMerge(enData, translation);
    translationCache[langCode] = mergedTranslation;
    return mergedTranslation;
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
  // On server: window is undefined, return null (no language)
  // On client during hydration: prioritize localStorage over window.__initialLanguage
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    // First check localStorage (user's persistent preference)
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      // Also update window.__initialLanguage to match
      (window as any).__initialLanguage = savedLang;
      return savedLang;
    }
    // Fall back to window.__initialLanguage if no localStorage
    return (window as any).__initialLanguage || null;
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const pathname = usePathname();

  // Initialize with a stable default to avoid hydration mismatch
  const [language, setLanguageState] = useState<string>('en');
  const [t, setT] = useState<TranslationData>(enData);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize language on client side only (after hydration)
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Get the saved language preference (defaults to 'en' if not set)
        const savedLang = getInitialLanguageForState() || 'en';

        // If no language in localStorage, set English as default
        if (!localStorage.getItem('language')) {
          localStorage.setItem('language', 'en');
          document.cookie = 'languageSelected=true; path=/; max-age=31536000';
        }

        // Update state first
        setLanguageState(savedLang);

        // Load translation if not English - this happens in parallel with i18n
        const translationPromise = savedLang !== 'en' ? getTranslation(savedLang) : Promise.resolve(enData);
        const i18nPromise = i18n ? i18n.changeLanguage(savedLang) : Promise.resolve();

        // Wait for both to complete in parallel
        const [translation] = await Promise.all([translationPromise, i18nPromise]);

        if (savedLang !== 'en') {
          setT(translation);
        }

        // Small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mark as initialized after language is loaded
        setIsInitialized(true);
      } catch (error) {
        console.error('Language initialization error:', error);
        // Don't fallback to English if no language selected
        setIsInitialized(true);
      }
    };

    initializeLanguage();
  }, [i18n]);

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

    // Sync with i18n
    if (i18n) {
      await i18n.changeLanguage(lang);
    }

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

  // Show loader only if mounted, not initialized, not on language selector page, and has language cookie
  // We check isMounted first to prevent hydration mismatch (server always renders children)
  if (isMounted && !isInitialized && pathname !== '/select-language') {
    const hasLanguageSelected = document.cookie.includes('languageSelected=true');

    // Only show loader if user has previously selected a language
    if (hasLanguageSelected) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#F0FDF4] to-white flex items-center justify-center">
          <div className="text-center">
            {/* Animated Logo with rotating ring */}
            <div className="relative mb-8">
              {/* Rotating outer ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-[#25B181]/20 border-t-[#25B181] rounded-full animate-spin"></div>
              </div>

              {/* Logo icon with pulse animation */}
              <div className="relative z-10 animate-pulse">
                <img
                  src="/i.svg"
                  alt="Quikkred Logo"
                  className="w-24 h-24 mx-auto"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(37, 177, 129, 0.2))',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                />
              </div>
            </div>

            {/* Loading dots and text */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#25B181] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-[#25B181] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-[#25B181] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="text-gray-700 font-semibold text-lg">Quikkred</p>
              <p className="text-gray-500 text-sm">Loading your experience...</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages,
      }}
    >
      <div className="animate-fadeIn">
        {children}
      </div>
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
