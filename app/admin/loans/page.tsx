"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Download, Eye, Check, X, Clock,
  AlertTriangle, DollarSign, User, Calendar, FileText,
  ChevronDown, ChevronUp, MoreHorizontal, RefreshCw,
  CheckCircle, XCircle, Upload, Phone, Mail,
  TrendingUp, TrendingDown, CreditCard, Building,
  MapPin, Star, Flag, Shield, Zap, Package, Activity
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface LoanApplication {
  id: string;
  applicationNumber: string;
  customerName: string;
  customerId: string;
  email: string;
  phone: string;
  loanType: string;
  requestedAmount: number;
  approvedAmount?: number;
  tenure: number;
  interestRate: number;
  purpose: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'DOCUMENTS_PENDING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  applicationDate: string;
  lastUpdated: string;
  assignedTo?: string;
  documents: Array<{
    type: string;
    status: 'VERIFIED' | 'PENDING' | 'REJECTED';
    uploadedDate: string;
  }>;
  creditScore: number;
  monthlyIncome: number;
  employment: {
    type: string;
    company: string;
    designation: string;
    experience: number;
  };
  riskAssessment: {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    factors: string[];
  };
  verificationDetails: {
    identity: boolean;
    address: boolean;
    income: boolean;
    employment: boolean;
    banking: boolean;
  };
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    type: 'INTERNAL' | 'CUSTOMER_FACING';
  }>;
}

const LOAN_STATUSES = [
  'ALL',
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'DISBURSED',
  'DOCUMENTS_PENDING'
];

const LOAN_TYPES = [
  'ALL',
  'Personal Loan',
  'Salary Advance',
  'Emergency Fund',
  'Festival Advance',
  'Medical Emergency',
  'Travel Loan'
];

