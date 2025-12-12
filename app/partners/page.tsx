'use client';

import { motion } from "framer-motion";
import {
  Users, TrendingUp, Shield, Award, Target,
  Handshake, ChevronRight, MapPin, Phone, Mail, Home
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PartnersPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
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
              Partner With QuikKred
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Join India's fastest growing NBFC network. Together, we can revolutionize financial inclusion and prosperity for millions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Choose Your Partnership Path Section */}
      <section className="bg-[#F6F6F6] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 font-sora mb-4">
                Choose Your Partnership Path
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Select the partnership model that aligns with your goals. Each path offers unique opportunities for growth and success.
              </p>
            </div>

            {/* Two Cards */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 1: Channel Partner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-[#D3F1EB] rounded-full flex items-center justify-center mb-6">
                  <Handshake className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  Become a Channel Partner
                </h3>
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  Join our network, refer clients, and earn attractive commissions on every loan.
                </p>
                <Link href="/partners/channel">
                  <button className="w-full py-4 bg-[#1ABC9C] text-white font-medium rounded-xl hover:bg-[#16a085] transition-colors">
                    Start Earning
                  </button>
                </Link>
              </motion.div>

              {/* Card 2: Investor Relations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-[#D3F1EB] rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  Investor Relations
                </h3>
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  Invest in a high-growth, tech-first NBFC with a diversified portfolio.
                </p>
                <Link href="/partners/investors">
                  <button className="w-full py-4 bg-[#1ABC9C] text-white font-medium rounded-xl hover:bg-[#16a085] transition-colors">
                    See Investment Data
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 font-sora mb-4">
                Why Partner With Us?
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                Benefits that make QuikKred the preferred partner
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#D3F1EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">RBI Licensed</h4>
                <p className="text-sm text-gray-500">
                  Fully compliant and regulated NBFC
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#D3F1EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Industry Leading</h4>
                <p className="text-sm text-gray-500">
                  Best commission rates in the market
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#D3F1EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Technology First</h4>
                <p className="text-sm text-gray-500">
                  AI-powered platform for faster processing
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#D3F1EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#1ABC9C]" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">24/7 Support</h4>
                <p className="text-sm text-gray-500">
                  Dedicated partner support team
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#F6F6F6] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-sora mb-8">
                Get In Touch
              </h2>
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#D3F1EB] rounded-full flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-[#1ABC9C]" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Call Us</h4>
                  <p className="text-gray-500">+91 88888 82222</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#D3F1EB] rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-[#1ABC9C]" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Email</h4>
                  <p className="text-gray-500">partners@quikkred.com</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#D3F1EB] rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-[#1ABC9C]" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Visit Us</h4>
                  <p className="text-gray-500">Mumbai | Delhi | Bangalore</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
