import React, { useState, useEffect } from 'react';
import { authApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';

/**
undefined
 * Original Screen: recuperation-consentement-opep-mobile
 */
export default function RecuperationConsentementOpepMobileReproduction() {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const handleSendCode = async () => {
    if (!phone) { setAuthError('Veuillez saisir votre numéro'); return; }
    setIsLoading(true); setAuthError('');
    try {
      await new Promise(r => setTimeout(r, 800));
      setCodeSent(true);
      setResendTimer(60);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Erreur');
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleOtpVerify = async () => {
    const code = otpValues.join('');
    if (code.length < 6) { setAuthError('Code incomplet'); return; }
    setIsLoading(true); setAuthError('');
    try {
      await authApi.verifyOtp('+237' + phone, code);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Code invalide');
    } finally { setIsLoading(false); }
  };



  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {authError && <ApiError message={authError} />}
      {isLoading && <LoadingSpinner overlay text="Connexion..." />}
      {/* SECTION: Mockup Layout */}
      {/* Background Atmospheric Elements */}
<div className="fixed inset-0 pointer-events-none z-0">
<div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[120px]"></div>
<div className="absolute bottom-[5%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]"></div>
</div>
{/* Header / Top Navigation */}
<header className="w-full pt-4 flex justify-between items-center z-10 mb-xl">
<button className="w-12 h-12 flex items-center justify-center rounded-full glass-panel active:scale-90 transition-transform" id="back-button">
<span className="material-symbols-outlined text-primary">arrow_back</span>
</button>
<div className="font-display-lg text-primary text-[24px] tracking-tight font-extrabold">OPEP</div>
<div className="w-12"></div> {/* Spacer for symmetry */}
</header>
<main className="w-full max-w-md flex flex-col z-10 relative">
{/* Progress Bar */}
<div className="w-full h-1 bg-surface-container rounded-full mb-lg overflow-hidden">
<div className={`h-full bg-primary transition-all duration-500 ${codeSent ? 'w-2/3' : 'w-1/3'}`} id="progress-bar"></div>
</div>
{/* Step Container */}
<div className="relative overflow-hidden min-h-[500px]" id="step-container">
{/* Step 1: Phone Entry */}
<section className="step-transition absolute inset-0 opacity-100 translate-x-0 flex flex-col" id="step-1">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">Recover Account</h1>
<p className="font-body-md text-on-surface-variant mb-lg">Enter your registered phone number to receive a verification code.</p>
<div className="glass-panel p-md rounded-xl mb-lg">
<label className="font-label-sm text-on-surface-variant block mb-base">Phone Number</label>
<div className="flex items-center gap-sm">
<div className="flex items-center gap-xs px-sm py-md bg-surface-container rounded-lg border border-white/5">
<span className="font-body-lg text-on-surface">🇨🇲 +237</span>
</div>
<input className="flex-1 bg-surface-container border border-white/5 rounded-lg p-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-colors font-body-lg" placeholder="6XX XXX XXX" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
</div>
</div>
<button type="button" onClick={handleSendCode} disabled={isLoading} className="w-full py-md bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-sm disabled:opacity-50">{isLoading ? 'Envoi...' : 'Send Code'}
                    <span className="material-symbols-outlined">arrow_forward</span>
</button>
</section>
{/* Step 2: OTP Verification */}
<section className="step-transition absolute inset-0 opacity-0 translate-x-full flex flex-col pointer-events-none" id="step-2">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">Verification</h1>
<p className="font-body-md text-on-surface-variant mb-lg">We've sent a 6-digit code to <span className="text-primary">{phone ? `+237 ${phone.slice(0,1)}•• ••• •${phone.slice(-3)}` : '+237 6•• ••• •89'}</span></p>
<div className="flex justify-between gap-xs mb-lg">
<input className="otp-input w-12 h-14 bg-surface-container border border-white/5 rounded-xl text-center text-headline-lg text-primary focus:outline-none transition-all glass-panel" maxLength={1} type="number" value={otpValues[0]} onChange={(e) => { const n = [...otpValues]; n[0] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 bg-surface-container border border-white/5 rounded-xl text-center text-headline-lg text-primary focus:outline-none transition-all glass-panel" maxLength={1} type="number" value={otpValues[1]} onChange={(e) => { const n = [...otpValues]; n[1] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 bg-surface-container border border-white/5 rounded-xl text-center text-headline-lg text-primary focus:outline-none transition-all glass-panel" maxLength={1} type="number" value={otpValues[2]} onChange={(e) => { const n = [...otpValues]; n[2] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 bg-surface-container border border-white/5 rounded-xl text-center text-headline-lg text-primary focus:outline-none transition-all glass-panel" maxLength={1} type="number" value={otpValues[3]} onChange={(e) => { const n = [...otpValues]; n[3] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 bg-surface-container border border-white/5 rounded-xl text-center text-headline-lg text-primary focus:outline-none transition-all glass-panel" maxLength={1} type="number" value={otpValues[4]} onChange={(e) => { const n = [...otpValues]; n[4] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 bg-surface-container border border-white/5 rounded-xl text-center text-headline-lg text-primary focus:outline-none transition-all glass-panel" maxLength={1} type="number" value={otpValues[5]} onChange={(e) => { const n = [...otpValues]; n[5] = e.target.value; setOtpValues(n); }}/>
</div>
<div className="text-center mb-lg">
<p className="font-body-md text-on-surface-variant">{resendTimer > 0 ? <>Resend code in <span className="text-primary font-bold">{Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}</span></> : <button type="button" onClick={handleSendCode} className="text-primary font-bold hover:underline">Resend Code</button>}</p>
</div>
<button type="button" onClick={handleOtpVerify} disabled={isLoading} className="w-full py-md bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50">{isLoading ? 'Vérification...' : 'Verify Code'}</button>
</section>
{/* Step 3: Legal Consent */}
<section className="step-transition absolute inset-0 opacity-0 translate-x-full flex flex-col pointer-events-none" id="step-3">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">Legal Consent</h1>
<p className="font-body-md text-on-surface-variant mb-lg">Finalize your account recovery by reviewing our updated legal framework.</p>
<div className="glass-panel p-md rounded-xl mb-lg space-y-md">
<div className="flex items-start gap-md">
<label className="relative flex items-center cursor-pointer">
<input className="peer sr-only" type="checkbox"/>
<div className="w-6 h-6 border-2 border-outline-variant rounded-md bg-transparent peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-on-primary scale-0 peer-checked:scale-100 transition-transform">check</span>
</div>
</label>
<div className="flex-1">
<p className="font-body-md text-on-surface">I agree to the <a className="text-primary underline decoration-primary/30 underline-offset-2" href="#">Terms of Service</a>.</p>
</div>
</div>
<div className="flex items-start gap-md">
<label className="relative flex items-center cursor-pointer">
<input className="peer sr-only" type="checkbox"/>
<div className="w-6 h-6 border-2 border-outline-variant rounded-md bg-transparent peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-on-primary scale-0 peer-checked:scale-100 transition-transform">check</span>
</div>
</label>
<div className="flex-1">
<p className="font-body-md text-on-surface">I consent to the <a className="text-primary underline decoration-primary/30 underline-offset-2" href="#">Privacy Policy</a> and data processing in Cameroon.</p>
</div>
</div>
</div>
<div className="bg-surface-container/30 border border-white/5 rounded-xl p-md mb-xl">
<p className="font-label-sm text-outline-variant leading-relaxed">
                        By checking these boxes, you acknowledge that you have read and understood the OPEP legal framework regarding digital identity and transaction security.
                    </p>
</div>
<button className="w-full py-md bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold rounded-xl shadow-lg active:scale-95 transition-all">
                    Accept &amp; Continue
                </button>
</section>
</div>
</main>
{/* Visual Detail: Bento-style decorative elements at bottom */}
<footer className="mt-auto w-full max-w-md pb-md grid grid-cols-2 gap-sm opacity-50">
<div className="h-1 bg-surface-container rounded-full"></div>
<div className="h-1 bg-surface-container rounded-full"></div>
</footer>
    </div>
  );
}
