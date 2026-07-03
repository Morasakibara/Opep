import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: suivi-gps-en-temps-reel-opep-mobile-light
 */
export default function SuiviGpsEnTempsReelOpepMobileLightReproduction() {
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
      <header className="flex justify-between items-center px-container-padding w-full pt-4 z-50 fixed top-0">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYQd5dE1ULYc09q7GR7ibz-zA-2bzw3sZCe89x3kBqL43-kYPSx_9BG4zgXhkIdBT43jKBb6cdW4N9ypRLMOjIrKYyXSGyRLbY49nDTV11IeDYqX6_bsAbfsgFu4gSE4QrGrcC-fjtayZhFU_khyncoiyZX9nRUKXOqJGLLF3kk8SFGBN3V-ImcocDRmkL4-B6cQBtgO8oHKS2_kAHimmlAfJgAdUnPTy2h6Vyi1CksQukRzwDCTcrui-5mIwla5kLzPyamWjP8to"  />
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{tripsData[0]?.route?.departureCity || 'Douala'} ➔ {tripsData[0]?.route?.arrivalCity || 'Yaoundé'}</p>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold leading-none">Trip Active</h1>
</div>
</div>
<button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-primary transition-opacity duration-200 active:scale-95 hover:opacity-80">
<span className="material-symbols-outlined">notifications</span>
</button>
</header>

<main className="flex-grow relative w-full h-full">
<div className="absolute inset-0 z-0">

<div className="w-full h-full bg-surface-container-low" data-location="Cameroon" style={{}}>
<img loading="lazy" decoding="async" className="w-full h-full object-cover opacity-60" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFqsdpWSive-Ujc4Ql-xw3ppqjD-cqI3c3shtmEjUya0UH0Sa7TZGpeEwsjjrWDtNNoLCbs2EfVL4xky0tItgWZuhPqJ_ifzXJA0oaIhePJo0QbGgchXaFAnHhtfAXx13SAgE6hPNuwvWOAWQsVkOgfVOxAy6GNHjIg2QUl5xRinkbC22VeuGCxhaH-FNQTNE_6fqXOVdefr1qd6_PfeXcS-mulkWBlU7b6OA-625vzq5-x0OnTJHo4KlMAP4RsjP83L8bKrkNSJw"  />
</div>

<svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg">
<path className="route-path" d="M100 700C120 600 200 550 250 450C300 350 280 250 320 100" opacity="0.3" stroke="#79d8b7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
<path d="M100 700C120 600 200 550 250 450" stroke="#79d8b7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>

<g transform="translate(250, 450)">
<circle className="bus-pulse" fill="#007a5e" fillOpacity="0.2" r="24"></circle>
<circle className="ambient-glow" fill="#79d8b7" r="12"></circle>
<foreignObject height="20" width="20" x="-10" y="-10">
<div className="flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined !text-[16px]">directions_bus</span>
</div>
</foreignObject>
</g>

<circle cx="100" cy="700" fill="#79d8b7" r="6"></circle>
<circle cx="320" cy="100" fill="#bdc9c2" r="6"></circle>
</svg>
</div>

<div className="absolute inset-x-0 bottom-32 px-container-padding flex flex-col gap-4 pointer-events-none">

<div className="glass-panel inner-glow rounded-xl p-4 flex items-center justify-between pointer-events-auto">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-primary bus-pulse"></div>
<p className="font-title-md text-title-md text-primary">En route vers Edéa</p>
</div>
<div className="bg-primary/10 px-3 py-1 rounded-full">
<span className="font-label-sm text-label-sm text-primary tracking-tight">Vitesse: 85 km/h</span>
</div>
</div>

<div className="grid grid-cols-2 gap-4 pointer-events-auto">

<div className="glass-panel inner-glow rounded-2xl p-5 flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">ETA</span>
<h2 className="font-display-lg text-display-lg text-primary">{tripsData[0]?.arrivalDateTime ? new Date(tripsData[0].arrivalDateTime).toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}) : '14:45'}</h2>
<p className="font-body-md text-body-md text-on-surface">Arrivée estimée</p>
</div>

<div className="flex flex-col gap-4">
<div className="glass-panel inner-glow rounded-2xl p-4 flex flex-grow items-center justify-between">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant block">Distance</span>
<span className="font-title-md text-title-md text-on-surface">142 km left</span>
</div>
<span className="material-symbols-outlined text-primary">route</span>
</div>
<div className="glass-panel inner-glow rounded-2xl p-4 flex flex-grow items-center justify-between">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant block">Tarif</span>
<span className="font-title-md text-title-md text-on-surface">{tripsData[0]?.basePrice?.toLocaleString() || '5,500'} FCFA</span>
</div>
<span className="material-symbols-outlined text-primary">payments</span>
</div>
</div>
</div>

<div className="glass-panel inner-glow rounded-xl p-4 flex items-center gap-4 pointer-events-auto bg-surface-container/40">
<div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>warning</span>
</div>
<div>
<h3 className="font-title-md text-title-md text-on-surface">Pluie signalée à Yaoundé</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Attendez-vous à un léger retard de 10 min.</p>
</div>
</div>
</div>
</main>

<button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(121,216,183,0.4)] flex items-center justify-center z-50 active:scale-90 transition-transform">
<span className="material-symbols-outlined">sos</span>
</button>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8 pointer-events-none">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] flex justify-around items-center h-16 pointer-events-auto">

<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm">Home</span>
</div>

<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm">Search</span>
</div>

<div className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] cursor-pointer active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>confirmation_number</span>
<span className="font-label-sm text-label-sm">Tickets</span>
</div>

<div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</div>
</div>
</nav>
    </div>
  );
}
