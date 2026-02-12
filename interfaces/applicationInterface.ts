/* -------------------- DOCUMENT -------------------- */
export interface ApplicationDocument {
    documentId: string;
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

/* -------------------- VERIFICATION CHECKLIST -------------------- */
export interface VerificationChecklist {
    identityVerification: {
        panVerified: boolean;
        aadhaarVerified: boolean;
        bankAccountVerified: boolean;
        agreementSigned: boolean;
        faceMatchDone: boolean;
        brePulled: boolean;
        bsaPulled: boolean;
        bsaToBrePulled: boolean;
        manualBrePulled: boolean;
    };
}

/* -------------------- BRE HISTORY -------------------- */
export interface BreHistory {
    brePulled: boolean;
    brePulledAt: string;
    breStatus: "APPROVED" | "REJECTED" | "PENDING";
}

/* -------------------- FINFACTOR -------------------- */
export interface FinfactorDetails {
    transactions: any[]; // refine when schema is available
}

/* -------------------- MAIN APPLICATION -------------------- */
export interface ApplicationInterface {
    _id: string;

    applicationNumber: string;
    customerId: string;
    productId: string;

    status: "PENDING" | "APPROVED" | "REJECTED" | "PROCEED TO BANK";
    priority: "LOW" | "MEDIUM" | "HIGH";

    isSubmit: boolean;
    isDeleted: boolean;

    requestedLoanAmount: number;
    breApprovedLoanAmount: number;
    approvedLoanAmount: number;

    tenure: number;
    tenureUnit: "Days" | "Months";
    interestRate: number;

    emiAmount: number;
    totalInterest: number;
    totalRepayment: number;

    processingFee: number;
    processingPercent: number;
    gstOnProcessingFee: number;
    gstOnProcessingPercent: number;

    netDisbursalAmount: number;

    cibilScore: number;
    incomeScore: number;
    riskScore: number;
    fraudScore: number;
    autoDecisionScore: number;

    paymentDetails: any[];

    disbursementStatus: "NOT_PAYMENT" | "PAID" | "FAILED";
    disbursementBankAccount: DisbursementBankAccount;

    autopayStatus: "created" | "active" | "failed" | "cancelled" | null;
    emandateCancelled: boolean;
    autopayNotificationsSent: AutopayNotification[];

    collectionRetryCount: number;

    verificationChecklist: VerificationChecklist;
    breHistory: BreHistory;
    finfactor: FinfactorDetails;

    documents: ApplicationDocument[];

    statusHistory: any[];
    internalNotes: any[];

    appliedDate: string;
    createdAt: string;
    updatedAt: string;

    __v: number;
}