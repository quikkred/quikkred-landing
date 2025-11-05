"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  FileText,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Shield,
  CreditCard,
  Zap,
  RefreshCw,
  Calendar,
  IndianRupee,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
}

export default function TrackApplicationPage() {
  const { user } = useAuth();
  const router = useRouter();
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
        return 'text-[#2E7D32] bg-[#2E7D32]/10';
      case 'PENDING':
      case 'PROCESSING':
      case 'UNDER_REVIEW':
      case 'UPLOADED':
        return 'text-[#FBC02D] bg-[#FBC02D]/10';
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] rounded-full mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1B5E20] mb-2">
            Track Your Application
          </h1>
          <p className="text-gray-600">
            Stay updated on your loan application status and get real-time progress updates
          </p>
        </div> */}

        {!applicationData ? (
          /* Search Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E0E0] shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-[#1B5E20]">Track Your Application</h2>

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
                          ? 'bg-white text-[#1976D2] shadow-sm'
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
                          ? 'bg-white text-[#1976D2] shadow-sm'
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
                      className="w-full pl-10 pr-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] focus:outline-none"
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
                  className="w-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
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
              <div className="mt-6 p-4 bg-[#1976D2]/10 rounded-lg border border-[#1976D2]/20">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-[#1976D2] mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-[#1976D2]">Need Help?</p>
                    <p className="text-gray-700">
                      Can't find your Loan Number? Check your email or SMS, or contact our support team.
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
            className="max-w-6xl mx-auto space-y-6 sm:space-y-8"
          >
            {/* Application Summary */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E0E0] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1B5E20]">Application #{applicationData.loanNumber}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Submitted on {formatDate(applicationData.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setApplicationData(null);
                    setSearchValue("");
                    setError(null);
                  }}
                  className="flex items-center px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg hover:bg-white transition-colors w-fit"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Track Another
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] rounded-xl text-white">
                  <p className="text-sm opacity-90">Loan Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold flex items-center justify-center mt-1">
                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
                    {applicationData.requestedAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#1976D2] to-[#2E7D32] rounded-xl text-white">
                  <p className="text-sm opacity-90">Application Status</p>
                  <p className="text-2xl sm:text-3xl font-bold uppercase mt-1">{applicationData.status}</p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-[#FAFAFA] border border-[#E0E0E0] rounded-xl">
                  <p className="text-sm text-gray-600">Application Date</p>
                  <p className="text-lg sm:text-xl font-bold text-[#1B5E20] mt-1">
                    {new Date(applicationData.createdAt).toLocaleDateString('en-IN')}
                  </p>
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
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E0E0] shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-[#1B5E20]">Application Progress</h3>

              <div className="space-y-6">
                {getApplicationStages(applicationData.status, applicationData.createdAt).map((stage, index, stages) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.id} className="flex items-start">
                      <div className="flex flex-col items-center mr-4 sm:mr-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                          stage.status === 'completed'
                            ? 'bg-[#2E7D32]/10 text-[#2E7D32]'
                            : stage.status === 'current'
                            ? 'bg-[#1976D2]/10 text-[#1976D2]'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            stage.status === 'completed'
                              ? 'bg-[#2E7D32]'
                              : 'bg-gray-200'
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h4 className="text-base sm:text-lg font-semibold">{stage.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(stage.status)}`}>
                            {stage.status === 'current' ? 'In Progress' : stage.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm sm:text-base">{stage.description}</p>
                        {stage.completedDate && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            Completed on {formatDate(stage.completedDate)}
                          </p>
                        )}
                        {stage.status === 'current' && (
                          <div className="mt-3 flex items-center text-sm text-[#1976D2]">
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
            {applicationData.documentsStatus && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E0E0] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center text-[#1B5E20]">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#1976D2]" />
                    Document Status
                  </h3>
                  <button
                    onClick={() => setShowDocuments(!showDocuments)}
                    className="text-[#1976D2] hover:underline flex items-center text-sm sm:text-base"
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
                            <p className="font-medium text-[#1B5E20] text-sm sm:text-base">{doc.name}</p>
                            {doc.uploadDate && (
                              <p className="text-xs sm:text-sm text-gray-500">
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

                <div className="mt-6 p-4 bg-[#2E7D32]/10 rounded-lg border border-[#2E7D32]/20">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#2E7D32] mr-2" />
                    <span className="text-sm font-medium text-[#2E7D32]">
                      {getDocumentsFromAPI().filter(d => d.status === 'verified' || d.status === 'uploaded').length} of {getDocumentsFromAPI().length} documents uploaded
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 sm:p-8 text-white">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Need Assistance?</h3>
                <p className="text-sm sm:text-base mb-6 opacity-90">
                  Our support team is here to help with any questions about your application
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push('/user/support')}
                    className="px-6 sm:px-8 py-3 bg-white text-[#1B5E20] rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Contact Support
                  </button>
                  <a href="tel:1800-123-4567" className="px-6 sm:px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#1B5E20] transition-all">
                    Call 1800-123-4567
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
