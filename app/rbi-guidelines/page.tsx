'use client';
import { motion } from "framer-motion";
import { Shield, BookOpen, FileCheck, AlertCircle, Scale, Users, Building, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function RBIGuidelinesPage() {
  const { t } = useLanguage();

  const rbi = t?.policies?.rbiGuidelines;
  const sections = t?.policies?.rbiGuidelines?.sections;

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
              {rbi?.title || "RBI Guidelines"}
            </h1>
            <p className="text-xl">{rbi?.subtitle || "Regulatory Compliance & Consumer Protection"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Introduction */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#25B181]" />
            {sections?.intro?.title || "About RBI Regulations"}
          </h2>
          <p className="text-gray-600 mb-4">
            {sections?.intro ? (
              <>
                {sections.intro.beforeLsp}
                <strong>{sections.intro.lsp}</strong>
                {sections.intro.afterLsp}
                <strong>{sections.intro.nbfc}</strong>
                {sections.intro.afterNbfc}
              </>
            ) : (
              <>
                Quikkred is a digital lending platform powered by{" "}
                <strong>Fluxusforge Private Limited</strong> (Loan Service Provider). All
                loans on our platform are disbursed by{" "}
                <strong>Satsai Finlease Private Limited</strong>, an RBI-registered
                Non-Banking Financial Company (NBFC) established in 1996 (CIN: U71290DL1996PTC081328).
              </>
            )}
          </p>
          <p className="text-gray-600">
            {sections?.intro?.content2 || "The RBI has established comprehensive guidelines to ensure that NBFCs and their digital lending partners maintain financial stability, protect consumer interests, and follow ethical business practices. This page outlines the key RBI regulations applicable to our platform and our lending partner's operations."}
          </p>
        </div>

        {/* NBFC Partnership */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Building className="w-6 h-6 text-[#25B181]" />
            {sections?.lendingPartner?.title || "Our Lending Partner"}
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.lendingPartner?.partner1.title || "Satsai Finlease Private Limited"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <strong>
                  {sections?.lendingPartner?.partner1?.highlightLabel?.[0] ??
                    "RBI-Registered NBFC:"}
                </strong>{" "}
                {sections?.lendingPartner?.partner1?.highlightItems[0] || "Satsai Finlease is a registered NBFC under the Reserve Bank of India Act, 1934."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.lendingPartner?.partner1.highlightLabel[1] || "Established:"}</strong>{" "} {sections?.lendingPartner?.partner1?.highlightItems[1] || "1996 (28+ years of financial services experience)"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.lendingPartner?.partner1.highlightLabel[2] || "CIN:"}</strong> {sections?.lendingPartner?.partner1?.highlightItems[2] || "U71290DL1996PTC081328"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.lendingPartner?.partner1.highlightLabel[3] || "Website:"}</strong> <a href="https://satsaifinlease.com" target="_blank" rel="noopener noreferrer" className="text-[#25B181] hover:underline">{sections?.lendingPartner?.partner1.highlightItems[3] || "satsaifinlease.com"}</a></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.lendingPartner?.partner1.highlightItems[4] || "Maintains the minimum Net Owned Fund (NOF) as prescribed by the RBI."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.lendingPartner?.partner1.highlightItems[5] || "Registration details available for verification on the RBI website."}</span>
              </li>
            </ul>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.lendingPartner?.partner2.title || "Fluxusforge Private Limited (LSP)"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.lendingPartner?.partner2.highlightLabel[0] || "Role:"}</strong> {sections?.lendingPartner?.partner2.highlightItems[0] || "Loan Service Provider (LSP) and Technology Partner operating the Quikkred platform."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.lendingPartner?.partner2.highlightLabel[1] || "Website:"}</strong> <a href="https://fluxusforge.in" target="_blank" rel="noopener noreferrer" className="text-[#25B181] hover:underline">fluxusforge.in</a></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.lendingPartner?.partner2.highlightItems[2] || "Provides technology infrastructure, customer onboarding, and servicing support."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.lendingPartner?.partner2.highlightItems[3] || "Operates under the regulatory framework established by RBI Digital Lending Guidelines, 2022."}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Digital Lending Guidelines */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#25B181]" />
            {sections?.digitalLendingGuidelines?.title || "Digital Lending Guidelines"}
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.digitalLendingGuidelines?.subheading1?.title || "Key Provisions We Follow"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.digitalLendingGuidelines?.subheading1?.highlightLabel[0] || "Direct Disbursement:"}</strong> {sections?.digitalLendingGuidelines?.subheading1?.highlightItems[0] || "All loan amounts are disbursed directly to the borrower's bank account without any pass-through or pool accounts."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.digitalLendingGuidelines?.subheading1?.highlightLabel[1] || "Transparent Communication:"}</strong> {sections?.digitalLendingGuidelines?.subheading1?.highlightItems[1] || "All fees, charges, and annual percentage rates (APR) are disclosed upfront before loan sanction."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.digitalLendingGuidelines?.subheading1?.highlightLabel[2] || "Key Fact Statement (KFS):"}</strong> {sections?.digitalLendingGuidelines?.subheading1?.highlightItems[2] || "A standardized KFS is provided to borrowers containing all essential loan information."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.digitalLendingGuidelines?.subheading1?.highlightLabel[3] || "Cooling-Off Period:"}</strong> {sections?.digitalLendingGuidelines?.subheading1?.highlightItems[3] || "Borrowers have the right to exit the loan within a specified look-up period."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{sections?.digitalLendingGuidelines?.subheading1?.highlightLabel[4] || "Data Privacy:"}</strong> {sections?.digitalLendingGuidelines?.subheading1?.highlightItems[4] || "Customer data is collected only with explicit consent and used solely for credit assessment and legitimate purposes."}</span>
              </li>
            </ul>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.digitalLendingGuidelines?.subheading2?.title || "LSP Disclosure & Compliance"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.digitalLendingGuidelines?.subheading2?.highlightItems[0] || "Fluxusforge Private Limited operates as the Lending Service Provider (LSP) for Satsai Finlease Private Limited."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.digitalLendingGuidelines?.subheading2?.highlightItems[1] || "All LSP details are disclosed to borrowers as part of the loan documentation."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.digitalLendingGuidelines?.subheading2?.highlightItems[2] || "LSP activities are monitored by Satsai Finlease to ensure compliance with RBI guidelines."}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fair Practices Code */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#4A66FF]" />
            {sections?.fairPracticeCode.title || "Fair Practices Code"}
          </h2>
          <p className="text-gray-600 mb-4">
            {sections?.fairPracticeCode.introduction || "In accordance with RBI Master Direction on Non-Banking Financial Company – Non-Systemically Important Non-Deposit taking Company (Reserve Bank) Directions, 2016, our lending partner Satsai Finlease Private Limited has adopted a comprehensive Fair Practices Code that governs:"}
          </p>
          <ul className="space-y-3 text-gray-600 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>{sections?.fairPracticeCode.items[0] || "Loan application processing and approval"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>{sections?.fairPracticeCode.items[1] || "Disclosure of terms and conditions"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>{sections?.fairPracticeCode.items[2] || "Interest rate and fee transparency"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>{sections?.fairPracticeCode.items[3] || "Customer grievance redressal"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A66FF] mt-1">•</span>
              <span>{sections?.fairPracticeCode.items[4] || "Recovery practices and customer treatment"}</span>
            </li>
          </ul>
          <p className="text-gray-600">
            {sections?.fairPracticeCode ? (
              <>
                {sections.fairPracticeCode.conclusion.start}{" "}
                <a className="text-[#25B181] hover:underline" href="/fair-practice">{sections.fairPracticeCode.conclusion.link}</a>{" "}
                {sections.fairPracticeCode.conclusion.end}
              </>
            ) : (
              <>
                For detailed information, please refer to our <a href="/fair-practice" className="text-[#25B181] hover:underline">Fair Practices Code</a> page.
              </>
            )}

          </p>
        </div>

        {/* Customer Protection */}
        {/* <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#25B181]" />
            Customer Protection Framework
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Your Rights as a Borrower
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Information:</strong> Complete transparency on loan terms, interest rates, fees, and charges before signing any agreement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Privacy:</strong> Your personal and financial data is protected and used only for authorized purposes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Fair Treatment:</strong> Respectful and dignified treatment at all stages of the loan lifecycle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Grievance Redressal:</strong> Access to a robust complaint resolution mechanism.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>Right to Exit:</strong> Option to prepay loans with applicable charges as per the loan agreement.</span>
              </li>
            </ul>
          </div>
        </div> */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#25B181]" />
            {sections?.customerProtection?.title || "Customer Protection Framework"}
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.customerProtection?.subtitle || "Your Rights as a Borrower"}
            </h3>

            <ul className="space-y-3 text-gray-600">
              {sections?.customerProtection?.highlightItems?.map(
                (item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>
                      <strong>
                        {sections?.customerProtection?.highlightLabel?.[index] || ""}
                      </strong>{" "}
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>


        {/* KYC & AML */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-[#25B181]" />
            {sections?.kycAmlCompliance?.title || "KYC/AML Compliance"}
          </h2>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.kycAmlCompliance?.title || "Know Your Customer (KYC) Requirements"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[0]?.items[0] || "We follow RBI's Master Direction on KYC for customer identification and verification."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[0]?.items[1] || "Video KYC (V-KYC) is conducted as per RBI guidelines for digital onboarding."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[0]?.items[2] || "Aadhaar-based e-KYC is performed with explicit customer consent."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[0]?.items[3] || "Periodic KYC updates are conducted as mandated by regulatory requirements."}</span>
              </li>
            </ul>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.kycAmlCompliance?.sections[1].title || "Anti-Money Laundering (AML) Framework"}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[1]?.items[0] || "Robust transaction monitoring systems to detect suspicious activities."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[1]?.items[1] || "Compliance with Prevention of Money Laundering Act (PMLA), 2002."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[1]?.items[2] || "Regular training of staff on AML/CFT requirements."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{sections?.kycAmlCompliance?.sections[1]?.items[3] || "Reporting of suspicious transactions to Financial Intelligence Unit (FIU-IND)."}</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-600">
            {sections?.kycAmlCompliance ? (
              <>
                {sections.kycAmlCompliance?.footer.textBeforeLink}{" "}
                <a className="text-[#25B181] hover:underline" href="/kyc-policy">{sections.kycAmlCompliance?.footer.linkText}{" "}</a>
                {sections.kycAmlCompliance?.footer.textAfterLink}
              </>
            ) : (
              <>
                For detailed information, please refer to our <a href="/kyc-policy" className="text-[#25B181] hover:underline">KYC/AML Policy</a> page.
              </>
            )}
          </p>
        </div>

        {/* Grievance Redressal */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#25B181]" />
            {sections?.grievanceRedressal?.title || "Grievance Redressal Mechanism"}
          </h2>

          {/* Complaint Resolution */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {sections?.grievanceRedressal?.complaintResolution?.title ||
                "Three-Tier Complaint Resolution"}
            </h3>

            <div className="space-y-6">
              {sections?.grievanceRedressal?.complaintResolution?.levels?.map(
                (
                  level: {
                    level: string;
                    title: string;
                    description: string;
                  },
                  index: number
                ) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {level.level}: {level.title}
                    </h4>
                    <p className="text-gray-600">{level.description}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* RBI Ombudsman Details */}
          <div className="bg-gradient-to-br from-[var(--emerald-green)]/10 to-[var(--royal-blue)]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
            <p className="font-semibold text-gray-800 mb-2">
              {sections?.grievanceRedressal?.ombudsman?.title ||
                "RBI Ombudsman Details"}
            </p>

            <p className="text-gray-600">
              {sections?.grievanceRedressal?.ombudsman?.website?.label}:{" "}
              <a
                href={sections?.grievanceRedressal?.ombudsman?.website?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25B181] hover:underline"
              >
                {sections?.grievanceRedressal?.ombudsman?.website?.url}
              </a>
            </p>

            <p className="text-gray-600">
              {sections?.grievanceRedressal?.ombudsman?.tollFree?.label}:{" "}
              {sections?.grievanceRedressal?.ombudsman?.tollFree?.value}
            </p>

            <p className="text-gray-600">
              {sections?.grievanceRedressal?.ombudsman?.email?.label}:{" "}
              {sections?.grievanceRedressal?.ombudsman?.email?.value}
            </p>
          </div>

          {/* Footer */}
          <p className="text-gray-600 mt-4">
            {sections?.grievanceRedressal?.footer?.textBeforeLink}{" "}
            <a
              href={sections?.grievanceRedressal?.footer?.linkUrl}
              className="text-[#25B181] hover:underline"
            >
              {sections?.grievanceRedressal?.footer?.linkText}
            </a>{" "}
            {sections?.grievanceRedressal?.footer?.textAfterLink}
          </p>
        </div>


        {/* Important RBI Circulars */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#4A66FF]" />
            {sections?.keyRbiRegulations?.title || "Key RBI Regulations We Comply With"}
          </h2>

          <div className="space-y-4">
            {sections?.keyRbiRegulations?.items?.map(
              (
                item: {
                  title: string;
                  description: string;
                },
                index: number
              ) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              )
            )}
          </div>
        </div>


        {/* Disclaimer */}
        <div className="mb-10 bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {sections?.disclaimer?.title || "Disclaimer"}
          </h3>

          <p className="text-gray-600 text-sm">
            {sections?.disclaimer?.content ? (
              <>
                {sections.disclaimer.content.textBeforeLink}{" "}
                <a
                  href={sections.disclaimer.content.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25B181] hover:underline"
                >
                  {sections.disclaimer.content.linkText}
                </a>{" "}
                {sections.disclaimer.content.textAfterLink}
              </>
            ) : (
              <>
                Quikkred is a digital lending platform powered by Fluxusforge Private
                Limited (LSP). All loans are disbursed by Satsai Finlease Private Limited,
                an RBI-registered NBFC. This page provides a summary of key RBI guidelines
                applicable to our platform and lending partner&apos;s operations. For
                complete regulatory information, please refer to the official RBI
                website at{" "}
                <a
                  href="https://www.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25B181] hover:underline"
                >
                  www.rbi.org.in
                </a>
                . The guidelines mentioned above are subject to updates and amendments by
                the RBI from time to time.
              </>
            )}
          </p>
        </div>
      </PoliciesLayout >
    </div >
  );
}
