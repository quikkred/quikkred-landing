"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Users, DollarSign, TrendingUp, CheckCircle, AlertCircle,
  Clock, Award, Target, Activity, Search, Filter, Eye, Edit, Phone,
  Mail, FileText, Calendar, Star, BarChart3, Download
} from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  category: 'IT_SERVICES' | 'TELECOM' | 'CREDIT_BUREAU' | 'COLLECTION_AGENCY' | 'LEGAL' | 'CONSULTING';
  contactPerson: string;
  email: string;
  phone: string;
  contractValue: number;
  contractStart: string;
  contractEnd: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED';
  performance: number;
  invoicesPaid: number;
  invoicesPending: number;
}

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 'VND001',
      name: 'TechSoft Solutions',
      category: 'IT_SERVICES',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh@techsoft.com',
      phone: '+91 98765 43210',
      contractValue: 5000000,
      contractStart: '2023-04-01',
      contractEnd: '2024-03-31',
      status: 'ACTIVE',
      performance: 4.5,
      invoicesPaid: 12,
      invoicesPending: 2
    }
  ]);

  const stats = {
    totalVendors: 45,
    activeVendors: 38,
    totalSpend: 125000000,
    pendingPayments: 8500000,
    avgPerformance: 4.3,
    contractsExpiring: 5
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IT_SERVICES': return 'bg-blue-500/20 text-blue-400';
      case 'TELECOM': return 'bg-purple-500/20 text-purple-400';
      case 'CREDIT_BUREAU': return 'bg-emerald-500/20 text-emerald-400';
      case 'COLLECTION_AGENCY': return 'bg-orange-500/20 text-orange-400';
      case 'LEGAL': return 'bg-red-500/20 text-red-400';
      case 'CONSULTING': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400';
      case 'INACTIVE': return 'bg-slate-500/20 text-slate-400';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'EXPIRED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-400" />
            Vendor Management System
          </h1>
          <p className="text-slate-400 mt-1">Vendor onboarding, contract management & performance tracking</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg"
        >
          <Users className="w-4 h-4" />
          Add Vendor
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Users, label: 'Total Vendors', value: stats.totalVendors, color: 'blue' },
          { icon: DollarSign, label: 'Total Spend', value: `₹${(stats.totalSpend / 10000000).toFixed(1)}Cr`, color: 'emerald' },
          { icon: Award, label: 'Avg Performance', value: `${stats.avgPerformance}/5`, color: 'purple' }
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
          <h3 className="text-lg font-semibold text-white">Vendor Directory</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Vendor</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Contract Value</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Contract Period</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Performance</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{vendor.name}</p>
                    <p className="text-xs text-slate-500">{vendor.contactPerson} " {vendor.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getCategoryColor(vendor.category)}`}>
                    {vendor.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">₹{(vendor.contractValue / 100000).toFixed(1)}L</td>
                <td className="px-6 py-4">
                  <div className="text-xs">
                    <div className="text-slate-300">{new Date(vendor.contractStart).toLocaleDateString()}</div>
                    <div className="text-slate-500">to {new Date(vendor.contractEnd).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(vendor.status)}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-white">{vendor.performance}</span>
                  </div>
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