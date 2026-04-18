'use client';

import { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from "nextjs-toploader/app";
import {
  MessageSquare, Plus, RefreshCw, Send, AlertCircle,
  X, Eye, Search, Upload, File as FileIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupport } from '@/store/hooks/useSupport';
import useAxios from '@/hooks/useAxios';
import { Skeleton } from '@/components/ui/Skeleton';

interface SupportTicket {
  _id: string;
  ticketNumber: string;
  customerId: {
    _id: string;
    email: string;
    fullName: string;
  } | string;
  category: string;
  subject: string;
  chatDetails: string | Array<{
    message: string;
    addedBy?: {
      _id: string;
      fullName: string;
      email: string;
      mobile?: string;
      role?: string;
    };
    addedByModel?: string;
    addedAt: string;
    assignedTo?: {
      _id: string;
      fullName: string;
      email: string;
      mobile?: string;
    };
    assignedAt?: string;
    remarkedAt?: string;
    remarks?: string;
    attachments?: Array<{
      s3Key?: string;
      s3URL: string;
      originalName?: string;
      mimeType?: string;
      size?: number;
      uploadedAt?: string;
      _id?: string;
    }>;
    statusAtReply?: string;
    _id: string;
  }>;
  status: string;
  assignedDetails?: Array<{
    assignedTo: {
      _id: string;
      fullName: string;
      email: string;
    };
    assignedAt: string;
    _id: string;
  }>;
  remarks?: Array<{
    addedBy?: string;
    text: string;
    remarkedAt: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const axios = useAxios();

  // Redux state for support tickets
  const {
    tickets,
    loading,
    error,
    fetchSupportTickets: reduxFetchTickets,
  } = useSupport();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    category: 'TECHNICAL_ISSUE',
    subject: '',
    description: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // File upload state - Create Ticket
  const [createFiles, setCreateFiles] = useState<File[]>([]);
  const [createDragging, setCreateDragging] = useState(false);
  const [showCreateUpload, setShowCreateUpload] = useState(false);

  // --- File Handling Logic ---
  const handleFileValidation = (files: File[], existingFiles: File[]): File[] => {
    const validFiles: File[] = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setFormError(`${file.name} exceeds the 5MB limit and was not added.`);
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setFormError(`${file.name} is not a supported file type.`);
        return;
      }
      validFiles.push(file);
    });
    return [...existingFiles, ...validFiles];
  };

  const handleCreateFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCreateFiles(handleFileValidation(files, createFiles));
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleCreateDragEnter = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setCreateDragging(true); };
  const handleCreateDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setCreateDragging(false); };
  const handleCreateDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setCreateDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setCreateFiles(handleFileValidation(files, createFiles));
  };

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const result = await reduxFetchTickets();
    if (result?.requiresAuth) {
      router.push('/login');
    }
  };

  const openTicketDetail = (ticket: SupportTicket) => {
    router.push(`/user/support/${ticket._id}`);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      // const token = await getToken();
      // const customerId = localStorage.getItem('userId');
      const customerId = user?.id;

      // if (!token) {
      //   router.push('/login');
      //   return;
      // }

      if (!customerId) {
        setFormError('User ID not found. Please login again.');
        setFormLoading(false);
        return;
      }

      // const response = await fetch(`${API_BASE_URL}/api/supportTicket/create`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     customerId: customerId,
      //     category: formData.category,
      //     subject: formData.subject,
      //     description: formData.description
      //   })
      // });

      // const result = await response.json();
      const payload = new FormData();
      payload.append('customerId', customerId);
      payload.append('category', formData.category);
      payload.append('subject', formData.subject);
      payload.append('description', formData.description);

      if (createFiles.length > 0) {
        createFiles.forEach((file) => {
          payload.append('photo', file);
        });
      }

      const response = await axios.post("/api/supportTicket/create", payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const result = response.data;

      if ((response.status === 200 || response.status === 201) && result.success) {
        // Reset form
        setFormData({
          category: 'TECHNICAL_ISSUE',
          subject: '',
          description: ''
        });
        setCreateFiles([]);
        setShowCreateUpload(false);
        setShowCreateForm(false);
        // Refresh tickets
        fetchTickets();
      } else {
        setFormError(result.message || 'Failed to create ticket');
      }
    } catch (error: any) {
      setFormError(error.message || 'Failed to create ticket');
    } finally {
      setFormLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'LOAN_INQUIRY':
        return 'text-[#6C63FF] bg-[#6C63FF]/10'; // soft purple-blue
      case 'PAYMENT_ISSUE':
        return 'text-[#FF6B6B] bg-[#FF6B6B]/10'; // coral red
      case 'GENERAL_INQUIRY':
        return 'text-[#25B181] bg-[#25B181]/10'; // green
      case 'TECHNICAL_ISSUE':
        return 'text-[#4A66FF] bg-[#4A66FF]/10'; // blue
      case 'KYC_VERIFICATION':
        return 'text-[#FFC107] bg-[#FFC107]/10'; // yellow-gold
      case 'DOCUMENT_UPLOAD':
        return 'text-[#00B8D9] bg-[#00B8D9]/10'; // cyan
      case 'ACCOUNT_ACCESS':
        return 'text-[#8E44AD] bg-[#8E44AD]/10'; // violet
      case 'COMPLAINT':
        return 'text-red-600 bg-red-100'; // red tone
      case 'OTHER':
        return 'text-gray-500 bg-gray-100'; // neutral gray
      case 'BILLING':
        return 'text-[#FF9C70] bg-[#FF9C70]/10'; // orange-peach
      default:
        return 'text-gray-600 bg-gray-100'; // fallback
    }

  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
      case 'IN_PROGRESS':
        return 'text-[#4A66FF] bg-[#4A66FF]/10';
      case 'REOPENED':
        return 'text-orange-600 bg-orange-100';
      case 'RESOLVED':
      case 'CLOSED':
        return 'text-[#25B181] bg-[#25B181]/10';
      case 'PENDING':
        return 'text-[#FF9C70] bg-[#FF9C70]/10';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const statusLower = ticket.status?.toLowerCase() || '';
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'open' && (statusLower === 'open' || statusLower === 'in_progress' || statusLower === 'pending' || statusLower === 'reopened')) ||
      (filterStatus === 'closed' && (statusLower === 'closed' || statusLower === 'resolved'));

    const matchesSearch =
      ticket.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        {/* Header skeleton */}
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 sm:w-24" rounded="lg" />
            <Skeleton className="h-10 w-28 sm:w-32" rounded="lg" />
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="bg-white rounded-xl p-4 border border-[#E0E0E0] mb-5 space-y-3">
          <Skeleton className="h-10 w-full" rounded="lg" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" rounded="lg" />
            <Skeleton className="h-9 w-20" rounded="lg" />
            <Skeleton className="h-9 w-24" rounded="lg" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <div className="bg-[#FAFAFA] border-b border-[#E0E0E0] h-12" />
          <div className="divide-y divide-[#E0E0E0]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4 px-4 py-4 items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40 col-span-2" />
                <Skeleton className="h-6 w-24" rounded="full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16 ml-auto" rounded="lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F8F68] flex items-center gap-2 sm:gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A66FF]" />
              Support Tickets
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Get help with your issues and questions</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => fetchTickets()}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 sm:p-6 border border-[#E0E0E0] shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1F8F68]">Create New Ticket</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-1 hover:bg-[#FAFAFA] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none"
              >
                <option value="LOAN_INQUIRY">Loan Inquiry</option>
                <option value="PAYMENT_ISSUE">Payment Issue</option>
                <option value="GENERAL_INQUIRY">General Inquiry</option>
                <option value="TECHNICAL_ISSUE">Technical Issue</option>
                <option value="KYC_VERIFICATION">KYC Verification</option>
                <option value="DOCUMENT_UPLOAD">Document Upload</option>
                <option value="ACCOUNT_ACCESS">Account Access</option>
                <option value="COMPLAINT">Complaint</option>
                <option value="EMAIL_INQUIRY">Email Inquiry</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="Brief description of your issue"
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                placeholder="Provide detailed information about your issue"
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none resize-none"
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents
              </label>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateUpload(!showCreateUpload);
                    if (showCreateUpload) setCreateFiles([]);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${showCreateUpload ? 'bg-[#25B181]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${showCreateUpload ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-gray-600">
                  {showCreateUpload ? 'Upload documents' : 'No documents'}
                </span>
              </div>

              {showCreateUpload && (
                <>
                  <div
                    className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-300 ${createDragging
                      ? 'border-[#25B181] bg-[#25B181]/10'
                      : 'border-gray-300 bg-[#FAFAFA] hover:border-[#25B181] hover:bg-[#25B181]/5'
                    }`}
                    onDragEnter={handleCreateDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleCreateDragLeave}
                    onDrop={handleCreateDrop}
                  >
                    <input
                      type="file"
                      id="createFileInput"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      multiple
                      onChange={handleCreateFileChange}
                      className="hidden"
                    />
                    <label htmlFor="createFileInput" className="cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Click to upload</strong> or drag and drop
                      </p>
                      <span className="text-xs text-gray-400">PDF, JPG, PNG, DOC (Max 5MB)</span>
                    </label>
                  </div>
                  {createFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {createFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 px-3 bg-[#FAFAFA] rounded-md text-sm border border-gray-100">
                          <div className="flex items-center gap-2">
                            <FileIcon size={14} className="text-[#25B181]" />
                            <span className="truncate max-w-[200px]">{file.name}</span>
                            <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCreateFiles(createFiles.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 text-lg leading-none p-1"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700">{formError}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Create Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-3 sm:p-4 border border-[#E0E0E0] mb-4 sm:mb-6 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Ticket ID, Subject, or Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-[#FAFAFA] text-[#1F8F68] rounded-lg border border-[#E0E0E0] focus:border-[#25B181] focus:ring-2 focus:ring-[#25B181]/20 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${filterStatus === 'all'
                  ? 'bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
                }`}
            >
              All ({tickets.length})
            </button>
            <button
              onClick={() => setFilterStatus('open')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${filterStatus === 'open'
                  ? 'bg-[#4A66FF] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
                }`}
            >
              Open ({tickets.filter(t => {
                const s = t.status?.toLowerCase() || '';
                return s === 'open' || s === 'in_progress' || s === 'pending' || s === 'reopened';
              }).length})
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap ${filterStatus === 'closed'
                  ? 'bg-[#25B181] text-white'
                  : 'bg-[#FAFAFA] border border-[#E0E0E0] text-gray-700 hover:bg-white'
                }`}
            >
              Closed ({tickets.filter(t => {
                const s = t.status?.toLowerCase() || '';
                return s === 'closed' || s === 'resolved';
              }).length})
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm overflow-hidden"
      >
        {filteredTickets.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#1F8F68] mb-2">No Tickets Found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'You haven\'t created any support tickets yet'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Your First Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {filteredTickets.map((ticket, index) => (
                  <motion.tr
                    key={ticket._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#1F8F68]">
                        {ticket.ticketNumber || ticket._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {ticket.subject}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                        {ticket.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status || 'OPEN'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openTicketDetail(ticket)}
                        className="inline-flex items-center px-3 py-1.5 bg-[#4A66FF] text-white text-xs font-medium rounded-lg hover:bg-[#4A66FF]/90 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

    </div>
  );
}
