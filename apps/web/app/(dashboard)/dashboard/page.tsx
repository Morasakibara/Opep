import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Ticket, 
  Bus, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Voyageurs aujourd\'hui', value: '1,284', icon: <Users className="text-blue-600" />, trend: '+12%', up: true },
    { label: 'Tickets vendus', value: '452', icon: <Ticket className="text-orange-600" />, trend: '+5%', up: true },
    { label: 'Revenus (XAF)', value: '1,840,000', icon: <TrendingUp className="text-green-600" />, trend: '-2%', up: false },
    { label: 'Bus actifs', value: '14/18', icon: <Bus className="text-purple-600" />, trend: 'Stable', up: true },
  ];

  const recentBookings = [
    { id: 'TK-8821', user: 'Jean Dupont', route: 'Yaoundé - Douala', time: 'Il y a 5 min', amount: '3,000 FCFA', status: 'Payé' },
    { id: 'TK-8820', user: 'Marie Ngo', route: 'Yaoundé - Bafoussam', time: 'Il y a 12 min', amount: '4,000 FCFA', status: 'Payé' },
    { id: 'TK-8819', user: 'Paul Biya', route: 'Douala - Kribi', time: 'Il y a 15 min', amount: '2,500 FCFA', status: 'En attente' },
    { id: 'TK-8818', user: 'Samuel Eto\'o', route: 'Yaoundé - Garoua', time: 'Il y a 22 min', amount: '15,000 FCFA', status: 'Payé' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Tableau de bord</h2>
        <p className="text-gray-500">Aperçu des performances de votre agence aujourd'hui.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Réservations récentes</h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">Voir tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-6 py-3">ID Ticket</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Trajet</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((booking, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{booking.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{booking.user}</p>
                      <p className="text-[10px] text-gray-400">{booking.time}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.route}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${booking.status === 'Payé' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Scanner un ticket</h3>
              <p className="text-sm text-gray-400 mb-6">Validez les passagers à l'embarquement rapidement.</p>
              <Link href="/scanner" className="inline-flex items-center bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                <QrCode size={20} className="mr-2" />
                Ouvrir le scanner
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <QrCode size={120} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Prochains départs</h3>
            <div className="space-y-4">
              {[
                { time: '14:30', bus: 'VIP-002', route: 'Douala', fill: '95%' },
                { time: '15:15', bus: 'STD-014', route: 'Bafoussam', fill: '60%' },
                { time: '16:00', bus: 'VIP-005', route: 'Kribi', fill: '25%' },
              ].map((departure, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="bg-blue-50 text-opep-blue font-black p-2 rounded-lg text-sm w-16 text-center">
                    {departure.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{departure.route}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">{departure.bus}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-700">{departure.fill}</p>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: departure.fill }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
