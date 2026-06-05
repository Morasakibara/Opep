import React from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-register relative overflow-hidden">
      <div className="absolute inset-0 overlay-dark z-0"></div>
      
      <div className="w-full max-w-md space-y-8 bg-white/95 p-10 rounded-[2.5rem] shadow-2xl relative z-10 hover-float">
        <div>
          <div className="flex justify-center mb-6">
            <h1 className="text-4xl font-black italic tracking-tighter text-blue-600">OPEP</h1>
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Rejoignez la plateforme OPEP dès aujourd'hui
          </p>
        </div>

        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom complet</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full px-4 py-4 mt-1 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-4 mt-1 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="jean@exemple.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-4 mt-1 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-2xl bg-blue-600 px-3 py-4 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl shadow-blue-200 transition-all"
            >
              S'INSCRIRE
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 font-medium">
              Déjà inscrit ?{' '}
              <Link href="/login" className="font-black text-blue-600 hover:text-blue-500">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
