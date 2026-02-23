# Login and Logout Issue Analysis Report - Quikkred Landing

## Executive Summary
This report details the architectural and implementation issues identified in the authentication system of the Quikkred Landing project. The primary issues stem from conflicting authentication mechanisms (Manual vs. Next-Auth), inconsistent API endpoints, and race conditions during the logout process.

---

## 1. Primary Issues Identified

### A. Inconsistent API Endpoints (The "Mock Login" Trap)
There is a major discrepancy in which API endpoints are used for authentication across the platform:
- **`app/login/page.tsx`**: Uses `/api/auth/customer/login` via `useAxios`.
- **`lib/api/auth.service.ts`**: Hardcodes `/api/auth/mock-login` for all login attempts.
- **`test-dashboards.html`**: Also hardcodes `/api/auth/mock-login`.
- **Finding**: Since `/api/auth/mock-login` does not exist in the `app/api` directory, any feature relying on `AuthService` will fail to log in.

### B. Conflicting 401 Unauthorized Handlers
The application has two redundant and conflicting systems for handling session expiration:
1. **`lib/api/api-client.ts`**: Clears `localStorage`, clears cookies, and calls `signOut({ redirect: false })`.
2. **`hooks/useAxios.ts`**: Only calls `signOut({ redirect: true })` but **fails to clear localStorage**.
- **Impact**: When `useAxios` triggers a logout, `localStorage` remains populated. On the next page load, `AuthContext` restores the "user" from `localStorage`, but the backend and middleware see no valid session. This creates a "Zombie Session" where the UI looks logged in but all actions fail.

### C. Logout Redirect Loop & Race Conditions
The logout logic in `AuthContext.tsx` and `ApiClient.ts` is prone to a race condition:
1. `signOut({ redirect: false })` is called.
2. `window.location.href = '/login'` is executed immediately after.
3. If the browser hasn't finished clearing the `next-auth.session-token` cookie before the `/login` request hits the server, the `middleware.ts` will detect a "loggedIn" user and redirect them back to `/user`.
- **Result**: Users find themselves unable to log out as they are instantly bounced back to the dashboard.

### D. Performance Degradation (getToken/getSession)
The `lib/getToken.ts` utility (used by `apiClient` for every request) calls `getSession()` from `next-auth/react`.
- **Impact**: `getSession()` is an expensive client-side operation that performs a fetch to `/api/auth/session`. Calling this on every API request significantly slows down the application and increases server load.

---

## 2. Technical Synchronization Mismatch
- **Mechanism 1**: Manual storage (`localStorage` + `auth-token` cookie).
- **Mechanism 2**: Next-Auth (`JWT` + `next-auth.session-token` HttpOnly cookie).
- **Issue**: `middleware.ts` only respects Mechanism 2, while the `apiClient` primarily uses Mechanism 1 (but fetches from Mechanism 2 via `getToken`). If these two get out of sync (e.g., token expires in one but not the other), the app enters an undefined state.

---

## 3. Recommended Fixes

### Immediate Term:
1. **Unify 401 Handling**: Consolidate all logout logic into a single utility function that clears both `localStorage` and `next-auth` sessions.
2. **Fix AuthService Endpoint**: Update `lib/api/auth.service.ts` to use the correct production endpoint instead of `mock-login`.
3. **Protect Auth Endpoints**: Update `useAxios.ts` interceptor to ignore 401 errors from `/api/auth/*` routes to prevent logout loops during failed login attempts.

### Long Term:
1. **Refactor getToken**: Change `apiClient` to use a locally cached token or the `AuthContext` state instead of calling `getSession()` on every request.
2. **Standardize Auth**: Move entirely to `next-auth` for session management and use the `useSession` hook for UI state, removing the redundant reliance on manually managed `localStorage`.
3. **Improve Logout Flow**: Use `signOut({ callbackUrl: '/login' })` directly instead of manual redirects to allow Next-Auth to handle the cleanup and navigation sequence correctly.

---
**Report Status**: Final
**Author**: Gemini CLI Analysis
**Date**: February 23, 2026
