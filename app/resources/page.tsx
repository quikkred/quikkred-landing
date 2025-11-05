"use client";

import { motion } from "framer-motion";
import { BookOpen, Home, ArrowRight, Wallet, TrendingUp, PiggyBank, Shield, Target, CreditCard, LineChart, Calculator, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function FinancialLiteracyPage() {
  const { t } = useLanguage();

  const topics = [
    {
      title: "Personal Finance Basics",
      description: "Understanding income, expenses, and budgeting fundamentals",
      icon: Wallet,
      color: "#25B181",
      articles: [
        "How to Create a Monthly Budget",
        "Understanding Your Salary Slip",
        "Essential vs Non-Essential Expenses",
        "Building an Emergency Fund"
      ]
    },
    {
      title: "Smart Borrowing",
      description: "Learn how to borrow responsibly and manage loans effectively",
      icon: CreditCard,
      color: "#4A66FF",
      articles: [
        "When Should You Take a Loan?",
        "Understanding Interest Rates and EMI",
        "Credit Score and Its Importance",
        "Avoiding Loan Default"
      ]
    },
    {
      title: "Savings & Investments",
      description: "Build wealth through smart saving and investment strategies",
      icon: PiggyBank,
      color: "#FF9C70",
      articles: [
        "Power of Compound Interest",
        "Different Investment Options in India",
        "Tax Saving Instruments",
        "Building Long-term Wealth"
      ]
    },
    {
      title: "Financial Planning",
      description: "Plan for your future financial goals and security",
      icon: Target,
      color: "#4A148C",
      articles: [
        "Setting Financial Goals",
        "Retirement Planning Basics",
        "Children's Education Planning",
        "Insurance - Life, Health & More"
      ]
    },
    {
      title: "Digital Finance",
      description: "Navigate the world of digital payments and fintech safely",
      icon: LineChart,
      color: "#0D47A1",
      articles: [
        "UPI and Digital Payments",
        "Online Banking Security Tips",
        "Avoiding Financial Frauds",
        "Cryptocurrency Basics"
      ]
    },
    {
      title: "Risk Management",
      description: "Protect yourself from financial risks and emergencies",
      icon: Shield,
      color: "#145214",
      articles: [
        "Building an Emergency Fund",
        "Types of Insurance You Need",
        "Dealing with Job Loss",
        "Medical Emergency Planning"
      ]
    }
  ];

  const quickTips = [
    {
      tip: "Follow the 50-30-20 Rule",
      description: "Allocate 50% for needs, 30% for wants, and 20% for savings",
      icon: "💰",
      color: "#25B181"
    },
    {
      tip: "Pay Yourself First",
      description: "Save a portion of your income before spending on anything else",
      icon: "🎯",
      color: "#4A66FF"
    },
    {
      tip: "Avoid High-Interest Debt",
      description: "Pay off credit card debt and high-interest loans first",
      icon: "⚠️",
      color: "#FF9C70"
    },
    {
      tip: "Invest Early, Invest Regularly",
      description: "Start investing young to leverage the power of compounding",
      icon: "📈",
      color: "#4A148C"
    }
  ];

  const calculators = [
    { name: "EMI Calculator", href: "/resources/emi-calculator", icon: Calculator, color: "#1976D2" },
    { name: "Loan Eligibility", href: "/resources/eligibility-check", icon: Target, color: "#006837" },
    { name: "Interest Rates", href: "/resources/intrest-rate", icon: TrendingUp, color: "#F9A825" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            {/* <div className="flex items-center gap-2 text-white/90 mb-6">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ArrowRight className="w-3 h-3" />
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>Financial Literacy</span>
            </div> */}

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl lg:text-6xl font-bold font-sora">
                Financial Literacy
              </h1>
            </div>

            <p className="text-xl mb-8 opacity-90 max-w-3xl">
              Empower yourself with financial knowledge. Learn to manage money wisely, make informed decisions, and build a secure financial future.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Free Learning Resources</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>Practical Tips</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <span>Financial Tools</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Quick Financial Tips</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: item.color }}>
                  {item.tip}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Learning Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: topic.color }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {topic.description}
                  </p>
                  <div className="space-y-2">
                    {topic.articles.map((article, idx) => (
                      <div key={idx} className="flex items-start gap-2 group cursor-pointer">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: topic.color }}
                        />
                        <span className="text-sm text-gray-700 group-hover:underline">
                          {article}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Financial Calculators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div
            className="rounded-2xl p-8"
            style={{ background: `linear-gradient(135deg, #006837 0%, #1976D2 100%)` }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">Financial Calculators</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {calculators.map((calc, index) => {
                const Icon = calc.icon;
                return (
                  <Link key={index} href={calc.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: calc.color }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold" style={{ color: calc.color }}>
                        {calc.name}
                      </h3>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="bg-amber-50 border-2 border-[#F9A825] rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 flex-shrink-0" style={{ color: '#F9A825' }} />
              <div>
                <h3 className="font-bold mb-2" style={{ color: '#F9A825' }}>Important Financial Safety Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#F9A825' }}>•</span>
                    <span>Never share your OTP, PIN, or password with anyone, including bank officials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#F9A825' }}>•</span>
                    <span>Always verify the website URL before entering financial information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#F9A825' }}>•</span>
                    <span>Be cautious of unsolicited calls or messages asking for financial details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#F9A825' }}>•</span>
                    <span>Report suspicious activities immediately to your bank and authorities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-2xl p-8 text-white text-center"
            style={{ background: `linear-gradient(135deg, #4A148C 0%, #FFD600 100%)` }}
          >
            <h2 className="text-2xl font-bold mb-4">Need Help with Financial Planning?</h2>
            <p className="mb-6 opacity-90">
              Our financial experts are here to guide you. Get personalized advice and smart loan solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/apply">
                <button
                  className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#FFFFFF', color: '#145214' }}
                >
                  Apply for Loan
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all border-2 border-white">
                  Contact Expert
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
