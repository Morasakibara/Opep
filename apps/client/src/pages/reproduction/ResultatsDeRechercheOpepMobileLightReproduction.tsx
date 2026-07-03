import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: resultats-de-recherche-opep-mobile-light
 */
export default function ResultatsDeRechercheOpepMobileLightReproduction() {
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
      <header className="flex justify-between items-center px-container-padding w-full pt-4 bg-transparent transition-opacity duration-200">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdcXC-tx5zMpxPP7-tIQa6Fm5qhqwXuLlSdKiSy_mxTG8McWhQXCQuxZQS61X6BKnWKepaRdJOS3wBgnzFFN9APYwd-ljOP9ZbeBKfPzOFM6jKw5FxAb-YcbJk_Ae2dLhIwg3aLJXGKsEulzcIOAySeAAaOSTzEvCt_f0Zvt33nl1f0rD4GBJK-b9_7jYQHNpkVErMPSNjBWbOMFMaIavnr-SKq04BfnAPOgRY9IY4qSjwaOkxBQpLxrB364mDHkM6GLRx1afcK3Y"  />
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">Good morning, Guest</p>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Explore Cameroon</h1>
</div>
</div>
<button className="material-symbols-outlined text-primary text-2xl hover:opacity-80 active:scale-95 transition-all">notifications</button>
</header>
<main className="px-container-padding pb-32 pt-6">

<section className="mb-8">
<div className="relative mb-4 group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-4 pl-12 pr-4 font-body-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none shadow-sm" placeholder="Search destinations..." type="text" value="Kribi Beaches"/>
</div>
<div className="flex gap-2 overflow-x-auto custom-scrollbar">
<div className="px-4 py-2 rounded-full bg-primary text-white font-label-sm text-label-sm flex items-center gap-2 flex-shrink-0">
<span className="material-symbols-outlined text-[18px]">beach_access</span>
                    Coastal
                </div>
<div className="px-4 py-2 rounded-full glass-card border-outline-variant text-on-surface-variant font-label-sm text-label-sm flex items-center gap-2 flex-shrink-0 hover:bg-surface-container transition-colors cursor-pointer">
<span className="material-symbols-outlined text-[18px]">forest</span>
                    Forest
                </div>
<div className="px-4 py-2 rounded-full glass-card border-outline-variant text-on-surface-variant font-label-sm text-label-sm flex items-center gap-2 flex-shrink-0 hover:bg-surface-container transition-colors cursor-pointer">
<span className="material-symbols-outlined text-[18px]">history_edu</span>
                    Heritage
                </div>
<div className="px-4 py-2 rounded-full glass-card border-outline-variant text-on-surface-variant font-label-sm text-label-sm flex items-center gap-2 flex-shrink-0 hover:bg-surface-container transition-colors cursor-pointer">
<span className="material-symbols-outlined text-[18px]">restaurant</span>
                    Food
                </div>
</div>
</section>

<div className="flex justify-between items-center mb-6">
<h2 className="font-title-md text-title-md text-on-surface">{trips.length > 0 ? `${trips.length} trips found` : 'No trips'}</h2>
<button className="text-primary font-label-sm text-label-sm flex items-center gap-1 hover:underline">
                Sort by: Featured <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
{!isLoading && !apiError && trips.length > 0 ? trips.map((trip, i) => (
<div key={i} className="glass-card inner-glow rounded-[24px] overflow-hidden flex flex-col group cursor-pointer transition-transform duration-300 active:scale-[0.98]">
  <div className="h-48 relative overflow-hidden">
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-primary font-label-sm text-label-sm flex items-center gap-1">
      <span className="material-symbols-outlined text-sm">star</span> 4.5
    </div>
  </div>
  <div className="p-md flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-title-md text-title-md text-on-surface">{trip.agency?.name || 'Agence'}</h3>
      </div>
      <p className="font-title-md text-title-md text-primary">{trip.basePrice || 0} FCFA</p>
    </div>
    <p className="text-on-surface-variant font-body-md">{trip.route?.departureCity || 'Départ'} → {trip.route?.arrivalCity || 'Arrivée'}</p>
    <div className="flex gap-4">
      <div className="flex items-center gap-1 text-on-surface-variant text-xs">
        <span className="material-symbols-outlined text-sm">schedule</span> {trip.route?.estimatedDurationMinutes || '?'}min
      </div>
    </div>
  </div>
</div>
)) : !isLoading && <div className="col-span-full text-center py-8"><p className="text-on_surface_variant">Aucun trajet trouvé</p></div>}
<div className="mt-10 relative h-40 rounded-[28px] overflow-hidden bg-primary-container">

<div className="relative z-10 p-lg flex flex-col justify-center h-full text-white">
<h4 className="font-title-md text-title-md">Unlock Local Secrets</h4>
<p className="font-body-md opacity-90 max-w-[200px]">Get 15% off your first guided beach expedition.</p>
<div className="mt-2 text-secondary font-label-sm text-label-sm font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">PROMO: CAMTOUR</div>
</div>
</div>
</div>
</main>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] flex justify-between items-center h-16 px-6">
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>search</span>
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
