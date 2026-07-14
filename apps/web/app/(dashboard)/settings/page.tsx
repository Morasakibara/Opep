'use client';
import Image from 'next/image';

import React, { useState, useEffect, useRef } from 'react';
import { User, Building2, Bell, Shield, Camera, Save, Trash2, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Smartphone, Mail, MessageCircle, Languages } from 'lucide-react';
import { authApi, agenciesApi } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'agence' | 'notifications' | 'securite'>('profil');
  const [profile, setProfile] = useState<any>(null);
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(''); const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [agencyName, setAgencyName] = useState(''); const [agencyDesc, setAgencyDesc] = useState('');
  const [agencyAddress, setAgencyAddress] = useState(''); const [agencyWebsite, setAgencyWebsite] = useState('');
  const [notifChannel, setNotifChannel] = useState('WHATSAPP'); const [notifPhone, setNotifPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('fr');
  const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message }); setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => { loadData(); }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'Image trop grande (max 5 Mo)'); return; }
    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
        if (profile?.id) {
          await authApi.updateProfile({ avatarUrl: base64 } as any);
          showToast('success', 'Photo mise à jour');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setUploadingPhoto(false); }
  }

  async function loadData() {
    setLoading(true);
    try {
      const profileData: any = await authApi.getProfile();
      setProfile(profileData);
      setFirstName(profileData.firstName || ''); setLastName(profileData.lastName || '');
      setEmail(profileData.email || ''); setPhone(profileData.phone || '');
      setAvatarUrl(profileData.avatarUrl || null);
      setNotifChannel(profileData.notificationChannel || 'WHATSAPP');
      setNotifPhone(profileData.notificationPhone || profileData.phone || '');
      setPreferredLanguage(profileData.preferredLanguage || 'fr');
      if (profileData.agencyId) {
        try { const a: any = await agenciesApi.getById(profileData.agencyId); setAgency(a); setAgencyName(a.name || ''); setAgencyDesc(a.description || ''); setAgencyAddress(a.address || ''); setAgencyWebsite(a.website || ''); } catch {}
      }
    } catch (err: any) { showToast('error', err.message || 'Erreur de chargement'); }
    finally { setLoading(false); }
  }

  async function handleSaveProfile() {
    if (!profile?.id) return;
    setSaving(true);
    try { await authApi.updateProfile({ firstName, lastName, email, phone } as any); showToast('success', 'Profil mis à jour'); }
    catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setSaving(false); }
  }

  async function handleSaveNotifications() {
    if (!profile?.id) return;
    setSaving(true);
    try { await authApi.updateProfile({ notificationChannel: notifChannel, notificationPhone: notifPhone, preferredLanguage } as any); showToast('success', 'Préférences mises à jour'); }
    catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setSaving(false); }
  }

  async function handleChangePassword() {
    if (!newPassword || !currentPassword) { showToast('error', 'Remplissez tous les champs'); return; }
    if (newPassword.length < 6) { showToast('error', 'Minimum 6 caractères'); return; }
    if (newPassword !== confirmPassword) { showToast('error', 'Les mots de passe ne correspondent pas'); return; }
    setSaving(true);
    try { await authApi.changePassword(currentPassword, newPassword); showToast('success', 'Mot de passe modifié'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
    catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setSaving(false); }
  }

  async function handleSaveAgency() {
    if (!agency?.id) return;
    setSaving(true);
    try { await agenciesApi.update(agency.id, { name: agencyName, description: agencyDesc, address: agencyAddress, website: agencyWebsite }); showToast('success', 'Agence mise à jour'); }
    catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setSaving(false); }
  }

  async function handleDeleteAgency() {
    if (!agency?.id || !confirm('Supprimer définitivement ?')) return;
    setSaving(true);
    try { await agenciesApi.remove(agency.id); showToast('success', 'Agence supprimée'); setAgency(null); }
    catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setSaving(false); }
  }

  const tabs = [
    { id: 'profil', label: 'Mon Profil', icon: <User size={18} /> },
    { id: 'agence', label: 'Agence', icon: <Building2 size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'securite', label: 'Sécurité', icon: <Shield size={18} /> },
  ] as const;

  if (loading) {
    return <PageSkeleton />;
  }

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

      <div>
        <h2 className="text-2xl font-bold text-on_surface">Paramètres</h2>
        <p className="text-on_surface_variant">Gérez vos préférences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === tab.id ? 'bg-primary text-on_primary shadow-lg' : 'text-on_surface_variant hover:bg-surface_container_high hover:text-on_surface'
              }`}>
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 glass-card rounded-3xl overflow-hidden">
          {activeTab === 'profil' && (
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  {avatarUrl ? (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden"><Image fill className="object-cover" src={avatarUrl} alt="Photo" /></div>
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-bold">{firstName?.[0] || ''}{lastName?.[0] || ''}</div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif" onChange={handlePhotoUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
                    className="absolute -bottom-2 -right-2 p-2 bg-surface_container rounded-xl shadow-lg border border-charcoal_border text-on_surface_variant hover:text-primary transition disabled:opacity-50">
                    {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  </button>
                </div>
                <div><h3 className="text-lg font-bold text-on_surface">Photo de profil</h3><p className="text-sm text-on_surface_variant">JPG, PNG ou GIF. Max 5 Mo.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Prénom', value: firstName, set: setFirstName },
                  { label: 'Nom', value: lastName, set: setLastName },
                  { label: 'Email', value: email, set: setEmail, type: 'email' },
                  { label: 'Téléphone', value: phone, set: setPhone },
                ].map((f, i) => (
                  <div key={i} className="space-y-2">
                    <label className="input-label">{f.label}</label>
                    <input type={f.type || 'text'} value={f.value} onChange={(e) => f.set(e.target.value)} className="input-field" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={loadData} className="px-6 py-3 rounded-xl text-sm font-bold text-on_surface_variant hover:bg-surface_container_high transition">Annuler</button>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="bg-primary text-on_primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition disabled:opacity-70">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'agence' && (
            <div className="p-8">
              {!agency ? (
                <div className="text-center py-8 text-on_surface_variant">Aucune agence associée.</div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="space-y-2"><label className="input-label">Nom</label><input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="input-field" /></div>
                    <div className="space-y-2"><label className="input-label">Description</label><textarea rows={4} value={agencyDesc} onChange={(e) => setAgencyDesc(e.target.value)} className="input-field" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="input-label">Adresse</label><input type="text" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} className="input-field" /></div>
                      <div className="space-y-2"><label className="input-label">Site Web</label><input type="text" value={agencyWebsite} onChange={(e) => setAgencyWebsite(e.target.value)} className="input-field" /></div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <button onClick={handleSaveAgency} disabled={saving}
                      className="bg-primary text-on_primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition disabled:opacity-70">
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Enregistrer
                    </button>
                  </div>
                  <div className="mt-12 p-6 bg-error_red/5 rounded-2xl border border-error_red/20">
                    <h4 className="text-error_red font-bold mb-2">Zone de danger</h4>
                    <p className="text-xs text-error_red/70 mb-4">Suppression irréversible.</p>
                    <button onClick={handleDeleteAgency} disabled={saving} className="flex items-center text-sm font-bold text-error_red hover:underline disabled:opacity-50">
                      <Trash2 size={16} className="mr-2" /> Supprimer l'agence
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-8">
              <div className="mb-8"><h3 className="text-lg font-bold text-on_surface">Préférences</h3><p className="text-sm text-on_surface_variant mt-1">Choisissez votre canal de notification.</p></div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="input-label">Canal</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'WHATSAPP', label: 'WhatsApp', icon: <MessageCircle size={20} /> },
                      { value: 'SMS', label: 'SMS', icon: <Smartphone size={20} /> },
                      { value: 'EMAIL', label: 'Email', icon: <Mail size={20} /> },
                    ].map((ch) => (
                      <button key={ch.value} type="button" onClick={() => setNotifChannel(ch.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                          notifChannel === ch.value ? 'border-primary bg-primary/10 text-primary' : 'border-charcoal_border bg-surface_container_low text-on_surface_variant hover:border-primary/50'
                        }`}>
                        <div className={`p-2 rounded-lg ${notifChannel === ch.value ? 'bg-primary text-on_primary' : 'bg-surface_container_high text-on_surface_variant'}`}>{ch.icon}</div>
                        <div className="text-left"><p className="text-sm font-bold">{ch.label}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="input-label">Téléphone notifications</label>
                  <input type="text" value={notifPhone} onChange={(e) => setNotifPhone(e.target.value)} placeholder="+237XXXXXXXXX" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label flex items-center gap-2"><Languages size={14} /> Langue</label>
                  <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="input-field">
                    <option value="fr">Français</option><option value="en">English</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-8 pt-6 border-t border-charcoal_border">
                <button onClick={handleSaveNotifications} disabled={saving}
                  className="bg-primary text-on_primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition disabled:opacity-70">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="p-8">
              <div className="mb-8"><h3 className="text-lg font-bold text-on_surface">Sécurité</h3><p className="text-sm text-on_surface_variant mt-1">Gérez votre mot de passe.</p></div>
              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <label className="input-label">Mot de passe actuel</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Votre mot de passe actuel" className="input-field pr-12" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface">{showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="input-label">Nouveau mot de passe</label>
                  <div className="relative">
                    <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 caractères" className="input-field pr-12" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface">{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div key={level} className={`h-1 flex-1 rounded-full ${
                            newPassword.length >= level * 3 ? newPassword.length >= 12 ? 'bg-success_green' : newPassword.length >= 6 ? 'bg-warning_yellow' : 'bg-error_red' : 'bg-surface_container_highest'
                          }`} />
                        ))}
                      </div>
                      <p className={`text-xs mt-1 ${newPassword.length >= 12 ? 'text-success_green' : newPassword.length >= 6 ? 'text-warning_yellow' : 'text-error_red'}`}>
                        {newPassword.length >= 12 ? 'Très sécurisé' : newPassword.length >= 6 ? 'Sécurisé' : 'Trop court'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="input-label">Confirmer</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répétez" className="input-field" />
                  {confirmPassword && newPassword !== confirmPassword && <p className="text-xs text-error_red mt-1">Ne correspond pas</p>}
                </div>
                <div className="pt-4">
                  <button onClick={handleChangePassword} disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
                    className="bg-primary text-on_primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                    Changer le mot de passe
                  </button>
                </div>
              </div>
              <div className="mt-12 p-6 bg-error_red/5 rounded-2xl border border-error_red/20">
                <h4 className="text-error_red font-bold mb-2">Supprimer le compte</h4>
                <p className="text-xs text-error_red/70 mb-4">Action irréversible. Contactez le support.</p>
                <button className="flex items-center text-sm font-bold text-error_red hover:underline"><Trash2 size={16} className="mr-2" /> Supprimer mon compte</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
