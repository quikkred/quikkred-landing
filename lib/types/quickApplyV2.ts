/**
 * Quick Apply V2 Types
 * Simplified 2-step flow before approval
 */

// ============================================
// FORM DATA TYPES
// ============================================

export interface QuickApplyV2FormData {
    // Pre-Apply (Auto from IP)
    ipData: IPData | null;

    // Page 1: Basic Details
    customerId: string;
    upiAutoPayStatus?: boolean;
    mobile: string;
    otp: string;
    mobileVerified: boolean;
    pincode: string;
    city: string;
    state: string;
    productId?: string; // Loan product ID
    loanAmount: number;
    tenure: number; // in days: 7, 15, 30
    employmentType: 'SALARIED' | 'SELF-EMPLOYED';
    monthlyIncome: string;
    salaryDate: number; // 1-31
    brePulled: boolean;
    breStatus: string;
    companyName: string;
    tenureUnit: string;
    gstOnProcessingFee: number;
    netDisbursalAmount: number;

    interestRate: number,
    totalInterest: number,
    processingFee: number,
    totalRepayment: number,

    // Page 2: PAN & Bank
    pan: string;
    panVerified: boolean;
    panData: PANData | null;
    firstName: string;
    lastName: string;
    fullName: string; // From PAN
    dob: string; // From PAN
    ifsc: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    bankVerified: boolean;

    // Consents
    termsConsent: boolean;
    bureauConsent: boolean;

    // Post-Approval
    email: string;
    emailVerified: boolean;
    aadhaar: string;
    aadhaarVerified: boolean;
    aadhaarData: AadhaarData | null;
    selfie: File | string | null;
    selfieVerified: boolean;
    selfieData: SelfieData | null;
    eSignCompleted: boolean;
    bsaInitiated?: boolean; // Bank Statement Analysis initiated

    // References (Post-Approval)
    reference1Name: string;
    reference1Mobile: string;
    reference1Relationship: string;
    reference2Name: string;
    reference2Mobile: string;
    reference2Relationship: string;
}

export interface IPData {
    ip: string;
    pincode: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    isp?: string;
    vpnDetected: boolean;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PANData {
    panNumber: string;
    fullName: string;
    dateOfBirth: string;
    gender?: string;
    maskedAadhaar?: string;
    address?: string;
}

export interface AadhaarData {
    name: string;
    dob: string;
    gender: string;
    address: string;
    photo?: string; // Base64 photo from Aadhaar
    maskedAadhaar?: string;
}

export interface SelfieData {
    preview: string;
    verified: boolean;
}

// ============================================
// APPLICATION FLOW TYPES
// ============================================

export type ApplicationStage =
    | 'IP_CHECK'
    | 'PAGE_1'
    | 'PAGE_2'
    | 'PAGE_3'
    | 'PAGE_4'
    | 'BRE_PROCESSING'
    | 'APPROVED'
    | 'REJECTED'
    | 'POST_APPROVAL_BANK'
    | 'POST_APPROVAL_AADHAAR'
    | 'POST_APPROVAL_SELFIE'
    | 'POST_APPROVAL_ESIGN'
    | 'BANK_VERIFICATION'
    | 'DISBURSEMENT'
    | 'COMPLETED'
    | 'DROPPED';

export interface ApplicationState {
    stage: ApplicationStage;
    customerId: string | null;
    applicationId: string | null;
    applicationNumber: string | null;

    // BRE Decision
    breStatus: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | null;
    breDecision: BREDecision | null;

    // Approval Details
    approvalDetails: ApprovalDetails | null;

    // Timestamps
    stageTimestamps: Record<ApplicationStage, Date | null>;
}

export interface BREDecision {
    status: 'APPROVED' | 'REJECTED' | 'REVIEW';
    approvedAmount?: number;
    maxApprovedAmount?: number;
    interestRate?: number;
    tenure?: number;
    rejectionReason?: string;
    decisionDate: string;
}

export interface ApprovalDetails {
    loanAmount: number;
    approvedAmount: number;
    interestRate: number; // 1% per day
    tenure: number; // in days
    processingFee: number; // 10% of loan amount
    gstOnProcessingFee: number; // 18% of Platform Fee
    totalInterest: number;
    totalRepayment: number;
    netDisbursalAmount: number;
    dueDate: string;
    emiAmount?: number;
}

// ============================================
// LOAN CALCULATION
// ============================================

export interface LoanCalculation {
    loanAmount: number;
    tenure: number; // days
    interestRate: number; // 1% per day
    processingFeePercent: number; // 10%
    gstPercent: number; // 18%

    // Calculated
    processingFee: number;
    gstOnProcessingFee: number;
    totalDeductions: number;
    netDisbursalAmount: number;
    totalInterest: number;
    totalRepayment: number;
    dueDate: string;
}

// ============================================
// TRACKING TYPES
// ============================================

export interface TrackingEvent {
    event: string;
    stage: ApplicationStage;
    data?: Record<string, any>;
    timestamp: number;
}

export interface DropOffData {
    stage: ApplicationStage;
    lastField?: string;
    mobile?: string;
    timeSpentSeconds: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface OTPResponse {
    success: boolean;
    message: string;
    data?: {
        otpSent: boolean;
        expiresIn: number; // seconds
    };
}

export interface PANVerifyResponse {
    success: boolean;
    message: string;
    data?: PANData;
}

export interface AadhaarOTPResponse {
    success: boolean;
    message: string;
    data?: {
        refId: string;
        otpSent: boolean;
    };
}

export interface AadhaarVerifyResponse {
    success: boolean;
    message: string;
    data?: AadhaarData;
}

export interface BankVerifyResponse {
    success: boolean;
    message: string;
    data?: {
        verified: boolean;
        accountHolderName: string;
        bankName: string;
    };
}

export interface LoanSubmitResponse {
    success: boolean;
    message: string;
    data?: {
        customerId: string;
        applicationId: string;
        applicationNumber: string;
        status: 'PENDING' | 'PROCESSING';
    };
}

export interface BREStatusResponse {
    success: boolean;
    status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
    message?: string;
    data?: BREDecision;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface PageProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
    onNext: () => void;
    onBack?: () => void;
    loading?: boolean;
}

export interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepLabels?: string[];
}
