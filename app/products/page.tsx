"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  Wallet,
  AlertCircle,
  PartyPopper,
  Heart,
  Plane,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Clock,
  Calculator,
  ChevronDown,
  Banknote,
  Users,
  Award,
  Zap,
  Building,
  ChevronRight,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Products from "@/components/Product/Products";
import { API_BASE_URL, QUICK_FORM_URL } from '@/lib/config';
import { useProducts } from '@/store/hooks/useProducts';

// Use cases for the single Payday Loan product (mirrors homepage loan cards)
const USE_CASES = [
  {
    key: "salaryAdvance",
    icon: Banknote,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/50",
    accent: "bg-emerald-50",
    accentText: "text-emerald-600",
  },
  {
    key: "personalLoan",
    icon: Wallet,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "shadow-purple-500/50",
    accent: "bg-purple-50",
    accentText: "text-purple-600",
  },
  {
    key: "emergencyFund",
    icon: AlertCircle,
    gradient: "from-rose-500 via-red-500 to-orange-500",
    glow: "shadow-red-500/50",
    accent: "bg-red-50",
    accentText: "text-red-600",
  },
  {
    key: "festivalAdvance",
    icon: PartyPopper,
    gradient: "from-amber-400 via-orange-500 to-pink-500",
    glow: "shadow-orange-500/50",
    accent: "bg-orange-50",
    accentText: "text-orange-600",
  },
  {
    key: "medicalLoan",
    icon: Heart,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    glow: "shadow-pink-500/50",
    accent: "bg-pink-50",
    accentText: "text-pink-600",
  },
  {
    key: "travelLoan",
    icon: Plane,
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    glow: "shadow-blue-500/50",
    accent: "bg-blue-50",
    accentText: "text-blue-600",
  },
] as const;

const STAT_ITEMS = [
  { key: "amountRange", valueKey: "amount", icon: Banknote },
  { key: "interestRate", valueKey: "rate", icon: TrendingUp },
  { key: "tenure", valueKey: "tenure", icon: Clock },
  { key: "processingFee", valueKey: "processingFee", icon: Calculator },
  { key: "approvalTime", valueKey: "approvalTime", icon: Zap },
] as const;

