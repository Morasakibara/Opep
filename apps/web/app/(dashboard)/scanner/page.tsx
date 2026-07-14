'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQRScanner } from '@/hooks/useQRScanner';
import { validateTicketOffline } from '@/lib/offlineValidation';
import { CheckCircle2, AlertCircle, XCircle, History, RefreshCw, Loader2, VideoOff, Wifi, WifiOff, ScanLine, Camera, X } from 'lucide-react';
import { configApi, ticketsApi } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';

export default function ScannerPage() {
  const [validating, setValidating] = useState(false);
  const [lastResult, setLastResult] = useState<{ status: 'valid' | 'invalid' | 'error' | 'none'; data?: any; reason?: string }>({ status: 'none' });
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [onlineMode, setOnlineMode] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const isDetectingRef = useRef(false);
  const [cameraStarted, setCameraStarted] = useState(false);

  const { videoRef, canvasRef, isScanning, cameraError, startCamera, stopCamera, startScanning, resetScan } = useQRScanner();

  useEffect(() => {
    Promise.all([
      configApi.healthCheck().then((data) => setApiStatus(data?.status === 'ok' ? 'online' : 'offline')).catch(() => setApiStatus('offline')),
      configApi.getPublicKey().then((data) => { if (data?.publicKey) setPublicKey(data.publicKey); }).catch(() => {}),
    ]).finally(() => setInitialLoading(false));
  }, []);

  const validateOffline = async (qrString: string) => {
    if (!publicKey) return null;
    const result = await validateTicketOffline(qrString, publicKey);
    if (result.valid && result.payload) {
      setLastResult({ status: 'valid', data: { valid: true, passengerName: result.payload.passengerName, seatNumber: result.payload.seatNumber, tripRoute: `${result.payload.departureCity} → ${result.payload.arrivalCity}`, departureTime: result.payload.departureDateTime, ticketId: result.payload.ticketId } });
      return result.payload;
    } else {
      setLastResult({ status: 'invalid', data: { valid: false }, reason: result.reason || 'Ticket invalide (offline)' });
      return null;
    }
  };

  const validateWithAPI = async (qrString: string, isOnline: boolean) => {
    if (isOnline) {
      try {
        const data = await ticketsApi.validate({ qrData: qrString, controllerId: '' });
        setLastResult({ status: data.valid ? 'valid' : 'invalid', data, reason: data.reason });
        return data;
      } catch {
        if (publicKey) return await validateOffline(qrString);
        setLastResult({ status: 'error', reason: 'API injoignable' });
        return null;
      }
    } else {
      if (publicKey) return await validateOffline(qrString);
      setLastResult({ status: 'error', reason: 'Hors-ligne : pas de clé' });
      return null;
    }
  };

  const handleQRDetected = useCallback(async (qrData: string) => {
    if (isDetectingRef.current) return;
    isDetectingRef.current = true;
    setValidating(true);
    try {
      let qrString = qrData;
      if (qrData.includes('.') && !qrData.startsWith('{')) qrString = qrData;
      else { try { const parsed = JSON.parse(qrData); if (parsed.qrString) qrString = parsed.qrString; } catch {} }
      const result: any = await validateWithAPI(qrString, onlineMode);
      if (result) {
        setScanHistory(prev => [{ id: result.ticketId || 'unknown', passengerName: result.passengerName || 'Inconnu', seatNumber: result.seatNumber || '?', tripRoute: result.tripRoute || '?', time: new Date().toLocaleTimeString('fr-FR'), valid: result.valid }, ...prev].slice(0, 10));
      }
    } finally { setValidating(false); }
  }, [onlineMode, publicKey]);

  useEffect(() => { if (isScanning && lastResult.status === 'none') startScanning(handleQRDetected, 200); }, [isScanning, lastResult.status]);

  const handleNextScan = useCallback(() => {
    setLastResult({ status: 'none' }); isDetectingRef.current = false; resetScan();
  }, [resetScan]);

  if (initialLoading) return <PageSkeleton />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Scanner de Tickets</h2>
          <p className="text-on_surface_variant">Validez les tickets QR des passagers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
            apiStatus === 'online' ? 'bg-success_green/10 text-success_green border-success_green/20' :
            apiStatus === 'checking' ? 'bg-surface_container_high text-on_surface_variant border-charcoal_border' :
            'bg-warning_yellow/10 text-warning_yellow border-warning_yellow/20'
          }`}>
            {apiStatus === 'online' ? <Wifi size={14} /> : apiStatus === 'checking' ? <Loader2 size={14} className="animate-spin" /> : <WifiOff size={14} />}
            {apiStatus === 'online' ? 'En ligne' : apiStatus === 'checking' ? 'Connexion...' : 'Hors-ligne'}
          </div>
          <button onClick={() => setOnlineMode(!onlineMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              onlineMode ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface_container_high text-on_surface_variant border-charcoal_border'
            }`}>
            {onlineMode ? 'Online' : 'Offline'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl relative aspect-square lg:aspect-[4/3]">
            <canvas ref={canvasRef} className="hidden" />
            <video ref={videoRef} className={`w-full h-full object-cover ${!cameraStarted ? 'hidden' : ''}`} playsInline muted autoPlay />

            {!cameraStarted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface p-6 text-center">
                <Camera size={48} className="text-on_surface_variant mb-4" />
                <p className="text-sm font-bold text-on_surface mb-2">Caméra non active</p>
                <p className="text-xs text-on_surface_variant mb-6">Activez la caméra pour scanner les QR codes.</p>
                <button onClick={async () => { await startCamera('environment'); setCameraStarted(true); }}
                  className="bg-primary text-on_primary px-8 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-xl flex items-center gap-2">
                  <Camera size={20} /> Activer
                </button>
              </div>
            ) : cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface p-6 text-center">
                <VideoOff size={48} className="text-on_surface_variant mb-4" />
                <p className="text-sm font-bold text-error_red mb-2">{cameraError}</p>
                <button onClick={async () => { await startCamera('environment'); }} className="mt-4 bg-primary text-on_primary px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                  <RefreshCw size={16} /> Réessayer
                </button>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 border-[60px] border-surface/60 flex items-center justify-center pointer-events-none">
                  <div className={`w-64 h-64 border-2 rounded-2xl relative transition-colors duration-300 ${
                    validating ? 'border-warning_yellow shadow-[0_0_30px_rgba(250,204,21,0.4)]' :
                    lastResult.status === 'valid' ? 'border-success_green shadow-[0_0_30px_rgba(34,197,94,0.4)]' :
                    lastResult.status === 'invalid' ? 'border-error_red shadow-[0_0_30px_rgba(239,68,68,0.4)]' :
                    'border-primary shadow-[0_0_30px_rgba(121,216,183,0.3)]'
                  }`}>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    {!validating && lastResult.status === 'none' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary/50 shadow-[0_0_15px_rgba(121,216,183,0.8)] animate-scan"></div>
                    )}
                  </div>
                </div>
                {validating && (
                  <div className="absolute inset-0 bg-surface/70 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center"><Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" /><p className="text-on_surface font-bold">Validation...</p></div>
                  </div>
                )}
                <p className="absolute bottom-6 left-0 right-0 text-center text-on_surface_variant/50 text-xs font-bold uppercase tracking-widest">
                  {validating ? 'Analyse...' : lastResult.status !== 'none' ? 'Appuyez sur "Suivant"' : 'Placez le QR au centre'}
                </p>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleNextScan} disabled={lastResult.status === 'none' && !cameraError}
              className="flex-1 bg-primary text-on_primary py-4 rounded-2xl font-bold hover:brightness-110 transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <ScanLine size={20} /> Suivant
            </button>
            <button onClick={() => { stopCamera(); setTimeout(() => startCamera('environment'), 500); }}
              className="px-4 py-4 bg-surface_container border border-charcoal_border text-on_surface rounded-2xl font-bold hover:bg-surface_container_high transition" title="Redémarrer">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {lastResult.status !== 'none' && (
            <div className={`glass-card p-8 rounded-3xl border-2 animate-in zoom-in duration-300 ${
              lastResult.status === 'valid' ? 'border-success_green' : lastResult.status === 'invalid' ? 'border-error_red' : 'border-warning_yellow'
            }`}>
              <div className="flex items-center gap-4 mb-6">
                {lastResult.status === 'valid' ? (
                  <div className="bg-success_green/10 text-success_green p-3 rounded-full"><CheckCircle2 size={32} /></div>
                ) : lastResult.status === 'invalid' ? (
                  <div className="bg-error_red/10 text-error_red p-3 rounded-full"><XCircle size={32} /></div>
                ) : (
                  <div className="bg-warning_yellow/10 text-warning_yellow p-3 rounded-full"><AlertCircle size={32} /></div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-on_surface leading-none">
                    {lastResult.status === 'valid' ? '✓ Valide' : lastResult.status === 'invalid' ? '✗ Invalide' : 'Erreur'}
                  </h3>
                  <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${lastResult.status === 'valid' ? 'text-success_green' : 'text-error_red'}`}>
                    {lastResult.status === 'valid' ? 'Passager autorisé' : lastResult.reason || 'Erreur inconnue'}
                  </p>
                </div>
              </div>
              {lastResult.data?.passengerName && (
                <div className="space-y-4 py-6 border-t border-b border-charcoal_border mb-6">
                  {[
                    { label: 'Passager', value: lastResult.data.passengerName },
                    { label: 'Réf. Ticket', value: `#${lastResult.data.ticketId?.slice(0, 8)}` },
                    { label: 'Trajet', value: lastResult.data.tripRoute },
                    { label: 'Siège', value: lastResult.data.seatNumber },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-sm text-on_surface_variant">{item.label}</span>
                      <span className={`text-sm font-bold ${item.label === 'Réf. Ticket' ? 'text-primary' : item.label === 'Siège' ? 'text-secondary' : 'text-on_surface'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleNextScan} className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold hover:brightness-110 transition shadow-xl flex items-center justify-center gap-2">
                <ScanLine size={20} /> Scanner suivant
              </button>
            </div>
          )}

          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={18} className="text-on_surface_variant" />
                <h4 className="font-bold text-on_surface">Validations ({scanHistory.length})</h4>
              </div>
            </div>
            {scanHistory.length === 0 ? (
              <p className="text-sm text-on_surface_variant text-center py-8">Aucune validation. Scannez un ticket.</p>
            ) : (
              <div className="space-y-3">
                {scanHistory.map((scan, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${scan.valid ? 'bg-success_green/5' : 'bg-error_red/5'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${scan.valid ? 'bg-success_green/10 text-success_green' : 'bg-error_red/10 text-error_red'}`}>
                        {scan.valid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on_surface">{scan.passengerName}</p>
                        <p className="text-[10px] text-on_surface_variant">{scan.tripRoute} · Siège {scan.seatNumber}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-on_surface_variant">{scan.time}</span>
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
