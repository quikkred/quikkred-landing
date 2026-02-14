"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CriticalErrorBoundary } from "@/components/error/ErrorBoundary";
import ReduxProvider from "@/store/Provider";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { TranslationData } from "@/lib/getTranslation";

export function Providers({ language, initialData, children }: { language: string; initialData: TranslationData; children: ReactNode; }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Log environment variables on initial load for debugging
  useEffect(() => {
    const envVars: Record<string, string | undefined> = {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_AWS_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
      NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
      NEXT_PUBLIC_TRUECALLER_PARTNER_KEY: process.env.NEXT_PUBLIC_TRUECALLER_PARTNER_KEY,
      NEXT_PUBLIC_TRUECALLER_APP_NAME: process.env.NEXT_PUBLIC_TRUECALLER_APP_NAME,
    };

    console.group('🔧 Environment Variables');
    Object.entries(envVars).forEach(([key, value]) => {
      if (value) {
        // Mask sensitive values, show first 8 chars
        const masked = value.length > 12 ? value.slice(0, 8) + '...' : value;
        console.log(`✅ ${key}: ${masked}`);
      } else {
        console.warn(`❌ ${key}: NOT SET`);
      }
    });
    console.groupEnd();
  }, []);

  // Clear temporary localStorage data on hard refresh
  useEffect(() => {
    // Check if this is a hard refresh using performance navigation API
    if (typeof window !== 'undefined') {
      const perfEntries = performance.getEntriesByType('navigation');
      const navigationEntry = perfEntries[0] as PerformanceNavigationTiming;

      // Clear temporary data on hard reload
      if (navigationEntry && navigationEntry.type === 'reload') {
        // List of temporary keys to clear (preserve auth-related data)
        const tempKeys = ['heroFormData', 'quickApplyData'];

        tempKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      }
    }
  }, []);

  // Only load WebSocket and Analytics after initial render for better performance
  const [mountNonCritical, setMountNonCritical] = useState(false);

  useEffect(() => {
    // Delay mounting non-critical providers until after initial page load
    const timer = setTimeout(() => {
      setMountNonCritical(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <CriticalErrorBoundary>
      <ReduxProvider>
        <SessionProvider refetchInterval={30} refetchOnWindowFocus>
          <I18nextProvider i18n={i18n}>
            <LanguageProvider lang={language as string} initialData={initialData}>
              <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                  <NotificationProvider>
                    <NextTopLoader
                      color="#25b181"
                      height={3}
                      showSpinner={false}
                      easing="ease"
                      speed={200}
                    />
                    {mountNonCritical ? (
                      <AnalyticsProvider>
                        <WebSocketProvider>
                          {children}
                        </WebSocketProvider>
                      </AnalyticsProvider>
                    ) : (
                      children
                    )}
                  </NotificationProvider>
                </QueryClientProvider>
              </ThemeProvider>
            </LanguageProvider>
          </I18nextProvider>
        </SessionProvider>
      </ReduxProvider>
    </CriticalErrorBoundary>
  );
}