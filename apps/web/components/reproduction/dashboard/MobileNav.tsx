import React from 'react';
import { LayoutDashboard, Building2, Plus, Route, Settings } from 'lucide-react';

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface_container border-t border-charcoal_border flex items-center justify-around px-4 z-50">
      <a className="flex flex-col items-center gap-1 text-primary" href="#">
        <LayoutDashboard size={24} />
        <span className="text-[10px] font-bold">Dashboard</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-on_surface_variant hover:text-on_surface transition-colors" href="#">
        <Building2 size={24} />
        <span className="text-[10px]">Agencies</span>
      </a>
      
      <div className="relative">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -translate-y-6 shadow-lg shadow-primary/30 text-on_primary border-4 border-[#111316] active:scale-95 transition-transform cursor-pointer">
          <Plus size={24} />
        </div>
      </div>

      <a className="flex flex-col items-center gap-1 text-on_surface_variant hover:text-on_surface transition-colors" href="#">
        <Route size={24} />
        <span className="text-[10px]">Trips</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-on_surface_variant hover:text-on_surface transition-colors" href="#">
        <Settings size={24} />
        <span className="text-[10px]">Settings</span>
      </a>
    </nav>
  );
}
