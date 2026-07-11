'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useTrips, useAvailableTrips } from '@/hooks/useTrips';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/tableau-de-bord-agence-opep
 */
export default function TableauDeBordAgenceOpepReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const { data: trips, isLoading, error } = useAvailableTrips();
  
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"route","label":"Trips"},{"icon":"directions_bus","label":"Buses"},{"icon":"group","label":"Staff"},{"icon":"monitoring","label":"Analytics"}];
  const bottom = [{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* TopNavBar */}
<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container border-b border-charcoal-border h-16">
<div className="flex items-center gap-gutter">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
<div className="hidden md:flex ml-gutter relative w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="bg-surface-container-low border border-charcoal-border rounded-lg pl-10 pr-4 py-2 w-full focus:border-primary focus:ring-0 text-body-sm text-on-surface" placeholder="Search / Rechercher..." type="text"/>
</div>
</div>
<div className="flex items-center gap-gutter">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
<div className="w-10 h-10 rounded-full overflow-hidden border border-charcoal-border bg-surface-container-highest">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxGdzJ1zF_q3F-9rAjZe0h9AwYuf5KC0rnbuoDFINQsaoGj6fG5uv3L7GsB0hwhUkCjyReXhGdijcLl07EekqE8HubpCKMN850Dt_k-jA1v0AUlmIqKNYywxJPeHm8y7xn6oXf9V8Iu6HQKck2D39B2sMxxfZWg5jO-xr9cXv6pHuf1FbSxp8AM-REnqpx6Jsj9mqyxWG8hYnrw7Ua_1TbmZSRLQ8zova6vlhU_kTZPQx4kWZwodcIonWcFM9LKiZJtIi7AFV_7RM" alt="A professional headshot of a Cameroonian business executive, wearing a sharp charcoal suit in a high-fidelity modern office setting with glass partitions. Soft, cinematic lighting highlights the confidence and authority needed for an Agency Manager role in the OPEP logistics transport sector. The aesthetic is clean, premium, and focused." />
</div>
</div>
</header>
<div className="flex min-h-screen">
{/* SideNavBar */}
  <Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={0}
  onNavChange={(index: number) => setActiveTab(String(index))}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">bus_alert</span></div>}
  ctaButton={{ icon: "add", label: "New Trip / Nouveau Voyage", onClick: () => {} }}
/>
{/* Main Content */}
<main className="flex-1 md:ml-[280px] p-margin-desktop bg-background">
{/* Dashboard Header */}
<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-gutter">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Tableau de bord / Dashboard</h1>
<p className="text-on-surface-variant font-body-lg">Bienvenue, Admin. Voici l'état actuel de votre agence.</p>
</div>
<div className="flex items-center gap-unit">
<div className="bg-surface-container-high px-4 py-2 rounded-lg border border-charcoal-border flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
<span className="font-label-caps text-label-caps">24 Octobre 2023</span>
</div>
<button className="p-2 bg-surface-container-high border border-charcoal-border rounded-lg hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-on-surface">refresh</span>
</button>
</div>
</div>
{/* Bento Grid Stats */}
<div className="bento-grid mb-12">
{/* Revenue Card */}
<div className="col-span-12 md:col-span-4 bg-slate-surface border border-charcoal-border rounded-xl p-gutter flex flex-col justify-between overflow-hidden relative">
<div className="absolute -right-4 -top-4 opacity-10">
<span className="material-symbols-outlined text-[120px] text-primary">payments</span>
</div>
<div className="relative z-10">
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Daily Revenue / Chiffre d'affaires</p>
<h3 className="font-display-lg text-display-lg text-primary">{isLoading ? 'Chargement...' : '3 450 000 FCFA'}</h3>
<div className="flex items-center gap-1 text-success-green mt-2">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="font-label-caps text-label-caps">+12.5% vs yesterday</span>
</div>
</div>
<div className="mt-6 pt-4 border-t border-charcoal-border">
<button className="text-primary font-label-caps text-label-caps hover:underline">View Transactions / Voir les détails</button>
</div>
</div>
{/* Today's Trips */}
<div className="col-span-12 md:col-span-4 bg-slate-surface border border-charcoal-border rounded-xl p-gutter flex flex-col justify-between overflow-hidden relative">
<div className="absolute -right-4 -top-4 opacity-10">
<span className="material-symbols-outlined text-[120px] text-secondary">route</span>
</div>
<div className="relative z-10">
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Today's Trips / Voyages Aujourd'hui</p>
<h3 className="font-display-lg text-display-lg text-secondary">{isLoading ? '--' : trips?.length || 24}</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">{trips ? `${trips.filter(t => t.status === 'IN_PROGRESS').length} En route · ${trips.filter(t => t.status === 'SCHEDULED').length} À venir` : '8 En route · 4 Terminés · 12 À venir'}</p>
</div>
<div className="mt-6 pt-4 border-t border-charcoal-border">
<button className="text-secondary font-label-caps text-label-caps hover:underline">Schedule / Voir Planning</button>
</div>
</div>
{/* Occupancy Rate */}
<div className="col-span-12 md:col-span-4 bg-slate-surface border border-charcoal-border rounded-xl p-gutter flex flex-col justify-between overflow-hidden relative">
<div className="absolute -right-4 -top-4 opacity-10">
<span className="material-symbols-outlined text-[120px] text-tertiary">airline_seat_recline_normal</span>
</div>
<div className="relative z-10">
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Occupancy / Taux d'occupation</p>
<div className="flex items-end gap-2">
<h3 className="font-display-lg text-display-lg text-tertiary">84%</h3>
<span className="font-body-sm text-body-sm text-on-surface-variant mb-2">Average / Moyenne</span>
</div>
<div className="w-full bg-surface-container-high h-2 rounded-full mt-4 overflow-hidden">
<div className="h-full bg-tertiary" style={{"width":"84%"}}></div>
</div>
</div>
<div className="mt-6 pt-4 border-t border-charcoal-border">
<button className="text-tertiary font-label-caps text-label-caps hover:underline">Occupancy Analysis</button>
</div>
</div>
</div>
{/* Operational Overview Section */}
<div className="grid grid-cols-12 gap-gutter">
{/* Live Trips List */}
<div className="col-span-12 lg:col-span-8 space-y-4">
<div className="flex items-center justify-between mb-4">
<h2 className="font-title-md text-title-md text-on-surface">Current Trips / Voyages en cours</h2>
<a className="text-primary font-label-caps text-label-caps hover:underline flex items-center gap-1" href="#">
                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
{/* Trip Card 1 */}
<div className="bg-slate-surface border border-charcoal-border rounded-xl overflow-hidden group hover:border-primary transition-colors">
<div className="flex flex-col md:flex-row items-center p-4 gap-gutter">
<div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary">directions_bus</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2">
<span className="font-title-md text-title-md text-on-surface">Douala → Yaoundé</span>
<span className="px-2 py-0.5 bg-success-green/10 text-success-green text-[10px] font-bold rounded uppercase tracking-tighter">VIP Class</span>
</div>
<p className="text-body-sm text-on-surface-variant">Bus OPEP-042 · Chauffeur: Ngassa Pierre</p>
</div>
<div className="flex items-center gap-gutter text-right">
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant">Departure / Départ</p>
<p className="font-title-md text-title-md text-on-surface">14:30</p>
</div>
<div className="h-10 w-[1px] bg-charcoal-border"></div>
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant">Seats / Sièges</p>
<p className="font-title-md text-title-md text-on-surface">62/70</p>
</div>
</div>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-label-caps text-label-caps group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                Détails
                            </button>
</div>
</div>
{/* Trip Card 2 (Glass Accent) */}
<div className="glass border border-charcoal-border rounded-xl overflow-hidden group hover:border-tertiary transition-colors">
<div className="flex flex-col md:flex-row items-center p-4 gap-gutter">
<div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-tertiary">star</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2">
<span className="font-title-md text-title-md text-on-surface">Bafoussam → Douala</span>
<span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded uppercase tracking-tighter">Premium</span>
</div>
<p className="text-body-sm text-on-surface-variant">Bus OPEP-015 · Chauffeur: Kamdem J.</p>
</div>
<div className="flex items-center gap-gutter text-right">
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant">Departure / Départ</p>
<p className="font-title-md text-title-md text-on-surface">16:15</p>
</div>
<div className="h-10 w-[1px] bg-charcoal-border"></div>
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant">Seats / Sièges</p>
<p className="font-title-md text-title-md text-on-surface">32/32</p>
</div>
</div>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-label-caps text-label-caps group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                                Full / Complet
                            </button>
</div>
</div>
{/* Trip Card 3 */}
<div className="bg-slate-surface border border-charcoal-border rounded-xl overflow-hidden group hover:border-primary transition-colors">
<div className="flex flex-col md:flex-row items-center p-4 gap-gutter">
<div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary">directions_bus</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2">
<span className="font-title-md text-title-md text-on-surface">Yaoundé → Bertoua</span>
<span className="px-2 py-0.5 bg-secondary-container/10 text-secondary text-[10px] font-bold rounded uppercase tracking-tighter">Classic</span>
</div>
<p className="text-body-sm text-on-surface-variant">Bus OPEP-102 · Chauffeur: Atangana M.</p>
</div>
<div className="flex items-center gap-gutter text-right">
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant">Departure / Départ</p>
<p className="font-title-md text-title-md text-on-surface">17:00</p>
</div>
<div className="h-10 w-[1px] bg-charcoal-border"></div>
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant">Seats / Sièges</p>
<p className="font-title-md text-title-md text-on-surface">15/50</p>
</div>
</div>
<button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-label-caps text-label-caps group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                Booking / Réserver
                            </button>
</div>
</div>
</div>
{/* Summary Panel (Staff & Buses) */}
<div className="col-span-12 lg:col-span-4 space-y-gutter">
<div className="bg-surface-container-low border border-charcoal-border rounded-xl p-gutter">
<h2 className="font-title-md text-title-md text-on-surface mb-gutter">Resources / Ressources</h2>
{/* Staff Stat */}
<div className="flex items-center gap-gutter p-4 rounded-lg bg-surface-container mb-4">
<div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
<span className="material-symbols-outlined">group</span>
</div>
<div className="flex-1">
<p className="font-label-caps text-label-caps text-on-surface-variant">Active Staff / Personnel</p>
<p className="font-title-md text-title-md text-on-surface">42 Agents</p>
</div>
<span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
</div>
{/* Buses Stat */}
<div className="flex items-center gap-gutter p-4 rounded-lg bg-surface-container">
<div className="w-10 h-10 bg-secondary/20 text-secondary rounded-full flex items-center justify-center">
<span className="material-symbols-outlined">commute</span>
</div>
<div className="flex-1">
<p className="font-label-caps text-label-caps text-on-surface-variant">Active Fleet / Bus Actifs</p>
<p className="font-title-md text-title-md text-on-surface">18 Véhicules</p>
</div>
<span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
</div>
<div className="mt-gutter p-4 bg-primary-container/10 border border-primary/20 rounded-lg">
<div className="flex items-center gap-2 text-primary mb-2">
<span className="material-symbols-outlined text-sm">info</span>
<span className="font-label-caps text-label-caps font-bold">Alert: Maintenance / Entretien</span>
</div>
<p className="text-body-sm text-on-surface-variant">Bus OPEP-009 requires oil change in 48h.</p>
</div>
</div>
{/* Visual Data (Chart Placeholder) */}
<div className="bg-slate-surface border border-charcoal-border rounded-xl p-gutter h-[320px] relative overflow-hidden flex flex-col">
<div className="flex justify-between items-center mb-gutter">
<h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Weekly Sales / Ventes Semaine</h2>
<span className="material-symbols-outlined text-on-surface-variant">insights</span>
</div>
<div className="flex-1 flex items-end gap-2 pb-2">
<div className="flex-1 bg-primary/20 h-[40%] rounded-t-sm relative group cursor-pointer hover:bg-primary transition-all">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container px-2 py-1 rounded text-[10px] hidden group-hover:block">Mon</div>
</div>
<div className="flex-1 bg-primary/20 h-[65%] rounded-t-sm relative group cursor-pointer hover:bg-primary transition-all">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container px-2 py-1 rounded text-[10px] hidden group-hover:block">Tue</div>
</div>
<div className="flex-1 bg-primary/20 h-[50%] rounded-t-sm relative group cursor-pointer hover:bg-primary transition-all">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container px-2 py-1 rounded text-[10px] hidden group-hover:block">Wed</div>
</div>
<div className="flex-1 bg-primary/40 h-[85%] rounded-t-sm relative group cursor-pointer hover:bg-primary transition-all border-t-2 border-primary">
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-2 py-1 rounded text-[10px] font-bold">Today</div>
</div>
<div className="flex-1 bg-surface-container-high h-[10%] rounded-t-sm"></div>
<div className="flex-1 bg-surface-container-high h-[10%] rounded-t-sm"></div>
<div className="flex-1 bg-surface-container-high h-[10%] rounded-t-sm"></div>
</div>
<div className="pt-4 border-t border-charcoal-border flex justify-between text-[10px] text-on-surface-variant font-label-caps">
<span>LUN</span>
<span>MAR</span>
<span>MER</span>
<span>JEU</span>
<span>VEN</span>
<span>SAM</span>
<span>DIM</span>
</div>
</div>
</div>
</div>
{/* New Trip Modal Trigger (Floating for Mobile) */}
<button className="fixed bottom-margin-mobile right-margin-mobile md:hidden w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50">
<span className="material-symbols-outlined">add</span>
</button>
</main>
</div>
{/* Background Decoration (Glassmorphic Orbs) */}
<div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary opacity-[0.03] blur-[120px] rounded-full pointer-events-none -z-10"></div>
<div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary opacity-[0.02] blur-[100px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
}
