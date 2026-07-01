'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/apiClient';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError('Champs requis');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.login(identifier, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (e: any) {
      if (e.status === 401) {
        setError('Identifiant ou mot de passe incorrect');
      } else {
        setError('Serveur injoignable. Vérifiez votre connexion au serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-login relative overflow-hidden p-4">
      <div className="absolute inset-0 overlay-dark z-0"></div>
      <div className="w-full max-w-md bg-white/95 p-8 rounded-3xl shadow-2xl relative z-10 hover-float">
        <div className="flex justify-center mb-2">
          <h1 className="text-4xl font-black italic tracking-tighter text-blue-600">OPEP</h1>
        </div>
        <p className="text-center text-gray-500 mb-8 font-bold">Connexion Agence</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-6 border-l-4 border-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Identifiant"
            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-black hover:bg-blue-700 transition"
          >
            {loading ? 'CHARGEMENT...' : 'SE CONNECTER'}
          </button>

          <div className="text-center mt-4">
            <a href="/forgot-password" className="text-xs font-bold text-gray-400 hover:text-gray-600">
              Mot de passe oublié ?
            </a>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-center text-[10px] text-gray-400 font-medium">
              Comptes test : +237600000000 / 123456 (Admin) — +237670000001 / 123456 (Manager)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
