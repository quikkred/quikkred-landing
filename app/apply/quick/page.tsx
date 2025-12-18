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

  // Reverify timers (30 seconds cooldown)
  const [panReverifyTimer, setPanReverifyTimer] = useState(0);
  const [aadhaarReverifyTimer, setAadhaarReverifyTimer] = useState(0);

  // Loan Products
  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [emiCalculation, setEmiCalculation] = useState<any>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [amountError, setAmountError] = useState("")

  // User location state
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);

  // Field validation errors for Step 1 and Step 3
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    mobile: "",
    fullName: "",
    dob: "",
    aadhaar: "",
    pan: "",
    accountNumber: "",
    ifsc: "",
    reference1Name: "",
    reference1Mobile: "",
    reference2Name: "",
    reference2Mobile: ""
  });

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
      accountNumber: "",
      ifsc: "",

      // Step 3: Loan & Consent
      loanAmount: "",
      tenure: "",
      requestedTenureUnit: "",
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

              // Load selfie preview from profile if available
              if (profileData.profile?.s3URL) {
                setSelfiePreview(profileData.profile.s3URL);
                setSelfieCaptured(true);
                console.log('✅ Selfie loaded from profile:', profileData.profile.s3URL);
              }

              // Auto-jump to next incomplete step based on completion flags (3-step form)
              let nextStep = 1; // Default to step 1

              // Check completion status and determine next step
              if (profileData.isBasicDetailsFilled === true && profileData.isIdentityVerified === true && profileData.isEmploymentDetailsFilled === true) {
                nextStep = 3; // Go to final step
              } else if (profileData.isBasicDetailsFilled === true && profileData.isIdentityVerified === true) {
                nextStep = 3; // Go to employment & bank
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
  }, [formData.loanAmount, formData.tenure, formData.requestedTenureUnit, selectedProduct]);

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
    const currentDate = today.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const currentTime = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

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
            <td>₹${formatCurrency(loanAmount)}</td>
            <td>₹${formatCurrency(Math.round(interest))}</td>
            <td>₹${formatCurrency(Math.round(totalAmount))}</td>
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
            <td>₹${formatCurrency(principal)}</td>
            <td>₹${formatCurrency(interest)}</td>
            <td>₹${formatCurrency(emi)}</td>
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
        body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #333; background: #fff; padding: 40px; }
        .page { max-width: 800px; margin: 0 auto; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #25B181; padding-bottom: 20px; margin-bottom: 30px; }
        .logo-section { display: flex; align-items: center; gap: 15px; }
        .logo-section img { height: 50px; width: auto; }
        .company-info h1 { color: #25B181; font-size: 24px; font-weight: bold; margin-bottom: 2px; }
        .company-info .tagline { color: #666; font-size: 10px; font-style: italic; }
        .company-info .reg-info { color: #888; font-size: 8px; margin-top: 5px; }
        .doc-info { text-align: right; font-size: 10px; }
        .doc-info .loan-ref { font-size: 14px; font-weight: bold; color: #25B181; background: #f0fdf4; padding: 5px 12px; border-radius: 4px; display: inline-block; margin-bottom: 5px; }
        .title { text-align: center; margin-bottom: 30px; }
        .title h2 { font-size: 18px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px; border: 2px solid #25B181; display: inline-block; padding: 10px 40px; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); }
        .title .subtitle { font-size: 10px; color: #666; margin-top: 8px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 12px; font-weight: bold; color: #fff; background: #25B181; text-transform: uppercase; padding: 8px 15px; margin-bottom: 15px; border-radius: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid #eee; background: #fafafa; }
        .info-row:hover { background: #f0fdf4; }
        .info-label { color: #666; font-size: 10px; text-transform: uppercase; }
        .info-value { font-weight: bold; font-size: 11px; color: #333; }
        .loan-box { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #25B181; border-radius: 12px; padding: 25px; margin: 20px 0; box-shadow: 0 4px 6px rgba(37, 177, 129, 0.1); }
        .loan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; }
        .loan-item { padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .loan-item .amount { font-size: 22px; font-weight: bold; color: #25B181; }
        .loan-item .label { font-size: 9px; color: #666; text-transform: uppercase; margin-top: 5px; }
        .loan-item.highlight { background: #25B181; }
        .loan-item.highlight .amount { color: white; }
        .loan-item.highlight .label { color: rgba(255,255,255,0.9); }
        .schedule-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; border-radius: 8px; overflow: hidden; }
        .schedule-table th { background: #25B181; color: white; padding: 12px 8px; text-align: left; font-weight: 600; }
        .schedule-table td { padding: 10px 8px; border-bottom: 1px solid #eee; }
        .schedule-table tr:nth-child(even) { background: #f9f9f9; }
        .terms { font-size: 9px; color: #555; background: #fafafa; padding: 15px; border-radius: 8px; }
        .terms ol { padding-left: 20px; }
        .terms li { margin-bottom: 10px; line-height: 1.5; }
        .terms li strong { color: #333; }
        .notice { background: linear-gradient(135deg, #fff3cd 0%, #fef3c7 100%); border: 1px solid #f59e0b; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 15px 20px; margin: 20px 0; font-size: 10px; }
        .notice-title { font-weight: bold; color: #92400e; margin-bottom: 8px; font-size: 11px; }
        .notice ul { margin: 0; padding-left: 18px; color: #78350f; }
        .notice li { margin: 5px 0; }
        .signature-section { margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; }
        .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px; }
        .signature-box { text-align: center; }
        .esign-box { border: 2px dashed #25B181; padding: 25px 20px; text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border-radius: 12px; min-height: 180px; }
        .esign-box .icon { font-size: 36px; margin-bottom: 10px; }
        .esign-box .text { font-size: 12px; color: #25B181; font-weight: bold; text-transform: uppercase; }
        .esign-box .subtext { font-size: 9px; color: #666; margin-top: 3px; }
        .esign-box .details { margin-top: 15px; font-size: 9px; color: #666; line-height: 1.6; }
        .esign-box .stamp { margin-top: 12px; padding: 10px; border: 1px dashed #ccc; font-size: 8px; color: #999; background: white; border-radius: 4px; }
        .lender-box { border-color: #333; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); }
        .lender-box .text { color: #333; }
        .declaration { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; font-size: 10px; margin: 20px 0; }
        .declaration-title { font-weight: bold; margin-bottom: 12px; color: #1e293b; font-size: 11px; }
        .checkbox-item { display: flex; align-items: flex-start; gap: 10px; margin: 10px 0; padding: 8px; background: white; border-radius: 4px; }
        .checkbox { width: 16px; height: 16px; border: 2px solid #25B181; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; background: #25B181; }
        .checkbox::after { content: "✓"; color: white; font-size: 10px; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 8px; color: #666; text-align: center; }
        .footer-logo { margin-bottom: 10px; }
        .footer-logo img { height: 30px; opacity: 0.7; }
        .footer p { margin: 3px 0; }
        .footer .legal { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd; font-size: 7px; color: #999; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(37, 177, 129, 0.03); font-weight: bold; pointer-events: none; z-index: -1; }
        .approve-section { text-align: center; margin-top: 40px; padding: 30px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 12px; border: 2px solid #25B181; }
        .approve-btn { background: #25B181; color: white; border: none; padding: 15px 50px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(37, 177, 129, 0.3); transition: all 0.3s ease; }
        .approve-btn:hover { background: #1d9469; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(37, 177, 129, 0.4); }
        @media print { body { padding: 20px; } .page { max-width: 100%; } .watermark, .approve-section { display: none; } }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
    <div class="watermark">QUIKKRED</div>
    <div class="page">
        <div class="header">
            <div class="logo-section">
                <img src="/logo.png" alt="Quikkred Logo" onerror="this.style.display='none'">
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

        <div class="section">
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

        <div class="section">
            <div class="section-title">Employment Details</div>
            <div class="info-grid">
                <div class="info-row"><span class="info-label">Employment Type</span><span class="info-value">${getValue(data.employmentType)}</span></div>
                <div class="info-row"><span class="info-label">Company / Business Name</span><span class="info-value">${getValue(data.companyName)}</span></div>
                <div class="info-row"><span class="info-label">Designation</span><span class="info-value">${getValue(data.designation)}</span></div>
                <div class="info-row"><span class="info-label">Monthly Income</span><span class="info-value">₹${formatCurrency(data.monthlyIncome)}</span></div>
                <div class="info-row"><span class="info-label">Salary Credit Date</span><span class="info-value">${getValue(data.salaryDate) !== 'N/A' ? data.salaryDate : '1st'} of every month</span></div>
                <div class="info-row"><span class="info-label">Work Experience</span><span class="info-value">${getValue(data.workExperience)} years</span></div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Loan Details</div>
            <div class="loan-box">
                <div class="loan-grid">
                    <div class="loan-item"><div class="amount">₹${formatCurrency(data.loanAmount)}</div><div class="label">Principal Amount</div></div>
                    <div class="loan-item"><div class="amount">${getValue(data.interestRate) !== 'N/A' ? data.interestRate : '1.0'}%</div><div class="label">Interest Rate (Daily)</div></div>
                    <div class="loan-item"><div class="amount">${getValue(data.tenure)} ${getValue(data.tenureUnit) !== 'N/A' ? data.tenureUnit : 'days'}</div><div class="label">Loan Tenure</div></div>
                    <div class="loan-item"><div class="amount">₹${formatCurrency(data.processingFee ? (parseFloat(data.loanAmount || 0) * parseFloat(data.processingFee) / 100) : 0)}</div><div class="label">Processing Fee (${getValue(data.processingFee) !== 'N/A' ? data.processingFee : '2'}%)</div></div>
                    <div class="loan-item highlight"><div class="amount">₹${formatCurrency(data.disbursementAmount)}</div><div class="label">Disbursement Amount</div></div>
                    <div class="loan-item highlight"><div class="amount">₹${formatCurrency(data.totalAmount)}</div><div class="label">Total Repayment</div></div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Disbursement Bank Account</div>
            <div class="info-grid">
                <div class="info-row"><span class="info-label">Account Holder Name</span><span class="info-value">${getValue(data.accountHolderName)}</span></div>
                <div class="info-row"><span class="info-label">Account Number</span><span class="info-value">${getValue(data.accountNumber)}</span></div>
                <div class="info-row"><span class="info-label">Bank Name</span><span class="info-value">${getValue(data.bankName)}</span></div>
                <div class="info-row"><span class="info-label">IFSC Code</span><span class="info-value">${getValue(data.ifscCode)}</span></div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Repayment Schedule</div>
            <table class="schedule-table">
                <thead>
                    <tr><th>Instalment</th><th>Due Date</th><th>Principal</th><th>Interest</th><th>Total EMI</th><th>Payment Mode</th></tr>
                </thead>
                <tbody>${generateRepaymentSchedule()}</tbody>
            </table>
            <p style="font-size: 9px; color: #666; margin-top: 10px;">* All amounts are in Indian Rupees (INR). EMI will be auto-debited via eNACH/eMandate on the due date.</p>
        </div>

        <div class="notice">
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
                    <li><strong>Late Payment:</strong> Late fee of ₹500 and penal interest of 2% per day will apply on overdue amounts.</li>
                    <li><strong>Default & Recovery:</strong> Default may result in credit bureau reporting and legal action.</li>
                    <li><strong>Governing Law:</strong> This agreement is governed by Indian laws with jurisdiction in ${getValue(data.city) !== 'N/A' ? data.city : 'Mumbai'}.</li>
                </ol>
            </div>
        </div>

        <div class="declaration">
            <div class="declaration-title">BORROWER'S DECLARATION & CONSENT</div>
            <p style="margin-bottom: 15px;">I, <strong>${getValue(data.fullName)}</strong>, hereby declare that:</p>
            <div class="checkbox-item"><span class="checkbox"></span><span>All information provided is true and accurate.</span></div>
            <div class="checkbox-item"><span class="checkbox"></span><span>I agree to all terms and conditions mentioned in this agreement.</span></div>
            <div class="checkbox-item"><span class="checkbox"></span><span>I authorize Quikkred to verify my information and auto-debit EMI amounts.</span></div>
            <div class="checkbox-item"><span class="checkbox"></span><span>I understand non-payment will affect my credit score.</span></div>
        </div>

        <div class="signature-section">
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

        <div class="footer">
            <p><strong>Satsai Finlease Private Limited</strong> (trading as Quikkred)</p>
            <p>Email: support@quikkred.in | Website: www.quikkred.in</p>
            <div class="legal">
                <p>This is a computer-generated document valid without physical signature.</p>
                <p><strong>Generated:</strong> ${currentDate} ${currentTime}</p>
            </div>
        </div>

        <div class="approve-section" id="approve-section">
            <p style="font-size: 14px; color: #333; margin-bottom: 20px;">By clicking "I Agree & Approve", you confirm that you have read and understood all terms and conditions.</p>
            <button class="approve-btn" id="approve-btn" onclick="approveAgreement()">I Agree & Approve</button>
            <p style="font-size: 11px; color: #666; margin-top: 15px;">This will approve your data and redirect you back to the application form.</p>
            <div id="loading-indicator" style="display: none; margin-top: 20px;">
                <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #25B181; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 10px; color: #25B181; font-weight: bold;">Processing your agreement...</p>
            </div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        </div>
    </div>

    <script>
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

                // Hide approve section for PDF generation
                approveSection.style.display = 'none';

                // Convert HTML to PDF
                const element = document.querySelector('.page');
                const opt = {
                    margin: 10,
                    filename: 'loan-agreement.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');

                // Show approve section again
                approveSection.style.display = 'block';

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

                // Show approve section if hidden
                approveSection.style.display = 'block';
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
      requestedTenureUnit: 'days' // Products use days for tenure
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
      } else if (step === 3) {
        // Step 3: Bank Details
        payload = {
          bankDetails: {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            accountHolderName: formData.fullName,
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
          description: "Please fix the errors before moving to the next step.",
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

      // Data agreement checkbox validation
      if (!dataAgreementChecked) {
        toast({
          variant: "warning",
          title: "Data Review Required",
          description: "Please review and verify your application data before proceeding.",
        });
        return;
      }

      // Save Step 2 data (Aadhaar & PAN)
      setLoading(true);
      const saveSuccess = await saveCustomerData(2);
      setLoading(false);

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
      // Step 3: Bank Details & Consent Validation

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

        // Step 3 Final Submit - only bank details
        const principal = parseFloat(formData.loanAmount);
        const payload = {
          bankDetails: {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            accountHolderName: formData.fullName,
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
          // API returned error - show error and stay on step 3
          console.error('❌ Loan application failed:', result.message);
          toast({
            variant: "error",
            title: "Application Failed",
            description: result.message || "Failed to submit loan application. Please try again.",
          });
          setLoading(false);
          return; // Don't proceed, stay on step 3
        }
      } catch (error: any) {
        console.error('Error submitting loan application:', error);
        // Show error toast and stay on step 3
        toast({
          variant: "error",
          title: "Submission Error",
          description: error.message || "Network error occurred. Please check your connection and try again.",
        });
        setLoading(false);
        return; // Don't proceed, stay on step 3
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
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Quick Loan Application</h1>
            <p className="text-sm sm:text-base text-gray-600">Get instant approval in just 3 minutes</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 gap-2">
            {[1, 2, 3].map((step) => (
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

                {/* Data Agreement Checkbox */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="dataAgreement"
                      checked={dataAgreementChecked}
                      readOnly
                      onClick={async () => {
                        if (!dataAgreementChecked) {
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
                            accountHolderName: customerData.banks?.[0]?.accountHolderName || formData.fullName || customerData.fullName || '',
                            loanAmount: formData.loanAmount || '',
                            tenure: formData.tenure || '',
                            tenureUnit: formData.requestedTenureUnit || 'days',
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
                        }
                      }}
                      className="mt-1 w-5 h-5 text-[#25B181] border-gray-300 rounded focus:ring-[#25B181] cursor-pointer"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="dataAgreement"
                        className="block font-medium text-gray-900 cursor-pointer"
                        onClick={async () => {
                          if (!dataAgreementChecked) {
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
                              accountHolderName: customerData.banks?.[0]?.accountHolderName || formData.fullName || customerData.fullName || '',
                              loanAmount: formData.loanAmount || '',
                              tenure: formData.tenure || '',
                              tenureUnit: formData.requestedTenureUnit || 'days',
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
                          }
                        }}
                      >
                        I have reviewed and verified my application data *
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        {dataAgreementChecked
                          ? "You have approved your application data."
                          : "Click to review and approve your application data."}
                      </p>
                      {dataAgreementChecked && (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Data approved
                        </p>
                      )}
                    </div>
                  </div>
                </div>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          }}
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
                  </div>
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
