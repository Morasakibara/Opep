import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Filter, ArrowLeft, Clock, Info, ShieldCheck } from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || 'Yaoundé';
  const to = searchParams.get('to') || 'Douala';

  const [trips] = useState([
    { id: 1, agency: 'Finexs Voyages', time: '06:00', type: 'VIP', price: 3000, seats: 12 },
    { id: 2, agency: 'General Express', time: '07:30', type: 'Classique', price: 2500, seats: 5 },
    { id: 3, agency: 'Finexs Voyages', time: '09:00', type: 'VIP', price: 3000, seats: 24 },
    { id: 4, agency: 'Buca Voyages', time: '10:15', type: 'VIP', price: 3500, seats: 2 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Search Summary Header */}
      <div className="bg-opep-blue text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="mr-4 hover:bg-white/20 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{from} ➔ {to}</h2>
            <p className="text-xs opacity-80">Mercredi, 3 Juin • 1 Passager</p>
          </div>
          <button className="bg-white/20 p-2 rounded-lg">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-600 font-medium">{trips.length} trajets trouvés</h3>
          <select className="bg-transparent text-sm font-bold text-opep-blue outline-none">
            <option>Le plus tôt</option>
            <option>Prix croissant</option>
          </select>
        </div>

        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-opep-blue transition group">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl font-black text-gray-400">{trip.agency[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{trip.agency}</h4>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-[10px]">{trip.type}</span>
                        <span className="flex items-center"><ShieldCheck size={12} className="mr-1 text-green-500" /> Garanti</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{trip.price} <span className="text-sm font-normal text-gray-500">FCFA</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-b border-dashed border-gray-100">
                  <div className="flex items-center">
                    <Clock size={16} className="text-opep-blue mr-2" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">{trip.time}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Départ prévu</p>
                    </div>
                  </div>
                  <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">Durée est. ~4h</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Arrivée vers {parseInt(trip.time)+4}:00</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className={`text-xs font-bold ${trip.seats < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {trip.seats} sièges restants
                  </p>
                  <Link 
                    to={`/reservation/${trip.id}`}
                    className="bg-opep-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg"
                  >
                    Choisir
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start">
          <Info className="text-opep-blue mr-3 flex-shrink-0" size={20} />
          <p className="text-xs text-blue-800 leading-relaxed">
            Les tarifs affichés incluent les taxes et les frais de service OPEP. 
            Veuillez vous présenter à l'agence au moins 30 minutes avant le départ pour l'enregistrement des bagages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
