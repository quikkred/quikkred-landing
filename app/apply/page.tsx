"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Shield, Clock, Smartphone, CheckCircle,
  IndianRupee, Sparkles, Phone, FileText, User, CreditCard,
  AlertCircle, Percent, Calendar, Banknote, BadgeCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";


export default function ApplyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Autofill mobile if user is logged in
  useEffect(() => {
    if (user?.mobile) {
      setMobile(user.mobile);
    }
  }, [user]);

  const validateMobile = (value: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!value) {
      return "Mobile number is required";
    }
    if (!mobileRegex.test(value)) {
      return "Please enter a valid 10-digit mobile number";
    }
    return "";
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(value);
    if (mobileError) {
      setMobileError("");
    }
  };

  const handleNext = () => {
    const error = validateMobile(mobile);
    if (error) {
      setMobileError(error);
      return;
    }

    setIsLoading(true);
    // Store mobile in localStorage for apply/quick page
    localStorage.setItem('applyMobile', mobile);
    // router.push('/apply/quick');
    router.push("/apply/quick");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Instant Approval
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Short-Term Loan for <span className="text-[#25B181]">Urgent Needs</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get funds for short-term financial requirements with Quikkred&apos;s fully online application process.
            </p>
          </motion.div>

          {/* Phone Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Your Application</h2>
              <p className="text-gray-500 text-sm">Enter your mobile number to begin</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                  <Phone className="w-5 h-5" />
                  <span className="text-gray-400">+91</span>
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={handleMobileChange}
                  placeholder="Enter mobile number"
                  className={`w-full pl-24 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                    mobileError
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-[#25B181]"
                  }`}
                />
              </div>

              {mobileError && (
                <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {mobileError}
                </p>
              )}

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    Apply Now
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>

          {/* Loan Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-[#25B181]" />
              Loan Details
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
                <p className="text-lg font-bold text-gray-900">₹5,000 - ₹25,000</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Tenure</p>
                <p className="text-lg font-bold text-gray-900">Up to 30 days</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                <p className="text-lg font-bold text-gray-900">1% per day</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Loan Type</p>
                <p className="text-lg font-bold text-gray-900">Short-Term</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Repayment</p>
                <p className="text-lg font-bold text-gray-900">One-time</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Disbursement</p>
                <p className="text-lg font-bold text-gray-900">Direct Bank</p>
              </div>
            </div>
          </motion.div>

          {/* Example Calculation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Example Calculation
            </h2>
            <p className="text-gray-600 mb-4">If you borrow ₹10,000 for 10 days:</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-blue-200">
                <span className="text-gray-600">Interest (1% per day × 10 days)</span>
                <span className="font-semibold text-gray-900">₹1,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-200">
                <span className="text-gray-600">Platform Fee (10%)</span>
                <span className="font-semibold text-gray-900">₹1,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-200">
                <span className="text-gray-600">GST on Platform Fee (18%)</span>
                <span className="font-semibold text-gray-900">₹180</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-200">
                <span className="text-gray-600">Total Charges</span>
                <span className="font-semibold text-gray-900">₹2,180</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-blue-100 rounded-lg px-4 -mx-4">
                <span className="font-bold text-blue-900">Total Repayment Amount</span>
                <span className="font-bold text-blue-900 text-xl">₹12,180</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              * The above example is indicative. Final loan charges may vary based on loan duration and approval terms.
            </p>
          </motion.div>

          {/* Eligibility & Documents */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#25B181]" />
                Eligibility Criteria
              </h2>
              <ul className="space-y-3">
                {[
                  "Age: 21-55 years",
                  "Resident of India",
                  "Valid PAN & Aadhaar",
                  "Active bank account",
                  "Stable source of income"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#25B181]" />
                Documents Required
              </h2>
              <ul className="space-y-3">
                {[
                  "PAN Card",
                  "Aadhaar Card"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  Minimal documentation - Quick approval!
                </p>
              </div>
            </motion.div>
          </div>

          {/* Fees & Charges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Percent className="w-6 h-6 text-[#25B181]" />
              Fees & Charges (Transparent Disclosure)
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Percent className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Interest</p>
                  <p className="text-sm text-gray-600">1% per day</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Platform Fee</p>
                  <p className="text-sm text-gray-600">10% of loan amount</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">GST</p>
                  <p className="text-sm text-gray-600">18% on platform fee</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Late Payment</p>
                  <p className="text-sm text-gray-600">As per loan agreement</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How to Apply */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-2xl p-6 md:p-8 mb-8 text-white"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              How to Apply
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { step: "1", title: "Fill Details", desc: "Enter your basic information" },
                { step: "2", title: "Complete KYC", desc: "Verify PAN & Aadhaar" },
                { step: "3", title: "Get Funds", desc: "Receive money in your bank" }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="w-8 h-8 bg-white text-[#25B181] rounded-full flex items-center justify-center font-bold mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Responsible Lending Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Responsible Lending Notice
            </h2>
            <p className="text-amber-700 text-sm">
              This is a short-term loan product and may involve higher costs. Borrow responsibly and ensure timely repayment to avoid additional charges.
            </p>
          </motion.div>

          {/* Legal Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gray-100 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Legal Disclaimer
            </h2>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>• Quikkred does not guarantee loan approval.</li>
              <li>• Loan approval, amount, tenure, and charges are subject to eligibility checks and internal assessment.</li>
              <li>• This product is intended for short-term financial requirements only.</li>
            </ul>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            {/* <button
              onClick={handleNext}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Start Application
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button> */}

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                Instant Approval
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-500" />
                100% Secure
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                Quick Disbursal
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
