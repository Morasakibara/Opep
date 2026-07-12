'use client';

import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
  Star,
  Trophy,
  Award,
  Building2,
} from 'lucide-react';
import { useCentres, useCreateCentre, useCentreRanking, useCompanies } from '@/hooks/useEntities';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

interface CentreView {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  companyId: string;
  company?: { name: string };
  manager?: { firstName: string; lastName: string };
  isActive: boolean;
  publicRatingAverage?: number;
  reviewsCount: number;
  cancellationPenaltyPercent?: number;
}

interface CompanyOption {
  id: string;
  name: string;
}

export default function CentresPage() {
  const [activeTab, setActiveTab] = useState<'centres' | 'classement'>('centres');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<CentreView | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // React Query hooks
  const { data: centres = [], isLoading: centresLoading, error: centresError } = useCentres();
  const { data: ranking = [], isLoading: rankingLoading } = useCentreRanking();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const createCentre = useCreateCentre();

  const isLoading = centresLoading || rankingLoading || companiesLoading;
  const error = centresError;

  // Form state
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompanyId, setNewCompanyId] = useState('');

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  const filteredCentres = (centres as CentreView[]).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleCreate() {
    if (!newName || !newCity || !newAddress || !newPhone || !newEmail || !newCompanyId) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      await createCentre.mutateAsync({
        name: newName,
        city: newCity,
        address: newAddress,
        phone: newPhone,
        email: newEmail,
        companyId: newCompanyId,
      });
      showToast('success', 'Centre créé avec succès');
      setShowAddModal(false);
      setNewName(''); setNewCity(''); setNewAddress(''); setNewPhone(''); setNewEmail(''); setNewCompanyId('');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la création');
    }
  }

  const companyOptions = (companies as CompanyOption[]);

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Centres</h2>
          <p className="text-gray-500">Gérez les centres d'exploitation et leur classement.</p>
        </div>
        <button
          onClick={() => { if (companyOptions.length) setShowAddModal(true); else showToast('error', 'Créez d\'abord une compagnie'); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Plus size={20} className="mr-2" />
          Nouveau centre
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('centres')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'centres' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Store size={16} className="inline mr-2" />
          Centres
        </button>
        <button
          onClick={() => setActiveTab('classement')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'classement' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Trophy size={16} className="inline mr-2" />
          Classement
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="font-bold text-red-700">Erreur</p>
              <p className="text-sm text-red-500">{(error as any)?.message || 'Erreur de chargement'}</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition">
            Réessayer
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingSpinner text="Chargement des centres..." />}

      {/* Tab: Centres List */}
      {!isLoading && !error && activeTab === 'centres' && (
        <>
          <div className="flex space-x-4">
            <div className="flex-1 bg-white rounded-xl border border-gray-100 flex items-center px-4 shadow-sm">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville, compagnie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 bg-transparent border-none outline-none text-sm w-full text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCentres.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  icon={<Store size={32} />}
                  title="Aucun centre"
                  message="Aucun centre trouvé. Créez-en un nouveau."
                />
              </div>
            )}
            {filteredCentres.map((centre: any) => (
              <div
                key={centre.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition group cursor-pointer"
                onClick={() => setShowDetailModal(centre)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Store size={24} />
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${centre.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {centre.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-gray-900 mb-1">{centre.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin size={14} className="mr-1" />
                    {centre.city}
                  </div>
                  {centre.company && (
                    <div className="flex items-center text-xs text-gray-400 mb-3">
                      <Building2 size={12} className="mr-1" />
                      {centre.company.name}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 py-3 border-t border-gray-50">
                    <div className="flex items-center text-xs text-gray-600">
                      <Star size={14} className="mr-1 text-yellow-500" />
                      {centre.publicRatingAverage?.toFixed(1) || 'N/A'}
                    </div>
                    {centre.manager && (
                      <div className="flex items-center text-xs text-gray-600">
                        <User size={14} className="mr-1" />
                        {centre.manager.firstName} {centre.manager.lastName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 flex justify-end opacity-0 group-hover:opacity-100 transition">
                  <button className="text-xs font-bold text-blue-600 hover:underline">Détails →</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tab: Ranking */}
      {!isLoading && !error && activeTab === 'classement' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center space-x-3">
              <Trophy size={24} className="text-yellow-500" />
              <div>
                <h3 className="text-lg font-black text-gray-900">Classement des centres</h3>
                <p className="text-sm text-gray-500">Basé sur les notes et avis des clients</p>
              </div>
            </div>
          </div>
          {(ranking as any[]).length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={<Award size={32} />}
                title="Pas assez de données"
                message="Le classement sera disponible quand les centres auront reçu au moins 5 avis."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                    <th className="px-6 py-4">Rang</th>
                    <th className="px-6 py-4">Centre</th>
                    <th className="px-6 py-4">Compagnie</th>
                    <th className="px-6 py-4">Ville</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4">Avis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(ranking as any[]).map((centre: any, index: number) => (
                    <tr key={centre.id} className="hover:bg-gray-50 transition group" onClick={() => setShowDetailModal(centre)}>
                      <td className="px-6 py-5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-900">{centre.name}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-600">{centre.company?.name || '-'}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          {centre.city}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-500 mr-1" />
                          <span className="text-sm font-black text-gray-900">{centre.publicRatingAverage?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-gray-700">{centre.reviewsCount}</span>
                      </td>
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowDetailModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Store size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{showDetailModal.name}</h3>
                  <p className="text-sm text-gray-500">{showDetailModal.city}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Note</p>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="text-lg font-black text-gray-900">{showDetailModal.publicRatingAverage?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl">
                  <p className="text-[10px] font-black text-green-600 uppercase mb-1">Avis</p>
                  <p className="text-lg font-black text-gray-900">{showDetailModal.reviewsCount}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{showDetailModal.company?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{showDetailModal.address}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{showDetailModal.phone}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{showDetailModal.email}</span>
                </div>
                {showDetailModal.manager && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Manager : {showDetailModal.manager.firstName} {showDetailModal.manager.lastName}
                    </span>
                  </div>
                )}
                {showDetailModal.cancellationPenaltyPercent && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-700">Pénalité annulation : {showDetailModal.cancellationPenaltyPercent}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setShowDetailModal(null)} className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Centre Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Nouveau centre</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Compagnie</label>
                <select value={newCompanyId} onChange={(e) => setNewCompanyId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700">
                  <option value="">Sélectionner une compagnie</option>
                  {companyOptions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom du centre</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ex: Gare de Douala" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ville</label>
                  <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Douala" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Adresse</label>
                  <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="123 Rue" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+237 6XXXXXXXX" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="contact@opep.cm" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={createCentre.isPending}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center"
              >
                {createCentre.isPending ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                Créer le centre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
