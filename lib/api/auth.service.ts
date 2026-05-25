import { apiClient, ApiResponse } from './api-client';
import { deviceFingerprint, DeviceFingerprint } from '../device-fingerprint';

export interface LoginRequest {
  emailOrMobile: string;
  password: string;
  deviceFingerprint?: DeviceFingerprint;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  userType?: string;
  deviceFingerprint?: DeviceFingerprint;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
  };
}

export interface RegisterResponse {
  userId: string;
  token: string;
  requiresVerification: boolean;
  otp?: string; // Only in development
}

class AuthService {
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Collect device fingerprint for fraud prevention
    let fp: DeviceFingerprint | undefined;
    try {
      fp = await deviceFingerprint.collect({ includeGeolocation: true, includeWebRTC: true });
    } catch (e) {
      console.error('[Auth] Failed to collect device fingerprint:', e);
    }

    // Send login request with device data
    const response = await apiClient.post<LoginResponse>('/api/auth/customer/login', {
      ...data,
      deviceFingerprint: fp
    });

    // Store token if login successful
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);

      // Also send device data to dedicated endpoint for storage
      if (fp) {
        this.sendDeviceData(fp, response.data.user.id).catch(console.error);
      }
    }

    return response;
  }

  // Send device fingerprint to backend for storage
  private async sendDeviceData(fingerprint: DeviceFingerprint, userId: string): Promise<void> {
    try {
      await apiClient.post('/api/user/device-fingerprint', {
        userId,
        fingerprint,
        eventType: 'LOGIN'
      });
    } catch (e) {
      console.error('[Auth] Failed to send device data:', e);
    }
  }

  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    // Collect device fingerprint for fraud prevention
    let fp: DeviceFingerprint | undefined;
    try {
      fp = await deviceFingerprint.collect({ includeGeolocation: true, includeWebRTC: true });
    } catch (e) {
      console.error('[Auth] Failed to collect device fingerprint:', e);
    }

    const response = await apiClient.post<RegisterResponse>('/api/auth/register', {
      ...data,
      userType: data.userType || 'CUSTOMER',
      deviceFingerprint: fp
    });

    // Store token if registration successful
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);

      // Send device data to dedicated endpoint
      if (fp && response.data.userId) {
        this.sendDeviceData(fp, response.data.userId).catch(console.error);
      }
    }

    return response;
  }

  async logout(): Promise<void> {
    // Clear token from storage
    apiClient.clearToken();

    // Optionally call backend logout endpoint if exists
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      //console.log('Logout endpoint not available');
    }
  }

  async verifyOTP(mobile: string, otp: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/verify-otp', { mobile, otp });
  }

  async sendOTP(mobile: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/send-otp', { mobile });
  }

  async resetPassword(email: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/reset-password', { email });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/change-password', data);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }
}

export const authService = new AuthService();