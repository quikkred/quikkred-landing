"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Home,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Shield,
  CreditCard,
  BookOpen,
  FileCheck,
  Upload,
  Info,
  Lock,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  lastUpdated: string;
  downloads: number;
  icon: React.ComponentType<any>;
  isPremium: boolean;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
  color: string;
}

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories: Category[] = [
    { id: "all", name: "All Documents", icon: FileText, count: 15, color: "text-gray-600" },
    { id: "forms", name: "Application Forms", icon: FileCheck, count: 4, color: "text-blue-600" },
    { id: "guides", name: "Guides & Manuals", icon: BookOpen, count: 5, color: "text-green-600" },
    { id: "policies", name: "Policies", icon: Shield, count: 3, color: "text-purple-600" },
    { id: "templates", name: "Templates", icon: FileText, count: 3, color: "text-orange-600" }
  ];

  const documents: Document[] = [
    {
      id: "1",
      title: "Personal Loan Application Form",
      description: "Complete application form for personal loans. Fill out all required fields with accurate information.",
      category: "forms",
      fileType: "PDF",
      fileSize: "245 KB",
      lastUpdated: "2025-09-25",
      downloads: 2340,
      icon: FileCheck,
      isPremium: false,
      tags: ["application", "personal loan", "form"]
    },
    {
      id: "2",
      title: "KYC Document Checklist",
      description: "Complete list of documents required for KYC verification and loan processing.",
      category: "guides",
      fileType: "PDF",
      fileSize: "180 KB",
      lastUpdated: "2025-09-28",
      downloads: 3450,
      icon: CheckCircle,
      isPremium: false,
      tags: ["kyc", "documents", "checklist"]
    },
    {
      id: "3",
      title: "Loan Agreement Template",
      description: "Standard loan agreement template with all terms and conditions clearly outlined.",
      category: "templates",
      fileType: "PDF",
      fileSize: "320 KB",
      lastUpdated: "2025-09-20",
      downloads: 1560,
      icon: FileText,
      isPremium: false,
      tags: ["agreement", "template", "legal"]
    },
    {
      id: "4",
      title: "Privacy Policy",
      description: "Our comprehensive privacy policy detailing how we collect, use, and protect your personal information.",
      category: "policies",
      fileType: "PDF",
      fileSize: "420 KB",
      lastUpdated: "2025-09-15",
      downloads: 890,
      icon: Shield,
      isPremium: false,
      tags: ["privacy", "policy", "security"]
    },
    {
      id: "5",
      title: "EMI Payment Schedule Template",
      description: "Downloadable template to track your EMI payments and plan your monthly budget effectively.",
      category: "templates",
      fileType: "XLSX",
      fileSize: "95 KB",
      lastUpdated: "2025-09-27",
      downloads: 1980,
      icon: CreditCard,
      isPremium: false,
      tags: ["emi", "payment", "schedule"]
    },
    {
      id: "6",
      title: "Quick Start Guide for New Borrowers",
      description: "Step-by-step guide for first-time borrowers to understand the loan application process.",
      category: "guides",
      fileType: "PDF",
      fileSize: "560 KB",
      lastUpdated: "2025-09-22",
      downloads: 2890,
      icon: BookOpen,
      isPremium: false,
      tags: ["guide", "borrowers", "getting started"]
    },
    {
      id: "7",
      title: "Income Proof Declaration Form",
      description: "Declaration form for self-employed individuals to provide income proof.",
      category: "forms",
      fileType: "PDF",
      fileSize: "150 KB",
      lastUpdated: "2025-09-24",
      downloads: 1670,
      icon: FileCheck,
      isPremium: false,
      tags: ["income", "declaration", "self-employed"]
    },
    {
      id: "8",
      title: "Terms and Conditions",
      description: "Complete terms and conditions governing the use of our services and loan products.",
      category: "policies",
      fileType: "PDF",
      fileSize: "380 KB",
      lastUpdated: "2025-09-18",
      downloads: 1120,
      icon: Shield,
      isPremium: false,
      tags: ["terms", "conditions", "legal"]
    },
    {
      id: "9",
      title: "Loan Repayment Guide",
      description: "Comprehensive guide on various repayment options, prepayment, and managing your loan effectively.",
      category: "guides",
      fileType: "PDF",
      fileSize: "480 KB",
      lastUpdated: "2025-09-26",
      downloads: 2210,
      icon: BookOpen,
      isPremium: false,
      tags: ["repayment", "guide", "emi"]
    },
    {
      id: "10",
      title: "Credit Score Improvement Checklist",
      description: "Actionable checklist to help you improve your credit score systematically.",
      category: "guides",
      fileType: "PDF",
      fileSize: "220 KB",
      lastUpdated: "2025-09-29",
      downloads: 3120,
      icon: CheckCircle,
      isPremium: false,
      tags: ["credit score", "improvement", "checklist"]
    },
    {
      id: "11",
      title: "Loan Pre-Closure Form",
      description: "Form to request pre-closure or prepayment of your existing loan.",
      category: "forms",
      fileType: "PDF",
      fileSize: "125 KB",
      lastUpdated: "2025-09-23",
      downloads: 980,
      icon: FileCheck,
      isPremium: false,
      tags: ["pre-closure", "prepayment", "form"]
    },
    {
      id: "12",
      title: "Budget Planning Template",
      description: "Excel template to plan your monthly budget and track expenses alongside loan repayments.",
      category: "templates",
      fileType: "XLSX",
      fileSize: "110 KB",
      lastUpdated: "2025-09-21",
      downloads: 1540,
      icon: FileText,
      isPremium: false,
      tags: ["budget", "planning", "template"]
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (docId: string, docTitle: string) => {
    // Implement download functionality
    console.log(`Downloading document: ${docTitle}`);
    alert(`Download started for: ${docTitle}\n\nNote: This is a demo. Actual download functionality would be implemented here.`);
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
              <span>Documents</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Document Library
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl">
              Access all forms, guides, policies, and templates in one secure location
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>24/7 Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-8">

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Document Security Notice
                </h3>
                <p className="text-sm text-blue-800">
                  All documents are secured with encryption. Personal information submitted through these forms is protected according to our Privacy Policy and RBI guidelines.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lucky">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                placeholder="Search documents by name, type, or keywords..."
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-[#4A66FF] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200:bg-gray-600'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${selectedCategory === category.id ? 'text-white' : category.color}`} />
                    {category.name}
                    <span className={`ml-2 ${selectedCategory === category.id ? 'text-white/70' : 'text-gray-400'}`}>
                      ({category.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {documents.reduce((sum, doc) => sum + doc.downloads, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Access</div>
            </div>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc, index) => {
                const Icon = doc.icon;
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {doc.isPremium && (
                          <span className="px-2 py-1 bg-[#FF9C70] text-white text-xs rounded-full flex items-center">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-2 group-hover:text-[#4A66FF] transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {doc.description}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {doc.fileType}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{doc.fileSize}</span>
                        <span className="mx-2">•</span>
                        <Download className="w-3 h-3 mr-1" />
                        <span>{doc.downloads}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(doc.id, doc.title)}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-[#4A66FF] text-white rounded-lg hover:bg-[var(--royal-blue-dark)] transition-colors text-sm font-semibold"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200:bg-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Last updated</span>
                          <span>{new Date(doc.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Documents Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="text-[#4A66FF] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upload Document CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8  text-center">
            <Upload className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Need to Upload Documents?</h2>
            <p className="text-xl mb-6 opacity-90">
              Securely upload your KYC documents and application forms through your dashboard
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/documents">
                <button className="px-8 py-3 bg-white text-[#4A66FF] rounded-lg font-semibold hover:shadow-lg transition-all">
                  Go to Document Upload
                </button>
              </Link>
              <Link href="/resources/faqs">
                <button className="px-8 py-3 bg-transparent border-2 border-white  rounded-lg font-semibold hover:bg-white hover:text-[#4A66FF] transition-all">
                  Document FAQs
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Security Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start">
              <Shield className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-3">Your Documents Are Safe With Us</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>256-bit SSL encryption for all downloads</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>RBI compliant data protection</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>ISO 27001 certified security</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Secure cloud storage backup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
