'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDemo = (role: string) => {
    const user = {
      id: 'demo',
      firstName: role === 'ADMIN_PLATFORM' ? 'Admin' : 'Manager',
      lastName: 'OPEP',
      role: role
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', 'demo');
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/dashboard';
    }
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError('Champs requis');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (e: any) {
      setError("Serveur injoignable. Utilisez le mode démo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-black text-blue-600 text-center mb-2">OPEP</h1>
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
            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
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

          <div className="pt-6 border-t border-gray-100 flex flex-col space-y-2">
            <button 
              onClick={() => handleDemo('ADMIN_PLATFORM')}
              className="w-full bg-slate-100 text-slate-700 p-3 rounded-xl font-black text-xs hover:bg-slate-200 transition"
            >
              ACCÈS DÉMO ADMINISTRATEUR
            </button>
            <button 
              onClick={() => handleDemo('AGENCY_MANAGER')}
              className="w-full bg-purple-50 text-purple-700 p-3 rounded-xl font-black text-xs hover:bg-purple-100 transition"
            >
              ACCÈS DÉMO MANAGER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
