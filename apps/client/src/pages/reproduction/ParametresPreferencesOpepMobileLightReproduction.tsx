import React, { useState, useEffect } from 'react';
import { usersApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiUser } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: parametres-preferences-opep-mobile-light
 */
export default function ParametresPreferencesOpepMobileLightReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [isToggled, setIsToggled] = useState(false);
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
      <header className="bg-transparent text-primary font-headline-lg-mobile text-headline-lg-mobile w-full pt-4 flex justify-between items-center px-4 w-full sticky top-0 z-50 glass-panel">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full border-2 border-primary-container p-0.5 overflow-hidden">
<img loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzCih_X4Mqv1BLAcfkToJqPTmfZ2tG9Lu2G9xn-gjCdngCI0KH2p04qY2uNAev9020ExYyivn5rbCKvTcMV7PLKB1D4EVt76S9PFaLDWxzb7hh3fIpICwin-SBtV0amaDOFQPfhMGjSIcNDbd2zAs4BCml6k3VjX5xq6IAXzx0SeiF1Ewd0G69Gb73Lu1IQ5AJo-C1RVl9RRwymvqmPfksi31PSCsBskSCeVsDLWL2bzbudqi9C3hBHZaiPAnl43ZaiElAlD64O7A"  />
</div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tight">Settings</h1>
</div>
<button className="transition-opacity duration-200 active:scale-95 hover:opacity-80">
<span className="material-symbols-outlined text-[28px]">notifications</span>
</button>
</header>
<main className="px-4 mt-6 space-y-6 max-w-max-width mx-auto">

<section className="grid grid-cols-2 gap-4">
<div className="col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center text-primary">
<span className="material-symbols-outlined">person</span>
</div>
<div><p className="font-title-lg text-title-lg text-on-surface">{profile && profile.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Amara Njoh'}</p>
<p className="font-body-md text-body-md text-on-surface-variant">Manage your account</p>
</div>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
</div>
</section>

<section className="space-y-3">
<h2 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant px-1">Notification Channels</h2>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant">

<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-[#25D366]/10 rounded-lg flex items-center justify-center text-[#25D366]">
<span className="material-symbols-outlined">chat</span>
</div>
<div>
<p className="font-body-lg text-body-lg font-semibold">WhatsApp</p>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time alerts &amp; news</p>
</div>
</div>
<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer z-10 checked:right-0 checked:border-primary-container transition-all duration-300" id="toggle-whatsapp" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle-whatsapp"></label>
</div>
</div>

<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
<span className="material-symbols-outlined">sms</span>
</div>
<div>
<p className="font-body-lg text-body-lg font-semibold">SMS</p>
<p className="font-body-md text-body-md text-on-surface-variant">Critical emergency updates</p>
</div>
</div>
<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer z-10 checked:right-0 checked:border-primary-container transition-all duration-300" id="toggle-sms" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle-sms"></label>
</div>
</div>

<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">mail</span>
</div>
<div>
<p className="font-body-lg text-body-lg font-semibold">Email</p>
<p className="font-body-md text-body-md text-on-surface-variant">Weekly summaries &amp; reports</p>
</div>
</div>
<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer z-10 checked:right-0 checked:border-primary-container transition-all duration-300" id="toggle-email" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle-email"></label>
</div>
</div>
</div>
</section>

<section className="space-y-3">
<h2 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant px-1">Language Preference</h2>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-1 flex gap-1">
<button className="flex-1 py-3 px-4 rounded-lg bg-primary-container text-on-primary-container font-semibold transition-all duration-300 flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[20px]">check_circle</span>
                    English
                </button>
<button className="flex-1 py-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all duration-300 font-semibold flex items-center justify-center">
                    Français
                </button>
</div>
</section>

<section className="space-y-3">
<h2 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant px-1">Security</h2>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
<button className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors group">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-on-surface-variant">lock</span>
<span className="font-body-lg text-body-lg">Two-Factor Authentication</span>
</div>
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded-full bg-tertiary-container/20 text-on-tertiary-fixed-variant text-[10px] font-bold uppercase tracking-tighter">Recommended</span>
<span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
</div>
</button>
<div className="h-px bg-outline-variant mx-4"></div>
<button className="w-full p-4 flex items-center justify-between hover:bg-surface-container transition-colors group">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-on-surface-variant">shield</span>
<span className="font-body-lg text-body-lg">Privacy Policy</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
</button>
</div>
</section>

<section className="pt-4 space-y-4">
<button className="w-full py-4 border border-outline rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">help</span>
                Contact Support
            </button>
<button className="w-full py-4 bg-secondary-container/10 text-secondary border border-secondary/20 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>logout</span>
                Logout
            </button>
</section>
</main>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] flex justify-around items-center py-3">
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm">Home</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm">Search</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">confirmation_number</span>
<span className="font-label-sm text-label-sm">Tickets</span>
</button>
<button className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</button>
</div>
</nav>
    </div>
  );
}
