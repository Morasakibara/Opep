'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  Search,
  BarChart3,
  X,
  User,
  ChevronDown
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', href: '/dashboard' },
    { icon: <Bus size={20} />, label: 'Gestion des Bus', href: '/buses' },
    { icon: <Map size={20} />, label: 'Lignes & Trajets', href: '/trips' },
    { icon: <Ticket size={20} />, label: 'Réservations', href: '/reservations' },
    { icon: <QrCode size={20} />, label: 'Scanner QR', href: '/scanner' },
    { icon: <Users size={20} />, label: 'Personnel', href: '/employees' },
    { icon: <BarChart3 size={20} />, label: 'Rapports', href: '/reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear cookies if any (mocking here)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    router.push('/login');
  };

  const notifications = [
    { id: 1, title: 'Nouveau bus ajouté', time: 'Il y a 2 min', read: false },
    { id: 2, title: 'Réservation VIP confirmée', time: 'Il y a 15 min', read: false },
    { id: 3, title: 'Alerte maintenance STD-012', time: 'Il y a 1 heure', read: true },
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
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition font-medium text-sm ${
                pathname === item.href 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link 
            href="/settings" 
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition font-medium text-sm ${
              pathname === '/settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings size={20} />
            <span>Paramètres</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-red-500/10 transition text-red-400"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 relative z-50">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
            <Search size={18} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Rechercher un ticket, un passager..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">2</span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}><X size={14} className="text-gray-400" /></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${!n.read ? 'bg-blue-50/30' : ''}`}>
                        <p className="text-xs font-bold text-gray-900">{n.title}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-xs font-bold text-blue-600 hover:bg-gray-50 transition">
                    Voir tout
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-1 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-900">Finexs Voyages</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Administrateur</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold relative">
                  FV
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-2">
                    <Link 
                      href="/settings" 
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700"
                    >
                      <User size={18} className="text-gray-400" />
                      <span>Mon Profil</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700"
                    >
                      <Settings size={18} className="text-gray-400" />
                      <span>Paramètres</span>
                    </Link>
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition text-sm text-red-600"
                    >
                      <LogOut size={18} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
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
