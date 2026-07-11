'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MoreVertical,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface Reservation {
  id: string;
  reservationCode: string;
  client: { firstName: string; lastName: string };
  trip: { route?: { departureCity: string; arrivalCity: string }; departureTime: string };
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsModal, setDetailsModal] = useState<Reservation | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    setLoading(true);
    setError(null);
    try {
      const data: any[] = await apiClient.getReservations();
      setReservations(data as Reservation[]);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des réservations');
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function getClientName(res: Reservation): string {
    if (res.client) return `${res.client.firstName} ${res.client.lastName}`;
    return 'N/A';
  }

  function getRouteLabel(res: Reservation): string {
    if (res.trip?.route) return `${res.trip.route.departureCity} - ${res.trip.route.arrivalCity}`;
    if (res.trip?.departureTime) return `Départ: ${new Date(res.trip.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    return 'Trajet inconnu';
  }

  function getStatusInfo(status: string) {
    switch (status) {
      case 'CONFIRMED':
        return { icon: <CheckCircle2 size={12} className="mr-1" />, label: 'Confirmée', style: 'bg-green-100 text-green-700' };
      case 'PENDING_PAYMENT':
        return { icon: <Clock size={12} className="mr-1" />, label: 'En attente', style: 'bg-orange-100 text-orange-700' };
      case 'CANCELLED':
        return { icon: <XCircle size={12} className="mr-1" />, label: 'Annulée', style: 'bg-red-100 text-red-700' };
      default:
        return { icon: null, label: status, style: 'bg-gray-100 text-gray-700' };
    }
  }

  const filteredReservations = reservations.filter(res => {
    const client = getClientName(res).toLowerCase();
    const code = (res.reservationCode || '').toLowerCase();
    const route = getRouteLabel(res).toLowerCase();
    const q = searchQuery.toLowerCase();
    return client.includes(q) || code.includes(q) || route.includes(q);
  });

  async function handleExportCSV() {
    try {
      const csvContent = [
        ['Code', 'Client', 'Trajet', 'Montant', 'Statut', 'Date'].join(','),
        ...reservations.map(r => [
          r.reservationCode,
          `"${getClientName(r)}"`,
          `"${getRouteLabel(r)}"`,
          r.totalAmount,
          r.status,
          formatDate(r.createdAt)
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback silencieux
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Gestion des Réservations</h2>
          <p className="text-gray-500">Consultez et gérez les réservations de vos clients.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExportCSV} className="flex items-center bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
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
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 rounded-xl text-sm transition outline-none text-gray-900"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="font-bold text-red-700">Erreur de chargement</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
          <button onClick={loadReservations} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition">
            Réessayer
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-500 font-medium">Chargement des réservations...</p>
        </div>
      )}

      {/* Reservations Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black border-b border-gray-100">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Trajet</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReservations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                      Aucune réservation trouvée
                    </td>
                  </tr>
                )}
                {filteredReservations.map((res) => {
                  const statusInfo = getStatusInfo(res.status);
                  return (
                    <tr key={res.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-blue-600">{res.reservationCode}</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-900">{getClientName(res)}</p>
                        <p className="text-[10px] text-gray-400">ID: {res.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-800">{getRouteLabel(res)}</p>
                        <p className="text-[10px] text-gray-500">{formatDate(res.createdAt)}</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-gray-900">
                        {formatAmount(res.totalAmount)}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`flex items-center text-[10px] font-black uppercase px-2 py-1 rounded-full ${statusInfo.style}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => setDetailsModal(res)} 
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" 
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
            <p className="text-xs text-gray-500 font-medium">
              Affichage de {filteredReservations.length} sur {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-50" disabled>Précédent</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-50" disabled>Suivant</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setDetailsModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Détails de la réservation</h3>
              <button onClick={() => setDetailsModal(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Code</span>
                <span className="text-sm font-black text-blue-600">{detailsModal.reservationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Client</span>
                <span className="text-sm font-bold">{getClientName(detailsModal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trajet</span>
                <span className="text-sm font-bold">{getRouteLabel(detailsModal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Montant</span>
                <span className="text-sm font-black">{formatAmount(detailsModal.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-medium">{formatDate(detailsModal.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Statut</span>
                <span className={`flex items-center text-xs font-black uppercase px-3 py-1 rounded-full ${getStatusInfo(detailsModal.status).style}`}>
                  {getStatusInfo(detailsModal.status).icon}
                  {getStatusInfo(detailsModal.status).label}
                </span>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setDetailsModal(null)} className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
