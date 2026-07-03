'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useReservations } from '@/hooks/useEntities';

/**
undefined
 * Route: /reproduction/validation-des-tickets-opep-admin-light
 */
export default function ValidationDesTicketsOpepAdminLightReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const { data: reservations, isLoading: resLoading, error: resError, refetch: resRefetch } = useReservations();
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      <header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container-lowest h-16 border-b border-outline-variant">
<div className="flex items-center gap-4">
<span className="text-2xl font-bold text-primary">OPEP Portal</span>
<div className="hidden md:flex gap-6 ml-8">
<span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 font-medium">Dashboard</span>
<span className="text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer active:opacity-80">Scanner</span>
<span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 font-medium">Trips</span>
</div>
</div>
<div className="flex items-center gap-2">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
<span className="material-symbols-outlined">translate</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden ml-2 ring-1 ring-outline-variant">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtUcXX4ji44UGAC3e5Pn7vaw3WzPBbQQl3zulF4nt7uSiuNjFy3QtHuZ_Yvj3Su3RB9zJrGZXBTb0lBQOCzpUSle1FyvDHWDDEpAtgj-QYC6X7sbJLqVR1c6wsfH2ezifhW5yy3VkAsIA593N5YVbUjJFfN93RXWYQXxN2XPIoJ8KEwzp-s7sNeC8kjJEZMsAtP872vPIeW8Dh_yvgX-NPqjEqcNZWAmcbeRTB3v5CYId-X047ryb2KEMzI00Qz2GXtdsfA4ZIecI" alt="User profile" />
</div>
</div>
</header>
<div className="flex h-[calc(100vh-64px)] overflow-hidden">

<aside className="hidden lg:flex flex-col h-full p-gutter gap-unit w-[280px] bg-surface-container-low border-r border-outline-variant">
<div className="flex flex-col gap-1 mb-6 px-3">
<span className="text-xl text-primary font-bold">OPEP Admin</span>
<span className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold">Management Portal</span>
</div>
<nav className="flex-1 flex flex-col gap-1">
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-sm font-medium uppercase">Dashboard</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="text-sm font-medium uppercase">Agencies</span>
</div>
<div className="flex items-center gap-3 p-3 bg-primary-container text-on-primary-container rounded-lg transition-all cursor-pointer shadow-sm">
<span className="material-symbols-outlined">qr_code_scanner</span>
<span className="text-sm font-bold uppercase">Validation</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">route</span>
<span className="text-sm font-medium uppercase">Trips</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">directions_bus</span>
<span className="text-sm font-medium uppercase">Buses</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">group</span>
<span className="text-sm font-medium uppercase">Staff</span>
</div>
</nav>
<div className="mt-auto border-t border-outline-variant pt-gutter flex flex-col gap-1">
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer rounded-lg">
<span className="material-symbols-outlined">help</span>
<span className="text-sm font-medium uppercase">Help Center</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer rounded-lg">
<span className="material-symbols-outlined">logout</span>
<span className="text-sm font-medium uppercase">Logout</span>
</div>
</div>
</aside>

<main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 flex flex-col items-center">
{resError && (
  <div className="mx-6 mt-4">
    <ErrorState title="Erreur de connexion" message={String(resError?.message || '')} onRetry={() => resRefetch()} />
  </div>
)}

<div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">

<div className="flex-1 flex flex-col gap-6">
<div className="flex justify-between items-end">
<div>
<h1 className="text-3xl font-bold text-on-surface mb-1">Ticket Validation</h1>
<p className="text-on-surface-variant text-sm">Agency: Finexs Voyages • Trip #FX-992</p>
</div>
<button className="px-4 py-2 bg-surface-container text-primary border border-outline-variant rounded-lg text-sm font-bold uppercase flex items-center gap-2 hover:bg-surface-container-high transition-all active:scale-95">
<span className="material-symbols-outlined text-sm">keyboard</span>
                        Manual Entry
                    </button>
</div>

<div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl border border-outline-variant bg-black group">
<div className="absolute inset-0 bg-cover bg-center opacity-70" style={{}}></div>

<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
<div className="w-64 h-64 border-2 border-primary/40 rounded-2xl relative pulse-border">

<div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
<div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
<div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
<div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

<div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent scanner-line shadow-[0_0_15px_rgba(0,95,72,0.6)]"></div>
</div>
</div>

