'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CreditCard, IndianRupee, Calendar, Clock, Plus,
  TrendingUp, Percent, Target, CheckCircle, Eye,
  EyeOff, Download, Filter, Search, ArrowUpRight,
  FileText, AlertCircle, Wallet, ChevronDown,
  RefreshCw, Activity, BarChart3, Sparkles, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loansService, NewLoanApplicationRequest } from '@/lib/api/loans.service';

interface Loan {
  id: string;
  type: string;
  amount: number;
  emi: number;
  nextDueDate: string;
  remainingAmount: number;
  status: string;
  interestRate: number;
  tenure: number;
  completedMonths: number;
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
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLoanForm, setNewLoanForm] = useState<NewLoanApplicationRequest>({
    loanType: 'PAY-DAY',
    requestedAmount: 0,
    interestRate: 18, // 1.5% per month = 18% per annum
    processingFee: 0,
    tenure: 12
  });

  // Loan type configurations (interest rates and processing fees)
  const loanTypeConfig: Record<string, { interestRate: number; processingFeePercent: number }> = {
    'PAY-DAY': { interestRate: 18, processingFeePercent: 2 }, // 1.5% per month
    'PERSONAL': { interestRate: 15, processingFeePercent: 2 },
    'BUSINESS': { interestRate: 12, processingFeePercent: 1.5 },
    'EDUCATION': { interestRate: 10, processingFeePercent: 1 },
    'MEDICAL': { interestRate: 12, processingFeePercent: 1 },
    'VEHICLE': { interestRate: 14, processingFeePercent: 2 },
    'HOME': { interestRate: 9, processingFeePercent: 1 }
  };

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
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('https://api.bluechipfinmax.com/api/loans/my-loans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        const mappedLoans = result.data.map((loan: any) => ({
          id: loan.loanNumber,
          type: loan.loanType,
          amount: loan.requestedAmount,
          emi: Math.round((loan.requestedAmount * (loan.interestRate / 100 / 12) * Math.pow(1 + loan.interestRate / 100 / 12, loan.tenure)) / (Math.pow(1 + loan.interestRate / 100 / 12, loan.tenure) - 1)),
          nextDueDate: new Date(loan.applicationDate).toISOString(),
          remainingAmount: loan.outstandingAmount,
          status: loan.status,
          interestRate: loan.interestRate,
          tenure: loan.tenure,
          completedMonths: 0
        }));

        setLoans(mappedLoans);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update interest rate and processing fee when loan type or amount changes
  const handleLoanTypeChange = (loanType: string) => {
    const config = loanTypeConfig[loanType] || loanTypeConfig['PAY-DAY'];
    const processingFee = Math.round(newLoanForm.requestedAmount * (config.processingFeePercent / 100));

    setNewLoanForm({
      ...newLoanForm,
      loanType,
      interestRate: config.interestRate,
      processingFee: newLoanForm.requestedAmount > 0 ? processingFee : 0
    });
  };

  const handleLoanAmountChange = (amount: number) => {
    const config = loanTypeConfig[newLoanForm.loanType] || loanTypeConfig['PAY-DAY'];
    const processingFee = Math.round(amount * (config.processingFeePercent / 100));

    setNewLoanForm({
      ...newLoanForm,
      requestedAmount: amount,
      processingFee: amount > 0 ? processingFee : 0
    });
  };

  const handleNewLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLoanForm.requestedAmount || newLoanForm.requestedAmount <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    if (!newLoanForm.processingFee || newLoanForm.processingFee < 0) {
      alert('Please enter a valid processing fee');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await loansService.applyNewLoan(newLoanForm);

      if (result.success) {
        alert('Loan application submitted successfully!');
        setIsNewLoanModalOpen(false);
        // Reset form
        setNewLoanForm({
          loanType: 'PAY-DAY',
          requestedAmount: 0,
          interestRate: 18,
          processingFee: 0,
          tenure: 12
        });
        // Refresh loans list
        fetchLoans();
      } else {
        alert(result.message || 'Failed to submit loan application');
      }
    } catch (error: any) {
      console.error('Error submitting loan:', error);
      alert(error.message || 'An error occurred while submitting the loan application');
    } finally {
      setIsSubmitting(false);
    }
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
        return 'text-[#2E7D32] bg-[#2E7D32]/10';
      case 'PENDING':
        return 'text-[#FBC02D] bg-[#FBC02D]/10';
      case 'CLOSED':
        return 'text-gray-600 bg-gray-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-[#1976D2] bg-[#1976D2]/10';
    }
  };

  // Filter loans
  const filteredLoans = loans.filter(loan => {
    const statusLower = loan.status.toLowerCase();
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && (statusLower === 'active' || statusLower === 'approved' || statusLower === 'disbursed')) ||
      (filterStatus === 'closed' && (statusLower === 'closed' || statusLower === 'completed'));

    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Calculate totals - only count approved/active/disbursed loans
  const activeLoans = loans.filter(loan => {
    const statusLower = loan.status.toLowerCase();
    return statusLower === 'active' || statusLower === 'approved' || statusLower === 'disbursed';
  });
  const totalBorrowed = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalEMI = activeLoans.reduce((sum, loan) => sum + loan.emi, 0);

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
            {/* Only show Apply New button if user has existing loans */}
            {loans.length > 0 && (
              <button
                onClick={() => setIsNewLoanModalOpen(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Apply New</span>
              </button>
            )}
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
              placeholder="Search by Loan ID or Type..."
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
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => router.push('/apply')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Apply for Loan
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Loan ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
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
                      <div className="text-sm font-medium text-[#1B5E20]">{loan.id}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(loan.nextDueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{loan.type}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#1B5E20]">{formatCurrency(loan.amount)}</div>
                      <div className="text-xs text-gray-500">Outstanding: {formatCurrency(loan.remainingAmount)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(loan.emi)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.interestRate}%</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.tenure} months</div>
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
                        Full Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

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
                    <p className="text-sm text-white/80">Loan ID: {selectedLoan.id}</p>
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
                  {/* Loan Type */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 text-[#1976D2] mr-2" />
                      <p className="text-sm text-gray-600">Loan Type</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{selectedLoan.type}</p>
                  </div>

                  {/* Principal Amount */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <IndianRupee className="w-5 h-5 text-[#1976D2] mr-2" />
                      <p className="text-sm text-gray-600">Principal Amount</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{formatCurrency(selectedLoan.amount)}</p>
                  </div>

                  {/* Outstanding Amount */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Target className="w-5 h-5 text-[#FBC02D] mr-2" />
                      <p className="text-sm text-gray-600">Outstanding Amount</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{formatCurrency(selectedLoan.remainingAmount)}</p>
                  </div>

                  {/* Monthly EMI */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Wallet className="w-5 h-5 text-[#2E7D32] mr-2" />
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">{formatCurrency(selectedLoan.emi)}</p>
                  </div>

                  {/* Interest Rate */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Percent className="w-5 h-5 text-[#1976D2] mr-2" />
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
                    <p className="text-lg font-semibold text-[#1B5E20]">{selectedLoan.tenure} months</p>
                  </div>

                  {/* Next Due Date */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-[#FBC02D] mr-2" />
                      <p className="text-sm text-gray-600">Next Due Date</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">
                      {new Date(selectedLoan.nextDueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Completed Months */}
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-[#2E7D32] mr-2" />
                      <p className="text-sm text-gray-600">Completed Months</p>
                    </div>
                    <p className="text-lg font-semibold text-[#1B5E20]">
                      {selectedLoan.completedMonths} / {selectedLoan.tenure}
                    </p>
                  </div>
                </div>

                {/* Repayment Progress */}
                <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#E0E0E0] mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-[#2E7D32] mr-2" />
                      <p className="text-sm font-medium text-gray-700">Repayment Progress</p>
                    </div>
                    <span className="text-sm font-semibold text-[#1B5E20]">
                      {Math.round((selectedLoan.completedMonths / selectedLoan.tenure) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E0E0E0] rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] transition-all duration-500"
                      style={{ width: `${(selectedLoan.completedMonths / selectedLoan.tenure) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>Started</span>
                    <span>Completed: {selectedLoan.completedMonths} months</span>
                    <span>Remaining: {selectedLoan.tenure - selectedLoan.completedMonths} months</span>
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
                      <span className="text-gray-700">Total Payable Amount:</span>
                      <span className="font-semibold text-[#1B5E20]">
                        {formatCurrency(selectedLoan.emi * selectedLoan.tenure)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Interest:</span>
                      <span className="font-semibold text-[#1B5E20]">
                        {formatCurrency((selectedLoan.emi * selectedLoan.tenure) - selectedLoan.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Amount Paid So Far:</span>
                      <span className="font-semibold text-[#2E7D32]">
                        {formatCurrency(selectedLoan.emi * selectedLoan.completedMonths)}
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

      {/* New Loan Application Modal */}
      {isNewLoanModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => !isSubmitting && setIsNewLoanModalOpen(false)}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Apply for New Loan</h3>
                    <p className="text-sm text-white/80">Fill in the details below</p>
                  </div>
                  <button
                    onClick={() => !isSubmitting && setIsNewLoanModalOpen(false)}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleNewLoanSubmit} className="px-6 py-6">
                <div className="space-y-5">
                  {/* Loan Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newLoanForm.loanType}
                      onChange={(e) => handleLoanTypeChange(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-[#FAFAFA] text-[#1B5E20] rounded-lg border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="PAY-DAY">Pay Day Loan</option>
                      <option value="PERSONAL">Personal Loan</option>
                      <option value="BUSINESS">Business Loan</option>
                      <option value="EDUCATION">Education Loan</option>
                      <option value="MEDICAL">Medical Loan</option>
                      <option value="VEHICLE">Vehicle Loan</option>
                      <option value="HOME">Home Loan</option>
                    </select>
                  </div>

                  {/* Requested Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newLoanForm.requestedAmount || ''}
                        onChange={(e) => handleLoanAmountChange(Number(e.target.value))}
                        disabled={isSubmitting}
                        placeholder="Enter loan amount"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] text-[#1B5E20] rounded-lg border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        min="1000"
                        max="10000000"
                        required
                      />
                    </div>
                  </div>

                  {/* Interest Rate - Auto-filled based on loan type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate (% per annum) <span className="text-green-600 text-xs">(Auto-filled)</span>
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newLoanForm.interestRate || ''}
                        disabled
                        placeholder="Auto-calculated"
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-700 rounded-lg border border-[#E0E0E0] cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically set based on selected loan type
                    </p>
                  </div>

                  {/* Processing Fee - Auto-filled based on amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Processing Fee (₹) <span className="text-green-600 text-xs">(Auto-filled)</span>
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newLoanForm.processingFee || ''}
                        disabled
                        placeholder="Auto-calculated"
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-700 rounded-lg border border-[#E0E0E0] cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {loanTypeConfig[newLoanForm.loanType]?.processingFeePercent || 2}% of loan amount
                    </p>
                  </div>

                  {/* Tenure */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenure (Months) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newLoanForm.tenure || ''}
                        onChange={(e) => setNewLoanForm({ ...newLoanForm, tenure: Number(e.target.value) })}
                        disabled={isSubmitting}
                        placeholder="Enter tenure in months"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] text-[#1B5E20] rounded-lg border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        min="1"
                        max="360"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Loan Preview - Dynamic Calculation */}
                {newLoanForm.requestedAmount > 0 && newLoanForm.tenure > 0 && (
                  <div className="mt-4 bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] rounded-lg p-3 border border-[#2E7D32]/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <BarChart3 className="w-4 h-4 text-[#2E7D32]" />
                      <h3 className="text-sm font-semibold text-gray-900">Loan Preview</h3>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Loan Amount:</span>
                        <span className="font-semibold text-[#1B5E20]">
                          ₹{newLoanForm.requestedAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Interest ({(newLoanForm.interestRate / 12).toFixed(2)}%/mo):
                        </span>
                        <span className="text-[#1B5E20]">
                          ₹{Math.round(
                            newLoanForm.requestedAmount *
                            (newLoanForm.interestRate / 12 / 100) *
                            newLoanForm.tenure
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Processing Fee ({loanTypeConfig[newLoanForm.loanType]?.processingFeePercent || 2}%):
                        </span>
                        <span className="text-[#1B5E20]">
                          ₹{newLoanForm.processingFee.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-[#2E7D32]/20 pt-1.5 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-900">Total Payable:</span>
                        <span className="text-sm font-bold text-[#2E7D32]">
                          ₹{Math.round(
                            newLoanForm.requestedAmount +
                            (newLoanForm.requestedAmount * (newLoanForm.interestRate / 12 / 100) * newLoanForm.tenure) +
                            newLoanForm.processingFee
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-[#2E7D32]/10 rounded p-2 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span className="text-xs font-semibold text-gray-900">Monthly EMI:</span>
                        </div>
                        <span className="text-base font-bold text-[#2E7D32]">
                          ₹{Math.round(
                            (newLoanForm.requestedAmount +
                            (newLoanForm.requestedAmount * (newLoanForm.interestRate / 12 / 100) * newLoanForm.tenure) +
                            newLoanForm.processingFee) / newLoanForm.tenure
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsNewLoanModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
