"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Shield,
  TrendingUp,
  ArrowRight,
  Calculator,
  FileText,
  Users,
  Zap,
  Phone,
  ChevronRight,
  Star,
  Award,
  Banknote,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";

export default function PersonalLoanPage() {
  const { t: tLang } = useLanguage();
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: tLang.features.list.instant.title,
      description: tLang.features.list.instant.description,
    },
    {
      icon: Shield,
      title: tLang.features.list.secure.title,
      description: tLang.features.list.secure.description,
    },
    {
      icon: Banknote,
      title: t('products.pages.personalLoan.features.flexibleAmounts.title'),
      description: t('products.pages.personalLoan.features.flexibleAmounts.description'),
    },
    {
      icon: Clock,
      title: tLang.features.list.flexible.title,
      description: `Choose repayment period from ${tLang.products.types.personal.tenure}`,
    },
    {
      icon: Users,
      title: t('products.pages.personalLoan.features.noGuarantor.title'),
      description: t('products.pages.personalLoan.features.noGuarantor.description'),
    },
    {
      icon: Award,
      title: t('products.pages.personalLoan.features.bestRates.title'),
      description: t('products.pages.personalLoan.features.bestRates.description'),
    },
  ];

  const eligibility = [
    tLang.eligibility.age,
    tLang.eligibility.income,
    tLang.eligibility.credit,
    tLang.eligibility.employment,
    t('products.pages.personalLoan.eligibility.requirements.selfEmployed'),
    t('products.pages.personalLoan.eligibility.requirements.bankAccount'),
  ];

  const documents = [
    t('products.pages.personalLoan.eligibility.documents.pan'),
    t('products.pages.personalLoan.eligibility.documents.aadhaar'),
    t('products.pages.personalLoan.eligibility.documents.salarySlips'),
    t('products.pages.personalLoan.eligibility.documents.bankStatement'),
    t('products.pages.personalLoan.eligibility.documents.itr'),
    t('products.pages.personalLoan.eligibility.documents.businessProof'),
  ];

  const steps = [
    {
      title: tLang.process.steps.apply.title,
      description: tLang.process.steps.apply.description,
    },
    {
      title: tLang.process.steps.verify.title,
      description: tLang.process.steps.verify.description,
    },
    {
      title: tLang.process.steps.disbursal.title,
      description: tLang.process.steps.disbursal.description,
    },
  ];

  const testimonials: any[] = [
    // {
    //   name: "",
    //   location: "",
    //   comment: ""
    // },
    // {
    //   name: "Priya Patel",
    //   location: "Delhi",
    //   comment: "Best interest rates in the market. Customer service is excellent and always helpful."
    // },
    // {
    //   name: "Amit Kumar",
    //   location: "Bangalore",
    //   comment: "Needed urgent funds for medical emergency. Quikkred came through when I needed them most."
    // }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <SalaryAdvance
          title={t('products.pages.personalLoan.hero.title')}
          highlightWord={t('products.pages.personalLoan.hero.highlightWord')}
          title1={t('products.pages.personalLoan.hero.title1')}
          subtitle={t('products.pages.personalLoan.hero.subtitle')}
          buttonPrimaryText={t('products.pages.personalLoan.hero.buttonPrimary')}
          buttonSecondaryText={t('products.pages.personalLoan.hero.buttonSecondary')}
          quickAccessAmount={t('products.pages.personalLoan.hero.quickAccessAmount')}
          timeText={t('products.pages.personalLoan.hero.timeText')}
          imageSrc="/Peronalloan_hero_image.jpg"
          features={[
            t('products.pages.personalLoan.hero.features.loansUpTo'),
            t('products.pages.personalLoan.hero.features.instant'),
            t('products.pages.personalLoan.hero.features.disbursal'),
          ]}
          primaryColor="emerald"
        />
      </section>

      {/* Features Grid */}
      <section className="bg-[#f6f6f6] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-gray-900">
              {t('products.pages.personalLoan.features.title')}
            </h2>
            <p className="text-xl text-gray-600">{tLang.features.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <LoanCalculator
              title={t('products.pages.personalLoan.calculator.title')}
              subtitle={t('products.pages.personalLoan.calculator.subtitle')}
            />
          </div>
        </div>
      </section>

      <FinancialFeatureSection
  image="/Peronalloan_sub_image.jpg"
  imageAlt="Happy couple using laptop for online loan application"
  badge={{
    percentage: t('products.pages.personalLoan.financialFeature.badge.percentage'),
    label: t('products.pages.personalLoan.financialFeature.badge.label'),
  }}
  heading={t('products.pages.personalLoan.financialFeature.heading')}
  description={t('products.pages.personalLoan.financialFeature.description')}
  features={[
    {
      icon: <DocumentIcon />,
      title: t('products.pages.personalLoan.financialFeature.features.flexible.title'),
      description: t('products.pages.personalLoan.financialFeature.features.flexible.description'),
    },
    {
      icon: <DocumentIcon />,
      title: t('products.pages.personalLoan.financialFeature.features.secure.title'),
      description: t('products.pages.personalLoan.financialFeature.features.secure.description'),
    },
    {
      icon: <DocumentIcon />,
      title: t('products.pages.personalLoan.financialFeature.features.noHidden.title'),
      description: t('products.pages.personalLoan.financialFeature.features.noHidden.description'),
    },
  ]}
/>


      {/* Eligibility Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-gray-900">
                {tLang.eligibility.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t('products.pages.personalLoan.eligibility.subtitle')}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  {tLang.eligibility.title}
                </h3>
                <ul className="space-y-4">
                  {eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
                  <FileText className="w-6 h-6 text-[#4A66FF]" />
                  {tLang.eligibility.documents}
                </h3>
                <ul className="space-y-4">
                  {documents.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[#4A66FF] mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-gray-900">
              {tLang.process.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t('products.pages.personalLoan.process.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#4A66FF] to-[#25B181] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-gray-900">
              {tLang.testimonials?.title}
            </h2>
            <p className="text-xl text-gray-600">{tLang.testimonials?.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials?.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#4A66FF] to-[#25B181] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4A66FF] to-[#25B181] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-sora">
              {t('products.pages.personalLoan.cta.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90">
              {t('products.pages.personalLoan.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/quick">
                <button className="px-8 py-4 bg-white text-[#4A66FF] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  {tLang.common.apply}
                </button>
              </Link>
              <a href={`tel:${tLang.footer.contact.phone}`}>
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                  <Phone className="w-5 h-5" />
                  {t('products.pages.personalLoan.cta.callButton')}
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

         <div className="flex items-center justify-center min-h-screen bg-[#f6f6f6] py-16 md:py-24 px-4">
      <div
        className="w-full max-w-4xl rounded-3xl p-12 md:p-20 text-center"
        style={{
          background: "linear-gradient(180deg, #6D9DFF 0%, #415E99 100%)",
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

          <button
            className="h-12 bg-gray-900 hover:bg-gray-800 text-white px-8 rounded-lg font-semibold transition-colors w-full md:w-auto border-0 cursor-pointer"
          >
            {t('products.cta.button')}
          </button>
      </div>
    </div>
    </div>
  );
}
