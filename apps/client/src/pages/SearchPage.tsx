import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, User, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/apiClient';

const SearchPage = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [popularTrips, setPopularTrips] = useState<any[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPopularTrips();
  }, []);

  const loadPopularTrips = async () => {
    setLoadingPopular(true);
    try {
      const trips = await apiClient.getAvailableTrips();
      // Deduplicate by route for popular display
      const seen = new Set<string>();
      const unique = trips.filter((t: any) => {
        const key = `${t.route?.departureCity}-${t.route?.arrivalCity}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 6);
      setPopularTrips(unique);
    } catch {
      // Fallback silencieux - la section reste vide
    } finally {
      setLoadingPopular(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      navigate(`/results?from=${from}&to=${to}&date=${date}`);
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-opep-blue text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold italic tracking-tighter">OPEP</Link>
          <nav className="flex items-center space-x-6">
            <Link to="/profile" className="hover:text-opep-orange transition flex items-center">
              <User size={20} className="mr-2" />
              <span>Profil</span>
            </Link>
            {token ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                className="bg-white/20 px-4 py-2 rounded-lg font-bold hover:bg-white/30 transition"
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/login" className="bg-opep-orange px-4 py-2 rounded-lg font-bold hover:bg-white hover:text-opep-orange transition">Connexion</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Search */}
      <section className="bg-opep-blue pb-20 pt-10 px-4">
        <div className="container mx-auto text-center text-white mb-10">
          <h2 className="text-4xl font-extrabold mb-4">Voyagez partout au Cameroun</h2>
          <p className="text-xl opacity-90">Réservez votre place en quelques clics</p>
        </div>

        <form onSubmit={handleSearch} className="container mx-auto max-w-4xl bg-white p-6 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Départ</label>
              <div className="flex items-center border rounded-lg p-2 focus-within:border-opep-blue">
                <MapPin size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Yaoundé"
                  className="w-full outline-none text-gray-800"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Arrivée</label>
              <div className="flex items-center border rounded-lg p-2 focus-within:border-opep-blue">
                <MapPin size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Douala"
                  className="w-full outline-none text-gray-800"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Date</label>
              <div className="flex items-center border rounded-lg p-2 focus-within:border-opep-blue">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <input
                  type="date"
                  className="w-full outline-none text-gray-800"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-end">
              <button type="submit" className="w-full bg-opep-orange text-white py-3 rounded-lg font-bold flex items-center justify-center hover:opacity-90 transition shadow-lg">
                <Search size={20} className="mr-2" />
                Rechercher
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Results / Featured */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Trajets populaires</h3>

        {loadingPopular ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="text-opep-blue animate-spin" />
          </div>
        ) : popularTrips.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Aucun trajet disponible pour le moment.</p>
            <p className="text-sm mt-2">Utilisez la recherche ci-dessus pour trouver un voyage.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTrips.map((trip, i) => (
              <div key={trip.id || i} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-32 bg-gradient-to-br from-blue-400 to-opep-blue flex items-center justify-center text-white text-3xl font-black">
                  {trip.route?.departureCity || '?'} <span className="mx-2 text-lg">➔</span> {trip.route?.arrivalCity || '?'}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-bold text-opep-blue">{trip.agency?.name || 'Agence'}</p>
                      <h4 className="text-lg font-bold text-gray-900">{trip.route?.departureCity} ➔ {trip.route?.arrivalCity}</h4>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                      {trip.route?.basePrice ? `${trip.route.basePrice} FCFA` : 'Prix variable'}
                    </span>
                  </div>
                  <Link
                    to={`/results?from=${trip.route?.departureCity}&to=${trip.route?.arrivalCity}`}
                    className="block w-full border-2 border-opep-blue text-opep-blue py-2 rounded-lg font-bold hover:bg-opep-blue hover:text-white transition text-center"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
