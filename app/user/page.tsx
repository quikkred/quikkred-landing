'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from "nextjs-toploader/app";
import {
  DollarSign, CreditCard, User, Bell, Settings,
  TrendingUp, Calendar, Clock, Download, Plus,
  IndianRupee, Percent, Target, CheckCircle,
  AlertTriangle, FileText, Phone, Mail, MapPin,
  Building, Award, Star, ArrowUpRight, ArrowDownRight,
  Wallet, Calculator, Eye, EyeOff, RefreshCw,
  Shield, UserCheck, History, Gift, HelpCircle,
  Smartphone, Globe, Heart, Zap, Activity,
  PieChart, BarChart3, TrendingDown, Package,
  Copy, ExternalLink, ChevronRight, Sparkles, ChevronDown,
  Upload, Camera, Image, X, CheckCircle2, XCircle, Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { API_BASE_URL, RAZORPAY_KEY } from '@/lib/config';
import { COMPANY_EMAIL_SUPPORT, COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/lib/constants/companyInfo';
import { useDashboard } from '@/store/hooks/useDashboard';
import { useLoans } from '@/store/hooks/useLoans';
import { globalHandlerService } from '@/lib/api/global-handler.service';
import { signOut } from 'next-auth/react';
import getToken from '@/lib/getToken';
import useAxios from '@/hooks/useAxios';
import ApplicationStatus from './_components/ApplicationStatus';
import { DashboardData, ActiveLoanDetails, PaymentResponse, PaymentProof, ReapplyEligibility, LedgerSplit } from "@/interfaces/dashboardInterface";
import PreviousApplicationStatus from './_components/PreviousApplicationStatus';
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UserDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const axios = useAxios();

  // Redux state for dashboard
  const {
    dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    fetchDashboard: reduxFetchDashboard,
  } = useDashboard();

  // Redux state for active loan
  const {
    activeLoan: reduxActiveLoan,
    activeLoanLoading,
    fetchActiveLoan: reduxFetchActiveLoan,
  } = useLoans();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmiCount, setSelectedEmiCount] = useState<number>(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'FULL_CLOSURE' | 'PART_PAYMENT'>('FULL_CLOSURE');
  // Ledger (daily payment) selection — only used when the loan is ledger eligible.
  // 'DAILY' pays a single selected split; 'FULL' closes the whole loan at once.
  const [ledgerPayMode, setLedgerPayMode] = useState<'DAILY' | 'FULL'>('DAILY');
  const [selectedSplitDate, setSelectedSplitDate] = useState<string>('');
  const [selectedLoanNumber, setSelectedLoanNumber] = useState<string>('');
  const [activeLoanDetails, setActiveLoanDetails] = useState<ActiveLoanDetails | null>(null);
  const [loadingLoanDetails, setLoadingLoanDetails] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const isProcessingRef = useRef(false);

  // Payment Proof States
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofAmount, setProofAmount] = useState('');
  const [proofUTR, setProofUTR] = useState('');
  const [proofPaymentMode, setProofPaymentMode] = useState('BANK_TRANSFER');
  const [proofRemarks, setProofRemarks] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const [myPaymentProofs, setMyPaymentProofs] = useState<PaymentProof[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(false);
  const proofFileInputRef = useRef<HTMLInputElement>(null);

  // E-Mandate States
  const [emandateData, setEmandateData] = useState<{
    hasEMandate: boolean;
    isAuthorized: boolean;
    subscriptionId?: string;
    subscriptionStatus?: string;
    keyId?: string;
    applicationNumber?: string;
    applicationStatus?: string;
    amount?: number;
    dueDate?: string;
    message?: string;
  } | null>(null);
  const [loadingEmandate, setLoadingEmandate] = useState(false);
  const [authorizingEmandate, setAuthorizingEmandate] = useState(false);
  const [cancelingEmandate, setCancelingEmandate] = useState(false);

  // Reapply Eligibility States
  const [reapplyEligibility, setReapplyEligibility] = useState<ReapplyEligibility | null>(null);
  const [loadingReapply, setLoadingReapply] = useState(false);

  // ----- Ledger (daily payment) derived state -----
  // Frontend-only detection (no dependency on /api/customer/get): the loan
  // response carries `ledgerSplits`, and either the loan or dashboard payload
  // may carry `isLedgerEligible`. Treat the loan as ledger eligible when any of
  // those signal it.
  const isLedgerEligible = !!(activeLoanDetails?.isLedgerEligible || data?.isLedgerEligible);
  const ledgerSplits: LedgerSplit[] = activeLoanDetails?.ledgerSplits ?? [];
  // Show the daily ledger flow (replacing "Part Payment") when the loan is
  // flagged eligible OR the backend has already sent daily splits for it.
  const hasLedger = isLedgerEligible || ledgerSplits.length > 0;
  const pendingSplits = ledgerSplits.filter((s) => s.status === 'PENDING');
  // Next unpaid split — the day the borrower is expected to pay next.
  const nextPendingSplit = pendingSplits[0] ?? null;

  // Update local state from Redux
  useEffect(() => {
    if (dashboardData) {
      setData(dashboardData);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (reduxActiveLoan) {
      setActiveLoanDetails(reduxActiveLoan);
    }
  }, [reduxActiveLoan]);

  useEffect(() => {
    setLoading(dashboardLoading);
  }, [dashboardLoading]);

  useEffect(() => {
    setLoadingLoanDetails(activeLoanLoading);
  }, [activeLoanLoading]);

  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Set default amount to remaining amount when loan details are loaded (for full closure).
  // Skipped for ledger loans — those are driven by the ledger effect below.
  useEffect(() => {
    if (activeLoanDetails && !hasLedger) {
      const remaining = getTotalLoanAmount() - (activeLoanDetails.paidAmount || 0);
      // Only set for full closure, or if no amount is set yet
      if (paymentType === 'FULL_CLOSURE' || !customAmount) {
        setCustomAmount(remaining.toString());
      }
    }
  }, [activeLoanDetails, paymentType, hasLedger]);

  // Drive the payable amount for ledger loans: daily mode pays the selected
  // split (defaulting to the next pending one), full mode pays the remaining balance.
  useEffect(() => {
    if (!hasLedger) return;

    if (ledgerPayMode === 'FULL') {
      setCustomAmount(getRemainingAmount().toString());
      return;
    }

    // DAILY mode — keep the current selection if it is still pending, else
    // fall back to the next pending split.
    const selected = ledgerSplits.find(
      (s) => s.date === selectedSplitDate && s.status === 'PENDING'
    ) || nextPendingSplit;

    if (selected) {
      setSelectedSplitDate(selected.date);
      setCustomAmount(selected.amount.toString());
    } else {
      setSelectedSplitDate('');
      setCustomAmount('');
    }
  }, [hasLedger, ledgerPayMode, selectedSplitDate, activeLoanDetails]);

  // Fetch active loan details using Redux
  const fetchActiveLoanDetails = async (loanNumber: string) => {
    if (!loanNumber) return;

    setCustomAmount(''); // Reset custom amount

    const result = await reduxFetchActiveLoan(loanNumber);

    // if (result?.requiresAuth) {
    //   router.push('/login');
    //   return;
    // }

    if (result?.success) {
      //console.log('✅ Active loan details loaded successfully');
    } else if (result?.error) {
      toast({
        variant: "error",
        title: "Error Loading Loan",
        description: "Unable to fetch loan details. Please try again."
      });
    }
  };

  // When loans data is available, select first loan by default
  useEffect(() => {
    if (data?.activeLoan && data?.loans?.length > 0 && !selectedLoanNumber) {
      const firstLoanNumber = data.loans[0].loanNumber;
      setSelectedLoanNumber(firstLoanNumber);
      fetchActiveLoanDetails(firstLoanNumber);
    }
  }, [data?.loans]);

  // Fetch loan details when selected loan changes
  useEffect(() => {
    if (selectedLoanNumber) {
      fetchActiveLoanDetails(selectedLoanNumber);
    }
  }, [selectedLoanNumber]);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data using Redux
  const fetchUserData = async () => {
    const result = await reduxFetchDashboard();

    if (result?.success) {
      //console.log('✅ Dashboard data loaded successfully');
    } else if (result?.error) {
      toast({
        variant: "error",
        title: "Error Loading Data",
        description: "Unable to fetch your dashboard data. Please try again."
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateCompletion = () => {
    if (!data) return 0;
    let completed = 0;
    if (data.isBasicDetailsFilled) completed++;
    if (data.isKycDetailsFilled) completed++;
    if (data.isBankDetailsFilled) completed++;
    if (data.isSubmit) completed++;
    return Math.round((completed / 4) * 100);
  };

  const calculateTotalPayment = () => {
    if (!activeLoanDetails) return 0;
    const amount = parseFloat(customAmount);
    return isNaN(amount) ? 0 : amount;
  };

  const getTotalLoanAmount = () => {
    if (!activeLoanDetails) return 0;
    // Total Loan Amount = EMI Amount + Late Charges + Late Interest
    return activeLoanDetails.emiAmount + (activeLoanDetails.lateCharges || 0) + (activeLoanDetails.lateChargeInterest || 0);
  };

  const getPaidAmount = () => {
    if (!activeLoanDetails) return 0;
    return activeLoanDetails.paidAmount || 0;
  };

  const getRemainingAmount = () => {
    if (!activeLoanDetails) return 0;
    return getTotalLoanAmount() - getPaidAmount();
  };

  const getPaymentProgress = () => {
    if (!activeLoanDetails) return 0;
    const total = getTotalLoanAmount();
    if (total === 0) return 0;
    return Math.round((getPaidAmount() / total) * 100);
  };

  const getCurrentInstallment = () => {
    if (!activeLoanDetails) return 0;
    return activeLoanDetails.installment || 1;
  };

  const getOutstandingBreakdown = () => {
    if (!activeLoanDetails) return { principal: 0, interest: 0, penalty: 0, total: 0 };

    const total = getRemainingAmount();
    const penalty = (activeLoanDetails.lateCharges || 0) + (activeLoanDetails.lateChargeInterest || 0);

    // For payday loans: remaining = principal + interest + penalty
    const principalAndInterest = total - penalty;

    return {
      principal: principalAndInterest > 0 ? principalAndInterest : total,
      interest: 0, // Backend should provide this breakdown
      penalty: penalty,
      total: total
    };
  };

  // Handle payment type change
  const handlePaymentTypeChange = (type: 'FULL_CLOSURE' | 'PART_PAYMENT') => {
    setPaymentType(type);
    if (type === 'FULL_CLOSURE') {
      setCustomAmount(getRemainingAmount().toString());
    } else {
      setCustomAmount(''); // Clear for part payment input
    }
  };

  // Select a specific daily split to pay (ledger loans only).
  const handleSelectSplit = (split: LedgerSplit) => {
    if (split.status !== 'PENDING') return;
    setLedgerPayMode('DAILY');
    setSelectedSplitDate(split.date);
    setCustomAmount(split.amount.toString());
  };

  // Switch the ledger payment mode (daily split vs. full closure).
  const handleLedgerModeChange = (mode: 'DAILY' | 'FULL') => {
    setLedgerPayMode(mode);
    if (mode === 'FULL') {
      setCustomAmount(getRemainingAmount().toString());
    } else if (nextPendingSplit) {
      setSelectedSplitDate(nextPendingSplit.date);
      setCustomAmount(nextPendingSplit.amount.toString());
    }
  };

  const handlePayment = async () => {
    if (!activeLoanDetails) return;

    try {
      setProcessingPayment(true);
      const totalAmount = calculateTotalPayment();

      // Validation for payment amount
      if (!customAmount || customAmount.trim() === '') {
        toast({
          variant: "error",
          title: "Invalid Amount",
          description: "Please enter a payment amount."
        });
        setProcessingPayment(false);
        return;
      }

      const amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          variant: "error",
          title: "Invalid Amount",
          description: "Please enter a valid payment amount greater than 0."
        });
        setProcessingPayment(false);
        return;
      }

      const remainingAmount = getRemainingAmount();
      if (amount > remainingAmount) {
        toast({
          variant: "error",
          title: "Amount Exceeds Limit",
          description: `Payment amount cannot exceed remaining balance of ₹${remainingAmount.toLocaleString()}.`
        });
        setProcessingPayment(false);
        return;
      }

      // Ledger loans only allow a daily split amount or a full closure —
      // never an arbitrary partial amount.
      if (hasLedger && ledgerPayMode === 'DAILY') {
        const selected = ledgerSplits.find(
          (s) => s.date === selectedSplitDate && s.status === 'PENDING'
        );
        if (!selected) {
          toast({
            variant: "error",
            title: "Select a Day",
            description: "Please select a pending daily payment to continue."
          });
          setProcessingPayment(false);
          return;
        }
        if (amount !== selected.amount) {
          toast({
            variant: "error",
            title: "Partial Payment Not Allowed",
            description: "Pay the full daily amount or choose to close the loan in full."
          });
          setProcessingPayment(false);
          return;
        }
      }

      // const token = await getToken();

      // if (!token) {
      //   toast({
      //     variant: "error",
      //     title: "Authentication Error",
      //     description: "Please login again to continue."
      //   });
      //   router.push('/login');
      //   return;
      // }

      // Show processing toast
      toast({
        variant: "default",
        title: "Processing Payment",
        description: `Processing payment of ₹${totalAmount.toLocaleString()}...`
      });

      // const payinResponse = await fetch(`${API_BASE_URL}/api/emi/customerEmiPayment`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     paymentAmount: totalAmount,
      //     loanId: activeLoanDetails._id
      //   })
      // });

      // Check if token expired (401 Unauthorized)
      // if (payinResponse.status === 401) {
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('authToken');
      //   localStorage.removeItem('accessToken');
      //   localStorage.removeItem('refreshToken');
      //   document.cookie = 'auth-token=; path=/; max-age=0';
      //   document.cookie = 'user-role=; path=/; max-age=0';
      //   router.push('/login');
      //   setProcessingPayment(false);
      //   isProcessingRef.current = false;
      //   return;
      // }

      // const payinResult = await payinResponse.json();

      // if (!payinResponse.ok || !payinResult.success) {
      //   throw new Error(payinResult.message || 'Failed to initiate payment');
      // }

      const payinResponse = await axios.post("/api/emi/customerEmiPayment", {
        paymentAmount: totalAmount,
        loanId: activeLoanDetails._id,
        // Ledger context lets the backend mark the correct daily split as PAID,
        // or close the whole ledger when paying in full.
        ...(hasLedger && {
          paymentMode: ledgerPayMode === 'FULL' ? 'LEDGER_FULL' : 'LEDGER_DAILY',
          ...(ledgerPayMode === 'DAILY' && { ledgerSplitDate: selectedSplitDate }),
        }),
      });
      const payinResult = payinResponse.data;

      // Step 2: Get order_id (transactionId) and amount from response
      // transactionId is the Razorpay order_id (starts with "order_")
      const orderId = payinResult.data?.transactionId;
      const paymentAmount = payinResult.data?.paymentAmount || totalAmount;
      const amountInPaise = paymentAmount * 100; // Convert to paise

      if (!orderId) {
        console.error('Order ID (transactionId) not found in response:', payinResult.data);
        throw new Error('Order ID not received from server');
      }

      // Step 3: Open Razorpay checkout with order details from API response
      const options = {
        key: RAZORPAY_KEY,
        amount: amountInPaise,
        currency: "INR",
        order_id: orderId,
        name: "Payday Loan",
        description: "EMI / Fee Payment",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        handler: async (response: any) => {
          // Payment completed - Razorpay returns payment details

          // Step 4: Call verify API
          try {
            // const verifyResponse = await fetch(`${API_BASE_URL}/api/disbursement/verify`, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify({
            //     razorpay_payment_id: response.razorpay_payment_id,
            //     razorpay_order_id: response.razorpay_order_id,
            //     razorpay_signature: response.razorpay_signature
            //   })
            // });

            // const verifyResult = await verifyResponse.json();

            const verifyResponse = await axios.post("/api/disbursement/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            const verifyResult = verifyResponse.data;

            if (verifyResult.success) {
              toast({
                variant: "success",
                title: "Payment Verified Successfully!",
                description: (
                  <div className="space-y-1">
                    <p className="font-semibold">Your payment was verified!</p>
                    <div className="text-xs mt-2 space-y-1">
                      <p>Payment ID: {verifyResult.data?.paymentId || response.razorpay_payment_id}</p>
                      <p>Amount: ₹{((verifyResult.data?.amount || amountInPaise) / 100).toFixed(2)}</p>
                    </div>
                  </div>
                )
              });
            } else {
              toast({
                variant: "error",
                title: "Payment Verification Failed",
                description: verifyResult.message || "Please contact support."
              });
            }
          } catch (verifyError: any) {
            console.error('Verification error:', verifyError);
            toast({
              variant: "error",
              title: "Verification Error",
              description: verifyError.message || "Payment verification failed."
            });
          }

          // Refresh dashboard data and active loan details after successful payment
          await fetchUserData();
          if (selectedLoanNumber) {
            await fetchActiveLoanDetails(selectedLoanNumber);
          }

          // Reset form
          setSelectedEmiCount(1);
          setCustomAmount('');
          setProcessingPayment(false);
          isProcessingRef.current = false;
        },
        modal: {
          ondismiss: () => {
            //console.log("Payment cancelled");
            toast({
              variant: "default",
              title: "Payment Cancelled",
              description: "You cancelled the payment process."
            });
            setProcessingPayment(false);
            isProcessingRef.current = false;
          },
        },
        theme: { color: "#10B4A3" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        toast({
          variant: "error",
          title: "Payment Failed",
          description: response.error.description || "Payment failed. Please try again."
        });
        setProcessingPayment(false);
        isProcessingRef.current = false;
      });

      rzp.open();

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast({
        variant: "error",
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again."
      });
      setProcessingPayment(false);
      isProcessingRef.current = false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'NPA':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // Payment Proof Functions
  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ variant: "error", title: "File too large", description: "Maximum file size is 5MB" });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ variant: "error", title: "Invalid file", description: "Please upload an image file" });
        return;
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const clearProofFile = () => {
    setProofFile(null);
    setProofPreview(null);
    if (proofFileInputRef.current) {
      proofFileInputRef.current.value = '';
    }
  };

  const fetchMyPaymentProofs = async () => {
    if (!activeLoanDetails) return;

    setLoadingProofs(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/payment-proof/my-submissions?loanId=${activeLoanDetails._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMyPaymentProofs(result.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching payment proofs:', error);
    } finally {
      setLoadingProofs(false);
    }
  };

  // Fetch proofs when loan details change
  useEffect(() => {
    if (activeLoanDetails?._id) {
      fetchMyPaymentProofs();
    }
  }, [activeLoanDetails?._id]);

  const submitPaymentProof = async () => {
    if (!activeLoanDetails || !proofFile) return;

    if (!proofUTR.trim()) {
      toast({ variant: "error", title: "Missing Information", description: "Please enter the transaction/UTR number" });
      return;
    }
    if (!proofAmount || parseFloat(proofAmount) <= 0) {
      toast({ variant: "error", title: "Missing Information", description: "Please enter the payment amount" });
      return;
    }

    setSubmittingProof(true);
    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append('loanId', activeLoanDetails._id);
      formData.append('amountPaid', proofAmount);
      formData.append('transactionReference', proofUTR.trim());
      formData.append('paymentMode', proofPaymentMode);
      formData.append('proofImage', proofFile);
      if (proofRemarks) formData.append('remarks', proofRemarks);

      const response = await fetch(`${API_BASE_URL}/api/payment-proof/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast({
          variant: "success",
          title: "Payment Proof Submitted!",
          description: result.message || "Your payment proof has been submitted for verification."
        });

        // Reset form
        clearProofFile();
        setProofAmount('');
        setProofUTR('');
        setProofPaymentMode('BANK_TRANSFER');
        setProofRemarks('');
        setShowProofUpload(false);

        // Refresh proofs list
        fetchMyPaymentProofs();
      } else {
        toast({
          variant: "error",
          title: "Submission Failed",
          description: result.message || "Failed to submit payment proof"
        });
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to submit payment proof"
      });
    } finally {
      setSubmittingProof(false);
    }
  };

  const getProofStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  // Fetch E-Mandate details
  const fetchEmandateDetails = async () => {
    if (!data?.customerId) return;

    setLoadingEmandate(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/upi/emandate/checkout/${data.customerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      if (result.success) {
        setEmandateData(result);
      }
    } catch (error) {
      console.error('Error fetching E-Mandate details:', error);
    } finally {
      setLoadingEmandate(false);
    }
  };

  // Fetch E-Mandate when dashboard data is available
  useEffect(() => {
    if (data?.customerId) {
      fetchEmandateDetails();
    }
  }, [data?.customerId]);

  // Fetch Reapply Eligibility
  const fetchReapplyEligibility = async () => {
    if (!data?.customerId) return;

    setLoadingReapply(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/reapply/eligibility/${data.customerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      if (result.success && result.data?.isEligible) {
        setReapplyEligibility(result.data);
      }
    } catch (error) {
      console.error('Error fetching reapply eligibility:', error);
    } finally {
      setLoadingReapply(false);
    }
  };

  // Check if there's any active application or loan (non-terminal status)
  const hasActiveApplication = (() => {
    if (data?.activeLoan) return true;
    if (data?.oldApplication) return true;
    if (data?.applicationStatus) {
      const terminalStatuses = ['REJECTED', 'CLOSED'];
      return !terminalStatuses.includes(data.applicationStatus);
    }
    return false;
  })();

  // Fetch Reapply Eligibility when no active loan and no active application
  useEffect(() => {
    if (data?.customerId && !hasActiveApplication) {
      fetchReapplyEligibility();
    }
  }, [data?.customerId, hasActiveApplication]);

  // Authorize E-Mandate with Razorpay Checkout
  const handleAuthorizeEmandate = async () => {
    if (!razorpayLoaded) {
      toast({
        variant: "error",
        title: "Error",
        description: "Payment gateway is still loading. Please try again in a moment."
      });
      return;
    }

    if (!data?.customerId) {
      toast({
        variant: "error",
        title: "Error",
        description: "Customer details not available. Please refresh and try again."
      });
      return;
    }

    setAuthorizingEmandate(true);

    // Kill-switch: if the MANDATE global handler is disabled, the e-mandate
    // feature is temporarily unavailable — block the action with a message.
    const mandateActive = await globalHandlerService.isEventActive('MANDATE');
    if (!mandateActive) {
      toast({
        variant: "error",
        title: "E-Mandate Unavailable",
        description: "Currently the e-mandate feature has some problem. Please retry after some time."
      });
      setAuthorizingEmandate(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast({ variant: 'error', title: 'Session expired', description: 'Please log in again.' });
        setAuthorizingEmandate(false);
        return;
      }

      // Create the mandate (POST) only now, when the user clicks Authorize.
      // The page-load fetch is GET-only (status), so simply viewing the
      // dashboard never creates a mandate.
      const createResponse = await fetch(`${API_BASE_URL}/api/upi/emandate/checkout/${data.customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const createResult = await createResponse.json().catch(() => ({}));

      if (!createResult?.subscriptionId || !createResult?.keyId) {
        toast({
          variant: "error",
          title: "Error",
          description: createResult?.message || "Failed to create E-Mandate. Please try again."
        });
        setAuthorizingEmandate(false);
        return;
      }

      const options = {
        key: createResult.keyId,
        subscription_id: createResult.subscriptionId,
        name: "Quikkred",
        description: "E-Mandate Authorization for Loan Repayment",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        handler: async (response: any) => {
          toast({
            variant: "success",
            title: "E-Mandate Authorized!",
            description: "Your E-Mandate has been successfully authorized. Your loan will be disbursed shortly."
          });
          // Refresh E-Mandate status
          await fetchEmandateDetails();
          setAuthorizingEmandate(false);
        },
        modal: {
          ondismiss: () => {
            toast({
              variant: "default",
              title: "Authorization Cancelled",
              description: "You cancelled the E-Mandate authorization process."
            });
            setAuthorizingEmandate(false);
          },
        },
        theme: { color: "#10B4A3" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        //console.log("E-Mandate Authorization Failed:", response.error);
        toast({
          variant: "error",
          title: "Authorization Failed",
          description: response.error.description || "E-Mandate authorization failed. Please try again."
        });
        setAuthorizingEmandate(false);
      });

      rzp.open();
    } catch (error: any) {
      console.error('E-Mandate authorization error:', error);
      toast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to open authorization. Please try again."
      });
      setAuthorizingEmandate(false);
    }
  };

  // Cancel E-Mandate (allowed only while loan is not yet disbursed).
  // Prefer the emandate response's status — it reflects the latest disbursement
  // state — and fall back to the main application data.
  const effectiveApplicationStatus = (emandateData?.applicationStatus || data?.applicationStatus || '').toUpperCase();
  const canCancelEmandate = !!emandateData?.isAuthorized
    && !!emandateData?.applicationNumber
    && effectiveApplicationStatus !== 'DISBURSED';

  const handleCancelEmandate = async () => {
    if (!canCancelEmandate) return;
    const applicationNumber = emandateData?.applicationNumber;
    if (!applicationNumber) return;

    const confirmed = typeof window !== 'undefined'
      ? window.confirm('Cancel your E-Mandate authorization? You will need to re-authorize before disbursement.')
      : true;
    if (!confirmed) return;

    setCancelingEmandate(true);
    try {
      const token = await getToken();
      if (!token) {
        toast({ variant: 'error', title: 'Session expired', description: 'Please log in again.' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/upi/autoPay/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationNumbers: [applicationNumber] }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && (result.success ?? true)) {
        toast({
          variant: 'success',
          title: 'E-Mandate Cancelled',
          description: result.message || 'Your E-Mandate authorization has been cancelled.',
        });
        await fetchEmandateDetails();
      } else {
        toast({
          variant: 'error',
          title: 'Cancellation Failed',
          description: result.message || 'Unable to cancel E-Mandate. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('E-Mandate cancellation error:', error);
      toast({
        variant: 'error',
        title: 'Cancellation Failed',
        description: error?.message || 'Unable to cancel E-Mandate. Please try again.',
      });
    } finally {
      setCancelingEmandate(false);
    }
  };

  const getProofStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle2 className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 space-y-5">
        {/* Greeting */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center gap-2">
                <SkeletonCircle size={32} />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-7 w-28" />
            </div>
          ))}
        </div>

        {/* Main content: two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-32 w-full" rounded="lg" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-16 w-full" rounded="lg" />
              <Skeleton className="h-16 w-full" rounded="lg" />
              <Skeleton className="h-16 w-full" rounded="lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <SkeletonCircle size={36} />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2.5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // if (!user || (user.role !== 'USER' && user.role !== 'CUSTOMER')) {
  //   return (
  //     <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-[#737373]">Access denied. Redirecting...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 space-y-5">
        {/* Greeting */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center gap-2">
                <SkeletonCircle size={32} />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-7 w-28" />
            </div>
          ))}
        </div>

        {/* Main content: two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-32 w-full" rounded="lg" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-16 w-full" rounded="lg" />
              <Skeleton className="h-16 w-full" rounded="lg" />
              <Skeleton className="h-16 w-full" rounded="lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <SkeletonCircle size={36} />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2.5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 bg-[#FAFAFA] min-h-screen">
        {/* Header with Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] flex items-center gap-2 sm:gap-3">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF9800]" />
                <span className="break-words">Welcome back, {user?.name?.split(' ')[0]?.charAt(0).toUpperCase() + (user?.name?.split(' ')[0]?.slice(1).toLowerCase() || '')}!</span>
              </h1>
              <p className="text-[#737373] mt-1 text-sm sm:text-base">Complete your profile to apply for loans</p>
            </div>

            <div className="flex items-center gap-3">
              {calculateCompletion() === 100 && (
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#E5E5E5"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="url(#greenGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset="0"
                    />
                    <defs>
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-green-600">100%</span>
                  </div>
                </div>
              )}
              <button
                onClick={fetchUserData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg hover:shadow-md transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Old Application Info - Show only if oldApplication is true */}
        <PreviousApplicationStatus data={data} />

        {/* Profile Completion Overview - Only show when not 100% complete */}
        {calculateCompletion() < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200 mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-1">Profile Completion</h2>
                <p className="text-xs sm:text-sm text-blue-700">Complete all steps to apply for loans</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-900">{calculateCompletion()}%</div>
                <p className="text-xs text-blue-700">Complete</p>
              </div>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-2 sm:h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculateCompletion()}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
              />
            </div>
          </motion.div>
        )}

        {/* E-Mandate Section - Show when the application is submitted, the mandate is
            not yet authorized, and the application is not in a terminal/blocked state.
            We intentionally do NOT require hasEMandate here: the subscription is created
            on Authorize click (POST), so this block must show first to expose the button. */}
        {data?.isSubmit
          && !!emandateData
          && !emandateData?.isAuthorized
          && !['CLOSED', 'REJECTED', 'CANCELLED', 'HOLD'].includes(
            (emandateData?.applicationStatus || data?.applicationStatus || '').toUpperCase()
          ) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-300 mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-purple-500/20 rounded-lg sm:rounded-xl">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-900">
                    E-Mandate Authorization Required
                  </h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-300">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-purple-700 mb-4">
                  Your loan has been approved! Please authorize the E-Mandate to enable automatic loan repayment.
                  Once authorized, your loan amount will be disbursed to your bank account.
                </p>

                {/* E-Mandate Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {emandateData.applicationNumber && (
                    <div>
                      <p className="text-sm text-purple-700 mb-1">Application Number</p>
                      <p className="text-base font-semibold text-purple-900">
                        {emandateData.applicationNumber}
                      </p>
                    </div>
                  )}
                  {emandateData.amount && (
                    <div>
                      <p className="text-sm text-purple-700 mb-1">Repayment Amount</p>
                      <p className="text-base font-bold text-purple-900">
                        ₹{emandateData.amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {emandateData.dueDate && (
                    <div>
                      <p className="text-sm text-purple-700 mb-1">Due Date</p>
                      <p className="text-base font-semibold text-purple-900">
                        {formatDate(emandateData.dueDate)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-purple-700 mb-1">E-Mandate Status</p>
                    <p className="text-base font-semibold text-yellow-700">
                      {emandateData.subscriptionStatus?.toUpperCase() || 'PENDING'}
                    </p>
                  </div>
                </div>

                {/* Authorization Button - hidden if application is rejected or on hold */}
           {/* Authorization Button - hidden if application is rejected or on hold */}
{data?.applicationStatus !== 'REJECTED' &&
 data?.applicationStatus !== 'HOLD' && (
  <>
    <button
      onClick={handleAuthorizeEmandate}
      disabled={authorizingEmandate || !razorpayLoaded}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {authorizingEmandate ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Shield className="w-4 h-4" />
          <span>Authorize E-Mandate Now</span>
          <ChevronRight className="w-4 h-4" />
        </>
      )}
    </button>

    {/* Help Text */}
    <p className="text-xs text-purple-600 mt-3">
      You will be redirected to your bank&apos;s UPI app to authorize
      the mandate. This is a one-time authorization.
    </p>
  </>
)}
              </div>
            </div>
          </motion.div>
        )}

        {/* E-Mandate Authorized Success - Show whenever the mandate is authorized */}
        {emandateData?.isAuthorized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-300 mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg sm:rounded-xl self-start">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-1">
                  E-Mandate Authorized ✓
                </h3>
                <p className="text-sm text-green-700">
                  Your E-Mandate has been successfully authorized. Your loan will be disbursed shortly.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-300">
                  Active
                </span>
                {canCancelEmandate && (
                  <button
                    onClick={handleCancelEmandate}
                    disabled={cancelingEmandate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {cancelingEmandate ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel E-Mandate</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            {canCancelEmandate && (
              <p className="text-xs text-green-700/80 mt-2 sm:ml-14">
                You can cancel this authorization any time before disbursement.
              </p>
            )}
          </motion.div>
        )}

        {/* Quick Reapply Card - Show when eligible, no active loan, and no active application */}
        {reapplyEligibility?.isEligible && !hasActiveApplication && !reapplyEligibility?.isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-teal-300 mb-4 sm:mb-6 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg sm:rounded-xl shadow-lg">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-teal-900">
                      You're Eligible for a New Loan!
                    </h3>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-medium rounded-full border border-teal-300">
                      Pre-Approved
                    </span>
                  </div>
                  <p className="text-sm text-teal-700">
                    Based on your excellent repayment history, you qualify for up to
                  </p>
                </div>
              </div>

              {/* Max Loan Amount */}
              <div className="bg-white/70 rounded-xl p-4 mb-4 border border-teal-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-teal-600 mb-1">Maximum Loan Amount</p>
                    <p className="text-2xl sm:text-3xl font-bold text-teal-900">
                      ₹{(reapplyEligibility.maxLoanAmount || 100000).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {reapplyEligibility.previousLoanNumber && (
                      <div>
                        <p className="text-xs text-teal-600 mb-1">Previous Loan</p>
                        <p className="text-sm font-semibold text-teal-800">
                          {reapplyEligibility.previousLoanNumber}
                        </p>
                        {reapplyEligibility.previousLoanClosedAt && (
                          <p className="text-xs text-teal-600">
                            Closed on {new Date(reapplyEligibility.previousLoanClosedAt).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Apply Button */}
              <button
                onClick={() => router.push('/user/loans')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all font-semibold text-sm sm:text-base"
              >
                <Plus className="w-5 h-5" />
                <span>Quick Apply Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Approval Expiry Notice */}
              {reapplyEligibility.expiresAt && (
                <p className="text-xs text-teal-600 mt-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Offer valid until {new Date(reapplyEligibility.expiresAt).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Active Loan Section */}
        {data?.activeLoan && data?.loans?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E5E5E5] mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#0A0A0A] flex items-center gap-2">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B4A3]" />
                Active Loan
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Loan Selector Dropdown */}
                {data.loans.length > 1 && (
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={selectedLoanNumber}
                      onChange={(e) => setSelectedLoanNumber(e.target.value)}
                      className="w-full sm:w-auto appearance-none bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-blue-900 focus:ring-2 focus:ring-[#10B4A3] focus:border-transparent outline-none cursor-pointer"
                    >
                      {data.loans.map((loan: any) => (
                        <option key={loan._id} value={loan.loanNumber}>
                          {loan.productName}{" "}{loan.loanNumber} (₹{loan.principalAmount.toLocaleString()})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-700 pointer-events-none" />
                  </div>
                )}

                {activeLoanDetails && (
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border whitespace-nowrap ${getStatusColor(activeLoanDetails.status)}`}>
                    {activeLoanDetails.status}
                  </span>
                )}
              </div>
            </div>

            {/* Loading State for Loan Details */}
            {loadingLoanDetails && (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-3 border-[#10B4A3] border-t-transparent rounded-full"
                />
                <p className="ml-3 text-[#737373]">Loading loan details...</p>
              </div>
            )}

            {!loadingLoanDetails && activeLoanDetails && (
              <>

                {/* Payment Progress Overview */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-purple-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-purple-900 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Loan Payment Progress
                    </h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-900">{getPaymentProgress()}%</p>
                      <p className="text-xs text-purple-700">Completed</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-purple-200 rounded-full h-3 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getPaymentProgress()}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
                    />
                  </div>

                  {/* Payment Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
                      <p className="text-xs text-purple-700 mb-1">Total Loan</p>
                      <p className="text-base sm:text-lg font-bold text-purple-900">₹{getTotalLoanAmount().toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 mb-1">Amount Paid</p>
                      <p className="text-base sm:text-lg font-bold text-green-900">₹{getPaidAmount().toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-700 mb-1">Remaining</p>
                      <p className="text-base sm:text-lg font-bold text-orange-900">₹{getRemainingAmount().toLocaleString()}</p>
                    </div>
                  </div>
                </div>


                {/* Important Dates Section */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 sm:p-6 border border-slate-200 mb-6">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4" />
                    Important Dates
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeLoanDetails.appliedDate && (
                      <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Applied Date</p>
                        <p className="text-sm font-semibold text-slate-900">{formatDate(activeLoanDetails.appliedDate)}</p>
                      </div>
                    )}
                    {activeLoanDetails.disbursementDate && (
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 mb-1">Disbursed Date</p>
                        <p className="text-sm font-semibold text-green-900">{formatDate(activeLoanDetails.disbursementDate)}</p>
                      </div>
                    )}
                    {activeLoanDetails.firstDueDate && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">First Due Date</p>
                        <p className="text-sm font-semibold text-blue-900">{formatDate(activeLoanDetails.firstDueDate)}</p>
                      </div>
                    )}
                    {activeLoanDetails.maturityDate && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-700 mb-1">Maturity Date</p>
                        <p className="text-sm font-semibold text-purple-900">{formatDate(activeLoanDetails.maturityDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Loan Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <p className="text-xs sm:text-sm text-blue-700 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Loan Number
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-blue-900 break-all">{activeLoanDetails.loanNumber}</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <p className="text-xs sm:text-sm text-green-700 mb-1 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      Total Loan Amount
                    </p>
                    {/* <p className="text-sm sm:text-base font-semibold text-green-900">₹{activeLoanDetails.emiAmount.toLocaleString()}</p> */}
                    <p className="text-sm sm:text-base font-semibold text-green-900">₹{getTotalLoanAmount().toLocaleString()}</p>
                  </div>

                  {/* <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                <p className="text-xs sm:text-sm text-purple-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Current Installment
                </p>
                <p className="text-sm sm:text-base font-semibold text-purple-900">#{getCurrentInstallment()}</p>
              </div> */}

                  <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <p className="text-xs sm:text-sm text-orange-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due Date
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-orange-900">{formatDateTime(activeLoanDetails.nextDueDate)}</p>
                  </div>

                  {/* <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                <p className="text-xs sm:text-sm text-teal-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Maturity Date
                </p>
                <p className="text-sm sm:text-base font-semibold text-teal-900">{formatDateTime(activeLoanDetails.maturityDate)}</p>
              </div> */}

                  {/* Remaining After Payment */}
                  {/* <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                      <p className="text-xs text-orange-700 mb-1">Remaining After</p>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-orange-700" />
                        <p className="text-lg font-bold text-orange-900">
                          {(getRemainingAmount() - calculateTotalPayment()).toLocaleString()}
                        </p>
                      </div>
                    </div> */}

                  {activeLoanDetails.overdueCount > 0 && (
                    <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200">
                      <p className="text-xs sm:text-sm text-red-700 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Overdue Count
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-red-900">{activeLoanDetails.overdueCount} EMI(s)</p>
                      <p className="text-xs text-red-600 mt-1">Payment attempts failed</p>
                    </div>
                  )}
                </div>

                {/* Payment Section - Show only if there is remaining amount */}
                {getRemainingAmount() > 0 && (
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-[#0A0A0A] mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B4A3]" />
                      Pay Your Loan
                    </h3>

                    {/* Outstanding Breakdown */}
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 sm:p-6 mb-4 border border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Outstanding Breakdown
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-600 mb-1">Principal + Interest</p>
                          <p className="text-base font-bold text-slate-900">₹{activeLoanDetails.emiAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-600 mb-1">Penalty</p>
                          <p className="text-base font-bold text-red-600">₹{getOutstandingBreakdown().penalty.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Total Outstanding</p>
                          <p className="text-xl font-bold text-green-800">
                            ₹{(activeLoanDetails.emiAmount + getOutstandingBreakdown().penalty).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-3 text-center">
                        Due Date: {formatDate(activeLoanDetails.nextDueDate)}
                      </p>
                    </div>

                    {/* Payment Type Toggle */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4 border-2 border-indigo-200">
                      <h4 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {hasLedger ? 'Choose How to Pay' : 'Choose Payment Type'}
                      </h4>

                      {/* ===== Ledger (daily payment) UI ===== */}
                      {hasLedger && (
                        <div className="mb-4">
                          {/* Daily vs Full mode toggle */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                              onClick={() => handleLedgerModeChange('DAILY')}
                              className={`p-4 rounded-xl border-2 transition-all ${ledgerPayMode === 'DAILY'
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-600 text-white shadow-lg'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Calendar className={`w-6 h-6 ${ledgerPayMode === 'DAILY' ? 'text-white' : 'text-blue-600'}`} />
                                <span className="font-semibold text-sm">Daily Payment</span>
                                <span className={`text-xs ${ledgerPayMode === 'DAILY' ? 'text-blue-100' : 'text-gray-500'}`}>
                                  Pay one day at a time
                                </span>
                              </div>
                            </button>

                            <button
                              onClick={() => handleLedgerModeChange('FULL')}
                              className={`p-4 rounded-xl border-2 transition-all ${ledgerPayMode === 'FULL'
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600 text-white shadow-lg'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
                                }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <CheckCircle className={`w-6 h-6 ${ledgerPayMode === 'FULL' ? 'text-white' : 'text-green-600'}`} />
                                <span className="font-semibold text-sm">Pay in Full</span>
                                <span className={`text-xs ${ledgerPayMode === 'FULL' ? 'text-green-100' : 'text-gray-500'}`}>
                                  Close the entire loan
                                </span>
                              </div>
                            </button>
                          </div>

                          {/* Partial payment not allowed notice */}
                          <div className="flex items-start gap-2 p-3 mb-4 bg-amber-50 rounded-lg border border-amber-200">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700">
                              Partial payments are not allowed on this loan. Pay a full day&apos;s
                              amount or close the loan in full.
                            </p>
                          </div>

                          {/* Daily split schedule — selectable list */}
                          {ledgerPayMode === 'DAILY' && (
                            <div className="space-y-2 mb-2">
                              <p className="text-xs font-medium text-indigo-800 mb-1">
                                Daily Payment Schedule
                              </p>
                              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                                {ledgerSplits.map((split, idx) => {
                                  const isPaid = split.status === 'PAID';
                                  const isSelected = !isPaid && split.date === selectedSplitDate;
                                  return (
                                    <button
                                      key={split._id || `${split.date}-${idx}`}
                                      onClick={() => handleSelectSplit(split)}
                                      disabled={isPaid}
                                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 text-left transition-all ${isPaid
                                        ? 'bg-green-50 border-green-200 cursor-default'
                                        : isSelected
                                          ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                                          : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                        }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${isPaid ? 'bg-green-100' : isSelected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                          {isPaid
                                            ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            : <Calendar className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />}
                                        </div>
                                        <div>
                                          <p className={`text-sm font-semibold ${isPaid ? 'text-green-900' : 'text-gray-900'}`}>
                                            {formatDate(split.date)}
                                          </p>
                                          {isPaid && split.paidAt && (
                                            <p className="text-xs text-green-600">
                                              Paid on {formatDate(split.paidAt)}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold ${isPaid ? 'text-green-700' : 'text-gray-900'}`}>
                                          ₹{(isPaid ? (split.paidAmount ?? split.amount) : split.amount).toLocaleString()}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${isPaid
                                          ? 'bg-green-100 text-green-800 border-green-300'
                                          : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                          }`}>
                                          {split.status}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              {ledgerSplits.length === 0 ? (
                                <p className="text-xs text-gray-500 text-center py-2">
                                  Your daily payment schedule will appear here once it&apos;s generated. You can still pay in full above.
                                </p>
                              ) : pendingSplits.length === 0 ? (
                                <p className="text-xs text-green-700 text-center py-2">
                                  All daily payments are cleared. 🎉
                                </p>
                              ) : null}
                            </div>
                          )}

                          {/* Full closure amount for ledger */}
                          {ledgerPayMode === 'FULL' && (
                            <div className="bg-white rounded-xl p-4 border border-green-200">
                              <div className="text-center">
                                <p className="text-sm text-green-700 mb-1">Full Closure Amount</p>
                                <p className="text-3xl font-bold text-green-800">₹{getRemainingAmount().toLocaleString()}</p>
                                <p className="text-xs text-green-600 mt-1">Clears all remaining daily payments</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Toggle Buttons — standard (non-ledger) loans */}
                      {!hasLedger && (
                      <>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                          onClick={() => handlePaymentTypeChange('FULL_CLOSURE')}
                          className={`p-4 rounded-xl border-2 transition-all ${paymentType === 'FULL_CLOSURE'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600 text-white shadow-lg'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
                            }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className={`w-6 h-6 ${paymentType === 'FULL_CLOSURE' ? 'text-white' : 'text-green-600'}`} />
                            <span className="font-semibold text-sm">Full Closure</span>
                            <span className={`text-xs ${paymentType === 'FULL_CLOSURE' ? 'text-green-100' : 'text-gray-500'}`}>
                              Pay entire balance
                            </span>
                          </div>
                        </button>

                        <button
                          onClick={() => handlePaymentTypeChange('PART_PAYMENT')}
                          className={`p-4 rounded-xl border-2 transition-all ${paymentType === 'PART_PAYMENT'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-600 text-white shadow-lg'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Percent className={`w-6 h-6 ${paymentType === 'PART_PAYMENT' ? 'text-white' : 'text-blue-600'}`} />
                            <span className="font-semibold text-sm">Part Payment</span>
                            <span className={`text-xs ${paymentType === 'PART_PAYMENT' ? 'text-blue-100' : 'text-gray-500'}`}>
                              Pay custom amount
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Custom Amount Input (for Part Payment) */}
                      {paymentType === 'PART_PAYMENT' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4"
                        >
                          <label className="block text-sm font-medium text-indigo-800 mb-2">
                            Enter Payment Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input
                              type="number"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="Enter amount"
                              min="1"
                              max={getRemainingAmount()}
                              className="w-full pl-10 pr-4 py-3 text-lg font-semibold border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-indigo-600">
                            <span>Min: ₹100</span>
                            <span>Max: ₹{getRemainingAmount().toLocaleString()}</span>
                          </div>
                          {/* Quick amount buttons */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {[1000, 2000, 5000, 10000].filter(amt => amt <= getRemainingAmount()).map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setCustomAmount(amount.toString())}
                                className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                              >
                                ₹{amount.toLocaleString()}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Full Closure Amount Display */}
                      {paymentType === 'FULL_CLOSURE' && (
                        <div className="bg-white rounded-xl p-4 border border-green-200 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-green-700 mb-1">Full Closure Amount</p>
                            <p className="text-3xl font-bold text-green-800">₹{getRemainingAmount().toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">Clears your entire loan</p>
                          </div>
                        </div>
                      )}
                      </>
                      )}

                      {/* Payment Summary */}
                      <div className="bg-white rounded-xl p-4 border border-indigo-200 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Payment Amount:</span>
                          <span className="text-xl font-bold text-indigo-900">
                            ₹{(hasLedger || paymentType !== 'FULL_CLOSURE')
                              ? (parseFloat(customAmount) || 0).toLocaleString()
                              : getRemainingAmount().toLocaleString()}
                          </span>
                        </div>
                        {!hasLedger && paymentType === 'PART_PAYMENT' && customAmount && parseFloat(customAmount) > 0 && (
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">Balance after payment:</span>
                            <span className="text-sm font-semibold text-orange-600">
                              ₹{(getRemainingAmount() - parseFloat(customAmount)).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {hasLedger && (
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              {ledgerPayMode === 'FULL' ? 'Closing the loan in full' : 'Balance after this day'}
                            </span>
                            <span className="text-sm font-semibold text-orange-600">
                              ₹{(getRemainingAmount() - (parseFloat(customAmount) || 0)).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pay Now Button */}
                      <button
                        onClick={handlePayment}
                        disabled={processingPayment || !razorpayLoaded || (!hasLedger && paymentType === 'PART_PAYMENT' && (!customAmount || parseFloat(customAmount) <= 0)) || (hasLedger && (!customAmount || parseFloat(customAmount) <= 0))}
                        className="w-full py-4 bg-gradient-to-r from-[#10B4A3] to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-[#0EA594] hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        {processingPayment ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            <span>Pay Now</span>
                            <ArrowUpRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-center text-indigo-600 mt-3">
                        Secure payment powered by Razorpay
                      </p>
                    </div>

                    {activeLoanDetails.overdueCount > 0 && (
                      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 mb-4 border border-red-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-red-900">Payment Overdue</p>
                            <p className="text-xs text-red-700 mt-1">
                              Please pay immediately to avoid additional late charges and penalties.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bank Account Details for Manual Payment */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Building className="w-5 h-5 text-blue-700" />
                        <h4 className="text-base font-semibold text-blue-900">Bank Transfer Details</h4>
                      </div>

                      <div className="space-y-3">
                        {/* Account Name */}
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                          <div>
                            <p className="text-xs text-gray-500">Account Name</p>
                            <p className="text-sm font-semibold text-gray-900">Satsai Finlease Pvt Ltd</p>
                          </div>
                        </div>

                        {/* Account Number */}
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                          <div>
                            <p className="text-xs text-gray-500">Account Number</p>
                            <p className="text-base font-bold text-gray-900 font-mono">401655461518</p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('401655461518');
                              toast({ variant: "success", title: "Copied!", description: "Account number copied to clipboard" });
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>

                        {/* IFSC Code */}
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                          <div>
                            <p className="text-xs text-gray-500">IFSC Code</p>
                            <p className="text-base font-bold text-gray-900 font-mono">RATN0000315</p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('RATN0000315');
                              toast({ variant: "success", title: "Copied!", description: "IFSC code copied to clipboard" });
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>

                        {/* Bank Name */}
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                          <div>
                            <p className="text-xs text-gray-500">Bank Name</p>
                            <p className="text-sm font-semibold text-gray-900">RBL Bank</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Instructions */}
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-800">Important Instructions</p>
                            <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
                              <li>Transfer exact amount: ₹{getRemainingAmount().toLocaleString()}</li>
                              <li>Use IMPS/NEFT/UPI for instant transfer</li>
                              <li>Add your Loan Number <span className="font-mono font-bold">{activeLoanDetails.loanNumber}</span> in remarks</li>
                              <li>Payment will be updated within 24 hours</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* -------------------------------------------------------->UPI */}

                    {/* Help Section */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="w-4 h-4 text-gray-600" />
                        <p className="text-sm font-semibold text-gray-800">Need Help?</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        If you face any issues with payment, contact us at{' '}
                        <a href={`tel:${COMPANY_PHONE_TEL}`} className="text-[#10B4A3] font-semibold">{COMPANY_PHONE_DISPLAY}</a>
                        {' '}or email{' '}
                        <a href={`mailto:${COMPANY_EMAIL_SUPPORT}`} className="text-[#10B4A3] font-semibold">{COMPANY_EMAIL_SUPPORT}</a>
                      </p>
                    </div>

                    {/* Payment Proof Upload Section */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-[#0A0A0A] flex items-center gap-2">
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B4A3]" />
                          Submit Payment Proof
                        </h3>
                        {!showProofUpload && (
                          <button
                            onClick={() => setShowProofUpload(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#10B4A3] text-white rounded-lg hover:bg-[#0EA594] transition-all text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Upload Proof</span>
                          </button>
                        )}
                      </div>

                      {/* Upload Form */}
                      {showProofUpload && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 sm:p-6 border-2 border-teal-200 mb-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-base font-semibold text-teal-900 flex items-center gap-2">
                              <Camera className="w-5 h-5" />
                              Upload Payment Screenshot
                            </h4>
                            <button
                              onClick={() => {
                                setShowProofUpload(false);
                                clearProofFile();
                              }}
                              className="p-1 hover:bg-teal-100 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5 text-teal-700" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            {/* File Upload */}
                            <div>
                              <label className="block text-sm font-medium text-teal-800 mb-2">Payment Screenshot *</label>
                              {!proofPreview ? (
                                <div
                                  onClick={() => proofFileInputRef.current?.click()}
                                  className="border-2 border-dashed border-teal-300 rounded-xl p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all"
                                >
                                  <Image className="w-12 h-12 text-teal-400 mx-auto mb-2" />
                                  <p className="text-sm text-teal-700 font-medium">Click to upload screenshot</p>
                                  <p className="text-xs text-teal-600 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                              ) : (
                                <div className="relative">
                                  <img
                                    src={proofPreview}
                                    alt="Payment proof preview"
                                    className="w-full max-h-60 object-contain rounded-lg border border-teal-200"
                                  />
                                  <button
                                    onClick={clearProofFile}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              <input
                                ref={proofFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleProofFileChange}
                                className="hidden"
                              />
                            </div>

                            {/* Amount & UTR in a Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-teal-800 mb-2">Amount Paid (₹) *</label>
                                <input
                                  type="number"
                                  value={proofAmount}
                                  onChange={(e) => setProofAmount(e.target.value)}
                                  placeholder="Enter amount"
                                  className="w-full px-4 py-2.5 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-teal-800 mb-2">UTR/Transaction Number *</label>
                                <input
                                  type="text"
                                  value={proofUTR}
                                  onChange={(e) => setProofUTR(e.target.value)}
                                  placeholder="Enter UTR number"
                                  className="w-full px-4 py-2.5 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900 font-mono"
                                />
                              </div>
                            </div>

                            {/* Payment Mode */}
                            <div>
                              <label className="block text-sm font-medium text-teal-800 mb-2">Payment Mode</label>
                              <select
                                value={proofPaymentMode}
                                onChange={(e) => setProofPaymentMode(e.target.value)}
                                className="w-full px-4 py-2.5 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                              >
                                <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                                <option value="IMPS">IMPS</option>
                                <option value="UPI">UPI</option>
                                <option value="NEFT">NEFT</option>
                                <option value="RTGS">RTGS</option>
                                <option value="OTHER">Other</option>
                              </select>
                            </div>

                            {/* Remarks */}
                            <div>
                              <label className="block text-sm font-medium text-teal-800 mb-2">Remarks (Optional)</label>
                              <textarea
                                value={proofRemarks}
                                onChange={(e) => setProofRemarks(e.target.value)}
                                placeholder="Any additional information..."
                                rows={2}
                                className="w-full px-4 py-2.5 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900 resize-none"
                              />
                            </div>

                            {/* Submit Button */}
                            <button
                              onClick={submitPaymentProof}
                              disabled={submittingProof || !proofFile}
                              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {submittingProof ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-5 h-5" />
                                  <span>Submit Payment Proof</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Previous Submissions */}
                      {myPaymentProofs.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Your Previous Submissions
                          </h4>
                          <div className="space-y-3">
                            {myPaymentProofs.map((proof) => (
                              <div
                                key={proof._id}
                                className={`p-4 rounded-lg border ${proof.status === 'VERIFIED' ? 'bg-green-50 border-green-200' :
                                  proof.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                                    'bg-yellow-50 border-yellow-200'
                                  }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getProofStatusColor(proof.status)}`}>
                                        {getProofStatusIcon(proof.status)}
                                        {proof.status}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(proof.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">₹{proof.amountPaid.toLocaleString()}</p>
                                    <p className="text-xs text-gray-600 font-mono truncate">UTR: {proof.transactionReference}</p>
                                    {proof.status === 'REJECTED' && proof.rejectionReason && (
                                      <p className="text-xs text-red-600 mt-1">Reason: {proof.rejectionReason}</p>
                                    )}
                                  </div>
                                  {proof.proofImage?.url && (
                                    <a
                                      href={proof.proofImage.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-[#10B4A3] transition-colors"
                                    >
                                      <img
                                        src={proof.proofImage.url}
                                        alt="Payment proof"
                                        className="w-full h-full object-cover"
                                      />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {loadingProofs && (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-[#10B4A3] mr-2" />
                          <span className="text-sm text-gray-600">Loading submissions...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Customer Details Status */}
        <ApplicationStatus data={data} />

      </div>
    </>
  );
}



{/* UPI Payment Option */ }
{/* <div className="mt-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="w-5 h-5 text-purple-700" />
                        <h4 className="text-base font-semibold text-purple-900">Pay via UPI</h4>
                      </div>
                      <p className="text-sm text-purple-700 mb-2">
                        You can also pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)
                      </p>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                        <div>
                          <p className="text-xs text-gray-500">UPI ID</p>
                          <p className="text-sm font-bold text-gray-900 font-mono">401655461518@RATN0000315.ifsc.npci</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('401655461518@RATN0000315.ifsc.npci');
                            toast({ variant: "success", title: "Copied!", description: "UPI ID copied to clipboard" });
                          }}
                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                    </div> */}