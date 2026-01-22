"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, X, RotateCw, Check, AlertCircle, Loader2, Sun, Moon, User, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from '@/lib/config';
import getToken from "@/lib/getToken";

interface SelfieCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageFile: File) => void;
}

export default function SelfieCapture({ isOpen, onClose, onCapture }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  // Face validation states
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [liveValidation, setLiveValidation] = useState<{
    brightness: 'ok' | 'too_dark' | 'too_bright';
    faceDetected: boolean;
    message: string;
  }>({
    brightness: 'ok',
    faceDetected: false,
    message: 'Initializing camera...',
  });
  const [captureValidation, setCaptureValidation] = useState<FaceValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Load face detection models on mount
  useEffect(() => {
    const loadModels = async () => {
      setLoadingModels(true);
      const success = await loadFaceModels();
      setModelsLoaded(success);
      setLoadingModels(false);
    };
    loadModels();
  }, []);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && !isStreaming) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Real-time validation during video stream
  useEffect(() => {
    if (!isStreaming || !videoRef.current || !modelsLoaded) return;

    let animationFrame: number;
    let lastCheck = 0;
    const CHECK_INTERVAL = 500; // Check every 500ms

    const checkFrame = async (timestamp: number) => {
      if (timestamp - lastCheck < CHECK_INTERVAL) {
        animationFrame = requestAnimationFrame(checkFrame);
        return;
      }
      lastCheck = timestamp;

      if (videoRef.current && videoRef.current.readyState === 4) {
        // Quick brightness check
        const brightnessResult = quickBrightnessCheck(videoRef.current);

        // Full face validation (less frequent)
        const validation = await validateFaceImage(videoRef.current);

        let message = 'Position your face in the frame';

        if (brightnessResult.status === 'too_dark') {
          message = '🌙 Too dark - Please improve lighting';
        } else if (brightnessResult.status === 'too_bright') {
          message = '☀️ Too bright - Please reduce lighting';
        } else if (!validation.details.faceDetected) {
          message = '👤 No face detected - Center your face';
        } else if (validation.details.faceCount > 1) {
          message = '👥 Multiple faces - Only one face allowed';
        } else if (!validation.details.eyesOpen) {
          message = '👁️ Keep your eyes open';
        } else if (validation.details.faceSize < 10) {
          message = '🔍 Too far - Move closer';
        } else if (!validation.details.faceCentered) {
          message = '⬆️ Center your face in frame';
        } else if (validation.score >= 70) {
          message = '✅ Perfect! Click capture';
        } else {
          message = '📸 Good - Ready to capture';
        }

        setLiveValidation({
          brightness: brightnessResult.status,
          faceDetected: validation.details.faceDetected,
          message,
        });
      }

      animationFrame = requestAnimationFrame(checkFrame);
    };

    animationFrame = requestAnimationFrame(checkFrame);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isStreaming, modelsLoaded]);

  const startCamera = async () => {
    try {
      setError("");
      setLiveValidation({
        brightness: 'ok',
        faceDetected: false,
        message: 'Starting camera...',
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions and try again.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsValidating(true);
    setError("");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsValidating(false);
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Validate the captured image
    const validation = await validateFaceImage(canvas);
    setCaptureValidation(validation);

    if (!validation.isValid) {
      setError(getValidationMessage(validation));
      setIsValidating(false);
      return;
    }

    // Convert canvas to blob and save as file
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageUrl);
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedFile(file);
        stopCamera();
      }
      setIsValidating(false);
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setVerificationStatus('idle');
    setCaptureValidation(null);
    setError('');
    startCamera();
  };

  const verifyFaceLiveness = async (file: File): Promise<boolean> => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        return false;
      }

      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(getApiUrl('/api/kyc/face/verification'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success && data.data?.livenessStatus) {
        return true;
      } else {
        setError(data.message || 'Face liveness verification failed. Please try again with a clear photo.');
        return false;
      }
    } catch (err) {
      console.error('Face verification error:', err);
      setError('Face verification failed. Please try again.');
      return false;
    }
  };

  const confirmCapture = async () => {
    if (!capturedImage || !capturedFile) return;

    setIsVerifying(true);
    setError('');
    setVerificationStatus('idle');

    // Verify face liveness with backend
    const isLive = await verifyFaceLiveness(capturedFile);

    if (isLive) {
      setVerificationStatus('success');
      setTimeout(() => {
        onCapture(capturedFile);
        handleClose();
      }, 1000);
    } else {
      setVerificationStatus('failed');
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setCapturedFile(null);
    setCaptureValidation(null);
    setError("");
    setIsVerifying(false);
    setVerificationStatus('idle');
    onClose();
  };

  // Get status indicator color
  const getStatusColor = () => {
    if (liveValidation.brightness !== 'ok') return 'bg-red-500';
    if (!liveValidation.faceDetected) return 'bg-yellow-500';
    if (liveValidation.message.includes('✅')) return 'bg-green-500';
    return 'bg-blue-500';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Camera className="w-6 h-6" />
              <h2 className="text-xl font-bold">Capture Your Selfie</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Loading models indicator */}
            {loadingModels && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-800">Loading face detection...</span>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Validation Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Camera View */}
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video mb-4">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />

                  {/* Live validation overlay */}
                  {isStreaming && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Face frame guide */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-4 border-white/50 rounded-[50%]">
                        {/* Status indicator */}
                        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full ${getStatusColor()} text-white text-sm font-medium whitespace-nowrap shadow-lg`}>
                          {liveValidation.message}
                        </div>
                      </div>

                      {/* Quality indicators */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                        {/* Brightness indicator */}
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          liveValidation.brightness === 'too_dark' ? 'bg-red-500 text-white' :
                          liveValidation.brightness === 'too_bright' ? 'bg-yellow-500 text-black' :
                          'bg-green-500 text-white'
                        }`}>
                          {liveValidation.brightness === 'too_dark' ? <Moon className="w-3 h-3" /> :
                           liveValidation.brightness === 'too_bright' ? <Sun className="w-3 h-3" /> :
                           <Sun className="w-3 h-3" />}
                          <span>
                            {liveValidation.brightness === 'too_dark' ? 'Dark' :
                             liveValidation.brightness === 'too_bright' ? 'Bright' : 'Light OK'}
                          </span>
                        </div>

                        {/* Face indicator */}
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          liveValidation.faceDetected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          <User className="w-3 h-3" />
                          <span>{liveValidation.faceDetected ? 'Face OK' : 'No Face'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured selfie"
                    className="w-full h-full object-cover mirror"
                  />

                  {/* Validation score badge */}
                  {captureValidation && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
                      captureValidation.score >= 80 ? 'bg-green-500' :
                      captureValidation.score >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      Quality: {captureValidation.score}%
                    </div>
                  )}

                  {/* Verification overlay */}
                  {isVerifying && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      {verificationStatus === 'idle' && (
                        <>
                          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                          <p className="text-white text-lg font-semibold">Verifying face liveness...</p>
                          <p className="text-white/80 text-sm mt-2">Please wait</p>
                        </>
                      )}
                      {verificationStatus === 'success' && (
                        <>
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-white text-lg font-semibold">Face Verified!</p>
                          <p className="text-white/80 text-sm mt-2">Liveness check passed</p>
                        </>
                      )}
                    </div>
                  )}

                  {verificationStatus === 'failed' && !isVerifying && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium">
                      Verification Failed - Please Retake
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Instructions */}
            {!capturedImage && isStreaming && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">📸 For best results:</p>
                  <ul className="grid grid-cols-2 gap-2 text-xs">
                    <li className="flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Good lighting on face
                    </li>
                    <li className="flex items-center gap-1">
                      <User className="w-3 h-3" /> Face centered in frame
                    </li>
                    <li className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Keep eyes open
                    </li>
                    <li className="flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Hold camera steady
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Capture validation details */}
            {capturedImage && captureValidation && !isVerifying && (
              <div className={`mb-4 rounded-lg p-4 ${
                captureValidation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`text-sm ${captureValidation.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  <p className="font-semibold mb-2">
                    {captureValidation.isValid ? '✅ Image Quality Check Passed' : '❌ Image Quality Issues'}
                  </p>
                  {captureValidation.warnings.length > 0 && (
                    <ul className="text-xs space-y-1 mb-2">
                      {captureValidation.warnings.map((w, i) => (
                        <li key={i} className="text-yellow-700">⚠️ {w}</li>
                      ))}
                    </ul>
                  )}
                  {verificationStatus === 'failed' && (
                    <p className="text-xs mt-2">Please retake with better lighting and a clearer view of your face.</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!capturedImage ? (
                <>
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={!isStreaming || isValidating || !modelsLoaded}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      liveValidation.faceDetected && liveValidation.brightness === 'ok'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white shadow-lg hover:shadow-xl'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Capture Photo
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={retakePhoto}
                    disabled={isVerifying}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className="w-5 h-5" />
                    Retake
                  </button>
                  <button
                    onClick={confirmCapture}
                    disabled={isVerifying || !captureValidation?.isValid}
                    className="flex-1 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-green-600 text-white"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Verify & Use Photo
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </AnimatePresence>
  );
}
