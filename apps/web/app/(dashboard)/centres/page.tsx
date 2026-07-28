'use client';

import React, { useState } from 'react';
import {
  Store, Plus, Search, X, Loader2, MapPin, Phone, Mail, User, Star, Trophy, Award, Building2,
  CheckCircle2, AlertCircle, ArrowRight,
} from 'lucide-react';
import { useCentres, useCreateCentre, useCentreRanking, useCompanies } from '@/hooks/useEntities';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui';

interface CentreView {
  id: string; name: string; city: string; address: string; phone: string; email: string;
  companyId: string; company?: { name: string };
  manager?: { firstName: string; lastName: string };
  isActive: boolean; publicRatingAverage?: number; reviewsCount: number;
  cancellationPenaltyPercent?: number;
}

export default function CentresPage() {
  const [activeTab, setActiveTab] = useState<'centres' | 'classement'>('centres');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<CentreView | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: centres = [], isLoading: centresLoading, error: centresError, refetch } = useCentres();
  const { data: ranking = [], isLoading: rankingLoading } = useCentreRanking();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const createCentre = useCreateCentre();

  const isLoading = centresLoading || rankingLoading || companiesLoading;
  const error = centresError;

  const [newName, setNewName] = useState(''); const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState(''); const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState(''); const [newCompanyId, setNewCompanyId] = useState('');

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message }); setTimeout(() => setToast(null), 3000);
  }

  const filteredCentres = (centres as CentreView[]).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleCreate() {
    if (!newName || !newCity || !newAddress || !newPhone || !newEmail || !newCompanyId) {
      showToast('error', 'Veuillez remplir tous les champs'); return;
    }
    try {
      await createCentre.mutateAsync({ name: newName, city: newCity, address: newAddress, phone: newPhone, email: newEmail, companyId: newCompanyId });
      showToast('success', 'Centre créé avec succès');
      setShowAddModal(false); resetForm();
    } catch (err: any) { showToast('error', err.message || 'Erreur'); }
  }

  function resetForm() {
    setNewName(''); setNewCity(''); setNewAddress(''); setNewPhone(''); setNewEmail(''); setNewCompanyId('');
  }

  const companyOptions = (companies as { id: string; name: string }[]);

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
          <h2 className="text-2xl font-bold text-on_surface">Centres</h2>
          <p className="text-on_surface_variant">Gérez les centres d'exploitation et leur classement.</p>
        </div>
        <button onClick={() => { if (companyOptions.length) setShowAddModal(true); else showToast('error', 'Créez d\'abord une compagnie'); }}
          className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus size={20} /> Nouveau centre
        </button>
      </div>

      <div className="flex gap-1 bg-surface_container_low p-1 rounded-xl w-fit">
        {(['centres', 'classement'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all active:scale-[0.97] ${
              activeTab === tab ? 'bg-surface_container text-primary shadow-sm' : 'text-on_surface_variant hover:text-on_surface'
            }`}>
            {tab === 'centres' ? <><Store size={16} className="inline mr-2" />Centres</> : <><Trophy size={16} className="inline mr-2" />Classement</>}
          </button>
        ))}
      </div>

      {error && <ErrorState title="Erreur" message={(error as any)?.message} onRetry={() => refetch()} />}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {!isLoading && !error && activeTab === 'centres' && (
        <>
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
            <input type="text" placeholder="Rechercher par nom, ville, compagnie..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
            {filteredCentres.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon={<Store size={32} />} title="Aucun centre" message="Aucun centre trouvé. Créez-en un nouveau." 
                  action={{ label: 'Nouveau centre', onClick: () => setShowAddModal(true) }} />
              </div>
            ) : filteredCentres.map((centre: any) => (
              <div key={centre.id} className="glass-card-hover rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
                onClick={() => setShowDetailModal(centre)}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Store size={24} /></div>
                    <Badge label={centre.isActive ? 'Actif' : 'Inactif'} variant={centre.isActive ? 'success' : 'danger'} />
                  </div>
                  <h4 className="text-lg font-bold text-on_surface mb-1">{centre.name}</h4>
                  <div className="flex items-center text-sm text-on_surface_variant mb-2">
                    <MapPin size={14} className="mr-1" /> {centre.city}
                  </div>
                  {centre.company && (
                    <div className="flex items-center text-xs text-on_surface_variant/60 mb-3">
                      <Building2 size={12} className="mr-1" /> {centre.company.name}
                    </div>
                  )}
                  <div className="flex items-center gap-4 py-3 border-t border-charcoal_border">
                    <div className="flex items-center text-xs text-on_surface_variant">
                      <Star size={14} className="mr-1 text-tertiary" /> {centre.publicRatingAverage?.toFixed(1) || 'N/A'}
                    </div>
                    {centre.manager && (
                      <div className="flex items-center text-xs text-on_surface_variant">
                        <User size={14} className="mr-1" /> {centre.manager.firstName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 bg-surface_container_low flex justify-end opacity-0 group-hover:opacity-100 transition">
                  <button className="text-xs font-bold text-primary flex items-center gap-1">Détails <ArrowRight size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && !error && activeTab === 'classement' && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-6 border-b border-charcoal_border">
            <div className="flex items-center gap-3">
              <Trophy size={24} className="text-tertiary" />
              <div>
                <h3 className="text-lg font-bold text-on_surface">Classement des centres</h3>
                <p className="text-sm text-on_surface_variant">Basé sur les notes et avis des clients</p>
              </div>
            </div>
          </div>
          {(ranking as any[]).length === 0 ? (
            <div className="p-12">
              <EmptyState icon={<Award size={32} />} title="Pas assez de données"
                message="Le classement sera disponible quand les centres auront reçu au moins 5 avis." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="table-header">
                  <tr>
                    <th className="px-6 py-4">Rang</th><th className="px-6 py-4">Centre</th>
                    <th className="px-6 py-4">Compagnie</th><th className="px-6 py-4">Ville</th>
                    <th className="px-6 py-4">Note</th><th className="px-6 py-4">Avis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal_border">
                  {(ranking as any[]).map((centre: any, index: number) => (
                    <tr key={centre.id} className="table-row" onClick={() => setShowDetailModal(centre)}>
                      <td className="px-6 py-5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-tertiary/20 text-tertiary' :
                          index === 1 ? 'bg-surface_container_high text-on_surface_variant' :
                          index === 2 ? 'bg-secondary/20 text-secondary' : 'bg-surface_container_low text-on_surface_variant'
                        }`}>{index + 1}</div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-on_surface">{centre.name}</td>
                      <td className="px-6 py-5 text-sm text-on_surface_variant">{centre.company?.name || '-'}</td>
                      <td className="px-6 py-5"><div className="flex items-center text-sm text-on_surface_variant"><MapPin size={14} className="mr-1" />{centre.city}</div></td>
                      <td className="px-6 py-5"><div className="flex items-center"><Star size={16} className="text-tertiary mr-1" /><span className="text-sm font-bold text-on_surface">{centre.publicRatingAverage?.toFixed(1) || 'N/A'}</span></div></td>
                      <td className="px-6 py-5"><span className="text-sm font-bold text-on_surface_variant">{centre.reviewsCount}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowDetailModal(null)}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Store size={24} /></div>
                <div><h3 className="text-xl font-bold text-on_surface">{showDetailModal.name}</h3><p className="text-sm text-on_surface_variant">{showDetailModal.city}</p></div>
              </div>
              <button onClick={() => setShowDetailModal(null)} className="text-on_surface_variant hover:text-primary"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl"><p className="text-[10px] font-bold text-primary uppercase mb-1">Note</p><div className="flex items-center"><Star size={16} className="text-tertiary mr-1" /><span className="text-lg font-bold text-on_surface">{showDetailModal.publicRatingAverage?.toFixed(1) || 'N/A'}</span></div></div>
                <div className="p-4 bg-success_green/10 rounded-2xl"><p className="text-[10px] font-bold text-success_green uppercase mb-1">Avis</p><p className="text-lg font-bold text-on_surface">{showDetailModal.reviewsCount || 0}</p></div>
              </div>
              <div className="space-y-3">
                {[
                  { icon: <Building2 size={16} />, label: showDetailModal.company?.name || 'N/A' },
                  { icon: <MapPin size={16} />, label: showDetailModal.address },
                  { icon: <Phone size={16} />, label: showDetailModal.phone },
                  { icon: <Mail size={16} />, label: showDetailModal.email },
                  showDetailModal.manager && { icon: <User size={16} />, label: `Manager : ${showDetailModal.manager.firstName} ${showDetailModal.manager.lastName}` },
                  showDetailModal.cancellationPenaltyPercent && { icon: null, label: `Pénalité : ${showDetailModal.cancellationPenaltyPercent}%` },
                ].filter(Boolean).map((item: any, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface_container_low rounded-xl text-sm text-on_surface_variant">
                    {item.icon && <span className="text-primary">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-surface_container_low border-t border-charcoal_border">
              <button onClick={() => setShowDetailModal(null)} className="w-full bg-primary text-on_primary py-3 rounded-2xl font-bold hover:brightness-110 active:scale-[0.97] transition-all">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <h3 className="text-xl font-bold text-on_surface">Nouveau centre</h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-on_surface_variant hover:text-primary active:scale-[0.92] transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="input-label">Compagnie</label>
                <select value={newCompanyId} onChange={(e) => setNewCompanyId(e.target.value)} className="input-field font-bold">
                  <option value="">Sélectionner</option>
                  {companyOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="input-label">Nom du centre</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ex: Gare de Douala" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Ville</label>
                  <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Douala" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Adresse</label>
                  <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="123 Rue" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="input-label">Téléphone</label><input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+237 6XXXXXXXX" className="input-field" /></div>
                <div className="space-y-2"><label className="input-label">Email</label><input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="contact@opep.cm" className="input-field" /></div>
              </div>
              <button onClick={handleCreate} disabled={createCentre.isPending}
                className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                {createCentre.isPending && <Loader2 size={20} className="animate-spin" />}
                Créer le centre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
