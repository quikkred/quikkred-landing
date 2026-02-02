export interface StorageApplicationForm {
    applicationNumber: string;
    applicationId: string;

    status: "Approve" | "Reject" | "Proceed to Bank"; // extend if backend adds more
    reason: string;

    loanAmount: number;
    interestRate: number;

    tenure: number;
    tenureUnit: "Days" | "Months" | "Years";
    totalDays: number;

    perDayInterest: number;
    totalInterest: number;
    totalRepayment: number;
    emiAmount: number;

    processingFee: number;
    gstOnProcessingFee: number;

    netDisbursalAmount: number;

    dueDate: string; // ISO string (can convert to Date when needed)

    processingPercent: number;
    gstOnProcessingPercent: number;
}