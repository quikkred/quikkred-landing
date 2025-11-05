"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Building,
  Users,
  Shield,
  TrendingUp,
  Home,
  ArrowRight,
  CheckCircle,
  Zap,
  Award,
  DollarSign,
  Clock,
  Target,
  Briefcase,
  Phone,
  Mail,
  FileText,
  Heart,
  Wallet,
  Star
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function CorporateTieupsPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    companySize: "",
    industry: "",
    message: ""
  });

  const benefits: Benefit[] = [
    {
      title: "Employee Welfare",
      description: "Provide instant financial assistance to your employees during emergencies",
      icon: Heart
    },
    {
      title: "Zero Cost",
      description: "No setup fees, no annual charges. Completely free for your organization",
      icon: DollarSign
    },
    {
      title: "Instant Approval",
      description: "Your employees get loan approval in just 30 seconds",
      icon: Zap
    },
    {
      title: "Salary Advance",
      description: "Offer salary advance facility with automatic EMI deduction",
      icon: Wallet
    },
    {
      title: "Dedicated Support",
      description: "Assigned relationship manager for your organization",
      icon: Users
    },
    {
      title: "Custom Solutions",
      description: "Tailored loan products based on your organization's needs",
      icon: Target
    },
    {
      title: "Digital Platform",
      description: "Seamless integration with your HR systems",
      icon: Briefcase
    },
    {
      title: "Employee Retention",
      description: "Improve employee satisfaction and reduce attrition",
      icon: Award
    }
  ];

  const features: Feature[] = [
    {
      title: "White-label Solutions",
      description: "Branded loan application portal for your employees",
      icon: Star
    },
    {
      title: "Flexible Repayment",
      description: "EMI deduction directly from salary or custom payment options",
      icon: Clock
    },
    {
      title: "Bulk Processing",
      description: "Process multiple loan applications simultaneously",
      icon: FileText
    },
    {
      title: "Compliance Management",
      description: "Full compliance with labor laws and RBI guidelines",
      icon: Shield
    }
  ];

  const industries = [
    "IT/Software",
    "Manufacturing",
    "Healthcare",
    "Education",
    "Retail",
    "Banking & Finance",
    "Telecommunications",
    "Hospitality",
    "Real Estate",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Corporate tie-up application:", formData);
    alert("Thank you for your interest! Our corporate relations team will contact you within 24 hours.");
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
              <span>Corporate Tie-ups</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Corporate Partnerships
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Empower your employees with instant financial solutions through our corporate tie-up program
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Employee Welfare</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>Zero Cost Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>+ Employees Served</span>
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
              <Building className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">+</div>
              <div className="text-sm text-gray-600">Partner Companies</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">+</div>
              <div className="text-sm text-gray-600">Employees Served</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <DollarSign className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">+</div>
              <div className="text-sm text-gray-600">Loans Disbursed</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
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
          <h2 className="text-3xl font-bold text-center mb-12">Benefits for Your Organization</h2>
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

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Partnership Agreement", desc: "Sign a simple MOU with us" },
              { step: 2, title: "Employee Onboarding", desc: "We onboard your employees digitally" },
              { step: 3, title: "Loan Application", desc: "Employees apply through dedicated portal" },
              { step: 4, title: "Quick Disbursal", desc: "Instant approval and fund transfer" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Form */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lucky">
            <h2 className="text-3xl font-bold text-center mb-8">Partner With Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="Your designation"
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
                    placeholder="company@email.com"
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
                  <label className="block text-sm font-medium mb-2">Company Size *</label>
                  <select
                    required
                    value={formData.companySize}
                    onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  >
                    <option value="">Select company size</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Industry *</label>
                <select
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  placeholder="Any specific requirements or questions"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </motion.div> */}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8 text-white text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready to Enhance Employee Welfare?</h2>
            <p className="text-sm sm:text-base lg:text-xl mb-6 opacity-90">
              Let's discuss how we can create a customized solution for your organization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:1800-123-4567">
                <button className="px-8 py-3 bg-white text-[#4A66FF] rounded-lg font-semibold hover:shadow-lg transition-all">
                  <Phone className="w-5 h-5 inline mr-2" />
                  Schedule Call
                </button>
              </a>
              <a href="mailto:corporate@Quikkred.com">
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
