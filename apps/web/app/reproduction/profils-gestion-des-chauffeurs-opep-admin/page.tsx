'use client';

import React, { useState } from 'react';
import { useDrivers } from '@/hooks/useEntities';
import { Sidebar } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/profils-gestion-des-chauffeurs-opep-admin
 */
export default function ProfilsGestionDesChauffeursOpepAdminReproductionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  
  const items = [{"icon":"dashboard","label":"Dashboard"},{"icon":"group","label":"Staff"},{"icon":"route","label":"Trips"},{"icon":"directions_bus","label":"Buses"},{"icon":"monitoring","label":"Analytics"}];
  const bottom = [{"icon":"help","label":"Help Center"},{"icon":"logout","label":"Logout"}];
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      {/* Sidebar Navigation Shell */}
  <Sidebar
    items={items}
  bottomItems={bottom}
  activeIndex={1}
  onNavChange={(index: number) => setActiveTab(String(index))}
  logo={<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container"><span className="material-symbols-outlined">local_shipping</span></div>}
  ctaButton={{ icon: "add_circle", label: "New Trip", onClick: () => {} }}
/>
{/* Main Content Canvas */}
<main className="md:ml-[280px] min-h-screen relative">
{/* Top App Bar */}
<header className="sticky top-0 z-40 flex justify-between items-center px-container-padding h-16 w-full bg-surface-container/80 backdrop-blur-md border-b border-outline-variant">
<div className="flex items-center gap-gutter">
<h2 className="font-headline-lg text-title-md text-on-surface hidden md:block">Driver Directory</h2>
<div className="md:hidden w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container" style={{"fontVariationSettings":"'FILL' 1"}}>local_shipping</span>
</div>
</div>
<div className="flex items-center gap-lg">
<div className="relative hidden sm:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-md focus:outline-none focus:border-primary w-64 transition-all" placeholder="Search drivers..." type="text"/>
</div>
<div className="flex items-center gap-sm">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined">translate</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant cursor-pointer active:opacity-80">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a senior transport administrator in Cameroon, wearing a clean, modern uniform. The lighting is editorial and sharp against a blurred obsidian-tech office background. The color palette incorporates deep forest greens and subtle gold accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuChRy3Fl58_8RTHL-TmUqlGL06I6AEu43Hn7wir5q1CZr7fMdWMJIguX-WwpespA10GMFweAyIDUtdRGewzaFiI1_TUMqpO7rlFny8UeogrBnxpV1PxPcBnpiomTCGUxNlH9gui6gKDBcGyKvGE5XO8ofscI2uly2nOIuGAQ1kDohHOTgcB9K2NF4d2xJStwvIozBOBgwje93MP7fUqtK_TH4fEhdkDlTI10ZCyjtboS7bZTHRFXZVpL579nZNUthLMfzmlq4l0fe8"/>
</div>
</div>
</div>
</header>
{/* Content Section */}
<div className="p-container-padding max-w-7xl mx-auto">
{/* Header Controls */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
<div>
<h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">Management Fleet</h3>
<p className="text-on-surface-variant text-body-md">Oversee 128 registered active personnel</p>
</div>
<div className="flex flex-wrap gap-xs">
<button className="flex items-center gap-xs px-gutter py-2 rounded-full border border-outline-variant bg-surface-container hover:bg-surface-container-high text-body-md transition-all">
<span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
                        Experience level
                    </button>
<button className="flex items-center gap-xs px-gutter py-2 rounded-full border border-outline-variant bg-surface-container hover:bg-surface-container-high text-body-md transition-all">
<span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                        Status
                    </button>
<button className="flex items-center gap-xs px-gutter py-sm rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold transition-transform active:scale-95 shadow-lg shadow-primary/10">
<span className="material-symbols-outlined text-[22px]">person_add</span>
                        Add Driver
                    </button>
</div>
</div>
{/* Bento Grid Layout for Profiles */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
{/* Driver Card 1: On Trip */}
<div className="glass-card inner-glow rounded-xl p-md flex flex-col gap-md transition-all cursor-pointer group">
<div className="flex justify-between items-start">
<div className="flex gap-md items-center">
<div className="relative">
<div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A high-contrast studio portrait of a middle-aged male African driver with a friendly expression. He is dressed in a smart navy blue driver's polo. The lighting is sophisticated, emphasizing the texture of his skin and the quality of the glassmorphic UI environment he inhabits." src="https://lh3.googleusercontent.com/aida-public/AB6AXuClxKg9Fo0KWDoFvYitKaVfWZvdQ3EgYk8kGm0PXfGicY_PjcBNK5fh3odgLLw6R7rU-8cvNhUayp7PPLjooxrrGUEJrQb8Axu6umgNbRZwetJfxmFwZkuGB37e5tyV7IUQhdUnyJ0YV8U3wSNslLVd5V7cw4Cg-YWR32tJQoAOxaPnqRST9Jw-S8DqPjlyDDU-MP_d0TU1GuvjpWJlpmmMoPZ5SJmBz43DBKfTtX2RHvn605AsEIm8j00O9_K45zqROSK2PkQafV4"/>
</div>
<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>check</span>
</div>
</div>
<div>
<h4 className="font-title-md text-on-surface">Jean-Paul Ebodé</h4>
<p className="text-label-sm text-on-surface-variant font-medium tracking-tight">LIC: CM-903-X402</p>
</div>
</div>
<div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
                            On Trip
                        </div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Experience</p>
<p className="text-body-lg font-semibold text-primary">12 Years</p>
</div>
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Vehicle</p>
<p className="text-body-lg font-semibold text-on-surface">Volvo B11R</p>
</div>
</div>
<div className="flex items-center justify-between border-t border-outline-variant/30 pt-md">
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">Safety Score</span>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary text-[18px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-body-lg font-bold text-on-surface">4.92</span>
</div>
</div>
<div className="flex flex-col text-right">
<span className="text-label-sm text-on-surface-variant">Total Trips</span>
<span className="text-body-lg font-bold text-on-surface">1,402</span>
</div>
</div>
</div>
{/* Driver Card 2: Available */}
<div className="glass-card inner-glow rounded-xl p-md flex flex-col gap-md transition-all cursor-pointer group">
<div className="flex justify-between items-start">
<div className="flex gap-md items-center">
<div className="relative">
<div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-secondary/20">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Close up cinematic portrait of a professional female driver from Cameroon, with braided hair and a confident smile. She is in a premium vehicle interior with neon green dashboard lights reflecting off her face. Ultra-detailed 8k resolution, modern dark mode aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6Wb6wuC7X1wLKbf5_SIqyUHZMNaAwD1FztvhqW7FEftLNe93A-MYMkWP1RYmdJIK1Ng3dHAD7zepFO0_cXGQChf4PRb5yuSCFaqNipqZDxrKWJ_3N0IJvxemftDx7ybr2UhMGnGeuGdJnex60Ts9BjUi24JCxoWmn4cN0rnnu1pgz1hNmuc7wjrEjTpD8SS0LcxGts7ojIg5EBVgvrdtnw8QluvoRhehXJ5oAKhffIuOxk4-2UvBkHYvLBIgeHpaMkD6WVe94tL8"/>
</div>
<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-tertiary rounded-full border-2 border-surface flex items-center justify-center">
<span className="material-symbols-outlined text-on-tertiary text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>bolt</span>
</div>
</div>
<div>
<h4 className="font-title-md text-on-surface">Marie-Claire Ngo</h4>
<p className="text-label-sm text-on-surface-variant font-medium tracking-tight">LIC: CM-112-R789</p>
</div>
</div>
<div className="px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[11px] font-bold uppercase tracking-wider">
                            Available
                        </div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Experience</p>
<p className="text-body-lg font-semibold text-primary">8 Years</p>
</div>
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Vehicle</p>
<p className="text-body-lg font-semibold text-on-surface-variant italic text-sm">Unassigned</p>
</div>
</div>
<div className="flex items-center justify-between border-t border-outline-variant/30 pt-md">
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">Safety Score</span>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary text-[18px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-body-lg font-bold text-on-surface">4.85</span>
</div>
</div>
<div className="flex flex-col text-right">
<span className="text-label-sm text-on-surface-variant">Total Trips</span>
<span className="text-body-lg font-bold text-on-surface">892</span>
</div>
</div>
</div>
{/* Driver Card 3: Off Duty */}
<div className="glass-card inner-glow rounded-xl p-md flex flex-col gap-md transition-all cursor-pointer group">
<div className="flex justify-between items-start">
<div className="flex gap-md items-center">
<div className="relative">
<div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-outline-variant/40">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Realistic portrait of a young male driver with short hair and an attentive gaze. He is wearing a modern tech-wear vest over a white shirt. The background is a blurred cityscape of Douala at night with vibrant streetlights. Dark, cinematic lighting with emerald green rim light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCITy2WoVroV-1ktSZ09qySsDuLmhSt8-i1RJJturvQbb5hJS7-BivK615KNrJ69nde5o0yQ0RGV0IEEtIha7ocOLRb4hfWPde4J_8ABwdeHipzK7hUUhXunek8zNmmtsYaFIM-IXkAmwCIrzMz2MU4Y0L3CDrn8p5cgIfKPJx57vWJIGFFyAGuRc3FFXvndAK_9aTtH9Hqg57FmTGeU6o6ODIiAuRDEZW9Ha0vyjgnpFrNxlDGBNprbgTV7abP9ksAc0LmyO7YXsU"/>
</div>
<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-outline-variant rounded-full border-2 border-surface flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>bed</span>
</div>
</div>
<div>
<h4 className="font-title-md text-on-surface">Samuel Batoum</h4>
<p className="text-label-sm text-on-surface-variant font-medium tracking-tight">LIC: CM-045-G552</p>
</div>
</div>
<div className="px-3 py-1 rounded-full bg-surface-variant border border-outline-variant text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                            Off Duty
                        </div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Experience</p>
<p className="text-body-lg font-semibold text-primary">5 Years</p>
</div>
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Vehicle</p>
<p className="text-body-lg font-semibold text-on-surface">Marco Polo G7</p>
</div>
</div>
<div className="flex items-center justify-between border-t border-outline-variant/30 pt-md">
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">Safety Score</span>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary text-[18px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-body-lg font-bold text-on-surface">4.78</span>
</div>
</div>
<div className="flex flex-col text-right">
<span className="text-label-sm text-on-surface-variant">Total Trips</span>
<span className="text-body-lg font-bold text-on-surface">543</span>
</div>
</div>
</div>
{/* More cards would follow similar pattern */}
{/* Example of an alert/urgent card */}
<div className="glass-card inner-glow rounded-xl p-md flex flex-col gap-md transition-all cursor-pointer group border-secondary/30 bg-secondary/5">
<div className="flex justify-between items-start">
<div className="flex gap-md items-center">
<div className="relative">
<div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-secondary/50">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Headshot of a senior driver with graying hair and glasses, looking intensely at the camera. He wears a high-visibility yellow uniform over a dark shirt. The mood is serious and professional. High contrast lighting highlighting his facial features." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUSINBHe3E7GrNejLwW22g6LPwpU29rtFK723ncvIfSWhTKG4Zd7KswGS73xkJjvm1Bfw-s4vIEuHRvmr4hwdDrpej92QPoV7LajGl0biVC30BFrGo9d9WwZHmu8CesTpGAcZ5HIg8sYDsx9p6y779TAPaBFq8OG0CNXT_mgV_ja0hyRcGQQYAY5HwuzfhPkMBButnPW994NOzY8-Lb3LtWkMaeg3-eAXCUNtB_681cUH9A0HySSw11tY4ymbn1nf-Dd3KDKVj1QU"/>
</div>
<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-surface flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary text-[12px]" style={{"fontVariationSettings":"'FILL' 1"}}>warning</span>
</div>
</div>
<div>
<h4 className="font-title-md text-on-surface">Augustin Mboma</h4>
<p className="text-label-sm text-on-surface-variant font-medium tracking-tight">LIC: CM-001-A001</p>
</div>
</div>
<div className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-[11px] font-bold uppercase tracking-wider">
                            On Trip (Delayed)
                        </div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Experience</p>
<p className="text-body-lg font-semibold text-primary">25 Years</p>
</div>
<div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/30">
<p className="text-label-sm text-on-surface-variant mb-1">Vehicle</p>
<p className="text-body-lg font-semibold text-on-surface">Volvo B11R</p>
</div>
</div>
<div className="flex items-center justify-between border-t border-outline-variant/30 pt-md">
<div className="flex flex-col">
<span className="text-label-sm text-on-surface-variant">Safety Score</span>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary text-[18px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-body-lg font-bold text-on-surface">4.99</span>
</div>
</div>
<div className="flex flex-col text-right">
<span className="text-label-sm text-on-surface-variant">Total Trips</span>
<span className="text-body-lg font-bold text-on-surface">5,102</span>
</div>
</div>
</div>
</div>
{/* Dashboard Stats Bar */}
<div className="mt-xl glass-card rounded-2xl p-lg grid grid-cols-2 md:grid-cols-4 gap-lg">
<div className="flex flex-col gap-xs">
<span className="text-label-sm text-on-surface-variant tracking-wider uppercase">Active Fleet Rate</span>
<span className="text-display-lg text-primary">94%</span>
<div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-[94%]"></div>
</div>
</div>
<div className="flex flex-col gap-xs">
<span className="text-label-sm text-on-surface-variant tracking-wider uppercase">Avg. Safety Score</span>
<span className="text-display-lg text-tertiary">4.82</span>
<div className="flex gap-1">
<span className="material-symbols-outlined text-tertiary text-[14px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-tertiary text-[14px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-tertiary text-[14px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-tertiary text-[14px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-on-surface-variant text-[14px]">star</span>
</div>
</div>
<div className="flex flex-col gap-xs">
<span className="text-label-sm text-on-surface-variant tracking-wider uppercase">Miles Logged (MTD)</span>
<span className="text-display-lg text-on-surface">12.4k</span>
<span className="text-primary text-[12px] font-bold">+12% vs last month</span>
</div>
<div className="flex flex-col gap-xs">
<span className="text-label-sm text-on-surface-variant tracking-wider uppercase">Training Status</span>
<span className="text-display-lg text-secondary">82/128</span>
<span className="text-on-surface-variant text-[12px]">Certificates expiring soon</span>
</div>
</div>
</div>
</main>
{/* Floating Glass Navbar (Mobile Only) */}
<nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 glass-card rounded-full flex items-center justify-around px-gutter z-50">
<a className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-medium">Home</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>group</span>
<span className="text-[10px] font-medium">Staff</span>
</a>
<div className="w-12 h-12 -mt-10 rounded-full bg-gradient-to-tr from-primary-container to-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform">
<span className="material-symbols-outlined text-on-primary-container">person_add</span>
</div>
<a className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">directions_bus</span>
<span className="text-[10px] font-medium">Fleet</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px] font-medium">Settings</span>
</a>
</nav>
    </div>
  );
}
