'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useSubscriptionPackages, useSubscriptionStatus, useAgencies } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/gestion-des-abonnements-facturation-opep-groupe
 */
export default function GestionDesAbonnementsFacturationOpepGroupeReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"subscriptions","label":"Subscriptions"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"receipt","label":"Billing"}];
  const bottom = [{"icon":"help","label":"Help"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* Sidebar Navigation Shell */}
  <Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={1}
  onNavChange={setActiveTab}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">subscriptions</span></div>}
/>
{/* Main Content Canvas */}
<main className="md:ml-[280px] min-h-screen relative">
{/* Top Bar */}
<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-outline-variant">
<div className="flex items-center gap-md">
<h2 className="font-headline-lg text-primary text-[24px]">OPEP Portal</h2>
<div className="hidden md:flex items-center gap-lg ml-xl">
<span className="text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer font-body-lg text-body-lg">Billing</span>
<span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-body-lg text-body-lg">Subscriptions</span>
<span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-body-lg text-body-lg">History</span>
</div>
</div>
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">translate</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
<div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant overflow-hidden">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFmAINin-8KIs74lMT4Rob-K6WqVQOalijdnym_xX2U3poT3xrDycWmkWo82PXze5zahZu-IG719Lzz6njnODJVwG9onPforEX80XF3QgHGWJdDKpbxw3n0EXLcpSPA0P0V2k8ubRHiE4BrWvl2Ya3RRKLeRB32V_tjcZOe5NYbeLMtP-hqpO_7Ohg0mg60tUwrtFauuB9_rKflaR5_hidoqsW_YN9DU7K1L6qCf_iowhr3KAcQXMJqc_RQT-kDi_254YH8Glq2cQ" alt="Professional headshot of a Cameroonian tech executive, wearing a sharp charcoal suit and smiling confidently. High-end portrait photography with cinematic, soft lighting in a modern architectural office setting. Deep blacks and rich teal highlights to match the OPEP brand identity." />
</div>
</div>
</header>
{/* Content Area */}
<div className="p-container-padding max-w-[1400px] mx-auto space-y-lg">
{/* Hero Dashboard Banner */}
<section className="grid grid-cols-1 lg:grid-cols-3 gap-md">
<div className="lg:col-span-2 glass-panel p-lg rounded-2xl inner-glow-primary ambient-glow-primary relative overflow-hidden">
<div className="relative z-10">
<div className="flex items-center gap-sm mb-base">
<span className="px-sm py-1 rounded-full bg-primary/10 text-primary font-label-sm border border-primary/20">CURRENT PLAN</span>
</div>
<h3 className="font-display-lg text-on-surface mb-xs">Enterprise Sovereign</h3>
<p className="text-body-lg text-on-surface-variant max-w-md">Your Multi-Agency umbrella account includes unlimited transactions, VIP technical support, and the full suite of OPEP management tools.</p>
<div className="mt-lg flex flex-wrap gap-xl">
<div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Next Billing Date</p>
<p className="font-title-md text-on-surface">October 14, 2024</p>
</div>
<div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Monthly Cost</p>
<p className="font-title-md text-tertiary">450,000 XAF</p>
</div>
<div>
<p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Active Agencies</p>
<p className="font-title-md text-on-surface">12 / 15 Total</p>
</div>
</div>
</div>
{/* Decorative Element */}
<div className="absolute -right-10 -bottom-10 opacity-20">
<span className="material-symbols-outlined text-[200px] text-primary select-none">verified_user</span>
</div>
</div>
<div className="glass-panel p-lg rounded-2xl flex flex-col justify-between">
<div>
<h4 className="font-title-md text-on-surface mb-xs">Quick Actions</h4>
<p className="text-body-md text-on-surface-variant mb-lg">Manage your group-level billing settings and payment methods.</p>
</div>
<div className="space-y-sm">
<button className="w-full py-3 px-md bg-gradient-to-r from-primary-container to-primary/80 text-on-primary font-bold rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-sm">
<span className="material-symbols-outlined">add_card</span>
                            Update Payment Method
                        </button>
<button className="w-full py-3 px-md glass-panel text-on-surface font-semibold rounded-xl hover:bg-surface-variant/30 transition-all flex items-center justify-center gap-sm">
<span className="material-symbols-outlined">receipt_long</span>
                            Download Latest Invoice
                        </button>
</div>
</div>
</section>
{/* Agency Status Table (Asymmetric Bento) */}
<section className="space-y-md">
<div className="flex items-center justify-between">
<h3 className="font-headline-lg text-on-surface text-[24px]">Agency Ecosystem</h3>
<div className="flex gap-sm">
<button className="px-md py-2 glass-panel rounded-full text-label-sm uppercase flex items-center gap-xs">
<span className="material-symbols-outlined text-[18px]">filter_alt</span> Filter
                        </button>
<button className="px-md py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-label-sm uppercase">
                            Register New Agency
                        </button>
</div>
</div>
<div className="glass-panel rounded-2xl overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container-high">
<tr>
<th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Agency Name</th>
<th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Plan</th>
<th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Active Buses</th>
<th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Daily Trips</th>
<th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXRSbWvTajJoagzfnmJZJv6Bcwez_KfQXcfyvbs1D-OhDp-yV1cPgybKG-JqWvC9evlupjrOxPGBV9dkskuRm4EHDMZ7ttz54H1YyVMV8GQ7Un3OpAurNBeAVMrVJ1qQ85dgoZ0b2G4R0DejPM7MnbfdZnUwZBmWzsXrjDpK3fMhnCb7-JWMtk2YAYN1_8AG2ryPYPA9ol754DiFqRpWfXsidrXaUOMiEPjkdB49sbs9iUr3WSY83X3ztS7irzZ7pLTclEW1-clmk" alt="Minimalist abstract logo for a transportation company named 'Général Express'. Bold sans-serif typography in deep forest green on a clean, light-grey textured background with a small stylized wing icon." />
</div>
<span className="font-title-md text-on-surface">Général Express Voyage</span>
</div>
</td>
<td className="px-lg py-md text-on-surface">Premium</td>
<td className="px-lg py-md text-on-surface">142</td>
<td className="px-lg py-md text-on-surface">28</td>
<td className="px-lg py-md">
<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm">Active</span>
</td>
<td className="px-lg py-md">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_horiz</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPM87ZhmgDwyJVPfwjgQcUvFV5SFEzcMuFKan3e0R9HCUn-5u_sVSTSsZMrT_VVaEar3aeoYAowpGTRGXSpx1gU71lISdEtYV67E0bPgBMv7Cj_arib-MvBaUjT7ejggDlZGsjyy0nb20EtPi-gzqASJz1gqFnmgRJA0-7twei0uP8RsY7Pqp8y9j1SGPfe1zUjL9WjpWSbqTmAbENWYxcKVtgnlnruBbV9wMttvtlRlmnyZjaeTGo0JesFFxIfGI57zKXBB8nijk" alt="Modern geometric logo for 'Touristique Express'. A stylized yellow road winding through green hills, circular emblem design, flat vector style with high contrast suitable for dark mode interfaces." />
</div>
<span className="font-title-md text-on-surface">Touristique Express</span>
</div>
</td>
<td className="px-lg py-md text-on-surface">Premium</td>
<td className="px-lg py-md text-on-surface">85</td>
<td className="px-lg py-md text-on-surface">15</td>
<td className="px-lg py-md">
<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm">Active</span>
</td>
<td className="px-lg py-md">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_horiz</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANGcd7vslGO7DtqIzFWtuAmSq7CLGUI5ORp7de--_pMorRL97nD9usbnU47KV9FrWuEpsKA6pRwy_XgbiTzG6bimetrwLYuV2UBJZmad3Q1fV48CqYH5F6D-_wgCiLWsRmZ9gWcWSPm3EnodI5uL6BZUky_QJZNe58xfAxnws7ORG5h74Qwwz06TsdLnjZrThXa-gOU1zQVLPa0tUuXx7sNeher_ZIib5ksLlHDih5rBjGA0kPvdYAvAEsS-1bLx7IcHOg8LgNFMI" alt="Simple red and white logo for 'Finexs Voyages'. A stylized letter 'F' that transitions into a forward-moving arrow. Professional, minimalist corporate branding." />
</div>
<span className="font-title-md text-on-surface">Finexs Voyages</span>
</div>
</td>
<td className="px-lg py-md text-on-surface">Basic</td>
<td className="px-lg py-md text-on-surface">12</td>
<td className="px-lg py-md text-on-surface">4</td>
<td className="px-lg py-md">
<span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-label-sm">Trial</span>
</td>
<td className="px-lg py-md">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_horiz</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
{/* Comparison Table: Basic vs Premium */}
<section className="space-y-md">
<div className="text-center py-lg">
<h3 className="font-display-lg text-on-surface mb-xs">Choose Your Agency's Power</h3>
<p className="text-body-lg text-on-surface-variant">Upgrade individual agencies to Premium to unlock high-fidelity fleet tracking and automated passenger notifications.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-5xl mx-auto">
{/* Basic Plan */}
<div className="glass-panel p-lg rounded-3xl flex flex-col border-outline-variant/30 relative">
<div className="mb-lg">
<h4 className="font-headline-lg text-on-surface mb-xs">Basic</h4>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-on-surface">75,000</span>
<span className="text-on-surface-variant font-label-sm uppercase">XAF / Month</span>
</div>
</div>
<ul className="space-y-md mb-xl flex-1">
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface-variant">Up to 15 Active Buses</span>
</li>
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface-variant">Standard Ticketing Portal</span>
</li>
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface-variant">SMS Notifications Only</span>
</li>
<li className="flex items-center gap-md opacity-40">
<span className="material-symbols-outlined">cancel</span>
<span className="text-on-surface-variant line-through">Real-time GPS Tracking</span>
</li>
<li className="flex items-center gap-md opacity-40">
<span className="material-symbols-outlined">cancel</span>
<span className="text-on-surface-variant line-through">WhatsApp Integration</span>
</li>
</ul>
<button className="w-full py-4 glass-panel border-outline text-on-surface font-bold rounded-2xl hover:bg-surface-variant transition-all">Current for 4 Agencies</button>
</div>
{/* Premium Plan */}
<div className="glass-panel p-lg rounded-3xl flex flex-col border-primary/30 inner-glow-primary ambient-glow-primary relative overflow-hidden">
{/* Popular Badge */}
<div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-bold">SOVEREIGN CHOICE</div>
<div className="mb-lg">
<h4 className="font-headline-lg text-primary mb-xs">Premium</h4>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-on-surface">150,000</span>
<span className="text-on-surface-variant font-label-sm uppercase">XAF / Month</span>
</div>
</div>
<ul className="space-y-md mb-xl flex-1">
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface font-semibold">Unlimited Fleet Scale</span>
</li>
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface">Advanced AI Routing</span>
</li>
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface">WhatsApp Notifications (Unlimited)</span>
</li>
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface">Real-time Live GPS Tracking</span>
</li>
<li className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-on-surface font-semibold">Priority 24/7 Support</span>
</li>
</ul>
<button className="w-full py-4 bg-gradient-to-r from-primary-container to-primary/80 text-on-primary font-bold rounded-2xl transition-transform active:scale-95 shadow-lg shadow-primary/20">Upgrade Agencies</button>
</div>
</div>
</section>
</div>
{/* Footer Padding for Mobile Nav */}
<div className="h-24 md:hidden"></div>
</main>
{/* Floating Bottom Navigation (Mobile Only) */}
<nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 glass-panel rounded-full flex items-center justify-around px-md z-50">
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-medium">Home</span>
</button>
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="text-[10px] font-medium">Agencies</span>
</button>
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>payments</span>
<span className="text-[10px] font-bold">Billing</span>
</button>
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px] font-medium">Setup</span>
</button>
</nav>
{/* Decorative Animated Background Shader */}
<div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">

</div>
    </div>
  );
}
