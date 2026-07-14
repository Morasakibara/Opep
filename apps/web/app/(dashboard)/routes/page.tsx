'use client';

import React, { useState, useEffect } from 'react';
import {
  Route, Search, MapPin, ArrowRight, ChevronRight, Clock,
  AlertCircle, Plus, X, Loader2, CheckCircle2, Trash2, Edit2, Bus,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { routesApi } from '@/services/api.service';

interface AppRoute {
  id: string;
  departureCity: string;
  arrivalCity: string;
  distance?: number;
  duration?: string;
  price?: number;
  isActive: boolean;
  createdAt: string;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<AppRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<AppRoute | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formDeparture, setFormDeparture] = useState('');
  const [formArrival, setFormArrival] = useState('');
  const [formDistance, setFormDistance] = useState('');
  const [formPrice, setFormPrice] = useState('');

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => { loadRoutes(); }, []);

  async function loadRoutes() {
    setLoading(true);
    setError(null);
    try {
      const data = await routesApi.getAll();
      setRoutes(data as AppRoute[]);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingRoute(null);
    setFormDeparture(''); setFormArrival(''); setFormDistance(''); setFormPrice('');
    setShowModal(true);
  }

  function openEditModal(route: AppRoute) {
    setEditingRoute(route);
    setFormDeparture(route.departureCity);
    setFormArrival(route.arrivalCity);
    setFormDistance(route.distance?.toString() || '');
    setFormPrice(route.price?.toString() || '');
    setShowModal(true);
  }

  async function handleSave() {
    if (!formDeparture || !formArrival) { showToast('error', 'Ville départ et arrivée requises'); return; }
    setSaving(true);
    try {
      const data = { departureCity: formDeparture, arrivalCity: formArrival, distance: formDistance ? Number(formDistance) : undefined, price: formPrice ? Number(formPrice) : undefined };
      if (editingRoute) {
        await routesApi.update(editingRoute.id, data);
        showToast('success', 'Route mise à jour');
      } else {
        await routesApi.create(data);
        showToast('success', 'Route créée');
      }
      setShowModal(false);
      loadRoutes();
    } catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`Supprimer la route "${label}" ?`)) return;
    try {
      await routesApi.remove(id);
      showToast('success', `Route supprimée`);
      loadRoutes();
    } catch (err: any) { showToast('error', err.message || 'Erreur'); }
  }

  const filtered = routes.filter((r) =>
    r.departureCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.arrivalCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right ${
          toast.type === 'success' ? 'bg-success_green text-white' : 'bg-error_red text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Routes</h2>
          <p className="text-on_surface_variant">Gérez les lignes et trajets.</p>
        </div>
        <button onClick={openCreateModal}
          className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus size={20} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <Route size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{routes.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Total routes</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <MapPin size={20} className="text-secondary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{new Set([...routes.map(r => r.departureCity), ...routes.map(r => r.arrivalCity)]).size}</p>
          <p className="text-xs text-on_surface_variant font-medium">Villes desservies</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Bus size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{routes.filter(r => r.isActive).length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Actives</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <p className="font-bold text-on_surface">{error}</p>
          </div>
          <button onClick={loadRoutes} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher une ville..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Route size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">Aucune route</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((route, i) => (
                <div key={route.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Route size={22} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-on_surface">{route.departureCity}</span>
                      <ArrowRight size={14} className="text-primary" />
                      <span className="text-sm font-bold text-on_surface">{route.arrivalCity}</span>
                      <span className={`w-2 h-2 rounded-full ${route.isActive ? 'bg-success_green' : 'bg-on_surface_variant/30'}`} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-on_surface_variant">
                      {route.distance && <span>{route.distance} km</span>}
                      {route.price && <span className="font-bold text-primary">{route.price.toLocaleString()} FCFA</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openEditModal(route)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(route.id, `${route.departureCity} → ${route.arrivalCity}`)} className="p-2 hover:bg-error_red/10 text-error_red rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <ChevronRight size={16} className="text-on_surface_variant/30" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <h3 className="text-xl font-bold text-on_surface">
                {editingRoute ? 'Modifier' : 'Ajouter'} une route
              </h3>
              <button onClick={() => setShowModal(false)} className="text-on_surface_variant hover:text-primary"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Ville départ *</label>
                  <input type="text" value={formDeparture} onChange={(e) => setFormDeparture(e.target.value)} placeholder="Yaoundé" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Ville arrivée *</label>
                  <input type="text" value={formArrival} onChange={(e) => setFormArrival(e.target.value)} placeholder="Douala" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Distance (km)</label>
                  <input type="number" value={formDistance} onChange={(e) => setFormDistance(e.target.value)} placeholder="250" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Prix (FCFA)</label>
                  <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="5000" className="input-field" />
                </div>
              </div>
              <button onClick={handleSave} disabled={saving || !formDeparture || !formArrival}
                className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition disabled:opacity-70 flex items-center justify-center gap-2">
                {saving && <Loader2 size={20} className="animate-spin" />}
                {editingRoute ? 'Enregistrer' : 'Créer la route'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
