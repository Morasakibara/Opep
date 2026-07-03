'use client';

import React, { useState } from 'react';
import { useTrips, useCreateTrip } from '@/hooks/useTrips';
import { Plus, Search, Calendar, Filter } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TripList from '@/components/reproduction/trips/TripList';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTranslation } from '@/context/LanguageContext';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';

export default function GestionDesVoyagesOpepLightReproductionPage() {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useTranslation();

  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'AGENCY_ADMIN', 'CONTROLLER']}>
      <div className="min-h-screen bg-background text-on_surface overflow-x-hidden font-jakarta">
        <Sidebar />
        
        <main className="md:ml-[280px] min-h-screen flex flex-col">
          <Header title={t('nav.trips')} placeholder="Rechercher un voyage, un ticket..." />
          
          <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Calendar size={18} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Planning du 02 Juillet 2026</span>
                </div>
                <h2 className="text-[32px] font-bold text-on_surface tracking-tight">{t('nav.trips')}</h2>
                <p className="text-on_surface_variant text-[16px] mt-1">Gestion centralisée des départs et arrivées du réseau OPEP.</p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-2xl border-charcoal_border" leftIcon={<Filter size={18} />}>
                  Filtres
                </Button>
                <Button className="rounded-2xl shadow-xl shadow-primary/20" leftIcon={<Plus size={18} />}>
                  Planifier un voyage
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard title="Départs prévus" value="12" subtext="8 confirmés" color="primary" />
              <SummaryCard title="Passagers du jour" value="428" subtext="+12% vs hier" color="tertiary" />
              <SummaryCard title="Taux d'occupation" value="86%" subtext="Optimisation élevée" color="success_green" />
              <SummaryCard title="Alertes Retards" value="0" subtext="Tous les départs OK" color="on_surface_variant" />
            </div>

            {/* Main Content */}
            <TripList />
          </div>
        </main>

        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}

function SummaryCard({ title, value, subtext, color }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-charcoal_border bg-surface_container/30">
      <h4 className="text-[11px] font-bold text-on_surface_variant uppercase tracking-widest mb-2">{title}</h4>
      <div className={`text-3xl font-bold text-on_surface tracking-tight mb-2`}>{value}</div>
      <p className="text-[12px] text-on_surface_variant font-medium flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full bg-${color}`} />
        {subtext}
      </p>
    </div>
  );
}
