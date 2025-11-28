"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle, X, Loader2, FileText, IndianRupee,
  Calendar, User, Phone, Mail, CreditCard, Camera,
  AlertCircle, ArrowRight, Sparkles, Shield, Zap
} from "lucide-react";
import { loansService } from "@/lib/api/loans.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast, Toaster } from "@/components/ui/toast";
import SelfieCapture from "@/components/camera/SelfieCapture";

// Auto-decision engine
const autoDecisionEngine = (data: any) => {
  const { monthlyIncome, loanAmount, pan, aadhaar } = data;

  // Simple rule-based decision
  const minIncome = 25000;
  const maxLoanToIncome = 40;
  const maxEligibleAmount = monthlyIncome * maxLoanToIncome;

  // Check basic eligibility
  if (monthlyIncome < minIncome) {
    return {
      approved: false,
      reason: "Minimum monthly income requirement not met (₹25,000)",
      suggestedAction: "Please reapply when your monthly income is ₹25,000 or above"
    };
  }

  if (loanAmount > maxEligibleAmount) {
    return {
      approved: false,
      reason: `Requested amount exceeds maximum eligible amount (₹${maxEligibleAmount.toLocaleString()})`,
      suggestedAction: `Maximum loan amount you can apply for: ₹${maxEligibleAmount.toLocaleString()}`
    };
  }

  if (!pan || !aadhaar) {
    return {
      approved: false,
      reason: "PAN and Aadhaar details are mandatory",
      suggestedAction: "Please provide valid PAN and Aadhaar numbers"
    };
  }

  // Approved!
  return {
    approved: true,
    approvedAmount: loanAmount,
    interestRate: 12.5,
    tenure: data.tenure || 12,
    emi: Math.round((loanAmount * (12.5/100/12) * Math.pow(1 + 12.5/100/12, 12)) / (Math.pow(1 + 12.5/100/12, 12) - 1)),
    processingFee: Math.round(loanAmount * 0.02)
  };
};

