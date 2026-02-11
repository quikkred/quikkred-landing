"use client";

import {
  Biohazard,
  Bot,
  Clock,
  Mail,
  Phone,
  User,
  MessageSquare,
  Tag,
  Upload,
  TriangleAlert,
  ChevronDown,
  File,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useState, DragEvent, ChangeEvent } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from "@/components/ui/toast";
import useAxios from "@/hooks/useAxios";
import { AxiosError } from "axios";

// 1. Imports for React Hook Form and Yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createPortal } from "react-dom";

// 2. Define Validation Schema
const complaintSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(70, "Name cannot exceed 70 characters")
    .matches(/^[A-Za-z\s]+$/, "Name should contain only alphabets").defined(""),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/,
      "Please enter a valid email address (e.g., .com, .in, .org)"
    ).defined(""),
  mobile: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits").defined(""),
  complaintType: yup.string().required("Please select a complaint category").defined(""),
  description: yup
    .string()
    .required("Complaint details are required")
    .max(1000, "Description cannot exceed 1000 characters").defined(""),
  // We will manage files via RHF but strictly validate size in the handler
  attachments: yup.array().of(yup.mixed<File>()).optional().defined(undefined),
});

// Type inference
type ComplaintFormValues = yup.InferType<typeof complaintSchema>;

