'use client';

import React, { useState } from 'react';
import { useDrivers } from '@/hooks/useEntities';
import { UserPlus } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StaffStats from '@/components/reproduction/personnel/StaffStats';
import StaffTable from '@/components/reproduction/personnel/StaffTable';
import StaffAllocation from '@/components/reproduction/personnel/StaffAllocation';
import InternalNotes from '@/components/reproduction/personnel/InternalNotes';
import AddStaffModal from '@/components/reproduction/personnel/AddStaffModal';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';

/**
undefined
 * Integrated with Modular Components and Lucide Icons
 */
export default function GestionDuPersonnelOpepAdminLightReproductionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden font-jakarta">
      <Sidebar />
      
      <main className="md:ml-[280px] min-h-screen flex flex-col relative">
        <Header placeholder="Rechercher un employé..." />
        
        <div className="p-8 space-y-8 flex-1">
          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-[32px] font-bold text-on_surface tracking-tight">Gestion du Personnel</h2>
              <p className="text-on_surface_variant text-[16px] mt-1">Supervisez et gérez les rôles de votre agence de transport.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-on_primary px-6 py-3 rounded-lg flex items-center gap-2 font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <UserPlus size={20} />
              Ajouter un Employé
            </button>
          </div>

          {/* Stats Section */}
          <StaffStats />

          {/* Table Section */}
          <StaffTable />

          {/* Analysis and Notes Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
            <StaffAllocation />
            <InternalNotes />
          </div>
        </div>
      </main>

      <AddStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <MobileNav />
    </div>
  );
}
