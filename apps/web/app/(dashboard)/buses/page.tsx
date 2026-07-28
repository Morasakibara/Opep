'use client';

import React, { useState, useEffect } from 'react';
import { Bus as BusIcon, Plus, Search, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { busesApi } from '@/services/api.service';
import { AddBusModal, SeatConfigModal, BusHistoryModal } from '@/components/buses';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

export default function BusesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [seatConfigBus, setSeatConfigBus] = useState<string | null>(null);
  const [historyModal, setHistoryModal] = useState<{ id: string; model: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadBuses() {
    setLoading(true);
    try {
      const data = await busesApi.getAll();
      setBuses(data);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadBuses(); }, []);

  const displayBuses = buses.map((bus) => ({
    id: bus.plateNumber || bus.id?.slice(0, 7) || 'BUS',
    model: bus.model || 'Inconnu',
    capacity: bus.totalSeats || 0,
    type: bus.totalSeats > 45 ? 'VIP' : 'Classique' as const,
    status: bus.isActive !== false ? 'Actif' : 'Maintenance' as const,
    lastService: bus.updatedAt ? new Date(bus.updatedAt).toLocaleDateString('fr-FR') : 'N/A',
  }));

  const filteredBuses = displayBuses.filter(bus =>
    bus.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8">
      {toast && (
        <AnimatedMount animation="fade" className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${ toast.type === 'success' ? 'bg-success_green text-white' : 'bg-error_red text-white' }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </AnimatedMount>
      )}

      <AnimatedMount animation="slide-up" durationMs={300} className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Gestion des Bus</h2>
          <p className="text-on_surface_variant">Gérez la flotte de véhicules de votre agence.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus size={20} /> Ajouter un bus
        </button>
      </AnimatedMount>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div><p className="font-bold text-on_surface">Erreur</p><p className="text-sm text-on_surface_variant">{error}</p></div>
          </div>
          <button onClick={() => { setError(null); loadBuses(); }} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all">
            Réessayer
          </button>
        </div>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
          <input type="text" placeholder="Rechercher par immatriculation, modèle..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
        </div>
        <select className="input-field max-w-[180px] cursor-pointer">
          <option>Tous les types</option><option>VIP</option><option>Classique</option>
        </select>
      </div>

      <AnimatedMount animation="slide-up" durationMs={500} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <div key={bus.id} className="glass-card-hover rounded-2xl overflow-hidden group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${bus.type === 'VIP' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                  <BusIcon size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`status-badge ${bus.status === 'Actif' ? 'status-badge-success' : 'status-badge-warning'}`}>
                    {bus.status}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-on_surface mb-1">{bus.id}</h4>
              <p className="text-sm text-on_surface_variant mb-4">{bus.model}</p>
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-charcoal_border">
                <div>
                  <p className="text-[10px] text-on_surface_variant font-bold uppercase mb-1">Capacité</p>
                  <p className="text-sm font-bold text-on_surface">{bus.capacity} places</p>
                </div>
                <div>
                  <p className="text-[10px] text-on_surface_variant font-bold uppercase mb-1">Dernière révision</p>
                  <p className="text-sm font-bold text-on_surface">{bus.lastService}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-surface_container_low flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setSeatConfigBus(bus.id)}
                className="text-xs font-bold text-primary flex items-center gap-1 active:scale-[0.92] transition-all">
                <Settings size={14} /> Configurer les sièges
              </button>
              <button onClick={() => setHistoryModal({ id: bus.id, model: bus.model })} className="text-xs font-bold text-on_surface_variant hover:text-on_surface active:scale-[0.92] transition-all">
                Historique
              </button>
            </div>
          </div>
        ))}
      </AnimatedMount>

      <AddBusModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadBuses}
      />

      <BusHistoryModal
        isOpen={!!historyModal}
        busId={historyModal?.id || ''}
        busModel={historyModal?.model || ''}
        onClose={() => setHistoryModal(null)}
      />

      <SeatConfigModal
        isOpen={!!seatConfigBus}
        busId={seatConfigBus || ''}
        seatCapacity={displayBuses.find(b => b.id === seatConfigBus)?.capacity || 48}
        onClose={() => setSeatConfigBus(null)}
      />
    </div>
  );
}
