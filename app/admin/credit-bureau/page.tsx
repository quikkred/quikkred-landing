"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, TrendingUp, TrendingDown, Activity, AlertTriangle,
  CheckCircle, XCircle, Clock, Download, RefreshCw, Search,
  Eye, FileText, User, Calendar, BarChart3, Target, Zap,
  Database, Server, Wifi, WifiOff, ChevronRight, Star
} from "lucide-react";

interface CreditReport {
  id: string;
  customerId: string;
  customerName: string;
  loanId: string;
  bureau: 'CIBIL' | 'EXPERIAN' | 'EQUIFAX' | 'HIGHMARK';
  reportDate: string;
  score: number;
  previousScore: number | null;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'DISPUTED';
  accountSummary: {
    totalAccounts: number;
    activeAccounts: number;
    closedAccounts: number;
    overdueAccounts: number;
  };
  creditUtilization: number;
  enquiries: {
    last30Days: number;
    last90Days: number;
    last12Months: number;
  };
  delinquency: {
    dpd30: number;
    dpd60: number;
    dpd90: number;
    dpd90Plus: number;
  };
  reportUrl: string | null;
  requestedBy: string;
  cost: number;
}

export default function CreditBureauPage() {
  const [reports, setReports] = useState<CreditReport[]>([
    {
      id: 'CR001',
      customerId: 'CU001',
      customerName: 'Rahul Sharma',
      loanId: 'LN12345',
      bureau: 'CIBIL',
      reportDate: '2024-01-28T10:30:00Z',
      score: 750,
      previousScore: 720,
      status: 'SUCCESS',
      accountSummary: {
        totalAccounts: 8,
        activeAccounts: 5,
        closedAccounts: 3,
        overdueAccounts: 0
      },
      creditUtilization: 35,
      enquiries: {
        last30Days: 1,
        last90Days: 2,
        last12Months: 5
      },
      delinquency: {
        dpd30: 0,
        dpd60: 0,
        dpd90: 0,
        dpd90Plus: 0
      },
      reportUrl: '/reports/cibil_001.pdf',
      requestedBy: 'admin@Quikkred.com',
      cost: 50
    },
    {
      id: 'CR002',
      customerId: 'CU002',
      customerName: 'Priya Patel',
      loanId: 'LN12346',
      bureau: 'EXPERIAN',
      reportDate: '2024-01-28T11:00:00Z',
      score: 680,
      previousScore: 690,
      status: 'SUCCESS',
      accountSummary: {
        totalAccounts: 6,
        activeAccounts: 4,
        closedAccounts: 2,
        overdueAccounts: 1
      },
      creditUtilization: 65,
      enquiries: {
        last30Days: 2,
        last90Days: 4,
        last12Months: 8
      },
      delinquency: {
        dpd30: 1,
        dpd60: 0,
        dpd90: 0,
        dpd90Plus: 0
      },
      reportUrl: '/reports/experian_002.pdf',
      requestedBy: 'underwriter@Quikkred.com',
      cost: 45
    },
    {
      id: 'CR003',
      customerId: 'CU003',
      customerName: 'Amit Kumar',
      loanId: 'LN12347',
      bureau: 'EQUIFAX',
      reportDate: '2024-01-28T09:45:00Z',
      score: 620,
      previousScore: 640,
      status: 'SUCCESS',
      accountSummary: {
        totalAccounts: 12,
        activeAccounts: 8,
        closedAccounts: 4,
        overdueAccounts: 2
      },
      creditUtilization: 85,
      enquiries: {
        last30Days: 3,
        last90Days: 6,
        last12Months: 15
      },
      delinquency: {
        dpd30: 2,
        dpd60: 1,
        dpd90: 1,
        dpd90Plus: 0
      },
      reportUrl: '/reports/equifax_003.pdf',
      requestedBy: 'admin@Quikkred.com',
      cost: 40
    }
  ]);

  const [selectedBureau, setSelectedBureau] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<CreditReport | null>(null);

  const stats = {
    totalReports: 1245,
    todayReports: 23,
    avgScore: 695,
    totalCost: 62250,
    bureauStatus: {
      cibil: 'ONLINE',
      experian: 'ONLINE',
      equifax: 'ONLINE',
      highmark: 'OFFLINE'
    }
  };

  const getScoreCategory = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'emerald', range: '750-900' };
    if (score >= 700) return { label: 'Good', color: 'blue', range: '700-749' };
    if (score >= 650) return { label: 'Fair', color: 'yellow', range: '650-699' };
    if (score >= 600) return { label: 'Poor', color: 'orange', range: '600-649' };
    return { label: 'Very Poor', color: 'red', range: '300-599' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'FAILED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'DISPUTED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredReports = reports.filter(r => {
    const matchesBureau = selectedBureau === 'ALL' || r.bureau === selectedBureau;
    const matchesSearch = searchTerm === '' ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesBureau && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            Credit Bureau Integration
          </h1>
          <p className="text-slate-400 mt-1">CIBIL, Experian, Equifax & Highmark reports</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Bulk Download
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <Zap className="w-4 h-4" />
            Pull New Report
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
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Total Reports</p>
          <p className="text-2xl font-bold text-white">{stats.totalReports}</p>
          <p className="text-sm text-blue-400 mt-2">+{stats.todayReports} today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Average Score</p>
          <p className="text-2xl font-bold text-white">{stats.avgScore}</p>
          <p className="text-sm text-emerald-400 mt-2">Good category</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Total Cost (MTD)</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalCost)}</p>
          <p className="text-sm text-slate-400 mt-2">Avg: ₹50/report</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Bureau Status</p>
          <p className="text-2xl font-bold text-emerald-400">3/4 Online</p>
          <p className="text-sm text-slate-400 mt-2">All systems operational</p>
        </motion.div>
      </div>

      {/* Bureau Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: 'CIBIL', status: stats.bureauStatus.cibil, icon: Database },
          { name: 'Experian', status: stats.bureauStatus.experian, icon: Server },
          { name: 'Equifax', status: stats.bureauStatus.equifax, icon: Database },
          { name: 'Highmark', status: stats.bureauStatus.highmark, icon: Server }
        ].map((bureau, index) => (
          <motion.div
            key={bureau.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4 border border-slate-700 hover:shadow-glow transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <bureau.icon className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-slate-200">{bureau.name}</span>
              </div>
              {bureau.status === 'ONLINE' ? (
                <Wifi className="w-4 h-4 text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded ${
              bureau.status === 'ONLINE'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {bureau.status}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, loan ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedBureau}
            onChange={(e) => setSelectedBureau(e.target.value)}
            className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Bureaus</option>
            <option value="CIBIL">CIBIL</option>
            <option value="EXPERIAN">Experian</option>
            <option value="EQUIFAX">Equifax</option>
            <option value="HIGHMARK">Highmark</option>
          </select>

          <select className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="ALL">All Scores</option>
            <option value="EXCELLENT">Excellent (750+)</option>
            <option value="GOOD">Good (700-749)</option>
            <option value="FAIR">Fair (650-699)</option>
            <option value="POOR">Poor (below 650)</option>
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

      {/* Reports Table */}
      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Bureau
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Accounts
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Enquiries (12M)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredReports.map((report, index) => {
                const scoreCategory = getScoreCategory(report.score);
                return (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{report.customerName}</p>
                          <p className="text-xs text-slate-500">{report.customerId} • {report.loanId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-medium">{report.bureau}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold text-${scoreCategory.color}-400`}>
                          {report.score}
                        </span>
                        {report.previousScore && (
                          <div className="flex items-center gap-1">
                            {report.score > report.previousScore ? (
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-xs text-slate-500">
                              {Math.abs(report.score - report.previousScore)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${scoreCategory.color}-500/20 text-${scoreCategory.color}-400`}>
                        <Star className="w-3 h-3" />
                        {scoreCategory.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-slate-300">{report.accountSummary.totalAccounts} total</div>
                        <div className="text-xs text-slate-500">
                          {report.accountSummary.activeAccounts} active
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        report.enquiries.last12Months > 10 ? 'text-red-400' :
                        report.enquiries.last12Months > 5 ? 'text-yellow-400' :
                        'text-emerald-400'
                      }`}>
                        {report.enquiries.last12Months}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                        {report.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {report.status === 'FAILED' && <XCircle className="w-3 h-3" />}
                        {report.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedReport(report)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl border border-slate-700 max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Credit Report Details</h2>
                <p className="text-sm text-slate-400">{selectedReport.bureau} Report • {selectedReport.id}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credit Score Card */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Credit Score</h3>
                <div className="text-center">
                  <div className={`text-6xl font-bold text-${getScoreCategory(selectedReport.score).color}-400 mb-2`}>
                    {selectedReport.score}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${getScoreCategory(selectedReport.score).color}-500/20 text-${getScoreCategory(selectedReport.score).color}-400 mb-4`}>
                    <Star className="w-4 h-4" />
                    {getScoreCategory(selectedReport.score).label}
                  </div>
                  <p className="text-sm text-slate-400">
                    Range: {getScoreCategory(selectedReport.score).range}
                  </p>
                </div>
              </div>

              {/* Account Summary */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Accounts</span>
                    <span className="text-white font-semibold">{selectedReport.accountSummary.totalAccounts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Accounts</span>
                    <span className="text-emerald-400 font-semibold">{selectedReport.accountSummary.activeAccounts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Closed Accounts</span>
                    <span className="text-slate-300 font-semibold">{selectedReport.accountSummary.closedAccounts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Overdue Accounts</span>
                    <span className={`font-semibold ${selectedReport.accountSummary.overdueAccounts > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedReport.accountSummary.overdueAccounts}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credit Utilization */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Credit Utilization</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className={`text-3xl font-bold ${
                        selectedReport.creditUtilization > 70 ? 'text-red-400' :
                        selectedReport.creditUtilization > 50 ? 'text-yellow-400' :
                        'text-emerald-400'
                      }`}>
                        {selectedReport.creditUtilization}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-700">
                    <div
                      style={{ width: `${selectedReport.creditUtilization}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        selectedReport.creditUtilization > 70 ? 'bg-red-500' :
                        selectedReport.creditUtilization > 50 ? 'bg-yellow-500' :
                        'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {selectedReport.creditUtilization > 70 ? 'High utilization may impact score negatively' :
                     selectedReport.creditUtilization > 50 ? 'Moderate utilization' :
                     'Good utilization rate'}
                  </p>
                </div>
              </div>

              {/* Enquiries */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Credit Enquiries</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last 30 Days</span>
                    <span className="text-white font-semibold">{selectedReport.enquiries.last30Days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last 90 Days</span>
                    <span className="text-white font-semibold">{selectedReport.enquiries.last90Days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last 12 Months</span>
                    <span className={`font-semibold ${
                      selectedReport.enquiries.last12Months > 10 ? 'text-red-400' :
                      selectedReport.enquiries.last12Months > 5 ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      {selectedReport.enquiries.last12Months}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delinquency */}
              <div className="glass rounded-xl p-6 border border-slate-700 md:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Delinquency Status (DPD)</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-2xl font-bold text-yellow-400">{selectedReport.delinquency.dpd30}</div>
                    <div className="text-xs text-slate-400 mt-1">0-30 Days</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-2xl font-bold text-orange-400">{selectedReport.delinquency.dpd60}</div>
                    <div className="text-xs text-slate-400 mt-1">30-60 Days</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-2xl font-bold text-red-400">{selectedReport.delinquency.dpd90}</div>
                    <div className="text-xs text-slate-400 mt-1">60-90 Days</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-2xl font-bold text-red-600">{selectedReport.delinquency.dpd90Plus}</div>
                    <div className="text-xs text-slate-400 mt-1">90+ Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Pull New Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
              >
                Download Full Report
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}