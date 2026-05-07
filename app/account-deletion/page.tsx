"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { toast } from "@/components/ui/toast";
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL, COMPANY_EMAIL_SUPPORT } from "@/lib/constants/companyInfo";

// Validation Schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required").defined(""),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required").defined(""),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required").defined(""),
  reason: yup.string().required("Please select a reason").defined(""),
  comments: yup.string().defined(""),
  confirmNoLoan: yup
    .boolean()
    .oneOf([true], "Confirmation is required")
    .required("Confirmation is required").defined(),
});

type FormData = yup.InferType<typeof schema>;

const reasons = [
  "No longer need the service",
  "Privacy concerns",
  "Found a better alternative",
  "Too many notifications",
  "Difficult to use",
  "Other",
];

const AccountDeletion = () => {
  const axios = useAxios();
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      reason: "",
      comments: "",
      confirmNoLoan: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("/api/account-deletion-request/create", data);
      const responseData = response.data;

      if (response.status === 200 || response.status === 201) {
        const ref =
          responseData?.referenceId ||
          `QRK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

        setReferenceId(ref);
        setSubmitted(true);
        toast({
          variant: "success",
          title: "Request submitted",
          description: "Your account deletion request has been received.",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        reset();
      }
    } catch (error: any) {
      console.error("Account deletion request failed:", error);
      if (error instanceof AxiosError) {
        toast({
          variant: "error",
          title: error.response?.data?.message || "Request Failed",
          description: "Something went wrong. Please try again later.",
        });
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
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
            {COMPANY_EMAIL_SUPPORT} | {COMPANY_PHONE_DISPLAY}
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
            <p className="text-slate-600">
              We're sorry to see you go. Please fill out the form below to request account deletion.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? "border-red-500" : "border-slate-200"
                    } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all`}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
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
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.mobile ? "border-red-500" : "border-slate-200"
                    } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all`}
                  {...register("mobile")}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/\D/g, "");
                  }}
                />
                {errors.mobile && (
                  <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>
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
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-slate-200"
                    } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Deletion <span className="text-red-400">*</span>
                </label>
                <select
                  id="reason"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.reason ? "border-red-500" : "border-slate-200"
                    } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all bg-white`}
                  {...register("reason")}
                >
                  <option value="">Select a reason</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any additional feedback..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                  {...register("comments")}
                />
              </div>

              {/* RBI Notice */}
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
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      RBI Compliance Notice
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      As per RBI guidelines, certain financial data must be retained
                      for a minimum of 7 years for regulatory compliance. This data
                      will be securely stored and not used for any other purpose.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmNoLoan"
                  className="mt-1 w-4 h-4 text-teal-500 border-slate-300 rounded focus:ring-teal-500"
                  {...register("confirmNoLoan")}
                />
                <label htmlFor="confirmNoLoan" className="text-sm text-slate-600">
                  I confirm that I do not have any active loan or outstanding balance
                  with Quikkred.<span className="text-red-500">*</span>
                </label>
              </div>
              {errors.confirmNoLoan && (
                <p className="text-xs text-red-500 ml-7 mt-1">
                  {errors.confirmNoLoan.message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Deletion Request"
                )}
              </button>
            </form>
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">Need help? Contact us at</p>
            <p className="mt-2">
              <a
                className="text-teal-600 hover:text-teal-700 font-medium"
                href={`mailto:${COMPANY_EMAIL_SUPPORT}`}
              >
                {COMPANY_EMAIL_SUPPORT}
              </a>
              <span className="text-slate-400 mx-2">|</span>
              <a
                className="text-teal-600 hover:text-teal-700 font-medium"
                href={`tel:${COMPANY_PHONE_TEL}`}
              >
                {COMPANY_PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountDeletion;