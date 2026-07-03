import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: reservation-sieges-opep-mobile-dark
 */
export default function ReservationSiegesOpepMobileDarkReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [availableTrips, setAvailableTrips] = useState<ApiTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    tripsApi.getAvailable().then(data => { setAvailableTrips(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {apiError && <ApiError message={apiError} />}
      {/* SECTION: Mockup Layout */}
      <header className="flex justify-between items-center px-container-padding w-full pt-4 z-10">
<div className="flex items-center gap-3">
<button className="w-10 h-10 flex items-center justify-center rounded-full glass-panel active:scale-95 transition-transform">
<span className="material-symbols-outlined text-on-surface">arrow_back</span>
</button>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Select Seat</h1>
</div>
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApuoVuLsrRhMbKWFvbH08xeNYL1vbxhOrzmlKwASR15g6pdlXJ43KXs1dhJcM7yTiYYrDlruY4LXZLJskXzq2_r7lfWdYY8a-ZdhBJzkk_z3QStrtniWpvWpzbK8a_b1nMLRPGCmxGDthBsO8Q_0DXnhKgLARA3cl_yuh7kcLtpL94XpPPtgUGVpBMhcMLpdaoEz4IiNLOjybkEs2DYO9g51U19YpgaUZP3Xt39Q-UQo0GlAeFTdfC3giUUJ9HKGXMJK9fTtd-GGw"  />
</div>
</header>

<main className="flex-1 px-container-padding py-md flex flex-col gap-6 mb-32">

<section className="glass-panel p-md rounded-xl flex justify-between items-center">
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded-sm bg-surface-variant border border-outline-variant"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Free</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded-sm bg-primary border border-primary-fixed-dim"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Occupied</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded-sm bg-tertiary shadow-[0_0_8px_rgba(236,195,0,0.6)]"></div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Selected</span>
</div>
</section>

<div className="relative flex-1 glass-panel rounded-3xl p-lg flex flex-col items-center overflow-hidden">

<div className="mb-8 opacity-20 flex flex-col items-center gap-2">
<span className="material-symbols-outlined text-[48px]">steering_wheel_heat</span>
<div className="h-px w-24 bg-gradient-to-r from-transparent via-outline to-transparent"></div>
</div>

<div className="grid grid-cols-4 gap-y-6 gap-x-4 w-full max-w-[280px]">



<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">1A</span>
</button>
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">1B</span>
</button>
<div className="w-full"></div> 
<button className="w-full aspect-square rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center cursor-not-allowed">
<span className="material-symbols-outlined text-primary text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>person</span>
</button>

<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">2A</span>
</button>
<button className="w-full aspect-square rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center cursor-not-allowed">
<span className="material-symbols-outlined text-primary text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>person</span>
</button>
<div className="w-full"></div> 
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">2D</span>
</button>

<button className="seat-selected glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm text-on-tertiary">3A</span>
</button>
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">3B</span>
</button>
<div className="w-full"></div> 
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">3D</span>
</button>

<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">4A</span>
</button>
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">4B</span>
</button>
<div className="w-full"></div> 
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">4D</span>
</button>

<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">5A</span>
</button>
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">5B</span>
</button>
<div className="w-full"></div> 
<button className="seat glass-panel w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300">
<span className="font-label-sm text-label-sm opacity-50">5D</span>
</button>
</div>

<div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
<div className="absolute -top-20 -right-20 w-64 h-64 bg-tertiary/5 blur-[100px] rounded-full"></div>
</div>
</main>

<footer className="fixed bottom-0 left-0 right-0 z-50 p-6">
<div className="glass-panel p-6 rounded-[32px] flex flex-col gap-6 shadow-2xl inner-glow">
<div className="flex justify-between items-end">
<div className="flex flex-col gap-1">
<p className="font-label-sm text-label-sm text-on-surface-variant">Seats Selected</p>
<div className="flex gap-2" id="selected-labels">
<span className="font-title-md text-title-md text-tertiary">3A</span>
</div>
</div>
<div className="flex flex-col items-end gap-1">
<p className="font-label-sm text-label-sm text-on-surface-variant">Total Price</p>
<p className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-extrabold" id="total-price">25,000 FCFA</p>
</div>
</div>
<button className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-body-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(121,216,183,0.3)]">
                Confirm Booking
                <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</footer>
    </div>
  );
}
