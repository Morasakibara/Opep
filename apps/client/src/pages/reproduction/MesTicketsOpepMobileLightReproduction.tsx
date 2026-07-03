import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTicket } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: mes-tickets-opep-mobile-light
 */
export default function MesTicketsOpepMobileLightReproduction() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
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
      {!isLoading && !apiError && tickets.length === 0 && <div className="flex items-center justify-center p-12"><p className="text-on_surface_variant text-sm">Aucun ticket trouvé</p></div>}
      {!isLoading && !apiError && tickets.length > 0 && <p className="mx-4 mt-4 text-primary text-sm font-bold">{tickets.length} ticket(s) actif(s)</p>}
      {!isLoading && !apiError && tickets.length > 0 && tickets.map((t, i) => (
      <div key={i} className="glass-panel inner-glow rounded-[24px] p-5 mx-4 mt-3 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">{t.status || 'ACTIF'}</span>
            <h3 className="font-title-md text-title-md text-on-surface">{(t.trip?.route?.departureCity || 'Départ') + ' → ' + (t.trip?.route?.arrivalCity || 'Arrivée')}</h3>
          </div>
          <div className="text-right">
            <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary">{t.totalAmount || 0} <span className="text-[14px] opacity-70">FCFA</span></p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant text-xs pt-2 border-t border-white/5">
          <span>#{t.reservationCode || 'N/A'}</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</span>
        </div>
      </div>
    ))}
      {/* SECTION: Mockup Layout */}
      {/* Header Navigation (TopAppBar Prediction) */}
<header className="flex justify-between items-center px-container-padding w-full pt-4 sticky top-0 z-50 bg-surface/80 backdrop-blur-md">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALcO9hBAc1jv-C_6LSxxT3GnYlSFq9zc2Kyy9q4T0YKIlP-sGNE18vWzEJ6CfSVCFXZ_TUe-DQzrcJs_BWDLJ_F-o8XMSj7F6R1NKbL10DU4ufVnJbjBbEfUdxWO-UL0AqJNYHJKDsIgqLKr7P-OHEUXYEQ5Pr7T3utryJik8UZNOsXI8z1PlzVQoMYlXLS4Ws5mxNBW0atpQYaJpE6ir7faHDxK11zo8LhsHAEoVY9RvpV01Z2Iku8E5TLPgCyjjK_3eHa5Ot4b4"  />
</div>
<div className="flex flex-col">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Active Ticket</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant">Museum of Civilizations</p>
</div>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-primary hover:opacity-80 transition-opacity active:scale-95">
<span className="material-symbols-outlined">notifications</span>
</button>
</header>
<main className="px-container-padding pt-6 pb-32">
{/* Ticket Container */}
<div className="ticket-cutout glass-card rounded-[32px] overflow-hidden inner-glow relative">
{/* Event Hero Image */}
<div className="relative h-48 w-full">
<img loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuKiJcEEWK_RvNSkYkt9Ch47onUKqB0bgvXkj9L3IUv834lmYcTfaRbAKoADJnLcDQq5UjmpdRmPW5irb3HtXrW6peuDv2ZZXR-0gOowQD5vhDTXfRDuYOw2jZrb8BY8DzGG9R87li2YlSIyPa7C6mTFnuzC-_2doU1tnOq7XqXTLr65TrOCG7FZniYjise8cwwjYakuF6v80TgrUFnapsBWUKevnVHTyh8ltFo7GOcga22w2jNjlkzMo4vQQ5R2QKrghXkr0LkdE"  />
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-4 left-6">
<span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm mb-2 inline-block">PREMIUM ACCESS</span>
<h2 className="text-white font-title-md text-title-md">Traditional Arts Exhibition</h2>
</div>
</div>
{/* Ticket Details */}
<div className="p-6 pb-40">
<div className="grid grid-cols-2 gap-y-6">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Date</p>
<p className="font-title-md text-title-md text-on-surface">Oct 24, 2024</p>
</div>
<div className="text-right">
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Time</p>
<p className="font-title-md text-title-md text-on-surface">10:30 AM</p>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Gate</p>
<p className="font-title-md text-title-md text-on-surface">North Wing</p>
</div>
<div className="text-right">
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Seat</p>
<p className="font-title-md text-title-md text-on-surface">General</p>
</div>
</div>
<div className="mt-8 pt-6 border-t border-outline-variant/30">
<div className="flex justify-between items-center mb-4">
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pass Holder</p>
<p className="font-body-lg text-body-lg font-semibold">Samuel Eto'o</p>
</div>
<div className="flex justify-between items-center">
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Order ID</p>
<p className="font-body-md text-body-md font-mono text-primary">#CM-8829-01X</p>
</div>
</div>
</div>
{/* Perforation line */}
<div className="ticket-dash"></div>
{/* QR Section (High Contrast Area) */}
<div className="absolute bottom-0 left-0 right-0 h-[140px] bg-white flex flex-col items-center justify-center">
<div className="w-24 h-24 bg-white p-2 border-2 border-primary/20 rounded-xl flex items-center justify-center">
{/* High-contrast QR Simulation */}
<div className="w-full h-full bg-on-surface" style={{"maskSize":"contain","WebkitMaskSize":"contain"}}></div>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-2 tracking-widest">SCAN AT ENTRANCE</p>
</div>
</div>
{/* Secondary Actions */}
<div className="mt-8 space-y-4">
<button className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-body-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
<span className="material-symbols-outlined">download</span>
                Save to Wallet
            </button>
<div className="flex gap-4">
<button className="flex-1 py-3 rounded-2xl glass-card flex items-center justify-center gap-2 text-on-surface font-semibold text-body-md border border-outline-variant active:scale-[0.98] transition-transform">
<span className="material-symbols-outlined">share</span>
                    Share
                </button>
<button className="flex-1 py-3 rounded-2xl glass-card flex items-center justify-center gap-2 text-secondary font-semibold text-body-md border border-secondary/20 active:scale-[0.98] transition-transform">
<span className="material-symbols-outlined">cancel</span>
                    Refund
                </button>
</div>
</div>
</main>
{/* Navigation Bar (BottomNavBar Prediction) */}
<nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8">
<div className="fixed bottom-4 left-4 right-4 rounded-full backdrop-blur-lg bg-surface-container/45 border border-white/10 shadow-[0_0_40px_rgba(0,122,94,0.1)] flex justify-around items-center h-16">
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">home</span>
<span className="font-label-sm text-label-sm">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">search</span>
<span className="font-label-sm text-label-sm">Search</span>
</a>
<a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(0,122,94,0.4)] active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>confirmation_number</span>
<span className="font-label-sm text-label-sm">Tickets</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200 ease-out" href="#">
<span className="material-symbols-outlined">person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</a>
</div>
</nav>
    </div>
  );
}
