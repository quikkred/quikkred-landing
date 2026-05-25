import { signOut } from 'next-auth/react';

/**
 * Clears all authentication-related data from the browser
 * This includes localStorage, session cookies, and NextAuth session
 */
export const clearSession = async (redirectPath: string | null = '/login') => {
  if (typeof window === 'undefined') return;

  //console.log('🧹 Clearing session and all authentication data...');

  // 1. Clear all localStorage items used by the app
  const itemsToRemove = [
    'token',
    'authToken',
    'accessToken',
    'refreshToken',
    'loginTimestamp',
    'userRole',
    'role',
    'userEmail',
    'email',
    'userName',
    'userId',
    'userMobile',
    'customerUniqueId',
    'heroFormData'
  ];

  itemsToRemove.forEach(item => localStorage.removeItem(item));

  // 2. Clear custom cookies
  document.cookie = 'auth-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user-role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // 3. Clear NextAuth non-HttpOnly cookies
  document.cookie = 'next-auth.callback-url=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'next-auth.csrf-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // 4. Handle NextAuth sign out and redirection
  if (redirectPath) {
    try {
      // Use NextAuth's native redirect capability for a cleaner flow
      await signOut({ callbackUrl: redirectPath, redirect: true });
    } catch (error) {
      console.error('Error during signOut:', error);
      // Fallback redirect if signOut fails
      window.location.href = redirectPath;
    }
  } else {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Error during signOut (no-redirect):', error);
    }
  }
};
