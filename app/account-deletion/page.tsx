"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function AccountDeletionPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    reason: "",
    comments: "",
    confirmNoLoan: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate mobile number
      if (!/^[0-9]{10}$/.test(formData.mobile)) {
        setError("Please enter a valid 10-digit mobile number");
        setIsSubmitting(false);
        return;
      }

      // Generate reference ID
      const refId =
        "DEL-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).substr(2, 4).toUpperCase();

      // TODO: Send to backend API
      // const response = await fetch('/api/user/account-deletion-request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setReferenceId(refId);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit request. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <main className="flex-grow py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                Account Deletion Request
              </h1>
              <p className="text-slate-600">
                We're sorry to see you go. Please fill out the form below to request account
                deletion.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Registered Mobile */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Registered Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      required
                      pattern="[0-9]{10}"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Registered Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Reason for Deletion <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all bg-white"
                    >
                      <option value="">Select a reason</option>
                      <option value="no-longer-need">No longer need the service</option>
                      <option value="privacy-concerns">Privacy concerns</option>
                      <option value="found-alternative">Found a better alternative</option>
                      <option value="too-many-notifications">Too many notifications</option>
                      <option value="difficult-to-use">Difficult to use</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Additional Comments */}
                  <div>
                    <label
                      htmlFor="comments"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      rows={3}
                      value={formData.comments}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                      placeholder="Any additional feedback..."
                    />
                  </div>

                  {/* RBI Compliance Notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-amber-800">RBI Compliance Notice</p>
                        <p className="text-xs text-amber-700 mt-1">
                          As per RBI guidelines, certain financial data must be retained for a
                          minimum of 7 years for regulatory compliance. This data will be securely
                          stored and not used for any other purpose.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Active Loan Confirmation */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirmNoLoan"
                      name="confirmNoLoan"
                      required
                      checked={formData.confirmNoLoan}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-teal-500 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="confirmNoLoan" className="text-sm text-slate-600">
                      I confirm that I do not have any active loan or outstanding balance with
                      Quikkred. <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Deletion Request"}
                  </motion.button>
                </form>
              ) : (
                /* Success Message */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Request Submitted Successfully
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Your reference ID:{" "}
                    <span className="font-mono font-bold text-teal-600">{referenceId}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    We will process your request within 7-10 business days. You will receive a
                    confirmation email once completed.
                  </p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-8 text-center">
              <p className="text-slate-600 text-sm">Need help? Contact us at</p>
              <p className="mt-2">
                <a
                  href="mailto:support@quikkred.com"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  support@quikkred.com
                </a>
                <span className="text-slate-400 mx-2">|</span>
                <a
                  href="tel:+919311913854"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  +91 93119 13854
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
