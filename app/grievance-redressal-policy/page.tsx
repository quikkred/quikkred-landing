'use client';

import Link from 'next/link';

export default function GrievanceRedressalPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="w-full bg-[#2BB89A] py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            Grievance Redressal Policy
          </h1>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-[900px]">

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-600 leading-relaxed">
              QuikkRed is committed to providing excellent customer service and resolving customer grievances in a timely and efficient manner. This Grievance Redressal Policy outlines the process for customers to escalate their concerns and the timelines within which they can expect resolution.
            </p>
          </section>

          {/* Level 1 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              LEVEL 1: Customer Service/Helpdesk
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              For any queries, complaints, or feedback, customers can reach out to our Customer Service team through the following channels:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Helpline No.:</strong> +91-88776-65544 &amp; +91-99887-76655
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Email Id:</strong> support@quikkred.com
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Timings:</strong> Monday to Saturday (10 am to 6 pm)
                </span>
              </li>
            </ul>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Our Customer Service team will acknowledge your complaint within 24 hours and endeavor to resolve it within 7 working days. If your complaint is not resolved within this timeframe or if you are not satisfied with the resolution, you may escalate to Level 2.
            </p>
          </section>

          {/* Level 2 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              LEVEL 2: Customer Relationship Manager (CRM)
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If your grievance is not resolved at Level 1 within 7 working days, or if you are dissatisfied with the resolution provided, you may escalate the matter to our Customer Relationship Manager:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Contact Name:</strong> Mr. Anuj Patel
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Email Id:</strong> support@quikkred.com
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Timings:</strong> Monday to Friday (11 am to 5 pm)
                </span>
              </li>
            </ul>
            <p className="text-gray-600 mt-4 leading-relaxed">
              The Customer Relationship Manager will review your complaint and provide a resolution within 7 working days of receiving the escalation. If your complaint remains unresolved or you are not satisfied, you may escalate to Level 3.
            </p>
          </section>

          {/* Level 3 */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              LEVEL 3: Grievance Redressal Officer (GRO) / Nodal Officer
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If your grievance remains unresolved after escalation to Level 2, or if you are not satisfied with the resolution provided, you may escalate the matter to our Grievance Redressal Officer (Nodal Officer):
            </p>
            <div className="bg-gradient-to-br from-[#2BB89A]/10 to-[#2BB89A]/5 border-l-4 border-[#2BB89A] rounded-lg p-6 mb-4">
              <ul className="space-y-3">
                <li className="text-gray-600">
                  <strong className="text-gray-700">Grievance Redressal Officer (Nodal Officer):</strong> Mr. Manish Soni
                </li>
                <li className="text-gray-600">
                  <strong className="text-gray-700">Address:</strong> QuikkRed, Head Office, Plot No. 420, Digital Lane, Sector-44, Gurugram – 122003
                </li>
                <li className="text-gray-600">
                  <strong className="text-gray-700">Contact No.:</strong> +91-98765-43210
                </li>
                <li className="text-gray-600">
                  <strong className="text-gray-700">Email Id:</strong> Manish@quikkred.com
                </li>
              </ul>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The Grievance Redressal Officer will review your complaint and provide a final resolution within 15 working days of receiving the escalation.
            </p>
          </section>

          {/* RBI Ombudsman */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Escalation to RBI Ombudsman
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If your complaint is not resolved within 30 days from the date of lodging, or if you are not satisfied with the final resolution provided by the Grievance Redressal Officer, you may approach the Reserve Bank of India (RBI) Ombudsman under the Integrated Ombudsman Scheme.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              You can file a complaint with the RBI Ombudsman through the following channels:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Online:</strong> https://cms.rbi.org.in
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Email:</strong> crpc@rbi.org.in
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Toll-Free Number:</strong> 14448
                </span>
              </li>
            </ul>
          </section>

          {/* Important Notes */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Important Notes
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  All complaints should include relevant details such as loan account number, contact information, and a clear description of the issue.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  A unique complaint reference number will be provided for tracking purposes.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  QuikkRed is committed to treating all complaints fairly and confidentially.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  This policy is subject to periodic review and may be updated as per regulatory requirements.
                </span>
              </li>
            </ul>
          </section>

        </div>
      </main>

    </div>
  );
}
