"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, Send, Clock, CheckCircle, XCircle, AlertTriangle,
  Filter, Download, RefreshCw, Search, Calendar, CreditCard,
  TrendingUp, Users, ArrowRight, Eye, FileText, Building,
  Smartphone, Mail, Phone, Copy, ExternalLink, Info
} from "lucide-react";

interface Disbursement {
  id: string;
  loanId: string;
  customerName: string;
  customerId: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REVERSED';
  method: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'CHEQUE';
  bankAccount: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    accountHolder: string;
  };
  utr: string | null;
  initiatedAt: string;
  processedAt: string | null;
  failureReason: string | null;
  retryCount: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  approvedBy: string;
  notes: string;
}

export default function DisbursementManagementPage() {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([
    {
      id: 'DSB001',
      loanId: 'LN12345',
      customerName: 'Rahul Sharma',
      customerId: 'CU001',
      amount: 500000,
      status: 'SUCCESS',
      method: 'NEFT',
      bankAccount: {
        accountNumber: '1234567890',
        ifsc: 'HDFC0001234',
        bankName: 'HDFC Bank',
        accountHolder: 'Rahul Sharma'
      },
      utr: 'HDFC234567891234',
      initiatedAt: '2024-01-28T10:30:00Z',
      processedAt: '2024-01-28T14:45:00Z',
      failureReason: null,
      retryCount: 0,
      priority: 'HIGH',
      approvedBy: 'admin@Quikkred.com',
      notes: 'Regular disbursement'
    },
    {
      id: 'DSB002',
      loanId: 'LN12346',
      customerName: 'Priya Patel',
      customerId: 'CU002',
      amount: 300000,
      status: 'PROCESSING',
      method: 'IMPS',
      bankAccount: {
        accountNumber: '9876543210',
        ifsc: 'ICIC0001234',
        bankName: 'ICICI Bank',
        accountHolder: 'Priya Patel'
      },
      utr: null,
      initiatedAt: '2024-01-28T15:00:00Z',
      processedAt: null,
      failureReason: null,
      retryCount: 0,
      priority: 'HIGH',
      approvedBy: 'admin@Quikkred.com',
      notes: 'Urgent disbursement requested'
    },
    {
      id: 'DSB003',
      loanId: 'LN12347',
      customerName: 'Amit Kumar',
      customerId: 'CU003',
      amount: 150000,
      status: 'FAILED',
      method: 'NEFT',
      bankAccount: {
        accountNumber: '5555666677',
        ifsc: 'SBIN0001234',
        bankName: 'State Bank of India',
        accountHolder: 'Amit Kumar'
      },
      utr: null,
      initiatedAt: '2024-01-28T11:00:00Z',
      processedAt: '2024-01-28T11:15:00Z',
      failureReason: 'Invalid account number',
      retryCount: 1,
      priority: 'MEDIUM',
      approvedBy: 'admin@Quikkred.com',
      notes: 'Customer requested re-verification'
    },
    {
      id: 'DSB004',
      loanId: 'LN12348',
      customerName: 'Sneha Reddy',
      customerId: 'CU004',
      amount: 750000,
      status: 'PENDING',
      method: 'RTGS',
      bankAccount: {
        accountNumber: '7788990011',
        ifsc: 'AXIS0001234',
        bankName: 'Axis Bank',
        accountHolder: 'Sneha Reddy'
      },
      utr: null,
      initiatedAt: '2024-01-28T16:00:00Z',
      processedAt: null,
      failureReason: null,
      retryCount: 0,
      priority: 'HIGH',
      approvedBy: 'admin@Quikkred.com',
      notes: 'Awaiting final approval'
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisbursement, setSelectedDisbursement] = useState<Disbursement | null>(null);

  const stats = {
    totalDisbursed: 45000000,
    todayDisbursed: 12500000,
    pending: 8,
    processing: 3,
    success: 156,
    failed: 5,
    avgProcessingTime: 2.5 // hours
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PROCESSING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'FAILED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'REVERSED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4" />;
      case 'PROCESSING': return <Clock className="w-4 h-4 animate-spin" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      case 'REVERSED': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleRetry = (id: string) => {
    console.log('Retrying disbursement:', id);
    // Implement retry logic
  };

  const handleReverse = (id: string) => {
    console.log('Reversing disbursement:', id);
    // Implement reversal logic
  };

  const filteredDisbursements = disbursements.filter(d => {
    const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
    const matchesMethod = selectedMethod === 'ALL' || d.method === selectedMethod;
    const matchesSearch = searchTerm === '' ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesMethod && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Send className="w-8 h-8 text-blue-400" />
            Disbursement Management
          </h1>
          <p className="text-slate-400 mt-1">Manage loan disbursements and payment processing</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
            New Disbursement
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 gradient-primary rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Total Disbursed</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalDisbursed)}</p>
          <div className="flex items-center gap-1 text-sm text-emerald-400 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>This month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Today's Disbursements</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.todayDisbursed)}</p>
          <p className="text-sm text-slate-400 mt-2">{stats.success} successful</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Pending/Processing</p>
          <p className="text-2xl font-bold text-white">{stats.pending + stats.processing}</p>
          <p className="text-sm text-slate-400 mt-2">Avg: {stats.avgProcessingTime}h</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Failed</p>
          <p className="text-2xl font-bold text-white">{stats.failed}</p>
          <p className="text-sm text-yellow-400 mt-2">Needs attention</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by loan ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="REVERSED">Reversed</option>
          </select>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Methods</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="IMPS">IMPS</option>
            <option value="UPI">UPI</option>
            <option value="CHEQUE">Cheque</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Disbursement List */}
      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Disbursement ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  UTR
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Initiated
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredDisbursements.map((disbursement, index) => (
                <motion.tr
                  key={disbursement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{disbursement.id}</span>
                      <span className="text-xs text-slate-500">{disbursement.loanId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{disbursement.customerName}</p>
                        <p className="text-xs text-slate-500">{disbursement.customerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(disbursement.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{disbursement.method}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(disbursement.status)}`}>
                      {getStatusIcon(disbursement.status)}
                      {disbursement.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-400">
                      {disbursement.utr || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400">
                      {new Date(disbursement.initiatedAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedDisbursement(disbursement)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      {disbursement.status === 'FAILED' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRetry(disbursement.id)}
                          className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedDisbursement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl border border-slate-700 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Disbursement Details</h2>
                <p className="text-sm text-slate-400">{selectedDisbursement.id}</p>
              </div>
              <button
                onClick={() => setSelectedDisbursement(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm text-slate-400">Status</label>
                <div className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedDisbursement.status)}`}>
                  {getStatusIcon(selectedDisbursement.status)}
                  {selectedDisbursement.status}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Customer Name</label>
                  <p className="text-slate-200 font-medium mt-1">{selectedDisbursement.customerName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Customer ID</label>
                  <p className="text-slate-200 font-medium mt-1">{selectedDisbursement.customerId}</p>
                </div>
              </div>

              {/* Loan Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Loan ID</label>
                  <p className="text-slate-200 font-medium mt-1">{selectedDisbursement.loanId}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Amount</label>
                  <p className="text-emerald-400 font-bold text-xl mt-1">{formatCurrency(selectedDisbursement.amount)}</p>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Bank Account Details</label>
                <div className="glass rounded-lg p-4 border border-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Name</span>
                    <span className="text-slate-200">{selectedDisbursement.bankAccount.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Holder</span>
                    <span className="text-slate-200">{selectedDisbursement.bankAccount.accountHolder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Number</span>
                    <span className="text-slate-200 font-mono">{selectedDisbursement.bankAccount.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC Code</span>
                    <span className="text-slate-200 font-mono">{selectedDisbursement.bankAccount.ifsc}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Method</label>
                  <p className="text-slate-200 font-medium mt-1">{selectedDisbursement.method}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">UTR Number</label>
                  <p className="text-slate-200 font-mono mt-1">{selectedDisbursement.utr || 'N/A'}</p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Initiated At</label>
                  <p className="text-slate-200 mt-1">{new Date(selectedDisbursement.initiatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Processed At</label>
                  <p className="text-slate-200 mt-1">
                    {selectedDisbursement.processedAt ? new Date(selectedDisbursement.processedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Failure Reason */}
              {selectedDisbursement.failureReason && (
                <div>
                  <label className="text-sm text-slate-400">Failure Reason</label>
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400">{selectedDisbursement.failureReason}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-sm text-slate-400">Notes</label>
                <p className="text-slate-200 mt-1">{selectedDisbursement.notes}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                {selectedDisbursement.status === 'FAILED' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRetry(selectedDisbursement.id)}
                    className="flex-1 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors"
                  >
                    Retry Disbursement
                  </motion.button>
                )}
                {selectedDisbursement.status === 'SUCCESS' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReverse(selectedDisbursement.id)}
                    className="flex-1 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Reverse Transaction
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
                >
                  Download Receipt
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}