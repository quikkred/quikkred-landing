"use client";

import { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from '@/components/ui/toast';
import FaceLiveness from '@/components/camera/FaceLivenessDetector';
import { configureAmplify } from '@/lib/aws-amplify-config';

interface SelfieCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function SelfieCapture({ isOpen, onClose, onCapture }: SelfieCaptureProps) {
  const [initialized, setInitialized] = useState(false);

  // Configure AWS Amplify when modal opens
  useEffect(() => {
    if (isOpen && !initialized) {
      const identityPoolId = process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID;
      const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1';

      if (identityPoolId) {
        try {
          configureAmplify(identityPoolId, region);
          setInitialized(true);
        } catch (error) {
          console.error('Error configuring AWS Amplify:', error);
        }
      } else {
        console.warn('AWS_IDENTITY_POOL_ID not configured.');
      }
    }
  }, [isOpen, initialized]);

  const handleSuccess = async (result: any) => {
    // If backend returns a photo URL, convert it to a File for the parent
    if (result.photoUrl) {
      try {
        const response = await fetch(result.photoUrl);
        const blob = await response.blob();
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      } catch (error) {
        console.error('Error processing photo URL:', error);
        // Still mark as captured with a placeholder file
        const placeholderBlob = new Blob(['verified'], { type: 'text/plain' });
        const placeholderFile = new File([placeholderBlob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(placeholderFile);
      }
    } else {
      // No photo URL from session result — create a minimal placeholder file
      // The liveness verification already passed on the backend
      const placeholderBlob = new Blob(['verified'], { type: 'text/plain' });
      const placeholderFile = new File([placeholderBlob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(placeholderFile);
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleError = (error: string) => {
    console.error('Face liveness failed:', error);
    toast({
      variant: 'error',
      title: 'Verification Failed',
      description: error || 'Face liveness check failed. Please try again.',
    });
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
                  <h3 className="text-xl font-bold text-white">Face Verification</h3>
                  <p className="text-sm text-white/80">AWS Rekognition Liveness Check</p>
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

          {/* Face Liveness Content */}
          <div className="px-6 py-6">
            <FaceLiveness
              onSuccess={handleSuccess}
              onError={handleError}
              onClose={onClose}
            />
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Powered by AWS Rekognition - Secure video liveness verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
