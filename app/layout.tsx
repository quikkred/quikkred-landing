import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SecurityBanner } from "@/components/security-banner";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";

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
  title: "Quikkred - Instant Loans with AI-powered Approval",
  description: "India's most trusted NBFC. Get instant loans with AI-powered approval in 30 seconds. Payday loans, personal loans, business loans - 100% digital, transparent pricing.",
  keywords: "Quikkred, blue chip finance, instant loan, AI lending, NBFC, payday loan, personal loan, business loan, quick loan india",
  metadataBase: new URL('https://Quikkred.co.in'),
  icons: {
    icon: "./favicons.ico",          // default favicon
    shortcut: "./favicons.ico",      // shortcut icon
    apple: "./apple-touch-icon.png" // optional for Apple devices
  },
  openGraph: {
    title: "Quikkred",
    description: "Get instant loans with AI-powered approval in 30 seconds. Trusted by + customers.",
    images: ["/og-image.png"],
    url: 'https://Quikkred.com',
    siteName: 'Quikkred',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quikkred",
    description: "Get instant loans with AI-powered approval in 30 seconds",
    images: ["/og-image.png"],
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
                  const hasCookie = document.cookie.includes('languageSelected=true');
                  if (hasCookie) {
                    const saved = localStorage.getItem('language') || 'en';
                    window.__initialLanguage = saved;
                    document.documentElement.lang = saved;
                    if (saved === 'ur') {
                      document.documentElement.dir = 'rtl';
                    } else {
                      document.documentElement.dir = 'ltr';
                    }
                  } else {
                    window.__initialLanguage = 'en';
                  }
                } catch (e) {
                  window.__initialLanguage = 'en';
                }
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
