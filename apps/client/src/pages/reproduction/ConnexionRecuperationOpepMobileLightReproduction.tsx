import React, { useState } from 'react';
import { authApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';

/**
undefined
 * Original Screen: connexion-recuperation-opep-mobile-light
 */
export default function ConnexionRecuperationOpepMobileLightReproduction() {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setAuthError('Veuillez remplir tous les champs'); return; }
    setIsLoading(true); setAuthError('');
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Echec de connexion');
    } finally { setIsLoading(false); }
  };

  const handleOtpVerify = async () => {
    const code = otpValues.join('');
    if (code.length < 4) { setAuthError('Code incomplet'); return; }
    setIsLoading(true); setAuthError('');
    try {
      await authApi.verifyOtp(email || '', code);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Code invalide');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {authError && <ApiError message={authError} />}
      {isLoading && <LoadingSpinner overlay text="Connexion..." />}
      {/* SECTION: Mockup Layout */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
</div>

<main className="flex-1 flex flex-col items-center justify-center px-container-padding relative z-10">

<div className="mb-lg text-center animate-fade-in">
<h1 className="font-display-lg text-display-lg text-primary tracking-tighter mb-xs">LUX</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Premium Security</p>
</div>

<div className="w-full max-w-md">

<div className="glass-card rounded-[32px] p-8 inner-glow shadow-xl transition-all duration-500 ease-out" id="login-view">
<header className="mb-lg">
<h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">Login</h2>
<p className="text-on-surface-variant font-body-md">Connectez-vous pour continuer.</p>
</header>
<form className="space-y-md" id="login-form">
<div className="space-y-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant ml-1">EMAIL / USERNAME</label>
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
<input className="w-full bg-surface-container border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl py-3 pl-12 pr-4 text-on-surface transition-all" placeholder="alex@premium.com" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between items-center px-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">PASSWORD</label>
<button className="font-label-sm text-label-sm text-primary hover:opacity-80 transition-opacity" type="button">FORGOT?</button>
</div>
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
<input className="w-full bg-surface-container border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl py-3 pl-12 pr-12 text-on-surface transition-all" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface" type="button">
<span className="material-symbols-outlined">visibility</span>
</button>
</div>
</div>
<button type="button" onClick={handleLogin} disabled={isLoading} className="w-full emerald-gradient text-on-primary font-title-md py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50">
                        {isLoading ? 'Connexion...' : 'Sign In'}
                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
</form>
<div className="mt-xl text-center">
<p className="text-on-surface-variant font-body-md">Don't have an account? <a className="text-primary font-bold" href="#">Sign Up</a></p>
</div>
</div>

<div className="hidden glass-card rounded-[32px] p-8 inner-glow shadow-xl transition-all duration-500 ease-out" id="otp-view">
<button className="mb-md -ml-2 p-2 rounded-full hover:bg-white/5 transition-colors flex items-center gap-2 text-on-surface-variant font-label-sm">
<span className="material-symbols-outlined">arrow_back</span> Back
                </button>
<header className="mb-lg">
<h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">Verification</h2>
<p className="text-on-surface-variant font-body-md">Saisissez le code envoyé par email.</p>
</header>
<div className="flex justify-between gap-3 mb-xl">
<input className="otp-input w-14 h-16 text-center text-title-md font-bold bg-surface-container border-outline-variant/30 focus:border-primary rounded-xl text-on-surface" maxLength={1} type="text" value={otpValues[0]} onChange={(e) => { const n = [...otpValues]; n[0] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-14 h-16 text-center text-title-md font-bold bg-surface-container border-outline-variant/30 focus:border-primary rounded-xl text-on-surface" maxLength={1} type="text" value={otpValues[1]} onChange={(e) => { const n = [...otpValues]; n[1] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-14 h-16 text-center text-title-md font-bold bg-surface-container border-outline-variant/30 focus:border-primary rounded-xl text-on-surface" maxLength={1} type="text" value={otpValues[2]} onChange={(e) => { const n = [...otpValues]; n[2] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-14 h-16 text-center text-title-md font-bold bg-surface-container border-outline-variant/30 focus:border-primary rounded-xl text-on-surface" maxLength={1} type="text" value={otpValues[3]} onChange={(e) => { const n = [...otpValues]; n[3] = e.target.value; setOtpValues(n); }}/>
</div>
<button type="button" onClick={handleOtpVerify} disabled={isLoading} className="w-full emerald-gradient text-on-primary font-title-md py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50">{isLoading ? 'Vérification...' : 'Verify Identity'}</button>
<div className="mt-lg text-center">
<p className="text-on-surface-variant font-body-md">Didn't receive it? <button className="text-primary font-bold">Resend code (0:45)</button></p>
</div>
</div>

<div className="hidden glass-card rounded-[32px] p-8 inner-glow shadow-xl transition-all duration-500 ease-out" id="recovery-view">
<button className="mb-md -ml-2 p-2 rounded-full hover:bg-white/5 transition-colors flex items-center gap-2 text-on-surface-variant font-label-sm">
<span className="material-symbols-outlined">arrow_back</span> Back
                </button>
<header className="mb-lg">
<h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">Recovery</h2>
<p className="text-on-surface-variant font-body-md">Enter your email to recover access.</p>
</header>
<form className="space-y-lg">
<div className="space-y-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant ml-1">ACCOUNT EMAIL</label>
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">alternate_email</span>
<input className="w-full bg-surface-container border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl py-3 pl-12 pr-4 text-on-surface transition-all" placeholder="email@domain.com" type="email"/>
</div>
</div>
<button className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-title-md py-4 rounded-xl hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button">
                        Send Recovery Link
                    </button>
</form>
<div className="mt-lg p-4 bg-primary/5 rounded-xl border border-primary/10">
<p className="text-primary text-label-sm text-center">A verification code will be sent to the registered address.</p>
</div>
</div>
</div>
</main>

<footer className="p-8 flex justify-center items-center gap-6 relative z-10">
<button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm">
<span className="material-symbols-outlined text-[18px]">language</span>
            English
        </button>
<span className="w-[1px] h-3 bg-outline-variant/30"></span>
<button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm">
            Français
        </button>
</footer>

<style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
        }
    ` }} />
    </div>
  );
}
