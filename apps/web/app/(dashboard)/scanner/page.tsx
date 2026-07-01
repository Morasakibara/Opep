'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQRScanner } from '@/hooks/useQRScanner';
import { validateTicketOffline } from '@/lib/offlineValidation';
import { 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  History,
  RefreshCw,
  Loader2,
  VideoOff,
  Wifi,
  WifiOff,
  ScanLine,
  Camera
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface ScanEntry {
  id: string;
  passengerName: string;
  seatNumber: string;
  tripRoute: string;
  time: string;
  valid: boolean;
}

export default function ScannerPage() {
  const [validating, setValidating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    status: 'valid' | 'invalid' | 'error' | 'none';
    data?: any;
    reason?: string;
  }>({ status: 'none' });
  const [scanHistory, setScanHistory] = useState<ScanEntry[]>([]);
  const [onlineMode, setOnlineMode] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const isDetectingRef = useRef(false);

  const {
    videoRef,
    canvasRef,
    isScanning,
    cameraError,
    startCamera,
    stopCamera,
    startScanning,
    resetScan,
  } = useQRScanner();

  // Check API health & fetch public key for offline validation
  useEffect(() => {
    apiClient.healthCheck()
      .then((ok) => setApiStatus(ok ? 'online' : 'offline'))
      .catch(() => setApiStatus('offline'));
    
    apiClient.getPublicKey()
      .then((key) => { if (key) setPublicKey(key); })
      .catch(() => {});
  }, []);

  // Camera state — starts manually on user gesture
  const [cameraStarted, setCameraStarted] = useState(false);

  const validateWithAPI = async (qrString: string, isOnline: boolean) => {
    if (isOnline) {
      try {
        const data = await apiClient.validateTicket(qrString);
        setLastResult({
          status: data.valid ? 'valid' : 'invalid',
          data,
          reason: data.reason,
        });
        return data;
      } catch {
        // Fallback: try offline validation
        if (publicKey) {
          return await validateOffline(qrString);
        }
        setLastResult({ status: 'error', reason: 'API injoignable et pas de cle offline disponible' });
        return null;
      }
    } else {
      // Offline mode: validate locally
      if (publicKey) {
        return await validateOffline(qrString);
      }
      setLastResult({ status: 'error', reason: 'Mode hors-ligne : cle publique non chargee' });
      return null;
    }
  };

  const validateOffline = async (qrString: string) => {
    if (!publicKey) return null;
    const result = await validateTicketOffline(qrString, publicKey);
    if (result.valid && result.payload) {
      setLastResult({
        status: 'valid',
        data: {
          valid: true,
          passengerName: result.payload.passengerName,
          seatNumber: result.payload.seatNumber,
          tripRoute: `${result.payload.departureCity} -> ${result.payload.arrivalCity}`,
          departureTime: result.payload.departureDateTime,
          ticketId: result.payload.ticketId,
        },
      });
      return {
        valid: true,
        passengerName: result.payload.passengerName,
        seatNumber: result.payload.seatNumber,
        tripRoute: `${result.payload.departureCity} -> ${result.payload.arrivalCity}`,
        departureTime: result.payload.departureDateTime,
        ticketId: result.payload.ticketId,
      };
    } else {
      setLastResult({
        status: 'invalid',
        data: { valid: false },
        reason: result.reason || 'Ticket invalide (validation offline)',
      });
      return { valid: false, reason: result.reason };
    }
  };

  const handleQRDetected = useCallback(async (qrData: string) => {
    if (isDetectingRef.current) return;
    isDetectingRef.current = true;
    setValidating(true);

    try {
      // Try to parse as JSON first, or treat raw string
      let qrString = qrData;
      
      // If the QR data looks like Base64 (contains a dot as payload.signature separator)
      // use it directly; otherwise try to parse as JSON
      if (qrData.includes('.') && !qrData.startsWith('{')) {
        qrString = qrData;
      } else {
        try {
          const parsed = JSON.parse(qrData);
          if (parsed.qrString) qrString = parsed.qrString;
        } catch {}
      }

      const result = await validateWithAPI(qrString, onlineMode);

      if (result) {
        addToHistory({
          id: result.ticketId || 'unknown',
          passengerName: result.passengerName || 'Inconnu',
          seatNumber: result.seatNumber || '?',
          tripRoute: result.tripRoute || '?',
          time: new Date().toLocaleTimeString('fr-FR'),
          valid: result.valid,
        });
      } else {
        setLastResult({ 
          status: 'error', 
          reason: 'Erreur de validation' 
        });
      }
    } finally {
      setValidating(false);
    }
  }, [onlineMode]);

  // Start scanning when camera is ready
  useEffect(() => {
    if (isScanning && lastResult.status === 'none') {
      startScanning(handleQRDetected, 200);
    }
  }, [isScanning, lastResult.status, startScanning, handleQRDetected]);

  const addToHistory = (entry: ScanEntry) => {
    setScanHistory((prev) => [entry, ...prev].slice(0, 10));
  };

  const handleNextScan = useCallback(() => {
    setLastResult({ status: 'none' });
    isDetectingRef.current = false;
    resetScan();
    // Scanning will restart automatically via useEffect when lastResult.status = 'none'
  }, [resetScan]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Scanner de Tickets</h2>
          <p className="text-gray-500">Validez les tickets QR des passagers a l'embarquement.</p>
        </div>
        <div className="flex items-center space-x-3">
          {apiStatus === 'checking' ? (
            <div className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold">
              <Loader2 size={16} className="animate-spin" />
              <span>Connexion...</span>
            </div>
          ) : apiStatus === 'online' ? (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-100">
              <Wifi size={16} />
              <span>API connectée</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold border border-orange-100">
              <WifiOff size={16} />
              <span>Hors-ligne</span>
            </div>
          )}
          <button
            onClick={() => setOnlineMode(!onlineMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              onlineMode
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}
          >
            {onlineMode ? 'Mode online' : 'Mode offline'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Interface */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative aspect-square lg:aspect-[4/3]">
            {/* Canvas & Video — always in the DOM so refs are available synchronously on user gesture */}
            <canvas ref={canvasRef} className="hidden" />
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${!cameraStarted ? 'hidden' : ''}`}
              playsInline
              muted
              autoPlay
            />
            {!cameraStarted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white p-6 text-center">
                <Camera size={48} className="text-slate-500 mb-4" />
                <p className="text-sm font-bold text-gray-300 mb-2">Caméra non active</p>
                <p className="text-xs text-gray-500 mb-6">Cliquez sur le bouton ci-dessous pour activer la caméra et scanner les QR codes.</p>
                <button
                  onClick={async () => {
                    await startCamera('environment');
                    setCameraStarted(true);
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-xl flex items-center"
                >
                  <Camera size={20} className="mr-2" />
                  Activer la caméra
                </button>
              </div>
            ) : cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white p-6 text-center">
                <VideoOff size={48} className="text-slate-500 mb-4" />
                <p className="text-sm font-bold text-red-400 mb-2">{cameraError || 'Erreur inconnue'}</p>
                <button
                  onClick={async () => {
                    await startCamera('environment');
                  }}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Réessayer
                </button>
              </div>
            ) : (
              <>
                {/* QR Guide Overlay (video is always rendered above) */}
                <div className="absolute inset-0 border-[60px] border-slate-900/60 flex items-center justify-center pointer-events-none">
                  <div className={`w-64 h-64 border-2 rounded-2xl relative transition-colors duration-300 ${
                    validating
                      ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]'
                      : lastResult.status === 'valid'
                      ? 'border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                      : lastResult.status === 'invalid'
                      ? 'border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                      : 'border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.3)]'
                  }`}>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

                    {/* Scanning Line */}
                    {!validating && lastResult.status === 'none' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-scan"></div>
                    )}
                  </div>
                </div>

                {/* Status Overlay */}
                {validating && (
                  <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <Loader2 size={48} className="text-blue-400 animate-spin mx-auto mb-4" />
                      <p className="text-white font-bold">Validation en cours...</p>
                    </div>
                  </div>
                )}

                <p className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-xs font-bold uppercase tracking-widest">
                  {validating
                    ? 'Analyse du QR code...'
                    : lastResult.status !== 'none'
                    ? 'Cliquez sur "Suivant" pour scanner'
                    : 'Placez le QR code au centre'}
                </p>
              </>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex space-x-3">
            <button
              onClick={handleNextScan}
              disabled={lastResult.status === 'none' && !cameraError}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ScanLine size={20} className="mr-2" />
              Prêt pour le suivant
            </button>
            <button
              onClick={() => {
                stopCamera();
                setTimeout(() => startCamera('environment'), 500);
              }}
              className="px-4 py-4 bg-white text-gray-600 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition shadow-sm"
              title="Redémarrer la caméra"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Validation Info & History */}
        <div className="space-y-6">
          {/* Scan Result */}
          {lastResult.status !== 'none' && (
            <div className={`bg-white p-8 rounded-3xl shadow-sm border-2 animate-in zoom-in duration-300 ${
              lastResult.status === 'valid'
                ? 'border-green-500'
                : lastResult.status === 'invalid'
                ? 'border-red-400'
                : 'border-orange-300'
            }`}>
              <div className="flex items-center space-x-4 mb-6">
                {lastResult.status === 'valid' ? (
                  <div className="bg-green-100 text-green-600 p-3 rounded-full">
                    <CheckCircle2 size={32} />
                  </div>
                ) : lastResult.status === 'invalid' ? (
                  <div className="bg-red-100 text-red-600 p-3 rounded-full">
                    <XCircle size={32} />
                  </div>
                ) : (
                  <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                    <AlertCircle size={32} />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none">
                    {lastResult.status === 'valid'
                      ? 'Ticket Valide'
                      : lastResult.status === 'invalid'
                      ? 'Ticket Invalide'
                      : 'Erreur'}
                  </h3>
                  <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${
                    lastResult.status === 'valid' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {lastResult.status === 'valid'
                      ? 'Passager autorise'
                      : lastResult.reason || 'Erreur inconnue'}
                  </p>
                </div>
              </div>

              {lastResult.data?.passengerName && (
                <div className="space-y-4 py-6 border-t border-b border-gray-50 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Passager</span>
                    <span className="font-bold text-gray-900 text-sm">{lastResult.data.passengerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Ref. Ticket</span>
                    <span className="font-bold text-blue-600 text-sm">#{lastResult.data.ticketId?.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Trajet</span>
                    <span className="font-bold text-gray-900 text-sm text-right">
                      {lastResult.data.tripRoute}
                      {lastResult.data.departureTime && (
                        <br />
                      )}
                      <span className="text-[10px] font-normal text-gray-500">
                        {lastResult.data.departureTime
                          ? new Date(lastResult.data.departureTime).toLocaleString('fr-FR')
                          : ''}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Siege</span>
                    <span className="font-black text-orange-600 text-sm">{lastResult.data.seatNumber}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleNextScan}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl flex items-center justify-center"
              >
                <ScanLine size={20} className="mr-2" />
                Scanner le suivant
              </button>
            </div>
          )}

          {/* History */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <History size={18} className="text-gray-400" />
                <h4 className="font-bold text-gray-900">
                  Dernieres validations ({scanHistory.length})
                </h4>
              </div>
            </div>

            {scanHistory.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Aucune validation aujourd'hui. Scannez un ticket pour commencer.
              </p>
            ) : (
              <div className="space-y-3">
                {scanHistory.map((scan, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      scan.valid ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        scan.valid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {scan.valid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{scan.passengerName}</p>
                        <p className="text-[10px] text-gray-400">
                          {scan.tripRoute} · Siege {scan.seatNumber}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{scan.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
