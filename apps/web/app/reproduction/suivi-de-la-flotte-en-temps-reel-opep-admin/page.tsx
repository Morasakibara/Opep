'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useBuses } from '@/hooks/useEntities';
import { Activity, ShieldCheck, Map, Search, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LiveMap from '@/components/reproduction/tracking/LiveMap';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';

export default function SuiviDeLaFlotteEnTempsReelOpepAdminReproductionPage() {

  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'AGENCY_ADMIN']}>
      <div className="min-h-screen bg-background text-on_surface overflow-x-hidden font-jakarta">
        <Sidebar />
        
        <main className="md:ml-[280px] min-h-screen flex flex-col">
          <Header title="Live Fleet Tracking" placeholder="Search bus, route, or driver..." />
          
          <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Activity size={18} className="animate-pulse" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Flux en temps réel</span>
                </div>
                <h2 className="text-[32px] font-bold text-on_surface tracking-tight">Suivi de la Flotte</h2>
                <p className="text-on_surface_variant text-[16px] mt-1">Supervision souveraine des mouvements du réseau interurbain.</p>
              </div>

              <div className="flex items-center gap-4 bg-surface_container p-2 rounded-2xl border border-charcoal_border">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="relative w-10 h-10 rounded-full border-4 border-surface_container bg-surface_container_high overflow-hidden">
                      <Image fill src={`https://i.pravatar.cc/150?u=${i}`} alt="Controller" />
                    </div>
                  ))}
                </div>
                <p className="text-[12px] font-bold text-on_surface_variant pr-4">4 Contrôleurs actifs</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Map Section */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <LiveMap />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <TrackingMetric icon={<ShieldCheck className="text-success_green" />} label="Sécurité" value="100%" sub="Aucun incident" />
                  <TrackingMetric icon={<Map className="text-primary" />} label="Couverture" value="94%" sub="Réseau National" />
                  <TrackingMetric icon={<AlertCircle className="text-warning_yellow" />} label="Latence" value="240ms" sub="Signal Satellite" />
                </div>
              </div>

              {/* Sidebar Info Section */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <section className="glass-card rounded-[32px] p-8 border border-charcoal_border bg-surface_container/50 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[20px] font-bold text-on_surface">Activité Récente</h3>
                    <button className="text-primary hover:underline text-[12px] font-bold uppercase tracking-widest">Voir tout</button>
                  </div>

                  <div className="space-y-6">
                    <LogItem time="12:45" event="Départ confirmé" bus="LT 492 CA" route="DLA -> YDE" />
                    <LogItem time="12:30" event="Entrée en zone" bus="CE 881 AB" route="YDE -> BAF" />
                    <LogItem time="12:15" event="Contrôle technique OK" bus="LT 503 EF" route="DLA -> KRI" />
                    <LogItem time="11:50" event="Alerte vitesse" bus="LT 412 BB" route="YDE -> DLA" warning />
                  </div>

                  <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/20 relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 text-primary/10 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={120} />
                    </div>
                    <h4 className="font-bold text-primary mb-2">Protocole OPEP</h4>
                    <p className="text-[12px] text-on_surface_variant leading-relaxed relative z-10">
                      Toutes les données de géolocalisation sont chiffrées de bout-en-bout et stockées sur les serveurs souverains de la plateforme.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}

function TrackingMetric({ icon, label, value, sub }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-charcoal_border bg-surface_container/30 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-surface_container_high flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-on_surface_variant uppercase tracking-widest">{label}</p>
        <p className="text-[20px] font-bold text-on_surface">{value}</p>
        <p className="text-[10px] text-on_surface_variant font-medium mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function LogItem({ time, event, bus, route, warning = false }: any) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${warning ? 'bg-error_red' : 'bg-primary'}`}></div>
        <div className="w-[2px] flex-1 bg-charcoal_border my-1"></div>
      </div>
      <div className="flex-1 pb-6 border-b border-charcoal_border/50 last:border-0 group-last:pb-0">
        <div className="flex justify-between items-start">
          <p className={`text-[14px] font-bold ${warning ? 'text-error_red' : 'text-on_surface'}`}>{event}</p>
          <span className="text-[11px] font-bold text-on_surface_variant">{time}</span>
        </div>
        <p className="text-[12px] text-on_surface_variant mt-1">{bus} • {route}</p>
      </div>
    </div>
  );
}
