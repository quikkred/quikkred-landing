/**
 * Face Validation Utility
 * Uses face-api.js for comprehensive face detection and image quality validation
 */

import * as faceapi from 'face-api.js';

// Track if models are loaded
let modelsLoaded = false;

// Model URLs - using jsdelivr CDN for face-api.js models
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';

/**
 * Load face-api.js models (only needs to be called once)
 */
export const loadFaceModels = async (): Promise<boolean> => {
  if (modelsLoaded) return true;

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;

    return true;
  } catch (error) {
    console.error('❌ Failed to load face detection models:', error);
    return false;
  }
};

/**
 * Validation result interface
 */
export interface FaceValidationResult {
  isValid: boolean;
  score: number; // 0-100 quality score
  errors: string[];
  warnings: string[];
  details: {
    faceDetected: boolean;
    faceCount: number;
    brightness: number;
    isTooGloomy: boolean;
    isTooBright: boolean;
    faceSize: number; // percentage of image
    faceCentered: boolean;
    eyesOpen: boolean;
    blurScore: number;
    isBlurry: boolean;
  };
}

/**
 * Analyze image brightness
 * Returns value 0-255 (0 = black, 255 = white)
 */
const analyzeBrightness = (imageData: ImageData): number => {
  const data = imageData.data;
  let totalBrightness = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    // Calculate perceived brightness using luminance formula
    const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    totalBrightness += brightness;
  }

  return totalBrightness / pixelCount;
};

/**
 * Analyze image blur using Laplacian variance
 * Higher value = sharper image
 */
const analyzeBlur = (imageData: ImageData, width: number, height: number): number => {
  const data = imageData.data;
  const grayscale: number[] = [];

  // Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    grayscale.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }

  // Apply Laplacian kernel and calculate variance
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      // Laplacian kernel: [0, 1, 0], [1, -4, 1], [0, 1, 0]
      const laplacian =
        grayscale[idx - width] +
        grayscale[idx - 1] +
        grayscale[idx + 1] +
        grayscale[idx + width] -
        4 * grayscale[idx];

      sum += laplacian;
      sumSq += laplacian * laplacian;
      count++;
    }
  }

  const mean = sum / count;
  const variance = (sumSq / count) - (mean * mean);

  return variance;
};

/**
 * Check if face is centered in the image
 */
const isFaceCentered = (
  faceBox: faceapi.Box,
  imageWidth: number,
  imageHeight: number
): boolean => {
  const faceCenterX = faceBox.x + faceBox.width / 2;
  const faceCenterY = faceBox.y + faceBox.height / 2;

  const imageCenterX = imageWidth / 2;
  const imageCenterY = imageHeight / 2;

  // Allow 20% deviation from center
  const toleranceX = imageWidth * 0.2;
  const toleranceY = imageHeight * 0.2;

  return (
    Math.abs(faceCenterX - imageCenterX) < toleranceX &&
    Math.abs(faceCenterY - imageCenterY) < toleranceY
  );
};

/**
 * Check if eyes are likely open based on landmarks
 */
const areEyesOpen = (landmarks: faceapi.FaceLandmarks68): boolean => {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // Calculate eye aspect ratio (EAR)
  const calculateEAR = (eye: faceapi.Point[]) => {
    const vertical1 = Math.sqrt(
      Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2)
    );
    const vertical2 = Math.sqrt(
      Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2)
    );
    const horizontal = Math.sqrt(
      Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2)
    );
    return (vertical1 + vertical2) / (2 * horizontal);
  };

  const leftEAR = calculateEAR(leftEye);
  const rightEAR = calculateEAR(rightEye);
  const avgEAR = (leftEAR + rightEAR) / 2;

  // EAR threshold for open eyes (typically > 0.2)
  return avgEAR > 0.2;
};

/**
 * Main validation function - validates image from video element or image
 */
