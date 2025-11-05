"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  User,
  Home,
  CreditCard,
  Info,
  FileText,
  Users,
  Briefcase,
  Shield,
  HelpCircle,
  LogIn,
  ArrowRight,
  Sparkles,
  Calculator,
  TrendingUp,
  Award,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

export function Header() {
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const isHydrated = useIsHydrated();
  const pathname = usePathname();
  const isLanguageSelectionPage = pathname === '/select-language';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigation = [
    {
      name: t.navigation.products,
      href: "/products",
      icon: CreditCard,
      submenu: [
        {
          name: t.products.types.salary.name,
          href: "/products/salary-advance",
          description: t.products.types.salary.description,
        },
        {
          name: t.products.types.personal.name,
          href: "/products/personal-loan",
          description: t.products.types.personal.description,
        },
        {
          name: t.products.types.emergency.name,
          href: "/products/emergency",
          description: t.products.types.emergency.description,
        },
        {
          name: t.products.types.festival.name,
          href: "/products/festival",
          description: t.products.types.festival.description,
        },
        {
          name: t.products.types.medical.name,
          href: "/products/medical",
          description: t.products.types.medical.description,
        },
        {
          name: t.products.types.travel.name,
          href: "/products/travel",
          description: t.products.types.travel.description,
        },
      ],
    },
    {
      name: t.navigation.about,
      href: "/about",
      icon: Info,
      submenu: [
        {
          name: t.about.ourStory,
          href: "/about#story",
          description: t.about.ourStoryDesc,
        },
        {
          name: t.about.leadershipTeam,
          href: "/about#leadership",
          description: t.about.leadershipDesc,
        },
        {
          name: t.about.missionVision,
          href: "/about#mission",
          description: t.about.missionVisionDesc,
        },
        {
          name: t.about.timeline,
          href: "/about#timeline",
          description: t.about.timelineDesc,
        },
        {
          name: t.about.values,
          href: "/about#values",
          description: t.about.valuesDesc,
        },
      ],
    },
    {
      name: t.navigation.resources,
      href: "/resources",
      icon: FileText,
      submenu: [
        {
          name: t.navigation.emiCalculator,
          href: "/resources/emi-calculator",
          description: t.navigation.emiCalculatorDesc,
        },
        {
          name: t.eligibility.check,
          href: "/resources/eligibility-check",
          description: t.eligibility.checkDesc,
        },
        {
          name: t.eligibility.documentGuide,
          href: "/resources/documents",
          description: t.eligibility.documentGuideDesc,
        },
        {
          name: t.eligibility.interestRates,
          href: "/resources/intrest-rate",
          description: t.eligibility.interestRatesDesc,
        },
        {
          name: t.navigation.blog,
          href: "/resources/blog",
          description: t.navigation.blogDesc,
        },
        {
          name: t.navigation.faqs,
          href: "/resources/faqs",
          description: t.faqs.description,
        },
      ],
    },
    {
      name: t.navigation.partners,
      href: "/partners",
      icon: Users,
      submenu: [
        {
          name: t.navigation.channelPartners,
          href: "/partners/channel",
          description: t.navigation.channelPartnersDesc,
        },
        {
          name: t.navigation.corporateTieups,
          href: "/partners/corporate",
          description: t.navigation.corporateTieupsDesc,
        },
        {
          name: t.navigation.apiIntegration,
          href: "/partners/api",
          description: t.navigation.apiIntegrationDesc,
        },
        {
          name: t.navigation.investorRelations,
          href: "/partners/investors",
          description: t.navigation.investorRelationsDesc,
        },
      ],
    },
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Use hysteresis to prevent toggling: hide at 50px, show at 30px
          setIsScrolled((prev) => {
            if (scrollY > 50) return true;
            if (scrollY < 30) return false;
            return prev; // Keep current state in the dead zone
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header
      className={`sticky bg-white top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-xl-dark" : "bg-transparent"
      }`}
    >
      {/* Top Bar */}
      <div
        className={`border-b border-slate-700 transition-all duration-300 ${
          isScrolled
            ? "opacity-0 max-h-0 overflow-hidden"
            : "opacity-100 max-h-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-0 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 text-slate-700">
              <a
                href={`tel:${t.footer.contact.phone}`}
                className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
              >
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">
                  {t.footer.contact.phone}
                </span>
              </a>
              <a
                href={`mailto:${t.footer.contact.email}`}
                className="hidden sm:flex items-center gap-1 hover:text-emerald-500 transition-colors"
              >
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{t.footer.contact.email}</span>
              </a>
              <span className="hidden lg:flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate max-w-[200px] xl:max-w-none">
                  {t.footer.contact.address}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {/* Language Selector - Only show on non-language-selection pages */}
              {!isLanguageSelectionPage && (
                <Link
                  href="/select-language"
                  className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                >
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {isHydrated && (
                    <span className="text-xs hidden sm:inline">
                      {availableLanguages.find((l) => l.code === language)
                        ?.nativeName || "English"}
                    </span>
                  )}
                </Link>
              )}

              {/* <Link href="/track-application" className="hover:text-emerald-500 transition-colors hidden md:inline">
                {t.navigation.track}
              </Link> */}
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-1 hover:text-emerald-500 transition-colors"
              >
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {t.navigation.login}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto sm:px-6">
        <div className="flex justify-between items-center py-0">
          {/* Logo */}
         <Link href="/" className="flex p-[20px] items-center group">
  <img
    src="https://quikkred.in/logo.png"
    alt={t.common.appName}
    className="h-auto object-contain"
    style={{ imageRendering: '-webkit-optimize-contrast',maxHeight: '50px' }}
  />
</Link>
          {/* <div className="flex"> */}
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/"
                className="flex items-center px-2 xl:px-3 py-2 text-sm xl:text-base text-slate-700 hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                {t.navigation.home}
              </Link>

              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center px-2 py-2 text-sm xl:text-base text-slate-700 hover:text-blue-400 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    {item.submenu && <ChevronDown className="w-3 h-3" />}
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.submenu && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-64 xl:w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/20 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              className="block px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl hover:bg-slate-100 group transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-sm xl:text-base text-slate-900 group-hover:text-blue-600">
                                    {subitem.name}
                                  </p>
                                  <p className="text-xs xl:text-sm text-slate-600">
                                    {subitem.description}
                                  </p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link
                href="/contact"
                className="flex items-center gap-1.5 px-2 xl:px-3 py-2 text-sm xl:text-base text-slate-700 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {t.navigation.contact}
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <Link href="/apply">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center w-[100px] gap-1 text-xs xl:text-sm !py-2 xl:!py-2.5 !px-4 xl:!px-5"
                >
                  {t.common.apply}
                  <ArrowRight className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                </motion.button>
              </Link>
            </div>
          {/* </div> */}
          {/* Mobile Login & Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1 p-2 text-slate-700 hover:text-blue-400 transition-colors"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-400 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/95 border-t border-slate-700"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-h-[70vh] overflow-y-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                {t.navigation.home}
              </Link>
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-6 sm:ml-8 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                {t.navigation.contact}
              </Link>
              <div className="mt-4 pt-4 border-t border-slate-700">
                {/* Mobile Language Selector Link - Only show on non-language-selection pages */}
                {!isLanguageSelectionPage && (
                  <Link
                    href="/select-language"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.common.language}
                  </Link>
                )}

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 sm:px-4 py-2.5 sm:py-3 text-center text-sm sm:text-base text-slate-200 font-semibold hover:text-blue-400 transition-colors"
                >
                  {t.navigation.login}
                </Link>
                <Link
                  href="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 sm:px-4"
                >
                  <button className="w-full mt-2 btn-primary text-sm sm:text-base py-2.5 sm:py-3">
                    {t.common.apply}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
