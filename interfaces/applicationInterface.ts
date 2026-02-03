import { User } from "@/contexts/AuthContext";

/* -------------------- DOCUMENT -------------------- */
export interface ApplicationDocument {
    documentId: {
        _id: string;
        s3Key: string;
        s3URL: string;
        status: "UPLOADED" | "VERIFIED" | "REJECTED";
        uploadedAt: string;
    };
    documentType: string;
    documentName: string;
}

/* -------------------- AUTOPAY NOTIFICATION -------------------- */
export interface AutopayNotification {
    channel: "EMAIL" | "SMS" | "WHATSAPP";
    sentAt: string;
    status: "SENT" | "FAILED";
    _id: string;
}

/* -------------------- DISBURSEMENT BANK -------------------- */
export interface DisbursementBankAccount {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
}

/* -------------------- BRE ERROR -------------------- */
export interface ExternalApiError {
    api: string;
    message: string;
    error: string;
    at: string;
}

export interface ExternalApiResponseErr {
    [key: string]: ExternalApiError;
}

/* -------------------- FINAL DECISION -------------------- */
export interface FinalDecision {
    Decision: "Approve" | "Reject";
    LoanAmount: number | null;
    RulesEvaluation: Record<string, boolean>;
    DecisionReason: string;
    version: string;
    rule_engine_name: string;
}

/* -------------------- MAIN APPLICATION -------------------- */
export interface ApplicationInterface {
    _id: string;

    customerId: User; // 👈 imported interface

    applicationNumber: string;

    status: "PENDING" | "APPROVED" | "REJECTED";

    isSubmit: boolean;
    isDeleted: boolean;

    requestedLoanAmount: number;
    approvedLoanAmount: number;
    breApprovedLoanAmount: number;

    tenure: number;
    interestRate: number;

    emiAmount: number;
    totalInterest: number;
    totalRepayment: number;

    processingFee: number;
    gstOnProcessingFee: number;
    netDisbursalAmount: number;

    cibilScore: number;
    incomeScore: number;
    riskScore: number;
    fraudScore: number;
    autoDecisionScore: number;

    autopayStatus: "created" | "active" | "failed" | "cancelled";
    emandateCancelled: boolean;

    autopayAuthUrl?: string;
    autopaySetupDate?: string;

    razorpayPlanId?: string;
    razorpaySubscriptionId?: string;

    autopayNotificationsSent: AutopayNotification[];

    documents: ApplicationDocument[];

    paymentDetails: any[]; // refine later if schema available

    disbursementStatus: "NOT_PAYMENT" | "PAID" | "FAILED";

    disbursementBankAccount?: DisbursementBankAccount;

    externalApiResponseErr?: ExternalApiResponseErr;

    finalDecision?: FinalDecision;

    lastModifiedBy: string;

    createdAt: string;
    updatedAt: string;

    __v: number;
}
