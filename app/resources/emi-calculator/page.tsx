"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calculator,
  TrendingUp,
  PieChart,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Home,
  ArrowRight,
  InfoIcon
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  interestPercentage: number;
}

interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function EMICalculatorPage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(24);
  const [showAmortization, setShowAmortization] = useState(false);

  // Calculate EMI and other details
  const calculateEMI = (): EMIResult => {
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = tenure;

    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    const interestPercentage = (totalInterest / totalPayment) * 100;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestPercentage: Math.round(interestPercentage * 100) / 100
    };
  };

  // Generate amortization schedule
  const generateAmortization = (): AmortizationEntry[] => {
    const schedule: AmortizationEntry[] = [];
    const monthlyRate = interestRate / 12 / 100;
    const emi = calculateEMI().emi;
    let balance = loanAmount;

    for (let month = 1; month <= tenure; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance = balance - principalPayment;

      schedule.push({
        month,
        emi,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(Math.max(0, balance))
      });
    }

    return schedule;
  };

  const result = calculateEMI();
  const amortizationSchedule = generateAmortization();

  const resetCalculator = () => {
    setLoanAmount(500000);
    setInterestRate(12);
    setTenure(24);
    setShowAmortization(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-12 sm:py-16 lg:py-20">
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
                EMI Calculator
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl">
              Calculate your monthly EMI, total interest, and get a detailed amortization schedule
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                <span>Visual Breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Amortization Schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-8">

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lucky"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-2 text-[#4A66FF]" />
              Loan Details
            </h2>

            <div className="space-y-8">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Amount
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>₹50K</span>
                    <span>₹50L</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl font-bold text-[#4A66FF]">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Interest Rate (% per annum)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="8"
                    max="24"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>8%</span>
                    <span>24%</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl font-bold text-[#25B181]">
                    {interestRate}%
                  </span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tenure (Months)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>6M</span>
                    <span>60M</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl font-bold text-[#FF9C70]">
                    {tenure} Months
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({(tenure / 12).toFixed(1)} years)
                  </span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetCalculator}
                className="w-full flex items-center justify-center px-4 py-3  text-gray-700 rounded-lg hover:bg-gray-200:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Calculator
              </button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* EMI Result Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lucky">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-[#25B181]" />
                EMI Breakdown
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--royal-blue-light)] rounded-xl text-white">
                  <p className="text-sm opacity-90">Monthly EMI</p>
                  <p className="text-2xl font-bold">₹{result.emi.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-[var(--emerald-green)] to-[var(--emerald-dark)] rounded-xl text-white">
                  <p className="text-sm opacity-90">Total Interest</p>
                  <p className="text-2xl font-bold">₹{result.totalInterest.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Payment</span>
                  <span className="text-xl font-bold">₹{result.totalPayment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Interest Percentage</span>
                  <span className="text-lg font-semibold text-[#FF9C70]">{result.interestPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-lucky">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-[#FF9C70]" />
                Payment Breakdown
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#4A66FF] rounded mr-3"></div>
                    <span className="font-medium">Principal Amount</span>
                  </div>
                  <span className="font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#25B181] rounded mr-3"></div>
                    <span className="font-medium">Total Interest</span>
                  </div>
                  <span className="font-bold">₹{result.totalInterest.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Quick Apply CTA */}
            <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8 ">
              <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
              <p className="mb-4 opacity-90">Get instant approval with our AI-powered system</p>
              <Link href="/apply">
                <button className="w-full-[var(--royal-blue)] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Apply for Loan
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Amortization Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-2xl p-8 shadow-lucky"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Download className="w-6 h-6 mr-2 text-[#4A66FF]" />
              Amortization Schedule
            </h2>
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200:bg-gray-600 transition-colors"
            >
              {showAmortization ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Schedule
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Schedule
                </>
              )}
            </button>
          </div>

          {showAmortization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2">Month</th>
                    <th className="text-right py-3 px-2">EMI</th>
                    <th className="text-right py-3 px-2">Principal</th>
                    <th className="text-right py-3 px-2">Interest</th>
                    <th className="text-right py-3 px-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.map((entry) => (
                    <tr key={entry.month} className="border-b border-gray-100 hover:bg-gray-50:bg-gray-700/50">
                      <td className="py-2 px-2 font-medium">{entry.month}</td>
                      <td className="py-2 px-2 text-right">₹{entry.emi.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right text-[#4A66FF]">₹{entry.principal.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right text-[#25B181]">₹{entry.interest.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right font-medium">₹{entry.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>

        {/* Compare Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-[var(--gold)] to-[var(--rose-gold)] rounded-2xl p-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-xl mb-6 opacity-90">
              Our financial experts can help you find the perfect loan structure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-3 bg-white text-[#4A66FF] rounded-lg font-semibold hover:shadow-lg transition-all">
                  Talk to Expert
                </button>
              </Link>
              <Link href="/resources/faqs">
                <button className="px-8 py-3 bg-transparent border-2 border-white font-semibold hover:bg-white hover:text-[#4A66FF] transition-all">
                  View FAQs
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}