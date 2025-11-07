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
import { LoanCalculator } from "@/components/loan-calculator";
import SalaryAdvance from "@/components/SalaryAdvance";
import { FinancialFeatureSection } from "@/components/financial-feature-section";
import { DocumentIcon } from "@/components/feature-icon";

export default function SalaryAdvancePage() {
  const { t } = useLanguage();
  const [salary, setSalary] = useState(30000);
  const [loanAmount, setLoanAmount] = useState(15000);
  const maxLoan = Math.min(salary * 2, 100000);
  const processingFee = loanAmount * 0.02;
  const interest = loanAmount * 0.015;
  const totalPayable = loanAmount + interest + processingFee;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <SalaryAdvance
          title="Instant"
          highlightWord="Salary"
          title1="Advance"
          subtitle="Get instant loan approval with QuikKred. Fast, secure, and 100% digital process designed for modern India."
          buttonPrimaryText="Get Salary Advance"
          buttonSecondaryText="Check Eligibility"
          quickAccessAmount="₹1,00,000"
          timeText="5 mins"
          imageSrc="/Salaryadvance_hero_image.jpg"
          features={["No credit check", "Instant approval", "Transparent fees"]}
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
              Why Salaried Employees Love Us
            </h2>
            <p className="text-xl text-gray-600">
              Designed specifically for working professionals
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
              title="Advance Salary Calculator"
              subtitle="Calculate your daily EMI for Advance Salary"
            />
          </div>
        </div>
      </section>

       <FinancialFeatureSection
        image="/Salaryadvance_sub_image.jpg"
        imageAlt="Man in green sweater looking at phone"
        badge={{
          percentage: "100%",
          label: "Secure",
        }}
        heading="Financial Flexibility, on Your Terms"
        description="We believe everyone deserves access to their earned salary when they need it. No judgment, just support."
        features={[
          {
            icon: <DocumentIcon />,
            title: "Apply Online",
            description: "Fill a simple form with employment details and upload salary slips",
          },
          {
            icon: <DocumentIcon />,
            title: "Fully Secure",
            description: "We use bank-level 256-bit encryption to protect your personal and financial data.",
          },
          {
            icon: <DocumentIcon />,
            title: "Clear & Simple",
            description: "One single, transparent fee. No hidden charges, no surprises on repayment.",
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
                Simple Eligibility Criteria
              </h2>
              <p className="text-xl text-gray-600">
                If you're a salaried employee, you're likely eligible!
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
                  Basic Requirements
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Age: 21-58 years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Min Salary: ₹15,000/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Indian Citizen</span>
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
                  Employment
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Permanent employee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>6+ months in current job</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Salary via bank transfer</span>
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
                  Documents
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-[#4A66FF] mt-0.5" />
                    <span>PAN Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-[#4A66FF] mt-0.5" />
                    <span>Aadhaar Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-[#4A66FF] mt-0.5" />
                    <span>Last 3 Salary Slips</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              How to Get Your Salary Advance
            </h2>
            <p className="text-xl text-gray-600">
              3 simple steps to instant cash
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-[#25B181] to-[#25B181] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#25B181] to-[#25B181] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-sora">
              Don't Wait Till Payday!
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90">
              Get instant salary advance in just 5 minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/quick">
                <button className="px-8 py-4 bg-white text-[#25B181] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Get Salary Advance Now
                </button>
              </Link>
              <a href="tel:+918888881111">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                  <Phone className="w-5 h-5" />
                  Talk to Expert
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const benefits = [
  {
    icon: Zap,
    title: "Instant Approval",
    description:
      "No waiting, no queues. Get approved instantly with our AI system",
  },
  {
    icon: Calendar,
    title: "Flexible Repayment",
    description: "Auto-deduct from your next salary or pay in EMIs",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your data is encrypted and never shared with third parties",
  },
  {
    icon: CreditCard,
    title: "No Hidden Charges",
    description: "Transparent pricing with no surprises",
  },
  {
    icon: Building,
    title: "Company Tie-ups",
    description: "Special rates for employees of partner companies",
  },
  {
    icon: Wallet,
    title: "Repeat Advances",
    description: "Build credit history and get higher advances",
  },
];

const companies: any[] = [];

const process = [
  {
    title: "Apply Online",
    description:
      "Fill a simple form with employment details and upload salary slips",
  },
  {
    title: "Instant Verification",
    description: "Our AI verifies your details and approves within seconds",
  },
  {
    title: "Get Money",
    description: "Money transferred to your bank account in 5 minutes",
  },
];

const testimonials: any[] = [];
