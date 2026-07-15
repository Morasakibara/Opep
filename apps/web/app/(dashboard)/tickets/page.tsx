'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket, Search, ChevronRight, AlertCircle, CheckCircle2, XCircle,
  Clock, User, MapPin, Loader2, RefreshCw,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { ticketsApi } from '@/services/api.service';

interface TicketData {
  id: string;
  passengerName?: string;
  seatNumber?: string;
  reservationCode?: string;
  status: 'VALID' | 'USED' | 'EXPIRED' | 'CANCELLED';
  issuedAt: string;
  validUntil: string;
  scannedAt?: string;
  trip?: { departureCity: string; arrivalCity: string };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  VALID: { label: 'Valide', color: 'bg-success_green/10 text-success_green' },
  USED: { label: 'Utilisé', color: 'bg-primary/10 text-primary' },
  EXPIRED: { label: 'Expiré', color: 'bg-warning_yellow/10 text-warning_yellow' },
  CANCELLED: { label: 'Annulé', color: 'bg-error_red/10 text-error_red' },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'valid'>('all');

  useEffect(() => { loadTickets(); }, []);

  async function loadTickets() {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketsApi.getMyTickets();
      setTickets(data as unknown as TicketData[]);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === 'valid'
    ? tickets.filter((t) => t.status === 'VALID')
    : tickets;

  const stats = [
    { label: 'Total', value: tickets.length, icon: Ticket, color: 'text-on_surface' },
    { label: 'Valides', value: tickets.filter((t) => t.status === 'VALID').length, icon: CheckCircle2, color: 'text-success_green' },
    { label: 'Utilisés', value: tickets.filter((t) => t.status === 'USED').length, icon: Clock, color: 'text-primary' },
    { label: 'Expirés', value: tickets.filter((t) => t.status === 'EXPIRED').length, icon: XCircle, color: 'text-warning_yellow' },
  ];

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Mes Tickets</h2>
          <p className="text-on_surface_variant">Consultez et gérez vos tickets de voyage.</p>
        </div>
        <button onClick={loadTickets}
          className="bg-surface_container_high text-on_surface px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-surface_container transition border border-charcoal_border">
          <RefreshCw size={18} /> Rafraîchir
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <stat.icon size={20} className={`${stat.color} mb-2`} />
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-on_surface_variant font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div>
              <p className="font-bold text-on_surface">Erreur de chargement</p>
              <p className="text-sm text-on_surface_variant">{error}</p>
            </div>
          </div>
          <button onClick={loadTickets} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border flex items-center gap-3">
            <button onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-primary text-on_primary' : 'text-on_surface_variant hover:text-on_surface'}`}>Tous</button>
            <button onClick={() => setFilter('valid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'valid' ? 'bg-primary text-on_primary' : 'text-on_surface_variant hover:text-on_surface'}`}>Valides</button>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Ticket size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">Aucun ticket</p>
              <p className="text-xs text-on_surface_variant/60 mt-1">Les tickets apparaîtront après réservation.</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((ticket, i) => (
                <div key={ticket.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    ticket.status === 'VALID' ? 'bg-success_green/10 text-success_green' :
                    ticket.status === 'USED' ? 'bg-primary/10 text-primary' :
                    ticket.status === 'EXPIRED' ? 'bg-warning_yellow/10 text-warning_yellow' :
                    'bg-error_red/10 text-error_red'
                  }`}>
                    <Ticket size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">
                        {ticket.passengerName || `#${ticket.id.slice(0, 8)}`}
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[ticket.status]?.color || ''}`}>
                        {statusConfig[ticket.status]?.label || ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      {ticket.trip && (
                        <span className="text-xs text-on_surface_variant flex items-center gap-1">
                          <MapPin size={10} /> {ticket.trip.departureCity} → {ticket.trip.arrivalCity}
                        </span>
                      )}
                      {ticket.seatNumber && (
                        <span className="text-xs text-on_surface_variant">Siège {ticket.seatNumber}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-on_surface_variant/60 mt-1">
                      {ticket.issuedAt ? new Date(ticket.issuedAt).toLocaleDateString('fr-FR') : ''}
                      {ticket.validUntil && ` · valable jusqu'au ${new Date(ticket.validUntil).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-on_surface_variant/30" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
