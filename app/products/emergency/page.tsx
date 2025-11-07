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
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { DocumentIcon } from "@/components/feature-icon";
import { FinancialFeatureSection } from "@/components/financial-feature-section";

export default function EmergencyFundPage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(50000);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section>
        <section className="py-12 sm:py-16 lg:py-20">
          <SalaryAdvance
            title="Unexpected"
            highlightWord="Expenses?"
            title1=" We've Got You."
            subtitle="Get instant financial support for life's unforeseen moments. Quick, easy, and completely transparent."
            buttonPrimaryText="Get Funds Now"
            buttonSecondaryText="Check Eligibility"
            quickAccessAmount="₹50,000"
            timeText="10 mins"
            imageSrc="/EmergencyFund_hero_image.jpg"
            features={[
              "24-Hour Approval",
              "Compassionate Care",
              "100% Confidential",
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
              We Cover All Emergency Situations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whatever the emergency, we're here to help with instant financial
              support
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
              title="Emergency Loan Calculator"
              subtitle="Calculate your daily EMI for Emergency Loan"
            />
          </div>
        </div>
      </section>

<FinancialFeatureSection
  image="/EmergencyFund_sub_image.jpg"
  imageAlt="Smiling woman using phone for emergency fund application"
  badge={{
    percentage: "100%",
    label: "Secure",
  }}
  heading="Fast Help for Emergencies."
  description="We believe you deserve fast support during an emergency. No judgment, no long waits—just the help you need."
  features={[
    {
      icon: <DocumentIcon />,
      title: "Priority Application",
      description: "2-minute form. Your emergency request is prioritized.",
    },
    {
      icon: <DocumentIcon />,
      title: "Fully Secure",
      description: "We use bank-level 256-bit encryption to protect your personal and financial data.",
    },
    {
      icon: <DocumentIcon />,
      title: "No Hidden Fees",
      description: "One single, transparent fee. No surprises.",
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
              Emergency Loan Process
            </h2>
            <p className="text-xl text-gray-600">
              Simple 3-step process designed for speed
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
              Real Stories of Help
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
