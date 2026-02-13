"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Camera, Loader2, RotateCw, CheckCircle, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from '@/components/ui/toast';
import { API_BASE_URL } from '@/lib/config';
import getToken from '@/lib/getToken';

interface SelfieCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function SelfieCapture({ isOpen, onClose, onCapture }: SelfieCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isOpen && !isStreaming && !capturedImage) {
      startCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setVerificationError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setVerificationError('Unable to access camera. Please check permissions.');
      toast({
        variant: 'error',
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.'
      });
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageUrl);
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedFile(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setVerified(false);
    setVerificationError('');
    startCamera();
  };

  const verifyAndSubmit = async () => {
    if (!capturedFile) {
      const errorMsg = 'Please capture a selfie first';
      setVerificationError(errorMsg);
      toast({
        variant: 'error',
        title: 'Error',
        description: errorMsg
      });
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append('photo', capturedFile);

      const response = await fetch(`${API_BASE_URL}/api/kyc/face/rekognition/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data?.livenessStatus) {
        setVerified(true);
        onCapture(capturedFile);

        toast({
          variant: 'success',
          title: 'Identity Verified!',
          description: 'Your face has been verified successfully.'
        });

        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // Handle liveness failure or Aadhaar mismatch
        let errorMsg = data.message || 'Face verification failed. Please try again.';

        // Add specific tips based on failure reasons
        if (data.data?.checks) {
          const { eyesOpen, goodBrightness, goodSharpness, frontalPose } = data.data.checks;
          const tips = [];
          if (eyesOpen === false) tips.push('Keep your eyes open');
          if (goodBrightness === false) tips.push('Improve lighting');
          if (goodSharpness === false) tips.push('Hold camera steady');
          if (frontalPose === false) tips.push('Look directly at camera');

          if (tips.length > 0) {
            errorMsg += '\n\nTips: ' + tips.join(', ');
          }
        }

        setVerificationError(errorMsg);
        toast({
          variant: 'error',
          title: 'Verification Failed',
          description: errorMsg
        });
      }
    } catch (error) {
      console.error('Selfie verification error:', error);
      const errorMsg = 'Verification failed. Please try again.';
      setVerificationError(errorMsg);
      toast({
        variant: 'error',
        title: 'Error',
        description: errorMsg
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25B181] to-[#1F8F68] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">Capture Selfie</h3>
                  <p className="text-sm text-white/80">AWS Rekognition verification</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Camera/Preview */}
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video mb-4">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {isStreaming && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#25B181] text-white px-4 py-2 rounded-full text-sm font-medium">
                      Position your face in the frame
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {isVerifying && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      {verified ? (
                        <>
                          <div className="w-16 h-16 bg-[#25B181] rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-white text-lg font-semibold">Face Verified!</p>
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                          <p className="text-white text-lg font-semibold">Verifying face...</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Error Message */}
            {verificationError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="whitespace-pre-line">{verificationError}</span>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Tips:</strong> Ensure good lighting, keep your eyes open, and look directly at the camera
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!capturedImage ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={!isStreaming}
                    className="flex-1 px-4 py-3 bg-[#25B181] text-white rounded-xl font-semibold hover:bg-[#1d8f6a] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5" />
                    Capture
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={retakePhoto}
                    disabled={isVerifying}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RotateCw className="w-5 h-5" />
                    Retake
                  </button>
                  <button
                    onClick={verifyAndSubmit}
                    disabled={isVerifying || verified}
                    className="flex-1 px-4 py-3 bg-[#25B181] text-white rounded-xl font-semibold hover:bg-[#1d8f6a] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Verify & Use</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              🔒 Powered by AWS Rekognition - Secure & Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
