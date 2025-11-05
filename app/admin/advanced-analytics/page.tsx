"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, PieChart, Activity, Target, Award,
  Users, DollarSign, Calendar, Clock, AlertCircle, CheckCircle,
  Eye, Download, RefreshCw, Filter, Search, Zap, Brain, LineChart
} from "lucide-react";

export default function AdvancedAnalyticsPage() {
  const stats = {
    totalLoans: 15678,
    disbursedAmount: 2345000000,
    collectionRate: 96.8,
    npa: 2.3,
    avgTicketSize: 150000,
    conversionRate: 68.5,
    customerSatisfaction: 4.6,
    profitMargin: 37.6
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            Advanced Analytics & Business Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Executive dashboards, predictive analytics & custom reports</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg"
          >
            <Brain className="w-4 h-4" />
            AI Insights
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Loans', value: stats.totalLoans.toLocaleString(), color: 'blue' },
          { icon: DollarSign, label: 'Disbursed', value: `₹${(stats.disbursedAmount / 10000000).toFixed(1)}Cr`, color: 'emerald' },
          { icon: TrendingUp, label: 'Collection', value: `${stats.collectionRate}%`, color: 'purple' },
          { icon: AlertCircle, label: 'NPA', value: `${stats.npa}%`, color: 'red' }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-400" />
            Loan Disbursement Trend
          </h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            [Disbursement Chart Visualization]
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Portfolio Distribution
          </h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            [Portfolio Pie Chart]
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Key Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Avg Ticket Size</span>
              <span className="text-sm font-medium text-white">₹{(stats.avgTicketSize / 1000)}K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Conversion Rate</span>
              <span className="text-sm font-medium text-emerald-400">{stats.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">CSAT Score</span>
              <span className="text-sm font-medium text-yellow-400">{stats.customerSatisfaction}/5</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Predictions
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Default Risk</span>
              <span className="text-sm font-medium text-red-400">Low</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Growth Forecast</span>
              <span className="text-sm font-medium text-emerald-400">+15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Churn Risk</span>
              <span className="text-sm font-medium text-yellow-400">Medium</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm text-left">
              Generate Monthly Report
            </button>
            <button className="w-full p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-sm text-left">
              Export to Excel
            </button>
            <button className="w-full p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 text-sm text-left">
              Schedule Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}