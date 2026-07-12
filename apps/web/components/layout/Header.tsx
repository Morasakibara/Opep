'use client';
import Image from 'next/image';

import React from 'react';
import { Search, Globe, Bell, Settings, LogOut } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title?: string;
  placeholder?: string;
}

export default function Header({ 
  title = "Super Admin", 
  placeholder = "header.search" 
}: HeaderProps) {
  const locale = useLocale() as 'fr' | 'en';
  const t = useTranslations();
  const searchPlaceholder = placeholder.includes('.') && !placeholder.includes(' ')
    ? t(placeholder)
    : placeholder;

  const toggleLanguage = () => {
    const newLang = locale === 'fr' ? 'en' : 'fr';
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };
  const { logout, user } = useAuth();

  return (
    <header className="flex justify-between items-center px-8 h-16 w-full sticky top-0 z-40 bg-surface_container/80 backdrop-blur-md border-b border-charcoal_border">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
          <input 
            className="w-full bg-surface_dim border border-charcoal_border rounded-full py-2 pl-10 pr-4 text-[14px] focus:border-primary focus:ring-0 outline-none placeholder:text-on_surface_variant/50 text-on_surface" 
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4 items-center text-on_surface_variant">
          <ThemeToggle />
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 hover:text-primary transition-all group px-2 py-1 rounded-lg bg-surface_container_high"
            title="Toggle Language"
          >
            <Globe size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] font-bold uppercase">{locale}</span>
          </button>
          
          <NotificationCenter />
          
          <button onClick={logout} className="p-2.5 rounded-full hover:bg-error_red/10 hover:text-error_red transition-all" title={t('header.logout')}>
            <LogOut size={20} />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-charcoal_border"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-bold text-on_surface group-hover:text-primary transition-colors">{user?.name || title}</p>
            <p className="text-[10px] text-on_surface_variant uppercase tracking-tighter">{user?.role || 'System Root'}</p>
          </div>
          <Image width={40} height={40} className="rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmBdqacwmem2UtgDTYLm0IAU77_Pbm_HHJEJTdZC1XHz8v6oiD-ltbr0sfgsCKqUTHwAYbSq1PqIurIvUR-OmYkvWzmWbRsnKrhvr2FQiZXHpHYBKFFajaKBGgoXKSBQLXjNWGfUR5b6yfzuXsChkcf2HY9lu8MeFXi0cyizr5XMCUkot71dEweWOa3Hpo1dw4OROx4gOYdQkV9mDunOWpvzTQwiLgq6eTZKXEAZwr-Pq0nTWg3yf54KrpxMVSdyC0dCoXzh5qlU" alt="User profile" />
        </div>
      </div>
    </header>
  );
}
