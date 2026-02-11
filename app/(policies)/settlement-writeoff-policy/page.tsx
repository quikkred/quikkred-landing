'use client';

import { motion } from "framer-motion";
import { FileText, BookOpen, Target, Shield, AlertCircle, Scale, RefreshCw, Building, Clock, Users, UserCheck, ClipboardList, DollarSign, Activity, Layers, CheckCircle, XCircle, FileCheck, Calendar, Banknote, BadgeCheck, Gavel, BarChart3, CreditCard } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function SettlementAndWriteoffPolicyPage() {
  const { t } = useLanguage();
  const sw = t?.policies?.settlementWriteoff

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
              {sw?.title[0] || "Settlement"} &amp; {sw?.title[1] || "Write-off Policy"}
            </h1>
            <p className="text-xl">{sw?.subtitle[0] || "Comprehensive Policy on Settlements"} &amp; {sw?.subtitle[1] || "Write-offs"}</p>
            <p className="text-sm mt-2 opacity-90">{sw?.company || "Satsai Finlease Pvt. Ltd."}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Board Approval Notice */}
        <div className="mb-10 bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
          <p className="text-[#2b2b2b] leading-[1.7] italic">
            {sw?.content || "This policy was approved by the Board of Directors in the Board Meeting held on 21st April 2025."}
          </p>
        </div>

        {/* 1. Preamble */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[0] || "1. Preamble"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sw?.sections?.preamble?.companyName || "Satsai Finlease Private Limited"} (&quot;{sw?.sections?.preamble?.alias || "the Company"}&quot;), {sw?.sections?.preamble?.registration?.type || "a Non-Banking Financial Company (Base Layer) registered with the"} {sw?.sections?.preamble?.registration?.regulator || "Reserve Bank of India (RBI),"} {sw?.sections?.preamble?.content[0] || "provides unsecured payday loans, personal loans, EMI-based loans, Loan Against Property (LAP), and corporate/business loans. The Company"}&apos;{sw?.sections?.preamble?.content[1] || "s primary objective is to maintain healthy asset quality while ensuring recovery actions are cost-effective, compliant, transparent and consistent with RBI regulations."}
          </p>
        </div>

        {/* 2. Purpose of the Policy */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[1] || "2. Purpose of the Policy"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sw?.sections?.purposeOfPolicy?.start || "This Policy has been formulated to:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.purposeOfPolicy?.items[0] || "Provide a standardised, transparent, and fair mechanism for compromise settlements, loan settlements, and technical write-offs."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.purposeOfPolicy?.items[1][0] || "Ensure full compliance with the RBI"}&apos;{sw?.sections?.purposeOfPolicy?.items[1][1] || "s Framework for Compromise Settlements"} &amp; {sw?.sections?.purposeOfPolicy?.items[1][2] || "Technical Write-offs (June 08, 2023)."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.purposeOfPolicy?.items[2] || "Define detailed processes, documentation, approval authorities, due diligence steps, internal controls, and reporting requirements."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.purposeOfPolicy?.items[3] || "Establish clear principles for determining settlement amounts, security valuation, hardship verification, and recovery options."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.purposeOfPolicy?.items[4] || "Prevent misuse, arbitrary waivers, conflicts of interest, and coercive recovery practices."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.purposeOfPolicy?.items[5] || "Ensure settlements maximize recoveries at minimum cost."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.purposeOfPolicy?.items[6][0] || "Ensure prudential accounting"} &amp; {sw?.sections?.purposeOfPolicy?.items[6][1] || "provisioning norms are followed while writing off assets."}</span>
            </li>
          </ul>
        </div>

        {/* 3. Definitions */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[2] || "3. Definitions"}
          </h2>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#25B181]" />
              {sw?.sections?.definitions[0]?.title[0] || "3.1 Compromise Settlement"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sw?.sections?.definitions[1]?.content[0][0] || "A negotiated agreement with a borrower to fully settle the Company"}&apos;{sw?.sections?.definitions[1]?.content[0][1] || "s claims for a mutually agreed amount which is less than total dues, resulting in a sacrifice or waiver by the Company. (As per RBI definition)."}
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#25B181]" />
              {sw?.sections?.definitions[0]?.title[1] || "3.2 Loan Settlement / One-Time Settlement (OTS)"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sw?.sections?.definitions[1]?.content[1] || "A structured or lump-sum settlement for stressed or NPA accounts, usually involving upfront payment and closure within a short time frame."}
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#25B181]" />
              {sw?.sections?.definitions[0]?.title[2][0] || "3.3 Full"} &amp; {sw?.sections?.definitions[0]?.title[2][1] || "Final Settlement"} (F&amp;F)
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sw?.sections?.definitions[1]?.content[2] || "A lump-sum repayment made by the borrower in exchange for waiver of remaining dues."}
            </p>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[#25B181]" />
              {sw?.sections?.definitions[0]?.title[3] || "3.4 Technical Write-off"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              {sw?.sections?.definitions[1]?.content[3] || "An NPA loan where the borrower still legally owes the amount but the Company removes it from its books only for accounting purposes, without waiving the right to recover."}
            </p>
          </div>
        </div>

        {/* 4. Eligibility Framework for Settlements */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[3] || "4. Eligibility Framework for Settlements"}
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{sw?.sections?.settlementFramework?.title[0] || "4.1 General Eligibility"}</h3>
            <p className="text-[#2b2b2b] leading-[1.7] mb-3">{sw?.sections?.settlementFramework?.content[0]?.intro || "A loan may be considered for settlement when:"}</p>
            <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">&#8226;</span>
                <span>{sw?.sections?.settlementFramework?.content[1]?.points[0][0].dpd[0] || "DPD"} &gt; {sw?.sections?.settlementFramework?.content[1]?.points[0][0].dpd[1] || "30 days and/or recovery probability"} &lt; {sw?.sections?.settlementFramework?.content[1]?.points[0][0].dpd[2] || "25% (based on internal metrics)."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">&#8226;</span>
                <span>{sw?.sections?.settlementFramework?.content[0]?.points[1] || "NPA classification under IRACP norms."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">&#8226;</span>
                <span>{sw?.sections?.settlementFramework?.content[0]?.points[2] || "Account already written-off but borrower is now reachable."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">&#8226;</span>
                <span>{sw?.sections?.settlementFramework?.content[0]?.points[3] || "Borrower demonstrates genuine hardship."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">&#8226;</span>
                <span>{sw?.sections?.settlementFramework?.content[0]?.points[4] || "Collateral value (for secured loans) insufficient to cover outstanding dues."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">&#8226;</span>
                <span>{sw?.sections?.settlementFramework?.content[0]?.points[5] || "Litigation cost is expected to exceed realizable recovery."}</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-4 border-l-4 border-[#25B181]">
              <h4 className="font-semibold mb-2">{sw?.sections?.settlementFramework?.title[1] || "4.2 Payday / Short Duration Loans"}</h4>
              <ul className="space-y-1 text-sm text-[#2b2b2b]">
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points2[0][0] || "Overdue"} &gt; {sw?.sections?.settlementFramework?.content[0]?.points2[0][1] || "30 days"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points2[1] || "High roll-rate and low likelihood of recovery"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points2[2] || "Verified hardship"}</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-4 border-l-4 border-[#4A66FF]">
              <h4 className="font-semibold mb-2">{sw?.sections?.settlementFramework?.title[2] || "4.3 Personal Loans / EMI Loans"}</h4>
              <ul className="space-y-1 text-sm text-[#2b2b2b]">
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points3[0] || "90-180 DPD delinquency"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points3[1] || "Borrower unable to meet EMI obligations"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points3[2] || "Written-off accounts with potential for partial recovery"}</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#FF9C70]/10 to-[#FF9C70]/5 rounded-lg p-4 border-l-4 border-[#FF9C70]">
              <h4 className="font-semibold mb-2">{sw?.sections?.settlementFramework?.title[3] || "4.4 LAP (Loan Against Property)"}</h4>
              <ul className="space-y-1 text-sm text-[#2b2b2b]">
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points4[0] || "Fresh valuation showing lower realizable value"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points4[1] || "Litigation cost"} &gt; {sw?.sections?.settlementFramework?.content[0]?.points4[2] || "incremental recovery"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points4[3] || "Borrower offers realistic settlement proposal"}</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#9B59B6]/10 to-[#9B59B6]/5 rounded-lg p-4 border-l-4 border-[#9B59B6]">
              <h4 className="font-semibold mb-2">{sw?.sections?.settlementFramework?.title[4] || "4.5 Corporate / Business Loans"}</h4>
              <ul className="space-y-1 text-sm text-[#2b2b2b]">
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points5[0] || "Business closure / insolvency / severe cash-flow deterioration"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points5[1] || "Market value of collateral less than outstanding"}</li>
                <li>&#8226; {sw?.sections?.settlementFramework?.content[0]?.points5[2] || "Multiple recovery attempts unsuccessful"}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Technical Write-Off Policy */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[4] || "5. Technical Write-Off Policy"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.technicalWriteOffPolicy.points[0] || "Technical write-off does NOT reduce borrower liability. The write-off shall be effected only in the books of accounts of the Company."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.technicalWriteOffPolicy?.points[1] || "Technical write-off accounts must continue to be actively pursued for recovery."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.technicalWriteOffPolicy?.points[2] || "Partial technical write-offs must ensure provisioning = 100% of gross exposure as required by RBI."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.technicalWriteOffPolicy?.points[3] || "Re-aging of accounts is not allowed."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.technicalWriteOffPolicy?.points[4] || "Any waiver must follow compromise settlement norms, not technical write-off norms."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.technicalWriteOffPolicy?.points[5] || "Recovery efforts, including legal action, collection follow-ups, or settlement negotiations, may continue even after the loan is written off in the books."}</span>
            </li>
          </ul>
        </div>

        {/* 6. Determination of Settlement Amount */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[5] || "6. Determination of Settlement Amount"}
          </h2>

          {/* 6.1 Components Considered */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {sw?.sections?.determinationOfSettlementAmount?.components?.title || "6.1 Components Considered"}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(sw?.sections?.determinationOfSettlementAmount?.components?.items || [
                "Principal outstanding",
                "Accrued interest",
                "Penal Charges",
                "Overdue charges",
                "Legal expenses"
              ]).map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-3 text-center text-[#2b2b2b]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* 6.2 Factors Influencing Settlement Calculation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {sw?.sections?.determinationOfSettlementAmount?.factors?.title || "6.2 Factors Influencing Settlement Calculation"}
            </h3>

            <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
              {(sw?.sections?.determinationOfSettlementAmount?.factors?.points || [
                "Recovery probability score",
                "Borrower capacity analysis",
                "Hardship proof",
                "Collateral distress valuation",
                "Legal recovery timeframe",
                "Previous recovery performance in similar cases"
              ]).map((point: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 7. Delegation of Authority */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[6] || "7. Delegation of Authority (RBI Mandatory Requirement)"}
          </h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <p className="text-[#2b2b2b] leading-[1.7] font-semibold">
              {sw?.sections?.delegationOfAuthority?.note ||
                "Settlement approvals must be one level higher than loan sanctioning authority."}
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-3">
            {sw?.sections?.delegationOfAuthority?.matrixTitle || "Authority Matrix"}
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-[#25B181] text-white">
                  {(sw?.sections?.delegationOfAuthority?.table?.headers || [
                    "Loan Type",
                    "Exposure Amount",
                    "Approving Authority"
                  ]).map((head: string, idx: number) => (
                    <th key={idx} className="px-4 py-3 text-left font-semibold">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-[#2b2b2b]">
                {(sw?.sections?.delegationOfAuthority?.table?.rows || []).map(
                  (row: string[], rowIdx: number) => (
                    <tr
                      key={rowIdx}
                      className={`border-b border-gray-100 ${rowIdx % 2 === 1 ? "bg-gray-50" : ""
                        }`}
                    >
                      {row.map((cell: string, cellIdx: number) => (
                        <td key={cellIdx} className="px-4 py-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[#2b2b2b] leading-[1.7] italic">
            {sw?.sections?.delegationOfAuthority?.footerNote ||
              "All approvals are based on Due Past Days (DPD) of the customer."}
          </p>
        </div>

        {/* 8. Detailed Settlement Workflow */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#25B181]" />
            {sw?.sections?.detailedSettlementWorkflow?.title || "8. Detailed Settlement Workflow"}
          </h2>

          <div className="space-y-6">
            {sw?.sections?.detailedSettlementWorkflow?.steps?.map((step: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-[#25B181]">
                  {step.title}
                </h3>

                {step.intro && (
                  <p className="text-[#2b2b2b] leading-[1.7] mb-3">
                    {step.intro}
                  </p>
                )}

                {step.points && (
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    {step.points.map((point: string, i: number) => (
                      <li key={i}>&#8226; {point}</li>
                    ))}
                  </ul>
                )}

                {step.tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {step.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="bg-[#25B181]/20 text-[#25B181] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 9. Fresh Loan Eligibility */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[8] || "9. Fresh Loan Eligibility for Settlement and Write-off Accounts"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {sw?.sections?.freshLoanEligibility?.description || "The Company does not provide fresh loans to customers whose accounts were settled under compromise or classified as technical write-off. Exceptions may be granted on specific customer request, subject to proper verification of the case, assessment of creditworthiness, and approval by the competent authority."}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>{sw?.sections?.freshLoanEligibility?.coolingPeriod || "A general cooling period of 12-18 months shall be observed."}</strong>
            </p>
          </div>
        </div>

        {/* 10. Accounting Treatment */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[9] || "10. Accounting Treatment"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-6 border-l-4 border-[#25B181]">
              <h3 className="text-lg font-semibold mb-3">{sw?.sections?.accountingTreatment?.settlement?.title || "In Case of Settlement"}</h3>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                <li>&#8226; {sw?.sections?.accountingTreatment?.settlement?.points[0] || "Waiver must be booked as a loss."}</li>
                <li>&#8226; {sw?.sections?.accountingTreatment?.settlement?.points[1] || "Recovery posted to loan account accordingly."}</li>
                <li>&#8226; {sw?.sections?.accountingTreatment?.settlement?.points[2] || "Written-off assets must be reported separately in financial statements."}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-6 border-l-4 border-[#4A66FF]">
              <h3 className="text-lg font-semibold mb-3">{sw?.sections?.accountingTreatment?.writeOff?.title || "In Case of Write-off"}</h3>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                <li>&#8226; {sw?.sections?.accountingTreatment?.writeOff?.points[0] || "Upon write-off, the outstanding principal and accrued interest (if any) shall be removed from the books by debiting the Loan Loss Provision Account."}</li>
                <li>&#8226; {sw?.sections?.accountingTreatment?.writeOff?.points[1] || "Any subsequent recoveries from written-off accounts shall be recognized as Other Income / Recovery from Written-Off Accounts in the period in which they are realized."}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 11. Monitoring, Audit & Reporting */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#25B181]" />
            {sw?.sections?.monitoringAuditReporting?.title?.[0] || "11. Monitoring, Audit"} &amp;{" "}
            {sw?.sections?.monitoringAuditReporting?.title?.[1] || "Reporting"}
          </h2>

          {/* 11.1 Internal Monitoring */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {sw?.sections?.monitoringAuditReporting?.internalMonitoring?.title || "11.1 Internal Monitoring"}
            </h3>
            <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
              {sw?.sections?.monitoringAuditReporting?.internalMonitoring?.points?.map(
                (point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>{point}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* 11.2 Audit Requirements */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {sw?.sections?.monitoringAuditReporting?.auditRequirements?.title || "11.2 Audit Requirements"}
            </h3>
            <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
              {sw?.sections?.monitoringAuditReporting?.auditRequirements?.points?.map(
                (point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>{point}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* 11.3 Mandatory Reporting to Board */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {sw?.sections?.monitoringAuditReporting?.mandatoryReportingToBoard?.title ||
                "11.3 Mandatory Reporting to Board"}
            </h3>

            <p className="text-[#2b2b2b] leading-[1.7] mb-3">
              {sw?.sections?.monitoringAuditReporting?.mandatoryReportingToBoard?.intro || "Quarterly, covering:"}
            </p>

            <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
              {sw?.sections?.monitoringAuditReporting?.mandatoryReportingToBoard?.points?.map(
                (point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>{point}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* 12. Review of Policy */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[11] || "12. Review of Policy"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.reviewOfPolicy?.points[0] || "Annual review by Board."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.reviewOfPolicy?.points[1] || "Interim review if RBI issues new directions."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25B181] mt-1">&#8226;</span>
              <span>{sw?.sections?.reviewOfPolicy?.points[2] || "All amendments recorded and notified internally."}</span>
            </li>
          </ul>
        </div>

        {/* 13. Effective Date */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#25B181]" />
            {sw?.heading[12] || "13. Effective Date"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {sw?.sections?.effectiveDate?.start || "This Loan Settlement Policy is approved by the Board of Directors of Satsai Finlease Private Limited at its meeting held on"} <strong>{sw?.sections?.effectiveDate?.bold || "April 21, 2025"}</strong> {sw?.sections?.effectiveDate?.end || "and shall be effective from the same date."}
          </p>
        </div>

        {/* Signatory */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Building className="w-6 h-6 text-[#25B181]" />
              {sw?.sections?.signatory?.company || "For Satsai Finlease Private Limited"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>{sw?.sections?.signatory?.authority || "Authorized Signatory"}</strong>
            </p>
          </div>
        </div>
      </PoliciesLayout>
    </div>
  );
}
