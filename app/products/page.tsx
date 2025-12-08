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
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Products from "@/components/Product/Products";

const loanProductsConfig = [
  {
    id: "lightning-payday",
    translationKey: "lightningPayday",
    icon: Zap,
    amount: "₹10,000 - ₹75,000",
    tenure: "7 - 30 days",
    rate: "1% per day",
    processingFee: "10% + GST",
    color: "from-[#25B181] to-[#1F8F68]",
    popular: true,
  },
  {
    id: "instant-cash",
    translationKey: "instantCash",
    icon: Banknote,
    amount: "₹15,000 - ₹1,00,000",
    tenure: "15 - 45 days",
    rate: "0.99% per day",
    processingFee: "9% + GST",
    color: "from-[#25B181] to-[#1F8F68]",
  },
  {
    id: "weekend-booster",
    translationKey: "weekendBooster",
    icon: PartyPopper,
    amount: "₹20,000 - ₹1,00,000",
    tenure: "10 - 25 days",
    rate: "1.1% per day",
    processingFee: "8% + GST",
    color: "from-[#25B181] to-[#1F8F68]",
  },
  {
    id: "emergency-24x7",
    translationKey: "emergency24x7",
    icon: AlertCircle,
    amount: "₹10,000 - ₹50,000",
    tenure: "7 - 15 days",
    rate: "1.5% per day",
    processingFee: "12% + GST",
    color: "from-[#25B181] to-[#1F8F68]",
  },
  {
    id: "festival-fire",
    translationKey: "festivalFire",
    icon: Heart,
    amount: "₹25,000 - ₹1,00,000",
    tenure: "30 - 62 days",
    rate: "0.95% per day",
    processingFee: "8% + GST",
    color: "from-[#25B181] to-[#1F8F68]",
  },
  {
    id: "topup-turbo",
    translationKey: "topupTurbo",
    icon: TrendingUp,
    amount: "+30-70% of current loan",
    tenure: "Same as running",
    rate: "Same rate",
    processingFee: "+2% extra PF",
    color: "from-[#25B181] to-[#1F8F68]",
  },
];

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { t } = useTranslation();

  const loanProducts = loanProductsConfig.map((product) => ({
    ...product,
    title: t(`products.loanProducts.${product.translationKey}.title`),
    tagline: t(`products.loanProducts.${product.translationKey}.tagline`),
    description: t(`products.loanProducts.${product.translationKey}.description`),
    features: t(`products.loanProducts.${product.translationKey}.features`, { returnObjects: true }) as string[],
    eligibility: t(`products.loanProducts.${product.translationKey}.eligibility`, { returnObjects: true }) as string[],
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="">
        {/* <div className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-white">All Loan Products</span>
            </div>
          </div>

       
        </div> */}

        <Products
          title={t('products.hero.title')}
          highlightWord={t('products.hero.highlightWord')}
          subtitle={t('products.hero.subtitle')}
          buttonPrimaryText={t('products.hero.buttonPrimary')}
          buttonSecondaryText={t('products.hero.buttonSecondary')}
          imageSrc="/product-main.jpg"
          primaryColor="emerald"
        />
      </section>

      {/* Featured Product - Lightning Payday */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#E6F7F2] to-[#D1F0E6]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#25B181]/10 rounded-full text-[#25B181] font-semibold mb-3 sm:mb-4 border border-[#25B181]/20 text-xs sm:text-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('products.featured.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3 sm:mb-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] bg-clip-text text-transparent px-4">
              {t('products.featured.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-4">
              {t('products.featured.tagline')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12 max-w-5xl mx-auto border border-gray-100"
          >
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t('products.featured.productTitle')}
                    </h3>
                    <p className="text-gray-700">
                      {t('products.featured.productDescription')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {(t('products.featured.features', { returnObjects: true }) as string[]).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#25B181] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/apply/quick">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                    {t('products.featured.applyButton')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              <div className="bg-gradient-to-br from-[#E6F7F2] to-[#D1F0E6] rounded-2xl p-6 border border-[#25B181]/20">
                <h4 className="font-semibold mb-4 text-lg">{t('products.featured.quickStats')}</h4>
                <div className="space-y-4">
                  <div className="flex justify-between pb-3 border-b border-[#25B181]/20">
                    <span className="text-gray-700">{t('products.featured.amountRange')}</span>
                    <span className="font-semibold">₹10,000 - ₹75,000</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#25B181]/20">
                    <span className="text-gray-700">{t('products.featured.interestRate')}</span>
                    <span className="font-semibold text-[#25B181]">
                      1% per day
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#25B181]/20">
                    <span className="text-gray-700">{t('products.featured.tenure')}</span>
                    <span className="font-semibold">7 - 30 days</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#25B181]/20">
                    <span className="text-gray-700">{t('products.featured.processingFee')}</span>
                    <span className="font-semibold">10% + GST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">{t('products.featured.approvalTime')}</span>
                    <span className="font-semibold text-[#25B181]">
                      {t('products.featured.approvalTimeValue')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3 sm:mb-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] bg-clip-text text-transparent px-4">
              {t('products.allProducts.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-4">
              {t('products.allProducts.subtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {loanProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Product Header */}
                <div
                  className={`bg-gradient-to-r ${product.color} p-6 text-white relative`}
                >
                  {product.popular && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                      🔥 {t('products.allProducts.popular')}
                    </div>
                  )}
                  <product.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-1">{product.title}</h3>
                  <p className="text-sm opacity-80 italic mb-2">"{product.tagline}"</p>
                  <p className="opacity-90 text-sm">{product.description}</p>
                </div>

                {/* Product Details */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{t('products.allProducts.amount')}</p>
                      <p className="font-semibold text-sm text-gray-800">{product.amount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{t('products.allProducts.tenure')}</p>
                      <p className="font-semibold text-sm text-gray-800">{product.tenure}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{t('products.allProducts.interestRate')}</p>
                      <p className="font-semibold text-sm text-[#25B181]">
                        {product.rate}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{t('products.allProducts.processingFee')}</p>
                      <p className="font-semibold text-sm text-gray-800">
                        {product.processingFee}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 flex-1">
                    <h4 className="font-semibold mb-3">{t('products.allProducts.keyFeatures')}</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200:bg-gray-600 transition-colors">
                        {t('products.allProducts.learnMore')}
                      </button>
                    </Link>
                    <Link href="/apply/quick" className="flex-1">
                      <button
                        className={`w-full px-4 py-2 bg-gradient-to-r ${product.color} text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                      >
                        {t('products.allProducts.applyNow')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Expandable Eligibility */}
                <div className="border-t border-gray-200">
                  <button
                    onClick={() =>
                      setSelectedProduct(
                        selectedProduct === product.id ? null : product.id
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium">{t('products.allProducts.eligibilityCriteria')}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        selectedProduct === product.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {selectedProduct === product.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      className="px-6 pb-6"
                    >
                      <ul className="space-y-2">
                        {product.eligibility.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <span className="inline-block px-4 py-2 bg-[#14b8a642] text-teal-500 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              {t('products.whyChooseUs.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-3 sm:mb-4 px-4">
              {t('products.whyChooseUs.title')} <span className="text-teal-500">{t('products.whyChooseUs.titleHighlight')}</span>
            </h2>
            <p className="text-center text-slate-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              {t('products.whyChooseUs.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {whyChooseUsConfig.map((item, index) => (
              <motion.div
                key={item.translationKey}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="bg-teal-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 text-left">
                  {t(`products.whyChooseUs.items.${item.translationKey}.title`)}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm text-left leading-relaxed">{t(`products.whyChooseUs.items.${item.translationKey}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center min-h-screen bg-[#f6f6f6] py-16 md:py-24 px-4">
      <div
        className="w-full max-w-4xl rounded-3xl p-12 md:p-20 text-center"
        style={{
          background: "linear-gradient(180deg, #25B181 0%, #1F8F68 100%)",
        }}
      >
        <h1
          className="text-white mb-4 text-balance"
          style={{
            fontFamily: "'Cabin', sans-serif",
            fontWeight: 600,
            fontSize: "47px",
            lineHeight: "130%",
            letterSpacing: "0.24px",
            textAlign: "center",
          }}
        >
         {t('products.cta.title')}
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-8 text-balance">{t('products.cta.description')}</p>

          <Link href="/apply/quick">
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
