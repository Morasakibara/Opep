'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useRoutes } from '@/hooks/useEntities';

/**
undefined
 * Route: /reproduction/gestion-des-lignes-opep-admin
 */
export default function GestionDesLignesOpepAdminReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      <nav className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container border-b border-charcoal-border h-16">
<div className="flex items-center gap-4">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
</div>
<div className="hidden md:flex flex-1 max-w-md mx-8">
<div className="relative w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg pl-10 pr-4 py-2 text-body-lg focus:outline-none focus:border-primary transition-all" placeholder="Rechercher un trajet..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex gap-4">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
</div>
<div className="h-8 w-8 rounded-full overflow-hidden border border-primary">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlv6UjgRCabNL8cptL-WNFZkBQkwK_GHKHRG0cQf4cnYCCgIWau7pAPiKmz-h_aqBIkyuR8c48qqi-q4IA-25d9gLdkpE783Wy59BzfsDzkH-a9oqErnzsfdFyWTJuoFecnv3X8HtFayROKaw6pBPFR8cbkCH79Qz25ooAwagnZAokdJw11YOY-zK97zbXYgTb2IKL3EjlyqkVEPClvkX95LJd2nD_ZwarlpVnvhz6UN_c-3uL1K_WZZnfnMGLzryFAchbTKCwJjU" alt="Close up portrait of a professional African male administrator in a modern office environment, wearing a sleek suit. High-end professional photography style with a shallow depth of field, warm natural lighting from a window, and a dark slate background consistent with the OPEP transport portal corporate identity." />
</div>
</div>
</nav>

<aside className="hidden md:flex flex-col h-full p-gutter gap-unit fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] bg-surface-dim border-r border-charcoal-border z-30">
<div className="flex items-center gap-3 mb-6 px-2">
<div className="p-2 rounded-lg bg-primary-container text-on-primary-container">
<span className="material-symbols-outlined">directions_bus</span>
</div>
<div>
<div className="font-title-md text-title-md leading-none">OPEP Admin</div>
<div className="font-label-caps text-label-caps text-on-surface-variant">Management Portal</div>
</div>
</div>
<button className="mb-4 bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
<span className="material-symbols-outlined">add</span>
            New Trip
        </button>
<div className="flex flex-col gap-1 flex-1">
<a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-caps text-label-caps">Dashboard</span>
</a>
<a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="font-label-caps text-label-caps">Agencies</span>
</a>
<a className="flex items-center gap-3 p-3 bg-primary-container text-on-primary-container rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">route</span>
<span className="font-label-caps text-label-caps">Trips</span>
</a>
<a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">directions_bus</span>
<span className="font-label-caps text-label-caps">Buses</span>
</a>
<a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">group</span>
<span className="font-label-caps text-label-caps">Staff</span>
</a>
<a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">monitoring</span>
<span className="font-label-caps text-label-caps">Analytics</span>
</a>
</div>
<div className="pt-4 border-t border-charcoal-border flex flex-col gap-1">
<a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">help</span>
<span className="font-label-caps text-label-caps">Help Center</span>
</a>
<a className="flex items-center gap-3 p-3 text-on-secondary-fixed-variant hover:bg-error-container/20 rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">logout</span>
<span className="font-label-caps text-label-caps">Logout</span>
</a>
</div>
</aside>

<main className="md:ml-[280px] p-margin-mobile md:p-margin-desktop min-h-screen">
<header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Gestion des Lignes</h1>
<p className="text-on-surface-variant font-body-lg">Définissez et optimisez vos axes de transport interurbain au Cameroun.</p>
</div>
<div className="flex gap-3">
<button className="bg-surface-container-high text-on-surface border border-charcoal-border px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-surface-bright transition-colors">
<span className="material-symbols-outlined text-[20px]">file_download</span>
                    Exporter
                </button>
</div>
</header>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-margin-desktop">

<section className="lg:col-span-5 bg-slate-surface border border-charcoal-border rounded-xl p-6 custom-shadow relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none translate-x-10 -translate-y-10">
<span className="material-symbols-outlined text-[128px] text-primary">add_road</span>
</div>
<h2 className="font-title-md text-title-md text-primary mb-6 flex items-center gap-2">
<span className="material-symbols-outlined">edit_road</span>
                    Nouvelle Ligne / New Route
                </h2>
