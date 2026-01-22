'use client';

import { motion } from "framer-motion";
import { FileText, BookOpen, Target, Building, Clock, Users, ClipboardList, DollarSign, Activity, Layers, TrendingUp, PieChart, BarChart3, Briefcase, Shield, CheckCircle, Calendar, Landmark, Coins, FileCheck, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function InvestmentPolicyPage() {
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
            <TrendingUp className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Investment Policy
            </h1>
            <p className="text-xl">Guidelines for Investment &amp; Management of Funds</p>
            <p className="text-sm mt-2 opacity-90">Satsai Finance Pvt. Ltd.</p>
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

            {/* Document Details */}
            <div className="mb-10 bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#25B181]" />
                Document Details
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-[#25B181] text-white">
                      <th className="px-4 py-3 text-left font-semibold">Particulars</th>
                      <th className="px-4 py-3 text-left font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#2b2b2b]">
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium">Title</td>
                      <td className="px-4 py-3">Investment Policy</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-4 py-3 font-medium">Classification</td>
                      <td className="px-4 py-3">Internal</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium">Approval Date</td>
                      <td className="px-4 py-3">21st April 2025</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-4 py-3 font-medium">Last Review Date</td>
                      <td className="px-4 py-3">-</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium">Approved by</td>
                      <td className="px-4 py-3">Board of Directors</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Custodian</td>
                      <td className="px-4 py-3">Operation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[#2b2b2b] leading-[1.7] mt-4 italic">
                This policy was adopted by the Board of Directors of &quot;Satsai Finance Pvt. Ltd.&quot; on &quot;21st April 2025&quot;, to provide guidelines for investment and management of idle funds kept in the bank account.
              </p>
            </div>

            {/* Purpose */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-[#25B181]" />
                Purpose
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The purpose of this policy is to invest idle funds for short term as well as long term period as required, to earn sufficient returns to meet the operational obligation of the company in a timely manner. For the purposes of managing investment risk and to optimize investment return, idle funds shall be invested as follows:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-4 border-l-4 border-[#25B181] flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-[#25B181] flex-shrink-0" />
                  <span className="text-[#2b2b2b]">Fixed Deposits with Banks</span>
                </div>
                <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-4 border-l-4 border-[#4A66FF] flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#4A66FF] flex-shrink-0" />
                  <span className="text-[#2b2b2b]">Fixed Deposits against overdraft facility with banks</span>
                </div>
                <div className="bg-gradient-to-br from-[#FF9C70]/10 to-[#FF9C70]/5 rounded-lg p-4 border-l-4 border-[#FF9C70] flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-[#E07840] flex-shrink-0" />
                  <span className="text-[#2b2b2b]">Certificates of Deposit at insured commercial banking organizations</span>
                </div>
                <div className="bg-gradient-to-br from-[#9B59B6]/10 to-[#9B59B6]/5 rounded-lg p-4 border-l-4 border-[#9B59B6] flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#9B59B6] flex-shrink-0" />
                  <span className="text-[#2b2b2b]">Money market funds that invest in government backed securities</span>
                </div>
                <div className="bg-gradient-to-br from-[#3498DB]/10 to-[#3498DB]/5 rounded-lg p-4 border-l-4 border-[#3498DB] flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#3498DB] flex-shrink-0" />
                  <span className="text-[#2b2b2b]">Investment in market linked securities</span>
                </div>
                <div className="bg-gradient-to-br from-[#1ABC9C]/10 to-[#1ABC9C]/5 rounded-lg p-4 border-l-4 border-[#1ABC9C] flex items-center gap-3">
                  <Coins className="w-5 h-5 text-[#1ABC9C] flex-shrink-0" />
                  <span className="text-[#2b2b2b]">Liquid Funds</span>
                </div>
              </div>
            </div>

            {/* Classification of Investment */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#25B181]" />
                Classification of Investment
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The investment is classified into current and long term investment. Depending on the requirement, the investment shall be made in the following instruments for long term and short term purpose:
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Fixed Deposits with Banks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Fixed Deposits against overdraft facility with banks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Certificates of Deposit at insured commercial banking organizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Money market funds that invest in government backed securities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Investment in market linked securities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Liquid Funds</span>
                </li>
              </ul>
              <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4">
                <p className="text-[#2b2b2b] leading-[1.7]">
                  <strong>Note:</strong> To invest in capital market, mutual fund, prior approval of Board of Directors shall be required.
                </p>
              </div>
            </div>

            {/* Valuation / Limit of Investment */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-[#25B181]" />
                Valuation / Limit of Investment
              </h2>
              <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
                <p className="text-[#2b2b2b] leading-[1.7]">
                  Investment shall be limited to the maximum of <strong>5 times of Net Worth</strong> of the Company at any point of time. Beyond 5 times of net worth, approval of Board of Directors would be required.
                </p>
              </div>
            </div>

            {/* Procedure */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-[#25B181]" />
                Procedure
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The following procedures will be followed to ensure the investment policy is consistent with the mission of Company and accurately reflects current financial conditions:
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">1</div>
                  <p className="text-[#2b2b2b] leading-[1.7]">The Board of Directors shall review this investment policy on an annual basis.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#4A66FF] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">2</div>
                  <p className="text-[#2b2b2b] leading-[1.7]">The Board of Directors can incorporate any changes in this policy, if required.</p>
                </div>
              </div>
            </div>

            {/* Delegation of Authority */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                Delegation of Authority
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Directors of the company be and is hereby authorised to determine the amounts to be placed in each of the various instruments.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Directors are responsible for directing and monitoring the investment management of the various fund assets of the company. As such, the Directors are authorized to delegate certain responsibilities to professional experts in various fields including hiring or replacing of them. These include, but are not limited to:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#25B181]/20 text-[#25B181] px-4 py-2 rounded-full text-sm font-medium">Investment Management Consultant</span>
                <span className="bg-[#4A66FF]/20 text-[#4A66FF] px-4 py-2 rounded-full text-sm font-medium">Investment Manager</span>
                <span className="bg-[#FF9C70]/20 text-[#E07840] px-4 py-2 rounded-full text-sm font-medium">Custodian</span>
                <span className="bg-[#9B59B6]/20 text-[#9B59B6] px-4 py-2 rounded-full text-sm font-medium">Additional Specialists</span>
              </div>
            </div>

            {/* Investment Rationale */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#25B181]" />
                Investment Rationale
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                Short and long-term cash forecasts will be utilized to determine feasibility of each investment made. In order to limit interest rate or market risk, effective investment duration will be one year or less.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7]">
                An attempt will be made to match investment duration with expected cash flow requirements. However, pre-maturity is permissible for cash flow requirements or improvement in the portfolio of the funds.
              </p>
            </div>

            {/* Guidelines for Investment */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#25B181]" />
                Guidelines for Investment
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
                    <p className="text-[#2b2b2b] leading-[1.7]">
                      Funds shall be created solely in the interest of the Company.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
                    <p className="text-[#2b2b2b] leading-[1.7]">
                      Idle cash/funds shall be invested with skill, care, prudence and diligence under the circumstances then prevailing that a prudent investor acting in like capacity and familiar with such matters would use in the investment of a like fund.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
                    <p className="text-[#2b2b2b] leading-[1.7]">
                      Investment in these funds shall be so diversified as per the operational requirement to minimize the risk of large losses, unless under the circumstances it is clearly prudent not to do so.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
                    <p className="text-[#2b2b2b] leading-[1.7]">
                      One or more banks/FIs/Investment managers of varying styles and philosophies may be employed to manage the funds.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reporting Requirements */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-[#25B181]" />
                Reporting Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#25B181]/10 to-[#25B181]/5 rounded-lg p-6 border-l-4 border-[#25B181]">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#25B181]" />
                    Quarterly Reporting
                  </h3>
                  <p className="text-[#2b2b2b] leading-[1.7]">
                    The committee shall be appraised with details of such investment on every quarter. Detailed information about asset allocation, investment performance, future investment strategies, and other matters of interest shall be clearly communicated to the Committee.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-[#4A66FF]/10 to-[#4A66FF]/5 rounded-lg p-6 border-l-4 border-[#4A66FF]">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#4A66FF]" />
                    Annual Review
                  </h3>
                  <p className="text-[#2b2b2b] leading-[1.7]">
                    An annual review of performance of the portfolio shall be reviewed by the committee. Investment objectives will be reviewed to determine if they are being met.
                  </p>
                </div>
              </div>
            </div>

            {/* Signatory */}
            <div className="mb-10">
              <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-6 h-6 text-[#25B181]" />
                  For Satsai Finance Private Limited
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
