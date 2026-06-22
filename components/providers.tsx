"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect, lazy, Suspense } from "react";
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
import TestModeBanner from "@/components/TestModeBanner";

// Lazy-loaded AgentInitializer — non-critical, deferred
const AgentInitializer = lazy(() => import('@/lib/quikkred-agent').then(mod => {
  // Return a minimal component that initializes the agent
  const Component = () => {
    mod.quikkredAgent.init().catch(() => {});
    return null;
  };
  return { default: Component };
}));

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
                          <Suspense fallback={null}>
                            <AgentInitializer />
                          </Suspense>
                        </WebSocketProvider>
                      </AnalyticsProvider>
                    ) : (
                      children
                    )}
                    <TestModeBanner />
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