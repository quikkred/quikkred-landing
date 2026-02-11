'use client';

import { motion } from "framer-motion";
import { AlertTriangle, Shield, FileText, Building, Eye, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function DisclaimerDisclosurePage() {
  const { t } = useLanguage();
  const d = t?.policies?.disclaimerDisclosure
  console.log(d)
  // console.log(sections)

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
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              {d?.hero?.title || "Disclaimer and Disclosure"}
            </h1>
            <p className="text-xl">{d?.hero?.subtitle || "Important Information for Our Users"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Document Details */}
        <div className="mb-10 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {d?.documentDetails?.title || "Document Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2b2b2b] leading-[1.7]">
            <div><span className="font-semibold">{d?.documentDetails?.fields?.titleLabel || "Title:"}</span> {d?.documentDetails?.fields?.titleValue || "Disclaimer and Disclosure"}</div>
            <div><span className="font-semibold">{d?.documentDetails?.fields?.classificationLabel || "Classification:"}</span> {d?.documentDetails?.fields?.classificationValue || "Public"}</div>
            <div><span className="font-semibold">{d?.documentDetails?.fields?.effectiveDateLabel || "Effective Date:"}</span> {d?.documentDetails?.fields?.effectiveDateValue || "1st April 2025"}</div>
            <div><span className="font-semibold">{d?.documentDetails?.fields?.approvedByLabel || "Approved by:"}</span> {d?.documentDetails?.fields?.approvedByValue || "Board of Directors"}</div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#25B181]" />
            {d?.disclaimerSection?.title || "Disclaimer"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {d?.disclaimerSection?.paragraphs[0] || "We would like to bring to notice, to all those availing of our services that we are an authentic loan providing organization with imperative assent from the RBI to disburse loans to eligible clients."}
          </p>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {d?.disclaimerSection?.paragraphs[1] || "It has come to our attention that imposters and deceitful individuals are impersonating us through illicit means and demanding elicit fee charges with the bogus guarantee of giving them loans."}
          </p>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <p className="text-[#2b2b2b] leading-[1.7]">
                <strong>{d?.disclaimerSection?.warning?.label || "Warning:"}</strong> {d?.disclaimerSection?.warning?.textBefore || "We strongly reprimand this fake and deceitful impersonation and hereby alert the general public that"} <strong>{d?.disclaimerSection?.warning?.textBold || "we do not charge any upfront fees against our loans"}</strong>. {d?.disclaimerSection?.warning?.textAfter || "Anyone claiming to do so is not part of our organization."}
              </p>
            </div>
          </div>
        </div>

        {/* Disclosure Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-[#25B181]" />
            {d?.disclosureSection?.title || "Disclosure"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {d?.disclosureSection?.paragraph || "We have noticed that some malicious individuals have started creating fake entities because of some illegal practices. Please report any such activities to your jurisdiction as soon as possible."}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-[#2b2b2b] leading-[1.7]">
                {d?.disclosureSection?.securityNotice?.textBefore || "At"} <strong>{d?.disclosureSection?.securityNotice?.textBold[0] || "Quikkred"}</strong>{d?.disclosureSection?.securityNotice?.textAfter[0] || "we advise the public, prospects, and customers"} <strong>{d?.disclosureSection?.securityNotice?.textBold[0] || "not to share OTP/password with anyone"}</strong> {d?.disclosureSection?.securityNotice?.textAfter[1] || "including Quikkred staff."}
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>{d?.disclosureSection?.liabilityNotice?.label || "Please note:"}</strong> {d?.disclosureSection?.liabilityNotice?.text || "Anyone dealing with scammers does so at their own risk and responsibility. Quikkred takes no responsibility for the losses suffered."}
            </p>
          </div>
        </div>

        {/* Board Approval */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Building className="w-6 h-6 text-[#25B181]" />
              {d?.boardApproval?.title || "Board Approval"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>{d?.boardApproval?.approvedByLabel || "Approved by:"}</strong> {d?.boardApproval?.approvedByText || "Board of Directors, Satsai Finlease Private Limited"}
            </p>
          </div>
        </div>
      </PoliciesLayout>
    </div>
  );
}
