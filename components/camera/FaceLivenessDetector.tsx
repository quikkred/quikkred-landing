"use client";

import { useState, useEffect, useCallback } from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { ThemeProvider } from "@aws-amplify/ui-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, RefreshCw, Fingerprint } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import getToken from "@/lib/getToken";
import { configureAmplify } from "@/lib/aws-amplify-config";
import "@aws-amplify/ui-react/styles.css";

// Configure Amplify on module load
configureAmplify();

interface FaceLivenessProps {
  onSuccess: (result: LivenessResult) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  customerId?: string;
}

interface LivenessResult {
  isLive: boolean;
  confidence: number;
  faceMatchStatus?: boolean;
  faceMatchSimilarity?: number;
}

type DetectorState = "loading" | "ready" | "verifying" | "success" | "error";

// Comprehensive Amplify UI theme — override ALL default colors to Quikkred green
const amplifyTheme = {
  name: "quikkred-liveness",
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: "#f0fdf7" },
          20: { value: "#dcfce7" },
          40: { value: "#86efac" },
          60: { value: "#51C9AF" },
          80: { value: "#25B181" },
          90: { value: "#1a8a63" },
          100: { value: "#0f5c42" },
        },
      },
      background: {
        primary: { value: "#ffffff" },
        secondary: { value: "#f8faf9" },
      },
    },
    fonts: {
      default: {
        variable: { value: "'Inter', system-ui, -apple-system, sans-serif" },
        static: { value: "'Inter', system-ui, -apple-system, sans-serif" },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: "#25B181" },
          color: { value: "#ffffff" },
          borderColor: { value: "#25B181" },
          _hover: {
            backgroundColor: { value: "#1a8a63" },
            borderColor: { value: "#1a8a63" },
          },
          _active: {
            backgroundColor: { value: "#0f5c42" },
          },
          _focus: {
            borderColor: { value: "#51C9AF" },
            boxShadow: { value: "0 0 0 3px rgba(37, 177, 129, 0.3)" },
          },
        },
      },
    },
    radii: {
      small: { value: "0.5rem" },
      medium: { value: "0.75rem" },
      large: { value: "1rem" },
    },
  },
};

// Framer-motion variants
const fadeScale = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

const slideUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const popIn = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20, delay: 0.1 },
  },
};

