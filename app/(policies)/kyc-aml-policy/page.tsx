'use client';

import { motion } from "framer-motion";
import { Shield, FileText, Users, Target, BookOpen, UserCheck, Search, AlertTriangle, FileCheck, Lock, Building } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function KYCPolicyPage() {
  const { t } = useLanguage();

  const kyc = t?.policies?.kycAml;

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
              {kyc?.title || "Know Your Customer (KYC) & Anti-Money Laundering (AML) Policy"}
            </h1>
            <p className="text-xl">{kyc?.subtitle || "Satsai Finlease Pvt. Ltd."}</p>
            <p className="text-lg mt-2 opacity-90">{kyc?.approvalNote || "(This policy was reviewed and approved by the Board of Directors in the Board Meeting held on April 21, 2025.)"}</p>
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
                {kyc?.documentDetails?.title || "Document Details"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2b2b2b] leading-[1.7]">
                <div><span className="font-semibold">{t?.policies?.common?.title || "Title"}:</span> {kyc?.documentDetails?.policyTitle || "KYC & AML Policy"}</div>
                <div><span className="font-semibold">{t?.policies?.common?.classification || "Classification"}:</span> {kyc?.documentDetails?.classification || "Public"}</div>
                <div><span className="font-semibold">{t?.policies?.common?.approvalDate || "Approved Date"}:</span> {kyc?.documentDetails?.approvalDate || "30th June 2023"}</div>
                <div><span className="font-semibold">{t?.policies?.common?.lastReviewDate || "Last Review Date"}:</span> {kyc?.documentDetails?.lastReviewDate || "21st April 2025"}</div>
                <div><span className="font-semibold">{t?.policies?.common?.approvedBy || "Approved By"}:</span> {kyc?.documentDetails?.approvedBy || "Board of Directors"}</div>
                <div><span className="font-semibold">{t?.policies?.common?.custodian || "Custodian"}:</span> {kyc?.documentDetails?.custodian || "Operation"}</div>
              </div>
            </div>

            {/* 1. Preamble */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.preamble?.title || "1. Preamble"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                {kyc?.sections?.preamble?.content || "Satsai Finlease Private Limited (\"SFPL\" / \"the Company\"), being a Base Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India (RBI) under Registration No. B-14.01646, engaged in the business of Payday Loans, EMI-based Loans, Loan Against Property (LAP) and other business loans, recognizes its responsibility to prevent misuse of its financial services for money laundering, terrorist financing and other unlawful activities."}
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                {kyc?.sections?.preamble?.complianceIntro || "Accordingly, this Know Your Customer (KYC) and Anti-Money Laundering (AML) Policy is formulated in compliance with:"}
              </p>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.preamble?.complianceItems || [
                  "RBI Master Direction – Know Your Customer (KYC) Directions, 2016 (as amended from time to time)",
                  "Prevention of Money Laundering Act, 2002 (PMLA)",
                  "PML (Maintenance of Records) Rules, 2005",
                  "RBI Guidelines for NBFCs (Base Layer)",
                  "FATF Recommendations"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#2b2b2b] leading-[1.7] mt-4">
                {kyc?.sections?.preamble?.conclusion || "This Policy lays down principles, systems, procedures and internal controls to ensure strong customer identification, risk mitigation, due diligence and monitoring."}
              </p>
            </div>

            {/* 2. Objectives */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.objectives?.title || "2. Objectives"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{kyc?.sections?.objectives?.intro || "The objectives of this Policy are:"}</p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.objectives?.items || [
                  "To prevent the Company from being used knowingly or unknowingly for money laundering or terrorist financing activities.",
                  "To ensure the Company understands its customers, their financial behavior and associated risks.",
                  "To promote ethical conduct and transparency in business relationships.",
                  "To comply with legal and regulatory requirements under RBI and PMLA framework.",
                  "To define procedures for detection and reporting of suspicious activities."
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Applicability */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.applicability?.title || "3. Applicability"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {kyc?.sections?.applicability?.content || "It may be noted that KYC – AML policy as stated in this document shall prevail over anything else contained in any other document / process/circular/letter/instruction of the Company in this regard (KYC-AML). This policy shall be applicable to all verticals/products of the Company whether existing or to be rolled out in future."}
              </p>
            </div>

            {/* 4. Definitions */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.definitions?.title || "4. Definitions"}
              </h2>
              <ul className="space-y-4 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.definitions?.items || [
                  { term: "Aadhaar number", definition: "shall have the meaning assigned to it in clause (a) of section 2 of the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016 (18 of 2016)" },
                  { term: "Authentication", definition: "in the context of Aadhaar authentication, means the process as defined under sub-section (c) of section 2 of the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016." },
                  { term: "Customer", definition: "means a person who is engaged in a financial transaction or activity with the Company and includes a person on whose behalf the person who is engaged in the transaction or activity, is acting" },
                  { term: "Act and Rules", definition: "means the Prevention of Money-Laundering Act, 2002 and the Prevention of Money-Laundering (Maintenance of Records) Rules, 2005, respectively and amendments thereto." },
                  { term: "Customer Due Diligence (CDD)", definition: "means identifying and verifying the customer and the beneficial owner" },
                  { term: "Central KYC Records Registry (CKYCR)", definition: "means an entity defined under Rule 2(1) (aa) of the Rules, to receive, store, safeguard and retrieve the KYC records in digital form of a customer" },
                  { term: "Quikkred", definition: "means the digital lending platform and mobile application operated by Fluxusforge Private Limited (as LSP) in partnership with the Company, which provides instant personal loans to approved customers" },
                  { term: "Designated Director", definition: "means a person designated by the Company to ensure overall compliance with the obligations imposed under Chapter IV of the Act and the Rules and shall include Managing Director or a whole-time director, duly authorized by the Board" },
                  { term: "Digital KYC", definition: "means the capturing live photo of the customer and officially valid document or the proof of possession of Aadhaar, where offline verification cannot be carried out, along with the latitude and longitude of the location where such live photo is being taken by an authorized officer of the RE as per the provisions contained in the Act." },
                  { term: "Officially Valid Document (OVD)", definition: "means the passport, the driving license, proof of possession of Aadhaar card, the Voter's Identity Card issued by the Election Commission of India, job card issued by NREGA duly signed by an officer of the State Government and letter issued by the National Population Register containing details of name and address." },
                  { term: "Principal Officer", definition: "means an officer nominated by the Company, responsible for furnishing information as per rule 8 of the Rules" },
                  { term: "Video based Customer Identification Process (V-CIP)", definition: "a method of customer identification by an official of the Company by undertaking seamless, secure, real-time, consent based audio-visual interaction with the customer to obtain identification information including the documents required for CDD purpose, and to ascertain the veracity of the information furnished by the customer." }
                ]).map((item: { term: string; definition: string }, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span><strong>"{item.term}"</strong> {item.definition}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Appointment of Principal Officer */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.principalOfficer?.title || "5. Appointment of Principal Officer"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {kyc?.sections?.principalOfficer?.content || "Company shall designate an officer nominated by the Company as 'Principal Officer' (PO) who shall be responsible for monitoring and reporting of all transactions and sharing of information as required under the Act. PO shall maintain close liaison with enforcement agencies, NBFCs and any other institution which are involved in the fight against money laundering and CFT. The name, designation & address of the PO shall be communicated to FIU-IND and/or the department concerned of the RBI."}
              </p>
            </div>

            {/* 6. Compliance Structure */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Building className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.complianceStructure?.title || "6. Compliance Structure"}
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{kyc?.sections?.complianceStructure?.seniorManagement?.title || "a) Senior Management Responsibility"}</h4>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  {kyc?.sections?.complianceStructure?.seniorManagement?.content || "Senior Management including Directors, Presidents and Compliance Head shall be responsible for policy implementation and operational adherence."}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{kyc?.sections?.complianceStructure?.training?.title || "b) Training & Awareness"}</h4>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  {kyc?.sections?.complianceStructure?.training?.content || "Periodic AML/KYC training shall be conducted for employees appropriate to their roles."}
                </p>
              </div>
            </div>

            {/* 7. Key Elements of KYC Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.keyElements?.title || "7. Key Elements of KYC Policy"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{kyc?.sections?.keyElements?.intro || "The KYC Policy consists of:"}</p>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.keyElements?.items || [
                  "Customer Acceptance Policy (CAP)",
                  "Customer Identification Procedure (CIP)",
                  "Customer Due Diligence (CDD)",
                  "Ongoing Due Diligence",
                  "Monitoring of Transactions",
                  "Record Maintenance",
                  "Reporting Mechanism"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 8. Customer Acceptance Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.customerAcceptance?.title || "8. Customer Acceptance Policy"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                {kyc?.sections?.customerAcceptance?.intro || "The Customer Acceptance Policy of the Company is aimed at ensuring that explicit guidelines are in place on the following aspects of customer relationship with the Company:"}
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.customerAcceptance?.items || [
                  "No loan account will be opened and / or money will be disbursed in a name which is anonymous or fictitious/ benami name or appears to be borrowed.",
                  "Accept customer only after verifying their identity, as per CDD, and if the Company is unable to apply appropriate CDD measures, either due to non-cooperation of the customer or non-reliability of the documents/information furnished by the customer then no account will be opened.",
                  "No Transaction or account-based relationship is undertaken without following the CDD procedure.",
                  "The mandatory information to be sought for KYC purpose while opening an account and during the periodic updation, as specified.",
                  "Optional/ additional information is obtained with the explicit consent of the customer after the account is opened.",
                  "Circumstances, in which a customer is permitted to act on behalf of another person/entity, shall be clearly spelt out in conformity with the established law and practices.",
                  "Suitable system shall be put in place to ensure that the identity of the customer does not match with any person or entity, whose name appears in the sanctions lists circulated by Reserve Bank of India."
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#2b2b2b] leading-[1.7] mt-4">
                {kyc?.sections?.customerAcceptance?.note || "Subject to the above-mentioned norms and caution, at the same time all the employees of Company will also ensure that the above norms and safeguards do not result in any kind of harassment or inconvenience to bona fide and genuine customers who should not feel discouraged while dealing with the Company."}
              </p>
            </div>

            {/* 9. Customer Identification Procedure */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Search className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.customerIdentification?.title || "9. Customer Identification Procedure (CIP)"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                {kyc?.sections?.customerIdentification?.content || "Customer identification means identifying and undertaking Customer Due Diligence (CDD) of the Customer and verifying his / her identity by using reliable, independent source documents, data or information. The Company needs to obtain enough information necessary to establish, to their satisfaction and as required by applicable law, the identity of each new customer, whether regular or occasional and the purpose of the intended nature of relationship."}
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{kyc?.sections?.customerIdentification?.methodsIntro || "KYC verification may be conducted through:"}</p>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.customerIdentification?.methods || [
                  "Physical Verification",
                  "Video-Based KYC (V-CIP)",
                  "Digital KYC"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#2b2b2b] leading-[1.7] mt-4">
                {kyc?.sections?.customerIdentification?.note || "OVDs and PAN verification shall be mandatory."}
              </p>
            </div>

            {/* 10. Customer Due Diligence */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.dueDiligence?.title || "10. Customer Due Diligence (CDD)"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{kyc?.sections?.dueDiligence?.intro || "CDD involves:"}</p>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.dueDiligence?.items || [
                  "Identity verification",
                  "Address proof",
                  "Beneficial owner identification",
                  "Source of funds verification",
                  "Purpose of relationship assessment"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{kyc?.sections?.dueDiligence?.enhanced?.title || "Enhanced Due Diligence"}</h4>
                <p className="text-[#2b2b2b] leading-[1.7] mb-2">{kyc?.sections?.dueDiligence?.enhanced?.intro || "Enhanced Due Diligence includes:"}</p>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  {(kyc?.sections?.dueDiligence?.enhanced?.items || [
                    "Higher monitoring frequency",
                    "Senior management approval"
                  ]).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#25B181] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 11. Ongoing Due Diligence */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Search className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.ongoingDueDiligence?.title || "11. Ongoing Due Diligence"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{kyc?.sections?.ongoingDueDiligence?.intro || "Includes:"}</p>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.ongoingDueDiligence?.items || [
                  "Periodic customer data updates",
                  "Review of account activity",
                  "Compliance checks",
                  "Monitoring of unusual patterns"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 12. Transaction Monitoring */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.transactionMonitoring?.title || "12. Transaction Monitoring"}
              </h2>
              {(kyc?.sections?.transactionMonitoring?.content || [
                "Ongoing monitoring is an essential element of effective KYC procedures. The officials have to effectively control and reduce the risk by having an understanding of the normal and reasonable activity of the customer so that they have the means of identifying transactions that fall outside the regular pattern of activity.",
                "The Company may prescribe threshold limits for a particular category of accounts and pay particular attention to the transactions which exceed these limits. Transactions that involve large amounts of cash inconsistent with the normal and expected activity of the customer should particularly attract the attention of the officials."
              ]).map((paragraph: string, index: number) => (
                <p key={index} className="text-[#2b2b2b] leading-[1.7] mb-4">{paragraph}</p>
              ))}
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{kyc?.sections?.transactionMonitoring?.flaggedIntro || "Suspicious transactions are flagged based on:"}</p>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.transactionMonitoring?.flaggedItems || [
                  "Unusual repayment behavior",
                  "Structuring transactions",
                  "Sudden loan closures by cash"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 13. Reporting to FIU-India */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.fiuReporting?.title || "13. Reporting to Financial Intelligence Unit-India"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                {kyc?.sections?.fiuReporting?.content || "As required in Section 12 of the Act the company has to report information of transaction referred to in clause (a) of sub-section (1) of section 12 read with Rule 3 of the Rules relating to cash and suspicious transactions etc. to the Director, Financial Intelligence Unit-India (FIU-IND)."}
              </p>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200 mb-4">
                <p className="text-[#2b2b2b] font-semibold">{kyc?.sections?.fiuReporting?.address?.title || "Director, FIU-IND,"}</p>
                <p className="text-[#2b2b2b]">{kyc?.sections?.fiuReporting?.address?.line1 || "Financial Intelligence Unit-India,"}</p>
                <p className="text-[#2b2b2b]">{kyc?.sections?.fiuReporting?.address?.line2 || "6th Floor, Hotel Samrat, Chanakyapuri,"}</p>
                <p className="text-[#2b2b2b]">{kyc?.sections?.fiuReporting?.address?.line3 || "New Delhi-110021."}</p>
              </div>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {kyc?.sections?.fiuReporting?.timeline || "The information in respect of the transactions referred to in clause(A), (B) and (BA) of sub-rule (1) of rule 3 of the PML Rules is to be submitted to the Director every month by the 15th day of the succeeding month."}
              </p>
            </div>

            {/* 14. Record Management */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.recordManagement?.title || "14. Record Management"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {kyc?.sections?.recordManagement?.content || "Records shall be retained for a minimum of 5 years after customer relationship termination."}
              </p>
            </div>

            {/* 15. Reporting Obligations */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.reportingObligations?.title || "15. Reporting Obligations"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">{kyc?.sections?.reportingObligations?.intro || "The Company shall report:"}</p>
              <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.reportingObligations?.items || [
                  "STR (Suspicious Transaction Report)",
                  "CTR (Cash Transaction Report)",
                  "NTR (Non-Profit Organization Transaction Report)"
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#2b2b2b] leading-[1.7] mt-4">
                {kyc?.sections?.reportingObligations?.note || "Reports shall be submitted through the Principal Officer to FIU-IND."}
              </p>
            </div>

            {/* 16. Data Confidentiality */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.dataConfidentiality?.title || "16. Data Confidentiality"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {kyc?.sections?.dataConfidentiality?.content || "Customer data shall be kept confidential and used only for lawful purposes."}
              </p>
            </div>

            {/* 17. Risk Assessment */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.riskAssessment?.title || "17. Money Laundering and Terrorist Financing Risk Assessment"}
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                {(kyc?.sections?.riskAssessment?.items || [
                  "The Company shall carry out 'Money Laundering (ML) and Terrorist Financing (TF) Risk Assessment' exercise, on annual basis, to identify, assess and take effective measures to mitigate its money laundering and terrorist financing risk as per RBI's guidelines.",
                  "The risk assessment should be properly documented.",
                  "The outcome of the exercise shall be put up to the Risk Management Committee, constituted by the Board of Directors to which power in this regard has been delegated, and should be available to competent authorities and self regulating bodies, if required.",
                  "The Company shall apply a Risk Based Approach (RBA) for mitigation and management of the identified risk and should have Board approved policies, controls and procedures in this regard.",
                  "The Company shall monitor the implementation of the controls and enhance them if necessary."
                ]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 18. Review & Amendment */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#25B181]" />
                {kyc?.sections?.review?.title || "18. Review & Amendment"}
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {kyc?.sections?.review?.content || "This Policy shall be reviewed annually or upon regulatory changes."}
              </p>
            </div>

            {/* Board Approval */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
              <h3 className="text-lg font-semibold mb-2 text-[#2b2b2b]">{kyc?.boardApproval?.title || "Board Approval"}</h3>
              <p className="text-[#2b2b2b] font-semibold">{kyc?.boardApproval?.content || "Approved by the Board of Directors of Satsai Finlease Private Limited"}</p>
              <p className="text-[#2b2b2b]"><span className="font-semibold">{kyc?.boardApproval?.dateLabel || "Approved Date"}:</span> {kyc?.boardApproval?.date || "21.04.2025"}</p>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
