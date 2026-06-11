"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, FileText, CheckCircle, AlertCircle,
  User, Phone, Mail, CreditCard, Building,
  Calendar, IndianRupee, Search, RefreshCw
} from "lucide-react";
import { API_BASE_URL } from '@/lib/config';
import getToken from "@/lib/getToken";
import useAxios from "@/hooks/useAxios";

interface CustomerData {
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  panCard: string;
  aadhaarNumber: string;
  employmentType: string;
  monthlyIncome: string;
  companyName: string;
  designation: string;
  workExperience: string;
  currentAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  banks: Array<{
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  }>;
  isPanVerify: boolean;
  isAadhaarVerify: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

export default function GfinAgreementPage() {
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementApproved, setAgreementApproved] = useState(false);
  const axios = useAxios();

  // Helper functions
  const getValue = (value: any) => {
    if (value === null || value === undefined || value === '' || value === 'undefined' || value === 'null') {
      return 'N/A';
    }
    return value;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const formatCurrency = (value: any) => {
    if (!value || value === 'N/A' || isNaN(value)) return 'N/A';
    return Number(value).toLocaleString('en-IN');
  };

  // Masking removed — show the full Aadhaar number (grouped for readability).
  const maskAadhaar = (aadhaar: string) => {
    if (!aadhaar) return 'N/A';
    return aadhaar.replace(/\D/g, '').replace(/(.{4})(?=.)/g, '$1-');
  };

  // Fetch customer data from API
  const fetchCustomerData = async () => {
    setLoading(true);
    setError(null);
    setShowAgreement(false);

    try {
      // Get authorization token from localStorage
      //   const token = await getToken();

      // if (!token) {
      //   setError('Authorization token not found. Please login first.');
      //   setLoading(false);
      //   return;
      // }

      // const response = await fetch(`${API_BASE_URL}/api/customer/get`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // const result = await response.json();
      const response = await axios.get("/api/customer/get");
      const result = response.data;

      if ((response.status === 200 || response.status === 201) && result.success && result.data) {
        setCustomerData(result.data);
        setShowAgreement(true);
      } else {
        setError(result.message || 'Failed to fetch customer data');
      }
    } catch (err: any) {
      console.error('Error fetching customer data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Handle agreement approval
  const handleApproveAgreement = () => {
    setAgreementApproved(true);
    // Store approval in localStorage
    localStorage.setItem('gfinAgreementApproved', 'true');
    localStorage.setItem('gfinAgreementDate', new Date().toISOString());
  };

  // Get current date and time
  const today = new Date();
  const currentDate = today.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const currentTime = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GFIN Agreement</h1>
          <p className="text-gray-600">Fetch and review your loan agreement details</p>
        </motion.div>

        {/* Check Button Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Fetch Agreement Data
              </h2>
              <p className="text-gray-600 mb-6">
                Click the button below to fetch your customer data and view the agreement
              </p>
            </div>

            <button
              onClick={fetchCustomerData}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching Data...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check & Fetch Data
                </>
              )}
            </button>

            {customerData && (
              <button
                onClick={fetchCustomerData}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mt-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Agreement Display */}
        <AnimatePresence>
          {showAgreement && customerData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Agreement Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">QUIKKRED</h2>
                    <p className="text-emerald-100 text-sm">Quick Credit, Trusted Partner</p>
                    <p className="text-emerald-200 text-xs mt-1">
                      Satsai Finlease Private Limited | RBI Registered NBFC
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 px-4 py-2 rounded-lg mb-2">
                      <span className="font-bold">GFIN Agreement</span>
                    </div>
                    <p className="text-sm">Date: {currentDate}</p>
                    <p className="text-sm">Time: {currentTime}</p>
                  </div>
                </div>
              </div>

              {/* Agreement Title */}
              <div className="text-center py-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 inline-block px-8 py-2 border-2 border-emerald-500 rounded-lg bg-gradient-to-r from-emerald-50 to-white">
                  LOAN AGREEMENT
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  This agreement is executed on {currentDate}
                </p>
              </div>

              {/* Borrower Details */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="flex items-center gap-2 text-white font-semibold bg-emerald-600 px-4 py-2 rounded-lg mb-4">
                  <User className="w-5 h-5" />
                  Borrower Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Full Name" value={getValue(customerData.fullName)} />
                  <InfoRow label="Date of Birth" value={formatDate(customerData.dateOfBirth)} />
                  <InfoRow label="PAN Number" value={getValue(customerData.panCard)} verified={customerData.isPanVerify} />
                  <InfoRow label="Aadhaar Number" value={maskAadhaar(customerData.aadhaarNumber)} verified={customerData.isAadhaarVerify} />
                  <InfoRow label="Mobile Number" value={`+91 ${getValue(customerData.mobile)}`} verified={customerData.isMobileVerified} />
                  <InfoRow label="Email Address" value={getValue(customerData.email)} verified={customerData.isEmailVerified} />
                  <div className="md:col-span-2">
                    <InfoRow
                      label="Residential Address"
                      value={`${getValue(customerData.currentAddress?.line1)}${customerData.currentAddress?.line2 ? ', ' + customerData.currentAddress.line2 : ''}, ${getValue(customerData.currentAddress?.city)}, ${getValue(customerData.currentAddress?.state)} - ${getValue(customerData.currentAddress?.pincode)}`}
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="flex items-center gap-2 text-white font-semibold bg-emerald-600 px-4 py-2 rounded-lg mb-4">
                  <Building className="w-5 h-5" />
                  Employment Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Employment Type" value={getValue(customerData.employmentType)} />
                  <InfoRow label="Company Name" value={getValue(customerData.companyName)} />
                  <InfoRow label="Designation" value={getValue(customerData.designation)} />
                  <InfoRow label="Monthly Income" value={`₹${formatCurrency(customerData.monthlyIncome)}`} />
                  <InfoRow label="Work Experience" value={customerData.workExperience ? `${customerData.workExperience} years` : 'N/A'} />
                </div>
              </div>

              {/* Bank Details */}
              {customerData.banks && customerData.banks.length > 0 && (
                <div className="p-6 border-b border-gray-200">
                  <h4 className="flex items-center gap-2 text-white font-semibold bg-emerald-600 px-4 py-2 rounded-lg mb-4">
                    <CreditCard className="w-5 h-5" />
                    Bank Account Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Account Holder Name" value={getValue(customerData.banks[0]?.accountHolderName || customerData.fullName)} />
                    <InfoRow label="Account Number" value={getValue(customerData.banks[0]?.accountNumber)} />
                    <InfoRow label="Bank Name" value={getValue(customerData.banks[0]?.bankName)} />
                    <InfoRow label="IFSC Code" value={getValue(customerData.banks[0]?.ifscCode)} />
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="flex items-center gap-2 text-white font-semibold bg-emerald-600 px-4 py-2 rounded-lg mb-4">
                  <FileText className="w-5 h-5" />
                  Terms & Conditions
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-3">
                  <p><strong>1. Loan Purpose:</strong> This loan is granted for personal/business use as declared by the Borrower.</p>
                  <p><strong>2. Disbursement:</strong> Upon successful verification, the loan amount will be disbursed within 24-48 hours.</p>
                  <p><strong>3. Repayment:</strong> The Borrower agrees to repay the loan as per the repayment schedule via eNACH/eMandate.</p>
                  <p><strong>4. Late Payment:</strong> Late fee and penal interest will apply on overdue amounts as per RBI guidelines.</p>
                  <p><strong>5. Default & Recovery:</strong> Default may result in credit bureau reporting and legal action.</p>
                  <p><strong>6. Governing Law:</strong> This agreement is governed by Indian laws.</p>
                </div>
              </div>

              {/* Declaration */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">BORROWER'S DECLARATION & CONSENT</h4>
                <p className="text-gray-700 mb-4">
                  I, <strong>{getValue(customerData.fullName)}</strong>, hereby declare that:
                </p>
                <div className="space-y-3">
                  <DeclarationItem text="All information provided is true and accurate." />
                  <DeclarationItem text="I agree to all terms and conditions mentioned in this agreement." />
                  <DeclarationItem text="I authorize Quikkred to verify my information and auto-debit EMI amounts." />
                  <DeclarationItem text="I understand non-payment will affect my credit score." />
                </div>
              </div>

              {/* Signature Section */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="flex items-center gap-2 text-white font-semibold bg-emerald-600 px-4 py-2 rounded-lg mb-4">
                  Digital Signature (Aadhaar eSign)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-emerald-400 rounded-xl p-6 text-center bg-emerald-50">
                    <div className="text-4xl mb-2">✍️</div>
                    <p className="font-bold text-emerald-700">Borrower's eSign</p>
                    <p className="text-sm text-gray-600">Aadhaar-based Digital Signature</p>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>Name:</strong> {getValue(customerData.fullName)}</p>
                      <p><strong>Aadhaar:</strong> {maskAadhaar(customerData.aadhaarNumber)}</p>
                      <p><strong>Date:</strong> {currentDate}</p>
                      <p><strong>Time:</strong> {currentTime}</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center bg-gray-50">
                    <div className="text-4xl mb-2">🏢</div>
                    <p className="font-bold text-gray-700">Lender's Authorization</p>
                    <p className="text-sm text-gray-600">For Satsai Finlease Private Limited</p>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>Authorized Signatory</strong></p>
                      <p>Quikkred Digital Lending Platform</p>
                      <p><strong>Date:</strong> {currentDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approve Button */}
              <div className="p-8 bg-gradient-to-r from-emerald-50 to-white text-center">
                {agreementApproved ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <p className="text-xl font-bold text-emerald-700">Agreement Approved!</p>
                    <p className="text-gray-600">Your agreement has been successfully approved on {currentDate}</p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-gray-700 mb-6">
                      By clicking "I Agree & Approve", you confirm that you have read and understood
                      all the terms and conditions mentioned above.
                    </p>
                    <button
                      onClick={handleApproveAgreement}
                      className="px-12 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      I Agree & Approve
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      This will approve your agreement and store the approval locally.
                    </p>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
                <p className="font-semibold">Satsai Finlease Private Limited (trading as Quikkred)</p>
                <p>RBI Registered NBFC | CIN: U65100MH2024PTC123456</p>
                <p className="mt-2 text-xs text-gray-500">
                  This is a computer-generated document and is valid without physical signature.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Info Row Component
function InfoRow({ label, value, verified }: { label: string; value: string; verified?: boolean }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors">
      <span className="text-gray-600 text-sm uppercase">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{value}</span>
        {verified && (
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        )}
      </div>
    </div>
  );
}

// Declaration Item Component
function DeclarationItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
      <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-3 h-3 text-white" />
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
