'use client';

import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useAgencies } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/comparaison-de-performance-des-agences-opep-groupe
 */
export default function ComparaisonDePerformanceDesAgencesOpepGroupeReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"analytics","label":"Analytics"},{"icon":"compare_arrows","label":"Compare"},{"icon":"insights","label":"Insights"}];
  const bottom = [{"icon":"help","label":"Help"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
  <Sidebar
    items={items as any}
  bottomItems={bottom as any}
  activeIndex={2}
  onNavChange={setActiveNav as any}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">analytics</span></div>}
/>

<main className="md:ml-[280px] min-h-screen relative flex flex-col">

<header className="sticky top-0 z-40 bg-surface-container/80 backdrop-blur-md flex justify-between items-center px-margin-desktop w-full h-16 border-b border-outline-variant px-gutter md:px-lg">
<div className="flex items-center gap-md flex-1">
<button className="md:hidden text-primary">
<span className="material-symbols-outlined">menu</span>
</button>
<div className="hidden md:flex items-center bg-surface-container-low rounded-full px-md py-1 border border-outline-variant w-full max-w-md">
<span className="material-symbols-outlined text-outline">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-md w-full placeholder-outline-variant" placeholder="Search across branches..." type="text"/>
</div>
</div>
<div className="flex items-center gap-gutter">
<div className="hidden sm:flex gap-md items-center mr-gutter">
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined">translate</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined">settings</span>
</button>
</div>
<div className="flex items-center gap-sm border-l border-outline-variant pl-gutter">
<div className="text-right hidden lg:block">
<p className="font-label-sm text-on-surface font-bold">Dieudonné Ngasso</p>
<p className="text-[10px] text-primary uppercase font-bold tracking-tighter">Super Admin</p>
</div>
<img className="w-10 h-10 rounded-full border-2 border-primary object-cover" data-alt="A professional studio portrait of a high-level Cameroonian male executive in his 40s wearing a tailored obsidian-colored suit with a subtle emerald pocket square. He has a warm yet authoritative expression, looking directly into the camera. The background is a blurred high-tech corporate office with glass and neon green lighting accents, reflecting a premium dark-mode aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3gFma-huRZdtHE5lQ4UUPzYkuQtwmADh4n51qVqFdNmT6cVkoTA4IqLzxtfSGWUWcIdyUhmdaeGw-tzGs1xpApq10BldC4hruQSIC_fq7uQ82WWhPwJkOglHXVPCQriv5cPVdPnH3nWShTsakoMFW0096XUYVNBoFqazcO_EHp17Dof_wQ0RFDimKZcH9wU3DZnnWuNAt_6Vq3sksNhAfErBD5r7t7WEDVMPcoNmgAUF23KyoTPFzXuofXKVfjiMd003f-iIsGIQ"/>
</div>
</div>
</header>

<div className="p-gutter md:p-lg space-y-lg flex-1">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
<div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-primary">Group Financial Performance</h2>
<p className="text-on-surface-variant">Real-time consolidated revenue across all 12 OPEP branches.</p>
</div>
<div className="flex gap-sm">
<button className="glass-panel px-md py-sm rounded-lg flex items-center gap-xs text-on-surface hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-sm">calendar_month</span>
                        Current Quarter
                    </button>
<button className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold flex items-center gap-xs shadow-lg">
<span className="material-symbols-outlined text-sm">download</span>
                        Export PDF
                    </button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">

<div className="glass-panel inner-glow-primary p-md rounded-xl space-y-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant font-label-sm">TOTAL REVENUE</span>
<span className="text-primary material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>payments</span>
</div>
<div className="space-y-0">
<h3 className="text-title-md font-display-lg text-on-surface">42,850,000 <span className="text-body-md font-body-md opacity-60">FCFA</span></h3>
<p className="text-primary text-label-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">trending_up</span>
                            +12.4% vs last month
                        </p>
</div>
</div>

<div className="glass-panel p-md rounded-xl space-y-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant font-label-sm">AVG OCCUPANCY</span>
<span className="text-tertiary material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>event_seat</span>
</div>
<div className="space-y-0">
<h3 className="text-title-md font-display-lg text-on-surface">84.2 <span className="text-body-md font-body-md opacity-60">%</span></h3>
<p className="text-on-surface-variant text-label-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">remove</span>
                            Stable
                        </p>
</div>
</div>

<div className="glass-panel p-md rounded-xl space-y-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant font-label-sm">FLEET UTILIZATION</span>
<span className="text-secondary material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>directions_bus</span>
</div>
<div className="space-y-0">
<h3 className="text-title-md font-display-lg text-on-surface">92.1 <span className="text-body-md font-body-md opacity-60">%</span></h3>
<p className="text-secondary text-label-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">warning</span>
                            High load alert
                        </p>
</div>
</div>

<div className="glass-panel p-md rounded-xl space-y-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant font-label-sm">GROUP PROFIT MARGIN</span>
<span className="text-primary material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>account_balance_wallet</span>
</div>
<div className="space-y-0">
<h3 className="text-title-md font-display-lg text-on-surface">28.5 <span className="text-body-md font-body-md opacity-60">%</span></h3>
<p className="text-primary text-label-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">trending_up</span>
                            +2.1% growth
                        </p>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

<div className="lg:col-span-2 glass-panel p-lg rounded-2xl ambient-glow relative overflow-hidden group">
<div className="flex justify-between items-center mb-xl">
<div>
<h4 className="text-title-md text-on-surface">Revenue Growth Distribution</h4>
<p className="text-on-surface-variant text-body-md">Monthly comparison across top hubs</p>
</div>
<div className="flex gap-xs">
<span className="px-xs py-1 rounded bg-primary/20 text-primary text-[10px] font-bold">DAILY</span>
<span className="px-xs py-1 rounded bg-surface-container-highest text-on-surface-variant text-[10px] font-bold">MONTHLY</span>
</div>
</div>

<div className="h-64 flex items-end justify-between gap-base px-xs relative">

<div className="w-full h-[1px] bg-outline-variant absolute bottom-0 left-0"></div>
<div className="flex-1 bg-gradient-to-t from-primary/40 to-primary rounded-t-lg transition-all duration-700 h-[60%] hover:h-[65%] cursor-pointer group-hover:brightness-110"></div>
<div className="flex-1 bg-gradient-to-t from-primary-container/40 to-primary-container rounded-t-lg transition-all duration-700 h-[85%] hover:h-[90%] cursor-pointer group-hover:brightness-110"></div>
<div className="flex-1 bg-gradient-to-t from-primary/40 to-primary rounded-t-lg transition-all duration-700 h-[45%] hover:h-[50%] cursor-pointer group-hover:brightness-110"></div>
<div className="flex-1 bg-gradient-to-t from-primary-container/40 to-primary-container rounded-t-lg transition-all duration-700 h-[70%] hover:h-[75%] cursor-pointer group-hover:brightness-110"></div>
<div className="flex-1 bg-gradient-to-t from-primary/40 to-primary rounded-t-lg transition-all duration-700 h-[95%] hover:h-[100%] cursor-pointer group-hover:brightness-110"></div>
<div className="flex-1 bg-gradient-to-t from-primary-container/40 to-primary-container rounded-t-lg transition-all duration-700 h-[65%] hover:h-[70%] cursor-pointer group-hover:brightness-110"></div>
<div className="flex-1 bg-gradient-to-t from-primary/40 to-primary rounded-t-lg transition-all duration-700 h-[40%] hover:h-[45%] cursor-pointer group-hover:brightness-110"></div>
</div>
<div className="mt-lg flex justify-between text-on-surface-variant font-label-sm opacity-60">
<span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
</div>
</div>

<div className="glass-panel p-lg rounded-2xl space-y-lg flex flex-col">
<h4 className="text-title-md text-on-surface">Group Insights</h4>
<div className="flex-1 space-y-md">
<div className="p-md rounded-xl bg-surface-container-low border-l-4 border-primary">
<p className="text-primary font-bold text-label-sm uppercase mb-xs">Top Performer</p>
<p className="text-on-surface font-body-md">Douala Akwa exceeds targets by <span className="text-primary">18%</span> this month. Primary driver: Premium VIP routes.</p>
</div>
<div className="p-md rounded-xl bg-surface-container-low border-l-4 border-tertiary">
<p className="text-tertiary font-bold text-label-sm uppercase mb-xs">Action Required</p>
<p className="text-on-surface font-body-md">Bafoussam Hub shows <span className="text-tertiary">5%</span> drop in off-peak revenue. Suggest dynamic pricing.</p>
</div>
</div>
<button className="w-full py-md rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface font-bold transition-colors">
                        View Detailed Log
                    </button>
</div>
</div>

<div className="glass-panel rounded-2xl overflow-hidden mb-xl">
<div className="p-lg border-b border-outline-variant flex justify-between items-center">
<h4 className="text-title-md text-on-surface">Agency Branch Comparison</h4>
<button className="text-primary flex items-center gap-xs font-bold text-label-sm hover:underline">
                        SEE ALL BRANCHES
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low">
<th className="px-lg py-md text-on-surface-variant font-label-sm uppercase">Branch Name</th>
<th className="px-lg py-md text-on-surface-variant font-label-sm uppercase">Revenue (FCFA)</th>
<th className="px-lg py-md text-on-surface-variant font-label-sm uppercase text-center">Growth</th>
<th className="px-lg py-md text-on-surface-variant font-label-sm uppercase text-center">Occupancy</th>
<th className="px-lg py-md text-on-surface-variant font-label-sm uppercase text-right">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-lg py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">location_on</span>
</div>
<div>
<p className="text-on-surface font-bold">Douala Akwa</p>
<p className="text-on-surface-variant text-[12px]">Littoral Region</p>
</div>
</div>
</td>
<td className="px-lg py-lg text-on-surface font-bold">12,450,000</td>
<td className="px-lg py-lg">
<div className="flex justify-center">
<span className="px-sm py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">+18.2%</span>
</div>
</td>
<td className="px-lg py-lg">
<div className="flex flex-col items-center gap-xs">
<span className="text-on-surface font-body-md">92%</span>
<div className="w-20 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-[92%]"></div>
</div>
</div>
</td>
<td className="px-lg py-lg text-right">
<span className="inline-block w-3 h-3 rounded-full bg-primary ambient-glow"></span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-lg py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">location_on</span>
</div>
<div>
<p className="text-on-surface font-bold">Yaoundé Mvan</p>
<p className="text-on-surface-variant text-[12px]">Center Region</p>
</div>
</div>
</td>
<td className="px-lg py-lg text-on-surface font-bold">10,120,500</td>
<td className="px-lg py-lg">
<div className="flex justify-center">
<span className="px-sm py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">+4.5%</span>
</div>
</td>
<td className="px-lg py-lg">
<div className="flex flex-col items-center gap-xs">
<span className="text-on-surface font-body-md">88%</span>
<div className="w-20 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-[88%]"></div>
</div>
</div>
</td>
<td className="px-lg py-lg text-right">
<span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-lg py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">location_on</span>
</div>
<div>
<p className="text-on-surface font-bold">Bafoussam Hub</p>
<p className="text-on-surface-variant text-[12px]">West Region</p>
</div>
</div>
</td>
<td className="px-lg py-lg text-on-surface font-bold">6,840,000</td>
<td className="px-lg py-lg">
<div className="flex justify-center">
<span className="px-sm py-1 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold">-2.1%</span>
</div>
</td>
<td className="px-lg py-lg">
<div className="flex flex-col items-center gap-xs">
<span className="text-on-surface font-body-md">74%</span>
<div className="w-20 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-tertiary w-[74%]"></div>
</div>
</div>
</td>
<td className="px-lg py-lg text-right">
<span className="inline-block w-3 h-3 rounded-full bg-tertiary"></span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>


</main>

<nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] glass-panel rounded-full h-16 flex items-center justify-around px-gutter z-50">
<button className="text-primary flex flex-col items-center">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>dashboard</span>
<span className="text-[10px] font-bold">Home</span>
</button>
<button className="text-on-surface-variant flex flex-col items-center">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="text-[10px]">Agencies</span>
</button>
<button className="text-on-surface-variant flex flex-col items-center">
<span className="material-symbols-outlined">monitoring</span>
<span className="text-[10px]">Reports</span>
</button>
<button className="text-on-surface-variant flex flex-col items-center">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px]">Profile</span>
</button>
</nav>
    </div>
  );
}
