'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useAvailableTrips } from '@/hooks/useTrips';
import { useReservations } from '@/hooks/useEntities';
import { Modal } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/terminal-caisse-vente-directe-opep-light
 */
export default function TerminalCaisseVenteDirecteOpepLightReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showSuccessModal, setSuccessModal] = useState(false);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      <header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container border-b border-charcoal-border h-16">
<div className="flex items-center gap-6">
<h1 className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</h1>
<div className="h-8 w-[1px] bg-charcoal-border hidden md:block"></div>
<span className="font-title-md text-title-md hidden md:block text-on-surface">Guichet de Vente Directe</span>
</div>
<div className="flex-1 max-w-md mx-8">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-lowest border border-charcoal-border rounded-lg py-2 pl-10 pr-4 focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface transition-all outline-none" placeholder="Rechercher une destination..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">translate</button>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</button>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">settings</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-charcoal-border ml-2">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQvXS22_UkgTeAWEWe-ndR8unVtlKVKNw4f-4IJ4HKoQAr4lIEvNJbi_TvuwJsNAu0rlg-YlCGJS-2I0Zn3uqflBo6wrPxRxQtRY40aDYLN4zOQxXdXFutufPfeiyh90Q6-Ltqb_Kk4ujzjM4Fb43ay8GIPbMLznPBz5Rv9_qzf4dm149a4mz_L1gBdVDieCqztr1HNTaQzHrGRKwlQ6KqriNKofPnCZfiQu79gnAQIiaZ3HFjJnvZvBMVBjSN0hbfedxnpHN_dws" alt="User Profile" />
</div>
</div>
</header>
<div className="flex flex-1 overflow-hidden">

<nav className="hidden md:flex flex-col h-full p-gutter gap-unit w-[280px] bg-surface-container-low border-r border-charcoal-border">
<div className="mb-4">
<div className="flex items-center gap-3 p-3">
<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary" style={{"fontVariationSettings":"'FILL' 1"}}>dashboard</span>
</div>
<div>
<p className="font-label-caps text-label-caps text-on-surface">OPEP Admin</p>
<p className="text-xs text-on-surface-variant">Management Portal</p>
</div>
</div>
</div>
<div className="space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-caps text-label-caps">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-lg shadow-sm transition-all" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>local_activity</span>
<span className="font-label-caps text-label-caps">Ticketing</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">route</span>
<span className="font-label-caps text-label-caps">Trips</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">directions_bus</span>
<span className="font-label-caps text-label-caps">Buses</span>
</a>
</div>
<div className="mt-auto space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">help</span>
<span className="font-label-caps text-label-caps">Help Center</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">logout</span>
<span className="font-label-caps text-label-caps">Logout</span>
</a>
</div>
</nav>

<main className="flex-1 overflow-y-auto p-gutter bg-surface-container-lowest">
<div className="flex items-center justify-between mb-6">
<h2 className="font-title-md text-title-md text-on-surface">Voyages Prochains / Upcoming Trips</h2>
<div className="flex gap-2">
<button className="bg-surface-container-high px-4 py-2 rounded-lg text-sm border border-charcoal-border hover:bg-surface-variant transition-colors text-on-surface">Aujourd'hui</button>
<button className="bg-surface-container px-4 py-2 rounded-lg text-sm border border-charcoal-border hover:bg-surface-variant transition-colors text-on-surface">Demain</button>
<button className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 shadow-sm">
<span className="material-symbols-outlined text-sm">calendar_month</span> Choisir Date
                    </button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-gutter">

<div className="active-trip-card border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col gap-4 relative overflow-hidden group bg-white">
<div className="flex justify-between items-start">
<div className="flex items-center gap-2">
<span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">VIP</span>
<span className="text-on-surface-variant font-mono-ticket text-xs uppercase">TRP-8821</span>
</div>
<div className="text-right">
<p className="font-headline-lg text-lg text-primary">6 500 FCFA</p>
<p className="text-[10px] text-on-surface-variant">Tarif Standard</p>
</div>
</div>
<div className="flex items-center justify-between">
<div>
<p className="text-xs text-on-surface-variant uppercase tracking-tighter">Départ</p>
<p className="font-bold text-lg text-on-surface">Douala</p>
<p className="text-primary font-bold">06:30</p>
</div>
<div className="flex-1 px-4 flex flex-col items-center">
<div className="w-full h-[2px] bg-outline-variant relative">
<span className="material-symbols-outlined absolute -top-3 left-1/2 -translate-x-1/2 text-primary bg-white px-1">directions_bus</span>
</div>
<span className="text-[10px] text-on-surface-variant mt-2">4h 30m</span>
</div>
<div className="text-right">
<p className="text-xs text-on-surface-variant uppercase tracking-tighter">Arrivée</p>
<p className="font-bold text-lg text-on-surface">Yaoundé</p>
<p className="text-on-surface-variant">11:00</p>
</div>
</div>
<div className="flex items-center justify-between pt-2 border-t border-charcoal-border">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-on-surface-variant">chair</span>
<span className="text-sm font-bold text-on-surface">12 / 70</span>
<span className="text-xs text-on-surface-variant">Sièges Libres</span>
</div>
<button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">PLAN DE BUS <span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>

