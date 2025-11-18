import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SecurityBanner } from "@/components/security-banner";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";
import LanguageGuard from "@/components/LanguageGuard";

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

export const metadata: Metadata = {
  title: "Quikkred - Get Instant Loan Approval in 3 Easy Steps | Quick Personal Loans India",
  description: "Apply for instant personal loans online in India. Get approval in just 3 simple steps with minimal documentation. Fast disbursal, competitive interest rates, 100% digital process. Apply now!",
  keywords: "instant loan, quick loan, personal loan online, instant approval, fast loan disbursal, digital loan application, minimal documentation loan, online personal loan India, quick cash loan, emergency loan",
  metadataBase: new URL('https://www.quikkred.in'),
  icons: {
    icon: "./favicons.ico",
    shortcut: "./favicons.ico",
    apple: "./apple-touch-icon.png"
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Quikkred Instant Loans" }],
    url: 'https://www.quikkred.in',
    siteName: 'Quikkred',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quikkred - Get Instant Loan Approval in 3 Easy Steps",
    description: "Apply for instant personal loans online. Fast approval, minimal documentation, 100% digital.",
    images: ["/og-image.png"],
    creator: "@quikkred",
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.quikkred.in',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Hide body initially to prevent language flash
                  document.documentElement.style.visibility = 'hidden';

                  const hasCookie = document.cookie.includes('languageSelected=true');
                  if (hasCookie) {
                    const saved = localStorage.getItem('language');
                    if (saved) {
                      window.__initialLanguage = saved;
                      document.documentElement.lang = saved;
                      if (saved === 'ur') {
                        document.documentElement.dir = 'rtl';
                      } else {
                        document.documentElement.dir = 'ltr';
                      }
                    }
                  }
                  // Don't set any default language if user hasn't selected one

                  // Show body after script runs
                  requestAnimationFrame(() => {
                    document.documentElement.style.visibility = 'visible';
                  });
                } catch (e) {
                  document.documentElement.style.visibility = 'visible';
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialService',
              name: 'Quikkred',
              description: 'Instant personal loans with quick approval in 3 easy steps',
              url: 'https://www.quikkred.in',
              logo: 'https://www.quikkred.in/logo.png',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
              },
              sameAs: [
                'https://www.facebook.com/quikkred',
                'https://twitter.com/quikkred',
                'https://www.linkedin.com/company/quikkred'
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '50000'
              },
              offers: {
                '@type': 'Offer',
                name: 'Personal Loan',
                description: 'Instant personal loans starting from ₹10,000',
                priceCurrency: 'INR',
              }
            })
          }}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <LanguageGuard>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </LanguageGuard>
        </Providers>
      </body>
    </html>
  );
}