const pulseRing = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 0.2, 0.6],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export default function FaceLiveness({
  onSuccess,
  onError,
  onCancel,
  customerId,
}: FaceLivenessProps) {
  const [state, setState] = useState<DetectorState>("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const createSession = useCallback(async () => {
    setState("loading");
    setErrorMsg("");
    setSessionId(null);

    try {
      const token = await getToken();
      if (!token) {
        setErrorMsg("Authentication required. Please login again.");
        setState("error");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/kyc/face/rekognition/create-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data?.sessionId) {
        setSessionId(data.data.sessionId);
        setState("ready");
      } else {
        setErrorMsg(data.message || "Failed to create liveness session");
        setState("error");
      }
    } catch (err) {
      console.error("Create session error:", err);
      setErrorMsg("Failed to initialize. Please check your connection.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    createSession();
  }, [createSession]);

  const handleAnalysisComplete = useCallback(async () => {
    if (!sessionId) return;

    setState("verifying");

    try {
      const token = await getToken();
      if (!token) {
        setErrorMsg("Session expired. Please login again.");
        setState("error");
        onError("Authentication required");
        return;
      }

      const url = new URL(
        `${API_BASE_URL}/api/kyc/face/rekognition/session-result/${sessionId}`
      );
      if (customerId) {
        url.searchParams.set("customerId", customerId);
      }

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success && data.data?.livenessStatus) {
        setState("success");
        onSuccess({
          isLive: true,
          confidence: data.data.livenessConfidence || data.data.confidence,
          faceMatchStatus: data.data.faceMatchStatus,
          faceMatchSimilarity: data.data.faceMatchSimilarity,
        });
      } else {
        const msg = data.message || "Verification failed. Please try again.";
        setErrorMsg(msg);
        setState("error");
        onError(msg);
      }
    } catch (err) {
      console.error("Session result error:", err);
      const msg = "Verification failed. Please try again.";
      setErrorMsg(msg);
      setState("error");
      onError(msg);
    }
  }, [sessionId, customerId, onSuccess, onError]);

  const handleRetry = () => {
    setState("loading");
    setErrorMsg("");
    createSession();
  };

  return (
    <div className="face-liveness-wrapper relative overflow-hidden w-full">
      <AnimatePresence mode="wait">
        {/* ── Loading State ── */}
        {state === "loading" && (
          <motion.div
            key="loading"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center py-10 sm:py-14"
          >
            <div className="relative mb-5">
              <motion.div
                variants={pulseRing}
                animate="animate"
                className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#25B181]"
              />
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#25B181] to-[#51C9AF] rounded-full flex items-center justify-center shadow-lg shadow-[#25B181]/20">
                <Fingerprint className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <motion.p
              variants={slideUp}
              initial="initial"
              animate="animate"
              className="text-gray-800 font-semibold text-sm sm:text-base"
            >
              Preparing verification...
            </motion.p>
            <motion.p
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.15 }}
              className="text-gray-400 text-xs sm:text-sm mt-1"
            >
              Setting up secure face scan
            </motion.p>
            <div className="w-40 sm:w-48 h-1 bg-gray-200 rounded-full mt-5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#25B181] to-[#51C9AF] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* ── AWS Liveness Detector ── */}
        {state === "ready" && sessionId && (
          <motion.div
            key="detector"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            className="face-liveness-detector-container w-full"
          >
            <ThemeProvider theme={amplifyTheme}>
              <FaceLivenessDetector
                sessionId={sessionId}
                region={process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1"}
                onAnalysisComplete={handleAnalysisComplete}
                onError={(error) => {
                  console.error("Liveness detector error:", error);
                  if (error.state === "TIMEOUT") {
                    setErrorMsg("Verification timed out. Please try again.");
                  } else if (error.state === "RUNTIME_ERROR") {
                    setErrorMsg("Camera error. Please allow camera access and try again.");
                  } else {
                    setErrorMsg("Verification interrupted. Please try again.");
                  }
                  setState("error");
                }}
                disableStartScreen={true}
              />
            </ThemeProvider>
          </motion.div>
        )}

        {/* ── Verifying State ── */}
        {state === "verifying" && (
          <motion.div
            key="verifying"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center py-10 sm:py-14"
          >
            <div className="relative mb-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-gray-200 border-t-[#25B181]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#25B181]" />
                </motion.div>
              </div>
            </div>
            <motion.p
              variants={slideUp}
              initial="initial"
              animate="animate"
              className="text-gray-800 font-semibold text-sm sm:text-base"
            >
              Analyzing face scan...
            </motion.p>
            <motion.div
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center mt-1.5"
            >
              <p className="text-gray-400 text-xs sm:text-sm">Verifying liveness & identity</p>
              <div className="flex gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#25B181]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Success State ── */}
        {state === "success" && (
          <motion.div
            key="success"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center py-10 sm:py-14"
          >
            <div className="relative mb-4">
              <motion.div
                variants={popIn}
                initial="initial"
                animate="animate"
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30"
              >
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="sm:w-10 sm:h-10">
                  <motion.path
                    d="M10 20L17 27L30 13"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>
              <motion.div
                className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-emerald-400"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-emerald-700 font-bold text-base sm:text-lg"
            >
              Face Verified
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-gray-500 text-xs sm:text-sm mt-1"
            >
              Liveness check passed successfully
            </motion.p>
          </motion.div>
        )}

        {/* ── Error State ── */}
        {state === "error" && (
          <motion.div
            key="error"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center py-8 sm:py-12 px-4"
          >
            <motion.div
              variants={popIn}
              initial="initial"
              animate="animate"
              className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mb-4"
            >
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
            </motion.div>
            <motion.p
              variants={slideUp}
              initial="initial"
              animate="animate"
              className="text-gray-800 font-semibold text-sm sm:text-base mb-1"
            >
              Verification Failed
            </motion.p>
            <motion.p
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xs sm:text-sm text-center max-w-[280px] leading-relaxed mb-5"
            >
              {errorMsg || "Something went wrong. Please try again."}
            </motion.p>
            <motion.div
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="flex gap-3 w-full max-w-[280px]"
            >
              <button
                onClick={handleRetry}
                className="flex-1 min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25B181]/20 hover:shadow-xl hover:shadow-[#25B181]/30 active:scale-[0.97] transition-all touch-manipulation"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={onCancel}
                className="min-h-[44px] px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 active:scale-[0.97] transition-all touch-manipulation"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global CSS Overrides for AWS Amplify FaceLivenessDetector ── */}
      <style jsx global>{`
        /* ===== Container & Layout ===== */
        .face-liveness-detector-container {
          width: 100% !important;
        }

        .face-liveness-detector-container .amplify-liveness-camera-module {
          border-radius: 0.75rem !important;
          overflow: hidden !important;
          border: none !important;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06) !important;
          width: 100% !important;
        }

        /* Mobile: tighter radius */
        @media (max-width: 640px) {
          .face-liveness-detector-container .amplify-liveness-camera-module {
            border-radius: 0.5rem !important;
            box-shadow: none !important;
          }
        }

        .face-liveness-detector-container .amplify-liveness-camera-module--mobile {
          border-radius: 0.5rem !important;
        }

        /* ===== Primary Button (Begin Check / Start) ===== */
        .face-liveness-detector-container .amplify-button--primary,
        .face-liveness-detector-container .liveness-detector .amplify-button--primary {
          background: linear-gradient(135deg, #25B181 0%, #51C9AF 100%) !important;
          border: none !important;
          border-radius: 0.75rem !important;
          font-weight: 600 !important;
          font-size: 0.938rem !important;
          padding: 0.75rem 1.5rem !important;
          min-height: 48px !important;
          letter-spacing: 0.01em !important;
          box-shadow: 0 4px 12px rgba(37, 177, 129, 0.25) !important;
          transition: all 0.2s ease !important;
          -webkit-tap-highlight-color: transparent !important;
          touch-action: manipulation !important;
        }

        .face-liveness-detector-container .amplify-button--primary:hover {
          background: linear-gradient(135deg, #1a8a63 0%, #25B181 100%) !important;
          box-shadow: 0 6px 16px rgba(37, 177, 129, 0.35) !important;
          transform: translateY(-1px) !important;
        }

        .face-liveness-detector-container .amplify-button--primary:active {
          transform: translateY(0) scale(0.98) !important;
        }

        .face-liveness-detector-container .amplify-button--primary:focus {
          box-shadow: 0 0 0 3px rgba(37, 177, 129, 0.3) !important;
          outline: none !important;
        }

        /* ===== Cancel / Secondary Buttons ===== */
        .face-liveness-detector-container .amplify-liveness-cancel-button {
          border-radius: 0.75rem !important;
          font-weight: 500 !important;
          border-color: #e5e7eb !important;
          color: #4b5563 !important;
          min-height: 44px !important;
          transition: all 0.2s ease !important;
          -webkit-tap-highlight-color: transparent !important;
          touch-action: manipulation !important;
        }

        .face-liveness-detector-container .amplify-liveness-cancel-button:hover {
          background-color: #f9fafb !important;
          border-color: #d1d5db !important;
        }

        /* ===== Video & Canvas — fill container on mobile ===== */
        .face-liveness-detector-container .amplify-liveness-video {
          border-radius: 0.5rem !important;
          width: 100% !important;
        }

        .face-liveness-detector-container .amplify-liveness-oval-canvas {
          border-radius: 0.5rem !important;
        }

        /* ===== Toast / Status Messages ===== */
        .face-liveness-detector-container .amplify-liveness-toast {
          border-radius: 0.75rem !important;
          font-weight: 500 !important;
          font-size: 0.813rem !important;
          backdrop-filter: blur(8px) !important;
          margin: 0.5rem !important;
        }

        .face-liveness-detector-container .amplify-liveness-toast--primary {
          background-color: rgba(37, 177, 129, 0.92) !important;
          border: none !important;
        }

        .face-liveness-detector-container .amplify-liveness-toast--error {
          background-color: rgba(239, 68, 68, 0.92) !important;
          border: none !important;
        }

        /* ===== Loader / Spinner ===== */
        .face-liveness-detector-container .amplify-liveness-loader .amplify-loader {
          border-color: #e5e7eb !important;
          border-top-color: #25B181 !important;
        }

        .face-liveness-detector-container .amplify-liveness-connecting-loader {
          background: white !important;
          border-radius: 0.75rem !important;
        }

        /* ===== Recording Indicator ===== */
        .face-liveness-detector-container .amplify-liveness-recording-icon {
          background-color: #ef4444 !important;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.5) !important;
        }

        /* ===== Instruction Overlay — NO blur to keep camera visible ===== */
        .face-liveness-detector-container .amplify-liveness-instruction-overlay {
          background: rgba(0, 0, 0, 0.5) !important;
        }

        /* ===== Match / Progress Indicator ===== */
        .face-liveness-detector-container .amplify-liveness-match-indicator__bar {
          background: linear-gradient(90deg, #25B181 0%, #51C9AF 100%) !important;
          border-radius: 0.5rem !important;
        }

        /* ===== Figures / Instruction Images ===== */
        .face-liveness-detector-container .amplify-liveness-figure__image--success {
          border-color: #25B181 !important;
        }

        .face-liveness-detector-container .amplify-liveness-figure__caption--success {
          color: #25B181 !important;
        }

        /* ===== Start Screen Overrides ===== */
        .face-liveness-detector-container .amplify-liveness-figures {
          gap: 0.75rem !important;
        }

        .face-liveness-detector-container .amplify-liveness-figure {
          border-radius: 0.75rem !important;
        }

        .face-liveness-detector-container .amplify-liveness-instruction-list {
          font-size: 0.813rem !important;
          color: #374151 !important;
        }

        .face-liveness-detector-container .amplify-liveness-instruction-list li {
          padding: 0.2rem 0 !important;
        }

        /* ===== General Amplify Typography Overrides ===== */
        .face-liveness-detector-container .amplify-heading {
          color: #111827 !important;
          font-weight: 700 !important;
        }

        .face-liveness-detector-container .amplify-text {
          color: #4b5563 !important;
        }

        /* ===== Smooth Fade Override for Amplify's default ===== */
        .face-liveness-detector-container .amplify-liveness-fade-out {
          animation-duration: 0.3s !important;
          animation-timing-function: ease-out !important;
        }

        /* ===== Alert/Card Overrides ===== */
        .face-liveness-detector-container .amplify-alert {
          border-radius: 0.75rem !important;
          border: 1px solid #e5e7eb !important;
        }

        /* ===== Cancel Container ===== */
        .face-liveness-detector-container .amplify-liveness-cancel-container {
          padding: 0.5rem !important;
        }

        /* ===== Countdown ===== */
        .face-liveness-detector-container .amplify-liveness-countdown-container {
          font-weight: 700 !important;
        }

        /* ===== Mobile-specific overrides ===== */
        @media (max-width: 640px) {
          .face-liveness-detector-container .amplify-liveness-cancel-container {
            padding: 0.375rem !important;
          }

          .face-liveness-detector-container .amplify-button--primary {
            font-size: 0.875rem !important;
            padding: 0.625rem 1.25rem !important;
            min-height: 44px !important;
          }

          .face-liveness-detector-container .amplify-liveness-toast {
            font-size: 0.75rem !important;
            padding: 0.5rem 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
