'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Image, File, Download, Share2, Eye, Trash2,
  CheckCircle, XCircle, Clock, Filter, Search, Calendar,
  ChevronLeft, ChevronRight, MoreVertical, Shield, Upload,
  FolderOpen, Grid, List
} from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  thumbnailUrl?: string;
  tags: string[];
  sharedWith: string[];
}

interface DocumentListProps {
  userId?: string;
  isAdmin?: boolean;
  onDocumentClick?: (document: Document) => void;
  onDownload?: (documentId: string) => void;
  onShare?: (documentId: string) => void;
  onDelete?: (documentId: string) => void;
  onVerify?: (documentId: string, status: 'verified' | 'rejected') => void;
}

export function DocumentList({
  userId,
  isAdmin = false,
  onDocumentClick,
  onDownload,
  onShare,
  onDelete,
  onVerify
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchDocuments();
  }, [userId, selectedCategory, selectedStatus, searchQuery, currentPage]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      // Get auth token
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.bluechipfinmax.com/api/document/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.documents && data.documents.length > 0) {
        const docData = data.documents[0]; // Get first document object

        // Map API response to Document format
        const mappedDocuments: Document[] = [];

        // Add Aadhar if exists
        if (docData.aadhar?.key || docData.aadhar?.url) {
          mappedDocuments.push({
            id: 'aadhar',
            fileName: 'Aadhaar Card',
            fileType: 'image',
            fileSize: 0,
            category: 'identity',
            status: docData.aadhar.status?.toLowerCase() as 'pending' | 'verified' | 'rejected' || 'pending',
            uploadedAt: docData.createdAt || new Date().toISOString(),
            thumbnailUrl: docData.aadhar.url,
            tags: ['identity', 'required'],
            sharedWith: []
          });
        }

        // Add PAN if exists
        if (docData.pan?.key || docData.pan?.url) {
          mappedDocuments.push({
            id: 'pan',
            fileName: 'PAN Card',
            fileType: 'image',
            fileSize: 0,
            category: 'identity',
            status: docData.pan.status?.toLowerCase() as 'pending' | 'verified' | 'rejected' || 'pending',
            uploadedAt: docData.createdAt || new Date().toISOString(),
            thumbnailUrl: docData.pan.url,
            tags: ['identity', 'required'],
            sharedWith: []
          });
        }

        // Add Voter ID if exists
        if (docData.voterId?.key || docData.voterId?.url) {
          mappedDocuments.push({
            id: 'voterId',
            fileName: 'Voter ID',
            fileType: 'image',
            fileSize: 0,
            category: 'identity',
            status: docData.voterId.status?.toLowerCase() as 'pending' | 'verified' | 'rejected' || 'pending',
            uploadedAt: docData.createdAt || new Date().toISOString(),
            thumbnailUrl: docData.voterId.url,
            tags: ['identity'],
            sharedWith: []
          });
        }

        // Add Salary Slip if exists
        if (docData.salarySlip?.key || docData.salarySlip?.url) {
          mappedDocuments.push({
            id: 'salarySlip',
            fileName: 'Salary Slip',
            fileType: 'pdf',
            fileSize: 0,
            category: 'income',
            status: docData.salarySlip.status?.toLowerCase() as 'pending' | 'verified' | 'rejected' || 'pending',
            uploadedAt: docData.createdAt || new Date().toISOString(),
            thumbnailUrl: docData.salarySlip.url,
            tags: ['income', 'required'],
            sharedWith: []
          });
        }

        // Add Bank Statement if exists
        if (docData.bankStatement?.key || docData.bankStatement?.url) {
          mappedDocuments.push({
            id: 'bankStatement',
            fileName: 'Bank Statement',
            fileType: 'pdf',
            fileSize: 0,
            category: 'bank_statement',
            status: docData.bankStatement.status?.toLowerCase() as 'pending' | 'verified' | 'rejected' || 'pending',
            uploadedAt: docData.createdAt || new Date().toISOString(),
            thumbnailUrl: docData.bankStatement.url,
            tags: ['bank', 'required'],
            sharedWith: []
          });
        }

        // Filter by category and status if selected
        let filteredDocs = mappedDocuments;
        if (selectedCategory) {
          filteredDocs = filteredDocs.filter(doc => doc.category === selectedCategory);
        }
        if (selectedStatus) {
          filteredDocs = filteredDocs.filter(doc => doc.status === selectedStatus);
        }
        if (searchQuery) {
          filteredDocs = filteredDocs.filter(doc =>
            doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setDocuments(filteredDocs);
        setTotalPages(1);
        setStatistics({
          total: mappedDocuments.length,
          verified: mappedDocuments.filter(d => d.status === 'verified').length,
          pending: mappedDocuments.filter(d => d.status === 'pending').length,
          rejected: mappedDocuments.filter(d => d.status === 'rejected').length
        });
      } else {
        setDocuments([]);
        setStatistics({ total: 0, verified: 0, pending: 0, rejected: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-[#2E7D32]" />;
      default:
        return <File className="w-5 h-5 text-[#1976D2]" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-[#2E7D32]" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-[#FBC02D]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-[#FFD700]/20 text-[#FBC02D] border-[#FBC02D]/20';
    }
  };

  const categories = [
    { id: 'identity', name: 'Identity', icon: '🆔' },
    { id: 'address', name: 'Address', icon: '📍' },
    { id: 'income', name: 'Income', icon: '💰' },
    { id: 'bank_statement', name: 'Bank', icon: '🏦' },
    { id: 'tax', name: 'Tax', icon: '📊' },
    { id: 'other', name: 'Other', icon: '📁' }
  ];

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer"
      onClick={() => onDocumentClick?.(doc)}
    >
      {/* Thumbnail or Icon */}
      <div className="h-32 bg-[#FAFAFA] flex items-center justify-center relative">
        {doc.thumbnailUrl ? (
          <img
            src={doc.thumbnailUrl}
            alt={doc.fileName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-6">
            {getFileIcon(doc.fileType)}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full border ${getStatusColor(doc.status)} backdrop-blur-sm flex items-center space-x-1`}>
            {getStatusIcon(doc.status)}
            <span className="text-xs capitalize">{doc.status}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h4 className="font-medium text-[#1B5E20] truncate mb-1">{doc.fileName}</h4>
        <p className="text-sm text-gray-600 mb-3">{formatFileSize(doc.fileSize)}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {doc.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-[#FAFAFA] border border-[#E0E0E0] text-xs text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
          {doc.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{doc.tags.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E0E0E0]">
          <span className="text-xs text-gray-500">
            {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
          </span>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {doc.sharedWith.length > 0 && (
              <div className="p-1.5 bg-[#1976D2]/10 rounded">
                <Share2 className="w-3 h-3 text-[#1976D2]" />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDocument(doc.id);
              }}
              className="p-1.5 hover:bg-[#FAFAFA] rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && doc.status === 'pending' && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-[#E0E0E0]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerify?.(doc.id, 'verified');
              }}
              className="flex-1 px-3 py-1.5 bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] rounded text-sm transition-colors"
            >
              Verify
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerify?.(doc.id, 'rejected');
              }}
              className="flex-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded text-sm transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Action Menu */}
      <AnimatePresence>
        {selectedDocument === doc.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-16 right-4 bg-white rounded-lg shadow-xl border border-[#E0E0E0] py-1 z-10"
            onMouseLeave={() => setSelectedDocument(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(doc.id);
                setSelectedDocument(null);
              }}
              className="px-4 py-2 hover:bg-[#FAFAFA] text-sm text-[#1B5E20] flex items-center space-x-2 w-full"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(doc.id);
                setSelectedDocument(null);
              }}
              className="px-4 py-2 hover:bg-[#FAFAFA] text-sm text-[#1B5E20] flex items-center space-x-2 w-full"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(doc.id);
                setSelectedDocument(null);
              }}
              className="px-4 py-2 hover:bg-red-50 text-sm text-red-600 flex items-center space-x-2 w-full"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const DocumentRow = ({ doc }: { doc: Document }) => (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-[#E0E0E0] hover:bg-[#FAFAFA] transition-colors"
    >
      <td className="px-3 sm:px-4 py-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-1.5 sm:p-2 bg-[#FAFAFA] border border-[#E0E0E0] rounded">
            {getFileIcon(doc.fileType)}
          </div>
          <div>
            <p className="font-medium text-[#1B5E20] text-xs sm:text-sm">{doc.fileName}</p>
            <p className="text-xs text-gray-600">{doc.category}</p>
          </div>
        </div>
      </td>
      <td className="px-3 sm:px-4 py-3">
        <span className="text-xs sm:text-sm text-gray-600">{formatFileSize(doc.fileSize)}</span>
      </td>
      <td className="px-3 sm:px-4 py-3">
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(doc.status)}`}>
          {getStatusIcon(doc.status)}
          <span className="text-xs capitalize">{doc.status}</span>
        </div>
      </td>
      <td className="px-3 sm:px-4 py-3">
        <span className="text-xs sm:text-sm text-gray-600">
          {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
        </span>
      </td>
      <td className="px-3 sm:px-4 py-3">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onDownload?.(doc.id)}
            className="p-1 sm:p-1.5 hover:bg-[#FAFAFA] rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1976D2]" />
          </button>
          <button
            onClick={() => onShare?.(doc.id)}
            className="p-1 sm:p-1.5 hover:bg-[#FAFAFA] rounded transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1976D2]" />
          </button>
          <button
            onClick={() => onDelete?.(doc.id)}
            className="p-1 sm:p-1.5 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
          </button>
          {isAdmin && doc.status === 'pending' && (
            <>
              <button
                onClick={() => onVerify?.(doc.id, 'verified')}
                className="p-1 sm:p-1.5 hover:bg-[#2E7D32]/10 rounded transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" />
              </button>
              <button
                onClick={() => onVerify?.(doc.id, 'rejected')}
                className="p-1 sm:p-1.5 hover:bg-red-500/10 rounded transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              </button>
            </>
          )}
        </div>
      </td>
    </motion.tr>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1B5E20]">Documents</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage your uploaded documents
          </p>
        </div>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0E0E0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600">Total</span>
            <FolderOpen className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1B5E20]">{statistics.total}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0E0E0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-[#2E7D32]">Verified</span>
            <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1B5E20]">{statistics.verified}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0E0E0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-[#FBC02D]">Pending</span>
            <Clock className="w-4 h-4 text-[#FBC02D]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1B5E20]">{statistics.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0E0E0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-red-600">Rejected</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1B5E20]">{statistics.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-[#E0E0E0] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] text-[#1B5E20] border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-sm"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full sm:w-auto px-4 py-2 bg-[#FAFAFA] text-[#1B5E20] border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="w-full sm:w-auto px-4 py-2 bg-[#FAFAFA] text-[#1B5E20] border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-sm"
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end space-x-2 bg-[#FAFAFA] rounded-lg p-1 border border-[#E0E0E0] w-fit self-end lg:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#2E7D32]/10 text-[#2E7D32]' : 'text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#2E7D32]/10 text-[#2E7D32]' : 'text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {documents.map(doc => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0] shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
                <th className="text-left px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">Document</th>
                <th className="text-left px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">Size</th>
                <th className="text-left px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">Status</th>
                <th className="text-left px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">Uploaded</th>
                <th className="text-left px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {documents.map(doc => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-[#FAFAFA] border border-[#E0E0E0] rounded-full inline-flex mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#1B5E20] mb-2">No documents found</h3>
          <p className="text-sm text-gray-600">Upload your first document to get started</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 bg-white border border-[#E0E0E0] hover:bg-[#FAFAFA] disabled:bg-gray-100 disabled:text-gray-400 text-[#1B5E20] rounded transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 sm:px-3 py-1 rounded transition-colors text-xs sm:text-sm ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white'
                      : 'bg-white border border-[#E0E0E0] hover:bg-[#FAFAFA] text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 bg-white border border-[#E0E0E0] hover:bg-[#FAFAFA] disabled:bg-gray-100 disabled:text-gray-400 text-[#1B5E20] rounded transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}