'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Search, AlertCircle, ChevronRight, Clock,
  MapPin, Plus, Route, TrendingUp,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { schedulesApi } from '@/services/api.service';

interface Schedule {
  id: string;
  routeName: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  daysOfWeek: string[];
  isActive: boolean;
  busType?: string;
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  async function loadSchedules() {
    setLoading(true);
    setError(null);
    try {
      const data = await schedulesApi.getAll();
      setSchedules(Array.isArray(data) ? data as Schedule[] : []);
    } catch (err: any) {
      console.warn('Schedules API unavailable, using mock data:', err.message);
      setSchedules([
        { id: '1', routeName: 'Douala → Yaoundé', departureCity: 'Douala', arrivalCity: 'Yaoundé', departureTime: '06:00', arrivalTime: '10:30', duration: '4h30', daysOfWeek: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], isActive: true },
        { id: '2', routeName: 'Yaoundé → Bafoussam', departureCity: 'Yaoundé', arrivalCity: 'Bafoussam', departureTime: '07:15', arrivalTime: '11:45', duration: '4h30', daysOfWeek: ['Lun','Mar','Mer','Jeu','Ven','Sam'], isActive: true },
        { id: '3', routeName: 'Douala → Garoua', departureCity: 'Douala', arrivalCity: 'Garoua', departureTime: '05:00', arrivalTime: '18:00', duration: '13h00', daysOfWeek: ['Lun','Mer','Ven','Dim'], isActive: true },
        { id: '4', routeName: 'Yaoundé → Douala', departureCity: 'Yaoundé', arrivalCity: 'Douala', departureTime: '08:00', arrivalTime: '12:30', duration: '4h30', daysOfWeek: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], isActive: false },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = schedules.filter((s) =>
    s.routeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.departureCity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.arrivalCity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Horaires</h2>
          <p className="text-on_surface_variant">Planification des départs et fréquences.</p>
        </div>
        <button className="px-5 py-3 bg-primary text-on_primary font-bold rounded-2xl text-sm hover:brightness-110 transition-all active:scale-95 flex items-center gap-2">
          <Plus size={16} /> Nouvel horaire
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <Calendar size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{schedules.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Horaires programmés</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Route size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{schedules.filter((s) => s.isActive).length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Lignes actives</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <MapPin size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{new Set(schedules.map((s) => s.departureCity)).size}</p>
          <p className="text-xs text-on_surface_variant font-medium">Villes de départ</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <TrendingUp size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">
            {schedules.reduce((max, s) => {
              const h = parseInt(s.departureTime?.split(':')[0] || '0');
              const m = parseInt(s.departureTime?.split(':')[1] || '0');
              return h * 60 + m > max ? h * 60 + m : max;
            }, 0) > 0 ? 'Matin' : '—'}
          </p>
          <p className="text-xs text-on_surface_variant font-medium">Dernier départ</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadSchedules} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher une ligne..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Calendar size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">{searchQuery ? 'Aucun horaire trouvé' : 'Aucun horaire programmé'}</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((schedule, i) => (
                <div key={schedule.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">{schedule.routeName || `${schedule.departureCity} → ${schedule.arrivalCity}`}</p>
                      {!schedule.isActive && (
                        <span className="text-[10px] bg-on_surface_variant/10 text-on_surface_variant font-bold px-2 py-0.5 rounded-full">Inactif</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-xs font-bold text-primary">{schedule.departureTime} — {schedule.arrivalTime}</span>
                      <span className="text-[10px] text-on_surface_variant/60">Durée: {schedule.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {schedule.daysOfWeek?.map((day) => (
                        <span key={day} className="text-[9px] bg-surface_container_high text-on_surface_variant font-bold px-1.5 py-0.5 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
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
