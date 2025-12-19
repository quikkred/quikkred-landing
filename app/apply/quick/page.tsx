"use client";

import { useState, useEffect } from "react";
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
  const searchParams = useSearchParams();
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
  const [aadhaarStatusChecked, setAadhaarStatusChecked] = useState(false);
  const [aadhaarStatusLoading, setAadhaarStatusLoading] = useState(false);
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
                accountHolderName: profileData.banks?.[0]?.accountHolderName || prev.accountHolderName,
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
              // Check bank verification via penny drop status
              if (profileData.banks?.[0]?.pennyDropStatus === 'VERIFIED') {
                setBankVerified(true);
                console.log('✅ Bank already verified (penny drop)');
              }

              // Load selfie preview from profile if available
              if (profileData.profile?.s3URL) {
                setSelfiePreview(profileData.profile.s3URL);
                setSelfieCaptured(true);
                console.log('✅ Selfie loaded from profile:', profileData.profile.s3URL);
              }

              // Auto-jump to next incomplete step based on completion flags (4-step form)
              let nextStep = 1; // Default to step 1

              // Check completion status and determine next step
              if (profileData.isBasicDetailsFilled === true && profileData.isIdentityVerified === true && profileData.isEmploymentDetailsFilled === true) {
                nextStep = 4; // Go to final step (Bank Details)
              } else if (profileData.isBasicDetailsFilled === true && profileData.isIdentityVerified === true) {
                nextStep = 3; // Go to Approval step
              } else if (profileData.isBasicDetailsFilled === true) {
                nextStep = 2; // Go to identity verification
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

  // Get user location when they land on the apply page (after clicking "Apply Now")
  useEffect(() => {
    const requestLocation = async () => {
      console.log('📍 Requesting user location on page load...');
      await getLocation();
    };
    requestLocation();
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
        // Create AbortController for timeout handling (15 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch('https://api.bluechipfinmax.com/api/kyc/aadhaar/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = await response.json();

        // STEP 7: Handle API response
        if (response.ok && result.success && result.data?.isAadhaarVerify === true) {
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

    const formatCurrency = (value: any) => {
      if (!value || value === 'N/A' || isNaN(value)) return 'N/A';
      return Number(value).toLocaleString('en-IN');
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
            <td>${dueDate.toLocaleDateString('en-IN')}</td>
            <td>Rs${(loanAmount)}</td>
            <td>Rs${(Math.round(interest))}</td>
            <td>Rs${(Math.round(totalAmount))}</td>
            <td>eNACH Auto-Debit</td>
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
            <td>Rs${(principal)}</td>
            <td>Rs${(interest)}</td>
            <td>Rs${(emi)}</td>
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loan Agreement - Quikkred</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #2d3748;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 20px;
        }
        .page {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            padding: 35px 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #25B181;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo-section { display: flex; align-items: center; gap: 15px; }
        .logo-section img { height: 55px; width: auto; }
        .company-info h1 { color: #25B181; font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .company-info .tagline { color: #718096; font-size: 11px; font-style: italic; }
        .company-info .reg-info { color: #a0aec0; font-size: 9px; margin-top: 6px; line-height: 1.5; }
        .doc-info { text-align: right; font-size: 11px; color: #4a5568; }
        .doc-info .loan-ref {
            font-size: 15px;
            font-weight: 700;
            color: #25B181;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            padding: 8px 16px;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 8px;
            box-shadow: 0 2px 8px rgba(37, 177, 129, 0.15);
        }
        .title { text-align: center; margin-bottom: 35px; }
        .title h2 {
            font-size: 20px;
            color: #1a202c;
            text-transform: uppercase;
            letter-spacing: 2px;
            border: 2px solid #25B181;
            display: inline-block;
            padding: 14px 50px;
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(37, 177, 129, 0.08);
        }
        .title .subtitle { font-size: 11px; color: #718096; margin-top: 12px; }
        .section { margin-bottom: 25px; }
        .section-title {
            font-size: 13px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, #25B181 0%, #1d9469 100%);
            text-transform: uppercase;
            padding: 10px 18px;
            margin-bottom: 15px;
            border-radius: 6px;
            letter-spacing: 0.8px;
            box-shadow: 0 2px 8px rgba(37, 177, 129, 0.25);
        }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 25px; }
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            background: #f8fafc;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        .info-row:hover { background: #f0fdf4; transform: translateX(3px); }
        .info-label { color: #718096; font-size: 10px; text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px; }
        .info-value { font-weight: 600; font-size: 11px; color: #2d3748; text-align: right; }
        .loan-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 2px solid #25B181;
            border-radius: 16px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(37, 177, 129, 0.12);
        }
        .loan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center; }
        .loan-item {
            padding: 18px 12px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            transition: all 0.3s ease;
        }
        .loan-item:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
        .loan-item .amount { font-size: 20px; font-weight: 700; color: #25B181; }
        .loan-item .label { font-size: 9px; color: #718096; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.3px; }
        .loan-item.highlight { background: linear-gradient(135deg, #25B181 0%, #1d9469 100%); }
        .loan-item.highlight .amount { color: white; }
        .loan-item.highlight .label { color: rgba(255,255,255,0.9); }
        .schedule-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .schedule-table th { background: linear-gradient(135deg, #25B181 0%, #1d9469 100%); color: white; padding: 12px 10px; text-align: left; font-weight: 600; }
        .schedule-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .schedule-table tr:nth-child(even) { background: #f8fafc; }
        .schedule-table tr:hover td { background: #f0fdf4; }
        .terms { font-size: 10px; color: #4a5568; background: #f8fafc; padding: 18px; border-radius: 10px; }
        .terms ol { padding-left: 20px; }
        .terms li { margin-bottom: 8px; line-height: 1.6; }
        .terms li strong { color: #2d3748; }
        .notice {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 1px solid #fbbf24;
            border-left: 5px solid #f59e0b;
            border-radius: 12px;
            padding: 18px 22px;
            margin: 20px 0;
            font-size: 10px;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }
        .notice-title { font-weight: 700; color: #92400e; margin-bottom: 10px; font-size: 11px; }
        .notice ul { margin: 0; padding-left: 18px; color: #78350f; }
        .notice li { margin: 6px 0; line-height: 1.5; }
        .signature-section { margin-top: 35px; padding-top: 25px; border-top: 2px solid #2d3748; }
        .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px; }
        .signature-box { text-align: center; }
        .esign-box {
            border: 2px dashed #25B181;
            padding: 25px 20px;
            text-align: center;
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
            border-radius: 16px;
            min-height: 180px;
            transition: all 0.3s ease;
        }
        .esign-box:hover { border-style: solid; box-shadow: 0 8px 24px rgba(37, 177, 129, 0.15); }
        .esign-box .icon { font-size: 36px; margin-bottom: 10px; }
        .esign-box .text { font-size: 12px; color: #25B181; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .esign-box .subtext { font-size: 10px; color: #718096; margin-top: 4px; }
        .esign-box .details { margin-top: 15px; font-size: 10px; color: #4a5568; line-height: 1.7; }
        .lender-box { border-color: #2d3748; background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%); }
        .lender-box .text { color: #2d3748; }
        .declaration {
            background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
            border: 1px solid #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            font-size: 10px;
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .declaration-title { font-weight: 700; margin-bottom: 15px; color: #1e293b; font-size: 12px; }
        .checkbox-item { display: flex; align-items: flex-start; gap: 10px; margin: 8px 0; padding: 8px 12px; background: white; border-radius: 6px; }
        .checkbox {
            width: 18px; height: 18px;
            border: 2px solid #25B181;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 1px;
            background: #25B181;
        }
        .checkbox::after { content: "✓"; color: white; font-size: 11px; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #718096; text-align: center; }
        .footer p { margin: 4px 0; }
        .footer .legal { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e2e8f0; font-size: 8px; color: #a0aec0; }

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
        @media (max-width: 768px) {
            body { padding: 15px; }
            .page { padding: 25px 20px; border-radius: 12px; }
            .header { flex-direction: column; gap: 20px; }
            .doc-info { text-align: left; }
            .info-grid { grid-template-columns: 1fr; }
            .loan-grid { grid-template-columns: 1fr 1fr; }
            .signature-grid { grid-template-columns: 1fr; gap: 25px; }
            .title h2 { padding: 12px 25px; font-size: 16px; }
        }
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
    <div class="watermark">QUIKKRED</div>
    <div class="page">
        <div class="header">
            <div class="logo-section">
                
                <div class="company-info">
                    <h1>QUIKKRED</h1>
                    <div class="tagline">Quick Credit, Trusted Partner</div>
                    <div class="reg-info">Satsai Finlease Private Limited | RBI Registered NBFC<br>CIN: U65100MH2024PTC123456 | CoR: N-05.02345</div>
                </div>
            </div>
            <div class="doc-info">
                <div class="loan-ref">QK${getValue(data.applicationNumber) !== 'N/A' ? data.applicationNumber : Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                <p><strong>Date:</strong> ${currentDate}</p>
                <p><strong>Place:</strong> ${getValue(data.city)}, ${getValue(data.state)}</p>
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
                <div class="info-row" style="grid-column: span 2;"><span class="info-label">Residential Address</span><span class="info-value">${getValue(data.address)}, ${getValue(data.city)}, ${getValue(data.state)} - ${getValue(data.pincode)}</span></div>
            </div>
        </div>

        <div class="section avoid-break">
            <div class="section-title">Employment Details</div>
            <div class="info-grid">
                <div class="info-row"><span class="info-label">Employment Type</span><span class="info-value">${getValue(data.employmentType)}</span></div>
                <div class="info-row"><span class="info-label">Company / Business Name</span><span class="info-value">${getValue(data.companyName)}</span></div>
                <div class="info-row"><span class="info-label">Designation</span><span class="info-value">${getValue(data.designation)}</span></div>
                <div class="info-row"><span class="info-label">Monthly Income</span><span class="info-value">Rs${(data.monthlyIncome)}</span></div>
                <div class="info-row"><span class="info-label">Salary Credit Date</span><span class="info-value">${getValue(data.salaryDate) !== 'N/A' ? data.salaryDate : '1st'} of every month</span></div>
                <div class="info-row"><span class="info-label">Work Experience</span><span class="info-value">${getValue(data.workExperience)} years</span></div>
            </div>
        </div>

        <!-- Page Break before Loan Details -->
        <div class="page-break"></div>

        <div class="section avoid-break">
            <div class="section-title">Loan Details</div>
            <div class="loan-box">
                <div class="loan-grid">
                    <div class="loan-item"><div class="amount">Rs${(data.loanAmount)}</div><div class="label">Principal Amount</div></div>
                    <div class="loan-item"><div class="amount">${getValue(data.interestRate) !== 'N/A' ? data.interestRate : '1.0'}%</div><div class="label">Interest Rate (Daily)</div></div>
                    <div class="loan-item"><div class="amount">${getValue(data.tenure)} ${getValue(data.tenureUnit) !== 'N/A' ? data.tenureUnit : 'days'}</div><div class="label">Loan Tenure</div></div>
                    <div class="loan-item"><div class="amount">Rs${(data.processingFee ? (parseFloat(data.loanAmount || 0) * parseFloat(data.processingFee) / 100) : 0)}</div><div class="label">Processing Fee (${getValue(data.processingFee) !== 'N/A' ? data.processingFee : '2'}%)</div></div>
                    <div class="loan-item highlight"><div class="amount">Rs${(data.disbursementAmount)}</div><div class="label">Disbursement Amount</div></div>
                    <div class="loan-item highlight"><div class="amount">Rs${(data.totalAmount)}</div><div class="label">Total Repayment</div></div>
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
                    <tr><th>Instalment</th><th>Due Date</th><th>Principal</th><th>Interest</th><th>Total EMI</th><th>Payment Mode</th></tr>
                </thead>
                <tbody>${generateRepaymentSchedule()}</tbody>
            </table>
            <p style="font-size: 9px; color: #666; margin-top: 10px;">* All amounts are in Indian Rupees (INR). EMI will be auto-debited via eNACH/eMandate on the due date.</p>
        </div>

        <!-- Page Break before Important Notice & Terms -->
        <div class="page-break"></div>

        <div class="notice avoid-break">
            <div class="notice-title">⚠️ IMPORTANT NOTICE - PLEASE READ CAREFULLY</div>
            <ul>
                <li><strong>Late Payment Charges:</strong> ₹500 + 2% per day on overdue amount.</li>
                <li><strong>Credit Reporting:</strong> Non-payment will be reported to CIBIL, Experian, Equifax & CRIF High Mark.</li>
                <li><strong>Legal Action:</strong> Default may result in legal proceedings under applicable laws.</li>
                <li><strong>Collection:</strong> Recovery agents may contact you for overdue payments as per RBI guidelines.</li>
            </ul>
        </div>

        <div class="section">
            <div class="section-title">Terms & Conditions</div>
            <div class="terms">
                <ol>
                    <li><strong>Loan Purpose:</strong> This loan is granted for personal/business use as declared by the Borrower.</li>
                    <li><strong>Disbursement:</strong> Upon successful verification, the loan amount will be disbursed within 24-48 hours.</li>
                    <li><strong>Repayment:</strong> The Borrower agrees to repay the loan as per the repayment schedule via eNACH/eMandate.</li>
                    <li><strong>Interest & Charges:</strong> The applicable interest rate is ${getValue(data.interestRate) !== 'N/A' ? data.interestRate : '1.0'}% Daily (36.5% APR). Processing fee of ${getValue(data.processingFee) !== 'N/A' ? data.processingFee : '2'}% + 18% GST.</li>
                    <li><strong>Late Payment:</strong> Late fee of Rs 500 and penal interest of 2% per day will apply on overdue amounts.</li>
                    <li><strong>Default & Recovery:</strong> Default may result in credit bureau reporting and legal action.</li>
                    <li><strong>Governing Law:</strong> This agreement is governed by Indian laws with jurisdiction in ${getValue(data.city) !== 'N/A' ? data.city : 'Mumbai'}.</li>
                </ol>
            </div>
        </div>

        <!-- Page Break before Declaration & Signatures -->
        <div class="page-break"></div>

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
                        <div class="icon">✍️</div>
                        <div class="text">Borrower's eSign</div>
                        <div class="subtext">Aadhaar-based Digital Signature</div>
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
                        <div class="icon">🏢</div>
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
                <button class="test-btn" id="test-btn" onclick="testGeneratePDF()" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; border: none; padding: 14px 35px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;">Download PDF</button>
                <button class="approve-btn" id="approve-btn" onclick="approveAgreement()">I Agree & Approve</button>
            </div>
            <p style="font-size: 11px; color: #666; margin-top: 15px;">Test button downloads PDF locally. Approve button submits and redirects.</p>
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
                'Late Payment Charges: Rs.500 + 2% per day on overdue amount.',
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
            const approveSection = document.getElementById('approve-section');

            // Show loading state
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.textContent = 'Processing...';
            loadingIndicator.style.display = 'block';

            try {
                // Get auth token
                const token = localStorage.getItem('accessToken') ||
                              localStorage.getItem('token') ||
                              localStorage.getItem('authToken');

                if (!token) {
                    alert('Authentication error. Please login again.');
                    window.location.href = '/login';
                    return;
                }

                // Generate PDF blob using jsPDF
                const pdfBlob = await generatePDFBlob();

                // Create FormData and append PDF
                const formData = new FormData();
                formData.append('eSignDoc', pdfBlob, 'loan-agreement.pdf');

                // Upload PDF to API
                const response = await fetch('https://api.bluechipfinmax.com/api/kyc/eSign/upload', {
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
                accountHolderName: profileData.banks?.[0]?.accountHolderName || prev.accountHolderName,
                accountNumber: profileData.banks?.[0]?.accountNumber || prev.accountNumber,
                ifsc: profileData.banks?.[0]?.ifscCode || prev.ifsc,
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
        setPanReverifyTimer(30); // Start 30 second cooldown for reverify

        toast({
          variant: "success",
          title: "PAN Verified!",
          description: result.message || "PAN verification successful!",
        });
      } else {
        // API returned error
        const errorMsg = result.message || 'Failed to verify PAN. Please check the PAN number and try again.';
        setPanError(errorMsg);
        setPanReverifyTimer(30); // Start 30 second cooldown before retry
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
      const verifyResponse = await fetch('https://api.bluechipfinmax.com/api/kyc/aadhaar/verification', {
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
          // No redirect, proceed with OTP flow
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
            setAadhaarOtpTimer(30); // Start 30 second countdown
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

      const response = await fetch('https://api.bluechipfinmax.com/api/kyc/bank/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          accountNumber: formData.accountNumber,
          ifsc: formData.ifsc,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName
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

        const kycPayload = {
          kycDetails: {
            isKycDetailsFilled: true
          }
        };

        formDataToSend.append('data', JSON.stringify(kycPayload));

        // Add selfie photo file
        if (formData.selfie) {
          formDataToSend.append('photo', formData.selfie, formData.selfie.name);
          console.log('✅ Adding selfie photo to Step 2:', formData.selfie.name);
        }

        const response = await fetch(`https://api.bluechipfinmax.com/api/application/loan/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
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
      } else if (step === 4) {
        // Step 4: Bank Details
        payload = {
          bankDetails: {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            accountHolderName: formData.accountHolderName || formData.fullName,
            isBankDetailsFilled: true
          }
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
      // For logged-in users with API-determined step > 1, skip step 1 validation (data already saved)
      if (user && apiDeterminedStep && apiDeterminedStep > 1) {
        setCurrentStep(2);
        return;
      }

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
      // if (!saveSuccess) {
      //   toast({
      //     variant: "error",
      //     title: "Cannot Proceed",
      //     description: "Please fix the errors before moving to the next step.",
      //   });
      //   return;
      // }
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
      setApprovalLoading(true);

      try {
        const token = localStorage.getItem('accessToken') ||
                      localStorage.getItem('token') ||
                      localStorage.getItem('authToken');

        // Call both APIs in parallel - save customer data and get BRE data
        const [saveSuccess, breResponse] = await Promise.all([
          saveCustomerData(2),
          fetch('https://api.bluechipfinmax.com/api/kyc/bre/initialize', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }).then(res => res.json()).catch(err => {
            console.error('BRE API error:', err);
            return null;
          })
        ]);

        setLoading(false);
        setApprovalLoading(false);

        // if (!saveSuccess) {
        //   toast({
        //     variant: "error",
        //     title: "Cannot Proceed",
        //     description: "Please fix the errors before moving to the next step.",
        //   });
        //   return;
        // }

        // Store BRE data for Step 3
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

    if (currentStep === 3) {
      // Step 3: Approval - Require confirmation before proceeding
      if (!dataAgreementChecked) {
        toast({
          variant: "warning",
          title: "Confirmation Required",
          description: "Please click 'Confirm Details' button to review and confirm your application data.",
        });
        return;
      }
    }

    if (currentStep === 4) {
      // Step 4: Bank Details & Consent Validation

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

      // Consent validation
      if (!formData.creditBureauConsent || !formData.termsConsent) {
        setConsentError(true);
        toast({
          variant: "warning",
          title: "Consent Required",
          description: "Please accept the required consents to proceed.",
        });
        return;
      }

      // Clear consent error if validation passes
      setConsentError(false);

      // Final step - submit only Step 4 data (Step 1, 2 & 3 already saved)
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

        // Step 4 Final Submit - only bank details
        const principal = parseFloat(formData.loanAmount);
        const payload = {
          bankDetails: {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            accountHolderName: formData.accountHolderName || formData.fullName,
            isBankDetailsFilled: true
          },
          isSubmit: true
        };

        const response = await fetch(`https://api.bluechipfinmax.com/api/application/loan/create`, {
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

          // Use API response for decision - only on success
          setDecision({
            approved: true,
            apiResponse: result.data,
            approvedAmount: principal,
            interestRate: 12.5,
            tenure: 30,
            tenureUnit: 'days',
            emi: 0,
            processingFee: Math.round(principal * 0.02)
          });
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
            <span className={`text-center ${currentStep === 3 ? 'text-[#25B181] font-semibold' : ''}`}>Approval</span>
            <span className={`text-center ${currentStep === 4 ? 'text-[#25B181] font-semibold' : ''}`}>Bank Details</span>
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
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
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
                          <option value="UNEMPLOYED">UNEMPLOYED</option>
                        <option value="STUDENT">STUDENT</option>
                         <option value="RETIRED">RETIRED</option>
                        <option value="OTHER">OTHER</option>

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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                      placeholder="₹ 50,000"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter the approximate loan amount you require</p>
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
                          {aadhaarVerifying ? "Sending..." : aadhaarOtpSent ? (aadhaarOtpTimer > 0 ? `Resend (${aadhaarOtpTimer}s)` : "Resend OTP") : "Send OTP"}
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

              </motion.div>
            )}

            {/* Step 3: Approval */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Approval</h2>

                {approvalLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-[#25B181] mb-4" />
                    <p className="text-gray-600">Checking your eligibility...</p>
                  </div>
                ) : approvalData ? (
                  <>
                    {/* Approval Status Banner */}
                    <div className={`rounded-xl p-6 text-white ${
                      approvalData.status === 'APPROVED'
                        ? 'bg-gradient-to-r from-[#25B181] to-[#51C9AF]'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 rounded-full p-3">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {approvalData.status === 'APPROVED' ? 'Congratulations!' : 'Application Status'}
                          </h3>
                          <p className="text-white/90">
                            {approvalData.status === 'APPROVED'
                              ? 'Your loan has been approved!'
                              : `Status: ${approvalData.status}`}
                          </p>
                          {approvalData.applicationNumber && (
                            <p className="text-sm text-white/80 mt-1">
                              Application No: {approvalData.applicationNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Loan Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-[#25B181]" />
                        Loan Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-[#25B181] border-2">
                          <p className="text-sm text-[#25B181] mb-1">Loan Amount</p>
                          <p className="text-xl font-bold text-[#25B181]">
                            ₹{(approvalData.loanAmount || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Tenure</p>
                          <p className="text-xl font-bold text-gray-900">
                            {approvalData.tenure || 0} {approvalData.tenureUnit === 'DAYS' ? 'Days' : 'Months'}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                          <p className="text-xl font-bold text-gray-900">{approvalData.interestRate || 0}%</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Interest Amount</p>
                          <p className="text-xl font-bold text-gray-900">₹{(approvalData.interestAmount || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Processing Fee</p>
                          <p className="text-xl font-bold text-gray-900">₹{(approvalData.processingFee || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">GST on Processing Fee</p>
                          <p className="text-xl font-bold text-gray-900">₹{(approvalData.gstOnProcessingFee || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-500 mb-1">Total Repayment</p>
                          <p className="text-xl font-bold text-gray-900">₹{(approvalData.totalRepaymentAmount || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-500 border-2">
                          <p className="text-sm text-green-600 mb-1">Net Disbursal Amount</p>
                          <p className="text-xl font-bold text-green-600">₹{(approvalData.netDisbursalAmount || 0).toLocaleString('en-IN')}</p>
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

                              // Initialize e-Sign verification
                              try {
                                const eSignResponse = await fetch('https://api.bluechipfinmax.com/api/kyc/eSign/initialize', {
                                  method: 'GET',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  }
                                });

                                const eSignResult = await eSignResponse.json();

                                if (!eSignResponse.ok || !eSignResult.success) {
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

                              // Fetch customer data from API
                              let customerData: any = {};

                              try {
                                const response = await fetch('https://api.bluechipfinmax.com/api/customer/get', {
                                  method: 'GET',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  }
                                });

                                const result = await response.json();

                                if (response.ok && result.success && result.data) {
                                  customerData = result.data;
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
                                address: customerData.address?.fullAddress || aadhaarAddress?.fullAddress || '',
                                city: customerData.address?.city || aadhaarAddress?.city || '',
                                state: customerData.address?.state || aadhaarAddress?.state || '',
                                pincode: customerData.address?.pincode || aadhaarAddress?.pincode || '',
                                employmentType: formData.employmentType || customerData.employmentType || '',
                                monthlyIncome: formData.monthlyIncome || customerData.monthlyIncome || '',
                                companyName: formData.companyName || customerData.companyName || '',
                                designation: customerData.designation || '',
                                workExperience: customerData.workExperience || '',
                                salaryDate: customerData.salaryDate || '',
                                bankName: formData.bankName || customerData.banks?.[0]?.bankName || '',
                                accountNumber: formData.accountNumber || customerData.banks?.[0]?.accountNumber || '',
                                ifscCode: formData.ifsc || customerData.banks?.[0]?.ifscCode || '',
                                accountHolderName: formData.accountHolderName || customerData.banks?.[0]?.accountHolderName || formData.fullName || customerData.fullName || '',
                                loanAmount: formData.loanAmount || '',
                                tenure: formData.tenure || '',
                                tenureUnit: formData.tenureUnit || 'Days',
                                productName: selectedProduct?.productName || '',
                                interestRate: selectedProduct?.dailyInterestRate || '',
                                processingFee: selectedProduct?.processingFee || '',
                                totalAmount: emiCalculation?.totalAmount || '',
                                disbursementAmount: emiCalculation ? (emiCalculation.principal - emiCalculation.totalProcessingFee) : '',
                                applicationNumber: customerData.applicationNumber || '',
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

            {/* Step 4: Bank Details & Consent */}
            {currentStep === 4 && (
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
                        <select
                          name="bankName"
                          value={formData.bankName}
                          onChange={(e) => {
                            handleChange(e);
                            setBankVerified(false); // Reset verification on change
                          }}
                          disabled={bankVerified}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] ${bankVerified ? 'bg-green-50 border-green-300' : ''}`}
                        >
                          <option value="">Select Bank</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="HDFC">HDFC Bank</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="AXIS">Axis Bank</option>
                          <option value="PNB">Punjab National Bank</option>
                          <option value="BOB">Bank of Baroda</option>
                          <option value="KOTAK">Kotak Mahindra Bank</option>
                          <option value="IDBI">IDBI Bank</option>
                          <option value="YES">Yes Bank</option>
                          <option value="INDUSIND">IndusInd Bank</option>
                          <option value="BOI">Bank of India</option>
                          <option value="CANARA">Canara Bank</option>
                          <option value="UNION">Union Bank of India</option>
                          <option value="OTHER">Other</option>
                        </select>
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
                            handleChange(e);
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
                        disabled={bankVerifying || bankVerified || !formData.bankName || !formData.accountHolderName || !formData.accountNumber || !formData.ifsc}
                        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
                          bankVerified
                            ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                            : bankVerifying
                            ? 'bg-gray-300 text-gray-600 cursor-wait'
                            : !formData.bankName || !formData.accountHolderName || !formData.accountNumber || !formData.ifsc
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
              disabled={loading || (currentStep === 1 && !isStep1Valid())}
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
