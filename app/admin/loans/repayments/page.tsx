"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle,
  CreditCard, TrendingUp, Download, RefreshCw, Search, Filter,
  Eye, Send, ArrowRight, Users, Building, Smartphone, Mail,
  FileText, BarChart3, Target, Award, Zap, ChevronRight
} from "lucide-react";

interface EMISchedule {
  id: string;
  loanId: string;
  customerName: string;
  customerId: string;
  emiNumber: number;
  totalEmis: number;
  amount: number;
  principal: number;
  interest: number;
  dueDate: string;
  paidDate: string | null;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL' | 'SCHEDULED';
  paymentMethod: 'AUTO_DEBIT' | 'NACH' | 'ENACH' | 'MANUAL' | 'UPI' | 'NEFT';
  amountPaid: number;
  penaltyAmount: number;
  bounceCharge: number;
  mandate: {
    id: string;
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
    bankName: string;
    accountNumber: string;
  };
}

export default function RepaymentManagementPage() {
  const [repayments, setRepayments] = useState<EMISchedule[]>([
    {
      id: 'EMI001',
      loanId: 'LN12345',
      customerName: 'Rahul Sharma',
      customerId: 'CU001',
      emiNumber: 1,
      totalEmis: 12,
      amount: 45000,
      principal: 40000,
      interest: 5000,
      dueDate: '2024-02-05',
      paidDate: '2024-02-04',
      status: 'PAID',
      paymentMethod: 'AUTO_DEBIT',
      amountPaid: 45000,
      penaltyAmount: 0,
      bounceCharge: 0,
      mandate: {
        id: 'MND001',
        status: 'ACTIVE',
        bankName: 'HDFC Bank',
        accountNumber: '****7890'
      }
    },
    {
      id: 'EMI002',
      loanId: 'LN12346',
      customerName: 'Priya Patel',
      customerId: 'CU002',
      emiNumber: 3,
      totalEmis: 24,
      amount: 15000,
      principal: 12000,
      interest: 3000,
      dueDate: '2024-02-10',
      paidDate: null,
      status: 'PENDING',
      paymentMethod: 'NACH',
      amountPaid: 0,
      penaltyAmount: 0,
      bounceCharge: 0,
      mandate: {
        id: 'MND002',
        status: 'ACTIVE',
        bankName: 'ICICI Bank',
        accountNumber: '****3210'
      }
    },
    {
      id: 'EMI003',
      loanId: 'LN12347',
      customerName: 'Amit Kumar',
      customerId: 'CU003',
      emiNumber: 5,
      totalEmis: 18,
      amount: 22000,
      principal: 19000,
      interest: 3000,
      dueDate: '2024-01-28',
      paidDate: null,
      status: 'OVERDUE',
      paymentMethod: 'ENACH',
      amountPaid: 0,
      penaltyAmount: 500,
      bounceCharge: 0,
      mandate: {
        id: 'MND003',
        status: 'ACTIVE',
        bankName: 'SBI',
        accountNumber: '****6677'
      }
    },
    {
      id: 'EMI004',
      loanId: 'LN12348',
      customerName: 'Sneha Reddy',
      customerId: 'CU004',
      emiNumber: 2,
      totalEmis: 36,
      amount: 28000,
      principal: 24000,
      interest: 4000,
      dueDate: '2024-01-25',
      paidDate: '2024-01-26',
      status: 'PARTIAL',
      paymentMethod: 'MANUAL',
      amountPaid: 20000,
      penaltyAmount: 200,
      bounceCharge: 250,
      mandate: {
        id: 'MND004',
        status: 'INACTIVE',
        bankName: 'Axis Bank',
        accountNumber: '****0011'
      }
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepayment, setSelectedRepayment] = useState<EMISchedule | null>(null);

  const stats = {
    totalCollected: 35000000,
    todayCollection: 2500000,
    pendingCollection: 5000000,
    overdueAmount: 1200000,
    overdueCount: 45,
    collectionRate: 92,
    bounceRate: 3.5,
    mandateActive: 1234,
    mandateInactive: 56
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PENDING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'SCHEDULED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'OVERDUE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PARTIAL': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'SCHEDULED': return <Calendar className="w-4 h-4" />;
      case 'OVERDUE': return <AlertTriangle className="w-4 h-4" />;
      case 'PARTIAL': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'PAID') return false;
    return new Date(dueDate) < new Date();
  };

  const filteredRepayments = repayments.filter(r => {
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesSearch = searchTerm === '' ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-400" />
            Repayment & EMI Management
          </h1>
          <p className="text-slate-400 mt-1">Track EMI schedules, auto-debit, and collections</p>
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
            Send Payment Link
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
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
          <p className="text-sm text-slate-400">Total Collected (MTD)</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalCollected)}</p>
          <div className="flex items-center gap-1 text-sm text-emerald-400 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>{stats.collectionRate}% collection rate</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Pending Collection</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.pendingCollection)}</p>
          <p className="text-sm text-slate-400 mt-2">Due within 7 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Overdue Amount</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.overdueAmount)}</p>
          <p className="text-sm text-red-400 mt-2">{stats.overdueCount} accounts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Active Mandates</p>
          <p className="text-2xl font-bold text-white">{stats.mandateActive}</p>
          <p className="text-sm text-yellow-400 mt-2">{stats.bounceRate}% bounce rate</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass p-4 rounded-xl border border-slate-700 hover:shadow-glow transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-200 mb-1">Trigger Auto-Debit</h3>
          <p className="text-xs text-slate-400">Process today's EMIs</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass p-4 rounded-xl border border-slate-700 hover:shadow-glow transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-200 mb-1">Overdue Alerts</h3>
          <p className="text-xs text-slate-400">Send reminders</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass p-4 rounded-xl border border-slate-700 hover:shadow-glow transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-200 mb-1">Collection Report</h3>
          <p className="text-xs text-slate-400">View analytics</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass p-4 rounded-xl border border-slate-700 hover:shadow-glow transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-200 mb-1">Mandate Manager</h3>
          <p className="text-xs text-slate-400">Manage auto-debit</p>
        </motion.button>
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
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PARTIAL">Partial</option>
          </select>

          <select className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="ALL">All Periods</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">This Week</option>
            <option value="MONTH">This Month</option>
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

      {/* Repayment List */}
      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  EMI Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredRepayments.map((repayment, index) => (
                <motion.tr
                  key={repayment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{repayment.id}</span>
                      <span className="text-xs text-slate-500">{repayment.loanId}</span>
                      <span className="text-xs text-slate-400 mt-1">
                        EMI {repayment.emiNumber}/{repayment.totalEmis}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{repayment.customerName}</p>
                        <p className="text-xs text-slate-500">{repayment.customerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-emerald-400">
                        {formatCurrency(repayment.amount)}
                      </span>
                      {repayment.status === 'PARTIAL' && (
                        <span className="text-xs text-yellow-400">
                          Paid: {formatCurrency(repayment.amountPaid)}
                        </span>
                      )}
                      {repayment.penaltyAmount > 0 && (
                        <span className="text-xs text-red-400">
                          +{formatCurrency(repayment.penaltyAmount)} penalty
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-300">
                        {new Date(repayment.dueDate).toLocaleDateString()}
                      </span>
                      {isOverdue(repayment.dueDate, repayment.status) && (
                        <span className="text-xs text-red-400">Overdue</span>
                      )}
                      {repayment.paidDate && (
                        <span className="text-xs text-emerald-400">
                          Paid: {new Date(repayment.paidDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(repayment.status)}`}>
                      {getStatusIcon(repayment.status)}
                      {repayment.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-300">{repayment.paymentMethod}</span>
                      <span className="text-xs text-slate-500">{repayment.mandate.bankName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedRepayment(repayment)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      {(repayment.status === 'PENDING' || repayment.status === 'OVERDUE') && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                        >
                          <Send className="w-4 h-4" />
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
      {selectedRepayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl border border-slate-700 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">EMI Details</h2>
                <p className="text-sm text-slate-400">{selectedRepayment.id}</p>
              </div>
              <button
                onClick={() => setSelectedRepayment(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm text-slate-400">Status</label>
                <div className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedRepayment.status)}`}>
                  {getStatusIcon(selectedRepayment.status)}
                  {selectedRepayment.status}
                </div>
              </div>

              {/* EMI Progress */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">EMI Progress</label>
                <div className="glass rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">EMI {selectedRepayment.emiNumber} of {selectedRepayment.totalEmis}</span>
                    <span className="text-blue-400">
                      {Math.round((selectedRepayment.emiNumber / selectedRepayment.totalEmis) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full gradient-primary"
                      style={{ width: `${(selectedRepayment.emiNumber / selectedRepayment.totalEmis) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Amount Breakdown</label>
                <div className="glass rounded-lg p-4 border border-slate-700 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Principal</span>
                    <span className="text-slate-200 font-semibold">{formatCurrency(selectedRepayment.principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interest</span>
                    <span className="text-slate-200 font-semibold">{formatCurrency(selectedRepayment.interest)}</span>
                  </div>
                  {selectedRepayment.penaltyAmount > 0 && (
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span className="text-red-400">Penalty</span>
                      <span className="text-red-400 font-semibold">{formatCurrency(selectedRepayment.penaltyAmount)}</span>
                    </div>
                  )}
                  {selectedRepayment.bounceCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-red-400">Bounce Charge</span>
                      <span className="text-red-400 font-semibold">{formatCurrency(selectedRepayment.bounceCharge)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-700">
                    <span className="text-white font-semibold">Total Due</span>
                    <span className="text-emerald-400 font-bold text-xl">
                      {formatCurrency(selectedRepayment.amount + selectedRepayment.penaltyAmount + selectedRepayment.bounceCharge)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mandate Details */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Auto-Debit Mandate</label>
                <div className="glass rounded-lg p-4 border border-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mandate ID</span>
                    <span className="text-slate-200">{selectedRepayment.mandate.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank</span>
                    <span className="text-slate-200">{selectedRepayment.mandate.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account</span>
                    <span className="text-slate-200 font-mono">{selectedRepayment.mandate.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className={`text-sm font-medium ${
                      selectedRepayment.mandate.status === 'ACTIVE' ? 'text-emerald-400' :
                      selectedRepayment.mandate.status === 'INACTIVE' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {selectedRepayment.mandate.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                {selectedRepayment.status === 'OVERDUE' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Send Reminder
                  </motion.button>
                )}
                {(selectedRepayment.status === 'PENDING' || selectedRepayment.status === 'OVERDUE') && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    Send Payment Link
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
                >
                  Record Payment
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}