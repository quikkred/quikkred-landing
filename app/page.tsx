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
        {/* Hero Section - Reduced spacing */}
        <Hero/>

        <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
          <StepsSection/>
        </section>

        {/* Trust Badges Section - Clean White Background */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#D3F1EB] to-[#A8E3D7] rounded-full mb-2 sm:mb-3">
                    <badge.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#25B181]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{badge.value}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 px-2">{badge.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Main Features Grid - Clean Light Background */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-[#D3F1EB]/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12 lg:mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                {t.homepage.sections.whyChoose.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4 text-gray-900 px-4">
                {t.homepage.sections.whyChoose.title}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                {t.homepage.sections.whyChoose.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-glow transition-all duration-300"
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#25B181] to-[#FF9C70] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-white rounded-2xl p-5 sm:p-6 m-[1px]">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 group-hover:text-[#25B181] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        <FeaturesSection/>

        <LoanCalculatorAll/>

        {/* Loan Products Showcase */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
           

            <LoansGrid/>
         
        </section>

        {/* Interactive Loan Calculator Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#DAE6FF]/20 via-[#D3F1EB]/20 to-[#FFF4E4]/20">
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
                {/* <LoanCalculator /> */}
              </motion.div>
            </div>
          </div>
        </section>

   

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 lg:py-20 gradient-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12 lg:mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#FFF4E4] text-[#E36229] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                {t.homepage.sections.testimonials.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4 px-4">
                {t.homepage.sections.testimonials.title} <span className="text-[#FF9C70]">{t.homepage.sections.testimonials.titleHighlight}</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                {t.homepage.sections.testimonials.subtitle}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-dark p-5 sm:p-6 hover-glow"
                >
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic line-clamp-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4A66FF] to-[#6D90FF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {testimonial.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{testimonial.designation}</p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4">
                    <span className="text-xs px-2 py-1 bg-[#DAE6FF] text-[#4A66FF] rounded-full inline-block">
                      {t.homepage.sections.testimonials.loanAmount}: {testimonial.loanAmount}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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