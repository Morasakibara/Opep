'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api.service';
import { Smartphone, Loader2, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) {
      setError('Veuillez entrer le code complet.');
      return;
    }
    setLoading(true);
    try {
      const phone = localStorage.getItem('otp_phone') || '';
      const result = await authApi.verifyOtp(phone, code);
      if (result.valid) {
        localStorage.removeItem('otp_phone');
        router.push('/login');
      } else {
        setError('Code invalide ou expiré.');
      }
    } catch (err: any) {
      setError(err.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const phone = localStorage.getItem('otp_phone') || '';
      if (phone) {
        await authApi.sendOtp(phone);
        setError('Code renvoyé.');
        setTimeout(() => setError(''), 3000);
      }
    } catch {} finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on_primary font-bold text-3xl shadow-2xl shadow-primary/30 animate-pulse-soft">
              <Smartphone size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-on_surface">Vérification</h1>
          <p className="text-on_surface_variant mt-2">Entrez le code reçu par SMS</p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom duration-700">
          <form onSubmit={handleVerify} className="space-y-8">
            {error && (
              <div className="bg-warning_yellow/10 border border-warning_yellow/20 text-warning_yellow p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold bg-surface_container_low border border-charcoal_border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on_surface transition-all"
                  value={otp[i - 1]}
                  onChange={(e) => handleChange(i - 1, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i - 1, e)}
                  ref={(el) => { inputRefs.current[i - 1] = el; }}
                />
              ))}
            </div>

            <button type="submit" disabled={loading || otp.join('').length < 6}
              className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={20} className="animate-spin" /> Vérification...</> : 'Vérifier le code'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal_border text-center space-y-4">
            <button onClick={handleResend} disabled={resending}
              className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50">
              {resending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Renvoyer le code
            </button>

            <Link href="/login" className="font-bold text-on_surface_variant hover:text-on_surface text-sm flex items-center justify-center gap-2 transition-colors">
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
