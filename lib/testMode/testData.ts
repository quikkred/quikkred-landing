/**
 * ============================================================================
 *  TEST MODE — DUMMY DATA
 * ============================================================================
 *  Single source of dummy data used when Test Mode is enabled. This represents
 *  ONE fully-approved + disbursed loan customer so every guarded page renders
 *  its "happy path" without hitting the backend.
 *
 *  Edit any field below to change what the recorded video shows.
 *  See lib/testMode/index.ts for how Test Mode is switched on.
 * ============================================================================
 */

import type { User } from "@/contexts/AuthContext";
import type { ApplicationInterface } from "@/interfaces/applicationInterface";
import type { DashboardData, ActiveLoanDetails } from "@/interfaces/dashboardInterface";

/* -------------------------------------------------------------------------- */
/*  IDENTIFIERS — keep these consistent across all objects below              */
/* -------------------------------------------------------------------------- */
export const TEST_CUSTOMER_ID = "test-customer-001";
export const TEST_APPLICATION_NUMBER = "QK-TEST-2026-0001";
export const TEST_LOAN_NUMBER = "QKLN-TEST-0001";
export const TEST_LOAN_ID = "test-loan-001";
export const TEST_PRODUCT_ID = "test-product-001";

const APPROVED_AMOUNT = 50000;
const TENURE_DAYS = 30;
const INTEREST_RATE = 1; // 1% per day (matches the apply flow's rate/100 math)
const PROCESSING_FEE = APPROVED_AMOUNT * 0.1; // 5000
const GST_ON_FEE = PROCESSING_FEE * 0.18; // 900
const INTEREST_AMOUNT = (INTEREST_RATE / 100) * APPROVED_AMOUNT * TENURE_DAYS; // 15000
const NET_DISBURSAL = APPROVED_AMOUNT - (PROCESSING_FEE + GST_ON_FEE); // 44100
const TOTAL_REPAYMENT = APPROVED_AMOUNT + INTEREST_AMOUNT; // 65000

/* -------------------------------------------------------------------------- */
/*  1) USER  → drives useAuth().user (apply flow + dashboard greeting)        */
/* -------------------------------------------------------------------------- */
export const TEST_USER: User = {
  id: TEST_CUSTOMER_ID,
  name: "Rahul Sharma",
  firstName: "Rahul",
  lastName: "Sharma",
  fullName: "Rahul Sharma",
  email: "rahul.test@quikkred.in",
  mobile: "9876543210",
  dateOfBirth: "1995-06-15T00:00:00.000Z",
  address: "123 MG Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",

  // Every verification step marked complete → all apply pages are skipped
  isEmailVerified: true,
  isMobileVerified: true,
  isPanVerify: true,
  isAadhaarVerify: true,
  brePulled: true,
  kycStatus: "VERIFIED",
  status: "APPROVED",
  createdAt: "2026-06-01T10:00:00.000Z",

  pan: "ABCDE1234F",
  aadhaar: "XXXXXXXX1234",
  employmentType: "SALARIED",
  monthlyIncome: "75000",
  companyName: "Acme Corp Pvt Ltd",

  // Bank — verified
  bankName: "HDFC Bank",
  accountHolderName: "Rahul Sharma",
  accountNumber: "50100123456789",
  ifsc: "HDFC0001234",
  pennyDropStatus: "VERIFIED",
  bankVerified: true,
  loanAmount: String(APPROVED_AMOUNT),

  // Selfie / liveness — verified
  profile: {
    documentType: "SELFIE",
    status: "VERIFIED",
    s3Key: "test/selfie.jpg",
    s3URL: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=25B181&color=fff&size=256",
  },

  upiAutoPayStatus: true,
  isSubmit: true,
  bsaInitiated: true,
  bsaCompleted: true,
  bsaToBreInitiated: true,
  bsaToBreCompleted: true,

  // "Filled" flags → eligibility / KYC / bank steps are all considered done
  isBasicDetailsFilled: true,
  isKycDetailsFilled: true,
  isBankDetailsFilled: true,
  isProfileVerified: true,

  references: [
    { name: "Amit Verma", mobile: "9811122233", relationship: "Friend" },
    { name: "Priya Nair", mobile: "9822233344", relationship: "Colleague" },
  ],
};

