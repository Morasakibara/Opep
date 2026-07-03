import React from 'react';
import { Send, Paperclip, MoreVertical, Smile } from 'lucide-react';

const MESSAGES = [
  { id: 1, sender: 'Agence Douala', text: "Bonjour, le bus LT 492 CA est-il arrivé à Yaoundé ?", time: '10:30', isMe: false },
  { id: 2, sender: 'Moi', text: "Oui, il vient d'entrer dans la gare à l'instant.", time: '10:32', isMe: true },
  { id: 3, sender: 'Agence Douala', text: "Parfait, nous envoyons le manifeste pour le trajet retour.", time: '10:35', isMe: false },
];

export default function ChatWindow() {
  return (
    <section className="flex flex-col h-[650px] glass-card rounded-[32px] border border-charcoal_border bg-surface_container/40 overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-charcoal_border bg-surface_container/50 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            AD
          </div>
          <div>
            <h4 className="font-bold text-on_surface">Agence Douala Central</h4>
            <p className="text-[11px] text-success_green font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success_green rounded-full"></span> En ligne
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-surface_container_high rounded-full transition-colors text-on_surface_variant">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-surface_dim/30">
        <div className="text-center">
          <span className="text-[11px] font-bold text-on_surface_variant/50 uppercase tracking-widest bg-charcoal_border/20 px-3 py-1 rounded-full">Aujourd'hui</span>
        </div>

        {MESSAGES.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
              msg.isMe 
                ? 'bg-primary text-on_primary rounded-tr-none' 
                : 'bg-surface_container_high text-on_surface rounded-tl-none'
            }`}>
              <p>{msg.text}</p>
            </div>
            <span className="text-[10px] text-on_surface_variant font-bold mt-1.5 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-charcoal_border bg-surface_container/50 backdrop-blur-md">
        <div className="flex items-center gap-4 bg-surface_container_lowest border border-charcoal_border rounded-2xl px-4 py-2 focus-within:border-primary transition-all group shadow-inner">
          <button className="text-on_surface_variant hover:text-primary transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Écrire un message souverain..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-on_surface text-[14px] py-2 outline-none"
          />
          <button className="text-on_surface_variant hover:text-primary transition-colors">
            <Smile size={20} />
          </button>
          <button className="w-10 h-10 bg-primary text-on_primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Send size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
