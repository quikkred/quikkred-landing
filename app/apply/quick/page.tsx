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

  const [formData, setFormData] = useState({
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
  });

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
                fullName: profileData.fullName || user.name || prev.fullName,
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
                mobileVerified: true, // Already logged in = verified
                emailVerified: true
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
                fullName: user.name || prev.fullName,
                mobile: user.mobile || prev.mobile,
                email: user.email || prev.email,
                mobileVerified: true,
                emailVerified: true
              }));
              setUserDataLoaded(true);
            }
          }
        } catch (error) {
          setFormData(prev => ({
            ...prev,
            fullName: user.name || prev.fullName,
            mobile: user.mobile || prev.mobile,
            email: user.email || prev.email,
            mobileVerified: true,
            emailVerified: true
          }));
          setUserDataLoaded(true);
        }
      }
    };

    if (!isLoading) {
      loadUserData();
    }
  }, [user, isLoading, userDataLoaded]);

  // Pre-fill data from hero section (for non-logged-in users)
  useEffect(() => {
    if (!user) {
      try {
        const heroData = localStorage.getItem('heroFormData');
        if (heroData) {
          const data = JSON.parse(heroData);
          setFormData(prev => ({
            ...prev,
            fullName: data.name || prev.fullName,
            mobile: data.mobile || prev.mobile,
            loanAmount: data.amount || prev.loanAmount,
            email: data.email || prev.email
          }));
          // Clear the localStorage after reading
          localStorage.removeItem('heroFormData');
        }
      } catch (error) {
        console.error('Error reading hero form data:', error);
      }
    }
  }, [user]);

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

  // Auto-redirect to dashboard after successful submission
  useEffect(() => {
    if (decision && decision.approved) {
      setRedirectCountdown(5); // Reset countdown
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/user');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [decision, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
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

    // Check if name and DOB are filled (from Aadhaar)
    // if (!formData.fullName || !formData.dob) {
    //   const errorMsg = "Please verify Aadhaar first to get name and date of birth.";
    //   setPanError(errorMsg);
    //   toast({
    //     variant: "warning",
    //     title: "Missing Information",
    //     description: errorMsg,
    //   });
    //   return;
    // }

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

      if (response.ok && result.success && result.data) {
        setPanVerified(true);
        setPanData(result.data);
        setPanError(""); // Clear any errors

        // Check verification status
        const panStatus = result.data.data?.status;
        const nameMatch = result.data.data?.name_as_per_pan_match;
        const dobMatch = result.data.data?.date_of_birth_match;

        if (panStatus === 'valid') {
          let description = 'PAN verification successful!';
          let warningMsg = '';

          if (!nameMatch) {
            warningMsg += 'Name does not match exactly with PAN records. ';
          }
          if (!dobMatch) {
            warningMsg += 'Date of birth does not match with PAN records.';
          }

          if (warningMsg) {
            setPanError(`⚠️ ${warningMsg}`);
          }

          toast({
            variant: nameMatch && dobMatch ? "success" : "warning",
            title: "PAN Verified!",
            description: warningMsg ? `${description} ${warningMsg}` : description,
          });
        } else {
          const errorMsg = 'PAN is not valid. Please check and try again.';
          setPanError(errorMsg);
          setPanVerified(false);
          toast({
            variant: "error",
            title: "PAN Verification Failed",
            description: errorMsg,
          });
        }
      } else {
        const errorMsg = result.message || 'Unable to verify PAN. Please check the number and try again.';
        setPanError(errorMsg);
        toast({
          variant: "error",
          title: "PAN Verification Failed",
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
          title: "Save Failed",
          description: result.message || "Failed to save your data. You can continue, but please try again later.",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error saving customer data:', error);
      toast({
        variant: "error",
        title: "Save Error",
        description: "Failed to save your data. You can continue, but please try again later.",
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
      } else {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile)) {
          errors.mobile = "Enter a valid 10-digit mobile number";
          hasError = true;
        }
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
        toast({
          variant: "warning",
          title: "Validation Errors",
          description: "Please fix the errors in the form before proceeding.",
        });
        return;
      }

      // Save Step 1 data before proceeding
      setLoading(true);
      await saveCustomerData(1);
      setLoading(false);
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
          toast({
            variant: "warning",
            title: "Invalid Account Number",
            description: "Account number must be 9-18 digits.",
          });
          return;
        }
      }

      // IFSC Code validation (if provided)
      if (formData.ifsc) {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(formData.ifsc.toUpperCase())) {
          toast({
            variant: "warning",
            title: "Invalid IFSC Code",
            description: "Please enter a valid IFSC code (e.g., SBIN0001234).",
          });
          return;
        }
      }

      // Save Step 2 data before proceeding
      setLoading(true);
      await saveCustomerData(2);
      setLoading(false);
    }

    if (currentStep === 3) {
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

      // Purpose validation
      if (!formData.purpose || formData.purpose.trim().length < 3) {
        toast({
          variant: "warning",
          title: "Purpose Required",
          description: "Please enter the purpose of loan (minimum 3 characters).",
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
        toast({
          variant: "warning",
          title: "Consent Required",
          description: "Please accept all required consents to proceed.",
        });
        return;
      }

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

        // Calculate EMI
        const principal = parseFloat(formData.loanAmount);
        const rate = 12.5 / 100 / 12; // 12.5% annual rate
        const tenureMonths = parseInt(formData.tenure);
        const emi = Math.round((principal * rate * Math.pow(1 + rate, tenureMonths)) / (Math.pow(1 + rate, tenureMonths) - 1));

        // Create FormData to include selfie file
        const formDataToSend = new FormData();

        // Add loan application data
        formDataToSend.append('loanAmount', principal.toString());
        formDataToSend.append('requestedTenure', tenureMonths.toString());
        formDataToSend.append('tenureUnit', 'months');
        formDataToSend.append('emiAmount', emi.toString());
        formDataToSend.append('purpose', formData.purpose);
        formDataToSend.append('isVerificationDetailsFilled', 'true');
        formDataToSend.append('isSubmit', 'true');

        // Add references as JSON string
        formDataToSend.append('references', JSON.stringify([
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
        ]));

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
            tenure: tenureMonths,
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
            tenure: tenureMonths
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
                  Redirecting to dashboard in <span className="font-bold text-[#25B181] text-lg">{redirectCountdown}</span> seconds...
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/user')}
                className="flex-1 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Go to Dashboard Now
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
                  <p className="text-xl font-semibold">{decision.interestRate}% p.a.</p>
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

    {/* Send OTP button (only if not verified) */}
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
        disabled={!formData.email || !!fieldErrors.email || loading}
        className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send OTP"}
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
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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
                          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 ${
                            fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {!formData.mobileVerified && (
                          <button
                            onClick={sendOTP}
                            disabled={!formData.mobile || loading}
                            className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50"
                          >
                            {loading ? "Sending..." : "Send OTP"}
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
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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
                        disabled={formData.emailVerified || !!formData.email}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                          fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                        } ${(formData.emailVerified || !!formData.email) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                        type="text"
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
                        disabled={aadhaarVerified || aadhaarOtpSent}
                        maxLength={12}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 ${
                          fieldErrors.aadhaar || aadhaarError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1234 5678 9012"
                      />
                      {!aadhaarVerified && !aadhaarOtpSent && (
                        <button
                          type="button"
                          onClick={sendAadhaarOTP}
                          disabled={!formData.aadhaar || formData.aadhaar.length !== 12 || aadhaarVerifying}
                          className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap"
                        >
                          {aadhaarVerifying ? "Sending..." : "Send OTP"}
                        </button>
                      )}
                      {aadhaarVerified && (
                        <div className="flex items-center gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">Verified</span>
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
                        <p className="mt-1 text-xs text-gray-500">
                          OTP sent to Aadhaar-linked mobile number
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
                        <div className="flex items-center gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">Verified</span>
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
                      type="text"
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
                    {fieldErrors.accountNumber && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.accountNumber}</p>
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
                    onChange={(e) => {
                      const upperValue = e.target.value.toUpperCase();
                      handleChange({ ...e, target: { ...e.target, name: 'ifsc', value: upperValue } });
                    }}
                    pattern="[A-Z]{4}0[A-Z0-9]{6}"
                    maxLength={11}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#25B181] ${
                      fieldErrors.ifsc ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SBIN0001234"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {fieldErrors.ifsc && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.ifsc}</p>
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
                      Tenure (months) *
                    </label>
                    <select
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                    >
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose of Loan *
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                    placeholder="e.g., Home Renovation, Medical Emergency, Education"
                  />
                </div>

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
                        type="tel"
                        name="reference1Mobile"
                        value={formData.reference1Mobile}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="9876543210"
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
                        type="tel"
                        name="reference2Mobile"
                        value={formData.reference2Mobile}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="9876543210"
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
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="creditBureauConsent"
                      checked={formData.creditBureauConsent}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I authorize Quikkred to pull my credit bureau report
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="termsConsent"
                      checked={formData.termsConsent}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms & Conditions and Privacy Policy
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
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
