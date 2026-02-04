"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from "nextjs-toploader/app";
import { API_BASE_URL } from '@/lib/config';
import { signOut } from 'next-auth/react';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isPanVerify?: boolean;
  isAadhaarVerify?: boolean;
  brePulled?: boolean;
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  status?: string;
  createdAt?: string;
  pan?: string,
  aadhaar?: string,
  employmentType?: string,
  monthlyIncome?: string,
  companyName?: string,
  bankName?: string,
  accountHolderName?: string,
  accountNumber?: string,
  ifsc?: string,
  pennyDropStatus?: string,
  bankVerified?: boolean,
  loanAmount?: string,
  profile?: {
    documentType: string,
    status: string,
    s3Key: string,
    s3URL: string,
  } | null,
  upiAutoPayStatus?: boolean,
  isSubmit?: boolean,
}

interface LoginProps { apiData?: any; email?: string; mobile?: string; }

interface AuthContextType {
  user: User | null;
  login: ({ apiData, email }: LoginProps) => Promise<boolean>;
  setUser: (userData: User | null) => void;
  logout: () => void;
  isLoading: boolean;
  isLoggingOut: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ userData, children }: { userData: User | null; children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   // Check for existing session
  //   const token = localStorage.getItem('token') ||
  //                 localStorage.getItem('authToken') ||
  //                 localStorage.getItem('accessToken');
  //   const storedUserId = localStorage.getItem('userId');
  //   const storedUserName = localStorage.getItem('userName');
  //   const storedUserEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
  //   const storedUserMobile = localStorage.getItem('userMobile');

  //   if (token && storedUserId) {
  //     // Create user object from stored data
  //     const userData: User = {
  //       id: storedUserId,
  //       name: storedUserName || 'User',
  //       email: storedUserEmail || '',
  //       mobile: storedUserMobile || undefined,
  //     };

  //     setUser(userData);

  //     // Fetch real user profile if we have a real token (not mock)
  //     if (token && !token.startsWith('mock_token_')) {
  //       fetchUserProfile(token, userData);
  //     }
  //   }

  //   setIsLoading(false);
  // }, []);

  const fetchUserProfile = async (token: string, currentUser: User) => {
    // console.log('🔵 Fetching user profile from API...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      // console.log('🟢 Profile API Response:', result.success ? 'Success' : 'Failed');

      if (response.ok && result.success && result.data) {
        const apiData = result.data;

        // Use fullName directly from API
        const fullName = apiData.fullName || currentUser.name;

        // console.log('✅ Profile fetched successfully. Name:', fullName);

        // Update user with real profile data from API
        const updatedUser: User = {
          ...currentUser,
          firstName: apiData.firstName || "",
          lastName: apiData.lastName || "",
          name: fullName,
          fullName,
          email: apiData.email || currentUser.email,
          mobile: apiData.mobile || currentUser.mobile,
          dateOfBirth: apiData.dateOfBirth,
          address: apiData.currentAddress?.line1,
          city: apiData.currentAddress?.city,
          state: apiData.currentAddress?.state,
          pincode: apiData.currentAddress?.pincode,
          kycStatus: apiData.kyc?.kycStatus || "PENDING",
          status: apiData.status,
          createdAt: apiData.createdAt,
          profile: apiData.profile ? {
            documentType: apiData.profile.documentType || "",
            status: apiData.profile.status || "",
            s3Key: apiData.profile.s3Key || "",
            s3URL: apiData.profile.s3URL || "",
          } : null,
          isSubmit: apiData?.isSubmit || false,

          // verified
          isEmailVerified: apiData.isEmailVerified || false,
          isMobileVerified: apiData.isMobileVerified || false,
          isPanVerify: apiData.isPanVerify || false,
          isAadhaarVerify: apiData.isAadhaarVerify || false,
          brePulled: apiData.brePulled || false,

          // dob: formatDateForInput(profileData.dateOfBirth) || prev.dob,
          pan: apiData.panCard || null,
          aadhaar: apiData.aadhaarNumber || null,
          employmentType: apiData.employmentType || null,
          monthlyIncome: apiData.monthlyIncome?.toString() || null,
          companyName: apiData.companyName || null,
          loanAmount: apiData.requestedLoanAmount?.toString() || null, // Loan amount from API

          // bank
          bankName: apiData.banks?.[0]?.bankName || null,
          accountHolderName: apiData.banks?.[0]?.accountHolderName || null,
          accountNumber: apiData.banks?.[0]?.accountNumber || null,
          ifsc: apiData.banks?.[0]?.ifscCode || null,
          pennyDropStatus: apiData.banks?.[0]?.pennyDropStatus || null,
          bankVerified: apiData.banks?.[0]?.pennyDropStatus === "VERIFIED",
          upiAutoPayStatus: apiData?.upiAutoPayStatus || false,
        };

        setUser(updatedUser);

        // Update localStorage with real profile data
        // localStorage.setItem('userName', fullName);
        // localStorage.setItem('userEmail', apiData.email || currentUser.email);
        // if (apiData.mobile) {
        //   localStorage.setItem('userMobile', apiData.mobile);
        // }
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    }
  };

  const login = async ({ apiData, email = "", mobile = "" }: LoginProps): Promise<boolean> => {
    setIsLoading(true);

    try {
      // If API data is provided, use it for authentication
      if (apiData && (apiData.user?.id || apiData.userId) && (apiData.token || apiData.accessToken)) {
        const authToken = apiData.accessToken || apiData.token;

        // Create user object from API data
        const userData: User = {
          id: apiData.user?.id || apiData.userId,
          name: apiData.fullName || apiData.name || 'User',
          email: email || apiData.email || '',
          mobile: mobile || apiData.mobile || '',
        };

        // Store session in localStorage
        // localStorage.setItem('token', authToken);
        // localStorage.setItem('authToken', authToken);
        // localStorage.setItem('accessToken', authToken);
        // localStorage.setItem('userEmail', userData.email);
        // localStorage.setItem('userName', userData.name);
        // localStorage.setItem('userId', apiData.userId);

        // // Add login timestamp for grace period handling in api-client
        // localStorage.setItem('loginTimestamp', Date.now().toString());
        // if (userData.mobile) {
        //   localStorage.setItem('userMobile', userData.mobile);
        // }
        // if (apiData.role) {
        //   localStorage.setItem('role', apiData.role);
        // }

        // // Set cookies for middleware to access
        // document.cookie = `auth-token=${authToken}; path=/; max-age=2592000`;

        // setUser(userData);

        // Fetch real user profile and wait for it
        await fetchUserProfile(authToken, userData);

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

  const logout = async () => {
    // Set logging out state immediately to hide UI
    console.log("Logging out...");
    try {
      setIsLoggingOut(true);
      setUser(null);

      // Clear all localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('loginTimestamp');
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

      // ✅ IMPORTANT: let NextAuth clear its cookies
      await signOut({ redirect: true, callbackUrl: "/login" });
      console.log("Signed out from NextAuth");

      // Use setTimeout to ensure state is updated before redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 0);
    } catch (er) {
      console.log("logout error", er)
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (userData) {
      // const updatedUser = { ...user, ...userData };
      // setUser(updatedUser);
      setUser((prev) => {
        // If there is no user, we can't perform a partial update
        if (!prev) return null;

        // Return a complete User object
        return { ...prev, ...userData } as User;
      });
      // Update localStorage if needed
      // if (userData.name) {
      //   localStorage.setItem('userName', userData.name);
      // }
      // if (userData.email) {
      //   localStorage.setItem('userEmail', userData.email);
      // }
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    login,
    logout,
    isLoading,
    isLoggingOut,
    updateUser,
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
