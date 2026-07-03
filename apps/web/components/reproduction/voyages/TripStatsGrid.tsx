import React from 'react';

export default function TripStatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="glass-card p-6 rounded-xl flex flex-col justify-between border border-charcoal_border bg-surface_container/50">
        <span className="text-on_surface_variant text-[12px] font-bold uppercase tracking-wider">Scheduled Today</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold text-on_surface">24</span>
          <span className="text-success_green text-xs font-medium">+3 since 6AM</span>
        </div>
      </div>
      <div className="glass-card p-6 rounded-xl flex flex-col justify-between border-l-4 border-l-warning_yellow border-y border-r border-charcoal_border bg-surface_container/50">
        <span className="text-on_surface_variant text-[12px] font-bold uppercase tracking-wider">Currently Boarding</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold text-on_surface">06</span>
          <span className="text-on_surface_variant text-xs">At Terminal 1 & 3</span>
        </div>
      </div>
      <div className="glass-card p-6 rounded-xl flex flex-col justify-between border border-charcoal_border bg-surface_container/50">
        <span className="text-on_surface_variant text-[12px] font-bold uppercase tracking-wider">Total Revenue</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold text-on_surface">1.2M</span>
          <span className="text-on_surface_variant text-xs">FCFA</span>
        </div>
      </div>
      <div className="glass-card p-6 rounded-xl flex flex-col justify-between border border-charcoal_border bg-surface_container/50">
        <span className="text-on_surface_variant text-[12px] font-bold uppercase tracking-wider">Network Occupancy</span>
        <div className="flex items-baseline gap-2 mt-2 w-full">
          <span className="text-3xl font-bold text-on_surface">82%</span>
          <div className="flex-1 h-1.5 bg-charcoal_border rounded-full overflow-hidden self-center ml-4">
            <div className="bg-primary h-full w-[82%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
