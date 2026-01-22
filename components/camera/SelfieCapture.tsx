"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RotateCw, Check, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from '@/lib/config';

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
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string>("Position your face in the frame");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && !isStreaming) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Simple face detection using video dimensions and heuristics
  useEffect(() => {
    if (!isStreaming || !videoRef.current) return;

    const detectInterval = setInterval(() => {
      // Simple heuristic check - in production, you'd use face-api.js or similar
      // For now, we'll just check if video is playing and has content
      if (videoRef.current && videoRef.current.readyState === 4) {
        // Simulate face detection - in real implementation, use face-api.js
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx && videoRef.current) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);

          // Simple brightness check to ensure face is visible
          const imageData = ctx.getImageData(
            canvas.width / 4,
            canvas.height / 4,
            canvas.width / 2,
            canvas.height / 2
          );

          let brightness = 0;
          for (let i = 0; i < imageData.data.length; i += 4) {
            brightness += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
          }
          brightness = brightness / (imageData.data.length / 4);

          // Check if there's enough brightness (face likely present)
          if (brightness > 50 && brightness < 200) {
            setFaceDetected(true);
            setDetectionMessage("Face detected! Click capture when ready");
          } else if (brightness <= 50) {
            setFaceDetected(false);
            setDetectionMessage("Too dark - please improve lighting");
          } else {
            setFaceDetected(false);
            setDetectionMessage("Position your face in the frame");
          }
        }
      }
    }, 500);

    return () => clearInterval(detectInterval);
  }, [isStreaming]);

  const startCamera = async () => {
    try {
      setError("");
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

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and save as file
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageUrl);
        // Save the file for later verification
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedFile(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setVerificationStatus('idle');
    setError('');
    startCamera();
  };

  const verifyFaceLiveness = async (file: File): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return false;
      }

      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`${API_BASE_URL}/api/kyc/face/verification`, {
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

    // Verify face liveness first
    const isLive = await verifyFaceLiveness(capturedFile);

    if (isLive) {
      setVerificationStatus('success');
      // Wait a moment to show success status
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
    setError("");
    setIsVerifying(false);
    setVerificationStatus('idle');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-start sm:items-center justify-center overflow-y-auto py-4 px-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto sm:my-0"
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
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Camera Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Camera View - Taller on mobile for better face capture */}
            <div className="relative bg-black rounded-xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] md:aspect-video mb-4">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />

                  {/* Face detection overlay */}
                  {isStreaming && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Face frame guide - Responsive sizing */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 border-4 border-white/50 rounded-[50%] flex items-center justify-center">
                        <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full ${
                          faceDetected ? 'bg-green-500' : 'bg-yellow-500'
                        } text-white text-sm font-medium whitespace-nowrap`}>
                          {detectionMessage}
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
                  {/* Failed verification badge */}
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
                  <p className="font-semibold mb-2">Tips for a clear photo:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Position your face inside the oval frame</li>
                    <li>Ensure good lighting on your face</li>
                    <li>Look directly at the camera</li>
                    <li>Remove glasses if possible</li>
                    <li>Keep a neutral expression</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Verification Status Message */}
            {capturedImage && !isVerifying && (
              <div className={`mb-4 rounded-lg p-4 ${
                verificationStatus === 'failed'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className={`text-sm ${verificationStatus === 'failed' ? 'text-red-800' : 'text-green-800'}`}>
                  {verificationStatus === 'failed' ? (
                    <>
                      <p className="font-semibold mb-1">Face Liveness Check Failed</p>
                      <p className="text-xs">{error || 'Please retake the photo with better lighting and ensure your face is clearly visible.'}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold mb-1">Ready for Verification</p>
                      <p className="text-xs">Click "Verify & Use Photo" to verify your face and proceed.</p>
                    </>
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
                    disabled={!isStreaming}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      faceDetected
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white shadow-lg hover:shadow-xl'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
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
                    disabled={isVerifying || verificationStatus === 'failed'}
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
