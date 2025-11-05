'use client';

import { motion } from "framer-motion";
import {
  Users, Building, TrendingUp, Shield, Award, Target,
  Handshake, ChevronRight, MapPin, Phone, Mail
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PartnersPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/90 mb-6">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span>Partners</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl lg:text-6xl font-bold font-sora">
                Partner With Quikkred
              </h1>
            </div>

            <p className="text-xl mb-8 opacity-90 max-w-3xl">
              Join India's fastest growing NBFC network. Together, we can revolutionize
              financial inclusion and prosperity for millions.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Fastest Growing Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Industry Leading Benefits</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Fully Regulated & Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">

        {/* Partner Types */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 font-sora">Partnership Opportunities</h2>
          <p className="text-lg text-gray-600">
            Multiple ways to collaborate and grow together
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* DSA Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="w-12 h-12 text-[#25B181] mb-4" />
              <h3 className="text-2xl font-bold mb-4">DSA Partners</h3>
              <p className="text-gray-600 mb-6">
                Become a Direct Selling Agent and earn attractive commissions on every loan.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#25B181]" />
                  <span>High commission rates</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#25B181]" />
                  <span>Real-time tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#25B181]" />
                  <span>Training & support</span>
                </li>
              </ul>
              <Link href="/partners/dsa">
                <button className="w-full py-3 bg-[#25B181] text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                  Become a DSA Partner
                </button>
              </Link>
            </motion.div>

            {/* Corporate Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Building className="w-12 h-12 text-[#4A66FF] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Corporate Partners</h3>
              <p className="text-gray-600 mb-6">
                Offer employee loans and financial wellness programs for your workforce.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#4A66FF]" />
                  <span>Employee benefits</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#4A66FF]" />
                  <span>Salary advance loans</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#4A66FF]" />
                  <span>Custom programs</span>
                </li>
              </ul>
              <Link href="/partners/corporate">
                <button className="w-full py-3 bg-[#4A66FF] text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                  Corporate Partnership
                </button>
              </Link>
            </motion.div>

            {/* Investor Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <TrendingUp className="w-12 h-12 text-[#FF9C70] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Investors</h3>
              <p className="text-gray-600 mb-6">
                Invest in India's financial inclusion story with attractive returns.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#FF9C70]" />
                  <span>Secured investments</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#FF9C70]" />
                  <span>Regular returns</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#FF9C70]" />
                  <span>Transparent reporting</span>
                </li>
              </ul>
              <Link href="/partners/investors">
                <button className="w-full py-3 gradient-gold text-white rounded-lg font-semibold hover:opacity-90 transition">
                  Explore Investment
                </button>
              </Link>
            </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 font-sora">Why Partner With Us?</h2>
          <p className="text-lg text-gray-600">
            Benefits that make Quikkred the preferred partner
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#25B181]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#25B181]" />
              </div>
              <h4 className="font-semibold mb-2">RBI Licensed</h4>
              <p className="text-sm text-gray-600">
                Fully compliant and regulated NBFC
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#4A66FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#4A66FF]" />
              </div>
              <h4 className="font-semibold mb-2">Industry Leading</h4>
              <p className="text-sm text-gray-600">
                Best commission rates in the market
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#FF9C70]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#FF9C70]" />
              </div>
              <h4 className="font-semibold mb-2">Technology First</h4>
              <p className="text-sm text-gray-600">
                AI-powered platform for faster processing
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">
                Dedicated partner support team
              </p>
            </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-white rounded-2xl p-8 shadow-lucky"
        >
          <h2 className="text-3xl font-bold mb-8 font-sora">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-[#25B181] mb-2" />
                <h4 className="font-semibold mb-1">Call Us</h4>
                <p className="text-gray-600">+91 88888 82222</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-[#4A66FF] mb-2" />
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-gray-600">partners@Quikkred.com</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 text-[#FF9C70] mb-2" />
                <h4 className="font-semibold mb-1">Visit Us</h4>
                <p className="text-gray-600">Mumbai | Delhi | Bangalore</p>
              </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}