'use client';

import { motion } from "framer-motion";
import { RefreshCw, CreditCard, Clock, FileText, Building } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function RefundCancellationPage() {
  const { t } = useLanguage();
  // title >> sections >> documentDetails >> fields
  const refund = t?.policies?.refund;
  console.log(refund)
  const sections = refund?.sections.documentDetails.fields;
  const p = refund?.sections.refundPolicy;
  const b = refund?.sections.boardApproval;
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
            <RefreshCw className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              {refund?.title || "Refund and Cancellation"}
            </h1>
            <p className="text-xl">{refund?.subtitle || "Our Policy on Refunds &amp; Cancellations"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout
        effectiveDateText={t?.policies?.common?.effectiveDate || "Effective Date"}
        effectiveDate={refund?.effectiveDate || "January 1, 2026"}
      >
        {/* Document Details */}
        <div className="mb-10 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {sections.title || "Document Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2b2b2b] leading-[1.7]">
            <div><span className="font-semibold">{sections.titleLabel || "Title"}:</span> {sections.titleValue || "Refund and Cancellation Policy"}</div>
            <div><span className="font-semibold">{sections.classificationLabel || "Classification"}:</span> {sections.classificationValue || "Public"}</div>
            <div><span className="font-semibold">{sections.effectiveDateLabel || "Effective Date"}:</span> {sections.effectiveDateValue || "1st April 2025"}</div>
            <div><span className="font-semibold">{sections.approvedByLabel || "Approved by"}:</span> {sections.approvedByValue || "Board of Directors"}</div>
          </div>
        </div>

        {/* Refund and Cancellation Policy */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#25B181]" />
            {p.title || "Refund and Cancellation"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {p.paragraph1 || "Satsai Finlease Private Limited will automatically start billing as per Your selected Payment Method for the relevant Subscription plan(s) and any Add-on(s) selected by You at the time of registration through the third party payment gateway."}
          </p>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {p.paragraph2 || "The cancellation of a Subscription can be done through the &quot;My Account&quot; section of the Site."}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-[#2b2b2b] leading-[1.7]">
                {p.processingTime.prefix || "It may take up to"} <strong>{p.processingTime.highlight || "three business days"}</strong> {p.processingTime.suffix || "for Your payment made to Satsai Finlease Private Limited to be reflected in your Bank Account."}
              </p>
            </div>
          </div>
        </div>

        {/* Board Approval */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Building className="w-6 h-6 text-[#25B181]" />
              {b.title|| "Board Approval"}
            </h3>
            <p className="text-[#2b2b2b] leading-[1.7]">
              <strong>{b.content || "Approved by"}:</strong> {b.value|| "Board of Directors, Satsai Finlease Private Limited"}
            </p>
          </div>
        </div>
      </PoliciesLayout>
    </div >
  );
}
