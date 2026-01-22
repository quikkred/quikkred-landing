'use client';

import { motion } from "framer-motion";
import { CreditCard, FileText, Target, Shield, AlertCircle, BookOpen, Scale, RefreshCw, Building, Clock, TrendingUp, Home, Users, Percent, UserCheck, ClipboardList, DollarSign, Activity, Layers, PieChart, Droplets, BarChart3, Gauge, Umbrella, FileCheck, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function CreditPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <CreditCard className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Credit Policy
            </h1>
            <p className="text-xl">Prudent Lending &amp; Risk Management Framework</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Document Details */}
        <div className="mb-10 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            Document Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2b2b2b] leading-[1.7]">
            <div><span className="font-semibold">Title:</span> Credit Policy</div>
            <div><span className="font-semibold">Classification:</span> Internal / Board Approved</div>
            <div><span className="font-semibold">Effective Date:</span> 1st April 2025</div>
            <div><span className="font-semibold">Approved by:</span> Board of Directors</div>
          </div>
        </div>

        {/* 1. Preamble */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#25B181]" />
            1. Preamble
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            Satsai Finlease Private Limited (&quot;the Company&quot;) is registered with the Reserve Bank of India (RBI) as a Non-Banking Financial Company Base Layer (NBFC-BL) under the Scale Based Regulation (SBR) framework and is primarily engaged in the business of Pay Day Loans, Loans Against Property (LAP), EMI-based Retail Loans and Corporate Business Loans.
          </p>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            The purpose of this policy is to establish a harmonised framework for credit origination, risk control, portfolio diversification, liquidity stability and regulatory compliance in alignment with RBI Master Directions, circulars and prudential norms as amended from time to time.
          </p>
          <p className="text-[#2b2b2b] leading-[1.7]">
            The Company recognises that Pay Day Loans constitute a major portion of its loan portfolio and therefore incorporates enhanced prudential safeguards, risk-based underwriting controls and strict concentration norms specific to this segment.
          </p>
        </div>

        {/* 2. Objectives */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#25B181]" />
            2. Objectives of the Policy
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            The objectives of this policy are to:
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Establish structured and standardised credit processes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Ensure prudent credit appraisal and responsible lending</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Prevent excessive credit concentration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Maintain optimal liquidity and solvency levels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Mitigate credit, operational and liquidity risks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Align portfolio strategy with risk appetite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Strengthen governance and supervisory oversight</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Ensure full regulatory compliance</span>
            </li>
          </ul>
        </div>

        {/* Part A - Credit Policy Framework */}
        <div className="mb-10">
          <div className="bg-[#25B181]/10 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#25B181]">PART A - CREDIT POLICY FRAMEWORK</h2>
          </div>
        </div>

        {/* 3. Credit Philosophy */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#25B181]" />
            3. Credit Philosophy
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            The lending philosophy of the Company is based on responsible financial inclusion while maintaining asset quality and profitability. Lending decisions shall be guided by:
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Risk-based pricing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Conservative underwriting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Real income assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Behavioural data analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Portfolio diversification</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4">
            The Company aims to balance growth with sustainability, ensuring that credit expansion does not compromise financial stability.
          </p>
        </div>

        {/* 4. Credit Products */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#25B181]" />
            4. Credit Products
          </h2>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#25B181]" />
              4.1 Pay Day Loans
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              Short-term unsecured loans extended to individuals for emergency or immediate cash requirements, generally repayable within 15 days to 6 months.
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Home className="w-5 h-5 text-[#25B181]" />
              4.2 Loans Against Property (LAP)
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              Secured loans against residential or commercial property for personal or business purposes.
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#25B181]" />
              4.3 EMI-Based Retail Loans
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              Structured repayment loans for consumer purchase, education, medical and household needs.
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#25B181]" />
              4.4 Corporate Business Loans
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              Working capital and term loans to corporates subject to strict appraisal norms.
            </p>
          </div>
        </div>

        {/* 5. Credit Eligibility Criteria */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#25B181]" />
            5. Credit Eligibility Criteria
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            Borrowers must meet:
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Minimum age and legal capacity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Verifiable income source</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Acceptable credit bureau score</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Repayment capacity assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Compliance with KYC norms</span>
            </li>
          </ul>
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              The Company shall follow &quot;Fit and Proper&quot; borrower assessment and shall not grant loans to blacklisted or high-risk profile individuals.
            </p>
          </div>
        </div>

        {/* 6. Credit Underwriting Process */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#25B181]" />
            6. Credit Underwriting Process
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            Includes:
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Customer onboarding &amp; KYC</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Income verification &amp; bank statement analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Credit bureau analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Debt-Service Ratio evaluation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Risk grading and scorecard based evaluation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Documentation &amp; disbursement</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4 italic">
            Special due diligence shall apply for repeat borrowers and high-value loans.
          </p>
        </div>

        {/* 7. Credit Pricing & Interest Structure */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#25B181]" />
            7. Credit Pricing &amp; Interest Structure
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            Interest rates shall be determined based on:
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Cost of funds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Credit risk profile</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Portfolio concentration risk</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Market conditions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Operational costs</span>
            </li>
          </ul>
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>APR and Key Fact Sheet</strong> shall be mandatorily disclosed as per RBI Digital Lending norms.
            </p>
          </div>
        </div>

        {/* 8. Repayment & Monitoring */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#25B181]" />
            8. Repayment &amp; Monitoring
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Repayments through ECS/NACH/UPI</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Continuous monitoring of EMI track record</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Early warning signal detection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Collection escalation framework</span>
            </li>
          </ul>
        </div>

        {/* Part B - Credit Concentration Policy */}
        <div className="mb-10">
          <div className="bg-[#4A66FF]/10 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#4A66FF]">PART B - CREDIT CONCENTRATION POLICY</h2>
          </div>
        </div>

        {/* 9. Definition */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#25B181]" />
            9. Definition
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            Credit concentration risk arises when exposure to a borrower, sector or geographic cluster becomes excessive.
          </p>
        </div>

        {/* 10. Exposure Limits */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Percent className="w-6 h-6 text-[#25B181]" />
            10. Exposure Limits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-6 border-l-4 border-[#25B181]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#25B181]" />
                10.1 Single Borrower
              </h3>
              <p className="text-[#2b2b2b] leading-[1.7]">
                <strong>Not exceeding 15%</strong> of Owned Funds
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-6 border-l-4 border-[#4A66FF]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4A66FF]" />
                10.2 Group Borrower
              </h3>
              <p className="text-[#2b2b2b] leading-[1.7]">
                <strong>Not exceeding 25%</strong> of Owned Funds
              </p>
            </div>
          </div>
        </div>

        {/* 11. Product Concentration Limits & Management */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-[#25B181]" />
            11. Product Concentration Limits &amp; Management
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-[#25B181] text-white">
                  <th className="px-6 py-3 text-left font-semibold">Product</th>
                  <th className="px-6 py-3 text-left font-semibold">Max Exposure %</th>
                </tr>
              </thead>
              <tbody className="text-[#2b2b2b]">
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3">Pay Day Loans</td>
                  <td className="px-6 py-3 font-semibold">90%</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3">LAP</td>
                  <td className="px-6 py-3 font-semibold">2%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3">EMI Loans</td>
                  <td className="px-6 py-3 font-semibold">5%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-3">Corporate Loans</td>
                  <td className="px-6 py-3 font-semibold">3%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              While concentration limits reflect the existing business model and strategic focus of the Company, it is acknowledged that such high dependence on a single product category may increase portfolio vulnerability. Accordingly, the Company shall proactively undertake steps to progressively diversify its loan portfolio by expanding secured lending, retail EMI-based products and corporate business lending. Strategic initiatives shall include product innovation, targeted marketing, risk-adjusted pricing and gradual rebalancing of the portfolio to achieve a healthier and more sustainable credit mix over time.
            </p>
          </div>
        </div>

        {/* Part C - Liquidity Risk Management Framework */}
        <div className="mb-10">
          <div className="bg-[#FF9C70]/20 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#E07840]">PART C - LIQUIDITY RISK MANAGEMENT FRAMEWORK</h2>
          </div>
        </div>

        {/* 13. Liquidity Governance */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-[#25B181]" />
            13. Liquidity Governance
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            Board of Directors
          </p>
        </div>

        {/* 14. ALM Structure */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#25B181]" />
            14. ALM Structure
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Maturity profiling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Structural liquidity analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Cash flow forecasting</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4 italic">
            Time buckets as per RBI prescribed standards shall be followed strictly.
          </p>
        </div>

        {/* 15. Liquidity Monitoring Tools */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Gauge className="w-6 h-6 text-[#25B181]" />
            15. Liquidity Monitoring Tools
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Concentration of funding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Stock approach liquidity ratios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Unencumbered asset buffer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Stress testing approach</span>
            </li>
          </ul>
        </div>

        {/* 16. LCR Framework */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#25B181]" />
            16. LCR Framework
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            The Company shall maintain minimum LCR as per regulatory thresholds and maintain adequate HQLA.
          </p>
        </div>

        {/* 17. Contingency Funding Plan */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Umbrella className="w-6 h-6 text-[#25B181]" />
            17. Contingency Funding Plan
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            Includes:
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Emergency funding sources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Liquid asset monetization plan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Crisis communication mechanism</span>
            </li>
          </ul>
        </div>

        {/* Part D - Internal Controls & Governance */}
        <div className="mb-10">
          <div className="bg-[#4A66FF]/10 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#4A66FF]">PART D - INTERNAL CONTROLS &amp; GOVERNANCE</h2>
          </div>
        </div>

        {/* 18. Reporting */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#25B181]" />
            18. Reporting
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Monthly Risk Reports</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>Quarterly Liquidity Review by Board</span>
            </li>
          </ul>
        </div>

        {/* 19. Breach Management */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#25B181]" />
            19. Breach Management
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            Immediate escalation to Board and corrective plan within 30 days.
          </p>
        </div>

        {/* 20. Policy Review */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#25B181]" />
            20. Policy Review
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            This policy shall be reviewed annually or earlier if regulatory changes warrant modification.
          </p>
        </div>

        {/* Effective Date */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#25B181]" />
            Effective Date
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            This Policy shall come into effect from <strong>1st April 2025</strong> and shall supersede all previous credit-related policies.
          </p>
        </div>

        {/* Board Approval */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Building className="w-6 h-6 text-[#25B181]" />
              Board Approval
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>Approved by:</strong> Board of Directors, Satsai Finlease Private Limited
            </p>
          </div>
        </div>
      </PoliciesLayout>
    </div>
  );
}
