import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: false, // Don't fallback to any language automatically
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'cookie'], // Remove navigator to prevent auto-detection
      caches: [], // Don't cache automatically - we handle this manually
      lookupLocalStorage: 'language',
      lookupCookie: 'i18nextLng'
    },
    // Don't load a language automatically on init
    lng: undefined,
    load: 'languageOnly'
  });

export default i18n;