import React from 'react';

const ALLOCATIONS = [
  { label: 'Service Client / Caisse', used: 32, total: 40, color: 'bg-primary' },
  { label: 'Logistique / Chauffeurs', used: 47, total: 50, color: 'bg-tertiary' },
  { label: 'Sécurité / Contrôle', used: 45, total: 60, color: 'bg-secondary' },
];

export default function StaffAllocation() {
  return (
    <div className="lg:col-span-2 bg-surface_container_lowest border border-charcoal_border p-6 rounded-xl flex flex-col gap-6 shadow-sm">
      <h4 className="text-[18px] font-bold text-on_surface">Répartition des Services</h4>
      <div className="flex flex-col gap-6">
        {ALLOCATIONS.map((alloc, index) => (
          <div key={index} className="space-y-2 group">
            <div className="flex justify-between items-end">
              <span className="text-[14px] font-bold text-on_surface group-hover:text-primary transition-colors">{alloc.label}</span>
              <span className="text-[12px] text-on_surface_variant">{alloc.used}/{alloc.total} Slots</span>
            </div>
            <div className="w-full bg-surface_container h-2.5 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`${alloc.color} h-full rounded-full transition-all duration-1000`} 
                style={{ width: `${(alloc.used / alloc.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
