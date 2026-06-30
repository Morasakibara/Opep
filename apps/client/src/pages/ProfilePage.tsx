import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Bell, Globe, Shield, LogOut, ChevronRight, Camera, Loader2, AlertTriangle } from 'lucide-react';
import { apiClient } from '../lib/apiClient';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('fr');
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: false,
    email: true
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.getProfile();
      setProfile(data);
      setLanguage(data.preferredLanguage || 'fr');
      if (data.notificationChannel) {
        setNotifications({
          whatsapp: data.notificationChannel === 'WHATSAPP',
          sms: data.notificationChannel === 'SMS',
          email: data.notificationChannel === 'EMAIL',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (field: string, value: string) => {
    try {
      const updated = await apiClient.updateProfile({ [field]: value });
      setProfile(updated);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="text-opep-blue animate-spin" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <p className="text-gray-700 mb-4 text-center">{error}</p>
        <button onClick={loadProfile} className="bg-opep-blue text-white px-6 py-3 rounded-xl font-bold">Réessayer</button>
      </div>
    );
  }

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : 'Utilisateur';
  const displayPhone = profile?.phone || 'Non renseigné';
  const role = profile?.role || 'CLIENT';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-opep-blue text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 hover:bg-white/20 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold">Mon Profil</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-xl">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-opep-blue">
              <User size={48} />
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="absolute bottom-0 right-0 bg-opep-orange text-white p-2 rounded-full shadow-lg border-2 border-white"
            >
              <Camera size={16} />
            </button>
          </div>
          <h3 className="text-xl font-black text-gray-900">{displayName}</h3>
          <p className="text-gray-500 text-sm">{displayPhone}</p>
          <span className="mt-2 bg-blue-50 text-opep-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {role === 'CLIENT' ? 'Client' : role}
          </span>
          {error && (
            <p className="mt-2 text-xs text-red-500 flex items-center"><AlertTriangle size={12} className="mr-1" />{error}</p>
          )}
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
              <Shield size={18} className="text-gray-400" />
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Compte & Sécurité</h4>
            </div>
            <div className="divide-y divide-gray-50">
              <button onClick={() => navigate('/profile/edit')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <span className="text-sm font-medium text-gray-700">Informations personnelles</span>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
              <button onClick={() => navigate('/profile/change-password')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <span className="text-sm font-medium text-gray-700">Changer de mot de passe</span>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
              <Globe size={18} className="text-gray-400" />
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Préférences</h4>
            </div>
            <div className="divide-y divide-gray-50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Langue de l'application</p>
                  <p className="text-xs text-gray-400">Contenus et notifications</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    handleUpdateProfile('preferredLanguage', e.target.value);
                  }}
                  className="bg-gray-50 border-none text-sm font-bold text-opep-blue rounded-lg px-3 py-2 outline-none"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
              <Bell size={18} className="text-gray-400" />
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Notifications</h4>
            </div>
            <div className="divide-y divide-gray-50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                <input
                  type="checkbox"
                  checked={notifications.whatsapp}
                  onChange={() => {
                    setNotifications({...notifications, whatsapp: !notifications.whatsapp});
                    handleUpdateProfile('notificationChannel', notifications.whatsapp ? 'SMS' : 'WHATSAPP');
                  }}
                  className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-opep-blue transition relative cursor-pointer after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:left-6"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">SMS</span>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={() => {
                    setNotifications({...notifications, sms: !notifications.sms});
                    handleUpdateProfile('notificationChannel', notifications.sms ? 'WHATSAPP' : 'SMS');
                  }}
                  className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-opep-blue transition relative cursor-pointer after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:left-6"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center space-x-2 text-red-500 font-bold p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
