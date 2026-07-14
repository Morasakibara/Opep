'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { reportsApi } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    reportsApi.getDashboard()
      .then((data) => setReportData(data))
      .catch(() => setReportData(null))
      .finally(() => setLoading(false));
  }, []);

  const revenue = reportData?.totalRevenue || 4250000;
  const occupancy = reportData?.occupancyRate || 78;
  const cancelledTickets = reportData?.cancelledTickets || 12;
  const newClients = reportData?.newClients || 124;
  const revenueHistory = reportData?.revenueHistory || [40, 70, 45, 90, 65, 80, 50, 85, 40, 60, 75, 55];
  const routeDistribution = reportData?.routeDistribution || [
    { label: 'Yaoundé - Douala', value: '45%', width: '45%', color: 'bg-primary' },
    { label: 'Yaoundé - Bafoussam', value: '25%', width: '25%', color: 'bg-secondary' },
    { label: 'Douala - Kribi', value: '20%', width: '20%', color: 'bg-tertiary' },
    { label: 'Autres', value: '10%', width: '10%', color: 'bg-surface_container_highest' },
  ];

  const handleExport = async () => {
    try {
      const data = await reportsApi.getRevenue('latest');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `rapport_opep_${new Date().toISOString().split('T')[0]}.json`; a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Rapports & Statistiques</h2>
          <p className="text-on_surface_variant">Analysez les performances financières et opérationnelles.</p>
        </div>
        <button onClick={handleExport}
          className="bg-primary text-on_primary px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition shadow-lg shadow-primary/20">
          Exporter le rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom duration-500">
        {[
          { label: "Chiffre d'affaires", value: `${(revenue / 1000).toFixed(0)} 000 FCFA`, trend: '+15.2%', up: true, color: 'text-primary' },
          { label: "Taux d'occupation", value: `${occupancy}%`, trend: '+5.4%', up: true, color: 'text-success_green' },
          { label: 'Tickets annulés', value: `${cancelledTickets}`, trend: '-2.1%', up: true, color: 'text-secondary' },
          { label: 'Nouveaux clients', value: `${newClients}`, trend: '+12.8%', up: true, color: 'text-tertiary' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <p className="text-sm font-medium text-on_surface_variant mb-1">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${kpi.up ? 'bg-success_green/10 text-success_green' : 'bg-error_red/10 text-error_red'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700">
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-on_surface">Évolution des revenus</h3>
            <BarChart3 className="text-on_surface_variant" />
          </div>
          <div className="h-64 w-full bg-surface_container_low rounded-2xl flex items-end justify-between p-6 gap-2">
            {revenueHistory.map((h: number, i: number) => (
              <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-lg group relative" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface_container border border-charcoal_border text-on_surface text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {h * 10}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-on_surface_variant uppercase tracking-widest px-2">
            <span>Jan</span><span>Mar</span><span>Mai</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-on_surface">Répartition par trajet</h3>
            <BarChart3 className="text-on_surface_variant" />
          </div>
          <div className="space-y-6">
            {routeDistribution.map((route: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-on_surface_variant">{route.label}</span>
                  <span className="font-bold text-on_surface">{route.value}</span>
                </div>
                <div className="w-full h-2 bg-surface_container_highest rounded-full overflow-hidden">
                  <div className={`h-full ${route.color}`} style={{ width: route.width || route.value }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
