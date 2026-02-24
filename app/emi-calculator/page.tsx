"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  PieChart,
  CheckCircle,
  Home,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import LoanCalculatorAll from "@/components/homepage/loan-calculator";


export default function EMICalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-8 sm:py-10 lg:py-12">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/90 mb-4 sm:mb-6 text-xs sm:text-sm">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <ArrowRight className="w-3 h-3" />
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>EMI Calculator</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Calculator className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Loan Calculator
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl">
              Calculate your loan repayment, interest, and see exactly how much you'll receive after  Platform fees
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                <span>Visual Breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Disbursed Amount</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-[#F6F6F6]">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <LoanCalculatorAll />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="container mx-auto sm:px-6 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5 sm:mb-10"
          >
            <span className="inline-block px-4 py-2 bg-[#D3F1EB] text-[#25B181] rounded-full text-xs sm:text-sm font-semibold mb-3">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora mb-3">
              Understanding Your <span className="text-[#25B181]">Loan Calculation</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-[#25B181] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Choose Loan Amount</h3>
              <p className="text-gray-600 text-sm">Select how much you need from ₹5,000 to ₹1,00,000</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-[#25B181] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Set Tenure & Rate</h3>
              <p className="text-gray-600 text-sm">Adjust the repayment period and see the interest calculation</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-[#25B181] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">View Breakdown</h3>
              <p className="text-gray-600 text-sm">See disbursed amount, interest, and total repayment clearly</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-r from-[#25B181] to-[#51C9AF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Get Your Loan?
            </h2>
            <p className="text-white/90 mb-4 sm:mb-8 max-w-2xl mx-auto">
              Apply now and get instant approval with our AI-powered system. Money disbursed within minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={"/apply/quick"} className="w-full sm:w-auto">
                <button className="px-8 py-3 w-full bg-white text-[#25B181] border-2 border-white rounded-xl font-bold hover:shadow-lg transition-all text-sm sm:text-base">
                  Apply for Loan Now
                </button>
              </Link>
              <Link href="/about-us" className="w-full sm:w-auto">
                <button className="px-8 py-3 w-full bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-[#25B181] transition-all text-sm sm:text-base">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
