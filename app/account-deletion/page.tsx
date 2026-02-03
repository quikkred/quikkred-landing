"use client";

import { useState } from "react";

type FormData = {
  fullName: string;
  mobile: string;
  email: string;
  reason: string;
  comments: string;
  confirmNoLoan: boolean;
};

type FormErrors = {
  fullName?: string;
  mobile?: string;
  email?: string;
  reason?: string;
  confirmNoLoan?: string;
};


const reasons = [
  "No longer need the service",
  "Privacy concerns",
  "Found a better alternative",
  "Too many notifications",
  "Difficult to use",
  "Other",
];

const AccountDeletion = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobile: "",
    email: "",
    reason: "",
    comments: "",
    confirmNoLoan: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.reason) {
      newErrors.reason = "Please select a reason";
    }

    if (!formData.confirmNoLoan) {
      newErrors.confirmNoLoan = "Confirmation is required";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("/api/user/account-deletion-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const data = await response.json();

      const ref =
        data?.referenceId ||
        `QRK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

      setReferenceId(ref);
      setSubmitted(true);

      console.log("Account deletion request:", formData);
    } catch (error) {
      console.error("Account deletion request failed:", error);
      alert("Something went wrong. Please try again later.");
    }
  };


  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            Request Submitted
          </h2>

          <p className="text-gray-600 mb-2">Your reference ID</p>
          <p className="font-mono text-lg font-bold text-gray-900 mb-4">
            {referenceId}
          </p>

          <p className="text-sm text-gray-600">
            Your account deletion request will be processed within
            <strong> 7–10 business days</strong>. You’ll receive a confirmation
            email once completed.
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Need help? <br />
            support@quikkred.com | +91 93119 13854
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow py-8 sm:py-12 lg:py-16 font-sora">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Account Deletion Request
            </h1>
            <p className="text-slate-600">We're sorry to see you go. Please fill out the form below to request account deletion.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Registered Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
                {errors.mobile && (
                  <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Registered Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Deletion <span className="text-red-400">*</span>
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all bg-white"
                >
                  <option value="">Select a reason</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <p className="text-xs text-red-500 mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  name="comments"
                  rows={3}
                  placeholder="Any additional feedback..."
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                />
              </div>

              {/* RBI Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                    </path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">RBI Compliance Notice</p>
                    <p className="text-xs text-amber-700 mt-1">
                      As per RBI guidelines, certain financial data must be retained for a minimum of 7 years for regulatory compliance. This data will be securely stored and not used for any other purpose.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmNoLoan"
                  name="confirmNoLoan"
                  checked={formData.confirmNoLoan}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-teal-500 border-slate-300 rounded focus:ring-teal-500"
                />
                <label className="text-sm text-slate-600">
                  I confirm that I do not have any active loan or outstanding balance
                  with Quikkred.<span className="text-red-500">*</span>
                </label>
                {errors.confirmNoLoan && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmNoLoan}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              >
                Submit Deletion Request
              </button>
            </form>
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">Need help? Contact us at</p>
            <p className="mt-2">
              <a className="text-teal-600 hover:text-teal-700 font-medium" href="mailto:support@quikkred.com">support@quikkred.com</a>
              <span className="text-slate-400 mx-2">|</span>
              <a className="text-teal-600 hover:text-teal-700 font-medium" href="tel: +91 93119 13854">+91 93119 13854</a>
            </p>
          </div>
        </div>
      </div>
    </main >
  );
};

export default AccountDeletion;
