'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useSubscriptionPackages } from '@/hooks/useEntities';
import { Modal } from '@/components/reproduction';

/**
undefined
 * Route: /reproduction/rejoindre-opep-inscription-agence-light
 */
export default function RejoindreOpepInscriptionAgenceLightReproductionPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {/* SECTION: Mockup Layout */}
      <nav className="flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40 bg-surface-container h-16 border-b border-charcoal-border">
<div className="flex items-center gap-4">
<span className="font-headline-lg text-headline-lg font-bold text-primary">OPEP Portal</span>
<span className="hidden md:block h-6 w-px bg-outline-variant"></span>
<span className="hidden md:block font-body-lg text-body-lg text-on-surface-variant">Agency Registration</span>
</div>
<div className="flex items-center gap-6">
<div className="hidden md:flex gap-4">
<span className="cursor-pointer font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">HELP</span>
<span className="cursor-pointer font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">FRANÇAIS</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary cursor-pointer active:opacity-80">translate</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:opacity-80">settings</span>
</div>
</div>
</nav>
<main className="min-h-[calc(100vh-64px)] relative flex items-center justify-center py-12 px-4 md:px-0">

<div className="absolute inset-0 pointer-events-none overflow-hidden">
<div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>
<div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary-container/5 rounded-full blur-[150px]"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" style={{"backgroundImage":"radial-gradient(#006c53 1px, transparent 1px)","backgroundSize":"40px 40px"}}></div>
</div>
<div className="container max-w-[1000px] z-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

<div className="hidden lg:flex lg:col-span-4 flex-col gap-8">
<div className="glass-panel rounded-xl p-8 shadow-sm">
<h2 className="font-headline-lg text-headline-lg text-primary mb-6">Partner With Us</h2>
<div className="flex flex-col gap-6">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-on-primary-container">domain</span>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface">Agency Identity</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Tell us who you are and where you operate.</p>
</div>
</div>
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container-high border border-charcoal-border flex items-center justify-center shrink-0" id="step2-indicator">
<span className="material-symbols-outlined text-outline">payments</span>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface-variant" id="step2-title">Plan Selection</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Choose the best fit for your fleet size.</p>
</div>
</div>
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container-high border border-charcoal-border flex items-center justify-center shrink-0" id="step3-indicator">
<span className="material-symbols-outlined text-outline">verified_user</span>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface-variant" id="step3-title">Verification</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Finalize your account and go live.</p>
</div>
</div>
</div>
</div>
<div className="relative rounded-xl overflow-hidden aspect-video group shadow-md">
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
<Image fill className="object-cover transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmmse8mVF7NfplZ7bNopV0betg1VrqzC9cguDIeOWIC6b22n-er3XagSxUsPPEaQUmFfxWVOQSFYWuE1T6DKZ8v5_dANu7xuLqsyWc8l-XvT3hgdM9Q37H-yA6a5AnA0beK1QxVOK5erPvhQIs6dVzkvX5kantZaEhsxpL8Zgx-m3MyVbx_YwYr6NfVoEjfhvcPSXIPG0LjmkMFcgU7Xw4Fkk2BrpBlfsQ7apYSx-zEdfMgcqUbu1beBBsMApbQ6T6sNF1pADgag" alt="A cinematic, high-fidelity photograph of a modern luxury bus traveling through a lush, green Cameroon landscape at dawn. The lighting is golden and warm, highlighting the sleek design of the bus against the backdrop of rolling hills and mist. The visual style is professional, vibrant, and trustworthy, with a focus on reliability and high-end transport infrastructure." />
<div className="absolute bottom-4 left-4 z-20">
<p className="font-label-caps text-label-caps text-primary-fixed">TRANS-CAMEROON NETWORK</p>
<p className="font-body-sm text-body-sm text-white">Connecting the nation, one trip at a time.</p>
</div>
</div>
</div>

<div className="lg:col-span-8 w-full">
<form className="glass-panel rounded-xl p-6 md:p-10 flex flex-col gap-8 shadow-xl" id="registrationForm">

