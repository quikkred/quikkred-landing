"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'USER' | 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'COLLECTION_AGENT' | 'UNDERWRITER' | 'SUPPORT_AGENT' | 'FINANCE_MANAGER' | 'RISK_ANALYST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
  team?: string;
  permissions: string[];
  fullName?: string;
  mobile?: string;
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
  login: (email: string, password: string, role?: UserRole, apiData?: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  switchRole: (role: UserRole) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for different roles
const MOCK_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'admin_001',
    name: 'Admin User',
    email: 'admin@Quikkred.com',
    role: 'ADMIN',
    permissions: ['*'] // Admin has all permissions
  },
  SUPER_ADMIN: {
    id: 'super_admin_001',
    name: 'Super Admin',
    email: 'superadmin@Quikkred.com',
    role: 'SUPER_ADMIN',
    permissions: ['*'] // Super Admin has all permissions
  },
  USER: {
    id: 'user_001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'USER',
    permissions: ['view_profile', 'apply_loan', 'view_loans', 'make_payments']
  },
  CUSTOMER: {
    id: 'customer_001',
    name: 'Customer User',
    email: 'customer@example.com',
    role: 'CUSTOMER',
    permissions: ['view_profile', 'apply_loan', 'view_loans', 'make_payments']
  },
  UNDERWRITER: {
    id: 'underwriter_001',
    name: 'Priya Sharma',
    email: 'priya.sharma@Quikkred.com',
    role: 'UNDERWRITER',
    branch: 'Mumbai Central',
    team: 'Credit Team A',
    permissions: ['view_leads', 'manage_leads', 'process_applications', 'underwriting']
  },
  FINANCE_MANAGER: {
    id: 'finance_manager_001',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@Quikkred.com',
    role: 'FINANCE_MANAGER',
    branch: 'Mumbai Central',
    team: 'Finance',
    permissions: ['manage_team', 'approve_loans', 'view_analytics', 'manage_branch']
  },
  COLLECTION_AGENT: {
    id: 'collection_001',
    name: 'Vijay Kumar',
    email: 'vijay.kumar@Quikkred.com',
    role: 'COLLECTION_AGENT',
    branch: 'Mumbai Central',
    team: 'Recovery Team A',
    permissions: ['view_overdue', 'manage_recovery', 'contact_customers', 'schedule_visits']
  },
  SUPPORT_AGENT: {
    id: 'support_001',
    name: 'Deepika Rao',
    email: 'deepika.rao@Quikkred.com',
    role: 'SUPPORT_AGENT',
    branch: 'Mumbai Central',
    team: 'Customer Support',
    permissions: ['view_tickets', 'resolve_issues', 'customer_communication']
  },
  RISK_ANALYST: {
    id: 'risk_001',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@Quikkred.com',
    role: 'RISK_ANALYST',
    branch: 'Mumbai Central',
    team: 'Risk & Compliance',
    permissions: ['risk_analysis', 'fraud_detection', 'compliance_monitoring']
  }
};

