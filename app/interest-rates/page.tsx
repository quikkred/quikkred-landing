"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Search,
  Filter,
  Home,
  ArrowRight,
  DollarSign,
  Calendar,
  Award,
  Info,
  CheckCircle,
  AlertCircle,
  Target,
  Users,
  Briefcase,
  CreditCard,
  Clock,
  ArrowUpDown,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface LoanProduct {
  id: string;
  name: string;
  category: string;
  minRate: number;
  maxRate: number;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  processingFee: string;
  icon: React.ComponentType<any>;
  description: string;
  features: string[];
  idealFor: string;
}

interface RateFactors {
  factor: string;
  impact: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function InterestRatesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rate");

  const categories = [
    { id: "all", name: "All Products" },
    { id: "personal", name: "Personal Loans" },
    { id: "business", name: "Business Loans" },
    { id: "emergency", name: "Emergency Loans" },
    { id: "special", name: "Special Offers" }
  ];

  const loanProducts: LoanProduct[] = [
    {
      id: "1",
      name: "Payday Loan",
      category: "personal",
      minRate: 1,
      maxRate: 1,
      minAmount: 10000,
      maxAmount: 500000,
      minTenure: 7,
      maxTenure: 90,
      processingFee: "Platform Fee 10% + GST 18%",
      icon: Award,
      description: "Quick cash before your payday with transparent fees",
      features: [
        "30-second AI approval",
        "Money in 30 minutes",
        "No collateral required",
        "No prepayment penalty"
      ],
      idealFor: "Salaried professionals aged 21-60 years"
    },
    {
      id: "2",
      name: "Salary Advance",
      category: "personal",
      minRate: 1,
      maxRate: 1,
      minAmount: 10000,
      maxAmount: 200000,
      minTenure: 7,
      maxTenure: 30,
      processingFee: "Platform Fee 10% + GST 18%",
      icon: Users,
      description: "Get advance on your salary instantly",
      features: [
        "Instant approval for salaried",
        "Same-day disbursal",
        "Repay on next payday",
        "100% digital process"
      ],
      idealFor: "Salaried employees with regular income"
    },
    {
      id: "3",
      name: "Emergency Fund",
      category: "emergency",
      minRate: 1,
      maxRate: 1,
      minAmount: 10000,
      maxAmount: 200000,
      minTenure: 7,
      maxTenure: 90,
      processingFee: "Platform Fee 10% + GST 18%",
      icon: AlertCircle,
      description: "24/7 support for urgent financial needs",
      features: [
        "Round the clock availability",
        "Instant disbursal",
        "Minimal documentation",
        "Medical emergencies covered"
      ],
      idealFor: "Anyone with urgent cash requirements"
    },
    {
      id: "4",
      name: "Festival Advance",
      category: "special",
      minRate: 1,
      maxRate: 1,
      minAmount: 10000,
      maxAmount: 100000,
      minTenure: 15,
      maxTenure: 60,
      processingFee: "Platform Fee 10% + GST 18%",
      icon: Target,
      description: "Celebrate every festival without financial worry",
      features: [
        "Quick approval",
        "Flexible repayment",
        "All festivals covered",
        "No prepayment charges"
      ],
      idealFor: "Everyone during festival season"
    }
  ];

  const rateFactors: RateFactors[] = [
    {
      factor: "Credit Score",
      impact: "High Impact",
      description: "Higher credit scores (750+) qualify for lower interest rates. Good payment history is crucial.",
      icon: Award
    },
    {
      factor: "Income Level",
      impact: "Medium Impact",
      description: "Higher monthly income demonstrates better repayment capacity, leading to favorable rates.",
      icon: DollarSign
    },
    {
      factor: "Employment Type",
      impact: "Medium Impact",
      description: "Salaried employees from reputed companies often get better rates than self-employed individuals.",
      icon: Briefcase
    },
    {
      factor: "Loan Amount",
      impact: "Low Impact",
      description: "Larger loan amounts may attract slightly better rates due to economies of scale.",
      icon: TrendingUp
    },
    {
      factor: "Loan Tenure",
      impact: "Medium Impact",
      description: "Shorter tenures typically have lower rates. Longer tenures mean higher total interest.",
      icon: Calendar
    },
    {
      factor: "Existing Relationship",
      impact: "Low Impact",
      description: "Existing customers with good track record may receive preferential interest rates.",
      icon: Users
    }
  ];

