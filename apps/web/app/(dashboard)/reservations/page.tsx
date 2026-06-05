'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MoreVertical
} from 'lucide-react';

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const reservations = [
    { 
      id: 'RES-001', 
      code: 'OP-X8Y2', 
      client: 'Samuel Eto\'o', 
      trip: 'Yaoundé - Douala', 
      date: '24 Juin 2024', 
      time: '14:30', 
      passengers: 2, 
      amount: '6,000 FCFA', 
      status: 'CONFIRMED' 
    },
    { 
      id: 'RES-002', 
      code: 'OP-A5B9', 
      client: 'Marie Ngo', 
      trip: 'Yaoundé - Bafoussam', 
      date: '24 Juin 2024', 
      time: '15:15', 
      passengers: 1, 
      amount: '4,000 FCFA', 
      status: 'PENDING_PAYMENT' 
    },
    { 
      id: 'RES-003', 
      code: 'OP-Q1R7', 
      client: 'Paul Biya', 
      trip: 'Douala - Kribi', 
      date: '25 Juin 2024', 
      time: '08:00', 
      passengers: 4, 
      amount: '10,000 FCFA', 
      status: 'CANCELLED' 
    },
  ];

  const filteredReservations = reservations.filter(res => 
    res.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.trip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="flex items-center text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-1 rounded-full"><CheckCircle2 size={12} className="mr-1" /> Confirmé</span>;
      case 'PENDING_PAYMENT':
        return <span className="flex items-center text-[10px] font-black uppercase bg-orange-100 text-orange-700 px-2 py-1 rounded-full"><Clock size={12} className="mr-1" /> En attente</span>;
      case 'CANCELLED':
        return <span className="flex items-center text-[10px] font-black uppercase bg-red-100 text-red-700 px-2 py-1 rounded-full"><XCircle size={12} className="mr-1" /> Annulé</span>;
      default:
        return <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Gestion des Réservations</h2>
          <p className="text-gray-500">Consultez et gérez les réservations de vos clients.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
            <Download size={18} className="mr-2" />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par code, client ou trajet..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-xl text-sm transition outline-none"
          />
        </div>
        <button className="flex items-center bg-gray-50 px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition w-full md:w-auto">
          <Filter size={18} className="mr-2" />
          Filtres avancés
        </button>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black border-b border-gray-100">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Trajet</th>
                <th className="px-6 py-4 text-center">Passagers</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-blue-600">{res.code}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">{res.client}</p>
                    <p className="text-[10px] text-gray-400">ID: {res.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-800">{res.trip}</p>
                    <p className="text-[10px] text-gray-500">{res.date} • {res.time}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-blue-50 text-blue-600 text-xs font-black px-2 py-1 rounded-lg">
                      {res.passengers}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-gray-900">
                    {res.amount}
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(res.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" title="Voir détails">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
          <p className="text-xs text-gray-500 font-medium">Affichage de 1-{filteredReservations.length} sur {reservations.length} réservations</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-50" disabled>Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
