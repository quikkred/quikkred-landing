"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload, Users, Mail, Bell, Lock, Unlock,
  CheckCircle, XCircle, AlertCircle, FileSpreadsheet,
  Download, Trash2, Edit, Shield
} from "lucide-react";

interface BulkOperation {
  id: string;
  type: string;
  description: string;
  icon: any;
  color: string;
}

const BULK_OPERATIONS: BulkOperation[] = [
  {
    id: 'import_users',
    type: 'Import Users',
    description: 'Upload CSV/Excel to create multiple users',
    icon: Upload,
    color: 'blue'
  },
  {
    id: 'update_status',
    type: 'Update Status',
    description: 'Change status for multiple users',
    icon: Edit,
    color: 'green'
  },
  {
    id: 'send_notifications',
    type: 'Send Notifications',
    description: 'Notify multiple users at once',
    icon: Bell,
    color: 'purple'
  },
  {
    id: 'send_emails',
    type: 'Send Emails',
    description: 'Bulk email to selected users',
    icon: Mail,
    color: 'yellow'
  },
  {
    id: 'activate_accounts',
    type: 'Activate Accounts',
    description: 'Enable multiple user accounts',
    icon: Unlock,
    color: 'green'
  },
  {
    id: 'deactivate_accounts',
    type: 'Deactivate Accounts',
    description: 'Disable multiple user accounts',
    icon: Lock,
    color: 'orange'
  },
  {
    id: 'delete_users',
    type: 'Delete Users',
    description: 'Remove multiple users permanently',
    icon: Trash2,
    color: 'red'
  },
  {
    id: 'export_data',
    type: 'Export Data',
    description: 'Download user data in bulk',
    icon: Download,
    color: 'cyan'
  }
];

export default function BulkOperations() {
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; total: number } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult({ success: 45, failed: 3, total: 48 });
    setProcessing(false);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hover: 'hover:border-blue-500/40' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', hover: 'hover:border-green-500/40' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', hover: 'hover:border-purple-500/40' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', hover: 'hover:border-yellow-500/40' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', hover: 'hover:border-orange-500/40' },
      red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', hover: 'hover:border-red-500/40' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', hover: 'hover:border-cyan-500/40' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Bulk Operations</h2>
        <p className="text-slate-400 mt-1">Perform actions on multiple users simultaneously</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Successful Operations</p>
              <p className="text-lg font-bold text-slate-100">1,247</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Failed Operations</p>
              <p className="text-lg font-bold text-slate-100">23</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Records Processed</p>
              <p className="text-lg font-bold text-slate-100">4,856</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operation Selection */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          Select Operation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BULK_OPERATIONS.map((operation) => {
            const Icon = operation.icon;
            const colors = getColorClasses(operation.color);

            return (
              <button
                key={operation.id}
                onClick={() => setSelectedOperation(operation.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${colors.border} ${colors.hover} ${
                  selectedOperation === operation.id
                    ? `${colors.bg} border-opacity-100`
                    : 'bg-slate-800/50 border-opacity-50'
                }`}
              >
                <div className={`p-3 rounded-lg ${colors.bg} w-fit mb-3`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <p className="text-sm font-medium text-slate-100 mb-1">{operation.type}</p>
                <p className="text-xs text-slate-400">{operation.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operation Form */}
      {selectedOperation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            {BULK_OPERATIONS.find(op => op.id === selectedOperation)?.type}
          </h3>

          <div className="space-y-4">
            {/* File Upload Section */}
            {selectedOperation === 'import_users' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Upload CSV/Excel File
                </label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500 mb-4">
                    Supports CSV, XLSX files (Max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Choose File
                  </label>
                  {file && (
                    <p className="text-sm text-green-400 mt-3">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download Template
                  </button>
                </div>
              </div>
            )}

            {/* User Selection */}
            {selectedOperation !== 'import_users' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Users
                </label>
                <textarea
                  placeholder="Enter user IDs or emails (one per line)"
                  rows={5}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Or upload a CSV file with user identifiers
                </p>
              </div>
            )}

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-300">Send notification to affected users</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-300">Skip validation errors</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-300">Generate operation log</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleProcess}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Execute Operation
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedOperation(null)}
                className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Operation Completed</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-slate-100">{result.total}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Successful</p>
                  <p className="text-2xl font-bold text-green-400">{result.success}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Failed</p>
                  <p className="text-2xl font-bold text-red-400">{result.failed}</p>
                </div>
              </div>
              <button className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download detailed report
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Operations Log */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          Recent Operations
        </h3>

        <div className="space-y-3">
          {[
            { operation: 'Import Users', records: 120, status: 'success', time: '10 minutes ago', user: 'Admin' },
            { operation: 'Send Notifications', records: 350, status: 'success', time: '1 hour ago', user: 'Admin' },
            { operation: 'Update Status', records: 45, status: 'partial', time: '3 hours ago', user: 'Super Admin' },
            { operation: 'Deactivate Accounts', records: 12, status: 'success', time: '5 hours ago', user: 'Admin' },
            { operation: 'Export Data', records: 890, status: 'success', time: '1 day ago', user: 'Super Admin' }
          ].map((log, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-green-400' :
                  log.status === 'partial' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-100">{log.operation}</p>
                  <p className="text-xs text-slate-400">
                    {log.records} records • {log.user} • {log.time}
                  </p>
                </div>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
