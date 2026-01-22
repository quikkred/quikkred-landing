import { QuickApplyFormData, FieldErrors } from '../types/quickApply';

// Employment Types
export const EMPLOYMENT_TYPES = [
  { value: 'SALARIED', label: 'SALARIED' },
  { value: 'SELF-EMPLOYED', label: 'SELF-EMPLOYED' },
];

// Relationship Types
export const RELATIONSHIP_TYPES = [
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Colleague', label: 'Colleague' },
  { value: 'Relative', label: 'Relative' },
];

// Loan Purposes
export const LOAN_PURPOSES = [
  { value: 'Personal', label: 'Personal' },
  { value: 'Education', label: 'Education' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Business', label: 'Business' },
  { value: 'Home Improvement', label: 'Home Improvement' },
  { value: 'Debt Consolidation', label: 'Debt Consolidation' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Other', label: 'Other' },
];

// Indian States List
export const INDIAN_STATES = [
  { value: '', label: 'Select State' },
  { value: 'andhra pradesh', label: 'Andhra Pradesh' },
  { value: 'andaman & nicobar islands', label: 'Andaman & Nicobar Islands' },
  { value: 'arunachal pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'dadra & nagar haveli', label: 'Dadra & Nagar Haveli' },
  { value: 'daman & diu', label: 'Daman & Diu' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal pradesh', label: 'Himachal Pradesh' },
  { value: 'jammu & kashmir', label: 'Jammu & Kashmir' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'ladakh', label: 'Ladakh' },
  { value: 'lakshadweep', label: 'Lakshadweep' },
  { value: 'madhya pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'puducherry', label: 'Puducherry' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west bengal', label: 'West Bengal' },
];

// Blacklisted States (services not available)
export const BLACKLISTED_STATES = [
  'andaman & nicobar islands',
  'andaman and nicobar islands',
  'arunachal pradesh',
  'assam',
  'jammu & kashmir',
  'jammu and kashmir',
  'lakshadweep',
  'manipur',
  'meghalaya',
  'mizoram',
  'nagaland',
  'sikkim',
  'tripura',
  'ladakh',
  'daman & diu',
];

// Initial Form Data
export const getInitialFormData = (): QuickApplyFormData => {
  const initialData: QuickApplyFormData = {
    // Step 1: Basic Details
    mobile: '',
    otp: '',
    mobileVerified: false,
    emailVerified: false,
    fullName: '',
    pan: '',
    aadhaar: '',
    dob: '',
    email: '',
    state: '',

    // Step 2: Employment & Bank
    employmentType: 'SALARIED',
    monthlyIncome: '',
    companyName: '',
    bankName: '',
    customBankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',

    // Step 3: Loan & Consent
    loanAmount: '',
    tenure: '',
    tenureUnit: '',
    productId: '',
    purpose: '',
    reference1Name: '',
    reference1Mobile: '',
    reference1Relationship: '',
    reference2Name: '',
    reference2Mobile: '',
    reference2Relationship: '',
    selfie: null,
    creditBureauConsent: false,
    termsConsent: false,
    eSignConsent: false,
  };

  // Try to load hero form data from localStorage
  if (typeof window !== 'undefined') {
    try {
      const heroData = localStorage.getItem('heroFormData');
      if (heroData) {
        const data = JSON.parse(heroData);
        console.log('Loading hero data into initial state:', data);
        initialData.fullName = data.name || initialData.fullName;
        initialData.mobile = data.mobile || initialData.mobile;
        initialData.loanAmount = data.amount || initialData.loanAmount;
        initialData.email = data.email || initialData.email;
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    }
  }

  return initialData;
};

// Initial Field Errors
export const initialFieldErrors: FieldErrors = {
  email: '',
  mobile: '',
  fullName: '',
  dob: '',
  state: '',
  aadhaar: '',
  pan: '',
  accountHolderName: '',
  accountNumber: '',
  ifsc: '',
  reference1Name: '',
  reference1Mobile: '',
  reference2Name: '',
  reference2Mobile: '',
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAAR: /^\d{12}$/,
  MOBILE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  ACCOUNT_NUMBER: /^\d{9,18}$/,
};

// Timer Durations (in seconds)
export const TIMER_DURATIONS = {
  OTP_RESEND: 60,
  REVERIFY_COOLDOWN: 30,
  REJECTION_COUNTDOWN: 10,
  REDIRECT_COUNTDOWN: 5,
};
