import React, { useState, useEffect } from 'react';
import { healthApi } from '../../lib/apiClient';

/**
undefined
 * Original Screen: synchronisation-offline-opep-controleur
 */
export default function SynchronisationOfflineOpepControleurReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    healthApi.check().then(setIsOnline).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      <header className="flex justify-between items-center px-container-padding w-full pt-4 bg-transparent">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-white/10">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4ZwOwx8FKqmIJvffnXMLMf1vcUjiPT6GrjMrOwAJ0-Cd-Ucu40GH2txVsLnq1DY1a2zymQOk-VwhFVMsxTXC1Xd62YVt9HOm6nTnIpsl7WUkVS8CtuIoDW6QfoNqBrjecTILxZj06sOpENlTHlZ3XQwdUXRI6eUQeA-XBt5Z3ePjWEuuvRRwCijwVoEHJ0fLTx0a3QsXTk048LNotgcfa-_FXdhxBmKwXmY2JCAU2RiGMEsTonDG-hDa3Cj2r6IQ9Smb2fWywD90"  />
</div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Good morning, Guest</h1>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high transition-opacity duration-200 active:scale-95 hover:opacity-80">
<span className="material-symbols-outlined text-primary">notifications</span>
</button>
</header>
<main className="flex-grow px-container-padding pt-6 space-y-md">

<section className="grid grid-cols-2 gap-gutter">
<div className="glass-panel p-md rounded-2xl flex flex-col gap-base inner-glow-top">
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">update</span> LAST SYNC
                </span>
<p className="font-title-md text-title-md text-on-surface">12m ago</p>
</div>
<div className="glass-panel p-md rounded-2xl flex flex-col gap-base inner-glow-top">
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">block</span> BLACKLIST
                </span>
<div className="flex items-center gap-2">
<p className="font-title-md text-title-md text-tertiary">Updated</p>
<div className="w-2 h-2 rounded-full bg-tertiary"></div>
</div>
</div>
</section>

<section className="glass-panel p-md rounded-2xl flex items-center justify-between gap-md border-primary/20 bg-primary/5">
<div className="flex flex-col">
<h2 className="font-title-md text-title-md text-primary">14 Tickets Pending</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Queue validated locally</p>
</div>
<button className="bg-primary-container text-on-primary-container font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,122,94,0.3)]" id="syncBtn">
<span className="material-symbols-outlined" id="syncIcon">sync</span>
<span>SYNC NOW</span>
</button>
</section>

<section className="space-y-xs">
<div className="flex justify-between items-center px-xs">
<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Validation Queue</h3>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">filter_list</span>
</div>

<div className="glass-panel p-md rounded-2xl flex items-center gap-md inner-glow-top transition-transform active:scale-[0.98]">
<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
<span className="material-symbols-outlined">confirmation_number</span>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<p className="font-title-md text-body-lg font-semibold">T-90421-XB</p>
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-outline-variant text-on-surface-variant uppercase">Pending</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Validated: 10:42 AM • Line A</p>
</div>
</div>

<div className="glass-panel p-md rounded-2xl flex items-center gap-md inner-glow-top border-secondary/20 bg-secondary/5">
<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary/10 text-secondary">
<span className="material-symbols-outlined">warning</span>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<p className="font-title-md text-body-lg font-semibold">T-88219-QR</p>
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container uppercase">Conflict</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Duplicate sequence detected</p>
</div>
</div>

<div className="glass-panel p-md rounded-2xl flex items-center gap-md opacity-60 inner-glow-top">
<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
<span className="material-symbols-outlined">check_circle</span>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<p className="font-title-md text-body-lg font-semibold">T-87112-LZ</p>
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface uppercase">Synced</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Validated: 09:15 AM • Line C</p>
</div>
</div>

<div className="glass-panel p-md rounded-2xl flex items-center gap-md inner-glow-top transition-transform active:scale-[0.98]">
<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
<span className="material-symbols-outlined">confirmation_number</span>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<p className="font-title-md text-body-lg font-semibold">T-90425-MN</p>
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-outline-variant text-on-surface-variant uppercase">Pending</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Validated: 10:55 AM • Line B</p>
</div>
</div>
</section>

<div className="py-8 text-center">
<p className="font-label-sm text-label-sm text-outline">ENCRYPTED OFFLINE STORAGE ACTIVATED</p>
<p className="font-label-sm text-label-sm text-outline mt-1 italic">Device: OPEP-T1000-0042</p>
</div>
</main>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] flex justify-around py-3">

<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm mt-1">Home</span>
</div>

<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm mt-1">Search</span>
</div>

<div className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>confirmation_number</span>
<span className="font-label-sm text-label-sm mt-1">Tickets</span>
</div>

<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">person</span>
<span className="font-label-sm text-label-sm mt-1">Profile</span>
</div>
</div>
</nav>
    </div>
  );
}
