"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, Eye, Clock, AlertTriangle,
  Filter, Search, RefreshCw, User, DollarSign,
  Calendar, FileText, TrendingUp, ChevronDown, ChevronUp
} from "lucide-react";

interface LoanApplication {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  phone: string;
  loanAmount: number;
  loanType: string;
  tenure: number;
  purpose: string;
  monthlyIncome: number;
  creditScore: number;
  employmentType: string;
  submittedAt: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'UNDER_REVIEW' | 'DOCS_REQUIRED';
  assignedTo: string | null;
  documentsUploaded: number;
  documentsRequired: number;
}

const mockApplications: LoanApplication[] = [
  {
    id: "APP001",
    applicationId: "LA2024001",
    applicantName: "Rahul Verma",
    applicantEmail: "rahul.verma@example.com",
    phone: "+91 9876543210",
    loanAmount: 500000,
    loanType: "Personal Loan",
    tenure: 36,
    purpose: "Home Renovation",
    monthlyIncome: 75000,
    creditScore: 780,
    employmentType: "SALARIED",
    submittedAt: "2024-12-01T10:30:00Z",
    priority: "HIGH",
    riskLevel: "LOW",
    status: "PENDING",
    assignedTo: null,
    documentsUploaded: 5,
    documentsRequired: 5
  },
  {
    id: "APP002",
    applicationId: "LA2024002",
    applicantName: "Anjali Mehta",
    applicantEmail: "anjali.mehta@example.com",
    phone: "+91 9876543211",
    loanAmount: 1000000,
    loanType: "Business Loan",
    tenure: 60,
    purpose: "Business Expansion",
    monthlyIncome: 120000,
    creditScore: 720,
    employmentType: "SELF_EMPLOYED",
    submittedAt: "2024-12-01T11:15:00Z",
    priority: "HIGH",
    riskLevel: "MEDIUM",
    status: "UNDER_REVIEW",
    assignedTo: "admin@Quikkred.com",
    documentsUploaded: 4,
    documentsRequired: 6
  },
  {
    id: "APP003",
    applicationId: "LA2024003",
    applicantName: "Suresh Reddy",
    applicantEmail: "suresh.reddy@example.com",
    phone: "+91 9876543212",
    loanAmount: 250000,
    loanType: "Personal Loan",
    tenure: 24,
    purpose: "Medical Emergency",
    monthlyIncome: 45000,
    creditScore: 650,
    employmentType: "SALARIED",
    submittedAt: "2024-12-01T12:00:00Z",
    priority: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "DOCS_REQUIRED",
    assignedTo: "admin@Quikkred.com",
    documentsUploaded: 3,
    documentsRequired: 5
  }
];

export default function LoanApprovalQueue() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApplications(mockApplications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(app => app.priority === priorityFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleApprove = (appId: string) => {
    setApplications(applications.filter(app => app.id !== appId));
    setShowDetails(false);
  };

  const handleReject = (appId: string) => {
    setApplications(applications.filter(app => app.id !== appId));
    setShowDetails(false);
  };

  const handleRequestDocs = (appId: string) => {
    setApplications(applications.map(app =>
      app.id === appId ? { ...app, status: 'DOCS_REQUIRED' as const } : app
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/10';
      case 'UNDER_REVIEW': return 'text-blue-400 bg-blue-500/10';
      case 'DOCS_REQUIRED': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
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
          <p className="mt-4 text-slate-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Loan Approval Queue</h2>
          <p className="text-slate-400 mt-1">{filteredApplications.length} pending applications</p>
        </div>
        <button
          onClick={fetchApplications}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="DOCS_REQUIRED">Docs Required</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
          >
            <option value="ALL">All Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-slate-100">{application.applicantName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(application.priority)}`}>
                    {application.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {application.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Application ID</p>
                    <p className="text-sm font-medium text-slate-300">{application.applicationId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Loan Amount</p>
                    <p className="text-sm font-medium text-blue-400">{formatCurrency(application.loanAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Credit Score</p>
                    <p className={`text-sm font-medium ${application.creditScore >= 750 ? 'text-green-400' : application.creditScore >= 650 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {application.creditScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                    <p className={`text-sm font-medium ${getRiskColor(application.riskLevel)}`}>
                      {application.riskLevel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {application.documentsUploaded}/{application.documentsRequired} docs
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {application.tenure} months
                  </span>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setSelectedApplication(application);
                    setShowDetails(true);
                  }}
                  className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleApprove(application.id)}
                  className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                  title="Approve"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleReject(application.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Reject"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="glass rounded-2xl p-12 border border-slate-700 text-center">
            <CheckCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No applications found</h3>
            <p className="text-slate-500">All applications have been processed or try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {showDetails && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{selectedApplication.applicantName}</h2>
                    <p className="text-slate-400">{selectedApplication.applicationId}</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-slate-400 hover:text-slate-300"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Loan Type</label>
                    <p className="text-slate-100">{selectedApplication.loanType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Purpose</label>
                    <p className="text-slate-100">{selectedApplication.purpose}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Monthly Income</label>
                    <p className="text-slate-100">{formatCurrency(selectedApplication.monthlyIncome)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Employment Type</label>
                    <p className="text-slate-100">{selectedApplication.employmentType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Email</label>
                    <p className="text-slate-100">{selectedApplication.applicantEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Phone</label>
                    <p className="text-slate-100">{selectedApplication.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => handleApprove(selectedApplication.id)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleRequestDocs(selectedApplication.id)}
                    className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Request Documents
                  </button>
                  <button
                    onClick={() => handleReject(selectedApplication.id)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
