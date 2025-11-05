"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale, FileText, AlertTriangle, CheckCircle, Clock, Users,
  DollarSign, TrendingUp, Activity, Target, Award, Briefcase,
  Search, Filter, Eye, Edit, Download, Upload, Calendar, Mail
} from "lucide-react";

interface LegalCase {
  id: string;
  caseNumber: string;
  customerId: string;
  customerName: string;
  loanId: string;
  outstandingAmount: number;
  caseType: 'CIVIL_SUIT' | 'ARBITRATION' | 'DRT' | 'SARFAESI' | 'LOK_ADALAT';
  status: 'FILED' | 'PENDING' | 'HEARING' | 'SETTLED' | 'CLOSED';
  filedDate: string;
  nextHearing?: string;
  lawyer: string;
  court: string;
}

interface Notice {
  id: string;
  type: 'DEMAND_NOTICE' | 'LEGAL_NOTICE' | 'RECALL_NOTICE' | 'POSSESSION_NOTICE';
  customerId: string;
  customerName: string;
  loanId: string;
  issuedDate: string;
  responseDate?: string;
  status: 'SENT' | 'DELIVERED' | 'RESPONDED' | 'EXPIRED';
  amount: number;
}

export default function LegalRecoveryPage() {
  const [cases, setCases] = useState<LegalCase[]>([
    {
      id: 'LC001',
      caseNumber: 'CS/2024/001',
      customerId: 'CU001',
      customerName: 'Rahul Sharma',
      loanId: 'LN12345',
      outstandingAmount: 2500000,
      caseType: 'SARFAESI',
      status: 'PENDING',
      filedDate: '2024-01-15',
      nextHearing: '2024-02-10',
      lawyer: 'Advocate Singh',
      court: 'District Court, Mumbai'
    }
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 'NOT001',
      type: 'DEMAND_NOTICE',
      customerId: 'CU002',
      customerName: 'Priya Patel',
      loanId: 'LN12346',
      issuedDate: '2024-01-20',
      status: 'DELIVERED',
      amount: 500000
    }
  ]);

  const stats = {
    activeCases: 45,
    totalRecovered: 125000000,
    pendingAmount: 78000000,
    noticesSent: 234,
    settledCases: 156,
    successRate: 68.5
  };

  const getCaseTypeColor = (type: string) => {
    switch (type) {
      case 'CIVIL_SUIT': return 'bg-blue-500/20 text-blue-400';
      case 'ARBITRATION': return 'bg-purple-500/20 text-purple-400';
      case 'DRT': return 'bg-emerald-500/20 text-emerald-400';
      case 'SARFAESI': return 'bg-orange-500/20 text-orange-400';
      case 'LOK_ADALAT': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FILED': return 'bg-blue-500/20 text-blue-400';
      case 'PENDING': case 'HEARING': return 'bg-yellow-500/20 text-yellow-400';
      case 'SETTLED': case 'CLOSED': return 'bg-emerald-500/20 text-emerald-400';
      case 'SENT': case 'DELIVERED': return 'bg-blue-500/20 text-blue-400';
      case 'RESPONDED': return 'bg-emerald-500/20 text-emerald-400';
      case 'EXPIRED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-400" />
            Legal & Recovery Module
          </h1>
          <p className="text-slate-400 mt-1">Legal cases, notices & recovery actions tracking</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg"
          >
            <Mail className="w-4 h-4" />
            Send Notice
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg"
          >
            <FileText className="w-4 h-4" />
            File Case
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Activity, label: 'Active Cases', value: stats.activeCases, color: 'blue' },
          { icon: DollarSign, label: 'Total Recovered', value: `₹${(stats.totalRecovered / 10000000).toFixed(1)}Cr`, color: 'emerald' },
          { icon: Target, label: 'Success Rate', value: `${stats.successRate}%`, color: 'purple' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-2`} />
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Legal Cases</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Case Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Next Hearing</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {cases.map((legalCase) => (
              <tr key={legalCase.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 text-sm font-medium text-blue-400">{legalCase.caseNumber}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-slate-200">{legalCase.customerName}</p>
                    <p className="text-xs text-slate-500">{legalCase.loanId}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getCaseTypeColor(legalCase.caseType)}`}>
                    {legalCase.caseType.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">₹{(legalCase.outstandingAmount / 100000).toFixed(1)}L</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(legalCase.status)}`}>
                    {legalCase.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {legalCase.nextHearing ? new Date(legalCase.nextHearing).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Notices Issued</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Notice Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Issued Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {notices.map((notice) => (
              <tr key={notice.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 text-sm text-slate-200">{notice.type.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-slate-200">{notice.customerName}</p>
                    <p className="text-xs text-slate-500">{notice.loanId}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">₹{(notice.amount / 100000).toFixed(1)}L</td>
                <td className="px-6 py-4 text-sm text-slate-300">{new Date(notice.issuedDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(notice.status)}`}>
                    {notice.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}