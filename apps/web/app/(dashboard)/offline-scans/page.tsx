'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone, Search, AlertCircle, ChevronRight, Clock,
  Wifi, WifiOff, Upload, CheckCircle2, Shield,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { offlineScanApi } from '@/services/api.service';

interface OfflineScan {
  id: string;
  deviceId: string;
  ticketCode: string;
  scannedAt: string;
  syncedAt?: string;
  isValid: boolean | null;
  status: 'PENDING_SYNC' | 'SYNCED' | 'VERIFIED' | 'INVALID';
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING_SYNC: { label: 'Non synchronisé', color: 'bg-warning_yellow/10 text-warning_yellow', icon: <WifiOff size={14} /> },
  SYNCED: { label: 'Synchronisé', color: 'bg-primary/10 text-primary', icon: <Wifi size={14} /> },
  VERIFIED: { label: 'Vérifié', color: 'bg-success_green/10 text-success_green', icon: <CheckCircle2 size={14} /> },
  INVALID: { label: 'Invalide', color: 'bg-error_red/10 text-error_red', icon: <Shield size={14} /> },
};

const MOCK_SCANS: OfflineScan[] = [
  { id: '1', deviceId: 'CTRL-001', ticketCode: 'TKT-982-AZ', scannedAt: '2026-07-14T08:30:00', syncedAt: '2026-07-14T08:35:00', isValid: true, status: 'VERIFIED' },
  { id: '2', deviceId: 'CTRL-001', ticketCode: 'TKT-451-BX', scannedAt: '2026-07-14T09:15:00', syncedAt: '2026-07-14T09:20:00', isValid: true, status: 'SYNCED' },
  { id: '3', deviceId: 'CTRL-002', ticketCode: 'TKT-773-CM', scannedAt: '2026-07-14T10:00:00', isValid: null, status: 'PENDING_SYNC' },
  { id: '4', deviceId: 'CTRL-001', ticketCode: 'TKT-204-DP', scannedAt: '2026-07-14T07:45:00', syncedAt: '2026-07-14T07:50:00', isValid: false, status: 'INVALID' },
  { id: '5', deviceId: 'CTRL-003', ticketCode: 'TKT-639-ER', scannedAt: '2026-07-13T18:20:00', syncedAt: '2026-07-13T18:25:00', isValid: true, status: 'VERIFIED' },
];

export default function OfflineScansPage() {
  const [scans, setScans] = useState<OfflineScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadScans();
  }, []);

  async function loadScans() {
    setLoading(true);
    setError(null);
    try {
      const data = await offlineScanApi.getAll();
      setScans(Array.isArray(data) ? data as OfflineScan[] : []);
    } catch (err: any) {
      console.warn('Offline-scans API unavailable, using mock data:', err.message);
      setScans(MOCK_SCANS as OfflineScan[]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = scans.filter((s) =>
    s.ticketCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.deviceId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingSync = scans.filter((s) => s.status === 'PENDING_SYNC').length;
  const verified = scans.filter((s) => s.status === 'VERIFIED').length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Scans hors ligne</h2>
          <p className="text-on_surface_variant">Synchronisation des tickets scannés hors connexion.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {pendingSync > 0 && (
            <button onClick={loadScans} className="px-4 py-2 bg-primary text-on_primary font-bold rounded-xl hover:brightness-110 transition flex items-center gap-2 active:scale-95">
              <Upload size={14} /> Synchroniser ({pendingSync})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <Smartphone size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{scans.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Scans totaux</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <CheckCircle2 size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{verified}</p>
          <p className="text-xs text-on_surface_variant font-medium">Vérifiés</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <WifiOff size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{pendingSync}</p>
          <p className="text-xs text-on_surface_variant font-medium">Non synchronisés</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Shield size={20} className="text-error_red mb-2" />
          <p className="text-2xl font-bold text-on_surface">{scans.filter((s) => s.status === 'INVALID').length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Invalides</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadScans} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher par ticket ou appareil..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Smartphone size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">{searchQuery ? 'Aucun scan trouvé' : 'Aucun scan hors ligne'}</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((scan, i) => (
                <div key={scan.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Smartphone size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">{scan.ticketCode}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusConfig[scan.status]?.color || ''}`}>
                        {statusConfig[scan.status]?.icon} {statusConfig[scan.status]?.label || scan.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-on_surface_variant/60">Appareil: {scan.deviceId}</span>
                      <span className="text-[10px] text-on_surface_variant/40">•</span>
                      <span className="text-[10px] text-on_surface_variant/60 flex items-center gap-1">
                        <Clock size={10} /> {new Date(scan.scannedAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    {scan.syncedAt && (
                      <p className="text-[10px] text-on_surface_variant/40 mt-1">
                        Synchronisé: {new Date(scan.syncedAt).toLocaleString('fr-FR')}
                      </p>
                    )}
                  </div>
                  {scan.isValid === false && <Shield size={16} className="text-error_red flex-shrink-0" />}
                  <ChevronRight size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
