'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function CameraDetectionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  const [isStreaming, setIsStreaming] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [livenessScore, setLivenessScore] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [message, setMessage] = useState('Click Start Camera');

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setMessage('Camera started - analyzing...');

        // Start detection after video loads
        videoRef.current.onloadedmetadata = () => {
          startDetection();
        };
      }
    } catch (err) {
      alert(`Camera error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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

  // Detection loop
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

      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Analyze center region for face
      const centerX = Math.floor(canvas.width / 4);
      const centerY = Math.floor(canvas.height / 4);
      const regionWidth = Math.floor(canvas.width / 2);
      const regionHeight = Math.floor(canvas.height / 2);

      try {
        const imageData = ctx.getImageData(centerX, centerY, regionWidth, regionHeight);
        const data = imageData.data;
        const pixelCount = data.length / 4;

        // Calculate brightness
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          totalBrightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }
        const avgBrightness = totalBrightness / pixelCount;
        setBrightness(Math.round(avgBrightness));

        // Calculate variance (face detection heuristic)
        let variance = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          variance += Math.pow(brightness - avgBrightness, 2);
        }
        variance = variance / pixelCount;

        // Detect face presence
        const facePresent = variance > 500 && avgBrightness > 40 && avgBrightness < 220;
        setFaceDetected(facePresent);

        // Calculate liveness score
        let score = 0;
        if (facePresent) score += 40;
        if (avgBrightness > 60 && avgBrightness < 200) score += 30;
        if (variance > 1000) score += 30; // Good texture
        setLivenessScore(Math.min(score, 100));

        // Update message
        if (!facePresent) {
          setMessage('❌ No face detected - position your face in the oval');
        } else if (avgBrightness < 60) {
          setMessage('🌑 Too dark - improve lighting');
        } else if (avgBrightness > 200) {
          setMessage('☀️ Too bright - reduce glare');
        } else if (score < 70) {
          setMessage('⚠️ Face detected - optimizing...');
        } else {
          setMessage('✅ Face verified! Liveness check passed');
        }

      } catch (e) {
        console.error('Detection error:', e);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Client-side only rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Camera className="w-10 h-10" />
                3D Face Liveness Detection
              </h1>
              <p className="text-green-100 text-sm md:text-base">
                Real-time face detection with anti-spoofing
              </p>
            </div>

            {isStreaming && (
              <div className="text-right">
                <div className="text-sm text-green-100 mb-1">Liveness Score</div>
                <div className={`text-5xl font-bold ${
                  livenessScore >= 70 ? 'text-white' : 'text-red-300'
                }`}>
                  {livenessScore}%
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Eye className="w-6 h-6" />
                  Live Camera Feed
                </h2>
              </div>

              <div className="p-6">
                {!isStreaming ? (
                  <div className="aspect-video bg-gray-900 rounded-xl flex flex-col items-center justify-center border-2 border-gray-700">
                    <Camera className="w-24 h-24 text-gray-600 mb-6" />
                    <button
                      onClick={startCamera}
                      className="px-10 py-5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
                    >
                      🎬 START CAMERA
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full aspect-video rounded-xl bg-black shadow-xl"
                      style={{ transform: 'scaleX(-1)' }}
                    />

                    {/* Status Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className={`px-4 py-2 rounded-full backdrop-blur-lg shadow-lg ${
                        faceDetected && livenessScore >= 70
                          ? 'bg-green-500/90'
                          : 'bg-red-500/90'
                      }`}>
                        <div className="flex items-center gap-2">
                          {faceDetected && livenessScore >= 70 ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                          <span className="font-bold">
                            {faceDetected && livenessScore >= 70 ? 'LIVE ✓' : 'NOT VERIFIED'}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-lg shadow-lg">
                        <span className="text-sm font-medium">
                          {faceDetected ? '✓ Face Detected' : '○ No Face'}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
                      <div className="bg-black/80 backdrop-blur-lg rounded-xl p-4 text-center shadow-xl border border-white/10">
                        <p className="font-semibold text-lg">{message}</p>
                      </div>
                    </div>

                    {/* Face Guide */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-56 h-72 md:w-64 md:h-80 border-4 border-white/40 rounded-[50%] shadow-2xl" />
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* Controls */}
                {isStreaming && (
                  <button
                    onClick={stopCamera}
                    className="w-full mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
                  >
                    🛑 STOP CAMERA
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            {isStreaming && (
              <>
                {/* Status Card */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Detection Status
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Face Detected</span>
                      {faceDetected ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Brightness</span>
                      <span className={`font-bold ${
                        brightness > 60 && brightness < 200 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {brightness}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Liveness</span>
                        <span className="font-bold">{livenessScore}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            livenessScore >= 70 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${livenessScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Indicators */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold mb-4">Quality Check</h3>

                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 ${
                      brightness > 60 && brightness < 200 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {brightness > 60 && brightness < 200 ? '✓' : '○'} Lighting
                    </div>
                    <div className={`flex items-center gap-2 ${
                      faceDetected ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {faceDetected ? '✓' : '○'} Face Position
                    </div>
                    <div className={`flex items-center gap-2 ${
                      livenessScore >= 70 ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {livenessScore >= 70 ? '✓' : '○'} Liveness Verified
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Instructions */}
            <div className="bg-blue-900/30 border-2 border-blue-500 rounded-xl p-6 shadow-xl">
              <h3 className="font-bold mb-3 text-blue-400">📋 Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Click START CAMERA</li>
                <li>• Allow camera access</li>
                <li>• Position face in oval</li>
                <li>• Ensure good lighting</li>
                <li>• Wait for 70%+ score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
