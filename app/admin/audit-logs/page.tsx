"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, FileCheck, AlertTriangle, Eye, Download, Filter,
  Search, Clock, User, Activity, Database, CheckCircle,
  XCircle, Info, Calendar, TrendingUp, BarChart3, Lock,
  Unlock, FileText, Settings, RefreshCw, Archive, Bell
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface AuditType {
  id: string;
  name: string;
  type: 'INTERNAL' | 'CONCURRENT' | 'STATUTORY' | 'SYSTEM';
  auditor: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  findings: number;
  criticalFindings: number;
  resolvedFindings: number;
  scope: string[];
  reportUrl?: string;
}

export default function AuditManagementPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'AL001',
      timestamp: '2024-01-28T14:30:00Z',
      user: 'admin@Quikkred.com',
      action: 'LOAN_APPROVED',
      resource: 'Loan Application',
      resourceId: 'LN12345',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0',
      status: 'SUCCESS',
      severity: 'MEDIUM',
      details: 'Loan application approved for ₹50,000',
      changes: [
        { field: 'status', oldValue: 'PENDING', newValue: 'APPROVED' },
        { field: 'approvedAmount', oldValue: '0', newValue: '50000' }
      ]
    },
    {
      id: 'AL002',
      timestamp: '2024-01-28T14:25:00Z',
      user: 'underwriter@Quikkred.com',
      action: 'KYC_VERIFIED',
      resource: 'Customer KYC',
      resourceId: 'CU001',
      ipAddress: '192.168.1.15',
      userAgent: 'Mozilla/5.0',
      status: 'SUCCESS',
      severity: 'HIGH',
      details: 'KYC documents verified and approved',
      changes: [
        { field: 'kycStatus', oldValue: 'PENDING', newValue: 'VERIFIED' }
      ]
    },
    {
      id: 'AL003',
      timestamp: '2024-01-28T14:20:00Z',
      user: 'system@Quikkred.com',
      action: 'DISBURSEMENT_FAILED',
      resource: 'Disbursement',
      resourceId: 'DSB001',
      ipAddress: '10.0.0.5',
      userAgent: 'System',
      status: 'FAILED',
      severity: 'CRITICAL',
      details: 'Payment gateway timeout - UTR not received'
    },
    {
      id: 'AL004',
      timestamp: '2024-01-28T14:15:00Z',
      user: 'collector@Quikkred.com',
      action: 'PAYMENT_RECEIVED',
      resource: 'EMI Payment',
      resourceId: 'EMI12345',
      ipAddress: '192.168.1.20',
      userAgent: 'Mobile App',
      status: 'SUCCESS',
      severity: 'LOW',
      details: 'EMI payment of ₹5,000 received via UPI'
    }
  ]);

  const [audits, setAudits] = useState<AuditType[]>([
    {
      id: 'AUD001',
      name: 'Q3 Internal Audit 2024',
      type: 'INTERNAL',
      auditor: 'Internal Audit Team',
      scheduledDate: '2024-02-15T00:00:00Z',
      completedDate: '2024-02-20T00:00:00Z',
      status: 'COMPLETED',
      findings: 12,
      criticalFindings: 2,
      resolvedFindings: 10,
      scope: ['Loan Origination', 'KYC Process', 'Disbursement', 'Collections'],
      reportUrl: '/reports/audit-q3-2024.pdf'
    },
    {
      id: 'AUD002',
      name: 'Concurrent Audit - January 2024',
      type: 'CONCURRENT',
      auditor: 'M/s ABC & Co.',
      scheduledDate: '2024-01-01T00:00:00Z',
      status: 'IN_PROGRESS',
      findings: 5,
      criticalFindings: 1,
      resolvedFindings: 3,
      scope: ['Credit Appraisal', 'Documentation', 'Security']
    },
    {
      id: 'AUD003',
      name: 'Statutory Audit FY 2023-24',
      type: 'STATUTORY',
      auditor: 'M/s XYZ Chartered Accountants',
      scheduledDate: '2024-03-01T00:00:00Z',
      status: 'SCHEDULED',
      findings: 0,
      criticalFindings: 0,
      resolvedFindings: 0,
      scope: ['Financial Statements', 'Regulatory Compliance', 'Internal Controls']
    },
    {
      id: 'AUD004',
      name: 'System Audit - IT Security',
      type: 'SYSTEM',
      auditor: 'Cybersecurity Team',
      scheduledDate: '2024-01-20T00:00:00Z',
      status: 'IN_PROGRESS',
      findings: 8,
      criticalFindings: 0,
      resolvedFindings: 5,
      scope: ['Data Encryption', 'Access Controls', 'Vulnerability Assessment']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'logs' | 'audits'>('logs');

  const stats = {
    totalLogs: 45678,
    criticalEvents: 12,
    failedActions: 45,
    successRate: 98.7,
    activeAudits: 2,
    completedAudits: 8,
    pendingFindings: 6,
    complianceScore: 96.2
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-500/20 text-emerald-400';
      case 'FAILED': return 'bg-red-500/20 text-red-400';
      case 'WARNING': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-blue-500/20 text-blue-400';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400';
      case 'CRITICAL': return 'bg-red-600/30 text-red-300';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400';
      case 'SCHEDULED': return 'bg-purple-500/20 text-purple-400';
      case 'DELAYED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INTERNAL': return 'bg-blue-500/20 text-blue-400';
      case 'CONCURRENT': return 'bg-purple-500/20 text-purple-400';
      case 'STATUTORY': return 'bg-emerald-500/20 text-emerald-400';
      case 'SYSTEM': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'ALL' || log.status === selectedStatus;
    const matchesSearch = searchTerm === '' ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            Audit Management System
          </h1>
          <p className="text-slate-400 mt-1">Internal/Concurrent/Statutory audit tracking & system logs</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Export Logs
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <FileCheck className="w-4 h-4" />
            Schedule Audit
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
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm text-slate-400">Total Audit Logs</p>
          <p className="text-2xl font-bold text-white">{stats.totalLogs.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm text-slate-400">Critical Events</p>
          <p className="text-2xl font-bold text-red-400">{stats.criticalEvents}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-400">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.successRate}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FileCheck className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-slate-400">Active Audits</p>
          <p className="text-2xl font-bold text-purple-400">{stats.activeAudits}</p>
        </motion.div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('logs')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            viewMode === 'logs' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Audit Logs
        </button>
        <button
          onClick={() => setViewMode('audits')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            viewMode === 'audits' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Scheduled Audits
        </button>
      </div>

      {viewMode === 'logs' ? (
        <>
          {/* Filters */}
          <div className="glass rounded-2xl p-6 border border-slate-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Severity</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="WARNING">Warning</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Resource</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Severity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-300">{log.user.split('@')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-200 font-medium">
                      {log.action.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-slate-300">{log.resource}</p>
                        <p className="text-xs text-slate-500">{log.resourceId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Audits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audits.map((audit, index) => (
              <motion.div
                key={audit.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-1">{audit.name}</h3>
                    <p className="text-sm text-slate-400">{audit.auditor}</p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getTypeColor(audit.type)}`}>
                    {audit.type}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Status:</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getAuditStatusColor(audit.status)}`}>
                      {audit.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Scheduled:</span>
                    <span className="text-sm text-slate-300">
                      {new Date(audit.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>

                  {audit.completedDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Completed:</span>
                      <span className="text-sm text-emerald-400">
                        {new Date(audit.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">{audit.findings}</p>
                        <p className="text-xs text-slate-400">Findings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-400">{audit.criticalFindings}</p>
                        <p className="text-xs text-slate-400">Critical</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-400">{audit.resolvedFindings}</p>
                        <p className="text-xs text-slate-400">Resolved</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Audit Scope:</p>
                  <div className="flex flex-wrap gap-2">
                    {audit.scope.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                    View Details
                  </button>
                  {audit.reportUrl && (
                    <button className="flex-1 p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm">
                      <Download className="w-4 h-4 mx-auto" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}