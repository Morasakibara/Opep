import React from 'react';
import { Banknote, Receipt, Map as MapIcon } from 'lucide-react';

const CATEGORIES = [
  { id: 'financial', name: 'Financial Summary', sub: 'XAF/FCFA Transactions', icon: <Banknote size={32} />, active: true },
  { id: 'passenger', name: 'Passenger Manifests', sub: 'Travelers & Verification', icon: <Receipt size={32} /> },
  { id: 'route', name: 'Route Performance', sub: 'Efficiency & Revenue', icon: <MapIcon size={32} /> },
];

export default function CategorySelector() {
  return (
    <div className="col-span-2">
      <label className="block text-[12px] font-bold text-on_surface_variant uppercase tracking-widest mb-4">Select Report Category</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat.id}
            className={`group p-6 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] active:scale-95 ${
              cat.active 
                ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10' 
                : 'border-charcoal_border bg-surface_container_low text-on_surface_variant hover:border-primary/50'
            }`}
          >
            <div className={`${cat.active ? 'text-primary' : 'text-on_surface_variant group-hover:text-primary'} transition-colors`}>
              {cat.icon}
            </div>
            <div>
              <div className={`font-bold ${cat.active ? 'text-on_surface' : 'text-on_surface_variant group-hover:text-on_surface'}`}>{cat.name}</div>
              <div className="text-[11px] opacity-70">{cat.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
