/**
 * TypeScript declarations for MediaPipe Face Mesh
 */

declare global {
  interface Window {
    createFaceLandmarksDetector: any;
  }
}

declare module '@tensorflow-models/face-landmarks-detection' {
  export enum SupportedModels {
    MediaPipeFaceMesh = 'MediaPipeFaceMesh',
  }

  export interface FaceLandmarksDetector {
    estimateFaces(
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
      config?: {
        flipHorizontal?: boolean;
        staticImageMode?: boolean;
      }
    ): Promise<Face[]>;
    dispose(): void;
  }

  export interface Face {
    keypoints: Array<{
      x: number;
      y: number;
      z: number;
      name?: string;
    }>;
    box: {
      xMin: number;
      yMin: number;
      xMax: number;
      yMax: number;
      width: number;
      height: number;
    };
  }

  export function createDetector(
    model: SupportedModels,
    config?: {
      runtime?: 'tfjs' | 'mediapipe';
      refineLandmarks?: boolean;
      maxFaces?: number;
      solutionPath?: string;
    }
  ): Promise<FaceLandmarksDetector>;
}

declare module '@mediapipe/face_mesh' {
  export class FaceMesh {
    constructor(config: {
      locateFile: (file: string) => string;
    });
    setOptions(options: {
      maxNumFaces?: number;
      refineLandmarks?: boolean;
      minDetectionConfidence?: number;
      minTrackingConfidence?: number;
    }): void;
    onResults(callback: (results: Results) => void): void;
    send(input: { image: HTMLVideoElement | HTMLImageElement }): Promise<void>;
    close(): void;
  }

  export interface Results {
    multiFaceLandmarks: Array<Array<{
      x: number;
      y: number;
      z: number;
    }>>;
    image: HTMLVideoElement | HTMLImageElement;
  }
}

declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(
      videoElement: HTMLVideoElement,
      config: {
        onFrame: () => Promise<void>;
        width?: number;
        height?: number;
      }
    );
    start(): Promise<void>;
    stop(): void;
  }
}

export {};
