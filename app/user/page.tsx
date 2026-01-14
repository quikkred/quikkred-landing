'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  CopyIcon, ExternalLink, ChevronRight, Sparkles, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { API_BASE_URL } from '@/lib/config';
import { useDashboard } from '@/store/hooks/useDashboard';
import { useLoans } from '@/store/hooks/useLoans';
import { signOut } from 'next-auth/react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface LoanSummary {
  productName: string;
  _id: string;
  loanNumber: string;
  principalAmount: number;
}

interface ActiveLoanDetails {
  _id: string;
  loanNumber: string;
  tenure: number;
  tenureUnit: string;
  emiAmount: number;
  maturityDate: string;
  firstDueDate: string;
  nextDueDate: string;
  status: string;
  overdueCount: number;
  lateCharges: number;
  paidAmount: number;
  totalEMIsPaid: number;
  installment: number;
}

interface DashboardData {
  customerId: string;
  oldApplication: boolean;
  oldApplicationNumber: string | null;
  oldApplicationDate: string | null;
  isBasicDetailsFilled: boolean;
  isKycDetailsFilled: boolean;
  isBankDetailsFilled: boolean;
  isSubmit: boolean;
  activeLoan: boolean;
  loans: LoanSummary[];
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    loanNumber: string;
    paymentAmount: number;
    emisPaid: number;
    overdueCleared: number;
    lateChargesPaid: number;
    remainingOutstanding: number;
    remainingEMIs: number;
    currentStatus: string;
    nextDueDate: string;
    customerBalance: number;
    paymentDetails: {
      principalPaid: number;
      interestPaid: number;
      totalPaid: number;
    };
  };
}

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

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
  const [selectedLoanNumber, setSelectedLoanNumber] = useState<string>('');
  const [activeLoanDetails, setActiveLoanDetails] = useState<ActiveLoanDetails | null>(null);
  const [loadingLoanDetails, setLoadingLoanDetails] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const isProcessingRef = useRef(false);

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

  // Set default amount to remaining amount when loan details are loaded
  useEffect(() => {
    if (activeLoanDetails && !customAmount) {
      const remaining = getTotalLoanAmount() - (activeLoanDetails.paidAmount || 0);
      setCustomAmount(remaining.toString());
    }
  }, [activeLoanDetails]);

  // Fetch active loan details using Redux
  const fetchActiveLoanDetails = async (loanNumber: string) => {
    if (!loanNumber) return;

    setCustomAmount(''); // Reset custom amount

    const result = await reduxFetchActiveLoan(loanNumber);

    if (result?.requiresAuth) {
      router.push('/login');
      return;
    }

    if (result?.success) {
      console.log('✅ Active loan details loaded successfully');
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

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!user) {
  //       console.log('No user found, redirecting to login');
  //       router.push('/login');
  //       return;
  //     }

  //     if (user.role !== 'USER' && user.role !== 'CUSTOMER') {
  //       console.log('User not authorized for user dashboard:', user.role);
  //       router.push('/login');
  //       return;
  //     }

  //     console.log('User authorized for user dashboard:', user.role);
  //   }
  // }, [user, isLoading, router]);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data using Redux
  const fetchUserData = async () => {
    const result = await reduxFetchDashboard();

    if (result?.requiresAuth) {
      router.push('/login');
      return;
    }

    if (result?.success) {
      console.log('✅ Dashboard data loaded successfully');
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
    return activeLoanDetails.emiAmount; // emiAmount is the total loan amount
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

      const token = localStorage.getItem('authToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');

      if (!token) {
        toast({
          variant: "error",
          title: "Authentication Error",
          description: "Please login again to continue."
        });
        router.push('/login');
        return;
      }

      // Show processing toast
      toast({
        variant: "default",
        title: "Processing Payment",
        description: `Processing payment of ₹${totalAmount.toLocaleString()}...`
      });

      const payinResponse = await fetch(`${API_BASE_URL}/api/emi/customerEmiPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentAmount: totalAmount,
          loanId: activeLoanDetails._id
        })
      });

      // Check if token expired (401 Unauthorized)
      if (payinResponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = 'auth-token=; path=/; max-age=0';
        document.cookie = 'user-role=; path=/; max-age=0';

        await signOut({ callbackUrl: "/login" });
        // router.push('/login');

        setProcessingPayment(false);
        isProcessingRef.current = false;
        return;
      }

      const payinResult = await payinResponse.json();

      if (!payinResponse.ok || !payinResult.success) {
        throw new Error(payinResult.message || 'Failed to initiate payment');
      }

      // Step 2: Get order_id (transactionId) and amount from response
      // transactionId is the Razorpay order_id (starts with "order_")
      const orderId = payinResult.data?.transactionId;
      const paymentAmount = payinResult.data?.paymentAmount || totalAmount;
      const amountInPaise = paymentAmount * 100; // Convert to paise

      if (!orderId) {
        console.error('Order ID (transactionId) not found in response:', payinResult.data);
        throw new Error('Order ID not received from server');
      }

      console.log('Payin initiated successfully, Order ID:', orderId, 'Amount:', amountInPaise, 'paise');

      // Step 3: Open Razorpay checkout with order details from API response
      const options = {
        key: "rzp_test_RudM9P8MHGIuf2",
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
          console.log("Payment completed:", response);

          // Step 4: Call verify API
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/api/disbursement/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyResult = await verifyResponse.json();

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
            console.log("Payment cancelled");
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
        console.log("Payment Failed:", response.error);
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

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
  //       <div className="text-center">
  //         <motion.div
  //           animate={{ rotate: 360 }}
  //           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  //           className="w-16 h-16 border-4 border-[#10B4A3] border-t-transparent rounded-full mx-auto"
  //         />
  //         <p className="mt-4 text-[#737373]">Checking authorization...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
      <>
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#10B4A3] border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-[#737373]">Loading your dashboard...</p>
          </div>
        </div>
      </>
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
        {data?.oldApplication && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200 mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-amber-500/20 rounded-lg sm:rounded-xl">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-2 sm:mb-3">Previous Application Found</h3>
                {(data?.oldApplicationNumber || data?.oldApplicationDate) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {data?.oldApplicationNumber && (
                      <div>
                        <p className="text-sm text-amber-700 mb-1">Application Number</p>
                        <p className="text-base font-semibold text-amber-900">
                          {data.oldApplicationNumber}
                        </p>
                      </div>
                    )}

                    {data?.oldApplicationDate && (
                      <div>
                        <p className="text-sm text-amber-700 mb-1">Application Date</p>
                        <p className="text-base font-semibold text-amber-900">
                          {formatDate(data.oldApplicationDate)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => router.push('/apply/quick')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Continue Application</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

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
                      {data.loans.map((loan) => (
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
                    <p className="text-sm sm:text-base font-semibold text-green-900">₹{activeLoanDetails.emiAmount.toLocaleString()}</p>
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
                      Pay Installment
                    </h3>

                    {activeLoanDetails.overdueCount > 0 && (
                      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 mb-4 border border-red-200">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-red-900">Payment Failed Alert</p>
                            <p className="text-xs text-red-700 mt-1">
                              {activeLoanDetails.overdueCount} payment attempt{activeLoanDetails.overdueCount > 1 ? 's' : ''} failed.
                              You have ₹{getRemainingAmount().toLocaleString()} remaining to pay. Please complete payment to avoid penalties.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeLoanDetails.overdueCount === 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900">Pay Your Installment</p>
                            <p className="text-xs text-blue-700 mt-1">
                              You have ₹{getRemainingAmount().toLocaleString()} remaining to complete your loan (Installment #{getCurrentInstallment()}).
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Payment Amount Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Payment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder={getRemainingAmount().toLocaleString()}
                            min="1"
                            max={getRemainingAmount()}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B4A3] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          You can reduce the amount to pay partially
                        </p>
                      </div>

                      {/* Payment Summary Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">





                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePayment}
                      disabled={processingPayment || !razorpayLoaded}
                      className={`w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#10B4A3] to-[#0E9A8B] text-white rounded-lg hover:shadow-lg transition-all font-semibold text-base sm:text-lg ${processingPayment || !razorpayLoaded ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                      {processingPayment ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pay ₹{calculateTotalPayment().toLocaleString()}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Customer Details Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E5E5E5] mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#0A0A0A] mb-4 sm:mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B4A3]" />
            Application Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isBasicDetailsFilled
                ? 'bg-green-50 border-green-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {data?.isBasicDetailsFilled ? (
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Basic Details</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {data?.isBasicDetailsFilled ? 'Completed ✓' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isKycDetailsFilled
                ? 'bg-green-50 border-green-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {data?.isKycDetailsFilled ? (
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">KYC Details</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {data?.isKycDetailsFilled ? 'Completed ✓' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isBankDetailsFilled
                ? 'bg-green-50 border-green-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {data?.isBankDetailsFilled ? (
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Bank Details</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {data?.isBankDetailsFilled ? 'Completed ✓' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isSubmit
                ? 'bg-green-50 border-green-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {data?.isSubmit ? (
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Final Submission</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {data?.isSubmit ? 'Completed ✓' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </>
  );
}