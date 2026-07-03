'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAvailableTrips } from '@/hooks/useTrips';
import { useReservations } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/terminal-de-vente-caissier-opep
 */
export default function TerminalDeVenteCaissierOpepReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const { data: trips, isLoading: tripsLoading, error: tripsError, refetch: tripsRefetch } = useAvailableTrips();
  const { data: reservations, isLoading: resLoading } = useReservations();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"point_of_sale","label":"POS"},{"icon":"receipt_long","label":"Transactions"},{"icon":"inventory","label":"Stock"}];
  const bottom = [{"icon":"help","label":"Aide"},{"icon":"logout","label":"Déconnexion"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* SideNavBar (Simplified for Cashier) */}
  <Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={1}
  onNavChange={setActiveTab}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">point_of_sale</span></div>}
/>
{/* Main Canvas */}
<main className="ml-[280px] flex-1 h-screen flex flex-col relative overflow-hidden">
{/* TopNavBar */}
<header className="h-16 flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container/80 backdrop-blur-md border-b border-outline-variant/20 px-8">
<div className="flex items-center gap-lg">
<h2 className="font-title-md text-title-md font-semibold text-on-surface">Vente Directe</h2>
<div className="flex items-center gap-xs px-gutter h-10 glass-panel rounded-full border border-outline-variant/30 w-96">
<span className="material-symbols-outlined text-outline">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-md w-full placeholder:text-outline-variant" placeholder="Rechercher un trajet (ex: Yaoundé - Douala)" type="text"/>
</div>
</div>
<div className="flex items-center gap-gutter">
<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">translate</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors relative">
<span className="material-symbols-outlined text-on-surface-variant">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
</button>
<div className="flex items-center gap-sm pl-gutter border-l border-outline-variant/20">
<div className="text-right hidden md:block">
<p className="font-label-sm text-on-surface font-semibold">Samuel Eto'o</p>
<p className="text-[10px] text-primary uppercase font-bold tracking-tighter">Caissier Principal</p>
</div>
<div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA22OBDfNWottGgSAFbM6YR4PB0xbASi_dhXmDYWdbveT3fm9PcYkRbhDZXz5HoR0_ve0SZwwq473zgBY-NKX6xemA91QMoHCXxcpnv0Dc2VDBzn3r5AyDbYr3Z9JAWQCr7XqLkPrOTK7LKnu6SwUXc8ixk47fEh7LMhmmFgj7ON3HaaFR419BA5zd5U-GTaOZkMRewW8hmjhKyyWJ8E7_84RXR-COYFLHJ4xVC-8afanNUnNLNl4DOTgdCyAB9lWLAZLn8MM5s6Ik" alt="A professional studio portrait of a central African male cashier in a sharp corporate uniform, looking friendly and capable. The lighting is sophisticated with soft amber rim lights against a dark obsidian background, matching a premium fintech application aesthetic." />
</div>
</div>
</div>
</header>
{/* Dynamic Content Area */}
<div className="flex-1 overflow-y-auto p-8 bg-surface-dim">
<div className="grid grid-cols-12 gap-gutter max-w-7xl mx-auto">
{/* Left: Trip Selection & Seat Grid (Bento Style) */}
<div className="col-span-8 space-y-gutter">
{/* Trip Quick Cards */}
<div className="grid grid-cols-3 gap-sm">
<div className="glass-panel p-gutter rounded-xl inner-glow border-primary/30 cursor-pointer hover:bg-surface-container-high transition-all">
<div className="flex justify-between items-start mb-base">
<span className="bg-primary/10 text-primary px-xs py-[2px] rounded text-[10px] font-bold">VIP</span>
<span className="text-on-surface-variant text-[12px]">08:30</span>
</div>
<h3 className="font-title-md text-on-surface leading-tight">YDE <span className="text-primary">→</span> DLA</h3>
<p className="text-label-sm text-outline-variant mt-1">Bus B-402 • 12 Places Libres</p>
</div>
<div className="glass-panel p-gutter rounded-xl hover:bg-surface-container-high transition-all cursor-pointer">
<div className="flex justify-between items-start mb-base">
<span className="bg-outline-variant/20 text-on-surface-variant px-xs py-[2px] rounded text-[10px] font-bold">CLASSIQUE</span>
<span className="text-on-surface-variant text-[12px]">09:00</span>
</div>
<h3 className="font-title-md text-on-surface leading-tight">YDE <span className="text-primary">→</span> DLA</h3>
<p className="text-label-sm text-outline-variant mt-1">Bus C-201 • 45 Places Libres</p>
</div>
<div className="glass-panel p-gutter rounded-xl hover:bg-surface-container-high transition-all cursor-pointer">
<div className="flex justify-between items-start mb-base">
<span className="bg-primary/10 text-primary px-xs py-[2px] rounded text-[10px] font-bold">VIP</span>
<span className="text-on-surface-variant text-[12px]">10:30</span>
</div>
<h3 className="font-title-md text-on-surface leading-tight">YDE <span className="text-primary">→</span> KRI</h3>
<p className="text-label-sm text-outline-variant mt-1">Bus B-112 • 28 Places Libres</p>
</div>
</div>
{/* Seat Map Container */}
<section className="glass-panel rounded-2xl p-lg inner-glow ambient-glow-primary relative overflow-hidden">
{/* Atmospheric background shader */}

<div className="relative z-10">
<div className="flex justify-between items-center mb-lg">
<div>
<h2 className="font-title-md text-on-surface">Sélection des Sièges</h2>
<p className="text-body-md text-on-surface-variant">Bus VIP 2x1 Configuration</p>
</div>
<div className="flex gap-md">
<div className="flex items-center gap-xs">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-label-sm text-on-surface-variant">Sélectionné</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-3 h-3 rounded-full bg-surface-container-highest"></div>
<span className="text-label-sm text-on-surface-variant">Libre</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-3 h-3 rounded-full bg-outline-variant"></div>
<span className="text-label-sm text-on-surface-variant">Occupé</span>
</div>
</div>
</div>
{/* Bus Layout */}
<div className="flex justify-center py-xl">
<div className="bg-surface-container-low p-gutter rounded-[40px] border border-outline-variant/20 inline-flex flex-col gap-gutter">
{/* Cockpit */}
<div className="h-16 w-full bg-surface-container-highest rounded-t-[30px] flex items-center justify-center border-b border-outline-variant/30">
<span className="material-symbols-outlined text-outline-variant">steering_wheel_heat</span>
</div>
{/* Seats Grid */}
<div className="grid grid-cols-4 gap-gutter p-md">
{/* Row 1 */}
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">01</button>
<div className="w-12 h-12"></div> {/* Aisle */}
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">02</button>
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">03</button>
{/* Row 2 */}
<button className="w-12 h-12 seat-selected rounded-lg flex items-center justify-center font-bold text-label-sm shadow-[0_0_15px_rgba(121,216,183,0.3)]">04</button>
<div className="w-12 h-12"></div> {/* Aisle */}
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">05</button>
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">06</button>
{/* Row 3 */}
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">07</button>
<div className="w-12 h-12"></div> {/* Aisle */}
<button className="w-12 h-12 seat-occupied rounded-lg flex items-center justify-center font-bold text-label-sm">08</button>
<button className="w-12 h-12 seat-occupied rounded-lg flex items-center justify-center font-bold text-label-sm">09</button>
{/* Row 4 */}
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">10</button>
<div className="w-12 h-12"></div> {/* Aisle */}
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">11</button>
<button className="w-12 h-12 glass-panel rounded-lg flex items-center justify-center font-bold text-label-sm hover:border-primary transition-all">12</button>
</div>
</div>
</div>
</div>
</section>
</div>
{/* Right: Ticket Checkout & Payment */}
<aside className="col-span-4 space-y-gutter">
{/* Ticket Details */}
<div className="glass-panel rounded-2xl p-gutter inner-glow">
<div className="border-b border-outline-variant/20 pb-sm mb-sm flex justify-between items-center">
<h3 className="font-title-md text-on-surface">Résumé Ticket</h3>
<span className="material-symbols-outlined text-primary">confirmation_number</span>
</div>
<div className="space-y-md">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant">Passager</span>
<input className="bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-right text-body-md py-0" placeholder="Nom complet" type="text"/>
</div>
<div className="flex justify-between items-center">
<span className="text-on-surface-variant">Téléphone</span>
<input className="bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-right text-body-md py-0" placeholder="+237 ..." type="text"/>
</div>
<div className="pt-sm space-y-xs">
<div className="flex justify-between text-body-md">
<span className="text-on-surface-variant">Billet VIP (Siège 04)</span>
<span className="text-on-surface font-semibold">12 000 FCFA</span>
</div>
<div className="flex justify-between text-body-md">
<span className="text-on-surface-variant">Frais de service</span>
<span className="text-on-surface font-semibold">500 FCFA</span>
</div>
<div className="border-t border-dashed border-outline-variant/30 pt-sm mt-sm flex justify-between">
<span className="font-title-md text-on-surface">TOTAL</span>
<span className="font-headline-lg text-primary">12 500 FCFA</span>
</div>
</div>
</div>
</div>
{/* Payment Methods */}
<div className="glass-panel rounded-2xl p-gutter space-y-md">
<h3 className="text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">Méthode de Paiement</h3>
<div className="grid grid-cols-2 gap-sm">
<button className="flex flex-col items-center gap-xs p-sm rounded-xl border-2 border-primary bg-primary/10 transition-all">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>payments</span>
<span className="text-label-sm font-bold">Espèces</span>
</button>
<button className="flex flex-col items-center gap-xs p-sm rounded-xl border border-outline-variant/30 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-on-surface-variant">smartphone</span>
<span className="text-label-sm font-bold text-on-surface-variant">Momo / OM</span>
</button>
</div>
{/* Payment CTA */}
<button className="w-full h-14 bg-gradient-to-r from-primary-container to-[#00a884] text-on-primary-container font-bold rounded-xl flex items-center justify-center gap-sm group active:scale-95 transition-transform">
<span>Valider &amp; Imprimer</span>
<span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">print</span>
</button>
<p className="text-center text-[11px] text-outline-variant">
                            En validant, le siège 04 sera réservé pour le trajet Yaoundé - Douala (08:30).
                        </p>
</div>
{/* Recent Activity Mini List */}
<div className="p-gutter rounded-2xl space-y-sm">
<h4 className="text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">Dernières Ventes</h4>
<div className="space-y-xs">
<div className="flex items-center gap-sm p-xs hover:bg-surface-container/30 rounded-lg transition-colors">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-xs text-primary">check_circle</span>
</div>
<div className="flex-1">
<p className="text-label-sm text-on-surface font-semibold">N. Jean • Seat 12</p>
<p className="text-[10px] text-outline-variant">Il y a 3 mins • 8 000 FCFA</p>
</div>
</div>
<div className="flex items-center gap-sm p-xs hover:bg-surface-container/30 rounded-lg transition-colors opacity-60">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-xs text-primary">check_circle</span>
</div>
<div className="flex-1">
<p className="text-label-sm text-on-surface font-semibold">T. Marie • Seat 01</p>
<p className="text-[10px] text-outline-variant">Il y a 12 mins • 12 500 FCFA</p>
</div>
</div>
</div>
</div>
</aside>
</div>
</div>
</main>
{/* Interactive script for seat selection simulation */}
    </div>
  );
}
