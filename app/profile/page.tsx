"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, Calendar, MapPin, Building,
  Edit2, Save, X, Camera, Shield, CheckCircle,
  AlertCircle, FileText, CreditCard, Briefcase,
  Home, Upload, Loader2, ArrowLeft, Clock,
  CheckCircle2, XCircle, Globe, Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  profession: string;
  education: string;
  monthlyIncome: number;
  dependents: number;
  currentAddress?: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  permanentAddress?: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  permanentAddressSame: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  profileImage: string | { url: string; key: string };
  role: string;
  status: string;
  kycStatus?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  emailVerifiedAt?: string;
  mobileVerifiedAt?: string;
  preferredLanguage: string;
  createdAt: string;
  verify: boolean;
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        setError("No authentication token found");
        return;
      }

      console.log('🔵 Fetching profile from API...');
      const response = await fetch('https://api.bluechipfinmax.com/api/customer/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('🟢 Profile API Response:', result);

      if (response.ok && result.success && result.data) {
        setProfileData(result.data);
        setEditedData(result.data);
        setImageLoadError(false); // Reset image error state on new profile load
      } else {
        setError(result.message || 'Failed to load profile data');
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch profile:", err);
      setError(err.message || "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!editedData) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
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
      const response = await fetch('https://api.bluechipfinmax.com/api/customer/profile', {
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
    { id: "address", label: "Address", icon: Home },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "emergency", label: "Emergency Contact", icon: Phone }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#2E7D32] mx-auto mb-4" />
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
            className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
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
              className="flex items-center gap-2 text-[#1976D2] hover:text-[#1565C0] mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1B5E20]">My Profile</h1>
                <p className="text-gray-600 mt-2">View and manage your personal information</p>
              </div>

              {/* Edit/Save/Cancel Buttons */}
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={updateProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
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
                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#1976D2] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#1565C0] transition-colors group"
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
                    {profileData.fullName || 'User'}
                  </h2>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                  <p className="text-sm text-gray-600">{profileData.mobile}</p>
                </div>

                {/* Account Status */}
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-[#FAFAFA] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Account Status</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(profileData.status)}`}>
                        {profileData.status || 'UNKNOWN'}
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
                    <Shield className="w-4 h-4 text-[#1976D2]" />
                    <span>Role: {profileData.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#1976D2]" />
                    <span>Language: {profileData.preferredLanguage?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1976D2]" />
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
                            ? "border-[#2E7D32] text-[#2E7D32]"
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
                      <h3 className="text-lg font-semibold text-[#1B5E20] mb-6">Personal Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <EditableField
                          icon={<User className="w-5 h-5 text-[#1976D2]" />}
                          label="Full Name"
                          value={isEditing ? editedData?.fullName || '' : profileData.fullName || 'N/A'}
                          isEditing={isEditing}
                          onChange={(value) => handleInputChange('fullName', value)}
                        />
                        <InfoField
                          icon={<Mail className="w-5 h-5 text-[#1976D2]" />}
                          label="Email"
                          value={profileData.email || 'N/A'}
                        />
                        <InfoField
                          icon={<Phone className="w-5 h-5 text-[#1976D2]" />}
                          label="Mobile"
                          value={profileData.mobile || 'N/A'}
                        />
                        <EditableField
                          icon={<Calendar className="w-5 h-5 text-[#1976D2]" />}
                          label="Date of Birth"
                          value={isEditing ? (editedData?.dateOfBirth?.split('T')[0] || '') : profileData.dateOfBirth ? formatDate(profileData.dateOfBirth) : 'N/A'}
                          isEditing={isEditing}
                          type="date"
                          onChange={(value) => handleInputChange('dateOfBirth', value)}
                        />
                        <EditableField
                          icon={<User className="w-5 h-5 text-[#1976D2]" />}
                          label="Gender"
                          value={isEditing ? editedData?.gender || '' : profileData.gender || 'N/A'}
                          isEditing={isEditing}
                          type="select"
                          options={['MALE', 'FEMALE', 'OTHER']}
                          onChange={(value) => handleInputChange('gender', value)}
                        />
                        <EditableField
                          icon={<Users className="w-5 h-5 text-[#1976D2]" />}
                          label="Marital Status"
                          value={isEditing ? editedData?.maritalStatus || '' : profileData.maritalStatus || 'N/A'}
                          isEditing={isEditing}
                          type="select"
                          options={['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']}
                          onChange={(value) => handleInputChange('maritalStatus', value)}
                        />
                        <EditableField
                          icon={<Users className="w-5 h-5 text-[#1976D2]" />}
                          label="Dependents"
                          value={isEditing ? editedData?.dependents?.toString() || '0' : profileData.dependents?.toString() || '0'}
                          isEditing={isEditing}
                          type="number"
                          onChange={(value) => handleInputChange('dependents', parseInt(value) || 0)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Address Tab */}
                  {activeTab === "address" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1B5E20] mb-6">Address Information</h3>

                      {/* Current Address */}
                      <div className="mb-8">
                        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Home className="w-5 h-5 text-[#1976D2]" />
                          Current Address
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <EditableField
                              icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                              label="Address Line 1"
                              value={isEditing ? editedData?.currentAddress?.line1 || '' : profileData.currentAddress?.line1 || 'N/A'}
                              isEditing={isEditing}
                              onChange={(value) => handleInputChange('currentAddress.line1', value)}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <EditableField
                              icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                              label="Address Line 2"
                              value={isEditing ? editedData?.currentAddress?.line2 || '' : profileData.currentAddress?.line2 || 'N/A'}
                              isEditing={isEditing}
                              onChange={(value) => handleInputChange('currentAddress.line2', value)}
                            />
                          </div>
                          <EditableField
                            icon={<Building className="w-5 h-5 text-[#1976D2]" />}
                            label="City"
                            value={isEditing ? editedData?.currentAddress?.city || '' : profileData.currentAddress?.city || 'N/A'}
                            isEditing={isEditing}
                            onChange={(value) => handleInputChange('currentAddress.city', value)}
                          />
                          <EditableField
                            icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                            label="State"
                            value={isEditing ? editedData?.currentAddress?.state || '' : profileData.currentAddress?.state || 'N/A'}
                            isEditing={isEditing}
                            onChange={(value) => handleInputChange('currentAddress.state', value)}
                          />
                          <EditableField
                            icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                            label="Pincode"
                            value={isEditing ? editedData?.currentAddress?.pincode || '' : profileData.currentAddress?.pincode || 'N/A'}
                            isEditing={isEditing}
                            onChange={(value) => handleInputChange('currentAddress.pincode', value)}
                          />
                        </div>
                      </div>

                      {/* Permanent Address Same Checkbox */}
                      {isEditing && (
                        <div className="mb-6">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editedData?.permanentAddressSame || false}
                              onChange={(e) => handleInputChange('permanentAddressSame', e.target.checked)}
                              className="w-4 h-4 text-[#2E7D32] border-gray-300 rounded focus:ring-[#2E7D32]"
                            />
                            Permanent address is same as current address
                          </label>
                        </div>
                      )}

                      {/* Permanent Address */}
                      {!((isEditing ? editedData?.permanentAddressSame : profileData.permanentAddressSame)) && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Home className="w-5 h-5 text-[#1976D2]" />
                            Permanent Address
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <EditableField
                                icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                                label="Address Line 1"
                                value={isEditing ? editedData?.permanentAddress?.line1 || '' : profileData.permanentAddress?.line1 || 'N/A'}
                                isEditing={isEditing}
                                onChange={(value) => handleInputChange('permanentAddress.line1', value)}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <EditableField
                                icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                                label="Address Line 2"
                                value={isEditing ? editedData?.permanentAddress?.line2 || '' : profileData.permanentAddress?.line2 || 'N/A'}
                                isEditing={isEditing}
                                onChange={(value) => handleInputChange('permanentAddress.line2', value)}
                              />
                            </div>
                            <EditableField
                              icon={<Building className="w-5 h-5 text-[#1976D2]" />}
                              label="City"
                              value={isEditing ? editedData?.permanentAddress?.city || '' : profileData.permanentAddress?.city || 'N/A'}
                              isEditing={isEditing}
                              onChange={(value) => handleInputChange('permanentAddress.city', value)}
                            />
                            <EditableField
                              icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                              label="State"
                              value={isEditing ? editedData?.permanentAddress?.state || '' : profileData.permanentAddress?.state || 'N/A'}
                              isEditing={isEditing}
                              onChange={(value) => handleInputChange('permanentAddress.state', value)}
                            />
                            <EditableField
                              icon={<MapPin className="w-5 h-5 text-[#1976D2]" />}
                              label="Pincode"
                              value={isEditing ? editedData?.permanentAddress?.pincode || '' : profileData.permanentAddress?.pincode || 'N/A'}
                              isEditing={isEditing}
                              onChange={(value) => handleInputChange('permanentAddress.pincode', value)}
                            />
                          </div>
                        </div>
                      )}

                      {((isEditing ? editedData?.permanentAddressSame : profileData.permanentAddressSame)) && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Permanent address is same as current address
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Employment Tab */}
                  {activeTab === "employment" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1B5E20] mb-6">Employment Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <EditableField
                          icon={<Briefcase className="w-5 h-5 text-[#1976D2]" />}
                          label="Profession"
                          value={isEditing ? editedData?.profession || '' : profileData.profession || 'N/A'}
                          isEditing={isEditing}
                          onChange={(value) => handleInputChange('profession', value)}
                        />
                        <EditableField
                          icon={<FileText className="w-5 h-5 text-[#1976D2]" />}
                          label="Education"
                          value={isEditing ? editedData?.education || '' : profileData.education || 'N/A'}
                          isEditing={isEditing}
                          type="select"
                          options={['HIGH_SCHOOL', 'DIPLOMA', 'GRADUATE', 'POSTGRADUATE', 'DOCTORATE']}
                          onChange={(value) => handleInputChange('education', value)}
                        />
                        <EditableField
                          icon={<CreditCard className="w-5 h-5 text-[#1976D2]" />}
                          label="Monthly Income"
                          value={isEditing ? editedData?.monthlyIncome?.toString() || '' : profileData.monthlyIncome ? `₹${profileData.monthlyIncome.toLocaleString('en-IN')}` : 'N/A'}
                          isEditing={isEditing}
                          type="number"
                          onChange={(value) => handleInputChange('monthlyIncome', parseFloat(value) || 0)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Emergency Contact Tab */}
                  {activeTab === "emergency" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#1B5E20] mb-6">Emergency Contact</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <EditableField
                          icon={<User className="w-5 h-5 text-[#1976D2]" />}
                          label="Contact Name"
                          value={isEditing ? editedData?.emergencyContactName || '' : profileData.emergencyContactName || 'N/A'}
                          isEditing={isEditing}
                          onChange={(value) => handleInputChange('emergencyContactName', value)}
                        />
                        <EditableField
                          icon={<Phone className="w-5 h-5 text-[#1976D2]" />}
                          label="Contact Phone"
                          value={isEditing ? editedData?.emergencyContactPhone || '' : profileData.emergencyContactPhone || 'N/A'}
                          isEditing={isEditing}
                          type="tel"
                          onChange={(value) => handleInputChange('emergencyContactPhone', value)}
                        />
                        <EditableField
                          icon={<Users className="w-5 h-5 text-[#1976D2]" />}
                          label="Relationship"
                          value={isEditing ? editedData?.emergencyContactRelation || '' : profileData.emergencyContactRelation || 'N/A'}
                          isEditing={isEditing}
                          onChange={(value) => handleInputChange('emergencyContactRelation', value)}
                        />
                      </div>
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
