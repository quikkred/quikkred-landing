'use client';

import { motion } from "framer-motion";
import { CreditCard, FileText, Target, Shield, AlertCircle, BookOpen, Scale, RefreshCw, Building, Clock, TrendingUp, Home, Users, Percent, UserCheck, ClipboardList, DollarSign, Activity, Layers, PieChart, Droplets, BarChart3, Gauge, Umbrella, FileCheck, Calendar } from "lucide-react";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function CreditPolicyPage() {
  const { t } = useLanguage();
  const cp = t?.policies?.creditPolicy
  const sections = t?.policies?.creditPolicy

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
              {cp?.hero?.title || "Credit Policy"}
            </h1>
            <p className="text-xl">{cp?.hero?.subtitle[0] || "Prudent Lending"} &amp; {cp?.hero?.subtitle[1] || "Risk Management Framework"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Document Details */}
        <div className="mb-10 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {cp?.documentDetails?.title || "Document Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2b2b2b] leading-[1.7]">
            <div><span className="font-semibold">{cp?.documentDetails?.fields?.title?.label || "Title:"}</span> {cp?.documentDetails?.fields?.title?.value || "Credit Policy"}</div>
            <div><span className="font-semibold">{cp?.documentDetails?.fields?.classification?.label || "Classification:"}</span> {cp?.documentDetails?.fields?.classification?.value || "Internal / Board Approved"}</div>
            <div><span className="font-semibold">{cp?.documentDetails?.fields?.effectiveDate?.label || "Effective Date:"}</span> {cp?.documentDetails?.fields?.effectiveDate?.value || "1st April 2025"}</div>
            <div><span className="font-semibold">{cp?.documentDetails?.fields?.approvedBy?.label || "Approved by:"}</span> {cp?.documentDetails?.fields?.approvedBy?.value || "Board of Directors"}</div>
          </div>
        </div>

        {/* 1. Preamble */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.preamble?.title || "1. Preamble"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.preamble?.paragraphs.para1[0] || "Satsai Finlease Private Limited"} (&quot;{sections?.sections?.preamble?.paragraphs.para1[1]  || "the Company"}&quot;) {sections?.sections?.preamble?.paragraphs.para1[2] || "is registered with the Reserve Bank of India (RBI) as a Non-Banking Financial Company Base Layer (NBFC-BL) under the Scale Based Regulation (SBR) framework and is primarily engaged in the business of Pay Day Loans, Loans Against Property (LAP), EMI-based Retail Loans and Corporate Business Loans."}
          </p>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.preamble?.paragraphs.para2 || "The purpose of this policy is to establish a harmonised framework for credit origination, risk control, portfolio diversification, liquidity stability and regulatory compliance in alignment with RBI Master Directions, circulars and prudential norms as amended from time to time."}
          </p>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sections?.sections?.preamble?.paragraphs.para3 || "The Company recognises that Pay Day Loans constitute a major portion of its loan portfolio and therefore incorporates enhanced prudential safeguards, risk-based underwriting controls and strict concentration norms specific to this segment."}
          </p>
        </div>

        {/* 2. Objectives */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.objectives?.title || "2. Objectives of the Policy"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.objectives?.description || "The objectives of this policy are to:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[0] || "Establish structured and standardised credit processes"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[1] || "Ensure prudent credit appraisal and responsible lending"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[2] || "Prevent excessive credit concentration"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[3] || "Maintain optimal liquidity and solvency levels"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[4] || "Mitigate credit, operational and liquidity risks"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[5] || "Align portfolio strategy with risk appetite"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[6] || "Strengthen governance and supervisory oversight"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.objectives?.items[7] || "Ensure full regulatory compliance"}</span>
            </li>
          </ul>
        </div>

        {/* Part A - Credit Policy Framework */}
        <div className="mb-10">
          <div className="bg-[#25B181]/10 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#25B181]">{sections?.sections?.partA?.heading || "PART A - CREDIT POLICY FRAMEWORK"}</h2>
          </div>
        </div>

        {/* 3. Credit Philosophy */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partA?.philosophy?.title || "3. Credit Philosophy"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.partA?.philosophy?.description || "The lending philosophy of the Company is based on responsible financial inclusion while maintaining asset quality and profitability. Lending decisions shall be guided by:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.philosophy?.items[0] || "Risk-based pricing"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.philosophy?.items[1] || "Conservative underwriting"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.philosophy?.items[2] || "Real income assessment"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.philosophy?.items[3] || "Behavioural data analytics"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.philosophy?.items[4] || "Portfolio diversification"}</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4">
            {sections?.sections?.partA?.philosophy?.footer || "The Company aims to balance growth with sustainability, ensuring that credit expansion does not compromise financial stability."}
          </p>
        </div>

        {/* 4. Credit Products */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partA?.products?.title || "4. Credit Products"}
          </h2>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#25B181]" />
              {sections?.sections?.partA?.products?.items.payDay.title || "4.1 Pay Day Loans"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sections?.sections?.partA?.products?.items.corporate.description || "Short-term unsecured loans extended to individuals for emergency or immediate cash requirements, generally repayable within 15 days to 6 months."}
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Home className="w-5 h-5 text-[#25B181]" />
              {sections?.sections?.partA?.products?.items.lap.title || "4.2 Loans Against Property (LAP)"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sections?.sections?.partA?.products?.items.corporate.description || "Secured loans against residential or commercial property for personal or business purposes."}
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#25B181]" />
              {sections?.sections?.partA?.products?.items.emi.title || "4.3 EMI-Based Retail Loans"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sections?.sections?.partA?.products?.items.corporate.description || "Structured repayment loans for consumer purchase, education, medical and household needs."}
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#25B181]" />
             {sections?.sections?.partA?.products?.items.corporate.title || "4.4 Corporate Business Loans"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sections?.sections?.partA?.products?.items.corporate.description || "Working capital and term loans to corporates subject to strict appraisal norms."}
            </p>
          </div>
        </div>

        {/* 5. Credit Eligibility Criteria */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partA?.eligibility?.title || "5. Credit Eligibility Criteria"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.partA?.eligibility?.description || "Borrowers must meet:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.eligibility?.items[0] || "Minimum age and legal capacity"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.eligibility?.items[1] || "Verifiable income source"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.eligibility?.items[2] || "Acceptable credit bureau score"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.eligibility?.items[3] || "Repayment capacity assessment"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.eligibility?.items[4] || "Compliance with KYC norms"}</span>
            </li>
          </ul>
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sections?.sections?.partA?.eligibility?.note[0] || "The Company shall follow"} &quot;{sections?.sections?.partA?.eligibility?.note[1] || "Fit and Proper"}&quot; {sections?.sections?.partA?.eligibility?.note[2] || "borrower assessment and shall not grant loans to blacklisted or high-risk profile individuals."}
            </p>
          </div>
        </div>

        {/* 6. Credit Underwriting Process */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partA?.underwriting?.title || "6. Credit Underwriting Process"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.partA?.underwriting?.description || "Includes:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.underwriting?.items[0][0] || "Customer onboarding"} &amp; {sections?.sections?.partA?.underwriting?.items[0][1] || "KYC"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.underwriting?.items[1][0] || "Income verification"} &amp; {sections?.sections?.partA?.underwriting?.items[1][1] || "bank statement analysis"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.underwriting?.items[2] || "Credit bureau analysis"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.underwriting?.items[3] || "Debt-Service Ratio evaluation"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.underwriting?.items[4] || "Risk grading and scorecard based evaluation"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.underwriting?.items[5][0] || "Documentation"} &amp; {sections?.sections?.partA?.underwriting?.items[5][1] || "disbursement"}</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4 italic">
            {sections?.sections?.partA?.underwriting?.footer || "Special due diligence shall apply for repeat borrowers and high-value loans."}
          </p>
        </div>

        {/* 7. Credit Pricing & Interest Structure */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partA?.pricing?.title[0] || "7. Credit Pricing"} &amp; {sections?.sections?.partA?.pricing?.title[1] || "Interest Structure"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.partA?.pricing?.description || "Interest rates shall be determined based on:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.pricing?.items[0] || "Cost of funds"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.pricing?.items[1] || "Credit risk profile"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.pricing?.items[2] || "Portfolio concentration risk"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.pricing?.items[3] || "Market conditions"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.pricing?.items[4] || "Operational costs"}</span>
            </li>
          </ul>
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>{sections?.sections?.partA?.pricing?.regulatoryNote[0] || "APR and Key Fact Sheet"}</strong> {sections?.sections?.partA?.pricing?.regulatoryNote[1] || "shall be mandatorily disclosed as per RBI Digital Lending norms."}
            </p>
          </div>
        </div>

        {/* 8. Repayment & Monitoring */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partA?.repayment?.title[0] || "8. Repayment"} &amp; {sections?.sections?.partA?.repayment?.title[1] || "Monitoring"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.repayment?.items[0] || "Repayments through ECS/NACH/UPI"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.repayment?.items[1] || "Continuous monitoring of EMI track record"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.repayment?.items[2] || "Early warning signal detection"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partA?.repayment?.items[3] || "Collection escalation framework"}</span>
            </li>
          </ul>
        </div>

        {/* Part B - Credit Concentration Policy */}
        <div className="mb-10">
          <div className="bg-[#4A66FF]/10 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#4A66FF]">{sections?.sections?.partB?.heading || "PART B - CREDIT CONCENTRATION POLICY"}</h2>
          </div>
        </div>

        {/* 9. Definition */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partB?.definition?.title || "9. Definition"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sections?.sections?.partB?.definition?.description || "Credit concentration risk arises when exposure to a borrower, sector or geographic cluster becomes excessive."}
          </p>
        </div>

        {/* 10. Exposure Limits */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Percent className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partB?.exposureLimits?.title || "10. Exposure Limits"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-6 border-l-4 border-[#25B181]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#25B181]" />
                {sections?.sections?.partB?.exposureLimits?.single?.label || "10.1 Single Borrower"}
              </h3>
              <p className="text-[#2b2b2b] leading-[1.7]">
                <strong>{sections?.sections?.partB?.exposureLimits?.single?.value[0] || "Not exceeding 15%"}</strong> {sections?.sections?.partB?.exposureLimits?.single?.value[1] || "of Owned Funds"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-6 border-l-4 border-[#4A66FF]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4A66FF]" />
                {sections?.sections?.partB?.exposureLimits?.group?.label || "10.2 Group Borrower"}
              </h3>
              <p className="text-[#2b2b2b] leading-[1.7]">
                <strong>{sections?.sections?.partB?.exposureLimits?.group?.value[0] || "Not exceeding 25%"}</strong> {sections?.sections?.partB?.exposureLimits?.group?.value[1] || "of Owned Funds"}
              </p>
            </div>
          </div>
        </div>

        {/* 11. Product Concentration Limits & Management */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partB?.concentration?.title[0] || "11. Product Concentration Limits"} &amp; {sections?.sections?.partB?.concentration?.title[1] || "Management"}
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-[#25B181] text-white">
                  <th className="px-6 py-3 text-left font-semibold">{sections?.sections?.partB?.concentration?.table?.headers.product || "Product"}</th>
                  <th className="px-6 py-3 text-left font-semibold">{sections?.sections?.partB?.concentration?.table?.headers.maxExposure || "Max Exposure %"}</th>
                </tr>
              </thead>
              <tbody className="text-[#2b2b2b]">
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3">{sections?.sections?.partB?.concentration?.table?.rows[0]?.name || "Pay Day Loans"}</td>
                  <td className="px-6 py-3 font-semibold">{sections?.sections?.partB?.concentration?.table?.rows[0].value || "90%"}</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3">{sections?.sections?.partB?.concentration?.table?.rows[1].name || "LAP"}</td>
                  <td className="px-6 py-3 font-semibold">{sections?.sections?.partB?.concentration?.table?.rows[1].value || "2%"}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3">{sections?.sections?.partB?.concentration?.table?.rows[2].name || "EMI Loans"}</td>
                  <td className="px-6 py-3 font-semibold">{sections?.sections?.partB?.concentration?.table?.rows[2].value || "5%"}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-3">{sections?.sections?.partB?.concentration?.table?.rows[3].name || "Corporate Loans"}</td>
                  <td className="px-6 py-3 font-semibold">{sections?.sections?.partB?.concentration?.table?.rows[3].value || "3%"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sections?.sections?.partB?.concentration?.strategy || "While concentration limits reflect the existing business model and strategic focus of the Company, it is acknowledged that such high dependence on a single product category may increase portfolio vulnerability. Accordingly, the Company shall proactively undertake steps to progressively diversify its loan portfolio by expanding secured lending, retail EMI-based products and corporate business lending. Strategic initiatives shall include product innovation, targeted marketing, risk-adjusted pricing and gradual rebalancing of the portfolio to achieve a healthier and more sustainable credit mix over time."}
            </p>
          </div>
        </div>

        {/* Part C - Liquidity Risk Management Framework */}
        <div className="mb-10">
          <div className="bg-[#FF9C70]/20 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#E07840]">{sections?.sections?.partC?.heading || "PART C - LIQUIDITY RISK MANAGEMENT FRAMEWORK"}</h2>
          </div>
        </div>

        {/* 12. Liquidity Governance */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partC?.governance?.title || "12. Liquidity Governance"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sections?.sections?.partC?.governance?.value || "Board of Directors"}
          </p>
        </div>

        {/* 13. ALM Structure */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partC?.alm?.title || "13. ALM Structure"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.alm?.items[0] || "Maturity profiling"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.alm?.items[1] || "Structural liquidity analysis"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.alm?.items[2] || "Cash flow forecasting"}</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4 italic">
            {sections?.sections?.partC?.alm?.footer || "Time buckets as per RBI prescribed standards shall be followed strictly."}
          </p>
        </div>

        {/* 14. Liquidity Monitoring Tools */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Gauge className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partC?.monitoring?.title || "14. Liquidity Monitoring Tools"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.monitoring?.items[0] || "Concentration of funding"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.monitoring?.items[1] || "Stock approach liquidity ratios"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.monitoring?.items[2] || "Unencumbered asset buffer"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.monitoring?.items[3] || "Stress testing approach"}</span>
            </li>
          </ul>
        </div>

        {/* 15. LCR Framework */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partC?.lcr?.title || "15. LCR Framework"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sections?.sections?.partC?.lcr?.description || "The Company shall maintain minimum LCR as per regulatory thresholds and maintain adequate HQLA."}
          </p>
        </div>

        {/* 16. Contingency Funding Plan */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Umbrella className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partC?.contingency?.title || "16. Contingency Funding Plan"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sections?.sections?.partC?.contingency?.description || "Includes:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.contingency?.items[0] || "Emergency funding sources"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.contingency?.items[1] || "Liquid asset monetization plan"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partC?.contingency?.items[2] || "Crisis communication mechanism"}</span>
            </li>
          </ul>
        </div>

        {/* Part D - Internal Controls & Governance */}
        <div className="mb-10">
          <div className="bg-[#4A66FF]/10 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-[#4A66FF]">{sections?.sections?.partD?.heading[0] || "PART D - INTERNAL CONTROLS"} &amp; {sections?.sections?.partD?.heading[1] || "GOVERNANCE"}</h2>
          </div>
        </div>

        {/* 17. Reporting */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partD?.reporting?.title || "17. Reporting"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partD?.reporting?.items[0] || "Monthly Risk Reports"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sections?.sections?.partD?.reporting?.items[1] || "Quarterly Liquidity Review by Board"}</span>
            </li>
          </ul>
        </div>

        {/* 18. Breach Management */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partD?.breach?.title || "18. Breach Management"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sections?.sections?.partD?.breach?.description || "Immediate escalation to Board and corrective plan within 30 days."}
          </p>
        </div>

        {/* 19. Policy Review */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.partD?.review?.title || "19. Policy Review"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sections?.sections?.partD?.review?.description || "This policy shall be reviewed annually or earlier if regulatory changes warrant modification."}
          </p>
        </div>

        {/* Effective Date */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#25B181]" />
            {sections?.sections?.effectiveDate.title || "Effective Date"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sections?.sections?.effectiveDate.description[0] || "This Policy shall come into effect from"} <strong>{sections?.sections?.effectiveDate.description[1] || "1st April 2025"}</strong> {sections?.sections?.effectiveDate.description[2] || "and shall supersede all previous credit-related policies."}
          </p>
        </div>

        {/* Board Approval */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Building className="w-6 h-6 text-[#25B181]" />
              {sections?.sections?.boardApproval.title || "Board Approval"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>{sections?.sections?.boardApproval.title || "Approved by:"}</strong> {sections?.sections?.boardApproval.description || "Board of Directors, Satsai Finlease Private Limited"}
            </p>
          </div>
        </div>
      </PoliciesLayout>
    </div>
  );
}
