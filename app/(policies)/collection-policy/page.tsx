'use client';

import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, Clock, Shield, Users, AlertTriangle, UserCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function CollectionPolicyPage() {
  const { t } = useLanguage();

  const cp = t?.policies?.collectionPolicy;

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
              {cp?.title || "Quikkred Debt Collection Policy"}
            </h1>
            <p className="text-xl">{cp?.subtitle || "Fair and Ethical Debt Recovery Practices"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout
        effectiveDateText={t?.policies?.common?.effectiveDate || "Effective Date"}
        effectiveDate={cp?.effectiveDate}
      >
            {/* Section 1: Objective and Principles */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#25B181]" />
                {cp?.sections?.objective?.title || "1. Objective and Principles"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {cp?.sections?.objective?.content || "This policy outlines the ethical and fair procedures Quikkred (the \"Company\") follows for the collection of outstanding debts from borrowers. All collection activities must strictly adhere to the Reserve Bank of India (RBI) Fair Practices Code and must be conducted professionally, courteously, and with respect for the borrower's privacy."}
              </p>
            </div>

            {/* Section 2: Communication Standards */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Phone className="w-6 h-6 text-[#25B181]" />
                {cp?.sections?.communication?.title || "2. Communication Standards"}
              </h2>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1a936f] to-[#25B181]">
                      <th className="text-left text-white font-semibold py-4 px-4 sm:px-6 text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.channel || "Communication Channel"}
                      </th>
                      <th className="text-left text-white font-semibold py-4 px-4 sm:px-6 text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.timing || "Timing and Frequency"}
                      </th>
                      <th className="text-left text-white font-semibold py-4 px-4 sm:px-6 text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.guidelines || "Guidelines"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 text-gray-800 font-medium text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.rows?.calls?.channel || "Calls/Emails"}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.rows?.calls?.timing || "During business hours (10:00 AM–7:00 PM)"}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.rows?.calls?.guidelines || "Respect borrower convenience and avoid excessive contact"}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 text-gray-800 font-medium text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.rows?.visits?.channel || "Physical Visits"}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.rows?.visits?.timing || "Based on prior appointment and RBI guidelines"}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm sm:text-base">
                        {cp?.sections?.communication?.table?.rows?.visits?.guidelines || "Identification and courtesy mandatory"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Training and Certification */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#25B181]" />
                {cp?.sections?.training?.title || "3. Training and Certification"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {cp?.sections?.training?.content || "All collection agents (both internal staff and third-party agencies) must be trained on this Policy, the RBI's Fair Practices Code, and data privacy regulations. Only certified agents are permitted to engage with borrowers."}
              </p>
            </div>

            {/* Section 4: Grievance Redressal */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                {cp?.sections?.grievance?.title || "4. Grievance Redressal"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {cp?.sections?.grievance?.content || "Any customer complaint regarding the collection process must be immediately reported to the Grievance Redressal Officer (GRO) as outlined in the separate Grievance Redressal Mechanism document."}
              </p>
            </div>

            {/* Section 5: Prohibition */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#25B181]" />
                {cp?.sections?.prohibition?.title || "5. Prohibition"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{cp?.sections?.prohibition?.intro || "Collection agents are strictly prohibited from using:"}</p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                {(cp?.sections?.prohibition?.items || [
                  "Abusive, threatening, or vulgar language",
                  "Intimidation or harassment of the borrower, their family, or friends",
                  "Public disclosure or defamation of the borrower's debt status",
                  "Making false or misleading representations"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6: Authority */}
            <div className="mb-10 bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#25B181]" />
                {cp?.sections?.authority?.title || "6. Authority"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {cp?.sections?.authority?.content || "The Head of Collections"} (<span className="font-semibold">{cp?.sections?.authority?.name || "Ms. Sapna Kapoor"}</span>,{" "}
                <a
                  href={`mailto:${cp?.sections?.authority?.email || "collections-head@quikkred.com"}`}
                  className="text-[#25B181] hover:text-[#1a936f] underline transition-colors"
                >
                  {cp?.sections?.authority?.email || "collections-head@quikkred.com"}
                </a>
                ) {cp?.sections?.authority?.suffix || "is responsible for the oversight and enforcement of this Policy."}
              </p>
            </div>

            {/* Footer Note */}
            <p className="text-center text-gray-500 text-sm">
              {cp?.footerNote || "This policy is subject to periodic review and updates in accordance with regulatory requirements."}
            </p>
      </PoliciesLayout>
    </div>
  );
}
