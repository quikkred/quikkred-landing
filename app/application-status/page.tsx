"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Home,
  ArrowRight,
  Phone,
  Mail,
  FileText,
  RefreshCw,
  HelpCircle,
  Download,
  Calendar,
  Clock,
  AlertCircle,
  Search
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { Suspense } from "react";
import { getSession } from "next-auth/react";
import getToken from "@/lib/getToken";
import { QUICK_FORM_URL } from "@/lib/config";
import useAxios from "@/hooks/useAxios";
import { ApplicationInterface } from "@/interfaces/applicationInterface";

// Declare global types for tracking
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface ApplicationStatusData {
  status: string;
  loanNumber?: string;
  amount?: string;
  reason?: string;
}

// Fire tracking events for GTM + Facebook Pixel
function fireTrackingEvents(status: string, loanNumber?: string, amount?: string) {
  // GTM dataLayer event
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'application_status_viewed',
      application_status: status,
      loan_number: loanNumber || '',
      loan_amount: amount || '',
    });
  }

  // Google Ads conversion tracking
  if (typeof window !== 'undefined' && window.gtag) {
    if (status.toLowerCase() === 'approved') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-17796230994/application_approved',
        value: amount ? Number(amount) : 0,
        currency: 'INR',
      });
    }
  }

  // Facebook Pixel events
  if (typeof window !== 'undefined' && window.fbq) {
    if (status.toLowerCase() === 'approved') {
      window.fbq('track', 'Lead', {
        content_name: 'Loan Approved',
        loan_number: loanNumber || '',
        value: amount ? Number(amount) : 0,
        currency: 'INR',
      });
    } else {
      window.fbq('trackCustom', 'ApplicationDeclined', {
        content_name: 'Loan Declined',
        loan_number: loanNumber || '',
      });
    }
  }
}

