import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: reservation-sieges-opep-mobile-light
 */
export default function ReservationSiegesOpepMobileLightReproduction() {
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
      {/* Top App Bar */}
<header className="flex justify-between items-center px-container-padding w-full pt-4 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
<div className="flex items-center gap-3">
<button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container active:scale-90 transition-transform">
<span className="material-symbols-outlined text-primary">arrow_back</span>
</button>
<div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">Select Seats</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant">{availableTrips[0]?.route?.departureCity || 'Yaoundé'} → {availableTrips[0]?.route?.arrivalCity || 'Douala'}</p>
</div>
</div>
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY_VvMyQ7iUUzEYNQX2v1nAUO0FDEcXGBv1jOXqUgraEp0bsiZAkhHTOX7jzyzCZZPPuzh_rlUoZQpeHr4IJliRbVFlSB40WuoTSBhW2ZSHjqxhg59ZsdwF9OOjci7vBqPLF4DDK12pdCxO1bvgt6k0KEsvxROdZuL-1QfYoOWPv_ZJx9QSwbBWV4bh73EofVmekIvOK3Gfj5D2H-hwe52QRQtZHfU3o82AzhJ4Ijzdt3lG03h6qltZ1-lNSaV-1eTqZj6joZD70A"  />
</div>
</header>
<main className="px-container-padding pt-6 pb-32">
{/* Legend */}
<section className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-outline/10">
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-primary"></div>
<span className="text-[12px] font-medium text-on-surface-variant">Available</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-tertiary"></div>
<span className="text-[12px] font-medium text-on-surface-variant">Selected</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-surface-variant"></div>
<span className="text-[12px] font-medium text-on-surface-variant">Booked</span>
</div>
</section>
{/* Bus Layout Container */}
<div className="relative max-w-sm mx-auto bg-white rounded-[40px] p-8 shadow-xl border border-outline/20">
{/* Steering Wheel Icon (Driver Area) */}
<div className="flex justify-end mb-10 opacity-30">
<span className="material-symbols-outlined text-4xl">slow_motion_video</span>
</div>
{/* Seat Grid */}
<div className="grid grid-cols-4 gap-y-6 gap-x-4">
{/* Row 1 */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">1A</button>
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">1B</button>
<div className="w-full"></div> {/* Aisle */}
<button className="w-full aspect-square rounded-xl bg-surface-variant text-on-surface-variant/50 flex items-center justify-center cursor-not-allowed">1C</button>
{/* Row 2 */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">2A</button>
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">2B</button>
<div className="w-full"></div> {/* Aisle */}
<button className="w-full aspect-square rounded-xl bg-tertiary text-on-surface font-bold flex items-center justify-center transition-all duration-200 active-glow active:scale-95">2C</button>
{/* Row 3 */}
<button className="w-full aspect-square rounded-xl bg-surface-variant text-on-surface-variant/50 flex items-center justify-center cursor-not-allowed">3A</button>
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">3B</button>
<div className="w-full"></div> {/* Aisle */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">3C</button>
{/* Row 4 */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">4A</button>
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">4B</button>
<div className="w-full"></div> {/* Aisle */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">4C</button>
{/* Row 5 */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">5A</button>
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">5B</button>
<div className="w-full"></div> {/* Aisle */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">5C</button>
{/* Row 6 */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">6A</button>
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">6B</button>
<div className="w-full"></div> {/* Aisle */}
<button className="w-full aspect-square rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 active:scale-95 seat-shadow">6C</button>
</div>
{/* Atmosphere Decoration */}
<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
<div className="absolute -top-10 -left-10 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl -z-10"></div>
</div>
{/* Bus Amenities Bento Section */}
<section className="mt-12 grid grid-cols-2 gap-4">
<div className="glass-card p-5 rounded-3xl inner-glow col-span-2 flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">wifi</span>
</div>
<div>
<h3 className="font-title-md text-on-surface font-bold">Premium Express</h3>
<p className="text-sm text-on-surface-variant">WiFi, AC, and USB Charging</p>
</div>
</div>
<div className="glass-card p-5 rounded-3xl inner-glow">
<span className="material-symbols-outlined text-primary mb-2">event_seat</span>
<p className="text-xs font-label-sm uppercase tracking-wider text-on-surface-variant">Legroom</p>
<p className="font-bold text-on-surface">Extra (+10cm)</p>
</div>
<div className="glass-card p-5 rounded-3xl inner-glow">
<span className="material-symbols-outlined text-primary mb-2">ac_unit</span>
<p className="text-xs font-label-sm uppercase tracking-wider text-on-surface-variant">Climate</p>
<p className="font-bold text-on-surface">22°C Fixed</p>
</div>
</section>
</main>
{/* Bottom Action Sheet */}
<div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-white border-t border-outline/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[32px]">
<div className="flex items-center justify-between mb-6">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">TOTAL FOR 1 PASSENGER</p>
<div className="flex items-baseline gap-1">
<span className="text-2xl font-bold text-primary">{availableTrips[0]?.basePrice?.toLocaleString() || '12,500'}</span>
<span className="text-sm font-semibold text-primary/70">XAF</span>
</div>
</div>
<div className="text-right">
<p className="font-label-sm text-label-sm text-on-surface-variant">SELECTED SEAT</p>
<p className="text-xl font-bold text-on-surface">{selectedSeats[0] || '2C'}</p>
</div>
</div>
<button className="w-full py-4 bg-gradient-to-r from-primary to-[#00a884] text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Confirm Selection
            <span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
{/* Bottom Navigation (Hidden as per "Destination Rule" since this is task-focused) */}
    </div>
  );
}
