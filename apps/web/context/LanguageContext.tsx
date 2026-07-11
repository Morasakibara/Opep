'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  // Persist language preference to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('opep-language') as Language | null;
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('opep-language', lang);
  }, []);

  const t = useCallback((key: string) => {
    // Dynamic import of translations to keep context small
    // We use a simple inline lookup with fallback
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'nav.dashboard': 'Tableau de bord',
        'nav.agencies': 'Agences',
        'nav.trips': 'Voyages',
        'nav.buses': 'Bus',
        'nav.staff': 'Personnel',
        'nav.reports': 'Rapports',
        'nav.settings': 'Paramètres',
        'nav.help': "Centre d'aide",
        'nav.reservations': 'Réservations',
        'nav.tickets': 'Tickets',
        'nav.payments': 'Paiements',
        'nav.subscriptions': 'Abonnements',
        'nav.incidents': 'Incidents',
        'nav.scanner': 'Scanner QR',
        'nav.tracking': 'Suivi GPS',
        'nav.notifications': 'Notifications',
        'nav.profile': 'Profil',
        'nav.admin': 'Administration',
        'nav.companies': 'Compagnies',
        'nav.centers': 'Centres',
        'nav.drivers': 'Chauffeurs',
        'header.search': 'Rechercher...',
        'header.logout': 'Déconnexion',
        'header.notifications': 'Notifications',
        'header.profile': 'Mon profil',
        'header.language': 'Langue',
        'dashboard.revenue': 'Revenu total',
        'dashboard.health': 'Santé du système',
        'dashboard.active_users': 'Utilisateurs actifs',
        'staff.add': "Ajouter un employé",
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.view_all': 'Voir tout',
        'common.loading': 'Chargement...',
        'common.search': 'Rechercher',
        'common.back': 'Retour',
        'common.delete': 'Supprimer',
        'common.edit': 'Modifier',
        'common.create': 'Créer',
        'common.export': 'Exporter',
        'common.filter': 'Filtrer',
        'common.retry': 'Réessayer',
        'auth.logout': 'Déconnexion',
        'auth.login': 'Se connecter',
        'auth.register': "S'inscrire",
        'settings.title': 'Paramètres',
        'settings.language': 'Langue',
        'settings.theme': 'Thème',
        'settings.dark': 'Sombre',
        'settings.light': 'Clair',
        'settings.system': 'Système',
      },
      en: {
        'nav.dashboard': 'Dashboard',
        'nav.agencies': 'Agencies',
        'nav.trips': 'Trips',
        'nav.buses': 'Buses',
        'nav.staff': 'Staff',
        'nav.reports': 'Reports',
        'nav.settings': 'Settings',
        'nav.help': 'Help Center',
        'nav.reservations': 'Reservations',
        'nav.tickets': 'Tickets',
        'nav.payments': 'Payments',
        'nav.subscriptions': 'Subscriptions',
        'nav.incidents': 'Incidents',
        'nav.scanner': 'QR Scanner',
        'nav.tracking': 'GPS Tracking',
        'nav.notifications': 'Notifications',
        'nav.profile': 'Profile',
        'nav.admin': 'Administration',
        'nav.companies': 'Companies',
        'nav.centers': 'Centers',
        'nav.drivers': 'Drivers',
        'header.search': 'Search...',
        'header.logout': 'Logout',
        'header.notifications': 'Notifications',
        'header.profile': 'My profile',
        'header.language': 'Language',
        'dashboard.revenue': 'Total Revenue',
        'dashboard.health': 'System Health',
        'dashboard.active_users': 'Active Users',
        'staff.add': 'Add Employee',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.view_all': 'View All',
        'common.loading': 'Loading...',
        'common.search': 'Search',
        'common.back': 'Back',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.create': 'Create',
        'common.export': 'Export',
        'common.filter': 'Filter',
        'common.retry': 'Retry',
        'auth.logout': 'Logout',
        'auth.login': 'Login',
        'auth.register': 'Register',
        'settings.title': 'Settings',
        'settings.language': 'Language',
        'settings.theme': 'Theme',
        'settings.dark': 'Dark',
        'settings.light': 'Light',
        'settings.system': 'System',
      },
    };

    return translations[language]?.[key] || translations['fr']?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
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
