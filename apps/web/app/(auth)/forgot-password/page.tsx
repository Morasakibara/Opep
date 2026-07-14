'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api.service';
import { Bus, Loader2, ArrowLeft, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!phone) {
      setError('Veuillez entrer votre numéro de téléphone.');
      return;
    }
    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      localStorage.setItem('otp_phone', phone);
      setSuccess(`Code envoyé au ${phone}. Vérifiez votre téléphone.`);
      setTimeout(() => router.push('/otp'), 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi du code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-40 w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-40 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on_primary font-bold text-3xl shadow-2xl shadow-primary/30">
              <Smartphone size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-on_surface">Mot de passe oublié</h1>
          <p className="text-on_surface_variant mt-2">Entrez votre numéro pour recevoir un code</p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error_red/10 border border-error_red/20 text-error_red p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div className="bg-success_green/10 border border-success_green/20 text-success_green p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={14} /> {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="input-label">Numéro de téléphone</label>
              <div className="relative">
                <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6XX XX XX XX" className="input-field pl-10" autoFocus />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={20} className="animate-spin" /> Envoi...</> : 'Envoyer le code'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal_border text-center">
            <Link href="/login" className="font-bold text-primary hover:underline text-sm flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Retour à la connexion
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-on_surface_variant mt-8">
          &copy; 2026 OPEP Cameroun. Projet Souverain.
        </p>
      </div>
    </div>
  );
}
