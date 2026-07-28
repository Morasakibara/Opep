'use client';

import React from 'react';
import { Bus as BusIcon, X, Wrench } from 'lucide-react';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

interface BusHistoryModalProps {
  isOpen: boolean;
  busId: string;
  busModel: string;
  onClose: () => void;
}

const historyEntries = [
  { date: '15/06/2026', event: 'Révision générale', type: 'maintenance' as const, detail: 'Vidange + Freins + Pneus' },
  { date: '01/06/2026', event: 'Trajet Yaoundé - Douala', type: 'trip' as const, detail: '45 passagers, 5h de trajet' },
  { date: '28/05/2026', event: 'Changement batterie', type: 'maintenance' as const, detail: 'Batterie 12V 200Ah' },
];

export default function BusHistoryModal({ isOpen, busId, busModel, onClose }: BusHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <AnimatedMount animation="zoom-in" className="glass-card rounded-3xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
          <h3 className="text-xl font-bold text-on_surface">Historique - {busId}</h3>
          <button onClick={onClose} className="text-on_surface_variant hover:text-primary"><X size={24} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><BusIcon size={24} /></div>
            <div><p className="text-lg font-bold text-on_surface">{busModel}</p><p className="text-sm text-on_surface_variant">{busId}</p></div>
          </div>
          <div className="space-y-4">
            {historyEntries.map((entry, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-surface_container_low rounded-xl">
                <div className={`p-2 rounded-lg ${entry.type === 'maintenance' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                  {entry.type === 'maintenance' ? <Wrench size={16} /> : <BusIcon size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-on_surface">{entry.event}</p>
                    <span className="text-[10px] text-on_surface_variant font-bold">{entry.date}</span>
                  </div>
                  <p className="text-xs text-on_surface_variant mt-1">{entry.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 bg-surface_container_low border-t border-charcoal_border">
          <button onClick={onClose} className="w-full bg-primary text-on_primary py-3 rounded-2xl font-bold hover:brightness-110 transition">Fermer</button>
        </div>
      </AnimatedMount>
    </div>
  );
}
