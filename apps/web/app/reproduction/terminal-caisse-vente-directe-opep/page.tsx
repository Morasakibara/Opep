'use client';

import React, { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAvailableTrips } from '@/hooks/useTrips';
import { useReservations } from '@/hooks/useEntities';
import { ShoppingCart, User, CreditCard, Printer, History, Search } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TripSelector from '@/components/reproduction/ticketing/TripSelector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';

export default function TerminalCaisseVenteDirecteOpepReproductionPage() {
  const { data: trips, isLoading: tripsLoading, error: tripsError } = useAvailableTrips();
  const { data: reservations, isLoading: resLoading, error: resError } = useReservations();


  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'AGENCY_ADMIN', 'CASHIER']}>
      <div className="min-h-screen bg-background text-on_surface overflow-x-hidden font-jakarta">
        <Sidebar />
        
        <main className="md:ml-[280px] min-h-screen flex flex-col">
          {(tripsError || resError) && (
            <div className="mx-8 mt-4">
              <ErrorState title="Erreur de connexion" message={String(tripsError?.message || resError?.message || '')} />
            </div>
          )}
          <Header title="Terminal de Vente" placeholder="Rechercher un ticket ou un passager..." />
          
          <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[32px] font-bold text-on_surface tracking-tight">Vente Directe</h2>
                <p className="text-on_surface_variant text-[16px] mt-1">Guichet de billetterie en temps réel.</p>
              </div>
              <Button variant="outline" className="rounded-2xl border-charcoal_border" leftIcon={<History size={18} />}>
                Historique Ventes
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Selection */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <TripSelector />
                
                <section className="glass-card p-6 rounded-[24px] border border-charcoal_border bg-surface_container/50">
                  <h3 className="text-[18px] font-bold text-on_surface mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" /> Mode de Paiement
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <PaymentMethod id="cash" label="Espèces" icon="banknote" active />
                    <PaymentMethod id="om" label="Orange Money" icon="phone" />
                    <PaymentMethod id="momo" label="MTN MoMo" icon="smartphone" />
                    <PaymentMethod id="card" label="Carte Bancaire" icon="credit-card" />
                  </div>
                </section>
              </div>

              {/* Right Column: Passenger Info & Checkout */}
              <div className="col-span-12 lg:col-span-8">
                <section className="glass-card p-8 rounded-[32px] border border-charcoal_border bg-surface_container/50 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-charcoal_border">
                    <h3 className="text-[20px] font-bold text-on_surface">Informations Passager</h3>
                    <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[12px] font-bold uppercase tracking-widest">
                      Billet Classique
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Input label="Nom Complet" placeholder="ex: Jean Dupont" leftIcon={<User size={18} />} />
                    <Input label="Numéro de Téléphone" placeholder="ex: 699 00 00 00" leftIcon={<Search size={18} />} />
                    <Input label="CNI / Passeport (Optionnel)" placeholder="Numéro d'identification" />
                    <div className="space-y-2">
                      <label className="block text-[12px] font-bold text-on_surface_variant uppercase tracking-widest">Nombre de Places</label>
                      <div className="flex items-center gap-4">
                        <button className="w-12 h-12 rounded-xl bg-surface_container_high text-on_surface font-bold text-xl">-</button>
                        <span className="text-2xl font-bold px-6">1</span>
                        <button className="w-12 h-12 rounded-xl bg-primary text-on_primary font-bold text-xl">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-charcoal_border">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <p className="text-on_surface_variant text-[12px] uppercase tracking-widest font-bold">Total à payer</p>
                        <p className="text-[40px] font-bold text-primary tracking-tighter">3,000 <span className="text-lg">XAF</span></p>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" className="px-8 py-4 rounded-2xl border-charcoal_border" leftIcon={<Printer size={20} />}>
                          Aperçu
                        </Button>
                        <Button className="px-10 py-4 rounded-2xl shadow-xl shadow-primary/20" leftIcon={<ShoppingCart size={20} />}>
                          Encaisser & Imprimer
                        </Button>
                      </div>
                    </div>
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

function PaymentMethod({ id, label, icon, active = false }: any) {
  return (
    <div className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-primary/50 ${
      active ? 'border-primary bg-primary/5' : 'border-charcoal_border bg-surface_container_low'
    }`}>
      <p className={`text-[12px] font-bold ${active ? 'text-primary' : 'text-on_surface_variant'}`}>{label}</p>
    </div>
  );
}
