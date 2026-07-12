'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Route, 
  Bus, 
  Users2, 
  BarChart3, 
  FileText, 
  HelpCircle, 
  Plus,
  ArrowRight
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'nav.dashboard', href: '/reproduction/opep-super-admin-dashboard' },
  { icon: <Building2 size={20} />, label: 'nav.agencies', href: '#' },
  { icon: <Route size={20} />, label: 'nav.trips', href: '/reproduction/gestion-des-voyages-opep-light' },
  { icon: <Bus size={20} />, label: 'nav.buses', href: '#' },
  { icon: <Users2 size={20} />, label: 'nav.staff', href: '/reproduction/gestion-du-personnel-opep-admin-light' },
  { icon: <BarChart3 size={20} />, label: 'nav.analytics', href: '#' },
  { icon: <FileText size={20} />, label: 'nav.reports', href: '/reproduction/exportation-des-rapports-opep-admin' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface_dim border-r border-charcoal_border hidden md:flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on_primary font-bold text-xl shadow-lg shadow-primary/20 rotate-3">
          O
        </div>
        <div>
          <h1 className="font-bold text-primary text-[20px] leading-tight tracking-tight">OPEP Admin</h1>
          <p className="text-on_surface_variant text-[10px] uppercase tracking-widest font-bold">Portail Souverain</p>
        </div>
      </div>

      <button className="mb-8 w-full py-3.5 bg-gradient-to-r from-primary to-primary/80 text-on_primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/10 group">
        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
        <span>Nouveau Trajet</span>
      </button>

      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm border border-primary/10' 
                  : 'text-on_surface_variant hover:bg-surface_container_high hover:text-on_surface'
              }`}
            >
              <span className={`${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`}>
                {item.icon}
              </span>
              <span className={`text-[13px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : ''}`}>
                {t(item.label)}
              </span>
              {isActive && <ArrowRight size={14} className="ml-auto animate-in slide-in-from-left-2" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-charcoal_border pt-6 mt-6 flex flex-col gap-1.5">
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-on_surface_variant hover:bg-surface_container_high hover:text-on_surface rounded-xl transition-all">
          <HelpCircle size={20} />
          <span className="text-[13px] font-bold uppercase tracking-wider">{t('nav.help')}</span>
        </Link>
      </div>
    </aside>
  );
}
