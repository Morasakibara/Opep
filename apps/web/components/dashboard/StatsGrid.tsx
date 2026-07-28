'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Banknote, Building2, Users2, ShieldCheck, Loader2 } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useStats';

interface StatsCardProps {
  title: string;
  value: string;
  subValue: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'tertiary' | 'success';
}

export function StatsCard({ title, value, subValue, trend, trendUp, icon, color }: StatsCardProps) {
  const colorMap = {
    primary: "bg-primary/10 text-primary group-hover:bg-primary/20",
    secondary: "bg-secondary/10 text-secondary group-hover:bg-secondary/20",
    tertiary: "bg-tertiary/10 text-tertiary group-hover:bg-tertiary/20",
    success: "bg-success_green/10 text-success_green group-hover:bg-success_green/20"
  };

  const accentMap = {
    primary: "bg-primary/5 group-hover:bg-primary/10",
    secondary: "bg-secondary/5 group-hover:bg-secondary/10",
    tertiary: "bg-tertiary/5 group-hover:bg-tertiary/10",
    success: "bg-success_green/5 group-hover:bg-success_green/10"
  };

  return (
    <div className="glass-card-hover p-6 rounded-xl relative overflow-hidden group active:scale-[0.98] transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl transition-all ${accentMap[color]}`}></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${colorMap[color]}`}>
          {icon}
        </div>
        <span className={`flex items-center gap-1 font-medium text-[14px] ${trendUp ? 'text-success_green' : 'text-secondary'}`}>
          {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trend}
        </span>
      </div>
      
      <div className="relative z-10">
        <p className="text-on_surface_variant text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-[28px] leading-tight font-bold text-on_surface">
          {value} <span className="text-[14px] font-normal text-on_surface_variant ml-1">{subValue}</span>
        </h3>
      </div>
    </div>
  );
}

export default function StatsGrid() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[160px] items-center justify-center">
        <div className="col-span-full flex justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Revenu Total"
        value={data?.revenue || '0'}
        subValue="FCFA"
        trend={data?.revenueTrend || '+12%'}
        trendUp={true}
        icon={<Banknote size={24} />}
        color="primary"
      />
      <StatsCard 
        title="Compagnies"
        value={data?.companies || data?.agencies || '0'}
        subValue="Actives"
        trend={data?.companiesTrend || data?.agenciesTrend || '3'}
        trendUp={true}
        icon={<Building2 size={24} />}
        color="tertiary"
      />
      <StatsCard 
        title="Utilisateurs"
        value={data?.users || '0'}
        subValue="Connectés"
        trend={data?.usersTrend || '+8%'}
        trendUp={true}
        icon={<Users2 size={24} />}
        color="secondary"
      />
      <StatsCard 
        title="Santé Système"
        value={data?.health || '98%'}
        subValue="Uptime"
        trend="Optimale"
        trendUp={true}
        icon={<ShieldCheck size={24} className="animate-pulse-soft" />}
        color="success"
      />
    </div>
  );
}
