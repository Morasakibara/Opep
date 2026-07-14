'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Store,
  Route, 
  Bus, 
  Users2, 
  BarChart3, 
  FileText, 
  HelpCircle, 
  Plus,
  ArrowRight,
  MessageSquare,
  Bell,
  CreditCard,
  AlertTriangle,
  Star,
  MapPin,
  Crown,
  MessageCircle,
  Calendar,
  Armchair,
  Smartphone,
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const PRIMARY_NAV: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', href: '/dashboard' },
  { icon: <Building2 size={20} />, label: 'Compagnies', href: '/companies' },
  { icon: <Store size={20} />, label: 'Centres', href: '/centres' },
  { icon: <Route size={20} />, label: 'Trajets', href: '/trips' },
  { icon: <Bus size={20} />, label: 'Bus', href: '/buses' },
  { icon: <Users2 size={20} />, label: 'Employés', href: '/employees' },
  { icon: <Users2 size={20} />, label: 'Conducteurs', href: '/drivers' },
  { icon: <CreditCard size={20} />, label: 'Paiements', href: '/payments' },
  { icon: <BarChart3 size={20} />, label: 'Rapports', href: '/reports' },
];

const OPERATIONS_NAV: NavItem[] = [
  { icon: <MapPin size={20} />, label: 'Suivi GPS', href: '/tracking' },
  { icon: <Calendar size={20} />, label: 'Horaires', href: '/schedules' },
  { icon: <Armchair size={20} />, label: 'Sièges', href: '/seats' },
  { icon: <FileText size={20} />, label: 'Factures', href: '/billings' },
  { icon: <Smartphone size={20} />, label: 'Scans Offline', href: '/offline-scans' },
  { icon: <MessageSquare size={20} />, label: 'Messages', href: '/messages' },
  { icon: <Bell size={20} />, label: 'Notifications', href: '/notifications' },
  { icon: <AlertTriangle size={20} />, label: 'Incidents', href: '/incidents' },
  { icon: <MessageCircle size={20} />, label: 'Réclamations', href: '/complaints' },
  { icon: <Star size={20} />, label: 'Avis clients', href: '/reviews' },
  { icon: <Crown size={20} />, label: 'Abonnements', href: '/subscriptions' },
];

function NavSection({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
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
            <span className={`${isActive ? 'text-primary scale-110' : 'group-hover:text-primary group-hover:scale-110'} transition-all duration-200`}>
              {item.icon}
            </span>
            <span className={`text-[13px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : ''}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                <ArrowRight size={14} className="animate-slide-in-from-left" />
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface_dim border-r border-charcoal_border hidden md:flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on_primary font-bold text-xl shadow-lg shadow-primary/20 rotate-3">
          O
        </div>
        <div>
          <h1 className="font-bold text-primary text-[20px] leading-tight tracking-tight">OPEP Admin</h1>
          <p className="text-on_surface_variant text-[10px] uppercase tracking-widest font-bold">Portail Souverain</p>
        </div>
      </div>

      <button className="mb-6 w-full py-3.5 bg-gradient-to-r from-primary to-primary/80 text-on_primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 hover:shadow-2xl hover:shadow-primary/20 active:scale-[0.97] transition-all duration-200 shadow-xl shadow-primary/10 group click-feedback">
        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        <span>Nouveau Trajet</span>
      </button>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {/* Section label */}
        <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-on_surface_variant/50">Gestion</p>
        <NavSection items={PRIMARY_NAV} />

        <div className="border-t border-charcoal_border my-3" />
        <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-on_surface_variant/50">Opérations</p>
        <NavSection items={OPERATIONS_NAV} />
      </nav>

      <div className="border-t border-charcoal_border pt-4 mt-4 flex flex-col gap-1.5">
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-on_surface_variant hover:bg-surface_container_high hover:text-on_surface rounded-xl transition-all">
          <HelpCircle size={20} />
          <span className="text-[13px] font-bold uppercase tracking-wider">Aide</span>
        </Link>
      </div>
    </aside>
  );
}
