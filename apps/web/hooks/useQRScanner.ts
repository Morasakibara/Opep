'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import jsQR from 'jsqr';

interface QRScannerState {
  isScanning: boolean;
  cameraError: string | null;
  lastScanned: string | null;
}

export function useQRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const [state, setState] = useState<QRScannerState>({
    isScanning: false,
    cameraError: null,
    lastScanned: null,
  });

  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setState((prev) => ({ ...prev, isScanning: false }));
  }, []);

  const startCamera = useCallback(
    async (facingMode: 'environment' | 'user' = 'environment') => {
      stopCamera();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setState({ isScanning: true, cameraError: null, lastScanned: null });
        }
      } catch (err: any) {
        let message = 'Impossible d\'accéder à la caméra';
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          message = 'Permission caméra refusée. Veuillez autoriser l\'accès dans les paramètres.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          message = 'Aucune caméra détectée sur cet appareil.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          message = 'Caméra déjà utilisée par une autre application.';
        }
        setState((prev) => ({ ...prev, cameraError: message, isScanning: false }));
      }
    },
    [stopCamera]
  );

  const scanFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code?.data) {
      return code.data;
    }

    return null;
  }, []);

  const startScanning = useCallback(
    (onDetected: (qrData: string) => void, intervalMs: number = 150) => {
      if (!state.isScanning) return;

      let lastScan = 0;
      const scan = (timestamp: number) => {
        if (timestamp - lastScan >= intervalMs) {
          lastScan = timestamp;
          const result = scanFrame();
          if (result) {
            setState((prev) => ({ ...prev, lastScanned: result }));
            onDetected(result);
            return; // Stop scanning after detection
          }
        }
        animationRef.current = requestAnimationFrame(scan);
      };

      animationRef.current = requestAnimationFrame(scan);
    },
    [state.isScanning, scanFrame]
  );

  const resetScan = useCallback(() => {
    setState((prev) => ({ ...prev, lastScanned: null }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    stopCamera,
    startScanning,
    resetScan,
  };
}
