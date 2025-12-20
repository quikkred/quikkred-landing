'use client';

import Link from 'next/link';
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
              <div className={styles.detailsValue}>30th Dec 2025</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Last Review Date</div>
              <div className={styles.detailsValue}>21st Dec 2025</div>
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
              QuikkRed Financial Services Private Limited (&quot;QuikkRed&quot; or &quot;the Company&quot;) is a Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India (RBI). The Company is engaged in the business of providing personal loans and other credit facilities to eligible customers.
            </p>
            <p className={styles.paragraph}>
              This Interest Rate and Penal Charges Policy (&quot;Policy&quot;) has been formulated in accordance with the guidelines issued by the RBI, including the Master Direction – Reserve Bank of India (Non-Banking Financial Company – Scale Based Regulation) Directions, 2023, and subsequent circulars/guidelines issued from time to time.
            </p>
          </div>

          {/* 2. Objective */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>2. Objective</h3>
            <p className={styles.paragraph}>
              The objective of this Policy is to:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Establish a transparent and fair framework for determining interest rates on loans and credit facilities offered by the Company.
              </li>
              <li className={styles.listItem}>
                Define the processing fees, penal charges, and other charges applicable to various loan products.
              </li>
              <li className={styles.listItem}>
                Ensure compliance with regulatory requirements and guidelines issued by the RBI.
              </li>
              <li className={styles.listItem}>
                Provide clear communication to customers regarding applicable interest rates and charges.
              </li>
            </ul>
          </div>

          {/* 3. Role of Board of Directors */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>3. Role of Board of Directors</h3>
            <p className={styles.paragraph}>
              The Board of Directors of QuikkRed is responsible for:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Approving the Interest Rate and Penal Charges Policy.
              </li>
              <li className={styles.listItem}>
                Reviewing and updating the Policy periodically to ensure alignment with regulatory requirements and market conditions.
              </li>
              <li className={styles.listItem}>
                Ensuring that the interest rates and charges are determined in a fair, transparent, and non-discriminatory manner.
              </li>
              <li className={styles.listItem}>
                Overseeing the implementation of the Policy across all lending operations.
              </li>
            </ul>
          </div>

          {/* 4. Determination of Interest Rates */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>4. Determination of Interest Rates on Loans and Credit Facility</h3>
            <p className={styles.paragraph}>
              The interest rates on loans and credit facilities offered by QuikkRed are determined based on the following factors:
            </p>

            <h4 className={styles.contentSubheading}>4.1 Cost of Funds</h4>
            <p className={styles.paragraph}>
              The cost of borrowing funds from various sources including banks, financial institutions, and other lenders.
            </p>

            <h4 className={styles.contentSubheading}>4.2 Operating Costs</h4>
            <p className={styles.paragraph}>
              Administrative and operational expenses incurred in processing and servicing loans.
            </p>

            <h4 className={styles.contentSubheading}>4.3 Risk Premium</h4>
            <p className={styles.paragraph}>
              Assessment of credit risk based on the borrower&apos;s credit profile, repayment capacity, employment stability, and other relevant factors.
            </p>

            <h4 className={styles.contentSubheading}>4.4 Tenure of Loan</h4>
            <p className={styles.paragraph}>
              The duration for which the loan is sanctioned may influence the applicable interest rate.
            </p>

            <h4 className={styles.contentSubheading}>4.5 Market Conditions</h4>
            <p className={styles.paragraph}>
              Prevailing market interest rates and competitive landscape in the lending industry.
            </p>

            <h4 className={styles.contentSubheading}>4.6 Regulatory Guidelines</h4>
            <p className={styles.paragraph}>
              Compliance with interest rate caps and guidelines prescribed by the RBI.
            </p>

            <p className={styles.paragraph}>
              <strong>Interest Rate Range:</strong> The annualized interest rate on personal loans offered by QuikkRed ranges from 14% to 36% per annum, calculated on a reducing balance basis. The exact rate applicable to a borrower will depend on the individual risk assessment and loan parameters.
            </p>
          </div>

          {/* 5. Processing Fees / Penal Charges / Other Charges */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>5. Processing Fees / Penal Charges / Other Charges</h3>

            <h4 className={styles.contentSubheading}>5.1 Processing Fees</h4>
            <p className={styles.paragraph}>
              A processing fee of up to 5% of the loan amount (plus applicable GST) may be charged at the time of loan disbursement. The exact fee will be communicated to the borrower before loan sanction.
            </p>

            <h4 className={styles.contentSubheading}>5.2 Penal Charges</h4>
            <p className={styles.paragraph}>
              In accordance with RBI guidelines on penal charges dated August 18, 2023:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Penal charges shall be levied in the form of &quot;penal charges&quot; and not as &quot;penal interest&quot; added to the rate of interest.
              </li>
              <li className={styles.listItem}>
                Penal charges will not be capitalized i.e., no further interest will be computed on such charges.
              </li>
              <li className={styles.listItem}>
                The quantum of penal charges shall be reasonable and commensurate with the non-compliance of the borrower.
              </li>
              <li className={styles.listItem}>
                There shall be no discrimination in penal charges between loans of the same category.
              </li>
            </ul>

            <p className={styles.paragraph}>
              <strong>Applicable Penal Charges:</strong>
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type of Default</th>
                  <th>Penal Charges</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Delay in EMI payment (per instance)</td>
                  <td>Up to Rs. 500 + applicable GST</td>
                </tr>
                <tr>
                  <td>Cheque/ECS/NACH bounce</td>
                  <td>Up to Rs. 500 + applicable GST per instance</td>
                </tr>
                <tr>
                  <td>Non-submission of documents</td>
                  <td>Up to Rs. 500 + applicable GST</td>
                </tr>
              </tbody>
            </table>

            <h4 className={styles.contentSubheading}>5.3 Prepayment/Foreclosure Charges</h4>
            <p className={styles.paragraph}>
              For individual borrowers, no prepayment/foreclosure charges shall be levied on floating rate loans. For fixed rate loans, foreclosure charges of up to 4% of the outstanding principal may be applicable, as permitted under regulatory guidelines.
            </p>

            <h4 className={styles.contentSubheading}>5.4 Other Charges</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Charge Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stamp Duty</td>
                  <td>As per applicable State laws</td>
                </tr>
                <tr>
                  <td>Documentation Charges</td>
                  <td>Up to Rs. 500 + applicable GST</td>
                </tr>
                <tr>
                  <td>Duplicate Statement/NOC</td>
                  <td>Up to Rs. 200 + applicable GST per request</td>
                </tr>
                <tr>
                  <td>CIBIL/Credit Report Charges</td>
                  <td>At actuals</td>
                </tr>
                <tr>
                  <td>Legal/Incidental Charges</td>
                  <td>At actuals (if applicable)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. Communication to Customer */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>6. Communication to Customer</h3>
            <p className={styles.paragraph}>
              QuikkRed ensures transparent communication of all applicable interest rates and charges to customers through:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Clear disclosure in the loan application form and sanction letter.
              </li>
              <li className={styles.listItem}>
                Key Fact Statement (KFS) provided to borrowers before loan execution.
              </li>
              <li className={styles.listItem}>
                Display of interest rates and charges on the Company&apos;s website.
              </li>
              <li className={styles.listItem}>
                SMS/Email notifications for any changes in applicable rates or charges.
              </li>
              <li className={styles.listItem}>
                Annualized Percentage Rate (APR) disclosure to help borrowers understand the total cost of borrowing.
              </li>
            </ul>
            <p className={styles.paragraph}>
              The reasons for levy of penal charges shall be clearly communicated to the borrower at the time of levy.
            </p>
          </div>

          {/* 7. Waiver / Reduction of Charges */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>7. Waiver / Reduction of Charges</h3>
            <p className={styles.paragraph}>
              QuikkRed may consider waiver or reduction of penal charges and other fees on a case-by-case basis, taking into account:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                The borrower&apos;s overall repayment track record.
              </li>
              <li className={styles.listItem}>
                Genuine hardship faced by the borrower due to unforeseen circumstances.
              </li>
              <li className={styles.listItem}>
                First-time default or technical issues beyond the borrower&apos;s control.
              </li>
            </ul>
            <p className={styles.paragraph}>
              Any such waiver shall be approved by authorized personnel as per the Company&apos;s internal delegation of authority.
            </p>
          </div>

          {/* 8. Amendments to this Policy */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>8. Amendments to this Policy</h3>
            <p className={styles.paragraph}>
              This Policy shall be reviewed periodically and may be amended from time to time to ensure compliance with regulatory requirements and to reflect changes in business practices. Any amendments shall be approved by the Board of Directors and communicated through appropriate channels.
            </p>
            <p className={styles.paragraph}>
              The updated Policy shall be made available on the Company&apos;s website. In case of any conflict between this Policy and regulatory guidelines, the regulatory guidelines shall prevail.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
