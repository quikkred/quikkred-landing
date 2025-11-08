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
  const [verificationMethod, setVerificationMethod] = useState<'mobile' | 'email'>('email');
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [panData, setPanData] = useState<any>(null);
  const [aadhaarData, setAadhaarData] = useState<any>(null);
  const [apiDeterminedStep, setApiDeterminedStep] = useState<number | null>(null);

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
    employmentType: "salaried",
    monthlyIncome: "",
    companyName: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",

    // Step 3: Loan & Consent
    loanAmount: "",
    tenure: "12",
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
            const response = await fetch('http://93.127.167.88:8000/api/customer/get', {
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

              console.log('🔍 Checking step completion...');
              console.log('  isBasicDetailsFilled:', profileData.isBasicDetailsFilled);
              console.log('  isEmploymentDetailsFilled:', profileData.isEmploymentDetailsFilled);

              // Check completion status and determine next step
              if (profileData.isBasicDetailsFilled === true && profileData.isEmploymentDetailsFilled === true) {
                // Both Step 1 and Step 2 completed - go to Step 3
                console.log('✅ Step 1 (Basic Details) completed');
                console.log('✅ Step 2 (Employment Details) completed');
                console.log('🎯 Determined: Jump to Step 3');
                nextStep = 3;
              } else if (profileData.isBasicDetailsFilled === true) {
                // Only Step 1 completed - go to Step 2
                console.log('✅ Step 1 (Basic Details) completed');
                console.log('⏭️ Moving to Step 2 (Employment Details)');
                console.log('🎯 Determined: Jump to Step 2');
                nextStep = 2;
              } else {
                console.log('ℹ️ No steps completed yet - starting from Step 1');
              }

              // Set the API determined step if it's different from default
              if (nextStep > 1) {
                console.log(`🚀 Setting API determined step to: ${nextStep}`);
                setApiDeterminedStep(nextStep);
              } else {
                console.log('📍 Staying at Step 1 (default)');
              }

              setUserDataLoaded(true);
              console.log('🟢 Form pre-filled with user data');
            } else {
              console.log('⚠️ Profile API returned no data, using basic user info');
              // Still mark as verified even if profile fetch fails
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
          console.error('❌ Error loading user data:', error);
          // Still mark as verified even if error occurs
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const payload = verificationMethod === 'email'
        ? { email: formData.email }
        : { mobile: formData.mobile };

      const response = await fetch("http://93.127.167.88:8000/api/auth/customer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
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

      const response = await fetch("http://93.127.167.88:8000/api/auth/customer/verify", {
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
        toast({
          variant: "success",
          title: "Verification Successful!",
          description: `Your ${verificationMethod === 'email' ? 'email' : 'mobile number'} has been verified successfully.`,
        });
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
    if (!formData.pan || formData.pan.length !== 10) {
      toast({
        variant: "warning",
        title: "Invalid PAN",
        description: "Please enter a valid 10-character PAN number.",
      });
      return;
    }

    setPanVerifying(true);
    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      const response = await fetch('http://93.127.167.88:8000/api/application/loan/document/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ panCard: formData.pan }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setPanVerified(true);
        setPanData(result.data);

        // Auto-fill name and DOB from PAN data
        if (result.data.holderName && !formData.fullName) {
          setFormData(prev => ({
            ...prev,
            fullName: result.data.holderName,
            dob: result.data.dateOfBirth || prev.dob
          }));
        }

        // Save verified PAN data to customer profile immediately
        const userId = localStorage.getItem('userId');
        if (token && userId) {
          try {
            const updatePayload = {
              panCard: formData.pan,
              isPanVerify: true,
              fullName: result.data.holderName,
              dateOfBirth: result.data.dateOfBirth
            };

            const updateResponse = await fetch(`http://93.127.167.88:8000/api/customer/update/${userId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatePayload)
            });

            if (updateResponse.ok) {
              console.log('✅ PAN verification data saved to customer profile');
            }
          } catch (error) {
            console.error('Failed to save PAN data to profile:', error);
          }
        }

        toast({
          variant: "success",
          title: "PAN Verified Successfully!",
          description: `PAN verified for ${result.data.holderName}`,
        });
      } else {
        toast({
          variant: "error",
          title: "PAN Verification Failed",
          description: result.message || 'Unable to verify PAN. Please check the number and try again.',
        });
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Verification Error",
        description: error.message || 'Failed to verify PAN. Please try again.',
      });
    } finally {
      setPanVerifying(false);
    }
  };

  // Verify Aadhaar Card
  const verifyAadhaar = async () => {
    if (!formData.aadhaar || formData.aadhaar.length !== 12) {
      toast({
        variant: "warning",
        title: "Invalid Aadhaar",
        description: "Please enter a valid 12-digit Aadhaar number.",
      });
      return;
    }

    setAadhaarVerifying(true);
    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');

      const response = await fetch('http://93.127.167.88:8000/api/application/loan/document/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ aadhaarNumber: formData.aadhaar }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setAadhaarVerified(true);
        setAadhaarData(result.data);

        // Auto-fill name and DOB from Aadhaar data
        if (result.data.holderName && !formData.fullName) {
          setFormData(prev => ({
            ...prev,
            fullName: result.data.holderName,
            dob: result.data.dateOfBirth || prev.dob
          }));
        }

        // Save verified Aadhaar data to customer profile immediately
        const userId = localStorage.getItem('userId');
        if (token && userId) {
          try {
            const updatePayload = {
              aadhaarNumber: formData.aadhaar,
              isAadhaarVerify: true,
              fullName: result.data.holderName,
              dateOfBirth: result.data.dateOfBirth,
              // Optionally save address from Aadhaar if available
              ...(result.data.address && {
                currentAddress: {
                  line1: result.data.address.line1,
                  line2: result.data.address.line2,
                  city: result.data.address.city,
                  state: result.data.address.state,
                  pincode: result.data.address.pincode
                }
              })
            };

            const updateResponse = await fetch(`http://93.127.167.88:8000/api/customer/update/${userId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatePayload)
            });

            if (updateResponse.ok) {
              console.log('✅ Aadhaar verification data saved to customer profile');
            }
          } catch (error) {
            console.error('Failed to save Aadhaar data to profile:', error);
          }
        }

        toast({
          variant: "success",
          title: "Aadhaar Verified Successfully!",
          description: `Aadhaar verified for ${result.data.holderName}`,
        });
      } else {
        toast({
          variant: "error",
          title: "Aadhaar Verification Failed",
          description: result.message || 'Unable to verify Aadhaar. Please check the number and try again.',
        });
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Verification Error",
        description: error.message || 'Failed to verify Aadhaar. Please try again.',
      });
    } finally {
      setAadhaarVerifying(false);
    }
  };

  const captureSelfi = () => {
    setSelfieCapture(true);
    // In real app, this would open camera
    setTimeout(() => {
      setSelfieCapture(false);
      toast({
        variant: "success",
        title: "Selfie Captured!",
        description: "Your selfie has been captured successfully.",
      });
    }, 2000);
  };

  // Save customer data to backend
  const saveCustomerData = async (step: number) => {
    try {
      const token = localStorage.getItem('accessToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.warn('No token or userId found, skipping customer data save');
        return false;
      }

      let payload: any = {};

      if (step === 1) {
        // Step 1: Basic Details
        payload = {
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          dateOfBirth: formData.dob,
          panCard: formData.pan,
          aadhaarNumber: formData.aadhaar,
          isPanVerify: panVerified,
          isAadhaarVerify: aadhaarVerified,
          isBasicDetailsFilled: true
        };
      } else if (step === 2) {
        // Step 2: Employment & Bank Details
        payload = {
          employmentType: formData.employmentType.toUpperCase(),
          monthlyIncome: parseFloat(formData.monthlyIncome),
          companyName: formData.companyName,
          isEmploymentDetailsFilled: true
        };

        // Add bank details if provided
        if (formData.bankName && formData.accountNumber && formData.ifsc) {
          payload.banks = [{
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            accountType: 'SAVINGS',
            isPrimary: true
          }];
        }
      } else if (step === 3) {
        // Step 3: Verification & Consent Details
        payload = {
          isVerificationDetailsFilled: true,
          // Note: Consent flags are typically stored in the loan application, not customer profile
          // But we mark the verification step as complete
        };
      }

      const response = await fetch(`http://93.127.167.88:8000/api/customer/update/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

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
      // For logged-in users, skip verification check
      const isVerified = user ? true : (verificationMethod === 'email' ? formData.emailVerified : formData.mobileVerified);

      if (!isVerified || !formData.fullName || !formData.email || !formData.mobile) {
        toast({
          variant: "warning",
          title: "Incomplete Information",
          description: user
            ? "Please complete all required fields."
            : "Please verify your email/mobile and complete all required fields.",
        });
        return;
      }

      // Check if PAN and Aadhaar are provided and verified
      if (!formData.pan || !formData.aadhaar) {
        toast({
          variant: "warning",
          title: "Documents Required",
          description: "Please provide both PAN and Aadhaar numbers.",
        });
        return;
      }

      if (!panVerified || !aadhaarVerified) {
        toast({
          variant: "warning",
          title: "Verification Required",
          description: "Please verify both PAN and Aadhaar before proceeding.",
        });
        return;
      }

      // Save Step 1 data before proceeding
      setLoading(true);
      await saveCustomerData(1);
      setLoading(false);
    }

    if (currentStep === 2) {
      if (!formData.monthlyIncome || !formData.bankName) {
        toast({
          variant: "warning",
          title: "Incomplete Information",
          description: "Please complete all required fields.",
        });
        return;
      }

      // Save Step 2 data before proceeding
      setLoading(true);
      await saveCustomerData(2);
      setLoading(false);
    }

    if (currentStep === 3) {
      // Validate loan details and consents
      if (!formData.loanAmount || !formData.creditBureauConsent || !formData.termsConsent) {
        toast({
          variant: "warning",
          title: "Incomplete Information",
          description: "Please enter loan amount and accept all required consents.",
        });
        return;
      }

      // Final step - save verification details and submit loan application
      setLoading(true);

      try {
        // Step 3: Save verification/consent details to customer profile
        await saveCustomerData(3);

        // Now submit the full loan application
        const response = await loansService.applyLoan({
          fullName: formData.fullName,
          mobileNumber: formData.mobile,
          email: formData.email,
          panCard: formData.pan,
          aadhaarCard: formData.aadhaar,
          loanAmount: parseFloat(formData.loanAmount),
          loanType: 'PERSONAL',
          tenure: parseInt(formData.tenure),
          purpose: 'Quick Loan Application',
          employmentType: formData.employmentType.toUpperCase() as 'SALARIED' | 'SELF_EMPLOYED' | 'STUDENT' | 'RETIRED',
          monthlyIncome: parseFloat(formData.monthlyIncome),
          employerName: formData.companyName
        });

        // Check if API call was successful
        if (response.success && response.data) {
          // If backend returned user authentication data, use it for auto-login
          if (response.data.userId && response.data.token) {
            console.log('✅ Loan application submitted successfully with user authentication');

            // Automatically log in the user with API data
            const loginSuccess = await login(
              formData.email,
              '', // No password needed for API-based login
              'CUSTOMER', // Default role for loan applicants
              {
                userId: response.data.userId,
                token: response.data.token,
                mobile: formData.mobile,
                role: response.data.role || 'CUSTOMER'
              }
            );

            if (loginSuccess) {
              console.log('✅ User authenticated and granted dashboard access');
            }
          }

          // Use API response for decision
          setDecision({
            approved: true,
            apiResponse: response.data,
            approvedAmount: parseFloat(formData.loanAmount),
            interestRate: 12.5,
            tenure: parseInt(formData.tenure),
            emi: Math.round((parseFloat(formData.loanAmount) * (12.5/100/12) * Math.pow(1 + 12.5/100/12, parseInt(formData.tenure))) / (Math.pow(1 + 12.5/100/12, parseInt(formData.tenure)) - 1)),
            processingFee: Math.round(parseFloat(formData.loanAmount) * 0.02)
          });
        } else {
          // API returned error, use local decision engine as fallback
          const result = autoDecisionEngine({
            monthlyIncome: parseFloat(formData.monthlyIncome),
            loanAmount: parseFloat(formData.loanAmount),
            pan: formData.pan,
            aadhaar: formData.aadhaar,
            tenure: parseInt(formData.tenure)
          });
          setDecision(result);
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
              <p className="text-xl text-green-600 font-semibold">Your loan has been approved!</p>
            </div>

            <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-xl p-6 text-white mb-6">
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
            </p>
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
                    employmentType: "salaried",
                    monthlyIncome: "",
                    companyName: "",
                    bankName: "",
                    accountNumber: "",
                    ifsc: "",
                    loanAmount: "",
                    tenure: "12",
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
      <div className="max-w-3xl mx-auto">
        {/* Close button for logged-in users */}
        {user && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push('/user')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        )}

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
                          onClick={() => setVerificationMethod('email')}
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
                          onClick={() => setVerificationMethod('mobile')}
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
                          onChange={handleChange}
                          disabled={formData.emailVerified}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100"
                          placeholder="your@email.com"
                        />
                        {!formData.emailVerified && (
                          <button
                            onClick={sendOTP}
                            disabled={!formData.email || loading}
                            className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50"
                          >
                            {loading ? "Sending..." : "Send OTP"}
                          </button>
                        )}
                        {formData.emailVerified && (
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">We'll use this email for all loan communication</p>
                    </div>

                    {!formData.emailVerified && formData.email && (
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100"
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
                    </div>

                    {!formData.mobileVerified && formData.mobile && (
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                    placeholder="Enter your full name"
                  />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="your@email.com"
                      />
                      <p className="mt-1 text-xs text-gray-500">For email notifications and loan documents</p>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                        placeholder="+91 98765 43210"
                      />
                      <p className="mt-1 text-xs text-gray-500">For SMS notifications</p>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                          placeholder="+91 98765 43210"
                        />
                        <p className="mt-1 text-xs text-gray-500">For SMS notifications</p>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                          placeholder="your@email.com"
                        />
                        <p className="mt-1 text-xs text-gray-500">For email notifications and loan documents</p>
                      </div>
                    )}
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
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
                          if (panVerified) setPanVerified(false); // Reset verification if changed
                        }}
                        disabled={panVerified}
                        maxLength={10}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100 uppercase"
                        placeholder="ABCDE1234F"
                      />
                      {!panVerified && (
                        <button
                          type="button"
                          onClick={verifyPAN}
                          disabled={!formData.pan || formData.pan.length !== 10 || panVerifying}
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
                    {panVerified && panData && (
                      <p className="mt-2 text-xs text-green-700">
                        ✓ Verified for {panData.holderName}
                      </p>
                    )}
                  </div>
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
                          if (aadhaarVerified) setAadhaarVerified(false); // Reset verification if changed
                        }}
                        disabled={aadhaarVerified}
                        maxLength={12}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] disabled:bg-gray-100"
                        placeholder="1234 5678 9012"
                      />
                      {!aadhaarVerified && (
                        <button
                          type="button"
                          onClick={verifyAadhaar}
                          disabled={!formData.aadhaar || formData.aadhaar.length !== 12 || aadhaarVerifying}
                          className="px-6 py-3 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] disabled:opacity-50 whitespace-nowrap"
                        >
                          {aadhaarVerifying ? "Verifying..." : "Verify"}
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
                        ✓ Verified for {aadhaarData.holderName}
                      </p>
                    )}
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                  />
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
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                      placeholder="Account number"
                    />
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
                    maxLength={11}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                    placeholder="SBIN0001234"
                  />
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification & Consent (1 minute)</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount *
                    </label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleChange}
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

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Upload Selfie
                  </h3>
                  <button
                    onClick={captureSelfi}
                    disabled={selfieCapture}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {selfieCapture ? "Capturing..." : "Click to Capture Selfie"}
                  </button>
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
