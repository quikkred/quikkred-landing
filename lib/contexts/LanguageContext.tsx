"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// Import the logic and types from your new lib file
import { getTranslation, TranslationData } from '@/lib/getTranslation';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationData;
  availableLanguages: typeof availableLanguages;
}

export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  lang, 
  initialData, 
  children 
}: { 
  lang: string; 
  initialData: TranslationData; 
  children: React.ReactNode 
}) {
  const { i18n } = useTranslation();

  // Initialize state with the SERVER DATA (Passed via props)
  const [language, setLanguageState] = useState<string>(lang || 'en');
  const [t, setT] = useState<TranslationData>(initialData);

  // Sync i18n library state with our Context state on mount
  useEffect(() => {
    if (i18n && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Sync document attributes for accessibility and SEO
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = async (newLang: string) => {
    // 1. Update Cookies for the Server
    document.cookie = `language=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `languageSelected=true; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Update Local State
    setLanguageState(newLang);
    if (i18n) await i18n.changeLanguage(newLang);

    // 3. Fetch New Translation Data using the shared lib function
    const translation = await getTranslation(newLang);
    setT(translation);

    // 4. Update DOM immediately
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      <div className="animate-fadeIn">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}