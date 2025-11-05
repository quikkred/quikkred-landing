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
  private token: string | null = null;

  constructor() {
    // In Next.js, we use relative URLs for API routes
    this.baseURL = '';
    // External API URL
    this.externalBaseURL = 'https://api.Quikkred.com';
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken') || localStorage.getItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useExternalAPI: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = useExternalAPI
      ? `${this.externalBaseURL}${endpoint}`
      : `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

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
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
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
