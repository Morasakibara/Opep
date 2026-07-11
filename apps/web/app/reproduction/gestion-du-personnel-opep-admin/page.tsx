'use client';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useDrivers } from '@/hooks/useEntities';
import { Sidebar, Modal } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/gestion-du-personnel-opep-admin
 */
export default function GestionDuPersonnelOpepAdminReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: drivers, isLoading: driversLoading, error: driversError, refetch: driversRefetch } = useDrivers();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddEmployeeModal, setAddEmployeeModal] = useState(false);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* SideNavBar Anchor */}
{/* Sidebar */}
          <Sidebar
  items={[{"icon":"dashboard","label":"Dashboard"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"route","label":"Trips"},{"icon":"directions_bus","label":"Buses"},{"icon":"group","label":"Staff"},{"icon":"monitoring","label":"Analytics"}]}
  bottomItems={[{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}]}
  activeIndex={4}
  onNavChange={(index: number) => setActiveTab(String(index))}
  logo={<div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl">O</div>}
  ctaButton={{ icon: "person_add", label: "Ajouter un Employé", onClick: () => setAddEmployeeModal(true) }}
/>
{/* Main Content */}
<main className="ml-[280px] w-full flex flex-col min-h-screen relative">
{/* TopNavBar Anchor */}
<header className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-charcoal-border">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-low border border-charcoal-border rounded-lg pl-10 pr-4 py-2 focus:border-primary focus:ring-0 text-body-sm text-on-surface" placeholder="Rechercher un employé..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-3">
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined">translate</span></button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined">settings</span></button>
</div>
<div className="h-8 w-px bg-charcoal-border"></div>
<div className="flex items-center gap-3 cursor-pointer active:opacity-80 transition-all">
<div className="text-right">
<p className="font-body-lg text-body-lg text-on-surface font-semibold leading-tight">Admin OPEP</p>
<p className="text-on-surface-variant text-[12px]">Super Admin</p>
</div>
<img className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" data-alt="A professional close-up studio portrait of a confident West African male executive in a sleek dark gray suit, against a dark professional background with soft blue atmospheric lighting. The image captures a clean corporate aesthetic with high-fidelity textures and professional lighting, fitting a modern management portal interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6GOKQfc-RRPID1rcWGbRw2kgdrEGixA1PCdId3NeFEAprqpEIX6S9QwizFNv5sP8V6Xg-UapVtQKJG3MtTvIZwDLRxN1vESnPZcieWWJljdO4l9SstYW0qOmuHN6PFL82Uc7E-SOvpkhTpIjEeghqgcAI-TuYlst3FC4zvZDaEJmb50rhH-O0c1B0Kr1xMqmZpyDXONSqd_tqM3ggzWJOxX49kiy6xzOg0YqkkBwXPgBPSL5khQIOvLPkhh7BkBK7EMK41bvQh8c"/>
</div>
</div>
</header>
{/* Staff Dashboard Content */}
<div className="p-margin-desktop flex flex-col gap-margin-desktop">
{/* Page Header */}
<div className="flex justify-between items-end">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Gestion du Personnel</h2>
<p className="text-on-surface-variant font-body-lg text-body-lg mt-1">Supervisez et gérez les rôles de votre agence de transport.</p>
</div>              <button className="bg-primary text-on-primary px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10" onClick={() => setAddEmployeeModal(true)}>
<span className="material-symbols-outlined">add_circle</span>
                    Ajouter un Employé
                </button>
</div>
{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div className="bg-slate-surface border border-charcoal-border p-5 rounded-xl">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined p-2 bg-primary/10 text-primary rounded-lg">group</span>
<span className="text-success-green font-bold text-label-caps">+4%</span>
</div>
<p className="text-on-surface-variant font-label-caps text-label-caps">Total Staff</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{driversLoading ? '...' : drivers?.length || 124}</h3>
</div>
<div className="bg-slate-surface border border-charcoal-border p-5 rounded-xl">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined p-2 bg-tertiary/10 text-tertiary rounded-lg">payments</span>
</div>
<p className="text-on-surface-variant font-label-caps text-label-caps">Caissiers</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{driversLoading ? '...' : drivers?.filter(d => d.role === 'CASHIER').length || 32}</h3>
</div>
<div className="bg-slate-surface border border-charcoal-border p-5 rounded-xl">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined p-2 bg-secondary/10 text-secondary rounded-lg">verified_user</span>
</div>
<p className="text-on-surface-variant font-label-caps text-label-caps">Contrôleurs</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{driversLoading ? '...' : drivers?.filter(d => d.role === 'CONTROLLER').length || 45}</h3>
</div>
<div className="bg-slate-surface border border-charcoal-border p-5 rounded-xl">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined p-2 bg-primary-fixed/10 text-primary-fixed rounded-lg">minor_crash</span>
</div>
<p className="text-on-surface-variant font-label-caps text-label-caps">Chauffeurs</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{driversLoading ? '...' : drivers?.filter(d => d.role === 'DRIVER').length || 47}</h3>
</div>
</div>
{/* Staff List Section */}
<div className="bg-slate-surface border border-charcoal-border rounded-xl overflow-hidden flex flex-col">
<div className="p-6 border-b border-charcoal-border flex justify-between items-center glass-effect">
<h3 className="font-title-md text-title-md">Liste des Employés</h3>
<div className="flex gap-2">
<select className="bg-surface-container-low border-charcoal-border rounded-lg text-body-sm text-on-surface px-4 py-2 focus:border-primary ring-0">
<option>Tous les Rôles</option>
<option>Caissier</option>
<option>Contrôleur</option>
<option>Chauffeur</option>
</select>
<select className="bg-surface-container-low border-charcoal-border rounded-lg text-body-sm text-on-surface px-4 py-2 focus:border-primary ring-0">
<option>Statut: Tous</option>
<option>Actif</option>
<option>En congé</option>
<option>Inactif</option>
</select>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps">
<th className="px-6 py-4 font-semibold">Employé</th>
<th className="px-6 py-4 font-semibold">Rôle</th>
<th className="px-6 py-4 font-semibold">Contact</th>
<th className="px-6 py-4 font-semibold">Dernière Activité</th>
<th className="px-6 py-4 font-semibold">Statut</th>
<th className="px-6 py-4 font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-charcoal-border">
{/* Employee Row 1 */}
<tr className="hover:bg-glass-fill transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of a Cameroonian woman in her late 20s, wearing a subtle uniform shirt with the OPEP logo. She is smiling warmly against a blurred office background with green and slate-blue corporate tones. The lighting is soft and flattering, emphasizing a clean and reliable professional image for a transport agency staff portal." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfD28wUpmmWhpLqxIDOctenNPuVgxcNno_yX8ppBCd3AbyF-LeS3a-wgPVAlL-MRH3vxwpdUrFXuh-ziQy_Z8SZHfA3Oi8McL8zBtU8PANTvUaFsDGKufKIBBXfoY_v2-dpzUjaeIkGpAfKKiejjBnkIXqgvqDPqEQ00Kprr6KDJuHkOPSkYmFyQb_YaD6WJxwLI7iZX65VeQlkthCCY1OOBjGFVzfbFPsnscCe2cc4-XJ3saQ6zeJUyH12JLxoPMPzc-JiECm8Hg"/>
<div>
<p className="font-body-lg text-body-lg font-semibold">Abena Marie-Louise</p>
<p className="text-[12px] text-on-surface-variant">ID: STF-2023-089</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-tertiary">payments</span>
<span className="text-body-sm text-on-surface">Caissier</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">
<div className="flex flex-col">
<span>+237 670 112 233</span>
<span className="text-[11px] opacity-70">m.abena@opep.cm</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">Aujourd'hui, 08:45</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-success-green/10 text-success-green border border-success-green/20 rounded-full text-[12px] font-semibold">Actif</span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-on-surface-variant hover:text-primary p-2 transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Employee Row 2 */}
<tr className="hover:bg-glass-fill transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="A portrait of a male bus driver in a professional transport agency uniform, a high-quality light green polo shirt with OPEP branding. He is standing in front of a modern transport bus, looking professional and capable. The lighting is golden hour outdoor light, creating a trustworthy and reliable mood for a staff management interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI2GUPjdd5aTWB_NR6MlUdgk8tZ3raw1WZHyzmPi4wMO3G95Q42H2t9u9OXbUNiOpRcoLcrKCCjYINz39zzCBpd519dXebFZLPCtwaevP_f2YYBqUCU81bAhRf2U_t839uL0951XePgyjhdxqD7Nk6Mbyb7RRzzjHnWT-x3kgMLdznSFTzw_l2QeOW0hmsBs-3SpZ-p3MxSP3WieeqIDZzwA7wxx39Syjbq8X4IAmQh1lZB3KUOvGAZwvUFPqs82-nC6BShit_9_0"/>
<div>
<p className="font-body-lg text-body-lg font-semibold">Eto'o Jean-Paul</p>
<p className="text-[12px] text-on-surface-variant">ID: STF-2022-142</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-primary-fixed">minor_crash</span>
<span className="text-body-sm text-on-surface">Chauffeur</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">
<div className="flex flex-col">
<span>+237 699 445 566</span>
<span className="text-[11px] opacity-70">jp.etoo@opep.cm</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">En cours de trajet</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full text-[12px] font-semibold">En Mission</span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-on-surface-variant hover:text-primary p-2 transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Employee Row 3 */}
<tr className="hover:bg-glass-fill transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="A high-quality studio portrait of a serious yet professional Cameroonian male controller, wearing a tech-enabled vest with an ID badge. He is shown from the chest up against a minimalist dark slate background with neon green accent lights. The image conveys authority, security, and modernization in transport management." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLdngpyK0PI1XUhx87Jv45ywzUS6NW8B_BKl7IQUDKEFCPdVZpLINZlAR49SR0fY6BEYRXzbOTeSVf_Z1Pj1kVMJY7qBNO8hOAEelh0NY0GtnY6ZUzQ85XKBWEv3PiirsMedbru8OFuP1nYnfHMJJDP3npyB7W0CvIUFTejf0wTcasc4hrB9D1Q-1k5mPQoFmvxHSDHLYWl-_cQeLwohIVAmp_pmxViD54garPky_8KdODja6a_hsd4CIIHKTbG5mVyyMjYYGHxSk"/>
<div>
<p className="font-body-lg text-body-lg font-semibold">Moussa Ibrahim</p>
<p className="text-[12px] text-on-surface-variant">ID: STF-2023-045</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
<span className="text-body-sm text-on-surface">Contrôleur</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">
<div className="flex flex-col">
<span>+237 677 889 900</span>
<span className="text-[11px] opacity-70">i.moussa@opep.cm</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">Hier, 19:20</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant border border-charcoal-border rounded-full text-[12px] font-semibold">Hors Ligne</span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-on-surface-variant hover:text-primary p-2 transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Employee Row 4 */}
<tr className="hover:bg-glass-fill transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="A portrait of a young Cameroonian professional male in a corporate office setting, wearing a tailored light gray shirt. He has a friendly but efficient look, positioned near a computer terminal. The scene is illuminated with modern cool-toned office lights, reflecting a premium administrative environment for the transport agency staff list." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKo1oicxgaFi5wZJjt5oM5rs2XUhkXgWAvPRfrf-gszeW4O4oSJ4kVsNw5VcHZ2-omq5jEDhr829GYWpxb66QTRx5n2cqK97gQRF3TfWeQaYegsQ6gN-Gt3yJ6NwhW7HD8ieAR7yhz0t-dxOe9LPq_x-x96Aqpv7rnJ7SkO0qIL5RunZw1areIv7uzHI4m2DGJPVxa2C6GQGG5H6CKTkjJTlfXTTfodtjsfgQPa9Yob7hLIksW37sVnuc9WwTX1q3XW1yIFuyc-K0"/>
<div>
<p className="font-body-lg text-body-lg font-semibold">Ngono Samuel</p>
<p className="text-[12px] text-on-surface-variant">ID: STF-2024-002</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-tertiary">payments</span>
<span className="text-body-sm text-on-surface">Caissier</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">
<div className="flex flex-col">
<span>+237 655 443 322</span>
<span className="text-[11px] opacity-70">s.ngono@opep.cm</span>
</div>
</td>
<td className="px-6 py-4 text-body-sm text-on-surface-variant">Il y a 5 min</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-success-green/10 text-success-green border border-success-green/20 rounded-full text-[12px] font-semibold">Actif</span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-on-surface-variant hover:text-primary p-2 transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination */}
<div className="p-4 border-t border-charcoal-border flex justify-between items-center bg-surface-container-low">
<p className="text-body-sm text-on-surface-variant">Affichage de 4 sur 124 employés</p>
<div className="flex gap-2">
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:bg-glass-fill disabled:opacity-50" disabled>
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">1</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:bg-glass-fill">2</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:bg-glass-fill">3</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:bg-glass-fill">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Bento Widgets: Quick Actions & Status */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
<div className="lg:col-span-2 bg-slate-surface border border-charcoal-border p-6 rounded-xl flex flex-col gap-4">
<h4 className="font-title-md text-title-md">Répartition des Services</h4>
<div className="flex flex-col gap-4 mt-2">
<div className="flex justify-between items-end mb-1">
<span className="text-body-sm font-semibold">Service Client / Caisse</span>
<span className="text-body-sm text-on-surface-variant">32/40 Slots</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width":"80%"}}></div>
</div>
<div className="flex justify-between items-end mb-1">
<span className="text-body-sm font-semibold">Logistique / Chauffeurs</span>
<span className="text-body-sm text-on-surface-variant">47/50 Slots</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{"width":"94%"}}></div>
</div>
<div className="flex justify-between items-end mb-1">
<span className="text-body-sm font-semibold">Sécurité / Contrôle</span>
<span className="text-body-sm text-on-surface-variant">45/60 Slots</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width":"75%"}}></div>
</div>
</div>
</div>
<div className="bg-primary-container/10 border border-primary/20 p-6 rounded-xl flex flex-col gap-4">
<h4 className="font-title-md text-title-md text-primary">Notes Internes</h4>
<div className="flex flex-col gap-3">
<div className="bg-surface-container p-3 rounded-lg border-l-4 border-warning-yellow">
<p className="text-body-sm font-semibold text-warning-yellow">Alerte Disponibilité</p>
<p className="text-[12px] mt-1 text-on-surface-variant">Manque de chauffeurs pour le trajet Douala - Yaoundé de demain soir.</p>
</div>
<div className="bg-surface-container p-3 rounded-lg border-l-4 border-success-green">
<p className="text-body-sm font-semibold text-success-green">Formation Terminée</p>
<p className="text-[12px] mt-1 text-on-surface-variant">12 nouveaux contrôleurs ont validé leur certification QR.</p>
</div>
</div>
<button className="mt-auto py-2 text-primary font-bold text-body-sm flex items-center justify-center gap-1 hover:underline">
                        Voir toutes les notes <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</div>
{/* Footer spacing */}
<div className="h-10"></div>
</main>      <Modal
        isOpen={showAddEmployeeModal}
        onClose={() => setAddEmployeeModal(false)}
        title="Ajouter un nouveau membre"
      >
        <div className="p-4 flex flex-col gap-6">
