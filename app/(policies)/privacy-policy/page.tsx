'use client';

import { motion } from "framer-motion";
import { Lock, Shield, Eye, Database, UserCheck, Bell, Globe, AlertCircle, RefreshCw, Scale } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLanguage();

  const p = t?.policies?.privacy;
  const sections = p?.sections;

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
              {p?.title || "Privacy Policy"}
            </h1>
            <p className="text-xl">{p?.subtitle || "Your privacy is our priority"}</p>
            <p className="text-sm mt-2 opacity-90">{t?.policies?.common?.effectiveDate || "Effective Date"}: {p?.effectiveDate || "18-02-2025"}</p>
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
                {sections?.introduction?.title || "1. Introduction"}
              </h2>
              <p className="text-gray-600 mb-4">
                {sections?.introduction?.content || "Quikkred, a brand of Fluxusforge Private Limited, operates as a Lending Service Provider (LSP), in partnership with Satsai Finlease Private Limited (an RBI-registered NBFC) for loan disbursement."}
              </p>
            </div>

            {/* 2. Data We Collect */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-[#4A66FF]" />
                {sections?.dataCollection?.title || "2. Data We Collect"}
              </h2>
              <p className="text-gray-600 mb-4">
                {sections?.dataCollection?.intro || "We collect only the minimum necessary data to provide lending services and comply with regulatory mandates:"}
              </p>

              <div className="space-y-4 text-gray-600">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{sections?.dataCollection?.items?.identification?.title || "Identification Data"}</h3>
                  <p>{sections?.dataCollection?.items?.identification?.content || "Full name, address, contact details, email, date of birth, Aadhaar, PAN."}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{sections?.dataCollection?.items?.financial?.title || "Financial Data"}</h3>
                  <p>{sections?.dataCollection?.items?.financial?.content || "Bank account details, transactional history, income information strictly required for eligibility and processing."}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{sections?.dataCollection?.items?.device?.title || "Device & Usage Data"}</h3>
                  <p>{sections?.dataCollection?.items?.device?.content || "Device model, OS version, device identifiers (advertising ID, IP address), app crash logs, anonymized usage statistics."}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{sections?.dataCollection?.items?.loan?.title || "Loan Application Data"}</h3>
                  <p>{sections?.dataCollection?.items?.loan?.content || "Application status, KYC progress, correspondence, documented digital consents."}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{sections?.dataCollection?.items?.thirdParty?.title || "Third-Party Data"}</h3>
                  <p>{sections?.dataCollection?.items?.thirdParty?.content || "Collected only from authorized service providers"} <a href="https://quikkred.in/partners" className="text-[#25B181] hover:underline">https://quikkred.in/partners</a>.</p>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Note:</strong> {sections?.dataCollection?.note || "We do not collect or store biometric data (fingerprints, facial recognition) in any form on any necessary retention."}
                </p>
              </div>

              <p className="text-gray-600 mt-4">
                {sections?.dataCollection?.communication || "Unless expressly opted out by you, we may use channels such as email, SMS, RCS, Whatsapp, instant messaging apps and call to disseminate promotional or service-related communications."}
              </p>
            </div>

            {/* 3. Purpose of Use */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#25B181]" />
                {sections?.purpose?.title || "3. Purpose of Use"}
              </h2>
              <p className="text-gray-600 mb-4">
                {sections?.purpose?.intro || "We use your information only to:"}
              </p>
              <ul className="space-y-2 text-gray-600">
                {(sections?.purpose?.items || [
                  "Complete KYC, assess loan eligibility, approval and disbursal via our NBFC partner.",
                  "Meet regulatory and RBI digital lending requirements.",
                  "Prevent fraud and protect the app's security.",
                  "Provide customer support and improve services through anonymized analytics."
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181]">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Data Sharing & Third Parties */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#4A66FF]" />
                {sections?.dataSharing?.title || "4. Data Sharing & Third Parties"}
              </h2>
              <p className="text-gray-600 mb-4">
                {sections?.dataSharing?.intro || "We share data only with:"}
              </p>
              <div className="space-y-3 text-gray-600">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{sections?.dataSharing?.items?.nbfc?.title || "NBFC Lending Partner(s)"}</h3>
                  <p className="text-sm">{sections?.dataSharing?.items?.nbfc?.content || "For loan processing and disbursement."}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{sections?.dataSharing?.items?.regulatory?.title || "Regulatory Authorities"}</h3>
                  <p className="text-sm">{sections?.dataSharing?.items?.regulatory?.content || "Where required by law."}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{sections?.dataSharing?.items?.technical?.title || "Verified Technical Service Providers"}</h3>
                  <p className="text-sm">{sections?.dataSharing?.items?.technical?.content || "Under contractual data protection obligations."}</p>
                </div>
              </div>
            </div>

            {/* 5. Consent, Control & Withdrawal */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#FF9C70]" />
                {sections?.consent?.title || "5. Consent, Control & Withdrawal"}
              </h2>
              <ul className="space-y-3 text-gray-600">
                {(sections?.consent?.items || [
                  "We obtain explicit consent prior to processing personal data.",
                  "You may withdraw consent at any time via the app settings or by contacting support.",
                  "Upon withdrawal, data deletion or restriction requests will be processed in compliance with RBI and legal requirements."
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Data Security & Retention */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#25B181]" />
                {sections?.security?.title || "6. Data Security & Retention"}
              </h2>
              <ul className="space-y-3 text-gray-600">
                {(sections?.security?.items || [
                  "Your data is stored securely in India using AES-256 encryption and industry-standard access controls.",
                  "We retain personal data only as long as your account is active or as legally required.",
                  "Once retention periods expire, we securely delete or anonymize data.",
                  "We do not transfer or store data outside India."
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#4A66FF]" />
                {sections?.rights?.title || "7. Your Rights"}
              </h2>
              <p className="text-gray-600 mb-4">
                {sections?.rights?.intro || "Under applicable laws, you have rights to:"}
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{sections?.rights?.items?.access?.title || "Access"}</h3>
                  <p className="text-sm">{sections?.rights?.items?.access?.content || "Access your personal data"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{sections?.rights?.items?.rectify?.title || "Rectify"}</h3>
                  <p className="text-sm">{sections?.rights?.items?.rectify?.content || "Correct inaccurate information"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{sections?.rights?.items?.erase?.title || "Erase"}</h3>
                  <p className="text-sm">{sections?.rights?.items?.erase?.content || "Request deletion of your data"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{sections?.rights?.items?.port?.title || "Port"}</h3>
                  <p className="text-sm">{sections?.rights?.items?.port?.content || "Receive your data in portable format"}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {sections?.rights?.withdraw || "Withdraw consent or restrict processing. Lodge complaints with Quikkred's Data Protection Officer:"}
              </p>
              <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6">
                <p className="font-semibold mb-2">{sections?.rights?.dpo?.title || "Data Protection Officer"}</p>
                <p className="text-gray-600">
                  {sections?.rights?.dpo?.name || "Miss Priya"}<br />
                  {t?.policies?.common?.email || "Email"}: {sections?.rights?.dpo?.email || "dpo@quikkred.in"}<br />
                  {t?.policies?.common?.phone || "Contact"}: {sections?.rights?.dpo?.phone || "+91-9311913854"}
                </p>
              </div>
              <p className="text-gray-600 mt-4">
                {sections?.rights?.grievanceTime || "We commit to addressing grievances within 30 days."}
              </p>
            </div>

            {/* 8. Children's Privacy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#FF9C70]" />
                {sections?.children?.title || "8. Children's Privacy"}
              </h2>
              <p className="text-gray-600">
                {sections?.children?.content || "Our services are not intended for users under 18. We do not deliberately collect data from minors."}
              </p>
            </div>

            {/* 9. Policy Updates */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#25B181]" />
                {sections?.updates?.title || "9. Policy Updates"}
              </h2>
              <p className="text-gray-600">
                {sections?.updates?.content || "We will notify users of changes via the app and support page. Continued usage implies acceptance."}
              </p>
            </div>

            {/* 10. Regulatory Compliance */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#4A66FF]" />
                {sections?.compliance?.title || "10. Regulatory Compliance"}
              </h2>
              <p className="text-gray-600 mb-4">
                {sections?.compliance?.content || "Quikkred acts only as LSP, with loans issued by RBI-regulated Satsai Finlease Private Limited (NBFC)."}
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-gray-700">
                  {sections?.compliance?.note || "Our policies ensure full compliance with RBI Digital Lending Directions 2025 and the DPDP Act 2023."}
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t">
              <p>{t?.policies?.common?.lastUpdated || "Last Updated"}: {p?.lastUpdatedDate || "18th February 2025"}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
