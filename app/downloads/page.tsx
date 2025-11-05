"use client";

import { motion } from "framer-motion";
import { Download, Home, ArrowRight, FileText, File, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function DownloadsPage() {
  const { t } = useLanguage();

  const categories = [
    {
      title: "Loan Application Forms",
      icon: FileText,
      documents: [
        { name: "Personal Loan Application Form", size: "245 KB", format: "PDF" },
        { name: "Salary Advance Application Form", size: "198 KB", format: "PDF" },
        { name: "Emergency Loan Application Form", size: "212 KB", format: "PDF" },
        { name: "Medical Loan Application Form", size: "225 KB", format: "PDF" }
      ]
    },
    {
      title: "KYC & Documentation",
      icon: Shield,
      documents: [
        { name: "KYC Document Checklist", size: "156 KB", format: "PDF" },
        { name: "Identity Proof Guidelines", size: "189 KB", format: "PDF" },
        { name: "Address Proof Requirements", size: "167 KB", format: "PDF" },
        { name: "Income Proof Guidelines", size: "178 KB", format: "PDF" }
      ]
    },
    {
      title: "Terms & Conditions",
      icon: File,
      documents: [
        { name: "General Terms & Conditions", size: "345 KB", format: "PDF" },
        { name: "Privacy Policy", size: "289 KB", format: "PDF" },
        { name: "Fair Practice Code", size: "312 KB", format: "PDF" },
        { name: "Interest Rate Policy", size: "267 KB", format: "PDF" }
      ]
    },
    {
      title: "Grievance & Complaints",
      icon: AlertCircle,
      documents: [
        { name: "Grievance Redressal Form", size: "198 KB", format: "PDF" },
        { name: "Complaint Registration Form", size: "176 KB", format: "PDF" },
        { name: "Escalation Process Guide", size: "223 KB", format: "PDF" },
        { name: "Ombudsman Complaint Form", size: "201 KB", format: "PDF" }
      ]
    },
    {
      title: "Loan Management",
      icon: CheckCircle,
      documents: [
        { name: "EMI Payment Options", size: "187 KB", format: "PDF" },
        { name: "Pre-closure Request Form", size: "165 KB", format: "PDF" },
        { name: "Loan Statement Request", size: "142 KB", format: "PDF" },
        { name: "NOC Request Form", size: "158 KB", format: "PDF" }
      ]
    },
    {
      title: "Other Documents",
      icon: File,
      documents: [
        { name: "Branch Locator List", size: "234 KB", format: "PDF" },
        { name: "FAQ Document", size: "412 KB", format: "PDF" },
        { name: "Company Profile", size: "1.2 MB", format: "PDF" },
        { name: "RBI Guidelines", size: "567 KB", format: "PDF" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#006837] via-[#FFC107] to-[#006837] text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
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
              <span>Download Forms</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold font-sora">
                Download Forms
              </h1>
            </div>

            <p className="text-xl mb-8 opacity-90 max-w-3xl">
              Access all necessary forms and documents for your loan application and account management.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Fillable PDFs</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Secure & Official</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All forms are in PDF format and require Adobe Acrobat Reader to open</li>
                  <li>• Please fill out the forms clearly and legibly</li>
                  <li>• Submit completed forms along with required documents at any branch or via email</li>
                  <li>• For assistance, contact our customer support at +91 88888 82222</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="space-y-8">
            {categories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * categoryIndex }}
                  className="bg-white rounded-2xl p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#006837] to-[#006837] rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {category.documents.map((doc, docIndex) => (
                      <div
                        key={docIndex}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100:bg-gray-600 transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="font-semibold text-sm">{doc.name}</h3>
                            <p className="text-xs text-gray-500">
                              {doc.format} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-[#006837] to-[#006837] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 group-hover:scale-105">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="bg-gradient-to-r from-[#006837] to-[#FFC107] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help with Forms?</h2>
            <p className="mb-6 opacity-90">
              Our customer support team is available to assist you with filling out forms and answering any questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/support" className="px-8 py-3 bg-white text-[#006837] rounded-lg font-semibold hover:shadow-lg transition-all">
                Contact Support
              </Link>
              <Link href="/resources/faqs" className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all">
                View FAQs
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
