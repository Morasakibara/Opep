import React from 'react';
import { Plus } from 'lucide-react';

export default function ActionFab() {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full shadow-2xl flex items-center justify-center text-on_primary hover:scale-110 active:scale-95 transition-all group z-50">
      <Plus size={32} className="transition-transform group-hover:rotate-90" />
      <div className="absolute right-16 bg-surface_container_highest px-4 py-2 rounded-lg text-[14px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-charcoal_border text-on_surface shadow-xl">
        Create New Trip
      </div>
    </button>
  );
}
