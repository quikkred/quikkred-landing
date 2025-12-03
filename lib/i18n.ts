import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import mrTranslations from '../locales/hi.json';
import guTranslations from '../locales/hi.json';
import teTranslations from '../locales/hi.json';
import knTranslations from '../locales/hi.json';
import taTranslations from '../locales/hi.json';
import orTranslations from '../locales/hi.json';
import bnTranslations from '../locales/hi.json';
import mlTranslations from '../locales/hi.json';
import asTranslations from '../locales/hi.json';
import paTranslations from '../locales/hi.json';

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  mr: {
    translation: mrTranslations
  },
  gu: {
    translation: guTranslations
  },
  te: {
    translation: teTranslations
  },
  kn: {
    translation: knTranslations
  },
  ta: {
    translation: taTranslations
  },
  or: {
    translation: orTranslations
  },
  bn: {
    translation: bnTranslations
  },
  pa: {
    translation: paTranslations
  },
  ml: {
    translation: mlTranslations
  },
  as: {
    translation: asTranslations
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