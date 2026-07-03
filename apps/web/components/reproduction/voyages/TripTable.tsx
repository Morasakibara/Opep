import React from 'react';
import { MapPin, MoreVertical, Eye, RotateCw, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

const TRIPS = [
  {
    from: 'Douala (Littoral)',
    to: 'Yaoundé (Centre)',
    time: 'Today, 14:30',
    subTime: 'Exp. arrival 18:00',
    plate: 'LT-982-AZ',
    price: '6 500',
    status: 'Boarding',
    statusType: 'warning',
  },
  {
    from: 'Bafoussam (West)',
    to: 'Foumban (West)',
    time: 'Today, 16:00',
    subTime: 'Inter-city Shuttle',
    plate: 'OU-104-BB',
    price: '3 500',
    status: 'Scheduled',
    statusType: 'primary',
  },
  {
    from: 'Garoua (North)',
    to: 'Ngaoundéré (Adamawa)',
    time: 'Today, 06:15',
    subTime: 'Arrived 11:45',
    plate: 'NO-552-RT',
    price: '12 000',
    status: 'Completed',
    statusType: 'success',
    dimmed: true,
  },
  {
    from: 'Limbe (South West)',
    to: 'Douala (Littoral)',
    time: 'Today, 14:45',
    subTime: 'VIP Express',
    plate: 'SW-012-CX',
    price: '5 000',
    status: 'Boarding',
    statusType: 'warning',
  },
  {
    from: 'Bamenda (North West)',
    to: 'Mbouda (West)',
    time: 'Today, 15:00',
    subTime: 'Cancelled due to weather',
    plate: 'NW-778-MM',
    price: '4 000',
    status: 'Cancelled',
    statusType: 'error',
    error: true,
  }
];

export default function TripTable() {
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-charcoal_border bg-surface_container/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface_container_low text-on_surface_variant text-[12px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Departure</th>
              <th className="px-6 py-4">Arrival</th>
              <th className="px-6 py-4">Date/Time</th>
              <th className="px-6 py-4">Bus Plate</th>
              <th className="px-6 py-4 text-right">Price (FCFA)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="text-[14px] divide-y divide-charcoal_border">
            {TRIPS.map((trip, index) => (
              <tr key={index} className={`hover:bg-primary/5 transition-colors group ${trip.dimmed ? 'opacity-70' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface_container_highest flex items-center justify-center">
                      {trip.error ? <XCircle size={16} className="text-error_red" /> : <MapPin size={16} className="text-primary" />}
                    </div>
                    <span className="font-medium text-on_surface">{trip.from}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-on_surface">{trip.to}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-on_surface">{trip.time}</span>
                    <span className={`text-[12px] ${trip.error ? 'text-error_red' : 'text-on_surface_variant'}`}>{trip.subTime}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono px-2 py-1 rounded text-[12px] uppercase bg-surface_container_high text-on_surface ${trip.error ? 'border border-error_red/20' : ''}`}>
                    {trip.plate}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-on_surface">{trip.price}</td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={trip.status} type={trip.statusType} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-on_surface_variant group-hover:text-primary transition-colors">
                    {trip.status === 'Completed' ? <Eye size={18} /> : trip.status === 'Cancelled' ? <RotateCw size={18} /> : <MoreVertical size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-charcoal_border flex items-center justify-between bg-surface_container_low/50">
        <p className="text-[12px] text-on_surface_variant">Showing 1-5 of 48 active trips</p>
        <div className="flex gap-2">
          <PaginationButton icon={<ChevronLeft size={16} />} disabled />
          <PaginationButton label="1" active />
          <PaginationButton label="2" />
          <PaginationButton label="3" />
          <PaginationButton icon={<ChevronRight size={16} />} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, type }: { status: string; type: string }) {
  const styles = {
    warning: "bg-warning_yellow/10 text-warning_yellow border-warning_yellow/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success_green/10 text-success_green border-success_green/20",
    error: "bg-error_red/10 text-error_red border-error_red/20",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[type as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

function PaginationButton({ icon, label, active = false, disabled = false }: { icon?: React.ReactNode; label?: string; active?: boolean; disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
        active 
          ? "bg-primary text-on_primary border-primary shadow-sm" 
          : "border-charcoal_border text-on_surface hover:bg-surface_container_high disabled:opacity-30"
      }`}
    >
      {icon || <span className="text-[12px] font-bold">{label}</span>}
    </button>
  );
}
