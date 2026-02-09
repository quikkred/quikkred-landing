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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Products from "@/components/Product/Products";
import { API_BASE_URL } from '@/lib/config';
import { useProducts } from '@/store/hooks/useProducts';

// Icon mapping based on product name
const getProductIcon = (productName: string) => {
  const name = productName.toLowerCase();
  if (name.includes("lightning")) return Zap;
  if (name.includes("instant")) return Banknote;
  if (name.includes("weekend")) return PartyPopper;
  if (name.includes("emergency")) return AlertCircle;
  if (name.includes("festival")) return Heart;
  if (name.includes("top-up") || name.includes("turbo")) return TrendingUp;
  if (name.includes("home")) return Building;
  return CreditCard;
};

// Translation key mapping based on product name
const getTranslationKey = (productName: string) => {
  const name = productName.toLowerCase();
  if (name.includes("lightning")) return "lightningPayday";
  if (name.includes("instant")) return "instantCash";
  if (name.includes("weekend")) return "weekendBooster";
  if (name.includes("emergency")) return "emergency24x7";
  if (name.includes("festival")) return "festivalFire";
  if (name.includes("top-up") || name.includes("turbo")) return "topupTurbo";
  return "default";
};

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
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { t } = useTranslation();

  // Redux state for products
  const {
    products: reduxProducts,
    loading,
    error,
    fetchProducts: reduxFetchProducts,
  } = useProducts();

  const [apiProducts, setApiProducts] = useState<LoanProduct[]>([]);

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

  const loanProducts = apiProducts.map((product) => {
    const translationKey = getTranslationKey(product.productName);
    const Icon = getProductIcon(product.productName);

    return {
      id: product._id,
      translationKey,
      icon: Icon,
      amount: `₹${formatAmount(product.minAmount)} - ₹${formatAmount(product.maxAmount)}`,
      tenure: `${product.minTenure} - ${product.maxTenure} days`,
      rate: `${product.dailyInterestRate}% per day`,
      processingFee: `${product.processingFee}% + GST`,
      color: "from-[#25B181] to-[#1F8F68]",
      popular: product.productName.toLowerCase().includes("lightning"),
      title: t(`products.loanProducts.${translationKey}.title`, { defaultValue: product.productName }),
      tagline: t(`products.loanProducts.${translationKey}.tagline`, { defaultValue: product.description }),
      description: t(`products.loanProducts.${translationKey}.description`, { defaultValue: product.description }),
      features: t(`products.loanProducts.${translationKey}.features`, { returnObjects: true, defaultValue: [] }) as string[],
      eligibility: t(`products.loanProducts.${translationKey}.eligibility`, { returnObjects: true, defaultValue: [] }) as string[],
      // Store raw API data for featured section
      rawData: product,
    };
  });

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
      <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-[#E6F7F2] to-[#D1F0E6]">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#25B181]/10 rounded-full text-[#25B181] font-semibold mb-3 sm:mb-4 border border-[#25B181]/20 text-xs sm:text-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('products.featured.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3 sm:mb-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] bg-clip-text text-transparent px-4">
              {t('products.featured.title')}
            </h2>
            <p className="text-base text-gray-700 max-w-3xl mx-auto px-4">
              {t('products.featured.tagline')}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#25B181]" />
            </div>
          ) : loanProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto border border-gray-100"
            >
              {(() => {
                const featuredProduct = loanProducts.find(p => p.popular) || loanProducts[0];
                const FeaturedIcon = featuredProduct.icon;
                return (
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-xl flex items-center justify-center shadow-lg">
                          <FeaturedIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="w-auto">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {featuredProduct.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-700">
                            {featuredProduct.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        {Array.isArray(featuredProduct.features) && featuredProduct.features.length > 0 ? (
                          featuredProduct.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3 text-sm sm:text-base">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181] mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))
                        ) : (
                          (t('products.featured.features', { returnObjects: true }) as string[]).map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25B181] mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <Link href="/apply/quick">
                        <button className="px-4 sm:px-8 py-3 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto">
                          {t('products.featured.applyButton')}
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>

                    <div className="bg-gradient-to-br from-[#E6F7F2] to-[#D1F0E6] rounded-2xl p-4 sm:p-6 border border-[#25B181]/20">
                      <h4 className="font-semibold mb-4 text-lg">{t('products.featured.quickStats')}</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between pb-3 border-b border-[#25B181]/20 text-sm sm:text-base">
                          <span className="text-gray-700">{t('products.featured.amountRange')}</span>{" "}
                          <span className="font-semibold">{featuredProduct.amount}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-[#25B181]/20 text-sm sm:text-base">
                          <span className="text-gray-700">{t('products.featured.interestRate')}</span>{" "}
                          <span className="font-semibold text-[#25B181]">
                            {featuredProduct.rate}
                          </span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-[#25B181]/20 text-sm sm:text-base">
                          <span className="text-gray-700">{t('products.featured.tenure')}</span>{" "}
                          <span className="font-semibold">{featuredProduct.tenure}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-[#25B181]/20 text-sm sm:text-base">
                          <span className="text-gray-700">{t('products.featured.processingFee')}</span>{" "}
                          <span className="font-semibold">{featuredProduct.processingFee}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-700">{t('products.featured.approvalTime')}</span>{" "}
                          <span className="font-semibold text-[#25B181]">
                            {t('products.featured.approvalTimeValue')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="container mx-auto sm:px-6 lg:px-8">
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

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#25B181]" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
              {loanProducts.map((product, index) => {
                const ProductIcon = product.icon;
                return (
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
                      <ProductIcon className="w-12 h-12 mb-4" />
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
                          {Array.isArray(product.features) && product.features.length > 0 ? (
                            product.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{feature}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{product.description}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex gap-3 flex-col sm:flex-row mt-auto">
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
                          className={`w-5 h-5 transition-transform ${selectedProduct === product.id ? "rotate-180" : ""
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
                            {Array.isArray(product.eligibility) && product.eligibility.length > 0 ? (
                              product.eligibility.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">{item}</span>
                                </li>
                              ))
                            ) : (
                              <>
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">Age: 21-60 years</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">Min. monthly income: ₹15,000</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-[#25B181] mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">Valid ID & bank account</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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

      <div className="flex items-center justify-center bg-[#f6f6f6] sm:py-10 lg:py-12 sm:px-4">
        <div
          className="w-full max-w-4xl sm:rounded-3xl p-12 md:p-20 text-center"
          style={{
            background: "linear-gradient(180deg, #25B181 0%, #1F8F68 100%)",
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
