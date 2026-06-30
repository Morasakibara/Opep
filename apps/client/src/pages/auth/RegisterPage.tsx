import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Phone, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.register(formData);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/otp');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-register relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overlay-dark z-0"></div>
      <div className="max-w-md w-full space-y-8 bg-white/95 p-10 rounded-2xl shadow-xl border border-gray-100 relative z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-opep-orange p-3 rounded-xl text-white">
              <UserPlus size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-600">
            Déjà client ?{' '}
            <Link to="/login" className="font-medium text-opep-blue hover:text-blue-500 underline">
              Connectez-vous ici
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 flex items-center border border-red-100">
            <AlertCircle size={14} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Prénom</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-opep-blue focus:border-opep-blue outline-none"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nom</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-opep-blue focus:border-opep-blue outline-none"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Téléphone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-opep-blue focus:border-opep-blue outline-none"
                placeholder="6XX XX XX XX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email (Optionnel)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-opep-blue focus:border-opep-blue outline-none"
                placeholder="nom@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-opep-blue focus:border-opep-blue outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-opep-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opep-orange transition disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {loading ? 'Inscription...' : 'S\'inscrire'}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