export default function QuickLoanApplication() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<any>(null);
  const [selfieCapture, setSelfieCapture] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<'mobile' | 'email'>('email');
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [panData, setPanData] = useState<any>(null);
  const [aadhaarData, setAadhaarData] = useState<any>(null);
  const [aadhaarAddress, setAadhaarAddress] = useState<any>(null);
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [panError, setPanError] = useState<string>("");
  const [aadhaarError, setAadhaarError] = useState<string>("");
  const [apiDeterminedStep, setApiDeterminedStep] = useState<number | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(5);

  // OTP Resend timers
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [aadhaarOtpTimer, setAadhaarOtpTimer] = useState(0);

  // Loan Products
  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [emiCalculation, setEmiCalculation] = useState<any>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Field validation errors for Step 1
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    mobile: "",
    fullName: "",
    dob: "",
    aadhaar: "",
    pan: "",
    accountNumber: "",
    ifsc: ""
  });

  // Consent validation error
  const [consentError, setConsentError] = useState(false);

  // Load hero form data FIRST (before useState)
  const getInitialFormData = () => {
    const initialData = {
      // Step 1: Basic Details
      mobile: "",
      otp: "",
      mobileVerified: false,
      emailVerified: false,
      fullName: "",
      pan: "",
      aadhaar: "",
      dob: "",
      email: "",

      // Step 2: Employment & Bank
      employmentType: "SALARIED",
      monthlyIncome: "",
      companyName: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",

      // Step 3: Loan & Consent
      loanAmount: "",
      tenure: "12",
      requestedTenureUnit: "months", // days or months
      productId: "",
      purpose: "",
      reference1Name: "",
      reference1Mobile: "",
      reference1Relationship: "",
      reference2Name: "",
      reference2Mobile: "",
      reference2Relationship: "",
      selfie: null as File | null,
      creditBureauConsent: false,
      termsConsent: false,
      eSignConsent: false
    };

    // Try to load hero form data from localStorage
    if (typeof window !== 'undefined') {
      try {
        const heroData = localStorage.getItem('heroFormData');
        if (heroData) {
          const data = JSON.parse(heroData);
          console.log('💾 Loading hero data into initial state:', data);
          initialData.fullName = data.name || initialData.fullName;
          initialData.mobile = data.mobile || initialData.mobile;
          initialData.loanAmount = data.amount || initialData.loanAmount;
          initialData.email = data.email || initialData.email;
          // Don't clear yet - will clear after component mounts
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
      }
    }

    return initialData;
  };

  const [formData, setFormData] = useState(getInitialFormData());

  // Load user data if logged in
  useEffect(() => {
    const loadUserData = async () => {
      if (user && !userDataLoaded) {
        console.log('🔵 Loading user data for logged-in user...');
        try {
          const token = localStorage.getItem('accessToken') ||
                        localStorage.getItem('token') ||
                        localStorage.getItem('authToken');

          if (token) {
            // Fetch user profile data
            const response = await fetch('https://api.bluechipfinmax.com/api/customer/get', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            const result = await response.json();

            if (response.ok && result.success && result.data) {
              const profileData = result.data;
              console.log('✅ User profile loaded successfully');
              console.log('📊 Profile Data:', {
                isBasicDetailsFilled: profileData.isBasicDetailsFilled,
                isEmploymentDetailsFilled: profileData.isEmploymentDetailsFilled,
                isVerificationDetailsFilled: profileData.isVerificationDetailsFilled
              });

              // Convert ISO date to YYYY-MM-DD format for input field
              const formatDateForInput = (isoDate: string) => {
                if (!isoDate) return '';
                try {
                  const date = new Date(isoDate);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                } catch (error) {
                  console.error('Error formatting date:', error);
                  return '';
                }
              };

              // Pre-fill form data
              setFormData(prev => ({
                ...prev,
                fullName: profileData.fullName || prev.fullName,
                mobile: profileData.mobile || user.mobile || prev.mobile,
                email: profileData.email || user.email || prev.email,
                pan: profileData.panCard || prev.pan,
                aadhaar: profileData.aadhaarNumber || prev.aadhaar,
                dob: formatDateForInput(profileData.dateOfBirth) || prev.dob,
                employmentType: profileData.employmentType || prev.employmentType,
                monthlyIncome: profileData.monthlyIncome?.toString() || prev.monthlyIncome,
                companyName: profileData.companyName || prev.companyName,
                bankName: profileData.banks?.[0]?.bankName || prev.bankName,
                accountNumber: profileData.banks?.[0]?.accountNumber || prev.accountNumber,
                ifsc: profileData.banks?.[0]?.ifscCode || prev.ifsc,
                mobileVerified: profileData.isMobileVerified || true, // True if logged in with mobile
                emailVerified: profileData.isEmailVerified || false // Only true if email is actually verified
              }));

              // Set verification flags from API
              if (profileData.isPanVerify) {
                setPanVerified(true);
                console.log('✅ PAN already verified');
              }
              if (profileData.isAadhaarVerify) {
                setAadhaarVerified(true);
                console.log('✅ Aadhaar already verified');
              }

              // Auto-jump to next incomplete step based on completion flags
              let nextStep = 1; // Default to step 1

              // Check completion status and determine next step
              if (profileData.isBasicDetailsFilled === true && profileData.isEmploymentDetailsFilled === true) {
                nextStep = 3;
              } else if (profileData.isBasicDetailsFilled === true) {
                nextStep = 2;
              } else {
                console.log('ℹ️ No steps completed yet - starting from Step 1');
              }

              // Set the API determined step if it's different from default
              if (nextStep > 1) {
                setApiDeterminedStep(nextStep);
              } else {
                console.log('📍 Staying at Step 1 (default)');
              }

              setUserDataLoaded(true);
            } else {
              setFormData(prev => ({
                ...prev,
                fullName: prev.fullName, // Keep existing or empty
                mobile: user.mobile || prev.mobile,
                email: user.email || prev.email,
                mobileVerified: !!user.mobile, // Only if mobile exists
                emailVerified: false // Email not verified if API fails
              }));
              setUserDataLoaded(true);
            }
          }
        } catch (error) {
          setFormData(prev => ({
            ...prev,
            fullName: prev.fullName, // Keep existing or empty
            mobile: user.mobile || prev.mobile,
            email: user.email || prev.email,
            mobileVerified: !!user.mobile, // Only if mobile exists
            emailVerified: false // Email not verified if API fails
          }));
          setUserDataLoaded(true);
        }
      }
    };

    if (!isLoading) {
      loadUserData();
    }
  }, [user, isLoading, userDataLoaded]);

  // Clean up hero form data from localStorage after component mounts
  useEffect(() => {
    // Clear the localStorage after reading (already loaded in initial state)
    if (localStorage.getItem('heroFormData')) {
      console.log('🗑️ Clearing hero form data from localStorage');
      localStorage.removeItem('heroFormData');
    }
  }, []);

  // Apply API-determined step after data is loaded
  useEffect(() => {
    if (apiDeterminedStep !== null && apiDeterminedStep !== currentStep) {
      console.log(`🎯 Applying API-determined step: ${apiDeterminedStep}`);
      setCurrentStep(apiDeterminedStep);
      toast({
        variant: "success",
        title: "Welcome Back!",
        description: `Your progress has been saved. Continue from Step ${apiDeterminedStep}.`,
      });
    }
  }, [apiDeterminedStep]);

  // Auto-redirect to dashboard or login after successful submission
  useEffect(() => {
    if (decision && decision.approved) {
      setRedirectCountdown(5); // Reset countdown
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect based on login status
            if (user) {
              router.push('/user');
            } else {
              router.push('/user');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [decision, router]);

  // OTP timer countdown for Email/Mobile
  useEffect(() => {
    if (emailOtpTimer > 0) {
      const timer = setTimeout(() => setEmailOtpTimer(emailOtpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailOtpTimer]);

  // OTP timer countdown for Aadhaar
  useEffect(() => {
    if (aadhaarOtpTimer > 0) {
      const timer = setTimeout(() => setAadhaarOtpTimer(aadhaarOtpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [aadhaarOtpTimer]);

  // Save form data to localStorage on change (excluding sensitive fields)
  useEffect(() => {
    const dataToSave = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      dob: formData.dob,
      employmentType: formData.employmentType,
      monthlyIncome: formData.monthlyIncome,
      companyName: formData.companyName,
      bankName: formData.bankName,
      loanAmount: formData.loanAmount,
      tenure: formData.tenure,
      purpose: formData.purpose,
      reference1Name: formData.reference1Name,
      reference1Mobile: formData.reference1Mobile,
      reference1Relationship: formData.reference1Relationship,
      reference2Name: formData.reference2Name,
      reference2Mobile: formData.reference2Mobile,
      reference2Relationship: formData.reference2Relationship,
      currentStep
    };
    localStorage.setItem('quickLoanFormData', JSON.stringify(dataToSave));
  }, [formData, currentStep]);

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('quickLoanFormData');
    if (savedData && !user) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsed
        }));
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [user]);

  // Fetch loan products
  useEffect(() => {
    const fetchLoanProducts = async () => {
      const token =   localStorage.getItem('accessToken') ||
                      localStorage.getItem('token') ||
                      localStorage.getItem('authToken');
      setLoadingProducts(true);
      try {
        const response = await fetch('https://api.bluechipfinmax.com/api/loanProduct/allLoanProductsNameOnly', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const result = await response.json();

        if (response.ok && result.success && result.data) {
          setLoanProducts(result.data);
          console.log('✅ Loan products loaded:', result.data);
        } else {
          console.error('Failed to fetch loan products:', result.message);
          toast({
            title: "Error",
            description: "Failed to load loan products. Please refresh the page.",
            variant: "error"
          });
        }
      } catch (error) {
        console.error('Error fetching loan products:', error);
        toast({
          title: "Error",
          description: "Failed to load loan products. Please refresh the page.",
          variant: "error"
        });
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchLoanProducts();
  }, []);

  // Calculate EMI when loan amount, tenure, tenure unit, or product changes
  useEffect(() => {
    if (formData.loanAmount && formData.tenure && selectedProduct) {
      calculateEMI();
    }
  }, [formData.loanAmount, formData.tenure, formData.requestedTenureUnit, selectedProduct]);

  const calculateEMI = () => {
    if (!selectedProduct || !formData.loanAmount || !formData.tenure) {
      setEmiCalculation(null);
      return;
    }

    const principal = parseFloat(formData.loanAmount.replace(/,/g, ''));
    const tenureValue = parseInt(formData.tenure);
    const tenureUnit = formData.requestedTenureUnit;
    const dailyRate = selectedProduct.dailyInterestRate / 100;
    const processingFeePercent = selectedProduct.processingFee / 100;
    const gstPercent = selectedProduct.gst / 100;

    // Calculate total days based on tenure unit
    let totalDays: number;
    let tenureMonths: number;

    if (tenureUnit === 'days') {
      totalDays = tenureValue;
      tenureMonths = Math.ceil(tenureValue / 30); // Convert days to months for EMI
    } else {
      tenureMonths = tenureValue;
      totalDays = Math.round((tenureMonths / 12) * 365);
    }

    // Calculate daily interest for the tenure
    const totalInterest = principal * dailyRate * totalDays;

    // Calculate processing fee and GST
    const processingFee = principal * processingFeePercent;
    const gstOnProcessingFee = processingFee * gstPercent;
    const totalProcessingFee = processingFee + gstOnProcessingFee;

    // Total amount to be repaid
    const totalAmount = principal + totalInterest;

    // EMI calculation - For tenure <= 45 days, it's lump sum payment
    let emi: number;
    let isLumpSum = false;

    if (tenureUnit === 'days' && tenureValue <= 45) {
      emi = Math.round(totalAmount); // Full amount in one payment
      isLumpSum = true;
    } else {
      emi = Math.round(totalAmount / tenureMonths);
    }

    setEmiCalculation({
      principal: principal,
      dailyInterestRate: selectedProduct.dailyInterestRate,
      totalDays: totalDays,
      totalInterest: Math.round(totalInterest),
      processingFee: Math.round(processingFee),
      gst: Math.round(gstOnProcessingFee),
      totalProcessingFee: Math.round(totalProcessingFee),
      totalAmount: Math.round(totalAmount),
      emi: emi,
      tenureMonths: tenureMonths,
      isLumpSum: isLumpSum,
      tenureUnit: tenureUnit,
      tenureValue: tenureValue
    });
  };

  const handleProductChange = (productId: string) => {
    const product = loanProducts.find(p => p._id === productId);
    setSelectedProduct(product || null);

    // Automatically set purpose based on selected product
    const purpose = product ? `${product.productName} - ${product.category}` : '';

    setFormData(prev => ({
      ...prev,
      productId: productId,
      purpose: purpose
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Special handling for mobile - only allow numbers and validate 10 digits
    if (name === 'mobile') {
      if (value && !/^\d*$/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          mobile: "Mobile number can only contain numbers"
        }));
        return; // Don't update if non-numeric
      } else if (value && value.length > 0 && value.length !== 10) {
        // Show error if not exactly 10 digits (but allow typing)
        setFieldErrors(prev => ({
          ...prev,
          mobile: "Mobile number must be exactly 10 digits"
        }));
      } else if (value && value.length === 10 && !/^[6-9]\d{9}$/.test(value)) {
        // Validate Indian mobile number format
        setFieldErrors(prev => ({
          ...prev,
          mobile: "Mobile number must start with 6, 7, 8, or 9"
        }));
      } else {
        // Clear error when valid input
        setFieldErrors(prev => ({
          ...prev,
          mobile: ""
        }));
      }
    }

    // Special handling for accountNumber - only allow numbers
    if (name === 'accountNumber' && value && !/^\d*$/.test(value)) {
      return; // Don't update if non-numeric
    }

    // Special handling for aadhaar - only allow numbers
    if (name === 'aadhaar') {
      if (value && !/^\d*$/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          aadhaar: "Aadhaar number can only contain numbers"
        }));
        return; // Don't update if non-numeric
      } else {
        // Clear error when valid input
        setFieldErrors(prev => ({
          ...prev,
          aadhaar: ""
        }));
      }
    }

    // Special handling for fullName - don't allow numbers
    if (name === 'fullName' && value && /\d/.test(value)) {
      setFieldErrors(prev => ({
        ...prev,
        fullName: "Full name cannot contain numbers"
      }));
      return; // Don't update if contains numbers
    }

    // Special handling for IFSC - auto uppercase and validate format
    if (name === 'ifsc') {
      const upperValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        ifsc: upperValue
      }));

      // Real-time IFSC validation
      if (upperValue.length > 0) {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (upperValue.length === 11) {
          if (!ifscRegex.test(upperValue)) {
            setFieldErrors(prev => ({
              ...prev,
              ifsc: "Invalid IFSC code format (e.g., SBIN0001234)"
            }));
          } else {
            setFieldErrors(prev => ({
              ...prev,
              ifsc: ""
            }));
          }
        } else if (upperValue.length > 11) {
          setFieldErrors(prev => ({
            ...prev,
            ifsc: "IFSC code must be exactly 11 characters"
          }));
        } else {
          // Clear error while typing if less than 11 characters
          setFieldErrors(prev => ({
            ...prev,
            ifsc: ""
          }));
        }
      } else {
        // Clear error when field is empty
        setFieldErrors(prev => ({
          ...prev,
          ifsc: ""
        }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Clear consent error when user checks consent checkboxes
    if ((name === 'creditBureauConsent' || name === 'termsConsent' || name === 'eSignConsent') && consentError) {
      setConsentError(false);
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const payload = verificationMethod === 'email'
        ? { email: formData.email }
        : { mobile: formData.mobile };
console.log('Sending OTP with payload:', payload);

      const response = await fetch("https://api.bluechipfinmax.com/api/auth/customer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpSent(true);
        setEmailOtpTimer(60); // Start 60 second countdown
        toast({
          variant: "success",
          title: "OTP Sent Successfully!",
          description: `A one-time password has been sent to your ${verificationMethod}. Please check and enter it below.`,
        });
      } else {
        toast({
          variant: "error",
          title: "Failed to Send OTP",
          description: data.message || 'Please try again.',
        });
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || 'Failed to send OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        variant: "warning",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = verificationMethod === 'email'
        ? { email: formData.email, otp: formData.otp }
        : { mobile: formData.mobile, otp: formData.otp };

      const response = await fetch("https://api.bluechipfinmax.com/api/auth/customer/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (verificationMethod === 'email') {
          setFormData(prev => ({ ...prev, emailVerified: true }));
        } else {
          setFormData(prev => ({ ...prev, mobileVerified: true }));
        }
        setOtpSent(false); // Reset OTP sent state after successful verification

        // Store access token if provided in response
        if (data.data?.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('token', data.data.accessToken);
          localStorage.setItem('authToken', data.data.accessToken);
          console.log('✅ Access token stored');
        }

        toast({
          variant: "success",
          title: "Verification Successful!",
          description: `Your ${verificationMethod === 'email' ? 'email' : 'mobile number'} has been verified successfully.`,
        });

        // Auto-fill form with customer data after successful OTP verification
        const token = data.data?.accessToken ||
                      localStorage.getItem('accessToken') ||
                      localStorage.getItem('token') ||
                      localStorage.getItem('authToken');

        if (token) {
          try {
            console.log('🔵 Fetching customer data after OTP verification...');
            const customerResponse = await fetch('https://api.bluechipfinmax.com/api/customer/get', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            const customerResult = await customerResponse.json();

            if (customerResponse.ok && customerResult.success && customerResult.data) {
              const profileData = customerResult.data;
              console.log('✅ Customer data fetched successfully');

              // Convert ISO date to YYYY-MM-DD format for input field
              const formatDateForInput = (isoDate: string) => {
                if (!isoDate) return '';
                try {
                  const date = new Date(isoDate);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                } catch (error) {
                  console.error('Error formatting date:', error);
                  return '';
                }
              };

              // Auto-fill form data from customer API response
              setFormData(prev => ({
                ...prev,
                fullName: profileData.fullName || prev.fullName,
                mobile: profileData.mobile || prev.mobile,
                email: profileData.email || prev.email,
                pan: profileData.panCard || prev.pan,
                aadhaar: profileData.aadhaarNumber || prev.aadhaar,
                dob: formatDateForInput(profileData.dateOfBirth) || prev.dob,
                employmentType: profileData.employmentType || prev.employmentType,
                monthlyIncome: profileData.monthlyIncome?.toString() || prev.monthlyIncome,
                companyName: profileData.companyName || prev.companyName,
                bankName: profileData.banks?.[0]?.bankName || prev.bankName,
                accountNumber: profileData.banks?.[0]?.accountNumber || prev.accountNumber,
                ifsc: profileData.banks?.[0]?.ifscCode || prev.ifsc,
              }));

              // Set verification flags from API if available
              if (profileData.isPanVerify) {
                setPanVerified(true);
                console.log('✅ PAN already verified');
              }
              if (profileData.isAadhaarVerify) {
                setAadhaarVerified(true);
                console.log('✅ Aadhaar already verified');
              }

              // Auto-fill references if available
              if (profileData.references && profileData.references.length > 0) {
                const ref1 = profileData.references[0];
                const ref2 = profileData.references[1];

                if (ref1) {
                  setFormData(prev => ({
                    ...prev,
                    reference1Name: ref1.name || prev.reference1Name,
                    reference1Mobile: ref1.mobile || prev.reference1Mobile,
                    reference1Relationship: ref1.relationship || prev.reference1Relationship,
                  }));
                }

                if (ref2) {
                  setFormData(prev => ({
                    ...prev,
                    reference2Name: ref2.name || prev.reference2Name,
                    reference2Mobile: ref2.mobile || prev.reference2Mobile,
                    reference2Relationship: ref2.relationship || prev.reference2Relationship,
                  }));
                }
                console.log('✅ References auto-filled');
              }

              console.log('🟢 Form auto-filled with customer data');
              toast({
                variant: "success",
                title: "Data Loaded!",
                description: "Your profile information has been auto-filled. Please review and proceed.",
              });
            } else {
              console.log('⚠️ Customer API returned no data');
            }
          } catch (error) {
            console.error('❌ Error fetching customer data:', error);
            // Non-blocking error - user can continue filling form manually
          }
        }
      } else {
        toast({
          variant: "error",
          title: "Verification Failed",
          description: data.message || 'Invalid OTP. Please try again.',
        });
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Verification Error",
        description: error.message || 'Failed to verify OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify PAN Card
  const verifyPAN = async () => {
    setPanError(""); // Clear previous errors

    if (!formData.pan) {
      const errorMsg = "Please enter a PAN number.";
      setPanError(errorMsg);
      toast({
        variant: "warning",
        title: "PAN Required",
        description: errorMsg,
      });
      return;
    }

    setPanVerifying(true);
    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      // Format DOB from YYYY-MM-DD to DD/MM/YYYY
      const formatDOBForAPI = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`; // Convert to DD/MM/YYYY
        }
        return dateStr;
      };

      const response = await fetch('https://api.bluechipfinmax.com/api/kyc/pan/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          pan_number: formData.pan,
          name: formData.fullName,
          dob: formatDOBForAPI(formData.dob)
        }),
      });

      const result = await response.json();

      // Check if API returned success
      if (result.success && result.data) {
        setPanVerified(true);
        setPanData(result.data);
        setPanError(""); // Clear any errors

        // Check verification status
        const panStatus = result.data.data?.status;
        const nameMatch = result.data.data?.name_as_per_pan_match;
        const dobMatch = result.data.data?.date_of_birth_match;

        let description = 'PAN verification successful!';
        let warningMsg = '';

        toast({
          variant: nameMatch && dobMatch ? "success" : "warning",
          title: "PAN Verified!",
          description: warningMsg ? `${description} ${warningMsg}` : description,
        });
      } else {
        // API returned error
        const errorMsg = result.message || 'Failed to verify PAN. Please check the PAN number and try again.';
        setPanError(errorMsg);
        toast({
          variant: "error",
          title: "Verification Failed",
          description: errorMsg,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to verify PAN. Please try again.';
      setPanError(errorMsg);
      toast({
        variant: "error",
        title: "Verification Error",
        description: errorMsg,
      });
    } finally {
      setPanVerifying(false);
    }
  };

  // Send Aadhaar OTP
  const sendAadhaarOTP = async () => {
    setAadhaarError(""); // Clear previous errors

    if (!formData.aadhaar || formData.aadhaar.length !== 12) {
      const errorMsg = "Please enter a valid 12-digit Aadhaar number.";
      setAadhaarError(errorMsg);
      toast({
        variant: "warning",
        title: "Invalid Aadhaar",
        description: errorMsg,
      });
      return;
    }

    setAadhaarVerifying(true);
    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      // Proceed with OTP send
      const response = await fetch('https://api.bluechipfinmax.com/api/kyc/aadhaar/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ aadhaar_number: formData.aadhaar }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAadhaarOtpSent(true);
        setAadhaarOtpTimer(60); // Start 60 second countdown
        setAadhaarError(""); // Clear any errors
        toast({
          variant: "success",
          title: "OTP Sent Successfully!",
          description: result.message || "OTP has been sent to your Aadhaar-linked mobile number. Please enter it below.",
        });
      } else {
        const errorMsg = result.message || result.error || 'Unable to send OTP. Please check the Aadhaar number and try again.';
        setAadhaarError(errorMsg);
        toast({
          variant: "error",
          title: "OTP Send Failed",
          description: errorMsg,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Network error. Please check your connection and try again.';
      setAadhaarError(errorMsg);
      toast({
        variant: "error",
        title: "Error Sending OTP",
        description: errorMsg,
      });
    } finally {
      setAadhaarVerifying(false);
    }
  };

  // Verify Aadhaar OTP
  const verifyAadhaarOTP = async () => {
    if (!aadhaarOtp || aadhaarOtp.length !== 6) {
      const errorMsg = "Please enter a valid 6-digit OTP.";
      setAadhaarError(errorMsg);
      toast({
        variant: "warning",
        title: "Invalid OTP",
        description: errorMsg,
      });
      return;
    }

    setAadhaarVerifying(true);
    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      const response = await fetch('https://api.bluechipfinmax.com/api/kyc/aadhaar/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ otp: aadhaarOtp }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setAadhaarVerified(true);
        setAadhaarData(result.data);
        setAadhaarError(""); // Clear any errors
        setAadhaarOtp(""); // Clear OTP field

        // Parse date format from DD-MM-YYYY to YYYY-MM-DD
        const formatDOB = (dateStr: string) => {
          if (!dateStr) return '';
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
          }
          return dateStr;
        };

        // Auto-fill name, DOB from Aadhaar data
        setFormData(prev => ({
          ...prev,
          fullName: result.data.name || prev.fullName,
          dob: formatDOB(result.data.date_of_birth) || prev.dob
        }));

        // Store address data for later use (will be saved on Next button click)
        if (result.data.address) {
          setAadhaarAddress(result.data.address);
          console.log('✅ Aadhaar verified successfully');
          console.log('📊 Address data stored:', result.data.address);
        }

        toast({
          variant: "success",
          title: "Aadhaar Verified Successfully! ✓",
          description: `Aadhaar verified for ${result.data.name}. Your details have been auto-filled.`,
        });
      } else {
        const errorMsg = result.message || result.error || 'Invalid OTP. Please check and try again.';
        setAadhaarError(errorMsg);
        toast({
          variant: "error",
          title: "Verification Failed",
          description: errorMsg,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Network error. Please check your connection and try again.';
      setAadhaarError(errorMsg);
      toast({
        variant: "error",
        title: "Verification Error",
        description: errorMsg,
      });
    } finally {
      setAadhaarVerifying(false);
    }
  };

  const captureSelfi = () => {
    setSelfieCapture(true);
  };

  const handleSelfieCapture = (imageFile: File) => {
    // Validate image file
    if (!imageFile) {
      toast({
        variant: "error",
        title: "Invalid Selfie",
        description: "Please capture a valid selfie photo.",
      });
      return;
    }

    // Check file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      toast({
        variant: "error",
        title: "File Too Large",
        description: "Selfie photo must be less than 5MB.",
      });
      return;
    }

    // Check file type
    if (!imageFile.type.startsWith('image/')) {
      toast({
        variant: "error",
        title: "Invalid File Type",
        description: "Please capture a valid image file.",
      });
      return;
    }

    // Validate image is not blank/empty by checking file size
    if (imageFile.size < 1000) { // Less than 1KB is likely a blank/corrupt image
      toast({
        variant: "error",
        title: "Blank Image Detected",
        description: "The selfie appears to be blank. Please capture a clear photo of your face.",
      });
      return;
    }

    // Store the file in form data
    setFormData(prev => ({ ...prev, selfie: imageFile }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(imageFile);
    setSelfiePreview(previewUrl);
    setSelfieCaptured(true);

    toast({
      variant: "success",
      title: "Selfie Captured Successfully! ✓",
      description: "Your selfie has been captured and validated.",
    });
  };

  const handleCloseSelfieModal = () => {
    setSelfieCapture(false);
  };

  // Save customer data to backend via loan application API
  const saveCustomerData = async (step: number) => {
    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      if (!token) {
        console.warn('No token found, skipping customer data save');
        return false;
      }

      let payload: any = {
        isSubmit: false
      };

      if (step === 1) {
        // Step 1: Basic Details (with verified PAN & Aadhaar data)
        const nameParts = formData.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        payload = {
          firstName,
          lastName,
          mobile: formData.mobile,
          dateOfBirth: formData.dob,
          panCard: formData.pan,
          aadhaarNumber: formData.aadhaar,
          isBasicDetailsFilled: true,
          isSubmit: false
        };

        // Add address from Aadhaar if available
        if (aadhaarAddress) {
          payload.currentAddress = {
            street: `${aadhaarAddress.house || ''} ${aadhaarAddress.street || ''}`.trim(),
            city: aadhaarAddress.locality || aadhaarAddress.district || '',
            state: aadhaarAddress.state || '',
            pincode: aadhaarAddress.pincode || ''
          };
          console.log('📍 Saving address from Aadhaar:', payload.currentAddress);
        }

        // Add PAN verification data if available
        if (panData?.data) {
          console.log('🆔 Saving PAN verification data');
        }
      } else if (step === 2) {
        // Step 2: Employment & Bank Details
        payload = {
          employmentType: formData.employmentType,
          monthlyIncome: parseFloat(formData.monthlyIncome),
          companyName: formData.companyName,
          isEmploymentDetailsFilled: true,
          isSubmit: false
        };

        // Add bank details if provided
        if (formData.bankName && formData.accountNumber && formData.ifsc) {
          payload.banks = [{
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            accountType: 'Savings',
            accountHolderName: formData.fullName
          }];
        }
      } else if (step === 3) {
        // Step 3: Verification & Consent Details
        payload = {
          isVerificationDetailsFilled: true,
          isSubmit: false
        };
      }

      const response = await fetch(`https://api.bluechipfinmax.com/api/application/loan/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // Store IDs if this is first save
      if (result.data) {
        if (result.data.customerId) localStorage.setItem('userId', result.data.customerId);
        if (result.data.applicationNumber) localStorage.setItem('applicationId', result.data.applicationNumber);
        if (result.data.loanNumber) localStorage.setItem('loanNumber', result.data.loanNumber);
      }

      if (response.ok && result.success) {
        console.log(`✅ Step ${step} data saved successfully`);
        return true;
      } else {
        console.error(`❌ Failed to save step ${step} data:`, result.message);
        toast({
          variant: "error",
          title: "Data Save Failed",
          description: result.message || `Failed to save step ${step} data. Please check your information and try again.`,
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error saving customer data:', error);
      toast({
        variant: "error",
        title: "Network Error",
        description: error.message || "Unable to connect to server. Please check your internet connection and try again.",
      });
      return false;
    }
  };

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1) {
      // Clear previous errors
      const errors = {
        email: "",
        mobile: "",
        fullName: "",
        dob: "",
        aadhaar: "",
        pan: "",
        accountNumber: "",
        ifsc: ""
      };
      let hasError = false;

      // For logged-in users, skip verification check
      const isVerified = user ? true : (verificationMethod === 'email' ? formData.emailVerified : formData.mobileVerified);

      // Verification check for non-logged in users
      if (!user && !isVerified) {
        toast({
          variant: "warning",
          title: "Verification Required",
          description: "Please verify your email or mobile to proceed.",
        });
        return;
      }

      // Full Name validation
      if (!formData.fullName) {
        errors.fullName = "Full name is required";
        hasError = true;
      } else if (formData.fullName.trim().length < 3) {
        errors.fullName = "Full name must be at least 3 characters";
        hasError = true;
      } else if (/\d/.test(formData.fullName)) {
        errors.fullName = "Full name cannot contain numbers";
        hasError = true;
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
        errors.fullName = "Full name can only contain letters and spaces";
        hasError = true;
      }

      // Email validation
      if (!formData.email) {
        errors.email = "Email is required";
        hasError = true;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errors.email = "Please enter a valid email address";
          hasError = true;
        }
      }

      // Mobile validation
      if (!formData.mobile) {
        errors.mobile = "Mobile number is required";
        hasError = true;
      } else if (!/^\d+$/.test(formData.mobile)) {
        errors.mobile = "Mobile number can only contain numbers";
        hasError = true;
      } else if (formData.mobile.length !== 10) {
        errors.mobile = "Mobile number must be exactly 10 digits";
        hasError = true;
      } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        errors.mobile = "Enter a valid mobile number starting with 6-9";
        hasError = true;
      }

      // DOB validation
      if (!formData.dob) {
        errors.dob = "Date of birth is required";
        hasError = true;
      } else {
        // Age validation (must be 18+)
        const dob = new Date(formData.dob);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18 || (age === 18 && today < new Date(dob.setFullYear(dob.getFullYear() + 18)))) {
          errors.dob = "You must be at least 18 years old";
          hasError = true;
        }
      }

      // Aadhaar validation - only validate if not already verified
      if (!formData.aadhaar) {
        errors.aadhaar = "Aadhaar number is required";
        hasError = true;
      } else if (!aadhaarVerified) {
        // Only check format and ask for verification if not already verified
        const aadhaarRegex = /^\d{12}$/;
        if (!aadhaarRegex.test(formData.aadhaar)) {
          errors.aadhaar = "Enter a valid 12-digit Aadhaar number";
          hasError = true;
        } else {
          errors.aadhaar = "Please verify your Aadhaar";
          hasError = true;
        }
      }

      // PAN validation - only validate if not already verified
      if (!formData.pan) {
        errors.pan = "PAN number is required";
        hasError = true;
      } else if (!panVerified) {
        errors.pan = "Please verify your PAN";
        hasError = true;
      }

      // Update field errors
      setFieldErrors(errors);

      // If there are errors, don't proceed
      if (hasError) {
        return;
      }

      // Save Step 1 data before proceeding
      setLoading(true);
      const saveSuccess = await saveCustomerData(1);
      setLoading(false);

      // If save failed, don't proceed to next step
      if (!saveSuccess) {
        toast({
          variant: "error",
          title: "Cannot Proceed",
          description: "Please fix the errors before moving to the next step.",
        });
        return;
      }
    }

    if (currentStep === 2) {
      // Employment Type validation
      if (!formData.employmentType) {
        toast({
          variant: "warning",
          title: "Employment Type Required",
          description: "Please select your employment type.",
        });
        return;
      }

      // Monthly Income validation
      if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
        toast({
          variant: "warning",
          title: "Invalid Monthly Income",
          description: "Please enter a valid monthly income.",
        });
        return;
      }

      if (parseFloat(formData.monthlyIncome) < 10000) {
        toast({
          variant: "warning",
          title: "Minimum Income Required",
          description: "Minimum monthly income should be ₹10,000.",
        });
        return;
      }

      // Company Name validation
      if (!formData.companyName || formData.companyName.trim().length < 2) {
        toast({
          variant: "warning",
          title: "Company Name Required",
          description: "Please enter your company name.",
        });
        return;
      }

      // Bank Name validation
      if (!formData.bankName) {
        toast({
          variant: "warning",
          title: "Bank Name Required",
          description: "Please select your bank name.",
        });
        return;
      }

      // Account Number validation (if provided)
      if (formData.accountNumber) {
        const accountRegex = /^[0-9]{9,18}$/;
        if (!accountRegex.test(formData.accountNumber)) {
          setFieldErrors(prev => ({
            ...prev,
            accountNumber: "Account number must be 9-18 digits"
          }));
          return;
        }
      }

      // IFSC Code validation (if provided)
      if (formData.ifsc) {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(formData.ifsc.toUpperCase())) {
          setFieldErrors(prev => ({
            ...prev,
            ifsc: "Invalid IFSC code format (e.g., SBIN0001234)"
          }));
          return;
        }
      }

      // Save Step 2 data before proceeding
      setLoading(true);
      const saveSuccess = await saveCustomerData(2);
      setLoading(false);

      // If save failed, don't proceed to next step
      if (!saveSuccess) {
        toast({
          variant: "error",
          title: "Cannot Proceed",
          description: "Please fix the errors before moving to the next step.",
        });
        return;
      }
    }

    if (currentStep === 3) {
      // Loan Product validation
      if (!formData.productId) {
        toast({
          variant: "warning",
          title: "Loan Product Required",
          description: "Please select a loan product.",
        });
        return;
      }

      // Loan Amount validation
      if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
        toast({
          variant: "warning",
          title: "Invalid Loan Amount",
          description: "Please enter a valid loan amount.",
        });
        return;
      }

      const loanAmount = parseFloat(formData.loanAmount);
      if (loanAmount < 10000) {
        toast({
          variant: "warning",
          title: "Minimum Loan Amount",
          description: "Minimum loan amount is ₹10,000.",
        });
        return;
      }

      if (loanAmount > 10000000) {
        toast({
          variant: "warning",
          title: "Maximum Loan Amount",
          description: "Maximum loan amount is ₹1,00,00,000.",
        });
        return;
      }

      // Reference 1 validation
      if (!formData.reference1Name || formData.reference1Name.trim().length < 3) {
        toast({
          variant: "warning",
          title: "Reference 1 Name Required",
          description: "Please enter reference 1 full name.",
        });
        return;
      }

      const ref1MobileRegex = /^[6-9]\d{9}$/;
      if (!formData.reference1Mobile || !ref1MobileRegex.test(formData.reference1Mobile)) {
        toast({
          variant: "warning",
          title: "Invalid Reference 1 Mobile",
          description: "Please enter a valid 10-digit mobile number for reference 1.",
        });
        return;
      }

      if (!formData.reference1Relationship) {
        toast({
          variant: "warning",
          title: "Reference 1 Relationship Required",
          description: "Please select relationship with reference 1.",
        });
        return;
      }

      // Reference 2 validation
      if (!formData.reference2Name || formData.reference2Name.trim().length < 3) {
        toast({
          variant: "warning",
          title: "Reference 2 Name Required",
          description: "Please enter reference 2 full name.",
        });
        return;
      }

      const ref2MobileRegex = /^[6-9]\d{9}$/;
      if (!formData.reference2Mobile || !ref2MobileRegex.test(formData.reference2Mobile)) {
        toast({
          variant: "warning",
          title: "Invalid Reference 2 Mobile",
          description: "Please enter a valid 10-digit mobile number for reference 2.",
        });
        return;
      }

      if (!formData.reference2Relationship) {
        toast({
          variant: "warning",
          title: "Reference 2 Relationship Required",
          description: "Please select relationship with reference 2.",
        });
        return;
      }

      // Check if reference mobiles are different
      if (formData.reference1Mobile === formData.reference2Mobile) {
        toast({
          variant: "warning",
          title: "Duplicate Reference Mobile",
          description: "Reference 1 and Reference 2 must have different mobile numbers.",
        });
        return;
      }

      // Selfie validation
      if (!formData.selfie || !selfieCaptured) {
        toast({
          variant: "warning",
          title: "Selfie Required",
          description: "Please capture your selfie.",
        });
        return;
      }

      // Consent validation
      if (!formData.creditBureauConsent || !formData.termsConsent) {
        setConsentError(true);
        return;
      }

      // Clear consent error if validation passes
      setConsentError(false);

      // Final step - submit only Step 3 data (Step 1 & 2 already saved)
      setLoading(true);

      try {
        const token = localStorage.getItem('accessToken') ||
                      localStorage.getItem('token') ||
                      localStorage.getItem('authToken');

        if (!token) {
          toast({
            variant: "error",
            title: "Authentication Error",
            description: "Please login to continue.",
          });
          setLoading(false);
          return;
        }

        // Use the correctly calculated EMI from emiCalculation
        const principal = parseFloat(formData.loanAmount);
        const tenureValue = parseInt(formData.tenure);
        const tenureUnit = formData.requestedTenureUnit;
        const emi = emiCalculation?.emi || 0;

        // Validate that EMI has been calculated
        if (!emi || !emiCalculation) {
          toast({
            variant: "error",
            title: "EMI Calculation Error",
            description: "Please ensure loan amount and tenure are properly set.",
          });
          setLoading(false);
          return;
        }

        // Create FormData to include selfie file
        const formDataToSend = new FormData();

        // Add loan application data
        formDataToSend.append('loanAmount', principal.toString());
        formDataToSend.append('requestedTenure', tenureValue.toString());
        formDataToSend.append('requestedTenureUnit', tenureUnit);
        formDataToSend.append('emiAmount', emi.toString());
        formDataToSend.append('purpose', formData.purpose);
        formDataToSend.append('productId', formData.productId);

        // Add product details (interestRate, processingFee, gstOnProcessingFee)
        if (selectedProduct) {
          formDataToSend.append('interestRate', selectedProduct.dailyInterestRate.toString());
          formDataToSend.append('processingFee', selectedProduct.processingFee.toString());
          formDataToSend.append('gstOnProcessingFee', selectedProduct.gst.toString());
        }

        formDataToSend.append('isVerificationDetailsFilled', 'true');
        formDataToSend.append('isSubmit', 'true');

        // Add references as JSON string
      const references = [
  {
    name: formData.reference1Name,
    mobile: formData.reference1Mobile,
    relationship: formData.reference1Relationship
  },
  {
    name: formData.reference2Name,
    mobile: formData.reference2Mobile,
    relationship: formData.reference2Relationship
  }
];

references.forEach((ref, index) => {
  formDataToSend.append(`references[${index}][name]`, ref.name);
  formDataToSend.append(`references[${index}][mobile]`, ref.mobile);
  formDataToSend.append(`references[${index}][relationship]`, ref.relationship);
});


        // Add selfie photo file
        if (formData.selfie) {
          formDataToSend.append('photo', formData.selfie, formData.selfie.name);
          console.log('✅ Adding selfie photo to form data:', formData.selfie.name);
        }

        const response = await fetch(`https://api.bluechipfinmax.com/api/application/loan/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Note: Do NOT set Content-Type header when sending FormData
            // Browser will automatically set it with boundary
          },
          body: formDataToSend
        });

        const result = await response.json();

        // Check if API call was successful
        if (response.ok && result.success) {
          console.log('✅ Loan application submitted successfully');
          console.log('📊 Response:', result);

          // Store IDs from response
          if (result.data) {
            if (result.data.customerId) localStorage.setItem('userId', result.data.customerId);
            if (result.data.applicationNumber) localStorage.setItem('applicationId', result.data.applicationNumber);
            if (result.data.loanNumber) localStorage.setItem('loanNumber', result.data.loanNumber);
          }

          // Use API response for decision
          setDecision({
            approved: true,
            apiResponse: result.data,
            approvedAmount: principal,
            interestRate: 12.5,
            tenure: emiCalculation.tenureMonths,
            tenureUnit: tenureUnit,
            emi: emi,
            processingFee: Math.round(principal * 0.02)
          });
        } else {
          // API returned error
          console.error('❌ Loan application failed:', result.message);
          toast({
            variant: "error",
            title: "Application Failed",
            description: result.message || "Failed to submit loan application. Please try again.",
          });

          // Use local decision engine as fallback
          const decisionResult = autoDecisionEngine({
            monthlyIncome: parseFloat(formData.monthlyIncome),
            loanAmount: principal,
            pan: formData.pan,
            aadhaar: formData.aadhaar,
            tenure: emiCalculation.tenureMonths
          });
          setDecision(decisionResult);
        }
      } catch (error) {
        console.error('Error submitting loan application:', error);
        // Fallback to local decision engine
        const result = autoDecisionEngine({
          monthlyIncome: parseFloat(formData.monthlyIncome),
          loanAmount: parseFloat(formData.loanAmount),
          pan: formData.pan,
          aadhaar: formData.aadhaar,
          tenure: parseInt(formData.tenure)
        });
        setDecision(result);
      }

      setLoading(false);
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleESign = async () => {
    setLoading(true);
    // Simulate e-sign process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);

    // Redirect to dashboard
    toast({
      variant: "success",
      title: "Loan Approved & Disbursed!",
      description: "Your loan amount will be credited to your bank account within 24 hours.",
    });

    setTimeout(() => {
      router.push("/user");
    }, 1500);
  };

  // Show loading screen during verification
  if (loading && currentStep === 3 && !decision) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md"
        >
          <Loader2 className="w-16 h-16 text-[#25B181] animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying your details...</h2>
          <p className="text-gray-600 mb-6">
            We're checking your credit profile, employment history, and banking information. This will only take a moment.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Credit bureau check
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Employment verification
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              Final approval...
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show decision screen
  if (decision) {
    if (decision.approved) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations! 🎉</h1>
              <p className="text-xl text-green-600 font-semibold">Your loan has been submitted successfully!</p>
            </div>

            <div className="bg-gradient-to-r from-[#25B181]/10 via-[#51C9AF]/10 to-[#1F8F68]/10 border-2 border-[#25B181] rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-gray-700 mb-2">
                  Our team will review your application and get back to you soon.
                </p>
                <p className="text-sm text-gray-600">
                  Redirecting to {user ? 'dashboard' : 'login'} in <span className="font-bold text-[#25B181] text-lg">{redirectCountdown}</span> seconds...
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (user) {
                    router.push('/user');
                  } else {
                    router.push('/login');
                  }
                }}
                className="flex-1 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {user ? 'Go to Dashboard Now' : 'Login to Continue'}
              </button>
            </div>

            {/* <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-xl p-6 text-white mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90">Approved Amount</p>
                  <p className="text-3xl font-bold">₹{decision.approvedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Monthly EMI</p>
                  <p className="text-3xl font-bold">₹{decision.emi.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Interest Rate</p>
                  <p className="text-xl font-semibold">{decision.interestRate}% p.d.</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Tenure</p>
                  <p className="text-xl font-semibold">{decision.tenure} months</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Loan Breakdown</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Loan Amount</span>
                <span className="font-semibold">₹{decision.approvedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Fee (2%)</span>
                <span className="font-semibold">₹{decision.processingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Interest</span>
                <span className="font-semibold">₹{((decision.emi * decision.tenure) - decision.approvedAmount).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total Payable</span>
                <span className="text-[#25B181]">₹{(decision.emi * decision.tenure).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Next Step: E-Sign your loan agreement</p>
                  <p>Complete the digital signature to instantly disburse your loan amount to your bank account.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleESign}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Sign & Get Money
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By signing, you agree to our loan terms and conditions
            </p> */}
          </motion.div>
        </div>
      );
    } else {
      // Rejected
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Approve</h1>
              <p className="text-gray-600">We couldn't approve your loan application at this time</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-red-900 mb-2">Reason:</p>
              <p className="text-sm text-red-800">{decision.reason}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">What you can do:</p>
              <p className="text-sm text-blue-800">{decision.suggestedAction}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setDecision(null);
                  setCurrentStep(1);
                  setFormData({
                    mobile: "",
                    otp: "",
                    mobileVerified: false,
                    emailVerified: false,
                    fullName: "",
                    pan: "",
                    aadhaar: "",
                    dob: "",
                    email: "",
                    employmentType: "SALARIED",
                    monthlyIncome: "",
                    companyName: "",
                    bankName: "",
                    accountNumber: "",
                    ifsc: "",
                    loanAmount: "",
                    tenure: "12",
                    requestedTenureUnit: "months",
                    productId: "",
                    purpose: "",
                    reference1Name: "",
                    reference1Mobile: "",
                    reference1Relationship: "",
                    reference2Name: "",
                    reference2Mobile: "",
                    reference2Relationship: "",
                    selfie: null,
                    creditBureauConsent: false,
                    termsConsent: false,
                    eSignConsent: false
                  });
                }}
                className="w-full bg-[#25B181] text-white py-3 rounded-xl font-semibold hover:bg-[#1d8f6a] transition-all"
              >
                Try Again with Different Details
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
  }

  // Main application form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] py-8 px-4">
      <Toaster />

      {/* Selfie Capture Modal */}
      <SelfieCapture
        isOpen={selfieCapture}
        onClose={handleCloseSelfieModal}
        onCapture={handleSelfieCapture}
      />
      <div className="max-w-3xl mx-auto">
        {/* Close button - redirect based on login status */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              if (user) {
                router.push('/user'); // Redirect to dashboard if logged in
              } else {
                router.push('/login'); // Redirect to login if not logged in
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
            <span className="text-sm font-medium">Close</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0.8, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quick Loan Application</h1>
            <p className="text-gray-600">Get instant approval in just 3 minutes</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full transition-all ${
                  step <= currentStep ? 'bg-[#25B181]' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className={currentStep === 1 ? 'text-[#25B181] font-semibold' : ''}>Basic Details</span>
            <span className={currentStep === 2 ? 'text-[#25B181] font-semibold' : ''}>Employment & Bank</span>
            <span className={currentStep === 3 ? 'text-[#25B181] font-semibold' : ''}>Verification</span>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0.9, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.9, x: -5 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.9 }}
                transition={{ duration: 0.1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Details (1 minute)</h2>

                {/* Logged in user notice - Show instead of verification */}
                {user && userDataLoaded && (formData.emailVerified || formData.mobileVerified) ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800">Welcome back, {formData.fullName}!</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your account is already verified. Your details have been pre-filled from your profile. Please review and proceed to the next step.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Verification Method Toggle - Only show for non-logged in users */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Choose Verification Method *
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationMethod('email');
                            setOtpSent(false);
                            setFormData(prev => ({ ...prev, otp: '' })); // Clear OTP field
                          }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            verificationMethod === 'email'
                              ? 'bg-[#25B181] text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#25B181]'
                          }`}
                        >
                          <Mail className="w-5 h-5 inline mr-2" />
                          Verify with Email
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationMethod('mobile');
                            setOtpSent(false);
                            setFormData(prev => ({ ...prev, otp: '' })); // Clear OTP field
                          }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            verificationMethod === 'mobile'
                              ? 'bg-[#25B181] text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#25B181]'
                          }`}
                        >
                          <Phone className="w-5 h-5 inline mr-2" />
                          Verify with Mobile
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Verification - Only show for non-logged in users */}
                {!user && verificationMethod === 'email' && (
                  <>
                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address *
  </label>

  <div className="flex gap-2">
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={(e) => {
        const value = e.target.value;

        setFormData((prev) => ({ ...prev, email: value }));

        // Email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
          setFieldErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email address",
          }));
        } else {
          setFieldErrors((prev) => ({ ...prev, email: "" }));
        }
      }}
      disabled={formData.emailVerified}
      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 ${
        fieldErrors.email ? "border-red-500" : "border-gray-300"
      }`}
      placeholder="your@email.com"
    />

    {/* Send/Resend OTP button (only if not verified) */}
    {!formData.emailVerified && (
      <button
        onClick={async () => {
          const email = formData.email;
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          // Validate email before sending OTP
          if (!regex.test(email)) {
            setFieldErrors((prev) => ({
              ...prev,
              email: "Please enter a valid email address",
            }));
            return;
          }

          // Clear error
          setFieldErrors((prev) => ({ ...prev, email: "" }));

          setLoading(true);
          try {
            await sendOTP(); // call your API
          } finally {
            setLoading(false);
          }
        }}
        disabled={!formData.email || !!fieldErrors.email || loading || (otpSent && emailOtpTimer > 0)}
        className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50"
      >
        {loading ? "Sending..." : otpSent ? (emailOtpTimer > 0 ? `Resend (${emailOtpTimer}s)` : "Resend OTP") : "Send OTP"}
      </button>
    )}

    {/* If email verified show green check */}
    {formData.emailVerified && (
      <CheckCircle className="w-10 h-10 text-green-600" />
    )}
  </div>

  {/* Error or helper text */}
  {fieldErrors.email ? (
    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
  ) : (
    <p className="mt-1 text-xs text-gray-500">
      We'll use this email for all loan communication
    </p>
  )}
</div>


                    {!formData.emailVerified && otpSent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter OTP *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            maxLength={6}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                            placeholder="Enter 6-digit OTP"
                          />
                          <button
                            onClick={verifyOTP}
                            disabled={formData.otp.length !== 6 || loading}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Mobile Verification - Only show for non-logged in users */}
                {!user && verificationMethod === 'mobile' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          disabled={formData.mobileVerified}
                          maxLength={10}
                          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 ${
                            fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="enter mobile number"
                        />
                        {!formData.mobileVerified && (
                          <button
                            onClick={sendOTP}
                            disabled={!formData.mobile || loading || (otpSent && emailOtpTimer > 0)}
                            className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50"
                          >
                            {loading ? "Sending..." : otpSent ? (emailOtpTimer > 0 ? `Resend (${emailOtpTimer}s)` : "Resend OTP") : "Send OTP"}
                          </button>
                        )}
                        {formData.mobileVerified && (
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        )}
                      </div>
                      {fieldErrors.mobile && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                      )}
                    </div>

                    {!formData.mobileVerified && otpSent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter OTP *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            maxLength={6}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                            placeholder="Enter 6-digit OTP"
                          />
                          <button
                            onClick={verifyOTP}
                            disabled={formData.otp.length !== 6 || loading}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                      fieldErrors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Show additional fields - always show both for logged-in users */}
                {user ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={formData.emailVerified}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                          fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                        } ${formData.emailVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="your@email.com"
                      />
                      {fieldErrors.email ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">For email notifications and loan documents</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        disabled={formData.mobileVerified}
                        maxLength={10}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                          fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                        } ${formData.mobileVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="+91 98765 43210"
                      />
                      {fieldErrors.mobile ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">For SMS notifications</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {verificationMethod === 'email' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          maxLength={10}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                            fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {fieldErrors.mobile ? (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-500">For SMS notifications</p>
                        )}
                      </div>
                    )}

                    {verificationMethod === 'mobile' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={formData.emailVerified}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                            fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                          } ${formData.emailVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="your@email.com"
                        />
                        {fieldErrors.email ? (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-500">For email notifications and loan documents</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Date of Birth - ABOVE Aadhaar and PAN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={(() => {
                      const date = new Date();
                      date.setFullYear(date.getFullYear() - 18);
                      return date.toISOString().split('T')[0];
                    })()}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                      fieldErrors.dob ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {fieldErrors.dob && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.dob}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Aadhaar Verification - FIRST */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number *
                    </label>
                    
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={(e) => {
                          handleChange(e);
                          if (aadhaarVerified || aadhaarOtpSent) {
                            setAadhaarVerified(false);
                            setAadhaarOtpSent(false);
                            setAadhaarOtp("");
                          }
                          if (aadhaarError) setAadhaarError(""); // Clear error when typing
                        }}
                        disabled={aadhaarVerified || aadhaarOtpSent || (!formData.mobileVerified && !formData.emailVerified)}
                        maxLength={12}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          fieldErrors.aadhaar || aadhaarError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123456789012"
                      />
                      {!aadhaarVerified && (
                        <button
                          type="button"
                          onClick={sendAadhaarOTP}
                          disabled={!formData.aadhaar || formData.aadhaar.length !== 12 || aadhaarVerifying || (!formData.mobileVerified && !formData.emailVerified) || (aadhaarOtpSent && aadhaarOtpTimer > 0)}
                          className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {aadhaarVerifying ? "Sending..." : aadhaarOtpSent ? (aadhaarOtpTimer > 0 ? `Resend (${aadhaarOtpTimer}s)` : "Resend OTP") : "Send OTP"}
                        </button>
                      )}
                      {aadhaarVerified && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">Verified</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAadhaarVerified(false);
                              setAadhaarOtpSent(false);
                              setAadhaarOtp("");
                              setAadhaarData(null);
                              setAadhaarAddress(null);
                            }}
                            className="px-3 py-2 text-xs text-[#25B181] border border-[#25B181] rounded-lg hover:bg-[#25B181] hover:text-white transition-colors"
                          >
                            Reverify
                          </button>
                        </div>
                      )}
                    </div>
                    {aadhaarVerified && aadhaarData && (
                      <p className="mt-2 text-xs text-green-700">
                        ✓ Verified for {aadhaarData.name}
                      </p>
                    )}

                    {/* Aadhaar OTP Input */}
                    {aadhaarOtpSent && !aadhaarVerified && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Aadhaar OTP *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aadhaarOtp}
                            onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                            maxLength={6}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                            placeholder="Enter 6-digit OTP"
                          />
                          <button
                            type="button"
                            onClick={verifyAadhaarOTP}
                            disabled={aadhaarOtp.length !== 6 || aadhaarVerifying}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                          >
                            {aadhaarVerifying ? "Verifying..." : "Verify OTP"}
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          OTP sent to Aadhaar-linked mobile
                        </p>
                      </div>
                    )}

                    {/* Show warning if mobile/email not verified */}
                    {!formData.mobileVerified && !formData.emailVerified && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Please verify your {verificationMethod === 'email' ? 'email' : 'mobile'} first to enable Aadhaar verification
                        </p>
                        
                      </div>
                    )}

                    {/* Aadhaar Error Message */}
                    {(aadhaarError || fieldErrors.aadhaar) && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{aadhaarError || fieldErrors.aadhaar}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* PAN Verification - SECOND (After Aadhaar) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={(e) => {
                          handleChange(e);
                          if (panVerified) setPanVerified(false);
                          if (panError) setPanError("");
                        }}
                        disabled={!aadhaarVerified || panVerified}
                        maxLength={10}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 uppercase ${
                          fieldErrors.pan || panError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ABCDE1234F"
                      />
                      {!panVerified && (
                        <button
                          type="button"
                          onClick={verifyPAN}
                          disabled={!aadhaarVerified || !formData.pan || formData.pan.length !== 10 || panVerifying}
                          className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap"
                        >
                          {panVerifying ? "Verifying..." : "Verify"}
                        </button>
                      )}
                      {panVerified && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">Verified</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPanVerified(false);
                              setPanData(null);
                              setPanError("");
                            }}
                            className="px-3 py-2 text-xs text-[#25B181] border border-[#25B181] rounded-lg hover:bg-[#25B181] hover:text-white transition-colors"
                          >
                            Reverify
                          </button>
                        </div>
                      )}
                    </div>
                    {!aadhaarVerified && (
                      <p className="mt-2 text-xs text-orange-600">
                        ⚠ Please verify Aadhaar first before verifying PAN
                      </p>
                    )}
                    {panVerified && panData && (
                      <p className="mt-2 text-xs text-green-700">
                        ✓ Verified for {panData.data?.pan || 'PAN holder'}
                      </p>
                    )}
                    {(panError || fieldErrors.pan) && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{panError || fieldErrors.pan}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Employment & Bank */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Employment & Bank (1 minute)</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                  >
                    <option value="SALARIED">SALARIED</option>
                    <option value="SELF-EMPLOYED">SELF-EMPLOYED</option>
                     <option value="UNEMPLOYED">UNEMPLOYED</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value= "RETIRED">RETIRED</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income *
                    </label>
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                      placeholder="₹ 50,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                    >
                      <option value="">Select Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="PNB">Punjab National Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="number"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      pattern="[0-9]{9,18}"
                      minLength={9}
                      maxLength={18}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                        fieldErrors.accountNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9-18 digit account number"
                    />
                    {fieldErrors.accountNumber ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.accountNumber}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Enter 9-18 digit bank account number</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleChange}
                    pattern="[A-Z]{4}0[A-Z0-9]{6}"
                    maxLength={11}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                      fieldErrors.ifsc ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SBIN0001234"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {fieldErrors.ifsc ? (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.ifsc}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">11-character bank code (e.g., SBIN0001234)</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Verification & Consent */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Details & References (1 minute)</h2>

                {/* Loan Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Loan Product *
                  </label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                    disabled={loadingProducts}
                  >
                    <option value="">
                      {loadingProducts ? 'Loading products...' : 'Select a loan product'}
                    </option>
                    {loanProducts.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.productName} - {product.category} (Rate: {product.dailyInterestRate}% daily)
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Daily Interest Rate:</span> {selectedProduct.dailyInterestRate}% |
                        <span className="font-semibold ml-2">Processing Fee:</span> {selectedProduct.processingFee}% |
                        <span className="font-semibold ml-2">GST:</span> {selectedProduct.gst}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount *
                    </label>
                    <input
                      type="text"
                      name="loanAmount"
                      value={formData.loanAmount ? parseFloat(formData.loanAmount.replace(/,/g, '')).toLocaleString('en-IN') : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (/^\d*$/.test(value)) {
                          handleChange({
                            ...e,
                            target: {
                              ...e.target,
                              name: 'loanAmount',
                              value: value
                            }
                          } as any);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                      placeholder="₹ 50,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenure *
                    </label>
                    <div className="grid grid-cols-2 gap-3">

 {/* Tenure Value Selector - Changes based on unit */}
                        <input
                          type="number"
                          name="tenure"
                          value={formData.tenure}
                          onChange={handleChange}
                          min="1"
                          max="365"
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                          placeholder="Enter days (1-365)"
                        />

                      {/* Tenure Unit Selector */}
                      <select
                        name="requestedTenureUnit"
                        value={formData.requestedTenureUnit}
                        onChange={handleChange}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] bg-white"
                      >
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                      </select>
                   
                    </div>
                    {formData.requestedTenureUnit === 'days' && parseInt(formData.tenure) <= 45 && parseInt(formData.tenure) > 0 && (
                      <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Loans with tenure ≤ 45 days require lump sum payment (no EMI)
                      </p>
                    )}
                  </div>
                </div>

                {/* EMI Calculation Display */}
                {emiCalculation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-lg"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="w-5 h-5 text-green-600 mr-2" />
                      {emiCalculation.isLumpSum ? 'Repayment Calculation' : 'EMI Calculation Details'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Principal Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{emiCalculation.principal.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">
                          {emiCalculation.isLumpSum ? 'Lump Sum Payment' : 'Monthly EMI'}
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{emiCalculation.emi.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {emiCalculation.isLumpSum && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>This loan requires <strong>full payment at once</strong> (tenure ≤ 45 days)</span>
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Total Interest</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{emiCalculation.totalInterest.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          @ {emiCalculation.dailyInterestRate}% daily
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Processing Fee</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{emiCalculation.processingFee.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">GST</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{emiCalculation.gst.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm opacity-90 mb-1">Total Amount Payable</p>
                          <p className="text-3xl font-bold">
                            ₹{emiCalculation.totalAmount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs opacity-80 mt-1">
                            Over {emiCalculation.tenureMonths} months ({emiCalculation.totalDays} days)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm opacity-90 mb-1">Processing Fee (incl. GST)</p>
                          <p className="text-xl font-bold">
                            ₹{emiCalculation.totalProcessingFee.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <span className="font-semibold">Note:</span> This is an indicative calculation. Final EMI may vary based on approval terms and conditions.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Reference 1 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Reference 1 *</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="reference1Name"
                        value={formData.reference1Name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile
                      </label>
                      <input
                        type="number"
                        name="reference1Mobile"
                        value={formData.reference1Mobile}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="enter mobile number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <select
                        name="reference1Relationship"
                        value={formData.reference1Relationship}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                      >
                        <option value="">Select</option>
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Family">Family</option>
                        <option value="Neighbor">Neighbor</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reference 2 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Reference 2 *</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="reference2Name"
                        value={formData.reference2Name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile
                      </label>
                      <input
                        type="number"
                        name="reference2Mobile"
                        value={formData.reference2Mobile}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="enter mobile number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <select
                        name="reference2Relationship"
                        value={formData.reference2Relationship}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                      >
                        <option value="">Select</option>
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Family">Family</option>
                        <option value="Neighbor">Neighbor</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Capture Live Selfie *
                  </h3>

                  {!selfieCaptured ? (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Take a clear photo of your face for identity verification
                      </p>
                      <button
                        type="button"
                        onClick={captureSelfi}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Open Camera & Capture Selfie
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                          {selfiePreview && (
                            <img
                              src={selfiePreview}
                              alt="Captured selfie preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Captured
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={captureSelfi}
                        className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Retake Selfie
                      </button>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border ${
                    consentError && !formData.creditBureauConsent
                      ? 'border-red-300 bg-red-50'
                      : 'border-transparent'
                  }`}>
                    <input
                      type="checkbox"
                      name="creditBureauConsent"
                      checked={formData.creditBureauConsent}
                      onChange={handleChange}
                      className={`mt-1 ${consentError && !formData.creditBureauConsent ? 'accent-red-500' : ''}`}
                    />
                    <span className={`text-sm ${
                      consentError && !formData.creditBureauConsent
                        ? 'text-red-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      I authorize Quikkred to pull my credit bureau report *
                    </span>
                  </label>
                  <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border ${
                    consentError && !formData.termsConsent
                      ? 'border-red-300 bg-red-50'
                      : 'border-transparent'
                  }`}>
                    <input
                      type="checkbox"
                      name="termsConsent"
                      checked={formData.termsConsent}
                      onChange={handleChange}
                      className={`mt-1 ${consentError && !formData.termsConsent ? 'accent-red-500' : ''}`}
                    />
                    <span className={`text-sm ${
                      consentError && !formData.termsConsent
                        ? 'text-red-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      I agree to the Terms & Conditions and Privacy Policy *
                    </span>
                  </label>
                  <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border ${
                    consentError && !formData.eSignConsent
                      ? 'border-red-300 bg-red-50'
                      : 'border-transparent'
                  }`}>
                    <input
                      type="checkbox"
                      name="eSignConsent"
                      checked={formData.eSignConsent}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I consent to digitally sign the loan agreement
                    </span>
                  </label>

                  {consentError && (!formData.creditBureauConsent || !formData.termsConsent) && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Please accept all required consents marked with * to proceed</span>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Your data is secure</p>
                      <p>256-bit encryption • RBI guidelines compliant • No hidden charges</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-lg hover:shadow-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === 3 ? "Submit Application" : "Next"}
                  {currentStep < 3 && <ArrowRight className="w-5 h-5" />}
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Instant Approval</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>No Hidden Charges</span>
          </div>
        </div>
      </div>
    </div>
  );
}