<div className="bg-white border border-charcoal-border rounded-xl p-4 cursor-pointer transition-all hover:border-primary hover:shadow-sm flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="flex items-center gap-2">
<span className="bg-tertiary/10 text-tertiary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">CLASSIQUE</span>
<span className="text-on-surface-variant font-mono-ticket text-xs uppercase">TRP-9012</span>
</div>
<div className="text-right">
<p className="font-headline-lg text-lg text-on-surface">3 500 FCFA</p>
<p className="text-[10px] text-on-surface-variant">Tarif Éco</p>
</div>
</div>
<div className="flex items-center justify-between">
<div>
<p className="text-xs text-on-surface-variant uppercase tracking-tighter">Départ</p>
<p className="font-bold text-lg text-on-surface">Douala</p>
<p className="text-on-surface font-bold">07:45</p>
</div>
<div className="flex-1 px-4 flex flex-col items-center">
<div className="w-full h-[2px] bg-outline-variant relative">
<span className="material-symbols-outlined absolute -top-3 left-1/2 -translate-x-1/2 text-on-surface-variant bg-white px-1">directions_bus</span>
</div>
<span className="text-[10px] text-on-surface-variant mt-2">5h 00m</span>
</div>
<div className="text-right">
<p className="text-xs text-on-surface-variant uppercase tracking-tighter">Arrivée</p>
<p className="font-bold text-lg text-on-surface">Bafoussam</p>
<p className="text-on-surface-variant">12:45</p>
</div>
</div>
<div className="flex items-center justify-between pt-2 border-t border-charcoal-border">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-on-surface-variant">chair</span>
<span className="text-sm font-bold text-on-surface">45 / 70</span>
<span className="text-xs text-on-surface-variant">Sièges Libres</span>
</div>
<button className="text-xs font-bold text-on-surface-variant flex items-center gap-1">PLAN DE BUS <span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>

<div className="bg-white border border-charcoal-border rounded-xl p-4 cursor-pointer transition-all hover:border-primary hover:shadow-sm flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="flex items-center gap-2">
<span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">VIP</span>
<span className="text-on-surface-variant font-mono-ticket text-xs uppercase">TRP-1122</span>
</div>
<div className="text-right">
<p className="font-headline-lg text-lg text-on-surface">8 000 FCFA</p>
<p className="text-[10px] text-on-surface-variant">Tarif Direct</p>
</div>
</div>
<div className="flex items-center justify-between">
<div>
<p className="text-xs text-on-surface-variant uppercase tracking-tighter">Départ</p>
<p className="font-bold text-lg text-on-surface">Douala</p>
<p className="text-on-surface font-bold">08:00</p>
</div>
<div className="flex-1 px-4 flex flex-col items-center">
<div className="w-full h-[2px] bg-outline-variant relative">
<span className="material-symbols-outlined absolute -top-3 left-1/2 -translate-x-1/2 text-on-surface-variant bg-white px-1">directions_bus</span>
</div>
<span className="text-[10px] text-on-surface-variant mt-2">7h 30m</span>
</div>
<div className="text-right">
<p className="text-xs text-on-surface-variant uppercase tracking-tighter">Arrivée</p>
<p className="font-bold text-lg text-on-surface">Garoua</p>
<p className="text-on-surface-variant">15:30</p>
</div>
</div>
<div className="flex items-center justify-between pt-2 border-t border-charcoal-border">
<div className="flex items-center gap-2 text-error-red">
<span className="material-symbols-outlined text-sm">chair</span>
<span className="text-sm font-bold">02 / 70</span>
<span className="text-xs">Presque Complet</span>
</div>
<button className="text-xs font-bold text-on-surface-variant flex items-center gap-1">PLAN DE BUS <span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>

<div className="bg-surface-container-low border border-charcoal-border border-dashed rounded-xl p-4 cursor-pointer hover:bg-surface-container transition-all">
<div className="h-32 flex items-center justify-center rounded-lg">
<span className="text-on-surface-variant text-sm font-medium">Charger plus de trajets...</span>
</div>
</div>
</div>

