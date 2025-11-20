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
    const savedLang = localStorage.getItem('language');

    console.log('LanguageGuard check:', { pathname, hasLanguageSelected, savedLang, cookies: document.cookie });

    if (!hasLanguageSelected && !savedLang) {
      // First time visitor - set English as default
      console.log('First time visitor - setting English as default');
      localStorage.setItem('language', 'en');
      document.cookie = 'languageSelected=true; path=/; max-age=31536000'; // 1 year
      (window as any).__initialLanguage = 'en';
    }

    // User has language (either selected or default) - allow rendering
    console.log('Language available, rendering content');
    setChecking(false);
  }, [pathname, router]);

  // Show nothing while checking
  if (checking) {
    return null;
  }

  return <>{children}</>;
}
