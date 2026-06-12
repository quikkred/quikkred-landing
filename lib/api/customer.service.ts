// Customer Service - Centralized API service for Redux actions
import getToken from '../getToken';
import { apiClient, ApiResponse } from './api-client';
import { API_BASE_URL } from '@/lib/config';

// Dashboard
export interface DashboardData {
  totalLoans?: number;
  activeLoans?: number;
  totalDisbursed?: number;
  upcomingEMI?: any;
  recentApplications?: any[];
  notifications?: any[];
}

// Profile
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  dob?: string;
  panCard?: string;
  aadhaarCard?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  createdAt?: string;
  // Ledger (daily payment) eligibility lives on the customer profile.
  isLedgerEligible?: boolean;
}

// Application
export interface LoanApplication {
  id: string;
  applicationNumber: string;
  loanType: string;
  requestedAmount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApplicationPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// Bank Account
export interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolderName: string;
  accountType: string;
  isPrimary?: boolean;
  isVerified?: boolean;
}

// Document
export interface CustomerDocument {
  id: string;
  documentType: string;
  documentNumber?: string;
  fileName: string;
  fileUrl: string;
  status: string;
  uploadedAt: string;
  verifiedAt?: string;
}

// Notification
export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

// Loan Product
export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  interestRate: number;
  processingFee: number;
  features?: string[];
  isActive: boolean;
}

// Support Ticket
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

// Loan Status
export interface LoanStatus {
  loanNumber: string;
  status: string;
  amount: number;
  disbursedAmount?: number;
  outstandingAmount?: number;
  emiAmount?: number;
  nextDueDate?: string;
}

class CustomerService {
  // ==================== Dashboard ====================
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return apiClient.get<DashboardData>('/api/customer/dashboard', true);
  }

  // ==================== Profile ====================
  async getProfile(): Promise<ApiResponse<CustomerProfile>> {
    return apiClient.get<CustomerProfile>('/api/customer/get', true);
  }

  async updateProfile(data: Partial<CustomerProfile>): Promise<ApiResponse<CustomerProfile>> {
    return apiClient.put<CustomerProfile>('/api/customer/update', data, true);
  }

  // ==================== Applications ====================
  async getApplications(page: number = 1, limit: number = 10): Promise<ApiResponse<{
    data: LoanApplication[];
    pagination: ApplicationPagination;
  }>> {
    return apiClient.get(`/api/application/loan/get?page=${page}&limit=${limit}`, true);
  }

  async getNewApplications(): Promise<ApiResponse<LoanApplication[]>> {
    return apiClient.get<LoanApplication[]>('/api/application/loan/new', true);
  }

  async getApplicationById(id: string): Promise<ApiResponse<LoanApplication>> {
    return apiClient.get<LoanApplication>(`/api/application/loan/${id}`, true);
  }

  // ==================== Bank Accounts ====================
  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get<BankAccount[]>('/api/bankAccount/getAll', true);
  }

  async addBankAccount(data: Omit<BankAccount, 'id'>): Promise<ApiResponse<BankAccount>> {
    return apiClient.post<BankAccount>('/api/bankAccount/add', data, true);
  }

  async updateBankAccount(id: string, data: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    return apiClient.put<BankAccount>(`/api/bankAccount/update/${id}`, data, true);
  }

  async deleteBankAccount(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/bankAccount/delete/${id}`, true);
  }

  async setPrimaryBankAccount(id: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/api/bankAccount/setPrimary/${id}`, {}, true);
  }

  // ==================== Documents ====================
  async getDocuments(): Promise<ApiResponse<{ documents: CustomerDocument[] }>> {
    return apiClient.get('/api/document/get', true);
  }

  async uploadDocument(formData: FormData): Promise<ApiResponse<CustomerDocument>> {
    // For file uploads, we need to use fetch directly without JSON content-type
    const token = await getToken();

    const response = await fetch(`${API_BASE_URL}/api/document/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return response.json();
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/document/delete/${id}`, true);
  }

  // ==================== Notifications ====================
  async getNotifications(): Promise<ApiResponse<CustomerNotification[]>> {
    return apiClient.get<CustomerNotification[]>('/api/notification/getAll', true);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/api/notification/read/${id}`, {}, true);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return apiClient.patch('/api/notification/readAll', {}, true);
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/notification/delete/${id}`, true);
  }

  // ==================== Loan Products ====================
  async getLoanProducts(): Promise<ApiResponse<LoanProduct[]>> {
    return apiClient.get<LoanProduct[]>('/api/loanProduct/getAll', true);
  }

  async getLoanProductById(id: string): Promise<ApiResponse<LoanProduct>> {
    return apiClient.get<LoanProduct>(`/api/loanProduct/get/${id}`, true);
  }

  // ==================== Support Tickets ====================
  async getSupportTickets(): Promise<ApiResponse<SupportTicket[]>> {
    return apiClient.get<SupportTicket[]>('/api/supportTicket/getAll', true);
  }

  async createSupportTicket(data: {
    subject: string;
    description: string;
    category: string;
    priority?: string;
  }): Promise<ApiResponse<SupportTicket>> {
    return apiClient.post<SupportTicket>('/api/supportTicket/create', data, true);
  }

  async getSupportTicketById(id: string): Promise<ApiResponse<SupportTicket>> {
    return apiClient.get<SupportTicket>(`/api/supportTicket/get/${id}`, true);
  }

  async closeSupportTicket(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/api/supportTicket/close/${id}`, {}, true);
  }

  // ==================== Loan Status ====================
  async getLoanStatus(params: { loanNumber?: string; mobile?: string }): Promise<ApiResponse<LoanStatus>> {
    const queryParams = new URLSearchParams();
    if (params.loanNumber) queryParams.append('loanNumber', params.loanNumber);
    if (params.mobile) queryParams.append('mobile', params.mobile);

    return apiClient.get<LoanStatus>(`/api/loans/status?${queryParams.toString()}`, true);
  }

  async getActiveLoan(loanNumber: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/loans/active/${loanNumber}`, true);
  }
}

export const customerService = new CustomerService();
