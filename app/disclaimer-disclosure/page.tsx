'use client';

import { motion } from "framer-motion";
import { AlertTriangle, Shield, FileText, Building, Eye, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function DisclaimerDisclosurePage() {
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
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Disclaimer and Disclosure
            </h1>
            <p className="text-xl">Important Information for Our Users</p>
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
                <div><span className="font-semibold">Title:</span> Disclaimer and Disclosure</div>
                <div><span className="font-semibold">Classification:</span> Public</div>
                <div><span className="font-semibold">Effective Date:</span> 1st April 2025</div>
                <div><span className="font-semibold">Approved by:</span> Board of Directors</div>
              </div>
            </div>

            {/* Disclaimer Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#25B181]" />
                Disclaimer
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                We would like to bring to notice, to all those availing of our services that we are an authentic loan providing organization with imperative assent from the RBI to disburse loans to eligible clients.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                It has come to our attention that imposters and deceitful individuals are impersonating us through illicit means and demanding elicit fee charges with the bogus guarantee of giving them loans.
              </p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-[#2b2b2b] leading-[1.7]">
                    <strong>Warning:</strong> We strongly reprimand this fake and deceitful impersonation and hereby alert the general public that <strong>we do not charge any upfront fees against our loans</strong>. Anyone claiming to do so is not part of our organization.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclosure Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#25B181]" />
                Disclosure
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                We have noticed that some malicious individuals have started creating fake entities because of some illegal practices. Please report any such activities to your jurisdiction as soon as possible.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-[#2b2b2b] leading-[1.7]">
                    At <strong>Quikkred</strong>, we advise the public, prospects, and customers <strong>not to share OTP/password with anyone</strong>, including Quikkred staff.
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-[#2b2b2b] leading-[1.7]">
                  <strong>Please note:</strong> Anyone dealing with scammers does so at their own risk and responsibility. Quikkred takes no responsibility for the losses suffered.
                </p>
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
                  <strong>Approved by:</strong> Board of Directors, Satsai Finance Private Limited
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
