'use client';

import React, { useState, useEffect } from 'react';
import {
  Armchair, Search, AlertCircle, ChevronRight, Bus,
  Lock, Unlock, CheckCircle2, TrendingUp, Grid,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { seatsApi, tripsApi } from '@/services/api.service';

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isLocked: boolean;
  isBooked: boolean;
  passengerName?: string;
  tripId?: string;
}

const seatStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  available: { label: 'Libre', color: 'border-success_green/30 text-success_green bg-success_green/5', icon: <CheckCircle2 size={14} /> },
  booked: { label: 'Réservé', color: 'border-primary/30 text-primary bg-primary/5', icon: <Armchair size={14} /> },
  locked: { label: 'Verrouillé', color: 'border-warning_yellow/30 text-warning_yellow bg-warning_yellow/5', icon: <Lock size={14} /> },
};

const MOCK_SEATS: Seat[] = Array.from({ length: 40 }, (_, i) => ({
  id: `seat-${i + 1}`,
  number: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
  isAvailable: i > 15,
  isLocked: i >= 12 && i <= 15,
  isBooked: i < 12,
  passengerName: i < 12 ? `Passager ${i + 1}` : undefined,
}));

export default function SeatsPage() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripSearch, setTripSearch] = useState('');

  useEffect(() => {
    loadSeats();
  }, []);

  async function loadSeats() {
    setLoading(true);
    setError(null);
    try {
      // Essaie de récupérer un trajet réel pour obtenir ses sièges
      const trips = await tripsApi.getAll();
      if (Array.isArray(trips) && trips.length > 0) {
        const tripId = trips[0].id;
        const data = await seatsApi.getAvailable(tripId);
        setSeats(Array.isArray(data) ? data as Seat[] : MOCK_SEATS);
      } else {
        setSeats(MOCK_SEATS);
      }
    } catch (err: any) {
      console.warn('Seats API unavailable, using mock data:', err.message);
      setSeats(MOCK_SEATS);
    } finally {
      setLoading(false);
    }
  }

  const displaySeats = seats.length > 0 ? seats : MOCK_SEATS;
  const bookedCount = displaySeats.filter((s) => s.isBooked).length;
  const availableCount = displaySeats.filter((s) => s.isAvailable).length;
  const lockedCount = displaySeats.filter((s) => s.isLocked).length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Sièges</h2>
          <p className="text-on_surface_variant">Visualisation et gestion de l'occupation des sièges.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <Grid size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{MOCK_SEATS.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Total sièges</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <CheckCircle2 size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{availableCount}</p>
          <p className="text-xs text-on_surface_variant font-medium">Disponibles</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Armchair size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{bookedCount}</p>
          <p className="text-xs text-on_surface_variant font-medium">Réservés</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Lock size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{lockedCount}</p>
          <p className="text-xs text-on_surface_variant font-medium">Verrouillés</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <>
          {/* Trip selector */}
          <div className="glass-card rounded-3xl p-5 animate-in slide-in-from-bottom duration-500">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                <input type="text" placeholder="Sélectionner un trajet..." value={tripSearch}
                  onChange={(e) => setTripSearch(e.target.value)} className="input-field pl-10" />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-success_green/30 border border-success_green/50" /> Libre</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary/30 border border-primary/50" /> Réservé</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning_yellow/30 border border-warning_yellow/50" /> Verrouillé</span>
              </div>
            </div>
          </div>

          {/* Seat grid */}
          <div className="glass-card rounded-3xl p-6 animate-in slide-in-from-bottom duration-600">
            <div className="flex items-center gap-3 mb-6">
              <Bus size={18} className="text-primary" />
              <p className="font-bold text-on_surface">Disposition des sièges</p>
              <span className="text-[10px] text-on_surface_variant/60">(données de démonstration)</span>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {displaySeats.map((seat, i) => {
                const status = seat.isBooked ? 'booked' : seat.isLocked ? 'locked' : 'available';
                return (
                  <div
                    key={seat.id}
                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                      seatStatusConfig[status]?.color || ''
                    } ${i % 4 === 0 ? 'ml-0' : ''} ${[3, 7, 11, 15, 19, 23, 27, 31, 35, 39].includes(i) ? 'mr-8' : ''}`}
                    title={seat.number}
                  >
                    <span className="text-[9px] font-bold">{seat.number}</span>
                    {seat.isBooked && <span className="text-[6px] mt-0.5 text-on_surface_variant/60">{seat.passengerName?.split(' ')[1]}</span>}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-charcoal_border flex items-center justify-center gap-6 text-xs text-on_surface_variant">
              <span className="flex items-center gap-1.5"><Armchair size={14} className="text-primary" /> 12 réservés</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success_green" /> 24 libres</span>
              <span className="flex items-center gap-1.5"><Lock size={14} className="text-warning_yellow" /> 4 verrouillés</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
