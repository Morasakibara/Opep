'use client';

import { usePathname } from 'next/navigation';
import {
  BusesSkeleton,
  TripsSkeleton,
  ReservationsSkeleton,
  EmployeesSkeleton,
  ReportsSkeleton,
  SettingsSkeleton,
  ScannerSkeleton,
  DashboardSkeleton,
} from '@/components/ui';

/**
 * Auto-detects the current route and renders the matching skeleton.
 * Use this in all dashboard pages instead of importing individual skeletons.
 *
 * @example
 * if (loading) return <PageSkeleton />;
 */
export function PageSkeleton() {
  const pathname = usePathname();

  // Order matters: more specific routes first, fallback to Dashboard
  if (pathname?.includes('/buses')) return <BusesSkeleton />;
  if (pathname?.includes('/trips')) return <TripsSkeleton />;
  if (pathname?.includes('/reservations')) return <ReservationsSkeleton />;
  if (pathname?.includes('/employees')) return <EmployeesSkeleton />;
  if (pathname?.includes('/reports')) return <ReportsSkeleton />;
  if (pathname?.includes('/settings')) return <SettingsSkeleton />;
  if (pathname?.includes('/scanner')) return <ScannerSkeleton />;
  if (pathname?.includes('/drivers')) return <EmployeesSkeleton />;
  if (pathname?.includes('/messages')) return <EmployeesSkeleton />;
  if (pathname?.includes('/notifications')) return <EmployeesSkeleton />;
  if (pathname?.includes('/payments')) return <ReportsSkeleton />;
  if (pathname?.includes('/incidents')) return <ReportsSkeleton />;
  if (pathname?.includes('/complaints')) return <EmployeesSkeleton />;
  if (pathname?.includes('/reviews')) return <EmployeesSkeleton />;
  if (pathname?.includes('/subscriptions')) return <ReportsSkeleton />;
  if (pathname?.includes('/tracking')) return <EmployeesSkeleton />;
  if (pathname?.includes('/schedules')) return <EmployeesSkeleton />;
  if (pathname?.includes('/seats')) return <EmployeesSkeleton />;
  if (pathname?.includes('/billings')) return <ReportsSkeleton />;
  if (pathname?.includes('/offline-scans')) return <EmployeesSkeleton />;

  // Default: Dashboard layout
  return <DashboardSkeleton />;
}
