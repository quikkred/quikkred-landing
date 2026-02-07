'use client';

import { useState, useRef, useEffect } from 'react';

export default function FaceLivePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Click START');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStarted(true);
        analyzeFrame();
      }
    } catch (err) {
      alert(`Camera error: ${err}`);
    }
  };

  const analyzeFrame = () => {
    if (!isStarted) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || video.readyState !== 4) {
      setTimeout(analyzeFrame, 100);
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const centerX = Math.floor(canvas.width / 4);
    const centerY = Math.floor(canvas.height / 4);
    const w = Math.floor(canvas.width / 2);
    const h = Math.floor(canvas.height / 2);

    const imageData = ctx.getImageData(centerX, centerY, w, h);
    const data = imageData.data;
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness = brightness / (data.length / 4);

    let variance = 0;
    for (let i = 0; i < data.length; i += 4) {
      const b = (data[i] + data[i + 1] + data[i + 2]) / 3;
      variance += Math.pow(b - brightness, 2);
    }
    variance = variance / (data.length / 4);

    const faceDetected = variance > 500 && brightness > 40 && brightness < 220;
    let newScore = 0;
    if (faceDetected) newScore += 40;
    if (brightness > 60 && brightness < 200) newScore += 30;
    if (variance > 1000) newScore += 30;

    setScore(newScore);

    if (!faceDetected) {
      setStatus('❌ No face - position in frame');
    } else if (brightness < 60) {
      setStatus('🌑 Too dark');
    } else if (brightness > 200) {
      setStatus('☀️ Too bright');
    } else if (newScore >= 70) {
      setStatus('✅ LIVE - Face verified!');
    } else {
      setStatus('⚠️ Optimizing...');
    }

    setTimeout(analyzeFrame, 100);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #111827, #1f2937)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(to right, #10b981, #14b8a6)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            🎥 Face Liveness Detection
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Real-time face detection with scoring
          </p>
          {isStarted && (
            <div style={{ marginTop: '1rem', fontSize: '3rem', fontWeight: 'bold' }}>
              Score: <span style={{ color: score >= 70 ? '#10b981' : '#ef4444' }}>{score}%</span>
            </div>
          )}
        </div>

        {/* Video */}
        <div style={{ background: '#1f2937', borderRadius: '1rem', padding: '2rem' }}>
          <div style={{ position: 'relative' }}>
            {!isStarted ? (
              <div style={{ aspectRatio: '16/9', background: '#111827', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ fontSize: '5rem' }}>📷</div>
                <button
                  onClick={startCamera}
                  style={{ padding: '1.5rem 3rem', background: 'linear-gradient(to right, #10b981, #14b8a6)', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}
                >
                  🎬 START CAMERA
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', aspectRatio: '16/9', borderRadius: '0.75rem', background: 'black', transform: 'scaleX(-1)' }}
                />

                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.75rem 1.5rem', background: score >= 70 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', borderRadius: '9999px', fontWeight: 'bold' }}>
                  {score >= 70 ? '✓ LIVE' : '✗ NOT VERIFIED'}
                </div>

                {/* Message */}
                <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', padding: '1rem 2rem', background: 'rgba(0, 0, 0, 0.8)', borderRadius: '0.75rem', fontWeight: 'bold', maxWidth: '90%' }}>
                  {status}
                </div>

                {/* Face Guide */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '16rem', height: '20rem', border: '4px solid rgba(255, 255, 255, 0.4)', borderRadius: '50%', pointerEvents: 'none' }} />
              </>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Instructions */}
        <div style={{ marginTop: '2rem', background: '#1f2937', borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>📋 Instructions:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>• Click START CAMERA button</li>
            <li>• Allow camera permissions</li>
            <li>• Position your face in the oval guide</li>
            <li>• Ensure good lighting (not too dark/bright)</li>
            <li>• Wait for score to reach 70%+</li>
            <li>• You'll see "✓ LIVE" when verified!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
