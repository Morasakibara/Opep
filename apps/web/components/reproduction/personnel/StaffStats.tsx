import React from 'react';
import { Users, Banknote, ShieldCheck, Truck } from 'lucide-react';

export default function StaffStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        icon={<Users size={20} />} 
        label="Total Staff" 
        value="124" 
        trend="+4%" 
        color="primary" 
      />
      <StatCard 
        icon={<Banknote size={20} />} 
        label="Caissiers" 
        value="32" 
        color="tertiary" 
      />
      <StatCard 
        icon={<ShieldCheck size={20} />} 
        label="Contrôleurs" 
        value="45" 
        color="secondary" 
      />
      <StatCard 
        icon={<Truck size={20} />} 
        label="Chauffeurs" 
        value="47" 
        color="primary" 
      />
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  trend?: string; 
  color: 'primary' | 'secondary' | 'tertiary';
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
  };

  return (
    <div className="bg-surface_container_lowest border border-charcoal_border p-5 rounded-xl shadow-sm transition-all hover:border-primary/30">
      <div className="flex justify-between items-start mb-4">
        <span className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</span>
        {trend && <span className="text-success_green font-bold text-[12px]">{trend}</span>}
      </div>
      <p className="text-on_surface_variant text-[10px] font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-[28px] font-bold text-on_surface mt-1">{value}</h3>
    </div>
  );
}
