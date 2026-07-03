'use client';

import React, { useState } from 'react';
import { useReservations } from '@/hooks/useEntities';
import { Modal } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/confirmation-impression-recu-opep
 */
export default function ConfirmationImpressionRecuOpepReproductionPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [showPrintModal, setShowPrintModal] = useState(false);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      <header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-charcoal-border no-print">
<div className="flex items-center gap-unit">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
</div>
<div className="flex items-center gap-gutter">
<div className="flex items-center gap-unit px-gutter">
<span className="material-symbols-outlined text-primary" data-icon="translate">translate</span>
<span className="font-body-lg text-body-lg text-on-surface-variant">Français</span>
</div>
<div className="flex items-center gap-gutter border-l border-charcoal-border pl-gutter">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" data-icon="notifications">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" data-icon="settings">settings</span>
<div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-charcoal-border">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a Cameroonian tech administrator in a clean office environment, high resolution corporate photography with soft lighting and professional attire." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj_tm38KxuBaYv0ypL4EOYQw-Mo2sJH-jU_bq_RWN3X7qSne9swKn7YnXhPRVHD6o1WxwGtVnFNGs1AtUSBTtPOe6BiALwPqNDanVjWnb1nN78dhdKVecKmok6S_yjvTiZWahxsnBpErr30GYe_nlf5te3QyAIGUs7fhpt9W-TgTUTN5E-xgl6uq9QRrivW6taGYOGjGXG6tEixVa4iVkeSp0h4nPO3Lgx2lqhwwwb7rOfs5wlTI8kSgY4vaFX09e_gYYpKb4hEC8"/>
</div>
</div>
</div>
</header>
<main className="flex min-h-[calc(100vh-64px)] overflow-hidden">

<aside className="hidden md:flex flex-col h-[calc(100vh-64px)] w-[280px] bg-surface-dim border-r border-charcoal-border p-gutter gap-unit no-print">
<div className="flex items-center gap-unit p-unit mb-gutter">
<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
<span className="material-symbols-outlined" data-icon="corporate_fare" style={{"fontVariationSettings":"'FILL' 1"}}>corporate_fare</span>
</div>
<div>
<p className="font-label-caps text-label-caps text-on-surface">OPEP Admin</p>
<p className="text-[10px] text-on-surface-variant opacity-70">Management Portal</p>
</div>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-unit p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-caps text-label-caps">Dashboard</span>
</a>
<a className="flex items-center gap-unit p-3 bg-primary-container text-on-primary-container rounded-lg transition-all" href="#">
<span className="material-symbols-outlined" data-icon="payments" style={{"fontVariationSettings":"'FILL' 1"}}>payments</span>
<span className="font-label-caps text-label-caps">POS Terminal</span>
</a>
<a className="flex items-center gap-unit p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all" href="#">
<span className="material-symbols-outlined" data-icon="route">route</span>
<span className="font-label-caps text-label-caps">Trips</span>
</a>
</nav>
<div className="mt-auto border-t border-charcoal-border pt-gutter space-y-1">
<a className="flex items-center gap-unit p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="font-label-caps text-label-caps">Help Center</span>
</a>
</div>
</aside>

<section className="flex-1 relative overflow-y-auto bg-background p-margin-desktop md:p-12 flex items-center justify-center">


<div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

<div className="animate-success no-print">
<div className="mb-gutter inline-flex items-center gap-unit bg-success-green/10 text-success-green px-4 py-2 rounded-full border border-success-green/20">
<span className="material-symbols-outlined text-body-lg" data-icon="check_circle" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
<span className="font-label-caps text-label-caps">Paiement Réussi - Impression du Reçu</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Transaction Confirmée</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md">
                        Le paiement a été encaissé avec succès. Veuillez imprimer le reçu pour les passagers. Un SMS de confirmation a également été envoyé au contact principal.
                    </p>
