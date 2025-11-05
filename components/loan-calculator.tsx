"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, IndianRupee, TrendingUp, Percent, Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface LoanCalculatorProps {
  title?: string;
  subtitle?: string;
}

export function LoanCalculator({ title, subtitle }: LoanCalculatorProps = {}) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(7);
  const [interestRate, setInterestRate] = useState(1);

  const processingFee = amount * 0.10; // 10% processing fee
  const gst = processingFee * 0.18; // 18% GST on processing fee
  const totalProcessingFee = processingFee + gst;
  const dailyInterest = (amount * interestRate * tenure) / 100;
  const totalAmount = amount + totalProcessingFee + dailyInterest;
  const dailyEMI = totalAmount / tenure;

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#38bdf8] to-[#34d399] rounded-lg flex items-center justify-center shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title || t.calculator.title}</h3>
            <p className="text-sm text-gray-700">{subtitle || t.calculator.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>{t.calculator.loanAmount}</span>
            <span className="text-[#34d399] font-bold">₹{amount.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #34d399 0%, #34d399 ${
                ((amount - 10000) / (500000 - 10000)) * 100
              }%, #e5e7eb ${((amount - 10000) / (500000 - 10000)) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹10K</span>
            <span>₹5L</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>{t.calculator.tenure}</span>
            <span className="text-[#34d399] font-bold">{tenure} {tenure === 1 ? 'Day' : 'Days'}</span>
          </label>
          <input
            type="range"
            min="7"
            max="365"
            step="1"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #34d399 0%, #34d399 ${
                ((tenure - 7) / 358) * 100
              }%, #e5e7eb ${((tenure - 7) / 358) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>7 Days</span>
            <span>365 Days</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>{t.calculator.interestRate} (per day)</span>
            <span className="text-[#34d399] font-bold">{interestRate.toFixed(1)}%</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #34d399 0%, #34d399 ${
                ((interestRate - 0.5) / 14.5) * 100
              }%, #e5e7eb ${((interestRate - 0.5) / 14.5) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5% per day</span>
            <span>15% per day</span>
          </div>
        </div>

        <div className="border-t pt-6 space-y-3">
          <div className="bg-gradient-to-r from-[#f8fbff] to-[#ecfdf5] rounded-xl p-4 space-y-3 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t.calculator.processingFee} (10%)
              </span>
              <span className="font-semibold">₹{processingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                GST (18%)
              </span>
              <span className="font-semibold">₹{Math.round(gst).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t.calculator.totalInterest}
              </span>
              <span className="font-semibold">₹{Math.round(dailyInterest).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                {t.calculator.totalPayable}
              </span>
              <span className="font-semibold text-lg">₹{Math.round(totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-[#38bdf8] to-[#34d399] p-6 rounded-xl text-white shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <p className="text-sm opacity-90 mb-2">Daily EMI</p>
            <p className="text-4xl font-bold mb-2">₹{Math.round(dailyEMI).toLocaleString()}</p>
            <p className="text-sm opacity-90">{t.calculator.for} {tenure} {tenure === 1 ? 'Day' : 'Days'}</p>
          </motion.div>

          {/* Trust Messages */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#34d399]" />
              <span>{t.calculator.trustMessages.noHiddenCharges}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#34d399]" />
              <span>{t.calculator.trustMessages.flexibleRepayment}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#34d399]" />
              <span>{t.calculator.trustMessages.instantDisbursal}</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-gradient-to-r from-[#38bdf8] to-[#34d399] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          {t.calculator.applyNowFor} ₹{amount.toLocaleString()}
        </motion.button>

        <p className="text-center text-xs text-gray-500">
          {t.calculator.footer}
        </p>
      </div>
    </motion.div>
  );
}