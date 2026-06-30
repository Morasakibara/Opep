'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Camera,
  Save,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'agence' | 'notifications' | 'securite'>('profil');
  const [profile, setProfile] = useState<any>(null);
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [agencyDesc, setAgencyDesc] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyWebsite, setAgencyWebsite] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const profileData = await apiClient.getProfile();
      setProfile(profileData);
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setEmail(profileData.email || '');
      setPhone(profileData.phone || '');

      if (profileData.agencyId) {
        try {
          const agencyData = await apiClient.getAgency(profileData.agencyId);
          setAgency(agencyData);
          setAgencyName(agencyData.name || '');
          setAgencyDesc(agencyData.description || '');
          setAgencyAddress(agencyData.address || '');
          setAgencyWebsite(agencyData.website || '');
        } catch {
          // Agence non trouvée
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSaveProfile() {
    if (!profile?.id) return;
    setSaving(true);
    try {
      await apiClient.updateProfile({
        firstName,
        lastName,
        email,
        phone,
      });
      showToast('success', 'Profil mis à jour avec succès');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAgency() {
    if (!agency?.id) return;
    setSaving(true);
    try {
      await apiClient.updateAgency(agency.id, {
        name: agencyName,
        description: agencyDesc,
        address: agencyAddress,
        website: agencyWebsite,
      });
      showToast('success', 'Agence mise à jour avec succès');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAgency() {
    if (!agency?.id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette agence ? Cette action est irréversible.')) return;
    setSaving(true);
    try {
      await apiClient.deleteAgency(agency.id);
      showToast('success', 'Agence supprimée avec succès');
      setAgency(null);
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-500 font-medium">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-black text-gray-900">Paramètres</h2>
        <p className="text-gray-500">Gérez vos préférences et les informations de votre agence.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          {[
            { id: 'profil', label: 'Mon Profil', icon: <User size={18} /> },
            { id: 'agence', label: 'Agence', icon: <Building2 size={18} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
            { id: 'securite', label: 'Sécurité', icon: <Shield size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {activeTab === 'profil' && (
            <div className="p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-black">
                    {firstName?.[0] || ''}{lastName?.[0] || ''}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-500 hover:text-blue-600 transition">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Photo de profil</h3>
                  <p className="text-sm text-gray-500">Format JPG, PNG ou GIF. Max 5Mo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Prénom</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button onClick={loadData} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-70"
                >
                  {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'agence' && (
            <div className="p-8">
              {!agency ? (
                <div className="text-center py-8 text-gray-400 font-medium">
                  Aucune agence associée à votre compte.
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom de l'agence</label>
                      <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                      <textarea rows={4} value={agencyDesc} onChange={(e) => setAgencyDesc(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Siège social</label>
                        <input type="text" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Site Web</label>
                        <input type="text" value={agencyWebsite} onChange={(e) => setAgencyWebsite(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button 
                      onClick={handleSaveAgency}
                      disabled={saving}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-70"
                    >
                      {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                      Enregistrer
                    </button>
                  </div>

                  <div className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100">
                    <h4 className="text-red-600 font-bold mb-2">Zone de danger</h4>
                    <p className="text-xs text-red-500 mb-4">La suppression de votre compte agence est irréversible et entraînera la perte de toutes vos données.</p>
                    <button 
                      onClick={handleDeleteAgency}
                      disabled={saving}
                      className="flex items-center text-sm font-bold text-red-600 hover:underline disabled:opacity-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Supprimer le compte agence
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {(activeTab === 'notifications' || activeTab === 'securite') && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                {activeTab === 'notifications' ? <Bell size={32} /> : <Shield size={32} />}
              </div>
              <h3 className="font-bold text-gray-900">Bientôt disponible</h3>
              <p className="text-sm text-gray-500 mt-2">Ces réglages seront disponibles dans une prochaine mise à jour.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
