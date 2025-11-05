'use client';

import { useLanguage, availableLanguages } from '@/lib/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function SelectLanguagePage() {
  const { setLanguage, language: currentLanguage } = useLanguage();
  const router = useRouter();

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    // Set cookie ONLY after user selects a language
    document.cookie = 'languageSelected=true; path=/; max-age=31536000';
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  const languages = availableLanguages.map(lang => ({
    code: lang.code,
    name: lang.nativeName,
  }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <Globe className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Choose Your Language
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Select your preferred language to continue browsing. Your choice will be remembered for the next year.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`relative group p-6 rounded-2xl font-semibold text-center transition-all duration-300 ${
                currentLanguage === lang.code
                  ? 'bg-white text-emerald-700 shadow-2xl ring-2 ring-white'
                  : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/30 backdrop-blur-md'
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity ${
                currentLanguage === lang.code ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
              }`} style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
              }} />

              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    currentLanguage === lang.code ? 'text-emerald-600' : 'text-white/60'
                  }`}>
                    {lang.code}
                  </span>
                  {currentLanguage === lang.code && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>
                <div className={`text-2xl font-bold ${
                  currentLanguage === lang.code ? 'text-emerald-700' : 'text-white'
                }`}>
                  {lang.name}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer with checkbox */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <label className="flex items-center gap-3 cursor-pointer bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-all">
            <div className="w-5 h-5 rounded bg-white flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-medium">
              Remember my choice (1 year)
            </span>
          </label>
        </motion.div>
      </motion.div>
    </div>
  );
}
