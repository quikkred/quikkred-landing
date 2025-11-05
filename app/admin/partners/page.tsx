"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, DollarSign, TrendingUp, Award, Target, CheckCircle,
  Clock, Eye, Edit, Plus, Download, RefreshCw, Search, Filter,
  BarChart3, Percent, FileText, Mail, Phone, MapPin, Building,
  Calendar, Activity, AlertTriangle, Star, ChevronRight
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  type: 'DSA' | 'CONNECTOR' | 'DEALER' | 'BROKER';
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  stats: {
    totalLeads: number;
    convertedLoans: number;
    disbursedAmount: number;
    pendingCommission: number;
    paidCommission: number;
    conversionRate: number;
  };
  commission: {
    model: 'PERCENTAGE' | 'FLAT' | 'TIERED';
    rate: number;
    minAmount: number;
  };
}

export default function PartnerManagementPage() {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: 'DSA001',
      name: 'Quick Finance Solutions',
      type: 'DSA',
      email: 'contact@quickfinance.co.in',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      joinedDate: '2023-06-15',
      status: 'ACTIVE',
      stats: {
        totalLeads: 450,
        convertedLoans: 285,
        disbursedAmount: 142500000,
        pendingCommission: 1425000,
        paidCommission: 8550000,
        conversionRate: 63.3
      },
      commission: {
        model: 'PERCENTAGE',
        rate: 2.5,
        minAmount: 0
      }
    },
    {
      id: 'DSA002',
      name: 'Capital Connect India',
      type: 'CONNECTOR',
      email: 'info@capitalconnect.com',
      phone: '+91 87654 32109',
      location: 'Delhi NCR',
      joinedDate: '2023-08-20',
      status: 'ACTIVE',
      stats: {
        totalLeads: 320,
        convertedLoans: 195,
        disbursedAmount: 97500000,
        pendingCommission: 975000,
        paidCommission: 5850000,
        conversionRate: 60.9
      },
      commission: {
        model: 'TIERED',
        rate: 2.0,
        minAmount: 100000
      }
    },
    {
      id: 'DSA003',
      name: 'Prime Lending Partners',
      type: 'BROKER',
      email: 'support@primelending.co.in',
      phone: '+91 76543 21098',
      location: 'Bangalore, Karnataka',
      joinedDate: '2023-04-10',
      status: 'ACTIVE',
      stats: {
        totalLeads: 580,
        convertedLoans: 348,
        disbursedAmount: 174000000,
        pendingCommission: 1740000,
        paidCommission: 10440000,
        conversionRate: 60.0
      },
      commission: {
        model: 'PERCENTAGE',
        rate: 2.0,
        minAmount: 50000
      }
    },
    {
      id: 'DSA004',
      name: 'Urban Finance Network',
      type: 'DSA',
      email: 'hello@urbanfinance.in',
      phone: '+91 65432 10987',
      location: 'Pune, Maharashtra',
      joinedDate: '2023-09-05',
      status: 'INACTIVE',
      stats: {
        totalLeads: 125,
        convertedLoans: 68,
        disbursedAmount: 34000000,
        pendingCommission: 340000,
        paidCommission: 2040000,
        conversionRate: 54.4
      },
      commission: {
        model: 'FLAT',
        rate: 5000,
        minAmount: 0
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const stats = {
    totalPartners: 45,
    activePartners: 38,
    totalLeads: 5680,
    convertedLoans: 3420,
    avgConversionRate: 60.2,
    totalDisbursed: 1710000000,
    pendingCommission: 17100000,
    paidCommission: 102600000
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
      case 'DSA': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CONNECTOR': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'DEALER': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'BROKER': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400';
      case 'INACTIVE': return 'bg-slate-500/20 text-slate-400';
      case 'SUSPENDED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredPartners = partners.filter(p => {
    const matchesType = selectedType === 'ALL' || p.type === selectedType;
    const matchesSearch = searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Partner & DSA Management
          </h1>
          <p className="text-slate-400 mt-1">Manage partners, track performance & process commissions</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Export Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Partner
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
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Total Partners</p>
          <p className="text-2xl font-bold text-white">{stats.totalPartners}</p>
          <p className="text-sm text-emerald-400 mt-2">{stats.activePartners} active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Conversion Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.avgConversionRate}%</p>
          <p className="text-sm text-slate-400 mt-2">{stats.convertedLoans}/{stats.totalLeads} leads</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Total Disbursed</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalDisbursed)}</p>
          <p className="text-sm text-blue-400 mt-2">Via partners</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Pending Commission</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(stats.pendingCommission)}</p>
          <p className="text-sm text-slate-400 mt-2">To be processed</p>
        </motion.div>
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Commission Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div>
                <p className="text-sm text-slate-400">Total Paid (All Time)</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(stats.paidCommission)}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div>
                <p className="text-sm text-slate-400">Pending Payment</p>
                <p className="text-xl font-bold text-yellow-400">{formatCurrency(stats.pendingCommission)}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 gradient-primary text-white rounded-lg hover:shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Process Pending Payouts
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Top Performers (This Month)
          </h3>
          <div className="space-y-3">
            {partners.filter(p => p.status === 'ACTIVE').slice(0, 3).map((partner, index) => (
              <div key={partner.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{partner.name}</p>
                    <p className="text-xs text-slate-500">{partner.stats.convertedLoans} loans</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">{formatCurrency(partner.stats.disbursedAmount)}</p>
                  <p className="text-xs text-slate-400">{partner.stats.conversionRate}% conv.</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Types</option>
            <option value="DSA">DSA</option>
            <option value="CONNECTOR">Connector</option>
            <option value="DEALER">Dealer</option>
            <option value="BROKER">Broker</option>
          </select>

          <select className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
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

      {/* Partners Table */}
      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Partner Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Disbursed
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Commission
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
              {filteredPartners.map((partner, index) => (
                <motion.tr
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{partner.name}</p>
                        <p className="text-xs text-slate-500">{partner.id}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {partner.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(partner.type)}`}>
                      {partner.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-slate-300">{partner.stats.convertedLoans} loans</div>
                      <div className="text-xs text-slate-500">{partner.stats.totalLeads} leads</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        partner.stats.conversionRate >= 60 ? 'text-emerald-400' :
                        partner.stats.conversionRate >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {partner.stats.conversionRate}%
                      </span>
                      <div className="w-16 bg-slate-700 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${
                            partner.stats.conversionRate >= 60 ? 'bg-emerald-500' :
                            partner.stats.conversionRate >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${partner.stats.conversionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-blue-400">
                      {formatCurrency(partner.stats.disbursedAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-yellow-400 font-semibold">
                        {formatCurrency(partner.stats.pendingCommission)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {partner.commission.rate}{partner.commission.model === 'PERCENTAGE' ? '%' : ' flat'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(partner.status)}`}>
                      {partner.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedPartner(partner)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                    </div>
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