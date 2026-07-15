'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api.service';
import { Bus, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      login(data.access_token, {
        id: data.user.id,
        name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
        email: data.user.email || '',
        role: data.user.role as any,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Theme Toggle */}
        <div className="absolute -top-14 right-0">
          <ThemeToggle />
        </div>

        {/* Logo */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on_primary font-bold text-3xl shadow-2xl shadow-primary/30 rotate-6 transition-transform hover:rotate-0 duration-500">
              <Bus size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-on_surface">OPEP Agence</h1>
          <p className="text-on_surface_variant mt-2">Plateforme de gestion de transport</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-on_surface">Connexion</h2>
            <p className="text-on_surface_variant text-sm mt-1">Accédez à votre espace d'administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-error_red/10 border border-error_red/20 text-error_red p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-error_red flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="input-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@opep.cm"
                className="input-field"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="input-label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline transition-all">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Connexion...</>
              ) : (
                <><span>Se connecter</span> <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal_border text-center">
            <p className="text-sm text-on_surface_variant">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-surface_container_low rounded-2xl border border-charcoal_border">
            <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest mb-2">Comptes de démonstration</p>
            <div className="space-y-1.5 text-xs text-on_surface_variant">
              <p><span className="font-bold text-primary">Admin :</span> admin@opep.cm / 123456</p>
              <p><span className="font-bold text-primary">Manager :</span> manager@finexs.cm / 123456</p>
              <p><span className="font-bold text-primary">Client :</span> adrian@email.com / 123456</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-on_surface_variant mt-8">
          &copy; 2026 OPEP Cameroun. Projet Souverain.
        </p>
      </div>
    </div>
  );
}
