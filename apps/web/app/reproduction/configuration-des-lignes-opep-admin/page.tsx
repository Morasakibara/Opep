'use client';

import React, { useState } from 'react';
import { useRoutes, useCreateRoute } from '@/hooks/useEntities';
import { Modal,  Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/configuration-des-lignes-opep-admin
 */
export default function ConfigurationDesLignesOpepAdminReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showRouteModal, setRouteModal] = useState(false);
  const { data: routes, isLoading } = useRoutes();
  const createRoute = useCreateRoute();
    const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"route","label":"Routes"},{"icon":"directions_bus","label":"Buses"},{"icon":"settings","label":"Settings"}];
  const bottom = [{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
            <Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={2}
  onNavChange={setActiveTab}
  ctaButton={{ icon: "add_circle", label: "New Trip", onClick: () => {} }}
/>

<header className="flex justify-between items-center px-container-padding md:px-margin-desktop w-full h-16 sticky top-0 z-40 bg-surface-container border-b border-charcoal-border md:ml-[280px] md:w-[calc(100%-280px)]">
<div className="flex items-center gap-md">
<div className="md:hidden flex items-center gap-xs">
<span className="material-symbols-outlined text-primary">menu</span>
</div>
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-lg">search</span>
<input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-body-md w-64 focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant transition-all" placeholder="Search routes..." type="text"/>
</div>
</div>
<div className="flex items-center gap-gutter">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">translate</span>
<div className="relative">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full border-2 border-surface-container"></span>
</div>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
<div className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant overflow-hidden cursor-pointer">
<img className="w-full h-full object-cover" data-alt="Close up portrait of a professional African man in his late 40s wearing a clean white shirt, smiling confidently. He is the Super Admin for OPEP, looking authoritative but approachable. The background is a soft-focus office setting with warm architectural lighting and emerald green accents to match the portal theme." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdIQrZpAPysSVRF-3N6jA_tsXMOklADuR136E9Vn4R68h82RSQzoccFCbxsQhuz8fzobqm82CpJwO_Dbz1-8NVfcQy1hGDeqr5UoMktN3hrStGK5HUiIuODTbNdHFRJL2kiGUJZEinBA32AwqpIrQWb41GpsqWoUq_PEVw9XwrFQO52MVFnFp6q9TGPKRLfVUTyGgvKACoHvHVI7MWZb1xTuMB4BhzIDs-RCzUh4hXHB9buH_1C9yy2CTIvrv2b8Yyn0WM7HmFl4o"/>
</div>
</div>
</header>

<main className="md:ml-[280px] p-container-padding md:p-margin-desktop space-y-lg">

<section className="relative h-48 rounded-3xl overflow-hidden glass-panel flex items-end p-lg">

<div className="relative z-10">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-primary">Route Configuration</h2>
<p className="text-on-surface-variant max-w-md mt-base">Establish and optimize inter-city travel connections across Cameroon with real-time price and status tracking.</p>
</div>
</section>

<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div className="glass-panel p-gutter rounded-2xl flex flex-col justify-between h-32">
<span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Total Routes</span>
<div className="flex items-end justify-between">
<span className="text-display-lg font-bold text-on-surface leading-none">24</span>
<div className="flex items-center text-primary text-label-sm font-bold bg-primary/10 px-2 py-0.5 rounded-full">
<span className="material-symbols-outlined text-[14px]">trending_up</span>
                        +2
                    </div>
</div>
</div>
<div className="glass-panel p-gutter rounded-2xl flex flex-col justify-between h-32 border-l-2 border-primary">
<span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Active Status</span>
<div className="flex items-end justify-between">
<span className="text-display-lg font-bold text-on-surface leading-none">18</span>
<span className="text-label-sm text-primary uppercase">75% Capacity</span>
</div>
</div>
<div className="glass-panel p-gutter rounded-2xl flex flex-col justify-between h-32">
<span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Avg. FCFA/km</span>
<div className="flex items-end justify-between">
<span className="text-display-lg font-bold text-on-surface leading-none">85</span>
<span className="text-label-sm text-on-surface-variant">Market Rate</span>
</div>
</div>
<div className="glass-panel p-gutter rounded-2xl flex flex-col justify-between h-32">
<span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Operational Load</span>
<div className="flex items-end justify-between">
<span className="text-display-lg font-bold text-tertiary leading-none">High</span>
<span className="material-symbols-outlined text-tertiary">bolt</span>
</div>
</div>
</div>

<div className="glass-panel rounded-3xl overflow-hidden">
<div className="p-gutter md:px-lg md:py-md flex justify-between items-center border-b border-charcoal-border">
<h3 className="font-title-md text-on-surface">Active Inter-city Routes</h3>
<div className="flex items-center gap-xs">
<button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined">filter_list</span>
</button>
<button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined">download</span>
</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="text-label-sm text-on-surface-variant uppercase tracking-widest bg-surface-container-low">
<th className="px-gutter py-md font-medium">Route Path</th>
<th className="px-gutter py-md font-medium">Distance</th>
<th className="px-gutter py-md font-medium">Est. Duration</th>
<th className="px-gutter py-md font-medium">Base Price</th>
<th className="px-gutter py-md font-medium">Status</th>
<th className="px-gutter py-md font-medium text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">

<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-gutter py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[18px]">multiple_stop</span>
</div>
<div>
<p className="font-bold text-on-surface">Douala → Yaoundé</p>
<p className="text-[12px] text-on-surface-variant">N3 National Highway</p>
</div>
</div>
</td>
<td className="px-gutter py-md text-on-surface">245.5 km</td>
<td className="px-gutter py-md text-on-surface">4h 30m</td>
<td className="px-gutter py-md font-bold text-primary">6,000 FCFA</td>
<td className="px-gutter py-md">
<span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">Active</span>
</td>
<td className="px-gutter py-md text-right">
<div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="p-2 hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]">block</span></button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-gutter py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[18px]">multiple_stop</span>
</div>
<div>
<p className="font-bold text-on-surface">Bafoussam → Douala</p>
<p className="text-[12px] text-on-surface-variant">N5 National Highway</p>
</div>
</div>
</td>
<td className="px-gutter py-md text-on-surface">265.2 km</td>
<td className="px-gutter py-md text-on-surface">5h 15m</td>
<td className="px-gutter py-md font-bold text-primary">7,500 FCFA</td>
<td className="px-gutter py-md">
<span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">Active</span>
</td>
<td className="px-gutter py-md text-right">
<div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="p-2 hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]">block</span></button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-gutter py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">multiple_stop</span>
</div>
<div>
<p className="font-bold text-on-surface-variant">Garoua → Maroua</p>
<p className="text-[12px] text-on-surface-variant">N1 North Connector</p>
</div>
</div>
</td>
<td className="px-gutter py-md text-on-surface-variant">210.0 km</td>
<td className="px-gutter py-md text-on-surface-variant">3h 45m</td>
<td className="px-gutter py-md font-bold text-on-surface-variant">5,000 FCFA</td>
<td className="px-gutter py-md">
<span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant">Inactive</span>
</td>
<td className="px-gutter py-md text-right">
<div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">check_circle</span></button>
<button className="p-2 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-gutter py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[18px]">multiple_stop</span>
</div>
<div>
<p className="font-bold text-on-surface">Kribi → Yaoundé</p>
<p className="text-[12px] text-on-surface-variant">Coastal Expressway</p>
</div>
</div>
</td>
<td className="px-gutter py-md text-on-surface">288.0 km</td>
<td className="px-gutter py-md text-on-surface">4h 00m</td>
<td className="px-gutter py-md font-bold text-primary">8,000 FCFA</td>
<td className="px-gutter py-md">
<span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">Active</span>
</td>
<td className="px-gutter py-md text-right">
<div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="p-2 hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]">block</span></button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-gutter border-t border-charcoal-border flex justify-between items-center bg-surface-container-low">
<span className="text-label-sm text-on-surface-variant">{isLoading ? 'Chargement...' : routes ? `Showing ${routes.length} routes` : 'Showing 4 of 24 routes'}</span>
<div className="flex gap-xs">
<button className="px-3 py-1 glass-panel rounded-lg text-label-sm hover:text-primary">Previous</button>
<button className="px-3 py-1 glass-panel rounded-lg text-label-sm hover:text-primary">Next</button>
</div>
</div>
</div>
</main>

      <Modal isOpen={showRouteModal} onClose={() => setRouteModal(false)} title="Establish New Route" description="Configure operational parameters for a new inter-city connection." wide>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div className="space-y-base col-span-1">
<label className="text-label-sm text-on-surface-variant uppercase ml-1">Departure City</label>
<select className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm focus:ring-1 focus:ring-primary focus:border-primary text-on-surface">
<option>Douala</option>
<option>Yaoundé</option>
<option>Bafoussam</option>
<option>Garoua</option>
<option>Bamenda</option>
</select>
</div>
<div className="space-y-base col-span-1">
<label className="text-label-sm text-on-surface-variant uppercase ml-1">Arrival City</label>
<select className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm focus:ring-1 focus:ring-primary focus:border-primary text-on-surface">
<option>Yaoundé</option>
<option>Douala</option>
<option>Bertoua</option>
<option>Ngaoundéré</option>
<option>Maroua</option>
</select>
</div>
<div className="space-y-base col-span-1">
<label className="text-label-sm text-on-surface-variant uppercase ml-1">Distance (KM)</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm focus:ring-1 focus:ring-primary focus:border-primary text-on-surface placeholder:text-surface-variant" placeholder="e.g. 250" type="number"/>
</div>
<div className="space-y-base col-span-1">
<label className="text-label-sm text-on-surface-variant uppercase ml-1">Est. Duration (Min)</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm focus:ring-1 focus:ring-primary focus:border-primary text-on-surface placeholder:text-surface-variant" placeholder="e.g. 240" type="number"/>
</div>
<div className="space-y-base col-span-1">
<label className="text-label-sm text-on-surface-variant uppercase ml-1">Base Price (FCFA)</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm focus:ring-1 focus:ring-primary focus:border-primary text-on-surface placeholder:text-surface-variant font-bold text-primary" placeholder="e.g. 5000" type="number"/>
</div>
<div className="space-y-base col-span-1">
<label className="text-label-sm text-on-surface-variant uppercase ml-1">Operational Status</label>
<div className="flex items-center gap-md h-12">
<label className="flex items-center gap-xs cursor-pointer">
<input checked className="text-primary focus:ring-primary bg-surface-container border-outline-variant" name="status" type="radio"/>
<span className="text-body-md text-on-surface">Active</span>
</label>
<label className="flex items-center gap-xs cursor-pointer">
<input className="text-primary focus:ring-primary bg-surface-container border-outline-variant" name="status" type="radio"/>
<span className="text-body-md text-on-surface">Disabled</span>
</label>
</div>
</div>
            <div className="md:col-span-2 pt-lg flex gap-md">
              <button className="flex-1 primary-gradient text-on-primary font-bold py-md rounded-2xl transition-transform active:scale-95 emerald-glow" type="button">
                Save Route Configuration
              </button>
              <button className="px-lg bg-surface-container-highest text-on-surface font-bold py-md rounded-2xl transition-all hover:bg-surface-variant" onClick={() => setRouteModal(false)} type="button">
                Cancel
              </button>
            </div>
          </form>
        </Modal>

<nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 glass-panel rounded-[24px] z-50 flex items-center justify-around px-gutter">
<button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-medium">Home</span>
</button>
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>route</span>
<span className="text-[10px] font-bold">Routes</span>
</button>
<div className="-mt-12 h-14 w-14 primary-gradient rounded-full flex items-center justify-center emerald-glow border-4 border-surface-dim" onClick={() => setRouteModal(true)}>
<span className="material-symbols-outlined text-on-primary text-[32px]">add</span>
</div>
<button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">directions_bus</span>
<span className="text-[10px] font-medium">Buses</span>
</button>
<button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">monitoring</span>
<span className="text-[10px] font-medium">Stats</span>
</button>
</nav>
    </div>
  );
}
