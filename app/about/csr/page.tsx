"use client";

import { motion } from "framer-motion";
import { Heart, Home, ArrowRight, Users, GraduationCap, Leaf, HandHeart, Building, Target } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function CSRPage() {
  const { t } = useLanguage();

  const initiatives = [
    {
      title: "Financial Literacy Programs",
      description: "Empowering rural communities with financial education and digital literacy workshops",
      icon: GraduationCap,
      color: "#4A66FF",
      impact: "25,000+ people trained",
      activities: [
        "Free financial literacy workshops in rural areas",
        "Digital banking awareness programs",
        "School and college financial education sessions",
        "Women's financial empowerment seminars"
      ]
    },
    {
      title: "Environmental Sustainability",
      description: "Committed to green finance and environmental conservation initiatives",
      icon: Leaf,
      color: "#25B181",
      impact: "10,000+ trees planted",
      activities: [
        "Paperless loan processing - 100% digital",
        "Tree plantation drives across 15+ cities",
        "Solar-powered branch offices",
        "Green loan products for eco-friendly projects"
      ]
    },
    {
      title: "Community Development",
      description: "Supporting underprivileged communities with skill development and healthcare",
      icon: Users,
      color: "#FF9C70",
      impact: "5,000+ families supported",
      activities: [
        "Free skill development training programs",
        "Healthcare camps in rural areas",
        "Support for small business entrepreneurs",
        "Education scholarships for deserving students"
      ]
    },
    {
      title: "Women Empowerment",
      description: "Dedicated initiatives to promote financial inclusion and entrepreneurship among women",
      icon: HandHeart,
      color: "#4A148C",
      impact: "15,000+ women entrepreneurs",
      activities: [
        "Special loan products for women entrepreneurs",
        "Women-led business mentorship programs",
        "Financial independence workshops",
        "Support for women self-help groups (SHGs)"
      ]
    }
  ];

  const impactStats = [
    { value: "+", label: "CSR Investment", icon: Target, color: "#25B181" },
    { value: "+", label: "Villages Reached", icon: Building, color: "#4A66FF" },
    { value: "+", label: "Lives Impacted", icon: Heart, color: "#FF9C70" },
    { value: "+", label: "NGO Partners", icon: Users, color: "#4A148C" }
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
              <span>CSR Initiatives</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                CSR Initiatives
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Creating lasting social impact through responsible business practices. Our commitment extends beyond finance to building stronger communities.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Community First</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                <span>Sustainable Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Inclusive Development</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">
        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: stat.color }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Initiatives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Key Initiatives</h2>
          <div className="space-y-8">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: initiative.color }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h3 className="text-2xl font-bold mb-2 md:mb-0">{initiative.title}</h3>
                        <span
                          className="px-4 py-2 rounded-full text-sm font-bold text-white w-fit"
                          style={{ backgroundColor: initiative.color }}
                        >
                          {initiative.impact}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {initiative.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {initiative.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-2"
                              style={{ backgroundColor: initiative.color }}
                            />
                            <span className="text-sm text-gray-700">
                              {activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Vision Section */}
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
            <h2 className="text-3xl font-bold mb-6 text-center">Our CSR Vision</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Mission</h3>
                <p className="text-sm opacity-90">
                  To create sustainable social impact through financial inclusion and community development
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-2">Values</h3>
                <p className="text-sm opacity-90">
                  Integrity, sustainability, and commitment to social responsibility guide our CSR efforts
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-2">Approach</h3>
                <p className="text-sm opacity-90">
                  Collaborative partnerships with NGOs, communities, and stakeholders for maximum impact
                </p>
              </div>
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
            style={{ background: 'linear-gradient(135deg, #4A148C 0%, #F9A825 100%)' }}
          >
            <h2 className="text-2xl font-bold mb-4">Join Our CSR Initiatives</h2>
            <p className="mb-6 opacity-90">
              Partner with us to create lasting social impact. Together, we can build stronger communities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <button
                  className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#FFD600', color: '#145214' }}
                >
                  Partner With Us
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
