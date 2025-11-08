"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Plane,
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
  MapPin,
  Camera,
  Compass,
  Globe,
  Mountain,
  Waves,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";

export default function TravelNowPayLaterPage() {
  const { t: tLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section>
        <section className="py-12 sm:py-16 lg:py-20">
          <SalaryAdvance
            title={t('products.pages.travel.hero.title')}
            highlightWord={t('products.pages.travel.hero.highlightWord')}
            title1={t('products.pages.travel.hero.title1')}
            subtitle={t('products.pages.travel.hero.subtitle')}
            buttonPrimaryText={t('products.pages.travel.hero.buttonPrimary')}
            buttonSecondaryText={t('products.pages.travel.hero.buttonSecondary')}
            quickAccessAmount={t('products.pages.travel.hero.quickAccessAmount')}
            timeText={t('products.pages.travel.hero.timeText')}
            imageSrc="/Travelnow_hero_image.jpg"
            features={[
              t('products.pages.travel.hero.features.booking'),
              t('products.pages.travel.hero.features.insurance'),
              t('products.pages.travel.hero.features.down'),
            ]}
            primaryColor="emerald"
          />
        </section>
      </section>

      {/* Travel Features Grid */}
      <section className=" bg-[#f6f6f6] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Why Choose Travel Now Pay Later?
            </h2>
            <p className="text-xl text-gray-600">
              Make your dream vacation a reality with flexible payment options
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelFeatures.map((feature, index) => (
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

      {/* Travel Destinations */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Finance your travel to any destination worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {travelDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-[#6B7FFF] to-[#4A66FF] flex items-center justify-center">
                  <span className="text-4xl">{destination.flag}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {destination.type}
                  </p>
                  <p className="text-xs text-[#4A66FF] font-medium">
                    From ₹{destination.startingPrice}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Travel Partners */}
      {/* <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Travel Partners
            </h2>
            <p className="text-xl text-gray-600">
              Book with our trusted travel partners and get exclusive deals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {travelPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#E5E9FF] to-[#EEF1FF] rounded-lg flex items-center justify-center mb-4">
                  <partner.icon className="w-6 h-6 text-[#4A66FF]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {partner.description}
                </p>
                <p className="text-xs text-[#4A66FF] font-medium">
                  {partner.benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* EMI Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <LoanCalculator
              title="Travel Loan Calculator"
              subtitle="Calculate your daily EMI for travel financing"
            />
          </div>
        </div>
      </section>

      <FinancialFeatureSection
        image="/Travelnow_sub_image.jpg"
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
            description:
              "Get your advance approved in minutes. No waiting, no long forms.",
          },
          {
            icon: <DocumentIcon />,
            title: "Flexible Repayment",
            description:
              "Choose a simple repayment plan that fits your salary cycle.",
          },
          {
            icon: <DocumentIcon />,
            title: "100% Digital",
            description:
              "From application to disbursal, the entire process is completely online.",
          },
        ]}
      />

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20">
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
              Book your dream vacation in 4 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {travelSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#4A66FF] to-[#6B7FFF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
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
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Travel Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Amazing travel experiences made possible by Quikkred
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {travelTestimonials.map((testimonial, index) => (
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
                  <div className="w-10 h-10 bg-gradient-to-r from-[#4A66FF] to-[#6B7FFF] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.destination}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      <div className="flex items-center justify-center min-h-screen bg-[#f6f6f6] py-16 md:py-24 px-4">
        <div
          className="w-full max-w-5xl rounded-3xl p-12 md:p-20 text-center"
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

          <p className="text-lg md:text-xl text-white/90 mb-8 text-balance">
            {t('products.cta.description')}
          </p>

          <button className="h-12 bg-gray-900 hover:bg-gray-800 text-white px-8 rounded-lg font-semibold transition-colors w-full md:w-auto border-0 cursor-pointer">
            {t('products.cta.button')}
          </button>
        </div>
      </div>
    </div>
  );
}

const travelFeatures = [
  {
    icon: Plane,
    title: "Instant Booking",
    description:
      "Book flights, hotels, and packages instantly with pre-approved travel credit",
  },
  {
    icon: Shield,
    title: "Travel Insurance",
    description:
      "Comprehensive travel insurance included with every booking at no extra cost",
  },
  {
    icon: Globe,
    title: "Worldwide Coverage",
    description: "Travel anywhere in the world with our global partner network",
  },
  {
    icon: Calculator,
    title: "Flexible EMIs",
    description:
      "Choose from 6 to 24 months repayment period with competitive rates",
  },
  {
    icon: MapPin,
    title: "Zero Down Payment",
    description:
      "Start your journey without any upfront payment or security deposit",
  },
  {
    icon: Camera,
    title: "Experience More",
    description:
      "Add activities, excursions, and experiences to your travel package",
  },
];

const travelDestinations = [
  {
    name: "Dubai",
    flag: "🇦🇪",
    type: "Luxury & Shopping",
    startingPrice: "35,000",
  },
  {
    name: "Thailand",
    flag: "🇹🇭",
    type: "Beaches & Culture",
    startingPrice: "25,000",
  },
  {
    name: "Singapore",
    flag: "🇸🇬",
    type: "City & Gardens",
    startingPrice: "40,000",
  },
  {
    name: "Maldives",
    flag: "🇲🇻",
    type: "Beach Resort",
    startingPrice: "75,000",
  },
  {
    name: "Europe",
    flag: "🇪🇺",
    type: "Historical Tours",
    startingPrice: "80,000",
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    type: "Culture & Tech",
    startingPrice: "65,000",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    type: "Adventure & Nature",
    startingPrice: "90,000",
  },
  {
    name: "USA",
    flag: "🇺🇸",
    type: "Cities & Attractions",
    startingPrice: "1,20,000",
  },
];

const travelPartners: any[] = [];

const travelSteps = [
  {
    title: "Choose Your Destination",
    description:
      "Browse destinations and packages from our partner travel agencies. Get instant price quotes.",
  },
  {
    title: "Apply for Travel Credit",
    description:
      "Apply for travel financing with your chosen package details. Get approved within 30 minutes.",
  },
  {
    title: "Book Instantly",
    description:
      "Once approved, book your travel immediately. All payments handled by Quikkred.",
  },
  {
    title: "Travel & Repay",
    description:
      "Enjoy your vacation and repay in comfortable EMIs. Travel insurance coverage throughout.",
  },
];

const travelTestimonials: any[] = [];
