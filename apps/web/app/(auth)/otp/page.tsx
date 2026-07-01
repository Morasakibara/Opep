'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      const result = await apiClient.verifyOtp(phone, code);
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-login relative overflow-hidden">
      <div className="absolute inset-0 overlay-dark z-0"></div>
      
      <div className="w-full max-w-md space-y-8 bg-white/95 p-10 rounded-[2.5rem] shadow-2xl relative z-10 hover-float">
        <div>
          <div className="flex justify-center mb-6">
            <h1 className="text-4xl font-black italic tracking-tighter text-blue-600">OPEP</h1>
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-gray-900">
            Vérification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Entrez le code reçu par SMS
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border-l-4 border-red-500">
              {error}
            </div>
          )}
          <div className="flex justify-between space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                value={otp[i - 1]}
                onChange={(e) => handleChange(i - 1, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i - 1, e)}
                ref={(el) => { inputRefs.current[i - 1] = el; }}
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-2xl bg-blue-600 px-3 py-4 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl shadow-blue-200 transition-all"
            >
              {loading ? 'VÉRIFICATION...' : 'VÉRIFIER LE CODE'}
            </button>
          </div>

          <div className="text-center mt-6">
            <button onClick={async () => { try { const phone = localStorage.getItem('otp_phone') || ''; if (phone) { await apiClient.sendOtp(phone); setError('Code renvoyé.'); } } catch {} }} type="button" className="text-sm font-bold text-gray-400 hover:text-gray-600">
              Renvoyer le code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
