import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import mrTranslations from '../locales/mr.json';
import guTranslations from '../locales/gu.json';
import teTranslations from '../locales/te.json';
import knTranslations from '../locales/kn.json';
import taTranslations from '../locales/ta.json';
import orTranslations from '../locales/or.json';
import bnTranslations from '../locales/bn.json';
import mlTranslations from '../locales/ml.json';
import asTranslations from '../locales/as.json';
import paTranslations from '../locales/pa.json';
import urTranslations from '../locales/ur.json';

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
  },
  ur: {
    translation: urTranslations
  }
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Fallback to English for missing translations
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