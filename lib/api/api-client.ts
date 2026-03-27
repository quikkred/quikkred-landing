import { API_BASE_URL } from '@/lib/config';
import getToken from '../getToken';
import { clearSession } from '../auth-utils';

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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useExternalAPI: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = useExternalAPI
      ? `${this.externalBaseURL}${endpoint}`
      : `${this.baseURL}${endpoint}`;

    // Get fresh token for each request
    // const token = this.getToken();
    const token = await getToken();

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
