'use client';

import { useState, useEffect, useRef, DragEvent, ChangeEvent, use } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'nextjs-toploader/app';
import {
  MessageSquare, RefreshCw, Send, AlertCircle,
  CheckCircle, CheckCheck, Clock, X, Mail, Phone,
  Upload, File as FileIcon, Download, ZoomIn, ArrowLeft, Calendar
} from 'lucide-react';
import useAxios from '@/hooks/useAxios';
import { useSupport } from '@/store/hooks/useSupport';
import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/Skeleton';

interface SupportTicketDetail {
  _id: string;
  ticketNumber: string;
  customerId: {
    _id: string;
    email: string;
    fullName: string;
    mobile?: string;
  } | string;
  category: string;
  subject: string;
  status: string;
  chatDetails: Array<{
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
  assignedDetails?: Array<{
    assignedTo: { _id: string; fullName: string; email: string; mobile?: string };
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
  closedAt?: string;
  closedReason?: string;
}

export default function SupportTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const axios = useAxios();
  const { fetchSupportTickets } = useSupport();

  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyDragging, setReplyDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState('');

  // Reopen state
  const [reopening, setReopening] = useState(false);

  // Resolve state
  const [resolving, setResolving] = useState(false);
  const [confirmResolve, setConfirmResolve] = useState(false);

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState('');

  // Scroll refs
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  // ===== Helpers =====
  const isImageAttachment = (mime?: string) =>
    !!mime && mime.toLowerCase().startsWith('image/');

  const formatBytes = (bytes?: number) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const dayKey = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };

