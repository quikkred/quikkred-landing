"use client";
import { Biohazard, Bot, Clock, Mail, Phone } from "lucide-react";
import { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ComplaintForm() {
  const [charCount, setCharCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 5MB.`);
        return;
      }
      setUploadedFiles((prev) => [...prev, file]);
    });
    e.target.value = "";
  };
  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const nameError = validateName(formData.get("name") as string);
    const emailError = validateEmail(formData.get("email") as string);
    const phoneError = validatePhone(formData.get("phone") as string);

    if (nameError || emailError || phoneError) {
      setErrors({ name: nameError, email: emailError, phone: phoneError });
      return;
    }

    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    setComplaintId(randomId);
    setShowSuccess(true);
    form.reset();
    setUploadedFiles([]);
    setCharCount(0);
    setErrors({ name: "", email: "", phone: "" });
  };
  const handleReset = () => {
    setShowResetConfirm(true);
    // Small delay to ensure modal is rendered before scrolling
    setTimeout(() => {
      const modalElement = document.querySelector(
        ".fixed.inset-0.bg-black\\/50",
      ) as HTMLElement;
      if (modalElement) {
        modalElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };
  const confirmReset = () => {
    const form = document.getElementById("complaintForm") as HTMLFormElement;
    form.reset();
    setUploadedFiles([]);
    setCharCount(0);
    setShowUpload(false);
    setShowResetConfirm(false);
  };
  const validateName = (value: string) => {
    if (value.length === 0) return "";
    if (!/^[A-Za-z\s]+$/.test(value)) {
      return "Name should contain only alphabets";
    }
    if (value.length < 3) {
      return "Name must be at least 3 characters";
    }
    if (value.length > 70) {
      return "Name cannot exceed 70 characters";
    }
    return "";
  };

  const validateEmail = (value: string) => {
    if (value.length === 0) return "";
    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in)$/.test(value)
    ) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (value: string) => {
    if (value.length === 0) return "";
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrors((prev) => ({ ...prev, name: validateName(value) }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
  };
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
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 5MB.`);
        return;
      }
      setUploadedFiles((prev) => [...prev, file]);
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-5">
      <div className="max-w-[1400px] mx-auto">
        {/* Warning Banner */}
        <div className="bg-[#fff3cd] border-2 border-[#ffc107] rounded-xl p-5 px-[30px] mb-7 shadow-[0_4px_12px_rgba(255,193,7,0.15)]">
          <p className="text-[#856404] text-sm leading-[1.6] mb-1 flex items-start gap-2.5">
            <Biohazard className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>Before submitting:</strong> Please provide as much detail
              as possible to help us resolve your issue quickly. All complaints
              are handled confidentially.
            </span>
          </p>
        </div>
        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Left Side - Message Section */}
          <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] h-fit">
            <h2 className="text-[#2d3748] text-[28px] mb-5 font-bold">
              We're Here to Help
            </h2>
            <DotLottieReact src="/Support.lottie" loop autoplay />
            <p className="text-[#4a5568] text-[15px] leading-[1.8] mb-5">
              Your feedback and concerns are important to us. We're committed to
              providing transparent, fair, and efficient AI-powered lending
              services.
            </p>
            <p className="text-[#4a5568] text-[15px] leading-[1.8] mb-5">
              Our dedicated complaint resolution team reviews every submission
              carefully and works to address your concerns promptly and fairly.
            </p>
            <p className="text-[#4a5568] text-[15px] leading-[1.8] mb-5">
              If you have questions about our AI decision-making process,
              interest rates, loan terms, or any aspect of our service, please
              don't hesitate to reach out.
            </p>
            <div className="bg-[#e6f7ff] border-l-4 border-[#1890ff] p-4 px-5 rounded-lg mt-5">
              <p className="text-[#0050b3] text-sm font-medium m-0">
                <Clock /> Average Response Time: 24-48 hours
              </p>
            </div>
            <div className="bg-[#f7fafc] p-6 rounded-xl mt-[30px]">
              <h3 className="text-[#2d3748] text-lg mb-4 font-semibold">
                Alternative Contact Methods
              </h3>
              <div className="flex items-center gap-3 mb-3.5 text-[#4a5568] text-sm">
                <Mail color="teal" />
                <span>support@quikkred.in</span>
              </div>
              <div className="flex items-center gap-3 mb-3.5 text-[#4a5568] text-sm">
                <Phone color="teal" />
                <span>+91-9311913854</span>
              </div>
              <div className="flex items-center gap-3 mb-3.5 text-[#4a5568] text-sm">
                <Bot color="teal" />
                <span>Live chat available on our website</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-5 rounded-xl mt-5 text-center">
              <h4 className="text-base mb-2">Customer Support Hours</h4>
              <p className="text-sm text-white/95 m-0">
                Monday - Saturday: 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
          {/* Right Side - Form Section */}
          <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <h2 className="text-[#2d3748] text-2xl mb-6 font-bold">
              Complaint Submission Form
            </h2>
            <form onSubmit={handleSubmit} id="complaintForm">
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Full Name <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="off"
                  placeholder="Enter your full name"
                  onChange={handleNameChange}
                  className={`w-full p-3 px-4 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white focus:outline-none ${
                    errors.name
                      ? "border-[#e53e3e] focus:border-[#e53e3e] focus:shadow-[0_0_0_3px_rgba(229,62,62,0.1)]"
                      : "border-[#e2e8f0] focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                  }`}
                />
                {errors.name && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1L1 15H15L8 1Z"
                        fill="#e53e3e"
                        opacity="0.1"
                      />
                      <path
                        d="M8 6V9M8 11H8.01"
                        stroke="#e53e3e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Email Address <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  placeholder="your.email@example.com"
                  onChange={handleEmailChange}
                  className={`w-full p-3 px-4 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white focus:outline-none ${
                    errors.email
                      ? "border-[#e53e3e] focus:border-[#e53e3e] focus:shadow-[0_0_0_3px_rgba(229,62,62,0.1)]"
                      : "border-[#e2e8f0] focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                  }`}
                />
                {errors.email && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1L1 15H15L8 1Z"
                        fill="#e53e3e"
                        opacity="0.1"
                      />
                      <path
                        d="M8 6V9M8 11H8.01"
                        stroke="#e53e3e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Phone Number <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="off"
                  placeholder="+1 (555) 000-0000"
                  onChange={handlePhoneChange}
                  maxLength={10}
                  className={`w-full p-3 px-4 border-2 rounded-lg text-[15px] transition-all duration-300 bg-white focus:outline-none ${
                    errors.phone
                      ? "border-[#e53e3e] focus:border-[#e53e3e] focus:shadow-[0_0_0_3px_rgba(229,62,62,0.1)]"
                      : "border-[#e2e8f0] focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                  }`}
                />
                {errors.phone && (
                  <div className="mt-2 flex items-center gap-2 text-[#e53e3e] text-sm animate-[slideDown_0.2s_ease]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1L1 15H15L8 1Z"
                        fill="#e53e3e"
                        opacity="0.1"
                      />
                      <path
                        d="M8 6V9M8 11H8.01"
                        stroke="#e53e3e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Complaint Category{" "}
                  <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <select
                  required
                  className="w-full p-3 px-4 pr-10 border-2 border-[#e2e8f0] rounded-lg text-[15px] transition-all duration-300 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%234a5568%27 d=%27M6 9L1 4h10z%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_16px_center] focus:outline-none focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                >
                  <option value="">Select a category</option>
                  <option value="Disbursement">
                    Disbursement and Application related
                  </option>
                  <option value="Repayment">Repayment and billing</option>
                  <option value="Collection">Collection and Behaviour</option>
                  <option value="Technical">Technical and Accounts</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Complaint Details{" "}
                  <span className="text-[#e53e3e] ml-1">*</span>
                </label>
                <textarea
                  required
                  placeholder="Please describe your complaint in detail. Include dates, times, and any relevant information..."
                  maxLength={1000}
                  onChange={handleTextareaChange}
                  className="w-full p-3 px-4 border-2 border-[#e2e8f0] rounded-lg text-[15px] transition-all duration-300 bg-white resize-y min-h-[120px] focus:outline-none focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
                />
                <div className="text-right text-[13px] text-[#718096] mt-[-3.5]">
                  <span>{charCount}</span>/1000 characters
                </div>
              </div>
              <div className="mb-6">
                <label className="block font-semibold text-[#2d3748] mb-2 text-sm">
                  Do you want to upload supporting documents?
                </label>

                {/* Toggle Button */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpload(!showUpload);
                      if (showUpload) {
                        setUploadedFiles([]); // Clear files when toggling off
                      }
                    }}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
                      showUpload ? "bg-teal-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                        showUpload ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-[#4a5568] font-medium">
                    {showUpload
                      ? "Yes, I want to upload documents"
                      : "No, skip this step"}
                  </span>
                </div>

                {/* Upload Section - Only shown when toggle is ON */}
                {showUpload && (
                  <>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
                        isDragging
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
                        <svg
                          className="mx-auto mb-2.5 opacity-60"
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M32 15L20 3L8 15"
                            stroke="#14b8a6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20 3V25"
                            stroke="#14b8a6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M35 25V35C35 35.5304 34.7893 36.0391 34.4142 36.4142C34.0391 36.7893 33.5304 37 33 37H7C6.46957 37 5.96086 36.7893 5.58579 36.4142C5.21071 36.0391 5 35.5304 5 35V25"
                            stroke="#14b8a6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
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
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 2H3C2.46957 2 1.96086 2.21071 1.58579 2.58579C1.21071 2.96086 1 3.46957 1 4V12C1 12.5304 1.21071 13.0391 1.58579 13.4142C1.96086 13.7893 2.46957 14 3 14H11C11.5304 14 12.0391 13.7893 12.4142 13.4142C12.7893 13.0391 13 12.5304 13 12V6L9 2Z"
                                stroke="#14b8a6"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M9 2V6H13"
                                stroke="#14b8a6"
                                strokeWidth="1.5"
                              />
                            </svg>
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
              <div className="flex gap-3.5 mt-[30px]">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 p-3.5 px-6 border-2 border-[#e2e8f0] rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 bg-white text-[#4a5568] hover:bg-[#f7fafc]"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3.5 px-6 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(20,184,166,0.4)]"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
          <div className="bg-white p-10 rounded-2xl max-w-[500px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]">
            <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 20L16 28L32 12"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
        </div>
      )}
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-[380px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
