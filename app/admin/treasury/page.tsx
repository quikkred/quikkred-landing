"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Building,
  ArrowUpRight, ArrowDownRight, Activity, PieChart, BarChart3,
  Clock, AlertTriangle, CheckCircle, Calendar, Download,
  RefreshCw, Eye, Plus, CreditCard, Landmark, Target,
  Zap, Lock, Unlock, FileText, Shield
} from "lucide-react";

interface FundSource {
  id: string;
  name: string;
  type: 'EQUITY' | 'DEBT' | 'BANK_LOAN' | 'NCD' | 'CP' | 'INVESTOR';
  amount: number;
  utilized: number;
  available: number;
  interestRate: number;
  maturityDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

interface LiquidityMetrics {
  totalFunds: number;
  availableLiquidity: number;
  deployedFunds: number;
  reserveRatio: number;
  utilizationRate: number;
  dailyBurnRate: number;
  runwayDays: number;
}

export default function TreasuryManagementPage() {
  const [fundSources, setFundSources] = useState<FundSource[]>([
    {
      id: 'FS001',
      name: 'HDFC Bank Term Loan',
      type: 'BANK_LOAN',
      amount: 500000000,
      utilized: 350000000,
      available: 150000000,
      interestRate: 10.5,
      maturityDate: '2026-12-31',
      status: 'ACTIVE'
    },
    {
      id: 'FS002',
      name: 'Series A Equity',
      type: 'EQUITY',
      amount: 1000000000,
      utilized: 800000000,
      available: 200000000,
      interestRate: 0,
      maturityDate: '',
      status: 'ACTIVE'
    },
    {
      id: 'FS003',
      name: 'Non-Convertible Debentures',
      type: 'NCD',
      amount: 300000000,
      utilized: 300000000,
      available: 0,
      interestRate: 12.0,
      maturityDate: '2025-06-30',
      status: 'ACTIVE'
    },
    {
      id: 'FS004',
      name: 'Commercial Paper - Q1',
      type: 'CP',
      amount: 150000000,
      utilized: 150000000,
      available: 0,
      interestRate: 8.5,
      maturityDate: '2024-03-31',
      status: 'ACTIVE'
    },
    {
      id: 'FS005',
      name: 'Angel Investment Round',
      type: 'INVESTOR',
      amount: 250000000,
      utilized: 180000000,
      available: 70000000,
      interestRate: 0,
      maturityDate: '',
      status: 'ACTIVE'
    }
  ]);

  const liquidity: LiquidityMetrics = {
    totalFunds: 2200000000,
    availableLiquidity: 420000000,
    deployedFunds: 1780000000,
    reserveRatio: 19.1,
    utilizationRate: 80.9,
    dailyBurnRate: 12500000,
    runwayDays: 33
  };

  const cashFlowData = {
    inflows: [
      { label: 'EMI Collections', amount: 85000000, color: 'emerald' },
      { label: 'Foreclosures', amount: 15000000, color: 'blue' },
      { label: 'Processing Fees', amount: 5000000, color: 'purple' },
      { label: 'Other Income', amount: 2000000, color: 'yellow' }
    ],
    outflows: [
      { label: 'Loan Disbursements', amount: 95000000, color: 'red' },
      { label: 'Operational Costs', amount: 8000000, color: 'orange' },
      { label: 'Interest Payments', amount: 4000000, color: 'pink' },
      { label: 'Others', amount: 1500000, color: 'slate' }
    ]
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EQUITY': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'DEBT': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'BANK_LOAN': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'NCD': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CP': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'INVESTOR': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-400" />
            Treasury & Funds Management
          </h1>
          <p className="text-slate-400 mt-1">Monitor liquidity, fund sources, and cash flow</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Fund Source
          </motion.button>
        </div>
      </div>

      {/* Liquidity Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 gradient-primary rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Total Funds</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(liquidity.totalFunds)}</p>
          <p className="text-sm text-slate-400 mt-2">All sources combined</p>
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
          <p className="text-sm text-slate-400">Available Liquidity</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(liquidity.availableLiquidity)}</p>
          <div className="flex items-center gap-1 text-sm text-slate-400 mt-2">
            <span>{liquidity.reserveRatio}% reserve ratio</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Deployed Funds</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(liquidity.deployedFunds)}</p>
          <p className="text-sm text-blue-400 mt-2">{liquidity.utilizationRate}% utilization</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${liquidity.runwayDays < 30 ? 'bg-red-500/20' : 'bg-yellow-500/20'} rounded-xl`}>
              <Clock className={`w-6 h-6 ${liquidity.runwayDays < 30 ? 'text-red-400' : 'text-yellow-400'}`} />
            </div>
          </div>
          <p className="text-sm text-slate-400">Runway</p>
          <p className={`text-2xl font-bold ${liquidity.runwayDays < 30 ? 'text-red-400' : 'text-yellow-400'}`}>
            {liquidity.runwayDays} days
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Burn: {formatCurrency(liquidity.dailyBurnRate)}/day
          </p>
        </motion.div>
      </div>

      {/* Cash Flow Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inflows */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-emerald-400" />
              Cash Inflows (Today)
            </h3>
            <span className="text-2xl font-bold text-emerald-400">
              {formatCurrency(cashFlowData.inflows.reduce((sum, item) => sum + item.amount, 0))}
            </span>
          </div>
          <div className="space-y-3">
            {cashFlowData.inflows.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <span className="text-emerald-400 font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Outflows */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-red-400" />
              Cash Outflows (Today)
            </h3>
            <span className="text-2xl font-bold text-red-400">
              {formatCurrency(cashFlowData.outflows.reduce((sum, item) => sum + item.amount, 0))}
            </span>
          </div>
          <div className="space-y-3">
            {cashFlowData.outflows.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <span className="text-red-400 font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Net Position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Net Cash Position (Today)</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(
                  cashFlowData.inflows.reduce((sum, item) => sum + item.amount, 0) -
                  cashFlowData.outflows.reduce((sum, item) => sum + item.amount, 0)
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Positive Flow</span>
          </div>
        </div>
      </motion.div>

      {/* Fund Sources Table */}
      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-400" />
            Fund Sources
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Source Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Utilized
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Maturity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {fundSources.map((source, index) => (
                <motion.tr
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{source.name}</span>
                      <span className="text-xs text-slate-500">{source.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(source.type)}`}>
                      {source.type.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(source.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-blue-400">
                        {formatCurrency(source.utilized)}
                      </span>
                      <div className="w-32 bg-slate-700 rounded-full h-1 mt-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${(source.utilized / source.amount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(source.available)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">
                      {source.interestRate > 0 ? `${source.interestRate}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400">
                      {source.maturityDate ? new Date(source.maturityDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reserve Requirements & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">CRR (Cash Reserve Ratio)</p>
              <p className="text-2xl font-bold text-white">4.5%</p>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-4 pt-4 border-t border-slate-700">
            <span className="text-slate-400">Required</span>
            <span className="text-emerald-400 font-semibold">{formatCurrency(99000000)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-slate-400">Maintained</span>
            <span className="text-white font-semibold">{formatCurrency(110000000)}</span>
          </div>
          <div className="mt-4 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
            <span className="text-xs text-emerald-400 font-medium">✓ Compliant</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">SLR (Statutory Liquidity Ratio)</p>
              <p className="text-2xl font-bold text-white">18%</p>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-4 pt-4 border-t border-slate-700">
            <span className="text-slate-400">Required</span>
            <span className="text-blue-400 font-semibold">{formatCurrency(396000000)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-slate-400">Maintained</span>
            <span className="text-white font-semibold">{formatCurrency(420000000)}</span>
          </div>
          <div className="mt-4 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
            <span className="text-xs text-emerald-400 font-medium">✓ Compliant</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Landmark className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Capital Adequacy Ratio</p>
              <p className="text-2xl font-bold text-white">15.2%</p>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-4 pt-4 border-t border-slate-700">
            <span className="text-slate-400">Minimum Required</span>
            <span className="text-yellow-400 font-semibold">15%</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-slate-400">Current</span>
            <span className="text-white font-semibold">15.2%</span>
          </div>
          <div className="mt-4 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
            <span className="text-xs text-emerald-400 font-medium">✓ Compliant</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}