// Coordinated color themes that cycle for the featured Payday Loan section.
// All themes use ONLY the logo brand colors: green #25B89B and blue #4884FF.
const FEATURED_THEMES = [
  {
    name: "brandGreen",
    pageBg: "linear-gradient(135deg, #E6F7F2 0%, #FFFFFF 50%, #D1F0E6 100%)",
    blobA: "#25B89B",
    blobB: "#34d399",
    blobC: "rgba(37,184,155,0.4), rgba(52,211,153,0.3), rgba(37,184,155,0.4)",
    ring: "conic-gradient(from 0deg, #25B89B, #34d399, #1F8F68, #25B89B)",
    headingFrom: "#064e3b",
    headingVia: "#065f46",
    headingTo: "#047857",
    iconFrom: "#25B89B",
    iconVia: "#34d399",
    iconTo: "#1F8F68",
    iconShadow: "rgba(37,184,155,0.45)",
    buttonFrom: "#25B89B",
    buttonVia: "#34d399",
    buttonTo: "#1F8F68",
    buttonShadow: "rgba(37,184,155,0.5)",
    statsFrom: "#0d9b6f",
    statsVia: "#25B89B",
    statsTo: "#1F8F68",
    badgeText: "#25B89B",
    badgeBorder: "rgba(37,184,155,0.3)",
    checkBg: "#d1fae5",
    checkText: "#25B89B",
    taglineColor: "#0f766e",
  },
  {
    name: "brandBlue",
    pageBg: "linear-gradient(135deg, #E6EEFF 0%, #FFFFFF 50%, #DBE6FF 100%)",
    blobA: "#4884FF",
    blobB: "#60a5fa",
    blobC: "rgba(72,132,255,0.4), rgba(96,165,250,0.3), rgba(72,132,255,0.4)",
    ring: "conic-gradient(from 0deg, #4884FF, #60a5fa, #2563eb, #4884FF)",
    headingFrom: "#1e3a8a",
    headingVia: "#1e40af",
    headingTo: "#1d4ed8",
    iconFrom: "#4884FF",
    iconVia: "#60a5fa",
    iconTo: "#2563eb",
    iconShadow: "rgba(72,132,255,0.45)",
    buttonFrom: "#4884FF",
    buttonVia: "#60a5fa",
    buttonTo: "#2563eb",
    buttonShadow: "rgba(72,132,255,0.5)",
    statsFrom: "#2563eb",
    statsVia: "#4884FF",
    statsTo: "#1d4ed8",
    badgeText: "#2563eb",
    badgeBorder: "rgba(72,132,255,0.3)",
    checkBg: "#dbeafe",
    checkText: "#2563eb",
    taglineColor: "#1e40af",
  },
  {
    name: "greenBlue",
    pageBg: "linear-gradient(135deg, #E6F7F2 0%, #FFFFFF 50%, #DBE6FF 100%)",
    blobA: "#25B89B",
    blobB: "#4884FF",
    blobC: "rgba(37,184,155,0.4), rgba(72,132,255,0.3), rgba(37,184,155,0.4)",
    ring: "conic-gradient(from 0deg, #25B89B, #4884FF, #25B89B)",
    headingFrom: "#064e3b",
    headingVia: "#0f766e",
    headingTo: "#1e40af",
    iconFrom: "#25B89B",
    iconVia: "#4884FF",
    iconTo: "#25B89B",
    iconShadow: "rgba(37,184,155,0.45)",
    buttonFrom: "#25B89B",
    buttonVia: "#4884FF",
    buttonTo: "#25B89B",
    buttonShadow: "rgba(37,184,155,0.5)",
    statsFrom: "#25B89B",
    statsVia: "#4884FF",
    statsTo: "#25B89B",
    badgeText: "#25B89B",
    badgeBorder: "rgba(37,184,155,0.3)",
    checkBg: "#d1fae5",
    checkText: "#25B89B",
    taglineColor: "#0f766e",
  },
  {
    name: "blueGreen",
    pageBg: "linear-gradient(135deg, #DBE6FF 0%, #FFFFFF 50%, #E6F7F2 100%)",
    blobA: "#4884FF",
    blobB: "#25B89B",
    blobC: "rgba(72,132,255,0.4), rgba(37,184,155,0.3), rgba(72,132,255,0.4)",
    ring: "conic-gradient(from 0deg, #4884FF, #25B89B, #4884FF)",
    headingFrom: "#1e3a8a",
    headingVia: "#1e40af",
    headingTo: "#065f46",
    iconFrom: "#4884FF",
    iconVia: "#25B89B",
    iconTo: "#4884FF",
    iconShadow: "rgba(72,132,255,0.45)",
    buttonFrom: "#4884FF",
    buttonVia: "#25B89B",
    buttonTo: "#4884FF",
    buttonShadow: "rgba(72,132,255,0.5)",
    statsFrom: "#4884FF",
    statsVia: "#25B89B",
    statsTo: "#4884FF",
    badgeText: "#2563eb",
    badgeBorder: "rgba(72,132,255,0.3)",
    checkBg: "#dbeafe",
    checkText: "#2563eb",
    taglineColor: "#1e40af",
  },
];

// Format amount to Indian currency format
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

interface LoanProduct {
  _id: string;
  productName: string;
  productCode: string;
  description: string;
  category: string;
  status: string;
  dailyInterestRate: number;
  processingFee: number;
  gst: number;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  isActive: boolean;
}