export const validateFaceImage = async (
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<FaceValidationResult> => {
  const result: FaceValidationResult = {
    isValid: false,
    score: 0,
    errors: [],
    warnings: [],
    details: {
      faceDetected: false,
      faceCount: 0,
      brightness: 0,
      isTooGloomy: false,
      isTooBright: false,
      faceSize: 0,
      faceCentered: false,
      eyesOpen: false,
      blurScore: 0,
      isBlurry: false,
    },
  };

  // Ensure models are loaded
  if (!modelsLoaded) {
    const loaded = await loadFaceModels();
    if (!loaded) {
      result.errors.push('Face detection not available. Please refresh and try again.');
      return result;
    }
  }

  try {
    // Get image dimensions
    const width = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
    const height = source instanceof HTMLVideoElement ? source.videoHeight : source.height;

    // Create canvas for analysis
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      result.errors.push('Unable to process image');
      return result;
    }

    ctx.drawImage(source, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);

    // 1. Analyze brightness
    const brightness = analyzeBrightness(imageData);
    result.details.brightness = brightness;

    // Brightness thresholds
    const MIN_BRIGHTNESS = 60;  // Too dark below this
    const MAX_BRIGHTNESS = 200; // Too bright above this

    if (brightness < MIN_BRIGHTNESS) {
      result.details.isTooGloomy = true;
      result.errors.push('Image is too dark. Please improve lighting.');
    } else if (brightness > MAX_BRIGHTNESS) {
      result.details.isTooBright = true;
      result.errors.push('Image is too bright. Please reduce lighting or glare.');
    }

    // 2. Analyze blur
    const blurScore = analyzeBlur(imageData, width, height);
    result.details.blurScore = blurScore;

    // Blur threshold (lower = more blurry)
    const BLUR_THRESHOLD = 100;
    if (blurScore < BLUR_THRESHOLD) {
      result.details.isBlurry = true;
      result.warnings.push('Image appears blurry. Try holding the camera steady.');
    }

    // 3. Detect faces
    const detections = await faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5,
      }))
      .withFaceLandmarks(true);

    result.details.faceCount = detections.length;

    if (detections.length === 0) {
      result.errors.push('No face detected. Please position your face clearly in the frame.');
      return result;
    }

    if (detections.length > 1) {
      result.errors.push('Multiple faces detected. Please ensure only your face is in the frame.');
      return result;
    }

    result.details.faceDetected = true;
    const detection = detections[0];
    const faceBox = detection.detection.box;

    // 4. Check face size (should be at least 15% of image)
    const faceArea = faceBox.width * faceBox.height;
    const imageArea = width * height;
    const faceSizePercent = (faceArea / imageArea) * 100;
    result.details.faceSize = faceSizePercent;

    if (faceSizePercent < 10) {
      result.errors.push('Face is too small. Please move closer to the camera.');
    } else if (faceSizePercent < 15) {
      result.warnings.push('Face could be larger. Consider moving slightly closer.');
    } else if (faceSizePercent > 60) {
      result.warnings.push('Face is very close. Consider moving back slightly.');
    }

    // 5. Check if face is centered
    result.details.faceCentered = isFaceCentered(faceBox, width, height);
    if (!result.details.faceCentered) {
      result.warnings.push('Please center your face in the frame.');
    }

    // 6. Check if eyes are open
    if (detection.landmarks) {
      result.details.eyesOpen = areEyesOpen(detection.landmarks);
      if (!result.details.eyesOpen) {
        result.errors.push('Eyes appear closed. Please keep your eyes open.');
      }
    }

    // Calculate overall score
    let score = 100;

    // Deduct for brightness issues
    if (result.details.isTooGloomy) score -= 40;
    else if (result.details.isTooBright) score -= 30;
    else if (brightness < 80 || brightness > 180) score -= 10;

    // Deduct for blur
    if (result.details.isBlurry) score -= 20;

    // Deduct for face size issues
    if (faceSizePercent < 10) score -= 30;
    else if (faceSizePercent < 15) score -= 10;

    // Deduct for centering
    if (!result.details.faceCentered) score -= 10;

    // Deduct for eyes closed
    if (!result.details.eyesOpen) score -= 25;

    // Warnings deduct less
    score -= result.warnings.length * 5;

    result.score = Math.max(0, Math.min(100, score));

    // Valid if no errors and score >= 60
    result.isValid = result.errors.length === 0 && result.score >= 60;

    return result;

  } catch (error) {
    console.error('Face validation error:', error);
    result.errors.push('Face validation failed. Please try again.');
    return result;
  }
};

/**
 * Quick brightness check without full face detection
 * Useful for real-time feedback during video stream
 */
export const quickBrightnessCheck = (
  source: HTMLVideoElement | HTMLCanvasElement
): { brightness: number; status: 'too_dark' | 'too_bright' | 'ok' } => {
  const width = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
  const height = source instanceof HTMLVideoElement ? source.videoHeight : source.height;

  const canvas = document.createElement('canvas');
  canvas.width = Math.min(width, 320); // Smaller for speed
  canvas.height = Math.min(height, 240);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return { brightness: 0, status: 'ok' };
  }

  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const brightness = analyzeBrightness(imageData);

  let status: 'too_dark' | 'too_bright' | 'ok' = 'ok';
  if (brightness < 60) status = 'too_dark';
  else if (brightness > 200) status = 'too_bright';

  return { brightness, status };
};

/**
 * Get user-friendly message based on validation result
 */
export const getValidationMessage = (result: FaceValidationResult): string => {
  if (result.isValid) {
    if (result.score >= 90) return 'Excellent! Image quality is great.';
    if (result.score >= 75) return 'Good image quality.';
    return 'Image is acceptable.';
  }

  if (result.errors.length > 0) {
    return result.errors[0];
  }

  if (result.warnings.length > 0) {
    return result.warnings[0];
  }

  return 'Please capture a clear photo of your face.';
};
