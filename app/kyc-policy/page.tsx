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
          <p style={{ color: '#ffffff', marginTop: '16px', fontSize: '1.1rem' }}>
            Satsai Finance Pvt. Ltd.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '8px', fontSize: '0.95rem' }}>
            (This policy was reviewed and approved by the Board of Directors in the Board Meeting held on April 21, 2025.)
          </p>
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

          {/* 1. Preamble */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>1. Preamble</h3>
            <p className={styles.paragraph}>
              Satsai Finance Private Limited (&quot;RKBFL&quot; / &quot;the Company&quot;), being a Base Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India (RBI), engaged in the business of Payday Loans, EMI-based Loans, Loan Against Property (LAP) and other business loans, recognizes its responsibility to prevent misuse of its financial services for money laundering, terrorist financing and other unlawful activities.
            </p>
            <p className={styles.paragraph}>
              Accordingly, this Know Your Customer (KYC) and Anti-Money Laundering (AML) Policy is formulated in compliance with:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>RBI Master Direction – Know Your Customer (KYC) Directions, 2016 (as amended from time to time)</li>
              <li className={styles.listItem}>Prevention of Money Laundering Act, 2002 (PMLA)</li>
              <li className={styles.listItem}>PML (Maintenance of Records) Rules, 2005</li>
              <li className={styles.listItem}>RBI Guidelines for NBFCs (Base Layer)</li>
              <li className={styles.listItem}>FATF Recommendations</li>
            </ul>
            <p className={styles.paragraph}>
              This Policy lays down principles, systems, procedures and internal controls to ensure strong customer identification, risk mitigation, due diligence and monitoring.
            </p>
          </div>

          {/* 2. Objectives */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>2. Objectives</h3>
            <p className={styles.paragraph}>
              The objectives of this Policy are:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>To prevent the Company from being used knowingly or unknowingly for money laundering or terrorist financing activities.</li>
              <li className={styles.listItem}>To ensure the Company understands its customers, their financial behavior and associated risks.</li>
              <li className={styles.listItem}>To promote ethical conduct and transparency in business relationships.</li>
              <li className={styles.listItem}>To comply with legal and regulatory requirements under RBI and PMLA framework.</li>
              <li className={styles.listItem}>To define procedures for detection and reporting of suspicious activities.</li>
            </ul>
          </div>

          {/* 3. Applicability */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>3. Applicability</h3>
            <p className={styles.paragraph}>
              It may be noted that KYC – AML policy as stated in this document shall prevail over anything else contained in any other document / process/circular/letter/instruction of the Company in this regard (KYC-AML). This policy shall be applicable to all verticals/products of the Company whether existing or to be rolled out in future.
            </p>
          </div>

          {/* 4. Definitions */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>4. Definitions</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>&quot;Aadhaar number&quot;</strong> shall have the meaning assigned to it in clause (a) of section 2 of the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016 (18 of 2016)
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Authentication&quot;</strong>, in the context of Aadhaar authentication, means the process as defined under sub-section (c) of section 2 of the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016.
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Customer&quot;</strong> means a person who is engaged in a financial transaction or activity with the Company and includes a person on whose behalf the person who is engaged in the transaction or activity, is acting
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Act&quot; and &quot;Rules&quot;</strong> means the Prevention of Money-Laundering Act, 2002 and the Prevention of Money-Laundering (Maintenance of Records) Rules, 2005, respectively and amendments thereto.
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Customer Due Diligence (CDD)&quot;</strong> means identifying and verifying the customer and the beneficial owner
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Central KYC Records Registry&quot; (CKYCR)</strong> means an entity defined under Rule 2(1) (aa) of the Rules, to receive, store, safeguard and retrieve the KYC records in digital form of a customer
              </li>
              <li className={styles.listItem}>
                <strong>&quot;RamFincorp&quot;</strong> means mobile based applications, products of the Company, which provides instant personal loan to the approved end user customers of the Company
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Designated Director&quot;</strong> means a person designated by the Company to ensure overall compliance with the obligations imposed under Chapter IV of the Act and the Rules and shall include Managing Director or a whole-time director, duly authorized by the Board
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Digital KYC&quot;</strong> means the capturing live photo of the customer and officially valid document or the proof of possession of Aadhaar, where offline verification cannot be carried out, along with the latitude and longitude of the location where such live photo is being taken by an authorized officer of the RE as per the provisions contained in the Act.
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Digital Signature&quot;</strong> shall have the same meaning as assigned to it in clause (p) of subsection (1) of section (2) of the Information Technology Act, 2000 (21 of 2000).
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Equivalent e-document&quot;</strong> means an electronic equivalent of a document, issued by the issuing authority of such document with its valid digital signature including documents issued to the digital locker account of the customer as per rule 9 of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016.
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Know Your Client (KYC) Identifier&quot;</strong> means the unique number or code assigned to a customer by the Central KYC Records Registry.
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Officially Valid Document&quot; (OVD)</strong> means the passport, the driving license, proof of possession of Aadhaar card, the Voter&apos;s Identity Card issued by the Election Commission of India, job card issued by NREGA duly signed by an officer of the State Government and letter issued by the National Population Register containing details of name and address. Provided that, where the customer submits his proof of possession of Aadhaar as an OVD, he may submit it in such form as issued by the Unique Identification Authority of India.
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Principal Officer&quot;</strong> means an officer nominated by the Company, responsible for furnishing information as per rule 8 of the Rules
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Transaction&quot;</strong> means a purchase, sale, loan, pledge, gift, transfer, delivery or the arrangement thereof and includes:
                <ul className={styles.nestedList}>
                  <li className={styles.nestedListItem}>opening of an account;</li>
                  <li className={styles.nestedListItem}>deposit, withdrawal, exchange or transfer of funds in whatever currency, whether in cash or by cheque, payment order or other instruments or by electronic or other non-physical means;</li>
                  <li className={styles.nestedListItem}>the use of a safety deposit box or any other form of safe deposit;</li>
                  <li className={styles.nestedListItem}>entering into any fiduciary relationship;</li>
                  <li className={styles.nestedListItem}>any payment made or received, in whole or in part, for any contractual or other legal obligation; or</li>
                  <li className={styles.nestedListItem}>establishing or creating a legal person or legal arrangement</li>
                </ul>
              </li>
              <li className={styles.listItem}>
                <strong>&quot;Video based Customer Identification Process (V-CIP)&quot;</strong>: a method of customer identification by an official of the Company by undertaking seamless, secure, real-time, consent based audio-visual interaction with the customer to obtain identification information including the documents required for CDD purpose, and to ascertain the veracity of the information furnished by the customer. Such process shall be treated as face-to-face process for the purpose of this KYC Policy.
              </li>
            </ul>
          </div>

          {/* 5. Appointment of Principal Officer */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>5. Appointment of Principal Officer</h3>
            <p className={styles.paragraph}>
              Company shall designate an officer nominated by the Company as &apos;Principal Officer&apos; (PO) who shall be responsible for monitoring and reporting of all transactions and sharing of information as required under the Act. PO shall maintain close liaison with enforcement agencies, NBFCs and any other institution which are involved in the fight against money laundering and CFT. The name, designation &amp; address of the PO shall be communicated to FIU-IND and/or the department concerned of the RBI.
            </p>
          </div>

          {/* 6. Compliance Structure */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>6. Compliance Structure</h3>

            <h4 className={styles.contentSubheading}>a) Senior Management Responsibility</h4>
            <p className={styles.paragraph}>
              Senior Management including Directors, Presidents and Compliance Head shall be responsible for policy implementation and operational adherence.
            </p>

            <h4 className={styles.contentSubheading}>b) Training &amp; Awareness</h4>
            <p className={styles.paragraph}>
              Periodic AML/KYC training shall be conducted for employees appropriate to their roles.
            </p>
          </div>

          {/* 7. Key Elements of KYC Policy */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>7. Key Elements of KYC Policy</h3>
            <p className={styles.paragraph}>
              The KYC Policy consists of:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Customer Acceptance Policy (CAP)</li>
              <li className={styles.listItem}>Customer Identification Procedure (CIP)</li>
              <li className={styles.listItem}>Customer Due Diligence (CDD)</li>
              <li className={styles.listItem}>Ongoing Due Diligence</li>
              <li className={styles.listItem}>Monitoring of Transactions</li>
              <li className={styles.listItem}>Record Maintenance</li>
              <li className={styles.listItem}>Reporting Mechanism</li>
            </ul>
          </div>

          {/* 8. Customer Acceptance Policy */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>8. Customer Acceptance Policy</h3>
            <p className={styles.paragraph}>
              The Customer Acceptance Policy of the Company is aimed at ensuring that explicit guidelines are in place on the following aspects of customer relationship with the Company:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                No loan account will be opened and / or money will be disbursed in a name which is anonymous or fictitious/ benami name or appears to be borrowed.
              </li>
              <li className={styles.listItem}>
                Accept customer only after verifying their identity, as per CDD, and if the Company is unable to apply appropriate CDD measures, either due to non-cooperation of the customer or non-reliability of the documents/information furnished by the customer then no account will be opened.
              </li>
              <li className={styles.listItem}>
                No Transaction or account-based relationship is undertaken without following the CDD procedure.
              </li>
              <li className={styles.listItem}>
                The mandatory information to be sought for KYC purpose while opening an account and during the periodic updation, as specified.
              </li>
              <li className={styles.listItem}>
                Optional/ additional information is obtained with the explicit consent of the customer after the account is opened.
              </li>
              <li className={styles.listItem}>
                Circumstances, in which a customer is permitted to act on behalf of another person/entity, shall be clearly spelt out in conformity with the established law and practices, as there could be occasions when an account is operated by a mandate holder or where an account may be opened by intermediary in a fiduciary capacity.
              </li>
              <li className={styles.listItem}>
                Suitable system shall be put in place to ensure that the identity of the customer does not match with any person or entity, whose name appears in the sanctions lists circulated by Reserve Bank of India.
              </li>
            </ul>
            <p className={styles.paragraph}>
              Subject to the above-mentioned norms and caution, at the same time all the employees of Company will also ensure that the above norms and safeguards do not result in any kind of harassment or inconvenience to bona fide and genuine customers who should not feel discouraged while dealing with the Company.
            </p>
            <p className={styles.paragraph}>
              It is important to bear in mind that the adoption of Customer Acceptance Policy and its implementation should not become too restrictive and must not result in denial of the company&apos;s services to general public, especially to those, who are financially or socially disadvantaged.
            </p>
          </div>

          {/* 9. Customer Identification Procedure (CIP) */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>9. Customer Identification Procedure (CIP)</h3>
            <p className={styles.paragraph}>
              Customer identification means identifying and undertaking Customer Due Diligence (CDD) of the Customer and verifying his / her identity by using reliable, independent source documents, data or information. The Company needs to obtain enough information necessary to establish, to their satisfaction and as required by applicable law, the identity of each new customer, whether regular or occasional and the purpose of the intended nature of relationship.
            </p>
            <p className={styles.paragraph}>
              KYC verification may be conducted through:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Physical Verification</li>
              <li className={styles.listItem}>Video-Based KYC (V-CIP)</li>
              <li className={styles.listItem}>Digital KYC</li>
            </ul>
            <p className={styles.paragraph}>
              OVDs and PAN verification shall be mandatory.
            </p>
            <p className={styles.paragraph}>
              When the Company has a doubt about the authenticity or adequacy of the customer identification data obtained by the Company. Customer identification means identifying the customer and verifying his/ her/ its identity by using reliable, independent source documents, data or information.
            </p>
          </div>

          {/* 10. Customer Due Diligence (CDD) */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>10. Customer Due Diligence (CDD)</h3>
            <p className={styles.paragraph}>
              CDD involves:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Identity verification</li>
              <li className={styles.listItem}>Address proof</li>
              <li className={styles.listItem}>Beneficial owner identification</li>
              <li className={styles.listItem}>Source of funds verification</li>
              <li className={styles.listItem}>Purpose of relationship assessment</li>
            </ul>

            <h4 className={styles.contentSubheading}>Enhanced Due Diligence</h4>
            <p className={styles.paragraph}>
              Enhanced Due Diligence includes:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Higher monitoring frequency</li>
              <li className={styles.listItem}>Senior management approval</li>
            </ul>
          </div>

          {/* 11. Ongoing Due Diligence */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>11. Ongoing Due Diligence</h3>
            <p className={styles.paragraph}>
              Includes:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Periodic customer data updates</li>
              <li className={styles.listItem}>Review of account activity</li>
              <li className={styles.listItem}>Compliance checks</li>
              <li className={styles.listItem}>Monitoring of unusual patterns</li>
            </ul>
          </div>

          {/* 12. Transaction Monitoring */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>12. Transaction Monitoring</h3>
            <p className={styles.paragraph}>
              Ongoing monitoring is an essential element of effective KYC procedures. The officials have to effectively control and reduce the risk by having an understanding of the normal and reasonable activity of the customer so that they have the means of identifying transactions that fall outside the regular pattern of activity. However, the extent of monitoring will depend on the risk sensitivity of each account. Officials should pay special attention to all complex, unusually large transactions and all unusual patterns which have no apparent economic or visible lawful purpose.
            </p>
            <p className={styles.paragraph}>
              The Company may prescribe threshold limits for a particular category of accounts and pay particular attention to the transactions which exceed these limits. Transactions that involve large amounts of cash inconsistent with the normal and expected activity of the customer should particularly attract the attention of the officials. Very high account turnover inconsistent with the means of the customer may indicate that funds are being &apos;washed&apos; through/into the account. High-risk accounts have to be subjected to intensified monitoring. The Company should put in place a system of periodical review of risk categorization of accounts and apply enhanced due diligence measures wherever required.
            </p>
            <p className={styles.paragraph}>
              Suspicious transactions are flagged based on:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Unusual repayment behavior</li>
              <li className={styles.listItem}>Structuring transactions</li>
              <li className={styles.listItem}>Sudden loan closures by cash</li>
            </ul>
          </div>

          {/* 13. Reporting to Financial Intelligence Unit-India */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>13. Reporting to Financial Intelligence Unit-India</h3>
            <p className={styles.paragraph}>
              As required in Section 12 of the Act the company has to report information of transaction referred to in clause (a) of sub-section (1) of section 12 read with Rule 3 of the Rules relating to cash and suspicious transactions etc. to the Director, Financial Intelligence Unit-India (FIU-IND). The proviso to the said section also provides that where the principal officer has reason to believe that a single transaction or series of transactions integrally connected to each other have been valued below the prescribed value so as to defeat the provisions of this section, such officer shall furnish information in respect of such transactions to the director of FIU-IND within the prescribed time.
            </p>
            <p className={styles.paragraph}>
              The information has to be furnished at the following address by the Principal Officer:
            </p>
            <div className={styles.infoBox}>
              <p><strong>Director, FIU-IND,</strong></p>
              <p>Financial Intelligence Unit-India,</p>
              <p>6th Floor, Hotel Samrat, Chanakyapuri,</p>
              <p>New Delhi-110021.</p>
            </div>
            <p className={styles.paragraph}>
              A copy of information furnished shall be retained by the Principal Officer for the purposes of official record.
            </p>
            <p className={styles.paragraph}>
              The information in respect of the transactions referred to in clause(A), (B) and (BA) of sub-rule (1) of rule 3 of the PML Rules is to be submitted to the Director every month by the 15th day of the succeeding month.
            </p>
            <p className={styles.paragraph}>
              It has to be noted that in terms of Rule 8, while furnishing of information to the Director FIU-IND, delay of each day in not reporting a transaction or delay of each day in rectifying a misrepresented transaction beyond the time limit as specified in this rule shall constitute a separate violation. As advised by the FIU-IND, New Delhi the Company need not submit &apos;NIL&apos; reports in case there are no Cash/Suspicious Transactions, during a particular period.
            </p>
          </div>

          {/* 14. Record Management */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>14. Record Management</h3>
            <p className={styles.paragraph}>
              Records shall be retained for a minimum of 5 years after customer relationship termination.
            </p>
          </div>

          {/* 15. Reporting Obligations */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>15. Reporting Obligations</h3>
            <p className={styles.paragraph}>
              The Company shall report:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>STR (Suspicious Transaction Report)</li>
              <li className={styles.listItem}>CTR (Cash Transaction Report)</li>
              <li className={styles.listItem}>NTR (Non-Profit Organization Transaction Report)</li>
            </ul>
            <p className={styles.paragraph}>
              Reports shall be submitted through the Principal Officer to FIU-IND.
            </p>
          </div>

          {/* 16. Data Confidentiality */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>16. Data Confidentiality</h3>
            <p className={styles.paragraph}>
              Customer data shall be kept confidential and used only for lawful purposes.
            </p>
          </div>

          {/* 17. Money Laundering and Terrorist Financing Risk Assessment */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>17. Money Laundering and Terrorist Financing Risk Assessment</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                The Company shall carry out &apos;Money Laundering (ML) and Terrorist Financing (TF) Risk Assessment&apos; exercise, on annual basis, to identify, assess and take effective measures to mitigate its money laundering and terrorist financing risk as per RBI&apos;s guidelines.
              </li>
              <li className={styles.listItem}>
                The risk assessment should be properly documented.
              </li>
              <li className={styles.listItem}>
                The outcome of the exercise shall be put up to the Risk Management Committee, constituted by the Board of Directors to which power in this regard has been delegated, and should be available to competent authorities and self regulating bodies, if required.
              </li>
              <li className={styles.listItem}>
                The Company shall apply a Risk Based Approach (RBA) for mitigation and management of the identified risk and should have Board approved policies, controls and procedures in this regard.
              </li>
              <li className={styles.listItem}>
                The Company shall monitor the implementation of the controls and enhance them if necessary.
              </li>
            </ul>
          </div>

          {/* 18. Review & Amendment */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>18. Review &amp; Amendment</h3>
            <p className={styles.paragraph}>
              This Policy shall be reviewed annually or upon regulatory changes.
            </p>
          </div>

          {/* Board Approval */}
          <div className={styles.contentSection}>
            <h3 className={styles.contentHeading}>Board Approval</h3>
            <div className={styles.infoBox}>
              <p><strong>Approved by the Board of Directors of Satsai Finance Private Limited</strong></p>
              <p><span className={styles.infoLabel}>Approved Date:</span> 21.04.2025</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
