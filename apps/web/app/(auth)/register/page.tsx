'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api.service';
import { Bus, Loader2, ArrowRight, Eye, EyeOff, User, Phone, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !phone) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (!email.includes('@')) {
      setError('Email invalide.');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.register({
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || 'Utilisateur',
        email,
        phone,
        password,
        role: 'CLIENT',
      });
      localStorage.setItem('opep_token', data.access_token);
      localStorage.setItem('opep_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[50%] h-[50%] bg-tertiary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on_primary font-bold text-3xl shadow-2xl shadow-primary/30 -rotate-6 transition-transform hover:rotate-0 duration-500">
              O
            </div>
          </div>
          <h1 className="text-3xl font-bold text-on_surface">Créer un compte</h1>
          <p className="text-on_surface_variant mt-2">Rejoignez la plateforme OPEP</p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom duration-700">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-error_red/10 border border-error_red/20 text-error_red p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-error_red flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="input-label">Nom complet</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" className="input-field pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="input-label">Téléphone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 XXXXXXXXX" className="input-field pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="input-label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@exemple.com" className="input-field pl-10" autoComplete="email" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="input-label">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-10 pr-12" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={20} className="animate-spin" /> Inscription...</> : <><span>S'inscrire</span> <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal_border text-center">
            <p className="text-sm text-on_surface_variant">
              Déjà inscrit ?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-on_surface_variant mt-8">
          &copy; 2026 OPEP Cameroun. Projet Souverain.
        </p>
      </div>
    </div>
  );
}
