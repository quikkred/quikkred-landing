'use client';

import { motion } from "framer-motion";
import { Shield, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function TermsPage() {
  const { t } = useLanguage();

  const terms = t?.policies?.terms;
  console.log(terms)
  const sections = terms?.sections;

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
              {terms?.title || "Terms & Conditions"}
            </h1>
            <p className="text-xl">{t?.policies?.common?.effectiveDate || "Effective Date"}: {terms?.effectiveDate || "January 1, 2024"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout
        effectiveDateText={t?.policies?.common?.effectiveDate || "Effective Date"}
        effectiveDate={terms?.effectiveDate || "January 1, 2024"}
      >
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {sections?.introduction?.title || "1. Introduction"}
          </h2>
          <p className="text-gray-600 mb-4">
            {sections?.introduction?.content1 || "Welcome to Quikkred. These Terms and Conditions govern your use of our services and form a binding legal agreement between you and Quikkred (a brand of Fluxusforge Private Limited, acting as Loan Service Provider), operating in partnership with Satsai Finlease Private Limited, a Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India (RBI Registration No: B-14.01646)."}
          </p>
          <p className="text-gray-600">
            {sections?.introduction?.content2 || "By accessing or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our services."}
          </p>
        </div>

        {/* Eligibility */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#25B181]" />
            {sections?.eligibility?.title || "2. Eligibility Criteria"}
          </h2>
          <p className="text-gray-600 mb-4">
            {sections?.eligibility?.intro || "To use our loan services, you must:"}
          </p>
          <ul className="space-y-2 text-gray-600">
            {(sections?.eligibility?.items || [
              "Be at least 21 years of age and not more than 65 years",
              "Be an Indian citizen or resident",
              "Have a valid PAN card and Aadhaar card",
              "Have a minimum monthly income as specified for each loan product",
              "Have a satisfactory credit score as determined by our credit assessment"
            ]).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#25B181]">&#8226;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Loan Terms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {sections?.loanTerms?.title || "3. Loan Terms"}
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold mb-2">{sections?.loanTerms?.interestRates?.title || "3.1 Interest Rates"}</h3>
              <p>
                {sections?.loanTerms?.interestRates?.content || "Interest rates range from 10.99% to 24% per annum, calculated on a reducing balance basis. The exact rate will be determined based on your credit profile, loan amount, and tenure."}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{sections?.loanTerms?.platformFees?.title || "3.2 Platform fees"}</h3>
              <p>
                {sections?.loanTerms?.platformFees?.content || "A Platform fee of up to 3% of the loan amount (plus applicable taxes) will be charged at the time of loan disbursal."}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{sections?.loanTerms?.prepayment?.title || "3.3 Prepayment"}</h3>
              <p>
                {sections?.loanTerms?.prepayment?.content || "You may prepay your loan in full or in part after 3 EMIs. Prepayment charges may apply as per RBI guidelines."}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy and Security */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#4A66FF]" />
            {sections?.privacySecurity?.title || "4. Privacy and Security"}
          </h2>
          <p className="text-gray-600 mb-4">
            {sections?.privacySecurity?.content || "We take your privacy seriously. All personal and financial information provided is encrypted and stored securely. We comply with all applicable data protection laws and RBI guidelines."}
          </p>
          <p className="text-gray-600">
            {sections?.privacySecurity?.intro || "Your information will only be used for:"}
          </p>
          <ul className="space-y-2 text-gray-600 mt-2">
            {(sections?.privacySecurity?.items || [
              "Processing your loan application",
              "Credit assessment and verification",
              "Regulatory compliance and reporting",
              "Customer service and support"
            ]).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#4A66FF]">&#8226;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Default and Recovery */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            {sections?.default?.title || "5. Default and Recovery"}
          </h2>
          <p className="text-gray-600 mb-4">
            {sections?.default?.intro || "In case of default (failure to pay EMI within 90 days of due date):"}
          </p>
          <ul className="space-y-2 text-gray-600">
            {(sections?.default?.items || [
              "Late payment charges of 2% per month will be applied",
              "Your credit score will be negatively impacted",
              "Legal action may be initiated for recovery",
              "The loan account may be classified as NPA as per RBI guidelines"
            ]).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500">&#8226;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dispute Resolution */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {sections?.dispute?.title || "6. Dispute Resolution"}
          </h2>
          <p className="text-gray-600 mb-4">
            {sections?.dispute?.intro || "Any disputes arising out of these terms shall be resolved through:"}
          </p>
          <ol className="space-y-2 text-gray-600">
            {(sections?.dispute?.items || [
              "Internal grievance redressal mechanism",
              "Banking Ombudsman (if not resolved internally)",
              "Arbitration under the Arbitration and Conciliation Act, 1996",
              "Courts of Delhi shall have exclusive jurisdiction"
            ]).map((item: string, index: number) => (
              <li key={index}>{index + 1}. {item}</li>
            ))}
          </ol>
        </div>

        {/* Amendments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {sections?.amendments?.title || "7. Amendments"}
          </h2>
          <p className="text-gray-600">
            {sections?.amendments?.content || "Quikkred reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after any modifications constitutes acceptance of the updated terms."}
          </p>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {sections?.contact?.title || "8. Contact Information"}
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="font-semibold mb-2">{sections?.contact?.company || "Quikkred (A brand of Fluxusforge Private Limited)"}</p>
            <p className="text-gray-600 mb-3">
              <strong>{sections?.contact?.lendingPartner || "Lending Partner"}:</strong> {sections?.contact?.partnerName || "Satsai Finlease Private Limited"}<br />
              {sections?.contact?.rbiReg || "RBI Registration No: B-14.01646"}
            </p>
            <p className="text-gray-600">
              {t?.policies?.common?.email || "Email"}: {sections?.contact?.email || "support@quikkred.in"}<br />
              {t?.policies?.common?.phone || "Phone"}: {sections?.contact?.phone || "+91-9311913854"}<br />
              {sections?.contact?.address || "1008, 10th Floor, Vikrant Tower, Rajendra Place, New Delhi - 110005"}
            </p>
          </div>
        </div>
      </PoliciesLayout>
    </div>
  );
}
