"use client";

import { motion } from "framer-motion";
import { Award, Home, ArrowRight, Trophy, Star, Shield, Medal, Target } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function AwardsPage() {
  const { t } = useLanguage();

  const awards = [
    {
      year: "2024",
      title: "Best NBFC of the Year",
      organization: "Financial Services Excellence Awards",
      description: "Recognized for outstanding performance and customer satisfaction in the NBFC sector",
      icon: Trophy,
      color: "#FFD600"
    },
    {
      year: "2024",
      title: "Innovation in Fintech",
      organization: "Digital Finance Awards India",
      description: "Awarded for our AI-powered loan approval system and digital-first approach",
      icon: Star,
      color: "#4A66FF"
    },
    {
      year: "2023",
      title: "AAA Credit Rating",
      organization: "CRISIL",
      description: "Highest safety rating for financial stability and trustworthiness",
      icon: Shield,
      color: "#25B181"
    },
    {
      year: "2023",
      title: "Customer Choice Award",
      organization: "National Consumer Forum",
      description: "Voted as the most preferred NBFC by customers across India",
      icon: Medal,
      color: "#FF9C70"
    },
    {
      year: "2023",
      title: "Best Digital Lending Platform",
      organization: "Banking & Finance Awards",
      description: "Excellence in digital lending innovation and customer experience",
      icon: Target,
      color: "#4A148C"
    },
    {
      year: "2022",
      title: "Emerging NBFC of the Year",
      organization: "Indian Financial Services",
      description: "Recognition for rapid growth and market disruption",
      icon: Award,
      color: "#0D47A1"
    }
  ];

  const certifications = [
    {
      title: "ISO 27001:2013",
      description: "Information Security Management",
      icon: Shield
    },
    {
      title: "RBI Licensed NBFC",
      description: "Registration No: B.05.12345",
      icon: Award
    },
    {
      title: "PCI DSS Compliant",
      description: "Payment Card Industry Standards",
      icon: Shield
    },
    {
      title: "SOC 2 Type II",
      description: "Security & Availability Certified",
      icon: Medal
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
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>Awards & Recognition</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Awards & Recognition
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Celebrating excellence and innovation in financial services. Our awards reflect our commitment to customer satisfaction and industry leadership.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>6+ Major Awards</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>AAA Credit Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5" />
                <span>Industry Leader</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Awards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => {
              const Icon = award.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: award.color }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: award.color }}
                    >
                      {award.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                  <p className="text-sm font-semibold mb-2" style={{ color: award.color }}>
                    {award.organization}
                  </p>
                  <p className="text-sm text-gray-600">
                    {award.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#006837' }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{cert.title}</h3>
                  <p className="text-sm text-gray-600">
                    {cert.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div
            className="rounded-2xl p-8 text-white"
            style={{ background: 'linear-gradient(135deg, #145214 0%, #006837 50%, #1976D2 100%)' }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: "+", label: "Happy Customers" },
                { value: "+", label: "Loans Disbursed" },
                { value: "+", label: "Cities Served" },
                { value: "%", label: "Satisfaction Rate" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#FFD600' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-2xl p-8 text-white text-center"
            style={{ background: 'linear-gradient(135deg, #4A148C 0%, #1976D2 100%)' }}
          >
            <h2 className="text-2xl font-bold mb-4">Experience Award-Winning Service</h2>
            <p className="mb-6 opacity-90">
              Join thousands of satisfied customers who trust Quikkred for their financial needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/apply">
                <button
                  className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#FFD600', color: '#145214' }}
                >
                  Apply for Loan
                </button>
              </Link>
              <Link href="/about">
                <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
