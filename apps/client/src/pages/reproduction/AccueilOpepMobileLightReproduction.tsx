import React, { useState, useEffect } from 'react';
import { tripsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTrip } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: accueil-opep-mobile-light
 */
export default function AccueilOpepMobileLightReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    tripsApi.getAvailable().then(data => { setTrips(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {apiError && <ApiError message={apiError} />}
      {/* SECTION: Mockup Layout */}
      {/* Top App Bar */}
<header className="w-full pt-4 flex justify-between items-center px-container-padding w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRUb_12lcgRQN1BUEVdeBchTP0adpYle3mv5S_zIBytf4dyOqkmsSAcf5asP6PVloBlU2xFlWGkpEOTqW0TeGBqjU_01-zi6LLO3E_It-BN4RLRZQ9p84j9mh_XCA_67o-1RgQ-TFAy29B9wSPK04EARo9b3_QwqoDEm3r8YVf4D4_s5nC7U1fTzSowWmkDjzkbpIAiQF4_vzGAqTVgVL0Rd5kLpVTt8qHSxxKauuVM6UkSCUQ_nWNKnw8OoDNDG5xI7ioT3n5SDE"  />
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant">{trips.length > 0 ? 'Good morning, Traveler' : 'Good morning, Guest'}</p>
<h1 className="font-title-md text-title-md text-on-surface">Explore Yaoundé</h1>
</div>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container transition-opacity duration-200 active:scale-95 hover:opacity-80">
<span className="material-symbols-outlined text-primary" data-icon="notifications">notifications</span>
</button>
</header>
<main className="px-container-padding mt-6 space-y-8">
{/* Hero Section: Animated Canvas */}
<section className="relative w-full h-[220px] rounded-xl overflow-hidden active-glow group">

<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
<div className="absolute bottom-4 left-4 right-4 text-white">
<span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full font-label-sm text-[10px] mb-2 inline-block">FEATURED EVENT</span>
<h2 className="font-headline-lg-mobile text-headline-lg-mobile">The Cultural Festival</h2>
<p className="font-body-md text-body-md opacity-90">Experience the heart of Cameroon's heritage.</p>
</div>
</section>
{/* Quick Actions Bento */}
<section className="grid grid-cols-4 grid-rows-2 gap-3 h-[240px]">
<div className="col-span-2 row-span-2 glass-card rounded-xl p-4 flex flex-col justify-between">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="map">map</span>
<div>
<p className="font-title-md text-title-md">Discover Routes</p>
<p className="font-body-md text-body-md text-on-surface-variant">Top-rated trails</p>
</div>
</div>
<div className="col-span-2 row-span-1 bg-primary text-white rounded-xl p-4 flex items-center justify-between">
<span className="font-label-sm text-label-sm">Book Tickets</span>
<span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</div>
<div className="col-span-1 row-span-1 glass-card rounded-xl flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="restaurant">restaurant</span>
</div>
<div className="col-span-1 row-span-1 glass-card rounded-xl flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="hotel">hotel</span>
</div>
</section>
{/* Dynamic List: Near You */}
<section className="space-y-4">
<div className="flex justify-between items-end">
<h3 className="font-title-md text-title-md">Nearby Destinations</h3>
<button className="font-label-sm text-label-sm text-primary">See all</button>
</div>
<div className="space-y-4">
{/* Destination Card 1 */}
<div className="glass-card rounded-xl p-3 flex gap-4 transition-transform active:scale-98">
<div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAVnEDgvFbbN2yAniHv2KHhDIK17KOzD4H43aFiLYZkWepCHeaQ2lZruxx1YLhpB_05YqUIjWUlpnumTRqXGflbBC1vP9onTCcDapGcjPdR6_puq5wcZhTFwRDNhstJMUHyySznPkB3YFW4nZmSuiK3dYPDOWQz_oc5P5WCrcCS1hSWEOrMu9GFBNXieMumbVARHXWl2HeQ2oNLDRmJIdUccPp83TQifynqZxX2QN1c6AYycdp0Up9rpaz3fCG0wBf7VFc1zVqcSw"  />
</div>
<div className="flex flex-col justify-center flex-grow">
<div className="flex justify-between items-start">
<h4 className="font-title-md text-body-lg font-semibold">Mfoundi Park</h4>
<span className="flex items-center text-tertiary font-label-sm text-[10px]">
<span className="material-symbols-outlined text-[14px]" data-icon="star" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                                4.8
                            </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">Urban oasis with walking trails...</p>
<div className="mt-2 flex items-center gap-2">
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px]">2.4 km away</span>
<span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[10px]">Open now</span>
</div>
</div>
</div>
{/* Destination Card 2 */}
<div className="glass-card rounded-xl p-3 flex gap-4 transition-transform active:scale-98">
<div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS3SioDsSWb9k9vvZNNXTNVgsD0gfbPMdr4M50IOW62R0hl4Y2birNYiuhViIdptX4oCGWWlSlnWJaJon6m3vKiOTo5ZtwvjaLoWBRQjkHtkmrvIVCoF4OXTyuwr2ZlZGSlE6nrtCgluXddPasNUzcw7pYxpMLBy40QDPtKdK4C89luo4euPE2qL6IIV8CdRomOJ8aVdG8_ozv19yo7AbxuBviF-05O-La56i6-EzrrQfiyQtv0_-WfuJ4OEhOBnAOSKmo51imIII"  />
</div>
<div className="flex flex-col justify-center flex-grow">
<div className="flex justify-between items-start">
<h4 className="font-title-md text-body-lg font-semibold">National Museum</h4>
<span className="flex items-center text-tertiary font-label-sm text-[10px]">
<span className="material-symbols-outlined text-[14px]" data-icon="star" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                                4.9
                            </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">Historical treasures &amp; art...</p>
<div className="mt-2 flex items-center gap-2">
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px]">0.8 km away</span>
<span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-[10px]">Closing soon</span>
</div>
</div>
</div>
</div>
</section>
{/* Horizontal Scroll: Local Guides */}
<section className="space-y-4">
<h3 className="font-title-md text-title-md">Local Experts</h3>
<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-container-padding px-container-padding">
<div className="flex-shrink-0 w-32 space-y-2">
<div className="w-32 h-40 rounded-xl overflow-hidden relative">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWKjjy5paziRSr2RpkKdDeIwzBMonQ2ztveM2gyyOSUwRbod47IEuMsTjfpc47iXUe3a6GGJU24oiWZEXVP1zUFAbvKBafPImBnXsvbksU-DAbsgXLtQ2nD1SuP6jbBhEhG2msq3cbFqYXtyp0wPezt_mAXSrDcAQ6OeAQG2pog5kTPSckzKm35mD78xfb0FK9ZNpf9QhCuEicHRBefGD45On9zLgAPz2fScYN9_ZtSWST4lVE-aUVJedzuFVfB8aHMrjrCuFo2PE"  />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
<span className="absolute bottom-2 left-2 text-white font-label-sm text-[10px]">Jean-Paul</span>
</div>
</div>
<div className="flex-shrink-0 w-32 space-y-2">
<div className="w-32 h-40 rounded-xl overflow-hidden relative">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfKCuwsS-U7T5uicfMLqX-mffzsQMvwijwrTV_uxOvgToCp-fE29eG8wOkzgVsBqQ9y6vlsaeh63T30UpXjEDYgmJKp-QTM7LAfuqLm1gkeqWiI-WoQLXCTgAJn081h_5gneQqlt5943oJA5gFJiJzrw-WQ5tdjCQeuUQQa7r8hTcY510a9bheyLwF1o_XCko9Xalyll27P0uVY01g3JZeeWC4HHlOBOjaX4O_3PErxivUkMTQF4HBzMQ2F2wQnyHjZpKma2XVc44"  />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
<span className="absolute bottom-2 left-2 text-white font-label-sm text-[10px]">Marie-Claire</span>
</div>
</div>
<div className="flex-shrink-0 w-32 space-y-2">
<div className="w-32 h-40 rounded-xl overflow-hidden relative">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlKQxDSPVWb3WeF0ztC57xCbVAbCH5uy8_yafYMsbpnRtzof3rLXdQwJockE0oY5Vks5Nz_3ywxbPyyPuMQA_Stya1I3eE3QlvX1nmjoNfmKxhLy2zmfm_4DWFpWsDRshe_NKs_40LhHLe2zaRlBvc0rpeL8Y00m4WLQkL9JpEfvTFCh4nBVoKyfm9Bo-PF-G-G8CMUsg2AZZAgGuM9axeajmii1_PDjPody1qMO2P9T8PWcfEnkVryRj3BH_NTMSCWCVcFsrFL-Q"  />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
<span className="absolute bottom-2 left-2 text-white font-label-sm text-[10px]">Eric T.</span>
</div>
</div>
</div>
</section>
</main>
{/* Bottom Navigation Bar */}
<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8 pointer-events-none">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(0,122,94,0.1)] h-16 flex justify-around items-center pointer-events-auto">
{/* Home (Active) */}
<button className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(0,122,94,0.3)] active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" data-icon="home" style={{"fontVariationSettings":"'FILL' 1"}}>home</span>
<span className="font-label-sm text-label-sm">Home</span>
</button>
{/* Search */}
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" data-icon="search">search</span>
<span className="font-label-sm text-label-sm">Search</span>
</button>
{/* Tickets */}
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" data-icon="confirmation_number">confirmation_number</span>
<span className="font-label-sm text-label-sm">Tickets</span>
</button>
{/* Profile */}
<button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</button>
</div>
</nav>
{/* Floating Action Button (FAB) */}
<button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform">
<span className="material-symbols-outlined" data-icon="add">add</span>
</button>
    </div>
  );
}
