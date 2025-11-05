"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  TrendingUp,
  DollarSign,
  Calendar,
  Briefcase,
  CreditCard,
  Users,
  FileText,
  Sparkles,
  Info,
  Award,
  Target,
  Shield,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface EligibilityResult {
  isEligible: boolean;
  score: number;
  maxLoanAmount: number;
  recommendedTenure: number;
  estimatedInterestRate: number;
  reasons: string[];
  improvements: string[];
}

export default function EligibilityCheckPage() {
  const { t } = useLanguage();
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    monthlyIncome: "",
    employmentType: "salaried",
    workExperience: "",
    creditScore: "",
    existingLoans: "no",
    existingEMI: "",
    loanAmount: "",
    purpose: "personal"
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEligibility = (): EligibilityResult => {
    const age = parseInt(formData.age);
    const income = parseInt(formData.monthlyIncome);
    const creditScore = parseInt(formData.creditScore);
    const experience = parseInt(formData.workExperience);
    const requestedAmount = parseInt(formData.loanAmount);
    const existingEMI = formData.existingLoans === "yes" ? parseInt(formData.existingEMI || "0") : 0;

    let score = 0;
    let maxLoanAmount = 0;
    const reasons: string[] = [];
    const improvements: string[] = [];

    // Age scoring (max 20 points)
    if (age >= 25 && age <= 45) {
      score += 20;
      reasons.push("Excellent age bracket for loan approval");
    } else if (age >= 21 && age <= 58) {
      score += 15;
      reasons.push("Age meets eligibility criteria");
    } else {
      score += 5;
      improvements.push("Age should be between 21-58 years");
    }

    // Income scoring (max 25 points)
    if (income >= 50000) {
      score += 25;
      reasons.push("Strong monthly income");
      maxLoanAmount = income * 40;
    } else if (income >= 30000) {
      score += 20;
      reasons.push("Good monthly income");
      maxLoanAmount = income * 30;
    } else if (income >= 15000) {
      score += 15;
      reasons.push("Income meets minimum criteria");
      maxLoanAmount = income * 20;
    } else {
      score += 5;
      maxLoanAmount = income * 10;
      improvements.push("Minimum monthly income should be ₹15,000");
    }

    // Credit score scoring (max 25 points)
    if (creditScore >= 750) {
      score += 25;
      reasons.push("Excellent credit score");
    } else if (creditScore >= 700) {
      score += 20;
      reasons.push("Good credit score");
    } else if (creditScore >= 650) {
      score += 15;
      reasons.push("Fair credit score");
    } else if (creditScore >= 600) {
      score += 10;
      improvements.push("Improve credit score for better terms");
    } else {
      score += 5;
      improvements.push("Credit score needs significant improvement");
    }

    // Employment type & experience (max 15 points)
    if (formData.employmentType === "salaried" && experience >= 2) {
      score += 15;
      reasons.push("Stable employment with good experience");
    } else if (formData.employmentType === "salaried" && experience >= 1) {
      score += 12;
      reasons.push("Salaried with adequate experience");
    } else if (formData.employmentType === "self-employed" && experience >= 3) {
      score += 13;
      reasons.push("Established self-employed professional");
    } else if (formData.employmentType === "self-employed") {
      score += 8;
      improvements.push("Self-employed should have at least 3 years experience");
    } else {
      score += 5;
      improvements.push("Increase work experience for better eligibility");
    }

    // Existing loans (max 15 points)
    const emiToIncomeRatio = (existingEMI / income) * 100;
    if (existingEMI === 0) {
      score += 15;
      reasons.push("No existing loan burden");
    } else if (emiToIncomeRatio < 30) {
      score += 12;
      reasons.push("Manageable existing loan burden");
    } else if (emiToIncomeRatio < 50) {
      score += 8;
      improvements.push("Existing EMI is high relative to income");
    } else {
      score += 3;
      improvements.push("High existing loan burden affects eligibility");
    }

    // Adjust max loan amount based on existing EMIs
    maxLoanAmount = maxLoanAmount * (1 - emiToIncomeRatio / 100);

    // Determine interest rate based on score
    let estimatedInterestRate = 24;
    if (score >= 80) estimatedInterestRate = 9.5;
    else if (score >= 70) estimatedInterestRate = 12;
    else if (score >= 60) estimatedInterestRate = 15;
    else if (score >= 50) estimatedInterestRate = 18;

    // Recommended tenure
    let recommendedTenure = 24;
    if (age < 35) recommendedTenure = 48;
    else if (age < 45) recommendedTenure = 36;
    else if (age < 55) recommendedTenure = 24;
    else recommendedTenure = 12;

    const isEligible = score >= 50 && income >= 15000 && age >= 21 && age <= 58;

    if (!isEligible) {
      if (income < 15000) improvements.push("Minimum income of ₹15,000 required");
      if (age < 21 || age > 58) improvements.push("Age must be between 21-58 years");
      if (score < 50) improvements.push("Overall profile needs improvement");
    }

    return {
      isEligible,
      score,
      maxLoanAmount: Math.round(maxLoanAmount),
      recommendedTenure,
      estimatedInterestRate,
      reasons,
      improvements
    };
  };

  const handleCheckEligibility = () => {
    // Validate all required fields
    if (!formData.age || !formData.monthlyIncome || !formData.workExperience ||
        !formData.creditScore || !formData.loanAmount) {
      return;
    }
    if (formData.existingLoans === "yes" && !formData.existingEMI) {
      return;
    }
    setShowResult(true);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setShowResult(false);
    setFormData({
      age: "",
      monthlyIncome: "",
      employmentType: "salaried",
      workExperience: "",
      creditScore: "",
      existingLoans: "no",
      existingEMI: "",
      loanAmount: "",
      purpose: "personal"
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const result = showResult ? calculateEligibility() : null;

  const isFormValid = () => {
    if (!formData.age || !formData.monthlyIncome || !formData.workExperience ||
        !formData.creditScore || !formData.loanAmount) {
      return false;
    }
    if (formData.existingLoans === "yes" && !formData.existingEMI) {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20" />
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
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Eligibility Check</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Check Your Eligibility
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl">
              Get instant eligibility results with our AI-powered assessment. No credit score impact, completely free.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>No Credit Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>Personalized Offers</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-2xl relative z-10">
              <h2 className="text-3xl font-bold mb-8 text-center">Enter Your Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#4A66FF] flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Personal Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Age *
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="70"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monthly Income (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      placeholder="e.g., 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Employment Type
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => updateFormData("employmentType", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    >
                      <option value="salaried">Salaried</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Work Experience (Years) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={formData.workExperience}
                      onChange={(e) => updateFormData("workExperience", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#25B181] flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Financial Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Credit Score (CIBIL) *
                    </label>
                    <input
                      type="number"
                      min="300"
                      max="900"
                      value={formData.creditScore}
                      onChange={(e) => updateFormData("creditScore", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      placeholder="e.g., 750"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Don't know? <Link href="#" className="text-[#4A66FF] hover:underline">Check now</Link>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Existing Loans?
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => updateFormData("existingLoans", "no")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                          formData.existingLoans === "no"
                            ? 'bg-[#4A66FF] text-blue shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200:bg-gray-600'
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormData("existingLoans", "yes")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                          formData.existingLoans === "yes"
                            ? 'bg-[#4A66FF] text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200:bg-gray-600'
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.existingLoans === "yes" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium mb-2">
                          Total Monthly EMI (₹) *
                        </label>
                        <input
                          type="number"
                          value={formData.existingEMI}
                          onChange={(e) => updateFormData("existingEMI", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                          placeholder="e.g., 15000"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Loan Amount Required (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => updateFormData("loanAmount", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      placeholder="e.g., 200000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Loan Purpose
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => updateFormData("purpose", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    >
                      <option value="personal">Personal Use</option>
                      <option value="medical">Medical Emergency</option>
                      <option value="education">Education</option>
                      <option value="home">Home Renovation</option>
                      <option value="business">Business</option>
                      <option value="wedding">Wedding</option>
                      <option value="travel">Travel</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Info Notice */}
              <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    This check is <strong>100% free</strong> and <strong>doesn't affect your credit score</strong>.
                    We'll provide instant personalized results based on your profile.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleCheckEligibility}
                disabled={!isFormValid()}
                whileHover={isFormValid() ? { scale: 1.02 } : {}}
                whileTap={isFormValid() ? { scale: 0.98 } : {}}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-6 h-6" />
                Check My Eligibility Now
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Results Section */}
      {showResult && (
        <section id="results-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Result Header */}
            <div className={`rounded-2xl p-8 mb-8 text-white ${
              result?.isEligible
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-orange-500 to-red-600'
            }`}>
              <div className="flex items-center justify-center mb-4">
                {result?.isEligible ? (
                  <CheckCircle className="w-16 h-16" />
                ) : (
                  <AlertCircle className="w-16 h-16" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">
                {result?.isEligible ? "Congratulations!" : "Almost There!"}
              </h2>
              <p className="text-xl text-center opacity-90">
                {result?.isEligible
                  ? "You're eligible for a loan with us"
                  : "Your profile needs some improvements"}
              </p>
            </div>

            {/* Eligibility Score */}
            <div className="bg-white rounded-2xl p-8 shadow-lucky mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Your Eligibility Score</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(result!.score / 100) * 440} 440`}
                      className={result!.score >= 70 ? "text-green-500" : result!.score >= 50 ? "text-orange-500" : "text-red-500"}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{result?.score}</div>
                      <div className="text-sm text-gray-500">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>

              {result?.isEligible && (
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-1">Max Loan Amount</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{result.maxLoanAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.estimatedInterestRate}% p.a.
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-1">Recommended Tenure</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.recommendedTenure} months
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reasons & Improvements */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {result && result.reasons.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Strong Points
                  </h3>
                  <ul className="space-y-3">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result && result.improvements.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-orange-600">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-3">
                    {result.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {result?.isEligible ? (
                <>
                  <Link href="/apply/loan" className="flex-1">
                    <button className="w-full px-8 py-4 bg-[#4A66FF] text-white rounded-lg font-semibold hover:bg-[var(--royal-blue-dark)] transition-colors">
                      Apply for Loan Now
                    </button>
                  </Link>
                  <Link href="/resources/emi-calculator" className="flex-1">
                    <button className="w-full px-8 py-4 bg-[#25B181] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      Calculate EMI
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/resources/faqs" className="flex-1">
                    <button className="w-full px-8 py-4 bg-[#4A66FF] text-white rounded-lg font-semibold hover:bg-[var(--royal-blue-dark)] transition-colors">
                      Learn More
                    </button>
                  </Link>
                  <button
                    onClick={handleReset}
                    className="flex-1 px-8 py-4 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300:bg-gray-600 transition-colors"
                  >
                    Check Again
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
