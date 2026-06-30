import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Filter, ArrowLeft, Clock, Info, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../lib/apiClient';

interface Trip {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime?: string;
  basePrice: number;
  availableSeats: number;
  bus?: { type?: string; plateNumber?: string };
  agency?: { name: string };
  route?: { departureCity: string; arrivalCity: string; estimatedDurationMinutes?: number };
}

const ResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'earliest' | 'cheapest'>('earliest');

  useEffect(() => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    apiClient.searchTrips(from, to, date || undefined)
      .then(data => {
        setTrips(data);
      })
      .catch(err => {
        setError(err.message || 'Erreur de recherche');
      })
      .finally(() => setLoading(false));
  }, [from, to, date]);

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortBy === 'cheapest') return a.basePrice - b.basePrice;
    return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
  });

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function getArrivalTime(trip: Trip) {
    if (trip.arrivalTime) return formatTime(trip.arrivalTime);
    if (trip.route?.estimatedDurationMinutes) {
      const dep = new Date(trip.departureTime);
      dep.setMinutes(dep.getMinutes() + trip.route.estimatedDurationMinutes);
      return formatTime(dep.toISOString());
    }
    const dep = new Date(trip.departureTime);
    dep.setHours(dep.getHours() + 4);
    return formatTime(dep.toISOString());
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-opep-blue text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="mr-4 hover:bg-white/20 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{from} ➔ {to}</h2>
            <p className="text-xs opacity-80">
              {date ? formatDate(date) : 'Recherche'} • 1 Passager
            </p>
          </div>
          <button className="bg-white/20 p-2 rounded-lg">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-opep-blue animate-spin mb-4" />
            <p className="text-gray-500 font-bold">Recherche des trajets...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
            <AlertCircle size={32} className="mx-auto mb-3" />
            <p className="font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-600 font-medium">{sortedTrips.length} trajet{sortedTrips.length !== 1 ? 's' : ''} trouvé{sortedTrips.length !== 1 ? 's' : ''}</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'earliest' | 'cheapest')}
                className="bg-transparent text-sm font-bold text-opep-blue outline-none"
              >
                <option value="earliest">Le plus tôt</option>
                <option value="cheapest">Prix croissant</option>
              </select>
            </div>

            {sortedTrips.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-400 font-bold">Aucun trajet trouvé pour cette recherche.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedTrips.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-opep-blue transition group">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-xl font-black text-gray-400">
                              {trip.agency?.name?.[0] || 'O'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{trip.agency?.name || 'OPEP Voyages'}</h4>
                            <div className="flex items-center text-xs text-gray-500 space-x-2">
                              <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-[10px]">
                                {trip.bus?.type || trip.bus?.plateNumber || 'Bus'}
                              </span>
                              <span className="flex items-center"><ShieldCheck size={12} className="mr-1 text-green-500" /> Garanti</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900">
                            {new Intl.NumberFormat('fr-FR').format(trip.basePrice)} <span className="text-sm font-normal text-gray-500">FCFA</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-4 border-t border-b border-dashed border-gray-100">
                        <div className="flex items-center">
                          <Clock size={16} className="text-opep-blue mr-2" />
                          <div>
                            <p className="text-lg font-bold text-gray-900">{formatTime(trip.departureTime)}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Départ prévu</p>
                          </div>
                        </div>
                        <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            Durée est. {trip.route?.estimatedDurationMinutes 
                              ? `${Math.floor(trip.route.estimatedDurationMinutes / 60)}h${trip.route.estimatedDurationMinutes % 60}min` 
                              : '~4h'}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Arrivée vers {getArrivalTime(trip)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className={`text-xs font-bold ${trip.availableSeats < 10 ? 'text-red-500' : 'text-green-600'}`}>
                          {trip.availableSeats} sièges restants
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
            )}

            <div className="mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start">
              <Info className="text-opep-blue mr-3 flex-shrink-0" size={20} />
              <p className="text-xs text-blue-800 leading-relaxed">
                Les tarifs affichés incluent les taxes et les frais de service OPEP. 
                Veuillez vous présenter à l'agence au moins 30 minutes avant le départ pour l'enregistrement des bagages.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
