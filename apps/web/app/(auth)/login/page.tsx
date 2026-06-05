'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDemoLogin = (role: 'ADMIN_PLATFORM' | 'AGENCY_MANAGER') => {
    const demoUser = {
      id: 'demo-1',
      firstName: role === 'ADMIN_PLATFORM' ? 'Admin' : 'Manager',
      lastName: 'OPEP',
      role: role,
      email: 'demo@opep.com'
    };
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'ADMIN_PLATFORM' || data.user.role === 'AGENCY_MANAGER') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError("Serveur indisponible. Utilisez le mode démo pour la présentation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-login relative overflow-hidden">
      <div className="absolute inset-0 overlay-dark z-0"></div>
      
      <div className="w-full max-w-md space-y-8 bg-white/95 p-10 rounded-[2.5rem] shadow-2xl relative z-10 hover-float">
        <div>
          <div className="flex justify-center mb-6">
            <h1 className="text-4xl font-black italic tracking-tighter text-blue-600">OPEP</h1>
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-gray-900">
            Connexion Agence
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Accédez à votre espace de gestion
          </p>
        </div>
        
        {error && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4 rounded-r-xl">
            <p className="text-orange-700 text-xs font-bold">{error}</p>
            <div className="mt-3 flex space-x-2">
               <button onClick={() => handleDemoLogin('ADMIN_PLATFORM')} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-lg font-black">MODE DÉMO ADMIN</button>
               <button onClick={() => handleDemoLogin('AGENCY_MANAGER')} className="text-[10px] bg-purple-600 text-white px-2 py-1 rounded-lg font-black">MODE DÉMO MANAGER</button>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email ou Téléphone</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="block w-full px-4 py-4 mt-1 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-4 mt-1 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-600">
                Rester connecté
              </label>
            </div>

            <div className="text-xs">
              <a href="#" className="font-bold text-blue-600 hover:text-blue-500">
                Oublié ?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-2xl bg-blue-600 px-3 py-4 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl shadow-blue-200 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Connexion en cours...' : 'SE CONNECTER'}
            </button>
          </div>

          <div className="text-center mt-6 space-y-3">
            <p className="text-xs text-gray-500">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-black text-blue-600 hover:text-blue-500">
                S'enregistrer
              </Link>
            </p>
            <div className="pt-2 border-t border-gray-100 flex justify-center space-x-4">
               <button type="button" onClick={() => handleDemoLogin('ADMIN_PLATFORM')} className="text-[9px] font-black text-gray-400 hover:text-blue-600 transition uppercase tracking-widest">Démo Admin</button>
               <button type="button" onClick={() => handleDemoLogin('AGENCY_MANAGER')} className="text-[9px] font-black text-gray-400 hover:text-purple-600 transition uppercase tracking-widest">Démo Manager</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
