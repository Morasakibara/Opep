'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useAvailableTrips } from '@/hooks/useTrips';

/**
undefined
 * Route: /reproduction/selection-des-sieges-opep
 */
export default function SelectionDesSiegesOpepReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* TopNavBar (Shared Component Identity) */}
<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-charcoal-border">
<div className="flex items-center gap-4">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
</div>
<div className="hidden md:flex flex-1 max-w-md mx-8">
<div className="w-full relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg pl-10 pr-4 py-2 focus:border-primary focus:ring-0 transition-all text-body-sm" placeholder="Search trips, agencies..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-4 text-on-surface-variant">
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">settings</span>
</div>
<div className="w-8 h-8 rounded-full overflow-hidden border border-charcoal-border">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2DXrfufxNgn6DVN4AyEE_mo5qTpr-iF3rd_zVWztBIytdqboH1f2QikuB2l9sk1i-eAvUJyqsgfmrxiE2gUxQkwlgvTtZea7Ov5Elp7UKA--WeE2WDBpiogwECoDSd_6la3211A6eAgYeicrFPlKinfCbAEGlwdZ2hJ2tLyPgPLTIkfk6leDsA07sX5NnVg2kc_xZRDPKsnaR_5DzsGcpWbe6QCWClJ5b4jOXJXk4LA-OmwfCwd5t0wH9SXjT_vDsgEZMYfDvyN4" alt="A professional headshot of a Cameroonian female logistics manager in a modern office environment. She has a confident smile and wears professional business attire. The background features blurred digital screens displaying transit maps and logistics data in a dark mode theme with emerald green accents." />
</div>
</div>
</header>
<div className="flex flex-1">
{/* SideNavBar (Shared Component Logic) */}
<aside className="hidden md:flex flex-col h-[calc(100vh-64px)] w-[280px] p-gutter gap-unit border-r border-charcoal-border bg-surface-dim sticky top-16">
<nav className="flex-1 flex flex-col gap-2">
<div className="flex items-center gap-3 p-3 bg-primary-container text-on-primary-container rounded-lg transition-transform duration-200 active:scale-95 cursor-pointer">
<span className="material-symbols-outlined">route</span>
<span className="font-label-caps text-label-caps">Trips</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-caps text-label-caps">Dashboard</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="font-label-caps text-label-caps">Agencies</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined">directions_bus</span>
<span className="font-label-caps text-label-caps">Buses</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined">group</span>
<span className="font-label-caps text-label-caps">Staff</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined">monitoring</span>
<span className="font-label-caps text-label-caps">Analytics</span>
</div>
</nav>
<button className="mt-auto flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-lg font-bold transition-all active:scale-95">
<span className="material-symbols-outlined">add</span>
<span className="font-label-caps text-label-caps">New Trip</span>
</button>
<div className="mt-6 pt-6 border-t border-charcoal-border flex flex-col gap-2">
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined">help</span>
<span className="font-label-caps text-label-caps">Help Center</span>
</div>
<div className="flex items-center gap-3 p-3 text-secondary hover:bg-secondary-container/20 rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined">logout</span>
<span className="font-label-caps text-label-caps">Logout</span>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 p-margin-desktop flex flex-col lg:flex-row gap-gutter">
{/* Left: Seat Selector Panel */}
<div className="flex-1 glass-panel rounded-xl p-8 flex flex-col items-center">
<div className="w-full flex justify-between items-center mb-10">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Sélection du Siège</h1>
<p className="text-on-surface-variant font-body-sm">Veuillez choisir vos places préférées pour le voyage.</p>
</div>
{/* Legend */}
<div className="flex gap-6">
<div className="flex items-center gap-2">
<div className="status-dot border border-charcoal-border"></div>
<span className="text-label-caps font-label-caps">Libre</span>
</div>
<div className="flex items-center gap-2">
<div className="status-dot bg-success-green"></div>
<span className="text-label-caps font-label-caps">Choisi</span>
</div>
<div className="flex items-center gap-2">
<div className="relative status-dot bg-surface-container-highest"></div>
<span className="text-label-caps font-label-caps">Occupé</span>
</div>
</div>
</div>
{/* Bus Layout */}
<div className="bg-surface-container-low rounded-[48px] p-8 border border-charcoal-border relative">
{/* Steering Wheel / Bus Driver Indicator */}
<div className="bus-front border border-charcoal-border/50">
<div className="w-10 h-10 border-2 border-outline-variant rounded-full flex items-center justify-center opacity-30 mb-2">
<span className="material-symbols-outlined">radio_button_checked</span>
</div>
<span className="text-label-caps font-label-caps opacity-40">AVANT DU BUS</span>
</div>
{/* Seat Map */}
<div className="seat-grid-container" id="seat-grid">
{/* Seats will be generated via JS for interactive state demo */}
</div>
<div className="mt-8 pt-8 border-t border-charcoal-border flex justify-center">
<span className="text-label-caps font-label-caps opacity-40">ARRIÈRE DU BUS</span>
</div>
</div>
</div>
{/* Right: Booking Summary */}
<div className="w-full lg:w-[400px] flex flex-col gap-gutter">
{/* Trip Details Card */}
<div className="glass-panel rounded-xl p-6 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
<div className="flex justify-between items-start mb-6">
<div>
<span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">Premium Class</span>
<h2 className="font-title-md text-title-md text-primary">DLA → YDE</h2>
</div>
<Image fill className="h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKQJizx9KU2IR7CqAGj86R_k7l_gGk9qJO3Scn-DuS8WazhLXNwugiuyrMLK9N70ZafvECkhz64zezAOPGfF6_1cIFOTsOnX_tqCZ8TO7Kf2NIGfzR8zkDEcBh1PpBOXNxJJxaDoOQfOT5AlrzEzloWgTdfLhsN6gohaZSmd_1_-p85MS6Z1q_92KrqCkdnrER6Alx9h8DK2rs9FveYWm8gilcZxaaLUJ5CgjKOHE7xcPSZGXsqAebAN72QLGCC6OhAz4Z01WpYjQ" alt="A minimalist logo for a transport agency called Finexs Voyages. The logo features abstract green and yellow swooshes representing speed and motion on a clean dark slate background. High contrast, vector style, sleek professional branding." />
</div>
<div className="space-y-4 mb-8">
<div className="flex items-center gap-4">
<div className="flex flex-col items-center">
<span className="material-symbols-outlined text-primary">radio_button_checked</span>
<div className="w-0.5 h-10 bg-charcoal-border"></div>
<span className="material-symbols-outlined text-secondary">location_on</span>
</div>
<div className="flex flex-col gap-6">
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">DEPARTURE • 08:30 AM</p>
<p className="font-body-lg text-body-lg">Douala, Agence Akwa</p>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">ARRIVAL • 12:15 PM</p>
<p className="font-body-lg text-body-lg">Yaoundé, Mvan Terminal</p>
</div>
</div>
</div>
</div>
<div className="border-t border-charcoal-border pt-6">
<p className="text-label-caps font-label-caps text-on-surface-variant mb-4">SIÈGES SÉLECTIONNÉS / SELECTED SEATS</p>
<div className="flex flex-wrap gap-2" id="selected-seats-list">
<p className="text-body-sm text-outline italic">Aucun siège sélectionné</p>
</div>
</div>
</div>
{/* Price & Checkout Card */}
<div className="glass-panel rounded-xl p-6">
<div className="flex justify-between items-center mb-6">
<span className="text-on-surface-variant">Prix Total / Total Price</span>
<div className="text-right">
<p className="text-headline-lg text-headline-lg font-bold text-white" id="total-price">0 FCFA</p>
<p className="text-[10px] text-on-surface-variant italic">XAF equivalent inclusive of taxes</p>
</div>
</div>
<div className="space-y-3">
<button className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold transition-all active:scale-[0.98] hover:bg-success-green flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed" disabled id="confirm-btn">
<span>CONFIRMER LA SÉLECTION</span>
<span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
<button className="w-full bg-transparent border border-charcoal-border text-on-surface-variant py-3 rounded-xl text-label-caps font-label-caps hover:bg-white/5 transition-all">
                            ANNULER / CANCEL
                        </button>
</div>
</div>
{/* Cameroon Pride Accent */}
<div className="flex items-center justify-center gap-1 opacity-40">
<div className="w-4 h-2 bg-success-green rounded-sm"></div>
<div className="w-4 h-2 bg-secondary rounded-sm"></div>
<div className="w-4 h-2 bg-tertiary rounded-sm"></div>
<span className="text-[10px] font-label-caps ml-2 tracking-widest">FIÈREMENT CAMEROUNAIS</span>
</div>
</div>
</main>
</div>
{/* Background Animation Layer */}
<div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">

</div>
    </div>
  );
}
