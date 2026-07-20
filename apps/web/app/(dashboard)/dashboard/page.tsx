'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Ticket, Bus, QrCode, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { tripsApi, reservationsApi } from '@/services/api.service';
import StatsGrid from '@/components/dashboard/StatsGrid';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import AgenciesList from '@/components/dashboard/AgenciesList';
import RegionalActivity from '@/components/dashboard/RegionalActivity';
import { StaggeredItem } from '@/components/layout/PageTransition';
import { PageSkeleton } from '@/components/layout/PageSkeleton';

export default function DashboardPage() {
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservations, trips] = await Promise.all([
          reservationsApi.getAll().catch(() => [] as any[]),
          tripsApi.getAll().catch(() => [] as any[]),
        ]);

        if ((reservations as any[]).length > 0) {
          setRecentBookings((reservations as any[]).slice(0, 4).map((r: any) => ({
            id: r.reservationCode || r.ticketId || `RES-${r.id?.slice(0, 4)}`,
            user: r.client?.firstName && r.client?.lastName 
              ? `${r.client.firstName} ${r.client.lastName}` 
              : r.passengerName || 'Client',
            route: r.trip?.route 
              ? `${r.trip.route.departureCity || ''} - ${r.trip.route.arrivalCity || ''}`
              : r.tripRoute || 'Trajet',
            time: r.createdAt ? new Date(r.createdAt).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--',
            amount: r.totalAmount || r.amount || 0,
            status: r.status === 'CONFIRMED' ? 'Payé' : r.status === 'PENDING_PAYMENT' ? 'En attente' : r.status || '---',
          })));
        }

        if ((trips as any[]).length > 0) {
          const nextTrips = (trips as any[])
            .filter((t: any) => t.status === 'SCHEDULED' || t.status === 'BOARDING')
            .slice(0, 3)
            .map((t: any) => ({
              time: t.departureDateTime ? new Date(t.departureDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
              bus: t.bus?.plateNumber || t.busId?.slice(0, 7) || 'N/A',
              route: t.route 
                ? `${t.route.departureCity || ''} -> ${t.route.arrivalCity || ''}`
                : t.tripRoute || 'Trajet',
              fill: t.filledSeats && t.bus?.totalSeats 
                ? `${Math.round((t.filledSeats / t.bus.totalSeats) * 100)}%`
                : '--',
              fillPercent: t.filledSeats && t.bus?.totalSeats 
                ? Math.round((t.filledSeats / t.bus.totalSeats) * 100)
                : 0,
            }));
          setUpcomingTrips(nextTrips);
        }
      } catch (err: any) {
        toast.warning('Tableau de bord', err.message || 'Données partielles affichées');
      } finally {
        setLoading(false);
      }
      // Note: individual .catch(() => []) on each API call ensures one failing
      // doesn't block the other from loading
    };
    fetchData();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="animate-in slide-in-from-bottom duration-300">
        <h2 className="text-2xl font-bold text-on_surface">Tableau de bord</h2>
        <p className="text-on_surface_variant">Aperçu des performances de votre plateforme.</p>
      </div>

      {/* Stats Grid */}
      <div className="animate-in slide-in-from-bottom duration-500">
        <StatsGrid />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StaggeredItem index={0}>
          <RevenueChart />
        </StaggeredItem>
        <StaggeredItem index={1}>
          <RegionalActivity />
        </StaggeredItem>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions & Upcoming */}
        <StaggeredItem index={2} className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
            <h3 className="text-[18px] font-bold text-on_surface">Réservations récentes</h3>
            <Link href="/reservations" className="text-primary text-[14px] font-bold hover:underline flex items-center gap-1">
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[11px] font-bold uppercase tracking-widest text-on_surface_variant bg-surface_container_low">
                <tr>
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Trajet</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal_border">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-on_surface_variant">
                      Aucune réservation récente
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking, i) => (
                    <tr key={i} className="hover:bg-surface_container_high/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-primary">{booking.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on_surface">{booking.user}</p>
                        <p className="text-[10px] text-on_surface_variant">{booking.time}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-on_surface_variant">{booking.route}</td>
                      <td className="px-6 py-4 text-sm font-bold text-on_surface">
                        {typeof booking.amount === 'number' 
                          ? `${booking.amount.toLocaleString('fr-FR')} FCFA`
                          : booking.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${
                          booking.status === 'Payé' 
                            ? 'status-badge-success' 
                            : 'status-badge-warning'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        </StaggeredItem>
        <StaggeredItem index={3} className="space-y-6">
          {/* Scanner Card */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-[18px] font-bold text-on_surface mb-2">Scanner un ticket</h3>
              <p className="text-[14px] text-on_surface_variant mb-6">Validez les passagers à l'embarquement rapidement.</p>
              <Link 
                href="/scanner" 
                className="inline-flex items-center bg-primary text-on_primary px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg"
              >
                <QrCode size={20} className="mr-2" />
                Ouvrir le scanner
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <QrCode size={120} />
            </div>
          </div>

          {/* Upcoming Departures */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-[18px] font-bold text-on_surface mb-4">Prochains départs</h3>
            <div className="space-y-4">
              {upcomingTrips.length === 0 ? (
                <p className="text-on_surface_variant text-sm">Aucun départ planifié</p>
              ) : (
                upcomingTrips.map((departure, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary font-black p-2 rounded-lg text-sm w-16 text-center border border-primary/20">
                      {departure.time}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on_surface">{departure.route}</p>
                      <p className="text-[10px] text-on_surface_variant uppercase font-bold">{departure.bus}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-on_surface">{departure.fill}</p>
                      <div className="w-16 h-1.5 bg-surface_container_highest rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: departure.fill }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </StaggeredItem>
      </div>
    </div>
  );
}