<div className="mt-8 bg-surface-container rounded-2xl p-6 border border-charcoal-border">
<div className="flex items-center justify-between mb-4">
<h3 className="font-title-md text-title-md text-on-surface">Plan du Bus : Douala → Yaoundé (06:30)</h3>
<div className="flex gap-4 text-xs font-medium text-on-surface-variant">
<div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-surface-variant border border-charcoal-border"></div> Indisponible</div>
<div className="flex items-center gap-1"><div className="w-3 h-3 rounded border border-primary bg-white"></div> Disponible</div>
<div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary"></div> Sélectionné</div>
</div>
</div>
<div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-3">

</div>
</div>
</main>

<aside className="w-[380px] bg-white border-l border-charcoal-border flex flex-col p-6 overflow-y-auto">
<div className="flex items-center gap-2 mb-8">
<span className="material-symbols-outlined text-primary">shopping_cart</span>
<h3 className="font-title-md text-title-md text-on-surface">Panier / Current Cart</h3>
</div>
<div className="flex-1 space-y-6">

<div className="bg-surface-container-low border border-charcoal-border rounded-xl p-4 relative">
<button className="absolute top-2 right-2 text-on-surface-variant hover:text-error-red transition-colors">
<span className="material-symbols-outlined text-sm">close</span>
</button>
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">03</div>
<div>
<p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Siège Sélectionné</p>
<p className="font-bold text-on-surface">Adulte Standard</p>
</div>
</div>
<div className="space-y-3">
<div>
<label className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Nom du passager</label>
<input className="w-full bg-white border border-charcoal-border rounded p-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="text" value="Jean-Paul Atangana"/>
</div>
<div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-charcoal-border text-on-surface">
<span>Prix</span>
<span>6 500 FCFA</span>
</div>
</div>
</div>

<div className="bg-surface-container-low border border-charcoal-border rounded-xl p-4 relative">
<button className="absolute top-2 right-2 text-on-surface-variant hover:text-error-red transition-colors">
<span className="material-symbols-outlined text-sm">close</span>
</button>
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">04</div>
<div>
<p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Siège Sélectionné</p>
<p className="font-bold text-on-surface">Adulte Standard</p>
</div>
</div>
<div className="space-y-3">
<div>
<label className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Nom du passager</label>
<input className="w-full bg-white border border-charcoal-border rounded p-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Entrer le nom..." type="text"/>
</div>
<div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-charcoal-border text-on-surface">
<span>Prix</span>
<span>6 500 FCFA</span>
</div>
</div>
</div>
</div>

<div className="mt-8 pt-6 border-t border-charcoal-border space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="material-symbols-outlined text-on-surface">print</span>
<span className="text-sm font-medium">Imprimer Ticket Papier</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-charcoal-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="bg-surface-container rounded-xl p-4">
<div className="flex justify-between text-on-surface-variant text-sm mb-1">
<span>Sous-total (2 Billets)</span>
<span className="text-on-surface font-medium">13 000 FCFA</span>
</div>
<div className="flex justify-between text-on-surface-variant text-sm mb-3">
<span>Frais de guichet</span>
<span className="text-on-surface font-medium">0 FCFA</span>
</div>
<div className="flex justify-between items-end">
<span className="font-bold text-on-surface">TOTAL</span>
<span className="text-2xl font-bold text-primary">13 000 FCFA</span>
</div>
</div>
<button className="w-full bg-success-green hover:bg-success-green/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-md" onClick={() => setSuccessModal(true)}>
<span className="material-symbols-outlined">payments</span>
                    PAYER EN ESPÈCES (CASH)
                </button>
<button className="w-full border border-charcoal-border text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high py-2 rounded-lg text-sm transition-all font-medium">
                    Annuler la transaction
                </button>
</div>
</aside>
</div>

      <Modal isOpen={showSuccessModal} onClose={() => setSuccessModal(false)} title="Paiement Réussi !" description="Le ticket TRP-8821 a été généré et envoyé à l'imprimante.">
        <div className="flex flex-col gap-4">
          <div className="w-20 h-20 bg-success-green/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-success-green text-5xl" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
          </div>
          <div className="bg-surface-container p-4 rounded-lg font-mono-ticket text-xs text-left text-on-surface border border-charcoal-border">
            <p className="border-b border-charcoal-border pb-1 mb-2 font-bold text-primary">OPEP DIRECT TICKET</p>
            <div className="flex justify-between mb-1"><span>Voyage:</span><span className="font-bold">8821-DLA-YDE</span></div>
            <div className="flex justify-between mb-1"><span>Siège(s):</span><span className="font-bold">03, 04</span></div>
            <div className="flex justify-between mb-1"><span>Date:</span><span className="font-bold">24/10/2023</span></div>
            <div className="flex justify-between font-bold mt-2 text-primary pt-1 border-t border-charcoal-border"><span>Total:</span><span>13 000 FCFA</span></div>
          </div>
          <button className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm" onClick={() => setSuccessModal(false)}>Nouvelle Vente</button>
        </div>
      </Modal>
    </div>
  );
}
