'use client';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useDrivers, useDriverPerformance } from '@/hooks/useEntities';

/**
undefined
 * Route: /reproduction/performance-chauffeur-opep-admin
 */
export default function PerformanceChauffeurOpepAdminReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: drivers, isLoading: driversLoading, error: driversError, refetch: driversRefetch } = useDrivers();
  const { data: driverPerf, isLoading: perfLoading } = useDriverPerformance('default');
  const [activeTab, setActiveTab] = useState('home');
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* Side Navigation Shell */}
<aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/10 backdrop-blur-xl bg-surface flex flex-col py-6 z-50 hidden md:flex">
<div className="px-6 mb-10">
<h1 className="font-headline font-bold text-primary text-2xl tracking-tight">OPEP Admin</h1>
<p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Sovereign Management</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg mx-2" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-body-md text-body-md">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg mx-2" href="#">
<span className="material-symbols-outlined">business</span>
<span className="font-body-md text-body-md">Agencies</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg mx-2" href="#">
<span className="material-symbols-outlined">route</span>
<span className="font-body-md text-body-md">Trips</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg mx-2" href="#">
<span className="material-symbols-outlined">directions_bus</span>
<span className="font-body-md text-body-md">Buses</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg mx-2 active-nav-glow shadow-sm" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>badge</span>
<span className="font-body-md text-body-md font-semibold">Staff</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg mx-2" href="#">
<span className="material-symbols-outlined">analytics</span>
<span className="font-body-md text-body-md">Analytics</span>
</a>
</nav>
<div className="mt-auto px-4">
<div className="glass-panel p-4 rounded-xl flex items-center gap-3">
<img className="w-10 h-10 rounded-full border-2 border-primary/20" data-alt="A professional portrait of a senior transportation administrator in a crisp dark suit, positioned against a minimalist, high-tech background with soft emerald green lighting. The photography is editorial-style with shallow depth of field, conveying authority and technical expertise within the OPEP Sovereign ecosystem." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzcuv-hPHZPjDLIIj0-QIXAoNHPJG5sOTwx8a24O_JvOfWTSyO8z_WkuiQi5Kq80iyAb6gGutxCko151n5Bu3NlcYawpW80mMTOU_jd8lpk3rvVXBsjHBhEIJhcaeEg1HAGQDwC4w-fdKRQ8N6Wx9lWKGX9TC4le29mM-KQ-tSJYkYfPqrRe8jNd8YSXf_APHAP0h_JkiCBhA8YwHW_ow0GagpsoJUYKylrdW0rGSQ7dsCTg0LhLUWTjLImW3tG0n9HdJlDSA-GGk"/>
<div className="overflow-hidden">
<p className="text-sm font-semibold truncate">Admin User</p>
<p className="text-xs text-on-surface-variant truncate">Master Controller</p>
</div>
</div>
</div>
</aside>
{/* Top Navigation Bar */}
<header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 border-b border-outline-variant/10 backdrop-blur-md bg-surface/80 flex justify-between items-center px-6 z-40">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined md:hidden">menu</span>
<div className="relative hidden sm:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search drivers, routes..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all">
<span className="material-symbols-outlined text-on-surface-variant">language</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all relative">
<span className="material-symbols-outlined text-on-surface-variant">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
</button>
</div>
</header>
{/* Main Content Area */}
<main className="pt-20 pb-10 px-4 md:px-10 md:ml-64 min-h-screen">
{/* Driver Profile Header */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
<div className="flex items-center gap-6">
<div className="relative">
<div className="w-24 h-24 rounded-2xl border-2 border-primary overflow-hidden shadow-xl ambient-glow">
<img className="w-full h-full object-cover" data-alt="A close-up high-resolution portrait of a focused male bus driver in a clean OPEP uniform, reflecting professionalism and reliability. The lighting is warm and natural, suggesting an outdoor transport hub at sunset. The background features blurred architectural elements of a modern transit terminal in Cameroon." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU8DriH55x9kwXxMuw49xlfvyL4FYwDtgzmsMIoy7iFxuHL-cbpLdJjUrPckw2RSxzPAeADx7czpbNYBSOezmlI4_i37jd4nEFqcn4nyHxsfNcGMmiyiLP8iKqdRK9mxXAAottPvb739I__tKeFB68BMGfrIeudTFUpaF2yXUQI-VIt3-NDuZ9jC8yO1xp2mgYJijzzsatM03r7WAqu926bRQsKGkfz-n68vHGms8fkHE85tG98ed79tAPOeAXKJatzhHHsjXWqxA"/>
</div>
<div className="absolute -bottom-2 -right-2 bg-primary text-on-primary px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Active</div>
</div>
<div>
<h2 className="font-headline text-3xl font-bold text-on-surface">Jean-Paul N'Dongo</h2>
<p className="text-on-surface-variant font-body-md">Senior Driver • Employee ID: #OP-8821 • Agency: Littoral Express</p>
<div className="flex gap-4 mt-2">
<div className="flex items-center gap-1 text-tertiary">
<span className="material-symbols-outlined text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.92</span>
<span className="text-on-surface-variant text-xs font-normal">(1,240 reviews)</span>
</div>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-sm">verified</span>
<span className="text-xs font-medium">Top Performer</span>
</div>
</div>
</div>
</div>
<div className="flex gap-3">
<button className="px-5 py-2.5 rounded-xl glass-panel border-outline-variant/20 font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-sm">mail</span> Message
                </button>
<button className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#007a5e] to-[#00a884] font-bold text-sm text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-sm">edit</span> Edit Profile
                </button>
</div>
</div>
{/* Performance Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
{/* Safety Score */}
<div className="glass-panel p-6 rounded-3xl inner-glow-primary relative overflow-hidden group">
<div className="relative z-10">
<p className="text-on-surface-variant text-sm font-medium mb-1">Safety Score</p>
<div className="flex items-end gap-2">
<span className="text-4xl font-bold font-headline text-primary">98</span>
<span className="text-on-surface-variant text-sm mb-1.5">/100</span>
<span className="flex items-center text-primary text-xs ml-auto font-bold">
<span className="material-symbols-outlined text-xs">trending_up</span> +2%
                        </span>
</div>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-8xl">health_and_safety</span>
</div>
</div>
{/* Fleet Efficiency */}
<div className="glass-panel p-6 rounded-3xl inner-glow-primary relative overflow-hidden group">
<div className="relative z-10">
<p className="text-on-surface-variant text-sm font-medium mb-1">Fuel Efficiency</p>
<div className="flex items-end gap-2">
<span className="text-4xl font-bold font-headline text-on-surface">3.8</span>
<span className="text-on-surface-variant text-sm mb-1.5">km/L</span>
<span className="flex items-center text-secondary text-xs ml-auto font-bold">
<span className="material-symbols-outlined text-xs">trending_down</span> -0.4%
                        </span>
</div>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-8xl">ev_station</span>
</div>
</div>
{/* Total Distance */}
<div className="glass-panel p-6 rounded-3xl inner-glow-primary relative overflow-hidden group">
<div className="relative z-10">
<p className="text-on-surface-variant text-sm font-medium mb-1">Monthly Distance</p>
<div className="flex items-end gap-2">
<span className="text-4xl font-bold font-headline text-on-surface">4,280</span>
<span className="text-on-surface-variant text-sm mb-1.5">km</span>
</div>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-8xl">timeline</span>
</div>
</div>
{/* Punctuality */}
<div className="glass-panel p-6 rounded-3xl inner-glow-primary relative overflow-hidden group">
<div className="relative z-10">
<p className="text-on-surface-variant text-sm font-medium mb-1">Punctuality</p>
<div className="flex items-end gap-2">
<span className="text-4xl font-bold font-headline text-tertiary">96.4</span>
<span className="text-on-surface-variant text-sm mb-1.5">%</span>
</div>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-8xl">schedule</span>
</div>
</div>
</div>
{/* Main Insights Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Safety Score Chart */}
<div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col h-[400px]">
<div className="flex justify-between items-center mb-6">
<div>
<h3 className="font-headline text-xl font-bold">Safety Performance</h3>
<p className="text-sm text-on-surface-variant">Last 30 days metrics analysis</p>
</div>
<div className="flex gap-2">
<button className="px-3 py-1 text-xs rounded-full bg-surface-container-highest text-on-surface font-semibold">Weekly</button>
<button className="px-3 py-1 text-xs rounded-full text-on-surface-variant hover:text-on-surface transition-colors">Monthly</button>
</div>
</div>
<div className="flex-1 relative">

{/* Simulated Chart Visualization */}
<div className="absolute inset-0 flex items-end justify-between px-2 gap-2">
<div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg h-[70%]" title="Day 1: 88"></div>
<div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg h-[75%]" title="Day 2: 90"></div>
<div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg h-[72%]" title="Day 3: 89"></div>
<div className="flex-1 bg-primary/40 hover:bg-primary/60 transition-all rounded-t-lg h-[88%] border-t-2 border-primary" title="Day 4: 95"></div>
<div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg h-[82%]" title="Day 5: 92"></div>
<div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg h-[85%]" title="Day 6: 94"></div>
<div className="flex-1 bg-primary/40 hover:bg-primary/60 transition-all rounded-t-lg h-[92%] border-t-2 border-primary" title="Today: 98"></div>
</div>
{/* Chart Legend */}
<div className="absolute top-0 right-0 p-4 flex flex-col gap-2">
<div className="flex items-center gap-2 text-xs text-on-surface-variant">
<span className="w-3 h-3 bg-primary rounded-sm"></span> Safety Threshold
                        </div>
<div className="flex items-center gap-2 text-xs text-on-surface-variant">
<span className="w-3 h-3 bg-primary/30 rounded-sm"></span> Daily Avg
                        </div>
</div>
</div>
<div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between">
<div className="flex gap-4">
<div className="text-center">
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Hard Braking</p>
<p className="text-sm font-bold text-primary">0/mo</p>
</div>
<div className="text-center">
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Over Speeding</p>
<p className="text-sm font-bold text-on-surface">2/mo</p>
</div>
<div className="text-center">
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Rapid Accel</p>
<p className="text-sm font-bold text-on-surface">1/mo</p>
</div>
</div>
<button className="text-primary text-xs font-bold flex items-center gap-1">Detailed Log <span className="material-symbols-outlined text-xs">arrow_forward_ios</span></button>
</div>
</div>
{/* Passenger Ratings / Feedback */}
<div className="glass-panel p-6 rounded-3xl flex flex-col h-[400px]">
<h3 className="font-headline text-xl font-bold mb-6">Recent Feedback</h3>
<div className="flex-1 space-y-4 overflow-y-auto hide-scrollbar">
{/* Feedback Item 1 */}
<div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10">
<div className="flex justify-between items-start mb-2">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">AM</div>
<span className="text-xs font-semibold">Alice M.</span>
</div>
<div className="flex text-tertiary">
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
</div>
</div>
<p className="text-xs text-on-surface-variant italic">"Very professional driver. The bus was clean and arrived exactly on time. Highly recommended for long trips!"</p>
</div>
{/* Feedback Item 2 */}
<div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10">
<div className="flex justify-between items-start mb-2">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-[10px] font-bold text-secondary">BT</div>
<span className="text-xs font-semibold">Bruno T.</span>
</div>
<div className="flex text-tertiary">
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]">star</span>
</div>
</div>
<p className="text-xs text-on-surface-variant italic">"Smooth ride, though the air conditioning was a bit too cold for my liking. Driver was polite."</p>
</div>
{/* Feedback Item 3 */}
<div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10">
<div className="flex justify-between items-start mb-2">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">CK</div>
<span className="text-xs font-semibold">Cathy K.</span>
</div>
<div className="flex text-tertiary">
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
</div>
</div>
<p className="text-xs text-on-surface-variant italic">"Excellent navigation through Douala traffic. Saved us nearly 30 minutes. Brilliant!"</p>
</div>
</div>
<button className="mt-4 w-full py-2.5 rounded-xl border border-primary/20 text-primary text-xs font-bold hover:bg-primary/5 transition-colors">View All Reviews</button>
</div>
</div>
{/* Recent Trip Log */}
<div className="mt-8">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline text-2xl font-bold">Recent Trip History</h3>
<div className="flex gap-2">
<button className="p-2 rounded-lg glass-panel hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined">filter_list</span>
</button>
<button className="p-2 rounded-lg glass-panel hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined">download</span>
</button>
</div>
</div>
<div className="glass-panel rounded-3xl overflow-hidden">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant/10">
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Route</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Bus ID</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Punctuality</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fuel Used</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/5">
{/* Row 1 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-4">
<p className="text-sm font-semibold">Oct 24, 2023</p>
<p className="text-[10px] text-on-surface-variant">08:15 AM Departure</p>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="text-sm font-medium">Douala</span>
<span className="material-symbols-outlined text-xs text-on-surface-variant">arrow_forward</span>
<span className="text-sm font-medium">Yaoundé</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded border border-outline-variant/20">LT-223-XP</span>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">ON TIME</span>
</td>
<td className="px-6 py-4">
<span className="text-sm text-on-surface">62.4 L</span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-on-surface-variant group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-4">
<p className="text-sm font-semibold">Oct 23, 2023</p>
<p className="text-[10px] text-on-surface-variant">02:45 PM Departure</p>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="text-sm font-medium">Kribi</span>
<span className="material-symbols-outlined text-xs text-on-surface-variant">arrow_forward</span>
<span className="text-sm font-medium">Douala</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded border border-outline-variant/20">LT-223-XP</span>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full border border-secondary/20">DELAYED (12m)</span>
</td>
<td className="px-6 py-4">
<span className="text-sm text-on-surface">45.2 L</span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-on-surface-variant group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-4">
<p className="text-sm font-semibold">Oct 22, 2023</p>
<p className="text-[10px] text-on-surface-variant">06:00 AM Departure</p>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="text-sm font-medium">Douala</span>
<span className="material-symbols-outlined text-xs text-on-surface-variant">arrow_forward</span>
<span className="text-sm font-medium">Buea</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded border border-outline-variant/20">SW-901-BA</span>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">ON TIME</span>
</td>
<td className="px-6 py-4">
<span className="text-sm text-on-surface">18.7 L</span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-on-surface-variant group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</main>
{/* Mobile Bottom Navigation */}
<nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 glass-panel rounded-3xl flex items-center justify-around px-4 z-50 ambient-glow">
<a className="flex flex-col items-center justify-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-medium">Home</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">route</span>
<span className="text-[10px] font-medium">Trips</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>badge</span>
<span className="text-[10px] font-bold">Staff</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">analytics</span>
<span className="text-[10px] font-medium">Insights</span>
</a>
</nav>
    </div>
  );
}
