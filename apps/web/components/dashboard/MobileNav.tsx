'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Building2, Plus, Route, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={24} />, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: <Building2 size={24} />, label: 'Agences', href: '/companies' },
  { icon: <Plus size={24} />, label: 'Nouveau', href: '#', action: true },
  { icon: <Route size={24} />, label: 'Trajets', href: '/trips' },
  { icon: <Settings size={24} />, label: 'Paramètres', href: '/settings' },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface_container border-t border-charcoal_border flex items-center justify-around px-4 z-50">
      {NAV_ITEMS.map((item, i) => 
        item.action ? (
          <div key={i} className="relative">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -translate-y-6 shadow-lg shadow-primary/30 text-on_primary border-4 border-background active:scale-95 transition-transform cursor-pointer">
              <Plus size={24} />
            </div>
          </div>
        ) : (
          <Link 
            key={i}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${item.active ? 'text-primary' : 'text-on_surface_variant hover:text-on_surface transition-colors'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        )
      )}
    </nav>
  );
}
