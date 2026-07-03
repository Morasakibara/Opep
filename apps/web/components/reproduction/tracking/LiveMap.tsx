import React from 'react';
import { MapPin, Navigation, Signal, Zap } from 'lucide-react';

export default function LiveMap() {
  return (
    <div className="relative w-full h-[600px] bg-surface_dim rounded-[32px] border-2 border-charcoal_border overflow-hidden shadow-2xl">
      {/* Mock Map Background - Styled SVG or Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Content Overlay */}
      <div className="absolute inset-0 p-8">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <div className="bg-surface_container/90 backdrop-blur-md border border-charcoal_border p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                <Signal size={20} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-on_surface_variant uppercase tracking-widest">Signal GPS</p>
                <p className="text-[14px] font-bold text-on_surface">42 BUS CONNECTÉS</p>
              </div>
            </div>
            
            <div className="bg-surface_container/90 backdrop-blur-md border border-charcoal_border p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success_green/20 flex items-center justify-center text-success_green">
                <Navigation size={20} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-on_surface_variant uppercase tracking-widest">Trajets Actifs</p>
                <p className="text-[14px] font-bold text-on_surface">18 EN COURS</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <button className="bg-primary text-on_primary p-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-all active:scale-95">
              <Zap size={24} />
            </button>
          </div>
        </div>

        {/* Mock Bus Markers */}
        <BusMarker x="30%" y="40%" id="LT 492 CA" status="Moving" label="DLA -> YDE" />
        <BusMarker x="60%" y="25%" id="CE 881 AB" status="Moving" label="YDE -> BAF" />
        <BusMarker x="45%" y="70%" id="LT 503 EF" status="Stopped" label="DLA -> KRI" />
      </div>

      {/* Legend / Status Overlay */}
      <div className="absolute bottom-8 left-8 bg-surface_container_lowest/90 backdrop-blur-md border border-charcoal_border p-4 rounded-2xl shadow-2xl flex gap-6 items-center">
        <LegendItem color="bg-primary" label="En mouvement" />
        <LegendItem color="bg-warning_yellow" label="À l'arrêt" />
        <LegendItem color="bg-error_red" label="Incident" />
      </div>
    </div>
  );
}

function BusMarker({ x, y, id, status, label }: any) {
  return (
    <div 
      className="absolute flex flex-col items-center gap-2 group cursor-pointer"
      style={{ left: x, top: y }}
    >
      <div className="relative">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 border-2 border-surface_container_lowest ${
          status === 'Moving' ? 'bg-primary text-on_primary' : 'bg-warning_yellow text-on_surface'
        }`}>
          <Navigation size={18} className={status === 'Moving' ? 'rotate-45 animate-bounce' : ''} />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success_green rounded-full border-2 border-surface_container_lowest animate-pulse"></div>
      </div>
      <div className="bg-surface_container_lowest/95 backdrop-blur-sm border border-charcoal_border p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <p className="text-[11px] font-bold text-on_surface">{id}</p>
        <p className="text-[9px] text-on_surface_variant uppercase font-bold tracking-widest">{label}</p>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-[11px] font-bold text-on_surface_variant uppercase tracking-widest">{label}</span>
    </div>
  );
}
