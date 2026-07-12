'use client';

import React, { useState } from 'react';
import {
  Building2,
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
} from 'lucide-react';
import { useCompanies, useCreateCompany } from '@/hooks/useEntities';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

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

  // React Query hooks
  const { data: companies = [], isLoading, error } = useCompanies();
  const createCompany = useCreateCompany();

  // Form state
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
        name: newName,
        city: newCity,
        address: newAddress,
        phone: newPhone,
        email: newEmail,
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
          <h2 className="text-2xl font-black text-gray-900">Compagnies</h2>
          <p className="text-gray-500">Gérez les compagnies de transport et leurs abonnements.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle compagnie
        </button>
      </div>

      {/* Error State */}
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

      {/* Search */}
      <div className="flex space-x-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-100 flex items-center px-4 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par nom, ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-3 bg-transparent border-none outline-none text-sm w-full text-gray-900"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && <LoadingSpinner text="Chargement des compagnies..." />}

      {/* Companies Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={<Building2 size={32} />}
                title="Aucune compagnie"
                message="Aucune compagnie trouvée. Créez-en une nouvelle pour commencer."
              />
            </div>
          )}
          {filteredCompanies.map((company: any) => (
            <div
              key={company.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition group cursor-pointer"
              onClick={() => setShowDetailModal(company)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Building2 size={24} />
                  </div>
                  <Badge
                    label={company.isActive ? 'Actif' : 'Inactif'}
                    variant={company.isActive ? 'success' : 'danger'}
                  />
                </div>

                <h4 className="text-lg font-black text-gray-900 mb-1">{company.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin size={14} className="mr-1" />
                  {company.city}
                </div>

                <div className="flex items-center space-x-4 py-3 border-t border-gray-50">
                  <div className="flex items-center text-xs text-gray-600">
                    <Star size={14} className="mr-1 text-yellow-500" />
                    {company.publicRatingAverage?.toFixed(1) || 'N/A'} ({company.reviewsCount})
                  </div>
                  {company.director && (
                    <div className="flex items-center text-xs text-gray-600">
                      <User size={14} className="mr-1" />
                      {company.director.firstName} {company.director.lastName}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-3">
                  <Phone size={12} />
                  <span>{company.phone}</span>
                  <Mail size={12} className="ml-2" />
                  <span>{company.email}</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end opacity-0 group-hover:opacity-100 transition">
                <button className="text-xs font-bold text-blue-600 hover:underline">Voir les détails →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowDetailModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Building2 size={24} />
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
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{showDetailModal.phone}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{showDetailModal.email}</span>
                </div>
                {showDetailModal.director && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Directeur : {showDetailModal.director.firstName} {showDetailModal.director.lastName}
                    </span>
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

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Nouvelle compagnie</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ex: OPEP Express" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ville</label>
                  <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Douala" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Adresse</label>
                  <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="123 Rue X" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
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
                disabled={createCompany.isPending}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center"
              >
                {createCompany.isPending ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                Créer la compagnie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
