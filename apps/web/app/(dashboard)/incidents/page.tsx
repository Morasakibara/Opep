'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Search, Shield, Clock,
  AlertCircle, CheckCircle2, ChevronRight, Filter,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { AnimatedMount } from '@/components/ui/AnimatedMount';
import { incidentsApi } from '@/services/api.service';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  resolvedAt?: string;
}

const severityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Mineur', color: 'text-on_surface_variant bg-on_surface_variant/10' },
  MEDIUM: { label: 'Moyen', color: 'text-warning_yellow bg-warning_yellow/10' },
  HIGH: { label: 'Élevé', color: 'text-error_red bg-error_red/10' },
  CRITICAL: { label: 'Critique', color: 'text-error_red bg-error_red/20 animate-pulse' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Ouvert', color: 'bg-error_red/10 text-error_red' },
  IN_PROGRESS: { label: 'En cours', color: 'bg-warning_yellow/10 text-warning_yellow' },
  RESOLVED: { label: 'Résolu', color: 'bg-success_green/10 text-success_green' },
  CLOSED: { label: 'Fermé', color: 'bg-on_surface_variant/10 text-on_surface_variant' },
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [filter, setFilter] = useState<'all' | 'open'>('all');

  useEffect(() => {
    loadIncidents();
  }, []);

  async function loadIncidents() {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentsApi.getAll();
      setIncidents(data as Incident[]);
    } catch (err: any) {
      console.warn('Incidents API unavailable, using mock data:', err.message);
      setIncidents([
        { id: '1', title: 'Panne climatisation bus LT-002', description: 'Climatisation HS sur le trajet Douala-Yaoundé. Passagers incommodés par la chaleur.', severity: 'HIGH', status: 'OPEN', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: '2', title: 'Retard important départ 08h00', description: 'Le bus est arrivé avec 45 minutes de retard en raison d\'un embouteillage sur le corridor.', severity: 'MEDIUM', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 14400000).toISOString() },
        { id: '3', title: 'Conflit passager-chauffeur', description: 'Un passager a eu une altercation avec le chauffeur concernant le changement de siège.', severity: 'MEDIUM', status: 'RESOLVED', createdAt: new Date(Date.now() - 86400000).toISOString(), resolvedAt: new Date(Date.now() - 43200000).toISOString() },
        { id: '4', title: 'Incident sécurité station Bonabéri', description: 'Tentative d\'intrusion dans le parking des bus signalée par le gardien de nuit.', severity: 'CRITICAL', status: 'OPEN', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '5', title: 'Problème paiement borne Orange Money', description: 'La borne OM de la gare de Mvan est hors service depuis hier soir.', severity: 'LOW', status: 'CLOSED', createdAt: new Date(Date.now() - 172800000).toISOString(), resolvedAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
      toast.info('Incidents', 'Données de démonstration affichées');
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === 'open'
    ? incidents.filter((i) => i.status === 'OPEN' || i.status === 'IN_PROGRESS')
    : incidents;

  const stats = [
    { label: 'Total', value: incidents.length, icon: AlertTriangle, color: 'text-on_surface' },
    { label: 'Critiques', value: incidents.filter((i) => i.severity === 'CRITICAL').length, icon: Shield, color: 'text-error_red' },
    { label: 'Ouverts', value: incidents.filter((i) => i.status === 'OPEN').length, icon: Clock, color: 'text-warning_yellow' },
    { label: 'Résolus', value: incidents.filter((i) => i.status === 'RESOLVED').length, icon: CheckCircle2, color: 'text-success_green' },
  ];

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <AnimatedMount animation="slide-up" durationMs={300} className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Incidents</h2>
          <p className="text-on_surface_variant">Suivi des incidents et anomalies opérationnelles.</p>
        </div>
      </AnimatedMount>

      <AnimatedMount animation="slide-up" durationMs={400} className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (              <div key={i} className="glass-card rounded-2xl p-5 active:scale-[0.98] transition-all">
            <stat.icon size={20} className={`${stat.color} mb-2`} />
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-on_surface_variant font-medium">{stat.label}</p>
          </div>
        ))}
      </AnimatedMount>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadIncidents} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all">Réessayer</button>
        </div>
      )}

      {!error && (
        <AnimatedMount animation="slide-up" durationMs={500}>
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-charcoal_border flex items-center gap-3">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${filter === 'all' ? 'bg-primary text-on_primary' : 'text-on_surface_variant hover:text-on_surface'}`}>Tous</button>
            <button onClick={() => setFilter('open')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${filter === 'open' ? 'bg-primary text-on_primary' : 'text-on_surface_variant hover:text-on_surface'}`}>Ouverts</button>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Shield size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">Aucun incident signalé</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((inc, i) => (
                <div key={inc.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 hover:translate-x-0.5 transition-all cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${severityConfig[inc.severity]?.color || ''}`}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">{inc.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityConfig[inc.severity]?.color || ''}`}>
                        {severityConfig[inc.severity]?.label || inc.severity}
                      </span>
                    </div>
                    <p className="text-xs text-on_surface_variant mt-0.5 line-clamp-1">{inc.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[inc.status]?.color || ''}`}>
                        {statusConfig[inc.status]?.label || inc.status}
                      </span>
                      <span className="text-[10px] text-on_surface_variant/60">
                        {new Date(inc.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
        </AnimatedMount>
      )}
    </div>
  );
}
