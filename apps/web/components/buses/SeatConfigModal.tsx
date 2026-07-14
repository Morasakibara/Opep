'use client';

import React, { useState } from 'react';
import { X, User } from 'lucide-react';

interface SeatConfigModalProps {
  isOpen: boolean;
  busId: string;
  seatCapacity: number;
  onClose: () => void;
}

export default function SeatConfigModal({ isOpen, busId, seatCapacity, onClose }: SeatConfigModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const toggleSeat = (index: number) => {
    setSelectedSeats(prev => prev.includes(index) ? prev.filter(s => s !== index) : [...prev, index]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="glass-card rounded-3xl w-full max-w-4xl overflow-hidden animate-in zoom-in h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-on_surface">Configuration des sièges - {busId}</h3>
            <p className="text-sm text-on_surface_variant">Cliquez sur un siège pour le marquer comme VIP.</p>
          </div>
          <button onClick={onClose} className="text-on_surface_variant hover:text-primary"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-surface_container_low flex flex-col items-center">
          <div className="mb-6 flex gap-8 bg-surface_container p-4 rounded-2xl border border-charcoal_border">
            <div className="text-center"><p className="text-[10px] text-on_surface_variant font-black uppercase">Capacité</p><p className="text-xl font-black text-on_surface">{seatCapacity}</p></div>
            <div className="text-center"><p className="text-[10px] text-on_surface_variant font-black uppercase">VIP</p><p className="text-xl font-black text-secondary">{selectedSeats.length}</p></div>
          </div>
          <div className="w-64 bg-surface_container border border-charcoal_border rounded-[3rem] p-8 shadow-inner relative">
            <div className="flex justify-end mb-8">
              <div className="w-10 h-10 bg-surface_container_high rounded-lg flex items-center justify-center text-on_surface_variant border-2 border-dashed border-charcoal_border">
                <User size={18} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: seatCapacity }).map((_, i) => {
                const isVip = selectedSeats.includes(i);
                return (
                  <React.Fragment key={i}>
                    {i % 4 === 2 && <div className="w-4"></div>}
                    <button onClick={() => toggleSeat(i)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all active:scale-95 ${
                        isVip ? 'bg-secondary text-on_secondary border-b-4 border-secondary_container shadow-lg' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                      }`}>
                      {i + 1}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-charcoal_border bg-surface_container flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary/20 border border-primary/40 rounded"></div><span className="text-[10px] font-bold text-on_surface_variant uppercase">Standard</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-secondary rounded"></div><span className="text-[10px] font-bold text-on_surface_variant uppercase">VIP</span></div>
          </div>
          <button onClick={onClose}
            className="bg-primary text-on_primary px-8 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-lg">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
