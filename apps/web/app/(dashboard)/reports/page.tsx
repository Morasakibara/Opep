'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar as CalendarIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  TrendingUp,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [period, setPeriod] = useState('Juin 2024');

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  const periods = ['Mai 2024', 'Juin 2024', 'Juillet 2024 (Prévision)'];

  return (
    <div className="space-y-8 relative">
      {/* Simulation Toast */}
      {showToast && (
        <div className="fixed top-8 right-8 z-[100] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 p-1 rounded-full">
            <CheckCircle2 size={16} />
          </div>
          <p className="text-sm font-bold">Rapport exporté avec succès (Simulation)</p>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Rapports & Statistiques</h2>
          <p className="text-gray-500">Analysez les performances financières et opérationnelles de votre agence.</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex items-center bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition outline-none"
          >
            {periods.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Exporter le rapport
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Chiffre d\'affaires', value: period === 'Mai 2024' ? '3,850,000 FCFA' : '4,250,000 FCFA', trend: '+15.2%', up: true },
          { label: 'Taux d\'occupation', value: '78%', trend: '+5.4%', up: true },
          { label: 'Tickets annulés', value: '12', trend: '-2.1%', up: true },
          { label: 'Nouveaux clients', value: '124', trend: '+12.8%', up: true },
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
            {[40, 70, 45, 90, 65, 80, 50, 85, 40, 60, 75, 55].map((h, i) => (
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
            {[
              { label: 'Yaoundé - Douala', value: '45%', color: 'bg-blue-600' },
              { label: 'Yaoundé - Bafoussam', value: '25%', color: 'bg-purple-600' },
              { label: 'Douala - Kribi', value: '20%', color: 'bg-orange-500' },
              { label: 'Autres', value: '10%', color: 'bg-gray-400' },
            ].map((route, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-700">{route.label}</span>
                  <span className="font-black text-gray-900">{route.value}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${route.color}`} style={{ width: route.value }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
