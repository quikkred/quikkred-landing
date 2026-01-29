// Central export file for all API services
export { apiClient, type ApiResponse } from './api-client';
export { authService } from './auth.service';
export { loansService } from './loans.service';
export { usersService } from './users.service';
export { adminService } from './admin.service';
export { paymentsService } from './payments.service';
export { aiService } from './ai.service';
export { notificationsService } from './notifications.service';
export { supportService } from './support.service';
export { customerService } from './customer.service';
export { upiAutopayService } from './upi-autopay.service';
export { reviewService } from './review.service';

// Export all types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.service';

export type {
  LoanApplication,
  EMICalculationRequest,
  EMICalculationResponse,
  EligibilityCheckRequest,
  LoanProduct,
  Loan,
  PrepaymentCalculation,
  LoanRecommendation,
} from './loans.service';

export type {
  UserProfile,
  KYCDocument,
  BankAccount,
  CreditScoreResponse,
  UpdateProfileRequest,
  EmploymentDetails,
} from './users.service';

export type {
  DashboardMetrics,
  AdminUser,
  LoanManagement,
  UserManagementRequest,
  LoanApprovalRequest,
  SystemConfiguration,
  RiskAnalytics,
} from './admin.service';

export type {
  PaymentInitiation,
  PaymentResponse,
  Transaction,
  PaymentVerification,
  RefundRequest,
  AutoPayMandate,
  PaymentSchedule,
} from './payments.service';

export type {
  CreditScoreAnalysis,
  FraudCheckResult,
  SpendingAnalysisRequest,
  SpendingAnalysisResponse,
  CollectionIntelligence,
  DocumentAnalysis,
  BehaviorAnalytics,
  LoanRecommendationAI,
  AILoanRecommendation,
  RiskAssessment,
} from './ai.service';

export type {
  Notification,
  NotificationPreferences,
  NotificationStats,
} from './notifications.service';

export type {
  SupportTicket,
  TicketMessage,
  CreateTicketRequest,
  FAQ,
  SupportAgent,
  ChatMessage,
} from './support.service';

export type {
  DashboardData,
  CustomerProfile,
  LoanApplication as CustomerLoanApplication,
  ApplicationPagination,
  BankAccount as CustomerBankAccount,
  CustomerDocument,
  CustomerNotification,
  LoanProduct as CustomerLoanProduct,
  SupportTicket as CustomerSupportTicket,
  LoanStatus,
} from './customer.service';

export type {
  AutopaySetupRequest,
  AutopaySetupResponse,
  AutopayStatus,
  MandateDetails,
} from './upi-autopay.service';

export type {
  CreateReviewRequest,
  CreateReviewResponse,
} from './review.service';