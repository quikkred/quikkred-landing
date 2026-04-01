'use client';

import { motion } from "framer-motion";
import { Shield, Lock, Key, Wifi, Server, AlertTriangle, Users, FileCheck, RefreshCw, Mail } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

export default function ITSecurityPolicyPage() {
  const { t } = useLanguage();

  const isp = t?.policies?.itSecurity;
  const i = t?.policies?.itSecurity?.sections[0].introduction;
  const sm = t?.policies?.itSecurity?.sections[1].securityManagement;

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
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              {isp?.title || "IT and Information Security Policy"}
            </h1>
            <p className="text-xl">{isp?.subtitle || "Protecting Your Data and Our Systems"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout
        effectiveDateText={isp?.versionInfo?.effectiveDateLabel || "Effective Date"}
        effectiveDate={isp?.versionInfo?.effectiveDate || "January 1, 2026"}
      >
        {/* Version Info */}
        {/* <div className="mb-10 bg-gray-50 rounded-lg p-6">
          <p className="text-[#2b2b2b] leading-[1.7] text-center">
            <span className="font-semibold">{isp?.versionInfo?.version || "Version 1.0"}</span> | {isp?.versionInfo?.effectiveDateLabel || "Effective Date"}: {isp?.versionInfo?.effectiveDate || "January 1, 2026"} | {isp?.versionInfo?.reviewFrequencyLabel || "Review Frequency"}: {isp?.versionInfo?.reviewFrequency || "Annually"}
          </p>
        </div> */}

        {/* 1. Introduction and Scope */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#25B181]" />
            {i.title || "1. Introduction and Scope"}
          </h2>
          <p className="text-[#2b2b2b] leading-[1.7] mb-4">
            {i.content || "This policy sets out the rules and guidelines for the secure and appropriate use of QuikkRed's Information Technology (IT) resources. It applies to all employees, contractors, vendors, and any third parties who have access to QuikkRed's IT infrastructure, systems, applications, and data."}
          </p>
          <p className="text-[#2b2b2b] leading-[1.7]">
            <strong>{i.objectiveLabel || "Objective"}</strong> {i.objective || "To protect QuikkRed's sensitive data, systems, and assets from unauthorized access, misuse, disclosure, disruption, modification, or destruction, while ensuring compliance with applicable laws and regulatory requirements including RBI guidelines for NBFCs."}
          </p>
        </div>

        {/* 2. Information Security Management */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#25B181]" />
            {sm[0]?.title || "2. Information Security Management"}
          </h2>

          {/* 2.1 Data Classification */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{sm[0]?.dataClassification.title || "2.1 Data Classification"}</h3>
            <p className="text-[#2b2b2b] leading-[1.7] mb-3">
              {sm[0]?.dataClassification.intro || "All data handled by QuikkRed shall be classified into the following categories:"}
            </p>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(sm[0]?.dataClassification.items || [
                { label: "Confidential", description: "Highly sensitive financial, customer (KYC, transactional), or proprietary business data. Access restricted to authorized personnel only." },
                { label: "Internal", description: "Operational data, non-public communications, internal policies, and procedures. Accessible to employees on a need-to-know basis." },
                { label: "Public", description: "Information intended for general release, such as marketing materials, press releases, and publicly available policies." }
              ]).map((item: { label: string; description: string }, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span><strong>{item.label}:</strong> {item.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2.2 Access Control */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.securityManagement?.accessControl?.title || "2.2 Access Control"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.securityManagement?.accessControl?.items || [
                { label: "Principle of Least Privilege", description: "Users shall be granted the minimum level of access necessary to perform their job functions." },
                { label: "User Authentication", description: "All users must authenticate using unique credentials before accessing company systems." },
                { label: "Strong Passwords", description: "Passwords must be at least 12 characters long, contain a mix of uppercase, lowercase, numbers, and special characters, and be changed every 90 days." },
                { label: "Multi-Factor Authentication (MFA)", description: "MFA is mandatory for accessing critical systems, remote access, and administrative functions." }
              ]).map((item: { label: string; description: string }, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span><strong>{item.label}:</strong> {item.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2.3 Encryption */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.securityManagement?.encryption?.title || "2.3 Encryption"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.securityManagement?.encryption?.items || [
                "All confidential customer data must be encrypted both in transit (using TLS 1.2 or higher) and at rest (using AES-256 encryption).",
                "Laptop hard drives storing confidential data must use full-disk encryption.",
                "Encryption keys must be stored securely and managed through a centralized key management system."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Acceptable Use Policy */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Key className="w-6 h-6 text-[#25B181]" />
            {/* {sm?.[3].title || "3. Acceptable Use Policy (AUP)"} */}
          </h2>

          {/* 3.1 General Usage */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.acceptableUse?.generalUsage?.title || "3.1 General Usage"}</h3>
            <p className="text-[#2b2b2b] leading-[1.7] mb-3">
              {isp?.sections?.acceptableUse?.generalUsage?.intro || "Company IT resources are provided primarily for business purposes. Limited personal use is permitted provided it does not:"}
            </p>
            <ul className="space-y-2 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.acceptableUse?.generalUsage?.items || [
                "Interfere with work performance or productivity",
                "Consume excessive network bandwidth",
                "Violate any company policies or applicable laws",
                "Compromise system security or integrity"
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3.2 Software and Licensing */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.acceptableUse?.software?.title || "3.2 Software and Licensing"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.acceptableUse?.software?.items || [
                "Only licensed and authorized software approved by the IT Department may be installed on company devices.",
                "Users are prohibited from downloading, installing, or using pirated, unlicensed, or unauthorized software.",
                "All software must be kept updated with the latest security patches."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3.3 Email and Internet */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.acceptableUse?.emailInternet?.title || "3.3 Email and Internet"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.acceptableUse?.emailInternet?.items || [
                "Company email is for professional use. Users must not use company email for personal business, chain letters, or spam.",
                "Users must exercise caution when opening email attachments or clicking links from unknown sources to prevent phishing and malware attacks.",
                "Access to inappropriate, offensive, or non-work-related websites is prohibited."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Remote Access and MDM */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Wifi className="w-6 h-6 text-[#25B181]" />
            {isp?.sections?.remoteAccess?.title || "4. Remote Access and Mobile Device Management (MDM)"}
          </h2>

          {/* 4.1 Remote Access (VPN) */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.remoteAccess?.vpn?.title || "4.1 Remote Access (VPN)"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.remoteAccess?.vpn?.items || [
                "All remote access to QuikkRed's internal network must be conducted via a secure Virtual Private Network (VPN) connection.",
                "VPN access requires multi-factor authentication and is subject to logging and monitoring.",
                "Users must ensure their home networks are secure and not use public Wi-Fi for accessing sensitive company data."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4.2 BYOD */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.remoteAccess?.byod?.title || "4.2 Bring Your Own Device (BYOD)"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.remoteAccess?.byod?.items || [
                "Personal devices used for work purposes must be registered with and governed by the Mobile Device Management (MDM) solution.",
                "BYOD devices must have up-to-date antivirus software, screen lock enabled, and encryption activated.",
                "QuikkRed reserves the right to remotely wipe company data from personal devices in case of loss, theft, or employment termination."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. Incident Management and Disaster Recovery */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#25B181]" />
            {isp?.sections?.incidentManagement?.title || "5. Incident Management and Disaster Recovery"}
          </h2>

          {/* 5.1 Security Incident Response */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.incidentManagement?.response?.title || "5.1 Security Incident Response"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.incidentManagement?.response?.items || [
                "All security incidents must be reported immediately to the IT Security team and formally documented.",
                "The Incident Response Team will investigate, contain, eradicate, and recover from security incidents following established procedures.",
                "Post-incident reviews will be conducted to identify root causes and implement preventive measures."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5.2 Data Backup */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.incidentManagement?.backup?.title || "5.2 Data Backup"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.incidentManagement?.backup?.items || [
                "Critical business data must be backed up daily to secure, off-site locations.",
                "Backup integrity must be verified regularly through restoration tests.",
                "Backup data must be encrypted and access-controlled."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5.3 Disaster Recovery */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 text-[#2b2b2b]">{isp?.sections?.incidentManagement?.disasterRecovery?.title || "5.3 Disaster Recovery (DR)"}</h3>
            <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
              {(isp?.sections?.incidentManagement?.disasterRecovery?.items || [
                "A comprehensive Disaster Recovery Plan (DRP) shall be maintained and documented.",
                "The Disaster Recovery Plan must be tested at least once every six months through tabletop exercises or full-scale drills.",
                "Recovery Time Objective (RTO) and Recovery Point Objective (RPO) shall be defined for critical systems."
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Roles and Responsibilities */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#25B181]" />
            {isp?.sections?.roles?.title || "6. Roles and Responsibilities"}
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1a936f] to-[#25B181]">
                  <th className="text-left text-white font-semibold py-4 px-6">{isp?.sections?.roles?.table?.roleHeader || "Role"}</th>
                  <th className="text-left text-white font-semibold py-4 px-6">{isp?.sections?.roles?.table?.responsibilitiesHeader || "Responsibilities"}</th>
                </tr>
              </thead>
              <tbody>
                {(isp?.sections?.roles?.table?.rows || [
                  { role: "All Users", responsibilities: "Comply with this policy and all related security procedures. Report any security incidents or suspicious activities immediately. Protect credentials and not share passwords. Complete mandatory security awareness training." },
                  { role: "IT Department", responsibilities: "Implement and maintain technical security controls. Manage user access and authentication systems. Monitor systems for security threats. Conduct regular security assessments and vulnerability scans. Maintain and test backup and disaster recovery systems." },
                  { role: "Chief Information Security Officer (CISO)", responsibilities: "Develop and maintain information security policies and procedures. Oversee the implementation of security controls across the organization. Report to the Board on security posture and incidents. Ensure compliance with regulatory requirements. Lead security incident response and investigations." }
                ]).map((row: { role: string; responsibilities: string }, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-4 px-6 text-gray-700 font-medium align-top">{row.role}</td>
                    <td className="py-4 px-6 text-gray-600">{row.responsibilities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CISO Contact */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
            <p className="text-[#2b2b2b] mb-2">
              <strong>{isp?.sections?.roles?.ciso?.label || "Chief Information Security Officer (CISO)"}:</strong> {isp?.sections?.roles?.ciso?.name || "Mr. Rohan Verma"}
            </p>
            <p className="text-[#2b2b2b] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#25B181]" />
              <strong>{isp?.sections?.roles?.ciso?.emailLabel || "Contact Email"}:</strong> {isp?.sections?.roles?.ciso?.email || "ciso@quikkred.com"}
            </p>
          </div>
        </div>

        {/* 7. Policy Review and Compliance */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#25B181]" />
            {isp?.sections?.compliance?.title || "7. Policy Review and Compliance"}
          </h2>
          <ul className="space-y-3 text-[#2b2b2b] leading-[1.7]">
            {(isp?.sections?.compliance?.items || [
              "This policy shall be reviewed annually or whenever there are significant changes to the IT environment, regulatory requirements, or business operations.",
              "Violations of this policy may result in disciplinary action, up to and including termination of employment.",
              "All employees must acknowledge receipt and understanding of this policy upon joining and annually thereafter."
            ]).map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#25B181] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </PoliciesLayout>
    </div>
  );
}
