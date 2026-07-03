'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useReservations } from '@/hooks/useEntities';

/**
undefined
 * Route: /reproduction/validation-des-tickets-opep-admin
 */
export default function ValidationDesTicketsOpepAdminReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* TopNavBar */}
<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-charcoal-border">
<div className="flex items-center gap-4">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
<div className="hidden md:flex gap-6 ml-8">
<span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 font-body-lg text-body-lg">Dashboard</span>
<span className="text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer active:opacity-80 font-body-lg text-body-lg">Scanner</span>
<span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 font-body-lg text-body-lg">Trips</span>
</div>
</div>
<div className="flex items-center gap-unit">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined">translate</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden ml-2 ring-1 ring-outline-variant">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtUcXX4ji44UGAC3e5Pn7vaw3WzPBbQQl3zulF4nt7uSiuNjFy3QtHuZ_Yvj3Su3RB9zJrGZXBTb0lBQOCzpUSle1FyvDHWDDEpAtgj-QYC6X7sbJLqVR1c6wsfH2ezifhW5yy3VkAsIA593N5YVbUjJFfN93RXWYQXxN2XPIoJ8KEwzp-s7sNeC8kjJEZMsAtP872vPIeW8Dh_yvgX-NPqjEqcNZWAmcbeRTB3v5CYId-X047ryb2KEMzI00Qz2GXtdsfA4ZIecI" alt="A professional close-up headshot of a Cameroonian logistics administrator wearing a dark navy blazer and white shirt. The person has a friendly, authoritative expression. The background is a blurred office environment with modern technical equipment and soft, cinematic lighting in a dark mode professional aesthetic." />
</div>
</div>
</header>
<div className="flex h-[calc(100vh-64px)] overflow-hidden">
{/* SideNavBar (Hidden on Mobile) */}
<aside className="hidden lg:flex flex-col h-full p-gutter gap-unit w-[280px] bg-surface-dim border-r border-charcoal-border">
<div className="flex flex-col gap-1 mb-6">
<span className="font-headline-lg text-headline-lg text-primary font-bold">OPEP Admin</span>
<span className="text-on-surface-variant text-label-caps font-label-caps">Management Portal</span>
</div>
<nav className="flex-1 flex flex-col gap-1">
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-caps text-label-caps uppercase">Dashboard</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="font-label-caps text-label-caps uppercase">Agencies</span>
</div>
<div className="flex items-center gap-3 p-3 bg-primary-container text-on-primary-container rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">qr_code_scanner</span>
<span className="font-label-caps text-label-caps uppercase">Validation</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">route</span>
<span className="font-label-caps text-label-caps uppercase">Trips</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">directions_bus</span>
<span className="font-label-caps text-label-caps uppercase">Buses</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all cursor-pointer active:scale-95">
<span className="material-symbols-outlined">group</span>
<span className="font-label-caps text-label-caps uppercase">Staff</span>
</div>
</nav>
<div className="mt-auto border-t border-charcoal-border pt-gutter flex flex-col gap-1">
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-highest transition-all cursor-pointer rounded-lg">
<span className="material-symbols-outlined">help</span>
<span className="font-label-caps text-label-caps uppercase">Help Center</span>
</div>
<div className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-highest transition-all cursor-pointer rounded-lg">
<span className="material-symbols-outlined">logout</span>
<span className="font-label-caps text-label-caps uppercase">Logout</span>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 flex flex-col items-center">
<div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
{/* Left Section: Scanner */}
<div className="flex-1 flex flex-col gap-6">
<div className="flex justify-between items-end">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Ticket Validation</h1>
<p className="text-on-surface-variant font-body-sm text-body-sm">Agency: Finexs Voyages • Trip #FX-992</p>
</div>
<button className="px-4 py-2 bg-surface-container text-primary border border-charcoal-border rounded-lg font-label-caps text-label-caps uppercase flex items-center gap-2 hover:bg-surface-container-high transition-all active:scale-95">
<span className="material-symbols-outlined text-sm">keyboard</span>
                            Manual Entry
                        </button>
