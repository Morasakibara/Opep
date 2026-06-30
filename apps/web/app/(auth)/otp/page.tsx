'use client';

import React, { useState, useRef } from 'react';
export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      alert('Veuillez entrer le code complet.');
      return;
    }
    alert(`Code ${code} validé (Simulé).`);
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
          <div className="flex justify-between space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
              VÉRIFIER LE CODE
            </button>
          </div>

          <div className="text-center mt-6">
            <button onClick={() => alert('Code renvoyé (Simulé)')} type="button" className="text-sm font-bold text-gray-400 hover:text-gray-600">
              Renvoyer le code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
