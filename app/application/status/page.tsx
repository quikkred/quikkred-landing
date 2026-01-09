'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Clock,
  Home,
  RefreshCw,
  FileText,
  IndianRupee,
  Calendar,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Phone,
  Mail,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Confetti from 'react-confetti';

interface ApplicationStatus {
  applicationNumber: string;
  status: string;
  reason?: string;
  requestedLoanAmount?: number;
  approvedLoanAmount?: number;
  tenure?: number;
  tenureUnit?: string;
  emiAmount?: number;
  netDisbursalAmount?: number;
  createdAt?: string;
}

export default function ApplicationStatusPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get window size for confetti
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Fetch application status
  useEffect(() => {
    const fetchApplicationStatus = async () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('https://alpha.quikkred.in/api/application/loan/get?page=1&limit=1', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          const latestApplication = result.data[0];
          setApplicationData({
            applicationNumber: latestApplication.applicationNumber,
            status: latestApplication.status,
            reason: latestApplication.reason || latestApplication.rejectionReason,
            requestedLoanAmount: latestApplication.requestedLoanAmount,
            approvedLoanAmount: latestApplication.approvedLoanAmount,
            tenure: latestApplication.tenure,
            tenureUnit: latestApplication.tenureUnit,
            emiAmount: latestApplication.emiAmount,
            netDisbursalAmount: latestApplication.netDisbursalAmount,
            createdAt: latestApplication.createdAt
          });

          // Show confetti for approved applications
          if (latestApplication.status?.toUpperCase() === 'APPROVED' ||
              latestApplication.status?.toUpperCase() === 'DISBURSED') {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchApplicationStatus();
    }
  }, [authLoading, router]);

  // Calculate days until can reapply (60 days from application date)
  const getDaysUntilReapply = () => {
    if (!applicationData?.createdAt) return 60;
    const applicationDate = new Date(applicationData.createdAt);
    const reapplyDate = new Date(applicationDate.getTime() + 60 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysLeft = Math.ceil((reapplyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const getReapplyDate = () => {
    if (!applicationData?.createdAt) return '';
    const applicationDate = new Date(applicationData.createdAt);
    const reapplyDate = new Date(applicationDate.getTime() + 60 * 24 * 60 * 60 * 1000);
    return reapplyDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#25B181] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your application status...</p>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Application Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't submitted any loan application yet. Start your application now!
          </p>
          <button
            onClick={() => router.push('/apply/quick')}
            className="w-full bg-gradient-to-r from-[#25B181] to-[#1d9e6f] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Apply Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  const isApproved = applicationData.status?.toUpperCase() === 'APPROVED' ||
                     applicationData.status?.toUpperCase() === 'DISBURSED';
  const isRejected = applicationData.status?.toUpperCase() === 'REJECTED' ||
                     applicationData.status?.toUpperCase() === 'REJECT';
  const isPending = !isApproved && !isRejected;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Confetti for approved */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#25B181', '#1d9e6f', '#FFD700', '#FF6B6B', '#4A66FF']}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Application Status</h1>
          <p className="text-gray-600 mt-2">Track your loan application progress</p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Approved Status */}
          {isApproved && (
            <>
              {/* Congratulations Banner */}
              <div className="bg-gradient-to-r from-[#25B181] via-[#2ec492] to-[#1d9e6f] p-6 sm:p-8 text-white text-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-2 left-4 animate-pulse">
                  <Sparkles className="w-6 h-6 text-yellow-300 opacity-80" />
                </div>
                <div className="absolute top-4 right-6 animate-pulse delay-100">
                  <Sparkles className="w-4 h-4 text-yellow-200 opacity-60" />
                </div>
                <div className="absolute bottom-3 right-10 animate-pulse delay-200">
                  <Sparkles className="w-5 h-5 text-yellow-300 opacity-70" />
                </div>
                <div className="absolute bottom-4 left-8 animate-pulse delay-300">
                  <Sparkles className="w-4 h-4 text-yellow-200 opacity-60" />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CheckCircle className="w-12 h-12 text-[#25B181]" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold mb-2"
                >
                  Congratulations!
                </motion.h2>
                <p className="text-green-100 text-lg">Your loan has been approved</p>
              </div>

              {/* Loan Details */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Application Number */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Application Number</p>
                  <p className="text-lg font-bold text-gray-900">{applicationData.applicationNumber}</p>
                </div>

                {/* Amount Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-gray-600">Approved Amount</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-green-700">
                      ₹{(applicationData.approvedLoanAmount || applicationData.requestedLoanAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-600">Tenure</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-700">
                      {applicationData.tenure || '-'} {applicationData.tenureUnit || 'Days'}
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                {(applicationData.emiAmount || applicationData.netDisbursalAmount) && (
                  <div className="grid grid-cols-2 gap-4">
                    {applicationData.netDisbursalAmount && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Net Disbursal</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{applicationData.netDisbursalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                    {applicationData.emiAmount && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Total Repayment</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{applicationData.emiAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800">What's Next?</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Your loan amount will be disbursed to your registered bank account within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Rejected Status */}
          {isRejected && (
            <>
              {/* Rejection Banner */}
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 sm:p-8 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <XCircle className="w-12 h-12 text-red-500" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Application Not Approved</h2>
                <p className="text-red-100">We're sorry, your application couldn't be approved at this time</p>
              </div>

              {/* Rejection Details */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Application Number */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Application Number</p>
                  <p className="text-lg font-bold text-gray-900">{applicationData.applicationNumber}</p>
                </div>

                {/* Reason */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-800">Reason for Rejection</p>
                      <p className="text-sm text-red-700 mt-1">
                        {applicationData.reason || 'Your credit profile does not meet our current eligibility criteria.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reapply Notice */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-lg">You Can Reapply!</p>
                      <p className="text-sm text-blue-700">After the cooling-off period</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Days Remaining</span>
                      <span className="text-2xl font-bold text-blue-700">{getDaysUntilReapply()} days</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                        style={{ width: `${((60 - getDaysUntilReapply()) / 60) * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-blue-800">
                    You can submit a new application on <span className="font-semibold">{getReapplyDate()}</span>
                  </p>
                </div>

                {/* Tips */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                    Tips to Improve Your Chances
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Maintain a good credit score by paying bills on time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Reduce existing debts and credit card balances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ensure stable income and employment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Keep your bank statements healthy with regular savings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Pending Status */}
          {isPending && (
            <>
              {/* Pending Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Clock className="w-12 h-12 text-amber-500" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Application In Progress</h2>
                <p className="text-amber-100">Your application is being reviewed</p>
              </div>

              {/* Pending Details */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Application Number */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Application Number</p>
                  <p className="text-lg font-bold text-gray-900">{applicationData.applicationNumber}</p>
                </div>

                {/* Status */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                      {applicationData.status}
                    </span>
                  </div>
                </div>

                {/* Requested Amount */}
                {applicationData.requestedLoanAmount && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Requested Amount</span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{applicationData.requestedLoanAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Processing Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5 animate-spin" />
                    <div>
                      <p className="font-semibold text-blue-800">Processing</p>
                      <p className="text-sm text-blue-700 mt-1">
                        We're reviewing your application. This usually takes 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="p-6 pt-0 space-y-3">
            <button
              onClick={() => router.push('/user')}
              className="w-full bg-gradient-to-r from-[#25B181] to-[#1d9e6f] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>

            {/* Contact Support */}
            <div className="flex gap-3">
              <a
                href="tel:+919999999999"
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a
                href="mailto:support@quikkred.in"
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Need help? Contact our support team for assistance.
        </motion.p>
      </div>
    </div>
  );
}
