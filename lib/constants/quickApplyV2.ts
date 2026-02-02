/**
 * Quick Apply V2 Constants
 * Simplified 2-step flow configuration
 */

import { QuickApplyV2FormData, LoanCalculation } from "../types/quickApplyV2";

// ============================================
// LOAN CONFIGURATION (From CLAUDE.md)
// ============================================

export const LOAN_CONFIG = {
    // Amount Range
    MIN_AMOUNT: 5000,
    MAX_AMOUNT: 25000,
    DEFAULT_AMOUNT: 10000,

    // Tenure Options (in days)
    TENURE_OPTIONS: [7, 15, 30] as const,
    DEFAULT_TENURE: 15,

    // Fee Structure (CRITICAL - From CLAUDE.md)
    PROCESSING_FEE_PERCENT: 10, // 10% of loan amount
    GST_PERCENT: 18, // 18% on processing fee
    INTEREST_RATE_PER_DAY: 1, // 1% per day (NOT per month/annum)
};

// ============================================
// EMPLOYMENT & SALARY
// ============================================

export const EMPLOYMENT_TYPES = [
    { value: 'SALARIED', label: 'Salaried' },
    { value: 'SELF-EMPLOYED', label: 'Self-Employed' },
] as const;

// Salary date options (1-31)
export const SALARY_DATES = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
}));

// ============================================
// VALIDATION PATTERNS
// ============================================

