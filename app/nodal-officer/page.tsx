"use client";

import { motion } from "framer-motion";
import { User, Home, ArrowRight, Mail, Phone, MapPin, Clock, Shield, FileText } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function NodalOfficerPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#006837] via-[#FFC107] to-[#006837] text-white py-12 sm:py-16 lg:py-20">
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
              <span>Nodal Officer</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Nodal Officer
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Our designated Nodal Officer is available to assist with escalated grievances and ensure prompt resolution of your concerns.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>RBI Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Confidential Handling</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Nodal Officer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lucky">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#006837] to-[#006837] rounded-2xl flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Mr. Rajesh Kumar</h2>
                <p className="text-lg text-[#006837] font-semibold mb-4">
                  Nodal Officer - Customer Grievances
                </p>
                <p className="text-gray-600">
                  As per RBI guidelines, our Nodal Officer is responsible for handling customer complaints and ensuring timely resolution of all escalated matters.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-6 h-6 text-[#006837] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Email Address</h3>
                  <a href="mailto:nodal@Quikkred.com" className="text-[#006837] hover:underline">
                    nodal@Quikkred.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-6 h-6 text-[#006837] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Phone Number</h3>
                  <a href="tel:+912212345678" className="text-[#006837] hover:underline">
                    +91-22-1234-5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-6 h-6 text-[#006837] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Office Address</h3>
                  <p className="text-sm text-gray-600">
                    Quikkred Finance Ltd.<br />
                    123 Business Hub, Mumbai - 400001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <Clock className="w-6 h-6 text-[#006837] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Working Hours</h3>
                  <p className="text-sm text-gray-600">
                    Monday - Friday<br />
                    10:00 AM - 5:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* When to Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-12">When to Contact the Nodal Officer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Unresolved Complaints",
                description: "If your complaint was not resolved by customer service within the stipulated timeframe"
              },
              {
                title: "Escalation Required",
                description: "When you need to escalate an issue that requires senior management attention"
              },
              {
                title: "Serious Grievances",
                description: "For complaints of serious nature involving misconduct or malpractice"
              },
              {
                title: "No Response Received",
                description: "If you did not receive a response to your initial complaint within 7 working days"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Principal Nodal Officer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#006837] to-[#FFC107] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Principal Nodal Officer</h2>
            <p className="mb-6 opacity-90">
              If you are not satisfied with the resolution provided by the Nodal Officer, you may contact our Principal Nodal Officer:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold mb-2">Ms. Priya Sharma</h3>
                <p className="text-sm opacity-90">Chief Compliance Officer</p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>principal.nodal@Quikkred.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91-22-1234-5679</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
