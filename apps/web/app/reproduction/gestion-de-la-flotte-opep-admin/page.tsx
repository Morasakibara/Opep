'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useBuses, useCreateBus } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/gestion-de-la-flotte-opep-admin
 */
export default function GestionDeLaFlotteOpepAdminReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: buses, isLoading: busesLoading, error: busesError, refetch: busesRefetch } = useBuses();
  const createBus = useCreateBus();
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* Sidebar */}
          <Sidebar
  items={[{"icon":"dashboard","label":"Dashboard"},{"icon":"corporate_fare","label":"Agencies"},{"icon":"route","label":"Trips"},{"icon":"directions_bus","label":"Buses"},{"icon":"group","label":"Staff"},{"icon":"monitoring","label":"Analytics"}]}
  bottomItems={[{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}]}
  activeIndex={3}
  onNavChange={(index: number) => setActiveNav(String(index))}
/>

<main className="flex-1 md:ml-[280px] bg-background">          {busesError && (
            <ErrorState 
              title="Erreur de connexion"
              message={String(busesError?.message || 'Une erreur est survenue')}
              onRetry={() => busesRefetch()}
            />
          )}

<header className="flex justify-between items-center px-margin-desktop h-16 w-full sticky top-0 z-40 bg-surface-container border-b border-charcoal-border">
<div className="flex items-center gap-4">
<h1 className="font-headline-lg text-headline-lg font-bold text-primary">Flotte</h1>
<div className="hidden lg:flex items-center bg-surface-container-low border border-charcoal-border rounded-full px-4 py-1.5 ml-4">
<span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-sm text-on-surface w-64 placeholder:text-on-surface-variant" placeholder="Rechercher un bus..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">translate</button>
<div className="relative">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</button>
<span className="absolute top-0 right-0 w-2 h-2 bg-secondary-container rounded-full border-2 border-surface-container"></span>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">settings</button>
<div className="h-8 w-8 rounded-full overflow-hidden border border-primary ml-2">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0nWEbFblM_YWQ2QH3mcCP9WnPR91-5TxyHo1P_qTK7-aeNckraRyQuU3fs_u-30RKD1XM6UDHUlowNI1pOzS1Z_4Gy0fhZmLaU7wGzLgntlYoNNNOahK-ilucaXNJxgHsbQeFnZnOXXXk1WEhigcnYvJ1fAG1VuImnNX1ZaVA9OB0Y1XDl8epEb4NMXTgLzyhVfHQ_XfoagliGxBuZkJSaQ0eatF7lOD417sgj4Hpy6PX1p2G_ruWdUyuOTJUO1VXgiyKngmgM_s" alt="A professional portrait of a senior logistics administrator with a clean-shaven face and focused expression, wearing a tailored dark suit. The background is a soft-focus modern operations center with glowing digital screens displaying transportation maps. The lighting is sophisticated, using cool blue and warm amber tones typical of a high-tech corporate environment." />
</div>
</div>
</header>
<div className="p-margin-desktop max-w-container-max mx-auto space-y-8">

<section className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div className="glass-effect p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
<div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-[100px]">directions_bus</span>
</div>
<span className="text-on-surface-variant font-label-caps">Total Véhicules</span>
<span className="font-display-lg text-on-surface">{busesLoading ? '...' : buses?.length || 42}</span>
<div className="flex items-center text-success-green text-label-caps mt-2">
<span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +3 ce mois
                    </div>
</div>
<div className="glass-effect p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
<span className="text-on-surface-variant font-label-caps">En Service</span>
<span className="font-display-lg text-success-green">{busesLoading ? '...' : buses?.filter(b => b.status === 'active').length || 38}</span>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
<div className="bg-success-green h-full rounded-full" style={{"width":"90%"}}></div>
</div>
</div>
<div className="glass-effect p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
<span className="text-on-surface-variant font-label-caps">Maintenance</span>
<span className="font-display-lg text-warning-yellow">{busesLoading ? '...' : buses?.filter(b => b.status === 'maintenance').length || 4}</span>
<div className="flex items-center text-on-surface-variant text-label-caps mt-2">
<span className="material-symbols-outlined text-[16px] mr-1">schedule</span> 2 prévus demain
                    </div>
</div>
<div className="bg-primary-container p-6 rounded-xl flex flex-col justify-between items-start transition-transform active:scale-95 cursor-pointer shadow-lg shadow-primary-container/20">
<div>
<h3 className="font-title-md text-white">Nouveau Véhicule</h3>
<p className="text-on-primary-container/80 text-body-sm">Ajouter un bus à la flotte</p>
</div>
<button className="bg-white text-primary-container rounded-full px-4 py-2 flex items-center gap-2 font-label-caps mt-4">
<span className="material-symbols-outlined text-[20px]">add</span> AJOUTER
                    </button>
</div>
</section>

