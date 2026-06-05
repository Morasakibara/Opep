'use client';

import React, { useState } from 'react';
import { 
  Bus as BusIcon, 
  Plus, 
  Search, 
  MoreVertical, 
  Settings, 
  X,
  Check,
  LayoutGrid,
  User
} from 'lucide-react';

export default function BusesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSeatConfig, setShowSeatConfig] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatCapacity, setSeatCapacity] = useState(48);
  const [searchQuery, setSearchQuery] = useState('');

  const initialBuses = [
    { id: 'VIP-001', model: 'Mercedes-Benz Travego', capacity: 70, type: 'VIP', status: 'Actif', lastService: '01/06/2026' },
    { id: 'STD-012', model: 'Toyota Coaster', capacity: 30, type: 'Classique', status: 'Maintenance', lastService: '15/05/2026' },
    { id: 'VIP-002', model: 'Mercedes-Benz Travego', capacity: 70, type: 'VIP', status: 'Actif', lastService: '28/05/2026' },
    { id: 'STD-014', model: 'Hyundai County', capacity: 30, type: 'Classique', status: 'Actif', lastService: '02/06/2026' },
  ];

  const filteredBuses = initialBuses.filter(bus => 
    bus.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    bus.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSeat = (index: number) => {
    if (selectedSeats.includes(index)) {
      setSelectedSeats(selectedSeats.filter(s => s !== index));
    } else {
      setSelectedSeats([...selectedSeats, index]);
    }
  };

  return (
    <div className="space-y-8">
      {/* ... previous content unchanged ... */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Gestion des Bus</h2>
          <p className="text-gray-500">Gérez la flotte de véhicules de votre agence.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un bus
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-100 flex items-center px-4 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Rechercher par immatriculation, modèle..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-3 bg-transparent border-none outline-none text-sm w-full" 
          />
        </div>
        <select className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-sm font-bold text-gray-700 outline-none shadow-sm">
          <option>Tous les types</option>
          <option>VIP</option>
          <option>Classique</option>
        </select>
      </div>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${bus.type === 'VIP' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  <BusIcon size={24} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${bus.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {bus.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <h4 className="text-lg font-black text-gray-900 mb-1">{bus.id}</h4>
              <p className="text-sm text-gray-500 mb-4">{bus.model}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Capacité</p>
                  <p className="text-sm font-bold text-gray-900">{bus.capacity} places</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Dernière révision</p>
                  <p className="text-sm font-bold text-gray-900">{bus.lastService}</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  setShowSeatConfig(bus.id);
                  setSeatCapacity(bus.capacity);
                }}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center"
              >
                <Settings size={14} className="mr-1" /> Configurer les sièges
              </button>
              <button className="text-xs font-bold text-gray-500 hover:text-gray-700">
                Historique
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Ajouter un nouveau bus</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Immatriculation</label>
                  <input type="text" placeholder="ex: LT-123-AA" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Modèle</label>
                  <input type="text" placeholder="ex: Mercedes Travego" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Type</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700">
                    <option>VIP</option>
                    <option>Classique</option>
                    <option>Premium</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Capacité</label>
                  <input type="number" placeholder="ex: 70" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition"
              >
                Confirmer l'ajout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seat Config View */}
      {showSeatConfig && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900">Configuration des sièges - {showSeatConfig}</h3>
                <p className="text-sm text-gray-500">Définissez la disposition des sièges pour ce véhicule. Cliquez sur un siège pour le marquer comme VIP ou indisponible.</p>
              </div>
              <button onClick={() => setShowSeatConfig(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50 flex flex-col items-center">
              <div className="mb-6 flex space-x-8 bg-white p-4 rounded-2xl border border-gray-100">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-black uppercase">Capacité</p>
                  <p className="text-xl font-black text-gray-900">{seatCapacity}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-black uppercase">Sièges VIP</p>
                  <p className="text-xl font-black text-orange-600">{selectedSeats.length}</p>
                </div>
              </div>

              <div className="w-64 bg-white border border-gray-200 rounded-[3rem] p-8 shadow-inner relative">
                {/* Driver seat */}
                <div className="flex justify-end mb-8">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <User size={18} />
                  </div>
                </div>
                
                {/* Seats Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: seatCapacity }).map((_, i) => {
                    const isVip = selectedSeats.includes(i);
                    return (
                      <React.Fragment key={i}>
                        {i % 4 === 2 && <div className="w-4"></div>}
                        <button 
                          onClick={() => toggleSeat(i)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all transform active:scale-95 ${
                            isVip 
                            ? 'bg-orange-500 text-white border-b-4 border-orange-700 shadow-lg' 
                            : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-50 bg-white flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-50 border border-blue-100 rounded"></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Standard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Siège VIP</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  alert('Configuration sauvegardée avec succès !');
                  setShowSeatConfig(null);
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                Sauvegarder la config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
