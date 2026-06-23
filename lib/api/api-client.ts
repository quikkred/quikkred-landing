import { API_BASE_URL } from '@/lib/config';
import getToken from '../getToken';
import { clearSession } from '../auth-utils';
import { isTestMode } from '@/lib/testMode';

// Core API Client with type-safe methods for all backend endpoints
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private externalBaseURL: string;
  static isLoggingOut = false;

  constructor() {
    // In Next.js, we use relative URLs for API routes
    this.baseURL = '';
    // External API URL from environment config
    this.externalBaseURL = API_BASE_URL;
  }

  // Get fresh token from localStorage before each request
  // getToken(): string | null {
  //   if (typeof window !== 'undefined') {
  //     return localStorage.getItem('authToken') ||
  //            localStorage.getItem('accessToken') ||
  //            localStorage.getItem('token');
  //   }
  //   return null;
  // }

  // Resolve the auth token, retrying briefly to ride out the short window right
  // after login where the NextAuth session hasn't populated accessToken yet.
  private async resolveToken(retries = 3, delayMs = 200): Promise<string | null> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const token = await getToken();
      if (token) return token;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useExternalAPI: boolean = false
  ): Promise<ApiResponse<T>> {
    // TEST MODE: never hit the backend. Endpoints that need data are
    // short-circuited with dummy data in customer.service; everything else
    // fails soft so callers' guards/catches handle it without a network call.
    if (isTestMode()) {
      return { success: false, error: 'test-mode: backend disabled' } as ApiResponse<T>;
    }

    const url = useExternalAPI
      ? `${this.externalBaseURL}${endpoint}`
      : `${this.baseURL}${endpoint}`;

    // /api/customer/get REQUIRES an auth token. Resolve it with a short retry to
    // ride out the post-login window, then refuse to send the request without it
    // (the backend rejects a tokenless call with 401 "Token missing"). Scoped to
    // this endpoint so other/public calls keep their existing behaviour.
    const requiresToken = endpoint.includes('/api/customer/get');
    const token = requiresToken ? await this.resolveToken() : await getToken();

    if (requiresToken && !token) {
      // Fail soft so callers' catch/guards handle it without a logout loop.
      return {
        success: false,
        error: 'Not authenticated',
        message: 'Authentication token unavailable. Please log in again.',
      } as ApiResponse<T>;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration (401 Unauthorized)
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          // Check if we're on login page or just logged in - don't clear storage
          const isLoginPage = window.location.pathname === '/login';
          const loginTimestamp = localStorage.getItem('loginTimestamp');
          const justLoggedIn = loginTimestamp &&
            (Date.now() - parseInt(loginTimestamp, 10)) < 10000; // 10 second grace period

          if (!isLoginPage && !justLoggedIn) {
            // ✅ Guard: prevent multiple 401 handlers from firing simultaneously
            if (ApiClient.isLoggingOut) {
              return { success: false, error: 'Session expired' } as ApiResponse<T>;
            }
            ApiClient.isLoggingOut = true;

            // ✅ Use central utility for consistent cleanup
            await clearSession('/login');

            // Return instead of throw — prevents component re-renders that trigger re-fetches
            return { success: false, error: 'Session expired' } as ApiResponse<T>;
          }
        }
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
    }
  }

  // GET request
  async get<T>(endpoint: string, useExternalAPI: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, useExternalAPI);
  }

  // POST request
  async post<T>(endpoint: string, data?: any, useExternalAPI: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, useExternalAPI);
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, useExternalAPI: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, useExternalAPI);
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, useExternalAPI: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, useExternalAPI);
  }

  // DELETE request
  async delete<T>(endpoint: string, useExternalAPI: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, useExternalAPI);
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse };