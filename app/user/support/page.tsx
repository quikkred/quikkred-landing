'use client';

import { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from "nextjs-toploader/app";
import {
  MessageSquare, Plus, RefreshCw, Send, AlertCircle,
  CheckCircle, Clock, X, Eye, Filter, Search,
  FileText, User, Calendar, Tag, AlertTriangle, Mail, Phone,
  Upload, File as FileIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/config';
import { useSupport } from '@/store/hooks/useSupport';
import getToken from '@/lib/getToken';
import useAxios from '@/hooks/useAxios';

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
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showReopenForm, setShowReopenForm] = useState(false);
  const [reopenDescription, setReopenDescription] = useState('');
  const [reopenLoading, setReopenLoading] = useState(false);
  const [reopenError, setReopenError] = useState('');

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

  // File upload state - Reply
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyDragging, setReplyDragging] = useState(false);
  const [showReplyUpload, setShowReplyUpload] = useState(false);

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

  const handleReplyFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReplyFiles(handleFileValidation(files, replyFiles));
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
  const handleReplyDragEnter = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setReplyDragging(true); };
  const handleReplyDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setReplyDragging(false); };
  const handleReplyDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setReplyDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setReplyFiles(handleFileValidation(files, replyFiles));
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
          payload.append('attachment', file);
        });
      }

      const response = await axios.postForm("/api/supportTicket/create", payload);
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

  // Check if ticket allows reply (OPEN or REOPENED)
  const canReplyToTicket = (status: string) => {
    const upperStatus = status?.toUpperCase();
    return upperStatus === 'OPEN' || upperStatus === 'REOPENED' || upperStatus === 'IN_PROGRESS' || upperStatus === 'PENDING';
  };

  // Check if ticket is closed
  const isTicketClosed = (status: string) => {
    const upperStatus = status?.toUpperCase();
    return upperStatus === 'CLOSED' || upperStatus === 'RESOLVED';
  };

  // Reopen ticket - just update status to REOPENED
  const handleReopenTicket = async () => {
    if (!selectedTicket) return;

    setReopenError('');
    setReopenLoading(true);

    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/api/supportTicket/update/${selectedTicket._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'REOPENED' })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update selected ticket with new data
        setSelectedTicket(result.data);
        // Refresh tickets list
        fetchTickets();
      } else {
        setReopenError(result.message || 'Failed to reopen ticket');
      }
    } catch (error: any) {
      setReopenError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setReopenLoading(false);
    }
  };

  // Send reply to ticket
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !reopenDescription.trim()) {
      setReopenError('Please enter a message');
      return;
    }

    setReopenError('');
    setReopenLoading(true);

    try {
      const payload = new FormData();
      payload.append('description', reopenDescription.trim());

      if (replyFiles.length > 0) {
        replyFiles.forEach((file) => {
          payload.append('attachment', file);
        });
      }

      const response = await axios.patch(`/api/supportTicket/update/${selectedTicket._id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const result = response.data;

      if ((response.status === 200 || response.status === 201) && result.success) {
        // Update selected ticket with new data
        setSelectedTicket(result.data);
        // Reset form
        setReopenDescription('');
        setReplyFiles([]);
        setShowReplyUpload(false);
        setShowReopenForm(false);
        // Refresh tickets list
        fetchTickets();
      } else {
        setReopenError(result.message || 'Failed to send reply');
      }
    } catch (error: any) {
      setReopenError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setReopenLoading(false);
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
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#25B181] border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-gray-600">Loading support tickets...</p>
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
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsDetailModalOpen(true);
                        }}
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

      {/* Ticket Detail Modal */}
      {isDetailModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => setIsDetailModalOpen(false)}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[calc(100vw-1rem)] sm:max-w-3xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">Ticket Details</h3>
                    <p className="text-xs sm:text-sm text-white/80">
                      ID: {selectedTicket.ticketNumber || selectedTicket._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-3 sm:px-6 py-3 sm:py-4 max-h-[70vh] overflow-y-auto">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status || 'OPEN'}
                  </span>
                  <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${getCategoryColor(selectedTicket.category)}`}>
                    {selectedTicket.category.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Subject */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Subject</h4>
                  <p className="text-base sm:text-lg font-semibold text-[#1F8F68]">{selectedTicket.subject}</p>
                </div>

                {/* Conversation History */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A66FF]" />
                    Support Conversation
                    {Array.isArray(selectedTicket.chatDetails) && (
                      <span className="ml-auto text-[10px] sm:text-xs text-gray-500">
                        {selectedTicket.chatDetails.length} messages
                      </span>
                    )}
                  </h4>
                  <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white rounded-lg p-2 sm:p-4 border border-gray-200">
                    {Array.isArray(selectedTicket.chatDetails) ? (
                      selectedTicket.chatDetails?.map((chat, index) => {
                        // Check if message is from customer (case-insensitive check or by comparing IDs)
                        const customerId = typeof selectedTicket.customerId === 'object' ? selectedTicket.customerId._id : selectedTicket.customerId;
                        const isCustomer = chat.addedByModel?.toLowerCase() === 'customer' ||
                          chat.addedBy?._id === customerId;

                        return (
                          <div key={chat._id} className="space-y-2 sm:space-y-3">
                            {/* Customer/User Message */}
                            <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                              <div className={`flex ${isCustomer ? 'flex-row' : 'flex-row-reverse'} items-end gap-1.5 sm:gap-2 max-w-[90%] sm:max-w-[80%]`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md ${isCustomer
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                    : 'bg-gradient-to-br from-[#25B181] to-[#1F8F68]'
                                  }`}>
                                  {isCustomer ? 'You' : (chat.addedBy?.fullName?.charAt(0).toUpperCase() || 'S')}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                                  {/* Sender Label */}
                                  <div className={`flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 px-1 sm:px-2 text-[10px] sm:text-xs font-semibold ${isCustomer ? 'text-blue-600' : 'text-[#25B181]'
                                    }`}>
                                    <span className="truncate max-w-[150px] sm:max-w-none">
                                      {isCustomer ? 'Your Query' : `${chat.addedBy?.fullName || chat.assignedTo?.fullName || 'Support'}`}
                                    </span>
                                  </div>

                                  <div className={`rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-md ${isCustomer
                                      ? 'bg-white border-2 border-blue-200 rounded-bl-none'
                                      : 'bg-gradient-to-br from-[#25B181] to-[#1F8F68] text-white rounded-br-none'
                                    }`}>
                                    <p className={`text-xs sm:text-sm leading-relaxed ${isCustomer ? 'text-gray-800' : 'text-white'}`}>
                                      {chat.message}
                                    </p>
                                  </div>

                                  {/* Timestamp */}
                                  <div className="mt-0.5 sm:mt-1 px-1 sm:px-2 text-[10px] sm:text-xs text-gray-500">
                                    {new Date(chat.addedAt).toLocaleString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Support Agent Response (if remarks exist) */}
                            {chat.remarks && (
                              <div className="flex justify-end">
                                <div className="flex flex-row-reverse items-end gap-1.5 sm:gap-2 max-w-[90%] sm:max-w-[80%]">
                                  {/* Avatar */}
                                  <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md bg-gradient-to-br from-[#25B181] to-[#1F8F68]">
                                    {chat.assignedTo?.fullName?.charAt(0).toUpperCase() || 'S'}
                                  </div>

                                  {/* Message Bubble */}
                                  <div className="flex flex-col items-end">
                                    {/* Sender Label */}
                                    <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 px-1 sm:px-2 text-[10px] sm:text-xs font-semibold text-[#25B181]">
                                      <span className="truncate max-w-[150px] sm:max-w-none">{chat.assignedTo?.fullName || 'Support'}</span>
                                    </div>

                                    <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-md bg-gradient-to-br from-[#25B181] to-[#1F8F68] text-white rounded-br-none">
                                      <p className="text-xs sm:text-sm leading-relaxed text-white">
                                        {chat.remarks}
                                      </p>
                                    </div>

                                    {/* Timestamp and Agent Info */}
                                    <div className="mt-0.5 sm:mt-1 px-1 sm:px-2 text-[10px] sm:text-xs text-gray-500">
                                      {chat.remarkedAt && new Date(chat.remarkedAt).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>

                                    {/* Agent Contact Info - Hidden on mobile */}
                                    {chat.assignedTo && (
                                      <div className="hidden sm:flex flex-wrap items-center gap-2 mt-2 px-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-1">
                                          <Mail className="w-3 h-3" />
                                          <span>{chat.assignedTo.email}</span>
                                        </div>
                                        {chat.assignedTo.mobile && (
                                          <div className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            <span>{chat.assignedTo.mobile}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.chatDetails}</p>
                      </div>
                    )}
                  </div>

                  {/* Conversation Legend */}
                  {Array.isArray(selectedTicket.chatDetails) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                          <span>Your messages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#25B181] to-[#1F8F68]"></div>
                          <span>Support team responses</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Section - Show for OPEN/REOPENED tickets */}
                {canReplyToTicket(selectedTicket.status) && (
                  <>
                    {!showReopenForm && (
                      <div className="mb-6">
                        <button
                          onClick={() => setShowReopenForm(true)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-[#4A66FF] to-[#6C63FF] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
                        >
                          <Send className="w-5 h-5" />
                          Reply to Ticket
                        </button>
                      </div>
                    )}

                    {showReopenForm && (
                      <div className="mb-6">
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Send Reply
                            </h4>
                            <button
                              onClick={() => {
                                setShowReopenForm(false);
                                setReopenDescription('');
                                setReopenError('');
                              }}
                              className="p-1 hover:bg-blue-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                          <p className="text-xs text-blue-700 mb-3">
                            Add more details or ask follow-up questions about your ticket.
                          </p>
                          <form onSubmit={handleSendReply}>
                            <textarea
                              value={reopenDescription}
                              onChange={(e) => setReopenDescription(e.target.value)}
                              required
                              rows={4}
                              placeholder="Type your message here..."
                              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none mb-3"
                            />

                            {/* Document Upload for Reply */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowReplyUpload(!showReplyUpload);
                                    if (showReplyUpload) setReplyFiles([]);
                                  }}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${showReplyUpload ? 'bg-blue-500' : 'bg-gray-300'}`}
                                >
                                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${showReplyUpload ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                                </button>
                                <span className="text-xs text-blue-700">Attach documents</span>
                              </div>

                              {showReplyUpload && (
                                <>
                                  <div
                                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${replyDragging
                                      ? 'border-blue-500 bg-blue-100'
                                      : 'border-blue-300 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-100'
                                    }`}
                                    onDragEnter={handleReplyDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleReplyDragLeave}
                                    onDrop={handleReplyDrop}
                                  >
                                    <input
                                      type="file"
                                      id="replyFileInput"
                                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                      multiple
                                      onChange={handleReplyFileChange}
                                      className="hidden"
                                    />
                                    <label htmlFor="replyFileInput" className="cursor-pointer">
                                      <Upload className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                                      <p className="text-xs text-blue-700"><strong>Click to upload</strong> or drag and drop</p>
                                      <span className="text-[10px] text-blue-500">PDF, JPG, PNG, DOC (Max 5MB)</span>
                                    </label>
                                  </div>
                                  {replyFiles.length > 0 && (
                                    <div className="mt-1.5 space-y-1">
                                      {replyFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-1.5 px-2.5 bg-white rounded text-xs border border-blue-100">
                                          <div className="flex items-center gap-1.5">
                                            <FileIcon size={12} className="text-blue-500" />
                                            <span className="truncate max-w-[180px]">{file.name}</span>
                                            <span className="text-[10px] text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => setReplyFiles(replyFiles.filter((_, i) => i !== index))}
                                            className="text-red-500 hover:text-red-700 text-sm leading-none p-0.5"
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

                            {reopenError && (
                              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {reopenError}
                              </div>
                            )}
                            <button
                              type="submit"
                              disabled={reopenLoading}
                              className="w-full px-4 py-2 bg-[#4A66FF] text-white rounded-lg hover:bg-[#4A66FF]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                            >
                              {reopenLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Send Reply
                                </>
                              )}
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Closed Ticket Section - Show "Reopen Ticket" button */}
                {isTicketClosed(selectedTicket.status) && (
                  <div className="mb-6">
                    {/* Closed Message */}
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">This ticket is closed</p>
                          <p className="text-sm text-gray-600">Click &quot;Reopen Ticket&quot; if you need further assistance.</p>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {reopenError && (
                      <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {reopenError}
                      </div>
                    )}

                    {/* Reopen Button - Direct action, no form */}
                    <button
                      onClick={handleReopenTicket}
                      disabled={reopenLoading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
                    >
                      {reopenLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Reopening...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5" />
                          Reopen Ticket
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Assigned To */}
                {/* {selectedTicket.assignedDetails && selectedTicket.assignedDetails.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#4A66FF]" />
                      Assigned To
                    </h4>
                    <div className="space-y-3">
                      {selectedTicket.assignedDetails.map((assignment) => (
                        <div key={assignment._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{assignment.assignedTo.fullName}</p>
                              <p className="text-sm text-gray-600">{assignment.assignedTo.email}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(assignment.assignedAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Additional Remarks (Global ticket remarks not tied to specific messages) */}
                {selectedTicket.remarks && selectedTicket.remarks.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#4A66FF]" />
                      Additional Notes ({selectedTicket.remarks.length})
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">General remarks and notes added to this ticket</p>
                    <div className="space-y-3">
                      {selectedTicket.remarks.map((remark) => (
                        <div key={remark._id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-gray-800 mb-2 font-medium">{remark.text}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(remark.remarkedAt).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {remark.addedBy && (
                              <>
                                <span className="mx-1">•</span>
                                <User className="w-3 h-3" />
                                <span>Agent ID: {remark.addedBy.slice(-8)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAFAFA] rounded-lg p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-[#4A66FF] mr-2" />
                      <span className="text-sm font-medium text-gray-600">Created</span>
                    </div>
                    <p className="text-sm text-[#1F8F68] font-semibold">
                      {new Date(selectedTicket.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* <div className="bg-[#FAFAFA] rounded-lg p-4 border border-[#E0E0E0]">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-[#4A66FF] mr-2" />
                      <span className="text-sm font-medium text-gray-600">Last Updated</span>
                    </div>
                    <p className="text-sm text-[#1F8F68] font-semibold">
                      {new Date(selectedTicket.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#FAFAFA] px-6 py-4 border-t border-[#E0E0E0] flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
