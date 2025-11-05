'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Redirect based on user role
    if (user && user.role) {
      switch (user.role) {
        case 'ADMIN':
        case 'SUPER_ADMIN':
          router.push('/admin');
          break;
        case 'USER':
        case 'CUSTOMER':
          router.push('/user');
          break;
        case 'UNDERWRITER':
          router.push('/underwriter');
          break;
        case 'COLLECTION_AGENT':
          router.push('/collection-agent');
          break;
        case 'FINANCE_MANAGER':
          router.push('/finance-manager');
          break;
        case 'RISK_ANALYST':
          router.push('/risk-analyst');
          break;
        case 'SUPPORT_AGENT':
          router.push('/support-agent');
          break;
        default:
          router.push('/login');
      }
    } else {
      // If no user, redirect to login
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Redirecting to your dashboard...</h2>
        <p className="text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
}