"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Globe, ChevronDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

// Static positions for floating dots to prevent hydration mismatch
const floatingDotsData = [
  { left: 15, top: 20, x: 150, y: -100, duration: 15 },
  { left: 85, top: 15, x: -180, y: 120, duration: 18 },
  { left: 25, top: 70, x: 120, y: 160, duration: 20 },
  { left: 75, top: 65, x: -150, y: -110, duration: 17 },
  { left: 45, top: 35, x: 170, y: 140, duration: 19 },
  { left: 65, top: 80, x: -100, y: -130, duration: 16 },
  { left: 10, top: 45, x: 140, y: 100, duration: 14 },
  { left: 90, top: 30, x: -160, y: -80, duration: 21 },
  { left: 50, top: 10, x: 110, y: 150, duration: 13 },
  { left: 20, top: 85, x: -130, y: -120, duration: 22 },
  { left: 70, top: 50, x: 190, y: 90, duration: 15 },
  { left: 35, top: 25, x: -140, y: 130, duration: 17 },
  { left: 80, top: 75, x: 160, y: -140, duration: 19 },
  { left: 5, top: 55, x: -120, y: 110, duration: 16 },
  { left: 95, top: 40, x: 130, y: -90, duration: 18 },
  { left: 40, top: 90, x: -170, y: 100, duration: 14 },
  { left: 60, top: 20, x: 150, y: 120, duration: 20 },
  { left: 30, top: 60, x: -110, y: -150, duration: 21 },
  { left: 55, top: 5, x: 140, y: 170, duration: 13 },
  { left: 12, top: 95, x: -190, y: -100, duration: 22 },
];

export function HeroSection() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isLanguageSelectionPage = pathname === '/select-language';
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    amount: "",
    email: "",
  });

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-white via-[#e8f4fd] to-[#ecfdf5]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/5 via-transparent to-[#34d399]/5" />

      <div className="absolute inset-0">
        {floatingDotsData.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full opacity-40"
            animate={{
              x: [0, dot.x],
              y: [0, dot.y],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
            }}
          />
        ))}
      </div>


      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-[#38bdf8]/20 to-[#34d399]/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 text-[#0ea5e9] border border-[#38bdf8]/30"
            >
              {t.hero.badge}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-sora leading-tight bg-gradient-to-r from-[#0ea5e9] to-[#10b981] bg-clip-text text-transparent">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t.hero.title}
              </motion.span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              {t.hero.description}
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">✓</div>
                <span className="text-sm sm:text-base text-gray-700 text-left">{t.hero.features.instant}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">✓</div>
                <span className="text-sm sm:text-base text-gray-700 text-left">{t.hero.features.paperless}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">✓</div>
                <span className="text-sm sm:text-base text-gray-700 text-left">{t.hero.features.secure}</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Application Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/50 order-1 lg:order-2"
          >
            {/* Language Selector Link - Only show on non-language-selection pages */}
            {!isLanguageSelectionPage && (
              <Link
                href="/select-language"
                className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-full hover:bg-white hover:shadow-soft transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">{t.common.language}</span>
              </Link>
            )}

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pr-20 sm:pr-32">
              {t.hero.cta.primary}
            </h3>

            <form className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {t.application.fields.fullName}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder={t.application.placeholders.fullName}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {t.application.fields.mobile}
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder={t.application.placeholders.mobile}
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {t.application.fields.loanAmount}
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder={t.application.placeholders.amount}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {t.application.fields.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder={t.application.placeholders.email}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#38bdf8] to-[#34d399] text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {t.hero.cta.primary}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              <p className="text-xs text-gray-600 text-center leading-relaxed">
                By clicking submit, you agree to our {t.navigation.terms} and {t.navigation.privacy}
              </p>
            </form>
          </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  );
}