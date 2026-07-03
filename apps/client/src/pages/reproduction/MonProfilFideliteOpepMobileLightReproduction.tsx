import React, { useState, useEffect } from 'react';
import { usersApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiUser } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: mon-profil-fidelite-opep-mobile-light
 */
export default function MonProfilFideliteOpepMobileLightReproduction() {
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
<header className="flex justify-between items-center px-container-padding w-full pt-4 bg-transparent sticky top-0 z-50 transition-opacity duration-200 active:scale-95">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-sxdxFtGyg3OYoTrNOBIEwzPMvLotjsgbFQXYa5CMLNBdvS3xJnKOs1zualyNtgDuKd0bGsCizcJw_4m8edvYJgKro2Hd3T4aA4UL7RehtrixgBIXp3aHeRRM5oAcPp41f9CFLATEYdd3-oaZ0sr2PRNsW9Z22PKknSnp08F_cmPKiHF2nSaproZxcfpjtmPsoniZGG6wTEj-kpKMeTRjduvNhXuIk1qj1glTjmtjmbu7rO5eGmdfUDToQvmPHqR7nBsWs9gXHvQ"  />
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">Bonjour,</p>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">{profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Guest'}</h1>
</div>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined text-primary">notifications</span>
</button>
</header>
<main className="px-container-padding pb-32 pt-lg space-y-md">
{/* Loyalty Card (Bento Style) */}
<section className="relative overflow-hidden glass-card rounded-[2rem] p-lg ambient-glow inner-glow">
<div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
<div className="absolute -bottom-12 -left-12 w-48 h-48 bg-tertiary/10 rounded-full blur-3xl"></div>
<div className="relative z-10 flex flex-col gap-lg">
<div className="flex justify-between items-start">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Points Fidélité</p>
<h2 className="font-display-lg text-display-lg text-primary">{profile?.loyaltyPoints ? profile.loyaltyPoints.toLocaleString() : '12,450'}</h2>
</div>
<div className="px-md py-xs rounded-full glass-card border-primary/30 flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-label-sm text-label-sm text-primary uppercase">{profile?.loyaltyTier ? 'Tier ' + profile.loyaltyTier : 'Tier Elite'}</span>
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between items-center">
<p className="font-body-md text-on-surface-variant">Progression vers le niveau Platine</p>
<p className="font-label-sm text-label-sm text-on-surface">75%</p>
</div>
<div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-primary-container w-[75%] rounded-full shadow-[0_0_12px_rgba(121,216,183,0.5)]"></div>
</div>
</div>
<div className="grid grid-cols-2 gap-md pt-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-primary">
<span className="material-symbols-outlined">flight</span>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">Vols</p>
<p className="font-title-md text-title-md">24</p>
</div>
</div>
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined">hotel</span>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">Hôtels</p>
<p className="font-title-md text-title-md">12</p>
</div>
</div>
</div>
</div>
</section>
{/* Quick Actions Grid */}
<section className="grid grid-cols-4 gap-md">
<div className="flex flex-col items-center gap-xs">
<button className="w-14 h-14 rounded-2xl glass-card inner-glow flex items-center justify-center text-primary active:scale-90 transition-transform">
<span className="material-symbols-outlined">qr_code_2</span>
</button>
<span className="font-label-sm text-label-sm text-on-surface-variant">Check-in</span>
</div>
<div className="flex flex-col items-center gap-xs">
<button className="w-14 h-14 rounded-2xl glass-card inner-glow flex items-center justify-center text-on-surface-variant active:scale-90 transition-transform">
<span className="material-symbols-outlined">redeem</span>
</button>
<span className="font-label-sm text-label-sm text-on-surface-variant">Récompenses</span>
</div>
<div className="flex flex-col items-center gap-xs">
<button className="w-14 h-14 rounded-2xl glass-card inner-glow flex items-center justify-center text-on-surface-variant active:scale-90 transition-transform">
<span className="material-symbols-outlined">history</span>
</button>
<span className="font-label-sm text-label-sm text-on-surface-variant">Historique</span>
</div>
<div className="flex flex-col items-center gap-xs">
<button className="w-14 h-14 rounded-2xl glass-card inner-glow flex items-center justify-center text-on-surface-variant active:scale-90 transition-transform">
<span className="material-symbols-outlined">settings</span>
</button>
<span className="font-label-sm text-label-sm text-on-surface-variant">Compte</span>
</div>
</section>
{/* Recent Trips */}
<section className="space-y-md">
<div className="flex justify-between items-center">
<h3 className="font-title-md text-title-md text-on-surface">Historique des voyages</h3>
<button className="font-label-sm text-label-sm text-primary hover:opacity-80 transition-opacity">Voir tout</button>
</div>
<div className="space-y-sm">
{/* Trip Card 1 */}
<div className="glass-card rounded-2xl p-md flex gap-md items-center group active:scale-[0.98] transition-transform">
<div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
<img loading="lazy" decoding="async" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-bAittX9F41PffOIILy9SSDwHUMCTcWaf5e7choIwMOqmWU5yO4qTcA16HJHJRN693XRIIx1JSOHjCfXhF5N65bU6TTAUqULANn4wJfSnsplgJumPxCJ7ZE5WYwUjxc_oEN5gTrAfciXo56gc1AHWEBRmQnGmxquTqLqyO9ZLzEy8gDU8RdynD4-KasspQJsRE6N6T8mAkbM2mn8DhCFEgTUPtm4Z-1QtzKEPbURUoYxmY4hZTaZszuEksMBFXpjduCGgnCewBzA"  />
</div>
<div className="flex-grow">
<p className="font-label-sm text-label-sm text-on-surface-variant">Douala (DLA) • AF 953</p>
<h4 className="font-title-md text-title-md text-on-surface">Paris Charles de Gaulle</h4>
<p className="font-body-md text-on-surface-variant">14 Oct 2023</p>
</div>
<div className="flex flex-col items-end">
<span className="text-primary font-title-md">+850</span>
<span className="text-label-sm text-on-surface-variant">Points</span>
</div>
</div>
{/* Trip Card 2 */}
<div className="glass-card rounded-2xl p-md flex gap-md items-center group active:scale-[0.98] transition-transform">
<div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
<img loading="lazy" decoding="async" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgy27DUqDuu6HGd9egr9hq465t6HMvGKavj4jqfsNFAZ9JIbsY7qcYdzZYOGyRyvyKhuo831GDKNYLvA3hb3kylXpPvaPoNH6LM74HW5V_T-mfTFHOIZmFcwcA8dz9SRQMtk1yGG_OUmq2AE23br_Oc6Hka3_ABv28ML-r1A7IBAVIwkEX2U3DLxxwjntugpdD1UK4_EYUwMCDT8h6PbgE-pjO4zzVPRlVToht6afNhAoud0eCPPhObz5C6SjUfBNkswXiZvditDQ"  />
</div>
<div className="flex-grow">
<p className="font-label-sm text-label-sm text-on-surface-variant">Yaoundé (NSI) • SN 371</p>
<h4 className="font-title-md text-title-md text-on-surface">Brussels Airport</h4>
<p className="font-body-md text-on-surface-variant">02 Sep 2023</p>
</div>
<div className="flex flex-col items-end">
<span className="text-primary font-title-md">+1,200</span>
<span className="text-label-sm text-on-surface-variant">Points</span>
</div>
</div>
</div>
</section>
{/* Exclusive Offers (Horizontal Scroll) */}
<section className="space-y-md">
<h3 className="font-title-md text-title-md text-on-surface px-0">Offres exclusives</h3>
<div className="flex overflow-x-auto gap-md hide-scrollbar -mx-container-padding px-container-padding pb-4">
<div className="min-w-[280px] h-[160px] glass-card rounded-[1.5rem] relative p-md flex flex-col justify-end overflow-hidden group">
<div className="absolute inset-0 z-0">
<img loading="lazy" decoding="async" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAybf5ZlUE_t_l7KJLPE24usezT4KzunvR7L6o1WgHo4n9tlCXnM8C4I4_NL7Ii1XD-48pN4KeOCHVDB3spF_Gu2Z3Wa13qdpsPIYwhLYvJQOYoKx27vpqXPhki4unosJpzvNB3fB73TgmVtr6mXjeI1W-w7XzBdrrawelVRx528Qch53jlPKFW9UUAi_7tw9v-QD1qgn9ltz6UTEAc8K4MnrqQ86_5KRDrx_WV3CE6a7bXayETesH8ADIKuNBXmngDDSsxi82NiP8"  />
</div>
<div className="relative z-10">
<span className="bg-primary/20 backdrop-blur-md px-xs py-1 rounded text-[10px] text-primary uppercase font-bold tracking-widest mb-xs inline-block">Lounge Pass</span>
<h5 className="font-title-md text-on-surface">Accès VIP Douala</h5>
<p className="font-label-sm text-on-surface-variant">5,000 points</p>
</div>
</div>
<div className="min-w-[280px] h-[160px] glass-card rounded-[1.5rem] relative p-md flex flex-col justify-end overflow-hidden group">
<div className="absolute inset-0 z-0">
<img loading="lazy" decoding="async" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjEdP_EL91sngJQ9hA73coLMHWmw1ku4aryockL1z0Z3pXS6k-w9Q1EZ9T_poABj2J7grNQtYg11_hwFikQ1UbMPx6I7hAPWue7pq_N_TANV5_b7_wjlYkAbBGk0rnWxjkipTAHyqxZsdMNPSqO3w3q4S68YrhmncWhqwaRVKDnArF70vJv953j90kpBCSkO4HEXjyT38M2a2lA6U0CkeSpUmYklbzIA5rq80pjfaugyI_hlKLRUFEfvt2WGtFmmiu1dXV2Z61E5M"  />
</div>
<div className="relative z-10">
<span className="bg-secondary/20 backdrop-blur-md px-xs py-1 rounded text-[10px] text-secondary uppercase font-bold tracking-widest mb-xs inline-block">Upgrade</span>
<h5 className="font-title-md text-on-surface">Surclassement Affaires</h5>
<p className="font-label-sm text-on-surface-variant">12,000 points</p>
</div>
</div>
</div>
</section>
</main>
{/* Bottom Navigation Bar */}
<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8 pointer-events-none">
<div className="fixed bottom-4 left-4 right-4 h-20 rounded-full glass-card border-white/10 shadow-[0_0_40px_rgba(121,216,183,0.15)] backdrop-blur-lg flex justify-around items-center px-4 pointer-events-auto">
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm mt-1">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm mt-1">Search</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">confirmation_number</span>
<span className="font-label-sm text-label-sm mt-1">Tickets</span>
</a>
<a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(121,216,183,0.8)] active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>person</span>
<span className="font-label-sm text-label-sm mt-1">Profile</span>
</a>
</div>
</nav>
    </div>
  );
}
