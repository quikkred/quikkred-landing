'use client';

import Link from 'next/link';

export default function ITSecurityPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="w-full bg-[#2bb99f] min-h-[260px] flex items-center justify-center py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            IT and Information Security Policy
          </h1>
        </div>
      </header>

      {/* Content Section */}
      <main className="flex-grow bg-white py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-5xl">

          {/* Version Info */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <p className="text-gray-600 text-center md:text-left">
              <span className="font-semibold">Version 1.0</span> | Effective Date: January 1, 2026 | Review Frequency: Annually
            </p>
          </div>

          {/* 1. Introduction and Scope */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              1. Introduction and Scope
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This policy sets out the rules and guidelines for the secure and appropriate use of QuikkRed&apos;s Information Technology (IT) resources. It applies to all employees, contractors, vendors, and any third parties who have access to QuikkRed&apos;s IT infrastructure, systems, applications, and data.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-gray-700">Objective:</strong> To protect QuikkRed&apos;s sensitive data, systems, and assets from unauthorized access, misuse, disclosure, disruption, modification, or destruction, while ensuring compliance with applicable laws and regulatory requirements including RBI guidelines for NBFCs.
            </p>
          </section>

          {/* 2. Information Security Management */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              2. Information Security Management
            </h2>

            {/* 2.1 Data Classification */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">2.1 Data Classification</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                All data handled by QuikkRed shall be classified into the following categories:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    <strong className="text-gray-700">Confidential:</strong> Highly sensitive financial, customer (KYC, transactional), or proprietary business data. Access restricted to authorized personnel only.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    <strong className="text-gray-700">Internal:</strong> Operational data, non-public communications, internal policies, and procedures. Accessible to employees on a need-to-know basis.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    <strong className="text-gray-700">Public:</strong> Information intended for general release, such as marketing materials, press releases, and publicly available policies.
                  </span>
                </li>
              </ul>
            </div>

            {/* 2.2 Access Control */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">2.2 Access Control</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    <strong className="text-gray-700">Principle of Least Privilege:</strong> Users shall be granted the minimum level of access necessary to perform their job functions.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    <strong className="text-gray-700">User Authentication:</strong> All users must authenticate using unique credentials before accessing company systems.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    <strong className="text-gray-700">Strong Passwords:</strong> Passwords must be at least 12 characters long, contain a mix of uppercase, lowercase, numbers, and special characters, and be changed every 90 days.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    <strong className="text-gray-700">Multi-Factor Authentication (MFA):</strong> MFA is mandatory for accessing critical systems, remote access, and administrative functions.
                  </span>
                </li>
              </ul>
            </div>

            {/* 2.3 Encryption */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">2.3 Encryption</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    All confidential customer data must be encrypted both in transit (using TLS 1.2 or higher) and at rest (using AES-256 encryption).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Laptop hard drives storing confidential data must use full-disk encryption.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Encryption keys must be stored securely and managed through a centralized key management system.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Acceptable Use Policy (AUP) */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              3. Acceptable Use Policy (AUP)
            </h2>

            {/* 3.1 General Usage */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">3.1 General Usage</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Company IT resources are provided primarily for business purposes. Limited personal use is permitted provided it does not:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Interfere with work performance or productivity</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Consume excessive network bandwidth</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Violate any company policies or applicable laws</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Compromise system security or integrity</span>
                </li>
              </ul>
            </div>

            {/* 3.2 Software and Licensing */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">3.2 Software and Licensing</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Only licensed and authorized software approved by the IT Department may be installed on company devices.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Users are prohibited from downloading, installing, or using pirated, unlicensed, or unauthorized software.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    All software must be kept updated with the latest security patches.
                  </span>
                </li>
              </ul>
            </div>

            {/* 3.3 Email and Internet */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">3.3 Email and Internet</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Company email is for professional use. Users must not use company email for personal business, chain letters, or spam.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Users must exercise caution when opening email attachments or clicking links from unknown sources to prevent phishing and malware attacks.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Access to inappropriate, offensive, or non-work-related websites is prohibited.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Remote Access and Mobile Device Management (MDM) */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              4. Remote Access and Mobile Device Management (MDM)
            </h2>

            {/* 4.1 Remote Access (VPN) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">4.1 Remote Access (VPN)</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    All remote access to QuikkRed&apos;s internal network must be conducted via a secure Virtual Private Network (VPN) connection.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    VPN access requires multi-factor authentication and is subject to logging and monitoring.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Users must ensure their home networks are secure and not use public Wi-Fi for accessing sensitive company data.
                  </span>
                </li>
              </ul>
            </div>

            {/* 4.2 Bring Your Own Device (BYOD) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">4.2 Bring Your Own Device (BYOD)</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Personal devices used for work purposes must be registered with and governed by the Mobile Device Management (MDM) solution.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    BYOD devices must have up-to-date antivirus software, screen lock enabled, and encryption activated.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    QuikkRed reserves the right to remotely wipe company data from personal devices in case of loss, theft, or employment termination.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Incident Management and Disaster Recovery */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              5. Incident Management and Disaster Recovery
            </h2>

            {/* 5.1 Security Incident Response */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">5.1 Security Incident Response</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    All security incidents must be reported immediately to the IT Security team and formally documented.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    The Incident Response Team will investigate, contain, eradicate, and recover from security incidents following established procedures.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Post-incident reviews will be conducted to identify root causes and implement preventive measures.
                  </span>
                </li>
              </ul>
            </div>

            {/* 5.2 Data Backup */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">5.2 Data Backup</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Critical business data must be backed up daily to secure, off-site locations.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Backup integrity must be verified regularly through restoration tests.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Backup data must be encrypted and access-controlled.
                  </span>
                </li>
              </ul>
            </div>

            {/* 5.3 Disaster Recovery (DR) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">5.3 Disaster Recovery (DR)</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    A comprehensive Disaster Recovery Plan (DRP) shall be maintained and documented.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    The Disaster Recovery Plan must be tested at least once every six months through tabletop exercises or full-scale drills.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">
                    Recovery Time Objective (RTO) and Recovery Point Objective (RPO) shall be defined for critical systems.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Roles and Responsibilities */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              6. Roles and Responsibilities
            </h2>

            {/* Roles Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-[#2bb99f] text-white">
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Responsibilities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4 text-gray-700 font-medium align-top">All Users</td>
                    <td className="px-6 py-4 text-gray-600">
                      Comply with this policy and all related security procedures. Report any security incidents or suspicious activities immediately. Protect credentials and not share passwords. Complete mandatory security awareness training.
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="px-6 py-4 text-gray-700 font-medium align-top">IT Department</td>
                    <td className="px-6 py-4 text-gray-600">
                      Implement and maintain technical security controls. Manage user access and authentication systems. Monitor systems for security threats. Conduct regular security assessments and vulnerability scans. Maintain and test backup and disaster recovery systems.
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-gray-700 font-medium align-top">Chief Information Security Officer (CISO)</td>
                    <td className="px-6 py-4 text-gray-600">
                      Develop and maintain information security policies and procedures. Oversee the implementation of security controls across the organization. Report to the Board on security posture and incidents. Ensure compliance with regulatory requirements. Lead security incident response and investigations.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CISO Contact Info */}
            <div className="bg-gradient-to-br from-[#2bb99f]/10 to-[#2bb99f]/5 border-l-4 border-[#2bb99f] rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Chief Information Security Officer (CISO):</strong> Mr. Rohan Verma
              </p>
              <p className="text-gray-600">
                <strong>Contact Email:</strong> ciso@quikkred.com
              </p>
            </div>
          </section>

          {/* 7. Policy Review and Compliance */}
          <section className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              7. Policy Review and Compliance
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  This policy shall be reviewed annually or whenever there are significant changes to the IT environment, regulatory requirements, or business operations.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  Violations of this policy may result in disciplinary action, up to and including termination of employment.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2bb99f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  All employees must acknowledge receipt and understanding of this policy upon joining and annually thereafter.
                </span>
              </li>
            </ul>
          </section>

        </div>
      </main>

    </div>
  );
}
