import React from 'react';
import { Banknote, Truck, ShieldCheck, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const STAFF = [
  {
    name: 'Abena Marie-Louise',
    id: 'STF-2023-089',
    role: 'Caissier',
    icon: <Banknote size={16} className="text-tertiary" />,
    contact: '+237 670 112 233',
    email: 'm.abena@opep.cm',
    lastActivity: "Aujourd'hui, 08:45",
    status: 'Actif',
    statusType: 'success',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfD28wUpmmWhpLqxIDOctenNPuVgxcNno_yX8ppBCd3AbyF-LeS3a-wgPVAlL-MRH3vxwpdUrFXuh-ziQy_Z8SZHfA3Oi8McL8zBtU8PANTvUaFsDGKufKIBBXfoY_v2-dpzUjaeIkGpAfKKiejjBnkIXqgvqDPqEQ00Kprr6KDJuHkOPSkYmFyQb_YaD6WJxwLI7iZX65VeQlkthCCY1OOBjGFVzfbFPsnscCe2cc4-XJ3saQ6zeJUyH12JLxoPMPzc-JiECm8Hg'
  },
  {
    name: "Eto'o Jean-Paul",
    id: 'STF-2022-142',
    role: 'Chauffeur',
    icon: <Truck size={16} className="text-primary" />,
    contact: '+237 699 445 566',
    email: 'jp.etoo@opep.cm',
    lastActivity: 'En cours de trajet',
    status: 'En Mission',
    statusType: 'warning',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI2GUPjdd5aTWB_NR6MlUdgk8tZ3raw1WZHyzmPi4wMO3G95Q42H2t9u9OXbUNiOpRcoLcrKCCjYINz39zzCBpd519dXebFZLPCtwaevP_f2YYBqUCU81bAhRf2U_t839uL0951XePgyjhdxqD7Nk6Mbyb7RRzzjHnWT-x3kgMLdznSFTzw_l2QeOW0hmsBs-3SpZ-p3MxSP3WieeqIDZzwA7wxx39Syjbq8X4IAmQh1lZB3KUOvGAZwvUFPqs82-nC6BShit_9_0'
  },
  {
    name: 'Moussa Ibrahim',
    id: 'STF-2023-045',
    role: 'Contrôleur',
    icon: <ShieldCheck size={16} className="text-secondary" />,
    contact: '+237 677 889 900',
    email: 'i.moussa@opep.cm',
    lastActivity: 'Hier, 19:20',
    status: 'Hors Ligne',
    statusType: 'neutral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLdngpyK0PI1XUhx87Jv45ywzUS6NW8B_BKl7IQUDKEFCPdVZpLINZlAR49SR0fY6BEYRXzbOTeSVf_Z1Pj1kVMJY7qBNO8hOAEelh0NY0GtnY6ZUzQ85XKBWEv3PiirsMedbru8OFuP1nYnfHMJJDP3npyB7W0CvIUFTejf0wTcasc4hrB9D1Q-1k5mPQoFmvxHSDHLYWl-_cQeLwohIVAmp_pmxViD54garPky_8KdODja6a_hsd4CIIHKTbG5mVyyMjYYGHxSk'
  },
  {
    name: 'Ngono Samuel',
    id: 'STF-2024-002',
    role: 'Caissier',
    icon: <Banknote size={16} className="text-tertiary" />,
    contact: '+237 655 443 322',
    email: 's.ngono@opep.cm',
    lastActivity: 'Il y a 5 min',
    status: 'Actif',
    statusType: 'success',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKo1oicxgaFi5wZJjt5oM5rs2XUhkXgWAvPRfrf-gszeW4O4oSJ4kVsNw5VcHZ2-omq5jEDhr829GYWpxb66QTRx5n2cqK97gQRF3TfWeQaYegsQ6gN-Gt3yJ6NwhW7HD8ieAR7yhz0t-dxOe9LPq_x-x96Aqpv7rnJ7SkO0qIL5RunZw1areIv7uzHI4m2DGJPVxa2C6GQGG5H6CKTkjJTlfXTTfodtjsfgQPa9Yob7hLIksW37sVnuc9WwTX1q3XW1yIFuyc-K0'
  }
];

export default function StaffTable() {
  return (
    <div className="bg-surface_container_lowest border border-charcoal_border rounded-xl overflow-hidden flex flex-col shadow-sm">
      <div className="p-6 border-b border-charcoal_border flex justify-between items-center bg-surface_container/30 backdrop-blur-md">
        <h3 className="text-[18px] font-bold text-on_surface">Liste des Employés</h3>
        <div className="flex gap-2">
          <select className="bg-surface_container_low border border-charcoal_border rounded-lg text-[12px] text-on_surface px-4 py-2 focus:border-primary outline-none">
            <option>Tous les Rôles</option>
            <option>Caissier</option>
            <option>Contrôleur</option>
            <option>Chauffeur</option>
          </select>
          <select className="bg-surface_container_low border border-charcoal_border rounded-lg text-[12px] text-on_surface px-4 py-2 focus:border-primary outline-none">
            <option>Statut: Tous</option>
            <option>Actif</option>
            <option>En congé</option>
            <option>Inactif</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface_container_low text-on_surface_variant text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Employé</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Dernière Activité</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal_border">
            {STAFF.map((member, index) => (
              <tr key={index} className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image width={40} height={40} className="rounded-full object-cover border border-charcoal_border shadow-sm" src={member.image} alt={member.name} />
                    <div>
                      <p className="text-[14px] font-bold text-on_surface group-hover:text-primary transition-colors">{member.name}</p>
                      <p className="text-[11px] text-on_surface_variant">ID: {member.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {member.icon}
                    <span className="text-[14px] text-on_surface">{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px]">
                  <div className="flex flex-col">
                    <span className="text-on_surface font-medium">{member.contact}</span>
                    <span className="text-[11px] text-on_surface_variant">{member.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-on_surface_variant">{member.lastActivity}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={member.status} type={member.statusType} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-on_surface_variant hover:text-primary p-2 transition-all active:scale-90">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-charcoal_border flex justify-between items-center bg-surface_container_low/30">
        <p className="text-[12px] text-on_surface_variant">Affichage de 4 sur 124 employés</p>
        <div className="flex gap-2">
          <PaginationButton icon={<ChevronLeft size={18} />} disabled />
          <PaginationButton label="1" active />
          <PaginationButton label="2" />
          <PaginationButton label="3" />
          <PaginationButton icon={<ChevronRight size={18} />} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, type }: { status: string; type: string }) {
  const styles = {
    success: "bg-success_green/10 text-success_green border-success_green/20",
    warning: "bg-tertiary/10 text-tertiary border-tertiary/20",
    neutral: "bg-surface_container_high text-on_surface_variant border-charcoal_border",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[type as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

function PaginationButton({ icon, label, active = false, disabled = false }: { icon?: React.ReactNode; label?: string; active?: boolean; disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
        active 
          ? "bg-primary text-on_primary border-primary shadow-md" 
          : "border-charcoal_border text-on_surface_variant hover:bg-surface_container_high disabled:opacity-30"
      }`}
    >
      {icon || <span className="text-[13px] font-bold">{label}</span>}
    </button>
  );
}
