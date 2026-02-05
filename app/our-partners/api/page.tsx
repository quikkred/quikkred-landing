"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Code,
  Zap,
  Shield,
  Lock,
  Home,
  ArrowRight,
  CheckCircle,
  Terminal,
  Cloud,
  Server,
  Globe,
  BookOpen,
  Download,
  Key,
  Activity,
  Database,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface APIFeature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface APIEndpoint {
  method: string;
  endpoint: string;
  description: string;
}

export default function APIIntegrationPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "docs" | "pricing">("overview");

  const features: APIFeature[] = [
    {
      title: "RESTful API",
      description: "Clean, well-documented RESTful API with JSON responses",
      icon: Code
    },
    {
      title: "99.9% Uptime",
      description: "Enterprise-grade reliability with minimal downtime",
      icon: Activity
    },
    {
      title: "OAuth 2.0",
      description: "Secure authentication using industry-standard OAuth 2.0",
      icon: Lock
    },
    {
      title: "Real-time Webhooks",
      description: "Get instant notifications for loan status updates",
      icon: Zap
    },
    {
      title: "Rate Limiting",
      description: "Fair usage policy with generous rate limits",
      icon: RefreshCw
    },
    {
      title: "Sandbox Environment",
      description: "Test integration in a safe sandbox before going live",
      icon: Database
    },
    {
      title: "24/7 Support",
      description: "Technical support available round the clock",
      icon: Globe
    },
    {
      title: "Detailed Logging",
      description: "Complete request/response logs for debugging",
      icon: Terminal
    }
  ];

  const endpoints: APIEndpoint[] = [
    {
      method: "POST",
      endpoint: "/api/v1/loans/apply",
      description: "Submit a new loan application"
    },
    {
      method: "GET",
      endpoint: "/api/v1/loans/{id}",
      description: "Get loan application status"
    },
    {
      method: "POST",
      endpoint: "/api/v1/eligibility/check",
      description: "Check customer eligibility"
    },
    {
      method: "POST",
      endpoint: "/api/v1/documents/upload",
      description: "Upload KYC documents"
    },
    {
      method: "GET",
      endpoint: "/api/v1/loans/{id}/schedule",
      description: "Get EMI repayment schedule"
    },
    {
      method: "POST",
      endpoint: "/api/v1/webhooks/register",
      description: "Register webhook endpoints"
    }
  ];

  const sampleCode = `// Initialize API Client
const client = new QuikkredAPI({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Check Eligibility
const eligibility = await client.checkEligibility({
  name: 'John Doe',
  age: 30,
  monthlyIncome: 50000,
  employmentType: 'salaried'
});

// Apply for Loan
if (eligibility.isEligible) {
  const application = await client.applyForLoan({
    customerId: 'CUST_123',
    amount: 100000,
    tenure: 12,
    purpose: 'personal'
  });

  console.log('Application ID:', application.id);
  console.log('Status:', application.status);
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/90 mb-6">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ArrowRight className="w-3 h-3" />
              <Link href="/partners" className="hover:text-white transition-colors">
                Partners
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>API Integration</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Developer API
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-8 opacity-90 max-w-3xl">
              Integrate our loan platform into your application with our powerful and easy-to-use API
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                <span>% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>&lt;ms Response</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>256-bit Encryption</span>
              </div> */}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Server className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Zap className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">&lt;ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            {/* <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Shield className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">256-bit</div>
              <div className="text-sm text-gray-600">SSL Encryption</div>
            </div> */}
            <div className="bg-white rounded-2xl p-6 shadow-lucky text-center">
              <Globe className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">+</div>
              <div className="text-sm text-gray-600">Active Integrations</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <div className="flex justify-center gap-4 mb-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "docs", label: "Documentation" },
              { id: "pricing", label: "Pricing" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#4A66FF] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto"
          >
            {/* Features */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">API Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Code Sample */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Quick Start</h2>
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lucky overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">
                  <code>{sampleCode}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documentation Tab */}
        {/* {activeTab === "docs" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lucky mb-8">
              <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded font-semibold text-sm ${
                        endpoint.method === "POST"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="flex-1 text-sm font-mono">{endpoint.endpoint}</code>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {endpoint.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">Full Documentation</h3>
                    <p className="text-sm text-blue-800 mb-4">
                      Access complete API documentation with examples and code samples
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                      View Docs
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Download className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-900 mb-2">SDK Libraries</h3>
                    <p className="text-sm text-green-800 mb-4">
                      Download SDKs for Node.js, Python, PHP, Java, and more
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                      Download SDKs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  name: "Sandbox",
                  price: "Free",
                  features: [
                    "Unlimited API calls",
                    "Test environment",
                    "All endpoints access",
                    "Basic support"
                  ]
                },
                {
                  name: "Production",
                  price: "₹0",
                  features: [
                    "Pay only on success",
                    "No setup fees",
                    "Unlimited API calls",
                    "99.9% uptime SLA",
                    "Priority support",
                    "Dedicated account manager"
                  ],
                  popular: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  features: [
                    "Custom pricing",
                    "Dedicated infrastructure",
                    "SLA guarantees",
                    "24/7 phone support",
                    "Custom integrations"
                  ]
                }
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 shadow-sm ${
                    plan.popular ? 'ring-2 ring-[var(--royal-blue)]' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-[#4A66FF] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                      RECOMMENDED
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-[#4A66FF] mb-6">{plan.price}</div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-[#4A66FF] text-white hover:bg-[var(--royal-blue-dark)]'
                      : 'bg-gray-100 hover:bg-gray-200:bg-gray-600'
                  }`}>
                    {plan.name === "Sandbox" ? "Start Testing" : "Contact Sales"}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">Revenue Sharing Model</h3>
                  <p className="text-sm text-amber-800">
                    We only earn when you earn! Pay a small percentage on successfully disbursed loans. No upfront costs, no monthly fees, no hidden charges.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-2xl p-8 text-white text-center">
            <Key className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-sm sm:text-base lg:text-xl mb-6 opacity-90">
              Get your API keys and start integrating in minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-[#4A66FF] rounded-lg font-semibold hover:shadow-lg transition-all">
                Get API Keys
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#25B181] transition-all">
                <BookOpen className="w-5 h-5 inline mr-2" />
                View Documentation
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
