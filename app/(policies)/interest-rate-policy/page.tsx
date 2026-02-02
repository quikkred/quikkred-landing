'use client';

import { motion } from "framer-motion";
import { Percent, FileText, Target, Users, Calculator, CreditCard, MessageSquare, RefreshCw, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function InterestRatePolicyPage() {
  const { t } = useLanguage();

  const irp = t?.policies?.interestRate;
  // console.log(irp)

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
            <Percent className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              {irp?.title || "Interest Rate and Penal Charges Policy"}
            </h1>
            <p className="text-xl">{irp?.subtitle || "Transparent and Fair Interest Rate Structure"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout>
        {/* Document Details */}
        <div className="mb-10 bg-gray-50 rounded-lg sm:p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {irp?.documentDetails?.title || "Document Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2b2b2b] leading-[1.7]">
            <div><span className="font-semibold">{t?.policies?.common?.title || "Title"}:</span> {irp?.documentDetails?.policyTitle || "Interest rate and penal charges policy"}</div>
            <div><span className="font-semibold">{t?.policies?.common?.classification || "Classification"}:</span> {irp?.documentDetails?.classification || "Public"}</div>
            <div><span className="font-semibold">{t?.policies?.common?.approvalDate || "Approved Date"}:</span> {irp?.documentDetails?.approvalDate || "30th June 2023"}</div>
            <div><span className="font-semibold">{t?.policies?.common?.lastReviewDate || "Last Review Date"}:</span> {irp?.documentDetails?.lastReviewDate || "21st April 2025"}</div>
            <div><span className="font-semibold">{t?.policies?.common?.approvedBy || "Approved By"}:</span> {irp?.documentDetails?.approvedBy || "Board of Directors"}</div>
            <div><span className="font-semibold">{t?.policies?.common?.custodian || "Custodian"}:</span> {irp?.documentDetails?.custodian || "Operation"}</div>
          </div>
        </div>

        {/* 1. Introduction */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#25B181]" />
            {irp?.sections?.introduction?.title || "1. Introduction"}
          </h2>
          {(irp?.sections?.introduction?.content || [
            "The Reserve Bank of India (\"RBI\") vide its Master Direction – Reserve Bank of India (Non-Banking Financial Company – Scale Based Regulation) Directions, 2023 advised all Non-Systemically Important Non-Deposit taking NBFCs to lay out appropriate internal principles and procedures in determining interest rates, Platform fee and other charges. RBI also directed to make the policy available on the website of the NBFC, and update whenever there is a change.",
            "The Board of Directors of Satsai Finlease Private Limited (\"Company\") in their meeting held on June 30, 2023, had adopted the Interest Rate Policy (\"the Policy\") in accordance with the RBI Directions earlier applicable on the Company. The same has now been revised to reflect the changes in internal policies etc.",
            "This Policy should always be read in conjunction with extant RBI guidelines, directives, circulars and instructions."
          ]).map((paragraph: string, index: number) => (
            <p key={index} className="text-[#2b2b2b] leading-[1.7] mb-4">{paragraph}</p>
          ))}
        </div>

        {/* 2. Objective */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#25B181]" />
            {irp?.sections?.objective?.title || "2. Objective"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">{irp?.sections?.objective?.intro || "The main objectives of this Policy are to:"}</p>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            {(irp?.sections?.objective?.items || [
              "Ensure that interest rates are determined in a manner as to ensure long term sustainability of business by taking into account the interests of all stakeholders.",
              "Develop and adopt a suitable model for calculation of an interest rate.",
              "Enable fixation of interest rates which are reasonable: both actual and perceived.",
              "Ensure that computation of interest is accurate, fair and transparent in line with regulatory guidelines and market practices.",
              "Charge differential rates of interest linked to the risk factors as applicable.",
              "Decide on the principles, methodology and approach of charging spreads to arrive at final rates charged from customers."
            ]).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Role of Board */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 sm:gap-2">
            <div className="w-auto">
              <Users className="w-6 h-6 text-[#25B181]" />
            </div>
            {irp?.sections?.boardRole?.title || "3. Role of Board of Directors"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {irp?.sections?.boardRole?.content || "The Board of Directors shall have oversight for the interest rate Policy of the Company. To ensure effective implementation of the Interest Rate Policy."}
          </p>
        </div>

        {/* 4. Determination of Interest Rates */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <div className="w-auto">
              <Calculator className="w-6 h-6 text-[#25B181]" />
            </div>
            {irp?.sections?.determination?.title || "4. Determination of Interest Rates on Loans and Credit Facility"}
          </h2>
          {(irp?.sections?.determination?.intro || [
            "The Company lends money to its customers mainly through digital platforms and has various products to cater to the needs of different categories of customers.",
            "The interest rate of each product is decided from time to time, giving due consideration to the following factors:"
          ]).map((paragraph: string, index: number) => (
            <p key={index} className="text-[#2b2b2b] leading-[1.7] mb-4">{paragraph}</p>
          ))}

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{irp?.sections?.determination?.factors?.costOfCapital?.title || "Cost of Capital"}</h4>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {irp?.sections?.determination?.factors?.costOfCapital?.content || "To run the business, the Company has been infused with equity share capital in huge proportions, and accordingly the cost of such equity share capital being infused shall be taken into consideration."}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{irp?.sections?.determination?.factors?.borrowingCost?.title || "Weighted Average Cost of Borrowing"}</h4>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {irp?.sections?.determination?.factors?.borrowingCost?.content || "Since the Company borrows funds from various banks, financial institutions and other external lender(s), the weighted average borrowing cost, as well as costs incidental to those borrowings like brokerage, consultancy fees, Platform fees shall be taken into consideration. The cost of borrowings varies according to market conditions thus pricing of interest rates shall be consequently impacted and decided accordingly."}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{irp?.sections?.determination?.factors?.risk?.title || "Risk"}</h4>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {irp?.sections?.determination?.factors?.risk?.content || "Risk related to loss of credit due to short tenure of loan, nature of facility, ticket size of loan, geographical condition, customer segment, sourcing channels, stability in earnings and employment, financial position, past repayment track record with us or other lenders, external ratings of customers, credit reports, customer relationship, other existing indebtedness, results from digital verifications etc. Therefore, risk of recovery of loan shall be taken into consideration and accordingly the risk premium would be reckoned."}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{irp?.sections?.determination?.factors?.opexCost?.title || "Opex Cost"}</h4>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {irp?.sections?.determination?.factors?.opexCost?.content || "It includes employee expenses, office and infrastructure related fixed and variable costs, operations costs, sales and marketing expenses, etc."}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2 text-[#2b2b2b]">{irp?.sections?.determination?.factors?.profitMargin?.title || "Profit Margin"}</h4>
              <p className="text-[#2b2b2b] leading-[1.7]">
                {irp?.sections?.determination?.factors?.profitMargin?.content || "Fair profit margin is added to arrive at the lending rate. The company may at its discretion fix different margins for different customers, considering the risk of default. All customers will however be notified of the interest payable for the loan to be availed from the company."}
              </p>
            </div>
          </div>

          <p className="text-[#2b2b2b] leading-[1.7] mt-6 mb-4">
            {irp?.sections?.determination?.boardApproval || "The Board of Directors, in its meeting held on April 21, 2025, reviewed and approved the revised Interest Rate and Penal Charges Policy. The Board further resolved to update the interest rate structure, which shall now be applicable as follows:"}
          </p>

          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            {(irp?.sections?.determination?.rateStructure || [
              { type: "Pay Day Loan", rate: "0.10% to 1.00% per day" },
              { type: "Business Loan", rate: "8% to 25% per annum" },
              { type: "Loan Against Property (LAP)", rate: "12% to 15% per annum" },
              { type: "EMI Loan", rate: "24% to 365% per annum, with a maximum tenure of up to 6 months" }
            ]).map((item: { type: string; rate: string }, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span><strong>{item.type}:</strong> {item.rate}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Platform fees / Penal Charges */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#25B181]" />
            {irp?.sections?.penalCharges?.title || "5. Platform fees / Penal Charges / Other Charges"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            {(irp?.sections?.penalCharges?.items || [
              "Besides interest, other financial charges like Platform fees, Equated Monthly Installment (EMI) bouncing charges, penal charges on late repayment of a loan or EMI, rescheduling charges, prepayment / foreclosure charges, part disbursement charges, charges for issue of statement accounts etc., would be levied by the company wherever considered necessary. Besides these charges, stamp duty, service tax / GST and other cess would be collected at applicable rates from time to time. Any revision in these charges would be implemented on a prospective basis with due communication to customers.",
              "The board decided that the company will levied a EMI Bouncing charges of Rs. 580/-.",
              "The Company shall ensure that no capitalisation of penal charges i.e., no further interest computed on such charges. The Company shall also not introduce any additional component to the rate of interest and ensure its strict compliance.",
              "The Penal Charges will be levied at the rate of 0.1% per day of outstanding principal loan amount.",
              "The Company shall ensure that the quantum of penal charges is reasonable and commensurate with the non-compliance of material terms and conditions of loan contract without being discriminatory within a particular loan / product category.",
              "The Company shall display the quantum and reason for penal charges to the customers in the loan agreement and / Key Fact Statement (KFS) as applicable.",
              "The applicable penal charges, as updated from time to time, shall be displayed on the Company's website.",
              "The Company shall ensure that the applicable penal charges are clearly communicated to the borrowers, whenever reminders for non-compliance of loan terms are sent to borrowers.",
              "Any instance of levy of penal charges and the reason therefore shall also be appropriately communicated to the borrowers."
            ]).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 6. Communication to Customer */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#25B181]" />
            {irp?.sections?.communication?.title || "6. Communication to Customer"}
          </h2>
          {(irp?.sections?.communication?.content || [
            "The Company shall communicate the effective rate of interest to customers at the time of sanction / availing of the loan through the acceptable mode of communication. Interest Rate Policy would be uploaded on the website of the company and any change therein would be uploaded on the website of the Company.",
            "Changes in the rates and charges for existing customers, if any, would be communicated to them through various modes of communication such as on the website, digital platform and/or via email, letters, SMS, etc. However, the company would ensure that there is no change during the tenure of the loan for such loans which had already been contracted with customers."
          ]).map((paragraph: string, index: number) => (
            <p key={index} className="text-[#2b2b2b] leading-[1.7] mb-4">{paragraph}</p>
          ))}
        </div>

        {/* 7. Waiver / Reduction */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#25B181]" />
            {irp?.sections?.waiver?.title || "7. Waiver / Reduction of Charges"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {irp?.sections?.waiver?.content || "Managing Director or Business Head Loan of the Company be authorized to waive-off / reduce any amount including Principal amount / Interest Rates, Processing and Other Charges, at their own discretion, as may deem fit. Further, aforesaid officials may delegate this authority in favor of any other person."}
          </p>
        </div>

        {/* 8. Amendments */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {irp?.sections?.amendments?.title || "8. Amendments to this Policy"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7]">
            {irp?.sections?.amendments?.content || "The Board of directors is authorized to make appropriate changes to this Policy taking into account changes in the money market scenario in the Country which includes the upward / downward revision in interest rates applicable to various loan products and the relevant charges applicable for such loan products."}
          </p>
        </div>
      </PoliciesLayout>
    </div>
  );
}
