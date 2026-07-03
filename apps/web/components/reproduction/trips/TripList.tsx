import React from 'react';
import { MapPin, Clock, Users, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const TRIPS = [
  {
    id: 'T-9821',
    departure: 'Douala (Akwa)',
    arrival: 'Yaoundé (Mvan)',
    time: '07:30',
    bus: 'LT 492 CA',
    seats: '42/70',
    status: 'BOARDING',
    color: 'primary'
  },
  {
    id: 'T-9822',
    departure: 'Yaoundé (Mvan)',
    arrival: 'Bafoussam (Simbock)',
    time: '09:00',
    bus: 'CE 881 AB',
    seats: '12/30',
    status: 'SCHEDULED',
    color: 'tertiary'
  },
  {
    id: 'T-9823',
    departure: 'Douala (Akwa)',
    arrival: 'Kribi (Centre)',
    time: '11:15',
    bus: 'LT 503 EF',
    seats: '55/55',
    status: 'FULL',
    color: 'error_red'
  }
];

export default function TripList() {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-on_surface">Trajets du jour</h3>
        <button className="text-primary hover:underline text-[12px] font-bold uppercase tracking-widest">Tout voir</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TRIPS.map((trip) => (
          <div 
            key={trip.id} 
            className="glass-card p-6 rounded-2xl border border-charcoal_border bg-surface_container/50 hover:border-primary/50 transition-all flex flex-col md:flex-row items-center gap-6 group"
          >
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="w-12 h-12 rounded-xl bg-surface_container_high flex items-center justify-center text-primary shadow-inner">
                <Clock size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-bold text-on_surface">{trip.departure}</span>
                  <ArrowRight size={18} className="text-on_surface_variant group-hover:translate-x-1 transition-transform" />
                  <span className="text-[18px] font-bold text-on_surface">{trip.arrival}</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-on_surface_variant text-[12px] flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-primary" /> {trip.id} • {trip.time}
                  </p>
                  <p className="text-on_surface_variant text-[12px] flex items-center gap-1.5 font-medium">
                    <Users size={14} className="text-primary" /> {trip.seats} passagers
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <p className="text-on_surface_variant text-[10px] uppercase tracking-widest font-bold mb-1">Status</p>
                <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase ${
                  trip.status === 'BOARDING' ? 'bg-primary/20 text-primary' :
                  trip.status === 'FULL' ? 'bg-error_red/20 text-error_red' :
                  'bg-surface_container_highest text-on_surface_variant'
                }`}>
                  {trip.status}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-charcoal_border hidden md:block"></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl border-charcoal_border">Gérer</Button>
                <button className="p-2 hover:bg-surface_container_high rounded-lg transition-colors text-on_surface_variant">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
