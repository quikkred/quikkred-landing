"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SecurityBanner } from "@/components/security-banner";
import dynamic from "next/dynamic";

// Lazy load user dashboard layout - ssr: false is necessary here
const UserLayout = dynamic(() => import("./UserLayout"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    </div>
  )
});

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Only keep the exceptions here
const FULL_SCREEN_ROUTES = ['/select-language', '/apply/quick', '/apply/loan'];

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Logic flags
  const isFullScreen = FULL_SCREEN_ROUTES.some(route => pathname.startsWith(route));
  const isDashboardRoute = pathname.startsWith('/user') || pathname.startsWith("/profile");

  // 2. Handle Full Screen Routes (No Header/Footer)
  if (isFullScreen) {
    return <>{children}</>;
  }

  // 3. Handle Dashboard Layout
  if (isDashboardRoute) {
    return <UserLayout>{children}</UserLayout>;
  }

  // 4. Default Layout (Public Website)
  // This is rendered by default on the server and for all non-dashboard routes
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow animate-fadeIn">
        {children}
      </main>
      <Footer />
      <SecurityBanner />
    </div>
  );
};

export default ConditionalLayout;