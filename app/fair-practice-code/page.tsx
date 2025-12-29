'use client';

import { motion } from "framer-motion";
import { Scale, FileCheck, Shield, Users, Headphones, BookOpen, FileText, AlertCircle, Building, CreditCard, Home, Clock, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function FairPracticeCodePage() {
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
            <Scale className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Fair Practices Code
            </h1>
            <p className="text-xl">Transparency, Integrity, and Responsible Lending</p>
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
                <div><span className="font-semibold">Title:</span> Fair Practice Code</div>
                <div><span className="font-semibold">Classification:</span> Public</div>
                <div><span className="font-semibold">Approval Date:</span> 30th June 2023</div>
                <div><span className="font-semibold">Last Review Date:</span> 21st April 2025</div>
                <div><span className="font-semibold">Approved by:</span> Board of Directors</div>
                <div><span className="font-semibold">Custodian:</span> Compliance Function</div>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#25B181]" />
                Introduction
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                RBI has drafted the guidelines on Fair Practices Code for Non-Banking Finance Companies which sets the fair practices standards when dealing with individual customers and to serve as a part of best corporate practice.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                It is, and shall be, our policy to make loan products available to all qualified applicants without discrimination on the basis of race, caste, colour, religion, sex, marital status or handicap. Our policy is to treat all the customers consistently and fairly. Our employees will offer assistance, encouragement and service in a fair, equitable and consistent manner. We will also communicate our Fair Practices Code to our customers by placing it on the company's website.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                We shall ensure that charges / fees are appropriately informed to the borrower. Terms and conditions pertaining to the facility will be conveyed to the prospective borrowers. We commit that disputes arising out of the lending decisions will be appropriately resolved by a grievance redressal mechanism set up by us.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Company's Fair lending practices shall apply across all aspects of our operations including marketing, loan origination, processing, servicing and collection activities. Our commitment to Fair Practice Code would be demonstrated in terms of employee accountability, monitoring and auditing programs, training and technology.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Company's Board of Directors and the management Team is responsible for establishing practices designed to ensure that our operations reflect our strong commitment to fair lending and that all employees are aware of that commitment. Satsai Finance Private Limited is committed to providing service of the highest quality to its clients.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                This Fair Practices Code applies to all categories of products and services offered by us (currently offered or which may be introduced at a future date).
              </p>
              <p className="text-[#2b2b2b] leading-[1.7]">
                The Fair Practices Code is applicable to the above irrespective of whether the same is provided at the Branch, over the phone, on the Internet or by any other method we may be currently using or may introduce at a future date.
              </p>
            </div>

            {/* Objective */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#25B181]" />
                Objective
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">The primary objectives of this FPC are following:</p>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>To promote fair, ethical, and transparent dealings with customers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>To establish a fair relationship between the customer and Company.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>To ensure compliance with legal norms in matters relating to recovery of advances.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>To strengthen mechanisms for redressal of customer grievances effectively and efficiently.</span>
                </li>
              </ul>
            </div>

            {/* Key Commitments */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#25B181]" />
                Key Commitments
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">The Company's key commitments to customers are:</p>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">Act fairly and reasonably in all their dealings with customers by:</h3>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Meeting the commitments and standards specified in the Code, for the products and services which the Company offers and, in the procedures, and practices its staff follows;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Making sure that Company's products and services meet relevant laws and regulations applicable to it;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Company's dealings with customers will rest on ethical principles of integrity and transparency.</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">Help customers understand how company's product works by:</h3>
                <p className="text-[#2b2b2b] leading-[1.7]">Explaining their financial implications.</p>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">Deal quickly and sympathetically with things that go wrong by:</h3>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Correcting mistakes;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Handling customer's complaints;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>Telling customers how to take their complaint forward if they are still not satisfied.</span>
                  </li>
                </ul>
              </div>

              <p className="text-[#2b2b2b] leading-[1.7]">Publicize the Code, display it on Company's website and have copies available for customer on request.</p>
            </div>

            {/* 1. Applications for loans */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#25B181]" />
                1. Applications for Loans and Their Processing
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>All communications to the borrower shall be in the vernacular language or a language as understood by the borrower.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Loan application forms will include necessary information, which affects the interest of the borrower, so that a meaningful comparison with the terms and conditions offered by other NBFCs can be made and informed decision can be taken by the borrower. The loan application form will indicate the documents required to be submitted with the application form.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The company will devise a system of giving acknowledgement for receipt of all loan applications. Preferably, the time frame within which loan applications will be disposed of will also be indicated in the acknowledgement.</span>
                </li>
              </ul>
            </div>

            {/* 2. Loan appraisal */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#25B181]" />
                2. Loan Appraisal and Terms/Conditions and Key Facts Statement
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Company shall make proper and prompt assessment of all Loan applications. The Company shall conduct a due diligence on the credit worthiness of the applicants. Mere offering of Hypothecation on Asset will not be the sole consideration for sanctioning loans.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                When sanctioned, the company shall convey to the applicant the details of Loan amount, interest rates, penal interest for late payment, repayment schedule, terms & conditions for loan and other charges in Loan Agreement in writing to the borrower in the vernacular language or any other language as understood by the borrower by means of sanction letter or otherwise and keep the acceptance of these terms and conditions by the borrower on Company's record. The Company will also mention the penal charge which will be charged for late repayment and / or any other default on the part of the customer, in bold in the loan agreement.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The company shall furnish a copy of the loan agreement as understood by the borrower along with a copy each of all enclosures quoted in the loan agreement to all the borrowers at the time of sanction/disbursement of loans.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7]">
                The company shall comply with the instructions contained in the circular on 'Key Facts Statement (KFS) for Loans & Advances' dated April 15, 2024, as amended from time to time.
              </p>
            </div>

            {/* 3. Penal charges */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#25B181]" />
                3. Penal Charges in Loan Accounts
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Penalty, if charged, for non-compliance of material terms and conditions of loan contract by the borrower shall be treated as 'penal charges' and shall not be levied in the form of 'penal interest' that is added to the rate of interest charged on the advances.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>There shall be no capitalization of penal charges i.e., no further interest computed on such charges. However, this will not affect the normal procedures for compounding of interest in the loan account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The company will formulate a Board approved policy on penal charges or similar charges on loans, by whatever name called.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The quantum of penal charges shall be reasonable and commensurate with the non-compliance of material terms and conditions of loan contract without being discriminatory within a particular loan/product category.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The penal charges in case of loans sanctioned to individual borrowers, for purposes other than business, shall not be higher than the penal charges to non-individual borrowers for similar non-compliance of material terms and conditions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The quantum and reason for penal charges shall be clearly disclosed by the company to the customers in the loan agreement and most important terms & conditions/Key Fact Statement (KFS), in addition to being displayed on websites of the company under Interest rates and Service Charges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Whenever reminders for non-compliance of material terms and conditions of loan are sent to borrowers, the penal charges shall be communicated. Further, any instance of levy of penal charges and the reason therefor shall also be communicated.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The Company shall implement the revised penal charges framework for all fresh loans sanctioned or renewed on or after April 01, 2024, and ensure migration of existing loans to the new regime at the time of their next review or renewal, but not later than June 30, 2024.</span>
                </li>
              </ul>
            </div>

            {/* 4. Disbursement */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#25B181]" />
                4. Disbursement of Loans Including Changes in Terms and Conditions
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The company will give notice to the borrower of any change in the terms and conditions including disbursement schedule, interest rates, service charges, prepayment charges etc. We will also ensure that changes in interest rates and charges are effected only prospectively. A suitable condition in this regard will be incorporated in the loan agreement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Decision to recall / accelerate payment or performance under the agreement will be in consonance with the loan agreement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The company will release all securities on repayment of all dues or on realisation of the outstanding amount of loan subject to any legitimate right or lien for any other claim company may have against borrower. If such right of set off is to be exercised, the borrower will be given notice about the same with full particulars about the remaining claims and the conditions under which company is entitled to retain the securities till the relevant claim is settled/paid.</span>
                </li>
              </ul>
            </div>

            {/* 5. Responsible Lending */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Home className="w-6 h-6 text-[#25B181]" />
                5. Responsible Lending Conduct - Release of Property Documents
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">To address the issues faced by the borrowers and towards promoting responsible lending conduct, the following instructions shall be followed:</p>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">a. Release of movable/immovable property documents</h3>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>The company will release all the original movable / immovable property documents and remove charges registered with any registry within a period of 30 days after full repayment/settlement of the loan account.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>The borrower shall be given the option of collecting the original movable/ immovable property documents either from the banking outlet/branch where the loan account was serviced or any other office of the company where the documents are available, as per her/his preference.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>The timeline and place of return of original movable/immovable property documents shall be mentioned in the loan sanction letters issued on or after the effective date.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>In order to address the contingent event of demise of the sole borrower or joint borrowers, company will have a well laid out procedure for return of original movable/immovable property documents to the legal heirs. Such procedure shall be displayed on the website of company along with other similar policies and procedures for customer information.</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">b. Compensation for delay in release of property documents</h3>
                <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>In case of delay in releasing of original movable/immovable property documents or failing to file charge satisfaction form with relevant registry beyond 30 days after full repayment/ settlement of loan, company will communicate to the borrower reasons for such delay.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>In case where the delay is attributable to the NBFC, it shall compensate the borrower at the rate of ₹5,000 for each day of delay.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>In case of loss/damage to original movable/immovable property documents, the company will assist the borrower in obtaining duplicate/certified copies and shall bear the associated costs. However, in such cases, an additional time of 30 days will be available to the company to complete this procedure and the delayed period penalty will be calculated thereafter (i.e., after a total period of 60 days).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#25B181] mt-1">•</span>
                    <span>The compensation provided shall be without prejudice to the rights of a borrower to get any other compensation as per any applicable law.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 6. Reset of floating interest rate */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#25B181]" />
                6. Reset of Floating Interest Rate on EMI Based Personal Loans
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>At the time of sanctioning EMI-based floating rate personal loans, the Company shall assess the borrower's repayment capacity with adequate margin for possible increases in external benchmark rates. Borrowers shall be given the option of (a) enhancement in EMI or elongation of tenor or for a combination of both options; and, (b) to prepay, either in part or in full, at any point during the tenor of the loan. Levy of foreclosure charges/prepayment penalty shall be subject to extant instructions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>All applicable charges for switching of loans from floating to fixed rate and any other service charges/ administrative costs incidental to the exercise of the above options shall be transparently disclosed in the sanction letter and also at the time of revision of such charges/costs by the company from time to time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Company will ensure that the elongation of tenor in case of floating rate loan does not result in negative amortisation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Company will share/make accessible to the borrowers, through appropriate channels, a statement at the end of each quarter which shall at the minimum, enumerate the principal and interest recovered till date, EMI amount, number of EMIs left and annualized rate of interest/Annual Percentage Rate (APR) for the entire tenor of the loan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>Apart from the equated monthly instalment loans, these instructions would also apply, mutatis mutandis, to all equated instalment based loans of different periodicities. All existing borrowers shall be sent a communication, through appropriate channels, intimating the options available to them.</span>
                </li>
              </ul>
            </div>

            {/* 7. General */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                7. General
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">1)</span>
                  <span>The company will refrain from interference in the affairs of the borrower except for the purposes provided in the terms and conditions of the loan agreement (unless new information, not earlier disclosed by the borrower, has come to the notice of the lender).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">2)</span>
                  <span>In case of receipt of request from the borrower for transfer of borrower account, the consent or otherwise i.e. objection of the company, if any, will be conveyed within 21 days from the date of receipt of request. Such transfer shall be as per transparent contractual terms in consonance with law.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">3)</span>
                  <span>In the matter of recovery of loans, the company will not resort to undue harassment viz. persistently bothering the borrowers at odd hours, use of muscle power for recovery of loans, etc. NBFCs shall ensure that the staff are adequately trained to deal with the customers in an appropriate manner.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">4)</span>
                  <span>Company will not charge foreclosure charges/pre-payment penalties on any floating rate term loan sanctioned for purposes other than business to individual borrowers, with or without co-obligant(s).</span>
                </li>
              </ul>
            </div>

            {/* 8. Responsibility of Board */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Building className="w-6 h-6 text-[#25B181]" />
                8. Responsibility of Board of Directors
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                The Board of Directors of company will lay down the appropriate grievance redressal mechanism within the organization. Such a mechanism shall ensure that all disputes arising out of the decisions of lending institution's functionaries are heard and disposed of at least at the next higher level.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7]">
                The Board of Directors shall also provide for periodical review of the compliance of the Fair Practices Code and the functioning of the grievances redressal mechanism at various levels of management. A consolidated report of such reviews shall be submitted to the Board at regular intervals, as may be prescribed by it.
              </p>
            </div>

            {/* 9. Further Assistance */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Headphones className="w-6 h-6 text-[#25B181]" />
                9. Further Assistance
              </h2>

              {/* <div className="mb-6">
                <h3 className="text-xl font-medium mb-3 text-[#2b2b2b]">Complaints:</h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  In case of any complaint/grievance, the applicant/borrowers will have to inform in writing the concerned branch. The Branch Officials shall immediately take up the matter for redressal.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-3 text-[#2b2b2b]">Grievances Redressal Mechanism:</h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  All disputes in relation to the products and services shall be heard and disposed off within 30 days from the date of receipt of the complete details in respect of the grievance.
                </p>
              </div>

              <div className="mb-6 bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 border-l-4 border-[#25B181]">
                <h3 className="text-xl font-medium mb-4 text-[#2b2b2b]">Grievance Redressal – Contact Details:</h3>
                <p className="text-[#2b2b2b] leading-[1.7] mb-4">In case of grievances you may contact the Grievance Redressal Officer:</p>
                <div className="space-y-2 text-[#2b2b2b] leading-[1.7]">
                  <p><span className="font-semibold">Name of Grievance Redressal Officer:</span> Mr. Samir Sethi</p>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#25B181]" /> <span className="font-semibold">Email:</span> info@ramfincorp.com</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#25B181]" /> <span className="font-semibold">Address:</span> 8/9, 2nd Floor, WEA, Karol Bagh, New Delhi – 110005</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#25B181]" /> <span className="font-semibold">Contact No.:</span> +91-9311417272</p>
                </div>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                  In case the borrower is not satisfied with the decision of the Grievance Redressal Officer of the Company, he may approach the Officer in Charge of the Regional Office of Department of Non-Banking Supervision of RBI at the address given below:
                </p>
                <div className="text-[#2b2b2b] leading-[1.7]">
                  <p className="font-semibold">Department of Non-Banking Supervision</p>
                  <p>The General Manager</p>
                  <p>Department of Supervision (DoS)</p>
                  <p>Reserve Bank of India</p>
                  <p>6, Sansad Marg, New Delhi- 110001</p>
                </div>
              </div>

              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                A consolidated report of periodical review of compliance of fair practice code and functioning of the grievances redressal mechanism at various levels of management may be submitted to the Board/Committee of Directors at regular intervals as may be prescribed by it.
              </p> */}

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-3 text-[#2b2b2b]">Feedback and Suggestions</h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  We request our customers to provide feedback on our service to help us to improve our services.
                </p>
              </div>

              {/* <div className="mb-6">
                <h3 className="text-xl font-medium mb-3 text-[#2b2b2b]">Monitoring</h3>
                <p className="text-[#2b2b2b] leading-[1.7]">
                  We have a Grievance Redressal Officer to ensure compliance of the Code.
                </p>
              </div> */}
            </div>

            {/* 10. Regulation of excessive interest */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#25B181]" />
                10. Regulation of Excessive Interest Charged by Company
              </h2>
              <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The Board of company shall adopt an interest rate model taking into account relevant factors such as cost of funds, margin and risk premium and determine the rate of interest to be charged for loans and advances.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The rate of interest and the approach for gradations of risk and rationale for charging different rate of interest to different categories of borrowers shall be disclosed to the borrower or customer in the application form and communicated explicitly in the sanction letter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The rates of interest and the approach for gradation of risks shall also be made available on the website of the companies or published in the relevant newspapers. The information published shall be updated whenever there is a change in the rates of interest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>The rate of interest must be annualised rate so that the borrower is aware of the exact rates that would be charged to the account.</span>
                </li>
              </ul>
            </div>

            {/* 11. Complaints about excessive interest */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#25B181]" />
                11. Complaints About Excessive Interest Charged by NBFCs
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7] mb-4">
                Company recognize that charging fair and reasonable interest is essential to building long-term trust with our customers. While interest rates are determined by the company, we are committed to ensuring that they remain justifiable, sustainable, and in line with normal financial practices. We will not levy interest or charges at levels that could be considered excessive or unfair.
              </p>
              <p className="text-[#2b2b2b] leading-[1.7]">
                To achieve this, our Board has laid down clear internal principles and procedures for determining interest rates, processing fees, and other applicable charges. These principles are guided by transparency, fairness, and accountability. Customers will always be informed in a clear and transparent manner about the applicable terms and conditions of their loans, in line with our Fair Practices Code.
              </p>
            </div>

            {/* 12. Loan facilities to physically/visually challenged */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#25B181]" />
                12. Loan Facilities to the Physically/Visually Challenged
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                Company will not discriminate in extending products and facilities including loan facilities to physically/visually challenged applicants on grounds of disability.
              </p>
            </div>

            {/* 13. Review */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#25B181]" />
                13. Review
              </h2>
              <p className="text-[#2b2b2b] leading-[1.7]">
                The Board of Director reserves the right to review the Fair Practice Code from time to time and to carryout necessary changes, accordingly as and when required. The code will be available on the website of the Company and copies will be made available on request.
              </p>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
