"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, Calendar, MapPin, Building,
  Edit2, Save, X, Camera, Shield, CheckCircle,
  AlertCircle, FileText, CreditCard, Briefcase,
  Home, Upload, Loader2, ArrowLeft, Clock,
  CheckCircle2, XCircle, Globe, Users, RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from '@/lib/config';
import { useProfile } from '@/store/hooks/useProfile';
import getToken from "@/lib/getToken";

interface Address {
  street?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  fullAddress?: string;
  landmark?: string;
  yearsAtAddress?: number;
  coordinates?: {
    coordinates: number[];
    type: string;
  };
}

interface Bank {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  accountType?: string;
  pennyDropStatus?: string;
  pennyDropDate?: string;
  _id: string;
}

interface Reference {
  name: string;
  mobile: string;
  relationship: string;
  _id: string;
}
interface Profile {
  _id: string;
  documentType: string;
  s3URL: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}


interface ProfileData {
  isKycDetailsFilled: boolean;
  _id: string;
  customerUniqueId: string;
  role: string;
  points: number;
  email: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isPanVerify: boolean;
  isAadhaarVerify: boolean;
  currentAddress?: Address;
  permanentAddress?: Address;
  permanentAddressSame?: boolean;
  officeAddress?: Address;
  riskCategory: string;
  fraudFlags: any[];
  kycStatus: string;
  isActive: boolean;
  isBlocked: boolean;
  isBasicDetailsFilled: boolean;
  isEmploymentDetailsFilled: boolean;
  isVerificationDetailsFilled: boolean;
  previousEmployers: any[];
  banks: Bank[];
  references: Reference[];
  riskFactors: any[];
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt?: string;
  aadhaarNumber?: string;
  aadhaarReferenceId?: string;
  panCard?: string;
  dateOfBirth?: string;
  firstName?: string;
  fullName?: string;
  lastName?: string;
  mobile?: string;
  companyName?: string;
  employmentType?: string;
  monthlyIncome?: number;
  cibilScore?: number;
  profileImage?: string | { url: string; key: string };
  gender?: string;
  maritalStatus?: string;
  dependents?: number;
  education?: string;
  profession?: string;
  employerName?: string;
  designation?: string;
  officeEmail?: string;
  officePhone?: string;
  annualIncome?: number;
  workExperience?: number;
  residenceType?: string;
  yearsAtCurrentAddress?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  profile?: Profile;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redux state for profile
  const {
    profileData: reduxProfileData,
    loading: profileLoading,
    error: profileError,
    fetchProfile: reduxFetchProfile,
  } = useProfile();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Update local state from Redux
  useEffect(() => {
    if (reduxProfileData) {
      setProfileData(reduxProfileData);
      setEditedData(reduxProfileData);
      setImageLoadError(false);
    }
  }, [reduxProfileData]);

  useEffect(() => {
    setIsLoading(profileLoading);
  }, [profileLoading]);

  useEffect(() => {
    if (profileError) {
      setError(profileError);
    }
  }, [profileError]);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch profile using Redux
  const fetchProfile = async () => {
    const result = await reduxFetchProfile();

    if (result?.requiresAuth) {
      router.push('/login');
      return;
    }

    if (result?.success) {
      console.log('🟢 Profile data loaded successfully');
    }
  };

