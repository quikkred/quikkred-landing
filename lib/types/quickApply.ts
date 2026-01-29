// Quick Apply Form Types

export interface QuickApplyFormData {
  // Step 1: Basic Details
  mobile: string;
  otp: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  fullName: string;
  pan: string;
  aadhaar: string;
  dob: string;
  email: string;
  state: string;

  // Step 2: Employment & Bank
  employmentType: string;
  monthlyIncome: string;
  companyName: string;
  bankName: string;
  customBankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;

  // Step 3: Loan & Consent
  loanAmount: string;
  tenure: string;
  tenureUnit: string;
  productId: string;
  purpose: string;
  reference1Name: string;
  reference1Mobile: string;
  reference1Relationship: string;
  reference2Name: string;
  reference2Mobile: string;
  reference2Relationship: string;
  selfie: File | null;
  creditBureauConsent: boolean;
  termsConsent: boolean;
  eSignConsent: boolean;
}

export interface FieldErrors {
  email: string;
  mobile: string;
  fullName: string;
  dob: string;
  state: string;
  aadhaar: string;
  pan: string;
  employmentType: string;
  monthlyIncome: string;
  companyName: string;
  loanAmount: string;
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  reference1Name: string;
  reference1Mobile: string;
  reference2Name: string;
  reference2Mobile: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface EmiCalculation {
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

export interface ApprovalData {
  approvedAmount?: number;
  interestRate?: number;
  tenure?: number;
  emi?: number;
  processingFee?: number;
  [key: string]: any;
}
