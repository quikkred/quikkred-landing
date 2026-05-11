import { apiClient, ApiResponse } from './api-client';

export interface AutopaySetupRequest {
  customerId: string;
  loanId: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_presented';
  vpa?: string; // UPI VPA (e.g., user@upi)
  startDate?: string;
  endDate?: string;
}

export interface AutopaySetupResponse {
  subscriptionId: string;
  shortUrl: string;
  status: string;
  authLink?: string;
  message?: string;
}

export interface AutopayStatus {
  subscriptionId: string;
  status: 'created' | 'authenticated' | 'active' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'expired';
  customerId?: string;
  loanId?: string;
  amount: number;
  frequency: string;
  nextDebitDate?: string;
  totalDebits?: number;
  successfulDebits?: number;
  failedDebits?: number;
  currentStart?: string;
  currentEnd?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MandateDetails {
  mandateId: string;
  status: string;
  bankAccount?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  vpa?: string;
  maxAmount: number;
  frequency: string;
  startDate: string;
  endDate?: string;
}

class UpiAutopayService {
  // Setup UPI Autopay for a loan
  async setupAutopay(data: AutopaySetupRequest): Promise<ApiResponse<AutopaySetupResponse>> {
    return apiClient.post<AutopaySetupResponse>('/api/upi/autoPay/create', data, true);
  }

  // Check autopay status
  async checkAutopayStatus(subscriptionId: string): Promise<ApiResponse<AutopayStatus>> {
    return apiClient.get<AutopayStatus>(`/api/upi/upiAutopay/status/${subscriptionId}`, true);
  }

  // Get all autopay subscriptions for a customer
  async getMyAutopaySubscriptions(): Promise<ApiResponse<AutopayStatus[]>> {
    return apiClient.get<AutopayStatus[]>('/api/upi/autoPay/my-subscriptions', true);
  }

  // Get autopay subscription for a specific loan
  async getAutopayForLoan(loanId: string): Promise<ApiResponse<AutopayStatus | null>> {
    return apiClient.get<AutopayStatus | null>(`/api/upi/autoPay/loan/${loanId}`, true);
  }

  // Cancel autopay subscription
  async cancelAutopay(subscriptionId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(`/api/upi/autoPay/cancel/${subscriptionId}`, {}, true);
  }

  // Pause autopay subscription
  async pauseAutopay(subscriptionId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(`/api/upi/autoPay/pause/${subscriptionId}`, {}, true);
  }

  // Resume autopay subscription
  async resumeAutopay(subscriptionId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(`/api/upi/autoPay/resume/${subscriptionId}`, {}, true);
  }

  // Get mandate details
  async getMandateDetails(subscriptionId: string): Promise<ApiResponse<MandateDetails>> {
    return apiClient.get<MandateDetails>(`/api/upi/autoPay/mandate/${subscriptionId}`, true);
  }
}

export const upiAutopayService = new UpiAutopayService();
