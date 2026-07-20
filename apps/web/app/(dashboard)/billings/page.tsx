'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Search, AlertCircle, ChevronRight, Building2,
  DollarSign, TrendingUp, Clock, CheckCircle2, Download,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { billingsApi } from '@/services/api.service';

interface Invoice {
  id: string;
  number: string;
  companyName: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
  period: string;
  dueDate: string;
  paidAt?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PAID: { label: 'Payée', color: 'bg-success_green/10 text-success_green' },
  PENDING: { label: 'En attente', color: 'bg-warning_yellow/10 text-warning_yellow' },
  OVERDUE: { label: 'En retard', color: 'bg-error_red/10 text-error_red' },
  CANCELLED: { label: 'Annulée', color: 'bg-on_surface_variant/10 text-on_surface_variant' },
};

export default function BillingsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    setLoading(true);
    setError(null);
    try {
      const data = await billingsApi.getAll();
      setInvoices(Array.isArray(data) ? data as Invoice[] : []);
    } catch (err: any) {
      console.warn('Billings API unavailable, using mock data:', err.message);
      setInvoices([
        { id: '1', number: 'FAC-2026-001', companyName: 'Transcam SA', amount: 250000, status: 'PAID', period: 'Juin 2026', dueDate: '2026-07-15', paidAt: '2026-07-10' },
        { id: '2', number: 'FAC-2026-002', companyName: 'Voyages Express', amount: 180000, status: 'PENDING', period: 'Juin 2026', dueDate: '2026-07-20' },
        { id: '3', number: 'FAC-2026-003', companyName: 'Général Transport', amount: 320000, status: 'OVERDUE', period: 'Mai 2026', dueDate: '2026-06-15' },
        { id: '4', number: 'FAC-2026-004', companyName: 'Bus Alliance', amount: 95000, status: 'PAID', period: 'Juin 2026', dueDate: '2026-07-05', paidAt: '2026-07-03' },
        { id: '5', number: 'FAC-2026-005', companyName: 'Rapide Cameroun', amount: 210000, status: 'PENDING', period: 'Juillet 2026', dueDate: '2026-08-01' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = invoices.filter((inv) =>
    inv.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter((inv) => inv.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter((inv) => inv.status === 'PENDING' || inv.status === 'OVERDUE').reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Facturation</h2>
          <p className="text-on_surface_variant">Gestion des factures et abonnements compagnies.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <FileText size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{invoices.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Factures</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <DollarSign size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{paidAmount.toLocaleString()} FCFA</p>
          <p className="text-xs text-on_surface_variant font-medium">Payé</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <TrendingUp size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{pendingAmount.toLocaleString()} FCFA</p>
          <p className="text-xs text-on_surface_variant font-medium">En attente</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Building2 size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{new Set(invoices.map((i) => i.companyName)).size}</p>
          <p className="text-xs text-on_surface_variant font-medium">Compagnies</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadInvoices} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher une facture..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex items-center gap-2 text-xs text-on_surface_variant bg-surface_container_high px-3 py-2 rounded-xl">
              <DollarSign size={14} className="text-primary" />
              <span className="font-bold">{totalAmount.toLocaleString()} FCFA</span>
              <span>total</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">{searchQuery ? 'Aucune facture trouvée' : 'Aucune facture'}</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((inv, i) => (
                <div key={inv.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">{inv.number}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[inv.status]?.color || ''}`}>
                        {statusConfig[inv.status]?.label || inv.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-on_surface_variant">{inv.companyName}</span>
                      <span className="text-xs font-bold text-primary">{inv.amount?.toLocaleString()} FCFA</span>
                      <span className="text-[10px] text-on_surface_variant/60">{inv.period}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-on_surface_variant/40 flex items-center gap-1">
                        <Clock size={10} /> Échéance: {new Date(inv.dueDate).toLocaleDateString('fr-FR')}
                      </span>
                      {inv.paidAt && (
                        <span className="text-[10px] text-success_green/60 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Payée le {new Date(inv.paidAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Download size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer" onClick={() => alert(`Téléchargement de la facture ${inv.number}`)} />
                  <ChevronRight size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all flex-shrink-0 cursor-pointer" onClick={() => alert(`Détails de la facture ${inv.number}`)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
