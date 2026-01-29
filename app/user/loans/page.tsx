'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from "nextjs-toploader/app";
import {
  CreditCard, IndianRupee, Calendar, Clock, Plus,
  TrendingUp, Target, CheckCircle, Eye,
  EyeOff, Download, Search,
  FileText, AlertCircle, Wallet,
  RefreshCw, BarChart3, X,
  ChevronLeft, ChevronRight, Building, User, Receipt,
  RotateCcw, Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loansService } from '@/lib/api/loans.service';
import { usersService } from '@/lib/api/users.service';
import { upiAutopayService } from '@/lib/api/upi-autopay.service';
import { API_BASE_URL } from '@/lib/config';
import getToken from '@/lib/getToken';
import useAxios from '@/hooks/useAxios';

interface Loan {
  id: string;
  loanNumber: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  tenureUnit: string;
  totalRepayment: number;
  emiAmount: number;
  disbursementAmount: number;
  status: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerId?: string;
  dpd?: number;
  nextDueDate?: string;
}

interface PaymentHistoryItem {
  _id: string;
  paymentNumber: string;
  applicationId: string;
  paymentDate: string;
  amount: number;
  paymentMode: string;
  payinNumber: string;
  transactionId: string;
  utrNumber: string;
  receiptNumber: string;
  status: string;
  createdAt: string;
}

interface DetailedLoan {
  _id: string;
  loanNumber: string;
  applicationId: string;
  customerId: {
    _id: string;
    email: string;
    fullName: string;
    mobile?: string;
  };
  productId?: string;
  productName: string;
  principalAmount: number;
  processingFee?: number;
  processingPercent?: number;
  gstOnProcessingFee?: number;
  gstOnProcessingPercent?: number;
  totalInterest?: number;
  interestRate: number;
  tenure: number;
  tenureUnit: string;
  isSubmit: boolean;
  totalRepayment: number;
  emiAmount: number;
  lateCharges?: number;
  numberOfEMIs: number;
  repaymentType: string;
  disbursementAmount: number;
  disbursementDate: string;
  disbursementMode: string;
  disbursementTransactionId: string;
  disbursementUTR?: string;
  maturityDate: string;
  lateChargesDate?: string;
  principalOutstanding: number;
  interestOutstanding: number;
  lateChargesOutstanding: number;
  lateChargesPerDay?: number;
  totalOutstanding: number;
  firstDueDate: string;
  nextDueDate: string | null;
  overdueCount?: number;
  dpd: number;
  dpdBucket: string;
  status: string;
  paymentBehavior: {
    totalEMIsPaid: number;
    totalEMIsMissed: number;
    onTimePayments: number;
    latePayments: number;
    averageDelayDays?: number;
    lastPaymentDelay?: number;
    bounceCount: number;
    partialPaymentCount: number;
  };
  schedule: Array<{
    installmentNo: number;
    dueDate: string;
    emiAmount: number;
    principal: number;
    interest: number;
    totalDue: number;
    paidAmount: number;
    paidDate?: string | null;
    status: string;
    balance: number;
    lateCharges: number;
    lateChargesPaid?: number;
    paymentMode?: string | null;
    transactionId?: string | null;
    _id: string;
  }>;
  paymentHistory?: PaymentHistoryItem[];
  createdBy?: {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
  };
  branch: string;
  branchId?: string | null;
  isDeleted?: boolean;
  isRestructured?: boolean;
  isSettled?: boolean;
  isWrittenOff?: boolean;
  isUnderLegalAction?: boolean;
  ptpHistory: any[];
  restructuringHistory: any[];
  createdAt: string;
  updatedAt: string;
  lastPaymentDate?: string;
  closureDate?: string;
}

