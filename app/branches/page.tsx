"use client";

import { motion } from "framer-motion";
import { MapPin, Home, ArrowRight, Phone, Mail, Clock, Navigation } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useState } from "react";
import { COMPANY_ADDRESS } from "@/lib/constants/companyInfo";

export default function BranchesPage() {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState("all");

  const branches = [
    {
      city: "Delhi",
      name: "New Delhi Head Office",
      address: COMPANY_ADDRESS,
      phone: "+91-11-4567-8900",
      email: "delhi@Quikkred.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM",
      isHeadOffice: true
    },
    {
      city: "Mumbai",
      name: "Mumbai Branch",
      address: "Level 15, One World Center, Tower 2A, Jupiter Mill Compound, Senapati Bapat Marg, Lower Parel, Mumbai - 400013",
      phone: "+91-22-4567-8900",
      email: "mumbai@Quikkred.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    },
    // {
    //   city: "Bangalore",
    //   name: "Bangalore Branch",
    //   address: "789 MG Road, Bangalore - 560001",
    //   phone: "+91-80-3456-7890",
    //   email: "bangalore@Quikkred.com",
    //   hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    // },
    // {
    //   city: "Hyderabad",
    //   name: "Hyderabad Branch",
    //   address: "321 HITEC City, Hyderabad - 500081",
    //   phone: "+91-40-4567-8901",
    //   email: "hyderabad@Quikkred.com",
    //   hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    // },
    // {
    //   city: "Pune",
    //   name: "Pune Branch",
    //   address: "654 Koregaon Park, Pune - 411001",
    //   phone: "+91-20-5678-9012",
    //   email: "pune@Quikkred.com",
    //   hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    // },
    // {
    //   city: "Chennai",
    //   name: "Chennai Branch",
    //   address: "987 Anna Salai, Chennai - 600002",
    //   phone: "+91-44-6789-0123",
    //   email: "chennai@Quikkred.com",
    //   hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    // }
  ];

  const cities = ["all", ...new Set(branches.map(b => b.city))];
  const filteredBranches = selectedCity === "all"
    ? branches
    : branches.filter(b => b.city === selectedCity);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span className="text-white">Branch Locator</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Find Our Branches
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 text-white/90 max-w-3xl">
              Visit our branches across India for personalized assistance and expert financial guidance.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                <span>15+ Cities</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span>Extended Hours</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Navigation className="w-5 h-5" />
                <span>Easy Navigation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {/* City Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold mb-4">Filter by City</h2>
            <div className="flex flex-wrap gap-3">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${selectedCity === city
                      ? "bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {city === "all" ? "All Branches" : city}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Branches Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {filteredBranches.map((branch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-all relative"
              >
                {branch.isHeadOffice && (
                  <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white text-xs font-bold rounded-full">
                      Head Office
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#1F8F68] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{branch.name}</h3>
                    <p className="text-sm text-[#25B181] font-semibold">{branch.city}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{branch.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${branch.phone}`} className="text-sm text-[#25B181] hover:underline">
                      {branch.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${branch.email}`} className="text-sm text-[#25B181] hover:underline">
                      {branch.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{branch.hours}</p>
                  </div>
                </div>

                <button className="mt-4 w-full py-3 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Can't Find a Branch Near You?</h2>
            <p className="mb-6 opacity-90">
              Contact our customer support team, and we'll help you find the nearest service point or arrange a visit.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+918888882222" className="px-8 py-3 bg-white text-[#25B181] rounded-lg font-semibold hover:shadow-lg transition-all">
                Call Us
              </a>
              <Link href="/contact" className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all">
                Contact Form
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
