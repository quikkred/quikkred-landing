"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, MapPin, Users, TrendingUp, DollarSign, Target,
  Activity, BarChart3, CheckCircle, AlertCircle, Search, Eye,
  Phone, Mail, Calendar, Award, Briefcase, FileText
} from "lucide-react";

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  manager: string;
  employees: number;
  activeLoans: number;
  disbursedAmount: number;
  collectionRate: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function BranchManagementPage() {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 'BR001',
      name: 'Mumbai - Andheri Branch',
      code: 'MUM-AND-001',
      address: 'Plot 123, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      manager: 'Rajesh Kumar',
      employees: 25,
      activeLoans: 456,
      disbursedAmount: 45600000,
      collectionRate: 96.5,
      status: 'ACTIVE'
    }
  ]);

  const stats = {
    totalBranches: 45,
    activeBranches: 43,
    totalEmployees: 1245,
    avgLoansPerBranch: 412,
    totalDisbursed: 2345000000,
    avgCollectionRate: 95.2
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-400" />
            Branch Management System
          </h1>
          <p className="text-slate-400 mt-1">Branch operations, regional performance & staff management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Building2, label: 'Total Branches', value: stats.totalBranches, color: 'blue' },
          { icon: Users, label: 'Total Staff', value: stats.totalEmployees.toLocaleString(), color: 'emerald' },
          { icon: TrendingUp, label: 'Avg Collection', value: `${stats.avgCollectionRate}%`, color: 'purple' }
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
          <h3 className="text-lg font-semibold text-white">Branch Network</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Branch</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Manager</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Staff</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Active Loans</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Disbursed</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Collection %</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{branch.name}</p>
                    <p className="text-xs text-slate-500">{branch.code} " {branch.city}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{branch.manager}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{branch.employees}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{branch.activeLoans}</td>
                <td className="px-6 py-4 text-sm text-slate-300">₹{(branch.disbursedAmount / 10000000).toFixed(1)}Cr</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${branch.collectionRate >= 95 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {branch.collectionRate}%
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