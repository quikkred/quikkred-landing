"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Target, TrendingUp, AlertTriangle, CheckCircle, XCircle,
  Settings, BarChart3, Shield, Zap, Eye, Edit, Plus, Download,
  RefreshCw, Search, Filter, Clock, Award, Users, DollarSign,
  Activity, Percent, FileText, ChevronRight, Lock, Unlock
} from "lucide-react";

interface UnderwritingRule {
  id: string;
  name: string;
  category: 'CREDIT_SCORE' | 'INCOME' | 'EMPLOYMENT' | 'AGE' | 'DEBT_TO_INCOME' | 'LOAN_AMOUNT' | 'CUSTOM';
  condition: string;
  threshold: number | string;
  action: 'APPROVE' | 'REJECT' | 'MANUAL_REVIEW' | 'CONDITIONAL_APPROVE';
  weight: number;
  priority: number;
  status: 'ACTIVE' | 'INACTIVE';
  applicationsProcessed: number;
  approvalRate: number;
}

interface DecisionLog {
  id: string;
  loanId: string;
  customerName: string;
  creditScore: number;
  requestedAmount: number;
  monthlyIncome: number;
  dti: number;
  decision: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  autoDecision: boolean;
  confidence: number;
  rulesTriggered: string[];
  processedAt: string;
  processingTime: number; // milliseconds
}

