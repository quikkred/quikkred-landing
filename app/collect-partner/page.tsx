"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Smartphone,
  Shield,
  IndianRupee,
  Target,
  Clock,
  CheckCircle,
  Download,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Zap,
  Navigation,
  Camera,
  CreditCard,
  BarChart3,
  Award,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Benefit {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
}

export default function CollectPartnerPage() {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const features: Feature[] = [
    {
      title: "GPS-Verified Check-ins",
      description: "Automatic location verification within 50 meters of borrower address ensures authentic visits",
      icon: MapPin,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "Truecaller Login",
      description: "Secure instant authentication with Truecaller - no OTP needed, just one tap to login",
      icon: Shield,
      color: "text-[#4A66FF]",
      bgColor: "bg-[#E8EDFF]"
    },
    {
      title: "Real-time Case Assignment",
      description: "Get notified instantly when new cases are assigned with complete borrower details",
      icon: Zap,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FFE8E8]"
    },
    {
      title: "Built-in Navigation",
      description: "One-tap navigation to borrower location with Google Maps integration",
      icon: Navigation,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]"
    },
    {
      title: "UPI Payment Collection",
      description: "Generate payment links instantly and collect payments via UPI directly in the app",
      icon: CreditCard,
      color: "text-[#4A66FF]",
      bgColor: "bg-[#E8EDFF]"
    },
    {
      title: "Performance Dashboard",
      description: "Track your visits, collections, and earnings in real-time with detailed analytics",
      icon: BarChart3,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FFE8E8]"
    }
  ];

  const howItWorks: Step[] = [
    {
      number: "01",
      title: "Download & Register",
      description: "Download the app and register instantly with Truecaller verification",
      icon: Download
    },
    {
      number: "02",
      title: "Get Case Assignments",
      description: "Receive collection cases assigned to your pincode areas",
      icon: Briefcase
    },
    {
      number: "03",
      title: "Visit & Check-in",
      description: "Navigate to borrower location and check-in with GPS verification",
      icon: MapPin
    },
    {
      number: "04",
      title: "Collect & Earn",
      description: "Collect payment, record disposition, and earn attractive incentives",
      icon: IndianRupee
    }
  ];

  const benefits: Benefit[] = [
    { title: "Per Visit Incentive", value: "₹100-500", icon: IndianRupee },
    { title: "Collection Bonus", value: "Up to 2%", icon: TrendingUp },
    { title: "Weekly Payouts", value: "Every Friday", icon: Clock },
    { title: "No Investment", value: "Zero Cost", icon: Award }
  ];

  const handleDownload = () => {
    setDownloadStarted(true);
    // In production, this would be a link to the actual APK download
    // For now, we'll show a message
    setTimeout(() => {
      window.open('/downloads/quikkred-collect-v1.1.0.apk', '_blank');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1a5f4a] to-[#25B181] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                Quikkred Collect Partner App
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-tight mb-6">
                Become a Collection Partner
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-xl">
                Join India's fastest growing field collection network. Earn attractive incentives by helping borrowers repay their loans.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a5f4a] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="w-6 h-6" />
                  {downloadStarted ? "Starting Download..." : "Download App"}
                </motion.button>
                <Link href="#how-it-works">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">500+</div>
                  <div className="text-white/80 text-sm">Active Partners</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">₹2Cr+</div>
                  <div className="text-white/80 text-sm">Collected Monthly</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">95%</div>
                  <div className="text-white/80 text-sm">Partner Satisfaction</div>
                </div>
              </div>
            </motion.div>

            {/* App Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                {/* Phone Mockup */}
                <div className="w-[280px] h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* App Screen Preview */}
                    <div className="bg-[#1a5f4a] p-6 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold">Q</span>
                        </div>
                        <div>
                          <div className="font-bold">Quikkred Collect</div>
                          <div className="text-xs text-white/70">Field Partner App</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-100 rounded-xl p-4">
                        <div className="text-xs text-gray-500 mb-1">Today's Cases</div>
                        <div className="text-2xl font-bold text-[#1a5f4a]">5</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                        <div className="text-xs text-gray-500 mb-1">Amount Collected</div>
                        <div className="text-xl font-bold text-green-600">₹45,000</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">Active Visit</div>
                            <div className="text-xs text-gray-500">Rajesh Kumar - ₹25,000</div>
                          </div>
                          <div className="w-10 h-10 bg-[#1a5f4a] rounded-full flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Earning Potential */}
      <section className="container mx-auto px-4 py-12 sm:py-16 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-12 h-12 bg-[#D3F1EB] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#1a5f4a]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1a5f4a] mb-1">{benefit.value}</div>
                <div className="text-sm text-gray-600">{benefit.title}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#1a5f4a] rounded-full text-sm font-semibold mb-4">
            App Features
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
            Everything You Need in One App
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Powerful features designed to make your collection visits efficient and rewarding
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
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
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#1a5f4a] text-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              How It Works
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
              Start earning in 4 simple steps
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-white/30" />
                  )}

                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                      <Icon className="w-10 h-10 text-white" />
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[#1a5f4a] font-bold text-sm">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-[#E8EDFF] text-[#4A66FF] rounded-full text-sm font-semibold mb-4">
              Eligibility
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Who Can Join?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Basic Requirements
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">Age 21 years or above</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">Valid Aadhaar & PAN card</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">Android smartphone with internet</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">Two-wheeler for field visits</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4A66FF]" />
                Ideal Candidates
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">Ex-bank/NBFC collection executives</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">Field sales professionals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">Delivery executives</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">Anyone looking for flexible income</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Download CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#1a5f4a] to-[#25B181] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-95 max-w-xl mx-auto">
                Download Quikkred Collect app now and start your journey as a collection partner
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-10 py-5 bg-white text-[#1a5f4a] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
              >
                <Download className="w-6 h-6" />
                Download APK (81 MB)
              </motion.button>

              <p className="text-white/70 text-sm mt-4">
                Android 8.0+ required • Truecaller app needed for login
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-sora mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-8">
              Our partnership team is here to help you get started
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919311913854">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#1a5f4a] text-white rounded-xl font-semibold hover:bg-[#25B181] transition-all flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  +91 93119 13854
                </button>
              </a>
              <a href="mailto:collect@quikkred.in">
                <button className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  collect@quikkred.in
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-8 sm:h-12" />
    </div>
  );
}
