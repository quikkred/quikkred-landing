'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

export default function LivenessTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  const [isStreaming, setIsStreaming] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [livenessScore, setLivenessScore] = useState(0);
  const [message, setMessage] = useState('Click Start Camera');
  const [error, setError] = useState('');

  // Start camera
  const startCamera = async () => {
    console.log('🎥 Start Camera button clicked');
    setError('');
    setMessage('Requesting camera access...');

    try {
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      console.log('📹 Requesting camera permissions...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      console.log('✅ Camera access granted');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('📺 Video ready, starting detection');
          setIsStreaming(true);
          setMessage('Camera started - analyzing...');
          startDetection();
        };
      }
    } catch (err) {
      console.error('❌ Camera error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Camera Error: ${errorMsg}`);
      setMessage('Failed to start camera');

      if (errorMsg.includes('Permission denied')) {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (errorMsg.includes('not found')) {
        setError('No camera found. Please connect a camera and try again.');
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log('🛑 Stopping camera');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.label);
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsStreaming(false);
    setFaceDetected(false);
    setLivenessScore(0);
    setMessage('Camera stopped');
  };

  // Start detection loop
  const startDetection = () => {
    const detect = () => {
      if (!videoRef.current || !canvasRef.current || !isStreaming) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx || video.readyState !== 4) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      // Set canvas size
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Analyze center region
      const centerX = Math.floor(canvas.width / 4);
      const centerY = Math.floor(canvas.height / 4);
      const regionWidth = Math.floor(canvas.width / 2);
      const regionHeight = Math.floor(canvas.height / 2);

      try {
        const imageData = ctx.getImageData(centerX, centerY, regionWidth, regionHeight);
        const data = imageData.data;

        // Calculate brightness and variance
        let totalBrightness = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          totalBrightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }

        const avgBrightness = totalBrightness / pixelCount;

        // Calculate variance
        let variance = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          variance += Math.pow(brightness - avgBrightness, 2);
        }
        variance = variance / pixelCount;

        // Detect face (high variance = likely a face)
        const facePresent = variance > 500 && avgBrightness > 40 && avgBrightness < 220;
        setFaceDetected(facePresent);

        // Calculate liveness score
        let score = 0;
        if (facePresent) score += 40;
        if (avgBrightness > 60 && avgBrightness < 200) score += 30;
        if (variance > 1000) score += 30;
        setLivenessScore(Math.min(score, 100));

        // Update message
        if (!facePresent) {
          setMessage('No face detected - position your face in frame');
        } else if (avgBrightness < 60) {
          setMessage('Too dark - improve lighting');
        } else if (avgBrightness > 200) {
          setMessage('Too bright - reduce glare');
        } else {
          setMessage('Face detected! Hold steady...');
        }

      } catch (e) {
        console.error('Detection error:', e);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Face Detection Test
          </h1>
          <p className="text-gray-600">
            Real-time face liveness detection demo
          </p>

          {/* Liveness Score */}
          {isStreaming && (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-600">Liveness Score:</span>
              <span className={`text-3xl font-bold ${
                livenessScore >= 70 ? 'text-green-600' : 'text-red-600'
              }`}>
                {livenessScore}%
              </span>
            </div>
          )}
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#25B181] to-[#51C9AF] p-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera className="w-6 h-6" />
              Live Camera Feed
            </h2>
          </div>

          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Camera View */}
            <div className="relative">
              {!isStreaming ? (
                <div className="aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                  <Camera className="w-20 h-20 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">{message}</p>
                  <button
                    onClick={startCamera}
                    className="px-8 py-4 bg-gradient-to-r from-[#25B181] to-[#51C9AF] text-white text-lg rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                  >
                    Start Camera
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full aspect-video rounded-xl bg-black"
                    style={{ transform: 'scaleX(-1)' }}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className={`px-4 py-2 rounded-full backdrop-blur-md ${
                      faceDetected && livenessScore >= 70
                        ? 'bg-green-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}>
                      <div className="flex items-center gap-2">
                        {faceDetected && livenessScore >= 70 ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        <span className="font-semibold">
                          {faceDetected && livenessScore >= 70 ? 'LIVE' : 'NOT VERIFIED'}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white">
                      <span className="text-sm font-medium">
                        {faceDetected ? '✓ Face Detected' : '✗ No Face'}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-md text-white rounded-xl text-center max-w-md">
                    <p className="font-semibold text-sm">{message}</p>
                  </div>

                  {/* Face Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-64 md:w-64 md:h-80 border-4 border-white/50 rounded-[50%]" />
                  </div>
                </div>
              )}
            </div>

            {/* Hidden canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Controls */}
            {isStreaming && (
              <div className="mt-4">
                <button
                  onClick={stopCamera}
                  className="w-full px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-all"
                >
                  Stop Camera
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click "Start Camera" and allow camera permissions</li>
                <li>• Position your face in the oval guide</li>
                <li>• Ensure good lighting (not too dark or bright)</li>
                <li>• Wait for "LIVE" status and score ≥70%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-gray-900 text-white rounded-xl p-4 font-mono text-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Debug Console:</span>
            <span className={`px-2 py-1 rounded ${isStreaming ? 'bg-green-600' : 'bg-gray-700'}`}>
              {isStreaming ? 'STREAMING' : 'IDLE'}
            </span>
          </div>
          <div className="space-y-1 text-gray-300">
            <div>Browser: {typeof window !== 'undefined' && navigator.userAgent.split(' ').pop()}</div>
            <div>Camera API: {typeof navigator !== 'undefined' && navigator.mediaDevices ? '✓ Available' : '✗ Not Available'}</div>
            <div>Video Ready: {videoRef.current?.readyState === 4 ? '✓ Yes' : '✗ No'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
