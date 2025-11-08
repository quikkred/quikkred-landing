"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Wallet,
  CheckCircle,
  Clock,
  Shield,
  TrendingUp,
  ArrowRight,
  Calculator,
  FileText,
  Building,
  Zap,
  Phone,
  ChevronRight,
  Star,
  CreditCard,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { FinancialFeatureSection } from "@/components/financial-feature-section";
import { DocumentIcon } from "@/components/feature-icon";
import StepsSection from "@/components/homepage/steps-section";
import { FinancialCTA } from "@/components/homepage/financial-cta";

export default function SalaryAdvancePage() {
  const { t: tLang } = useLanguage();
  const { t } = useTranslation();
  const [salary, setSalary] = useState(30000);
  const [loanAmount, setLoanAmount] = useState(15000);
  const maxLoan = Math.min(salary * 2, 100000);
  const processingFee = loanAmount * 0.02;
  const interest = loanAmount * 0.015;
  const totalPayable = loanAmount + interest + processingFee;

  const benefits = [
    {
      icon: Zap,
      title: t('products.pages.salaryAdvance.benefits.list.instantApproval.title'),
      description: t('products.pages.salaryAdvance.benefits.list.instantApproval.description'),
    },
    {
      icon: Calendar,
      title: t('products.pages.salaryAdvance.benefits.list.flexibleRepayment.title'),
      description: t('products.pages.salaryAdvance.benefits.list.flexibleRepayment.description'),
    },
    {
      icon: Shield,
      title: t('products.pages.salaryAdvance.benefits.list.secure.title'),
      description: t('products.pages.salaryAdvance.benefits.list.secure.description'),
    },
    {
      icon: CreditCard,
      title: t('products.pages.salaryAdvance.benefits.list.noHiddenCharges.title'),
      description: t('products.pages.salaryAdvance.benefits.list.noHiddenCharges.description'),
    },
    {
      icon: Building,
      title: t('products.pages.salaryAdvance.benefits.list.companyTieups.title'),
      description: t('products.pages.salaryAdvance.benefits.list.companyTieups.description'),
    },
    {
      icon: Wallet,
      title: t('products.pages.salaryAdvance.benefits.list.repeatAdvances.title'),
      description: t('products.pages.salaryAdvance.benefits.list.repeatAdvances.description'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <SalaryAdvance
          title={t('products.pages.salaryAdvance.hero.title')}
          highlightWord={t('products.pages.salaryAdvance.hero.highlightWord')}
          title1={t('products.pages.salaryAdvance.hero.title1')}
          subtitle={t('products.pages.salaryAdvance.hero.subtitle')}
          buttonPrimaryText={t('products.pages.salaryAdvance.hero.buttonPrimary')}
          buttonSecondaryText={t('products.pages.salaryAdvance.hero.buttonSecondary')}
          quickAccessAmount={t('products.pages.salaryAdvance.hero.quickAccessAmount')}
          timeText={t('products.pages.salaryAdvance.hero.timeText')}
          imageSrc="/Salaryadvance_hero_image.jpg"
          features={[
            t('products.pages.salaryAdvance.hero.features.noCredit'),
            t('products.pages.salaryAdvance.hero.features.instant'),
            t('products.pages.salaryAdvance.hero.features.transparent')
          ]}
          primaryColor="emerald"
        />
      </section>

      {/* Benefits for Salaried */}
      <section className="bg-[#f6f6f6] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              {t('products.pages.salaryAdvance.benefits.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('products.pages.salaryAdvance.benefits.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Salary Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <LoanCalculator
              title={t('products.pages.salaryAdvance.calculator.title')}
              subtitle={t('products.pages.salaryAdvance.calculator.subtitle')}
            />
          </div>
        </div>
      </section>

       <FinancialFeatureSection
        image="/Salaryadvance_sub_image.jpg"
        imageAlt="Man in green sweater looking at phone"
        badge={{
          percentage: t('products.pages.salaryAdvance.financialFeature.badge.percentage'),
          label: t('products.pages.salaryAdvance.financialFeature.badge.label'),
        }}
        heading={t('products.pages.salaryAdvance.financialFeature.heading')}
        description={t('products.pages.salaryAdvance.financialFeature.description')}
        features={[
          {
            icon: <DocumentIcon />,
            title: t('products.pages.salaryAdvance.financialFeature.features.applyOnline.title'),
            description: t('products.pages.salaryAdvance.financialFeature.features.applyOnline.description'),
          },
          {
            icon: <DocumentIcon />,
            title: t('products.pages.salaryAdvance.financialFeature.features.fullySecure.title'),
            description: t('products.pages.salaryAdvance.financialFeature.features.fullySecure.description'),
          },
          {
            icon: <DocumentIcon />,
            title: t('products.pages.salaryAdvance.financialFeature.features.clearSimple.title'),
            description: t('products.pages.salaryAdvance.financialFeature.features.clearSimple.description'),
          },
        ]}
      />

      {/* Eligibility */}
      <section className="py-20 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
                {t('products.pages.salaryAdvance.eligibility.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('products.pages.salaryAdvance.eligibility.subtitle')}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#25B181]">
                  {t('products.pages.salaryAdvance.eligibility.basicRequirements.title')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.basicRequirements.age')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.basicRequirements.minSalary')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.basicRequirements.citizenship')}</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#25B181]">
                  {t('products.pages.salaryAdvance.eligibility.employment.title')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.employment.permanent')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.employment.tenure')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.employment.bankTransfer')}</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#25B181]">
                  {t('products.pages.salaryAdvance.eligibility.documents.title')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-[#4A66FF] mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.documents.pan')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-[#4A66FF] mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.documents.aadhaar')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-[#4A66FF] mt-0.5" />
                    <span>{t('products.pages.salaryAdvance.eligibility.documents.salarySlips')}</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

     <StepsSection/> 


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

