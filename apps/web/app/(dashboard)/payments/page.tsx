'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet, Search, AlertCircle, ChevronRight, Building2,
  DollarSign, TrendingUp, Clock, CheckCircle2, Smartphone, CreditCard,
  ArrowUpRight, ArrowDownLeft, XCircle, Filter, RefreshCw,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { paymentsApi } from '@/services/api.service';

interface Payment {
  id: string;
  reservationCode: string;
  passengerName: string;
  amount: number;
  method: 'MTN_MOMO' | 'ORANGE_MONEY' | 'CASH' | 'CARD' | 'BANK_TRANSFER';
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  provider: string;
  createdAt: string;
  refundedAt?: string;
}

const METHOD_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  MTN_MOMO: { label: 'MTN MoMo', icon: <Smartphone size={14} />, color: 'text-[#ffcc00] bg-[#ffcc00]/10' },
  ORANGE_MONEY: { label: 'Orange Money', icon: <Smartphone size={14} />, color: 'text-[#ff7900] bg-[#ff7900]/10' },
  CASH: { label: 'Espèces', icon: <Wallet size={14} />, color: 'text-success_green bg-success_green/10' },
  CARD: { label: 'Carte', icon: <CreditCard size={14} />, color: 'text-primary bg-primary/10' },
  BANK_TRANSFER: { label: 'Virement', icon: <ArrowUpRight size={14} />, color: 'text-tertiary bg-tertiary/10' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SUCCESS: { label: 'Réussi', color: 'bg-success_green/10 text-success_green' },
  PENDING: { label: 'En attente', color: 'bg-warning_yellow/10 text-warning_yellow' },
  FAILED: { label: 'Échoué', color: 'bg-error_red/10 text-error_red' },
  REFUNDED: { label: 'Remboursé', color: 'bg-primary/10 text-primary' },
  CANCELLED: { label: 'Annulé', color: 'bg-on_surface_variant/10 text-on_surface_variant' },
};

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', reservationCode: 'RES-AZ12', passengerName: 'Jean Nkoulou', amount: 6000, method: 'MTN_MOMO', status: 'SUCCESS', provider: 'MTN', createdAt: '2026-07-15T08:30:00' },
  { id: '2', reservationCode: 'RES-BX45', passengerName: 'Marie Bello', amount: 5500, method: 'CASH', status: 'SUCCESS', provider: 'Guichet', createdAt: '2026-07-15T09:00:00' },
  { id: '3', reservationCode: 'RES-CM78', passengerName: 'Paul Emana', amount: 8000, method: 'ORANGE_MONEY', status: 'PENDING', provider: 'Orange', createdAt: '2026-07-15T09:15:00' },
  { id: '4', reservationCode: 'RES-DP90', passengerName: 'Adrian Doe', amount: 3000, method: 'CARD', status: 'FAILED', provider: 'Stripe', createdAt: '2026-07-14T18:00:00' },
  { id: '5', reservationCode: 'RES-ER23', passengerName: 'Samuel Eto\'o', amount: 12000, method: 'MTN_MOMO', status: 'REFUNDED', provider: 'MTN', createdAt: '2026-07-14T12:00:00', refundedAt: '2026-07-14T14:00:00' },
  { id: '6', reservationCode: 'RES-FG56', passengerName: 'Christine Eyanga', amount: 4500, method: 'BANK_TRANSFER', status: 'SUCCESS', provider: 'Banque', createdAt: '2026-07-13T10:30:00' },
  { id: '7', reservationCode: 'RES-HI89', passengerName: 'David Mbarga', amount: 7500, method: 'ORANGE_MONEY', status: 'CANCELLED', provider: 'Orange', createdAt: '2026-07-13T07:00:00' },
  { id: '8', reservationCode: 'RES-JK01', passengerName: 'Sarah Kenne', amount: 9000, method: 'CASH', status: 'SUCCESS', provider: 'Guichet', createdAt: '2026-07-12T16:45:00' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const toast = useToast();

  useEffect(() => { loadPayments(); }, []);

  async function loadPayments() {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsApi.initiate({}).catch(() => { throw new Error('API indisponible'); });
      setPayments(Array.isArray(data) ? data as Payment[] : []);
    } catch (err: any) {
      console.warn('Payments API unavailable, using mock data');
      setPayments(MOCK_PAYMENTS);
      toast.info('Paiements', 'Données de démonstration affichées');
    } finally {
      setLoading(false);
    }
  }

  const filtered = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.passengerName.toLowerCase().includes(q) ||
      p.reservationCode.toLowerCase().includes(q) ||
      p.provider.toLowerCase().includes(q);
    const matchesMethod = filterMethod === 'all' || p.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const totalRevenue = payments.filter((p) => p.status === 'SUCCESS').reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0);
  const refundedAmount = payments.filter((p) => p.status === 'REFUNDED').reduce((s, p) => s + p.amount, 0);
  const successCount = payments.filter((p) => p.status === 'SUCCESS').length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Paiements</h2>
          <p className="text-on_surface_variant">Suivez et gérez les transactions financières.</p>
        </div>
        <button onClick={loadPayments}
          className="px-5 py-2.5 bg-primary text-on_primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <RefreshCw size={16} /> Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <DollarSign size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{totalRevenue.toLocaleString()} FCFA</p>
          <p className="text-xs text-on_surface_variant font-medium">Revenu total</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <TrendingUp size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{pendingAmount.toLocaleString()} FCFA</p>
          <p className="text-xs text-on_surface_variant font-medium">En attente</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <ArrowDownLeft size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{refundedAmount.toLocaleString()} FCFA</p>
          <p className="text-xs text-on_surface_variant font-medium">Remboursé</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <CheckCircle2 size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{successCount}</p>
          <p className="text-xs text-on_surface_variant font-medium">Transactions réussies</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30 animate-in fade-in">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadPayments} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          {/* Search + Filters */}
          <div className="p-5 border-b border-charcoal_border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher un paiement..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {['all', 'MTN_MOMO', 'ORANGE_MONEY', 'CASH', 'CARD'].map((m) => (
                <button key={m} onClick={() => setFilterMethod(m)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex-shrink-0 ${
                    filterMethod === m ? 'bg-primary text-on_primary' : 'bg-surface_container_high text-on_surface_variant hover:text-on_surface'
                  }`}
                >
                  {m === 'all' ? 'Tous' : METHOD_CONFIG[m]?.label || m}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Wallet size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">{searchQuery ? 'Aucun paiement trouvé' : 'Aucun paiement'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="table-header">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Passager</th>
                    <th className="px-6 py-4">Montant</th>
                    <th className="px-6 py-4">Méthode</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal_border">
                  {filtered.map((payment, i) => (
                    <tr key={payment.id} className="table-row animate-in fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-primary border-shine w-fit">{payment.reservationCode}</p>
                        <p className="text-[10px] text-on_surface_variant font-mono">{payment.provider}</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-on_surface">{payment.passengerName}</td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-on_surface bg-surface_container_high px-3 py-1 rounded-lg">
                          {payment.amount.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${METHOD_CONFIG[payment.method]?.color || ''}`}>
                          {METHOD_CONFIG[payment.method]?.icon} {METHOD_CONFIG[payment.method]?.label || payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`status-badge ${STATUS_CONFIG[payment.status]?.color || ''}`}>
                          {payment.status === 'SUCCESS' && <CheckCircle2 size={12} className="mr-1" />}
                          {payment.status === 'FAILED' && <XCircle size={12} className="mr-1" />}
                          {payment.status === 'PENDING' && <Clock size={12} className="mr-1" />}
                          {payment.status === 'REFUNDED' && <ArrowDownLeft size={12} className="mr-1" />}
                          {STATUS_CONFIG[payment.status]?.label || payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-on_surface_variant">{new Date(payment.createdAt).toLocaleDateString('fr-FR')}</p>
                        <p className="text-[10px] text-on_surface_variant/60">{new Date(payment.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-surface_container_high rounded-lg transition opacity-0 group-hover:opacity-100">
                          <ChevronRight size={18} className="text-on_surface_variant" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