export default function ComplaintPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 3. Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axios = useAxios();

  // 4. Setup React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      complaintType: "",
      description: "",
      attachments: [],
    },
  });

  // Watchers for UI updates
  const descriptionValue = watch("description") || "";
  const uploadedFiles = (watch("attachments") as File[]) || [];

  // --- File Handling Logic (Connected to RHF) ---
  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB limit and was not added.`,
          variant: "error",
        });
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      // Append new files to existing RHF state
      setValue("attachments", [...uploadedFiles, ...validFiles]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    e.target.value = ""; // Reset input
  };

  const removeFile = (fileName: string) => {
    const filtered = uploadedFiles.filter((f) => f.name !== fileName);
    setValue("attachments", filtered);
  };

  // --- Drag and Drop Logic ---
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  // --- Submit Handler ---
  const onSubmit = async (data: ComplaintFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("email", data.email.trim());
      formData.append("mobile", data.mobile.trim());
      formData.append("complaintType", data.complaintType.trim());
      formData.append("description", data.description.trim());

      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file: any) => {
          // Explicit cast because we know it's a File from our handler
          if (file instanceof File) {
            formData.append("attachment", file as File);
          }
        });
      }

      const response = await axios.postForm("/api/complaint/register", formData);
      const resData = response.data;

      if (response.status === 200 || response.status === 201 || resData.success) {
        const randomId = Math.floor(100000 + Math.random() * 900000).toString();
        setComplaintId(randomId);
        setShowSuccess(true);

        // Reset Form
        reset();
        setShowUpload(false);
      } else {
        toast({
          title: "Submission Failed",
          description: resData.message || "An error occurred.",
          variant: "error",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg = error.response?.data?.message || "Unable to submit your complaint.";
        console.error(error);
        toast({
          title: "Network Error",
          description: msg,
          variant: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Reset Logic ---
  const handleResetRequest = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    reset(); // RHF Reset
    setShowUpload(false);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-5">
      <div className="max-w-[1400px] mx-auto">
        {/* Warning Banner */}
        <div className="bg-[#fff3cd] border-2 border-[#ffc107] rounded-xl py-3 px-[30px] mb-7 shadow-[0_4px_12px_rgba(255,193,7,0.15)]">
          <p className="text-[#856404] text-sm leading-[1.6] mb-1 flex items-center gap-3">
            <Biohazard className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>Before submitting:</strong> Please provide as much detail as possible.
            </span>
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Left Side (Static Content) */}
          <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] h-fit order-2 lg:order-1">
            <h2 className="text-[#2d3748] text-[28px] mb-5 font-bold">
              We're Here to Help
            </h2>
            <DotLottieReact src="/Support.lottie" loop autoplay />
            <p className="text-[#4a5568] text-[15px] leading-[1.8] mb-5">
              Your feedback and concerns are important to us.
            </p>
            {/* ... Other static content remains exactly the same ... */}
            <div className="bg-[#e6f7ff] border-l-4 border-[#1890ff] p-4 px-5 rounded-lg mt-5">
              <p className="text-[#0050b3] text-sm font-medium m-0">
                <Clock /> Average Response Time: 24-48 hours
              </p>
            </div>
            {/* Contact Methods... */}
            <div className="bg-[#f7fafc] p-6 rounded-xl mt-[30px]">
              <h3 className="text-[#2d3748] text-lg mb-4 font-semibold">
                Alternative Contact Methods
              </h3>
              <div className="flex items-center gap-3 mb-3.5 text-[#4a5568] text-sm">
                <Mail color="teal" /> <span>support@quikkred.in</span>
              </div>
              <div className="flex items-center gap-3 mb-3.5 text-[#4a5568] text-sm">
                <Phone color="teal" /> <span>+91-9311913854</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] order-1 lg:order-2">
            <h2 className="text-[#2d3748] text-2xl mb-6 font-bold">
              Complaint Submission Form
            </h2>

            {/* FORM START */}
            <form onSubmit={handleSubmit(onSubmit)} id="complaintForm">

              {/* Name Field */}
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Full Name <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" size={20} />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="off"
                    className={`w-full p-3 pl-11 pr-4 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white focus:outline-none ${errors.name
                      ? "border-[#e53e3e] focus:border-[#e53e3e] focus:shadow-[0_0_0_3px_rgba(229,62,62,0.1)]"
                      : "border-[#e2e8f0] focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                      }`}
                  />
                </div>
                {errors.name && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <TriangleAlert size={16} /> <span>{errors.name.message}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Email Address <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" size={20} />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="your.email@example.com"
                    autoComplete="off"
                    className={`w-full p-3 pl-11 pr-4 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white focus:outline-none ${errors.email
                      ? "border-[#e53e3e] focus:border-[#e53e3e] focus:shadow-[0_0_0_3px_rgba(229,62,62,0.1)]"
                      : "border-[#e2e8f0] focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                      }`}
                  />
                </div>
                {errors.email && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <TriangleAlert size={16} /> <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Phone Number <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" size={20} />
                  <input
                    {...register("mobile")}
                    type="tel"
                    placeholder="0123456789"
                    maxLength={10}
                    autoComplete="off"
                    className={`w-full p-3 pl-11 pr-4 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white focus:outline-none ${errors.mobile
                      ? "border-[#e53e3e] focus:border-[#e53e3e] focus:shadow-[0_0_0_3px_rgba(229,62,62,0.1)]"
                      : "border-[#e2e8f0] focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                      }`}
                  />
                </div>
                {errors.mobile && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <TriangleAlert size={16} /> <span>{errors.mobile.message}</span>
                  </div>
                )}
              </div>

              {/* Complaint Category */}
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Complaint Category <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" size={20} />
                  <select
                    {...register("complaintType")}
                    className={`w-full p-3 pl-11 pr-10 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white cursor-pointer appearance-none focus:outline-none focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)] ${errors.complaintType ? "border-[#e53e3e]" : "border-[#e2e8f0]"
                      }`}
                  >
                    <option value="">Select a category</option>
                    <option value="Disbursement & Application related">Disbursement & Application related</option>
                    <option value="Repayment & billing">Repayment & billing</option>
                    <option value="Collection & Behaviour">Collection & Behaviour</option>
                    <option value="Technical & Accounts">Technical & Accounts</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none" size={16} />
                </div>
                {errors.complaintType && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <TriangleAlert size={16} /> <span>{errors.complaintType.message}</span>
                  </div>
                )}
              </div>

              {/* Complaint Details */}
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Complaint Details <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-[#718096]" size={20} />
                  <textarea
                    {...register("description")}
                    placeholder="Please describe your complaint in detail..."
                    maxLength={1000}
                    className={`w-full p-3 pl-11 pr-4 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white resize-y min-h-[120px] focus:outline-none focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)] ${errors.description ? "border-[#e53e3e]" : "border-[#e2e8f0]"
                      }`}
                  />
                </div>
                <div className="text-right text-[13px] text-[#718096] mt-[-4.5]">
                  <span>{descriptionValue.length}</span>/1000 characters
                </div>
                {errors.description && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <TriangleAlert size={16} /> <span>{errors.description.message}</span>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Do you want to upload supporting documents?
                </label>

                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpload(!showUpload);
                      if (showUpload) {
                        setValue("attachments", []); // Clear files when toggling off
                      }
                    }}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${showUpload ? "bg-teal-500" : "bg-gray-300"
                      }`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${showUpload ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-[#4a5568] font-medium">
                    {showUpload ? "Yes, I want to upload documents" : "No, skip this step"}
                  </span>
                </div>

                {showUpload && (
                  <>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${isDragging
                        ? "border-[#14b8a6] bg-[#d1fae5]"
                        : "border-[#cbd5e0] bg-[#f7fafc] hover:border-[#14b8a6] hover:bg-[#d1fae5]"
                        }`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="fileInput"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="fileInput" className="cursor-pointer">
                        <Upload className="mx-auto" />
                        <p className="text-[#4a5568] text-sm mb-1">
                          <strong>Click to upload</strong> or drag and drop
                        </p>
                        <span className="text-[#718096] text-xs">
                          PDF, JPG, PNG, DOC (Max 5MB)
                        </span>
                      </label>
                    </div>
                    <div>
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2.5 px-3.5 bg-[#f7fafc] rounded-md mt-2.5 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <File size={16} className="text-teal-500" strokeWidth={1.5} />
                            <span>{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.name)}
                            className="bg-none border-none text-[#e53e3e] cursor-pointer text-lg p-1 leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3.5 mt-[30px]">
                <button
                  type="button"
                  onClick={handleResetRequest}
                  disabled={isSubmitting}
                  className="flex-1 p-3.5 px-6 border-2 border-[#e2e8f0] rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 bg-white text-[#4a5568] hover:bg-[#f7fafc] disabled:opacity-50"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 p-3.5 px-6 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(20,184,166,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl max-w-[500px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]">
              <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-5">
                <Check size={40} className="text-white" strokeWidth={4} />
              </div>
              <h3 className="text-[#2d3748] text-2xl mb-3">
                Complaint Submitted Successfully!
              </h3>
              <p className="text-[#4a5568] text-[15px] mb-2">
                Your complaint has been registered.
              </p>
              <div className="bg-[#f7fafc] p-3 px-5 rounded-lg text-lg font-bold text-[#14b8a6] my-5">
                Complaint ID: #{complaintId}
              </div>
              <p className="text-sm text-[#718096]">
                We'll review your complaint and contact you within 24-48 hours.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-[#14b8a6] text-white border-none p-3 px-[30px] rounded-lg text-base font-semibold cursor-pointer mt-2.5 hover:bg-[#0f9f88]"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-[380px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="text-[#2d3748] text-lg mb-2 font-bold text-center">
              Reset Form?
            </h3>
            <p className="text-[#4a5568] text-sm mb-5 text-center">
              All entered data will be lost and cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-4 border-2 border-[#e2e8f0] rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 bg-white text-[#4a5568] hover:bg-[#f7fafc]"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-2 px-4 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 bg-red-500 text-white hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}