// Role-based route mapping
export const ROLE_ROUTES: Record<UserRole, string> = {
  ADMIN: '/admin',
  SUPER_ADMIN: '/admin',
  USER: '/user',
  CUSTOMER: '/user',
  UNDERWRITER: '/underwriter',
  FINANCE_MANAGER: '/finance-manager',
  COLLECTION_AGENT: '/collection-agent',
  SUPPORT_AGENT: '/support-agent',
  RISK_ANALYST: '/risk-analyst'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole') as UserRole;
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (token && storedRole && MOCK_USERS[storedRole]) {
      // Create user object from stored data instead of mock
      const userData: User = {
        ...MOCK_USERS[storedRole],
        id: storedUserId || MOCK_USERS[storedRole].id,
        name: storedUserName || MOCK_USERS[storedRole].name,
        email: storedUserEmail || MOCK_USERS[storedRole].email,
      };

      setUser(userData);

      // Fetch real user profile for CUSTOMER/USER roles
      // Only fetch if we have a real token (not mock) and role is CUSTOMER/USER
      if ((storedRole === 'CUSTOMER' || storedRole === 'USER') && token && !token.startsWith('mock_token_')) {
        fetchUserProfile(token, userData);
      }
    }

    setIsLoading(false);
  }, []);

  const fetchUserProfile = async (token: string, currentUser: User) => {
    console.log('🔵 Fetching user profile from API...');
    try {
      const response = await fetch('https://api.bluechipfinmax.com/api/customer/profile', {
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

        // Use fullName directly from API (not nested under profile)
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

  const login = async (email: string, password: string, role?: UserRole, apiData?: any): Promise<boolean> => {
    setIsLoading(true);

    try {
      // If API data is provided, use it for authentication
      if (apiData && apiData.userId && apiData.token && apiData.role) {
        const userRole = apiData.role as UserRole;

        // Create user object from API data
        const userData: User = {
          id: apiData.userId,
          name: apiData.mobile || email,
          email: email,
          mobile: apiData.mobile,
          role: userRole,
          permissions: userRole === 'CUSTOMER' || userRole === 'USER'
            ? ['view_profile', 'apply_loan', 'view_loans', 'make_payments']
            : userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
            ? ['*']
            : []
        };

        // Store session in localStorage and cookies
        localStorage.setItem('token', apiData.token);
        localStorage.setItem('authToken', apiData.token);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userId', apiData.userId);
        if (apiData.mobile) {
          localStorage.setItem('userMobile', apiData.mobile);
        }

        // Set cookies for middleware to access
        document.cookie = `auth-token=${apiData.token}; path=/; max-age=2592000`;
        document.cookie = `user-role=${userRole}; path=/; max-age=2592000`;

        setUser(userData);

        // Fetch real user profile for CUSTOMER/USER roles
        if (userRole === 'CUSTOMER' || userRole === 'USER') {
          fetchUserProfile(apiData.token, userData);
        }

        // Redirect to appropriate dashboard
        router.push(ROLE_ROUTES[userRole]);

        return true;
      }

      // Fallback to mock authentication for demo/testing
      await new Promise(resolve => setTimeout(resolve, 1000));

      let userRole: UserRole;

      if (role) {
        userRole = role;
      } else if (email.includes('superadmin')) {
        userRole = 'SUPER_ADMIN';
      } else if (email.includes('admin')) {
        userRole = 'ADMIN';
      } else if (email.includes('underwriter') || email.includes('agent')) {
        userRole = 'UNDERWRITER';
      } else if (email.includes('finance') || email.includes('manager')) {
        userRole = 'FINANCE_MANAGER';
      } else if (email.includes('collection')) {
        userRole = 'COLLECTION_AGENT';
      } else if (email.includes('support')) {
        userRole = 'SUPPORT_AGENT';
      } else if (email.includes('risk')) {
        userRole = 'RISK_ANALYST';
      } else {
        userRole = 'USER';
      }

      const userData = MOCK_USERS[userRole];

      // Store session in localStorage and cookies
      const token = 'mock_token_' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userId', userData.id);

      // Set cookies for middleware to access
      document.cookie = `auth-token=${token}; path=/; max-age=2592000`;
      document.cookie = `user-role=${userRole}; path=/; max-age=2592000`;

      setUser(userData);

      // Redirect to appropriate dashboard
      router.push(ROLE_ROUTES[userRole]);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');

    // Clear cookies
    document.cookie = 'auth-token=; path=/; max-age=0';
    document.cookie = 'user-role=; path=/; max-age=0';

    setUser(null);
    router.push('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true; // Admin has all permissions
    return user.permissions.includes(permission);
  };

  const switchRole = (role: UserRole) => {
    if (MOCK_USERS[role]) {
      const userData = MOCK_USERS[role];
      localStorage.setItem('userRole', role);
      setUser(userData);
      router.push(ROLE_ROUTES[role]);
    }
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
    hasPermission,
    switchRole,
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

// Hook to check if user can access a specific route
export function useRouteAccess() {
  const { user } = useAuth();
  const router = useRouter();

  const checkAccess = (requiredRole: UserRole, currentPath: string): boolean => {
    if (!user) {
      router.push('/login');
      return false;
    }

    if (user.role !== requiredRole) {
      router.push(ROLE_ROUTES[user.role]);
      return false;
    }

    return true;
  };

  return { checkAccess };
}