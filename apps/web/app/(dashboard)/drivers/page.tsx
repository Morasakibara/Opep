'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Search, Star, Phone, Mail, MoreVertical,
  Award, AlertCircle, ChevronRight, TrendingUp,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { driversApi } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  rating: number;
  tripsCount: number;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY';
  licenseNumber: string;
  experienceYears: number;
}

const statusConfig: Record<string, { label: string; badge: string }> = {
  AVAILABLE: { label: 'Disponible', badge: 'status-badge-success' },
  ON_TRIP: { label: 'En voyage', badge: 'status-badge-info' },
  OFF_DUTY: { label: 'Repos', badge: 'status-badge-warning' },
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    setLoading(true);
    setError(null);
    try {
      const data = await driversApi.getAll();
      setDrivers(data as Driver[]);
    } catch (err: any) {
      const msg = err.message || 'Erreur de chargement des conducteurs';
      setError(msg);
      toast.error('Conducteurs', msg);
    } finally {
      setLoading(false);
    }
  }

  const filtered = drivers.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      (d.licenseNumber || '').toLowerCase().includes(q)
    );
  });

  const stats = [
    { label: 'Total conducteurs', value: drivers.length, color: 'text-on_surface', icon: Users },
    { label: 'En voyage', value: drivers.filter((d) => d.status === 'ON_TRIP').length, color: 'text-primary', icon: TrendingUp },
    { label: 'Disponibles', value: drivers.filter((d) => d.status === 'AVAILABLE').length, color: 'text-success_green', icon: Award },
    { label: 'Note moyenne', value: drivers.length > 0 ? (drivers.reduce((a, d) => a + (d.rating || 0), 0) / drivers.length).toFixed(1) : '—', color: 'text-warning_yellow', icon: Star },
  ];

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedMount animation="slide-up" durationMs={300} className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Conducteurs</h2>
          <p className="text-on_surface_variant">Gérez les chauffeurs et suivez leurs performances.</p>
        </div>
      </AnimatedMount>

      {/* Stats Grid */}
      <AnimatedMount animation="slide-up" durationMs={400} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon
                size={20}
                className="text-on_surface_variant group-hover:text-primary transition-colors duration-300"
              />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-on_surface_variant font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </AnimatedMount>

      {/* Error state */}
      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div>
              <p className="font-bold text-on_surface">Erreur</p>
              <p className="text-sm text-on_surface_variant">{error}</p>
            </div>
          </div>
          <button
            onClick={loadDrivers}
            className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Search */}
      {!loading && !error && (
        <AnimatedMount animation="slide-up" durationMs={500} className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-charcoal_border">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant"
              />
              <input
                type="text"
                placeholder="Rechercher un conducteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Driver cards */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">
                {searchQuery
                  ? 'Aucun conducteur trouvé'
                  : 'Aucun conducteur enregistré'}
              </p>
              <p className="text-xs text-on_surface_variant/60 mt-1">
                {searchQuery
                  ? 'Essayez un autre terme de recherche'
                  : 'Les conducteurs apparaîtront ici après leur création'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filtered.map((driver, i) => (
                <div
                  key={driver.id}
                  className="            group glass-card-hover rounded-2xl p-5 relative overflow-hidden animate-in fade-in"
                  style={{ animationDelay: `${i * 75}ms` }}
                >
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                        {driver.firstName?.[0] || ''}{driver.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-bold text-on_surface text-sm">
                          {driver.firstName} {driver.lastName}
                        </p>
                        <p className="text-[10px] text-on_surface_variant font-mono">
                          {driver.licenseNumber || `ID: ${driver.id?.slice(0, 8)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-surface_container_high rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-[0.92]">
                        <MoreVertical size={16} className="text-on_surface_variant" />
                      </button>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-on_surface_variant">
                      <Phone size={12} />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on_surface_variant">
                      <Mail size={12} />
                      <span className="truncate">{driver.email || '—'}</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between py-3 border-t border-charcoal_border relative z-10">
                    <div className="flex items-center gap-2">
                      <Star
                        size={14}
                        className={driver.rating >= 4 ? 'text-warning_yellow fill-warning_yellow' : 'text-on_surface_variant'}
                      />
                      <span className="text-xs font-bold text-on_surface">
                        {driver.rating ? driver.rating.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-[10px] text-on_surface_variant">
                        ({driver.tripsCount || 0} trajets)
                      </span>
                    </div>
                    <span
                      className={`status-badge ${statusConfig[driver.status]?.badge || 'status-badge-default'}`}
                    >
                      {statusConfig[driver.status]?.label || driver.status}
                    </span>
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between pt-2 relative z-10">
                    <div className="flex items-center gap-1 text-[10px] text-on_surface_variant">
                      <Award size={12} />
                      <span>{driver.experienceYears || 0} ans d&apos;expérience</span>
                    </div>
                    <button className="text-[10px] font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      Profil <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedMount>
      )}
    </div>
  );
}
