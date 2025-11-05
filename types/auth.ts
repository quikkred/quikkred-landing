/**
 * Authentication Types
 * Type definitions for authentication and authorization
 */

export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'UNDERWRITER'
  | 'COLLECTION_AGENT'
  | 'FINANCE_MANAGER'
  | 'RISK_ANALYST'
  | 'SUPPORT_AGENT';

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION'
  | 'BLOCKED';

export interface AuthUser {
  id: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
  role?: UserRole;
}

export interface RegisterData {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  userType?: 'CUSTOMER' | 'PARTNER';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: AuthUser;
    token: string;
    refreshToken?: string;
  };
  error?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

export interface SessionData {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

// WebSocket Auth Types
export interface WebSocketAuthMessage {
  type: 'auth' | 'ping' | 'pong';
  token?: string;
  userId?: string;
  timestamp: number;
}

export interface WebSocketSession {
  userId: string;
  socketId: string;
  role: UserRole;
  connectedAt: Date;
  lastPing?: Date;
}