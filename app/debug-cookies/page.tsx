'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugCookiesPage() {
  const router = useRouter();
  const [cookies, setCookies] = useState('');
  const [localStorage, setLocalStorage] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie);

    // Get relevant localStorage items
    const storage: Record<string, string> = {};
    storage.language = window.localStorage.getItem('language') || 'not set';
    storage.i18nextLng = window.localStorage.getItem('i18nextLng') || 'not set';
    setLocalStorage(storage);
  }, []);

  const clearAllCookies = () => {
    // Clear languageSelected cookie
    document.cookie = 'languageSelected=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'i18nextLng=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Clear localStorage
    window.localStorage.removeItem('language');
    window.localStorage.removeItem('i18nextLng');

    alert('Cookies and localStorage cleared! Redirecting to home...');
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug: Cookies & Storage</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {cookies || 'No cookies found'}
          </pre>
          <div className="mt-4">
            <strong>Has languageSelected cookie:</strong>{' '}
            {document.cookie.includes('languageSelected=true') ? '✅ YES' : '❌ NO'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
          <pre className="bg-gray-50 p-4 rounded">
            {JSON.stringify(localStorage, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearAllCookies}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Clear All Cookies & Storage
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => router.push('/select-language')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go to Language Selector
          </button>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">💡 How to Test First Visit:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Clear All Cookies & Storage" button above</li>
            <li>You'll be redirected to homepage</li>
            <li>The LanguageGuard should immediately redirect you to /select-language</li>
            <li>Select a language</li>
            <li>You'll be redirected back to homepage with that language</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