<div className="space-y-4">
<button className="w-full md:w-auto flex items-center justify-center gap-unit px-8 py-4 bg-primary text-on-primary font-title-md text-title-md rounded-xl hover:shadow-[0_0_20px_rgba(121,216,183,0.3)] transition-all active:scale-95 group" onClick={() => setShowPrintModal(true)}>
<span className="material-symbols-outlined group-hover:rotate-12 transition-transform" data-icon="print">print</span>
<span>Imprimer le Reçu</span>
</button>
<button className="w-full md:w-auto flex items-center justify-center gap-unit px-8 py-4 border border-charcoal-border text-on-surface font-title-md text-title-md rounded-xl hover:bg-surface-container-high transition-all active:scale-95">
<span className="material-symbols-outlined" data-icon="add">add</span>
<span>Nouvelle Transaction</span>
</button>
</div>
<div className="mt-12 grid grid-cols-2 gap-gutter max-w-sm">
<div className="p-gutter glass-card rounded-xl">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Moyen de Paiement</p>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary" data-icon="payments">payments</span>
<span className="font-title-md text-title-md">Espèces</span>
</div>
</div>
<div className="p-gutter glass-card rounded-xl">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Caissier ID</p>
<p className="font-title-md text-title-md">POS-YAO-04</p>
</div>
</div>
</div>

<div className="flex flex-col items-center lg:items-end">
<div className="no-print mb-4 flex items-center gap-2 text-on-surface-variant">
<span className="material-symbols-outlined text-sm" data-icon="visibility">visibility</span>
<span className="font-label-caps text-label-caps">Aperçu avant impression</span>
</div>

<div className="ticket-container animate-success">
<div className="flex flex-col items-center text-center border-b border-dashed border-black pb-4 mb-4">
<p className="font-bold text-lg leading-none">OPEP PORTAL</p>
<p className="text-[10px] uppercase">Agence de Voyages Interurbains</p>
<p className="text-[10px]">Gare Routière, Douala, Cameroun</p>
<p className="text-[10px] mt-1">+237 6XX XXX XXX</p>
</div>
<div className="space-y-1 mb-4 text-xs">
<div className="flex justify-between">
<span>RÉSERVATION:</span>
<span className="font-bold">ABC12345</span>
</div>
<div className="flex justify-between">
<span>DATE:</span>
<span>24/05/2024 14:30</span>
</div>
</div>
<div className="border-y border-black py-3 mb-4">
<p className="text-center font-bold text-sm mb-1">DOUALA ➔ YAOUNDÉ</p>
<p className="text-center text-[10px]">Départ: 25/05/2024 | 08:00</p>
<p className="text-center text-[10px]">Type: VIP Class</p>
</div>
<div className="space-y-3 mb-6">
<div>
<p className="text-[10px] font-bold">PASSAGERS / PLACES:</p>
<div className="flex justify-between text-xs mt-1">
<span>N. EFFA</span>
<span className="font-bold">12A</span>
</div>
<div className="flex justify-between text-xs">
<span>M. AMADOU</span>
<span className="font-bold">12B</span>
</div>
</div>
</div>
<div className="border-t border-dashed border-black pt-4">
<div className="flex justify-between text-sm mb-1">
<span>SOUS-TOTAL</span>
<span>12 000 FCFA</span>
</div>
<div className="flex justify-between text-sm mb-1">
<span>TAXE (VAT)</span>
<span>0 FCFA</span>
</div>
<div className="flex justify-between text-lg font-bold border-t border-black pt-2 mt-2">
<span>TOTAL</span>
<span>12 000 FCFA</span>
</div>
</div>
<div className="mt-8 flex flex-col items-center">

<div className="w-32 h-32 bg-white border border-black p-1 flex items-center justify-center">
<div className="w-full h-full bg-slate-100 flex items-center justify-center relative overflow-hidden">

<div className="grid grid-cols-8 gap-px w-full h-full opacity-30">

</div>
<span className="absolute inset-0 flex items-center justify-center font-bold text-[8px]">QR CODE VALIDATION</span>
</div>
</div>
<p className="text-[10px] mt-4 italic text-center">Bon voyage avec OPEP Portal.</p>
<p className="text-[8px] mt-1 text-center">Ce reçu sert de titre de transport officiel.</p>
</div>
<div className="ticket-zigzag no-print"></div>
</div>
</div>
</div>
</section>
</main>

      <Modal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} title="Impression du reçu">
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="material-symbols-outlined text-6xl text-primary animate-pulse">print</span>
          <p className="font-headline-lg text-headline-lg text-on-surface">Impression en cours...</p>
        </div>
      </Modal>
    </div>
  );
}
