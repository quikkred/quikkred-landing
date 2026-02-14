"use client";

import { motion } from "framer-motion";
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
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import { FinancialCTA } from "@/components/homepage/financial-cta";
import SalaryAdvance from "@/components/SalaryAdvance";


export default function Home() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const containerRef = useRef(null);


  useEffect(() => {
    const envVars: Record<string, string | undefined> = {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_AWS_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
      NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
      NEXT_PUBLIC_TRUECALLER_PARTNER_KEY: process.env.NEXT_PUBLIC_TRUECALLER_PARTNER_KEY,
      NEXT_PUBLIC_TRUECALLER_APP_NAME: process.env.NEXT_PUBLIC_TRUECALLER_APP_NAME,
    };

    console.group('🔧 Environment Variables');
    Object.entries(envVars).forEach(([key, value]) => {
      if (value) {
        // Mask sensitive values, show first 8 chars
        const masked = value.length > 12 ? value.slice(0, 8) + '...' : value;
        console.log(`✅ ${key}: ${masked}`);
      } else {
        console.warn(`❌ ${key}: NOT SET`);
      }
    });
    console.groupEnd();
  }, []);

  // Removed scroll animations for better initial load performance

  // Data arrays using translations
  const trustBadges = [
    { icon: Users, value: t?.homepage?.trustBadges?.customers.value, title: t?.homepage?.trustBadges?.customers?.title },
    { icon: IndianRupee, value: t?.homepage?.trustBadges?.disbursed.value, title: t?.homepage?.trustBadges?.disbursed?.title },
    { icon: Clock, value: t?.homepage?.trustBadges?.approvalTime.value, title: t?.homepage?.trustBadges?.approvalTime?.title },
    { icon: Star, value: t?.homepage?.trustBadges?.rating.value, title: t?.homepage?.trustBadges?.rating?.title }
  ];

  const features = [
    {
      icon: Zap,
      title: t?.homepage?.features?.fast?.title,
      description: t?.homepage?.features?.fast?.description
    },
    {
      icon: Shield,
      title: t?.homepage?.features?.secure?.title,
      description: t?.homepage?.features?.secure?.description
    },
    {
      icon: Brain,
      title: t?.homepage?.features?.aiScore?.title,
      description: t?.homepage?.features?.aiScore?.description
    },
    {
      icon: Clock,
      title: t?.homepage?.features?.available?.title,
      description: t?.homepage?.features?.available?.description
    },
    {
      icon: Smartphone,
      title: t?.homepage?.features?.mobile?.title,
      description: t?.homepage?.features?.mobile?.description
    },
    {
      icon: Award,
      title: t?.homepage?.features?.licensed?.title,
      description: t?.homepage?.features?.licensed?.description
    },
    {
      icon: TrendingUp,
      title: t?.homepage?.features?.flexible?.title,
      description: t?.homepage?.features?.flexible?.description
    },
    {
      icon: Rocket,
      title: t?.homepage?.features?.instant?.title,
       description: t?.homepage?.features?.instant?.description
    }
  ];

  const loanProducts = [
    {
      name: t?.homepage?.loanProducts?.personal?.name,
      description: t?.homepage?.loanProducts?.personal?.description,
      rate: t?.homepage?.loanProducts?.personal?.rate,
      icon: Heart,
      link: "/products/personal-loan"
    },
    {
      name: t?.homepage?.loanProducts?.business?.name,
      description: t?.homepage?.loanProducts?.business?.description,
      rate: t?.homepage?.loanProducts?.business?.rate,
      icon: Briefcase,
      link: "/products/business-loan"
    },
    {
      name: t?.homepage?.loanProducts?.emergency?.name,
      description: t?.homepage?.loanProducts?.emergency?.description,
      rate: t?.homepage?.loanProducts?.emergency?.rate,
      icon: Zap,
      link: "/products/emergency"
    },
    {
      name: t?.homepage?.loanProducts?.education?.name,
      description: t?.homepage?.loanProducts?.education?.description,
      rate: t?.homepage?.loanProducts?.education?.rate,
      icon: Globe,
      link: "/products/education-loan"
    }
  ];

  const steps = [
    {
      title: t?.homepage?.steps?.apply?.title,
      description: t?.homepage?.steps?.apply?.description,
      time: t?.homepage?.steps?.apply?.time,
      icon: FileCheck
    },
    {
      title: t?.homepage?.steps.approval.title,
      description: t?.homepage?.steps.approval.description,
      time: t?.homepage?.steps.approval.time,
      icon: Brain
    },
    {
      title: t?.homepage?.steps.money.title,
      description: t?.homepage?.steps.money.description,
      time: t?.homepage?.steps.money.time,
      icon: PiggyBank
    }
  ];

  return (
    <>
      <div className="min-h-screen" ref={containerRef}>
        {/* Hero Section - Full Screen */}
        <Hero/>

        {/* Steps Section - Full Screen */}
        <StepsSection/>

        {/* Features Section - Full Screen */}
        <FeaturesSection/>

        {/* Interactive Loan Calculator Section */}
        <section className="flex items-center py-8 sm:py-10 lg:py-12 bg-[#F6F6F6]">
          <div className="container mx-auto sm:px-6 lg:px-8 flex items-center">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <span className="inline-block px-3 py-1.5 glass rounded-full text-xs font-semibold mb-3">
                  <Sparkles className="inline w-3.5 h-3.5 mr-1 text-yellow-500" />
                  {t?.homepage?.sections?.calculator?.badge}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold font-sora mb-3 sm:mb-4">
                  {t?.homepage?.sections?.calculator?.title}
                  <span className="block text-[#25B181]">
                    {t?.homepage?.sections?.calculator?.titleHighlight}
                  </span>
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6">
                  {t?.homepage?.sections?.calculator?.subtitle}
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#25B181] flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">{t?.homepage?.sections?.calculator?.features.noHiddenCharges}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#25B181] flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">{t?.homepage?.sections?.calculator?.features.flexibleTenure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#25B181] flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">{t?.homepage?.sections?.calculator?.features.lowestRates}</span>
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

        {/* Loan Products Showcase - Full Screen */}
        
        {/* <LoansGrid/> */}

        {/* Testimonials Section */}
        <TestimonialsSection/>

          {/* FAQ Section - Full Screen */}
        <section className="min-h-[calc(100vh-80px)] flex items-center py-8 sm:py-10 lg:py-12 bg-white">
          <div className="container mx-auto sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-5 sm:mb-10"
            >
              <span className="inline-block px-4 py-2 bg-[#DAE6FF] text-[#4A66FF] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                FAQs
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora mb-3 sm:mb-4 px-4">
                {t?.homepage?.faq?.heading}</h2>
              <p className="text-sm sm:text-lg lg:text-xl text-gray-600 px-4">
                {t?.homepage?.faq?.subtitle}
    ?          </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {t?.homepage?.faq?.faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-100 rounded-2xl overflow-hidden shadow-soft"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-200 transition-colors"
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
                    <p className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-600">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Financial CTA - Full Screen */}
        <FinancialCTA/>
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
}[] = [
  {
    question: "What is an NBFC loan?",
    answer:
      "An NBFC loan is a financial product offered by a Non-Banking Financial Company that provides credit for personal, business, or vehicle needs without requiring a traditional bank."
  },
  {
    question: "How is an NBFC loan different from a bank loan?",
    answer:
      "NBFCs offer faster processing, flexible eligibility, and simpler documentation compared to banks. However, interest rates may be slightly higher."
  },
  {
    question: "What are the eligibility criteria for an NBFC loan?",
    answer:
      "Eligibility typically includes age, stable income, valid ID/address proof, and a minimum credit score. Criteria may vary depending on the NBFC and loan type."
  },
  {
    question: "How long does it take to get an NBFC loan approved?",
    answer:
      "Most NBFCs provide quick approval—often within a few hours to 48 hours—depending on document verification."
  },
  {
    question: "Is it safe to take a loan from an NBFC?",
    answer:
      "Yes, as long as the NBFC is registered with the RBI. Always verify the company’s registration status and review the loan terms."
  }
];
;
