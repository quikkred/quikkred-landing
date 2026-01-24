'use client';

import { motion } from "framer-motion";
import {
  Lock, Shield, Database, UserCheck, Bell, Globe,
  AlertCircle, RefreshCw, Scale, Eye, Smartphone,
  FileText, Share2, Megaphone, Trash2, Users, Server, Baby, Edit3, CheckCircle
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from "@/components/layouts/PoliciesLayout";

// Function to highlight company names and CIN numbers
const highlightText = (text: string) => {
  if (!text) return text;

  // Patterns to highlight
  const patterns = [
    { regex: /(Fluxusforge Private Limited)/gi, className: "font-semibold text-[#25B181]" },
    { regex: /(Satsai Finlease Private Limited)/gi, className: "font-semibold text-[#4A66FF]" },
    { regex: /(CIN:\s*U\d+[A-Z]+\d+[A-Z]+\d+)/gi, className: "font-semibold bg-yellow-100 px-1 rounded" },
  ];

  let result: (string | JSX.Element)[] = [text];

  patterns.forEach(({ regex, className }) => {
    result = result.flatMap((part, partIndex) => {
      if (typeof part !== 'string') return part;

      const parts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      let match;

      const regexCopy = new RegExp(regex.source, regex.flags);
      while ((match = regexCopy.exec(part)) !== null) {
        if (match.index > lastIndex) {
          parts.push(part.slice(lastIndex, match.index));
        }
        parts.push(
          <span key={`${partIndex}-${match.index}`} className={className}>
            {match[0]}
          </span>
        );
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < part.length) {
        parts.push(part.slice(lastIndex));
      }

      return parts.length > 0 ? parts : [part];
    });
  });

  return result;
};

export default function PrivacyPage() {
  const { t } = useLanguage();

  const p = t?.policies?.privacy;
  const sections = p?.sections;

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
            <Lock className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              {p?.title || "Privacy Policy"}
            </h1>
            <p className="text-xl">{p?.subtitle || "Your privacy is our priority"}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <PoliciesLayout
        effectiveDateText={t?.policies?.common?.effectiveDate || "Effective Date"}
        effectiveDate={p?.effectiveDate}
      >
        {/* 1. Introduction - What/Who is Quikkred */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#25B181]" />
            {sections?.introduction?.title || "What/Who is Quikkred and How Does Quikkred Privacy Policy Work?"}
          </h2>

          {Array.isArray(sections?.introduction?.content) ? (
            sections.introduction.content.map((para: string, index: number) => (
              <p key={index} className="text-gray-600 mb-4">{highlightText(para)}</p>
            ))
          ) : (
            <p className="text-gray-600 mb-4">{highlightText(sections?.introduction?.content)}</p>
          )}

          {sections?.introduction?.partnerInfo && (
            <div className="bg-gradient-to-r from-[#25B181]/10 to-[#4A66FF]/10 border-l-4 border-[#25B181] rounded-lg p-5 mt-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-[#25B181]">Partner NBFC Details</h3>
              <div className="space-y-2">
                <p className="text-gray-800 font-semibold text-base">{sections.introduction.partnerInfo.name}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/60 rounded-md p-2">
                    <span className="text-gray-500 block text-xs">Website</span>
                    <span className="text-gray-700 font-medium">{sections.introduction.partnerInfo.website}</span>
                  </div>
                  <div className="bg-white/60 rounded-md p-2">
                    <span className="text-gray-500 block text-xs">CIN</span>
                    <span className="text-gray-800 font-semibold bg-yellow-100 px-1 rounded">{sections.introduction.partnerInfo.cin}</span>
                  </div>
                </div>
                <div className="bg-white/60 rounded-md p-2 text-sm">
                  <span className="text-gray-500 block text-xs">Registered Office</span>
                  <span className="text-gray-700 font-medium">{sections.introduction.partnerInfo.registeredOffice}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Personal Information */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-[#4A66FF]" />
            {sections?.personalInfo?.title || "What is Personal Information and What Types of Personal Information Do We Collect About You?"}
          </h2>

          <p className="text-gray-600 mb-4">{sections?.personalInfo?.definition}</p>
          <p className="text-gray-600 mb-4">{sections?.personalInfo?.sensitiveDefinition}</p>
          <p className="text-gray-600 mb-4">{sections?.personalInfo?.intro}</p>

          <h3 className="text-lg font-semibold mb-3">Categories of Personal Information:</h3>
          <div className="space-y-3">
            {sections?.personalInfo?.categories && Object.entries(sections.personalInfo.categories).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
            ))}
          </div>

          {sections?.personalInfo?.smsNote && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
              <p className="text-gray-700 text-sm">{sections.personalInfo.smsNote}</p>
            </div>
          )}

          {sections?.personalInfo?.phoneDataNote && (
            <p className="text-gray-600 mt-4 text-sm">{sections.personalInfo.phoneDataNote}</p>
          )}

          {sections?.personalInfo?.specialCategories && (
            <p className="text-gray-600 mt-4">{sections.personalInfo.specialCategories}</p>
          )}

          {sections?.personalInfo?.thirdPartyNote && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
              <p className="text-gray-700 text-sm">{sections.personalInfo.thirdPartyNote}</p>
            </div>
          )}
        </div>

        {/* 3. How Do We Collect */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25B181]" />
            {sections?.collection?.title || "How Do We Collect Your Personal Information?"}
          </h2>

          <p className="text-gray-600 mb-4">{sections?.collection?.intro}</p>

          {/* Direct Collection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{sections?.collection?.directCollection?.title}</h3>
            <p className="text-gray-600 mb-3">{sections?.collection?.directCollection?.intro}</p>
            <ul className="space-y-2 text-gray-600">
              {sections?.collection?.directCollection?.items?.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Third Party Collection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{sections?.collection?.thirdPartyCollection?.title}</h3>
            <p className="text-gray-600 mb-3">{sections?.collection?.thirdPartyCollection?.intro}</p>
            <ul className="space-y-2 text-gray-600">
              {sections?.collection?.thirdPartyCollection?.items?.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#25B181] mt-1">&#8226;</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Lawful Grounds */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#4A66FF]" />
            {sections?.lawfulGrounds?.title || "What Are the Lawful Grounds That We Rely on to Process Your Sensitive Personal Information?"}
          </h2>

          {Array.isArray(sections?.lawfulGrounds?.content) ? (
            sections.lawfulGrounds.content.map((para: string, index: number) => (
              <p key={index} className="text-gray-600 mb-4">{para}</p>
            ))
          ) : (
            <p className="text-gray-600 mb-4">{sections?.lawfulGrounds?.content}</p>
          )}
        </div>

        {/* 5. App Permissions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-[#25B181]" />
            {sections?.appPermissions?.title || "App Permissions and Data Collection"}
          </h2>

          <p className="text-gray-600 mb-4">{sections?.appPermissions?.intro}</p>

          {/* SMS Permissions */}
          {sections?.appPermissions?.permissions?.sms && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">{sections.appPermissions.permissions.sms.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{sections.appPermissions.permissions.sms.content}</p>
              {sections.appPermissions.permissions.sms.note && (
                <p className="text-gray-500 text-sm italic">{sections.appPermissions.permissions.sms.note}</p>
              )}
            </div>
          )}

          {/* Apps Permissions */}
          {sections?.appPermissions?.permissions?.apps && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">{sections.appPermissions.permissions.apps.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{sections.appPermissions.permissions.apps.content}</p>

              {sections.appPermissions.permissions.apps.usedFor && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">This data is used strictly for:</p>
                  <ul className="space-y-1">
                    {sections.appPermissions.permissions.apps.usedFor.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#25B181]">&#10003;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sections.appPermissions.permissions.apps.safeguards && (
                <div>
                  <p className="text-sm font-medium mb-1">Important safeguards:</p>
                  <ul className="space-y-1">
                    {sections.appPermissions.permissions.apps.safeguards.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#25B181]">&#8226;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Location Permissions */}
          {sections?.appPermissions?.permissions?.location && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">{sections.appPermissions.permissions.location.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{sections.appPermissions.permissions.location.content}</p>

              {sections.appPermissions.permissions.location.usedFor && (
                <ul className="space-y-1 mb-2">
                  {sections.appPermissions.permissions.location.usedFor.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#25B181]">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sections.appPermissions.permissions.location.note && (
                <p className="text-gray-500 text-sm italic">{sections.appPermissions.permissions.location.note}</p>
              )}
            </div>
          )}

          {/* Device Permissions */}
          {sections?.appPermissions?.permissions?.device && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">{sections.appPermissions.permissions.device.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{sections.appPermissions.permissions.device.content}</p>

              {sections.appPermissions.permissions.device.collectedData && (
                <ul className="space-y-1 mb-2">
                  {sections.appPermissions.permissions.device.collectedData.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#25B181]">&#8226;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sections.appPermissions.permissions.device.note && (
                <p className="text-gray-500 text-sm italic">{sections.appPermissions.permissions.device.note}</p>
              )}
            </div>
          )}

          {/* Phone State Permissions */}
          {sections?.appPermissions?.permissions?.phoneState && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">{sections.appPermissions.permissions.phoneState.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{sections.appPermissions.permissions.phoneState.content}</p>

              {sections.appPermissions.permissions.phoneState.usedFor && (
                <ul className="space-y-1 mb-2">
                  {sections.appPermissions.permissions.phoneState.usedFor.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#25B181]">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sections.appPermissions.permissions.phoneState.note && (
                <p className="text-gray-500 text-sm italic">{sections.appPermissions.permissions.phoneState.note}</p>
              )}
            </div>
          )}

          {/* Camera Permissions */}
          {sections?.appPermissions?.permissions?.camera && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">{sections.appPermissions.permissions.camera.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{sections.appPermissions.permissions.camera.content}</p>
              {sections.appPermissions.permissions.camera.usage && (
                <p className="text-gray-600 text-sm mb-2">{sections.appPermissions.permissions.camera.usage}</p>
              )}
              {sections.appPermissions.permissions.camera.note && (
                <p className="text-gray-500 text-sm italic">{sections.appPermissions.permissions.camera.note}</p>
              )}
            </div>
          )}

          {sections?.appPermissions?.hostingNote && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
              <p className="text-gray-700 text-sm">{sections.appPermissions.hostingNote}</p>
            </div>
          )}

          {sections?.appPermissions?.consentNote && (
            <p className="text-gray-600 mt-4 text-sm">{sections.appPermissions.consentNote}</p>
          )}
        </div>

        {/* 6. Purposes for Processing */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-[#4A66FF]" />
            {sections?.purposes?.title || "Purposes for Processing Your Personal Information"}
          </h2>

          <p className="text-gray-600 mb-4">{sections?.purposes?.intro}</p>

          <div className="space-y-4">
            {sections?.purposes?.items && Object.entries(sections.purposes.items).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Disclosure */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-[#25B181]" />
            {sections?.disclosure?.title || "When and to Whom Do We Disclose Your Personal Information?"}
          </h2>

          <p className="text-gray-600 mb-4">{sections?.disclosure?.intro}</p>

          <div className="space-y-3 mb-6">
            {sections?.disclosure?.scenarios && Object.entries(sections.disclosure.scenarios).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
            ))}
          </div>

          {sections?.disclosure?.externalThirdParties && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">{sections.disclosure.externalThirdParties.title}</h3>
              <p className="text-gray-600 mb-3">{sections.disclosure.externalThirdParties.intro}</p>
              <ul className="space-y-2">
                {sections.disclosure.externalThirdParties.items?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-[#25B181] mt-1">&#8226;</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sections?.disclosure?.contactNote && (
            <p className="text-gray-600 text-sm">{sections.disclosure.contactNote}</p>
          )}
        </div>

        {/* 8. Marketing */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#4A66FF]" />
            {sections?.marketing?.title || "Marketing"}
          </h2>

          {Array.isArray(sections?.marketing?.content) ? (
            sections.marketing.content.map((para: string, index: number) => (
              <p key={index} className="text-gray-600 mb-4">{para}</p>
            ))
          ) : (
            <p className="text-gray-600 mb-4">{sections?.marketing?.content}</p>
          )}
        </div>

        {/* 9. Data Retention and Deletion */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-[#25B181]" />
            {sections?.retention?.title || "Data Retention and Deletion"}
          </h2>

          {Array.isArray(sections?.retention?.content) ? (
            sections.retention.content.map((para: string, index: number) => (
              <p key={index} className="text-gray-600 mb-4">{para}</p>
            ))
          ) : (
            <p className="text-gray-600 mb-4">{sections?.retention?.content}</p>
          )}

          {sections?.retention?.grievanceOfficer && (
            <div className="bg-gradient-to-br from-[#25B181]/10 to-[#4A66FF]/10 rounded-lg p-6 my-6">
              <p className="font-semibold mb-2">{sections.retention.grievanceOfficer.title}</p>
              <p className="text-gray-600">
                {sections.retention.grievanceOfficer.name}<br />
                Mobile: {sections.retention.grievanceOfficer.mobile}<br />
                Email: {sections.retention.grievanceOfficer.email}
              </p>
            </div>
          )}

          {sections?.retention?.deletionSteps && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">{sections.retention.deletionSteps.title}</h3>
              <ol className="space-y-2">
                {sections.retention.deletionSteps.steps?.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="bg-[#25B181] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">{index + 1}</span>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
              {sections.retention.deletionSteps.moreInfo && (
                <p className="text-gray-600 text-sm mt-3">{sections.retention.deletionSteps.moreInfo}</p>
              )}
            </div>
          )}
        </div>

        {/* 10. Your Individual Rights */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#4A66FF]" />
            {sections?.rights?.title || "Your Individual Rights"}
          </h2>

          <p className="text-gray-600 mb-4">{sections?.rights?.intro}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {sections?.rights?.items && Object.entries(sections.rights.items).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
            ))}
          </div>

          {sections?.rights?.exerciseNote && (
            <p className="text-gray-600 mb-4 text-sm">{sections.rights.exerciseNote}</p>
          )}

          {sections?.rights?.deletionNote && (
            <p className="text-gray-600 mb-4 text-sm">{sections.rights.deletionNote}</p>
          )}

          {sections?.rights?.deletionRequest && (
            <p className="text-gray-600 mb-4 text-sm">{sections.rights.deletionRequest}</p>
          )}

          {sections?.rights?.withdrawConsent && (
            <p className="text-gray-600 text-sm">{sections.rights.withdrawConsent}</p>
          )}
        </div>

        {/* 11. Sharing and Transfer */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-[#25B181]" />
            {sections?.sharing?.title || "Sharing and Transfer of Information"}
          </h2>

          {Array.isArray(sections?.sharing?.content) ? (
            sections.sharing.content.map((para: string, index: number) => (
              <p key={index} className="text-gray-600 mb-4">{para}</p>
            ))
          ) : (
            <p className="text-gray-600 mb-4">{sections?.sharing?.content}</p>
          )}

          {sections?.sharing?.thirdPartiesLink && (
            <p className="text-gray-600 text-sm">{sections.sharing.thirdPartiesLink}</p>
          )}
        </div>

        {/* 12. Security */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Server className="w-6 h-6 text-[#4A66FF]" />
            {sections?.security?.title || "Security: How We Protect and Store Personal Information"}
          </h2>

          {Array.isArray(sections?.security?.content) ? (
            sections.security.content.map((para: string, index: number) => (
              <p key={index} className="text-gray-600 mb-4">{para}</p>
            ))
          ) : (
            <p className="text-gray-600 mb-4">{sections?.security?.content}</p>
          )}
        </div>

        {/* 13. Minors */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Baby className="w-6 h-6 text-[#25B181]" />
            {sections?.minors?.title || "Minors"}
          </h2>

          <p className="text-gray-600">{sections?.minors?.content}</p>
        </div>

        {/* 14. Changes */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-[#4A66FF]" />
            {sections?.changes?.title || "Changes to the Quikkred Privacy Statement and Your Duty to Inform Us of Changes"}
          </h2>

          {Array.isArray(sections?.changes?.content) ? (
            sections.changes.content.map((para: string, index: number) => (
              <p key={index} className="text-gray-600 mb-4">{para}</p>
            ))
          ) : (
            <p className="text-gray-600 mb-4">{sections?.changes?.content}</p>
          )}
        </div>

        {/* 15. Consent */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#25B181]" />
            {sections?.consent?.title || "Consent"}
          </h2>

          <p className="text-gray-600">{sections?.consent?.content}</p>
        </div>

        {/* Last Updated */}
        <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t">
          <p>{t?.policies?.common?.lastUpdated || "Last Updated"}: {p?.lastUpdatedDate || "March 17, 2025"}</p>
        </div>
      </PoliciesLayout>
    </div>
  );
}
