"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Trash2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Home,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function AccountDeletionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    reason: "",
    confirmDelete: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.confirmDelete) {
      alert("Please confirm that you want to delete your account");
      return;
    }

    // Send email to support
    const emailBody = `
Account Deletion Request

Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Reason: ${formData.reason}

This is an automated account deletion request from quikkred.in/account-deletion
    `.trim();

    const mailtoLink = `mailto:support@quikkred.in?subject=Account Deletion Request - ${formData.fullName}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Request Submitted</h2>
          <p className="text-gray-600 mb-8">
            Your account deletion request has been submitted. Our team will process it within 7 working days and send you a confirmation email.
          </p>
          <Link href="/">
            <button className="w-full bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white py-3.5 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Account Deletion Request</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're sorry to see you go. Please fill out the form below to request account deletion.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Important Information</h3>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Account deletion is permanent and cannot be undone</li>
                <li>• All your personal data, loan history, and documents will be deleted</li>
                <li>• Active loans must be fully repaid before account deletion</li>
                <li>• Processing time: 7 working days</li>
                <li>• You will receive a confirmation email once processed</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-transparent outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-transparent outline-none transition-all"
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Deletion (Optional)
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Help us improve by sharing why you're leaving..."
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="confirmDelete"
                checked={formData.confirmDelete}
                onChange={handleChange}
                required
                className="mt-1 w-5 h-5 text-[#25B181] border-gray-300 rounded focus:ring-[#25B181]"
              />
              <label className="text-sm text-gray-700">
                I understand that this action is permanent and all my data will be deleted. I have no active loans or outstanding payments.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
            >
              Submit Deletion Request
            </button>
          </form>
        </motion.div>

        {/* RBI Compliance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#25B181]" />
            <span className="font-semibold">RBI Compliant Data Deletion</span>
          </div>
          <p className="max-w-2xl mx-auto">
            As per RBI guidelines and data protection regulations, we ensure secure deletion of all personal and financial information within the stipulated timeframe.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs">
            <Link href="/policies/privacy-policy" className="hover:text-[#25B181] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#25B181] transition-colors">
              Contact Support
            </Link>
            <span>•</span>
            <a href="mailto:support@quikkred.in" className="hover:text-[#25B181] transition-colors">
              support@quikkred.in
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
