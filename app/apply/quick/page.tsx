"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle, X, Loader2, FileText, IndianRupee,
  Calendar, User, Phone, Mail, CreditCard, Camera,
  AlertCircle, ArrowRight, Sparkles, Shield, Zap
} from "lucide-react";
import { loansService } from "@/lib/api/loans.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast, Toaster } from "@/components/ui/toast";
import SelfieCapture from "@/components/camera/SelfieCapture";
import { BANKS } from "@/lib/constants/banks";
import { useCustomer } from "@/store/hooks/useCustomer";

// Auto-decision engine


// const autoDecisionEngine = (data: any) => {
//   const { monthlyIncome, loanAmount, pan, aadhaar } = data;

  
//   const minIncome = 25000;
//   const maxLoanToIncome = 40;
//   const maxEligibleAmount = monthlyIncome * maxLoanToIncome;

 
//   if (monthlyIncome < minIncome) {
//     return {
//       approved: false,
//       reason: "Minimum monthly income requirement not met (₹25,000)",
//       suggestedAction: "Please reapply when your monthly income is ₹25,000 or above"
//     };
//   }

//   if (loanAmount > maxEligibleAmount) {
//     return {
//       approved: false,
//       reason: `Requested amount exceeds maximum eligible amount (₹${maxEligibleAmount.toLocaleString()})`,
//       suggestedAction: `Maximum loan amount you can apply for: ₹${maxEligibleAmount.toLocaleString()}`
//     };
//   }

//   if (!pan || !aadhaar) {
//     return {
//       approved: false,
//       reason: "PAN and Aadhaar details are mandatory",
//       suggestedAction: "Please provide valid PAN and Aadhaar numbers"
//     };
//   }

//   // Approved!
//   return {
//     approved: true,
//     approvedAmount: loanAmount,
//     interestRate: 12.5,
//     tenure: data.tenure || 12,
//     emi: Math.round((loanAmount * (12.5/100/12) * Math.pow(1 + 12.5/100/12, 12)) / (Math.pow(1 + 12.5/100/12, 12) - 1)),
//     processingFee: Math.round(loanAmount * 0.02)
//   };
// };


