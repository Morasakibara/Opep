'use client';

import React, { useState } from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle2, MoreVertical } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Nouveau trajet créé',
    description: 'Le trajet Douala - Yaoundé (LT-982-AZ) a été ajouté.',
    time: 'Il y a 5 min',
    type: 'success',
    isRead: false,
  },
  {
    id: 2,
    title: 'Alerte disponibilité',
    description: 'Manque de chauffeurs pour demain matin à Bafoussam.',
    time: 'Il y a 12 min',
    type: 'warning',
    isRead: false,
  },
  {
    id: 3,
    title: 'Mise à jour système',
    description: 'Le module Analytics a été mis à jour vers la v2.1.',
    time: 'Il y a 1h',
    type: 'info',
    isRead: true,
  }
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-surface_container_high rounded-full text-on_surface_variant transition-all hover:text-primary group active:scale-90"
        title="Notifications"
      >
        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary border-2 border-surface_container rounded-full animate-pulse"></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-[380px] bg-surface_container_lowest border border-charcoal_border rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center bg-surface_container/30 backdrop-blur-md">
              <div>
                <h3 className="text-[18px] font-bold text-on_surface">Notifications</h3>
                <p className="text-[11px] text-on_surface_variant uppercase tracking-widest font-bold mt-1">3 non lues</p>
              </div>
              <button className="text-on_surface_variant hover:text-primary transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 border-b border-charcoal_border hover:bg-primary/5 transition-all cursor-pointer group flex gap-4 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    notif.type === 'success' ? 'bg-success_green/10 text-success_green' :
                    notif.type === 'warning' ? 'bg-warning_yellow/10 text-warning_yellow' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {notif.type === 'success' && <CheckCircle2 size={18} />}
                    {notif.type === 'warning' && <AlertTriangle size={18} />}
                    {notif.type === 'info' && <Info size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-[14px] font-bold text-on_surface truncate group-hover:text-primary transition-colors ${!notif.isRead ? 'pr-2' : ''}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>}
                    </div>
                    <p className="text-[12px] text-on_surface_variant mt-1 leading-relaxed line-clamp-2">
                      {notif.description}
                    </p>
                    <p className="text-[10px] text-on_surface_variant/60 font-bold uppercase tracking-tighter mt-3 flex items-center gap-1.5">
                      <X size={10} className="rotate-45" /> {notif.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-surface_container/30 text-[12px] font-bold text-primary uppercase tracking-widest hover:bg-primary/10 transition-all">
              Voir tout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
