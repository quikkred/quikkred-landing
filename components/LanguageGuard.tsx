'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has selected a language before
    const hasLanguageSelected = document.cookie.includes('languageSelected=true');
    const savedLang = localStorage.getItem('language');

    if (!hasLanguageSelected && !savedLang) {
      // First time visitor - set English as default
      localStorage.setItem('language', 'en');
      document.cookie = 'languageSelected=true; path=/; max-age=31536000'; // 1 year
      (window as any).__initialLanguage = 'en';
    }
  }, [pathname, router]);

  return <>{children}</>;
}
