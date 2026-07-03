import React from 'react';
import { MoreVertical, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

const BUSES = [
  {
    id: 'LT 492 CA',
    model: 'Mercedes-Benz Tourismo (2023)',
    status: 'ACTIF',
    statusType: 'primary',
    capacity: 70,
    mileage: '12,450 km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA642ETJenAC14xUztknNM5fqRssExwnPi-24B2Def_gUUEXSMIexszon5qFyQcijxARQTjQV7x4wROkqiRHBhLYVtFX0hrp-EQiROVRCH27ik4qAh6ibnnClkHE63S_V1xMKyFfjdbwZumuMRjtl9Rcltc3QsAdz4JnmT-0ElW8D07PN0hOSFtMvaStqIXq3kl9TrHffWL7npxjhs35I0eq-uJBY1kHrU7JKh227rtnmsfkpdzauolFTnpepfo7DaWj46XbU8ghPs'
  },
  {
    id: 'CE 881 AB',
    model: 'Toyota Coaster (2021)',
    status: 'MAINTENANCE',
    statusType: 'warning',
    capacity: 30,
    nextService: 'Dans 2j',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3ErNmQmYdtVn4uXy7pjmCYPUecjwg9SXYskSzSnR70HSqOJB9Cu8JyfNZDmopu2_wH7JT8MSLpDgdIqWxyq-3WDuJSLxcnaTmrF3ByXlrRDZgXI3WS4s-iaKohkt9hUD5FPpXKz-Nt8iidSYorPKlKOwbkE2CIGNPPWaUe_LXMVDYuG7_ljmfImOe1I3uHGpSklM32W615ZNV1IjH8REK_o566Exn6SKoZTxWYTylIwM0N04EdQ1TX1ugmv0-E8ZyXdG63-1nboM'
  },
  {
    id: 'LT 503 EF',
    model: 'Yutong ZK6122H9 (2024)',
    status: 'ACTIF',
    statusType: 'primary',
    capacity: 55,
    mileage: '5,800 km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc98yI_0RazsAgoPNtcZA_T0kidD0544cz7S86Advyhl-cWcxZ3YrMV_OFf8PsinlXmuZKe_VSbR-xeNfi7t1rAt7JjKoomp0_ULbDhYNrDBv1v_FiiFDOmcUZyEAf7oaqTfqLLYdt7TZijHGZyleINLHAqLyijIy2V_efqcI9-EL81mmvydLUyhaRzrHcX-QVRZ-9flLd_fFbKSDDfD4VFUpKbn9HlbaFD_Z40L_R1ZyBvUcjDv692xFJV-aoU1ey7SAPR7RVCIY'
  },
  {
    id: 'CE 412 BB',
    model: 'Scania Touring (2022)',
    status: 'ACTIF',
    statusType: 'primary',
    capacity: 62,
    mileage: '34,100 km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1PYwmlW1iCnOGTerkKFWZ6-ug-wnvtmuOUU0cALCMr50Em03wbKYaPAe8DOkWED7zRYU9we8DRa8gwQlRBQvKUrU3271QHYJJRr0qHOgG8frSF2xlZteGWpZQBI16iYf4THCil7PhVeOBQasUonfLCAWunN7ScmfWp64ojPCJt7_st2bRKB3PI-p2NXkR5RpwEtZuKjx4-LwsZfx8RjmVs2pjcsbS7ryL9CZz-EXl5ISR9vqtaagu4cNO9VBhkXk_xAfpJys23DE'
  }
];

export default function BusList() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 p-1 bg-surface_container_high rounded-xl">
          <button className="bg-primary text-on_primary px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider">Tous</button>
          <button className="text-on_surface_variant hover:text-on_surface px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-colors">Actifs</button>
          <button className="text-on_surface_variant hover:text-on_surface px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-colors">Maintenance</button>
        </div>
        <div className="flex items-center gap-3 text-on_surface_variant text-[12px] font-bold uppercase tracking-widest">
          Trier par: 
          <select className="bg-surface_container_high border border-charcoal_border rounded-lg text-on_surface text-[12px] py-2 pl-3 pr-8 focus:ring-primary focus:border-primary outline-none cursor-pointer">
            <option>Dernière activité</option>
            <option>Immatriculation</option>
            <option>Capacité</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {BUSES.map((bus, idx) => (
          <BusCard key={idx} bus={bus} />
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-charcoal_border">
        <p className="text-on_surface_variant text-[12px]">Affichage de 4 sur 42 véhicules</p>
        <div className="flex gap-2">
          <PaginationButton icon={<ChevronLeft size={18} />} disabled />
          <PaginationButton label="1" active />
          <PaginationButton label="2" />
          <PaginationButton label="3" />
          <PaginationButton icon={<ChevronRight size={18} />} />
        </div>
      </div>
    </section>
  );
}

function BusCard({ bus }: { bus: any }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-charcoal_border bg-surface_container/50 hover:border-primary/50 transition-all flex flex-col sm:flex-row h-auto sm:h-48 group shadow-lg shadow-black/10">
      <div className="w-full sm:w-1/3 h-40 sm:h-full relative overflow-hidden">
        <Image fill className="object-cover group-hover:scale-110 transition-transform duration-500" src={bus.image} alt={bus.model} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/20"></div>
        <div className="absolute bottom-3 left-3 sm:hidden">
          <h3 className="text-white font-bold text-xl">{bus.id}</h3>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-bold text-on_surface">{bus.id}</h3>
              <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border ${
                bus.statusType === 'primary' 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-warning_yellow/10 text-warning_yellow border-warning_yellow/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${bus.statusType === 'primary' ? 'bg-primary' : 'bg-warning_yellow'}`}></span>
                {bus.status}
              </span>
            </div>
            <p className="text-on_surface_variant text-[12px] mt-1">{bus.model}</p>
          </div>
          <button className="text-on_surface_variant hover:text-primary transition-colors p-1">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-0">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-on_surface_variant text-[10px] uppercase tracking-widest font-bold">Capacité</span>
              <span className="text-[14px] font-bold text-on_surface flex items-center gap-1.5 mt-1">
                <Users size={16} className="text-primary" /> {bus.capacity} Sièges
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-on_surface_variant text-[10px] uppercase tracking-widest font-bold">
                {bus.nextService ? 'Maintenance' : 'Kilométrage'}
              </span>
              <span className={`text-[14px] font-bold mt-1 ${bus.nextService ? 'text-warning_yellow' : 'text-on_surface'}`}>
                {bus.nextService || bus.mileage}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex border-charcoal_border rounded-full text-[12px]">
            Détails
          </Button>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({ icon, label, active = false, disabled = false }: any) {
  return (
    <button 
      disabled={disabled}
      className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
        active 
          ? "bg-primary text-on_primary border-primary shadow-lg shadow-primary/20" 
          : "border-charcoal_border text-on_surface_variant hover:text-primary hover:border-primary disabled:opacity-30 bg-surface_container_high/50"
      }`}
    >
      {icon || <span className="text-[13px] font-bold">{label}</span>}
    </button>
  );
}
