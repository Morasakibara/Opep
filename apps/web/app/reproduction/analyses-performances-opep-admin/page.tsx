'use client';

import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useDrivers } from '@/hooks/useEntities';

/**
undefined
 * Route: /reproduction/analyses-performances-opep-admin
 */
export default function AnalysesPerformancesOpepAdminReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* TopNavBar */}
<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-charcoal-border">
<div className="flex items-center gap-4">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
<div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-charcoal-border ml-8 w-64">
<span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-sm text-on-surface w-full p-0" placeholder="Rechercher..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-4 text-on-surface-variant">
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">settings</span>
</div>
<div className="h-8 w-8 rounded-full overflow-hidden border border-primary">
<img className="w-full h-full object-cover" data-alt="A professional studio portrait of a Super Admin for a logistics platform, wearing business casual attire, with a neutral tech-focused background. The lighting is soft and corporate, matching a dark mode interface with deep slate and emerald green highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDatEYNhbwbj2NQ-gGZ6wkLaIo9Y09f7YL9oWgGkXw4BWkRPcGjFioomXHm9RiE3OvOaCQJynUp-96-yZU07Hf0r3lIeRAsgREROFCzYGY-0TT__gZMSCCeQQweYdCaMCZRd8qrcvosEmzZXrmQjMNzZvnxJJ-O7N0nj3psYnXK0gyMfH_JIxDQOp_KS-jxk8O-zg_Y-nd1Dc8uBXTQxCZMv68V0CaOQo_uejGREdVhoz6u-2XLDX-6Zd3GayQELBjPQOpVUbEONoo"/>
</div>
</div>
</header>
<div className="flex flex-1 overflow-hidden">
{/* SideNavBar */}
<aside className="hidden md:flex flex-col h-full w-[280px] bg-surface-dim border-r border-charcoal-border p-gutter gap-unit overflow-y-auto custom-scrollbar">
<div className="flex items-center gap-3 mb-6 px-2">
<div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
<span className="material-symbols-outlined">analytics</span>
</div>
<div>
<div className="font-headline-lg text-[20px] font-bold text-primary">OPEP Admin</div>
<div className="text-label-caps font-label-caps text-on-surface-variant opacity-60">Management Portal</div>
</div>
</div>
<nav className="flex flex-col gap-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-caps text-label-caps">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg" href="#">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="font-label-caps text-label-caps">Agencies</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg" href="#">
<span className="material-symbols-outlined">route</span>
<span className="font-label-caps text-label-caps">Trips</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg" href="#">
<span className="material-symbols-outlined">directions_bus</span>
<span className="font-label-caps text-label-caps">Buses</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg" href="#">
<span className="material-symbols-outlined">group</span>
<span className="font-label-caps text-label-caps">Staff</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">monitoring</span>
<span className="font-label-caps text-label-caps">Analytics</span>
</a>
</nav>
<button className="mt-6 mx-2 bg-primary text-on-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/10">
<span className="material-symbols-outlined">add</span>
                New Trip
            </button>
