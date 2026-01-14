'use client';

import { motion } from "framer-motion";
import { FileText, BookOpen, Target, Shield, AlertCircle, Scale, RefreshCw, Building, Clock, Users, UserCheck, ClipboardList, DollarSign, Activity, Layers, CheckCircle, XCircle, FileCheck, Calendar, Banknote, BadgeCheck, Gavel, BarChart3, CreditCard } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function SettlementAndWriteoffPolicyPage() {
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
              Settlement &amp; Write-off Policy
            </h1>
            <p className="text-xl">Comprehensive Policy on Settlements &amp; Write-offs</p>
            <p className="text-sm mt-2 opacity-90">Satsai Finlease Pvt. Ltd.</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 font-sans">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
            style={{ lineHeight: '1.7' }}
          >
            {/* Board Approval Notice */}
            <div className="mb-10 bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <p className="text-[#2b2b2b] leading-[1.7] italic">
                This policy was approved by the Board of Directors in the Board Meeting held on 21st April 2025.
              </p>
            </div>

            {/* 1. Preamble */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#25B181]" />
                1. Preamble
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                Satsai Finlease Private Limited (&quot;the Company&quot;), a Non-Banking Financial Company (Base Layer) registered with the Reserve Bank of India (RBI), provides unsecured payday loans, personal loans, EMI-based loans, Loan Against Property (LAP), and corporate/business loans. The Company&apos;s primary objective is to maintain healthy asset quality while ensuring recovery actions are cost-effective, compliant, transparent and consistent with RBI regulations.
              </p>
            </div>

            {/* 2. Purpose of the Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-[#25B181]" />
                2. Purpose of the Policy
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                This Policy has been formulated to:
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Provide a standardised, transparent, and fair mechanism for compromise settlements, loan settlements, and technical write-offs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Ensure full compliance with the RBI&apos;s Framework for Compromise Settlements &amp; Technical Write-offs (June 08, 2023).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Define detailed processes, documentation, approval authorities, due diligence steps, internal controls, and reporting requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Establish clear principles for determining settlement amounts, security valuation, hardship verification, and recovery options.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Prevent misuse, arbitrary waivers, conflicts of interest, and coercive recovery practices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Ensure settlements maximize recoveries at minimum cost.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Ensure prudential accounting &amp; provisioning norms are followed while writing off assets.</span>
                </li>
              </ul>
            </div>

            {/* 3. Definitions */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#25B181]" />
                3. Definitions
              </h2>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-[#25B181]" />
                  3.1 Compromise Settlement
                </h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  A negotiated agreement with a borrower to fully settle the Company&apos;s claims for a mutually agreed amount which is less than total dues, resulting in a sacrifice or waiver by the Company. (As per RBI definition)
                </p>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#25B181]" />
                  3.2 Loan Settlement / One-Time Settlement (OTS)
                </h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  A structured or lump-sum settlement for stressed or NPA accounts, usually involving upfront payment and closure within a short time frame.
                </p>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#25B181]" />
                  3.3 Full &amp; Final Settlement (F&amp;F)
                </h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  A lump-sum repayment made by the borrower in exchange for waiver of remaining dues.
                </p>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-[#25B181]" />
                  3.4 Technical Write-off
                </h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  An NPA loan where the borrower still legally owes the amount but the Company removes it from its books only for accounting purposes, without waiving the right to recover.
                </p>
              </div>
            </div>

            {/* 4. Eligibility Framework for Settlements */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#25B181]" />
                4. Eligibility Framework for Settlements
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">4.1 General Eligibility</h3>
                <p className="text-[#2b2b2b] leading-[1.7] mb-3">A loan may be considered for settlement when:</p>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>DPD &gt; 30 days and/or recovery probability &lt; 25% (based on internal metrics).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>NPA classification under IRACP norms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Account already written-off but borrower is now reachable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Borrower demonstrates genuine hardship.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Collateral value (for secured loans) insufficient to cover outstanding dues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Litigation cost is expected to exceed realizable recovery.</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-4 border-l-4 border-[#25B181]">
                  <h4 className="font-semibold mb-2">4.2 Payday / Short Duration Loans</h4>
                  <ul className="space-y-1 text-sm text-[#2b2b2b]">
                    <li>&#8226; Overdue &gt; 30 days</li>
                    <li>&#8226; High roll-rate and low likelihood of recovery</li>
                    <li>&#8226; Verified hardship</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-4 border-l-4 border-[#4A66FF]">
                  <h4 className="font-semibold mb-2">4.3 Personal Loans / EMI Loans</h4>
                  <ul className="space-y-1 text-sm text-[#2b2b2b]">
                    <li>&#8226; 90-180 DPD delinquency</li>
                    <li>&#8226; Borrower unable to meet EMI obligations</li>
                    <li>&#8226; Written-off accounts with potential for partial recovery</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-[#FF9C70]/10 to-[#FF9C70]/5 rounded-lg p-4 border-l-4 border-[#FF9C70]">
                  <h4 className="font-semibold mb-2">4.4 LAP (Loan Against Property)</h4>
                  <ul className="space-y-1 text-sm text-[#2b2b2b]">
                    <li>&#8226; Fresh valuation showing lower realizable value</li>
                    <li>&#8226; Litigation cost &gt; incremental recovery</li>
                    <li>&#8226; Borrower offers realistic settlement proposal</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-[#9B59B6]/10 to-[#9B59B6]/5 rounded-lg p-4 border-l-4 border-[#9B59B6]">
                  <h4 className="font-semibold mb-2">4.5 Corporate / Business Loans</h4>
                  <ul className="space-y-1 text-sm text-[#2b2b2b]">
                    <li>&#8226; Business closure / insolvency / severe cash-flow deterioration</li>
                    <li>&#8226; Market value of collateral less than outstanding</li>
                    <li>&#8226; Multiple recovery attempts unsuccessful</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Technical Write-Off Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-[#25B181]" />
                5. Technical Write-Off Policy
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Technical write-off does NOT reduce borrower liability. The write-off shall be effected only in the books of accounts of the Company.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Technical write-off accounts must continue to be actively pursued for recovery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Partial technical write-offs must ensure provisioning = 100% of gross exposure as required by RBI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Re-aging of accounts is not allowed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Any waiver must follow compromise settlement norms, not technical write-off norms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Recovery efforts, including legal action, collection follow-ups, or settlement negotiations, may continue even after the loan is written off in the books.</span>
                </li>
              </ul>
            </div>

            {/* 6. Determination of Settlement Amount */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-[#25B181]" />
                6. Determination of Settlement Amount
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">6.1 Components Considered</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center text-[#2b2b2b]">Principal outstanding</div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center text-[#2b2b2b]">Accrued interest</div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center text-[#2b2b2b]">Penal Charges</div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center text-[#2b2b2b]">Overdue charges</div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center text-[#2b2b2b]">Legal expenses</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">6.2 Factors Influencing Settlement Calculation</h3>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Recovery probability score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Borrower capacity analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Hardship proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Collateral distress valuation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Legal recovery timeframe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Previous recovery performance in similar cases</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 7. Delegation of Authority */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                7. Delegation of Authority (RBI Mandatory Requirement)
              </h2>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <p className="text-[#2b2b2b] leading-[1.7] font-semibold">
                  Settlement approvals must be one level higher than loan sanctioning authority.
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-3">Authority Matrix</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-[#25B181] text-white">
                      <th className="px-4 py-3 text-left font-semibold">Loan Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Exposure Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">Approving Authority</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#2b2b2b]">
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3">Payday / Small Loans</td>
                      <td className="px-4 py-3">Up to &#8377;1,00,000</td>
                      <td className="px-4 py-3">Collection Manager (Not loan sanctioning officer)</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-4 py-3">Personal/EMI Loans</td>
                      <td className="px-4 py-3">Up to &#8377;2,00,000</td>
                      <td className="px-4 py-3">Head - Collections</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3">LAP / Business Loans</td>
                      <td className="px-4 py-3">Up to &#8377;10,00,000</td>
                      <td className="px-4 py-3">Senior Vice President</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-4 py-3">Any Category</td>
                      <td className="px-4 py-3">Above &#8377;10,00,000</td>
                      <td className="px-4 py-3">Managing Director / Credit &amp; Recovery Committee</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Fraud / Wilful Defaulter Accounts</td>
                      <td className="px-4 py-3">Any Amount</td>
                      <td className="px-4 py-3">Board Approval</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[#2b2b2b] leading-[1.7] italic">
                All approvals are based on Due Past Days (DPD) of the customer.
              </p>
            </div>

            {/* 8. Detailed Settlement Workflow */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-[#25B181]" />
                8. Detailed Settlement Workflow
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#25B181]">Step 1: Borrower Communication</h3>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; Borrower request received in writing, email, app request, or call recorded.</li>
                    <li>&#8226; Borrower should be informed about credit bureau impact.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#25B181]">Step 2: KYC &amp; Hardship Verification</h3>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; Obtain supporting documents.</li>
                    <li>&#8226; Bureau history reviewed again.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#25B181]">Step 3: Recovery Assessment</h3>
                  <p className="text-[#2b2b2b] leading-[1.7] mb-3">A detailed assessment note must include:</p>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; Borrower demographics &amp; income data</li>
                    <li>&#8226; Updated KYC</li>
                    <li>&#8226; Loan summary (DPD, charges, prior payments)</li>
                    <li>&#8226; Legal status (notices, court filings)</li>
                    <li>&#8226; Recovery attempts log</li>
                    <li>&#8226; Economic rationale for settlement</li>
                    <li>&#8226; Recommended settlement amount</li>
                    <li>&#8226; Expected loss estimate vs. settlement recovery</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#25B181]">Step 4: Internal Reviews</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#25B181]/20 text-[#25B181] px-3 py-1 rounded-full text-sm font-medium">Collection team</span>
                    <span className="bg-[#4A66FF]/20 text-[#4A66FF] px-3 py-1 rounded-full text-sm font-medium">Credit team</span>
                    <span className="bg-[#FF9C70]/20 text-[#E07840] px-3 py-1 rounded-full text-sm font-medium">Legal team</span>
                    <span className="bg-[#9B59B6]/20 text-[#9B59B6] px-3 py-1 rounded-full text-sm font-medium">Board of Directors (for &gt;&#8377;10 lakh)</span>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">Finance team for accounting correctness</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#25B181]">Step 5: Approval</h3>
                  <p className="text-[#2b2b2b] leading-[1.7] mb-3">Settlement letter issued with:</p>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; Amount payable</li>
                    <li>&#8226; Amount waived</li>
                    <li>&#8226; Payment deadline</li>
                    <li>&#8226; Consequences of default</li>
                    <li>&#8226; Bureau impact</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#25B181]">Step 6: Payment</h3>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; Modes of Payments allowed (UPI/NEFT/RTGS).</li>
                    <li>&#8226; Payment must be completed within settlement validity period.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#25B181]">Step 7: Closure &amp; Documentation</h3>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; NOC issued</li>
                    <li>&#8226; CIBIL reported as &quot;Settled / Written-off Settled&quot;</li>
                    <li>&#8226; Legal withdrawal/consent decree (if in court)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 9. Fresh Loan Eligibility */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#25B181]" />
                9. Fresh Loan Eligibility for Settlement and Write-off Accounts
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Company does not provide fresh loans to customers whose accounts were settled under compromise or classified as technical write-off. Exceptions may be granted on specific customer request, subject to proper verification of the case, assessment of creditworthiness, and approval by the competent authority.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-[#2b2b2b] leading-[1.7]">
                  <strong>A general cooling period of 12-18 months shall be observed.</strong>
                </p>
              </div>
            </div>

            {/* 10. Accounting Treatment */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#25B181]" />
                10. Accounting Treatment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-6 border-l-4 border-[#25B181]">
                  <h3 className="text-lg font-semibold mb-3">In Case of Settlement</h3>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; Waiver must be booked as a loss.</li>
                    <li>&#8226; Recovery posted to loan account accordingly.</li>
                    <li>&#8226; Written-off assets must be reported separately in financial statements.</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-6 border-l-4 border-[#4A66FF]">
                  <h3 className="text-lg font-semibold mb-3">In Case of Write-off</h3>
                  <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                    <li>&#8226; Upon write-off, the outstanding principal and accrued interest (if any) shall be removed from the books by debiting the Loan Loss Provision Account.</li>
                    <li>&#8226; Any subsequent recoveries from written-off accounts shall be recognized as Other Income / Recovery from Written-Off Accounts in the period in which they are realized.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 11. Monitoring, Audit & Reporting */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#25B181]" />
                11. Monitoring, Audit &amp; Reporting
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">11.1 Internal Monitoring</h3>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Monthly MIS of settlements and write-offs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>High-risk accounts flagged to senior management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Sampling audits of settlements</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">11.2 Audit Requirements</h3>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Internal audit to verify documentation, approvals &amp; compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Statutory auditor review at year-end</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">11.3 Mandatory Reporting to Board</h3>
                <p className="text-[#2b2b2b] leading-[1.7] mb-3">Quarterly, covering:</p>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Number &amp; value of settlements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Segment-wise data (payday/personal/LAP/business)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Settlement-wise sacrifice reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Fraud/wilful defaulter settlement cases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>Technical write-off recoveries</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 12. Review of Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#25B181]" />
                12. Review of Policy
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Annual review by Board.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Interim review if RBI issues new directions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>All amendments recorded and notified internally.</span>
                </li>
              </ul>
            </div>

            {/* 13. Effective Date */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#25B181]" />
                13. Effective Date
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                This Loan Settlement Policy is approved by the Board of Directors of Satsai Finlease Private Limited at its meeting held on <strong>April 21, 2025</strong> and shall be effective from the same date.
              </p>
            </div>

            {/* Signatory */}
            <div className="mb-10">
              <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-6 h-6 text-[#25B181]" />
                  For Satsai Finlease Private Limited
                </h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  <strong>Authorized Signatory</strong>
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
