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

interface Document {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  link: string;
}

export default function InvestorRelationsPage() {
  const { t } = useLanguage();

  const metrics: { label: string; value: string }[] = [];

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
      description: "Focused on sustainable growth with healthy margins and expanding market presence.",
      icon: TrendingUp
    },
    {
      title: "Technology-First Approach",
      description: "Proprietary underwriting technology enabling quick loan approvals with superior risk assessment.",
      icon: Target
    },
    {
      title: "Diversified Portfolio",
      description: "Pan-India presence with diverse product offerings minimizing concentration risk.",
      icon: Globe
    },
    {
      title: "Robust Risk Management",
      description: "Strong credit acquisition and collection systems ensuring portfolio quality.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-[#1ABC9C] text-white py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-tight mb-6">
              Investor Relations
            </h1>
            <p className="text-sm sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Building India's most innovative and transparent NBFC platform with strong fundamentals and sustainable growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-5 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 font-sora mb-4">
                Key Metrics
              </h2>
              <p className="text-gray-500 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Real-time performance indicators showcasing our financial strength and market position.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="bg-white rounded-2xl p-6 sm:p-12 text-center border border-[#EDEDED]">
              <div className="text-xl font-semibold text-gray-400 mb-2">
                Financial Metrics
              </div>
              <div className="text-sm text-gray-500">
                Detailed financial information will be available soon. Please contact us for investor inquiries.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Highlights Section */}
      <section className="bg-[#F6F6F6] py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-5 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 font-sora mb-4">
                Investment Highlights
              </h2>
              <p className="text-gray-500 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Discover what makes Quikkred a compelling investment opportunity in India's fintech landscape.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#EDEDED] hover:shadow-lg transition-shadow"
                  >
                    <div className="w-14 h-14 bg-[#D3F1EB] rounded-full flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-[#1ABC9C]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {highlight.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* <section className="container mx-auto px-4 py-12"> */}

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

      {/* </section> */}

      {/* CTA Section */}
      <section className="px-0 sm:px-auto py-0 sm:py-10 lg:py-12">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-b from-[#6FAEFF] to-[#2E4F8E] sm:rounded-3xl px-6 sm:px-12 lg:px-16 py-8 sm:py-10 lg:py-12 text-center shadow-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-sora mb-6 leading-tight">
                Ready to Enhance Your Employee Benefits?
              </h2>
              <p className="text-white/90 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                Schedule a demo to see how Quikkred can transform your employee financial wellness program.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="w-full sm:w-auto px-8 py-4 bg-[#1B1F3B] border-2 border-solid border-[#1B1F3B] text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all">
                    Schedule a Demo
                  </button>
                </Link>
                <a href="mailto:investors@quikkred.com">
                  <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 hover:scale-105 transition-all">
                    Email Us
                  </button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