const PRIORITY_LEVELS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function AdminLoanManagement() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bulkSelection, setBulkSelection] = useState<string[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for development
  const mockLoans: LoanApplication[] = [
    {
      id: "APP001",
      applicationNumber: "LXO2024001234",
      customerName: "Rajesh Kumar Singh",
      customerId: "CU789123",
      email: "rajesh.kumar@example.com",
      phone: "+91 9876543210",
      loanType: "Personal Loan",
      requestedAmount: 500000,
      approvedAmount: 450000,
      tenure: 36,
      interestRate: 12.5,
      purpose: "Home renovation",
      status: "UNDER_REVIEW",
      priority: "HIGH",
      applicationDate: "2024-11-28T10:30:00Z",
      lastUpdated: "2024-11-30T14:20:00Z",
      assignedTo: "admin@Quikkred.com",
      documents: [
        { type: "Aadhaar", status: "VERIFIED", uploadedDate: "2024-11-28" },
        { type: "PAN", status: "VERIFIED", uploadedDate: "2024-11-28" },
        { type: "Salary Slip", status: "PENDING", uploadedDate: "2024-11-29" },
        { type: "Bank Statement", status: "VERIFIED", uploadedDate: "2024-11-28" }
      ],
      creditScore: 750,
      monthlyIncome: 85000,
      employment: {
        type: "Salaried",
        company: "TCS Limited",
        designation: "Senior Software Engineer",
        experience: 8
      },
      riskAssessment: {
        score: 78,
        level: "LOW",
        factors: ["Stable employment", "Good credit history", "Adequate income"]
      },
      verificationDetails: {
        identity: true,
        address: true,
        income: false,
        employment: true,
        banking: true
      },
      comments: [
        {
          id: "C001",
          author: "admin@Quikkred.com",
          message: "Salary slip verification pending. Customer contacted for latest slip.",
          timestamp: "2024-11-30T14:20:00Z",
          type: "INTERNAL"
        }
      ]
    },
    {
      id: "APP002",
      applicationNumber: "LXO2024001235",
      customerName: "Priya Sharma",
      customerId: "CU789124",
      email: "priya.sharma@example.com",
      phone: "+91 9876543211",
      loanType: "Emergency Fund",
      requestedAmount: 100000,
      tenure: 12,
      interestRate: 14.0,
      purpose: "Medical emergency",
      status: "PENDING",
      priority: "URGENT",
      applicationDate: "2024-11-30T09:15:00Z",
      lastUpdated: "2024-11-30T09:15:00Z",
      documents: [
        { type: "Aadhaar", status: "VERIFIED", uploadedDate: "2024-11-30" },
        { type: "PAN", status: "PENDING", uploadedDate: "2024-11-30" },
        { type: "Medical Bills", status: "VERIFIED", uploadedDate: "2024-11-30" }
      ],
      creditScore: 680,
      monthlyIncome: 45000,
      employment: {
        type: "Self-employed",
        company: "Freelance Consultant",
        designation: "Business Consultant",
        experience: 5
      },
      riskAssessment: {
        score: 65,
        level: "MEDIUM",
        factors: ["Self-employed", "Medical emergency", "Average credit score"]
      },
      verificationDetails: {
        identity: true,
        address: false,
        income: false,
        employment: false,
        banking: false
      },
      comments: []
    },
    {
      id: "APP003",
      applicationNumber: "LXO2024001236",
      customerName: "Amit Patel",
      customerId: "CU789125",
      email: "amit.patel@example.com",
      phone: "+91 9876543212",
      loanType: "Salary Advance",
      requestedAmount: 150000,
      approvedAmount: 150000,
      tenure: 24,
      interestRate: 11.5,
      purpose: "Personal expenses",
      status: "APPROVED",
      priority: "MEDIUM",
      applicationDate: "2024-11-25T16:45:00Z",
      lastUpdated: "2024-11-29T11:30:00Z",
      assignedTo: "admin2@Quikkred.com",
      documents: [
        { type: "Aadhaar", status: "VERIFIED", uploadedDate: "2024-11-25" },
        { type: "PAN", status: "VERIFIED", uploadedDate: "2024-11-25" },
        { type: "Salary Slip", status: "VERIFIED", uploadedDate: "2024-11-25" },
        { type: "Bank Statement", status: "VERIFIED", uploadedDate: "2024-11-25" }
      ],
      creditScore: 720,
      monthlyIncome: 65000,
      employment: {
        type: "Salaried",
        company: "Infosys Limited",
        designation: "Technical Lead",
        experience: 6
      },
      riskAssessment: {
        score: 85,
        level: "LOW",
        factors: ["Excellent employment record", "Good credit score", "Regular salary"]
      },
      verificationDetails: {
        identity: true,
        address: true,
        income: true,
        employment: true,
        banking: true
      },
      comments: [
        {
          id: "C002",
          author: "admin2@Quikkred.com",
          message: "All verifications completed. Loan approved for disbursement.",
          timestamp: "2024-11-29T11:30:00Z",
          type: "INTERNAL"
        }
      ]
    }
  ];

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [loans, searchTerm, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder]);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoans(mockLoans);
      } else {
        const response = await fetch('/api/admin/loans', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }

        const result = await response.json();
        setLoans(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoans(mockLoans); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...loans];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(loan => loan.loanType === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(loan => loan.priority === priorityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof LoanApplication];
      let bValue = b[sortBy as keyof LoanApplication];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredLoans(filtered);
  };

  const handleLoanAction = async (loanId: string, action: 'approve' | 'reject' | 'request_documents') => {
    try {
      // In development, just update the local state
      if (process.env.NODE_ENV === 'development') {
        setLoans(loans.map(loan => {
          if (loan.id === loanId) {
            return {
              ...loan,
              status: action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'DOCUMENTS_PENDING',
              lastUpdated: new Date().toISOString()
            };
          }
          return loan;
        }));
      } else {
        const response = await fetch(`/api/admin/loans/${loanId}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ action })
        });

        if (!response.ok) {
          throw new Error('Failed to perform action');
        }

        fetchLoans(); // Refresh the data
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (bulkSelection.length === 0) return;

    try {
      // Perform bulk action
      for (const loanId of bulkSelection) {
        await handleLoanAction(loanId, action as any);
      }
      setBulkSelection([]);
    } catch (err) {
      console.error('Bulk action failed:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-400 bg-green-500/20';
      case 'REJECTED': return 'text-red-400 bg-red-500/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/20';
      case 'UNDER_REVIEW': return 'text-blue-400 bg-blue-500/20';
      case 'DISBURSED': return 'text-purple-400 bg-purple-500/20';
      case 'DOCUMENTS_PENDING': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-400 bg-green-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20';
      case 'HIGH': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Export functionality
  const handleExport = () => {
    const exportData = filteredLoans.map(loan => ({
      'Application Number': loan.applicationNumber,
      'Customer Name': loan.customerName,
      'Customer ID': loan.customerId,
      'Loan Type': loan.loanType,
      'Requested Amount': loan.requestedAmount,
      'Approved Amount': loan.approvedAmount || 'N/A',
      'Tenure (months)': loan.tenure,
      'Interest Rate': loan.interestRate + '%',
      'Status': loan.status,
      'Priority': loan.priority,
      'Credit Score': loan.creditScore,
      'Application Date': new Date(loan.applicationDate).toLocaleDateString('en-IN')
    }));

    const headers = Object.keys(exportData[0]);
    const csv = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => JSON.stringify(row[header as keyof typeof row] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const stats = {
    totalLoans: loans.length,
    pendingReview: loans.filter(l => l.status === 'PENDING' || l.status === 'UNDER_REVIEW').length,
    approved: loans.filter(l => l.status === 'APPROVED').length,
    disbursed: loans.filter(l => l.status === 'DISBURSED').length,
    totalAmount: loans.reduce((sum, l) => sum + l.requestedAmount, 0),
    approvedAmount: loans.filter(l => l.approvedAmount).reduce((sum, l) => sum + (l.approvedAmount || 0), 0)
  };

  // Chart data
  const statusChartData = [
    { name: 'Pending', value: loans.filter(l => l.status === 'PENDING').length, color: '#F59E0B' },
    { name: 'Under Review', value: loans.filter(l => l.status === 'UNDER_REVIEW').length, color: '#3B82F6' },
    { name: 'Approved', value: loans.filter(l => l.status === 'APPROVED').length, color: '#10B981' },
    { name: 'Rejected', value: loans.filter(l => l.status === 'REJECTED').length, color: '#EF4444' },
    { name: 'Disbursed', value: loans.filter(l => l.status === 'DISBURSED').length, color: '#8B5CF6' },
  ];

  const loanTypeData = [
    { type: 'Personal Loan', count: loans.filter(l => l.loanType === 'Personal Loan').length },
    { type: 'Salary Advance', count: loans.filter(l => l.loanType === 'Salary Advance').length },
    { type: 'Emergency', count: loans.filter(l => l.loanType === 'Emergency Fund' || l.loanType === 'Medical Emergency').length },
    { type: 'Others', count: loans.filter(l => !['Personal Loan', 'Salary Advance', 'Emergency Fund', 'Medical Emergency'].includes(l.loanType)).length },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading loan applications...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Loan Management"
          description={`${filteredLoans.length} applications • ${stats.pendingReview} pending review`}
          icon={Package}
          onRefresh={fetchLoans}
          onExport={handleExport}
          onSearch={setSearchTerm}
          showDateRange={true}
          isLoading={loading}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value={stats.totalLoans}
            icon={Package}
            iconColor="text-blue-400"
            trend={{ value: 12, isPositive: true }}
            description="All loan applications"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={Clock}
            iconColor="text-yellow-400"
            description="Awaiting decision"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            iconColor="text-green-400"
            trend={{ value: 8, isPositive: true }}
            description="Ready for disbursement"
          />
          <StatsCard
            title="Total Amount"
            value={formatCurrency(stats.totalAmount)}
            icon={DollarSign}
            iconColor="text-emerald-400"
            trend={{ value: 15, isPositive: true }}
            description="Requested amount"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="glass p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Type Distribution */}
          <div className="glass p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Loan Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={loanTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="type" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl border border-slate-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LOAN_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LOAN_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PRIORITY_LEVELS.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {bulkSelection.length > 0 && (
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg flex items-center justify-between border border-blue-500/20">
              <span className="text-sm font-medium text-blue-400">
                {bulkSelection.length} applications selected
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                >
                  Bulk Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                >
                  Bulk Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBulkSelection([])}
                  className="px-3 py-1 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700"
                >
                  Clear
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Loan Applications Table */}
        <div className="glass rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelection(filteredLoans.map(l => l.id));
                        } else {
                          setBulkSelection([]);
                        }
                      }}
                      checked={bulkSelection.length === filteredLoans.length}
                      className="rounded border-slate-600 bg-slate-700"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => setSortBy('applicationNumber')}
                      className="flex items-center gap-1 hover:text-slate-200"
                    >
                      Application
                      {sortBy === 'applicationNumber' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => setSortBy('requestedAmount')}
                      className="flex items-center gap-1 hover:text-slate-200"
                    >
                      Amount
                      {sortBy === 'requestedAmount' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLoans.map((loan) => (
                  <motion.tr
                    key={loan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={bulkSelection.includes(loan.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelection([...bulkSelection, loan.id]);
                          } else {
                            setBulkSelection(bulkSelection.filter(id => id !== loan.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-100">{loan.applicationNumber}</div>
                        <div className="text-sm text-slate-400">
                          {new Date(loan.applicationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {loan.customerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-100">{loan.customerName}</div>
                          <div className="text-sm text-slate-400">{loan.customerId}</div>
                          <div className="text-sm text-slate-400">CS: {loan.creditScore}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-100">{loan.loanType}</div>
                      <div className="text-sm text-slate-400">{loan.tenure} months @ {loan.interestRate}%</div>
                      <div className="text-sm text-slate-400">{loan.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-100">
                        {formatCurrency(loan.requestedAmount)}
                      </div>
                      {loan.approvedAmount && (
                        <div className="text-sm text-green-400">
                          Approved: {formatCurrency(loan.approvedAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 ${getPriorityColor(loan.priority)}`}>
                        <Flag className="h-4 w-4" />
                        <span className="text-sm font-medium">{loan.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(loan.riskAssessment.level)}`}>
                        {loan.riskAssessment.level} ({loan.riskAssessment.score}/100)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
                            setShowDetails(true);
                          }}
                          className="text-[#1976D2] hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {loan.status === 'PENDING' || loan.status === 'UNDER_REVIEW' ? (
                          <>
                            <button
                              onClick={() => handleLoanAction(loan.id, 'approve')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleLoanAction(loan.id, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : null}

                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loan applications found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Loan Details Modal */}
      <AnimatePresence>
        {showDetails && selectedLoan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedLoan.applicationNumber}</h2>
                    <p className="text-gray-600">{selectedLoan.customerName} • {selectedLoan.loanType}</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-gray-900">{selectedLoan.customerName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Customer ID</label>
                          <p className="text-gray-900">{selectedLoan.customerId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{selectedLoan.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{selectedLoan.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Credit Score</label>
                          <p className={`font-semibold ${selectedLoan.creditScore >= 750 ? 'text-green-600' : selectedLoan.creditScore >= 650 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {selectedLoan.creditScore}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                          <p className="text-gray-900">{formatCurrency(selectedLoan.monthlyIncome)}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Employment</label>
                        <p className="text-gray-900">
                          {selectedLoan.employment.designation} at {selectedLoan.employment.company}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedLoan.employment.type} • {selectedLoan.employment.experience} years experience
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Loan Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Loan Type</label>
                          <p className="text-gray-900">{selectedLoan.loanType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Purpose</label>
                          <p className="text-gray-900">{selectedLoan.purpose}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Requested Amount</label>
                          <p className="text-gray-900">{formatCurrency(selectedLoan.requestedAmount)}</p>
                        </div>
                        {selectedLoan.approvedAmount && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Approved Amount</label>
                            <p className="text-green-600 font-semibold">{formatCurrency(selectedLoan.approvedAmount)}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tenure</label>
                          <p className="text-gray-900">{selectedLoan.tenure} months</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Interest Rate</label>
                          <p className="text-gray-900">{selectedLoan.interestRate}% p.a.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Assessment
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(selectedLoan.riskAssessment.level)}`}>
                        {selectedLoan.riskAssessment.level} RISK
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {selectedLoan.riskAssessment.score}/100
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Risk Factors:</h4>
                      <ul className="space-y-1">
                        {selectedLoan.riskAssessment.factors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Verification Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(selectedLoan.verificationDetails).map(([key, verified]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        {verified ? (
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        )}
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className={`text-xs ${verified ? 'text-green-600' : 'text-red-600'}`}>
                          {verified ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents ({selectedLoan.documents.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedLoan.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.type}</p>
                            <p className="text-sm text-gray-600">
                              Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200">
                  {selectedLoan.status === 'PENDING' || selectedLoan.status === 'UNDER_REVIEW' ? (
                    <>
                      <button
                        onClick={() => {
                          handleLoanAction(selectedLoan.id, 'request_documents');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Request Documents
                      </button>
                      <button
                        onClick={() => {
                          handleLoanAction(selectedLoan.id, 'reject');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => {
                          handleLoanAction(selectedLoan.id, 'approve');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 bg-[#006837] text-white rounded-lg hover:bg-green-600"
                      >
                        Approve Loan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}