<div className={currentStep === 1 ? "flex flex-col gap-8" : "hidden"} id="step1">
<header>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Agency Information / <span className="text-on-surface-variant">Information de l'agence</span></h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Enter your legal business details to start the onboarding process.</p>
</header>
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div className="flex flex-col gap-2">
<label className="font-label-caps text-label-caps text-on-surface-variant">AGENCY NAME / NOM DE L'AGENCE</label>
<input className="bg-surface-container-lowest border-charcoal-border rounded-lg text-on-surface focus:ring-primary focus:border-primary px-4 py-3" placeholder="e.g. Finexs Voyages" type="text"/>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-caps text-label-caps text-on-surface-variant">REGISTRATION NUMBER / NO. D'IMMATRICULATION</label>
<input className="bg-surface-container-lowest border-charcoal-border rounded-lg text-on-surface focus:ring-primary focus:border-primary px-4 py-3" placeholder="RCCM-..." type="text"/>
</div>
<div className="flex flex-col gap-2 md:col-span-2">
<label className="font-label-caps text-label-caps text-on-surface-variant">CITIES OF OPERATION / VILLES D'OPÉRATION</label>
<div className="flex flex-wrap gap-2 p-3 bg-surface-container-lowest border border-charcoal-border rounded-lg">
<span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">Douala <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span></span>
<span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">Yaoundé <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span></span>
<span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">Bafoussam <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span></span>
<input className="bg-transparent border-none focus:ring-0 text-sm p-0 ml-2 placeholder:text-outline-variant w-24" placeholder="Add city..." type="text"/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-caps text-label-caps text-on-surface-variant">CONTACT EMAIL / EMAIL DE CONTACT</label>
<input className="bg-surface-container-lowest border-charcoal-border rounded-lg text-on-surface focus:ring-primary focus:border-primary px-4 py-3" placeholder="admin@agency.cm" type="email"/>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-caps text-label-caps text-on-surface-variant">PHONE NUMBER / TÉLÉPHONE</label>
<div className="flex">
<span className="bg-surface-container-high border border-r-0 border-charcoal-border rounded-l-lg px-3 flex items-center text-on-surface-variant">+237</span>
<input className="w-full bg-surface-container-lowest border-charcoal-border rounded-r-lg text-on-surface focus:ring-primary focus:border-primary px-4 py-3" placeholder="6..." type="tel"/>
</div>
</div>
</div>
<button className="w-full bg-primary text-on-primary font-title-md py-4 rounded-xl hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2" onClick={() => setCurrentStep(prev => Math.min(prev + 1, 3))} type="button">
                                Next: Select Subscription
                                <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>

<div className={currentStep === 2 ? "flex flex-col gap-8" : "hidden"} id="step2">
<header>
<div className="flex items-center gap-2 text-primary cursor-pointer mb-2" onClick={() => setCurrentStep(1)}>
<span className="material-symbols-outlined text-[18px]">arrow_back</span>
<span className="font-label-caps text-label-caps">BACK TO IDENTITY</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Choose Your Plan / <span className="text-on-surface-variant">Votre abonnement</span></h1>
</header>
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">

<div className="relative group border-2 border-charcoal-border rounded-2xl p-6 bg-surface-container-lowest hover:border-primary transition-all cursor-pointer flex flex-col h-full shadow-sm" onClick={() => setSelectedPlan('basic')}>
<div className="absolute top-4 right-4 opacity-0 transition-opacity" id="check-basic">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
</div>
<span className="font-label-caps text-label-caps text-on-surface-variant mb-2">FOR EMERGING FLEETS</span>
<h3 className="font-headline-lg text-headline-lg text-on-surface">BASIC</h3>
<div className="my-4">
<span className="font-display-lg text-display-lg text-primary">25 000</span>
<span className="text-on-surface-variant font-body-sm">FCFA / month</span>
</div>
<ul className="flex flex-col gap-3 mb-8 flex-grow">
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-[18px]">check</span>
                                            Up to 10 active buses
                                        </li>
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-[18px]">check</span>
                                            Standard route management
                                        </li>
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-[18px]">check</span>
                                            2 Admin accounts
                                        </li>
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant opacity-40">
<span className="material-symbols-outlined text-[18px]">close</span>
                                            Priority Support
                                        </li>
</ul>
<div className="w-full py-3 rounded-lg border border-charcoal-border group-hover:bg-primary/5 group-hover:border-primary text-center transition-colors font-semibold">Select Basic</div>
</div>