/* -------------------------------------------------------------------------- */
/*  2) APPLICATION → drives useApplication().application (apply flow)         */
/* -------------------------------------------------------------------------- */
export const TEST_APPLICATION: ApplicationInterface = {
  _id: TEST_LOAN_ID,
  applicationNumber: TEST_APPLICATION_NUMBER,
  customerId: TEST_CUSTOMER_ID,
  productId: TEST_PRODUCT_ID,

  status: "APPROVED",
  priority: "HIGH",

  isSubmit: true,
  isDeleted: false,

  requestedLoanAmount: APPROVED_AMOUNT,
  breApprovedLoanAmount: APPROVED_AMOUNT,
  approvedLoanAmount: APPROVED_AMOUNT,

  tenure: TENURE_DAYS,
  tenureUnit: "Days",
  interestRate: INTEREST_RATE,

  emiAmount: TOTAL_REPAYMENT,
  totalInterest: INTEREST_AMOUNT,
  totalRepayment: TOTAL_REPAYMENT,

  processingFee: PROCESSING_FEE,
  processingPercent: 10,
  gstOnProcessingFee: GST_ON_FEE,
  gstOnProcessingPercent: 18,

  netDisbursalAmount: NET_DISBURSAL,

  cibilScore: 780,
  incomeScore: 85,
  riskScore: 12,
  fraudScore: 3,
  autoDecisionScore: 92,

  paymentDetails: [],

  disbursementStatus: "PAID",
  disbursementBankAccount: {
    bankName: "HDFC Bank",
    accountNumber: "50100123456789",
    ifscCode: "HDFC0001234",
    accountHolderName: "Rahul Sharma",
    status: "VERIFIED",
  },

  autopayStatus: "active",
  emandateCancelled: false,
  autopayNotificationsSent: [],

  collectionRetryCount: 0,

  verificationChecklist: {
    identityVerification: {
      panVerified: true,
      aadhaarVerified: true,
      bankAccountVerified: true,
      agreementSigned: true,
      faceMatchDone: true,
      brePulled: true,
      bsaPulled: true,
      bsaToBrePulled: true,
      manualBrePulled: false,
    },
  },

  breHistory: {
    brePulled: true,
    brePulledAt: "2026-06-20T09:00:00.000Z",
    breStatus: "APPROVED",
    bsaInitiated: true,
    bsaInitiatedAt: "2026-06-20T09:05:00.000Z",
    bsaStatus: "COMPLETED",
    bsaBrePulled: true,
    bsaBrePulledAt: "2026-06-20T09:10:00.000Z",
    bsaBreStatus: "APPROVED",
    bankStatementUploadedVerified: true,
  },

  finfactor: { transactions: [] },

  documents: [],
  statusHistory: [],
  internalNotes: [],

  appliedDate: "2026-06-20T08:30:00.000Z",
  createdAt: "2026-06-20T08:30:00.000Z",
  updatedAt: "2026-06-21T10:00:00.000Z",

  __v: 0,
};

/* -------------------------------------------------------------------------- */
/*  3) DASHBOARD → drives /user (Redux: customerService.getDashboard)        */
/* -------------------------------------------------------------------------- */
export const TEST_DASHBOARD: DashboardData = {
  customerId: TEST_CUSTOMER_ID,
  oldApplication: false,
  oldApplicationNumber: null,
  oldApplicationDate: null,
  // DISBURSED (not APPROVED) so the dashboard shows the active loan directly
  // instead of bouncing to /application-status. Use /application-status?testMode=1
  // for the "Congratulations, approved" screen.
  applicationStatus: "DISBURSED",
  isBasicDetailsFilled: true,
  isKycDetailsFilled: true,
  isBankDetailsFilled: true,
  isSubmit: true,
  activeLoan: true,
  loans: [
    {
      productName: "Personal Loan",
      _id: TEST_LOAN_ID,
      loanNumber: TEST_LOAN_NUMBER,
      principalAmount: APPROVED_AMOUNT,
    },
  ],
  isLedgerEligible: false,
};

/* -------------------------------------------------------------------------- */
/*  4) ACTIVE LOAN → drives /user loan card (Redux: getActiveLoan)           */
/* -------------------------------------------------------------------------- */
export const TEST_ACTIVE_LOAN: ActiveLoanDetails = {
  _id: TEST_LOAN_ID,
  loanNumber: TEST_LOAN_NUMBER,
  tenure: TENURE_DAYS,
  tenureUnit: "Days",
  emiAmount: TOTAL_REPAYMENT,
  maturityDate: "2026-07-22T00:00:00.000Z",
  firstDueDate: "2026-07-22T00:00:00.000Z",
  nextDueDate: "2026-07-22T00:00:00.000Z",
  status: "ACTIVE",
  overdueCount: 0,
  lateCharges: 0,
  lateChargeInterest: 0,
  paidAmount: 0,
  totalEMIsPaid: 0,
  installment: 1,
  appliedDate: "2026-06-20T08:30:00.000Z",
  applicationNumber: TEST_APPLICATION_NUMBER,
  disbursementDate: "2026-06-22T11:00:00.000Z",
  loanCreatedDate: "2026-06-22T11:00:00.000Z",
  isLedgerEligible: false,
  ledgerSplits: [],
};

/* -------------------------------------------------------------------------- */
/*  5) APPLICATION STATUS → drives /application-status (localStorage handoff) */
/* -------------------------------------------------------------------------- */
export const TEST_APPLICATION_STATUS = {
  status: "approved" as const,
  loanNumber: TEST_APPLICATION_NUMBER,
  amount: String(APPROVED_AMOUNT),
  reason: "",
};
