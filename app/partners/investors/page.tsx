"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  BarChart,
  PieChart,
  Award,
  Shield,
  Home,
  ArrowRight,
  CheckCircle,
  Download,
  FileText,
  DollarSign,
  Users,
  Target,
  Globe,
  Building,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  LineChart
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Metric {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
}

interface Document {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  link: string;
}

export default function InvestorRelationsPage() {
  const { t } = useLanguage();

  const metrics: Metric[] = [
    {
      label: "Assets Under Management",
      value: "+",
      change: "% YoY",
      icon: DollarSign
    },
    {
      label: "Active Loan Portfolio",
      value: "+",
      change: "% YoY",
      icon: Briefcase
    },
    {
      label: "Customer Base",
      value: "+",
      change: "YoY",
      icon: Users
    },
    {
      label: "Gross NPA",
      value: "%",
      change: "% YoY",
      icon: Target
    }
  ];

  const documents: Document[] = [
    {
      title: "Annual Report 2024",
      description: "Comprehensive overview of our financial performance and business operations",
      icon: FileText,
      link: "#"
    },
    {
      title: "Quarterly Results Q3 FY24",
      description: "Latest quarterly financial results and key highlights",
      icon: BarChart,
      link: "#"
    },
    {
      title: "Investor Presentation",
      description: "Detailed presentation on company strategy and growth plans",
      icon: PieChart,
      link: "#"
    },
    {
      title: "Financial Statements",
      description: "Audited financial statements and balance sheets",
      icon: FileText,
      link: "#"
    },
    {
      title: "Corporate Governance",
      description: "Information on board composition and governance policies",
      icon: Shield,
      link: "#"
    },
    {
      title: "RBI Compliance",
      description: "NBFC registration details and regulatory compliance documents",
      icon: Award,
      link: "#"
    }
  ];

  const highlights = [
    {
      title: "Strong Growth Trajectory",
      description: "Achieved % YoY growth in loan disbursements with healthy margins",
      icon: TrendingUp
    },
    {
      title: "Technology-First Approach",
      description: "AI-powered underwriting reducing approval time to 30 seconds",
      icon: Target
    },
    {
      title: "Diversified Portfolio",
      description: "Presence across 15+ states with diverse product offerings",
      icon: Globe
    },
    {
      title: "Robust Risk Management",
      description: "Best-in-class credit appraisal and collection systems",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/90 mb-6">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ArrowRight className="w-3 h-3" />
              <Link href="/partners" className="hover:text-white transition-colors">
                Partners
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>Investor Relations</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <LineChart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Investor Relations
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Building India's most innovative and transparent NBFC platform with strong fundamentals and sustainable growth
            </p>

            {/* Features */}
            {/* <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>78% YoY Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>AAA Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>RBI Licensed</span>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-lucky"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-10 h-10 text-[#4A66FF]" />
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Business Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Investment Highlights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{highlight.title}</h3>
                      <p className="text-sm text-gray-600">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Financial Performance Chart */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lucky">
            <h2 className="text-2xl font-bold mb-6">Financial Performance Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Revenue (FY24)", value: "₹125 Cr", growth: "+68%" },
                { label: "Net Profit", value: "₹32 Cr", growth: "+82%" },
                { label: "ROE", value: "18.5%", growth: "+3.2%" }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">{item.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                  <div className="text-sm font-semibold text-green-600">{item.growth}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div> */}

        {/* Documents & Reports */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Reports & Documents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {doc.description}
                  </p>
                  <a
                    href={doc.link}
                    className="inline-flex items-center text-[#4A66FF] font-semibold text-sm hover:underline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </motion.div>
              );
            })}
          </div>
        </motion.div> */}

        {/* Corporate Information */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lucky">
            <h2 className="text-2xl font-bold mb-6">Corporate Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3 text-[#4A66FF]">Company Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">CIN:</span>
                    <span className="font-semibold">U65929MH2024PTC123456</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">NBFC Registration:</span>
                    <span className="font-semibold">B.05.12345</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">GST:</span>
                    <span className="font-semibold">27AABCL1234N1Z5</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Incorporation:</span>
                    <span className="font-semibold">January 2024</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3 text-[#4A66FF]">Credit Rating</h3>
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">CRISIL Rating</span>
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-3xl font-bold text-amber-600">AAA</div>
                  <div className="text-xs text-gray-600 mt-1">Highest Safety</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div> */}

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Building className="w-12 h-12 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Investor Relations Contact</h2>
                <div className="space-y-3">
                  <a href="mailto:investors@Quikkred.com" className="flex items-center gap-2 hover:underline">
                    <Mail className="w-5 h-5" />
                    <span>investors@Quikkred.com</span>
                  </a>
                  <a href="tel:+91-22-1234-5678" className="flex items-center gap-2 hover:underline">
                    <Phone className="w-5 h-5" />
                    <span>+91-22-1234-5678</span>
                  </a>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 mt-0.5" />
                    <span>Mon - Fri: 9:00 AM - 6:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Subscribe to Updates</h3>
                <p className="mb-4 opacity-90">
                  Get quarterly reports and important announcements directly in your inbox
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                  />
                  <button className="px-6 py-3 bg-white text-[#4A66FF] rounded-lg font-semibold hover:shadow-lg transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
