import React from 'react';
import { Bus, TrendingUp, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function BusStats({ onAddClick }: { onAddClick: () => void }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        label="Total Véhicules" 
        value="42" 
        trend="+3 ce mois" 
        trendIcon={<TrendingUp size={16} />}
        icon={<Bus size={40} />}
      />
      <StatCard 
        label="En Service" 
        value="38" 
        progress={90}
        progressColor="bg-success_green"
        valueColor="text-success_green"
      />
      <StatCard 
        label="Maintenance" 
        value="4" 
        subtext="2 prévus demain"
        subIcon={<Clock size={16} />}
        valueColor="text-warning_yellow"
      />
      
      <div className="bg-primary p-6 rounded-2xl flex flex-col justify-between items-start transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xl shadow-primary/20 group">
        <div>
          <h3 className="text-[18px] font-bold text-on_primary">Nouveau Véhicule</h3>
          <p className="text-on_primary/80 text-[12px] mt-1">Ajouter un bus à la flotte</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-white text-primary hover:bg-white/90 rounded-full mt-4"
          leftIcon={<Plus size={18} />}
          onClick={onAddClick}
        >
          AJOUTER
        </Button>
      </div>
    </section>
  );
}

function StatCard({ label, value, trend, trendIcon, progress, progressColor, subtext, subIcon, icon, valueColor = "text-on_surface" }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group border border-charcoal_border bg-surface_container/50">
      {icon && (
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-on_surface">
          {icon}
        </div>
      )}
      <span className="text-on_surface_variant text-[12px] font-bold uppercase tracking-widest">{label}</span>
      <span className={`text-4xl font-bold ${valueColor}`}>{value}</span>
      
      {trend && (
        <div className="flex items-center text-success_green text-[11px] font-bold mt-2">
          {trendIcon && <span className="mr-1">{trendIcon}</span>}
          {trend}
        </div>
      )}

      {progress !== undefined && (
        <div className="w-full bg-surface_container_high h-1.5 rounded-full mt-4 overflow-hidden">
          <div className={`${progressColor} h-full rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {subtext && (
        <div className="flex items-center text-on_surface_variant text-[11px] font-bold mt-2">
          {subIcon && <span className="mr-1">{subIcon}</span>}
          {subtext}
        </div>
      )}
    </div>
  );
}
