'use client';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useIncidents, useCreateIncident, useResolveIncident } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/gestion-des-incidents-remboursements-opep-admin
 */
export default function GestionDesIncidentsRemboursementsOpepAdminReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const { data: incidents, isLoading: incidentsLoading, error: incidentsError, refetch: incidentsRefetch } = useIncidents();
  const resolveIncident = useResolveIncident();
  const [showRefundModal, setRefundModal] = useState(false);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* Side Navigation Bar (Shared Component: SideNavBar) */}
{/* Sidebar */}
          <Sidebar
  items={[{"icon":"dashboard","label":"Dashboard"},{"icon":"business","label":"Agencies"},{"icon":"route","label":"Trips"},{"icon":"directions_bus","label":"Buses"},{"icon":"badge","label":"Staff"},{"icon":"analytics","label":"Analytics"}]}
  bottomItems={[]}
  activeIndex={0}
  onNavChange={setActiveTab}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">security</span></div>}
  subtitle="Sovereign Management"
/>
{/* Top Navigation Bar (Shared Component: TopNavBar) */}
<header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-surface/80 flex justify-between items-center px-6 z-40 border-b border-outline-variant/10 backdrop-blur-md">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-96">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary" placeholder="Search incidents, refunds, or buses..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex gap-4">
<button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all rounded-full">
<span className="material-symbols-outlined">language</span>
</button>
<div className="relative">
<button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all rounded-full">
<span className="material-symbols-outlined">notifications</span>
</button>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
</div>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="ml-64 pt-16 min-h-screen p-md space-y-md">
{/* Header Section */}
<section className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xs">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Incident Management</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time alerts and passenger redistribution control.</p>
</div>
<div className="flex gap-xs">
<button className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-highest text-on-surface rounded-full font-label-sm text-label-sm border border-outline-variant/20 hover:bg-surface-bright transition-all">
<span className="material-symbols-outlined text-sm">filter_list</span> Filter Alerts
                </button>
<button className="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm font-bold shadow-lg shadow-primary-container/20 hover:scale-105 transition-transform">
<span className="material-symbols-outlined text-sm">add_alert</span> Log Incident
                </button>
</div>
</section>
{/* Top Grid: Active Alerts & Stats */}
<div className="grid grid-cols-12 gap-md">
{/* Bento Stats */}
<div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-md">
<div className="glass-panel p-md rounded-3xl flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<div className="p-2 bg-error/10 text-error rounded-lg">
<span className="material-symbols-outlined">warning</span>
</div>
<span className="text-error font-label-sm text-label-sm">+12%</span>
</div>
<div>
<p className="text-3xl font-display-lg text-on-surface">{incidentsLoading ? '...' : incidents?.length || 14}</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Active Incidents</p>
</div>
</div>
<div className="glass-panel p-md rounded-3xl flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<div className="p-2 bg-tertiary/10 text-tertiary rounded-lg">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>payments</span>
</div>
<span className="text-tertiary font-label-sm text-label-sm">24h</span>
</div>
<div>
<p className="text-3xl font-display-lg text-on-surface">1.2M</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Pending Refunds</p>
</div>
</div>
<div className="col-span-2 glass-panel p-md rounded-3xl flex items-center gap-md h-32 relative overflow-hidden group">
<div className="relative z-10">
<p className="font-label-sm text-label-sm text-on-surface-variant">System Reliability</p>
<p className="text-4xl font-headline-lg text-primary">98.4%</p>
</div>
<div className="flex-1 h-12 flex items-end gap-1 relative z-10">
<div className="w-full bg-primary/20 h-[40%] rounded-sm"></div>
<div className="w-full bg-primary/20 h-[60%] rounded-sm"></div>
<div className="w-full bg-primary/20 h-[50%] rounded-sm"></div>
<div className="w-full bg-primary/20 h-[80%] rounded-sm"></div>
<div className="w-full bg-primary/40 h-[90%] rounded-sm"></div>
<div className="w-full bg-primary h-[95%] rounded-sm"></div>
</div>

</div>
</div>
{/* Active Alerts Table */}
<div className="col-span-12 lg:col-span-8 glass-panel rounded-3xl overflow-hidden flex flex-col border border-outline-variant/10">
<div className="p-md border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
<h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                        Critical Alerts <span className="bg-secondary text-on-secondary text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
</h3>
<button className="text-primary font-label-sm text-label-sm hover:underline">View History</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant/5">
<th className="px-md py-4 font-medium">Incident</th>
<th className="px-md py-4 font-medium">Location</th>
<th className="px-md py-4 font-medium">Pax</th>
<th className="px-md py-4 font-medium">Status</th>
<th className="px-md py-4 font-medium text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md">
<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-md py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
<span className="material-symbols-outlined">directions_bus</span>
</div>
<div>
<p className="font-bold">Bus B-402 Breakdown</p>
<p className="text-xs text-on-surface-variant">Douala → Yaoundé</p>
</div>
</div>
</td>
<td className="px-md py-4 text-on-surface-variant">Edea Crossing</td>
<td className="px-md py-4">
<span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs">48 / 52</span>
</td>
<td className="px-md py-4">
<span className="inline-flex items-center gap-1.5 text-error font-bold text-xs uppercase tracking-wider">
<span className="w-2 h-2 rounded-full bg-error animate-pulse"></span> Critical
                                    </span>