function ApplicationStatusContent() {
  const router = useRouter();
  const axios = useAxios();
  const [statusData, setStatusData] = useState<ApplicationStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const trackedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const resolveStatus = async () => {
      // 1. Fast path — data handed off via localStorage by the apply flow /
      //    dashboard redirect. Show it instantly.
      const storedData = localStorage.getItem('applicationStatusData');
      if (storedData) {
        try {
          const raw = JSON.parse(storedData);
          // hooks/useStorage.ts persists values wrapped as { __type, value }
          // (used by the apply flow), while the dashboard writes a plain
          // object. Support both so loan number / amount always decode.
          const data =
            raw && typeof raw === 'object' && '__type' in raw && 'value' in raw
              ? raw.value
              : raw;
          // Only trust the fast path when it carries an EXPLICIT, valid status.
          // Previously a missing/garbled payload silently became "approved",
          // which fired the Meta "Lead/approved" conversion (and inflated the
          // pending-disbursement count) for applicants who never submitted.
          // If the status isn't a real value, drop through to the backend
          // lookup, which authoritatively gates on isSubmit.
          const handoffStatus = (data?.status || '').toLowerCase();
          if (handoffStatus === 'approved' || handoffStatus === 'rejected') {
            if (!cancelled) {
              setStatusData({
                status: handoffStatus,
                loanNumber: data?.loanNumber || "",
                amount: data?.amount || "",
                reason: data?.reason || ""
              });
            }
            // Clear the payload and flag that the applicant has seen their
            // status so the dashboard won't redirect back here (avoids a loop
            // when they click "Go to Dashboard").
            localStorage.removeItem('applicationStatusData');
            sessionStorage.setItem('applicationStatusSeen', '1');
            if (!cancelled) setIsLoading(false);
            return;
          }
          // Invalid/empty handoff — discard it and fall through.
          localStorage.removeItem('applicationStatusData');
        } catch (error) {
          console.error('Error parsing application status data:', error);
          // fall through to the backend lookup
        }
      }

      // 2. Fallback — no handoff data (refresh or direct visit). Fetch the
      //    latest application for the logged-in customer from the backend so
      //    we show real status instead of "No Application Found".
      try {
        const token = await getToken();
        if (!token) {
          if (!cancelled) { setNoData(true); setIsLoading(false); }
          return;
        }

        const response = await axios.get('/api/v2/applicationByCustomerToken', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        const app = (result?.data?.[0] || result?.data) as ApplicationInterface | undefined;

        if (!app || (Array.isArray(app) && app.length === 0) || !app.status) {
          if (!cancelled) { setNoData(true); setIsLoading(false); }
          return;
        }

        // Gate on isSubmit: only show a final approved/rejected status — and
        // therefore only fire the Meta "Lead/approved" ad conversion that feeds
        // the pending-disbursement count — once the customer has actually
        // submitted. A half-finished application (status set by BRE but
        // isSubmit=false) must not be counted as an approved conversion.
        if (!app.isSubmit) {
          if (!cancelled) { setNoData(true); setIsLoading(false); }
          return;
        }

        // Status can come back as "REJECTED" or "Reject" — match any REJECT* form.
        const isRejected =
          (app.status || '').toUpperCase().includes('REJECT') ||
          app.breHistory?.breStatus === 'REJECTED';

        if (!cancelled) {
          setStatusData({
            status: isRejected ? 'rejected' : 'approved',
            loanNumber: app.applicationNumber || '',
            amount: isRejected
              ? ''
              : String(app.approvedLoanAmount || app.breApprovedLoanAmount || ''),
            reason: isRejected
              ? app.breHistory?.breStatus === 'REJECTED'
                ? 'Bank statement verification was not approved.'
                : 'Your application does not meet eligibility criteria.'
              : '',
          });
          sessionStorage.setItem('applicationStatusSeen', '1');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
        if (!cancelled) { setNoData(true); setIsLoading(false); }
      }
    };

    resolveStatus();
    return () => { cancelled = true; };
  }, [axios]);

  // Fire tracking events after statusData is set and page has rendered
  useEffect(() => {
    if (statusData && !trackedRef.current) {
      trackedRef.current = true;
      fireTrackingEvents(statusData.status, statusData.loanNumber, statusData.amount);
    }
  }, [statusData]);

  // Fire page view tracking even when no data (so GTM/Pixel can detect the page)
  useEffect(() => {
    if (noData) {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'application_status_page_view',
          has_data: false,
        });
      }
    }
  }, [noData]);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No application data - show proper page instead of redirecting
  if (noData || !statusData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-8">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
          >
            <Link href="/" className="hover:text-[#4A66FF] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-[#4A66FF] font-medium">Application Status</span>
          </motion.nav>
        </div>

        <section className="container mx-auto px-4 py-8 lg:py-16">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E0E0E0] shadow-sm text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                No Application Found
              </h1>
              <p className="text-gray-600 mb-8">
                We couldn&apos;t find any recent application status. This could happen if you&apos;ve already viewed it or accessed this page directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={"/apply/quick"}>
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Apply for Loan
                  </button>
                </Link>
                <Link href="/">
                  <button className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center">
                    <Home className="w-5 h-5 mr-2" />
                    Go Home
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  const { status, loanNumber, amount, reason } = statusData;
  const isApproved = status.toLowerCase() === "approved";

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
        >
          <Link href="/" className="hover:text-[#4A66FF] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-[#4A66FF] font-medium">Application Status</span>
        </motion.nav>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {isApproved ? (
            /* Approved Status UI */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-full mb-8 shadow-lg"
              >
                <CheckCircle className="w-14 h-14 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-5xl font-bold font-sora mb-4 text-[#25B181]"
              >
                Congratulations!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-700 mb-8"
              >
                Your loan application has been{" "}
                <span className="font-bold text-[#25B181]">approved</span>
              </motion.p>

              {/* Application Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm mb-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {loanNumber && (
                    <div className="text-center p-4 bg-[#FAFAFA] rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Loan Number</p>
                      <p className="text-lg font-bold text-[#1F8F68]">{loanNumber}</p>
                    </div>
                  )}
                  {amount && (
                    <div className="text-center p-4 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-xl text-white">
                      <p className="text-sm opacity-90 mb-1">Approved Amount</p>
                      <p className="text-2xl font-bold">₹{Number(amount).toLocaleString("en-IN")}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-[#25B181]/10 rounded-lg border border-[#25B181]/20">
                  <div className="flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#25B181] mr-2" />
                    <span className="text-sm font-medium text-[#25B181]">
                      Amount will be disbursed within 24-48 hours
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm mb-8"
              >
                <h2 className="text-xl font-bold mb-6 text-[#1F8F68] flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Next Steps
                </h2>

                <div className="space-y-4 text-left">


                  <div className="flex items-start p-4 bg-[#FAFAFA] rounded-lg">
                    <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Bank Verification</p>
                      <p className="text-sm text-gray-600">Verify your bank account for fund transfer</p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-[#FAFAFA] rounded-lg">
                    <div className="w-8 h-8 bg-[#25B181] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Receive Funds</p>
                      <p className="text-sm text-gray-600">Loan amount will be credited to your account</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/user">
                  <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            /* Rejected Status UI */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Rejected Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-8 shadow-lg"
              >
                <XCircle className="w-14 h-14 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-5xl font-bold font-sora mb-4 text-red-500"
              >
                Application Declined
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-700 mb-8"
              >
                We&apos;re sorry, your loan application could not be approved at this time
              </motion.p>

              {/* Rejection Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm mb-8"
              >
                {loanNumber && (
                  <div className="text-center p-4 bg-[#FAFAFA] rounded-xl mb-6">
                    <p className="text-sm text-gray-600 mb-1">Application Number</p>
                    <p className="text-lg font-bold text-gray-800">{loanNumber}</p>
                  </div>
                )}

                {reason && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100 mb-6">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-medium text-red-700 mb-1">Reason for Decline</p>
                        <p className="text-sm text-red-600">{reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-[#4A66FF]/10 rounded-lg border border-[#4A66FF]/20">
                  <div className="flex items-start">
                    <HelpCircle className="w-5 h-5 text-[#4A66FF] mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-[#4A66FF] mb-1">What does this mean?</p>
                      <p className="text-sm text-gray-700">
                        This decision is based on our current eligibility criteria. You may be eligible to apply again after 60 days.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Things You Can Do */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm mb-8"
              >
                <h2 className="text-xl font-bold mb-6 text-[#1F8F68] flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  What You Can Do
                </h2>

                <div className="space-y-4 text-left">
                  <div className="flex items-start p-4 bg-[#FAFAFA] rounded-lg">
                    <div className="w-8 h-8 bg-[#4A66FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Improve Credit Score</p>
                      <p className="text-sm text-gray-600">Pay your existing dues on time to improve your credit score</p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-[#FAFAFA] rounded-lg">
                    <div className="w-8 h-8 bg-[#4A66FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Clear Outstanding Debts</p>
                      <p className="text-sm text-gray-600">Reduce your debt-to-income ratio by clearing existing loans</p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-[#FAFAFA] rounded-lg">
                    <div className="w-8 h-8 bg-[#4A66FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Reapply After 60 Days</p>
                      <p className="text-sm text-gray-600">You can submit a new application after the cooling period</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/user">
                  <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </button>
                </Link>
                <Link href="/">
                  <button className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center">
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ApplicationStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ApplicationStatusContent />
    </Suspense>
  );
}
