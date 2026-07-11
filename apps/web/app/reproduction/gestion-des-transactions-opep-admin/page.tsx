'use client';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useReservations } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/gestion-des-transactions-opep-admin
 */
export default function GestionDesTransactionsOpepAdminReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: reservations, isLoading: reservationsLoading, error: reservationsError, refetch: reservationsRefetch } = useReservations();
  const [showSuccess, setShowSuccess] = useState(false);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* Sidebar */}
          <Sidebar
  items={[{"icon":"dashboard","label":"Dashboard"},{"icon":"account_balance_wallet","label":"Transactions"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"route","label":"Trips"},{"icon":"monitoring","label":"Analytics"}]}
  bottomItems={[{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}]}
  activeIndex={1}
  onNavChange={(index: number) => setActiveNav(String(index))}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">payments</span></div>}
/>

<main className="flex-1 md:ml-[280px] min-h-screen flex flex-col">

<header className="flex justify-between items-center px-margin-desktop h-16 w-full sticky top-0 z-40 bg-surface-container border-b border-charcoal-border">
<div className="flex items-center gap-4">
<button className="md:hidden p-2 text-on-surface">
<span className="material-symbols-outlined">menu</span>
</button>
<div className="relative hidden lg:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
<input className="bg-surface-variant border-none rounded-full pl-10 pr-4 py-1.5 w-64 text-body-sm font-body-sm focus:ring-1 focus:ring-primary" placeholder="Rechercher / Search..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
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
<div className="h-8 w-8 rounded-full overflow-hidden border border-charcoal-border">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a senior administrator for a high-tech logistics firm. The subject is wearing a crisp dark suit and smiling confidently against a background of soft-focus data screens in deep charcoal and emerald tones. The lighting is sophisticated, with sharp key highlights and soft ambient fill, creating a modern corporate aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhwxRS7f1NUpue8WXFbxejNl9XMFdffvudZ8W30vCLunMbXsoTiA2MMz0T8Hz0yGXg-CzEbJzC9L-vExuarb8w4ikVf1uTRYCsoopH8VXwzfTVUyG5-KjeG3ccR7JiaFmiiws-9Ud-3GYG6CCSV2NF3PI6UzXGP0jA_0j2XFZ4YArQukd2UfTX5aJSHZ6788HA7us6L3oTYcZc_eNh-4QyjbchD2X6Po9FK5aHluv5GMImjpaVn-peKBeQrQoKCsyMKaJqSRiUAcw"/>
</div>
</div>
</header>
<section className="p-margin-desktop flex flex-col gap-gutter">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Gestion des Transactions</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Payments Management &amp; Oversight</p>
</div>
<div className="flex items-center gap-3">
<button className="flex items-center gap-2 bg-glass-fill border border-charcoal-border px-4 py-2 rounded-lg text-body-sm font-body-sm hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-lg">download</span>
<span>Exporter / Export</span>
</button>
<button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-body-sm font-body-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all">
<span className="material-symbols-outlined text-lg">add</span>
<span>New Transaction</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="glass-card p-6 rounded-xl flex items-center justify-between overflow-hidden relative group">

<div className="relative z-10">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">REVENU JOURNALIER / DAILY REVENUE</p>
<h3 className="font-headline-lg text-headline-lg text-primary">{reservationsLoading ? '...' : '2,450,000 FCFA'}</h3>
<div className="flex items-center gap-1 mt-2 text-success-green">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="font-body-sm text-body-sm">+12.4% vs yesterday</span>
</div>
</div>
<div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center relative z-10">
<span className="material-symbols-outlined text-primary text-3xl">payments</span>
</div>
</div>

<div className="glass-card p-6 rounded-xl flex items-center justify-between overflow-hidden relative group">
<div className="relative z-10">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">TAUX DE RÉUSSITE / SUCCESS RATE</p>
<h3 className="font-headline-lg text-headline-lg text-tertiary">98.2%</h3>
<div className="flex items-center gap-1 mt-2 text-on-surface-variant">
<span className="material-symbols-outlined text-sm">check_circle</span>
<span className="font-body-sm text-body-sm">4,521 Successful trades</span>
</div>
</div>
<div className="w-14 h-14 bg-tertiary/10 rounded-full flex items-center justify-center relative z-10">
<span className="material-symbols-outlined text-tertiary text-3xl">verified</span>
</div>
</div>

<div className="glass-card p-6 rounded-xl flex items-center justify-between overflow-hidden relative group">
<div className="relative z-10">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">MÉTHODE PRÉFÉRÉE / POPULAR METHOD</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface">MTN MoMo</h3>
<div className="flex items-center gap-1 mt-2 text-on-surface-variant">
<span className="material-symbols-outlined text-sm">account_balance</span>
<span className="font-body-sm text-body-sm">62% total volume</span>
</div>
</div>
<div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center relative z-10">
<span className="material-symbols-outlined text-secondary text-3xl">bolt</span>
</div>
</div>
</div>

