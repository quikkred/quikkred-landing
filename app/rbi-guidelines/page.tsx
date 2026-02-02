'use client';

import { motion } from "framer-motion";
import { Shield, BookOpen, FileCheck, AlertCircle, Scale, Users, Building, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function RBIGuidelinesPage() {
  const { t } = useLanguage();

  // const rbi = t?.policies;
  // console.log(rbi)
  
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
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              {"RBI Guidelines"}
            </h1>
            <p className="text-xl">{"Regulatory Compliance & Consumer Protection"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Introduction */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#25B181]" />
            About RBI Regulations
          </h2>
          <p className="text-gray-600 mb-4">
            QuikkRed is a digital lending platform powered by <strong>Fluxusforge Private Limited</strong> (Loan Service Provider). All loans on our platform are disbursed by <strong>Satsai Finlease Private Limited</strong>, an RBI-registered Non-Banking Financial Company (NBFC) established in 1996 (CIN: U71290DL1996PTC081328).
          </p>
          <p className="text-gray-600">
            The RBI has established comprehensive guidelines to ensure that NBFCs and their digital lending partners maintain financial stability, protect consumer interests, and follow ethical business practices. This page outlines the key RBI regulations applicable to our platform and our lending partner's operations.
          </p>
        </div>

        {/* NBFC Partnership */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Building className="w-6 h-6 text-[#25B181]" />
            Our Lending Partner
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Satsai Finlease Private Limited
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>RBI-Registered NBFC:</strong> Satsai Finlease is a registered NBFC under the Reserve Bank of India Act, 1934.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Established:</strong> 1996 (28+ years of financial services experience)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>CIN:</strong> U71290DL1996PTC081328</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Website:</strong> <a href="https://satsaifinlease.com" target="_blank" rel="noopener noreferrer" className="text-[#25B181] hover:underline">satsaifinlease.com</a></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Maintains the minimum Net Owned Fund (NOF) as prescribed by the RBI.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Registration details available for verification on the RBI website.</span>
              </li>
            </ul>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Fluxusforge Private Limited (LSP)
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Role:</strong> Loan Service Provider (LSP) and Technology Partner operating the QuikkRed platform.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Website:</strong> <a href="https://fluxusforge.in" target="_blank" rel="noopener noreferrer" className="text-[#25B181] hover:underline">fluxusforge.in</a></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Provides technology infrastructure, customer onboarding, and servicing support.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Operates under the regulatory framework established by RBI Digital Lending Guidelines, 2022.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Digital Lending Guidelines */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#25B181]" />
            Digital Lending Guidelines
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Key Provisions We Follow
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Direct Disbursement:</strong> All loan amounts are disbursed directly to the borrower's bank account without any pass-through or pool accounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Transparent Communication:</strong> All fees, charges, and annual percentage rates (APR) are disclosed upfront before loan sanction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Key Fact Statement (KFS):</strong> A standardized KFS is provided to borrowers containing all essential loan information.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Cooling-Off Period:</strong> Borrowers have the right to exit the loan within a specified look-up period.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Data Privacy:</strong> Customer data is collected only with explicit consent and used solely for credit assessment and legitimate purposes.</span>
              </li>
            </ul>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              LSP Disclosure & Compliance
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Fluxusforge Private Limited operates as the Lending Service Provider (LSP) for Satsai Finlease Private Limited.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>All LSP details are disclosed to borrowers as part of the loan documentation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>LSP activities are monitored by Satsai Finlease to ensure compliance with RBI guidelines.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fair Practices Code */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#4A66FF]" />
            Fair Practices Code
          </h2>
          <p className="text-gray-600 mb-4">
            In accordance with RBI Master Direction on Non-Banking Financial Company – Non-Systemically Important Non-Deposit taking Company (Reserve Bank) Directions, 2016, our lending partner Satsai Finlease Private Limited has adopted a comprehensive Fair Practices Code that governs:
          </p>
          <ul className="space-y-3 text-gray-600 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>Loan application processing and approval</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>Disclosure of terms and conditions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>Interest rate and fee transparency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>Customer grievance redressal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>Recovery practices and customer treatment</span>
            </li>
          </ul>
          <p className="text-gray-600">
            For detailed information, please refer to our <a href="/fair-practice" className="text-[#25B181] hover:underline">Fair Practices Code</a> page.
          </p>
        </div>

        {/* Customer Protection */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#25B181]" />
            Customer Protection Framework
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Your Rights as a Borrower
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Information:</strong> Complete transparency on loan terms, interest rates, fees, and charges before signing any agreement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Privacy:</strong> Your personal and financial data is protected and used only for authorized purposes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Fair Treatment:</strong> Respectful and dignified treatment at all stages of the loan lifecycle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Grievance Redressal:</strong> Access to a robust complaint resolution mechanism.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Exit:</strong> Option to prepay loans with applicable charges as per the loan agreement.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* KYC & AML */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-[#25B181]" />
            KYC/AML Compliance
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Know Your Customer (KYC) Requirements
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>We follow RBI's Master Direction on KYC for customer identification and verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Video KYC (V-KYC) is conducted as per RBI guidelines for digital onboarding.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Aadhaar-based e-KYC is performed with explicit customer consent.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Periodic KYC updates are conducted as mandated by regulatory requirements.</span>
              </li>
            </ul>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Anti-Money Laundering (AML) Framework
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Robust transaction monitoring systems to detect suspicious activities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Compliance with Prevention of Money Laundering Act (PMLA), 2002.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Regular training of staff on AML/CFT requirements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>Reporting of suspicious transactions to Financial Intelligence Unit (FIU-IND).</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-600">
            For detailed information, please refer to our <a href="/kyc-policy" className="text-[#25B181] hover:underline">KYC/AML Policy</a> page.
          </p>
        </div>

        {/* Grievance Redressal */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#25B181]" />
            Grievance Redressal Mechanism
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Three-Tier Complaint Resolution
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Level 1: Customer Support</h4>
                <p className="text-gray-600">Contact our customer support team via email, phone, or in-app chat for initial complaint registration and resolution.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Level 2: Grievance Redressal Officer</h4>
                <p className="text-gray-600">If not satisfied with Level 1 resolution, escalate to our designated Grievance Redressal Officer (GRO).</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Level 3: RBI Ombudsman</h4>
                <p className="text-gray-600">If still unresolved, customers can approach the RBI Ombudsman under the Integrated Ombudsman Scheme.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[var(--emerald-green)]/10 to-[var(--royal-blue)]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
            <p className="font-semibold text-gray-800 mb-2">RBI Ombudsman Details:</p>
            <p className="text-gray-600">Website: <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-[#25B181] hover:underline">https://cms.rbi.org.in</a></p>
            <p className="text-gray-600">Toll-Free Number: 14448</p>
            <p className="text-gray-600">Email: crpc@rbi.org.in</p>
          </div>
          <p className="text-gray-600 mt-4">
            For detailed information, please refer to our <a href="/grievance-redressal-policy" className="text-[#25B181] hover:underline">Grievance Redressal Policy</a> page.
          </p>
        </div>

        {/* Important RBI Circulars */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#4A66FF]" />
            Key RBI Regulations We Comply With
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-800">Master Direction - NBFC Directions, 2016</p>
              <p className="text-sm text-gray-600">Comprehensive framework for NBFC operations, governance, and prudential norms.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-800">Digital Lending Guidelines, 2022</p>
              <p className="text-sm text-gray-600">Guidelines on digital lending by banks and NBFCs covering LSP regulations, data privacy, and customer protection.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-800">Master Direction on KYC, 2016</p>
              <p className="text-sm text-gray-600">Know Your Customer norms including e-KYC, V-KYC, and periodic updates.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-800">Fair Practices Code for NBFCs</p>
              <p className="text-sm text-gray-600">Guidelines ensuring fair treatment of customers in lending practices.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-800">Integrated Ombudsman Scheme, 2021</p>
              <p className="text-sm text-gray-600">Unified grievance redressal mechanism for banking and financial services.</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-10 bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Disclaimer</h3>
          <p className="text-gray-600 text-sm">
            QuikkRed is a digital lending platform powered by Fluxusforge Private Limited (LSP). All loans are disbursed by Satsai Finlease Private Limited, an RBI-registered NBFC. This page provides a summary of key RBI guidelines applicable to our platform and lending partner's operations. For complete regulatory information, please refer to the official RBI website at <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-[#25B181] hover:underline">www.rbi.org.in</a>. The guidelines mentioned above are subject to updates and amendments by the RBI from time to time.
          </p>
        </div>
      </PoliciesLayout>
    </div>
  );
}
