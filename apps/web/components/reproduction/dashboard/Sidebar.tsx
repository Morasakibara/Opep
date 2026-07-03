import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Route, 
  Bus, 
  Users, 
  BarChart3, 
  Plus, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface_dim border-r border-charcoal_border flex flex-col p-6 gap-6 z-50 hidden md:flex">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on_primary">
          <Bus size={24} />
        </div>
        <div>
          <h1 className="text-primary text-[20px] leading-tight font-bold">OPEP Admin</h1>
          <p className="text-[12px] text-on_surface_variant uppercase tracking-wider">Management Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <NavItem icon={<Building2 size={20} />} label="Agencies" />
        <NavItem icon={<Route size={20} />} label="Trips" />
        <NavItem icon={<Bus size={20} />} label="Buses" />
        <NavItem icon={<Users size={20} />} label="Staff" />
        <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
      </nav>

      <div className="mt-auto space-y-1">
        <button className="w-full mb-6 py-3 px-4 bg-primary text-on_primary font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/10">
          <Plus size={20} />
          New Trip
        </button>
        
        <NavItem icon={<HelpCircle size={20} />} label="Help Center" />
        <NavItem icon={<LogOut size={20} />} label="Logout" className="text-on_secondary_fixed_variant hover:bg-secondary_container/20" />
      </div>
    </aside>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  className = "",
  href = "#"
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  className?: string;
  href?: string;
}) {
  return (
    <a 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95 ${
        active 
          ? "bg-primary_container text-on_primary_container" 
          : `text-on_surface_variant hover:bg-surface_container_high hover:text-on_surface ${className}`
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </a>
  );
}
