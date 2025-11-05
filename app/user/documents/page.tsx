'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Download, Share2, Trash2, CheckCircle,
  XCircle, Clock, Eye, AlertCircle, Plus, FolderOpen, RefreshCw
} from 'lucide-react';
import { toast, Toaster } from '@/components/ui/toast';

interface Document {
  id: string;
  type: string;
  url: string;
  key: string;
  status: string;
  uploadDate: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState<{ [key: string]: boolean }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; doc: Document | null }>({
    show: false,
    doc: null
  });

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.bluechipfinmax.com/api/document/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const flatDocs = flattenDocuments(data.documents || []);
        setDocuments(flatDocs);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch documents');
      }
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  // Flatten documents from API response
  const flattenDocuments = (docs: any[]): Document[] => {
    const flattened: Document[] = [];

    docs.forEach((docGroup) => {
      Object.keys(docGroup).forEach((key) => {
        if (key !== '_id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
          const doc = docGroup[key];
          if (doc && doc.url) {
            flattened.push({
              id: docGroup._id + '_' + key,
              type: key,
              url: doc.url,
              key: doc.key || key,
              status: doc.status || 'PENDING',
              uploadDate: docGroup.createdAt || new Date().toISOString()
            });
          }
        }
      });
    });

    return flattened;
  };

  // Required document types (from apply form)
  const requiredDocumentTypes = [
    { value: 'pan', label: 'PAN Card', icon: '🆔' },
    { value: 'aadhar', label: 'Aadhaar Card', icon: '🆔' },
    { value: 'salarySlip', label: 'Salary Slips', icon: '💰' },
    { value: 'bankStatement', label: 'Bank Statement', icon: '🏦' }
  ];

  // Get document type label
  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      aadhar: 'Aadhaar Card',
      pan: 'PAN Card',
      voterId: 'Voter ID',
      salarySlip: 'Salary Slip',
      bankStatement: 'Bank Statement',
      passport: 'Passport',
      utilityBill: 'Utility Bill',
      rentAgreement: 'Rent Agreement',
      form16: 'Form 16',
      itr: 'ITR'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get combined list of uploaded and missing documents
  const getAllDocuments = () => {
    const uploadedTypes = documents.map(doc => doc.type);
    const combined: (Document | { type: string; missing: boolean })[] = [];

    requiredDocumentTypes.forEach(docType => {
      const uploadedDoc = documents.find(doc => doc.type === docType.value);
      if (uploadedDoc) {
        combined.push(uploadedDoc);
      } else {
        combined.push({ type: docType.value, missing: true });
      }
    });

    return combined;
  };

  const combinedDocuments = getAllDocuments();

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: any } = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        label: 'Pending'
      },
      VERIFIED: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        label: 'Verified'
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        label: 'Approved'
      },
      REJECTED: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        label: 'Rejected'
      },
      NOT_UPLOADED: {
        icon: AlertCircle,
        color: 'text-gray-600',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/20',
        label: 'Not Uploaded'
      }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const StatusIcon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Get category icon
  const getCategoryIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      aadhar: '🆔',
      pan: '🆔',
      voterId: '🆔',
      passport: '🆔',
      salarySlip: '💰',
      form16: '💰',
      itr: '💰',
      bankStatement: '🏦',
      utilityBill: '📍',
      rentAgreement: '📍'
    };
    return icons[type] || '📄';
  };

  // Calculate statistics
  const statistics = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'APPROVED' || d.status === 'VERIFIED').length,
    pending: documents.filter(d => d.status === 'PENDING').length,
    rejected: documents.filter(d => d.status === 'REJECTED').length
  };

  // Handle download
  const handleDownload = async (doc: Document) => {
    try {
      // Get file extension from URL or default to pdf
      const urlParts = doc.url.split('.');
      const extension = urlParts[urlParts.length - 1].split('?')[0] || 'pdf';
      const fileName = `${getDocumentTypeLabel(doc.type)}.${extension}`;

      // Use fetch with proxy to download the file
      try {
        const response = await fetch(doc.url, {
          method: 'GET',
          mode: 'cors'
        });

        if (!response.ok) throw new Error('Fetch failed');

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(blobUrl);

        toast({
          title: 'Success',
          description: 'Document downloaded successfully',
          variant: 'success'
        });
      } catch (fetchError) {
        // If fetch fails due to CORS, open in new tab as fallback
        console.log('Direct download failed, opening in new tab:', fetchError);
        window.open(doc.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download Failed',
        description: 'Unable to download document. Please try again.',
        variant: 'error'
      });
    }
  };

  // Handle share
  const handleShare = async (doc: Document) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: getDocumentTypeLabel(doc.type),
          text: `Check out this document: ${getDocumentTypeLabel(doc.type)}`,
          url: doc.url
        });
        toast({
          title: 'Success',
          description: 'Document shared successfully',
          variant: 'success'
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(doc.url);
        toast({
          title: 'Link Copied',
          description: 'Document link copied to clipboard',
          variant: 'success'
        });
      }
    } catch (error) {
      // User cancelled share - don't show error
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: 'Share Failed',
          description: 'Unable to share document',
          variant: 'error'
        });
      }
    }
  };

  // Handle delete - show confirmation modal
  const handleDelete = (doc: Document) => {
    setDeleteConfirm({ show: true, doc });
  };

  // Confirm and execute delete
  const confirmDelete = async () => {
    const doc = deleteConfirm.doc;
    if (!doc) return;

    // Close modal
    setDeleteConfirm({ show: false, doc: null });

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to delete documents',
          variant: 'warning'
        });
        return;
      }

      const response = await fetch('https://api.bluechipfinmax.com/api/document/delete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          docType: doc.type
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove document from local state
        setDocuments(docs => docs.filter(d => d.id !== doc.id));
        toast({
          title: 'Success',
          description: `${getDocumentTypeLabel(doc.type)} deleted successfully`,
          variant: 'success'
        });
      } else {
        toast({
          title: 'Delete Failed',
          description: result.message || 'Failed to delete document',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document. Please try again.',
        variant: 'error'
      });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ show: false, doc: null });
  };

  // Handle file upload for missing documents
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: 'File size exceeds 5MB. Please upload a smaller file.',
        variant: 'warning'
      });
      return;
    }

    try {
      setUploadingDocs(prev => ({ ...prev, [docType]: true }));
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to upload documents',
          variant: 'warning'
        });
        return;
      }

      const formData = new FormData();
      formData.append(docType, file);

      const response = await fetch('https://api.bluechipfinmax.com/api/document/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
          variant: 'success'
        });
        // Refresh documents list
        await fetchDocuments();
      } else {
        toast({
          title: 'Upload Failed',
          description: result.message || 'Failed to upload document',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document. Please try again.',
        variant: 'error'
      });
    } finally {
      setUploadingDocs(prev => ({ ...prev, [docType]: false }));
      // Reset file input
      event.target.value = '';
    }
  };

  // Initialize
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Loading state
  if (loading && documents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Documents</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={fetchDocuments}
          className="px-6 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B5E20]">
            Documents
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload and manage your loan documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Progress:</span>
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#E0E0E0]">
            <span className="text-lg font-bold text-[#2E7D32]">
              {documents.filter(d => requiredDocumentTypes.some(rt => rt.value === d.type)).length}/4
            </span>
            {documents.filter(d => requiredDocumentTypes.some(rt => rt.value === d.type)).length === 4 && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">Total</span>
            <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#1B5E20]">{statistics.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-green-600 font-medium">Approved</span>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{statistics.approved}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-yellow-600 font-medium">Pending</span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{statistics.pending}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-red-600 font-medium">Rejected</span>
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">{statistics.rejected}</p>
        </motion.div>
      </div>

      {/* Documents Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {combinedDocuments.map((item, index) => {
          const isMissing = 'missing' in item && item.missing;
          const doc = isMissing ? null : (item as Document);

          return isMissing ? (
            // Upload Card for Missing Document
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-[#2E7D32] transition-all"
            >
              <div className="p-6 text-center">
                <div className="mb-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  {getDocumentTypeLabel(item.type)}
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Click to upload
                </p>

                <input
                  type="file"
                  id={`upload-${item.type}`}
                  onChange={(e) => handleFileSelect(e, item.type)}
                  className="hidden"
                  accept="image/*,application/pdf"
                  disabled={uploadingDocs[item.type]}
                />
                <label
                  htmlFor={`upload-${item.type}`}
                  className={`block px-4 py-2 bg-[#2E7D32] text-white text-sm rounded-lg hover:bg-[#1B5E20] transition-colors cursor-pointer ${
                    uploadingDocs[item.type] ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingDocs[item.type] ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    'Choose File'
                  )}
                </label>
              </div>
            </motion.div>
          ) : (
            // Uploaded Document Card
            <motion.div
              key={doc!.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Document Preview */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={doc!.url}
                  alt={getDocumentTypeLabel(doc!.type)}
                  className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => window.open(doc!.url, '_blank')}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-[#E8F5E9]', 'to-[#C8E6C9]');
                    const fallback = document.createElement('div');
                    fallback.className = 'text-5xl';
                    fallback.textContent = getCategoryIcon(doc!.type);
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(doc!.status)}
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => window.open(doc!.url, '_blank')}
                    className="px-4 py-2 bg-white text-[#1B5E20] rounded-lg font-medium shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View Full
                  </button>
                </div>
              </div>

              {/* Document Info */}
              <div className="p-4">
                <h4 className="text-base font-semibold text-[#1B5E20] mb-1 truncate">
                  {getDocumentTypeLabel(doc!.type)}
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(doc!.uploadDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(doc!.url, '_blank')}
                    className="flex-1 px-3 py-2 bg-[#1976D2]/10 text-[#1976D2] rounded-lg hover:bg-[#1976D2]/20 transition-colors text-sm font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(doc!)}
                    className="p-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare(doc!)}
                    className="p-2 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc!)}
                    className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Toast Notifications */}
      <Toaster />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && deleteConfirm.doc && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Document?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{getDocumentTypeLabel(deleteConfirm.doc.type)}</strong>? This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
