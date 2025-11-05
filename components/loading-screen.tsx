"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Sparkles, Globe, ChevronRight, Shield, Clock,
  HeartHandshake, TrendingUp, Building, CreditCard,
  Banknote, Key, DoorOpen
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { CubeLoader, DNALoader, GatewayVaultLoader, GoldenPotLoader, MorphingLoader, QuantumLoader, RippleLoader, TrustShieldLoader, UltimateLoader, WealthPortalLoader } from "@/components/ui/ultimate-loader";
import SplashLoader from './Splashloader';

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "অসমীয়া", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
];

// Static positions for floating icons to prevent hydration mismatch
const floatingIconsData = [
  { left: 10, top: 20, duration: 15, xOffset: 30, yOffset: -20 },
  { left: 80, top: 10, duration: 18, xOffset: -40, yOffset: 30 },
  { left: 20, top: 70, duration: 20, xOffset: 25, yOffset: 40 },
  { left: 70, top: 60, duration: 17, xOffset: -30, yOffset: -25 },
  { left: 40, top: 30, duration: 19, xOffset: 35, yOffset: 35 },
  { left: 60, top: 80, duration: 16, xOffset: -20, yOffset: -30 },
];

export function LoadingScreen() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    // Check if language was already selected and if we've shown the loading screen before
    const savedLang = localStorage.getItem('language');
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');

    if (savedLang && hasSeenLoader === 'true') {
      // Skip loading screen entirely for returning visitors in same session
      setIsLoading(false);
      return;
    }

    if (savedLang) {
      setSelectedLanguage(savedLang);
      setShowLanguageSelector(false);
      startLoading();
      sessionStorage.setItem('hasSeenLoader', 'true');
    }
  }, []);

  const startLoading = () => {
    // Show loader for 600ms (reduced from 1000ms for faster load)
    setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasSeenLoader', 'true');
    }, 600);
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setLanguage(langCode);
    setShowLanguageSelector(false);
    startLoading();
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-gradient-to-br from-[#38bdf8] via-[#34d399] to-[#38bdf8] overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }} />
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0">
            {[CreditCard, Banknote, Shield, TrendingUp, Building, HeartHandshake].map((Icon, i) => {
              const iconData = floatingIconsData[i];
              return (
                <motion.div
                  key={i}
                  className="absolute text-white/10"
                  animate={{
                    x: [0, iconData.xOffset],
                    y: [0, iconData.yOffset],
                  }}
                  transition={{
                    duration: iconData.duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    left: `${iconData.left}%`,
                    top: `${iconData.top}%`,
                  }}
                >
                  <Icon size={40} />
                </motion.div>
              );
            })}
          </div>

          {/* Loading Animation - Splash Loader */}
          <SplashLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}