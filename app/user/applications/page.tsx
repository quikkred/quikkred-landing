'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FileText, Search, Calendar, IndianRupee,
  Clock, CheckCircle, AlertCircle, Eye, RefreshCw,
  ChevronLeft, ChevronRight, Filter, X, User,
  CreditCard, Building, Shield, MessageSquare,
  Download, Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loansService } from '@/lib/api/loans.service';

interface Application {
  _id: string;
  applicationNumber: string;
  customerId: {
    _id: string;
    mobile?: string;
    email: string;
    fullName: string;
  };
  requestedLoanAmount?: number;
  tenure: number;
  tenureUnit: string;
  purpose?: string;
  priority?: string;
  emiAmount?: number;
  status: string;
  cibilScore?: number;
  riskScore?: number;
  fraudScore?: number;
  incomeScore?: number;
  verificationChecklist?: {
    identityVerification: {
      panVerified: boolean;
      aadhaarVerified: boolean;
      bankStatementVerified: boolean;
      bankAccountVerified: boolean;
      agreementSigned: boolean;
      pdcChequesCollected: boolean;
      insuranceOpted: boolean;
      nachMandateRegistered: boolean;
      faceMatchDone: boolean;
    };
  };
  createdAt: string;
  assignedTo?: {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface DetailedApplication {
  _id: string;
  applicationNumber: string;
  customerId: {
    _id: string;
    email: string;
    fullName: string;
    references?: Array<{
      name: string;
      mobile: string;
      relationship: string;
      _id: string;
    }>;
  };
   productId?: {
    processingFee: number;
    dailyInterestRate: number;
    gst: number;
    };
  
  isSubmit: boolean;
  requestedLoanAmount: number;
  tenure: number;
  tenureUnit: number;
  interestRate: number;
  processingFee: number;
  gstOnProcessingFee: number;
  totalInterest: number;
  totalRepayment: number;
  netDisbursalAmount: number;
  emiAmount?: number;
  status: string;
  cibilScore: number;
  riskScore: number;
  fraudScore: number;
  incomeScore: number;
  autoDecisionScore: number;
  statusHistory: any[];
  documents: Array<{
    documentId: {
      _id: string;
      s3Key: string;
      s3URL: string;
      status: string;
      uploadedAt: string;
    };
    documentType: string;
    documentName: string;
  
  }>;
  internalNotes: Array<{
    note: string;
    addedBy: {
      _id: string;
      fullName: string;
      email: string;
      mobile: string;
    };
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  disbursementBankAccount?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  priority: string;
  purpose: string;
  verificationChecklist?: {
    identityVerification: {
      panVerified: boolean;
      aadhaarVerified: boolean;
      bankAccountVerified: boolean;
      faceMatchDone: boolean;
      agreementSigned: boolean;
      pdcChequesCollected: boolean;
      insuranceOpted: boolean;
      nachMandateRegistered: boolean;
    };
    creditBureauCheck?: {
      status: string;
      bureauPulled: boolean;
      bureauSource: string;
      bureauScore: number;
      bureauReportId: string;
      requestedAt: string;
      requestedBy: string;
      respondedAt: string;
      cost: number;
    };
  };
  lastModifiedBy?: {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface PaginationInfo {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function MyApplicationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailedApplication, setDetailedApplication] = useState<DetailedApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10
  });

  // Check authentication
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch applications
  useEffect(() => {
    fetchApplications();
  }, [pagination.currentPage, pagination.limit]);

  const fetchApplications = async (page?: number, limit?: number) => {
    try {
      setLoading(true);

      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const currentPage = page || pagination.currentPage;
      const currentLimit = limit || pagination.limit;

      const response = await fetch(
        `https://alpha.quikkred.in/api/application/loan/get?page=${currentPage}&limit=${currentLimit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setApplications(result.data);

        // Update pagination info
        if (result.pagination) {
          setPagination({
            totalRecords: result.pagination.totalRecords || 0,
            totalPages: result.pagination.totalPages || 1,
            currentPage: result.pagination.currentPage || 1,
            limit: result.pagination.limit || 10
          });
        }
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
  };

  // Calculate EMI
  const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
    if (!principal || !annualRate || !tenureMonths) return 0;

    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return Math.round(emi);
  };

  // Fetch detailed application data
  const fetchApplicationDetails = async (applicationNumber: string) => {
    try {
      setLoadingDetails(true);
      const response = await loansService.getApplicationDetails(applicationNumber);

      if (response.success && response.data) {
        // Calculate EMI if not provided by API
        const applicationData = response.data;
        if (!applicationData.emiAmount && applicationData.requestedLoanAmount && applicationData.interestRate && applicationData.tenure) {
          applicationData.emiAmount = calculateEMI(
            applicationData.requestedLoanAmount,
            applicationData.interestRate,
            applicationData.tenure
          );
        }
        setDetailedApplication(applicationData);
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle view details click
  const handleViewDetails = async (app: Application) => {
    setSelectedApplication(app);
    setIsDetailModalOpen(true);
    await fetchApplicationDetails(app.applicationNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'PROCESSING':
        return 'text-blue-600 bg-blue-100';
      case 'APPROVED':
      case 'DISBURSED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const statusUpper = app.status.toUpperCase();
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'pending' && statusUpper === 'PENDING') ||
      (filterStatus === 'processing' && statusUpper === 'PROCESSING') ||
      (filterStatus === 'approved' && (statusUpper === 'APPROVED' || statusUpper === 'DISBURSED')) ||
      (filterStatus === 'rejected' && (statusUpper === 'REJECTED' || statusUpper === 'CANCELLED'));

    const matchesSearch = app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.purpose?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.customerId?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-[#25B181] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F8F68]">My Applications</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track your loan application status and history
            </p>
          </div>
          <button
            onClick={() => fetchApplications()}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4"
      >
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Application Number or Purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] text-[#1F8F68] rounded-lg border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'pending'
                  ? 'bg-[#FF9C70] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'processing'
                  ? 'bg-[#4A66FF] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'approved'
                  ? 'bg-[#25B181] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filterStatus === 'rejected'
                  ? 'bg-[#FF6B6B] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </motion.div>

      {/* Applications Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm overflow-hidden"
      >
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1F8F68] mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'You haven\'t submitted any loan applications yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Application No.</th>
                  {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th> */}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">EMI Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tenure</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {filteredApplications.map((app, index) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#1F8F68]">{app.applicationNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    {/* <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{app.customerId?.fullName || '-'}</div>
                      <div className="text-xs text-gray-500">{app.customerId?.mobile || app.customerId?.email || ''}</div>
                    </td> */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#1F8F68]">₹{(app.emiAmount || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.tenure || '-'} {app.tenureUnit || ''}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {app.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.priority === 'High' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'
                        }`}>
                          {app.priority}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="inline-flex items-center px-3 py-1.5 bg-[#4A66FF] text-white text-xs font-medium rounded-lg hover:bg-[#4A66FF]/90 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {filteredApplications.length > 0 && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-[#1F8F68]">{pagination.totalRecords > 0 ? (pagination.currentPage - 1) * pagination.limit + 1 : 0}</span> to{' '}
              <span className="font-semibold text-[#1F8F68]">
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords) || 0}
              </span>{' '}
              of <span className="font-semibold text-[#1F8F68]">{pagination.totalRecords || 0}</span> applications
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-[#E0E0E0] rounded-lg hover:bg-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pagination.currentPage === pageNumber
                            ? 'bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white'
                            : 'text-gray-700 bg-white border border-[#E0E0E0] hover:bg-[#FAFAFA]'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === pagination.currentPage - 2 ||
                    pageNumber === pagination.currentPage + 2
                  ) {
                    return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-[#E0E0E0] rounded-lg hover:bg-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Per page:</label>
              <select
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-3 py-2 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Modal */}
      {isDetailModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => {
                setIsDetailModalOpen(false);
                setDetailedApplication(null);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[calc(100vw-2rem)] sm:max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">Application Details</h3>
                    <p className="text-xs sm:text-sm text-white/80">{selectedApplication.applicationNumber}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setDetailedApplication(null);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-[#25B181] animate-spin" />
                </div>
              ) : detailedApplication ? (
                <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Customer Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold text-gray-900">{detailedApplication.customerId.fullName .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{detailedApplication.customerId.email}</p>
                      </div>

                      {/* References */}
                      {detailedApplication.customerId.references && detailedApplication.customerId.references.length > 0 && (
                        <div className="col-span-full mt-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                            <p className="text-xs sm:text-sm font-semibold text-gray-700">References</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {detailedApplication.customerId.references.map((ref, idx) => (
                              <div key={ref._id} className="bg-white rounded-lg p-3 border border-blue-100">
                                <p className="text-sm font-semibold text-gray-800">{ref.name}</p>
                                <p className="text-xs text-gray-600">{ref.mobile}</p>
                                <p className="text-xs text-blue-600">{ref.relationship}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">Loan Details</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Loan Amount</p>
                        <p className="text-lg font-bold text-green-700">₹{(detailedApplication.requestedLoanAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tenure</p>
                        <p className="font-semibold text-gray-900">{detailedApplication.tenure || '-'}{" "}{detailedApplication.tenureUnit || ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">EMI Amount</p>
                        <p className="text-lg font-bold text-blue-700">₹{(detailedApplication.emiAmount || 0).toLocaleString()}</p>
                      </div>
                      {/* <div>
                        <p className="text-sm text-gray-600">Purpose</p>
                        <p className="font-semibold text-gray-900">{detailedApplication.purpose || '-'}</p>
                      </div> */}
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate (p.d%)</p>
                        <p className="font-semibold text-gray-900">{detailedApplication.interestRate || 0}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Processing Fee({detailedApplication.productId?.processingFee || 0}%)</p>
                        <p className="font-semibold text-gray-900">₹{(detailedApplication.processingFee || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">GST on Fee({detailedApplication.productId?.gst || 0}%)</p>
                        <p className="font-semibold text-gray-900">₹{(detailedApplication.gstOnProcessingFee || 0).toLocaleString()}</p>
                      </div>
<div>
  <p className="text-sm text-gray-600">
    Total Interest Rate for {detailedApplication.tenure || 0} days (
    {((detailedApplication.interestRate || 0) * (detailedApplication.tenure || 0)).toFixed(2)}%
    )
  </p>
  <p className="font-semibold text-gray-900">
    ₹{Number(detailedApplication.totalInterest || 0).toLocaleString()}
  </p>
</div>

                      <div>
                        <p className="text-sm text-gray-600">Total Repayment</p>
                        <p className="font-semibold text-gray-900">₹{(detailedApplication.totalRepayment || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Net Disbursal</p>
                        <p className="text-lg font-bold text-green-700">₹{(detailedApplication.netDisbursalAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Priority</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          detailedApplication.priority === 'HIGH' ? 'text-red-600 bg-red-100' :
                          detailedApplication.priority === 'MEDIUM' ? 'text-yellow-600 bg-yellow-100' :
                          'text-gray-600 bg-gray-100'
                        }`}>
                          {detailedApplication.priority}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detailedApplication.status)}`}>
                          {detailedApplication.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  {detailedApplication.documents && detailedApplication.documents.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-amber-200">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        <h4 className="text-base sm:text-lg font-bold text-gray-800">Documents</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {detailedApplication.documents.map((doc, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 border border-amber-100">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                              <p className="font-semibold text-gray-800">
  {doc.documentType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase())}
</p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Uploaded: {new Date(doc.documentId.uploadedAt).toLocaleDateString()}
                                </p>
                                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  doc.documentId.status === 'VERIFIED' ? 'text-green-600 bg-green-100' :
                                  doc.documentId.status === 'PENDING' ? 'text-yellow-600 bg-yellow-100' :
                                  'text-red-600 bg-red-100'
                                }`}>
                                  {doc.documentId.status}
                                </span>
                              </div>
                              <a
                                href={doc.documentId.s3URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bank Account */}
                  {detailedApplication.disbursementBankAccount && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                        <h4 className="text-base sm:text-lg font-bold text-gray-800">Disbursement Bank Account</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Bank Name</p>
                          <p className="font-semibold text-gray-900">{detailedApplication.disbursementBankAccount.bankName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Account Holder</p>
                          <p className="font-semibold text-gray-900">{detailedApplication.disbursementBankAccount.accountHolderName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Account Number</p>
                          <p className="font-semibold text-gray-900">{detailedApplication.disbursementBankAccount.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">IFSC Code</p>
                          <p className="font-semibold text-gray-900">{detailedApplication.disbursementBankAccount.ifscCode}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="bg-[#FAFAFA] rounded-lg p-3 sm:p-4 border border-[#E0E0E0]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-600">Created At</p>
                        <p className="font-semibold text-gray-900">{detailedApplication.createdAt ? new Date(detailedApplication.createdAt).toLocaleString() : '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Updated</p>
                        <p className="font-semibold text-gray-900">{detailedApplication.updatedAt ? new Date(detailedApplication.updatedAt).toLocaleString() : '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Unable to load detailed information</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="sticky bottom-0 px-4 sm:px-6 py-3 sm:py-4 bg-[#FAFAFA] border-t border-[#E0E0E0]">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setDetailedApplication(null);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
