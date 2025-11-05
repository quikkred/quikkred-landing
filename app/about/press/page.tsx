"use client";

import { motion } from "framer-motion";
import { Newspaper, Home, ArrowRight, Download, ExternalLink, Calendar, FileText, Video, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PressPage() {
  const { t } = useLanguage();

  const pressReleases = [
    {
      date: "October 15, 2024",
      title: "Quikkred Crosses ₹500 Crore Milestone in Loan Disbursements",
      excerpt: "Leading NBFC achieves significant growth milestone, serving over 50,000 customers across 15+ cities",
      category: "Company News",
      color: "#25B181"
    },
    {
      date: "September 28, 2024",
      title: "AI-Powered Loan Approval System Reduces Processing Time to 30 Seconds",
      excerpt: "Revolutionary technology enables instant loan approvals with 99.2% accuracy rate",
      category: "Technology",
      color: "#4A66FF"
    },
    {
      date: "September 10, 2024",
      title: "Quikkred Awarded 'Best NBFC of the Year 2024'",
      excerpt: "Recognized for outstanding performance and customer satisfaction at Financial Services Excellence Awards",
      category: "Awards",
      color: "#FFD600"
    },
    {
      date: "August 22, 2024",
      title: "New Branch Expansion in Tier 2 Cities Announced",
      excerpt: "Strategic expansion to bring financial services to underserved markets across India",
      category: "Expansion",
      color: "#FF9C70"
    },
    {
      date: "August 5, 2024",
      title: "Partnership with Leading Banks for Co-Lending Products",
      excerpt: "Collaboration to enhance credit availability and offer competitive interest rates",
      category: "Partnership",
      color: "#4A148C"
    },
    {
      date: "July 18, 2024",
      title: "CSR Initiative: 10,000 Trees Planted Across 15 Cities",
      excerpt: "Environmental sustainability drive as part of corporate social responsibility",
      category: "CSR",
      color: "#25B181"
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo Pack",
      description: "High-resolution logos in various formats",
      type: "Images",
      icon: ImageIcon,
      size: "2.5 MB"
    },
    {
      title: "Brand Guidelines",
      description: "Complete brand identity and usage guidelines",
      type: "PDF",
      icon: FileText,
      size: "1.8 MB"
    },
    {
      title: "Company Fact Sheet",
      description: "Key statistics and company information",
      type: "PDF",
      icon: FileText,
      size: "450 KB"
    },
    {
      title: "Executive Photos",
      description: "High-resolution leadership team photos",
      type: "Images",
      icon: ImageIcon,
      size: "5.2 MB"
    }
  ];

  const mediaContact = {
    name: "Priya Sharma",
    title: "Head of Communications",
    email: "media@Quikkred.com",
    phone: "+91-22-1234-5690"
  };

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
              <span>Press & Media</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Press & Media
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Latest news, press releases, and media resources about Quikkred's journey in transforming financial services.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                <span>Latest Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Media Kit</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Press Releases</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Press Releases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Recent Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: release.color, color: 'white' }}
                      >
                        {release.category}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {release.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#006837] transition-colors">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {release.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        className="flex items-center gap-2 text-sm font-semibold hover:underline"
                        style={{ color: release.color }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Read Full Release
                      </button>
                      <button
                        className="flex items-center gap-2 text-sm font-semibold hover:underline"
                        style={{ color: release.color }}
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Media Kit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Media Kit</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaKit.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#1976D2' }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.type}</span>
                    <span>{item.size}</span>
                  </div>
                  <button
                    className="mt-4 w-full py-2 rounded-lg font-semibold text-white hover:shadow-md transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#006837' }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Media Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-2xl p-8 text-white"
            style={{ background: 'linear-gradient(135deg, #145214 0%, #006837 50%, #1976D2 100%)' }}
          >
            <h2 className="text-2xl font-bold mb-6">Media Inquiries</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4">Contact Person</h3>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{mediaContact.name}</p>
                  <p className="opacity-90">{mediaContact.title}</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4">Get In Touch</h3>
                <div className="space-y-2">
                  <a href={`mailto:${mediaContact.email}`} className="flex items-center gap-2 hover:underline">
                    <FileText className="w-4 h-4" />
                    {mediaContact.email}
                  </a>
                  <a href={`tel:${mediaContact.phone}`} className="flex items-center gap-2 hover:underline">
                    <FileText className="w-4 h-4" />
                    {mediaContact.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-90">
                For press inquiries, interview requests, or additional information, please contact our media team. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
