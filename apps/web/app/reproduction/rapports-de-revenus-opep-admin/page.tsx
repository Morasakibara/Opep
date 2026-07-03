'use client';

import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useRoutes } from '@/hooks/useEntities';

/**
undefined
 * Route: /reproduction/rapports-de-revenus-opep-admin
 */
export default function RapportsDeRevenusOpepAdminReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* TopNavBar */}
<nav className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container border-b border-charcoal-border h-16">
<div className="flex items-center gap-4">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
<div className="hidden md:flex ml-8 gap-6 h-full items-center">
<a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-lg text-body-lg cursor-pointer active:opacity-80" href="#">Analytics</a>
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg text-body-lg cursor-pointer active:opacity-80" href="#">Trips</a>
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg text-body-lg cursor-pointer active:opacity-80" href="#">Agencies</a>
</div>
</div>
<div className="flex items-center gap-6">
<div className="relative hidden sm:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="bg-surface-container-low border border-charcoal-border rounded-lg pl-10 pr-4 py-1.5 focus:border-primary focus:ring-0 text-body-sm w-64 transition-all" placeholder="Search data..." type="text"/>
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors" data-icon="translate">translate</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors" data-icon="notifications">notifications</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors" data-icon="settings">settings</span>
<div className="h-8 w-8 rounded-full overflow-hidden border border-primary-container">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a Cameroonian female executive in a dark slate business suit, set against a blurred modern office background with subtle green and yellow lighting accents. She has a confident expression, symbolizing authority and security in transport management." src="https://lh3.googleusercontent.com/aida-public/AB6AXuButgm3PZD9_jGW23iX7AlOklgh5ttnrVYndufdD76GnR7OL4yUQp6uwcAE_6nMq0qJmMpq6rvZuvRcWny_3GIwZ8KRJ7glWnoTbTk5FAR1Do4Clusc75zi6lKDtcrnIVRbFA9Ig9tszrxDhOqn5Vz3wtlzgqlAvN-He_S8aFf1ujTBhkkFtpKk1mGIErnoJAvy3DYsZAoLO4XAdBbr0OT3hwx3bq0Z-eeVjJeiC-W1DLoIKIgGZ4wJgAxl88eIqgMe8J9gANiCwow"/>
</div>
</div>
</div>
</nav>
<div className="flex min-h-[calc(100vh-64px)]">
{/* SideNavBar */}
<aside className="hidden md:flex flex-col h-full w-[280px] bg-surface-dim border-r border-charcoal-border p-gutter gap-unit fixed left-0 top-16 bottom-0">
<div className="flex items-center gap-4 mb-6">
<div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
<span className="material-symbols-outlined" data-icon="monitoring" style={{"fontVariationSettings":"'FILL' 1"}}>monitoring</span>
</div>
<div>
<h3 className="font-title-md text-on-surface leading-tight">OPEP Admin</h3>
<p className="text-label-caps font-label-caps text-on-surface-variant">Management Portal</p>
</div>
</div>
<nav className="flex-1 flex flex-col gap-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-caps text-label-caps uppercase">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="corporate_fare">corporate_fare</span>
<span className="font-label-caps text-label-caps uppercase">Agencies</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="route">route</span>
<span className="font-label-caps text-label-caps uppercase">Trips</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="directions_bus">directions_bus</span>
<span className="font-label-caps text-label-caps uppercase">Buses</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="font-label-caps text-label-caps uppercase">Staff</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg transition-all active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="monitoring" style={{"fontVariationSettings":"'FILL' 1"}}>monitoring</span>
<span className="font-label-caps text-label-caps uppercase">Analytics</span>
</a>
</nav>
<button className="bg-primary text-on-primary font-bold py-3 rounded-lg mb-6 flex items-center justify-center gap-2 transition-transform duration-200 active:scale-95">
<span className="material-symbols-outlined" data-icon="add">add</span>
                New Trip
            </button>
<div className="border-t border-charcoal-border pt-4 flex flex-col gap-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="font-label-caps text-label-caps uppercase">Help Center</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-lg transition-all" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-label-caps text-label-caps uppercase">Logout</span>
</a>
</div>
</aside>
{/* Main Content Canvas */}
<main className="flex-1 md:ml-[280px] p-6 lg:p-10">
<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Revenue &amp; Occupancy</h1>
<p className="text-on-surface-variant font-body-lg">Performance overview for Agency: <span className="text-primary font-bold">Interurbain Sud</span></p>
</div>
<div className="flex flex-wrap items-center gap-4 bg-surface-container-low p-2 rounded-xl border border-charcoal-border">
<div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg border border-charcoal-border cursor-pointer hover:border-primary transition-all">
<span className="material-symbols-outlined text-outline" data-icon="calendar_today">calendar_today</span>
<span className="text-body-sm">Oct 1 - Oct 31, 2023</span>
<span className="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</div>
<div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg border border-charcoal-border cursor-pointer hover:border-primary transition-all">
<span className="material-symbols-outlined text-outline" data-icon="route">route</span>
<span className="text-body-sm">All Routes</span>
<span className="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</div>
<button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg font-bold text-body-sm hover:opacity-90 transition-all">
                        Apply Filter
                    </button>
