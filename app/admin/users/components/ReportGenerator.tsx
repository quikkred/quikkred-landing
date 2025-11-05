"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Download, Calendar, FileText, Filter,
  TrendingUp, Users, DollarSign, CheckCircle, Clock
} from "lucide-react";

interface ReportConfig {
  type: string;
  dateRange: string;
  format: string;
  includeCharts: boolean;
  filters: {
    status?: string;
    loanType?: string;
    minAmount?: number;
    maxAmount?: number;
  };
}

const REPORT_TYPES = [
  { value: 'loan_summary', label: 'Loan Summary Report', description: 'Overview of all loans' },
  { value: 'user_activity', label: 'User Activity Report', description: 'User engagement metrics' },
  { value: 'revenue', label: 'Revenue Report', description: 'Financial performance' },
  { value: 'kyc_compliance', label: 'KYC Compliance Report', description: 'Verification status' },
  { value: 'disbursement', label: 'Disbursement Report', description: 'Loan disbursements' },
  { value: 'collection', label: 'Collection Report', description: 'EMI collections' },
  { value: 'npa', label: 'NPA Report', description: 'Non-performing assets' },
  { value: 'custom', label: 'Custom Report', description: 'Build your own report' }
];

const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
];

const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'excel', label: 'Excel (XLSX)', icon: '📊' },
  { value: 'csv', label: 'CSV', icon: '📑' },
  { value: 'json', label: 'JSON', icon: '📋' }
];

export default function ReportGenerator() {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'loan_summary',
    dateRange: 'last_30_days',
    format: 'pdf',
    includeCharts: true,
    filters: {}
  });
  const [generating, setGenerating] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerating(false);
    // In real implementation, this would trigger a download
    alert('Report generated successfully!');
  };

  const updateConfig = (key: keyof ReportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Report Generator</h2>
        <p className="text-slate-400 mt-1">Create and export custom reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Reports Generated</p>
              <p className="text-lg font-bold text-slate-100">1,234</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Download className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Downloads This Month</p>
              <p className="text-lg font-bold text-slate-100">456</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Scheduled Reports</p>
              <p className="text-lg font-bold text-slate-100">12</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Generated</p>
              <p className="text-sm font-medium text-slate-100">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-400" />
          Report Configuration
        </h3>

        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Report Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => updateConfig('type', type.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    config.type === type.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-100 mb-1">{type.label}</p>
                  <p className="text-xs text-slate-400">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    updateConfig('dateRange', range.value);
                    setShowCustomDate(range.value === 'custom');
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
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

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => updateConfig('format', format.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    config.format === format.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{format.icon}</div>
                  <p className="text-sm font-medium text-slate-100">{format.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeCharts}
                  onChange={(e) => updateConfig('includeCharts', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Include charts and visualizations</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Include detailed breakdowns</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Aggregate data by category</span>
              </label>
            </div>
          </div>

          {/* Advanced Filters */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Advanced Filters (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Status</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100">
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Loan Type</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100">
                  <option value="">All Types</option>
                  <option value="personal">Personal Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="home">Home Loan</option>
                  <option value="education">Education Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Min Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Max Amount (₹)</label>
                <input
                  type="number"
                  placeholder="10,00,000"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-400">
          Report will be generated based on current filters and downloaded automatically
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* Recent Reports */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-400" />
          Recent Reports
        </h3>

        <div className="space-y-3">
          {[
            { name: 'Loan Summary Report - November 2024', format: 'PDF', size: '2.4 MB', date: '2 hours ago' },
            { name: 'User Activity Report - Last 30 Days', format: 'Excel', size: '1.8 MB', date: '5 hours ago' },
            { name: 'Revenue Report - Q4 2024', format: 'PDF', size: '3.2 MB', date: '1 day ago' },
            { name: 'KYC Compliance Report', format: 'CSV', size: '890 KB', date: '2 days ago' },
            { name: 'Disbursement Report - November', format: 'Excel', size: '1.5 MB', date: '3 days ago' }
          ].map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{report.name}</p>
                  <p className="text-xs text-slate-400">{report.format} • {report.size} • {report.date}</p>
                </div>
              </div>
              <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
