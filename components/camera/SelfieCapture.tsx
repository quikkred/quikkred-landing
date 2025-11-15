"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RotateCw, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageUrl);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmCapture = () => {
    if (!capturedImage || !canvasRef.current) return;

    // Convert data URL to File
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        handleClose();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setError("");
    onClose();
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

                  {/* Face detection overlay */}
                  {isStreaming && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Face frame guide */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-4 border-white/50 rounded-[50%] flex items-center justify-center">
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
                <img
                  src={capturedImage}
                  alt="Captured selfie"
                  className="w-full h-full object-cover mirror"
                />
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
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-5 h-5" />
                    Retake
                  </button>
                  <button
                    onClick={confirmCapture}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Use This Photo
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
