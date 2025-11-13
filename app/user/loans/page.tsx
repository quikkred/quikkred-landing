'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CreditCard, IndianRupee, Calendar, Clock, Plus,
  TrendingUp, Target, CheckCircle, Eye,
  EyeOff, Download, Search,
  FileText, AlertCircle, Wallet,
  RefreshCw, Activity, BarChart3, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [showBalance, setShowBalance] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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

      if (user.role !== 'USER' && user.role !== 'CUSTOMER') {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Fetch loans data
  useEffect(() => {
    fetchLoans();
  }, [pagination.page, pagination.limit]);

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
        `https://77q1g1gk-5050.inc1.devtunnels.ms/api/loans/get?page=${currentPage}&limit=${currentLimit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

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


  const formatCurrency = (amount: number) => {
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
        return 'text-[#2E7D32] bg-[#2E7D32]/10';
      case 'PENDING':
        return 'text-[#FBC02D] bg-[#FBC02D]/10';
      case 'PROCESSING':
        return 'text-[#1976D2] bg-[#1976D2]/10';
      case 'CLOSED':
      case 'COMPLETED':
        return 'text-gray-600 bg-gray-100';
      case 'REJECTED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'APPROVED':
        return 'text-[#2E7D32] bg-[#2E7D32]/10';
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

  // Calculate totals - only count active loans
  const activeLoans = loans.filter(loan => loan.status.toUpperCase() === 'ACTIVE');
  const totalBorrowed = activeLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.totalRepayment, 0);
  const totalEMI = activeLoans.reduce((sum, loan) => sum + loan.emiAmount, 0);

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
  if (!user || (user.role !== 'USER' && user.role !== 'CUSTOMER')) {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B5E20] flex items-center gap-2 sm:gap-3">
              <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-[#1976D2]" />
              My Loans
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all your loans in one place</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => fetchLoans()}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {/* Apply New button */}
            <button
              onClick={() => router.push('/apply/quick')}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Total Borrowed */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#1976D2]/10 rounded-xl">
              <IndianRupee className="w-6 h-6 text-[#1976D2]" />
            </div>
            <span className="text-xs text-gray-500">Total Borrowed</span>
          </div>
          <p className="text-3xl font-bold text-[#1B5E20] mb-2">
            {showBalance ? formatCurrency(totalBorrowed) : '••••••'}
          </p>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showBalance ? 'Hide' : 'Show'} Balance
          </button>
        </div>

        {/* Total Outstanding */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#FBC02D]/20 rounded-xl">
              <Target className="w-6 h-6 text-[#FBC02D]" />
            </div>
            <span className="text-xs text-gray-500">Outstanding</span>
          </div>
          <p className="text-3xl font-bold text-[#1B5E20] mb-2">
            {showBalance ? formatCurrency(totalOutstanding) : '••••••'}
          </p>
          <div className="flex items-center gap-1 text-sm">
            <Activity className="w-4 h-4 text-[#FBC02D]" />
            <span className="text-[#FBC02D]">{activeLoans.length} Active</span>
          </div>
        </div>

        {/* Total Monthly EMI */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#2E7D32]/10 rounded-xl">
              <Wallet className="w-6 h-6 text-[#2E7D32]" />
            </div>
            <span className="text-xs text-gray-500">Monthly EMI</span>
          </div>
          <p className="text-3xl font-bold text-[#1B5E20] mb-2">
            {formatCurrency(totalEMI)}
          </p>
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-[#2E7D32]">Combined</span>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-3 sm:p-4 border border-[#E0E0E0] mb-4 sm:mb-6 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Loan Number, Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-[#FAFAFA] text-[#1B5E20] rounded-lg border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              All ({loans.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'active'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Active ({activeLoans.length})
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'closed'
                  ? 'bg-gray-600 text-white'
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
      </motion.div>

      {/* Loans Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm overflow-hidden"
      >
        {filteredLoans.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#1B5E20] mb-2">No Loans Found</h3>
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
                  <motion.tr
                    key={loan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#1B5E20]">{loan.loanNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#1B5E20]">{formatCurrency(loan.principalAmount)}</div>
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
                        onClick={() => {
                          setSelectedLoan(loan);
                          setIsDetailModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 bg-[#1976D2] text-white text-xs font-medium rounded-lg hover:bg-[#1565C0] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {filteredLoans.length > 0 && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-[#1B5E20]">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-semibold text-[#1B5E20]">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-semibold text-[#1B5E20]">{pagination.total}</span> loans
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
                            ? 'bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white'
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
                className="px-3 py-2 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loan Detail Modal */}
      {isDetailModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => setIsDetailModalOpen(false)}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Loan Details</h3>
                    <p className="text-sm text-white/80">Loan No: {selectedLoan.loanNumber}</p>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                {/* Status Badge */}
                <div className="mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedLoan.status)}`}>
                    Status: {selectedLoan.status}
                  </span>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Principal Amount */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <IndianRupee className="w-5 h-5 text-[#1976D2] mr-2" />
                      <p className="text-sm text-gray-600">Principal Amount</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{formatCurrency(selectedLoan.principalAmount)}</p>
                  </div>

                  {/* Disbursement Amount */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Target className="w-5 h-5 text-[#FBC02D] mr-2" />
                      <p className="text-sm text-gray-600">Disbursed Amount</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{formatCurrency(selectedLoan.disbursementAmount)}</p>
                  </div>

                  {/* Monthly EMI */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Wallet className="w-5 h-5 text-[#2E7D32] mr-2" />
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{formatCurrency(selectedLoan.emiAmount)}</p>
                  </div>

                  {/* Total Repayment */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <IndianRupee className="w-5 h-5 text-[#1976D2] mr-2" />
                      <p className="text-sm text-gray-600">Total Repayment</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{formatCurrency(selectedLoan.totalRepayment)}</p>
                  </div>

                  {/* Interest Rate */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-[#1976D2] mr-2" />
                      <p className="text-sm text-gray-600">Interest Rate</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{selectedLoan.interestRate}% per annum</p>
                  </div>

                  {/* Tenure */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-[#1976D2] mr-2" />
                      <p className="text-sm text-gray-600">Loan Tenure</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{selectedLoan.tenure} {selectedLoan.tenureUnit}</p>
                  </div>

                  {/* Loan Created Date */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-[#FBC02D] mr-2" />
                      <p className="text-sm text-gray-600">Loan Created Date</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">
                      {new Date(selectedLoan.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-[#1976D2]/10 rounded-xl p-4 border border-[#1976D2]/20 mb-6">
                  <h4 className="text-sm font-semibold text-[#1976D2] mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Financial Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Principal Amount:</span>
                      <span className="font-semibold text-[#1B5E20]">
                        {formatCurrency(selectedLoan.principalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Interest:</span>
                      <span className="font-semibold text-[#1B5E20]">
                        {formatCurrency(selectedLoan.totalRepayment - selectedLoan.principalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Repayment:</span>
                      <span className="font-semibold text-[#2E7D32]">
                        {formatCurrency(selectedLoan.totalRepayment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Disbursed Amount:</span>
                      <span className="font-semibold text-[#2E7D32]">
                        {formatCurrency(selectedLoan.disbursementAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-[#FAFAFA] px-6 py-4 border-t border-[#E0E0E0] flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </button>
                {(selectedLoan.status.toLowerCase() === 'approved' ||
                  selectedLoan.status.toLowerCase() === 'active' ||
                  selectedLoan.status.toLowerCase() === 'disbursed') && (
                  <button className="px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Pay EMI
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

    </div>
  );
}
