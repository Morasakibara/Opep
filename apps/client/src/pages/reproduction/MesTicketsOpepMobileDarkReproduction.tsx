import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../../lib/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApiError from '../../components/ApiError';
import { ApiTicket } from '../../lib/apiTypes';

/**
undefined
 * Original Screen: mes-tickets-opep-mobile-dark
 */
export default function MesTicketsOpepMobileDarkReproduction() {
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  useEffect(() => {
    ticketsApi.getMyTickets().then(data => { setTickets(data); setIsLoading(false); }).catch(err => { setApiError(err.message || 'Erreur de connexion'); setIsLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      {isLoading && <LoadingSpinner text="Chargement..." />}
      {!isLoading && !apiError && tickets.length === 0 && <div className="flex items-center justify-center p-12"><p className="text-on_surface_variant text-sm">Aucun ticket trouvé</p></div>}
      {!isLoading && !apiError && tickets.length > 0 && <p className="mx-4 mt-4 text-primary text-sm font-bold">{tickets.length} ticket(s) actif(s)</p>}
      {apiError && <ApiError message={apiError} />}

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
      
    </div>
  );
}
