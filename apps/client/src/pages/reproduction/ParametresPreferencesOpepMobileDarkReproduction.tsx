import React, { useState, useEffect } from 'react';
import { usersApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiUser } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: parametres-preferences-opep-mobile-dark
 */
export default function ParametresPreferencesOpepMobileDarkReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    usersApi.getProfile().then(data => { setProfile(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {apiError && <ApiError message={apiError} />}
      {/* SECTION: Mockup Layout */}
      <div className="relative min-h-screen pb-32">

<header className="flex justify-between items-center px-container-padding w-full pt-4 transition-opacity duration-200">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCktT7fa8saAnPyOD5CN_ODF2nWp_g9A9EBtPjv9UoWpgvbABgOYEqhVa9oyb4cjTZR3b7f56qdfBIm7eDtyZtfQfWqj9sb-2HCAC616gPjqrU1FoRU-7dgODm7BnHKwGp86Vkb4z9RdLHsLBEb7_KujZHh6Tc7Ioh6U2hdXhpvYrdgzp5MWFxdmcWd788W9Yc3GWvr5eu4vjKnWnhcoFJJekKhHEVRusC3ZtcdU8Mmzgtba5xQWg_1n11ysTwWNEPyziL0ztBc0w"  />
</div>
<div>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Profile Settings</span>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">{profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Guest'}</h1>
</div>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full glass-card text-primary active:scale-95 transition-transform">
<span className="material-symbols-outlined">notifications</span>
</button>
</header>
<main className="px-container-padding mt-8 space-y-6">

<section className="space-y-3">
<h2 className="font-label-sm text-label-sm text-on-surface-variant px-1 uppercase tracking-widest">Language Settings</h2>
<div className="glass-card inner-glow rounded-3xl p-4 flex gap-3">
<button className="flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 bg-primary text-on-primary-fixed font-title-md text-body-md transition-all">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>language</span>
                        English
                    </button>
<button className="flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 bg-surface-container-high/40 text-on-surface-variant font-title-md text-body-md hover:bg-surface-container-high transition-all">
                        French
                    </button>
</div>
</section>

<section className="space-y-3">
<h2 className="font-label-sm text-label-sm text-on-surface-variant px-1 uppercase tracking-widest">Notification Channels</h2>
<div className="glass-card inner-glow rounded-3xl overflow-hidden divide-y divide-white/5">

<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>chat</span>
</div>
<div>
<h3 className="font-title-md text-body-lg">WhatsApp</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Instant updates &amp; alerts</p>
</div>
</div>
<div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
<input checked className="switch-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer z-10" id="whatsapp" name="whatsapp" type="checkbox"/>
<label className="switch-label block overflow-hidden h-6 rounded-full bg-surface-container-highest cursor-pointer transition-colors duration-200" htmlFor="whatsapp"></label>
</div>
</div>

<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>sms</span>
</div>
<div>
<h3 className="font-title-md text-body-lg">SMS Notifications</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Essential security codes</p>
</div>
</div>
<div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
<input checked className="switch-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer z-10" id="sms" name="sms" type="checkbox"/>
<label className="switch-label block overflow-hidden h-6 rounded-full bg-surface-container-highest cursor-pointer transition-colors duration-200" htmlFor="sms"></label>
</div>
</div>

<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>mail</span>
</div>
<div>
<h3 className="font-title-md text-body-lg">Email Reports</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Weekly activity digests</p>
</div>
</div>
<div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
<input className="switch-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer z-10" id="email" name="email" type="checkbox"/>
<label className="switch-label block overflow-hidden h-6 rounded-full bg-surface-container-highest cursor-pointer transition-colors duration-200" htmlFor="email"></label>
</div>
</div>
</div>
</section>

<section className="space-y-3">
<h2 className="font-label-sm text-label-sm text-on-surface-variant px-1 uppercase tracking-widest">Account &amp; Security</h2>
<div className="grid grid-cols-2 gap-4">
<div className="col-span-2 glass-card inner-glow rounded-3xl p-5 flex items-center justify-between">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary text-3xl">fingerprint</span>
<div>
<h3 className="font-title-md text-body-lg">Biometric Unlock</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">FaceID or Fingerprint enabled</p>
</div>
</div>
<span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
</div>
<div className="glass-card inner-glow rounded-3xl p-5 flex flex-col justify-between aspect-square">
<span className="material-symbols-outlined text-tertiary text-4xl" style={{"fontVariationSettings":"'FILL' 1"}}>shield</span>
<div>
<h3 className="font-title-md text-body-lg">2FA Auth</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">High Protection</p>
</div>
</div>
<div className="glass-card inner-glow rounded-3xl p-5 flex flex-col justify-between aspect-square">
<span className="material-symbols-outlined text-secondary text-4xl" style={{"fontVariationSettings":"'FILL' 1"}}>key</span>
<div>
<h3 className="font-title-md text-body-lg">Password</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">Last changed 2d ago</p>
</div>
</div>
</div>
</section>

<button className="w-full py-4 glass-card rounded-3xl flex items-center justify-center gap-3 text-error border-error/20 active:bg-error/10 transition-colors">
<span className="material-symbols-outlined">logout</span>
<span className="font-title-md text-body-lg">Sign Out of OPEP</span>
</button>
</main>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full bg-surface-container/45 backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] flex justify-around items-center h-16 px-4">
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm">Search</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">confirmation_number</span>
<span className="font-label-sm text-label-sm">Tickets</span>
</a>
<a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</a>
</div>
</nav>
</div>
    </div>
  );
}
