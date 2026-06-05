import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, User } from 'lucide-react';

const SearchPage = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      navigate(`/results?from=${from}&to=${to}&date=${date}`);
    }
  };

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
            <Link to="/login" className="bg-opep-orange px-4 py-2 rounded-lg font-bold hover:bg-white hover:text-opep-orange transition">Connexion</Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { from: 'Yaoundé', to: 'Douala', price: '3000 FCFA', agency: 'Finexs' },
            { from: 'Douala', to: 'Bafoussam', price: '4000 FCFA', agency: 'General Express' },
            { from: 'Yaoundé', to: 'Garoua', price: '15000 FCFA', agency: 'Touristique' },
          ].map((trip, i) => (
            <div key={i} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-opep-blue">{trip.agency}</p>
                    <h4 className="text-lg font-bold text-gray-900">{trip.from} ➔ {trip.to}</h4>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">{trip.price}</span>
                </div>
                <button className="w-full border-2 border-opep-blue text-opep-blue py-2 rounded-lg font-bold hover:bg-opep-blue hover:text-white transition">
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
