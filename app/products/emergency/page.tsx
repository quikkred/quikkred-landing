"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  Clock,
  Shield,
  Phone,
  Heart,
  Zap,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Star,
  Ambulance,
  Hospital,
  Stethoscope,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";

export default function EmergencyFundPage() {
  const { t: tLang } = useLanguage();
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState(50000);

  const emergencyTypes = [
    {
      icon: Hospital,
      title: t('products.pages.emergency.emergencyTypes.medical.title'),
      description: t('products.pages.emergency.emergencyTypes.medical.description'),
      amount: t('products.pages.emergency.emergencyTypes.medical.amount'),
    },
    {
      icon: Activity,
      title: t('products.pages.emergency.emergencyTypes.accident.title'),
      description: t('products.pages.emergency.emergencyTypes.accident.description'),
      amount: t('products.pages.emergency.emergencyTypes.accident.amount'),
    },
    {
      icon: Heart,
      title: t('products.pages.emergency.emergencyTypes.family.title'),
      description: t('products.pages.emergency.emergencyTypes.family.description'),
      amount: t('products.pages.emergency.emergencyTypes.family.amount'),
    },
    {
      icon: Stethoscope,
      title: t('products.pages.emergency.emergencyTypes.unexpected.title'),
      description: t('products.pages.emergency.emergencyTypes.unexpected.description'),
      amount: t('products.pages.emergency.emergencyTypes.unexpected.amount'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section>
        <section className="py-12 sm:py-16 lg:py-20">
          <SalaryAdvance
            title={t('products.pages.emergency.hero.title')}
            highlightWord={t('products.pages.emergency.hero.highlightWord')}
            title1={t('products.pages.emergency.hero.title1')}
            subtitle={t('products.pages.emergency.hero.subtitle')}
            buttonPrimaryText={t('products.pages.emergency.hero.buttonPrimary')}
            buttonSecondaryText={t('products.pages.emergency.hero.buttonSecondary')}
            quickAccessAmount={t('products.pages.emergency.hero.quickAccessAmount')}
            timeText={t('products.pages.emergency.hero.timeText')}
            imageSrc="/EmergencyFund_hero_image.jpg"
            features={[
              t('products.pages.emergency.hero.features.approval'),
              t('products.pages.emergency.hero.features.care'),
              t('products.pages.emergency.hero.features.confidential'),
            ]}
            primaryColor="emerald"
          />
        </section>
      </section>

      {/* Emergency Types */}
      <section className="bg-[#f6f6f6] py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              {t('products.pages.emergency.emergencyTypes.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('products.pages.emergency.emergencyTypes.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {emergencyTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <type.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <p className="text-sm font-semibold text-[#25B181]">
                  Up to {type.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Calculator */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <LoanCalculator
              title={t('products.pages.emergency.calculator.title')}
              subtitle={t('products.pages.emergency.calculator.subtitle')}
            />
          </div>
        </div>
      </section>

<FinancialFeatureSection
  image="/EmergencyFund_sub_image.jpg"
  imageAlt="Smiling woman using phone for emergency fund application"
  badge={{
    percentage: t('products.pages.emergency.financialFeature.badge.percentage'),
    label: t('products.pages.emergency.financialFeature.badge.label'),
  }}
  heading={t('products.pages.emergency.financialFeature.heading')}
  description={t('products.pages.emergency.financialFeature.description')}
  features={[
    {
      icon: <DocumentIcon />,
      title: t('products.pages.emergency.financialFeature.features.priority.title'),
      description: t('products.pages.emergency.financialFeature.features.priority.description'),
    },
    {
      icon: <DocumentIcon />,
      title: t('products.pages.emergency.financialFeature.features.secure.title'),
      description: t('products.pages.emergency.financialFeature.features.secure.description'),
    },
    {
      icon: <DocumentIcon />,
      title: t('products.pages.emergency.financialFeature.features.noHidden.title'),
      description: t('products.pages.emergency.financialFeature.features.noHidden.description'),
    },
  ]}
/>



      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              {t('products.pages.emergency.process.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('products.pages.emergency.process.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start bg-gray-50 rounded-2xl p-6"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-[#FF9C70] to-[#FFB596] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                    {step.time && (
                      <p className="text-sm text-[#FF9C70] font-semibold mt-2">
                        ⏱️ {step.time}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              {t('products.pages.emergency.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600">
              How we've helped people in their time of need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF9C70] to-[#FFB596] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.emergency}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF9C70] to-[#FFB596] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <AlertCircle className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-sora">
              Don't Let Money Be a Worry During Emergencies
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90">
              We're here 24/7 to provide instant financial support when you need
              it most
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/quick">
                <button className="px-8 py-4 bg-white text-[#FF9C70] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Apply for Emergency Fund
                </button>
              </Link>
              <a href="tel:+918888881111">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 justify-center">
                  <Phone className="w-5 h-5" />
                  24/7 Emergency Helpline
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

const emergencyTypes = [
  {
    icon: Hospital,
    title: "Medical Emergency",
    description: "Hospital bills, surgery, treatments",
    amount: "₹2,00,000",
  },
  {
    icon: Heart,
    title: "Family Crisis",
    description: "Urgent family support needs",
    amount: "₹1,00,000",
  },
  {
    icon: Activity,
    title: "Accident Care",
    description: "Immediate accident expenses",
    amount: "₹1,50,000",
  },
  {
    icon: Stethoscope,
    title: "Critical Care",
    description: "ICU and critical treatments",
    amount: "₹2,00,000",
  },
];

const processSteps = [
  {
    title: "Submit Emergency Request",
    description:
      "Fill a simple form with minimal details. Our emergency team prioritizes your application immediately.",
    time: "2 minutes",
  },
  {
    title: "Quick Verification",
    description:
      "Basic KYC check and emergency validation. We understand urgency and process with compassion.",
    time: "30 minutes",
  },
  {
    title: "Instant Fund Transfer",
    description:
      "Once approved, funds are transferred directly to your bank or hospital account.",
    time: "Within 24 hours",
  },
];

const testimonials: any[] = [];