</div>
</header>
{/* KPI Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
<div className="slate-surface border border-charcoal-border p-6 rounded-xl flex flex-col justify-between h-40 group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Revenue</span>
<div className="p-2 bg-primary-container/20 rounded-lg text-primary">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
</div>
</div>
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">14,280,500 <span className="text-title-md font-normal">XAF</span></h2>
<p className="text-success-green flex items-center gap-1 text-body-sm mt-1">
<span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                            +12.4% vs last month
                        </p>
</div>
</div>
<div className="slate-surface border border-charcoal-border p-6 rounded-xl flex flex-col justify-between h-40 group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Avg. Ticket Price</span>
<div className="p-2 bg-tertiary/20 rounded-lg text-tertiary">
<span className="material-symbols-outlined" data-icon="local_activity">local_activity</span>
</div>
</div>
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">6,500 <span className="text-title-md font-normal">XAF</span></h2>
<p className="text-on-surface-variant flex items-center gap-1 text-body-sm mt-1">
                            Stable pricing trend
                        </p>
</div>
</div>
<div className="slate-surface border border-charcoal-border p-6 rounded-xl flex flex-col justify-between h-40 group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Occupancy Rate</span>
<div className="p-2 bg-primary/20 rounded-lg text-primary">
<span className="material-symbols-outlined" data-icon="airline_seat_recline_normal">airline_seat_recline_normal</span>
</div>
</div>
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">84.2%</h2>
<div className="w-full bg-surface-container rounded-full h-1.5 mt-3">
<div className="bg-primary h-1.5 rounded-full" style={{"width":"84.2%"}}></div>
</div>
</div>
</div>
<div className="slate-surface border border-charcoal-border p-6 rounded-xl flex flex-col justify-between h-40 group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Refunds Issued</span>
<div className="p-2 bg-error-container/20 rounded-lg text-secondary">
<span className="material-symbols-outlined" data-icon="assignment_return">assignment_return</span>
</div>
</div>
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">240,000 <span className="text-title-md font-normal text-secondary">XAF</span></h2>
<p className="text-error-red flex items-center gap-1 text-body-sm mt-1">
<span className="material-symbols-outlined text-xs" data-icon="warning">warning</span>
                            32 refunds pending review
                        </p>
</div>
</div>
</div>
{/* Bento Grid Main Content */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Revenue per Route Bar Chart */}
<div className="lg:col-span-2 glass-card p-8 rounded-2xl relative overflow-hidden">

<div className="relative z-10">
<div className="flex justify-between items-center mb-8">
<h3 className="font-title-md text-on-surface">Revenue per Route</h3>
<span className="material-symbols-outlined text-outline cursor-pointer" data-icon="more_horiz">more_horiz</span>
</div>
<div className="space-y-6 h-[300px] flex flex-col justify-end">
<div className="flex items-end gap-6 h-full px-4">
{/* Douala - Yaoundé */}
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-primary-container relative rounded-t-lg transition-all duration-500 group-hover:bg-primary" style={{"height":"90%"}}>
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-label-caps text-primary opacity-0 group-hover:opacity-100 transition-opacity">5.2M</div>
</div>
<span className="text-label-caps text-on-surface-variant text-center whitespace-nowrap">DLA-YAO</span>
</div>
{/* Yaoundé - Bafoussam */}
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-primary-container relative rounded-t-lg transition-all duration-500 group-hover:bg-primary" style={{"height":"65%"}}>
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-label-caps text-primary opacity-0 group-hover:opacity-100 transition-opacity">3.8M</div>
</div>
<span className="text-label-caps text-on-surface-variant text-center whitespace-nowrap">YAO-BAF</span>
</div>
{/* Douala - Kribi */}
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-primary-container relative rounded-t-lg transition-all duration-500 group-hover:bg-primary" style={{"height":"45%"}}>
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-label-caps text-primary opacity-0 group-hover:opacity-100 transition-opacity">2.4M</div>
</div>
<span className="text-label-caps text-on-surface-variant text-center whitespace-nowrap">DLA-KRI</span>
</div>
{/* Yaoundé - Bamenda */}
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-primary-container relative rounded-t-lg transition-all duration-500 group-hover:bg-primary" style={{"height":"30%"}}>
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-label-caps text-primary opacity-0 group-hover:opacity-100 transition-opacity">1.2M</div>
</div>
<span className="text-label-caps text-on-surface-variant text-center whitespace-nowrap">YAO-BDA</span>
</div>
{/* Maroua - Garoua */}
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-primary-container relative rounded-t-lg transition-all duration-500 group-hover:bg-primary" style={{"height":"55%"}}>
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-label-caps text-primary opacity-0 group-hover:opacity-100 transition-opacity">2.9M</div>
</div>
<span className="text-label-caps text-on-surface-variant text-center whitespace-nowrap">MAR-GAR</span>
</div>
</div>
</div>
</div>
</div>
{/* Occupancy Insights */}
<div className="slate-surface border border-charcoal-border p-8 rounded-2xl">
<h3 className="font-title-md text-on-surface mb-6">Occupancy Insights</h3>
<div className="space-y-6">
<div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-charcoal-border">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-success-green/10 text-success-green flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="verified">verified</span>
</div>
<div>
<p className="text-body-sm font-bold">Peak Route</p>
<p className="text-label-caps text-on-surface-variant">DLA - YAO (Fri Evening)</p>
</div>
</div>
<span className="text-primary font-bold">98%</span>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-charcoal-border">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="schedule">schedule</span>
</div>
<div>
<p className="text-body-sm font-bold">Avg. Fill Time</p>
<p className="text-label-caps text-on-surface-variant">Tickets sold before launch</p>
</div>
</div>
<span className="text-primary font-bold">4.2h</span>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-charcoal-border">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="low_priority">low_priority</span>
</div>
<div>
<p className="text-body-sm font-bold">Lowest Fill</p>
<p className="text-label-caps text-on-surface-variant">YAO - BDA (Tue Morning)</p>
</div>
</div>
<span className="text-secondary font-bold">42%</span>
</div>
</div>
<button className="w-full mt-8 py-3 border border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined" data-icon="visibility">visibility</span>
                        View Detailed Log
                    </button>
