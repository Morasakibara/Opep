'use client';

import React, { useState } from 'react';
import { useAvailableTrips } from '@/hooks/useTrips';
import { useAgencies, useBuses } from '@/hooks/useEntities';
import { Download, RefreshCw, Plus } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StatsGrid from '@/components/reproduction/dashboard/StatsGrid';
import RevenueChart from '@/components/reproduction/dashboard/RevenueChart';
import AgenciesList from '@/components/reproduction/dashboard/AgenciesList';
import TransactionsTable from '@/components/reproduction/dashboard/TransactionsTable';
import RegionalActivity from '@/components/reproduction/dashboard/RegionalActivity';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTranslation } from '@/context/LanguageContext';

/**
undefined
 * Secured with RBAC and Internationalized
 */
export default function OpepSuperAdminDashboardReproductionPage() {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useTranslation();

  return (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden font-jakarta">
        <Sidebar />
        
        <main className="md:ml-[280px] min-h-screen flex flex-col">
          <Header />
          
          <div className="p-8 space-y-8 flex-1">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-[32px] font-bold text-on_surface tracking-tight">{t('nav.dashboard')}</h2>
                <p className="text-on_surface_variant text-[16px]">Sovereign oversight of Cameroon's interurban transport network.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 bg-surface_container_high text-on_surface border border-charcoal_border rounded-lg flex items-center gap-2 hover:bg-surface_container_highest transition-all text-[14px] font-medium active:scale-95">
                  <Download size={18} />
                  {t('common.save')} Report
                </button>
                <button className="px-4 py-2.5 bg-primary text-on_primary rounded-lg flex items-center gap-2 hover:brightness-110 transition-all text-[14px] font-bold active:scale-95 shadow-lg shadow-primary/20">
                  <RefreshCw size={18} />
                  Sync Data
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <StatsGrid />

            {/* Charts and Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <RevenueChart />
              <AgenciesList />
            </div>

            {/* Detailed Data Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
              <TransactionsTable />
              <RegionalActivity />
            </div>
          </div>
        </main>

        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}
