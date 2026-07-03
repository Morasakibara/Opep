import React from 'react';
import { Bus, MapPin, Clock } from 'lucide-react';

const UPCOMING_TRIPS = [
  { id: 'T-9821', route: 'Douala - Yaoundé', time: '14:30', price: '3,000', available: 12 },
  { id: 'T-9822', route: 'Douala - Bafoussam', time: '15:00', price: '4,500', available: 8 },
  { id: 'T-9823', route: 'Douala - Kribi', time: '16:15', price: '2,500', available: 2 },
];

export default function TripSelector() {
  return (
    <section className="glass-card p-6 rounded-[24px] border border-charcoal_border bg-surface_container/50">
      <h3 className="text-[18px] font-bold text-on_surface mb-6 flex items-center gap-2">
        <Bus size={20} className="text-primary" /> Sélection du Trajet
      </h3>

      <div className="space-y-4">
        {UPCOMING_TRIPS.map((trip) => (
          <div 
            key={trip.id} 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group ${
              trip.available <= 2 
                ? 'border-error_red/20 bg-error_red/5' 
                : 'border-charcoal_border bg-surface_container_low hover:border-primary/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[16px] font-bold text-on_surface group-hover:text-primary transition-colors">{trip.route}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[12px] text-on_surface_variant flex items-center gap-1">
                    <Clock size={14} /> {trip.time}
                  </p>
                  <p className="text-[12px] text-on_surface_variant flex items-center gap-1">
                    <MapPin size={14} /> {trip.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-primary">{trip.price} <span className="text-[10px]">XAF</span></p>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                  trip.available <= 2 ? 'text-error_red' : 'text-on_surface_variant'
                }`}>
                  {trip.available} places dispos
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
