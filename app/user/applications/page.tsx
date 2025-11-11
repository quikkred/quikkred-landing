'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FileText, Search, Calendar, IndianRupee,
  Clock, CheckCircle, AlertCircle, Eye, RefreshCw,
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Application {
  _id: string;
  applicationNumber: string;
  customerId: {
    _id: string;
    email: string;
    fullName: string;
  };
  loanAmount: number;
  requestedTenure: number;
  purpose: string;
  priority?: string;
  status: string;
  createdAt: string;
  assignedTo?: {
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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
        `https://77q1g1gk-5050.inc1.devtunnels.ms/api/application/loan/get?page=${currentPage}&limit=${currentLimit}`,
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
            totalRecords: result.pagination.totalRecords,
            totalPages: result.pagination.totalPages,
            currentPage: result.pagination.currentPage,
            limit: result.pagination.limit
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
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-[#2E7D32] animate-spin" />
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B5E20]">My Applications</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track your loan application status and history
            </p>
          </div>
          <button
            onClick={() => fetchApplications()}
            className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
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
              className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] text-[#1B5E20] rounded-lg border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm ${
                filterStatus === 'all'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm ${
                filterStatus === 'processing'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm ${
                filterStatus === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white'
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
            <h3 className="text-xl font-semibold text-[#1B5E20] mb-2">No Applications Found</h3>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Purpose</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
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
                      <div className="text-sm font-medium text-[#1B5E20]">{app.applicationNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{app.purpose}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#1B5E20]">₹{app.loanAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.requestedTenure} months</div>
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
                        onClick={() => {
                          setSelectedApplication(app);
                          setIsDetailModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 bg-[#1976D2] text-white text-xs font-medium rounded-lg hover:bg-[#1565C0] transition-colors"
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
              Showing <span className="font-semibold text-[#1B5E20]">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-semibold text-[#1B5E20]">
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)}
              </span>{' '}
              of <span className="font-semibold text-[#1B5E20]">{pagination.totalRecords}</span> applications
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
                            ? 'bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white'
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => setIsDetailModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Application Details</h3>
                    <p className="text-sm text-white/80">{selectedApplication.applicationNumber}</p>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <AlertCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Purpose</p>
                    <p className="font-semibold text-[#1B5E20]">{selectedApplication.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="font-semibold text-[#1B5E20]">₹{selectedApplication.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tenure</p>
                    <p className="font-semibold text-[#1B5E20]">{selectedApplication.requestedTenure} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                  {selectedApplication.priority && (
                    <div>
                      <p className="text-sm text-gray-600">Priority</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedApplication.priority === 'High' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'
                      }`}>
                        {selectedApplication.priority}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Applied On</p>
                    <p className="font-semibold text-[#1B5E20]">
                      {new Date(selectedApplication.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {selectedApplication.assignedTo && (
                  <div className="bg-[#FAFAFA] rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Assigned To</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedApplication.assignedTo.fullName}</span></p>
                      <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedApplication.assignedTo.email}</span></p>
                      <p><span className="text-gray-600">Mobile:</span> <span className="font-medium">{selectedApplication.assignedTo.mobile}</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#E0E0E0]">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-full px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors"
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
