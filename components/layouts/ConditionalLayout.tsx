"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SecurityBanner } from "@/components/security-banner";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// Lazy load user dashboard layout - only needed when authenticated
const UserLayout = dynamic(() => import("./UserLayout"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
});

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Routes that should NOT use dashboard layouts (i.e., public website pages)
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/products',
  '/partners',
  '/apply',
  '/track-application',
  '/login',
  '/products/personal-loan',
  '/resources',
  '/contact',
  '/support',
  '/grievance',
  '/nodal-officer',
  '/branches',
  '/downloads',
  '/report-fraud',
  '/press',
  '/testimonials',
  '/careers',
  '/privacy',
  '/terms',
  '/fair-practice',
  '/interest-policy',
  '/kyc-policy',
  '/grievance-redressal-policy',
  '/cookies'
];

// Routes that should NOT show header/footer (full-page experiences for all users)
const FULL_SCREEN_ROUTES = ['/select-language', '/apply/quick', '/apply/loan'];

// Check if current path should use public layout
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
};

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();
  const { user, isLoggingOut } = useAuth();
  const [hasToken, setHasToken] = useState(false);

  // Check for token in localStorage on mount (for users who just completed form submission)
  useEffect(() => {
    const token = localStorage.getItem('accessToken') ||
                  localStorage.getItem('token') ||
                  localStorage.getItem('authToken');
    setHasToken(!!token);
  }, [pathname]);

  // Show loading screen when logging out to prevent UI flash
  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Logging out...</p>
        </div>
      </div>
    );
  }

  // If it's a full-screen route, render without header/footer (for all users)
  if (FULL_SCREEN_ROUTES.some(route => pathname.startsWith(route))) {
    return (
      <>
        {children}
      </>
    );
  }

  // If it's a public route, render with website header/footer
  if (isPublicRoute(pathname)) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <SecurityBanner />
      </>
    );
  }

  // For /user routes: Show UserLayout if user is authenticated OR has a token
  // This handles the case where user just submitted form and has token but AuthContext hasn't loaded yet
  if (user || (hasToken && pathname.startsWith('/user'))) {
    return <UserLayout>{children}</UserLayout>;
  }

  // If user is not authenticated and no token, just render children
  // Individual dashboard pages will handle authentication checks and redirects
  return <>{children}</>;
};

export default ConditionalLayout;
