'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  DollarSign, CreditCard, User, Bell, Settings,
  TrendingUp, Calendar, Clock, Download, Plus,
  IndianRupee, Percent, Target, CheckCircle,
  AlertTriangle, FileText, Phone, Mail, MapPin,
  Building, Award, Star, ArrowUpRight, ArrowDownRight,
  Wallet, Calculator, Eye, EyeOff, RefreshCw,
  Shield, UserCheck, History, Gift, HelpCircle,
  Smartphone, Globe, Heart, Zap, Activity,
  PieChart, BarChart3, TrendingDown, Package,
  CopyIcon, ExternalLink, ChevronRight, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast, Toaster } from '@/components/ui/toast';

interface DashboardData {
  customerId: string;
  oldApplication: boolean;
  oldApplicationNumber: string | null;
  oldApplicationDate: string | null;
  isBasicDetailsFilled: boolean;
  isEmploymentDetailsFilled: boolean;
  isVerificationDetailsFilled: boolean;
}

export default function UserDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return;
      }

      if (user.role !== 'USER' && user.role !== 'CUSTOMER') {
        console.log('User not authorized for user dashboard:', user.role);
        router.push('/login');
        return;
      }

      console.log('User authorized for user dashboard:', user.role);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('authToken') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('accessToken');

      if (!token) {
        console.error('No auth token found');
        router.push('/login');
        return;
      }

      const response = await fetch('https://77q1g1gk-5050.inc1.devtunnels.ms/api/customer/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setData(result.data);
        console.log('✅ Dashboard data loaded successfully');
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "error",
        title: "Error Loading Data",
        description: "Unable to fetch your dashboard data. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateCompletion = () => {
    if (!data) return 0;
    let completed = 0;
    if (data.isBasicDetailsFilled) completed++;
    if (data.isEmploymentDetailsFilled) completed++;
    if (data.isVerificationDetailsFilled) completed++;
    return Math.round((completed / 3) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#10B4A3] border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-[#737373]">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'USER' && user.role !== 'CUSTOMER')) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#737373]">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#10B4A3] border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-[#737373]">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 bg-[#FAFAFA] min-h-screen">
        {/* Header with Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] flex items-center gap-2 sm:gap-3">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF9800]" />
                <span className="break-words">Welcome back, {user?.name?.split(' ')[0]}!</span>
              </h1>
              <p className="text-[#737373] mt-1 text-sm sm:text-base">Complete your profile to apply for loans</p>
            </div>

            <button
              onClick={fetchUserData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg hover:shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Old Application Info - Show only if oldApplication is true */}
        {data?.oldApplication && data?.oldApplicationNumber && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200 mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-amber-500/20 rounded-lg sm:rounded-xl">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-2 sm:mb-3">Previous Application Found</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <p className="text-sm text-amber-700 mb-1">Application Number</p>
                    <p className="text-base font-semibold text-amber-900">{data.oldApplicationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 mb-1">Application Date</p>
                    <p className="text-base font-semibold text-amber-900">{formatDate(data.oldApplicationDate)}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/apply/quick')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Continue Application</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Completion Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200 mb-4 sm:mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-1">Profile Completion</h2>
              <p className="text-xs sm:text-sm text-blue-700">Complete all steps to apply for loans</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-900">{calculateCompletion()}%</div>
              <p className="text-xs text-blue-700">Complete</p>
            </div>
          </div>

          <div className="w-full bg-blue-200 rounded-full h-2 sm:h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calculateCompletion()}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
            />
          </div>
        </motion.div>

        {/* Customer Details Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E5E5E5] mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#0A0A0A] mb-4 sm:mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B4A3]" />
            Application Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${
              data?.isBasicDetailsFilled
                ? 'bg-green-50 border-green-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {data?.isBasicDetailsFilled ? (
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Basic Details</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {data?.isBasicDetailsFilled ? 'Completed ✓' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${
              data?.isEmploymentDetailsFilled
                ? 'bg-green-50 border-green-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {data?.isEmploymentDetailsFilled ? (
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Employment Details</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {data?.isEmploymentDetailsFilled ? 'Completed ✓' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${
              data?.isVerificationDetailsFilled
                ? 'bg-green-50 border-green-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {data?.isVerificationDetailsFilled ? (
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Verification</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {data?.isVerificationDetailsFilled ? 'Completed ✓' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
      <Toaster />
    </>
  );
}