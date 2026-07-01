'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    apiClient.getReports()
      .then((data) => setReportData(data))
      .catch(() => setReportData(null))
      .finally(() => setLoading(false));
  }, []);

  // Use API data or fallback static
  const revenue = reportData?.totalRevenue || 4250000;
  const occupancy = reportData?.occupancyRate || 78;
  const cancelledTickets = reportData?.cancelledTickets || 12;
  const newClients = reportData?.newClients || 124;
  const routeDistribution = reportData?.routeDistribution || [
    { label: 'Yaoundé - Douala', value: '45%', width: '45%', color: 'bg-blue-600' },
    { label: 'Yaoundé - Bafoussam', value: '25%', width: '25%', color: 'bg-purple-600' },
    { label: 'Douala - Kribi', value: '20%', width: '20%', color: 'bg-orange-500' },
    { label: 'Autres', value: '10%', width: '10%', color: 'bg-gray-400' },
  ];
  const revenueHistory = reportData?.revenueHistory || [40, 70, 45, 90, 65, 80, 50, 85, 40, 60, 75, 55];

  const handleExport = async () => {
    try {
      const data = await apiClient.getReports('latest');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_opep_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Export non disponible en mode démo
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Simulation Toast */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Rapports & Statistiques</h2>
          <p className="text-gray-500">Analysez les performances financières et opérationnelles de votre agence.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Exporter le rapport
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Chiffre d\'affaires', value: `${(revenue / 1000).toFixed(0)} 000 FCFA`, trend: '+15.2%', up: true },
          { label: 'Taux d\'occupation', value: `${occupancy}%`, trend: '+5.4%', up: true },
          { label: 'Tickets annulés', value: `${cancelledTickets}`, trend: '-2.1%', up: true },
          { label: 'Nouveaux clients', value: `${newClients}`, trend: '+12.8%', up: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-400 mb-1">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-xl font-black text-gray-900">{kpi.value}</p>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900">Évolution des revenus</h3>
            <BarChart3 className="text-gray-300" />
          </div>
          <div className="h-64 w-full bg-gray-50 rounded-2xl flex items-end justify-between p-6 space-x-2">
            {revenueHistory.map((h: number, i: number) => (
              <div key={i} className="flex-1 bg-blue-100 hover:bg-blue-600 transition-colors rounded-t-lg group relative" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                   {h * 10}k
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
            <span>Jan</span>
            <span>Mar</span>
            <span>Mai</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>

        {/* Routes Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900">Répartition par trajet</h3>
            <PieChartIcon className="text-gray-300" />
          </div>
          <div className="space-y-6">
            {routeDistribution.map((route: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-700">{route.label}</span>
                  <span className="font-black text-gray-900">{route.value}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
