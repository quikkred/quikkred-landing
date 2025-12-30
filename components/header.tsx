"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  CreditCard,
  Info,
  FileText,
  Users,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);

  const navigation = [
    {
      name: t.navigation.products,
      href: "/products",
      icon: CreditCard,
    },
    {
      name: t.navigation.about,
      href: "/about-us",
      icon: Info,
    },
    // {
    //   name: t.navigation.resources,
    //   href: "/resources",
    //   icon: FileText,
    //   submenu: [
    //     {
    //       name: t.navigation.emiCalculator,
    //       href: "/resources/emi-calculator",
    //       description: t.navigation.emiCalculatorDesc,
    //     },
    //     {
    //       name: t.eligibility.check,
    //       href: "/eligibility-check",
    //       description: t.eligibility.checkDesc,
    //     },
    //     {
    //       name: t.eligibility.documentGuide,
    //       href: "/documents",
    //       description: t.eligibility.documentGuideDesc,
    //     },
    //     {
    //       name: t.eligibility.interestRates,
    //       href: "/intrest-rate",
    //       description: t.eligibility.interestRatesDesc,
    //     },
    //   ],
    // },
    {
      name: t.navigation.partners,
      href: "/partners",
      icon: Users,
      submenu: [
        {
          name: t.navigation.channelPartners,
          href: "/channel-partner",
          description: t.navigation.channelPartnersDesc,
        },
        {
          name: t.navigation.investorRelations,
          href: "/partners/investor-relations",
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
          setIsScrolled((prev) => {
            if (scrollY > 50) return true;
            if (scrollY < 30) return false;
            return prev;
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-100"
          : "bg-white"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.svg"
              alt={t.common.appName}
              className="h-10 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/'
                  ? 'text-teal-600 bg-teal-50'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
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
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname.startsWith(item.href)
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                  {item.submenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                  )}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.submenu && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 group transition-all duration-200"
                          >
                            <div>
                              <p className="font-medium text-sm text-slate-800 group-hover:text-teal-700">
                                {subitem.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {subitem.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all duration-200" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Side - CTA Button */}
          <div className="flex items-center gap-3">
            {/* CTA Button */}
            {user ? (
              <Link href="/user">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            ) : isHomePage ? (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {t.navigation.login}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            ) : (
              <Link href="/apply/quick">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {t.common.apply}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-slate-100"
          >
            <div className="container mx-auto px-4 py-4 max-h-[70vh] overflow-y-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/'
                    ? 'text-teal-600 bg-teal-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t.navigation.home}
              </Link>

              {navigation.map((item) => (
                <div key={item.name} className="mt-1">
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.name ? null : item.name)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors ${
                          pathname.startsWith(item.href)
                            ? 'text-teal-600 bg-teal-50 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileSubmenuOpen === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-8 mt-1 space-y-1 border-l-2 border-slate-100 pl-4 overflow-hidden"
                          >
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-600 transition-colors"
                              >
                                {subitem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        pathname.startsWith(item.href)
                          ? 'text-teal-600 bg-teal-50 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                {user ? (
                  <Link
                    href="/user"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block mt-2"
                  >
                    <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-2xl text-base shadow-lg">
                      Dashboard
                    </button>
                  </Link>
                ) : isHomePage ? (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block mt-2"
                  >
                    <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-2xl text-base shadow-lg">
                      {t.navigation.login}
                    </button>
                  </Link>
                ) : (
                  <Link
                    href="/apply/quick"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block mt-2"
                  >
                    <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-2xl text-base shadow-lg">
                      {t.common.apply}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
