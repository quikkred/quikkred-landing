"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, LayoutDashboard, ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface BreData {
  applicationNumber: string;
  applicationId: string;
  status: string; // "Approve" | "Reject"
  reason: string;
}

interface FinFactorStatusProps {
  visibility: boolean;
  loading: boolean;
  data: BreData | null;
  onContinue?: () => void;
}

const FinFactorStatus = ({ visibility, loading, data, onContinue }: FinFactorStatusProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 1. Handle Client-side hydration
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 2. Prevent background scrolling when modal is open
  useEffect(() => {
    if (visibility) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visibility]);

  // Handle Logic based on status
  const isApproved = data?.status?.toLowerCase() === "approve";
  // const isRejected = data?.status?.toLowerCase() === "reject"; // unused but available

  // Actions
  const handleDashboard = () => {
    router.push("/user");
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push("/kyc/next-step");
    }
  };

  // 3. Return null if not on client or not visible (handled inside AnimatePresence for exit animations)
  if (!mounted) return null;

  // 4. Render via Portal
  return createPortal(
    <AnimatePresence>
      {visibility && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 z-10"
          >
            {/* ---------------- LOADING STATE ---------------- */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75" />
                  <div className="relative bg-white p-4 rounded-full shadow-lg ring-1 ring-blue-50">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verifying Banking Data</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait while we securely verify your banking details. This will only take a few seconds.
                </p>
              </div>
            )}

            {/* ---------------- RESULT STATE ---------------- */}
            {!loading && data && (
              <div className="flex flex-col">
                {/* Header Graphic */}
                <div className={`h-32 flex items-center justify-center relative overflow-hidden
                  ${isApproved ? "bg-emerald-50" : "bg-red-50"}`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10" 
                       style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px'}} 
                  />
                  
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`relative z-10 p-4 rounded-full shadow-lg border-4 border-white
                      ${isApproved ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-12 h-12" />
                    ) : (
                      <XCircle className="w-12 h-12" />
                    )}
                  </motion.div>
                </div>

                {/* Content Body */}
                <div className="px-8 pt-6 pb-8 text-center">
                  <h2 className={`text-2xl font-bold mb-2 ${isApproved ? "text-emerald-950" : "text-gray-900"}`}>
                    {isApproved ? "Application Approved!" : "Application Rejected"}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {data.reason || (isApproved 
                      ? "Your banking analysis meets our criteria. Please proceed to the next step." 
                      : "Unfortunately, your profile does not meet our current eligibility criteria.")}
                  </p>

                  {/* Application Number Badge */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-8 inline-flex items-center gap-3 w-full justify-center">
                    <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-100">
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Application No</p>
                      <p className="text-sm font-semibold text-gray-800 font-mono">{data.applicationNumber}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {isApproved ? (
                      <button
                        onClick={handleContinue}
                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                      >
                        Continue Verification
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        onClick={handleDashboard}
                        className="w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Return to Dashboard
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FinFactorStatus;