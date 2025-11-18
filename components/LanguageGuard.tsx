'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Don't redirect if already on language selector page
    if (pathname === '/select-language') {
      setChecking(false);
      return;
    }

    // Check if user has selected a language before
    const hasLanguageSelected = document.cookie.includes('languageSelected=true');

    console.log('LanguageGuard check:', { pathname, hasLanguageSelected, cookies: document.cookie });

    if (!hasLanguageSelected) {
      // First time visitor - redirect to language selector immediately
      console.log('Redirecting to /select-language');
      router.replace('/select-language');
      // Don't set checking to false - keep showing nothing until redirect completes
    } else {
      // User has selected language - allow rendering
      console.log('Language selected, rendering content');
      setChecking(false);
    }
  }, [pathname, router]);

  // Show nothing while checking or redirecting
  if (checking) {
    return null;
  }

  return <>{children}</>;
}