  const updateProfile = async () => {
    if (!editedData) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const token = await getToken();

      if (!token) {
        setError("No authentication token found");
        return;
      }

      // Prepare payload according to API format with null checks
      const currentAddress = editedData.currentAddress || {
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: ''
      };

      const permanentAddress = editedData.permanentAddressSame
        ? currentAddress
        : (editedData.permanentAddress || currentAddress);

      const payload = {
        fullName: editedData.fullName,
        dateOfBirth: editedData.dateOfBirth,
        gender: editedData.gender,
        maritalStatus: editedData.maritalStatus,
        dependents: editedData.dependents,
        education: editedData.education,
        profession: editedData.profession,
        monthlyIncome: editedData.monthlyIncome,
        currentAddress: {
          line1: currentAddress.line1 || '',
          line2: currentAddress.line2 || '',
          city: currentAddress.city || '',
          state: currentAddress.state || '',
          pincode: currentAddress.pincode || ''
        },
        permanentAddressSame: editedData.permanentAddressSame,
        permanentAddress: {
          line1: permanentAddress.line1 || '',
          line2: permanentAddress.line2 || '',
          city: permanentAddress.city || '',
          state: permanentAddress.state || '',
          pincode: permanentAddress.pincode || ''
        },
        emergencyContactName: editedData.emergencyContactName,
        emergencyContactPhone: editedData.emergencyContactPhone,
        emergencyContactRelation: editedData.emergencyContactRelation,
        profileImage: editedData.profileImage || ""
      };

      console.log('🔵 Updating profile...', payload);
      const response = await fetch(`${API_BASE_URL}/api/customer/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('🟢 Update Profile Response:', result);

      if (response.ok && result.success) {
        // Re-fetch profile data from API instead of using editedData
        await fetchProfile();
        setIsEditing(false);
        setSuccessMessage(result.message || 'Profile updated successfully');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error("❌ Failed to update profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Initialize editedData with safe defaults for address fields
    if (profileData) {
      setEditedData({
        ...profileData,
        currentAddress: profileData.currentAddress || { line1: '', line2: '', city: '', state: '', pincode: '' },
        permanentAddress: profileData.permanentAddress || { line1: '', line2: '', city: '', state: '', pincode: '' }
      });
    }
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset editedData with safe defaults for address fields
    if (profileData) {
      setEditedData({
        ...profileData,
        currentAddress: profileData.currentAddress || { line1: '', line2: '', city: '', state: '', pincode: '' },
        permanentAddress: profileData.permanentAddress || { line1: '', line2: '', city: '', state: '', pincode: '' }
      });
    }
    setError(null);
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedData) return;

    // Handle nested address fields
    if (field.startsWith('currentAddress.')) {
      const addressField = field.split('.')[1];
      setEditedData({
        ...editedData,
        currentAddress: {
          ...(editedData.currentAddress || { line1: '', line2: '', city: '', state: '', pincode: '' }),
          [addressField]: value
        }
      });
    } else if (field.startsWith('permanentAddress.')) {
      const addressField = field.split('.')[1];
      setEditedData({
        ...editedData,
        permanentAddress: {
          ...(editedData.permanentAddress || { line1: '', line2: '', city: '', state: '', pincode: '' }),
          [addressField]: value
        }
      });
    } else {
      setEditedData({
        ...editedData,
        [field]: value
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusColor = (kycStatus?: string) => {
    switch (kycStatus?.toUpperCase()) {
      case 'VERIFIED':
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800'; // Default to pending
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfileImageUrl = () => {
    if (!profileData?.profileImage) return null;
    return typeof profileData.profileImage === 'string'
      ? profileData.profileImage
      : profileData.profileImage.url;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setUploadError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    try {
      setIsUploadingImage(true);
      setUploadError(null);
      setError(null);

      const token = await getToken();
      if (!token) {
        setUploadError('No authentication token found');
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('profileImage', selectedImage);

      console.log('🔵 Uploading profile image...');
      const response = await fetch(`${API_BASE_URL}/api/customer/profile/update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      console.log('🟢 Upload Response:', result);

      if (response.ok && result.success) {
        setSuccessMessage(result.message || 'Profile image updated successfully!');

        // Update profile data with new image URL
        if (result.data?.url) {
          setProfileData(prev => prev ? {
            ...prev,
            profileImage: {
              url: result.data.url,
              key: result.data.key
            }
          } : null);
        }

        // Refresh profile data to get the latest
        await fetchProfile();

        // Clear preview and selected image
        setSelectedImage(null);
        setImagePreview(null);
        setImageLoadError(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setUploadError(result.message || 'Failed to upload image');
      }
    } catch (err: any) {
      console.error('❌ Failed to upload image:', err);
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadError(null);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "kyc", label: "KYC & Verification", icon: Shield },
    { id: "banking", label: "Banking & References", icon: CreditCard }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#25B181] mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border border-[#E0E0E0] max-w-md w-full mx-4"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
            Failed to Load Profile
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="w-full py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#4A66FF] hover:text-[#1565C0] mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F8F68]">My Profile</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">View and manage your personal information</p>
            </div>

            {/* Refresh Button (Edit disabled for read-only API) */}
            <button
              onClick={fetchProfile}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors shadow-sm disabled:opacity-50 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh</span>
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 sm:gap-3"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm sm:text-base">{successMessage}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 sm:gap-3"
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#E0E0E0] p-4 sm:p-6"
            >
              {/* Profile Picture */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="relative inline-block">
                  {/* Fallback Avatar (always rendered as background) */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                    {profileData.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>

                  {/* Profile Image (overlays fallback if available and loads successfully) */}
                  {(imagePreview || profileData?.profile?.s3URL) && (
                    <img
                      src={imagePreview || profileData?.profile?.s3URL}
                      alt="Profile"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full absolute top-0 left-0 object-cover border-4 border-white shadow-lg"
                      onError={() => {
                        console.error('❌ Failed to load profile image');
                        setImageLoadError(true);
                      }}
                      onLoad={() => console.log('✅ Profile image loaded successfully')}
                    />
                  )}


                  {/* Upload Button Overlay */}
                  {/* {!selectedImage && (
                      <label
                        htmlFor="profile-image-upload"
                        className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#4A66FF] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#1565C0] transition-colors group"
                      >
                        <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )} */}
                </div>

                {/* Upload Actions */}
                {selectedImage && (
                  <div className="mt-3 sm:mt-4 space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] mx-auto">
                      Selected: {selectedImage.name}
                    </p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={handleImageUpload}
                        disabled={isUploadingImage}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-all disabled:opacity-50 text-xs sm:text-sm"
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Upload
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelUpload}
                        disabled={isUploadingImage}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-2 sm:mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{uploadError}</p>
                  </div>
                )}

                <h2 className="mt-3 sm:mt-4 text-base sm:text-xl font-semibold text-gray-800 break-words">
                  {(
                    profileData.fullName ||
                    `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() ||
                    'User'
                  )
                    .toLowerCase()
                    .replace(/\b\w/g, char => char.toUpperCase())
                  }

                </h2>
                <p className="text-xs sm:text-sm text-gray-600 break-all">{profileData.email}</p>
                <p className="text-xs sm:text-sm text-gray-600">{profileData.mobile || 'N/A'}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">ID: {profileData.customerUniqueId}</p>
              </div>

              {/* CIBIL Score Section */}
              {profileData.cibilScore && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-600 mb-2">CIBIL Score</p>
                    <div className="relative inline-block">
                      <svg className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={
                            profileData.cibilScore >= 750 ? '#10B981' :
                              profileData.cibilScore >= 650 ? '#F59E0B' :
                                '#EF4444'
                          }
                          strokeWidth="8"
                          strokeDasharray={`${(profileData.cibilScore / 900) * 251.2} 251.2`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xl sm:text-2xl font-bold ${profileData.cibilScore >= 750 ? 'text-green-600' :
                            profileData.cibilScore >= 650 ? 'text-yellow-600' :
                              'text-red-600'
                          }`}>
                          {profileData.cibilScore}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full ${profileData.cibilScore >= 750 ? 'bg-green-100 text-green-700' :
                          profileData.cibilScore >= 650 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {profileData.cibilScore >= 750 ? 'Excellent' :
                          profileData.cibilScore >= 650 ? 'Good' :
                            'Fair'}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Out of 900</p>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-[#FAFAFA] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Account Status</span>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${profileData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {profileData.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                {/* KYC Status */}
                <div className="p-2 sm:p-3 bg-[#FAFAFA] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">KYC Status</span>
                    <span
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full
    ${profileData.isKycDetailsFilled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'}
  `}
                    >
                      {profileData.isKycDetailsFilled ? 'VERIFIED' : 'PENDING'}
                    </span>

                  </div>
                </div>

                {/* Risk Category */}
                <div className="p-2 sm:p-3 bg-[#FAFAFA] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Risk Category</span>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${profileData.riskCategory === 'LOW' ? 'bg-green-100 text-green-800' :
                        profileData.riskCategory === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {profileData.riskCategory || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="space-y-1.5 sm:space-y-2 pb-4 sm:pb-6 border-b border-[#E0E0E0]">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  {profileData.isEmailVerified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                  )}
                  <span className={profileData.isEmailVerified ? 'text-green-600' : 'text-red-600'}>
                    Email {profileData.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  {profileData.isMobileVerified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                  )}
                  <span className={profileData.isMobileVerified ? 'text-green-600' : 'text-red-600'}>
                    Mobile {profileData.isMobileVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              {/* Account Info */}
              <div className="mt-4 sm:mt-6 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                {/* <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A66FF] flex-shrink-0" />
                    <span>Role: {profileData.role}</span>
                  </div> */}
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A66FF] flex-shrink-0" />
                  <span>PAN: {profileData.isPanVerify ? 'Verified' : 'Not Verified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A66FF] flex-shrink-0" />
                  <span>Aadhaar: {profileData.isAadhaarVerify ? 'Verified' : 'Not Verified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A66FF] flex-shrink-0" />
                  <span className="break-words">Member Since: {formatDate(profileData.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#E0E0E0]"
            >
              {/* Tabs */}
              <div className="border-b border-[#E0E0E0]">
                <div className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-4 lg:px-6 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                          ? "border-[#2E7D32] text-[#25B181]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Personal Information Tab (includes Address & Employment) */}
                {activeTab === "personal" && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Personal Details Section */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#1F8F68] mb-4 sm:mb-6 flex items-center gap-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                        <InfoField
                          icon={<User className="w-5 h-5 text-[#4A66FF]" />}
                          label="Full Name"
                          value={
                            (
                              profileData.fullName ||
                              `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() ||
                              'N/A'
                            )
                              .toLowerCase()
                              .replace(/\b\w/g, char => char.toUpperCase())
                          }
                        />

                        <InfoField
                          icon={<Mail className="w-5 h-5 text-[#4A66FF]" />}
                          label="Email"
                          value={profileData.email || 'N/A'}
                        />
                        <InfoField
                          icon={<Phone className="w-5 h-5 text-[#4A66FF]" />}
                          label="Mobile"
                          value={profileData.mobile || 'N/A'}
                        />
                        <InfoField
                          icon={<Calendar className="w-5 h-5 text-[#4A66FF]" />}
                          label="Date of Birth"
                          value={profileData.dateOfBirth ? formatDate(profileData.dateOfBirth) : 'N/A'}
                        />
                        <InfoField
                          icon={<User className="w-5 h-5 text-[#4A66FF]" />}
                          label="Customer ID"
                          value={profileData.customerUniqueId || 'N/A'}
                        />
                        <InfoField
                          icon={<CheckCircle className="w-5 h-5 text-[#4A66FF]" />}
                          label="Reward Points"
                          value={profileData.points ? profileData.points.toLocaleString('en-IN') : '0'}
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#E0E0E0]"></div>

                    {/* Address Section */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#1F8F68] mb-4 sm:mb-6 flex items-center gap-2">
                        <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                        Address Information
                      </h3>

                      {(profileData.currentAddress?.city || profileData.currentAddress?.state || profileData.currentAddress?.pincode || profileData.currentAddress?.fullAddress) ? (
                        <div className="space-y-6">
                          {/* Current Address */}
                          <div>
                            <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A66FF]" />
                              Current Address
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                              {profileData.currentAddress?.fullAddress && (
                                <div className="sm:col-span-2 lg:col-span-3">
                                  <InfoField
                                    icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                    label="Full Address"
                                    value={profileData.currentAddress.fullAddress}
                                  />
                                </div>
                              )}
                              {profileData.currentAddress?.landmark && (
                                <InfoField
                                  icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                  label="Landmark"
                                  value={profileData.currentAddress.landmark}
                                />
                              )}
                              <InfoField
                                icon={<Building className="w-5 h-5 text-[#4A66FF]" />}
                                label="City"
                                value={profileData.currentAddress?.city || 'N/A'}
                              />
                              <InfoField
                                icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                label="State"
                                value={profileData.currentAddress?.state || 'N/A'}
                              />
                              <InfoField
                                icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                label="Pincode"
                                value={profileData.currentAddress?.pincode || 'N/A'}
                              />
                            </div>
                          </div>

                          {/* Permanent Address */}
                          {(profileData.permanentAddress?.city || profileData.permanentAddress?.state || profileData.permanentAddress?.pincode) && (
                            <div>
                              <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A66FF]" />
                                Permanent Address
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                {profileData.permanentAddress?.street && (
                                  <InfoField
                                    icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                    label="Street"
                                    value={profileData.permanentAddress.street}
                                  />
                                )}
                                <InfoField
                                  icon={<Building className="w-5 h-5 text-[#4A66FF]" />}
                                  label="City"
                                  value={profileData.permanentAddress?.city || 'N/A'}
                                />
                                <InfoField
                                  icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                  label="State"
                                  value={profileData.permanentAddress?.state || 'N/A'}
                                />
                                <InfoField
                                  icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                  label="Pincode"
                                  value={profileData.permanentAddress?.pincode || 'N/A'}
                                />
                              </div>
                            </div>
                          )}

                          {/* Office Address */}
                          {(profileData.officeAddress?.city || profileData.officeAddress?.state || profileData.officeAddress?.pincode) && (
                            <div>
                              <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A66FF]" />
                                Office Address
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                {profileData.officeAddress?.street && (
                                  <InfoField
                                    icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                    label="Street"
                                    value={profileData.officeAddress.street}
                                  />
                                )}
                                <InfoField
                                  icon={<Building className="w-5 h-5 text-[#4A66FF]" />}
                                  label="City"
                                  value={profileData.officeAddress?.city || 'N/A'}
                                />
                                <InfoField
                                  icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                  label="State"
                                  value={profileData.officeAddress?.state || 'N/A'}
                                />
                                <InfoField
                                  icon={<MapPin className="w-5 h-5 text-[#4A66FF]" />}
                                  label="Pincode"
                                  value={profileData.officeAddress?.pincode || 'N/A'}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 sm:py-8 bg-[#FAFAFA] rounded-lg">
                          <Home className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                          <p className="text-gray-500 text-sm sm:text-base">No address information added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#E0E0E0]"></div>

                    {/* Employment Section */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#1F8F68] mb-4 sm:mb-6 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                        Employment Information
                      </h3>

                      {(profileData.isEmploymentDetailsFilled || profileData.companyName || profileData.employmentType || profileData.monthlyIncome || profileData.profession || profileData.designation) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                          {profileData.companyName && (
                            <InfoField
                              icon={<Building className="w-5 h-5 text-[#4A66FF]" />}
                              label="Company Name"
                              value={profileData.companyName.toLowerCase()
                                .replace(/\b\w/g, char => char.toUpperCase())}
                            />
                          )}
                          {profileData.employmentType && (
                            <InfoField
                              icon={<FileText className="w-5 h-5 text-[#4A66FF]" />}
                              label="Employment Type"
                              value={profileData.employmentType}
                            />
                          )}
                          {profileData.profession && (
                            <InfoField
                              icon={<Briefcase className="w-5 h-5 text-[#4A66FF]" />}
                              label="Profession"
                              value={profileData.profession}
                            />
                          )}
                          {profileData.designation && (
                            <InfoField
                              icon={<User className="w-5 h-5 text-[#4A66FF]" />}
                              label="Designation"
                              value={profileData.designation}
                            />
                          )}
                          {profileData.monthlyIncome && (
                            <InfoField
                              icon={<CreditCard className="w-5 h-5 text-[#4A66FF]" />}
                              label="Monthly Income"
                              value={`₹${profileData.monthlyIncome.toLocaleString('en-IN')}`}
                            />
                          )}
                          {profileData.workExperience !== undefined && profileData.workExperience > 0 && (
                            <InfoField
                              icon={<Clock className="w-5 h-5 text-[#4A66FF]" />}
                              label="Work Experience"
                              value={`${profileData.workExperience} years`}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 sm:py-8 bg-[#FAFAFA] rounded-lg">
                          <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                          <p className="text-gray-500 text-sm sm:text-base">No employment information added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* KYC & Verification Tab */}
                {activeTab === "kyc" && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1F8F68] mb-4 sm:mb-6">KYC & Verification Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <InfoField
                        icon={<CreditCard className="w-5 h-5 text-[#4A66FF]" />}
                        label="PAN Card"
                        value={profileData.panCard || 'N/A'}
                      />
                      <div className="p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
                        <div className="flex items-start gap-3">
                          {profileData.isPanVerify ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">PAN Verification</p>
                            <p className={`font-medium ${profileData.isPanVerify ? 'text-green-600' : 'text-red-600'}`}>
                              {profileData.isPanVerify ? 'Verified' : 'Not Verified'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <InfoField
                        icon={<CreditCard className="w-5 h-5 text-[#4A66FF]" />}
                        label="Aadhaar Number"
                        value={profileData.aadhaarNumber ? `XXXX-XXXX-${profileData.aadhaarNumber.slice(-4)}` : 'N/A'}
                      />
                      <div className="p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
                        <div className="flex items-start gap-3">
                          {profileData.isAadhaarVerify ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Aadhaar Verification</p>
                            <p className={`font-medium ${profileData.isAadhaarVerify ? 'text-green-600' : 'text-red-600'}`}>
                              {profileData.isAadhaarVerify ? 'Verified' : 'Not Verified'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {profileData.aadhaarReferenceId && (
                        <InfoField
                          icon={<FileText className="w-5 h-5 text-[#4A66FF]" />}
                          label="Aadhaar Reference ID"
                          value={profileData.aadhaarReferenceId}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Banking & References Tab */}
                {activeTab === "banking" && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Banking Section */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#1F8F68] mb-4 sm:mb-6 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                        Banking Information
                      </h3>

                      {profileData.banks && profileData.banks.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                          {profileData.banks.map((bank, index) => (
                            <div key={bank._id} className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200">
                              <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A66FF]" />
                                Bank Account {index + 1}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <InfoField
                                  icon={<Building className="w-5 h-5 text-[#4A66FF]" />}
                                  label="Bank Name"
                                  value={bank.bankName}
                                />
                                <InfoField
                                  icon={<User className="w-5 h-5 text-[#4A66FF]" />}
                                  label="Account Holder Name"
                                  value={bank.accountHolderName}
                                />
                                <InfoField
                                  icon={<CreditCard className="w-5 h-5 text-[#4A66FF]" />}
                                  label="Account Number"
                                  value={`XXXX${bank.accountNumber.slice(-4)}`}
                                />
                                <InfoField
                                  icon={<FileText className="w-5 h-5 text-[#4A66FF]" />}
                                  label="IFSC Code"
                                  value={bank.ifscCode}
                                />
                                {bank.accountType && (
                                  <InfoField
                                    icon={<CreditCard className="w-5 h-5 text-[#4A66FF]" />}
                                    label="Account Type"
                                    value={bank.accountType}
                                  />
                                )}
                                {bank.pennyDropStatus && (
                                  <div className="p-3 sm:p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      {bank.pennyDropStatus === 'VERIFIED' ? (
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                      ) : (
                                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Verification Status</p>
                                        <p className={`font-medium text-xs sm:text-sm ${bank.pennyDropStatus === 'VERIFIED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                          {bank.pennyDropStatus}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 sm:py-8 bg-[#FAFAFA] rounded-lg">
                          <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                          <p className="text-gray-500 text-sm sm:text-base">No bank accounts added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    {/* <div className="border-t border-[#E0E0E0]"></div> */}

                    {/* References Section */}
                    {/* <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#1F8F68] mb-4 sm:mb-6 flex items-center gap-2">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                          References
                        </h3>

                        {profileData.references && profileData.references.length > 0 ? (
                          <div className="space-y-4 sm:space-y-6">
                            {profileData.references.map((reference, index) => (
                              <div key={reference._id} className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl border-2 border-purple-200">
                                <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                  Reference {index + 1}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                  <InfoField
                                    icon={<User className="w-5 h-5 text-purple-600" />}
                                    label="Name"
                                    value={reference.name}
                                  />
                                  <InfoField
                                    icon={<Phone className="w-5 h-5 text-purple-600" />}
                                    label="Mobile"
                                    value={reference.mobile}
                                  />
                                  <InfoField
                                    icon={<Users className="w-5 h-5 text-purple-600" />}
                                    label="Relationship"
                                    value={reference.relationship}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8 bg-[#FAFAFA] rounded-lg">
                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                            <p className="text-gray-500 text-sm sm:text-base">No references added yet</p>
                          </div>
                        )}
                      </div> */}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// InfoField Component (Read-only)
function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 sm:p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">{label}</p>
          <p className="font-medium text-gray-800 text-xs sm:text-sm break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}

// EditableField Component (Read/Edit mode)
function EditableField({
  icon,
  label,
  value,
  isEditing,
  onChange,
  type = 'text',
  options = []
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date' | 'tel' | 'select';
  options?: string[];
}) {
  if (!isEditing) {
    return <InfoField icon={icon} label={label} value={value} />;
  }

  return (
    <div className="p-4 bg-white rounded-lg border-2 border-[#1976D2]/30">
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <label className="text-xs text-gray-600 mb-2 block font-medium">{label}</label>
          {type === 'select' ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2] text-sm font-medium text-gray-800"
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2] text-sm font-medium text-gray-800"
            />
          )}
        </div>
      </div>
    </div>
  );
}