</div>
</div>
{/* Recent Transactions Section */}
<section className="mt-10">
<div className="flex justify-between items-center mb-6">
<h3 className="font-title-md text-on-surface">Recent Transactions</h3>
<div className="flex gap-2">
<button className="p-2 bg-surface-container border border-charcoal-border rounded-lg text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
</button>
<button className="p-2 bg-surface-container border border-charcoal-border rounded-lg text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="download">download</span>
</button>
</div>
</div>
<div className="slate-surface border border-charcoal-border rounded-2xl overflow-hidden overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-high border-b border-charcoal-border">
<th className="px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Transaction ID</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Customer / Route</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Date &amp; Time</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Amount (XAF)</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Status</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">
{/* Row 1 */}
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-92834</td>
<td className="px-6 py-4">
<p className="font-bold text-body-sm">Jean-Pierre Mbe</p>
<p className="text-label-caps text-on-surface-variant uppercase">Douala → Yaoundé</p>
</td>
<td className="px-6 py-4 text-body-sm">24 Oct, 14:30</td>
<td className="px-6 py-4 font-bold">6,500</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-green/10 text-success-green border border-success-green/20">
                                        Success
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:underline text-body-sm">Details</button>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-92835</td>
<td className="px-6 py-4">
<p className="font-bold text-body-sm">Alice Ngo</p>
<p className="text-label-caps text-on-surface-variant uppercase">Kribi → Douala</p>
</td>
<td className="px-6 py-4 text-body-sm">24 Oct, 14:15</td>
<td className="px-6 py-4 font-bold">4,000</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                                        Refunded
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:underline text-body-sm">Details</button>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-92836</td>
<td className="px-6 py-4">
<p className="font-bold text-body-sm">Samuel Eto'o</p>
<p className="text-label-caps text-on-surface-variant uppercase">Yaoundé → Douala</p>
</td>
<td className="px-6 py-4 text-body-sm">24 Oct, 13:50</td>
<td className="px-6 py-4 font-bold">6,500</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary/10 text-tertiary border border-tertiary/20">
                                        Pending
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:underline text-body-sm">Details</button>
</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4 font-mono-ticket text-mono-ticket">#TX-92837</td>
<td className="px-6 py-4">
<p className="font-bold text-body-sm">Marie Curie</p>
<p className="text-label-caps text-on-surface-variant uppercase">Douala → Kribi</p>
</td>
<td className="px-6 py-4 text-body-sm">24 Oct, 13:40</td>
<td className="px-6 py-4 font-bold">4,000</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-green/10 text-success-green border border-success-green/20">
                                        Success
                                    </span>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:underline text-body-sm">Details</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="mt-4 flex items-center justify-between">
<p className="text-body-sm text-on-surface-variant">Showing 1-10 of 1,240 transactions</p>
<div className="flex gap-2">
<button className="w-8 h-8 flex items-center justify-center rounded border border-charcoal-border text-on-surface-variant hover:border-primary">
<span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-charcoal-border text-on-surface-variant hover:border-primary">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-charcoal-border text-on-surface-variant hover:border-primary">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-charcoal-border text-on-surface-variant hover:border-primary">
<span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</section>
</main>
</div>
{/* Floating Action Button (Contextual) */}
<button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 animate-pulse-subtle">
<span className="material-symbols-outlined" data-icon="add_chart" style={{"fontVariationSettings":"'FILL' 1"}}>add_chart</span>
</button>
    </div>
  );
}
