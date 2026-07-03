'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useAgencies, useDrivers } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/gestion-des-chefs-d-agence-opep-proprietaire
 */
export default function GestionDesChefsDAgenceOpepProprietaireReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"group","label":"Managers"},{"icon":"settings","label":"Configuration"}];
  const bottom = [{"icon":"help","label":"Help"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      <Sidebar
        items={items}
        bottomItems={bottom}
  activeIndex={2}
  onNavChange={setActiveTab}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">corporate_fare</span></div>}
/>

<header className="flex justify-between items-center px-container-padding w-full h-16 sticky top-0 z-40 bg-surface-container border-b border-outline-variant md:ml-[280px] md:w-[calc(100%-280px)]">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined md:hidden text-on-surface cursor-pointer">menu</span>
<h2 className="font-title-md text-title-md font-bold text-primary">Staff Management</h2>
</div>
<div className="flex items-center gap-md">
<div className="hidden md:flex items-center bg-surface-container-high rounded-full px-sm py-1 border border-outline-variant">
<span className="material-symbols-outlined text-outline text-[20px]">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-outline-variant w-48" placeholder="Search staff..." type="text"/>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">translate</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">notifications</span>
<div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0DyE-5Oev1MTfxPsz0GP-RjBDDeYps0tcqZUmQUnKBnzPrJqWqcmB3asz6lUcjmx7GeCoy6VkOseRTtv9A0hcIQAv1ZwDXI2mMO6361jvSEvhUvFul7P2ATPtP3jvhHWBMgUL-EJSO9PWc8HdST2-x7H07PE6IIhLVmU3ga3qimutkD_7SozspLA8IPdQlRPiPuuK3-QShQyCtKsRLf78N7w24HSl9iA9k9TodbKt97OlBba7sDNzbFc2II31Cb8DQa068Rd0Yxc" alt="A portrait of a professional African male administrator in a modern office, wearing a sharp grey suit with subtle traditional embroidery. High-end photography style with soft bokeh background and warm lighting that highlights leadership and competence. Cinematic lighting with vibrant teal accents reflecting the OPEP brand identity." />
</div>
</div>
</div>
</header>

<main className="md:ml-[280px] p-container-padding min-h-screen">

<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-gutter">
<div>
<h3 className="font-headline-lg text-headline-lg text-on-surface">Agency Heads</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Manage leadership roles across your transportation network.</p>
</div>
<button className="btn-gradient px-lg py-sm rounded-full flex items-center gap-xs font-bold text-on-primary active:scale-95 transition-all glass-glow">
<span className="material-symbols-outlined">person_add</span>
<span>Invite Agency Head</span>
</button>
</div>

<div className="flex gap-sm mb-lg overflow-x-auto pb-base">
<span className="px-md py-xs bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm border border-primary/20">All Staff (24)</span>
<span className="px-md py-xs bg-surface-container-highest text-on-surface-variant rounded-full font-label-sm text-label-sm border border-outline-variant hover:border-primary/40 transition-colors cursor-pointer">Douala Central</span>
<span className="px-md py-xs bg-surface-container-highest text-on-surface-variant rounded-full font-label-sm text-label-sm border border-outline-variant hover:border-primary/40 transition-colors cursor-pointer">Yaoundé Express</span>
<span className="px-md py-xs bg-surface-container-highest text-on-surface-variant rounded-full font-label-sm text-label-sm border border-outline-variant hover:border-primary/40 transition-colors cursor-pointer">Bafoussam Hub</span>
</div>

<div className="glass-card active-glow overflow-hidden mb-xl">
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-high/50 border-b border-outline-variant">
<th className="px-lg py-md text-left font-label-sm text-label-sm text-outline-variant uppercase tracking-widest">Agency Head</th>
<th className="px-lg py-md text-left font-label-sm text-label-sm text-outline-variant uppercase tracking-widest">Assigned Agency</th>
<th className="px-lg py-md text-left font-label-sm text-label-sm text-outline-variant uppercase tracking-widest">Contact Info</th>
<th className="px-lg py-md text-left font-label-sm text-label-sm text-outline-variant uppercase tracking-widest">Status</th>
<th className="px-lg py-md text-right font-label-sm text-label-sm text-outline-variant uppercase tracking-widest">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">

<tr className="hover:bg-primary/5 transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-full border border-primary/10 overflow-hidden">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOmhMR_VsZHvND-kUaPBnFxBmK6DdzNJMS6Ih4dJCSdNNkgP9yf-t4vKkBTtaipRJrlVlPyvKqgnTakAjRtHLyY_MYSl7lBN3-olDWhyivEz-YT6_9J24aDuabKtTuBZM5WBReJ71pomaaLoQ0P7loPZpde1u_7vDy0R-Yx4_gStEuWSOn5utXMQY-GjZ5j-nOufNePD_EDGQAG6APjiq0exNmqbOM9zeXW3L-B8BxBIpTz4KVa-QCb3Sy7aSjWmzopblHOhdybLM" alt="Close-up headshot of a professional African woman with a confident smile, wearing glasses and a business casual mustard yellow top. The lighting is crisp and modern with a clean, tech-focused background. Professional lighting, 8k resolution, corporate photography style." />
</div>
<div>
<p className="font-title-md text-title-md text-on-surface leading-tight">Sarah Nguimbous</p>
<p className="font-label-sm text-label-sm text-primary">Senior Agency Head</p>
</div>
</div>
</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary">corporate_fare</span>
<span className="font-body-md text-body-md text-on-surface">Douala Littoral Express</span>
</div>
</td>
<td className="px-lg py-md">
<p className="font-body-md text-body-md text-on-surface">s.nguimbous@opep.cm</p>
<p className="font-label-sm text-label-sm text-outline-variant">+237 670 442 811</p>
</td>
<td className="px-lg py-md">
<span className="px-sm py-base rounded-full bg-primary/10 text-primary border border-primary/20 font-label-sm text-label-sm">Active</span>
</td>
<td className="px-lg py-md text-right">
<button className="p-xs text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-xs text-on-surface-variant hover:text-secondary transition-colors ml-xs">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-primary/5 transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-full border border-primary/10 overflow-hidden">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAF0BLmmutN8VQ99GrOSIlOiAKmVjIVYLwm2rywnUqUi7RcRmzIQyS6yakbmTz6fHp7JQ9FBAcDowLMNiKdAct3ZfGobmRg9QCzU_f0o1hcB0uSTVyw56_OpBiCrmKUen1SVFqT2Y3-c_LnUOodn8HbAePAX_OG7yWFWqJynVDuR_TSBpu6qBxUXQrRJJDFDvcOueGRT69okx_Jfzg740jn6qmQq_vaWpoH2FNsg38OQhEkbmhCXoaN5F8b0DKljCoVSdrp2ruYAA" alt="Portrait of a young, energetic African male professional wearing a white OPEP branded polo shirt. He looks approachable and tech-savvy. The background features blurred buses and a modern terminal structure. Cinematic sunset lighting, vibrant colors, shallow depth of field." />
</div>
<div>
<p className="font-title-md text-title-md text-on-surface leading-tight">Samuel Eto'o Junior</p>
<p className="font-label-sm text-label-sm text-primary">Agency Manager</p>
</div>
</div>
</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary">corporate_fare</span>
<span className="font-body-md text-body-md text-on-surface">Yaoundé City Trans</span>
</div>
</td>
<td className="px-lg py-md">
<p className="font-body-md text-body-md text-on-surface">s.etoojr@opep.cm</p>
<p className="font-label-sm text-label-sm text-outline-variant">+237 699 123 456</p>
</td>
<td className="px-lg py-md">
<span className="px-sm py-base rounded-full bg-primary/10 text-primary border border-primary/20 font-label-sm text-label-sm">Active</span>
</td>
<td className="px-lg py-md text-right">
<button className="p-xs text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-xs text-on-surface-variant hover:text-secondary transition-colors ml-xs">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-primary/5 transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-full border border-primary/10 overflow-hidden">
<div className="w-full h-full bg-surface-container-highest flex items-center justify-center font-bold text-outline text-lg">BT</div>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface leading-tight">Blaise Tsafack</p>
<p className="font-label-sm text-label-sm text-primary">Junior Lead</p>
</div>
</div>
</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs text-outline-variant italic">
<span className="material-symbols-outlined">hourglass_top</span>
<span className="font-body-md text-body-md">Unassigned</span>
</div>
</td>
<td className="px-lg py-md">
<p className="font-body-md text-body-md text-on-surface">b.tsafack@opep.cm</p>
<p className="font-label-sm text-label-sm text-outline-variant">+237 655 889 221</p>
</td>
<td className="px-lg py-md">
<span className="px-sm py-base rounded-full bg-tertiary/10 text-tertiary border border-tertiary/20 font-label-sm text-label-sm">Pending Invite</span>
</td>
<td className="px-lg py-md text-right">
<button className="p-xs text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">mail</span>
</button>
<button className="p-xs text-on-surface-variant hover:text-secondary transition-colors ml-xs">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-md flex justify-between items-center bg-surface-container-high/30">
<span className="font-label-sm text-label-sm text-on-surface-variant">Showing 3 of 24 Agency Heads</span>
<div className="flex items-center gap-base">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-xs">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest transition-colors">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest transition-colors">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-md">
<div className="glass-card active-glow p-lg flex flex-col items-center text-center">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-md">
<span className="material-symbols-outlined text-primary text-[32px]">shield_person</span>
</div>
<h4 className="font-headline-lg text-headline-lg text-on-surface">12</h4>
<p className="font-body-md text-body-md text-on-surface-variant">Active Heads</p>
</div>
<div className="glass-card active-glow p-lg flex flex-col items-center text-center">
<div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center mb-md">
<span className="material-symbols-outlined text-tertiary text-[32px]">mark_email_unread</span>
</div>
<h4 className="font-headline-lg text-headline-lg text-on-surface">4</h4>
<p className="font-body-md text-body-md text-on-surface-variant">Pending Responses</p>
</div>
<div className="glass-card active-glow p-lg flex flex-col items-center text-center">
<div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-md">
<span className="material-symbols-outlined text-secondary text-[32px]">warning</span>
</div>
<h4 className="font-headline-lg text-headline-lg text-on-surface">2</h4>
<p className="font-body-md text-body-md text-on-surface-variant">Unassigned Agencies</p>
</div>
</div>
</main>

<button className="md:hidden fixed bottom-8 right-6 w-14 h-14 rounded-full btn-gradient glass-glow flex items-center justify-center text-on-primary shadow-2xl z-50 active:scale-90 transition-transform">
<span className="material-symbols-outlined text-[28px]">person_add</span>
</button>
    </div>
  );
}