<section className="space-y-6">
<div className="flex justify-between items-center">
<div className="flex gap-4">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-label-caps">Tous</button>
<button className="text-on-surface-variant hover:text-on-surface px-4 py-1.5 rounded-lg font-label-caps transition-colors">Actifs</button>
<button className="text-on-surface-variant hover:text-on-surface px-4 py-1.5 rounded-lg font-label-caps transition-colors">Maintenance</button>
</div>
<div className="flex items-center gap-2 text-on-surface-variant font-label-caps">
                        Trier par: 
                        <select className="bg-surface-container border border-charcoal-border rounded-lg text-on-surface text-body-sm py-1 pl-2 pr-8 focus:ring-primary focus:border-primary">
<option>Dernière activité</option>
<option>Immatriculation</option>
<option>Capacité</option>
</select>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">

<div className="glass-effect rounded-xl overflow-hidden hover:border-primary/30 transition-all flex h-44">
<div className="w-1/3 h-full relative">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA642ETJenAC14xUztknNM5fqRssExwnPi-24B2Def_gUUEXSMIexszon5qFyQcijxARQTjQV7x4wROkqiRHBhLYVtFX0hrp-EQiROVRCH27ik4qAh6ibnnClkHE63S_V1xMKyFfjdbwZumuMRjtl9Rcltc3QsAdz4JnmT-0ElW8D07PN0hOSFtMvaStqIXq3kl9TrHffWL7npxjhs35I0eq-uJBY1kHrU7JKh227rtnmsfkpdzauolFTnpepfo7DaWj46XbU8ghPs" alt="A side-profile shot of a premium long-distance luxury interurban coach bus in a sleek metallic dark silver color with vibrant green aerodynamic stripes. The bus is parked in a clean, modern terminal at twilight, with subtle floor-level lighting casting soft reflections on its polished surface. The aesthetic is ultra-modern, corporate, and emphasizes reliability and high-end transport services." />
<div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-surface/40"></div>
</div>
<div className="flex-1 p-6 flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<div className="flex items-center gap-2">
<h3 className="font-title-md text-on-surface">LT 492 CA</h3>
<span className="bg-success-green/10 text-success-green text-[10px] px-2 py-0.5 rounded-full font-label-caps flex items-center">
<span className="w-1 h-1 bg-success-green rounded-full mr-1"></span> ACTIF
                                        </span>
</div>
<p className="text-on-surface-variant text-body-sm mt-1">Mercedes-Benz Tourismo (2023)</p>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<div className="flex items-center gap-6 mt-4">
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Capacité</span>
<span className="font-title-md text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-[18px]">airline_seat_recline_extra</span> 70 Sièges
                                    </span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Kilométrage</span>
<span className="font-title-md text-on-surface">12,450 km</span>
</div>
<div className="relative ml-auto">
<button className="border border-charcoal-border hover:border-primary text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg text-label-caps transition-all">Détails</button>
</div>
</div>
</div>
</div>

<div className="glass-effect rounded-xl overflow-hidden hover:border-primary/30 transition-all flex h-44">
<div className="w-1/3 h-full relative">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3ErNmQmYdtVn4uXy7pjmCYPUecjwg9SXYskSzSnR70HSqOJB9Cu8JyfNZDmopu2_wH7JT8MSLpDgdIqWxyq-3WDuJSLxcnaTmrF3ByXlrRDZgXI3WS4s-iaKohkt9hUD5FPpXKz-Nt8iidSYorPKlKOwbkE2CIGNPPWaUe_LXMVDYuG7_ljmfImOe1I3uHGpSklM32W615ZNV1IjH8REK_o566Exn6SKoZTxWYTylIwM0N04EdQ1TX1ugmv0-E8ZyXdG63-1nboM" alt="A professional photograph of a sturdy medium-sized passenger coach bus designed for regional travel, featuring a white and emerald green color scheme with a minimalist agency logo on the side. The bus is captured from a front-three-quarters angle on a clean asphalt road with a lush green tropical forest backdrop under a bright morning sun. The lighting is crisp and natural, highlighting the vehicle's maintenance and safety features." />
<div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-surface/40"></div>
</div>
<div className="flex-1 p-6 flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<div className="flex items-center gap-2">
<h3 className="font-title-md text-on-surface">CE 881 AB</h3>
<span className="bg-warning-yellow/10 text-warning-yellow text-[10px] px-2 py-0.5 rounded-full font-label-caps flex items-center">
<span className="w-1 h-1 bg-warning-yellow rounded-full mr-1"></span> MAINTENANCE
                                        </span>
</div>
<p className="text-on-surface-variant text-body-sm mt-1">Toyota Coaster (2021)</p>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<div className="flex items-center gap-6 mt-4">
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Capacité</span>
<span className="font-title-md text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-[18px]">airline_seat_recline_extra</span> 30 Sièges
                                    </span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Prochain Entretien</span>
<span className="font-title-md text-warning-yellow">Dans 2j</span>
</div>
<div className="relative ml-auto">
<button className="border border-charcoal-border hover:border-primary text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg text-label-caps transition-all">Détails</button>
</div>
</div>
</div>
</div>

