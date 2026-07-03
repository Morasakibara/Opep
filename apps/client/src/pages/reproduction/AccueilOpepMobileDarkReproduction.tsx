import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: accueil-opep-mobile-dark
 */
export default function AccueilOpepMobileDarkReproduction() {
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
<div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDAuDJQuwsbB2zszKs1_PMALfArQxhBtLxeQGU5zZPtMFo5SkSjSBJCXI7OS2A5ZttGYzWCH-hhZstFLMx8cxUmVb-fhl0GU2p_P9Eb8_EvXx7AN8Ux1loklOgjeRbq3jz-3odyKTEFelN6cF4f9Ta5aB9zWuqFJMhJnij4HdWjuCv9LKK2ILKx4mCrxQUH4C4CbfhCd0Ew3xlOKHLcbHOtsPtQHUdpnRi58XrFdGCD2AZTgh3ae4XYjBI4eGR1V-WozXT7ORg5sM"  />
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">{trips.length > 0 ? 'Good morning, Traveler' : 'Good morning, Guest'}</p>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Discover Cameroon</h1>
</div>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full glass-panel active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary">notifications</span>
</button>
</header>
<main className="mt-8 px-container-padding space-y-md">

<section className="glass-panel p-6 rounded-[24px] inner-glow space-y-4">
<h2 className="font-title-md text-title-md text-on-surface">Where are you going?</h2>
<div className="space-y-3">
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">location_on</span>
<input className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/50 transition-all" placeholder="From: Douala" type="text"/>
</div>
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-tertiary">near_me</span>
<input className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/50 transition-all" placeholder="To: Yaoundé" type="text"/>
</div>
</div>
<button className="w-full premium-gradient text-on-primary py-4 rounded-xl font-bold active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(0,122,94,0.3)]">
                Search Routes
            </button>
</section>

<section className="relative overflow-hidden glass-panel p-5 rounded-[24px] border-l-4 border-l-tertiary">
<div className="flex justify-between items-start mb-4">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider mb-1">Active Trip</span>
<h3 className="font-title-md text-title-md">{trips.length > 0 ? (trips[0].route?.departureCity || 'Départ') + ' \u2794 ' + (trips[0].route?.arrivalCity || 'Arrivée') : 'Douala \u2794 Kribi'}</h3>
</div>
<div className="bg-tertiary/10 px-3 py-1 rounded-full">
<p className="font-label-sm text-label-sm text-tertiary">Dep. 14:30</p>
</div>
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[18px]">confirmation_number</span>
<span className="text-xs">Ticket #CM-902</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[18px]">event_seat</span>
<span className="text-xs">Seat 12A</span>
</div>
</div>

<div className="mt-4 h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary w-1/3 rounded-full"></div>
</div>
</section>

<section>
<div className="flex justify-between items-center mb-4">
<h2 className="font-title-md text-title-md">Popular Routes</h2>
<button className="text-primary font-label-sm text-label-sm">View All</button>
</div>
<div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">

<div className="flex-shrink-0 w-44 group">
<div className="h-56 w-full rounded-[20px] overflow-hidden relative mb-2">
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10 opacity-80"></div>
<img loading="lazy" decoding="async" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAguAo5FZCqy7uKL0F6X9-uvE6tHgLcsGMY8Ul9FPAzMtVFqVT8XNC1HoHIC93UllZXvxlfUbNeNKTfsfkT_EGFtYxPrSxiTxJZpah0E8fOhXGvM-cg_4aChcc8TMZf40tUU3s5mPc072WQbebBllJ7vKI61_h6aNtlX68HR5wJBsVQr-R3LVqTEnc-_xvHrtleXLtINcrlnm1RXqVgAoz4AzU1NxLfWnN0orBPozS5GQttjQsvToqYnhqyB34HvmEeKfKwdxhpDyI"  />
<div className="absolute bottom-3 left-3 z-20">
<p className="font-title-md text-white">Douala</p>
<p className="text-[10px] text-primary/80 uppercase">Coastal Hub</p>
</div>
</div>
</div>

<div className="flex-shrink-0 w-44 group">
<div className="h-56 w-full rounded-[20px] overflow-hidden relative mb-2">
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10 opacity-80"></div>
<img loading="lazy" decoding="async" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoBNYYWbv9eMLtIanIDr0LIgl8nSgr8hMvUJKmrV2x0ZeIpMSCL8-l6Nz0xMoL-iKzhiG6sz-fN4FYlL1YcUgW4CI9hKAI8EoBS3chtCDIVzc7pZObNYdhsJm_-nzcPHdOLWempRRsVMm9C34w_tJf_Va__6E4g-hV3ws6Naz1Fgjg7N4GV_7gEqQdJ0AJOrC-e48v4PhwL-utOWnB_F6QZ414XVWNubogMw3136kWWlGsoH05v_uAil6LvS1wlPLexaaqahZz1tQ"  />
<div className="absolute bottom-3 left-3 z-20">
<p className="font-title-md text-white">Yaoundé</p>
<p className="text-[10px] text-tertiary uppercase">Political Heart</p>
</div>
</div>
</div>

<div className="flex-shrink-0 w-44 group">
<div className="h-56 w-full rounded-[20px] overflow-hidden relative mb-2">
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10 opacity-80"></div>
<img loading="lazy" decoding="async" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY7bnEQGM73Dkpn7xmT1cDhyxEtGaPHWXZE048YJwcIfMhmU3zPLbgi54cmzIYUYIk75xtAzxPCpUeCxQSzSzpGtNgUkX6S8qU9qmh3YhX4-nDtkGEz0rUdpn5l4CozWWxp_areNh70sbnVgH1gkpw1pReImD5D1uPHVskCIFDSH-Hw8kL2V9gYqr5ZIErxpgDYVchtHwardFaMbVI4LE7WXyNkI0A0zGTPj7TR-6NeDFiXsj3uJNR2OukA7R6N7a5wV1bBinqr7Q"  />
<div className="absolute bottom-3 left-3 z-20">
<p className="font-title-md text-white">Kribi</p>
<p className="text-[10px] text-secondary uppercase">Beach Paradise</p>
</div>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-2 gap-4 h-48">
<div className="glass-panel rounded-[24px] p-4 flex flex-col justify-end bg-primary-container/10">
<span className="material-symbols-outlined text-primary mb-2">verified_user</span>
<p className="text-xs font-bold leading-tight">Safety<br/>Guaranteed</p>
</div>
<div className="space-y-4">
<div className="glass-panel rounded-[24px] p-4 h-[calc(50%-8px)] flex items-center justify-between">
<p className="text-xs font-bold">Rewards</p>
<span className="material-symbols-outlined text-tertiary">redeem</span>
</div>
<div className="glass-panel rounded-[24px] p-4 h-[calc(50%-8px)] flex items-center justify-between">
<p className="text-xs font-bold">Help</p>
<span className="material-symbols-outlined text-secondary">support_agent</span>
</div>
</div>
</section>
</main>

<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] flex justify-around items-center py-3">

<a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] transition-all active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>home</span>
<span className="font-label-sm text-label-sm mt-1">Home</span>
</a>

<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm mt-1">Search</span>
</a>

<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">confirmation_number</span>
<span className="font-label-sm text-label-sm mt-1">Tickets</span>
</a>

<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">person</span>
<span className="font-label-sm text-label-sm mt-1">Profile</span>
</a>
</div>
</nav>
    </div>
  );
}
