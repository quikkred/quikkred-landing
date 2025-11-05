"use client";

import { motion } from "framer-motion";
import { Shield, Home, ArrowRight, AlertTriangle, Phone, Mail, Lock, Eye, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function ReportFraudPage() {
  const { t } = useLanguage();

  const fraudTypes = [
    {
      title: "Phishing Attempts",
      description: "Fake emails, SMS, or calls asking for personal information",
      icon: Mail
    },
    {
      title: "Unauthorized Access",
      description: "Suspicious login attempts or account access",
      icon: Lock
    },
    {
      title: "Identity Theft",
      description: "Someone using your identity for loan applications",
      icon: Eye
    },
    {
      title: "Fake Websites",
      description: "Fraudulent websites impersonating Quikkred",
      icon: AlertTriangle
    }
  ];

  const safetyTips = [
    "Never share your OTP, password, or PIN with anyone",
    "Always verify the website URL before entering sensitive information",
    "Quikkred will never ask for your full password or card details via email/call",
    "Be cautious of unsolicited calls or messages claiming to be from Quikkred",
    "Enable two-factor authentication for added security",
    "Regularly monitor your account for suspicious activities"
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
              <span>Report Fraud</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold font-sora">
                Report Fraud
              </h1>
            </div>

            <p className="text-xl mb-8 opacity-90 max-w-3xl">
              Your security is our priority. Report suspicious activities immediately to protect your account and help us prevent fraud.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>24/7 Fraud Helpline</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span>Secure Reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Immediate Action</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-red-900 mb-4">Emergency Fraud Helpline</h2>
                <p className="text-red-800 mb-4">
                  If you suspect fraudulent activity or have been a victim of fraud, contact us immediately:
                </p>
                <div className="space-y-3">
                  <a href="tel:1800123456" className="flex items-center gap-3 text-red-900 font-bold text-xl hover:underline">
                    <Phone className="w-6 h-6" />
                    1800-123-456 (Toll Free)
                  </a>
                  <a href="mailto:fraud@Quikkred.com" className="flex items-center gap-3 text-red-900 font-semibold hover:underline">
                    <Mail className="w-5 h-5" />
                    fraud@Quikkred.com
                  </a>
                </div>
                <p className="text-sm text-red-700 mt-4">
                  Available 24/7 • Average response time: Less than 30 minutes
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fraud Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Types of Fraud to Watch For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fraudTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">
                    {type.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Report Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lucky">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-[#006837]" />
              <h2 className="text-2xl font-bold">Submit Fraud Report</h2>
            </div>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Account/Loan ID (if applicable)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                    placeholder="ACC123456"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Type of Fraud</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]">
                  <option>Select fraud type</option>
                  <option>Phishing Attempt</option>
                  <option>Unauthorized Access</option>
                  <option>Identity Theft</option>
                  <option>Fake Website</option>
                  <option>Suspicious Call/SMS</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">When did this occur?</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Detailed Description</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="Please provide as much detail as possible about the fraudulent activity..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Evidence (Optional)</label>
                <input
                  type="file"
                  multiple
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                />
                <p className="text-xs text-gray-500 mt-2">Screenshots, emails, or any other relevant documents</p>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Submit Fraud Report
              </button>
            </form>
          </div>
        </motion.div>

        {/* Safety Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#006837] to-[#FFC107] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Safety Tips to Prevent Fraud</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="opacity-90">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
