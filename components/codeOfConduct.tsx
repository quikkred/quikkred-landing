import React from "react";

const CodeOfConduct: React.FC = () => {
  return (
    <section className="w-full bg-white py-12 px-6 md:px-16 lg:px-28 text-gray-800 leading-relaxed">
      {/* INTRODUCTION */}
      <h2 className="text-2xl font-bold mb-4">INTRODUCTION</h2>
      <p className="mb-8">
        QuikKred adheres to the guidelines issued by the Reserve Bank of India
        (RBI) for Non-Banking Financial Companies (NBFCs). Our Fair Practices
        Code outlines the framework under which we provide loans with fairness
        and transparency for our customers. It represents our commitment to
        ethical lending practices where customer protection, satisfaction, and
        financial well-being remain the top priorities. We aim to maintain
        transparency, avoid hidden charges, ensure fair collection practices,
        and treat all borrowers fairly in all applications. We aim to maintain
        fair terms, avoid hidden charges, ensure fair collection practices, and
        treat all borrowers fairly. Upon commencement of the operations, we
        commit to a fair and transparent process. The Code of Practices can be
        made available to any customer upon request.
      </p>

      {/* KEY COMMITMENTS */}
      <h2 className="text-2xl font-bold mb-6">KEY COMMITMENTS</h2>

      {/* 1. Applications */}
      <h3 className="text-xl font-semibold mb-3">
        1. Applications for Loans and Their Processing
      </h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>
          Loan application forms will include all necessary information required
          for a borrower to understand the process, including a list of
          necessary documents.
        </li>
        <li>
          QuikKred will assist customers with complete information regarding
          fees, processing charges, and repayment terms before the loan
          application.
        </li>
        <li>
          After receiving a fully completed loan application, we will
          communicate the decision within a reasonable timeframe.
        </li>
        <li>
          Any changes in terms or conditions, including interest rates, will be
          shared immediately through appropriate communication channels.
        </li>
      </ul>

      {/* 2. Loan Appraisal */}
      <h3 className="text-xl font-semibold mb-3">
        2. Loan Appraisal and Terms/Conditions
      </h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>
          Loan approvals will be carried out based on QuikKred’s internal credit
          evaluation systems, risk parameters, and borrower repayment capacity.
        </li>
        <li>
          Once a loan is approved, the borrower will receive a formal sanction
          letter listing the loan amount, tenure, interest rate, EMI,
           Platform fees (if applicable), and other applicable terms.
        </li>
        <li>
          The signed sanction/sanction agreement copy will be shared with the
          borrower at the time of disbursement.
        </li>
        <li>
          Any security or collateral documents will be handled responsibly
          through the repayment of all dues.
        </li>
      </ul>

      {/* 3. Disbursement */}
      <h3 className="text-xl font-semibold mb-3">
        3. Disbursement of Loans Including Changes in Terms
      </h3>
      <ul className="list-disc pl-6 mb-10 space-y-2">
        <li>
          Loan disbursement will take place only after the borrower signs the
          agreement and meets the required conditions.
        </li>
        <li>
          Any change in charges, interest rate, or terms will be communicated
          clearly in advance.
        </li>
        <li>
          In case of defaults, QuikKred will follow fair and transparent
          recovery processes.
        </li>
      </ul>

      {/* PRIVACY */}
      <h2 className="text-2xl font-bold mb-4">PRIVACY & CONFIDENTIALITY</h2>
      <ul className="list-disc pl-6 mb-10 space-y-2">
        <li>
          Customer information will be kept strictly confidential unless
          disclosure is required by law or consented to by the customer.
        </li>
        <li>
          Information will not be shared with third parties without customer
          permission, except for regulatory or legal requirements.
        </li>
        <li>QuikKred will not engage in unethical sharing of customer data.</li>
      </ul>

      {/* GENERAL */}
      <h2 className="text-2xl font-bold mb-4">GENERAL</h2>
      <ul className="list-disc pl-6 mb-10 space-y-2">
        <li>
          QuikKred will not force a borrower into loans except for purposes
          permitted under the loan agreement.
        </li>
        <li>
          Any customer complaint will be acknowledged promptly and resolved
          within a reasonable time.
        </li>
        <li>
          A fair and efficient debt collection system will be followed without
          coercive methods during recovery.
        </li>
      </ul>

      {/* FURTHER ASSISTANCE */}
      <h2 className="text-2xl font-bold mb-4">FURTHER ASSISTANCE</h2>

      {/* Complaints */}
      <h3 className="text-xl font-semibold mb-3">Customer Complaints</h3>
      <p className="mb-4">
        Borrowers may register complaints through email, phone, or the app
        support system. All concerns will be evaluated and resolved within
        reasonable timelines.
      </p>

      {/* Grievance */}
      <h3 className="text-xl font-semibold mb-3">
        Grievance Redressal Mechanism
      </h3>
      <p className="mb-2">
        If a customer is dissatisfied with the resolution provided, the issue
        will be escalated to the Grievance Redressal Officer (GRO).
      </p>

      <ul className="list-none pl-0 mb-8">
        <li>Name: —</li>
        <li>Contact Number: —</li>
        <li>Email: —</li>
      </ul>

      <p className="mb-10">
        If the borrower is still unsatisfied, they may approach the RBI
        Ombudsman under the Integrated Ombudsman Scheme.
      </p>

      {/* Monitoring */}
      <h3 className="text-xl font-semibold mb-3">Monitoring</h3>
      <p className="mb-8">
        QuikKred holds a designated Compliance Officer to ensure adherence to
        the Fair Practices Code and other regulatory guidelines. Periodic
        reviews will be carried out to ensure full compliance and to improve
        customer service standards.
      </p>

      {/* Availability */}
      <h3 className="text-xl font-semibold mb-3">Availability of the Code</h3>
      <p>
        This Fair Practices Code will be available on the QuikKred website.
        Printed copies will be provided on request.
      </p>
    </section>
  );
};

export default CodeOfConduct;