export default function QuickLoanApplication() {
  // Generate unique document number for this session (stable across re-renders)
  const documentNumber = useMemo(() => `DOC${new Date().getFullYear()}${Date.now()}`, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redux hooks for GET APIs
  const {
    customer: reduxCustomer,
    customerLoading: reduxCustomerLoading,
    getCustomer,
    aadhaarStatus: reduxAadhaarStatus,
    getAadhaarStatus,
    eSignStatus: reduxESignStatus,
    getESignStatus,
    breData: reduxBreData,
    breLoading: reduxBreLoading,
    initBRE,
    finfactorData: reduxFinfactorData,
    finfactorLoading: reduxFinfactorLoading,
    getFinfactor,
    initESign,
  } = useCustomer();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<any>(null);
  const [selfieCapture, setSelfieCapture] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieVerified, setSelfieVerified] = useState(false); // Profile photo verification status
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
  const [aadhaarStatusChecked, setAadhaarStatusChecked] = useState(false);
  const [aadhaarStatusLoading, setAadhaarStatusLoading] = useState(false);
  const [eSignStatusChecked, setESignStatusChecked] = useState(false);
  const [eSignStatusLoading, setESignStatusLoading] = useState(false);
  const [eSignVerified, setESignVerified] = useState(false);
  const [apiDeterminedStep, setApiDeterminedStep] = useState<number | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(5);

  // OTP Resend timers
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [aadhaarOtpTimer, setAadhaarOtpTimer] = useState(0);

  // Reverify timers (30 seconds cooldown)
  const [panReverifyTimer, setPanReverifyTimer] = useState(0);
  const [aadhaarReverifyTimer, setAadhaarReverifyTimer] = useState(0);

  // Loan Products
  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [emiCalculation, setEmiCalculation] = useState<any>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [amountError, setAmountError] = useState("")

  // Approval Data (Step 3)
  const [approvalData, setApprovalData] = useState<any>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);

  // User's desired loan amount (can be less than or equal to approved amount)
  const [userDesiredAmount, setUserDesiredAmount] = useState<number | null>(null);
  const [calculatedLoanDetails, setCalculatedLoanDetails] = useState<any>(null);

  // BRE Status States
  const [rejectionCountdown, setRejectionCountdown] = useState(10);
  const [ptbLoading, setPtbLoading] = useState(false);
  const [finfactorSuccess, setFinfactorSuccess] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);
  const [brePolling, setBrePolling] = useState(false);
  const [brePollingMessage, setBrePollingMessage] = useState('');
  const [bsaStatusUpdated, setBsaStatusUpdated] = useState(false);
  const [bsaStatus, setBsaStatus] = useState<string | null>(null);

  // User location state
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);

  // Field validation errors for Step 1 and Step 4
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    mobile: "",
    fullName: "",
    dob: "",
    aadhaar: "",
    pan: "",
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    reference1Name: "",
    reference1Mobile: "",
    reference2Name: "",
    reference2Mobile: ""
  });

  // Bank verification state
  const [bankVerifying, setBankVerifying] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [bankVerifyError, setBankVerifyError] = useState("");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);

  // Consent validation error
  const [consentError, setConsentError] = useState(false);

  // Data agreement checkbox for Step 2
  const [dataAgreementChecked, setDataAgreementChecked] = useState(false);

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
      customBankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifsc: "",

      // Step 3: Loan & Consent
      loanAmount: "",
      tenure: "",
      tenureUnit: "",
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

  // Close bank dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (bankDropdownOpen && !target.closest('.bank-dropdown-container')) {
        setBankDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bankDropdownOpen]);

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
            // Fetch user profile data using Redux
            const result = await getCustomer();

            if (result.success && result.data) {
              const profileData = result.data;
              console.log('✅ User profile loaded successfully');

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
                accountHolderName: profileData.banks?.[0]?.accountHolderName || prev.accountHolderName,
                accountNumber: profileData.banks?.[0]?.accountNumber || prev.accountNumber,
                ifsc: profileData.banks?.[0]?.ifscCode || prev.ifsc,
                loanAmount: profileData.requestedLoanAmount?.toString() || prev.loanAmount, // Loan amount from API
                mobileVerified: profileData.isMobileVerified || true, // True if logged in with mobile
                emailVerified: profileData.isEmailVerified || false // Only true if email is actually verified
              }));

              // Log loan amount for debugging
              if (profileData.requestedLoanAmount) {
                console.log('✅ Loan amount loaded from API:', profileData.requestedLoanAmount);
              }

              // Set verification flags from API
              // Helper function to safely convert any value to boolean
              // Handles: true, "true", "TRUE", 1, "1", false, "false", undefined, null
              const toBoolean = (value: unknown): boolean => {
                if (typeof value === 'boolean') return value;
                if (typeof value === 'string') return value.toLowerCase() === 'true';
                if (typeof value === 'number') return value === 1;
                return false;
              };

              // Check verification statuses (using toBoolean for string safety)
              if (toBoolean(profileData.isPanVerify)) {
                setPanVerified(true);
                console.log('✅ PAN already verified');
              }
              if (toBoolean(profileData.isAadhaarVerify)) {
                setAadhaarVerified(true);
                console.log('✅ Aadhaar already verified');
              }
              // Check bank verification via penny drop status
              if (profileData.banks?.[0]?.pennyDropStatus === 'VERIFIED') {
                setBankVerified(true);
                console.log('✅ Bank already verified (penny drop)');
              }

              // Check eSign status from profile
              if (profileData.eSign?.status) {
                setUserESignStatus(profileData.eSign.status);
                console.log('📝 eSign status from profile:', profileData.eSign.status);
                if (profileData.eSign.status === 'SUCCESS') {
                  setESignVerified(true);
                  console.log('✅ eSign already completed');
                }
              }

              // Check BSA status from profile
              if (profileData.bsaStatus) {
                setBsaStatus(profileData.bsaStatus);
                console.log('📊 BSA status from profile:', profileData.bsaStatus);

                // If BSA is PROCESSED and ?finfactor=success is not in URL, redirect to add it
                if (profileData.bsaStatus === 'PROCESSED') {
                  const currentUrl = new URL(window.location.href);
                  const finfactorParam = currentUrl.searchParams.get('finfactor');
                  if (finfactorParam !== 'success') {
                    console.log('📊 BSA is PROCESSED, redirecting with ?finfactor=success');
                    currentUrl.searchParams.set('finfactor', 'success');
                    router.replace(currentUrl.pathname + currentUrl.search);
                    return; // Exit early as we're redirecting
                  }
                }
              }

              // ============================================
              // CHECKLIST-BASED NAVIGATION LOGIC
              // Flow: Email Verified → Check Checklist → Dashboard or First Pending Step
              // ============================================

              // Extract and normalize all checklist flags
              const isEmailVerified = toBoolean(profileData.isEmailVerified);
              const isBasicDetailsFilled = toBoolean(profileData.isBasicDetailsFilled);
              const isKycDetailsFilled = toBoolean(profileData.isKycDetailsFilled);
              const isBankDetailsFilled = toBoolean(profileData.isBankDetailsFilled);
              const isSubmit = toBoolean(profileData.isSubmit);

              // Load selfie preview from profile if available
              if (profileData.profile?.s3URL) {
                setSelfiePreview(profileData.profile.s3URL);
                setSelfieCaptured(true);

                // Check if selfie/profile is verified - disable retake if verified
                if (profileData.profile?.status === 'VERIFIED') {
                  setSelfieVerified(true);
                }
              }

              // STEP 1: Check if ALL checklist values are true → Dashboard
              const allChecklistComplete = isBasicDetailsFilled && isKycDetailsFilled && isBankDetailsFilled && isSubmit;

              if (allChecklistComplete) {
                router.push('/user');
                return;
              }

              // STEP 2: Find first pending step based on completion flags
              // Priority: Respect completed steps, go to first incomplete step
              let firstPendingStep = 1;

              if (!isBasicDetailsFilled) {
                // Step 1 not complete - check email verification requirement
                firstPendingStep = 1;
              } else if (!isKycDetailsFilled) {
                // Step 1 COMPLETE - go to Step 2 (don't force back to Step 1)
                firstPendingStep = 2;
              } else if (!isBankDetailsFilled) {
                // Step 1 & 2 COMPLETE - go to Step 3
                firstPendingStep = 3;
              } else if (!isSubmit) {
                // Step 1, 2 & 3 COMPLETE - go to Step 4
                firstPendingStep = 4;
              }

              // Set the determined step
              setApiDeterminedStep(firstPendingStep);

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
  }, [user, isLoading, userDataLoaded, router]);

  // Clean up hero form data from localStorage after component mounts
  useEffect(() => {
    // Clear the localStorage after reading (already loaded in initial state)
    if (localStorage.getItem('heroFormData')) {
      localStorage.removeItem('heroFormData');
    }
  }, []);

  // Get user location when they land on the apply page (after clicking "Apply Now")
  useEffect(() => {
    const requestLocation = async () => {
      await getLocation();
    };
    requestLocation();
  }, []);

  // Apply API-determined step after data is loaded
  useEffect(() => {
    if (apiDeterminedStep !== null && apiDeterminedStep !== currentStep) {
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

  // Reverify timer countdown for PAN (30 seconds cooldown)
  useEffect(() => {
    if (panReverifyTimer > 0) {
      const timer = setTimeout(() => setPanReverifyTimer(panReverifyTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [panReverifyTimer]);

  // Reverify timer countdown for Aadhaar (30 seconds cooldown)
  useEffect(() => {
    if (aadhaarReverifyTimer > 0) {
      const timer = setTimeout(() => setAadhaarReverifyTimer(aadhaarReverifyTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [aadhaarReverifyTimer]);

  // Rejection countdown timer - auto redirect to home after 10 seconds
  useEffect(() => {
    if (currentStep === 4 && approvalData?.status === 'Reject' && rejectionCountdown > 0) {
      const timer = setTimeout(() => {
        setRejectionCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === 4 && approvalData?.status === 'Reject' && rejectionCountdown === 0) {
      router.push('/');
    }
  }, [currentStep, approvalData?.status, rejectionCountdown, router]);

  // Check for finfactor=success query param (redirect from finfudge)
  // Also update BSA status to PROCESSED on redirect
  useEffect(() => {
    const finfactorParam = searchParams.get('finfactor');
    if (finfactorParam === 'success') {
      setFinfactorSuccess(true);
      setCurrentStep(4); // Go to step 4 to show the consent UI

      // Call PATCH API to update BSA status to PROCESSED (only once)
      const updateBsaStatus = async () => {
        // Prevent duplicate calls
        if (bsaStatusUpdated) {
          console.log('BSA status already updated, skipping API call');
          return;
        }

        const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          console.error('No auth token found for BSA status update');
          return;
        }

        try {
          setBsaStatusUpdated(true); // Mark as updated immediately to prevent race conditions
          const response = await fetch('https://alpha.quikkred.in/api/kyc/bsa/update', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'PROCESSED' })
          });

          const result = await response.json();
          if (response.ok && result.success) {
            console.log('BSA status updated successfully:', result.data);
            // Update local bsaStatus state
            setBsaStatus('PROCESSED');
          } else {
            console.error('Failed to update BSA status:', result.message);
            // Reset flag on failure so it can be retried
            setBsaStatusUpdated(false);
          }
        } catch (error) {
          console.error('Error updating BSA status:', error);
          // Reset flag on error so it can be retried
          setBsaStatusUpdated(false);
        }
      };

      updateBsaStatus();
    }
  }, [searchParams, bsaStatusUpdated]);

  // Auto-trigger consentHandleToFIRequest when BSA is already PROCESSED
  // This handles the case when user returns with ?finfactor=success and BSA was already processed
  useEffect(() => {
    const autoTriggerConsentHandler = async () => {
      const finfactorParam = searchParams.get('finfactor');

      // Only proceed if:
      // 1. finfactor=success is in URL
      // 2. bsaStatus is PROCESSED (from API or just updated)
      // 3. Not already loading or polling
      // 4. finfactorSuccess is true (UI state is set)
      if (finfactorParam !== 'success' || bsaStatus !== 'PROCESSED' || consentLoading || brePolling || !finfactorSuccess) {
        return;
      }

      console.log('📊 BSA already PROCESSED, auto-triggering consentHandleToFIRequest...');

      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found for auto consent trigger');
        return;
      }

      const customerId = localStorage.getItem('userId');
      if (!customerId) {
        console.error('Customer ID not found for auto consent trigger');
        return;
      }

      setConsentLoading(true);

      try {
        const response = await fetch('https://alpha.quikkred.in/api/kyc/consentHandleToFIRequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ customerId })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log('✅ Auto consent handler successful, starting BRE polling...');
          toast({ variant: "success", title: "Success", description: result.message || "Verification completed successfully." });

          // Start BRE polling
          setBrePolling(true);
          setBrePollingMessage('Processing your bank statement...');

          const pollBREStatus = async () => {
            let shouldContinuePolling = true;
            while (shouldContinuePolling) {
              try {
                // Using Redux for finfactor/initialize API
                const breResult = await getFinfactor();

                if (breResult.message === 'Statement not fetched yet') {
                  setBrePollingMessage('Fetching your bank statement...');
                  await new Promise(resolve => setTimeout(resolve, 10000));
                } else if (breResult.message === 'BRE checked successfully') {
                  shouldContinuePolling = false;
                  setBrePolling(false);
                  setBrePollingMessage('');
                  if (breResult.data) {
                    setApprovalData(breResult.data);
                  }
                  setFinfactorSuccess(false);
                  toast({ variant: "success", title: "Success", description: "BRE verification completed successfully." });
                } else {
                  shouldContinuePolling = false;
                  setBrePolling(false);
                  setBrePollingMessage('');
                  if (breResult.data) {
                    setApprovalData(breResult.data);
                  }
                  setFinfactorSuccess(false);
                }
              } catch (pollError) {
                console.error('BRE polling error:', pollError);
                setBrePollingMessage('Retrying...');
                await new Promise(resolve => setTimeout(resolve, 10000));
              }
            }
          };

          pollBREStatus();
        } else {
          console.error('Auto consent handler failed:', result.message);
          toast({ variant: "error", title: "Failed", description: result.message || "Verification failed. Please try again." });
        }
      } catch (error) {
        console.error('Error in auto consent trigger:', error);
        toast({ variant: "error", title: "Error", description: "Failed to process. Please try again." });
      } finally {
        setConsentLoading(false);
      }
    };

    autoTriggerConsentHandler();
  }, [searchParams, bsaStatus, finfactorSuccess, consentLoading, brePolling, toast]);

  // Check Aadhaar verification status when verified=true query param is present
  // Only calls API after user profile data is loaded AND if isAadhaarVerify !== true
  useEffect(() => {
    const checkAadhaarStatus = async () => {
      // Get the verified query parameter
      const verifiedParam = searchParams.get('verified');

      // STEP 1: Check if verified param is 'true'
      if (verifiedParam !== 'true') {
        console.log('ℹ️ No verified=true query param, skipping Aadhaar status check');
        return;
      }

      // STEP 2: Wait for user profile data to be loaded first
      // This ensures we have the isAadhaarVerify value from GET user/details API
      if (!userDataLoaded) {
        console.log('⏳ Waiting for user profile data to load before checking Aadhaar status...');
        return;
      }

      // STEP 3: Prevent duplicate API calls on page refresh
      if (aadhaarStatusChecked || aadhaarStatusLoading) {
        console.log('🔄 Aadhaar status already checked or loading, skipping duplicate call');
        return;
      }

      // STEP 4: Check if already verified from user profile data (isAadhaarVerify === true)
      // If profile data shows isAadhaarVerify = true, don't call the API
      if (aadhaarVerified) {
        console.log('✅ Aadhaar already verified from profile (isAadhaarVerify = true), skipping API call');
        setAadhaarStatusChecked(true);

        return;
      }

      // STEP 5: Get auth token
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      if (!token) {
        console.log('⚠️ No auth token found, cannot check Aadhaar status');
        setAadhaarStatusChecked(true);
        return;
      }

      // STEP 6: Call Aadhaar status API (isAadhaarVerify was false/not set)
      console.log('🔍 Calling Aadhaar verification status API (isAadhaarVerify was not true)...');
      setAadhaarStatusLoading(true);

      try {
        // Using Redux for aadhaar/status API
        const result = await getAadhaarStatus();

        // STEP 7: Handle API response
        if (result.success && result.data?.isAadhaarVerify === true) {
          console.log('✅ Aadhaar verified successfully from status API');
          console.log('📝 Backend has updated isAadhaarVerify = true in database');
          setAadhaarVerified(true);
          toast({
            variant: "success",
            title: "Aadhaar Verified",
            description: result.message || "Your Aadhaar has been verified successfully.",
          });
        } else {
          console.log('ℹ️ Aadhaar not verified:', result.message || 'Verification pending or failed');
          setAadhaarVerified(false);
          // Show info toast if verification failed/pending
        
        }
      } catch (error: any) {
        // STEP 8: Handle errors (timeout, network, etc.)
        if (error.name === 'AbortError') {
          console.error('⏱️ Aadhaar status API timeout after 15 seconds');
          // toast({
          //   variant: "destructive",
          //   title: "Request Timeout",
          //   description: "Aadhaar status check timed out. Please refresh the page to try again.",
          // });
        } else {
          console.error('❌ Error checking Aadhaar status:', error);
          // toast({
          //   variant: "destructive",
          //   title: "Error",
          //   description: "Failed to check Aadhaar status. Please try again later.",
          // });
        }
        // Keep aadhaarVerified as false on error
        setAadhaarVerified(false);
      } finally {
        setAadhaarStatusLoading(false);
        setAadhaarStatusChecked(true);
      }
    };

    checkAadhaarStatus();
  }, [searchParams, userDataLoaded, aadhaarStatusChecked, aadhaarStatusLoading, aadhaarVerified, toast]);

  // Check e-Sign document status when isSigned=true query param is present
  // This is a separate and independent KYC step
  // Only calls API if: isSigned === "true" AND eSign.status !== "SUCCESS"
  const [userESignStatus, setUserESignStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkESignStatus = async () => {
      // Get the query parameter
      const isSignedParam = searchParams.get('isSigned');

      // Condition 1: Only trigger if isSigned === "true"
      if (isSignedParam !== 'true') {
        console.log('[eSign] No isSigned=true query param, skipping e-Sign status check');
        return;
      }

      // Wait for user data to be loaded first
      if (!userDataLoaded) {
        console.log('[eSign] Waiting for user profile data to load...');
        return;
      }

      // Prevent duplicate API calls
      if (eSignStatusChecked || eSignStatusLoading) {
        console.log('[eSign] e-Sign status already checked or loading, skipping duplicate call');
        return;
      }

      // Skip if already verified from state
      if (eSignVerified) {
        console.log('[eSign] e-Sign already verified, skipping API call');
        setESignStatusChecked(true);
        return;
      }

      // Condition 2: Check if eSign.status !== "SUCCESS" from user profile
      // If status is already SUCCESS, skip API call
      if (userESignStatus === 'SUCCESS') {
        console.log('[eSign] eSign.status is already SUCCESS, skipping API call');
        setESignVerified(true);
        setESignStatusChecked(true);
        return;
      }

      // Get auth token
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      if (!token) {
        console.log('[eSign] No auth token found, cannot check e-Sign status');
        setESignStatusChecked(true);
        return;
      }

      // Call API only if isSigned=true AND eSign.status !== SUCCESS
      console.log('[eSign] Calling e-Sign document status API (conditions met: isSigned=true, eSign.status !== SUCCESS)...');
      setESignStatusLoading(true);

      try {
        // Using Redux for eSign/document API
        const result = await getESignStatus();

        // Check if e-Sign document is already signed
        if (result.success && result.message === "E-sign document fetched successfully") {
          setESignVerified(true);
          setUserESignStatus('SUCCESS');
          toast({
            variant: "success",
            title: "e-Sign Completed",
            description: "Your document has been signed successfully.",
          });
        } else {
          console.log('[eSign] e-Sign not completed:', result.message || 'Document not signed');
          setESignVerified(false);
        }

        // Call customer/get API once after eSign/document API using Redux
        try {
          console.log('[eSign] Calling customer/get API to refresh user data...');
          await getCustomer();
          console.log('[eSign] customer/get API called successfully');
        } catch (customerError) {
          console.error('[eSign] Error calling customer/get API:', customerError);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.error('[eSign] e-Sign document API timeout after 15 seconds');
        } else {
          console.error('[eSign] Error checking e-Sign status:', error);
        }
        setESignVerified(false);
      } finally {
        setESignStatusLoading(false);
        setESignStatusChecked(true);
      }
    };

    checkESignStatus();
  }, [searchParams, userDataLoaded, userESignStatus, eSignStatusChecked, eSignStatusLoading, eSignVerified, toast]);

  // Check for data agreement approval when window gets focus (user returns from agreement page)
  useEffect(() => {
    const handleFocus = () => {
      const approved = localStorage.getItem('dataAgreementApproved');
      if (approved === 'true') {
        setDataAgreementChecked(true);
        localStorage.removeItem('dataAgreementApproved');
      }
    };

    window.addEventListener('focus', handleFocus);
    // Also check on mount in case tab was already focused
    handleFocus();

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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

  // Track if BRE API has been called to prevent infinite loops
  const breApiCalledRef = useRef(false);

  // Auto-call BRE API when Step 4 is reached (including on hard refresh)
  useEffect(() => {
    const fetchBREData = async () => {
      // Only run on Step 4
      if (currentStep !== 4) {
        breApiCalledRef.current = false; // Reset when leaving Step 4
        return;
      }

      // Skip if already called in this session
      if (breApiCalledRef.current) {
        console.log('[Step 4] BRE API already called, skipping');
        return;
      }

      // Skip if data already exists
      if (approvalData) {
        console.log('[Step 4] BRE data already loaded, skipping API call');
        return;
      }

      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      if (!token) {
        console.log('[Step 4] No auth token found, cannot fetch BRE data');
        return;
      }

      // Mark as called BEFORE the API call to prevent race conditions
      breApiCalledRef.current = true;
      console.log('[Step 4] Calling BRE API (bre/initialize)...');
      setApprovalLoading(true);

      try {
        // Using Redux for bre/initialize API
        const result = await initBRE();

        if (result.success && result.data) {
          console.log('[Step 4] BRE data fetched successfully');
          // Store BRE response data only (don't include formData to avoid dependency)
          setApprovalData(result.data);
        } else {
          console.error('[Step 4] BRE API failed:', result.message);
          breApiCalledRef.current = false; // Allow retry on failure
          toast({
            variant: "error",
            title: "Failed to Load Approval Data",
            description: result.message || "Unable to fetch approval details. Please try again.",
          });
        }
      } catch (error: any) {
        console.error('[Step 4] BRE API error:', error);
        breApiCalledRef.current = false; // Allow retry on error
        toast({
          variant: "error",
          title: "Network Error",
          description: "Unable to connect to server. Please check your connection.",
        });
      } finally {
        setApprovalLoading(false);
      }
    };

    fetchBREData();
  }, [currentStep, approvalData, toast]);


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


  // Calculate EMI when loan amount, tenure, tenure unit, or product changes
  useEffect(() => {
    if (formData.loanAmount && formData.tenure && selectedProduct) {
      calculateEMI();
    }
  }, [formData.loanAmount, formData.tenure, formData.tenureUnit, selectedProduct]);

  // Generate Agreement HTML with customer data
  const generateAgreementHTML = (data: any) => {
    const getValue = (value: any) => {
      if (value === null || value === undefined || value === '' || value === 'undefined' || value === 'null') {
        return 'N/A';
      }
      return value;
    };

    const formatDate = (dateStr: string) => {
      if (!dateStr || dateStr === 'N/A') return 'N/A';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) {
        return 'N/A';
      }
    };

    const maskAadhaar = (aadhaar: string) => {
      if (!aadhaar || aadhaar.length < 4) return 'N/A';
      return aadhaar.slice(-4);
    };

    const today = new Date();
    const currentDate = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentTime = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    // Generate repayment schedule
    const generateRepaymentSchedule = () => {
      const loanAmount = parseFloat(data.loanAmount) || 0;
      const tenure = parseInt(data.tenure) || 30;
      const interestRate = parseFloat(data.interestRate) || 1;
      const totalAmount = parseFloat(data.totalAmount) || loanAmount;

      function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

      if (!loanAmount) {
        return '<tr><td colspan="6" style="text-align: center;">N/A</td></tr>';
      }

      if (tenure <= 45) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + tenure);
        const interest = loanAmount * (interestRate / 100) * tenure;

        return `
          <tr>
            <td>1</td>
            <td>${formatDate(dueDate)}</td>
            <td>&#8377;${(loanAmount)}</td>
            <td>&#8377;${(Math.round(interest))}</td>
            <td>&#8377;${(Math.round(totalAmount))}</td>
          </tr>
        `;
      }

      const months = Math.ceil(tenure / 30);
      const emi = Math.round(totalAmount / months);
      let rows = '';

      for (let i = 1; i <= months; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        const principal = Math.round(loanAmount / months);
        const interest = Math.round((totalAmount - loanAmount) / months);

        rows += `
          <tr>
            <td>${i}</td>
            <td>${dueDate.toLocaleDateString('en-IN')}</td>
            <td>&#8377;${(principal)}</td>
            <td>&#8377;${(interest)}</td>
            <td>&#8377;${(emi)}</td>
            <td>eNACH Auto-Debit</td>
          </tr>
        `;
      }
      return rows;
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=900, initial-scale=1.0">
    <title>Loan Agreement - Quikkred</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            color: #2d3748;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 10px;
        }
        .page {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            padding: 20px 25px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #25B181;
            padding-bottom: 12px;
            margin-bottom: 15px;
        }
        .logo-section { display: flex; align-items: center; gap: 10px; }
        .logo-section img { height: 40px; width: auto; }
        .company-info h1 { color: #25B181; font-size: 20px; font-weight: 700; margin-bottom: 2px; }
        .company-info .tagline { color: #718096; font-size: 9px; font-style: italic; }
        .company-info .reg-info { color: #a0aec0; font-size: 7px; margin-top: 4px; line-height: 1.3; }
        .doc-info { text-align: right; font-size: 9px; color: #4a5568; }
        .doc-info .loan-ref {
            font-size: 11px;
            font-weight: 700;
            color: #25B181;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            padding: 5px 10px;
            border-radius: 6px;
            display: inline-block;
            margin-bottom: 5px;
            box-shadow: 0 2px 8px rgba(37, 177, 129, 0.15);
        }
        .title { text-align: center; margin-bottom: 15px; }
        .title h2 {
            font-size: 14px;
            color: #1a202c;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border: 2px solid #25B181;
            display: inline-block;
            padding: 8px 30px;
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(37, 177, 129, 0.08);
        }
        .title .subtitle { font-size: 8px; color: #718096; margin-top: 6px; }
        .section { margin-bottom: 12px; }
        .section-title {
            font-size: 10px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, #25B181 0%, #1d9469 100%);
            text-transform: uppercase;
            padding: 6px 12px;
            margin-bottom: 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(37, 177, 129, 0.25);
        }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 15px; }
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 8px;
            border-bottom: 1px solid #e2e8f0;
            background: #f8fafc;
            border-radius: 4px;
        }
        .info-row:hover { background: #f0fdf4; }
        .info-label { color: #718096; font-size: 8px; text-transform: uppercase; font-weight: 500; letter-spacing: 0.3px; }
        .info-value { font-weight: 600; font-size: 9px; color: #2d3748; text-align: right; }
        .loan-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 1px solid #25B181;
            border-radius: 10px;
            padding: 12px;
            margin: 10px 0;
        }
        .loan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center; }
        .loan-item {
            padding: 8px 6px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .loan-item:hover { transform: none; }
        .loan-item .amount { font-size: 14px; font-weight: 700; color: #25B181; }
        .loan-item .label { font-size: 7px; color: #718096; text-transform: uppercase; margin-top: 3px; letter-spacing: 0.2px; }
        .loan-item.highlight { background: linear-gradient(135deg, #25B181 0%, #1d9469 100%); }
        .loan-item.highlight .amount { color: white; }
        .loan-item.highlight .label { color: rgba(255,255,255,0.9); }
        .schedule-table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 8px; border-radius: 6px; overflow: hidden; }
        .schedule-table th { background: linear-gradient(135deg, #25B181 0%, #1d9469 100%); color: white; padding: 6px 5px; text-align: left; font-weight: 600; }
        .schedule-table td { padding: 5px; border-bottom: 1px solid #e2e8f0; }
        .schedule-table tr:nth-child(even) { background: #f8fafc; }
        .schedule-table tr:hover td { background: #f0fdf4; }
        .terms { font-size: 8px; color: #4a5568; background: #f8fafc; padding: 10px; border-radius: 6px; }
        .terms ol { padding-left: 15px; }
        .terms li { margin-bottom: 4px; line-height: 1.4; }
        .terms li strong { color: #2d3748; }
        .notice {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 1px solid #fbbf24;
            border-left: 3px solid #f59e0b;
            border-radius: 8px;
            padding: 10px 12px;
            margin: 10px 0;
            font-size: 8px;
        }
        .notice-title { font-weight: 700; color: #92400e; margin-bottom: 5px; font-size: 9px; }
        .notice ul { margin: 0; padding-left: 12px; color: #78350f; }
        .notice li { margin: 3px 0; line-height: 1.3; }
        .signature-section { margin-top: 15px; padding-top: 12px; border-top: 1px solid #2d3748; }
 .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px; align-items: stretch; }
        .signature-box { text-align: center; height: 100%; }
        .esign-box {
            border: 1px dashed #25B181;
            padding: 12px 10px;
            text-align: center;
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
            border-radius: 10px;
            min-height: 100px;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .esign-box:hover { border-style: solid; }
        .esign-box .icon { font-size: 20px; margin-bottom: 5px; }
        .esign-box .text { font-size: 9px; color: #25B181; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
        .esign-box .subtext { font-size: 7px; color: #718096; margin-top: 2px; }
        .esign-box .details { margin-top: auto; font-size: 7px; color: #4a5568; line-height: 1.4; }
        .lender-box { border-color: #2d3748; background: white; }
        .lender-box .text { color: #2d3748; }
        .declaration {
            background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 8px;
            font-size: 8px;
            margin: 10px 0;
        }
        .declaration-title { font-weight: 700; margin-bottom: 8px; color: #1e293b; font-size: 9px; }
        .checkbox-item { display: flex; align-items: flex-start; gap: 6px; margin: 4px 0; padding: 4px 8px; background: white; border-radius: 4px; }
        .checkbox {
            width: 12px; height: 12px;
            border: 1px solid #25B181;
            border-radius: 2px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 1px;
            background: #25B181;
        }
        .checkbox::after { content: "✓"; color: white; font-size: 8px; font-weight: bold; }
        .footer { margin-top: 15px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 7px; color: #718096; text-align: center; }
        .footer p { margin: 2px 0; }
        .footer .legal { margin-top: 5px; padding-top: 5px; border-top: 1px dashed #e2e8f0; font-size: 6px; color: #a0aec0; }

        /* ========== PAGE BREAK CLASSES FOR PDF ========== */
        .page-break {
            page-break-after: always;
            break-after: page;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .page-break-before {
            page-break-before: always;
            break-before: page;
        }
        .page-break-after {
            page-break-after: always;
            break-after: page;
        }
        .avoid-break, .no-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        /* Keep section titles with their content */
        .section-title {
            page-break-after: avoid;
            break-after: avoid;
        }
        /* Prevent orphan rows in tables */
        .schedule-table tr {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .schedule-table thead {
            display: table-header-group;
        }
        .schedule-table tbody tr {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        /* Keep declaration items together */
        .checkbox-item {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        /* Signature boxes should not break */
        .esign-box {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .approve-section {
            text-align: center;
            margin-top: 35px;
            padding: 30px;
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border-radius: 16px;
            border: 2px solid #25B181;
            box-shadow: 0 8px 24px rgba(37, 177, 129, 0.12);
        }
        .approve-btn {
            background: linear-gradient(135deg, #25B181 0%, #1d9469 100%);
            color: white;
            border: none;
            padding: 16px 55px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(37, 177, 129, 0.35);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .approve-btn:hover {
            background: linear-gradient(135deg, #1d9469 0%, #177a56 100%);
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(37, 177, 129, 0.45);
        }
        .approve-btn:active { transform: translateY(-1px); }

        @page {
            size: A4;
            margin: 10mm 15mm;
        }
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            html, body {
                width: 210mm;
                height: 297mm;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }
            .page {
                max-width: 100%;
                width: 100%;
                box-shadow: none;
                border-radius: 0;
                padding: 15mm;
                margin: 0;
                background: white !important;
            }
            .approve-section, .watermark { display: none !important; }
            .info-row:hover, .loan-item:hover, .schedule-table tr:hover td { background: inherit; transform: none; }
            /* Force page breaks */
            .page-break { page-break-after: always !important; break-after: page !important; }
            .page-break-before { page-break-before: always !important; break-before: page !important; }
            .avoid-break, .no-break { page-break-inside: avoid !important; break-inside: avoid !important; }
            /* Section handling */
            .section { page-break-inside: avoid; break-inside: avoid; }
            .section-title { page-break-after: avoid !important; break-after: avoid !important; }
            /* Table handling */
            .schedule-table { page-break-inside: auto; }
            .schedule-table thead { display: table-header-group; }
            .schedule-table tbody tr { page-break-inside: avoid; break-inside: avoid; }
            /* Keep related elements together */
            .declaration { page-break-inside: avoid; break-inside: avoid; }
            .signature-section { page-break-inside: avoid; break-inside: avoid; }
            .notice { page-break-inside: avoid; break-inside: avoid; }
            .loan-box { page-break-inside: avoid; break-inside: avoid; }
            /* Terms can break but not individual items */
            .terms li { page-break-inside: avoid; break-inside: avoid; }
            .checkbox-item { page-break-inside: avoid; break-inside: avoid; }
        }
        /* ========== PDF GENERATION MODE - FIXED FOR PROPER RENDERING ========== */
        body.pdf-mode {
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body.pdf-mode * {
            transition: none !important;
            animation: none !important;
            transform: none !important;
        }
        body.pdf-mode .page {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px 25px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
        }
        /* Header - Use table layout for better PDF rendering */
        body.pdf-mode .header {
            display: table !important;
            width: 100% !important;
            padding-bottom: 15px;
            margin-bottom: 20px;
            border-bottom: 3px solid #25B181;
        }
        body.pdf-mode .logo-section {
            display: table-cell !important;
            vertical-align: top !important;
            width: 60% !important;
        }
        body.pdf-mode .logo-section img {
            display: inline-block;
            vertical-align: middle;
            height: 45px;
            margin-right: 10px;
        }
        body.pdf-mode .company-info {
            display: inline-block;
            vertical-align: middle;
        }
        body.pdf-mode .company-info h1 { font-size: 22px; color: #25B181; }
        body.pdf-mode .doc-info {
            display: table-cell !important;
            vertical-align: top !important;
            text-align: right !important;
            width: 40% !important;
        }
        body.pdf-mode .doc-info .loan-ref {
            background: #e6f7f0 !important;
            box-shadow: none !important;
        }
        /* Title */
        body.pdf-mode .title { margin-bottom: 20px; }
        body.pdf-mode .title h2 {
            padding: 10px 30px;
            font-size: 16px;
            background: #f0fdf4 !important;
            box-shadow: none !important;
        }
        /* Sections */
        body.pdf-mode .section { margin-bottom: 15px; }
        body.pdf-mode .section-title {
            padding: 8px 15px;
            margin-bottom: 10px;
            font-size: 11px;
            background: #25B181 !important;
            color: #ffffff !important;
            box-shadow: none !important;
            border-radius: 4px;
        }
        /* Info Grid - Use table layout */
        body.pdf-mode .info-grid {
            display: table !important;
            width: 100% !important;
            border-collapse: separate;
            border-spacing: 5px;
        }
        body.pdf-mode .info-row {
            display: table-row !important;
            background: #f8fafc !important;
        }
        body.pdf-mode .info-row:hover {
            background: #f8fafc !important;
            transform: none !important;
        }
        body.pdf-mode .info-label {
            display: table-cell !important;
            width: 40% !important;
            padding: 6px 10px !important;
            font-size: 9px;
            vertical-align: middle;
            background: #f8fafc;
            border-radius: 4px 0 0 4px;
        }
        body.pdf-mode .info-value {
            display: table-cell !important;
            width: 60% !important;
            padding: 6px 10px !important;
            font-size: 10px;
            text-align: right !important;
            vertical-align: middle;
            background: #f8fafc;
            border-radius: 0 4px 4px 0;
        }
        /* Loan Box */
        body.pdf-mode .loan-box {
            padding: 15px;
            margin: 15px 0;
            background: #f0fdf4 !important;
            box-shadow: none !important;
            border-radius: 8px;
        }
        /* Loan Grid - Use table layout */
        body.pdf-mode .loan-grid {
            display: table !important;
            width: 100% !important;
            table-layout: fixed;
        }
        body.pdf-mode .loan-item {
            display: table-cell !important;
            width: 16.66% !important;
            padding: 12px 8px !important;
            text-align: center !important;
            vertical-align: top !important;
            background: #ffffff !important;
            border: 1px solid #e2e8f0;
            box-shadow: none !important;
        }
        body.pdf-mode .loan-item:hover {
            transform: none !important;
            box-shadow: none !important;
        }
        body.pdf-mode .loan-item .amount { font-size: 14px; color: #25B181; }
        body.pdf-mode .loan-item .label { font-size: 8px; margin-top: 4px; }
        body.pdf-mode .loan-item.highlight {
            background: #25B181 !important;
        }
        body.pdf-mode .loan-item.highlight .amount { color: #ffffff !important; }
        body.pdf-mode .loan-item.highlight .label { color: #ffffff !important; }
        /* Schedule Table */
        body.pdf-mode .schedule-table {
            font-size: 9px;
            box-shadow: none !important;
            border: 1px solid #e2e8f0;
        }
        body.pdf-mode .schedule-table th {
            padding: 8px 6px;
            background: #25B181 !important;
            color: #ffffff !important;
        }
        body.pdf-mode .schedule-table td { padding: 6px; }
        body.pdf-mode .schedule-table tr:hover td {
            background: inherit !important;
        }
        /* Terms */
        body.pdf-mode .terms {
            padding: 12px;
            font-size: 9px;
            background: #f8fafc !important;
        }
        body.pdf-mode .terms li { margin-bottom: 5px; }
        /* Notice */
        body.pdf-mode .notice {
            padding: 12px 15px;
            margin: 15px 0;
            font-size: 9px;
            background: #fffbeb !important;
            box-shadow: none !important;
        }
        /* Declaration */
        body.pdf-mode .declaration {
            padding: 15px;
            margin: 15px 0;
            font-size: 9px;
            background: #f8fafc !important;
            box-shadow: none !important;
        }
        body.pdf-mode .checkbox-item {
            padding: 5px 10px;
            margin: 5px 0;
            background: #ffffff !important;
        }
        body.pdf-mode .checkbox {
            width: 14px;
            height: 14px;
            background: #25B181 !important;
            display: inline-block;
            text-align: center;
            line-height: 14px;
        }
        /* Signature Section */
        body.pdf-mode .signature-section {
            margin-top: 20px;
            padding-top: 15px;
        }
        /* Signature Grid - Use table layout */
        body.pdf-mode .signature-grid {
            display: table !important;
            width: 100% !important;
            table-layout: fixed;
            margin-top: 15px;
        }
        body.pdf-mode .signature-box {
            display: table-cell !important;
            width: 50% !important;
            padding: 0 10px !important;
            vertical-align: top !important;
        }
body.pdf-mode .esign-box {
            padding: 15px;
            min-height: 140px;
            background: #f0fdf4 !important;
            box-shadow: none !important;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        body.pdf-mode .esign-box:hover {
            border-style: dashed !important;
            box-shadow: none !important;
        }
        body.pdf-mode .esign-box .icon { font-size: 24px; }
        body.pdf-mode .esign-box .text { font-size: 10px; }
        body.pdf-mode .esign-box .details { font-size: 9px; margin-top: 10px; }
        body.pdf-mode .lender-box {
            background: #f7fafc !important;
        }
        /* Footer */
        body.pdf-mode .footer {
            margin-top: 20px;
            padding-top: 15px;
        }
        body.pdf-mode .approve-section { display: none !important; }
        body.pdf-mode .watermark { display: none !important; }
        /* PDF Mode - Page Break Controls */
        body.pdf-mode .page-break {
            display: block;
            height: 0;
            page-break-after: always;
            break-after: page;
            margin: 0;
            padding: 0;
        }
        body.pdf-mode .avoid-break,
        body.pdf-mode .no-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
        body.pdf-mode .section { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .section-title { page-break-after: avoid; break-after: avoid; }
        body.pdf-mode .loan-box { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .notice { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .declaration { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .signature-section { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .signature-grid { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .schedule-table thead { display: table-header-group; }
        body.pdf-mode .schedule-table tbody tr { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .terms li { page-break-inside: avoid; break-inside: avoid; }
        body.pdf-mode .checkbox-item { page-break-inside: avoid; break-inside: avoid; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="logo-section">
                <div class="company-info">
<img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjExMSIgdmlld0JveD0iMCAwIDQ1MCAxMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMjQ1XzU1KSI+DQo8cGF0aCBkPSJNNjMuNTk0MiAwQzYzLjg4MDEgMC4zOTk2OSA2NC4wNTc3IDAuNjA3ODYyIDY0LjE5MSAwLjgzODI0QzcxLjc5MDYgMTQuMDA1OCA3OS4zODc1IDI3LjE3ODkgODYuOTg3MiA0MC4zNDY1Qzg3LjM4MTMgNDEuMDI5MyA4Ny43MjI3IDQxLjYxNSA4Ny4yMDkyIDQyLjQ5MjFDNzkuOTg0MyA1NC44NjAzIDczLjI0MjMgNjcuNTM2NiA2NS41MDM4IDc5LjU3NzJDNTMuMjI0NSA5OC42ODQ3IDM1LjIwMjMgMTA4LjU3MSAxMi41ODA5IDExMC4wODFDOC43NTYxMyAxMTAuMzM3IDQuOTAzNTYgMTEwLjIwNCAxLjA2NDg2IDExMC4yNDJDMC43OTg0MDQgMTEwLjI0MiAwLjUzMTk0NCAxMTAuMTg0IC0wLjAwMDk3NjU2MiAxMTAuMTJDMjEuMjEzMSA3My4zOTA0IDQyLjM0NjggMzYuNzkzNyA2My41OTQyIDBaIiBmaWxsPSIjMjVCODlCIi8+DQo8cGF0aCBkPSJNMTI3LjM3NCAxMTAuMjE4QzEyNi4xNSAxMTAuMjE4IDEyNS4zMjYgMTEwLjIxOCAxMjQuNTAxIDExMC4yMThDMTEyLjU2NiAxMTAuMjAxIDEwMC42MjYgMTEwLjM3OSA4OC42OTU5IDExMC4xMjNDNzMuNzA3NSAxMDkuODAxIDYzLjk3NjEgOTMuNDU4MyA3MC45MTI0IDgwLjE1NzVDNzUuMjQ3OSA3MS44NDczIDgwLjE5OTcgNjMuODU5IDg0Ljg3MzggNTUuNzI2NEM4Ni42NDQ3IDUyLjY0NTUgODguNDE4MyA0OS41NjczIDkwLjM0NDYgNDYuMjIyN0MxMDIuNzA0IDY3LjU4MzkgMTE0Ljk0OCA4OC43NDUzIDEyNy4zNzEgMTEwLjIxOEgxMjcuMzc0WiIgZmlsbD0iIzQ4ODRGRiIvPg0KPC9nPg0KPHBhdGggZD0iTTE3OC43NzggNzYuNzA4NEMxODQuMTY1IDgwLjg5ODIgMTg5LjM1OSA3OS44MDk2IDE5NC40NiA3Ni4zNTUzQzE5Ni4wMjYgNzguMzI2NiAxOTcuNDc1IDgwLjE1NjggMTk4LjkxOCA4MS45NjkyQzE5My4wNjQgODguMTk1MSAxODIuMTM3IDg5LjMwNzMgMTc0LjU3MSA4My42NTgxQzE2OS42MTYgNzkuOTU2NyAxNjQuNjMzIDc2Ljg2NzMgMTU4LjkwNyA3NC4zNjYzQzE0Ny44MjkgNjkuNTE3NCAxNDIuMTc5IDU2Ljc4MzEgMTQ0Ljk0OCA0NS42Mzc2QzE0OC4wMTYgMzMuMjc5OSAxNTguMjU4IDI1LjE2NTEgMTcwLjczMiAyNS4yMThDMTg2LjU0OSAyNS4yNzY5IDE5OC40MjcgMzcuMTg3MyAxOTcuNjk3IDUyLjk0MDRDMTk3LjE3MSA2NC4zMDM2IDE5MC4zNzYgNzEuNDQ3NSAxODAuMzYxIDc1LjgyNTdDMTc5LjkyMyA3Ni4wMTk5IDE3OS40NzMgNzYuMTg0NiAxNzkuMDM1IDc2LjM3ODhDMTc4Ljk1OSA3Ni40MTQxIDE3OC45MTggNzYuNTI2IDE3OC43NzggNzYuNzA4NFpNMTcxLjM0NiAzNC42NzQ2QzE2Mi4yOSAzNC42NzQ2IDE1NS4wNzQgNDIuMDU5OCAxNTUuMDggNTEuMzUxNkMxNTUuMDggNjAuNjMxNiAxNjIuMDg1IDY4LjMxNjkgMTcwLjg5NiA2OC4xNDYzQzE4MC41NiA2Ny45NTggMTg3LjQ3OCA1OS43NjY2IDE4Ny4zMDggNTEuMDk4NkMxODcuMTMzIDQyLjE0ODEgMTgwLjAxNyAzNC42ODA1IDE3MS4zNDYgMzQuNjc0NloiIGZpbGw9IiM0QjRCNEIiLz4NCjxwYXRoIGQ9Ik00NTAgNzYuMzcyN0g0NDAuNTIzQzQ0MC40MjQgNzQuOTAxNiA0NDAuMzI0IDczLjQ4OTMgNDQwLjIwMiA3MS43MDYyQzQzNi40NjIgNzUuNjE5NSA0MzIuMTMzIDc3LjU5MDggNDI2Ljg4IDc2LjgyQzQyMS45MzEgNzYuMDk2MiA0MTcuOTgyIDczLjY1OTkgNDE1LjAzMSA2OS41NzZDNDA5LjIzNSA2MS41NTUzIDQxMC43NzIgNDkuMzMyOSA0MTguNDIgNDIuODAxQzQyNC44MzUgMzcuMzIyNSA0MzMuODkyIDM3LjkwNSA0NDAuMTk2IDQ0LjM2MDVWMjQuMDcwM0g0NTBWNzYuMzcyN1pNNDMxLjI1NiA2OC4yMTY3QzQzNi44MzEgNjguMjIyNiA0NDAuODQ1IDYzLjkzMjcgNDQwLjg0NSA1Ny45NTM5QzQ0MC44NDUgNTIuMjI4MiA0MzYuNDkyIDQ3LjU5MTEgNDMxLjE0NSA0Ny42MjY0QzQyNS43NzYgNDcuNjU1OCA0MjEuNTQgNTIuMjYzNSA0MjEuNTU3IDU4LjA0MjJDNDIxLjU3NSA2My45NTAzIDQyNS42NDIgNjguMjE2NyA0MzEuMjU2IDY4LjIyMjVWNjguMjE2N1oiIGZpbGw9IiM0QjRCNEIiLz4NCjxwYXRoIGQ9Ik0yNzYuMTk2IDc2LjMzNzRIMjY2LjM1MVYyNC4wODJIMjc2LjAyNlY1NS40NDExQzI3OS4xMzUgNTEuNjY5MSAyODIuMDYyIDQ4LjcwMzIgMjg0LjI3IDQ1LjI3MjVDMjg3LjA0IDQwLjk2NSAyOTAuNDUyIDM4LjkxMTMgMjk1LjU2NSAzOS44MjM0QzI5Ni45NzMgNDAuMDc2NCAyOTguNDYzIDM5Ljg2NDYgMzAwLjYxMyAzOS44NjQ2QzI5NS41MTIgNDUuODA4IDI5MC43OTcgNTEuMzEwMSAyODUuOTU5IDU2Ljk1MzVDMjkxLjA4MyA2My4yNzM1IDI5Ni4yMTkgNjkuNTk5NSAzMDEuNzc1IDc2LjQ0OTJDMjk3LjY3NCA3Ni40NDkyIDI5NC4xMjcgNzYuNTQzMyAyOTAuNTk4IDc2LjM3MjdDMjg5Ljg1IDc2LjMzNzQgMjg4Ljk5NyA3NS40NDg4IDI4OC40NDIgNzQuNzQ4NUMyODQuNDc1IDY5LjcyODkgMjgwLjU3OCA2NC42NjIzIDI3Ni4xOTYgNTkuMDE5Vjc2LjMzNzRaIiBmaWxsPSIjNEI0QjRCIi8+DQo8cGF0aCBkPSJNMzA1LjMzNyAyMy45ODE0SDMxNC45NzhWNTUuMDg3NUMzMTguOTMzIDUwLjIyMDkgMzIyLjQ5NyA0NS43NzggMzI2LjE0OSA0MS4zOTk5QzMyNi43MSA0MC43MjkgMzI3LjYyMSAzOS45NzU4IDMyOC40MDQgMzkuOTM0NkMzMzEuNzc2IDM5Ljc3NTcgMzM1LjE1OSAzOS44NjQgMzM5LjE3MyAzOS44NjRDMzM0LjA1NCA0NS44MTkyIDMyOS4zMjIgNTEuMzE1NSAzMjQuNTM2IDU2Ljg4MjNDMzI5Ljc1NCA2My4zMDI0IDMzNC45MDEgNjkuNjI4NCAzNDAuNDQ2IDc2LjQ0MjdDMzM2LjMyNyA3Ni40NDI3IDMzMi43NzUgNzYuNTM2OSAzMjkuMjI4IDc2LjM3MjFDMzI4LjQ2OSA3Ni4zMzY4IDMyNy41ODYgNzUuNTAxMiAzMjcuMDM3IDc0LjgwNjhDMzIzLjEzNCA2OS44NDYxIDMxOS4zMDcgNjQuODMyNCAzMTUuMDQ4IDU5LjI5NVY3Ni4zMDc0SDMwNS4zNDNWMjMuOTgxNEgzMDUuMzM3WiIgZmlsbD0iIzRCNEI0QiIvPg0KPHBhdGggZD0iTTM3OS41MjkgNjAuNDEyNkMzODAuNTUxIDY1LjI4NTEgMzgzLjMzOCA2Ny41MDM2IDM4Ny4zNCA2OC40NDUxQzM5Mi4xNjcgNjkuNTgwOSAzOTYuMTU3IDY4LjMwOTggMzk5LjE2IDY0LjAzNzVDNDAxLjU2MiA2NS42ODUyIDQwMy44NzYgNjcuMjc0MSA0MDYuMyA2OC45Mzk0QzQwMS4xNTkgNzUuNTA2NyAzOTQuNDM0IDc3LjgzNyAzODYuNjQ1IDc2LjgzNjZDMzc4LjU1OSA3NS43OTUgMzcyLjU3NiA3MS41MjI4IDM3MC41NzggNjMuMjcyNUMzNjcuMjE4IDQ5LjQyNjEgMzc2LjcxOCAzOS40MzQgMzg3Ljc3OSAzOS4yMjIxQzQwMC40MjggMzguOTc1IDQwOC40MjEgNDcuMzE5NCA0MDcuMzQgNjAuNDE4NUgzNzkuNTI5VjYwLjQxMjZaTTM5Ny40ODkgNTMuOTM5NkMzOTYuMzE1IDQ4LjcwMjMgMzkzLjIxMiA0Ni4yNjAxIDM4OC4xOTkgNDYuNDQyNkMzODQuMDM5IDQ2LjU5NTYgMzgwLjg5IDQ5LjQ5MDggMzgwLjE4OSA1My45Mzk2SDM5Ny40ODRIMzk3LjQ4OVoiIGZpbGw9IiM0QjRCNEIiLz4NCjxwYXRoIGQ9Ik0yMzkuMDM0IDc2LjMwOUgyMjkuOTY2QzIyOS45MDIgNzQuODg0OSAyMjkuODM3IDczLjU2NjggMjI5Ljc3OSA3Mi4zNjA0QzIyNy42NCA3My43MTM5IDIyNS43MTggNzUuNDY3NSAyMjMuNDYzIDc2LjI1NjFDMjE0Ljc1MSA3OS4zMDQzIDIwNS41NzggNzMuMDQ4OSAyMDQuNzYgNjMuNzI3N0MyMDQuNjU1IDYyLjU1NjcgMjA0LjU1NiA2MS4zNzk4IDIwNC41NSA2MC4yMDg3QzIwNC41MzIgNTMuNTUzMiAyMDQuNTM4IDQ2Ljg5NzcgMjA0LjUzOCA0MC4wMjQ1SDIxNC4yMzFDMjE0LjIzMSA0NC43OTExIDIxNC4xOTYgNDkuNjUxNyAyMTQuMjQ5IDU0LjUwNjVDMjE0LjI3OCA1Ny4wNDI4IDIxNC4xNjcgNTkuNjMyIDIxNC42MjkgNjIuMDk3N0MyMTUuNDM1IDY2LjM5OTMgMjE4IDY4LjI5NDIgMjIyLjE5NSA2OC4yMTc3QzIyNS45NjkgNjguMTUzIDIyOC42NTEgNjUuOTYzOSAyMjkuMzQxIDYxLjg3NDFDMjI5Ljc3MyA1OS4yOTY2IDIyOS43MTUgNTYuNjE5MSAyMjkuNzQ0IDUzLjk4MjhDMjI5LjgwMiA0OS4zODY5IDIyOS43NjEgNDQuNzkxIDIyOS43NjEgNDAuMDAxSDIzOS4wMzRWNzYuMjk3M1Y3Ni4zMDlaIiBmaWxsPSIjNEI0QjRCIi8+DQo8cGF0aCBkPSJNMzQ0LjY0NyAzOS45NjM5SDM1NC4xODNDMzU0LjI1MyA0MS41MDU3IDM1NC4zMTEgNDIuOTQxNSAzNTQuMzk5IDQ0LjkwN0MzNTcuMzUgNDAuMzY0MSAzNjEuMjI5IDM4LjQyOCAzNjYuNDI5IDM4Ljg2MzVWNDguMTg0N0MzNjUuMzM3IDQ4LjE4NDcgMzY0LjIwOSA0OC4xNzMgMzYzLjA4MSA0OC4xODQ3QzM1Ny44ODcgNDguMjYxMiAzNTQuMzkzIDUxLjc4MDIgMzU0LjM1OCA1Ny4wNzA1QzM1NC4zMTcgNjMuNDE0MSAzNTQuMzQ2IDY5Ljc2MzYgMzU0LjM0NiA3Ni4yNzc5SDM0NC42NDdWMzkuOTU4VjM5Ljk2MzlaIiBmaWxsPSIjNEI0QjRCIi8+DQo8cGF0aCBkPSJNMjQ4LjM3MiAzOS45Njk3SDI1Ny42MTVWNzYuMzEzMUgyNDguMzcyVjM5Ljk2OTdaIiBmaWxsPSIjNEI0QjRCIi8+DQo8cGF0aCBkPSJNMjU4Ljc0MiAyOC43NjAyQzI1OC43NiAzMi4yMzIxIDI1Ni4zNTggMzQuODY4NCAyNTMuMDk4IDM0Ljk2MjZDMjQ5Ljg3MyAzNS4wNTY3IDI0Ny4yNDkgMzIuNDU1NyAyNDcuMTU2IDI5LjA3MjFDMjQ3LjA2MiAyNS43NzY3IDI0OS42MzkgMjIuOTgxNSAyNTIuODM1IDIyLjkwNUMyNTYuMTcxIDIyLjgyODUgMjU4LjcyNSAyNS4zNTg5IDI1OC43NDIgMjguNzYwMloiIGZpbGw9IiM0QjRCNEIiLz4NCjxkZWZzPg0KPGNsaXBQYXRoIGlkPSJjbGlwMF8yNDVfNTUiPg0KPHJlY3Qgd2lkdGg9IjEyNy4zNzYiIGhlaWdodD0iMTEwLjI2MiIgZmlsbD0id2hpdGUiLz4NCjwvY2xpcFBhdGg+DQo8L2RlZnM+DQo8L3N2Zz4NCg=='
 alt="Quikkred"
  class="company-logo"
  />

                    <div class="tagline">Quick Credit, Trusted Partner</div>
                    <div class="reg-info">Satsai Finlease Private Limited | RBI Registered NBFC<br>CIN: U71290DL1996PTC081328 | CoR: B-14.01646</div>
                </div>
            </div>
            <div class="doc-info">
                <div class="loan-ref">${`${documentNumber}`}</div>
                <p><strong>Date:</strong> ${currentDate}</p>
                <p><strong>Place:</strong> Rajendra Place</p>
                <p><strong>Product:</strong> ${getValue(data.productName) !== 'N/A' ? data.productName : 'Personal Loan'}</p>
            </div>
        </div>

        <div class="title">
            <h2>Loan Agreement</h2>
            <div class="subtitle">This agreement is executed between the Borrower and Lender on ${currentDate}</div>
        </div>

        <div class="section avoid-break">
            <div class="section-title">Borrower Details</div>
            <div class="info-grid">
                <div class="info-row"><span class="info-label">Full Name</span><span class="info-value">${getValue(data.fullName)}</span></div>
                <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-value">${formatDate(data.dob)}</span></div>
                <div class="info-row"><span class="info-label">PAN Number</span><span class="info-value">${getValue(data.pan)}</span></div>
                <div class="info-row"><span class="info-label">Aadhaar Number</span><span class="info-value">XXXX-XXXX-${maskAadhaar(data.aadhaar)}</span></div>
                <div class="info-row"><span class="info-label">Mobile Number</span><span class="info-value">+91 ${getValue(data.mobile)}</span></div>
                <div class="info-row"><span class="info-label">Email Address</span><span class="info-value">${getValue(data.email)}</span></div>
                <div class="info-row" style="grid-column: span 2;"><span class="info-label">Residential Address</span><span class="info-value">${getValue(data.address)}${data.city ? ', ' + data.city : ''}${data.state ? ', ' + data.state : ''}${data.pincode ? ' - ' + data.pincode : ''}</span></div>
            </div>
        </div>

        <div class="section avoid-break">
            <div class="section-title">Employment Details</div>
            <div class="info-grid">
                <div class="info-row"><span class="info-label">Employment Type</span><span class="info-value">${getValue(data.employmentType)}</span></div>
                <div class="info-row"><span class="info-label">Company / Business Name</span><span class="info-value">${getValue(data.companyName)}</span></div>
                <div class="info-row"><span class="info-label">Monthly Income</span><span class="info-value">&#8377;${(data.monthlyIncome)}</span></div>
            </div>
        </div>

        <div class="section avoid-break">
            <div class="section-title">Loan Details</div>
            <div class="loan-box">
                <div class="loan-grid">
                    <div class="loan-item"><div class="amount">&#8377;${(data.loanAmount)}</div><div class="label">Principal Amount</div></div>
                    <div class="loan-item"><div class="amount">${getValue(data.interestRate) !== 'N/A' ? data.interestRate : '1.0'}%</div><div class="label">Interest Rate (Daily)</div></div>
                    <div class="loan-item"><div class="amount">${getValue(data.tenure)} ${getValue(data.tenureUnit) !== 'N/A' ? data.tenureUnit : 'days'}</div><div class="label">Loan Tenure</div></div>
                    <div class="loan-item"><div class="amount">&#8377;${(data.processingFee)} + &#8377;${(data.gstOnProcessingFee)} GST (18%)</div><div class="label">Processing Fee</div></div>
                    <div class="loan-item highlight"><div class="amount">&#8377;${(data.disbursementAmount)}</div><div class="label">Disbursement Amount</div></div>
                    <div class="loan-item highlight"><div class="amount">&#8377;
${(data.totalAmount)}</div><div class="label">Total Repayment</div></div>
                </div>
            </div>
        </div>

        <div class="section avoid-break">
            <div class="section-title">Disbursement Bank Account</div>
            <div class="info-grid">
                <div class="info-row"><span class="info-label">Account Holder Name</span><span class="info-value">${getValue(data.accountHolderName)}</span></div>
                <div class="info-row"><span class="info-label">Account Number</span><span class="info-value">${getValue(data.accountNumber)}</span></div>
                <div class="info-row"><span class="info-label">Bank Name</span><span class="info-value">${getValue(data.bankName)}</span></div>
                <div class="info-row"><span class="info-label">IFSC Code</span><span class="info-value">${getValue(data.ifscCode)}</span></div>
            </div>
        </div>

        <div class="section avoid-break">
            <div class="section-title">Repayment Schedule</div>
            <table class="schedule-table">
                <thead>
                    <tr>
                       <th>Instalment</th>
                       <th>Due Date</th>
                       <th>Principal</th>
                       <th>Interest</th>
                       <th>Total Repayment</th>
                    </tr>
                </thead>
                <tbody>${generateRepaymentSchedule()}</tbody>
            </table>
            <p style="font-size: 9px; color: #666; margin-top: 10px;">* All amounts are in Indian Rupees (INR). EMI will be auto-debited via eNACH/eMandate on the due date.</p>
        </div>

        <div class="notice avoid-break">
            <div class="notice-title">⚠️ IMPORTANT NOTICE - PLEASE READ CAREFULLY</div>
            <ul>
                <li><strong>Late Payment Charges:</strong> ₹500 + 2% per day on overdue amount.</li>
                <li><strong>Credit Reporting:</strong> Non-payment will be reported to CIBIL, Experian, Equifax & CRIF High Mark.</li>
                <li><strong>Legal Action:</strong> Default may result in legal proceedings under applicable laws.</li>
                <li><strong>Collection:</strong> Recovery agents may contact you for overdue payments as per RBI guidelines.</li>
            </ul>
        </div>

        <!-- Page Break before Terms & Conditions -->
        <div class="page-break"></div>

        <div class="section">
            <div class="section-title">Terms & Conditions</div>
            <div class="terms">
                <ol>
                    <li><strong>Loan Purpose:</strong> This loan is granted for personal/business use as declared by the Borrower.</li>
                    <li><strong>Disbursement:</strong> Upon successful verification, the loan amount will be disbursed within 24-48 hours.</li>
                    <li><strong>Repayment:</strong> The Borrower agrees to repay the loan as per the repayment schedule via eNACH/eMandate.</li>
                    <li><strong>Interest & Charges:</strong> The applicable interest rate is ${getValue(data.interestRate) !== 'N/A' ? data.interestRate : '1.0'}% Daily (36.5% APR). Processing fee of ${getValue(data.processingFee) !== 'N/A' ? data.processingFee : '2%'} + 18% GST.</li>
                    <li><strong>Late Payment:</strong> Late fee of &#8377;
 500 and penal interest of 2% per day will apply on overdue amounts.</li>
                    <li><strong>Default & Recovery:</strong> Default may result in credit bureau reporting and legal action.</li>
                    <li><strong>Governing Law:</strong> This agreement is governed by Indian laws with jurisdiction in ${getValue(data.city) !== 'N/A' ? data.city : 'Mumbai'}.</li>
                </ol>
            </div>
        </div>

        <div class="declaration avoid-break">
            <div class="declaration-title">BORROWER'S DECLARATION & CONSENT</div>
            <p style="margin-bottom: 15px;">I, <strong>${getValue(data.fullName)}</strong>, hereby declare that:</p>
            <div class="checkbox-item"><span class="checkbox"></span><span>All information provided is true and accurate.</span></div>
            <div class="checkbox-item"><span class="checkbox"></span><span>I agree to all terms and conditions mentioned in this agreement.</span></div>
            <div class="checkbox-item"><span class="checkbox"></span><span>I authorize Quikkred to verify my information and auto-debit EMI amounts.</span></div>
            <div class="checkbox-item"><span class="checkbox"></span><span>I understand non-payment will affect my credit score.</span></div>
        </div>

        <div class="signature-section avoid-break">
            <div class="section-title">Digital Signature (Aadhaar eSign)</div>
            <div class="signature-grid">
                <div class="signature-box">
                    <div class="esign-box">

                     
<div class="details">
                            <div><strong>Name:</strong> ${getValue(data.fullName)}</div>
                            <div><strong>Aadhaar:</strong> XXXX-XXXX-${maskAadhaar(data.aadhaar)}</div>
                            <div><strong>Date:</strong> ${currentDate}</div>
                            <div><strong>Time:</strong> ${currentTime}</div>
                        </div>
                    </div>
                </div>
              <div class="signature-box">
    <div class="esign-box lender-box">
        <div class="icon">
            <img 
            src='data:image/png;base64,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'
             alt="Lender Icon"
                class="lender-svg"
                 width="220"
            />
            
        </div>

        <div class="text">Lender's Authorization</div>
        <div class="subtext">For Satsai Finlease Private Limited</div>

        <div class="details">
            <div><strong>Authorized Signatory</strong></div>
            <div>Quikkred Digital Lending Platform</div>
            <div><strong>Date:</strong> ${currentDate}</div>
        </div>
    </div>
</div>

            </div>
        </div>

        <div class="footer avoid-break">
            <p><strong>Satsai Finlease Private Limited</strong> (trading as Quikkred)</p>
            <p>Email: support@quikkred.in | Website: www.quikkred.in</p>
            <div class="legal">
                <p>This is a computer-generated document valid without physical signature.</p>
                <p><strong>Generated:</strong> ${currentDate} ${currentTime}</p>
            </div>
        </div>

        <div class="approve-section" id="approve-section">
            <p style="font-size: 14px; color: #333; margin-bottom: 20px;">By clicking "I Agree & Approve", you confirm that you have read and understood all terms and conditions.</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="approve-btn" id="approve-btn" onclick="approveAgreement()">I Agree & Approve</button>
            </div>
            <p style="font-size: 11px; color: #666; margin-top: 15px;">Download PDF button saves a copy locally. Approve button downloads PDF, uploads to server and proceeds.</p>
            <div id="loading-indicator" style="display: none; margin-top: 20px;">
                <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #25B181; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 10px; color: #25B181; font-weight: bold;">Processing your agreement...</p>
            </div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .test-btn:hover { background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4); }
            </style>
        </div>
    </div>

    <script>
// 🔹 Document number injected from React component (single source of truth)
        const documentNumber = '${documentNumber}';

        // ========== PRINT-BASED PDF DOWNLOAD ==========
        function testGeneratePDF() {
            const btn = document.getElementById('test-btn');
            btn.disabled = true;
            btn.textContent = 'Preparing...';

            try {
                // Get the page content
                const pageContent = document.querySelector('.page').cloneNode(true);

                // Remove approve section and page-break divs from clone
                const approveSection = pageContent.querySelector('.approve-section');
                if (approveSection) approveSection.remove();

                // Remove empty page-break divs
                pageContent.querySelectorAll('.page-break').forEach(el => el.remove());

                // Create print-friendly HTML with fixed CSS
                const printHTML = \`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Loan Agreement - Quikkred</title>
    <style>
        /* ===== PAGE SETUP ===== */
        @page {
            size: A4 portrait;
            margin: 12mm 15mm 15mm 15mm;
        }

        /* ===== RESET & BASE ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }

        html, body {
            width: 100%;
            height: auto;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            color: #333;
            background: white;
        }

        .page {
            width: 100%;
            max-width: 100%;
            padding: 0;
            margin: 0;
            background: white;
            box-shadow: none;
            border-radius: 0;
        }

        /* ===== HEADER - TABLE LAYOUT ===== */
        .header {
            display: table;
            width: 100%;
            border-bottom: 2px solid #25B181;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .logo-section {
            display: table-cell;
            vertical-align: top;
            width: 65%;
        }

        .logo-section img {
            height: 40px;
            width: auto;
            vertical-align: middle;
            margin-right: 10px;
        }

        .company-info {
            display: inline-block;
            vertical-align: middle;
        }

        .company-info h1 {
            color: #25B181;
            font-size: 20pt;
            font-weight: bold;
            margin: 0;
            line-height: 1.2;
        }

        .company-info .tagline {
            color: #666;
            font-size: 8pt;
            font-style: italic;
            margin: 2px 0;
        }

        .company-info .reg-info {
            color: #999;
            font-size: 7pt;
            line-height: 1.3;
        }

        .doc-info {
            display: table-cell;
            vertical-align: top;
            width: 35%;
            text-align: right;
            font-size: 8pt;
            color: #555;
        }

        .doc-info .loan-ref {
            font-size: 11pt;
            font-weight: bold;
            color: #25B181;
            background: #e8f5e9;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 5px;
        }

        .doc-info p {
            margin: 2px 0;
        }

        /* ===== TITLE ===== */
        .title {
            text-align: center;
            margin-bottom: 15px;
            page-break-after: avoid;
        }

        .title h2 {
            font-size: 14pt;
            color: #222;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 1px solid #25B181;
            display: inline-block;
            padding: 8px 30px;
            background: #f0fff4;
            border-radius: 4px;
            margin: 0;
        }

        .title .subtitle {
            font-size: 8pt;
            color: #666;
            margin-top: 8px;
        }

        /* ===== SECTIONS ===== */
        .section {
            margin-bottom: 12px;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .section-title {
            font-size: 9pt;
            font-weight: bold;
            color: white;
            background: #25B181;
            text-transform: uppercase;
            padding: 6px 12px;
            margin-bottom: 8px;
            border-radius: 3px;
            letter-spacing: 0.5px;
            page-break-after: avoid;
        }

        /* ===== INFO GRID - TABLE LAYOUT ===== */
        .info-grid {
            display: table;
            width: 100%;
            border-collapse: separate;
            border-spacing: 4px;
        }

        .info-row {
            display: table-row;
        }

        .info-row > * {
            display: table-cell;
            padding: 5px 8px;
            background: #f5f5f5;
            vertical-align: middle;
        }

        .info-label {
            width: 35%;
            color: #666;
            font-size: 7pt;
            text-transform: uppercase;
            font-weight: 500;
            border-radius: 3px 0 0 3px;
        }

        .info-value {
            width: 65%;
            font-weight: 600;
            font-size: 8pt;
            color: #333;
            text-align: right;
            border-radius: 0 3px 3px 0;
        }

        /* Full width row */
        .info-row[style*="grid-column: span 2"] .info-label,
        .info-row[style*="grid-column: span 2"] .info-value {
            width: auto;
        }

        /* ===== LOAN BOX ===== */
        .loan-box {
            background: #f0fff4;
            border: 1px solid #25B181;
            border-radius: 6px;
            padding: 12px;
            margin: 10px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .loan-grid {
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .loan-item {
            display: table-cell;
            width: 16.66%;
            padding: 8px 5px;
            text-align: center;
            vertical-align: top;
            background: white;
            border: 1px solid #e0e0e0;
        }

        .loan-item .amount {
            font-size: 12pt;
            font-weight: bold;
            color: #25B181;
            margin-bottom: 3px;
        }

        .loan-item .label {
            font-size: 6pt;
            color: #666;
            text-transform: uppercase;
            line-height: 1.2;
        }

        .loan-item.highlight {
            background: #25B181;
        }

        .loan-item.highlight .amount {
            color: white;
        }

        .loan-item.highlight .label {
            color: rgba(255,255,255,0.9);
        }

        /* ===== SCHEDULE TABLE ===== */
        .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
            font-size: 7pt;
        }

        .schedule-table th {
            background: #25B181;
            color: white;
            padding: 6px 4px;
            text-align: left;
            font-weight: 600;
            font-size: 7pt;
        }

        .schedule-table td {
            padding: 4px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 7pt;
        }

        .schedule-table tr:nth-child(even) {
            background: #f9f9f9;
        }

        .schedule-table thead {
            display: table-header-group;
        }

        .schedule-table tr {
            page-break-inside: avoid;
        }

        /* ===== TERMS ===== */
        .terms {
            font-size: 7pt;
            color: #444;
            background: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
        }

        .terms ol {
            padding-left: 15px;
            margin: 0;
        }

        .terms li {
            margin-bottom: 5px;
            line-height: 1.4;
            page-break-inside: avoid;
        }

        .terms li strong {
            color: #333;
        }

        /* ===== NOTICE ===== */
        .notice {
            background: #fff8e1;
            border: 1px solid #ffb300;
            border-left: 3px solid #ff8f00;
            border-radius: 4px;
            padding: 10px 12px;
            margin: 12px 0;
            font-size: 7pt;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .notice-title {
            font-weight: bold;
            color: #e65100;
            margin-bottom: 6px;
            font-size: 8pt;
        }

        .notice ul {
            margin: 0;
            padding-left: 15px;
            color: #5d4037;
        }

        .notice li {
            margin: 3px 0;
        }

        /* ===== DECLARATION ===== */
        .declaration {
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            padding: 12px;
            border-radius: 4px;
            font-size: 7pt;
            margin: 12px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .declaration-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #222;
            font-size: 9pt;
        }

        .checkbox-item {
            display: table;
            width: 100%;
            margin: 5px 0;
            padding: 4px 8px;
            background: white;
            border-radius: 3px;
        }

        .checkbox {
            display: table-cell;
            width: 14px;
            height: 14px;
            min-width: 14px;
            background: #25B181;
            border-radius: 2px;
            text-align: center;
            vertical-align: top;
            padding-top: 1px;
        }

        .checkbox::after {
            content: "✓";
            color: white;
            font-size: 9px;
            font-weight: bold;
        }

        .checkbox-item > span:last-child {
            display: table-cell;
            padding-left: 8px;
            vertical-align: top;
            line-height: 1.4;
        }

        /* ===== SIGNATURE SECTION ===== */
        .signature-section {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #333;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .signature-grid {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-top: 12px;
        }

        .signature-box {
            display: table-cell;
            width: 50%;
            padding: 0 8px;
            vertical-align: top;
        }

        .esign-box {
            border: 1px dashed #25B181;
            padding: 12px;
            text-align: center;
            background: #f0fff4;
            border-radius: 6px;
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .esign-box .icon {
            font-size: 24px;
            margin-bottom: 6px;
        }

        .esign-box .text {
            font-size: 9pt;
            color: #25B181;
            font-weight: bold;
            text-transform: uppercase;
        }

        .esign-box .subtext {
            font-size: 7pt;
            color: #666;
            margin-top: 2px;
        }

        .esign-box .details {
            margin-top: 8px;
            font-size: 7pt;
            color: #555;
            line-height: 1.4;
        }

        .lender-box {
            border-color: #333;
            background: #fafafa;
        }

        .lender-box .text {
            color: #333;
        }

        /* ===== FOOTER ===== */
        .footer {
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px solid #e0e0e0;
            font-size: 7pt;
            color: #666;
            text-align: center;
            page-break-inside: avoid;
        }

        .footer p {
            margin: 2px 0;
        }

        .footer .legal {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px dashed #e0e0e0;
            font-size: 6pt;
            color: #999;
        }

        /* ===== HIDE ELEMENTS ===== */
        .watermark,
        .approve-section,
        .page-break {
            display: none !important;
        }

        /* ===== PAGE BREAK CONTROLS ===== */
        .avoid-break,
        .no-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        /* Force sections to stay together */
        .section,
        .loan-box,
        .notice,
        .declaration,
        .signature-section,
        .footer {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Keep section title with content */
        .section-title {
            page-break-after: avoid;
            break-after: avoid;
        }
    </style>
</head>
<body>
    \${pageContent.outerHTML}
</body>
</html>\`;

                // Create iframe for printing
                const iframe = document.createElement('iframe');
                iframe.style.cssText = 'position: fixed; top: -10000px; left: -10000px; width: 210mm; height: 297mm;';
                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(printHTML);
                iframeDoc.close();

                // Wait for content to load
                iframe.onload = function() {
                    setTimeout(() => {
                        try {
                            iframe.contentWindow.focus();
                            iframe.contentWindow.print();
                        } catch (e) {
                            console.error('Print error:', e);
                        }

                        // Cleanup after print dialog closes
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                            btn.disabled = false;
                            btn.textContent = 'Download PDF';
                        }, 1000);
                    }, 500);
                };

            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error: ' + (error.message || 'Failed to generate PDF. Please try again.'));
                btn.disabled = false;
                btn.textContent = 'Download PDF';
            }
        }

        // ========== GENERATE PDF BLOB - Pure jsPDF with proper alignment ==========
        async function generatePDFBlob() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('portrait', 'mm', 'a4');

            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 12;
            const contentWidth = pageWidth - (margin * 2);
            const maxY = pageHeight - 12;
            let y = margin;

            const green = [37, 177, 129];
            const darkGray = [51, 51, 51];
            const gray = [102, 102, 102];
            const lightGray = [150, 150, 150];

            // Page break helper
            const checkPage = (needed) => {
                if (y + needed > maxY) {
                    pdf.addPage();
                    y = margin;
                    return true;
                }
                return false;
            };

            // Get text from DOM - use innerText for proper rendering
            const pageEl = document.querySelector('.page');
            const getText = (selector, parent = null) => {
                const container = parent || pageEl;
                const el = container.querySelector(selector);
                if (!el) return '';
                // Use innerText to get rendered text, fallback to textContent
                return (el.innerText || el.textContent || '').trim();
            };

            // Get all text from an element
            const getElText = (el) => {
                if (!el) return '';
                return (el.innerText || el.textContent || '').trim();
            };

            // Draw table row (label | value)
            const drawRow = (label, value, isAlt = false) => {
                checkPage(5);
                if (isAlt) {
                    pdf.setFillColor(245, 245, 245);
                    pdf.rect(margin, y - 0.5, contentWidth, 5, 'F');
                }
                pdf.setFontSize(7);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(...gray);
                pdf.text(label.toUpperCase(), margin + 2, y + 3);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(...darkGray);
                const maxValWidth = contentWidth - 70;
                const truncVal = value.length > 50 ? value.substring(0, 50) + '...' : value;
                pdf.text(truncVal, pageWidth - margin - 2, y + 3, { align: 'right' });
                y += 5;
            };

            // Section header
            const drawSection = (title) => {
                checkPage(8);
                pdf.setFillColor(...green);
                pdf.rect(margin, y, contentWidth, 6, 'F');
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(255, 255, 255);
                pdf.text(title.toUpperCase(), margin + 3, y + 4.2);
                y += 7;
            };

            // ===== HEADER =====
            // Left side: Logo and company info
         pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...green);
            pdf.text('QUIKKRED', margin, y + 5);

            // Right side: Loan ref and doc info
            const loanRef = getText('.loan-ref');
            pdf.setFontSize(11);
            pdf.text(loanRef, pageWidth - margin, y + 2, { align: 'right' });

            const docDate = getText('.doc-info p:nth-child(2)');
            const docPlace = getText('.doc-info p:nth-child(3)');
            const docProduct = getText('.doc-info p:nth-child(4)');

            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...gray);
            pdf.text(docDate, pageWidth - margin, y + 6, { align: 'right' });
            pdf.text(docPlace, pageWidth - margin, y + 9.5, { align: 'right' });
            pdf.text(docProduct, pageWidth - margin, y + 13, { align: 'right' });

            // Left side: Tagline and company info below logo
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(...gray);
            pdf.text('Quick Credit, Trusted Partner', margin, y + 10);

            pdf.setFontSize(6);
            pdf.setTextColor(...lightGray);
            pdf.text('Satsai Finlease Private Limited | RBI Registered NBFC', margin, y + 14);

            y += 17;

            // Single border line
            pdf.setDrawColor(...green);
            pdf.setLineWidth(0.8);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 6;

            // Title box
            pdf.setFillColor(...green);
            pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text('LOAN AGREEMENT', pageWidth / 2, y + 5, { align: 'center' });
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            const subtitle = getText('.title .subtitle');
            pdf.text(subtitle, pageWidth / 2, y + 8.5, { align: 'center' });
            y += 13;

            // ===== BORROWER DETAILS =====
            drawSection('Borrower Details');
            const allSections = pageEl.querySelectorAll('.section');
            const borrowerSection = allSections[0];
            if (borrowerSection) {
                const borrowerRows = borrowerSection.querySelectorAll('.info-row');
                borrowerRows.forEach((row, i) => {
                    const labelEl = row.querySelector('.info-label');
                    const valueEl = row.querySelector('.info-value');
                    const label = getElText(labelEl);
                    const value = getElText(valueEl);
                    if (label) drawRow(label, value, i % 2 === 1);
                });
            }
            y += 2;

            // ===== EMPLOYMENT DETAILS =====
            drawSection('Employment Details');
            const empSection = allSections[1];
            if (empSection) {
                const empRows = empSection.querySelectorAll('.info-row');
                empRows.forEach((row, i) => {
                    const labelEl = row.querySelector('.info-label');
                    const valueEl = row.querySelector('.info-value');
                    const label = getElText(labelEl);
                    const value = getElText(valueEl);
                    if (label) drawRow(label, value, i % 2 === 1);
                });
            }
            y += 2;

            // ===== LOAN DETAILS =====
            checkPage(30);
            drawSection('Loan Details');

            // Loan box background
            pdf.setFillColor(240, 255, 244);
            pdf.setDrawColor(...green);
            pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

            const loanBox = pageEl.querySelector('.loan-box');
            const loanItems = loanBox ? loanBox.querySelectorAll('.loan-item') : [];
            const itemWidth = contentWidth / 6;

            loanItems.forEach((item, i) => {
                const amountEl = item.querySelector('.amount');
                const labelEl = item.querySelector('.label');
                const amount = getElText(amountEl);
                const label = getElText(labelEl);
                const isHighlight = item.classList.contains('highlight');
                const cx = margin + (i * itemWidth) + (itemWidth / 2);

                if (isHighlight) {
                    pdf.setFillColor(...green);
                    pdf.rect(margin + (i * itemWidth), y, itemWidth, 20, 'F');
                    pdf.setTextColor(255, 255, 255);
                } else {
                    pdf.setTextColor(...green);
                }

                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'bold');
                pdf.text(amount || '-', cx, y + 8, { align: 'center' });

                pdf.setFontSize(5);
                pdf.setFont('helvetica', 'normal');
                if (isHighlight) {
                    pdf.setTextColor(230, 255, 240);
                } else {
                    pdf.setTextColor(...gray);
                }
                const lines = pdf.splitTextToSize(label || '', itemWidth - 2);
                pdf.text(lines, cx, y + 12, { align: 'center' });
            });
            y += 23;

            // ===== BANK DETAILS =====
            drawSection('Disbursement Bank Account');
            const bankSection = Array.from(allSections).find(s => {
                const title = s.querySelector('.section-title');
                return title && getElText(title).includes('Bank');
            });
            if (bankSection) {
                const bankRows = bankSection.querySelectorAll('.info-row');
                bankRows.forEach((row, i) => {
                    const labelEl = row.querySelector('.info-label');
                    const valueEl = row.querySelector('.info-value');
                    const label = getElText(labelEl);
                    const value = getElText(valueEl);
                    if (label) drawRow(label, value, i % 2 === 1);
                });
            }
            y += 2;

            // ===== REPAYMENT SCHEDULE =====
            checkPage(15);
            drawSection('Repayment Schedule');

            // Table header
            const headers = ['#', 'Due Date', 'Principal', 'Interest', 'Total EMI', 'Payment Mode'];
            const colWidths = [10, 28, 28, 28, 30, contentWidth - 124];

            const drawTableHeader = () => {
                pdf.setFillColor(...green);
                pdf.rect(margin, y, contentWidth, 5, 'F');
                pdf.setFontSize(6);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(255, 255, 255);
                let x = margin;
                headers.forEach((h, i) => {
                    pdf.text(h, x + 2, y + 3.5);
                    x += colWidths[i];
                });
                y += 6;
            };

            drawTableHeader();

            const scheduleTable = pageEl.querySelector('.schedule-table tbody');
            const scheduleRows = scheduleTable ? scheduleTable.querySelectorAll('tr') : [];
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');

            scheduleRows.forEach((row, idx) => {
                if (y > maxY - 6) {
                    pdf.addPage();
                    y = margin;
                    drawTableHeader();
                }

                if (idx % 2 === 1) {
                    pdf.setFillColor(249, 249, 249);
                    pdf.rect(margin, y - 0.5, contentWidth, 4.5, 'F');
                }

                pdf.setTextColor(...darkGray);
                let x = margin;
                const cells = row.querySelectorAll('td');
                cells.forEach((td, i) => {
                    const text = getElText(td).substring(0, 20);
                    pdf.text(text || '', x + 2, y + 3);
                    x += colWidths[i];
                });

                
                y += 4.5;
            });
            y += 3;

            // ===== IMPORTANT NOTICE =====
            checkPage(20);
            pdf.setFillColor(255, 248, 225);
            pdf.setDrawColor(255, 179, 0);
            pdf.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');
            pdf.setDrawColor(255, 143, 0);
            pdf.setLineWidth(1);
            pdf.line(margin, y, margin, y + 18);

            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(230, 81, 0);
            pdf.text('IMPORTANT NOTICE - PLEASE READ CAREFULLY', margin + 4, y + 4);

            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 80, 50);
            const notices = [
                'Late Payment Charges: &#8377; 500 + 2% per day on overdue amount.',
                'Credit Reporting: Non-payment will be reported to CIBIL, Experian, Equifax & CRIF.',
                'Legal Action: Default may result in legal proceedings under applicable laws.',
                'Collection: Recovery agents may contact you for overdue payments per RBI guidelines.'
            ];
            notices.forEach((n, i) => {
                pdf.text('• ' + n, margin + 4, y + 8 + (i * 3));
            });
            y += 21;

            // ===== TERMS & CONDITIONS =====
            checkPage(15);
            drawSection('Terms & Conditions');

            pdf.setFillColor(249, 249, 249);
            pdf.roundedRect(margin, y, contentWidth, 35, 2, 2, 'F');

            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(68, 68, 68);

            const termsSection = pageEl.querySelector('.terms');
            const termsLi = termsSection ? termsSection.querySelectorAll('li') : [];
            let ty = y + 4;
            termsLi.forEach((li, i) => {
                if (ty > maxY - 5) {
                    pdf.addPage();
                    ty = margin;
                }
                const text = (i + 1) + '. ' + getElText(li);
                const lines = pdf.splitTextToSize(text, contentWidth - 8);
                lines.forEach(line => {
                    pdf.text(line, margin + 4, ty);
                    ty += 3;
                });
                ty += 1;
            });
            y = ty + 3;

            // ===== DECLARATION =====
 checkPage(30);
drawSection("Borrower's Declaration & Consent");
y += 4;

const firstInfoValue = borrowerSection?.querySelector('.info-value');
const borrowerName = getElText(firstInfoValue) || 'Borrower';

            pdf.setFontSize(8);
            pdf.setTextColor(...darkGray);
            pdf.text('I, ' + borrowerName + ', hereby declare that:', margin, y + 3);
            y += 6;

const boxHeight = 24;
pdf.setFillColor(245, 245, 245);
pdf.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');

const declarations = [
  'All information provided is true and accurate.',
  'I agree to all terms and conditions mentioned in this agreement.',
  'I authorize Quikkred to verify my information and auto-debit EMI amounts.',
  'I understand non-payment will affect my credit score.'
];

pdf.setFontSize(7);

declarations.forEach((d, i) => {
  const rowY = y + 6 + (i * 5);
  const cbX = margin + 4;
  const cbY = rowY - 3;
  const cbSize = 3.5;

  // Draw green checkbox background
  pdf.setFillColor(...green);
  pdf.rect(cbX, cbY, cbSize, cbSize, 'F');

  // Draw white checkmark using lines (V shape)
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.5);
  // Left part of checkmark (going down)
  pdf.line(cbX + 0.7, cbY + 1.6, cbX + 1.4, cbY + 2.5);
  // Right part of checkmark (going up)
  pdf.line(cbX + 1.4, cbY + 2.5, cbX + 2.8, cbY + 0.8);

  // Draw declaration text
  pdf.setTextColor(...darkGray);
  pdf.setFont('helvetica', 'normal');
  pdf.text(d, margin + 11, rowY);
});

y += boxHeight + 4;


            // ===== SIGNATURE SECTION =====
            checkPage(35);
            pdf.setDrawColor(...lightGray);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 4;

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...darkGray);
            pdf.text('DIGITAL SIGNATURE (Aadhaar eSign)', margin, y);
            y += 6;

            const boxW = (contentWidth - 6) / 2;
            const boxH = 28;

            // Borrower box
            pdf.setFillColor(240, 255, 244);
            pdf.setDrawColor(...green);
            pdf.roundedRect(margin, y, boxW, boxH, 2, 2, 'FD');

            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...green);
            pdf.text("Borrower's eSign", margin + boxW/2, y + 6, { align: 'center' });

            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...gray);
            pdf.text('Aadhaar-based Digital Signature', margin + boxW/2, y + 10, { align: 'center' });
            pdf.text('Name: ' + borrowerName, margin + boxW/2, y + 16, { align: 'center' });
            const currentDate = new Date().toLocaleDateString('en-IN');
            const currentTime = new Date().toLocaleTimeString('en-IN');
            pdf.text('Date: ' + currentDate, margin + boxW/2, y + 20, { align: 'center' });
            pdf.text('Time: ' + currentTime, margin + boxW/2, y + 24, { align: 'center' });

            // Lender box
            const lx = margin + boxW + 6;
            pdf.setFillColor(245, 245, 245);
            pdf.setDrawColor(...lightGray);
            pdf.roundedRect(lx, y, boxW, boxH, 2, 2, 'FD');

            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...gray);
            pdf.text("Lender's Authorization", lx + boxW/2, y + 6, { align: 'center' });

            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.text('For Satsai Finlease Private Limited', lx + boxW/2, y + 10, { align: 'center' });
            pdf.text('Authorized Signatory', lx + boxW/2, y + 16, { align: 'center' });
            pdf.text('Quikkred Digital Lending Platform', lx + boxW/2, y + 20, { align: 'center' });
            pdf.text('Date: ' + currentDate, lx + boxW/2, y + 24, { align: 'center' });

            y += boxH + 6;

            // ===== FOOTER =====
            checkPage(15);
            pdf.setDrawColor(220, 220, 220);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 4;

            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...gray);
            pdf.text('Satsai Finlease Private Limited (trading as Quikkred)', pageWidth/2, y, { align: 'center' });
            y += 3;
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Email: support@quikkred.in | Website: www.quikkred.in', pageWidth/2, y, { align: 'center' });
            y += 4;
            pdf.setFontSize(5);
            pdf.setTextColor(...lightGray);
            pdf.text('This is a computer-generated document valid without physical signature.', pageWidth/2, y, { align: 'center' });
            y += 2.5;
            pdf.text('Generated: ' + currentDate + ' ' + currentTime, pageWidth/2, y, { align: 'center' });

            return pdf.output('blob');
        }

       async function approveAgreement() {
    const btn = document.getElementById('approve-btn');
    const loadingIndicator = document.getElementById('loading-indicator');

    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.textContent = 'Processing...';
    loadingIndicator.style.display = 'block';

    try {
        const token = localStorage.getItem('accessToken') ||
                      localStorage.getItem('token') ||
                      localStorage.getItem('authToken');

        if (!token) {
            alert('Authentication error. Please login again.');
            window.location.href = '/login';
            return;
        }

        // 🔹 Generate document number
        // const currentYear = new Date().getFullYear();
        // const documentNumber = 'DOC' + currentYear + Date.now();

        // 🔹 Hide approve section temporarily for PDF capture
        const approveSection = document.getElementById('approve-section');
        if (approveSection) approveSection.style.display = 'none';

        // Scroll to top before capture
        window.scrollTo(0, 0);

        // Get the page content element
        const pageElement = document.querySelector('.page');

        // Store original styles
        const originalStyle = pageElement.getAttribute('style') || '';

        // Reset page element position for proper capture
        pageElement.style.marginTop = '0';
        pageElement.style.paddingTop = '0';
        pageElement.style.position = 'relative';
        pageElement.style.top = '0';

        // Wait for scroll and style to apply
        await new Promise(resolve => setTimeout(resolve, 100));

        // 🔹 Generate PDF using html2pdf (same UI as view)
        const pdfOptions = {
            margin: 10,
            filename: 'Quikkred-Loan-Agreement-' + documentNumber + '.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: 0,
                scrollX: 0,
                windowHeight: pageElement.scrollHeight
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        // Generate PDF blob directly from visible page
        const pdfBlob = await html2pdf().set(pdfOptions).from(pageElement).outputPdf('blob');

        // Restore original styles
        pageElement.setAttribute('style', originalStyle);

        // Show approve section again
        if (approveSection) approveSection.style.display = 'block';

        // 🔹 Download PDF locally for user's copy
     
        // 🔹 Upload PDF to API
        const formData = new FormData();
        formData.append('eSignDoc', pdfBlob, 'loan-agreement.pdf');

        const response = await fetch('https://alpha.quikkred.in/api/kyc/eSign/upload?documentNumber=' + documentNumber, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success && result.data && result.data.url) {
            // Set approval flag
            localStorage.setItem('dataAgreementApproved', 'true');

            // Open the URL from response for next process
            window.location.href = result.data.url;
        } else {
            throw new Error(result.message || 'Failed to upload agreement');
        }

    } catch (error) {
        console.error('Error processing agreement:', error);
        alert('Error: ' + (error.message || 'Failed to process agreement. Please try again.'));

        // Reset button state
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.textContent = 'I Agree & Approve';
        loadingIndicator.style.display = 'none';
    }
}
    </script>
</body>
</html>`;
  };

  const calculateEMI = () => {
    if (!selectedProduct || !formData.loanAmount || !formData.tenure) {
      setEmiCalculation(null);
      return;
    }

    const principal = parseFloat(formData.loanAmount.replace(/,/g, ''));
    const tenureDays = parseInt(formData.tenure); // Tenure is always in days for products
    const dailyRate = selectedProduct.dailyInterestRate / 100;
    const processingFeePercent = selectedProduct.processingFee / 100;
    const gstPercent = selectedProduct.gst / 100;

    // Calculate total interest based on daily rate and tenure days
    const totalInterest = principal * dailyRate * tenureDays;

    // Calculate processing fee and GST
    const processingFee = principal * processingFeePercent;
    const gstOnProcessingFee = processingFee * gstPercent;
    const totalProcessingFee = processingFee + gstOnProcessingFee;

    // Total amount to be repaid (principal + interest)
    const totalAmount = principal + totalInterest;

    // EMI calculation - For tenure <= 45 days, it's lump sum payment
    let emi: number;
    let isLumpSum = false;
    const tenureMonths = Math.ceil(tenureDays / 30); // Convert days to months for display

    if (tenureDays <= 45) {
      emi = Math.round(totalAmount); // Full amount in one payment
      isLumpSum = true;
    } else {
      emi = Math.round(totalAmount / tenureMonths);
    }

    setEmiCalculation({
      principal: principal,
      dailyInterestRate: selectedProduct.dailyInterestRate,
      totalDays: tenureDays,
      totalInterest: Math.round(totalInterest),
      processingFee: Math.round(processingFee),
      gst: Math.round(gstOnProcessingFee),
      totalProcessingFee: Math.round(totalProcessingFee),
      totalAmount: Math.round(totalAmount),
      emi: emi,
      tenureMonths: tenureMonths,
      isLumpSum: isLumpSum,
      tenureUnit: 'days',
      tenureValue: tenureDays
    });
  };

  const handleProductChange = (productId: string) => {
    const product = loanProducts.find(p => p._id === productId);
    setSelectedProduct(product || null);

    // Automatically set purpose based on selected product
    const purpose = product ? `${product.productName} - ${product.category}` : '';

    // Reset tenure when product changes and set default from allowedTenures or minTenure
    let defaultTenure = '';
    if (product) {
      if (product.allowedTenures && product.allowedTenures.length > 0) {
        defaultTenure = product.allowedTenures[0].toString();
      } else {
        defaultTenure = product.minTenure?.toString() || '';
      }
    }

    setFormData(prev => ({
      ...prev,
      productId: productId,
      purpose: purpose,
      tenure: defaultTenure,
      tenureUnit: 'days' // Products use days for tenure
    }));
  };

  // Step 1 validation - all mandatory fields must be correctly filled
  const isStep1Valid = () => {
    // For logged-in users with API-determined step > 1, basic details are already filled
    if (user && apiDeterminedStep && apiDeterminedStep > 1) {
      return true;
    }

    // Check verification (logged-in users are auto-verified)
    const isVerified = user ? true : (verificationMethod === 'email' ? formData.emailVerified : formData.mobileVerified);
    if (!isVerified) return false;

    // Full Name validation
    if (!formData.fullName || formData.fullName.trim().length < 3) return false;
    if (/\d/.test(formData.fullName)) return false;
    if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) return false;

    // Email validation - for logged-in users, use user.email as fallback
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailToCheck = formData.email || user?.email || '';
    if (!emailToCheck || !emailRegex.test(emailToCheck)) return false;

    // Mobile validation - for logged-in users, use user.mobile as fallback
    const mobileToCheck = formData.mobile || user?.mobile || '';
    if (!mobileToCheck || mobileToCheck.length !== 10) return false;
    if (!/^[6-9]\d{9}$/.test(mobileToCheck)) return false;

    // DOB validation (must be 18+)
    if (!formData.dob) return false;
    const dob = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    if (actualAge < 18) return false;

    // Employment Type validation
    if (!formData.employmentType) return false;

    // Monthly Income validation (minimum ₹10,000)
    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) < 10000) return false;

    // Company Name / Income Source validation
    if (!formData.companyName || formData.companyName.trim().length < 2) return false;

    // Loan Amount validation
    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) return false;

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Special handling for mobile - only allow numbers
    if (name === 'mobile') {
      if (value && !/^\d*$/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          mobile: "Mobile number can only contain numbers"
        }));
        return; // Don't update if non-numeric
      } else if (value && value.length === 10 && !/^[6-9]\d{9}$/.test(value)) {
        // Validate Indian mobile number format when 10 digits entered
        setFieldErrors(prev => ({
          ...prev,
          mobile: "Mobile number must start with 6, 7, 8, or 9"
        }));
      } else if (value && value.length === 10 && /^[6-9]\d{9}$/.test(value)) {
        // Clear error when valid 10 digit number
        setFieldErrors(prev => ({
          ...prev,
          mobile: ""
        }));
      }
      // Don't show "must be 10 digits" error while typing - that's handled on blur
    }

    // Special handling for accountNumber - only allow numbers
  if (name === 'accountNumber') {

    // Block non-numeric input
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    // Length validation
    if (value.length < 9) {
      setFieldErrors((prev) => ({
        ...prev,
        accountNumber: "Account number must be at least 9 digits"
      }));
    } else if (value.length > 18) {
      setFieldErrors((prev) => ({
        ...prev,
        accountNumber: "Account number cannot exceed 18 digits"
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, accountNumber: "" }));
    }
  }



  // Update form normally
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

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

    // Special handling for reference names - don't allow numbers, only letters and spaces
    if ((name === 'reference1Name' || name === 'reference2Name') && value) {
      if (/\d/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: "Name cannot contain numbers"
        }));
        return; // Don't update if contains numbers
      }
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: "Name can only contain letters and spaces"
        }));
        return; // Don't update if contains special characters
      }
      // Clear error if valid
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Special handling for reference mobile numbers - only allow numbers, validate 10 digits starting with 6-9
    if ((name === 'reference1Mobile' || name === 'reference2Mobile')) {
      if (value && !/^\d*$/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: "Mobile number can only contain numbers"
        }));
        return; // Don't update if non-numeric
      }
      if (value && value.length > 10) {
        return; // Don't allow more than 10 digits
      }
      if (value && value.length > 0 && value.length !== 10) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: "Mobile number must be exactly 10 digits"
        }));
      } else if (value && value.length === 10 && !/^[6-9]\d{9}$/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: "Mobile number must start with 6, 7, 8, or 9"
        }));
      } else {
        // Clear error when valid
        setFieldErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
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

  // Mobile number blur validation
  const handleMobileBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setFieldErrors(prev => ({
        ...prev,
        mobile: "Mobile number is required"
      }));
    } else if (value.length !== 10) {
      setFieldErrors(prev => ({
        ...prev,
        mobile: "Mobile number must be exactly 10 digits"
      }));
    } else if (!/^[6-9]\d{9}$/.test(value)) {
      setFieldErrors(prev => ({
        ...prev,
        mobile: "Mobile number must start with 6, 7, 8, or 9"
      }));
    } else {
      setFieldErrors(prev => ({
        ...prev,
        mobile: ""
      }));
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const payload = verificationMethod === 'email'
        ? { email: formData.email }
        : { mobile: formData.mobile };
console.log('Sending OTP with payload:', payload);

      const response = await fetch("https://alpha.quikkred.in/api/auth/customer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpSent(true);
        setEmailOtpTimer(30); // Start 30 second countdown
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

      const response = await fetch("https://alpha.quikkred.in/api/auth/customer/verifyOtp", {
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
        // Store userId if provided
        if (data.data?.userId) {
          localStorage.setItem('userId', data.data.userId);
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
            // Using Redux for customer/get API
            const customerResult = await getCustomer();

            if (customerResult.success && customerResult.data) {
              const profileData = customerResult.data;
              console.log('✅ Customer data fetched successfully');

              // Store user info in localStorage for AuthContext
              console.log('📝 Storing user info in localStorage:', {
                fullName: profileData.fullName,
                email: profileData.email,
                mobile: profileData.mobile,
                _id: profileData._id
              });
              if (profileData.fullName) {
                localStorage.setItem('userName', profileData.fullName);
                console.log('✅ userName stored:', profileData.fullName);
              } else {
                console.warn('⚠️ fullName is empty, not storing userName');
              }
              if (profileData.email) {
                localStorage.setItem('userEmail', profileData.email);
              }
              if (profileData.mobile) {
                localStorage.setItem('userMobile', profileData.mobile);
              }
              if (profileData._id) {
                localStorage.setItem('userId', profileData._id);
              }

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
                accountHolderName: profileData.banks?.[0]?.accountHolderName || prev.accountHolderName,
                accountNumber: profileData.banks?.[0]?.accountNumber || prev.accountNumber,
                ifsc: profileData.banks?.[0]?.ifscCode || prev.ifsc,
                loanAmount: profileData.requestedLoanAmount?.toString() || prev.loanAmount,
              }));

              // Set bank verified flag if bank has been verified via penny drop
              if (profileData.banks?.[0]?.pennyDropStatus === 'VERIFIED') {
                setBankVerified(true);
                console.log('✅ Bank already verified (penny drop)');
              }

              // Set verification flags from API if available
              if (profileData.isPanVerify) {
                setPanVerified(true);
                console.log('✅ PAN already verified');
              }
              if (profileData.isAadhaarVerify) {
                setAadhaarVerified(true);
                console.log('✅ Aadhaar already verified');
              }

              // Load selfie preview from profile if available
              if (profileData.profile?.s3URL) {
                setSelfiePreview(profileData.profile.s3URL);
                setSelfieCaptured(true);
                console.log('✅ Selfie loaded from profile:', profileData.profile.s3URL);

                // Check if selfie/profile is verified - disable retake if verified
                if (profileData.profile?.status === 'VERIFIED') {
                  setSelfieVerified(true);
                  console.log('✅ Selfie already verified - retake disabled');
                }
              }

              // Check eSign status from profile
              // Handle both formats: eSign: true (boolean) or eSign: { status: 'SUCCESS' } (object)
              if (profileData.eSign === true) {
                setUserESignStatus('SUCCESS');
                setESignVerified(true);
                console.log('✅ eSign already completed (boolean: true)');
              } else if (profileData.eSign?.status) {
                setUserESignStatus(profileData.eSign.status);
                console.log('📝 eSign status from profile:', profileData.eSign.status);
                if (profileData.eSign.status === 'SUCCESS') {
                  setESignVerified(true);
                  console.log('✅ eSign already completed (status: SUCCESS)');
                }
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

              // ============================================
              // CHECKLIST-BASED REDIRECT LOGIC (after OTP verification)
              // If all onboarding steps are complete, redirect to Dashboard
              // ============================================
              const toBoolean = (value: unknown): boolean => {
                if (typeof value === 'boolean') return value;
                if (typeof value === 'string') return value.toLowerCase() === 'true';
                if (typeof value === 'number') return value === 1;
                return false;
              };

              const isBasicDetailsFilled = toBoolean(profileData.isBasicDetailsFilled);
              const isKycDetailsFilled = toBoolean(profileData.isKycDetailsFilled);
              const isBankDetailsFilled = toBoolean(profileData.isBankDetailsFilled);
              const isSubmit = toBoolean(profileData.isSubmit);

              console.log('📋 Checklist after OTP:', {
                isBasicDetailsFilled,
                isKycDetailsFilled,
                isBankDetailsFilled,
                isSubmit
              });

              const allChecklistComplete = isBasicDetailsFilled && isKycDetailsFilled && isBankDetailsFilled && isSubmit;

              if (allChecklistComplete) {
                console.log('✅ All checklist items complete - redirecting to Dashboard');
                toast({
                  variant: "success",
                  title: "Welcome Back!",
                  description: "Your application is complete. Redirecting to dashboard...",
                });
                // Use full page reload to ensure AuthContext reinitializes with updated localStorage
                window.location.href = '/user';
                return;
              }

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

      const response = await fetch('https://alpha.quikkred.in/api/kyc/pan/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          panNumber: formData.pan,
          // name: formData.fullName,
          // dob: formatDOBForAPI(formData.dob)s
        }),
      });

      const result = await response.json();

      // Check if API returned success
      if (result.success) {
        setPanVerified(true);
        setPanData(result.data || null);
        setPanError(""); // Clear any errors
        setPanReverifyTimer(15); // Start 15 second cooldown for reverify

        toast({
          variant: "success",
          title: "PAN Verified!",
          description: result.message || "PAN verification successful!",
        });
      } else {
        // API returned error
        const errorMsg = result.message || 'Failed to verify PAN. Please check the PAN number and try again.';
        setPanError(errorMsg);
        setPanReverifyTimer(15); // Start 15 second cooldown before retry
        toast({
          variant: "error",
          title: "Verification Failed",
          description: errorMsg,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to verify PAN. Please try again.';
      setPanError(errorMsg);
      setPanReverifyTimer(30); // Start 30 second cooldown before retry
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

      // First call verification endpoint to check redirect
      const verifyResponse = await fetch('https://alpha.quikkred.in/api/kyc/aadhaar/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ aadhaarNumber: formData.aadhaar }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        // Check if redirect is required
        if (verifyResult.data?.redirect && verifyResult.data?.url) {
          // Redirect to DigiLocker URL
          toast({
            variant: "success",
            title: "Redirecting to DigiLocker",
            description: "Please complete the verification on DigiLocker.",
          });
          window.location.href = verifyResult.data.url;
          return;
        } else {
          // No redirect means OTP has been sent by verification endpoint
          setAadhaarOtpSent(true);
          setAadhaarOtpTimer(30); // Start 30 second countdown
          setAadhaarError(""); // Clear any errors
          toast({
            variant: "success",
            title: "OTP Sent Successfully!",
            description: verifyResult.message || "OTP has been sent to your Aadhaar-linked mobile number. Please enter it below.",
          });
        }
      } else {
        const errorMsg = verifyResult.message || 'Aadhaar verification failed. Please check the number and try again.';
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
        title: "Error",
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

      const response = await fetch('https://alpha.quikkred.in/api/kyc/aadhaar/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ otp: aadhaarOtp, aadhaar_number: formData.aadhaar }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setAadhaarVerified(true);
        setAadhaarData(result.data);
        setAadhaarError(""); // Clear any errors
        setAadhaarOtp(""); // Clear OTP field
        setAadhaarReverifyTimer(30); // Start 30 second cooldown for reverify

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
        setAadhaarReverifyTimer(30); // Start 30 second cooldown before retry
        toast({
          variant: "error",
          title: "Verification Failed",
          description: errorMsg,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Network error. Please check your connection and try again.';
      setAadhaarError(errorMsg);
      setAadhaarReverifyTimer(30); // Start 30 second cooldown before retry
      toast({
        variant: "error",
        title: "Verification Error",
        description: errorMsg,
      });
    } finally {
      setAadhaarVerifying(false);
    }
  };

  // Verify Bank Account
  const verifyBankAccount = async () => {
    // Validate required fields
    if (!formData.accountNumber || formData.accountNumber.length < 9) {
      setBankVerifyError("Please enter a valid account number (minimum 9 digits)");
      toast({
        variant: "warning",
        title: "Invalid Account Number",
        description: "Please enter a valid account number (minimum 9 digits)",
      });
      return;
    }

    if (!formData.ifsc || formData.ifsc.length !== 11) {
      setBankVerifyError("Please enter a valid 11-character IFSC code");
      toast({
        variant: "warning",
        title: "Invalid IFSC Code",
        description: "Please enter a valid 11-character IFSC code",
      });
      return;
    }

    if (!formData.accountHolderName || formData.accountHolderName.trim().length < 3) {
      setBankVerifyError("Please enter the account holder name");
      toast({
        variant: "warning",
        title: "Account Holder Name Required",
        description: "Please enter the account holder name",
      });
      return;
    }

    setBankVerifying(true);
    setBankVerifyError("");

    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      const response = await fetch('https://alpha.quikkred.in/api/kyc/bank/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifsc,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName === 'OTHER' ? formData.customBankName : formData.bankName
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setBankVerified(true);
        setBankVerifyError("");

        // Update account holder name if returned from API
        if (result.data?.accountHolderName) {
          setFormData(prev => ({
            ...prev,
            accountHolderName: result.data.accountHolderName
          }));
        }

        toast({
          variant: "success",
          title: "Bank Account Verified! ✓",
          description: result.data?.accountHolderName
            ? `Account verified for ${result.data.accountHolderName}`
            : "Your bank account has been verified successfully.",
        });
      } else {
        const errorMsg = result.message || result.error || 'Bank verification failed. Please check your details.';
        setBankVerifyError(errorMsg);
        setBankVerified(false);
        toast({
          variant: "error",
          title: "Verification Failed",
          description: errorMsg,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Network error. Please check your connection and try again.';
      setBankVerifyError(errorMsg);
      setBankVerified(false);
      toast({
        variant: "error",
        title: "Verification Error",
        description: errorMsg,
      });
    } finally {
      setBankVerifying(false);
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

    // Face verification (livenessStatus) succeeded - disable retake
    setSelfieVerified(true);

    toast({
      variant: "success",
      title: "Selfie Captured Successfully! ✓",
      description: "Your selfie has been captured and validated.",
    });
  };

  const handleCloseSelfieModal = () => {
    setSelfieCapture(false);
  };

  // Get user's location and save to localStorage
  const getLocation = (): Promise<{latitude: number; longitude: number} | null> => {
    return new Promise((resolve) => {
      // Check if location is already in localStorage
      const storedLocation = localStorage.getItem('userLocation');
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        setUserLocation(parsedLocation);
        resolve(parsedLocation);
        return;
      }

      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          // Save to localStorage
          localStorage.setItem('userLocation', JSON.stringify(location));
          setUserLocation(location);
          console.log('✅ User location captured:', location);
          resolve(location);
        },
        (error) => {
          console.warn('Error getting location:', error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });
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
        // Step 1: Basic Details + Employment + Loan Amount
        const nameParts = formData.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // Use fallback values from user object if form data is empty
        const mobileToSave = formData.mobile || user?.mobile || '';
        const emailToSave = formData.email || user?.email || '';

        // Get location from localStorage
        const storedLocation = localStorage.getItem('userLocation');
        const locationData = storedLocation ? JSON.parse(storedLocation) : null;

        payload = {
          basicDetails: {
            firstName,
            lastName,
            mobile: mobileToSave,
            email: emailToSave,
            dateOfBirth: formData.dob,
            employmentType: formData.employmentType,
            companyName: formData.companyName,
            monthlyIncome: parseFloat(formData.monthlyIncome),
            isBasicDetailsFilled: true
          },
          loanDetails: {
            requestedLoanAmount: parseFloat(formData.loanAmount)
          },
          ...(locationData && {
            location: {
              latitude: locationData.latitude,
              longitude: locationData.longitude
            }
          })
        };
      } else if (step === 2) {
        // Step 2: KYC Details with Photo - use FormData
        const formDataToSend = new FormData();

 const payload = {
  kycDetails: {
    isKycDetailsFilled: true
  }
};

        
        // formDataToSend.append('data', JSON.stringify(kycPayload));

        // Add selfie photo file
        // if (formData.selfie) {
        //   formDataToSend.append('photo', formData.selfie, formData.selfie.name);
        //   console.log('✅ Adding selfie photo to Step 2:', formData.selfie.name);
        // }

        const response = await fetch(`https://alpha.quikkred.in/api/application/loan/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.data) {
          if (result.data.customerId) localStorage.setItem('userId', result.data.customerId);
          if (result.data.applicationNumber) localStorage.setItem('applicationId', result.data.applicationNumber);
          if (result.data.loanNumber) localStorage.setItem('loanNumber', result.data.loanNumber);
        }

        if (response.ok && result.success) {
          console.log(`✅ Step 2 data saved successfully`);
          return true;
        } else {
          console.error(`❌ Failed to save step 2 data:`, result.message);
          toast({
            variant: "error",
            title: "Data Save Failed",
            description: result.message || `Failed to save step 2 data. Please check your information and try again.`,
          });
          return false;
        }
      } else if (step === 3) {
        // Step 3: Bank Details
        payload = {
          bankDetails: {
            isBankDetailsFilled: true
          }
        };
      }

      const response = await fetch(`https://alpha.quikkred.in/api/application/loan/create`, {
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
      // Always validate and save Step 1 data (even if user navigated back to edit)
      // Clear previous errors
      const errors = {
        email: "",
        mobile: "",
        fullName: "",
        dob: "",
        aadhaar: "",
        pan: "",
        accountHolderName: "",
        accountNumber: "",
        ifsc: "",
        reference1Name: "",
        reference1Mobile: "",
        reference2Name: "",
        reference2Mobile: ""
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

      // Email validation - use user email as fallback for logged-in users
      const emailToValidate = formData.email || user?.email || '';
      if (!emailToValidate) {
        errors.email = "Email is required";
        hasError = true;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailToValidate)) {
          errors.email = "Please enter a valid email address";
          hasError = true;
        }
      }

      // Mobile validation - use user mobile as fallback for logged-in users
      const mobileToValidate = formData.mobile || user?.mobile || '';
      if (!mobileToValidate) {
        errors.mobile = "Mobile number is required";
        hasError = true;
      } else if (!/^\d+$/.test(mobileToValidate)) {
        errors.mobile = "Mobile number can only contain numbers";
        hasError = true;
      } else if (mobileToValidate.length !== 10) {
        errors.mobile = "Mobile number must be exactly 10 digits";
        hasError = true;
      } else if (!/^[6-9]\d{9}$/.test(mobileToValidate)) {
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

      // Update field errors
      setFieldErrors(errors);

      // If there are errors, don't proceed
      if (hasError) {
        return;
      }

      // Employment validations for Step 1
      if (!formData.employmentType) {
        toast({
          variant: "warning",
          title: "Employment Type Required",
          description: "Please select your employment type.",
        });
        return;
      }

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

      if (!formData.companyName || formData.companyName.trim().length < 2) {
        toast({
          variant: "warning",
          title: formData.employmentType === "SALARIED" ? "Company Name Required" : "Income Source Required",
          description: formData.employmentType === "SALARIED" ? "Please enter your company name." : "Please enter your income source.",
        });
        return;
      }

      // Loan Amount validation for Step 1
      if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
        toast({
          variant: "warning",
          title: "Invalid Loan Amount",
          description: "Please enter the approximate loan amount you need.",
        });
        return;
      }

      // Save Step 1 data (basic details + employment + loan amount)
      setLoading(true);
      const saveSuccess = await saveCustomerData(1);
      setLoading(false);

      // If save failed, don't proceed to next step
      if (!saveSuccess) {
        toast({
          variant: "error",
          title: "Cannot Proceed",
         
        });
        return;
      }
    }

    if (currentStep === 2) {
      // Step 2: Aadhaar & PAN Verification
      // Aadhaar validation
      if (!formData.aadhaar) {
        setFieldErrors(prev => ({ ...prev, aadhaar: "Aadhaar number is required" }));
        toast({
          variant: "warning",
          title: "Aadhaar Required",
          description: "Please enter your Aadhaar number.",
        });
        return;
      } else if (!aadhaarVerified) {
        const aadhaarRegex = /^\d{12}$/;
        if (!aadhaarRegex.test(formData.aadhaar)) {
          setFieldErrors(prev => ({ ...prev, aadhaar: "Enter a valid 12-digit Aadhaar number" }));
          return;
        } else {
          toast({
            variant: "warning",
            title: "Aadhaar Verification Required",
            description: "Please verify your Aadhaar number to proceed.",
          });
          return;
        }
      }

      // PAN validation
      if (!formData.pan) {
        setFieldErrors(prev => ({ ...prev, pan: "PAN number is required" }));
        toast({
          variant: "warning",
          title: "PAN Required",
          description: "Please enter your PAN number.",
        });
        return;
      } else if (!panVerified) {
        toast({
          variant: "warning",
          title: "PAN Verification Required",
          description: "Please verify your PAN number to proceed.",
        });
        return;
      }

      // Selfie validation
      if (!selfieCaptured) {
        toast({
          variant: "warning",
          title: "Selfie Required",
          description: "Please capture a selfie for identity verification.",
        });
        return;
      }

      // Save Step 2 data (Aadhaar & PAN)
      setLoading(true);

      try {
        const saveSuccess = await saveCustomerData(2);
        setLoading(false);

        // If save failed, don't proceed to next step
        if (!saveSuccess) {
          toast({
            variant: "error",
            title: "Cannot Proceed",
           
          });
          return;
        }
      } catch (error) {
        setLoading(false);
        toast({
          variant: "error",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
        return;
      }
    }

    if (currentStep === 3) {
      // Step 3: Bank Details Validation & BRE API Call

      // Bank Name validation
      if (!formData.bankName) {
        toast({
          variant: "warning",
          title: "Bank Name Required",
          description: "Please select your bank name.",
        });
        return;
      }

      // Custom Bank Name validation when "Other" is selected
      if (formData.bankName === 'OTHER' && !formData.customBankName?.trim()) {
        toast({
          variant: "warning",
          title: "Bank Name Required",
          description: "Please enter your bank name.",
        });
        return;
      }

      // Account Number validation
      if (!formData.accountNumber || formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
        toast({
          variant: "warning",
          title: "Invalid Account Number",
          description: "Please enter a valid bank account number (9-18 digits).",
        });
        return;
      }

      // IFSC validation
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!formData.ifsc || !ifscRegex.test(formData.ifsc.toUpperCase())) {
        toast({
          variant: "warning",
          title: "Invalid IFSC Code",
          description: "Please enter a valid IFSC code (e.g., SBIN0001234).",
        });
        return;
      }

      // Account Holder Name validation
      if (!formData.accountHolderName || formData.accountHolderName.trim().length < 3) {
        toast({
          variant: "warning",
          title: "Account Holder Name Required",
          description: "Please enter the account holder name as per bank records.",
        });
        return;
      }

      // Bank Verification check - mandatory before proceeding
      if (!bankVerified) {
        toast({
          variant: "warning",
          title: "Bank Verification Required",
          description: "Please verify your bank account before proceeding.",
        });
        return;
      }

      // Save Bank Details and call BRE API
      setLoading(true);
      setApprovalLoading(true);

      try {
        const token = localStorage.getItem('accessToken') ||
                      localStorage.getItem('token') ||
                      localStorage.getItem('authToken');

        // Call both APIs in parallel - save bank details and get BRE data using Redux
        const [saveSuccess, breResponse] = await Promise.all([
          saveCustomerData(3), // Save bank details
          initBRE().catch((err: any) => {
            console.error('BRE API error:', err);
            return null;
          })
        ]);

        setLoading(false);
        setApprovalLoading(false);

        // Check if bank details save failed
        if (!saveSuccess) {
          toast({
            variant: "error",
            title: "Cannot Proceed",
            description: "Failed to save bank details. Please try again.",
          });
          return;
        }

        // Store BRE data for Step 4 (Approval)
        if (breResponse && breResponse.success && breResponse.data) {
          setApprovalData({
            ...breResponse.data,
            // Add user details for display
            fullName: formData.fullName,
            mobile: formData.mobile,
            email: formData.email,
            pan: formData.pan,
            aadhaar: formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : '',
            monthlyIncome: formData.monthlyIncome,
            employmentType: formData.employmentType
          });
        } else {
          // If BRE API fails, show error
          toast({
            variant: "error",
            title: "BRE Check Failed",
            description: breResponse?.message || "Unable to check eligibility. Please try again.",
          });
          return;
        }
      } catch (error) {
        setLoading(false);
        setApprovalLoading(false);
        toast({
          variant: "error",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
        return;
      }
    }

    if (currentStep === 4) {
      // Step 4: Approval - Final submission
      // If eSign is already verified (SUCCESS), skip all validations and submit directly
      if (!eSignVerified) {
        // Only validate if eSign is NOT verified
        if (!dataAgreementChecked) {
          toast({
            variant: "warning",
            title: "Confirmation Required",
            description: "Please click 'Confirm Details' button to review and confirm your application data.",
          });
          return;
        }

        // Consent validation
        // if (!formData.creditBureauConsent || !formData.termsConsent) {
        //   setConsentError(true);
        //   toast({
        //     variant: "warning",
        //     title: "Consent Required",
        //     description: "Please accept the required consents to proceed.",
        //   });
        //   return;
        // }

        // Clear consent error if validation passes
        setConsentError(false);
      }

      // Final step - submit application (bank details already saved in step 3)
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

        // Step 4 Final Submit - submit the application with user's selected loan amount
        const payload = {
          isSubmit: true,
        };

        const response = await fetch(`https://alpha.quikkred.in/api/application/loan/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
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

          // Show success toast
          toast({
            variant: "success",
            title: "Application Submitted",
            description: "Your loan application has been submitted successfully.",
          });

          // Redirect to dashboard
          setLoading(false);
          router.push('/user');
          return;
        } else {
          // API returned error - show error and stay on step 4
          console.error('❌ Loan application failed:', result.message);
          toast({
            variant: "error",
            title: "Application Failed",
            description: result.message || "Failed to submit loan application. Please try again.",
          });
          setLoading(false);
          return; // Don't proceed, stay on step 4
        }
      } catch (error: any) {
        console.error('Error submitting loan application:', error);
        // Show error toast and stay on step 4
        toast({
          variant: "error",
          title: "Submission Error",
          description: error.message || "Network error occurred. Please check your connection and try again.",
        });
        setLoading(false);
        return; // Don't proceed, stay on step 4
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
  if (loading && currentStep === 4 && !decision) {
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
                    customBankName: "",
                    accountHolderName: "",
                    accountNumber: "",
                    ifsc: "",
                    loanAmount: "",
                    tenure: "12",
                    tenureUnit: "",
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
                  setBankVerified(false);
                  setBankVerifyError("");
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
    <>
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
            className="flex items-center bg-white gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-[#25b181] rounded-lg transition-all shadow-sm"
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
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Quick Loan Application</h1>
            <p className="text-sm sm:text-base text-gray-600">Get instant approval in just 3 minutes</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full transition-all ${
                  step <= currentStep ? 'bg-[#25B181]' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600">
            <span className={`text-center ${currentStep === 1 ? 'text-[#25B181] font-semibold' : ''}`}>Basic Details</span>
            <span className={`text-center ${currentStep === 2 ? 'text-[#25B181] font-semibold' : ''}`}>Identity</span>
            <span className={`text-center ${currentStep === 3 ? 'text-[#25B181] font-semibold' : ''}`}>Bank Details</span>
            <span className={`text-center ${currentStep === 4 ? 'text-[#25B181] font-semibold' : ''}`}>Approval</span>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0.9, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.9, x: -5 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-8"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Details</h2>

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
                    {/* <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Choose Verification Method *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationMethod('email');
                            setOtpSent(false);
                            setFormData(prev => ({ ...prev, otp: '' })); // Clear OTP field
                          }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
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
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                            verificationMethod === 'mobile'
                              ? 'bg-[#25B181] text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#25B181]'
                          }`}
                        >
                          <Phone className="w-5 h-5 inline mr-2" />
                          Verify with Mobile
                        </button>
                      </div>
                    </div> */}
                  </>
                )}

                {/* Email Verification - Only show for non-logged in users */}
                {!user && verificationMethod === 'email' && (
                  <>
                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address *
  </label>

  <div className="flex flex-col sm:flex-row gap-2">
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
        className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? "Sending..." : otpSent ? (emailOtpTimer > 0 ? `Resend (${emailOtpTimer}s)` : "Resend OTP") : "Verify"}
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
                        <div className="flex flex-col sm:flex-row gap-2">
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
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          onBlur={handleMobileBlur}
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
                            className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap"
                          >
                            {loading ? "Sending..." : otpSent ? (emailOtpTimer > 0 ? `Resend (${emailOtpTimer}s)` : "Resend OTP") : "Verify"}
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
                        <div className="flex flex-col sm:flex-row gap-2">
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
                    {/* Mobile + DOB side by side for logged-in user */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          onBlur={handleMobileBlur}
                          disabled={formData.mobileVerified}
                          maxLength={10}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                            fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                          } ${formData.mobileVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="9876543210"
                        />
                        {fieldErrors.mobile && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                        )}
                      </div>
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
                    </div>
                  </>
                ) : (
                  <>
                    {verificationMethod === 'email' && (
                      <>
                        {/* Mobile + DOB side by side for email verification */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mobile Number *
                            </label>
                            <input
                              type="tel"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              onBlur={handleMobileBlur}
                              maxLength={10}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                                fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="9876543210"
                            />
                            {fieldErrors.mobile && (
                              <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                            )}
                          </div>
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
                        </div>
                      </>
                    )}

                    {verificationMethod === 'mobile' && (
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
                        {/* DOB for mobile verification */}
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
                      </>
                    )}
                  </>
                )}

                {/* Employment Details - Added to Step 1 */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
                  <div className="space-y-4">
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
                          {/* <option value="UNEMPLOYED">UNEMPLOYED</option>
                        <option value="STUDENT">STUDENT</option>
                         <option value="RETIRED">RETIRED</option> */}
                        {/* "SALARIED", "SELF-EMPLOYED", "UNEMPLOYED", "STUDENT", "RETIRED" */}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Income *
                        </label>
                        <input
                          type="text"
                          name="monthlyIncome"
                          value={
                            formData.monthlyIncome
                              ? parseFloat(formData.monthlyIncome.replace(/,/g, '')).toLocaleString('en-IN')
                              : ''
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/,/g, '');
                            if (/^\d*$/.test(value)) {
                              handleChange({
                                ...e,
                                target: {
                                  ...e.target,
                                  name: 'monthlyIncome',
                                  value: value
                                }
                              });
                            }
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                          placeholder="₹ 50,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formData.employmentType === "SALARIED" ? "Company Name" : "Income Source"} *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                          placeholder={formData.employmentType === "SALARIED" ? "Your Company" : "Your Income Source"}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Amount */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Requirement</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How much loan do you need? *
                    </label>
                    <input
                      type="text"
                      name="loanAmount"
                      value={
                        formData.loanAmount
                          ? parseFloat(formData.loanAmount.replace(/,/g, "")).toLocaleString("en-IN")
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        if (!/^\d*$/.test(raw)) return;
                        handleChange({
                          ...e,
                          target: {
                            ...e.target,
                            name: "loanAmount",
                            value: raw,
                          },
                        } as any);
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                        formData.loanAmount && (parseFloat(formData.loanAmount.replace(/,/g, "")) < 5000 || parseFloat(formData.loanAmount.replace(/,/g, "")) > 25000)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="₹ 5,000 - ₹ 25,000"
                    />
                    {formData.loanAmount && parseFloat(formData.loanAmount.replace(/,/g, "")) < 5000 && (
                      <p className="mt-1 text-xs text-red-500">Minimum loan amount is ₹5,000</p>
                    )}
                    {formData.loanAmount && parseFloat(formData.loanAmount.replace(/,/g, "")) > 25000 && (
                      <p className="mt-1 text-xs text-red-500">Maximum loan amount is ₹25,000</p>
                    )}
                    {(!formData.loanAmount || (parseFloat(formData.loanAmount.replace(/,/g, "")) >= 5000 && parseFloat(formData.loanAmount.replace(/,/g, "")) <= 25000)) && (
                      <p className="mt-1 text-xs text-gray-500">Enter the approximate loan amount you require</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Aadhaar & PAN Verification */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Identity Verification</h2>

                <div className="grid grid-cols-1 gap-6">

{/* PAN Verification */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={(e) => {
                          const upperValue = e.target.value.toUpperCase();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: upperValue, name: 'pan' }
                          } as any);
                          if (panVerified) setPanVerified(false);
                          if (panError) setPanError("");
                        }}
                        disabled={panVerified}
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
                          disabled={!formData.pan || formData.pan.length !== 10 || panVerifying || panReverifyTimer > 0}
                          className={`px-6 py-3 text-white rounded-lg whitespace-nowrap ${
                            panReverifyTimer > 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#25B181] hover:bg-[#1d8f6a] disabled:opacity-50'
                          }`}
                        >
                          {panVerifying ? "Verifying..." : panReverifyTimer > 0 ? `Verify (${panReverifyTimer}s)` : "Verify"}
                        </button>
                      )}
                      {panVerified && (
                        <div className="px-6 py-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2 whitespace-nowrap">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Verified</span>
                        </div>
                      )}
                    </div>
                    {(panError || fieldErrors.pan) && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{panError || fieldErrors.pan}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Aadhaar Verification */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number *
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="tel"
                        name="aadhaar"
                        value={formData.aadhaar.replace(/(\d{4})(?=\d)/g, '$1 ')}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                          const syntheticEvent = {
                            target: {
                              name: 'aadhaar',
                              value: rawValue.slice(0, 12)
                            }
                          } as React.ChangeEvent<HTMLInputElement>;
                          handleChange(syntheticEvent);
                          if (aadhaarVerified || aadhaarOtpSent) {
                            setAadhaarVerified(false);
                            setAadhaarOtpSent(false);
                            setAadhaarOtp("");
                          }
                          if (aadhaarError) setAadhaarError("");
                        }}
                        disabled={aadhaarVerified || aadhaarOtpSent}
                        maxLength={14}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 disabled:cursor-not-allowed tracking-widest ${
                          fieldErrors.aadhaar || aadhaarError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1234 5678 9012"
                      />
                      {!aadhaarVerified && (
                        <button
                          type="button"
                          onClick={sendAadhaarOTP}
                          disabled={!formData.aadhaar || formData.aadhaar.length !== 12 || aadhaarVerifying || (aadhaarOtpSent && aadhaarOtpTimer > 0)}
                          className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {aadhaarVerifying ? "Sending..." : aadhaarOtpSent ? (aadhaarOtpTimer > 0 ? `Resend (${aadhaarOtpTimer}s)` : "Resend OTP") : "Verify"}
                        </button>
                      )}
                      {aadhaarVerified && (
                        <div className="px-6 py-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2 whitespace-nowrap">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Verified</span>
                        </div>
                      )}
                    </div>

                    {/* Aadhaar OTP Input */}
                    {aadhaarOtpSent && !aadhaarVerified && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Aadhaar OTP *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
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
                            disabled={aadhaarOtp.length !== 6 || aadhaarVerifying || aadhaarReverifyTimer > 0}
                            className={`px-6 py-3 text-white rounded-lg whitespace-nowrap ${
                              aadhaarReverifyTimer > 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 disabled:opacity-50'
                            }`}
                          >
                            {aadhaarVerifying ? "Verifying..." : aadhaarReverifyTimer > 0 ? `Verify (${aadhaarReverifyTimer}s)` : "Verify OTP"}
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          OTP sent to Aadhaar-linked mobile
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

                  
                </div>

                {/* Selfie Capture - Moved to Step 2 */}
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
                          <div className={`absolute top-2 right-2 ${selfieVerified ? 'bg-green-600' : 'bg-green-500'} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                            <CheckCircle className="w-4 h-4" />
                            {selfieVerified ? 'Verified' : 'Captured'}
                          </div>
                        </div>
                      </div>
                      {/* Only show Retake button if selfie is NOT verified */}
                      {!selfieVerified && (
                        <button
                          type="button"
                          onClick={captureSelfi}
                          className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
                        >
                          <Camera className="w-5 h-5" />
                          Retake Selfie
                        </button>
                      )}
                      {selfieVerified && (
                        <p className="text-center text-sm text-green-600 font-medium">
                          Your photo has been verified successfully
                        </p>
                      )}
                    </>
                  )}
                </div>



              </motion.div>
            )}

            {/* Step 4: Approval */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {approvalLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-[#25B181] mb-4" />
                    <p className="text-gray-600">Checking your eligibility...</p>
                  </div>
                ) : approvalData?.status === 'Reject' ? (
                  /* ========== REJECTED STATUS - Minimal UI ========== */
                  <div className="text-center py-8">
                    {/* Rejection Icon */}
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <X className="w-12 h-12 text-red-500" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Not Approved</h2>

                    {/* Message */}
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We regret to inform you that your loan application could not be approved based on our eligibility criteria.
                    </p>

                    {/* Application Number */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                      <p className="text-sm text-gray-500">Application Number</p>
                      <p className="font-semibold text-gray-800">{approvalData.applicationNumber || 'N/A'}</p>
                    </div>

                    {/* Countdown */}
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">
                          Redirecting to home in <span className="font-bold">{rejectionCountdown}</span> seconds
                        </span>
                      </div>
                    </div>

                    {/* Home Button */}
                    <button
                      onClick={() => router.push('/')}
                      className="bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all"
                    >
                      Go to Home
                    </button>
                  </div>
                ) : brePolling ? (
                  /* ========== BRE POLLING - PROCESSING UI ========== */
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Processing Your Application</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {brePollingMessage || 'Please wait while we verify your bank statement...'}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                      <p className="text-sm text-gray-500">This may take a few moments</p>
                      <p className="text-xs text-gray-400 mt-1">Please do not close this window</p>
                    </div>
                  </div>
                ) : finfactorSuccess ? (
                  /* ========== FINFACTOR SUCCESS - CONSENT UI ========== */
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Bank Statement Verification</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Your bank statement process is complete. Click the button below to continue with your loan application.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
                          if (!token) {
                            toast({ variant: "error", title: "Authentication Error", description: "Please login again to continue." });
                            return;
                          }
                          setConsentLoading(true);
                          try {
                            const customerId = localStorage.getItem('userId');
                            if (!customerId) {
                              toast({ variant: "error", title: "Error", description: "Customer ID not found. Please try again." });
                              setConsentLoading(false);
                              return;
                            }
                            const response = await fetch(`https://alpha.quikkred.in/api/kyc/consentHandleToFIRequest`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                              body: JSON.stringify({ customerId })
                            });
                            const result = await response.json();
                            if (response.ok && result.success) {
                              toast({ variant: "success", title: "Success", description: result.message || "Verification completed successfully." });
                              // Start polling finfactor/initialize API
                              setBrePolling(true);
                              setBrePollingMessage('Processing your bank statement...');

                              const pollBREStatus = async () => {
                                let shouldContinuePolling = true;
                                while (shouldContinuePolling) {
                                  try {
                                    // Using Redux for finfactor/initialize API
                                    const breResult = await getFinfactor();

                                    if (breResult.message === 'Statement not fetched yet') {
                                      setBrePollingMessage('Fetching your bank statement...');
                                      // Wait 10 seconds before next poll
                                      await new Promise(resolve => setTimeout(resolve, 10000));
                                    } else if (breResult.message === 'BRE checked successfully') {
                                      // BRE check complete - update approval data and stop polling
                                      shouldContinuePolling = false;
                                      setBrePolling(false);
                                      setBrePollingMessage('');
                                      if (breResult.data) {
                                        setApprovalData(breResult.data);
                              }
                                      setFinfactorSuccess(false);
                                      toast({ variant: "success", title: "Success", description: "BRE verification completed successfully." });
                                    } else {
                                      // Any other response - stop polling and update UI
                                      shouldContinuePolling = false;
                                      setBrePolling(false);
                                      setBrePollingMessage('');
                                      if (breResult.data) {
                                        setApprovalData(breResult.data);
                                      }
                                      setFinfactorSuccess(false);
                                    }
                                  } catch (pollError) {
                                    console.error('BRE polling error:', pollError);
                                    setBrePollingMessage('Retrying...');
                                    // Wait 10 seconds before retry on error
                                    await new Promise(resolve => setTimeout(resolve, 10000));
                                  }
                                }
                              };

                              // Start polling
                              pollBREStatus();
                            } else {
                              toast({ variant: "error", title: "Failed", description: result.message || "Verification failed. Please try again." });
                            }
                          } catch (error: any) {
                            console.error('Consent API error:', error);
                            toast({ variant: "error", title: "Network Error", description: "Unable to connect to server. Please try again." });
                          } finally {
                            setConsentLoading(false);
                          }
                        }}
                        disabled={consentLoading}
                        className="bg-[#25B181] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1d9e6f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                      >
                        {consentLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing...</>) : (<>Continue Application<ArrowRight className="w-5 h-5" /></>)}
                      </button>
                    </div>
                  </div>
                ) : approvalData?.status === 'Proceed to Bank' ? (
                  /* ========== PROCEED TO BANK STATUS ========== */
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Proceed to Bank Verification</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {approvalData.reason || 'Your application requires additional bank verification to proceed.'}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                      <p className="text-sm text-gray-500">Application Number</p>
                      <p className="font-semibold text-gray-800">{approvalData.applicationNumber || 'N/A'}</p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
                          if (!token) {
                            toast({ variant: "error", title: "Authentication Error", description: "Please login again to continue." });
                            return;
                          }
                          setPtbLoading(true);
                          try {
                            const customerId = localStorage.getItem('userId');
                            if (!customerId) {
                              toast({ variant: "error", title: "Error", description: "Customer ID not found. Please try again." });
                              setPtbLoading(false);
                              return;
                            }
                            const response = await fetch(`https://alpha.quikkred.in/api/kyc/finfactorConsentRequest`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                              body: JSON.stringify({ customerId })
                            });
                            const result = await response.json();
                            if (response.ok && result.success) {
                              toast({ variant: "success", title: "Success", description: result.message || "Bank verification initiated successfully." });
                              if (result.data) {
                                window.open(result.data, '_blank');
                              }
                            } else {
                              toast({ variant: "error", title: "Failed", description: result.message || "Failed to initiate bank verification." });
                            }
                          } catch (error: any) {
                            console.error('PTB API error:', error);
                            toast({ variant: "error", title: "Network Error", description: "Unable to connect to server. Please try again." });
                          } finally {
                            setPtbLoading(false);
                          }
                        }}
                        disabled={ptbLoading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                      >
                        {ptbLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing...</>) : (<>Proceed to Bank<ArrowRight className="w-5 h-5" /></>)}
                      </button>
                    </div>
                  </div>
                ) : approvalData ? (
                  /* ========== APPROVED STATUS - Attractive UI ========== */
                  <>
                    {/* Congratulations Banner */}
                    <div className="bg-gradient-to-r from-[#25B181] to-[#1d9e6f] rounded-2xl p-6 text-white text-center relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-2 left-4">
                        <Sparkles className="w-6 h-6 text-yellow-300 opacity-80" />
                      </div>
                      <div className="absolute top-4 right-6">
                        <Sparkles className="w-4 h-4 text-yellow-200 opacity-60" />
                      </div>
                      <div className="absolute bottom-3 right-10">
                        <Sparkles className="w-5 h-5 text-yellow-300 opacity-70" />
                      </div>

                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-[#25B181]" />
                      </div>
                      <h2 className="text-2xl font-bold mb-1">Congratulations!</h2>
                      <p className="text-green-100">Your loan has been approved</p>
                      {approvalData.applicationNumber && (
                        <p className="text-sm text-white/80 mt-2">
                          Application No: {approvalData.applicationNumber}
                        </p>
                      )}
                    </div>

                    {/* Loan Details Grid */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-[#25B181]" />
                        Loan Details
                        {calculatedLoanDetails && (
                          <span className="text-xs font-normal text-gray-500 ml-2">(Based on your selected amount)</span>
                        )}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Your Loan Amount</p>
                          <p className="text-xl font-bold text-[#25B181]">
                            ₹{((calculatedLoanDetails?.loanAmount || userDesiredAmount || approvalData.loanAmount) || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Tenure</p>
                          <p className="text-xl font-bold text-gray-900">
                            {(calculatedLoanDetails?.tenure || approvalData.tenure) || 0} {(calculatedLoanDetails?.tenureUnit || approvalData.tenureUnit) === 'Days' ? 'Days' : 'Months'}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                          <p className="text-xl font-bold text-gray-900">{(calculatedLoanDetails?.interestRate || approvalData.interestRate) || 0}%</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Interest Amount</p>
                          <p className="text-xl font-bold text-gray-900">₹{((calculatedLoanDetails?.totalInterest ?? approvalData.totalInterest) || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Processing Fee</p>
                          <p className="text-xl font-bold text-gray-900">₹{((calculatedLoanDetails?.processingFee ?? approvalData.processingFee) || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">GST on Processing Fee</p>
                          <p className="text-xl font-bold text-gray-900">₹{((calculatedLoanDetails?.gstOnProcessingFee ?? approvalData.gstOnProcessingFee) || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Total Repayment</p>
                          <p className="text-xl font-bold text-gray-900">₹{((calculatedLoanDetails?.totalRepayment ?? approvalData.totalRepayment) || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* Net Disbursal Highlight */}
                      <div className="mt-4 bg-green-50 border-2 border-green-500 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-green-600 font-medium">You Will Receive</p>
                            <p className="text-xs text-green-500">Net Disbursal Amount</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">₹{((calculatedLoanDetails?.netDisbursalAmount ?? approvalData.netDisbursalAmount) || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>

                    {/* User Details Summary */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#25B181]" />
                        Your Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">{approvalData.fullName || formData.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Mobile</p>
                            <p className="font-medium text-gray-900">{approvalData.mobile || formData.mobile}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{approvalData.email || formData.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">PAN</p>
                            <p className="font-medium text-gray-900">{approvalData.pan || formData.pan}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Aadhaar</p>
                            <p className="font-medium text-gray-900">
                              {approvalData.aadhaar || (formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : '-')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                          <IndianRupee className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Monthly Income</p>
                            <p className="font-medium text-gray-900">
                              ₹{(approvalData.monthlyIncome || parseFloat(formData.monthlyIncome) || 0).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      {dataAgreementChecked ? (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-800">Application Data Confirmed</h4>
                            <p className="text-sm text-green-700 mt-1">
                              You have reviewed and confirmed your application data. Click &quot;Next&quot; to proceed to bank details.
                            </p>
                          </div>
                        </div>
                      ) : eSignVerified ? (
                        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-800">e-Sign Completed</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Your document has been signed successfully. You can proceed with the application.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-800">Review Required</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Please review your details above and click the &quot;Confirm Details&quot; button to proceed.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              // Get auth token
                              const token = localStorage.getItem('accessToken') ||
                                            localStorage.getItem('token') ||
                                            localStorage.getItem('authToken');

                              if (!token) {
                                toast({
                                  title: "Authentication Error",
                                  description: "Please login to continue",
                                  variant: "error"
                                });
                                return;
                              }

                              // Initialize e-Sign verification using Redux
                              try {
                                const eSignResult = await initESign();

                                if (!eSignResult.success) {
                                  toast({
                                    title: "e-Sign Initialization Failed",
                                    description: eSignResult.message || "Failed to initialize e-sign verification",
                                    variant: "error"
                                  });
                                  return;
                                }
                              } catch (error) {
                                console.error('Error initializing e-sign:', error);
                                toast({
                                  title: "e-Sign Error",
                                  description: "Failed to initialize e-sign verification. Please try again.",
                                  variant: "error"
                                });
                                return;
                              }

                              // Fetch customer data from API using Redux
                              let customerData: any = {};

                              try {
                                const result = await getCustomer();

                                if (result.success && result.data) {
                                  customerData = result.data;

                                  // Check eSign status and update state
                                  if (customerData.eSign === true) {
                                    setUserESignStatus('SUCCESS');
                                    setESignVerified(true);
                                    console.log('✅ eSign already completed (boolean: true)');
                                  } else if (customerData.eSign?.status === 'SUCCESS') {
                                    setUserESignStatus('SUCCESS');
                                    setESignVerified(true);
                                    console.log('✅ eSign already completed (status: SUCCESS)');
                                  }

                                }
                              } catch (error) {
                                console.error('Error fetching customer data:', error);
                              }

                              // Combine API data with form data
                              const agreementData = {
                                fullName: formData.fullName || customerData.fullName || '',
                                email: formData.email || customerData.email || '',
                                mobile: formData.mobile || customerData.mobile || '',
                                dob: formData.dob || customerData.dateOfBirth || '',
                                pan: formData.pan || customerData.panCard || '',
                                aadhaar: formData.aadhaar || customerData.aadhaarNumber || '',
                                address: customerData.currentAddress?.fullAddress || aadhaarAddress?.fullAddress || '',
                                landmark: customerData.currentAddress?.landmark || '',
                                city: customerData.currentAddress?.city || aadhaarAddress?.city || '',
                                state: customerData.currentAddress?.state || aadhaarAddress?.state || '',
                                pincode: customerData.currentAddress?.pincode || aadhaarAddress?.pincode || '',
                                employmentType: formData.employmentType || customerData.employmentType || '',
                                monthlyIncome: formData.monthlyIncome || customerData.monthlyIncome || '',
                                companyName: formData.companyName || customerData.companyName || '',
                                designation: customerData.designation || '',
                                workExperience: customerData.workExperience || '',
                                salaryDate: customerData.salaryDate || '',
                                bankName: (formData.bankName === 'OTHER' ? formData.customBankName : formData.bankName) || customerData.banks?.[0]?.bankName || '',
                                accountNumber: formData.accountNumber || customerData.banks?.[0]?.accountNumber || '',
                                ifscCode: formData.ifsc || customerData.banks?.[0]?.ifscCode || '',
                                accountHolderName: formData.accountHolderName || customerData.banks?.[0]?.accountHolderName || formData.fullName || customerData.fullName || '',
                                // Loan Details - use user's selected amount first, then BRE API response
                                loanAmount: calculatedLoanDetails?.loanAmount || userDesiredAmount || approvalData?.loanAmount || formData.loanAmount || '',
                                tenure: calculatedLoanDetails?.tenure || approvalData?.tenure || formData.tenure || '',
                                tenureUnit: calculatedLoanDetails?.tenureUnit || approvalData?.tenureUnit || formData.tenureUnit || 'Days',
                                productName: selectedProduct?.productName || '',
                                interestRate: calculatedLoanDetails?.interestRate || approvalData?.interestRate || selectedProduct?.dailyInterestRate || '',
                                processingFee: calculatedLoanDetails?.processingFee || approvalData?.processingFee || selectedProduct?.processingFee || '',
                                totalInterest: calculatedLoanDetails?.totalInterest || approvalData?.totalInterest || '',
                                gstOnProcessingFee: calculatedLoanDetails?.gstOnProcessingFee || approvalData?.gstOnProcessingFee || '',
                                totalAmount: calculatedLoanDetails?.totalRepayment || approvalData?.totalRepayment || emiCalculation?.totalAmount || '',
                                disbursementAmount: calculatedLoanDetails?.netDisbursalAmount || approvalData?.netDisbursalAmount || (emiCalculation ? (emiCalculation.principal - emiCalculation.totalProcessingFee) : ''),
                                applicationNumber: approvalData?.applicationNumber || customerData.applicationNumber || '',
                              };

                              // Generate HTML and open in new tab
                              const htmlContent = generateAgreementHTML(agreementData);
                              const blob = new Blob([htmlContent], { type: 'text/html' });
                              const url = URL.createObjectURL(blob);
                              window.open(url, '_blank');
                              localStorage.removeItem('dataAgreementApproved');
                            }}
                            className="w-full px-6 py-4 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-lg hover:shadow-lg font-semibold transition-all flex items-center justify-center gap-2"
                          >
                            <FileText className="w-5 h-5" />
                            Confirm Details
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">Unable to fetch approval data. Please try again.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Bank Details & Consent */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bank Details & Consent</h2>

                {/* Bank Details Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                    {bankVerified && (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <div className="relative bank-dropdown-container">
  <button
    type="button"
    onClick={() => !bankVerified && setBankDropdownOpen(!bankDropdownOpen)}
    disabled={bankVerified}
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] text-left flex justify-between items-center ${
      bankVerified ? 'bg-green-50 border-green-300' : 'bg-white'
    }`}
  >
    <span className={formData.bankName ? 'text-gray-900' : 'text-gray-500'}>
      {formData.bankName === 'OTHER'
        ? 'Other'
        : formData.bankName
          ? BANKS.find(b => b.value === formData.bankName)?.name || formData.bankName
          : 'Select Bank'}
    </span>
    <svg className={`w-5 h-5 text-gray-400 transition-transform ${bankDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {bankDropdownOpen && !bankVerified && (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500"
        onClick={() => {
          setFormData(prev => ({ ...prev, bankName: '', customBankName: '' }));
          setBankVerified(false);
          setBankDropdownOpen(false);
        }}
      >
        Select Bank
      </div>
      {BANKS.map((bank) => (
        <div
          key={bank.value}
          className={`px-4 py-2 hover:bg-[#25B181] hover:text-white cursor-pointer ${
            formData.bankName === bank.value ? 'bg-[#25B181] text-white' : ''
          }`}
          onClick={() => {
            setFormData(prev => ({ ...prev, bankName: bank.value, customBankName: '' }));
            setBankVerified(false);
            setBankDropdownOpen(false);
          }}
        >
          {bank.name}
        </div>
      ))}
      <div
        className={`px-4 py-2 hover:bg-[#25B181] hover:text-white cursor-pointer ${
          formData.bankName === 'OTHER' ? 'bg-[#25B181] text-white' : ''
        }`}
        onClick={() => {
          setFormData(prev => ({ ...prev, bankName: 'OTHER' }));
          setBankVerified(false);
          setBankDropdownOpen(false);
        }}
      >
        Other
      </div>
    </div>
  )}
</div>

                        {/* Custom Bank Name Input - shown when "Other" is selected */}
                        {formData.bankName === 'OTHER' && (
                          <input
                            type="text"
                            name="customBankName"
                            value={formData.customBankName}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                              setFormData(prev => ({ ...prev, customBankName: value }));
                              setBankVerified(false);
                            }}
                            disabled={bankVerified}
                            className={`w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] ${bankVerified ? 'bg-green-50 border-green-300' : ''}`}
                            placeholder="Enter your bank name"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          name="accountHolderName"
                          value={formData.accountHolderName}
                          onChange={(e) => {
                            // Only allow alphabets and spaces
                            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                            const syntheticEvent = {
                              target: {
                                name: 'accountHolderName',
                                value: value
                              }
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleChange(syntheticEvent);
                            setBankVerified(false); // Reset verification on change
                          }}
                          disabled={bankVerified}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                            fieldErrors.accountHolderName ? 'border-red-500' : bankVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter account holder name"
                        />
                        {fieldErrors.accountHolderName && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.accountHolderName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number *
                        </label>
                        <input
                          type="tel"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 18);
                            const syntheticEvent = {
                              target: {
                                name: 'accountNumber',
                                value: value
                              }
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleChange(syntheticEvent);
                            setBankVerified(false); // Reset verification on change
                          }}
                          disabled={bankVerified}
                          maxLength={18}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                            fieldErrors.accountNumber ? 'border-red-500' : bankVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'
                          }`}
                          placeholder="9-18 digit account number"
                        />
                        {fieldErrors.accountNumber ? (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.accountNumber}</p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-500">Enter 9-18 digit bank account number</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          name="ifsc"
                          value={formData.ifsc}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().slice(0, 11);
                            const syntheticEvent = {
                              target: {
                                name: 'ifsc',
                                value: value
                              }
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleChange(syntheticEvent);
                            setBankVerified(false); // Reset verification on change
                          }}
                          disabled={bankVerified}
                          pattern="[A-Z]{4}0[A-Z0-9]{6}"
                          maxLength={11}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                            fieldErrors.ifsc ? 'border-red-500' : bankVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'
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
                    </div>

                    {/* Verify Bank Button */}
                    <div className="pt-2">
                      {bankVerifyError && (
                        <p className="text-sm text-red-600 mb-2">{bankVerifyError}</p>
                      )}
                      <button
                        type="button"
                        onClick={verifyBankAccount}
                        disabled={bankVerifying || bankVerified || !formData.bankName || (formData.bankName === 'OTHER' && !formData.customBankName?.trim()) || !formData.accountHolderName || !formData.accountNumber || !formData.ifsc}
                        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
                          bankVerified
                            ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                            : bankVerifying
                            ? 'bg-gray-300 text-gray-600 cursor-wait'
                            : !formData.bankName || (formData.bankName === 'OTHER' && !formData.customBankName?.trim()) || !formData.accountHolderName || !formData.accountNumber || !formData.ifsc
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#25B181] text-white hover:bg-[#1d9469]'
                        }`}
                      >
                        {bankVerifying ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying...
                          </span>
                        ) : bankVerified ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Bank Verified
                          </span>
                        ) : (
                          'Verify Bank Account'
                        )}
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Click to verify your bank account details. This helps ensure smooth loan disbursement.
                      </p>
                    </div>
                  </div>
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

          {/* Navigation Buttons - Hide when status is Reject, Proceed to Bank, or finfactor success */}
          {!(currentStep === 4 && (approvalData?.status === 'Reject' || approvalData?.status === 'Proceed to Bank' || finfactorSuccess)) && (
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
                disabled={loading || (currentStep === 1 && !isStep1Valid())|| (currentStep === 4 && !eSignVerified)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-lg hover:shadow-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === 4 ? "Submit Application" : "Next"}
                    {currentStep < 4 && <ArrowRight className="w-5 h-5" />}
                  </>
                )}
              </button>
            </div>
          )}
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
    </>
  );
}
