"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, TrendingDown, FileText, Calendar, BarChart3,
  PieChart, Activity, Target, Award, Briefcase, CheckCircle, AlertCircle,
  Download, Upload, Search, Filter, Eye, CreditCard, Receipt, Wallet
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  account: string;
  amount: number;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  reference: string;
}

export default function AccountingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      date: '2024-01-28',
      type: 'CREDIT',
      category: 'Loan Disbursement',
      account: 'Operating Account',
      amount: 5000000,
      description: 'Loan disbursed to customer',
      status: 'COMPLETED',
      reference: 'LN12345'
    }
  ]);

  const stats = {
    totalRevenue: 125000000,
    totalExpenses: 78000000,
    netProfit: 47000000,
    profitMargin: 37.6,
    assets: 2500000000,
    liabilities: 1800000000,
    equity: 700000000,
    cashFlow: 45000000
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            Accounting & ERP Module
          </h1>
          <p className="text-slate-400 mt-1">General ledger, AP/AR, GST/TDS compliance & financial statements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Total Revenue', value: `₹${(stats.totalRevenue / 10000000).toFixed(1)}Cr`, color: 'emerald' },
          { icon: TrendingDown, label: 'Total Expenses', value: `₹${(stats.totalExpenses / 10000000).toFixed(1)}Cr`, color: 'red' },
          { icon: Award, label: 'Net Profit', value: `₹${(stats.netProfit / 10000000).toFixed(1)}Cr`, color: 'blue' },
          { icon: Target, label: 'Profit Margin', value: `${stats.profitMargin}%`, color: 'purple' }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            Balance Sheet
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Assets</span>
              <span className="text-sm font-medium text-white">₹{(stats.assets / 10000000).toFixed(1)}Cr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Liabilities</span>
              <span className="text-sm font-medium text-white">₹{(stats.liabilities / 10000000).toFixed(1)}Cr</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-700">
              <span className="text-sm text-slate-400">Equity</span>
              <span className="text-sm font-medium text-emerald-400">₹{(stats.equity / 10000000).toFixed(1)}Cr</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Cash Flow
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Operating</span>
              <span className="text-sm font-medium text-emerald-400">₹{(stats.cashFlow / 10000000).toFixed(1)}Cr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Investing</span>
              <span className="text-sm font-medium text-blue-400">₹3.2Cr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Financing</span>
              <span className="text-sm font-medium text-purple-400">₹2.8Cr</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-yellow-400" />
            Tax Compliance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">GST Filed</span>
              <span className="text-sm font-medium text-emerald-400"> Jan 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">TDS Filed</span>
              <span className="text-sm font-medium text-emerald-400"> Q3 FY24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Income Tax</span>
              <span className="text-sm font-medium text-yellow-400">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Account</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 text-sm text-slate-300">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${txn.type === 'CREDIT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {txn.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{txn.category}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{txn.account}</td>
                <td className="px-6 py-4 text-sm font-medium text-white">₹{(txn.amount / 100000).toFixed(1)}L</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                    {txn.status}
                  </span>
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
    </div>
  );
}