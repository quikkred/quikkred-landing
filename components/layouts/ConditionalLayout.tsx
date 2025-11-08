"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SecurityBanner } from "@/components/security-banner";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load all dashboard layouts - they're only needed when authenticated
const AdminLayout = dynamic(() => import("./AdminLayout"), { ssr: false });
const UserLayout = dynamic(() => import("./UserLayout"), { ssr: false });

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
  '/terms'
];

// Routes that should NOT show header/footer (full-page experiences)
const FULL_SCREEN_ROUTES = ['/select-language'];

// Routes that should be full-screen for logged-in users only
const LOGGED_IN_FULL_SCREEN_ROUTES = ['/apply/quick', '/apply/loan'];

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
  const { user } = useAuth();

  // If it's a full-screen route, render without header/footer
  if (FULL_SCREEN_ROUTES.includes(pathname)) {
    return (
      <>
        {children}
      </>
    );
  }

  // If user is logged in and on an application form page, show full-screen
  if (user && LOGGED_IN_FULL_SCREEN_ROUTES.some(route => pathname.startsWith(route))) {
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

  // If user is not authenticated, just render children
  // Individual dashboard pages will handle authentication checks and redirects
  if (!user) {
    return <>{children}</>;
  }

  // Render appropriate dashboard layout based on user role
  switch (user.role) {
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return <AdminLayout>{children}</AdminLayout>;

    case 'USER':
    case 'CUSTOMER':
      return <UserLayout>{children}</UserLayout>;

    default:
      // Fallback to public layout
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
};

export default ConditionalLayout;