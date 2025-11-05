'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, Building2, CreditCard, CheckCircle, XCircle,
  AlertCircle, Copy, Eye, EyeOff, Loader2, RefreshCw,
  Shield, TrendingUp, Calendar, Edit, X
} from 'lucide-react';

interface BankAccount {
  _id: string;
  userId: string;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  accountType?: string;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt: string | null;
  bankStatementAnalysis: any | null;
  averageMonthlyBalance: number | null;
  creditHistory: any | null;
  deleted: boolean;
  createdAt: string;
}

export default function BankAccountsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleAccounts, setVisibleAccounts] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'SAVINGS',
    isPrimary: false
  });

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('https://api.bluechipfinmax.com/api/bankAccount/getAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setBankAccounts(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch bank accounts');
      }
    } catch (err) {
      setError('Failed to load bank accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccountVisibility = (accountId: string) => {
    setVisibleAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '••••••••••••';
    return '•••• •••• ' + accountNumber.slice(-4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      accountHolderName: account.accountHolderName,
      accountNumber: account.accountNumber,
      ifscCode: account.ifscCode,
      bankName: account.bankName,
      branchName: account.branch,
      accountType: account.accountType || 'SAVINGS',
      isPrimary: account.isPrimary
    });
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setShowAddForm(false);
    setFormData({
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      accountType: 'SAVINGS',
      isPrimary: false
    });
  };

  const handleSubmitBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      let response;

      if (editingAccount) {
        // Update existing account
        response = await fetch(`https://api.bluechipfinmax.com/api/bankAccount/update/${editingAccount._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accountHolderName: formData.accountHolderName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            bankName: formData.bankName,
            branchName: formData.branchName
          })
        });
      } else {
        // Create new account
        response = await fetch('https://api.bluechipfinmax.com/api/bankAccount/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }

      const result = await response.json();

      if (response.ok && result.success) {
        handleCancelEdit();
        // Refresh bank accounts list
        fetchBankAccounts();
      } else {
        setError(result.message || `Failed to ${editingAccount ? 'update' : 'create'} bank account`);
      }
    } catch (err) {
      setError(`Failed to ${editingAccount ? 'update' : 'create'} bank account`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#10B4A3] mx-auto mb-4" />
          <p className="text-[#737373]">Loading bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
            My Bank Accounts
          </h1>
          <p className="text-sm text-[#737373] mt-1">
            Manage your linked bank accounts
          </p>
        </div>

        <button
          onClick={fetchBankAccounts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-[#0A0A0A]">Refresh</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-[#FFEBEE] border border-[#F44336] rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#F44336]" />
          <div className="flex-1">
            <p className="text-[#F44336] font-medium">{error}</p>
          </div>
        </div>
      )}


      {/* Bank Accounts List */}
      {bankAccounts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm">
          {!showAddForm ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Wallet className="w-16 h-16 text-[#D4D4D4] mb-4" />
              <h3 className="text-lg font-semibold text-[#0A0A0A] mb-2">
                No Bank Accounts Found
              </h3>
              <p className="text-sm text-[#737373] text-center max-w-md mb-6">
                You haven't linked any bank accounts yet. Add a bank account to get started.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#10B4A3] to-[#0E9D8F] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium cursor-pointer"
              >
                <Building2 className="w-5 h-5" />
                Add Bank Account
              </button>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-6">
                {editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
              </h3>
              <form onSubmit={handleSubmitBankAccount} className="space-y-5">
                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                    placeholder="Enter account holder name"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all font-mono"
                    placeholder="Enter account number"
                  />
                </div>

                {/* Bank Name & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                      placeholder="e.g., HDFC Bank"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                      placeholder="e.g., Andheri West, Mumbai"
                    />
                  </div>
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#10B4A3] focus:border-transparent transition-all font-mono uppercase"
                    placeholder="e.g., HDFC0001235"
                    maxLength={11}
                  />
                </div>

                {/* Account Type - Only show when creating */}
                {!editingAccount && (
                  <div>
                    <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                      Account Type *
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#10B4A3] focus:border-transparent transition-all"
                    >
                      <option value="SAVINGS">Savings Account</option>
                      <option value="CURRENT">Current Account</option>
                      <option value="SALARY">Salary Account</option>
                    </select>
                  </div>
                )}

                {/* Primary Account Checkbox - Only show when creating */}
                {!editingAccount && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      id="isPrimary"
                      checked={formData.isPrimary}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#10B4A3] border-[#E5E5E5] rounded focus:ring-[#10B4A3]"
                    />
                    <label htmlFor="isPrimary" className="text-sm text-[#0A0A0A]">
                      Set as primary account
                    </label>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {editingAccount ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {editingAccount ? 'Update Account' : 'Add Account'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#F5F5F5] text-[#0A0A0A] rounded-lg hover:bg-[#E5E5E5] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Edit Account Form */}
          {editingAccount && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-6">Edit Bank Account</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                    placeholder="Enter account holder name"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all font-mono"
                    placeholder="Enter account number"
                  />
                </div>

                {/* Bank Name & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                      placeholder="e.g., HDFC Bank"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#10B4A3] focus:border-transparent transition-all"
                      placeholder="e.g., Andheri West, Mumbai"
                    />
                  </div>
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#10B4A3] focus:border-transparent transition-all font-mono uppercase"
                    placeholder="e.g., HDFC0001235"
                    maxLength={11}
                  />
                </div>

                {/* Account Type - Only show when creating */}
                {!editingAccount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type *
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                    >
                      <option value="SAVINGS">Savings Account</option>
                      <option value="CURRENT">Current Account</option>
                      <option value="SALARY">Salary Account</option>
                    </select>
                  </div>
                )}

                {/* Primary Account Checkbox - Only show when creating */}
                {!editingAccount && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      id="isPrimaryExisting"
                      checked={formData.isPrimary}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#2E7D32] border-gray-300 rounded focus:ring-[#2E7D32]"
                    />
                    <label htmlFor="isPrimaryExisting" className="text-sm text-gray-700">
                      Set as primary account
                    </label>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#10B4A3] to-[#0E9D8F] text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {editingAccount ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {editingAccount ? 'Update Account' : 'Add Account'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#F5F5F5] text-[#0A0A0A] rounded-lg hover:bg-[#E5E5E5] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Existing Bank Accounts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bankAccounts.map((account, index) => (
              <motion.div
                key={account._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl border-2 ${
                  account.isPrimary ? 'border-[#10B4A3]' : 'border-[#E5E5E5]'
                } shadow-sm hover:shadow-md transition-all overflow-hidden`}
              >
                <div className={`p-4 ${
                  account.isPrimary
                    ? 'bg-gradient-to-r from-[#10B4A3] to-[#0E9D8F]'
                    : 'bg-gradient-to-r from-[#4084FF] to-[#6BA4FF]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {account.bankName}
                        </h3>
                        <p className="text-white/80 text-sm">{account.branch}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {account.isPrimary && (
                        <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                          PRIMARY
                        </span>
                      )}
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors cursor-pointer"
                        title="Edit Account"
                      >
                        <Edit className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-xs text-[#737373] font-medium block mb-1">
                      Account Holder Name
                    </label>
                    <p className="text-[#0A0A0A] font-semibold">
                      {account.accountHolderName}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-[#737373] font-medium block mb-1">
                      Account Number
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-[#0A0A0A] font-mono font-semibold">
                        {visibleAccounts.has(account._id)
                          ? account.accountNumber
                          : maskAccountNumber(account.accountNumber)}
                      </p>
                      <button
                        onClick={() => toggleAccountVisibility(account._id)}
                        className="p-1 hover:bg-[#F5F5F5] rounded transition-colors cursor-pointer"
                        title={visibleAccounts.has(account._id) ? 'Hide' : 'Show'}
                      >
                        {visibleAccounts.has(account._id) ? (
                          <EyeOff className="w-4 h-4 text-[#737373]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#737373]" />
                        )}
                      </button>
                      {visibleAccounts.has(account._id) && (
                        <button
                          onClick={() => copyToClipboard(account.accountNumber)}
                          className="p-1 hover:bg-[#F5F5F5] rounded transition-colors cursor-pointer"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4 text-[#737373]" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#737373] font-medium block mb-1">
                      IFSC Code
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-[#0A0A0A] font-mono font-semibold">
                        {account.ifscCode}
                      </p>
                      <button
                        onClick={() => copyToClipboard(account.ifscCode)}
                        className="p-1 hover:bg-[#F5F5F5] rounded transition-colors cursor-pointer"
                        title="Copy IFSC"
                      >
                        <Copy className="w-4 h-4 text-[#737373]" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                      {account.isVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                          <span className="text-sm text-[#4CAF50] font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#FF9800]" />
                          <span className="text-sm text-[#FF9800] font-medium">Not Verified</span>
                        </>
                      )}
                    </div>

                    {account.averageMonthlyBalance && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#4084FF]" />
                        <span className="text-sm text-[#737373]">
                          Avg: ₹{account.averageMonthlyBalance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#737373]">
                    <Calendar className="w-3 h-3" />
                    <span>Added on {formatDate(account.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
