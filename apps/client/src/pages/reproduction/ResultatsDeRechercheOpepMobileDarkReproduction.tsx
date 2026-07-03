import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: resultats-de-recherche-opep-mobile-dark
 */
export default function ResultatsDeRechercheOpepMobileDarkReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    tripsApi.getAvailable().then(data => { setTrips(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {apiError && <ApiError message={apiError} />}
      {/* SECTION: Mockup Layout */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md pt-4 pb-2 px-container-padding flex items-center justify-between">
<div className="flex items-center gap-4">
<button aria-label="Go back" className="w-10 h-10 flex items-center justify-center rounded-full glass-panel active:scale-95 transition-transform">
<span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
</button>
<div className="flex flex-col">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Douala to Yaoundé</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant">Today, 24 Oct • 2 Adults</p>
</div>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full glass-panel active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary" data-weight="fill">notifications</span>
</button>
</header>
<main className="pt-24 pb-32 px-container-padding flex flex-col gap-6">

<section className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
<div className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[18px]">schedule</span>
<span>Time: Morning</span>
</div>
<div className="flex items-center gap-2 glass-panel text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[18px]">directions_bus</span>
<span>Agency</span>
</div>
<div className="flex items-center gap-2 glass-panel text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[18px]">payments</span>
<span>Price</span>
</div>
<div className="flex items-center gap-2 glass-panel text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[18px]">tune</span>
<span>More</span>
</div>
</section>

<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{trips.length > 0 ? `${trips.length} Trips Available` : 'No trips'}</span>
<span className="material-symbols-outlined text-on-surface-variant">sort</span>
</div>

<div className="flex flex-col gap-4">
{!isLoading && !apiError && trips.length > 0 ? trips.map((trip, i) => (
<div key={i} className="glass-panel inner-glow rounded-[24px] p-5 flex flex-col gap-4 relative overflow-hidden group active:scale-[0.98] transition-all duration-200">
  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10"></div>
  <div className="flex justify-between items-start">
    <div className="flex flex-col gap-1">
      <h3 className="font-title-md text-title-md text-on-surface">{trip.agency?.name || 'Agence'}</h3>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{trip.bus?.model || 'Coach'}</span>
    </div>
    <div className="text-right">
      <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary">{(trip.basePrice || 0).toLocaleString()} <span className="text-[14px] opacity-70">FCFA</span></p>
    </div>
  </div>
  <div className="flex items-center justify-between pt-2 border-t border-white/5">
    <div className="flex flex-col">
      <span className="font-title-md text-title-md text-on-surface">{trip.departureDateTime ? new Date(trip.departureDateTime).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{trip.route?.departureCity || 'Départ'}</span>
    </div>
    <div className="flex-1 flex flex-col items-center px-4">
      <div className="w-full flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/40"></div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-primary/40 via-primary to-primary/40 relative"></div>
        <div className="w-2 h-2 rounded-full border border-primary/40"></div>
      </div>
      <span className="font-label-sm text-[10px] text-on-surface-variant mt-2 uppercase">{trip.route?.estimatedDurationMinutes || '?'}min</span>
    </div>
    <div className="flex flex-col text-right">
      <span className="font-title-md text-title-md text-on-surface">{trip.arrivalDateTime ? new Date(trip.arrivalDateTime).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{trip.route?.arrivalCity || 'Arrivée'}</span>
    </div>
  </div>
</div>
)) : !isLoading && <div className="text-center py-8"><p className="text-on_surface_variant">Aucun trajet trouvé</p></div>}
</div>
</main>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8 pointer-events-none">
<div className="bg-surface-container/45 backdrop-blur-lg fixed bottom-4 left-4 right-4 rounded-full border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] h-16 flex justify-around items-center px-4 pointer-events-auto">
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm">Search</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">confirmation_number</span>
<span className="font-label-sm text-label-sm">Tickets</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</a>
</div>
</nav>
    </div>
  );
}
