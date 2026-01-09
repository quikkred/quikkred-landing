'use client';

import { motion } from "framer-motion";
import { RefreshCw, CreditCard, Clock, FileText, Building } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function RefundCancellationPage() {
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
            <RefreshCw className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Refund and Cancellation
            </h1>
            <p className="text-xl">Our Policy on Refunds &amp; Cancellations</p>
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
            {/* Document Details */}
            <div className="mb-10 bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#25B181]" />
                Document Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2b2b2b] leading-[1.7]">
                <div><span className="font-semibold">Title:</span> Refund and Cancellation Policy</div>
                <div><span className="font-semibold">Classification:</span> Public</div>
                <div><span className="font-semibold">Effective Date:</span> 1st April 2025</div>
                <div><span className="font-semibold">Approved by:</span> Board of Directors</div>
              </div>
            </div>

            {/* Refund and Cancellation Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#25B181]" />
                Refund and Cancellation
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                Satsai Finlease Private Limited will automatically start billing as per Your selected Payment Method for the relevant Subscription plan(s) and any Add-on(s) selected by You at the time of registration through the third party payment gateway.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The cancellation of a Subscription can be done through the &quot;My Account&quot; section of the Site.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-[#2b2b2b] leading-[1.7]">
                    It may take up to <strong>three business days</strong> for Your payment made to Satsai Finlease Private Limited to be reflected in your Bank Account.
                  </p>
                </div>
              </div>
            </div>

            {/* Board Approval */}
            <div className="mb-10">
              <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-6 h-6 text-[#25B181]" />
                  Board Approval
                </h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  <strong>Approved by:</strong> Board of Directors, Satsai Finlease Private Limited
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
