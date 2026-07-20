'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Map, Plus, Search, MoreVertical, MapPin, Bus, ArrowRight, Filter, AlertCircle, ChevronRight } from 'lucide-react';
import { tripsApi, routesApi } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'trajets' | 'lignes'>('trajets');
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true); setError(null);
    try {
      const [routesData, tripsData] = await Promise.all([routesApi.getAll(), tripsApi.getAll()]);
      setRoutes(routesData); setTrips(tripsData);
    } catch (err: any) { setError(err.message || 'Erreur de chargement'); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  const displayRoutes = routes.map((r: any) => ({
    id: r.id?.slice(0, 7) || 'R',
    origin: r.departureCity || '?', destination: r.arrivalCity || '?',
    duration: `${Math.floor((r.estimatedDurationMinutes || 0) / 60)}h${(r.estimatedDurationMinutes || 0) % 60}`,
    distance: `${r.distanceKm || 0} km`,
    tripsCount: trips.filter((t: any) => t.routeId === r.id).length,
  }));

  const displayTrips = trips.map((t: any) => {
    const totalSeats = t.bus?.totalSeats || 48;
    const filledSeats = t.filledSeats || 0;
    return {
      id: t.id?.slice(0, 7) || 'T',
      route: `${t.route?.departureCity || '?'} → ${t.route?.arrivalCity || '?'}`,
      departure: t.departureDateTime ? new Date(t.departureDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      arrival: t.arrivalDateTime ? new Date(t.arrivalDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      date: t.departureDateTime ? new Date(t.departureDateTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'N/A',
      bus: t.bus?.plateNumber || t.busId?.slice(0, 7) || 'N/A',
      price: `${(t.basePrice || 0).toLocaleString('fr-FR')} FCFA`,
      seats: `${filledSeats}/${totalSeats}`,
      fillPercent: totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0,
      status: t.status === 'SCHEDULED' ? 'Planifié' : t.status === 'BOARDING' ? 'Embarquement' : t.status === 'COMPLETED' ? 'Terminé' : t.status || 'N/A',
    };
  });

  const filteredRoutes = displayRoutes.filter(r => r.origin.toLowerCase().includes(searchQuery.toLowerCase()) || r.destination.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTrips = displayTrips.filter(t => t.route.toLowerCase().includes(searchQuery.toLowerCase()) || t.bus.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Lignes & Trajets</h2>
          <p className="text-on_surface_variant">Définissez vos itinéraires et planifiez les départs.</p>
        </div>
        <button onClick={() => setActiveTab('trajets')} className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus size={20} /> {activeTab === 'lignes' ? 'Nouvelle ligne' : 'Planifier un trajet'}
        </button>
      </div>

      <div className="flex gap-1 bg-surface_container_low p-1 rounded-xl w-fit">
        {(['trajets', 'lignes'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab ? 'bg-surface_container text-primary shadow-sm' : 'text-on_surface_variant hover:text-on_surface'}`}>
            {tab === 'trajets' ? 'Trajets planifiés' : 'Lignes (Itinéraires)'}
          </button>
        ))}
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div><p className="font-bold text-on_surface">Erreur</p><p className="text-sm text-on_surface_variant">{error}</p></div>
          </div>
          <button onClick={loadData} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
          <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
        </div>
        <button className="input-field max-w-[140px] flex items-center justify-center gap-2 font-bold text-on_surface_variant hover:text-on_surface transition">
          <Filter size={16} /> Filtres
        </button>
      </div>

      {activeTab === 'lignes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="glass-card-hover rounded-2xl overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl"><Map size={24} /></div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="w-0.5 h-6 bg-charcoal_border my-1"></div>
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on_surface leading-tight">{route.origin}</p>
                    <div className="h-4"></div>
                    <p className="text-sm font-bold text-on_surface leading-tight">{route.destination}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal_border">
                  <div><p className="text-[10px] text-on_surface_variant font-bold uppercase mb-1">Distance</p><p className="text-sm font-bold text-on_surface">{route.distance}</p></div>
                  <div><p className="text-[10px] text-on_surface_variant font-bold uppercase mb-1">Durée</p><p className="text-sm font-bold text-on_surface">{route.duration}</p></div>
                </div>
              </div>
              <div className="px-6 py-4 bg-surface_container_low flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-bold text-on_surface_variant">{route.tripsCount} trajets</p>
                <button onClick={() => { setActiveTab('trajets'); setSearchQuery(route.origin); }} className="text-xs font-bold text-primary flex items-center gap-1">
                  Détails <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4">Trajet</th><th className="px-6 py-4">Départ / Arrivée</th>
                  <th className="px-6 py-4">Bus</th><th className="px-6 py-4">Remplissage</th>
                  <th className="px-6 py-4">Prix</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal_border">
                {filteredTrips.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-on_surface_variant">Aucun trajet trouvé</td></tr>
                ) : filteredTrips.map((trip) => (
                  <tr key={trip.id} className="table-row">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-on_surface">{trip.route}</p>
                      <p className="text-[10px] text-on_surface_variant">{trip.id}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on_surface">{trip.departure}</span>
                        <ArrowRight size={12} className="text-on_surface_variant" />
                        <span className="text-xs font-bold text-on_surface">{trip.arrival}</span>
                      </div>
                      <p className="text-[10px] text-on_surface_variant mt-1">{trip.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-surface_container_high rounded flex items-center justify-center"><Bus size={12} className="text-primary" /></div>
                        <span className="text-xs font-bold text-on_surface_variant">{trip.bus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span>{trip.seats}</span></div>
                        <div className="h-1.5 w-full bg-surface_container_highest rounded-full overflow-hidden">
                          <div className={`h-full ${trip.fillPercent > 60 ? 'bg-secondary' : 'bg-primary'}`} style={{ width: `${trip.fillPercent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><span className="text-sm font-bold text-on_surface">{trip.price}</span></td>
                    <td className="px-6 py-5">
                      <span className={`status-badge ${
                        trip.status === 'Planifié' ? 'status-badge-info' :
                        trip.status === 'Embarquement' ? 'status-badge-warning' :
                        trip.status === 'Terminé' ? 'status-badge-success' : 'status-badge-default'
                      }`}>{trip.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right"><button className="p-2 hover:bg-surface_container_high rounded-lg transition"><MoreVertical size={18} className="text-on_surface_variant" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