<div className="grid grid-cols-2 gap-4">
<div className="flex flex-col gap-2">
<label className="text-label-caps font-label-caps text-on-surface-variant">Prénom / First Name</label>
<input className="bg-surface-container-low border border-charcoal-border rounded-lg p-3 text-on-surface focus:border-primary focus:ring-0 outline-none" type="text"/>
</div>
<div className="flex flex-col gap-2">
<label className="text-label-caps font-label-caps text-on-surface-variant">Nom / Last Name</label>
<input className="bg-surface-container-low border border-charcoal-border rounded-lg p-3 text-on-surface focus:border-primary focus:ring-0 outline-none" type="text"/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="text-label-caps font-label-caps text-on-surface-variant">Rôle / Position</label>
<select className="bg-surface-container-low border border-charcoal-border rounded-lg p-3 text-on-surface focus:border-primary focus:ring-0 outline-none">
<option>Caissier</option>
<option>Contrôleur</option>
<option>Chauffeur</option>
<option>Admin Agence</option>
</select>
</div>
<div className="flex flex-col gap-2">
<label className="text-label-caps font-label-caps text-on-surface-variant">Téléphone / Contact</label>
<div className="flex">
<span className="bg-surface-container h-full px-3 py-3 rounded-l-lg border border-r-0 border-charcoal-border text-on-surface-variant">+237</span>
<input className="bg-surface-container-low border border-charcoal-border rounded-r-lg p-3 text-on-surface focus:border-primary focus:ring-0 outline-none flex-1" type="tel"/>
</div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-border">
          <button className="px-6 py-3 text-on-surface-variant font-semibold hover:text-on-surface transition-colors" onClick={() => setAddEmployeeModal(false)}>Annuler</button>
          <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:brightness-110" onClick={() => setAddEmployeeModal(false)}>Créer le Profil</button>
        </div>
        </div>
      </Modal>
    </div>
  );
}