</div>
{/* Scanner Viewfinder */}
<div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-charcoal-border bg-black group">
<div className="absolute inset-0 bg-cover bg-center opacity-60" data-alt="A POV shot from a mobile camera perspective looking at the interior of a modern interurban bus terminal in Yaoundé, Cameroon. The lighting is moody and low-key with neon blue and green accents. A blurred passenger holds a white paper ticket with a visible QR code in the foreground. The aesthetic is clean, professional, and high-fidelity." style={{}}></div>
{/* Scanner Overlay */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
<div className="w-64 h-64 border-2 border-primary/50 rounded-2xl relative pulse-border">
{/* Corner Brackets */}
<div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
<div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
<div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
<div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
{/* Animated Scan Line */}
<div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent scanner-line shadow-[0_0_15px_rgba(121,216,183,0.8)]"></div>
</div>
</div>
{/* Info Badge */}
<div className="absolute top-4 left-4 glass-morphism px-3 py-1.5 rounded-full border border-charcoal-border flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
<span className="text-white text-label-caps font-label-caps">LIVE FEED</span>
</div>
<div className="absolute bottom-6 left-0 right-0 flex justify-center">
<div className="glass-morphism px-6 py-2 rounded-full border border-charcoal-border text-on-surface font-body-sm text-body-sm">
                                Align QR code within frame
                            </div>
</div>
</div>
{/* Scanner Controls */}
<div className="flex justify-center gap-4">
<button className="w-14 h-14 rounded-full bg-surface-container border border-charcoal-border flex items-center justify-center hover:bg-surface-container-high transition-all active:scale-90">
<span className="material-symbols-outlined text-primary">flashlight_on</span>
</button>
<button className="w-14 h-14 rounded-full bg-surface-container border border-charcoal-border flex items-center justify-center hover:bg-surface-container-high transition-all active:scale-90">
<span className="material-symbols-outlined text-primary">flip_camera_ios</span>
</button>
</div>
</div>
{/* Right Section: Scan Log */}
<div className="w-full lg:w-[360px] flex flex-col gap-6">
<div className="flex items-center justify-between">
<h2 className="font-title-md text-title-md text-on-surface">Recent Scans</h2>
<span className="text-on-surface-variant font-label-caps text-label-caps">Session: 14 Valid</span>
</div>
<div className="flex flex-col gap-3">
{/* Valid Scan Item */}
<div className="bg-slate-surface border border-charcoal-border rounded-xl p-4 flex flex-col gap-3 group hover:border-success-green/50 transition-all cursor-default">
<div className="flex justify-between items-start">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center text-success-green">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
</div>
<div>
<div className="font-title-md text-on-surface leading-none mb-1">Moussa Ibrahim</div>
<div className="text-label-caps font-label-caps text-success-green uppercase tracking-wider">Valid Ticket</div>
</div>
</div>
<div className="text-on-surface-variant font-mono-ticket text-mono-ticket">14:22</div>
</div>
<div className="grid grid-cols-2 gap-4 pt-2 border-t border-charcoal-border/50">
<div>
<div className="text-label-caps font-label-caps text-on-surface-variant uppercase">Seat</div>
<div className="font-title-md text-primary">A12</div>
</div>
<div>
<div className="text-label-caps font-label-caps text-on-surface-variant uppercase">Ticket ID</div>
<div className="font-mono-ticket text-on-surface">#OPEP-8821-X</div>
</div>
</div>
</div>
{/* Invalid Scan Item */}
<div className="bg-slate-surface border border-charcoal-border rounded-xl p-4 flex flex-col gap-3 group hover:border-error-red/50 transition-all cursor-default">
<div className="flex justify-between items-start">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center text-error">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>error</span>
</div>
<div>
<div className="font-title-md text-on-surface leading-none mb-1">Cathy M.</div>
<div className="text-label-caps font-label-caps text-error uppercase tracking-wider">Already Used</div>
</div>
</div>
<div className="text-on-surface-variant font-mono-ticket text-mono-ticket">14:18</div>
</div>
<div className="pt-2 border-t border-charcoal-border/50">
<div className="text-label-caps font-label-caps text-on-surface-variant uppercase">Conflict</div>
<div className="font-body-sm text-on-surface">Scanned at 09:45 AM today in Douala.</div>
</div>
</div>
{/* Valid Scan Item */}
<div className="bg-slate-surface border border-charcoal-border rounded-xl p-4 flex flex-col gap-3 group hover:border-success-green/50 transition-all cursor-default opacity-80">
<div className="flex justify-between items-start">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center text-success-green">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
</div>
<div>
<div className="font-title-md text-on-surface leading-none mb-1">Jean-Paul N.</div>
<div className="text-label-caps font-label-caps text-success-green uppercase tracking-wider">Valid Ticket</div>
</div>
</div>
<div className="text-on-surface-variant font-mono-ticket text-mono-ticket">14:15</div>
</div>
<div className="grid grid-cols-2 gap-4 pt-2 border-t border-charcoal-border/50">
<div>
<div className="text-label-caps font-label-caps text-on-surface-variant uppercase">Seat</div>
<div className="font-title-md text-primary">B04</div>
</div>
<div>
<div className="text-label-caps font-label-caps text-on-surface-variant uppercase">Ticket ID</div>
<div className="font-mono-ticket text-on-surface">#OPEP-9102-Y</div>
</div>
</div>
</div>
{/* Secondary Info Card */}
<div className="mt-4 p-4 glass-morphism border border-charcoal-border rounded-xl">
<div className="flex items-center gap-2 mb-3">
<span className="material-symbols-outlined text-tertiary">info</span>
<span className="font-label-caps text-label-caps uppercase text-tertiary">System Status</span>
</div>
<p className="text-body-sm text-on-surface-variant leading-relaxed">
                                Scanner connected to Central DB. Offline cache active for 45 pending records.
                            </p>
</div>
</div>
</div>
</div>
</main>
</div>
{/* Mobile Navigation Bar */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container border-t border-charcoal-border flex items-center justify-around px-4 z-50">
<div className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-label-caps font-label-caps uppercase">Home</span>
</div>
<div className="flex flex-col items-center gap-1 text-primary font-bold">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>qr_code_scanner</span>
<span className="text-label-caps font-label-caps uppercase">Scan</span>
</div>
<div className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">history</span>
<span className="text-label-caps font-label-caps uppercase">Logs</span>
</div>
<div className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">person</span>
<span className="text-label-caps font-label-caps uppercase">Profile</span>
</div>
</nav>
    </div>
  );
}
