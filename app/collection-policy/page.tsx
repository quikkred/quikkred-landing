"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CollectionPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-[#1a936f] to-[#25B181] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              QuikkRed Debt Collection Policy
            </h1>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#25B181] hover:text-[#1a936f] font-medium mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 sm:p-8 lg:p-12">
              {/* Effective Date */}
              <p className="text-gray-600 text-sm sm:text-base mb-10 pb-6 border-b border-gray-100">
                <span className="font-semibold text-gray-800">Effective Date:</span> January 1, 2026
              </p>

              {/* Section 1 */}
              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-start gap-3">
                  <span className="text-[#25B181]">1.</span>
                  Objective and Principles
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  This policy outlines the ethical and fair procedures QuikkRed (the "Company") follows for the
                  collection of outstanding debts from borrowers. All collection activities must strictly adhere
                  to the Reserve Bank of India (RBI) Fair Practices Code and must be conducted professionally,
                  courteously, and with respect for the borrower's privacy.
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-start gap-3">
                  <span className="text-[#25B181]">2.</span>
                  Communication Standards
                </h2>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#1a936f] to-[#25B181]">
                        <th className="text-left text-white font-semibold py-4 px-4 sm:px-6 text-sm sm:text-base">
                          Communication Channel
                        </th>
                        <th className="text-left text-white font-semibold py-4 px-4 sm:px-6 text-sm sm:text-base">
                          Timing and Frequency
                        </th>
                        <th className="text-left text-white font-semibold py-4 px-4 sm:px-6 text-sm sm:text-base">
                          Guidelines
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 sm:px-6 text-gray-800 font-medium text-sm sm:text-base">
                          Calls/Emails
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                          During business hours (10:00 AM–7:00 PM)
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                          Respect borrower convenience and avoid excessive contact
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 sm:px-6 text-gray-800 font-medium text-sm sm:text-base">
                          Physical Visits
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                          Based on prior appointment and RBI guidelines
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                          Identification and courtesy mandatory
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-start gap-3">
                  <span className="text-[#25B181]">3.</span>
                  Training and Certification
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  All collection agents (both internal staff and third-party agencies) must be trained on this
                  Policy, the RBI's Fair Practices Code, and data privacy regulations. Only certified agents
                  are permitted to engage with borrowers.
                </p>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-start gap-3">
                  <span className="text-[#25B181]">4.</span>
                  Grievance Redressal
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Any customer complaint regarding the collection process must be immediately reported to the
                  Grievance Redressal Officer (GRO) as outlined in the separate Grievance Redressal Mechanism document.
                </p>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-start gap-3">
                  <span className="text-[#25B181]">5.</span>
                  Prohibition
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                  Collection agents are strictly prohibited from using:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-600 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-[#25B181] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Abusive, threatening, or vulgar language</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-[#25B181] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Intimidation or harassment of the borrower, their family, or friends</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-[#25B181] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Public disclosure or defamation of the borrower's debt status</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-[#25B181] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Making false or misleading representations</span>
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-start gap-3">
                  <span className="text-[#25B181]">6.</span>
                  Authority
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  The Head of Collections (<span className="font-semibold text-gray-800">Ms. Sapna Kapoor</span>,{" "}
                  <a
                    href="mailto:collections-head@quikkred.com"
                    className="text-[#25B181] hover:text-[#1a936f] underline transition-colors"
                  >
                    collections-head@quikkred.com
                  </a>
                  ) is responsible for the oversight and enforcement of this Policy.
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-center text-gray-500 text-sm mt-8">
              This policy is subject to periodic review and updates in accordance with regulatory requirements.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