export const VALIDATION = {
    MOBILE: /^[6-9]\d{9}$/,
    OTP: /^\d{6}$/,
    PINCODE: /^\d{6}$/,
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    AADHAAR: /^\d{12}$/,
    IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    ACCOUNT_NUMBER: /^\d{9,18}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NAME: /^[a-zA-Z\s.'-]+$/,
};

// ============================================
// TIMER DURATIONS
// ============================================

export const TIMERS = {
    OTP_RESEND: 60, // seconds
    OTP_EXPIRY: 300, // 5 minutes
    REVERIFY_COOLDOWN: 30, // seconds
    BRE_POLL_INTERVAL: 3000, // 3 seconds
    BRE_MAX_WAIT: 60000, // 60 seconds
    REDIRECT_COUNTDOWN: 5, // seconds
};

// ============================================
// RELATIONSHIP TYPES (For references)
// ============================================

export const RELATIONSHIP_TYPES = [
    { value: 'FATHER', label: 'Father' },
    { value: 'MOTHER', label: 'Mother' },
    { value: 'SPOUSE', label: 'Spouse' },
    { value: 'BROTHER', label: 'Brother' },
    { value: 'SISTER', label: 'Sister' },
    { value: 'FRIEND', label: 'Friend' },
    { value: 'COLLEAGUE', label: 'Colleague' },
    { value: 'RELATIVE', label: 'Relative' },
] as const;

// ============================================
// BLACKLISTED STATES (From Backend)
// ============================================

export const BLACKLISTED_STATES = [
    // Andaman & Nicobar
    'andaman & nicobar islands',
    'andaman and nicobar islands',
    'andaman',
    'nicobar',

    // Seven Sister States (Northeast)
    'arunachal pradesh',
    'assam',
    'manipur',
    'meghalaya',
    'mizoram',
    'nagaland',
    'tripura',

    // Other Blocked Regions
    'jammu & kashmir',
    'jammu and kashmir',
    'kashmir',
    'ladakh',
    'lakshadweep',
    'sikkim',
    'daman & diu',
    'daman and diu',
];

// ============================================
// INDIAN STATES (Serviceable)
// ============================================

export const SERVICEABLE_STATES = [
    { value: 'andhra pradesh', label: 'Andhra Pradesh' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal pradesh', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'puducherry', label: 'Puducherry' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'tamil nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'uttar pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west bengal', label: 'West Bengal' },
    { value: 'dadra & nagar haveli', label: 'Dadra & Nagar Haveli' },
];

// ============================================
// INITIAL FORM DATA
// ============================================

export const getInitialFormData = (): QuickApplyV2FormData => ({
    // Pre-Apply
    ipData: null,
    bankVerified: false,
    firstName: "",
    lastName: "", 
    customerId:"",
    upiAutoPayStatus: false,
    brePulled: false,

    // Page 1
    mobile: '',
    otp: '',
    mobileVerified: false,
    pincode: '',
    city: '',
    state: '',
    loanAmount: LOAN_CONFIG.DEFAULT_AMOUNT,
    tenure: LOAN_CONFIG.DEFAULT_TENURE,
    employmentType: 'SALARIED',
    monthlyIncome: '',
    salaryDate: 1,

    // Page 2
    pan: '',
    panVerified: false,
    panData: null,
    fullName: '',
    dob: '',
    ifsc: '',
    bankName: '',
    accountNumber: '',
    accountHolderName: '',

    // Consents
    termsConsent: false,
    bureauConsent: false,

    // Post-Approval
    email: '',
    emailVerified: false,
    aadhaar: '',
    aadhaarVerified: false,
    aadhaarData: null,
    selfie: null,
    selfieVerified: false,
    selfieData: null,
    eSignCompleted: false,

    // References
    reference1Name: '',
    reference1Mobile: '',
    reference1Relationship: '',
    reference2Name: '',
    reference2Mobile: '',
    reference2Relationship: '',
});

// ============================================
// LOAN CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate loan details based on amount and tenure
 * Uses the exact formula from CLAUDE.md
 *
 * Example (₹50,000 for 30 days):
 * - Platform Fee: ₹5,000 (10% of ₹50,000)
 * - GST on Platform Fee: ₹900 (18% of ₹5,000)
 * - Interest: ₹15,000 (1% × 30 days × ₹50,000)
 * - Total Deductions: ₹20,900
 * - Amount Disbursed: ₹29,100
 * - Amount to Repay: ₹50,000
 */
export function calculateLoanDetails(
    loanAmount: number,
    tenure: number
): LoanCalculation {
    const { PROCESSING_FEE_PERCENT, GST_PERCENT, INTEREST_RATE_PER_DAY } = LOAN_CONFIG;

    // Processing fee (10% of loan amount)
    const processingFee = Math.round((loanAmount * PROCESSING_FEE_PERCENT) / 100);

    // GST on processing fee (18% of processing fee)
    const gstOnProcessingFee = Math.round((processingFee * GST_PERCENT) / 100);

    // Total interest (1% per day × tenure days × loan amount)
    const totalInterest = Math.round((INTEREST_RATE_PER_DAY / 100) * tenure * loanAmount);

    // Total deductions (processing fee + GST + interest)
    // Note: Interest is not deducted upfront, only processing fee + GST
    const totalDeductions = processingFee + gstOnProcessingFee;

    // Net disbursal amount (loan amount - upfront deductions)
    const netDisbursalAmount = loanAmount - totalDeductions;

    // Total repayment (original loan amount - customer pays back full amount)
    // Interest is added to repayment, not deducted from disbursal
    const totalRepayment = loanAmount;

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + tenure);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    return {
        loanAmount,
        tenure,
        interestRate: INTEREST_RATE_PER_DAY,
        processingFeePercent: PROCESSING_FEE_PERCENT,
        gstPercent: GST_PERCENT,
        processingFee,
        gstOnProcessingFee,
        totalDeductions,
        netDisbursalAmount,
        totalInterest,
        totalRepayment,
        dueDate: dueDateStr,
    };
}

/**
 * Format currency in Indian format
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date for display (DD MMM YYYY)
 */
export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Format mobile number with spaces
 */
export function formatMobile(mobile: string): string {
    if (!mobile || mobile.length !== 10) return mobile;
    return `${mobile.slice(0, 5)} ${mobile.slice(5)}`;
}

/**
 * Mask Aadhaar number (show only last 4 digits)
 */
export function maskAadhaar(aadhaar: string): string {
    if (!aadhaar || aadhaar.length !== 12) return aadhaar;
    return `XXXX XXXX ${aadhaar.slice(-4)}`;
}

/**
 * Format PAN for display
 */
export function formatPAN(pan: string): string {
    return pan.toUpperCase();
}

/**
 * Check if state is serviceable
 */
