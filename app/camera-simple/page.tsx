'use client';

import { useState, useRef } from 'react';

export default function CameraSimplePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [livenessScore, setLivenessScore] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Position your face in frame');

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleStartCamera = async () => {
    addLog('🎬 Button clicked!');
    setError('');

    try {
      addLog('📹 Checking camera support...');

      if (!navigator.mediaDevices) {
        throw new Error('navigator.mediaDevices not available');
      }

      addLog('✅ Camera API available');
      addLog('🔐 Requesting camera permission...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });

      addLog('✅ Permission granted! Stream acquired');
      addLog(`📺 Stream tracks: ${stream.getTracks().length}`);

      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      addLog('🎥 Attaching stream to video element...');
      videoRef.current.srcObject = stream;

      addLog('▶️ Starting video playback...');
      await videoRef.current.play();

      addLog('✅ Video is playing!');
      setIsStarted(true);

      // Start face detection
      addLog('🔍 Starting face detection...');
      startFaceDetection();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`❌ ERROR: ${errorMessage}`);
      setError(errorMessage);
    }
  };

  const handleStopCamera = () => {
    addLog('🛑 Stopping camera...');

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        addLog(`Track stopped: ${track.label}`);
      });
      videoRef.current.srcObject = null;
    }

    setIsStarted(false);
    addLog('✅ Camera stopped');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🎥 Super Simple Camera Test
        </h1>

        {/* Video */}
        <div className="bg-black rounded-lg overflow-hidden mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video"
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          {!isStarted ? (
            <button
              onClick={handleStartCamera}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              🎬 START CAMERA
            </button>
          ) : (
            <button
              onClick={handleStopCamera}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              🛑 STOP CAMERA
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-red-400 mb-2">⚠️ Error:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Logs */}
        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
          <h3 className="font-bold mb-3 text-green-400">📋 Console Logs:</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 italic">No logs yet... Click START CAMERA</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="text-gray-300 py-1 border-b border-gray-700">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Browser Info */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-blue-400">🌐 Browser Info:</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div>
              <span className="text-gray-500">Browser:</span> {
                typeof window !== 'undefined'
                  ? navigator.userAgent.match(/Chrome|Firefox|Safari|Edge/)?.[0] || 'Unknown'
                  : 'SSR'
              }
            </div>
            <div>
              <span className="text-gray-500">Camera API:</span> {
                typeof navigator !== 'undefined' && navigator.mediaDevices
                  ? '✅ Available'
                  : '❌ Not Available'
              }
            </div>
            <div>
              <span className="text-gray-500">Protocol:</span> {
                typeof window !== 'undefined'
                  ? window.location.protocol
                  : 'unknown'
              }
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
          <h3 className="font-bold mb-2 text-blue-400">💡 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Click the <strong>START CAMERA</strong> button</li>
            <li>Allow camera permissions when prompted</li>
            <li>Watch the console logs below to see what's happening</li>
            <li>If it works, you'll see yourself on the video!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
