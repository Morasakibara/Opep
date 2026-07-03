import React from 'react';
import { ArrowRight } from 'lucide-react';

const NOTES = [
  {
    title: 'Alerte Disponibilité',
    content: 'Manque de chauffeurs pour le trajet Douala - Yaoundé de demain soir.',
    type: 'warning',
    borderColor: 'border-l-warning_yellow',
    textColor: 'text-warning_yellow'
  },
  {
    title: 'Formation Terminée',
    content: '12 nouveaux contrôleurs ont validé leur certification QR.',
    type: 'success',
    borderColor: 'border-l-success_green',
    textColor: 'text-success_green'
  }
];

export default function InternalNotes() {
  return (
    <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col gap-6 shadow-sm">
      <h4 className="text-[18px] font-bold text-primary">Notes Internes</h4>
      <div className="flex flex-col gap-4">
        {NOTES.map((note, index) => (
          <div key={index} className={`bg-surface_container_lowest p-4 rounded-lg border-l-4 ${note.borderColor} shadow-sm transition-transform hover:scale-[1.02] cursor-pointer`}>
            <p className={`text-[14px] font-bold ${note.textColor}`}>{note.title}</p>
            <p className="text-[12px] mt-1 text-on_surface_variant leading-relaxed">{note.content}</p>
          </div>
        ))}
      </div>
      <button className="mt-auto py-2 text-primary font-bold text-[14px] flex items-center justify-center gap-2 hover:underline transition-all active:scale-95">
        Voir toutes les notes <ArrowRight size={16} />
      </button>
    </div>
  );
}
