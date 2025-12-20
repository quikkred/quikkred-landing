'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function KYCPolicyPage() {
  return (
    <div>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>
            Know Your Customer (KYC) &amp;<br />Anti-Money Laundering (AML) Policy
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
              <div className={styles.detailsValue}>KYC &amp; AML Policy</div>
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
              <div className={styles.detailsValue}>30th Dec 2025</div>
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
              QuikkRed Financial Services Private Limited (&quot;QuikkRed&quot; or &quot;the Company&quot;) is a Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India (RBI). In compliance with the Prevention of Money Laundering Act, 2002 (PMLA), the Prevention of Money Laundering (Maintenance of Records) Rules, 2005, and the Master Direction - Know Your Customer (KYC) Direction, 2016 issued by the RBI, the Company has formulated this Know Your Customer (KYC) and Anti-Money Laundering (AML) Policy.
            </p>
            <p className={styles.paragraph}>
              This Policy aims to prevent the Company from being used, intentionally or unintentionally, by criminal elements for money laundering or terrorist financing activities. The Policy establishes guidelines for customer identification, verification, ongoing monitoring, and reporting of suspicious transactions.
            </p>
            <p className={styles.paragraph}>
              The Company is committed to adhering to the highest standards of compliance with KYC and AML regulations to protect itself and its customers from financial crimes.
            </p>
          </div>

          {/* 2. Key Elements of the Policy */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>2. Key Elements of the Policy</h3>
            <p className={styles.paragraph}>
              This KYC &amp; AML Policy comprises the following key elements:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Customer Acceptance Policy (CAP)</strong> – Establishes the criteria for accepting customers and defines the categories of customers who shall not be accepted.
              </li>
              <li className={styles.listItem}>
                <strong>Customer Identification Procedures (CIP)</strong> – Outlines the procedures for identifying and verifying the identity of customers using reliable and independent source documents, data, or information.
              </li>
              <li className={styles.listItem}>
                <strong>Monitoring of Transactions</strong> – Establishes procedures for ongoing monitoring of customer transactions to detect unusual or suspicious activities.
              </li>
              <li className={styles.listItem}>
                <strong>Risk Management</strong> – Provides a risk-based approach to categorize customers based on their risk profile and apply appropriate due diligence measures.
              </li>
            </ul>
          </div>

          {/* 3. Customer Acceptance Policy (CAP) */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>3. Customer Acceptance Policy (CAP)</h3>
            <p className={styles.paragraph}>
              The Company shall develop clear Customer Acceptance Policies and procedures to ensure that:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                No account is opened in anonymous or fictitious names.
              </li>
              <li className={styles.listItem}>
                Parameters of risk perception are clearly defined in terms of the nature of business activity, location of customer and his clients, mode of payments, volume of turnover, and social and financial status.
              </li>
              <li className={styles.listItem}>
                Documentation requirements and other information to be collected in respect of different categories of customers are specified.
              </li>
              <li className={styles.listItem}>
                Customers are not permitted to act on behalf of others without specific authorization.
              </li>
              <li className={styles.listItem}>
                Necessary checks are carried out before opening a new account to ensure that the identity of the customer does not match with any person having known criminal background or with banned entities such as individual terrorists or terrorist organizations.
              </li>
            </ul>
            <p className={styles.paragraph}>
              The Company shall not establish any business relationship with persons or entities whose identity cannot be established or who refuse to provide information about themselves or their business activities.
            </p>
          </div>

          {/* 4. Customer Identification Procedure (CIP) */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>4. Customer Identification Procedure (CIP)</h3>
            <p className={styles.paragraph}>
              Customer identification means identifying the customer and verifying his/her identity by using reliable, independent source documents, data, or information. The Company shall obtain sufficient information necessary to establish, to its satisfaction, the identity of each new customer.
            </p>

            <h4 className={styles.contentSubheading}>4.1 For Individuals</h4>
            <p className={styles.paragraph}>
              The following documents shall be obtained for identification and verification of individuals:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Proof of Identity (Any one of the following):</strong>
                <ul className={styles.nestedList}>
                  <li className={styles.nestedListItem}>Aadhaar Card issued by UIDAI</li>
                  <li className={styles.nestedListItem}>Passport</li>
                  <li className={styles.nestedListItem}>Voter&apos;s Identity Card</li>
                  <li className={styles.nestedListItem}>Driving License</li>
                  <li className={styles.nestedListItem}>PAN Card</li>
                  <li className={styles.nestedListItem}>NREGA Job Card</li>
                  <li className={styles.nestedListItem}>Letter issued by the National Population Register containing details of name and address</li>
                </ul>
              </li>
              <li className={styles.listItem}>
                <strong>Proof of Address (Any one of the following):</strong>
                <ul className={styles.nestedList}>
                  <li className={styles.nestedListItem}>Aadhaar Card issued by UIDAI</li>
                  <li className={styles.nestedListItem}>Passport</li>
                  <li className={styles.nestedListItem}>Voter&apos;s Identity Card</li>
                  <li className={styles.nestedListItem}>Driving License</li>
                  <li className={styles.nestedListItem}>Utility bills (not more than 2 months old)</li>
                  <li className={styles.nestedListItem}>Property or Municipal Tax receipt</li>
                  <li className={styles.nestedListItem}>Bank account or Post Office savings account statement</li>
                  <li className={styles.nestedListItem}>Pension or Family Pension Payment Order</li>
                </ul>
              </li>
              <li className={styles.listItem}>
                <strong>Recent Photograph</strong> of the customer
              </li>
              <li className={styles.listItem}>
                <strong>PAN Card</strong> (mandatory for transactions above Rs. 50,000 or as per regulatory requirements)
              </li>
            </ul>

            <h4 className={styles.contentSubheading}>4.2 For Non-Individuals (Companies, Partnership Firms, Trusts, etc.)</h4>
            <p className={styles.paragraph}>
              The following documents shall be obtained for identification and verification of non-individual customers:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Certificate of Incorporation/Registration
              </li>
              <li className={styles.listItem}>
                Memorandum and Articles of Association/Partnership Deed/Trust Deed
              </li>
              <li className={styles.listItem}>
                Board Resolution or Power of Attorney authorizing the person to transact on behalf of the entity
              </li>
              <li className={styles.listItem}>
                PAN Card of the entity
              </li>
              <li className={styles.listItem}>
                Proof of registered office address
              </li>
              <li className={styles.listItem}>
                KYC documents of authorized signatories and beneficial owners (individuals owning more than 25% of the shares or capital or profits)
              </li>
              <li className={styles.listItem}>
                List of Directors/Partners/Trustees with their addresses
              </li>
            </ul>
          </div>

          {/* 5. Monitoring of Transactions */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>5. Monitoring of Transactions</h3>
            <p className={styles.paragraph}>
              The Company shall establish ongoing due diligence and monitoring of transactions to ensure that:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Transactions are consistent with the Company&apos;s knowledge of the customer, their business, and risk profile.
              </li>
              <li className={styles.listItem}>
                The source of funds is identified for high-value transactions.
              </li>
              <li className={styles.listItem}>
                Complex or unusually large transactions, or unusual patterns of transactions, which have no apparent economic or visible lawful purpose, are scrutinized.
              </li>
              <li className={styles.listItem}>
                Background and purpose of such transactions are examined, and findings are recorded in writing.
              </li>
              <li className={styles.listItem}>
                Customer identification data is kept up-to-date by undertaking periodic reviews of existing records.
              </li>
            </ul>
            <p className={styles.paragraph}>
              The Company shall put in place appropriate software/systems for effective monitoring and detection of suspicious transactions. Transaction alerts shall be generated for transactions that deviate from the customer&apos;s normal pattern or exceed prescribed thresholds.
            </p>
          </div>

          {/* 6. Risk Management */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>6. Risk Management</h3>
            <p className={styles.paragraph}>
              The Company shall adopt a risk-based approach for customer due diligence. Customers shall be categorized into the following risk categories:
            </p>

            <h4 className={styles.contentSubheading}>6.1 Low Risk</h4>
            <p className={styles.paragraph}>
              Salaried employees, pensioners, individuals with regular source of income and stable employment history. Simplified Due Diligence (SDD) procedures may be applied.
            </p>

            <h4 className={styles.contentSubheading}>6.2 Medium Risk</h4>
            <p className={styles.paragraph}>
              Self-employed individuals, small business owners, and customers with moderate transaction volumes. Standard Due Diligence (CDD) procedures shall be applied.
            </p>

            <h4 className={styles.contentSubheading}>6.3 High Risk</h4>
            <p className={styles.paragraph}>
              Customers from high-risk categories including:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Politically Exposed Persons (PEPs)</li>
              <li className={styles.listItem}>Non-resident customers</li>
              <li className={styles.listItem}>High Net Worth Individuals (HNIs) with unclear source of funds</li>
              <li className={styles.listItem}>Customers from high-risk countries/jurisdictions</li>
              <li className={styles.listItem}>Cash-intensive businesses</li>
              <li className={styles.listItem}>Customers with adverse media coverage</li>
            </ul>
            <p className={styles.paragraph}>
              Enhanced Due Diligence (EDD) procedures shall be applied for high-risk customers, including additional documentation, senior management approval, and more frequent monitoring.
            </p>
          </div>

          {/* 7. Reporting of Suspicious Transactions */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>7. Reporting of Suspicious Transactions</h3>
            <p className={styles.paragraph}>
              The Company shall report the following transactions to the Financial Intelligence Unit-India (FIU-IND):
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Cash Transaction Reports (CTR):</strong> All cash transactions of Rs. 10 lakh and above (or equivalent in foreign currency), and all series of integrally connected cash transactions within a month which together exceed Rs. 10 lakh.
              </li>
              <li className={styles.listItem}>
                <strong>Suspicious Transaction Reports (STR):</strong> All suspicious transactions, whether or not made in cash, including attempted transactions that give reasonable ground for suspicion that the transaction may involve proceeds of crime or is related to money laundering or terrorist financing.
              </li>
              <li className={styles.listItem}>
                <strong>Non-Profit Organisation Transaction Reports (NTR):</strong> All transactions involving receipt of donations from foreign jurisdictions.
              </li>
              <li className={styles.listItem}>
                <strong>Counterfeit Currency Reports (CCR):</strong> All counterfeit currency notes detected.
              </li>
            </ul>
            <p className={styles.paragraph}>
              The reports shall be filed within the timelines prescribed by FIU-IND. The identity of the personnel involved in filing the reports shall be kept confidential.
            </p>
          </div>

          {/* 8. Duties of the Principal Officer */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>8. Duties of the Principal Officer</h3>
            <p className={styles.paragraph}>
              The Company has designated a Principal Officer who is responsible for:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Ensuring compliance with the provisions of PMLA and the rules and regulations framed thereunder.
              </li>
              <li className={styles.listItem}>
                Monitoring and reporting suspicious transactions to FIU-IND.
              </li>
              <li className={styles.listItem}>
                Maintaining all records and documents as required under the law.
              </li>
              <li className={styles.listItem}>
                Furnishing information to the Director (FIU-IND) and other authorities as required.
              </li>
              <li className={styles.listItem}>
                Ensuring that staff members are adequately trained on KYC/AML requirements.
              </li>
              <li className={styles.listItem}>
                Serving as the point of contact for all regulatory authorities regarding KYC/AML matters.
              </li>
            </ul>

            <div className={styles.infoBox}>
              <p><span className={styles.infoLabel}>Name:</span> Mr. Manish Soni</p>
              <p><span className={styles.infoLabel}>Designation:</span> Head of Compliance</p>
              <p><span className={styles.infoLabel}>Email:</span> Manish@quikkred.com</p>
              <p><span className={styles.infoLabel}>Contact Number:</span> +91-99887-76555</p>
            </div>
          </div>

          {/* 9. Training and Audit */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>9. Training and Audit</h3>
            <p className={styles.paragraph}>
              The Company shall ensure that:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Training:</strong> All employees, particularly those handling customer accounts, cash transactions, and new customer onboarding, shall be provided with adequate training on KYC/AML policies and procedures. Training shall be conducted periodically and updated to reflect changes in regulations.
              </li>
              <li className={styles.listItem}>
                <strong>Awareness:</strong> Employees shall be made aware of the legal consequences of non-compliance with KYC/AML requirements, including personal liability under PMLA.
              </li>
              <li className={styles.listItem}>
                <strong>Internal Audit:</strong> The internal audit function shall periodically review the implementation of KYC/AML policies and procedures. Audit findings shall be reported to the senior management and the Board.
              </li>
              <li className={styles.listItem}>
                <strong>Concurrent Audit:</strong> For high-risk transactions and customers, concurrent audit procedures shall be implemented to ensure real-time monitoring and compliance.
              </li>
              <li className={styles.listItem}>
                <strong>Record Keeping:</strong> All records related to customer identification, transactions, and suspicious activity reports shall be maintained for a minimum period of five years from the date of transaction or cessation of business relationship, whichever is later.
              </li>
            </ul>
            <p className={styles.paragraph}>
              This Policy shall be reviewed annually or as and when required due to changes in regulatory requirements, and any amendments shall be approved by the Board of Directors.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
