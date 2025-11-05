"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Award, Target, Users, TrendingUp, Shield, Heart,
  CheckCircle, Globe, Briefcase, Clock, Star, Building
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const stats = [
  { label: "Years of Excellence", value: "Since ", icon: Clock },
  { label: "Licensed by RBI", value: "", icon: Shield },
  { label: "Pan India Presence", value: "28 States", icon: Globe },
  { label: "Customer Satisfaction", value: "%", icon: Star },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make starts and ends with our customers' best interests at heart."
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Complete transparency in our dealings with no hidden charges or surprise fees."
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Leveraging cutting-edge AI technology to make lending faster and fairer."
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "Making credit accessible to every Indian, regardless of their background."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering the highest standards of service in everything we do."
  },
  {
    icon: Globe,
    title: "Social Impact",
    description: "Empowering communities and contributing to India's economic growth."
  }
];

const milestones: any[] = [
  // {
  //   year: "2024",
  //   title: "Foundation",
  //   description: "Quikkred was founded with a vision to revolutionize lending in India"
  // },
  // {
  //   year: "2024",
  //   title: "RBI License",
  //   description: "Received NBFC license from Reserve Bank of India"
  // },
  // {
  //   year: "2024",
  //   title: "AI Integration",
  //   description: "Launched India's first fully AI-powered lending platform"
  // },
  // {
  //   year: "2024",
  //   title: "Pan India Launch",
  //   description: "Expanded operations across 28 states and 8 union territories"
  // }
];

const leadership: any[] = [
  // {
  //   name: "Rajesh Kumar",
  //   role: "Chief Executive Officer",
  //   bio: "Former RBI official with 20+ years in financial services",
  //   expertise: ["Strategic Planning", "Regulatory Compliance", "Digital Transformation"]
  // },
  // {
  //   name: "Priya Sharma",
  //   role: "Chief Technology Officer",
  //   bio: "AI expert from IIT Delhi, previously at Google",
  //   expertise: ["Artificial Intelligence", "Machine Learning", "System Architecture"]
  // },
  // {
  //   name: "Amit Patel",
  //   role: "Chief Risk Officer",
  //   bio: "Risk management specialist with experience at major banks",
  //   expertise: ["Risk Management", "Credit Analysis", "Portfolio Management"]
  // },
  // {
  //   name: "Sneha Reddy",
  //   role: "Chief Operating Officer",
  //   bio: "Operations expert with background in fintech scaling",
  //   expertise: ["Operations", "Process Optimization", "Customer Experience"]
  // }
];

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sora mb-6 text-white">
              About Quikkred
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Transforming Lives Through Responsible Lending
            </p>
            <p className="text-lg leading-relaxed text-white/90">
              We are India's most trusted AI-powered NBFC, committed to making credit accessible,
              affordable, and transparent for every Indian. Our mission is to empower dreams and
              enable financial inclusion through technology and trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[rgb(var(--bg-primary))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[rgb(var(--text-primary))] mb-2">
                  {stat.value}
                </h3>
                <p className="text-[rgb(var(--text-secondary))]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-12 sm:py-16 lg:py-20 bg-[rgb(var(--bg-secondary))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-[#25B181] text-center mb-12">Our Story</h2>

            <div className="prose prose-lg mx-auto">
              <p className="text-[rgb(var(--text-secondary))] leading-relaxed mb-6">
                Quikkred was born from a simple observation: millions of Indians need quick,
                small-ticket loans for emergencies, opportunities, and dreams, but traditional
                banking systems weren't designed to serve them efficiently.
              </p>

              <p className="text-[rgb(var(--text-secondary))] leading-relaxed mb-6">
                Founded in 2024 by a team of fintech veterans and AI experts, we set out to
                build a lending platform that could make credit decisions in seconds, not days.
                By leveraging artificial intelligence and alternative data, we've created a system
                that's not just faster, but fairer and more inclusive.
              </p>

              <p className="text-[rgb(var(--text-secondary))] leading-relaxed mb-6">
                Today, we're proud to be RBI-licensed NBFC serving customers across India.
                Our AI-powered platform processes applications in 30 seconds, making us the
                fastest lending platform in the country. But speed is just the beginning -
                we're building a financial ecosystem that truly understands and serves the
                needs of modern India.
              </p>

              <div className="bg-gradient-to-br from-[#25B181] to-[#51C9AF] text-white p-8 rounded-2xl mt-8">
                <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
                <p className="text-lg text-white">
                  To be India's most trusted financial partner, making credit accessible to
                  every Indian through technology, transparency, and trust.
                </p>
              </div>

              <div className="bg-[rgb(var(--bg-primary))] p-8 rounded-2xl mt-6 shadow-card border border-[rgb(var(--border-default))]">
                <h3 className="text-2xl font-bold mb-4 text-[rgb(var(--text-primary))]">Our Mission</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#3AC6A0] flex-shrink-0 mt-1" />
                    <span className="text-[rgb(var(--text-secondary))]">
                      Provide instant, affordable credit to millions of Indians
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#3AC6A0] flex-shrink-0 mt-1" />
                    <span className="text-[rgb(var(--text-secondary))]">
                      Use AI to make lending decisions fair and unbiased
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#3AC6A0] flex-shrink-0 mt-1" />
                    <span className="text-[rgb(var(--text-secondary))]">
                      Maintain complete transparency in our operations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#3AC6A0] flex-shrink-0 mt-1" />
                    <span className="text-[rgb(var(--text-secondary))]">
                      Contribute to India's financial inclusion goals
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-12 sm:py-16 lg:py-20 bg-[rgb(var(--bg-primary))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-[rgb(var(--text-primary))]">Our Values</h2>
            <p className="text-base sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))]">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border-default))] rounded-2xl p-8 hover:shadow-card transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[rgb(var(--text-primary))]">{value.title}</h3>
                <p className="text-[rgb(var(--text-secondary))]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-12 sm:py-16 lg:py-20 bg-[rgb(var(--bg-secondary))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-[rgb(var(--text-primary))]">Our Journey</h2>
            <p className="text-base sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))]">
              Milestones in our mission to transform lending
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center gap-8 mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="flex-1">
                  <div className={`bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-default))] p-6 rounded-xl shadow-card ${
                    index % 2 === 0 ? "text-right" : "text-left"
                  }`}>
                    <span className="text-[#4A66FF] font-bold text-lg">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-3 text-[rgb(var(--text-primary))]">{milestone.title}</h3>
                    <p className="text-[rgb(var(--text-secondary))]">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-[#4A66FF] rounded-full flex-shrink-0" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-12 sm:py-16 lg:py-20 bg-[rgb(var(--bg-primary))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-[rgb(var(--text-primary))]">Leadership Team</h2>
            <p className="text-base sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))]">
              Experienced professionals driving our vision
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-[rgb(var(--text-primary))]">{leader.name}</h3>
                <p className="text-[#4A66FF] font-medium mb-3">{leader.role}</p>
                <p className="text-sm text-[rgb(var(--text-tertiary))] mb-4">{leader.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {leader.expertise.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))] rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#25B181] to-[#4A66FF] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4 text-white">
              Join Us in Our Mission
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Be part of India's financial inclusion revolution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/apply"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[#25B181] rounded-full font-semibold text-lg hover:shadow-xl transition-all"
              >
                Apply for Loan
              </motion.a>
              <motion.a
                href="/careers"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-[#25B181] transition-all"
              >
                Join Our Team
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}