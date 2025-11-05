"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, UserPlus, Phone, Mail, MessageSquare, Calendar, TrendingUp,
  Activity, Target, Award, DollarSign, Clock, CheckCircle, AlertCircle,
  Search, Filter, Eye, Edit, MoreHorizontal, Tag, Star, Briefcase,
  FileText, BarChart3, PieChart, RefreshCw, Download, Upload
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: 'VIP' | 'HIGH_VALUE' | 'REGULAR' | 'NEW';
  status: 'ACTIVE' | 'INACTIVE' | 'CHURNED';
  totalLoans: number;
  totalValue: number;
  lastInteraction: string;
  nps: number;
  ltv: number;
  tags: string[];
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  source: 'WEBSITE' | 'REFERRAL' | 'PARTNER' | 'ORGANIC';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  score: number;
}

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CU001',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      segment: 'VIP',
      status: 'ACTIVE',
      totalLoans: 5,
      totalValue: 2500000,
      lastInteraction: '2024-01-28T10:00:00Z',
      nps: 9,
      ltv: 150000,
      tags: ['repeat', 'high-value', 'referrer']
    }
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'LD001',
      name: 'Priya Patel',
      phone: '+91 98765 12345',
      source: 'WEBSITE',
      status: 'QUALIFIED',
      assignedTo: 'Sales Team A',
      createdAt: '2024-01-27T09:00:00Z',
      lastContact: '2024-01-28T14:00:00Z',
      score: 85
    }
  ]);

  const stats = {
    totalCustomers: 15678,
    activeCustomers: 12345,
    newLeads: 456,
    conversionRate: 68.5,
    avgLifetimeValue: 125000,
    churnRate: 2.3,
    npsScore: 72,
    satisfactionRate: 4.6
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP': return 'bg-purple-500/20 text-purple-400';
      case 'HIGH_VALUE': return 'bg-emerald-500/20 text-emerald-400';
      case 'REGULAR': return 'bg-blue-500/20 text-blue-400';
      case 'NEW': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/20 text-blue-400';
      case 'CONTACTED': return 'bg-yellow-500/20 text-yellow-400';
      case 'QUALIFIED': return 'bg-purple-500/20 text-purple-400';
      case 'CONVERTED': return 'bg-emerald-500/20 text-emerald-400';
      case 'LOST': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Customer Relationship Management
          </h1>
          <p className="text-slate-400 mt-1">Lead management, Customer 360° view & lifetime value tracking</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg"
        >
          <UserPlus className="w-4 h-4" />
          Add Customer
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Customers', value: stats.totalCustomers.toLocaleString(), color: 'blue' },
          { icon: TrendingUp, label: 'Conversion Rate', value: `${stats.conversionRate}%`, color: 'emerald' },
          { icon: DollarSign, label: 'Avg LTV', value: `₹${(stats.avgLifetimeValue / 1000)}K`, color: 'purple' },
          { icon: Award, label: 'NPS Score', value: stats.npsScore, color: 'yellow' }
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
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Customer Database</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-800 rounded-lg">
              <Filter className="w-4 h-4 text-slate-400" />
            </button>
            <button className="p-2 bg-slate-800 rounded-lg">
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Segment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Loans</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Total Value</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">LTV</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">NPS</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {customers.map((customer, i) => (
              <tr key={customer.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getSegmentColor(customer.segment)}`}>
                    {customer.segment}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{customer.totalLoans}</td>
                <td className="px-6 py-4 text-sm text-slate-300">₹{(customer.totalValue / 100000).toFixed(1)}L</td>
                <td className="px-6 py-4 text-sm text-emerald-400 font-medium">₹{(customer.ltv / 1000)}K</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${customer.nps >= 8 ? 'text-emerald-400' : customer.nps >= 6 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {customer.nps}/10
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