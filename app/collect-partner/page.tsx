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
  CreditCard,
  BarChart3,
  Award,
  Briefcase,
  ArrowRight,
  GraduationCap,
  UserCheck,
  FileCheck,
  Scale,
  Eye,
  AlertTriangle,
  Lock,
  MapPinned,
  ArrowUpRight,
  BadgeCheck,
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
  description: string;
  icon: React.ComponentType<any>;
  highlight?: string;
}

interface ScreeningStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface ComplianceRule {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function CollectPartnerPage() {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const features: Feature[] = [
    {
      title: "GPS-Verified Check-ins",
      description:
        "Automatic location verification within 50 meters of borrower address ensures authentic visits",
      icon: MapPin,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]",
    },
    {
      title: "Truecaller Login",
      description:
        "Secure instant authentication with Truecaller - no OTP needed, just one tap to login",
      icon: Shield,
      color: "text-[#4A66FF]",
      bgColor: "bg-[#E8EDFF]",
    },
    {
      title: "Real-time Case Assignment",
      description:
        "Get notified instantly when new cases are assigned with complete borrower details",
      icon: Zap,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FFE8E8]",
    },
    {
      title: "Built-in Navigation",
      description:
        "One-tap navigation to borrower location with Google Maps integration",
      icon: Navigation,
      color: "text-[#25B181]",
      bgColor: "bg-[#D3F1EB]",
    },
    {
      title: "UPI Payment Collection",
      description:
        "Generate payment links instantly and collect payments via UPI directly in the app",
      icon: CreditCard,
      color: "text-[#4A66FF]",
      bgColor: "bg-[#E8EDFF]",
    },
    {
      title: "Performance Dashboard",
      description:
        "Track your visits, collections, and earnings in real-time with detailed analytics",
      icon: BarChart3,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FFE8E8]",
    },
  ];

  const howItWorks: Step[] = [
    {
      number: "01",
      title: "Download & Register",
      description:
        "Download the app and register instantly with Truecaller verification",
      icon: Download,
    },
    {
      number: "02",
      title: "Get Case Assignments",
      description:
        "Receive collection cases assigned to your pincode areas",
      icon: Briefcase,
    },
    {
      number: "03",
      title: "Visit & Check-in",
      description:
        "Navigate to borrower location and check-in with GPS verification",
      icon: MapPin,
    },
    {
      number: "04",
      title: "Collect & Earn",
      description:
        "Collect payment, record disposition, and earn attractive incentives",
      icon: IndianRupee,
    },
  ];

  const benefits: Benefit[] = [
    {
      title: "Earn More Than Delivery",
      description:
        "Collection partners earn ₹15,000-50,000/month compared to ₹8,000-12,000 in delivery jobs",
      icon: IndianRupee,
      highlight: "₹15K-50K/mo",
    },
    {
      title: "Professional Career Growth",
      description:
        "Grow from field agent to team lead to area manager with a clear promotion path",
      icon: TrendingUp,
    },
    {
      title: "Flexible Schedule",
      description:
        "Choose your own working hours. No fixed shifts, no minimum hours — work when you want",
      icon: Clock,
    },
    {
      title: "Zero Investment Required",
      description:
        "No vehicle rental, no deposit, no uniform cost. Just bring your smartphone",
      icon: Award,
    },
    {
      title: "Weekly Payouts",
      description:
        "Guaranteed weekly settlement every Friday — no waiting until month-end",
      icon: CreditCard,
    },
    {
      title: "Training & Certification",
      description:
        "Free RBI-compliant collection training and certification to boost your career",
      icon: GraduationCap,
    },
  ];

  const screeningSteps: ScreeningStep[] = [
    {
      title: "Identity Verification",
      description: "Aadhaar + PAN verification through our secure platform",
      icon: UserCheck,
    },
    {
      title: "Background Check",
      description: "Criminal record and address verification",
      icon: Shield,
    },
    {
      title: "Reference Check",
      description: "Two personal/professional references verified",
      icon: Users,
    },
    {
      title: "Mandatory Training",
      description:
        "Online training on RBI collection guidelines and code of conduct",
      icon: GraduationCap,
    },
    {
      title: "Assessment",
      description: "Pass the collection guidelines and ethics assessment",
      icon: FileCheck,
    },
    {
      title: "30-Day Probation",
      description:
        "Supervised probation period with an assigned mentor",
      icon: Target,
    },
  ];

  const complianceRules: ComplianceRule[] = [
    {
      title: "RBI Fair Practices Code",
      description:
        "All partners must strictly follow RBI's Fair Practices Code for collection activities",
      icon: Scale,
    },
    {
      title: "No Harassment or Intimidation",
      description:
        "No threatening, abusive language, or intimidation of any kind. Zero tolerance policy",
      icon: AlertTriangle,
    },
    {
      title: "Permitted Hours Only",
      description:
        "Contact borrowers only between 8:00 AM and 7:00 PM as per RBI guidelines",
      icon: Clock,
    },
    {
      title: "Identity Disclosure",
      description:
        "Must identify yourself clearly and show your Quikkred partner ID at every visit",
      icon: BadgeCheck,
    },
    {
      title: "No Third-Party Disclosure",
      description:
        "Cannot discuss borrower's debt with family members, friends, or employer",
      icon: Eye,
    },
    {
      title: "Data Privacy & Confidentiality",
      description:
        "All borrower data is confidential, governed by the IT Act 2000. Breach leads to termination",
      icon: Lock,
    },
    {
      title: "GPS & Photo Evidence",
      description:
        "All field visits are GPS-tracked and photo-documented for transparency and accountability",
      icon: MapPinned,
    },
    {
      title: "Escalation Protocol",
      description:
        "Disputes must be escalated to the team lead — never resolved through confrontation",
      icon: ArrowUpRight,
    },
  ];

  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => {
      window.open("/downloads/quikkred-collect-v1.2.0.apk", "_blank");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1a5f4a] to-[#25B181] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                <Image
                  src="/QuikkredLogoWhite.svg"
                  alt="Quikkred"
                  width={20}
                  height={20}
                />
                Quikkred Collect Partner App
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-tight mb-6">
                Become a Collection Partner
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-xl">
                Join Quikkred&apos;s professional field collection network.
                Build a real career with flexible hours, weekly payouts, and
                growth opportunities.
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

              {/* Value Props replacing fake stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <div className="text-sm sm:text-base text-white/90 font-medium">
                    RBI Registered NBFC
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <div className="text-sm sm:text-base text-white/90 font-medium">
                    Flexible Hours
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <div className="text-sm sm:text-base text-white/90 font-medium">
                    Weekly Payouts
                  </div>
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
                <div className="w-[300px] h-[620px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-[6px] shadow-2xl ring-1 ring-white/10">
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10" />
                  <div className="w-full h-full bg-white rounded-[2.7rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="bg-[#1a5f4a] px-6 pt-8 pb-1 flex items-center justify-between text-white text-[10px]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-white/60 rounded-sm relative">
                          <div className="absolute inset-[1px] bg-white/60 rounded-[1px]" style={{ width: '70%' }} />
                        </div>
                      </div>
                    </div>
                    {/* App Header */}
                    <div className="bg-[#1a5f4a] px-5 pb-5 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                            <Image
                              src="/QuikkredLogoWhite.svg"
                              alt="Quikkred"
                              width={26}
                              height={26}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-sm">Quikkred Collect</div>
                            <div className="text-[10px] text-white/60">Field Partner App</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                          <span className="text-xs">RK</span>
                        </div>
                      </div>
                      {/* Greeting */}
                      <div className="text-white/80 text-xs">Good Morning,</div>
                      <div className="font-semibold text-base">Rahul Kumar</div>
                    </div>

                    {/* App Content */}
                    <div className="p-4 space-y-3 bg-gray-50 h-full">
                      {/* Stats Row */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="text-[10px] text-gray-400 mb-0.5">Today&apos;s Cases</div>
                          <div className="text-xl font-bold text-[#1a5f4a]">8</div>
                          <div className="text-[10px] text-green-600 font-medium">3 completed</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="text-[10px] text-gray-400 mb-0.5">Collected</div>
                          <div className="text-xl font-bold text-green-600">₹68,500</div>
                          <div className="text-[10px] text-gray-400 font-medium">Target: ₹1,00,000</div>
                        </div>
                      </div>

                      {/* Active Visit Card */}
                      <div className="bg-white rounded-xl p-3.5 shadow-sm border-l-3 border-l-[#25B181]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-[#25B181] bg-green-50 px-2 py-0.5 rounded-full">ACTIVE VISIT</span>
                          <span className="text-[10px] text-gray-400">2.3 km away</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm text-gray-900">Amit Sharma</div>
                            <div className="text-xs text-gray-500">₹25,000 • 15 DPD</div>
                          </div>
                          <div className="w-9 h-9 bg-[#1a5f4a] rounded-full flex items-center justify-center shadow-md">
                            <Navigation className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Upcoming Visit */}
                      <div className="bg-white rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">NEXT</span>
                          <span className="text-[10px] text-gray-400">4.1 km away</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm text-gray-900">Priya Patel</div>
                            <div className="text-xs text-gray-500">₹18,000 • 7 DPD</div>
                          </div>
                          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                            <Phone className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      </div>

                      {/* Earnings Banner */}
                      <div className="bg-gradient-to-r from-[#1a5f4a] to-[#25B181] rounded-xl p-3.5 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-white/70">This Week&apos;s Earnings</div>
                            <div className="font-bold text-lg">₹4,250</div>
                          </div>
                          <div className="text-[10px] text-white/80 bg-white/20 px-2 py-1 rounded-lg">Payout Friday</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Become a Collection Partner */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#1a5f4a] rounded-full text-sm font-semibold mb-4">
            Why Join Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
            Why Become a Collection Partner?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            More than just a gig — build a professional career in financial
            services
          </p>
        </motion.div>

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
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#D3F1EB] rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-[#1a5f4a]" />
                </div>
                {benefit.highlight && (
                  <div className="text-2xl font-bold text-[#1a5f4a] mb-2">
                    {benefit.highlight}
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
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
            Powerful features designed to make your collection visits efficient
            and rewarding
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
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-5`}
                >
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-[#1a5f4a] text-white py-16 sm:py-20"
      >
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

      {/* Screening & Onboarding Process */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#E8EDFF] text-[#4A66FF] rounded-full text-sm font-semibold mb-4">
            Onboarding
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
            Screening & Onboarding Process
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            We ensure every partner meets our quality and compliance standards
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {screeningSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E8EDFF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#4A66FF]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold mb-1">
                      STEP {index + 1}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
                  <span className="text-gray-600">
                    Valid Aadhaar & PAN card
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Android smartphone with internet
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Own two-wheeler for field visits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1a5f4a] rounded-full mt-2" />
                  <span className="text-gray-600">Clean criminal record</span>
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
                  <span className="text-gray-600">
                    Ex-bank/NBFC collection staff
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Field sales experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Local area knowledge in your city
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4A66FF] rounded-full mt-2" />
                  <span className="text-gray-600">
                    Good communication (Hindi + local language)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Compliance & Code of Conduct */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-4">
              Mandatory Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-4">
              Code of Conduct
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              All collection partners must adhere to RBI guidelines and our
              strict code of conduct
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-5">
            {complianceRules.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {rule.title}
                    </h3>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mt-8"
          >
            <div className="bg-[#1a5f4a]/5 border border-[#1a5f4a]/20 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-700">
                Quikkred operates under{" "}
                <span className="font-semibold">
                  Satsai Finlease Private Limited
                </span>{" "}
                (RBI Registration: B-14.01646). All collection activities are
                conducted in compliance with RBI&apos;s Fair Practices Code and
                applicable laws.
              </p>
            </div>
          </motion.div>
        </div>
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
                Download Quikkred Collect app now and start your journey as a
                collection partner
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
