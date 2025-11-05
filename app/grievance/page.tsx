"use client";

import { motion } from "framer-motion";
import { Shield, Home, ArrowRight, Clock, CheckCircle, FileText, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function GrievancePage() {
  const { t } = useLanguage();

  const grievanceTypes = [
    {
      title: "Loan Application Issues",
      description: "Problems with loan application process or approval",
      icon: FileText
    },
    {
      title: "Disbursement Delays",
      description: "Issues related to loan amount disbursement",
      icon: Clock
    },
    {
      title: "Interest Rate Concerns",
      description: "Questions about interest rates or charges",
      icon: Shield
    },
    {
      title: "Customer Service",
      description: "Complaints about customer service experience",
      icon: User
    }
  ];

  const resolutionProcess = [
    {
      step: "1",
      title: "Submit Complaint",
      description: "Fill out the grievance form with details"
    },
    {
      step: "2",
      title: "Acknowledgement",
      description: "Receive ticket number within 24 hours"
    },
    {
      step: "3",
      title: "Investigation",
      description: "Our team reviews your complaint"
    },
    {
      step: "4",
      title: "Resolution",
      description: "Get resolution within 7 working days"
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
              <span>Grievance Redressal</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Grievance Redressal
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Your concerns matter to us. We are committed to resolving your grievances promptly and fairly.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>24-48 Hour Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>7 Day Resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Confidential Process</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Grievance Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-12">Types of Grievances</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {grievanceTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <Icon className="w-10 h-10 text-[#25B181] mb-4" />
                  <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">
                    {type.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Resolution Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-12">Resolution Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resolutionProcess.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
                {index < resolutionProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#25B181] to-[#51C9AF]" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Complaint Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lucky">
            <h2 className="text-2xl font-bold mb-6">Submit Your Grievance</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
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
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Loan ID (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                    placeholder="LN123456"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Grievance Type</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]">
                  <option>Select grievance type</option>
                  <option>Loan Application Issues</option>
                  <option>Disbursement Delays</option>
                  <option>Interest Rate Concerns</option>
                  <option>Customer Service</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="Please describe your grievance in detail..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Submit Grievance
              </button>
            </form>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Alternative Contact Methods</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="opacity-90">grievance@Quikkred.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <p className="opacity-90">+91 88888 82222</p>
                  <p className="text-sm opacity-75">Mon-Sat: 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
