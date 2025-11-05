"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CriticalErrorBoundary } from "@/components/error/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
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
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
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
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </CriticalErrorBoundary>
  );
}