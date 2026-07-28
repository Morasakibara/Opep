'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell, Info, AlertTriangle, CheckCircle2, X,
  Filter, CheckCheck, Search, ArrowUpRight,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { notificationsApi } from '@/services/api.service';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: React.ReactNode; badge: string }> = {
  info: { icon: <Info size={16} />, badge: 'bg-primary/10 text-primary' },
  warning: { icon: <AlertTriangle size={16} />, badge: 'bg-warning_yellow/10 text-warning_yellow' },
  success: { icon: <CheckCircle2 size={16} />, badge: 'bg-success_green/10 text-success_green' },
  error: { icon: <X size={16} />, badge: 'bg-error_red/10 text-error_red' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsApi.getMyNotifications();
      setNotifications(data as Notification[]);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Notifications</h2>
          <p className="text-on_surface_variant">Centre de notifications et alertes système.</p>
        </div>
      </div>

      {/* Stats + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="flex items-center gap-3">
          <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            <span className="text-sm font-bold text-on_surface">{notifications.length} total</span>
          </div>
          <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-bold text-on_surface">{unreadCount} non lues</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${
              filter === 'all'
                ? 'bg-primary text-on_primary'
                : 'glass-card text-on_surface_variant hover:text-on_surface'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${
              filter === 'unread'
                ? 'bg-primary text-on_primary'
                : 'glass-card text-on_surface_variant hover:text-on_surface'
            }`}
          >
            Non lues
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-error_red" size={24} />
            <p className="font-bold text-on_surface">{error}</p>
          </div>
          <button onClick={loadNotifications} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all">Réessayer</button>
        </div>
      )}

      {/* List */}
      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Bell size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">
                {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((notif, i) => (
                <div
                  key={notif.id}
                  className={`p-5 flex gap-4 items-start hover:bg-primary/5 hover:translate-x-0.5 transition-all group ${
                    !notif.isRead ? 'bg-primary/3' : ''
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConfig[notif.type]?.badge || 'bg-primary/10 text-primary'}`}>
                    {typeConfig[notif.type]?.icon || <Info size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-on_surface">{notif.title}</p>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-on_surface_variant mt-1">{notif.description}</p>
                    <p className="text-[10px] text-on_surface_variant/60 mt-2 font-medium">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
                    </p>
                  </div>
                  <ArrowUpRight size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