<div className="absolute top-4 left-4 glass-morphism px-3 py-1.5 rounded-full border border-white/40 flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
<span className="text-on-surface text-xs font-bold uppercase tracking-wider">LIVE FEED</span>
</div>
<div className="absolute bottom-6 left-0 right-0 flex justify-center">
<div className="glass-morphism px-6 py-2 rounded-full border border-white/40 text-on-surface font-semibold text-sm">
                            Align QR code within frame
                        </div>
</div>
</div>

<div className="flex justify-center gap-4">
<button className="w-14 h-14 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center hover:bg-surface-dim transition-all active:scale-90 shadow-sm">
<span className="material-symbols-outlined text-primary">flashlight_on</span>
</button>
<button className="w-14 h-14 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center hover:bg-surface-dim transition-all active:scale-90 shadow-sm">
<span className="material-symbols-outlined text-primary">flip_camera_ios</span>
</button>
</div>
</div>

<div className="w-full lg:w-[360px] flex flex-col gap-6">
<div className="flex items-center justify-between">
<h2 className="text-lg font-bold text-on-surface">Recent Scans</h2>
<span className="text-on-surface-variant text-xs font-bold uppercase">Session: 14 Valid</span>
</div>
<div className="flex flex-col gap-3">

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-3 group hover:border-success-green/50 transition-all cursor-default shadow-sm">
<div className="flex justify-between items-start">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center text-success-green">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
</div>
<div>
<div className="font-bold text-on-surface leading-none mb-1">Moussa Ibrahim</div>
<div className="text-xs font-bold text-success-green uppercase tracking-wider">Valid Ticket</div>
</div>
</div>
<div className="text-on-surface-variant font-mono text-xs">14:22</div>
</div>
<div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
<div>
<div className="text-xs font-bold text-on-surface-variant uppercase">Seat</div>
<div className="text-lg font-bold text-primary">A12</div>
</div>
<div>
<div className="text-xs font-bold text-on-surface-variant uppercase">Ticket ID</div>
<div className="font-mono text-sm text-on-surface">#OPEP-8821-X</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-3 group hover:border-error-red/50 transition-all cursor-default shadow-sm">
<div className="flex justify-between items-start">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-error-container/40 flex items-center justify-center text-error-red">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>error</span>
</div>
<div>
<div className="font-bold text-on-surface leading-none mb-1">Cathy M.</div>
<div className="text-xs font-bold text-error-red uppercase tracking-wider">Already Used</div>
</div>
</div>
<div className="text-on-surface-variant font-mono text-xs">14:18</div>
</div>
<div className="pt-2 border-t border-outline-variant/30">
<div className="text-xs font-bold text-on-surface-variant uppercase">Conflict</div>
<div className="text-sm text-on-surface">Scanned at 09:45 AM today in Douala.</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-3 group hover:border-success-green/50 transition-all cursor-default opacity-80 shadow-sm">
<div className="flex justify-between items-start">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center text-success-green">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
</div>
<div>
<div className="font-bold text-on-surface leading-none mb-1">Jean-Paul N.</div>
<div className="text-xs font-bold text-success-green uppercase tracking-wider">Valid Ticket</div>
</div>
</div>
<div className="text-on-surface-variant font-mono text-xs">14:15</div>
</div>
<div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
<div>
<div className="text-xs font-bold text-on-surface-variant uppercase">Seat</div>
<div className="text-lg font-bold text-primary">B04</div>
</div>
<div>
<div className="text-xs font-bold text-on-surface-variant uppercase">Ticket ID</div>
<div className="font-mono text-sm text-on-surface">#OPEP-9102-Y</div>
</div>
</div>
</div>

<div className="mt-4 p-4 bg-tertiary-fixed/20 border border-tertiary/20 rounded-xl">
<div className="flex items-center gap-2 mb-3">
<span className="material-symbols-outlined text-tertiary">info</span>
<span className="text-xs font-bold uppercase text-tertiary">System Status</span>
</div>
<p className="text-sm text-on-surface-variant leading-relaxed">
                            Scanner connected to Central DB. Offline cache active for 45 pending records.
                        </p>
</div>
</div>
</div>
</div>
</main>
</div>

<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around px-4 z-50">
<div className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-bold uppercase">Home</span>
</div>
<div className="flex flex-col items-center gap-1 text-primary font-bold">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>qr_code_scanner</span>
<span className="text-[10px] font-bold uppercase">Scan</span>
</div>
<div className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">history</span>
<span className="text-[10px] font-bold uppercase">Logs</span>
</div>
<div className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] font-bold uppercase">Profile</span>
</div>
</nav>
    </div>
  );
}
