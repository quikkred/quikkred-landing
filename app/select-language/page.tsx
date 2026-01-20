'use client';

import { useLanguage, availableLanguages } from '@/lib/contexts/LanguageContext';
import { useRouter } from "nextjs-toploader/app";
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function SelectLanguagePage() {
  const { setLanguage, language: currentLanguage } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const handleLanguageSelect = async (langCode: string) => {
    setIsLoading(true);
    setSelectedLang(langCode);

    // Set language
    await setLanguage(langCode);

    // Set cookie ONLY after user selects a language
    document.cookie = 'languageSelected=true; path=/; max-age=31536000';

    // Small delay for smooth transition
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  const languages = availableLanguages.map(lang => ({
    code: lang.code,
    name: lang.nativeName,
  }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#25B181] via-[#1F8F68] to-[#16A085] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#25B181]/95 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl inline-block">
                  <Image
                    src="/i.svg"
                    alt="Quikkred Logo"
                    width={64}
                    height={64}
                    className="w-12 h-12 sm:w-16 sm:h-16"
                  />
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4 inline-block"
              >
                <Loader2 className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Setting up your language...
                </h2>
                <p className="text-white/80 text-sm sm:text-base">
                  {selectedLang && languages.find(l => l.code === selectedLang)?.name}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background elements - more subtle */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-56 h-56 sm:w-72 sm:h-72 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Header with Logo */}
        <div className="text-center mb-8 sm:mb-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl">
              <Image
                src="/i.svg"
                alt="Quikkred Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>
          </motion.div>

          {/* Title with Globe Icon */}
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Choose Your Language
            </h1>
          </div>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto px-4">
            Select your preferred language to continue. Your choice will be saved.
          </p>
        </div>

        {/* Language Grid - More compact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              whileHover={!isLoading ? { scale: 1.05, y: -3 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
              onClick={() => !isLoading && handleLanguageSelect(lang.code)}
              disabled={isLoading}
              className={`relative group p-4 rounded-xl font-semibold text-center transition-all duration-200 ${
                currentLanguage === lang.code
                  ? 'bg-white text-[#25B181] shadow-xl ring-2 ring-white/50'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Content */}
              <div className="relative">
                {/* Language Name */}
                <div className={`text-base sm:text-lg font-bold mb-1 ${
                  currentLanguage === lang.code ? 'text-[#25B181]' : 'text-white'
                }`}>
                  {lang.name}
                </div>

                {/* Language Code */}
                <div className={`text-xs uppercase tracking-wide ${
                  currentLanguage === lang.code ? 'text-[#1F8F68]' : 'text-white/70'
                }`}>
                  {lang.code}
                </div>

                {/* Selected Check */}
                {currentLanguage === lang.code && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#25B181] rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer with info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-2.5 rounded-full border border-white/30">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#25B181]" />
            </div>
            <span className="text-white/90 text-xs sm:text-sm font-medium">
              Your choice will be saved for 1 year
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
