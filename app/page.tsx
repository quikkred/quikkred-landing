"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Zap, Shield, Clock, Smartphone, Brain, Award, TrendingUp,
  Star, Users, CheckCircle, Play, ChevronDown, Globe, Briefcase, Heart,
  PiggyBank, FileCheck, IndianRupee, Sparkles, Trophy,
  BadgeCheck, Rocket, Target, Phone, Mail, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import Hero from "@/components/homepage/hero";
import StepsSection from "@/components/homepage/steps-section";
import FeaturesSection from "@/components/homepage/features-section";
import LoansGrid from "@/components/homepage/loans-grid";
import LoanCalculatorAll from "@/components/homepage/loan-calculator";
import Testimonials from "@/components/homepage/Testimonials";
import { FinancialCTA } from "@/components/homepage/financial-cta";
import SalaryAdvance from "@/components/SalaryAdvance";


export default function Home() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const containerRef = useRef(null);

  // Simplify scroll animations to reduce initial load
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Reduce complexity of transforms
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  // Data arrays using translations
  const trustBadges = [
    { icon: Users, value: t.homepage.trustBadges.customers.value, title: t.homepage.trustBadges.customers.title },
    { icon: IndianRupee, value: t.homepage.trustBadges.disbursed.value, title: t.homepage.trustBadges.disbursed.title },
    { icon: Clock, value: t.homepage.trustBadges.approvalTime.value, title: t.homepage.trustBadges.approvalTime.title },
    { icon: Star, value: t.homepage.trustBadges.rating.value, title: t.homepage.trustBadges.rating.title }
  ];

  const features = [
    {
      icon: Zap,
      title: t.homepage.features.fast.title,
      description: t.homepage.features.fast.description
    },
    {
      icon: Shield,
      title: t.homepage.features.secure.title,
      description: t.homepage.features.secure.description
    },
    {
      icon: Brain,
      title: t.homepage.features.aiScore.title,
      description: t.homepage.features.aiScore.description
    },
    {
      icon: Clock,
      title: t.homepage.features.available.title,
      description: t.homepage.features.available.description
    },
    {
      icon: Smartphone,
      title: t.homepage.features.mobile.title,
      description: t.homepage.features.mobile.description
    },
    {
      icon: Award,
      title: t.homepage.features.licensed.title,
      description: t.homepage.features.licensed.description
    },
    {
      icon: TrendingUp,
      title: t.homepage.features.flexible.title,
      description: t.homepage.features.flexible.description
    },
    {
      icon: Rocket,
      title: t.homepage.features.instant.title,
      description: t.homepage.features.instant.description
    }
  ];

  const loanProducts = [
    {
      name: t.homepage.loanProducts.personal.name,
      description: t.homepage.loanProducts.personal.description,
      rate: t.homepage.loanProducts.personal.rate,
      icon: Heart,
      link: "/products/personal-loan"
    },
    {
      name: t.homepage.loanProducts.business.name,
      description: t.homepage.loanProducts.business.description,
      rate: t.homepage.loanProducts.business.rate,
      icon: Briefcase,
      link: "/products/business-loan"
    },
    {
      name: t.homepage.loanProducts.emergency.name,
      description: t.homepage.loanProducts.emergency.description,
      rate: t.homepage.loanProducts.emergency.rate,
      icon: Zap,
      link: "/products/emergency"
    },
    {
      name: t.homepage.loanProducts.education.name,
      description: t.homepage.loanProducts.education.description,
      rate: t.homepage.loanProducts.education.rate,
      icon: Globe,
      link: "/products/education-loan"
    }
  ];

  const steps = [
    {
      title: t.homepage.steps.apply.title,
      description: t.homepage.steps.apply.description,
      time: t.homepage.steps.apply.time,
      icon: FileCheck
    },
    {
      title: t.homepage.steps.approval.title,
      description: t.homepage.steps.approval.description,
      time: t.homepage.steps.approval.time,
      icon: Brain
    },
    {
      title: t.homepage.steps.money.title,
      description: t.homepage.steps.money.description,
      time: t.homepage.steps.money.time,
      icon: PiggyBank
    }
  ];

  return (
    <>
      <div className="min-h-screen" ref={containerRef}>
        <Hero/>
          <StepsSection/>
        <FeaturesSection/>
        
             {/* Interactive Loan Calculator Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#F6F6F6]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <span className="inline-block px-4 py-2 glass rounded-full text-xs sm:text-sm font-semibold mb-4">
                  <Sparkles className="inline w-4 h-4 mr-1 text-yellow-500" />
                  {t.homepage.sections.calculator.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-4 sm:mb-6">
                  {t.homepage.sections.calculator.title}
                  <span className="block text-[#25B181]">
                    {t.homepage.sections.calculator.titleHighlight}
                  </span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
                  {t.homepage.sections.calculator.subtitle}
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#25B181] flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">{t.homepage.sections.calculator.features.noHiddenCharges}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#25B181] flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">{t.homepage.sections.calculator.features.flexibleTenure}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#25B181] flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">{t.homepage.sections.calculator.features.lowestRates}</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <LoanCalculatorAll/>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Loan Products Showcase */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-white"> */}
            <LoansGrid/>
        {/* </section> */}

   <FinancialCTA/>

   


        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12 lg:mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#DAE6FF] text-[#4A66FF] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                FAQs
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4 px-4">
                {t.homepage.faqs.title}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
                {t.homepage.faqs.subtitle}
              </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                        activeFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: activeFaq === index ? 'auto' : 0,
                      opacity: activeFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base text-gray-600">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#7CDAC3] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#25B181]/20 via-[#51C9AF]/20 to-[#7CDAC3]/20" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }} />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          >
            <Rocket className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 text-yellow-300" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-4 sm:mb-6 px-4">
              {t.homepage.sections.cta.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto px-4">
              {t.homepage.sections.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
              <Link href="/apply" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#25B181] rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-[#D3F1EB] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {t.homepage.sections.cta.applyButton}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t.homepage.sections.cta.talkButton}
                </motion.button>
              </Link>
            </div>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-white/90 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t.homepage.sections.cta.badges.rbiLicensed}</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t.homepage.sections.cta.badges.isoCertified}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t.homepage.sections.cta.badges.awardWinning}</span>
              </div>
            </div>
          </motion.div>
        </section> */}

        {/* Feature Comparison Table */}
        {/* <FeatureCards /> */}




      </div>
    </>
  );
}

// Testimonials data (kept outside component as it doesn't need translation yet)
const testimonials: {
  name: string;
  designation: string;
  content: string;
  loanAmount: string;
}[] = [];

const faqs: {
  question: string;
  answer: string;
}[] = [];