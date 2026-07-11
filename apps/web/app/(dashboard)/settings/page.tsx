'use client';
import Image from 'next/image';

import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  MessageCircle,
  Languages
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'agence' | 'notifications' | 'securite'>('profil');
  const [profile, setProfile] = useState<any>(null);
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Agency form
  const [agencyName, setAgencyName] = useState('');
  const [agencyDesc, setAgencyDesc] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyWebsite, setAgencyWebsite] = useState('');

  // Notification form
  const [notifChannel, setNotifChannel] = useState('WHATSAPP');
  const [notifPhone, setNotifPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('fr');

  // Security form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'L\'image ne doit pas dépasser 5 Mo');
      return;
    }
    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
        // Sauvegarde automatique de la photo
        if (profile?.id) {
          await apiClient.updateProfile({ avatarUrl: base64 } as any);
          showToast('success', 'Photo de profil mise à jour');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors du téléchargement');
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const profileData = await apiClient.getProfile();
      setProfile(profileData);
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setEmail(profileData.email || '');
      setPhone(profileData.phone || '');
      setAvatarUrl((profileData as any).avatarUrl || null);
      setNotifChannel((profileData as any).notificationChannel || 'WHATSAPP');
      setNotifPhone((profileData as any).notificationPhone || (profileData as any).phone || '');
      setPreferredLanguage((profileData as any).preferredLanguage || 'fr');

      if (profileData.agencyId) {
        try {
          const agencyData = await apiClient.getAgency(profileData.agencyId);
          setAgency(agencyData);
          setAgencyName((agencyData as any).name || '');
          setAgencyDesc((agencyData as any).description || '');
          setAgencyAddress((agencyData as any).address || '');
          setAgencyWebsite((agencyData as any).website || '');
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
      await (apiClient.updateProfile as any)({
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

  async function handleSaveNotifications() {
    if (!profile?.id) return;
    setSaving(true);
    try {
      await (apiClient.updateProfile as any)({
        notificationChannel: notifChannel,
        notificationPhone: notifPhone,
        preferredLanguage: preferredLanguage,
      });
      showToast('success', 'Préférences de notification mises à jour');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!newPassword || !currentPassword) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }
    if (newPassword.length < 6) {
      showToast('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Les mots de passe ne correspondent pas');
      return;
    }
    setSaving(true);
    try {
      await apiClient.changePassword(currentPassword, newPassword);
      showToast('success', 'Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors du changement de mot de passe');
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
                <div className="relative group">
                  {avatarUrl ? (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
                      <Image fill className="object-cover" src={avatarUrl} alt="Photo de profil" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-black">
                      {firstName?.[0] || ''}{lastName?.[0] || ''}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-500 hover:text-blue-600 transition disabled:opacity-50"
                  >
                    {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Photo de profil</h3>
                  <p className="text-sm text-gray-500">Cliquez sur l'icône appareil photo pour modifier votre photo. Format JPG, PNG ou GIF. Max 5Mo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Prénom</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
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
                      <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                      <textarea rows={4} value={agencyDesc} onChange={(e) => setAgencyDesc(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Siège social</label>
                        <input type="text" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Site Web</label>
                        <input type="text" value={agencyWebsite} onChange={(e) => setAgencyWebsite(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900" />
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

          {activeTab === 'notifications' && (
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-black text-gray-900">Préférences de notification</h3>
                <p className="text-sm text-gray-500 mt-1">Choisissez comment vous souhaitez recevoir les notifications.</p>
              </div>

              <div className="space-y-6">
                {/* Canal de notification */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Canal de notification</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'WHATSAPP', label: 'WhatsApp', icon: <MessageCircle size={20} />, desc: 'Recommandé' },
                      { value: 'SMS', label: 'SMS', icon: <Smartphone size={20} />, desc: 'Standard' },
                      { value: 'EMAIL', label: 'Email', icon: <Mail size={20} />, desc: 'Par email' },
                    ].map((channel) => (
                      <button
                        key={channel.value}
                        type="button"
                        onClick={() => setNotifChannel(channel.value)}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition ${
                          notifChannel === channel.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          notifChannel === channel.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {channel.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold">{channel.label}</p>
                          <p className="text-xs opacity-75">{channel.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numéro de téléphone pour notifications */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Téléphone pour les notifications</label>
                  <input
                    type="text"
                    value={notifPhone}
                    onChange={(e) => setNotifPhone(e.target.value)}
                    placeholder="+237XXXXXXXXX"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
                  />
                  <p className="text-xs text-gray-400">Utilisé pour les notifications WhatsApp et SMS</p>
                </div>

                {/* Langue préférée */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                    <Languages size={14} />
                    <span>Langue préférée</span>
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-700"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-sm text-amber-700">
                    <strong>Note :</strong> Les notifications sont actuellement en cours de configuration côté serveur.
                    Vos préférences sont sauvegardées et seront actives une fois le service de notification déployé.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-70"
                >
                  {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-black text-gray-900">Sécurité du compte</h3>
                <p className="text-sm text-gray-500 mt-1">Gérez votre mot de passe et la sécurité de votre compte.</p>
              </div>

              <div className="space-y-6 max-w-lg">
                {/* Mot de passe actuel */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Mot de passe actuel</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 pr-12"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Nouveau mot de passe */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 pr-12"
                      placeholder="Minimum 6 caractères"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Force indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              newPassword.length >= level * 3
                                ? newPassword.length >= 12
                                  ? 'bg-green-500'
                                  : newPassword.length >= 6
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs mt-1 ${
                        newPassword.length >= 12 ? 'text-green-600' :
                        newPassword.length >= 6 ? 'text-yellow-600' :
                        'text-red-500'
                      }`}>
                        {newPassword.length >= 12 ? 'Très sécurisé' :
                         newPassword.length >= 6 ? 'Sécurisé' :
                         'Trop court'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirmer le mot de passe */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
                    placeholder="Répétez le nouveau mot de passe"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Shield size={18} className="mr-2" />}
                    Changer le mot de passe
                  </button>
                </div>
              </div>

              <div className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100">
                <h4 className="text-red-600 font-bold mb-2">Supprimer le compte</h4>
                <p className="text-xs text-red-500 mb-4">La suppression de votre compte est irréversible et entraînera la perte de toutes vos données.</p>
                <button
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.')) {
                      showToast('error', 'La suppression de compte doit être effectuée par un administrateur. Contactez le support.');
                    }
                  }}
                  className="flex items-center text-sm font-bold text-red-600 hover:underline"
                >
                  <Trash2 size={16} className="mr-2" />
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
