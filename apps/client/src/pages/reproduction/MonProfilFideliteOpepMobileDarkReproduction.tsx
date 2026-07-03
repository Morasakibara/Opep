import React, { useState, useEffect } from 'react';
import { usersApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiUser } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: mon-profil-fidelite-opep-mobile-dark
 */
export default function MonProfilFideliteOpepMobileDarkReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    usersApi.getProfile().then(data => { setProfile(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {apiError && <ApiError message={apiError} />}
      {/* SECTION: Mockup Layout */}
      {/* Top App Bar */}
<header className="flex justify-between items-center px-container-padding w-full pt-4 bg-transparent">
<div className="flex items-center gap-xs">
<div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb4GXjCNppUl-FLuJG3Z8pwCAxeJtR-Yd-wLG1cjRy1KMD-wyXaUTPyRpY7PDuQOYWDIK8f7guCW0uv_OcObZ-WQMMI0tSVzQPbVQfPz4umL_SoMvTobqlGm-8XTN2eMKESkZaZbqZ76Sfq63LiLb5M32ShFIV0tiGQz9fFxSPe3Eus9S-j_25YpO1N1mCvRP2S8xXTXwp3Z5R6ha1an6h1Vuwo7L5Q7t5oh2UwIJ5rmodZL3NGV_MWo-idmXN-4-7DVbw-TfIsGQ"  />
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Hello,</span>
<span className="font-title-md text-title-md text-primary">{profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Samuel Abena'}</span>
</div>
</div>
<button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container/50 text-primary transition-opacity duration-200 active:scale-95 hover:opacity-80">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</header>
<main className="px-container-padding mt-lg space-y-md">
{/* Loyalty Card Section */}
<section className="relative overflow-hidden glass-card rounded-[24px] p-md ambient-glow inner-glow">

<div className="relative z-10">
<div className="flex justify-between items-start mb-lg">
<div>
<p className="font-label-sm text-label-sm text-primary uppercase tracking-widest">OPEP Loyalty</p>
<h2 className="font-headline-lg-mobile text-headline-lg-mobile text-white mt-base">{profile?.loyaltyTier ? profile.loyaltyTier + ' Member' : 'Platinum Member'}</h2>
</div>
<div className="bg-primary/20 p-xs rounded-lg backdrop-blur-md">
<span className="material-symbols-outlined text-primary" data-icon="stars" style={{"fontVariationSettings":"'FILL' 1"}}>stars</span>
</div>
</div>
<div className="space-y-xs">
<p className="font-label-sm text-label-sm text-on-surface-variant">Available Balance</p>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-display-lg text-white">{profile?.loyaltyPoints ? profile.loyaltyPoints.toLocaleString() : '2,450'}</span>
<span className="font-title-md text-title-md text-primary">OPEP Points</span>
</div>
</div>
<div className="mt-xl flex justify-between items-end">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full border-2 border-surface-container bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-primary-container" data-icon="flight">flight</span>
</div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container bg-tertiary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-tertiary-container" data-icon="train">train</span>
</div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-secondary-container" data-icon="directions_car">directions_car</span>
</div>
</div>
<button className="bg-primary text-on-primary px-md py-xs rounded-full font-label-sm text-label-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                        REDEEM NOW
                    </button>
</div>
</div>
</section>
{/* Preference Grid */}
<section className="grid grid-cols-2 gap-gutter">
{/* Notification Channel */}
<div className="glass-card rounded-[20px] p-md space-y-sm">
<span className="material-symbols-outlined text-primary" data-icon="chat">chat</span>
<p className="font-label-sm text-label-sm text-on-surface-variant">Channel Préféré</p>
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="font-title-md text-title-md">WhatsApp</span>
</div>
</div>
{/* Language Setting */}
<div className="glass-card rounded-[20px] p-md space-y-sm">
<span className="material-symbols-outlined text-tertiary" data-icon="language">language</span>
<p className="font-label-sm text-label-sm text-on-surface-variant">Language / Langue</p>
<div className="flex items-center justify-between">
<span className="font-title-md text-title-md">Français</span>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="expand_more">expand_more</span>
</div>
</div>
</section>
{/* Past Trips (Bento style list) */}
<section className="space-y-md">
<div className="flex justify-between items-center px-base">
<h3 className="font-title-md text-title-md text-white">Trajets Récents</h3>
<button className="text-primary font-label-sm text-label-sm">Voir tout</button>
</div>
<div className="space-y-xs">
{/* Trip 1 */}
<div className="glass-card rounded-xl p-sm flex items-center gap-md group active:scale-[0.98] transition-transform">
<div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
<span className="material-symbols-outlined" data-icon="directions_bus">directions_bus</span>
</div>
<div className="flex-1">
<div className="flex justify-between">
<span className="font-body-md text-body-md font-semibold text-white">Douala → Yaoundé</span>
<span className="font-label-sm text-label-sm text-primary">+150 pts</span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant">12 Oct 2023 • Express VIP</p>
</div>
</div>
{/* Trip 2 */}
<div className="glass-card rounded-xl p-sm flex items-center gap-md group active:scale-[0.98] transition-transform">
<div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-secondary/10 transition-colors">
<span className="material-symbols-outlined" data-icon="commute">commute</span>
</div>
<div className="flex-1">
<div className="flex justify-between">
<span className="font-body-md text-body-md font-semibold text-white">Kribi → Douala</span>
<span className="font-label-sm text-label-sm text-primary">+85 pts</span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant">05 Oct 2023 • Covoiturage</p>
</div>
</div>
{/* Trip 3 */}
<div className="glass-card rounded-xl p-sm flex items-center gap-md group active:scale-[0.98] transition-transform">
<div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary group-hover:bg-tertiary/10 transition-colors">
<span className="material-symbols-outlined" data-icon="train">train</span>
</div>
<div className="flex-1">
<div className="flex justify-between">
<span className="font-body-md text-body-md font-semibold text-white">Yaoundé → Ngaoundéré</span>
<span className="font-label-sm text-label-sm text-primary">+320 pts</span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant">22 Sep 2023 • Camrail Night</p>
</div>
</div>
</div>
</section>
{/* Quick Settings */}
<section className="glass-card rounded-[24px] overflow-hidden">
<div className="p-md border-b border-white/5 flex items-center gap-md active:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="shield_person">shield_person</span>
<div className="flex-1">
<p className="font-body-md text-body-md font-medium">Privacy &amp; Security</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Biometrics, data permissions</p>
</div>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="chevron_right">chevron_right</span>
</div>
<div className="p-md border-b border-white/5 flex items-center gap-md active:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="help_center">help_center</span>
<div className="flex-1">
<p className="font-body-md text-body-md font-medium">Help &amp; Support</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">FAQ, 24/7 Concierge</p>
</div>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="chevron_right">chevron_right</span>
</div>
<div className="p-md flex items-center gap-md active:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined text-error" data-icon="logout">logout</span>
<div className="flex-1">
<p className="font-body-md text-body-md font-medium text-error">Logout</p>
</div>
</div>
</section>
</main>
{/* Bottom Navigation Bar */}
<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] h-16 flex items-center justify-around px-md">
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span className="font-label-sm text-label-sm">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" data-icon="search">search</span>
<span className="font-label-sm text-label-sm">Search</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" data-icon="confirmation_number">confirmation_number</span>
<span className="font-label-sm text-label-sm">Tickets</span>
</a>
<a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" data-icon="person" style={{"fontVariationSettings":"'FILL' 1"}}>person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</a>
</div>
</nav>
    </div>
  );
}
