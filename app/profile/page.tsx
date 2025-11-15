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

interface Address {
  city: string;
  state: string;
  pincode: string;
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
  accountType: string;
  _id: string;
}

interface Reference {
  name: string;
  mobile: string;
  relationship: string;
  _id: string;
}

interface ProfileData {
  _id: string;
  customerUniqueId: string;
  role: string;
  isMobileVerified: boolean;
  email: string;
  isEmailVerified: boolean;
  isPanVerify: boolean;
  isAadhaarVerify: boolean;
  currentAddress: Address;
  permanentAddress: Address;
  officeAddress: Address;
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
  cibilHistory: any[];
  references: Reference[];
  riskFactors: any[];
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt?: string;
  companyName?: string;
  designation?: string;
  employmentType?: string;
  monthlyIncome?: number;
  workExperienceMonths?: number;
  dateOfBirth?: string;
  firstName?: string;
  fullName?: string;
  gender?: string;
  lastName?: string;
  maritalStatus?: string;
  panCard?: string;
  aadhaarNumber?: string;
  aadhaarReferenceId?: string;
  mobile?: string;
  profileImage?: string | { url: string; key: string };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
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
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
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
    if (!selectedImage || !profileData?._id) return;

    try {
      setIsUploadingImage(true);
      setUploadError(null);
      setError(null);

      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        setUploadError('No authentication token found');
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('profileImage', selectedImage);

      console.log('🔵 Uploading profile image...');
      const response = await fetch(`https://api.bluechipfinmax.com/api/customer/update/${profileData._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      console.log('🟢 Upload Response:', result);

      if (response.ok && result.success) {
        setSuccessMessage('Profile image updated successfully!');

        // Refresh profile data to get the new image URL
        // await fetchProfile(); // TODO: Implement fetchProfile function

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
    { id: "address", label: "Address", icon: Home },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "kyc", label: "KYC & Verification", icon: Shield },
    { id: "banking", label: "Banking", icon: CreditCard },
    { id: "references", label: "References", icon: Users }
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
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#4A66FF] hover:text-[#1565C0] mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1F8F68]">My Profile</h1>
                <p className="text-gray-600 mt-2">View and manage your personal information</p>
              </div>

              {/* Refresh Button (Edit disabled for read-only API) */}
              <button
                onClick={() => window.location.reload()}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Loading...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">{successMessage}</p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </motion.div>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6"
              >
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {/* Fallback Avatar (always rendered as background) */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {profileData.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>

                    {/* Profile Image (overlays fallback if available and loads successfully) */}
                    {(imagePreview || (profileData.profileImage && !imageLoadError)) && (
                      <img
                        src={imagePreview || (
                          typeof profileData.profileImage === 'string'
                            ? profileData.profileImage
                            : profileData.profileImage?.url
                        )}
                        alt="Profile"
                        className="w-32 h-32 rounded-full absolute top-0 left-0 object-cover border-4 border-white shadow-lg"
                        onError={() => {
                          console.error('Failed to load profile image');
                          setImageLoadError(true);
                        }}
                        onLoad={() => console.log('✅ Profile image loaded successfully')}
                      />
                    )}

                    {/* Upload Button Overlay */}
                    {!selectedImage && (
                      <label
                        htmlFor="profile-image-upload"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#4A66FF] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#1565C0] transition-colors group"
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Upload Actions */}
                  {selectedImage && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        Selected: {selectedImage.name}
                      </p>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={handleImageUpload}
                          disabled={isUploadingImage}
                          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-all disabled:opacity-50 text-sm"
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Upload
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelUpload}
                          disabled={isUploadingImage}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Error */}
                  {uploadError && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-600">{uploadError}</p>
                    </div>
                  )}

                  <h2 className="mt-4 text-xl font-semibold text-gray-800">
                    {profileData.fullName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'User'}
                  </h2>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                  <p className="text-sm text-gray-600">{profileData.mobile || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {profileData.customerUniqueId}</p>
                </div>

                {/* Account Status */}
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-[#FAFAFA] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Account Status</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${profileData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {profileData.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>

                  {/* KYC Status */}
                  <div className="p-3 bg-[#FAFAFA] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">KYC Status</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(profileData.kycStatus)}`}>
                        {profileData.kycStatus || 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Risk Category */}
                  <div className="p-3 bg-[#FAFAFA] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Risk Category</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        profileData.riskCategory === 'LOW' ? 'bg-green-100 text-green-800' :
                        profileData.riskCategory === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {profileData.riskCategory || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="space-y-2 pb-6 border-b border-[#E0E0E0]">
                  <div className="flex items-center gap-2 text-sm">
                    {profileData.isEmailVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={profileData.isEmailVerified ? 'text-green-600' : 'text-red-600'}>
                      Email {profileData.isEmailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {profileData.isMobileVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={profileData.isMobileVerified ? 'text-green-600' : 'text-red-600'}>
                      Mobile {profileData.isMobileVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#4A66FF]" />
                    <span>Role: {profileData.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4A66FF]" />
                    <span>PAN: {profileData.isPanVerify ? 'Verified' : 'Not Verified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4A66FF]" />
                    <span>Aadhaar: {profileData.isAadhaarVerify ? 'Verified' : 'Not Verified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#4A66FF]" />
                    <span>Member Since: {formatDate(profileData.createdAt)}</span>
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
                className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0]"
              >
                {/* Tabs */}
                <div className="border-b border-[#E0E0E0]">
                  <div className="flex space-x-8 px-6 overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-[#2E7D32] text-[#25B181]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Personal Information Tab */}
                  {activeTab === "personal" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F8F68] mb-6">Personal Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <InfoField
                          icon={<User className="w-5 h-5 text-[#4A66FF]" />}
                          label="Full Name"
                          value={profileData.fullName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'N/A'}
                        />
                        <InfoField
                          icon={<User className="w-5 h-5 text-[#4A66FF]" />}
                          label="First Name"
                          value={profileData.firstName || 'N/A'}
                        />
                        <InfoField
                          icon={<User className="w-5 h-5 text-[#4A66FF]" />}
                          label="Last Name"
                          value={profileData.lastName || 'N/A'}
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
                          label="Gender"
                          value={profileData.gender || 'N/A'}
                        />
                        <InfoField
                          icon={<Users className="w-5 h-5 text-[#4A66FF]" />}
                          label="Marital Status"
                          value={profileData.maritalStatus || 'N/A'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Address Tab */}
                  {activeTab === "address" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F8F68] mb-6">Address Information</h3>

                      {/* Current Address */}
                      <div className="mb-8">
                        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Home className="w-5 h-5 text-[#4A66FF]" />
                          Current Address
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6">
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
                      <div className="mb-8">
                        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Home className="w-5 h-5 text-[#4A66FF]" />
                          Permanent Address
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6">
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

                      {/* Office Address */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Building className="w-5 h-5 text-[#4A66FF]" />
                          Office Address
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6">
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
                    </div>
                  )}

                  {/* Employment Tab */}
                  {activeTab === "employment" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F8F68] mb-6">Employment Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <InfoField
                          icon={<Building className="w-5 h-5 text-[#4A66FF]" />}
                          label="Company Name"
                          value={profileData.companyName || 'N/A'}
                        />
                        <InfoField
                          icon={<Briefcase className="w-5 h-5 text-[#4A66FF]" />}
                          label="Designation"
                          value={profileData.designation || 'N/A'}
                        />
                        <InfoField
                          icon={<FileText className="w-5 h-5 text-[#4A66FF]" />}
                          label="Employment Type"
                          value={profileData.employmentType || 'N/A'}
                        />
                        <InfoField
                          icon={<CreditCard className="w-5 h-5 text-[#4A66FF]" />}
                          label="Monthly Income"
                          value={profileData.monthlyIncome ? `₹${profileData.monthlyIncome.toLocaleString('en-IN')}` : 'N/A'}
                        />
                        <InfoField
                          icon={<Clock className="w-5 h-5 text-[#4A66FF]" />}
                          label="Work Experience"
                          value={profileData.workExperienceMonths ? `${profileData.workExperienceMonths} months` : 'N/A'}
                        />
                      </div>
                    </div>
                  )}

                  {/* KYC & Verification Tab */}
                  {activeTab === "kyc" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F8F68] mb-6">KYC & Verification Details</h3>

                      <div className="grid md:grid-cols-2 gap-6">
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

                  {/* Banking Tab */}
                  {activeTab === "banking" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F8F68] mb-6">Banking Information</h3>

                      {profileData.banks && profileData.banks.length > 0 ? (
                        <div className="space-y-6">
                          {profileData.banks.map((bank, index) => (
                            <div key={bank._id} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#4A66FF]" />
                                Bank Account {index + 1}
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
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
                                <InfoField
                                  icon={<CreditCard className="w-5 h-5 text-[#4A66FF]" />}
                                  label="Account Type"
                                  value={bank.accountType}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No bank accounts added yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* References Tab */}
                  {activeTab === "references" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F8F68] mb-6">References</h3>

                      {profileData.references && profileData.references.length > 0 ? (
                        <div className="space-y-6">
                          {profileData.references.map((reference, index) => (
                            <div key={reference._id} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                Reference {index + 1}
                              </h4>
                              <div className="grid md:grid-cols-3 gap-4">
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
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No references added yet</p>
                        </div>
                      )}
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
    <div className="p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="font-medium text-gray-800">{value}</p>
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