export function isStateServiceable(state: string): boolean {
    if (!state) return true;
    const normalized = state.toLowerCase().trim();
    return !BLACKLISTED_STATES.some(blocked =>
        normalized.includes(blocked) || blocked.includes(normalized)
    );
}

/**
 * Validate mobile number
 */
export function isValidMobile(mobile: string): boolean {
    return VALIDATION.MOBILE.test(mobile);
}

/**
 * Validate PAN number
 */
export function isValidPAN(pan: string): boolean {
    return VALIDATION.PAN.test(pan.toUpperCase());
}

/**
 * Validate IFSC code
 */
export function isValidIFSC(ifsc: string): boolean {
    return VALIDATION.IFSC.test(ifsc.toUpperCase());
}

/**
 * Validate account number
 */
export function isValidAccountNumber(accountNumber: string): boolean {
    return VALIDATION.ACCOUNT_NUMBER.test(accountNumber);
}

/**
 * Validate pincode
 */
export function isValidPincode(pincode: string): boolean {
    return VALIDATION.PINCODE.test(pincode);
}

// ============================================
// STEP CONFIGURATION
// ============================================

export const STEPS = {
    PRE_APPLY: {
        id: 0,
        name: 'Location Check',
        description: 'Checking service availability',
    },
    PAGE_1: {
        id: 1,
        name: 'Basic Details',
        description: 'Mobile, location & loan details',
    },
    PAGE_2: {
        id: 2,
        name: 'Identity & Bank',
        description: 'PAN verification & bank details',
    },
    PROCESSING: {
        id: 3,
        name: 'Processing',
        description: 'Checking eligibility',
    },
    APPROVAL: {
        id: 4,
        name: 'Approval',
        description: 'Loan decision',
    },
    POST_APPROVAL: {
        id: 5,
        name: 'Complete KYC',
        description: 'Final verification',
    },
    DISBURSEMENT: {
        id: 6,
        name: 'Disbursement',
        description: 'Money transfer',
    },
};

// ============================================
// TRACKING EVENTS
// ============================================

export const TRACKING_EVENTS = {
    // Page Load
    PAGE_LOADED: 'page_loaded',
    IP_CHECK_STARTED: 'ip_check_started',
    IP_CHECK_PASSED: 'ip_check_passed',
    IP_CHECK_BLOCKED: 'ip_check_blocked',
    VPN_DETECTED: 'vpn_detected',

    // Page 1
    OTP_REQUESTED: 'otp_requested',
    OTP_VERIFIED: 'otp_verified',
    OTP_FAILED: 'otp_failed',
    GOOGLE_LOGIN_STARTED: 'google_login_started',
    GOOGLE_LOGIN_SUCCESS: 'google_login_success',
    PINCODE_CHECKED: 'pincode_checked',
    PAGE1_COMPLETED: 'page1_completed',

    // Page 2
    PAN_VERIFY_STARTED: 'pan_verify_started',
    PAN_VERIFIED: 'pan_verified',
    PAN_FAILED: 'pan_failed',
    BANK_DETAILS_ENTERED: 'bank_details_entered',
    APPLICATION_SUBMITTED: 'application_submitted',

    // BRE
    BRE_PROCESSING: 'bre_processing',
    BRE_APPROVED: 'bre_approved',
    BRE_REJECTED: 'bre_rejected',

    // Post-Approval
    POST_APPROVAL_STARTED: 'post_approval_started',
    EMAIL_COLLECTED: 'email_collected',
    AADHAAR_OTP_SENT: 'aadhaar_otp_sent',
    AADHAAR_VERIFIED: 'aadhaar_verified',
    SELFIE_CAPTURED: 'selfie_captured',
    ESIGN_COMPLETED: 'esign_completed',
    BANK_VERIFIED: 'bank_verified',

    // Disbursement
    DISBURSEMENT_INITIATED: 'disbursement_initiated',
    DISBURSEMENT_COMPLETED: 'disbursement_completed',

    // Drop-off
    PAGE1_DROPOFF: 'page1_dropoff',
    PAGE2_DROPOFF: 'page2_dropoff',
    POST_APPROVAL_DROPOFF: 'post_approval_dropoff',
};
