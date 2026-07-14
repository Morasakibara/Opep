'use client';

import React from 'react';

interface Transaction {
  id: string;
  agency: string;
  amount: string;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-492102', agency: 'General Express', amount: '12,500 FCFA', method: 'Orange Money', status: 'SUCCESS' },
  { id: 'TXN-492103', agency: 'Touristique Express', amount: '5,000 FCFA', method: 'MTN MoMo', status: 'SUCCESS' },
  { id: 'TXN-492104', agency: 'Buca Voyage', amount: '7,500 FCFA', method: 'Credit Card', status: 'PENDING' },
  { id: 'TXN-492105', agency: 'General Express', amount: '12,500 FCFA', method: 'Orange Money', status: 'SUCCESS' },
];

interface TransactionsTableProps {
  transactions?: Transaction[];
  loading?: boolean;
}

export default function TransactionsTable({ transactions = DEFAULT_TRANSACTIONS, loading = false }: TransactionsTableProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-charcoal_border flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-on_surface">Transactions en Direct</h3>
        <span className="flex items-center gap-2 text-success_green text-[14px]">
          <span className="w-2 h-2 bg-success_green rounded-full animate-pulse"></span>
          Live
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface_container_low text-on_surface_variant text-[12px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Agence</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4">Méthode</th>
              <th className="px-6 py-4">Statut</th>
            </tr>
          </thead>
          <tbody className="text-[14px] divide-y divide-charcoal_border">
            {transactions.map((txn, index) => (
              <tr key={index} className="hover:bg-surface_container_high/50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-mono text-on_surface_variant group-hover:text-primary transition-colors">{txn.id}</td>
                <td className="px-6 py-4 text-on_surface font-medium">{txn.agency}</td>
                <td className="px-6 py-4 font-bold text-on_surface">{txn.amount}</td>
                <td className="px-6 py-4 text-on_surface_variant">{txn.method}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    txn.status === 'SUCCESS' 
                      ? 'bg-success_green/10 text-success_green' 
                      : txn.status === 'PENDING'
                      ? 'bg-warning_yellow/10 text-warning_yellow'
                      : 'bg-error_red/10 text-error_red'
                  }`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
