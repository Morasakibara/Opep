'use client';

import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useRoutes } from '@/hooks/useEntities';
import { Calendar, MapPin, FileText, Table as TableIcon, Database, Download, Clock } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import CategorySelector from '@/components/reproduction/reports/CategorySelector';
import RecentExports from '@/components/reproduction/reports/RecentExports';
import { Button } from '@/components/ui/Button';
import MobileNav from '@/components/reproduction/dashboard/MobileNav';

/**
undefined
 * Integrated with Modular Components, Generic UI, and Lucide Icons
 */
export default function ExportationDesRapportsOpepAdminReproductionPage() {
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden font-jakarta">
      <Sidebar />
      
      <main className="md:ml-[280px] min-h-screen flex flex-col">
        <Header placeholder="Search analytics, reports, transactions..." />
        
        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Database size={18} />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Analytics Module</span>
              </div>
              <h2 className="text-[32px] font-bold text-on_surface tracking-tight">Reports Export</h2>
              <p className="text-on_surface_variant text-[16px] mt-1">Generate and manage sovereign data exports for OPEP operations.</p>
            </div>
            <Button variant="outline" leftIcon={<Clock size={18} />}>
              Schedule Auto-Export
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Main Configuration Section */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              <section className="glass-card rounded-[32px] p-8 border border-charcoal_border bg-surface_container/50 shadow-2xl">
                <h3 className="text-[20px] font-bold text-on_surface mb-8">Export Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <CategorySelector />

                  <div className="space-y-3">
                    <label className="block text-[12px] font-bold text-on_surface_variant uppercase tracking-widest">Date Range</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface_container_low border border-charcoal_border rounded-xl cursor-pointer hover:border-primary transition-all group">
                      <Calendar size={18} className="text-primary group-hover:scale-110 transition-transform" />
                      <span className="flex-1 text-[14px]">Oct 01, 2023 - Oct 31, 2023</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[12px] font-bold text-on_surface_variant uppercase tracking-widest">Branch / Agency</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface_container_low border border-charcoal_border rounded-xl cursor-pointer hover:border-primary transition-all group">
                      <MapPin size={18} className="text-primary group-hover:scale-110 transition-transform" />
                      <select className="bg-transparent border-none w-full focus:ring-0 text-on_surface text-[14px] appearance-none cursor-pointer outline-none">
                        <option>All Cameroon Branches</option>
                        <option>Douala Central</option>
                        <option>Yaoundé Elite</option>
                        <option>Bafoussam Express</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full mt-4">
                    <label className="block text-[12px] font-bold text-on_surface_variant uppercase tracking-widest mb-4">Output Format</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormatCard id="pdf" title="PDF Document" sub="Official Branding" icon={<FileText size={20} className="text-error_red" />} active />
                      <FormatCard id="xlsx" title="Excel (XLSX)" sub="Data Analysis" icon={<TableIcon size={20} className="text-primary" />} />
                      <FormatCard id="csv" title="CSV Raw" sub="Interoperability" icon={<Database size={20} className="text-tertiary" />} />
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-10 rounded-2xl py-4 text-[16px]" leftIcon={<Download size={20} />}>
                  Generate Sovereign Export
                </Button>
              </section>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SummaryCard title="Total Revenue (Period)" value="12,450,000" unit="XAF" trend="+12.4% from prev. month" color="primary" />
                <SummaryCard title="Passengers Tracked" value="4,291" unit="" trend="98% biometric match rate" color="tertiary" />
              </div>
            </div>

            {/* Sidebar Section */}
            <div className="col-span-12 lg:col-span-4">
              <RecentExports />
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

function FormatCard({ id, title, sub, icon, active = false }: { id: string; title: string; sub: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <label className="cursor-pointer group">
      <input type="radio" name="format" className="hidden" defaultChecked={active} />
      <div className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${
        active 
          ? 'border-primary bg-primary/5 shadow-inner' 
          : 'border-charcoal_border bg-surface_container_low hover:border-primary/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface_container flex items-center justify-center shadow-sm">
            {icon}
          </div>
          <div>
            <p className="font-bold text-[14px] text-on_surface">{title}</p>
            <p className="text-[11px] text-on_surface_variant">{sub}</p>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          active ? 'border-primary' : 'border-charcoal_border'
        }`}>
          {active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>
    </label>
  );
}

function SummaryCard({ title, value, unit, trend, color }: { title: string; value: string; unit: string; trend: string; color: string }) {
  return (
    <div className="glass-card p-6 rounded-[24px] border border-charcoal_border bg-surface_container/30 relative overflow-hidden group hover:bg-surface_container/50 transition-all">
      <h4 className="text-on_surface_variant text-[11px] font-bold uppercase tracking-widest mb-2">{title}</h4>
      <div className={`text-3xl font-bold text-${color} tracking-tight`}>
        {value} <span className="text-sm font-medium text-on_surface_variant ml-1">{unit}</span>
      </div>
      <p className="text-[11px] text-on_surface_variant mt-3 flex items-center gap-1.5 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        {trend}
      </p>
    </div>
  );
}
