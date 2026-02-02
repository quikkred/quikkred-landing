"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle, X, Loader2, FileText, IndianRupee,
  Calendar, User, Phone, Mail, CreditCard, Camera,
  AlertCircle, ArrowRight, Sparkles, Shield, Zap,
  Percent, Building2, Users, BadgeCheck, Landmark, Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast, Toaster } from "@/components/ui/toast";
import SelfieCapture from "@/components/camera/SelfieCapture";
import { useCustomer } from "@/store/hooks/useCustomer";
import { QuickApplyFormData, FieldErrors } from "@/lib/types/quickApply";
import { getInitialFormData, initialFieldErrors, INDIAN_STATES, BLACKLISTED_STATES } from "@/lib/constants/quickApply";
import {
  formatDateForInput,
  toBoolean,
} from "@/lib/helpers/quickApply";
import { API_BASE_URL } from "@/lib/config";
import getToken from "@/lib/getToken";
import { getSession, signIn } from "next-auth/react";

export default function QuickLoanApplication() {

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
  const [showLandingPage, setShowLandingPage] = useState(true); // LiveMint-style landing page state
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
  const [processingCountdown, setProcessingCountdown] = useState(60);
  const [upiAutopayConsent, setUpiAutopayConsent] = useState(false);
  const [mandateLoading, setMandateLoading] = useState(false);
  const [mandateVerifying, setMandateVerifying] = useState(false);
  const [mandateData, setMandateData] = useState<any>(null);

  // User location state
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Field validation errors (using imported initial values)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(initialFieldErrors);

  // Bank verification state
  const [bankVerifying, setBankVerifying] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [bankVerifyError, setBankVerifyError] = useState("");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);

  // IFSC auto-detection state
  const [ifscLookupLoading, setIfscLookupLoading] = useState(false);
  const [ifscLookupError, setIfscLookupError] = useState("");
  const [ifscDetectedBank, setIfscDetectedBank] = useState<string | null>(null);
  const [ifscBranchName, setIfscBranchName] = useState<string | null>(null);
  const ifscLookupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State dropdown state
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState('');

  // Consent validation error
  const [consentError, setConsentError] = useState(false);

  // Data agreement checkbox for Step 2
  const [dataAgreementChecked, setDataAgreementChecked] = useState(false);

  // Track if PAN is verified (to disable basic details editing when user navigates back)
  const [basicDetailsFilled, setBasicDetailsFilled] = useState(false);

  // Form data state (using imported initial values)
  const [formData, setFormData] = useState(getInitialFormData());

  // Autofill mobile from localStorage (from /apply page)
  useEffect(() => {
    const storedMobile = localStorage.getItem('applyMobile');
    if (storedMobile) {
      setFormData(prev => ({
        ...prev,
        mobile: storedMobile
      }));
      // Clear after reading
      localStorage.removeItem('applyMobile');
    }
  }, []);

  // Close bank dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (bankDropdownOpen && !target.closest('.bank-dropdown-container')) {
        setBankDropdownOpen(false);
      }
      if (stateDropdownOpen && !target.closest('.state-dropdown-container')) {
        setStateDropdownOpen(false);
        setStateSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bankDropdownOpen, stateDropdownOpen]);

  // Processing countdown timer - redirect to /user if timeout
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    // Only start countdown when finfactorSuccess is true (showing processing UI)
    if (finfactorSuccess) {
      // Reset countdown when processing starts
      setProcessingCountdown(60);

      intervalId = setInterval(() => {
        setProcessingCountdown((prev) => {
          if (prev <= 1) {
            // Countdown finished - redirect to dashboard
            if (intervalId) clearInterval(intervalId);
            router.push('/user');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [finfactorSuccess, router]);

  // Check upiAutoPayStatus from customer data and pre-set upiAutopayConsent
  useEffect(() => {
    if (reduxCustomer?.data?.upiAutoPayStatus === true) {
      setUpiAutopayConsent(true);
    }
  }, [reduxCustomer?.data?.upiAutoPayStatus]);

  // Load Razorpay script for UPI Autopay
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Load user data if logged in
  useEffect(() => {
    const loadUserData = async () => {
      if (user && !userDataLoaded) {
        console.log('🔵 Loading user data for logged-in user...');
        try {
          const token = await getToken();

          if (token) {
            // Fetch user profile data using Redux
            const result = await getCustomer();

            if (result.success && result.data) {
              const profileData = result.data;
              console.log('✅ User profile loaded successfully');

              // Pre-fill form data (using imported formatDateForInput)
              // Note: prev.mobile takes priority (from localStorage/applyMobile)
              setFormData(prev => ({
                ...prev,
                fullName: profileData.fullName || prev.fullName,
                mobile: prev.mobile || profileData.mobile || user.mobile,
                email: profileData.email || user.email || prev.email,
                pan: profileData.panCard || prev.pan,
                aadhaar: profileData.aadhaarNumber || prev.aadhaar,
                dob: formatDateForInput(profileData.dateOfBirth) || prev.dob,
                state: profileData.state ? profileData.state.toLowerCase() : prev.state,
                employmentType: profileData.employmentType || prev.employmentType,
                monthlyIncome: profileData.monthlyIncome?.toString() || prev.monthlyIncome,
                companyName: profileData.companyName || prev.companyName,
                bankName: profileData.banks?.[0]?.bankName || prev.bankName,
                accountHolderName: profileData.banks?.[0]?.accountHolderName || prev.accountHolderName,
                accountNumber: profileData.banks?.[0]?.accountNumber || prev.accountNumber,
                ifsc: profileData.banks?.[0]?.ifscCode || prev.ifsc,
                loanAmount: profileData.requestedLoanAmount?.toString() || prev.loanAmount, // Loan amount from API
                mobileVerified: toBoolean(profileData.isMobileVerified) && !!profileData.mobile, // Only true if mobile is verified AND exists
                emailVerified: profileData.isEmailVerified || false // Only true if email is actually verified
              }));

              // Check verification statuses (using imported toBoolean)
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

              // Set detected bank if IFSC and bank name are pre-filled
              if (profileData.banks?.[0]?.ifscCode && profileData.banks?.[0]?.bankName) {
                setIfscDetectedBank(profileData.banks[0].bankName);
                console.log('✅ Bank name pre-filled from profile:', profileData.banks[0].bankName);
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

              // if (profileData.bsaStatus) {
              //   setBsaStatus(profileData.bsaStatus);
              //   console.log('📊 BSA status from profile:', profileData.bsaStatus);

              //   // If BSA is PROCESSED and ?finfactor=success is not in URL, redirect to add it
              //   if (profileData.bsaStatus === 'PROCESSED') {
              //     const currentUrl = new URL(window.location.href);
              //     const finfactorParam = currentUrl.searchParams.get('finfactor');
              //     if (finfactorParam !== 'success') {
              //       console.log('📊 BSA is PROCESSED, redirecting with ?finfactor=success');
              //       currentUrl.searchParams.set('finfactor', 'success');
              //       router.replace(currentUrl.pathname + currentUrl.search);
              //       return; // Exit early as we're redirecting
              //     }
              //   }
              // }

              // Check if bsaInitiated is true - redirect to finfactor success flow
              if (toBoolean(profileData.bsaInitiated)) {
                console.log('📊 bsaInitiated is true, redirecting to finfactor success flow');
                const currentUrl = new URL(window.location.href);
                const finfactorParam = currentUrl.searchParams.get('finfactor');
                if (finfactorParam !== 'success') {
                  currentUrl.searchParams.set('finfactor', 'success');
                  router.replace(currentUrl.pathname + currentUrl.search);
                  return; // Exit early as we're redirecting
                }
                // If already has ?finfactor=success, set states for the UI
                setFinfactorSuccess(true);
                setCurrentStep(4);
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

              // If PAN is verified from API AND mobile is already filled, disable basic details editing
              // This prevents disabling fields when user hasn't entered mobile yet
              if (toBoolean(profileData.isPanVerify) && profileData.mobile) {
                setBasicDetailsFilled(true);
              }

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

              // Skip landing page for logged-in users
              setShowLandingPage(false);
              setUserDataLoaded(true);
            } else {
              setFormData(prev => ({
                ...prev,
                fullName: prev.fullName, // Keep existing or empty
                mobile: user.mobile || prev.mobile,
                email: user.email || prev.email,
                mobileVerified: prev.mobileVerified, // Keep previous state, don't assume verified
                emailVerified: prev.emailVerified // Keep previous state
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
            mobileVerified: prev.mobileVerified, // Keep previous state, don't assume verified
            emailVerified: prev.emailVerified // Keep previous state
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

  // Auto-redirect to application-status page after successful submission
  useEffect(() => {
    if (decision && decision.approved) {
      // Store status data in localStorage for the status page to read
      localStorage.setItem('applicationStatusData', JSON.stringify({
        status: 'approved',
        loanNumber: decision.loanNumber || '',
        amount: decision.approvedAmount?.toString() || ''
      }));
      router.push('/application-status');
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

  // Rejection - immediately redirect to application-status page
  useEffect(() => {
    if (currentStep === 4 && approvalData?.status === 'Reject') {
      // Store status data in localStorage for the status page to read
      localStorage.setItem('applicationStatusData', JSON.stringify({
        status: 'rejected',
        loanNumber: approvalData.applicationNumber || '',
        reason: approvalData.reason || ''
      }));
      router.push('/application-status');
    }
  }, [currentStep, approvalData?.status, approvalData?.applicationNumber, approvalData?.reason, router]);

  // Check for finfactor=success query param (redirect from finfudge)
  // Also update BSA status to PROCESSED on redirect
  useEffect(() => {
    const finfactorParam = searchParams.get('finfactor');
    if (finfactorParam === 'success') {
      setFinfactorSuccess(true);
      setCurrentStep(4); // Go to step 4 to show the consent UI

      // Call PATCH API to update BSA status to PROCESSED (only once)


      // const updateBsaStatus = async () => {
      //   // Prevent duplicate calls
      //   if (bsaStatusUpdated) {
      //     console.log('BSA status already updated, skipping API call');
      //     return;
      //   }

      //   const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
      //   if (!token) {
      //     console.error('No auth token found for BSA status update');
      //     return;
      //   }

      //   try {
      //     setBsaStatusUpdated(true); // Mark as updated immediately to prevent race conditions
      //     const response = await fetch('${API_BASE_URL}/api/kyc/bsa/update', {
      //       method: 'PATCH',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         'Authorization': `Bearer ${token}`
      //       },
      //       body: JSON.stringify({ status: 'PROCESSED' })
      //     });

      //     const result = await response.json();
      //     if (response.ok && result.success) {
      //       console.log('BSA status updated successfully:', result.data);
      //       // Update local bsaStatus state
      //       setBsaStatus('PROCESSED');
      //     } else {
      //       console.error('Failed to update BSA status:', result.message);
      //       // Reset flag on failure so it can be retried
      //       setBsaStatusUpdated(false);
      //     }
      //   } catch (error) {
      //     console.error('Error updating BSA status:', error);
      //     // Reset flag on error so it can be retried
      //     setBsaStatusUpdated(false);
      //   }
      // };

      // updateBsaStatus();
    }
  }, [searchParams, bsaStatusUpdated]);

  // Auto-trigger BRE finFactor API when ?finfactor=success is in URL
  // This handles the case when user returns after finfactor process or bsaInitiated is true
  const breFinFactorCalledRef = useRef(false);

  useEffect(() => {
    const fetchBreFinfactorResult = async () => {
      const finfactorParam = searchParams.get('finfactor');

      // Only proceed if:
      // 1. finfactor=success is in URL
      // 2. Not already loading
      // 3. Not already called
      // 4. No approvalData yet
      if (finfactorParam !== 'success' || consentLoading || breFinFactorCalledRef.current || approvalData) {
        return;
      }

      console.log('📊 finfactor=success detected, auto-calling BRE finFactor API...');

      const token = await getToken();
      if (!token) {
        console.error('No auth token found for BRE finFactor');
        return;
      }

      breFinFactorCalledRef.current = true;
      setConsentLoading(true);
      setCurrentStep(4); // Ensure we're on Step 4
      setFinfactorSuccess(true); // Show loading UI

      try {
        const response = await fetch(`${API_BASE_URL}/api/kyc/bre/finFactor`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // API SUCCESS - follow normal flow (approve/reject/etc.)
          console.log('✅ BRE finFactor result fetched successfully:', result.data);
          toast({ variant: "success", title: "Success", description: result.message || "BRE verification completed successfully." });

          if (result.data) {
            setApprovalData(result.data);
          }
          setFinfactorSuccess(false);
        } else {
          // API ERROR - redirect to /user
          console.error('BRE finFactor failed:', result.message);
          toast({ variant: "error", title: "Processing", description: result.message || "We are processing your application. Please check back later." });
          router.push('/user');
        }
      } catch (error) {
        // API EXCEPTION - redirect to /user
        console.error('Error fetching BRE finFactor:', error);
        toast({ variant: "error", title: "Processing", description: "We are processing your application. Please check back later." });
        router.push('/user');
      } finally {
        setConsentLoading(false);
      }
    };

    fetchBreFinfactorResult();
  }, [searchParams, consentLoading, approvalData, toast]);

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
      const token = await getToken();

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
      const token = await getToken();

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

      // Skip if finfactor=success is in URL (will call /api/kyc/bre/finFactor instead)
      const finfactorParam = searchParams.get('finfactor');
      if (finfactorParam === 'success') {
        console.log('[Step 4] finfactor=success detected, skipping bre/initialize (will call bre/finFactor)');
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

      const token = await getToken();

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
  }, [currentStep, approvalData, toast, searchParams]);


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

    // Calculate Platform Fee and GST
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

    // State validation (must be selected and not blacklisted)
    if (!formData.state) return false;
    if (BLACKLISTED_STATES.includes(formData.state.toLowerCase())) return false;

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

      const response = await fetch(`${API_BASE_URL}/api/auth/customer/create`, {
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

      // const response = await fetch(`${API_BASE_URL}/api/auth/customer/verifyOtp`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // const data = await response.json();
      const response = await signIn("otp", {
        redirect: false,
        emailOrPhone: payload?.email || payload?.mobile,
        otp: payload.otp,
        loginMethod: verificationMethod, // "email" | "mobile"
      });
      
      if (response?.ok) {
        const data: any = await getSession();

        login({
          email: payload?.email || "",
          apiData: data,
        });

        if (verificationMethod === 'email') {
          setFormData(prev => ({ ...prev, emailVerified: true }));
        } else {
          setFormData(prev => ({ ...prev, mobileVerified: true }));
        }
        setOtpSent(false); // Reset OTP sent state after successful verification

        // Store userId if provided
        if (data?.userId) {
          localStorage.setItem('userId', data.userId);
        }

        toast({
          variant: "success",
          title: "Verification Successful!",
          description: `Your ${verificationMethod === 'email' ? 'email' : 'mobile number'} has been verified successfully.`,
        });

        // Auto-fill form with customer data after successful OTP verification
        const token = data?.accessToken;

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

              // Auto-fill form data (using imported formatDateForInput)
              setFormData(prev => ({
                ...prev,
                fullName: profileData.fullName || prev.fullName,
                mobile: profileData.mobile || prev.mobile,
                email: profileData.email || prev.email,
                pan: profileData.panCard || prev.pan,
                aadhaar: profileData.aadhaarNumber || prev.aadhaar,
                dob: formatDateForInput(profileData.dateOfBirth) || prev.dob,
                state: profileData.state ? profileData.state.toLowerCase() : prev.state,
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

              // Set detected bank if IFSC and bank name are pre-filled
              if (profileData.banks?.[0]?.ifscCode && profileData.banks?.[0]?.bankName) {
                setIfscDetectedBank(profileData.banks[0].bankName);
                console.log('✅ Bank name pre-filled from profile:', profileData.banks[0].bankName);
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
              // (using imported toBoolean)
              // ============================================
              const isBasicDetailsFilled = toBoolean(profileData.isBasicDetailsFilled);
              const isKycDetailsFilled = toBoolean(profileData.isKycDetailsFilled);
              const isBankDetailsFilled = toBoolean(profileData.isBankDetailsFilled);
              const isSubmit = toBoolean(profileData.isSubmit);

              // If PAN is verified from API AND mobile is already filled, disable basic details editing
              // This prevents disabling fields when user hasn't entered mobile yet
              if (toBoolean(profileData.isPanVerify) && profileData.mobile) {
                setBasicDetailsFilled(true);
              }

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

              // Determine which step to go to based on completion flags
              let targetStep = 1;
              if (!isBasicDetailsFilled) {
                targetStep = 1;
              } else if (!isKycDetailsFilled) {
                targetStep = 2;
              } else if (!isBankDetailsFilled) {
                targetStep = 3;
              } else if (!isSubmit) {
                targetStep = 4;
              }

              console.log('📍 Redirecting to step:', targetStep);

              // Check if any meaningful data was auto-filled (not just email/mobile from verification)
              const hasAutoFilledData = !!(
                profileData.fullName ||
                profileData.panCard ||
                profileData.aadhaarNumber ||
                profileData.dateOfBirth ||
                profileData.monthlyIncome ||
                profileData.companyName ||
                profileData.banks?.[0]?.accountNumber
              );

              if (targetStep > 1) {
                setCurrentStep(targetStep);
                toast({
                  variant: "success",
                  title: "Welcome Back!",
                  description: `Your progress has been saved. Continue from Step ${targetStep}.`,
                });
              } else if (hasAutoFilledData) {
                // Only show "Data Loaded!" toast if there's actual profile data auto-filled
                toast({
                  variant: "success",
                  title: "Data Loaded!",
                  description: "Your profile information has been auto-filled. Please review and proceed.",
                });
              }
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
          description: response?.error || 'Invalid OTP. Please try again.',
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
      const token = await getToken();

      // Format DOB from YYYY-MM-DD to DD/MM/YYYY
      const formatDOBForAPI = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`; // Convert to DD/MM/YYYY
        }
        return dateStr;
      };

      const response = await fetch(`${API_BASE_URL}/api/kyc/pan/verification`, {
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
      const token = await getToken();

      // First call verification endpoint to check redirect
      const verifyResponse = await fetch(`${API_BASE_URL}/api/kyc/aadhaar/verification`, {
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
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/api/kyc/aadhaar/verify`, {
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

  // IFSC Lookup using Razorpay API
  const lookupIFSC = async (ifscCode: string) => {
    if (!ifscCode || ifscCode.length !== 11) {
      return;
    }

    // Validate IFSC format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode)) {
      setIfscLookupError("Invalid IFSC format");
      setIfscDetectedBank(null);
      setIfscBranchName(null);
      return;
    }

    setIfscLookupLoading(true);
    setIfscLookupError("");

    try {
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);

      if (response.ok) {
        const data = await response.json();
        const bankName = data.BANK || "";
        const branchName = data.BRANCH || "";

        setIfscDetectedBank(bankName);
        setIfscBranchName(branchName);
        setIfscLookupError("");

        // Auto-fill the bank name
        setFormData(prev => ({
          ...prev,
          bankName: bankName,
          customBankName: ""
        }));

        // Clear any existing field error for ifsc
        setFieldErrors(prev => ({ ...prev, ifsc: "" }));

        toast({
          variant: "success",
          title: "Bank Detected",
          description: `${bankName}${branchName ? ` - ${branchName}` : ""}`,
        });
      } else if (response.status === 404) {
        setIfscLookupError("Invalid IFSC code. Please check and try again.");
        setIfscDetectedBank(null);
        setIfscBranchName(null);
        setFormData(prev => ({ ...prev, bankName: "", customBankName: "" }));
      } else {
        setIfscLookupError("Unable to verify IFSC. Please try again.");
        setIfscDetectedBank(null);
        setIfscBranchName(null);
      }
    } catch (error) {
      console.error("IFSC lookup error:", error);
      setIfscLookupError("Network error. Please check your connection.");
      setIfscDetectedBank(null);
      setIfscBranchName(null);
    } finally {
      setIfscLookupLoading(false);
    }
  };

  // Debounced IFSC lookup handler
  const handleIFSCChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);

    setFormData(prev => ({ ...prev, ifsc: upperValue }));
    setBankVerified(false);

    // Clear previous timeout
    if (ifscLookupTimeoutRef.current) {
      clearTimeout(ifscLookupTimeoutRef.current);
    }

    // Reset states when IFSC changes
    if (upperValue.length < 11) {
      setIfscDetectedBank(null);
      setIfscBranchName(null);
      setIfscLookupError("");
      // Clear bank name when IFSC is incomplete
      if (ifscDetectedBank) {
        setFormData(prev => ({ ...prev, bankName: "", customBankName: "" }));
      }
    }

    // Validate format as user types
    if (upperValue.length === 11) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(upperValue)) {
        setFieldErrors(prev => ({ ...prev, ifsc: "Invalid IFSC code format (e.g., SBIN0001234)" }));
        return;
      }
      setFieldErrors(prev => ({ ...prev, ifsc: "" }));

      // Debounce the API call
      ifscLookupTimeoutRef.current = setTimeout(() => {
        lookupIFSC(upperValue);
      }, 300);
    } else if (upperValue.length > 0) {
      setFieldErrors(prev => ({ ...prev, ifsc: "" }));
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
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/api/kyc/bank/verification`, {
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
  const getLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
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
      const token = await getToken();

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
            state: formData.state,
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

        const response = await fetch(`${API_BASE_URL}/api/application/loan/create`, {
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

      const response = await fetch(`${API_BASE_URL}/api/application/loan/create`, {
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

  // Check UPI Autopay status after Razorpay closes (success or dismiss)
  const checkUpiAutoPayStatus = async (subscriptionId: string, token: string) => {
    try {
      console.log("Calling UPI AutoPay status API for subscriptionId:", subscriptionId);

      const statusResponse = await fetch(`${API_BASE_URL}/api/upi/upiAutopay/status/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const statusResult = await statusResponse.json();
      console.log("UPI AutoPay Status Response:", statusResult);

      // After status API call, refresh customer data to get updated upiAutoPayStatus
      await getCustomer();

      // Set checkbox based on status from API response
      if (statusResult.success && statusResult.status === 'active') {
        setUpiAutopayConsent(true);
        toast({
          variant: "success",
          title: "UPI Autopay Authorized",
          description: "Your UPI Autopay has been authorized successfully.",
        });
      } else {
        // Status is inactive - keep checkbox unchecked
        setUpiAutopayConsent(false);
        toast({
          variant: "info",
          title: "UPI Autopay Pending",
          description: "Please complete the UPI Autopay authorization.",
        });
      }
    } catch (error) {
      console.error("Error checking UPI AutoPay status:", error);
      // On error, keep checkbox unchecked
      setUpiAutopayConsent(false);
      // Try to refresh customer data anyway
      try {
        await getCustomer();
      } catch (e) {
        console.error("Error refreshing customer data:", e);
      }
    }
  };

  // Handle UPI Autopay checkbox click - calls UPI autoPay create API and opens Razorpay
  const handleUpiAutopayClick = async (checked: boolean) => {
    // If already authorized (upiAutoPayStatus true or upiAutopayConsent true), don't allow changes
    if (reduxCustomer?.data?.upiAutoPayStatus === true || upiAutopayConsent) {
      return; // Don't allow uncheck once authorized
    }

    if (!checked) {
      setUpiAutopayConsent(false);
      return;
    }

    // Get application ID and customer ID
    const applicationId = approvalData?.applicationId || approvalData?._id;
    const customerId = reduxCustomer?.data?._id || reduxCustomer?.data?.id || approvalData?.customerId;

    if (!applicationId) {
      toast({
        variant: "error",
        title: "Error",
        description: "Application ID not found. Please try again.",
      });
      return;
    }

    if (!customerId) {
      toast({
        variant: "error",
        title: "Error",
        description: "Customer ID not found. Please try again.",
      });
      return;
    }

    setMandateLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast({
          variant: "error",
          title: "Authentication Error",
          description: "Please login again to continue.",
        });
        setMandateLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/upi/autoPay/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: customerId,
          applicationId: applicationId
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store mandate data
        setMandateData(result);

        // Get subscriptionId from response
        const subscriptionId = result.subscriptionId;

        if (subscriptionId) {
          // Open Razorpay checkout with subscription
          const options = {
            key: "rzp_live_S4tgUkVdbPaFdo",
            subscription_id: subscriptionId,
            name: "Quikkred",
            description: "UPI AutoPay Mandate Approval",
            theme: { color: "#25B181" },
            handler: async function (razorpayResponse: any) {
              // Payment successful - wait 10 seconds for data to update, then call status API
              console.log("Razorpay payment success:", razorpayResponse);
              console.log("Waiting 10 seconds before checking status...");
              setMandateVerifying(true);
              await new Promise(resolve => setTimeout(resolve, 10000));
              await checkUpiAutoPayStatus(subscriptionId, token);
              setMandateVerifying(false);
              setMandateLoading(false);
            },
            modal: {
              ondismiss: function () {
                // User closed the modal without completing
                console.log("Razorpay modal dismissed");
                setMandateLoading(false);
                setUpiAutopayConsent(false);
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (razorpayResponse: any) {
            console.error('Payment failed:', razorpayResponse.error);
            toast({
              variant: "error",
              title: "Payment Failed",
              description: razorpayResponse.error?.description || "UPI Autopay setup failed. Please try again.",
            });
            setMandateLoading(false);
            setUpiAutopayConsent(false);
          });
          rzp.open();
        } else {
          toast({
            variant: "error",
            title: "Failed",
            description: "Subscription ID not received. Please try again.",
          });
          setUpiAutopayConsent(false);
          setMandateLoading(false);
        }
      } else {
        toast({
          variant: "error",
          title: "Failed",
          description: result.message || "Failed to setup UPI Autopay. Please try again.",
        });
        setUpiAutopayConsent(false);
        setMandateLoading(false);
      }
    } catch (error: any) {
      console.error('UPI Autopay error:', error);
      toast({
        variant: "error",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
      setUpiAutopayConsent(false);
      setMandateLoading(false);
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
        state: "",
        aadhaar: "",
        pan: "",
        employmentType: "",
        monthlyIncome: "",
        companyName: "",
        loanAmount: "",
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

      // State validation
      if (!formData.state) {
        errors.state = "Please select your state";
        hasError = true;
      } else if (BLACKLISTED_STATES.includes(formData.state.toLowerCase())) {
        errors.state = "Sorry, our services are currently not available in this state/region.";
        hasError = true;
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

      // Bank Name validation (auto-detected from IFSC)
      if (!formData.bankName) {
        toast({
          variant: "warning",
          title: "Bank Name Required",
          description: "Please enter a valid IFSC code to auto-detect your bank.",
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
        const token = await getToken();

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
      // Final step - submit application (bank details already saved in step 3)
      setLoading(true);

      try {
        const token = await getToken();
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

        const response = await fetch(`${API_BASE_URL}/api/application/loan/create`, {
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

          // Store data for application-status page
          localStorage.setItem('applicationStatusData', JSON.stringify({
            status: 'approved',
            loanNumber: result.data?.applicationNumber || result.data?.loanNumber || approvalData?.applicationNumber || '',
            amount: calculatedLoanDetails?.loanAmount || userDesiredAmount || approvalData?.loanAmount || ''
          }));

          // Redirect to congratulations page
          setLoading(false);
          router.push('/application-status');
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

    // Redirect to application-status page
    toast({
      variant: "success",
      title: "Loan Approved & Disbursed!",
      description: "Your loan amount will be credited to your bank account within 24 hours.",
    });

    setTimeout(() => {
      const params = new URLSearchParams({
        status: 'approved',
        ...(approvalData?.applicationNumber && { loanNumber: approvalData.applicationNumber }),
        ...(approvalData?.loanAmount && { amount: approvalData.loanAmount.toString() })
      });
      router.push(`/application-status?${params.toString()}`);
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
                <span className="text-gray-600">Platform Fee (2%)</span>
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
                    state: "",
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
          {/* Close button - Hide when landing page is showing */}
          {!(showLandingPage && !user && currentStep === 1) && (
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
          )}

          {/* Header - Hide when landing page is showing */}
          {!(showLandingPage && !user && currentStep === 1) && (
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0.8, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Loan Application</h1>
                <p className="text-sm sm:text-base text-gray-600">Get instant approval in just 3 minutes</p>
              </motion.div>
            </div>
          )}

          {/* Progress Bar - Hide when landing page is showing */}
          {!(showLandingPage && !user && currentStep === 1) && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2 gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex-1">
                    <div className={`h-2 rounded-full transition-all ${step <= currentStep ? 'bg-[#25B181]' : 'bg-gray-200'
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
          )}

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
              {/* Step 1: Basic Details - With LiveMint-style Landing Page */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.9 }}
                  transition={{ duration: 0.1 }}
                  className="space-y-6"
                >
                  {/* ============================================ */}
                  {/* LIVEMINT-STYLE LANDING PAGE - Shows first */}
                  {/* ============================================ */}
                  {showLandingPage && !user && (
                    <div className="-m-4 sm:-m-8">
                      {/* Hero Section with Trust Badge */}
                      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white relative overflow-hidden rounded-t-2xl">
                        <div className="absolute top-20 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl" />

                        <div className="relative px-4 sm:px-8 pt-6 pb-8">
                          {/* Header with Logo and Trust Badge */}
                          <div className="flex items-center justify-between mb-6">
                            {/* Quikkred Logo */}
                            <div className="flex items-center">
                              <Image
                                src="/logo.svg"
                                alt="Quikkred"
                                width={140}
                                height={40}
                                className="h-10 w-auto"
                                priority
                              />
                            </div>

                            {/* Trust Badge */}
                            <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                              <Shield className="w-3.5 h-3.5" />
                              100% Secure
                            </div>
                          </div>

                          {/* Hero Headline */}
                          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                            Get Personal Loan up to
                          </h1>
                          <div className="flex items-baseline gap-2 flex-wrap mb-1">
                            <span className="text-3xl sm:text-4xl font-bold text-orange-500">₹25,000</span>
                            <span className="text-xl sm:text-2xl font-bold text-gray-900">in</span>
                            <span className="text-3xl sm:text-4xl font-bold text-emerald-600">5 mins!</span>
                          </div>

                          {/* Benefits Section */}
                          <div className="mt-6">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex-1 h-px bg-gray-300" />
                              <span className="text-sm font-semibold text-gray-700">Benefits & Features</span>
                              <div className="flex-1 h-px bg-gray-300" />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-amber-200">
                                  <Percent className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-xs font-semibold text-gray-900">Interest rate</p>
                                <p className="text-[10px] text-gray-600">starting at 1%/day</p>
                              </div>

                              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-amber-200">
                                  <Zap className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-xs font-semibold text-gray-900">100% Digital</p>
                                <p className="text-[10px] text-gray-600">Process</p>
                              </div>

                              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-amber-200">
                                  <Calendar className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-xs font-semibold text-gray-900">Tenure up to</p>
                                <p className="text-[10px] text-gray-600">90 Days</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lead Capture Form Section - Mobile Number Only */}
                      <div className="bg-white px-4 sm:px-8 py-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">
                          Get Money in your Bank Account Instantly
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                          Enter your mobile number to check your loan eligibility
                        </p>

                        <div className="space-y-4">
                          {/* Mobile Number Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mobile Number *
                            </label>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-500">
                                <span className="text-base font-medium">+91</span>
                                <div className="w-px h-5 bg-gray-300 ml-1" />
                              </div>
                              <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                  setFormData(prev => ({ ...prev, mobile: value }));
                                  if (fieldErrors.mobile) setFieldErrors(prev => ({ ...prev, mobile: '' }));
                                }}
                                className={`w-full pl-20 pr-4 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] ${fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="9876543210"
                                maxLength={10}
                                autoFocus
                              />
                            </div>
                            {fieldErrors.mobile && (
                              <p className="text-xs text-red-500 mt-1">{fieldErrors.mobile}</p>
                            )}
                          </div>
                        </div>

                        {/* Apply Now Button */}
                        <button
                          onClick={() => {
                            // Validate mobile number only
                            if (formData.mobile.length !== 10) {
                              setFieldErrors(prev => ({ ...prev, mobile: 'Please enter a valid 10-digit mobile number' }));
                              return;
                            }
                            setShowLandingPage(false);
                          }}
                          className="w-full mt-6 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98]"
                        >
                          Get Started
                        </button>

                        {/* Consent Checkboxes */}
                        <div className="mt-4 space-y-3">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <div className="mt-0.5">
                              <div className="w-5 h-5 rounded border-2 flex items-center justify-center bg-emerald-500 border-emerald-500">
                                <CheckCircle className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              By continuing, I agree to Credit Bureau <a href="/terms-and-conditions" className="text-blue-600 underline">Terms and Conditions</a> and authorize Quikkred and its <a href="/partners" className="text-blue-600 underline">Partners</a> to collect and store the Credit Bureau data for checking my eligibility for loan.
                            </p>
                          </label>

                          <label className="flex items-start gap-2 cursor-pointer">
                            <div className="mt-0.5">
                              <div className="w-5 h-5 rounded border-2 flex items-center justify-center bg-emerald-500 border-emerald-500">
                                <CheckCircle className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              By continuing, I agree to the <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a> and <a href="/terms-and-conditions" className="text-blue-600 underline">Terms and Conditions</a> of Quikkred and its <a href="/partners" className="text-blue-600 underline">Partners</a>, and I consent to receive communications via SMS, E-mail, and WhatsApp.
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* Lending Partners Section */}
                      <div className="bg-gradient-to-b from-amber-50 to-white py-8 px-4 sm:px-8">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                          <h3 className="text-base font-bold text-gray-900">Our Lending Partners</h3>
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                        </div>
                        <p className="text-xs text-gray-600 text-center mb-6">Loan Solutions from Our Trusted Lenders</p>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Landmark className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Satsai Finlease Pvt Ltd</h4>
                            <p className="text-xs text-gray-600">RBI Registered NBFC</p>
                            <p className="text-[10px] text-emerald-600 font-semibold mt-1">RBI Reg: B-14.01646</p>
                            <p className="text-[10px] text-gray-500">CIN: U71290DL1996PTC081328</p>
                          </div>
                        </div>
                      </div>

                      {/* 3 Steps Process Section */}
                      <div className="bg-white py-8 px-4 sm:px-8">
                        <div className="flex items-center gap-2 mb-6 justify-center">
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                          <h3 className="text-base font-bold text-gray-900">Your loan is 3 steps away</h3>
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <p className="text-orange-400 font-bold text-lg mb-2">01</p>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-orange-200">
                              <Users className="w-6 h-6 text-orange-500" />
                            </div>
                            <p className="text-xs font-semibold text-gray-900">Enter Basic</p>
                            <p className="text-xs text-gray-600">Details</p>
                          </div>
                          <div className="text-center">
                            <p className="text-orange-400 font-bold text-lg mb-2">02</p>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-orange-200">
                              <IndianRupee className="w-6 h-6 text-orange-500" />
                            </div>
                            <p className="text-xs font-semibold text-gray-900">Choose & Apply</p>
                            <p className="text-xs text-gray-600">Loan Offers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-orange-400 font-bold text-lg mb-2">03</p>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-orange-200">
                              <Landmark className="w-6 h-6 text-orange-500" />
                            </div>
                            <p className="text-xs font-semibold text-gray-900">Instant Cash in</p>
                            <p className="text-xs text-gray-600">Bank</p>
                          </div>
                        </div>
                      </div>

                      {/* Eligibility Section */}
                      <div className="bg-gray-50 py-8 px-4 sm:px-8">
                        <div className="flex items-center gap-2 mb-6 justify-center">
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                          <h3 className="text-base font-bold text-gray-900">Personal Loan Eligibility</h3>
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-bold text-gray-900 min-w-20">Age:</span>
                            <span className="text-sm text-gray-700">21 - 60 years</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-bold text-gray-900 min-w-20">Income:</span>
                            <span className="text-sm text-gray-700">Minimum Rs 15,000/month for salaried applicants</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-bold text-gray-900 min-w-20">Resident:</span>
                            <span className="text-sm text-gray-700">A resident of India</span>
                          </div>
                        </div>
                      </div>

                      {/* Why Choose Us Section */}
                      <div className="bg-gradient-to-b from-gray-50 to-emerald-50/30 py-8 px-4 sm:px-8">
                        <div className="flex items-center gap-2 mb-6 justify-center">
                          <Star className="w-4 h-4 text-orange-400" />
                          <h3 className="text-base font-bold text-gray-900">Why Choose Us</h3>
                          <Star className="w-4 h-4 text-orange-400" />
                        </div>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                          <div className="bg-emerald-50 rounded-xl p-3 mb-4 flex items-center justify-center gap-2">
                            <BadgeCheck className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-800">Trusted by 50K+ users</span>
                          </div>

                          <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b border-gray-100">
                            <span className="text-xl font-bold text-emerald-600">Quikkred</span>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Star className="w-4 h-4 text-orange-400 fill-orange-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-gray-900">Your Money, Our Expertise</p>
                                <p className="text-xs text-gray-600">Quikkred: India&apos;s Trusted Financial Platform</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Star className="w-4 h-4 text-orange-400 fill-orange-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-gray-900">100% Digital Loans</p>
                                <p className="text-xs text-gray-600">No Paperwork, No Collateral</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Star className="w-4 h-4 text-orange-400 fill-orange-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-gray-900">Best Loan Offers</p>
                                <p className="text-xs text-gray-600">Lowest Rate, Flexible tenures</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Star className="w-4 h-4 text-orange-400 fill-orange-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-gray-900">RBI Registered Partners</p>
                                <p className="text-xs text-gray-600">Borrow securely from Reliable lenders</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rates & Charges Section */}
                      <div className="bg-white py-8 px-4 sm:px-8">
                        <div className="flex items-center gap-2 mb-6 justify-center">
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                          <h3 className="text-base font-bold text-gray-900">Rates & Charges</h3>
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                              <IndianRupee className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">Finance Amount</p>
                              <p className="text-xs text-gray-600">₹5,000 - ₹25,000</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">Platform Fee</p>
                              <p className="text-xs text-gray-600">10% of loan amount</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                              <Percent className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">GST on Platform Fee</p>
                              <p className="text-xs text-gray-600">18% of platform fee</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">Tenure</p>
                              <p className="text-xs text-gray-600">Up to 90 days</p>
                            </div>
                          </div>
                        </div>

                        {/* Interest Rates */}
                        <div className="flex items-center gap-2 mb-4 justify-center">
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                          <h4 className="text-sm font-bold text-gray-900">Interest & Penalty</h4>
                          <div className="flex-1 h-px bg-gray-300 max-w-16" />
                        </div>

                        <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                              <span className="text-sm font-semibold text-gray-900">Daily Interest Rate</span>
                            </div>
                            <span className="text-sm text-gray-700">1% per day</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                              <span className="text-sm font-semibold text-gray-900">Cheque Bounce</span>
                            </div>
                            <span className="text-sm text-gray-700">₹500 per instance</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                              <span className="text-sm font-semibold text-gray-900">Late Payment</span>
                            </div>
                            <span className="text-sm text-gray-700">2% per month</span>
                          </div>
                        </div>
                      </div>

                      {/* APR Calculation Section */}
                      <div className="bg-gray-50 py-8 px-4 sm:px-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Illustrative Loan Calculation</h3>
                        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                          The total cost includes platform fee (10%), GST (18% on platform fee). Interest is charged at 1% per day on the loan amount.
                        </p>

                        {/* Comparison Table */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                          <div className="bg-indigo-800 text-white p-3 grid grid-cols-3 text-xs font-semibold">
                            <span>Variable</span>
                            <span className="text-center">Case 1</span>
                            <span className="text-center">Case 2</span>
                          </div>

                          {[
                            { label: 'Loan Amount', case1: '₹10,000', case2: '₹25,000' },
                            { label: 'Tenure', case1: '30 Days', case2: '15 Days' },
                            { label: 'Interest Rate', case1: '1%/day', case2: '1%/day' },
                            { label: 'Platform Fee', case1: '₹1,000', case2: '₹2,500' },
                            { label: 'GST (18%)', case1: '₹180', case2: '₹450' },
                            { label: 'Total Interest', case1: '₹3,000', case2: '₹3,750' },
                            { label: 'You Receive', case1: '₹8,820', case2: '₹22,050' },
                            { label: 'Total Repayment', case1: '₹10,000', case2: '₹25,000' },
                          ].map((row, index) => (
                            <div key={row.label} className={`grid grid-cols-3 text-xs p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                              <span className="font-medium text-gray-900">{row.label}</span>
                              <span className="text-center text-gray-700">{row.case1}</span>
                              <span className="text-center text-gray-700">{row.case2}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Disclaimer Footer */}
                      <div className="bg-white border-t border-gray-200 py-6 px-4 sm:px-8 rounded-b-2xl">
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            <span className="font-bold text-gray-900">Disclaimer:</span> Quikkred is a digital lending platform and is authorized to provide services on behalf of its partner NBFC - Satsai Finlease Private Limited (RBI Reg: B-14.01646 | CIN: U71290DL1996PTC081328).
                          </p>
                        </div>

                        <div className="text-center space-y-2">
                          <p className="text-xs text-gray-700 font-semibold">Satsai Finlease Private Limited</p>
                          <p className="text-[10px] text-gray-500">
                            1008, 10th floor, Vikrant Tower, Rajendra Place, New Delhi - 110005
                          </p>
                          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
                            <a href="tel:+919311913854" className="flex items-center gap-1 hover:text-emerald-600">
                              <Phone className="w-3 h-3" />
                              +91 9311913854
                            </a>
                            <span>•</span>
                            <a href="mailto:support@quikkred.in" className="hover:text-emerald-600">
                              support@quikkred.in
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============================================ */}
                  {/* ORIGINAL FORM - Shows after landing page */}
                  {/* ============================================ */}
                  {(!showLandingPage || user) && (
                    <>
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
                            disabled={formData.emailVerified || basicDetailsFilled}
                            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 ${fieldErrors.email ? "border-red-500" : "border-gray-300"
                              }`}
                            placeholder="your@email.com"
                          />

                          {/* Send/Resend OTP button (only if not verified) */}
                          {!formData.emailVerified && !basicDetailsFilled && (
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
                          {(formData.emailVerified || basicDetailsFilled) && (
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
                            disabled={formData.mobileVerified || basicDetailsFilled}
                            maxLength={10}
                            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 ${fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                              }`}
                            placeholder="enter mobile number"
                          />
                          {!formData.mobileVerified && !basicDetailsFilled && (
                            <button
                              onClick={sendOTP}
                              disabled={!formData.mobile || loading || (otpSent && emailOtpTimer > 0)}
                              className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap"
                            >
                              {loading ? "Sending..." : otpSent ? (emailOtpTimer > 0 ? `Resend (${emailOtpTimer}s)` : "Resend OTP") : "Verify"}
                            </button>
                          )}
                          {(formData.mobileVerified || basicDetailsFilled) && (
                            <CheckCircle className="w-10 h-10 text-green-600" />
                          )}
                        </div>
                        {fieldErrors.mobile && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                        )}
                      </div>

                      {!formData.mobileVerified && !basicDetailsFilled && otpSent && (
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
                      disabled={basicDetailsFilled}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.fullName ? 'border-red-500' : 'border-gray-300'
                        } ${basicDetailsFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                          disabled={formData.emailVerified || basicDetailsFilled}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                            } ${(formData.emailVerified || basicDetailsFilled) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                            disabled={formData.mobileVerified || basicDetailsFilled}
                            maxLength={10}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                              } ${(formData.mobileVerified || basicDetailsFilled) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                            disabled={basicDetailsFilled}
                            max={(() => {
                              const date = new Date();
                              date.setFullYear(date.getFullYear() - 18);
                              return date.toISOString().split('T')[0];
                            })()}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.dob ? 'border-red-500' : 'border-gray-300'
                              } ${basicDetailsFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                                disabled={basicDetailsFilled}
                                maxLength={10}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                                  } ${basicDetailsFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                                disabled={basicDetailsFilled}
                                max={(() => {
                                  const date = new Date();
                                  date.setFullYear(date.getFullYear() - 18);
                                  return date.toISOString().split('T')[0];
                                })()}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.dob ? 'border-red-500' : 'border-gray-300'
                                  } ${basicDetailsFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                              disabled={formData.emailVerified || basicDetailsFilled}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                                } ${(formData.emailVerified || basicDetailsFilled) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                              disabled={basicDetailsFilled}
                              max={(() => {
                                const date = new Date();
                                date.setFullYear(date.getFullYear() - 18);
                                return date.toISOString().split('T')[0];
                              })()}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.dob ? 'border-red-500' : 'border-gray-300'
                                } ${basicDetailsFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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

                  {/* State Selection with Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <div className="relative state-dropdown-container">
                      <button
                        type="button"
                        onClick={() => !basicDetailsFilled && setStateDropdownOpen(!stateDropdownOpen)}
                        disabled={basicDetailsFilled}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] text-left flex justify-between items-center ${fieldErrors.state ? 'border-red-500' : 'border-gray-300'
                          } ${basicDetailsFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                      >
                        <span className={formData.state ? 'text-gray-900' : 'text-gray-500'}>
                          {formData.state
                            ? INDIAN_STATES.find(s => s.value === formData.state)?.label || formData.state
                            : 'Select State'}
                        </span>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${stateDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {stateDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          {/* Search Input */}
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search state..."
                              value={stateSearchTerm}
                              onChange={(e) => setStateSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#25B181] focus:border-transparent text-sm"
                              autoFocus
                            />
                          </div>
                          {/* States List */}
                          <div className="max-h-48 overflow-y-auto">
                            {INDIAN_STATES
                              .filter(state =>
                                state.value === '' ||
                                state.label.toLowerCase().includes(stateSearchTerm.toLowerCase())
                              )
                              .map((state) => (
                                <div
                                  key={state.value}
                                  className={`px-4 py-2 hover:bg-[#25B181] hover:text-white cursor-pointer ${formData.state === state.value ? 'bg-[#25B181] text-white' : ''
                                    } ${state.value === '' ? 'text-gray-500' : ''}`}
                                  onClick={() => {
                                    const selectedState = state.value.toLowerCase();
                                    setFormData(prev => ({ ...prev, state: selectedState }));
                                    setStateDropdownOpen(false);
                                    setStateSearchTerm('');

                                    // Check if state is blacklisted
                                    if (BLACKLISTED_STATES.includes(selectedState)) {
                                      setFieldErrors(prev => ({
                                        ...prev,
                                        state: "Sorry, our services are currently not available in this state/region."
                                      }));
                                    } else {
                                      setFieldErrors(prev => ({ ...prev, state: '' }));
                                    }
                                  }}
                                >
                                  {state.label}
                                </div>
                              ))}
                            {INDIAN_STATES.filter(state =>
                              state.value === '' ||
                              state.label.toLowerCase().includes(stateSearchTerm.toLowerCase())
                            ).length === 0 && (
                                <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                  No states found
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                    {fieldErrors.state && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.state}</p>
                    )}
                  </div>

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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${formData.loanAmount && (parseFloat(formData.loanAmount.replace(/,/g, "")) < 5000 || parseFloat(formData.loanAmount.replace(/,/g, "")) > 25000)
                          ? "border-red-500"
                          : "border-gray-300"
                          }`}
                        placeholder="₹ 2,000 - ₹ 25,000"
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
                    </>
                  )}
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
                          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 uppercase ${fieldErrors.pan || panError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="ABCDE1234F"
                        />
                        {!panVerified && (
                          <button
                            type="button"
                            onClick={verifyPAN}
                            disabled={!formData.pan || formData.pan.length !== 10 || panVerifying || panReverifyTimer > 0}
                            className={`px-6 py-3 text-white rounded-lg whitespace-nowrap ${panReverifyTimer > 0
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
                          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 disabled:cursor-not-allowed tracking-widest ${fieldErrors.aadhaar || aadhaarError ? 'border-red-500' : 'border-gray-300'
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
                              className={`px-6 py-3 text-white rounded-lg whitespace-nowrap ${aadhaarReverifyTimer > 0
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

                      {/* Message - Show reason from API if available */}
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {approvalData.reason || 'We regret to inform you that your loan application could not be approved based on our eligibility criteria.'}
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
                    /* ========== FINFACTOR SUCCESS - AUTO PROCESSING UI WITH COUNTDOWN ========== */
                    <div className="text-center py-8">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        {/* Background circle */}
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="none"
                          />
                          {/* Animated progress circle */}
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#3B82F6"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={352}
                            strokeDashoffset={352 - (352 * processingCountdown) / 60}
                            className="transition-all duration-1000 ease-linear"
                          />
                        </svg>
                        {/* Countdown number in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-blue-600">{processingCountdown}</span>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Processing Your Application</h2>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Please wait while we verify your bank statement and process your loan application...
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                        <p className="text-sm text-gray-500">Estimated time: {processingCountdown} seconds</p>
                        <p className="text-xs text-gray-400 mt-1">Please do not close this window</p>
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
                            const token = await getToken();
                            if (!token) {
                              toast({ variant: "error", title: "Authentication Error", description: "Please login again to continue." });
                              return;
                            }
                            setPtbLoading(true);
                            try {
                              const response = await fetch(`${API_BASE_URL}/api/kyc/finfactorConsentRequest`, {
                                method: 'GET',
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              const result = await response.json();
                              if (response.ok && result.success) {
                                toast({ variant: "success", title: "Success", description: result.message || "Bank verification initiated successfully." });
                                if (result.data?.url) {
                                  window.location.href = result.data.url;
                                }
                              } else {
                                toast({ variant: "error", title: "Failed", description: result.message || "Failed to initiate bank verification." });
                              }
                            } catch (error: any) {
                              console.error('PTB API error:', error);
                              toast({ variant: "error", title: "Network Error", description: error?.message || "Unable to connect to server. Please try again." });
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
                    /* ========== APPROVED STATUS - Show loan details before submit ========== */
                    <>
                      {/* Pre-submit Header */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-blue-800">Review Your Loan Details</h3>
                            <p className="text-sm text-blue-600">Please review the details below and click &quot;Submit Application&quot; to proceed.</p>
                          </div>
                        </div>
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
                            <p className="text-sm text-gray-500 mb-1">Platform Fee</p>
                            <p className="text-xl font-bold text-gray-900">₹{((calculatedLoanDetails?.processingFee ?? approvalData.processingFee) || 0).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">GST on Platform Fee</p>
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
                      {/* Row 1: IFSC Code and Bank Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* IFSC Code - Primary input for auto-detection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            IFSC Code *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="ifsc"
                              value={formData.ifsc}
                              onChange={(e) => handleIFSCChange(e.target.value)}
                              disabled={bankVerified}
                              maxLength={11}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] pr-12 ${fieldErrors.ifsc || ifscLookupError
                                ? 'border-red-500'
                                : ifscDetectedBank
                                  ? 'bg-green-50 border-green-300'
                                  : bankVerified
                                    ? 'bg-green-50 border-green-300'
                                    : 'border-gray-300'
                                }`}
                              placeholder="Enter IFSC (e.g., SBIN0001234)"
                              style={{ textTransform: 'uppercase' }}
                            />
                            {/* Loading/Success indicator inside input */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {ifscLookupLoading ? (
                                <Loader2 className="w-5 h-5 text-[#25B181] animate-spin" />
                              ) : ifscDetectedBank ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : formData.ifsc.length === 11 && ifscLookupError ? (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              ) : null}
                            </div>
                          </div>
                          {fieldErrors.ifsc ? (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.ifsc}</p>
                          ) : ifscLookupError ? (
                            <p className="mt-1 text-xs text-red-600">{ifscLookupError}</p>
                          ) : ifscDetectedBank && ifscBranchName ? (
                            <p className="mt-1 text-xs text-green-600">Branch: {ifscBranchName}</p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-500">Enter 11-character IFSC to auto-detect bank</p>
                          )}
                        </div>

                        {/* Bank Name - Auto-filled from IFSC lookup */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name *
                            {ifscDetectedBank && (
                              <span className="ml-2 text-xs text-green-600 font-normal">(Auto-detected)</span>
                            )}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="bankName"
                              value={formData.bankName}
                              readOnly={!!ifscDetectedBank}
                              disabled={bankVerified || !!ifscDetectedBank}
                              className={`w-full px-4 py-3 border rounded-lg ${ifscDetectedBank || bankVerified
                                ? 'bg-green-50 border-green-300 cursor-not-allowed'
                                : 'border-gray-300 focus:ring-2 focus:ring-[#25B181]'
                                }`}
                              placeholder={ifscLookupLoading ? "Detecting bank..." : "Enter IFSC to auto-detect"}
                            />
                            {ifscDetectedBank && (
                              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                            )}
                          </div>
                          {!ifscDetectedBank && !ifscLookupLoading && formData.ifsc.length < 11 && (
                            <p className="mt-1 text-xs text-gray-500">Bank will be auto-filled from IFSC</p>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Account Holder Name and Account Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.accountHolderName ? 'border-red-500' : bankVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'
                              }`}
                            placeholder="Enter account holder name"
                          />
                          {fieldErrors.accountHolderName && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.accountHolderName}</p>
                          )}
                        </div>

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
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${fieldErrors.accountNumber ? 'border-red-500' : bankVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'
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

                      {/* Verify Bank Button */}
                      <div className="pt-2">
                        {bankVerifyError && (
                          <p className="text-sm text-red-600 mb-2">{bankVerifyError}</p>
                        )}
                        <button
                          type="button"
                          onClick={verifyBankAccount}
                          disabled={bankVerifying || bankVerified || !formData.bankName || !formData.accountHolderName || !formData.accountNumber || !formData.ifsc || ifscLookupLoading}
                          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all ${bankVerified
                            ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                            : bankVerifying
                              ? 'bg-gray-300 text-gray-600 cursor-wait'
                              : !formData.bankName || !formData.accountHolderName || !formData.accountNumber || !formData.ifsc || ifscLookupLoading
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

            {/* UPI Autopay Consent - Show only on step 4 when approval data is ready */}
            {currentStep === 4 && approvalData && approvalData.status !== 'Reject' && approvalData.status !== 'Proceed to Bank' && !finfactorSuccess && (
              <div className={`mt-6 rounded-xl p-5 ${(reduxCustomer?.data?.upiAutoPayStatus === true || upiAutopayConsent) ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'}`}>
                {/* Success UI when UPI Autopay is authorized */}
                {(reduxCustomer?.data?.upiAutoPayStatus === true || upiAutopayConsent) ? (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-green-800 text-lg">UPI Autopay Authorized</span>
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-green-700">
                        Your UPI Autopay has been set up successfully. EMI will be automatically debited on the due date.
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-green-600">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          RBI Compliant
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Secure & Active
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {mandateLoading ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <input
                            type="checkbox"
                            id="upiAutopayConsent"
                            checked={upiAutopayConsent}
                            onChange={(e) => handleUpiAutopayClick(e.target.checked)}
                            disabled={mandateLoading}
                            className="w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 cursor-pointer"
                          />
                        )}
                      </div>
                      <label htmlFor="upiAutopayConsent" className="cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="font-semibold text-gray-900">UPI Autopay Authorization</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          I authorize Quikkred to set up UPI Autopay for automatic EMI deductions from my registered bank account.
                          I understand that EMI amounts will be automatically debited on the due date as per the loan repayment schedule.
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            RBI Compliant
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure Transaction
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Cancel Anytime
                          </span>
                        </div>
                      </label>
                    </div>
                    {mandateLoading && !mandateVerifying && (
                      <p className="mt-3 text-xs text-blue-600 flex items-center gap-1">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Setting up UPI Autopay...
                      </p>
                    )}
                    {mandateVerifying && (
                      <p className="mt-3 text-xs text-green-600 flex items-center gap-1">
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        Verifying UPI Autopay status, please wait...
                      </p>
                    )}
                    {!upiAutopayConsent && !mandateLoading && (
                      <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Please click to authorize UPI Autopay to proceed with your application
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Navigation Buttons - Show Next for steps 1-3, Show Submit only on step 4 when approval data is ready */}
            {(currentStep < 4 || (currentStep === 4 && approvalData && approvalData.status !== 'Reject' && approvalData.status !== 'Proceed to Bank' && !finfactorSuccess)) && (
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && currentStep < 4 && (
                  <button
                    onClick={handlePrevious}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={loading || (currentStep === 1 && !isStep1Valid()) || (currentStep === 4 && !upiAutopayConsent)}
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
