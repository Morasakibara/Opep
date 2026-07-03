import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: suivi-gps-en-temps-reel-opep-mobile-dark
 */
export default function SuiviGpsEnTempsReelOpepMobileDarkReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [tripsData, setTripsData] = useState<ApiTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    tripsApi.getAvailable().then(data => { setTripsData(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {apiError && <ApiError message={apiError} />}
      {/* SECTION: Mockup Layout */}
      <div className="map-container overflow-hidden">
<div className="w-full h-full relative">

<div className="w-full h-full bg-cover bg-center opacity-80" data-alt="A dark-mode stylized GPS navigation map showing a route from Douala to Yaoundé in Cameroon. The map is minimalist with deep obsidian tones and glowing neon-teal road lines. Topography is subtly visible with soft shadows. The visual style is premium and high-tech, fitting a modern glassmorphic UI design system." data-location="Cameroon, Douala to Yaounde Road" style={{}}>
</div>

<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 800">
<path d="M100,700 Q150,600 200,500 T300,300" fill="none" stroke="rgba(121, 216, 183, 0.3)" strokeDasharray="8 4" strokeWidth="4"></path>
<path d="M100,700 Q150,600 180,540" fill="none" id="active-path" stroke="#79d8b7" strokeLinecap="round" strokeWidth="6"></path>

<g id="bus-icon" transform="translate(175, 530)">
<circle className="fill-primary bus-marker" cx="0" cy="0" r="14"></circle>
<text className="material-symbols-outlined fill-on-primary text-[16px]" style={{"fontFamily":"'Material Symbols Outlined'"}} x="-8" y="6">directions_bus</text>
</g>
</svg>
</div>
</div>

<div className="relative z-10 flex flex-col h-screen">

<header className="flex justify-between items-center px-container-padding w-full pt-4 bg-transparent transition-opacity duration-200 active:scale-95">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYAqTOXwUaeO0XfeB1KYQAZDBDzSfSMyX2LMuMXHHVF-ZhUQjTBdpqWPualcC8P1FYfsHbf47VtzKk8Zgi-uOgMybOE0_wW0qYADIG7OAsaGPMZTnHAwwNVW14kaE2mM1SIi25BmTQRNfn_qtv_ydzJhZ3YQ39Km-MkoR-IfBJXZs7tQOlmXDCx_FfQOZyaNrSqJ5BUn5ZXUILdq2VItLJwx0vBASrxVrbCb4BLHw6KL9vciy8ass8gsrCEAbwWxKsfULrSGVQdxQ"  />
</div>
<div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">VIP Express</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant">Douala → Yaoundé</p>
</div>
</div>
<button className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined text-primary">notifications</span>
</button>
</header>

<main className="flex-1 flex flex-col justify-end p-container-padding pb-32">

<div className="glass-panel inner-glow-top rounded-2xl p-4 mb-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
<div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container" style={{"fontVariationSettings":"'FILL' 1"}}>location_on</span>
</div>
<div className="flex-1">
<p className="font-label-sm text-label-sm text-primary uppercase tracking-widest">PROCHAINE ÉTAPE / NEXT STOP</p>
<h2 className="font-title-md text-title-md text-on-background">Approaching Edéa</h2>
<p className="text-xs text-on-surface-variant mt-1">Arrival in approx. 12 mins</p>
</div>
<div className="text-right">
<span className="text-xs font-bold px-2 py-1 bg-tertiary/10 text-tertiary rounded-full border border-tertiary/20">LIVE</span>
</div>
</div>

<div className="grid grid-cols-2 gap-3 mb-6">

<div className="glass-panel inner-glow-top rounded-3xl p-5 flex flex-col gap-2">
<span className="material-symbols-outlined text-primary text-xl">speed</span>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">Speed / Vitesse</p>
<div className="flex items-baseline gap-1">
<span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">88</span>
<span className="text-sm text-on-surface-variant">km/h</span>
</div>
</div>
</div>

<div className="glass-panel inner-glow-top rounded-3xl p-5 flex flex-col gap-2">
<span className="material-symbols-outlined text-tertiary text-xl">schedule</span>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">ETA / Arrivée</p>
<div className="flex items-baseline gap-1">
<span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">14:45</span>
</div>
</div>
</div>

<div className="col-span-2 glass-panel inner-glow-top rounded-3xl p-5">
<div className="flex justify-between items-end mb-4">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">Progress / Progression</p>
<p className="font-title-md text-title-md text-on-background">142 km / 245 km</p>
</div>
<div className="text-right">
<p className="font-label-sm text-label-sm text-primary font-bold">58% COMPLETE</p>
</div>
</div>

<div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden relative">
<div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-container to-primary rounded-full shadow-[0_0_12px_rgba(121,216,183,0.5)]" style={{"width":"58%"}}></div>
</div>
</div>
</div>

<button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#007a5e] to-[#79d8b7] text-on-primary font-bold shadow-[0_10px_30px_rgba(0,122,94,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-2">
<span className="material-symbols-outlined">share</span>
                PARTAGER MON TRAJET / SHARE TRIP
            </button>
</main>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] flex justify-around items-center h-20">
<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out cursor-pointer">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span className="font-label-sm text-label-sm mt-1">Home</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out cursor-pointer">
<span className="material-symbols-outlined" data-icon="search">search</span>
<span className="font-label-sm text-label-sm mt-1">Search</span>
</div>

<div className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out cursor-pointer">
<span className="material-symbols-outlined" data-icon="confirmation_number" style={{"fontVariationSettings":"'FILL' 1"}}>confirmation_number</span>
<span className="font-label-sm text-label-sm mt-1">Tickets</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out cursor-pointer">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-sm text-label-sm mt-1">Profile</span>
</div>
</div>
</nav>
</div>
    </div>
  );
}
