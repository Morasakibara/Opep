'use client';

import React, { useState } from 'react';
import { useBuses, useCreateBus } from '@/hooks/useEntities';
import { Search, Plus } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';
import BusStats from '@/components/reproduction/fleet/BusStats';
import BusList from '@/components/reproduction/fleet/BusList';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTranslations } from 'next-intl';

/**
undefined
 * Secured with RBAC and Internationalized
 */
export default function GestionDeLaFlotteOpepAdminLightReproductionPage() {
  const t = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'AGENCY_ADMIN']}>
      <div className="min-h-screen bg-background text-on_surface overflow-x-hidden font-jakarta">
        <Sidebar />
        
        <main className="md:ml-[280px] min-h-screen flex flex-col">
          <Header title={t('nav.buses')} placeholder="Rechercher un véhicule..." />
          
          <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[32px] font-bold text-on_surface tracking-tight">{t('nav.buses')}</h2>
                <p className="text-on_surface_variant text-[16px] mt-1">Management of the interurban bus fleet.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary text-on_primary rounded-2xl font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                <Plus size={20} />
                {t('staff.add')} Bus
              </button>
            </div>

            {/* Stats Section */}
            <BusStats onAddClick={() => setIsAddModalOpen(true)} />

            {/* Main Content Section */}
            <BusList />
          </div>
        </main>

        <MobileNav />

        {/* Floating Action Button for Mobile */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on_primary rounded-full shadow-2xl flex items-center justify-center md:hidden z-40 active:scale-90 transition-transform"
        >
          <Plus size={32} />
        </button>
      </div>
    </ProtectedRoute>
  );
}
