'use client';

import React, { useState, useEffect } from 'react';
import {
  User, Shield, Bell, Globe, Moon, Sun, Smartphone, Mail,
  MessageSquare, LogOut, Save, Loader2, CheckCircle2, Eye, EyeOff,
  Lock, KeyRound, Languages, Palette, Volume2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTranslation } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { authApi } from '@/services/api.service';

const ROLE_LABELS: Record<string, string> = {
  ADMIN_PLATFORM: 'Super Administrateur',
  COMPANY_DIRECTOR: 'Directeur',
  CENTRE_MANAGER: 'Gestionnaire de centre',
  AGENCY_MANAGER: "Manager d'agence",
  CASHIER: 'Caissier',
  CONTROLLER: 'Contrôleur',
  DRIVER: 'Chauffeur',
  CLIENT: 'Client',
};

const NOTIF_STORAGE_KEY = 'opep-notification-prefs';

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

function loadNotifPrefs(): NotificationPref[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

const DEFAULT_NOTIFICATIONS: NotificationPref[] = [
  { id: 'whatsapp', label: 'WhatsApp', description: 'Recevoir les notifications sur WhatsApp', icon: null, enabled: false },
  { id: 'sms', label: 'SMS', description: 'Recevoir les alertes par SMS', icon: null, enabled: true },
  { id: 'email', label: 'Email', description: 'Recevoir les rapports par email', icon: null, enabled: true },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useTranslation();
  const toast = useToast();

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Notifications — load from localStorage, fallback to defaults
  const [notifications, setNotifications] = useState<NotificationPref[]>(() => {
    const saved = loadNotifPrefs();
    const base = saved.length === 3 ? saved : DEFAULT_NOTIFICATIONS;
    return base.map((n) => ({
      ...n,
      icon: n.id === 'whatsapp' ? <MessageSquare size={18} /> 
          : n.id === 'sms' ? <Smartphone size={18} /> 
          : <Mail size={18} />,
    }));
  });

  // Saving state
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Persist notification prefs to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  function handleToggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  async function handleSaveProfile() {
    if (!name.trim()) {
      toast.warning('Validation', 'Le nom est requis');
      return;
    }
    setSavingProfile(true);
    try {
      await authApi.updateProfile({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') || ' ' });
      toast.success('Profil', 'Informations mises à jour');
    } catch (err: any) {
      toast.error('Profil', err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning('Mot de passe', 'Veuillez remplir tous les champs');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('Mot de passe', 'Minimum 6 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('Mot de passe', 'Les mots de passe ne correspondent pas');
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Mot de passe', 'Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error('Mot de passe', err.message || 'Erreur lors du changement');
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="animate-in slide-in-from-bottom duration-300">
        <h2 className="text-2xl font-bold text-on_surface">Paramètres</h2>
        <p className="text-on_surface_variant">Gérez votre profil, vos préférences et votre compte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1 space-y-3 animate-in slide-in-from-bottom duration-400">
          <div className="glass-card rounded-2xl overflow-hidden sticky top-24">
            <div className="p-6 border-b border-charcoal_border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-on_primary font-bold text-xl shadow-lg shadow-primary/20">
                  {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on_surface text-sm truncate">{user?.name || 'Utilisateur'}</p>
                  <p className="text-[10px] text-on_surface_variant uppercase tracking-wider font-bold truncate">{user?.role || '—'}</p>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {[
                { icon: <User size={16} />, label: 'Profil', href: '#profile' },
                { icon: <Bell size={16} />, label: 'Notifications', href: '#notifications' },
                { icon: <Palette size={16} />, label: 'Apparence', href: '#appearance' },
                { icon: <Lock size={16} />, label: 'Sécurité', href: '#security' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-on_surface_variant hover:bg-surface_container_high hover:text-on_surface transition-all"
                >
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* ===== PROFILE SECTION ===== */}
          <section id="profile" className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-400">
            <div className="p-6 border-b border-charcoal_border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-on_surface">Informations personnelles</h3>
                <p className="text-xs text-on_surface_variant">Mettez à jour vos informations de profil</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="input-label">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="input-field"
                />
              </div>              <div className="space-y-2">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="input-field opacity-60"
                  readOnly
                  title="L'email ne peut pas être modifié pour le moment"
                />
                <p className="text-[10px] text-on_surface_variant/60 mt-1">L&apos;email est géré par l&apos;administrateur</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface_container_low rounded-2xl border border-charcoal_border">
                <Shield size={20} className="text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-on_surface">{ROLE_LABELS[user?.role || ''] || user?.role || 'Rôle non défini'}</p>
                  <p className="text-[10px] text-on_surface_variant">Rôle attribué par l&apos;administrateur</p>
                </div>
                <span className="status-badge-info">Actif</span>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="px-6 py-3 bg-primary text-on_primary font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {savingProfile ? (
                    <><Loader2 size={18} className="animate-spin" /> Sauvegarde...</>
                  ) : (
                    <><Save size={18} /> Enregistrer</>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* ===== NOTIFICATIONS SECTION ===== */}
          <section id="notifications" className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-6 border-b border-charcoal_border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-on_surface">Notifications</h3>
                <p className="text-xs text-on_surface_variant">Choisissez comment être notifié</p>
              </div>
            </div>
            <div className="divide-y divide-charcoal_border">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-5 hover:bg-primary/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notif.enabled ? 'bg-primary/10 text-primary' : 'bg-surface_container_high text-on_surface_variant'
                    }`}>
                      {notif.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on_surface">{notif.label}</p>
                      <p className="text-xs text-on_surface_variant mt-0.5">{notif.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleNotification(notif.id)}
                    className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
                      notif.enabled ? 'bg-primary' : 'bg-surface_container_highest'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                      notif.enabled ? 'left-[22px]' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-5 bg-surface_container_low/50 border-t border-charcoal_border">
              <p className="text-[10px] text-on_surface_variant flex items-center gap-1">
                <Volume2 size={12} />
                Les notifications peuvent être configurées dans les paramètres de votre appareil
              </p>
            </div>
          </section>

          {/* ===== APPEARANCE SECTION ===== */}
          <section id="appearance" className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-6 border-b border-charcoal_border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-on_surface">Apparence</h3>
                <p className="text-xs text-on_surface_variant">Personnalisez l&apos;interface</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Theme */}
              <div>
                <p className="input-label mb-3">Thème</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10'
                        : 'border-charcoal_border hover:border-primary/50 bg-surface_container_low'
                    }`}
                  >
                    <Sun size={28} className={theme === 'light' ? 'text-primary' : 'text-on_surface_variant'} />
                    <span className={`text-sm font-bold ${theme === 'light' ? 'text-primary' : 'text-on_surface_variant'}`}>
                      Clair
                    </span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10'
                        : 'border-charcoal_border hover:border-primary/50 bg-surface_container_low'
                    }`}
                  >
                    <Moon size={28} className={theme === 'dark' ? 'text-primary' : 'text-on_surface_variant'} />
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-primary' : 'text-on_surface_variant'}`}>
                      Sombre
                    </span>
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <p className="input-label mb-3">Langue</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setLanguage('fr')}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      language === 'fr'
                        ? 'border-primary bg-primary/10'
                        : 'border-charcoal_border hover:border-primary/50 bg-surface_container_low'
                    }`}
                  >
                    <Globe size={24} className={language === 'fr' ? 'text-primary' : 'text-on_surface_variant'} />
                    <div className="text-left">
                      <p className={`text-sm font-bold ${language === 'fr' ? 'text-primary' : 'text-on_surface'}`}>
                        Français
                      </p>
                      <p className="text-[10px] text-on_surface_variant">Langue par défaut</p>
                    </div>
                    {language === 'fr' && (
                      <CheckCircle2 size={18} className="text-primary ml-auto flex-shrink-0" />
                    )}
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      language === 'en'
                        ? 'border-primary bg-primary/10'
                        : 'border-charcoal_border hover:border-primary/50 bg-surface_container_low'
                    }`}
                  >
                    <Languages size={24} className={language === 'en' ? 'text-primary' : 'text-on_surface_variant'} />
                    <div className="text-left">
                      <p className={`text-sm font-bold ${language === 'en' ? 'text-primary' : 'text-on_surface'}`}>
                        English
                      </p>
                      <p className="text-[10px] text-on_surface_variant">Secondary language</p>
                    </div>
                    {language === 'en' && (
                      <CheckCircle2 size={18} className="text-primary ml-auto flex-shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECURITY SECTION ===== */}
          <section id="security" className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-6 border-b border-charcoal_border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <KeyRound size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-on_surface">Sécurité</h3>
                <p className="text-xs text-on_surface_variant">Gérez votre mot de passe</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="input-label">Mot de passe actuel</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="input-field pl-10 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="input-label">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retaper le mot de passe"
                      className="input-field pl-10 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="px-6 py-3 bg-primary text-on_primary font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {changingPassword ? (
                    <><Loader2 size={18} className="animate-spin" /> Modification...</>
                  ) : (
                    <><KeyRound size={18} /> Changer le mot de passe</>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* ===== LOGOUT SECTION ===== */}
          <div className="animate-in slide-in-from-bottom duration-600">
            <button
              onClick={logout}
              className="w-full glass-card rounded-2xl p-6 flex items-center justify-between group hover:bg-error_red/5 border border-charcoal_border hover:border-error_red/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-error_red/10 flex items-center justify-center group-hover:bg-error_red/20 transition-colors">
                  <LogOut size={20} className="text-error_red" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-error_red">Déconnexion</p>
                  <p className="text-xs text-on_surface_variant">Vous serez redirigé vers la page de connexion</p>
                </div>
              </div>
              <LogOut size={20} className="text-error_red/50 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
