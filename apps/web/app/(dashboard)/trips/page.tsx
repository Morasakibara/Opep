'use client';

import React, { useState } from 'react';
import { 
  Map, 
  Plus, 
  Search, 
  MoreVertical, 
  Clock, 
  MapPin, 
  Calendar,
  ArrowRight,
  Filter,
  ChevronRight,
  Bus
} from 'lucide-react';

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'trajets' | 'lignes'>('trajets');
  const [searchQuery, setSearchQuery] = useState('');

  const initialRoutes = [
    { id: 'R-001', origin: 'Yaoundé', destination: 'Douala', duration: '4h 30min', distance: '240 km', tripsCount: 12 },
    { id: 'R-002', origin: 'Yaoundé', destination: 'Bafoussam', duration: '5h 00min', distance: '290 km', tripsCount: 8 },
    { id: 'R-003', origin: 'Douala', destination: 'Kribi', duration: '3h 00min', distance: '170 km', tripsCount: 5 },
  ];

  const initialTrips = [
    { 
      id: 'T-882', 
      route: 'Yaoundé → Douala', 
      departure: '14:30', 
      arrival: '19:00', 
      date: 'Aujourd\'hui', 
      bus: 'VIP-001', 
      seats: '68/70', 
      price: '6000 FCFA',
      status: 'En attente'
    },
    { 
      id: 'T-883', 
      route: 'Douala → Kribi', 
      departure: '16:00', 
      arrival: '19:00', 
      date: 'Aujourd\'hui', 
      bus: 'STD-014', 
      seats: '22/30', 
      price: '3000 FCFA',
      status: 'Confirmé'
    },
    { 
      id: 'T-884', 
      route: 'Yaoundé → Bafoussam', 
      departure: '07:00', 
      arrival: '12:00', 
      date: 'Demain', 
      bus: 'VIP-002', 
      seats: '10/70', 
      price: '5000 FCFA',
      status: 'Planifié'
    },
  ];

  const filteredRoutes = initialRoutes.filter(r => 
    r.origin.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrips = initialTrips.filter(t => 
    t.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.bus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Lignes & Trajets</h2>
          <p className="text-gray-500">Définissez vos itinéraires et planifiez les départs.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          <Plus size={20} className="mr-2" />
          {activeTab === 'lignes' ? 'Nouvelle ligne' : 'Planifier un trajet'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('trajets')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'trajets' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Trajets planifiés
        </button>
        <button 
          onClick={() => setActiveTab('lignes')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'lignes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Lignes (Itinéraires)
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-100 flex items-center px-4 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-3 bg-transparent border-none outline-none text-sm w-full" 
          />
        </div>
        <button className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-sm font-bold text-gray-700 flex items-center shadow-sm hover:bg-gray-50 transition">
          <Filter size={18} className="mr-2 text-gray-400" />
          Filtres
        </button>
      </div>

      {activeTab === 'lignes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Map size={24} />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-0.5 h-6 bg-gray-100 my-1"></div>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900 leading-tight">{route.origin}</p>
                    <div className="h-4"></div>
                    <p className="text-sm font-black text-gray-900 leading-tight">{route.destination}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Distance</p>
                    <p className="text-sm font-bold text-gray-900">{route.distance}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Durée est.</p>
                    <p className="text-sm font-bold text-gray-900">{route.duration}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-bold text-gray-500">{route.tripsCount} trajets actifs</p>
                <button className="text-xs font-bold text-blue-600 hover:underline flex items-center">
                  Détails <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-6 py-4">Trajet / ID</th>
                  <th className="px-6 py-4">Départ / Arrivée</th>
                  <th className="px-6 py-4">Bus</th>
                  <th className="px-6 py-4">Remplissage</th>
                  <th className="px-6 py-4">Prix</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{trip.route}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{trip.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs font-bold text-gray-900">{trip.departure}</div>
                        <ArrowRight size={12} className="text-gray-300" />
                        <div className="text-xs font-bold text-gray-900">{trip.arrival}</div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{trip.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                          <Bus size={12} className="text-gray-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{trip.bus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span>{trip.seats}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${parseInt(trip.seats.split('/')[0]) > 60 ? 'bg-orange-500' : 'bg-blue-600'}`} 
                            style={{ width: `${(parseInt(trip.seats.split('/')[0]) / parseInt(trip.seats.split('/')[1])) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-900">{trip.price}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                        trip.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 
                        trip.status === 'En attente' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
