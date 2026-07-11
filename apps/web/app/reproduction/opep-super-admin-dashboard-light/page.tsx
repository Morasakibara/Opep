'use client';

import React, { useState } from 'react';
import { useAvailableTrips } from '@/hooks/useTrips';
import { useAgencies, useBuses } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/opep-super-admin-dashboard-light
 */
export default function OpepSuperAdminDashboardLightReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
    const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"analytics","label":"Analytics"},{"icon":"settings","label":"Settings"}];
  const bottom = [{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
            {/* Shell: Sidebar Navigation */}
<Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={0}
  onNavChange={(index: number) => setActiveNav(String(index))}
  subtitle="Super Admin"
/>
{/* Main Content Area */}
<main className="md:ml-[280px] min-h-screen">
{/* Top Navigation */}
<header className="flex justify-between items-center px-margin-desktop h-16 w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-charcoal-border">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-dim border border-charcoal-border rounded-full py-2 pl-10 pr-4 text-[14px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Search agencies, transactions, or users..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex gap-4 text-on-surface-variant">
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors relative">
                    notifications
                    <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">settings</span>
</div>
<div className="h-8 w-[1px] bg-charcoal-border"></div>
<div className="flex items-center gap-3 cursor-pointer group">
<div className="text-right hidden sm:block">
<p className="text-[14px] font-bold text-on-surface group-hover:text-primary transition-colors">Super Admin</p>
<p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">System Root</p>
</div>
<img className="w-10 h-10 rounded-full border-2 border-primary object-cover" data-alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmBdqacwmem2UtgDTYLm0IAU77_Pbm_HHJEJTdZC1XHz8v6oiD-ltbr0sfgsCKqUTHwAYbSq1PqIurIvUR-OmYkvWzmWbRsnKrhvr2FQiZXHpHYBKFFajaKBGgoXKSBQLXjNWGfUR5b6yfzuXsChkcf2HY9lu8MeFXi0cyizr5XMCUkot71dEweWOa3Hpo1dw4OROx4gOYdQkV9mDunOWpvzTQwiLgq6eTZKXEAZwr-Pq0nTWg3yf54KrpxMVSdyC0dCoXzh5qlU"/>
</div>
</div>
</header>
<div className="p-margin-desktop space-y-gutter">
{/* Page Title & Quick Actions */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 className="text-3xl font-bold text-on-surface">System Overview</h2>
<p className="text-on-surface-variant">Platform health and performance metrics for the last 30 days.</p>
</div>
<div className="flex gap-3">
<button className="px-4 py-2 bg-white text-on-surface border border-charcoal-border rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-all text-sm font-semibold shadow-sm">
<span className="material-symbols-outlined text-[18px]">download</span>
                    Export Report
                </button>
<button className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:brightness-110 transition-all text-sm font-bold shadow-md shadow-primary/10">
<span className="material-symbols-outlined text-[18px]">refresh</span>
                    Sync Data
                </button>
</div>
</div>
{/* Dashboard Stats Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
{/* Revenue Card */}
<div className="glass-card p-6 rounded-xl relative overflow-hidden group">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-all"></div>
<div className="flex items-center justify-between mb-4">
<div className="w-12 h-12 rounded-xl bg-primary-container/60 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"'FILL' 1"}}>payments</span>
</div>
<span className="text-success-green flex items-center gap-1 font-bold text-sm bg-success-green/10 px-2 py-0.5 rounded-full">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
                        +12.5%
                    </span>
</div>
<p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-1">Total Revenue</p>
<h3 className="text-2xl font-bold text-on-surface">142 850 000 <span className="text-sm font-normal text-on-surface-variant">FCFA</span></h3>
</div>
{/* Agencies Card */}
<div className="glass-card p-6 rounded-xl relative overflow-hidden group">
<div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-tertiary/10 transition-all"></div>
<div className="flex items-center justify-between mb-4">
<div className="w-12 h-12 rounded-xl bg-tertiary-container/60 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"'FILL' 1"}}>corporate_fare</span>
</div>
<span className="text-success-green flex items-center gap-1 font-bold text-sm bg-success-green/10 px-2 py-0.5 rounded-full">
<span className="material-symbols-outlined text-[16px]">add_circle</span>
                        +4 New
                    </span>
</div>
<p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-1">Registered Agencies</p>
<h3 className="text-2xl font-bold text-on-surface">48 <span className="text-sm font-normal text-on-surface-variant">Partners</span></h3>
</div>
{/* Active Users Card */}
<div className="glass-card p-6 rounded-xl relative overflow-hidden group">
<div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-secondary/10 transition-all"></div>
<div className="flex items-center justify-between mb-4">
<div className="w-12 h-12 rounded-xl bg-secondary-container/60 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"'FILL' 1"}}>person_pin_circle</span>
</div>
<span className="text-warning-yellow flex items-center gap-1 font-bold text-sm bg-warning-yellow/10 px-2 py-0.5 rounded-full">
<span className="material-symbols-outlined text-[16px]">trending_down</span>
                        -2.1%
                    </span>
</div>
<p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-1">Active Users</p>
<h3 className="text-2xl font-bold text-on-surface">24.5k <span className="text-sm font-normal text-on-surface-variant">Live</span></h3>
</div>
{/* System Health */}
<div className="glass-card p-6 rounded-xl relative overflow-hidden group">
<div className="absolute top-0 right-0 w-32 h-32 bg-success-green/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-success-green/10 transition-all"></div>
<div className="flex items-center justify-between mb-4">
<div className="w-12 h-12 rounded-xl bg-success-green/10 flex items-center justify-center text-success-green">
<span className="material-symbols-outlined text-[28px] animate-pulse-soft">sensors</span>
</div>
<span className="px-2 py-1 bg-success-green/10 text-success-green text-[10px] font-bold rounded-full uppercase">Optimal</span>
</div>
<p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-1">System Health</p>
<h3 className="text-2xl font-bold text-on-surface">99.98% <span className="text-sm font-normal text-on-surface-variant">Uptime</span></h3>
</div>
</div>
{/* Main Bento Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
{/* Revenue Growth Chart */}
<div className="lg:col-span-2 glass-card rounded-2xl p-gutter flex flex-col">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="text-xl font-bold text-on-surface">Revenue Growth</h3>
<p className="text-sm text-on-surface-variant">Monthly platform transaction volume</p>
</div>
<select className="bg-surface-container-high border-charcoal-border rounded-lg text-sm px-4 py-2 outline-none focus:border-primary font-medium">
<option>Last 6 Months</option>
<option>Last Year</option>
</select>
</div>
{/* Simulated Chart Visualization */}
<div className="flex-1 min-h-[300px] flex items-end gap-4 px-4 pb-2">
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-surface-container-highest rounded-t-lg relative transition-all group-hover:bg-primary/30" style={{"height":"45%"}}>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">18M</div>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase">JAN</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-surface-container-highest rounded-t-lg relative transition-all group-hover:bg-primary/30" style={{"height":"60%"}}>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">22M</div>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase">FEB</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-surface-container-highest rounded-t-lg relative transition-all group-hover:bg-primary/30" style={{"height":"55%"}}>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">20M</div>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase">MAR</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-primary/40 rounded-t-lg relative transition-all group-hover:bg-primary" style={{"height":"85%"}}>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary px-2 py-1 rounded text-[10px] text-on-primary">28M</div>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase">APR</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-surface-container-highest rounded-t-lg relative transition-all group-hover:bg-primary/30" style={{"height":"70%"}}>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">25M</div>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase">MAY</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-surface-container-highest rounded-t-lg relative transition-all group-hover:bg-primary/30" style={{"height":"78%"}}>
<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">27M</div>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase">JUN</span>
</div>
</div>
</div>
{/* Recent Registered Agencies */}
<div className="glass-card rounded-2xl p-gutter flex flex-col">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-bold text-on-surface">New Agencies</h3>
<a className="text-primary text-sm font-bold hover:underline" href="#">View All</a>
</div>
<div className="space-y-4 flex-1 custom-scrollbar overflow-y-auto">
{/* Agency Item 1 */}
<div className="flex items-center gap-4 p-3 rounded-xl bg-white border border-charcoal-border hover:border-primary/40 transition-all cursor-pointer group shadow-sm">
<div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center p-1 border border-charcoal-border">
<img className="w-full h-full object-contain" data-alt="General Express" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQD-3lKfC2N6nwS8vrvSqpGpgb8ozKoar6Zij2-BUssrENdF9KUf2P7l0h3qHDtmZ2gJi4rmGdtVlRCcLiGni9PG67K6Re8XwWFlNd2vjcsTJvd6LDKTfayEsTawBJDZ-ToSYoXDH9k45MFVlC_-nKE-cwOLBZKyl6iSGY-RNcNgjdCM0UchDuvtx7bHSeF34_66_tuD9q03DGgbGash8yOiez631WS2Xw_6rwpzDzYs6xA_BYxnqpM4mf4UCGyrEcdLiaQLad7Ec"/>
</div>
<div className="flex-1">
<p className="font-bold text-on-surface group-hover:text-primary transition-colors">General Express</p>
<p className="text-[12px] text-on-surface-variant font-medium">Yaoundé HQ • 12 Buses</p>
</div>
<div className="text-right">
<p className="text-[12px] font-bold text-success-green">Active</p>
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Verified</p>
</div>
</div>
{/* Agency Item 2 */}
<div className="flex items-center gap-4 p-3 rounded-xl bg-white border border-charcoal-border hover:border-primary/40 transition-all cursor-pointer group shadow-sm">
<div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center p-1 border border-charcoal-border">
<img className="w-full h-full object-contain" data-alt="Touristique Express" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy0dtoo8jO2idfBIRwp-XJZPgdBOuH7XboapefhLLtnZqcTfeQcK_apgTNAD6YxsA53wt0nUvb11jnYEK09eOJFpLbEMpshY1layGDk4vrFpnfcqvw0ma5Fw7meZRHR29lKwaetVyu9dvFjykqQAXeN1r6rpOYjY0XAWJxLMzD2-1mXWmGfHNikhdU9u6V-LKX6l-uQEUDqlCeCjMwttJ7-dyk3_7fkQmCkR9DWmW8w_lkoSMKEv7qRbQyg-brxyfPnfhOCXt5SFs"/>
</div>
<div className="flex-1">
<p className="font-bold text-on-surface group-hover:text-primary transition-colors">Touristique Express</p>
<p className="text-[12px] text-on-surface-variant font-medium">Douala Base • 24 Buses</p>
</div>
<div className="text-right">
<p className="text-[12px] font-bold text-success-green">Active</p>
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Verified</p>
</div>
</div>
{/* Agency Item 3 */}
<div className="flex items-center gap-4 p-3 rounded-xl bg-white border border-charcoal-border hover:border-primary/40 transition-all cursor-pointer group shadow-sm">
<div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center p-1 border border-charcoal-border">
<img className="w-full h-full object-contain" data-alt="Buca Voyage" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUAEw-zsFgN6S62ba_01Jenpujo9ZDMMb1g60MRdhfOwJmOS3BEsn1FNNIObJEotpUaphk7NNsD7p52NNXOoTZPojMwwzl4j4KV2ymAd-OlXhcUa9nUdgR_64kcKALZ4c5jHEvfFp0T-HH3FTZLg-qCDGPyFd_SGWqf2kcmoeTWICG6Bq7V-xZQ5MJ9fRw1IScMKquyC3vQAtysXAoFgRrGJdIi5DHzjcjeoSIP8toEn6R5H4bumgizUszwWXsrLuXj-HKyBStZbM"/>
</div>
<div className="flex-1">
<p className="font-bold text-on-surface group-hover:text-primary transition-colors">Buca Voyage</p>
<p className="text-[12px] text-on-surface-variant font-medium">Kribi Route • 8 Buses</p>
</div>
<div className="text-right">
<p className="text-[12px] font-bold text-warning-yellow">Pending</p>
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Reviewing</p>
</div>
</div>
</div>
</div>
</div>
{/* Bottom Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
{/* Transaction History */}
<div className="glass-card rounded-2xl overflow-hidden border border-charcoal-border shadow-sm">
<div className="p-gutter border-b border-charcoal-border flex items-center justify-between bg-white">
<h3 className="text-lg font-bold text-on-surface">Live Transactions</h3>
<span className="flex items-center gap-2 text-success-green text-sm font-bold">
<span className="w-2 h-2 bg-success-green rounded-full animate-pulse"></span>
                        Live Stream
                    </span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-dim text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
<tr>
<th className="px-gutter py-4">Transaction ID</th>
<th className="px-gutter py-4">Agency</th>
<th className="px-gutter py-4">Amount</th>
<th className="px-gutter py-4">Method</th>
<th className="px-gutter py-4">Status</th>
</tr>
</thead>
<tbody className="text-sm divide-y divide-charcoal-border bg-white">
<tr className="hover:bg-surface-dim transition-colors">
<td className="px-gutter py-4 font-mono font-medium text-on-surface-variant">TXN-492102</td>
<td className="px-gutter py-4 font-bold">General Express</td>
<td className="px-gutter py-4 font-bold text-primary">12,500 FCFA</td>
<td className="px-gutter py-4 font-medium">Orange Money</td>
<td className="px-gutter py-4">
<span className="px-2 py-1 rounded-full bg-success-green/10 text-success-green text-[10px] font-bold">SUCCESS</span>
</td>
</tr>
<tr className="hover:bg-surface-dim transition-colors">
<td className="px-gutter py-4 font-mono font-medium text-on-surface-variant">TXN-492103</td>
<td className="px-gutter py-4 font-bold">Touristique Express</td>
<td className="px-gutter py-4 font-bold text-primary">5,000 FCFA</td>
<td className="px-gutter py-4 font-medium">MTN MoMo</td>
<td className="px-gutter py-4">
<span className="px-2 py-1 rounded-full bg-success-green/10 text-success-green text-[10px] font-bold">SUCCESS</span>
</td>
</tr>
<tr className="hover:bg-surface-dim transition-colors">
<td className="px-gutter py-4 font-mono font-medium text-on-surface-variant">TXN-492104</td>
<td className="px-gutter py-4 font-bold">Buca Voyage</td>
<td className="px-gutter py-4 font-bold text-primary">7,500 FCFA</td>
<td className="px-gutter py-4 font-medium">Credit Card</td>
<td className="px-gutter py-4">
<span className="px-2 py-1 rounded-full bg-warning-yellow/10 text-warning-yellow text-[10px] font-bold">PENDING</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Regional Activity */}
<div className="glass-card rounded-2xl p-gutter relative overflow-hidden shadow-sm">
<div className="relative z-10">
<div className="flex items-center justify-between mb-4">
<h3 className="text-lg font-bold text-on-surface">Regional Activity</h3>
<span className="text-on-surface-variant text-sm font-semibold">Cameroon Network</span>
</div>
<div className="space-y-6">
<div className="space-y-2">
<div className="flex justify-between text-sm font-bold">
<span>Center (Yaoundé)</span>
<span className="text-primary">42% Traffic</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width":"42%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm font-bold">
<span>Littoral (Douala)</span>
<span className="text-secondary">38% Traffic</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-secondary" style={{"width":"38%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm font-bold">
<span>West (Bafoussam)</span>
<span className="text-warning-yellow">15% Traffic</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-warning-yellow" style={{"width":"15%"}}></div>
</div>
</div>
</div>
</div>
{/* Decorative Map background */}
<div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none w-64 h-64 text-on-surface">
<span className="material-symbols-outlined text-[200px]" style={{"fontVariationSettings":"'FILL' 1"}}>public</span>
</div>
</div>
</div>
</div>
</main>
{/* Bottom Nav Bar for Mobile */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-charcoal-border flex items-center justify-around px-margin-mobile z-50">
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>dashboard</span>
<span className="text-[10px] font-bold">Dashboard</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="text-[10px] font-bold">Agencies</span>
</a>
<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -translate-y-6 shadow-lg shadow-primary/30 text-on-primary border-4 border-background">
<span className="material-symbols-outlined">add</span>
</div>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">route</span>
<span className="text-[10px] font-bold">Trips</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px] font-bold">Settings</span>
</a>
</nav>
    </div>
  );
}
