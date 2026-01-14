'use client';

import { motion } from "framer-motion";
import { Landmark, FileText, Target, Shield, Users, BookOpen, Scale, RefreshCw, Building, Clock, TrendingUp, Home, UserCheck, ClipboardList, DollarSign, Activity, AlertCircle, Calendar, Percent, CreditCard, Smartphone, Globe, Fingerprint, CreditCardIcon } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function LendingPolicyPage() {
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
            <Landmark className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Lending Policy
            </h1>
            <p className="text-xl">Responsible &amp; Transparent Lending Practices</p>
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
                <div><span className="font-semibold">Title:</span> Lending Policy</div>
                <div><span className="font-semibold">Classification:</span> Public</div>
                <div><span className="font-semibold">Effective Date:</span> 1st April 2025</div>
                <div><span className="font-semibold">Approved by:</span> Board of Directors</div>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#25B181]" />
                Overview
              </h2>

              <h3 className="text-xl font-semibold mb-3 text-[#2b2b2b]">Background</h3>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                We, Satsai Finlease Private Limited, an RBI registered NBFC committed to providing personal loans to employed professionals. We easily meet your unique financial needs by incorporating innovation into the credit availing process, giving you instant access to funds directly.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                We offer loans at affordable interest rates due to a minimal risk profile. At Quikkred, we take pride in offering the lowest interest rates to our borrowers, ensuring they are not unnecessarily burdened by high interest rates.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#2b2b2b]">Purpose of Manual</h3>
              <p className="text-[#2b2b2b] leading-[1.7]">
                The purpose of this document is to provide a detailed description of the target customer profile for this product, sourcing strategy, customer selection criteria, product and program offering, detail credit and risk norms, risk mitigation and provide a high-level business process flow.
              </p>
            </div>

            {/* Payments Landscape */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#25B181]" />
                Payments Landscape
              </h2>

              <h3 className="text-xl font-semibold mb-3 text-[#2b2b2b]">Recent Trends</h3>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                While the Indian economy has traditionally been a cash-based economy, this trend is fast changing. Non-cash-based payments have been registering an upward trend in recent times. India&apos;s digital payment system has grown exponentially in recent years. The digital payments sector is expected to contribute significantly to India&apos;s gross domestic product (GDP). Multiple factors and official &amp; behavioral trends are fueling this shift towards a cashless economy.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                Enhanced internet connectivity, high rate of penetration of smartphones and flagship government initiatives such as &apos;Digital India&apos; have been acting as key catalysts for this change. In fact, non-cash payments are expected to overtake cash transactions in the coming years.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-[#2b2b2b] leading-[1.7] text-sm italic">
                  * Source: Digital Payments Report - BCG &amp; Google
                </p>
              </div>
            </div>

            {/* Digital Economy - Key Enablers */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-[#25B181]" />
                Digital Economy – Key Enablers
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-6">
                There are key enablers which have hastened the transformation to a digital economy with pull and push type of payment requests:
              </p>

              {/* Aadhaar Enabled Payments */}
              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-[#25B181]" />
                  Aadhaar Enabled Payments
                </h3>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <h4 className="font-semibold text-[#25B181] mb-2">Aadhaar Payment Bridge (APB)</h4>
                    <p className="text-[#2b2b2b] leading-[1.7] text-sm">
                      Helps make payments directly to the Aadhaar enabled bank accounts of people.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <h4 className="font-semibold text-[#25B181] mb-2">Aadhaar Payment System (APS)</h4>
                    <p className="text-[#2b2b2b] leading-[1.7] text-sm">
                      Users can provide their Aadhaar number and fingerprints at a micro ATM to benefit from financial services.
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-3">
                  <p className="text-[#2b2b2b] leading-[1.7] text-sm">
                    While the authentication is done by UIDAI, the financial transactions are handled by NPCI.
                  </p>
                </div>
              </div>

              {/* POS Machines */}
              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#25B181]" />
                  POS Machines (Credit/Debit Card Swipe)
                </h3>

                <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                  Demonetization has created the need for a shift to digital transactions, its surprise element depriving cash of the security and confidence it once enjoyed as a legal tender. A point of sale terminal (POS machine) is an electronic device used to process card payments at retail locations.
                </p>

                <p className="text-[#2b2b2b] leading-[1.7] mb-3 font-semibold">
                  A POS terminal generally does the following:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="w-6 h-6 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                    <p className="text-[#2b2b2b] text-sm">Reads the information of a customer&apos;s credit or debit card</p>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="w-6 h-6 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                    <p className="text-[#2b2b2b] text-sm">Checks whether the funds in a customer&apos;s bank account are enough</p>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="w-6 h-6 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                    <p className="text-[#2b2b2b] text-sm">Transfers the funds from the customer&apos;s account to the seller&apos;s account (or accounts for the transfer with the credit card network)</p>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="w-6 h-6 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                    <p className="text-[#2b2b2b] text-sm">Records the transaction and prints a receipt</p>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3">
                  <p className="text-[#2b2b2b] leading-[1.7] text-sm">
                    The number of POS machines in India has grown significantly post-demonetization, reflecting the rapid shift towards digital payment infrastructure across the country.
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Products */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#25B181]" />
                Loan Products
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Company offers the following loan products:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#25B181]" />
                    Pay Day Loans
                  </h3>
                  <p className="text-sm text-[#2b2b2b]">Short-term unsecured loans for immediate cash needs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#25B181]" />
                    Loans Against Property
                  </h3>
                  <p className="text-sm text-[#2b2b2b]">Secured loans against residential/commercial property</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#25B181]" />
                    EMI-Based Retail Loans
                  </h3>
                  <p className="text-sm text-[#2b2b2b]">Consumer loans with structured EMI repayments</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#25B181]" />
                    Business Loans
                  </h3>
                  <p className="text-sm text-[#2b2b2b]">Working capital and term loans for businesses</p>
                </div>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#25B181]" />
                Eligibility Criteria
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                To be eligible for a loan, applicants must meet the following criteria:
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Indian citizen aged 21 years and above</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Valid KYC documents (Aadhaar, PAN, Address Proof)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Stable and verifiable source of income</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Active bank account with digital transaction history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Satisfactory credit history and bureau score</span>
                </li>
              </ul>
            </div>

            {/* Loan Application Process */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-[#25B181]" />
                Loan Application Process
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Application Submission</h3>
                    <p className="text-sm text-[#2b2b2b]">Complete online application with required details and documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">KYC Verification</h3>
                    <p className="text-sm text-[#2b2b2b]">Digital KYC verification through Aadhaar-based authentication</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Credit Assessment</h3>
                    <p className="text-sm text-[#2b2b2b]">Evaluation of creditworthiness, income, and repayment capacity</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Loan Approval &amp; Sanction</h3>
                    <p className="text-sm text-[#2b2b2b]">Approval decision with Key Fact Statement (KFS) disclosure</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                  <div>
                    <h3 className="font-semibold mb-1">Disbursement</h3>
                    <p className="text-sm text-[#2b2b2b]">Direct transfer to borrower&apos;s bank account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interest Rates & Charges */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Percent className="w-6 h-6 text-[#25B181]" />
                Interest Rates &amp; Charges
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                Interest rates are determined based on:
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Risk profile of the borrower</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Loan amount and tenure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Type of loan product</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Prevailing market conditions</span>
                </li>
              </ul>
              <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-[#2b2b2b] leading-[1.7]">
                  <strong>Transparency Commitment:</strong> All applicable charges including Platform fees, interest rates (APR), penal charges, and other fees are disclosed upfront in the Key Fact Statement (KFS) before loan sanction.
                </p>
              </div>
            </div>

            {/* Disbursement Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-[#25B181]" />
                Disbursement Policy
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>All loans are disbursed directly to the borrower&apos;s bank account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>No disbursement to third-party accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Disbursement only after borrower&apos;s acceptance of loan terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Real-time SMS and email notifications upon disbursement</span>
                </li>
              </ul>
            </div>

            {/* Repayment */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-[#25B181]" />
                Repayment
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Repayment through NACH/ECS/UPI mandate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Flexible prepayment options available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>No foreclosure charges on floating rate loans (as per RBI guidelines)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Timely repayment reminders via SMS/Email/App notifications</span>
                </li>
              </ul>
            </div>

            {/* Borrower Rights */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#25B181]" />
                Borrower Rights
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                Every borrower has the right to:
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Receive complete information about loan terms before acceptance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Access the Key Fact Statement (KFS) in vernacular language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Cooling-off period to exit the loan without penalty</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Lodge grievances through designated channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Data privacy and protection as per DPDP Act</span>
                </li>
              </ul>
            </div>

            {/* Grievance Redressal */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                Grievance Redressal
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Company has a robust grievance redressal mechanism:
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Dedicated customer support channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Grievance Redressal Officer for escalated complaints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Resolution within 30 days of complaint receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Escalation to RBI Ombudsman if unresolved</span>
                </li>
              </ul>
            </div>

            {/* Regulatory Compliance */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#25B181]" />
                Regulatory Compliance
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                This Lending Policy is compliant with:
              </p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>RBI Master Direction on Digital Lending</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Fair Practices Code for NBFCs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>KYC/AML Guidelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span>Digital Personal Data Protection Act, 2023</span>
                </li>
              </ul>
            </div>

            {/* Policy Review */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#25B181]" />
                Policy Review
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                This policy shall be reviewed annually or upon any regulatory changes, whichever is earlier.
              </p>
            </div>

            {/* Effective Date */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#25B181]" />
                Effective Date
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                This Policy shall come into effect from <strong>1st April 2025</strong>.
              </p>
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
