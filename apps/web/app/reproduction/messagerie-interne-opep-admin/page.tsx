'use client';

import React, { useState } from 'react';
import { MessageSquare, Users, Phone, Video, Search, Filter } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ChatWindow from '@/components/reproduction/messaging/ChatWindow';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';

export default function MessagerieInterneOpepAdminReproductionPage() {

  return (
    <ProtectedRoute roles={['SUPER_ADMIN', 'AGENCY_ADMIN', 'CASHIER']}>
      <div className="min-h-screen bg-background text-on_surface overflow-x-hidden font-jakarta">
        <Sidebar />
        
        <main className="md:ml-[280px] min-h-screen flex flex-col">
          <Header title="Internal Communications" placeholder="Search agencies, staff..." />
          
          <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col flex-1 h-full">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-[32px] font-bold text-on_surface tracking-tight">Messagerie</h2>
                <p className="text-on_surface_variant text-[16px] mt-1">Échanges sécurisés entre les agences du réseau.</p>
              </div>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-surface_container rounded-2xl border border-charcoal_border flex items-center justify-center text-on_surface_variant hover:text-primary transition-all">
                  <Phone size={20} />
                </button>
                <button className="w-12 h-12 bg-surface_container rounded-2xl border border-charcoal_border flex items-center justify-center text-on_surface_variant hover:text-primary transition-all">
                  <Video size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1">
              {/* Contacts Sidebar */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="glass-card p-6 rounded-[32px] border border-charcoal_border bg-surface_container/50 flex-1">
                  <div className="relative mb-6">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant" />
                    <input 
                      type="text" 
                      placeholder="Filtrer les agences..." 
                      className="w-full bg-surface_container_low border border-charcoal_border rounded-2xl py-3 pl-12 pr-4 text-[14px] outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
                    <ContactItem name="Agence Douala Central" status="En ligne" active />
                    <ContactItem name="Yaoundé Elite Office" status="En ligne" />
                    <ContactItem name="Bafoussam Express" status="Il y a 10 min" />
                    <ContactItem name="Kribi Coast Station" status="Hors ligne" />
                    <ContactItem name="Ebolowa Hub" status="Hors ligne" />
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="col-span-12 lg:col-span-8">
                <ChatWindow />
              </div>
            </div>
          </div>
        </main>

        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}

function ContactItem({ name, status, active = false }: any) {
  return (
    <div className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${
      active 
        ? 'bg-primary/10 border border-primary/20' 
        : 'hover:bg-surface_container_high'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold relative ${
        active ? 'bg-primary text-on_primary' : 'bg-surface_container_high text-on_surface_variant'
      }`}>
        {name.substring(0, 2).toUpperCase()}
        {status === 'En ligne' && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success_green border-2 border-surface_container rounded-full"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-[14px] font-bold truncate ${active ? 'text-on_surface' : 'text-on_surface_variant'}`}>{name}</h4>
        <p className="text-[11px] text-on_surface_variant uppercase tracking-widest font-bold mt-0.5">{status}</p>
      </div>
    </div>
  );
}
