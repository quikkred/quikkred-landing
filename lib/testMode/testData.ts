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

/** Fixed OTP that always works in Test Mode (no real SMS / backend). */
export const TEST_OTP = "123456";
/** Mobile number used for the Test Mode login screen. */
export const TEST_MOBILE = "9999999999";

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
  mobile: TEST_MOBILE,
  dateOfBirth: "1995-06-15T00:00:00.000Z",
  address: "123 MG Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",

  // FRESH applicant: only mobile + email are verified (done at the OTP login
  // step). Everything else is left empty/false so the apply flow shows EVERY
  // step and you fill each field yourself. Each step is faked client-side.
  isEmailVerified: true,
  isMobileVerified: true,
  isPanVerify: false,
  isAadhaarVerify: false,
  brePulled: false,
  kycStatus: "PENDING",
  status: "PENDING",
  createdAt: "2026-06-01T10:00:00.000Z",

  // KYC / employment — left blank for you to enter
  pan: "",
  aadhaar: "",
  employmentType: "SALARIED",
  monthlyIncome: "",
  companyName: "",

  // Bank — not yet verified
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifsc: "",
  pennyDropStatus: "",
  bankVerified: false,
  loanAmount: "",

  // Selfie / liveness — not yet captured
  profile: null,

  upiAutoPayStatus: false,
  isSubmit: false,
  bsaInitiated: false,
  bsaCompleted: false,
  bsaToBreInitiated: false,
  bsaToBreCompleted: false,

  // Nothing filled yet → eligibility / KYC / bank steps are all shown
  isBasicDetailsFilled: false,
  isKycDetailsFilled: false,
  isBankDetailsFilled: false,
  isProfileVerified: false,

  references: [],
};

/** Placeholder selfie image used when capturing the selfie in Test Mode. */
export const TEST_SELFIE_URL =
  "https://ui-avatars.com/api/?name=Rahul+Sharma&background=25B181&color=fff&size=256";

/* -------------------------------------------------------------------------- */
/*  2) APPLICATION → drives useApplication().application (apply flow)         */
/* -------------------------------------------------------------------------- */
export const TEST_APPLICATION: ApplicationInterface = {
  _id: TEST_LOAN_ID,
  applicationNumber: TEST_APPLICATION_NUMBER,
  customerId: TEST_CUSTOMER_ID,
  // Left blank so you pick the product in the form. Approved amounts below are
  // kept only for the offer/summary display.
  productId: "",

  // In-progress: the apply flow shows every step until you submit.
  status: "PENDING",
  priority: "HIGH",

  isSubmit: false,
  isDeleted: false,

  requestedLoanAmount: 0,
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
    brePulled: false,
    brePulledAt: "",
    breStatus: "PENDING",
    bsaInitiated: false,
    bsaStatus: "PENDING",
    bsaBrePulled: false,
    bsaBreStatus: "PENDING",
    // false → the apply flow routes through eligibility (not straight to bank).
    bankStatementUploadedVerified: false,
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