  const filteredProducts = loanProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "rate") return a.minRate - b.minRate;
    if (sortBy === "amount") return b.maxAmount - a.maxAmount;
    return 0;
  });

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
              <span>Interest Rates</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Percent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Interest Rates & Charges
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl">
              Transparent pricing: 1% per day interest + 10% platform fee + 18% GST
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span>1% Per Day Interest</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>No Hidden Charges</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>RBI Registered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* Rate Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-8 sm:mb-12"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <TrendingDown className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">1%</div>
                <div className="text-sm opacity-90">Flat Interest</div>
              </div>
              <div>
                <DollarSign className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">10%</div>
                <div className="text-sm opacity-90">Platform Fee</div>
              </div>
              <div className="text-white">
                <Clock className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-3xl font-bold mb-1">30 Sec</h3>
                <p className="text-sm opacity-90">Approval Time</p>
              </div>
              <div className="text-white">
                <DollarSign className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">₹5L</div>
                <div className="text-sm opacity-90">Max Loan Amount</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto mb-8 sm:mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lucky">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent"
                placeholder="Search loan products..."
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
              {/* Category Scroll Container */}
              <div className="relative flex items-center gap-2 flex-1 w-full overflow-hidden">
                <div className="flex-shrink-0">
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>

                {/* Scrollable Area with Fade Mask */}
                <div className="relative flex-1 overflow-hidden">
                  <div
                    className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-1"
                    style={{ maskImage: 'linear-gradient(to right, white 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, white 85%, transparent 100%)' }}
                  >
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${selectedCategory === category.id
                            ? 'bg-[#4A66FF] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#4A66FF] focus:outline-none transition-shadow cursor-pointer"
                >
                  <option value="rate">Sort by Rate</option>
                  <option value="amount">Sort by Amount</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loan Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-8 sm:mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Available Loan Products</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sortedProducts.map((product, index) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-lg flex items-center justify-center mr-4">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-[#4A66FF] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>

                    {/* Rate Display */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
                          <div className="text-2xl font-bold text-green-600">
                            {product.minRate}% - {product.maxRate}%
                          </div>
                          <div className="text-xs text-gray-500">per annum</div>
                        </div>
                        <TrendingDown className="w-8 h-8 text-green-600" />
                      </div>
                    </div>

                    {/* Loan Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Loan Amount</div>
                        <div className="font-semibold">
                          ₹{(product.minAmount / 1000).toFixed(0)}K - ₹{(product.maxAmount / 100000).toFixed(0)}L
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Tenure</div>
                        <div className="font-semibold">
                          {product.minTenure} - {product.maxTenure} months
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Processing Fee</div>
                        <div className="font-semibold">{product.processingFee}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Ideal For</div>
                        <div className="font-semibold text-xs">{product.idealFor.slice(0, 20)}...</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Key Features:</div>
                      <ul className="space-y-1">
                        {product.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3">
                      <Link href="/apply/quick" className="flex-1">
                        <button className="w-full px-4 py-2 bg-[#4A66FF] text-white rounded-lg text-sm font-semibold hover:bg-[var(--brand-green)] transition-colors duration-300">
                          Apply Now
                        </button>
                      </Link>
                      <Link href="/emi-calculator">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200:bg-gray-600 transition-colors">
                          Calculate EMI
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Factors Affecting Interest Rates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-6xl mx-auto mb-8 sm:mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Factors Affecting Your Interest Rate</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rateFactors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{factor.factor}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${factor.impact === "High Impact"
                        ? "bg-red-100 text-red-700"
                        : factor.impact === "Medium Impact"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                        }`}>
                        {factor.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {factor.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto mb-8 sm:mb-16"
        >
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Important Information</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All interest rates are subject to change based on RBI guidelines and internal policies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Final rate will be determined after complete profile evaluation by our AI system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No hidden charges - all fees clearly disclosed before loan approval</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>GST @ 18% applicable on  Platform fees and other charges</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-2xl p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready to Get the Best Rate?</h2>
            <p className="text-sm sm:text-xl mb-6 opacity-90">
              Check your eligibility and discover your personalized interest rate
            </p>
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/eligibility-check">
                <button className="px-8 py-3 bg-white text-[#4A66FF] hover:bg-[#4A66FF] hover:text-white hover:border-[#4A66FF] duration-300 border-2 border-white border-solid rounded-lg font-semibold hover:shadow-lg transition-all w-full">
                  Check Eligibility
                </button>
              </Link>
              <Link href="/apply/quick">
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#4A66FF] duration-300 transition-all w-full">
                  Apply Now
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