<div className="flex flex-wrap gap-4 items-center bg-surface-container-low p-4 rounded-xl border border-charcoal-border">
<div className="flex-1 min-w-[200px]">
<label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Provider / Opérateur</label>
<select className="w-full bg-surface-variant border-charcoal-border rounded-lg text-body-sm px-3 py-2 focus:ring-primary focus:border-primary">
<option>All Providers</option>
<option>MTN MoMo</option>
<option>Orange Money</option>
<option>Cash</option>
</select>
</div>
<div className="flex-1 min-w-[200px]">
<label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Date Range</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">calendar_today</span>
<input className="w-full bg-surface-variant border-charcoal-border rounded-lg text-body-sm pl-10 pr-3 py-2 focus:ring-primary focus:border-primary" type="date"/>
</div>
</div>
<div className="flex-1 min-w-[200px]">
<label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Status / État</label>
<select className="w-full bg-surface-variant border-charcoal-border rounded-lg text-body-sm px-3 py-2 focus:ring-primary focus:border-primary">
<option>All Status</option>
<option>Success</option>
<option>Pending</option>
<option>Refunded</option>
</select>
</div>
<div className="self-end pb-1">
<button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-caps text-label-caps hover:brightness-110 active:scale-95 transition-all">
                        Apply Filters
                    </button>
</div>
</div>

<div className="glass-card rounded-xl overflow-hidden">
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-charcoal-border bg-surface-container-high">
<th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Transaction ID</th>
<th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Reservation</th>
<th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Customer / Client</th>
<th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Amount / Montant</th>
<th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Method</th>
<th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Status</th>
<th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">

<tr className="hover:bg-glass-fill transition-colors">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-8921-001</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-primary">DLA-YDE-44</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs">EK</div>
<span className="font-body-sm text-body-sm">Emmanuel Kamga</span>
</div>
</td>
<td className="px-6 py-4 font-title-md text-title-md">12,500 <span className="text-xs text-on-surface-variant">FCFA</span></td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-[#FFCC00] flex items-center justify-center text-[10px] font-bold text-black">M</div>
<span className="font-body-sm text-body-sm">MTN MoMo</span>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-green/10 text-success-green">
                                        Success
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-glass-fill transition-colors">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-8921-002</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-primary">KRI-DLA-12</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs">MN</div>
<span className="font-body-sm text-body-sm">Marie Ngo</span>
</div>
</td>
<td className="px-6 py-4 font-title-md text-title-md">8,000 <span className="text-xs text-on-surface-variant">FCFA</span></td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-[#FF6600] flex items-center justify-center text-[10px] font-bold text-white">O</div>
<span className="font-body-sm text-body-sm">Orange Money</span>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary/10 text-tertiary">
                                        Pending
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-glass-fill transition-colors">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-8921-003</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-primary">BA-YDE-99</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs">FT</div>
<span className="font-body-sm text-body-sm">Francis Tadjue</span>
</div>
</td>
<td className="px-6 py-4 font-title-md text-title-md">15,000 <span className="text-xs text-on-surface-variant">FCFA</span></td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-primary">
<span className="material-symbols-outlined text-lg">payments</span>
<span className="font-body-sm text-body-sm">Cash</span>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-green/10 text-success-green">
                                        Success
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-glass-fill transition-colors">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-8921-004</td>
<td className="px-6 py-4 font-mono-ticket text-mono-ticket text-primary">YDE-GAR-21</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs">AS</div>
<span className="font-body-sm text-body-sm">Abdoulaye Sali</span>
</div>
</td>
<td className="px-6 py-4 font-title-md text-title-md">25,000 <span className="text-xs text-on-surface-variant">FCFA</span></td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-[#FFCC00] flex items-center justify-center text-[10px] font-bold text-black">M</div>
<span className="font-body-sm text-body-sm">MTN MoMo</span>
</div>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                        Refunded
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-4 bg-surface-container-low border-t border-charcoal-border flex items-center justify-between">
<span className="text-body-sm text-on-surface-variant">Showing 4 of 480 transactions</span>
<div className="flex items-center gap-2">
<button className="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
<span className="material-symbols-outlined">chevron_left</span>
</button>
<div className="flex gap-1">
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-xs font-bold">1</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-xs font-medium">2</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-xs font-medium">3</button>
</div>
<button className="p-2 rounded-lg hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>info</span>
<p className="font-body-sm text-body-sm text-on-surface-variant flex-1">
                    System status: All payment gateways (MTN MoMo, Orange Money, UBA Cash) are operational. Last sync completed 2 minutes ago.
                </p>
<button className="text-primary font-label-caps text-label-caps underline">Check Logs</button>
</div>
</section>
</main>

<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container border-t border-charcoal-border flex justify-around p-2 z-50">
<button className="flex flex-col items-center gap-1 p-2 text-on-surface-variant">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-medium">Home</span>
</button>
<button className="flex flex-col items-center gap-1 p-2 text-primary">
<span className="material-symbols-outlined">account_balance_wallet</span>
<span className="text-[10px] font-medium">Finance</span>
</button>
<button className="flex flex-col items-center gap-1 p-2 text-on-surface-variant">
<span className="material-symbols-outlined">directions_bus</span>
<span className="text-[10px] font-medium">Buses</span>
</button>
<button className="flex flex-col items-center gap-1 p-2 text-on-surface-variant">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] font-medium">Profile</span>
</button>
</nav>
    </div>
  );
}
