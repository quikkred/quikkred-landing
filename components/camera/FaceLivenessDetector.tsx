"use client";

import React, { useState, useEffect } from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import '@aws-amplify/ui-react/styles.css';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { API_BASE_URL } from '@/lib/config';
import getToken from '@/lib/getToken';

interface FaceLivenessProps {
  onSuccess: (result: any) => void;
  onError?: (error: string) => void;
  onClose: () => void;
}

export default function FaceLiveness({ onSuccess, onError, onClose }: FaceLivenessProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Step 1: Create Liveness Session
  useEffect(() => {
    createLivenessSession();
  }, []);

  const createLivenessSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if AWS credentials are configured
      const identityPoolId = process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID;
      if (!identityPoolId) {
        throw new Error('AWS credentials not configured. Please add NEXT_PUBLIC_AWS_IDENTITY_POOL_ID to your environment variables (.env.local, .env.production, .env.beta)');
      }

      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/kyc/face/rekognition/create-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create liveness session');
      }

      console.log('✅ Liveness session created:', data.data.sessionId);
      setSessionId(data.data.sessionId);
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Error creating liveness session:', err);
      setError(err.message || 'Failed to initialize face liveness');
      setLoading(false);
      onError?.(err.message);
      toast({
        variant: 'error',
        title: 'Initialization Failed',
        description: err.message || 'Unable to start face liveness check'
      });
    }
  };

  // Step 2: Handle Analysis Complete (User completed the liveness check)
  const handleAnalysisComplete = async () => {
    if (!sessionId) return;

    setAnalysisComplete(true);
    console.log('📊 Liveness check complete, fetching results...');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Fetch results from backend
      const response = await fetch(
        `${API_BASE_URL}/api/kyc/face/rekognition/session-result/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Liveness check failed');
      }

      console.log('✅ Liveness check passed:', data.data);

      // Show success message
      toast({
        variant: 'success',
        title: 'Verification Successful',
        description: 'Your face has been verified successfully!'
      });

      // Pass result to parent
      onSuccess(data.data);
    } catch (err: any) {
      console.error('❌ Liveness check failed:', err);
      setError(err.message);
      onError?.(err.message);

      toast({
        variant: 'error',
        title: 'Verification Failed',
        description: err.message || 'Face liveness check failed. Please try again.'
      });
    }
  };

  // Step 3: Handle User Error (User cancelled or something went wrong)
  const handleError = (error: any) => {
    console.error('❌ Liveness detector error:', error);

    // Extract detailed error information
    let errorMessage = 'Face liveness check encountered an error';

    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    }

    // Check for common AWS configuration errors
    if (errorMessage.includes('Identity') || errorMessage.includes('credentials') || errorMessage.includes('Cognito')) {
      errorMessage = 'AWS credentials not configured. Please add NEXT_PUBLIC_AWS_IDENTITY_POOL_ID to your environment variables.';
    }

    console.error('❌ Detailed error:', { errorMessage, error });
    setError(errorMessage);
    onError?.(errorMessage);

    toast({
      variant: 'error',
      title: 'Error',
      description: errorMessage
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <Loader2 className="w-12 h-12 text-[#25B181] animate-spin mb-4" />
        <p className="text-gray-600 text-center">Initializing face liveness check...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-900 font-semibold mb-2">Unable to start verification</p>
        <p className="text-sm text-gray-600 text-center mb-6">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={createLivenessSession}
            className="px-6 py-2 bg-[#25B181] text-white rounded-lg hover:bg-[#1d8f6a] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Analysis Complete State
  if (analysisComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <p className="text-gray-900 font-semibold mb-2">Processing...</p>
        <p className="text-sm text-gray-600">Verifying your face liveness check</p>
      </div>
    );
  }

  // Main Face Liveness Detector
  return (
    <div className="w-full">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Position your face in the oval and follow the on-screen prompts
        </p>
      </div>

      {sessionId && (
        <FaceLivenessDetector
          sessionId={sessionId}
          region="ap-south-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
        />
      )}
    </div>
  );
}
