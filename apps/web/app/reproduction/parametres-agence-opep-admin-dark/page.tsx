'use client';

import React, { useState } from 'react';
import { useAgencies } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/parametres-agence-opep-admin-dark
 */
export default function ParametresAgenceOpepAdminDarkReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"settings","label":"Settings"},{"icon":"shield","label":"Security"},{"icon":"palette","label":"Appearance"}];
  const bottom = [{"icon":"help","label":"Help"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      <Sidebar
        items={items}
        bottomItems={bottom}
  activeIndex={1}
  onNavChange={setActiveTab}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">settings</span></div>}
/>

<main className="ml-[280px] flex-1 flex flex-col h-screen overflow-y-auto bg-surface">

<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-charcoal-border">
<div className="flex items-center gap-8">
<h1 className="font-headline-lg text-title-md font-bold text-primary">OPEP Portal</h1>
<nav className="hidden md:flex gap-6">
<a className="text-on-surface-variant font-body-lg hover:text-primary transition-colors cursor-pointer active:opacity-80" href="#">Overview</a>
<a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-lg cursor-pointer active:opacity-80" href="#">Settings</a>
<a className="text-on-surface-variant font-body-lg hover:text-primary transition-colors cursor-pointer active:opacity-80" href="#">Logs</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden lg:block">
<input className="bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-2 pl-10 text-body-sm w-64 focus:border-primary outline-none text-on-surface" placeholder="Search settings..." type="text"/>
<span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
</div>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">translate</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
</button>
<div className="flex items-center gap-3 ml-2 pl-4 border-l border-charcoal-border">
<div className="text-right">
<p className="text-body-sm font-bold leading-none">Super Admin</p>
<p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">OPEP Central</p>
</div>
<img className="w-10 h-10 rounded-full border border-charcoal-border object-cover" data-alt="A professional headshot of a senior administrator in a high-tech logistics corporate office environment. The subject is wearing a sharp charcoal suit against a backdrop of blurred digital data monitors. The lighting is crisp and modern with cool blue tones and vibrant cyan accents reflecting the OPEP portal's advanced technological identity. High-fidelity cinematic photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1pUT8DIWV5METwLg7H6RlzpaNMzpBQJSLYaHMQfM4fcyMgsBw_7EtbsxlqrPojucrEsy50SECreHOv2aq377qvEJr3A8sWG1XbISo8TcIThRTg1ayh39v7406_ejjXEoytPxF6kOa9qJbo2wKZyZ0syPPdRUme4tOs1Ah84wsugf4883DXeUYl_WrOJtd81nzgFElG2qe_nTijh711Oe8TaxniT79GB_UWO8_uik7Jse_KTl-2oFuhGRQckyZgFcS2B82d7nOXms"/>
</div>
</div>
</header>

<div className="p-margin-desktop space-y-8 max-w-[1200px] mx-auto w-full">

<div className="flex justify-between items-end">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Agency Settings</h2>
<p className="text-on-surface-variant font-body-lg mt-1">Manage your agency profile, subscription plans, and staff permissions.</p>
</div>
<button className="bg-primary text-on-primary font-label-caps px-6 py-3 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 active:scale-95">
<span className="material-symbols-outlined">save</span>
                    Save All Changes
                </button>
</div>

<div className="grid grid-cols-12 gap-gutter">

<div className="col-span-12 lg:col-span-8 space-y-gutter">
<section className="glass-card rounded-xl p-8">
<div className="flex items-center gap-4 mb-8">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>store</span>
<h3 className="font-title-md text-title-md text-on-surface">Agency Profile</h3>
</div>
<div className="flex flex-col md:flex-row gap-10">

<div className="flex flex-col items-center gap-4">
<div className="relative group">
<div className="w-40 h-40 rounded-xl bg-surface-container border-2 border-dashed border-charcoal-border flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-contain p-4" data-alt="A minimalist and powerful corporate logo for a Cameroonian transport agency. The logo features a stylized gazelle in motion, rendered in bold primary teal and deep charcoal. The background is a clean, slightly textured off-white. The aesthetic is modern, authoritative, and represents speed and reliability in the interurban transport industry. High contrast, vector style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHy6w2HsG6Y7cZQM8PGct1t5fB4rhzAcSxw05u9WLvFj4IjsaxGoXAOH8bon1WBYcDJjyhtyXtqnS1rec55m03YmlB3dGQhH7ALtcgfxjPgIGpPBfnI5HToj3DL7oVgjiWTKp0ENum6v4JleOCxlVr_zop_QVszIo4HTT_RR0YPGgs9OOFxF6jLy2S1bkABOdHcb8gExe1dbX1gsE9ENE-PeAYki3XynmFbfqyU5_MzrOHrc_2b092n2-GU-wCBNSb0IsawL2BAmw"/>
<div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-white">cloud_upload</span>
</div>
</div>
</div>
<p className="font-label-caps text-[10px] text-on-surface-variant">Recommended: 512x512 PNG/SVG</p>
</div>

<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="font-label-caps text-on-surface-variant block uppercase tracking-wider">Agency Name / Nom de l'agence</label>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-3 text-body-lg focus:border-primary outline-none" type="text" value="Finexs Voyages"/>
</div>
<div className="space-y-2">
<label className="font-label-caps text-on-surface-variant block uppercase tracking-wider">Tax ID / Numéro d'impôt</label>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-3 text-body-lg focus:border-primary outline-none" type="text" value="TAX-CM-90210-FX"/>
</div>
<div className="col-span-full space-y-2">
<label className="font-label-caps text-on-surface-variant block uppercase tracking-wider">Address / Adresse</label>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-3 text-body-lg focus:border-primary outline-none" type="text" value="Mvan District, Yaoundé, Centre Region, Cameroon"/>
</div>
<div className="space-y-2">
<label className="font-label-caps text-on-surface-variant block uppercase tracking-wider">Primary Phone / Téléphone</label>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-3 text-body-lg focus:border-primary outline-none" type="tel" value="+237 670 000 000"/>
</div>
<div className="space-y-2">
<label className="font-label-caps text-on-surface-variant block uppercase tracking-wider">Public Email / Email</label>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg px-4 py-3 text-body-lg focus:border-primary outline-none" type="email" value="contact@finexs.cm"/>
</div>
</div>
</div>
</section>

<section className="glass-card rounded-xl overflow-hidden">
<div className="p-8 border-b border-charcoal-border flex justify-between items-center">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>group</span>
<h3 className="font-title-md text-title-md text-on-surface">User Management</h3>
</div>
<button className="text-primary hover:bg-primary/10 font-label-caps px-4 py-2 rounded-lg border border-primary transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]">person_add</span>
                                Invite Staff
                            </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-high">
<tr>
<th className="px-8 py-4 font-label-caps text-on-surface-variant">Staff Member</th>
<th className="px-8 py-4 font-label-caps text-on-surface-variant">Role</th>
<th className="px-8 py-4 font-label-caps text-on-surface-variant">Status</th>
<th className="px-8 py-4 font-label-caps text-on-surface-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">
<tr className="hover:bg-surface-container transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary">EB</div>
<div>
<p className="text-body-lg font-bold">Emmanuel Biya</p>
<p className="text-body-sm text-on-surface-variant">e.biya@finexs.cm</p>
</div>
</div>
</td>
<td className="px-8 py-5">
<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase">Agency Manager</span>
</td>
<td className="px-8 py-5">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-success-green"></div>
<span className="text-body-sm text-success-green">Active</span>
</div>
</td>
<td className="px-8 py-5 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary">ST</div>
<div>
<p className="text-body-lg font-bold">Samuel Tagne</p>
<p className="text-body-sm text-on-surface-variant">s.tagne@finexs.cm</p>
</div>
</div>
</td>
<td className="px-8 py-5">
<span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold uppercase">Controller</span>
</td>
<td className="px-8 py-5">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-success-green"></div>
<span className="text-body-sm text-success-green">Active</span>
</div>
</td>
<td className="px-8 py-5 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary">JM</div>
<div>
<p className="text-body-lg font-bold">Jean Moundi</p>
<p className="text-body-sm text-on-surface-variant">j.moundi@finexs.cm</p>
</div>
</div>
</td>
<td className="px-8 py-5">
<span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold uppercase">Staff</span>
</td>
<td className="px-8 py-5">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-warning-yellow"></div>
<span className="text-body-sm text-warning-yellow">Invited</span>
</div>
</td>
<td className="px-8 py-5 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">delete</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>

<div className="col-span-12 lg:col-span-4 space-y-gutter">

<section className="glass-card rounded-xl p-8 relative overflow-hidden group">

<div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all"></div>
<div className="relative z-10">
<div className="flex items-center gap-4 mb-6">
<span className="material-symbols-outlined text-tertiary" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
<h3 className="font-title-md text-title-md text-on-surface">Current Plan</h3>
</div>
<div className="bg-surface-container-highest/50 p-6 rounded-xl border border-charcoal-border mb-8">
<div className="flex justify-between items-start mb-4">
<div>
<p className="text-display-lg text-[40px] leading-tight font-bold text-primary">Premium</p>
<p className="text-on-surface-variant font-label-caps uppercase tracking-widest mt-1">Agency Tier</p>
</div>
<div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-bold border border-primary/20">ACTIVE</div>
</div>
<div className="space-y-3">
<div className="flex items-center gap-2 text-body-sm">
<span className="material-symbols-outlined text-success-green text-[18px]">check_circle</span>
                                        Unlimited Route Management
                                    </div>
<div className="flex items-center gap-2 text-body-sm">
<span className="material-symbols-outlined text-success-green text-[18px]">check_circle</span>
                                        Advanced Dashboard Analytics
                                    </div>
<div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-success-green text-[18px]">check_circle</span>
                                        Priority Technical Support
                                    </div>
</div>
</div>
<div className="space-y-4">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface-variant">Renewal Date</span>
<span className="font-bold">Oct 12, 2024</span>
</div>
<div className="flex justify-between text-body-sm">
<span className="text-on-surface-variant">Monthly Fee</span>
<span className="font-bold text-primary">75 000 FCFA</span>
</div>
<button className="w-full bg-surface-variant text-on-surface font-label-caps py-3 rounded-lg hover:bg-surface-container-highest transition-all mt-4">
                                    Manage Subscription
                                </button>
<button className="w-full text-secondary font-label-caps py-2 hover:underline transition-all">
                                    Downgrade to Basic
                                </button>
</div>
</div>
</section>

<section className="glass-card rounded-xl p-8">
<div className="flex items-center gap-4 mb-8">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>analytics</span>
<h3 className="font-title-md text-title-md text-on-surface">Data Usage</h3>
</div>
<div className="space-y-8">
<div>
<div className="flex justify-between mb-2">
<p className="text-body-sm text-on-surface-variant uppercase font-bold tracking-tighter">Trips Created (Monthly)</p>
<p className="text-body-sm font-bold">482 / 500</p>
</div>
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-secondary w-[96%] h-full rounded-full"></div>
</div>
</div>
<div>
<div className="flex justify-between mb-2">
<p className="text-body-sm text-on-surface-variant uppercase font-bold tracking-tighter">Bus Fleet Slots</p>
<p className="text-body-sm font-bold">12 / 20</p>
</div>
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-primary w-[60%] h-full rounded-full"></div>
</div>
</div>
<div className="pt-4 border-t border-charcoal-border">
<a className="flex items-center justify-between group" href="#">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">history</span>
<span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Audit logs</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
</a>
</div>
</div>
</section>
</div>
</div>

</div>
</main>
    </div>
  );
}
