"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Target,
  Home,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Gift,
  Trophy,
  Zap,
  Shield,
  BarChart,
  Globe,
  Handshake
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface EarningTier {
  loans: string;
  commission: string;
  bonus: string;
}

export default function ChannelPartnersPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    experience: "",
    message: ""
  });

  const benefits: Benefit[] = [
    {
      title: "High Commission Rates",
      description: "Earn up to 2% commission on every loan disbursed through your network",
      icon: DollarSign
    },
    {
      title: "Quick Payouts",
      description: "Receive your commissions within 7 days of loan disbursement",
      icon: Zap
    },
    {
      title: "Marketing Support",
      description: "Get complete marketing materials, collaterals, and digital assets",
      icon: Target
    },
    {
      title: "Training & Certification",
      description: "Free training programs and certification for you and your team",
      icon: Award
    },
    {
      title: "Dedicated Support",
      description: "Personal relationship manager for all your queries and support needs",
      icon: Users
    },
    {
      title: "Real-time Dashboard",
      description: "Track applications, approvals, and earnings in real-time",
      icon: BarChart
    },
    {
      title: "Zero Investment",
      description: "Join our network with no upfront costs or hidden charges",
      icon: Shield
    },
    {
      title: "Pan-India Coverage",
      description: "Operate from anywhere in India with our digital platform",
      icon: Globe
    }
  ];

  const earningTiers: EarningTier[] = [
    { loans: "1-10 loans/month", commission: "1.0%", bonus: "₹0" },
    { loans: "11-25 loans/month", commission: "1.25%", bonus: "₹5,000" },
    { loans: "26-50 loans/month", commission: "1.5%", bonus: "₹15,000" },
    { loans: "51-100 loans/month", commission: "1.75%", bonus: "₹40,000" },
    { loans: "100+ loans/month", commission: "2.0%", bonus: "₹1,00,000" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Channel partner application:", formData);
    alert("Thank you for your interest! Our team will contact you within 24 hours.");
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
              <Link href="/partners" className="hover:text-white transition-colors">
                Partners
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>Channel Partners</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Become a Channel Partner
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Join India's fastest-growing NBFC network and earn attractive commissions by helping people access quick loans
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>Up to % Commission</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>+ Active Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>7 Days Payout</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">+</div>
              <div className="text-sm text-gray-600">Active Partners</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <DollarSign className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">+</div>
              <div className="text-sm text-gray-600">Earnings Paid</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">30 Sec</div>
              <div className="text-sm text-gray-600">Approval Time</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Trophy className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">%</div>
              <div className="text-sm text-gray-600">Max Commission</div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Why Partner With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Earning Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Earning Structure</h2>
          <div className="bg-white rounded-2xl shadow-lucky overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Monthly Target</th>
                  <th className="px-6 py-4 text-left">Commission Rate</th>
                  <th className="px-6 py-4 text-left">Monthly Bonus</th>
                </tr>
              </thead>
              <tbody>
                {earningTiers.map((tier, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium">{tier.loans}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                        {tier.commission}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {tier.bonus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Example:</strong> If you facilitate 30 loans worth ₹50 lakhs in a month at 1.5% commission rate, you'll earn <strong>₹75,000</strong> in commission + <strong>₹15,000</strong> bonus = <strong>₹90,000 total!</strong>
            </p>
          </div> */}
        </motion.div>

        {/* Application Form */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lucky">
            <h2 className="text-3xl font-bold text-center mb-8">Apply Now</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company/Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Location/City *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="Your city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience in Finance *</label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  placeholder="Tell us about your network and why you want to partner with us"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Submit Application
              </button>
            </form>
          </div>
        </motion.div> */}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8 text-white text-center">
            <Phone className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-sm sm:text-base lg:text-xl mb-6 opacity-90">
              Speak with our partnership team to learn more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:1800-123-4567">
                <button className="px-8 py-3 bg-white text-[#4A66FF] rounded-lg font-semibold hover:shadow-lg transition-all">
                  <Phone className="w-5 h-5 inline mr-2" />
                  Call Us
                </button>
              </a>
              <a href="mailto:partners@Quikkred.com">
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#25B181] transition-all">
                  <Mail className="w-5 h-5 inline mr-2" />
                  Email Us
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
