"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle,
  FileText,
  Upload,
  UserCheck,
  CreditCard,
  Home,
  ArrowRight,
  Clock,
  Shield,
  Smartphone,
  Mail,
  Phone,
  AlertCircle,
  Info,
  Download,
  ChevronRight,
  Sparkles,
  Award,
  TrendingUp,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  details: string[];
  estimatedTime: string;
}

interface Document {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function HowToApplyPage() {
  const { t } = useLanguage();
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const applicationSteps: Step[] = [
    {
      number: 1,
      title: "Check Eligibility",
      description: "Verify if you meet our basic eligibility criteria",
      icon: UserCheck,
      details: [
        "Age: 21-58 years",
        "Monthly income: Minimum ₹15,000",
        "Employment: Salaried or Self-employed",
        "Credit score: 600+ (preferred 750+)",
        "Valid Indian citizenship"
      ],
      estimatedTime: "2 minutes"
    },
    {
      number: 2,
      title: "Fill Application Form",
      description: "Complete our simple online application form",
      icon: FileText,
      details: [
        "Personal information (Name, DOB, Address)",
        "Employment details (Company, Income, Experience)",
        "Loan requirements (Amount, Purpose, Tenure)",
        "Bank account details",
        "Emergency contact information"
      ],
      estimatedTime: "5-7 minutes"
    },
    {
      number: 3,
      title: "Upload Documents",
      description: "Submit required documents digitally",
      icon: Upload,
      details: [
        "Identity proof (Aadhaar, PAN Card)",
        "Address proof (Utility bills, Rental agreement)",
        "Income proof (Salary slips, Bank statements, ITR)",
        "Employment proof (Offer letter, ID card)",
        "Photograph (Recent passport size)"
      ],
      estimatedTime: "5-10 minutes"
    },
    {
      number: 4,
      title: "AI Verification",
      description: "Our AI system processes and verifies your application",
      icon: Sparkles,
      details: [
        "Instant document verification using OCR",
        "Credit score check with bureaus",
        "Income and employment verification",
        "Fraud detection screening",
        "Risk assessment analysis"
      ],
      estimatedTime: "30 seconds"
    },
    {
      number: 5,
      title: "Get Approval",
      description: "Receive instant loan approval decision",
      icon: CheckCircle,
      details: [
        "Real-time approval notification",
        "Loan amount and interest rate confirmation",
        "EMI schedule details",
        "Terms and conditions review",
        "Digital loan agreement signing"
      ],
      estimatedTime: "1 minute"
    },
    {
      number: 6,
      title: "Receive Funds",
      description: "Money disbursed directly to your bank account",
      icon: CreditCard,
      details: [
        "Instant transfer to verified bank account",
        "SMS and email confirmation",
        "Loan agreement copy sent",
        "EMI schedule PDF",
        "Access to online loan management portal"
      ],
      estimatedTime: "Within 30 minutes"
    }
  ];

  const requiredDocuments: Document[] = [
    {
      name: "Identity Proof",
      description: "Aadhaar Card, PAN Card, Voter ID, or Passport",
      icon: UserCheck
    },
    {
      name: "Address Proof",
      description: "Utility bills, Rental agreement, or Aadhaar Card",
      icon: Home
    },
    {
      name: "Income Proof",
      description: "Last 3 months salary slips or 2 years ITR for self-employed",
      icon: DollarSign
    },
    {
      name: "Bank Statements",
      description: "Last 3-6 months bank account statements",
      icon: CreditCard
    },
    {
      name: "Employment Proof",
      description: "Offer letter, ID card, or Business registration",
      icon: Award
    },
    {
      name: "Photograph",
      description: "Recent passport size color photograph",
      icon: UserCheck
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header Section */}
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
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>How to Apply</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                How to Apply for a Loan
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Get your loan approved in 6 simple steps with our AI-powered instant approval system
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>6 Simple Steps</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>100% Paperless</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>30 Second Approval</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">30 Sec</div>
              <div className="text-sm text-gray-600">Approval Time</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Paperless & Secure</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Smartphone className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Online Access</div>
            </div>
          </div>
        </motion.div>

        {/* Application Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-12">Application Process</h2>
          <div className="space-y-6">
            {applicationSteps.map((step, index) => {
              const Icon = step.icon;
              const isExpanded = selectedStep === step.number;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedStep(isExpanded ? null : step.number)}
                    className="w-full p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                          {step.number}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                              <Icon className="w-5 h-5 text-[#4A66FF]" />
                              {step.title}
                            </h3>
                            <p className="text-gray-600">
                              {step.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {step.estimatedTime}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>

                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Required Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-12">Required Documents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requiredDocuments.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{doc.name}</h3>
                  <p className="text-sm text-gray-600">
                    {doc.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link href="/resources/documents">
              <button className="inline-flex items-center px-6 py-3 bg-[#4A66FF] text-white rounded-lg font-semibold hover:bg-[var(--royal-blue-dark)] transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Download Document Checklist
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Important Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 mb-3">Important Tips for Faster Approval</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Ensure all documents are clear, legible, and not expired</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Provide accurate information matching your documents</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Upload documents in PDF or JPG format (max 5MB each)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Have a stable internet connection during application</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Keep your mobile number active for OTP verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Application Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-12">Ways to Apply</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Online Portal</h3>
              <p className="text-sm text-gray-600 mb-4">
                Apply through our website with instant approval
              </p>
              <Link href="/apply/loan">
                <button className="w-full px-4 py-2 bg-[#4A66FF] text-white rounded-lg font-semibold hover:bg-[var(--royal-blue-dark)] transition-colors">
                  Apply Now
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Call our support team for assisted application
              </p>
              <a href="tel:1800-123-4567">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Call Now
                </button>
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send your queries and we'll guide you through
              </p>
              <a href="mailto:support@quikkred.com">
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Email Us
                </button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8 text-white text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-sm sm:text-base lg:text-xl mb-6 opacity-90">
              Complete your loan application in just 15 minutes and get instant approval
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resources/eligibility-check">
                <button className="px-8 py-3 bg-white text-[#4A66FF] rounded-lg font-semibold hover:shadow-lg transition-all">
                  Check Eligibility First
                </button>
              </Link>
              <Link href="/apply/loan">
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#4A66FF] transition-all">
                  Start Application
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* FAQ Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-[#4A66FF] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Have Questions?</h3>
            <p className="text-gray-600 mb-4">
              Check our comprehensive FAQ section for answers to common questions
            </p>
            <Link href="/resources/faqs">
              <button className="px-6 py-3 bg-[#4A66FF] text-white rounded-lg font-semibold hover:bg-[var(--royal-blue-dark)] transition-colors">
                View FAQs
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
