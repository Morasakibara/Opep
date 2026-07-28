'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

/**
 * Map of URL paths to human-readable labels in French.
 * Add new paths as the app grows.
 */
const PATH_LABELS: Record<string, string> = {
  'dashboard': 'Tableau de bord',
  'trips': 'Trajets',
  'buses': 'Bus',
  'drivers': 'Conducteurs',
  'employees': 'Employés',
  'agencies': 'Agences',
  'companies': 'Compagnies',
  'centres': 'Centres',
  'reservations': 'Réservations',
  'tickets': 'Tickets',
  'payments': 'Paiements',
  'billings': 'Factures',
  'reports': 'Rapports',
  'settings': 'Paramètres',
  'messages': 'Messages',
  'notifications': 'Notifications',
  'incidents': 'Incidents',
  'complaints': 'Réclamations',
  'reviews': 'Avis clients',
  'subscriptions': 'Abonnements',
  'offline-scans': 'Scans hors ligne',
  'scanner': 'Scanner',
  'schedules': 'Horaires',
  'seats': 'Sièges',
  'tracking': 'Suivi GPS',
  'routes': 'Lignes',
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Skip rendering if pathname is null or on root dashboard
  if (!pathname || pathname === '/dashboard') return null;

  // Split path and filter out empty segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items: accumulate paths
  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = PATH_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] mb-5">
      <AnimatedMount animation="fade" durationMs={300} className="contents">
      {/* Home link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-on_surface_variant/60 hover:text-primary transition-colors font-medium"
      >
        <Home size={14} />
        <span className="hidden sm:inline">Accueil</span>
      </Link>

      {items.map((item) => (
        <Fragment key={item.href}>
          <ChevronRight size={12} className="text-on_surface_variant/30 flex-shrink-0" />
          {item.isLast ? (
            <span className="text-on_surface font-bold truncate max-w-[200px]" title={item.label}>
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-on_surface_variant/60 hover:text-primary transition-colors truncate max-w-[150px] font-medium"
              title={item.label}
            >
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
      </AnimatedMount>
    </nav>
  );
}
