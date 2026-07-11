'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useAgencies, useRoutes } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/rapports-financiers-globaux-opep-super-admin
 */
export default function RapportsFinanciersGlobauxOpepSuperAdminReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
    const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"assessment","label":"Reports"},{"icon":"analytics","label":"Analytics"},{"icon":"settings","label":"Settings"}];
  const bottom = [{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
            {/* SideNavBar */}
<Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={0}
  onNavChange={(index: number) => setActiveNav(String(index))}
/>
{/* Main Content Area */}
<main className="flex-1 md:ml-[280px] min-h-screen flex flex-col relative">
{/* TopNavBar */}
<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container border-b border-charcoal-border h-16">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined md:hidden cursor-pointer">menu</span>
<div className="hidden md:flex items-center gap-2 bg-surface-dim border border-charcoal-border px-3 py-1.5 rounded-full">
<span className="material-symbols-outlined text-on-surface-variant">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-sm w-48 text-on-surface" placeholder="Search reports..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex gap-4">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
</div>
<div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl33PGyQ8ZiPCH46zS4rpNmsoNDDYMDstCwSAuYU4rvDF9PnKhBfGz5pa9Xl-CD4_dBDfN9kwwUHuFxTqlbjyz9q-IWhiBxeZ7F4QM2wd09Y23V-iZb2PHxGeeK-QGloWMDi08D60tCrWu_7LWS8_PkWPRfr5qxZzmgf1IP3ZqOfALQw6OkQD16Tre09DB9n8uO9VrXLSMxaUruDjqIFfDkEiEBicIHbFv78RDkCL0jVfH3rngPLzYxHMcmlCvpDy57x3x_BId8wQ" alt="A professional headshot of a senior executive male in a dark grey suit, set against a blurred modern office background with cool tones. The lighting is soft and cinematic, emphasizing a professional yet approachable demeanor. The image uses a high-fidelity color palette with subtle hints of corporate green and slate." />
</div>
</div>
</header>
{/* Dashboard Canvas */}
<div className="p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8">
{/* Page Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Financial Overview</h2>
<p className="text-on-surface-variant text-body-lg">Real-time performance across the OPEP network.</p>
</div>
<button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-caps text-label-caps flex items-center gap-2 shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95">
<span className="material-symbols-outlined text-[18px]">download</span>
                    EXPORT REPORT
                </button>
</div>
{/* KPI Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant font-label-caps text-label-caps">Total Revenue</span>
<span className="bg-success-green/10 text-success-green px-2 py-0.5 rounded text-[10px] font-bold">+12.5%</span>
</div>
<div className="text-on-surface font-title-md text-title-md">148,250,000 FCFA</div>
<div className="text-on-surface-variant text-[11px] opacity-60">Cumulative platform gross revenue</div>
</div>
<div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant font-label-caps text-label-caps">Active Agencies</span>
<span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">Stable</span>
</div>
<div className="text-on-surface font-title-md text-title-md">24</div>
<div className="text-on-surface-variant text-[11px] opacity-60">Verified interurban partners</div>
</div>
<div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant font-label-caps text-label-caps">Transactions</span>
<span className="bg-success-green/10 text-success-green px-2 py-0.5 rounded text-[10px] font-bold">+4.2%</span>
</div>
<div className="text-on-surface font-title-md text-title-md">18,492</div>
<div className="text-on-surface-variant text-[11px] opacity-60">Tickets processed this month</div>
</div>
<div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant font-label-caps text-label-caps">Platform Fees</span>
<span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">+8.1%</span>
</div>
<div className="text-on-surface font-title-md text-title-md">7,412,500 FCFA</div>
<div className="text-on-surface-variant text-[11px] opacity-60">Revenue from service commissions</div>
</div>
</div>
{/* Main Chart Area */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Revenue Trend Chart (Multi-line) */}
<div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col gap-6 min-h-[400px]">
<div className="flex justify-between items-center">
<h3 className="font-title-md text-title-md text-on-surface">Revenue Trends</h3>
<div className="flex gap-4">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-[11px] text-on-surface-variant">This Month</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-outline"></div>
<span className="text-[11px] text-on-surface-variant">Last Month</span>
</div>
</div>
</div>
<div className="flex-1 relative mt-4">
{/* Simulated Chart Grid */}
<div className="absolute inset-0 flex flex-col justify-between opacity-10">
<div className="border-b border-on-surface-variant w-full h-0"></div>
<div className="border-b border-on-surface-variant w-full h-0"></div>
<div className="border-b border-on-surface-variant w-full h-0"></div>
<div className="border-b border-on-surface-variant w-full h-0"></div>
<div className="border-b border-on-surface-variant w-full h-0"></div>
</div>
{/* Line Chart Visual SVG */}
<svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
{/* Last Month (Grey) */}
<path className="opacity-50" d="M0 80 Q 100 90, 200 60 T 400 70 T 600 95 T 800 60 T 1000 85" fill="none" stroke="#88938d" strokeWidth="2"></path>
{/* This Month (Primary) */}
<path d="M0 90 Q 100 40, 200 70 T 400 30 T 600 50 T 800 20 T 1000 40" fill="none" stroke="#79d8b7" strokeWidth="3"></path>
<circle cx="200" cy="70" fill="#79d8b7" r="4"></circle>
<circle cx="800" cy="20" fill="#79d8b7" r="4"></circle>
</svg>
{/* Labels */}
<div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-on-surface-variant uppercase tracking-wider">
<span>01 Oct</span>
<span>07 Oct</span>
<span>14 Oct</span>
<span>21 Oct</span>
<span>28 Oct</span>
</div>
</div>
</div>
{/* Payment Breakdown (Donut/Radial) */}
<div className="glass-panel rounded-xl p-6 flex flex-col gap-6">
<h3 className="font-title-md text-title-md text-on-surface">Payment Sources</h3>
<div className="flex-1 flex flex-col justify-center gap-8">
<div className="relative w-48 h-48 mx-auto flex items-center justify-center">
<svg className="w-full h-full transform -rotate-90">
<circle cx="50%" cy="50%" fill="none" r="40%" stroke="#3e4944" strokeWidth="12"></circle>
<circle cx="50%" cy="50%" fill="none" r="40%" stroke="#79d8b7" strokeDasharray="100, 100" strokeDashoffset="20" strokeWidth="12"></circle>
<circle cx="50%" cy="50%" fill="none" r="40%" stroke="#ecc300" strokeDasharray="30, 100" strokeDashoffset="80" strokeWidth="12"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-body-sm text-on-surface-variant">Digital</span>
<span className="text-title-md font-bold">82%</span>
</div>
</div>
<div className="flex flex-col gap-3">
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary"></div>
<span className="text-body-sm text-on-surface-variant">Mobile Money</span>
</div>
<span className="text-body-sm font-bold">58.4%</span>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-tertiary"></div>
<span className="text-body-sm text-on-surface-variant">Card/Stripe</span>
</div>
<span className="text-body-sm font-bold">23.6%</span>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-charcoal-border"></div>
<span className="text-body-sm text-on-surface-variant">Cash at Counter</span>
</div>
<span className="text-body-sm font-bold">18.0%</span>
</div>
</div>
</div>
</div>
</div>
{/* Top Agencies Table */}
<div className="glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="p-6 border-b border-charcoal-border flex justify-between items-center">
<h3 className="font-title-md text-title-md text-on-surface">Top Performing Agencies</h3>
<div className="flex gap-2">
<button className="p-1.5 rounded-lg border border-charcoal-border hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">filter_list</span>
</button>
<button className="p-1.5 rounded-lg border border-charcoal-border hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</div>
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-label-caps uppercase tracking-wider">
<th className="px-6 py-4">Agency Details</th>
<th className="px-6 py-4">Revenue (FCFA)</th>
<th className="px-6 py-4">Trips Completed</th>
<th className="px-6 py-4">Avg. Occupancy</th>
<th className="px-6 py-4">Growth</th>
<th className="px-6 py-4">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">
{/* Row 1 */}
<tr className="hover:bg-glass-fill transition-colors group cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-slate-surface flex items-center justify-center font-bold text-primary border border-charcoal-border">FV</div>
<div>
<div className="text-on-surface font-body-lg text-body-lg">Finex Voyages</div>
<div className="text-on-surface-variant text-[12px]">Douala - Yaoundé</div>
</div>
</div>
</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-on-surface">42,500,000</td>
<td className="px-6 py-4 text-on-surface-variant">1,240</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 w-24 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-success-green w-[92%]"></div>
</div>
<span className="text-[12px]">92%</span>
</div>
</td>
<td className="px-6 py-4 text-success-green">+14.2%</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[10px] font-bold bg-success-green/10 text-success-green border border-success-green/20">ELITE</span>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-glass-fill transition-colors group cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-slate-surface flex items-center justify-center font-bold text-primary border border-charcoal-border">GA</div>
<div>
<div className="text-on-surface font-body-lg text-body-lg">General Afrique</div>
<div className="text-on-surface-variant text-[12px]">West Region Circuit</div>
</div>
</div>
</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-on-surface">38,120,000</td>
<td className="px-6 py-4 text-on-surface-variant">980</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 w-24 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary w-[85%]"></div>
</div>
<span className="text-[12px]">85%</span>
</div>
</td>
<td className="px-6 py-4 text-success-green">+8.5%</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">PREMIUM</span>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-glass-fill transition-colors group cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-slate-surface flex items-center justify-center font-bold text-primary border border-charcoal-border">TV</div>
<div>
<div className="text-on-surface font-body-lg text-body-lg">Touristique Voyages</div>
<div className="text-on-surface-variant text-[12px]">Ngaoundéré - Garoua</div>
</div>
</div>
</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-on-surface">31,450,000</td>
<td className="px-6 py-4 text-on-surface-variant">720</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 w-24 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary w-[78%]"></div>
</div>
<span className="text-[12px]">78%</span>
</div>
</td>
<td className="px-6 py-4 text-error-red">-2.1%</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">PREMIUM</span>
</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-glass-fill transition-colors group cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-slate-surface flex items-center justify-center font-bold text-primary border border-charcoal-border">BV</div>
<div>
<div className="text-on-surface font-body-lg text-body-lg">Buca Voyages</div>
<div className="text-on-surface-variant text-[12px]">Yaoundé - Kribi</div>
</div>
</div>
</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-on-surface">26,900,000</td>
<td className="px-6 py-4 text-on-surface-variant">1,100</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 w-24 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary w-[81%]"></div>
</div>
<span className="text-[12px]">81%</span>
</div>
</td>
<td className="px-6 py-4 text-success-green">+5.2%</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant border border-charcoal-border">STANDARD</span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 border-t border-charcoal-border flex justify-between items-center">
<div className="text-[12px] text-on-surface-variant">Showing 4 of 24 Agencies</div>
<div className="flex gap-2">
<button className="px-3 py-1.5 rounded border border-charcoal-border text-[11px] font-bold hover:bg-surface-container-high">PREVIOUS</button>
<button className="px-3 py-1.5 rounded border border-charcoal-border text-[11px] font-bold hover:bg-surface-container-high">NEXT</button>
</div>
</div>
</div>
{/* Recent Transaction Feed / Map Preview (Asymmetric Bottom) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
<div className="glass-panel rounded-xl p-6 flex flex-col gap-4">
<h3 className="font-title-md text-title-md text-on-surface">Live Transactions</h3>
<div className="space-y-4">
<div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-charcoal-border">
<div className="flex items-center gap-3">
<div className="p-2 rounded-full bg-primary/10 text-primary">
<span className="material-symbols-outlined text-[18px]">payment</span>
</div>
<div>
<div className="text-body-sm font-medium">Finex - Ticket #8841</div>
<div className="text-[10px] text-on-surface-variant">via MTN MoMo • 2 mins ago</div>
</div>
</div>
<div className="text-body-sm font-bold text-on-surface">7,500 FCFA</div>
</div>
<div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-charcoal-border">
<div className="flex items-center gap-3">
<div className="p-2 rounded-full bg-tertiary/10 text-tertiary">
<span className="material-symbols-outlined text-[18px]">credit_card</span>
</div>
<div>
<div className="text-body-sm font-medium">General Afrique - Ticket #8840</div>
<div className="text-[10px] text-on-surface-variant">via Orange Money • 5 mins ago</div>
</div>
</div>
<div className="text-body-sm font-bold text-on-surface">5,000 FCFA</div>
</div>
<div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-charcoal-border">
<div className="flex items-center gap-3">
<div className="p-2 rounded-full bg-success-green/10 text-success-green">
<span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
</div>
<div>
<div className="text-body-sm font-medium">Touristique - Bulk #8839</div>
<div className="text-[10px] text-on-surface-variant">via Stripe • 12 mins ago</div>
</div>
</div>
<div className="text-body-sm font-bold text-on-surface">45,000 FCFA</div>
</div>
</div>
</div>
<div className="glass-panel rounded-xl overflow-hidden relative min-h-[200px]">
<div className="absolute inset-0 bg-cover bg-center grayscale opacity-40" data-alt="A futuristic dark-themed stylized map of Cameroon with glowing interconnected lines representing transport routes between Douala, Yaoundé, and Bafoussam. The map features pulsing data points at major agency hubs. The aesthetic is high-tech corporate with neon primary green accents on a deep slate background, highlighting the nationwide connectivity of the transport network." style={{}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent"></div>
<div className="relative p-6 h-full flex flex-col justify-between">
<div className="bg-surface-container/80 backdrop-blur-md p-3 rounded-lg border border-charcoal-border w-fit">
<h4 className="text-body-sm font-bold text-primary">Active Coverage</h4>
<p className="text-[11px] text-on-surface-variant">12 Regions • 48 Terminals</p>
</div>
<div className="flex items-center gap-2 text-on-surface-variant text-[11px]">
<span className="material-symbols-outlined text-[14px]">location_on</span>
                            Live Traffic Feed Active
                        </div>
</div>
</div>
</div>
</div>
</main>
{/* Mobile Navigation Shell */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container border-t border-charcoal-border flex items-center justify-around px-gutter z-50">
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-bold">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="text-[10px]">Agencies</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">analytics</span>
<span className="text-[10px]">Reports</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">account_circle</span>
<span className="text-[10px]">Profile</span>
</a>
</nav>
    </div>
  );
}
