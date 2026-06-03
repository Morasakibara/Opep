import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Bus, 
  Map, 
  Ticket, 
  Users, 
  Settings, 
  LogOut, 
  QrCode,
  Bell,
  Search
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', href: '/dashboard' },
    { icon: <Bus size={20} />, label: 'Gestion des Bus', href: '/buses' },
    { icon: <Map size={20} />, label: 'Lignes & Trajets', href: '/trips' },
    { icon: <Ticket size={20} />, label: 'Réservations', href: '/reservations' },
    { icon: <QrCode size={20} />, label: 'Scanner QR', href: '/scanner' },
    { icon: <Users size={20} />, label: 'Personnel', href: '/staff' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-black italic tracking-tighter text-blue-400">OPEP AGENCE</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-white/10 transition text-gray-300 hover:text-white"
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link href="/settings" className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-white/10 transition text-gray-300">
            <Settings size={20} />
            <span className="font-medium text-sm">Paramètres</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-red-500/10 transition text-red-400">
            <LogOut size={20} />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
            <Search size={18} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Rechercher un ticket, un passager..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">3</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Finexs Voyages</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Administrateur</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                FV
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
