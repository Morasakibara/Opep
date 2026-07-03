'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY = {
  fr: {
    'nav.dashboard': 'Tableau de Bord',
    'nav.agencies': 'Agences',
    'nav.trips': 'Voyages',
    'nav.buses': 'Bus',
    'nav.staff': 'Personnel',
    'nav.analytics': 'Analytiques',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.help': 'Centre d\'Aide',
    'header.search': 'Rechercher...',
    'header.logout': 'Déconnexion',
    'header.notifications': 'Notifications',
    'dashboard.revenue': 'Revenu Total',
    'dashboard.health': 'Santé du Système',
    'dashboard.active_users': 'Utilisateurs Actifs',
    'staff.add': 'Ajouter un Employé',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.view_all': 'Voir Tout',
    'common.loading': 'Chargement...',
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.agencies': 'Agencies',
    'nav.trips': 'Trips',
    'nav.buses': 'Buses',
    'nav.staff': 'Staff',
    'nav.analytics': 'Analytics',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.help': 'Help Center',
    'header.search': 'Search...',
    'header.logout': 'Logout',
    'header.notifications': 'Notifications',
    'dashboard.revenue': 'Total Revenue',
    'dashboard.health': 'System Health',
    'dashboard.active_users': 'Active Users',
    'staff.add': 'Add Employee',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.view_all': 'View All',
    'common.loading': 'Loading...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string) => {
    return (DICTIONARY[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // During SSR/SSG, return safe fallback values
      return {
        language: 'fr' as Language,
        setLanguage: () => {},
        t: (key: string) => key,
      };
    }
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
