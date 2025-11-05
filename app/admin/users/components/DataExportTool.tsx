"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download, FileSpreadsheet, FileText, Database,
  Filter, Calendar, CheckCircle, Users, FileJson,
  Search, Clock, TrendingUp, DollarSign
} from "lucide-react";

interface ExportConfig {
  dataType: string;
  format: string;
  dateRange: string;
  filters: {
    status?: string;
    userType?: string;
    includeDeleted?: boolean;
  };
  columns: string[];
}

const DATA_TYPES = [
  { id: 'users', label: 'Users', description: 'All user accounts and profiles', icon: Users },
  { id: 'loans', label: 'Loans', description: 'Loan applications and details', icon: DollarSign },
  { id: 'transactions', label: 'Transactions', description: 'Payment and EMI records', icon: TrendingUp },
  { id: 'documents', label: 'Documents', description: 'Uploaded documents metadata', icon: FileText },
  { id: 'activity_logs', label: 'Activity Logs', description: 'User activity and system logs', icon: Clock }
];

const EXPORT_FORMATS = [
  { id: 'excel', label: 'Excel (XLSX)', icon: '📊', description: 'Best for data analysis' },
  { id: 'csv', label: 'CSV', icon: '📑', description: 'Universal format' },
  { id: 'json', label: 'JSON', icon: '{ }', description: 'For developers' },
  { id: 'pdf', label: 'PDF', icon: '📄', description: 'For reports' }
];

const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' }
];

export default function DataExportTool() {
  const [config, setConfig] = useState<ExportConfig>({
    dataType: 'users',
    format: 'excel',
    dateRange: 'last_30_days',
    filters: {},
    columns: []
  });
  const [exporting, setExporting] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExporting(false);
    alert('Export completed! Download will start automatically.');
  };

  const updateConfig = (key: keyof ExportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Data Export Tool</h2>
        <p className="text-slate-400 mt-1">Export data in various formats for analysis and reporting</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Download className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Exports This Month</p>
              <p className="text-lg font-bold text-slate-100">847</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Database className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Records</p>
              <p className="text-lg font-bold text-slate-100">124.5K</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Data Size</p>
              <p className="text-lg font-bold text-slate-100">2.4 GB</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Export</p>
              <p className="text-sm font-medium text-slate-100">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Type Selection */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-400" />
          Select Data Type
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DATA_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => updateConfig('dataType', type.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  config.dataType === type.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-5 w-5 ${config.dataType === type.id ? 'text-blue-400' : 'text-slate-400'}`} />
                </div>
                <p className="text-sm font-medium text-slate-100 mb-1">{type.label}</p>
                <p className="text-xs text-slate-400">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Format */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-400" />
          Export Format
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.id}
              onClick={() => updateConfig('format', format.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                config.format === format.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="text-3xl mb-2">{format.icon}</div>
              <p className="text-sm font-medium text-slate-100 mb-1">{format.label}</p>
              <p className="text-xs text-slate-400">{format.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-purple-400" />
          Filters & Options
        </h3>

        <div className="space-y-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    updateConfig('dateRange', range.value);
                    setShowCustomDate(range.value === 'custom');
                  }}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    config.dateRange === range.value
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {showCustomDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-2">Status Filter</label>
              <select className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-2">User Type</label>
              <select className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100">
                <option value="">All Types</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-2">Limit Records</label>
              <input
                type="number"
                placeholder="No limit"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
              />
            </div>
          </div>

          {/* Options Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Export Options
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Include column headers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Include deleted records</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Apply formatting</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Compress as ZIP</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Email when ready</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Schedule export</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-400">
          Estimated records: <span className="text-slate-100 font-medium">~4,856</span> •
          Size: <span className="text-slate-100 font-medium">~12.4 MB</span>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Export Data
            </>
          )}
        </button>
      </div>

      {/* Recent Exports */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-400" />
          Recent Exports
        </h3>

        <div className="space-y-3">
          {[
            { name: 'Users Export - December 2024', format: 'XLSX', size: '8.4 MB', records: '4,856', date: '2 hours ago', status: 'completed' },
            { name: 'Loan Applications - Last 30 Days', format: 'CSV', size: '12.1 MB', records: '8,234', date: '5 hours ago', status: 'completed' },
            { name: 'Transaction History - November', format: 'JSON', size: '24.8 MB', records: '15,678', date: '1 day ago', status: 'completed' },
            { name: 'Activity Logs - Q4 2024', format: 'XLSX', size: '45.2 MB', records: '34,567', date: '2 days ago', status: 'completed' },
            { name: 'Documents Metadata - All Time', format: 'CSV', size: '6.7 MB', records: '12,345', date: '3 days ago', status: 'completed' }
          ].map((exportItem, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{exportItem.name}</p>
                  <p className="text-xs text-slate-400">
                    {exportItem.format} • {exportItem.size} • {exportItem.records} records • {exportItem.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Ready
                </span>
                <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Export Templates */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          Quick Export Templates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'All Users', icon: Users, color: 'blue' },
            { name: 'Active Loans', icon: DollarSign, color: 'green' },
            { name: 'Recent Transactions', icon: TrendingUp, color: 'purple' },
            { name: 'Pending Documents', icon: FileText, color: 'yellow' }
          ].map((template, index) => {
            const Icon = template.icon;
            return (
              <button
                key={index}
                className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition-all text-left group"
              >
                <div className={`p-3 rounded-lg bg-${template.color}-500/10 w-fit mb-3`}>
                  <Icon className={`h-5 w-5 text-${template.color}-400`} />
                </div>
                <p className="text-sm font-medium text-slate-100 mb-1">{template.name}</p>
                <p className="text-xs text-slate-400">Click to export</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
