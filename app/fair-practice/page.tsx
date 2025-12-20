'use client';

import { motion } from "framer-motion";
import { Scale, FileCheck, Shield, Users, Headphones, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Footer } from "@/components/footer";

export default function FairPracticeCodePage() {
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
            <Scale className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Fair Practices Code
            </h1>
            <p className="text-xl">Transparency, Integrity, and Responsible Lending</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            {/* Introduction */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#25B181]" />
                Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                QuikkRed adheres to the guidelines issued by the Reserve Bank of India (RBI) for Non-Banking Financial Companies (NBFCs). Our Fair Practices Code outlines the standards we follow while dealing with customers and reflects our commitment to transparency, integrity, and responsible lending.
              </p>
              <p className="text-gray-600">
                Our objective is to provide clear, simple, and fair financial services to all applicants. We aim to ensure that loan terms, applicable charges, interest rates, and customer rights are always communicated in a transparent and courteous manner. This Code is published on our website and is available to any customer on request.
              </p>
            </div>

            {/* Key Commitments */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#25B181]" />
                Key Commitments
              </h2>

              {/* 1. Applications for Loans */}
              <div className="mb-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  1. Applications for Loans and Their Processing
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Loan application forms will include all necessary information required for a borrower to understand the process, including a list of mandatory documents.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>QuikkRed will provide applicants with complete information regarding fees, processing charges, and interest rates before the loan is sanctioned.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>After receiving a fully completed loan application, we will communicate the decision within a reasonable timeframe.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Any changes in terms or conditions, including interest rate revisions, will be shared immediately through appropriate communication channels.</span>
                  </li>
                </ul>
              </div>

              {/* 2. Loan Appraisal */}
              <div className="mb-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  2. Loan Appraisal and Terms/Conditions
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Loan assessment will be carried out based on QuikkRed's internal credit evaluation system, risk parameters, and borrower repayment capacity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Once a loan is approved, the borrower will receive a formal sanction letter listing the loan amount, tenure, interest rate, EMI, and all terms and conditions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>The signed sanction letter/loan agreement copy will be shared with the borrower at the time of disbursement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Any security or collateral documents will be released promptly after repayment of all dues.</span>
                  </li>
                </ul>
              </div>

              {/* 3. Disbursement */}
              <div className="mb-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  3. Disbursement of Loans Including Changes in Terms
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Loan disbursement will take place only after the borrower signs the agreement and meets the required conditions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Any changes in charges, interest rates, or terms will be communicated clearly in advance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>In case of default, QuikkRed will follow a fair and transparent recovery process.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Privacy & Confidentiality */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#4A66FF]" />
                Privacy & Confidentiality
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#4A66FF] mt-1">•</span>
                  <span>Customer information will be kept strictly confidential unless disclosure is required by law or consented to by the customer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4A66FF] mt-1">•</span>
                  <span>Information will not be shared with third parties without customer permission, except for regulatory or legal requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4A66FF] mt-1">•</span>
                  <span>QuikkRed will not engage in unlawful or unethical sharing of customer data.</span>
                </li>
              </ul>
            </div>

            {/* General */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                General
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>QuikkRed will not interfere in the borrower's affairs except for purposes permitted under the loan agreement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Any customer complaint will be acknowledged promptly and resolved within a reasonable time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Recovery staff will always follow respectful and non-intrusive methods while contacting customers for overdue payments.</span>
                </li>
              </ul>
            </div>

            {/* Further Assistance */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Headphones className="w-6 h-6 text-[#25B181]" />
                Further Assistance
              </h2>

              {/* Customer Complaints */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Customer Complaints</h3>
                <p className="text-gray-600">
                  Borrowers may register complaints through email, phone, or the in-app support system. All concerns will be evaluated and resolved by our grievance team.
                </p>
              </div>

              {/* Grievance Redressal Mechanism */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Grievance Redressal Mechanism</h3>
                <p className="text-gray-600 mb-4">
                  If a customer is dissatisfied with the resolution provided, the issue will be escalated to the Grievance Redressal Officer (GRO).
                </p>
                <div className="bg-gradient-to-br from-[var(--emerald-green)]/10 to-[var(--royal-blue)]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
                  <p className="font-semibold text-gray-800 mb-2">Grievance Redressal Officer:</p>
                  <p className="text-gray-600">Name</p>
                  <p className="text-gray-600">Email ID</p>
                  <p className="text-gray-600">Contact Number</p>
                </div>
                <p className="text-gray-600 mt-4">
                  If the borrower is still not satisfied, they may approach the RBI Ombudsman under the Integrated Ombudsman Scheme.
                </p>
              </div>

              {/* Monitoring */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Monitoring</h3>
                <p className="text-gray-600">
                  QuikkRed has designated a Compliance Officer to ensure adherence to this Fair Practices Code and other regulatory guidelines. Periodic reviews will be carried out to ensure full compliance and to improve customer service standards.
                </p>
              </div>

              {/* Availability of the Code */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Availability of the Code</h3>
                <p className="text-gray-600">
                  This Fair Practices Code will be available on the QuikkRed website. Printed copies will be provided on request.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
