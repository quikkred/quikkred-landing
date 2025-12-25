'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="w-full bg-[#2BB89A] py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            Cookie Policy
          </h1>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-[900px]">

          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              QuikkRed Financial Services Private Limited (&quot;QuikkRed&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar tracking technologies on our website and mobile application. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By continuing to use our website, you consent to the use of cookies in accordance with this Cookie Policy.
            </p>
          </section>

          {/* What Are Cookies */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Cookies help us recognize your device and remember information about your visit, such as your preferences and settings. This helps us improve your experience on our website.
            </p>
          </section>

          {/* Types of Cookies We Use */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Types of Cookies We Use
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the following types of cookies on our website:
            </p>

            {/* Essential Cookies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">1. Essential Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Session management and authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Security and fraud prevention</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Load balancing and website performance</span>
                </li>
              </ul>
            </div>

            {/* Functional Cookies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">2. Functional Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                These cookies allow us to remember choices you make and provide enhanced, personalized features.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Language and region preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">User interface customizations</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Remembering login details</span>
                </li>
              </ul>
            </div>

            {/* Analytics Cookies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">3. Analytics Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Google Analytics for website traffic analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Page visit tracking and user behavior analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Performance monitoring and error tracking</span>
                </li>
              </ul>
            </div>

            {/* Marketing Cookies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">4. Marketing Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                These cookies are used to track visitors across websites to display relevant advertisements.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Google Ads and remarketing</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Facebook Pixel for targeted advertising</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Social media integration and sharing</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide other services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These third parties include Google Analytics, Google Ads, Facebook, and other advertising and analytics partners. These cookies are governed by the respective privacy policies of these third parties.
            </p>
          </section>

          {/* Cookie Duration */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Cookie Duration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookies can be classified based on their duration:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Session Cookies:</strong> These are temporary cookies that expire when you close your browser. They are used to maintain your session while navigating our website.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Persistent Cookies:</strong> These cookies remain on your device for a set period or until you delete them. They help us remember your preferences for future visits.
                </span>
              </li>
            </ul>
          </section>

          {/* Managing Cookies */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Managing Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences through:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete existing cookies.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Opt-Out Links:</strong> You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[#2BB89A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">
                  <strong className="text-gray-700">Cookie Consent Banner:</strong> When you first visit our website, you will be presented with a cookie consent banner where you can choose your preferences.
                </span>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Please note that disabling certain cookies may affect the functionality of our website and your user experience.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically for the latest information on our cookie practices.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gradient-to-br from-[#2BB89A]/10 to-[#2BB89A]/5 border-l-4 border-[#2BB89A] rounded-lg p-6">
              <ul className="space-y-2">
                <li className="text-gray-600">
                  <strong className="text-gray-700">Email:</strong> privacy@quikkred.com
                </li>
                <li className="text-gray-600">
                  <strong className="text-gray-700">Address:</strong> QuikkRed, Head Office, Plot No. 420, Digital Lane, Sector-44, Gurugram – 122003
                </li>
              </ul>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              Last Updated: December 2025
            </p>
          </section>

        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            &copy; 2025 QuikkRed |{' '}
            <Link
              href="/fair-practice"
              className="text-[#2BB89A] hover:text-[#239b82] font-medium transition-colors"
            >
              Back to Policies
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
