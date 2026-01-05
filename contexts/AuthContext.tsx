"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  fullName?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  status?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, apiData?: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isLoggingOut: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token') ||
                  localStorage.getItem('authToken') ||
                  localStorage.getItem('accessToken');
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
    const storedUserMobile = localStorage.getItem('userMobile');

    if (token && storedUserId) {
      // Create user object from stored data
      const userData: User = {
        id: storedUserId,
        name: storedUserName || 'User',
        email: storedUserEmail || '',
        mobile: storedUserMobile || undefined,
      };

      setUser(userData);

      // Fetch real user profile if we have a real token (not mock)
      if (token && !token.startsWith('mock_token_')) {
        fetchUserProfile(token, userData);
      }
    }

    setIsLoading(false);
  }, []);

  const fetchUserProfile = async (token: string, currentUser: User) => {
    console.log('🔵 Fetching user profile from API...');
    try {
      const response = await fetch('https://alpha.quikkred.in/api/customer/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('🟢 Profile API Response:', result.success ? 'Success' : 'Failed');

      if (response.ok && result.success && result.data) {
        const apiData = result.data;

        // Use fullName directly from API
        const fullName = apiData.fullName || currentUser.name;

        console.log('✅ Profile fetched successfully. Name:', fullName);

        // Update user with real profile data from API
        const updatedUser: User = {
          ...currentUser,
          name: fullName,
          fullName: fullName,
          email: apiData.email || currentUser.email,
          mobile: apiData.mobile || currentUser.mobile,
          dateOfBirth: apiData.dateOfBirth,
          address: apiData.currentAddress?.line1,
          city: apiData.currentAddress?.city,
          state: apiData.currentAddress?.state,
          pincode: apiData.currentAddress?.pincode,
          isEmailVerified: apiData.isEmailVerified,
          isMobileVerified: apiData.isMobileVerified,
          kycStatus: apiData.kyc?.kycStatus || 'PENDING',
          status: apiData.status,
          createdAt: apiData.createdAt,
        };

        setUser(updatedUser);

        // Update localStorage with real profile data
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userEmail', apiData.email || currentUser.email);
        if (apiData.mobile) {
          localStorage.setItem('userMobile', apiData.mobile);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string, apiData?: any): Promise<boolean> => {
    setIsLoading(true);

    try {
      // If API data is provided, use it for authentication
      if (apiData && apiData.userId && (apiData.token || apiData.accessToken)) {
        const authToken = apiData.accessToken || apiData.token;

        // Determine if login was with email or mobile
        const isEmailLogin = email.includes('@');
        const isMobileLogin = /^\+?\d{10,}$/.test(email);

        // Create user object from API data
        const userData: User = {
          id: apiData.userId,
          name: apiData.fullName || apiData.name || 'User',
          email: isEmailLogin ? email : (apiData.email || ''),
          mobile: isMobileLogin ? email : (apiData.mobile || ''),
        };

        // Store session in localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('accessToken', authToken);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userId', apiData.userId);
        if (userData.mobile) {
          localStorage.setItem('userMobile', userData.mobile);
        }
        if (apiData.role) {
          localStorage.setItem('role', apiData.role);
        }

        // Set cookies for middleware to access
        document.cookie = `auth-token=${authToken}; path=/; max-age=2592000`;

        setUser(userData);

        // Fetch real user profile and wait for it
        await fetchUserProfile(authToken, userData);

        // Redirect to user dashboard
        router.push('/user');

        return true;
      }

      // No mock authentication - only real API auth supported
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Set logging out state immediately to hide UI
    setIsLoggingOut(true);
    setUser(null);

    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('customerUniqueId');
    localStorage.removeItem('heroFormData');

    // Clear cookies
    document.cookie = 'auth-token=; path=/; max-age=0';
    document.cookie = 'user-role=; path=/; max-age=0';

    // Use setTimeout to ensure state is updated before redirect
    setTimeout(() => {
      window.location.href = '/login';
    }, 0);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Update localStorage if needed
      if (userData.name) {
        localStorage.setItem('userName', userData.name);
      }
      if (userData.email) {
        localStorage.setItem('userEmail', userData.email);
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isLoggingOut,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