<div className="relative group border-2 border-primary rounded-2xl p-6 bg-primary/5 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full" onClick={() => setSelectedPlan('premium')}>
<div className="absolute top-4 right-4 opacity-100" id="check-premium">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
</div>
<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full font-label-caps text-label-caps shadow-sm">RECOMMENDED</div>
<span className="font-label-caps text-label-caps text-primary mb-2">FOR ESTABLISHED OPERATORS</span>
<h3 className="font-headline-lg text-headline-lg text-on-surface">PREMIUM</h3>
<div className="my-4">
<span className="font-display-lg text-display-lg text-primary">75 000</span>
<span className="text-on-surface-variant font-body-sm">FCFA / month</span>
</div>
<ul className="flex flex-col gap-3 mb-8 flex-grow">
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-[18px]">check</span>
                                            Unlimited bus capacity
                                        </li>
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-[18px]">check</span>
                                            Advanced analytics &amp; heatmaps
                                        </li>
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-[18px]">check</span>
                                            Unlimited Admin accounts
                                        </li>
<li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-[18px]">check</span>
                                            Priority 24/7 technical support
                                        </li>
</ul>
<div className="w-full py-3 rounded-lg bg-primary text-on-primary text-center transition-colors font-semibold shadow-md">Select Premium</div>
</div>
</div>
<button className="w-full bg-primary text-on-primary font-title-md py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-md" onClick={() => setCurrentStep(prev => Math.min(prev + 1, 3))} type="button">
                                Continue to Verification
                                <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>

<div className={currentStep === 3 ? "flex flex-col gap-8" : "hidden"} id="step3">
<header>
<div className="flex items-center gap-2 text-primary cursor-pointer mb-2" onClick={() => setCurrentStep(2)}>
<span className="material-symbols-outlined text-[18px]">arrow_back</span>
<span className="font-label-caps text-label-caps">BACK TO PLANS</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Final Verification / <span className="text-on-surface-variant">Vérification</span></h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Upload your documents for validation. Once approved, you can start booking trips.</p>
</header>
<div className="flex flex-col gap-6">
<div className="border-2 border-dashed border-charcoal-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-surface-container-lowest group hover:border-primary transition-all cursor-pointer">
<div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-primary text-[32px]">upload_file</span>
</div>
<div className="text-center">
<p className="font-title-md text-title-md text-on-surface">Upload Business License</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">PDF, JPG, or PNG (Max 5MB)</p>
</div>
</div>
<div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-primary">info</span>
<div>
<p className="font-body-lg text-body-lg font-bold text-on-surface">Legal Compliance Policy</p>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                                By proceeding, you agree that your agency follows the Cameroonian Ministry of Transport safety guidelines. OPEP reserves the right to suspend accounts failing safety audits.
                                            </p>
</div>
</div>
</div>
<div className="flex items-center gap-3">
<input className="rounded bg-surface-container-lowest border-charcoal-border text-primary focus:ring-primary h-5 w-5" id="terms" type="checkbox"/>
<label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">I agree to the <a className="text-primary underline font-medium" href="#">Terms of Partnership</a> and Service Agreement.</label>
</div>
</div>
<button className="w-full bg-success-green text-on-primary font-title-md py-5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-success-green/20" onClick={() => setSuccessModal(true)} type="button">
                                Complete Registration
                                <span className="material-symbols-outlined">how_to_reg</span>
</button>
</div>
</form>

<div className="mt-8 flex flex-wrap justify-between items-center gap-6 opacity-80">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">verified</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">ENCRYPTED DATA PORTAL</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">support_agent</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">DEDICATED AGENCY SUPPORT</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">account_balance_wallet</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">SEAMLESS FCFA PAYOUTS</span>
</div>
</div>
</div>
</div>
</div>
</main>

<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-500" id="successModal">
<div className="glass-panel max-w-md w-full rounded-3xl p-10 text-center transform scale-90 transition-all duration-500 shadow-2xl">
<div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
<span className="material-symbols-outlined text-primary text-5xl" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Application Received!</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Your agency registration is being processed. Our team will contact you within 24-48 hours for document verification.</p>
<button className="w-full bg-primary text-on-primary font-title-md py-4 rounded-xl hover:opacity-90 shadow-md" onClick={() => setSuccessModal(false)}>Return to Portal</button>
</div>
</div>
    </div>
  );
}
