import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTicket } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: interface-de-controle-opep-controleur
 */
export default function InterfaceDeControleOpepControleurReproduction() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    ticketsApi.getMyTickets().then(data => { setTickets(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {apiError && <ApiError message={apiError} />}
      {/* SECTION: Mockup Layout */}
      {/* TopNavBar */}
<nav className="flex justify-between items-center px-container-padding w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-outline-variant">
<div className="flex items-center gap-gutter">
<span className="font-headline-lg text-primary font-bold">OPEP Portal</span>
<div className="hidden md:flex gap-gutter ml-lg">
<a className="text-on-surface-variant font-label-sm hover:text-primary transition-colors" href="#">DASHBOARD</a>
<a className="text-primary font-bold border-b-2 border-primary pb-1 font-label-sm" href="#">EMBARQUEMENT</a>
<a className="text-on-surface-variant font-label-sm hover:text-primary transition-colors" href="#">HISTORIQUE</a>
</div>
</div>
<div className="flex items-center gap-sm">
<button className="p-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">translate</span>
</button>
<button className="p-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant ml-xs">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2BCwZ4cYsQZs_4Yi2GsoD4PJEamfF28c6QiA_qXal00hoUq6U0QUaKo3KAfT6JrOihiIoizQ76RkbgAaNDemNZZ8Qj6oInJMSJDP7oR8DamiwlUMyMbSyW8WTbuWKBnfjEdaXK3pPJh9v4dNYQp-s5-hyRdSrQ_EXOl9SmWTM8T5he_tYgMe4IQYg31Vp4fKKVttqkDL2GMHLLd1Tx0womcGJq4uL0vrMtmeZCYtTYFf1vGmL1YImrQq1WisyL07rjp9JE7sZDQs"  />
</div>
</div>
</nav>
<main className="max-w-[1400px] mx-auto p-gutter md:p-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-lg">
{/* Left: Trip Details & Manifest */}
<div className="lg:col-span-8 flex flex-col gap-gutter">
{/* Trip Banner */}
<div className="glass-card rounded-xl p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md inner-glow">
<div>
<span className="text-primary font-label-sm uppercase tracking-widest">Trajet Actif</span>
<h1 className="font-headline-lg text-on-surface mt-base">Yaoundé → Douala</h1>
<div className="flex gap-md mt-sm text-on-surface-variant font-body-md">
<span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">calendar_today</span> 24 Oct 2023</span>
<span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">schedule</span> 14:30 (Départ)</span>
<span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">directions_bus</span> BUS-772A</span>
</div>
</div>
<div className="flex flex-col items-end">
<div className="bg-primary-container/20 text-primary px-gutter py-xs rounded-full border border-primary/30 font-bold">
                        En cours d'embarquement
                    </div>
<span className="text-on-surface-variant text-label-sm mt-xs">28 / 45 Passagers validés</span>
</div>
</div>
{/* Manifest Bento Grid */}
<div className="glass-card rounded-xl overflow-hidden inner-glow flex flex-col flex-1 min-h-[500px]">
<div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
<h2 className="font-title-md text-on-surface">Manifeste des Passagers</h2>
<div className="flex gap-xs">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input className="bg-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-1 focus:ring-primary w-64 text-on-surface" placeholder="Rechercher un passager..." type="text"/>
</div>
</div>
</div>
<div className="overflow-y-auto max-h-[600px]">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 bg-surface-container-high z-10">
<tr className="text-on-surface-variant font-label-sm border-b border-outline-variant">
<th className="p-md font-medium">SIÈGE</th>
<th className="p-md font-medium">PASSAGER</th>
<th className="p-md font-medium">CODE TICKET</th>
<th className="p-md font-medium">STATUT</th>
<th className="p-md font-medium text-right">ACTION</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">
{/* Validated Passenger */}
<tr className="hover:bg-primary-container/5 transition-colors group">
<td className="p-md">
<span className="w-8 h-8 rounded-md bg-surface-container-highest flex items-center justify-center font-bold text-on-surface border border-outline-variant">01</span>
</td>
<td className="p-md">
<div className="font-body-md font-bold text-on-surface">Jean-Luc Ambassa</div>
<div className="text-label-sm text-on-surface-variant">Catégorie: Business</div>
</td>
<td className="p-md font-mono text-on-surface-variant">OP-921-X9</td>
<td className="p-md">
<span className="flex items-center gap-xs text-primary font-bold text-label-sm">
<span className="material-symbols-outlined text-[18px]">check_circle</span> VALIDÉ
                                    </span>
</td>
<td className="p-md text-right">
<button className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined">undo</span></button>
</td>
</tr>
{/* Pending Passenger */}
<tr className="hover:bg-surface-container-highest/30 transition-colors group">
<td className="p-md">
<span className="w-8 h-8 rounded-md bg-surface-container-highest flex items-center justify-center font-bold text-on-surface border border-outline-variant">02</span>
</td>
<td className="p-md">
<div className="font-body-md font-bold text-on-surface">Marie Ngo</div>
<div className="text-label-sm text-on-surface-variant">Catégorie: Standard</div>
</td>
<td className="p-md font-mono text-on-surface-variant">OP-442-B1</td>
<td className="p-md">
<span className="flex items-center gap-xs text-tertiary font-bold text-label-sm">
<span className="material-symbols-outlined text-[18px]">pending</span> EN ATTENTE
                                    </span>
</td>
<td className="p-md text-right">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-label-sm font-bold active:scale-95 transition-transform">VALIDER</button>
</td>
</tr>
{/* More rows... */}
<tr className="hover:bg-surface-container-highest/30 transition-colors group">
<td className="p-md">
<span className="w-8 h-8 rounded-md bg-surface-container-highest flex items-center justify-center font-bold text-on-surface border border-outline-variant">03</span>
</td>
<td className="p-md">
<div className="font-body-md font-bold text-on-surface">Alain Fouda</div>
<div className="text-label-sm text-on-surface-variant">Catégorie: Standard</div>
</td>
<td className="p-md font-mono text-on-surface-variant">OP-331-Z4</td>
<td className="p-md">
<span className="flex items-center gap-xs text-tertiary font-bold text-label-sm">
<span className="material-symbols-outlined text-[18px]">pending</span> EN ATTENTE
                                    </span>
</td>
<td className="p-md text-right">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-label-sm font-bold active:scale-95 transition-transform">VALIDER</button>
</td>
</tr>
<tr className="hover:bg-surface-container-highest/30 transition-colors group">
<td className="p-md">
<span className="w-8 h-8 rounded-md bg-surface-container-highest flex items-center justify-center font-bold text-on-surface border border-outline-variant">04</span>
</td>
<td className="p-md">
<div className="font-body-md font-bold text-on-surface">Chantal Eto'o</div>
<div className="text-label-sm text-on-surface-variant">Catégorie: Business</div>
</td>
<td className="p-md font-mono text-on-surface-variant">OP-118-K2</td>
<td className="p-md">
<span className="flex items-center gap-xs text-primary font-bold text-label-sm">
<span className="material-symbols-outlined text-[18px]">check_circle</span> VALIDÉ
                                    </span>
</td>
<td className="p-md text-right">
<button className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined">undo</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
{/* Right: Actions & Scanning */}
<div className="lg:col-span-4 flex flex-col gap-gutter">
{/* Scan Ticket Main Section */}
<div className="glass-card rounded-xl p-md flex flex-col items-center gap-lg inner-glow ambient-glow-primary">
<div className="w-full text-center">
<h3 className="font-title-md text-on-surface">Validation Mobile</h3>
<p className="text-on-surface-variant text-body-md">Scannez le QR code du passager</p>
</div>
{/* Scanner Viewport Placeholder */}
<div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden bg-black border-2 border-primary/20 flex items-center justify-center group">

<div className="scanner-line"></div>
<div className="absolute inset-0 border-[40px] border-black/40"></div>
{/* Corner Brackets */}
<div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
<div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
<div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
<div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
<span className="material-symbols-outlined text-[64px] text-primary/50 group-hover:text-primary transition-colors duration-500">qr_code_scanner</span>
</div>
<button className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold py-4 rounded-xl text-title-md flex items-center justify-center gap-md hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">camera_alt</span>
                    DÉMARRER SCAN
                </button>
</div>
{/* Manual Validation */}
<div className="glass-card rounded-xl p-md inner-glow">
<h3 className="font-label-sm text-primary uppercase tracking-widest mb-md">Validation Manuelle</h3>
<div className="flex flex-col gap-sm">
<label className="text-label-sm text-on-surface-variant ml-xs">Code du ticket</label>
<div className="flex gap-xs">
<input className="flex-1 bg-surface-container-highest border-outline-variant/30 rounded-lg py-3 px-4 text-body-lg font-mono focus:ring-primary focus:border-primary text-on-surface" placeholder="Ex: OP-000-00" type="text"/>
<button className="bg-surface-container-highest text-on-surface px-gutter rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors font-bold">
                            OK
                        </button>
</div>
<p className="text-[11px] text-on-surface-variant italic px-xs">Utilisez cette option si le QR code est illisible.</p>
</div>
</div>
{/* Stats Card */}
<div className="grid grid-cols-2 gap-sm">
<div className="glass-card rounded-xl p-md flex flex-col items-center">
<span className="text-label-sm text-on-surface-variant">VALIDÉS</span>
<span className="text-display-lg text-primary">28</span>
</div>
<div className="glass-card rounded-xl p-md flex flex-col items-center">
<span className="text-label-sm text-on-surface-variant">ABSENTS</span>
<span className="text-display-lg text-secondary">17</span>
</div>
</div>
</div>
</main>
{/* Bottom Navigation for Mobile */}
<div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
<div className="glass-card rounded-[24px] h-16 flex items-center justify-around px-gutter inner-glow shadow-2xl">
<button className="flex flex-col items-center text-primary">
<span className="material-symbols-outlined">qr_code_scanner</span>
<span className="text-[10px] font-bold">SCAN</span>
</button>
<button className="flex flex-col items-center text-on-surface-variant">
<span className="material-symbols-outlined">list_alt</span>
<span className="text-[10px]">MANIFESTE</span>
</button>
<button className="flex flex-col items-center text-on-surface-variant">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px]">CONFIG</span>
</button>
</div>
</div>
{/* Feedback Toasts Container (Hidden by default) */}
<div className="fixed bottom-24 right-container-padding z-50 hidden" id="toast-success">
<div className="glass-card border-primary/50 rounded-xl p-gutter flex items-center gap-md animate-bounce">
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">check</span>
</div>
<div>
<div className="font-bold text-on-surface">Ticket Validé !</div>
<div className="text-label-sm text-on-surface-variant">Siège 12 - Paul Biya</div>
</div>
</div>
</div>
    </div>
  );
}
