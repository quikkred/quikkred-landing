'use client';

import { useRef, useState } from 'react';

export default function CameraTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [permissionState, setPermissionState] = useState<string>('unknown');

  const startCamera = async () => {
    setError('');
    setSuccess(false);

    try {
      console.log('🎥 Requesting camera access...');

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Check permission state
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(permissionStatus.state);
        console.log('📋 Camera permission state:', permissionStatus.state);
      } catch (e) {
        console.log('⚠️ Could not check permission state (this is OK on some browsers)');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      console.log('✅ Camera access granted!');
      console.log('📹 Stream:', stream);
      console.log('🎬 Video tracks:', stream.getVideoTracks());

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setSuccess(true);
        console.log('🎉 Video is playing!');
      }
    } catch (err: any) {
      console.error('❌ Camera error:', err);

      let errorMessage = 'Unknown error';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = '🚫 Camera access denied. Please allow camera permissions and try again.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = '📷 No camera found. Please connect a camera and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = '⚠️ Camera is in use by another application. Close other apps and try again.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = '⚙️ Camera constraints not supported. Trying with basic settings...';
      } else if (err.name === 'SecurityError') {
        errorMessage = '🔒 Security error. Make sure you\'re on HTTPS or localhost.';
      } else {
        errorMessage = `Error: ${err.message || err.toString()}`;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">📷 Camera Test Page</h1>
        <p className="text-gray-400 mb-8">Simple diagnostic page to test camera access</p>

        {/* Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">getUserMedia Support:</span>
              <span className={`font-bold ${navigator.mediaDevices?.getUserMedia ? 'text-green-400' : 'text-red-400'}`}>
                {navigator.mediaDevices?.getUserMedia ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Permission State:</span>
              <span className={`font-bold ${
                permissionState === 'granted' ? 'text-green-400' :
                permissionState === 'denied' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {permissionState === 'unknown' ? '⏳ Unknown' :
                 permissionState === 'granted' ? '✅ Granted' :
                 permissionState === 'denied' ? '❌ Denied' : `⚠️ ${permissionState}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Camera Status:</span>
              <span className={`font-bold ${success ? 'text-green-400' : error ? 'text-red-400' : 'text-gray-400'}`}>
                {success ? '✅ Active' : error ? '❌ Error' : '⏸️ Not Started'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-200">🎉 Camera is working perfectly!</p>
          </div>
        )}

        {/* Camera View */}
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <h2 className="text-xl font-bold">Camera Feed</h2>
          </div>
          <div className="p-6">
            {!success ? (
              <div className="aspect-video bg-gray-700 rounded-lg flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📷</div>
                <button
                  onClick={startCamera}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg hover:shadow-lg transition-all"
                >
                  Start Camera Test
                </button>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video rounded-lg bg-black"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📋 Troubleshooting Guide</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span>1️⃣</span>
              <span>Click the "Start Camera Test" button above</span>
            </li>
            <li className="flex gap-3">
              <span>2️⃣</span>
              <span>When browser asks for permission, click <strong className="text-white">"Allow"</strong></span>
            </li>
            <li className="flex gap-3">
              <span>3️⃣</span>
              <span>If you get an error, read the message carefully</span>
            </li>
            <li className="flex gap-3">
              <span>4️⃣</span>
              <span>Check that no other app is using your camera (Zoom, Teams, etc.)</span>
            </li>
            <li className="flex gap-3">
              <span>5️⃣</span>
              <span>Try using <strong className="text-white">Chrome or Edge</strong> browser</span>
            </li>
            <li className="flex gap-3">
              <span>6️⃣</span>
              <span>Open browser console (F12) and share any error messages</span>
            </li>
          </ul>
        </div>

        {/* Browser Info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
}