<div className="glass-effect rounded-xl overflow-hidden hover:border-primary/30 transition-all flex h-44">
<div className="w-1/3 h-full relative">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc98yI_0RazsAgoPNtcZA_T0kidD0544cz7S86Advyhl-cWcxZ3YrMV_OFf8PsinlXmuZKe_VSbR-xeNfi7t1rAt7JjKoomp0_ULbDhYNrDBv1v_FiiFDOmcUZyEAf7oaqTfqLLYdt7TZijHGZyleINLHAqLyijIy2V_efqcI9-EL81mmvydLUyhaRzrHcX-QVRZ-9flLd_fFbKSDDfD4VFUpKbn9HlbaFD_Z40L_R1ZyBvUcjDv692xFJV-aoU1ey7SAPR7RVCIY" alt="A wide-angle landscape shot of a modern electric-powered long-haul bus fleet vehicle with a futuristic aerodynamic profile. The bus is painted in a sophisticated charcoal grey with glowing neon green accents along the windows and bottom skirts. The scene is set in a state-of-the-art charging bay with minimalist industrial architecture and bright, diffused overhead lighting, creating a high-fidelity and eco-friendly transportation vibe." />
<div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-surface/40"></div>
</div>
<div className="flex-1 p-6 flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<div className="flex items-center gap-2">
<h3 className="font-title-md text-on-surface">LT 503 EF</h3>
<span className="bg-success-green/10 text-success-green text-[10px] px-2 py-0.5 rounded-full font-label-caps flex items-center">
<span className="w-1 h-1 bg-success-green rounded-full mr-1"></span> ACTIF
                                        </span>
</div>
<p className="text-on-surface-variant text-body-sm mt-1">Yutong ZK6122H9 (2024)</p>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<div className="flex items-center gap-6 mt-4">
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Capacité</span>
<span className="font-title-md text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-[18px]">airline_seat_recline_extra</span> 55 Sièges
                                    </span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Kilométrage</span>
<span className="font-title-md text-on-surface">5,800 km</span>
</div>
<div className="relative ml-auto">
<button className="border border-charcoal-border hover:border-primary text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg text-label-caps transition-all">Détails</button>
</div>
</div>
</div>
</div>

<div className="glass-effect rounded-xl overflow-hidden hover:border-primary/30 transition-all flex h-44">
<div className="w-1/3 h-full relative">
<Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1PYwmlW1iCnOGTerkKFWZ6-ug-wnvtmuOUU0cALCMr50Em03wbKYaPAe8DOkWED7zRYU9we8DRa8gwQlRBQvKUrU3271QHYJJRr0qHOgG8frSF2xlZteGWpZQBI16iYf4THCil7PhVeOBQasUonfLCAWunN7ScmfWp64ojPCJt7_st2bRKB3PI-p2NXkR5RpwEtZuKjx4-LwsZfx8RjmVs2pjcsbS7ryL9CZz-EXl5ISR9vqtaagu4cNO9VBhkXk_xAfpJys23DE" alt="A close-up artistic focus on the headlight and front grill of a modern bus, showing detailed craftsmanship and engineering. The vehicle is painted a deep metallic forest green. The background is a soft bokeh of city lights at night, creating a premium and safe night-travel atmosphere. The image emphasizes the high-end technology and security features of the interurban transport company's fleet." />
<div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-surface/40"></div>
</div>
<div className="flex-1 p-6 flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<div className="flex items-center gap-2">
<h3 className="font-title-md text-on-surface">CE 412 BB</h3>
<span className="bg-success-green/10 text-success-green text-[10px] px-2 py-0.5 rounded-full font-label-caps flex items-center">
<span className="w-1 h-1 bg-success-green rounded-full mr-1"></span> ACTIF
                                        </span>
</div>
<p className="text-on-surface-variant text-body-sm mt-1">Scania Touring (2022)</p>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<div className="flex items-center gap-6 mt-4">
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Capacité</span>
<span className="font-title-md text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-[18px]">airline_seat_recline_extra</span> 62 Sièges
                                    </span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Kilométrage</span>
<span className="font-title-md text-on-surface">34,100 km</span>
</div>
<div className="ml-auto">
<button className="border border-charcoal-border hover:border-primary text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg text-label-caps transition-all">Détails</button>
</div>
</div>
</div>
</div>
</div>
</section>

<div className="flex justify-between items-center pt-8 border-t border-charcoal-border">
<p className="text-on-surface-variant text-body-sm">Affichage de 4 sur 42 véhicules</p>
<div className="flex gap-2">
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:text-primary hover:border-primary transition-all">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">1</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:text-primary transition-all">2</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:text-primary transition-all">3</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-charcoal-border text-on-surface-variant hover:text-primary hover:border-primary transition-all">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</main>

<button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center md:hidden z-50 transition-transform active:scale-90">
<span className="material-symbols-outlined text-[32px]">add</span>
</button>

<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-high border-t border-charcoal-border flex justify-around py-3 px-margin-mobile z-50">
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-label-caps">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined">directions_bus</span>
<span className="text-[10px] font-label-caps">Flotte</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">route</span>
<span className="text-[10px] font-label-caps">Trajets</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] font-label-caps">Profil</span>
</a>
</nav>
    </div>
  );
}