</td>
<td className="px-md py-4 text-right">
<button className="text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors" onClick={() => {}}>
<span className="material-symbols-outlined">bolt</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-high/40 transition-colors group">
<td className="px-md py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined">schedule</span>
</div>
<div>
<p className="font-bold">+90m Delay (Roadblock)</p>
<p className="text-xs text-on-surface-variant">Bafoussam Express</p>
</div>
</div>
</td>
<td className="px-md py-4 text-on-surface-variant">Mbouda Bypass</td>
<td className="px-md py-4">
<span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs">22 / 30</span>
</td>
<td className="px-md py-4">
<span className="inline-flex items-center gap-1.5 text-tertiary font-bold text-xs uppercase tracking-wider">
<span className="w-2 h-2 rounded-full bg-tertiary"></span> Moderate
                                    </span>
</td>
<td className="px-md py-4 text-right">
<button className="text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors" onClick={() => {}}>
<span className="material-symbols-outlined">bolt</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
{/* Action Panel & Manual Refunds */}
<div className="grid grid-cols-12 gap-md">
{/* Manual Refund Portal */}
<div className="col-span-12 lg:col-span-5 glass-panel rounded-3xl p-lg border border-outline-variant/10">
<h3 className="font-title-md text-title-md text-on-surface mb-sm">Manual Refund Request</h3>
<p className="font-body-md text-body-md text-on-surface-variant mb-md">Initiate a policy-based refund for a specific passenger or entire manifest.</p>
<div className="space-y-md">
<div>
<label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Search Passenger or Ticket ID</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">person_search</span>
<input className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-3 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Enter OPEP-XXXX-XXXX" type="text"/>
</div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div>
<label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Incident Type</label>
<select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20">
<option>Technical Breakdown</option>
<option>Delay &gt; 4 Hours</option>
<option>Safety Hazard</option>
<option>Customer Service</option>
</select>
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Refund Priority</label>
<select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20">
<option>Standard</option>
<option>Urgent</option>
<option>VIP / Corporate</option>
</select>
</div>
</div>
<button className="w-full bg-on-surface text-surface py-4 rounded-2xl font-label-sm text-label-sm font-bold flex items-center justify-center gap-2 hover:bg-on-surface-variant transition-colors" onClick={() => {}}>
                        Calculate Eligibility &amp; Review <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
{/* Redistribution / Logistics Map */}
<div className="col-span-12 lg:col-span-7 glass-panel rounded-3xl relative overflow-hidden h-[400px] border border-outline-variant/10">
<div className="absolute inset-0 bg-cover bg-center" data-alt="A detailed digital map interface showing the road network between Douala and Yaoundé, Cameroon. The map uses a sleek dark-mode aesthetic with glowing emerald arterial roads and neon yellow incident markers. Data visualizations like bus speed vectors and passenger density heatmaps are overlaid on the terrain." style={{}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
<div className="absolute bottom-md left-md right-md flex justify-between items-end">
<div className="p-md glass-panel rounded-2xl max-w-xs">
<p className="font-label-sm text-label-sm text-primary mb-1">Logistics View</p>
<h4 className="font-title-md text-title-md text-on-surface">Transit Hub - Edea</h4>
<p className="font-body-md text-body-md text-on-surface-variant">3 backup buses within 15km range. Est. arrival 18m.</p>
</div>
<div className="flex gap-2">
<button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-on-surface hover:bg-primary/20 transition-all">
<span className="material-symbols-outlined">my_location</span>
</button>
<button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-on-surface hover:bg-primary/20 transition-all">
<span className="material-symbols-outlined">layers</span>
</button>
</div>
</div>
</div>
</div>
</main>
{/* Refund Confirmation Modal (Hidden by Default) */}
<div className="fixed inset-0 z-[100] hidden flex items-center justify-center p-md" id="refundModal">
<div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setRefundModal(true)}></div>
<div className="glass-panel w-full max-w-lg rounded-[2rem] p-lg relative z-10 inner-glow-primary ambient-glow">
<div className="flex justify-between items-start mb-lg">
<div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-4xl" style={{"fontVariationSettings":"'FILL' 1"}}>verified_user</span>
</div>
<button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors" onClick={() => setRefundModal(false)}>
<span className="material-symbols-outlined">close</span>
</button>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Refund Eligibility</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg">Calculated based on OPEP Sovereign Policy §4.2</p>
<div className="space-y-md mb-xl">
<div className="flex justify-between p-md bg-surface-container-low rounded-2xl border border-outline-variant/10">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">Calculation Tier</p>
<p className="font-title-md text-title-md text-primary font-bold">90% Full Refund</p>
</div>
<div className="text-right">
<p className="font-label-sm text-label-sm text-on-surface-variant">Reasoning</p>
<p className="font-body-md text-body-md text-on-surface">Mechanical failure &gt; 3h</p>
</div>
</div>
<div className="space-y-sm">
<div className="flex justify-between font-body-md text-body-md">
<span className="text-on-surface-variant">Ticket Amount (XAF)</span>
<span className="text-on-surface">15,500</span>
</div>
<div className="flex justify-between font-body-md text-body-md">
<span className="text-on-surface-variant">Policy Deduction (10%)</span>
<span className="text-error">-1,550</span>
</div>
<div className="h-px bg-outline-variant/20 my-2"></div>
<div className="flex justify-between items-end">
<span className="font-title-md text-title-md text-on-surface font-bold">Payable Amount</span>
<span className="text-3xl font-display-lg text-primary">13,950 <span className="text-sm">XAF</span></span>
</div>
</div>
</div>
<div className="flex gap-sm">
<button className="flex-1 py-4 rounded-2xl bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-bold border border-outline-variant/20 hover:bg-surface-bright" onClick={() => setRefundModal(false)}>Cancel</button>
<button className="flex-1 py-4 rounded-2xl bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold hover:brightness-110 transition-all">Execute Refund</button>
</div>
</div>
</div>
{/* Micro-interactions Script */}
    </div>
  );
}
