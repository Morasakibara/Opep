'use client';

import React from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-login relative overflow-hidden">
      <div className="absolute inset-0 overlay-dark z-0"></div>
      
      <div className="w-full max-w-md space-y-8 bg-white/95 p-10 rounded-[2.5rem] shadow-2xl relative z-10 hover-float">
        <div>
          <div className="flex justify-center mb-6">
            <h1 className="text-4xl font-black italic tracking-tighter text-blue-600">OPEP</h1>
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-gray-900">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Entrez votre numéro pour recevoir un code
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Numéro de téléphone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="block w-full px-4 py-4 mt-1 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="6XX XX XX XX"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-2xl bg-blue-600 px-3 py-4 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl shadow-blue-200 transition-all"
              onClick={() => alert("Fonctionnalité désactivée en mode présentation.")}
            >
              ENVOYER LE CODE
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/login" className="font-black text-blue-600 hover:text-blue-500 text-sm">
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