export default function ProductsPage() {
  const { t } = useTranslation();

  const {
    products: reduxProducts,
    fetchProducts: reduxFetchProducts,
  } = useProducts();

  const [apiProducts, setApiProducts] = useState<LoanProduct[]>([]);
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = FEATURED_THEMES[themeIndex];

  // Cycle the featured section theme every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((idx) => (idx + 1) % FEATURED_THEMES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update local state when Redux products change
  useEffect(() => {
    if (reduxProducts && reduxProducts.length > 0) {
      // Filter only active products
      const activeProducts = reduxProducts.filter(
        (product: LoanProduct) => product.isActive && product.status === "ACTIVE"
      );
      setApiProducts(activeProducts);
    }
  }, [reduxProducts]);

  // Fetch products on mount using Redux
  useEffect(() => {
    reduxFetchProducts();
  }, []);

  const apiProduct = apiProducts[0];
  const paydayLoan = {
    title: t("products.paydayLoan.title", { defaultValue: "Payday Loan" }) as string,
    tagline: t("products.paydayLoan.tagline", { defaultValue: "" }) as string,
    description: t("products.paydayLoan.description", { defaultValue: "" }) as string,
    amount: t("products.paydayLoan.amount", { defaultValue: "₹2,500 - ₹50,000" }) as string,
    tenure: t("products.paydayLoan.tenure", { defaultValue: "Up to 90 days" }) as string,
    rate: apiProduct
      ? `${apiProduct.dailyInterestRate}% per day`
      : (t("products.paydayLoan.rate", { defaultValue: "" }) as string),
    processingFee: apiProduct
      ? `${apiProduct.processingFee}% + GST`
      : (t("products.paydayLoan.processingFee", { defaultValue: "" }) as string),
    approvalTime: t("products.paydayLoan.approvalTime", { defaultValue: "30 seconds" }) as string,
    features: t("products.paydayLoan.features", { returnObjects: true, defaultValue: [] }) as string[],
    eligibility: t("products.paydayLoan.eligibility", { returnObjects: true, defaultValue: [] }) as string[],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section — Products renders its own full-bleed <section>, so no
          wrapper here (a wrapping <section> would re-add the global side padding). */}
      <Products
        title={t('products.hero.title')}
        highlightWord={t('products.hero.highlightWord')}
        subtitle={t('products.hero.subtitle')}
        buttonPrimaryText={t('products.hero.buttonPrimary')}
        buttonSecondaryText={t('products.hero.buttonSecondary')}
        imageSrc="/quikkred_image.webp"
        primaryColor="emerald"
      />

      {/* Featured Product - Payday Loan */}
      <motion.section
        animate={{ background: theme.pageBg }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className="relative py-12 sm:py-16 lg:py-24 overflow-hidden"
      >
        {/* Animated gradient blobs */}
        <motion.div
          aria-hidden
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
            backgroundColor: theme.blobA,
          }}
          transition={{
            x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 1.6, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute -top-20 -left-20 w-[28rem] h-[28rem] rounded-full opacity-20 blur-3xl z-0"
        />
        <motion.div
          aria-hidden
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
            backgroundColor: theme.blobB,
          }}
          transition={{
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 1.6, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute -bottom-24 -right-20 w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl z-0"
        />
        <motion.div
          aria-hidden
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute top-1/2 right-1/4 w-72 h-72 rounded-full blur-2xl opacity-50 z-0"
          style={{
            background: `conic-gradient(from 0deg, ${theme.blobC})`,
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 ,zIndex:1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center mb-10 sm:mb-12 mx-auto max-w-5xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-emerald-100"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              animate={{ color: theme.badgeText, borderColor: theme.badgeBorder }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full font-semibold mb-4 border text-xs sm:text-sm shadow-sm"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.span>
              {t('products.featured.badge')}
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-sora mb-3 sm:mb-4 px-4">
              <motion.span
                animate={{
                  backgroundImage: `linear-gradient(to right, ${theme.headingFrom}, ${theme.headingVia}, ${theme.headingTo})`,
                }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {paydayLoan.title}
              </motion.span>
            </h2>
            <motion.p
              animate={{ color: theme.taglineColor }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="text-base sm:text-lg max-w-3xl mx-auto px-4"
            >
              {paydayLoan.tagline}
            </motion.p>
          </motion.div>

          {/* Featured card with animated gradient border */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Animated gradient ring */}
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-[2px] rounded-[1.5rem] sm:rounded-[2rem] opacity-70 blur-[1px]"
              style={{ background: theme.ring }}
            />

            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-10 lg:p-14 border border-white">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 6 }}
                      animate={{
                        boxShadow: [
                          `0 0 0 0 ${theme.iconShadow}`,
                          `0 0 0 18px ${theme.iconShadow.replace(/[\d.]+\)$/, "0)")}`,
                        ],
                        backgroundImage: `linear-gradient(to bottom right, ${theme.iconFrom}, ${theme.iconVia}, ${theme.iconTo})`,
                      }}
                      transition={{
                        boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeOut" },
                        backgroundImage: { duration: 1.6, ease: "easeInOut" },
                      }}
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Zap className="w-8 h-8 text-white" />
                      <motion.span
                        aria-hidden
                        animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400"
                      >
                        <Star className="w-4 h-4 fill-yellow-400" />
                      </motion.span>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sora">
                        {paydayLoan.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        {paydayLoan.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {paydayLoan.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + index * 0.07 }}
                        className="flex items-start gap-3 text-sm sm:text-base group"
                      >
                        <motion.span
                          animate={{ backgroundColor: theme.checkBg }}
                          transition={{ duration: 1.6, ease: "easeInOut" }}
                          className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                        >
                          <motion.span
                            animate={{ color: theme.checkText }}
                            transition={{ duration: 1.6, ease: "easeInOut" }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.span>
                        </motion.span>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Link href={QUICK_FORM_URL as string}>
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: `0 20px 40px -10px ${theme.buttonShadow}` }}
                      whileTap={{ scale: 0.96 }}
                      animate={{
                        backgroundImage: `linear-gradient(to right, ${theme.buttonFrom}, ${theme.buttonVia}, ${theme.buttonTo})`,
                        boxShadow: `0 10px 20px -8px ${theme.buttonShadow}`,
                      }}
                      transition={{ duration: 1.6, ease: "easeInOut" }}
                      className="relative overflow-hidden px-8 py-3.5 text-white rounded-full font-semibold flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <motion.span
                        aria-hidden
                        animate={{ x: ["-120%", "120%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-y-0 w-1/3 bg-white/20 skew-x-[-20deg]"
                      />
                      <span className="relative">{t('products.featured.applyButton')}</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </motion.button>
                  </Link>
                </div>

                {/* Stats card */}
                <div className="relative">
                  <motion.div
                    whileHover={{ y: -4 }}
                    animate={{
                      backgroundImage: `linear-gradient(to bottom right, ${theme.statsFrom}, ${theme.statsVia}, ${theme.statsTo})`,
                      boxShadow: `0 20px 30px -12px ${theme.buttonShadow}`,
                    }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    className="relative rounded-2xl p-6 sm:p-8 text-white overflow-hidden"
                  >
                    {/* Pattern overlay */}
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    <motion.div
                      aria-hidden
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10"
                    />
                    <motion.div
                      aria-hidden
                      animate={{ rotate: -360 }}
                      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10"
                    />

                    <h4 className="font-semibold mb-6 text-lg flex items-center gap-2 relative">
                      <Sparkles className="w-5 h-5" />
                      {t('products.featured.quickStats')}
                    </h4>
                    <div className="space-y-3 relative">
                      {STAT_ITEMS.map((stat, idx) => {
                        const StatIcon = stat.icon;
                        return (
                          <motion.div
                            key={stat.key}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + idx * 0.08 }}
                            className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
                          >
                            <span className="flex items-center gap-2 text-sm sm:text-base text-white/90">
                              <StatIcon className="w-4 h-4" />
                              {t(`products.featured.${stat.key}`)}
                            </span>
                            <span className="font-bold text-sm sm:text-base">
                              {paydayLoan[stat.valueKey as keyof typeof paydayLoan] as string}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mt-8 sm:mt-10 relative"
          >
            <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-emerald-100 overflow-hidden">
              {/* Subtle brand-color glow accents */}
              <div aria-hidden className="pointer-events-none absolute -top-12 -left-12 w-40 h-40 rounded-full bg-[#25B89B]/10 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-[#4884FF]/10 blur-3xl" />
              <h4 className="relative font-semibold text-lg mb-5 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#25B89B]" />
                <span className="bg-gradient-to-r from-[#25B89B] to-[#4884FF] bg-clip-text text-transparent">
                  {t('products.allProducts.eligibilityCriteria')}
                </span>
              </h4>
              <ul className="relative grid sm:grid-cols-2 gap-3">
                {paydayLoan.eligibility.map((item, idx) => {
                  const isGreen = idx % 2 === 0;
                  const checkColor = isGreen ? "text-[#25B89B]" : "text-[#4884FF]";
                  const hoverBg = isGreen ? "hover:bg-emerald-50" : "hover:bg-blue-50";
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className={`flex items-start gap-3 text-sm sm:text-base p-3 rounded-lg ${hoverBg} transition-colors`}
                    >
                      <CheckCircle className={`w-5 h-5 ${checkColor} mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* Theme dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {FEATURED_THEMES.map((th, idx) => (
              <motion.button
                key={th.name}
                onClick={() => setThemeIndex(idx)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  width: idx === themeIndex ? 28 : 10,
                  backgroundColor: idx === themeIndex ? theme.headingVia : "rgba(0,0,0,0.18)",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-2.5 rounded-full"
                aria-label={`Theme ${th.name}`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Use Cases - Where can you use this loan */}
      <section className="relative py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
        {/* Decorative grid background — alternating brand green / blue lines */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #25B89B 1px, transparent 1px), linear-gradient(to bottom, #4884FF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Brand-colored ambient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-10 w-72 h-72 rounded-full bg-[#25B89B]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-10 w-72 h-72 rounded-full bg-[#4884FF]/10 blur-3xl"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.span
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 via-white to-blue-50 rounded-full text-xs sm:text-sm font-semibold mb-4 border border-emerald-100"
            >
              <Sparkles className="w-4 h-4 text-[#25B89B]" />
              <span className="bg-gradient-to-r from-[#25B89B] to-[#4884FF] bg-clip-text text-transparent">
                {t('products.useCases.badge')}
              </span>
            </motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora mb-4 px-4">
              {t('products.useCases.title')}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#25B89B] to-[#4884FF] bg-clip-text text-transparent">
                  {t('products.useCases.titleHighlight')}
                </span>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute bottom-1 left-0 right-0 h-2 sm:h-3 bg-gradient-to-r from-emerald-200/60 to-blue-200/60 origin-left -z-0"
                />
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('products.useCases.subtitle')}
            </p>
          </motion.div>

          {/* Two-row counter-scrolling marquee — full viewport width (breaks out of container) */}
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen space-y-5 sm:space-y-6">
            {/* Edge fade masks (cover both rows) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 z-20 bg-gradient-to-r from-white via-white/90 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 z-20 bg-gradient-to-l from-white via-white/90 to-transparent"
            />

            {[
              { reverse: false, duration: 38 },
              { reverse: true, duration: 44 },
            ].map((row, rowIdx) => {
              const items = row.reverse ? [...USE_CASES].reverse() : USE_CASES;
              return (
                <div key={rowIdx} className="relative overflow-hidden">
                  <motion.div
                    animate={{ x: row.reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
                    transition={{ duration: row.duration, repeat: Infinity, ease: "linear" }}
                    className="flex gap-4 sm:gap-5 w-max"
                  >
                    {[...items, ...items].map((useCase, index) => {
                      const UseCaseIcon = useCase.icon;
                      return (
                        <div
                          key={`${rowIdx}-${useCase.key}-${index}`}
                          className="group relative shrink-0 w-[280px] sm:w-[340px]"
                        >
                          {/* Soft hover glow */}
                          <div
                            className={`absolute -inset-px bg-gradient-to-r ${useCase.gradient} rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500`}
                          />

                          <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 p-4 sm:p-5">
                            <div className="flex items-center gap-4">
                              <div
                                className={`shrink-0 bg-gradient-to-br ${useCase.gradient} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-md ${useCase.glow} ring-1 ring-white/40`}
                              >
                                <UseCaseIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm sm:text-base font-bold font-sora text-gray-900 mb-1 truncate">
                                  {t(`products.useCases.items.${useCase.key}.title`)}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-snug">
                                  {t(`products.useCases.items.${useCase.key}.description`)}
                                </p>
                              </div>
                              <ArrowRight
                                className={`shrink-0 w-4 h-4 ${useCase.accentText} opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-14"
          >
            <Link href={QUICK_FORM_URL as string}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden px-8 sm:px-10 py-4 bg-gradient-to-r from-[#25B89B] via-[#1F8F68] to-[#4884FF] text-white rounded-full font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base shadow-xl shadow-[#25B89B]/40"
              >
                <motion.span
                  aria-hidden
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/3 bg-white/25 skew-x-[-20deg]"
                />
                <span className="relative">{t('products.featured.applyButton')}</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-emerald-100 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-[#25B89B] to-[#4884FF] bg-clip-text text-transparent">
                {t('products.whyChooseUs.badge')}
              </span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-3 sm:mb-4 px-4">
              {t('products.whyChooseUs.title')}{" "}
              <span className="bg-gradient-to-r from-[#25B89B] to-[#4884FF] bg-clip-text text-transparent">
                {t('products.whyChooseUs.titleHighlight')}
              </span>
            </h2>
            <p className="text-center text-slate-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              {t('products.whyChooseUs.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {whyChooseUsConfig.map((item, index) => {
              const isGreen = index % 2 === 0;
              const iconBg = isGreen ? "bg-emerald-50" : "bg-blue-50";
              const iconColor = isGreen ? "text-[#25B89B]" : "text-[#4884FF]";
              const ringColor = isGreen ? "ring-emerald-100" : "ring-blue-100";
              return (
                <motion.div
                  key={item.translationKey}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className={`bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-xl hover:ring-2 ${ringColor} transition-all cursor-pointer`}
                >
                  <div className={`${iconBg} ring-1 ${ringColor} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 text-left">
                    {t(`products.whyChooseUs.items.${item.translationKey}.title`)}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm text-left leading-relaxed">{t(`products.whyChooseUs.items.${item.translationKey}.description`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center bg-[#f6f6f6] sm:py-10 lg:py-12 sm:px-4">
        <div
          className="w-full max-w-4xl sm:rounded-3xl p-12 md:p-20 text-center"
          style={{
            background: "linear-gradient(135deg, #25B89B 0%, #1F8F68 50%, #4884FF 100%)",
          }}
        >
          <h1
            className="text-white mb-4 text-balance"
            style={{
              fontFamily: "'Cabin', sans-serif",
              fontWeight: 600,
              // fontSize: "47px",
              fontSize: "clamp(24px, 5vw, 47px)",
              lineHeight: "130%",
              letterSpacing: "0.24px",
              textAlign: "center",
            }}
          >
            {t('products.cta.title')}
          </h1>

          <p className="md:text-xl text-white/90 mb-8 text-balance">{t('products.cta.description')}</p>

          <Link href={QUICK_FORM_URL as string}>
            <button
              className="h-12 bg-gray-900 hover:bg-gray-800 text-white px-8 rounded-lg font-semibold transition-colors w-full md:w-auto border-0 cursor-pointer"
            >
              {t('products.cta.button')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const whyChooseUsConfig = [
  {
    icon: Zap,
    translationKey: "lightningFast",
  },
  {
    icon: Shield,
    translationKey: "secure",
  },
  {
    icon: Users,
    translationKey: "trusted",
  },
  {
    icon: Award,
    translationKey: "rbiLicensed",
  },
];
