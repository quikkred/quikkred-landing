'use client';

import Link from 'next/link';
import { useLanguage } from "@/lib/contexts/LanguageContext";
import PoliciesLayout from '@/components/layouts/PoliciesLayout';

export default function CookiePolicyPage() {
  const { t } = useLanguage();

  const c = t?.policies?.cookie;
  const sections = c?.sections;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="w-full bg-[#2BB89A] py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            {c?.title || "Cookie Policy"}
          </h1>
        </div>
      </header>

      {/* Main Content Section */}
      <PoliciesLayout
        effectiveDateText={t?.policies?.common?.effectiveDate || "Effective Date"}
        effectiveDate={c?.effectiveDate || "January 1, 2026"}
      >
        {/* Introduction */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.introduction?.title || "Introduction"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {sections?.introduction?.content1 || "Quikkred is a digital lending platform operated by Fluxusforge Private Limited (Loan Service Provider). Throughout this Cookie Policy, \"Quikkred\", \"we\", \"us\", or \"our\" refers to Fluxusforge Private Limited. We use cookies and similar tracking technologies on our website and mobile application. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use."}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {sections?.introduction?.content2 || "By continuing to use our website, you consent to the use of cookies in accordance with this Cookie Policy."}
          </p>
        </div>

        {/* What Are Cookies */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.whatAreCookies?.title || "What Are Cookies?"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {sections?.whatAreCookies?.content1 || "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site."}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {sections?.whatAreCookies?.content2 || "Cookies help us recognize your device and remember information about your visit, such as your preferences and settings. This helps us improve your experience on our website."}
          </p>
        </div>

        {/* Types of Cookies We Use */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.types?.title || "Types of Cookies We Use"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {sections?.types?.intro || "We use the following types of cookies on our website:"}
          </p>

          {/* Essential Cookies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {sections?.types?.essential?.title || "1. Essential Cookies"}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-2">
              {sections?.types?.essential?.content || "These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies."}
            </p>
            <ul className="space-y-2 ml-4">
              {(sections?.types?.essential?.items || [
                "Session management and authentication",
                "Security and fraud prevention",
                "Load balancing and website performance"
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Functional Cookies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {sections?.types?.functional?.title || "2. Functional Cookies"}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-2">
              {sections?.types?.functional?.content || "These cookies allow us to remember choices you make and provide enhanced, personalized features."}
            </p>
            <ul className="space-y-2 ml-4">
              {(sections?.types?.functional?.items || [
                "Language and region preferences",
                "User interface customizations",
                "Remembering login details"
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Analytics Cookies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {sections?.types?.analytics?.title || "3. Analytics Cookies"}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-2">
              {sections?.types?.analytics?.content || "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously."}
            </p>
            <ul className="space-y-2 ml-4">
              {(sections?.types?.analytics?.items || [
                "Google Analytics for website traffic analysis",
                "Page visit tracking and user behavior analysis",
                "Performance monitoring and error tracking"
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketing Cookies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {sections?.types?.marketing?.title || "4. Marketing Cookies"}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-2">
              {sections?.types?.marketing?.content || "These cookies are used to track visitors across websites to display relevant advertisements."}
            </p>
            <ul className="space-y-2 ml-4">
              {(sections?.types?.marketing?.items || [
                "Google Ads and remarketing",
                "Facebook Pixel for targeted advertising",
                "Social media integration and sharing"
              ]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.thirdParty?.title || "Third-Party Cookies"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {sections?.thirdParty?.content1 || "In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide other services."}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {sections?.thirdParty?.content2 || "These third parties include Google Analytics, Google Ads, Facebook, and other advertising and analytics partners. These cookies are governed by the respective privacy policies of these third parties."}
          </p>
        </div>

        {/* Cookie Duration */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.duration?.title || "Cookie Duration"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {sections?.duration?.intro || "Cookies can be classified based on their duration:"}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-600">
                <strong className="text-gray-700">{sections?.duration?.session?.title || "Session Cookies"}:</strong> {sections?.duration?.session?.content || "These are temporary cookies that expire when you close your browser. They are used to maintain your session while navigating our website."}
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-600">
                <strong className="text-gray-700">{sections?.duration?.persistent?.title || "Persistent Cookies"}:</strong> {sections?.duration?.persistent?.content || "These cookies remain on your device for a set period or until you delete them. They help us remember your preferences for future visits."}
              </span>
            </li>
          </ul>
        </div>

        {/* Managing Cookies */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.managing?.title || "Managing Cookies"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {sections?.managing?.intro || "You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences through:"}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-600">
                <strong className="text-gray-700">{sections?.managing?.browser?.title || "Browser Settings"}:</strong> {sections?.managing?.browser?.content || "Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete existing cookies."}
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-600">
                <strong className="text-gray-700">{sections?.managing?.optOut?.title || "Opt-Out Links"}:</strong> {sections?.managing?.optOut?.content || "You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on."}
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-600">
                <strong className="text-gray-700">{sections?.managing?.consent?.title || "Cookie Consent Banner"}:</strong> {sections?.managing?.consent?.content || "When you first visit our website, you will be presented with a cookie consent banner where you can choose your preferences."}
              </span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            {sections?.managing?.note || "Please note that disabling certain cookies may affect the functionality of our website and your user experience."}
          </p>
        </div>

        {/* Changes to This Policy */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.changes?.title || "Changes to This Policy"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {sections?.changes?.content || "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically for the latest information on our cookie practices."}
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {sections?.contact?.title || "Contact Us"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {sections?.contact?.intro || "If you have any questions about our use of cookies or this Cookie Policy, please contact us:"}
          </p>
          <div className="bg-gradient-to-br from-[#2BB89A]/10 to-[#2BB89A]/5 border-l-4 border-[#2BB89A] rounded-lg p-6">
            <ul className="space-y-2">
              <li className="text-gray-600">
                <strong className="text-gray-700">{t?.policies?.common?.email || "Email"}:</strong> {sections?.contact?.email || "support@quikkred.in"}
              </li>
              <li className="text-gray-600">
                <strong className="text-gray-700">{t?.policies?.common?.address || "Address"}:</strong> {sections?.contact?.address || "1008, 10th Floor, Vikrant Tower, Rajendra Place, New Delhi - 110008"}
              </li>
            </ul>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            {t?.policies?.common?.lastUpdated || "Last Updated"}: {c?.lastUpdated || "December 2025"}
          </p>
        </div>

      </PoliciesLayout>

      {/* Footer Section */}
      <footer className="w-full bg-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            &copy; 2025 Quikkred |{' '}
            <Link
              href="/fair-practice"
              className="text-[#2BB89A] hover:text-[#239b82] font-medium transition-colors"
            >
              {t?.policies?.common?.backToPolicies || "Back to Policies"}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
