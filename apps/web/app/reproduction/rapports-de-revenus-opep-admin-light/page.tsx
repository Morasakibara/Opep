'use client';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTrips } from '@/hooks/useTrips';
import { useRoutes } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/rapports-de-revenus-opep-admin-light
 */
export default function RapportsDeRevenusOpepAdminLightReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const { data: trips, isLoading: tripsLoading, error: tripsError, refetch: tripsRefetch } = useTrips();
  const { data: routes, isLoading: routesLoading, error: routesError, refetch: routesRefetch } = useRoutes();
  
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"assessment","label":"Reports"},{"icon":"receipt","label":"Revenue"},{"icon":"analytics","label":"Analytics"}];
  const bottom = [{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
  <Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={2}
  onNavChange={(index: number) => setActiveTab(String(index))}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">finance</span></div>}
/>

<main className="ml-[280px] min-h-screen">
{(tripsError || routesError) && (
  <div className="mx-6 mt-4">
    <ErrorState title="Erreur de connexion" message={String(tripsError?.message || routesError?.message || '')} onRetry={() => { tripsRefetch(); routesRefetch() }} />
  </div>
)}

<header className="h-16 flex justify-between items-center px-margin-desktop sticky top-0 z-40 bg-surface-container border-b border-charcoal-border">
<div className="flex items-center gap-4">
<h2 className="font-headline-lg text-primary text-2xl font-bold">Analytics Overview</h2>
<div className="h-6 w-[1px] bg-outline-variant"></div>
<nav className="flex gap-6">
<a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-lg" href="#">Financials</a>
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg" href="#">Routes</a>
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg" href="#">Fleet</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant">
<span className="material-symbols-outlined text-on-surface-variant text-lg mr-2">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-48" placeholder="Search reports..." type="text"/>
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors relative">
                        notifications
                        <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">settings</span>
<div className="w-8 h-8 rounded-full overflow-hidden border border-primary">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a Cameroonian business manager wearing a sharp suit, set against a blurred modern office background with soft daylight, capturing a confident and approachable executive presence." src="https://lh3.googleusercontent.com/aida-public/AB6AXuACsB1FJVSKNZTT7w7KcHxh10qjV430StRO5SFjKdJcl1ziD1PG88Kh066-_ADgSMc9Uf1DSMcJ2bgjmgMH3bdzsqE1y_JVJGAGX9g0SJ2tJ3Vegov0JJuhRAHUTWzwl8XLWDpspv955COg0PXUPzzTLbELrXQJxAX7BFRMxbf5nlAAx0ZOe0BDgmNFIY9bsNtnSVgPxEAFI5Ogkn1kbQpeonnSgM35FmNnmaxsiVY_ghY5MJJ_RYNUMalywFgnOAwroKXym8T-m6U"/>
</div>
</div>
</div>
</header>
<div className="p-margin-desktop space-y-gutter">

<section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="space-y-1">
<p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date Range</p>
<div className="flex items-center gap-3">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">calendar_today</span>
<input className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-primary focus:border-primary" type="date" value="2023-10-01"/>
</div>
<span className="text-on-surface-variant">to</span>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">calendar_today</span>
<input className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-primary focus:border-primary" type="date" value="2023-10-31"/>
</div>
</div>
</div>
<div className="h-10 w-[1px] bg-outline-variant mx-4"></div>
<div className="space-y-1">
<p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Agency Branch</p>
<select className="bg-surface border border-outline-variant rounded-lg text-sm py-2 px-4 focus:ring-primary focus:border-primary min-w-[180px]">
<option>All Douala Branches</option>
<option>Yaoundé Central</option>
<option>Bafoussam Express</option>
</select>
</div>
</div>
<div className="flex gap-2">
<button className="px-4 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-lg">file_download</span>
                        Export PDF
                    </button>
<button className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-opacity">
                        Apply Filters
                    </button>
</div>
</section>

<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>payments</span>
</div>
<p className="text-sm font-medium text-on-surface-variant mb-1">Total Revenue</p>
<h3 className="font-headline-md text-primary text-2xl">42,850,000 FCFA</h3>
<div className="mt-4 flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-sm">arrow_upward</span>
<span className="text-xs font-bold">12.5% vs last month</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-tertiary" style={{"fontVariationSettings":"'FILL' 1"}}>confirmation_number</span>
</div>
<p className="text-sm font-medium text-on-surface-variant mb-1">Average Ticket Price</p>
<h3 className="font-headline-md text-on-surface text-2xl">7,500 FCFA</h3>
<div className="mt-4 flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-sm">horizontal_rule</span>
<span className="text-xs font-bold">Stable</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>event_seat</span>
</div>
<p className="text-sm font-medium text-on-surface-variant mb-1">Occupancy Rate</p>
<h3 className="font-headline-md text-on-surface text-2xl">84.2%</h3>
<div className="mt-4 flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-sm">arrow_upward</span>
<span className="text-xs font-bold">3.1% increase</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>assignment_return</span>
</div>
<p className="text-sm font-medium text-on-surface-variant mb-1">Refunds Issued</p>
<h3 className="font-headline-md text-secondary text-2xl">1,240,500 FCFA</h3>
<div className="mt-4 flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-sm">arrow_downward</span>
<span className="text-xs font-bold">5% improvement</span>
</div>
</div>
</div>

<div className="bento-grid">

<div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant">
<div className="flex justify-between items-center mb-10">
<div>
<h4 className="font-title-lg text-on-surface">Revenue per Route</h4>
<p className="text-sm text-on-surface-variant">Top performing inter-city connections</p>
</div>
<div className="flex gap-2">
<span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-primary-fixed text-on-primary-fixed rounded">VIP</span>
<span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded">Classic</span>
</div>
</div>
<div className="space-y-6">

<div className="relative h-[300px] w-full flex items-end gap-6 px-4">

<div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 border-b border-outline">
<div className="w-full border-t border-outline"></div>
<div className="w-full border-t border-outline"></div>
<div className="w-full border-t border-outline"></div>
<div className="w-full border-t border-outline"></div>
</div>

<div className="flex-1 flex flex-col items-center gap-3 z-10">
<div className="w-full flex justify-center gap-1 items-end">
<div className="w-8 bg-primary rounded-t-sm transition-all hover:brightness-110" style={{"height":"240px"}}></div>
<div className="w-8 bg-primary-container rounded-t-sm transition-all hover:brightness-110" style={{"height":"180px"}}></div>
</div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase text-center">DLA - YDE</p>
</div>

<div className="flex-1 flex flex-col items-center gap-3 z-10">
<div className="w-full flex justify-center gap-1 items-end">
<div className="w-8 bg-primary rounded-t-sm transition-all hover:brightness-110" style={{"height":"160px"}}></div>
<div className="w-8 bg-primary-container rounded-t-sm transition-all hover:brightness-110" style={{"height":"120px"}}></div>
</div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase text-center">DLA - BAF</p>
</div>

<div className="flex-1 flex flex-col items-center gap-3 z-10">
<div className="w-full flex justify-center gap-1 items-end">
<div className="w-8 bg-primary rounded-t-sm transition-all hover:brightness-110" style={{"height":"190px"}}></div>
<div className="w-8 bg-primary-container rounded-t-sm transition-all hover:brightness-110" style={{"height":"90px"}}></div>
</div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase text-center">YDE - BDA</p>
</div>

<div className="flex-1 flex flex-col items-center gap-3 z-10">
<div className="w-full flex justify-center gap-1 items-end">
<div className="w-8 bg-primary rounded-t-sm transition-all hover:brightness-110" style={{"height":"210px"}}></div>
<div className="w-8 bg-primary-container rounded-t-sm transition-all hover:brightness-110" style={{"height":"150px"}}></div>
</div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase text-center">DLA - KRI</p>
</div>

<div className="flex-1 flex flex-col items-center gap-3 z-10">
<div className="w-full flex justify-center gap-1 items-end">
<div className="w-8 bg-primary rounded-t-sm transition-all hover:brightness-110" style={{"height":"110px"}}></div>
<div className="w-8 bg-primary-container rounded-t-sm transition-all hover:brightness-110" style={{"height":"70px"}}></div>
</div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase text-center">NGA - GAR</p>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant flex flex-col">
<div className="flex justify-between items-start mb-6">
<h4 className="font-title-lg text-on-surface">Live Sales</h4>
<button className="text-primary text-xs font-bold hover:underline">View All</button>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">

<div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">person</span>
</div>
<div>
<p className="text-sm font-bold">M. Atangana</p>
<p className="text-[10px] text-on-surface-variant">2 mins ago • Douala VIP</p>
</div>
</div>
<div className="text-right">
<p className="text-sm font-bold text-primary">+8,500</p>
<span className="text-[10px] px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-bold">SUCCESS</span>
</div>
</div>

<div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors border-l-4 border-secondary">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">undo</span>
</div>
<div>
<p className="text-sm font-bold">S. Ngo</p>
<p className="text-[10px] text-on-surface-variant">15 mins ago • Yaoundé Classic</p>
</div>
</div>
<div className="text-right">
<p className="text-sm font-bold text-secondary">-5,000</p>
<span className="text-[10px] px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full font-bold">REFUNDED</span>
</div>
</div>

<div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined">pending_actions</span>
</div>
<div>
<p className="text-sm font-bold">Corporate Booking</p>
<p className="text-[10px] text-on-surface-variant">45 mins ago • Bafoussam</p>
</div>
</div>
<div className="text-right">
<p className="text-sm font-bold text-tertiary">+124,000</p>
<span className="text-[10px] px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full font-bold">PENDING</span>
</div>
</div>

<div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">person</span>
</div>
<div>
<p className="text-sm font-bold">D. Abena</p>
<p className="text-[10px] text-on-surface-variant">1 hour ago • Kribi Express</p>
</div>
</div>
<div className="text-right">
<p className="text-sm font-bold text-primary">+6,000</p>
<span className="text-[10px] px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-bold">SUCCESS</span>
</div>
</div>
</div>
</div>
</div>

<section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="md:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
<div className="p-6 border-b border-outline-variant flex justify-between items-center">
<div>
<h4 className="font-title-lg text-on-surface">Regional Demand Heatmap</h4>
<p className="text-sm text-on-surface-variant">Passenger concentration across Cameroon</p>
</div>
<div className="flex gap-4 items-center">
<div className="flex items-center gap-1">
<span className="w-3 h-3 bg-primary rounded-full"></span>
<span className="text-xs">High</span>
</div>
<div className="flex items-center gap-1">
<span className="w-3 h-3 bg-primary-container rounded-full opacity-50"></span>
<span className="text-xs">Medium</span>
</div>
</div>
</div>
<div className="h-[400px] relative bg-surface-container-low flex items-center justify-center overflow-hidden">
<div className="bg-cover bg-center w-full h-full opacity-40" data-alt="A clean and detailed illustrative map of Cameroon featuring stylized topographic details and major city labels like Douala, Yaoundé, and Garoua. The map uses a sophisticated light-mode palette of soft greens, creams, and earthy tones with elegant typography, depicting transportation hubs and regional flow lines in the primary brand green." style={{}}></div>

<div className="absolute top-[60%] left-[30%] w-8 h-8 bg-primary rounded-full animate-ping opacity-40"></div>
<div className="absolute top-[60%] left-[30%] w-4 h-4 bg-primary rounded-full"></div>
<div className="absolute top-[55%] left-[55%] w-10 h-10 bg-primary-container rounded-full animate-ping opacity-30"></div>
<div className="absolute top-[55%] left-[55%] w-5 h-5 bg-primary-container rounded-full"></div>
<div className="absolute top-[20%] left-[65%] w-6 h-6 bg-tertiary rounded-full animate-ping opacity-30"></div>
<div className="absolute top-[20%] left-[65%] w-3 h-3 bg-tertiary rounded-full"></div>
</div>
</div>
<div className="bg-primary text-white p-8 rounded-xl flex flex-col justify-between relative overflow-hidden">

<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
<div>
<span className="material-symbols-outlined text-4xl mb-4" style={{"fontVariationSettings":"'FILL' 1"}}>stars</span>
<h4 className="font-headline-md mb-2">Agency Performance</h4>
<p className="text-on-primary/80 text-sm mb-6">Douala Central has outperformed all other agencies for the 3rd consecutive week.</p>
</div>
<div className="space-y-4">
<div className="flex justify-between items-end">
<span className="text-sm font-bold">Goal Achievement</span>
<span className="text-2xl font-headline-md">94%</span>
</div>
<div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{"width":"94%"}}></div>
</div>
<p className="text-xs text-on-primary/60 italic">Next review cycle starts in 4 days.</p>
</div>
<button className="mt-8 w-full py-3 bg-white text-primary rounded-lg font-bold hover:bg-opacity-90 transition-all active:scale-95">
                        Download Detailed Agency Audit
                    </button>
</div>
</section>
</div>
</main>

<button className="fixed bottom-margin-desktop right-margin-desktop w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'wght' 600"}}>add</span>
</button>
    </div>
  );
}