<form className="space-y-4">
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1">
<label className="font-label-caps text-label-caps text-on-surface-variant">Départ / From</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary-fixed text-[18px]">location_on</span>
<select className="w-full bg-surface-container-low border border-charcoal-border rounded-lg pl-10 pr-4 py-2.5 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary appearance-none">
<option>Douala</option>
<option>Yaoundé</option>
<option>Bafoussam</option>
<option>Garoua</option>
</select>
</div>
</div>
<div className="space-y-1">
<label className="font-label-caps text-label-caps text-on-surface-variant">Arrivée / To</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">sports_score</span>
<select className="w-full bg-surface-container-low border border-charcoal-border rounded-lg pl-10 pr-4 py-2.5 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary appearance-none">
<option>Yaoundé</option>
<option>Douala</option>
<option>Kribi</option>
<option>Bamenda</option>
</select>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1">
<label className="font-label-caps text-label-caps text-on-surface-variant">Distance (km)</label>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-2.5 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="245" type="number"/>
</div>
<div className="space-y-1">
<label className="font-label-caps text-label-caps text-on-surface-variant">Durée / Duration</label>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-2.5 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="3h 45min" type="text"/>
</div>
</div>
<div className="space-y-1">
<label className="font-label-caps text-label-caps text-on-surface-variant">Prix de Base / Base Price (FCFA)</label>
<div className="relative">
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg pl-4 pr-16 py-3 font-mono-ticket text-primary text-title-md focus:ring-1 focus:ring-primary focus:border-primary" placeholder="5000" type="number"/>
<span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">XAF</span>
</div>
</div>
<div className="pt-4">
<button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
<span className="material-symbols-outlined">save</span>
                            Enregistrer la ligne
                        </button>
</div>
</form>
</section>

<section className="lg:col-span-7 bg-slate-surface border border-charcoal-border rounded-xl p-2 custom-shadow relative group">
<div className="w-full h-full rounded-lg overflow-hidden grayscale contrast-125 opacity-40">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxtmF88j_2aWZFgerhHxQsxKhNU4Ic_-FmRfA3CfhO-OQr6d-6pY_IYeYIerDR9sf4N26_2pA3owhPhIDDaCKmZ9OUi8xu-8pTa60R8pPFKYmPCd8Ujvn41NgnHcwaUvO6AlSq9yoJ7QoZxnm39D-YlbhUirG-iL7jr5u7GO4kpscceXAIyrYMrma4m0aO1y5Ss2hgkw-N8lItAGmEJousSA1OIzqp7aLwBS6REmiHaFhegtN1WlSzAGD0A049cTgRFYjBnus6FwE" alt="Carte du réseau routier camerounais" />
</div>
<div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-12">
<div className="glass p-6 rounded-2xl border border-charcoal-border text-center max-w-sm">
<span className="material-symbols-outlined text-[48px] text-primary mb-2">map</span>
<h3 className="font-title-md text-title-md mb-2">Visualisation Géographique</h3>
<p className="text-on-surface-variant text-body-sm">Visualisez les connexions actives entre les pôles économiques du Cameroun (Douala, Yaoundé, Bafoussam).</p>
</div>
</div>
</section>
</div>

<section className="bg-slate-surface border border-charcoal-border rounded-xl custom-shadow overflow-hidden">
<div className="p-6 border-b border-charcoal-border flex justify-between items-center">
<h2 className="font-title-md text-title-md flex items-center gap-2">
<span className="material-symbols-outlined text-primary">list_alt</span>
                    Lignes Actives / Active Routes
                </h2>
