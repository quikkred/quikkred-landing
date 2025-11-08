"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
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
  Gift,
  Calendar,
  PartyPopper,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { FinancialFeatureSection } from "@/components/financial-feature-section";
import { DocumentIcon } from "@/components/feature-icon";

export default function FestivalAdvancePage() {
  const { t: tLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section>
        <section className="py-12 sm:py-16 lg:py-20">
          <SalaryAdvance
            title={t('products.pages.festival.hero.title')}
            highlightWord={t('products.pages.festival.hero.highlightWord')}
            title1={t('products.pages.festival.hero.title1')}
            subtitle={t('products.pages.festival.hero.subtitle')}
            buttonPrimaryText={t('products.pages.festival.hero.buttonPrimary')}
            buttonSecondaryText={t('products.pages.festival.hero.buttonSecondary')}
            quickAccessAmount={t('products.pages.festival.hero.quickAccessAmount')}
            timeText={t('products.pages.festival.hero.timeText')}
            imageSrc="/FestivalAdvance_hero_image.jpg"
            features={[
              t('products.pages.festival.hero.features.rates'),
              t('products.pages.festival.hero.features.quick'),
              t('products.pages.festival.hero.features.festivals'),
            ]}
            primaryColor="emerald"
          />
        </section>
      </section>

      {/* Festival Types */}
      <section className="py-20 bg-[#f6f6f6]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Festivals We Support
            </h2>
            <p className="text-xl text-gray-600">
              Get advance for all major festivals across religions and cultures
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {festivals.map((festival, index) => (
              <motion.div
                key={festival.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-3">{festival.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{festival.name}</h3>
                <p className="text-sm text-gray-600">{festival.period}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Features Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Why Choose Festival Advance?
            </h2>
            <p className="text-xl text-gray-600">
              Make every celebration memorable without financial worries
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {festivalFeatures.map((feature, index) => (
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
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <LoanCalculator
              title="Festival Loan Calculator"
              subtitle="Calculate your daily EMI for festival celebrations"
            />
          </div>
        </div>
      </section>

<FinancialFeatureSection
  image="/FestivalAdvance_sub_image.jpg"
  imageAlt="Woman smiling while using her phone"
  badge={{
    percentage: "100%",
    label: "Secure",
  }}
  heading="A Simpler Way to Celebrate."
  description="We’ve removed the hassle so you can focus on the joy. Get your funds with just a few clicks."
  features={[
    {
      icon: <DocumentIcon />,
      title: "Instant Approval",
      description: "Get your advance approved in minutes. No waiting, no long forms.",
    },
    {
      icon: <DocumentIcon />,
      title: "Flexible Repayment",
      description: "Choose a simple repayment plan that fits your salary cycle.",
    },
    {
      icon: <DocumentIcon />,
      title: "100% Digital",
      description: "From application to disbursal, the entire process is completely online.",
    },
  ]}
/>



      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your festival advance in 3 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {festivalSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF9C70] to-[#FFB596] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Festival Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              How our customers celebrated with Quikkred
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {festivalTestimonials.map((testimonial, index) => (
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
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FF9C70] to-[#FFB596] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.festival}
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
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-sora">
              Ready to Celebrate?
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90">
              Get your festival advance now and make this celebration
              unforgettable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/quick">
                <button className="px-8 py-4 bg-white text-[#FF9C70] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Apply for Festival Advance
                </button>
              </Link>
              <a href="tel:+918888881111">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                  <Phone className="w-5 h-5" />
                  Call Us Now
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

const festivalFeatures = [
  {
    icon: Zap,
    title: "Instant Approval",
    description:
      "Get approved in 30 seconds and receive money before the festival rush",
  },
  {
    icon: Gift,
    title: "Special Festival Rates",
    description: "Enjoy reduced interest rates during festival seasons",
  },
  {
    icon: Calendar,
    title: "Flexible Repayment",
    description: "Start repayment after festivals with comfortable EMI options",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Bank-grade security for all your financial transactions",
  },
  {
    icon: Sparkles,
    title: "No Hidden Charges",
    description: "Transparent pricing with no surprise fees or charges",
  },
  {
    icon: Heart,
    title: "Quick Disbursal",
    description: "Money transferred within 10 minutes of approval",
  },
];

const festivals = [
  { name: "Diwali", icon: "🪔", period: "Oct-Nov" },
  { name: "Holi", icon: "🎨", period: "Mar-Apr" },
  { name: "Eid", icon: "🌙", period: "Varies" },
  { name: "Christmas", icon: "🎄", period: "December" },
  { name: "Dussehra", icon: "🏹", period: "Sep-Oct" },
  { name: "Ganesh Chaturthi", icon: "🐘", period: "Aug-Sep" },
  { name: "Navratri", icon: "💃", period: "Sep-Oct" },
  { name: "Karva Chauth", icon: "🌙", period: "October" },
];

const festivalSteps = [
  {
    title: "Apply for Festival Advance",
    description:
      "Fill our quick application form mentioning the festival and amount needed. Takes less than 3 minutes.",
  },
  {
    title: "Instant Approval",
    description:
      "Get approved instantly with our AI-powered assessment. Special festival rates applied automatically.",
  },
  {
    title: "Celebrate & Repay",
    description:
      "Receive money immediately and enjoy your festival. Start repayment after the celebration period.",
  },
];

const festivalTestimonials: any[] = [];
