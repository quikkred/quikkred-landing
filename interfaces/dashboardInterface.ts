import { ApplicationStatus } from "./applicationInterface";

export interface LoanSummary {
    productName: string;
    _id: string;
    loanNumber: string;
    principalAmount: number;
}

export interface ActiveLoanDetails {
    _id: string;
    loanNumber: string;
    tenure: number;
    tenureUnit: string;
    emiAmount: number;
    maturityDate: string;
    firstDueDate: string;
    nextDueDate: string;
    status: string;
    overdueCount: number;
    lateCharges: number;
    lateChargeInterest: number;
    paidAmount: number;
    totalEMIsPaid: number;
    installment: number;
    appliedDate?: string;
    applicationNumber?: string;
    disbursementDate?: string;
    loanCreatedDate?: string;
}

export interface DashboardData {
    customerId: string;
    oldApplication: boolean;
    oldApplicationNumber: string | null;
    oldApplicationDate: string | null;
    applicationStatus: ApplicationStatus;
    isBasicDetailsFilled: boolean;
    isKycDetailsFilled: boolean;
    isBankDetailsFilled: boolean;
    isSubmit: boolean;
    activeLoan: boolean;
    loans: LoanSummary[];
}

export interface PaymentResponse {
    success: boolean;
    message: string;
    data: {
        transactionId: string;
        loanNumber: string;
        paymentAmount: number;
        emisPaid: number;
        overdueCleared: number;
        lateChargesPaid: number;
        remainingOutstanding: number;
        remainingEMIs: number;
        currentStatus: string;
        nextDueDate: string;
        customerBalance: number;
        paymentDetails: {
            principalPaid: number;
            interestPaid: number;
            totalPaid: number;
        };
    };
}

export interface PaymentProof {
    _id: string;
    loanNumber: string;
    amountPaid: number;
    transactionReference: string;
    paymentDate: string;
    paymentMode: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    proofImage?: { url: string };
    remarks?: string;
    rejectionReason?: string;
    verifiedAt?: string;
    createdAt: string;
}

export interface ReapplyEligibility {
    isEligible: boolean;
    maxLoanAmount: number;
    previousLoanNumber?: string;
    previousLoanClosedAt?: string;
    approvedAt?: string;
    expiresAt?: string;
    isExpired?: boolean;
}