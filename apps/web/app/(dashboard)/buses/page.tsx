import React from 'react';
import { 
  Bus, 
  Plus, 
  Search, 
  MoreVertical, 
  Settings, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function BusesPage() {
  const buses = [
    { id: 'VIP-001', model: 'Mercedes-Benz Travego', capacity: 70, type: 'VIP', status: 'Actif', lastService: '01/06/2026' },
    { id: 'STD-012', model: 'Toyota Coaster', capacity: 30, type: 'Classique', status: 'Maintenance', lastService: '15/05/2026' },
    { id: 'VIP-002', model: 'Mercedes-Benz Travego', capacity: 70, type: 'VIP', status: 'Actif', lastService: '28/05/2026' },
    { id: 'STD-014', model: 'Hyundai County', capacity: 30, type: 'Classique', status: 'Actif', lastService: '02/06/2026' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Gestion des Bus</h2>
          <p className="text-gray-500">Gérez la flotte de véhicules de votre agence.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-lg">
          <Plus size={20} className="mr-2" />
          Ajouter un bus
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-100 flex items-center px-4 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Rechercher par immatriculation, modèle..." className="py-3 bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <select className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-sm font-bold text-gray-700 outline-none shadow-sm">
          <option>Tous les types</option>
          <option>VIP</option>
          <option>Classique</option>
        </select>
      </div>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${bus.type === 'VIP' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Bus size={24} />
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
              <button className="text-xs font-bold text-blue-600 hover:underline flex items-center">
                <Settings size={14} className="mr-1" /> Configurer les sièges
              </button>
              <button className="text-xs font-bold text-gray-500 hover:text-gray-700">
                Historique
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
