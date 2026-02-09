"use client";

import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Target,
  Home,
  ArrowRight,
  Phone,
  Mail,
  Trophy,
  Zap,
  Shield,
  BarChart,
  Globe,
  Handshake,
  GraduationCap,
  Headphones,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface EarningTier {
  target: string;
  commission: string;
  bonus: string;
}

export default function ChannelPartnersPage() {
  const { t } = useLanguage();

  const benefits: Benefit[] = [
    {
      title: "High Commission & Payouts",
      description: "Earn up to 2% commission on every loan disbursed with quick weekly payouts",
      icon: DollarSign,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Real-time Dashboard",
      description: "Track applications, approvals, and earnings instantly with our advanced dashboard",
      icon: BarChart,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Dedicated Support",
      description: "Personal relationship manager for all your queries and support needs 24/7",
      icon: Headphones,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Training & Certification",
      description: "Free comprehensive training programs and certification for you and your team",
      icon: GraduationCap,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Pan-India Coverage",
      description: "Operate from anywhere in India with our fully digital platform and support",
      icon: Globe,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Zero Investment",
      description: "Join our network with no upfront costs, hidden charges, or minimum targets",
      icon: Wallet,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    }
  ];

  const earningTiers: EarningTier[] = [
    { target: "₹0 – ₹10 Lakh", commission: "1.5%", bonus: "₹5,000" },
    { target: "₹10 – ₹25 Lakh", commission: "2.0%", bonus: "₹15,000" },
    { target: "₹25 – ₹50 Lakh", commission: "2.5%", bonus: "₹40,000" },
    { target: "₹50 Lakh+", commission: "3.0%", bonus: "₹1,00,000" }
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
              Become a Quikkred Channel Partner
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Earn attractive commissions by helping your network get the financial help they need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Transparent & Rewarding Earnings Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-sm font-semibold mb-4">
              Commission Structure
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Transparent & Rewarding Earnings
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Clear commission structure with performance bonuses to maximize your earning potential
            </p>
          </div>

          {/* Commission Table - Clean Minimal Design */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#F5F5F5]">
              <div className="grid grid-cols-3">
                <div className="px-4 sm:px-6 py-4 sm:py-5 text-left">
                  <span className="text-sm sm:text-base font-bold text-gray-700">Monthly Target</span>
                </div>
                <div className="px-4 sm:px-6 py-4 sm:py-5 text-center">
                  <span className="text-sm sm:text-base font-bold text-gray-700">Commission Rate</span>
                </div>
                <div className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                  <span className="text-sm sm:text-base font-bold text-gray-700">Monthly Bonus</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div>
              {earningTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`grid grid-cols-3 ${index !== earningTiers.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="px-4 sm:px-6 py-5 sm:py-6 text-left">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {tier.target}
                    </span>
                  </div>
                  <div className="px-4 sm:px-6 py-5 sm:py-6 text-center">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {tier.commission}
                    </span>
                  </div>
                  <div className="px-4 sm:px-6 py-5 sm:py-6 text-right">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {tier.bonus}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Example Calculation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 bg-gradient-to-r from-[#E8EDFF] to-[#D3F1EB] border-l-4 border-[#4A66FF] p-4 sm:p-6 rounded-xl"
          >
            <p className="text-sm sm:text-base text-gray-700">
              <span className="font-bold text-[#4A66FF]">Example:</span> If you facilitate loans worth ₹25 lakhs in a month at 2.0% commission rate, you'll earn{" "}
              <span className="font-bold text-[#25B181]">₹50,000</span> in commission +{" "}
              <span className="font-bold text-[#25B181]">₹15,000</span> bonus ={" "}
              <span className="font-bold text-[#25B181] text-lg">₹65,000 total!</span>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-2 bg-[#E8EDFF] text-[#4A66FF] rounded-full text-sm font-semibold mb-4">
              Partner Benefits
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Join a network that values your success with comprehensive support and industry-leading benefits
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className={`w-14 h-14 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Contact / Questions Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#4A66FF] to-[#6D90FF] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
                Have Questions?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-95 max-w-xl mx-auto">
                Speak with our partnership team to learn more about becoming a QuikKred Channel Partner
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+918888882222">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#4A66FF] rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Us
                  </button>
                </a>
                <a href="mailto:partners@quikkred.com">
                  <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[#4A66FF] transition-all flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Us
                  </button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-8 sm:h-12" />
    </div>
  );
}
