'use client';

import React, { useState } from 'react';
import {
  Building2, Plus, Search, X, Loader2, CheckCircle2, AlertCircle,
  MapPin, Phone, Mail, User, Star, ArrowRight,
} from 'lucide-react';
import { useCompanies, useCreateCompany } from '@/hooks/useEntities';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SkeletonCard } from '@/components/ui';

interface CompanyView {
  id: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  isActive: boolean;
  publicRatingAverage?: number;
  reviewsCount: number;
  director?: { firstName: string; lastName: string };
}

export default function CompaniesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<CompanyView | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: companies = [], isLoading, error, refetch } = useCompanies();
  const createCompany = useCreateCompany();

  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  const filteredCompanies = (companies as CompanyView[]).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleCreate() {
    if (!newName || !newCity || !newAddress || !newPhone || !newEmail) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      await createCompany.mutateAsync({
        name: newName, city: newCity, address: newAddress,
        phone: newPhone, email: newEmail,
      });
      showToast('success', 'Compagnie créée avec succès');
      setShowAddModal(false);
      setNewName(''); setNewCity(''); setNewAddress(''); setNewPhone(''); setNewEmail('');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la création');
    }
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-success_green text-white' : 'bg-error_red text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Compagnies</h2>
          <p className="text-on_surface_variant">Gérez les compagnies de transport et leurs abonnements.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Nouvelle compagnie
        </button>
      </div>

      {/* Error State */}
      {error && (
        <ErrorState
          title="Erreur de chargement"
          message={(error as any)?.message || 'Impossible de charger les compagnies'}
          onRetry={() => refetch()}
        />
      )}

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
        <input
          type="text"
          placeholder="Rechercher par nom, ville..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Companies Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<Building2 size={32} />}
                title="Aucune compagnie"
                message="Aucune compagnie trouvée. Créez-en une nouvelle pour commencer."
                action={{ label: 'Nouvelle compagnie', onClick: () => setShowAddModal(true) }}
              />
            </div>
          ) : (
            filteredCompanies.map((company: any) => (
              <div
                key={company.id}
                className="glass-card-hover rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setShowDetailModal(company)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                      <Building2 size={24} />
                    </div>
                    <Badge
                      label={company.isActive ? 'Actif' : 'Inactif'}
                      variant={company.isActive ? 'success' : 'danger'}
                    />
                  </div>

                  <h4 className="text-lg font-bold text-on_surface mb-1">{company.name}</h4>
                  <div className="flex items-center text-sm text-on_surface_variant mb-4">
                    <MapPin size={14} className="mr-1" />
                    {company.city}
                  </div>

                  <div className="flex items-center gap-4 py-3 border-t border-charcoal_border">
                    <div className="flex items-center text-xs text-on_surface_variant">
                      <Star size={14} className="mr-1 text-tertiary" />
                      {company.publicRatingAverage?.toFixed(1) || 'N/A'} ({company.reviewsCount || 0})
                    </div>
                    {company.director && (
                      <div className="flex items-center text-xs text-on_surface_variant">
                        <User size={14} className="mr-1" />
                        {company.director.firstName} {company.director.lastName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-on_surface_variant mt-3">
                    <Phone size={12} />
                    <span>{company.phone}</span>
                    <Mail size={12} className="ml-2" />
                    <span>{company.email}</span>
                  </div>
                </div>
                <div className="px-6 py-3 bg-surface_container_low flex justify-end opacity-0 group-hover:opacity-100 transition">
                  <button className="text-xs font-bold text-primary flex items-center gap-1">
                    Détails <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowDetailModal(null)}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on_surface">{showDetailModal.name}</h3>
                  <p className="text-sm text-on_surface_variant">{showDetailModal.city}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(null)} className="text-on_surface_variant hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Note</p>
                  <div className="flex items-center">
                    <Star size={16} className="text-tertiary mr-1" />
                    <span className="text-lg font-bold text-on_surface">{showDetailModal.publicRatingAverage?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-4 bg-success_green/10 rounded-2xl">
                  <p className="text-[10px] font-bold text-success_green uppercase mb-1">Avis</p>
                  <p className="text-lg font-bold text-on_surface">{showDetailModal.reviewsCount || 0}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { icon: <Phone size={16} />, label: showDetailModal.phone },
                  { icon: <Mail size={16} />, label: showDetailModal.email },
                  showDetailModal.director && { icon: <User size={16} />, label: `Directeur : ${showDetailModal.director.firstName} ${showDetailModal.director.lastName}` },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface_container_low rounded-xl text-sm text-on_surface_variant">
                    <span className="text-primary">{item!.icon}</span>
                    <span>{item!.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-surface_container_low border-t border-charcoal_border">
              <button onClick={() => setShowDetailModal(null)} className="w-full bg-primary text-on_primary py-3 rounded-2xl font-bold hover:brightness-110 transition">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <h3 className="text-xl font-bold text-on_surface">Nouvelle compagnie</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on_surface_variant hover:text-primary">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="input-label">Nom</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ex: OPEP Express" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Ville</label>
                  <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Douala" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Adresse</label>
                  <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="123 Rue X" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Téléphone</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+237 6XXXXXXXX" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="contact@opep.cm" className="input-field" />
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={createCompany.isPending}
                className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {createCompany.isPending && <Loader2 size={20} className="animate-spin" />}
                Créer la compagnie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