<div className="flex items-center gap-2">
<span className="h-2 w-2 rounded-full bg-success-green animate-pulse"></span>
<span className="font-label-caps text-label-caps text-success-green">Mise à jour en temps réel</span>
</div>
</div>
<div className="overflow-x-auto scrollbar-hide">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps">
<tr>
<th className="px-6 py-4 font-semibold uppercase tracking-wider">Itinéraire</th>
<th className="px-6 py-4 font-semibold uppercase tracking-wider">Distance</th>
<th className="px-6 py-4 font-semibold uppercase tracking-wider">Durée Est.</th>
<th className="px-6 py-4 font-semibold uppercase tracking-wider">Prix Standard</th>
<th className="px-6 py-4 font-semibold uppercase tracking-wider">Statut</th>
<th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex flex-col items-center gap-1">
<div className="h-2 w-2 rounded-full bg-primary-container"></div>
<div className="h-4 w-px bg-charcoal-border"></div>
<div className="h-2 w-2 rounded-full bg-secondary-container"></div>
</div>
<div>
<div className="font-body-lg text-on-surface font-semibold">Douala → Yaoundé</div>
<div className="text-label-caps text-on-surface-variant uppercase">Axe Lourd N3</div>
</div>
</div>
</td>
<td className="px-6 py-4 font-body-sm text-on-surface">245 km</td>
<td className="px-6 py-4 font-body-sm text-on-surface">3h 30min</td>
<td className="px-6 py-4">
<span className="font-mono-ticket text-on-surface font-bold">6 000 <span className="text-on-surface-variant text-[10px]">FCFA</span></span>
</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full bg-success-green/10 text-success-green text-label-caps border border-success-green/20">Actif</span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-error transition-all">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex flex-col items-center gap-1">
<div className="h-2 w-2 rounded-full bg-primary-container"></div>
<div className="h-4 w-px bg-charcoal-border"></div>
<div className="h-2 w-2 rounded-full bg-secondary-container"></div>
</div>
<div>
<div className="font-body-lg text-on-surface font-semibold">Yaoundé → Bafoussam</div>
<div className="text-label-caps text-on-surface-variant uppercase">Route N4</div>
</div>
</div>
</td>
<td className="px-6 py-4 font-body-sm text-on-surface">295 km</td>
<td className="px-6 py-4 font-body-sm text-on-surface">5h 00min</td>
<td className="px-6 py-4">
<span className="font-mono-ticket text-on-surface font-bold">4 500 <span className="text-on-surface-variant text-[10px]">FCFA</span></span>
</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full bg-success-green/10 text-success-green text-label-caps border border-success-green/20">Actif</span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-error transition-all">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-4">
<div className="flex flex-col items-center gap-1">
<div className="h-2 w-2 rounded-full bg-primary-container"></div>
<div className="h-4 w-px bg-charcoal-border"></div>
<div className="h-2 w-2 rounded-full bg-secondary-container"></div>
</div>
<div>
<div className="font-body-lg text-on-surface font-semibold">Douala → Kribi</div>
<div className="text-label-caps text-on-surface-variant uppercase">Autoroute de la Mer</div>
</div>
</div>
</td>
<td className="px-6 py-4 font-body-sm text-on-surface">170 km</td>
<td className="px-6 py-4 font-body-sm text-on-surface">2h 30min</td>
<td className="px-6 py-4">
<span className="font-mono-ticket text-on-surface font-bold">3 000 <span className="text-on-surface-variant text-[10px]">FCFA</span></span>
</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-label-caps border border-tertiary/20">En maintenance</span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-2 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-error transition-all">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-surface-container-low flex items-center justify-between">
<p className="text-label-caps text-on-surface-variant">Affichage de 3 sur 24 lignes</p>
<div className="flex gap-2">
<button className="px-3 py-1 rounded border border-charcoal-border text-on-surface-variant hover:bg-surface-bright">Précédent</button>
<button className="px-3 py-1 rounded border border-charcoal-border bg-primary text-on-primary">1</button>
<button className="px-3 py-1 rounded border border-charcoal-border text-on-surface-variant hover:bg-surface-bright">2</button>
<button className="px-3 py-1 rounded border border-charcoal-border text-on-surface-variant hover:bg-surface-bright">Suivant</button>
</div>
</div>
</section>
</main>

<button className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center active:scale-90 transition-transform z-50">
<span className="material-symbols-outlined">add</span>
</button>

<nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container border-t border-charcoal-border px-margin-mobile h-16 flex items-center justify-around z-40">
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-medium">Accueil</span>
</a>
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>route</span>
<span className="text-[10px] font-bold">Lignes</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">directions_bus</span>
<span className="text-[10px] font-medium">Bus</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] font-medium">Profil</span>
</a>
</nav>
    </div>
  );
}
