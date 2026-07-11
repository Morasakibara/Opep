'use client';

import React from 'react';

export interface SidebarItem {
  icon: string;
  label: string;
  href?: string;
  active?: boolean;
}

interface SidebarProps {
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  items: SidebarItem[];
  activeIndex?: number;
  onNavChange?: (index: number) => void;
  bottomItems?: SidebarItem[];
  ctaButton?: {
    icon: string;
    label: string;
    onClick: () => void;
  };
}

export default function Sidebar({
  logo,
  title = 'OPEP Admin',
  subtitle = 'Management Portal',
  items,
  activeIndex = 0,
  onNavChange,
  bottomItems = [],
  ctaButton,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface-dim border-r border-charcoal-border flex flex-col p-gutter gap-unit z-50 hidden md:flex">
      <div className="flex items-center gap-3 px-2 py-4">
        {logo || (
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl">O</div>
        )}
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary text-[20px] leading-tight">{title}</h1>
          <p className="text-on-surface-variant font-label-caps text-label-caps">{subtitle}</p>
        </div>
      </div>

      {ctaButton && (
        <button
          className="mt-4 mb-6 w-full py-3 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          onClick={ctaButton.onClick}
        >
          <span className="material-symbols-outlined">{ctaButton.icon}</span>
          <span>{ctaButton.label}</span>
        </button>
      )}

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href || '#'}
            onClick={(e) => {
              e.preventDefault();
              onNavChange?.(i);
            }}
            className={`flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps rounded-lg transition-all ${
              i === activeIndex
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined" style={i === activeIndex ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="border-t border-charcoal-border pt-4 flex flex-col gap-1">
        {bottomItems.map((item, i) => (
          <a
            key={i}
            href={item.href || '#'}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
