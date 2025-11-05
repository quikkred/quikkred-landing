"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Upload, Download, Eye, Trash2, Edit, Search, Filter,
  Folder, File, Image, CheckCircle, Clock, AlertTriangle, Lock,
  Unlock, Share2, Archive, RefreshCw, Plus, Calendar, User,
  Tag, Star, MoreHorizontal, FolderOpen, Grid, List, Database
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'IMAGE' | 'EXCEL' | 'WORD' | 'OTHER';
  category: 'KYC' | 'LOAN_AGREEMENT' | 'INCOME_PROOF' | 'PROPERTY' | 'LEGAL' | 'OTHER';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  customerId?: string;
  loanId?: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  tags: string[];
  version: number;
  isEncrypted: boolean;
  url: string;
}

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'DOC001',
      name: 'Aadhaar_Card_Front.pdf',
      type: 'PDF',
      category: 'KYC',
      size: 245000,
      uploadedBy: 'Rahul Sharma',
      uploadedAt: '2024-01-28T10:30:00Z',
      customerId: 'CU001',
      loanId: 'LN12345',
      status: 'VERIFIED',
      tags: ['aadhaar', 'kyc', 'identity'],
      version: 1,
      isEncrypted: true,
      url: '/docs/aadhar_001.pdf'
    },
    {
      id: 'DOC002',
      name: 'Salary_Slip_December.pdf',
      type: 'PDF',
      category: 'INCOME_PROOF',
      size: 180000,
      uploadedBy: 'Priya Patel',
      uploadedAt: '2024-01-28T11:00:00Z',
      customerId: 'CU002',
      loanId: 'LN12346',
      status: 'VERIFIED',
      tags: ['salary', 'income', 'proof'],
      version: 2,
      isEncrypted: true,
      url: '/docs/salary_002.pdf'
    },
    {
      id: 'DOC003',
      name: 'Loan_Agreement_Signed.pdf',
      type: 'PDF',
      category: 'LOAN_AGREEMENT',
      size: 520000,
      uploadedBy: 'Admin',
      uploadedAt: '2024-01-28T12:00:00Z',
      customerId: 'CU003',
      loanId: 'LN12347',
      status: 'VERIFIED',
      tags: ['agreement', 'signed', 'legal'],
      version: 1,
      isEncrypted: true,
      url: '/docs/agreement_003.pdf'
    },
    {
      id: 'DOC004',
      name: 'Bank_Statement.pdf',
      type: 'PDF',
      category: 'INCOME_PROOF',
      size: 1200000,
      uploadedBy: 'Amit Kumar',
      uploadedAt: '2024-01-28T09:00:00Z',
      customerId: 'CU004',
      loanId: 'LN12348',
      status: 'PENDING',
      tags: ['bank', 'statement', 'financial'],
      version: 1,
      isEncrypted: true,
      url: '/docs/bank_004.pdf'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const stats = {
    totalDocuments: 15678,
    verified: 14234,
    pending: 890,
    rejected: 554,
    storageUsed: 45.8, // GB
    storageTotal: 100 // GB
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return FileText;
      case 'IMAGE': return Image;
      case 'EXCEL': return FileText;
      case 'WORD': return FileText;
      default: return File;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'KYC': return 'bg-blue-500/20 text-blue-400';
      case 'LOAN_AGREEMENT': return 'bg-purple-500/20 text-purple-400';
      case 'INCOME_PROOF': return 'bg-emerald-500/20 text-emerald-400';
      case 'PROPERTY': return 'bg-yellow-500/20 text-yellow-400';
      case 'LEGAL': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-emerald-500/20 text-emerald-400';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'REJECTED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredDocuments = documents.filter(d => {
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            Document Management System
          </h1>
          <p className="text-slate-400 mt-1">Centralized document repository with OCR & e-sign</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Bulk Download
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm text-slate-400">Total Documents</p>
          <p className="text-2xl font-bold text-white">{stats.totalDocuments.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-400">Verified</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.verified.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-sm text-slate-400">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm text-slate-400">Rejected</p>
          <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Database className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-slate-400">Storage Used</p>
          <p className="text-2xl font-bold text-white">{stats.storageUsed}GB</p>
          <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
            <div
              className="bg-purple-500 h-1 rounded-full"
              style={{ width: `${(stats.storageUsed / stats.storageTotal) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="KYC">KYC Documents</option>
              <option value="LOAN_AGREEMENT">Loan Agreements</option>
              <option value="INCOME_PROOF">Income Proof</option>
              <option value="PROPERTY">Property Documents</option>
              <option value="LEGAL">Legal Documents</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDocuments.map((doc, index) => {
            const TypeIcon = getTypeIcon(doc.type);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-4 border border-slate-700 hover:shadow-glow transition-all cursor-pointer"
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <TypeIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  {doc.isEncrypted && <Lock className="w-4 h-4 text-yellow-400" />}
                </div>

                <h3 className="font-semibold text-slate-200 mb-2 truncate">{doc.name}</h3>

                <div className="space-y-2 mb-3">
                  <div className={`inline-block px-2 py-1 rounded text-xs ${getCategoryColor(doc.category)}`}>
                    {doc.category.replace('_', ' ')}
                  </div>
                  <div className={`inline-block px-2 py-1 rounded text-xs ml-2 ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(doc.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span>v{doc.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
                  <button className="flex-1 p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                    <Share2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Document Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Size</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Uploaded</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredDocuments.map((doc) => {
                const TypeIcon = getTypeIcon(doc.type);
                return (
                  <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.loanId}</p>
                        </div>
                        {doc.isEncrypted && <Lock className="w-3 h-3 text-yellow-400" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getCategoryColor(doc.category)}`}>
                        {doc.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{formatFileSize(doc.size)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(doc.uploadedAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}