"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity, TrendingUp, TrendingDown, DollarSign,
  Users, CheckCircle, XCircle, Clock, BarChart3,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

interface LoanMetric {
  status: string;
  count: number;
  amount: number;
  color: string;
}

export default function OperationsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loanMetrics, setLoanMetrics] = useState<LoanMetric[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMetrics([
        {
          title: "Total Applications",
          value: "1,284",
          change: 12.5,
          trend: 'up',
          icon: Users,
          color: "blue"
        },
        {
          title: "Approved Loans",
          value: "₹42.5M",
          change: 8.2,
          trend: 'up',
          icon: CheckCircle,
          color: "green"
        },
        {
          title: "Pending Review",
          value: "186",
          change: -5.3,
          trend: 'down',
          icon: Clock,
          color: "yellow"
        },
        {
          title: "Rejection Rate",
          value: "12.4%",
          change: -2.1,
          trend: 'down',
          icon: XCircle,
          color: "red"
        }
      ]);

      setLoanMetrics([
        { status: "Approved", count: 845, amount: 42500000, color: "green" },
        { status: "Pending", count: 186, amount: 9300000, color: "yellow" },
        { status: "Under Review", count: 142, amount: 7100000, color: "blue" },
        { status: "Rejected", count: 111, amount: 5550000, color: "red" }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
      red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 border border-slate-700">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Operations Dashboard</h2>
          <p className="text-slate-400 mt-1">Real-time loan metrics and approval queues</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colors = getColorClasses(metric.color);

          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass rounded-2xl p-6 border ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-slate-100">{metric.value}</p>
              <p className="text-xs text-slate-500 mt-2">vs last month</p>
            </motion.div>
          );
        })}
      </div>

      {/* Loan Status Breakdown */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Loan Status Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loanMetrics.map((metric, index) => {
            const colors = getColorClasses(metric.color);

            return (
              <motion.div
                key={metric.status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}
              >
                <div className="text-center">
                  <p className={`text-sm font-medium ${colors.text} mb-2`}>{metric.status}</p>
                  <p className="text-3xl font-bold text-slate-100 mb-1">{metric.count}</p>
                  <p className="text-sm text-slate-400">{formatCurrency(metric.amount)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-400" />
          Recent Activity
        </h3>

        <div className="space-y-3">
          {[
            { action: "Loan Approved", user: "Rajesh Kumar", amount: "₹5,00,000", time: "5 minutes ago", type: "approved" },
            { action: "Application Submitted", user: "Priya Sharma", amount: "₹2,50,000", time: "12 minutes ago", type: "pending" },
            { action: "Loan Rejected", user: "Amit Patel", amount: "₹7,50,000", time: "25 minutes ago", type: "rejected" },
            { action: "KYC Verified", user: "Sneha Reddy", amount: "₹3,00,000", time: "1 hour ago", type: "verified" },
            { action: "Loan Disbursed", user: "Vikram Singh", amount: "₹10,00,000", time: "2 hours ago", type: "disbursed" }
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'approved' ? 'bg-green-400' :
                  activity.type === 'rejected' ? 'bg-red-400' :
                  activity.type === 'disbursed' ? 'bg-blue-400' :
                  activity.type === 'verified' ? 'bg-purple-400' :
                  'bg-yellow-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-100">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.user} • {activity.amount}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Average Processing Time</h4>
          <p className="text-3xl font-bold text-slate-100">2.4 days</p>
          <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
            <TrendingDown className="h-4 w-4" />
            15% faster than last month
          </p>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Customer Satisfaction</h4>
          <p className="text-3xl font-bold text-slate-100">4.8/5.0</p>
          <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Based on 1,234 reviews
          </p>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Default Rate</h4>
          <p className="text-3xl font-bold text-slate-100">2.3%</p>
          <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
            <TrendingDown className="h-4 w-4" />
            0.5% lower than average
          </p>
        </div>
      </div>
    </div>
  );
}
