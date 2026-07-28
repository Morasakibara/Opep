'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

const DEFAULT_AGENCIES = [
  {
    name: 'General Express',
    info: 'Yaoundé HQ • 12 Buses',
    status: 'Actif',
    statusColor: 'text-on_surface',
    subStatus: 'Vérifié',
  },
  {
    name: 'Touristique Express',
    info: 'Douala Base • 24 Buses',
    status: 'Actif',
    statusColor: 'text-on_surface',
    subStatus: 'Vérifié',
  },
  {
    name: 'Buca Voyage',
    info: 'Kribi Route • 8 Buses',
    status: 'En attente',
    statusColor: 'text-warning_yellow',
    subStatus: 'Revue',
  },
  {
    name: 'Global Travel',
    info: 'Bamenda • 15 Buses',
    status: 'Actif',
    statusColor: 'text-on_surface',
    subStatus: 'Vérifié',
  },
];

interface AgenciesListProps {
  agencies?: typeof DEFAULT_AGENCIES;
  loading?: boolean;
}

export default function AgenciesList({ agencies = DEFAULT_AGENCIES, loading = false }: AgenciesListProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-bold text-on_surface">Nouvelles Agences</h3>
        <button className="text-primary text-[14px] font-medium hover:underline flex items-center gap-1 active:scale-[0.92] transition-all">
          Voir tout <ExternalLink size={14} />
        </button>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
        {agencies.map((agency, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-3 rounded-xl bg-surface_container_low border border-charcoal_border hover:bg-surface_container_high hover:translate-x-0.5 transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="relative w-12 h-12 rounded-lg bg-surface_container_highest flex items-center justify-center p-1.5 shadow-inner">
              <div className="w-full h-full rounded flex items-center justify-center text-primary text-lg font-bold">
                {agency.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-on_surface group-hover:text-primary transition-colors">{agency.name}</p>
              <p className="text-[12px] text-on_surface_variant">{agency.info}</p>
            </div>
            <div className="text-right">
              <p className={`text-[14px] font-bold ${agency.statusColor}`}>{agency.status}</p>
              <p className="text-[10px] text-on_surface_variant uppercase tracking-wider">{agency.subStatus}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
