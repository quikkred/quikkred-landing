"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Briefcase, FileText, CreditCard, CheckCircle,
  ArrowRight, ArrowLeft, Upload, Building, Phone,
  Mail, MapPin, Calendar, IndianRupee, Shield,
  AlertCircle, ChevronRight, Loader2
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { loansService } from "@/lib/api";
import { useToast, Toaster } from "@/components/ui/toast";

const steps = [
  { id: 1, title: "Verification", icon: Shield },
  { id: 2, title: "Personal Details", icon: User },
  { id: 3, title: "Employment Info", icon: Briefcase },
  { id: 4, title: "Documents", icon: FileText },
  { id: 5, title: "Loan Details", icon: CreditCard },
  { id: 6, title: "Review & Submit", icon: CheckCircle }
];

export default function ApplyPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verification states
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [verifying, setVerifying] = useState({ email: false, phone: false });
  const [userId, setUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [savingPersonalDetails, setSavingPersonalDetails] = useState(false);
  const [savingEmploymentInfo, setSavingEmploymentInfo] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({
    pan: false,
    aadhar: false,
    salarySlip: false,
    bankStatement: false
  });
  const [uploadingStatus, setUploadingStatus] = useState({
    panCard: false,
    aadhaarCard: false,
    salarySlips: false,
    bankStatement: false
  });

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    pan: "",
    aadhaar: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Employment Info
    employmentType: "salaried",
    companyName: "",
    designation: "",
    monthlyIncome: "",
    workEmail: "",
    officeAddress: "",
    employmentYears: "",

    // Documents
    panCard: null,
    aadhaarCard: null,
    salarySlips: null,
    bankStatement: null,

    // Loan Details
    loanAmount: "",
    loanPurpose: "",
    tenure: "1",

    // Agreement
    termsAccepted: false
  });

  // Pre-fill form with data from hero section
  useEffect(() => {
    const heroFormDataStr = localStorage.getItem('heroFormData');
    if (heroFormDataStr) {
      try {
        const heroData = JSON.parse(heroFormDataStr);

        // Pre-fill the form fields
        setFormData(prev => ({
          ...prev,
          fullName: heroData.name || '',
          email: heroData.email || '',
          phone: heroData.mobile || '',
          loanAmount: String(heroData.amount || '')
        }));

        // Clear localStorage after pre-filling
        localStorage.removeItem('heroFormData');
      } catch (error) {
        console.error('Error parsing hero form data:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (1MB max)
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        toast({
          variant: "error",
          title: "File Too Large",
          description: "File size exceeds 1MB. Please upload a smaller file."
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  // Upload document to API
  const uploadDocument = async (file: File, fieldName: string) => {
    // Map form field names to API field names
    const fieldMapping: { [key: string]: string } = {
      'panCard': 'pan',
      'aadhaarCard': 'aadhar',
      'salarySlips': 'salarySlip',
      'bankStatement': 'bankStatement'
    };

    const apiFieldName = fieldMapping[fieldName] || fieldName;

    // Set uploading status
    setUploadingStatus(prev => ({
      ...prev,
      [fieldName]: true
    }));

    try {
      // Get token from state or localStorage
      const token = authToken || localStorage.getItem('authToken');

      if (!token) {
        setUploadingStatus(prev => ({
          ...prev,
          [fieldName]: false
        }));
        throw new Error("Authentication token missing");
      }

      const uploadFormData = new FormData();
      uploadFormData.append(apiFieldName, file);

      console.log(`Uploading ${apiFieldName}...`, file.name, file.size, file.type);

      const response = await fetch("https://api.bluechipfinmax.com/api/document/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();
      console.log(`Upload response for ${apiFieldName}:`, data);

      if (response.ok && data.success) {
        // Mark document as uploaded
        setUploadedDocs(prev => ({
          ...prev,
          [apiFieldName]: true
        }));
        setUploadingStatus(prev => ({
          ...prev,
          [fieldName]: false
        }));
        return true;
      } else {
        setUploadingStatus(prev => ({
          ...prev,
          [fieldName]: false
        }));
        throw new Error(data.message || `Failed to upload ${apiFieldName}`);
      }
    } catch (error) {
      console.error(`Error uploading ${apiFieldName}:`, error);
      setUploadingStatus(prev => ({
        ...prev,
        [fieldName]: false
      }));
      throw error;
    }
  };

  // Upload all documents in one API call when user clicks Next on step 4
  const uploadAllDocuments = async () => {
    setUploadingDocuments(true);

    // Set all uploading statuses to true
    setUploadingStatus({
      panCard: !!formData.panCard,
      aadhaarCard: !!formData.aadhaarCard,
      salarySlips: !!formData.salarySlips,
      bankStatement: !!formData.bankStatement
    });

    try {
      // Get token from state or localStorage
      const token = authToken || localStorage.getItem('authToken');

      if (!token) {
        throw new Error("Authentication token missing");
      }

      // Create FormData with all documents
      const uploadFormData = new FormData();

      if (formData.panCard) {
        uploadFormData.append('pan', formData.panCard as File);
      }
      if (formData.aadhaarCard) {
        uploadFormData.append('aadhar', formData.aadhaarCard as File);
      }
      if (formData.salarySlips) {
        uploadFormData.append('salarySlip', formData.salarySlips as File);
      }
      if (formData.bankStatement) {
        uploadFormData.append('bankStatement', formData.bankStatement as File);
      }

      console.log('Uploading all documents in one request...');

      const response = await fetch("https://api.bluechipfinmax.com/api/document/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (response.ok && data.success) {
        // Mark all uploaded documents as successful
        setUploadedDocs({
          pan: !!formData.panCard,
          aadhar: !!formData.aadhaarCard,
          salarySlip: !!formData.salarySlips,
          bankStatement: !!formData.bankStatement
        });

        toast({
          variant: "success",
          title: "Success",
          description: data.message || "All documents uploaded successfully."
        });
        return true;
      } else {
        throw new Error(data.message || "Failed to upload documents");
      }
    } catch (error: any) {
      console.error("Error uploading documents:", error);
      toast({
        variant: "error",
        title: "Upload Failed",
        description: error.message || "Failed to upload documents. Please try again."
      });
      return false;
    } finally {
      setUploadingDocuments(false);
      // Reset uploading statuses
      setUploadingStatus({
        panCard: false,
        aadhaarCard: false,
        salarySlips: false,
        bankStatement: false
      });
    }
  };

  // Load auth token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
    }

    // Load userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    // Load verified user data from localStorage
    const verifiedUserData = localStorage.getItem('verifiedUser');
    if (verifiedUserData) {
      try {
        const verifiedUser = JSON.parse(verifiedUserData);
        setFormData(prev => ({
          ...prev,
          email: verifiedUser.email || prev.email,
          phone: verifiedUser.mobile || prev.phone
        }));

        // Set verification method based on verifiedBy
        if (verifiedUser.verifiedBy === 'email') {
          setVerificationMethod('email');
          setEmailVerified(true);
        } else if (verifiedUser.verifiedBy === 'phone') {
          setVerificationMethod('phone');
          setPhoneVerified(true);
        }
      } catch (error) {
        console.error("Error parsing verifiedUser data:", error);
      }
    }
  }, []);

  // Email verification functions
  const sendEmailOtp = async () => {
    if (!formData.email) {
      toast({
        variant: "warning",
        title: "Email Required",
        description: "Please enter your email address"
      });
      return;
    }
    setVerifying(prev => ({ ...prev, email: true }));

    try {
      const payload: any = { email: formData.email };

      // If phone is already verified, include userId and mobile
      if (userId && phoneVerified && formData.phone) {
        payload.userId = userId;
        payload.mobile = formData.phone;
      }

      const response = await fetch("https://api.bluechipfinmax.com/api/auth/customer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailOtpSent(true);

        // Store userId if this is the first verification
        if (data.data?.userId && !userId) {
          setUserId(data.data.userId);
        }

        toast({
          variant: "success",
          title: "Success",
          description: data.message || "OTP has been sent to your email address."
        });
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: data.message || "Failed to send OTP. Please try again."
        });
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      toast({
        variant: "error",
        title: "Connection Error",
        description: "Failed to send OTP. Please check your connection."
      });
    } finally {
      setVerifying(prev => ({ ...prev, email: false }));
    }
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp) {
      toast({
        variant: "warning",
        title: "OTP Required",
        description: "Please enter the OTP"
      });
      return;
    }
    setVerifying(prev => ({ ...prev, email: true }));

    try {
      const response = await fetch("https://api.bluechipfinmax.com/api/auth/customer/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: emailOtp,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailVerified(true);
        setEmailOtpSent(false);
        setEmailOtp("");

        // Store auth token from response
        if (data.token) {
          setAuthToken(data.token);
          localStorage.setItem('authToken', data.token);
        } else if (data.data?.token) {
          setAuthToken(data.data.token);
          localStorage.setItem('authToken', data.data.token);
        }

        // Save verified user data to localStorage
        const verifiedUser = {
          email: formData.email,
          mobile: formData.phone || "",
          verifiedBy: 'email'
        };
        localStorage.setItem('verifiedUser', JSON.stringify(verifiedUser));

        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Your email has been verified successfully."
        });
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: data.message || "Invalid OTP. Please try again."
        });
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      toast({
        variant: "error",
        title: "Verification Failed",
        description: "Failed to verify OTP. Please try again."
      });
    } finally {
      setVerifying(prev => ({ ...prev, email: false }));
    }
  };

  // Phone verification functions
  const sendPhoneOtp = async () => {
    if (!formData.phone) {
      toast({
        variant: "warning",
        title: "Phone Required",
        description: "Please enter your phone number"
      });
      return;
    }
    setVerifying(prev => ({ ...prev, phone: true }));

    try {
      const payload: any = { mobile: formData.phone };

      // If email is already verified, include userId and email
      if (userId && emailVerified && formData.email) {
        payload.userId = userId;
        payload.email = formData.email;
      }

      const response = await fetch("https://api.bluechipfinmax.com/api/auth/customer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPhoneOtpSent(true);

        // Store userId if this is the first verification
        if (data.data?.userId && !userId) {
          setUserId(data.data.userId);
        }

        toast({
          variant: "success",
          title: "Success",
          description: data.message || "OTP has been sent to your phone number."
        });
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: data.message || "Failed to send OTP. Please try again."
        });
      }
    } catch (error) {
      console.error("Error sending phone OTP:", error);
      toast({
        variant: "error",
        title: "Connection Error",
        description: "Failed to send OTP. Please check your connection."
      });
    } finally {
      setVerifying(prev => ({ ...prev, phone: false }));
    }
  };

  const verifyPhoneOtp = async () => {
    if (!phoneOtp) {
      toast({
        variant: "warning",
        title: "OTP Required",
        description: "Please enter the OTP"
      });
      return;
    }
    setVerifying(prev => ({ ...prev, phone: true }));

    try {
      const response = await fetch("https://api.bluechipfinmax.com/api/auth/customer/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: formData.phone,
          otp: phoneOtp,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPhoneVerified(true);
        setPhoneOtpSent(false);
        setPhoneOtp("");

        // Store auth token from response
        if (data.token) {
          setAuthToken(data.token);
          localStorage.setItem('authToken', data.token);
        } else if (data.data?.token) {
          setAuthToken(data.data.token);
          localStorage.setItem('authToken', data.data.token);
        }

        // Save verified user data to localStorage
        const verifiedUser = {
          email: formData.email || "",
          mobile: formData.phone,
          verifiedBy: 'phone'
        };
        localStorage.setItem('verifiedUser', JSON.stringify(verifiedUser));

        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Your phone number has been verified successfully."
        });
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: data.message || "Invalid OTP. Please try again."
        });
      }
    } catch (error) {
      console.error("Error verifying phone OTP:", error);
      toast({
        variant: "error",
        title: "Verification Failed",
        description: "Failed to verify OTP. Please try again."
      });
    } finally {
      setVerifying(prev => ({ ...prev, phone: false }));
    }
  };

  // Submit personal details to API
  const submitPersonalDetails = async () => {
    // Validation
    if (!formData.email || !formData.phone || !formData.fullName || !formData.dob ||
        !formData.pan || !formData.aadhaar || !formData.address || !formData.city ||
        !formData.state || !formData.pincode) {
      toast({
        variant: "warning",
        title: "Incomplete Form",
        description: "Please fill in all required fields."
      });
      return false;
    }

    setSavingPersonalDetails(true);
    try {
      // Split fullName into firstName, middleName, lastName
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

      // Split address into line1 and line2 (by line breaks or after certain length)
      const addressLines = formData.address.trim().split('\n');
      const line1 = addressLines[0] || formData.address.substring(0, 100);
      const line2 = addressLines.length > 1 ? addressLines.slice(1).join(', ') : "";

      const payload = {
        email: formData.email,
        mobile: formData.phone,
        firstName,
        middleName,
        lastName,
        dateOfBirth: formData.dob,
        panNumber: formData.pan.toUpperCase(),
        aadhaarNumber: formData.aadhaar.replace(/\s/g, ''),
        currentAddress: {
          line1,
          line2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      // Get token from state or localStorage
      const token = authToken || localStorage.getItem('authToken');

      if (!token) {
        toast({
          variant: "error",
          title: "Authentication Required",
          description: "Authentication token missing. Please verify your email or phone first."
        });
        return false;
      }

      const response = await fetch("https://api.bluechipfinmax.com/api/customer/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store userId from response if available
        if (data.data?.id) {
          setUserId(data.data.id);
          localStorage.setItem('userId', data.data.id);
        }
        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Personal details saved successfully."
        });
        return true;
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: data.message || "Failed to save personal details. Please try again."
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      toast({
        variant: "error",
        title: "Connection Error",
        description: "Failed to save personal details. Please check your connection."
      });
      return false;
    } finally {
      setSavingPersonalDetails(false);
    }
  };

  // Submit employment information to API
  const submitEmploymentInfo = async () => {
    // Validation
    if (!formData.employmentType || !formData.companyName || !formData.designation ||
        !formData.monthlyIncome || !formData.employmentYears) {
      toast({
        variant: "warning",
        title: "Incomplete Form",
        description: "Please fill in all required employment fields."
      });
      return false;
    }

    // Get user ID
    const currentUserId = userId || localStorage.getItem('userId');
    if (!currentUserId) {
      toast({
        variant: "error",
        title: "User ID Missing",
        description: "User ID not found. Please complete previous steps first."
      });
      return false;
    }

    setSavingEmploymentInfo(true);
    try {
      // Convert employmentYears string to number
      let yearsInCurrentJob = 0;
      if (formData.employmentYears === "<1") {
        yearsInCurrentJob = 0;
      } else if (formData.employmentYears === "1-2") {
        yearsInCurrentJob = 1;
      } else if (formData.employmentYears === "2-5") {
        yearsInCurrentJob = 2;
      } else if (formData.employmentYears === "5+") {
        yearsInCurrentJob = 5;
      } else {
        yearsInCurrentJob = parseInt(formData.employmentYears) || 0;
      }

      const payload = {
        user: currentUserId,
        employmentType: formData.employmentType === "salaried" ? "SALARIED" : "SELF_EMPLOYED",
        companyName: formData.companyName,
        designation: formData.designation,
        workEmail: formData.workEmail || "",
        monthlyIncome: parseFloat(formData.monthlyIncome),
        yearsInCurrentJob,
        officeAddress: formData.officeAddress || ""
      };

      // Get token from state or localStorage
      const token = authToken || localStorage.getItem('authToken');

      if (!token) {
        toast({
          variant: "error",
          title: "Authentication Required",
          description: "Authentication token missing. Please verify your email or phone first."
        });
        return false;
      }

      const response = await fetch("https://api.bluechipfinmax.com/api/employment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Employment information saved successfully."
        });
        return true;
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: data.message || "Failed to save employment information. Please try again."
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving employment information:", error);
      toast({
        variant: "error",
        title: "Connection Error",
        description: "Failed to save employment information. Please check your connection."
      });
      return false;
    } finally {
      setSavingEmploymentInfo(false);
    }
  };

  const nextStep = async () => {
    // Validate verification on step 1 based on selected method
    if (currentStep === 1) {
      if (verificationMethod === 'email' && !emailVerified) {
        toast({
          variant: "warning",
          title: "Verification Required",
          description: "Please verify your email address before proceeding."
        });
        return;
      }
      if (verificationMethod === 'phone' && !phoneVerified) {
        toast({
          variant: "warning",
          title: "Verification Required",
          description: "Please verify your phone number before proceeding."
        });
        return;
      }
    }

    // Submit personal details on step 2
    if (currentStep === 2) {
      const success = await submitPersonalDetails();
      if (!success) return;
    }

    // Submit employment information on step 3
    if (currentStep === 3) {
      const success = await submitEmploymentInfo();
      if (!success) return;
    }

    // Validate and upload documents on step 4
    if (currentStep === 4) {
      // Check if required documents are selected
      if (!formData.panCard || !formData.aadhaarCard || !formData.salarySlips) {
        toast({
          variant: "warning",
          title: "Documents Required",
          description: "Please select all required documents (PAN Card, Aadhaar Card, and Salary Slips)."
        });
        return;
      }

      // Upload all documents
      const success = await uploadAllDocuments();
      if (!success) return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate that required documents are uploaded
    if (!uploadedDocs.pan || !uploadedDocs.aadhar || !uploadedDocs.salarySlip) {
      toast({
        variant: "warning",
        title: "Documents Required",
        description: "Please upload all required documents before submitting."
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare loan application data
      const applicationData = {
        loanType: "PAY-DAY" as const,
        requestedAmount: parseFloat(formData.loanAmount),
        interestRate: 12.5,
        processingFee: Math.round(parseFloat(formData.loanAmount) * 0.02), // 2% of loan amount
        tenure: parseInt(formData.tenure)
      };

      // Get token from state or localStorage
      const token = authToken || localStorage.getItem('authToken');

      if (!token) {
        toast({
          variant: "error",
          title: "Authentication Required",
          description: "Authentication token missing. Please verify your email or phone first."
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting loan application:', applicationData);

      const response = await fetch("https://api.bluechipfinmax.com/api/loans/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();
      console.log('Loan application response:', data);

      if (response.ok && data.success) {
        // Store application details for tracking
        if (data.data?.id) {
          localStorage.setItem('lastApplicationId', data.data.id);
        }
        if (data.data?.loanNumber) {
          localStorage.setItem('lastLoanNumber', data.data.loanNumber);
        }

        // Show success message
        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Loan application submitted successfully. Redirecting to dashboard..."
        });

        // Redirect to dashboard or success page
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(data.message || 'Failed to submit application. Please try again.');
        toast({
          variant: "error",
          title: "Error",
          description: data.message || 'Failed to submit application. Please try again.'
        });
      }
    } catch (err: any) {
      console.error('Application submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      toast({
        variant: "error",
        title: "Error",
        description: err.message || 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold font-sora mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] bg-clip-text text-transparent">{t.application?.title || "Apply for Instant Loan"}</h1>
          <p className="text-xl text-gray-700">
            {"Complete your application in 5 minutes"}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-[#34d399] to-[#10b981] text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 ml-2 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-[#34d399] to-[#10b981]'
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
                <p className="text-sm mt-2 font-medium">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Verification */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Email & Phone Verification</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        Please choose your preferred verification method and complete the verification to proceed with your loan application.
                      </p>
                    </div>
                  </div>

                  {/* Verification Method Selection */}
                  <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Choose Verification Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setVerificationMethod('email')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          verificationMethod === 'email'
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Mail className={`w-6 h-6 mx-auto mb-2 ${
                          verificationMethod === 'email' ? 'text-emerald-600' : 'text-gray-600'
                        }`} />
                        <p className="font-medium text-center">Email Only</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVerificationMethod('phone')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          verificationMethod === 'phone'
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Phone className={`w-6 h-6 mx-auto mb-2 ${
                          verificationMethod === 'phone' ? 'text-emerald-600' : 'text-gray-600'
                        }`} />
                        <p className="font-medium text-center">Phone Only</p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Email Verification - Show if email is selected */}
                    {verificationMethod === 'email' && (
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          {t.application.fields?.email || "Email Address"}
                          {emailVerified && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={emailVerified}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white disabled:bg-gray-100"
                            placeholder={t.application.placeholders?.email || "your@email.com"}
                            required
                          />
                          {!emailVerified && !emailOtpSent && (
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              disabled={!formData.email || verifying.email}
                              className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm font-medium"
                            >
                              {verifying.email ? "Sending..." : "Send OTP"}
                            </button>
                          )}
                        </div>
                        {emailOtpSent && !emailVerified && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 flex gap-2"
                          >
                            <input
                              type="text"
                              value={emailOtp}
                              onChange={(e) => setEmailOtp(e.target.value)}
                              maxLength={6}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="Enter 6-digit OTP"
                            />
                            <button
                              type="button"
                              onClick={verifyEmailOtp}
                              disabled={verifying.email || emailOtp.length !== 6}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              {verifying.email ? "Verifying..." : "Verify"}
                            </button>
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              disabled={verifying.email}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                              Resend
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Phone Verification - Show if phone is selected */}
                    {verificationMethod === 'phone' && (
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          {t.application.fields?.mobile || "Phone Number"}
                          {phoneVerified && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={phoneVerified}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white disabled:bg-gray-100"
                            placeholder={t.application.placeholders?.mobile || "+91 98765 43210"}
                            required
                          />
                          {!phoneVerified && !phoneOtpSent && (
                            <button
                              type="button"
                              onClick={sendPhoneOtp}
                              disabled={!formData.phone || verifying.phone}
                              className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm font-medium"
                            >
                              {verifying.phone ? "Sending..." : "Send OTP"}
                            </button>
                          )}
                        </div>
                        {phoneOtpSent && !phoneVerified && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 flex gap-2"
                          >
                            <input
                              type="text"
                              value={phoneOtp}
                              onChange={(e) => setPhoneOtp(e.target.value)}
                              maxLength={6}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="Enter 6-digit OTP"
                            />
                            <button
                              type="button"
                              onClick={verifyPhoneOtp}
                              disabled={verifying.phone || phoneOtp.length !== 6}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              {verifying.phone ? "Verifying..." : "Verify"}
                            </button>
                            <button
                              type="button"
                              onClick={sendPhoneOtp}
                              disabled={verifying.phone}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                              Resend
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800">
                        Your contact information is secured with 256-bit encryption.
                        We will use this to communicate about your loan application.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">{t.application.steps?.personal || "Personal Information"}</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Mobile Number Field */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mobile Number *
                        {verificationMethod === 'phone' && (
                          <span className="text-xs text-green-600 ml-2">(Verified)</span>
                        )}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={verificationMethod === 'phone'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    {/* Email Address Field */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                        {verificationMethod === 'email' && (
                          <span className="text-xs text-green-600 ml-2">(Verified)</span>
                        )}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={verificationMethod === 'email'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.application.fields?.fullName || "Full Name"} *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder={t.application.placeholders?.fullName || "Enter your full name"}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">PAN Number *</label>
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="ABCDE1234F"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Aadhaar Number *</label>
                      <input
                        type="text"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="1234 5678 9012"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Current Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)]"
                      rows={3}
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="Mumbai"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="MH">Maharashtra</option>
                        <option value="DL">Delhi</option>
                        <option value="KA">Karnataka</option>
                        <option value="TN">Tamil Nadu</option>
                        <option value="GJ">Gujarat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="400001"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Employment Info */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Employment Information</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Employment Type *</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)]"
                      required
                    >
                      <option value="salaried">Salaried Employee</option>
                      <option value="self-employed">Self Employed</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name *</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="Your Company Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Designation *</label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="Your Job Title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Monthly Income *</label>
                      <input
                        type="number"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="₹ 50,000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Work Email</label>
                      <input
                        type="email"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="work@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Years in Current Job *</label>
                      <select
                        name="employmentYears"
                        value={formData.employmentYears}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        required
                      >
                        <option value="">Select Years</option>
                        <option value="<1">Less than 1 year</option>
                        <option value="1-2">1-2 years</option>
                        <option value="2-5">2-5 years</option>
                        <option value="5+">More than 5 years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Office Address</label>
                    <textarea
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)]"
                      rows={3}
                      placeholder="Enter your office address"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Upload Documents</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        Please upload clear, readable copies of your documents in PDF, JPG, or PNG format.
                        Maximum file size: 1MB per document.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm 
                      font-medium mb-2">PAN Card *</label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        uploadedDocs.pan
                          ? 'border-green-500 bg-green-50'
                          : uploadingStatus.panCard
                          ? 'border-blue-500 bg-blue-50'
                          : formData.panCard
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-300 bg-gray-50 hover:border-[#34d399] hover:bg-gray-100'
                      }`}>
                        {uploadingStatus.panCard ? (
                          <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin" />
                        ) : uploadedDocs.pan ? (
                          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                        ) : formData.panCard ? (
                          <FileText className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
                        ) : (
                          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'panCard')}
                          className="hidden"
                          id="panCard"
                          accept=".pdf,.jpg,.jpeg,.png"
                          disabled={uploadingStatus.panCard}
                        />
                        <label htmlFor="panCard" className={uploadingStatus.panCard ? "cursor-not-allowed" : "cursor-pointer"}>
                          <p className="text-sm text-gray-700 font-medium">
                            {uploadingStatus.panCard
                              ? 'Uploading...'
                              : uploadedDocs.pan
                              ? 'PAN Card uploaded ✓'
                              : formData.panCard
                              ? `Selected: ${(formData.panCard as File).name}`
                              : 'Click to upload PAN Card'}
                          </p>
                          {formData.panCard && !uploadedDocs.pan && (
                            <p className="text-xs text-gray-500 mt-1">
                              {((formData.panCard as File).size / 1024).toFixed(2)} KB
                            </p>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Aadhaar Card *</label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        uploadedDocs.aadhar
                          ? 'border-green-500 bg-green-50'
                          : uploadingStatus.aadhaarCard
                          ? 'border-blue-500 bg-blue-50'
                          : formData.aadhaarCard
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-300 bg-gray-50 hover:border-[#34d399] hover:bg-gray-100'
                      }`}>
                        {uploadingStatus.aadhaarCard ? (
                          <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin" />
                        ) : uploadedDocs.aadhar ? (
                          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                        ) : formData.aadhaarCard ? (
                          <FileText className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
                        ) : (
                          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'aadhaarCard')}
                          className="hidden"
                          id="aadhaarCard"
                          accept=".pdf,.jpg,.jpeg,.png"
                          disabled={uploadingStatus.aadhaarCard}
                        />
                        <label htmlFor="aadhaarCard" className={uploadingStatus.aadhaarCard ? "cursor-not-allowed" : "cursor-pointer"}>
                          <p className="text-sm text-gray-700 font-medium">
                            {uploadingStatus.aadhaarCard
                              ? 'Uploading...'
                              : uploadedDocs.aadhar
                              ? 'Aadhaar Card uploaded ✓'
                              : formData.aadhaarCard
                              ? `Selected: ${(formData.aadhaarCard as File).name}`
                              : 'Click to upload Aadhaar Card'}
                          </p>
                          {formData.aadhaarCard && !uploadedDocs.aadhar && (
                            <p className="text-xs text-gray-500 mt-1">
                              {((formData.aadhaarCard as File).size / 1024).toFixed(2)} KB
                            </p>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Salary Slips (Last 3 months) *</label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        uploadedDocs.salarySlip
                          ? 'border-green-500 bg-green-50'
                          : uploadingStatus.salarySlips
                          ? 'border-blue-500 bg-blue-50'
                          : formData.salarySlips
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-300 bg-gray-50 hover:border-[#34d399] hover:bg-gray-100'
                      }`}>
                        {uploadingStatus.salarySlips ? (
                          <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin" />
                        ) : uploadedDocs.salarySlip ? (
                          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                        ) : formData.salarySlips ? (
                          <FileText className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
                        ) : (
                          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'salarySlips')}
                          className="hidden"
                          id="salarySlips"
                          accept=".pdf,.jpg,.jpeg,.png"
                          multiple
                          disabled={uploadingStatus.salarySlips}
                        />
                        <label htmlFor="salarySlips" className={uploadingStatus.salarySlips ? "cursor-not-allowed" : "cursor-pointer"}>
                          <p className="text-sm text-gray-700 font-medium">
                            {uploadingStatus.salarySlips
                              ? 'Uploading...'
                              : uploadedDocs.salarySlip
                              ? 'Salary Slips uploaded ✓'
                              : formData.salarySlips
                              ? `Selected: ${(formData.salarySlips as File).name}`
                              : 'Click to upload Salary Slips'}
                          </p>
                          {formData.salarySlips && !uploadedDocs.salarySlip && (
                            <p className="text-xs text-gray-500 mt-1">
                              {((formData.salarySlips as File).size / 1024).toFixed(2)} KB
                            </p>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bank Statement (6 months)</label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        uploadedDocs.bankStatement
                          ? 'border-green-500 bg-green-50'
                          : uploadingStatus.bankStatement
                          ? 'border-blue-500 bg-blue-50'
                          : formData.bankStatement
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-300 bg-gray-50 hover:border-[#34d399] hover:bg-gray-100'
                      }`}>
                        {uploadingStatus.bankStatement ? (
                          <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin" />
                        ) : uploadedDocs.bankStatement ? (
                          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                        ) : formData.bankStatement ? (
                          <FileText className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
                        ) : (
                          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'bankStatement')}
                          className="hidden"
                          id="bankStatement"
                          accept=".pdf"
                          disabled={uploadingStatus.bankStatement}
                        />
                        <label htmlFor="bankStatement" className={uploadingStatus.bankStatement ? "cursor-not-allowed" : "cursor-pointer"}>
                          <p className="text-sm text-gray-700 font-medium">
                            {uploadingStatus.bankStatement
                              ? 'Uploading...'
                              : uploadedDocs.bankStatement
                              ? 'Bank Statement uploaded ✓'
                              : formData.bankStatement
                              ? `Selected: ${(formData.bankStatement as File).name}`
                              : 'Click to upload Bank Statement'}
                          </p>
                          {formData.bankStatement && !uploadedDocs.bankStatement && (
                            <p className="text-xs text-gray-500 mt-1">
                              {((formData.bankStatement as File).size / 1024).toFixed(2)} KB
                            </p>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Loan Details */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Loan Requirements</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Amount Required *</label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)]"
                      placeholder="₹ 50,000"
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Amount between ₹10,000 to ₹5,00,000
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Purpose of Loan *</label>
                    <select
                      name="loanPurpose"
                      value={formData.loanPurpose}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)]"
                      required
                    >
                      <option value="">Select Purpose</option>
                      <option value="medical">Medical Emergency</option>
                      <option value="education">Education</option>
                      <option value="wedding">Wedding</option>
                      <option value="travel">Travel</option>
                      <option value="home">Home Renovation</option>
                      <option value="debt">Debt Consolidation</option>
                      <option value="business">Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Repayment Tenure *</label>
                    <select
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)]"
                      required
                    >
                      <option value="1">1 Month (Next Salary)</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>

                  {/* EMI Preview */}
                  <div className="bg-gradient-to-r from-[#f8fbff] to-[#ecfdf5] rounded-lg p-6 border border-gray-100">
                    <h3 className="font-semibold mb-4 text-gray-900">Loan Preview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Loan Amount:</span>
                        <span className="font-semibold">₹{formData.loanAmount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Interest (1.5% per month):</span>
                        <span>₹{Math.round((Number(formData.loanAmount) || 0) * 0.015 * Number(formData.tenure))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Processing Fee (2%):</span>
                        <span>₹{Math.round((Number(formData.loanAmount) || 0) * 0.02)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                        <span>Total Payable:</span>
                        <span className="text-[#34d399]">
                          ₹{Math.round(
                            (Number(formData.loanAmount) || 0) +
                            (Number(formData.loanAmount) || 0) * 0.015 * Number(formData.tenure) +
                            (Number(formData.loanAmount) || 0) * 0.02
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">EMI Amount:</span>
                        <span className="font-semibold">
                          ₹{Math.round(
                            ((Number(formData.loanAmount) || 0) +
                            (Number(formData.loanAmount) || 0) * 0.015 * Number(formData.tenure) +
                            (Number(formData.loanAmount) || 0) * 0.02) / Number(formData.tenure)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Review & Submit */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Review Your Application</h2>

                  <div className="space-y-4">
                    {/* Personal Details Review */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <User className="w-5 h-5" />
                        Personal Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-700">Name:</span>
                          <span className="ml-2">{formData.fullName}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Email:</span>
                          <span className="ml-2">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Phone:</span>
                          <span className="ml-2">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">PAN:</span>
                          <span className="ml-2">{formData.pan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Employment Review */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <Briefcase className="w-5 h-5" />
                        Employment Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-700">Company:</span>
                          <span className="ml-2">{formData.companyName}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Designation:</span>
                          <span className="ml-2">{formData.designation}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Monthly Income:</span>
                          <span className="ml-2">₹{formData.monthlyIncome}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Experience:</span>
                          <span className="ml-2">{formData.employmentYears} years</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Details Review */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <CreditCard className="w-5 h-5" />
                        Loan Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-700">Amount:</span>
                          <span className="ml-2 font-semibold">₹{formData.loanAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Tenure:</span>
                          <span className="ml-2">{formData.tenure} months</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Purpose:</span>
                          <span className="ml-2">{formData.loanPurpose}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                      <span className="text-sm">
                        I hereby declare that all the information provided is true and accurate.
                        I agree to the <Link href="/terms" className="text-[#34d399] underline">Terms & Conditions</Link> and
                        <Link href="/privacy" className="text-[#34d399] underline ml-1">Privacy Policy</Link>.
                        I authorize Quikkred to verify my details and check my credit score.
                      </span>
                    </label>
                  </div>

                  {/* Security Note */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800">
                        Your data is secured with 256-bit encryption. We never share your information with third parties.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < 6 ? (
                <button
                  onClick={nextStep}
                  disabled={savingPersonalDetails || savingEmploymentInfo || uploadingDocuments}
                  className="px-6 py-3 bg-gradient-to-r from-[#34d399] to-[#10b981] text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(savingPersonalDetails || savingEmploymentInfo || uploadingDocuments) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploadingDocuments ? 'Uploading Documents...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted || isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    !formData.termsAccepted
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#34d399] to-[#10b981] text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12 text-center"
        >
          <p className="text-gray-700">
            Need help with your application?
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="tel:+918888881111" className="flex items-center gap-2 text-[#34d399] hover:underline">
              <Phone className="w-5 h-5" />
              Call: +91 88888 81111
            </a>
            <a href="mailto:support@quikkred.com" className="flex items-center gap-2 text-[#34d399] hover:underline">
              <Mail className="w-5 h-5" />
              Email Support
            </a>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}