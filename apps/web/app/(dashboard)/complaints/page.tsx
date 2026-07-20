'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle, Search, MessageSquare, Clock,
  CheckCircle2, ChevronRight, User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { complaintsApi } from '@/services/api.service';

interface Complaint {
  id: string;
  passengerName: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  resolvedAt?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Ouvert', color: 'bg-error_red/10 text-error_red' },
  IN_REVIEW: { label: 'En cours', color: 'bg-warning_yellow/10 text-warning_yellow' },
  RESOLVED: { label: 'Résolu', color: 'bg-success_green/10 text-success_green' },
  CLOSED: { label: 'Fermé', color: 'bg-on_surface_variant/10 text-on_surface_variant' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Basse', color: 'text-on_surface_variant' },
  MEDIUM: { label: 'Moyenne', color: 'text-warning_yellow' },
  HIGH: { label: 'Haute', color: 'text-error_red' },
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'open'>('all');

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN_PLATFORM' || user?.role === 'AGENCY_MANAGER' || user?.role === 'COMPANY_DIRECTOR' || user?.role === 'CENTRE_MANAGER';

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    setLoading(true);
    setError(null);
    try {
      const data = isAdmin ? await complaintsApi.getAll() : await complaintsApi.getMy();
      setComplaints(Array.isArray(data) ? data as Complaint[] : []);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des réclamations');
    } finally {
      setLoading(false);
    }
  }

  const filtered = complaints.filter((c) => {
    if (filter === 'open') return c.status === 'OPEN' || c.status === 'IN_REVIEW';
    return true;
  }).filter((c) =>
    c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.passengerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Réclamations</h2>
          <p className="text-on_surface_variant">Gestion des plaintes et réclamations clients.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <MessageSquare size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{complaints.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Total réclamations</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <AlertCircle size={20} className="text-error_red mb-2" />
          <p className="text-2xl font-bold text-on_surface">{complaints.filter((c) => c.status === 'OPEN').length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Ouvertes</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Clock size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{complaints.filter((c) => c.status === 'IN_REVIEW').length}</p>
          <p className="text-xs text-on_surface_variant font-medium">En cours</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <CheckCircle2 size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Résolues</p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div>
              <p className="font-bold text-on_surface">Erreur de chargement</p>
              <p className="text-sm text-on_surface_variant">{error}</p>
            </div>
          </div>
          <button onClick={loadComplaints} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-primary text-on_primary' : 'text-on_surface_variant hover:text-on_surface'}`}>Toutes</button>
            <button onClick={() => setFilter('open')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'open' ? 'bg-primary text-on_primary' : 'text-on_surface_variant hover:text-on_surface'}`}>Ouvertes</button>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <MessageSquare size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">
                {searchQuery ? 'Aucune réclamation trouvée' : 'Aucune réclamation'}
              </p>
              <p className="text-xs text-on_surface_variant/60 mt-1">
                {searchQuery ? 'Essayez un autre terme de recherche' : 'Les réclamations apparaîtront ici après soumission'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((complaint, i) => (
                <div key={complaint.id} className="p-5 flex items-start gap-4 hover:bg-primary/5 transition-all group cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">{complaint.subject}</p>
                      <span className={`text-[10px] font-bold ${priorityConfig[complaint.priority]?.color || ''}`}>
                        {priorityConfig[complaint.priority]?.label || complaint.priority}
                      </span>
                    </div>
                    <p className="text-xs text-on_surface_variant mt-0.5 line-clamp-1">{complaint.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-on_surface_variant/60">{complaint.passengerName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[complaint.status]?.color || ''}`}>
                        {statusConfig[complaint.status]?.label || complaint.status}
                      </span>
                      <span className="text-[10px] text-on_surface_variant/40">
                        {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all flex-shrink-0 mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
