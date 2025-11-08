"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Activity,
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
  Heart,
  Stethoscope,
  Ambulance,
  Hospital,
  Cross,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";

export default function MedicalEmergencyPage() {
  const { t: tLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section>
        <section className="py-12 sm:py-16 lg:py-20">
          <SalaryAdvance
            title={t('products.pages.medical.hero.title')}
            highlightWord={t('products.pages.medical.hero.highlightWord')}
            title1={t('products.pages.medical.hero.title1')}
            subtitle={t('products.pages.medical.hero.subtitle')}
            buttonPrimaryText={t('products.pages.medical.hero.buttonPrimary')}
            buttonSecondaryText={t('products.pages.medical.hero.buttonSecondary')}
            quickAccessAmount={t('products.pages.medical.hero.quickAccessAmount')}
            timeText={t('products.pages.medical.hero.timeText')}
            imageSrc="/Medicalloan_hero_image.jpg"
            features={[
              t('products.pages.medical.hero.features.rates'),
              t('products.pages.medical.hero.features.cashless'),
              t('products.pages.medical.hero.features.network'),
            ]}
            primaryColor="emerald"
          />
        </section>
      </section>

      {/* Medical Features Grid */}
      <section className="bg-[#f6f6f6] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Why Choose Medical Emergency Loan?
            </h2>
            <p className="text-xl text-gray-600">
              Fast, reliable funding for all your medical needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {medicalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Partners */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Partner Hospitals
            </h2>
            <p className="text-xl text-gray-600">
              Direct cashless treatment at leading hospitals across India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {hospitalPartners.map((hospital, index) => (
              <motion.div
                key={hospital.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <Hospital className="w-8 h-8 text-[#25B181] mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">{hospital.name}</h3>
                <p className="text-sm text-gray-600">{hospital.location}</p>
                <p className="text-xs text-[#25B181] mt-2">
                  {hospital.specialties}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Categories */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Medical Expenses Covered
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive coverage for all types of medical treatments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {medicalCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#ecfdf5] to-[#d1fae5] rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6 text-[#25B181]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                <ul className="space-y-1">
                  {category.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 flex items-center gap-2"
                    >
                      <CheckCircle className="w-3 h-3 text-[#25B181] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
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
              title="Medical Loan Calculator"
              subtitle="Calculate your daily EMI for medical expenses"
            />
          </div>
        </div>
      </section>

      <FinancialFeatureSection
  image="/Medicalloan_sub_image.jpg"
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
              Get medical funding in 4 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {medicalSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Patient Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              How we helped families during medical emergencies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {medicalTestimonials.map((testimonial, index) => (
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
                  <div className="w-10 h-10 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.treatment}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-sora">
              Need Medical Funding?
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90">
              Don't delay treatment - Get instant medical loan approval in 24
              hours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/quick">
                <button className="px-8 py-4 bg-white text-[#25B181] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Apply for Medical Loan
                </button>
              </Link>
              <a href="tel:+918888881111">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                  <Phone className="w-5 h-5" />
                  Emergency Helpline
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

const medicalFeatures = [
  {
    icon: Activity,
    title: "24-Hour Approval",
    description:
      "Emergency medical loans approved within 24 hours, even on weekends",
  },
  {
    icon: Cross,
    title: "Direct Hospital Payment",
    description:
      "We pay directly to hospitals for cashless treatment experience",
  },
  {
    icon: Shield,
    title: "Lowest Medical Rates",
    description:
      "Special interest rates starting at 1% per month for medical emergencies",
  },
  {
    icon: Ambulance,
    title: "Emergency Support",
    description:
      "24/7 customer support for medical emergency loan applications",
  },
  {
    icon: Heart,
    title: "No Collateral",
    description:
      "Unsecured loans with minimal documentation during emergencies",
  },
  {
    icon: Stethoscope,
    title: "All Treatments",
    description:
      "Coverage for all medical treatments, surgeries, and procedures",
  },
];

const hospitalPartners: any[] = [
  // { name: "Apollo Hospitals", location: "Pan India", specialties: "Multi-specialty" },
  // { name: "Fortis Healthcare", location: "Major Cities", specialties: "Surgery & ICU" },
  // { name: "Max Healthcare", location: "North India", specialties: "Cardiac & Neuro" },
  // { name: "Manipal Hospitals", location: "South India", specialties: "Oncology & Organ Transplant" },
  // { name: "Columbia Asia", location: "Bangalore & Pune", specialties: "Emergency & Critical Care" },
  // { name: "AIIMS", location: "Delhi & Branches", specialties: "Government Partner" },
  // { name: "Narayana Health", location: "Bangalore & Kolkata", specialties: "Affordable Healthcare" },
  // { name: "Medanta", location: "Gurgaon", specialties: "Super Specialty" }
];

const medicalCategories = [
  {
    title: "Emergency Surgeries",
    icon: Activity,
    items: [
      "Heart Surgery",
      "Brain Surgery",
      "Cancer Treatment",
      "Organ Transplant",
      "Accident Treatment",
    ],
  },
  {
    title: "Planned Procedures",
    icon: Stethoscope,
    items: [
      "Knee Replacement",
      "Cataract Surgery",
      "Dental Implants",
      "Cosmetic Surgery",
      "Fertility Treatment",
    ],
  },
  {
    title: "Critical Care",
    icon: Heart,
    items: [
      "ICU Treatment",
      "Ventilator Support",
      "Dialysis",
      "Chemotherapy",
      "Radiation Therapy",
    ],
  },
  {
    title: "Diagnostics",
    icon: Cross,
    items: [
      "MRI & CT Scans",
      "PET Scans",
      "Biopsy",
      "Blood Tests",
      "Health Checkups",
    ],
  },
  {
    title: "Maternity Care",
    icon: Users,
    items: [
      "Normal Delivery",
      "C-Section",
      "NICU Care",
      "Prenatal Care",
      "Postnatal Care",
    ],
  },
  {
    title: "Alternative Medicine",
    icon: Hospital,
    items: [
      "Ayurvedic Treatment",
      "Homeopathy",
      "Physiotherapy",
      "Rehabilitation",
      "Mental Health",
    ],
  },
];

const medicalSteps = [
  {
    title: "Emergency Application",
    description:
      "Fill our emergency medical loan form with patient details and treatment requirements.",
  },
  {
    title: "Medical Verification",
    description:
      "Our medical team verifies the treatment necessity with your doctor within 2 hours.",
  },
  {
    title: "Instant Approval",
    description:
      "Get loan approval within 24 hours with special medical emergency rates.",
  },
  {
    title: "Direct Payment",
    description:
      "We transfer funds directly to the hospital or your account for immediate treatment.",
  },
];

const medicalTestimonials: any[] = [];
