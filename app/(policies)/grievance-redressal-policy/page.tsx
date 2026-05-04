'use client';

import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, AlertCircle, Users, Headphones, Building, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function GrievanceRedressalPolicyPage() {
  const { t } = useLanguage();
  const grp = t?.policies?.grievanceRedressal;

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
            <Headphones className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              {grp?.title || "Grievance Redressal Policy"}
            </h1>
            <p className="text-xl">{grp?.subtitle || "We're Here to Help Resolve Your Concerns"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Introduction */}
        <div className="mb-10">
          <p className="text-[#2b2b2b] leading-[1.7]">
            {grp?.introduction || "Quikkred is committed to providing excellent customer service and resolving customer grievances in a timely and efficient manner. This Grievance Redressal Policy outlines the process for customers to escalate their concerns and the timelines within which they can expect resolution."}
          </p>
        </div>

        {/* Level 1: Customer Service */}
        <div className="mb-10 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-[#25B181]" />
            {grp?.levels?.level1?.title || "LEVEL 1: Customer Service/Helpdesk"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {grp?.levels?.level1?.description || "For any queries, complaints, or feedback, customers can reach out to our Customer Service team through the following channels:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.levels?.level1?.helplineLabel || "Helpline No."}:</strong> {grp?.levels?.level1?.helpline || "+91-9311913854"}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.levels?.level1?.emailLabel || "Email Id"}:</strong> {grp?.levels?.level1?.email || "support@quikkred.com"}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.levels?.level1?.timingsLabel || "Timings"}:</strong> {grp?.levels?.level1?.timings || "Monday to Saturday (10 am to 6 pm)"}</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4">
            {grp?.levels?.level1?.resolution || "Our Customer Service team will acknowledge your complaint within 24 hours and endeavor to resolve it within 7 working days. If your complaint is not resolved within this timeframe or if you are not satisfied with the resolution, you may escalate to Level 2."}
          </p>
        </div>

        {/* Level 2: CRM */}
        <div className="mb-10 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#25B181]" />
            {grp?.levels?.level2?.title || "LEVEL 2: Customer Relationship Manager (CRM)"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {grp?.levels?.level2?.description || "If your grievance is not resolved at Level 1 within 7 working days, or if you are dissatisfied with the resolution provided, you may escalate the matter to our Customer Relationship Manager:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            <li className="flex items-start gap-2">
              <Users className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.levels?.level2?.contactNameLabel || "Contact Name"}:</strong> {grp?.levels?.level2?.contactName || "Mr. Anuj Patel"}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.levels?.level2?.emailLabel || "Email Id"}:</strong> {grp?.levels?.level2?.email || "support@quikkred.com"}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.levels?.level2?.timingsLabel || "Timings"}:</strong> {grp?.levels?.level2?.timings || "Monday to Friday (11 am to 5 pm)"}</span>
            </li>
          </ul>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4">
            {grp?.levels?.level2?.resolution || "The Customer Relationship Manager will review your complaint and provide a resolution within 7 working days of receiving the escalation. If your complaint remains unresolved or you are not satisfied, you may escalate to Level 3."}
          </p>
        </div>

        {/* Level 3: GRO/Nodal Officer */}
        <div className="mb-10 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Building className="w-6 h-6 text-[#25B181]" />
            {grp?.levels?.level3?.title || "LEVEL 3: Grievance Redressal Officer (GRO) / Nodal Officer"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {grp?.levels?.level3?.description || "If your grievance remains unresolved after escalation to Level 2, or if you are not satisfied with the resolution provided, you may escalate the matter to our Grievance Redressal Officer (Nodal Officer):"}
          </p>
          <div className="bg-white rounded-lg p-4 border border-teal-300">
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              <li><strong>{grp?.levels?.level3?.officerLabel || "Grievance Redressal Officer (Nodal Officer)"}:</strong> {grp?.levels?.level3?.officerName || "Ms. Deepika Kwatra"}</li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
                <span><strong>{grp?.levels?.level3?.addressLabel || "Address"}:</strong> {grp?.levels?.level3?.address || "Quikkred, 1008, 13th floor, Vikrant Tower, Rajendra Place, New Delhi - 110008"}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
                <span><strong>{grp?.levels?.level3?.contactLabel || "Contact No."}:</strong> {grp?.levels?.level3?.contact || "+91-9311913854"}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
                <span><strong>{grp?.levels?.level3?.emailLabel || "Email Id"}:</strong> {grp?.levels?.level3?.email || "grievance@quikkred.in"}</span>
              </li>
            </ul>
          </div>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4">
            {grp?.levels?.level3?.resolution || "The Grievance Redressal Officer will review your complaint and provide a final resolution within 15 working days of receiving the escalation."}
          </p>
        </div>

        {/* RBI Ombudsman */}
        <div className="mb-10 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="w-6 h-6 text-[#25B181]" />
            {grp?.rbiOmbudsman?.title || "Escalation to RBI Ombudsman"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {grp?.rbiOmbudsman?.description || "If your complaint is not resolved within 30 days from the date of lodging, or if you are not satisfied with the final resolution provided by the Grievance Redressal Officer, you may approach the Reserve Bank of India (RBI) Ombudsman under the Integrated Ombudsman Scheme."}
          </p>
          <p className="text-[#2b2b2b] leading-[1.7] mt-4">
            {grp?.rbiOmbudsman?.channelsIntro || "You can file a complaint with the RBI Ombudsman through the following channels:"}
          </p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7] mt-4">
            <li className="flex items-start gap-2">
              <ExternalLink className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.rbiOmbudsman?.onlineLabel || "Online"}:</strong> {grp?.rbiOmbudsman?.onlineUrl || "https://cms.rbi.org.in"}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.rbiOmbudsman?.emailLabel || "Email"}:</strong> {grp?.rbiOmbudsman?.email || "crpc@rbi.org.in"}</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-[#25B181] mt-1 flex-shrink-0" />
              <span><strong>{grp?.rbiOmbudsman?.tollFreeLabel || "Toll-Free Number"}:</strong> {grp?.rbiOmbudsman?.tollFree || "14448"}</span>
            </li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#25B181]" />
            {grp?.importantNotes?.title || "Important Notes"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            {(grp?.importantNotes?.items || [
              "All complaints should include relevant details such as loan account number, contact information, and a clear description of the issue.",
              "A unique complaint reference number will be provided for tracking purposes.",
              "Quikkred is committed to treating all complaints fairly and confidentially.",
              "This policy is subject to periodic review and may be updated as per regulatory requirements."
            ]).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </PoliciesLayout>
    </div>
  );
}
