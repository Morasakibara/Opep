'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useAvailableTrips } from '@/hooks/useTrips';
import { useAgencies } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/tableau-de-bord-proprietaire-opep-multi-agences
 */
export default function TableauDeBordProprietaireOpepMultiAgencesReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
    const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"payments","label":"Finance"},{"icon":"group","label":"Staff"}];
  const bottom = [{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
            <Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={0}
  onNavChange={setActiveTab}
/>

<main className="flex-1 md:ml-[280px] w-full min-h-screen">

<header className="flex justify-between items-center px-container-padding md:px-lg w-full h-16 sticky top-0 z-40 bg-surface-container/80 backdrop-blur-md border-b border-outline-variant/30">
<div className="flex items-center gap-md">
<button className="md:hidden text-on-surface">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<div className="hidden md:block">
<h2 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">Finexs Voyages <span className="text-on-surface-variant/50 mx-xs">/</span> Group Overview</h2>
</div>
</div>
<div className="flex items-center gap-gutter">
<div className="hidden lg:flex items-center bg-surface-container-lowest px-sm py-xs rounded-full border border-outline-variant/20 w-64">
<span className="material-symbols-outlined text-on-surface-variant mr-xs" data-icon="search">search</span>
<input className="bg-transparent border-none text-body-md font-body-md text-on-surface focus:ring-0 w-full placeholder:text-on-surface-variant/50" placeholder="Search agencies..." type="text"/>
</div>
<div className="flex items-center gap-sm">
<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-on-surface-variant transition-colors">
<span className="material-symbols-outlined" data-icon="translate">translate</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-on-surface-variant transition-colors relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface-container"></span>
</button>
<div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden cursor-pointer">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdL1BPwDQ64KwSMy2IOjVtz1PRPzijseSxn9Gm6hPjR-Ht5kzk4UxstdU3kR-wGJP6Nz7X8R54W1SopHaSP8TGAyr1U9FA_e2Klojw2ricoMhssYc4F8Krxsejmqa0j3nG5r6qMlBV5xL2tIp90nO09f4q13FM-qeQ8GXqhRsUZKyzpVta0rf261MfKNFWYC-Nrm0LLdAfCtMVqLD9i8Z0cGKYumPG1somDngFqDr0XIP3QoFjreWFI7N_-L3grxQol9a_z656W28" alt="A professional portrait of a senior transportation executive in Cameroon, wearing a high-end tailored suit, with a confident expression. The lighting is dramatic and moody, reflecting an obsidian-themed dark mode aesthetic with soft green ambient glows. The background is a minimalist, high-tech architectural space." />
</div>
</div>
</div>
</header>

<div className="p-container-padding md:p-lg space-y-lg">

<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-md">

<div className="md:col-span-2 lg:col-span-2 glass-card p-lg rounded-[24px] inner-glow relative overflow-hidden flex flex-col justify-between h-64 group">

<div className="relative z-10">
<p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest mb-xs">Total Group Revenue</p>
<h3 className="font-display-lg text-display-lg text-primary tracking-tighter">84,290,000 <span className="text-title-md font-medium text-on-primary-container">XAF</span></h3>
<div className="flex items-center gap-xs mt-base text-primary">
<span className="material-symbols-outlined text-[16px]" data-icon="trending_up">trending_up</span>
<span className="text-body-md font-body-md">+12.4% from last month</span>
</div>
</div>
<div className="relative z-10 flex gap-xs mt-auto">
<div className="flex-1 h-12 glass-card rounded-xl border-primary/20 flex flex-col items-center justify-center">
<span className="text-label-sm font-label-sm text-on-surface-variant">Agencies</span>
<span className="text-title-md font-title-md text-on-surface">12</span>
</div>
<div className="flex-1 h-12 glass-card rounded-xl border-primary/20 flex flex-col items-center justify-center">
<span className="text-label-sm font-label-sm text-on-surface-variant">Active Buses</span>
<span className="text-title-md font-title-md text-on-surface">148</span>
</div>
<div className="flex-1 h-12 glass-card rounded-xl border-primary/20 flex flex-col items-center justify-center">
<span className="text-label-sm font-label-sm text-on-surface-variant">Routes</span>
<span className="text-title-md font-title-md text-on-surface">32</span>
</div>
</div>
</div>

<div className="glass-card p-lg rounded-[24px] inner-glow flex flex-col justify-between h-64 border-secondary/10">
<div className="flex justify-between items-start">
<div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[32px]" data-icon="warning">warning</span>
</div>
<span className="text-secondary font-bold text-label-sm">URGENT</span>
</div>
<div>
<h4 className="font-title-md text-title-md text-on-surface mb-xs">Agency A Delay</h4>
<p className="text-on-surface-variant text-body-md font-body-md line-clamp-2">Technical fault reported for Bus #422 on Douala-Yaoundé axis. Maintenance required.</p>
</div>
<button className="w-full py-sm bg-surface-container-highest text-on-surface font-bold rounded-xl text-label-sm hover:bg-secondary/20 transition-all">
                        Assign Technical Head
                    </button>
</div>

<div className="glass-card p-lg rounded-[24px] inner-glow flex flex-col gap-sm h-64">
<button className="flex-1 glass-card-hover rounded-xl border border-outline-variant/30 flex items-center gap-md px-md transition-all">
<span className="material-symbols-outlined text-primary" data-icon="add_business">add_business</span>
<div className="text-left">
<p className="font-title-md text-title-md text-on-surface leading-none">Register Agency</p>
<p className="text-xs text-on-surface-variant">Add a new terminal node</p>
</div>
</button>
<button className="flex-1 glass-card-hover rounded-xl border border-outline-variant/30 flex items-center gap-md px-md transition-all">
<span className="material-symbols-outlined text-tertiary" data-icon="receipt_long">receipt_long</span>
<div className="text-left">
<p className="font-title-md text-title-md text-on-surface leading-none">Export Audit</p>
<p className="text-xs text-on-surface-variant">Download group financials</p>
</div>
</button>
</div>
</div>

<div className="space-y-gutter">
<div className="flex items-center justify-between">
<h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">My Agencies</h3>
<div className="flex gap-xs">
<button className="p-xs rounded-lg glass-card text-on-surface-variant"><span className="material-symbols-outlined" data-icon="filter_list">filter_list</span></button>
<button className="p-xs rounded-lg glass-card text-on-surface-variant"><span className="material-symbols-outlined" data-icon="grid_view">grid_view</span></button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">

<div className="glass-card rounded-[24px] p-md space-y-md group glass-card-hover transition-all">
<div className="h-40 rounded-xl overflow-hidden relative">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpJSVqTJvvo2udQ3cM8gXKA-wJKZfY9zi9KW2oaz9g3T3e7U-dbsNAARiCOSsU6gg7Hmlezz0pGoLfMxTsPPLZ97tpxPMikMelxC44pNlGBZv-FHOplMydiwLTRQxQAKjt0jXcvMVpYec68tHOZKQvVZryWdCmCHye4q6JQOssoCSohSHSLYsxp0QXQ0BCG1_1x02iQB3sd5H_JG3lqzk5-fUV70dZroaM4uySFbBbsmV5RVEUOXPyGA9QdWNsnx9MIocLgEJV0u4" alt="A modern, high-tech transportation terminal building in Douala, Cameroon at dusk. The architecture features sleek glass walls and green neon accent lighting. Luxurious buses are parked in organized bays. The sky is a deep twilight blue, blending with a sophisticated dark UI aesthetic." />
<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
<div className="absolute top-sm right-sm flex gap-xs">
<span className="bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold px-sm py-1 rounded-full border border-primary/30">OPERATIONAL</span>
</div>
<div className="absolute bottom-sm left-sm">
<h4 className="font-title-md text-title-md text-white font-bold">Douala - Akwa Central</h4>
<p className="text-xs text-on-primary-container">Head: Jean-Pierre Mboum</p>
</div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="bg-surface-container-high rounded-xl p-sm">
<p className="text-[10px] text-on-surface-variant uppercase">Daily Revenue</p>
<p className="text-body-lg font-bold text-on-surface">4.2M XAF</p>
</div>
<div className="bg-surface-container-high rounded-xl p-sm">
<p className="text-[10px] text-on-surface-variant uppercase">Trips Today</p>
<p className="text-body-lg font-bold text-on-surface">24/28</p>
</div>
</div>
<div className="flex justify-between items-center pt-xs">
<div className="flex -space-x-2">
<div className="relative w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface">+12 Staff</div>
</div>
<button className="text-primary font-bold text-label-sm flex items-center gap-xs">
                                View Details <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>

<div className="glass-card rounded-[24px] p-md space-y-md group glass-card-hover transition-all">
<div className="h-40 rounded-xl overflow-hidden relative">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHJRW-AcAocXv_iac2qvlX_57p7zlsp5SGBE07M8j9-SoLdQfxhoI4PxUbQ8yyksyTU08Rc5amCQqxQagu9wPwnL_vVUBhHw-Uy7alhcDbT2CVdPjTGQKOBD8nMHd3Q94UV1KfQMJEkVaqAhp4UQO6Wo0IdKTU81o2QHaKBXUhIn3SzsQjP2vEnVfVrxmPG_dDMIu1LqplHE7YE382zMSAQMSNfYWRDUq_I9aOmD0WV271QEwBEVFKXbv6KgXUakUOggg-t_Qy0z4" alt="A bustling transportation hub in Yaoundé, Cameroon, seen from an elevated perspective. The design is contemporary with green energy-efficient panels. The lighting is soft and warm, contrasting with the dark metallic surfaces. The atmosphere is professional, efficient, and technologically advanced." />
<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
<div className="absolute top-sm right-sm flex gap-xs">
<span className="bg-tertiary/20 backdrop-blur-md text-tertiary text-[10px] font-bold px-sm py-1 rounded-full border border-tertiary/30">BUSY</span>
</div>
<div className="absolute bottom-sm left-sm">
<h4 className="font-title-md text-title-md text-white font-bold">Yaoundé - Mvan Terminal</h4>
<p className="text-xs text-on-primary-container">Head: Marie Abega</p>
</div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="bg-surface-container-high rounded-xl p-sm">
<p className="text-[10px] text-on-surface-variant uppercase">Daily Revenue</p>
<p className="text-body-lg font-bold text-on-surface">5.8M XAF</p>
</div>
<div className="bg-surface-container-high rounded-xl p-sm">
<p className="text-[10px] text-on-surface-variant uppercase">Trips Today</p>
<p className="text-body-lg font-bold text-on-surface">32/32</p>
</div>
</div>
<div className="flex justify-between items-center pt-xs">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface">+18 Staff</div>
</div>
<button className="text-primary font-bold text-label-sm flex items-center gap-xs">
                                View Details <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>

<button className="rounded-[24px] border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-sm group hover:border-primary/50 transition-all bg-surface-container-low/20">
<div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[32px]" data-icon="add">add</span>
</div>
<p className="font-title-md text-title-md text-on-surface-variant group-hover:text-on-surface transition-colors">Add New Agency</p>
<p className="text-xs text-on-surface-variant/50 max-w-[180px] text-center">Expand your group's footprint across the region.</p>
</button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-md">

<div className="lg:col-span-1 glass-card rounded-[24px] p-lg space-y-md">
<div className="flex justify-between items-center">
<h4 className="font-title-md text-title-md text-on-surface">Staff Distribution</h4>
<span className="material-symbols-outlined text-primary" data-icon="more_vert">more_vert</span>
</div>
<div className="space-y-sm">
<div className="flex items-center justify-between">
<span className="text-body-md text-on-surface-variant">Agency Heads</span>
<span className="text-body-md font-bold text-on-surface">12</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[100%] rounded-full"></div>
</div>
<div className="flex items-center justify-between">
<span className="text-body-md text-on-surface-variant">Drivers</span>
<span className="text-body-md font-bold text-on-surface">156</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-tertiary h-full w-[85%] rounded-full"></div>
</div>
<div className="flex items-center justify-between">
<span className="text-body-md text-on-surface-variant">Administrative</span>
<span className="text-body-md font-bold text-on-surface">42</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-secondary h-full w-[60%] rounded-full"></div>
</div>
</div>
<button className="w-full mt-gutter flex items-center justify-center gap-xs text-primary font-bold hover:brightness-125 transition-all">
                        Manage Hierarchy <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>

<div className="lg:col-span-2 glass-card rounded-[24px] p-lg">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-title-md text-title-md text-on-surface">Group Financial Stream</h4>
<button className="text-label-sm font-label-sm text-primary border border-primary/30 px-md py-xs rounded-full hover:bg-primary/10 transition-all">View All Ledger</button>
</div>
<div className="space-y-xs">
<div className="flex items-center justify-between p-sm hover:bg-surface-container-high rounded-xl transition-all cursor-pointer border border-transparent hover:border-outline-variant/30">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined" data-icon="arrow_upward">arrow_upward</span>
</div>
<div>
<p className="text-body-md font-bold text-on-surface">Bulk Booking Payment</p>
<p className="text-[10px] text-on-surface-variant">Agency: Douala • Ref: #TX-9284</p>
</div>
</div>
<div className="text-right">
<p className="text-body-md font-bold text-primary">+850,000 XAF</p>
<p className="text-[10px] text-on-surface-variant">2 mins ago</p>
</div>
</div>
<div className="flex items-center justify-between p-sm hover:bg-surface-container-high rounded-xl transition-all cursor-pointer border border-transparent hover:border-outline-variant/30">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined" data-icon="oil_barrel">oil_barrel</span>
</div>
<div>
<p className="text-body-md font-bold text-on-surface">Fleet Refueling Expense</p>
<p className="text-[10px] text-on-surface-variant">Agency: Yaoundé • Ref: #EX-3312</p>
</div>
</div>
<div className="text-right">
<p className="text-body-md font-bold text-secondary">-1,200,000 XAF</p>
<p className="text-[10px] text-on-surface-variant">15 mins ago</p>
</div>
</div>
<div className="flex items-center justify-between p-sm hover:bg-surface-container-high rounded-xl transition-all cursor-pointer border border-transparent hover:border-outline-variant/30">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
</div>
<div>
<p className="text-body-md font-bold text-on-surface">Ticket Revenue Transfer</p>
<p className="text-[10px] text-on-surface-variant">Agency: Bafoussam • Ref: #TR-1102</p>
</div>
</div>
<div className="text-right">
<p className="text-body-md font-bold text-tertiary">+2,150,000 XAF</p>
<p className="text-[10px] text-on-surface-variant">1 hour ago</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>

<button className="md:hidden fixed bottom-24 right-6 w-14 h-14 primary-gradient text-on-primary rounded-full shadow-xl z-50 flex items-center justify-center active:scale-90 transition-transform">
<span className="material-symbols-outlined text-[32px]" data-icon="add">add</span>
</button>

<nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-16 glass-card rounded-[24px] z-50 flex items-center justify-around px-sm border border-outline-variant/30">
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="text-[10px] font-medium">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="corporate_fare">corporate_fare</span>
<span className="text-[10px] font-medium">Agencies</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
<span className="text-[10px] font-medium">Finance</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="text-[10px] font-medium">Staff</span>
</a>
</nav>

<div className="fixed inset-0 pointer-events-none z-[-1]">
<div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[120px] rounded-full"></div>
<div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-secondary/5 blur-[100px] rounded-full"></div>
</div>
    </div>
  );
}
