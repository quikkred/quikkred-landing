'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CreditCard, IndianRupee, Calendar, Clock, Plus,
  TrendingUp, Target, CheckCircle, Eye,
  EyeOff, Download, Search,
  FileText, AlertCircle, Wallet,
  RefreshCw, BarChart3, X,
  ChevronLeft, ChevronRight, Building, User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loansService } from '@/lib/api/loans.service';

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
}

interface DetailedLoan {
  _id: string;
  loanNumber: string;
  applicationId: string;
  customerId: {
    _id: string;
    email: string;
    fullName: string;
  };
  productName: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  tenureUnit: string;
  isSubmit: boolean;
  totalRepayment: number;
  emiAmount: number;
  numberOfEMIs: number;
  repaymentType: string;
  disbursementAmount: number;
  disbursementDate: string;
  disbursementMode: string;
  disbursementTransactionId: string;
  disbursementUTR: string;
  maturityDate: string;
  principalOutstanding: number;
  interestOutstanding: number;
  totalOutstanding: number;
  firstDueDate: string;
  nextDueDate: string | null;
  dpd: number;
  dpdBucket: string;
  status: string;
  paymentBehavior: {
    totalEMIsPaid: number;
    totalEMIsMissed: number;
    onTimePayments: number;
    latePayments: number;
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
    status: string;
    balance: number;
    lateCharges: number;
    _id: string;
  }>;
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
  };
  branch: string;
  ptpHistory: any[];
  restructuringHistory: any[];
  createdAt: string;
  updatedAt: string;
  lastPaymentDate?: string;
  lateChargesOutstanding: number;
}

interface LoanCalculation {
  ACTIVE: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
  };
  OVERDUE: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
  };
  NPA: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
  };
  CLOSED: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
  };
  WRITTEN_OFF: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
  };
  PENDING: {
    totalLoanAmount: number;
    totalInterest: number;
    totalCount: number;
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

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (false) {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

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

      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const currentPage = page || pagination.page;
      const currentLimit = limit || pagination.limit;

      const response = await fetch(
        `https://api.bluechipfinmax.com/api/loans/get?page=${currentPage}&limit=${currentLimit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Check if token expired (401 Unauthorized) - Full logout and redirect
      if (response.status === 401) {
        // Clear all authentication tokens
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Clear user data
        localStorage.removeItem('userRole');
        localStorage.removeItem('role');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('email');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('userMobile');
        localStorage.removeItem('customerUniqueId');

        // Clear cookies
        document.cookie = 'auth-token=; path=/; max-age=0';
        document.cookie = 'user-role=; path=/; max-age=0';

        // Redirect to login
        window.location.href = '/login';
        return;
      }

      const result = await response.json();

      if (response.ok && result.success && result.data) {
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
          customerId: loan.customerId?._id
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
            <button
              onClick={() => router.push('/apply/quick')}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New</span>
            </button>
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
          {/* Pending Loans */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
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
                  PENDING
                </span>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Loan Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-700">
                  {showBalancePending ? formatCurrency(loanCalculation?.PENDING?.totalLoanAmount || 0) : '••••••'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-yellow-200">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Interest</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    {showBalancePending ? formatCurrency(loanCalculation?.PENDING?.totalInterest || 0) : '••••••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-gray-600">Count</p>
                  <p className="text-base sm:text-lg font-bold text-yellow-600">
                    {loanCalculation?.PENDING?.totalCount || 0}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">EMI</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Interest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tenure</th>
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
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(loan.emiAmount)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.interestRate}%</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.tenure} {loan.tenureUnit}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetails(loan)}
                        className="inline-flex items-center px-3 py-1.5 bg-[#4A66FF] text-white text-xs font-medium rounded-lg hover:bg-[#4A66FF]/90 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Details
                      </button>
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
              className="relative inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full max-h-[90vh] overflow-y-auto"
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
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Customer & Product Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer Name</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.customerId.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Customer Email</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.customerId.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Product Name</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.productName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Branch</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.branch.replace(/_/g, ' ')}</p>
                      </div>
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
                        <p className="font-semibold text-gray-900">{detailedLoan.interestRate}% p.d.</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tenure</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.tenure} {detailedLoan.tenureUnit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Number of EMIs</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.numberOfEMIs}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">EMI Amount</p>
                        <p className="text-lg font-bold text-green-700">{formatCurrency(detailedLoan.emiAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Repayment</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(detailedLoan.totalRepayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Interest</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(detailedLoan.totalRepayment - detailedLoan.principalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Late Charges</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(detailedLoan.lateChargesOutstanding)}</p>
                      </div>
                    </div>
                  </div>

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
                        <p className="text-sm text-gray-600">Total Outstanding</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(detailedLoan.totalOutstanding)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">DPD (Days Past Due)</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.dpd} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">DPD Bucket</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.dpdBucket}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">First Due Date</p>
                        <p className="font-semibold text-gray-900">{new Date(detailedLoan.firstDueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Due Date</p>
                        <p className="font-semibold text-gray-900">{detailedLoan.nextDueDate ? new Date(detailedLoan.nextDueDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
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
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-teal-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Payment Behavior</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">EMIs Paid</p>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{detailedLoan.paymentBehavior.totalEMIsPaid}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">EMIs Missed</p>
                        <div className="text-xl sm:text-2xl font-bold text-red-600">{detailedLoan.paymentBehavior.totalEMIsMissed}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">On-Time Payments</p>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{detailedLoan.paymentBehavior.onTimePayments}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Late Payments</p>
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">{detailedLoan.paymentBehavior.latePayments}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Bounce Count</p>
                        <div className="text-xl sm:text-2xl font-bold text-red-600">{detailedLoan.paymentBehavior.bounceCount}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Partial Payments</p>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{detailedLoan.paymentBehavior.partialPaymentCount}</div>
                      </div>
                    </div>
                  </div>

                  {/* EMI Schedule */}
                  {detailedLoan.schedule && detailedLoan.schedule.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                        <h4 className="text-base sm:text-lg font-bold text-gray-800">EMI Schedule</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                          <thead className="bg-slate-200">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Installment</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Due Date</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">EMI Amount</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Principal</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Interest</th>
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
                                <td className="px-3 py-2 text-right font-semibold text-gray-900">{formatCurrency(installment.emiAmount)}</td>
                                <td className="px-3 py-2 text-right text-gray-900">{formatCurrency(installment.principal)}</td>
                                <td className="px-3 py-2 text-right text-gray-900">{formatCurrency(installment.interest)}</td>
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

    </div>
  );
}
