'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Search, Send, User, Clock,
  AlertCircle, Paperclip, ChevronRight, Star,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { messagesApi } from '@/services/api.service';

interface Message {
  id: string;
  senderName: string;
  subject: string;
  preview: string;
  isRead: boolean;
  isUrgent: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    setError(null);
    try {
      const data = await messagesApi.getAll();
      setMessages(data as Message[]);
    } catch (err: any) {
      const msg = err.message || 'Erreur de chargement';
      setError(msg);
      toast.error('Messages', msg);
    } finally {
      setLoading(false);
    }
  }

  const filtered = messages.filter((m) =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Messages</h2>
          <p className="text-on_surface_variant">Boîte de réception et communications internes.</p>
        </div>
        <button className="px-5 py-3 bg-primary text-on_primary font-bold rounded-2xl text-sm hover:brightness-110 transition-all active:scale-95 flex items-center gap-2">
          <Send size={16} /> Nouveau message
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <MessageSquare size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{messages.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Total messages</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <User size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{messages.filter((m) => !m.isRead).length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Non lus</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <Star size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{messages.filter((m) => m.isUrgent).length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Urgents</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <p className="font-bold text-on_surface">{error}</p>
          </div>
          <button onClick={loadMessages} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher un message..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <MessageSquare size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">
                {searchQuery ? 'Aucun message trouvé' : 'Aucun message'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((msg, i) => (
                <div key={msg.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {msg.senderName?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface truncate">{msg.subject}</p>
                      {msg.isUrgent && <span className="text-[10px] bg-error_red/10 text-error_red font-bold px-2 py-0.5 rounded-full">URGENT</span>}
                    </div>
                    <p className="text-xs text-on_surface_variant mt-0.5 truncate">{msg.preview}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-on_surface_variant/60">{msg.senderName}</span>
                      <span className="text-[10px] text-on_surface_variant/40">•</span>
                      <span className="text-[10px] text-on_surface_variant/60 flex items-center gap-1">
                        <Clock size={10} />
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
                      </span>
                    </div>
                  </div>
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  <ChevronRight size={16} className="text-on_surface_variant/30 group-hover:text-primary transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