export default function UnderwritingEnginePage() {
  const [rules, setRules] = useState<UnderwritingRule[]>([
    {
      id: 'UW001',
      name: 'Minimum Credit Score',
      category: 'CREDIT_SCORE',
      condition: 'credit_score >= threshold',
      threshold: 650,
      action: 'APPROVE',
      weight: 30,
      priority: 1,
      status: 'ACTIVE',
      applicationsProcessed: 1250,
      approvalRate: 78
    },
    {
      id: 'UW002',
      name: 'Maximum DTI Ratio',
      category: 'DEBT_TO_INCOME',
      condition: 'dti_ratio <= threshold',
      threshold: 50,
      action: 'APPROVE',
      weight: 25,
      priority: 2,
      status: 'ACTIVE',
      applicationsProcessed: 1250,
      approvalRate: 82
    },
    {
      id: 'UW003',
      name: 'Minimum Monthly Income',
      category: 'INCOME',
      condition: 'monthly_income >= threshold',
      threshold: 25000,
      action: 'APPROVE',
      weight: 20,
      priority: 3,
      status: 'ACTIVE',
      applicationsProcessed: 1250,
      approvalRate: 85
    },
    {
      id: 'UW004',
      name: 'Employment Stability',
      category: 'EMPLOYMENT',
      condition: 'employment_months >= threshold',
      threshold: 6,
      action: 'APPROVE',
      weight: 15,
      priority: 4,
      status: 'ACTIVE',
      applicationsProcessed: 1250,
      approvalRate: 90
    },
    {
      id: 'UW005',
      name: 'Age Eligibility',
      category: 'AGE',
      condition: 'age >= min_age AND age <= max_age',
      threshold: '21-65',
      action: 'APPROVE',
      weight: 10,
      priority: 5,
      status: 'ACTIVE',
      applicationsProcessed: 1250,
      approvalRate: 95
    }
  ]);

  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>([
    {
      id: 'DL001',
      loanId: 'LN12345',
      customerName: 'Rahul Sharma',
      creditScore: 750,
      requestedAmount: 500000,
      monthlyIncome: 75000,
      dti: 35,
      decision: 'APPROVED',
      autoDecision: true,
      confidence: 95,
      rulesTriggered: ['UW001', 'UW002', 'UW003', 'UW004', 'UW005'],
      processedAt: '2024-01-28T10:30:00Z',
      processingTime: 1200
    },
    {
      id: 'DL002',
      loanId: 'LN12346',
      customerName: 'Priya Patel',
      creditScore: 680,
      requestedAmount: 300000,
      monthlyIncome: 45000,
      dti: 45,
      decision: 'APPROVED',
      autoDecision: true,
      confidence: 82,
      rulesTriggered: ['UW001', 'UW002', 'UW003', 'UW004', 'UW005'],
      processedAt: '2024-01-28T11:00:00Z',
      processingTime: 1500
    },
    {
      id: 'DL003',
      loanId: 'LN12347',
      customerName: 'Amit Kumar',
      creditScore: 620,
      requestedAmount: 200000,
      monthlyIncome: 30000,
      dti: 55,
      decision: 'MANUAL_REVIEW',
      autoDecision: false,
      confidence: 45,
      rulesTriggered: ['UW002'],
      processedAt: '2024-01-28T12:00:00Z',
      processingTime: 800
    }
  ]);

  const stats = {
    totalProcessed: 1250,
    autoApproved: 875,
    autoRejected: 125,
    manualReview: 250,
    avgProcessingTime: 1.2, // seconds
    automationRate: 80,
    approvalRate: 70
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CREDIT_SCORE': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'INCOME': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'EMPLOYMENT': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'AGE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DEBT_TO_INCOME': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'LOAN_AMOUNT': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'APPROVED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MANUAL_REVIEW': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-400" />
            Underwriting Decision Engine
          </h1>
          <p className="text-slate-400 mt-1">AI-powered credit risk assessment & approval automation</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Export Rules
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Rule
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
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Total Processed</p>
          <p className="text-2xl font-bold text-white">{stats.totalProcessed}</p>
          <p className="text-sm text-blue-400 mt-2">This month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Automation Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.automationRate}%</p>
          <p className="text-sm text-slate-400 mt-2">{stats.autoApproved + stats.autoRejected} auto-decisions</p>
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
          <p className="text-sm text-slate-400">Avg Processing Time</p>
          <p className="text-2xl font-bold text-white">{stats.avgProcessingTime}s</p>
          <p className="text-sm text-emerald-400 mt-2">85% faster</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Approval Rate</p>
          <p className="text-2xl font-bold text-white">{stats.approvalRate}%</p>
          <p className="text-sm text-slate-400 mt-2">{stats.autoApproved} approved</p>
        </motion.div>
      </div>

      {/* Decision Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Auto-Approved</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.autoApproved}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">{Math.round((stats.autoApproved / stats.totalProcessed) * 100)}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${(stats.autoApproved / stats.totalProcessed) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Auto-Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.autoRejected}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">{Math.round((stats.autoRejected / stats.totalProcessed) * 100)}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${(stats.autoRejected / stats.totalProcessed) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Manual Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.manualReview}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">{Math.round((stats.manualReview / stats.totalProcessed) * 100)}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${(stats.manualReview / stats.totalProcessed) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Underwriting Rules */}
      <div className="glass rounded-2xl border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Underwriting Rules ({rules.length})
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="w-4 h-4" />
            <span>{rules.filter(r => r.status === 'ACTIVE').length} active rules</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Rule Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Threshold
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Approval Rate
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
              {rules.map((rule, index) => (
                <motion.tr
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{rule.name}</span>
                      <span className="text-xs text-slate-500">{rule.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(rule.category)}`}>
                      {rule.category.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 font-mono">{rule.condition}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white font-semibold">{rule.threshold}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-400">{rule.weight}%</span>
                      <div className="w-16 bg-slate-700 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${rule.weight}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-emerald-400">{rule.approvalRate}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      rule.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {rule.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="glass rounded-2xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Recent Decisions
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Loan ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  DTI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Decision
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {decisionLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-200">{log.loanId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{log.customerName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${
                      log.creditScore >= 750 ? 'text-emerald-400' :
                      log.creditScore >= 700 ? 'text-blue-400' :
                      log.creditScore >= 650 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {log.creditScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{formatCurrency(log.requestedAmount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${
                      log.dti <= 40 ? 'text-emerald-400' :
                      log.dti <= 50 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {log.dti}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getDecisionColor(log.decision)}`}>
                      {log.decision === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                      {log.decision === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {log.decision === 'MANUAL_REVIEW' && <AlertTriangle className="w-3 h-3" />}
                      {log.decision}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        log.confidence >= 80 ? 'text-emerald-400' :
                        log.confidence >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {log.confidence}%
                      </span>
                      {log.autoDecision && (
                        <span title="Auto-decision"><Zap className="w-3 h-3 text-blue-400" /></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400">{log.processingTime}ms</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}