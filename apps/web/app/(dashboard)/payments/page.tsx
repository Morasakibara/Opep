'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard, AlertCircle,
  DollarSign, RefreshCw, FileText, TrendingUp,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { reportsApi } from '@/services/api.service';

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  reference: string;
  reservationId?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  SUCCESS: { label: 'Réussi', color: 'bg-success_green/10 text-success_green' },
  PENDING: { label: 'En attente', color: 'bg-warning_yellow/10 text-warning_yellow' },
  FAILED: { label: 'Échoué', color: 'bg-error_red/10 text-error_red' },
  REFUNDED: { label: 'Remboursé', color: 'bg-primary/10 text-primary' },
};

export default function PaymentsPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Fetch revenue stats from reports API (backend has GET /reports/revenue)
      const revenueData = await reportsApi.getRevenue();
      const total = Array.isArray(revenueData)
        ? revenueData.reduce((sum: number, r: any) => sum + (r.value || 0), 0)
        : 0;
      setTotalRevenue(total);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Paiements</h2>
          <p className="text-on_surface_variant">Historique des transactions et revenus.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <DollarSign size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{totalRevenue.toLocaleString()} FCFA</p>
          <p className="text-xs text-on_surface_variant font-medium">Revenu total</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <TrendingUp size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">—</p>
          <p className="text-xs text-on_surface_variant font-medium">Transactions</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <RefreshCw size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">—</p>
          <p className="text-xs text-on_surface_variant font-medium">En attente</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <FileText size={20} className="text-error_red mb-2" />
          <p className="text-2xl font-bold text-on_surface">—</p>
          <p className="text-xs text-on_surface_variant font-medium">Échoués</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadData} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-6 border-b border-charcoal_border bg-surface_container/30 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-on_surface">Données de paiement</p>
                <p className="text-xs text-on_surface_variant mt-1">
                  Le détail des transactions est disponible via le endpoint <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px]">GET /payments/reservation/:id</code> par réservation.
                </p>
                <p className="text-xs text-on_surface_variant/60 mt-1">
                  Les revenus cumulés sont récupérés depuis <code className="text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded text-[10px]">GET /reports/revenue</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="p-12 text-center">
            <CreditCard size={48} className="mx-auto text-on_surface_variant/20 mb-4" />
            <p className="text-on_surface_variant font-bold">Revenus chargés</p>
            <p className="text-xs text-on_surface_variant/60 mt-1">
              Les transactions individuelles sont liées à chaque réservation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
