'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/dashboard/MobileNav';
import PageTransition from '@/components/layout/PageTransition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on_primary font-bold text-2xl mx-auto mb-4 animate-pulse-soft shadow-lg shadow-primary/20">
            O
          </div>
          <p className="text-on_surface_variant font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col md:ml-[280px] w-full">
        {/* Header */}
        <Header title="Super Admin" placeholder="Rechercher..." />

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 custom-scrollbar">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
