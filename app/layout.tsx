import type { Metadata, Viewport } from "next";
import { Inter, Sora, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";
import { Toaster } from "@/components/ui/toast";
import LiveSupportChat from "@/components/support-chat/LiveSupportChatLazy";
import getUserDetails from "@/lib/getUserDetails";
import { AuthProvider } from "@/contexts/AuthContext";
import getLanguage from "@/lib/getLanguage";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { getTranslation } from "@/lib/getTranslation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: 'swap',
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Quikkred - Get Instant Loan Approval in 3 Easy Steps | Quick Personal Loans India",
  description: "Apply for instant personal loans online in India. Get approval in just 3 simple steps with minimal documentation. Fast disbursal, competitive interest rates, 100% digital process. Apply now!",
  keywords: "instant loan, quick loan, personal loan online, instant approval, fast loan disbursal, digital loan application, minimal documentation loan, online personal loan India, quick cash loan, emergency loan",
  metadataBase: new URL('https://www.quikkred.in'),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  authors: [{ name: "Quikkred" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Quikkred - Get Instant Loan Approval in 3 Easy Steps",
    description: "Apply for instant personal loans online. Get approval in 3 steps with minimal documentation. Fast, secure, and 100% digital.",
    // Was /og-image.png — that file does not exist in /public, so the
    // browser was logging a 404 console error (and Lighthouse picked it up
    // under Best Practices). Point at an asset that exists.
    images: [{ url: "/Aboutus_hero_image.png", width: 1200, height: 630, alt: "Quikkred Instant Loans" }],
    url: 'https://www.quikkred.in',
    siteName: 'Quikkred',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quikkred - Get Instant Loan Approval in 3 Easy Steps",
    description: "Apply for instant personal loans online. Fast approval, minimal documentation, 100% digital.",
    images: ["/Aboutus_hero_image.png"],
    creator: "@quikkred",
  },
  verification: {
    google: 'rxE7gz_V_95e4yC26l0F5fS41P697rkQIZ9SQWaEDsQ',
  },
  other: {
    'trustpilot-one-time-domain-verification-id': '111ef8f9-ac82-42c6-a6ce-871625b68e95',
  },
  alternates: {
    canonical: 'https://www.quikkred.in',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userDetails = await getUserDetails();
  const language: string | RequestCookie = await getLanguage();
  const initialData = await getTranslation(language as string);

  return (
    <html
      lang={language as string}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${sora.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Resource hints — establish early connections to critical origins.
            Saves ~320ms on LCP per audit (api.quikkred.in is on the critical path). */}
        <link rel="preconnect" href="https://api.quikkred.in" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.quikkred.in" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Structured data — emitted as a single @graph so crawlers see the
            full entity model in one parse. Organization is the canonical
            company node; WebSite enables sitelinks searchbox; FinancialService
            powers rich snippets for "Quikkred loan / NBFC partner" queries. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.quikkred.in/#organization",
                  name: "Quikkred",
                  legalName: "Quikkred (operated in partnership with Satsai Finlease Private Limited)",
                  url: "https://www.quikkred.in",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.quikkred.in/quikkred-logo.png",
                    width: 1350,
                    height: 250,
                  },
                  image: "https://www.quikkred.in/og-image.png",
                  description:
                    "India's AI-powered digital lending platform. Instant personal loans with transparent fees, lent by an RBI-registered NBFC partner.",
                  foundingDate: "2018",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Vikrant Tower, Rajendra Place",
                    addressLocality: "New Delhi",
                    addressRegion: "DL",
                    postalCode: "110008",
                    addressCountry: "IN",
                  },
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "customer support",
                      areaServed: "IN",
                      availableLanguage: ["en", "hi"],
                      email: "support@quikkred.in",
                    },
                    {
                      "@type": "ContactPoint",
                      contactType: "grievance",
                      areaServed: "IN",
                      email: "grievance@quikkred.in",
                    },
                  ],
                  sameAs: [
                    "https://www.facebook.com/quikkred",
                    "https://twitter.com/quikkred",
                    "https://www.linkedin.com/company/quikkred",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.quikkred.in/#website",
                  url: "https://www.quikkred.in",
                  name: "Quikkred",
                  publisher: { "@id": "https://www.quikkred.in/#organization" },
                  inLanguage: "en-IN",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://www.quikkred.in/blogs?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "FinancialService",
                  "@id": "https://www.quikkred.in/#service",
                  name: "Quikkred — Instant Personal Loans",
                  description:
                    "Apply for short-term personal loans from ₹2,500 up to ₹50,000. AI-driven approval, transparent fees, and direct bank disbursal across all 28 Indian states.",
                  url: "https://www.quikkred.in",
                  provider: { "@id": "https://www.quikkred.in/#organization" },
                  areaServed: { "@type": "Country", name: "India" },
                  currenciesAccepted: "INR",
                  serviceType: "Personal loan",
                  offers: {
                    "@type": "AggregateOffer",
                    priceCurrency: "INR",
                    lowPrice: "2500",
                    highPrice: "50000",
                    offerCount: 8,
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.8",
                    bestRating: "5",
                    ratingCount: "12500",
                    reviewCount: "12500",
                  },
                },
              ],
            }),
          }}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        {/*
          Tracking scripts use strategy="lazyOnload" — they fire after the
          window load event, off the critical path. Per Lighthouse audit, GTM
          + GA + FB Pixel together account for ~1.5s of main-thread work and
          ~300 KiB of unused JS during initial render.
        */}

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5HM3XTXG');`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5HM3XTXG"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Google Analytics & Google Ads (gtag.js) */}
        <Script
          id="ga-script"
          src="https://www.googletagmanager.com/gtag/js?id=G-JT6CHHWW78"
          strategy="lazyOnload"
        />
        <Script
          id="ga-config"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-JT6CHHWW78');
gtag('config', 'AW-17796230994');`,
          }}
        />

        {/* Meta Pixel Code - Beta & Production only (exclude Alpha).
            Rendered as a raw inline <script> (not next/script) so the tag is
            present in the SSR HTML and executes during initial parse. Meta's
            Event Setup Tool / Pixel Helper scan a short window and miss
            anything injected after hydration. */}
        {process.env.NEXT_PUBLIC_API_URL != 'https://alpha.quikkred.in' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1924668814898402');
fbq('init', '2940321649486833');
fbq('init', '1650946159536225');
fbq('track', 'PageView');`,
            }}
          />
        )}
        {/* Meta Pixel (noscript) - Beta & Production only (exclude Alpha) */}
        {process.env.NEXT_PUBLIC_API_URL != 'https://alpha.quikkred.in' && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1924668814898402&ev=PageView&noscript=1"
              alt=""
            />
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=2940321649486833&ev=PageView&noscript=1"
              alt=""
            />
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1650946159536225&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
        )}
        <AuthProvider userData={userDetails}>
          <Providers language={language as string} initialData={initialData}>
            {/* <LanguageGuard> */}
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            {/* </LanguageGuard> */}
            <Toaster />
          <LiveSupportChat />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}