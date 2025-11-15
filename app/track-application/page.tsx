"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Eye,
  Home,
  ArrowRight,
  User,
  Shield,
  Calendar,
  MapPin,
  CreditCard,
  Zap,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface ApplicationStatus {
  _id: string;
  userId: string;
  loanNumber: string;
  requestedAmount: number;
  status: string;
  createdAt: string;
  userStatus?: {
    status: string;
    createdAt: string;
  };
  creditScoreStatus?: {
    status: string;
    createdAt: string;
  };
  documentsStatus?: {
    aadhar: string;
    pan: string;
    voterId: string;
    salarySlip: string;
    bankStatement: string;
    createdAt: string;
  };
}

interface ApplicationStage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
  icon: React.ComponentType<any>;
}

interface Document {
  name: string;
  status: 'uploaded' | 'pending' | 'verified' | 'rejected';
  uploadDate?: string;
  size?: string;
}

export default function TrackApplicationPage() {
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<'loanNumber' | 'mobile'>('loanNumber');
  const [isTracking, setIsTracking] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);

  const getApplicationStages = (status: string, createdAt: string): ApplicationStage[] => {
    const statusUpper = status.toUpperCase();
    const userStatusUpper = applicationData?.userStatus?.status.toUpperCase();
    const creditStatusUpper = applicationData?.creditScoreStatus?.status.toUpperCase();
    const docsStatus = applicationData?.documentsStatus;

    // Check if any document is uploaded/verified
    const hasDocuments = docsStatus && Object.values(docsStatus).some(
      (val: any) => typeof val === 'string' && (val.toUpperCase() === 'UPLOADED' || val.toUpperCase() === 'VERIFIED')
    );

    const stages: ApplicationStage[] = [
      {
        id: 1,
        title: "Application Submitted",
        description: "Your loan application has been received",
        status: 'completed',
        completedDate: createdAt,
        icon: FileText
      },
      {
        id: 2,
        title: "Document Verification",
        description: hasDocuments ? "Documents are being verified" : "Waiting for document submission",
        status: hasDocuments ? 'current' : (statusUpper === 'APPROVED' ? 'completed' : 'pending'),
        completedDate: docsStatus?.createdAt,
        icon: Shield
      },
      {
        id: 3,
        title: "Credit Assessment",
        description: creditStatusUpper === 'COMPLETED' ? "Credit assessment completed" : "Evaluating your creditworthiness",
        status: creditStatusUpper === 'COMPLETED' ? 'completed' : (creditStatusUpper === 'PENDING' ? 'current' : 'pending'),
        completedDate: applicationData?.creditScoreStatus?.createdAt,
        icon: CreditCard
      },
      {
        id: 4,
        title: statusUpper === 'REJECTED' ? 'Application Declined' : statusUpper === 'APPROVED' ? 'Loan Approved' : 'Final Review',
        description: statusUpper === 'REJECTED' ? 'Application review completed' : statusUpper === 'APPROVED' ? 'Your loan has been approved' : 'Final review in progress',
        status: statusUpper === 'APPROVED' || statusUpper === 'REJECTED' ? 'completed' : (statusUpper === 'PENDING' && creditStatusUpper === 'COMPLETED' ? 'current' : 'pending'),
        icon: statusUpper === 'REJECTED' ? AlertCircle : CheckCircle
      },
      {
        id: 5,
        title: "Disbursal",
        description: statusUpper === 'DISBURSED' ? 'Loan amount credited to your account' : 'Loan amount will be credited to your account',
        status: statusUpper === 'DISBURSED' ? 'completed' : 'pending',
        icon: Zap
      }
    ];

    return stages;
  };

  const getDocumentsFromAPI = (): Document[] => {
    if (!applicationData?.documentsStatus) return [];

    const { documentsStatus } = applicationData;
    return [
      {
        name: "Aadhaar Card",
        status: documentsStatus.aadhar.toLowerCase() as 'uploaded' | 'pending' | 'verified' | 'rejected',
        uploadDate: documentsStatus.createdAt,
      },
      {
        name: "PAN Card",
        status: documentsStatus.pan.toLowerCase() as 'uploaded' | 'pending' | 'verified' | 'rejected',
        uploadDate: documentsStatus.createdAt,
      },
      {
        name: "Voter ID",
        status: documentsStatus.voterId.toLowerCase() as 'uploaded' | 'pending' | 'verified' | 'rejected',
        uploadDate: documentsStatus.createdAt,
      },
      {
        name: "Salary Slip",
        status: documentsStatus.salarySlip.toLowerCase() as 'uploaded' | 'pending' | 'verified' | 'rejected',
        uploadDate: documentsStatus.createdAt,
      },
      {
        name: "Bank Statement",
        status: documentsStatus.bankStatement.toLowerCase() as 'uploaded' | 'pending' | 'verified' | 'rejected',
        uploadDate: documentsStatus.createdAt,
      }
    ];
  };

  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setError(null);

    try {
      // Build query parameter based on search type
      const queryParam = searchType === 'loanNumber'
        ? `loanNumber=${encodeURIComponent(searchValue)}`
        : `mobile=${encodeURIComponent(searchValue)}`;

      const response = await fetch(`https://api.bluechipfinmax.com/api/loans/status?${queryParam}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setApplicationData(result.data);
        setError(null);
      } else {
        setError(result.message || 'Application not found. Please check your details and try again.');
        setApplicationData(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch application status. Please try again.');
      setApplicationData(null);
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'APPROVED':
      case 'COMPLETED':
      case 'VERIFIED':
      case 'DISBURSED':
      case 'ACTIVE':
        return 'text-[#25B181] bg-[#25B181]/10';
      case 'PENDING':
      case 'PROCESSING':
      case 'UNDER_REVIEW':
      case 'UPLOADED':
        return 'text-[#FF9C70] bg-[#FF9C70]/10';
      case 'REJECTED':
      case 'DECLINED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffHours <= 0) return "Processing";
    if (diffHours < 24) return `${diffHours} hours`;
    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays} days`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
        >
          <Link href="/" className="hover:text-[#4A66FF] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-[#4A66FF] font-medium">Track Application</span>
        </motion.nav>
      </div>

      {/* Header Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-full mb-6">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4 text-[#1F8F68]">
            Track Your Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated on your loan application status and get real-time progress updates
          </p>
        </motion.div>

        {!applicationData ? (
          /* Search Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-center text-[#1F8F68]">Track Your Application</h2>

              <form onSubmit={handleTrackApplication} className="space-y-6">
                {/* Search Type Toggle */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search By</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchType('loanNumber');
                        setSearchValue("");
                        setError(null);
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        searchType === 'loanNumber'
                          ? 'bg-white text-[#4A66FF] shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Loan Number
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchType('mobile');
                        setSearchValue("");
                        setError(null);
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        searchType === 'mobile'
                          ? 'bg-white text-[#4A66FF] shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </button>
                  </div>
                </div>

                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {searchType === 'loanNumber' ? 'Loan Number' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    {searchType === 'loanNumber' ? (
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    )}
                    <input
                      type={searchType === 'loanNumber' ? 'text' : 'tel'}
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setError(null);
                      }}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-[#25B181] focus:outline-none"
                      placeholder={searchType === 'loanNumber' ? 'LN-087F0D94C20B' : '84651325689'}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {searchType === 'loanNumber'
                      ? 'Find your Loan Number in the confirmation email or SMS'
                      : 'Enter the phone number used during application'}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </motion.div>
                )}

                {/* Track Button */}
                <button
                  type="submit"
                  disabled={isTracking || !searchValue}
                  className="w-full bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isTracking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Track Application
                    </>
                  )}
                </button>
              </form>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-[#4A66FF]/10 rounded-lg border border-[#4A66FF]/20">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-[#4A66FF] mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-[#4A66FF]">Need Help?</p>
                    <p className="text-gray-700">
                      Can't find your Loan Number? Check your email or SMS, or{' '}
                      <Link href="/contact" className="underline text-[#4A66FF]">contact our support team</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Application Status Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Application Summary */}
            <div className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1F8F68]">Application #{applicationData.loanNumber}</h2>
                  <p className="text-gray-600">
                    Submitted on {formatDate(applicationData.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setApplicationData(null);
                    setSearchValue("");
                    setError(null);
                  }}
                  className="flex items-center px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg hover:bg-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Track Another
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-xl text-white">
                  <p className="text-sm opacity-90">Loan Amount</p>
                  <p className="text-2xl font-bold">₹{applicationData.requestedAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-[#4A66FF] to-[#25B181] rounded-xl text-white">
                  <p className="text-sm opacity-90">Application Status</p>
                  <p className="text-2xl font-bold uppercase">{applicationData.status}</p>
                </div>
                <div className="text-center p-4 bg-[#FAFAFA] border border-[#E0E0E0] rounded-xl">
                  <p className="text-sm text-gray-600">Application Date</p>
                  <p className="text-lg font-bold text-[#1F8F68]">{new Date(applicationData.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(applicationData.status)}`}>
                  {applicationData.status.toUpperCase() === 'APPROVED' && <CheckCircle className="w-5 h-5 mr-2" />}
                  {applicationData.status.toUpperCase() === 'PENDING' && <Clock className="w-5 h-5 mr-2" />}
                  {applicationData.status.toUpperCase() === 'REJECTED' && <AlertCircle className="w-5 h-5 mr-2" />}
                  Status: {applicationData.status}
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm">
              <h3 className="text-2xl font-bold mb-8 text-[#1F8F68]">Application Progress</h3>

              <div className="space-y-6">
                {getApplicationStages(applicationData.status, applicationData.createdAt).map((stage, index, stages) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.id} className="flex items-start">
                      <div className="flex flex-col items-center mr-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          stage.status === 'completed'
                            ? 'bg-[#25B181]/10 text-[#25B181]'
                            : stage.status === 'current'
                            ? 'bg-[#4A66FF]/10 text-[#4A66FF]'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            stage.status === 'completed'
                              ? 'bg-[#25B181]'
                              : 'bg-gray-200'
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold">{stage.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
                            {stage.status === 'current' ? 'In Progress' : stage.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{stage.description}</p>
                        {stage.completedDate && (
                          <p className="text-sm text-gray-500">
                            Completed on {formatDate(stage.completedDate)}
                          </p>
                        )}
                        {stage.status === 'current' && (
                          <div className="mt-3 flex items-center text-sm text-[#4A66FF]">
                            <Clock className="w-4 h-4 mr-1" />
                            Currently processing your application...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document Status */}
            <div className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center text-[#1F8F68]">
                  <Upload className="w-6 h-6 mr-2 text-[#4A66FF]" />
                  Document Status
                </h3>
                <button
                  onClick={() => setShowDocuments(!showDocuments)}
                  className="text-[#4A66FF] hover:underline flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showDocuments ? 'Hide' : 'View'} Details
                </button>
              </div>

              {showDocuments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  {getDocumentsFromAPI().map((doc, index) => (
                    <motion.div
                      key={doc.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-[#1F8F68]">{doc.name}</p>
                          {doc.uploadDate && (
                            <p className="text-sm text-gray-500">
                              Uploaded on {formatDate(doc.uploadDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="mt-6 p-4 bg-[#25B181]/10 rounded-lg border border-[#25B181]/20">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#25B181] mr-2" />
                  <span className="text-sm font-medium text-[#25B181]">
                    {getDocumentsFromAPI().filter(d => d.status === 'verified' || d.status === 'uploaded').length} of {getDocumentsFromAPI().length} documents uploaded
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
                <p className="text-sm sm:text-base lg:text-xl mb-6 opacity-90">
                  Our support team is here to help with any questions about your application
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <button className="px-8 py-3 bg-white text-[#1F8F68] rounded-lg font-semibold hover:shadow-lg transition-all">
                      Contact Support
                    </button>
                  </Link>
                  <a href="tel:1800-123-4567" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#1F8F68] transition-all">
                    Call 1800-123-4567
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}