'use client';

import { motion } from "framer-motion";
import { Lock, Shield, Eye, Database, UserCheck, Bell, Globe, Mail, FileText, AlertCircle, RefreshCw, Scale } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PrivacyPage() {
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
            <Lock className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Privacy Policy
            </h1>
            <p className="text-xl">Your privacy is our priority</p>
            <p className="text-sm mt-2 opacity-90">Effective Date: 18-02-2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            {/* 1. Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#25B181]" />
                1. Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                Quikkred, a brand of Fluxusforge Private Limited, operates as a Lending Service Provider (LSP), in partnership with Satsai Finlease Private Limited (an RBI-registered NBFC) for loan disbursement. This Privacy Policy governs all users of Quikkred&apos;s all digital platforms, ensuring compliance with RBI Digital Lending Directions 2025 and the Digital Personal Data Protection Act 2023 (DPDPA).
              </p>
            </div>

            {/* 2. Data We Collect */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-[#4A66FF]" />
                2. Data We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                We collect only the minimum necessary data to provide lending services and comply with regulatory mandates:
              </p>

              <div className="space-y-4 text-gray-600">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Identification Data</h3>
                  <p>Full name, address, contact details, email, date of birth, Aadhaar, PAN.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Financial Data</h3>
                  <p>Bank account details, transactional history, income information strictly required for eligibility and processing.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Device &amp; Usage Data</h3>
                  <p>Device model, OS version, device identifiers (advertising ID, IP address), app crash logs, anonymized usage statistics.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Loan Application Data</h3>
                  <p>Application status, KYC progress, correspondence, documented digital consents.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Third-Party Data</h3>
                  <p>Collected only from authorized service providers <a href="https://api.quikkred.in/partner" className="text-[#25B181] hover:underline">https://api.quikkred.in/partner</a>.</p>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Note:</strong> We do not collect or store biometric data (fingerprints, facial recognition) in any form on any necessary retention.
                </p>
              </div>

              <p className="text-gray-600 mt-4">
                Unless expressly opted out by you, we may use channels such as email, SMS, RCS, Whatsapp, instant messaging apps and call to disseminate promotional or service-related communications. You retain the right to unsubscribe from such communications through provided mechanisms.
              </p>
            </div>

            {/* 3. Purpose of Use */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#25B181]" />
                3. Purpose of Use
              </h2>
              <p className="text-gray-600 mb-4">
                We use your information only to:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181]">&#10003;</span>
                  <span>Complete KYC, assess loan eligibility, approval and disbursal via our NBFC partner.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181]">&#10003;</span>
                  <span>Meet regulatory and RBI digital lending requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181]">&#10003;</span>
                  <span>Prevent fraud and protect the app&apos;s security.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181]">&#10003;</span>
                  <span>Provide customer support and improve services through anonymized analytics.</span>
                </li>
              </ul>
            </div>

            {/* 4. Data Sharing & Third Parties */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#4A66FF]" />
                4. Data Sharing &amp; Third Parties
              </h2>
              <p className="text-gray-600 mb-4">
                We share data only with:
              </p>
              <div className="space-y-3 text-gray-600">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">NBFC Lending Partner(s)</h3>
                  <p className="text-sm">For loan processing and disbursement.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Regulatory Authorities</h3>
                  <p className="text-sm">Where required by law.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Verified Technical Service Providers</h3>
                  <p className="text-sm">Under contractual data protection obligations.</p>
                </div>
              </div>
            </div>

            {/* 5. Consent, Control & Withdrawal */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#FF9C70]" />
                5. Consent, Control &amp; Withdrawal
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>We obtain explicit consent prior to processing personal data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>You may withdraw consent at any time via the app settings or by contacting support. Withdrawal may affect your ability to access lending services but will not invalidate prior processing done lawfully.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Upon withdrawal, data deletion or restriction requests will be processed in compliance with RBI and legal requirements.</span>
                </li>
              </ul>
            </div>

            {/* 6. Data Security & Retention */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#25B181]" />
                6. Data Security &amp; Retention
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Your data is stored securely in India using AES-256 encryption and industry-standard access controls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>We retain personal data only as long as your account is active or as legally required (including post-loan closure for auditing and regulatory defense).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Once retention periods expire, we securely delete or anonymize data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>We do not transfer or store data outside India. Any incidental foreign processing is deleted within 24 hours per RBI rules.</span>
                </li>
              </ul>
            </div>

            {/* 7. Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#4A66FF]" />
                7. Your Rights
              </h2>
              <p className="text-gray-600 mb-4">
                Under applicable laws, you have rights to:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Access</h3>
                  <p className="text-sm">Access your personal data</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Rectify</h3>
                  <p className="text-sm">Correct inaccurate information</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Erase</h3>
                  <p className="text-sm">Request deletion of your data</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Port</h3>
                  <p className="text-sm">Receive your data in portable format</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Withdraw consent or restrict processing. Lodge complaints with Quikkred&apos;s Data Protection Officer:
              </p>
              <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6">
                <p className="font-semibold mb-2">Data Protection Officer</p>
                <p className="text-gray-600">
                  Miss Priya<br />
                  Email: info@quikkred.in<br />
                  Contact: 9599238889
                </p>
              </div>
              <p className="text-gray-600 mt-4">
                We commit to addressing grievances within 30 days.
              </p>
            </div>

            {/* 8. Children's Privacy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#FF9C70]" />
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-600">
                Our services are not intended for users under 18. We do not deliberately collect data from minors. If accidental minor data is identified, we will seek parental consent or delete the data as required.
              </p>
            </div>

            {/* 9. Policy Updates */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#25B181]" />
                9. Policy Updates
              </h2>
              <p className="text-gray-600">
                We will notify users of changes via the app and support page. Continued usage implies acceptance. The last updated date will be displayed.
              </p>
            </div>

            {/* 10. Regulatory Compliance */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#4A66FF]" />
                10. Regulatory Compliance
              </h2>
              <p className="text-gray-600 mb-4">
                Quikkred acts only as LSP, with loans issued by RBI-regulated Satsai Finlease Private Limited (NBFC). Digital copies of RBI and NBFC registrations and policies are available on our support site.
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-gray-700">
                  Our policies ensure full compliance with <strong>RBI Digital Lending Directions 2025</strong> and the <strong>DPDP Act 2023</strong>.
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t">
              <p>Last Updated: 18th February 2025</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
