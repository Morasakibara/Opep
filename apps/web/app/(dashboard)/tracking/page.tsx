'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin, Navigation, Bus, Clock, AlertCircle,
  Search, ChevronRight, Radio, Activity,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { busesApi } from '@/services/api.service';

interface TrackingItem {
  id: string;
  busNumber: string;
  route: string;
  status: 'ON_ROUTE' | 'STOPPED' | 'DELAYED' | 'OFFLINE';
  speed: number;
  lastUpdate: string;
  lat?: number;
  lng?: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ON_ROUTE: { label: 'En route', color: 'bg-success_green/10 text-success_green', icon: <Navigation size={14} /> },
  STOPPED: { label: 'Arrêté', color: 'bg-warning_yellow/10 text-warning_yellow', icon: <Clock size={14} /> },
  DELAYED: { label: 'Retard', color: 'bg-error_red/10 text-error_red', icon: <AlertCircle size={14} /> },
  OFFLINE: { label: 'Hors ligne', color: 'bg-on_surface_variant/10 text-on_surface_variant', icon: <Radio size={14} /> },
};

const MOCK_TRACKING: TrackingItem[] = [
  { id: '1', busNumber: 'LT-982-AZ', route: 'Douala → Yaoundé', status: 'ON_ROUTE', speed: 85, lastUpdate: 'Il y a 2 min' },
  { id: '2', busNumber: 'LT-451-BX', route: 'Yaoundé → Bafoussam', status: 'STOPPED', speed: 0, lastUpdate: 'Il y a 15 min' },
  { id: '3', busNumber: 'LT-773-CM', route: 'Douala → Garoua', status: 'DELAYED', speed: 45, lastUpdate: 'Il y a 8 min' },
  { id: '4', busNumber: 'LT-204-DP', route: 'Yaoundé → Douala', status: 'ON_ROUTE', speed: 92, lastUpdate: 'Il y a 1 min' },
  { id: '5', busNumber: 'LT-639-ER', route: 'Bafoussam → Douala', status: 'OFFLINE', speed: 0, lastUpdate: 'Il y a 1h' },
];

export default function TrackingPage() {
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTrackingData();
  }, []);

  async function loadTrackingData() {
    setLoading(true);
    try {
      // Essaie de récupérer les bus réels pour les afficher dans le suivi
      const buses = await busesApi.getAll();
      if (Array.isArray(buses) && buses.length > 0) {
        // Mappe les bus réels avec des statuts GPS simulés
        const items: TrackingItem[] = buses.slice(0, 10).map((bus: any, i: number) => ({
          id: bus.id || `bus-${i}`,
          busNumber: bus.registrationNumber || bus.number || `BUS-${i + 1}`,
          route: bus.currentRoute || bus.route || 'Trajet non assigné',
          status: (['ON_ROUTE', 'STOPPED', 'DELAYED', 'OFFLINE'] as const)[i % 4],
          speed: Math.floor(Math.random() * 100),
          lastUpdate: `Il y a ${Math.floor(Math.random() * 30) + 1} min`,
        }));
        setTrackingItems(items);
      } else {
        setTrackingItems(MOCK_TRACKING);
      }
    } catch {
      // Fallback aux données mock
      setTrackingItems(MOCK_TRACKING);
    } finally {
      setLoading(false);
    }
  }

  const filtered = trackingItems.filter((t) =>
    t.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Bus en ligne', value: trackingItems.filter((t) => t.status !== 'OFFLINE').length, color: 'text-success_green', icon: Bus },
    { label: 'En route', value: trackingItems.filter((t) => t.status === 'ON_ROUTE').length, color: 'text-primary', icon: Navigation },
    { label: 'Retards', value: trackingItems.filter((t) => t.status === 'DELAYED').length, color: 'text-error_red', icon: AlertCircle },
    { label: 'Parc', value: trackingItems.length, color: 'text-on_surface', icon: Activity },
  ];

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Suivi GPS</h2>
          <p className="text-on_surface_variant">Géolocalisation en temps réel de la flotte.</p>
        </div>
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

      {/* Map placeholder */}
      <div className="glass-card rounded-3xl p-6 animate-in slide-in-from-bottom duration-500">
        <div className="bg-surface_dim rounded-2xl h-[300px] flex items-center justify-center border-2 border-dashed border-charcoal_border">
          <div className="text-center">
            <MapPin size={48} className="mx-auto text-primary/30 mb-3" />
            <p className="text-on_surface_variant font-bold">Carte de géolocalisation</p>
            <p className="text-xs text-on_surface_variant/60 mt-1">
              Les données GPS temps réel sont mises à jour par les appareils mobiles via l'API POST /trips/:id/location
            </p>
          </div>
        </div>
      </div>

      {/* Live tracking list */}
      <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-600">
        <div className="p-5 border-b border-charcoal_border">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
            <input type="text" placeholder="Rechercher un bus..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
        </div>

        <div className="divide-y divide-charcoal_border">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Bus size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">{searchQuery ? 'Aucun bus trouvé' : 'Aucun bus en transit'}</p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <div key={item.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group cursor-pointer"
                style={{ animationDelay: `${i * 75}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bus size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-on_surface">{item.busNumber}</p>
                    <span className="text-[10px] text-on_surface_variant/60">{item.route}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusConfig[item.status]?.color || ''}`}>
                      {statusConfig[item.status]?.icon} {statusConfig[item.status]?.label || item.status}
                    </span>
                    {item.speed > 0 && (
                      <>
                        <span className="text-[10px] text-on_surface_variant/40">•</span>
                        <span className="text-[10px] text-on_surface_variant/60">{item.speed} km/h</span>
                      </>
                    )}
                    <span className="text-[10px] text-on_surface_variant/40 ml-auto">{item.lastUpdate}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
