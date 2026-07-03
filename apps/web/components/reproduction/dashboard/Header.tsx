import React from 'react';
import { Search, Languages, Bell, Settings } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 h-16 w-full sticky top-0 z-40 bg-surface_container border-b border-charcoal_border">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
          <input 
            className="w-full bg-surface_dim border border-charcoal_border rounded-full py-2 pl-10 pr-4 text-[14px] focus:border-primary focus:ring-0 outline-none placeholder:text-on_surface_variant/50" 
            placeholder="Search agencies, transactions, or users..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4 text-on_surface_variant">
          <Languages size={20} className="cursor-pointer hover:text-primary transition-colors" />
          <div className="relative cursor-pointer group">
            <Bell size={20} className="group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary border-2 border-surface_container rounded-full"></span>
          </div>
          <Settings size={20} className="cursor-pointer hover:text-primary transition-colors" />
        </div>
        
        <div className="h-8 w-[1px] bg-charcoal_border"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-bold text-on_surface group-hover:text-primary transition-colors">Super Admin</p>
            <p className="text-[10px] text-on_surface_variant uppercase tracking-tighter">System Root</p>
          </div>
          <Image width={40} height={40} className="rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmBdqacwmem2UtgDTYLm0IAU77_Pbm_HHJEJTdZC1XHz8v6oiD-ltbr0sfgsCKqUTHwAYbSq1PqIurIvUR-OmYkvWzmWbRsnKrhvr2FQiZXHpHYBKFFajaKBGgoXKSBQLXjNWGfUR5b6yfzuXsChkcf2HY9lu8MeFXi0cyizr5XMCUkot71dEweWOa3Hpo1dw4OROx4gOYdQkV9mDunOWpvzTQwiLgq6eTZKXEAZwr-Pq0nTWg3yf54KrpxMVSdyC0dCoXzh5qlU" alt="User profile" />
        </div>
      </div>
    </header>
  );
}