<div className="mt-auto pt-6 flex flex-col gap-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all rounded-lg" href="#">
<span className="material-symbols-outlined">help</span>
<span className="font-label-caps text-label-caps">Help Center</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all rounded-lg" href="#">
<span className="material-symbols-outlined text-secondary">logout</span>
<span className="font-label-caps text-label-caps text-secondary">Logout</span>
</a>
</div>
</aside>
{/* Main Content */}
<main className="flex-1 overflow-y-auto custom-scrollbar bg-background p-margin-desktop space-y-gutter relative">
{/* Header section with Page Title & Filter */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Analyses et rapports</h1>
<p className="text-on-surface-variant text-body-sm">Suivi temps réel des performances financières et opérationnelles.</p>
</div>
<div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl border border-charcoal-border">
<button className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-label-caps font-label-caps">Mensuel</button>
<button className="px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors text-label-caps font-label-caps">Hebdomadaire</button>
<button className="px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors text-label-caps font-label-caps">Quotidien</button>
</div>
</div>
{/* Bento Grid - Key Metrics */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
<div className="glass-card p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant text-label-caps font-label-caps">REVENUS TOTAUX (MAI)</span>
<span className="material-symbols-outlined text-primary">payments</span>
</div>
<div className="font-headline-lg text-headline-lg">12 450 000 <span className="text-body-sm opacity-60">FCFA</span></div>
<div className="flex items-center gap-1 text-success-green text-label-caps font-label-caps">
<span className="material-symbols-outlined text-sm">trending_up</span>
                        +14.2% vs Avril
                    </div>
</div>
<div className="glass-card p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant text-label-caps font-label-caps">TAUX D'OCCUPATION</span>
<span className="material-symbols-outlined text-tertiary">airline_seat_recline_normal</span>
</div>
<div className="font-headline-lg text-headline-lg">78.4%</div>
<div className="flex items-center gap-1 text-on-surface-variant text-label-caps font-label-caps">
<span className="material-symbols-outlined text-sm">remove</span>
                        Stable
                    </div>
</div>
<div className="glass-card p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant text-label-caps font-label-caps">BILLETS VENDUS</span>
<span className="material-symbols-outlined text-secondary">confirmation_number</span>
</div>
<div className="font-headline-lg text-headline-lg">4,289</div>
<div className="flex items-center gap-1 text-success-green text-label-caps font-label-caps">
<span className="material-symbols-outlined text-sm">trending_up</span>
                        +8.1%
                    </div>
</div>
<div className="glass-card p-6 rounded-xl flex flex-col gap-2">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant text-label-caps font-label-caps">TRIPS ANNULÉS</span>
<span className="material-symbols-outlined text-error">cancel</span>
</div>
<div className="font-headline-lg text-headline-lg">12</div>
<div className="flex items-center gap-1 text-error text-label-caps font-label-caps">
<span className="material-symbols-outlined text-sm">warning</span>
                        +3% vs Moyenne
                    </div>
</div>
</div>
{/* Revenue Chart Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
<div className="lg:col-span-2 glass-card p-6 rounded-xl">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="font-title-md text-title-md text-on-surface">Évolution des Revenus</h3>
<p className="text-body-sm text-on-surface-variant">Revenus mensuels consolidés par agence</p>
</div>
<div className="flex gap-2">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">VIP</span>
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold">Standard</span>
</div>
</div>
<div className="h-[350px] w-full">
<canvas id="revenueChart"></canvas>
</div>
</div>
{/* Occupation rate per line */}
<div className="glass-card p-6 rounded-xl flex flex-col">
<div className="flex items-center justify-between mb-6">
<h3 className="font-title-md text-title-md text-on-surface">Taux par Ligne</h3>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
</div>
<div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
<div className="space-y-2">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface font-medium">Douala - Yaoundé</span>
<span className="text-primary font-bold">92%</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{"width":"92%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface font-medium">Yaoundé - Bafoussam</span>
<span className="text-tertiary font-bold">74%</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-tertiary rounded-full" style={{"width":"74%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface font-medium">Douala - Kribi</span>
<span className="text-success-green font-bold">88%</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-success-green rounded-full" style={{"width":"88%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface font-medium">Yaoundé - Bertoua</span>
<span className="text-on-surface-variant font-bold">45%</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-on-surface-variant rounded-full" style={{"width":"45%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface font-medium">Garoua - Maroua</span>
<span className="text-primary font-bold">68%</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{"width":"68%"}}></div>
</div>
</div>
</div>
<button className="mt-6 w-full border border-charcoal-border py-2 text-label-caps font-label-caps rounded-lg hover:bg-surface-container-high transition-colors">
                        Voir tout le réseau
                    </button>
</div>
</div>
{/* Detailed Table & Distribution */}
<div className="grid grid-cols-1 xl:grid-cols-4 gap-gutter">
{/* Agency Performance Table */}
<div className="xl:col-span-3 glass-card rounded-xl overflow-hidden">
<div className="p-6 border-b border-charcoal-border flex items-center justify-between bg-surface-container-low">
<h3 className="font-title-md text-title-md text-on-surface">Performance des Agences</h3>
<button className="flex items-center gap-2 text-primary text-label-caps font-label-caps hover:underline">
<span className="material-symbols-outlined text-sm">download</span>
                            Exporter CSV
                        </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container-highest/30 text-on-surface-variant text-label-caps font-label-caps">
<tr>
<th className="px-6 py-4">Agence</th>
<th className="px-6 py-4">Transactions</th>
<th className="px-6 py-4">Chiffre d'Affaires</th>
<th className="px-6 py-4">Ticket Moyen</th>
<th className="px-6 py-4">Statut</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">
<tr className="hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary font-bold">G</div>
<span className="text-on-surface font-medium">General Express</span>
</div>
</td>
<td className="px-6 py-4 text-on-surface">1,820</td>
<td className="px-6 py-4 text-on-surface">5,460,000 FCFA</td>
<td className="px-6 py-4 text-on-surface">3,000 FCFA</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded bg-success-green/10 text-success-green text-[10px] font-bold">OPÉRATIONNEL</span>
</td>
</tr>
<tr className="hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-tertiary-container/20 flex items-center justify-center text-tertiary font-bold">F</div>
<span className="text-on-surface font-medium">Finexs Voyages</span>
</div>
</td>
<td className="px-6 py-4 text-on-surface">1,240</td>
<td className="px-6 py-4 text-on-surface">4,960,000 FCFA</td>
<td className="px-6 py-4 text-on-surface">4,000 FCFA</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded bg-success-green/10 text-success-green text-[10px] font-bold">OPÉRATIONNEL</span>
</td>
</tr>
<tr className="hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center text-secondary font-bold">T</div>
<span className="text-on-surface font-medium">Touristique Express</span>
</div>
</td>
<td className="px-6 py-4 text-on-surface">945</td>
<td className="px-6 py-4 text-on-surface">2,030,500 FCFA</td>
<td className="px-6 py-4 text-on-surface">2,150 FCFA</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded bg-warning-yellow/10 text-warning-yellow text-[10px] font-bold">MAINTENANCE</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Distribution Chart (Doughnut) */}
<div className="glass-card p-6 rounded-xl flex flex-col justify-between">
<h3 className="font-title-md text-title-md text-on-surface mb-4">Mode de Paiement</h3>
<div className="relative h-48 w-full flex items-center justify-center">
<canvas id="paymentChart"></canvas>
</div>
<div className="mt-4 space-y-2">
<div className="flex items-center justify-between text-body-sm">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary"></div>
<span className="text-on-surface-variant">Mobile Money</span>
</div>
<span className="text-on-surface">62%</span>
</div>
<div className="flex items-center justify-between text-body-sm">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-tertiary"></div>
<span className="text-on-surface-variant">Orange Money</span>
</div>
<span className="text-on-surface">28%</span>
</div>
<div className="flex items-center justify-between text-body-sm">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<span className="text-on-surface-variant">Espèces / Guichet</span>
</div>
<span className="text-on-surface">10%</span>
</div>
</div>
</div>
</div>
{/* Background Decorative Elements */}
<div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
<div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
</main>
</div>
{/* Scripts for Charts */}
    </div>
  );
}
