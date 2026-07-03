import React, { useState } from 'react';
import { authApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';

/**
undefined
 * Original Screen: connexion-recuperation-opep-mobile-dark
 */
export default function ConnexionRecuperationOpepMobileDarkReproduction() {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const handleLogin = async () => {
    if (!phone || !password) { setAuthError('Veuillez remplir tous les champs'); return; }
    setIsLoading(true); setAuthError('');
    try {
      const res = await authApi.login(phone, password);
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
      // Navigation would go here in the real app
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Echec de connexion');
    } finally { setIsLoading(false); }
  };

  const handleOtpVerify = async () => {
    const code = otpValues.join('');
    if (code.length < 6) { setAuthError('Veuillez saisir le code complet'); return; }
    setIsLoading(true); setAuthError('');
    try {
      await authApi.verifyOtp(phone || '+237', code);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Code invalide');
    } finally { setIsLoading(false); }
  };



  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {authError && <ApiError message={authError} />}
      {isLoading && <LoadingSpinner overlay text="Connexion..." />}
      {/* SECTION: Mockup Layout */}
      <main className="flex-grow flex items-center justify-center p-md">

<div className="w-full max-w-[400px] glass p-lg rounded-[24px] shadow-2xl relative z-10 animate-fade-in" id="login-container">
<header className="mb-lg">
<div className="flex justify-between items-center mb-xs">
<span className="font-display-lg text-display-lg text-primary tracking-tighter">O.</span>
<div className="flex gap-2">
<button className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">FR</button>
<span className="text-outline-variant">|</span>
<button className="font-label-sm text-label-sm text-primary">EN</button>
</div>
</div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Welcome back.</h1>
<p className="font-body-md text-on-surface-variant">Log in to your account</p>
</header>
<form className="space-x-0 space-y-md" id="login-form">

<div className="flex flex-col gap-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant px-1">Phone Number / Numéro</label>
<div className="flex items-center glass rounded-xl border border-outline-variant px-md py-3 input-focus-effect transition-all">
<span className="material-symbols-outlined text-primary mr-sm" style={{"fontVariationSettings":"'opsz' 20"}}>phone_iphone</span>
<input className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline-variant font-body-md" placeholder="+237 6XX XXX XXX" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
</div>
</div>

<div className="flex flex-col gap-xs">
<div className="flex justify-between items-center px-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Password / Mot de passe</label>
<button className="font-label-sm text-label-sm text-primary hover:underline" type="button">Forgot? / Oublié ?</button>
</div>
<div className="flex items-center glass rounded-xl border border-outline-variant px-md py-3 input-focus-effect transition-all">
<span className="material-symbols-outlined text-primary mr-sm" style={{"fontVariationSettings":"'opsz' 20"}}>lock</span>
<input className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline-variant font-body-md" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">visibility</span>
</div>
</div>
<button type="button" onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-title-md py-4 rounded-xl shadow-[0_0_20px_rgba(121,216,183,0.2)] hover:shadow-[0_0_30px_rgba(121,216,183,0.4)] active:scale-95 transition-all mt-xs disabled:opacity-50">
                    {isLoading ? 'Connexion...' : 'Sign In'}
                </button>
<div className="flex items-center py-sm">
<div className="flex-grow h-[1px] bg-outline-variant"></div>
<span className="px-md font-label-sm text-label-sm text-outline-variant">OR CONTINUE WITH</span>
<div className="flex-grow h-[1px] bg-outline-variant"></div>
</div>
<div className="grid grid-cols-2 gap-md">
<button className="flex items-center justify-center glass py-3 rounded-xl hover:border-primary/50 transition-all">
<img loading="lazy" decoding="async" className="w-5 h-5 mr-2" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChFaQFRkDqjluDlRGUqKIz8Slgs6_c4QbRoPT_uWPWglkEqI8KhazcuDQWd2nxrIZi89nBxD5GyroYyoqvClusYYuKkRWWKQXzdXONd0zTw45-txdaf_Fg1aPnpCSp_EV36ouXScplRcDfRYc0NTsM6zSc85N5XWpBalmOT6btFa_vB-nNhb-0q6kbjvpJjsxkNgaB6fkDqjERmgZNaHWkcdnOZd61ZDdl1_b9T7nIMZe-LG0sZaYLqO9WrIBPDJwn5kdSBno7FPM"  />
<span className="font-label-sm text-label-sm">Google</span>
</button>
<button className="flex items-center justify-center glass py-3 rounded-xl hover:border-primary/50 transition-all">
<img loading="lazy" decoding="async" className="w-5 h-5 mr-2" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0KbC8NO6Nupaf1WHq_NyjA_u_d2iAW2D0Xhda_tlFfZ9Ugr5ydBgBKoNRcnCj1E06SF4F3JGgaK9vnXLz97kBZGTxfdvV_QHzkY7ANdeqofajHV3cbWcrZKTB4t4redq-tjWkjjyQ8frQ440DX-UGPdgCWP5-v4vWmMgt6xlcpYgQLFkElgEV5WY3pPWmeAFORBs1uwfO10z1XpsW2kn7RZVtzTEZWTKbRjIjGPNBz9jxavqhZxao153p3ovqv2TlW6KB2uikdCk"  />
<span className="font-label-sm text-label-sm">Apple</span>
</button>
</div>
</form>
<footer className="mt-lg text-center">
<p className="font-body-md text-on-surface-variant">Don't have an account? <a className="text-primary font-bold" href="#">Sign up</a></p>
</footer>
</div>

<div className="w-full max-w-[400px] glass p-lg rounded-[24px] shadow-2xl relative z-10 animate-fade-in hidden-flow" id="recovery-container">
<header className="mb-lg">
<button className="mb-md flex items-center text-primary font-label-sm hover:translate-x-[-4px] transition-transform">
<span className="material-symbols-outlined mr-xs">arrow_back</span> Back to login
                </button>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Verify Identity.</h1>
<p className="font-body-md text-on-surface-variant">We've sent a 6-digit code to <span className="text-primary font-bold">+237 •••• 542</span></p>
</header>
<form className="space-y-lg" id="otp-form">
<div className="flex justify-between gap-2">
<input className="otp-input w-12 h-14 glass text-center font-title-md text-primary rounded-xl border border-outline-variant focus:ring-0 transition-all" maxLength={1} type="text" value={otpValues[0]} onChange={(e) => { const n = [...otpValues]; n[0] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 glass text-center font-title-md text-primary rounded-xl border border-outline-variant focus:ring-0 transition-all" maxLength={1} type="text" value={otpValues[1]} onChange={(e) => { const n = [...otpValues]; n[1] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 glass text-center font-title-md text-primary rounded-xl border border-outline-variant focus:ring-0 transition-all" maxLength={1} type="text" value={otpValues[2]} onChange={(e) => { const n = [...otpValues]; n[2] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 glass text-center font-title-md text-primary rounded-xl border border-outline-variant focus:ring-0 transition-all" maxLength={1} type="text" value={otpValues[3]} onChange={(e) => { const n = [...otpValues]; n[3] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 glass text-center font-title-md text-primary rounded-xl border border-outline-variant focus:ring-0 transition-all" maxLength={1} type="text" value={otpValues[4]} onChange={(e) => { const n = [...otpValues]; n[4] = e.target.value; setOtpValues(n); }}/>
<input className="otp-input w-12 h-14 glass text-center font-title-md text-primary rounded-xl border border-outline-variant focus:ring-0 transition-all" maxLength={1} type="text" value={otpValues[5]} onChange={(e) => { const n = [...otpValues]; n[5] = e.target.value; setOtpValues(n); }}/>
</div>
<div className="text-center">
<p className="font-body-md text-on-surface-variant mb-xs">Didn't receive code?</p>
<button className="font-label-sm text-label-sm text-primary hover:underline" type="button">Resend Code (0:45)</button>
</div>
<button type="button" onClick={handleOtpVerify} disabled={isLoading} className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-title-md py-4 rounded-xl shadow-[0_0_20px_rgba(121,216,183,0.2)] hover:shadow-[0_0_30px_rgba(121,216,183,0.4)] active:scale-95 transition-all disabled:opacity-50">
                    {isLoading ? 'Vérification...' : 'Verify Code'}
                </button>
</form>
</div>
</main>

<footer className="p-lg text-center relative z-10">
<p className="font-label-sm text-label-sm text-outline-variant uppercase tracking-widest">Powered by Obsidian Secure</p>
</footer>

<style dangerouslySetInnerHTML={{ __html: `
        /* Specific hover effect for glass cards based on mouse position */
        .glass:hover::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(121, 216, 183, 0.05), transparent 40%);
            border-radius: inherit;
            z-index: -1;
            pointer-events: none;
        }
    ` }} />
    </div>
  );
}