interface LoanCalculation {
  ACTIVE: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
    totalOutstanding: number;
    principalOutstanding: number;
    interestOutstanding: number;
    lateChargesOutstanding: number;
  };
  OVERDUE: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
    totalOutstanding: number;
    principalOutstanding: number;
    interestOutstanding: number;
    lateChargesOutstanding: number;
  };
  NPA: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
    totalOutstanding: number;
    principalOutstanding: number;
    interestOutstanding: number;
    lateChargesOutstanding: number;
  };
  CLOSED: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
    totalOutstanding: number;
    principalOutstanding: number;
    interestOutstanding: number;
    lateChargesOutstanding: number;
  };
  WRITTEN_OFF: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
    totalOutstanding: number;
    principalOutstanding: number;
    interestOutstanding: number;
    lateChargesOutstanding: number;
  };
  PENDING: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
    totalOutstanding: number;
    principalOutstanding: number;
    interestOutstanding: number;
    lateChargesOutstanding: number;
  };
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export default function MyLoansPage() {
  const { user, isLoading } = useAuth();
  const axios = useAxios();
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalanceActive, setShowBalanceActive] = useState(false);
  const [showBalanceOverdue, setShowBalanceOverdue] = useState(false);
  const [showBalanceClosed, setShowBalanceClosed] = useState(false);
  const [showBalancePending, setShowBalancePending] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [detailedLoan, setDetailedLoan] = useState<DetailedLoan | null>(null);
  const [loanCalculation, setLoanCalculation] = useState<LoanCalculation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10
  });

  // New Loan Application Modal State
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isReapplyModalOpen, setIsReapplyModalOpen] = useState(false);
  const [isUpiAutopayModalOpen, setIsUpiAutopayModalOpen] = useState(false);
  const [selectedLoanForReapply, setSelectedLoanForReapply] = useState<Loan | null>(null);
  const [selectedLoanForAutopay, setSelectedLoanForAutopay] = useState<Loan | null>(null);
  const [reapplyLoading, setReapplyLoading] = useState(false);
  const [autopayLoading, setAutopayLoading] = useState(false);
  const [newLoanLoading, setNewLoanLoading] = useState(false);

  // Reapply State
  const [reapplyEligibility, setReapplyEligibility] = useState<{
    eligible: boolean;
    maxAmount?: number;
    minAmount?: number;
    reason?: string;
  } | null>(null);
  const [reapplyForm, setReapplyForm] = useState({
    loanAmount: '',
    tenure: '30',
    purpose: ''
  });
  const [reapplyError, setReapplyError] = useState<string | null>(null);
  const [reapplySuccess, setReapplySuccess] = useState<string | null>(null);

  // UPI Autopay State
  const [autopayForm, setAutopayForm] = useState({
    amount: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'as_presented',
    vpa: ''
  });
  const [autopayError, setAutopayError] = useState<string | null>(null);
  const [autopaySuccess, setAutopaySuccess] = useState<string | null>(null);
  const [autopayResult, setAutopayResult] = useState<{
    subscriptionId: string;
    shortUrl: string;
    status: string;
  } | null>(null);
  const [newLoanError, setNewLoanError] = useState<string | null>(null);
  const [newLoanSuccess, setNewLoanSuccess] = useState<string | null>(null);
  const [newLoanForm, setNewLoanForm] = useState({
    loanAmount: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });

  // New Loan Application - Enhanced Flow State
  const [newLoanStep, setNewLoanStep] = useState<'amount' | 'bank' | 'success'>('amount');
  const [bankSelectionMode, setBankSelectionMode] = useState<'existing' | 'new' | null>(null);
  const [savedBanks, setSavedBanks] = useState<Array<{
    id: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName?: string;
    isPrimary: boolean;
  }>>([]);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [loadingSavedBanks, setLoadingSavedBanks] = useState(false);
  const [newLoanResult, setNewLoanResult] = useState<{
    applicationId: string;
    applicationNumber: string;
    loanAmount: number;
    priority: string;
  } | null>(null);

  // Check authentication and authorization
  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!user) {
  //       router.push('/login');
  //       return;
  //     }

  //     if (false) {
  //       router.push('/login');
  //       return;
  //     }
  //   }
  // }, [user, isLoading, router]);

  // Fetch loans data
  useEffect(() => {
    fetchLoans();
    fetchLoanCalculation();
  }, [pagination.page, pagination.limit]);

  const fetchLoanCalculation = async () => {
    try {
      const response = await loansService.getLoanCalculation();
      if (response.success && response.data) {
        setLoanCalculation(response.data);
      }
    } catch (error) {
      console.error('Error fetching loan calculation:', error);
    }
  };

  const fetchLoans = async (page?: number, limit?: number) => {
    try {
      setLoading(true);

      // const token = await getToken();

      // if (!token) {
      //   router.push('/login');
      //   return;
      // }

      const currentPage = page || pagination.page;
      const currentLimit = limit || pagination.limit;

      // const response = await fetch(
      //   `${API_BASE_URL}/api/loans/get?page=${currentPage}&limit=${currentLimit}`,
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`
      //     }
      //   }
      // );

      // // Check if token expired (401 Unauthorized) - Full logout and redirect
      // if (response.status === 401) {
      //   // Check if user just logged in - don't clear storage during grace period
      //   const loginTimestamp = localStorage.getItem('loginTimestamp');
      //   const justLoggedIn = loginTimestamp &&
      //     (Date.now() - parseInt(loginTimestamp, 10)) < 10000; // 10 second grace period

      //   if (!justLoggedIn) {
      //     // Clear all authentication tokens
      //     localStorage.removeItem('token');
      //     localStorage.removeItem('authToken');
      //     localStorage.removeItem('accessToken');
      //     localStorage.removeItem('refreshToken');
      //     localStorage.removeItem('loginTimestamp');

      //     // Clear user data
      //     localStorage.removeItem('userRole');
      //     localStorage.removeItem('role');
      //     localStorage.removeItem('userEmail');
      //     localStorage.removeItem('email');
      //     localStorage.removeItem('userName');
      //     localStorage.removeItem('userId');
      //     localStorage.removeItem('userMobile');
      //     localStorage.removeItem('customerUniqueId');

      //     // Clear cookies
      //     document.cookie = 'auth-token=; path=/; max-age=0';
      //     document.cookie = 'user-role=; path=/; max-age=0';

      //     // Redirect to login
      //     router.push('/login');
      //     return;
      //   }
      // }

      // const result = await response.json();
      const response = await axios.get(`/api/loans/get?page=${currentPage}&limit=${currentLimit}`);
      const result = response.data;

      if ((response.status === 200 || response.status === 201) && result.success && result.data) {
        const mappedLoans = result.data.map((loan: any) => ({
          id: loan._id,
          loanNumber: loan.loanNumber,
          principalAmount: loan.principalAmount || 0,
          interestRate: loan.interestRate || 0,
          tenure: loan.tenure || 0,
          tenureUnit: loan.tenureUnit || 'months',
          totalRepayment: loan.totalRepayment || 0,
          emiAmount: loan.emiAmount || 0,
          disbursementAmount: loan.disbursementAmount || 0,
          status: loan.status,
          createdAt: loan.createdAt,
          customerName: loan.customerId?.fullName,
          customerEmail: loan.customerId?.email,
          customerId: loan.customerId?._id,
          dpd: loan.dpd || 0,
          nextDueDate: loan.nextDueDate
        }));

        setLoans(mappedLoans);

        // Update pagination info
        if (result.pagination) {
          setPagination({
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
            page: result.pagination.page,
            limit: result.pagination.limit
          });
        }
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Fetch detailed loan by loan number
  const fetchDetailedLoan = async (loanNumber: string) => {
    try {
      setLoadingDetails(true);
      const response = await loansService.getLoanByLoanNumber(loanNumber);
      if (response.success && response.data) {
        setDetailedLoan(response.data);
      }
    } catch (error) {
      console.error('Error fetching detailed loan:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle view details
  const handleViewDetails = async (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
    await fetchDetailedLoan(loan.loanNumber);
  };

  // Fetch saved bank accounts
  const fetchSavedBanks = async () => {
    setLoadingSavedBanks(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/customer/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success && result.data && result.data.banks) {
        setSavedBanks(result.data.banks.map((bank: any, index: number) => ({
          id: bank._id || `bank-${index}`,
          accountNumber: bank.accountNumber,
          ifscCode: bank.ifscCode,
          bankName: bank.bankName,
          accountHolderName: bank.accountHolderName,
          isPrimary: index === 0
        })));
      }
    } catch (error) {
      console.error('Error fetching saved banks:', error);
    } finally {
      setLoadingSavedBanks(false);
    }
  };

  // Handle bank selection from existing banks
  const handleSelectExistingBank = (bankId: string) => {
    setSelectedBankId(bankId);
    const selectedBank = savedBanks.find(bank => bank.id === bankId);
    if (selectedBank) {
      setNewLoanForm(prev => ({
        ...prev,
        bankName: selectedBank.bankName,
        accountNumber: selectedBank.accountNumber,
        ifscCode: selectedBank.ifscCode,
        accountHolderName: selectedBank.accountHolderName || ''
      }));
    }
  };

  // Validate loan amount and proceed to bank step
  const handleProceedToBank = () => {
    setNewLoanError(null);
    const amount = Number(newLoanForm.loanAmount);
    if (!amount || amount < 1000) {
      setNewLoanError('Please enter a valid loan amount (minimum ₹1,000)');
      return;
    }
    if (amount > 500000) {
      setNewLoanError('Maximum loan amount is ₹5,00,000');
      return;
    }
    setNewLoanStep('bank');
    fetchSavedBanks();
  };

  // Validate bank details
  const validateBankDetails = (): boolean => {
    if (!newLoanForm.accountHolderName.trim()) {
      setNewLoanError('Please enter account holder name');
      return false;
    }
    if (!newLoanForm.bankName.trim()) {
      setNewLoanError('Please enter bank name');
      return false;
    }
    if (!newLoanForm.accountNumber.trim() || newLoanForm.accountNumber.length < 9) {
      setNewLoanError('Please enter a valid account number (minimum 9 digits)');
      return false;
    }
    if (!newLoanForm.ifscCode.trim() || newLoanForm.ifscCode.length !== 11) {
      setNewLoanError('Please enter a valid IFSC code (11 characters)');
      return false;
    }
    return true;
  };

  // Handle new loan application submission
  const handleNewLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewLoanError(null);

    // Validate bank details
    if (!validateBankDetails()) {
      return;
    }

    setNewLoanLoading(true);

    try {
      // const token = await getToken();

      // if (!token) {
      //   router.push('/login');
      //   return;
      // }

      const payload = {
        loanAmount: Number(newLoanForm.loanAmount),
        bankDetails: {
          bankName: newLoanForm.bankName,
          accountNumber: newLoanForm.accountNumber,
          ifscCode: newLoanForm.ifscCode,
          accountHolderName: newLoanForm.accountHolderName,
          isBankDetailsFilled: true
        }
      };

      // const response = await fetch(`${API_BASE_URL}/api/application/loan/new`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(payload)
      // });

      // const result = await response.json();
      const response = await axios.post("/api/application/loan/new", payload);
      const result = response.data;

      if (result.success) {
        // Store success data and show confirmation screen
        setNewLoanResult({
          applicationId: result.data?.applicationId || result.applicationId || '',
          applicationNumber: result.data?.applicationNumber || result.applicationNumber || '',
          loanAmount: result.data?.loanAmount || Number(newLoanForm.loanAmount),
          priority: result.data?.priority || 'Medium'
        });
        setNewLoanStep('success');
      } else {
        setNewLoanError(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      setNewLoanError('An error occurred while submitting your application. Please try again.');
    } finally {
      setNewLoanLoading(false);
    }
  };

  // Reset new loan modal
  const resetNewLoanModal = () => {
    setIsNewLoanModalOpen(false);
    setNewLoanError(null);
    setNewLoanSuccess(null);
    setNewLoanStep('amount');
    setBankSelectionMode(null);
    setSelectedBankId(null);
    setNewLoanResult(null);
    setNewLoanForm({
      loanAmount: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    });
  };

  // ============ REAPPLY HANDLERS ============
  const handleOpenReapplyModal = async (loan: Loan) => {
    setSelectedLoanForReapply(loan);
    setReapplyError(null);
    setReapplySuccess(null);
    setReapplyLoading(true);
    setIsReapplyModalOpen(true);

    try {
      const response = await loansService.checkReapplyEligibility(loan.customerId);
      if (response.success && response.data) {
        setReapplyEligibility({
          eligible: response.data.eligible ?? true,
          maxAmount: response.data.maxAmount ?? 500000,
          minAmount: response.data.minAmount ?? 10000,
          reason: response.data.reason
        });
        if (response.data.maxAmount) {
          setReapplyForm(prev => ({ ...prev, loanAmount: String(response.data.maxAmount / 2) }));
        }
      } else {
        setReapplyEligibility({ eligible: true, maxAmount: 500000, minAmount: 10000 });
      }
    } catch (error: any) {
      console.error('Error checking reapply eligibility:', error);
      setReapplyEligibility({ eligible: true, maxAmount: 500000, minAmount: 10000 });
    } finally {
      setReapplyLoading(false);
    }
  };

  const handleSubmitReapplication = async () => {
    if (!selectedLoanForReapply?.customerId) {
      setReapplyError('Customer information not found');
      return;
    }

    const amount = Number(reapplyForm.loanAmount);
    if (!amount || amount < 10000) {
      setReapplyError('Please enter a valid loan amount (minimum Rs. 10,000)');
      return;
    }
    if (amount > 500000) {
      setReapplyError('Maximum loan amount is Rs. 5,00,000');
      return;
    }

    setReapplyLoading(true);
    setReapplyError(null);

    try {
      const response = await loansService.submitReapplication({
        customerId: selectedLoanForReapply.customerId,
        loanAmount: amount,
        tenure: Number(reapplyForm.tenure),
        purpose: reapplyForm.purpose || 'Repeat Loan',
        notes: 'Reapplication from customer dashboard'
      });

      if (response.success) {
        setReapplySuccess('Your reapplication has been submitted successfully! We will process it shortly.');
        setTimeout(() => {
          resetReapplyModal();
          fetchLoans();
        }, 3000);
      } else {
        setReapplyError(response.message || 'Failed to submit reapplication');
      }
    } catch (error: any) {
      console.error('Error submitting reapplication:', error);
      setReapplyError(error.message || 'An error occurred while submitting your reapplication');
    } finally {
      setReapplyLoading(false);
    }
  };

  const resetReapplyModal = () => {
    setIsReapplyModalOpen(false);
    setSelectedLoanForReapply(null);
    setReapplyEligibility(null);
    setReapplyError(null);
    setReapplySuccess(null);
    setReapplyForm({ loanAmount: '', tenure: '30', purpose: '' });
  };

  // ============ UPI AUTOPAY HANDLERS ============
  const handleOpenAutopayModal = (loan: Loan) => {
    setSelectedLoanForAutopay(loan);
    setAutopayError(null);
    setAutopaySuccess(null);
    setAutopayResult(null);
    // Pre-fill with EMI amount
    setAutopayForm({
      amount: String(loan.emiAmount || loan.totalRepayment || ''),
      frequency: 'monthly',
      vpa: ''
    });
    setIsUpiAutopayModalOpen(true);
  };

  const handleSetupAutopay = async () => {
    if (!selectedLoanForAutopay) {
      setAutopayError('Loan information not found');
      return;
    }

    const amount = Number(autopayForm.amount);
    if (!amount || amount < 100) {
      setAutopayError('Please enter a valid amount (minimum Rs. 100)');
      return;
    }

    setAutopayLoading(true);
    setAutopayError(null);

    try {
      const response = await upiAutopayService.setupAutopay({
        customerId: selectedLoanForAutopay.customerId || '',
        loanId: selectedLoanForAutopay.id,
        amount: amount,
        frequency: autopayForm.frequency,
        vpa: autopayForm.vpa || undefined
      });

      if (response.success && response.data) {
        setAutopayResult({
          subscriptionId: response.data.subscriptionId,
          shortUrl: response.data.shortUrl,
          status: response.data.status
        });
        setAutopaySuccess('UPI Autopay setup initiated! Please complete the authorization.');
      } else {
        setAutopayError(response.message || 'Failed to setup autopay');
      }
    } catch (error: any) {
      console.error('Error setting up autopay:', error);
      setAutopayError(error.message || 'An error occurred while setting up autopay');
    } finally {
      setAutopayLoading(false);
    }
  };

  const resetAutopayModal = () => {
    setIsUpiAutopayModalOpen(false);
    setSelectedLoanForAutopay(null);
    setAutopayError(null);
    setAutopaySuccess(null);
    setAutopayResult(null);
    setAutopayForm({ amount: '', frequency: 'monthly', vpa: '' });
  };

  // Check if loan is eligible for reapply (CLOSED status)
  const isEligibleForReapply = (loan: Loan) => {
    const status = loan.status.toUpperCase();
    return status === 'CLOSED' || status === 'COMPLETED';
  };

  // Check if loan is eligible for autopay (ACTIVE status)
  const isEligibleForAutopay = (loan: Loan) => {
    const status = loan.status.toUpperCase();
    return status === 'ACTIVE';
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount && amount !== 0) {
      return '₹0';
    }
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'DISBURSED':
        return 'text-[#25B181] bg-[#2E7D32]/10';
      case 'PENDING':
        return 'text-[#FBC02D] bg-[#FBC02D]/10';
      case 'PROCESSING':
        return 'text-[#4A66FF] bg-[#4A66FF]/10';
      case 'CLOSED':
      case 'COMPLETED':
        return 'text-gray-600 bg-gray-100';
      case 'REJECTED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'APPROVED':
        return 'text-[#25B181] bg-[#2E7D32]/10';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter loans
  const filteredLoans = loans.filter(loan => {
    const statusUpper = loan.status.toUpperCase();
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && statusUpper === 'ACTIVE') ||
      (filterStatus === 'closed' && (statusUpper === 'CLOSED' || statusUpper === 'COMPLETED'));

    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.customerName && loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Get active loans for filter count
  const activeLoans = loans.filter(loan => loan.status.toUpperCase() === 'ACTIVE');

  // Show loading while checking authentication
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#2E7D32] border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-gray-600">Loading your loans...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not authorized
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F8F68] flex items-center gap-2 sm:gap-3">
              <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A66FF]" />
              My Loans
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all your loans in one place</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                fetchLoans();
                fetchLoanCalculation();
              }}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {/* Apply New button */}
            {/* <button
              onClick={() => setIsNewLoanModalOpen(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Summary Cards - New Layout */}
      <div className="mb-4 sm:mb-6">
        {/* All Cards in One Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Active Loans */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBalanceActive(!showBalanceActive)}
                  className="p-1 hover:bg-green-200/50 rounded transition-colors"
                  title={showBalanceActive ? 'Hide Balance' : 'Show Balance'}
                >
                  {showBalanceActive ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />}
                </button>
                <span className="px-2 py-0.5 sm:py-1 bg-green-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                  ACTIVE
                </span>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Loan Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-green-700">
                  {showBalanceActive ? formatCurrency(loanCalculation?.ACTIVE?.totalLoanAmount || 0) : '••••••'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-green-200">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Interest</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    {showBalanceActive ? formatCurrency(loanCalculation?.ACTIVE?.totalInterest || 0) : '••••••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-gray-600">Count</p>
                  <p className="text-base sm:text-lg font-bold text-green-600">
                    {loanCalculation?.ACTIVE?.totalCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Loans */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBalanceOverdue(!showBalanceOverdue)}
                  className="p-1 hover:bg-orange-200/50 rounded transition-colors"
                  title={showBalanceOverdue ? 'Hide Balance' : 'Show Balance'}
                >
                  {showBalanceOverdue ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />}
                </button>
                <span className="px-2 py-0.5 sm:py-1 bg-orange-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                  OVERDUE
                </span>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Overdue Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-700">
                  {showBalanceOverdue ? formatCurrency(loanCalculation?.OVERDUE?.totalLoanAmount || 0) : '••••••'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-orange-200">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Interest</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    {showBalanceOverdue ? formatCurrency(loanCalculation?.OVERDUE?.totalInterest || 0) : '••••••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-gray-600">Count</p>
                  <p className="text-base sm:text-lg font-bold text-orange-600">
                    {loanCalculation?.OVERDUE?.totalCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Closed Loans */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-gray-500/20 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBalanceClosed(!showBalanceClosed)}
                  className="p-1 hover:bg-gray-200/50 rounded transition-colors"
                  title={showBalanceClosed ? 'Hide Balance' : 'Show Balance'}
                >
                  {showBalanceClosed ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />}
                </button>
                <span className="px-2 py-0.5 sm:py-1 bg-gray-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                  CLOSED
                </span>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Loan Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-700">
                  {showBalanceClosed ? formatCurrency(loanCalculation?.CLOSED?.totalLoanAmount || 0) : '••••••'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-200">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Interest</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    {showBalanceClosed ? formatCurrency(loanCalculation?.CLOSED?.totalInterest || 0) : '••••••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-gray-600">Count</p>
                  <p className="text-base sm:text-lg font-bold text-gray-600">
                    {loanCalculation?.CLOSED?.totalCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Outstanding Amount Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBalancePending(!showBalancePending)}
                  className="p-1 hover:bg-yellow-200/50 rounded transition-colors"
                  title={showBalancePending ? 'Hide Balance' : 'Show Balance'}
                >
                  {showBalancePending ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />}
                </button>
                <span className="px-2 py-0.5 sm:py-1 bg-yellow-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                  OUTSTANDING
                </span>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Outstanding principal Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-700">
                  {showBalancePending ? formatCurrency(loanCalculation?.ACTIVE?.principalOutstanding || 0) : '••••••'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-yellow-200">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Interest Outstanding</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    {showBalancePending ? formatCurrency(loanCalculation?.ACTIVE?.interestOutstanding || 0) : '••••••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-gray-600">Late Charges</p>
                  <p className="text-base sm:text-lg font-bold text-yellow-600">
                    {showBalancePending ? formatCurrency(loanCalculation?.ACTIVE?.lateChargesOutstanding || 0) : '••••••'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#E0E0E0] mb-4 sm:mb-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Loan Number, Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-[#FAFAFA] text-[#1F8F68] rounded-lg border border-[#E0E0E0] focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              All ({loans.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'active'
                  ? 'bg-[#4A66FF] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Active ({activeLoans.length})
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'closed'
                  ? 'bg-[#25B181] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Closed ({loans.filter(l => {
                const s = l.status.toLowerCase();
                return s === 'closed' || s === 'completed';
              }).length})
            </button>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#1F8F68] mb-2">No Loans Found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'You don\'t have any loans yet. Apply for a loan to get started!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Loan Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Principal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Repayment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Interest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Penalty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {filteredLoans.map((loan, index) => (
                  <tr
                    key={loan.id}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#1F8F68]">{loan.loanNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#1F8F68]">{formatCurrency(loan.principalAmount)}</div>
                      <div className="text-xs text-gray-500">Disbursed: {formatCurrency(loan.disbursementAmount)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(loan.totalRepayment)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(loan.principalAmount * loan.interestRate / 100)}</div>
                      <div className="text-xs text-gray-500">{loan.interestRate}%</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {loan.status === 'OVERDUE' && loan.dpd && loan.dpd > 0 ? (
                        <div>
                          <div className="text-sm font-medium text-red-600">{formatCurrency(loan.dpd * 50)}</div>
                          <div className="text-xs text-gray-500">{loan.dpd} days overdue</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewDetails(loan)}
                          className="inline-flex items-center px-3 py-1.5 bg-[#4A66FF] text-white text-xs font-medium rounded-lg hover:bg-[#4A66FF]/90 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </button>
                        {/* Reapply Button - Only for CLOSED loans */}
                        {isEligibleForReapply(loan) && (
                          <button
                            onClick={() => handleOpenReapplyModal(loan)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white text-xs font-medium rounded-lg hover:shadow-lg transition-all"
                            title="Apply for a new loan"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Reapply
                          </button>
                        )}
                        {/* UPI Autopay Button - Only for ACTIVE loans */}
                        {isEligibleForAutopay(loan) && (
                          <button
                            onClick={() => handleOpenAutopayModal(loan)}
                            className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                            title="Setup UPI Autopay"
                          >
                            <Zap className="w-3.5 h-3.5 mr-1" />
                            Autopay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredLoans.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6 bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-[#1F8F68]">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-semibold text-[#1F8F68]">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-semibold text-[#1F8F68]">{pagination.total}</span> loans
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
                className="hidden sm:flex px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-[#E0E0E0] rounded-lg hover:bg-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>

              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-[#E0E0E0] rounded-lg hover:bg-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pagination.page === pageNumber
                            ? 'bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white'
                            : 'text-gray-700 bg-white border border-[#E0E0E0] hover:bg-[#FAFAFA]'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === pagination.page - 2 ||
                    pageNumber === pagination.page + 2
                  ) {
                    return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-[#E0E0E0] rounded-lg hover:bg-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="hidden sm:flex px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-[#E0E0E0] rounded-lg hover:bg-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Last
              </button>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Per page:</label>
              <select
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-3 py-2 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* New Loan Application Modal - Multi-Step Flow */}
      {isNewLoanModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={resetNewLoanModal}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[calc(100vw-2rem)] sm:max-w-lg"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {newLoanStep === 'success' ? 'Application Submitted!' : 'New Loan Application'}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80">
                      {newLoanStep === 'amount' && 'Step 1: Enter loan amount'}
                      {newLoanStep === 'bank' && 'Step 2: Select bank account'}
                      {newLoanStep === 'success' && 'Your application is being processed'}
                    </p>
                  </div>
                  <button
                    onClick={resetNewLoanModal}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>

                {/* Progress indicator */}
                {newLoanStep !== 'success' && (
                  <div className="flex gap-2 mt-3">
                    <div className={`flex-1 h-1.5 rounded-full ${newLoanStep === 'amount' || newLoanStep === 'bank' ? 'bg-white' : 'bg-white/30'}`} />
                    <div className={`flex-1 h-1.5 rounded-full ${newLoanStep === 'bank' ? 'bg-white' : 'bg-white/30'}`} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {/* Error Message */}
                {newLoanError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{newLoanError}</p>
                  </div>
                )}

                {/* Step 1: Loan Amount */}
                {newLoanStep === 'amount' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How much do you need? <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          min="1000"
                          max="500000"
                          value={newLoanForm.loanAmount}
                          onChange={(e) => setNewLoanForm({ ...newLoanForm, loanAmount: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-xl focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-lg font-semibold"
                          placeholder="Enter loan amount"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Min: ₹1,000 | Max: ₹5,00,000</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        type="button"
                        onClick={resetNewLoanModal}
                        className="flex-1 px-4 py-2.5 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleProceedToBank}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Bank Selection */}
                {newLoanStep === 'bank' && (
                  <div className="space-y-4">
                    {/* Loan Amount Summary */}
                    <div className="bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 rounded-lg p-3 border border-[#25B181]/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Loan Amount</span>
                        <span className="text-lg font-bold text-[#1F8F68]">₹{Number(newLoanForm.loanAmount).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Bank Selection Mode */}
                    {!bankSelectionMode && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#4A66FF]" />
                          Select Bank Account
                        </h4>

                        {/* Use Existing Bank Option */}
                        <button
                          type="button"
                          onClick={() => setBankSelectionMode('existing')}
                          disabled={loadingSavedBanks}
                          className="w-full p-4 bg-white border-2 border-[#E0E0E0] rounded-xl hover:border-[#25B181] hover:bg-[#FAFAFA] transition-all text-left flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-[#4A66FF]/10 rounded-xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-[#4A66FF]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">Use Existing Bank</p>
                            <p className="text-xs text-gray-500">Select from your saved bank accounts</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Add New Bank Option */}
                        <button
                          type="button"
                          onClick={() => setBankSelectionMode('new')}
                          className="w-full p-4 bg-white border-2 border-[#E0E0E0] rounded-xl hover:border-[#25B181] hover:bg-[#FAFAFA] transition-all text-left flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-[#25B181]/10 rounded-xl flex items-center justify-center">
                            <Plus className="w-6 h-6 text-[#25B181]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">Add New Bank</p>
                            <p className="text-xs text-gray-500">Enter new bank account details</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    )}

                    {/* Existing Banks List */}
                    {bankSelectionMode === 'existing' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-800">Select Bank Account</h4>
                          <button
                            type="button"
                            onClick={() => {
                              setBankSelectionMode(null);
                              setSelectedBankId(null);
                            }}
                            className="text-xs text-[#4A66FF] hover:underline"
                          >
                            ← Back
                          </button>
                        </div>

                        {loadingSavedBanks ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 text-[#25B181] animate-spin" />
                          </div>
                        ) : savedBanks.length === 0 ? (
                          <div className="text-center py-6">
                            <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600 text-sm">No saved bank accounts</p>
                            <button
                              type="button"
                              onClick={() => setBankSelectionMode('new')}
                              className="mt-3 text-sm text-[#25B181] font-medium hover:underline"
                            >
                              + Add New Bank Account
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[250px] overflow-y-auto">
                            {savedBanks.map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => handleSelectExistingBank(bank.id)}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                  selectedBankId === bank.id
                                    ? 'border-[#25B181] bg-[#25B181]/5'
                                    : 'border-[#E0E0E0] hover:border-[#25B181]/50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    selectedBankId === bank.id ? 'bg-[#25B181]' : 'bg-gray-100'
                                  }`}>
                                    <Building className={`w-5 h-5 ${selectedBankId === bank.id ? 'text-white' : 'text-gray-500'}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm truncate">{bank.bankName}</p>
                                    <p className="text-xs text-gray-500">
                                      ****{bank.accountNumber.slice(-4)} • {bank.ifscCode}
                                    </p>
                                  </div>
                                  {bank.isPrimary && (
                                    <span className="px-2 py-0.5 bg-[#4A66FF]/10 text-[#4A66FF] text-[10px] font-semibold rounded-full">
                                      PRIMARY
                                    </span>
                                  )}
                                  {selectedBankId === bank.id && (
                                    <CheckCircle className="w-5 h-5 text-[#25B181]" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Submit with Selected Bank */}
                        {selectedBankId && (
                          <form onSubmit={handleNewLoanSubmit}>
                            <button
                              type="submit"
                              disabled={newLoanLoading}
                              className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {newLoanLoading ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Submit Application
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* Add New Bank Form */}
                    {bankSelectionMode === 'new' && (
                      <form onSubmit={handleNewLoanSubmit} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-800">Enter Bank Details</h4>
                          <button
                            type="button"
                            onClick={() => setBankSelectionMode(null)}
                            className="text-xs text-[#4A66FF] hover:underline"
                          >
                            ← Back
                          </button>
                        </div>

                        {/* Account Holder Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Holder Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newLoanForm.accountHolderName}
                            onChange={(e) => setNewLoanForm({ ...newLoanForm, accountHolderName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-sm"
                            placeholder="Enter account holder name"
                          />
                        </div>

                        {/* Bank Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newLoanForm.bankName}
                            onChange={(e) => setNewLoanForm({ ...newLoanForm, bankName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-sm"
                            placeholder="e.g., HDFC Bank, SBI, ICICI Bank"
                          />
                        </div>

                        {/* Account Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newLoanForm.accountNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              setNewLoanForm({ ...newLoanForm, accountNumber: value });
                            }}
                            maxLength={18}
                            className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-sm"
                            placeholder="Enter 9-18 digit account number"
                          />
                        </div>

                        {/* IFSC Code */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            IFSC Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newLoanForm.ifscCode}
                            onChange={(e) => setNewLoanForm({ ...newLoanForm, ifscCode: e.target.value.toUpperCase() })}
                            maxLength={11}
                            className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-sm uppercase"
                            placeholder="e.g., HDFC0001234"
                          />
                          <p className="text-xs text-gray-500 mt-1">11 character bank branch code</p>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={newLoanLoading}
                          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {newLoanLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Submit Application
                            </>
                          )}
                        </button>
                      </form>
                    )}

                    {/* Back Button (when no mode selected) */}
                    {!bankSelectionMode && (
                      <button
                        type="button"
                        onClick={() => setNewLoanStep('amount')}
                        className="w-full mt-2 px-4 py-2.5 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Amount
                      </button>
                    )}
                  </div>
                )}

                {/* Step 3: Success Screen */}
                {newLoanStep === 'success' && newLoanResult && (
                  <div className="text-center py-4">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#25B181] to-[#1F8F68] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
                    <p className="text-sm text-gray-600 mb-6">Your loan application has been successfully submitted.</p>

                    {/* Application Details */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 space-y-3 text-left">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-[#4A66FF]" />
                          Application No.
                        </span>
                        <span className="font-bold text-[#1F8F68]">{newLoanResult.applicationNumber}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-[#4A66FF]" />
                          Loan Amount
                        </span>
                        <span className="font-bold text-gray-800">₹{newLoanResult.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#4A66FF]" />
                          Priority
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          newLoanResult.priority === 'High' ? 'bg-red-100 text-red-700' :
                          newLoanResult.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {newLoanResult.priority}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => {
                          resetNewLoanModal();
                          fetchLoans();
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => {
                          resetNewLoanModal();
                          router.push('/user/applications');
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        View All Applications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Loan Detail Modal */}
      {isDetailModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => {
                setIsDetailModalOpen(false);
                setDetailedLoan(null);
              }}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[calc(100vw-2rem)] sm:max-w-7xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">Loan Details</h3>
                    <p className="text-xs sm:text-sm text-white/80">Loan No: {selectedLoan.loanNumber}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setDetailedLoan(null);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-[#25B181] animate-spin" />
                </div>
              ) : detailedLoan ? (
                <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                  {/* Customer & Product Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Customer & Product Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-1 sm:gap-1">
                      <div>
                        <p className="text-sm text-gray-600">Customer Name</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.customerId.fullName .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Customer Email</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.customerId.email}</p>
                      </div>
                      {/* <div>
                        <p className="text-sm text-gray-600">Product Name</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.productName}</p>
                      </div> */}
                      {detailedLoan.branch && (
                      <div>
                        <p className="text-sm text-gray-600">Branch</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.branch.replace(/_/g, ' ')}</p>
                      </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detailedLoan.status)}`}>
                          {detailedLoan.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Repayment Type</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.repaymentType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Loan Overview */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Loan Overview</h4>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Principal Amount</p>
                        <p className="text-lg font-bold text-green-700">{formatCurrency(detailedLoan.principalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tenure</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.tenure} {detailedLoan.tenureUnit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Interest</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(detailedLoan.totalInterest || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Repayment</p>
                        <p className="text-lg font-bold text-green-700">{formatCurrency(detailedLoan.totalRepayment)}</p>
                      </div>
                      {detailedLoan.lateCharges && detailedLoan.lateCharges > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Late Charges</p>
                          <p className="font-semibold text-red-600">{formatCurrency(detailedLoan.lateCharges)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Processing Fee & Deductions */}
                  {(detailedLoan.processingFee || detailedLoan.gstOnProcessingFee) && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                        <h4 className="text-base sm:text-lg font-bold text-gray-800">Processing Fee & Deductions</h4>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Processing Fee {detailedLoan.processingPercent ? `(${detailedLoan.processingPercent}%)` : ''}</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(detailedLoan.processingFee || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">GST on Processing Fee {detailedLoan.gstOnProcessingPercent ? `(${detailedLoan.gstOnProcessingPercent}%)` : ''}</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(detailedLoan.gstOnProcessingFee || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Deductions</p>
                          <p className="font-semibold text-gray-900">{formatCurrency((detailedLoan.processingFee || 0) + (detailedLoan.gstOnProcessingFee || 0))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Net Disbursement</p>
                          <p className="text-lg font-bold text-purple-700">{formatCurrency(detailedLoan.disbursementAmount)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Disbursement Information */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Building className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Disbursement Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Disbursed Amount</p>
                        <p className="text-lg font-bold text-purple-700">{formatCurrency(detailedLoan.disbursementAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Disbursement Date</p>
                        <p className="font-semibold text-gray-900">{new Date(detailedLoan.disbursementDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mode</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.disbursementMode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Transaction ID</p>
                        <p className="font-mono text-xs text-gray-900 break-all">{detailedLoan.disbursementTransactionId}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">UTR Number</p>
                        <p className="font-mono text-xs text-gray-900">{detailedLoan.disbursementUTR}</p>
                      </div>
                    </div>
                  </div>

                  {/* Outstanding & Payment Tracking */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-amber-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Outstanding & Payment Tracking</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Principal Outstanding</p>
                        <p className="text-lg font-bold text-amber-700">{formatCurrency(detailedLoan.principalOutstanding)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interest Outstanding</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(detailedLoan.interestOutstanding)}</p>
                      </div>

                       <div>
                        <p className="text-sm text-gray-600">Late Charges Outstanding</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(detailedLoan.lateChargesOutstanding)}</p>
                      </div>
                                            <div>
                        <p className="text-sm text-gray-600">Total Outstanding</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(detailedLoan.totalOutstanding)}</p>
                      </div>
{detailedLoan?.dpd > 1 && (
  <>
    <div>
      <p className="text-sm text-gray-600">DPD (Days Past Due)</p>
      <p className="font-semibold text-gray-900">
        {detailedLoan.dpd} days
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-600">DPD Bucket</p>
      <p className="font-semibold text-gray-900">
        {detailedLoan.dpdBucket}
      </p>
    </div>
  </>
)}

                      {/* <div>
                        <p className="text-sm text-gray-600">First Due Date</p>
                        <p className="font-semibold text-gray-900">{new Date(detailedLoan.firstDueDate).toLocaleDateString()}</p>
                      </div> */}
                      {/* <div>
                        <p className="text-sm text-gray-600">Next Due Date</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.nextDueDate ? new Date(detailedLoan.nextDueDate).toLocaleDateString() : 'N/A'}</p>
                      </div> */}
                      <div>
                        <p className="text-sm text-gray-600">Maturity Date</p>
                        <p className="font-semibold text-gray-900">{new Date(detailedLoan.maturityDate).toLocaleDateString()}</p>
                      </div>
                      {detailedLoan.lastPaymentDate && (
                        <div>
                          <p className="text-sm text-gray-600">Last Payment Date</p>
                          <p className="font-semibold text-gray-900">{new Date(detailedLoan.lastPaymentDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Behavior */}
                  {detailedLoan.paymentBehavior && (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-teal-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Payment Behavior</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {/* <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">EMIs Paid</p>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{detailedLoan.paymentBehavior.totalEMIsPaid}</div>
                      </div> */}
                      {/* <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">EMIs Missed</p>
                        <div className="text-xl sm:text-2xl font-bold text-red-600">{detailedLoan.paymentBehavior.totalEMIsMissed}</div>
                      </div> */}
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">On-Time Payments</p>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{detailedLoan?.paymentBehavior?.onTimePayments}</div>
                      </div>
                      {/* <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Late Payments</p>
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">{detailedLoan.paymentBehavior.latePayments}</div>
                      </div> */}
                        <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Partial Payments</p>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{detailedLoan?.paymentBehavior?.partialPaymentCount}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Bounce Count</p>
                        <div className="text-xl sm:text-2xl font-bold text-red-600">{detailedLoan?.paymentBehavior?.bounceCount}</div>
                      </div>

                    </div>
                  </div>
                  )}

                  {/* Repayment Schedule */}
                  {detailedLoan?.schedule && detailedLoan?.schedule.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                        <h4 className="text-base sm:text-lg font-bold text-gray-800">Repayment Schedule</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                          <thead className="bg-slate-200">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Installment</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Due Date</th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Principal</th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Interest</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Total Repayment</th>
                            
                              
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Paid Amount</th>
                              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Status</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {detailedLoan.schedule.map((installment) => (
                              <tr key={installment._id} className="hover:bg-slate-50">
                                <td className="px-3 py-2 font-medium text-gray-900">{installment.installmentNo}</td>
                                <td className="px-3 py-2 text-gray-900">{new Date(installment.dueDate).toLocaleDateString()}</td>
                                 <td className="px-3 py-2 text-right text-gray-900">{formatCurrency(installment.principal)}</td>
                                  <td className="px-3 py-2 text-right text-gray-900">{formatCurrency(installment.interest)}</td>
                                <td className="px-3 py-2 text-right font-semibold text-gray-900">{formatCurrency(installment.emiAmount)}</td>
                               
                               
                                <td className="px-3 py-2 text-right font-semibold text-green-600">{formatCurrency(installment.paidAmount)}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    installment.status === 'PAID' ? 'text-green-600 bg-green-100' :
                                    installment.status === 'PENDING' ? 'text-yellow-600 bg-yellow-100' :
                                    'text-red-600 bg-red-100'
                                  }`}>
                                    {installment.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-right text-gray-900">{formatCurrency(installment.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* Payment History */}
                  {detailedLoan.paymentHistory && detailedLoan.paymentHistory.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-indigo-200">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        <h4 className="text-base sm:text-lg font-bold text-gray-800">Payment History</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Payment No.</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Payment Date</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Amount</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Payment Mode</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Transaction ID</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">UTR Number</th>
                              {/* <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Receipt No.</th> */}
                              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-100">
                            {detailedLoan.paymentHistory.map((payment) => (
                              <tr key={payment._id} className="hover:bg-indigo-50/50">
                                <td className="px-3 py-2 font-medium text-gray-900">{payment.payinNumber}</td>
                                <td className="px-3 py-2 text-gray-900">{new Date(payment.paymentDate).toLocaleString()}</td>
                                <td className="px-3 py-2 text-right font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                                <td className="px-3 py-2 text-gray-900">{payment.paymentMode}</td>
                                <td className="px-3 py-2 font-mono text-xs text-gray-700">{payment.transactionId || '-'}</td>
                                <td className="px-3 py-2 font-mono text-xs text-gray-700">{payment.utrNumber || '-'}</td>
                                {/* <td className="px-3 py-2 font-mono text-xs text-gray-700">{payment.receiptNumber || '-'}</td> */}
                                <td className="px-3 py-2 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    payment.status === 'SUCCESS' || payment.status === 'COMPLETED' ? 'text-green-600 bg-green-100' :
                                    payment.status === 'PENDING' ? 'text-yellow-600 bg-yellow-100' :
                                    payment.status === 'FAILED' ? 'text-red-600 bg-red-100' :
                                    'text-gray-600 bg-gray-100'
                                  }`}>
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Created By & Timestamps */}
                  <div className="bg-[#FAFAFA] rounded-lg p-3 sm:p-4 border border-[#E0E0E0]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                      {/* <div>
                        <p className="text-gray-600">Created By</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.createdBy?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{detailedLoan.createdBy?.email || 'N/A'}</p>
                      </div> */}
                      <div>
                        <p className="text-gray-600">Created At</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.createdAt ? new Date(detailedLoan.createdAt).toLocaleString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Updated</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.updatedAt ? new Date(detailedLoan.updatedAt).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Unable to load detailed information</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-[#FAFAFA] px-4 sm:px-6 py-3 sm:py-4 border-t border-[#E0E0E0] flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setDetailedLoan(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Close
                </button>
                {/* <button className="w-full sm:w-auto px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-white transition-colors flex items-center justify-center text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </button> */}
                {/* {detailedLoan && (detailedLoan.status.toLowerCase() === 'active') && (
                  <button className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center text-sm">
                    <Wallet className="w-4 h-4 mr-2" />
                    Pay EMI
                  </button>
                )} */}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Reapply Modal */}
      {isReapplyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={resetReapplyModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[calc(100vw-2rem)] sm:max-w-md"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Apply for New Loan
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80">
                      {selectedLoanForReapply ? `Previous: ${selectedLoanForReapply.loanNumber}` : 'Reapplication'}
                    </p>
                  </div>
                  <button
                    onClick={resetReapplyModal}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {reapplyLoading && !reapplyEligibility ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-8 h-8 text-[#25B181] animate-spin" />
                    <span className="ml-3 text-gray-600">Checking eligibility...</span>
                  </div>
                ) : reapplySuccess ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Success!</h4>
                    <p className="text-sm text-gray-600">{reapplySuccess}</p>
                  </div>
                ) : reapplyEligibility && !reapplyEligibility.eligible ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Not Eligible</h4>
                    <p className="text-sm text-gray-600">{reapplyEligibility.reason || 'You are not eligible for reapplication at this time.'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reapplyError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{reapplyError}</p>
                      </div>
                    )}

                    {/* Loan Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          min={reapplyEligibility?.minAmount || 10000}
                          max={reapplyEligibility?.maxAmount || 500000}
                          value={reapplyForm.loanAmount}
                          onChange={(e) => setReapplyForm({ ...reapplyForm, loanAmount: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-xl focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-lg font-semibold"
                          placeholder="Enter amount"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Min: {formatCurrency(reapplyEligibility?.minAmount || 10000)} | Max: {formatCurrency(reapplyEligibility?.maxAmount || 500000)}
                      </p>
                    </div>

                    {/* Tenure */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tenure (Days) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={reapplyForm.tenure}
                        onChange={(e) => setReapplyForm({ ...reapplyForm, tenure: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-xl focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none"
                      >
                        <option value="7">7 Days</option>
                        <option value="15">15 Days</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                      </select>
                    </div>

                    {/* Purpose */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Purpose (Optional)</label>
                      <input
                        type="text"
                        value={reapplyForm.purpose}
                        onChange={(e) => setReapplyForm({ ...reapplyForm, purpose: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-xl focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none"
                        placeholder="e.g., Business expansion, Personal needs"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={resetReapplyModal}
                        className="flex-1 px-4 py-3 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitReapplication}
                        disabled={reapplyLoading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {reapplyLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Submit Application
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* UPI Autopay Modal */}
      {isUpiAutopayModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={resetAutopayModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[calc(100vw-2rem)] sm:max-w-md"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Setup UPI Autopay
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80">
                      {selectedLoanForAutopay ? `Loan: ${selectedLoanForAutopay.loanNumber}` : 'Automatic EMI payments'}
                    </p>
                  </div>
                  <button
                    onClick={resetAutopayModal}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {autopaySuccess && autopayResult ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Autopay Setup Initiated!</h4>
                    <p className="text-sm text-gray-600 mb-4">{autopaySuccess}</p>

                    {autopayResult.shortUrl && (
                      <a
                        href={autopayResult.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Complete Authorization
                      </a>
                    )}

                    <button
                      onClick={resetAutopayModal}
                      className="block w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {autopayError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{autopayError}</p>
                      </div>
                    )}

                    {/* Info Card */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2">What is UPI Autopay?</h4>
                      <p className="text-xs text-purple-700">
                        UPI Autopay allows automatic deduction of your EMI from your bank account on the due date.
                        You will receive a notification before each debit.
                      </p>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount per Debit <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          min="100"
                          value={autopayForm.amount}
                          onChange={(e) => setAutopayForm({ ...autopayForm, amount: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-lg font-semibold"
                          placeholder="Enter amount"
                        />
                      </div>
                      {selectedLoanForAutopay && (
                        <p className="text-xs text-gray-500 mt-1">
                          EMI Amount: {formatCurrency(selectedLoanForAutopay.emiAmount || selectedLoanForAutopay.totalRepayment)}
                        </p>
                      )}
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Debit Frequency <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={autopayForm.frequency}
                        onChange={(e) => setAutopayForm({ ...autopayForm, frequency: e.target.value as any })}
                        className="w-full px-4 py-3 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="as_presented">As Presented</option>
                      </select>
                    </div>

                    {/* VPA (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID (Optional)</label>
                      <input
                        type="text"
                        value={autopayForm.vpa}
                        onChange={(e) => setAutopayForm({ ...autopayForm, vpa: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                        placeholder="e.g., yourname@upi"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave blank to choose UPI app during authorization
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={resetAutopayModal}
                        className="flex-1 px-4 py-3 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSetupAutopay}
                        disabled={autopayLoading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {autopayLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Setting up...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Setup Autopay
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

    </div>
  );
}
