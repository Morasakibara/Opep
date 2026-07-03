import React from 'react';
import { Activity } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TXN-492102', agency: 'General Express', amount: '12,500 FCFA', method: 'Orange Money', status: 'SUCCESS' },
  { id: 'TXN-492103', agency: 'Touristique Express', amount: '5,000 FCFA', method: 'MTN MoMo', status: 'SUCCESS' },
  { id: 'TXN-492104', agency: 'Buca Voyage', amount: '7,500 FCFA', method: 'Credit Card', status: 'PENDING' },
  { id: 'TXN-492105', agency: 'General Express', amount: '12,500 FCFA', method: 'Orange Money', status: 'SUCCESS' },
];

export default function TransactionsTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-charcoal_border bg-surface_container/50">
      <div className="p-6 border-b border-charcoal_border flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-on_surface">Live Transactions</h3>
        <span className="flex items-center gap-2 text-success_green text-[14px]">
          <span className="w-2 h-2 bg-success_green rounded-full animate-pulse"></span>
          Live Stream
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface_container_low text-on_surface_variant text-[12px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Agency</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-[14px] divide-y divide-charcoal_border">
            {TRANSACTIONS.map((txn, index) => (
              <tr key={index} className="hover:bg-surface_container_high/50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-mono text-on_surface_variant group-hover:text-primary transition-colors">{txn.id}</td>
                <td className="px-6 py-4 text-on_surface font-medium">{txn.agency}</td>
                <td className="px-6 py-4 font-bold text-on_surface">{txn.amount}</td>
                <td className="px-6 py-4 text-on_surface_variant">{txn.method}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    txn.status === 'SUCCESS' 
                      ? 'bg-success_green/10 text-success_green' 
                      : 'bg-warning_yellow/10 text-warning_yellow'
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
