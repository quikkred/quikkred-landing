'use client';

import styles from './page.module.css';

export default function InterestRatePolicyPage() {
  return (
    <div>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>
            Interest Rate and Penal<br />Charges Policy
          </h1>
        </div>
      </header>

      {/* Document Details Section */}
      <section className={styles.documentDetails}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Document Details</h2>
          <div className={styles.detailsCard}>
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Title</div>
              <div className={styles.detailsValue}>Interest rate and penal charges policy</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Classification</div>
              <div className={styles.detailsValue}>Public</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Approved Date</div>
              <div className={styles.detailsValue}>30th June 2023</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Last Review Date</div>
              <div className={styles.detailsValue}>21st April 2025</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Approved By</div>
              <div className={styles.detailsValue}>Board of Directors</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Custodian</div>
              <div className={styles.detailsValue}>Operation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={styles.mainContent}>
        <div className={styles.container}>

          {/* 1. Introduction */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>1. Introduction</h3>
            <p className={styles.paragraph}>
              The Reserve Bank of India (&quot;RBI&quot;) vide its Master Direction – Reserve Bank of India (Non-Banking Financial Company – Scale Based Regulation) Directions, 2023 advised all Non-Systemically Important Non-Deposit taking NBFCs to lay out appropriate internal principles and procedures in determining interest rates, processing fee and other charges. RBI also directed to make the policy available on the website of the NBFC, and update whenever there is a change.
            </p>
            <p className={styles.paragraph}>
              The Board of Directors of Satsai Finance Private Limited (&quot;Company&quot;) in their meeting held on June 30, 2023, had adopted the Interest Rate Policy (&quot;the Policy&quot;) in accordance with the RBI Directions earlier applicable on the Company. The same has now been revised to reflect the changes in internal policies etc.
            </p>
            <p className={styles.paragraph}>
              This Policy should always be read in conjunction with extant RBI guidelines, directives, circulars and instructions.
            </p>
          </div>

          {/* 2. Objective */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>2. Objective</h3>
            <p className={styles.paragraph}>
              The main objectives of this Policy are to:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Ensure that interest rates are determined in a manner as to ensure long term sustainability of business by taking into account the interests of all stakeholders.
              </li>
              <li className={styles.listItem}>
                Develop and adopt a suitable model for calculation of an interest rate.
              </li>
              <li className={styles.listItem}>
                Enable fixation of interest rates which are reasonable: both actual and perceived.
              </li>
              <li className={styles.listItem}>
                Ensure that computation of interest is accurate, fair and transparent in line with regulatory guidelines and market practices.
              </li>
              <li className={styles.listItem}>
                Charge differential rates of interest linked to the risk factors as applicable.
              </li>
              <li className={styles.listItem}>
                Decide on the principles, methodology and approach of charging spreads to arrive at final rates charged from customers.
              </li>
            </ul>
          </div>

          {/* 3. Role of Board of Directors */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>3. Role of Board of Directors</h3>
            <p className={styles.paragraph}>
              The Board of Directors shall have oversight for the interest rate Policy of the Company. To ensure effective implementation of the Interest Rate Policy.
            </p>
          </div>

          {/* 4. Determination of Interest Rates */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>4. Determination of Interest Rates on Loans and Credit Facility</h3>
            <p className={styles.paragraph}>
              The Company lends money to its customers mainly through digital platforms and has various products to cater to the needs of different categories of customers.
            </p>
            <p className={styles.paragraph}>
              The interest rate of each product is decided from time to time, giving due consideration to the following factors:
            </p>

            <h4 className={styles.contentSubheading}>Cost of Capital</h4>
            <p className={styles.paragraph}>
              To run the business, the Company has been infused with equity share capital in huge proportions, and accordingly the cost of such equity share capital being infused shall be taken into consideration.
            </p>

            <h4 className={styles.contentSubheading}>Weighted Average Cost of Borrowing</h4>
            <p className={styles.paragraph}>
              Since the Company borrows funds from various banks, financial institutions and other external lender(s), the weighted average borrowing cost, as well as costs incidental to those borrowings like brokerage, consultancy fees, processing fees shall be taken into consideration. The cost of borrowings varies according to market conditions thus pricing of interest rates shall be consequently impacted and decided accordingly.
            </p>

            <h4 className={styles.contentSubheading}>Risk</h4>
            <p className={styles.paragraph}>
              Risk related to loss of credit due to short tenure of loan, nature of facility, ticket size of loan, geographical condition, customer segment, sourcing channels, stability in earnings and employment, financial position, past repayment track record with us or other lenders, external ratings of customers, credit reports, customer relationship, other existing indebtedness, results from digital verifications etc. Therefore, risk of recovery of loan shall be taken into consideration and accordingly the risk premium would be reckoned.
            </p>

            <h4 className={styles.contentSubheading}>Opex Cost</h4>
            <p className={styles.paragraph}>
              It includes employee expenses, office and infrastructure related fixed and variable costs, operations costs, sales and marketing expenses, etc.
            </p>

            <h4 className={styles.contentSubheading}>Profit Margin</h4>
            <p className={styles.paragraph}>
              Fair profit margin is added to arrive at the lending rate. The company may at its discretion fix different margins for different customers, considering the risk of default. All customers will however be notified of the interest payable for the loan to be availed from the company.
            </p>

            <p className={styles.paragraph}>
              The Board of Directors, in its meeting held on April 21, 2025, reviewed and approved the revised Interest Rate and Penal Charges Policy. The Board further resolved to update the interest rate structure, which shall now be applicable as follows:
            </p>

            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Pay Day Loan:</strong> 0.10% to 1.00% per day
              </li>
              <li className={styles.listItem}>
                <strong>Business Loan:</strong> 8% to 25% per annum
              </li>
              <li className={styles.listItem}>
                <strong>Loan Against Property (LAP):</strong> 12% to 15% per annum
              </li>
              <li className={styles.listItem}>
                <strong>EMI Loan:</strong> 24% to 365% per annum, with a maximum tenure of up to 6 months
              </li>
            </ul>
          </div>

          {/* 5. Processing Fees / Penal Charges / Other Charges */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>5. Processing Fees / Penal Charges / Other Charges</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Besides interest, other financial charges like processing fees, Equated Monthly Installment (EMI) bouncing charges, penal charges on late repayment of a loan or EMI, rescheduling charges, prepayment / foreclosure charges, part disbursement charges, charges for issue of statement accounts etc., would be levied by the company wherever considered necessary. Besides these charges, stamp duty, service tax / GST and other cess would be collected at applicable rates from time to time. Any revision in these charges would be implemented on a prospective basis with due communication to customers.
              </li>
              <li className={styles.listItem}>
                The board decided that the company will levied a EMI Bouncing charges of Rs. 580/-.
              </li>
              <li className={styles.listItem}>
                The Company shall ensure that no capitalisation of penal charges i.e., no further interest computed on such charges. The Company shall also not introduce any additional component to the rate of interest and ensure its strict compliance.
              </li>
              <li className={styles.listItem}>
                The Penal Charges will be levied at the rate of 0.1% per day of outstanding principal loan amount.
              </li>
              <li className={styles.listItem}>
                The Company shall ensure that the quantum of penal charges is reasonable and commensurate with the non-compliance of material terms and conditions of loan contract without being discriminatory within a particular loan / product category.
              </li>
              <li className={styles.listItem}>
                The Company shall display the quantum and reason for penal charges to the customers in the loan agreement and / Key Fact Statement (KFS) as applicable.
              </li>
              <li className={styles.listItem}>
                The applicable penal charges, as updated from time to time, shall be displayed on the Company&apos;s website.
              </li>
              <li className={styles.listItem}>
                The Company shall ensure that the applicable penal charges are clearly communicated to the borrowers, whenever reminders for non-compliance of loan terms are sent to borrowers.
              </li>
              <li className={styles.listItem}>
                Any instance of levy of penal charges and the reason therefore shall also be appropriately communicated to the borrowers.
              </li>
            </ul>
          </div>

          {/* 6. Communication to Customer */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>6. Communication to Customer</h3>
            <p className={styles.paragraph}>
              The Company shall communicate the effective rate of interest to customers at the time of sanction / availing of the loan through the acceptable mode of communication. Interest Rate Policy would be uploaded on the website of the company and any change therein would be uploaded on the website of the Company.
            </p>
            <p className={styles.paragraph}>
              Changes in the rates and charges for existing customers, if any, would be communicated to them through various modes of communication such as on the website, digital platform and/or via email, letters, SMS, etc. However, the company would ensure that there is no change during the tenure of the loan for such loans which had already been contracted with customers.
            </p>
          </div>

          {/* 7. Waiver / Reduction of Charges */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>7. Waiver / Reduction of Charges</h3>
            <p className={styles.paragraph}>
              Managing Director or Business Head Loan of the Company be authorized to waive-off / reduce any amount including Principal amount / Interest Rates, Processing and Other Charges, at their own discretion, as may deem fit. Further, aforesaid officials may delegate this authority in favor of any other person.
            </p>
          </div>

          {/* 8. Amendments to this Policy */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>8. Amendments to this Policy</h3>
            <p className={styles.paragraph}>
              The Board of directors is authorized to make appropriate changes to this Policy taking into account changes in the money market scenario in the Country which includes the upward / downward revision in interest rates applicable to various loan products and the relevant charges applicable for such loan products.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
