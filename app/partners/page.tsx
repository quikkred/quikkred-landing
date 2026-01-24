'use client';

import { motion } from "framer-motion";
import {
  TrendingUp, Shield, Award, Cpu,
  Handshake, Phone, Mail, Headphones
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-8 sm:py-10 lg:py-12 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Partner With{" "}
                <span className="text-[#25B181]">QuikkRed</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
                We are revolutionizing financial services, and we believe in growing together. Whether you want to earn, empower, invest, or integrate, there's a partnership path for you.
              </p>
              <Link href="#partnership-paths">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#25B181] text-white font-semibold rounded-xl hover:bg-[#1f9a6e] transition-colors shadow-lg shadow-[#25B181]/25"
                >
                  Become a partner now
                </motion.button>
              </Link>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/Partners_our_image.jpg"
                  alt="Partner with QuikkRed"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#25B181]/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#25B181]/10 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Choose Your Partnership Path Section */}
      <section id="partnership-paths" className="bg-gray-50 py-8 sm:py-10 lg:py-12">
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
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
                className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#E8F7F3] rounded-2xl flex items-center justify-center mb-6">
                  <Handshake className="w-8 h-8 text-[#25B181]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Become a Channel Partner
                </h3>
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  Join our nationwide alliance, expand your business, and earn.
                </p>
                <Link href="/partners/channel">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[#25B181] text-white font-semibold rounded-xl hover:bg-[#1f9a6e] transition-colors"
                  >
                    Start Earning
                  </motion.button>
                </Link>
              </motion.div>

              {/* Card 2: Investor Relations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#E8F7F3] rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-[#25B181]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Investor Relations
                </h3>
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  Invest in a high-growth fintech and build a profitable portfolio.
                </p>
                <Link href="/partners/investors">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[#25B181] text-white font-semibold rounded-xl hover:bg-[#1f9a6e] transition-colors"
                  >
                    See Investment Deals
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Partner With Us?
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                Join a trusted, forward-thinking platform transforming financial services across India.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* RBI Licensed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center hover:bg-[#E8F7F3] transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <Shield className="w-8 h-8 text-[#25B181]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">RBI Licensed</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Fully regulated and compliant under RBI & NBFC norms.
                </p>
              </motion.div>

              {/* Industry Leading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center hover:bg-[#E8F7F3] transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <Award className="w-8 h-8 text-[#25B181]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Industry Leading</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Join a network at the forefront of fintech.
                </p>
              </motion.div>

              {/* Technology First */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center hover:bg-[#E8F7F3] transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <Cpu className="w-8 h-8 text-[#25B181]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Technology First</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Built on cutting-edge, secure, and scalable tech.
                </p>
              </motion.div>

              {/* 24/7 Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center hover:bg-[#E8F7F3] transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <Headphones className="w-8 h-8 text-[#25B181]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">24/7 Support</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Dedicated partner support across channels.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="flex items-center justify-center bg-[#f6f6f6] py-8 sm:py-10 lg:py-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-4 rounded-none sm:rounded-none md:rounded-2xl p-8 sm:p-12 md:p-16 lg:p-20 text-center"
          style={{
            background: "linear-gradient(180deg, #6D9DFF 0%, #415E99 100%)",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white mb-3 sm:mb-4 text-balance px-2 font-semibold"
            style={{
              fontSize: "clamp(24px, 5vw, 47px)",
              lineHeight: "130%",
              letterSpacing: "0.24px",
            }}
          >
            Ready to Partner With Us?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 text-balance px-2"
          >
            Our partnership team is here to help you get started. Reach out today!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center"
          >
            <a href="tel:+918888882222">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-11 sm:h-12 bg-white hover:bg-gray-100 text-gray-900 px-6 sm:px-8 rounded-lg font-semibold transition-colors w-full sm:w-auto text-sm sm:text-base whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </motion.button>
            </a>
            <a href="mailto:partners@quikkred.com">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-11 sm:h-12 bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 rounded-lg font-semibold transition-colors w-full sm:w-auto text-sm sm:text-base whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </motion.button>
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