  const formatDayLabel = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString('en-IN', { weekday: 'long' });
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'LOAN_INQUIRY': return 'text-[#6C63FF] bg-[#6C63FF]/10';
      case 'PAYMENT_ISSUE': return 'text-[#FF6B6B] bg-[#FF6B6B]/10';
      case 'GENERAL_INQUIRY': return 'text-[#25B181] bg-[#25B181]/10';
      case 'TECHNICAL_ISSUE': return 'text-[#4A66FF] bg-[#4A66FF]/10';
      case 'KYC_VERIFICATION': return 'text-[#FFC107] bg-[#FFC107]/10';
      case 'DOCUMENT_UPLOAD': return 'text-[#00B8D9] bg-[#00B8D9]/10';
      case 'ACCOUNT_ACCESS': return 'text-[#8E44AD] bg-[#8E44AD]/10';
      case 'COMPLAINT': return 'text-red-600 bg-red-100';
      case 'BILLING': return 'text-[#FF9C70] bg-[#FF9C70]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
      case 'IN_PROGRESS':
        return 'text-[#4A66FF] bg-[#4A66FF]/10';
      case 'REOPENED': return 'text-orange-600 bg-orange-100';
      case 'RESOLVED':
      case 'CLOSED':
        return 'text-[#25B181] bg-[#25B181]/10';
      case 'PENDING': return 'text-[#FF9C70] bg-[#FF9C70]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const canReply = (status: string) => {
    const s = status?.toUpperCase();
    return s === 'OPEN' || s === 'REOPENED' || s === 'IN_PROGRESS' || s === 'PENDING';
  };

  const isClosed = (status: string) => {
    const s = status?.toUpperCase();
    return s === 'CLOSED' || s === 'RESOLVED';
  };

  // ===== Data =====
  const fetchTicket = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      const response = await axios.get(`/api/supportTicket/get/${id}`);
      const result = response.data;
      if ((response.status === 200 || response.status === 201) && result.success && result.data) {
        setTicket(result.data);
      } else {
        setError(result.message || 'Failed to load ticket');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-scroll to bottom when messages change
  const chatCount = ticket?.chatDetails?.length || 0;
  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [chatCount, ticket?._id]);

  // Lightbox Escape
  useEffect(() => {
    if (!lightboxUrl) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxUrl(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxUrl]);

  // ===== File handling =====
  const validateFiles = (files: File[], existing: File[]): File[] => {
    const valid: File[] = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setReplyError(`${file.name} exceeds 5MB limit.`);
        return;
      }
      const allowed = [
        'application/pdf', 'image/jpeg', 'image/jpg', 'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowed.includes(file.type)) {
        setReplyError(`${file.name} is not a supported file type.`);
        return;
      }
      valid.push(file);
    });
    return [...existing, ...valid];
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReplyFiles(validateFiles(files, replyFiles));
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setReplyDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setReplyDragging(false);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setReplyDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setReplyFiles(validateFiles(files, replyFiles));
  };

  // ===== Actions =====
  const handleSendReply = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!ticket || !replyText.trim()) {
      setReplyError('Please enter a message');
      return;
    }
    setReplyError('');
    setSending(true);
    try {
      let response;
      if (replyFiles.length > 0) {
        const payload = new FormData();
        payload.append('description', replyText.trim());
        replyFiles.forEach((f) => payload.append('photo', f));
        response = await axios.patch(
          `/api/supportTicket/update/${ticket._id}`,
          payload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        response = await axios.patch(
          `/api/supportTicket/update/${ticket._id}`,
          { description: replyText.trim() },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      const result = response.data;
      if ((response.status === 200 || response.status === 201) && result.success) {
        setReplyText('');
        setReplyFiles([]);
        await fetchTicket(true);
        fetchSupportTickets();
      } else {
        setReplyError(result.message || 'Failed to send reply');
      }
    } catch (err: any) {
      setReplyError(err?.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setSending(false);
    }
  };

  const handleReopen = async () => {
    if (!ticket) return;
    setReplyError('');
    setReopening(true);
    try {
      const response = await axios.patch(
        `/api/supportTicket/update/${ticket._id}`,
        { status: 'REOPENED' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const result = response.data;
      if ((response.status === 200 || response.status === 201) && result.success) {
        await fetchTicket(true);
        fetchSupportTickets();
      } else {
        setReplyError(result.message || 'Failed to reopen ticket');
      }
    } catch (err: any) {
      setReplyError(err?.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setReopening(false);
    }
  };

  const handleResolve = async () => {
    if (!ticket) return;
    setReplyError('');
    setResolving(true);
    try {
      const response = await axios.patch(
        `/api/supportTicket/update/${ticket._id}`,
        { status: 'CLOSED' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const result = response.data;
      if ((response.status === 200 || response.status === 201) && result.success) {
        setConfirmResolve(false);
        await fetchTicket(true);
        fetchSupportTickets();
      } else {
        setReplyError(result.message || 'Failed to mark as resolved');
      }
    } catch (err: any) {
      setReplyError(err?.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setResolving(false);
    }
  };

  // ===== Render =====
  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header skeleton */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SkeletonCircle size={36} />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-9 w-10 sm:w-28" rounded="lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:h-[calc(100vh-10rem)] min-h-[500px]">
          {/* Sidebar skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-5">
            <div className="space-y-2.5 pb-4 border-b border-gray-200">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-32" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-20" rounded="full" />
                <Skeleton className="h-6 w-28" rounded="full" />
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-[#FAFBFC] rounded-lg border border-gray-200">
              <SkeletonCircle size={36} />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full" rounded="lg" />
          </div>

          {/* Chat skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <SkeletonCircle size={40} />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" rounded="full" />
            </div>
            <div className="flex-1 p-4 space-y-3 bg-[#F4F7F6]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex items-end gap-2 max-w-[76%] ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    <SkeletonCircle size={28} />
                    <div className="space-y-1.5">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className={`h-10 ${i % 2 === 0 ? 'w-56' : 'w-40'}`} rounded="2xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 p-3">
              <Skeleton className="h-11 w-full" rounded="2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-4 sm:p-6">
        <button
          onClick={() => router.push('/user/support')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#25B181] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tickets
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {error || 'Ticket not found'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">We couldn't load this ticket. Please try again.</p>
          <button
            onClick={() => fetchTicket()}
            className="px-4 py-2 bg-[#4A66FF] text-white rounded-lg hover:bg-[#4A66FF]/90 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-5 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => router.push('/user/support')}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-[#25B181] hover:border-[#25B181] flex items-center justify-center transition-colors shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-[#1F8F68] truncate">
            {ticket.ticketNumber || `TCKT-${ticket._id.slice(-8).toUpperCase()}`}
          </h1>
        </div>
        <button
          onClick={() => fetchTicket(true)}
          disabled={refreshing}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </motion.div>

      {/* Two-column body */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:h-[calc(100vh-10rem)] min-h-[500px]"
      >
        {/* LEFT sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-y-auto p-4 sm:p-5">
            <div className="space-y-5">
              {/* Subject + Ticket ID + Status + Category */}
              <div className="pb-4 border-b border-gray-200">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</p>
                <h4 className="text-base font-semibold text-gray-900 leading-snug mb-2">
                  {ticket.subject}
                </h4>
                <p className="text-xs font-medium text-gray-500 mb-2.5">
                  {ticket.ticketNumber || `TCKT-${ticket._id.slice(-8).toUpperCase()}`}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status || 'OPEN'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                    {ticket.category.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Assigned agent */}
              {ticket.assignedDetails && ticket.assignedDetails.length > 0 && (() => {
                const latest = ticket.assignedDetails[ticket.assignedDetails.length - 1];
                return (
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Assigned To</p>
                    <div className="flex items-center gap-2.5 p-2.5 bg-[#FAFBFC] rounded-lg border border-gray-200">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#25B181] to-[#1F8F68] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {latest.assignedTo.fullName?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{latest.assignedTo.fullName}</p>
                        <p className="text-[10px] text-gray-500 truncate">{latest.assignedTo.email}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Created */}
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Created</p>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-[#4A66FF]" />
                  <span>
                    {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Close Ticket (active tickets only) */}
              {canReply(ticket.status) && (
                <div className="pt-4 border-t border-gray-200">
                  {!confirmResolve ? (
                    <button
                      onClick={() => setConfirmResolve(true)}
                      disabled={resolving}
                      className="w-full px-3 py-2 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 font-semibold text-xs disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      CLOSE TICKET
                    </button>
                  ) : (
                    <div className="p-3 bg-[#25B181]/5 border border-[#25B181]/20 rounded-lg">
                      <p className="text-xs font-semibold text-gray-800 mb-1">Close this ticket?</p>
                      <p className="text-[11px] text-gray-600 mb-2.5">
                        Mark your query as resolved. You can reopen it later if needed.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmResolve(false)}
                          disabled={resolving}
                          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleResolve}
                          disabled={resolving}
                          className="flex-1 px-3 py-1.5 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-1.5 text-xs font-semibold disabled:opacity-50"
                        >
                          {resolving ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Closing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Confirm
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Closed notice + reopen */}
              {isClosed(ticket.status) && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 p-3 bg-gray-100 border border-gray-200 rounded-lg mb-2.5">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Ticket closed</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">Reopen if you need further assistance.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReopen}
                    disabled={reopening}
                    className="w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 font-semibold text-xs disabled:opacity-50"
                  >
                    {reopening ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        REOPENING...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        REOPEN
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Remarks (legacy) */}
              {ticket.remarks && ticket.remarks.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Additional Notes ({ticket.remarks.length})
                  </p>
                  <div className="space-y-2">
                    {ticket.remarks.map((remark) => (
                      <div key={remark._id} className="bg-[#FAFBFC] rounded-lg p-2.5 border border-gray-200">
                        <p className="text-xs text-gray-800 font-medium leading-relaxed">{remark.text}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(remark.remarkedAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT chat panel */}
          <section className="flex flex-col min-h-[420px] lg:min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25B181] to-[#1F8F68] flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25B181] border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight truncate">Support Team</h4>
                  <p className="text-[11px] text-gray-500">
                    {`${ticket.chatDetails.length} ${ticket.chatDetails.length === 1 ? 'message' : 'messages'}`}
                    {refreshing && (
                      <span className="ml-1.5 inline-flex items-center gap-1 text-gray-400">
                        · <span className="inline-block w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin" /> refreshing
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#25B181] bg-[#25B181]/10 px-2.5 py-1 rounded-full flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25B181] animate-pulse" />
                {canReply(ticket.status) ? 'Active' : 'Closed'}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesScrollRef}
              className="flex-1 overflow-y-auto bg-[#F4F7F6] scroll-smooth"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,177,129,0.08) 1px, transparent 0)',
                backgroundSize: '22px 22px',
              }}
            >
              <div className="flex justify-center pt-3 pb-1 px-3">
                <div className="text-[10px] sm:text-[11px] font-medium bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 px-3 py-1 rounded-full shadow-sm">
                  Ticket opened · {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </div>
              </div>

              <div className="space-y-2 px-2 sm:px-3 pb-4 pt-1">
                {ticket.chatDetails.length > 0 ? (
                  ticket.chatDetails.map((chat, idx) => {
                    const customerId = typeof ticket.customerId === 'object' ? ticket.customerId._id : ticket.customerId;
                    const isCustomer =
                      chat.addedBy?.role?.toUpperCase() === 'CUSTOMER' ||
                      chat.addedByModel?.toLowerCase() === 'customer' ||
                      chat.addedBy?._id === customerId;
                    const senderName = isCustomer
                      ? 'You'
                      : (chat.addedBy?.fullName || chat.assignedTo?.fullName || 'Support');
                    const initial = isCustomer
                      ? 'Y'
                      : (chat.addedBy?.fullName?.charAt(0).toUpperCase() ||
                         chat.assignedTo?.fullName?.charAt(0).toUpperCase() || 'S');
                    const attachments = chat.attachments || [];
                    const images = attachments.filter(a => isImageAttachment(a.mimeType));
                    const files = attachments.filter(a => !isImageAttachment(a.mimeType));
                    const hasText = !!chat.message && chat.message.trim() !== '';

                    const prev = ticket.chatDetails[idx - 1];
                    const showDaySeparator = !prev || dayKey(prev.addedAt) !== dayKey(chat.addedAt);

                    return (
                      <div key={chat._id} className="space-y-2">
                        {showDaySeparator && (
                          <div className="flex justify-center my-2">
                            <span className="text-[10px] sm:text-[11px] font-semibold bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 px-3 py-1 rounded-full shadow-sm">
                              {formatDayLabel(chat.addedAt)}
                            </span>
                          </div>
                        )}

                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`flex ${isCustomer ? 'flex-row' : 'flex-row-reverse'} items-end gap-1.5 sm:gap-2 max-w-[88%] sm:max-w-[76%]`}>
                            <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[11px] sm:text-xs font-bold shadow-sm ${isCustomer
                                ? 'bg-gradient-to-br from-[#4A66FF] to-[#6C63FF]'
                                : 'bg-gradient-to-br from-[#25B181] to-[#1F8F68]'
                              }`}>
                              {initial}
                            </div>

                            <div className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} min-w-0`}>
                              <span className={`text-[10px] sm:text-[11px] font-semibold mb-0.5 px-1 ${isCustomer ? 'text-[#4A66FF]' : 'text-[#1F8F68]'}`}>
                                {senderName}
                              </span>

                              <div className={`relative shadow-sm ${images.length > 0 ? 'p-1' : 'px-3 sm:px-3.5 py-2'} ${isCustomer
                                  ? 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm'
                                  : 'bg-gradient-to-br from-[#25B181] to-[#1F8F68] text-white rounded-2xl rounded-br-sm'
                                }`}>
                                {images.length > 0 && (
                                  <div className={`${images.length > 1 ? 'grid grid-cols-2 gap-1' : ''} ${hasText || files.length > 0 ? 'mb-1' : ''}`}>
                                    {images.map((img) => (
                                      <button
                                        key={img._id || img.s3URL}
                                        type="button"
                                        onClick={() => {
                                          setLightboxUrl(img.s3URL);
                                          setLightboxName(img.originalName || 'Image');
                                        }}
                                        className="group relative block overflow-hidden rounded-xl focus:outline-none"
                                      >
                                        <img
                                          src={img.s3URL}
                                          alt={img.originalName || 'attachment'}
                                          loading="lazy"
                                          className={`block object-cover w-full ${images.length > 1 ? 'h-28 sm:h-32' : 'max-w-[240px] sm:max-w-[280px] max-h-[260px]'}`}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {files.length > 0 && (
                                  <div className={`space-y-1 ${hasText ? 'mb-1.5' : ''} ${images.length > 0 ? 'px-2 pt-1' : ''}`}>
                                    {files.map((f) => (
                                      <a
                                        key={f._id || f.s3URL}
                                        href={f.s3URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${isCustomer
                                            ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800'
                                            : 'bg-white/15 hover:bg-white/25 border border-white/20 text-white'
                                          }`}
                                      >
                                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${isCustomer ? 'bg-[#4A66FF]/10 text-[#4A66FF]' : 'bg-white/20 text-white'}`}>
                                          <FileIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="truncate font-medium">{f.originalName || 'File'}</p>
                                          <p className={`text-[10px] ${isCustomer ? 'text-gray-500' : 'text-white/70'}`}>
                                            {formatBytes(f.size)}
                                          </p>
                                        </div>
                                        <Download className={`w-3.5 h-3.5 ${isCustomer ? 'text-gray-400' : 'text-white/80'}`} />
                                      </a>
                                    ))}
                                  </div>
                                )}

                                {hasText && (
                                  <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${images.length > 0 ? 'px-2 pb-1' : ''}`}>
                                    {chat.message}
                                  </p>
                                )}

                                <div className={`flex items-center justify-end gap-1 text-[10px] ${images.length > 0 ? 'px-2 pb-1' : 'mt-0.5'} ${isCustomer ? 'text-gray-400' : 'text-white/80'}`}>
                                  <span>
                                    {new Date(chat.addedAt).toLocaleTimeString('en-IN', {
                                      hour: '2-digit', minute: '2-digit'
                                    })}
                                  </span>
                                  {!isCustomer && <CheckCheck className="w-3 h-3" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Legacy support remarks */}
                        {chat.remarks && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18 }}
                            className="flex justify-end"
                          >
                            <div className="flex flex-row-reverse items-end gap-2 max-w-[88%] sm:max-w-[78%]">
                              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[11px] sm:text-xs font-bold shadow-sm bg-gradient-to-br from-[#25B181] to-[#1F8F68]">
                                {chat.assignedTo?.fullName?.charAt(0).toUpperCase() || 'S'}
                              </div>
                              <div className="flex flex-col items-end min-w-0">
                                <span className="text-[10px] sm:text-[11px] font-semibold mb-0.5 px-1 text-[#1F8F68]">
                                  {chat.assignedTo?.fullName || 'Support'}
                                </span>
                                <div className="relative px-3 sm:px-3.5 py-2 shadow-sm bg-gradient-to-br from-[#25B181] to-[#1F8F68] text-white rounded-2xl rounded-br-sm">
                                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {chat.remarks}
                                  </p>
                                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-white/80">
                                    <span>
                                      {chat.remarkedAt && new Date(chat.remarkedAt).toLocaleTimeString('en-IN', {
                                        hour: '2-digit', minute: '2-digit'
                                      })}
                                    </span>
                                    <CheckCheck className="w-3 h-3" />
                                  </div>
                                </div>
                                {chat.assignedTo && (
                                  <div className="hidden sm:flex flex-wrap items-center gap-2 mt-1.5 px-1 text-[10px] text-gray-500">
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
                          </motion.div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
                      <MessageSquare className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">No messages yet</p>
                    <p className="text-xs text-gray-500 mt-0.5">Your conversation will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compose */}
            {canReply(ticket.status) ? (
              <div
                className="border-t border-gray-200 bg-white px-3 sm:px-4 py-3"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {replyDragging && (
                  <div className="mb-2 p-3 border-2 border-dashed border-[#25B181] bg-[#25B181]/10 rounded-lg text-center text-xs font-medium text-[#1F8F68]">
                    Drop files to attach
                  </div>
                )}
                <form onSubmit={handleSendReply} className="space-y-2">
                  {replyFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {replyFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-[#4A66FF]/10 border border-[#4A66FF]/20 rounded-full text-[11px]">
                          <FileIcon size={11} className="text-[#4A66FF]" />
                          <span className="truncate max-w-[140px] text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setReplyFiles(replyFiles.filter((_, i) => i !== index))}
                            className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
                            aria-label="Remove file"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {replyError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {replyError}
                    </div>
                  )}

                  <div className="flex items-end gap-2 bg-[#F4F7F6] border border-gray-200 rounded-2xl px-2 py-1.5 focus-within:border-[#25B181] focus-within:ring-2 focus-within:ring-[#25B181]/20 transition-colors">
                    <input
                      type="file"
                      id="replyFileInput"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="replyFileInput"
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-[#25B181] hover:bg-[#25B181]/10 cursor-pointer transition-colors"
                      title="Attach file"
                    >
                      <Upload className="w-4 h-4" />
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (replyText.trim() && !sending) {
                            handleSendReply(e);
                          }
                        }
                      }}
                      required
                      rows={1}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400 py-1.5 max-h-32 min-h-[28px]"
                    />
                    <button
                      type="submit"
                      disabled={sending || !replyText.trim()}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#25B181] to-[#1F8F68] text-white flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      aria-label="Send"
                    >
                      {sending ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 px-1">Press Enter to send · Shift+Enter for new line · or drag files to attach</p>
                </form>
              </div>
            ) : (
              <div className="border-t border-gray-200 bg-white px-4 py-3 text-center text-xs text-gray-500">
                This ticket is closed. Reopen it from the panel on the left to continue the conversation.
              </div>
            )}
          </section>
      </motion.div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxUrl(null); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
          <a
            href={lightboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={lightboxName}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={lightboxUrl}
            alt={lightboxName}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[92vw] rounded-lg shadow-2xl object-contain"
          />
          {lightboxName && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs truncate max-w-[80vw]">
              {lightboxName}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
