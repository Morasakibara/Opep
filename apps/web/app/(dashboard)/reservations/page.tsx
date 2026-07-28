'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, MoreVertical, AlertCircle, ArrowRight, X, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { reservationsApi } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsModal, setDetailsModal] = useState<any | null>(null);

  useEffect(() => { loadReservations(); }, []);

  async function loadReservations() {
    setLoading(true); setError(null);
    try {
      const data: any[] = await reservationsApi.getAll();
      setReservations(data);
    } catch (err: any) { setError(err.message || 'Erreur de chargement'); }
    finally { setLoading(false); }
  }

  function formatAmount(amount: number) { return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'; }
  function formatDate(dateStr: string) { return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }

  function getClientName(res: any) {
    if (res.client) return `${res.client.firstName} ${res.client.lastName}`;
    return res.passengerName || 'N/A';
  }

  function getRouteLabel(res: any) {
    if (res.trip?.route) return `${res.trip.route.departureCity} - ${res.trip.route.arrivalCity}`;
    return res.tripRoute || 'Trajet inconnu';
  }

  function getStatusInfo(status: string) {
    switch (status) {
      case 'CONFIRMED': return { icon: <CheckCircle2 size={12} />, label: 'Confirmée', variant: 'success' };
      case 'PENDING_PAYMENT': return { icon: <Clock size={12} />, label: 'En attente', variant: 'warning' };
      case 'CANCELLED': return { icon: <XCircle size={12} />, label: 'Annulée', variant: 'danger' };
      default: return { icon: null, label: status, variant: 'default' };
    }
  }

  const filtered = reservations.filter(r => {
    const q = searchQuery.toLowerCase();
    return getClientName(r).toLowerCase().includes(q) || (r.reservationCode || '').toLowerCase().includes(q) || getRouteLabel(r).toLowerCase().includes(q);
  });

  async function handleExportCSV() {
    try {
      const csv = [['Code', 'Client', 'Trajet', 'Montant', 'Statut', 'Date'].join(','),
        ...reservations.map(r => [r.reservationCode, `"${getClientName(r)}"`, `"${getRouteLabel(r)}"`, r.totalAmount, r.status, formatDate(r.createdAt)].join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch {}
  }

  return (
    <div className="space-y-8">
      <AnimatedMount animation="slide-up" durationMs={300} className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Réservations</h2>
          <p className="text-on_surface_variant">Consultez et gérez les réservations de vos clients.</p>
        </div>
        <button onClick={handleExportCSV}
          className="bg-surface_container_high border border-charcoal_border text-on_surface px-4 py-2 rounded-xl text-sm font-bold hover:bg-surface_container_highest active:scale-[0.97] transition-all flex items-center gap-2">
          <Download size={18} /> Exporter CSV
        </button>
      </AnimatedMount>

      <div className="glass-card p-4 rounded-2xl flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant" size={18} />
          <input type="text" placeholder="Rechercher par code, client ou trajet..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-12" />
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div><p className="font-bold text-on_surface">Erreur</p><p className="text-sm text-on_surface_variant">{error}</p></div>
          </div>
          <button onClick={loadReservations} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all">Réessayer</button>
        </div>
      )}

      {loading && <PageSkeleton />}

      {!loading && !error && (
        <AnimatedMount animation="slide-up" durationMs={500}>
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4">Code</th><th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Trajet</th><th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th><th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal_border">
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-on_surface_variant">Aucune réservation trouvée</td></tr>
                )}
                {filtered.map((res: any) => {
                  const s = getStatusInfo(res.status);
                  return (
                    <tr key={res.id} className="table-row">
                      <td className="px-6 py-5"><span className="text-sm font-bold text-primary">{res.reservationCode}</span></td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-on_surface">{getClientName(res)}</p>
                        <p className="text-[10px] text-on_surface_variant">ID: {res.id?.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-on_surface_variant">{getRouteLabel(res)}</p>
                        <p className="text-[10px] text-on_surface_variant">{formatDate(res.createdAt)}</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-on_surface">{formatAmount(res.totalAmount)}</td>
                      <td className="px-6 py-5">
                        <span className={`status-badge ${s.variant === 'success' ? 'status-badge-success' : s.variant === 'warning' ? 'status-badge-warning' : s.variant === 'danger' ? 'status-badge-danger' : 'status-badge-default'}`}>
                          {s.icon}{s.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setDetailsModal(res)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all active:scale-[0.92]"><Eye size={18} /></button>
                          <button className="p-2 hover:bg-surface_container_high text-on_surface_variant rounded-lg transition-all active:scale-[0.92]"><MoreVertical size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-charcoal_border bg-surface_container_low flex justify-between items-center">
            <p className="text-xs text-on_surface_variant">{filtered.length} / {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        </AnimatedMount>
      )}

      {detailsModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setDetailsModal(null)}>
          <AnimatedMount animation="zoom-in" onClick={(e) => e.stopPropagation()}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <h3 className="text-xl font-bold text-on_surface">Détails réservation</h3>
              <button onClick={() => setDetailsModal(null)} className="text-on_surface_variant hover:text-primary active:scale-[0.92] transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between"><span className="text-sm text-on_surface_variant">Code</span><span className="text-sm font-bold text-primary">{detailsModal.reservationCode}</span></div>
              <div className="flex justify-between"><span className="text-sm text-on_surface_variant">Client</span><span className="text-sm font-bold text-on_surface">{getClientName(detailsModal)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-on_surface_variant">Trajet</span><span className="text-sm font-bold text-on_surface">{getRouteLabel(detailsModal)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-on_surface_variant">Montant</span><span className="text-sm font-bold text-on_surface">{formatAmount(detailsModal.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-on_surface_variant">Date</span><span className="text-sm font-medium text-on_surface">{formatDate(detailsModal.createdAt)}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on_surface_variant">Statut</span>
                <span className={`status-badge ${getStatusInfo(detailsModal.status).variant === 'success' ? 'status-badge-success' : 'status-badge-warning'}`}>
                  {getStatusInfo(detailsModal.status).label}
                </span>
              </div>
            </div>
            <div className="p-6 bg-surface_container_low border-t border-charcoal_border">
              <button onClick={() => setDetailsModal(null)} className="w-full bg-primary text-on_primary py-3 rounded-2xl font-bold hover:brightness-110 active:scale-[0.97] transition-all">Fermer</button>
            </div>
          </div>
          </AnimatedMount>
        </div>
      )}
    </div>
  );
}
